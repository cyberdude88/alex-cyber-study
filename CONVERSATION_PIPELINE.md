# Conversation Pipeline

Use this to keep a clean, durable conversation trail for Codex/Claude work on this project.

## Canonical files

- Raw checkpoint history: `.conversation/history.jsonl`
- Reusable context for new chats: `CONVERSATION_CONTEXT.md`
- Existing handoff notes (optional): `CODEX_PROGRESS.md`

## Workflow

1. Initialize once:
```bash
cd /home/alex/alex-cyber-study
make conv-init
```

2. After each meaningful work block, add a checkpoint:
```bash
cd /home/alex/alex-cyber-study
TITLE="PBQ gating tuned" \
SUMMARY="Adjusted CAT selector to delay PBQs and capped count." \
DECISIONS="PBQ start at Q35; max 4 per attempt." \
NEXT="Run validation and smoke test session flow." \
make conv-add
```

3. At the start of any new AI session, rebuild/show context:
```bash
cd /home/alex/alex-cyber-study
make conv-context
```

4. Paste `CONVERSATION_CONTEXT.md` into the new chat and continue from the latest `Next` item.

## Direct script usage

```bash
python3 scripts/conversation_pipeline.py init
python3 scripts/conversation_pipeline.py add --title "..." --summary "..." --decisions "..." --next "..."
python3 scripts/conversation_pipeline.py context --last 8
```

## Rules for clean continuity

- Keep `summary` factual and short.
- Keep `decisions` explicit (what changed and why).
- Keep `next` as one concrete, testable action.
- Do not skip checkpoints after risky edits or scope changes.
