# Phase 4 — Grade 2 Operations & Algebraic Thinking (2.OA) mapping draft

*Generated 2026-05-11. Drafted by subagent for Barbara's review. Do NOT merge to `src/data/standard-mechanic-map.json` until Barbara signs off.*

## Review summary

### Per-standard PRIMARY counts

| Standard | Clean PRIMARY | Conditional PRIMARY | Total proposed PRIMARY | Hits ≥3 floor? |
|---|---|---|---|---|
| 2.OA.A.1 | 3 (`bar-model`, `cuisenaire-rods`, `number-frames`) | 0 | 3 | YES (clean) |
| 2.OA.B.2 | 2 (`number-frames`, `cuisenaire-rods`) | 0 | 2 | NO — coverage gap (see below) |
| 2.OA.C.3 | 3 (`number-frames`, `cuisenaire-rods`, `category-sort`) | 0 | 3 | YES (clean) |
| 2.OA.C.4 | 4 (`checkerboard-multiply`, `fill-the-floor`, `assembly-line`, `investment-sim`) | 0 | 4 | YES (clean) |

### Clean-floor vs conditional-floor count

- **3 of 4 standards** hit the clean ≥3 PRIMARY floor without depending on engine fixes (2.OA.A.1, 2.OA.C.3, 2.OA.C.4).
- **1 of 4 standards** (2.OA.B.2 — fluency within 20) has only 2 clean PRIMARY engines. Real coverage gap — flagged in `coverageGap` field. **This is the expected outcome.** Pure-fluency drill is intentionally anti-pattern in this app (math IS the gameplay; no flashcards, no timers — Baroody 2006 and Boaler on math anxiety). The two PRIMARY engines named are the ones that surface mental strategies (making-ten, doubles, near-doubles) visibly rather than just asking for fast typed answers. The standard's "fast and accurate" recall is better measured in the separate calibrated Mastery Check spec, NOT through Builder games.

### Biggest judgment calls

In plain English:

1. **2.OA.B.2 is genuinely thin and that's correct.** Fluency-within-20 is the one 2.OA standard where Builder games are NOT the right primary instrument. The Progressions document itself warns against "instilling facts divorced from their meanings" — exactly what a timed-flashcard game would do. The two PRIMARY engines (`number-frames` and `cuisenaire-rods`) are the ones that show mental strategies VISIBLY: kids see the 10-frame fill to make ten; kids physically swap a 7-rod for a 6 + 1 to enact near-doubles. Other engines (`bar-model`, `free-balance`) are SECONDARY because they're general-purpose representations of addition/subtraction, not strategy-surfacers. The `coverageGap` field names this explicitly and points at the Mastery Check as the right home for the fluency-speed-and-accuracy measure.

2. **2.OA.A.1 is the broadest 2.OA standard, and `bar-model` is its workhorse.** "Within 100" + "one- and two-step problems" is a big jump from 1.OA.A.1's "within 20." The bar-model's two-bar chaining and labeled empty sections are exactly what two-step problems need. `cuisenaire-rods` covers the within-100 piece with the 10-rod and unit-rods. `number-frames` PRIMARY hinges on a per-standard scenario decision to use a double ten-frame as a "tens-only" frame (each cell = 10) for the within-100 jump — explicitly called out in the rationale.

3. **2.OA.C.4 has the strongest coverage of any 2.OA standard — 4 clean PRIMARY engines.** Rectangular arrays up to 5×5 are exactly what `checkerboard-multiply`, `fill-the-floor`, `assembly-line`, and `investment-sim` were built for. Note that these engines are normally cited for 3.OA (multiplication). The Progressions doc itself is explicit (p. 34) that 2.OA.C.4 is the Level-1 setup for 3.OA — same engines, scenarios constrained to ≤5 rows × ≤5 columns AND the equal-addend equation displayed (e.g., 3 + 3 + 3 + 3 = 12 for a 3×4 array, NOT 3 × 4 = 12).

