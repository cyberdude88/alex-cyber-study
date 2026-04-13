#!/usr/bin/env python3
"""
cissp_quality_rewrite.py

Three passes over the augmented question bank:

PASS 1 — TARGETED REWRITES
  Replaces the 20 worst-scoring unique base items (from CEO audit) with
  properly framed CISSP governance/scenario questions.  Variants (__v1-v3)
  of each rewritten base item inherit the new stem/choices/explanation.

PASS 2 — TERMINOLOGY SOFTENING  (SLE / ALE / ARO / EF)
  Replaces verbatim ISC2 exam acronyms with conceptual synonyms so the
  bank tests understanding of the concept, not memorisation of the label.
    SLE  → "per-event impact value"
    ALE  → "annualized risk exposure"
    ARO  → "occurrence frequency"
    EF   → "loss proportion"
  Applied to ALL items (originals + variants).
  The student must understand what each metric MEANS, not just recall the acronym.

PASS 3 — COMPUTATIONAL DRILL TAGGING
  Arithmetic/calculation questions are NOT removed — they ARE useful when a
  student is scoring low in that domain (diagnostic signal).  Items whose
  stem contains numeric calculation patterns get tagged computationalDrill=True.
  The CAT will gate these: only served when domain ceiling shows weakness.

Output
------
  ../cat/question-bank.quality-fixed.json

Usage
-----
  python3 cissp_quality_rewrite.py
  python3 cissp_quality_rewrite.py --bank ../cat/question-bank.augmented.json
  python3 cissp_quality_rewrite.py --dry-run
"""

import argparse, json, re, sys
from copy import deepcopy
from pathlib import Path

SCRIPT_DIR   = Path(__file__).resolve().parent
REPO_ROOT    = SCRIPT_DIR.parent
DEFAULT_BANK = REPO_ROOT / "cat" / "question-bank.augmented.json"
OUTPUT_BANK  = REPO_ROOT / "cat" / "question-bank.quality-fixed.json"

# ─────────────────────────────────────────────────────────────────────────────
# PASS 1  Targeted rewrites — governance-framed replacements
# ─────────────────────────────────────────────────────────────────────────────
# Keys are base item IDs.  Variants automatically inherit the new content.
# Each entry:  stem, choices (list[str]), correctIndex (int), explanation (str)
# difficulty and domain are preserved from the original item.

