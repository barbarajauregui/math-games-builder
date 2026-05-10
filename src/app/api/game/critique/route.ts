/**
 * Runtime Agent Ladder — POST /api/game/critique
 *
 * The 4-stage Haiku→Sonnet→Haiku→Sonnet pipeline that runs on every game
 * submission BEFORE save. Each stage either passes (proceed) or fails
 * (Builder sees specific reasons; revises). A FAIL halts the ladder.
 *
 * Spec: docs/superpowers/specs/2026-05-10-library-design.md §13.
 * Foundation Fix #1 from docs/audit/09-build-flow.md.
 *
 * Stage 1: Haiku Critic — cheap filter (~$0.001)
 * Stage 2: Sonnet Critic — deep inspection (~$0.025)
 * Stage 3: Haiku Shortcut Adversary — obvious shortcuts (~$0.005)
 * Stage 4: Sonnet Shortcut Adversary — creative shortcuts (~$0.075)
 */

import Anthropic from "@anthropic-ai/sdk"
import { sanitizeGameHtml } from "@/lib/html-sanitizer"
import { verifyAuth } from "@/lib/api-auth"
import standardsData from "@/data/standards.json"
import {
  HAIKU_CRITIC_MODEL,
  buildHaikuCriticPrompt,
  SONNET_CRITIC_MODEL,
  buildSonnetCriticPrompt,
  HAIKU_SHORTCUT_ADVERSARY_MODEL,
  buildHaikuShortcutAdversaryPrompt,
  SONNET_SHORTCUT_ADVERSARY_MODEL,
  buildSonnetShortcutAdversaryPrompt,
  type AgentLadderInput,
  type CriticVerdict,
  type ShortcutAdversaryVerdict,
  type StageResult,
} from "@/lib/agent-prompts"

export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// Approximate per-million-token prices (USD). Used for cost telemetry only.
function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const isHaiku = model === HAIKU_CRITIC_MODEL || model === HAIKU_SHORTCUT_ADVERSARY_MODEL
  const inputPerM = isHaiku ? 1.0 : 3.0
  const outputPerM = isHaiku ? 5.0 : 15.0
  return (inputTokens * inputPerM) / 1_000_000 + (outputTokens * outputPerM) / 1_000_000
}

function stripCodeFences(text: string): string {
  let cleaned = text.trim()
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()
  }
  return cleaned
}

interface RawMessageResult {
  text: string
  inputTokens: number
  outputTokens: number
}

async function callModel(model: string, prompt: string, maxTokens: number): Promise<RawMessageResult> {
  const message = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  })
  const text = message.content[0]?.type === "text" ? message.content[0].text : ""
  return {
    text,
    inputTokens: message.usage?.input_tokens ?? 0,
    outputTokens: message.usage?.output_tokens ?? 0,
  }
}

async function callModelWithRetry(
  model: string,
  prompt: string,
  maxTokens: number
): Promise<{ parsed: unknown; cost: number }> {
  let lastErr: unknown = null
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await callModel(model, prompt, maxTokens)
      const cleaned = stripCodeFences(res.text)
      const parsed = JSON.parse(cleaned)
      const cost = estimateCost(model, res.inputTokens, res.outputTokens)
      return { parsed, cost }
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error("Model call failed after retry")
}

function criticPassed(v: CriticVerdict): boolean {
  return (
    v.c1RealWorldScenario.pass &&
    v.c2MathIsGameplay.pass &&
    v.c3MustKnowMathToWin.pass &&
    v.c4ConstructValidity.pass &&
    v.overallVerdict === "APPROVED"
  )
}

function criticBuilderMessage(v: CriticVerdict, stageName: string): string {
  const failed: string[] = []
  if (!v.c1RealWorldScenario.pass) failed.push(`Real-world scenario: ${v.c1RealWorldScenario.reason}`)
  if (!v.c2MathIsGameplay.pass) failed.push(`Math IS the gameplay: ${v.c2MathIsGameplay.reason}`)
  if (!v.c3MustKnowMathToWin.pass) failed.push(`Cannot win without the math: ${v.c3MustKnowMathToWin.reason}`)
  if (!v.c4ConstructValidity.pass) failed.push(`Measures the right skill: ${v.c4ConstructValidity.reason}`)
  const suggestions = v.revisionSuggestions?.length
    ? `\n\nWhat to try:\n- ${v.revisionSuggestions.join("\n- ")}`
    : ""
  if (failed.length === 0) {
    return `${stageName} flagged ${v.overallVerdict}.${suggestions}`
  }
  return `${stageName} found problems:\n- ${failed.join("\n- ")}${suggestions}`
}

function shortcutPassed(v: ShortcutAdversaryVerdict): boolean {
  return v.verdict === "SHORTCUT-FREE"
}

function shortcutBuilderMessage(v: ShortcutAdversaryVerdict, stageName: string): string {
  const lines: string[] = []
  lines.push(`${stageName} found a way to win without the math (${v.verdict}).`)
  if (v.summary) lines.push(v.summary)
  if (v.shortcutsFound?.length) {
    lines.push("\nShortcuts found:")
    for (const s of v.shortcutsFound) {
      lines.push(`- [${s.severity}] ${s.category}: ${s.sequence}`)
      if (s.repairSuggestion) lines.push(`  Fix: ${s.repairSuggestion}`)
    }
  }
  return lines.join("\n")
}

interface StandardLite {
  id: string
  description: string
}

