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

const EXAM_DURATION_SEC = 3 * 60 * 60;
const BANK_CACHE_TTL_MS = 5 * 60 * 1000;
const PASS_CUT_SCALED = 700;

let bankCache = null;

export default {
  async fetch(request, env) {
    try {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders() });
      }

      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, "");

      if (request.method === "GET" && path === "/api/cat/health") {
        return json({ ok: true, now: new Date().toISOString() });
      }

      if (request.method === "POST" && path === "/api/cat/session") {
        return createSession(request, env);
      }

      const answerMatch = path.match(/^\/api\/cat\/session\/([^/]+)\/answer$/);
      if (request.method === "POST" && answerMatch) {
        return answerQuestion(request, env, answerMatch[1]);
      }

      const stateMatch = path.match(/^\/api\/cat\/session\/([^/]+)\/state$/);
      if (request.method === "GET" && stateMatch) {
        return getSessionState(env, stateMatch[1]);
      }

      return json({ error: "Not found." }, 404);
    } catch (err) {
      return json({ error: String(err?.message || err) }, 500);
    }
  },
};

async function createSession(request, env) {
  assertKvConfigured(env);
  const bank = await loadBank(env);
  const payload = await safeJson(request);
  const config = normalizeConfig(payload?.config || {});

  const session = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config,
    completed: false,
    stopReason: null,
    theta: config.startTheta,
    totalInformation: 0.44,
    se: 1 / Math.sqrt(0.44),
    askedItemIds: [],
    itemsAnswered: [],
    currentItemId: null,
    scoreHistory: [{ questionNumber: 0, scaled: thetaToScaled(config.startTheta) }],
    unscoredPositions: config.mode === "cat" ? sampleUnscoredPositions() : [],
    targetQuestionCount: config.mode === "fixed" ? config.fixedQuestionCount : config.maxQuestions,
    durationSec: config.mode === "cat" ? EXAM_DURATION_SEC : getCustomDurationSec(config.fixedQuestionCount, config.timedQuiz),
  };

  const nextItem = selectNextItem(session, bank);
  if (!nextItem) {
    return json({ error: "No eligible items for selected parameters." }, 400);
  }
  session.currentItemId = nextItem.id;

  await saveSession(env, session);

  return json({
    sessionId: session.id,
    mode: session.config.mode,
    question: redactQuestion(nextItem),
    metrics: buildMetrics(session),
  });
}

