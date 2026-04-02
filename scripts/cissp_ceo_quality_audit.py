#!/usr/bin/env python3
"""
cissp_ceo_quality_audit.py

6-round quality pipeline ensuring CISSP questions reflect executive / CEO-level
thinking and contain intentionally plausible (not obviously wrong) distractors.

CISSP philosophy
----------------
The correct answer is what a risk-aware security executive (CISO-level) would
decide — NOT what a technical practitioner would do.
  • Governance > implementation
  • Risk-based decision-making
  • Policy before technology
  • Communication before action
  • People → Process → Technology hierarchy
  • Long-term program over quick fix

Rounds
------
1. Structural         — schema, lengths, required fields, duplicate choices
2. CEO Mindset        — heuristic: management context vs. technical recall
3. Cognitive Level    — classify recall / application / analysis / judgment
4. Distractor Auth    — are wrong answers intentionally plausible traps?
5. Explanation Depth  — does the rationale justify from a governance angle?
6. Peer Review        — does the item read like a human-written exam question?

Output
------
  <bank>-ceo-audited.json      bank with quality tags added per item
  ceo_audit_report.json        full per-item findings
  ceo_audit_summary.md         human-readable summary + ranked weak items

Usage
-----
  python3 cissp_ceo_quality_audit.py
  python3 cissp_ceo_quality_audit.py --bank ../cat/question-bank.augmented.json
  python3 cissp_ceo_quality_audit.py --rounds 2 4        # run only rounds 2 and 4
  python3 cissp_ceo_quality_audit.py --threshold 55      # flag items scoring <55
  python3 cissp_ceo_quality_audit.py --domain "1. Security and Risk Management"
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

# ──────────────────────────────────────────────────────────────────────────────
# Vocabulary banks
# ──────────────────────────────────────────────────────────────────────────────

# Stem signals that indicate management/executive framing
MGMT_STEM = {
    "policy", "governance", "compliance", "risk", "audit", "oversight",
    "framework", "program", "strategy", "management", "executive", "board",
    "stakeholder", "budget", "initiative", "roadmap", "enterprise", "business",
    "regulatory", "legal", "contractual", "accountability", "ownership",
    "stewardship", "ciso", "ceo", "cfo", "cto", "director", "manager",
    "committee", "charter", "mandate", "due", "diligence", "care",
    "communication", "report", "escalate", "notify", "present", "brief",
    "prioritize", "recommend", "advise", "approve", "endorse",
    "objective", "mission", "vision", "strategic", "tactical", "operational",
}

# Stem signals that indicate purely technical framing (penalise)
TECH_STEM = {
    "configure", "install", "patch", "firewall", "router", "switch",
    "port", "protocol", "algorithm", "encrypt", "hash", "certificate",
    "syntax", "command", "scan", "packet", "kernel", "daemon",
    "registry", "binary", "hex", "iptables", "subnet", "vlan",
    "cli", "api", "endpoint", "payload", "exploit", "buffer",
    "overrun", "injection", "shellcode", "rootkit",
}

# Correct-answer signals that confirm governance-level thinking
GOVERN_ANSWER = {
    "policy", "procedure", "framework", "audit", "management", "oversight",
    "governance", "communicate", "report", "escalate", "notify", "stakeholder",
    "board", "review", "approve", "assess", "evaluate", "risk", "business",
    "enterprise", "program", "standard", "baseline", "roadmap", "strategy",
    "guideline", "charter", "mandate", "ownership", "accountability",
    "awareness", "training", "culture", "due", "diligence", "care",
    "legal", "regulatory", "compliance", "contractual", "liability",
}

# Correct-answer signals that suggest technical-only answers (penalise when stem
# is management-focused — they're usually the trap distractors, not the key)
TECH_ANSWER_PENALTY = {
    "configure", "install", "deploy", "patch", "enable", "disable",
    "block", "allow", "deny", "encrypt", "scan", "firewall", "route",
    "update", "restart", "reboot", "reinstall",
}

# Stems that scream "recall / definition" question (penalise)
RECALL_STEMS = [
    re.compile(r"\bwhat is\b", re.I),
    re.compile(r"\bwhat are\b", re.I),
    re.compile(r"\bwhich of the following (is|are) (a|an|the)\b", re.I),
    re.compile(r"\bwhich of the following defines\b", re.I),
    re.compile(r"\bwhich term\b", re.I),
    re.compile(r"\bwhat does .{1,30} stand for\b", re.I),
    re.compile(r"\bdefined as\b", re.I),
    re.compile(r"\bthe definition of\b", re.I),
]

# Qualifiers that signal judgment / prioritisation (reward)
JUDGMENT_QUALIFIERS = re.compile(
    r"\b(BEST|MOST APPROPRIATE|MOST IMPORTANT|MOST EFFECTIVE|FIRST|NEXT|"
    r"PRIMARY|INITIALLY|PRIMARILY|GREATEST|HIGHEST|CRITICAL|OPTIMAL|"
    r"MOST LIKELY|MOST SUITABLE|LEAST)\b",
    re.I,
)

# References to real standards / frameworks in explanations (reward)
STANDARD_REFS = re.compile(
    r"\b(NIST|ISO|ISC2|ISC\s*2|CIS|COBIT|ITIL|PCI|GDPR|HIPAA|SOX|FISMA|"
    r"FedRAMP|GLBA|FERPA|800-\d+|27001|31000|SP\s*800)\b",
    re.I,
)

# Distractor red-flags: answers that are obviously non-answers
WEAK_DISTRACTOR_PATTERNS = [
    re.compile(r"\bdo nothing\b", re.I),
    re.compile(r"\bignore (it|the|this)\b", re.I),
    re.compile(r"\bcall (the )?vendor\b", re.I),
    re.compile(r"\breboot\b", re.I),
    re.compile(r"\breinstall\b", re.I),
    re.compile(r"\bno action\b", re.I),
    re.compile(r"\bnot applicable\b", re.I),
]

WORD_RE = re.compile(r"[A-Za-z0-9']+")
NEGATIVE_STEM_RE = re.compile(r"\b(NOT|EXCEPT|LEAST|NEVER|FALSE)\b", re.I)
ABSOLUTE_WORDS = {"always", "never", "only", "must", "completely", "eliminate"}
SCENARIO_SIGNALS = re.compile(
    r"\b(organization|company|enterprise|team|ciso|board|manager|architect|"
    r"auditor|analyst|department|business|program|review|assessment|incident|"
    r"breach|project|initiative|committee|executive|legal|vendor|developer)\b",
    re.I,
)
ACRONYM_RE = re.compile(r"\b[A-Z]{2,6}(?:\d{0,2})\b")


def _words(text: str) -> list[str]:
    return WORD_RE.findall(text.lower())


def _word_set(text: str) -> set[str]:
    return set(_words(text))


def _lexical_overlap(a: str, b: str) -> float:
    """Fraction of meaningful words in b that also appear in a."""
    wa = {w for w in _words(a) if len(w) > 3}
    wb = {w for w in _words(b) if len(w) > 3}
    if not wb:
        return 0.0
    return len(wa & wb) / len(wb)


# ──────────────────────────────────────────────────────────────────────────────
# Round 1 — Structural integrity
# ──────────────────────────────────────────────────────────────────────────────

def round1_structural(item: dict[str, Any]) -> dict[str, Any]:
    flags: list[str] = []
    score = 100

    stem = str(item.get("stem") or "")
    choices = item.get("choices") if isinstance(item.get("choices"), list) else []
    explanation = str(item.get("explanation") or "")
    ci = item.get("correctIndex")
    domain = str(item.get("domain") or "")

    if not stem.strip():
        flags.append("MISSING_STEM")
        score -= 50

    if len(choices) < 4:
        flags.append(f"TOO_FEW_CHOICES:{len(choices)}")
        score -= 30
    elif len(choices) > 4:
        flags.append(f"TOO_MANY_CHOICES:{len(choices)}")
        score -= 5

    if not isinstance(ci, int) or ci < 0 or ci >= len(choices):
        flags.append("INVALID_CORRECT_INDEX")
        score -= 40

    stem_wc = len(_words(stem))
    if stem_wc < 15:
        flags.append("STEM_TOO_SHORT")
        score -= 15
    elif stem_wc > 150:
        flags.append("STEM_TOO_LONG")
        score -= 5

    if not explanation.strip():
        flags.append("MISSING_EXPLANATION")
        score -= 25
    elif len(_words(explanation)) < 25:
        flags.append("EXPLANATION_TOO_SHORT")
        score -= 15

    if not domain.strip():
        flags.append("MISSING_DOMAIN")
        score -= 10

    # Duplicate choices
    norm_choices = [" ".join(_words(str(c))) for c in choices]
    if len(norm_choices) != len(set(norm_choices)):
        flags.append("DUPLICATE_CHOICES")
        score -= 30

    # Test-wiseness cues
    for c in choices:
        if re.search(r"\b(all of the above|none of the above)\b", str(c), re.I):
            flags.append("TESTWISE_CUE")
            score -= 10
            break

    return {"score": max(0, score), "flags": flags, "pass": score >= 70}


# ──────────────────────────────────────────────────────────────────────────────
# Round 2 — CEO Mindset Score
# ──────────────────────────────────────────────────────────────────────────────

def round2_ceo_mindset(item: dict[str, Any]) -> dict[str, Any]:
    """
    Score 0-100 reflecting how well the question tests executive / CEO thinking.

    High score: management decision, risk-based, governance context, ambiguous
                best-answer requiring judgment.
    Low score:  technical recall, definition-based, one obviously correct answer,
                correct answer is a technical configuration action.
    """
    flags: list[str] = []
    score = 50  # neutral baseline

    stem = str(item.get("stem") or "")
    choices = item.get("choices") if isinstance(item.get("choices"), list) else []
    ci = item.get("correctIndex")
    qtype = str(item.get("questionType") or "scenario")
    jlevel = item.get("judgmentLevel") or 1
    difficulty = item.get("difficulty") or 0.0

    stem_words = _word_set(stem)
    correct_text = str(choices[ci]) if isinstance(ci, int) and 0 <= ci < len(choices) else ""
    correct_words = _word_set(correct_text)

    # ── Stem analysis ──
    mgmt_hits = stem_words & MGMT_STEM
    tech_hits = stem_words & TECH_STEM
    mgmt_bonus = min(20, len(mgmt_hits) * 4)
    tech_penalty = min(25, len(tech_hits) * 5)
    score += mgmt_bonus
    score -= tech_penalty
    if mgmt_hits:
        flags.append(f"MGMT_CONTEXT:{','.join(sorted(mgmt_hits)[:4])}")
    if tech_hits:
        flags.append(f"TECH_STEM:{','.join(sorted(tech_hits)[:3])}")

    # Recall/definition stem heavily penalised
    is_recall = any(p.search(stem) for p in RECALL_STEMS)
    if is_recall:
        score -= 20
        flags.append("RECALL_STEM")

    # Judgment qualifiers rewarded
    qualifiers = JUDGMENT_QUALIFIERS.findall(stem)
    if qualifiers:
        score += min(15, len(set(q.upper() for q in qualifiers)) * 5)
        flags.append(f"QUALIFIERS:{','.join(set(q.upper() for q in qualifiers))}")
    else:
        score -= 5
        flags.append("NO_QUALIFIER")

    # ── Correct answer analysis ──
    gov_hits = correct_words & GOVERN_ANSWER
    tech_ans_hits = correct_words & TECH_ANSWER_PENALTY
    if gov_hits:
        score += min(15, len(gov_hits) * 3)
        flags.append(f"GOVERN_ANSWER:{','.join(sorted(gov_hits)[:4])}")
    if tech_ans_hits and not gov_hits:
        # Purely technical correct answer for a management question = bad sign
        score -= 15
        flags.append(f"TECH_CORRECT_ANSWER:{','.join(sorted(tech_ans_hits)[:3])}")

    # ── questionType / judgmentLevel metadata ──
    if qtype == "judgment":
        score += 10
    elif qtype == "knowledge":
        score -= 10
        flags.append("KNOWLEDGE_TYPE")

    if isinstance(jlevel, (int, float)):
        score += int(jlevel - 1) * 5  # +0/+5/+10 for levels 1/2/3

    # ── Difficulty ──
    # Hard questions that have no management framing are suspicious
    if difficulty >= 0.7 and is_recall:
        score -= 10
        flags.append("HARD_RECALL_MISMATCH")

    ceo_pass = score >= 55
    if not ceo_pass:
        flags.append("CEO_MINDSET_FAIL")

    return {
        "score": max(0, min(100, score)),
        "flags": flags,
        "pass": ceo_pass,
        "mgmt_hits": sorted(mgmt_hits),
        "qualifiers_found": list(set(q.upper() for q in qualifiers)),
    }


# ──────────────────────────────────────────────────────────────────────────────
# Round 3 — Cognitive Level Classification
# ──────────────────────────────────────────────────────────────────────────────

def round3_cognitive_level(item: dict[str, Any]) -> dict[str, Any]:
    """
    Classify the item's cognitive demand:
      recall       — what is / define / which model
      application  — apply a control, select a framework
      analysis     — given scenario, evaluate options, compare approaches
      judgment     — ambiguous best-answer; multiple defensible choices

    Target distribution for CISSP hard questions:
      ≥60% analysis + judgment, ≤20% recall
    """
    stem = str(item.get("stem") or "")
    qtype = str(item.get("questionType") or "scenario")
    jlevel = item.get("judgmentLevel") or 1
    difficulty = item.get("difficulty") or 0.0
    choices = item.get("choices") if isinstance(item.get("choices"), list) else []
    ci = item.get("correctIndex")

    stem_lower = stem.lower()
    flags: list[str] = []

    # --- Recall indicators ---
    recall_score = 0
    for p in RECALL_STEMS:
        if p.search(stem):
            recall_score += 2
    if qtype == "knowledge":
        recall_score += 2
    if len(_words(stem)) < 20:
        recall_score += 1  # short stems often recall

    # --- Judgment indicators ---
    judgment_score = 0
    qualifiers = JUDGMENT_QUALIFIERS.findall(stem)
    judgment_score += len(set(q.upper() for q in qualifiers))
    if isinstance(jlevel, (int, float)) and jlevel >= 2:
        judgment_score += int(jlevel)
    if qtype == "judgment":
        judgment_score += 2

    # --- Scenario / analysis indicators ---
    analysis_score = 0
    scenario_keywords = re.compile(
        r"\b(organization|company|enterprise|scenario|incident|breach|"
        r"recently|discovered|notified|review|audit|assessment|found|"
        r"identified|during|after|following|investigating)\b",
        re.I,
    )
    analysis_score += len(scenario_keywords.findall(stem))
    if len(_words(stem)) > 40:
        analysis_score += 1  # longer stems usually have scenario context

    # --- Classify ---
    if recall_score >= 3 and judgment_score < 2:
        level = "recall"
        flags.append("RECALL_DOMINANT")
    elif judgment_score >= 3 or (jlevel >= 3 and qualifiers):
        level = "judgment"
    elif analysis_score >= 2 or (scenario_keywords.search(stem) and qualifiers):
        level = "analysis"
    else:
        level = "application"

    # Flag hard questions that are only recall or application
    if difficulty >= 0.7 and level in ("recall", "application"):
        flags.append(f"HARD_QUESTION_LOW_COGNITIVE:{level.upper()}")

    # Flag if assigned questionType disagrees with detected level
    type_map = {"knowledge": "recall", "scenario": "analysis", "judgment": "judgment"}
    expected = type_map.get(qtype)
    if expected and expected != level:
        flags.append(f"QTYPE_MISMATCH:assigned={qtype},detected={level}")

    # Choice ambiguity check: for judgment-level, choices should be roughly equal length
    if level == "judgment" and len(choices) == 4:
        lengths = [len(str(c)) for c in choices]
        if max(lengths) > min(lengths) * 3:
            flags.append("JUDGMENT_CHOICE_LENGTH_SKEW")

    return {"level": level, "flags": flags, "pass": level in ("analysis", "judgment")}


# ──────────────────────────────────────────────────────────────────────────────
# Round 4 — Distractor Authenticity
# ──────────────────────────────────────────────────────────────────────────────

def round4_distractor_auth(item: dict[str, Any]) -> dict[str, Any]:
    """
    CISSP wrong answers must be intentionally plausible traps — NOT obviously
    wrong options a test-taker could eliminate in 5 seconds.

    Good distractors:
      • Address the same domain/concept as the correct answer
      • Could be correct in a different context or sequence
      • Represent common failure modes (over-technical, wrong-order, wrong-role)
      • Are roughly equal in length and specificity to the correct answer

    Bad distractors (fail):
      • Obviously wrong ("do nothing", "ignore it", "reboot")
      • Trivially short compared to the correct answer
      • No semantic overlap with the stem (unrelated concept)
      • Exact wording from stem (clue-giver)
    """
    flags: list[str] = []
    choices = item.get("choices") if isinstance(item.get("choices"), list) else []
    ci = item.get("correctIndex")
    stem = str(item.get("stem") or "")

    if not isinstance(ci, int) or ci < 0 or ci >= len(choices):
        return {"score": 0, "flags": ["INVALID_STRUCTURE"], "pass": False, "distractor_issues": []}

    correct_text = str(choices[ci])
    wrong_answers = [(i, str(c)) for i, c in enumerate(choices) if i != ci]

    distractor_scores = []
    distractor_issues: list[str] = []

    for idx, choice_text in wrong_answers:
        d_score = 100
        issues = []
        letter = "ABCD"[idx]

        # Minimum length
        if len(choice_text.strip()) < 15:
            d_score -= 40
            issues.append(f"{letter}:TOO_SHORT")

        # Obvious non-answer patterns
        for p in WEAK_DISTRACTOR_PATTERNS:
            if p.search(choice_text):
                d_score -= 35
                issues.append(f"{letter}:OBVIOUS_WRONG_PATTERN")
                break

        # Semantic overlap with stem (should be > 0 — related to scenario)
        overlap_with_stem = _lexical_overlap(stem, choice_text)
        if overlap_with_stem < 0.05:
            d_score -= 20
            issues.append(f"{letter}:NO_STEM_OVERLAP")
        elif overlap_with_stem > 0.70:
            d_score -= 15
            issues.append(f"{letter}:STEM_CLUE_GIVER")

        # Length ratio vs. correct answer (should not be wildly shorter)
        len_ratio = len(choice_text) / max(1, len(correct_text))
        if len_ratio < 0.25:
            d_score -= 20
            issues.append(f"{letter}:MUCH_SHORTER_THAN_CORRECT")
        elif len_ratio > 3.0:
            d_score -= 10
            issues.append(f"{letter}:MUCH_LONGER_THAN_CORRECT")

        # Semantic overlap with correct answer (should be > 0 — same domain)
        overlap_with_correct = _lexical_overlap(correct_text, choice_text)
        if overlap_with_correct < 0.05:
            d_score -= 15
            issues.append(f"{letter}:UNRELATED_TO_CORRECT")

        # Contains governance/management vocabulary (plausible CISSP trap)
        choice_words = _word_set(choice_text)
        if choice_words & GOVERN_ANSWER:
            d_score += 10  # plausible — governance framing = good trap

        distractor_scores.append(max(0, d_score))
        distractor_issues.extend(issues)
        flags.extend(issues)

    avg_d_score = sum(distractor_scores) / max(1, len(distractor_scores))
    min_d_score = min(distractor_scores) if distractor_scores else 0

    # Penalise if any single distractor is terrible
    if min_d_score < 30:
        flags.append("HAS_WEAK_DISTRACTOR")

    d_pass = avg_d_score >= 60 and min_d_score >= 25

    return {
        "score": round(avg_d_score),
        "min_distractor_score": min_d_score,
        "flags": flags,
        "pass": d_pass,
        "distractor_issues": distractor_issues,
    }


# ──────────────────────────────────────────────────────────────────────────────
# Round 5 — Explanation Depth
# ──────────────────────────────────────────────────────────────────────────────

def round5_explanation(item: dict[str, Any]) -> dict[str, Any]:
    """
    The explanation must justify the correct answer from a governance /
    risk-management perspective, not just re-state the answer or provide
    a circular justification.

    Required:
      • Minimum 40 words
      • Contains a causal connector (because, since, therefore, ensures, etc.)
      • References at least one management/governance concept
      • Ideally references a framework or standard
      • Should NOT be a simple restatement of the stem or correct choice
    """
    flags: list[str] = []
    score = 100

    explanation = str(item.get("explanation") or "")
    stem = str(item.get("stem") or "")
    choices = item.get("choices") if isinstance(item.get("choices"), list) else []
    ci = item.get("correctIndex")
    correct_text = str(choices[ci]) if isinstance(ci, int) and 0 <= ci < len(choices) else ""

    exp_words = _words(explanation)
    exp_wc = len(exp_words)

    # Length
    if exp_wc < 25:
        flags.append("EXPLANATION_VERY_SHORT")
        score -= 40
    elif exp_wc < 50:
        flags.append("EXPLANATION_SHORT")
        score -= 20

    # Causal connectors
    causal = re.compile(
        r"\b(because|since|therefore|ensures|addresses|aligns|satisfies|"
        r"requires|establishes|provides|maintains|reduces|mitigates|"
        r"prevents|supports|enables|allows|demonstrates|confirms)\b",
        re.I,
    )
    if not causal.search(explanation):
        flags.append("NO_CAUSAL_CONNECTOR")
        score -= 15

    # Governance concept in explanation
    exp_word_set = _word_set(explanation)
    gov_hits = exp_word_set & GOVERN_ANSWER
    if not gov_hits:
        flags.append("NO_GOVERNANCE_CONCEPT")
        score -= 15
    else:
        flags.append(f"GOV_CONCEPTS:{','.join(sorted(gov_hits)[:4])}")

    # Standard / framework reference (bonus)
    if STANDARD_REFS.search(explanation):
        score += 10
        flags.append("HAS_STANDARD_REF")
    else:
        flags.append("NO_STANDARD_REF")

    # Circular reasoning check: explanation word set almost identical to correct answer
    if correct_text:
        overlap = _lexical_overlap(correct_text, explanation)
        if overlap > 0.75 and exp_wc < 40:
            flags.append("CIRCULAR_EXPLANATION")
            score -= 20

    # Does explanation mention why distractors are wrong? (positive signal)
    distractor_texts = [str(c) for i, c in enumerate(choices) if i != ci]
    distractor_mention = any(
        _lexical_overlap(d, explanation) > 0.3
        for d in distractor_texts
    )
    if distractor_mention:
        score += 5
        flags.append("EXPLAINS_DISTRACTORS")
    else:
        flags.append("DISTRACTORS_NOT_ADDRESSED")

    return {"score": max(0, min(100, score)), "flags": flags, "pass": score >= 60}


# ──────────────────────────────────────────────────────────────────────────────
# Round 6 — Peer Review
# ──────────────────────────────────────────────────────────────────────────────

def _choice_prefix(choice: str) -> str:
    words = _words(choice)
    return " ".join(words[:3])


def round6_peer_review(item: dict[str, Any]) -> dict[str, Any]:
    """
    Simulate a human item-writer peer review.

    Focus:
      • Does the stem read naturally rather than mechanically?
      • Is there a single best answer without clueing?
      • Are the options parallel, comparable, and equally defensible at first glance?
      • Does the item avoid test-writing anti-patterns a human reviewer would reject?
    """
    flags: list[str] = []
    score = 100

    stem = str(item.get("stem") or "")
    choices = item.get("choices") if isinstance(item.get("choices"), list) else []
    explanation = str(item.get("explanation") or "")
    ci = item.get("correctIndex")

    if not isinstance(ci, int) or ci < 0 or ci >= len(choices):
        return {"score": 0, "flags": ["INVALID_STRUCTURE"], "pass": False}

    correct_text = str(choices[ci])
    wrong_answers = [str(c) for i, c in enumerate(choices) if i != ci]
    stem_words = _words(stem)

    # Human-written CISSP items usually provide enough context to anchor judgment,
    # but not so much that the stem becomes bloated or noisy.
    stem_wc = len(stem_words)
    if stem_wc < 22:
        score -= 18
        flags.append("SCENARIO_THIN")
    elif stem_wc > 125:
        score -= 12
        flags.append("STEM_BLOATED")

    if not SCENARIO_SIGNALS.search(stem):
        score -= 12
        flags.append("NO_ROLE_OR_SCENARIO")

    if NEGATIVE_STEM_RE.search(stem):
        score -= 10
        flags.append("NEGATIVE_STEM")

    qualifier_count = len(set(q.upper() for q in JUDGMENT_QUALIFIERS.findall(stem)))
    if qualifier_count == 0:
        score -= 10
        flags.append("PEER_NO_QUALIFIER")
    elif qualifier_count > 2:
        score -= 4
        flags.append("QUALIFIER_OVERLOAD")

    acronyms = ACRONYM_RE.findall(stem)
    if len(acronyms) >= 5:
        score -= 8
        flags.append("ACRONYM_HEAVY")

    # Option parallelism: strong human-written items keep options in comparable shape.
    lengths = [len(_words(str(c))) for c in choices]
    if lengths and max(lengths) > max(1, min(lengths)) * 2.8:
        score -= 10
        flags.append("CHOICE_LENGTH_SKEW")

    prefixes = [_choice_prefix(str(c)) for c in choices]
    unique_prefixes = len(set(prefixes))
    if unique_prefixes == len(prefixes):
        # Completely different grammatical openings often means options are not comparable.
        score -= 6
        flags.append("CHOICE_STYLE_MISMATCH")

    absolute_wrong = sum(
        1 for text in wrong_answers
        if _word_set(text) & ABSOLUTE_WORDS
    )
    if absolute_wrong >= 2:
        score -= 8
        flags.append("WEAK_ABSOLUTE_DISTRACTORS")

    # Multi-key risk: if a distractor is too semantically close to the correct answer,
    # a human reviewer would likely flag ambiguity.
    close_competitors = 0
    for distractor in wrong_answers:
        overlap = _lexical_overlap(correct_text, distractor)
        len_ratio = len(_words(distractor)) / max(1, len(_words(correct_text)))
        if overlap > 0.72 and 0.65 <= len_ratio <= 1.45:
            close_competitors += 1
    if close_competitors:
        score -= min(20, close_competitors * 10)
        flags.append("POSSIBLE_MULTI_KEY")

    # Clueing: if the correct answer is conspicuously longer and more complete,
    # it may be guessable without understanding.
    correct_len = len(_words(correct_text))
    wrong_lens = [len(_words(c)) for c in wrong_answers]
    if wrong_lens and correct_len > (sum(wrong_lens) / len(wrong_lens)) * 1.7:
        score -= 10
        flags.append("CORRECT_CHOICE_CUE")

    # Peer reviewers usually expect the explanation to distinguish the winner
    # from neighboring alternatives, not merely restate the key.
    contrast_terms = re.compile(r"\b(whereas|while|however|but|unlike|instead|rather than)\b", re.I)
    if not contrast_terms.search(explanation):
        score -= 6
        flags.append("NO_OPTION_CONTRAST")

    # If the item still looks like pure terminology recall, the human review fails.
    if any(p.search(stem) for p in RECALL_STEMS) and not SCENARIO_SIGNALS.search(stem):
        score -= 18
        flags.append("PEER_RECALL_STYLE")

    peer_pass = score >= 65
    if not peer_pass:
        flags.append("PEER_REVIEW_FAIL")

    return {"score": max(0, min(100, score)), "flags": flags, "pass": peer_pass}


# ──────────────────────────────────────────────────────────────────────────────
# Composite scoring
# ──────────────────────────────────────────────────────────────────────────────

ROUND_WEIGHTS = {
    "r1_structural": 0.05,
    "r2_ceo_mindset": 0.30,   # most important — this is the core philosophy
    "r3_cognitive":   0.18,
    "r4_distractor":  0.22,   # plausible traps are critical
    "r5_explanation": 0.10,
    "r6_peer_review": 0.15,   # human-writer quality gate
}


def composite_score(rounds: dict[str, dict]) -> float:
    total = 0.0
    applied_weight = 0.0
    for key, weight in ROUND_WEIGHTS.items():
        if key not in rounds:
            continue
        r = rounds.get(key, {})
        total += r.get("score", 0) * weight
        applied_weight += weight
    if applied_weight <= 0:
        return 0.0
    return round(total / applied_weight, 1)


def audit_item(item: dict[str, Any], rounds_to_run: set[int]) -> dict[str, Any]:
    results: dict[str, Any] = {}

    if 1 in rounds_to_run:
        results["r1_structural"] = round1_structural(item)
    if 2 in rounds_to_run:
        results["r2_ceo_mindset"] = round2_ceo_mindset(item)
    if 3 in rounds_to_run:
        results["r3_cognitive"] = round3_cognitive_level(item)
    if 4 in rounds_to_run:
        results["r4_distractor"] = round4_distractor_auth(item)
    if 5 in rounds_to_run:
        results["r5_explanation"] = round5_explanation(item)
    if 6 in rounds_to_run:
        results["r6_peer_review"] = round6_peer_review(item)

    overall = composite_score(results)
    all_flags: list[str] = []
    for r in results.values():
        all_flags.extend(r.get("flags", []))

    passed_rounds = [k for k, r in results.items() if r.get("pass", True)]
    failed_rounds = [k for k, r in results.items() if not r.get("pass", True)]

    return {
        "item_id": str(item.get("id") or ""),
        "domain": str(item.get("domain") or ""),
        "difficulty": item.get("difficulty"),
        "questionType": item.get("questionType"),
        "judgmentLevel": item.get("judgmentLevel"),
        "overall_score": overall,
        "rounds": results,
        "all_flags": all_flags,
        "passed_rounds": passed_rounds,
        "failed_rounds": failed_rounds,
        "ceo_pass": overall >= 55 and "r2_ceo_mindset" not in failed_rounds,
    }


# ──────────────────────────────────────────────────────────────────────────────
# Tagging: write quality metadata back into each bank item
# ──────────────────────────────────────────────────────────────────────────────

def tag_item(item: dict[str, Any], audit: dict[str, Any]) -> dict[str, Any]:
    """Attach audit results to the item as quality metadata."""
    item = dict(item)
    item["ceoQuality"] = {
        "overallScore": audit["overall_score"],
        "ceoPass": audit["ceo_pass"],
        "cognitiveLevel": audit.get("rounds", {}).get("r3_cognitive", {}).get("level"),
        "distractorScore": audit.get("rounds", {}).get("r4_distractor", {}).get("score"),
        "peerReviewScore": audit.get("rounds", {}).get("r6_peer_review", {}).get("score"),
        "flags": audit["all_flags"],
        "failedRounds": audit["failed_rounds"],
    }
    # Update questionType and judgmentLevel if cognitive detection strongly disagrees
    r3 = audit.get("rounds", {}).get("r3_cognitive", {})
    detected_level = r3.get("level")
    if detected_level == "recall" and item.get("questionType") == "judgment":
        item["ceoQuality"]["questionTypeOverride"] = "scenario"  # suggest demotion
    return item


# ──────────────────────────────────────────────────────────────────────────────
# Reporting
# ──────────────────────────────────────────────────────────────────────────────

def build_summary(all_audits: list[dict], threshold: int, bank_path: Path) -> str:
    total = len(all_audits)
    passed = sum(1 for a in all_audits if a["ceo_pass"])
    failed = total - passed

    avg_overall = sum(a["overall_score"] for a in all_audits) / max(1, total)

    # Per-round pass rates
    round_names = {
        "r1_structural": "Round 1 — Structural",
        "r2_ceo_mindset": "Round 2 — CEO Mindset",
        "r3_cognitive": "Round 3 — Cognitive Level",
        "r4_distractor": "Round 4 — Distractor Auth",
        "r5_explanation": "Round 5 — Explanation Depth",
        "r6_peer_review": "Round 6 — Peer Review",
    }
    round_pass_counts: dict[str, int] = defaultdict(int)
    for a in all_audits:
        for rk in a.get("rounds", {}):
            if a["rounds"][rk].get("pass", True):
                round_pass_counts[rk] += 1

    # Cognitive level distribution
    cog_dist: Counter = Counter()
    for a in all_audits:
        level = a.get("rounds", {}).get("r3_cognitive", {}).get("level", "unknown")
        cog_dist[level] += 1

    # Flag frequency
    flag_counter: Counter = Counter()
    for a in all_audits:
        for f in a["all_flags"]:
            flag_counter[f.split(":")[0]] += 1

    # Domain breakdown
    domain_stats: dict[str, list[float]] = defaultdict(list)
    for a in all_audits:
        domain_stats[a["domain"]].append(a["overall_score"])

    # Weakest items
    weakest = sorted(all_audits, key=lambda x: x["overall_score"])[:20]

    lines = [
        "# CISSP CEO Quality Audit Report",
        f"\n**Bank:** `{bank_path.name}`  ",
        f"**Total items audited:** {total}  ",
        f"**CEO-pass (score ≥ {threshold}):** {passed} ({passed/max(1,total)*100:.1f}%)  ",
        f"**CEO-fail:** {failed} ({failed/max(1,total)*100:.1f}%)  ",
        f"**Average composite score:** {avg_overall:.1f}/100",
        "\n---\n",
        "## Round Pass Rates\n",
        "| Round | Pass | Fail | Pass% |",
        "|-------|------|------|-------|",
    ]
    for rk, rname in round_names.items():
        p = round_pass_counts.get(rk, 0)
        if any(rk in a.get("rounds", {}) for a in all_audits):
            f_count = total - p
            lines.append(f"| {rname} | {p} | {f_count} | {p/max(1,total)*100:.1f}% |")

    lines += [
        "\n---\n",
        "## Cognitive Level Distribution\n",
        "| Level | Count | % |",
        "|-------|-------|---|",
    ]
    for level in ("judgment", "analysis", "application", "recall", "unknown"):
        cnt = cog_dist.get(level, 0)
        lines.append(f"| {level.title()} | {cnt} | {cnt/max(1,total)*100:.1f}% |")

    lines += [
        "\n---\n",
        "## Domain Breakdown (avg composite score)\n",
        "| Domain | Items | Avg Score | Pass% |",
        "|--------|-------|-----------|-------|",
    ]
    for domain, scores in sorted(domain_stats.items()):
        d_avg = sum(scores) / len(scores)
        d_pass = sum(1 for s in scores if s >= threshold)
        lines.append(f"| {domain} | {len(scores)} | {d_avg:.1f} | {d_pass/len(scores)*100:.1f}% |")

    lines += [
        "\n---\n",
        "## Top 15 Most Frequent Flags\n",
        "| Flag | Count |",
        "|------|-------|",
    ]
    for flag, count in flag_counter.most_common(15):
        lines.append(f"| `{flag}` | {count} |")

    lines += [
        "\n---\n",
        "## 20 Weakest Items (Priority for Rewrite)\n",
        "| # | Item ID | Domain | Score | Key Flags |",
        "|---|---------|--------|-------|-----------|",
    ]
    for rank, a in enumerate(weakest, 1):
        key_flags = " | ".join(a["failed_rounds"])
        top_flags = ", ".join(f[:40] for f in a["all_flags"][:3])
        lines.append(
            f"| {rank} | `{a['item_id']}` | {a['domain'][:35]} "
            f"| {a['overall_score']:.1f} | {key_flags or top_flags} |"
        )

    lines += [
        "\n---\n",
        "## CEO Mindset Failure Analysis\n",
        "Questions scoring < 55 on Round 2 (CEO Mindset) represent the highest risk —\n"
        "they may train candidates to think technically rather than executively.\n",
        "**Common failure patterns:**\n",
        "- `RECALL_STEM` — stem asks 'what is X' instead of 'what should you do'\n",
        "- `NO_QUALIFIER` — no BEST/FIRST/MOST qualifier to force prioritisation\n",
        "- `TECH_CORRECT_ANSWER` — correct answer is a technical action, not governance\n",
        "- `KNOWLEDGE_TYPE` — item tagged as knowledge, not scenario or judgment\n",
        "- `HAS_WEAK_DISTRACTOR` — at least one obviously wrong distractor (Round 4)\n",
        "\n**Fix strategy:**\n",
        "1. Convert recall stems to scenario stems with role + context + qualifier\n",
        "2. Rewrite distractors to be plausible-but-wrong (governance near-misses)\n",
        "3. Ensure correct answer reflects policy/governance before technical action\n",
        "4. Add causal reasoning to explanations (why this beats the other options)\n",
    ]

    return "\n".join(lines)


# ──────────────────────────────────────────────────────────────────────────────
# CLI entry point
# ──────────────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="CISSP CEO Quality Audit — 6-round quality pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument(
        "--bank",
        default=str(Path(__file__).parent.parent / "cat" / "question-bank.augmented.json"),
        help="Path to question bank JSON (default: question-bank.augmented.json)",
    )
    p.add_argument(
        "--output-dir",
        default=str(Path(__file__).parent.parent / "cat"),
        help="Directory for output files",
    )
    p.add_argument(
        "--rounds",
        nargs="+",
        type=int,
        choices=[1, 2, 3, 4, 5, 6],
        default=[1, 2, 3, 4, 5, 6],
        help="Which rounds to run (default: all)",
    )
    p.add_argument(
        "--threshold",
        type=int,
        default=55,
        help="Composite score below which an item is flagged (default: 55)",
    )
    p.add_argument(
        "--domain",
        default=None,
        help="Audit only this domain (e.g. '1. Security and Risk Management')",
    )
    p.add_argument(
        "--base-only",
        action="store_true",
        help="Skip synthetic variants (items with variantOf set)",
    )
    p.add_argument(
        "--show-flags",
        action="store_true",
        help="Print per-item flag details to stdout",
    )
    p.add_argument(
        "--no-tag",
        action="store_true",
        help="Do not write the tagged bank output file",
    )
    return p.parse_args()


def main() -> int:
    args = parse_args()

    bank_path = Path(args.bank)
    if not bank_path.exists():
        print(f"[ERROR] Bank not found: {bank_path}", file=sys.stderr)
        return 1

    print(f"Loading bank: {bank_path} ...", flush=True)
    with bank_path.open(encoding="utf-8") as fh:
        bank = json.load(fh)

    items: list[dict[str, Any]] = bank.get("items", [])
    original_count = len(items)

    if args.base_only:
        items = [i for i in items if not i.get("variantOf")]
        print(f"Base-only mode: {len(items)}/{original_count} items", flush=True)

    if args.domain:
        items = [i for i in items if args.domain.lower() in str(i.get("domain", "")).lower()]
        print(f"Domain filter '{args.domain}': {len(items)} items", flush=True)

    if not items:
        print("[ERROR] No items to audit after filtering.", file=sys.stderr)
        return 1

    rounds_to_run = set(args.rounds)
    print(f"Auditing {len(items)} items across rounds {sorted(rounds_to_run)} ...", flush=True)

    all_audits: list[dict[str, Any]] = []
    failed_items: list[str] = []

    for idx, item in enumerate(items, 1):
        if idx % 100 == 0:
            pct = idx / len(items) * 100
            print(f"  {idx}/{len(items)} ({pct:.0f}%)", flush=True)
        try:
            audit = audit_item(item, rounds_to_run)
            all_audits.append(audit)

            if args.show_flags and not audit["ceo_pass"]:
                print(f"\n  [{audit['item_id']}] score={audit['overall_score']:.1f}")
                for f in audit["all_flags"][:6]:
                    print(f"    ↳ {f}")
        except Exception as exc:  # noqa: BLE001
            iid = str(item.get("id") or idx)
            print(f"  [WARN] Exception auditing {iid}: {exc}", file=sys.stderr)
            failed_items.append(iid)

    print(f"\nAudit complete. {len(all_audits)} items processed, {len(failed_items)} errors.", flush=True)

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # ── Write full report JSON ──
    report_path = output_dir / "ceo_audit_report.json"
    with report_path.open("w", encoding="utf-8") as fh:
        json.dump(
            {
                "audited_at": dt.datetime.now(dt.UTC).isoformat().replace("+00:00", "Z"),
                "bank": str(bank_path),
                "rounds_run": sorted(rounds_to_run),
                "threshold": args.threshold,
                "total_items": len(all_audits),
                "ceo_pass_count": sum(1 for a in all_audits if a["ceo_pass"]),
                "avg_score": round(sum(a["overall_score"] for a in all_audits) / max(1, len(all_audits)), 2),
                "items": all_audits,
            },
            fh,
            indent=2,
        )
    print(f"Report JSON → {report_path}", flush=True)

    # ── Write summary markdown ──
    summary_md = build_summary(all_audits, args.threshold, bank_path)
    summary_path = output_dir / "ceo_audit_summary.md"
    with summary_path.open("w", encoding="utf-8") as fh:
        fh.write(summary_md)
    print(f"Summary MD  → {summary_path}", flush=True)

    # ── Write tagged bank ──
    if not args.no_tag:
        audit_by_id = {a["item_id"]: a for a in all_audits}
        tagged_items = []
        for item in bank.get("items", []):
            iid = str(item.get("id") or "")
            audit = audit_by_id.get(iid)
            if audit:
                tagged_items.append(tag_item(item, audit))
            else:
                tagged_items.append(item)  # un-audited items pass through unchanged
        tagged_bank = dict(bank)
        tagged_bank["items"] = tagged_items
        tagged_bank["ceoAuditMeta"] = {
            "auditedAt": dt.datetime.now(dt.UTC).isoformat().replace("+00:00", "Z"),
            "roundsRun": sorted(rounds_to_run),
            "threshold": args.threshold,
            "totalAudited": len(all_audits),
            "ceoPassRate": round(sum(1 for a in all_audits if a["ceo_pass"]) / max(1, len(all_audits)), 4),
        }
        tagged_path = output_dir / (bank_path.stem + "-ceo-audited.json")
        with tagged_path.open("w", encoding="utf-8") as fh:
            json.dump(tagged_bank, fh, indent=2)
        print(f"Tagged bank → {tagged_path}", flush=True)

    # ── Print quick summary ──
    passed = sum(1 for a in all_audits if a["ceo_pass"])
    avg = sum(a["overall_score"] for a in all_audits) / max(1, len(all_audits))
    print(f"\n{'='*60}")
    print(f"CEO MINDSET PASS: {passed}/{len(all_audits)} ({passed/max(1,len(all_audits))*100:.1f}%)")
    print(f"AVERAGE SCORE:    {avg:.1f}/100")
    print(f"THRESHOLD:        {args.threshold}")
    print(f"{'='*60}")

    if failed_items:
        print(f"\n[WARN] {len(failed_items)} items errored during audit: {failed_items[:5]}")

    return 0 if passed / max(1, len(all_audits)) >= 0.7 else 1


if __name__ == "__main__":
    sys.exit(main())
