"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Mechanic, Scenario } from "@/data/scenarios/types"
import {
  loadMechanicWins,
  recordMechanicWin,
} from "@/lib/build-flow/mastery"
import { track } from "@/lib/telemetry/posthog-client"

interface PlayScreenProps {
  standardId: string
  scenario: Scenario
  mechanic: Mechanic | null
  /** All scenarios for this mechanic, in display order. Used to pick the next un-won one. */
  allScenariosForMechanic: Scenario[]
  /** All mechanic IDs required for the standard. Used to detect Level 2 unlock. */
  allMechanicIdsForStandard?: string[]
}

/**
 * Level 1 play screen — game iframe on top, lesson panel at the bottom.
 *
 * Per spec v3 §4 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`):
 * - Iframe is sandboxed (`allow-scripts` only — no `allow-same-origin`).
 * - Lesson panel is always visible while the Builder plays.
 * - "Next Scenario" is disabled until the iframe fires
 *   `postMessage({ type: "game_win" }, "*")`.
 *
 * The 9 pre-made HTML games are a separate workstream (Task 15) and don't
 * exist yet. When the iframe can't load the page, we show a placeholder over
 * the iframe area and (in development only) surface a "Fake win" button so
 * Barbara can walk the flow visually.
 */
export function PlayScreen({
  standardId,
  scenario,
  mechanic,
  allScenariosForMechanic,
  allMechanicIdsForStandard,
}: PlayScreenProps) {
  const router = useRouter()
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const startedAtRef = useRef<number>(0)

  const [won, setWon] = useState(false)
  const [iframeFailed, setIframeFailed] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const isDev = process.env.NODE_ENV === "development"

  // ---- Telemetry stubs (Task 14 will replace with real PostHog) ----
  useEffect(() => {
    startedAtRef.current = Date.now()
    track({
      event: "level_1.scenario_started",
      properties: {
        standardId,
        mechanicId: scenario.mechanicId,
        scenarioId: scenario.id,
      },
    })
  }, [standardId, scenario.id, scenario.mechanicId])

  // ---- game_win listener ----
  const handleWin = useCallback(() => {
    if (won) return
    setWon(true)
    recordMechanicWin(standardId, scenario.mechanicId, allMechanicIdsForStandard)
    const durationMs = Date.now() - startedAtRef.current
    track({
      event: "level_1.scenario_won",
      properties: {
        standardId,
        mechanicId: scenario.mechanicId,
        scenarioId: scenario.id,
        durationMs,
      },
    })
  }, [won, standardId, scenario.id, scenario.mechanicId, allMechanicIdsForStandard])

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Be defensive — sandboxed iframe sends from "null" origin.
      const data = e.data as { type?: unknown } | null
      if (data && typeof data === "object" && data.type === "game_win") {
        handleWin()
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [handleWin])

  // ---- Detect stub-URL 404. We can't read the cross-origin iframe response,
  // so we time out: if `load` hasn't fired within 2.5s, assume the file is
  // missing and surface the placeholder. This is the best we can do with a
  // sandboxed cross-origin iframe.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!iframeLoaded) setIframeFailed(true)
    }, 2500)
    return () => window.clearTimeout(t)
  }, [iframeLoaded])

  // ---- Compute next scenario ----
  const nextScenarioId = useMemo(() => {
    if (!won) return null
    const wins = loadMechanicWins(standardId)
    // Prefer the next un-won scenario in this mechanic, after the current one.
    const ordered = allScenariosForMechanic
    const currentIdx = ordered.findIndex((s) => s.id === scenario.id)
    // Loop through remaining, then wrap to start, skipping current.
    for (let offset = 1; offset <= ordered.length; offset++) {
      const idx = (currentIdx + offset) % ordered.length
      const candidate = ordered[idx]
      if (candidate.id === scenario.id) continue
      if (!wins[`scenario:${candidate.id}`]) {
        return candidate.id
      }
    }
    return null
    // Note: we record mechanic-level wins, not per-scenario, so the
    // "unwon scenario" lookup above is a best-effort fallback to the next
    // sibling — picking any sibling is fine; the mechanic is already complete.
  }, [won, allScenariosForMechanic, scenario.id, standardId])

  const handleNext = useCallback(() => {
    if (!won) return
    // If there's a sibling scenario in this mechanic, go play it.
    // Otherwise, head back to the picker — the mechanic is complete and the
    // check mark will surface there.
    if (nextScenarioId) {
      router.push(
        `/build/${encodeURIComponent(standardId)}/play/${nextScenarioId}`
      )
    } else {
      router.push(`/build/${encodeURIComponent(standardId)}`)
    }
  }, [won, nextScenarioId, router, standardId])

  // ---- UI ----
  const breadcrumb = (
    <div className="flex items-center gap-2 text-xs text-zinc-400">
      <Link
        href={`/build/${encodeURIComponent(standardId)}`}
        className="hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded"
      >
        {standardId}
      </Link>
      <span aria-hidden>·</span>
      <span>{mechanic?.title ?? scenario.mechanicId}</span>
      <span aria-hidden>·</span>
      <span className="text-zinc-200">{scenario.title}</span>
      {won && (
        <span
          aria-label="Scenario won"
          className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-xs text-cyan-300"
        >
          ✓
        </span>
      )}
    </div>
  )

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      {/* Top 70% — game iframe */}
      <div className="relative basis-[70%] grow-0 shrink-0 min-h-0 bg-black">
        <iframe
          ref={iframeRef}
          src={scenario.preMadeGameUrl}
          title={scenario.title}
          sandbox="allow-scripts"
          onLoad={() => setIframeLoaded(true)}
          onError={() => setIframeFailed(true)}
          className="absolute inset-0 h-full w-full border-0"
        />
        {iframeFailed && !iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/95 px-6 text-center">
            <div className="max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-base font-semibold text-white">
                Pre-made game coming soon.
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                This Level 1 game hasn&apos;t been built yet — you&apos;ll see
                it here when it ships. For now, take a look at the lesson below.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom 30% — lesson panel */}
      <div className="basis-[30%] grow-0 shrink-0 min-h-0 border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex h-full max-w-6xl flex-col gap-3 px-4 py-4">
          {/* Panel header */}
          <div className="flex items-center justify-between gap-4">
            {breadcrumb}
            <div className="flex items-center gap-2">
              {isDev && iframeFailed && !won && (
                <button
                  type="button"
                  onClick={handleWin}
                  className="rounded-md border border-amber-400/60 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  title="Dev-only: simulate game_win for visual review"
                >
                  Fake win (dev)
                </button>
              )}
              <Link
                href={`/build/${encodeURIComponent(standardId)}`}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                Switch Mechanic
              </Link>
              <button
                type="button"
                onClick={handleNext}
                disabled={!won}
                className="rounded-md border border-cyan-400/60 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next Scenario
              </button>
            </div>
          </div>

          {/* Lesson text */}
          <div className="overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm leading-relaxed text-zinc-200">
            {scenario.lessonText}
          </div>
        </div>
      </div>
    </div>
  )
}
