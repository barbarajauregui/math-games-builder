"use client"

/**
 * Stage-progression UI for the runtime agent ladder.
 *
 * Spec: docs/superpowers/specs/2026-05-10-library-design.md §13.
 * Foundation Fix #1 from docs/audit/09-build-flow.md.
 *
 * Shows 4 brass-colored dial markers, each going green as a stage passes,
 * amber on the failing stage with the stage's builder-facing message shown
 * below. The last dial labelled is the one currently running.
 */

import type { StageResult } from "@/lib/agent-prompts"

export type StageStatus = "pending" | "running" | "passed" | "failed"

export interface LadderStageView {
  label: string
  status: StageStatus
  message?: string
}

interface AgentLadderProgressProps {
  /** Index 0-3 corresponding to stages 1-4 */
  stages: [LadderStageView, LadderStageView, LadderStageView, LadderStageView]
  /** Plain-English message about overall state (success or failure summary) */
  headlineMessage?: string
  onRevise?: () => void
  onCancel?: () => void
}

const STAGE_LABELS = ["Critic 1", "Critic 2", "Adversary 1", "Adversary 2"]

function dialColor(status: StageStatus): { ring: string; fill: string; label: string } {
  switch (status) {
    case "passed":
      return { ring: "rgba(16,185,129,0.7)", fill: "rgba(16,185,129,0.25)", label: "#34d399" }
    case "failed":
      return { ring: "rgba(245,158,11,0.85)", fill: "rgba(245,158,11,0.30)", label: "#fbbf24" }
    case "running":
      return { ring: "rgba(217,179,99,0.95)", fill: "rgba(217,179,99,0.20)", label: "#e8c97a" }
    case "pending":
    default:
      return { ring: "rgba(120,90,40,0.45)", fill: "rgba(60,45,20,0.30)", label: "#a78b5d" }
  }
}

export function AgentLadderProgress({
  stages,
  headlineMessage,
  onRevise,
  onCancel,
}: AgentLadderProgressProps) {
  const failed = stages.find((s) => s.status === "failed")
  const allPassed = stages.every((s) => s.status === "passed")

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center px-4"
      style={{ background: "rgba(8,8,12,0.85)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="max-w-xl w-full rounded-2xl border p-6"
        style={{
          background: "linear-gradient(180deg, rgba(24,18,10,0.96) 0%, rgba(14,10,6,0.96) 100%)",
          borderColor: "rgba(217,179,99,0.30)",
          fontFamily: "'Lexend', system-ui, sans-serif",
          boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
        }}
      >
        <h2
          className="text-base font-semibold mb-1"
          style={{ color: "#e8c97a", letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          Agent review
        </h2>
        <p className="text-sm text-zinc-400 mb-5">
          Four reviewers check every game before it goes to your guide.
        </p>

        {/* Dial row */}
        <div className="flex items-start justify-between gap-2 mb-5">
          {stages.map((s, i) => {
            const c = dialColor(s.status)
            return (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="relative w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    border: `2px solid ${c.ring}`,
                    background: c.fill,
                    boxShadow:
                      s.status === "running"
                        ? `0 0 12px ${c.ring}`
                        : s.status === "passed"
                        ? "0 0 8px rgba(16,185,129,0.4)"
                        : s.status === "failed"
                        ? "0 0 8px rgba(245,158,11,0.4)"
                        : "none",
                    animation: s.status === "running" ? "ladder-pulse 1.4s ease-in-out infinite" : undefined,
                  }}
                >
                  <span style={{ color: c.label, fontSize: 14, fontWeight: 700 }}>
                    {s.status === "passed" ? "✓" : s.status === "failed" ? "!" : i + 1}
                  </span>
                </div>
                <span className="text-[11px] font-medium" style={{ color: c.label }}>
                  {STAGE_LABELS[i]}
                </span>
              </div>
            )
          })}
        </div>

        {/* Headline */}
        {headlineMessage && (
          <p
            className="text-sm mb-3"
            style={{ color: allPassed ? "#86efac" : failed ? "#fcd34d" : "#d4d4d8" }}
          >
            {headlineMessage}
          </p>
        )}

        {/* Failure detail */}
        {failed && failed.message && (
          <div
            className="text-sm rounded-lg p-3 mb-4 whitespace-pre-wrap"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "#fde68a",
            }}
          >
            {failed.message}
          </div>
        )}

        {/* Actions */}
        {(onRevise || onCancel) && (
          <div className="flex items-center justify-end gap-2 mt-2">
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-md border border-zinc-700"
              >
                Close
              </button>
            )}
            {onRevise && failed && (
              <button
                onClick={onRevise}
                className="text-xs font-semibold rounded-md px-4 py-1.5 active:scale-[0.97] transition-transform"
                style={{
                  background: "linear-gradient(135deg, #d9b363, #b8862c)",
                  color: "#1a1208",
                  boxShadow: "0 2px 8px rgba(217,179,99,0.35)",
                }}
              >
                Revise
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes ladder-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
      `}</style>
    </div>
  )
}

/**
 * Helper: convert a server-side critique response into the 4-stage view
 * the UI consumes.
 */
export function buildLadderView(
  serverStages: StageResult[],
  finalVerdict: "PASSED" | "FAILED" | "RUNNING"
): [LadderStageView, LadderStageView, LadderStageView, LadderStageView] {
  const view: LadderStageView[] = STAGE_LABELS.map((label) => ({
    label,
    status: "pending" as StageStatus,
  }))
  for (const s of serverStages) {
    const idx = s.stage - 1
    if (idx < 0 || idx > 3) continue
    view[idx] = {
      label: STAGE_LABELS[idx],
      status: s.passed ? "passed" : "failed",
      message: s.builderFacingMessage,
    }
  }
  // If still running and no failure yet, mark next pending stage as running
  if (finalVerdict === "RUNNING") {
    const nextIdx = view.findIndex((v) => v.status === "pending")
    if (nextIdx >= 0) view[nextIdx] = { ...view[nextIdx], status: "running" }
  }
  return view as [LadderStageView, LadderStageView, LadderStageView, LadderStageView]
}
