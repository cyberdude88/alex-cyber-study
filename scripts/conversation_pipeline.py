#!/usr/bin/env python3
"""Project-local conversation pipeline for durable AI handoffs."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / ".conversation"
HISTORY_PATH = DATA_DIR / "history.jsonl"
CONTEXT_PATH = ROOT / "CONVERSATION_CONTEXT.md"


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def ensure_layout() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    HISTORY_PATH.touch(exist_ok=True)
    if not CONTEXT_PATH.exists():
        CONTEXT_PATH.write_text(
            "# Conversation Context\n\nNo checkpoints yet. Add one with:\n\n"
            "python3 scripts/conversation_pipeline.py add --title \"...\" --summary \"...\" --decisions \"...\" --next \"...\"\n",
            encoding="utf-8",
        )


def read_entries() -> list[dict]:
    ensure_layout()
    entries: list[dict] = []
    with HISTORY_PATH.open("r", encoding="utf-8") as handle:
        for raw in handle:
            line = raw.strip()
            if not line:
                continue
            try:
                payload = json.loads(line)
            except json.JSONDecodeError:
                continue
            if isinstance(payload, dict):
                entries.append(payload)
    return entries


def render_context(entries: list[dict], last: int) -> str:
    rows = entries[-last:] if last > 0 else entries
    lines = ["# Conversation Context", "", f"Updated: {utc_now()}", ""]

    if not rows:
        lines.append("No checkpoints yet.")
        return "\n".join(lines) + "\n"

    lines.extend(["## Recent Checkpoints", ""])
    for idx, row in enumerate(rows, start=1):
        lines.extend(
            [
                f"{idx}. [{row.get('timestamp', 'unknown')}] {row.get('title', '(untitled)')}",
                f"Summary: {row.get('summary', '')}",
                f"Decisions: {row.get('decisions', '')}",
                f"Next: {row.get('next', '')}",
                "",
            ]
        )

    lines.extend(
        [
            "## Paste Into New AI Chat",
            "",
            "```text",
            "Use this project context and continue from the latest checkpoint.",
            f"Project: {ROOT}",
            f"Reference file: {CONTEXT_PATH}",
            "Focus now on the latest `Next` item.",
            "```",
            "",
        ]
    )
    return "\n".join(lines)


def write_context(entries: list[dict], last: int) -> str:
    text = render_context(entries, last)
    CONTEXT_PATH.write_text(text, encoding="utf-8")
    return text


def cmd_init(args: argparse.Namespace) -> int:
    ensure_layout()
    text = write_context(read_entries(), args.last)
    print(f"Initialized: {HISTORY_PATH}")
    print(f"Updated: {CONTEXT_PATH}")
    if args.show:
        print()
        print(text)
    return 0


def cmd_add(args: argparse.Namespace) -> int:
    ensure_layout()
    entry = {
        "timestamp": utc_now(),
        "title": args.title.strip(),
        "summary": args.summary.strip(),
        "decisions": args.decisions.strip(),
        "next": args.next.strip(),
    }
    with HISTORY_PATH.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(entry, ensure_ascii=True) + "\n")

    entries = read_entries()
    write_context(entries, args.last)
    print(f"Added checkpoint: {entry['title']}")
    print(f"History: {HISTORY_PATH}")
    print(f"Context: {CONTEXT_PATH}")
    return 0


def cmd_context(args: argparse.Namespace) -> int:
    entries = read_entries()
    text = write_context(entries, args.last)
    print(text)
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Durable conversation pipeline for this project.")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_init = sub.add_parser("init", help="Create pipeline files and context.")
    p_init.add_argument("--last", type=int, default=8, help="How many recent checkpoints to keep in context.")
    p_init.add_argument("--show", action="store_true", help="Also print the generated context.")
    p_init.set_defaults(func=cmd_init)

    p_add = sub.add_parser("add", help="Add a checkpoint.")
    p_add.add_argument("--title", required=True, help="Short checkpoint title.")
    p_add.add_argument("--summary", required=True, help="What happened.")
    p_add.add_argument("--decisions", required=True, help="Decisions made.")
    p_add.add_argument("--next", required=True, help="Next concrete step.")
    p_add.add_argument("--last", type=int, default=8, help="How many recent checkpoints to keep in context.")
    p_add.set_defaults(func=cmd_add)

    p_context = sub.add_parser("context", help="Rebuild and print context.")
    p_context.add_argument("--last", type=int, default=8, help="How many recent checkpoints to keep in context.")
    p_context.set_defaults(func=cmd_context)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
