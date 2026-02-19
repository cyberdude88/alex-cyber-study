# CAT Bank Workflow (Claude + Codex)

This file defines the shared workflow so both assistants produce consistent, CI-safe updates.

## Source of truth
- Bank source file: `cat/question-bank.sample.json`
- Generated QA artifacts:
  - `cat/question-bank.qa.json`
  - `cat/question-bank.manifest.json`

## Update process
1. Edit `cat/question-bank.sample.json` (new items, edits, explanations, difficulty/discrimination).
2. Regenerate QA artifacts:
   ```bash
   python3 scripts/validate_cat_bank.py \
     cat/question-bank.sample.json \
     --write-report cat/question-bank.qa.json \
     --write-manifest cat/question-bank.manifest.json
   ```
3. Ensure no errors in validator output.
4. Commit the bank file and both generated artifacts together.

## CI enforcement
GitHub Actions workflow `.github/workflows/cat-quality.yml` will:
- run the same validator,
- regenerate QA artifacts,
- fail if generated artifacts differ from committed files,
- syntax-check `cat/app.js`.

This ensures Claude/Codex edits stay cross-referenced and synchronized.
