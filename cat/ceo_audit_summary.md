# CISSP Exam Quality Audit Report

**Bank:** `question-bank.quality-fixed.json`  
**Source items considered:** 947  
**Items audited successfully:** 947  
**Items errored:** 0  
**Overall quality pass (score ≥ 55):** 278 (29.4%)  
**Overall fail:** 669 (70.6%)  
**Average composite score:** 58.1/100

---

## Round Pass Rates

| Round | Pass | Fail | Pass% |
|-------|------|------|-------|
| Round 1 — Structural | 947 | 0 | 100.0% |
| Round 2 — CEO Mindset | 328 | 619 | 34.6% |
| Round 3 — Cognitive Level | 552 | 395 | 58.3% |
| Round 4 — Distractor Auth | 805 | 142 | 85.0% |
| Round 5 — Explanation Depth | 926 | 21 | 97.8% |
| Round 6 — Peer Review | 797 | 150 | 84.2% |

---

## Cognitive Level Distribution

| Level | Count | % |
|-------|-------|---|
| Judgment | 4 | 0.4% |
| Analysis | 548 | 57.9% |
| Application | 393 | 41.5% |
| Recall | 2 | 0.2% |
| Unknown | 0 | 0.0% |

---

## Domain Breakdown (avg composite score)

| Domain | Items | Avg Score | Pass% |
|--------|-------|-----------|-------|
| 1 Security and Risk Management | 53 | 62.2 | 83.0% |
| 1. Security and Risk Management | 108 | 58.3 | 63.9% |
| 2 Asset Security | 30 | 61.4 | 83.3% |
| 2. Asset Security | 63 | 56.7 | 61.9% |
| 3 Security Architecture and Engineering | 37 | 59.0 | 86.5% |
| 3. Security Architecture and Engineering | 85 | 56.4 | 61.2% |
| 4 Communication and Network Security | 39 | 57.0 | 64.1% |
| 4. Communication and Network Security | 75 | 57.3 | 61.3% |
| 5 Identity and Access Management | 38 | 59.5 | 78.9% |
| 5. Identity and Access Management (IAM) | 84 | 58.6 | 71.4% |
| 6 Security Assessment and Testing | 49 | 60.3 | 87.8% |
| 6. Security Assessment and Testing | 74 | 58.1 | 71.6% |
| 7 Security Operations | 38 | 59.6 | 81.6% |
| 7. Security Operations | 84 | 55.6 | 56.0% |
| 8 Software Development Security | 29 | 55.7 | 58.6% |
| 8. Software Development Security | 61 | 58.5 | 72.1% |

---

## Top 15 Most Frequent Flags

| Flag | Count |
|------|-------|
| `DISTRACTORS_NOT_ADDRESSED` | 946 |
| `NO_STANDARD_REF` | 860 |
| `D` | 812 |
| `A` | 749 |
| `C` | 746 |
| `B` | 701 |
| `CEO_MINDSET_FAIL` | 619 |
| `MGMT_CONTEXT` | 579 |
| `NO_OPTION_CONTRAST` | 559 |
| `GOV_CONCEPTS` | 550 |
| `NO_QUALIFIER` | 523 |
| `PEER_NO_QUALIFIER` | 523 |
| `QUALIFIERS` | 424 |
| `NO_CAUSAL_CONNECTOR` | 423 |
| `NO_GOVERNANCE_CONCEPT` | 397 |

---

## 20 Weakest Items (Priority for Rewrite)

| # | Item ID | Domain | Score | Key Flags |
|---|---------|--------|-------|-----------|
| 1 | `d4-q14` | 4 Communication and Network Securit | 40.9 | r2_ceo_mindset | r3_cognitive | r6_peer_review |
| 2 | `d3-q56` | 3. Security Architecture and Engine | 41.5 | r2_ceo_mindset | r3_cognitive | r4_distractor | r6_peer_review |
| 3 | `d7-q39` | 7. Security Operations | 42.8 | r2_ceo_mindset | r3_cognitive | r4_distractor | r6_peer_review |
| 4 | `d2-q53` | 2. Asset Security | 42.9 | r2_ceo_mindset | r3_cognitive | r4_distractor |
| 5 | `d3-pbq-dd1` | 3. Security Architecture and Engine | 43.5 | r2_ceo_mindset | r3_cognitive | r4_distractor |
| 6 | `d6-q20` | 6 Security Assessment and Testing | 43.7 | r2_ceo_mindset | r3_cognitive | r6_peer_review |
| 7 | `d3-q75` | 3. Security Architecture and Engine | 43.7 | r2_ceo_mindset | r3_cognitive | r4_distractor |
| 8 | `d4-q50` | 4. Communication and Network Securi | 43.8 | r2_ceo_mindset | r3_cognitive | r4_distractor | r5_explanation | r6_peer_review |
| 9 | `d3-q73` | 3. Security Architecture and Engine | 43.8 | r2_ceo_mindset | r3_cognitive | r6_peer_review |
| 10 | `d3-q90` | 3. Security Architecture and Engine | 43.8 | r2_ceo_mindset | r4_distractor | r6_peer_review |
| 11 | `d6-q51` | 6. Security Assessment and Testing | 44.0 | r2_ceo_mindset | r3_cognitive | r4_distractor | r6_peer_review |
| 12 | `d6-q92` | 6. Security Assessment and Testing | 44.0 | r2_ceo_mindset | r4_distractor | r6_peer_review |
| 13 | `d4-q61` | 4. Communication and Network Securi | 44.2 | r2_ceo_mindset | r4_distractor |
| 14 | `d2-q31` | 2. Asset Security | 44.4 | r2_ceo_mindset | r3_cognitive | r4_distractor |
| 15 | `d7-q89` | 7. Security Operations | 44.5 | r2_ceo_mindset | r3_cognitive | r4_distractor | r6_peer_review |
| 16 | `d4-q105` | 4. Communication and Network Securi | 44.6 | r2_ceo_mindset | r4_distractor |
| 17 | `d1-q55` | 1. Security and Risk Management | 44.8 | r2_ceo_mindset | r3_cognitive | r4_distractor |
| 18 | `d4-q56` | 4. Communication and Network Securi | 44.8 | r2_ceo_mindset | r6_peer_review |
| 19 | `d8-q16` | 8 Software Development Security | 45.0 | r2_ceo_mindset | r3_cognitive | r6_peer_review |
| 20 | `d1-q63` | 1. Security and Risk Management | 45.0 | r2_ceo_mindset | r4_distractor | r6_peer_review |

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