4. **2.OA.C.3 (odd/even) is well-served by `category-sort` plus pairing representations.** `category-sort` (Self-Revealing Buckets) is the discovery-of-rule engine: a kid drops objects and sees which bin they "stick" in — the parity rule emerges from buckets that only accept odd OR only accept even amounts. Add `number-frames` and `cuisenaire-rods` for the explicit pairing/skip-count-by-2s and equal-addend-equation recording, and the floor is clean.

5. **`split-the-loot` (Two Silos) was demoted from PRIMARY for 2.OA.C.3.** The candidate list flagged it as plausible because odd/even is "decomposition into two equal addends." But Two Silos doesn't enforce equal split — it accepts any split. For 2.OA.C.3 the equal-addend constraint is the standard's point. Listed as REVISABLE with the fix needed (lock both silos to equal counts for the even-number rounds), but not PRIMARY.

### Cross-cutting concerns

- **No new engine fixes are required for 2.OA's clean PRIMARY floors.** Unlike 1.OA.C.5 (which depends on the K.CC.A.2 counting-on fix), 2.OA.A.1, 2.OA.C.3, and 2.OA.C.4 all use VETTED engines that work as-is. 2.OA.B.2's gap is a design-philosophy gap, not an engine gap.
- **The 2.OA.C.4 → 3.OA.A.1 bridge is the most important downstream dependency.** Same engines (`checkerboard-multiply`, `assembly-line`, `investment-sim`, `bead-chain`) appear in both — the only difference is the equation form displayed (repeated addition at 2.OA.C.4; multiplication at 3.OA.A.1). Builders at 2.OA.C.4 must NOT use multiplication notation; Builders at 3.OA.A.1 must surface BOTH forms.
- **Mechanic Inventor opportunity for 2.OA.A.1 two-step problems.** None of the current PRIMARY engines have first-class "two-step problem" support. They each handle single-step well and chain naturally (e.g., bar-model with a stacked or sequential bar; cuisenaire-rods with two trains side-by-side). A dedicated two-step word-problem engine — with two operation slots, each labeled — could move 2.OA.A.1 from "good with scenario design" to "structurally enforced." Flagged for the new-engines list.
- **The 2.OA.B.2 fluency gap should be filed against the Mastery Check work**, not against the engine library. Fluency-as-speed-and-accuracy is the Mastery Check's domain; fluency-as-efficient-strategy is what `number-frames` and `cuisenaire-rods` serve here.

---

## 2.OA.A.1

Solve one- and two-step word problems within 100 across the three CGI situation types, with unknowns in all positions.

