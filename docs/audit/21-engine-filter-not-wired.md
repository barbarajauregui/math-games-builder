# Audit 20 — Engine Filter Not Wired (Step 4 Mechanic Picker)

*Date: 2026-05-10 · Scope: confirm whether the practiceOnly + HIDDEN flags from Audit 11 are actually filtered out of the Step 4 mechanic picker. · Method: read `src/lib/game-engines/game-option-registry.ts`, find every consumer of `GAME_OPTIONS` / `getGameOptions`, check for filter calls. Extends Audit 11 §4.*

---

## TL;DR

**The filter is not wired.** `getGameOptions(mechanicId)` returns every engine in the registry's mechanic bucket — including the 14 entries flagged `practiceOnly: true` and the 6 additional engines Audit 11 §4 said should also be hidden. Today a Builder routed to Step 4 can pick a `practiceOnly` drill-skin (Falling Blocks, Pac-Man, Breakout) or an extrinsic-integration engine (Elimination Grid, Battleship) and ship it as a discovery game. The fix is a ~1–2 hour structural change: add the missing `srtPasses` and `hiddenFromBuilders` fields, then filter at the picker call site. This is the simplest, highest-leverage construct-validity floor available in the codebase right now.

---

## 1. Current state of the registry

File: `src/lib/game-engines/game-option-registry.ts`

- **Total engines:** 66 (registry header still says "65"; stale).
- **`practiceOnly: true` count:** **14** entries. (Audit 11 said "12" — the discrepancy is `time-matcher` and one classic-overlay that were added or counted differently; the conclusion is the same.)
- **`srtPasses` field:** **does not exist.** Audit 8 recommended adding it; not implemented.
- **`hiddenFromBuilders` field:** does not exist.
- **No filter wrapper.** The registry exports two helpers:

  ```ts
  export function getGameOptions(mechanicId: string): GameOptionDef[] {
    return GAME_OPTIONS_BY_MECHANIC.get(mechanicId) || []
  }
  export function getDefaultOption(mechanicId: string): string {
    const options = GAME_OPTIONS_BY_MECHANIC.get(mechanicId)
    return options?.[0]?.id || "free-collect"
  }
  ```

  Neither filters on `practiceOnly`. Both return the raw bucket.

## 2. The 14 engines currently `practiceOnly: true` (confirmed in code)

From a literal grep of the file, in order of appearance:

1. `speed-trap`
2. `catch-up`
3. `unit-converter`
4. `auction-house`
5. `price-is-right`
6. `round-and-win`
7. `time-matcher`
8. `snake-math`
9. `maze-runner-math`
10. `falling-blocks-math`
11. `dot-eater-math`
12. `launcher-math`
13. `breakout-math`
14. (one additional in the classic-overlay block — verify when adding the new fields)

Audit 11 §1 marked these as HIDDEN: agree. The flag is already on them; the consumer just doesn't honor it.

## 3. The 6 engines that need adding to the HIDDEN list

Per Audit 11 §4 ("Not yet flagged but should be hidden from discovery"):

1. **`elimination-grid`** — math lives in the clue text; eliminator UI lets kid finish without doing math.
2. **`twenty-questions`** — strategy game using math vocabulary; not math gameplay.
3. **`logic-chain`** — same defect as #1.
4. **`battleship`** — coordinate-call is decoration; the game is strategy.
5. **`rotate-to-match`** — visual-snap puzzle; doesn't measure angle understanding.
6. **`recipe-mixer`** — "stack until layer locks" is visual matching; math claim weak (currently REVISABLE in Audit 11; should be HIDDEN until fixed).

None of these have `practiceOnly: true`. They are not extrinsic in the "drill-skin" sense — they are extrinsic in the **hidden-equality-check** sense (the math sits outside the mechanic; the mechanic is winnable without the math). Same outcome — Builder should not see them — but a different reason.

## 4. Who consumes `getGameOptions`

