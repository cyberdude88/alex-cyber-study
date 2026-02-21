# CAT Bank Maintenance Workflow

This file defines the shared workflow for consistent, CI-safe updates.
Question wording standards: `cat/QUESTION_STYLE_GUIDE.md`

## Source of truth
- Bank source file: `cat/question-bank.sample.json`
- Generated QA artifacts:
  - `cat/question-bank.qa.json`
  - `cat/question-bank.manifest.json`
  - `cat/question-bank.accuracy.json`
  - `cat/question-bank.quality.json`

## Update process
1. Edit `cat/question-bank.sample.json` (new items, edits, explanations, difficulty/discrimination).
2. Regenerate source citations (required for analytics/source audit):
   ```bash
   python3 scripts/annotate_cat_sources.py cat/question-bank.sample.json
   ```
   The source catalog includes ISC2, NIST, ISO/IEC, IETF, PCI SSC, ISACA, AICPA, and EUR-Lex (GDPR).
3. Regenerate QA artifacts:
   ```bash
   python3 scripts/validate_cat_bank.py \
     cat/question-bank.sample.json \
     --write-report cat/question-bank.qa.json \
     --write-manifest cat/question-bank.manifest.json
   ```
4. Run explanation/key consistency audit:
   ```bash
   python3 scripts/audit_cat_accuracy.py \
     cat/question-bank.sample.json \
     --write-report cat/question-bank.accuracy.json
   ```
   Optional strict wording audit (paraphrase-sensitive):
   ```bash
   python3 scripts/audit_cat_accuracy.py \
     cat/question-bank.sample.json \
     --write-report cat/question-bank.accuracy.json \
     --strict-text-match
   ```
5. Ensure no errors in validator or accuracy-audit output.
6. Run item quality lint (ambiguity/distractor/wording hygiene):
   ```bash
   python3 scripts/item_quality_lint.py \
     cat/question-bank.sample.json \
     --write-report cat/question-bank.quality.json \
     --profile human
   ```
   Optional strict pass for focused editing rounds:
   ```bash
   python3 scripts/item_quality_lint.py \
     cat/question-bank.sample.json \
     --write-report cat/question-bank.quality.json \
     --profile strict
   ```
7. Ensure no lint errors (human-profile info/warnings are prioritization signals).
8. Commit the bank file and generated artifacts together.

## CI enforcement
GitHub Actions workflow `.github/workflows/cat-quality.yml` will:
- run the same validator,
- regenerate QA artifacts,
- fail if generated artifacts differ from committed files,
- syntax-check `cat/app.js`.

This keeps bank updates cross-referenced and synchronized.
