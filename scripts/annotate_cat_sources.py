#!/usr/bin/env python3
"""Attach ISC2/NIST source citations to CAT bank items.

Adds/updates:
- top-level sourceCatalog
- per-item sourceIds
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

SOURCE_CATALOG: dict[str, dict[str, str]] = {
    "isc2-cissp-exam-outline-2024": {
        "title": "ISC2 CISSP Exam Outline (Effective April 15, 2024)",
        "url": "https://www.isc2.org/certifications/cissp/cissp-certification-exam-outline",
        "publisher": "ISC2",
    },
    "isc2-code-of-ethics": {
        "title": "ISC2 Code of Ethics",
        "url": "https://www.isc2.org/ethics",
        "publisher": "ISC2",
    },
    "nist-sp-800-37r2": {
        "title": "NIST SP 800-37 Rev. 2: Risk Management Framework for Information Systems and Organizations",
        "url": "https://csrc.nist.gov/pubs/sp/800/37/r2/final",
        "publisher": "NIST",
    },
    "nist-sp-800-30r1": {
        "title": "NIST SP 800-30 Rev. 1: Guide for Conducting Risk Assessments",
        "url": "https://csrc.nist.gov/pubs/sp/800/30/r1/final",
        "publisher": "NIST",
    },
    "nist-sp-800-34r1": {
        "title": "NIST SP 800-34 Rev. 1: Contingency Planning Guide for Federal Information Systems",
        "url": "https://csrc.nist.gov/pubs/sp/800/34/r1/final",
        "publisher": "NIST",
    },
    "nist-sp-800-61r2": {
        "title": "NIST SP 800-61 Rev. 2: Computer Security Incident Handling Guide",
        "url": "https://csrc.nist.gov/pubs/sp/800/61/r2/final",
        "publisher": "NIST",
    },
    "nist-sp-800-63-3": {
        "title": "NIST SP 800-63-3: Digital Identity Guidelines",
        "url": "https://pages.nist.gov/800-63-3/",
        "publisher": "NIST",
    },
    "nist-sp-800-115": {
        "title": "NIST SP 800-115: Technical Guide to Information Security Testing and Assessment",
        "url": "https://csrc.nist.gov/pubs/sp/800/115/final",
        "publisher": "NIST",
    },
    "nist-sp-800-161r1": {
        "title": "NIST SP 800-161 Rev. 1: Cybersecurity Supply Chain Risk Management Practices",
        "url": "https://csrc.nist.gov/pubs/sp/800/161/r1/final",
        "publisher": "NIST",
    },
    "nist-sp-800-218": {
        "title": "NIST SP 800-218: Secure Software Development Framework (SSDF)",
        "url": "https://csrc.nist.gov/pubs/sp/800/218/final",
        "publisher": "NIST",
    },
    "nist-sp-800-53r5": {
        "title": "NIST SP 800-53 Rev. 5: Security and Privacy Controls for Information Systems and Organizations",
        "url": "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final",
        "publisher": "NIST",
    },
    "nist-privacy-framework-1.0": {
        "title": "NIST Privacy Framework: A Tool for Improving Privacy through Enterprise Risk Management, Version 1.0",
        "url": "https://www.nist.gov/privacy-framework",
        "publisher": "NIST",
    },
    "nist-csf-2.0": {
        "title": "NIST Cybersecurity Framework (CSF) 2.0",
        "url": "https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20",
        "publisher": "NIST",
    },
    "nist-fips-199": {
        "title": "FIPS 199: Standards for Security Categorization of Federal Information and Information Systems",
        "url": "https://csrc.nist.gov/pubs/fips/199/final",
        "publisher": "NIST",
    },
    "nist-fips-200": {
        "title": "FIPS 200: Minimum Security Requirements for Federal Information and Information Systems",
        "url": "https://csrc.nist.gov/pubs/fips/200/final",
        "publisher": "NIST",
    },
    "iso-iec-27001-2022": {
        "title": "ISO/IEC 27001:2022 Information Security Management Systems — Requirements",
        "url": "https://www.iso.org/standard/27001",
        "publisher": "ISO/IEC JTC 1/SC 27",
    },
    "iso-iec-27002-2022": {
        "title": "ISO/IEC 27002:2022 Information Security Controls",
        "url": "https://www.iso.org/standard/75652.html",
        "publisher": "ISO/IEC JTC 1/SC 27",
    },
    "iso-22301-2019": {
        "title": "ISO 22301:2019 Business Continuity Management Systems — Requirements",
        "url": "https://www.iso.org/standard/75106.html",
        "publisher": "ISO/TC 292",
    },
    "ietf-rfc-8446": {
        "title": "RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3",
        "url": "https://www.rfc-editor.org/info/rfc8446",
        "publisher": "IETF",
    },
    "ietf-rfc-4949": {
        "title": "RFC 4949: Internet Security Glossary, Version 2",
        "url": "https://www.rfc-editor.org/info/rfc4949",
        "publisher": "IETF",
    },
    "pcissc-pci-dss": {
        "title": "PCI Data Security Standard (PCI DSS)",
        "url": "https://www.pcisecuritystandards.org/standards/pci-dss/",
        "publisher": "PCI Security Standards Council",
    },
    "isaca-cobit": {
        "title": "COBIT Framework Resources",
        "url": "https://www.isaca.org/resources/cobit",
        "publisher": "ISACA",
    },
    "aicpa-trust-services-criteria": {
        "title": "AICPA Trust Services Criteria",
        "url": "https://www.aicpa-cima.com/resources/article/trust-services-criteria",
        "publisher": "AICPA",
    },
    "eu-gdpr-2016-679": {
        "title": "Regulation (EU) 2016/679 (GDPR) — Official Journal Text",
        "url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
        "publisher": "European Union",
    },
}

DOMAIN_DEFAULTS = {
    "1": ["nist-sp-800-30r1", "nist-sp-800-37r2", "iso-iec-27001-2022"],
    "2": ["nist-sp-800-53r5", "iso-iec-27002-2022"],
    "3": ["nist-sp-800-53r5", "iso-iec-27002-2022", "nist-fips-199"],
    "4": ["nist-sp-800-53r5", "ietf-rfc-8446"],
    "5": ["nist-sp-800-63-3", "nist-sp-800-53r5", "ietf-rfc-4949"],
    "6": ["nist-sp-800-115", "nist-sp-800-53r5", "isaca-cobit"],
    "7": ["nist-sp-800-61r2", "nist-sp-800-34r1", "iso-22301-2019"],
    "8": ["nist-sp-800-218", "nist-sp-800-53r5", "iso-iec-27002-2022"],
}

KEYWORD_RULES: list[tuple[re.Pattern[str], list[str]]] = [
    (re.compile(r"\b(isc2|code of ethics|canon|brain dump|principals?)\b", re.I), ["isc2-code-of-ethics"]),
    (re.compile(r"\b(cissp exam outline|domain weights?)\b", re.I), ["isc2-cissp-exam-outline-2024"]),
    (re.compile(r"\b(rmf|ato|authorize|poa&m|fisma|categorize|select|implement|assess|monitor)\b", re.I), ["nist-sp-800-37r2"]),
    (re.compile(r"\b(risk assessment|qualitative|quantitative|ale|sle|aro|residual risk|risk appetite|risk tolerance)\b", re.I), ["nist-sp-800-30r1"]),
    (re.compile(r"\b(incident|breach|containment|eradication|recovery|forensic)\b", re.I), ["nist-sp-800-61r2"]),
    (re.compile(r"\b(rto|rpo|mtd|mtpd|bcp|drp|contingency)\b", re.I), ["nist-sp-800-34r1"]),
    (re.compile(r"\b(supply chain|third[- ]party|vendor|sbom|software provenance)\b", re.I), ["nist-sp-800-161r1"]),
    (re.compile(r"\b(ssdlc|sdlc|secure software|sast|dast|code review|threat modeling)\b", re.I), ["nist-sp-800-218"]),
    (re.compile(r"\b(authentication|authenticator|identity proofing|federat|sso|mfa|fido)\b", re.I), ["nist-sp-800-63-3"]),
    (re.compile(r"\b(penetration test|vulnerability assessment|security testing|audit evidence)\b", re.I), ["nist-sp-800-115"]),
    (re.compile(r"\b(privacy|pii|data minimization|purpose limitation|gdpr)\b", re.I), ["nist-privacy-framework-1.0", "eu-gdpr-2016-679"]),
    (re.compile(r"\b(fips 199|security categorization|high-water mark)\b", re.I), ["nist-fips-199"]),
    (re.compile(r"\b(fips 200|minimum security requirements)\b", re.I), ["nist-fips-200"]),
    (re.compile(r"\b(csf 2.0|cybersecurity framework)\b", re.I), ["nist-csf-2.0"]),
    (re.compile(r"\b(isms|iso 27001|iso/iec 27001)\b", re.I), ["iso-iec-27001-2022"]),
    (re.compile(r"\b(iso 27002|control objectives|code of practice)\b", re.I), ["iso-iec-27002-2022"]),
    (re.compile(r"\b(iso 22301|business continuity management system|bcms)\b", re.I), ["iso-22301-2019"]),
    (re.compile(r"\b(tls|ssl|rfc 8446|cipher suite)\b", re.I), ["ietf-rfc-8446"]),
    (re.compile(r"\b(glossary|taxonomy|security term)\b", re.I), ["ietf-rfc-4949"]),
    (re.compile(r"\b(pci dss|cardholder data|payment card|cde)\b", re.I), ["pcissc-pci-dss"]),
    (re.compile(r"\b(cobit|evaluate direct monitor|edm|apo|bai|dss|mea)\b", re.I), ["isaca-cobit"]),
    (re.compile(r"\b(soc 2|trust services criteria|aicpa)\b", re.I), ["aicpa-trust-services-criteria"]),
]


def infer_domain_key(raw: str) -> str:
    m = re.match(r"^\s*([1-8])", str(raw or ""))
    return m.group(1) if m else ""


def build_source_ids(item: dict[str, Any]) -> list[str]:
    text = " ".join(
        [
            str(item.get("stem", "")),
            str(item.get("explanation", "")),
            " ".join(str(c) for c in item.get("choices", [])),
            str(item.get("domain", "")),
        ]
    )

    source_ids: list[str] = ["isc2-cissp-exam-outline-2024"]

    domain_key = infer_domain_key(str(item.get("domain", "")))
    source_ids.extend(DOMAIN_DEFAULTS.get(domain_key, ["nist-sp-800-53r5"]))

    for pattern, matches in KEYWORD_RULES:
        if pattern.search(text):
            source_ids.extend(matches)

    deduped: list[str] = []
    seen = set()
    for sid in source_ids:
        if sid in SOURCE_CATALOG and sid not in seen:
            deduped.append(sid)
            seen.add(sid)

    # Keep cards readable.
    return deduped[:6]


def annotate(bank: dict[str, Any]) -> dict[str, Any]:
    items = bank.get("items")
    if not isinstance(items, list):
        raise ValueError("Top-level 'items' must be a list")

    bank["sourceCatalog"] = SOURCE_CATALOG
    for item in items:
        item["sourceIds"] = build_source_ids(item)
    return bank


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("bank_json", type=Path)
    parser.add_argument("--write", type=Path)
    args = parser.parse_args()

    bank = json.loads(args.bank_json.read_text(encoding="utf-8"))
    updated = annotate(bank)
    out_path = args.write or args.bank_json
    out_path.write_text(json.dumps(updated, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Annotated source citations for {len(updated.get('items', []))} items in {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
