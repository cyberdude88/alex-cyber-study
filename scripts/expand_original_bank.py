#!/usr/bin/env python3
"""Expand a vetted question bank into a large synthetic practice bank.

This script duplicates only existing local items (assumed original-safe) and
produces many scenario/context variants without importing third-party text.
"""

from __future__ import annotations

import argparse
import copy
import json
import random
from pathlib import Path


STEM_PREFIXES = [
    "During a governance review, ",
    "In this scenario, ",
    "As part of a security operations drill, ",
    "During an internal audit, ",
    "For a quarterly controls assessment, ",
    "In a cross-functional security workshop, ",
    "While preparing for a compliance assessment, ",
    "In a risk committee briefing, ",
    "During a red-team/blue-team exercise, ",
    "As part of incident response planning, ",
]


def load_bank(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def shuffled_mcq(item: dict, rnd: random.Random) -> tuple[list[str], int]:
    choices = list(item["choices"])
    correct = int(item["correctIndex"])
    indexed = list(enumerate(choices))
    rnd.shuffle(indexed)
    new_choices = [c for _, c in indexed]
    new_correct = next(i for i, (old_idx, _) in enumerate(indexed) if old_idx == correct)
    return new_choices, new_correct


def shuffled_dragdrop(item: dict, rnd: random.Random) -> tuple[list[str], list[int]]:
    choices = list(item["choices"])
    indexed = list(enumerate(choices))
    rnd.shuffle(indexed)
    new_choices = [c for _, c in indexed]
    original_correct = set(item.get("correctAnswers", []))
    new_correct = [i for i, (old_idx, _) in enumerate(indexed) if old_idx in original_correct]
    return new_choices, sorted(new_correct)


def shuffled_ordering(item: dict, rnd: random.Random) -> tuple[list[str], list[int]]:
    choices = list(item["choices"])
    indexed = list(enumerate(choices))
    rnd.shuffle(indexed)
    old_to_new = {old_idx: new_idx for new_idx, (old_idx, _) in enumerate(indexed)}
    new_choices = [c for _, c in indexed]
    new_order = [old_to_new[old_idx] for old_idx in item.get("correctOrder", [])]
    return new_choices, new_order


def prefixed_stem(stem: str, rnd: random.Random) -> str:
    if stem.startswith(tuple(STEM_PREFIXES)):
        return stem
    prefix = rnd.choice(STEM_PREFIXES)
    # Keep first letter lower if stem starts with uppercase sentence.
    if stem and stem[0].isupper():
        stem = stem[0].lower() + stem[1:]
    return f"{prefix}{stem}"


def expand_items(items: list[dict], target_count: int, seed: int) -> list[dict]:
    rnd = random.Random(seed)
    out = [copy.deepcopy(i) for i in items]
    base = [copy.deepcopy(i) for i in items]
    n = 0

    while len(out) < target_count:
        src = base[n % len(base)]
        n += 1
        it = copy.deepcopy(src)
        it["id"] = f"{src['id']}__gen{n:05d}"
        it["variantOf"] = src["id"]
        it["isSyntheticVariant"] = True

        if "stem" in it and isinstance(it["stem"], str):
            it["stem"] = prefixed_stem(it["stem"], rnd)

        q_type = it.get("type", "mcq")
        if q_type == "mcq":
            it["choices"], it["correctIndex"] = shuffled_mcq(it, rnd)
        elif q_type == "dragdrop":
            it["choices"], it["correctAnswers"] = shuffled_dragdrop(it, rnd)
        elif q_type == "ordering":
            it["choices"], it["correctOrder"] = shuffled_ordering(it, rnd)
        else:
            # Unknown types are copied as-is to preserve compatibility.
            pass

        # Small bounded noise to avoid exact psychometric duplicates.
        if isinstance(it.get("difficulty"), (int, float)):
            it["difficulty"] = round(float(it["difficulty"]) + rnd.uniform(-0.12, 0.12), 3)
        if isinstance(it.get("discrimination"), (int, float)):
            it["discrimination"] = round(max(0.6, float(it["discrimination"]) + rnd.uniform(-0.08, 0.08)), 3)

        out.append(it)
    return out[:target_count]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bank", type=Path, default=Path("cat/question-bank.sample.json"))
    parser.add_argument("--target", type=int, default=2200)
    parser.add_argument("--seed", type=int, default=88)
    args = parser.parse_args()

    bank = load_bank(args.bank)
    items = bank.get("items", [])
    if not isinstance(items, list) or not items:
        raise SystemExit("Bank has no items to expand.")

    bank["items"] = expand_items(items, args.target, args.seed)
    args.bank.write_text(json.dumps(bank, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"items": len(bank["items"]), "target": args.target, "seed": args.seed}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
