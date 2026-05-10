# K.OA.A.3 Fix Notes — Audit 07 follow-up

*Date: 2026-05-10 · Author: Claude (subagent) · Status: applied to working tree, not committed*

Fixes both High-severity bugs identified in `docs/audit/07-koa-games.md`. Made
the smallest correct change in each file; no surrounding refactor.

---

## Bug 1 — Decompose engine accepts only one decomposition

**File changed:** `src/lib/game-engines/number-frames.ts`

### What changed (summary of diff)

1. **`DecomposeRound` type** gained a required `minWays: number` field.
2. **`ROUNDS_DECOMPOSE`** now specifies `minWays` per round:
   - totals 3, 5 → `minWays: 2` (few legal pairs with each piece ≥ 1)
   - totals 6, 8, 10 → `minWays: 3`
3. **Runtime state** added `waysFound: string[]` (canonical form `"a+b"`),
   reset in `startRound()`.
4. **DOM:** added a `#ways-panel` between the number pad and the equation
   reveal. Each accepted decomposition becomes a green pill chip
   ("2+3 = 5"). Hidden in add/sub modes.
5. **`onDone()` decompose branch** rewritten:
   - Validate `frameA + frameB === total` and each piece ≥ 1 (existing rule).
   - If the pair is **already in `waysFound`** → friendly nudge
     ("You already showed 2+3 — find a different way."), the matching chip
     briefly flashes amber, frames stay as-is, round does NOT advance.
   - If the pair is **new** → push to `waysFound`, append a chip to the
     ways panel.
   - If `waysFound.length >= minWays` → round completes (fires
     `reportRound`, shows success). The success line now reads
     "You found N ways to make T!" instead of a single equation.
   - Otherwise → reset both frames to empty, prompt the learner to find
     "N more" decompositions. Round stays active.
6. **`startRound()` decompose branch** updates the instruction line to
   "Find N different ways" up front, and shows the ways panel with a
   "Ways to make T (find N):" title.
7. **End-of-game branch** of `nextRound()` now also hides the ways panel.

### Pedagogical design choices (flag for Barbara)

- **Orderings count as DISTINCT.** `2+3` and `3+2` are tracked as two
  different ways. The audit explicitly flagged this as something to verify
  with Barbara (audit §"Fix 1"). I went with **distinct** because:
  1. Audit author leaned that way ("I lean *different* at K to honor
     commutative awareness").
  2. Fischer (1990)'s canonical "ways to make 5" chart counts orderings
     separately: `5=1+4, 5=2+3, 5=3+2, 5=4+1, 5=5+0, 5=0+5`.
  3. At K, "2 in this hand and 3 in this hand" is a genuinely different
     observation than "3 in this hand and 2 in this hand" — the
     commutativity insight (1.OA.B.3) hasn't happened yet.
  - **If Barbara prefers canonical/unordered pairs**, change is a one-liner:
    canonicalize `key` as `Math.min(a,b) + "+" + Math.max(a,b)`. Worth
    revisiting once we have classroom data on whether kids feel
    "tricked" when 2+3 and 3+2 both count.

- **Zero NOT allowed.** I kept the existing `frameA >= 1 && frameB >= 1`
  rule. The audit didn't say to relax it. CCSS K.OA.A.3 doesn't require
  zero-pairs (`5=5+0`); those are a 1st-grade extension. Worth flagging
  for Barbara since some K curricula DO include zero-pairs in the chart.

- **`minWays` defaults** (2 for totals ≤ 5, 3 for totals ≥ 6) are
  conservative — the audit said "2+ for total ≤ 5, 3+ for total 6–10."
  Easy to tune later.

### Edge cases handled

- Repeat detection runs even on the FIRST attempt (a no-op until first
  pair is recorded — safe).
- Wobble + roundAttempts++ still fire on repeats and on invalid sums
  (consistent with existing wrong-answer instrumentation).
- `reportRound` for a completed decompose round now passes the
  comma-joined list of all distinct ways as `learnerAnswer`. The
  `correctAnswer` field continues to be `r.total` (no schema change to
  the postMessage envelope, downstream consumers unchanged).

### What I did NOT change

- The 5-rounds-per-game structure.
- The set of totals (3, 5, 6, 8, 10) — audit said keep them.
- The existing add/sub mode behavior (audit explicitly recommended
  leaving K.OA.A.1 alone).
- Any other engine or component file.

---

## Bug 2 — `standard-rounds.ts` had K.OA.A.4 prompts under K.OA.A.3

**File changed:** `src/lib/standard-rounds.ts`

### What changed

The K.OA.A.3 entry in `STANDARD_ROUNDS` was **removed** and replaced with
a comment explaining why. Per the audit's recommendation
(§"Fix 2 — Recommend dropping"):

- The `HardcodedRound` schema is **single-target** (`prompt → one
  correct number`), which is a missing-addend / completion task. K.OA.A.3
  is a **generation** task — the learner must produce multiple distinct
  pairs. The schema cannot represent that without extension.
- Rather than invent fake K.OA.A.3 prompts that fit the schema (which
  would just relabel K.OA.A.4 rounds again), I dropped the entry.
- `getHardcodedRounds("K.OA.A.3")` now returns `null`, which the
  consumer (`src/app/api/game/generate-engine/route.ts`) already handles
  safely. K.OA.A.3 must be authored via the
  `number-frames-decompose` engine, which is the only surface that
  pedagogically supports the "more than one way" requirement.

The K.OA.A.4 entry (which already correctly contained missing-addend
prompts like `8 + ? = 10`) was left untouched.

### Consequence for non-decompose engines

If a Builder selects K.OA.A.3 with any engine other than
`number-frames-decompose` (e.g., Sum Jumper, Wall Builder via the
generic round-feeder), the round-fetch will return `null`. We should
verify the engine-selection UI doesn't offer K.OA.A.3 in those engines,
or ensure the API gracefully falls back. **Follow-up worth checking**
in `src/lib/standard-game-options.ts` and the engine registry — see
"Follow-up" below.

---

## Tests

- No automated tests exist for these files (verified via repo search).
- Did NOT run `npm run dev` or `npm run build` per task instructions.
- TypeScript types updated explicitly (no `any`); the new
  `minWays: number` field is required on `DecomposeRound` and supplied
  on every entry in `ROUNDS_DECOMPOSE`.

---

## Follow-up worth tracking (NOT done in this pass)

1. **Verify K.OA.A.3 isn't offered with non-decompose engines.** Check
   `src/lib/standard-game-options.ts` and the game-option-registry to
   confirm only `number-frames-decompose` is offered for K.OA.A.3. If
   other engines list it, either remove the option or extend
   `HardcodedRound` to support multi-answer prompts.
2. **Confirm the orderings-count-distinct call with Barbara** (see
   "Pedagogical design choices" above). One-line revert if she prefers
   canonical pairs.
3. **Consider zero-pairs.** Whether `5 = 5 + 0` should count as a way
   is a curriculum call. Currently disallowed (each piece ≥ 1).
4. **Audit's Fix 3, 4, 5, 6 are NOT addressed in this pass** — only
   Fixes 1 and 2 (the two bugs in scope). The Mr. Chesure K.OA
   knowledge file, the K.OA.A.1 representational-fluency expansion,
   the rubric rewrite, and the combine animation remain open.
