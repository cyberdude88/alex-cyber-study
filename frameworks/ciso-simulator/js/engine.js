// engine.js — CISO Simulator core loop.
// Depends on: scenarios.js, meters.js (must be loaded first).

const Engine = (() => {
  // Full trigger registry. Keys match:
  //   - decision.triggers[] entries in scenarios.js
  //   - threshold event IDs returned by Meters.checkThresholds()
  const TRIGGERS = {
    "service-degradation": {
      label: "SERVICE DEGRADATION",
      message: "Availability has dropped below 30%. Users are reporting widespread outages. Operations is on all-hands."
    },
    "audit-trigger": {
      label: "REGULATORY AUDIT",
      message: "Regulatory risk has exceeded 70%. A formal audit notification has been received. Legal is engaged."
    },
    "cfo-dissatisfaction": {
      label: "CFO INTERVENTION",
      message: "Budget has dropped below 20%. The CFO has called an emergency review of security spending."
    },
    "ransomware-spread": {
      label: "RANSOMWARE LATERAL MOVEMENT",
      message: "Delayed isolation allowed the ransomware to spread to 12 additional hosts. Recovery cost has tripled."
    },
    "executive-escalation": {
      label: "EXECUTIVE DECISION",
      message: "The board has accepted the risk on your behalf. Accountability for the outcome now rests with the CEO."
    },
    "forensic-evidence": {
      label: "FORENSIC EVIDENCE SECURED",
      message: "Covert investigation has preserved a complete forensic trail. Legal is prepared for prosecution."
    },
    "pipeline-audit": {
      label: "PIPELINE AUDIT INITIATED",
      message: "Full CI/CD audit found two additional stale keys and one unauthorized webhook alongside the original exposure."
    },
    "legal-resolution": {
      label: "LEGAL COUNSEL ENGAGED",
      message: "External counsel has provided a defensible reconciliation path satisfying both regulatory frameworks."
    },
    "architecture-review": {
      label: "ARCHITECTURE REVIEW ORDERED",
      message: "The external review validated the Zero Trust approach and delivered a phased migration roadmap."
    },
    "ml-classification-risk": {
      label: "ML CLASSIFICATION ACCURACY WARNING",
      message: "Auto-classification mislabeled 8% of records. Manual review is required before DLP enforcement begins."
    }
  };

  let state = {
    week: 1,
    domain: "ALL",
    hardOnly: false,
    chaotic: false,
    currentScenario: null,
    incidentLog: [],
    gameOver: false,
    gameOverReason: null
  };

  // ── Initialization ────────────────────────────────────────────────────

  // config: { domain, hardOnly, chaotic }
  // domain:   "ALL" | "D1" .. "D8"
  // hardOnly: true for HARD / CHAOTIC HARD modes
  // chaotic:  true for CHAOTIC HARD — adds random ±20% variance to all effects
  function init(config) {
    const cfg = config || {};
    state = {
      week: 1,
      domain: cfg.domain || "ALL",
      hardOnly: cfg.hardOnly || false,
      chaotic: cfg.chaotic || false,
      currentScenario: null,
      incidentLog: [],
      gameOver: false,
      gameOverReason: null
    };

    Meters.init();
    state.currentScenario = Scenarios.getNext(state.domain, state.hardOnly, null);
  }

  // ── Internal helpers ──────────────────────────────────────────────────

  function addToLog(entry) {
    state.incidentLog.unshift({
      week: state.week,
      timestamp: Date.now(),
      ...entry
    });
  }

  // CHAOTIC HARD: apply ±20% random variance to each effect delta.
  function applyChaoticVariance(effects) {
    const varied = {};
    Object.keys(effects).forEach((key) => {
      const base = effects[key];
      const variance = base * 0.2 * (Math.random() * 2 - 1);
      varied[key] = Math.round(base + variance);
    });
    return varied;
  }

  // Resolve trigger IDs to full TRIGGERS entries, silently skip unknowns.
  function resolveTriggers(ids) {
    if (!Array.isArray(ids)) return [];
    return ids
      .map((id) => (TRIGGERS[id] ? { id, ...TRIGGERS[id] } : null))
      .filter(Boolean);
  }

  // ── Core turn handler ─────────────────────────────────────────────────

  // decisionIndex: 0–3, matching the decisions array on the current scenario.
  // Returns full game state after the turn, or null if no valid turn to process.
  function submitDecision(decisionIndex) {
    if (state.gameOver || !state.currentScenario) return null;

    const decision = state.currentScenario.decisions[decisionIndex];
    if (!decision) return null;

    // Apply effects — with optional chaotic variance.
    const effects = state.chaotic
      ? applyChaoticVariance(decision.effects)
      : decision.effects;

    Meters.apply(effects);

    // Log the player's decision.
    addToLog({
      type: "decision",
      scenarioTitle: state.currentScenario.title,
      decisionText: decision.text,
      effects: { ...effects }
    });

    // ── Threshold events (meter-driven) ───────────────────────────────────
    const thresholdHits = Meters.checkThresholds();
    thresholdHits.forEach((t) => {
      const trigger = TRIGGERS[t.id];
      addToLog({
        type: "event",
        label: t.label,
        message: trigger
          ? `Week ${state.week}: ${trigger.label} — ${trigger.message}`
          : `Week ${state.week}: ${t.label}`
      });
    });

    // ── Decision-driven triggers ──────────────────────────────────────────
    const decisionTriggers = resolveTriggers(decision.triggers);
    decisionTriggers.forEach((t) => {
      addToLog({
        type: "event",
        label: t.label,
        message: `Week ${state.week}: ${t.label} — ${t.message}`
      });
    });

    // ── Game-over check ───────────────────────────────────────────────────
    const gameOverCondition = Meters.checkGameOver();
    if (gameOverCondition) {
      state.gameOver = true;
      state.gameOverReason = gameOverCondition.reason;
      addToLog({
        type: "game-over",
        message: gameOverCondition.reason
      });
      return getState();
    }

    // ── Advance week and track quarter boundaries ─────────────────────────
    const prevQuarter = Math.ceil(state.week / 12);
    state.week += 1;
    const newQuarter = Math.ceil(state.week / 12);

    if (newQuarter > prevQuarter) {
      addToLog({
        type: "quarter",
        label: `Q${newQuarter} BEGIN`,
        message: `Week ${state.week}: Quarter ${newQuarter} has started. Review your meter trends and adjust your posture.`
      });
    }

    // ── Load next scenario — followUp takes priority over random ─────────
    const followUpId = decision.followUp && decision.followUp.id;
    if (followUpId) {
      const followUpScenario = Scenarios.getAll().find((s) => s.id === followUpId) || null;
      state.currentScenario = followUpScenario || Scenarios.getNext(
        state.domain,
        state.hardOnly,
        state.currentScenario.id
      );
    } else {
      state.currentScenario = Scenarios.getNext(
        state.domain,
        state.hardOnly,
        state.currentScenario.id
      );
    }

    return getState();
  }

  // ── Public accessors ──────────────────────────────────────────────────

  function getState() {
    return {
      week: state.week,
      quarter: Math.ceil(state.week / 12),
      domain: state.domain,
      hardOnly: state.hardOnly,
      chaotic: state.chaotic,
      currentScenario: state.currentScenario,
      meters: Meters.get(),
      incidentLog: [...state.incidentLog],
      gameOver: state.gameOver,
      gameOverReason: state.gameOverReason
    };
  }

  function getTriggers() {
    return { ...TRIGGERS };
  }

  return { init, submitDecision, getState, addToLog, getTriggers };
})();
