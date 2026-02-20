const STORAGE_KEY = "cissp_cat_session_v2";
const RECENT_ITEMS_KEY = "cissp_cat_recent_items_v1";
const RECENT_ITEMS_MAX = 350;
const EXAM_DURATION_SEC = 3 * 60 * 60;
const AUTOSTART_KEY = "cissp_cat_autostart";
const AUTORESUME_KEY = "cissp_cat_autoresume";
const FORCED_MODE = document.body.dataset.mode === "cat" || document.body.dataset.mode === "fixed"
  ? document.body.dataset.mode
  : null;
const PAGE_VIEW = document.body.dataset.view || "setup";

const DOMAIN_BLUEPRINT = [
  { name: "1. Security and Risk Management", pct: 16 },
  { name: "2. Asset Security", pct: 10 },
  { name: "3. Security Architecture and Engineering", pct: 13 },
  { name: "4. Communication and Network Security", pct: 13 },
  { name: "5. Identity and Access Management (IAM)", pct: 13 },
  { name: "6. Security Assessment and Testing", pct: 12 },
  { name: "7. Security Operations", pct: 13 },
  { name: "8. Software Development Security", pct: 10 },
];

const ui = {
  setupPanel: document.getElementById("setupPanel"),
  customQuizControls: document.getElementById("customQuizControls"),
  questionPanel: document.getElementById("questionPanel"),
  statsPanel: document.getElementById("statsPanel"),
  resultsPanel: document.getElementById("resultsPanel"),
  minQuestions: document.getElementById("minQuestions"),
  maxQuestions: document.getElementById("maxQuestions"),
  fixedQuestionCount: document.getElementById("fixedQuestionCount"),
  timedQuiz: document.getElementById("timedQuiz"),
  showRunningScore: document.getElementById("showRunningScore"),
  instantFeedback: document.getElementById("instantFeedback"),
  timingScaleNote: document.getElementById("timingScaleNote"),
  modeCat: document.getElementById("modeCat"),
  modeCustom: document.getElementById("modeCustom"),
  domainTargetPanel: document.getElementById("domainTargetPanel"),
  modeSummaryText: document.getElementById("modeSummaryText"),
  hideMetricsPanel: document.getElementById("hideMetricsPanel"),
  statsContent: document.getElementById("statsContent"),
  domainSelectionSummary: document.getElementById("domainSelectionSummary"),
  showTechnicalMetrics: document.getElementById("showTechnicalMetrics"),
  metric1Label: document.getElementById("metric1Label"),
  metric2Label: document.getElementById("metric2Label"),
  metric3Label: document.getElementById("metric3Label"),
  metric4Label: document.getElementById("metric4Label"),
  metric5Label: document.getElementById("metric5Label"),
  metric6Label: document.getElementById("metric6Label"),
  catMimicNote: document.getElementById("catMimicNote"),
  bankStatus: document.getElementById("bankStatus"),
  startBtn: document.getElementById("startBtn"),
  resumeBtn: document.getElementById("resumeBtn"),
  sessionInfoBtn: document.getElementById("sessionInfoBtn"),
  saveResultsBtn: document.getElementById("saveResultsBtn"),
  progressText: document.getElementById("progressText"),
  domainText: document.getElementById("domainText"),
  difficultyText: document.getElementById("difficultyText"),
  scoreText: document.getElementById("scoreText"),
  timerText: document.getElementById("timerText"),
  questionTimerText: document.getElementById("questionTimerText"),
  avgQuestionTimeText: document.getElementById("avgQuestionTimeText"),
  scoredTrackerText: document.getElementById("scoredTrackerText"),
  unscoredRuleText: document.getElementById("unscoredRuleText"),
  ciStopText: document.getElementById("ciStopText"),
  questionStem: document.getElementById("questionStem"),
  choicesForm: document.getElementById("choicesForm"),
  submitAnswerBtn: document.getElementById("submitAnswerBtn"),
  feedbackText: document.getElementById("feedbackText"),
  thetaText: document.getElementById("thetaText"),
  seText: document.getElementById("seText"),
  ciText: document.getElementById("ciText"),
  scaledText: document.getElementById("scaledText"),
  passProbText: document.getElementById("passProbText"),
  guessSignalText: document.getElementById("guessSignalText"),
  progressGraph: document.getElementById("progressGraph"),
  graphAllBtn: document.getElementById("graphAllBtn"),
  graphIncorrectBtn: document.getElementById("graphIncorrectBtn"),
  finalSummary: document.getElementById("finalSummary"),
  outcomeBanner: document.getElementById("outcomeBanner"),
  domainBreakdown: document.getElementById("domainBreakdown"),
  domainStrengthChart: document.getElementById("domainStrengthChart"),
  analyticsNotes: document.getElementById("analyticsNotes"),
  reviewAllBtn: document.getElementById("reviewAllBtn"),
  reviewIncorrectBtn: document.getElementById("reviewIncorrectBtn"),
  explanationReview: document.getElementById("explanationReview"),
  reviewText: document.getElementById("reviewText"),
  reviewTableBody: document.querySelector("#reviewTable tbody"),
  domainTargetGrid: document.getElementById("domainTargetGrid"),
};

const app = {
  bank: null,
  attempt: null,
  timerInterval: null,
  domainSelectorMap: new Map(),
  graphFilter: "all",
  reviewFilter: "all",
  recentItemIds: [],
};

function loadRecentItemIds() {
  try {
    const raw = localStorage.getItem(RECENT_ITEMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return Array.from(new Set(parsed.map((x) => String(x)))).slice(-RECENT_ITEMS_MAX);
  } catch {
    return [];
  }
}

function saveRecentItemIds(ids) {
  try {
    localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(ids.slice(-RECENT_ITEMS_MAX)));
  } catch {
    // Best-effort only.
  }
}

function rememberRecentItem(id) {
  if (!id) return;
  const key = String(id);
  const next = app.recentItemIds.filter((x) => x !== key);
  next.push(key);
  app.recentItemIds = next.slice(-RECENT_ITEMS_MAX);
  saveRecentItemIds(app.recentItemIds);
}

function filterRecentlySeen(items, minPool = 80) {
  const recent = new Set(app.recentItemIds);
  const fresh = items.filter((item) => !recent.has(String(item.id)));
  return fresh.length >= Math.min(minPool, items.length) ? fresh : items;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function logistic(z) {
  return 1 / (1 + Math.exp(-z));
}

function erfApprox(x) {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * absX);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX));
  return sign * y;
}

function normalCdf(x) {
  return 0.5 * (1 + erfApprox(x / Math.sqrt(2)));
}

function thetaToScaled(theta) {
  const scaled = 100 + ((theta + 3) / 6) * 900;
  return clamp(scaled, 100, 1000);
}

function scaledToTheta(score) {
  return ((score - 100) / 900) * 6 - 3;
}

// Returns the lower-asymptote (guessing) parameter appropriate for the item type.
// MCQ: c ≈ 0.25 (1-in-4 chance on a 4-choice item).
// PBQ/drag-drop/ordering/hotspot: c = 0 — random placement has no fixed floor,
// so the model reduces to 2PL (unbiased ability estimation for performance tasks).
function itemGuessingParam(item) {
  const type = item.type ?? "mcq";
  if (type === "mcq") return item.guessing ?? 0.25;
  return 0;
}

function itemProbability(theta, item) {
  const a = item.discrimination ?? 1;
  const c = itemGuessingParam(item);
  const p2pl = logistic(a * (theta - item.difficulty));
  return c + (1 - c) * p2pl;
}

function itemInformation(theta, item) {
  const a = item.discrimination ?? 1;
  const c = itemGuessingParam(item);
  const p = itemProbability(theta, item);
  // 3PL Fisher information — with c=0 this reduces cleanly to 2PL for PBQ items.
  // Formula: a²·(P−c)²·(1−P) / ((1−c)²·P)
  return (a * a * Math.pow(p - c, 2) * (1 - p)) / (Math.pow(1 - c, 2) * Math.max(p, 1e-9));
}

function summarizeDomainStats(itemsAnswered) {
  const map = new Map();
  for (const row of itemsAnswered) {
    const existing = map.get(row.domain) ?? { total: 0, correct: 0, scored: 0 };
    existing.total += 1;
    if (row.correct) existing.correct += 1;
    if (row.scored) existing.scored += 1;
    map.set(row.domain, existing);
  }
  return map;
}