async function answerQuestion(request, env, sessionId) {
  assertKvConfigured(env);
  const bank = await loadBank(env);
  const session = await loadSession(env, sessionId);
  if (!session) return json({ error: "Session not found." }, 404);
  if (session.completed) return json({ error: "Session already completed." }, 409);

  const payload = await safeJson(request);
  const questionId = String(payload?.questionId || "");
  const selectedIndex = Number(payload?.selectedIndex);
  const elapsedSec = Number(payload?.elapsedSec || 0);

  if (!session.currentItemId || questionId !== session.currentItemId) {
    return json({ error: "Question mismatch or stale session state." }, 409);
  }
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0) {
    return json({ error: "selectedIndex must be a non-negative integer." }, 400);
  }

  const item = bank.byId.get(questionId);
  if (!item) return json({ error: "Question not found in bank." }, 404);

  const qNum = session.itemsAnswered.length + 1;
  const correct = selectedIndex === item.correctIndex;
  const scored = session.config.mode !== "cat" || !session.unscoredPositions.includes(qNum);

  if (scored) {
    const p = itemProbability(session.theta, item);
    const info = itemInformation(session.theta, item);
    const a = item.discrimination;
    const c = itemGuessingParam(item);
    const numer = (correct ? 1 : 0) - p;
    const denom = Math.max(p * (1 - p), 1e-6);
    const step = (a * numer) / denom;
    const damp = 1 / (1 + session.totalInformation * 0.7);
    session.theta = clamp(session.theta + step * damp * 0.55, -3, 3);
    session.totalInformation += info;
    session.se = 1 / Math.sqrt(Math.max(session.totalInformation, 1e-6));
    if (c > 0 && !correct) {
      session.theta = Math.max(-3, session.theta - 0.02);
    }
  }

  session.askedItemIds.push(item.id);
  session.itemsAnswered.push({
    questionNumber: qNum,
    itemId: item.id,
    domain: item.domain,
    difficulty: item.difficulty,
    difficultyBand: difficultyBand(item.difficulty),
    selectedIndex,
    correctIndex: item.correctIndex,
    correct,
    scored,
    elapsedSec: Number.isFinite(elapsedSec) ? Math.max(0, elapsedSec) : 0,
    answeredAt: new Date().toISOString(),
  });
  session.scoreHistory.push({ questionNumber: qNum, scaled: thetaToScaled(session.theta) });

  if (shouldStop(session)) {
    session.completed = true;
    session.stopReason = determineStopReason(session);
    session.currentItemId = null;
    session.updatedAt = new Date().toISOString();
    await saveSession(env, session);
    return json({
      completed: true,
      stopReason: session.stopReason,
      metrics: buildMetrics(session),
      summary: buildSummary(session),
    });
  }

  const nextItem = selectNextItem(session, bank);
  if (!nextItem) {
    session.completed = true;
    session.stopReason = "bank_exhausted";
    session.currentItemId = null;
    session.updatedAt = new Date().toISOString();
    await saveSession(env, session);
    return json({
      completed: true,
      stopReason: session.stopReason,
      metrics: buildMetrics(session),
      summary: buildSummary(session),
    });
  }

  session.currentItemId = nextItem.id;
  session.updatedAt = new Date().toISOString();
  await saveSession(env, session);

  return json({
    completed: false,
    result: {
      correct,
      scored,
      explanation: item.explanation || "",
    },
    question: redactQuestion(nextItem),
    metrics: buildMetrics(session),
  });
}

async function getSessionState(env, sessionId) {
  assertKvConfigured(env);
  const session = await loadSession(env, sessionId);
  if (!session) return json({ error: "Session not found." }, 404);

  return json({
    sessionId: session.id,
    completed: session.completed,
    stopReason: session.stopReason,
    metrics: buildMetrics(session),
    summary: session.completed ? buildSummary(session) : null,
  });
}

async function loadBank(env) {
  const now = Date.now();
  if (bankCache && now - bankCache.loadedAt < BANK_CACHE_TTL_MS) {
    return bankCache;
  }

  const bankUrl = env.BANK_URL;
  if (!bankUrl) {
    throw new Error("BANK_URL is not configured.");
  }

  const res = await fetch(bankUrl, { cf: { cacheTtl: 120, cacheEverything: true } });
  if (!res.ok) throw new Error(`Failed to fetch bank: ${res.status}`);

  const raw = await res.json();
  if (!raw || !Array.isArray(raw.items) || raw.items.length < 8) {
    throw new Error("Invalid bank payload.");
  }

  const items = raw.items.map((it) => normalizeItem(it));
  const byId = new Map(items.map((it) => [it.id, it]));
  bankCache = { loadedAt: now, items, byId, sourceCatalog: raw.sourceCatalog || {} };
  return bankCache;
}

function normalizeItem(item) {
  const normalizedChoices = Array.isArray(item.choices) ? item.choices.map((x) => String(x)) : [];
  return {
    id: String(item.id),
    domain: normalizeDomainName(item.domain),
    stem: String(item.stem || ""),
    choices: normalizedChoices,
    correctIndex: Number(item.correctIndex),
    difficulty: clamp(Number(item.difficulty ?? 0), -3, 3),
    discrimination: clamp(Number(item.discrimination ?? 1), 0.3, 3),
    type: String(item.type || "mcq"),
    guessing: typeof item.guessing === "number" ? item.guessing : 0.25,
    explanation: String(item.explanation || ""),
  };
}

