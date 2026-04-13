#!/usr/bin/env python3
"""
cissp_noise_wrap_bank.py

Two things in one pass:

1. NOISE-WRAPPED VARIANTS
   For every L2 and L3 item in the augmented bank, generate a new variant
   whose stem is wrapped in a realistic-but-irrelevant organizational scenario.
   The test-taker must strip out the noise and locate the actual question
   keywords to answer correctly.  Choices and correctIndex are NEVER changed.
   Noise-wrapped variants are marked aug_tier="L3" and difficulty = original + 0.35.
   L1 items (difficulty < -0.5) are excluded.

2. AI / QUANTUM NEW QUESTIONS
   A curated set of CISSP-style questions on AI security and post-quantum
   cryptography — topics appearing in current ISC2 pilot questions.
   Written at governance / executive level (BEST, FIRST, MOST qualifiers,
   policy-before-technology answers).

Output
------
  ../cat/question-bank.extended.json
    — All 3599 originals
    + noise-wrapped variants for every L2/L3 item
    + new AI/quantum items

Usage
-----
  python3 cissp_noise_wrap_bank.py
  python3 cissp_noise_wrap_bank.py --bank ../cat/question-bank.augmented.json
  python3 cissp_noise_wrap_bank.py --dry-run          # stats only, no file write
  python3 cissp_noise_wrap_bank.py --domain "3. Security Architecture and Engineering"
"""

import argparse
import json
import random
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR  = Path(__file__).resolve().parent
REPO_ROOT   = SCRIPT_DIR.parent
DEFAULT_BANK = REPO_ROOT / "cat" / "question-bank.augmented.json"
OUTPUT_BANK  = REPO_ROOT / "cat" / "question-bank.extended.json"

# ---------------------------------------------------------------------------
# Noise pools — all orthogonal to any CISSP question topic
# ---------------------------------------------------------------------------

ORG_TYPES = [
    "A multinational financial services company with operations in 23 countries and approximately 18,000 employees",
    "A regional healthcare network operating seven hospitals and forty-two outpatient clinics",
    "A publicly traded technology firm undergoing post-merger integration following a $1.4B acquisition",
    "A federal civilian agency responsible for critical infrastructure coordination",
    "A multinational pharmaceutical company subject to FDA 21 CFR Part 11 and EU GxP requirements",
    "A global logistics provider managing supply chains across six continents",
    "A mid-size insurance carrier with 4,200 employees and three regional data centers",
    "A defense contractor holding multiple facility clearances under the National Industrial Security Program",
    "A large retail conglomerate operating both brick-and-mortar and e-commerce channels",
    "A state government agency responsible for tax administration and constituent services",
    "A cloud-native SaaS company with a distributed workforce across 14 time zones",
    "A credit union serving 280,000 members and subject to NCUA examination",
    "A university research institution managing classified federal research grants",
    "A publicly traded energy utility operating generation, transmission, and distribution assets",
    "An international law firm handling matters across 30 practice areas and 19 offices",
]

SITUATION_NOISE = [
    "is preparing for its annual SOC 2 Type II audit scheduled for next quarter",
    "recently completed a ransomware recovery exercise following a tabletop simulation",
    "is onboarding a new managed security service provider under a five-year contract",
    "has just concluded a board-directed security program maturity assessment",
    "is migrating 60% of its on-premises workloads to a multi-cloud environment over 18 months",
    "is integrating a recently acquired subsidiary with a separate Active Directory forest",
    "is responding to an increase in spear-phishing campaigns targeting finance personnel",
    "has received a regulatory finding requiring remediation within 90 days",
    "is conducting a strategic review of its identity and access management architecture",
    "recently appointed a new CISO following the departure of the previous executive",
    "is implementing a zero-trust architecture framework across its enterprise",
    "has engaged a law firm to advise on cybersecurity liability following a third-party breach",
    "is expanding operations into two new jurisdictions with differing data protection regimes",
    "has received a letter of inquiry from a regulatory body regarding its data handling practices",
    "is preparing its annual cybersecurity report for the board's audit and risk committee",
]

TECH_NOISE = [
    "The organization's infrastructure spans Windows Server 2022 environments and Linux-based containerized workloads orchestrated by Kubernetes 1.29.",
    "Network segmentation is enforced using next-generation firewalls with 18 defined VLANs across the corporate LAN.",
    "The primary identity provider is a federated Microsoft Entra ID tenant with SAML 2.0 integration to eleven SaaS platforms.",
    "Email is routed through a cloud-hosted gateway applying DMARC, DKIM, and SPF enforcement with a quarantine policy.",
    "The SIEM aggregates logs from 2,300 endpoints, 14 cloud accounts, and four on-premises data center segments.",
    "Endpoint detection and response agents are deployed on 94% of managed devices, with a 6% exception backlog tracked in the risk register.",
    "The organization maintains a 4-hour RTO and 1-hour RPO for Tier 1 applications, tested annually in a full failover exercise.",
    "Vulnerability scanning runs bi-weekly against all internet-facing assets, with a 30-day SLA for critical finding remediation.",
    "Data loss prevention controls are deployed at email, web proxy, and endpoint layers with 220 active policy rules.",
    "The organization uses a GRC platform to maintain its control library, map controls to NIST CSF 2.0, and track exceptions.",
    "Privileged access management is enforced for all administrative accounts using session recording and just-in-time provisioning.",
    "A recent third-party penetration test produced 14 findings: 2 critical, 5 high, 5 medium, and 2 low.",
    "Cryptographic standards are governed by a policy requiring AES-256 for data at rest and TLS 1.3 for data in transit.",
    "The organization's cloud environment uses infrastructure-as-code pipelines with automated security scanning gates.",
    "Backup retention follows a 3-2-1 strategy with immutable off-site copies tested quarterly for restore integrity.",
]

