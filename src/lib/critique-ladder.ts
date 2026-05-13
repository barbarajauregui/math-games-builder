/**
 * Runtime Critique Ladder — shared 4-stage pipeline.
 *
 * Extracted from `src/app/api/game/critique/route.ts` so both that endpoint
 * and the new `/api/build-flow/html-review` endpoint (spec v3 §9, Task 12)
 * can run the ladder without duplicating Anthropic calls.
 *
 * Stage order (cheap-cheap-deep-deep — Barbara 2026-05-11):
 *   1. Haiku Critic              ~$0.001
 *   2. Haiku Shortcut Adversary  ~$0.005
 *   3. Sonnet Critic             ~$0.025
 *   4. Sonnet Shortcut Adversary ~$0.075
 *
 * A stage's FAIL halts the ladder. Caller decides what to do with the
 * structured `stages[]` output.
 */

import Anthropic from "@anthropic-ai/sdk"
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

let _anthropic: Anthropic | null = null
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  }
  return _anthropic
}

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const isHaiku =
    model === HAIKU_CRITIC_MODEL || model === HAIKU_SHORTCUT_ADVERSARY_MODEL
  const inputPerM = isHaiku ? 1.0 : 3.0
  const outputPerM = isHaiku ? 5.0 : 15.0
  return (inputTokens * inputPerM) / 1_000_000 + (outputTokens * outputPerM) / 1_000_000
}

function stripCodeFences(text: string): string {
  let cleaned = text.trim()
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim()
  }
  return cleaned
}

interface RawMessageResult {
  text: string
  inputTokens: number
  outputTokens: number
}

