"use strict";

const scenarios = [
  {
    text: "A SaaS provider publishes a completed CAIQ and a self-asserted CCM mapping for customers to review.",
    level: 1,
    rationale: "This is provider self-assessment disclosure, which aligns to STAR Level 1."
  },
  {
    text: "A cloud host undergoes an independent certification audit against cloud control criteria and publishes the result.",
    level: 2,
    rationale: "Independent third-party audit/certification activity maps to STAR Level 2."
  },
  {
    text: "A customer can view near-real-time control monitoring evidence through an always-on assurance feed.",
    level: 3,
    rationale: "Continuous or near-real-time assurance is the defining idea of STAR Level 3."
  },
  {
    text: "Security leadership asks only for supplier-completed questionnaires with no outside validation.",
    level: 1,
    rationale: "Questionnaire-only, self-declared evidence fits STAR Level 1."
  },
  {
    text: "A provider submits to a recurring third-party attestation that is then shared with enterprise clients.",
    level: 2,
    rationale: "Third-party attestation sits in STAR Level 2."
  },
  {
    text: "An enterprise requires machine-driven, continuous control checks rather than annual point-in-time reviews.",
    level: 3,
    rationale: "Continuous checking is STAR Level 3."
  },
  {
    text: "The vendor posts answers about cloud governance and compliance in a public registry completed by its own team.",
    level: 1,
    rationale: "Public self-disclosure without external testing is STAR Level 1."
  },
  {
    text: "Procurement requires evidence that an accredited outside assessor evaluated cloud controls.",
    level: 2,
    rationale: "Outside assessor evidence means STAR Level 2."
  },
  {
    text: "Board reporting depends on a permanent assurance pipeline with rolling cloud-control validation.",
    level: 3,
    rationale: "Permanent assurance and rolling validation are STAR Level 3 characteristics."
  }
];

const progressTextEl = document.getElementById("progressText");
const scoreTextEl = document.getElementById("scoreText");
const scenarioTextEl = document.getElementById("scenarioText");
const feedbackPanelEl = document.getElementById("feedbackPanel");
const nextBtnEl = document.getElementById("nextBtn");
const restartBtnEl = document.getElementById("restartBtn");
const levelButtons = Array.from(document.querySelectorAll(".star-level-btn"));

let deck = [];
let currentIndex = 0;
let score = 0;
let isAnswered = false;

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function updateMeta() {
  const scenarioNumber = Math.min(currentIndex + 1, deck.length);
  progressTextEl.textContent = `Scenario ${scenarioNumber} of ${deck.length}`;
  scoreTextEl.textContent = `Score: ${score}`;
}

function clearButtonState() {
  levelButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "incorrect");
  });
}

function showScenario() {
  if (currentIndex >= deck.length) {
    scenarioTextEl.textContent = `Session complete. Final score: ${score}/${deck.length}.`;
    feedbackPanelEl.classList.add("visible");
    feedbackPanelEl.textContent = "Use Restart to run a fresh shuffled set.";
    levelButtons.forEach((button) => {
      button.disabled = true;
      button.classList.remove("correct", "incorrect");
    });
    nextBtnEl.disabled = true;
    updateMeta();
    return;
  }

  const current = deck[currentIndex];
  scenarioTextEl.textContent = current.text;
  feedbackPanelEl.classList.remove("visible");
  feedbackPanelEl.textContent = "";
  nextBtnEl.disabled = true;
  isAnswered = false;
  clearButtonState();
  updateMeta();
}

function markAnswers(selectedLevel) {
  const current = deck[currentIndex];
  const correctLevel = current.level;

  levelButtons.forEach((button) => {
    const buttonLevel = Number(button.dataset.level);
    button.disabled = true;
    if (buttonLevel === correctLevel) {
      button.classList.add("correct");
    } else if (buttonLevel === selectedLevel) {
      button.classList.add("incorrect");
    }
  });

  if (selectedLevel === correctLevel) {
    score += 1;
    feedbackPanelEl.textContent = `Correct. ${current.rationale}`;
  } else {
    feedbackPanelEl.textContent = `Not quite. Correct answer: Level ${correctLevel}. ${current.rationale}`;
  }

  feedbackPanelEl.classList.add("visible");
  nextBtnEl.disabled = false;
  isAnswered = true;
  updateMeta();
}

function startSession() {
  deck = shuffle(scenarios);
  currentIndex = 0;
  score = 0;
  isAnswered = false;
  showScenario();
}

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isAnswered || currentIndex >= deck.length) return;
    markAnswers(Number(button.dataset.level));
  });
});

nextBtnEl.addEventListener("click", () => {
  if (!isAnswered) return;
  currentIndex += 1;
  showScenario();
});

restartBtnEl.addEventListener("click", startSession);

startSession();
