const STAKEHOLDERS = ["CFO", "SOC Lead", "Network", "HR", "Compliance"];
const METERS = [
  "Confidentiality",
  "Integrity",
  "Availability",
  "Budget",
  "User Satisfaction",
  "Regulatory Risk"
];

const DOMAIN_LABELS = {
  all: "All Domains",
  d1: "Domain 1",
  d2: "Domain 2",
  d3: "Domain 3",
  d4: "Domain 4",
  d5: "Domain 5",
  d6: "Domain 6",
  d7: "Domain 7",
  d8: "Domain 8"
};

const DIFFICULTY = {
  easy: { label: "Easy", scale: 0.9, volatility: 0.05 },
  medium: { label: "Medium", scale: 1.1, volatility: 0.14 },
  hard: { label: "Hard", scale: 1.3, volatility: 0.24 }
};

const BRIEFS = [
  {
    "id": "d1-arch-001",
    "domain": "d1",
    "hardMode": true,
    "patternTag": "risk-accept-vs-mitigate",
    "title": "Risk Accept vs Mitigate",
    "description": "Risk Accept vs Mitigate. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -10
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 9
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 0
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": 1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 9
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -8
        }
      }
    ]
  },
  {
    "id": "d1-arch-002",
    "domain": "d1",
    "hardMode": true,
    "patternTag": "inherent-vs-residual-confusion",
    "title": "Inherent vs Residual Confusion",
    "description": "Inherent vs Residual Confusion. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d1-arch-003",
    "domain": "d1",
    "hardMode": true,
    "patternTag": "compliance-vs-risk-priority",
    "title": "Compliance vs Risk Priority",
    "description": "Compliance vs Risk Priority. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -10
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 9
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 0
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": 1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 9
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -8
        }
      }
    ]
  },
  {
    "id": "d1-arch-004",
    "domain": "d1",
    "hardMode": true,
    "patternTag": "board-escalation-threshold",
    "title": "Board Escalation Threshold",
    "description": "Board Escalation Threshold. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d1-arch-005",
    "domain": "d1",
    "hardMode": true,
    "patternTag": "policy-exception-governance",
    "title": "Policy Exception Governance",
    "description": "Policy Exception Governance. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -10
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 9
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 0
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": 1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 9
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -8
        }
      }
    ]
  },
  {
    "id": "d1-arch-006",
    "domain": "d1",
    "hardMode": true,
    "patternTag": "quant-vs-qual-assessment",
    "title": "Quant vs Qual Assessment",
    "description": "Quant vs Qual Assessment. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 6,
          "Integrity": 7,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 4,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -2
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 4,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 2,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -4,
          "Integrity": -3,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -9
        }
      }
    ]
  },
  {
    "id": "d1-arch-007",
    "domain": "d1",
    "hardMode": true,
    "patternTag": "third-party-risk-ownership",
    "title": "Third Party Risk Ownership",
    "description": "Third Party Risk Ownership. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -10
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 9
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 0
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": 1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 9
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -8
        }
      }
    ]
  },
  {
    "id": "d1-arch-008",
    "domain": "d1",
    "hardMode": true,
    "patternTag": "short-term-savings-vs-control-debt",
    "title": "Short Term Savings vs Control Debt",
    "description": "Short Term Savings vs Control Debt. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -2,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -1,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 5,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 5,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 5,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d2-arch-009",
    "domain": "d2",
    "hardMode": true,
    "patternTag": "classification-vs-business-velocity",
    "title": "Classification vs Business Velocity",
    "description": "Classification vs Business Velocity. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -3,
          "User Satisfaction": 3,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -2,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 3,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 4,
          "User Satisfaction": 5,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 5,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 2,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 2,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 4,
          "User Satisfaction": 3,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 3,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d2-arch-010",
    "domain": "d2",
    "hardMode": true,
    "patternTag": "retention-vs-privacy-minimization",
    "title": "Retention vs Privacy Minimization",
    "description": "Retention vs Privacy Minimization. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d2-arch-011",
    "domain": "d2",
    "hardMode": true,
    "patternTag": "data-owner-vs-custodian-authority",
    "title": "Data Owner vs Custodian Authority",
    "description": "Data Owner vs Custodian Authority. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d2-arch-012",
    "domain": "d2",
    "hardMode": true,
    "patternTag": "tokenization-vs-encryption-fit",
    "title": "Tokenization vs Encryption Fit",
    "description": "Tokenization vs Encryption Fit. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 7,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -3,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d2-arch-013",
    "domain": "d2",
    "hardMode": true,
    "patternTag": "backup-encryption-vs-recovery-speed",
    "title": "Backup Encryption vs Recovery Speed",
    "description": "Backup Encryption vs Recovery Speed. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 7,
          "Integrity": 6,
          "Availability": 4,
          "Budget": -4,
          "User Satisfaction": 2,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 4,
          "HR": 2,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 3,
          "Availability": 5,
          "Budget": 3,
          "User Satisfaction": 4,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 5,
          "HR": 4,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 1,
          "User Satisfaction": 2,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 3,
          "HR": 2,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -3,
          "Integrity": -4,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 2,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 2,
          "HR": 2,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d2-arch-014",
    "domain": "d2",
    "hardMode": true,
    "patternTag": "shadow-data-discovery-response",
    "title": "Shadow Data Discovery Response",
    "description": "Shadow Data Discovery Response. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d2-arch-015",
    "domain": "d2",
    "hardMode": true,
    "patternTag": "data-loss-detection-vs-false-positives",
    "title": "Data Loss Detection vs False Positives",
    "description": "Data Loss Detection vs False Positives. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 6,
          "Integrity": 7,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 4,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -2
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 4,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 2,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -4,
          "Integrity": -3,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -9
        }
      }
    ]
  },
  {
    "id": "d2-arch-016",
    "domain": "d2",
    "hardMode": true,
    "patternTag": "disposal-assurance-vs-cost",
    "title": "Disposal Assurance vs Cost",
    "description": "Disposal Assurance vs Cost. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -2,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -1,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 5,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 5,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 5,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d3-arch-017",
    "domain": "d3",
    "hardMode": true,
    "patternTag": "security-architecture-centralized-vs-federated",
    "title": "Security Architecture Centralized vs Federated",
    "description": "Security Architecture Centralized vs Federated. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d3-arch-018",
    "domain": "d3",
    "hardMode": true,
    "patternTag": "segmentation-vs-availability",
    "title": "Segmentation vs Availability",
    "description": "Segmentation vs Availability. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 4,
          "Budget": -4,
          "User Satisfaction": 2,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 4,
          "HR": 2,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 5,
          "Budget": 3,
          "User Satisfaction": 4,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 4,
          "HR": 4,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 1,
          "User Satisfaction": 2,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 2,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 2,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 1,
          "HR": 2,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d3-arch-019",
    "domain": "d3",
    "hardMode": true,
    "patternTag": "trusted-path-vs-user-friction",
    "title": "Trusted Path vs User Friction",
    "description": "Trusted Path vs User Friction. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d3-arch-020",
    "domain": "d3",
    "hardMode": true,
    "patternTag": "hsm-vs-software-key-management",
    "title": "Hsm vs Software Key Management",
    "description": "Hsm vs Software Key Management. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 7,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -3,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d3-arch-021",
    "domain": "d3",
    "hardMode": true,
    "patternTag": "fail-open-vs-fail-closed",
    "title": "Fail Open vs Fail Closed",
    "description": "Fail Open vs Fail Closed. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d3-arch-022",
    "domain": "d3",
    "hardMode": true,
    "patternTag": "legacy-compensating-control",
    "title": "Legacy Compensating Control",
    "description": "Legacy Compensating Control. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d3-arch-023",
    "domain": "d3",
    "hardMode": true,
    "patternTag": "side-channel-risk-pragmatism",
    "title": "Side Channel Risk Pragmatism",
    "description": "Side Channel Risk Pragmatism. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -10
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 9
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 0
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": 1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 9
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -8
        }
      }
    ]
  },
  {
    "id": "d3-arch-024",
    "domain": "d3",
    "hardMode": true,
    "patternTag": "defense-depth-vs-complexity",
    "title": "Defense Depth vs Complexity",
    "description": "Defense Depth vs Complexity. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d4-arch-025",
    "domain": "d4",
    "hardMode": true,
    "patternTag": "detection-vs-prevention-investment",
    "title": "Detection vs Prevention Investment",
    "description": "Detection vs Prevention Investment. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 6,
          "Integrity": 7,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 4,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -2
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 4,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 2,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -4,
          "Integrity": -3,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -9
        }
      }
    ]
  },
  {
    "id": "d4-arch-026",
    "domain": "d4",
    "hardMode": true,
    "patternTag": "inline-inspection-vs-latency",
    "title": "Inline Inspection vs Latency",
    "description": "Inline Inspection vs Latency. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 4,
          "Budget": -4,
          "User Satisfaction": 2,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 4,
          "HR": 2,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 5,
          "Budget": 3,
          "User Satisfaction": 4,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 4,
          "HR": 4,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 1,
          "User Satisfaction": 2,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 2,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 2,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 1,
          "HR": 2,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d4-arch-027",
    "domain": "d4",
    "hardMode": true,
    "patternTag": "zero-trust-vs-operational-readiness",
    "title": "Zero Trust vs Operational Readiness",
    "description": "Zero Trust vs Operational Readiness. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d4-arch-028",
    "domain": "d4",
    "hardMode": true,
    "patternTag": "east-west-visibility-gap",
    "title": "East West Visibility Gap",
    "description": "East West Visibility Gap. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d4-arch-029",
    "domain": "d4",
    "hardMode": true,
    "patternTag": "ddos-protection-vs-cost-control",
    "title": "Ddos Protection vs Cost Control",
    "description": "Ddos Protection vs Cost Control. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -2,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -1,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 5,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 5,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 5,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d4-arch-030",
    "domain": "d4",
    "hardMode": true,
    "patternTag": "third-party-network-access-scope",
    "title": "Third Party Network Access Scope",
    "description": "Third Party Network Access Scope. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 7,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -3,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d4-arch-031",
    "domain": "d4",
    "hardMode": true,
    "patternTag": "dns-security-vs-compatibility",
    "title": "Dns Security vs Compatibility",
    "description": "Dns Security vs Compatibility. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d4-arch-032",
    "domain": "d4",
    "hardMode": true,
    "patternTag": "remote-access-bastion-vs-convenience",
    "title": "Remote Access Bastion vs Convenience",
    "description": "Remote Access Bastion vs Convenience. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 7,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -3,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d5-arch-033",
    "domain": "d5",
    "hardMode": true,
    "patternTag": "least-privilege-vs-productivity",
    "title": "Least Privilege vs Productivity",
    "description": "Least Privilege vs Productivity. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 7,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -3,
          "User Satisfaction": 3,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -2,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 3,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 4,
          "User Satisfaction": 5,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 5,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 2,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 2,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -3,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 4,
          "User Satisfaction": 3,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 3,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d5-arch-034",
    "domain": "d5",
    "hardMode": true,
    "patternTag": "jit-access-vs-admin-persistence",
    "title": "Jit Access vs Admin Persistence",
    "description": "Jit Access vs Admin Persistence. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 7,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -3,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d5-arch-035",
    "domain": "d5",
    "hardMode": true,
    "patternTag": "mfa-fatigue-vs-usability",
    "title": "Mfa Fatigue vs Usability",
    "description": "Mfa Fatigue vs Usability. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 7,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -3,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d5-arch-036",
    "domain": "d5",
    "hardMode": true,
    "patternTag": "federation-trust-boundary",
    "title": "Federation Trust Boundary",
    "description": "Federation Trust Boundary. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d5-arch-037",
    "domain": "d5",
    "hardMode": true,
    "patternTag": "service-account-governance",
    "title": "Service Account Governance",
    "description": "Service Account Governance. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -10
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 9
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 0
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": 1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 9
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -8
        }
      }
    ]
  },
  {
    "id": "d5-arch-038",
    "domain": "d5",
    "hardMode": true,
    "patternTag": "access-recertification-quality",
    "title": "Access Recertification Quality",
    "description": "Access Recertification Quality. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 7,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -3,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d5-arch-039",
    "domain": "d5",
    "hardMode": true,
    "patternTag": "break-glass-control-design",
    "title": "Break Glass Control Design",
    "description": "Break Glass Control Design. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d5-arch-040",
    "domain": "d5",
    "hardMode": true,
    "patternTag": "identity-proofing-strength",
    "title": "Identity Proofing Strength",
    "description": "Identity Proofing Strength. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 7,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -3,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d6-arch-041",
    "domain": "d6",
    "hardMode": true,
    "patternTag": "scan-coverage-vs-change-impact",
    "title": "Scan Coverage vs Change Impact",
    "description": "Scan Coverage vs Change Impact. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 6,
          "Integrity": 7,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 4,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -2
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 4,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 2,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -4,
          "Integrity": -3,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -9
        }
      }
    ]
  },
  {
    "id": "d6-arch-042",
    "domain": "d6",
    "hardMode": true,
    "patternTag": "pen-test-vs-assessment-sequencing",
    "title": "Pen Test vs Assessment Sequencing",
    "description": "Pen Test vs Assessment Sequencing. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 6,
          "Integrity": 7,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 4,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -2
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 4,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 2,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -4,
          "Integrity": -3,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -9
        }
      }
    ]
  },
  {
    "id": "d6-arch-043",
    "domain": "d6",
    "hardMode": true,
    "patternTag": "false-positive-triage-governance",
    "title": "False Positive Triage Governance",
    "description": "False Positive Triage Governance. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 6,
          "Integrity": 8,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -10
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 9,
          "Network": 3,
          "HR": 1,
          "Compliance": 10
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 5,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 2,
          "Network": 3,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 5,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 0
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 3,
          "Network": 2,
          "HR": 1,
          "Compliance": 1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -4,
          "Integrity": -2,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 9
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -5,
          "Network": 0,
          "HR": 1,
          "Compliance": -8
        }
      }
    ]
  },
  {
    "id": "d6-arch-044",
    "domain": "d6",
    "hardMode": true,
    "patternTag": "control-effectiveness-vs-checklist",
    "title": "Control Effectiveness vs Checklist",
    "description": "Control Effectiveness vs Checklist. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d6-arch-045",
    "domain": "d6",
    "hardMode": true,
    "patternTag": "testing-independence-vs-speed",
    "title": "Testing Independence vs Speed",
    "description": "Testing Independence vs Speed. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 6,
          "Integrity": 7,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 4,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -2
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 4,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 2,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -4,
          "Integrity": -3,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -9
        }
      }
    ]
  },
  {
    "id": "d6-arch-046",
    "domain": "d6",
    "hardMode": true,
    "patternTag": "evidence-quality-vs-audit-deadline",
    "title": "Evidence Quality vs Audit Deadline",
    "description": "Evidence Quality vs Audit Deadline. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -10
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 9
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 0
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": 1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 9
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -8
        }
      }
    ]
  },
  {
    "id": "d6-arch-047",
    "domain": "d6",
    "hardMode": true,
    "patternTag": "continuous-monitoring-thresholds",
    "title": "Continuous Monitoring Thresholds",
    "description": "Continuous Monitoring Thresholds. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 6,
          "Integrity": 7,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 4,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -2
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 4,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 2,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -4,
          "Integrity": -3,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -9
        }
      }
    ]
  },
  {
    "id": "d6-arch-048",
    "domain": "d6",
    "hardMode": true,
    "patternTag": "red-team-findings-prioritization",
    "title": "Red Team Findings Prioritization",
    "description": "Red Team Findings Prioritization. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d7-arch-049",
    "domain": "d7",
    "hardMode": true,
    "patternTag": "containment-vs-business-continuity",
    "title": "Containment vs Business Continuity",
    "description": "Containment vs Business Continuity. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 4,
          "Budget": -4,
          "User Satisfaction": 2,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 4,
          "HR": 2,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 5,
          "Budget": 3,
          "User Satisfaction": 4,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 4,
          "HR": 4,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 1,
          "User Satisfaction": 2,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 2,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 2,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 1,
          "HR": 2,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d7-arch-050",
    "domain": "d7",
    "hardMode": true,
    "patternTag": "eradication-vs-forensic-preservation",
    "title": "Eradication vs Forensic Preservation",
    "description": "Eradication vs Forensic Preservation. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d7-arch-051",
    "domain": "d7",
    "hardMode": true,
    "patternTag": "ransomware-restore-vs-negotiation",
    "title": "Ransomware Restore vs Negotiation",
    "description": "Ransomware Restore vs Negotiation. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d7-arch-052",
    "domain": "d7",
    "hardMode": true,
    "patternTag": "logging-depth-vs-storage-cost",
    "title": "Logging Depth vs Storage Cost",
    "description": "Logging Depth vs Storage Cost. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 6,
          "Integrity": 7,
          "Availability": 2,
          "Budget": -2,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -1,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 4,
          "Availability": 3,
          "Budget": 5,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 5,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -2
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 2,
          "Network": 2,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -4,
          "Integrity": -3,
          "Availability": 1,
          "Budget": 5,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -9
        }
      }
    ]
  },
  {
    "id": "d7-arch-053",
    "domain": "d7",
    "hardMode": true,
    "patternTag": "soc-alert-fatigue-vs-coverage",
    "title": "Soc Alert Fatigue vs Coverage",
    "description": "Soc Alert Fatigue vs Coverage. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d7-arch-054",
    "domain": "d7",
    "hardMode": true,
    "patternTag": "bcp-activation-threshold",
    "title": "Bcp Activation Threshold",
    "description": "Bcp Activation Threshold. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d7-arch-055",
    "domain": "d7",
    "hardMode": true,
    "patternTag": "disaster-recovery-rto-rpo-tradeoff",
    "title": "Disaster Recovery Rto Rpo Tradeoff",
    "description": "Disaster Recovery Rto Rpo Tradeoff. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 4,
          "Budget": -4,
          "User Satisfaction": 2,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 4,
          "HR": 2,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 5,
          "Budget": 3,
          "User Satisfaction": 4,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 4,
          "HR": 4,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 1,
          "User Satisfaction": 2,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 2,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 2,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 1,
          "HR": 2,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d7-arch-056",
    "domain": "d7",
    "hardMode": true,
    "patternTag": "vulnerability-sla-enforcement",
    "title": "Vulnerability Sla Enforcement",
    "description": "Vulnerability Sla Enforcement. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d8-arch-057",
    "domain": "d8",
    "hardMode": true,
    "patternTag": "secure-by-design-vs-release-pressure",
    "title": "Secure By Design vs Release Pressure",
    "description": "Secure By Design vs Release Pressure. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -3,
          "User Satisfaction": 3,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -2,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 3,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 4,
          "User Satisfaction": 5,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 5,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 2,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 2,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 4,
          "User Satisfaction": 3,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 3,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d8-arch-058",
    "domain": "d8",
    "hardMode": true,
    "patternTag": "sast-vs-dast-prioritization",
    "title": "Sast vs Dast Prioritization",
    "description": "Sast vs Dast Prioritization. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d8-arch-059",
    "domain": "d8",
    "hardMode": true,
    "patternTag": "threat-model-depth-vs-timeline",
    "title": "Threat Model Depth vs Timeline",
    "description": "Threat Model Depth vs Timeline. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -3,
          "User Satisfaction": 3,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -2,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 3,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 4,
          "User Satisfaction": 5,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 5,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 2,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 2,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 4,
          "User Satisfaction": 3,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 3,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d8-arch-060",
    "domain": "d8",
    "hardMode": true,
    "patternTag": "open-source-risk-vs-innovation-speed",
    "title": "Open Source Risk vs Innovation Speed",
    "description": "Open Source Risk vs Innovation Speed. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -10
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 9
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 0
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": 1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 9
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -8
        }
      }
    ]
  },
  {
    "id": "d8-arch-061",
    "domain": "d8",
    "hardMode": true,
    "patternTag": "secret-management-maturity",
    "title": "Secret Management Maturity",
    "description": "Secret Management Maturity. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 7,
          "Integrity": 6,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 8,
          "Network": 3,
          "HR": 1,
          "Compliance": 8
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 4,
          "Integrity": 3,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 1,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 3,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 2,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -3,
          "Integrity": -4,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -6,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d8-arch-062",
    "domain": "d8",
    "hardMode": true,
    "patternTag": "ci-cd-signing-vs-friction",
    "title": "Ci Cd Signing vs Friction",
    "description": "Ci Cd Signing vs Friction. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -4,
          "User Satisfaction": 1,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -3,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 1,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 3,
          "User Satisfaction": 3,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 3,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 1,
          "User Satisfaction": 1,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 1,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 1,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 3,
          "User Satisfaction": 1,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 3,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 1,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d8-arch-063",
    "domain": "d8",
    "hardMode": true,
    "patternTag": "security-debt-vs-feature-roadmap",
    "title": "Security Debt vs Feature Roadmap",
    "description": "Security Debt vs Feature Roadmap. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -3,
          "User Satisfaction": 3,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -2,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 3,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 4,
          "User Satisfaction": 5,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 5,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 2,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 2,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 4,
          "User Satisfaction": 3,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 3,
          "Compliance": -10
        }
      }
    ]
  },
  {
    "id": "d8-arch-064",
    "domain": "d8",
    "hardMode": true,
    "patternTag": "prod-hotfix-vs-change-control",
    "title": "Prod Hotfix vs Change Control",
    "description": "Prod Hotfix vs Change Control. Multiple answers look viable; prioritize long-term governance outcomes.",
    "decisions": [
      {
        "text": "Phased enterprise plan with named owners, clear thresholds, and quarterly evidence.",
        "tier": "best",
        "signal": "green",
        "quality": "good",
        "outcome": "Slightly slower start, stronger long-term risk control and accountability.",
        "longTermRipple": "Consistent governance reduces exception debt over time.",
        "meters": {
          "Confidentiality": 5,
          "Integrity": 5,
          "Availability": 2,
          "Budget": -3,
          "User Satisfaction": 3,
          "Regulatory Risk": -8
        },
        "stakeholders": {
          "CFO": -2,
          "SOC Lead": 6,
          "Network": 3,
          "HR": 3,
          "Compliance": 7
        }
      },
      {
        "text": "Fast-track this quarter, then close governance gaps after delivery stabilizes.",
        "tier": "secondBest",
        "signal": "yellow",
        "quality": "warn",
        "outcome": "Short-term momentum improves, but deferred controls increase latent risk.",
        "longTermRipple": "If closure slips, temporary exceptions become persistent debt.",
        "meters": {
          "Confidentiality": 2,
          "Integrity": 2,
          "Availability": 3,
          "Budget": 4,
          "User Satisfaction": 5,
          "Regulatory Risk": 4
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": 0,
          "Network": 3,
          "HR": 5,
          "Compliance": -3
        }
      },
      {
        "text": "Harden highest-risk systems first; defer enterprise policy harmonization.",
        "tier": "incomplete",
        "signal": "blue",
        "quality": "balanced",
        "outcome": "Immediate reduction in selected areas, but enterprise consistency remains partial.",
        "longTermRipple": "Uneven coverage drives repeated reprioritization cycles.",
        "meters": {
          "Confidentiality": 3,
          "Integrity": 2,
          "Availability": 1,
          "Budget": 2,
          "User Satisfaction": 3,
          "Regulatory Risk": 2
        },
        "stakeholders": {
          "CFO": 2,
          "SOC Lead": 1,
          "Network": 1,
          "HR": 3,
          "Compliance": -1
        }
      },
      {
        "text": "Issue guidance only and let each business unit decide timing and scope.",
        "tier": "misaligned",
        "signal": "red",
        "quality": "bad",
        "outcome": "Low initial friction, but fragmented decisions raise rework and compliance uncertainty.",
        "longTermRipple": "Control drift accelerates as local exceptions become normal practice.",
        "meters": {
          "Confidentiality": -5,
          "Integrity": -5,
          "Availability": 1,
          "Budget": 4,
          "User Satisfaction": 3,
          "Regulatory Risk": 11
        },
        "stakeholders": {
          "CFO": 4,
          "SOC Lead": -8,
          "Network": 0,
          "HR": 3,
          "Compliance": -10
        }
      }
    ]
  }
];