async function callModel(
  model: string,
  prompt: string,
  maxTokens: number
): Promise<RawMessageResult> {
  const message = await getAnthropic().messages.create({
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

export function criticPassed(v: CriticVerdict): boolean {
  return (
    v.c1RealWorldScenario.pass &&
    v.c2MathIsGameplay.pass &&
    v.c3MustKnowMathToWin.pass &&
    v.c4ConstructValidity.pass &&
    v.overallVerdict === "APPROVED"
  )
}

export function criticBuilderMessage(v: CriticVerdict, stageName: string): string {
  const failed: string[] = []
  if (!v.c1RealWorldScenario.pass)
    failed.push(`Real-world scenario: ${v.c1RealWorldScenario.reason}`)
  if (!v.c2MathIsGameplay.pass)
    failed.push(`Math IS the gameplay: ${v.c2MathIsGameplay.reason}`)
  if (!v.c3MustKnowMathToWin.pass)
    failed.push(`Cannot win without the math: ${v.c3MustKnowMathToWin.reason}`)
  if (!v.c4ConstructValidity.pass)
    failed.push(`Measures the right skill: ${v.c4ConstructValidity.reason}`)
  const suggestions = v.revisionSuggestions?.length
    ? `\n\nWhat to try:\n- ${v.revisionSuggestions.join("\n- ")}`
    : ""
  if (failed.length === 0) {
    return `${stageName} flagged ${v.overallVerdict}.${suggestions}`
  }
  return `${stageName} found problems:\n- ${failed.join("\n- ")}${suggestions}`
}

export function shortcutPassed(v: ShortcutAdversaryVerdict): boolean {
  return v.verdict === "SHORTCUT-FREE"
}

export function shortcutBuilderMessage(
  v: ShortcutAdversaryVerdict,
  stageName: string
): string {
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

export interface CritiqueLadderResult {
  /** All stages that ran. Halts at first failure, so length may be < 4. */
  stages: StageResult[]
  /** True iff all 4 stages passed. */
  passed: boolean
  totalCostEstimateUsd: number
  /** If the ladder halted on a service error (Anthropic outage / JSON parse fail
   *  on retry), the error is here and `passed === false`. */
  serviceError?: string
}

/**
 * Run the full 4-stage critique ladder. Halts at the first stage that fails.
 * Throws nothing — service errors are returned as `serviceError`.
 */
export async function runCritiqueLadder(
  input: AgentLadderInput
): Promise<CritiqueLadderResult> {
  const stages: StageResult[] = []
  let totalCost = 0

  // ----- Stage 1: Haiku Critic -----
  try {
    const { parsed, cost } = await callModelWithRetry(
      HAIKU_CRITIC_MODEL,
      buildHaikuCriticPrompt(input),
      900
    )
    totalCost += cost
    const verdict = parsed as CriticVerdict
    const passed = criticPassed(verdict)
    stages.push({
      stage: 1,
      stageName: "Haiku Critic",
      passed,
      criticVerdict: verdict,
      builderFacingMessage: passed
        ? undefined
        : criticBuilderMessage(verdict, "Critic 1 (quick)"),
      costEstimateUsd: cost,
    })
    if (!passed) return { stages, passed: false, totalCostEstimateUsd: totalCost }
  } catch (err) {
    return {
      stages,
      passed: false,
      totalCostEstimateUsd: totalCost,
      serviceError: err instanceof Error ? err.message : String(err),
    }
  }

  // ----- Stage 2: Haiku Shortcut Adversary -----
  try {
    const { parsed, cost } = await callModelWithRetry(
      HAIKU_SHORTCUT_ADVERSARY_MODEL,
      buildHaikuShortcutAdversaryPrompt(input),
      900
    )
    totalCost += cost
    const verdict = parsed as ShortcutAdversaryVerdict
    const passed = shortcutPassed(verdict)
    stages.push({
      stage: 2,
      stageName: "Haiku Shortcut Adversary",
      passed,
      shortcutVerdict: verdict,
      builderFacingMessage: passed
        ? undefined
        : shortcutBuilderMessage(verdict, "Adversary — quick"),
      costEstimateUsd: cost,
    })
    if (!passed) return { stages, passed: false, totalCostEstimateUsd: totalCost }
  } catch (err) {
    return {
      stages,
      passed: false,
      totalCostEstimateUsd: totalCost,
      serviceError: err instanceof Error ? err.message : String(err),
    }
  }

  // ----- Stage 3: Sonnet Critic -----
  try {
    const { parsed, cost } = await callModelWithRetry(
      SONNET_CRITIC_MODEL,
      buildSonnetCriticPrompt(input),
      1400
    )
    totalCost += cost
    const verdict = parsed as CriticVerdict
    const passed = criticPassed(verdict)
    stages.push({
      stage: 3,
      stageName: "Sonnet Critic",
      passed,
      criticVerdict: verdict,
      builderFacingMessage: passed
        ? undefined
        : criticBuilderMessage(verdict, "Critic — deep"),
      costEstimateUsd: cost,
    })
    if (!passed) return { stages, passed: false, totalCostEstimateUsd: totalCost }
  } catch (err) {
    return {
      stages,
      passed: false,
      totalCostEstimateUsd: totalCost,
      serviceError: err instanceof Error ? err.message : String(err),
    }
  }

  // ----- Stage 4: Sonnet Shortcut Adversary -----
  try {
    const { parsed, cost } = await callModelWithRetry(
      SONNET_SHORTCUT_ADVERSARY_MODEL,
      buildSonnetShortcutAdversaryPrompt(input),
      1400
    )
    totalCost += cost
    const verdict = parsed as ShortcutAdversaryVerdict
    const passed = shortcutPassed(verdict)
    stages.push({
      stage: 4,
      stageName: "Sonnet Shortcut Adversary",
      passed,
      shortcutVerdict: verdict,
      builderFacingMessage: passed
        ? undefined
        : shortcutBuilderMessage(verdict, "Adversary — deep"),
      costEstimateUsd: cost,
    })
    if (!passed) return { stages, passed: false, totalCostEstimateUsd: totalCost }
  } catch (err) {
    return {
      stages,
      passed: false,
      totalCostEstimateUsd: totalCost,
      serviceError: err instanceof Error ? err.message : String(err),
    }
  }

  return { stages, passed: true, totalCostEstimateUsd: totalCost }
}
