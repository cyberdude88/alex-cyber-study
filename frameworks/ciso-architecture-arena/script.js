import { ScenarioEngine, PERSPECTIVES } from "./engine/scenario-engine.js";
import { frameworkRenderer } from "./engine/framework-renderer.js";
import { buildExplanation } from "./engine/explanation-engine.js";
import { loadFrameworkPlugins } from "./engine/plugin-loader.js";
import {
  DIFFICULTY_LEVELS,
  withCalibratedDifficulty,
  getAdaptiveDifficulty
} from "./engine/difficulty-engine.js";

const FRAMEWORK_MANIFEST_URL = "./engine/framework-plugins.json";
const SESSION_STORAGE_KEY = "cisoArenaSessions";

const DIFFICULTY_LABELS = {
  [DIFFICULTY_LEVELS.EASY]: "Easy",
  [DIFFICULTY_LEVELS.MEDIUM]: "Medium",
  [DIFFICULTY_LEVELS.HARD]: "Hard",
  [DIFFICULTY_LEVELS.EXPERT]: "Expert"
};

const DIFFICULTY_IMPACT = {
  [DIFFICULTY_LEVELS.EASY]: { alignGain: 6, alignLoss: 6, riskGain: 8, riskRelief: 4 },
  [DIFFICULTY_LEVELS.MEDIUM]: { alignGain: 10, alignLoss: 10, riskGain: 15, riskRelief: 5 },
  [DIFFICULTY_LEVELS.HARD]: { alignGain: 12, alignLoss: 12, riskGain: 18, riskRelief: 4 },
  [DIFFICULTY_LEVELS.EXPERT]: { alignGain: 14, alignLoss: 14, riskGain: 22, riskRelief: 3 }
};

let frameworks = [];
let scenarioEngine = null;
let activeFramework = null;
let currentScenario = null;
let selectedPerspective = null;
let currentDifficulty = DIFFICULTY_LEVELS.MEDIUM;

let alignment = 50;
let risk = 0;
let gameOver = false;
let awaitingContinue = false;
let isDataLoaded = false;
let sessionLimit = null;
let questionsAnswered = 0;
let correctStreak = 0;
let performanceTracking = {
  totalQuestions: 0,
  cisoCorrect: 0,
  engineerCorrect: 0
};

const activeFrameworkEl = document.getElementById("activeFramework");
const frameworkSelectorEl = document.getElementById("frameworkSelector");
const frameworkButtonsWrapEl = document.getElementById("frameworkButtons");
const frameworkDescriptionEl = document.getElementById("frameworkDescription");
const frameworkVisualEl = document.getElementById("frameworkVisual");
const playAreaEl = document.getElementById("playArea");
const scenarioTextEl = document.getElementById("scenarioText");
const perspectiveOptionsEl = document.getElementById("perspectiveOptions");
const submitBtnEl = document.getElementById("submitBtn");
const continueBtnEl = document.getElementById("continueBtn");
const resetBtnEl = document.getElementById("resetBtn");
const feedbackPanelEl = document.getElementById("feedbackPanel");
const answerReviewEl = document.getElementById("answerReview");
const gameOverBannerEl = document.getElementById("gameOverBanner");
const alignmentValueEl = document.getElementById("alignmentValue");
const riskValueEl = document.getElementById("riskValue");
const alignmentFillEl = document.getElementById("alignmentFill");
const riskFillEl = document.getElementById("riskFill");
const sessionModeEl = document.getElementById("sessionMode");
const difficultyModeEl = document.getElementById("difficultyMode");

function resetPerformanceTracking() {
  performanceTracking = {
    totalQuestions: 0,
    cisoCorrect: 0,
    engineerCorrect: 0
  };
}

function getCurrentModeLabel() {
  return sessionLimit ? `${sessionLimit}-question` : "survival";
}

function saveSessionSnapshot() {
  const snapshot = {
    timestamp: Date.now(),
    totalQuestions: performanceTracking.totalQuestions,
    cisoCorrect: performanceTracking.cisoCorrect,
    engineerCorrect: performanceTracking.engineerCorrect,
    alignmentFinal: alignment,
    riskFinal: risk,
    mode: getCurrentModeLabel()
  };

  try {
    const parsedExisting = localStorage.getItem(SESSION_STORAGE_KEY);
    const existing = JSON.parse(parsedExisting) || [];
    const safeExisting = Array.isArray(existing) ? existing : [];
    safeExisting.push(snapshot);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeExisting));
  } catch (_error) {
    // Ignore local storage failures.
  }
}

function clampMeter(value) {
  return Math.max(0, Math.min(100, value));
}

function updateMeters() {
  alignmentValueEl.textContent = `${alignment}%`;
  riskValueEl.textContent = `${risk}%`;
  alignmentFillEl.style.width = `${alignment}%`;
  riskFillEl.style.width = `${risk}%`;
}

