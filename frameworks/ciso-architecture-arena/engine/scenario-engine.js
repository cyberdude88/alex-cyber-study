import { evaluatePerspectiveScore } from "./perspective-scoring.js";

export const PERSPECTIVES = [
  "CISO",
  "Enterprise Architect",
  "Security Architect",
  "Risk Manager",
  "Audit/Compliance"
];

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export class ScenarioEngine {
  constructor(frameworks) {
    this.frameworks = frameworks;
    this.activeFramework = null;
    this.queue = [];
    this.currentScenario = null;
    this.perspectiveScores = PERSPECTIVES.reduce((acc, perspective) => {
      acc[perspective] = 0;
      return acc;
    }, {});
  }

  selectFramework(frameworkId) {
    this.activeFramework = this.frameworks.find((framework) => framework.id === frameworkId) || null;
    this.queue = [];
    this.currentScenario = null;

    if (this.activeFramework) {
      this.queue = shuffle(this.activeFramework.scenarios.map((_, idx) => idx));
    }

    return this.activeFramework;
  }

  buildQueue(difficulty) {
    if (!this.activeFramework) return [];
    const source = this.activeFramework.scenarios || [];
    const filtered = difficulty
      ? source.map((scenario, idx) => ({ scenario, idx })).filter(({ scenario }) => scenario.difficulty === difficulty)
      : source.map((scenario, idx) => ({ scenario, idx }));
    return shuffle(filtered.map(({ idx }) => idx));
  }

  nextScenario(difficulty) {
    if (!this.activeFramework) return null;

    if (this.queue.length === 0) {
      this.queue = this.buildQueue(difficulty);
    }

    // Fallback to unfiltered scenarios if a specific bucket is empty.
    if (this.queue.length === 0 && difficulty) {
      this.queue = this.buildQueue(null);
    }

    if (this.queue.length === 0) return null;
    const nextIndex = this.queue.pop();
    this.currentScenario = this.activeFramework.scenarios[nextIndex] || null;
    return this.currentScenario;
  }

  evaluate(selectedPerspective) {
    if (!this.currentScenario) {
      return {
        isCorrect: false,
        selectedPerspective,
        mostCorrectPerspective: null,
        scenario: null,
        selectedAnalysis: null
      };
    }

    const mostCorrectPerspective = this.currentScenario.mostCorrectPerspective;
    const scoring = evaluatePerspectiveScore({
      scenario: this.currentScenario,
      selectedPerspective,
      winnerPerspective: mostCorrectPerspective,
      model: this.activeFramework?.perspectiveScoringModel
    });

    if (selectedPerspective && this.perspectiveScores[selectedPerspective] !== undefined) {
      this.perspectiveScores[selectedPerspective] += scoring.selectedScore;
    }

    return {
      isCorrect: selectedPerspective === mostCorrectPerspective,
      selectedPerspective,
      mostCorrectPerspective,
      scenario: this.currentScenario,
      selectedAnalysis: this.currentScenario.perspectiveAnalysis[selectedPerspective] || null,
      scoring,
      perspectiveScores: { ...this.perspectiveScores }
    };
  }
}
