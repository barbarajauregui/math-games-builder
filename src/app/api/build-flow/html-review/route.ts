/**
 * Level 2 Gate C — HTML review (4-stage critique ladder reduced to bullets).
 *
 * Spec: docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md §9, §10, §13
 * (Task 12 in §16's build order).
 *
 * Runs the shared 4-stage ladder (`runCritiqueLadder` in
 * `src/lib/critique-ladder.ts`), then reduces the structured per-stage output
 * into ≤ 6 short bullets in plain-English "what's wrong → how to fix" format.
 *
 * Decision aggregation:
 *   - Any hard fail → "block"
 *   - No hard fail but Critic flagged NEEDS_WORK / Adversary EXPLOITABLE on a
 *     non-blocking criterion → "soft_warn" (currently: any non-passing stage
 *     yields block per Critic semantics — see notes below)
 *   - All clean → "pass"
 *
 * NOTE on soft_warn: the existing ladder is hard-gate by design — a stage
 * either passes (all 4 criteria pass + overallVerdict APPROVED) or it
 * fails. To honor the spec's pass/soft_warn/block trichotomy WITHOUT
 * adding new prompts, we treat:
 *   - 4 stages all-passed                       → "pass"
 *   - failed stage where verdict is NEEDS_WORK
 *     OR adversary verdict is EXPLOITABLE       → "soft_warn"
 *   - failed stage REJECT or TRIVIALLY-EXPLOITABLE → "block"
 * This is the cheapest honest mapping; bullets get extracted from the
 * failing stage's structured output.
 */

import { NextRequest } from "next/server"
import standardsData from "@/data/standards.json"
import { sanitizeGameHtml } from "@/lib/html-sanitizer"
import type {
  AgentLadderInput,
  CriticVerdict,
  ShortcutAdversaryVerdict,
  StageResult,
} from "@/lib/agent-prompts"
import { runCritiqueLadder } from "@/lib/critique-ladder"
import type { HtmlReviewResult, ReviewBullet } from "@/lib/build-flow/types"
import { verifyAuth } from "@/lib/api-auth"
import { trackServer } from "@/lib/telemetry/posthog-server"

export const maxDuration = 60

const MAX_BULLETS = 6
const MAX_WORDS_PER_FIELD = 12

interface RequestBody {
  standardId?: unknown
  mechanicId?: unknown
  pastedHtml?: unknown
  builderDescription?: unknown
}

const SERVICE_ERROR_RESULT: HtmlReviewResult = {
  decision: "block",
  bullets: [
    {
      whatsWrong: "Couldn't review your game",
      howToFix: "Try again, or ask Barbara if it keeps happening",
    },
  ],
}

function truncateWords(s: string, maxWords: number): string {
  const cleaned = s.trim().replace(/\s+/g, " ")
  if (!cleaned) return ""
  const parts = cleaned.split(" ")
  if (parts.length <= maxWords) return cleaned
  return parts.slice(0, maxWords).join(" ") + "…"
}

function sentencize(s: string): string {
  // First sentence-ish chunk; collapse newlines, trim trailing punctuation.
  const flat = s.replace(/\s+/g, " ").trim()
  const firstSentence = flat.split(/(?<=[.!?])\s+/)[0] ?? flat
  return firstSentence.replace(/[.!?]+$/, "")
}

function makeBullet(whatsWrong: string, howToFix: string): ReviewBullet | null {
  const w = truncateWords(sentencize(whatsWrong), MAX_WORDS_PER_FIELD)
  const h = truncateWords(sentencize(howToFix), MAX_WORDS_PER_FIELD)
  if (!w || !h) return null
  return { whatsWrong: w, howToFix: h }
}

function bulletsFromCritic(v: CriticVerdict): ReviewBullet[] {
  const out: ReviewBullet[] = []
  const fallbackFixes = (v.revisionSuggestions ?? []).filter(
    (s): s is string => typeof s === "string" && s.trim().length > 0
  )
  let fixIdx = 0
  const nextFix = (): string => {
    if (fixIdx < fallbackFixes.length) return fallbackFixes[fixIdx++]
    return "Revise the game so the math is the action."
  }

  if (!v.c1RealWorldScenario.pass) {
    const b = makeBullet(v.c1RealWorldScenario.reason, nextFix())
    if (b) out.push(b)
  }
  if (!v.c2MathIsGameplay.pass) {
    const b = makeBullet(v.c2MathIsGameplay.reason, nextFix())
    if (b) out.push(b)
  }
  if (!v.c3MustKnowMathToWin.pass) {
    const b = makeBullet(v.c3MustKnowMathToWin.reason, nextFix())
    if (b) out.push(b)
  }
  if (!v.c4ConstructValidity.pass) {
    const b = makeBullet(v.c4ConstructValidity.reason, nextFix())
    if (b) out.push(b)
  }
  return out
}

