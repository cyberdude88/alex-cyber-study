const DEFAULT_MODEL = {
  base: {
    correctBonus: 100,
    technicalCredit: 30,
    strategicPenalty: -20,
    noGapBonus: 15
  },
  focusBoost: {}
};

function numberOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function readBase(model) {
  const base = model?.base || {};
  return {
    correctBonus: numberOr(base.correctBonus, DEFAULT_MODEL.base.correctBonus),
    technicalCredit: numberOr(base.technicalCredit, DEFAULT_MODEL.base.technicalCredit),
    strategicPenalty: numberOr(base.strategicPenalty, DEFAULT_MODEL.base.strategicPenalty),
    noGapBonus: numberOr(base.noGapBonus, DEFAULT_MODEL.base.noGapBonus)
  };
}

function computeFocusBoost(model, scenario, perspective) {
  const focus = Array.isArray(scenario?.focus) ? scenario.focus : [];
  const table = model?.focusBoost || DEFAULT_MODEL.focusBoost;

  return focus.reduce((sum, key) => {
    const perFocus = table?.[key];
    if (!perFocus || typeof perFocus !== "object") return sum;
    const boost = perFocus[perspective];
    return sum + (Number.isFinite(boost) ? boost : 0);
  }, 0);
}

function scorePerspective({ scenario, perspective, winnerPerspective, model }) {
  const base = readBase(model);
  const analysis = scenario?.perspectiveAnalysis?.[perspective] || null;
  const isWinner = perspective === winnerPerspective;
  const hasStrategicGap = Boolean((analysis?.strategicGap || "").trim());

  let score = isWinner ? base.correctBonus : base.technicalCredit + base.strategicPenalty;
  if (!hasStrategicGap) {
    score += base.noGapBonus;
  }

  score += computeFocusBoost(model, scenario, perspective);
  return score;
}

function confidenceBand(delta) {
  if (delta <= 10) return "close";
  if (delta <= 30) return "moderate";
  return "clear";
}

export function evaluatePerspectiveScore({ scenario, selectedPerspective, winnerPerspective, model }) {
  const selectedScore = scorePerspective({
    scenario,
    perspective: selectedPerspective,
    winnerPerspective,
    model
  });

  const winnerScore = scorePerspective({
    scenario,
    perspective: winnerPerspective,
    winnerPerspective,
    model
  });

  const deltaToWinner = Math.max(0, winnerScore - selectedScore);

  return {
    selectedScore,
    winnerScore,
    deltaToWinner,
    confidenceBand: confidenceBand(deltaToWinner)
  };
}