function formatSeconds(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function validateBank(bank) {
  if (!bank || !Array.isArray(bank.items) || bank.items.length < 8) {
    throw new Error("Bank must include at least 8 items.");
  }

  const seen = new Set();
  for (const item of bank.items) {
    if (!item.id || !item.domain || !item.stem) {
      throw new Error("Each item needs id, domain, and stem.");
    }
    if (seen.has(item.id)) {
      throw new Error(`Duplicate item id: ${item.id}`);
    }
    seen.add(item.id);

    if (!Array.isArray(item.choices) || item.choices.length < 2) {
      throw new Error(`Item ${item.id} needs at least 2 choices.`);
    }
    if (typeof item.correctIndex !== "number" || item.correctIndex < 0 || item.correctIndex >= item.choices.length) {
      throw new Error(`Item ${item.id} has invalid correctIndex.`);
    }

    item.difficulty = typeof item.difficulty === "number" ? clamp(item.difficulty, -3, 3) : 0;
    item.discrimination = typeof item.discrimination === "number" ? clamp(item.discrimination, 0.3, 2.5) : 1;

    // questionType: "knowledge" = recall/definition, "scenario" = applied context,
    // "judgment" = best-answer ambiguity requiring managerial risk thinking.
    // Existing banks without this field default to "scenario" (neutral).
    const KNOWN_QTYPES = ["knowledge", "scenario", "judgment"];
    item.questionType = KNOWN_QTYPES.includes(item.questionType) ? item.questionType : "scenario";

    // judgmentLevel 1-3: how much managerial ambiguity the item carries.
    // 1 = one clearly correct answer, 2 = plausible distractors, 3 = best-answer
    // where multiple options are defensible to someone with knowledge but not judgment.
    // Defaults based on questionType if not explicitly set.
    if (typeof item.judgmentLevel !== "number" || item.judgmentLevel < 1 || item.judgmentLevel > 3) {
      item.judgmentLevel = item.questionType === "judgment" ? 3 : item.questionType === "scenario" ? 2 : 1;
    }

    // impliedKnowledge: true for questions testing industry consensus or cross-domain
    // insight not found in standard study guides. ISC2 deliberately includes these
    // to separate experienced practitioners from pure test-preppers.
    item.impliedKnowledge = item.impliedKnowledge === true;

    // Normalize item type. Unknown types fall back to "mcq" so existing banks load cleanly.
    const KNOWN_TYPES = ["mcq", "dragdrop", "ordering", "hotspot"];
    item.type = KNOWN_TYPES.includes(item.type) ? item.type : "mcq";

    // PBQ items: enforce c=0 and validate polytomous schema when maxScore > 1.
    // maxScore > 1 signals GPCM partial credit — requires a thresholds[] array
    // of length maxScore (one threshold per scoring step). Without it, fall back
    // to dichotomous scoring so the exam can still run.
    if (item.type !== "mcq") {
      item.guessing = 0;
      if (typeof item.maxScore === "number" && item.maxScore > 1) {
        if (!Array.isArray(item.thresholds) || item.thresholds.length !== item.maxScore) {
          console.warn(`Item ${item.id}: polytomous PBQ (maxScore=${item.maxScore}) missing valid thresholds[]. Falling back to dichotomous scoring.`);
          item.maxScore = 1;
        }
      } else {
        item.maxScore = 1;
      }
    } else {
      item.maxScore = 1;
    }
  }
}

function shuffleChoicesForItem(item) {
  const indexed = item.choices.map((choice, idx) => ({ choice, idx }));
  for (let i = indexed.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = indexed[i];
    indexed[i] = indexed[j];
    indexed[j] = tmp;
  }

  const newChoices = indexed.map((x) => x.choice);
  const newCorrectIndex = indexed.findIndex((x) => x.idx === item.correctIndex);
  return {
    ...item,
    choices: newChoices,
    correctIndex: newCorrectIndex,
  };
}

function getDefaultConfig() {
  return {
    mode: "cat",
    minQuestions: 100,
    maxQuestions: 150,
    fixedQuestionCount: 75,
    timedQuiz: true,
    ciStopWidth: 0.75,
    startTheta: 0,
    showRunningScore: false,
    instantFeedback: false,
    selectedDomains: [],
  };
}

function saveSession() {
  if (!app.bank || !app.attempt) return;
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      bank: app.bank,
      attempt: app.attempt,
    })
  );
  refreshResumeVisibility();
}

function loadSession() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearSession() {
  sessionStorage.removeItem(STORAGE_KEY);
  app.attempt = null;
  stopTickers();
  refreshResumeVisibility();
}

function refreshResumeVisibility() {
  if (!ui.resumeBtn) return;
  ui.resumeBtn.classList.toggle("hidden", !loadSession());
}

function getConfigFromUi() {
  const defaults = getDefaultConfig();
  const mode = getSelectedMode();
  const fixedQuestionCount = clamp(Number(ui.fixedQuestionCount?.value) || defaults.fixedQuestionCount, 1, 200);
  const minQuestions = mode === "cat" ? defaults.minQuestions : fixedQuestionCount;
  const maxQuestions = mode === "cat" ? defaults.maxQuestions : fixedQuestionCount;
  const ciStopWidth = defaults.ciStopWidth;
  const startTheta = defaults.startTheta;
  const timedQuiz = mode === "cat" ? true : Boolean(ui.timedQuiz?.checked);
  const showRunningScore = mode === "cat" ? true : Boolean(ui.showRunningScore?.checked);
  const instantFeedback = mode === "cat" ? false : Boolean(ui.instantFeedback?.checked);
  const selectedDomains = getSelectedDomains();

  if (mode === "fixed" && selectedDomains.length === 0) {
    throw new Error("Select at least one domain for Custom Quiz mode.");
  }

  return { mode, minQuestions, maxQuestions, fixedQuestionCount, timedQuiz, ciStopWidth, startTheta, showRunningScore, instantFeedback, selectedDomains };
}

function getCanonicalDomainName(domain) {
  const raw = String(domain || "").trim();
  const hit = DOMAIN_BLUEPRINT.find((d) => d.name.toLowerCase() === raw.toLowerCase());
  return hit ? hit.name : domain;
}
function normalizeDomainName(domain) {
  const raw = String(domain || "").trim();
  const exact = DOMAIN_BLUEPRINT.find((d) => d.name.toLowerCase() === raw.toLowerCase());
  if (exact) return exact.name;

  const m = raw.match(/^([1-8])\b/);
  if (m) {
    const prefix = `${m[1]}.`;
    const byPrefix = DOMAIN_BLUEPRINT.find((d) => d.name.startsWith(prefix));
    if (byPrefix) return byPrefix.name;
  }

  return raw;
}

function difficultyBand(difficulty) {
  if (difficulty <= -0.6) return "Easy";
  if (difficulty >= 0.7) return "Hard";
  return "Medium";
}

function getSelectedDomains() {
  return Array.from(app.domainSelectorMap.entries())
    .filter(([, ref]) => ref.checkbox.checked)
    .map(([domain]) => domain);
}

function updateDomainSelectionSummary() {
  if (!ui.domainSelectionSummary) return;
  const selected = getSelectedDomains().length;
  ui.domainSelectionSummary.textContent = `Custom quiz uses selected domains only. Selected: ${selected}`;
}

function getSelectedMode() {
  if (FORCED_MODE) return FORCED_MODE;
  return ui.modeCat?.checked ? "cat" : "fixed";
}

function getCustomDurationSec(questionCount, timedQuiz) {
  if (!timedQuiz) return null;
  const ratio = questionCount >= 100 ? 1 : questionCount / 100;
  return Math.round(EXAM_DURATION_SEC * ratio);
}

function refreshCustomTimingNote() {
  if (!ui.timingScaleNote) return;
  const count = clamp(Number(ui.fixedQuestionCount?.value) || 75, 1, 200);
  const timed = Boolean(ui.timedQuiz?.checked);
  if (!timed) {
    ui.timingScaleNote.textContent = "Timer is OFF for this custom quiz.";
    return;
  }
  const durationSec = getCustomDurationSec(count, true);
  ui.timingScaleNote.textContent = `Timer is ON: ${formatSeconds(durationSec)} for ${count} questions (3h baseline at 100).`;
}

