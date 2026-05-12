# Phase 1A — K.OA.A.3 and K.OA.A.4 PRIMARY engine additions (draft)

*Date: 2026-05-11 · Drafter: Phase 1A pedagogical mapping pass · Status: DRAFT for Barbara's review — do not patch `standard-mechanic-map.json` until approved*

---

## Review summary

This draft proposes **2 new PRIMARY engines for K.OA.A.3** (bringing 1 → 3) and **1 new PRIMARY engine for K.OA.A.4** (bringing 2 → 3). Both standards reach the ≥3 PRIMARY floor after the additions.

The biggest judgment call: for K.OA.A.3 I promoted `number-frames-decompose` from REVISABLE to PRIMARY **conditional on the existing ≥3-splits fix being declared in-scope.** The fix is already listed as Audit 11 §2 priority #1 (it is the Critic's canonical FAIL example), and `chesure-knowledge/k-oa-progressions.md` §2.3 exemplar #1 ("ways to make N board") describes exactly the post-fix behavior. So the engine is one well-defined patch away from VETTED-for-A.3. If Barbara prefers stricter accounting, demote it back to REVISABLE — in that case A.3 would have 2 PRIMARY (cuisenaire-rods + shape-decomposer), still below the floor, and we would need Mechanic Inventor to build a new "ways to make N" engine before declaring the floor met. Flagging this honestly so the choice is yours.

For K.OA.A.4 I added `split-the-loot` (Two Silos) as PRIMARY. The standard says "find the number that makes 10 when added to the given number" — Two Silos locked to total=10 with one silo pre-filled to N is literally that mechanic. The engine is already VETTED; the partner-of-10 framing is a configuration choice (locked total + pre-filled silo), not an engine fix.

Both standards now reach 3 PRIMARY. No standard remained under the floor.

---

## K.OA.A.3 — JSON additions

**Current PRIMARY count:** 1 (`cuisenaire-rods`)
**After additions:** 3 PRIMARY

Add these two entries to `standards["K.OA.A.3"].primary`:

```json
{
  "engineId": "shape-decomposer",
  "rationale": "Area-decomposition of a target shape with area ≤10 unit-squares: kid partitions the same total area into two colored regions, then partitions it again differently across rounds. Each distinct two-region split IS a decomposition of the total — Critic Criterion 4 (Construct Validity) holds because the standard says 'decompose numbers less than or equal to 10 into pairs in more than one way,' and the region-split is literally a pair (region A count + region B count = total). Filling the regions enforces one-to-one cardinality, the totals are within 10, and varying the split across rounds is the multiplicity the standard demands."
},
{
  "engineId": "number-frames-decompose",
  "rationale": "Promoted from REVISABLE to PRIMARY conditional on the ≥3-distinct-splits fix being declared in-scope (Audit 11 §2 priority #1 + Chesure §2.3 exemplar #1 'ways to make N' board). After fix: ten-frame with a divider, kid produces ≥3 distinct (a,b) pairs with a,b≥1 before round ends, each pair recorded in a visible side-panel chart. Math IS the gameplay (Critic Criterion 2) because moving the divider IS the decomposition action; Construct Validity (Criterion 4) holds because the round's win-state requires multiplicity, not one-and-done. Quoting the standard: 'Decompose numbers less than or equal to 10 into pairs in more than one way…' — the engine's post-fix mechanic enforces 'more than one way' as the literal win condition."
}
```

After the additions, also **remove `number-frames-decompose` from `standards["K.OA.A.3"].revisable`** (it has been promoted, not still pending) — leave `split-the-loot` and `number-bonds` in REVISABLE since they remain optional alternates that need their own fixes.

---

## K.OA.A.4 — JSON additions

**Current PRIMARY count:** 2 (`number-frames`, `cuisenaire-rods`)
**After additions:** 3 PRIMARY

Add this entry to `standards["K.OA.A.4"].primary`:

```json
{
  "engineId": "split-the-loot",
  "rationale": "Two Silos configured with total locked at 10 and one silo pre-filled with the given number N (1–9): the kid physically counts items into the empty silo until the load splits cleanly — the count they made IS the partner of 10. Construct Validity (Critic Criterion 4) holds because the standard says 'For any number from 1 to 9, find the number that makes 10 when added to the given number,' and the kid produces that partner number by per-item tapping into the empty silo (not by reading or by visual symmetry). Already VETTED in Audit 11; the partner-of-10 framing is a configuration choice (locked total + pre-filled silo), not an engine fix. No auto-counting; the kid's tap-per-item is the count."
}
```

`split-the-loot` is currently NOT listed at K.OA.A.4 in any section. Add to PRIMARY as above. (It remains REVISABLE for K.OA.A.3 because the A.3 use case requires the ≥3-splits fix; the A.4 use case does not — the partner is unique once total and N are fixed.)

---

## Optional adjacent additions (Barbara's call — separate from the floor fix)

These came up during the walk. Propose for SECONDARY/REVISABLE adjustment if Barbara wants the rationale text tightened.

### K.OA.A.3 — minor

- Consider moving `cut-the-bar` from SECONDARY to **NOT_APPLICABLE / drop**. The current SECONDARY rationale already concedes the engine is fractions (3.NF/4.NF), not arbitrary pair-decomposition. Keeping it as SECONDARY clutters the list without serving Builders at K.OA.A.3.
- Consider adding `free-collect` to SECONDARY for K.OA.A.3 with the note: "Two-target compose can model 'put N into bin A and the rest into bin B' as a decomposition; would need a multiplicity wrapper to qualify higher. SECONDARY, not PRIMARY."

### K.OA.A.4 — minor

- Consider promoting `free-balance` from SECONDARY to a **REVISABLE for A.4** with fix text: "Lock left pan to a fixed mystery weight of 10; pre-fill right pan with N counters in 1–9; kid adds counters until balance — the partner IS the count of counters they added. Currently the balance metaphor is flagged 'unusual at K' but with these configuration locks it becomes a clean partner-of-10 mechanic." Tracks the same shape as the `split-the-loot` configuration argument above.
- Consider adding `number-frames-decompose` to SECONDARY for K.OA.A.4 conditional on the post-A.3 fix: once `number-frames-decompose` enforces multiplicity, a special A.4 mode could lock total=10 and pre-fill one part — but at that point it becomes redundant with `number-frames` itself. Probably not worth listing.

---

## Notes for the patcher

When applying this draft to `src/data/standard-mechanic-map.json`:

1. K.OA.A.3 `primary` array: append the two objects above in the order listed (shape-decomposer first, then number-frames-decompose).
2. K.OA.A.3 `revisable` array: remove the `number-frames-decompose` entry (it has been promoted).
3. K.OA.A.3 `coverageGap` field: change from the current `"Only 1 PRIMARY engine…"` text to `null` (or rewrite to flag the conditional promotion of `number-frames-decompose` for transparency).
4. K.OA.A.4 `primary` array: append the `split-the-loot` object.
5. K.OA.A.4 `coverageGap` field: change from `"2 PRIMARY + 1 PRIMARY-after-fix is borderline-acceptable but thin…"` to `null` (or rewrite to note that `split-the-loot` now provides the third primary).
6. Bump `"generated"` field to `"2026-05-11"`.
7. Don't touch any other standard's entries.
