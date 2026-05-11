"use client"

import { useReducer } from "react"
import { buildFlowReducer } from "@/lib/build-flow/reducer"
import { initialBuildState } from "@/lib/build-flow/types"

interface BuildFlowProps {
  standardId: string
}

export function BuildFlow({ standardId }: BuildFlowProps) {
  const [state, dispatch] = useReducer(buildFlowReducer, standardId, initialBuildState)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-zinc-400">Build flow scaffolding — step: <span className="text-white font-semibold">{state.step}</span></p>
        <p className="text-xs text-zinc-600 mt-2">standardId: {state.standardId}</p>
        <p className="text-xs text-zinc-600 mt-1">(steps will be wired in subsequent tasks)</p>
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="mt-6 text-xs text-zinc-500 underline"
        >
          Reset state
        </button>
      </div>
    </div>
  )
}