```json
"2.OA.A.1": {
  "standardText": "Use addition and subtraction within 100 to solve one- and two-step word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem. (See Glossary)",
  "namedSkill": "Solve one- and two-step word problems within 100 across the three CGI situation types (Add-To, Take-From, Put-Together/Take-Apart, Compare), with the unknown in any position. Rewrite a situation equation (e.g., ? − 38 = 49) as a solution equation (49 + 38 = ?). The big jump from 1.OA.A.1 is the within-100 range AND the introduction of TWO-STEP problems — engines that only show a single operation are SECONDARY for this standard; PRIMARY engines must chain or support multi-step compositions.",
  "primary": [
    {
      "engineId": "bar-model",
      "rationale": "Singapore CPA canonical — the strongest engine for 2.OA.A.1 because the bar model supports both two-step problems (two stacked or sequenced bars, each its own operation) and unknowns-in-all-positions (any segment can be the labeled-empty unknown). Critic Criterion 4 (Construct Validity): for a two-step problem 'Maya has 38 marbles. She gets 12 more, then gives 5 to her brother. How many now?' the kid builds a bar of 38, extends it by 12, then shortens by 5 — the equation `38 + 12 − 5 = ?` writes itself as the bar's history. For a situation equation `? − 38 = 49` the kid sees the total bar (49 + 38 = 87) and the known-subtracted-part (38), and produces the start (87) — the rewrite from situation to solution equation is enacted physically. Within 100 covered by 10-rods + unit rods. Audit 11 VETTED. Bar-model's part-whole-with-unknown is the Singapore method's central representation for exactly this standard."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Length-snap composition supports all three situation types and chains naturally for two-step problems. Critic Criterion 4: for a two-step problem the kid snaps a 10-rod + an 8-rod (first step: 18), then adds a 5-rod (second step: 23) — the train's growing length IS the running total of a multi-step process. Within 100 supported by combining 10-rods. The kid produces each addend or minuend as a physical rod selection, so the count is produced, not read. Two-step shown by visible composition history (the snap-on order is visible). Audit 11 VETTED."
    },
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame extends to within-100 work when configured as a 'tens frame' (each cell = 10) — a standard Math Learning Center scenario decision documented in Bridges Grade 2. Critic Criterion 4: for 'Maya had 38 stickers. She buys 24 more. How many?' the kid drops 3 ten-cells + 8 unit-counters as 38, then 2 ten-cells + 4 unit-counters as 24 — the sum 62 reads from the final frame state. Two-step problems chain across two consecutive frame configurations. Builder scenario design must specify the tens-frame configuration for within-100 totals; the engine supports it natively. Note: for kids still cementing within-20 strategies (slower 2nd graders) the unit-counter mode is fine. SECONDARY scenarios would use the within-20 unit-only mode."
    }
  ],
  "secondary": [
    {
      "engineId": "free-balance",
      "rationale": "Beam supports unknown-position equations (the standard's 'unknowns in all positions' clause) including the rewriting of `? − 38 = 49` as `49 + 38 = ?`. Within 100 covered by configurable weight labels. SECONDARY because the engine is single-equation by default — chaining for two-step problems requires Builder scenario design to fire two consecutive beam rounds. PRIMARY when the standard is 2.OA-adjacent equation work; SECONDARY here because the standard emphasizes WORD PROBLEMS where the bar model and rod composition are more natural."
    },
    {
      "engineId": "split-the-loot",
      "rationale": "Two-silo split models Put-Together/Take-Apart within 100 with one silo locked. Supports unknown-addend (Change-Unknown) cleanly. SECONDARY because the engine is single-operation by default — two-step problems require Builder-side chaining."
    },
    {
      "engineId": "conveyor-belt",
      "rationale": "Tank level as the sum supports Add-To within 100 with sufficient tank capacity. Continuous liquid is less direct for discrete-object word problems but works for measurement-themed scenarios. SECONDARY because the within-100 range stretches the engine's visual capacity (very large tanks are hard to read)."
    },
    {
      "engineId": "stack-to-target",
      "rationale": "Pan-height composition for within-100 totals; works for single-step Result-Unknown problems. SECONDARY because of the discreteness limitations at higher counts (stacks of 80 blocks are awkward to render) and because two-step chaining is Builder-design rather than engine-native."
    }
  ],
  "revisable": [
    {
      "engineId": "number-bonds",
      "fix": "Hide the auto-revealed third value until the kid commits a guess; supports Start-Unknown and Change-Unknown for 2.OA.A.1's unknowns-in-all-positions clause. Same fix queued for K.OA.A.3, K.OA.A.4, 1.OA.A.1, 1.OA.B.4."
    }
  ],
  "coverageGap": null,
  "notes": "The big lift from 1.OA.A.1 is (a) within 100 and (b) TWO-STEP problems. PRIMARY engines must support both. Builder design should include at least one two-step round per game and at least one round where the unknown is NOT in the result position. The Progressions doc warns that 'two-step problems should not involve the most difficult subtypes' for grade-2 students — Builders should keep two-step problems away from Start-Unknown and Compare-with-opposite-language until late in the cluster. MECHANIC INVENTOR OPPORTUNITY: a dedicated two-step word-problem engine with two visible operation slots (e.g., 'first add 12, then subtract 5') and a labeled running total."
}
```

---

## 2.OA.B.2

