const SCENARIOS_URL = "./scenarios.json";
const DEFAULT_MINDSET = "ciso";
const SESSION_STORAGE_KEY = "cisoArenaSessions";

let scenariosByFramework = {
  SABSA: [],
  TOGAF: [],
  Zachman: [],
  ITIL: []
};

let selectedFramework = null;
let currentScenario = null;
let currentAnswerKey = null;
let frameworkQueue = [];
let layerPool = [];
let rolePool = [];

let alignment = 50;
let risk = 0;
let gameOver = false;
let awaitingContinue = false;
let isDataLoaded = false;
let sessionLimit = null;
let questionsAnswered = 0;
let performanceTracking = {
  totalQuestions: 0,
  cisoCorrect: 0,
  engineerCorrect: 0
};

const activeFrameworkEl = document.getElementById("activeFramework");
const frameworkSelectorEl = document.getElementById("frameworkSelector");
const playAreaEl = document.getElementById("playArea");
const scenarioTextEl = document.getElementById("scenarioText");
const layerSelectEl = document.getElementById("layerSelect");
const roleSelectEl = document.getElementById("roleSelect");
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
const frameworkButtons = Array.from(document.querySelectorAll(".framework-btn"));
const sessionModeEl = document.getElementById("sessionMode");

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

    console.debug("Session saved:", snapshot);
    console.debug("Storage now contains:", localStorage.getItem(SESSION_STORAGE_KEY));
    if (localStorage.getItem(SESSION_STORAGE_KEY) === null) {
      console.error("Session persistence failed.");
    }
  } catch (error) {
    console.error("Session persistence failed.");
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

  // Force animation restart before applying the new state class.
  void feedbackPanelEl.offsetWidth;
  feedbackPanelEl.classList.add(type);
}

function fisherYatesShuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyCasePattern(source, replacement) {
  if (!source || !replacement) return replacement;
  if (source === source.toUpperCase()) return replacement.toUpperCase();
  const first = source.charAt(0);
  if (first === first.toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function sanitizeGeneratedText(text) {
  text = text.replace(/\b(\w+)\s+\1\b/gi, "$1");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

function generateScenarioText(baseScenario, synonyms) {
  if (!synonyms || typeof synonyms !== "object") {
    return baseScenario;
  }

  let finalText = baseScenario;
  const entries = Object.entries(synonyms);

  entries.forEach(([term, alternatives]) => {
    if (!term || !Array.isArray(alternatives) || alternatives.length === 0) {
      return;
    }

    const replacement = randomItem(alternatives);
    const pattern = new RegExp(escapeRegExp(term), "gi");
    finalText = finalText.replace(pattern, (matched) => applyCasePattern(matched, replacement));
  });

  return sanitizeGeneratedText(finalText);
}

function populateSelect(selectEl, options, placeholder) {
  selectEl.innerHTML = "";
  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholder;
  selectEl.appendChild(placeholderOption);

  options.forEach((item) => {
    const optionEl = document.createElement("option");
    optionEl.value = item;
    optionEl.textContent = item;
    selectEl.appendChild(optionEl);
  });
}

function buildOptionSet(correctValue, pool, size = 4) {
  const uniquePool = [...new Set(pool)];
  const distractors = uniquePool.filter((value) => value !== correctValue);
  const selectedDistractors = fisherYatesShuffle(distractors).slice(0, Math.max(0, size - 1));
  return fisherYatesShuffle([correctValue, ...selectedDistractors]);
}

function buildQueueForFramework(framework) {
  const list = scenariosByFramework[framework] || [];
  frameworkQueue = fisherYatesShuffle(list.map((_, index) => index));
}

function consumeNextScenario() {
  if (!selectedFramework) return null;

  if (frameworkQueue.length === 0) {
    buildQueueForFramework(selectedFramework);
  }

  if (frameworkQueue.length === 0) return null;
  const nextIndex = frameworkQueue.pop();
  return scenariosByFramework[selectedFramework][nextIndex] || null;
}

function setControlState({ submitDisabled, layerDisabled, roleDisabled, showContinue }) {
  submitBtnEl.disabled = submitDisabled;
  layerSelectEl.disabled = layerDisabled;
  roleSelectEl.disabled = roleDisabled;
  continueBtnEl.style.display = showContinue ? "block" : "none";
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

function buildAnswerChip(text, chipClass) {
  const button = document.createElement("button");
  button.type = "button";
  button.disabled = true;
  button.className = `arena-submit answer-chip ${chipClass}`;
  button.textContent = text;
  return button;
}

function renderAnswerReview({ selectedLayer, selectedRole, correctLayer, correctRole }) {
  if (!answerReviewEl) return;

  answerReviewEl.innerHTML = "";

  const yourSelectionTitle = document.createElement("p");
  yourSelectionTitle.className = "answer-review-title";
  yourSelectionTitle.textContent = "Your Selection:";
  answerReviewEl.appendChild(yourSelectionTitle);

  const yourSelectionRow = document.createElement("div");
  yourSelectionRow.className = "answer-review-row";
  yourSelectionRow.appendChild(buildAnswerChip(
    selectedLayer,
    selectedLayer === correctLayer ? "answer-chip-correct" : "answer-chip-incorrect"
  ));
  yourSelectionRow.appendChild(buildAnswerChip(
    selectedRole,
    selectedRole === correctRole ? "answer-chip-correct" : "answer-chip-incorrect"
  ));
  answerReviewEl.appendChild(yourSelectionRow);

  const correctSelectionTitle = document.createElement("p");
  correctSelectionTitle.className = "answer-review-title";
  correctSelectionTitle.textContent = "Correct Selection:";
  answerReviewEl.appendChild(correctSelectionTitle);

  const correctSelectionRow = document.createElement("div");
  correctSelectionRow.className = "answer-review-row";
  correctSelectionRow.appendChild(buildAnswerChip(correctLayer, "answer-chip-correct"));
  correctSelectionRow.appendChild(buildAnswerChip(correctRole, "answer-chip-correct"));
  answerReviewEl.appendChild(correctSelectionRow);

  answerReviewEl.style.display = "block";
}

function getCurrentMindset() {
  const params = new URLSearchParams(window.location.search);
  const requested = (params.get("mindset") || "").trim().toLowerCase();
  return requested === "engineer" ? "engineer" : DEFAULT_MINDSET;
}

function getAnswerKeyForMindset(scenario, mindset) {
  if (mindset === "engineer" && scenario.engineerCorrect) {
    return scenario.engineerCorrect;
  }
  return scenario.cisoCorrect;
}

function loadScenario() {
  if (gameOver || !selectedFramework) return;

  const nextScenario = consumeNextScenario();
  if (!nextScenario) {
    setFeedback("incorrect", "No scenarios available for this framework.");
    return;
  }

  currentScenario = nextScenario;
  const mindset = getCurrentMindset();
  currentAnswerKey = getAnswerKeyForMindset(currentScenario, mindset);

  const scenarioText = generateScenarioText(currentScenario.baseScenario, currentScenario.synonyms);
  scenarioTextEl.textContent = scenarioText;

  const layers = buildOptionSet(currentAnswerKey.layer, layerPool, 4);
  const roles = buildOptionSet(currentAnswerKey.role, rolePool, 4);

  populateSelect(layerSelectEl, layers, "Select a layer/phase...");
  populateSelect(roleSelectEl, roles, "Select a role...");

  hideFeedback();
  clearAnswerReview();
  awaitingContinue = false;
  setControlState({
    submitDisabled: false,
    layerDisabled: false,
    roleDisabled: false,
    showContinue: false
  });
}

function applyOutcome(isCorrect) {
  if (isCorrect) {
    alignment = clampMeter(alignment + 10);
    risk = clampMeter(risk - 5);
  } else {
    alignment = clampMeter(alignment - 10);
    risk = clampMeter(risk + 15);
  }
  updateMeters();
}

function triggerGameOver(reason = "risk") {
  saveSessionSnapshot();
  resetPerformanceTracking();
  questionsAnswered = 0;

  gameOver = true;
  setControlState({
    submitDisabled: true,
    layerDisabled: true,
    roleDisabled: true,
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

function selectFramework(name) {
  if (!isDataLoaded) {
    activeFrameworkEl.textContent = "Loading Scenarios...";
    return;
  }

  selectedFramework = name;
  gameOver = false;
  awaitingContinue = false;
  questionsAnswered = 0;
  gameOverBannerEl.style.display = "none";

  const scenarios = scenariosByFramework[name] || [];
  layerPool = [...new Set(
    scenarios.flatMap((scenario) => [
      scenario.cisoCorrect.layer,
      scenario.engineerCorrect.layer
    ])
  )];
  rolePool = [...new Set(
    scenarios.flatMap((scenario) => [
      scenario.cisoCorrect.role,
      scenario.engineerCorrect.role
    ])
  )];

  buildQueueForFramework(name);

  activeFrameworkEl.textContent = selectedFramework;
  playAreaEl.style.display = "block";
  frameworkSelectorEl.style.display = "none";

  loadScenario();
}

function resetGame() {
  selectedFramework = null;
  currentScenario = null;
  currentAnswerKey = null;
  frameworkQueue = [];
  layerPool = [];
  rolePool = [];

  alignment = 50;
  risk = 0;
  gameOver = false;
  awaitingContinue = false;
  questionsAnswered = 0;
  resetPerformanceTracking();

  activeFrameworkEl.textContent = isDataLoaded ? "Not Selected" : "Loading Scenarios...";
  frameworkSelectorEl.style.display = "block";
  playAreaEl.style.display = "none";

  hideFeedback();
  clearAnswerReview();
  setControlState({
    submitDisabled: false,
    layerDisabled: false,
    roleDisabled: false,
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

const explanationEngine = {
  "role-layer mismatch": {
    correct: "Role and layer are correctly paired. Each framework layer has a designated accountable owner; misaligning them breaks governance structure.",
    wrong: "Role and layer must pair correctly. Each framework layer has one accountable owner. Crossing them misrepresents governance accountability."
  },
  "execution-stage bait": {
    correct: "The scenario requires a strategic decision, not execution. You stayed above the operational layer where accountability lives.",
    wrong: "Execution-stage language is a distractor. Strategic decisions precede implementation. The accountable layer sits above where work gets done."
  },
  "governance-vs-delivery confusion": {
    correct: "Governance and delivery are separated by design. You identified the accountable governance layer, not the delivery function below it.",
    wrong: "Delivery roles execute; governance roles decide. The scenario requires the accountable decision-maker, not the team closest to implementation."
  },
  "ownership ambiguity": {
    correct: "Ambiguous ownership defaults to accountability, not capability. You selected the role with formal governance authority over this decision.",
    wrong: "When ownership is unclear, choose accountability over proximity. CISSP assigns decisions to the formally accountable role, not the nearest team."
  },
  "artifact-driven misdirection": {
    correct: "Artifacts are governed at the layer that authorizes them, not the layer that produces them. Strategic ownership is correct here.",
    wrong: "The artifact type signals its governance layer, not its production layer. Accountable ownership lives above where the artifact is built."
  },
  "strategy-vs-operations blend": {
    correct: "You separated strategic intent from operational execution. Direction-setting belongs at the governance layer, not the implementation layer.",
    wrong: "Strategic and operational roles are distinct. This scenario describes direction-setting, not execution. Governance authority sits at the strategic layer."
  }
};

const FALLBACK_EXPLANATION = "Strategic alignment determines correct framework placement.";

function validateAnswer(selectedLayer, selectedRole, mindset) {
  if (!currentScenario || !currentAnswerKey) {
    return { isCorrect: false, message: "No active scenario. Select a framework first." };
  }

  const answerKey = getAnswerKeyForMindset(currentScenario, mindset);
  const layerCorrect = selectedLayer === answerKey.layer;
  const roleCorrect = selectedRole === answerKey.role;
  const isCorrect = layerCorrect && roleCorrect;

  const trapMessages = explanationEngine[currentScenario.trapType];

  if (isCorrect) {
    return {
      isCorrect: true,
      message: trapMessages ? trapMessages.correct : FALLBACK_EXPLANATION
    };
  }

  return {
    isCorrect: false,
    message: trapMessages ? trapMessages.wrong : FALLBACK_EXPLANATION
  };
}

async function loadScenarioData() {
  frameworkButtons.forEach((btn) => {
    btn.disabled = true;
  });
  activeFrameworkEl.textContent = "Loading Scenarios...";

  try {
    const response = await fetch(SCENARIOS_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load scenarios (${response.status})`);
    }

    const rawScenarios = await response.json();

    scenariosByFramework = {
      SABSA: [],
      TOGAF: [],
      Zachman: [],
      ITIL: []
    };

    rawScenarios.forEach((scenario) => {
      if (scenariosByFramework[scenario.framework]) {
        scenariosByFramework[scenario.framework].push(scenario);
      }
    });

    isDataLoaded = true;
    activeFrameworkEl.textContent = "Not Selected";
    frameworkButtons.forEach((btn) => {
      btn.disabled = false;
    });
  } catch (error) {
    isDataLoaded = false;
    activeFrameworkEl.textContent = "Load Error";
    frameworkButtons.forEach((btn) => {
      btn.disabled = true;
    });

    setFeedback("incorrect", `Unable to load scenario data. ${error.message}`);
  }
}

frameworkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectFramework(button.dataset.framework);
  });
});

submitBtnEl.addEventListener("click", () => {
  if (gameOver || !selectedFramework || awaitingContinue) return;

  const selectedLayer = layerSelectEl.value;
  const selectedRole = roleSelectEl.value;

  if (!selectedLayer || !selectedRole) {
    setFeedback("incorrect", "Select both Layer/Phase and Role before submitting.");
    return;
  }

  const mindset = getCurrentMindset();
  const result = validateAnswer(selectedLayer, selectedRole, mindset);
  const answerKey = getAnswerKeyForMindset(currentScenario, mindset);
  renderAnswerReview({
    selectedLayer,
    selectedRole,
    correctLayer: answerKey.layer,
    correctRole: answerKey.role
  });

  questionsAnswered += 1;
  performanceTracking.totalQuestions += 1;
  if (result.isCorrect) {
    if (mindset === "engineer") {
      performanceTracking.engineerCorrect += 1;
    } else {
      performanceTracking.cisoCorrect += 1;
    }
  }

  setFeedback(result.isCorrect ? "correct" : "incorrect", result.message);
  applyOutcome(result.isCorrect);

  if (endGameIfNeeded()) return;
  if (sessionLimit && questionsAnswered >= sessionLimit) {
    triggerGameOver();
    return;
  }

  awaitingContinue = true;
  setControlState({
    submitDisabled: true,
    layerDisabled: true,
    roleDisabled: true,
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

updateMeters();
updateSessionMode();
loadScenarioData();
