# New engines to build (Mechanic Inventor queue)

> Running list of engines we want the Mechanic Inventor agent to build out, scoped to specific standards where current coverage is thin. Add entries here when standard-mapping work surfaces a coverage gap that can be closed with a new (not revised) engine. When an engine ships, delete its entry.

---

## True/False Equation Sorter

**Unlocks:** 1.OA.D.7 (equal-sign relational understanding) to a clean 3-PRIMARY floor.

**Mechanic:** Equation cards shown one at a time or in batches. Cards display equations in all four forms named by 1.OA.D.7:
- a + b = c (standard left-to-right)
- c = a + b (right-to-left)
- a + b = c + d (compound — McNeil's classic example: 8 + 4 = ___ + 5)
- a = a (reflexive — 7 = 7)

Kid drags each card to a "TRUE" bin or "FALSE" bin. The bin physics give immediate feedback (true cards float gently into a stack; false cards bounce back with a wobble). No buttons, no "check answer" — the sort IS the answer.

**Why this engine:** The math-ed literature (Behr/Erlwanger/Nichols 1980; McNeil & Alibali 2005; Carpenter/Franke/Levi 2003) is unambiguous that 1.OA.D.7 is THE standard where kids must learn "=" means "is the same as," not "do something." Current engine coverage for D.7 is 2 balance-based engines (free-balance, mystery-side) — strong but same metaphor twice. A card-sorter adds the multi-direction, multi-form variety the standard's verbatim text demands.

**Estimated effort:** 4-6 hours. Plain HTML/JS (no Phaser needed). New engine in src/lib/game-engines/. Card data is a list of {equationParts, isTrue} tuples; sorting UI is two drop-zones; physics is CSS animations.

**Added:** 2026-05-11 as part of Phase 3 mapping work.

---

## Thousand Chart (grid 1–1000)

**Unlocks:** 2.NBT.B.8 (mentally find 100 more / 100 less) to clean 3-PRIMARY by giving the +/- 100 pattern a structural visual (column-jump on a 10x10x10 grid). Also deepens 2.NBT.A.2 (count to 1000) by providing a continuous visual for within-1000 sequence work.

**Mechanic:** A 10x10x10 stacked grid (10 layers of 10x10 each, navigable by swiping or scrolling). The kid can tap cells in sequence to count, jump by 100 (one full layer = +100) or by 10 (one row = +10). Highlights the "ones digit stays the same" pattern for both +/- 10 and +/- 100. Inherits Fix 2 / Fix 3's count-trail + start-from-N modes for parity with the hundred chart.

**Why this engine:** The Common Core Progressions K-5 NBT explicitly names the thousand chart (p. 59) as the canonical visual for within-1000 counting. Our existing place-value-discs engine covers +/- 100 structurally via discrete tens/hundreds tokens, but the row/column-jump pattern is more directly visible on a grid. Adding this engine fills a representation gap.

**Estimated effort:** 6-10 hours. Phaser scene similar to HundredBoardScene with a layer-navigation control. Should reuse Fix 2's count-trail rendering once that ships. Wait for engine-fixes 2/3 to land first; then this is largely a configuration / scaling task.

**Added:** 2026-05-11 as part of Phase 4 mapping work.

---

## Explanation-Capture Builder UX Pattern (Builder-flow design, not an engine)

**Note:** This is a Builder UX pattern, not a new game engine. Listed here for tracking since 2.NBT.B.9 (explain why strategies work) coverage depends on it.

**Unlocks:** 2.NBT.B.9 PRIMARY engines all need a Builder-flow step where the Player produces an explanation after completing the mechanic. Without this UX pattern, the engines are SECONDARY for B.9 (manipulation without explanation).

**Pattern shape:** During the Builder's design of a game targeting 2.NBT.B.9 (or any standard demanding MP3 "construct viable arguments"), the build flow offers a Step 4.5 — "How will Players explain their strategy?" — with options:

- **Action-sequence replay** — game records the kid's moves; replays them at end as a sequence the kid can narrate verbally or via drag-labels
- **Strategy-step drag-labels** — at end-of-round, kid drags labels ("I made a ten," "I split the tens first," "I added the hundreds first") onto the steps in order
- **Audio narration** — kid records a short voice clip explaining what they did (review by Builder later)
- **"Why" prompt with multiple-choice** — kid picks the explanation that matches their strategy from 3-4 options

Builder picks one pattern per game; the runtime applies it after the mechanic completes.

**Why this matters:** 2.NBT.B.9 is a Standard for Mathematical Practice MP3 standard inside a content standard. The standard's verbatim text says "explain why." A game that lets a kid solve 47 + 28 with regrouping but doesn't capture WHY they did it that way fails Construct Validity (Critic Criterion 4). The pattern doesn't require new engines — it requires the Builder flow to offer the explanation-capture step.

**Estimated effort:** Part of the larger 5-step Builder flow design (in progress in the other Claude window). Not a separate engineering task — a design-pattern requirement to bake into the Builder flow's Step 4 (Mechanic Picker) when a standard's metadata flags "explanation required."

**Added:** 2026-05-11 as part of Phase 4 mapping work.
