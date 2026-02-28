const Scenarios = (() => {
  const ALL = [
    // ── D1: Security and Risk Management ──────────────────────────────────
    {
      id: "d1-001",
      domain: "D1",
      hardMode: false,
      title: "Annual Risk Assessment Due",
      description: "The board requires your annual enterprise risk assessment. Your team is stretched thin and a vendor offers a fast-tracked templated report for half the effort.",
      decisions: [
        {
          text: "Conduct a full internal risk assessment with your team.",
          effects: { confidentiality: 5, integrity: 5, availability: 0, budget: -15, userSatisfaction: -5, regulatoryRisk: -10 }
        },
        {
          text: "Use the vendor's templated report with light customization.",
          effects: { confidentiality: -5, integrity: -5, availability: 0, budget: -5, userSatisfaction: 5, regulatoryRisk: 5 }
        },
        {
          text: "Delay the assessment and request a 30-day extension from the board.",
          effects: { confidentiality: 0, integrity: 0, availability: 0, budget: 0, userSatisfaction: -10, regulatoryRisk: 15 }
        },
        {
          text: "Conduct a risk assessment scoped only to critical assets.",
          effects: { confidentiality: 2, integrity: 2, availability: 0, budget: -8, userSatisfaction: 0, regulatoryRisk: -5 }
        }
      ]
    },
    {
      id: "d1-002",
      domain: "D1",
      hardMode: true,
      title: "Conflicting Regulatory Requirements",
      description: "Legal flags that new GDPR data retention requirements directly conflict with your PCI-DSS cardholder data retention policy. Compliance cannot satisfy both simultaneously.",
      decisions: [
        {
          text: "Prioritize GDPR and update retention policy, accepting PCI-DSS findings.",
          effects: { confidentiality: 5, integrity: 0, availability: 0, budget: -10, userSatisfaction: 0, regulatoryRisk: 10 }
        },
        {
          text: "Prioritize PCI-DSS and document the GDPR conflict as a formal risk acceptance.",
          effects: { confidentiality: 0, integrity: 0, availability: 0, budget: -5, userSatisfaction: 0, regulatoryRisk: 10 }
        },
        {
          text: "Engage external legal counsel to resolve the conflict before acting.",
          effects: { confidentiality: 0, integrity: 5, availability: 0, budget: -20, userSatisfaction: -5, regulatoryRisk: -5 },
          triggers: ["legal-resolution"]
        },
        {
          text: "Create a data classification policy that satisfies both frameworks' intent.",
          effects: { confidentiality: 10, integrity: 5, availability: 0, budget: -15, userSatisfaction: 5, regulatoryRisk: -15 }
        }
      ]
    },

    // ── D2: Asset Security ─────────────────────────────────────────────────
    {
      id: "d2-001",
      domain: "D2",
      hardMode: false,
      title: "Shadow IT Asset Discovery",
      description: "A routine scan reveals 40+ unregistered cloud services in use across the organization. Business units procured them independently to meet project deadlines.",
      decisions: [
        {
          text: "Immediately block all unregistered cloud services.",
          effects: { confidentiality: 10, integrity: 5, availability: -20, budget: 0, userSatisfaction: -25, regulatoryRisk: -5 }
        },
        {
          text: "Catalog all discovered assets and begin a risk-based review process.",
          effects: { confidentiality: 5, integrity: 5, availability: 0, budget: -10, userSatisfaction: 0, regulatoryRisk: -10 }
        },
        {
          text: "Issue a policy memo reminding staff of approved procurement channels.",
          effects: { confidentiality: -5, integrity: 0, availability: 0, budget: 0, userSatisfaction: 5, regulatoryRisk: 5 }
        },
        {
          text: "Fast-track approved alternatives for the most-used unauthorized services.",
          effects: { confidentiality: 8, integrity: 5, availability: 5, budget: -20, userSatisfaction: 15, regulatoryRisk: -8 }
        }
      ]
    },
    {
      id: "d2-002",
      domain: "D2",
      hardMode: true,
      title: "Data Classification Gap",
      description: "An external audit finds 60% of your organization's data has no classification label. Your DLP system cannot enforce controls on unclassified data.",
      decisions: [
        {
          text: "Default all unclassified data to Confidential and enforce DLP controls immediately.",
          effects: { confidentiality: 15, integrity: 5, availability: -10, budget: -10, userSatisfaction: -20, regulatoryRisk: -10 }
        },
        {
          text: "Launch a 90-day data owner classification campaign with executive sponsorship.",
          effects: { confidentiality: 5, integrity: 5, availability: 0, budget: -15, userSatisfaction: 5, regulatoryRisk: -5 }
        },
        {
          text: "Deploy ML-based auto-classification tools to label data at scale.",
          effects: { confidentiality: 10, integrity: -5, availability: 0, budget: -25, userSatisfaction: 5, regulatoryRisk: -5 },
          triggers: ["ml-classification-risk"]
        },
        {
          text: "Accept the finding and schedule remediation in the next fiscal year.",
          effects: { confidentiality: -10, integrity: 0, availability: 0, budget: 5, userSatisfaction: 0, regulatoryRisk: 20 }
        }
      ]
    },

    // ── D3: Security Architecture and Engineering ──────────────────────────
    {
      id: "d3-001",
      domain: "D3",
      hardMode: false,
      title: "Legacy System Zero-Day",
      description: "A critical manufacturing control system on Windows XP cannot be patched without a 6-month production shutdown. A zero-day affecting this OS is now publicly known.",
      decisions: [
        {
          text: "Network-isolate the system immediately with compensating controls.",
          effects: { confidentiality: 10, integrity: 5, availability: -5, budget: -10, userSatisfaction: -5, regulatoryRisk: -10 }
        },
        {
          text: "Deploy a WAF and IDS in front of the legacy system.",
          effects: { confidentiality: 5, integrity: 5, availability: 5, budget: -15, userSatisfaction: 5, regulatoryRisk: -5 }
        },
        {
          text: "Accept the risk and proceed with enhanced monitoring only.",
          effects: { confidentiality: -10, integrity: -5, availability: 0, budget: 0, userSatisfaction: 5, regulatoryRisk: 15 }
        },
        {
          text: "Begin emergency procurement for a replacement system.",
          effects: { confidentiality: 5, integrity: 5, availability: -10, budget: -30, userSatisfaction: -10, regulatoryRisk: -5 }
        }
      ]
    },
    {
      id: "d3-002",
      domain: "D3",
      hardMode: true,
      title: "Zero Trust Architecture Proposal",
      description: "Your architect proposes migrating from perimeter security to Zero Trust. The CFO supports it but the CTO warns it will disrupt 18 months of in-flight product delivery.",
      decisions: [
        {
          text: "Approve a phased Zero Trust rollout starting with identity and least-privilege.",
          effects: { confidentiality: 15, integrity: 10, availability: -5, budget: -25, userSatisfaction: -10, regulatoryRisk: -15 }
        },
        {
          text: "Defer Zero Trust and focus on hardening the current perimeter architecture.",
          effects: { confidentiality: -5, integrity: 0, availability: 5, budget: -10, userSatisfaction: 10, regulatoryRisk: 5 }
        },
        {
          text: "Pilot Zero Trust on one business unit before committing to enterprise rollout.",
          effects: { confidentiality: 8, integrity: 5, availability: 0, budget: -15, userSatisfaction: 0, regulatoryRisk: -5 }
        },
        {
          text: "Commission an external architecture review before deciding.",
          effects: { confidentiality: 0, integrity: 0, availability: 0, budget: -10, userSatisfaction: -5, regulatoryRisk: 0 },
          triggers: ["architecture-review"]
        }
      ]
    },

    // ── D4: Communication and Network Security ────────────────────────────
    {
      id: "d4-001",
      domain: "D4",
      hardMode: false,
      title: "VPN Capacity Crisis",
      description: "Remote work has exceeded VPN capacity. Users report 40% productivity drops. Networking proposes split tunneling to ease the load.",
      decisions: [
        {
          text: "Approve split tunneling to restore user performance.",
          effects: { confidentiality: -15, integrity: -5, availability: 20, budget: 0, userSatisfaction: 20, regulatoryRisk: 10 }
        },
        {
          text: "Procure additional VPN capacity to maintain full-tunnel policy.",
          effects: { confidentiality: 5, integrity: 5, availability: 15, budget: -20, userSatisfaction: 10, regulatoryRisk: -5 }
        },
        {
          text: "Migrate to a ZTNA solution that scales without split tunneling risk.",
          effects: { confidentiality: 10, integrity: 5, availability: 15, budget: -30, userSatisfaction: 10, regulatoryRisk: -10 }
        },
        {
          text: "Restrict VPN to critical roles only and accept the productivity loss.",
          effects: { confidentiality: 10, integrity: 5, availability: -5, budget: 0, userSatisfaction: -25, regulatoryRisk: 0 }
        }
      ]
    },
    {
      id: "d4-002",
      domain: "D4",
      hardMode: true,
      title: "Encrypted C2 Traffic Detected",
      description: "Your NGFW is detecting anomalous TLS traffic to known-suspicious IPs on port 443. Decrypting the traffic requires deploying SSL inspection, which legal warns may violate employee privacy policy.",
      decisions: [
        {
          text: "Deploy SSL inspection on all outbound traffic and update the acceptable-use policy.",
          effects: { confidentiality: 10, integrity: 10, availability: -5, budget: -15, userSatisfaction: -15, regulatoryRisk: -10 }
        },
        {
          text: "Block the suspicious IPs at the firewall and monitor for new C2 destinations.",
          effects: { confidentiality: 5, integrity: 5, availability: 0, budget: -5, userSatisfaction: 0, regulatoryRisk: -5 }
        },
        {
          text: "Scope SSL inspection only to the affected user segment under legal review.",
          effects: { confidentiality: 8, integrity: 8, availability: 0, budget: -10, userSatisfaction: -5, regulatoryRisk: -8 }
        },
        {
          text: "Escalate to legal and suspend action until a privacy determination is made.",
          effects: { confidentiality: -10, integrity: -5, availability: 0, budget: 0, userSatisfaction: 0, regulatoryRisk: 10 }
        }
      ]
    },

    // ── D5: Identity and Access Management ────────────────────────────────
    {
      id: "d5-001",
      domain: "D5",
      hardMode: false,
      title: "Privileged Account Sprawl",
      description: "An IAM review reveals 200 service accounts with Domain Admin rights — most inherited from a legacy migration 4 years ago. Only 12 are known to be actively used.",
      decisions: [
        {
          text: "Immediately disable all 200 accounts and restore only validated ones.",
          effects: { confidentiality: 15, integrity: 10, availability: -20, budget: -5, userSatisfaction: -20, regulatoryRisk: -10 }
        },
        {
          text: "Conduct a 30-day access certification campaign with service owners.",
          effects: { confidentiality: 10, integrity: 10, availability: 0, budget: -10, userSatisfaction: -5, regulatoryRisk: -15 }
        },
        {
          text: "Apply JIT access controls to all 200 accounts without disabling them.",
          effects: { confidentiality: 8, integrity: 5, availability: 0, budget: -15, userSatisfaction: 5, regulatoryRisk: -8 }
        },
        {
          text: "Document the finding and schedule remediation next quarter.",
          effects: { confidentiality: -10, integrity: -5, availability: 0, budget: 0, userSatisfaction: 0, regulatoryRisk: 20 }
        }
      ]
    },
    {
      id: "d5-002",
      domain: "D5",
      hardMode: true,
      title: "MFA Fatigue Campaign Active",
      description: "Threat intelligence confirms an active MFA fatigue campaign against your Authenticator push notifications. Three accounts were compromised last week.",
      decisions: [
        {
          text: "Switch all users to FIDO2 hardware keys immediately.",
          effects: { confidentiality: 20, integrity: 10, availability: -10, budget: -30, userSatisfaction: -15, regulatoryRisk: -20 }
        },
        {
          text: "Enable number matching and additional context in push notifications.",
          effects: { confidentiality: 15, integrity: 8, availability: 0, budget: -5, userSatisfaction: -5, regulatoryRisk: -15 }
        },
        {
          text: "Switch MFA to OTP tokens and disable push notifications entirely.",
          effects: { confidentiality: 10, integrity: 5, availability: 0, budget: -10, userSatisfaction: -15, regulatoryRisk: -10 }
        },
        {
          text: "Issue a user awareness alert and monitor for additional compromise.",
          effects: { confidentiality: -5, integrity: -5, availability: 0, budget: 0, userSatisfaction: 5, regulatoryRisk: 10 },
          followUp: { id: "d5-002-fu" }
        }
      ]
    },

    // ── D6: Security Assessment and Testing ───────────────────────────────
    {
      id: "d6-001",
      domain: "D6",
      hardMode: false,
      title: "Critical RCE in Customer Portal",
      description: "An external pen test reveals a critical RCE vulnerability in your customer portal. The vendor estimates 3 weeks to patch. Marketing wants to keep the portal live through a major campaign.",
      decisions: [
        {
          text: "Take the portal offline immediately until patched.",
          effects: { confidentiality: 15, integrity: 10, availability: -25, budget: 0, userSatisfaction: -20, regulatoryRisk: -15 }
        },
        {
          text: "Deploy a virtual WAF patch and keep the portal live.",
          effects: { confidentiality: 5, integrity: 5, availability: 10, budget: -10, userSatisfaction: 10, regulatoryRisk: -5 }
        },
        {
          text: "Escalate to the executive team and let them own the risk decision.",
          effects: { confidentiality: 0, integrity: 0, availability: 0, budget: 0, userSatisfaction: 0, regulatoryRisk: 0 },
          triggers: ["executive-escalation"]
        },
        {
          text: "Accept the risk and expedite the patch to a 1-week timeline.",
          effects: { confidentiality: -5, integrity: -5, availability: 5, budget: -15, userSatisfaction: 5, regulatoryRisk: 10 }
        }
      ]
    },
    {
      id: "d6-002",
      domain: "D6",
      hardMode: true,
      title: "Red Team Finds Unlogged Admin Access",
      description: "A red team exercise reveals that 14 admin accounts have no audit logging configured. All privileged actions for the past 90 days are unrecoverable. An active breach cannot be ruled out.",
      decisions: [
        {
          text: "Enable audit logging on all admin accounts immediately and initiate IR procedures.",
          effects: { confidentiality: 10, integrity: 15, availability: -5, budget: -10, userSatisfaction: -5, regulatoryRisk: -15 }
        },
        {
          text: "Treat the 90-day gap as a potential breach and notify legal and compliance.",
          effects: { confidentiality: 5, integrity: 10, availability: 0, budget: -15, userSatisfaction: -10, regulatoryRisk: -20 }
        },
        {
          text: "Enable logging, conduct forensic review of available artifacts, and assess blast radius.",
          effects: { confidentiality: 8, integrity: 12, availability: 0, budget: -20, userSatisfaction: -5, regulatoryRisk: -10 },
          triggers: ["forensic-evidence"]
        },
        {
          text: "Enable logging and document it as a configuration gap without escalating.",
          effects: { confidentiality: -5, integrity: 0, availability: 0, budget: -5, userSatisfaction: 0, regulatoryRisk: 20 }
        }
      ]
    },

    // ── D7: Security Operations ────────────────────────────────────────────
    {
      id: "d7-001",
      domain: "D7",
      hardMode: false,
      title: "Ransomware Detected in Finance",
      description: "Your SOC has detected ransomware execution on three Finance endpoints communicating with a known C2 server. Lateral movement has not yet been confirmed.",
      decisions: [
        {
          text: "Isolate the three affected endpoints and activate the IR plan.",
          effects: { confidentiality: 5, integrity: 10, availability: -10, budget: -10, userSatisfaction: -5, regulatoryRisk: -15 }
        },
        {
          text: "Isolate Finance's entire network segment while investigating.",
          effects: { confidentiality: 10, integrity: 15, availability: -25, budget: -5, userSatisfaction: -20, regulatoryRisk: -15 }
        },
        {
          text: "Monitor without isolating to map the full attack scope first.",
          effects: { confidentiality: -15, integrity: -20, availability: -10, budget: 0, userSatisfaction: -10, regulatoryRisk: 20 },
          triggers: ["ransomware-spread"],
          followUp: { id: "d7-001-fu" }
        },
        {
          text: "Pay the ransom to restore operations quickly.",
          effects: { confidentiality: -5, integrity: -10, availability: 10, budget: -25, userSatisfaction: 0, regulatoryRisk: 30 }
        }
      ]
    },
    {
      id: "d7-002",
      domain: "D7",
      hardMode: true,
      title: "Insider Threat: Source Code Exfiltration",
      description: "DLP alerts show a senior developer has exfiltrated 2GB of source code to a personal cloud drive over 30 days. HR has notified you before taking any disciplinary action.",
      decisions: [
        {
          text: "Immediately revoke all access and coordinate with HR and Legal for termination.",
          effects: { confidentiality: 10, integrity: 5, availability: 0, budget: -5, userSatisfaction: -10, regulatoryRisk: -10 }
        },
        {
          text: "Conduct a covert forensic investigation before taking any action.",
          effects: { confidentiality: 5, integrity: 10, availability: 0, budget: -15, userSatisfaction: 0, regulatoryRisk: -5 },
          triggers: ["forensic-evidence"]
        },
        {
          text: "Restrict the developer's repo access and continue covert monitoring.",
          effects: { confidentiality: -5, integrity: 0, availability: 0, budget: -5, userSatisfaction: 0, regulatoryRisk: 5 }
        },
        {
          text: "Notify law enforcement and preserve all evidence before internal action.",
          effects: { confidentiality: 5, integrity: 10, availability: 0, budget: -10, userSatisfaction: -5, regulatoryRisk: -15 }
        }
      ]
    },

    // ── D8: Software Development Security ─────────────────────────────────
    {
      id: "d8-001",
      domain: "D8",
      hardMode: false,
      title: "Critical Open Source CVE",
      description: "A CVE (CVSS 9.8) is disclosed in a logging library used by 47 internal applications. A patch is available but requires regression testing across all affected apps.",
      decisions: [
        {
          text: "Emergency-patch all 47 apps within 72 hours, skipping full regression testing.",
          effects: { confidentiality: 5, integrity: -10, availability: -15, budget: -20, userSatisfaction: -10, regulatoryRisk: -10 }
        },
        {
          text: "Prioritize internet-facing apps first; patch internal apps within 30 days.",
          effects: { confidentiality: 5, integrity: 5, availability: 0, budget: -15, userSatisfaction: 0, regulatoryRisk: -5 }
        },
        {
          text: "Deploy a WAF virtual patch while full regression testing runs.",
          effects: { confidentiality: 8, integrity: 5, availability: 0, budget: -10, userSatisfaction: 5, regulatoryRisk: -8 }
        },
        {
          text: "Accept the risk and monitor for active exploitation.",
          effects: { confidentiality: -10, integrity: -10, availability: 0, budget: 0, userSatisfaction: 0, regulatoryRisk: 20 }
        }
      ]
    },
    {
      id: "d8-002",
      domain: "D8",
      hardMode: true,
      title: "CI/CD Pipeline Compromise",
      description: "Threat intel confirms a supply chain attack targeting CI/CD pipelines similar to yours. A review finds an unrotated deployment key with 18 months of exposure and production admin access.",
      decisions: [
        {
          text: "Rotate all deployment keys immediately and audit all recent deployments.",
          effects: { confidentiality: 10, integrity: 15, availability: -10, budget: -10, userSatisfaction: -15, regulatoryRisk: -15 }
        },
        {
          text: "Freeze all deployments and conduct a full pipeline security audit.",
          effects: { confidentiality: 15, integrity: 20, availability: -20, budget: -20, userSatisfaction: -25, regulatoryRisk: -20 },
          triggers: ["pipeline-audit"]
        },
        {
          text: "Scope the review to the specific key only and resume deployments after rotation.",
          effects: { confidentiality: 5, integrity: 5, availability: 0, budget: -5, userSatisfaction: 0, regulatoryRisk: -5 }
        },
        {
          text: "Continue operations and monitor for indicators of compromise.",
          effects: { confidentiality: -15, integrity: -15, availability: 5, budget: 0, userSatisfaction: 5, regulatoryRisk: 25 }
        }
      ]
    },

    // ── Follow-up scenarios (chained from specific decisions) ─────────────

    // Follows d7-001 "monitor without isolating" — ransomware has spread.
    {
      id: "d7-001-fu",
      domain: "D7",
      hardMode: true,
      title: "Ransomware: Containment Failure",
      description: "The delayed isolation allowed the ransomware to reach 15 additional hosts including two domain controllers. Backups are encrypted. The IR firm is on-site. You must decide how to proceed.",
      decisions: [
        {
          text: "Rebuild from last known-good offline backups and accept extended downtime.",
          effects: { confidentiality: 5, integrity: 15, availability: -30, budget: -25, userSatisfaction: -20, regulatoryRisk: -10 }
        },
        {
          text: "Engage the ransomware negotiation firm while IR continues parallel recovery.",
          effects: { confidentiality: -5, integrity: -5, availability: -10, budget: -30, userSatisfaction: -5, regulatoryRisk: 15 }
        },
        {
          text: "Declare a major incident, notify regulators, and activate BCP.",
          effects: { confidentiality: 5, integrity: 5, availability: -20, budget: -20, userSatisfaction: -15, regulatoryRisk: -20 }
        },
        {
          text: "Attempt to recover in-place from encrypted backups without declaring a breach.",
          effects: { confidentiality: -15, integrity: -20, availability: -15, budget: -10, userSatisfaction: -10, regulatoryRisk: 30 }
        }
      ]
    },

    // Follows d5-002 "issue awareness alert only" — accounts continue to be compromised.
    {
      id: "d5-002-fu",
      domain: "D5",
      hardMode: true,
      title: "MFA Fatigue: Escalating Compromise",
      description: "Three more accounts were compromised overnight after your awareness-only response. One of the accounts had access to the HR system containing all employee PII. Executives are demanding action.",
      decisions: [
        {
          text: "Force-reset all active sessions and require re-enrollment with number matching MFA.",
          effects: { confidentiality: 10, integrity: 10, availability: -15, budget: -10, userSatisfaction: -20, regulatoryRisk: -15 }
        },
        {
          text: "Rotate credentials for all accounts with access to sensitive systems and notify affected employees.",
          effects: { confidentiality: 8, integrity: 8, availability: -5, budget: -15, userSatisfaction: -10, regulatoryRisk: -10 }
        },
        {
          text: "Treat the HR access as a breach, notify the DPA, and initiate forensic review.",
          effects: { confidentiality: 5, integrity: 10, availability: 0, budget: -20, userSatisfaction: -5, regulatoryRisk: -25 }
        },
        {
          text: "Issue another awareness communication and block the known-bad IPs.",
          effects: { confidentiality: -15, integrity: -10, availability: 0, budget: 0, userSatisfaction: 5, regulatoryRisk: 25 }
        }
      ]
    }
  ];

  const DOMAINS = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"];

  function getAll() {
    return ALL;
  }

  function getByDomain(domain) {
    if (!domain || domain === "ALL") return ALL;
    return ALL.filter((s) => s.domain === domain);
  }

  function getFiltered(domain, hardOnly) {
    let pool = getByDomain(domain);
    if (hardOnly) pool = pool.filter((s) => s.hardMode);
    return pool;
  }

  function getNext(domain, hardOnly, excludeId) {
    let pool = getFiltered(domain, hardOnly);
    if (pool.length > 1) pool = pool.filter((s) => s.id !== excludeId);
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function getDomains() {
    return DOMAINS;
  }

  return { getAll, getByDomain, getFiltered, getNext, getDomains };
})();
