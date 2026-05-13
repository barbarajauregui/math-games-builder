/**
 * Types for scenario data files (one per standard initially; K.OA.A.1 first).
 *
 * Per spec v3 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md` §13):
 * Level 1 of the build flow is Game Mechanic + Scenario picker. The Builder
 * picks a Game Mechanic and a Scenario together, then plays a pre-made game.
 * The old v2 mad-lib types (StoryTemplate, BlankKind, NumberBlank,
 * DropdownBlank, StoryBlank, Operation) are gone.
 */

/**
 * Game Mechanic identifiers used by K.OA.A.1's PRIMARY mechanics
 * (see `src/data/standard-mechanic-map.json` for the full standard ↔ mechanic
 * map). Per spec §11 the variable name stays `mechanicId`; user-facing copy
 * says "Game Mechanic".
 *
 * Additional mechanics will be added as more standards ship. Keep this union
 * conservative — only list the mechanic ids that have at least one Scenario
 * authored.
 */
export type MechanicId =
  | "counting-collection"
  | "group-then-combine"
  | "take-from"

export interface Scenario {
  id: string
  mechanicId: MechanicId
  title: string
  /**
   * One short sentence shown on the picker card. K-friendly language.
   * Example: "Drop coins into the jar."
   */
  oneLineDescription: string
  /**
   * Path to the pre-made Level 1 game HTML, relative to /public.
   * The actual game assets are a separate workstream (spec §16, Task 14) —
   * these URLs may 404 until those games ship.
   */
  preMadeGameUrl: string
  /**
   * Plain-words lesson copy (≤ 80 words) shown at the bottom of the Level 1
   * play screen while the Builder plays the game. Authored from the K.OA
   * progressions doc (`docs/agents/agents/chesure-knowledge/k-oa-progressions.md`).
   */
  lessonText: string
}

export interface Mechanic {
  id: MechanicId
  title: string
  /**
   * One short sentence shown in the picker row header. K-friendly.
   * Example: "Tap or drag each item to count it."
   */
  oneLineDescription: string
}
