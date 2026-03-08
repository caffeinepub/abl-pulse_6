// ─────────────────────────────────────────────
// ABL PULSE – Scoring Logic (Engine v1)
// Total Pillars: 4 | Questions per Pillar: 10
// Max per Pillar: 40 | Total Max: 160
// ─────────────────────────────────────────────

export const ANSWER_WEIGHTS = [0, 1, 2, 3, 4] as const;
// Index maps to options: Never=0, Rarely=1, Sometimes=2, Often=3, Daily=4

export type AnswerMap = Record<string, number>;

export type PillarKey = "sleep" | "gut" | "movement" | "mind";

export type ScoreResult = {
  totalScore: number;
  pillarScores: Record<PillarKey, number>;
  category: "needs_attention" | "building_zone" | "strong_area";
  categoryLabel: string;
  categoryEmoji: string;
  summaryMessage: string;
};

const PILLAR_KEYS: PillarKey[] = ["sleep", "gut", "movement", "mind"];

export function calculateScore(answers: AnswerMap): ScoreResult {
  const pillarScores: Record<PillarKey, number> = {
    sleep: 0,
    gut: 0,
    movement: 0,
    mind: 0,
  };

  // Each section index maps to a pillar
  for (let s = 0; s < 4; s++) {
    const pillar = PILLAR_KEYS[s];
    let pillarTotal = 0;
    for (let q = 0; q < 10; q++) {
      const key = `s${s}-q${q}`;
      const val = answers[key];
      if (val !== undefined) {
        pillarTotal += ANSWER_WEIGHTS[val as 0 | 1 | 2 | 3 | 4];
      }
    }
    pillarScores[pillar] = pillarTotal;
  }

  const totalScore =
    pillarScores.sleep +
    pillarScores.gut +
    pillarScores.movement +
    pillarScores.mind;

  let category: ScoreResult["category"];
  let categoryLabel: string;
  let categoryEmoji: string;
  let summaryMessage: string;

  if (totalScore <= 65) {
    category = "needs_attention";
    categoryLabel = "Needs Attention";
    categoryEmoji = "🔴";
    summaryMessage =
      "Reset Needed: Focus on basics like Water & Chewing. High urgency for correction.";
  } else if (totalScore <= 116) {
    category = "building_zone";
    categoryLabel = "Building Zone";
    categoryEmoji = "🟡";
    summaryMessage =
      "Consistency Needed: Good start, but refine your Sleep and Meal timings.";
  } else {
    category = "strong_area";
    categoryLabel = "Strong Area";
    categoryEmoji = "🟢";
    summaryMessage =
      "Optimization Needed: You are thriving. Maintain your flow and deepen Mind sync.";
  }

  return {
    totalScore,
    pillarScores,
    category,
    categoryLabel,
    categoryEmoji,
    summaryMessage,
  };
}
