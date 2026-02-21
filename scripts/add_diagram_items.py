#!/usr/bin/env python3
"""Add variety items: MCQ-with-ASCII-diagram and simpler short PBQ items."""
import json

DIAGRAM_ITEMS = [
  # ── DIAGRAM-MCQ ITEMS (regular MCQ with ASCII diagram in stem) ──────────
  {
    "id": "d1-diagram-q1",
    "domain": "1. Security and Risk Management",
    "stem": (
      "An organization's risk analyst produced the following qualitative risk matrix:\n\n"
      "  ┌──────────────────────────────────────────────────────┐\n"
      "  │          RISK PRIORITY MATRIX                        │\n"
      "  │                                                      │\n"
      "  │  HIGH │  MODERATE PRIORITY  │  TOP PRIORITY         │\n"
      "  │  PROB │  (treat / transfer) │  (immediate action)   │\n"
      "  │       ├─────────────────────┼───────────────────────┤\n"
      "  │  LOW  │  LOW PRIORITY       │  MEDIUM PRIORITY      │\n"
      "  │  PROB │  (accept / monitor) │  (reduce / plan)      │\n"
      "  │       └─────────────────────┴───────────────────────┘\n"
      "  │              LOW IMPACT            HIGH IMPACT       │\n"
      "  └──────────────────────────────────────────────────────┘\n\n"
      "Risk item: An internet-facing server runs an unpatched service with a public exploit "
      "(CVSS 9.8). Breach would expose all customer PII. "
      "Which cell BEST describes this risk and what is the FIRST required action?"
    ),
    "choices": [
      "TOP PRIORITY — high probability, high impact. Patch or isolate immediately.",
      "MEDIUM PRIORITY — low probability because the exploit requires authentication.",
      "LOW PRIORITY — impact is limited to PII, which is encrypted at rest.",
      "MODERATE PRIORITY — transfer the risk to cyber insurance before patching.",
    ],
    "correctIndex": 0,
    "difficulty": -0.2,
    "discrimination": 1.1,
    "questionType": "scenario",
    "explanation": (
      "A public, weaponized exploit on an internet-facing system = HIGH probability. "
      "Full PII exposure = HIGH impact. This falls in the TOP PRIORITY cell, requiring "
      "immediate treatment (patch or network isolation). "
      "Transferring risk (insurance) does not reduce the probability of breach "
      "and is not the FIRST action. Encryption at rest doesn't protect against RCE-based exfiltration."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-30r1"],
  },
  {
    "id": "d3-diagram-q1",
    "domain": "3. Security Architecture and Engineering",
    "stem": (
      "Refer to the OSI model diagram below:\n\n"
      "  ┌─────────────────────────────────────────┐\n"
      "  │  L7 │ Application  (HTTP, SMTP, DNS)    │\n"
      "  │  L6 │ Presentation (encoding, SSL/TLS?) │  ← ?\n"
      "  │  L5 │ Session      (dialog control)     │\n"
      "  │  L4 │ Transport    (TCP, UDP)            │\n"
      "  │  L3 │ Network      (IP, ICMP)            │\n"
      "  │  L2 │ Data Link    (Ethernet, MAC)       │\n"
      "  │  L1 │ Physical     (cables, bits)        │\n"
      "  └─────────────────────────────────────────┘\n\n"
      "A network engineer says 'TLS provides encryption at the Presentation layer.' "
      "A security architect disagrees. Which statement is MOST accurate?"
    ),
    "choices": [
      "TLS is commonly described as operating at L5-L7 (Session through Application) — it doesn't map cleanly to a single OSI layer. In TCP/IP practice it sits between Transport and Application.",
      "TLS operates exclusively at the Presentation layer (L6), which is why ISC2 maps all encryption there.",
      "TLS operates at the Network layer (L3), which is why IPSec and TLS both protect IP packets.",
      "TLS operates at the Transport layer (L4) alongside TCP, which is why it is called Transport Layer Security.",
    ],
    "correctIndex": 0,
    "difficulty": 0.3,
    "discrimination": 1.2,
    "questionType": "knowledge",
    "explanation": (
      "TLS doesn't map cleanly to the 7-layer OSI model. "
      "It is conceptually described at L5-L7 — it uses TCP (L4) as its transport, "
      "handles session management (L5), performs encryption/encoding (L6), and "
      "is consumed directly by application protocols (L7). "
      "In the practical TCP/IP 4-layer model, TLS sits between the Transport and Application layers. "
      "The name 'Transport Layer Security' is a naming convention from earlier SSL versions, "
      "not an OSI layer assignment. IPSec operates at L3 (Network layer), not L4."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "ietf-rfc-8446", "ietf-rfc-4949"],
  },
  {
    "id": "d4-diagram-q1",
    "domain": "4. Communication and Network Security",
    "stem": (
      "A network architect is designing a web application infrastructure. "
      "Review the zone diagram:\n\n"
      "  ┌──────────────────────────────────────────────────────────┐\n"
      "  │  [INTERNET] ──► [Zone A] ──► [Zone B] ──► [Zone C]     │\n"
      "  │                                                          │\n"
      "  │  Zone A: Perimeter / Edge (border router, edge firewall) │\n"
      "  │  Zone B: DMZ (screened subnet)                          │\n"
      "  │  Zone C: Internal LAN (corporate users, internal DBs)   │\n"
      "  └──────────────────────────────────────────────────────────┘\n\n"
      "The org hosts a public-facing HTTPS web application that connects to an "
      "internal database. Where should the Web Application Firewall (WAF) be placed "
      "to BEST protect against OWASP Top 10 attacks (SQLi, XSS, etc.)?"
    ),
    "choices": [
      "Zone B (DMZ) — inline in front of the web server, inspecting HTTPS traffic before it reaches the application",
      "Zone A (Perimeter) — at the edge router to block attacks before they enter the network",
      "Zone C (Internal LAN) — between the web server and the database to filter SQL queries",
      "Between Zone B and Zone C — to inspect all traffic leaving the DMZ before it hits internal systems",
    ],
    "correctIndex": 0,
    "difficulty": 0.1,
    "discrimination": 1.2,
    "questionType": "scenario",
    "explanation": (
      "A WAF inspects HTTP/HTTPS application-layer traffic. "
      "It must be placed inline in front of the web server — in the DMZ — to inspect "
      "and filter requests BEFORE they reach the application. "
      "Placing it at Zone A (perimeter) means it sees encrypted HTTPS but cannot decrypt/inspect "
      "application content without TLS termination. "
      "Zone C placement (between app and DB) is too late — the attack has already hit the app. "
      "The WAF needs to terminate TLS and inspect the decrypted HTTP body."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-41"],
  },
  {
    "id": "d4-diagram-q2",
    "domain": "4. Communication and Network Security",
    "stem": (
      "An analyst is reviewing network traffic captures and observes the following "
      "packet flow:\n\n"
      "  ┌────────────────────────────────────────────────────────┐\n"
      "  │  Host A (10.0.0.5)   ────►  Router  ────►  Host B    │\n"
      "  │                              (10.0.0.1)   (10.0.0.8) │\n"
      "  │                                                        │\n"
      "  │  Host A broadcasts: 'Who has 10.0.0.8? Tell 10.0.0.5'│\n"
      "  │  Host B replies:    '10.0.0.8 is at AA:BB:CC:DD:EE'  │\n"
      "  └────────────────────────────────────────────────────────┘\n\n"
      "An attacker on the same subnet sends an unsolicited reply: "
      "'10.0.0.8 is at 00:11:22:33:44:55 (attacker MAC).' "
      "What attack is being performed and which OSI layer is exploited?"
    ),
    "choices": [
      "ARP poisoning (ARP spoofing) — Layer 2 (Data Link). The attacker poisons Host A's ARP cache to redirect traffic.",
      "DNS spoofing — Layer 7 (Application). The attacker forges a DNS resolution response.",
      "IP spoofing — Layer 3 (Network). The attacker forges the source IP to impersonate Host B.",
      "TCP session hijacking — Layer 4 (Transport). The attacker injects into an established TCP stream.",
    ],
    "correctIndex": 0,
    "difficulty": 0.0,
    "discrimination": 1.1,
    "questionType": "scenario",
    "explanation": (
      "ARP (Address Resolution Protocol) operates at Layer 2 (Data Link). "
      "ARP has no authentication — any host can send an ARP reply claiming any IP-to-MAC mapping. "
      "The attacker poisons Host A's ARP cache so traffic destined for 10.0.0.8 is sent to "
      "the attacker's MAC instead (man-in-the-middle or denial of service). "
      "Dynamic ARP Inspection (DAI) on managed switches mitigates this by validating ARP packets "
      "against a trusted DHCP snooping binding table."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "ietf-rfc-4949"],
  },
  {
    "id": "d5-diagram-q1",
    "domain": "5. Identity and Access Management (IAM)",
    "stem": (
      "Review the following access control model diagram:\n\n"
      "  ┌──────────────────────────────────────────────────────────┐\n"
      "  │  SUBJECT: Alice (Clearance = SECRET)                     │\n"
      "  │                                                          │\n"
      "  │  Attempt 1: Read file labeled TOP SECRET     → [  ? ]   │\n"
      "  │  Attempt 2: Write to file labeled CLASSIFIED → [  ? ]   │\n"
      "  │  Attempt 3: Read file labeled CONFIDENTIAL  → [  ? ]    │\n"
      "  │  Attempt 4: Write to file labeled SECRET     → [  ? ]   │\n"
      "  └──────────────────────────────────────────────────────────┘\n\n"
      "Under the Bell-LaPadula mandatory access control model, which set of "
      "outcomes (PERMIT / DENY) is CORRECT?"
    ),
    "choices": [
      "Attempt 1: DENY (no read up) | Attempt 2: DENY (no write down — CLASSIFIED is below SECRET) | Attempt 3: PERMIT (read down is allowed) | Attempt 4: PERMIT (write at own level is allowed)",
      "Attempt 1: PERMIT (Alice has SECRET clearance, TOP SECRET is only slightly higher) | Attempt 2: PERMIT | Attempt 3: PERMIT | Attempt 4: PERMIT",
      "Attempt 1: DENY | Attempt 2: PERMIT | Attempt 3: DENY (no read down) | Attempt 4: PERMIT",
      "Attempt 1: DENY | Attempt 2: DENY | Attempt 3: DENY | Attempt 4: DENY (strict MLS blocks all cross-level access)",
    ],
    "correctIndex": 0,
    "difficulty": 0.4,
    "discrimination": 1.3,
    "questionType": "scenario",
    "explanation": (
      "Bell-LaPadula rules: "
      "(1) No read up (Simple Security Property) — Alice (SECRET) cannot read TOP SECRET → DENY. "
      "(2) No write down (*-Property) — Alice (SECRET) cannot write to CLASSIFIED (lower) → DENY. "
      "(3) Read down is NOT prohibited by BLP — Alice (SECRET) CAN read CONFIDENTIAL (lower) → PERMIT. "
      "(4) Write at own level is permitted — Alice (SECRET) can write to SECRET files → PERMIT. "
      "A common error: thinking BLP prohibits reading down. BLP only prohibits reading UP "
      "and writing DOWN. The Biba model (integrity) does the opposite: no read down, no write up."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d6-diagram-q1",
    "domain": "6. Security Assessment and Testing",
    "stem": (
      "A penetration tester is selecting an engagement scope. "
      "Review the knowledge diagram:\n\n"
      "  ┌─────────────────────────────────────────────────────────┐\n"
      "  │  TEST TYPE │ TESTER KNOWLEDGE  │ SIMULATES             │\n"
      "  │────────────┼───────────────────┼───────────────────────│\n"
      "  │  [Type A]  │ Zero prior info   │ External attacker      │\n"
      "  │  [Type B]  │ Full source code, │ Malicious insider /   │\n"
      "  │            │ diagrams, creds   │ auditor               │\n"
      "  │  [Type C]  │ Partial info      │ Informed outsider      │\n"
      "  │            │ (some network     │ (e.g., partner firm)  │\n"
      "  │            │  diagrams only)   │                        │\n"
      "  └─────────────────────────────────────────────────────────┘\n\n"
      "A financial firm hires a pen test firm and shares only the external IP range. "
      "No architecture documentation, no credentials, no source code is provided. "
      "Which test type and label CORRECTLY identifies this engagement?"
    ),
    "choices": [
      "Type A — Black-box testing (zero knowledge). The tester starts with only the target scope.",
      "Type B — White-box testing. Sharing only an IP range counts as full disclosure.",
      "Type C — Gray-box testing. Any information sharing automatically makes it gray-box.",
      "Type B — Crystal-box testing, because IP ranges reveal the full network architecture.",
    ],
    "correctIndex": 0,
    "difficulty": -0.1,
    "discrimination": 1.0,
    "questionType": "knowledge",
    "explanation": (
      "Black-box testing = no prior knowledge of target internals. "
      "The tester receives only the scope (IP range) — no architecture, no credentials, "
      "no source code. This simulates an external attacker with no insider knowledge. "
      "Gray-box (Type C) involves partial information (e.g., network diagrams, some credentials). "
      "White-box (Type B/crystal-box) gives full access: source code, architecture, credentials. "
      "Simply providing an IP range to define scope does NOT make an engagement gray-box — "
      "scope definition is necessary for authorization, not knowledge transfer."
    ),
    "sourceIds": ["nist-sp-800-115", "isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d7-diagram-q1",
    "domain": "7. Security Operations",
    "stem": (
      "A forensic investigator arrives at a compromised workstation. "
      "The system is still powered on. Review the volatility order:\n\n"
      "  ┌──────────────────────────────────────────────────────────┐\n"
      "  │     ORDER OF VOLATILITY (MOST → LEAST volatile)         │\n"
      "  │                                                          │\n"
      "  │  [1] CPU registers, cache, running processes (RAM)      │\n"
      "  │  [2] Network connections, routing/ARP tables            │\n"
      "  │  [3] Temporary files, swap/page file                    │\n"
      "  │  [4] Hard disk / SSD storage                            │\n"
      "  │  [5] Remote logs, cloud storage                         │\n"
      "  │  [6] Archival media (tape, optical)                     │\n"
      "  └──────────────────────────────────────────────────────────┘\n\n"
      "Following the principle of order of volatility, which action should the "
      "investigator perform FIRST on the live system?"
    ),
    "choices": [
      "Capture a full memory (RAM) dump of the running system before anything else.",
      "Power off the system immediately to prevent further modification of the hard disk.",
      "Create a forensic image of the hard disk using a write blocker.",
      "Photograph the screen to document the current state, then pull the power plug.",
    ],
    "correctIndex": 0,
    "difficulty": 0.0,
    "discrimination": 1.1,
    "questionType": "scenario",
    "explanation": (
      "RFC 3227 / SWGDE: collect evidence in order of volatility — most volatile first. "
      "RAM contains running processes, encryption keys, network connections, and malware "
      "artifacts that vanish instantly on power-off. "
      "A live RAM dump (using tools like WinPMEM, LiME) must be the FIRST action. "
      "Powering off first destroys all RAM evidence — a critical mistake. "
      "Hard disk imaging (write-blocked) comes AFTER volatile evidence is captured. "
      "Photographing the screen is useful documentation but does not capture the full memory state."
    ),
    "sourceIds": ["nist-sp-800-61r2", "isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d8-diagram-q1",
    "domain": "8. Software Development Security",
    "stem": (
      "A DevSecOps team is mapping security activities to SDLC phases. "
      "Review the diagram:\n\n"
      "  ┌─────────────────────────────────────────────────────────┐\n"
      "  │  SDLC PHASE         │ SECURITY ACTIVITY               │\n"
      "  │─────────────────────┼─────────────────────────────────│\n"
      "  │  Requirements       │  [A] Classify data, define      │\n"
      "  │                     │      security requirements       │\n"
      "  │─────────────────────┼─────────────────────────────────│\n"
      "  │  Design             │  [B] Threat modeling (STRIDE)   │\n"
      "  │─────────────────────┼─────────────────────────────────│\n"
      "  │  Implementation     │  [C] SAST, code review          │\n"
      "  │─────────────────────┼─────────────────────────────────│\n"
      "  │  Testing            │  [D] DAST, pen test, fuzzing    │\n"
      "  │─────────────────────┼─────────────────────────────────│\n"
      "  │  Deployment         │  [E] Hardening, change control  │\n"
      "  │─────────────────────┼─────────────────────────────────│\n"
      "  │  Maintenance        │  [F] Patch management, vuln mgmt│\n"
      "  └─────────────────────────────────────────────────────────┘\n\n"
      "A developer asks: 'When is it CHEAPEST to find and fix a security flaw?' "
      "Based on the diagram, which phase and activity is CORRECT?"
    ),
    "choices": [
      "Activity [A] — Requirements phase. Flaws identified earliest cost the least to fix; each phase multiplies remediation cost roughly 10x.",
      "Activity [D] — Testing phase (DAST/pen test) because real vulnerabilities are only visible in a running application.",
      "Activity [F] — Maintenance phase because production monitoring catches all classes of vulnerabilities.",
      "Activity [C] — Implementation phase; SAST runs here so this is defined as the cheapest fix point.",
    ],
    "correctIndex": 0,
    "difficulty": -0.1,
    "discrimination": 1.1,
    "questionType": "knowledge",
    "explanation": (
      "The 'cost of defects' principle (Boehm, IBM studies): a defect found at Requirements "
      "costs ~1x to fix; at Design ~3-6x; at Implementation ~10x; at Testing ~15-40x; "
      "in Production ~60-100x. "
      "The EARLIEST you can identify a flaw is at the Requirements/Design stage — "
      "before a single line of code is written. "
      "This is the 'shift-left' security principle: move security activities as far "
      "LEFT (early) in the SDLC as possible. "
      "SAST (Activity C) is valuable but still more expensive than catching it at design."
    ),
    "sourceIds": ["nist-sp-800-218", "isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d2-diagram-q1",
    "domain": "2. Asset Security",
    "stem": (
      "A security manager is briefing junior analysts on data classification. "
      "Review the hierarchy diagram:\n\n"
      "  ┌────────────────────────────────────────────────────────┐\n"
      "  │          COMMERCIAL DATA CLASSIFICATION TIERS          │\n"
      "  │                                                        │\n"
      "  │   ▲  CONFIDENTIAL  — trade secrets, IP, PII/PHI       │\n"
      "  │   │                                                    │\n"
      "  │   │  PRIVATE       — internal HR, salary, contracts   │\n"
      "  │   │                                                    │\n"
      "  │   │  SENSITIVE     — needs care but not top-tier      │\n"
      "  │   │                                                    │\n"
      "  │   ▼  PUBLIC        — press releases, marketing        │\n"
      "  └────────────────────────────────────────────────────────┘\n\n"
      "An analyst receives an email from a vendor with a document marked CONFIDENTIAL "
      "and immediately uploads it to a public cloud drive for easier collaboration. "
      "Which principle did the analyst MOST directly violate?"
    ),
    "choices": [
      "The handling requirements of the CONFIDENTIAL label — which require access controls restricting data to authorized parties only.",
      "The need-to-know principle — but only if the vendor specifically prohibited sharing.",
      "Data retention policy — because uploading to cloud storage changes the retention schedule.",
      "The aggregation principle — combining documents creates a higher classification.",
    ],
    "correctIndex": 0,
    "difficulty": -0.2,
    "discrimination": 1.0,
    "questionType": "scenario",
    "explanation": (
      "CONFIDENTIAL data carries mandatory handling controls: encryption in transit, "
      "access restricted to authorized recipients, no unauthorized disclosure. "
      "Uploading to a public cloud drive strips those controls and makes the data "
      "accessible beyond authorized parties — a direct violation of the classification's "
      "handling requirements. "
      "Need-to-know and aggregation may also be relevant, but the MOST direct violation "
      "is the handling control attached to the classification label itself."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-53r5"],
  },

  # ── SIMPLER SHORT PBQ ITEMS (3-4 choices, fast to complete) ─────────────
  {
    "id": "d2-pbq-dd2",
    "type": "dragdrop",
    "domain": "2. Asset Security",
    "stem": (
      "Which of the following are responsibilities of the DATA OWNER role? "
      "Select all that apply. [Select all that apply]"
    ),
    "choices": [
      "Determine the classification level for the data",
      "Back up data daily to the tape library",
      "Approve access requests and define who may access the data",
      "Apply encryption to data at the storage layer",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2],
    "difficulty": 0.0,
    "discrimination": 1.0,
    "questionType": "pbq",
    "explanation": (
      "The Data Owner (typically a senior business manager) is accountable for: "
      "(0) assigning the classification label; "
      "(2) approving access and defining who may use the data. "
      "Day-to-day backup (1) and encryption implementation (3) are operational tasks "
      "performed by the Data Custodian (usually IT), acting on the owner's direction."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-53r5"],
  },
  {
    "id": "d6-pbq-dd3",
    "type": "dragdrop",
    "domain": "6. Security Assessment and Testing",
    "stem": (
      "A security team is reviewing output from a vulnerability scanner. "
      "Select ALL items below that are OUTPUTS of a vulnerability scan report. "
      "[Select all that apply]"
    ),
    "choices": [
      "CVE identifiers and CVSS severity scores for each finding",
      "A forensic timeline of attacker lateral movement",
      "Affected host IP addresses and vulnerable service/port",
      "Proof-of-concept exploit code used to compromise the target",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2],
    "difficulty": -0.1,
    "discrimination": 0.9,
    "questionType": "pbq",
    "explanation": (
      "A vulnerability scanner detects and catalogs weaknesses WITHOUT exploiting them. "
      "Its report includes CVE IDs and CVSS scores (0) and affected hosts/services (2). "
      "A forensic timeline (1) comes from incident response investigation, not scanning. "
      "Proof-of-concept exploit code (3) is the output of penetration testing, not VA scanning."
    ),
    "sourceIds": ["nist-sp-800-115", "isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d5-pbq-dd4",
    "type": "dragdrop",
    "domain": "5. Identity and Access Management (IAM)",
    "stem": (
      "Select ALL items below that represent valid AUTHENTICATION FACTOR CATEGORIES "
      "(the three fundamental factor types). [Select all that apply]"
    ),
    "choices": [
      "Something You Know (knowledge factor)",
      "Somewhere You Are (location factor)",
      "Something You Have (possession factor)",
      "Something You Are (inherence / biometric factor)",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 3],
    "difficulty": -0.5,
    "discrimination": 0.9,
    "questionType": "pbq",
    "explanation": (
      "The three classic authentication factor categories (NIST SP 800-63): "
      "(0) Something You Know — password, PIN, passphrase; "
      "(2) Something You Have — token, smart card, OTP device; "
      "(3) Something You Are — biometric: fingerprint, retina, voice. "
      "Option (1) 'Somewhere You Are' (location factor) is sometimes cited as a "
      "fourth factor in adaptive/risk-based authentication (geolocation, IP range), "
      "but it is NOT one of the three foundational categories recognized by NIST SP 800-63."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-63-3"],
  },
  {
    "id": "d8-pbq-or2",
    "type": "ordering",
    "domain": "8. Software Development Security",
    "stem": (
      "Order the three phases of a basic code review / static analysis workflow "
      "from FIRST to LAST:"
    ),
    "choices": [
      "Remediate — developer fixes identified issues and retests",
      "Configure and Run — set up the SAST tool and execute the scan against the codebase",
      "Triage — review findings, remove false positives, prioritize real defects by severity",
    ],
    "correctIndex": 0,
    "correctOrder": [1, 2, 0],
    "difficulty": -0.3,
    "discrimination": 0.9,
    "questionType": "pbq",
    "explanation": (
      "Static analysis workflow: "
      "(1) Configure and Run — point the tool at the code, set rule sets, execute scan; "
      "(2) Triage — review output, filter false positives (SAST tools have high FP rates), "
      "rank true findings by exploitability and severity; "
      "(3) Remediate — developer fixes verified issues and the scan reruns to confirm. "
      "Skipping triage leads to developer fatigue from false positive noise."
    ),
    "sourceIds": ["nist-sp-800-218", "isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d3-pbq-or3",
    "type": "ordering",
    "domain": "3. Security Architecture and Engineering",
    "stem": (
      "Order the steps of asymmetric (public-key) encryption for sending a "
      "confidential message from Alice to Bob, from FIRST to LAST:"
    ),
    "choices": [
      "Bob decrypts the ciphertext using his private key",
      "Alice encrypts the plaintext message using Bob's PUBLIC key",
      "Alice obtains Bob's public key from a trusted directory or certificate",
    ],
    "correctIndex": 0,
    "correctOrder": [2, 1, 0],
    "difficulty": -0.3,
    "discrimination": 1.0,
    "questionType": "pbq",
    "explanation": (
      "Asymmetric encryption for confidentiality: "
      "(1) Obtain Bob's public key — from a PKI certificate, key server, or direct exchange; "
      "(2) Alice encrypts with Bob's PUBLIC key — only Bob's private key can decrypt it; "
      "(3) Bob decrypts with his PRIVATE key — which never leaves his possession. "
      "Key insight: anyone can encrypt using the public key, only the key owner can decrypt. "
      "This is the opposite of digital signatures, where the private key signs and "
      "the public key verifies."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024"],
  },
]


def main():
    path = "/home/alex/alex-cyber-study/cat/question-bank.sample.json"
    print(f"Loading {path}...")
    with open(path) as f:
        data = json.load(f)

    existing_ids = {item["id"] for item in data["items"]}
    new_items = [item for item in DIAGRAM_ITEMS if item["id"] not in existing_ids]
    skipped = [item["id"] for item in DIAGRAM_ITEMS if item["id"] in existing_ids]

    if skipped:
        print(f"Skipping already-present: {skipped}")

    if not new_items:
        print("All items already present.")
        return

    data["items"].extend(new_items)
    print(f"Adding {len(new_items)} items. New total: {len(data['items'])}")

    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Done.")


if __name__ == "__main__":
    main()