const state = {
  domain: "all",
  difficulty: "medium",
  quarter: 1,
  week: 1,
  briefPool: [],
  used: new Set(),
  stakeholders: {},
  meters: {}
};

const landingScreen = document.getElementById("landingScreen");
const simScreen = document.getElementById("simScreen");
const domainSelect = document.getElementById("domainSelect");
const difficultySelect = document.getElementById("difficultySelect");
const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const selectedDomainEl = document.getElementById("selectedDomain");
const selectedDifficultyEl = document.getElementById("selectedDifficulty");

const stakeholderListEl = document.getElementById("stakeholderList");
const briefTitleEl = document.getElementById("briefTitle");
const briefDescriptionEl = document.getElementById("briefDescription");
const decisionListEl = document.getElementById("decisionList");
const outcomeBoxEl = document.getElementById("outcomeBox");
const meterListEl = document.getElementById("meterList");
const incidentLogEl = document.getElementById("incidentLog");

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function scaled(delta) {
  const factor = DIFFICULTY[state.difficulty].scale;
  const adjusted = delta * factor;
  return adjusted > 0 ? Math.ceil(adjusted) : Math.floor(adjusted);
}

function initStateValues() {
  STAKEHOLDERS.forEach((name) => {
    state.stakeholders[name] = 68;
  });

  METERS.forEach((name) => {
    state.meters[name] = name === "Regulatory Risk" ? 30 : 66;
  });

  state.quarter = 1;
  state.week = 1;
  state.used.clear();
}

