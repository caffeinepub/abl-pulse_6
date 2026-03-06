// ─────────────────────────────────────────────
// ABL PULSE – Logic Entry Point
// Exports all question data for English & Hindi.
// Scoring logic — v1 (score-based engine).
// ─────────────────────────────────────────────

export { OPTIONS_EN, SECTIONS_EN, ASSESSMENT_CONTENT_EN } from "./en/questions";
export { OPTIONS_HI, SECTIONS_HI, ASSESSMENT_CONTENT_HI } from "./hi/questions";

// Combined map — use with lang key ("en" | "hi")
export type Lang = "en" | "hi";

import { ASSESSMENT_CONTENT_EN, OPTIONS_EN, SECTIONS_EN } from "./en/questions";
import { ASSESSMENT_CONTENT_HI, OPTIONS_HI, SECTIONS_HI } from "./hi/questions";

export const QUESTION_OPTIONS = {
  en: OPTIONS_EN,
  hi: OPTIONS_HI,
} as const;

export const SECTIONS = {
  en: SECTIONS_EN,
  hi: SECTIONS_HI,
} as const;

export const ASSESSMENT_CONTENT = {
  en: ASSESSMENT_CONTENT_EN,
  hi: ASSESSMENT_CONTENT_HI,
} as const;

// Scoring
export { calculateScore, ANSWER_WEIGHTS } from "./scoring";
export type { ScoreResult, PillarKey, AnswerMap } from "./scoring";

// Suggestions – Section 1 (Water: Q1–Q5 | Sleep: Q6–Q10 – fully populated)
export {
  SECTION1_SUGGESTIONS,
  getSuggestionCategory,
  getSection1NeedsAttention,
} from "./suggestions/section1-water";
export type {
  SuggestionCategory,
  SuggestionCard,
  QuestionSuggestions,
  NeedsAttentionItem,
} from "./suggestions/section1-water";

// Suggestions – Section 2 (Gut Cleanse & Metabolic: Q1–Q10 – fully populated)
export {
  SECTION2_SUGGESTIONS,
  getSection2NeedsAttention,
} from "./suggestions/section2-gut";
export type { NeedsAttentionItem2 } from "./suggestions/section2-gut";
