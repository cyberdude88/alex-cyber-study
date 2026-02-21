#!/usr/bin/env python3
"""Generate original CAT questions from sanitized CISSP memory topic signals.

This generator intentionally uses only concept/topic strings from the memory file,
not any third-party question text, to produce fresh scenario-based MCQs.
"""

from __future__ import annotations

import argparse
import json
import random
import re
from pathlib import Path


BANNED_TOPIC_PATTERNS = [
    r"sybex",
    r"oreilly",
    r"o'reilly",
    r"study guide",
    r"exam essentials",
    r"default browser",
    r"https?://",
    r"chapter \d+ full text",
]

NETWORK_HINTS = {
    "osi",
    "tcp/ip",
    "tcpip",
    "ipv6",
    "unicast",
    "multicast",
    "broadcast",
    "anycast",
    "ipsec",
    "tls",
    "routing",
    "subnet",
    "switch",
    "router",
    "firewall",
    "nat",
    "vpn",
}

CONTEXTS = [
    "a regional healthcare network modernizing remote access",
    "a cloud-first retail company segmenting workloads",
    "a financial institution hardening east-west traffic",
    "a manufacturing firm deploying secure site-to-site links",
    "a government contractor isolating sensitive systems",
    "a SaaS provider scaling multi-tenant network controls",
    "a university redesigning campus backbone protections",
    "a logistics company improving branch connectivity security",
    "a telecom operator reducing lateral movement risk",
    "an enterprise integrating zero trust network access",
]

SOURCE_IDS = ["ietf-rfc-8446", "ietf-rfc-4949", "nist-sp-800-53r5", "nist-sp-800-41"]


def clean_topic(raw: str) -> str:
    topic = re.sub(r"\s+", " ", str(raw or "")).strip()
    topic = topic.strip(" -:;,.")
    return topic


def is_safe_topic(topic: str) -> bool:
    if len(topic) < 3 or len(topic) > 40:
        return False
    if not re.match(r"^[A-Za-z0-9/+ ._-]+$", topic):
        return False
    lower = topic.lower()
    for pat in BANNED_TOPIC_PATTERNS:
        if re.search(pat, lower):
            return False
    return True


def extract_topics(memory_obj: dict) -> list[str]:
    candidates: list[str] = []
    for key in ("high_yield_topics", "weak_areas", "exam_trap_patterns"):
        val = memory_obj.get(key)
        if isinstance(val, list):
            for item in val:
                if isinstance(item, str):
                    candidates.append(clean_topic(item))
    # Keep only safe short concept-like topics.
    topics = [t for t in candidates if is_safe_topic(t)]
    # De-dup preserving order.
    out: list[str] = []
    seen = set()
    for t in topics:
        k = t.lower()
        if k not in seen:
            out.append(t)
            seen.add(k)
    return out


def topic_domain(topic: str) -> str:
    if topic.lower() in NETWORK_HINTS:
        return "4. Communication and Network Security"
    return "3. Security Architecture and Engineering"


def build_mcq(topic: str, all_topics: list[str], idx: int, rnd: random.Random) -> dict:
    distractor_pool = [t for t in all_topics if t.lower() != topic.lower()]
    if len(distractor_pool) < 3:
        distractor_pool = distractor_pool + ["DNSSEC", "ARP", "NAT", "SIEM"]
    distractors = rnd.sample(distractor_pool, 3)
    choices = [topic] + distractors
    rnd.shuffle(choices)
    correct_index = choices.index(topic)

    context = rnd.choice(CONTEXTS)
    stem = (
        f"During a security architecture review at {context}, the team identifies "
        f"'{topic}' as a key control concept. Which option BEST aligns with that objective?"
    )

    explanation = (
        f"'{topic}' is the best fit for the stated objective in this scenario. "
        "The other options are valid technologies or controls in different contexts, "
        "but they do not map as directly to the identified design goal."
    )

    return {
        "id": f"mem-origin-q{idx:05d}",
        "type": "mcq",
        "domain": topic_domain(topic),
        "stem": stem,
        "choices": choices,
        "correctIndex": correct_index,
        "difficulty": round(rnd.uniform(-0.2, 0.8), 2),
        "discrimination": round(rnd.uniform(0.9, 1.3), 2),
        "questionType": "scenario",
        "explanation": explanation,
        "sourceIds": SOURCE_IDS[:],
        "origin": "memory_concept_original",
        "seedConcept": topic,
    }


def build_items(topics: list[str], target: int, seed: int) -> list[dict]:
    rnd = random.Random(seed)
    if not topics:
        raise ValueError("No safe topics found in memory file.")
    items: list[dict] = []
    n = 0
    while len(items) < target:
        n += 1
        topic = topics[(n - 1) % len(topics)]
        items.append(build_mcq(topic, topics, n, rnd))
    return items


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--memory", type=Path, default=Path("/home/alex/memory/cissp_agent_memory.json"))
    parser.add_argument("--bank", type=Path, default=Path("/home/alex/alex-cyber-study/cat/question-bank.sample.json"))
    parser.add_argument("--catalog", type=Path, default=Path("/home/alex/alex-cyber-study/sources/open_sources_catalog.json"))
    parser.add_argument("--target", type=int, default=2200)
    parser.add_argument("--seed", type=int, default=88)
    parser.add_argument("--replace-items", action="store_true")
    args = parser.parse_args()

    memory_obj = json.loads(args.memory.read_text(encoding="utf-8"))
    topics = extract_topics(memory_obj)

    bank = json.loads(args.bank.read_text(encoding="utf-8"))
    generated = build_items(topics, args.target, args.seed)

    if args.replace_items:
        bank["items"] = generated
    else:
        existing = bank.get("items", [])
        if not isinstance(existing, list):
            existing = []
        bank["items"] = existing + generated

    bank["sourceCatalog"] = json.loads(args.catalog.read_text(encoding="utf-8"))
    args.bank.write_text(json.dumps(bank, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(json.dumps({"safe_topics": len(topics), "generated": len(generated), "total_items": len(bank["items"])}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
