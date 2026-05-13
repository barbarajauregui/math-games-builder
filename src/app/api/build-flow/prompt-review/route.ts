/**
 * Level 2 Gate A — prompt review (Haiku, ~$0.002/call).
 *
 * Spec: docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md §7, §13
 * (Task 10 of §16's build order).
 *
 * The Builder composes a vibe-coding prompt scaffold + their own description
 * on the Level 2 scaffold screen. BEFORE they take it to an external AI, this
 * endpoint runs a cheap Haiku gatekeeper that returns either:
 *
 *   { decision: "pass", bullets: [] }
 *
 * or
 *
 *   { decision: "block", bullets: [{ whatsWrong, howToFix } x ≤3] }
 *
 * Decision criteria (simplified from the Critic's 6 criteria — §7):
 *   1. Does the player's winning action exercise the math?
 *      (intrinsic integration — Habgood & Ainsworth 2011)
 *   2. Does the description avoid the system doing the math?
 *   3. Is the win-condition tied to a correct math action, not time / clicks
 *      / luck?
 *
 * Why this gate exists: Hicks et al. 2016 (ED592703) — kids authoring content
 * for educational games often produce content that doesn't afford the core
 * mechanic. We catch that here before an external AI burns tokens generating
 * broken HTML.
 *
 * On any error (Anthropic failure, JSON parse failure on retry), we BLOCK
 * with a "could not check your prompt" fallback so the Builder doesn't
 * silently bypass the gate.
 */

import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import type { PromptReviewResult, ReviewBullet } from "@/lib/build-flow/types"
import { trackServer } from "@/lib/telemetry/posthog-server"

export const maxDuration = 30

const HAIKU_MODEL = "claude-haiku-4-5-20251001"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const FALLBACK_BLOCK: PromptReviewResult = {
  decision: "block",
  bullets: [
    {
      whatsWrong: "Could not check your prompt — try again.",
      howToFix: "If this keeps happening, ask Barbara.",
    },
  ],
}

function buildSystemPrompt(): string {
  return [
    "You are the Prompt Reviewer for Math Games Builder. You are a gatekeeper.",
    "A Builder (older kid, grades 5–10) is about to take a vibe-coding prompt to an external AI",
    "(ChatGPT / Claude / Gemini) which will generate an HTML math game for younger kids to play.",
    "",
    "Your job: BLOCK bad prompts before they burn tokens generating broken games.",
    "",
    "Judge the prompt on three criteria:",
    "1. Does the player's WINNING ACTION exercise the math?",
    "   (intrinsic integration — Habgood & Ainsworth 2011). The math must be the gameplay,",
    "   not decoration around an unrelated game loop.",
    "2. Does the description avoid the SYSTEM doing the math?",
    "   The PLAYER must perform every count, every add, every subtract — never the computer.",
    "   Phrases like 'the game counts for you', 'shows the running total', 'auto-sums' are red flags.",
    "3. Is the WIN-CONDITION tied to a correct math action, not time / clicks / luck?",
    "   Winning by running out the clock, by tapping fast, by guessing, or by random chance is a block.",
    "",
    "Background context: Hicks et al. 2016 (ED592703) found that kids authoring educational",
    "content often quietly break the core mechanic — the math 'disappears' under their theme.",
    "Be skeptical when the description is mostly theme with no clear math action.",
    "",
    "Output STRICT JSON ONLY, no prose, no code fences, matching exactly this shape:",
    '  { "decision": "pass" | "block", "bullets": [{ "whatsWrong": string, "howToFix": string }] }',
    "",
    "Rules for the JSON:",
    '- On pass: bullets MUST be an empty array [].',
    "- On block: include 1 to 3 bullets. Each bullet has TWO fields:",
    "  - whatsWrong: ≤12 words, plain English, name the actual problem.",
    "  - howToFix: ≤12 words, plain English, concrete suggestion the Builder can apply.",
    "- Pick the most important problems only. Do not pad to 3 bullets.",
    "- Write for a 12-year-old. No jargon, no researcher names, no Greek letters.",
    '- Format each bullet as "what\'s wrong → how to fix" (the UI will render the arrow).',
    "",
    "Examples of good block bullets:",
    '  { "whatsWrong": "System counts the items for the player", "howToFix": "Make the player tap each item one by one" }',
    '  { "whatsWrong": "Win is timer-based, not math-based", "howToFix": "Win when the player\'s count matches the target" }',
    '  { "whatsWrong": "Description is all theme, no math action", "howToFix": "Say what the player does with numbers each turn" }',
    "",
    "If the prompt is borderline-fine but workable, PASS. Only block when there is a real,",
    "specific pedagogical problem the Builder can fix.",
  ].join("\n")
}

