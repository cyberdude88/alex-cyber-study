import { convertQuestionToScenario } from "./question-to-scenario.js";

const STORAGE_KEY = "cissp_cat_session_v2";
const RECENT_ITEMS_KEY = "cissp_cat_recent_items_v3";
const LEGACY_RECENT_ITEMS_KEYS = ["cissp_cat_recent_items_v2", "cissp_cat_recent_items_v1"];
const RECENT_STEMS_KEY = "cissp_cat_recent_stems_v1";
const RECENT_ITEMS_MAX = 3500;
const RECENT_STEMS_MAX = 5000;
const EXAM_DURATION_SEC = 3 * 60 * 60;
const AUTOSTART_KEY = "cissp_cat_autostart";
const AUTORESUME_KEY = "cissp_cat_autoresume";
const PBQ_TYPES_SET = new Set(["dragdrop", "ordering", "hotspot"]);
const PBQ_MAX_PER_ATTEMPT = 2;
const PBQ_THETA_MIN = -0.25;
const FORCED_MODE = document.body.dataset.mode === "cat" || document.body.dataset.mode === "fixed"
  ? document.body.dataset.mode
  : null;
const PAGE_VIEW = document.body.dataset.view || "setup";
const SCENARIO_VIEW_ENABLED = new URLSearchParams(window.location.search).get("scenario") === "1";
const INCLUDE_SYNTHETIC_VARIANTS = new URLSearchParams(window.location.search).get("variants") === "1";

// === PER-DOMAIN CEILING TRACKER (CAT mode) ===
// Tracks competency ceiling per CISSP domain throughout the entire exam.
// Strong domain  → push difficulty up each time you succeed (find where you fail).
// Weak domain    → allocate more volume (more questions until ceiling is confirmed).
// Confirmed ceiling → de-prioritize domain so question budget moves elsewhere.
const DC_MIN_ATTEMPTS = 4;    // attempts before ceiling/weakness flags can fire
const DC_WINDOW       = 4;    // rolling accuracy window size
const DC_FAIL_RATE    = 0.50; // < 50% in window → ceiling confirmed (struggling here)
const DC_STRONG_RATE  = 0.75; // ≥ 75% in window → push targetDiff up
const DC_PROBE_STEP   = 0.30; // difficulty increment per upward push
const DC_WEAK_BOOST   = 0.42; // selection score boost for weak (struggling) domains
const DC_CEIL_PENALTY = 0.48; // selection score penalty when ceiling already confirmed

// === AGGRESSIVE DOMAIN CEILING MODE (ADCM) ===
const ADCM_ACTIVE = new URLSearchParams(window.location.search).get("adcm") === "1";
const ADCM_PHASE1_COUNT = 20;     // Phase 1: stress-test all 8 domains with hard Qs
const ADCM_HARD_FLOOR = 0.7;      // Min difficulty for Phase 1 item selection
const ADCM_DIFF_STEP = 0.35;      // Per-streak difficulty adjustment increment
const ADCM_CEIL_WINDOW = 4;       // Stability window size for ceiling confirmation
const ADCM_CEIL_PASS_RATE = 0.70; // ≥70% accuracy = ceiling NOT yet hit at this level
const ADCM_MIN_ATTEMPTS = 5;      // Min per-domain attempts before ceiling can confirm
const ADCM_MAX_QUESTIONS = 100;   // Hard question cap per ADCM session
const PERSON_NAME_NORMALIZE_LIST = [
  "Pallavi",
  "Arif",
  "Jayesh",
  "Hideo",
  "Meera",
  "Soori",
  "Amina",
  "Adam",
  "Brook",
  "Bina",
  "Nozomi",
  "Zaid",
  "Aiko",
  "Afsana",
  "Linda",
  "Sara",
  "Manju",
  "Jessica",
  "Robert",
  "Alen",
  "Kahn",
  "Alice"
];
const PERSON_NAME_RE = new RegExp(`\\b(${PERSON_NAME_NORMALIZE_LIST.join("|")})(['’]s)?\\b`, "gi");

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
  finishAttemptBtn: document.getElementById("finishAttemptBtn"),
  feedbackText: document.getElementById("feedbackText"),
  finishPrompt: document.getElementById("finishPrompt"),
  finishPromptMessage: document.getElementById("finishPromptMessage"),
  finishGradeBtn: document.getElementById("finishGradeBtn"),
  finishDiscardBtn: document.getElementById("finishDiscardBtn"),
  thetaText: document.getElementById("thetaText"),
  seText: document.getElementById("seText"),
  ciText: document.getElementById("ciText"),
  scaledText: document.getElementById("scaledText"),
  passProbText: document.getElementById("passProbText"),
  guessSignalText: document.getElementById("guessSignalText"),
  progressGraph: document.getElementById("progressGraph"),
  graphAllBtn: document.getElementById("graphAllBtn"),
  graphIncorrectBtn: document.getElementById("graphIncorrectBtn"),
  graphCorrectBtn: document.getElementById("graphCorrectBtn"),
  finalSummary: document.getElementById("finalSummary"),
  outcomeBanner: document.getElementById("outcomeBanner"),
  domainBreakdown: document.getElementById("domainBreakdown"),
  domainStrengthChart: document.getElementById("domainStrengthChart"),
  analyticsNotes: document.getElementById("analyticsNotes"),
  reviewAllBtn: document.getElementById("reviewAllBtn"),
  reviewIncorrectBtn: document.getElementById("reviewIncorrectBtn"),
  reviewCorrectBtn: document.getElementById("reviewCorrectBtn"),
  explanationReview: document.getElementById("explanationReview"),
  reviewText: document.getElementById("reviewText"),
  reviewTableBody: document.querySelector("#reviewTable tbody"),
  domainTargetGrid: document.getElementById("domainTargetGrid"),
};

const app = {
  bank: null,
  attempt: null,
  timerInterval: null,
  bankStatusInterval: null,
  domainSelectorMap: new Map(),
  graphFilter: "all",
  reviewFilter: "all",
  recentItemIds: [],
  recentStemKeys: [],
};