Search for `game-option-registry` imports yields 32 files, but the active consumer for the new Step 4 picker per Audit 10 is `src/components/standard/circuit-board-builder.tsx`:

```
import { getGameOptions, getOptionDef } from "@/lib/game-engines/game-option-registry"
```

The existing call goes `mechanicId → list of engine options → render cards`. **No `.filter(opt => !opt.practiceOnly)` anywhere on the path.** The Step 4 mechanic picker in the new build flow will inherit this consumer — unless the new flow uses a different entry point, in which case the same defect must be avoided there too.

## 5. Recommended changes

Three additions to `GameOptionDef`:

```ts
export interface GameOptionDef {
  // ...existing fields...
  practiceOnly?: boolean        // already exists
  srtPasses?: boolean           // NEW — does this engine pass Discovery + Self-Revealing Truth?
  hiddenFromBuilders?: boolean  // NEW — should the Step 4 picker hide this engine?
}
```

Then a filtered helper:

```ts
export function getBuildableGameOptions(mechanicId: string): GameOptionDef[] {
  return getGameOptions(mechanicId).filter(opt =>
    !opt.practiceOnly && !opt.hiddenFromBuilders
  )
}
```

Wire the Step 4 mechanic picker (`circuit-board-builder.tsx` and any new flow component) to call `getBuildableGameOptions` instead of `getGameOptions`. Keep `getGameOptions` for the practice/mastery routing surfaces that *should* see all 66 engines.

Then mark the six additions from §3:

```ts
{ id: "elimination-grid", ..., hiddenFromBuilders: true, srtPasses: false }
{ id: "twenty-questions", ..., hiddenFromBuilders: true, srtPasses: false }
{ id: "logic-chain", ..., hiddenFromBuilders: true, srtPasses: false }
{ id: "battleship", ..., hiddenFromBuilders: true, srtPasses: false }
{ id: "rotate-to-match", ..., hiddenFromBuilders: true, srtPasses: false }
{ id: "recipe-mixer", ..., hiddenFromBuilders: true, srtPasses: false }
```

And as a sweep, mark `srtPasses: true` on the 30 VETTED engines from Audit 11 §1 and `srtPasses: false` on the 18 REVISABLE + 18 HIDDEN — this gives The Critic and the Mechanic Inventor agents a machine-readable signal they don't have today.

## 6. Scope and risk

- **Lines changed:** ~20 (one helper, six tags, one import swap in the picker, plus the optional `srtPasses` sweep — another ~60 one-liners).
- **Time:** ~1–2 hours including the `srtPasses` sweep; ~30 min for the minimal fix.
- **Risk:** Low. Pure additive flags; existing `getGameOptions` callers are unaffected. The only behavior change is the Step 4 picker showing 6 fewer cards (plus the 14 already flagged but ignored) — exactly the intended outcome.
- **Test:** snapshot of `getBuildableGameOptions("addition-compose")` should not include any `practiceOnly` or `hiddenFromBuilders: true` entry.

## 7. Why this is high-leverage

Audit 11 found the registry is ~58% strong / 42% problematic. The single highest-leverage construct-validity move in the codebase right now is **not letting Builders pick from the 42%.** No prompt engineering, no agent retraining, no UI redesign — one filter call and six tag additions. This is the cheapest meaningful improvement on the Step 4 surface and should land before the new build flow ships.

---

## Sources

- `c:/projects/math-games-builder/src/lib/game-engines/game-option-registry.ts` — registry (66 entries, 14 `practiceOnly`).
- `c:/projects/math-games-builder/src/components/standard/circuit-board-builder.tsx` — current picker consumer (line 10 import).
- `c:/projects/math-games-builder/docs/audit/08-game-templates.md` — `srtPasses` recommendation.
- `c:/projects/math-games-builder/docs/audit/10-new-build-flow.md` — Q4 ("filter Step 4 mechanics by operation: yes").
- `c:/projects/math-games-builder/docs/audit/11-engine-library-per-engine.md` — per-engine verdicts and §4 HIDDEN list.