Fluently add and subtract within 20 using mental strategies; know from memory all sums of two one-digit numbers by end of Grade 2.

```json
"2.OA.B.2": {
  "standardText": "Fluently add and subtract within 20 using mental strategies. (See standard 1.OA.6 for a list of mental strategies.) By end of Grade 2, know from memory all sums of two one-digit numbers.",
  "namedSkill": "Add and subtract within 20 'fast and accurate' using the mental strategies named in 1.OA.C.6 (counting on, making ten, decomposing leading to ten, the add/sub relationship, doubles/near-doubles). Know from memory all sums of two one-digit numbers by end of grade 2. Per the Progressions doc verbatim: this is 'not a matter of instilling facts divorced from their meanings' — it's the outcome of multi-year practice plus reasoning. Per Baroody (2006), fluency is efficient strategy use, NOT flashcard speed.",
  "primary": [
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame is the canonical 'making-ten' representation in K-5 (Van de Walle 2018; Math Learning Center Bridges Grade 2). 2.OA.B.2 extends 1.OA.C.6's within-20 strategy work to fluency — and the ten-frame is the engine where the strategy is most visible. Critic Criterion 4: for 8 + 6 the kid fills first frame with 8, then 2 more complete the first frame (the making-ten move), then 4 more in the second frame — the strategy is enacted, not memorized. For 13 − 4 the kid removes 3 from the second frame (emptying it) and 1 from the first frame — the decomposing-leading-to-ten strategy is enacted. This is the strongest 2.OA.B.2 engine BECAUSE it surfaces mental strategies rather than just demanding fast answers. Note: NO TIMER per Baroody 2006."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Rod composition supports all five named strategies (counting on, making ten, decomposing-leading-to-ten, add/sub relationship, doubles/near-doubles) — same as the 1.OA.C.6 PRIMARY rationale. For 2.OA.B.2 the practice is the SAME mechanic with the goal shifted from 'use a strategy' to 'use a strategy fluently.' Critic Criterion 4: for 6 + 7 the kid can swap the 7-rod for a 6-rod + 1-rod (near-doubles) — train length unchanged at 13. The kid PHYSICALLY enacts the strategy; speed builds through repeated practice. Audit 11 VETTED. NO TIMER."
    }
  ],
  "secondary": [
    {
      "engineId": "bar-model",
      "rationale": "Singapore CPA supports making-ten and decomposing-leading-to-ten via rod-swap inside the bar — same as 1.OA.C.6 secondary rationale. Works for the strategy work but less direct than the ten-frame for visualizing the make-a-ten move."
    },
    {
      "engineId": "free-balance",
      "rationale": "Beam supports the add/sub relationship strategy (place 8 + 4 on left, 12 on right; remove 8 from left, beam tilts by 8 showing 12 − 8 = 4) and equivalent sums (swap 7 for 6 + 1, beam remains level). SECONDARY because the engine is single-equation by default — fluency requires many repetitions across varied strategies, which the beam handles round-by-round but slower than ten-frames or rods."
    },
    {
      "engineId": "split-the-loot",
      "rationale": "Two-silo split practices the add/sub relationship (total − part = other part) within 20. SECONDARY because the engine defaults to single-decomposition rather than the multi-strategy fluency practice this standard requires."
    },
    {
      "engineId": "stack-to-target",
      "rationale": "Pan-height composition supports making-ten if Builder lays a visible '10' marker line. Less direct than the ten-frame."
    }
  ],
  "revisable": [
    {
      "engineId": "number-bonds",
      "fix": "Hide the auto-revealed third value until the kid commits a guess; with fix, supports the add/sub-relationship strategy AND doubles-recognition practice (e.g., whole 12, one part 6, kid produces 6 — sees the double)."
    }
  ],
  "coverageGap": "Only 2 clean PRIMARY engines. This is the structural gap of the Builder-games approach to fluency: the app's principle 'math IS the gameplay, never a popup, never a timer, never flashcards' is fundamentally at odds with the 'fast and accurate' clause of this standard. **Fluency-as-speed-and-accuracy is better measured in the separate calibrated Mastery Check** (a low-stakes, properly designed within-20 fluency screener) rather than via Builder games. The two PRIMARY engines named here (number-frames, cuisenaire-rods) are correct for the STRATEGY half of fluency (efficient strategy use, per Baroody 2006) — the speed half belongs in the Mastery Check. Mechanic Inventor opportunity: a 'strategy-tag' overlay where, after a kid solves a within-20 problem with one of the named engines, they tag which strategy they used (making-ten, doubles, count-on, etc.); over rounds, the system reveals which strategies the kid uses fluently and which they avoid — diagnostic without timing.",
  "notes": "2.OA.B.2 is the standard most likely to be tight in this mapping because the app's pedagogical principles (intrinsic integration, no timers, no flashcards) deliberately exclude the most common 'fluency game' designs (flash-card races, falling-numbers games, etc.). The HIDDEN classic-overlay engines (snake-math, falling-blocks-math, etc.) ostensibly cover this standard but fail Critic Criterion 2 (math IS the gameplay) — they're timer-driven extrinsic-integration designs. Builders building 2.OA.B.2 games should design rounds that practice ≥3 of the 5 named strategies and should NOT add timers. The Progressions doc warns explicitly: 'not a matter of instilling facts divorced from their meanings.'"
}
```

