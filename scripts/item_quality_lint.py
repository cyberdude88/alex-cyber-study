#!/usr/bin/env python3
"""Quality lint for CAT items (ambiguity quality + psychometric hygiene).

Purpose:
- Flag weak item-writing patterns before items enter CAT scoring pool.
- Provide a deterministic quality score and prioritized findings.

Notes:
- This is a lint layer, not ground-truth validation.
- By default, warnings do not fail CI; only errors do.
"""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

ABSOLUTE_TERMS = {
    "always",
    "never",
    "only",
    "all",
    "none",
    "must",
    "cannot",
    "impossible",
    "guaranteed",
    "completely",
    "entirely",
}

NEGATIVE_PATTERNS = [
    re.compile(r"\bNOT\b"),
    re.compile(r"\bEXCEPT\b"),
    re.compile(r"\bLEAST\b"),
    re.compile(r"\bFALSE\b"),
]

CUE_PATTERNS = [
    re.compile(r"\ball of the above\b", re.I),
    re.compile(r"\bnone of the above\b", re.I),
    re.compile(r"\bboth [A-D] and [A-D]\b", re.I),
]

DECISION_WORDS = {
    "best",
    "most",
    "first",
    "priority",
    "appropriate",
    "primary",
    "next",
    "should",
}

CONTEXT_WORDS = {
    "organization",
    "enterprise",
    "ciso",
    "board",
    "business",
    "risk",
    "regulatory",
    "vendor",
    "incident",
    "federal",
    "privacy",
    "security",
    "management",
}

ROLE_WORDS = {
    "ciso",
    "auditor",
    "analyst",
    "engineer",
    "administrator",
    "manager",
    "developer",
    "team",
    "organization",
}

WORD_RE = re.compile(r"[A-Za-z0-9']+")


def words(text: str) -> list[str]:
    return WORD_RE.findall(text.lower())


def norm_text(text: str) -> str:
    return " ".join(words(text))


def has_negative_stem(stem: str) -> bool:
    return any(p.search(stem) for p in NEGATIVE_PATTERNS)


def choice_length_stats(choices: list[str]) -> tuple[int, int, float]:
    lengths = [len(c.strip()) for c in choices if isinstance(c, str)]
    if not lengths:
        return 0, 0, 0.0
    return min(lengths), max(lengths), sum(lengths) / len(lengths)


def lexical_overlap(a: str, b: str) -> float:
    wa = {w for w in words(a) if len(w) > 2}
    wb = {w for w in words(b) if len(w) > 2}
    if not wa or not wb:
        return 0.0
    return len(wa & wb) / max(1, len(wb))


def add_finding(
    findings: list[dict[str, str]],
    level: str,
    kind: str,
    item: str,
    message: str,
) -> None:
    findings.append({"level": level, "kind": kind, "item": item, "message": message})