function createAttemptId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadRecentItemIds() {
  try {
    const raw = localStorage.getItem(RECENT_ITEMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return Array.from(new Set(parsed.map((x) => String(x)))).slice(-RECENT_ITEMS_MAX);
    }

    // One-time migration from legacy keys to preserve anti-repeat history.
    for (const key of LEGACY_RECENT_ITEMS_KEYS) {
      const legacyRaw = localStorage.getItem(key);
      if (!legacyRaw) continue;
      const legacy = JSON.parse(legacyRaw);
      if (!Array.isArray(legacy)) continue;
      const migrated = Array.from(new Set(legacy.map((x) => String(x)))).slice(-RECENT_ITEMS_MAX);
      localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return [];
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

function loadRecentStemKeys() {
  try {
    const raw = localStorage.getItem(RECENT_STEMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return Array.from(new Set(parsed.map((x) => String(x)))).slice(-RECENT_STEMS_MAX);
  } catch {
    return [];
  }
}

function saveRecentStemKeys(keys) {
  try {
    localStorage.setItem(RECENT_STEMS_KEY, JSON.stringify(keys.slice(-RECENT_STEMS_MAX)));
  } catch {
    // Best-effort only.
  }
}

function getItemFamilyKey(item) {
  if (!item) return "";
  return String(item.variantOf || item.id || "");
}

function getStemKey(stem) {
  return String(stem || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function getAttemptedDedupSets() {
  const byId = new Map((app.bank?.items || []).map((item) => [String(item.id), item]));
  const families = new Set();
  const stems = new Set();
  for (const row of app.attempt?.itemsAnswered || []) {
    const bankItem = byId.get(String(row.itemId));
    const familyKey = String(row.familyKey || getItemFamilyKey(bankItem) || row.itemId);
    if (familyKey) families.add(familyKey);
    const stemKey = String(row.stemKey || getStemKey(bankItem?.stem));
    if (stemKey) stems.add(stemKey);
  }
  return { families, stems };
}

function rememberRecentItem(item) {
  const key = getItemFamilyKey(item);
  if (key) {
    const next = app.recentItemIds.filter((x) => x !== key);
    next.push(key);
    app.recentItemIds = next.slice(-RECENT_ITEMS_MAX);
    saveRecentItemIds(app.recentItemIds);
  }

  const stemKey = getStemKey(item?.stem);
  if (stemKey) {
    const nextStem = app.recentStemKeys.filter((x) => x !== stemKey);
    nextStem.push(stemKey);
    app.recentStemKeys = nextStem.slice(-RECENT_STEMS_MAX);
    saveRecentStemKeys(app.recentStemKeys);
  }
}

function filterRecentlySeen(items, minPool = 80) {
  const recent = new Set(app.recentItemIds);
  const recentStems = new Set(app.recentStemKeys);
  const fullyFresh = items.filter((item) =>
    !recent.has(getItemFamilyKey(item))
    && !recentStems.has(getStemKey(item.stem))
  );
  if (fullyFresh.length >= Math.min(minPool, items.length)) return fullyFresh;

  const familyFresh = items.filter((item) => !recent.has(getItemFamilyKey(item)));
  return familyFresh.length >= Math.min(minPool, items.length) ? familyFresh : items;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
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

  if (!bank.sourceCatalog || typeof bank.sourceCatalog !== "object") {
    bank.sourceCatalog = {};
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
    // PBQ types (dragdrop, ordering, hotspot) use correctAnswers/correctOrder
    // instead of correctIndex. For MCQ, validate correctIndex strictly.
    const PBQ_TYPES_PEEK = ["dragdrop", "ordering", "hotspot"];
    if (!PBQ_TYPES_PEEK.includes(item.type)) {
      if (typeof item.correctIndex !== "number" || item.correctIndex < 0 || item.correctIndex >= item.choices.length) {
        throw new Error(`Item ${item.id} has invalid correctIndex.`);
      }
    } else {
      if (typeof item.correctIndex !== "number") item.correctIndex = 0;
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
    item.pilotEligible = item.pilotEligible === true;

    // Source citations are shown in analytics so explanations are auditable.
    item.sourceIds = Array.isArray(item.sourceIds)
      ? item.sourceIds.map((x) => String(x)).filter(Boolean)
      : [];

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

function isNoisyStemText(stem) {
  const text = String(stem || "");
  if (!text) return true;
  const noisyPatterns = [
    /\bconsidering security governance and risk\b/i,
    /\bin this situation\b/i,
    /\bpick the option that best aligns with cissp practice\b/i,
    /\bselect the strongest response\b/i,
    /\bcontrol-gap assess\b/i,
    /\bmeasure-gap assess\b/i,
    /\/\/\s*what is going on/i
  ];
  return noisyPatterns.some((rx) => rx.test(text));
}

function shouldIncludeItemByQuality(item) {
  if (!item || typeof item !== "object") return false;
  if (!INCLUDE_SYNTHETIC_VARIANTS && item.variantOf) return false;
  if (isNoisyStemText(item.stem)) return false;
  if (!Array.isArray(item.choices) || item.choices.length < 2) return false;
  return true;
}

function resolveItemSources(item) {
  const ids = Array.isArray(item?.sourceIds) ? item.sourceIds : [];
  const catalog = app.bank?.sourceCatalog && typeof app.bank.sourceCatalog === "object"
    ? app.bank.sourceCatalog
    : {};
  return ids
    .map((id) => ({ id, ...catalog[id] }))
    .filter((ref) => typeof ref.url === "string" && ref.url.length > 0)
    .map((ref) => ({
      id: String(ref.id),
      title: typeof ref.title === "string" && ref.title.trim() ? ref.title.trim() : String(ref.id),
      url: ref.url,
      publisher: typeof ref.publisher === "string" ? ref.publisher : "",
    }));
}

function renderSourcesHtml(item) {
  const sources = resolveItemSources(item);
  if (!sources.length) {
    return `<p class="small-note source-note">Sources: none provided in bank.</p>`;
  }
  const links = sources.map((ref) => {
    const title = escapeHtml(ref.title);
    const publisher = ref.publisher ? ` (${escapeHtml(ref.publisher)})` : "";
    const url = escapeHtml(ref.url);
    return `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>${publisher}</li>`;
  }).join("");
  return `<div class="source-block"><p class="small-note">Sources</p><ul class="source-list">${links}</ul></div>`;
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
  // Remap PBQ answer keys to post-shuffle positions.
  const newCorrectAnswers = Array.isArray(item.correctAnswers)
    ? item.correctAnswers.map((origIdx) => indexed.findIndex((x) => x.idx === origIdx))
    : undefined;
  const newCorrectOrder = Array.isArray(item.correctOrder)
    ? item.correctOrder.map((origIdx) => indexed.findIndex((x) => x.idx === origIdx))
    : undefined;
  return {
    ...item,
    choices: newChoices,
    correctIndex: newCorrectIndex,
    ...(newCorrectAnswers !== undefined && { correctAnswers: newCorrectAnswers }),
    ...(newCorrectOrder !== undefined && { correctOrder: newCorrectOrder }),
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
  try {
    const bankItems = Array.isArray(app.bank?.items) ? app.bank.items.length : 0;
    const selectedBank = bankItems > 0 && bankItems <= 200 ? app.bank : null;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        bank: selectedBank,
        attempt: app.attempt,
        savedAt: new Date().toISOString(),
        bankItemCount: bankItems,
      })
    );
  } catch (err) {
    console.warn("Failed to persist session state.", err);
  }
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

function startBankStatusLoading() {
  if (!ui.bankStatus) return;
  stopBankStatusLoading();
  const dots = [".", "..", "..."];
  let i = 0;
  ui.bankStatus.textContent = `Loading question bank${dots[i]}`;
  app.bankStatusInterval = setInterval(() => {
    i = (i + 1) % dots.length;
    ui.bankStatus.textContent = `Loading question bank${dots[i]}`;
  }, 350);
}

function stopBankStatusLoading() {
  if (app.bankStatusInterval) {
    clearInterval(app.bankStatusInterval);
    app.bankStatusInterval = null;
  }
}

function showSessionSetupPanel() {
  if (PAGE_VIEW !== "session") return;
  if (ui.setupPanel) ui.setupPanel.classList.remove("hidden");
  if (ui.startBtn) ui.startBtn.classList.remove("hidden");
  if (ui.sessionInfoBtn) ui.sessionInfoBtn.classList.remove("hidden");
  if (ui.bankStatus) ui.bankStatus.classList.remove("hidden");
  if (ui.modeSummaryText) ui.modeSummaryText.classList.remove("hidden");
  if (ui.catMimicNote) ui.catMimicNote.classList.remove("hidden");
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

function toScenarioDifficultyLabel(item) {
  if (typeof item?.difficultyLabel === "string" && item.difficultyLabel.trim()) {
    return item.difficultyLabel.trim().toUpperCase();
  }
  if (typeof item?.difficulty === "number") {
    if (item.difficulty >= 0.7) return "HARD";
    if (item.difficulty <= -0.6) return "EASY";
    return "MEDIUM";
  }
  return "MEDIUM";
}

function inferCoreConceptFromItem(item) {
  const corpus = `${item?.stem || ""} ${item?.explanation || ""}`.toLowerCase();
  const conceptRules = [
    { concept: "residual risk", patterns: ["residual risk", "remaining risk", "risk treatment", "risk acceptance"] },
    { concept: "risk appetite", patterns: ["risk appetite", "risk tolerance", "board tolerance"] },
    { concept: "due diligence", patterns: ["due diligence", "assessment", "evaluate", "investigate"] },
    { concept: "due care", patterns: ["due care", "reasonable care", "prudent"] },
    { concept: "least privilege", patterns: ["least privilege", "minimum privileges", "need-to-know"] },
    { concept: "defense in depth", patterns: ["defense in depth", "layered", "compensating control", "multiple controls"] },
  ];
  const hit = conceptRules.find((rule) => rule.patterns.some((p) => corpus.includes(p)));
  return hit ? hit.concept : "residual risk";
}

function safeConvertItemToScenario(item) {
  if (!SCENARIO_VIEW_ENABLED) return null;
  try {
    return convertQuestionToScenario({
      domain: getCanonicalDomainName(item.domain),
      difficulty: toScenarioDifficultyLabel(item),
      stem: String(item.stem || ""),
      options: Array.isArray(item.choices) ? item.choices.map((x) => String(x)) : [],
      correctIndex: Number(item.correctIndex ?? 0),
      coreConcept: inferCoreConceptFromItem(item),
    });
  } catch (err) {
    console.warn(`Scenario conversion failed for item ${item?.id || "unknown"}.`, err);
    return null;
  }
}

function normalizePresentedText(input) {
  let text = String(input ?? "").trim();
  if (!text) return text;

  // Drop synthetic stem wrappers/suffixes introduced by augmentation/obfuscation.
  const leadJunk = [
    /^\s*considering security governance and (?:risk|exposure),\s*/i,
    /^\s*in this situation,\s*/i,
    /^\s*as the security lead,\s*/i,
    /^\s*from a cissp perspective,\s*/i,
    /^\s*after a (?:control-gap|measure-gap) (?:review|assess|examine),\s*/i,
    /^\s*while planning a (?:measure|control|safeguard) enhancement roadmap,\s*(?:at [^,]+,\s*)?/i,
  ];
  for (const rx of leadJunk) {
    text = text.replace(rx, "");
  }

  const tailJunk = [
    /\s*pick the option that best aligns with cissp practice\.?$/i,
    /\s*select the strongest response\.?$/i,
    /\s*select the most defensible answer\.?$/i,
    /\s*select the best answer\.?$/i,
  ];
  for (const rx of tailJunk) {
    text = text.replace(rx, "");
  }

  // De-obfuscate awkward synonym substitutions back to standard CISSP wording.
  const replacements = [
    [/\bwhat option\b/gi, "which"],
    [/\bwhich security control models defines\b/gi, "which security control model defines"],
    [/\baccess measure(s)?\b/gi, "access control$1"],
    [/\bsecurity measure(s)?\b/gi, "security control$1"],
    [/\bsecurity control models\b/gi, "security control models"],
    [/\bsecurity safeguard(s)?\b/gi, "security control$1"],
    [/\bprotective safeguard(s)?\b/gi, "protective control$1"],
    [/\bbest-suited\b/gi, "most appropriate"],
    [/\bmost fitting\b/gi, "most appropriate"],
    [/\bstrongest response\b/gi, "best answer"],
    [/\bmost defensible answer\b/gi, "best answer"],
    [/\bexposure assessment\b/gi, "risk assessment"],
    [/\bexposure treatment\b/gi, "risk treatment"],
    [/\badversarial hazard\b/gi, "threat"],
    [/\bmeasure-gap assess\b/gi, "control-gap assessment"],
    [/\bcontrol-gap assess\b/gi, "control-gap assessment"],
    [/\bresponse process process\b/gi, "response process"],
    [/\bA01:\s*Broken Access Safeguard\b/gi, "A01: Broken Access Control"],
    [/\bTransmission Measure Protocol\b/gi, "Transmission Control Protocol"],
    [/\bInternet Safeguard Message Protocol\b/gi, "Internet Control Message Protocol"],
  ];
  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }
  text = text.replace(PERSON_NAME_RE, (_match, _name, possessive) => (possessive ? "Alex's" : "Alex"));

  if (text) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }
  text = text.replace(/\s{2,}/g, " ").trim();
  return text;
}

function getPresentedPrompt(item) {
  if (SCENARIO_VIEW_ENABLED && (item?.scenario?.title || item?.scenario?.description)) {
    return normalizePresentedText(
      `${item.scenario.title || "Control Decision Scenario"}\n${item.scenario.description || ""}`.trim()
    );
  }
  return normalizePresentedText(item?.stem || "");
}

function getPresentedChoiceText(item, idx) {
  if (!SCENARIO_VIEW_ENABLED) return normalizePresentedText(item?.choices?.[idx] ?? "");
  const decisionText = item?.scenario?.decisions?.[idx]?.text;
  if (typeof decisionText === "string" && decisionText.trim()) return normalizePresentedText(decisionText);
  return normalizePresentedText(item?.choices?.[idx] ?? "");
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

function closeFinishPrompt() {
  if (!ui.finishPrompt) return;
  ui.finishPrompt.classList.add("hidden");
}

function getAnsweredQuestionCount() {
  return app.attempt?.itemsAnswered?.length ?? 0;
}

function getPlannedQuestionCount() {
  return app.attempt?.targetQuestionCount
    || app.attempt?.config?.maxQuestions
    || getAnsweredQuestionCount();
}

function hasCompletedPlannedCount() {
  return getAnsweredQuestionCount() >= getPlannedQuestionCount();
}

function updateFinishAttemptButtonLabel() {
  if (!ui.finishAttemptBtn) return;
  const answered = getAnsweredQuestionCount();
  ui.finishAttemptBtn.textContent = answered > 0 ? `Finish Attempt (${answered} Answered)` : "Finish Attempt";
}

function openFinishPrompt() {
  if (!ui.finishPrompt || !app.attempt) return;
  if (hasCompletedPlannedCount()) {
    finalizeAttemptWithCurrentAnswers();
    return;
  }
  const answered = getAnsweredQuestionCount();
  if (ui.finishPromptMessage) {
    ui.finishPromptMessage.textContent = answered > 0
      ? `Grade ${answered} completed question${answered === 1 ? "" : "s"}, or discard this attempt?`
      : "No questions completed yet. You can discard this attempt.";
  }
  if (ui.finishGradeBtn) {
    ui.finishGradeBtn.disabled = answered === 0;
    ui.finishGradeBtn.textContent = answered > 0
      ? `Grade ${answered} Completed Question${answered === 1 ? "" : "s"}`
      : "Grade Completed Questions";
  }
  ui.finishPrompt.classList.remove("hidden");
}

function discardAttemptAndReturnToSetup() {
  const proceed = window.confirm("Discard this attempt and lose current progress?");
  if (!proceed) return;

  clearSession();
  closeFinishPrompt();

  if (ui.questionPanel) ui.questionPanel.classList.add("hidden");
  if (ui.resultsPanel) ui.resultsPanel.classList.add("hidden");
  if (ui.statsPanel) ui.statsPanel.classList.add("hidden");
  if (ui.setupPanel) ui.setupPanel.classList.remove("hidden");
  if (ui.feedbackText) ui.feedbackText.textContent = "";
  if (ui.domainTargetPanel && getSelectedMode() === "fixed") {
    ui.domainTargetPanel.classList.remove("hidden");
  }
  refreshModeUi();
  updateFinishAttemptButtonLabel();
}

function finalizeAttemptWithCurrentAnswers() {
  if (!app.attempt) return;
  const answered = getAnsweredQuestionCount();
  if (answered === 0) {
    alert("Answer at least one question before grading.");
    return;
  }
  closeFinishPrompt();
  app.attempt.awaitingAdvance = false;
  app.attempt.currentItem = null;
  app.attempt.currentPresentedAtMs = 0;
  stopAttempt("manual_finish");
}

function getSelectedMode() {
  if (ADCM_ACTIVE) return "adcm";
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

  // ADCM overrides: apply after base mode logic
  if (ADCM_ACTIVE) {
    if (ui.customQuizControls) ui.customQuizControls.classList.add("hidden");
    if (ui.domainTargetPanel) ui.domainTargetPanel.classList.add("hidden");
    if (ui.catMimicNote) {
      ui.catMimicNote.classList.remove("hidden");
      ui.catMimicNote.textContent = "ADCM rules: Phase 1 = 20 hard questions distributed evenly across all 8 CISSP domains. Phase 2 = adaptive targeting of weakest domains until ceilings are confirmed or 100 questions administered. All items scored — no unscored slots.";
    }
    if (ui.modeSummaryText) {
      ui.modeSummaryText.textContent = "ADCM: Aggressive Domain Ceiling Mode — diagnostic tool that front-loads hard questions and maps your true competency ceiling across all 8 CISSP domains. Max 100 questions.";
    }
    app.domainSelectorMap.forEach((ref) => {
      ref.checkbox.disabled = true;
      ref.checkbox.checked = true;
    });
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

function isPbqItem(item) {
  return Boolean(item && PBQ_TYPES_SET.has(item.type));
}

function countPbqSeen() {
  if (!app.attempt || !app.bank) return 0;
  const byId = new Map(app.bank.items.map((item) => [item.id, item]));
  return app.attempt.itemsAnswered.reduce((sum, row) => {
    const item = byId.get(row.itemId);
    return sum + (isPbqItem(item) ? 1 : 0);
  }, 0);
}

function isPbqAllowedNow() {
  if (!app.attempt || app.attempt.config.mode !== "cat") return true;
  const answered = app.attempt.itemsAnswered.length;
  const nextQuestionNumber = answered + 1;
  const midpoint = Math.ceil((app.attempt.config.minQuestions ?? 100) / 2);
  const pbqSeen = countPbqSeen();
  return nextQuestionNumber >= midpoint
    && pbqSeen < PBQ_MAX_PER_ATTEMPT
    && app.attempt.theta >= PBQ_THETA_MIN;
}

function initDomainCeilings() {
  const state = {};
  for (const d of DOMAIN_BLUEPRINT) {
    state[d.name] = {
      attempted: 0,
      correct: 0,
      targetDiff: 0.0,       // start probing at medium difficulty
      ceilingConfirmed: false,
      ceiling: null,
      weak: false,           // true = struggling → give more volume
    };
  }
  return state;
}

// Called after every answer in CAT mode. Updates per-domain ceiling state:
// - If you're doing well → push targetDiff up (probe harder next time)
// - If you're failing in the window → confirm ceiling, flag as weak
function updateDomainCeilings(domain, isCorrect) {
  if (!app.attempt.domainCeilings) return;
  const ds = app.attempt.domainCeilings[domain];
  if (!ds || ds.ceilingConfirmed) return;

  ds.attempted++;
  if (isCorrect) ds.correct++;
  if (ds.attempted < DC_MIN_ATTEMPTS) return;

  const history = app.attempt.itemsAnswered
    .filter(r => r.domain === domain)
    .slice(-DC_WINDOW);
  const recentAcc = history.filter(r => r.correct).length / history.length;

  if (recentAcc < DC_FAIL_RATE) {
    // Consistently failing at this difficulty level — ceiling confirmed here
    ds.ceilingConfirmed = true;
    ds.ceiling = ds.targetDiff;
    ds.weak = true;
    return;
  }

  // Overall weakness check (not ceiling yet, but struggling overall)
  ds.weak = (ds.correct / ds.attempted) < DC_FAIL_RATE;

  if (recentAcc >= DC_STRONG_RATE) {
    // Strong recent performance — push difficulty up to probe the ceiling
    ds.targetDiff = Math.min(ds.targetDiff + DC_PROBE_STEP, 2.5);
    ds.weak = false;
  }
}

function selectNextItem() {
  if (app.attempt.config.mode === "adcm") return selectNextItemADCM();
  if (app.attempt.config.mode === "fixed") {
    return selectNextItemFixed();
  }

  const attempted = getAttemptedDedupSets();
  const candidates = app.bank.items.filter((item) =>
    !attempted.families.has(getItemFamilyKey(item))
    && !attempted.stems.has(getStemKey(item.stem))
  );
  if (!candidates.length) return null;
  const eligibleCandidates = filterRecentlySeen(candidates, 90);

  // PBQ pacing: keep them sparse and later in the run so theta/confidence
  // stabilizes first. Also cap to a couple per CAT attempt.
  const scoringPool = isPbqAllowedNow()
    ? eligibleCandidates
    : eligibleCandidates.filter((item) => !PBQ_TYPES_SET.has(item.type));

  const domainStats = summarizeDomainStats(app.attempt.itemsAnswered);
  const nextQuestionNumber = app.attempt.itemsAnswered.length + 1;
  const isUnscoredSlot = app.attempt.unscoredPositions.includes(nextQuestionNumber);
  const pilotUnscoredBoost = 0.035; // intentionally slight; keeps realism without distorting CAT.

  // Theta-aware judgment weighting. As theta rises toward and above the pass cut
  // (theta ≈ 1.0 = scaled 700), the real CISSP deliberately presents more
  // ambiguous "best answer" items where judgment matters more than recall.
  // judgmentBoostStrength ramps from 0 at theta=-3 to a max near the pass cut
  // and above — replicating the "you feel like you know nothing" ISC2 effect.
  const passCutTheta = scaledToTheta(700); // ≈ 1.0
  const judgmentBoostStrength = clamp((app.attempt.theta - (-1)) / (passCutTheta - (-1)), 0, 1) * 0.18;

  // Correct-streak complexity boost: consecutive correct answers progressively
  // prefer longer, wordier, more complex question stems — matching how the real
  // CISSP escalates textual complexity on a hot streak. Stem word count is used
  // as the complexity proxy (r ≈ -0.09 vs difficulty, so nearly independent signal).
  // Streak 0 = no boost. Streak ≥ 5 = full boost (0.10 weight toward longest stems).
  let correctStreak = 0;
  for (let i = app.attempt.itemsAnswered.length - 1; i >= 0; i--) {
    if (app.attempt.itemsAnswered[i].correct) correctStreak++;
    else break;
  }
  const complexityBoostStrength = clamp(correctStreak / 5, 0, 1) * 0.10;

  // Domain blueprint enforcement: the first 100 questions MUST track CISSP's
  // official domain weights (D1=16%, D2=10%, D3-D5-D7=13%, D4=13%, D6=12%, D8=10%).
  // Strong enforcement in base phase (Q1–100); adaptive extension (Q101–150)
  // relaxes it so the CAT can target weak domains freely.
  const isBasePhase = nextQuestionNumber <= 100;
  const domainDeficitMultiplier = isBasePhase ? 0.14 : 0.06;
  const domainDeficitCap = isBasePhase ? 0.55 : 0.35;

  const scored = scoringPool.map((item) => {
    const domain = getCanonicalDomainName(item.domain);
    const blueprint = DOMAIN_BLUEPRINT.find((d) => d.name === domain);

    const info = itemInformation(app.attempt.theta, item);
    const currentCount = domainStats.get(domain)?.total ?? 0;

    let domainBoost = 0;
    if (blueprint) {
      const targetByNow = (blueprint.pct / 100) * nextQuestionNumber;
      const deficit = targetByNow - currentCount;
      domainBoost = clamp(deficit * domainDeficitMultiplier, -0.2, domainDeficitCap);
    }

    // At low theta: knowledge items are slightly preferred (establish baseline).
    // At high theta: judgment/scenario items are boosted — tests managerial thinking.
    // impliedKnowledge items get a small flat boost at all levels (always include
    // some — they're the most CISSP-authentic and create realistic uncertainty).
    const jLevel = item.judgmentLevel ?? 2;
    const judgmentBoost = judgmentBoostStrength * (jLevel - 1) * 0.5;
    const impliedBoost = item.impliedKnowledge ? 0.04 : 0;
    const pilotBoost = isUnscoredSlot && item.pilotEligible ? pilotUnscoredBoost : 0;

    // Stem word count normalized to [0,1] using p10=28 and p99=104 from the bank.
    // Capped at 1 so outliers don't dominate. Combined with correctStreak ramp.
    const wordCount = item.stem?.split(/\s+/).length ?? 30;
    const complexityBoost = complexityBoostStrength * clamp((wordCount - 28) / 76, 0, 1);

    // Per-domain ceiling boost/penalty:
    // - Weak domain (struggling, no ceiling yet) → big positive boost = more volume
    // - Ceiling confirmed → penalty = de-prioritize, budget shifts elsewhere
    // - Doing well but ceiling not confirmed → prefer items at/above targetDiff to probe harder
    // - Super-long items (superLong=true): only served when targetDiff >= 1.2 (high ceiling)
    // - Ambiguous items (ambiguous=true): preferred on correct streak ≥ 3 (test without keyword anchors)
    let ceilingBoost = 0;
    if (app.attempt.domainCeilings) {
      const dc = app.attempt.domainCeilings[domain];
      if (dc) {
        if (dc.ceilingConfirmed) {
          ceilingBoost = -DC_CEIL_PENALTY;
        } else if (dc.weak) {
          ceilingBoost = DC_WEAK_BOOST;
        } else if (dc.attempted >= DC_MIN_ATTEMPTS) {
          const delta = item.difficulty - dc.targetDiff;
          ceilingBoost = delta >= 0
            ? clamp(0.15 - delta * 0.06, 0, 0.15)
            : clamp(delta * 0.08, -0.12, 0);
        }

        // Super-long items: only surface when the test-taker has confirmed high
        // competency in this domain (targetDiff >= 1.2). Before that threshold,
        // penalise heavily so they don't appear prematurely.
        // If the last answer was wrong, drop back — simpler items get priority.
        if (item.superLong) {
          const lastWasWrong = app.attempt.itemsAnswered.length > 0
            && !app.attempt.itemsAnswered[app.attempt.itemsAnswered.length - 1].correct;
          if (lastWasWrong) {
            ceilingBoost -= 0.70; // wrong answer → drop back down, not super-long
          } else {
            ceilingBoost += dc.targetDiff >= 1.2 ? 0.28 : -0.60;
          }
        }

        // Ambiguous items (qualifier/role-anchor stripped): boost when on a
        // correct streak of ≥ 3 — tests real understanding without keyword anchors.
        // Wrong last answer → penalise; struggling domain → penalise.
        if (item.ambiguous) {
          const lastWasWrong = app.attempt.itemsAnswered.length > 0
            && !app.attempt.itemsAnswered[app.attempt.itemsAnswered.length - 1].correct;
          if (lastWasWrong || dc.weak) {
            ceilingBoost -= 0.25;
          } else {
            ceilingBoost += correctStreak >= 3 ? 0.18 : 0;
          }
        }

        // Noise-wrapped items: also step back after a wrong answer in this domain.
        // The test-taker needs a cleaner question to rebuild confidence first.
        if (item.noiseWrapped) {
          const domainHistory = app.attempt.itemsAnswered.filter(r => r.domain === domain);
          const lastDomainAnswer = domainHistory[domainHistory.length - 1];
          if (lastDomainAnswer && !lastDomainAnswer.correct) {
            ceilingBoost -= 0.30;
          }
        }
      }
    }

    return {
      item,
      score: info + domainBoost + judgmentBoost + impliedBoost + pilotBoost + complexityBoost + ceilingBoost + Math.random() * 0.02,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return pickRankWeighted(scored, 0.42, 16, 80);
}

function selectNextItemFixed() {
  const selectedDomains = new Set(app.attempt.config.selectedDomains || []);
  const attempted = getAttemptedDedupSets();
  const candidates = app.bank.items.filter((item) => {
    if (attempted.families.has(getItemFamilyKey(item))) return false;
    if (attempted.stems.has(getStemKey(item.stem))) return false;
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
  if (app.attempt.config.mode === "adcm") {
    if (n >= ADCM_MAX_QUESTIONS) return true;
    const adcm = app.attempt.adcmState;
    if (!adcm) return n >= 80;
    return Object.values(adcm.domainData).every((d) => d.ceilingConfirmed);
  }
  if (app.attempt.config.mode === "fixed") {
    return n >= (app.attempt.targetQuestionCount || app.attempt.config.maxQuestions);
  }

  const { minQuestions, maxQuestions } = app.attempt.config;
  if (n >= maxQuestions) return true;
  if (n < minQuestions) return false;

  // Secondary stop: all 8 domain ceilings confirmed — complete picture obtained.
  if (app.attempt.domainCeilings) {
    const allConfirmed = Object.values(app.attempt.domainCeilings).every(d => d.ceilingConfirmed);
    if (allConfirmed) return true;
  }

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
  polyline.setAttribute("opacity", app.graphFilter === "all" ? "1" : "0.35");
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
    const faded =
      (app.graphFilter === "incorrect" && !isIncorrectScored)
      || (app.graphFilter === "correct" && !isCorrect);

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
  const isCat = mode === "cat" || mode === "adcm";
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

  if (ui.scoredTrackerText) {
    if (app.attempt.config.mode === "adcm") {
      const adcmSt = app.attempt.adcmState;
      const confirmed = adcmSt ? Object.values(adcmSt.domainData).filter(d => d.ceilingConfirmed).length : 0;
      ui.scoredTrackerText.textContent = `ADCM: ${n} answered | Ceilings: ${confirmed}/8`;
    } else {
      ui.scoredTrackerText.textContent = `Scored: ${scoredCount} | Unscored: ${unscoredCount}`;
    }
  }
  if (ui.unscoredRuleText) {
    if (app.attempt.config.mode === "adcm") {
      ui.unscoredRuleText.textContent = "ADCM: All items scored — no unscored slots";
    } else {
      ui.unscoredRuleText.textContent =
        app.attempt.config.mode === "cat"
          ? `Unscored markers shown on graph`
          : "All items scored in custom mode";
    }
  }
  if (ui.ciStopText) {
    if (app.attempt.config.mode === "adcm") {
      const adcmSt = app.attempt.adcmState;
      const confirmed = adcmSt ? Object.values(adcmSt.domainData).filter(d => d.ceilingConfirmed).length : 0;
      const phase = adcmSt?.phase ?? 1;
      ui.ciStopText.textContent = `ADCM Phase ${phase} | Domain ceilings confirmed: ${confirmed}/8 | Cap: ${ADCM_MAX_QUESTIONS} questions`;
    } else {
      ui.ciStopText.textContent =
        app.attempt.config.mode === "cat"
          ? `Stop rule: 95% CI clears pass cut (${thetaToScaled(scaledToTheta(700)).toFixed(0)}). Borderline candidates run to 150.`
          : `Custom Quiz Stop Rule: ${app.attempt.targetQuestionCount || app.attempt.config.maxQuestions} questions`;
    }
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

// --- PBQ Rendering and Scoring Helpers ---

function moveOrderingItem(li, direction) {
  const list = li.parentElement;
  if (direction === -1 && li.previousElementSibling) {
    list.insertBefore(li, li.previousElementSibling);
  } else if (direction === 1 && li.nextElementSibling) {
    list.insertBefore(li.nextElementSibling, li);
  }
}

function renderDragDropQuestion(item) {
  const hint = document.createElement("p");
  hint.className = "pbq-hint";
  hint.textContent = "Select all correct answers — click each item to toggle selection.";
  ui.choicesForm.appendChild(hint);
  item.choices.forEach((choice, idx) => {
    const chip = document.createElement("div");
    chip.className = "dragdrop-chip";
    chip.dataset.idx = String(idx);
    chip.textContent = getPresentedChoiceText(item, idx);
    chip.addEventListener("click", () => chip.classList.toggle("dragdrop-selected"));
    ui.choicesForm.appendChild(chip);
  });
}

function renderOrderingQuestion(item) {
  const hint = document.createElement("p");
  hint.className = "pbq-hint";
  hint.textContent = "Arrange items in the correct sequence — use ↑ ↓ to reorder.";
  ui.choicesForm.appendChild(hint);
  const list = document.createElement("ol");
  list.className = "ordering-list";
  list.id = "orderingList";
  item.choices.forEach((choice, idx) => {
    const li = document.createElement("li");
    li.className = "ordering-item";
    li.dataset.idx = String(idx);
    const text = document.createElement("span");
    text.className = "ordering-text";
    text.textContent = getPresentedChoiceText(item, idx);
    const btns = document.createElement("div");
    btns.className = "ordering-btns";
    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "order-btn";
    upBtn.textContent = "↑";
    upBtn.addEventListener("click", () => moveOrderingItem(li, -1));
    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.className = "order-btn";
    downBtn.textContent = "↓";
    downBtn.addEventListener("click", () => moveOrderingItem(li, 1));
    btns.append(upBtn, downBtn);
    li.append(text, btns);
    list.appendChild(li);
  });
  ui.choicesForm.appendChild(list);
}

function getDragDropAnswer() {
  return Array.from(ui.choicesForm.querySelectorAll(".dragdrop-chip.dragdrop-selected"))
    .map((chip) => Number(chip.dataset.idx))
    .sort((a, b) => a - b);
}

function getOrderingAnswer() {
  return Array.from(ui.choicesForm.querySelectorAll(".ordering-item"))
    .map((li) => Number(li.dataset.idx));
}

function lockPbqInputs() {
  ui.choicesForm.querySelectorAll(".dragdrop-chip").forEach((chip) => {
    chip.style.pointerEvents = "none";
    chip.style.cursor = "default";
  });
  ui.choicesForm.querySelectorAll(".order-btn").forEach((btn) => {
    btn.disabled = true;
  });
}

// --- End PBQ Helpers ---

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
  if (ui.progressText) {
    if (app.attempt.config.mode === "adcm" && app.attempt.adcmState) {
      const adcmSt = app.attempt.adcmState;
      const confirmed = Object.values(adcmSt.domainData).filter((d) => d.ceilingConfirmed).length;
      const phaseLabel = adcmSt.phase === 1
        ? `Phase 1 — Domain Stress Test (${qNum}/${ADCM_PHASE1_COUNT})`
        : `Phase 2 — Ceiling Detection`;
      ui.progressText.textContent = `${phaseLabel} | Q${qNum} | Ceilings confirmed: ${confirmed}/8`;
    } else {
      ui.progressText.textContent = `Question ${qNum} / ${totalPlanned}${app.attempt.config.mode === "cat" && isUnscoredPlanned ? " (UNSCORED ITEM)" : ""}`;
    }
  }
  if (ui.domainText) ui.domainText.textContent = getCanonicalDomainName(item.domain);
  if (ui.difficultyText) ui.difficultyText.textContent = `Difficulty: ${difficultyBand(item.difficulty)}`;
  ui.questionStem.textContent = getPresentedPrompt(item);
  ui.choicesForm.innerHTML = "";
  ui.feedbackText.textContent = "";
  updateFinishAttemptButtonLabel();

  if (item.type === "dragdrop") {
    renderDragDropQuestion(item);
  } else if (item.type === "ordering") {
    renderOrderingQuestion(item);
  } else {
    item.choices.forEach((choice, idx) => {
      const label = document.createElement("label");
      label.className = "choice";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "choice";
      input.value = String(idx);

      const span = document.createElement("span");
      span.textContent = getPresentedChoiceText(item, idx);

      label.append(input, span);
      ui.choicesForm.append(label);
    });
  }

  app.attempt.currentPresentedAtMs = Date.now();
  ui.questionPanel.classList.remove("hidden");
  if (ui.setupPanel) ui.setupPanel.classList.add("hidden");
  if (ui.domainTargetPanel) ui.domainTargetPanel.classList.add("hidden");
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
  if (item.type === "dragdrop") {
    lockPbqInputs();
    const correctSet = new Set(row.correctAnswers || []);
    const selectedSet = new Set(row.selectedAnswers || []);
    ui.choicesForm.querySelectorAll(".dragdrop-chip").forEach((chip) => {
      const idx = Number(chip.dataset.idx);
      chip.classList.remove("dragdrop-correct", "dragdrop-wrong", "dragdrop-missed");
      if (correctSet.has(idx) && selectedSet.has(idx)) chip.classList.add("dragdrop-correct");
      else if (!correctSet.has(idx) && selectedSet.has(idx)) chip.classList.add("dragdrop-wrong");
      else if (correctSet.has(idx) && !selectedSet.has(idx)) chip.classList.add("dragdrop-missed");
    });
  } else if (item.type === "ordering") {
    lockPbqInputs();
    const correctOrder = row.correctOrder || item.correctOrder || [];
    const submittedOrder = row.selectedOrder || [];
    Array.from(ui.choicesForm.querySelectorAll(".ordering-item")).forEach((li, position) => {
      li.classList.remove("ordering-correct", "ordering-wrong");
      li.classList.add(submittedOrder[position] === correctOrder[position] ? "ordering-correct" : "ordering-wrong");
    });
  } else {
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
  }

  const verdict = row.correct ? "Correct." : "Incorrect.";
  const explanation = normalizePresentedText(row.explanation || item.explanation || "No explanation provided in bank.");
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
    const item = app.bank?.items?.find((x) => x.id === row.itemId);
    const src = item ? resolveItemSources(item).map((s) => s.url).join(" | ") : "";
    lines.push(`Q${row.questionNumber} (${row.itemId}): ${normalizePresentedText(row.explanation || "No explanation provided in bank.")}${src ? ` | Sources: ${src}` : ""}`);
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
      <td>${normalizePresentedText(row.explanation || "")}</td>
    `;
    ui.reviewTableBody.appendChild(tr);
  });
}

function renderExplanationReview() {
  if (!ui.explanationReview || !app.bank) return;
  const itemMap = new Map(app.bank.items.map((item) => [item.id, item]));
  const matchesReviewFilter = (row) =>
    app.reviewFilter === "all"
    || (app.reviewFilter === "incorrect" && row.correct === false)
    || (app.reviewFilter === "correct" && row.correct === true);
  ui.explanationReview.innerHTML = app.attempt.itemsAnswered
    .filter(matchesReviewFilter)
    .map((row) => {
      const item = itemMap.get(row.itemId);
      if (!item) return "";
      const choices = item.choices || [];
      let rows;
      if (item.type === "dragdrop") {
        const correctSet = new Set(row.correctAnswers || []);
        const selectedSet = new Set(row.selectedAnswers || []);
        rows = choices.map((choice, idx) => {
          const presentedChoice = getPresentedChoiceText(item, idx);
          const isCorr = correctSet.has(idx);
          const isSel = selectedSet.has(idx);
          let cls = "explain-choice";
          let badge = "";
          if (isCorr && isSel) { cls += " explain-correct"; badge = "Correct"; }
          else if (!isCorr && isSel) { cls += " explain-selected-wrong"; badge = "Wrong selection"; }
          else if (isCorr && !isSel) { cls += " explain-missed"; badge = "Should have selected"; }
          return `<li class="${cls}"><span>${escapeHtml(presentedChoice)}</span>${badge ? `<em>${badge}</em>` : ""}</li>`;
        }).join("");
      } else if (item.type === "ordering") {
        const correctOrder = row.correctOrder || item.correctOrder || [];
        const submittedOrder = row.selectedOrder || [];
        rows = correctOrder.map((correctIdx, position) => {
          const submittedIdx = submittedOrder[position];
          const isCorrectPos = submittedIdx === correctIdx;
          const cls = "explain-choice" + (isCorrectPos ? " explain-correct" : " explain-selected-wrong");
          const yourLabel = submittedIdx != null ? escapeHtml(getPresentedChoiceText(item, submittedIdx)) : "?";
          const badge = isCorrectPos ? "Correct position" : `You placed: ${yourLabel}`;
          return `<li class="${cls}"><span>${position + 1}. ${escapeHtml(getPresentedChoiceText(item, correctIdx))}</span><em>${badge}</em></li>`;
        }).join("");
      } else {
        rows = choices.map((choice, idx) => {
          const presentedChoice = getPresentedChoiceText(item, idx);
          let cls = "explain-choice";
          if (idx === row.correctIndex) cls += " explain-correct";
          if (idx === row.selectedIndex && row.selectedIndex !== row.correctIndex) cls += " explain-selected-wrong";
          const badge = idx === row.correctIndex ? "Correct" : idx === row.selectedIndex ? "Your Answer" : "";
          return `<li class="${cls}"><span>${escapeHtml(presentedChoice)}</span>${badge ? `<em>${badge}</em>` : ""}</li>`;
        }).join("");
      }
      const qTypeLabel = item.type === "dragdrop" ? " [Select All That Apply]" : item.type === "ordering" ? " [Order Response]" : "";
      return `<article class="explain-card"><h4>Q${row.questionNumber}${qTypeLabel}</h4><p>${escapeHtml(getPresentedPrompt(item))}</p><ul>${rows}</ul><p class="small-note">${escapeHtml(normalizePresentedText(row.explanation || "No explanation provided in bank."))}</p>${renderSourcesHtml(item)}</article>`;
    })
    .join("");
}

function setActiveFilterButtons() {
  if (ui.graphAllBtn) ui.graphAllBtn.classList.toggle("active", app.graphFilter === "all");
  if (ui.graphIncorrectBtn) ui.graphIncorrectBtn.classList.toggle("active", app.graphFilter === "incorrect");
  if (ui.graphCorrectBtn) ui.graphCorrectBtn.classList.toggle("active", app.graphFilter === "correct");
  if (ui.reviewAllBtn) ui.reviewAllBtn.classList.toggle("active", app.reviewFilter === "all");
  if (ui.reviewIncorrectBtn) ui.reviewIncorrectBtn.classList.toggle("active", app.reviewFilter === "incorrect");
  if (ui.reviewCorrectBtn) ui.reviewCorrectBtn.classList.toggle("active", app.reviewFilter === "correct");
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
    if (app.attempt.config.mode === "adcm") {
      ui.outcomeBanner.textContent = "ADCM Diagnostic Complete — Domain Ceiling Report below.";
      ui.outcomeBanner.className = "outcome adcm-complete";
    } else if (app.attempt.config.mode === "fixed") {
      ui.outcomeBanner.textContent = "";
      ui.outcomeBanner.className = "outcome hidden";
    } else {
      ui.outcomeBanner.textContent =
        scaled >= passCut
          ? "Congratulations, you have provisionally passed."
          : "Unfortunately, you did not pass.";
      ui.outcomeBanner.className = scaled >= passCut ? "outcome pass" : "outcome fail";
    }
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
    if (app.attempt.config.mode === "adcm") {
      const adcmSt = app.attempt.adcmState;
      const confirmed = adcmSt ? Object.values(adcmSt.domainData).filter((d) => d.ceilingConfirmed).length : 0;
      ui.analyticsNotes.textContent = `ADCM diagnostic stopped. Reason: ${stopReason}. Domain ceilings confirmed: ${confirmed}/8.`;
    } else {
      ui.analyticsNotes.textContent =
        app.attempt.config.mode === "cat"
          ? `CAT stopped automatically by adaptive rules. Stop reason: ${stopReason}.`
          : `Custom quiz completed at configured question count (${app.attempt.targetQuestionCount || app.attempt.config.maxQuestions}).`;
    }
  }

  if (ui.reviewText) ui.reviewText.value = buildReviewText();
  renderReviewTable();
  renderExplanationReview();
  setActiveFilterButtons();

  // Inject ADCM domain ceiling report at the top of results
  if (app.attempt.config.mode === "adcm") {
    let adcmContainer = document.getElementById("adcmResultsContainer");
    if (!adcmContainer) {
      adcmContainer = document.createElement("div");
      adcmContainer.id = "adcmResultsContainer";
      if (ui.resultsPanel) ui.resultsPanel.insertBefore(adcmContainer, ui.resultsPanel.firstChild);
    }
    adcmContainer.innerHTML = renderADCMResults();
  }
  if (ui.resultsPanel) ui.resultsPanel.classList.remove("hidden");
  if (ui.questionPanel) ui.questionPanel.classList.add("hidden");
  if (ui.setupPanel) ui.setupPanel.classList.add("hidden");
  if (ui.domainTargetPanel) ui.domainTargetPanel.classList.add("hidden");
  closeFinishPrompt();
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
    if (hasCompletedPlannedCount() && app.attempt.config.mode === "fixed") {
      finalizeAttemptWithCurrentAnswers();
      return;
    }
    advanceAfterAnswer();
    return;
  }

  const item = app.attempt.currentItem;
  let correct, selectedIndex, selectedAnswers, selectedOrder;

  if (item.type === "dragdrop") {
    selectedAnswers = getDragDropAnswer();
    if (selectedAnswers.length === 0) {
      ui.feedbackText.textContent = "Select at least one answer first.";
      return;
    }
    const correctSorted = [...(item.correctAnswers || [])].sort((a, b) => a - b);
    correct = correctSorted.length === selectedAnswers.length &&
      correctSorted.every((v, i) => v === selectedAnswers[i]);
    selectedIndex = -1;
  } else if (item.type === "ordering") {
    selectedOrder = getOrderingAnswer();
    correct = (item.correctOrder || []).every((v, i) => v === selectedOrder[i]);
    selectedIndex = -1;
  } else {
    const selected = ui.choicesForm.querySelector("input[name='choice']:checked");
    if (!selected) {
      ui.feedbackText.textContent = "Select an answer first.";
      return;
    }
    selectedIndex = Number(selected.value);
    correct = selectedIndex === item.correctIndex;
  }

  const elapsedSec = (Date.now() - app.attempt.currentPresentedAtMs) / 1000;
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
    familyKey: getItemFamilyKey(item),
    stemKey: getStemKey(item.stem),
    itemType: item.type ?? "mcq",
    domain: getCanonicalDomainName(item.domain),
    correct,
    partialScore,
    maxScore: item.maxScore ?? 1,
    scored,
    selectedIndex,
    correctIndex: item.correctIndex,
    ...(selectedAnswers !== undefined && { selectedAnswers, correctAnswers: item.correctAnswers }),
    ...(selectedOrder !== undefined && { selectedOrder, correctOrder: item.correctOrder }),
    elapsedSec,
    difficulty: item.difficulty,
    difficultyBand: difficultyBand(item.difficulty),
    discrimination: item.discrimination,
    explanation: item.explanation || "",
    sourceIds: item.sourceIds || [],
    fastGuessSignal,
    answeredAt: new Date().toISOString(),
    scaledAfter,
  });
  rememberRecentItem(item);

  if (app.attempt.config.mode === "cat") {
    updateDomainCeilings(getCanonicalDomainName(item.domain), correct);
  }
  if (app.attempt.config.mode === "adcm") {
    updateADCMState(
      getCanonicalDomainName(item.domain),
      item,
      correct,
      app.attempt.itemsAnswered.length
    );
  }

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
  const pool = filterRecentlySeen(app.bank.items, 110).filter((item) => !isPbqItem(item));
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

// ─────────────────────────────────────────────────────────────────────────────
// ADCM — Aggressive Domain Ceiling Mode
// ─────────────────────────────────────────────────────────────────────────────

function initADCMState() {
  const domainData = {};
  for (const d of DOMAIN_BLUEPRINT) {
    domainData[d.name] = {
      attempted: 0,
      correct: 0,
      targetDiff: 1.0,         // starts in Hard territory
      streak: 0,               // positive = consecutive correct, negative = consecutive wrong
      ceilingConfirmed: false,
      ceiling: null,           // difficulty value once ceiling is confirmed
      recentResults: [],       // last 5: { diff: number, correct: boolean }
    };
  }
  return { phase: 1, domainData };
}

function adcmDomainAccuracy(ds) {
  return ds.attempted > 0 ? ds.correct / ds.attempted : 0.5;
}

function adcmOpenDomains(adcmState) {
  return DOMAIN_BLUEPRINT.map((d) => d.name)
    .filter((name) => !adcmState.domainData[name]?.ceilingConfirmed);
}

function updateADCMState(domainName, item, correct, totalAnswered) {
  const adcm = app.attempt.adcmState;
  if (!adcm) return;
  const ds = adcm.domainData[domainName];
  if (!ds) return;

  ds.attempted++;
  if (correct) ds.correct++;

  // Streak: positive = correct run, negative = wrong run (reset on direction change)
  ds.streak = correct
    ? (ds.streak < 0 ? 1 : ds.streak + 1)
    : (ds.streak > 0 ? -1 : ds.streak - 1);

  ds.recentResults.push({ diff: item.difficulty, correct });
  if (ds.recentResults.length > 5) ds.recentResults.shift();

  if (!ds.ceilingConfirmed) {
    // Adjust target difficulty on 2-streak (reset streak counter after adjustment)
    if (ds.streak >= 2) {
      ds.targetDiff = Math.min(2.0, ds.targetDiff + ADCM_DIFF_STEP);
      ds.streak = 0;
    } else if (ds.streak <= -2) {
      ds.targetDiff = Math.max(-0.5, ds.targetDiff - ADCM_DIFF_STEP);
      ds.streak = 0;
    }

    // Ceiling confirmation requires ADCM_MIN_ATTEMPTS and a stable stability window
    if (ds.attempted >= ADCM_MIN_ATTEMPTS) {
      const windowSlice = ds.recentResults.slice(-ADCM_CEIL_WINDOW);
      if (windowSlice.length >= ADCM_CEIL_WINDOW) {
        const windowAcc = windowSlice.filter((r) => r.correct).length / windowSlice.length;
        // Consistently failing at current level → ceiling is at or below current target
        if (windowAcc < ADCM_CEIL_PASS_RATE && ds.targetDiff <= 0.0) {
          ds.ceilingConfirmed = true;
          ds.ceiling = Math.max(-1.0, ds.targetDiff);
        }
        // Consistently passing at high difficulty → near-max ceiling confirmed
        if (windowAcc >= ADCM_CEIL_PASS_RATE && ds.targetDiff >= 1.5) {
          ds.ceilingConfirmed = true;
          ds.ceiling = ds.targetDiff;
        }
      }
      // Force confirmation after 8+ per-domain attempts regardless of stability
      if (ds.attempted >= 8 && !ds.ceilingConfirmed) {
        const overallAcc = ds.correct / ds.attempted;
        ds.ceilingConfirmed = true;
        ds.ceiling = overallAcc >= ADCM_CEIL_PASS_RATE
          ? ds.targetDiff
          : Math.max(-1.0, ds.targetDiff - ADCM_DIFF_STEP);
      }
    }
  }

  // Phase 1 → Phase 2 transition after ADCM_PHASE1_COUNT questions answered
  if (adcm.phase === 1 && totalAnswered >= ADCM_PHASE1_COUNT) {
    adcm.phase = 2;
  }
}

function selectADCMPhase1Item(pool) {
  // Distribute evenly across all 8 domains: domain with fewest phase-1 Qs goes next
  const domainCounts = {};
  for (const d of DOMAIN_BLUEPRINT) domainCounts[d.name] = 0;
  for (const row of app.attempt.itemsAnswered) {
    domainCounts[row.domain] = (domainCounts[row.domain] || 0) + 1;
  }

  const domainsByNeed = DOMAIN_BLUEPRINT.map((d) => d.name)
    .sort((a, b) => domainCounts[a] - domainCounts[b]);

  for (const targetDomain of domainsByNeed) {
    const hard = pool.filter((item) =>
      getCanonicalDomainName(item.domain) === targetDomain
      && item.difficulty >= ADCM_HARD_FLOOR
      && item.questionType !== "knowledge"
    );
    if (hard.length > 0) {
      const scored = hard.map((item) => ({
        item,
        score: item.difficulty + (item.judgmentLevel ?? 1) * 0.08 + Math.random() * 0.05,
      })).sort((a, b) => b.score - a.score);
      return pickRankWeighted(scored, 0.3, 5, 20);
    }
  }

  // Fallback: any hard item across all domains
  const hardAny = pool.filter((item) => item.difficulty >= ADCM_HARD_FLOOR);
  if (hardAny.length > 0) {
    const scored = hardAny.map((item) => ({
      item,
      score: item.difficulty + Math.random() * 0.05,
    })).sort((a, b) => b.score - a.score);
    return pickRankWeighted(scored, 0.3, 5, 20);
  }

  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

function selectADCMPhase2Item(pool) {
  const adcm = app.attempt.adcmState;
  const open = adcmOpenDomains(adcm);
  if (!open.length) return null;

  // Rank open domains: weakest (lowest accuracy) gets priority
  const ranked = [...open].sort((a, b) =>
    adcmDomainAccuracy(adcm.domainData[a]) - adcmDomainAccuracy(adcm.domainData[b])
  );

  for (const targetDomain of ranked) {
    const ds = adcm.domainData[targetDomain];
    const target = ds.targetDiff;

    // Items within ±0.4 of target difficulty in this domain
    let domainPool = pool.filter((item) =>
      getCanonicalDomainName(item.domain) === targetDomain
      && Math.abs(item.difficulty - target) <= 0.4
    );

    // Relax difficulty window if pool too small
    if (domainPool.length < 3) {
      domainPool = pool.filter((item) =>
        getCanonicalDomainName(item.domain) === targetDomain
      );
    }

    if (domainPool.length > 0) {
      const scored = domainPool.map((item) => ({
        item,
        score: (1 - Math.abs(item.difficulty - target) * 0.4)
          + (item.questionType === "judgment" ? 0.15 : item.questionType === "scenario" ? 0.07 : 0)
          + (item.judgmentLevel ?? 1) * 0.06
          + Math.random() * 0.04,
      })).sort((a, b) => b.score - a.score);
      return pickRankWeighted(scored, 0.3, 5, 20);
    }
  }

  // Fallback: any item from a domain without confirmed ceiling
  const fallback = pool.filter((item) =>
    !adcm.domainData[getCanonicalDomainName(item.domain)]?.ceilingConfirmed
  );
  return fallback.length > 0
    ? fallback[Math.floor(Math.random() * fallback.length)]
    : (pool[Math.floor(Math.random() * pool.length)] ?? null);
}

function selectNextItemADCM() {
  const attempted = getAttemptedDedupSets();
  const candidates = app.bank.items.filter((item) =>
    !attempted.families.has(getItemFamilyKey(item))
    && !attempted.stems.has(getStemKey(item.stem))
    && !isPbqItem(item)
    && shouldIncludeItemByQuality(item)
  );
  if (!candidates.length) return null;

  const eligible = filterRecentlySeen(candidates, 80);
  const pool = eligible.length >= 10 ? eligible : candidates;

  const adcm = app.attempt.adcmState;
  return (!adcm || adcm.phase === 1)
    ? selectADCMPhase1Item(pool)
    : selectADCMPhase2Item(pool);
}

function adcmCeilingLabel(ceiling) {
  if (ceiling === null || ceiling === undefined) return "Not determined";
  if (ceiling >= 1.5) return "Expert (≥1.5)";
  if (ceiling >= 0.9) return "Advanced (0.9–1.4)";
  if (ceiling >= 0.3) return "Intermediate (0.3–0.8)";
  return "Foundational (<0.3)";
}

function adcmFailurePattern(ds) {
  const acc = adcmDomainAccuracy(ds);
  if (acc < 0.30) return "Significant knowledge gap — foundational review required.";
  if (acc < 0.50) return "Knowledge gaps + judgment errors — study then apply in context.";
  if (acc < 0.70) return "Judgment/wording traps — precision reading practice needed.";
  return "Strong performance — ceiling confirmed above passing threshold.";
}

function adcmNextSessionDiff(ds) {
  const acc = adcmDomainAccuracy(ds);
  if (acc < 0.40) return "Begin at Easy (difficulty < 0)";
  if (acc < 0.60) return "Begin at Medium (difficulty 0–0.7)";
  return "Begin at Hard (difficulty > 0.7) — extend ceiling";
}

function renderADCMResults() {
  const adcm = app.attempt?.adcmState;
  if (!adcm) return "";

  const rows = DOMAIN_BLUEPRINT.map((d) => {
    const ds = adcm.domainData[d.name] || { attempted: 0, correct: 0, ceilingConfirmed: false, ceiling: null };
    const acc = adcmDomainAccuracy(ds);
    return {
      name: d.name,
      acc,
      accPct: (acc * 100).toFixed(0),
      attempted: ds.attempted,
      correct: ds.correct,
      ceilingLabel: adcmCeilingLabel(ds.ceiling),
      confirmed: ds.ceilingConfirmed,
      pattern: adcmFailurePattern(ds),
      nextDiff: adcmNextSessionDiff(ds),
    };
  });

  const sortedByWeakness = [...rows].sort((a, b) => a.acc - b.acc);
  const weakest3 = sortedByWeakness.slice(0, 3);

  const tableHtml = `
    <div class="adcm-table-wrap">
      <table class="adcm-results-table">
        <thead><tr>
          <th>Domain</th><th>Asked</th><th>Accuracy</th><th>Ceiling</th><th>Confirmed</th>
        </tr></thead>
        <tbody>${rows.map((r) => `
          <tr class="${r.acc < 0.50 ? "adcm-row-weak" : r.acc >= 0.70 ? "adcm-row-strong" : ""}">
            <td>${escapeHtml(r.name)}</td>
            <td>${r.correct}/${r.attempted}</td>
            <td class="adcm-acc">${r.accPct}%</td>
            <td>${escapeHtml(r.ceilingLabel)}</td>
            <td>${r.confirmed ? "✓ Yes" : "—"}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;

  const weakHtml = `
    <div class="adcm-priority">
      <h4>Priority Focus Areas (Weakest → Strongest)</h4>
      <ol class="adcm-focus-list">${weakest3.map((r) => `
        <li>
          <strong>${escapeHtml(r.name)}</strong>
          <span class="adcm-acc-badge adcm-acc-${r.acc < 0.50 ? "low" : r.acc < 0.70 ? "mid" : "high"}">${r.accPct}%</span>
          <div class="small-note">${escapeHtml(r.pattern)}</div>
          <div class="small-note adcm-next">Next session: ${escapeHtml(r.nextDiff)}</div>
        </li>`).join("")}
      </ol>
    </div>`;

  const totalItems = app.attempt.itemsAnswered.length;
  const totalCorrect = app.attempt.itemsAnswered.filter((x) => x.correct).length;
  const overallAcc = totalItems > 0 ? totalCorrect / totalItems : 0;

  let rec;
  if (overallAcc >= 0.70) {
    rec = "Above threshold overall. Sharpen ambiguity training on the 1–2 weakest domains before your next exam attempt.";
  } else if (overallAcc >= 0.50) {
    rec = "Mixed performance. Prioritize the red domains using scenario and judgment-level practice before re-testing.";
  } else {
    rec = "Below threshold across most domains. Return to foundational CBK review in priority domains before ADCM re-testing.";
  }

  return `
    <section class="adcm-results-section">
      <h3>ADCM Diagnostic Report</h3>
      <p class="small-note adcm-subtitle">Aggressive Domain Ceiling Mode — maps your true competency ceiling per domain using progressive difficulty targeting and domain-specific adaptive selection.</p>
      <p><strong>Overall:</strong> ${totalCorrect}/${totalItems} correct (${(overallAcc * 100).toFixed(0)}%) | Phase reached: ${adcm.phase} | Questions administered: ${totalItems}/${ADCM_MAX_QUESTIONS}</p>
      ${tableHtml}
      ${weakHtml}
      <div class="adcm-rec">
        <h4>Recommendation for Next Session</h4>
        <p>${escapeHtml(rec)}</p>
      </div>
    </section>`;
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
  app.recentStemKeys = loadRecentStemKeys();

  app.attempt = {
    attemptId: createAttemptId(),
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

  if (config.mode === "cat") {
    app.attempt.domainCeilings = initDomainCeilings();
  }
  if (config.mode === "adcm") {
    app.attempt.theta = 1.0;          // start above midpoint for aggressive mode
    app.attempt.unscoredPositions = []; // ADCM scores everything
    app.attempt.durationSec = null;    // no time limit — pure diagnostic
    app.attempt.targetQuestionCount = ADCM_MAX_QUESTIONS;
    app.attempt.adcmState = initADCMState();
  }
  app.attempt.currentItem = config.mode === "adcm"
    ? selectNextItemADCM()
    : config.mode === "cat"
      ? selectFirstItem(config.startTheta)
      : selectNextItemFixed();
  app.attempt.currentPresentedAtMs = Date.now();

  if (!app.attempt.currentItem) {
    alert("Unable to start quiz with current settings.");
    app.attempt = null;
    return;
  }

  saveSession();
  closeFinishPrompt();
  startTickers();
  renderCurrentQuestion();
}

function loadBank(bank) {
  const originalCount = Array.isArray(bank?.items) ? bank.items.length : 0;
  if (Array.isArray(bank?.items)) {
    bank.items = bank.items.filter(shouldIncludeItemByQuality);
  }
  const filteredCount = Array.isArray(bank?.items) ? bank.items.length : 0;
  validateBank(bank);

  // Normalize domains so they align with blueprint labels where possible.
  bank.items = bank.items.map((item) => {
    const shuffled = {
      ...shuffleChoicesForItem(item),
      domain: normalizeDomainName(item.domain),
    };
    const scenario = safeConvertItemToScenario(shuffled);
    return {
      ...shuffled,
      ...(scenario && { scenario }),
    };
  });

  app.bank = bank;
  stopBankStatusLoading();
  if (ui.bankStatus) {
    const qualityMode = INCLUDE_SYNTHETIC_VARIANTS ? "expanded variants ON" : "quality mode";
    ui.bankStatus.textContent = `Question bank loaded (${filteredCount}/${originalCount}, ${qualityMode}) | pass threshold: 700`;
  }
  buildDomainTargetPanel();
  refreshModeUi();
}

// Background-fetch the variants bank (__nw / __ambig / __xl) and merge into
// app.bank without blocking the exam. Called once after the base bank loads.
async function loadVariantsInBackground(pageHref) {
  const candidates = [
    new URL("./question-bank.variants.json",      import.meta.url).href,
    new URL("../cat/question-bank.variants.json",  pageHref).href,
    new URL("./cat/question-bank.variants.json",   pageHref).href,
    new URL("./question-bank.variants.json",       pageHref).href,
  ];
  for (const path of Array.from(new Set(candidates))) {
    try {
      const res = await fetch(path, { cache: "force-cache" });
      if (!res.ok) continue;
      const varBank = await res.json();
      if (!varBank?.variantBank || !Array.isArray(varBank.items)) continue;
      if (!app.bank) return; // base bank gone — abort
      const existingIds = new Set(app.bank.items.map(i => i.id));
      const newItems = varBank.items.filter(i => !existingIds.has(i.id));
      app.bank.items.push(...newItems);
      if (ui.bankStatus) {
        ui.bankStatus.textContent = ui.bankStatus.textContent.replace(
          /\d+ questions?/,
          `${app.bank.items.length} questions`
        );
      }
      return;
    } catch { /* variants are optional — silent fail */ }
  }
}

async function loadDefaultBank() {
  const pageHref = window.location.href;
  // Priority order: quality-fixed (base + synonym variants) → augmented → sample
  // Variants (__nw/__ambig/__xl) are fetched separately in the background.
  const candidates = [
    new URL("./question-bank.quality-fixed.json",       import.meta.url).href,
    new URL("../cat/question-bank.quality-fixed.json",   pageHref).href,
    new URL("./cat/question-bank.quality-fixed.json",    pageHref).href,
    new URL("./question-bank.quality-fixed.json",        pageHref).href,
    new URL("./question-bank.augmented.json",            import.meta.url).href,
    new URL("../cat/question-bank.augmented.json",       pageHref).href,
    new URL("./cat/question-bank.augmented.json",        pageHref).href,
    new URL("./question-bank.augmented.json",            pageHref).href,
    new URL("./question-bank.sample.json",               import.meta.url).href,
    new URL("../cat/question-bank.sample.json",          pageHref).href,
    new URL("./cat/question-bank.sample.json",           pageHref).href,
    new URL("./question-bank.sample.json",               pageHref).href,
    new URL("./question-bank.qa.json",                   import.meta.url).href,
    new URL("../cat/question-bank.qa.json",              pageHref).href,
    new URL("./cat/question-bank.qa.json",               pageHref).href,
    new URL("./question-bank.qa.json",                   pageHref).href,
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
      // Kick off background variant fetch — does not block exam start
      loadVariantsInBackground(pageHref);
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
  if (!payload?.attempt) {
    alert("No saved session found.");
    return;
  }

  // Backward compatibility for older saved payloads that included bank.
  if (payload?.bank) {
    try {
      loadBank(payload.bank);
    } catch (err) {
      alert(`Saved bank invalid: ${String(err.message || err)}`);
      return;
    }
  } else if (!app.bank) {
    alert("Question bank is still loading. Please try Resume again in a moment.");
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
    closeFinishPrompt();
    renderResults();
    return;
  }

  if (!app.attempt.currentItem) {
    app.attempt.currentItem = selectNextItem();
    app.attempt.currentPresentedAtMs = Date.now();
  }

  saveSession();
  closeFinishPrompt();
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
  if (ui.finishAttemptBtn) ui.finishAttemptBtn.addEventListener("click", openFinishPrompt);
  if (ui.finishDiscardBtn) ui.finishDiscardBtn.addEventListener("click", discardAttemptAndReturnToSetup);
  if (ui.finishGradeBtn) ui.finishGradeBtn.addEventListener("click", finalizeAttemptWithCurrentAnswers);
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
  if (ui.graphCorrectBtn) {
    ui.graphCorrectBtn.addEventListener("click", () => {
      app.graphFilter = "correct";
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
  if (ui.reviewCorrectBtn) {
    ui.reviewCorrectBtn.addEventListener("click", () => {
      app.reviewFilter = "correct";
      setActiveFilterButtons();
      renderExplanationReview();
    });
  }
  if (ui.finishPrompt) {
    ui.finishPrompt.addEventListener("click", (event) => {
      if (event.target === ui.finishPrompt) closeFinishPrompt();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !ui.finishPrompt.classList.contains("hidden")) {
        closeFinishPrompt();
      }
    });
  }
}

function init() {
  app.recentItemIds = loadRecentItemIds();
  app.recentStemKeys = loadRecentStemKeys();
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
  showSessionSetupPanel();
  updateFinishAttemptButtonLabel();

  const existing = loadSession();
  if (ui.bankStatus && existing?.attempt) {
    ui.bankStatus.textContent = "Saved CAT session found. Click Resume Session.";
  }
}

init();
startBankStatusLoading();
const bankLoadPromise = loadDefaultBank().catch((err) => {
  stopBankStatusLoading();
  showSessionSetupPanel();
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
    } else {
      // Direct-open fallback: avoid blank session page when no flags/session exist.
      startNewAttempt();
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
