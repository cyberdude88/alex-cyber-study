#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

CORRECT_ANSWER_RE = re.compile(r"(\bCorrect\s+Answer\s*:\s*)(.+?)(?=(?:\.\s|$))", re.I)


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("bank", type=Path)
    ap.add_argument("--in-place", action="store_true")
    ap.add_argument("--out", type=Path)
    args = ap.parse_args()

    bank = json.loads(args.bank.read_text(encoding="utf-8"))
    items = bank.get("items")
    if not isinstance(items, list):
        raise SystemExit("Top-level 'items' must be a list")

    changed = 0
    examined = 0

    for item in items:
        choices = item.get("choices") if isinstance(item.get("choices"), list) else []
        ci = item.get("correctIndex")
        explanation = str(item.get("explanation") or "")
        if not explanation or not isinstance(ci, int) or not (0 <= ci < len(choices)):
            continue

        m = CORRECT_ANSWER_RE.search(explanation)
        if not m:
            continue

        examined += 1
        correct_choice = str(choices[ci]).strip().rstrip(".")
        existing = m.group(2).strip()
        if existing and (norm(existing) in norm(correct_choice) or norm(correct_choice) in norm(existing)):
            continue

        replacement = f"{m.group(1)}{correct_choice}"
        new_explanation = CORRECT_ANSWER_RE.sub(replacement, explanation, count=1)
        if new_explanation != explanation:
            item["explanation"] = new_explanation
            changed += 1

    out_path = args.bank if args.in_place or not args.out else args.out
    out_path.write_text(json.dumps(bank, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"examined_with_correct_answer_field: {examined}")
    print(f"updated_items: {changed}")
    print(f"wrote: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
