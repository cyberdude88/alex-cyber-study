#!/usr/bin/env python3
"""Import OCR-style mock exam result text into CAT question bank with light rewording."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

DOMAIN_MAP = {
    "1": "1. Security and Risk Management",
    "2": "2. Asset Security",
    "3": "3. Security Architecture and Engineering",
    "4": "4. Communication and Network Security",
    "5": "5. Identity and Access Management (IAM)",
    "6": "6. Security Assessment and Testing",
    "7": "7. Security Operations",
    "8": "8. Software Development Security",
}

MARKERS = {
    "Correct answer",
    "Correct selection",
    "Your answer is incorrect",
    "Your answer is correct",
    "Your selection is correct",
    "Your selection is incorrect",
}


def norm(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", text.lower())


def reword_stem(stem: str) -> str:
    s = stem.strip()
    repl = [
        ("Which of the following is the MOST appropriate", "What is the most appropriate option"),
        ("Which of the following is the MOST effective", "What is the most effective option"),
        ("Which of the following BEST describes", "What best describes"),
        ("Which of the following BEST meets", "What best meets"),
        ("Which of the following BEST", "What best"),
        ("Which of the following", "Which option"),
        ("organization", "enterprise"),
        ("Organization", "Enterprise"),
        ("company", "business"),
        ("Company", "Business"),
    ]
    for old, new in repl:
        s = s.replace(old, new)
    if "?" in s:
        return s
    return f"{s}?"


def reword_explanation(explanation: str) -> str:
    e = " ".join(explanation.split())
    e = re.sub(r"The correct answer is option\s+(\d+)\.?", r"Option \1 is correct.", e, flags=re.IGNORECASE)
    e = re.sub(r"\bOption\s+(\d+)\s+is incorrect because\b", r"Option \1 is not correct because", e, flags=re.IGNORECASE)
    e = e.replace("is incorrect since", "is not correct since")
    e = e.replace("is incorrect as", "is not correct as")
    return e.strip()


def parse_mock_results(raw: str) -> list[dict[str, Any]]:
    q_starts = list(re.finditer(r"(?m)^Question\s+(\d+)(?:Correct|Incorrect)?\s*$", raw))
    parsed: list[dict[str, Any]] = []
    for i, match in enumerate(q_starts):
        start = match.start()
        end = q_starts[i + 1].start() if i + 1 < len(q_starts) else len(raw)
        block = raw[start:end].strip()

        lines = [ln.strip() for ln in block.splitlines() if ln.strip()]
        if not lines:
            continue
        body = "\n".join(lines[1:])
        if "Overall explanation" not in body or "\nDomain\n" not in body:
            continue

        pre, rest = body.split("Overall explanation", 1)
        if "\nDomain\n" not in rest:
            continue
        explanation, domain_part = rest.strip().split("\nDomain\n", 1)
        domain_code = domain_part.strip().splitlines()[0].strip()
        domain = DOMAIN_MAP.get(domain_code.split(".")[0], domain_code)

        pre_lines = [ln.strip() for ln in pre.splitlines() if ln.strip()]
        if not pre_lines:
            continue
        stem = pre_lines[0]
        tail = pre_lines[1:]

        choices: list[str] = []
        correct: str | None = None
        idx = 0
        while idx < len(tail):
            line = tail[idx]
            if line in {"Correct answer", "Correct selection", "Your answer is correct", "Your selection is correct"}:
                j = idx + 1
                while j < len(tail) and tail[j] in MARKERS:
                    j += 1
                if j < len(tail) and correct is None:
                    correct = tail[j]
                idx += 1
                continue
            if line in MARKERS:
                idx += 1
                continue
            if line not in choices:
                choices.append(line)
            idx += 1

        if not choices or correct is None:
            continue
        if correct not in choices:
            choices = [correct] + choices
        if len(choices) > 4:
            trimmed: list[str] = []
            for choice in choices:
                if choice == correct and choice not in trimmed:
                    trimmed.append(choice)
            for choice in choices:
                if choice not in trimmed:
                    trimmed.append(choice)
                if len(trimmed) >= 4:
                    break
            choices = trimmed
        if len(choices) < 2:
            continue

        parsed.append(
            {
                "stem": reword_stem(stem),
                "choices": choices,
                "correctIndex": choices.index(correct),
                "domain": domain,
                "explanation": reword_explanation(explanation),
            }
        )
    return parsed


def next_id_by_domain(items: list[dict[str, Any]]) -> dict[int, int]:
    out = {i: 1 for i in range(1, 9)}
    for item in items:
        match = re.fullmatch(r"d(\d+)-q(\d+)", str(item.get("id", "")).strip())
        if not match:
            continue
        d = int(match.group(1))
        q = int(match.group(2))
        if d in out and q >= out[d]:
            out[d] = q + 1
    return out


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mock-file", type=Path, required=True)
    parser.add_argument("--bank-file", type=Path, required=True)
    parser.add_argument("--write-parsed", type=Path)
    args = parser.parse_args()

    raw = args.mock_file.read_text(encoding="utf-8")
    parsed = parse_mock_results(raw)
    if args.write_parsed:
        args.write_parsed.write_text(json.dumps(parsed, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    bank = json.loads(args.bank_file.read_text(encoding="utf-8"))
    items = bank["items"]
    existing = {norm(it["stem"]) for it in items}
    next_ids = next_id_by_domain(items)

    added = 0
    skipped = 0
    for entry in parsed:
        if norm(entry["stem"]) in existing:
            skipped += 1
            continue
        domain_num = int(str(entry["domain"]).split(".")[0])
        items.append(
            {
                "id": f"d{domain_num}-q{next_ids[domain_num]}",
                "domain": entry["domain"],
                "stem": entry["stem"],
                "choices": entry["choices"],
                "correctIndex": entry["correctIndex"],
                "difficulty": 0.0,
                "discrimination": 1.0,
                "explanation": entry["explanation"],
            }
        )
        next_ids[domain_num] += 1
        existing.add(norm(entry["stem"]))
        added += 1

    args.bank_file.write_text(json.dumps(bank, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"parsed": len(parsed), "added": added, "skipped": skipped}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
