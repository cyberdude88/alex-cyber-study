const Meters = (() => {
  // Starting values — balanced but not invincible.
  const INITIAL = {
    confidentiality: 70,
    integrity: 70,
    availability: 80,
    budget: 60,
    userSatisfaction: 65,
    regulatoryRisk: 20
  };

  let state = { ...INITIAL };

  // Threshold events fire when a meter crosses a danger boundary.
  // These return IDs that engine.js resolves to full trigger objects.
  const THRESHOLDS = [
    {
      id: "service-degradation",
      label: "Service Degradation Alert",
      meter: "availability",
      condition: (v) => v < 30
    },
    {
      id: "audit-trigger",
      label: "Regulatory Audit Triggered",
      meter: "regulatoryRisk",
      condition: (v) => v > 70
    },
    {
      id: "cfo-dissatisfaction",
      label: "CFO Raises Budget Concerns",
      meter: "budget",
      condition: (v) => v < 25
    }
  ];

  // Game-over conditions — any one ends the run.
  const GAME_OVER_CONDITIONS = [
    {
      meter: "confidentiality",
      condition: (v) => v <= 0,
      reason: "A catastrophic data breach has exposed all sensitive assets. The board has terminated your contract."
    },
    {
      meter: "integrity",
      condition: (v) => v <= 0,
      reason: "Critical system data has been corrupted beyond recovery. Operations have ceased."
    },
    {
      meter: "availability",
      condition: (v) => v <= 0,
      reason: "All systems are offline. The outage exceeds acceptable SLA windows. You have been relieved of duty."
    },
    {
      meter: "budget",
      condition: (v) => v <= 0,
      reason: "The security budget is exhausted. Finance has frozen all security operations pending a leadership review."
    },
    {
      meter: "userSatisfaction",
      condition: (v) => v <= 0,
      reason: "Staff and user confidence has collapsed. A mass walkout has forced an emergency board intervention."
    },
    {
      meter: "regulatoryRisk",
      condition: (v) => v >= 100,
      reason: "Regulators have issued a cease-and-desist order. Your organization is under formal investigation."
    }
  ];

  function init() {
    state = { ...INITIAL };
  }

  function clamp(value) {
    return Math.max(0, Math.min(100, value));
  }

  // Apply a set of effect deltas to the current meter state.
  function apply(effects) {
    Object.keys(effects).forEach((key) => {
      if (key in state) {
        state[key] = clamp(state[key] + effects[key]);
      }
    });
  }

  // Return a shallow copy of current meter values.
  function get() {
    return { ...state };
  }

  // Return all threshold events that are currently triggered.
  function checkThresholds() {
    return THRESHOLDS.filter((t) => t.condition(state[t.meter]));
  }

  // Return the first game-over condition that is met, or null.
  function checkGameOver() {
    return GAME_OVER_CONDITIONS.find((c) => c.condition(state[c.meter])) || null;
  }

  // Update the DOM. Expects elements with IDs:
  //   meter-<key>-value  → text display
  //   meter-<key>-fill   → width-based fill bar
  // CSS classes applied: meter-fill (base), meter-warning, meter-critical
  function render() {
    Object.keys(state).forEach((key) => {
      const valueEl = document.getElementById(`meter-${key}-value`);
      const fillEl = document.getElementById(`meter-${key}-fill`);

      if (valueEl) {
        valueEl.textContent = `${Math.round(state[key])}%`;
      }

      if (fillEl) {
        fillEl.style.width = `${state[key]}%`;
        fillEl.className = "meter-fill";

        // regulatoryRisk: high is dangerous.
        // All other meters: low is dangerous.
        if (key === "regulatoryRisk") {
          if (state[key] > 70) {
            fillEl.classList.add("meter-critical");
          } else if (state[key] > 50) {
            fillEl.classList.add("meter-warning");
          }
        } else {
          if (state[key] < 30) {
            fillEl.classList.add("meter-critical");
          } else if (state[key] < 50) {
            fillEl.classList.add("meter-warning");
          }
        }
      }
    });
  }

  return { init, apply, get, checkThresholds, checkGameOver, render };
})();
