import type { MechanicId } from "@/data/scenarios/types"

/**
 * Build-flow state for the two-level architecture per spec v3 §13
 * (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`).
 *
 * Level 1 = play pre-made games until the Builder has fired `game_win` for
 * at least one Scenario in each PRIMARY Game Mechanic.
 * Level 2 = vibe-coding prompt scaffold + paste-HTML + critique ladder.
 *
 * The v2 mad-lib state (templateId, filledBlanks, operation, n1, n2,
 * lesson1Confirmed, etc.) is gone.
 */

export interface ReviewBullet {
  /** What's wrong, ≤ 12 words. */
  whatsWrong: string
  /** How to fix it, ≤ 12 words. */
  howToFix: string
}

export interface PromptReviewResult {
  decision: "pass" | "block"
  /** ≤ 3 bullets per spec §13. */
  bullets: ReviewBullet[]
}

export interface HtmlReviewResult {
  decision: "pass" | "soft_warn" | "block"
  /** ≤ 6 bullets per spec §13. */
  bullets: ReviewBullet[]
  /**
   * Which stage of the 4-stage ladder failed.
   *   - null on "pass"
   *   - 1..4 on "soft_warn" or "block" (1 = Haiku Critic, 2 = Haiku Adversary,
   *     3 = Sonnet Critic, 4 = Sonnet Adversary)
   * Drives the review screen's 4-dot UI so failed stages render as red and
   * later stages render as "not run" instead of all-green.
   */
  failedStageNumber?: number | null
}

export interface BuildState {
  standardId: string
  level: 1 | 2

  // Level 1
  /** True once the Builder has fired `game_win` on at least one Scenario in the mechanic. */
  mechanicWinsRecorded: Record<MechanicId, boolean>
  currentScenarioId: string | null

  // Level 2
  chosenMechanicId: MechanicId | null
  builderDescription: string
  composedPrompt: string | null
  promptReview: PromptReviewResult | null
  pastedHtml: string | null
  builderWonOwnGame: boolean
  htmlReview: HtmlReviewResult | null
}

export type BuildAction =
  | { type: "RESET" }
  | { type: "GO_TO_LEVEL"; level: 1 | 2 }
  // Level 1
  | { type: "PICK_SCENARIO"; scenarioId: string }
  | { type: "RECORD_MECHANIC_WIN"; mechanicId: MechanicId }
  // Level 2
  | { type: "PICK_MECHANIC_FOR_LEVEL_2"; mechanicId: MechanicId }
  | { type: "SET_BUILDER_DESCRIPTION"; description: string }
  | { type: "SET_COMPOSED_PROMPT"; prompt: string | null }
  | { type: "SET_PROMPT_REVIEW"; review: PromptReviewResult | null }
  | { type: "SET_PASTED_HTML"; html: string | null }
  | { type: "MARK_BUILDER_WON_OWN_GAME" }
  | { type: "SET_HTML_REVIEW"; review: HtmlReviewResult | null }

export function initialBuildState(standardId: string): BuildState {
  return {
    standardId,
    level: 1,
    mechanicWinsRecorded: {} as Record<MechanicId, boolean>,
    currentScenarioId: null,
    chosenMechanicId: null,
    builderDescription: "",
    composedPrompt: null,
    promptReview: null,
    pastedHtml: null,
    builderWonOwnGame: false,
    htmlReview: null,
  }
}
