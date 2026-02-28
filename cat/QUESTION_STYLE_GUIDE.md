# CISSP Question Style Guide (Human-Feel)

This guide standardizes wording to preserve a real exam feel without making items mechanical.

## Core feel
- Use role-based scenario setup (`auditor`, `CISO`, `security engineer`, `business owner`).
- Frame decisions with managerial prompts: `BEST`, `MOST appropriate`, `FIRST`, `NEXT`.
- Keep one defensibly best answer, with distractors that are plausible but inferior in context.

## Preferred stem pattern
- Context: who + environment + constraint.
- Decision ask: one explicit decision point.
- Example shape: `Given <context>, which option is the BEST next action?`

## Distractor design
- Keep option lengths roughly comparable.
- Avoid test-wise cues (`all of the above`, `none of the above`).
- Avoid joke/obviously wrong distractors.
- Use near-miss distractors that fail by priority, timing, scope, or governance level.

## Ambiguity policy
- Good ambiguity: tradeoffs (risk, legal, operations, cost, time).
- Bad ambiguity: missing facts, contradictory wording, key/explanation mismatch.
- Do not create ambiguity through grammar noise.

## Explanation pattern
- Start with direct key: `Option X is correct...`
- Explain why best in context.
- Briefly explain why each distractor is less appropriate.
- Keep citation-backed rationale in `sourceIds`.

## Language guardrails
- Prefer plain, professional language over jargon density.
- Avoid overusing absolutes (`always`, `never`, `only`) unless conceptually required.
- Use active voice where possible.

## Lint usage
- Default (human feel):
  ```bash
  python3 scripts/item_quality_lint.py cat/question-bank.sample.json \
    --write-report cat/question-bank.quality.json \
    --profile human
  ```
- Strict (style-sensitive editing rounds):
  ```bash
  python3 scripts/item_quality_lint.py cat/question-bank.sample.json \
    --write-report cat/question-bank.quality.json \
    --profile strict
  ```
