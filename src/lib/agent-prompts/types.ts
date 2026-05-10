/**
 * Shared types for the runtime agent ladder (Stages 1-4).
 *
 * Spec: docs/superpowers/specs/2026-05-10-library-design.md §13.
 *
 * Each stage takes a CriticInput and returns a stage-specific verdict.
 * Stages run in order: Haiku Critic → Sonnet Critic → Haiku Shortcut Adversary
 * → Sonnet Shortcut Adversary. A stage's FAIL halts the ladder; the Builder
 * sees the verdict and revises.
 */

export interface AgentLadderInput {
  /** The standard the Builder is claiming this game teaches (e.g. "K.OA.A.1") */
  standardId: string
  /** The verbatim Common Core text of the standard */
  standardText: string
  /** The Builder's scenario / theme description */
  scenario: string
  /** The full HTML of the generated game */
  gameHtml: string
}

/**
 * The four pass/fail criteria from `docs/agents/the-critic.md` (now lives in
 * the shared math-pedagogy-toolkit). All four must PASS for the Critic stages
 * to pass.
 */
export interface CriticVerdict {
  /** Criterion 1: real-world scenario where math is used like in real life */
  c1RealWorldScenario: { pass: boolean; reason: string }
  /** Criterion 2: math IS the gameplay (not bolted on top) */
  c2MathIsGameplay: { pass: boolean; reason: string }
  /** Criterion 3: cannot win without doing the math (no random-clicking, no pattern-matching) */
  c3MustKnowMathToWin: { pass: boolean; reason: string }
  /** Criterion 4: construct validity — game measures the SPECIFIC claimed skill */
  c4ConstructValidity: { pass: boolean; reason: string }
  quizWrapperRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  fakeIntrinsicRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  overallVerdict: 'APPROVED' | 'NEEDS_WORK' | 'REJECT'
  /** Plain-English revision suggestions the Builder will see if a criterion fails */
  revisionSuggestions: string[]
}

/**
 * Output of a Shortcut Adversary stage. The adversary plays the game
 * looking for ways to win WITHOUT doing the math.
 */
export interface ShortcutAdversaryVerdict {
  /** SHORTCUT-FREE = no exploit found; EXPLOITABLE = can win without math sometimes;
   *  TRIVIALLY-EXPLOITABLE = can win every time without math */
  verdict: 'SHORTCUT-FREE' | 'EXPLOITABLE' | 'TRIVIALLY-EXPLOITABLE'
  shortcutsFound: Array<{
    /** Which catalog category (random clicking, visual matching, etc.) */
    category: string
    /** The exact sequence of actions that wins without the math */
    sequence: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH'
    repairSuggestion: string
  }>
  /** Plain-English summary the Builder sees */
  summary: string
}

/**
 * The aggregate verdict after a stage runs.
 */
export interface StageResult {
  stage: 1 | 2 | 3 | 4
  stageName: string
  passed: boolean
  /** The structured verdict from this stage's agent (Critic or Shortcut Adversary). */
  criticVerdict?: CriticVerdict
  shortcutVerdict?: ShortcutAdversaryVerdict
  /** Failure reasons surfaced to the Builder UI in plain English. */
  builderFacingMessage?: string
  /** Token cost of this stage's API call (for ops monitoring). */
  costEstimateUsd: number
}