function bulletsFromAdversary(v: ShortcutAdversaryVerdict): ReviewBullet[] {
  const out: ReviewBullet[] = []
  for (const s of v.shortcutsFound ?? []) {
    const whatsWrong = s.sequence || s.category || "Found a way to win without the math"
    const howToFix = s.repairSuggestion || "Make winning require a correct math action"
    const b = makeBullet(whatsWrong, howToFix)
    if (b) out.push(b)
  }
  // Fallback: if no per-shortcut entries but verdict still failed, use summary.
  if (out.length === 0 && v.summary) {
    const b = makeBullet(v.summary, "Make winning require a correct math action")
    if (b) out.push(b)
  }
  return out
}

function bulletsFromStage(s: StageResult): ReviewBullet[] {
  if (s.criticVerdict) return bulletsFromCritic(s.criticVerdict)
  if (s.shortcutVerdict) return bulletsFromAdversary(s.shortcutVerdict)
  return []
}

function dedupe(bullets: ReviewBullet[]): ReviewBullet[] {
  const seen = new Set<string>()
  const out: ReviewBullet[] = []
  for (const b of bullets) {
    const k = (b.whatsWrong + "|" + b.howToFix).toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    out.push(b)
  }
  return out
}

function decisionFromStage(s: StageResult): "block" | "soft_warn" {
  if (s.criticVerdict) {
    // REJECT = block, NEEDS_WORK = soft_warn, APPROVED = (shouldn't be here)
    return s.criticVerdict.overallVerdict === "NEEDS_WORK" ? "soft_warn" : "block"
  }
  if (s.shortcutVerdict) {
    return s.shortcutVerdict.verdict === "EXPLOITABLE" ? "soft_warn" : "block"
  }
  return "block"
}

/**
 * Reduce the structured ladder result into ≤ 6 bullets. Prioritize deeper
 * stages first (Stage 4 > 3 > 2 > 1) since they have richer signal.
 */
function reduceToBullets(stages: StageResult[]): ReviewBullet[] {
  const ordered = [...stages].sort((a, b) => b.stage - a.stage) // 4,3,2,1
  const collected: ReviewBullet[] = []
  for (const s of ordered) {
    if (s.passed) continue
    const fromStage = bulletsFromStage(s)
    for (const b of fromStage) {
      collected.push(b)
      if (collected.length >= MAX_BULLETS * 2) break // collect a bit extra before dedupe
    }
    if (collected.length >= MAX_BULLETS * 2) break
  }
  return dedupe(collected).slice(0, MAX_BULLETS)
}

type StageStatus = "pass" | "fail" | "not_run"

/**
 * Derive per-stage status from a (possibly partial) stages array. The ladder
 * halts on first failure, so a stage that doesn't appear in the array is
 * `not_run`. A stage that appears is `pass` (passed === true) or `fail`.
 */
function stageStatuses(stages: StageResult[]): {
  stage1: StageStatus
  stage2: StageStatus
  stage3: StageStatus
  stage4: StageStatus
} {
  const lookup = (n: number): StageStatus => {
    const s = stages.find((x) => x.stage === n)
    if (!s) return "not_run"
    return s.passed ? "pass" : "fail"
  }
  return {
    stage1: lookup(1),
    stage2: lookup(2),
    stage3: lookup(3),
    stage4: lookup(4),
  }
}