REWRITES = {

  # ── D1-Q14: SLE calculation → governance decision framing ─────────────────
  "d1-q14": {
    "stem": (
      "A risk analyst presents the board with quantitative risk data for a manufacturing facility "
      "valued at $500,000. A fire hazard is assessed with a damage potential of 60% of the asset. "
      "The board asks what single figure BEST represents the financial exposure from one fire incident, "
      "to anchor the cost-benefit analysis for fire suppression investment."
    ),
    "choices": [
      "$300,000 — the per-event impact value, calculated as asset worth multiplied by the loss proportion",
      "$500,000 — the full replacement cost, regardless of the partial nature of the assessed damage",
      "$100,000 — the annualized risk exposure assuming fires occur once every five years",
      "$60,000 — the fractional damage expressed as a dollar figure without applying the full asset value",
    ],
    "correctIndex": 0,
    "explanation": (
      "The per-event impact value (Single Loss Expectancy) represents the expected monetary loss from "
      "a single occurrence of a specific threat: asset value × loss proportion = $500,000 × 0.60 = $300,000. "
      "This is the foundational input for cost-benefit analysis — if a fire suppression system costs less "
      "than the per-event impact value, it is economically justified on a single-incident basis alone. "
      "The full replacement cost ($500,000) overstates exposure when partial loss is assessed. The "
      "annualized figure ($100,000) is a different metric (annualized risk exposure = per-event impact × "
      "occurrence frequency). $60,000 incorrectly omits the asset value multiplier."
    ),
  },

  # ── D1-Q91: ALE calculation → governance framing ──────────────────────────
  "d1-q91": {
    "stem": (
      "A risk manager is building the annual security budget justification for a $500,000 CDN facility "
      "located in an earthquake-prone region. Historical data shows a 2% structural damage potential "
      "per earthquake, with earthquakes occurring twice annually. The CFO asks what figure BEST "
      "represents the annualized financial risk to present to the board's risk committee."
    ),
    "choices": [
      "$20,000 — the annualized risk exposure, derived from asset worth × loss proportion × occurrence frequency",
      "$10,000 — the per-event impact value for a single earthquake at 2% loss proportion",
      "$40,000 — the maximum possible annual loss assuming a 4% compounded damage rate",
      "$2,000 — the per-occurrence fractional loss without factoring in annual frequency",
    ],
    "correctIndex": 0,
    "explanation": (
      "Annualized risk exposure (Annual Loss Expectancy) = per-event impact value × occurrence frequency. "
      "Per-event impact = $500,000 × 2% = $10,000. Occurrence frequency = 2 per year. "
      "Annualized risk exposure = $10,000 × 2 = $20,000. "
      "This figure gives executives a like-for-like comparison against the cost of controls. "
      "$10,000 is the per-event impact without annualizing. $40,000 incorrectly compounds the rate. "
      "$2,000 applies the percentage to the wrong base."
    ),
  },

  # ── D1-Q83: IP for pseudocode — governance framing ────────────────────────
  "d1-q83": {
    "stem": (
      "A researcher employed by a technology firm develops original software code that improves a "
      "biometric verification system's performance by 25%. She wants to formally protect this work "
      "as intellectual property to prevent unauthorized copying or distribution. No registration "
      "has yet been filed. Which form of IP protection is MOST appropriate for original software "
      "code expressed in a fixed medium, and arises automatically upon creation?"
    ),
    "choices": [
      "Copyright, which protects original works of authorship — including software code — automatically upon fixation, without requiring registration",
      "Patent, which protects novel inventions and processes and requires formal examination and registration",
      "Trademark, which protects identifiers of commercial origin such as brand names and logos",
      "Trade secret, which protects confidential business information that derives value from remaining undisclosed",
    ],
    "correctIndex": 0,
    "explanation": (
      "Copyright protection attaches automatically when an original work is fixed in a tangible medium — "
      "software source code qualifies. No registration is required for protection to exist, though "
      "registration is needed to file an infringement lawsuit in the US. A patent could theoretically "
      "protect a novel algorithm as an invention, but requires examination and registration, covers only "
      "novel/non-obvious inventions, and a 25% performance improvement in pseudocode may not meet the "
      "patent threshold. Trademark protects brand identity, not functional works. Trade secret requires "
      "the information to remain confidential — publication destroys protection."
    ),
  },

  # ── D1-Q121: Strategic Alignment — COBIT governance framing ───────────────
  "d1-q121": {
    "stem": (
      "A newly hired Security Architect with deep vendor-specific product experience consistently "
      "recommends proprietary solutions from previous employers, regardless of fit to the "
      "organization's approved risk management framework. The CISO observes that these recommendations "
      "are optimizing for technical familiarity rather than business objectives. Which governance "
      "principle is MOST at risk when security investment decisions are driven by vendor preference "
      "rather than organizational strategy?"
    ),
    "choices": [
      "Strategic Alignment — security decisions must derive from and support business goals, not individual technical preferences or vendor relationships",
      "Value Delivery — the failure to deliver measurable security outcomes against defined KPIs",
      "Risk Management — the inability to identify and treat risks within defined tolerance thresholds",
      "Resource Management — the inefficient allocation of security budget across technology investments",
    ],
    "correctIndex": 0,
    "explanation": (
      "Strategic Alignment — one of the five COBIT IT governance focus areas — requires that security "
      "and IT decisions be anchored to organizational objectives. When an architect recommends based "
      "on vendor familiarity, the security program drifts from business-aligned decision-making. "
      "Value Delivery, Risk Management, and Resource Management are all affected downstream, but "
      "the root failure is Strategic Alignment: the decision process itself is disconnected from "
      "the organization's mission. The governance correction is to require that all recommendations "
      "trace to a defined business requirement or risk treatment objective."
    ),
  },

  # ── D1-Q58: GLBA fill-in-the-blank → scenario framing ────────────────────
  "d1-q58": {
    "stem": (
      "A bank's legal counsel informs the CISO that a federal privacy law requires providing "
      "customers with written privacy notices explaining how their financial information is "
      "collected, used, and shared — and that customers must be given the opportunity to opt out "
      "of certain third-party data sharing. The CISO must align the security program's data "
      "handling practices with this requirement. Which regulation MOST directly governs these "
      "privacy notice and opt-out obligations for US financial institutions?"
    ),
    "choices": [
      "The Gramm-Leach-Bliley Act (GLBA), which mandates that financial institutions provide privacy notices and offer customers opt-out rights for third-party information sharing",
      "The Health Insurance Portability and Accountability Act (HIPAA), which governs protected health information handling for covered healthcare entities",
      "The Children's Online Privacy Protection Act (COPPA), which regulates the collection of personal information from children under 13",
      "The Fair Credit Reporting Act (FCRA), which governs the accuracy, fairness, and privacy of consumer credit information",
    ],
    "correctIndex": 0,
    "explanation": (
      "GLBA (Gramm-Leach-Bliley Act) requires US financial institutions to provide customers with "
      "clear privacy notices, explain information-sharing practices, and offer opt-out rights for "
      "sharing with non-affiliated third parties. The GLBA Safeguards Rule also requires a written "
      "information security program. HIPAA applies to healthcare entities and their business "
      "associates, not banks. COPPA addresses children's data online. FCRA governs consumer "
      "reporting agencies and credit data — it does not require the bank-to-customer privacy "
      "notice described."
    ),
  },

  # ── D2-Q54: SSD destruction — governance/policy framing ───────────────────
  "d2-q54": {
    "stem": (
      "A data custodian identifies a batch of SSDs that have exceeded their retention period. "
      "The data owner, aware that the drives previously held sensitive PII subject to regulatory "
      "data disposal requirements, directs that the media be disposed of securely. The security "
      "team notes that SSDs use NAND flash memory distributed across multiple chips, making "
      "overwrite-based sanitization unreliable. What media sanitization method provides the "
      "HIGHEST assurance of unrecoverability for these SSDs?"
    ),
    "choices": [
      "Physical destruction (shredding or disintegration), which guarantees data unrecoverability because SSDs lack the magnetic properties required for degaussing and overwrite coverage is incomplete across remapped cells",
      "Secure overwrite using a DoD 5220.22-M multi-pass wipe, which writes and verifies multiple patterns across all addressable sectors",
      "Degaussing with an NSA-approved degausser, which disrupts magnetic domains and renders data unreadable",
      "Cryptographic erasure — discarding the encryption key for a self-encrypting drive — where the drive was previously configured as a self-encrypting device",
    ],
    "correctIndex": 0,
    "explanation": (
      "NAND-based SSDs store data across multiple chips with wear-leveling algorithms that remap "
      "blocks — overwrite tools cannot reliably reach all physical cells, leaving residual data "
      "in remapped or reserved sectors. Degaussing has no effect on SSDs (no magnetic media). "
      "Physical destruction via shredding or disintegration guarantees no recovery is possible. "
      "Note: cryptographic erasure (option D) IS an acceptable method IF the drive was operating "
      "as a self-encrypting device (SED) from the start — but the question specifies drives that "
      "need post-hoc sanitization without confirming SED configuration, making physical destruction "
      "the only universally reliable option."
    ),
  },

  # ── D3-Q50: TLS key count trivia → governance/remediation framing ──────────
  "d3-q50": {
    "stem": (
      "An audit team identifies that several production application servers still accept SSLv3 "
      "connections following the public disclosure of the POODLE vulnerability. The CISO must "
      "present a remediation recommendation to the executive team. What should the remediation "
      "plan FIRST address to eliminate the cryptographic risk introduced by SSLv3?"
    ),
    "choices": [
      "Disable SSLv3 on all affected servers and enforce a minimum of TLS 1.2, as SSLv3 contains an unfixable design flaw exploited by POODLE that no configuration change can mitigate",
      "Apply the latest vendor security patches to the application servers, which will automatically upgrade the TLS version negotiated during handshake",
      "Implement network-layer controls to block SSLv3 traffic at the perimeter firewall, while leaving the server configuration unchanged",
      "Deploy mutual TLS (mTLS) authentication across all server connections to prevent downgrade attacks without requiring protocol version changes",
    ],
    "correctIndex": 0,
    "explanation": (
      "POODLE (Padding Oracle On Downgraded Legacy Encryption) exploits a fundamental design flaw "
      "in the CBC padding validation of SSLv3 — it cannot be patched, only disabled. The correct "
      "remediation is to disable SSLv3 at the server and enforce TLS 1.2 or higher. Patching alone "
      "does not disable SSLv3 if the server is configured to accept it. Perimeter blocking reduces "
      "external exposure but does not protect internal connections and leaves the vulnerability "
      "present. mTLS strengthens authentication but does not resolve the SSLv3 protocol flaw — "
      "an attacker can still force a downgrade to SSLv3 if the server accepts it."
    ),
  },

  # ── D4-Q41: OSI trailer → governance/architecture scenario ────────────────
  "d4-q41": {
    "stem": (
      "A network security architect is explaining OSI encapsulation to the CISO in preparation "
      "for a discussion about where error-detection controls apply in the network stack. The "
      "architect notes that one specific layer is unique in that it appends both a header AND "
      "a trailer to the payload — and that the trailer contains a cyclic redundancy check (CRC) "
      "value used to detect transmission errors. The CISO asks which OSI layer this describes, "
      "so she can understand which layer's integrity controls are relevant to their WAN design review."
    ),
    "choices": [
      "Data Link (Layer 2), which frames data by adding a header containing source/destination MAC addresses and a trailer containing the CRC for error detection",
      "Transport (Layer 4), which adds sequencing and acknowledgment information to ensure reliable delivery",
      "Network (Layer 3), which adds source and destination IP addresses to route packets across networks",
      "Physical (Layer 1), which encodes bits as electrical, optical, or radio signals for transmission",
    ],
    "correctIndex": 0,
    "explanation": (
      "The Data Link layer (Layer 2) is the only OSI layer that adds both a header and a trailer. "
      "The header contains source and destination MAC addresses; the trailer contains the Frame "
      "Check Sequence (FCS), typically a CRC, which the receiving node uses to detect errors "
      "introduced during transmission. If the CRC check fails, the frame is discarded. This is "
      "relevant to WAN architecture because Layer 2 error detection operates per-hop — it does not "
      "provide end-to-end integrity (that responsibility belongs to higher layers)."
    ),
  },

  # ── D4-Q52/Q97/Q105: IPv6 gateway → governance/architecture ──────────────
  "d4-q52": {
    "stem": (
      "An organization's R&D department operates an isolated IPv6 network segment to support "
      "modern application development. Researchers need to access IPv4-only external resources "
      "for their work. The network team asks how communication between the IPv6 segment and "
      "IPv4 infrastructure should be facilitated while maintaining security policy controls. "
      "What network component is MOST appropriate for this requirement?"
    ),
    "choices": [
      "A gateway configured for IPv6-to-IPv4 translation or dual-stack operation, which bridges the address family boundary while allowing security policy to be applied to cross-segment traffic",
      "A proxy server deployed in the IPv4 network that accepts IPv6 connections and forwards requests on behalf of IPv6 clients",
      "A VPN tunnel between the IPv6 segment and the IPv4 network that encapsulates IPv6 traffic within IPv4 packets",
      "A DNS64/NAT64 solution that translates IPv6 DNS queries and addresses to IPv4 equivalents without requiring gateway hardware",
    ],
    "correctIndex": 0,
    "explanation": (
      "When IPv6 and IPv4 networks must communicate, a gateway performing protocol translation "
      "(NAT64/NAT46 or dual-stack) is the architectural solution. A dual-stack gateway maintains "
      "both address families simultaneously and applies security policy at the boundary. "
      "A proxy server can achieve this but only for application-layer protocols, not all IP traffic. "
      "VPN tunneling (6in4 or 4in6) is used for site-to-site encapsulation over heterogeneous "
      "networks but adds complexity and overhead. DNS64/NAT64 is a valid lightweight approach "
      "for specific scenarios but typically requires the NAT64 gateway component, making it "
      "a subset of option A rather than a distinct alternative."
    ),
  },

  # ── D4-Q97 and D4-Q105: same concept, mark as duplicate → use d4-q52 rewrite
  "d4-q97": {
    "stem": (
      "A security architect reviews the R&D network design and notes that the department runs "
      "IPv6 internally while corporate infrastructure uses IPv4. Team members report they cannot "
      "reach IPv4-only vendor portals critical to their work. The architect must recommend a "
      "connectivity solution that does not compromise the network segmentation policy. "
      "What is the MOST appropriate solution?"
    ),
    "choices": [
      "Deploy a gateway configured for IPv6-to-IPv4 translation at the boundary, which enables controlled cross-protocol communication while preserving the segmentation policy",
      "Assign dual-stack addresses to all R&D endpoints, enabling them to initiate IPv4 connections directly without a gateway",
      "Route all R&D traffic through the corporate network, eliminating the separate IPv6 segment and its connectivity constraint",
      "Configure static IPv4 routes on the IPv6 router to forward packets destined for IPv4 addresses through a translation layer",
    ],
    "correctIndex": 0,
    "explanation": (
      "A protocol-translating gateway (NAT64, dual-stack gateway) at the boundary between the IPv6 "
      "R&D segment and IPv4 infrastructure enables controlled communication while preserving "
      "network segmentation. Dual-stacking endpoints would require re-addressing all R&D devices "
      "and expands the IPv4 attack surface. Merging the R&D network into corporate eliminates "
      "the intentional segmentation that protects both networks. Static routes without translation "
      "do not resolve the address family incompatibility."
    ),
  },

  # ── D5-Q39/Q85/Q103: Yes/No IDaaS → 4-choice governance scenario ──────────
  "d5-q39": {
    "stem": (
      "An enterprise operates a hybrid infrastructure with on-premises Active Directory and "
      "workloads in a public cloud provider. The IAM team proposes centralizing authentication "
      "using an Identity as a Service (IDaaS) solution. A senior architect objects, arguing that "
      "IDaaS only supports cloud-native workloads and cannot federate with on-premises directory "
      "services. What is the MOST accurate response to this objection?"
    ),
    "choices": [
      "The objection is incorrect — IDaaS platforms support federated identity across hybrid environments by integrating with on-premises directories via SAML, OIDC, or directory synchronization agents",
      "The objection is correct — IDaaS is designed exclusively for cloud workloads and requires all services to be cloud-hosted before federation can be established",
      "The objection is partially correct — IDaaS can support hybrid identity only if on-premises systems are first migrated to a cloud-hosted directory replica",
      "The objection is moot — organizations with on-premises Active Directory should use RADIUS rather than IDaaS for hybrid authentication",
    ],
    "correctIndex": 0,
    "explanation": (
      "IDaaS platforms (such as Microsoft Entra ID, Okta, or Ping Identity) are specifically designed "
      "for hybrid environments. They integrate with on-premises directories via LDAP sync agents, "
      "SAML federation, or OIDC connectors — identity verification does not need to originate "
      "from within a cloud environment. The architect's objection reflects a misconception about "
      "IDaaS architecture. RADIUS is a separate authentication protocol used primarily for "
      "network access control (VPN, Wi-Fi) and does not replace IDaaS for application-level SSO."
    ),
  },

  "d5-q85": {
    "stem": (
      "During a security architecture review, a CISO proposes deploying an Identity as a Service "
      "(IDaaS) solution to consolidate authentication across the organization's hybrid environment. "
      "A board member asks whether IDaaS can support both the on-premises data center workloads "
      "and cloud-hosted applications under a single identity framework. What is the MOST accurate "
      "answer to the board member's question?"
    ),
    "choices": [
      "Yes — IDaaS is explicitly designed to federate identity across hybrid environments, supporting both on-premises and cloud workloads through standard protocols such as SAML 2.0 and OIDC",
      "No — IDaaS platforms require all workloads to be cloud-hosted before a unified identity framework can be applied",
      "Only partially — IDaaS can support cloud workloads natively but requires a separate on-premises identity provider for data center applications",
      "Yes, but only if the on-premises workloads are containerized and exposed via a cloud-compatible API gateway",
    ],
    "correctIndex": 0,
    "explanation": (
      "IDaaS platforms are purpose-built for hybrid identity. They federate with on-premises "
      "directory services using directory synchronization (e.g., Azure AD Connect), SAML 2.0 "
      "federation, or OIDC — without requiring cloud migration of the underlying workloads. "
      "Containerization and API gateways are not prerequisites for IDaaS federation. The key "
      "governance value of IDaaS in a hybrid environment is a single control plane for "
      "authentication policy, MFA enforcement, and conditional access across all workload types."
    ),
  },

  "d5-q103": {
    "stem": (
      "An organization's security team is evaluating whether Identity as a Service (IDaaS) can "
      "serve as the central authentication authority for a mixed environment: legacy on-premises "
      "applications, a co-located ERP system, and three SaaS platforms. A network architect "
      "argues that IDaaS cannot authenticate workloads that do not reside in the cloud. "
      "Which statement MOST accurately describes the scope of IDaaS deployment capability?"
    ),
    "choices": [
      "IDaaS can authenticate users to both on-premises and cloud workloads by federating with on-premises directories and acting as an identity broker via SAML, OIDC, or LDAP proxy",
      "IDaaS is limited to SaaS application authentication and requires a separate on-premises identity provider for legacy and co-located systems",
      "IDaaS can only manage cloud-native applications; on-premises workloads must use Kerberos or NTLM authentication through Active Directory",
      "IDaaS requires all authenticated workloads to be registered in the public cloud provider's identity namespace before federation is possible",
    ],
    "correctIndex": 0,
    "explanation": (
      "IDaaS solutions federate identity across heterogeneous environments. Through directory "
      "synchronization agents, SAML federation, and LDAP proxies, an IDaaS platform can act as "
      "the authentication broker for on-premises legacy applications, co-located systems, and "
      "SaaS platforms simultaneously. This is the primary architectural value of IDaaS in "
      "organizations with mixed infrastructure — it eliminates siloed identity stores and "
      "provides centralized policy enforcement for MFA, conditional access, and session management "
      "regardless of where the workload resides."
    ),
  },

  # ── D5-Q40/Q104: Kerberos recall → scenario ───────────────────────────────
  "d5-q40": {
    "stem": (
      "An enterprise IAM architect is designing a centralized authentication solution for 15,000 "
      "users across eight internal domains. Requirements include single sign-on, mutual "
      "authentication between client and server, time-bound session credentials, and the ability "
      "to delegate authentication without exposing long-term secrets. Which authentication "
      "protocol BEST satisfies all of these requirements?"
    ),
    "choices": [
      "Kerberos, which uses a Key Distribution Center to issue time-limited tickets for mutual authentication and supports credential delegation without transmitting passwords",
      "RADIUS, which centralizes authentication for network access but does not provide SSO or mutual authentication for application-layer services",
      "LDAP, which provides directory lookup for identity attributes but is not itself an authentication protocol for SSO or ticket-based session management",
      "SAML 2.0, which enables SSO across federated identity domains but relies on an external IdP and does not provide native Kerberos-style ticket granting",
    ],
    "correctIndex": 0,
    "explanation": (
      "Kerberos satisfies all stated requirements: the Key Distribution Center (KDC) issues "
      "Ticket Granting Tickets (TGTs) and service tickets; tickets are time-bounded, preventing "
      "replay attacks; the protocol performs mutual authentication (both client and server prove "
      "their identity); and credential delegation (forwarding) is supported without exposing "
      "passwords. RADIUS authenticates network access points (VPN, 802.1X) but does not "
      "provide application-layer SSO. LDAP is a directory protocol. SAML 2.0 supports "
      "federated SSO across organizational boundaries but is a different paradigm — it depends "
      "on assertion-based federation rather than ticket-granting."
    ),
  },

  "d5-q104": {
    "stem": (
      "In preparation for an external identity audit, a multinational bank's IAM team must "
      "document the authentication architecture for its internal application estate. The "
      "architecture uses a centralized ticket-issuing service that authenticates users once "
      "and grants them time-limited service credentials without re-entering passwords. The "
      "auditor asks the IAM lead to identify the protocol that implements this architecture. "
      "Which authentication framework BEST matches this description?"
    ),
    "choices": [
      "Kerberos — an authentication protocol that uses a Key Distribution Center to issue time-limited Ticket Granting Tickets for SSO across internal services",
      "OAuth 2.0 — an authorization delegation framework used for granting third-party applications access to protected resources on behalf of a user",
      "SAML 2.0 — an XML-based federation protocol for exchanging authentication assertions across organizational trust boundaries",
      "OpenID Connect — an identity layer on top of OAuth 2.0 for authenticating users in web and mobile application contexts",
    ],
    "correctIndex": 0,
    "explanation": (
      "Kerberos is the protocol that uses a Key Distribution Center (KDC), Ticket Granting Tickets "
      "(TGTs), and time-limited service tickets to provide SSO within a domain or realm. The "
      "architecture described — one authentication, time-bounded credentials, no password re-entry — "
      "is the defining characteristic of Kerberos. OAuth 2.0 is an authorization framework, not "
      "an authentication protocol for internal SSO. SAML 2.0 is used for cross-organizational "
      "federation. OpenID Connect extends OAuth 2.0 for identity in web contexts — both are "
      "designed for internet-facing federation, not internal Kerberos-style ticket granting."
    ),
  },

  # ── D5-Q7: OAuth 2.0 → governance framing ────────────────────────────────
  "d5-q7": {
    "stem": (
      "A developer is building a mobile application that allows users to access their calendar "
      "and contact data stored in a third-party platform. The security architect requires that "
      "the mobile app never receive or store the user's platform credentials. Users must be able "
      "to grant and revoke the app's access independently of their account password. Which "
      "authorization framework BEST satisfies these requirements from a security governance "
      "and least-privilege perspective?"
    ),
    "choices": [
      "OAuth 2.0, which enables delegated authorization via scoped access tokens without exposing user credentials to the requesting application",
      "SAML 2.0, which enables single sign-on by passing signed authentication assertions between identity and service providers",
      "Kerberos, which uses ticket-based mutual authentication within a trusted domain to grant access to services",
      "Basic authentication over HTTPS, which transmits credentials securely but requires the application to handle and store them",
    ],
    "correctIndex": 0,
    "explanation": (
      "OAuth 2.0 is designed precisely for this use case: a resource owner (user) delegates "
      "limited access to a client application (mobile app) without sharing credentials. "
      "The platform issues a scoped access token; the mobile app uses the token, never the "
      "password. Revocation is independent — the user can revoke the token without changing "
      "their password. This satisfies both the zero-credential-exposure requirement and the "
      "principle of least privilege (scoped access). SAML 2.0 handles authentication federation, "
      "not third-party delegated authorization. Kerberos is an internal enterprise protocol. "
      "Basic auth requires credential handling by the client — directly violating the requirement."
    ),
  },

  # ── D8-Q43/Q72: CSRF → governance/policy framing ─────────────────────────
  "d8-q43": {
    "stem": (
      "During a security review, an analyst discovers that an authenticated user's email address "
      "was changed on a social networking platform without the user's knowledge. Investigation "
      "reveals the change was triggered when the user visited an external website while their "
      "session was active — the external site contained a hidden request that the platform "
      "executed using the user's browser session. The CISO must categorize this vulnerability "
      "for the board report and recommend the PRIMARY preventive control for the development team."
    ),
    "choices": [
      "Cross-Site Request Forgery (CSRF) — mitigated by requiring anti-CSRF tokens that validate the origin of state-changing requests, ensuring they originate from the legitimate application",
      "Cross-Site Scripting (XSS) — mitigated by input validation and output encoding to prevent injection of malicious scripts into the application",
      "Session hijacking — mitigated by binding session tokens to client IP addresses and invalidating sessions after a defined inactivity period",
      "Clickjacking — mitigated by implementing Content Security Policy headers and X-Frame-Options to prevent the application from being embedded in external frames",
    ],
    "correctIndex": 0,
    "explanation": (
      "The attack described — a forged request executed using the victim's active session by an "
      "external site — is Cross-Site Request Forgery (CSRF). The platform cannot distinguish the "
      "legitimate user request from the forged one because both carry the same session cookie. "
      "The primary defense is an anti-CSRF token: a unique, unpredictable value embedded in "
      "state-changing forms that the server validates on submission. The external site cannot "
      "read or replicate this token due to the Same-Origin Policy. XSS involves injecting "
      "scripts into the application itself. Session hijacking involves stealing the session token. "
      "Clickjacking involves visual deception through embedded iframes — a different attack class."
    ),
  },

  "d8-q72": {
    "stem": (
      "A control-gap review of a web application reveals that state-changing HTTP requests "
      "(account updates, fund transfers, password changes) do not validate whether the request "
      "originated from the application's own interface. An attacker could craft a malicious page "
      "that causes authenticated users to unknowingly submit these requests. The development team "
      "asks what control MOST effectively closes this gap without breaking existing functionality."
    ),
    "choices": [
      "Implement synchronizer token pattern (anti-CSRF tokens): embed a unique server-generated value in each form that is validated on submission, so forged cross-origin requests are rejected",
      "Enforce HTTPS across all endpoints to ensure state-changing requests are encrypted in transit and cannot be intercepted or replayed",
      "Implement session expiry after 15 minutes of inactivity to limit the window in which forged requests could be executed",
      "Add client-side JavaScript validation to confirm user intent before submitting state-changing requests",
    ],
    "correctIndex": 0,
    "explanation": (
      "The vulnerability described is CSRF. The synchronizer token pattern (anti-CSRF token) "
      "is the primary defense: the server generates a unique unpredictable token per session "
      "or per form, embeds it in the page, and validates it on submission. A cross-origin "
      "forged request cannot include this token (blocked by the Same-Origin Policy), so the "
      "server rejects it. HTTPS protects confidentiality and integrity in transit but does not "
      "prevent CSRF — the forged request is sent by the victim's browser over HTTPS just as "
      "a legitimate request would be. Short session expiry reduces attack windows but does not "
      "prevent CSRF during an active session. Client-side validation can be bypassed."
    ),
  },

  # ── D8-Q59: XSS → governance/SDLC framing ────────────────────────────────
  "d8-q59": {
    "stem": (
      "A CISO reviews a penetration test report identifying cross-site scripting (XSS) "
      "vulnerabilities across three customer-facing web applications. The board asks two "
      "questions: what is the root cause, and what governance control would MOST effectively "
      "prevent this class of vulnerability from recurring in future application releases?"
    ),
    "choices": [
      "The root cause is insufficient input validation and output encoding; the preventive governance control is embedding mandatory secure coding standards and automated SAST scanning gates in the SDLC before code reaches production",
      "The root cause is unpatched web framework dependencies; the preventive control is a monthly vulnerability management cycle that applies vendor patches to all web application components",
      "The root cause is insufficient network perimeter controls; the preventive control is deploying a web application firewall (WAF) that filters XSS payload patterns before they reach the application",
      "The root cause is inadequate security awareness; the preventive control is mandatory developer security training delivered annually",
    ],
    "correctIndex": 0,
    "explanation": (
      "XSS vulnerabilities arise when applications render user-supplied input as executable code "
      "without sanitization — the root cause is missing input validation and output encoding at "
      "the code level. The governance control that prevents recurrence is upstream: embedding "
      "secure coding standards (OWASP Top 10 controls), static analysis (SAST) gates, and peer "
      "code review requirements in the SDLC. A WAF is a compensating control, not a preventive "
      "one — it can be bypassed and does not fix the code. Patching frameworks addresses known "
      "CVEs in dependencies but not XSS introduced by application developers. Training is "
      "foundational but insufficient without automated enforcement in the development pipeline."
    ),
  },
}

