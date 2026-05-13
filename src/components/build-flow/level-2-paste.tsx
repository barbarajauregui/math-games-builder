"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { track } from "@/lib/telemetry/posthog-client"

/**
 * Level 2 Gate B — paste-HTML + Builder-must-win-their-own-game playtest.
 *
 * Spec v3 §8 + §13 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`),
 * Task 11 in §16.
 *
 * Three regions:
 *   A) Header + nav
 *   B) Paste area — textarea + local validation + "Load game" button
 *   C) Playtest area — sandboxed iframe (srcDoc) + status pill + Save button
 *      (disabled until the iframe fires `postMessage({type:"game_win"})`)
 *
 * No AI is called here. The legacy `ensureGameWin` shim was removed in Audit
 * 22; the iframe's own postMessage is the only signal. The 4-stage critique
 * ladder runs after this screen (Task 12).
 */

const MAX_HTML_BYTES = 200 * 1024 // 200 KB

interface PersistedPaste {
  pastedHtml: string
}
interface PersistedPlaytest {
  wonAt: string // ISO
}

function pasteStorageKey(standardId: string): string {
  return `mgb.l2.${standardId}.paste`
}
function playtestStorageKey(standardId: string): string {
  return `mgb.l2.${standardId}.playtest`
}

function readPersistedHtml(standardId: string): string {
  if (typeof window === "undefined") return ""
  try {
    const raw = window.localStorage.getItem(pasteStorageKey(standardId))
    if (!raw) return ""
    const parsed = JSON.parse(raw) as Partial<PersistedPaste>
    return typeof parsed.pastedHtml === "string" ? parsed.pastedHtml : ""
  } catch {
    return ""
  }
}

function readPersistedWin(standardId: string): boolean {
  if (typeof window === "undefined") return false
  try {
    const raw = window.localStorage.getItem(playtestStorageKey(standardId))
    if (!raw) return false
    const parsed = JSON.parse(raw) as Partial<PersistedPlaytest>
    return typeof parsed.wonAt === "string" && parsed.wonAt.length > 0
  } catch {
    return false
  }
}

function writePersistedHtml(standardId: string, html: string) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      pasteStorageKey(standardId),
      JSON.stringify({ pastedHtml: html } satisfies PersistedPaste)
    )
  } catch {
    // Quota or private mode — silently degrade.
  }
}

function clearPersistedWin(standardId: string) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(playtestStorageKey(standardId))
  } catch {
    // ignore
  }
}

function writePersistedWin(standardId: string) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      playtestStorageKey(standardId),
      JSON.stringify({ wonAt: new Date().toISOString() } satisfies PersistedPlaytest)
    )
  } catch {
    // ignore
  }
}

interface ValidationFailure {
  reason: "too_big" | "not_html" | "no_postmessage"
  message: string
}

function validateHtml(html: string): ValidationFailure | null {
  // 1. Size ≤ 200 KB. Use byte length (TextEncoder) to be honest about UTF-8.
  const byteLength =
    typeof TextEncoder !== "undefined"
      ? new TextEncoder().encode(html).length
      : html.length
  if (byteLength > MAX_HTML_BYTES) {
    return {
      reason: "too_big",
      message: "Your HTML is too big — keep it under 200 KB.",
    }
  }
  // 2. Starts with <!doctype html> (case-insensitive) AND contains <html.
  const trimmed = html.trimStart()
  if (
    !trimmed.toLowerCase().startsWith("<!doctype html>") ||
    !html.toLowerCase().includes("<html")
  ) {
    return {
      reason: "not_html",
      message:
        "This doesn't look like a full HTML page. Did you paste the whole file?",
    }
  }
  // 3. Contains literal substring "postMessage(".
  if (!html.includes("postMessage(")) {
    return {
      reason: "no_postmessage",
      message:
        "This page never tells us when the player wins. Ask your AI to add: window.parent.postMessage({type:'game_win'}, '*') when the player wins.",
    }
  }
  return null
}

interface Level2PasteProps {
  standardId: string
}