function lookupStandardText(standardId: string): string | null {
  const nodes = (standardsData as {
    nodes: Array<{ id: string; description: string }>
  }).nodes
  const found = nodes.find((n) => n.id === standardId)
  return found?.description ?? null
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now()

  // Gate on signed-in Builder. Endpoint runs the 4-stage critique ladder
  // (~$0.05–$0.20 per call) — must not be open to anonymous traffic. Pattern
  // matches src/app/api/game/save/route.ts.
  const user = await verifyAuth(req)
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  let body: RequestBody
  try {
    body = (await req.json()) as RequestBody
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const standardId =
    typeof body.standardId === "string" ? body.standardId.trim() : ""
  const mechanicId =
    typeof body.mechanicId === "string" ? body.mechanicId.trim() : ""
  const pastedHtml = typeof body.pastedHtml === "string" ? body.pastedHtml : ""
  const builderDescription =
    typeof body.builderDescription === "string" ? body.builderDescription : ""

  if (!standardId) {
    return Response.json({ error: "Missing standardId." }, { status: 400 })
  }
  if (!mechanicId) {
    return Response.json({ error: "Missing mechanicId." }, { status: 400 })
  }
  if (!pastedHtml || pastedHtml.length < 50) {
    return Response.json(
      { error: "pastedHtml is too short or missing." },
      { status: 400 }
    )
  }

  const standardText = lookupStandardText(standardId)
  if (!standardText) {
    return Response.json(
      { error: `Standard ${standardId} not found.` },
      { status: 400 }
    )
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[html-review] ANTHROPIC_API_KEY is not set")
    const latencyMs = Date.now() - startedAt
    trackServer(`standard_${standardId}`, {
      event: "level_2.html_review_run",
      properties: {
        standardId,
        mechanicId,
        decision: SERVICE_ERROR_RESULT.decision,
        latencyMs,
        bulletsCount: SERVICE_ERROR_RESULT.bullets.length,
        ...stageStatuses([]),
      },
    })
    return Response.json(SERVICE_ERROR_RESULT, { status: 500 })
  }

  // Sanitize + truncate (same pattern as the existing critique endpoint).
  const sanitized = sanitizeGameHtml(pastedHtml)
  const truncated =
    sanitized.length > 16000
      ? sanitized.slice(0, 16000) + "\n\n<!-- ... truncated ... -->"
      : sanitized

  const input: AgentLadderInput = {
    standardId,
    standardText,
    scenario: builderDescription.trim() || "(no description provided)",
    gameHtml: truncated,
  }

  let ladderResult: Awaited<ReturnType<typeof runCritiqueLadder>>
  try {
    ladderResult = await runCritiqueLadder(input)
  } catch (err) {
    console.error("[html-review] runCritiqueLadder threw:", err)
    const latencyMs = Date.now() - startedAt
    trackServer(`standard_${standardId}`, {
      event: "level_2.html_review_run",
      properties: {
        standardId,
        mechanicId,
        decision: SERVICE_ERROR_RESULT.decision,
        latencyMs,
        bulletsCount: SERVICE_ERROR_RESULT.bullets.length,
        ...stageStatuses([]),
      },
    })
    return Response.json(SERVICE_ERROR_RESULT, { status: 500 })
  }

  if (ladderResult.serviceError) {
    const latencyMs = Date.now() - startedAt
    // Keep the serviceError detail on the server log for debugging — it isn't
    // in the typed event contract.
    // eslint-disable-next-line no-console
    console.log("[html-review] serviceError:", ladderResult.serviceError)
    trackServer(`standard_${standardId}`, {
      event: "level_2.html_review_run",
      properties: {
        standardId,
        mechanicId,
        decision: SERVICE_ERROR_RESULT.decision,
        latencyMs,
        bulletsCount: SERVICE_ERROR_RESULT.bullets.length,
        ...stageStatuses(ladderResult.stages),
      },
    })
    return Response.json(SERVICE_ERROR_RESULT, { status: 500 })
  }

  // Determine decision
  const failedStage = ladderResult.stages.find((s) => !s.passed)
  let decision: HtmlReviewResult["decision"]
  let bullets: ReviewBullet[]

  let failedStageNumber: number | null = null
  if (!failedStage) {
    decision = "pass"
    bullets = []
  } else {
    decision = decisionFromStage(failedStage)
    failedStageNumber = failedStage.stage
    bullets = reduceToBullets(ladderResult.stages)
    if (bullets.length === 0) {
      // Defensive: failed but couldn't extract anything readable. Treat as block.
      decision = "block"
      bullets = [
        {
          whatsWrong: "Review found problems we couldn't summarize",
          howToFix: "Edit your HTML and try again",
        },
      ]
    }
  }

  const result: HtmlReviewResult = { decision, bullets, failedStageNumber }

  const latencyMs = Date.now() - startedAt
  // Per-stage pass/fail and cost are useful for dev debugging but not in the
  // typed event contract — keep as a server-side console log.
  // eslint-disable-next-line no-console
  console.log("[html-review] stages", {
    stage1: ladderResult.stages[0]?.passed,
    stage2: ladderResult.stages[1]?.passed,
    stage3: ladderResult.stages[2]?.passed,
    stage4: ladderResult.stages[3]?.passed,
    costUsd: ladderResult.totalCostEstimateUsd,
  })
  trackServer(`standard_${standardId}`, {
    event: "level_2.html_review_run",
    properties: {
      standardId,
      mechanicId,
      decision: result.decision,
      latencyMs,
      bulletsCount: result.bullets.length,
      ...stageStatuses(ladderResult.stages),
    },
  })

  return Response.json(result)
}
