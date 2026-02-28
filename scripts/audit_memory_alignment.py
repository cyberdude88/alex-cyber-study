#!/usr/bin/env python3
"""
Audit CAT bank alignment against user memory artifacts.

This is a heuristic audit, not a canonical truth validator.
It highlights likely mismatches/gaps where bank items in memory-covered
areas do not appear to reflect the same topic vocabulary.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


NETWORK_SOURCE_HINTS = ("ietf", "tls", "network", "rfc")
STOPWORDS = {
    "and",
    "the",
    "for",
    "from",
    "with",
    "that",
    "this",
    "your",
    "into",
    "over",
    "under",
    "exact",
    "boundaries",
    "intent",
    "choices",
}


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", str(s or "").strip().lower())


def token_set(values: list[str]) -> set[str]:
    out: set[str] = set()
    for raw in values:
        for tok in re.findall(r"[a-z0-9][a-z0-9+/.-]*", raw.lower()):
            if len(tok) >= 3 and tok not in STOPWORDS:
                out.add(tok)
    return out


def infer_focus_domains(memory: dict[str, Any]) -> set[str]:
    focus: set[str] = set()
    for key in (memory.get("chapters") or {}).keys():
        if "chapter_11" in key.lower():
            focus.add("4. Communication and Network Security")
    if not focus:
        focus.add("4. Communication and Network Security")
    return focus


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def build_keywords(memory: dict[str, Any]) -> set[str]:
    kws = []
    kws.extend(memory.get("high_yield_topics") or [])
    for row in memory.get("question_bank_generated") or []:
        af = row.get("answer_focus")
        if isinstance(af, str):
            kws.append(af)
    # Seed practical network vocabulary to stabilize OCR/noise in memory.
    kws.extend(
        [
            "network",
            "architecture",
            "protocol",
            "routing",
            "segmentation",
            "firewall",
            "vpn",
            "tls",
            "ipsec",
            "tcp",
            "udp",
            "ipv6",
            "subnet",
            "nat",
            "ids",
            "ips",
            "dmz",
            "zero trust",
        ]
    )
    return token_set([norm(x) for x in kws if isinstance(x, str)])


def source_catalog_tokens(bank: dict[str, Any]) -> dict[str, set[str]]:
    out: dict[str, set[str]] = {}
    for sid, src in (bank.get("sourceCatalog") or {}).items():
        title = norm((src or {}).get("title", ""))
        pub = norm((src or {}).get("publisher", ""))
        out[str(sid)] = token_set([title, pub, sid])
    return out


def audit(bank: dict[str, Any], memory: dict[str, Any]) -> dict[str, Any]:
    keywords = build_keywords(memory)
    focus_domains = infer_focus_domains(memory)
    src_tokens = source_catalog_tokens(bank)

    findings = []
    scoped = 0
    for item in bank.get("items") or []:
        domain = str(item.get("domain", ""))
        if domain not in focus_domains:
            continue
        scoped += 1

        text = norm(f"{item.get('stem', '')} {item.get('explanation', '')}")
        text_tokens = token_set([text])
        kw_hits = sorted(t for t in keywords if t in text_tokens)

        item_sources = [str(s) for s in (item.get("sourceIds") or [])]
        has_network_source = any(
            any(h in " ".join(sorted(src_tokens.get(sid, set()))) for h in NETWORK_SOURCE_HINTS)
            for sid in item_sources
        )

        sev = None
        msg = None
        if len(kw_hits) < 2 and not has_network_source:
            sev = "warning"
            msg = "Low memory-topic overlap and no clearly network-centric source reference."
        elif len(kw_hits) < 2:
            sev = "info"
            msg = "Low memory-topic overlap."
        elif not has_network_source:
            sev = "info"
            msg = "No clearly network-centric source reference."

        if sev:
            findings.append(
                {
                    "severity": sev,
                    "item": item.get("id"),
                    "domain": domain,
                    "kw_hit_count": len(kw_hits),
                    "kw_hits_sample": kw_hits[:8],
                    "source_ids": item_sources,
                    "message": msg,
                }
            )

    warn = sum(1 for f in findings if f["severity"] == "warning")
    info = sum(1 for f in findings if f["severity"] == "info")
    return {
        "summary": {
            "scoped_items": scoped,
            "focus_domains": sorted(focus_domains),
            "keyword_count": len(keywords),
            "warning_count": warn,
            "info_count": info,
        },
        "findings": findings,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("bank", type=Path)
    ap.add_argument("--memory", type=Path, required=True)
    ap.add_argument("--write-report", type=Path)
    args = ap.parse_args()

    bank = load_json(args.bank)
    memory = load_json(args.memory)
    report = audit(bank, memory)

    print("SUMMARY:", json.dumps(report["summary"]))
    if args.write_report:
        args.write_report.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
