/**
 * Runtime agent ladder — the 4-stage Haiku→Sonnet→Haiku→Sonnet pipeline that
 * runs on every game submission before save.
 *
 * Spec: docs/superpowers/specs/2026-05-10-library-design.md §13.
 *
 * Stage 1: Haiku Critic — cheap filter, 4 criteria. ~$0.001 per check.
 * Stage 2: Sonnet Critic — deep inspection, same 4 criteria. ~$0.025.
 * Stage 3: Haiku Shortcut Adversary — obvious shortcuts. ~$0.005.
 * Stage 4: Sonnet Shortcut Adversary — creative shortcuts. ~$0.075.
 *
 * Each stage either passes (proceed) or fails (Builder sees specific
 * reasons; revises). A FAIL halts the ladder.
 *
 * Mr. Chesure and Mechanic Inventor are NOT in the ladder — they remain
 * informational agents (Mr. Chesure runs at standard-pick to produce the
 * design brief; Mechanic Inventor is on-demand consult).
 */

export type {
  AgentLadderInput,
  CriticVerdict,
  ShortcutAdversaryVerdict,
  StageResult,
} from './types'

export {
  HAIKU_CRITIC_MODEL,
  buildHaikuCriticPrompt,
} from './haiku-critic'

export {
  SONNET_CRITIC_MODEL,
  buildSonnetCriticPrompt,
} from './sonnet-critic'

export {
  HAIKU_SHORTCUT_ADVERSARY_MODEL,
  buildHaikuShortcutAdversaryPrompt,
} from './haiku-shortcut-adversary'

export {
  SONNET_SHORTCUT_ADVERSARY_MODEL,
  buildSonnetShortcutAdversaryPrompt,
} from './sonnet-shortcut-adversary'

export {
  buildGenerateGamePrompt,
} from './generate-game'
export type { BuildGenerateGamePromptInput } from './generate-game'