---

## 2.OA.C.3

Determine odd/even up to 20 by pairing or counting by 2s; write equation for even numbers as a sum of two equal addends.

```json
"2.OA.C.3": {
  "standardText": "Determine whether a group of objects (up to 20) has an odd or even number of members, e.g., by pairing objects or counting them by 2s; write an equation to express an even number as a sum of two equal addends.",
  "namedSkill": "Decide whether a group of up to 20 objects is odd or even. Use either pairing (two-by-two arrangement; one left over = odd; no leftover = even) or counting by 2s. For even numbers, write an equation expressing the total as a sum of two equal addends (e.g., 8 = 4 + 4). The standard sets the stage for 3.OA multiplication by establishing equal-groups thinking — 2.OA.C.3 and 2.OA.C.4 are paired in the Progressions doc as the Level-1 setup for multiplication.",
  "primary": [
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame visualizes pairing structurally — a ten-frame has 5 columns of 2 cells each, so any number ≤ 10 placed by columns shows parity at a glance (full columns = pairs, partial column = odd). Critic Criterion 4: for 7 the kid places counters column-by-column (column 1 = 2 counters, column 2 = 2 counters, column 3 = 2 counters, column 4 = 1 counter); the half-filled column IS the 'one left over' that proves odd. For 8 the kid places 4 full columns — equal-addend equation 4 + 4 = 8 reads from the column structure (4 columns of 2, OR 2 rows of 4). The pairing-by-2s strategy is enacted by the frame's column structure. Audit 11 VETTED."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Pairing by 2s using 2-rods: the kid covers a target length (e.g., 8) with as many 2-rods as fit. For even: the 2-rods tile exactly (4 × 2-rod = 8); the equal-addend equation 4 + 4 = 8 reads as 'two trains of 4, each built from 2-rods.' For odd: the last 2-rod doesn't fit (e.g., 7 needs three 2-rods + one 1-rod left over). Critic Criterion 4: parity is structural — the kid SEES whether the 2-rods tile or leave a 1-rod gap. Skip-counting-by-2s is enacted by counting the 2-rods one by one (2, 4, 6, ...). Audit 11 VETTED."
    },
    {
      "engineId": "category-sort",
      "rationale": "Self-Revealing Buckets is the discovery-of-rule engine — perfectly suited to odd/even as a hidden classification rule. Critic Criterion 4: an 'Odd' bin and an 'Even' bin are presented; the kid drags groups of objects (up to 20) into bins; correct placements stick, incorrect ones bounce back. The kid discovers the rule (pairing leaves no leftover for one bin, leaves one leftover for the other). The bin physics IS the truth-test — no popup says 'correct.' Strong for the standard's 'determine whether...' clause because the engine's entire premise is determination by rule-discovery. Audit 11 VETTED. The equal-addend equation recording is a secondary mode for the even-bucket items."
    }
  ],
  "secondary": [
    {
      "engineId": "bar-model",
      "rationale": "A target bar of length N can be split into two equal sub-bars iff N is even — the bar-completion mechanic supports the equal-addend equation directly (8 = 4 + 4 as two 4-bars). Works for the equation-recording half of the standard; less direct for the pairing-discovery half."
    },
    {
      "engineId": "stack-to-target",
      "rationale": "Pan-height composition: build a target height using only 2-block pieces; even targets reach exactly, odd targets leave a 1-block gap. Works for parity by 2-piece tiling; SECONDARY because the engine is more naturally used for sum-to-target work than for parity-classification."
    },
    {
      "engineId": "free-collect",
      "rationale": "Tap-and-pair: tap two dots at a time to form a 'pair' that visually clusters; if a leftover dot remains, the count is odd. Works for the pairing mechanic; SECONDARY because the engine's default is single-tap collection, not pair-tap. Builder scenario design needed."
    }
  ],
  "revisable": [
    {
      "engineId": "split-the-loot",
      "fix": "Lock both silos to require EQUAL counts for the even-number rounds (the engine currently accepts any split). With the fix, the kid drops items alternately into two silos and the system enforces equal totals — for even numbers it works; for odd, the kid sees they can't reach the target without one silo being one item shorter, structurally proving odd. Same 'multiplicity / constraint' flavor as the K.OA.A.3 fix."
    },
    {
      "engineId": "number-bonds",
      "fix": "Add 'equal-addend mode' where the two parts are constrained to be equal; with the fix, supports the equal-addend equation directly (whole 8, both parts 4)."
    }
  ],
  "coverageGap": null,
  "notes": "2.OA.C.3 has two distinct demands: (a) determine odd/even by pairing or skip-by-2s, (b) write equal-addend equation for evens. PRIMARY engines must support BOTH. `number-frames` and `cuisenaire-rods` handle both natively; `category-sort` handles (a) directly and (b) as a follow-up recording step. The Progressions doc (p. 34) makes explicit that 2.OA.C.3 and 2.OA.C.4 together prepare for 3.OA multiplication — the equal-groups thinking starts here. Builder design should include rounds that VARY between odd and even targets, NOT only evens, and should record the equal-addend equation for each even round."
}
```

