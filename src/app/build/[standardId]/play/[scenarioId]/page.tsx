import { loadScenarios } from "@/data/scenarios"
import { K_OA_A_1_MECHANICS } from "@/data/mechanics/k-oa-a-1-mechanics"
import type { Mechanic } from "@/data/scenarios/types"
import { PlayScreen } from "@/components/build-flow/play-screen"

interface PageProps {
  params: Promise<{ standardId: string; scenarioId: string }>
}

/**
 * Level 1 play route — `/build/[standardId]/play/[scenarioId]`.
 *
 * Per spec v3 §4 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`):
 * top 70% = pre-made game iframe, bottom 30% = lesson panel.
 *
 * This server component validates the standardId / scenarioId combo and
 * hydrates the client component that owns the iframe + postMessage listener.
 */
export default async function PlayPage({ params }: PageProps) {
  const { standardId, scenarioId } = await params
  const decodedStandard = decodeURIComponent(standardId)
  const decodedScenario = decodeURIComponent(scenarioId)

  const scenarios = loadScenarios(decodedStandard)
  const scenario = scenarios.find((s) => s.id === decodedScenario)

  // Per-standard mechanic list (mirrors build-flow.tsx). Only K.OA.A.1 ships
  // with mechanics today; other standards return [] and the play screen will
  // render "Unknown standard."
  const mechanics: Mechanic[] =
    decodedStandard === "K.OA.A.1" ? K_OA_A_1_MECHANICS : []

  if (!scenario) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
        <p className="text-zinc-400">
          Unknown scenario: {decodedScenario} (standard: {decodedStandard})
        </p>
      </div>
    )
  }

  const mechanic = mechanics.find((m) => m.id === scenario.mechanicId)

  return (
    <PlayScreen
      standardId={decodedStandard}
      scenario={scenario}
      mechanic={mechanic ?? null}
      allScenariosForMechanic={scenarios.filter(
        (s) => s.mechanicId === scenario.mechanicId
      )}
    />
  )
}
