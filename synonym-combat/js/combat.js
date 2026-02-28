// combat.js — Adaptive session manager for Synonym Combat.
// Depends on: concepts.js, distortion.js (must be loaded first).

const Combat = (() => {

  // ── Concept mastery model ───────────────────────────────────────────────
  // Each concept has an independent level (1–5) and a consecutive-correct streak.
  // Correct at current level → level up (cap at 5).
  // Wrong at current level → level stays (unless already at L1, then stays L1).
  // 3 consecutive correct at L5 → concept is mastered.

  const MASTERY_THRESHOLD = 3; // consecutive correct at L5 to master a concept.

  // ── Session state ───────────────────────────────────────────────────────

  let state = {
    domain: 0,           // 0 = all domains; 1–8 = specific domain
    conceptLevels: {},   // conceptId → current level (1–5)
    streaks: {},         // conceptId → consecutive correct count at current level
    mastered: new Set(), // conceptId → mastered
    trapCounts: {},      // trapConceptId → number of times chosen incorrectly
    history: [],         // [{conceptId, level, correct, chosenId, trapId, timestamp}]
    currentQuestion: null,
    questionsAnswered: 0,
    correctCount: 0,
    domainPerformance: {}, // domain → {correct, total}
    lastConceptId: null,
    active: false
  };

  // ── Initialization ──────────────────────────────────────────────────────

  // config: { domain } — domain 0 = all, 1–8 = specific
  function init(config) {
    const cfg = config || {};
    const domain = parseInt(cfg.domain, 10) || 0;

    state = {
      domain,
      conceptLevels: {},
      streaks: {},
      mastered: new Set(),
      trapCounts: {},
      history: [],
      currentQuestion: null,
      questionsAnswered: 0,
      correctCount: 0,
      domainPerformance: {},
      lastConceptId: null,
      active: true
    };

    // Pre-initialize all concepts in scope.
    const pool = getCandidatePool(domain);
    pool.forEach((c) => {
      state.conceptLevels[c.id] = 1;
      state.streaks[c.id] = 0;
    });
  }

  // ── Concept pool ────────────────────────────────────────────────────────

  function getCandidatePool(domain) {
    const all = CombatConcepts.getAll();
    if (!domain) return all;
    return all.filter((c) => c.domain === domain);
  }

  // ── Next concept selection ──────────────────────────────────────────────
  // Priority order:
  //   1. Concepts with lowest current level (most in need of training)
  //   2. Among those, prefer domains the user has struggled with
  //   3. Avoid repeating the last concept
  //   4. Exclude mastered concepts unless all concepts are mastered

  function selectNextConcept() {
    const all = CombatConcepts.getAll();
    let pool = getCandidatePool(state.domain);

    // Exclude mastered unless everything is mastered.
    const unmastered = pool.filter((c) => !state.mastered.has(c.id));
    if (unmastered.length > 0) pool = unmastered;

    // Avoid immediate repeat.
    const noRepeat = pool.filter((c) => c.id !== state.lastConceptId);
    if (noRepeat.length > 0) pool = noRepeat;

    if (pool.length === 0) return null;

    // Find the minimum current level in the pool (priority).
    const minLevel = Math.min(...pool.map((c) => state.conceptLevels[c.id] || 1));

    // Among minimum-level concepts, prefer domains with lower accuracy.
    const minLevelConcepts = pool.filter((c) => (state.conceptLevels[c.id] || 1) === minLevel);

    // Score each domain by accuracy (lower = more needs work).
    const domainScore = (domain) => {
      const perf = state.domainPerformance[domain];
      if (!perf || perf.total === 0) return 0; // no data = neutral priority
      return perf.correct / perf.total;
    };

    // Sort by domain score ascending (worst domains first) then shuffle within ties.
    const sorted = minLevelConcepts.sort((a, b) => domainScore(a.domain) - domainScore(b.domain));

    // Pick from the top quartile of worst-performing.
    const topCount = Math.max(1, Math.ceil(sorted.length * 0.25));
    const candidates = sorted.slice(0, topCount);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // ── Load next question ──────────────────────────────────────────────────

  function next() {
    if (!state.active) return null;

    const concept = selectNextConcept();
    if (!concept) {
      return { allMastered: true };
    }

    const level = state.conceptLevels[concept.id] || 1;
    const all = CombatConcepts.getAll();
    const question = Distortion.buildQuestion(concept, level, all);
    question.levelDescriptor = Distortion.getLevelDescriptor(level);

    state.currentQuestion = question;
    state.lastConceptId = concept.id;
    return question;
  }

  // ── Process answer ──────────────────────────────────────────────────────

  // chosenOptionId: the id of the concept the user selected.
  // Returns a result object with feedback data.

  function submit(chosenOptionId) {
    if (!state.active || !state.currentQuestion) return null;

    const q = state.currentQuestion;
    const correct = chosenOptionId === q.correctId;
    const concept = CombatConcepts.getById(q.conceptId);
    const chosenConcept = CombatConcepts.getById(chosenOptionId);

    // ── Update domain performance ──────────────────────────────────────
    const domain = q.domain;
    if (!state.domainPerformance[domain]) {
      state.domainPerformance[domain] = { correct: 0, total: 0 };
    }
    state.domainPerformance[domain].total += 1;
    if (correct) state.domainPerformance[domain].correct += 1;

    // ── Update concept level and streak ───────────────────────────────
    const prevLevel = state.conceptLevels[q.conceptId] || 1;

    if (correct) {
      state.streaks[q.conceptId] = (state.streaks[q.conceptId] || 0) + 1;
      // Level up after each correct answer (cap at 5).
      state.conceptLevels[q.conceptId] = Math.min(5, prevLevel + 1);
      // Mastery: 3 consecutive correct at L5.
      if (prevLevel === 5 && state.streaks[q.conceptId] >= MASTERY_THRESHOLD) {
        state.mastered.add(q.conceptId);
      }
    } else {
      state.streaks[q.conceptId] = 0;
      // On wrong, drop back one level (floor at 1).
      state.conceptLevels[q.conceptId] = Math.max(1, prevLevel - 1);

      // Track trap selections.
      if (chosenOptionId && q.trapIds && q.trapIds.includes(chosenOptionId)) {
        state.trapCounts[chosenOptionId] = (state.trapCounts[chosenOptionId] || 0) + 1;
      }
    }

    // ── Record history ─────────────────────────────────────────────────
    state.history.push({
      conceptId: q.conceptId,
      level: prevLevel,
      correct,
      chosenId: chosenOptionId,
      trapSelected: q.trapIds && q.trapIds.includes(chosenOptionId),
      timestamp: Date.now()
    });

    state.questionsAnswered += 1;
    if (correct) state.correctCount += 1;

    state.currentQuestion = null;

    // ── Build result ───────────────────────────────────────────────────
    return {
      correct,
      correctId: q.correctId,
      correctTerm: concept ? concept.term : "",
      chosenId: chosenOptionId,
      chosenTerm: chosenConcept ? chosenConcept.term : "",
      explanation: q.explanation,
      prevLevel,
      newLevel: state.conceptLevels[q.conceptId],
      mastered: state.mastered.has(q.conceptId),
      trapSelected: q.trapIds && q.trapIds.includes(chosenOptionId),
      trapExplanation: (concept && !correct) ? concept.trapExplanation : null
    };
  }

  // ── Session summary ─────────────────────────────────────────────────────

  function getSummary() {
    const all = CombatConcepts.getAll();
    const pool = getCandidatePool(state.domain);

    // Top trap patterns: which concepts were most often chosen by mistake.
    const trapRanking = Object.entries(state.trapCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => {
        const c = CombatConcepts.getById(id);
        return { id, term: c ? c.term : id, count };
      });

    // Weakest domains by accuracy.
    const domainRanking = Object.entries(state.domainPerformance)
      .filter(([, p]) => p.total > 0)
      .map(([domain, p]) => ({
        domain: parseInt(domain, 10),
        label: CombatConcepts.getDomains()[domain],
        accuracy: p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0,
        total: p.total
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    // Concept-level distribution.
    const levelDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    pool.forEach((c) => {
      const lv = state.conceptLevels[c.id] || 1;
      levelDistribution[lv] = (levelDistribution[lv] || 0) + 1;
    });

    return {
      questionsAnswered: state.questionsAnswered,
      correctCount: state.correctCount,
      accuracy: state.questionsAnswered > 0
        ? Math.round((state.correctCount / state.questionsAnswered) * 100)
        : 0,
      masteredCount: state.mastered.size,
      totalConcepts: pool.length,
      trapRanking,
      domainRanking,
      levelDistribution
    };
  }

  // ── State access ────────────────────────────────────────────────────────

  function getState() {
    return {
      domain: state.domain,
      questionsAnswered: state.questionsAnswered,
      correctCount: state.correctCount,
      accuracy: state.questionsAnswered > 0
        ? Math.round((state.correctCount / state.questionsAnswered) * 100)
        : 0,
      masteredCount: state.mastered.size,
      active: state.active,
      domainPerformance: { ...state.domainPerformance }
    };
  }

  function end() {
    state.active = false;
    return getSummary();
  }

  return { init, next, submit, getSummary, getState, end };
})();
