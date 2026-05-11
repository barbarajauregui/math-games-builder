"use client"

import { useReducer, useMemo } from "react"
import { buildFlowReducer } from "@/lib/build-flow/reducer"
import { initialBuildState } from "@/lib/build-flow/types"
import { loadScenarios } from "@/data/scenarios"
import { ScenarioPicker } from "./scenario-picker"

interface BuildFlowProps {
  standardId: string
}

export function BuildFlow({ standardId }: BuildFlowProps) {
  const [state, dispatch] = useReducer(buildFlowReducer, standardId, initialBuildState)
  const scenarios = useMemo(() => loadScenarios(standardId), [standardId])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-900 px-4 py-3">
        <h1 className="text-sm font-medium text-zinc-300">
          {standardId} — Adding and taking away within 10
        </h1>
      </header>

      {state.step === "scenario" && (
        <ScenarioPicker
          scenarios={scenarios}
          onPick={(id) => dispatch({ type: "PICK_SCENARIO", payload: id })}
        />
      )}

      {state.step !== "scenario" && (
        <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-zinc-400">
          <p>Step: <span className="text-white">{state.step}</span></p>
          <p className="mt-2 text-xs text-zinc-600">Scenario: {state.scenarioId}</p>
          <button onClick={() => dispatch({ type: "RESET" })} className="mt-4 text-xs text-zinc-500 underline">
            Back to start
          </button>
        </div>
      )}
    </div>
  )
}