function lookupStandardText(standardId: string): string | null {
  const nodes = (standardsData as { nodes: StandardLite[] }).nodes
  const found = nodes.find((n) => n.id === standardId)
  return found?.description ?? null
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

  const stages: StageResult[] = []
  let totalCost = 0

  // ---------- Stage 1: Haiku Critic ----------
  try {
    const { parsed, cost } = await callModelWithRetry(
      HAIKU_CRITIC_MODEL,
      buildHaikuCriticPrompt(input),
      900
    )
    totalCost += cost
    const verdict = parsed as CriticVerdict
    const passed = criticPassed(verdict)
    const stage1: StageResult = {
      stage: 1,
      stageName: "Haiku Critic",
      passed,
      criticVerdict: verdict,
      builderFacingMessage: passed ? undefined : criticBuilderMessage(verdict, "Critic 1 (quick)"),
      costEstimateUsd: cost,
    }
    stages.push(stage1)
    if (!passed) {
      return Response.json({
        passed: false,
        stages,
        finalVerdict: "FAILED",
        builderFacingMessage: stage1.builderFacingMessage ?? "Stage 1 failed.",
        totalCostEstimateUsd: totalCost,
      })
    }
  } catch (err) {
    return Response.json(
      {
        passed: false,
        stages,
        finalVerdict: "FAILED",
        builderFacingMessage:
          "We hit a service issue while running the first review. Please try Add to library again in a moment.",
        error: err instanceof Error ? err.message : String(err),
        totalCostEstimateUsd: totalCost,
      },
      { status: 502 }
    )
  }

  // ---------- Stage 2: Sonnet Critic ----------
  try {
    const { parsed, cost } = await callModelWithRetry(
      SONNET_CRITIC_MODEL,
      buildSonnetCriticPrompt(input),
      1400
    )
    totalCost += cost
    const verdict = parsed as CriticVerdict
    const passed = criticPassed(verdict)
    const stage2: StageResult = {
      stage: 2,
      stageName: "Sonnet Critic",
      passed,
      criticVerdict: verdict,
      builderFacingMessage: passed ? undefined : criticBuilderMessage(verdict, "Critic 2 (deep)"),
      costEstimateUsd: cost,
    }
    stages.push(stage2)
    if (!passed) {
      return Response.json({
        passed: false,
        stages,
        finalVerdict: "FAILED",
        builderFacingMessage: stage2.builderFacingMessage ?? "Stage 2 failed.",
        totalCostEstimateUsd: totalCost,
      })
    }
  } catch (err) {
    return Response.json(
      {
        passed: false,
        stages,
        finalVerdict: "FAILED",
        builderFacingMessage:
          "We hit a service issue while running the deep review. Please try Add to library again in a moment.",
        error: err instanceof Error ? err.message : String(err),
        totalCostEstimateUsd: totalCost,
      },
      { status: 502 }
    )
  }

  // ---------- Stage 3: Haiku Shortcut Adversary ----------
  try {
    const { parsed, cost } = await callModelWithRetry(
      HAIKU_SHORTCUT_ADVERSARY_MODEL,
      buildHaikuShortcutAdversaryPrompt(input),
      900
    )
    totalCost += cost
    const verdict = parsed as ShortcutAdversaryVerdict
    const passed = shortcutPassed(verdict)
    const stage3: StageResult = {
      stage: 3,
      stageName: "Haiku Shortcut Adversary",
      passed,
      shortcutVerdict: verdict,
      builderFacingMessage: passed
        ? undefined
        : shortcutBuilderMessage(verdict, "Adversary 1 (obvious)"),
      costEstimateUsd: cost,
    }
    stages.push(stage3)
    if (!passed) {
      return Response.json({
        passed: false,
        stages,
        finalVerdict: "FAILED",
        builderFacingMessage: stage3.builderFacingMessage ?? "Stage 3 failed.",
        totalCostEstimateUsd: totalCost,
      })
    }
  } catch (err) {
    return Response.json(
      {
        passed: false,
        stages,
        finalVerdict: "FAILED",
        builderFacingMessage:
          "We hit a service issue while running the shortcut probe. Please try Add to library again in a moment.",
        error: err instanceof Error ? err.message : String(err),
        totalCostEstimateUsd: totalCost,
      },
      { status: 502 }
    )
  }

  // ---------- Stage 4: Sonnet Shortcut Adversary ----------
  try {
    const { parsed, cost } = await callModelWithRetry(
      SONNET_SHORTCUT_ADVERSARY_MODEL,
      buildSonnetShortcutAdversaryPrompt(input),
      1400
    )
    totalCost += cost
    const verdict = parsed as ShortcutAdversaryVerdict
    const passed = shortcutPassed(verdict)
    const stage4: StageResult = {
      stage: 4,
      stageName: "Sonnet Shortcut Adversary",
      passed,
      shortcutVerdict: verdict,
      builderFacingMessage: passed
        ? undefined
        : shortcutBuilderMessage(verdict, "Adversary 2 (creative)"),
      costEstimateUsd: cost,
    }
    stages.push(stage4)
    if (!passed) {
      return Response.json({
        passed: false,
        stages,
        finalVerdict: "FAILED",
        builderFacingMessage: stage4.builderFacingMessage ?? "Stage 4 failed.",
        totalCostEstimateUsd: totalCost,
      })
    }
  } catch (err) {
    return Response.json(
      {
        passed: false,
        stages,
        finalVerdict: "FAILED",
        builderFacingMessage:
          "We hit a service issue while running the deep shortcut probe. Please try Add to library again in a moment.",
        error: err instanceof Error ? err.message : String(err),
        totalCostEstimateUsd: totalCost,
      },
      { status: 502 }
    )
  }

  return Response.json({
    passed: true,
    stages,
    finalVerdict: "PASSED",
    builderFacingMessage:
      "All four reviewers passed your game. Sending it to your guide for final approval.",
    totalCostEstimateUsd: totalCost,
  })
}
