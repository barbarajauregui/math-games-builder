import type { Mechanic } from "@/data/scenarios/types"

/**
 * NOTE (2026-05-12, Barbara's decision): the pedagogical-mechanic IDs here
 * (`counting-collection`, `group-then-combine`, `take-from`) describe what the
 * Builder does at Level 1. They do NOT 1:1 match the Phaser engine IDs in
 * `src/data/standard-mechanic-map.json` (`number-frames`, `free-collect`,
 * `cuisenaire-rods`) — the relationship is many-to-many and only becomes
 * load-bearing at Level 2 (prompt scaffold), when we'll formalize a
 * `pedagogicalMechanics: string[]` field per engine entry. Deferred until then.
 */

/**
 * K.OA.A.1 PRIMARY Game Mechanics for the Level 1 picker.
 *
 * Per spec v3 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md` §3):
 * the picker shows one row per PRIMARY mechanic. Bar Model is SECONDARY for
 * K.OA.A.1 (de Koning et al. 2022) and does not appear at Level 1.
 *
 * `standard-mechanic-map.json` lists these as `number-frames`, `free-collect`,
 * `cuisenaire-rods` (the engine library names). The mechanic names exposed to
 * Builders are different — the spec §3 names three pedagogical mechanics
 * (Counting Collection, Group-Then-Combine, Take-From) that the pre-made
 * games will use. Audit follow-up: reconcile the engine-library mapping with
 * the spec §3 mechanic names. For now the picker uses the spec §3 names.
 */
export const K_OA_A_1_MECHANICS: Mechanic[] = [
  {
    id: "counting-collection",
    title: "Counting Collection",
    oneLineDescription: "Tap or drag each item to count it.",
  },
  {
    id: "group-then-combine",
    title: "Group-Then-Combine",
    oneLineDescription: "Make two groups, then count them together.",
  },
  {
    id: "take-from",
    title: "Take-From",
    oneLineDescription: "Start with a group, remove some, count what's left.",
  },
]
