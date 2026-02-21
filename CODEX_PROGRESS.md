# Codex Progress Handoff

Last updated: 2026-02-21
Project: `/home/alex/alex-cyber-study`

## Goal in progress
Add CISSP PBQ variety while keeping pacing realistic:
- Keep PBQs sparse and delayed in CAT attempts.
- Add short, fast-completion variety items (diagram-style MCQ + simple PBQs).
- Preserve 60-question pace (target <= ~90 seconds for PBQ items).

## Completed
1. Added 30 PBQ items to `cat/question-bank.sample.json` (IDs `d1-pbq-dd1` .. `d8-pbq-or1`).
2. Added PBQ gating in CAT selector in `cat/app.js`:
- No PBQ before item 35.
- Max 4 PBQs per attempt.
- Uses `scoringPool` for CAT scoring path.
3. Validation currently passes:
- Command: `python3 scripts/validate_cat_bank.py cat/question-bank.sample.json`
- Result: `error_count: 0`, `warning_count: 0`, `item_count: 3582`.

## Partially complete
1. New variety script created: `scripts/add_diagram_items.py`.
- Contains 14 items total.
- Mix: ASCII-diagram MCQ + short dragdrop/ordering PBQ variants.
- Script exists but has NOT been applied to the bank yet.

## CRITICAL — DO NOT OVERWRITE THE QUESTION BANK

`cat/question-bank.sample.json` contains **3,599 hand-crafted, validated CISSP questions**.
This bank was built over many sessions and is the core asset of the project.

**Never do any of the following:**
- Generate new items and write them directly to `cat/question-bank.sample.json`, replacing existing content
- Run any script that opens the bank for writing (`'w'` mode) without first confirming it is strictly appending new items
- Use bulk AI-generation to replace or regenerate existing items

**Allowed bank operations:**
- Appending new items via validated scripts (e.g. `add_pbq_items.py`, `add_diagram_items.py`)
- Editing individual item fields (stem, explanation, choices) in place
- Running read-only scripts (validate, audit, lint, annotate)

If you are unsure whether a script will overwrite the bank, **read the script first** and confirm it opens the file in append/update mode, not replace mode. Always run validation after any bank change:
```bash
python3 scripts/validate_cat_bank.py cat/question-bank.sample.json
```
Expected: `error_count: 0`, `warning_count: 0`, `item_count: 3599` (or higher if items were added).

---

## Important current state
1. `cat/question-bank.sample.json` currently has PBQ additions only (no `d*-diagram-*` IDs present).
2. `cat/app.js` has PBQ throttle block in `selectNextItem()` (around line ~656).
3. Repository is dirty with many unrelated changes; do not revert unrelated files.

## Next steps for next Codex run
1. Apply variety items:
- `cd /home/alex/alex-cyber-study && python3 scripts/add_diagram_items.py`
2. Re-run validation:
- `python3 scripts/validate_cat_bank.py cat/question-bank.sample.json`
3. Spot-check final distribution and pacing:
- Verify only PBQ/item-type gating path in CAT is active and no duplicate gating exists elsewhere.
- Smoke test session flow in `cat/index.html` (question render, submit, review card).

## Optional tuning if requested
1. Make PBQ cap configurable in settings (default 4).
2. Gate by confidence/theta band instead of only question index:
- Example: allow PBQ only when `itemsAnswered >= 30` AND `theta > -0.25`.
3. Add a lightweight `hotspot` item type only if UI support is intentionally added (currently no dedicated hotspot renderer).

## References
- `cat/app.js`
- `cat/question-bank.sample.json`
- `scripts/add_pbq_items.py`
- `scripts/add_diagram_items.py`