function normalizeConfig(config) {
  const mode = config.mode === "fixed" ? "fixed" : "cat";
  const fixedQuestionCount = clampInt(Number(config.fixedQuestionCount || 75), 1, 200);
  const minQuestions = mode === "cat" ? 100 : fixedQuestionCount;
  const maxQuestions = mode === "cat" ? 150 : fixedQuestionCount;

  return {
    mode,
    minQuestions,
    maxQuestions,
    fixedQuestionCount,
    timedQuiz: mode === "cat" ? true : config.timedQuiz !== false,
    startTheta: typeof config.startTheta === "number" ? clamp(config.startTheta, -3, 3) : 0,
    selectedDomains: Array.isArray(config.selectedDomains)
      ? config.selectedDomains.map((d) => normalizeDomainName(d)).filter(Boolean)
      : DOMAIN_BLUEPRINT.map((d) => d.name),
  };
}

function selectNextItem(session, bank) {
  const asked = new Set(session.askedItemIds);
  let pool = bank.items.filter((item) => !asked.has(item.id));

  if (session.config.mode === "fixed") {
    const selected = new Set(session.config.selectedDomains);
    pool = pool.filter((item) => selected.has(item.domain));
  }
  if (!pool.length) return null;

  if (session.config.mode === "fixed") {
    return selectFixed(pool, session);
  }
  return selectAdaptive(pool, session);
}