---

## 2.OA.C.4

Use addition to find total in rectangular arrays up to 5×5; write equation as a sum of equal addends.

```json
"2.OA.C.4": {
  "standardText": "Use addition to find the total number of objects arranged in rectangular arrays with up to 5 rows and up to 5 columns; write an equation to express the total as a sum of equal addends.",
  "namedSkill": "Find the total number of objects in a rectangular array up to 5 rows × 5 columns by adding equal addends (one addend per row, OR one per column). Write the equation as a sum of equal addends (e.g., 3 + 3 + 3 + 3 = 12 for a 4-row × 3-column array). This is THE foundation for 3.OA.A.1 (multiplication as equal groups). Builders at 2.OA.C.4 must NOT use multiplication notation — only repeated addition.",
  "primary": [
    {
      "engineId": "checkerboard-multiply",
      "rationale": "Equal-groups area model — Audit 11 calls this 'the strongest 3.OA engine,' and 2.OA.C.4 is the Level-1 setup for 3.OA. Critic Criterion 4: the engine renders a grid of cells (up to 5 × 5 for this standard); the kid fills row by row (or column by column); a running total is written to the right of each row as the Progressions doc explicitly recommends ('a running total written to the right of each row, e.g., 3, 6, 9, 12, 15'). The equal-addend equation 3 + 3 + 3 + 3 = 12 reads directly from the row-tallies. Constraint for 2.OA.C.4: scenario must cap at 5×5 AND display the equation in repeated-addition form (NOT multiplication). Audit 11 VETTED."
    },
    {
      "engineId": "fill-the-floor",
      "rationale": "Resizable Rectangle — Audit 11 VETTED; W×H readout shows the array dimensions live. Critic Criterion 4: the kid drags row/column counts to build a rectangle (e.g., 3 rows × 4 columns); the area readout reads 12 (and ideally 3 + 3 + 3 + 3 = 12 in repeated-addition form, configured per scenario). Strong for the standard because shape AND number both matter — the kid sees the array's geometric structure, not just the total count. For 2.OA.C.4 the live-readout should display the equal-addend equation, not the multiplication."
    },
    {
      "engineId": "assembly-line",
      "rationale": "Two-slider equal-groups model — Audit 11 VETTED. Critic Criterion 4: one slider sets the number of groups (rows); the other sets the per-group count (columns); pallets are visible per group. For a 3 × 4 array: 3 groups of 4 pallets each. The equal-addend equation 4 + 4 + 4 = 12 reads from the pallet groups. Engine is normally cited for 3.OA but the Level-1 framing (visible pallets, repeated-addition equation) is exactly 2.OA.C.4. Constraint: scenario caps at 5 groups × 5 per-group AND displays repeated-addition (not multiplication)."
    },
    {
      "engineId": "investment-sim",
      "rationale": "Multiplication Array (despite the name) — Audit 11 VETTED, 'visible dot-splitting; multiplication you SEE.' Critic Criterion 4: dots arranged in a rectangular array with row/column structure visible; the kid taps rows or columns to count them. For 2.OA.C.4 the engine is configured to cap at 5 × 5 and display the equal-addend equation (e.g., 3 + 3 + 3 + 3 + 3 = 15 for a 5 × 3 array). The 'visible dot-splitting' is exactly the Level-1 'show all the quantities' move the Progressions doc names."
    }
  ],
  "secondary": [
    {
      "engineId": "bead-chain",
      "rationale": "Skip-counting on a bead chain models the equal-addend running totals (3, 6, 9, 12, 15). Critic Criterion 4: the kid taps each group of 3 beads, calling out the running total. SECONDARY because the engine doesn't display the array's 2-D structure (rows and columns) — it's a 1-D representation of the skip-count, which is one of the two strategies the standard names but not the array structure itself. PRIMARY for skip-count work at 2.NBT.A.2 and 3.OA.A.4."
    },
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame can hold a 2 × 5 or 5 × 2 array natively; arrays up to 5 × 4 fit in the second frame; full 5 × 5 doesn't fit cleanly. Works for the small arrays (2 × N and 5 × N) but the engine's structure is fixed at 2 rows of 5 — not all 5 × 5 array shapes. SECONDARY for that reason."
    },
    {
      "engineId": "bar-model",
      "rationale": "Equal-addend bar composition (e.g., four bars of length 3 stacked or aligned) models the equal-addend equation 3 + 3 + 3 + 3 = 12 but loses the rectangular 2-D structure that the standard names verbatim. SECONDARY."
    },
    {
      "engineId": "stack-to-target",
      "rationale": "Equal-block stacking models repeated addition but not the rectangular array structure. SECONDARY."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "Strongest coverage of any 2.OA standard — 4 clean PRIMARY engines. The shared constraint for all PRIMARY engines is: (a) cap at 5 rows × 5 columns, (b) display the equation in repeated-addition form (3 + 3 + 3 + 3 = 12), NOT multiplication. The Progressions doc (p. 34) warns explicitly that Grade 3 students should move to relational diagrams — at Grade 2 we MUST show all the quantities. Mr. Chesure's brief for this standard MUST tell Builders to surface the row-or-column count strategy (kids count by rows OR by columns — early commutativity discovery, but not labeled as such). This is the foundation standard for 3.OA.A.1 — same engines, different equation form."
}
```
