import type { BuildState, BuildAction, StepId } from "./types"
import type { Operation } from "@/data/scenarios/types"

const STEP_ORDER: StepId[] = ["scenario", "madlib", "lesson1", "math", "mechanic", "playtest"]

function nextStep(current: StepId): StepId {
  const i = STEP_ORDER.indexOf(current)
  return STEP_ORDER[Math.min(i + 1, STEP_ORDER.length - 1)]
}

export function buildFlowReducer(state: BuildState, action: BuildAction): BuildState {
  switch (action.type) {
    case "GO_TO_STEP":
      return { ...state, step: action.payload as StepId }

    case "PICK_SCENARIO": {
      const scenarioId = action.payload as string
      return {
        ...state,
        scenarioId,
        templateId: null,
        filledBlanks: {},
        lesson1Confirmed: false,
        step: "madlib",
      }
    }

    case "PICK_TEMPLATE": {
      const templateId = action.payload as string | null
      return {
        ...state,
        templateId,
        filledBlanks: {},
        lesson1Confirmed: false,
      }
    }

    case "SET_BLANK": {
      const { id, value } = action.payload as { id: string; value: string | number }
      return {
        ...state,
        filledBlanks: { ...state.filledBlanks, [id]: value },
        lesson1Confirmed: false,
      }
    }

    case "CLEAR_LESSON1":
      return { ...state, lesson1Confirmed: false, step: "madlib" }

    case "CONFIRM_LESSON1":
      return { ...state, lesson1Confirmed: true, step: "math" }

    case "SET_OPERATION":
      return { ...state, operation: action.payload as Operation }

    case "SET_NUMBER": {
      const { which, value } = action.payload as { which: "n1" | "n2"; value: number }
      return { ...state, [which]: value }
    }

    case "PICK_MECHANIC":
      return { ...state, mechanicId: action.payload as string, step: "playtest" }

    case "MARK_BEATEN":
      return { ...state, hasBeatenOwnGame: true }

    case "BEGIN_SUBMIT":
      return { ...state, isSubmitting: true }

    case "FINISH_SUBMIT":
      return {
        ...state,
        isSubmitting: false,
        submittedGameId: action.payload as string | null,
      }

    case "RESET":
      return {
        ...state,
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
        submittedGameId: null,
      }

    default:
      return state
  }
}

export { nextStep, STEP_ORDER }