function refreshModeUi() {
  const catEnabled = getSelectedMode() === "cat";
  if (ui.customQuizControls) ui.customQuizControls.classList.toggle("hidden", catEnabled);
  if (ui.minQuestions) ui.minQuestions.disabled = catEnabled;
  if (ui.maxQuestions) ui.maxQuestions.disabled = catEnabled;
  if (ui.catMimicNote) ui.catMimicNote.classList.toggle("hidden", !catEnabled);
  if (ui.domainTargetPanel) ui.domainTargetPanel.classList.toggle("hidden", catEnabled);

  if (catEnabled) {
    if (ui.minQuestions) ui.minQuestions.value = "100";
    if (ui.maxQuestions) ui.maxQuestions.value = "150";
  }

  app.domainSelectorMap.forEach((ref) => {
    ref.checkbox.disabled = catEnabled;
    if (catEnabled) ref.checkbox.checked = true;
  });

  const selected = getSelectedDomains().length;
  if (ui.domainSelectionSummary) {
    ui.domainSelectionSummary.textContent = `Custom quiz uses selected domains only. Selected: ${selected}`;
  }

  if (ui.modeSummaryText) {
    ui.modeSummaryText.textContent = catEnabled
      ? "CAT mode: adaptive CISSP simulation with exam-style weighting. Note: This alone does NOT guarantee exam readiness, it is a learning tool."
      : "Custom quiz mode: choose question range and included domains.";
  }
  refreshCustomTimingNote();
}

function buildDomainTargetPanel() {
  if (!ui.domainTargetGrid) return;
  ui.domainTargetGrid.innerHTML = "";
  app.domainSelectorMap.clear();

  const existingActions = document.getElementById("domainSelectionActions");
  if (existingActions) existingActions.remove();

  if (
    ui.domainTargetPanel &&
    ui.domainTargetGrid &&
    ui.domainTargetGrid.parentElement === ui.domainTargetPanel
  ) {
    const actions = document.createElement("div");
    actions.id = "domainSelectionActions";
    actions.className = "actions-row";
    actions.innerHTML = `
      <button type="button" id="selectAllDomainsBtn" class="ghost">Select All</button>
      <button type="button" id="clearAllDomainsBtn" class="ghost">Clear All</button>
    `;
    ui.domainTargetPanel.insertBefore(actions, ui.domainTargetGrid);

    const selectAllBtn = actions.querySelector("#selectAllDomainsBtn");
    const clearAllBtn = actions.querySelector("#clearAllDomainsBtn");

    selectAllBtn.addEventListener("click", () => {
      app.domainSelectorMap.forEach((ref) => {
        if (!ref.checkbox.disabled) ref.checkbox.checked = true;
      });
      updateDomainSelectionSummary();
    });

    clearAllBtn.addEventListener("click", () => {
      app.domainSelectorMap.forEach((ref) => {
        if (!ref.checkbox.disabled) ref.checkbox.checked = false;
      });
      updateDomainSelectionSummary();
    });
  }

  const bankDomains = app.bank
    ? Array.from(new Set(app.bank.items.map((item) => normalizeDomainName(item.domain))))
    : DOMAIN_BLUEPRINT.map((d) => d.name);

  bankDomains.sort((a, b) => a.localeCompare(b));

  bankDomains.forEach((domain) => {
    const label = document.createElement("label");
    label.className = "domain-target-item domain-selector-item";
    label.innerHTML = `
      <span class="target-head"><strong>${domain}</strong></span>
    `;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.className = "domain-checkbox";
    checkbox.setAttribute("aria-label", `Include ${domain}`);

    label.prepend(checkbox);
    ui.domainTargetGrid.appendChild(label);
    app.domainSelectorMap.set(domain, { checkbox, label });

    checkbox.addEventListener("change", () => {
      updateDomainSelectionSummary();
    });
  });
}

