"use client"

import { useMemo } from "react"
import { loadScenarios } from "@/data/scenarios"
import { K_OA_A_1_MECHANICS } from "@/data/mechanics/k-oa-a-1-mechanics"
import type { Mechanic, MechanicId } from "@/data/scenarios/types"
import { Level1Picker } from "./level-1-picker"

interface BuildFlowProps {
  standardId: string
}

/**
 * Top-level build-flow component for spec v3.
 *
 * Currently renders the Level 1 picker only. Level 1 play screen, mastery
 * wiring, and Level 2 are spec §16 Tasks 6–13.
 *
 * Mastery state (`mechanicWinsRecorded`) is a placeholder here — Task 7 wires
 * it through Firestore + reducer.
 */
export function BuildFlow({ standardId }: BuildFlowProps) {
  const scenarios = useMemo(() => loadScenarios(standardId), [standardId])

  // Per-standard mechanic list. K.OA.A.1 ships with 3 PRIMARY mechanics.
  // Other standards will plug in their own mechanics file as they come online.
  const mechanics: Mechanic[] = useMemo(() => {
    if (standardId === "K.OA.A.1") return K_OA_A_1_MECHANICS
    return []
  }, [standardId])

  // Task 7 will wire this from BuildState / Firestore. For now, none-won.
  const mechanicWins: Record<MechanicId, boolean> = {} as Record<
    MechanicId,
    boolean
  >

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-900 px-4 py-3">
        <h1 className="text-sm font-medium text-zinc-300">
          {standardId} — Adding and taking away within 10
        </h1>
      </header>

      <Level1Picker
        standardId={standardId}
        mechanics={mechanics}
        scenarios={scenarios}
        mechanicWins={mechanicWins}
        coverageGap={null}
      />
    </div>
  )
}
