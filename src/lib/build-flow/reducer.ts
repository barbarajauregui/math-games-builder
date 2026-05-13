import {
  initialBuildState,
  type BuildState,
  type BuildAction,
} from "./types"

/**
 * Build-flow reducer per spec v3 §13
 * (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`).
 *
 * Discriminated-union actions — no `unknown` payloads, no `as` casts.
 */
export function buildFlowReducer(
  state: BuildState,
  action: BuildAction
): BuildState {
  switch (action.type) {
    case "RESET":
      return initialBuildState(state.standardId)

    case "GO_TO_LEVEL":
      return { ...state, level: action.level }

    case "PICK_SCENARIO":
      return { ...state, currentScenarioId: action.scenarioId }

    case "RECORD_MECHANIC_WIN":
      return {
        ...state,
        mechanicWinsRecorded: {
          ...state.mechanicWinsRecorded,
          [action.mechanicId]: true,
        },
      }

    case "PICK_MECHANIC_FOR_LEVEL_2":
      return { ...state, chosenMechanicId: action.mechanicId }

    case "SET_BUILDER_DESCRIPTION":
      return { ...state, builderDescription: action.description }

    case "SET_COMPOSED_PROMPT":
      return { ...state, composedPrompt: action.prompt }

    case "SET_PROMPT_REVIEW":
      return { ...state, promptReview: action.review }

    case "SET_PASTED_HTML":
      return { ...state, pastedHtml: action.html }

    case "MARK_BUILDER_WON_OWN_GAME":
      return { ...state, builderWonOwnGame: true }

    case "SET_HTML_REVIEW":
      return { ...state, htmlReview: action.review }

    default: {
      // Exhaustiveness guard
      const _exhaustive: never = action
      return state
    }
  }
}