# ─────────────────────────────────────────────────────────────────────────────
# PASS 2  Terminology softening
# ─────────────────────────────────────────────────────────────────────────────
# Replace verbatim ISC2 exam acronyms with conceptual synonyms.
# Goal: test understanding of the metric, not memorisation of the label.
# Applied to stem and explanation of ALL items (originals + variants).

TERM_REPLACEMENTS = [
    # ── Risk quantification ──────────────────────────────────────────────────
    (re.compile(r'\bSingle Loss Expectan[a-z]+\b',          re.I), "per-event impact value"),
    (re.compile(r'\bAnnual(?:ized)? Loss Expectan[a-z]+\b', re.I), "annualized risk exposure"),
    (re.compile(r'\bAnnual(?:ized)? Rate of Occurrence\b',  re.I), "occurrence frequency"),
    (re.compile(r'\bExposure Factor\b',                     re.I), "loss proportion"),
    (re.compile(r'\bSLE\b'), "per-event impact"),
    (re.compile(r'\bALE\b'), "annualized risk exposure"),
    (re.compile(r'\bARO\b'), "occurrence frequency"),

    # ── Recovery / continuity ────────────────────────────────────────────────
    (re.compile(r'\bRecovery Time Objective\b',  re.I), "maximum acceptable restoration time"),
    (re.compile(r'\bRecovery Point Objective\b', re.I), "maximum acceptable data loss window"),
    (re.compile(r'\b\bRTO\b'), "restoration time target"),
    (re.compile(r'\bRPO\b'),   "data loss tolerance"),
    (re.compile(r'\bMTTR\b'),  "average time to restore operations"),
    (re.compile(r'\bMTBF\b'),  "average operating time between failures"),

    # ── Access control concepts ──────────────────────────────────────────────
    (re.compile(r'\bleast privilege\b',          re.I), "minimum necessary access"),
    (re.compile(r'\bneed[- ]to[- ]know\b',       re.I), "access limited to job requirements"),
    (re.compile(r'\bseparation of duties\b',     re.I), "divided responsibility controls"),
    (re.compile(r'\bsegregation of duties\b',    re.I), "divided responsibility controls"),
    (re.compile(r'\bdefense[- ]in[- ]depth\b',   re.I), "layered security controls"),

    # ── Risk governance terms ────────────────────────────────────────────────
    (re.compile(r'\brisk appetite\b',            re.I), "organizational risk tolerance"),
    (re.compile(r'\brisk tolerance\b',           re.I), "acceptable risk threshold"),
    (re.compile(r'\bdue diligence\b',            re.I), "reasonable investigative care"),
    (re.compile(r'\bdue care\b',                 re.I), "reasonable protective action"),
    (re.compile(r'\brisk register\b',            re.I), "documented risk inventory"),

    # ── BCP / DRP ────────────────────────────────────────────────────────────
    (re.compile(r'\bBusiness Impact Analysis\b', re.I), "operational disruption assessment"),
    (re.compile(r'\bBIA\b'),                            "disruption impact assessment"),
    (re.compile(r'\bMaximum Tolerable Downtime\b', re.I), "longest acceptable outage period"),
    (re.compile(r'\bMTD\b'),  "maximum outage tolerance"),

    # ── Data roles ────────────────────────────────────────────────────────────
    # (data owner/custodian are important CISSP terms — soften only in recall stems)
    # Skipped to avoid breaking scenario questions where these terms anchor the story.
]