function selectFixed(pool, session) {
  const stats = summarizeDomainStats(session.itemsAnswered);
  const scored = pool.map((item) => {
    const total = stats.get(item.domain)?.total ?? 0;
    const under = 1 / (1 + total);
    const targetBand = 0;
    const diffGap = Math.abs(item.difficulty - targetBand);
    return {
      item,
      score: under * 0.35 + (1 / (1 + diffGap)) * 0.55 + rand() * 0.1,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return pickRankWeighted(scored, 0.45, 14, 70)?.item || scored[0].item;
}

function selectAdaptive(pool, session) {
  const stats = summarizeDomainStats(session.itemsAnswered);
  const nextQuestionNumber = session.itemsAnswered.length + 1;
  const domainTargets = new Map(DOMAIN_BLUEPRINT.map((d) => [d.name, d.pct / 100]));

  const scored = pool.map((item) => {
    const info = itemInformation(session.theta, item);
    const domainRow = stats.get(item.domain) || { total: 0 };
    const answered = session.itemsAnswered.length;
    const observedShare = answered > 0 ? domainRow.total / answered : 0;
    const targetShare = domainTargets.get(item.domain) || 0;
    const domainBoost = (targetShare - observedShare) * 0.28;

    const dGap = Math.abs(item.difficulty - session.theta);
    const difficultyBoost = (1 / (1 + dGap)) * 0.2;

    const unscoredBoost = session.unscoredPositions.includes(nextQuestionNumber) ? rand() * 0.04 : 0;

    return {
      item,
      score: info + domainBoost + difficultyBoost + unscoredBoost + rand() * 0.03,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return pickRankWeighted(scored, 0.34, 18, 90)?.item || scored[0].item;
}

function summarizeDomainStats(itemsAnswered) {
  const map = new Map();
  for (const row of itemsAnswered) {
    const existing = map.get(row.domain) || { total: 0, correct: 0, scored: 0 };
    existing.total += 1;
    if (row.correct) existing.correct += 1;
    if (row.scored) existing.scored += 1;
    map.set(row.domain, existing);
  }
  return map;
}

function shouldStop(session) {
  const n = session.itemsAnswered.length;
  if (session.config.mode === "fixed") {
    return n >= session.targetQuestionCount;
  }

  if (n >= session.config.maxQuestions) return true;
  if (n < session.config.minQuestions) return false;

  const ciLow = session.theta - 1.96 * session.se;
  const ciHigh = session.theta + 1.96 * session.se;
  const passTheta = scaledToTheta(PASS_CUT_SCALED);
  return ciLow > passTheta || ciHigh < passTheta;
}

function determineStopReason(session) {
  const n = session.itemsAnswered.length;
  if (session.config.mode === "fixed") return "fixed_question_count_reached";
  if (n >= session.config.maxQuestions) return "max_questions_reached";
  return "confidence_interval_stop";
}

function buildSummary(session) {
  const n = session.itemsAnswered.length;
  const scoredRows = session.itemsAnswered.filter((r) => r.scored);
  const scoredCorrect = scoredRows.filter((r) => r.correct).length;
  const scaled = thetaToScaled(session.theta);
  return {
    questionsAdministered: n,
    scoredQuestions: scoredRows.length,
    scoredCorrect,
    scaledScore: Number(scaled.toFixed(2)),
    passCut: PASS_CUT_SCALED,
    passEstimate: scaled >= PASS_CUT_SCALED,
  };
}

function buildMetrics(session) {
  const scaled = thetaToScaled(session.theta);
  const ciLow = session.theta - 1.96 * session.se;
  const ciHigh = session.theta + 1.96 * session.se;
  return {
    theta: Number(session.theta.toFixed(3)),
    se: Number(session.se.toFixed(3)),
    scaled: Number(scaled.toFixed(2)),
    ciScaledLow: Number(thetaToScaled(ciLow).toFixed(1)),
    ciScaledHigh: Number(thetaToScaled(ciHigh).toFixed(1)),
    answered: session.itemsAnswered.length,
    target: session.targetQuestionCount,
    mode: session.config.mode,
  };
}

function redactQuestion(item) {
  return {
    id: item.id,
    domain: item.domain,
    difficulty: item.difficulty,
    type: item.type,
    stem: item.stem,
    choices: item.choices,
  };
}

function itemGuessingParam(item) {
  if (item.type === "mcq") return clamp(item.guessing, 0, 0.33);
  return 0;
}

function itemProbability(theta, item) {
  const a = item.discrimination;
  const c = itemGuessingParam(item);
  const p2pl = logistic(a * (theta - item.difficulty));
  return c + (1 - c) * p2pl;
}

function itemInformation(theta, item) {
  const a = item.discrimination;
  const c = itemGuessingParam(item);
  const p = itemProbability(theta, item);
  return (a * a * Math.pow(p - c, 2) * (1 - p)) / (Math.pow(1 - c, 2) * Math.max(p, 1e-9));
}

function logistic(z) {
  return 1 / (1 + Math.exp(-z));
}

function thetaToScaled(theta) {
  return clamp(100 + ((theta + 3) / 6) * 900, 100, 1000);
}

function scaledToTheta(score) {
  return ((score - 100) / 900) * 6 - 3;
}

function getCustomDurationSec(questionCount, timedQuiz) {
  if (!timedQuiz) return null;
  const ratio = questionCount >= 100 ? 1 : questionCount / 100;
  return Math.round(EXAM_DURATION_SEC * ratio);
}

function difficultyBand(difficulty) {
  if (difficulty <= -0.6) return "easy";
  if (difficulty >= 0.7) return "hard";
  return "medium";
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

function sampleUnscoredPositions() {
  const arr = Array.from({ length: 100 }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 25).sort((a, b) => a - b);
}

function pickRankWeighted(sorted, decay = 0.35, hardCap = 18, softCap = 90) {
  if (!sorted.length) return null;
  const cap = Math.min(sorted.length, Math.max(hardCap, Math.min(softCap, sorted.length)));
  const top = sorted.slice(0, cap);

  let total = 0;
  const weights = top.map((_, i) => {
    const w = Math.exp(-decay * i);
    total += w;
    return w;
  });

  let r = rand() * total;
  for (let i = 0; i < top.length; i += 1) {
    r -= weights[i];
    if (r <= 0) return top[i];
  }
  return top[top.length - 1];
}

async function loadSession(env, sessionId) {
  const raw = await env.SESSIONS.get(`session:${sessionId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function saveSession(env, session) {
  const key = `session:${session.id}`;
  await env.SESSIONS.put(key, JSON.stringify(session), { expirationTtl: 60 * 60 * 12 });
}

function assertKvConfigured(env) {
  if (!env?.SESSIONS) {
    throw new Error("SESSIONS KV binding is not configured.");
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
}

async function safeJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clampInt(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function rand() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / 0x100000000;
}

function randomInt(maxExclusive) {
  if (maxExclusive <= 0) return 0;
  return Math.floor(rand() * maxExclusive);
}