def item_quality(item: dict[str, Any], idx: int, profile: str = "human") -> tuple[int, list[dict[str, str]]]:
    findings: list[dict[str, str]] = []
    score = 100

    iid = str(item.get("id") or idx)
    stem = str(item.get("stem") or "")
    choices = item.get("choices") if isinstance(item.get("choices"), list) else []
    explanation = str(item.get("explanation") or "")
    ci = item.get("correctIndex")

    if not stem.strip():
        add_finding(findings, "error", "missing_stem", iid, "Missing stem.")
        score -= 60

    if not choices or len(choices) < 2:
        add_finding(findings, "error", "invalid_choices", iid, "Missing or invalid choices.")
        score -= 60

    if not isinstance(ci, int) or ci < 0 or ci >= len(choices):
        add_finding(findings, "error", "invalid_correct_index", iid, "Invalid correctIndex.")
        score -= 60

    stem_words = words(stem)
    stem_wc = len(stem_words)
    if stem_wc < 10:
        add_finding(findings, "warning" if profile == "strict" else "info", "stem_too_short", iid, "Stem is very short; may test recall only.")
        score -= 8
    elif stem_wc > 120:
        add_finding(findings, "warning" if profile == "strict" else "info", "stem_too_long", iid, "Stem is very long; may add reading-load noise.")
        score -= 5

    if has_negative_stem(stem):
        add_finding(findings, "warning", "negative_stem", iid, "Negative stem wording (NOT/EXCEPT/LEAST) can increase construct-irrelevant difficulty.")
        score -= 7

    absolute_hits = sorted({w for w in stem_words if w in ABSOLUTE_TERMS})
    if absolute_hits:
        add_finding(findings, "warning" if profile == "strict" else "info", "absolute_wording", iid, f"Absolute wording in stem: {', '.join(absolute_hits)}.")
        score -= 4

    normalized_choices = [norm_text(str(c)) for c in choices]
    dup_counts = Counter(normalized_choices)
    dups = [c for c, n in dup_counts.items() if c and n > 1]
    if dups:
        add_finding(findings, "error", "duplicate_choices", iid, "Duplicate or near-identical choices detected.")
        score -= 35

    for c in choices:
        c_str = str(c)
        if any(p.search(c_str) for p in CUE_PATTERNS):
            add_finding(findings, "warning", "testwise_cue", iid, "Choice uses test-wise cue wording (all/none of the above, etc.).")
            score -= 8
            break

    cmin, cmax, cavg = choice_length_stats([str(c) for c in choices])
    if cavg > 0 and cmax > (cavg * 2.8):
        add_finding(findings, "warning", "choice_length_outlier", iid, "One choice is much longer than peers (possible cueing).")
        score -= 7
    if cmin > 0 and cmin < 12:
        add_finding(findings, "warning" if profile == "strict" else "info", "very_short_distractor", iid, "At least one choice is very short compared to exam style.")
        score -= 4

    if isinstance(ci, int) and 0 <= ci < len(choices):
        correct_overlap = lexical_overlap(stem, str(choices[ci]))
        distractor_overlaps = [lexical_overlap(stem, str(c)) for i, c in enumerate(choices) if i != ci]
        avg_dist = sum(distractor_overlaps) / max(1, len(distractor_overlaps))
        if correct_overlap - avg_dist > 0.35:
            add_finding(findings, "warning" if profile == "strict" else "info", "keyword_cueing", iid, "Correct answer has much higher stem keyword overlap than distractors.")
            score -= 6

    exp_wc = len(words(explanation))
    if exp_wc < 20:
        add_finding(findings, "warning", "thin_explanation", iid, "Explanation is too brief for defensible rationale.")
        score -= 7

    qtype = str(item.get("questionType") or "scenario")
    judgment = item.get("judgmentLevel")
    if qtype == "judgment" and (not isinstance(judgment, int) or judgment < 2):
        add_finding(findings, "warning", "judgment_level_low", iid, "Judgment item has low judgmentLevel metadata.")
        score -= 5

    # Ambiguity quality bonus: scenario context + managerial decision framing.
    stem_set = set(stem_words)
    context_hits = len(stem_set & CONTEXT_WORDS)
    decision_hits = len(stem_set & DECISION_WORDS)
    role_hits = len(stem_set & ROLE_WORDS)
    if context_hits >= 3:
        score += 2
    if decision_hits >= 1:
        score += 2
    if role_hits >= 1:
        score += 1

    # Human-feel profile based on real exam-style review screenshots:
    # role + scenario context + decision framing ("BEST/NEXT/FIRST/most appropriate")
    # should be present often enough to test judgment, not just recall.
    if profile == "human":
        if role_hits == 0:
            add_finding(findings, "info", "missing_actor_context", iid, "Stem may feel generic; consider role-based actor context.")
        if decision_hits == 0:
            add_finding(findings, "info", "missing_decision_prompt", iid, "Stem may feel recall-heavy; consider a best/next/first decision prompt.")

    score = max(0, min(100, score))
    return score, findings


def lint(bank: dict[str, Any], profile: str = "human") -> dict[str, Any]:
    items = bank.get("items")
    if not isinstance(items, list):
        return {
            "item_count": 0,
            "error_count": 1,
            "warning_count": 0,
            "average_quality_score": 0.0,
            "findings": [
                {
                    "level": "error",
                    "kind": "invalid_schema",
                    "item": "bank",
                    "message": "Top-level 'items' must be a list.",
                }
            ],
            "item_scores": [],
        }

    findings: list[dict[str, str]] = []
    scores: list[dict[str, Any]] = []

    for i, item in enumerate(items, start=1):
        score, item_findings = item_quality(item, i, profile=profile)
        iid = str(item.get("id") or i)
        scores.append({
            "item": iid,
            "quality_score": score,
            "domain": item.get("domain"),
            "questionType": item.get("questionType", "scenario"),
            "pilotEligible": bool(item.get("pilotEligible", False)),
        })
        findings.extend(item_findings)

    scores_sorted = sorted(scores, key=lambda x: x["quality_score"])
    avg_score = sum(s["quality_score"] for s in scores) / max(1, len(scores))

    return {
        "item_count": len(items),
        "profile": profile,
        "error_count": sum(1 for f in findings if f["level"] == "error"),
        "warning_count": sum(1 for f in findings if f["level"] == "warning"),
        "info_count": sum(1 for f in findings if f["level"] == "info"),
        "average_quality_score": round(avg_score, 2),
        "low_quality_items": scores_sorted[:50],
        "findings": findings,
        "item_scores": scores,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("bank_json", type=Path)
    parser.add_argument("--write-report", type=Path)
    parser.add_argument("--fail-on-warning", action="store_true")
    parser.add_argument("--profile", choices=["human", "strict"], default="human")
    args = parser.parse_args()

    bank = json.loads(args.bank_json.read_text(encoding="utf-8"))
    report = lint(bank, profile=args.profile)

    if args.write_report:
        args.write_report.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(
        "SUMMARY:",
        json.dumps(
            {
                "item_count": report["item_count"],
                "profile": report["profile"],
                "average_quality_score": report["average_quality_score"],
                "error_count": report["error_count"],
                "warning_count": report["warning_count"],
                "info_count": report["info_count"],
            },
            ensure_ascii=False,
        ),
    )

    if report["low_quality_items"]:
        print("LOWEST_QUALITY_SAMPLE:", json.dumps(report["low_quality_items"][:10], ensure_ascii=False))

    if report["error_count"]:
        return 1
    if args.fail_on_warning and report["warning_count"]:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
