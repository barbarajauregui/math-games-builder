"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import type { HtmlReviewResult, ReviewBullet } from "@/lib/build-flow/types"
import type { MechanicId } from "@/data/scenarios/types"
import { useAuth } from "@/lib/auth"
import { apiFetch } from "@/lib/api-fetch"

/**
 * Level 2 Gate C — HTML review screen.
 *
 * Spec v3 §9 + §10 + §13 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`),
 * Task 12 in §16.
 *
 * On mount:
 *   1. Read pastedHtml from `mgb.l2.${standardId}.paste`.
 *   2. Read win-state from `mgb.l2.${standardId}.playtest`.
 *   3. Read mechanicId + builderDescription from `mgb.l2.${standardId}.scaffold`.
 *   If any is missing → redirect to /level-2/paste.
 *
 * Then runs POST /api/build-flow/html-review with a 4-dot progress UI (no
 * agent names — spec §9). Renders ≤ 6 bullets per the trichotomy:
 *   - pass     → green, "Save and send to Guide →" enabled.
 *   - soft_warn→ yellow strip + bullets, save enabled.
 *   - block    → red strip + bullets, only "Edit my HTML and try again".
 *
 * Caches the last result in `mgb.l2.${standardId}.review` keyed by a cheap
 * hash of the pastedHtml. Re-runs if older than 5 min or HTML changed.
 *
 * NOTE: the "Save and send to Guide →" button is wired in Task 13 — for now
 * it logs telemetry and is otherwise inert.
 */

const REVIEW_TTL_MS = 5 * 60 * 1000

// ---------- localStorage helpers ----------

interface PersistedPaste {
  pastedHtml: string
}
interface PersistedPlaytest {
  wonAt: string
}
interface PersistedScaffold {
  chosenMechanicId: MechanicId | null
  builderDescription: string
}
interface PersistedReview {
  result: HtmlReviewResult
  runAt: string // ISO
  htmlHash: number
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota / private mode
  }
}

function hashString(s: string): number {
  // djb2; non-cryptographic, plenty for change detection.
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0
  }
  return h
}

// ---------- 4-dot progress UI ----------

type DotStatus = "pending" | "running" | "passed" | "failed"

interface PhaseDotProps {
  number: number
  status: DotStatus
}

function PhaseDot({ number, status }: PhaseDotProps) {
  const styles: Record<DotStatus, { ring: string; bg: string; label: string; glow: string }> = {
    pending: {
      ring: "rgba(120,90,40,0.45)",
      bg: "rgba(60,45,20,0.30)",
      label: "#a78b5d",
      glow: "none",
    },
    running: {
      ring: "rgba(217,179,99,0.95)",
      bg: "rgba(217,179,99,0.20)",
      label: "#e8c97a",
      glow: "0 0 10px rgba(217,179,99,0.6)",
    },
    passed: {
      ring: "rgba(16,185,129,0.7)",
      bg: "rgba(16,185,129,0.25)",
      label: "#34d399",
      glow: "0 0 8px rgba(16,185,129,0.4)",
    },
    failed: {
      ring: "rgba(248,113,113,0.85)",
      bg: "rgba(248,113,113,0.20)",
      label: "#fca5a5",
      glow: "0 0 8px rgba(248,113,113,0.4)",
    },
  }
  const s = styles[status]
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div
        className="relative h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold"
        style={{
          border: `2px solid ${s.ring}`,
          background: s.bg,
          color: s.label,
          boxShadow: s.glow,
          animation:
            status === "running" ? "review-pulse 1.4s ease-in-out infinite" : undefined,
        }}
      >
        {status === "passed" ? "✓" : status === "failed" ? "!" : number}
      </div>
      <span className="text-[10px] font-medium" style={{ color: s.label }}>
        Phase {number}
      </span>
    </div>
  )
}

// ---------- main component ----------

interface Level2ReviewProps {
  standardId: string
}

interface Inputs {
  pastedHtml: string
  mechanicId: string
  builderDescription: string
  htmlHash: number
}

