/**
 * Runtime Agent Ladder — POST /api/game/critique
 *
 * The 4-stage pipeline that runs on every game submission BEFORE save.
 * Both cheap Haiku stages run first (Critic + Shortcut Adversary). Only if
 * BOTH pass do we spend Sonnet tokens on the deep stages. Each stage either
 * passes (proceed) or fails (Builder sees specific reasons; revises). A
 * FAIL halts the ladder.
 *
 * Spec: docs/superpowers/specs/2026-05-10-library-design.md §13.
 * Foundation Fix #1 from docs/audit/09-build-flow.md.
 * Reorder per Barbara 2026-05-11: cheap-cheap-deep-deep saves Sonnet
 * tokens on games that pass the structural check but have shortcuts.
 *
 * Stage 1: Haiku Critic — cheap structural filter (~$0.001)
 * Stage 2: Haiku Shortcut Adversary — cheap shortcut probe (~$0.005)
 * Stage 3: Sonnet Critic — deep structural inspection (~$0.025)
 * Stage 4: Sonnet Shortcut Adversary — deep adversarial probe (~$0.075)
 *
 * Ladder logic now lives in `src/lib/critique-ladder.ts` and is shared with
 * `/api/build-flow/html-review` (spec v3 Task 12).
 */

import { sanitizeGameHtml } from "@/lib/html-sanitizer"
import { verifyAuth } from "@/lib/api-auth"
import standardsData from "@/data/standards.json"
import type { AgentLadderInput, StageResult } from "@/lib/agent-prompts"
import { runCritiqueLadder } from "@/lib/critique-ladder"

export const maxDuration = 60

interface StandardLite {
  id: string
  description: string
}

function lookupStandardText(standardId: string): string | null {
  const nodes = (standardsData as { nodes: StandardLite[] }).nodes
  const found = nodes.find((n) => n.id === standardId)
  return found?.description ?? null
}

function stageErrorMessage(nextStageNumber: number): string {
  switch (nextStageNumber) {
    case 1:
      return "We hit a service issue while running the first review. Please try Add to library again in a moment."
    case 2:
      return "We hit a service issue while running the shortcut probe. Please try Add to library again in a moment."
    case 3:
      return "We hit a service issue while running the deep review. Please try Add to library again in a moment."
    case 4:
    default:
      return "We hit a service issue while running the deep shortcut probe. Please try Add to library again in a moment."
  }
}

export async function POST(req: Request) {
  const user = await verifyAuth(req)
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { standardId?: unknown; scenario?: unknown; gameHtml?: unknown }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const standardId = typeof body.standardId === "string" ? body.standardId : ""
  const scenario = typeof body.scenario === "string" ? body.scenario : ""
  const rawHtml = typeof body.gameHtml === "string" ? body.gameHtml : ""

  if (!standardId) return Response.json({ error: "Missing standardId." }, { status: 400 })
  if (!rawHtml || rawHtml.length < 50) {
    return Response.json({ error: "gameHtml is too short or missing." }, { status: 400 })
  }

  const standardText = lookupStandardText(standardId)
  if (!standardText) {
    return Response.json(
      { error: `Standard ${standardId} not found in standards graph.` },
      { status: 400 }
    )
  }

  // Sanitize + truncate (same pattern as judge-html/route.ts)
  const sanitized = sanitizeGameHtml(rawHtml)
  const truncated =
    sanitized.length > 16000
      ? sanitized.slice(0, 16000) + "\n\n<!-- ... truncated ... -->"
      : sanitized

  const input: AgentLadderInput = {
    standardId,
    standardText,
    scenario: scenario || "(no scenario provided)",
    gameHtml: truncated,
  }

  const result = await runCritiqueLadder(input)
  const stages: StageResult[] = result.stages

  if (result.serviceError) {
    const nextStageNumber = (stages.length + 1) as 1 | 2 | 3 | 4
    return Response.json(
      {
        passed: false,
        stages,
        finalVerdict: "FAILED",
        builderFacingMessage: stageErrorMessage(nextStageNumber),
        error: result.serviceError,
        totalCostEstimateUsd: result.totalCostEstimateUsd,
      },
      { status: 502 }
    )
  }

  if (!result.passed) {
    const lastStage = stages[stages.length - 1]
    return Response.json({
      passed: false,
      stages,
      finalVerdict: "FAILED",
      builderFacingMessage:
        lastStage?.builderFacingMessage ?? `Stage ${lastStage?.stage ?? "?"} failed.`,
      totalCostEstimateUsd: result.totalCostEstimateUsd,
    })
  }

  return Response.json({
    passed: true,
    stages,
    finalVerdict: "PASSED",
    builderFacingMessage:
      "All four reviewers passed your game. Sending it to your guide for final approval.",
    totalCostEstimateUsd: result.totalCostEstimateUsd,
  })
}
