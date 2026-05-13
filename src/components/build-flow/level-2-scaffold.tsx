"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import type { Mechanic, MechanicId } from "@/data/scenarios/types"
import {
  composePromptFromBlocks,
  type StandardBlockInput,
} from "@/lib/build-flow/prompt-composer"

/**
 * Level 2 prompt scaffold composer screen.
 *
 * Per spec v3 §6 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`),
 * Task 9 in §16.
 *
 * The Builder:
 *   1. Picks a Game Mechanic (radio cards).
 *   2. Writes a short description of the game they want (≤ 200 chars).
 *   3. Sees the composed prompt update live in a monospace preview box.
 *   4. Copies the prompt, takes it to ChatGPT / Claude / Gemini, and pastes
 *      the returned HTML on the next screen (Task 10 — `/level-2/paste`).
 *
 * State (chosenMechanicId + builderDescription) is persisted to localStorage
 * under `mgb.l2.${standardId}.scaffold` so a refresh doesn't lose work.
 */

const MAX_DESCRIPTION_CHARS = 200
const MIN_DESCRIPTION_CHARS = 10

export interface Level2ScaffoldProps {
  standardId: string
  mechanics: Mechanic[]
  /**
   * Pre-baked standard pedagogy block, loaded server-side from
   * `loadStandardKnowledge`. The client uses it to compose the prompt live
   * without any fs/API calls.
   */
  standardBlock: StandardBlockInput
}

interface PersistedState {
  chosenMechanicId: MechanicId | null
  builderDescription: string
}

function storageKey(standardId: string): string {
  return `mgb.l2.${standardId}.scaffold`
}

function readPersisted(standardId: string): PersistedState {
  if (typeof window === "undefined") {
    return { chosenMechanicId: null, builderDescription: "" }
  }
  try {
    const raw = window.localStorage.getItem(storageKey(standardId))
    if (!raw) return { chosenMechanicId: null, builderDescription: "" }
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      chosenMechanicId:
        (parsed.chosenMechanicId as MechanicId | null | undefined) ?? null,
      builderDescription:
        typeof parsed.builderDescription === "string"
          ? parsed.builderDescription
          : "",
    }
  } catch {
    return { chosenMechanicId: null, builderDescription: "" }
  }
}

export function Level2Scaffold({
  standardId,
  mechanics,
  standardBlock,
}: Level2ScaffoldProps) {
  const router = useRouter()

  // Hydrate from localStorage on mount. Start with empty state so SSR + first
  // client render match (avoids hydration warnings).
  const [chosenMechanicId, setChosenMechanicId] = useState<MechanicId | null>(
    null
  )
  const [builderDescription, setBuilderDescription] = useState<string>("")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const persisted = readPersisted(standardId)
    setChosenMechanicId(persisted.chosenMechanicId)
    setBuilderDescription(persisted.builderDescription)
    setHydrated(true)
  }, [standardId])

  // Write through on any change (after first hydration so we don't overwrite
  // with empty state on mount).
  useEffect(() => {
    if (!hydrated) return
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(
        storageKey(standardId),
        JSON.stringify({ chosenMechanicId, builderDescription })
      )
    } catch {
      // Quota or private mode — silently degrade.
    }
  }, [hydrated, standardId, chosenMechanicId, builderDescription])

  // Compose live preview. When no mechanic is picked yet, show a friendly
  // placeholder; once picked, compose the real thing.
  const composedPrompt = useMemo(() => {
    if (!chosenMechanicId) {
      return "Pick a Game Mechanic above to see your prompt."
    }
    return composePromptFromBlocks({
      mechanicId: chosenMechanicId,
      builderDescription,
      standardBlock,
    })
  }, [chosenMechanicId, builderDescription, standardBlock])

  // Copy button feedback.
  const [copied, setCopied] = useState(false)
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current)
    }
  }, [])

  async function handleCopy() {
    if (!chosenMechanicId) return
    try {
      await navigator.clipboard.writeText(composedPrompt)
      setCopied(true)
      // Placeholder telemetry (real PostHog wires in Task 17).
      // eslint-disable-next-line no-console
      console.log("[telemetry] level_2.prompt_scaffold_copied", {
        standardId,
        mechanicId: chosenMechanicId,
        descriptionLength: builderDescription.length,
      })
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current)
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked — leave the user to copy manually.
    }
  }

  const descriptionFilled =
    builderDescription.trim().length >= MIN_DESCRIPTION_CHARS
  const ctaEnabled = chosenMechanicId !== null && descriptionFilled

  function handleNext() {
    if (!ctaEnabled) return
    router.push(`/build/${encodeURIComponent(standardId)}/level-2/paste`)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-lg font-semibold">
            <span className="text-zinc-400">{standardId}:</span>{" "}
            <span>Build your own</span>
          </h1>
          <Link
            href={`/build/${encodeURIComponent(standardId)}`}
            className="text-sm text-cyan-300 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-sm"
          >
            ← Back to Level 1
          </Link>
        </header>

        {/* Mechanic radio cards */}
        <fieldset className="mb-6">
          <legend className="mb-2 text-sm font-medium text-zinc-200">
            Pick a Game Mechanic
          </legend>
          <div
            role="radiogroup"
            aria-label="Game mechanic"
            className="grid gap-3 md:grid-cols-3"
          >
            {mechanics.map((mechanic) => {
              const selected = chosenMechanicId === mechanic.id
              return (
                <label
                  key={mechanic.id}
                  className={`group relative block cursor-pointer rounded-lg border p-4 transition-colors focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950 ${
                    selected
                      ? "border-cyan-400/70 bg-cyan-400/10"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="level-2-mechanic"
                    value={mechanic.id}
                    checked={selected}
                    onChange={() => setChosenMechanicId(mechanic.id)}
                    className="sr-only"
                  />
                  <h2
                    className={`text-sm font-semibold ${
                      selected ? "text-cyan-100" : "text-white"
                    }`}
                  >
                    {mechanic.title}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {mechanic.oneLineDescription}
                  </p>
                </label>
              )
            })}
          </div>
        </fieldset>

        {/* Description textarea */}
        <div className="mb-6">
          <label
            htmlFor="builder-description"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            What&apos;s your game about? Tell us the setting, characters, theme —
            anything that makes this game yours.
          </label>
          <textarea
            id="builder-description"
            value={builderDescription}
            onChange={(e) =>
              setBuilderDescription(
                e.target.value.slice(0, MAX_DESCRIPTION_CHARS)
              )
            }
            maxLength={MAX_DESCRIPTION_CHARS}
            rows={3}
            placeholder="e.g. A game about feeding ducks at the pond."
            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
          />
          <div className="mt-1 flex justify-end text-xs text-zinc-500">
            {builderDescription.length} / {MAX_DESCRIPTION_CHARS}
          </div>
        </div>

        {/* Live prompt preview */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-200">
              Your prompt
            </h2>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!chosenMechanicId}
              className="inline-flex items-center justify-center rounded-md border border-amber-400/50 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              aria-live="polite"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded font-mono text-sm whitespace-pre-wrap">
            {composedPrompt}
          </pre>
        </div>

        {/* Footer */}
        <p className="mb-4 text-sm text-zinc-400">
          Take this prompt to ChatGPT / Claude / Gemini, paste the HTML it
          returns into the next screen.
        </p>
        <button
          type="button"
          onClick={handleNext}
          disabled={!ctaEnabled}
          className="inline-flex items-center justify-center rounded-md border border-cyan-400/60 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          Next: Paste your HTML →
        </button>
      </div>
    </div>
  )
}