export function Level2Review({ standardId }: Level2ReviewProps) {
  const router = useRouter()
  const { activeProfile } = useAuth()
  const [hydrated, setHydrated] = useState(false)
  const [inputs, setInputs] = useState<Inputs | null>(null)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<HtmlReviewResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  // Drive the 4 dots: number of stages "completed" so far. We don't get
  // per-stage progress from the endpoint (single call), so we fake forward
  // motion with a slow tick while the request is in flight.
  const [progressIdx, setProgressIdx] = useState(0)
  const progressTimerRef = useRef<number | null>(null)

  const pasteKey = `mgb.l2.${standardId}.paste`
  const playtestKey = `mgb.l2.${standardId}.playtest`
  const scaffoldKey = `mgb.l2.${standardId}.scaffold`
  const reviewKey = `mgb.l2.${standardId}.review`

  // ---- hydration ----
  useEffect(() => {
    const paste = readJson<PersistedPaste>(pasteKey)
    const playtest = readJson<PersistedPlaytest>(playtestKey)
    const scaffold = readJson<PersistedScaffold>(scaffoldKey)

    if (!paste?.pastedHtml || !playtest?.wonAt) {
      // Required state missing — bounce back to paste screen.
      router.replace(`/build/${encodeURIComponent(standardId)}/level-2/paste`)
      return
    }
    const mechanicId = scaffold?.chosenMechanicId ?? ""
    const builderDescription = scaffold?.builderDescription ?? ""

    setInputs({
      pastedHtml: paste.pastedHtml,
      mechanicId,
      builderDescription,
      htmlHash: hashString(paste.pastedHtml),
    })
    setHydrated(true)
  }, [pasteKey, playtestKey, scaffoldKey, router, standardId])

  // ---- progress tick: advance dots 0→1→2→3 while running ----
  useEffect(() => {
    if (!running) {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
      return
    }
    setProgressIdx(0)
    // Phases advance roughly: 1 (Haiku ~3s), 2 (Haiku ~3s), 3 (Sonnet ~10s),
    // 4 (Sonnet ~15s). We just tick at ~4s intervals so the user sees motion.
    progressTimerRef.current = window.setInterval(() => {
      setProgressIdx((i) => (i < 3 ? i + 1 : i))
    }, 4000) as unknown as number
    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
    }
  }, [running])

  // ---- run review (or use cache) ----
  const runReview = useCallback(
    async (current: Inputs) => {
      setRunning(true)
      setError(null)
      try {
        const res = await fetch("/api/build-flow/html-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            standardId,
            mechanicId: current.mechanicId || "(unknown)",
            pastedHtml: current.pastedHtml,
            builderDescription: current.builderDescription,
          }),
        })
        const data = (await res.json().catch(() => null)) as
          | HtmlReviewResult
          | null
        if (!data || !data.decision) {
          setError("The reviewer didn't respond. Try again.")
          setResult({
            decision: "block",
            bullets: [
              {
                whatsWrong: "Couldn't review your game",
                howToFix: "Try again, or ask Barbara if it keeps happening",
              },
            ],
          })
        } else {
          setResult(data)
          writeJson(reviewKey, {
            result: data,
            runAt: new Date().toISOString(),
            htmlHash: current.htmlHash,
          } satisfies PersistedReview)
        }
      } catch (e) {
        setError((e as Error).message || "Network error.")
        setResult({
          decision: "block",
          bullets: [
            {
              whatsWrong: "Couldn't review your game",
              howToFix: "Try again, or ask Barbara if it keeps happening",
            },
          ],
        })
      } finally {
        setRunning(false)
      }
    },
    [reviewKey, standardId]
  )

  // ---- trigger review on hydration: use cache if fresh, else re-run ----
  const triggeredRef = useRef(false)
  useEffect(() => {
    if (!hydrated || !inputs || triggeredRef.current) return
    triggeredRef.current = true
    const cached = readJson<PersistedReview>(reviewKey)
    const now = Date.now()
    const fresh =
      cached &&
      cached.htmlHash === inputs.htmlHash &&
      now - new Date(cached.runAt).getTime() < REVIEW_TTL_MS
    if (fresh && cached) {
      setResult(cached.result)
      return
    }
    void runReview(inputs)
  }, [hydrated, inputs, reviewKey, runReview])

  // ---- handlers ----
  const handleEdit = useCallback(() => {
    router.push(`/build/${encodeURIComponent(standardId)}/level-2/paste`)
  }, [router, standardId])

  const handleSave = useCallback(async () => {
    if (!result || saving) return
    if (result.decision !== "pass" && result.decision !== "soft_warn") return
    if (!inputs) return
    if (!activeProfile) {
      setSaveError("You need to be signed in to save.")
      return
    }

    // eslint-disable-next-line no-console
    console.log("[telemetry] level_2.save_clicked", {
      standardId,
      mechanicId: inputs.mechanicId,
      decision: result.decision,
    })

    setSaving(true)
    setSaveError(null)
    try {
      const mechanicLabel = inputs.mechanicId || "game"
      const title = `${standardId} — ${mechanicLabel} by ${activeProfile.name || "Anonymous"}`
      const res = await apiFetch("/api/game/save", {
        method: "POST",
        body: JSON.stringify({
          title,
          authorUid: activeProfile.uid,
          authorName: activeProfile.name || "Anonymous",
          designerName: activeProfile.name || "Anonymous",
          standardId,
          gameHtml: inputs.pastedHtml,
          status: "pending_review",
          designDoc: inputs.builderDescription,
          source: "level-2",
          mechanicId: inputs.mechanicId,
          playCount: 0,
          ratingSum: 0,
          ratingCount: 0,
        }),
      })
      if (!res.ok) {
        throw new Error(`Save failed (${res.status})`)
      }
      const data = (await res.json().catch(() => null)) as
        | { id?: string; status?: string }
        | null

      // Clear Level 2 localStorage for this standard (Level 1 mastery untouched).
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(`mgb.l2.${standardId}.scaffold`)
          window.localStorage.removeItem(`mgb.l2.${standardId}.paste`)
          window.localStorage.removeItem(`mgb.l2.${standardId}.playtest`)
          window.localStorage.removeItem(`mgb.l2.${standardId}.review`)
        } catch {
          // ignore
        }
      }

      const qs = data?.id ? `?gameId=${encodeURIComponent(data.id)}` : ""
      router.push(
        `/build/${encodeURIComponent(standardId)}/level-2/saved${qs}`
      )
    } catch (e) {
      setSaveError(
        e instanceof Error ? e.message : "Couldn't save — try again."
      )
      setSaving(false)
    }
  }, [activeProfile, inputs, result, router, saving, standardId])

  // ---- derived dot statuses ----
  const dotStatuses: DotStatus[] = (() => {
    if (running) {
      const out: DotStatus[] = []
      for (let i = 0; i < 4; i++) {
        if (i < progressIdx) out.push("passed")
        else if (i === progressIdx) out.push("running")
        else out.push("pending")
      }
      return out
    }
    if (!result) {
      return ["pending", "pending", "pending", "pending"]
    }
    if (result.decision === "pass") {
      return ["passed", "passed", "passed", "passed"]
    }
    // soft_warn or block — mark all as completed; we don't know which failed
    // exactly without the structured stages, and per spec we don't reveal
    // agent names. Show as "complete" with the colored band below carrying
    // the verdict.
    return ["passed", "passed", "passed", "passed"]
  })()

  // ---- render ----
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Header */}
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
            <span className="text-zinc-200">Review</span>
          </div>
          <h1 className="mt-2 text-lg font-semibold">Reviewing your game</h1>
          <button
            type="button"
            onClick={handleEdit}
            className="mt-1 inline-block text-sm text-cyan-300 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-sm"
          >
            ← Back to playtest
          </button>
        </header>

        {/* Progress dial row */}
        <section
          aria-live="polite"
          className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/40 p-5"
        >
          <div className="mb-3 text-center text-sm text-zinc-200">
            {running
              ? "Reviewing your game…"
              : result?.decision === "pass"
                ? "Your game looks great!"
                : result?.decision === "soft_warn"
                  ? "Looks good — a few small notes."
                  : result?.decision === "block"
                    ? "Let's fix these before you save."
                    : "Getting ready…"}
          </div>
          <div className="flex items-start justify-between gap-2">
            {dotStatuses.map((s, i) => (
              <PhaseDot key={i} number={i + 1} status={s} />
            ))}
          </div>
          {error && (
            <p className="mt-4 text-center text-xs text-amber-300">{error}</p>
          )}
        </section>

        {/* Result band */}
        {result && !running && (
          <ResultBand
            decision={result.decision}
            bullets={result.bullets}
            onEdit={handleEdit}
            onSave={handleSave}
            saving={saving}
            saveError={saveError}
          />
        )}
      </div>

      <style>{`
        @keyframes review-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
      `}</style>
    </div>
  )
}

