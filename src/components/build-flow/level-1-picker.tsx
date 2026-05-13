"use client"

import Link from "next/link"
import type { Mechanic, MechanicId, Scenario } from "@/data/scenarios/types"

/**
 * Level 1 picker — combined Game Mechanic + Scenario picker.
 *
 * Per spec v3 §3 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`).
 *
 * Layout:
 * - Banner explaining the Level 1 → Level 2 unlock rule.
 * - One row per Game Mechanic available for the standard.
 *   Each row: title + one-line description on the left, horizontal scroll of
 *   Scenario cards on the right.
 * - Scenario card: compact title + one-line description. No images in Level 1.
 * - Mastery state: a small check mark on a mechanic title when the Builder
 *   has fired `game_win` for at least one of its Scenarios.
 * - Level 2 unlock panel below the rows. Disabled until all mechanics won.
 *
 * Mastery wiring is Task 7. For now the picker takes `mechanicWins` as a
 * prop and a hard-coded "none won yet" placeholder is fine at the call site.
 */

export interface Level1PickerProps {
  standardId: string
  mechanics: Mechanic[]
  scenarios: Scenario[]
  /**
   * Map from MechanicId → has the Builder fired game_win for at least one
   * Scenario in this mechanic. Drives the check marks + Level 2 unlock state.
   */
  mechanicWins: Record<MechanicId, boolean>
  /**
   * If the standard has fewer PRIMARY mechanics than usual, the spec calls
   * for an honest banner. K.OA.A.1 has `coverageGap: null` so this is unused
   * here, but the UI must handle it for other standards. Pass the integer N
   * (= number of mechanics shown) to switch the banner copy.
   */
  coverageGap?: number | null
}

export function Level1Picker({
  standardId,
  mechanics,
  scenarios,
  mechanicWins,
  coverageGap = null,
}: Level1PickerProps) {
  const allMechanicsWon =
    mechanics.length > 0 &&
    mechanics.every((m) => mechanicWins[m.id] === true)

  const bannerText =
    coverageGap === null
      ? "Play one game in each Game Mechanic. After all 3, you can build your own."
      : `Only ${coverageGap} game mechanics for this standard — that's the most this kind of math allows.`

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Banner */}
      <p
        className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300"
        data-testid="level-1-banner"
      >
        {bannerText}
      </p>

      {/* Mechanic rows */}
      <div className="space-y-6">
        {mechanics.map((mechanic) => {
          const rowScenarios = scenarios.filter(
            (s) => s.mechanicId === mechanic.id
          )
          const won = mechanicWins[mechanic.id] === true

          return (
            <section
              key={mechanic.id}
              aria-labelledby={`mech-${mechanic.id}-title`}
              className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 md:grid-cols-[16rem_1fr]"
            >
              {/* Mechanic header */}
              <header className="md:pr-4">
                <h2
                  id={`mech-${mechanic.id}-title`}
                  className="flex items-center gap-2 text-base font-semibold text-white"
                >
                  <span>{mechanic.title}</span>
                  {won && (
                    <span
                      aria-label="Mechanic complete"
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-xs text-cyan-300"
                    >
                      ✓
                    </span>
                  )}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  {mechanic.oneLineDescription}
                </p>
              </header>

              {/* Scenario cards (horizontal scroll) */}
              <div className="-mx-1 overflow-x-auto">
                <ul className="flex gap-3 px-1 pb-1">
                  {rowScenarios.map((scenario) => (
                    <li key={scenario.id} className="shrink-0">
                      <Link
                        href={`/build/${encodeURIComponent(standardId)}/play/${scenario.id}`}
                        className="block w-48 rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-left transition-all hover:border-cyan-400/60 hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                      >
                        <h3 className="text-sm font-semibold text-white">
                          {scenario.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                          {scenario.oneLineDescription}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )
        })}
      </div>

      {/* Level 2 unlock panel */}
      <div
        className={`mt-8 rounded-xl border p-5 transition-opacity ${
          allMechanicsWon
            ? "border-cyan-400/50 bg-cyan-400/5 opacity-100"
            : "border-zinc-800 bg-zinc-900/40 opacity-60"
        }`}
        aria-disabled={!allMechanicsWon}
        data-testid="level-2-unlock-panel"
      >
        <h2 className="text-base font-semibold text-white">
          {allMechanicsWon ? "Ready to build your own." : "Build your own"}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          {allMechanicsWon
            ? "You've played one game in each Game Mechanic. Tap to start Level 2."
            : "Ready to build your own — play one game in each Game Mechanic first."}
        </p>
        <button
          type="button"
          disabled={!allMechanicsWon}
          className="mt-3 inline-flex items-center justify-center rounded-md border border-cyan-400/60 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Start Level 2
        </button>
      </div>
    </div>
  )
}
