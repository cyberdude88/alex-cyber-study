# PBQ Workflow

This workflow keeps PBQs realistic, varied, and fast enough for exam pace.

## Targets
- Per-PBQ completion time: 60-90 seconds.
- PBQ count in CAT attempts: 2 max.
- PBQ timing: only after midpoint of CAT minimum length.
- Confidence gate: only show PBQ when theta >= -0.25.

## Supported Item Types
- `dragdrop`: select-all-that-apply style.
- `ordering`: sequence 3-5 steps.
- `mcq` with ASCII diagram in stem for visual variation.

## Authoring Rules
- Keep stems short and specific; avoid long story blocks.
- One task per item (no compound asks).
- Keep option count small:
  - `dragdrop`: 4-6 choices, 2-4 correct.
  - `ordering`: 3-5 choices.
- Use unambiguous answer keys.
- Add `sourceIds` for every item.
- Keep explanations concise and decisive.

## Difficulty Bands
- Low confidence / early bank usage: direct recall + short scenario.
- Mid confidence: practical application and prioritization.
- High confidence: judgment-heavy, manager-style tradeoffs.

## JSON Patterns
- `dragdrop`
  - Required: `type`, `choices`, `correctAnswers`.
- `ordering`
  - Required: `type`, `choices`, `correctOrder`.
- `diagram-mcq`
  - Use normal `mcq` structure with ASCII diagram in `stem`.

## Build Loop
1. Draft items in script (`scripts/add_pbq_items.py` or similar).
2. Insert into `cat/question-bank.sample.json`.
3. Validate:
   - `python3 scripts/validate_cat_bank.py cat/question-bank.sample.json`
4. Run a CAT smoke test and verify:
   - PBQs do not appear before midpoint.
   - No more than 2 PBQs appear.
   - PBQs are answerable quickly.
5. Trim or rewrite any PBQ consistently taking >90 seconds.

## Current Runtime Policy
Implemented in `cat/app.js`:
- `PBQ_MAX_PER_ATTEMPT = 2`
- `PBQ_THETA_MIN = -0.25`
- First question excludes PBQ.
- PBQ only eligible from midpoint onward (`minQuestions / 2`).
