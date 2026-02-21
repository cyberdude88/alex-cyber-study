#!/usr/bin/env python3
"""Validate CAT bank source usage against open-source-only policy."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlparse


ALLOWED_HOSTS = {
    "csrc.nist.gov",
    "pages.nist.gov",
    "www.nist.gov",
    "nist.gov",
    "www.rfc-editor.org",
    "rfc-editor.org",
    "owasp.org",
    "www.owasp.org",
    "www.isaca.org",
    "isaca.org",
    "www.pcisecuritystandards.org",
    "pcisecuritystandards.org",
    "www.aicpa-cima.com",
    "aicpa-cima.com",
    "www.enisa.europa.eu",
    "enisa.europa.eu",
    "www.cisa.gov",
    "cisa.gov",
    "eur-lex.europa.eu",
}

BANNED_TEXT = [
    r"sybex",
    r"oreilly",
    r"o'reilly",
    r"official study guide",
    r"brain dump",
    r"braindump",
]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bank", type=Path, default=Path("cat/question-bank.sample.json"))
    parser.add_argument("--catalog", type=Path, default=Path("sources/open_sources_catalog.json"))
    args = parser.parse_args()

    bank = json.loads(args.bank.read_text(encoding="utf-8"))
    allowed_catalog = json.loads(args.catalog.read_text(encoding="utf-8"))
    allowed_ids = set(allowed_catalog.keys())

    errors: list[str] = []
    warnings: list[str] = []

    source_catalog = bank.get("sourceCatalog", {})
    if not isinstance(source_catalog, dict):
        errors.append("sourceCatalog must be an object")
        source_catalog = {}

    for sid, src in source_catalog.items():
        if sid not in allowed_ids:
            errors.append(f"sourceCatalog id not in open catalog: {sid}")
            continue
        url = str(src.get("url", ""))
        host = (urlparse(url).hostname or "").lower()
        if host not in ALLOWED_HOSTS:
            errors.append(f"sourceCatalog host not allowed: {sid} -> {host or 'unknown'}")

    items = bank.get("items", [])
    if not isinstance(items, list):
        errors.append("items must be a list")
        items = []

    banned_re = [re.compile(pat, re.I) for pat in BANNED_TEXT]
    for i, item in enumerate(items, start=1):
        iid = item.get("id", f"item-{i}")
        for sid in item.get("sourceIds", []) or []:
            if sid not in allowed_ids:
                errors.append(f"{iid}: sourceId not allowed by open catalog: {sid}")
        blob = " ".join(
            [
                str(item.get("stem", "")),
                str(item.get("explanation", "")),
                " ".join(str(c) for c in item.get("choices", []) or []),
            ]
        )
        for pat in banned_re:
            if pat.search(blob):
                errors.append(f"{iid}: banned proprietary marker matched: {pat.pattern}")
                break

    print("OPEN-SOURCE VALIDATION")
    print(f"- items: {len(items)}")
    print(f"- sourceCatalog entries: {len(source_catalog)}")
    print(f"- errors: {len(errors)}")
    print(f"- warnings: {len(warnings)}")
    for w in warnings:
        print(f"WARNING: {w}")
    for e in errors:
        print(f"ERROR: {e}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