function updateTopBar() {
  selectedDomainEl.textContent = DOMAIN_LABELS[state.domain];
  selectedDifficultyEl.textContent = DIFFICULTY[state.difficulty].label;
}

function renderStakeholders() {
  stakeholderListEl.innerHTML = "";

  STAKEHOLDERS.forEach((name) => {
    const value = state.stakeholders[name];
    const row = document.createElement("div");
    row.className = "stakeholder-row";
    row.innerHTML = `
      <div class="row-head"><span>${name}</span><span>${Math.round(value)}%</span></div>
      <div class="track"><div class="fill" style="width:${value}%"></div></div>
    `;
    stakeholderListEl.appendChild(row);
  });
}

function meterTone(value, reverse = false) {
  if (!reverse) {
    if (value >= 65) return "";
    if (value >= 40) return "warn";
    return "bad";
  }

  if (value <= 35) return "";
  if (value <= 60) return "warn";
  return "bad";
}

function renderMeters() {
  meterListEl.innerHTML = "";

  METERS.forEach((name) => {
    const value = state.meters[name];
    const tone = meterTone(value, name === "Regulatory Risk");

    const col = document.createElement("div");
    col.className = "meter-col";
    col.innerHTML = `
      <div class="meter-track">
        <div class="meter-fill ${tone}" style="height:${value}%"></div>
      </div>
      <div class="meter-value">${Math.round(value)}%</div>
      <div class="meter-name">${name}</div>
    `;
    meterListEl.appendChild(col);
  });
}

