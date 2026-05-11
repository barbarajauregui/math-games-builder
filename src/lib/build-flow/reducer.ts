import { initialBuildState, type BuildState, type BuildAction, type StepId } from "./types"

const STEP_ORDER: StepId[] = ["scenario", "madlib", "lesson1", "math", "mechanic", "playtest"]

function nextStep(current: StepId): StepId {
  const i = STEP_ORDER.indexOf(current)
  return STEP_ORDER[Math.min(i + 1, STEP_ORDER.length - 1)]
}

export function buildFlowReducer(state: BuildState, action: BuildAction): BuildState {
  switch (action.type) {
    case "GO_TO_STEP":
      return { ...state, step: action.payload }

    case "PICK_SCENARIO": {
      const scenarioId = action.payload
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
      const templateId = action.payload
      return {
        ...state,
        templateId,
        filledBlanks: {},
        lesson1Confirmed: false,
      }
    }

    case "SET_BLANK": {
      const { id, value } = action.payload
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
      return { ...state, operation: action.payload }

    case "SET_NUMBER": {
      const { which, value } = action.payload
      return { ...state, [which]: value }
    }

    case "PICK_MECHANIC":
      return { ...state, mechanicId: action.payload, step: "playtest" }

    case "MARK_BEATEN":
      return { ...state, hasBeatenOwnGame: true }

    case "BEGIN_SUBMIT":
      return { ...state, isSubmitting: true }

    case "FINISH_SUBMIT":
      return {
        ...state,
        isSubmitting: false,
        submittedGameId: action.payload,
      }

    case "RESET":
      return initialBuildState(state.standardId)

    default:
      return state
  }
}

export { nextStep, STEP_ORDER }
