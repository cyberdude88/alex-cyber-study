#!/usr/bin/env python3
"""Insert 30 PBQ items (dragdrop + ordering) into the question bank."""
import json, sys

PBQ_ITEMS = [
  # ── DOMAIN 1 ──────────────────────────────────────────────────────────────
  {
    "id": "d1-pbq-dd1",
    "type": "dragdrop",
    "domain": "1. Security and Risk Management",
    "stem": (
      "A security analyst is categorizing controls for an audit. "
      "Select ALL controls from the list below that are ADMINISTRATIVE "
      "(management) controls. [Select all that apply]"
    ),
    "choices": [
      "Security awareness and training program",
      "Intrusion detection system (IDS)",
      "Separation of duties policy",
      "Biometric door lock",
      "Background checks for new hires",
      "Firewall ruleset",
      "Written information security policy",
      "CCTV surveillance cameras",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4, 6],
    "difficulty": -0.2,
    "discrimination": 1.1,
    "questionType": "pbq",
    "explanation": (
      "Administrative (management) controls are policies, procedures, and "
      "guidelines that direct people's behavior: security awareness training (0), "
      "separation of duties policy (2), background checks (4), and written "
      "information security policy (6). "
      "IDS (1) and firewall ruleset (5) are technical controls; "
      "biometric door lock (3) and CCTV (7) are physical controls."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-53r5"],
  },
  {
    "id": "d1-pbq-dd2",
    "type": "dragdrop",
    "domain": "1. Security and Risk Management",
    "stem": (
      "A CISO is reviewing risk treatment decisions made last quarter. "
      "Select ALL options below that represent RISK TRANSFER strategies. "
      "[Select all that apply]"
    ),
    "choices": [
      "Purchasing a cyber liability insurance policy",
      "Patching a critical vulnerability within 72 hours",
      "Outsourcing payment card processing to a PCI-DSS-certified third party with contractual liability transfer",
      "Documenting a known low-risk finding and accepting it within tolerance",
      "Adding a cybersecurity rider to the company's general liability policy",
      "Implementing multi-factor authentication on all administrator accounts",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4],
    "difficulty": 0.1,
    "discrimination": 1.2,
    "questionType": "pbq",
    "explanation": (
      "Risk transfer shifts the financial or legal impact to another party. "
      "Cyber liability insurance (0), outsourcing with contractual liability transfer (2), "
      "and adding a cybersecurity rider (4) all transfer risk to an insurer or third party. "
      "Patching (1) is risk reduction/mitigation; documenting and accepting (3) is risk acceptance; "
      "MFA (5) is risk mitigation."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-30r1"],
  },
  {
    "id": "d1-pbq-or1",
    "type": "ordering",
    "domain": "1. Security and Risk Management",
    "stem": (
      "Order the seven steps of the NIST Risk Management Framework (NIST SP 800-37r2) "
      "from FIRST to LAST.\n\n"
      "  ┌───────────────────────────────────────────────────────┐\n"
      "  │            NIST RMF — 7 Steps (SP 800-37r2)          │\n"
      "  │                                                       │\n"
      "  │  [1] ──► [2] ──► [3] ──► [4] ──► [5] ──► [6] ──► [7]│\n"
      "  └───────────────────────────────────────────────────────┘\n\n"
      "Arrange the tiles into the correct sequence:"
    ),
    "choices": [
      "Categorize — Classify the system and data by impact level",
      "Select — Choose baseline security controls (NIST SP 800-53)",
      "Monitor — Continuously assess and report control effectiveness",
      "Prepare — Establish risk context, roles, and organizational strategy",
      "Authorize — Accept residual risk; issue Authorization to Operate (ATO)",
      "Implement — Deploy and configure the selected controls",
      "Assess — Evaluate whether controls are implemented correctly",
    ],
    "correctIndex": 0,
    "correctOrder": [3, 0, 1, 5, 6, 4, 2],
    "difficulty": 0.3,
    "discrimination": 1.2,
    "questionType": "pbq",
    "explanation": (
      "The NIST RMF seven steps in order: "
      "(1) Prepare — set organizational context; "
      "(2) Categorize — assign impact levels (FIPS 199); "
      "(3) Select — choose controls from SP 800-53; "
      "(4) Implement — deploy controls; "
      "(5) Assess — verify controls work (SP 800-53A); "
      "(6) Authorize — issue ATO or DATO; "
      "(7) Monitor — continuous monitoring (SP 800-137). "
      "Prepare is the foundational step added in Rev 2."
    ),
    "sourceIds": ["nist-sp-800-37r2", "isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d1-pbq-or2",
    "type": "ordering",
    "domain": "1. Security and Risk Management",
    "stem": (
      "A business continuity manager is building the organization's BCP from scratch. "
      "Place the following phases of the Business Continuity Planning process in the "
      "correct sequential order from FIRST to LAST:"
    ),
    "choices": [
      "Recovery Strategy Development — define RTO/RPO and recovery options",
      "Business Impact Analysis (BIA) — identify critical functions and impact",
      "Plan Testing, Training, and Maintenance — validate and update the plan",
      "Project Initiation and Scope Definition — secure executive sponsorship",
      "Plan Development and Documentation — write the formal BCP document",
    ],
    "correctIndex": 0,
    "correctOrder": [3, 1, 0, 4, 2],
    "difficulty": 0.2,
    "discrimination": 1.1,
    "questionType": "pbq",
    "explanation": (
      "The BCP process flows: "
      "(1) Project Initiation and Scope — gain management buy-in and define scope; "
      "(2) BIA — identify critical processes, dependencies, RTO, RPO, MTD; "
      "(3) Recovery Strategy Development — select recovery approaches; "
      "(4) Plan Development — document procedures; "
      "(5) Testing/Training/Maintenance — tabletops, drills, annual reviews. "
      "The BIA must precede strategy development because strategies are driven by BIA findings."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-34r1", "iso-22301-2019"],
  },

  # ── DOMAIN 2 ──────────────────────────────────────────────────────────────
  {
    "id": "d2-pbq-dd1",
    "type": "dragdrop",
    "domain": "2. Asset Security",
    "stem": (
      "A cleared U.S. federal contractor is reviewing document markings. "
      "Select ALL labels below that are OFFICIAL U.S. government national security "
      "CLASSIFICATION LEVELS as defined by Executive Order 13526. [Select all that apply]"
    ),
    "choices": [
      "TOP SECRET",
      "Sensitive But Unclassified (SBU)",
      "SECRET",
      "For Official Use Only (FOUO)",
      "CONFIDENTIAL",
      "Controlled Unclassified Information (CUI)",
      "UNCLASSIFIED",
      "Law Enforcement Sensitive (LES)",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4, 6],
    "difficulty": -0.1,
    "discrimination": 1.0,
    "questionType": "pbq",
    "explanation": (
      "Executive Order 13526 establishes exactly three national security classification levels: "
      "TOP SECRET (0), SECRET (2), and CONFIDENTIAL (4). "
      "UNCLASSIFIED (6) is the absence of classification, not a classification level itself, "
      "but it is one of the four official government information tiers. "
      "SBU (1), FOUO (3), CUI (5), and LES (7) are Controlled Unclassified Information "
      "(CUI) designations or handling caveats, NOT classification levels under EO 13526."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-fips-199"],
  },
  {
    "id": "d2-pbq-or1",
    "type": "ordering",
    "domain": "2. Asset Security",
    "stem": (
      "Order the six stages of the Information/Data Lifecycle from FIRST (creation) "
      "to LAST (destruction).\n\n"
      "  Create ──► ??? ──► ??? ──► ??? ──► ??? ──► Destroy\n\n"
      "Arrange the stages in the correct sequence:"
    ),
    "choices": [
      "Archive — move to long-term storage or cold tier",
      "Create — data is generated, ingested, or received",
      "Classify — assign sensitivity labels and handling requirements",
      "Destroy — securely dispose using approved sanitization methods",
      "Share / Distribute — transmit to authorized recipients or systems",
      "Use / Process — data is accessed, modified, or transformed",
    ],
    "correctIndex": 0,
    "correctOrder": [1, 2, 5, 4, 0, 3],
    "difficulty": 0.1,
    "discrimination": 1.1,
    "questionType": "pbq",
    "explanation": (
      "The data lifecycle: "
      "(1) Create — data comes into existence; "
      "(2) Classify — label immediately upon creation for handling; "
      "(3) Use/Process — business operations consume and modify data; "
      "(4) Share/Distribute — data flows to authorized parties; "
      "(5) Archive — move inactive data to long-term storage; "
      "(6) Destroy — securely purge or destroy media (NIST SP 800-88). "
      "Classification should occur at or near creation to ensure proper handling throughout."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-53r5"],
  },

  # ── DOMAIN 3 ──────────────────────────────────────────────────────────────
  {
    "id": "d3-pbq-dd1",
    "type": "dragdrop",
    "domain": "3. Security Architecture and Engineering",
    "stem": (
      "A cryptographer is auditing an organization's encryption standards. "
      "Select ALL algorithms below that use SYMMETRIC (shared-key) encryption. "
      "[Select all that apply]"
    ),
    "choices": [
      "AES-256 (Advanced Encryption Standard)",
      "RSA-4096",
      "3DES (Triple DES / TDEA)",
      "Elliptic Curve Cryptography (ECC)",
      "Blowfish",
      "Diffie-Hellman Key Exchange",
      "ChaCha20",
      "ElGamal",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4, 6],
    "difficulty": -0.3,
    "discrimination": 1.0,
    "questionType": "pbq",
    "explanation": (
      "Symmetric algorithms use the same key for encryption and decryption: "
      "AES-256 (0), 3DES (2), Blowfish (4), and ChaCha20 (6). "
      "RSA (1), ECC (3), Diffie-Hellman (5), and ElGamal (7) are asymmetric "
      "(public-key) algorithms. Note: Diffie-Hellman is a key exchange protocol, "
      "not an encryption algorithm itself, but it is asymmetric in nature."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d3-pbq-dd2",
    "type": "dragdrop",
    "domain": "3. Security Architecture and Engineering",
    "stem": (
      "A security architect is reviewing mandatory access control models. "
      "Select ALL properties that are formally part of the Bell-LaPadula (BLP) "
      "CONFIDENTIALITY model. [Select all that apply]"
    ),
    "choices": [
      "Simple Security Property (ss-property / no read up): subject cannot read data at a higher classification",
      "*-Property (star property / no write down): subject cannot write data to a lower classification",
      "Discretionary Security Property: access is also governed by an access control matrix",
      "Simple Integrity Property (no read down): subject cannot read data at a lower integrity level",
      "Invocation Property: subjects cannot request services of higher-integrity subjects",
      "Strong Star Property: subjects may ONLY read and write at their EXACT classification level",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 1, 2, 5],
    "difficulty": 0.4,
    "discrimination": 1.3,
    "questionType": "pbq",
    "explanation": (
      "Bell-LaPadula defines three properties: "
      "(0) Simple Security Property (no read up) — prevents reading above your clearance; "
      "(1) *-Property (no write down) — prevents writing to lower-classified objects; "
      "(2) Discretionary Security Property — incorporates DAC via access control matrix; "
      "(5) Strong Star Property — restricts both read and write to the exact same level. "
      "Options (3) and (4) describe Biba integrity model properties, not BLP."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d3-pbq-or1",
    "type": "ordering",
    "domain": "3. Security Architecture and Engineering",
    "stem": (
      "Order the seven OSI model layers from Layer 1 (BOTTOM — closest to the physical "
      "medium) to Layer 7 (TOP — closest to the end-user application).\n\n"
      "  ┌──────────────────────────┐\n"
      "  │  Layer 7:  ___________   │  ← user-facing\n"
      "  │  Layer 6:  ___________   │\n"
      "  │  Layer 5:  ___________   │\n"
      "  │  Layer 4:  ___________   │\n"
      "  │  Layer 3:  ___________   │\n"
      "  │  Layer 2:  ___________   │\n"
      "  │  Layer 1:  ___________   │  ← physical medium\n"
      "  └──────────────────────────┘"
    ),
    "choices": [
      "Network — IP addressing, routing (routers)",
      "Session — dialog control, connection establishment/teardown",
      "Physical — bits on the wire; cables, voltages, hubs",
      "Application — user-facing protocols: HTTP, SMTP, DNS, FTP",
      "Transport — end-to-end reliable delivery: TCP, UDP",
      "Presentation — encoding, encryption, compression: TLS record layer",
      "Data Link — MAC addressing, frames, error detection (switches)",
    ],
    "correctIndex": 0,
    "correctOrder": [2, 6, 0, 4, 1, 5, 3],
    "difficulty": -0.2,
    "discrimination": 1.0,
    "questionType": "pbq",
    "explanation": (
      "OSI layers from bottom (1) to top (7): "
      "Physical (L1) → Data Link (L2) → Network (L3) → Transport (L4) → "
      "Session (L5) → Presentation (L6) → Application (L7). "
      "Mnemonic: 'Please Do Not Throw Sausage Pizza Away' (1→7) "
      "or 'All People Seem To Need Data Processing' (7→1). "
      "TLS operates at Presentation and Application layers. "
      "IPSec operates at Network layer."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "ietf-rfc-4949"],
  },
  {
    "id": "d3-pbq-or2",
    "type": "ordering",
    "domain": "3. Security Architecture and Engineering",
    "stem": (
      "Place the following Common Criteria Evaluation Assurance Levels (EALs) in order "
      "from LOWEST assurance (EAL 1) to HIGHEST assurance (EAL 4)."
    ),
    "choices": [
      "EAL 3: Methodically Tested and Checked",
      "EAL 1: Functionally Tested",
      "EAL 4: Methodically Designed, Tested, and Reviewed",
      "EAL 2: Structurally Tested",
    ],
    "correctIndex": 0,
    "correctOrder": [1, 3, 0, 2],
    "difficulty": 0.0,
    "discrimination": 1.0,
    "questionType": "pbq",
    "explanation": (
      "Common Criteria EAL levels from lowest to highest: "
      "EAL 1 (functionally tested — minimal assurance) → "
      "EAL 2 (structurally tested) → "
      "EAL 3 (methodically tested and checked) → "
      "EAL 4 (methodically designed, tested, and reviewed — highest EAL commercially feasible). "
      "EAL 5-7 require government-sponsored evaluation. "
      "Most commercial security products target EAL 2-4."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024"],
  },

  # ── DOMAIN 4 ──────────────────────────────────────────────────────────────
  {
    "id": "d4-pbq-dd1",
    "type": "dragdrop",
    "domain": "4. Communication and Network Security",
    "stem": (
      "A network engineer is documenting protocol behaviors for an OSI model training. "
      "Select ALL protocols below that operate at the APPLICATION layer (Layer 7) "
      "of the OSI model. [Select all that apply]"
    ),
    "choices": [
      "HTTP / HTTPS — web browsing",
      "TCP — Transmission Control Protocol",
      "SMTP — email transmission",
      "IP — Internet Protocol routing",
      "DNS — domain name resolution",
      "UDP — User Datagram Protocol",
      "FTP — file transfer",
      "ICMP — Internet Control Message Protocol",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4, 6],
    "difficulty": -0.1,
    "discrimination": 1.0,
    "questionType": "pbq",
    "explanation": (
      "Layer 7 (Application) protocols include: HTTP/HTTPS (0), SMTP (2), DNS (4), and FTP (6). "
      "TCP (1) and UDP (5) are Layer 4 (Transport) protocols. "
      "IP (3) is Layer 3 (Network). "
      "ICMP (7) is also Layer 3 — it uses IP and provides error/diagnostic messaging."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "ietf-rfc-4949"],
  },
  {
    "id": "d4-pbq-dd2",
    "type": "dragdrop",
    "domain": "4. Communication and Network Security",
    "stem": (
      "A network security architect is comparing firewall technologies. "
      "Select ALL statements that are TRUE about a STATEFUL INSPECTION firewall "
      "(also called stateful packet filtering). [Select all that apply]"
    ),
    "choices": [
      "Maintains a state table tracking active TCP/UDP session states",
      "Inspects application-layer content and reconstructs full data streams",
      "Evaluates inbound packets against the context of established outbound connections",
      "Examines each packet in complete isolation, with no awareness of prior packets",
      "Can permit return traffic for established sessions without explicit inbound rules",
      "Makes decisions based solely on static ACL rules without session awareness",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4],
    "difficulty": 0.2,
    "discrimination": 1.2,
    "questionType": "pbq",
    "explanation": (
      "A stateful inspection firewall: "
      "(0) Maintains a connection state table (vs. stateless packet filter); "
      "(2) Evaluates packets against connection context — knows if an inbound packet "
      "belongs to an established session; "
      "(4) Automatically permits return traffic for outbound-initiated sessions. "
      "Option (1) describes a Next-Generation Firewall (NGFW) or WAF performing DPI. "
      "Options (3) and (5) describe a stateless packet filter, not stateful inspection."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-41"],
  },
  {
    "id": "d4-pbq-dd3",
    "type": "dragdrop",
    "domain": "4. Communication and Network Security",
    "stem": (
      "A network team is configuring a site-to-site VPN. "
      "Select ALL statements that are TRUE about IPSec TUNNEL MODE. "
      "[Select all that apply]"
    ),
    "choices": [
      "The entire original IP packet (original header + payload) is encapsulated and protected",
      "Only the payload of the original IP packet is protected; the original IP header remains exposed",
      "A new outer IP header is added using the VPN gateway addresses as source and destination",
      "Tunnel mode is primarily designed for host-to-host communications within a single LAN",
      "Tunnel mode is the standard choice for gateway-to-gateway site-to-site VPNs",
      "ESP or AH protection is applied only to the original payload, not the original header",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4],
    "difficulty": 0.3,
    "discrimination": 1.2,
    "questionType": "pbq",
    "explanation": (
      "IPSec Tunnel Mode: "
      "(0) Encapsulates the entire original IP packet — both original header and payload are protected; "
      "(2) Adds a new outer IP header with gateway IP addresses; "
      "(4) Used for gateway-to-gateway (site-to-site) VPNs. "
      "Option (1) and (5) describe Transport Mode, which protects only the payload. "
      "Option (3) is incorrect — Transport Mode is used for host-to-host within a LAN/intranet. "
      "ESP is most common (provides confidentiality + integrity); AH provides only integrity."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "ietf-rfc-4949"],
  },
  {
    "id": "d4-pbq-or1",
    "type": "ordering",
    "domain": "4. Communication and Network Security",
    "stem": (
      "Order the steps of the TCP three-way handshake from FIRST to LAST.\n\n"
      "  Client                         Server\n"
      "    |                               |\n"
      "    |─────── [Step 1] ─────────────►|\n"
      "    |                               |\n"
      "    |◄────── [Step 2] ──────────────|\n"
      "    |                               |\n"
      "    |─────── [Step 3] ─────────────►|\n"
      "    |                               |\n"
      "    |      Connection ESTABLISHED   |"
    ),
    "choices": [
      "Server sends SYN-ACK segment to client (acknowledges SYN, sends own SYN)",
      "Client sends SYN segment to server (initiates connection, proposes sequence number)",
      "Client sends ACK segment to server (acknowledges server's SYN-ACK)",
    ],
    "correctIndex": 0,
    "correctOrder": [1, 0, 2],
    "difficulty": -0.4,
    "discrimination": 0.9,
    "questionType": "pbq",
    "explanation": (
      "TCP three-way handshake: "
      "(1) Client → SYN — client picks initial sequence number (ISN) and sends SYN flag; "
      "(2) Server → SYN-ACK — server acknowledges client ISN and sends its own ISN; "
      "(3) Client → ACK — client acknowledges server ISN; connection is now ESTABLISHED. "
      "SYN flood attacks exploit this by sending many SYNs without completing the handshake, "
      "exhausting the server's half-open connection table (mitigated by SYN cookies)."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "ietf-rfc-4949"],
  },
  {
    "id": "d4-pbq-or2",
    "type": "ordering",
    "domain": "4. Communication and Network Security",
    "stem": (
      "Order the following TLS 1.3 handshake messages from FIRST to LAST "
      "as observed in a standard connection establishment.\n\n"
      "  Client ◄──────────────────────────────► Server\n"
      "    |                                       |\n"
      "    |  [msg 1]  ──────────────────────────► |\n"
      "    |           ◄──────────────────────────  |\n"
      "    |  [msg 2 + msg 3 + msg 4 from server]   |\n"
      "    |  [msg 5]  ──────────────────────────► |"
    ),
    "choices": [
      "Client → Finished (client completes handshake, all subsequent data is encrypted)",
      "Server → Certificate + CertificateVerify (server proves identity with private key signature)",
      "Client → ClientHello (proposes TLS version, cipher suites, supported groups, key share)",
      "Server → ServerHello + key_share (selects cipher suite, sends server key share)",
      "Server → Finished (server side handshake complete)",
    ],
    "correctIndex": 0,
    "correctOrder": [2, 3, 1, 4, 0],
    "difficulty": 0.5,
    "discrimination": 1.3,
    "questionType": "pbq",
    "explanation": (
      "TLS 1.3 handshake (RFC 8446): "
      "(1) Client sends ClientHello — includes key_share for 0-RTT key derivation; "
      "(2) Server sends ServerHello + key_share — both sides can now derive handshake keys; "
      "(3) Server sends Certificate + CertificateVerify — proves server identity; "
      "(4) Server sends Finished — server-side handshake complete; "
      "(5) Client sends Finished — handshake done; application data flows. "
      "TLS 1.3 eliminates the RSA key exchange and reduces to 1-RTT (vs 2-RTT in TLS 1.2)."
    ),
    "sourceIds": ["ietf-rfc-8446", "isc2-cissp-exam-outline-2024"],
  },

  # ── DOMAIN 5 ──────────────────────────────────────────────────────────────
  {
    "id": "d5-pbq-dd1",
    "type": "dragdrop",
    "domain": "5. Identity and Access Management (IAM)",
    "stem": (
      "A security architect is reviewing an organization's MFA implementation. "
      "Select ALL options below that belong to the SOMETHING YOU HAVE "
      "authentication factor category. [Select all that apply]"
    ),
    "choices": [
      "Hardware OTP token (e.g., RSA SecurID fob)",
      "Fingerprint biometric scan",
      "Smart card (PIV / CAC card)",
      "Complex passphrase or password",
      "Time-based OTP via mobile authenticator app (e.g., Google Authenticator)",
      "Retina scan",
      "Magnetic-stripe access badge",
      "Memorized security question answer",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4, 6],
    "difficulty": -0.1,
    "discrimination": 1.0,
    "questionType": "pbq",
    "explanation": (
      "Something You Have — physical or logical tokens you possess: "
      "hardware OTP token (0), smart card/PIV (2), mobile authenticator app (4), "
      "and magnetic-stripe badge (6). "
      "Fingerprint (1) and retina scan (5) are Something You Are (biometrics). "
      "Passphrase (3) and security question (7) are Something You Know."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-63-3"],
  },
  {
    "id": "d5-pbq-dd2",
    "type": "dragdrop",
    "domain": "5. Identity and Access Management (IAM)",
    "stem": (
      "An organization is adopting a Zero Trust architecture per NIST SP 800-207. "
      "Select ALL statements below that reflect CORE PRINCIPLES of the Zero Trust model. "
      "[Select all that apply]"
    ),
    "choices": [
      "Verify explicitly — authenticate and authorize every request regardless of network location",
      "Trust all traffic originating from within the corporate network perimeter",
      "Use least privilege access — limit entitlements to the minimum required",
      "Assume breach — design systems as if the network is already compromised",
      "Grant elevated access automatically to on-premises users without re-verification",
      "Inspect and log all traffic, including lateral (east-west) encrypted traffic",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 3, 5],
    "difficulty": 0.1,
    "discrimination": 1.1,
    "questionType": "pbq",
    "explanation": (
      "Zero Trust's three core tenets (Microsoft/NIST model): "
      "(0) Verify explicitly — use all available data points (identity, location, device, etc.); "
      "(2) Use least privilege — JIT/JEA, risk-based adaptive policies; "
      "(3) Assume breach — minimize blast radius, end-to-end encryption, analytics. "
      "(5) Inspect and log all traffic is a Zero Trust implementation requirement per NIST SP 800-207. "
      "Options (1) and (4) describe the old perimeter-based 'castle and moat' model that "
      "Zero Trust explicitly rejects — location is NOT a trust signal in ZTA."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-53r5"],
  },
  {
    "id": "d5-pbq-dd3",
    "type": "dragdrop",
    "domain": "5. Identity and Access Management (IAM)",
    "stem": (
      "A security team is implementing a Privileged Access Management (PAM) program. "
      "Select ALL controls below that are considered core PRIVILEGED ACCESS MANAGEMENT "
      "capabilities. [Select all that apply]"
    ),
    "choices": [
      "Just-in-time (JIT) privileged access — elevate rights on demand, auto-revoke when done",
      "Enterprise single sign-on (SSO) for all standard business application users",
      "Privileged credential vaulting — store, rotate, and check-out admin passwords securely",
      "Self-service password reset portal for standard employee accounts",
      "Session recording and monitoring for all privileged administrator sessions",
      "Role-based access control (RBAC) assignments for general business application access",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4],
    "difficulty": 0.2,
    "discrimination": 1.2,
    "questionType": "pbq",
    "explanation": (
      "PAM capabilities focus exclusively on privileged (admin/root/service) accounts: "
      "(0) JIT access — eliminate standing privileges, provision on demand; "
      "(2) Credential vaulting — centrally manage admin passwords, enforce rotation; "
      "(4) Session recording — create full audit trail of privileged activities. "
      "SSO (1) and self-service reset (3) are general IAM controls, not PAM-specific. "
      "RBAC (5) governs standard user access, not privileged account management."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-53r5"],
  },
  {
    "id": "d5-pbq-or1",
    "type": "ordering",
    "domain": "5. Identity and Access Management (IAM)",
    "stem": (
      "Order the steps of the Kerberos v5 authentication process from FIRST to LAST.\n\n"
      "  Client ──────► [KDC: AS] ──────► [KDC: TGS] ──────► [Service]\n"
      "  (AS = Authentication Server, TGS = Ticket Granting Server)\n\n"
      "Arrange the four steps in sequence:"
    ),
    "choices": [
      "Client sends credentials (AS-REQ) to the Authentication Server and requests a TGT",
      "Client presents the Service Ticket (AP-REQ) directly to the target application server",
      "Client receives the TGT (AS-REP) encrypted with the KDC's key and decrypts session key",
      "Client presents TGT to the Ticket Granting Server (TGS-REQ) and requests a Service Ticket",
    ],
    "correctIndex": 0,
    "correctOrder": [0, 2, 3, 1],
    "difficulty": 0.4,
    "discrimination": 1.3,
    "questionType": "pbq",
    "explanation": (
      "Kerberos v5 sequence: "
      "(1) AS-REQ — client sends preauthentication data to AS, requests TGT; "
      "(2) AS-REP — client receives TGT (encrypted with KDC key) + session key; "
      "(3) TGS-REQ — client presents TGT to TGS, requests Service Ticket for target; "
      "(4) AP-REQ — client presents Service Ticket to the application server for access. "
      "The KDC (AS + TGS) never sends the password over the wire. "
      "Single sign-on is achieved because the TGT can be used for multiple service requests."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-63-3"],
  },

  # ── DOMAIN 6 ──────────────────────────────────────────────────────────────
  {
    "id": "d6-pbq-dd1",
    "type": "dragdrop",
    "domain": "6. Security Assessment and Testing",
    "stem": (
      "An authorized penetration tester is in the Intelligence Gathering phase. "
      "Select ALL techniques below that qualify as PASSIVE reconnaissance "
      "(no direct interaction with the target's systems or network). "
      "[Select all that apply]"
    ),
    "choices": [
      "WHOIS lookups on the target's registered domain names",
      "Running Nmap port scans directly against the target IP range",
      "Reviewing publicly available job postings to infer technology stack",
      "Sending crafted SYN packets to enumerate open ports on the DMZ",
      "Searching LinkedIn and GitHub for employee names and public code repositories",
      "Querying the target's web server with crafted HTTP requests",
      "Analyzing historical DNS records via passive DNS replication databases (e.g., Shodan, Censys)",
      "Performing a DNS zone transfer (AXFR) against the target's DNS server",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4, 6],
    "difficulty": 0.1,
    "discrimination": 1.1,
    "questionType": "pbq",
    "explanation": (
      "Passive reconnaissance gathers information without touching target systems: "
      "(0) WHOIS — public registry lookup; "
      "(2) Job postings — open source intelligence (OSINT) from public web; "
      "(4) LinkedIn/GitHub — OSINT from public social and code platforms; "
      "(6) Passive DNS databases — historical DNS data from third-party services, no target contact. "
      "Nmap scans (1), SYN packets (3), crafted HTTP requests (5), and zone transfer (7) "
      "all send packets to the target and are ACTIVE reconnaissance techniques."
    ),
    "sourceIds": ["nist-sp-800-115", "isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d6-pbq-dd2",
    "type": "dragdrop",
    "domain": "6. Security Assessment and Testing",
    "stem": (
      "A client asks for the difference between a penetration test and a vulnerability assessment. "
      "Select ALL activities that are performed in a PENETRATION TEST but NOT typically "
      "in a standard vulnerability assessment. [Select all that apply]"
    ),
    "choices": [
      "Actively exploiting discovered vulnerabilities to achieve unauthorized access",
      "Running automated scanners (Nessus, Qualys) to identify known CVEs",
      "Privilege escalation after gaining an initial foothold on a compromised host",
      "Generating a prioritized report of vulnerabilities by CVSS severity",
      "Pivoting through compromised systems to access additional internal network segments",
      "Comparing scan output against vendor advisories and patch bulletins",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4],
    "difficulty": 0.0,
    "discrimination": 1.2,
    "questionType": "pbq",
    "explanation": (
      "A penetration test goes beyond vulnerability identification to actual exploitation: "
      "(0) Exploitation — actively compromise systems to prove a vulnerability is exploitable; "
      "(2) Privilege escalation — move from limited to admin/root access post-compromise; "
      "(4) Pivoting — use one compromised host as a launchpad to attack others. "
      "Automated scanning (1), generating vulnerability reports (3), and patch comparison (5) "
      "are steps in a vulnerability assessment, which stops at identification and does NOT exploit."
    ),
    "sourceIds": ["nist-sp-800-115", "isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d6-pbq-or1",
    "type": "ordering",
    "domain": "6. Security Assessment and Testing",
    "stem": (
      "Place the following penetration testing phases in the correct sequential order "
      "from FIRST to LAST, following the standard industry methodology (PTES / EC-Council):"
    ),
    "choices": [
      "Reporting — document findings, evidence, risk ratings, and remediation guidance",
      "Scanning and Enumeration — identify open ports, services, OS fingerprints, and attack surfaces",
      "Exploitation — leverage vulnerabilities to gain unauthorized access",
      "Post-Exploitation — lateral movement, privilege escalation, persistence, data exfiltration proof",
      "Reconnaissance — collect intelligence about the target (passive and active OSINT)",
    ],
    "correctIndex": 0,
    "correctOrder": [4, 1, 2, 3, 0],
    "difficulty": 0.0,
    "discrimination": 1.1,
    "questionType": "pbq",
    "explanation": (
      "Standard penetration testing methodology: "
      "(1) Reconnaissance — gather intelligence (passive OSINT + active footprinting); "
      "(2) Scanning/Enumeration — active probe: port scans, service versions, OS detection; "
      "(3) Exploitation — attack vulnerabilities to achieve access (initial compromise); "
      "(4) Post-Exploitation — escalate privileges, move laterally, prove business impact; "
      "(5) Reporting — document all findings with evidence and ranked recommendations. "
      "Reporting is always the LAST phase and should include an executive summary and technical detail."
    ),
    "sourceIds": ["nist-sp-800-115", "isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d6-pbq-or2",
    "type": "ordering",
    "domain": "6. Security Assessment and Testing",
    "stem": (
      "A security operations team is formalizing their vulnerability management program. "
      "Order the phases of the vulnerability management lifecycle from FIRST to LAST:"
    ),
    "choices": [
      "Remediation — apply patches, configuration fixes, or compensating controls",
      "Asset Discovery and Inventory — identify all systems, applications, and services in scope",
      "Verification — rescan and confirm vulnerabilities have been successfully resolved",
      "Vulnerability Scanning and Detection — detect and catalog vulnerabilities on discovered assets",
      "Prioritization and Risk Assessment — rank vulnerabilities by CVSS score, asset criticality, and exploitability",
    ],
    "correctIndex": 0,
    "correctOrder": [1, 3, 4, 0, 2],
    "difficulty": 0.1,
    "discrimination": 1.1,
    "questionType": "pbq",
    "explanation": (
      "Vulnerability management lifecycle: "
      "(1) Asset Discovery — you cannot protect what you do not know exists; "
      "(2) Scanning/Detection — scan discovered assets for known vulnerabilities; "
      "(3) Prioritization — rank by risk (not all critical CVSS scores are equally urgent given context); "
      "(4) Remediation — patch, configure, or mitigate; "
      "(5) Verification — rescan to confirm remediation effectiveness. "
      "This cycle repeats continuously (continuous vulnerability management)."
    ),
    "sourceIds": ["nist-sp-800-115", "isc2-cissp-exam-outline-2024"],
  },

  # ── DOMAIN 7 ──────────────────────────────────────────────────────────────
  {
    "id": "d7-pbq-dd1",
    "type": "dragdrop",
    "domain": "7. Security Operations",
    "stem": (
      "A forensic investigator is collecting evidence from a compromised server. "
      "Select ALL actions required to maintain proper CHAIN OF CUSTODY for digital evidence. "
      "[Select all that apply]"
    ),
    "choices": [
      "Document the collector's name, date, time, and location of evidence collection",
      "Analyze data directly on the original hard drive to preserve the original state",
      "Use a hardware write blocker when creating a forensic bit-for-bit image",
      "Upload evidence to a shared team network folder for collaborative analysis",
      "Generate cryptographic hashes (MD5, SHA-256) of both original and forensic copy",
      "Maintain a contemporaneous log of every person who accessed or handled the evidence",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4, 5],
    "difficulty": 0.1,
    "discrimination": 1.2,
    "questionType": "pbq",
    "explanation": (
      "Chain of custody requires: "
      "(0) Documentation of collection — who, what, when, where; "
      "(2) Write blockers — prevent accidental modification during imaging (preserves integrity); "
      "(4) Hash verification — prove the forensic copy is an exact duplicate of the original; "
      "(5) Access log — every person who touches evidence must be documented. "
      "Analyzing on original media (1) risks modifying evidence and invalidates integrity. "
      "Shared network folders (3) break chain of custody by introducing uncontrolled access."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-61r2"],
  },
  {
    "id": "d7-pbq-dd2",
    "type": "dragdrop",
    "domain": "7. Security Operations",
    "stem": (
      "A business continuity analyst has just completed a Business Impact Analysis (BIA). "
      "Select ALL metrics or outputs that are DIRECT results of a BIA. "
      "[Select all that apply]"
    ),
    "choices": [
      "Recovery Time Objective (RTO) — maximum acceptable downtime per business function",
      "Annual Loss Expectancy (ALE) — expected annual loss from a given threat",
      "Recovery Point Objective (RPO) — maximum tolerable data loss measured in time",
      "Maximum Tolerable Downtime (MTD) — absolute deadline before disruption becomes catastrophic",
      "Single Loss Expectancy (SLE) — asset value multiplied by the exposure factor",
      "Prioritized list of critical business functions ranked by impact of disruption",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 3, 5],
    "difficulty": 0.3,
    "discrimination": 1.2,
    "questionType": "pbq",
    "explanation": (
      "A BIA produces: "
      "(0) RTO — maximum time to restore a function before unacceptable business impact; "
      "(2) RPO — how much data loss (measured in time) is tolerable; "
      "(3) MTD (also called MTPD — Maximum Tolerable Period of Disruption) — "
      "absolute deadline beyond which recovery may be impossible; "
      "(5) Prioritized critical functions — ranked by impact to drive recovery sequence. "
      "ALE (1) and SLE (4) are outputs of QUANTITATIVE RISK ANALYSIS (asset value × EF × ARO), "
      "not the BIA. The BIA focuses on operational impact, not threat-based financial loss estimates."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-34r1", "iso-22301-2019"],
  },
  {
    "id": "d7-pbq-or1",
    "type": "ordering",
    "domain": "7. Security Operations",
    "stem": (
      "Order the four phases of the NIST SP 800-61r2 Incident Response lifecycle "
      "from FIRST to LAST.\n\n"
      "  ┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐\n"
      "  │  Phase 1   │────►│  Phase 2   │────►│  Phase 3   │────►│  Phase 4   │\n"
      "  └────────────┘     └────────────┘     └────────────┘     └────────────┘\n\n"
      "Arrange the four phases in the correct order:"
    ),
    "choices": [
      "Containment, Eradication, and Recovery",
      "Post-Incident Activity (Lessons Learned / After-Action Review)",
      "Preparation",
      "Detection and Analysis",
    ],
    "correctIndex": 0,
    "correctOrder": [2, 3, 0, 1],
    "difficulty": -0.1,
    "discrimination": 1.0,
    "questionType": "pbq",
    "explanation": (
      "NIST SP 800-61r2 Incident Response lifecycle: "
      "(1) Preparation — establish IR policy, team, tools, and communications before incidents occur; "
      "(2) Detection and Analysis — identify and confirm the incident, assess scope and severity; "
      "(3) Containment, Eradication, and Recovery — isolate affected systems, remove malware, restore; "
      "(4) Post-Incident Activity — document lessons learned, update procedures, improve defenses. "
      "The cycle then feeds back into Preparation to improve readiness for future incidents."
    ),
    "sourceIds": ["nist-sp-800-61r2", "isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d7-pbq-or2",
    "type": "ordering",
    "domain": "7. Security Operations",
    "stem": (
      "Order the steps of a digital forensics investigation from FIRST to LAST, "
      "following the standard forensics process model (SWGDE / RFC 3227):"
    ),
    "choices": [
      "Analysis — examine forensic images for artifacts, IOCs, and evidence of malicious activity",
      "Identification — determine which systems, media, and data sources are relevant to the investigation",
      "Reporting — document findings, methodology, chain of custody, and expert conclusions",
      "Preservation / Acquisition — create verified forensic images using write blockers and hash verification",
      "Collection — physically collect and document all identified evidence at the scene or in the environment",
    ],
    "correctIndex": 0,
    "correctOrder": [1, 4, 3, 0, 2],
    "difficulty": 0.2,
    "discrimination": 1.1,
    "questionType": "pbq",
    "explanation": (
      "Digital forensics process (RFC 3227 / SWGDE): "
      "(1) Identification — scope the investigation, identify relevant evidence; "
      "(2) Collection — physically seize or document evidence in-place; "
      "(3) Preservation/Acquisition — create verified forensic images (write blockers + hashing); "
      "(4) Analysis — examine forensic copies for artifacts, timeline, IOCs; "
      "(5) Reporting — expert report with methodology and findings for legal proceedings. "
      "Analysis MUST be performed on forensic copies, never the original media, "
      "to preserve chain of custody and avoid modifying evidence."
    ),
    "sourceIds": ["nist-sp-800-61r2", "isc2-cissp-exam-outline-2024"],
  },

  # ── DOMAIN 8 ──────────────────────────────────────────────────────────────
  {
    "id": "d8-pbq-dd1",
    "type": "dragdrop",
    "domain": "8. Software Development Security",
    "stem": (
      "A DevSecOps team is selecting security testing tools for their CI/CD pipeline. "
      "Select ALL statements that are TRUE about Static Application Security Testing (SAST). "
      "[Select all that apply]"
    ),
    "choices": [
      "Analyzes source code, bytecode, or binaries WITHOUT executing the application",
      "Requires a running, deployed application to identify vulnerabilities",
      "Can detect SQL injection, buffer overflows, and hard-coded secrets in code",
      "Simulates attacks against a live web application from an external attacker perspective",
      "Integrates early in the SDLC (shift-left security) before the application is deployed",
      "Exclusively identifies runtime configuration and environment-specific vulnerabilities",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4],
    "difficulty": 0.0,
    "discrimination": 1.1,
    "questionType": "pbq",
    "explanation": (
      "SAST (Static Application Security Testing) / 'white-box' testing: "
      "(0) Analyzes code without execution — inspects source, bytecode, or binaries directly; "
      "(2) Detects common flaws in code: SQLi, buffer overflow, hard-coded credentials, path traversal; "
      "(4) Shift-left — runs in IDE or CI/CD pipeline early, before any deployment. "
      "Options (1), (3), and (5) describe DAST (Dynamic Application Security Testing), "
      "which requires a running application and sends attack payloads to find runtime vulnerabilities. "
      "SAST has high false-positive rates and cannot detect auth flaws that require live session context."
    ),
    "sourceIds": ["nist-sp-800-218", "isc2-cissp-exam-outline-2024"],
  },
  {
    "id": "d8-pbq-dd2",
    "type": "dragdrop",
    "domain": "8. Software Development Security",
    "stem": (
      "A web application security trainer is building course content. "
      "Select ALL categories below that appear in the OWASP Top 10 (2021 edition). "
      "[Select all that apply]"
    ),
    "choices": [
      "A01: Broken Access Control",
      "Weak Encryption Keys (key length below recommended minimums)",
      "A03: Injection (SQL injection, OS command injection, LDAP injection)",
      "Unpatched Server Operating Systems and Third-Party Libraries",
      "A04: Insecure Design (missing security controls at the architecture level)",
      "Social Engineering and Phishing Attack Vectors",
      "A05: Security Misconfiguration (default creds, unnecessary features enabled)",
      "Spoofed or Forged TLS Certificates",
    ],
    "correctIndex": 0,
    "correctAnswers": [0, 2, 4, 6],
    "difficulty": 0.0,
    "discrimination": 1.1,
    "questionType": "pbq",
    "explanation": (
      "OWASP Top 10 (2021): A01 Broken Access Control, A02 Cryptographic Failures, "
      "A03 Injection, A04 Insecure Design, A05 Security Misconfiguration, "
      "A06 Vulnerable and Outdated Components, A07 Identification and Authentication Failures, "
      "A08 Software and Data Integrity Failures, A09 Security Logging and Monitoring Failures, "
      "A10 Server-Side Request Forgery (SSRF). "
      "The distractors (1, 3, 5, 7) are real security concerns but are NOT named OWASP Top 10 categories. "
      "'Weak encryption keys' falls under A02 Cryptographic Failures — but the listed distractors "
      "don't match the exact OWASP category names."
    ),
    "sourceIds": ["isc2-cissp-exam-outline-2024", "nist-sp-800-218"],
  },
  {
    "id": "d8-pbq-or1",
    "type": "ordering",
    "domain": "8. Software Development Security",
    "stem": (
      "Place the following SDLC phases in the correct sequential order for the "
      "classic WATERFALL model, from FIRST to LAST.\n\n"
      "  ┌─────────────────────┐\n"
      "  │      Phase 1        │\n"
      "  └──────────┬──────────┘\n"
      "             │\n"
      "  ┌──────────▼──────────┐\n"
      "  │      Phase 2        │\n"
      "  └──────────┬──────────┘\n"
      "             │\n"
      "  ┌──────────▼──────────┐\n"
      "  │      Phase 3        │\n"
      "  └──────────┬──────────┘\n"
      "             │\n"
      "  ┌──────────▼──────────┐\n"
      "  │      Phase 4        │\n"
      "  └──────────┬──────────┘\n"
      "             │\n"
      "  ┌──────────▼──────────┐\n"
      "  │      Phase 5        │\n"
      "  └─────────────────────┘"
    ),
    "choices": [
      "Testing and Quality Assurance — verify the system meets all documented requirements",
      "Requirements Analysis — gather, analyze, and document what the system must do",
      "Design — define architecture, data models, interfaces, and security controls",
      "Deployment and Maintenance — release to production, monitor, and support",
      "Implementation (Coding) — write software based on design specifications",
    ],
    "correctIndex": 0,
    "correctOrder": [1, 2, 4, 0, 3],
    "difficulty": -0.2,
    "discrimination": 1.0,
    "questionType": "pbq",
    "explanation": (
      "Waterfall SDLC phases in order: "
      "(1) Requirements Analysis — define functional and non-functional requirements; "
      "(2) Design — architectural design, security design (threat modeling); "
      "(3) Implementation — coding and unit testing; "
      "(4) Testing/QA — integration testing, system testing, security testing; "
      "(5) Deployment and Maintenance — production release, patching, support. "
      "Waterfall is sequential with minimal backtracking — each phase must complete before the next. "
      "Security must be integrated at ALL phases (shift-left), not just at Testing."
    ),
    "sourceIds": ["nist-sp-800-218", "isc2-cissp-exam-outline-2024"],
  },
]

def main():
    path = "/home/alex/alex-cyber-study/cat/question-bank.sample.json"
    print(f"Loading {path}...")
    with open(path) as f:
        data = json.load(f)

    existing_ids = {item["id"] for item in data["items"]}
    new_items = [item for item in PBQ_ITEMS if item["id"] not in existing_ids]
    skipped = [item["id"] for item in PBQ_ITEMS if item["id"] in existing_ids]

    if skipped:
        print(f"Skipping already-present items: {skipped}")

    if not new_items:
        print("All PBQ items already present — nothing to add.")
        return

    data["items"].extend(new_items)
    print(f"Adding {len(new_items)} PBQ items. New total: {len(data['items'])}")

    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Done.")

if __name__ == "__main__":
    main()
