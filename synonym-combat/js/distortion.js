// distortion.js — Question generation engine for Synonym Combat.
// Depends on: concepts.js (must be loaded first).

const Distortion = (() => {

  // ── Level descriptors ──────────────────────────────────────────────────

  const LEVELS = {
    1: { label: "Direct Recognition",   description: "Match a synonym distortion to its canonical CISSP term." },
    2: { label: "Phrase Recognition",   description: "Identify the concept behind a formal phrasing." },
    3: { label: "Scenario Wrapper",     description: "Identify the concept described in a short scenario." },
    4: { label: "Multi-Synonym",        description: "Identify the concept embedded in synonym-distorted prose." },
    5: { label: "Governance Ambiguity", description: "Distinguish between near-miss governance concepts." }
  };

  // ── Distractor selection ───────────────────────────────────────────────

  // Returns n distractor concepts for a given correct concept.
  // Priority: 1 trap concept → same-domain fillers → cross-domain fillers.
  function getDistractors(correct, all, n) {
    const taken = new Set([correct.id]);
    const result = [];

    // First: include one trap concept if available.
    if (correct.traps && correct.traps.length > 0) {
      const shuffledTraps = shuffle([...correct.traps]);
      for (const trapId of shuffledTraps) {
        const trap = all.find((c) => c.id === trapId);
        if (trap && !taken.has(trap.id)) {
          result.push(trap);
          taken.add(trap.id);
          break;
        }
      }
    }

    // Second: fill from same domain.
    const sameDomain = shuffle(all.filter((c) => c.domain === correct.domain && !taken.has(c.id)));
    for (const c of sameDomain) {
      if (result.length >= n - 1) break;
      result.push(c);
      taken.add(c.id);
    }

    // Third: fill from any domain.
    const rest = shuffle(all.filter((c) => !taken.has(c.id)));
    for (const c of rest) {
      if (result.length >= n) break;
      result.push(c);
      taken.add(c.id);
    }

    return result.slice(0, n);
  }

  // ── Option assembly ────────────────────────────────────────────────────

  // Build shuffled options array: [{id, term, isCorrect}]
  function buildOptions(correct, distractors) {
    const options = [
      { id: correct.id, term: correct.term, isCorrect: true },
      ...distractors.map((d) => ({ id: d.id, term: d.term, isCorrect: false }))
    ];
    return shuffle(options);
  }

  // ── Level 1: Direct distortion recognition ────────────────────────────
  // Stem: one randomly chosen distortion string.
  // Question: "Which CISSP term is described by this phrase?"

  function buildL1(concept, all) {
    const distortion = randomItem(concept.distortions);
    const distractors = getDistractors(concept, all, 3);
    return {
      level: 1,
      conceptId: concept.id,
      domain: concept.domain,
      stem: distortion,
      question: "Which CISSP term does this phrase describe?",
      options: buildOptions(concept, distractors),
      correctId: concept.id,
      explanation: `"${distortion}" is a synonym distortion of <strong>${concept.term}</strong>. ${concept.trapExplanation || ""}`,
      trapIds: concept.traps || []
    };
  }

  // ── Level 2: Phrasing recognition ─────────────────────────────────────
  // Stem: one of the four phrasings (governance/operational/technical/executive).
  // Question: "Which CISSP concept does this formal phrasing describe?"

  function buildL2(concept, all) {
    const phrasingKeys = ["governance", "operational", "technical", "executive"];
    const key = randomItem(phrasingKeys);
    const phrasing = concept.phrasings[key];
    const distractors = getDistractors(concept, all, 3);
    return {
      level: 2,
      conceptId: concept.id,
      domain: concept.domain,
      phrasingType: key,
      stem: phrasing,
      question: `This is a ${key}-level description of which CISSP concept?`,
      options: buildOptions(concept, distractors),
      correctId: concept.id,
      explanation: `The ${key} phrasing describes <strong>${concept.term}</strong>: ${concept.definition}`,
      trapIds: concept.traps || []
    };
  }

  // ── Level 3: Scenario wrapper ──────────────────────────────────────────
  // Stem: the concept's pre-built scenario string.
  // Question: "Which CISSP concept is central to this scenario?"

  function buildL3(concept, all) {
    const distractors = getDistractors(concept, all, 3);
    return {
      level: 3,
      conceptId: concept.id,
      domain: concept.domain,
      stem: concept.scenario,
      question: "Which CISSP concept is central to this scenario?",
      options: buildOptions(concept, distractors),
      correctId: concept.id,
      explanation: `The scenario describes <strong>${concept.term}</strong>. ${concept.definition} ${concept.trapExplanation || ""}`,
      trapIds: concept.traps || []
    };
  }

  // ── Level 4: Multi-synonym scenario ───────────────────────────────────
  // Embeds two distortions from the concept into a scenario sentence.
  // The stem is synthetic prose using the distortions.

  const L4_TEMPLATES = [
    (d1, d2, term) =>
      `The organization's approach to ${d1} required formally documenting ${d2} as part of the governance framework.`,
    (d1, d2, term) =>
      `A board decision to address ${d1} was documented alongside ${d2}, with the CISO accountable for both.`,
    (d1, d2, term) =>
      `Auditors noted that ${d1} was present in the program but questioned whether ${d2} had been formally addressed.`,
    (d1, d2, term) =>
      `Senior leadership approved an approach to ${d1} and acknowledged ${d2} as an acceptable residual outcome.`,
    (d1, d2, term) =>
      `The policy framework addressed ${d1} but lacked clear ownership of ${d2}, creating a governance gap.`
  ];

  function buildL4(concept, all) {
    if (concept.distortions.length < 2) return buildL3(concept, all);
    const shuffled = shuffle([...concept.distortions]);
    const d1 = shuffled[0];
    const d2 = shuffled[1];
    const template = randomItem(L4_TEMPLATES);
    const stem = template(d1, d2, concept.term);
    const distractors = getDistractors(concept, all, 3);
    return {
      level: 4,
      conceptId: concept.id,
      domain: concept.domain,
      stem,
      question: "Both distorted phrases in this scenario describe the same CISSP concept. Which one?",
      options: buildOptions(concept, distractors),
      correctId: concept.id,
      explanation: `Both "${d1}" and "${d2}" are distortions of <strong>${concept.term}</strong>. ${concept.trapExplanation || ""}`,
      trapIds: concept.traps || []
    };
  }

  // ── Level 5: Governance vs. management near-miss ───────────────────────
  // Shows the concept's governance phrasing.
  // Ensures at least one trap concept appears as a distractor.
  // Provides the trapExplanation as the post-answer feedback.

  function buildL5(concept, all) {
    const stem = concept.phrasings.governance;

    // For L5 we always include at least one trap option.
    const result = [];
    const taken = new Set([concept.id]);

    if (concept.traps && concept.traps.length > 0) {
      for (const trapId of concept.traps) {
        const trap = all.find((c) => c.id === trapId);
        if (trap && !taken.has(trap.id)) {
          result.push(trap);
          taken.add(trap.id);
        }
      }
    }

    // Fill remaining slots from same domain.
    const sameDomain = shuffle(all.filter((c) => c.domain === concept.domain && !taken.has(c.id)));
    for (const c of sameDomain) {
      if (result.length >= 3) break;
      result.push(c);
      taken.add(c.id);
    }

    // Final fill from any domain.
    const rest = shuffle(all.filter((c) => !taken.has(c.id)));
    for (const c of rest) {
      if (result.length >= 3) break;
      result.push(c);
    }

    return {
      level: 5,
      conceptId: concept.id,
      domain: concept.domain,
      stem,
      question: "This governance-level description most precisely identifies which CISSP concept?",
      options: buildOptions(concept, result.slice(0, 3)),
      correctId: concept.id,
      explanation: concept.trapExplanation
        ? `<strong>${concept.term}</strong>: ${concept.trapExplanation}`
        : `<strong>${concept.term}</strong>: ${concept.definition}`,
      trapIds: concept.traps || []
    };
  }

  // ── Public API ─────────────────────────────────────────────────────────

  // Build a question for a given concept at a given level.
  // Falls back gracefully: if level > 5, uses L5.
  function buildQuestion(concept, level, all) {
    const safeLevel = Math.max(1, Math.min(5, level || 1));
    switch (safeLevel) {
      case 1: return buildL1(concept, all);
      case 2: return buildL2(concept, all);
      case 3: return buildL3(concept, all);
      case 4: return buildL4(concept, all);
      case 5: return buildL5(concept, all);
      default: return buildL1(concept, all);
    }
  }

  function getLevelDescriptor(level) {
    return LEVELS[level] || LEVELS[1];
  }

  // ── Utilities ──────────────────────────────────────────────────────────

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  return { buildQuestion, getLevelDescriptor };
})();
