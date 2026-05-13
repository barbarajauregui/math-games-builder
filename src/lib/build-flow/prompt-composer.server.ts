/**
 * Server-only wrapper around the pure prompt composer.
 *
 * `loadStandardKnowledge` uses `node:fs` and cannot ship to the client. This
 * file pairs that with the pure `composePromptFromBlocks` so server callers
 * (API routes, server components) can compose a full prompt with one call.
 *
 * Spec v3 §6 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`).
 */

import "server-only"

import { loadStandardKnowledge } from "@/lib/standard-knowledge"
import {
  composePromptFromBlocks,
  type StandardBlockInput,
} from "@/lib/build-flow/prompt-composer"
import type { MechanicId } from "@/data/scenarios/types"

export interface ComposePromptServerInput {
  standardId: string
  mechanicId: MechanicId
  builderDescription: string
}

/** Load the standard's knowledge from disk + compose the full Level 2 prompt. */
export async function composePrompt(
  input: ComposePromptServerInput
): Promise<string> {
  const knowledge = await loadStandardKnowledge(input.standardId)
  const standardBlock: StandardBlockInput = {
    plainEnglish: knowledge.plainEnglish,
    standardText: knowledge.standardText,
    hasFullKnowledge: knowledge.hasFullKnowledge,
    misconceptions: knowledge.misconceptions,
  }
  return composePromptFromBlocks({
    mechanicId: input.mechanicId,
    builderDescription: input.builderDescription,
    standardBlock,
  })
}
