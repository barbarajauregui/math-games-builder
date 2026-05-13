/**
 * Level 2 prompt scaffold composer — pure-data, client-safe.
 *
 * Per spec v3 §6 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`).
 *
 * The scaffold is a plain-text prompt the Builder copies into an external AI
 * (ChatGPT, Claude, Gemini) to generate the HTML for their game. It is composed
 * from four blocks:
 *
 *   1. Mechanic block — boilerplate per Game Mechanic.
 *   2. Standard block — derived from `loadStandardKnowledge(standardId)`
 *      (server-side) and passed in as `StandardBlockInput`. Includes common kid
 *      misconceptions to design AROUND (not test for) when the standard has a
 *      Mr. Chesure knowledge file; omitted on fallback.
 *   3. Required postMessage block — fixed text that tells the AI exactly how
 *      the game must signal a win. Gate B (§8) and Gate C (§9) depend on this.
 *   4. Builder description block — the Builder's own words, verbatim.
 *
 * Blocks are joined with two newlines; trailing whitespace is trimmed.
 *
 * This module is intentionally pure data + no node:fs imports so it can run in
 * the browser (the Level 2 client component composes the preview live). The
 * server-side variant that reads the knowledge file lives in
 * `prompt-composer.server.ts`.
 */

import type { MechanicId } from "@/data/scenarios/types"

export interface ComposePromptInput {
  mechanicId: MechanicId
  builderDescription: string
  standardBlock: StandardBlockInput
}

export interface StandardBlockInput {
  plainEnglish: string
  standardText: string
  hasFullKnowledge: boolean
  misconceptions: string[]
}

/**
 * Mechanic block boilerplate. Text is verbatim from spec v3 §6 and from the
 * Task 9 brief. When new mechanics are added, extend this map.
 */
const MECHANIC_BLOCK: Record<MechanicId, string> = {
  "counting-collection":
    "Build a single-page HTML game where the player must tap or drag each item one-by-one to count it. The total appears only when every item has been tapped. The math is the counting — do not show running totals automatically.",
  "group-then-combine":
    "Build a single-page HTML game where the player makes two separate groups of items, then combines them and counts the total. Each item in each group must be tapped or placed by the player. The math is the combining — do not auto-sum the groups.",
  "take-from":
    "Build a single-page HTML game where the player starts with a group of items, removes some, and counts what's left. Each removal must be a tap or drag. The math is the subtraction — do not show the remaining count until the player has tapped every remaining item.",
}

/**
 * Required postMessage block — fixed text the AI MUST honor so the
 * Builder-must-win gate (§8) and the HTML review (§9) can verify the game has
 * a real winning state triggered by a math action.
 */
const POSTMESSAGE_BLOCK = [
  'When the player wins, the page MUST call: window.parent.postMessage({type: "game_win"}, "*").',
  "No auto-win. No timer-win. The win must come from a correct math action.",
  "The game must include a clear winning state that the player triggers themselves.",
].join(" ")

export function composeStandardBlock(args: StandardBlockInput): string {
  const learningLine = args.plainEnglish.trim()
    ? args.plainEnglish.trim()
    : args.standardText.trim()

  const lines: string[] = []
  lines.push(`The math the player learns: ${learningLine}`)
  lines.push(
    "The game must require the player to perform the operation themselves — never the system."
  )
  // Range hint: pull "within N" from the learning line if present so the AI
  // doesn't go off and generate within-100 games for a K standard.
  const rangeMatch = learningLine.match(/within\s+\d+/i)
  if (rangeMatch) {
    lines.push(`Range: ${rangeMatch[0].toLowerCase()}.`)
  }

  // Misconceptions only when we have full knowledge (per task spec — fallback
  // skeleton omits this section).
  if (args.hasFullKnowledge && args.misconceptions.length > 0) {
    lines.push(
      "Watch for these common kid misconceptions and design AROUND (not test for) them:"
    )
    for (const m of args.misconceptions.slice(0, 3)) {
      lines.push(`- ${m}`)
    }
  }

  return lines.join("\n")
}

/**
 * Compose the full Level 2 prompt scaffold from already-loaded inputs. Pure
 * data — safe to call on the client.
 */
export function composePromptFromBlocks(input: ComposePromptInput): string {
  const block1 = MECHANIC_BLOCK[input.mechanicId]
  const block2 = composeStandardBlock(input.standardBlock)
  const block3 = POSTMESSAGE_BLOCK
  const block4 = `The Builder's game description: ${input.builderDescription.trim()}`
  return [block1, block2, block3, block4].join("\n\n").replace(/\s+$/g, "")
}
