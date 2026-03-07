import { PERSPECTIVES } from "./scenario-engine.js";

function formatOtherPerspectiveLines(scenario, mostCorrectPerspective) {
  return PERSPECTIVES
    .filter((perspective) => perspective !== mostCorrectPerspective)
    .map((perspective) => {
      const analysis = scenario.perspectiveAnalysis[perspective];
      if (!analysis) return `- ${perspective}: No mapped analysis available for this scenario.`;
      return `- ${perspective}: ${analysis.technicallyCorrect} But not MOST strategic because ${analysis.strategicGap}`;
    })
    .join("\n");
}

export function buildExplanation(result) {
  if (!result || !result.scenario) {
    return "No scenario is active. Select a framework and try again.";
  }

  const { scenario, selectedPerspective, mostCorrectPerspective, isCorrect, selectedAnalysis, scoring } = result;
  const winnerReason = scenario.mostStrategicReason;
  const otherLines = formatOtherPerspectiveLines(scenario, mostCorrectPerspective);
  const scoringLine = scoring
    ? `Strategic scoring: selected ${scoring.selectedScore}, winner ${scoring.winnerScore}, delta ${scoring.deltaToWinner} (${scoring.confidenceBand} separation).`
    : null;

  if (isCorrect) {
    return [
      `Correct: ${selectedPerspective} is the MOST strategic perspective.`,
      `Why MOST strategic: ${winnerReason}`,
      scoringLine,
      "Other perspectives are technically valid, but not primary:",
      otherLines
    ].filter(Boolean).join("\n");
  }

  const selectedText = selectedAnalysis
    ? `${selectedAnalysis.technicallyCorrect} But not MOST strategic because ${selectedAnalysis.strategicGap}`
    : "Your selected perspective has no mapped analysis in this scenario.";

  return [
    `Not most strategic: ${selectedPerspective}.`,
    `Your selection: ${selectedText}`,
    `MOST strategic answer: ${mostCorrectPerspective}. ${winnerReason}`,
    scoringLine,
    "Why the remaining choices are not primary:",
    otherLines
  ].filter(Boolean).join("\n");
}
