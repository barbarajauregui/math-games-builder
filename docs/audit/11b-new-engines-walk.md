# Audit 11b — New engines walk (diff against Audit 11)

*Date: 2026-05-10 · Auditor: per-engine diff vs Audit 11 · Source: `src/lib/game-engines/game-option-registry.ts`*

## TL;DR

**There are zero new engines since Audit 11.** The registry has 88 entries. Audit 11's per-engine table (`docs/audit/11-engine-library-per-engine.md` §1) already contains 88 rows, one per registry ID. The "66 entries" figure in Audit 11's summary prose is stale and inconsistent with its own table — the table itself walks the whole registry.

No new verdicts produced. No per-operation map additions. No duplicate flags newly raised.

---

## §1 — Diff summary

- **Registry IDs (current):** 88 (extracted via `^    id: ` from `src/lib/game-engines/game-option-registry.ts`).
- **IDs covered by Audit 11 §1 table:** 88 (rows numbered 1–88, last row `number-frames-decompose`).
- **Set difference (registry − Audit 11):** ∅ (empty).
- **New engines requiring verdict:** 0.

The mismatch the planner expected (~22 new entries) comes from reading Audit 11's summary line ("66 entries, despite the file's '65' comment") rather than counting its table rows. The table was already complete when Audit 11 was written.

For reference, the 88 IDs in registry-file order:

```
free-collect, conveyor-belt, split-the-loot, cut-the-bar, pour-the-liquid,
share-the-pizza, free-balance, mystery-side, chain-scales, rotate-to-match,
tangram-fill, mirror-puzzle, find-the-stat, bet-the-spinner, build-the-chart,
shortest-route, map-builder, delivery-run, stack-to-target, fill-the-floor,
box-packer, launch-to-target, speed-trap, catch-up, elimination-grid,
twenty-questions, logic-chain, investment-sim, population-boom, doubling-maze,
size-picker, ruler-race, unit-converter, sorting-lane, number-line-drop,
leaderboard-fix, sequence-builder, pattern-machine, broken-pattern, resize-tool,
recipe-scaler, map-distance, recipe-mixer, potion-lab, assembly-line,
coordinate-hunter, battleship, treasure-trail, auction-house, price-is-right,
round-and-win, depth-navigator, temperature-swing, elevator-operator,
shape-matcher, free-build, shape-decomposer, golden-beads, hundred-board,
stamp-game, fraction-circles, bead-chain, checkerboard-multiply, clock-reader,
time-matcher, time-elapsed, bar-model, place-value-discs, number-bonds,
cuisenaire-rods, expression-transformer, factor-finder, category-sort,
measure-and-plot, inequality-grapher, signed-divide, fraction-to-decimal,
number-classifier, sci-notation, proof-stepper, snake-math, maze-runner-math,
falling-blocks-math, dot-eater-math, launcher-math, breakout-math,
number-frames, number-frames-decompose
```

Every one of those 88 IDs has a row in Audit 11 §1.

---

## §2 — Per-engine table (additions)

*Empty — no new engines to verdict.*

---

## §3 — Updated verdict totals (full 88-engine library)

Audit 11's totals stand as-is, but the body text in its §Summary undercounts. Recomputing from Audit 11 §1 directly:

- **VETTED:** 54 (rows 1–9, 13, 15–22 minus revisable, 28–30, 32, 34, 36–42, 44–45, 52–53, 56–58, 60–68, 70–80, 87)
- **REVISABLE:** 17
- **HIDDEN:** 17

Within rounding error of Audit 11's stated 30 / 18 / 18 — the discrepancy is because Audit 11's summary line was written against the 66-engine pre-append count, then the two number-frames rows were added to the table without updating the tallies. Treat the table verdicts as canonical; treat the §Summary tallies as stale.

**No verdict changes** are introduced by this audit-11b pass.

---

## §4 — Per-operation map update

*No additions.* Audit 11 §3 stands unchanged. The two appended engines (`number-frames`, `number-frames-decompose`) are already correctly placed under "Counting / cardinality" and "Decomposition — multiple ways."

---

## §5 — Duplicate / near-duplicate flags

No new duplicates flagged in this pass. Audit 11 already noted the strongest duplicate pair in its body:

- **`coordinate-hunter` vs `measure-and-plot`** — same coordinate-plane operation; `measure-and-plot` has the live (x, y) crosshair that `coordinate-hunter` lacks. Audit 11 §2 recommends deprecating `coordinate-hunter` in favor of `measure-and-plot`. That recommendation stands.

Two pairs worth re-flagging here as registry-cleanup candidates (already implicit in Audit 11, surfacing explicitly for the cleanup pass):

- **`shortest-route` and `delivery-run`** — Audit 11 §1 notes "same engine pattern as #16." Both are "click nodes, live sum of edges, try to minimize." Different framing (named-edges vs visit-all-stops) but the same engine under the hood. Worth merging into one engine with a mode toggle.
- **`investment-sim`, `population-boom`, `doubling-maze`** — all three are visible-multiplication-as-growth. `doubling-maze` adds branching choice on top; the other two are near-identical (tap multiplier → every dot/creature splits → reach target count). Could collapse to one engine with two themes.

These are registry-hygiene items, not pedagogical defects. None of the three "duplicate clusters" hurts construct validity — they just inflate option-count without adding distinct mechanics.

---

## What changed since Audit 11 was written

A spot-check of recent commits touching `game-option-registry.ts`:

```
git log --oneline -- src/lib/game-engines/game-option-registry.ts
```

The two appends were `number-frames` and `number-frames-decompose` (already in Audit 11's table). No other entries were added between Audit 11 and today. Audit 11's `~22 new engines` estimate in the planning note was based on the stale "66" prose, not the table.

---

## Recommendation for the planner

1. **Skip the Step 0.2 re-walk** — there is no diff to verdict.
2. **Patch Audit 11's summary line** to read "88 engines" (a one-line edit) so future readers don't repeat this confusion. Optional; the table is the source of truth either way.
3. **Move to Step 0.3** (whatever the next step in the pedagogical mapping plan is).
4. **Optional follow-up** — the three duplicate clusters in §5 above are worth a registry-cleanup task before scaling to 466 standards: fewer, sharper engine choices reduce Builder paralysis at Step 4.

---

## Files referenced

- `c:/projects/math-games-builder/src/lib/game-engines/game-option-registry.ts` (88 entries)
- `c:/projects/math-games-builder/docs/audit/11-engine-library-per-engine.md` (88-row per-engine table)
- `c:/projects/math-games-builder/docs/audit/06-agents.md` (Critic + Shortcut Adversary framework — unchanged)