function addLog(message) {
  const line = document.createElement("div");
  line.className = "log-line";
  line.textContent = `Q${state.quarter} W${state.week} - ${message}`;
  incidentLogEl.prepend(line);
}

function applyVolatility() {
  if (Math.random() > DIFFICULTY[state.difficulty].volatility) return;

  const target = pickRandom(METERS);
  const swing = Math.random() < 0.5 ? -4 : 4;
  state.meters[target] = clamp(state.meters[target] + swing);
  addLog(`External volatility changed ${target} by ${swing > 0 ? "+4" : "-4"}.`);
}

function nextTurn() {
  state.week += 1;
  if (state.week > 13) {
    state.week = 1;
    state.quarter += 1;
  }
}

function getBriefPool() {
  state.briefPool = BRIEFS.filter((item) => state.domain === "all" || item.domain === state.domain);
}

function nextBrief() {
  if (!state.briefPool.length) return null;

  if (state.used.size >= state.briefPool.length) {
    state.used.clear();
  }

  const remaining = state.briefPool.filter((item) => !state.used.has(item.id));
  const chosen = pickRandom(remaining);
  state.used.add(chosen.id);
  return chosen;
}

function decisionQualityClass(quality) {
  if (quality === "good") return "outcome-good";
  if (quality === "warn") return "outcome-warn";
  if (quality === "bad") return "outcome-bad";
  return "";
}

