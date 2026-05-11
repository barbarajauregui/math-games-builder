import type { Operation } from "@/data/scenarios/types"

export type StepId = "scenario" | "madlib" | "lesson1" | "math" | "mechanic" | "playtest"

export interface BuildState {
  standardId: string
  step: StepId

  // Step 1
  scenarioId: string | null

  // Step 2
  templateId: string | null
  filledBlanks: Record<string, string | number>
  /**
   * Set true once the Builder clicks "Yes — the math matters" on Lesson 1.
   * Reset to false if they re-edit the mad-lib after a "Hmm, needs work".
   */
  lesson1Confirmed: boolean

  // Step 3
  operation: Operation | null
  n1: number | null
  n2: number | null

  // Step 4
  mechanicId: string | null

  // Step 5
  hasBeatenOwnGame: boolean
  isSubmitting: boolean
  submittedGameId: string | null
}

export type BuildAction =
  | { type: "GO_TO_STEP"; payload: StepId }
  | { type: "PICK_SCENARIO"; payload: string }
  | { type: "PICK_TEMPLATE"; payload: string | null }
  | { type: "SET_BLANK"; payload: { id: string; value: string | number } }
  | { type: "CLEAR_LESSON1" }
  | { type: "CONFIRM_LESSON1" }
  | { type: "SET_OPERATION"; payload: Operation }
  | { type: "SET_NUMBER"; payload: { which: "n1" | "n2"; value: number } }
  | { type: "PICK_MECHANIC"; payload: string }
  | { type: "MARK_BEATEN" }
  | { type: "BEGIN_SUBMIT" }
  | { type: "FINISH_SUBMIT"; payload: string | null }
  | { type: "RESET" }

export function initialBuildState(standardId: string): BuildState {
  return {
    standardId,
    step: "scenario",
    scenarioId: null,
    templateId: null,
    filledBlanks: {},
    lesson1Confirmed: false,
    operation: null,
    n1: null,
    n2: null,
    mechanicId: null,
    hasBeatenOwnGame: false,
    isSubmitting: false,
    submittedGameId: null,
  }
}
