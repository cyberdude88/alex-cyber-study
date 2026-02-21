#!/usr/bin/env python3
"""Lightweight factual-consistency audit for CAT question bank explanations.

This does not prove correctness against all standards, but catches high-risk mismatches
between answer keys and explanation text.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

OPTION_RE = re.compile(r"\bOption\s+([1-9][0-9]?)\s+is\s+correct\b", re.I)
CORRECT_ANSWER_RE = re.compile(r"\bCorrect\s+Answer\s*:\s*(.+?)(?:\.\s|$)", re.I)
MULTI_ANSWER_RE = re.compile(r"\bcorrect\s+answers?\s+are\s+options?\b", re.I)
GDPR_DISCOVERY_RE = re.compile(r"\bgdpr\b", re.I)
DISCOVERY_RE = re.compile(r"\bfrom\s+discovery\b", re.I)


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())


def audit(items: list[dict[str, Any]], strict_text_match: bool = False) -> dict[str, Any]:
    findings: list[dict[str, Any]] = []

    for idx, item in enumerate(items, start=1):
        iid = str(item.get("id") or idx)
        choices = item.get("choices") if isinstance(item.get("choices"), list) else []
        ci = item.get("correctIndex")
        explanation = str(item.get("explanation") or "")
        stem = str(item.get("stem") or "")

        if MULTI_ANSWER_RE.search(explanation):
            findings.append({
                "level": "error",
                "item": iid,
                "kind": "multi_answer_phrase",
                "message": "Explanation suggests multiple correct options in single-answer MCQ.",
            })

        m = OPTION_RE.search(explanation)
        if m and isinstance(ci, int):
            explained_opt = int(m.group(1)) - 1
            if explained_opt != ci:
                findings.append({
                    "level": "error",
                    "item": iid,
                    "kind": "option_number_mismatch",
                    "message": f"Explanation says Option {explained_opt + 1} but correctIndex is {ci + 1}.",
                })

        if strict_text_match:
            m2 = CORRECT_ANSWER_RE.search(explanation)
            if m2 and isinstance(ci, int) and 0 <= ci < len(choices):
                explained_text = norm(m2.group(1))
                correct_choice = norm(str(choices[ci]))
                # Lenient containment check to avoid false positives from paraphrases.
                if explained_text and correct_choice and (explained_text not in correct_choice and correct_choice not in explained_text):
                    findings.append({
                        "level": "warning",
                        "item": iid,
                        "kind": "correct_answer_text_mismatch",
                        "message": "Correct Answer text does not closely match answer key choice text.",
                    })

        if GDPR_DISCOVERY_RE.search(stem + " " + explanation) and DISCOVERY_RE.search(explanation):
            findings.append({
                "level": "warning",
                "item": iid,
                "kind": "gdpr_awareness_wording",
                "message": "GDPR wording uses 'from discovery'; Article 33 standard is from awareness.",
            })

    return {
        "item_count": len(items),
        "error_count": sum(1 for f in findings if f["level"] == "error"),
        "warning_count": sum(1 for f in findings if f["level"] == "warning"),
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("bank_json", type=Path)
    parser.add_argument("--write-report", type=Path)
    parser.add_argument("--strict-text-match", action="store_true")
    args = parser.parse_args()

    bank = json.loads(args.bank_json.read_text(encoding="utf-8"))
    items = bank.get("items")
    if not isinstance(items, list):
        raise SystemExit("Top-level 'items' must be a list")

    report = audit(items, strict_text_match=args.strict_text_match)

    if args.write_report:
        args.write_report.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    for f in report["findings"]:
        print(f"{f['level'].upper()}: [{f['item']}] {f['kind']} - {f['message']}")
    print(
        "SUMMARY:",
        json.dumps(
            {
                "item_count": report["item_count"],
                "error_count": report["error_count"],
                "warning_count": report["warning_count"],
            },
            ensure_ascii=False,
        ),
    )
    return 1 if report["error_count"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