function setFeedback(type, message) {
  feedbackPanelEl.textContent = message;
  feedbackPanelEl.classList.remove("correct", "incorrect");
  feedbackPanelEl.style.display = "block";

  void feedbackPanelEl.offsetWidth;
  feedbackPanelEl.classList.add(type);
}

function hideFeedback() {
  feedbackPanelEl.classList.remove("correct", "incorrect");
  feedbackPanelEl.style.display = "none";
}

function clearAnswerReview() {
  if (!answerReviewEl) return;
  answerReviewEl.innerHTML = "";
  answerReviewEl.style.display = "none";
}

function renderAnswerReview(result) {
  if (!answerReviewEl || !result || !result.scenario) return;

  const selected = result.selectedPerspective || "None";
  const correct = result.mostCorrectPerspective || "Unknown";

  answerReviewEl.innerHTML = `
    <p class="answer-review-title">Your Selection:</p>
    <div class="answer-review-row">
      <button type="button" disabled class="arena-submit answer-chip ${result.isCorrect ? "answer-chip-correct" : "answer-chip-incorrect"}">${selected}</button>
      <button type="button" disabled class="arena-submit answer-chip answer-chip-correct">${correct}</button>
    </div>
  `;
  answerReviewEl.style.display = "block";
}

function setControlState({ submitDisabled, perspectiveDisabled, showContinue }) {
  submitBtnEl.disabled = submitDisabled;
  continueBtnEl.style.display = showContinue ? "block" : "none";

  const perspectiveButtons = perspectiveOptionsEl.querySelectorAll(".perspective-btn");
  perspectiveButtons.forEach((button) => {
    button.disabled = perspectiveDisabled;
  });
}

function renderPerspectiveOptions() {
  perspectiveOptionsEl.innerHTML = "";

  PERSPECTIVES.forEach((perspective) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "perspective-btn";
    button.textContent = perspective;

    button.addEventListener("click", () => {
      if (gameOver || awaitingContinue) return;
      selectedPerspective = perspective;
      perspectiveOptionsEl.querySelectorAll(".perspective-btn").forEach((btn) => {
        btn.classList.toggle("active", btn === button);
      });
    });

    perspectiveOptionsEl.appendChild(button);
  });
}

function renderFrameworkButtons() {
  if (!frameworkButtonsWrapEl) return;
  frameworkButtonsWrapEl.innerHTML = "";

  frameworks.forEach((framework) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "framework-btn";
    button.dataset.framework = framework.id;
    button.textContent = framework.name;
    button.disabled = !isDataLoaded;

    button.addEventListener("click", () => {
      selectFramework(framework.id);
    });

    frameworkButtonsWrapEl.appendChild(button);
  });
}

function getConfiguredDifficulty() {
  const configured = (difficultyModeEl?.value || "").trim().toLowerCase();
  if (configured && configured !== "adaptive") {
    return configured;
  }

  return getAdaptiveDifficulty({ alignment, risk, streak: correctStreak });
}

function buildScenarioHeadline(scenario, difficulty) {
  const difficultyLabel = DIFFICULTY_LABELS[difficulty] || DIFFICULTY_LABELS[DIFFICULTY_LEVELS.MEDIUM];
  return `[${difficultyLabel}] ${scenario.prompt}`;
}

function loadScenario() {
  if (gameOver || !scenarioEngine || !activeFramework) return;

  currentDifficulty = getConfiguredDifficulty();
  const scenario = scenarioEngine.nextScenario(currentDifficulty);

  if (!scenario) {
    setFeedback("incorrect", "No scenarios available for this framework.");
    return;
  }

  currentScenario = scenario;
  selectedPerspective = null;
  renderPerspectiveOptions();

  scenarioTextEl.textContent = buildScenarioHeadline(currentScenario, currentScenario.difficulty || currentDifficulty);

  hideFeedback();
  clearAnswerReview();
  awaitingContinue = false;
  setControlState({
    submitDisabled: false,
    perspectiveDisabled: false,
    showContinue: false
  });
}

function applyOutcome(isCorrect, difficulty) {
  const impact = DIFFICULTY_IMPACT[difficulty] || DIFFICULTY_IMPACT[DIFFICULTY_LEVELS.MEDIUM];

  if (isCorrect) {
    alignment = clampMeter(alignment + impact.alignGain);
    risk = clampMeter(risk - impact.riskRelief);
    correctStreak += 1;
  } else {
    alignment = clampMeter(alignment - impact.alignLoss);
    risk = clampMeter(risk + impact.riskGain);
    correctStreak = 0;
  }

  updateMeters();
}