function buildUserMessage(args: {
  standardId: string
  mechanicId: string
  builderDescription: string
  composedPrompt: string
}): string {
  return [
    `Standard: ${args.standardId}`,
    `Game Mechanic: ${args.mechanicId}`,
    "",
    "Builder's own description of the game they want:",
    args.builderDescription.trim() || "(empty)",
    "",
    "Full composed prompt the Builder is about to take to an external AI:",
    "---",
    args.composedPrompt,
    "---",
    "",
    "Return your verdict as JSON now.",
  ].join("\n")
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

function coerceBullet(raw: unknown): ReviewBullet | null {
  if (!raw || typeof raw !== "object") return null
  const r = raw as Record<string, unknown>
  const whatsWrong = typeof r.whatsWrong === "string" ? r.whatsWrong.trim() : ""
  const howToFix = typeof r.howToFix === "string" ? r.howToFix.trim() : ""
  if (!whatsWrong || !howToFix) return null
  return { whatsWrong, howToFix }
}

function coerceResult(raw: unknown): PromptReviewResult | null {
  if (!raw || typeof raw !== "object") return null
  const r = raw as Record<string, unknown>
  const decision = r.decision
  if (decision !== "pass" && decision !== "block") return null
  const bulletsRaw = Array.isArray(r.bullets) ? r.bullets : []
  const bullets = bulletsRaw
    .map(coerceBullet)
    .filter((b): b is ReviewBullet => b !== null)
    .slice(0, 3)
  if (decision === "block" && bullets.length === 0) {
    // Block with no bullets is unusable — treat as parse failure so the caller
    // retries / falls back.
    return null
  }
  return { decision, bullets: decision === "pass" ? [] : bullets }
}

async function callHaiku(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 500,
    temperature: 0,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  })
  const block = message.content[0]
  return block && block.type === "text" ? block.text : ""
}

async function runReviewWithRetry(
  systemPrompt: string,
  userMessage: string
): Promise<PromptReviewResult | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const text = await callHaiku(systemPrompt, userMessage)
      const cleaned = stripCodeFences(text)
      const parsed = JSON.parse(cleaned)
      const coerced = coerceResult(parsed)
      if (coerced) return coerced
      // JSON parsed but didn't match shape — loop to retry once.
    } catch {
      // JSON parse failure or empty response — loop to retry once.
    }
  }
  return null
}

interface RequestBody {
  standardId?: unknown
  mechanicId?: unknown
  builderDescription?: unknown
  composedPrompt?: unknown
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now()

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
  const builderDescription =
    typeof body.builderDescription === "string" ? body.builderDescription : ""
  const composedPrompt =
    typeof body.composedPrompt === "string" ? body.composedPrompt : ""

  if (!standardId) {
    return Response.json({ error: "Missing standardId." }, { status: 400 })
  }
  if (!mechanicId) {
    return Response.json({ error: "Missing mechanicId." }, { status: 400 })
  }
  if (!composedPrompt || composedPrompt.length < 50) {
    return Response.json(
      { error: "composedPrompt is too short or missing." },
      { status: 400 }
    )
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[prompt-review] ANTHROPIC_API_KEY is not set")
    const latencyMs = Date.now() - startedAt
    trackServer(`standard_${standardId}`, {
      event: "level_2.prompt_review_run",
      properties: {
        standardId,
        mechanicId,
        decision: FALLBACK_BLOCK.decision,
        latencyMs,
        descriptionLength: builderDescription.length,
      },
    })
    return Response.json(FALLBACK_BLOCK, { status: 500 })
  }

  const systemPrompt = buildSystemPrompt()
  const userMessage = buildUserMessage({
    standardId,
    mechanicId,
    builderDescription,
    composedPrompt,
  })

  let result: PromptReviewResult | null = null
  try {
    result = await runReviewWithRetry(systemPrompt, userMessage)
  } catch (err) {
    console.error("[prompt-review] Anthropic call failed:", err)
    const latencyMs = Date.now() - startedAt
    trackServer(`standard_${standardId}`, {
      event: "level_2.prompt_review_run",
      properties: {
        standardId,
        mechanicId,
        decision: FALLBACK_BLOCK.decision,
        latencyMs,
        descriptionLength: builderDescription.length,
      },
    })
    return Response.json(FALLBACK_BLOCK, { status: 500 })
  }

  if (!result) {
    const latencyMs = Date.now() - startedAt
    trackServer(`standard_${standardId}`, {
      event: "level_2.prompt_review_run",
      properties: {
        standardId,
        mechanicId,
        decision: FALLBACK_BLOCK.decision,
        latencyMs,
        descriptionLength: builderDescription.length,
      },
    })
    return Response.json(FALLBACK_BLOCK, { status: 500 })
  }

  const latencyMs = Date.now() - startedAt
  trackServer(`standard_${standardId}`, {
    event: "level_2.prompt_review_run",
    properties: {
      standardId,
      mechanicId,
      decision: result.decision,
      latencyMs,
      descriptionLength: builderDescription.length,
    },
  })

  return Response.json(result)
}
