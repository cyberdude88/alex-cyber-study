const SCENARIO_CONVERSION_SCHEMA = {
  input: {
    required: ["domain", "difficulty", "stem", "options", "correctIndex", "coreConcept"],
    shape: {
      domain: "string",
      difficulty: "string",
      stem: "string",
      options: "string[]",
      correctIndex: "number",
      coreConcept: "string"
    }
  },
  output: {
    required: ["id", "domain", "hardMode", "title", "description", "decisions"],
    shape: {
      id: "string",
      domain: "string",
      hardMode: "boolean",
      title: "string",
      description: "string",
      decisions: [
        {
          text: "string",
          effects: {
            immediate: "string",
            longTerm: "string",
            meters: "Record<string, number>"
          },
          triggers: "string[]"
        }
      ]
    }
  }
};

const DEFAULT_METER_KEYS = [
  "riskExposure",
  "operationalStability",
  "governanceConfidence",
  "deliveryVelocity",
  "auditReadiness"
];

const CONCEPT_METER_MAP = {
  "residual risk": {
    riskExposure: -5,
    governanceConfidence: 3,
    auditReadiness: 2
  },
  "risk appetite": {
    governanceConfidence: 3,
    deliveryVelocity: 1,
    riskExposure: -2
  },
  "due care": {
    governanceConfidence: 4,
    auditReadiness: 3,
    operationalStability: 1
  },
  "due diligence": {
    auditReadiness: 4,
    governanceConfidence: 2,
    riskExposure: -2
  },
  "least privilege": {
    riskExposure: -4,
    operationalStability: 2,
    governanceConfidence: 2
  },
  "defense in depth": {
    riskExposure: -4,
    operationalStability: 3,
    deliveryVelocity: -1
  }
};

function normalizeConceptKey(value) {
  return String(value || "").trim().toLowerCase();
}

function stableHash(text) {
  let hash = 0;
  const input = String(text || "");
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function baseMeters() {
  return DEFAULT_METER_KEYS.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});
}

function addMeterDelta(target, delta) {
  Object.entries(delta || {}).forEach(([key, value]) => {
    target[key] = (target[key] || 0) + value;
  });
  return target;
}

function classifyDistractors(options, correctIndex, seed) {
  const wrongIndexes = options
    .map((_, index) => index)
    .filter((index) => index !== correctIndex);

  if (wrongIndexes.length === 0) {
    return { strong: -1, weak: [] };
  }

  const strong = wrongIndexes[seed % wrongIndexes.length];
  const weak = wrongIndexes.filter((index) => index !== strong);
  return { strong, weak };
}

function buildDecision(optionText, optionIndex, classification, conceptDelta) {
  const meters = addMeterDelta(baseMeters(), conceptDelta);
  const genericDecisionLabel = `Decision Path ${String.fromCharCode(65 + optionIndex)}`;
  const weakVariants = [
    "low-control action with immediate exposure",
    "fragmented control action with unclear accountability",
    "ad hoc mitigation with inconsistent safeguards"
  ];

  if (classification === "correct") {
    addMeterDelta(meters, {
      riskExposure: -8,
      operationalStability: 5,
      governanceConfidence: 6,
      deliveryVelocity: 1,
      auditReadiness: 4
    });
    return {
      text: `${genericDecisionLabel} | controlled implementation with explicit ownership`,
      effects: {
        immediate: "Execution slows briefly while ownership and controls are aligned.",
        longTerm: "Risk remains within tolerance and governance reporting becomes predictable.",
        meters
      },
      triggers: [
        "Control decision is approved by accountable leadership",
        "Consequence is measured against risk tolerance",
        "Ripple effect improves cross-team coordination",
        "Governance context stays evidence-backed"
      ]
    };
  }

  if (classification === "strong") {
    addMeterDelta(meters, {
      riskExposure: 6,
      operationalStability: -2,
      governanceConfidence: -4,
      deliveryVelocity: 5,
      auditReadiness: -3
    });
    return {
      text: `${genericDecisionLabel} | accelerated execution with deferred assurance checks`,
      effects: {
        immediate: "Delivery accelerates and early stakeholders report momentum.",
        longTerm: "Hidden control debt increases residual risk and weakens governance assurance.",
        meters
      },
      triggers: [
        "Control decision prioritizes speed over validation",
        "Consequence appears positive in the short term",
        "Ripple effect creates exception handling overhead",
        "Governance context drifts from documented intent"
      ]
    };
  }

  addMeterDelta(meters, {
    riskExposure: 9,
    operationalStability: -6,
    governanceConfidence: -6,
    deliveryVelocity: -3,
    auditReadiness: -5
  });
  const weakText = weakVariants[optionIndex % weakVariants.length];
  return {
    text: `${genericDecisionLabel} | ${weakText}`,
    effects: {
      immediate: "Control coverage degrades and operational friction appears immediately.",
      longTerm: "Escalations increase and corrective governance actions become mandatory.",
      meters
    },
    triggers: [
      "Control decision omits key safeguard",
      "Consequence introduces immediate risk expansion",
      "Ripple effect disrupts upstream and downstream teams",
      "Governance context requires remediation"
    ]
  };
}

function validateQuestion(question) {
  if (!question || typeof question !== "object") {
    throw new Error("Question must be an object.");
  }

  const required = SCENARIO_CONVERSION_SCHEMA.input.required;
  required.forEach((field) => {
    if (!(field in question)) {
      throw new Error(`Missing required field: ${field}`);
    }
  });

  if (!Array.isArray(question.options) || question.options.length < 2) {
    throw new Error("Question options must be an array with at least two entries.");
  }

  if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
    throw new Error("correctIndex is out of range for options.");
  }
}

function convertQuestionToScenario(question) {
  validateQuestion(question);

  const conceptKey = normalizeConceptKey(question.coreConcept);
  const conceptDelta = CONCEPT_METER_MAP[conceptKey] || { governanceConfidence: 1 };
  const seed = stableHash(`${question.domain}|${question.coreConcept}|${question.stem}`);
  const distractors = classifyDistractors(question.options, question.correctIndex, seed);

  const decisions = question.options.map((optionText, index) => {
    if (index === question.correctIndex) {
      return buildDecision(optionText, index, "correct", conceptDelta);
    }
    if (index === distractors.strong) {
      return buildDecision(optionText, index, "strong", conceptDelta);
    }
    return buildDecision(optionText, index, "weak", conceptDelta);
  });

  const id = `scn-${toSlug(question.domain)}-${toSlug(question.coreConcept)}-${seed
    .toString(36)
    .slice(0, 8)}`;

  return {
    id,
    domain: question.domain,
    hardMode: String(question.difficulty).toUpperCase() === "HARD",
    title: `${question.domain} | ${question.coreConcept} governance tradeoff`,
    description:
      "A control decision must balance immediate execution pressure with long-term governance outcomes.",
    decisions
  };
}

const EXAMPLE_QUESTION = {
  domain: "Domain 4",
  difficulty: "HARD",
  stem: "A security team must choose how to treat remaining uncertainty after safeguards are applied.",
  options: [
    "Escalate a governance-backed treatment plan",
    "Ship quickly and defer evidence collection",
    "Ignore variance and accept undocumented drift",
    "Rely on informal agreement across teams"
  ],
  correctIndex: 0,
  coreConcept: "residual risk"
};

const EXAMPLE_SCENARIO = convertQuestionToScenario(EXAMPLE_QUESTION);

export {
  SCENARIO_CONVERSION_SCHEMA,
  CONCEPT_METER_MAP,
  convertQuestionToScenario,
  EXAMPLE_QUESTION,
  EXAMPLE_SCENARIO
};