function triggerGameOver(reason = "risk") {
  saveSessionSnapshot();
  resetPerformanceTracking();
  questionsAnswered = 0;
  correctStreak = 0;

  gameOver = true;
  setControlState({
    submitDisabled: true,
    perspectiveDisabled: true,
    showContinue: false
  });

  gameOverBannerEl.textContent = reason === "limit"
    ? "Session complete. Reset the arena to start another run."
    : "Game Over: Risk reached 100%. Reset the arena to try again.";
  gameOverBannerEl.style.display = "block";
}

function endGameIfNeeded() {
  if (risk < 100) return false;
  triggerGameOver();
  return true;
}

function selectFramework(frameworkId) {
  if (!isDataLoaded || !scenarioEngine) {
    activeFrameworkEl.textContent = "Loading Frameworks...";
    return;
  }

  activeFramework = scenarioEngine.selectFramework(frameworkId);
  if (!activeFramework) {
    setFeedback("incorrect", `Unknown framework: ${frameworkId}`);
    return;
  }

  gameOver = false;
  awaitingContinue = false;
  questionsAnswered = 0;
  correctStreak = 0;
  gameOverBannerEl.style.display = "none";

  activeFrameworkEl.textContent = activeFramework.name;
  frameworkDescriptionEl.textContent = activeFramework.description;
  frameworkRenderer(activeFramework.type, activeFramework.renderData, frameworkVisualEl);

  playAreaEl.style.display = "block";
  frameworkSelectorEl.style.display = "none";

  loadScenario();
}

function resetGame() {
  activeFramework = null;
  currentScenario = null;
  selectedPerspective = null;

  alignment = 50;
  risk = 0;
  gameOver = false;
  awaitingContinue = false;
  questionsAnswered = 0;
  correctStreak = 0;
  resetPerformanceTracking();

  activeFrameworkEl.textContent = isDataLoaded ? "Not Selected" : "Loading Frameworks...";
  frameworkSelectorEl.style.display = "block";
  playAreaEl.style.display = "none";

  hideFeedback();
  clearAnswerReview();
  setControlState({
    submitDisabled: false,
    perspectiveDisabled: false,
    showContinue: false
  });
  gameOverBannerEl.style.display = "none";

  updateMeters();
}

function updateSessionMode() {
  if (!sessionModeEl) {
    sessionLimit = null;
    return;
  }

  const parsedLimit = Number.parseInt(sessionModeEl.value, 10);
  sessionLimit = Number.isNaN(parsedLimit) ? null : parsedLimit;
  questionsAnswered = 0;
}

async function loadFrameworkData() {
  activeFrameworkEl.textContent = "Loading Frameworks...";

  try {
    frameworks = withCalibratedDifficulty(await loadFrameworkPlugins(FRAMEWORK_MANIFEST_URL));
    scenarioEngine = new ScenarioEngine(frameworks);

    isDataLoaded = true;
    activeFrameworkEl.textContent = "Not Selected";
    renderFrameworkButtons();
  } catch (error) {
    isDataLoaded = false;
    activeFrameworkEl.textContent = "Load Error";
    setFeedback("incorrect", `Unable to load framework plugins. ${error.message}`);
  }
}

submitBtnEl.addEventListener("click", () => {
  if (gameOver || !activeFramework || awaitingContinue || !scenarioEngine) return;

  if (!selectedPerspective) {
    setFeedback("incorrect", "Select a perspective before submitting.");
    return;
  }

  const result = scenarioEngine.evaluate(selectedPerspective);
  renderAnswerReview(result);

  questionsAnswered += 1;
  performanceTracking.totalQuestions += 1;
  if (result.isCorrect) {
    performanceTracking.cisoCorrect += 1;
  }

  setFeedback(result.isCorrect ? "correct" : "incorrect", buildExplanation(result));
  applyOutcome(result.isCorrect, currentScenario?.difficulty || currentDifficulty);

  if (endGameIfNeeded()) return;
  if (sessionLimit && questionsAnswered >= sessionLimit) {
    triggerGameOver("limit");
    return;
  }

  awaitingContinue = true;
  setControlState({
    submitDisabled: true,
    perspectiveDisabled: true,
    showContinue: true
  });
});

continueBtnEl.addEventListener("click", () => {
  if (gameOver || !awaitingContinue) return;
  loadScenario();
});

resetBtnEl.addEventListener("click", resetGame);
if (sessionModeEl) {
  sessionModeEl.addEventListener("change", updateSessionMode);
}
if (difficultyModeEl) {
  difficultyModeEl.addEventListener("change", () => {
    if (activeFramework && !awaitingContinue && !gameOver) {
      loadScenario();
    }
  });
}

updateMeters();
updateSessionMode();
renderPerspectiveOptions();
loadFrameworkData();