def _soften_terms(text: str) -> str:
    for pattern, replacement in TERM_REPLACEMENTS:
        text = pattern.sub(replacement, text)
    return text


# ─────────────────────────────────────────────────────────────────────────────
# PASS 3  Computational drill tagging
# ─────────────────────────────────────────────────────────────────────────────
# Math-heavy items are useful diagnostics when a domain is flagged weak.
# Tag them so the CAT gates them appropriately.

_CALC_PATTERN = re.compile(
    r'\b(\d[\d,]*\s*[\*x×%]|what\s+is\s+the\s+(?:SLE|ALE|ARO|per.event|annualized)\b'
    r'|calculate|formula|equals|result\s+in\s+\$)',
    re.I,
)


def is_computational(item: dict) -> bool:
    stem = item.get("stem") or ""
    return bool(_CALC_PATTERN.search(stem))


# ─────────────────────────────────────────────────────────────────────────────
# Core pipeline
# ─────────────────────────────────────────────────────────────────────────────

def run(bank_path: Path, dry_run: bool) -> None:
    print(f"Loading: {bank_path}")
    with open(bank_path, encoding="utf-8") as f:
        bank = json.load(f)

    items = [deepcopy(i) for i in bank["items"]]
    by_id = {i["id"]: i for i in items}

    p1_count = p2_count = p3_count = 0

    for item in items:
        base_id = item["id"].split("__")[0]   # strip __v1 / __v2 suffix

        # ── Pass 1: apply targeted rewrite if this item's base is in REWRITES ──
        if base_id in REWRITES:
            rw = REWRITES[base_id]
            item["stem"]         = rw["stem"]
            item["choices"]      = rw["choices"]
            item["correctIndex"] = rw["correctIndex"]
            item["explanation"]  = rw["explanation"]
            item["qualityRewritten"] = True
            p1_count += 1

        # ── Pass 2: soften terminology in stem and explanation ─────────────────
        orig_stem = item.get("stem") or ""
        orig_expl = item.get("explanation") or ""
        new_stem  = _soften_terms(orig_stem)
        new_expl  = _soften_terms(orig_expl)
        if new_stem != orig_stem or new_expl != orig_expl:
            item["stem"]        = new_stem
            item["explanation"] = new_expl
            p2_count += 1

        # ── Pass 3: tag computational drills ──────────────────────────────────
        if is_computational(item) and not item.get("computationalDrill"):
            item["computationalDrill"] = True
            p3_count += 1

    print(f"  Pass 1 rewrites applied:      {p1_count}")
    print(f"  Pass 2 term-softened items:   {p2_count}")
    print(f"  Pass 3 computational tagged:  {p3_count}")
    print(f"  Total items:                  {len(items)}")

    if dry_run:
        print("Dry-run — no file written.")
        return

    fixed_bank = {
        **{k: v for k, v in bank.items() if k != "items"},
        "items": items,
        "quality_rewrite_info": {
            "pass1_rewrites":  p1_count,
            "pass2_softened":  p2_count,
            "pass3_comp_tags": p3_count,
        },
    }
    print(f"\nWriting: {OUTPUT_BANK}")
    with open(OUTPUT_BANK, "w", encoding="utf-8") as f:
        json.dump(fixed_bank, f, indent=2, ensure_ascii=False)
    mb = OUTPUT_BANK.stat().st_size / 1_048_576
    print(f"Done — {mb:.1f} MB")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--bank",    default=str(DEFAULT_BANK))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    run(Path(args.bank), args.dry_run)

if __name__ == "__main__":
    main()
