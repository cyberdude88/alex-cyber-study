#!/usr/bin/env python3
"""Obfuscate CAT question wording with controlled synonyms.

Goals:
- Obfuscate answer wording in a large percentage of items.
- Preserve core CISSP keywords/acronyms (e.g., BIA, Typosquatting, ALE, SLE, RTO).
- Keep output deterministic by item id for repeatability.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import random
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Any

# Protected CISSP terms that should never be altered.
PROTECTED_RE = re.compile(
    r"\\b("
    r"bia|business impact analysis|rto|rpo|mtd|mtpd|ale|sle|aro|"
    r"typosquat\\w*|look[- ]?alike domain\\w*|cybersquat\\w*|"
    r"phish\\w*|spear[- ]?phish\\w*|vish\\w*|smish\\w*|"
    r"sql injection|xss|cross[- ]site script\\w*|csrf|clickjack\\w*|"
    r"mitm|man[- ]in[- ]the[- ]middle|ddos|dos|ransomware|malware|"
    r"kerberos|radius|tacacs\\+?|ldap|saml|oauth|oidc|"
    r"ipsec|tls|ssl|ssh|https|aes|des|3des|rsa|diffie[- ]hellman|"
    r"sha-?\\d+|md5|hmac|"
    r"nist|iso\\s*2700\\d|gdpr|hipaa|pci\\s*dss|sox|fisma|"
    r"bell[- ]lapadula|biba|clark[- ]wilson|brewer[- ]nash|"
    r"least privilege|separation of duties|need[- ]to[- ]know|zero trust"
    r")\\b",
    re.IGNORECASE,
)

# Equivalent phrasings for selected attack/term labels.
# Rule: if the canonical keyword is in the correct option, do not swap it there.
EQUIVALENT_TERM_REPLACEMENTS: dict[str, list[str]] = {
    "typosquatting attack": ["look-alike domain attack", "URL hijacking (domain typo variant)"],
    "typosquatting": ["look-alike domain attack", "URL hijacking (domain typo variant)"],
    "cybersquatting": ["brand-domain speculation"],
    "session hijacking": ["session sidejacking", "auth token takeover"],
    "social engineering": ["human manipulation vector"],
    "phishing": ["credential harvesting campaign"],
    "shoulder surfing": ["visual eavesdropping"],
    "eavesdropping": ["passive interception"],
}

# Phrase replacements first, then single-word replacements.
PHRASE_REPLACEMENTS: dict[str, list[str]] = {
    "most appropriate": ["best-suited", "most fitting"],
    "best answer": ["strongest response", "most defensible answer"],
    "primary objective": ["main objective", "core objective"],
    "root cause": ["underlying cause", "fundamental cause"],
    "security control": ["security safeguard", "protective control"],
    "security controls": ["security safeguards", "protective controls"],
    "risk treatment": ["risk handling", "risk response"],
    "incident response": ["incident handling", "response process"],
    "business continuity": ["continuity planning", "operations continuity"],
}

WORD_REPLACEMENTS: dict[str, list[str]] = {
    "identify": ["pinpoint", "determine"],
    "identified": ["pinpointed", "determined"],
    "determine": ["establish", "identify"],
    "determines": ["establishes", "identifies"],
    "evaluate": ["assess", "appraise"],
    "evaluates": ["assesses", "appraises"],
    "review": ["examine", "assess"],
    "reviews": ["examines", "assesses"],
    "require": ["mandate", "necessitate"],
    "requires": ["mandates", "necessitates"],
    "implement": ["deploy", "apply"],
    "implemented": ["deployed", "applied"],
    "implementation": ["deployment", "execution"],
    "maintain": ["sustain", "uphold"],
    "maintains": ["sustains", "upholds"],
    "ensure": ["verify", "assure"],
    "ensures": ["verifies", "assures"],
    "monitor": ["track", "observe"],
    "monitors": ["tracks", "observes"],
    "protect": ["safeguard", "defend"],
    "protects": ["safeguards", "defends"],
    "prevent": ["block", "avert"],
    "prevents": ["blocks", "averts"],
    "mitigate": ["reduce", "limit"],
    "mitigates": ["reduces", "limits"],
    "policy": ["directive", "policy document"],
    "policies": ["directives", "policy documents"],
    "control": ["safeguard", "measure"],
    "controls": ["safeguards", "measures"],
    "vulnerability": ["weakness", "security gap"],
    "vulnerabilities": ["weaknesses", "security gaps"],
    "risk": ["exposure", "risk"],
    "asset": ["resource", "information asset"],
    "assets": ["resources", "information assets"],
    "impact": ["effect", "consequence"],
    "likelihood": ["probability", "chance"],
    "incident": ["security event", "incident"],
    "incidents": ["security events", "incidents"],
}


@dataclass
class Stats:
    items_total: int = 0
    items_changed: int = 0
    stems_changed: int = 0
    choices_changed: int = 0
    correct_choices_changed: int = 0
    replacements: int = 0


def preserve_case(source: str, replacement: str) -> str:
    if source.isupper():
        return replacement.upper()
    if source[:1].isupper():
        return replacement[:1].upper() + replacement[1:]
    return replacement


def hide_protected(text: str) -> tuple[str, dict[str, str]]:
    hidden: dict[str, str] = {}

    def repl(match: re.Match[str]) -> str:
        token = f"__PROTECTED_{len(hidden)}__"
        hidden[token] = match.group(0)
        return token

    return PROTECTED_RE.sub(repl, text), hidden


def restore_protected(text: str, hidden: dict[str, str]) -> str:
    out = text
    for token, original in hidden.items():
        out = out.replace(token, original)
    return out


def compile_patterns() -> tuple[list[tuple[re.Pattern[str], list[str]]], list[tuple[re.Pattern[str], list[str]]]]:
    phrase_patterns: list[tuple[re.Pattern[str], list[str]]] = []
    for phrase, choices in sorted(PHRASE_REPLACEMENTS.items(), key=lambda kv: len(kv[0]), reverse=True):
        pat = re.compile(rf"(?<![A-Za-z])({re.escape(phrase)})(?![A-Za-z])", re.IGNORECASE)
        phrase_patterns.append((pat, choices))

    word_patterns: list[tuple[re.Pattern[str], list[str]]] = []
    for word, choices in sorted(WORD_REPLACEMENTS.items(), key=lambda kv: len(kv[0]), reverse=True):
        pat = re.compile(rf"(?<![A-Za-z])({re.escape(word)})(?![A-Za-z])", re.IGNORECASE)
        word_patterns.append((pat, choices))

    return phrase_patterns, word_patterns


def compile_equivalent_patterns() -> list[tuple[re.Pattern[str], str, list[str]]]:
    patterns: list[tuple[re.Pattern[str], str, list[str]]] = []
    for term, repls in sorted(EQUIVALENT_TERM_REPLACEMENTS.items(), key=lambda kv: len(kv[0]), reverse=True):
        pat = re.compile(rf"(?<![A-Za-z])({re.escape(term)})(?![A-Za-z])", re.IGNORECASE)
        patterns.append((pat, term.lower(), repls))
    return patterns


def apply_equivalent_terms(
    text: str,
    rng: random.Random,
    patterns: list[tuple[re.Pattern[str], str, list[str]]],
    probability: float,
    block_terms: set[str] | None = None,
    max_replacements: int = 1,
) -> tuple[str, int]:
    out = text
    replaced = 0
    blocked = block_terms or set()

    for pat, canonical, options in patterns:
        if replaced >= max_replacements:
            break
        if canonical in blocked:
            continue
        if not pat.search(out):
            continue
        if rng.random() > probability:
            continue

        pick = rng.choice(options)

        def _swap(match: re.Match[str]) -> str:
            return preserve_case(match.group(1), pick)

        out, count = pat.subn(_swap, out, count=1)
        replaced += count

    return out, replaced


def apply_patterns(
    text: str,
    rng: random.Random,
    phrase_patterns: list[tuple[re.Pattern[str], list[str]]],
    word_patterns: list[tuple[re.Pattern[str], list[str]]],
    probability: float,
    max_replacements: int,
) -> tuple[str, int]:
    work, hidden = hide_protected(text)
    replacements = 0

    def maybe_replace(match: re.Match[str], options: list[str]) -> str:
        nonlocal replacements
        if replacements >= max_replacements:
            return match.group(0)
        if rng.random() > probability:
            return match.group(0)
        replacement = rng.choice(options)
        replacements += 1
        return preserve_case(match.group(1), replacement)

    for pat, options in phrase_patterns:
        if replacements >= max_replacements:
            break
        work = pat.sub(lambda m, opts=options: maybe_replace(m, opts), work)

    for pat, options in word_patterns:
        if replacements >= max_replacements:
            break
        work = pat.sub(lambda m, opts=options: maybe_replace(m, opts), work)

    return restore_protected(work, hidden), replacements


def obfuscate_item(
    item: dict[str, Any],
    phrase_patterns: list[tuple[re.Pattern[str], list[str]]],
    word_patterns: list[tuple[re.Pattern[str], list[str]]],
    equivalent_patterns: list[tuple[re.Pattern[str], str, list[str]]],
) -> tuple[dict[str, Any], dict[str, int]]:
    out = dict(item)
    item_id = str(item.get("id", ""))
    difficulty = float(item.get("difficulty", 0.0) or 0.0)

    # Higher difficulty gets stronger obfuscation.
    if difficulty >= 0.8:
        base_p = 0.82
    elif difficulty >= 0.2:
        base_p = 0.74
    elif difficulty >= -0.5:
        base_p = 0.66
    else:
        base_p = 0.58

    rng = random.Random(int(hashlib.sha256(item_id.encode("utf-8")).hexdigest()[:12], 16))

    changed = {"stem": 0, "choices": 0, "correct": 0, "repl": 0}

    stem = str(item.get("stem", ""))
    stem, stem_equiv = apply_equivalent_terms(
        stem,
        rng,
        equivalent_patterns,
        probability=max(0.26, base_p - 0.26),
        max_replacements=1,
    )
    new_stem, stem_repl = apply_patterns(
        stem,
        rng,
        phrase_patterns,
        word_patterns,
        probability=max(0.35, base_p - 0.20),
        max_replacements=4,
    )
    out["stem"] = new_stem
    if new_stem != stem:
        changed["stem"] = 1
    changed["repl"] += (stem_repl + stem_equiv)

    choices = item.get("choices", [])
    correct_idx = item.get("correctIndex")
    new_choices: list[str] = []
    choice_changed = 0
    correct_changed = 0

    for idx, choice in enumerate(choices):
        original = str(choice)
        blocked_terms: set[str] = set()
        if idx == correct_idx:
            for _, canonical, _ in equivalent_patterns:
                if re.search(rf"(?<![A-Za-z]){re.escape(canonical)}(?![A-Za-z])", original, re.IGNORECASE):
                    blocked_terms.add(canonical)

        with_equiv, equiv_repl = apply_equivalent_terms(
            original,
            rng,
            equivalent_patterns,
            probability=min(0.80, base_p + (0.08 if idx != correct_idx else 0.04)),
            block_terms=blocked_terms,
            max_replacements=1,
        )

        p = base_p + (0.15 if idx == correct_idx else 0.05)
        max_rep = 3 if idx == correct_idx else 2
        updated, repl_count = apply_patterns(
            with_equiv,
            rng,
            phrase_patterns,
            word_patterns,
            probability=min(0.92, p),
            max_replacements=max_rep,
        )
        new_choices.append(updated)
        if updated != original:
            choice_changed = 1
            if idx == correct_idx:
                correct_changed = 1
        changed["repl"] += (repl_count + equiv_repl)

    out["choices"] = new_choices
    changed["choices"] = choice_changed
    changed["correct"] = correct_changed

    return out, changed


def process_bank(bank: dict[str, Any]) -> tuple[dict[str, Any], Stats]:
    items = bank.get("items")
    if not isinstance(items, list):
        raise ValueError("Top-level 'items' must be a list")

    phrase_patterns, word_patterns = compile_patterns()
    equivalent_patterns = compile_equivalent_patterns()
    stats = Stats(items_total=len(items))
    out_items: list[dict[str, Any]] = []

    for item in items:
        out_item, delta = obfuscate_item(item, phrase_patterns, word_patterns, equivalent_patterns)
        out_items.append(out_item)

        if delta["stem"] or delta["choices"]:
            stats.items_changed += 1
        stats.stems_changed += delta["stem"]
        stats.choices_changed += delta["choices"]
        stats.correct_choices_changed += delta["correct"]
        stats.replacements += delta["repl"]

    out = dict(bank)
    out["items"] = out_items
    out["obfuscationInfo"] = {
        "version": "2026-02-22",
        "itemsTotal": stats.items_total,
        "itemsChanged": stats.items_changed,
        "stemsChanged": stats.stems_changed,
        "choicesChanged": stats.choices_changed,
        "correctChoicesChanged": stats.correct_choices_changed,
        "totalReplacements": stats.replacements,
    }
    return out, stats


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--bank", type=Path, default=Path("cat/question-bank.sample.json"))
    ap.add_argument("--out", type=Path)
    ap.add_argument("--in-place", action="store_true")
    ap.add_argument("--backup-suffix", default=".pre_obfuscation.bak")
    args = ap.parse_args()

    raw = json.loads(args.bank.read_text(encoding="utf-8"))
    processed, stats = process_bank(raw)

    if args.in_place:
        backup = args.bank.with_name(args.bank.name + args.backup_suffix)
        shutil.copy2(args.bank, backup)
        target = args.bank
    else:
        target = args.out or args.bank.with_name(args.bank.stem + ".obfuscated.json")

    target.write_text(json.dumps(processed, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Wrote: {target}")
    if args.in_place:
        print(f"Backup: {backup}")
    print(
        "Stats:",
        json.dumps(
            {
                "items_total": stats.items_total,
                "items_changed": stats.items_changed,
                "items_changed_pct": round((stats.items_changed / max(1, stats.items_total)) * 100, 1),
                "stems_changed": stats.stems_changed,
                "choices_changed": stats.choices_changed,
                "correct_choices_changed": stats.correct_choices_changed,
                "total_replacements": stats.replacements,
            },
            ensure_ascii=False,
        ),
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
