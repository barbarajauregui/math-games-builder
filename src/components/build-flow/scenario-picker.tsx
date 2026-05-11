"use client"

import type { Scenario } from "@/data/scenarios/types"

interface ScenarioPickerProps {
  scenarios: Scenario[]
  onPick: (scenarioId: string) => void
}

export function ScenarioPicker({ scenarios, onPick }: ScenarioPickerProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <p className="text-center text-sm text-zinc-400 mb-6">
        Pick a place where adding or taking away matters.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => onPick(s.id)}
            className="text-left rounded-xl p-4 bg-zinc-900 border border-zinc-800 hover:border-cyan-400/50 hover:bg-zinc-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <div className="text-4xl mb-2" aria-hidden="true">
              {s.emoji}
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{s.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{s.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
