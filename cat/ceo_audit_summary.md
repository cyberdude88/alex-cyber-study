# CISSP Exam Quality Audit Report

**Bank:** `question-bank.quality-fixed.json`  
**Source items considered:** 947  
**Items audited successfully:** 947  
**Items errored:** 0  
**Overall quality pass (score ≥ 55):** 811 (85.6%)  
**Overall fail:** 136 (14.4%)  
**Average composite score:** 81.3/100

---

## Round Pass Rates

| Round | Pass | Fail | Pass% |
|-------|------|------|-------|
| Round 6 — Peer Review | 811 | 136 | 85.6% |

---

## Cognitive Level Distribution

| Level | Count | % |
|-------|-------|---|
| Judgment | 0 | 0.0% |
| Analysis | 0 | 0.0% |
| Application | 0 | 0.0% |
| Recall | 0 | 0.0% |
| Unknown | 947 | 100.0% |

---

## Domain Breakdown (avg composite score)

| Domain | Items | Avg Score | Pass% |
|--------|-------|-----------|-------|
| 1 Security and Risk Management | 53 | 83.8 | 98.1% |
| 1. Security and Risk Management | 108 | 82.3 | 95.4% |
| 2 Asset Security | 30 | 86.4 | 96.7% |
| 2. Asset Security | 63 | 81.7 | 95.2% |
| 3 Security Architecture and Engineering | 37 | 77.6 | 100.0% |
| 3. Security Architecture and Engineering | 85 | 78.1 | 89.4% |
| 4 Communication and Network Security | 39 | 80.3 | 97.4% |
| 4. Communication and Network Security | 75 | 78.7 | 93.3% |
| 5 Identity and Access Management | 38 | 78.5 | 97.4% |
| 5. Identity and Access Management (IAM) | 84 | 83.0 | 90.5% |
| 6 Security Assessment and Testing | 49 | 83.9 | 93.9% |
| 6. Security Assessment and Testing | 74 | 82.1 | 98.6% |
| 7 Security Operations | 38 | 83.8 | 97.4% |
| 7. Security Operations | 84 | 81.0 | 97.6% |
| 8 Software Development Security | 29 | 75.1 | 89.7% |
| 8. Software Development Security | 61 | 82.4 | 100.0% |

---

## Top 15 Most Frequent Flags

| Flag | Count |
|------|-------|
| `NO_OPTION_CONTRAST` | 559 |
| `PEER_NO_QUALIFIER` | 523 |
| `NO_ROLE_OR_SCENARIO` | 206 |
| `CONDITIONAL_JUDGMENT_STEM` | 179 |
| `CORRECT_CHOICE_CUE` | 171 |
| `NEGATIVE_STEM` | 144 |
| `PEER_REVIEW_FAIL` | 136 |
| `CHOICE_LENGTH_SKEW` | 113 |
| `POSSIBLE_MULTI_KEY` | 62 |
| `ACRONYM_HEAVY` | 62 |
| `SCENARIO_THIN` | 49 |
| `CHOICE_STYLE_MISMATCH` | 39 |
| `PEER_RECALL_STYLE` | 32 |
| `WEAK_ABSOLUTE_DISTRACTORS` | 22 |
| `STEM_BLOATED` | 3 |

---

## 20 Weakest Items (Priority for Rewrite)

| # | Item ID | Domain | Score | Key Flags |
|---|---------|--------|-------|-----------|
| 1 | `d6-q20` | 6 Security Assessment and Testing | 36.0 | r6_peer_review |
| 2 | `d2-q46` | 2. Asset Security | 36.0 | r6_peer_review |
| 3 | `d8-q16` | 8 Software Development Security | 38.0 | r6_peer_review |
| 4 | `d8-q19` | 8 Software Development Security | 38.0 | r6_peer_review |
| 5 | `d4-q56` | 4. Communication and Network Securi | 38.0 | r6_peer_review |
| 6 | `d5-q31` | 5 Identity and Access Management | 44.0 | r6_peer_review |
| 7 | `d7-q39` | 7. Security Operations | 44.0 | r6_peer_review |
| 8 | `d7-q46` | 7. Security Operations | 44.0 | r6_peer_review |
| 9 | `d5-q92` | 5. Identity and Access Management ( | 44.0 | r6_peer_review |
| 10 | `d4-q14` | 4 Communication and Network Securit | 46.0 | r6_peer_review |
| 11 | `d1-q61` | 1. Security and Risk Management | 46.0 | r6_peer_review |
| 12 | `d3-q53` | 3. Security Architecture and Engine | 46.0 | r6_peer_review |
| 13 | `d1-q113` | 1. Security and Risk Management | 46.0 | r6_peer_review |
| 14 | `d3-q56` | 3. Security Architecture and Engine | 48.0 | r6_peer_review |
| 15 | `d2-q14` | 2 Asset Security | 50.0 | r6_peer_review |
| 16 | `d4-q49` | 4. Communication and Network Securi | 50.0 | r6_peer_review |
| 17 | `d4-q94` | 4. Communication and Network Securi | 50.0 | r6_peer_review |
| 18 | `d1-q32` | 1 Security and Risk Management | 52.0 | r6_peer_review |
| 19 | `d8-q28` | 8 Software Development Security | 52.0 | r6_peer_review |
| 20 | `d3-q43` | 3. Security Architecture and Engine | 52.0 | r6_peer_review |

---

## Failure Analysis

Items failing the composite threshold typically break in one of three ways:
they train technical recall instead of executive judgment, they use weak distractors,
or they do not read like polished human-written exam questions.

**Common failure patterns:**

- `RECALL_STEM` — stem asks 'what is X' instead of 'what should you do'

- `NO_QUALIFIER` — no BEST/FIRST/MOST qualifier to force prioritisation

- `TECH_CORRECT_ANSWER` — correct answer is a technical action, not governance

- `KNOWLEDGE_TYPE` — item tagged as knowledge, not scenario or judgment

- `HAS_WEAK_DISTRACTOR` — at least one obviously wrong distractor (Round 4)

- `PEER_REVIEW_FAIL` — item would likely be rejected in human editorial review

- `POSSIBLE_MULTI_KEY` — more than one option may look defensible on first read

- `CORRECT_CHOICE_CUE` — the key is guessable because it is conspicuously fuller than distractors


**Fix strategy:**

1. Convert recall stems to scenario stems with role + context + qualifier

2. Rewrite distractors to be plausible-but-wrong (governance near-misses)

3. Ensure correct answer reflects policy/governance before technical action

4. Add causal reasoning to explanations (why this beats the other options)

5. Normalize option grammar and length so choices feel parallel and comparably plausible

6. Remove cueing language and tighten stems until one answer is best for principled reasons
