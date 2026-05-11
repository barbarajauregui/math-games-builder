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

export interface BuildAction {
  type:
    | "GO_TO_STEP"
    | "PICK_SCENARIO"
    | "PICK_TEMPLATE"
    | "SET_BLANK"
    | "CLEAR_LESSON1"
    | "CONFIRM_LESSON1"
    | "SET_OPERATION"
    | "SET_NUMBER"
    | "PICK_MECHANIC"
    | "MARK_BEATEN"
    | "BEGIN_SUBMIT"
    | "FINISH_SUBMIT"
    | "RESET"
  payload?: unknown
}

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
