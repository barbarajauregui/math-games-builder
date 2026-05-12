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
