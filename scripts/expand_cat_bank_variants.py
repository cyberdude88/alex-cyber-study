#!/usr/bin/env python3
"""Expand CAT bank by generating deterministic stem variants.

For each original item, generates N variants that preserve answer key,
choices, explanation, and sourceIds. This increases novelty while keeping
traceable source citations.
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
from pathlib import Path
from typing import Any

LEADS = [
    "From a CISSP perspective,",
    "In this situation,",
    "Considering security governance and risk,",
    "As the security lead,",
]

TAILS = [
    "Select the best answer.",
    "Choose the most appropriate response.",
    "Pick the option that best aligns with CISSP practice.",
]

PREFIX_STRIP_RE = re.compile(r"^(scenario|applied|exam)\s+variant:\s*", re.I)


def stable_pick(options: list[str], key: str) -> str:
    h = hashlib.sha256(key.encode("utf-8")).hexdigest()
    idx = int(h[:8], 16) % len(options)
    return options[idx]


def normalize_ws(s: str) -> str:
    return " ".join(str(s).split())


def lower_first(s: str) -> str:
    if not s:
        return s
    return s[:1].lower() + s[1:]


def clean_base_stem(stem: str) -> str:
    base = normalize_ws(stem)
    base = PREFIX_STRIP_RE.sub("", base).strip()
    base = re.sub(r"[.?!]+\s*$", "", base).strip()
    return base


def make_variant_stem(stem: str, item_id: str, variant_idx: int) -> str:
    base = clean_base_stem(stem)
    lead = stable_pick(LEADS, f"{item_id}:l:{variant_idx}")
    tail = stable_pick(TAILS, f"{item_id}:t:{variant_idx}")
    style = int(hashlib.sha256(f"{item_id}:style:{variant_idx}".encode("utf-8")).hexdigest()[:8], 16) % 3

    if style == 0:
        return f"{lead} {lower_first(base)}? {tail}"
    if style == 1:
        return f"{base}? {tail}"
    return f"{lead} {lower_first(base)}?"


def base_items_only(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [
        item
        for item in items
        if not item.get("isSyntheticVariant") and not item.get("variantOf")
    ]


def expand(bank: dict[str, Any], variants_per_item: int) -> tuple[dict[str, Any], int]:
    items = bank.get("items")
    if not isinstance(items, list):
        raise ValueError("bank.items must be a list")
    originals = base_items_only(items)

    out_items: list[dict[str, Any]] = []
    for item in originals:
        out_items.append(item)

        item_id = str(item.get("id", ""))
        stem = str(item.get("stem", "")).strip()
        for n in range(1, variants_per_item + 1):
            v = copy.deepcopy(item)
            v["id"] = f"{item_id}__v{n}"
            v["stem"] = make_variant_stem(stem, item_id, n)
            v["variantOf"] = item_id
            v["isSyntheticVariant"] = True
            out_items.append(v)

    bank["items"] = out_items
    return bank, len(originals)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("bank", type=Path)
    ap.add_argument("--variants-per-item", type=int, default=3)
    ap.add_argument("--in-place", action="store_true")
    ap.add_argument("--out", type=Path)
    args = ap.parse_args()

    raw = json.loads(args.bank.read_text(encoding="utf-8"))
    expanded, original_count = expand(raw, args.variants_per_item)

    out_path = args.bank if args.in_place or not args.out else args.out
    out_path.write_text(json.dumps(expanded, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    new_count = len(expanded.get("items", []))
    print(f"Expanded bank written to {out_path}")
    print(f"items: {new_count}")
    if original_count > 0:
        print(f"base_items: {original_count}")
        print(f"multiplier: {new_count / original_count:.2f}x")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