function decisionButtonClass(decision) {
  const tier = decision?.tier;
  if (tier === "best") return "decision-best";
  if (tier === "secondBest") return "decision-second";
  if (tier === "misaligned") return "decision-risky";
  return "decision-neutral";
}

function renderBrief(brief) {
  briefTitleEl.textContent = brief.title;
  briefDescriptionEl.textContent = brief.description;

  decisionListEl.innerHTML = "";
  brief.decisions.forEach((decision, idx) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "decision-btn";
    button.textContent = `${idx + 1}. ${decision.text}`;
    button.addEventListener("click", () => handleDecision(decision));
    decisionListEl.appendChild(button);
  });
}

function handleDecision(decision) {
  Object.entries(decision.meters).forEach(([name, delta]) => {
    state.meters[name] = clamp(state.meters[name] + scaled(delta));
  });

  Object.entries(decision.stakeholders || {}).forEach(([name, delta]) => {
    state.stakeholders[name] = clamp(state.stakeholders[name] + scaled(delta));
  });

  outcomeBoxEl.className = `outcome-box ${decisionQualityClass(decision.quality)}`.trim();
  outcomeBoxEl.textContent = decision.outcome;

  addLog(`${decision.text}. ${decision.outcome}`);

  applyVolatility();
  nextTurn();
  updateTopBar();
  renderStakeholders();
  renderMeters();

  const upcoming = nextBrief();
  if (upcoming) {
    renderBrief(upcoming);
  }
}

function startSimulation() {
  state.domain = domainSelect.value;
  state.difficulty = difficultySelect.value;

  initStateValues();
  getBriefPool();

  if (!state.briefPool.length) {
    outcomeBoxEl.className = "outcome-box outcome-bad";
    outcomeBoxEl.textContent = "No briefs available for selected domain.";
    return;
  }

  landingScreen.classList.add("hidden");
  simScreen.classList.remove("hidden");

  incidentLogEl.innerHTML = "";
  outcomeBoxEl.className = "outcome-box";
  outcomeBoxEl.textContent = "Select a decision to proceed.";

  updateTopBar();
  renderStakeholders();
  renderMeters();
  addLog("Simulation started.");

  renderBrief(nextBrief());
}

function returnToLanding() {
  simScreen.classList.add("hidden");
  landingScreen.classList.remove("hidden");
}

startBtn.addEventListener("click", startSimulation);
backBtn.addEventListener("click", returnToLanding);
