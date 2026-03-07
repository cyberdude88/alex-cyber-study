export const DIFFICULTY_LEVELS = Object.freeze({
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  EXPERT: "expert"
});

const DIFFICULTY_KEYWORDS = {
  easy: ["define", "definition", "identify", "basic", "foundational"],
  medium: ["align", "alignment", "phase", "process", "design", "sequence"],
  hard: ["governance", "exception", "waiver", "tradeoff", "trade-off", "prioritize"],
  expert: ["conflict", "risk appetite", "residual risk", "strategy", "regulator", "regulatory"]
};

function includesAny(text, candidates) {
  return candidates.some((word) => text.includes(word));
}

export function classifyDifficulty(scenario) {
  if (scenario && typeof scenario.difficulty === "string") {
    const normalized = scenario.difficulty.trim().toLowerCase();
    if (Object.values(DIFFICULTY_LEVELS).includes(normalized)) {
      return normalized;
    }
  }

  const combinedText = [
    scenario?.prompt || "",
    scenario?.mostStrategicReason || ""
  ].join(" ").toLowerCase();

  if (includesAny(combinedText, DIFFICULTY_KEYWORDS.expert)) return DIFFICULTY_LEVELS.EXPERT;
  if (includesAny(combinedText, DIFFICULTY_KEYWORDS.hard)) return DIFFICULTY_LEVELS.HARD;
  if (includesAny(combinedText, DIFFICULTY_KEYWORDS.medium)) return DIFFICULTY_LEVELS.MEDIUM;
  if (includesAny(combinedText, DIFFICULTY_KEYWORDS.easy)) return DIFFICULTY_LEVELS.EASY;

  return DIFFICULTY_LEVELS.MEDIUM;
}

export function withCalibratedDifficulty(frameworks) {
  return frameworks.map((framework) => ({
    ...framework,
    scenarios: (framework.scenarios || []).map((scenario) => ({
      ...scenario,
      difficulty: classifyDifficulty(scenario)
    }))
  }));
}

export function getAdaptiveDifficulty(state) {
  const {
    alignment = 50,
    risk = 0,
    streak = 0
  } = state || {};

  if (risk >= 70 || alignment <= 35) return DIFFICULTY_LEVELS.EASY;
  if (alignment >= 78 && risk <= 25 && streak >= 3) return DIFFICULTY_LEVELS.EXPERT;
  if (alignment >= 62 && risk <= 45 && streak >= 2) return DIFFICULTY_LEVELS.HARD;
  return DIFFICULTY_LEVELS.MEDIUM;
}