PERSONNEL_NOISE = [
    "The CISO, who reports directly to the CEO and has a dotted line to the board's risk committee,",
    "A senior security architect with 14 years of experience in the sector,",
    "The organization's recently hired Chief Privacy Officer,",
    "A security program manager overseeing a cross-functional remediation workstream,",
    "The VP of Enterprise Risk, acting as the executive sponsor for the security program,",
    "A lead security analyst assigned to the threat intelligence function,",
    "The Director of IT Compliance, who coordinates with external auditors and regulatory liaisons,",
    "A GRC manager responsible for maintaining the organization's control framework,",
    "The newly appointed Deputy CISO, transitioning into the role after a lateral move from operations,",
    "An external security consultant engaged to provide an independent assessment,",
]

TASK_FRAMING = [
    "must determine the BEST course of action.",
    "is advising the executive team.",
    "is preparing a recommendation for the board.",
    "is reviewing the organization's approach to this issue.",
    "needs to prioritize next steps.",
    "is evaluating options for the security program.",
]

# ---------------------------------------------------------------------------
# Noise wrappers — three tiers of wrapping depth
# ---------------------------------------------------------------------------

def _seed_for(item_id: str) -> int:
    h = 0
    for ch in f"noisewrap|{item_id}":
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return h


def build_noise_wrap(item: dict, rng: random.Random, difficulty: float) -> str:
    """
    Return a noise-wrapped stem.  The original question text appears at the end,
    preceded by an organizational scenario containing irrelevant details.
    """
    org   = rng.choice(ORG_TYPES)
    sit   = rng.choice(SITUATION_NOISE)
    tech  = rng.choice(TECH_NOISE)
    pers  = rng.choice(PERSONNEL_NOISE)
    task  = rng.choice(TASK_FRAMING)
    core  = item["stem"].strip()

    # Depth scales with difficulty
    if difficulty >= 1.0:
        # Heavy wrap — 5 sentences before the core question
        wrap = (
            f"{org} {sit}. "
            f"{tech} "
            f"{rng.choice(TECH_NOISE)} "
            f"{pers} {task}\n\n"
            f"{core}"
        )
    elif difficulty >= 0.5:
        # Medium wrap — 3 sentences
        wrap = (
            f"{org} {sit}. "
            f"{tech} "
            f"{pers} {task}\n\n"
            f"{core}"
        )
    else:
        # Light wrap — 2 sentences
        wrap = (
            f"{org} {sit}. "
            f"{pers} {task}\n\n"
            f"{core}"
        )

    return wrap


# ---------------------------------------------------------------------------
# AI / Quantum new questions
# ---------------------------------------------------------------------------

