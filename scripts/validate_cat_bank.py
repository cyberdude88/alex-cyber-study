#!/usr/bin/env python3
"""Validate and fingerprint CAT question banks.

This script generates deterministic QA artifacts that CI enforces.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from urllib.parse import urlparse
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Any

BLUEPRINT = {
    "1. Security and Risk Management": 16,
    "2. Asset Security": 10,
    "3. Security Architecture and Engineering": 13,
    "4. Communication and Network Security": 13,
    "5. Identity and Access Management (IAM)": 13,
    "6. Security Assessment and Testing": 12,
    "7. Security Operations": 13,
    "8. Software Development Security": 10,
}

DOMAIN_ALIASES = {
    "1 Security and Risk Management": "1. Security and Risk Management",
    "2 Asset Security": "2. Asset Security",
    "3 Security Architecture and Engineering": "3. Security Architecture and Engineering",
    "4 Communication and Network Security": "4. Communication and Network Security",
    "5 Identity and Access Management": "5. Identity and Access Management (IAM)",
    "6 Security Assessment and Testing": "6. Security Assessment and Testing",
    "7 Security Operations": "7. Security Operations",
    "8 Software Development Security": "8. Software Development Security",
}

ALLOWED_SOURCE_HOSTS = {
    "nist.gov",
    "www.nist.gov",
    "csrc.nist.gov",
    "pages.nist.gov",
    "isc2.org",
    "www.isc2.org",
    "iso.org",
    "www.iso.org",
    "rfc-editor.org",
    "www.rfc-editor.org",
    "pcisecuritystandards.org",
    "www.pcisecuritystandards.org",
    "isaca.org",
    "www.isaca.org",
    "aicpa-cima.com",
    "www.aicpa-cima.com",
    "eur-lex.europa.eu",
}


@dataclass
class Finding:
    level: str
    message: str


def canonical_domain(raw: str) -> str:
    raw = str(raw or "").strip()
    if raw in BLUEPRINT:
        return raw
    if raw in DOMAIN_ALIASES:
        return DOMAIN_ALIASES[raw]
    return raw


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def validate(bank: dict[str, Any]) -> tuple[list[Finding], dict[str, Any]]:
    findings: list[Finding] = []
    items = bank.get("items")
    source_catalog = bank.get("sourceCatalog")

    if not isinstance(items, list):
        findings.append(Finding("error", "Top-level 'items' must be a list."))
        return findings, {}

    if not isinstance(source_catalog, dict):
        findings.append(Finding("error", "Top-level 'sourceCatalog' must be an object."))
        source_catalog = {}

    for sid, src in source_catalog.items():
        if not isinstance(src, dict):
            findings.append(Finding("error", f"sourceCatalog entry '{sid}' must be an object."))
            continue
        url = src.get("url")
        if not isinstance(url, str) or not url.strip():
            findings.append(Finding("error", f"sourceCatalog entry '{sid}' missing URL."))
            continue
        host = (urlparse(url).hostname or "").lower()
        if host not in ALLOWED_SOURCE_HOSTS:
            findings.append(Finding("error", f"sourceCatalog entry '{sid}' uses non-ISC2/NIST host: {host or 'unknown'}"))

    ids: list[str] = []
    domains: list[str] = []
    correct_positions: list[int] = []
    diff_bands: list[str] = []
    source_coverage = 0

    for i, item in enumerate(items, start=1):
        iid = item.get("id")
        if not iid:
            findings.append(Finding("error", f"Item {i} missing 'id'."))
        else:
            ids.append(str(iid))

        stem = item.get("stem")
        if not isinstance(stem, str) or not stem.strip():
            findings.append(Finding("error", f"Item {iid or i} missing/invalid 'stem'."))

        domain = canonical_domain(item.get("domain"))
        domains.append(domain)
        if domain not in BLUEPRINT:
            findings.append(Finding("warning", f"Item {iid or i} has non-blueprint domain: '{item.get('domain')}'."))

        choices = item.get("choices")
        ci = item.get("correctIndex")
        if not isinstance(choices, list) or len(choices) < 2:
            findings.append(Finding("error", f"Item {iid or i} has invalid 'choices'."))
        else:
            if not isinstance(ci, int) or ci < 0 or ci >= len(choices):
                findings.append(Finding("error", f"Item {iid or i} has invalid 'correctIndex'."))
            else:
                correct_positions.append(ci)

        difficulty = item.get("difficulty", 0)
        if not isinstance(difficulty, (int, float)):
            findings.append(Finding("error", f"Item {iid or i} has non-numeric 'difficulty'."))
        else:
            if difficulty <= -0.6:
                diff_bands.append("easy")
            elif difficulty >= 0.7:
                diff_bands.append("hard")
            else:
                diff_bands.append("medium")

        discrimination = item.get("discrimination", 1)
        if not isinstance(discrimination, (int, float)):
            findings.append(Finding("error", f"Item {iid or i} has non-numeric 'discrimination'."))

        explanation = item.get("explanation")
        if not isinstance(explanation, str) or not explanation.strip():
            findings.append(Finding("warning", f"Item {iid or i} missing explanation text."))

        source_ids = item.get("sourceIds")
        if not isinstance(source_ids, list) or not source_ids:
            findings.append(Finding("error", f"Item {iid or i} missing sourceIds citations."))
        else:
            unknown = [sid for sid in source_ids if sid not in source_catalog]
            if unknown:
                findings.append(Finding("error", f"Item {iid or i} references unknown sourceIds: {unknown}"))
            else:
                source_coverage += 1

    id_counts = Counter(ids)
    dup_ids = [k for k, v in id_counts.items() if v > 1]
    for dup in dup_ids:
        findings.append(Finding("error", f"Duplicate item id: {dup}"))

    domain_counts = Counter(domains)
    for d in BLUEPRINT:
        if domain_counts.get(d, 0) == 0:
            findings.append(Finding("warning", f"No questions for domain: {d}"))

    if len(items) < 100:
        findings.append(Finding("warning", "Bank has fewer than 100 items; cannot run full CAT exam model."))

    if correct_positions:
        pos_counts = Counter(correct_positions)
        max_share = max(pos_counts.values()) / len(correct_positions)
        if max_share >= 0.70:
            findings.append(Finding("warning", f"Answer-position bias detected: {dict(pos_counts)}"))

    if diff_bands:
        band_counts = Counter(diff_bands)
        for band in ("easy", "medium", "hard"):
            if band_counts.get(band, 0) == 0:
                findings.append(Finding("warning", f"No {band} difficulty items detected."))

    summary = {
        "item_count": len(items),
        "unique_item_ids": len(id_counts),
        "source_catalog_count": len(source_catalog),
        "source_coverage_count": source_coverage,
        "domain_counts": dict(domain_counts),
        "correct_position_counts": dict(Counter(correct_positions)),
        "difficulty_band_counts": dict(Counter(diff_bands)),
        "warning_count": sum(1 for f in findings if f.level == "warning"),
        "error_count": sum(1 for f in findings if f.level == "error"),
    }
    return findings, summary


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("bank_json", type=Path)
    parser.add_argument("--write-report", type=Path)
    parser.add_argument("--write-manifest", type=Path)
    args = parser.parse_args()

    raw_bytes = args.bank_json.read_bytes()
    bank = json.loads(raw_bytes.decode("utf-8"))

    findings, summary = validate(bank)

    report = {
        "bank_file": str(args.bank_json),
        "sha256": sha256_bytes(raw_bytes),
        "summary": summary,
        "findings": [f.__dict__ for f in findings],
    }

    manifest = {
        "bank_file": str(args.bank_json),
        "sha256": sha256_bytes(raw_bytes),
        "item_count": summary.get("item_count", 0),
        "unique_item_ids": summary.get("unique_item_ids", 0),
        "domain_counts": summary.get("domain_counts", {}),
    }

    if args.write_report:
        args.write_report.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    if args.write_manifest:
        args.write_manifest.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    for finding in findings:
        print(f"{finding.level.upper()}: {finding.message}")

    print("SUMMARY:", json.dumps(summary, ensure_ascii=False))

    has_errors = any(f.level == "error" for f in findings)
    return 1 if has_errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