// ---------- result band ----------

interface ResultBandProps {
  decision: HtmlReviewResult["decision"]
  bullets: ReviewBullet[]
  onEdit: () => void
  onSave: () => void
  saving: boolean
  saveError: string | null
}

function ResultBand({
  decision,
  bullets,
  onEdit,
  onSave,
  saving,
  saveError,
}: ResultBandProps) {
  const band =
    decision === "pass"
      ? {
          border: "border-emerald-400/50",
          bg: "bg-emerald-400/5",
          accent: "bg-emerald-400/80",
          text: "text-emerald-100",
          headline: "Your game looks great!",
        }
      : decision === "soft_warn"
        ? {
            border: "border-amber-400/50",
            bg: "bg-amber-400/5",
            accent: "bg-amber-400/80",
            text: "text-amber-100",
            headline: "Looks good — a few small notes.",
          }
        : {
            border: "border-rose-400/50",
            bg: "bg-rose-400/5",
            accent: "bg-rose-400/80",
            text: "text-rose-100",
            headline: "Let's fix these before you save.",
          }

  return (
    <section
      className={`overflow-hidden rounded-lg border ${band.border} ${band.bg}`}
    >
      <div className={`h-1 w-full ${band.accent}`} />
      <div className="p-4">
        <p className={`text-sm font-medium ${band.text}`}>{band.headline}</p>

        {bullets.length > 0 && (
          <ul className="mt-3 space-y-2">
            {bullets.map((b, i) => (
              <li key={i} className={`text-sm ${band.text}`}>
                <span className="font-medium">{b.whatsWrong}</span>
                <span className="mx-2 opacity-70">→</span>
                <span>{b.howToFix}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {decision === "block" ? (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center rounded-md border border-cyan-400/60 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Edit my HTML and try again
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                aria-busy={saving}
                className="inline-flex items-center justify-center rounded-md border border-cyan-400/60 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save and send to Guide →"}
              </button>
              {decision === "soft_warn" && !saving && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="text-xs text-cyan-300 underline hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-sm"
                >
                  Edit my HTML and try again
                </button>
              )}
            </>
          )}
        </div>

        {saveError && decision !== "block" && (
          <div className="mt-3 flex items-center gap-3">
            <p className="text-xs text-rose-300" role="alert">
              Couldn&apos;t save — try again.
            </p>
            <button
              type="button"
              onClick={onSave}
              className="text-xs text-cyan-300 underline hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-sm"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