AI_QUANTUM_ITEMS = [
    # ── AGENTIC AI ──────────────────────────────────────────────────────────
    {
        "id": "aq-ai-001",
        "domain": "1. Security and Risk Management",
        "stem": (
            "An organization is deploying agentic AI systems that autonomously execute "
            "multi-step business processes, access external APIs, and modify production "
            "data without human approval at each step. What is the FIRST risk a security "
            "executive should address before authorizing production deployment?"
        ),
        "choices": [
            "Loss of meaningful human oversight and the inability to attribute or reverse autonomous actions",
            "Increased latency introduced by AI decision-making compared to manual workflows",
            "The cost of additional compute infrastructure required to run agentic models at scale",
            "Potential bias in the AI model's training data affecting output quality",
        ],
        "correctIndex": 0,
        "difficulty": 1.1,
        "discrimination": 1.3,
        "explanation": (
            "Agentic AI introduces a principal-agent problem at scale: the system acts on behalf of the "
            "organization but may pursue sub-goals that diverge from intent, and each autonomous step "
            "compounds downstream impact. Before deployment, governance must establish human-in-the-loop "
            "checkpoints, clear authorization boundaries, and reversibility controls. Latency, cost, and "
            "bias are real concerns but secondary to the foundational accountability and control gap."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["ISC2-CISSP-2024-AI"],
    },
    {
        "id": "aq-ai-002",
        "domain": "1. Security and Risk Management",
        "stem": (
            "A threat intelligence team discovers that an adversary is probing an organization's "
            "agentic AI workflow by crafting inputs that cause the agent to take actions outside "
            "its intended scope — including accessing systems the agent was never explicitly "
            "authorized to reach. Which control BEST mitigates this class of attack?"
        ),
        "choices": [
            "Enforcing least-privilege authorization boundaries on every action the agent can initiate, independent of its instruction source",
            "Requiring all agent inputs to be digitally signed before processing",
            "Deploying a secondary AI model to review the primary agent's outputs before they are executed",
            "Encrypting all communication channels between the agent and the systems it accesses",
        ],
        "correctIndex": 0,
        "difficulty": 1.2,
        "discrimination": 1.4,
        "explanation": (
            "This describes a prompt injection or indirect instruction hijacking attack against an agentic "
            "system. The correct mitigation is structural: the agent's authorization boundary must be "
            "enforced by the systems it calls, not trusted to the agent's own reasoning. Least-privilege "
            "access controls — independent of what the agent believes it was instructed to do — break the "
            "attack chain. Digital signatures, secondary reviewers, and encryption do not prevent an agent "
            "from misusing legitimately authorized capabilities."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["ISC2-CISSP-2024-AI"],
    },
    {
        "id": "aq-ai-003",
        "domain": "7. Security Operations",
        "stem": (
            "A security operations center integrates a large language model to triage alerts, "
            "draft incident summaries, and recommend containment actions. Analysts begin noticing "
            "that the model occasionally produces plausible-sounding but factually incorrect "
            "containment recommendations. What is the MOST important governance control?"
        ),
        "choices": [
            "Requiring human analyst review and approval before any AI-recommended containment action is executed",
            "Fine-tuning the model on historical incident data to improve recommendation accuracy",
            "Disabling the model's ability to generate containment recommendations until accuracy reaches 95%",
            "Logging all model outputs to a SIEM for retrospective audit",
        ],
        "correctIndex": 0,
        "difficulty": 0.9,
        "discrimination": 1.2,
        "explanation": (
            "AI-generated recommendations that are plausible but incorrect represent a hallucination risk "
            "that can cause harm if acted upon automatically. The governing control is human accountability: "
            "a qualified analyst must review and approve before execution. Fine-tuning may improve accuracy "
            "over time but cannot eliminate hallucination. Disabling the tool entirely foregoes its value. "
            "Logging captures what happened but does not prevent harm."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["ISC2-CISSP-2024-AI"],
    },
    {
        "id": "aq-ai-004",
        "domain": "3. Security Architecture and Engineering",
        "stem": (
            "An attacker systematically feeds subtly mislabeled examples into a machine learning "
            "model's training pipeline over several weeks, causing the model to misclassify a "
            "specific malware family as benign. Which attack category does this represent, and "
            "what is the PRIMARY defensive control?"
        ),
        "choices": [
            "Training data poisoning — mitigated by provenance controls and integrity validation of all training datasets before ingestion",
            "Adversarial evasion — mitigated by adversarial training and input perturbation detection at inference time",
            "Model inversion — mitigated by differential privacy applied to model outputs",
            "Membership inference — mitigated by restricting access to model confidence scores",
        ],
        "correctIndex": 0,
        "difficulty": 1.1,
        "discrimination": 1.3,
        "explanation": (
            "Systematically corrupting training data to alter model behavior is a poisoning attack. "
            "The root control is supply chain integrity for training data: provenance tracking, "
            "cryptographic hashing, and validation pipelines that can detect distributional anomalies "
            "before a poisoned dataset reaches production training. Adversarial evasion, model inversion, "
            "and membership inference are distinct threat classes with different attack vectors and mitigations."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["ISC2-CISSP-2024-AI"],
    },
    {
        "id": "aq-ai-005",
        "domain": "2. Asset Security",
        "stem": (
            "An organization allows business units to query a shared generative AI model using "
            "prompts that frequently include customer names, account numbers, and contract terms. "
            "The security team is concerned that this data may be retained and used in future "
            "model responses to other users. What is the FIRST step the CISO should take?"
        ),
        "choices": [
            "Classify the data categories being submitted to the model and evaluate whether the vendor's data retention and training policies are compatible with the organization's obligations",
            "Prohibit all use of generative AI until a full data loss prevention solution is deployed at the prompt layer",
            "Require all prompts to be reviewed by the legal team before submission to the model",
            "Deploy network-level DLP to block personally identifiable information from reaching the AI endpoint",
        ],
        "correctIndex": 0,
        "difficulty": 0.9,
        "discrimination": 1.2,
        "explanation": (
            "The foundational step is data classification and a gap assessment against the vendor's actual "
            "data handling practices. Without knowing what data is being submitted and whether the vendor's "
            "retention and training policies permit it, the organization cannot make a risk-based decision. "
            "Blanket prohibition, legal review of each prompt, and DLP are potentially valid downstream "
            "controls but cannot be appropriately scoped without the classification and vendor assessment first."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["ISC2-CISSP-2024-AI"],
    },

    # ── POST-QUANTUM CRYPTOGRAPHY ────────────────────────────────────────────
    {
        "id": "aq-pqc-001",
        "domain": "3. Security Architecture and Engineering",
        "stem": (
            "A CISO learns that a nation-state adversary may already possess cryptographically "
            "relevant quantum computers and has been conducting 'harvest now, decrypt later' "
            "collection campaigns against the organization's encrypted communications for the "
            "past three years. What is the MOST urgent security priority?"
        ),
        "choices": [
            "Identify and reclassify any long-lived sensitive data encrypted under RSA or ECC that was transmitted during the collection window, and initiate a crypto-agility roadmap to migrate to NIST-approved post-quantum algorithms",
            "Immediately replace all TLS certificates with quantum-resistant certificates across every public-facing service",
            "Deploy quantum key distribution infrastructure to protect future communications",
            "Require all employees to use end-to-end encrypted messaging applications for sensitive discussions",
        ],
        "correctIndex": 0,
        "difficulty": 1.3,
        "discrimination": 1.5,
        "explanation": (
            "Harvest-now-decrypt-later (HNDL) attacks mean that historical ciphertext captured under "
            "RSA or ECC is already at risk once a cryptographically relevant quantum computer exists — "
            "the adversary doesn't need one today to benefit from data collected today. The immediate "
            "priority is assessing what sensitive data was exposed and building a crypto-agility roadmap "
            "to migrate to NIST PQC standards (CRYSTALS-Kyber / ML-KEM for key encapsulation, "
            "CRYSTALS-Dilithium / ML-DSA for signatures). Mass certificate replacement without a "
            "migration plan is operationally disruptive and incomplete. QKD requires physical "
            "infrastructure and does not address the historical exposure. Messaging applications "
            "address future comms only."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["NIST-PQC-2024", "ISC2-CISSP-2024-QC"],
    },
    {
        "id": "aq-pqc-002",
        "domain": "3. Security Architecture and Engineering",
        "stem": (
            "A security architect is updating the organization's cryptographic standards policy "
            "to address the threat posed by Grover's algorithm running on a quantum computer. "
            "Which symmetric encryption adjustment is MOST appropriate?"
        ),
        "choices": [
            "Mandate AES-256 for all symmetric encryption, as Grover's algorithm effectively halves the security of symmetric key lengths, reducing AES-128 to 64-bit equivalent security",
            "Replace AES with a lattice-based symmetric cipher approved under NIST's post-quantum standardization process",
            "Double the IV length used in all AES-GCM implementations to compensate for quantum speedup",
            "Require all AES keys to be derived using a quantum random number generator",
        ],
        "correctIndex": 0,
        "difficulty": 1.0,
        "discrimination": 1.3,
        "explanation": (
            "Grover's algorithm provides a quadratic speedup for searching unstructured spaces — for a "
            "symmetric key of n bits, it reduces the effective security to n/2 bits. AES-128 becomes "
            "equivalent to 64-bit security against a quantum adversary, which is considered inadequate. "
            "AES-256 retains 128-bit equivalent security, which remains acceptable. NIST's PQC process "
            "addresses asymmetric cryptography (key exchange and signatures); AES itself is quantum-resistant "
            "at the 256-bit key length. IV length and QRNG do not address the Grover speedup against key search."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["NIST-PQC-2024", "ISC2-CISSP-2024-QC"],
    },
    {
        "id": "aq-pqc-003",
        "domain": "3. Security Architecture and Engineering",
        "stem": (
            "An organization's PKI team asks whether their current RSA-4096 root CA certificates "
            "will remain secure in a post-quantum environment. What is the CORRECT technical assessment?"
        ),
        "choices": [
            "RSA-4096 is vulnerable to Shor's algorithm, which can factor large integers in polynomial time on a sufficiently powerful quantum computer, making migration to NIST PQC signature algorithms such as ML-DSA necessary",
            "RSA-4096 is safe because the key length exceeds the threshold at which Shor's algorithm provides a practical advantage",
            "RSA-4096 is vulnerable only to Grover's algorithm, so doubling the key length to RSA-8192 provides adequate post-quantum protection",
            "RSA-4096 certificates are unaffected because quantum computers cannot process the X.509 certificate format",
        ],
        "correctIndex": 0,
        "difficulty": 1.0,
        "discrimination": 1.3,
        "explanation": (
            "Shor's algorithm solves integer factorization and discrete logarithm problems in polynomial "
            "time, which directly breaks RSA and ECC regardless of key length — a quantum computer "
            "powerful enough to run Shor's at scale would factor RSA-4096 as readily as RSA-2048. "
            "Increasing key length does not help because Shor's is a polynomial-time algorithm, not "
            "a brute-force attack that Grover's applies to. Migration to NIST-standardized post-quantum "
            "signature algorithms (ML-DSA, formerly CRYSTALS-Dilithium, or SLH-DSA/SPHINCS+) is required."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["NIST-PQC-2024", "ISC2-CISSP-2024-QC"],
    },
    {
        "id": "aq-pqc-004",
        "domain": "1. Security and Risk Management",
        "stem": (
            "An executive team asks the CISO to estimate when post-quantum cryptography migration "
            "must be complete and how to prioritize which systems to migrate first. What is the "
            "BEST framework for answering both questions?"
        ),
        "choices": [
            "Estimate the 'mosaic window' — the expected time until a cryptographically relevant quantum computer exists — then prioritize migration by data sensitivity and the expected lifespan of that data, starting with long-lived secrets and critical PKI infrastructure",
            "Complete all migrations within 12 months because NIST has finalized post-quantum standards and the threat is now considered active",
            "Migrate web-facing TLS endpoints first because they represent the largest attack surface by volume",
            "Wait for commercial quantum computers to be publicly demonstrated before initiating migration, as current hardware is insufficient to threaten production cryptography",
        ],
        "correctIndex": 0,
        "difficulty": 1.2,
        "discrimination": 1.4,
        "explanation": (
            "Prioritization should be risk-driven, not surface-area-driven. The mosaic window (sometimes "
            "called the security horizon) is the period before quantum computers become cryptographically "
            "relevant. Data or keys that must remain secret for longer than this window are the highest "
            "priority. Long-lived signing keys (root CAs, code signing), highly sensitive classified or "
            "regulated data, and infrastructure with long upgrade cycles should move first. Web TLS "
            "certificates are short-lived and lower risk. Waiting for a public demonstration is "
            "irresponsible given HNDL campaigns already underway."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["NIST-PQC-2024", "ISC2-CISSP-2024-QC"],
    },
    {
        "id": "aq-pqc-005",
        "domain": "4. Communication and Network Security",
        "stem": (
            "A network security team is evaluating quantum key distribution (QKD) as a replacement "
            "for classical key exchange protocols across its data center interconnect. A board "
            "member asks why QKD cannot simply replace TLS across all enterprise communications. "
            "What is the MOST accurate limitation to explain?"
        ),
        "choices": [
            "QKD requires a dedicated physical optical channel between communicating parties and does not scale to arbitrary internet endpoints, making it impractical as a general TLS replacement",
            "QKD produces encryption keys that are mathematically weaker than those generated by CRYSTALS-Kyber at equivalent security levels",
            "QKD has not been approved by NIST and therefore cannot be used in environments subject to FIPS 140-3 validation requirements",
            "QKD is vulnerable to Shor's algorithm because it relies on integer factorization for key distribution",
        ],
        "correctIndex": 0,
        "difficulty": 1.1,
        "discrimination": 1.3,
        "explanation": (
            "QKD distributes keys using quantum properties of photons (typically via fiber or free-space "
            "optical links). The physical channel constraint is absolute: you cannot do QKD over the "
            "existing internet because the protocol requires direct quantum state transmission. This makes "
            "it suitable for point-to-point high-security links (inter-data-center, government facilities) "
            "but not a scalable internet replacement. QKD's key security is information-theoretically "
            "perfect — not based on computational assumptions — so it is not vulnerable to Shor's. "
            "NIST approval and FIPS are separate considerations from the physical feasibility argument."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["ISC2-CISSP-2024-QC"],
    },

    # ── AI GOVERNANCE ────────────────────────────────────────────────────────
    {
        "id": "aq-aig-001",
        "domain": "1. Security and Risk Management",
        "stem": (
            "An organization deploys an AI-based access control decision system that denies "
            "access requests based on behavioral anomaly scores. Several employees from a "
            "specific demographic report disproportionately high denial rates. The CISO is "
            "asked to respond. What should the CISO do FIRST?"
        ),
        "choices": [
            "Suspend automated denial decisions pending a bias audit of the model's training data, feature selection, and output distributions across protected demographic groups",
            "Disable the AI system entirely until a replacement without demographic features is deployed",
            "Add a human review layer for all denied access requests going forward",
            "Commission a penetration test to determine whether the anomaly is caused by an external attacker targeting those employees",
        ],
        "correctIndex": 0,
        "difficulty": 1.0,
        "discrimination": 1.2,
        "explanation": (
            "Disproportionate impact on a protected group is a regulatory, legal, and ethical risk that "
            "must be investigated before the system continues making consequential decisions. The first "
            "step is suspending automated denials and auditing the model — examining training data for "
            "historical bias, identifying whether protected attributes (or proxies) are features, and "
            "measuring output disparity. Full system disablement may follow the audit but is premature "
            "without evidence. A human review layer reduces harm but does not investigate root cause. "
            "A penetration test addresses an unrelated hypothesis."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["ISC2-CISSP-2024-AI"],
    },

    # ── AI SUPPLY CHAIN ──────────────────────────────────────────────────────
    {
        "id": "aq-aisc-001",
        "domain": "1. Security and Risk Management",
        "stem": (
            "An organization incorporates a pre-trained open-source language model into its "
            "internal HR chatbot. The model was downloaded from a public repository and "
            "fine-tuned on proprietary HR policy documents. Security researchers later discover "
            "that the base model's weights were backdoored by the original publisher to produce "
            "harmful outputs when triggered by a specific phrase. What control would MOST "
            "effectively have prevented this risk?"
        ),
        "choices": [
            "Treating the pre-trained model as a third-party software component subject to supply chain risk assessment, including provenance verification and behavioral testing before integration",
            "Conducting a penetration test of the HR chatbot application after deployment",
            "Restricting chatbot access to users with a need-to-know and monitoring usage logs",
            "Encrypting the model weights at rest to prevent unauthorized modification after download",
        ],
        "correctIndex": 0,
        "difficulty": 1.1,
        "discrimination": 1.3,
        "explanation": (
            "A backdoored model is a supply chain attack analogous to a backdoored library or binary. "
            "The appropriate control is treating the model as a third-party component: verify the "
            "publisher's identity, check cryptographic hashes against known-good releases, review the "
            "model's publication history, and conduct behavioral testing (including adversarial probing "
            "for hidden triggers) before integration. Post-deployment penetration testing, access "
            "restrictions, and encryption at rest do not detect a backdoor embedded in the model's "
            "weights before or during deployment."
        ),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
        "sourceIds": ["ISC2-CISSP-2024-AI"],
    },
]


# ---------------------------------------------------------------------------
# Ambiguity injection — strips or softens disambiguating keywords so the
# test-taker cannot keyword-match to the answer.  Correct answer is UNCHANGED.
# Applied to 20% of L3 items (difficulty >= 0.5), selected by item hash.
# ---------------------------------------------------------------------------

# Each tuple: (compiled regex, replacement string)
# Applied left-to-right; later rules see the result of earlier substitutions.
_AMBIGUITY_RULES: list[tuple[re.Pattern, str]] = [
    # ── Qualifier removal/softening ──────────────────────────────────────────
    # "do FIRST" / "FIRST step" — removes sequencing anchor
    (re.compile(r'\bshould\s+(?:you\s+|the\s+\w+\s+)?do\s+FIRST\b', re.I),    'should you do'),
    (re.compile(r'\bthe\s+FIRST\s+step\b',                              re.I),  'a step'),
    (re.compile(r'\bFIRST\s+(?:priority|action|measure|thing)\b',       re.I),  'a priority'),
    # Standalone FIRST not part of "first-party", "first responder", etc.
    (re.compile(r'\bFIRST\b(?!\s*[-–]?\s*(?:party|line|responder|hand|gen))',  re.I), ''),
    # BEST → drop or soften (context-aware to avoid grammar breakage)
    (re.compile(r'\bBEST\s+course\s+of\s+action\b',                          re.I), 'course of action'),
    # "BEST [verb]" where BEST is an adverb — drop it, keep the verb
    (re.compile(r'\bBEST\s+(describes?|represents?|illustrates?|defines?|identifies?|characterizes?|exemplifies?)\b', re.I),
     r'\1'),
    # "BEST [adj/noun]" in a predicate — replace with "appropriate"
    (re.compile(r'\bBEST\b(?!\s*(?:practice|effort|case|available|describes?|represents?|illustrates?|defines?|identifies?|characterizes?|exemplifies?))', re.I), 'appropriate'),
    # MOST + adjective → adjective alone
    (re.compile(r'\bMOST\s+APPROPRIATE\b',  re.I),  'appropriate'),
    (re.compile(r'\bMOST\s+IMPORTANT\b',    re.I),  'important'),
    (re.compile(r'\bMOST\s+EFFECTIVE\b',    re.I),  'effective'),
    (re.compile(r'\bMOST\s+CRITICAL\b',     re.I),  'critical'),
    (re.compile(r'\bMOST\s+LIKELY\b',       re.I),  'likely'),
    (re.compile(r'\bMOST\s+SUITABLE\b',     re.I),  'suitable'),
    (re.compile(r'\bPRIMARY\s+(?:concern|consideration|objective|goal|reason)\b', re.I), 'concern'),
    (re.compile(r'\bPRIMARILY\b', re.I), ''),
    (re.compile(r'\bINITIALLY\b', re.I), ''),

    # ── Role/perspective anchor removal ─────────────────────────────────────
    # "as the CISO" / "as a security architect" — removes whose-hat cue
    (re.compile(
        r',?\s*as\s+(?:the\s+|a\s+)?(?:CISO|Chief\s+Information\s+Security\s+Officer'
        r'|security\s+architect|security\s+manager|security\s+analyst'
        r'|security\s+officer|security\s+director|security\s+engineer)\s*,?',
        re.I), ''),

    # ── Standard/framework anchor removal ───────────────────────────────────
    # "under ISO 27001" / "per NIST SP 800-53" — narrows the answer domain
    (re.compile(
        r',?\s*(?:under|per|according\s+to|as\s+defined\s+by|in\s+accordance\s+with)\s+'
        r'(?:ISO|NIST|PCI(?:\s+DSS)?|HIPAA|SOX|GDPR|FedRAMP|FISMA|GLBA|FERPA|COBIT|ITIL)'
        r'[\w\s.\-/]*,?',
        re.I), ''),

    # ── Security model name obfuscation ─────────────────────────────────────
    # Replaces named models with generic descriptions — can't pattern-match to answer
    (re.compile(r'\bBell[- ]LaPadula\s+(?:model|framework)?\b', re.I), 'this access control model'),
    (re.compile(r'\bBiba\s+(?:model|framework|integrity\s+model)?\b',  re.I), 'this integrity model'),
    (re.compile(r'\bClark[- ]Wilson\s+(?:model|framework)?\b',         re.I), 'this commercial integrity framework'),
    (re.compile(r'\bBrewer[- ]Nash\s+(?:model|framework)?\b',          re.I), 'this conflict-of-interest model'),
    (re.compile(r'\bSutherland\s+(?:model|framework)?\b',               re.I), 'this inference prevention model'),
    (re.compile(r'\bTake[- ]Grant\s+(?:model|framework)?\b',            re.I), 'this access transfer model'),
]

_MULTI_SPACE = re.compile(r'  +')
_LEADING_PUNC = re.compile(r'^\s*[,;]\s*')


def _apply_ambiguity(stem: str) -> str:
    """Apply ambiguity rules to a stem; clean up artifacts."""
    result = stem
    for pattern, replacement in _AMBIGUITY_RULES:
        result = pattern.sub(replacement, result)
    result = _MULTI_SPACE.sub(' ', result)
    result = _LEADING_PUNC.sub('', result)
    return result.strip()


def _ambiguity_hash(item_id: str) -> int:
    h = 0
    for ch in f"ambig|{item_id}":
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return h


def should_make_ambiguous(item: dict) -> bool:
    """20% of items with difficulty >= 0.5 get ambiguity treatment."""
    return (item.get("difficulty") or 0) >= 0.5 and _ambiguity_hash(item["id"]) % 5 == 1


def make_ambiguity_variant(item: dict) -> dict:
    modified_stem = _apply_ambiguity(item["stem"])
    orig_diff = item.get("difficulty") or 0.0
    return {
        **item,
        "id": f"{item['id']}__ambig",
        "stem": modified_stem,
        "coreStem": item["stem"],
        "ambiguous": True,
        "difficulty": round(min(orig_diff + 0.20, 2.5), 4),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
    }


# ---------------------------------------------------------------------------
# Super-long variants — maximum noise + embedded red herrings.
# Served by the CAT ONLY when domain competency ceiling is confirmed high
# (targetDiff >= 1.2).  Applied to 10% of items with difficulty >= 1.0.
# ---------------------------------------------------------------------------

# Red herrings: plausible-sounding but irrelevant technical/operational details
# embedded inside the scenario preamble to create competing hypotheses.
RED_HERRING_SENTENCES = [
    "The organization recently deployed a next-generation SIEM with UEBA capabilities, correlating telemetry from 4,200 endpoints across three geographic regions with a 72-hour event retention window.",
    "Annual penetration testing under a rules-of-engagement agreement produced seventeen medium-severity findings, all remediated within the contractual 60-day window and verified by the testing firm.",
    "The security architecture team is evaluating zero-trust network access solutions from three vendors, with a proof-of-concept scheduled for the following quarter pending board approval.",
    "A recent internal audit found that 23% of privileged accounts had not been reviewed within the organization's stated 90-day recertification cycle, representing a gap flagged in the risk register.",
    "The vendor providing managed detection and response services has a contractual mean time to detect of 15 minutes and mean time to respond of 4 hours for P1 incidents.",
    "The data classification policy was last revised 14 months ago and does not yet reflect the organization's expanded cloud footprint or the three new data processing agreements signed in the interim.",
    "Two of the eight data center segments operate under a shared services agreement with a third-party colocation provider, each governed by a separate business associate agreement.",
    "The organization's cyber insurance carrier requires annual attestation of 11 named controls, four of which are currently rated 'partial' in the most recent control self-assessment.",
    "Security awareness training completion sits at 81% for the current fiscal year, with the remaining 19% in the remediation workflow tracked by the security program manager.",
    "A threat intelligence subscription flags three active campaigns targeting the organization's industry vertical, two of which involve spear-phishing and one involving publicly available credential stuffing toolkits.",
    "The change management process requires a risk assessment for all changes rated 'significant,' but the threshold definition was not updated when the organization migrated to agile delivery two years ago.",
    "The organization maintains separate domain controllers for production and development environments, but directory synchronization between the two forests has not been audited since the initial setup.",
]


def _xl_hash(item_id: str) -> int:
    h = 0
    for ch in f"superlong|{item_id}":
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return h


def should_make_super_long(item: dict) -> bool:
    """10% of items with difficulty >= 1.0 get super-long treatment."""
    return (item.get("difficulty") or 0) >= 1.0 and _xl_hash(item["id"]) % 10 == 3


def make_super_long_variant(item: dict) -> dict:
    seed = _xl_hash(item["id"])
    rng  = random.Random(seed)
    orig_diff = item.get("difficulty") or 0.0

    org   = rng.choice(ORG_TYPES)
    sit   = rng.choice(SITUATION_NOISE)
    pers  = rng.choice(PERSONNEL_NOISE)
    task  = rng.choice(TASK_FRAMING)

    # Pick 3 non-repeating tech noise sentences + 2 red herrings
    tech_pool = list(TECH_NOISE)
    rng.shuffle(tech_pool)
    tech_sentences = " ".join(tech_pool[:3])

    rh_pool = list(RED_HERRING_SENTENCES)
    rng.shuffle(rh_pool)
    red_herrings = " ".join(rh_pool[:2])

    core = item["stem"].strip()

    wrapped = (
        f"{org} {sit}. "
        f"{tech_sentences} "
        f"{red_herrings} "
        f"{pers} {task}\n\n"
        f"{core}"
    )

    return {
        **item,
        "id": f"{item['id']}__xl",
        "stem": wrapped,
        "coreStem": item["stem"],
        "superLong": True,
        "difficulty": round(min(orig_diff + 0.50, 2.5), 4),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
    }


# ---------------------------------------------------------------------------
# Core logic
# ---------------------------------------------------------------------------

def should_noise_wrap(item: dict) -> bool:
    """Wrap L2 and L3 items only (difficulty >= -0.5)."""
    return (item.get("difficulty") or 0) >= -0.5


def make_noise_variant(item: dict) -> dict:
    seed = _seed_for(item["id"])
    rng  = random.Random(seed)
    orig_diff = item.get("difficulty") or 0.0

    wrapped_stem = build_noise_wrap(item, rng, orig_diff)

    return {
        **item,
        "id": f"{item['id']}__nw",
        "stem": wrapped_stem,
        "coreStem": item["stem"],
        "noiseWrapped": True,
        "difficulty": round(min(orig_diff + 0.35, 2.5), 4),
        "aug_tier": "L3",
        "augmented": True,
        "aug_prob": 1.0,
    }


def run(bank_path: Path, dry_run: bool, domain_filter: str | None) -> None:
    print(f"Loading bank: {bank_path}")
    with open(bank_path, encoding="utf-8") as f:
        bank = json.load(f)

    original_items = bank["items"]
    print(f"  Original items: {len(original_items)}")

    in_scope = [
        item for item in original_items
        if not domain_filter or item.get("domain", "").startswith(domain_filter)
    ]

    # --- Noise-wrapped variants (L2 + L3) ---
    noise_variants = [make_noise_variant(i) for i in in_scope if should_noise_wrap(i)]
    print(f"  Noise-wrapped variants generated: {len(noise_variants)}")

    # --- Ambiguity variants (20% of L3, difficulty >= 0.5) ---
    ambig_variants = [make_ambiguity_variant(i) for i in in_scope if should_make_ambiguous(i)]
    print(f"  Ambiguity variants generated:     {len(ambig_variants)}")

    # --- Super-long variants (10% of hardest L3, difficulty >= 1.0) ---
    xl_variants = [make_super_long_variant(i) for i in in_scope if should_make_super_long(i)]
    print(f"  Super-long variants generated:    {len(xl_variants)}")

    # --- AI / Quantum items ---
    aq_items = AI_QUANTUM_ITEMS
    if domain_filter:
        aq_items = [i for i in aq_items if i["domain"].startswith(domain_filter)]
    print(f"  AI/Quantum new items:             {len(aq_items)}")

    all_items = original_items + noise_variants + ambig_variants + xl_variants + aq_items
    total = len(all_items)
    print(f"  Total extended bank size:         {total}")

    tiers = {}
    for i in all_items:
        tiers[i.get("aug_tier", "unknown")] = tiers.get(i.get("aug_tier", "unknown"), 0) + 1
    print(f"  Tier distribution: {tiers}")

    if dry_run:
        print("Dry-run mode — no file written.")
        return

    extended_bank = {
        **{k: v for k, v in bank.items() if k != "items"},
        "items": all_items,
        "extended_info": {
            "original_count":      len(original_items),
            "noise_wrapped_count": len(noise_variants),
            "ambiguity_count":     len(ambig_variants),
            "super_long_count":    len(xl_variants),
            "ai_quantum_count":    len(aq_items),
            "total_count":         total,
            "ambiguity_selection": "20% of items with difficulty >= 0.5 (hash % 5 == 1)",
            "super_long_selection": "10% of items with difficulty >= 1.0 (hash % 10 == 3)",
            "noise_wrap_diff_delta": 0.35,
            "ambiguity_diff_delta":  0.20,
            "super_long_diff_delta": 0.50,
        },
    }

    print(f"\nWriting: {OUTPUT_BANK}")
    with open(OUTPUT_BANK, "w", encoding="utf-8") as f:
        json.dump(extended_bank, f, indent=2, ensure_ascii=False)
    size_mb = OUTPUT_BANK.stat().st_size / 1_048_576
    print(f"Done. {size_mb:.1f} MB written.")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--bank",    default=str(DEFAULT_BANK), help="Path to question-bank.augmented.json")
    parser.add_argument("--dry-run", action="store_true",        help="Print stats only, do not write output file")
    parser.add_argument("--domain",  default=None,               help="Filter to items whose domain starts with this string")
    args = parser.parse_args()

    bank_path = Path(args.bank)
    if not bank_path.exists():
        print(f"ERROR: bank not found: {bank_path}", file=sys.stderr)
        sys.exit(1)

    run(bank_path, args.dry_run, args.domain)


if __name__ == "__main__":
    main()
