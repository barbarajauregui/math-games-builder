"use client"

import Link from "next/link"

/**
 * Level 2 saved confirmation screen.
 *
 * Spec v3 §16 (Task 13) (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`).
 *
 * Reached only after a successful save to /api/game/save. Foundation Fix #2
 * (commit `1a8afa9`) guarantees the new game record's status is
 * `pending_review` — only the Guide approval endpoint can flip it to
 * `published`. So we tell the Builder exactly that: it's with the Guide.
 *
 * Two CTAs:
 *   - Back to my games  → /learner   (Builder's home)
 *   - Build another     → /build/[standardId]  (Level 1 picker)
 *
 * The Level 1 mastery key (`mgb.l1.mechanicWins.${standardId}`) is left
 * untouched on save — that's progress, not in-flight Level 2 state — so the
 * Builder can re-enter Level 2 directly from the picker.
 */

interface Level2SavedProps {
  standardId: string
}

export function Level2Saved({ standardId }: Level2SavedProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-8 text-center">
          <div
            aria-hidden
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-400/60 bg-emerald-400/15 text-3xl text-emerald-300"
            style={{ boxShadow: "0 0 24px rgba(16,185,129,0.25)" }}
          >
            ✓
          </div>
          <h1 className="text-2xl font-semibold text-emerald-100">
            Your game is with the Guide!
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-emerald-100/80">
            We sent your game to your Guide. They&apos;ll take a look at it
            soon. You&apos;ll see it in The Star Atlas Library after they
            approve it.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/learner"
              className="inline-flex items-center justify-center rounded-md border border-cyan-400/60 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Back to my games
            </Link>
            <Link
              href={`/build/${encodeURIComponent(standardId)}`}
              className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Build another game for this standard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
