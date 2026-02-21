#!/usr/bin/env python3
"""Contract checks for CAT runtime compatibility and UI regressions.

This script protects the live CAT app from accidental schema/UI drift.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def has_pbq_runtime_markers(app_js: str) -> bool:
    markers = (
        "renderDragDropQuestion",
        "renderOrderingQuestion",
        "renderHotspotQuestion",
        "input[name='dragdrop'",
    )
    return any(m in app_js for m in markers)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bank", type=Path, default=Path("cat/question-bank.sample.json"))
    parser.add_argument("--app", type=Path, default=Path("cat/app.js"))
    parser.add_argument("--index", type=Path, default=Path("cat/index.html"))
    args = parser.parse_args()

    errors: list[str] = []
    warnings: list[str] = []

    bank = load_json(args.bank)
    items = bank.get("items", [])
    if not isinstance(items, list):
        errors.append("question bank is missing top-level 'items' list")
        items = []

    runtime = args.app.read_text(encoding="utf-8")
    index_html = args.index.read_text(encoding="utf-8")

    type_counts: dict[str, int] = {}
    citation_items = 0
    for item in items:
        item_type = str(item.get("type", "mcq"))
        type_counts[item_type] = type_counts.get(item_type, 0) + 1
        if isinstance(item.get("sourceIds"), list) and item.get("sourceIds"):
            citation_items += 1

    source_catalog = bank.get("sourceCatalog")
    if not isinstance(source_catalog, dict) or not source_catalog:
        warnings.append("question bank has no sourceCatalog; analytics citation view will be empty")

    non_mcq = sum(v for k, v in type_counts.items() if k != "mcq")
    if non_mcq > 0 and not has_pbq_runtime_markers(runtime):
        errors.append(
            "bank contains non-MCQ items but CAT runtime does not expose PBQ render/eval handlers"
        )

    if '<input type="file"' in index_html:
        errors.append("legacy file-upload input found in cat/index.html")

    if "Load Sample Bank" in index_html:
        warnings.append("sample-bank UI text found in CAT page; verify this is intentional")

    print("CONTRACT SUMMARY:")
    print(f"- items: {len(items)}")
    print(f"- type_counts: {type_counts}")
    print(f"- non_mcq_items: {non_mcq}")
    print(f"- citation_items: {citation_items}/{len(items)}")
    print(f"- source_catalog_entries: {len(source_catalog) if isinstance(source_catalog, dict) else 0}")
    print(f"- pbq_runtime_markers: {has_pbq_runtime_markers(runtime)}")

    for w in warnings:
        print(f"WARNING: {w}")
    for e in errors:
        print(f"ERROR: {e}")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
