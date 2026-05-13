"use client"

import { useEffect, useMemo, useState } from "react"
import { loadScenarios } from "@/data/scenarios"
import { K_OA_A_1_MECHANICS } from "@/data/mechanics/k-oa-a-1-mechanics"
import type { Mechanic, MechanicId } from "@/data/scenarios/types"
import { loadMechanicWins } from "@/lib/build-flow/mastery"
import { Level1Picker } from "./level-1-picker"

interface BuildFlowProps {
  standardId: string
}

/**
 * Top-level build-flow component for spec v3.
 *
 * Currently renders the Level 1 picker only. Level 2 routes (`/build/[std]/level-2`)
 * are spec §16 Tasks 9–13 and will 404 until built.
 *
 * Mastery is read from localStorage (`mgb.l1.mechanicWins.${standardId}`) on
 * mount and re-read on `storage` / `focus` events so the picker reflects wins
 * recorded on the play screen the moment the Builder navigates back.
 */
export function BuildFlow({ standardId }: BuildFlowProps) {
  const scenarios = useMemo(() => loadScenarios(standardId), [standardId])

  const mechanics: Mechanic[] = useMemo(() => {
    if (standardId === "K.OA.A.1") return K_OA_A_1_MECHANICS
    return []
  }, [standardId])

  const [mechanicWins, setMechanicWins] = useState<
    Record<MechanicId, boolean>
  >({} as Record<MechanicId, boolean>)

  useEffect(() => {
    function refresh() {
      const fresh = loadMechanicWins(standardId) as Record<MechanicId, boolean>
      setMechanicWins(fresh)
    }
    refresh()
    window.addEventListener("storage", refresh)
    window.addEventListener("focus", refresh)
    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener("focus", refresh)
    }
  }, [standardId])

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
