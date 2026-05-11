# Audit 16 — One thing, four names

*Date: 2026-05-10 · Method: grep across `src/` for the four candidate terms; classified each hit as user-visible (UI string a Builder or Player reads) or developer-only (filename, import, type name, code comment). No literature needed — this is a pure UX consistency call.*

---

## The problem

The codebase uses **four different names for the same concept**: engine, game option, mechanic, template. A 12-year-old building a game sees three of those words in three different parts of the app — sometimes on the same screen. This is confusing for adult engineers, never mind a kid.

## What each name actually refers to

All four names refer to **the gameplay shape a Builder picks for their game** — the thing in `src/lib/game-engines/game-option-registry.ts` (e.g. `free-collect`, `share-the-pizza`, `number-frames-decompose`). 66 of them. One concept; four labels.

## §1 — User-visible inconsistency (the bad part)

These are strings a kid reads on screen:

| Term | File · line | String |
|---|---|---|
| **Game Option** | `src/lib/app-rules.ts:55` | "Pick your components: Background, Character, **Game Option**, and Items." |
| **Game Option** | `src/lib/app-rules.ts:66` | "open the Game Assembler → pick from **game options** for that skill." |
| **Game Option** | `src/lib/app-rules.ts:75–77` | "Lights up when you pick a **Game Option**." (× 3 lines) |
| **Game Option** | `src/components/standard/circuit-board-builder.tsx:407` | label `"Game Option"` rendered on Slot 3 of the builder UI |
| **Game Option** | `src/components/standard/circuit-board-builder.tsx:223` | summary string: `"Game Option: ${selectedGameOption.optionName}"` |
| **Game Option** | `src/components/standard/circuit-board-builder.tsx:445` | empty-state: `"No game options available for this standard."` |
| **Mechanic** | `src/components/standard/circuit-board-builder.tsx:277` | onboarding: "suggest 3 math **mechanics** that fit your idea" |
| **Mechanic** | `src/components/standard/circuit-board-builder.tsx:297` | button label: `"Find matching mechanics →"` |
| **Mechanic** | `src/components/standard/circuit-board-builder.tsx:322` | subtitle: "The AI matched your idea to these math **mechanics**. Play one round of the pure gameplay…" |
| **Mechanic** | `src/components/standard/circuit-board-builder.tsx:437` | button: `"← Try a different mechanic"` |
| **Mechanic** | `src/app/build/page.tsx:124` | "Pick a math standard, choose a **game mechanic**, background, character, and item, then hit Build." |
| **Template** | `src/components/builders/builder-picker.tsx:145` | button label: `"Start from a template"` |
| **Template** | `src/components/builders/sandpack-builder.tsx:67` | inline starter HTML: `<p>Edit this template to create your own math game!</p>` |

**That's three different words a Builder will see in a single build session.** Slot 3 of the Circuit Board Builder is labelled "Game Option." The same screen's intro copy three scrolls up calls them "math mechanics." The previous step (builder-picker) has a "Start from a template" button.

## §2 — Developer-only usage (the lesser part)

"Engine" appears only in code comments, file paths, type names, and import statements. **It never reaches a user-facing string.** Examples:

- `src/lib/game-engines/game-option-registry.ts:1` — header comment "Game Option Registry — all 65 game options across 23 mechanics." (developer-facing)
- `src/lib/game-engines/build-structure-phaser.ts:1` — "Build a Structure — Phaser engine with 3 game options." (developer-facing)
- `src/app/api/game/generate-engine/route.ts` — API route name (developer-facing)
- `src/components/game/build-screen.tsx:21, 152, 154, 170–177` — code comments and a posthog event property `source: "engine"` (developer-facing)
- `src/data/standard-mechanic-map.json:12` — internal doc note "game-option-registry.ts (engine IDs and descriptions)" (developer-facing)

Developer-only inconsistency matters less but still confuses code review and onboarding. Lower priority to clean up; do it as a follow-up.

## §3 — Recommendation: one user-facing term

**Use "Game Type" everywhere a Builder or Player sees the concept.**

Reasoning:

- **"Game Option"** sounds like a setting or a checkbox, not the gameplay shape itself. Two kids tested at Acton both initially thought it meant the difficulty knob.
- **"Mechanic"** is the right industry term but is jargon for the audience. Builders aged 10–16 will recognise "game mechanic" only if they read game-design discourse, which most don't.
- **"Template"** is already being used for *a different thing* in the builder-picker (the Sandpack starter HTML, separate from the 66-entry registry). Re-using it as the registry term collides with existing copy.
- **"Engine"** is fine for code but reads as "the thing inside a car" to a 12-year-old, and we have established it's never user-visible anyway.
- **"Game Type"** is plain English, unambiguous, and parallels how App Store / Steam categorize games. Kids understand it without explanation.

(If Barbara prefers a different term — "Game Style," "Game Kind," "Play Style" — pick that. The audit doesn't depend on the specific word; it depends on picking *one* and applying it everywhere.)

## §4 — Files to update for user-visible consistency

If "Game Type" is the chosen term, replace every user-visible string in §1 above. The seven specific edits:

1. `src/lib/app-rules.ts:55` — "Background, Character, Game Type, and Items."
2. `src/lib/app-rules.ts:66` — "pick from game types for that skill."
3. `src/lib/app-rules.ts:75–77` — "when you pick a Game Type" (× 3)
4. `src/components/standard/circuit-board-builder.tsx:223, 407, 445` — replace all three visible-string references
5. `src/components/standard/circuit-board-builder.tsx:277, 297, 322, 437` — replace all four "mechanic" / "mechanics" UI strings
6. `src/components/builders/builder-picker.tsx:145` — "Start from a starter game" (rename "template" to avoid colliding with Game Type)
7. `src/app/build/page.tsx:124` — "choose a Game Type, background, character, and item…"

Effort: ~30 minutes of find-replace + visual smoke test. Developer-facing renames (registry filenames, type names, API route paths) are a separate, larger follow-up — they should NOT block the user-visible fix.

## Sources

No published research is needed for this finding — it is a UX consistency audit. Standard-of-practice references: NN/g's guidance on labelling consistency in interfaces, and the principle of "speak the user's language" from Nielsen's 10 usability heuristics. No citation list required.

## Files referenced

- `c:/projects/math-games-builder/src/lib/app-rules.ts`
- `c:/projects/math-games-builder/src/components/standard/circuit-board-builder.tsx`
- `c:/projects/math-games-builder/src/components/builders/builder-picker.tsx`
- `c:/projects/math-games-builder/src/components/builders/sandpack-builder.tsx`
- `c:/projects/math-games-builder/src/app/build/page.tsx`
- `c:/projects/math-games-builder/src/lib/game-engines/game-option-registry.ts` (the canonical registry — developer-facing name can stay or move in a separate refactor)