export function Level2Paste({ standardId }: Level2PasteProps) {
  const router = useRouter()
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const mountedAtRef = useRef<number>(0)
  const playtestStartedLoggedRef = useRef(false)

  const isDev = process.env.NODE_ENV === "development"

  const [hydrated, setHydrated] = useState(false)
  const [pastedHtml, setPastedHtml] = useState<string>("")
  // The HTML currently mounted in the iframe (only set after validation passes).
  const [loadedHtml, setLoadedHtml] = useState<string | null>(null)
  const [validationFailure, setValidationFailure] =
    useState<ValidationFailure | null>(null)
  const [builderWonOwnGame, setBuilderWonOwnGame] = useState(false)
  const [iframeError, setIframeError] = useState(false)

  // ---- Hydrate from localStorage on mount ----
  useEffect(() => {
    const persistedHtml = readPersistedHtml(standardId)
    const persistedWin = readPersistedWin(standardId)
    setPastedHtml(persistedHtml)
    // Edge case: pre-fill + auto-load + pre-mark win if both already in storage.
    if (persistedHtml) {
      const failure = validateHtml(persistedHtml)
      if (!failure) {
        setLoadedHtml(persistedHtml)
        if (persistedWin) {
          setBuilderWonOwnGame(true)
        }
      }
    }
    setHydrated(true)
  }, [standardId])

  // ---- Persist HTML on change (after hydration) ----
  useEffect(() => {
    if (!hydrated) return
    writePersistedHtml(standardId, pastedHtml)
  }, [hydrated, standardId, pastedHtml])

  // ---- postMessage listener (only while iframe is mounted) ----
  useEffect(() => {
    if (loadedHtml === null) return
    function onMessage(e: MessageEvent) {
      // Sandboxed iframe (no allow-same-origin) reports a "null" origin and
      // its `source` is its contentWindow. Filter by source for safety.
      if (
        iframeRef.current &&
        e.source !== iframeRef.current.contentWindow
      ) {
        return
      }
      const data = e.data as { type?: unknown } | null
      if (data && typeof data === "object" && data.type === "game_win") {
        setBuilderWonOwnGame((prev) => {
          if (prev) return prev
          const durationMs = Date.now() - mountedAtRef.current
          writePersistedWin(standardId)
          track({
            event: "level_2.playtest_win",
            properties: { standardId, durationMs },
          })
          return true
        })
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [loadedHtml, standardId])

  // ---- Mount-time telemetry for the playtest ----
  useEffect(() => {
    if (loadedHtml === null) {
      playtestStartedLoggedRef.current = false
      return
    }
    if (playtestStartedLoggedRef.current) return
    playtestStartedLoggedRef.current = true
    mountedAtRef.current = Date.now()
    track({
      event: "level_2.playtest_started",
      properties: { standardId },
    })
  }, [loadedHtml, standardId])

  // ---- "Load game" handler ----
  const handleLoadGame = useCallback(() => {
    const failure = validateHtml(pastedHtml)
    if (failure) {
      setValidationFailure(failure)
      track({
        event: "level_2.local_validation_failed",
        properties: { standardId, reason: failure.reason },
      })
      return
    }
    setValidationFailure(null)
    setIframeError(false)
    setBuilderWonOwnGame(false)
    clearPersistedWin(standardId)
    setLoadedHtml(pastedHtml)
  }, [pastedHtml, standardId])

  // ---- "Replace HTML" — go back to paste mode ----
  const handleReplace = useCallback(() => {
    setLoadedHtml(null)
    setBuilderWonOwnGame(false)
    setIframeError(false)
    clearPersistedWin(standardId)
  }, [standardId])

  // ---- "Save your game" ----
  const handleSave = useCallback(() => {
    if (!builderWonOwnGame) return
    router.push(`/build/${encodeURIComponent(standardId)}/level-2/review`)
  }, [builderWonOwnGame, router, standardId])

  // ---- Dev-only "Fake win" ----
  const handleFakeWin = useCallback(() => {
    if (builderWonOwnGame) return
    const durationMs = Date.now() - mountedAtRef.current
    writePersistedWin(standardId)
    setBuilderWonOwnGame(true)
    // Note: dev-only "Fake win" still fires the real event so the wire-up can
    // be verified in Network DevTools without a real game.
    track({
      event: "level_2.playtest_win",
      properties: { standardId, durationMs },
    })
  }, [builderWonOwnGame, standardId])

  // ---- iframe error listener (script errors inside the sandbox bubble as
  // `error` events on the iframe element) ----
  const handleIframeError = useCallback(() => {
    setIframeError(true)
  }, [])

  const loadButtonDisabled = pastedHtml.trim().length === 0

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Region A — header */}
        <header className="mb-6">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link
              href={`/build/${encodeURIComponent(standardId)}`}
              className="hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded"
            >
              {standardId}
            </Link>
            <span aria-hidden>·</span>
            <Link
              href={`/build/${encodeURIComponent(standardId)}/level-2`}
              className="hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded"
            >
              Build your own
            </Link>
            <span aria-hidden>·</span>
            <span className="text-zinc-200">Paste HTML</span>
          </div>
          <h1 className="mt-2 text-lg font-semibold">
            Paste the HTML your AI returned.
          </h1>
          <Link
            href={`/build/${encodeURIComponent(standardId)}/level-2`}
            className="mt-1 inline-block text-sm text-cyan-300 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-sm"
          >
            ← Back to prompt scaffold
          </Link>
        </header>

        {/* Region B — paste area (always rendered; collapsed visually only when iframe is up) */}
        {loadedHtml === null && (
          <section className="mb-6">
            <label
              htmlFor="pasted-html"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              Paste the HTML your AI returned.
            </label>
            <textarea
              id="pasted-html"
              value={pastedHtml}
              onChange={(e) => {
                setPastedHtml(e.target.value)
                if (validationFailure) setValidationFailure(null)
              }}
              rows={12}
              spellCheck={false}
              placeholder="<!doctype html>&#10;<html>&#10;  ...&#10;</html>"
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
            <div className="mt-1 flex justify-end text-xs text-zinc-500">
              {pastedHtml.length.toLocaleString()} chars
            </div>

            {validationFailure && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-3 overflow-hidden rounded-lg border border-amber-400/40 bg-amber-400/5"
              >
                <div className="h-1 w-full bg-amber-400/80" />
                <div className="p-3">
                  <p className="text-sm leading-relaxed text-amber-100">
                    {validationFailure.message}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <button
                type="button"
                onClick={handleLoadGame}
                disabled={loadButtonDisabled}
                className="inline-flex items-center justify-center rounded-md border border-cyan-400/60 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                Load game
              </button>
            </div>
          </section>
        )}

        {/* Region C — playtest */}
        {loadedHtml !== null && (
          <section className="mb-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                  builderWonOwnGame
                    ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300"
                }`}
                aria-live="polite"
              >
                {builderWonOwnGame
                  ? "🎉 You won! Save your game →"
                  : "Play your own game. Save unlocks when you win."}
              </div>
              <div className="flex items-center gap-2">
                {isDev && !builderWonOwnGame && (
                  <button
                    type="button"
                    onClick={handleFakeWin}
                    className="rounded-md border border-amber-400/60 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                    title="Dev-only: simulate game_win for visual review"
                  >
                    Fake win (dev)
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleReplace}
                  className="text-xs text-cyan-300 underline hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-sm"
                >
                  Replace HTML
                </button>
              </div>
            </div>

            <div className="relative w-full overflow-hidden rounded-lg border border-zinc-800 bg-black" style={{ minHeight: "60vh" }}>
              <iframe
                ref={iframeRef}
                title="Your game"
                sandbox="allow-scripts"
                srcDoc={loadedHtml}
                onError={handleIframeError}
                className="h-full w-full border-0"
                style={{ minHeight: "60vh" }}
              />
            </div>

            {iframeError && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-3 overflow-hidden rounded-lg border border-amber-400/40 bg-amber-400/5"
              >
                <div className="h-1 w-full bg-amber-400/80" />
                <div className="p-3">
                  <p className="text-sm leading-relaxed text-amber-100">
                    This game has an error. Look in your browser console for
                    details, or ask your AI to fix the error and re-paste.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={!builderWonOwnGame}
                className="inline-flex items-center justify-center rounded-md border border-cyan-400/60 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                Save your game →
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