function selectNextItem() {
  if (app.attempt.config.mode === "fixed") {
    return selectNextItemFixed();
  }

  const attemptedIds = new Set(app.attempt.itemsAnswered.map((x) => x.itemId));
  const candidates = app.bank.items.filter((item) => !attemptedIds.has(item.id));
  if (!candidates.length) return null;
  const eligibleCandidates = filterRecentlySeen(candidates, 90);

  const domainStats = summarizeDomainStats(app.attempt.itemsAnswered);
  const nextQuestionNumber = app.attempt.itemsAnswered.length + 1;
  const maxQuestions = app.attempt.config.maxQuestions;

  // Theta-aware judgment weighting. As theta rises toward and above the pass cut
  // (theta ≈ 1.0 = scaled 700), the real CISSP deliberately presents more
  // ambiguous "best answer" items where judgment matters more than recall.
  // judgmentBoostStrength ramps from 0 at theta=-3 to a max near the pass cut
  // and above — replicating the "you feel like you know nothing" ISC2 effect.
  const passCutTheta = scaledToTheta(700); // ≈ 1.0
  const judgmentBoostStrength = clamp((app.attempt.theta - (-1)) / (passCutTheta - (-1)), 0, 1) * 0.18;

  const scored = eligibleCandidates.map((item) => {
    const domain = getCanonicalDomainName(item.domain);
    const blueprint = DOMAIN_BLUEPRINT.find((d) => d.name === domain);

    const info = itemInformation(app.attempt.theta, item);
    const currentCount = domainStats.get(domain)?.total ?? 0;

    let domainBoost = 0;
    if (blueprint) {
      const targetByNow = (blueprint.pct / 100) * nextQuestionNumber;
      const deficit = targetByNow - currentCount;
      domainBoost = clamp(deficit * 0.06, -0.2, 0.35);
    }

    // At low theta: knowledge items are slightly preferred (establish baseline).
    // At high theta: judgment/scenario items are boosted — tests managerial thinking.
    // impliedKnowledge items get a small flat boost at all levels (always include
    // some — they're the most CISSP-authentic and create realistic uncertainty).
    const jLevel = item.judgmentLevel ?? 2;
    const judgmentBoost = judgmentBoostStrength * (jLevel - 1) * 0.5;
    const impliedBoost = item.impliedKnowledge ? 0.04 : 0;

    return {
      item,
      score: info + domainBoost + judgmentBoost + impliedBoost + Math.random() * 0.02,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return pickRankWeighted(scored, 0.42, 16, 80);
}

function selectNextItemFixed() {
  const selectedDomains = new Set(app.attempt.config.selectedDomains || []);
  const attemptedIds = new Set(app.attempt.itemsAnswered.map((x) => x.itemId));
  const candidates = app.bank.items.filter((item) => {
    if (attemptedIds.has(item.id)) return false;
    if (!selectedDomains.size) return true;
    return selectedDomains.has(getCanonicalDomainName(item.domain));
  });
  if (!candidates.length) return null;
  const eligibleCandidates = filterRecentlySeen(candidates, 60);

  const recentBands = app.attempt.itemsAnswered.slice(-3).map((x) => x.difficultyBand);

  const scored = eligibleCandidates.map((item) => {
    const band = difficultyBand(item.difficulty);
    const repeatPenalty = recentBands.includes(band) ? 0.06 : 0;
    return { item, score: 0.25 - repeatPenalty + Math.random() * 0.2 };
  });

  scored.sort((a, b) => b.score - a.score);
  return pickRankWeighted(scored, 0.55, 20, 90);
}

function pickRankWeighted(scored, topFraction = 0.2, minPool = 10, maxPool = 40) {
  if (!scored.length) return null;
  const raw = Math.ceil(scored.length * topFraction);
  const poolSize = Math.max(minPool, Math.min(maxPool, Math.max(1, raw), scored.length));
  const pool = scored.slice(0, poolSize);

  // Flatter weights increase take-to-take variety while keeping CAT relevance.
  const weights = pool.map((_, idx) => Math.sqrt(poolSize - idx));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let draw = Math.random() * totalWeight;
  for (let idx = 0; idx < pool.length; idx += 1) {
    draw -= weights[idx];
    if (draw <= 0) return pool[idx].item;
  }
  return pool[pool.length - 1].item;
}

// partialScore: for dichotomous items pass undefined (derived from isCorrect).
// For future polytomous PBQ (GPCM), pass the raw partial score (0..maxScore)
// so the GPCM branch can compute the correct score function gradient.
function updateAbility(item, isCorrect, partialScore) {
  const prevTheta = app.attempt.theta;
  const a = item.discrimination ?? 1;
  // Use type-aware guessing floor (0 for PBQ, 0.25 for MCQ).
  const c = itemGuessingParam(item);
  const p = itemProbability(prevTheta, item);

  // GPCM scaffold: when maxScore > 1, partial credit scoring will replace this
  // block with the polytomous score function gradient. Dichotomous path for now.
  const y = (typeof partialScore === "number") ? clamp(partialScore / Math.max(item.maxScore ?? 1, 1), 0, 1) : (isCorrect ? 1 : 0);

  const scoredCount = app.attempt.itemsAnswered.filter((x) => x.scored).length;
  const step = 0.48 / (1 + scoredCount / 28);
  // 3PL/2PL score function gradient. For PBQ (c=0) this simplifies to a·(y−p),
  // which is the standard 2PL gradient — no guessing suppression needed there.
  const gradient = (a * (y - p) * (p - c)) / (Math.max(p, 1e-9) * (1 - c));
  app.attempt.theta = clamp(prevTheta + step * gradient, -3, 3);

  // Recompute Fisher information at the updated theta over ALL scored items
  // (including the current one). Accumulating at varying thetas biases SE.
  const newTheta = app.attempt.theta;
  const itemMap = new Map(app.bank.items.map((i) => [i.id, i]));
  const totalInfo = app.attempt.itemsAnswered
    .filter((x) => x.scored)
    .reduce((sum, row) => {
      const bi = itemMap.get(row.itemId);
      return bi ? sum + itemInformation(newTheta, bi) : sum;
    }, itemInformation(newTheta, item)); // include current item being scored

  app.attempt.totalInformation = totalInfo;
  app.attempt.se = 1 / Math.sqrt(Math.max(totalInfo, 1e-6));
}

function shouldStop() {
  const n = app.attempt.itemsAnswered.length;
  if (app.attempt.config.mode === "fixed") {
    return n >= (app.attempt.targetQuestionCount || app.attempt.config.maxQuestions);
  }

  const { minQuestions, maxQuestions } = app.attempt.config;
  if (n >= maxQuestions) return true;
  if (n < minQuestions) return false;

  // Certification CAT stopping rule: stop when the 95% CI is entirely on one
  // side of the pass cut. This is the correct psychometric criterion for a
  // pass/fail exam — the question is not "is SE small?" but "are we confident
  // about the pass/fail decision regardless of SE magnitude?"
  //
  // Under 3PL, items provide ~60% of 2PL information (~0.15/item). The old
  // CI-width rule (ciWidth ≤ 0.75) would require ~178 items to satisfy — beyond
  // the 150 max. The pass/fail confidence rule stops correctly:
  //   clear pass (theta=1.5): ~100 items  |  borderline (theta≈1.0): runs to 150.
  const passCutTheta = scaledToTheta(700);
  const ciHalf = 1.96 * app.attempt.se;
  const clearPass = (app.attempt.theta - ciHalf) > passCutTheta;
  const clearFail = (app.attempt.theta + ciHalf) < passCutTheta;
  return clearPass || clearFail;
}

function passProbability() {
  const passCutScaled = 700;
  const cutTheta = scaledToTheta(passCutScaled);
  const z = (cutTheta - app.attempt.theta) / Math.max(app.attempt.se, 0.05);
  return clamp((1 - normalCdf(z)) * 100, 0, 100);
}

function getTimeLeftSec() {
  if (!app.attempt) return EXAM_DURATION_SEC;
  if (!app.attempt.durationSec) return null;
  const elapsed = (Date.now() - app.attempt.startedAtMs) / 1000;
  return Math.max(0, app.attempt.durationSec - elapsed);
}

function renderGraph() {
  const svg = ui.progressGraph;
  if (!svg) return;
  const width = 1000;
  const height = 240;
  const xMin = 12;
  const xMax = width - 12;
  svg.innerHTML = "";

  const xForQuestion = (q) => {
    if (q <= 0) return xMin;
    const denom = Math.max(maxQuestions - 1, 1);
    return ((q - 1) / denom) * (xMax - xMin) + xMin;
  };

  const bgLines = [100, 300, 500, 700, 900, 1000];
  bgLines.forEach((score) => {
    const y = height - ((score - 100) / 900) * (height - 20) - 10;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", String(y));
    line.setAttribute("x2", String(width));
    line.setAttribute("y2", String(y));
    line.setAttribute("stroke", "#e7dece");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", "4");
    label.setAttribute("y", String(y - 3));
    label.setAttribute("font-size", "10");
    label.setAttribute("fill", "#7a7568");
    label.textContent = String(score);
    svg.appendChild(label);
  });

  const maxQuestions = app.attempt?.config.maxQuestions ?? 150;
  const history = app.attempt?.scoreHistory ?? [];
  if (!history.length) return;
  const answeredByQuestion = new Map((app.attempt?.itemsAnswered || []).map((row) => [row.questionNumber, row]));

  const points = history
    .map((row) => {
      const x = xForQuestion(row.questionNumber);
      const y = height - ((row.scaled - 100) / 900) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(" ");

  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("points", points);
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", "#1f5fae");
  polyline.setAttribute("stroke-width", "1.8");
  polyline.setAttribute("stroke-linecap", "round");
  polyline.setAttribute("stroke-linejoin", "round");
  polyline.setAttribute("opacity", app.graphFilter === "incorrect" ? "0.35" : "1");
  svg.appendChild(polyline);

  const dotRadius = maxQuestions > 120 ? 2.4 : 3.1;
  history.forEach((row) => {
    const x = xForQuestion(row.questionNumber);
    const y = height - ((row.scaled - 100) / 900) * (height - 20) - 10;
    const isStart = row.questionNumber === 0;
    const item = answeredByQuestion.get(row.questionNumber);
    const isCorrect = item?.correct === true;
    const isUncounted = item?.scored === false;
    const isIncorrectScored = item?.scored !== false && item?.correct === false;
    const faded = app.graphFilter === "incorrect" && !isIncorrectScored;

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", String(x));
    dot.setAttribute("cy", String(y));
    dot.setAttribute("r", String(isStart ? dotRadius + 0.8 : dotRadius));
    dot.setAttribute("fill", isStart ? "#1f5fae" : (isUncounted ? "#1f2937" : (isCorrect ? "#1f9d55" : "#d93025")));
    dot.setAttribute("fill-opacity", faded ? "0.18" : "1");
    dot.setAttribute("stroke", "#ffffff");
    dot.setAttribute("stroke-width", faded ? "0.6" : "1.2");
    svg.appendChild(dot);
  });

  const passCut = 700;
  const passY = height - ((passCut - 100) / 900) * (height - 20) - 10;
  const passLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  passLine.setAttribute("x1", "0");
  passLine.setAttribute("y1", String(passY));
  passLine.setAttribute("x2", String(width));
  passLine.setAttribute("y2", String(passY));
  passLine.setAttribute("stroke", "#d06e1c");
  passLine.setAttribute("stroke-dasharray", "6 4");
  passLine.setAttribute("stroke-width", "2");
  svg.appendChild(passLine);

  const passLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  passLabel.setAttribute("x", String(width - 150));
  passLabel.setAttribute("y", String(passY - 6));
  passLabel.setAttribute("font-size", "11");
  passLabel.setAttribute("fill", "#b55f16");
  passLabel.textContent = "Pass Threshold: 700";
  svg.appendChild(passLabel);
}

function renderDomainSelectionStatus() {
  if (getSelectedMode() === "cat" || !ui.domainSelectionSummary) return;
  updateDomainSelectionSummary();
}

function applyQuestionHeaderMode(mode, showRunningScore = false) {
  const isCat = mode === "cat";
  const setVisible = (el, visible) => {
    if (!el) return;
    el.style.display = visible ? "" : "none";
  };

  // Keep only progress + main timer in custom quiz mode.
  setVisible(ui.domainText, isCat);
  setVisible(ui.difficultyText, isCat);
  setVisible(ui.scoreText, isCat || showRunningScore);
  setVisible(ui.questionTimerText, isCat);
  setVisible(ui.avgQuestionTimeText, isCat);
  setVisible(ui.scoredTrackerText, isCat);
  setVisible(ui.unscoredRuleText, isCat);
  setVisible(ui.ciStopText, isCat);
}

function renderMetrics() {
  if (!app.attempt) return;

  const theta = app.attempt.theta;
  const se = app.attempt.se;
  const ciLow = theta - 1.96 * se;
  const ciHigh = theta + 1.96 * se;
  const scaled = thetaToScaled(theta);
  const ciScaledLow = thetaToScaled(ciLow);
  const ciScaledHigh = thetaToScaled(ciHigh);
  const n = app.attempt.itemsAnswered.length;

  const guessed = app.attempt.itemsAnswered.filter((x) => x.fastGuessSignal).length;
  const scoredCount = app.attempt.itemsAnswered.filter((x) => x.scored).length;
  const unscoredCount = n - scoredCount;
  const avgSec = n
    ? app.attempt.itemsAnswered.reduce((acc, row) => acc + row.elapsedSec, 0) / n
    : 0;
  const passConf = passProbability();
  const technical = ui.showTechnicalMetrics ? ui.showTechnicalMetrics.checked : false;

  if (technical) {
    ui.metric1Label.textContent = "Theta";
    ui.metric2Label.textContent = "SE";
    ui.metric3Label.textContent = "95% CI";
    ui.metric4Label.textContent = "Scaled Score";
    ui.metric5Label.textContent = "Pass Probability";
    ui.metric6Label.textContent = "Guess Signal";
    ui.thetaText.textContent = theta.toFixed(2);
    ui.seText.textContent = Number.isFinite(se) ? se.toFixed(2) : "--";
    ui.ciText.textContent = `${ciLow.toFixed(2)} to ${ciHigh.toFixed(2)}`;
    ui.guessSignalText.textContent = n ? `${((guessed / n) * 100).toFixed(1)}%` : "0%";
  } else {
    ui.metric1Label.textContent = "Exam Readiness";
    ui.metric2Label.textContent = "Pass Confidence";
    ui.metric3Label.textContent = "Score Confidence Band";
    ui.metric4Label.textContent = "Scaled Score";
    ui.metric5Label.textContent = "Pass Probability";
    ui.metric6Label.textContent = "Response Pace";
    ui.thetaText.textContent = scaled >= 700 ? "On Track" : "Below Target";
    ui.seText.textContent = `${passConf.toFixed(1)}%`;
    ui.ciText.textContent = `${ciScaledLow.toFixed(0)} to ${ciScaledHigh.toFixed(0)} (likely score range)`;
    ui.guessSignalText.textContent = `${avgSec.toFixed(1)}s avg`;
  }

  ui.scaledText.textContent = thetaToScaled(theta).toFixed(2).replace(".", ",");
  ui.passProbText.textContent = `${passConf.toFixed(1)}%`;
  if (ui.scoreText) ui.scoreText.textContent = `Score: ${scaled.toFixed(2).replace(".", ",")} / 1000`;

  if (ui.scoredTrackerText) ui.scoredTrackerText.textContent = `Scored: ${scoredCount} | Unscored: ${unscoredCount}`;
  if (ui.unscoredRuleText) {
    ui.unscoredRuleText.textContent =
      app.attempt.config.mode === "cat"
        ? `Unscored markers shown on graph`
        : "All items scored in custom mode";
  }
  if (ui.ciStopText) {
    ui.ciStopText.textContent =
      app.attempt.config.mode === "cat"
        ? `Stop rule: 95% CI clears pass cut (${thetaToScaled(scaledToTheta(700)).toFixed(0)}). Borderline candidates run to 150.`
        : `Custom Quiz Stop Rule: ${app.attempt.targetQuestionCount || app.attempt.config.maxQuestions} questions`;
  }

  ui.avgQuestionTimeText.textContent = `${avgSec.toFixed(1)}s`;
  const timeLeft = getTimeLeftSec();
  if (ui.timerText) ui.timerText.textContent = timeLeft == null ? "Off" : formatSeconds(timeLeft);

  if (app.attempt.currentPresentedAtMs) {
    const currentSec = (Date.now() - app.attempt.currentPresentedAtMs) / 1000;
    ui.questionTimerText.textContent = `${currentSec.toFixed(1)}s`;
  }

  renderDomainSelectionStatus();
  renderGraph();
}

function refreshMetricsPanelVisibility() {
  if (!ui.statsContent || !ui.hideMetricsPanel) return;
  ui.statsContent.classList.toggle("hidden", ui.hideMetricsPanel.checked);
}

function renderCurrentQuestion() {
  const item = app.attempt.currentItem;
  if (!item) return;

  applyQuestionHeaderMode(app.attempt.config.mode, Boolean(app.attempt.config.showRunningScore));

  const qNum = app.attempt.itemsAnswered.length + 1;
  const isUnscoredPlanned = app.attempt.unscoredPositions.includes(qNum);
  const totalPlanned =
    app.attempt.config.mode === "fixed"
      ? app.attempt.targetQuestionCount || app.attempt.config.maxQuestions
      : app.attempt.config.maxQuestions;
  if (ui.progressText) ui.progressText.textContent = `Question ${qNum} / ${totalPlanned}${app.attempt.config.mode === "cat" && isUnscoredPlanned ? " (UNSCORED ITEM)" : ""}`;
  if (ui.domainText) ui.domainText.textContent = getCanonicalDomainName(item.domain);
  if (ui.difficultyText) ui.difficultyText.textContent = `Difficulty: ${difficultyBand(item.difficulty)}`;
  ui.questionStem.textContent = item.stem;
  ui.choicesForm.innerHTML = "";
  ui.feedbackText.textContent = "";

  item.choices.forEach((choice, idx) => {
    const label = document.createElement("label");
    label.className = "choice";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "choice";
    input.value = String(idx);

    const span = document.createElement("span");
    span.textContent = choice;

    label.append(input, span);
    ui.choicesForm.append(label);
  });

  app.attempt.currentPresentedAtMs = Date.now();
  ui.questionPanel.classList.remove("hidden");
  if (app.attempt.config.mode === "cat") {
    ui.statsPanel.classList.remove("hidden");
  } else {
    ui.statsPanel.classList.add("hidden");
  }
  ui.resultsPanel.classList.add("hidden");
  renderMetrics();

  if (app.attempt.awaitingAdvance) {
    const last = app.attempt.itemsAnswered[app.attempt.itemsAnswered.length - 1];
    if (last && last.itemId === item.id) {
      showInlineAnswerFeedback(item, last);
    }
  } else if (ui.submitAnswerBtn) {
    ui.submitAnswerBtn.textContent = "Submit Answer";
  }
}

function showInlineAnswerFeedback(item, row) {
  const labels = Array.from(ui.choicesForm.querySelectorAll("label.choice"));
  labels.forEach((label, idx) => {
    label.classList.remove("choice-correct", "choice-selected-wrong");
    const input = label.querySelector("input");
    if (input) input.disabled = true;
    if (idx === row.correctIndex) {
      label.classList.add("choice-correct");
    } else if (idx === row.selectedIndex && row.selectedIndex !== row.correctIndex) {
      label.classList.add("choice-selected-wrong");
    }
  });

  const verdict = row.correct ? "Correct." : "Incorrect.";
  const explanation = row.explanation || item.explanation || "No explanation provided in bank.";
  ui.feedbackText.textContent = `${verdict} ${explanation}`;

  if (ui.submitAnswerBtn) {
    const planned = app.attempt.targetQuestionCount || app.attempt.config.maxQuestions || app.attempt.itemsAnswered.length;
    const done = app.attempt.itemsAnswered.length >= planned;
    ui.submitAnswerBtn.textContent = done ? "Finish Quiz" : "Next Question";
  }
}

function advanceAfterAnswer() {
  app.attempt.currentItem = null;
  app.attempt.currentPresentedAtMs = 0;
  app.attempt.awaitingAdvance = false;

  if (shouldStop()) {
    stopAttempt("stopping_rule");
    return;
  }

  const next = selectNextItem();
  if (!next) {
    stopAttempt("bank_exhausted");
    return;
  }

  app.attempt.currentItem = next;
  saveSession();
  renderCurrentQuestion();
}

function buildReviewText() {
  const scaled = thetaToScaled(app.attempt.theta);
  const scoreStr = scaled.toFixed(2).replace(".", ",");
  const passCut = 700;
  const scoredRows = app.attempt.itemsAnswered.filter((r) => r.scored);
  const correctScored = scoredRows.filter((r) => r.correct).length;

  const lines = [];
  lines.push(`Attempt ID: ${app.attempt.attemptId}`);
  lines.push(`Started: ${new Date(app.attempt.startedAtMs).toISOString()}`);
  lines.push(`Completed: ${app.attempt.completedAt}`);
  lines.push(`Final Scaled Score: ${scoreStr} / 1000`);
  lines.push(`Pass Cut (configured): ${passCut}`);
  lines.push(`Mode: ${app.attempt.config.mode.toUpperCase()}`);
  lines.push(`Administered: ${app.attempt.itemsAnswered.length}`);
  lines.push(`Scored Items: ${scoredRows.length}`);
  lines.push(`Unscored Items: ${app.attempt.itemsAnswered.length - scoredRows.length}`);
  lines.push(`Scored Correct: ${correctScored}/${scoredRows.length}`);
  lines.push("");
  lines.push("#\tDomain\tDifficulty\tScored\tCorrect\tElapsedSec\tScaledAfter\tItemId");

  app.attempt.itemsAnswered.forEach((row) => {
    lines.push(
      `${row.questionNumber}\t${row.domain}\t${row.difficultyBand}\t${row.scored ? "Y" : "N"}\t${row.correct ? "Y" : "N"}\t${row.elapsedSec.toFixed(2)}\t${row.scaledAfter.toFixed(2).replace(".", ",")}\t${row.itemId}`
    );
  });

  lines.push("");
  lines.push("Explanations");
  app.attempt.itemsAnswered.forEach((row) => {
    lines.push(`Q${row.questionNumber} (${row.itemId}): ${row.explanation || "No explanation provided in bank."}`);
  });

  return lines.join("\n");
}

function renderReviewTable() {
  if (!ui.reviewTableBody) return;
  ui.reviewTableBody.innerHTML = "";
  app.attempt.itemsAnswered.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.questionNumber}</td>
      <td>${row.domain}</td>
      <td>${row.difficultyBand}</td>
      <td>${row.scored ? "Yes" : "No"}</td>
      <td>${row.correct ? "Yes" : "No"}</td>
      <td>${row.elapsedSec.toFixed(2)}</td>
      <td>${row.scaledAfter.toFixed(2).replace(".", ",")}</td>
      <td>${row.explanation || ""}</td>
    `;
    ui.reviewTableBody.appendChild(tr);
  });
}

function renderExplanationReview() {
  if (!ui.explanationReview || !app.bank) return;
  const itemMap = new Map(app.bank.items.map((item) => [item.id, item]));
  ui.explanationReview.innerHTML = app.attempt.itemsAnswered
    .filter((row) => app.reviewFilter === "all" || row.correct === false)
    .map((row) => {
      const item = itemMap.get(row.itemId);
      if (!item) return "";
      const choices = item.choices || [];
      const rows = choices
        .map((choice, idx) => {
          let cls = "explain-choice";
          if (idx === row.correctIndex) cls += " explain-correct";
          if (idx === row.selectedIndex && row.selectedIndex !== row.correctIndex) cls += " explain-selected-wrong";
          const badge = idx === row.correctIndex ? "Correct" : idx === row.selectedIndex ? "Your Answer" : "";
          return `<li class="${cls}"><span>${choice}</span>${badge ? `<em>${badge}</em>` : ""}</li>`;
        })
        .join("");
      return `<article class="explain-card"><h4>Q${row.questionNumber}</h4><p>${item.stem}</p><ul>${rows}</ul><p class="small-note">${row.explanation || "No explanation provided in bank."}</p></article>`;
    })
    .join("");
}

function setActiveFilterButtons() {
  if (ui.graphAllBtn && ui.graphIncorrectBtn) {
    ui.graphAllBtn.classList.toggle("active", app.graphFilter === "all");
    ui.graphIncorrectBtn.classList.toggle("active", app.graphFilter === "incorrect");
  }
  if (ui.reviewAllBtn && ui.reviewIncorrectBtn) {
    ui.reviewAllBtn.classList.toggle("active", app.reviewFilter === "all");
    ui.reviewIncorrectBtn.classList.toggle("active", app.reviewFilter === "incorrect");
  }
}

function renderDomainStrengthChart(domainStats, totalQuestions) {
  if (!ui.domainStrengthChart) return;
  const total = Math.max(totalQuestions, 1);
  ui.domainStrengthChart.innerHTML = DOMAIN_BLUEPRINT.map((d) => {
    const s = domainStats.get(d.name) ?? { total: 0, correct: 0 };
    const askedPct = (s.total / total) * 100;
    const correctPct = s.total ? (s.correct / s.total) * 100 : 0;
    return `
      <div class="domain-strength-row">
        <div class="domain-strength-head">
          <strong>${d.name}</strong>
          <span>${s.correct}/${s.total} correct (${correctPct.toFixed(0)}%)</span>
        </div>
        <div class="domain-strength-bar">
          <div class="domain-strength-fill" style="width:${correctPct.toFixed(1)}%"></div>
        </div>
        <div class="small-note">Observed coverage: ${askedPct.toFixed(1)}%</div>
      </div>
    `;
  }).join("");
}

function renderResults() {
  const n = app.attempt.itemsAnswered.length;
  const scoredRows = app.attempt.itemsAnswered.filter((x) => x.scored);
  const scoredCorrect = scoredRows.filter((x) => x.correct).length;
  const scaled = thetaToScaled(app.attempt.theta);
  const passCut = 700;

  if (ui.outcomeBanner) {
    ui.outcomeBanner.textContent =
      scaled >= passCut
        ? "Congratulations, you have provisionally passed."
        : "Unfortunately, you did not pass.";
    ui.outcomeBanner.className = scaled >= passCut ? "outcome pass" : "outcome fail";
  }
  if (ui.finalSummary) {
    ui.finalSummary.textContent = `Overall Score: ${scaled.toFixed(2).replace(".", ",")} / 1000 | Scored Correct: ${scoredCorrect}/${scoredRows.length} | Administered: ${n} | Unscored: ${n - scoredRows.length} | Pass Cut: ${passCut}`;
  }

  const domainStats = summarizeDomainStats(app.attempt.itemsAnswered);
  if (ui.domainBreakdown) {
    ui.domainBreakdown.innerHTML = DOMAIN_BLUEPRINT.map((d) => {
    const s = domainStats.get(d.name) ?? { total: 0, correct: 0, scored: 0 };
    const pct = n ? ((s.total / n) * 100).toFixed(1) : "0.0";
    let targetText = "";
    if (app.attempt.config.mode === "cat") {
      targetText = ` | CAT target ${d.pct}%`;
    }
      return `<p><strong>${d.name}</strong>: ${s.correct}/${s.total} correct | observed ${pct}%${targetText}</p>`;
    }).join("");
  }
  renderDomainStrengthChart(domainStats, n);
  if (ui.analyticsNotes) {
    const stopReason = app.attempt.stopReason || "unknown";
    ui.analyticsNotes.textContent =
      app.attempt.config.mode === "cat"
        ? `CAT stopped automatically by adaptive rules. Stop reason: ${stopReason}.`
        : `Custom quiz completed at configured question count (${app.attempt.targetQuestionCount || app.attempt.config.maxQuestions}).`;
  }

  if (ui.reviewText) ui.reviewText.value = buildReviewText();
  renderReviewTable();
  renderExplanationReview();
  setActiveFilterButtons();

  if (ui.resultsPanel) ui.resultsPanel.classList.remove("hidden");
  if (ui.questionPanel) ui.questionPanel.classList.add("hidden");
  if (ui.statsPanel) {
    ui.statsPanel.classList.toggle("hidden", PAGE_VIEW !== "analytics");
  }
  renderMetrics();
}

function stopAttempt(reason) {
  if (!app.attempt || app.attempt.completed) return;
  app.attempt.completed = true;
  app.attempt.completedAt = new Date().toISOString();
  app.attempt.stopReason = reason;
  app.attempt.finalSnapshot = {
    capturedAt: new Date().toISOString(),
    questionCount: app.attempt.itemsAnswered.length,
    scaled: thetaToScaled(app.attempt.theta),
    passProbability: passProbability(),
    se: app.attempt.se,
    theta: app.attempt.theta,
  };
  saveSession();
  stopTickers();
  if (PAGE_VIEW === "session") {
    location.href = "./session/analytics.html";
    return;
  }
  renderResults();
}

function answerCurrentQuestion() {
  if (app.attempt?.awaitingAdvance) {
    advanceAfterAnswer();
    return;
  }

  const selected = ui.choicesForm.querySelector("input[name='choice']:checked");
  if (!selected) {
    ui.feedbackText.textContent = "Select an answer first.";
    return;
  }

  const item = app.attempt.currentItem;
  const selectedIndex = Number(selected.value);
  const correct = selectedIndex === item.correctIndex;
  const elapsedSec = (Date.now() - app.attempt.currentPresentedAtMs) / 1000;

  // partialScore: for MCQ this is always 0 or 1. PBQ items (dragdrop/ordering)
  // will supply a numeric partial score (0..maxScore) once that UI is built.
  const partialScore = correct ? (item.maxScore ?? 1) : 0;

  const questionNumber = app.attempt.itemsAnswered.length + 1;
  const scored = app.attempt.config.mode === "cat" ? !app.attempt.unscoredPositions.includes(questionNumber) : true;

  if (scored) {
    updateAbility(item, correct, partialScore);
  }

  const scaledAfter = thetaToScaled(app.attempt.theta);
  const fastGuessSignal = correct && elapsedSec < 8 && item.difficulty > app.attempt.theta + 0.9;

  app.attempt.itemsAnswered.push({
    questionNumber,
    itemId: item.id,
    itemType: item.type ?? "mcq",
    domain: getCanonicalDomainName(item.domain),
    correct,
    partialScore,
    maxScore: item.maxScore ?? 1,
    scored,
    selectedIndex,
    correctIndex: item.correctIndex,
    elapsedSec,
    difficulty: item.difficulty,
    difficultyBand: difficultyBand(item.difficulty),
    discrimination: item.discrimination,
    explanation: item.explanation || "",
    fastGuessSignal,
    answeredAt: new Date().toISOString(),
    scaledAfter,
  });
  rememberRecentItem(item.id);

  app.attempt.scoreHistory.push({
    questionNumber,
    scaled: scaledAfter,
  });

  if (app.attempt.config.mode === "fixed" && app.attempt.config.instantFeedback) {
    app.attempt.awaitingAdvance = true;
    saveSession();
    showInlineAnswerFeedback(item, app.attempt.itemsAnswered[app.attempt.itemsAnswered.length - 1]);
    return;
  }

  advanceAfterAnswer();
}

function selectFirstItem(theta) {
  const pool = filterRecentlySeen(app.bank.items, 110);
  const scored = pool
    .map((item) => ({ item, score: itemInformation(theta, item) + Math.random() * 0.02 }))
    .sort((a, b) => b.score - a.score);
  return pickRankWeighted(scored, 0.36, 18, 90);
}

function sampleUnscoredPositions() {
  const arr = Array.from({ length: 100 }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr.slice(0, 25).sort((a, b) => a - b);
}

function startNewAttempt() {
  if (!app.bank) {
    alert("Question bank is still loading. Please try again in a moment.");
    return;
  }

  let config;
  try {
    config = getConfigFromUi();
  } catch (err) {
    alert(String(err.message || err));
    return;
  }

  if (config.mode === "fixed") {
    const selected = new Set(config.selectedDomains);
    const available = app.bank.items.filter((item) => selected.has(getCanonicalDomainName(item.domain)));
    if (available.length < config.fixedQuestionCount) {
      alert(`Selected domains only contain ${available.length} items. Reduce quiz length or select more domains.`);
      return;
    }
  }
  app.recentItemIds = loadRecentItemIds();

  app.attempt = {
    attemptId: crypto.randomUUID(),
    config,
    startedAtMs: Date.now(),
    completedAt: null,
    completed: false,
    stopReason: null,
    theta: config.startTheta,
    // 3PL prior: 1/sqrt(0.44) ≈ 1.51. Under 3PL with c=0.25, items yield ~0.15
    // information units each (vs ~0.25 for 2PL). Starting totalInformation of 0.44
    // represents a diffuse prior — roughly 3 effective 3PL items — giving honest
    // starting uncertainty before any responses are observed.
    se: 1 / Math.sqrt(0.44),
    totalInformation: 0.44,
    itemsAnswered: [],
    scoreHistory: [{ questionNumber: 0, scaled: thetaToScaled(config.startTheta) }],
    targetQuestionCount: config.mode === "fixed" ? config.fixedQuestionCount : config.maxQuestions,
    durationSec:
      config.mode === "cat"
        ? EXAM_DURATION_SEC
        : getCustomDurationSec(config.fixedQuestionCount, config.timedQuiz),
    unscoredPositions: config.mode === "cat" ? sampleUnscoredPositions() : [],
    awaitingAdvance: false,
    currentItem: null,
    currentPresentedAtMs: 0,
  };

  app.attempt.currentItem = config.mode === "cat" ? selectFirstItem(config.startTheta) : selectNextItemFixed();
  app.attempt.currentPresentedAtMs = Date.now();

  if (!app.attempt.currentItem) {
    alert("Unable to start quiz with current settings.");
    app.attempt = null;
    return;
  }

  saveSession();
  startTickers();
  renderCurrentQuestion();
}

function loadBank(bank) {
  validateBank(bank);

  // Normalize domains so they align with blueprint labels where possible.
  bank.items = bank.items.map((item) => ({
    ...shuffleChoicesForItem(item),
    domain: normalizeDomainName(item.domain),
  }));

  app.bank = bank;
  if (ui.bankStatus) {
    ui.bankStatus.textContent = "Question bank loaded | pass threshold: 700";
  }
  buildDomainTargetPanel();
  refreshModeUi();
}

async function loadDefaultBank() {
  const pageHref = window.location.href;
  const candidates = [
    new URL("./question-bank.sample.json", import.meta.url).href,
    new URL("../cat/question-bank.sample.json", pageHref).href,
    new URL("./cat/question-bank.sample.json", pageHref).href,
    new URL("./question-bank.sample.json", pageHref).href,
    new URL("./question-bank.qa.json", import.meta.url).href,
    new URL("../cat/question-bank.qa.json", pageHref).href,
    new URL("./cat/question-bank.qa.json", pageHref).href,
    new URL("./question-bank.qa.json", pageHref).href,
  ];
  const uniqueCandidates = Array.from(new Set(candidates));
  let lastErr = null;
  for (const path of uniqueCandidates) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) continue;
      const bank = await res.json();
      if (!bank || !Array.isArray(bank.items)) {
        // QA/manifest artifacts are valid JSON but not a usable question bank.
        continue;
      }
      loadBank(bank);
      return;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("Could not load question bank.");
}

function saveResults() {
  if (!app.attempt) {
    alert("No attempt to save.");
    return;
  }
  if (!app.attempt.completed) {
    alert("Save is available after submission.");
    return;
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    bankMeta: {
      passScaledCut: 700,
      totalItems: app.bank?.items?.length ?? 0,
    },
    attempt: app.attempt,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cat-results-${app.attempt.attemptId}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function restoreSavedSession() {
  const payload = loadSession();
  if (!payload?.bank || !payload?.attempt) {
    alert("No saved session found.");
    return;
  }

  try {
    loadBank(payload.bank);
  } catch (err) {
    alert(`Saved bank invalid: ${String(err.message || err)}`);
    return;
  }

  app.attempt = payload.attempt;
  app.attempt.config = app.attempt.config || getDefaultConfig();
  if (!app.attempt.config.mode) app.attempt.config.mode = "cat";
  if (!Array.isArray(app.attempt.config.selectedDomains)) {
    app.attempt.config.selectedDomains = DOMAIN_BLUEPRINT.map((d) => d.name);
  }
  if (ui.minQuestions) ui.minQuestions.value = String(app.attempt.config.minQuestions ?? 100);
  if (ui.maxQuestions) ui.maxQuestions.value = String(app.attempt.config.maxQuestions ?? 150);
  if (ui.fixedQuestionCount) ui.fixedQuestionCount.value = String(app.attempt.config.fixedQuestionCount ?? app.attempt.config.maxQuestions ?? 75);
  if (ui.timedQuiz) ui.timedQuiz.checked = app.attempt.config.timedQuiz !== false;
  if (ui.showRunningScore) ui.showRunningScore.checked = app.attempt.config.showRunningScore === true;
  if (ui.instantFeedback) ui.instantFeedback.checked = app.attempt.config.instantFeedback === true;
  if (!FORCED_MODE) {
    if (ui.modeCat) ui.modeCat.checked = app.attempt.config.mode === "cat";
    if (ui.modeCustom) ui.modeCustom.checked = app.attempt.config.mode !== "cat";
  }
  app.domainSelectorMap.forEach((ref, domain) => {
    ref.checkbox.checked = app.attempt.config.mode === "cat" ? true : app.attempt.config.selectedDomains.includes(domain);
  });
  refreshModeUi();
  if (!Array.isArray(app.attempt.scoreHistory)) {
    app.attempt.scoreHistory = [];
  }
  if (!Array.isArray(app.attempt.unscoredPositions)) {
    app.attempt.unscoredPositions = sampleUnscoredPositions();
  }
  if (app.attempt.config.mode !== "cat") {
    app.attempt.unscoredPositions = [];
    if (!app.attempt.targetQuestionCount) {
      app.attempt.targetQuestionCount = app.attempt.config.fixedQuestionCount ?? app.attempt.config.maxQuestions ?? 75;
    }
  if (!Object.prototype.hasOwnProperty.call(app.attempt, "durationSec")) {
    app.attempt.durationSec = getCustomDurationSec(
      app.attempt.targetQuestionCount,
      app.attempt.config.timedQuiz !== false
    );
  }
  if (!Object.prototype.hasOwnProperty.call(app.attempt, "awaitingAdvance")) {
    app.attempt.awaitingAdvance = false;
  }
  }

  if (app.attempt.completed) {
    stopTickers();
    renderResults();
    return;
  }

  if (!app.attempt.currentItem) {
    app.attempt.currentItem = selectNextItem();
    app.attempt.currentPresentedAtMs = Date.now();
  }

  saveSession();
  startTickers();
  renderCurrentQuestion();
}

function startTickers() {
  stopTickers();
  app.timerInterval = setInterval(() => {
    if (!app.attempt || app.attempt.completed) {
      stopTickers();
      return;
    }

    const timeLeft = getTimeLeftSec();
    if (timeLeft != null && timeLeft <= 0) {
      stopAttempt("time_expired");
      return;
    }

    renderMetrics();
  }, 1000);
}

function stopTickers() {
  if (app.timerInterval) {
    clearInterval(app.timerInterval);
    app.timerInterval = null;
  }
}

function wireEvents() {
  if (ui.startBtn) {
    ui.startBtn.addEventListener("click", () => {
      if (PAGE_VIEW === "setup" && getSelectedMode() === "cat") {
        sessionStorage.setItem(AUTOSTART_KEY, "1");
        location.href = "./session.html";
        return;
      }
      startNewAttempt();
    });
  }
  if (ui.modeCat) ui.modeCat.addEventListener("change", refreshModeUi);
  if (ui.modeCustom) ui.modeCustom.addEventListener("change", refreshModeUi);
  if (ui.fixedQuestionCount) ui.fixedQuestionCount.addEventListener("input", refreshCustomTimingNote);
  if (ui.timedQuiz) ui.timedQuiz.addEventListener("change", refreshCustomTimingNote);
  if (ui.hideMetricsPanel) {
    ui.hideMetricsPanel.addEventListener("change", refreshMetricsPanelVisibility);
  }
  if (ui.showTechnicalMetrics) {
    ui.showTechnicalMetrics.addEventListener("change", () => {
      if (app.attempt) renderMetrics();
    });
  }
  if (ui.resumeBtn) {
    ui.resumeBtn.addEventListener("click", () => {
      if (PAGE_VIEW === "setup" && getSelectedMode() === "cat") {
        sessionStorage.setItem(AUTORESUME_KEY, "1");
        location.href = "./session.html";
        return;
      }
      restoreSavedSession();
    });
  }
  if (ui.sessionInfoBtn) {
    ui.sessionInfoBtn.addEventListener("click", () => {
    alert(
      "Session progress is saved in this browser session (sessionStorage). Recently seen question history is also saved to localStorage to reduce repeats across new takes."
    );
  });
  }
  if (ui.submitAnswerBtn) ui.submitAnswerBtn.addEventListener("click", answerCurrentQuestion);
  if (ui.saveResultsBtn) ui.saveResultsBtn.addEventListener("click", saveResults);
  if (ui.graphAllBtn) {
    ui.graphAllBtn.addEventListener("click", () => {
      app.graphFilter = "all";
      setActiveFilterButtons();
      renderGraph();
    });
  }
  if (ui.graphIncorrectBtn) {
    ui.graphIncorrectBtn.addEventListener("click", () => {
      app.graphFilter = "incorrect";
      setActiveFilterButtons();
      renderGraph();
    });
  }
  if (ui.reviewAllBtn) {
    ui.reviewAllBtn.addEventListener("click", () => {
      app.reviewFilter = "all";
      setActiveFilterButtons();
      renderExplanationReview();
    });
  }
  if (ui.reviewIncorrectBtn) {
    ui.reviewIncorrectBtn.addEventListener("click", () => {
      app.reviewFilter = "incorrect";
      setActiveFilterButtons();
      renderExplanationReview();
    });
  }
}

function init() {
  app.recentItemIds = loadRecentItemIds();
  const cfg = getDefaultConfig();
  if (ui.minQuestions) ui.minQuestions.value = String(cfg.minQuestions);
  if (ui.maxQuestions) ui.maxQuestions.value = String(cfg.maxQuestions);
  if (ui.fixedQuestionCount) ui.fixedQuestionCount.value = String(cfg.fixedQuestionCount);
  if (ui.timedQuiz) ui.timedQuiz.checked = cfg.timedQuiz;
  if (ui.showRunningScore) ui.showRunningScore.checked = cfg.showRunningScore;
  if (ui.instantFeedback) ui.instantFeedback.checked = cfg.instantFeedback;
  if (ui.hideMetricsPanel) ui.hideMetricsPanel.checked = false;
  if (ui.showTechnicalMetrics) ui.showTechnicalMetrics.checked = false;

  buildDomainTargetPanel();
  wireEvents();
  refreshModeUi();
  refreshResumeVisibility();
  refreshMetricsPanelVisibility();

  const existing = loadSession();
  if (ui.bankStatus && existing?.bank && existing?.attempt) {
    ui.bankStatus.textContent = "Saved CAT session found. Click Resume Session.";
  }
}

init();
const bankLoadPromise = loadDefaultBank().catch((err) => {
  if (ui.bankStatus) {
    ui.bankStatus.textContent = `Question bank load failed: ${String(err.message || err)}`;
  }
});

if (PAGE_VIEW === "session") {
  bankLoadPromise.finally(() => {
    const shouldStart = sessionStorage.getItem(AUTOSTART_KEY) === "1";
    const shouldResume = sessionStorage.getItem(AUTORESUME_KEY) === "1";
    if (shouldStart) sessionStorage.removeItem(AUTOSTART_KEY);
    if (shouldResume) sessionStorage.removeItem(AUTORESUME_KEY);

    if (shouldResume) {
      restoreSavedSession();
    } else if (shouldStart) {
      startNewAttempt();
    } else if (loadSession()?.attempt) {
      restoreSavedSession();
    }
  });
}

if (PAGE_VIEW === "analytics") {
  bankLoadPromise.finally(() => {
    const payload = loadSession();
    if (!payload?.attempt) return;
    restoreSavedSession();
  });
}
