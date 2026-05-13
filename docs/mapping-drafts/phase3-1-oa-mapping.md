# Phase 3 — Grade 1 Operations & Algebraic Thinking (1.OA) mapping draft

*Generated 2026-05-11. Drafted by subagent for Barbara's review. Do NOT merge to `src/data/standard-mechanic-map.json` until Barbara signs off.*

## Review summary

### Per-standard PRIMARY counts

| Standard | Clean PRIMARY | Conditional PRIMARY | Total proposed PRIMARY | Hits ≥3 floor? |
|---|---|---|---|---|
| 1.OA.A.1 | 3 (`bar-model`, `number-frames`, `cuisenaire-rods`) | 0 | 3 | YES (clean) |
| 1.OA.A.2 | 4 (`bar-model`, `number-frames`, `cuisenaire-rods`, `stack-to-target`) | 0 | 4 | YES (clean) |
| 1.OA.B.3 | 3 (`cuisenaire-rods`, `bar-model`, `free-balance`) | 0 | 3 | YES (clean) |
| 1.OA.B.4 | 3 (`free-balance`, `bar-model`, `cuisenaire-rods`) | 0 | 3 | YES (clean) |
| 1.OA.C.5 | 1 (`cuisenaire-rods`) | 2 conditional (`number-frames` needs K.CC.A.2 counting-on fix; `hundred-board` needs trail fix) | 3 | NO clean — conditional only |
| 1.OA.C.6 | 3 (`number-frames`, `cuisenaire-rods`, `bar-model`) | 0 | 3 | YES (clean) |
| 1.OA.D.7 | 2 (`free-balance`, `mystery-side`) | 0 | 2 | NO — coverage gap, only 2 clean PRIMARY |
| 1.OA.D.8 | 3 (`free-balance`, `bar-model`, `split-the-loot`) | 0 | 3 | YES (clean) |

### Clean-floor vs conditional-floor count

- **6 of 8 standards** hit the clean ≥3 PRIMARY floor without depending on engine fixes (1.OA.A.1, A.2, B.3, B.4, C.6, D.8).
- **1 of 8 standards** (1.OA.C.5 — relate counting to add/sub) reaches 3 PRIMARY only conditionally — `number-frames` and `hundred-board` both need fixes that have already been queued in Audit 11 §2 and (for counting-on) in the K.CC.A.2 entry of `standard-mechanic-map.json`. Cuisenaire rods is the only fully clean PRIMARY.
- **1 of 8 standards** (1.OA.D.7 — meaning of equal sign) has only 2 clean PRIMARY engines. Real coverage gap; flagged in `coverageGap` field and in the Chesure file. Mechanic Inventor opportunity: a "true/false equation card sorter" that shows equations in both directions (`5 = 2+3`, `2+3 = 5`, `5+2 = 2+5`, `4+1 = 5+2`) and asks the kid to drag each into a TRUE bin or FALSE bin with bar-or-balance physics validating the answer.

### Biggest judgment calls

In plain English:

1. **Bar Model returns to PRIMARY at grade 1.** At K we demoted bar-model to SECONDARY because of the de Koning et al. 2022 "double-edged sword" finding for K-grade kids — they often don't have the vocabulary to map the story to the bar without a teacher next to them. At grade 1 the standards explicitly name "equations with a symbol for the unknown" (1.OA.A.1, D.8) and the kids are now mid-year reading. Bar-model is the canonical Singapore CPA representation for word problems with unknowns in all positions — exactly what 1.OA.A.1 demands. So it returns to PRIMARY across the cluster.

2. **`free-balance` is the workhorse of 1.OA.** It shows up as PRIMARY for B.4 (unknown-addend literally), C.6 (relationship between addition and subtraction), D.7 (the beam IS an equation, with equal-sign meaning shown by literal balance), and D.8 (unknown number anywhere in the equation). Risk: same engine being PRIMARY for four standards in a row is monotonous if every Builder picks it. Mitigation: the engine supports very different framings per standard, and Builders can override.

3. **1.OA.C.5 ("counting on") is the weakest-supported standard in this cluster.** No engine currently enforces "the kid counts on from N, not from 1" as the win condition. Three engines are proposed but all carry caveats. **This is the same gap flagged in Audit 11 §5 #2 and in the K.CC.A.2 entry of the JSON map.** If the K.CC.A.2 counting-on fixes from the engine-fixes plan ship, 1.OA.C.5 moves from "conditional 3" to "clean 3."

4. **1.OA.D.7 equal-sign — the biggest pedagogical-soundness call.** The math-ed literature (Behr 1980; Carpenter, Franke & Levi 2003; McNeil & Alibali 2005) is unambiguous: most US kids learn "=" as "compute" rather than "is the same as," and 1.OA.D.7 is the standard where the system MUST repair this. Engines that only show equations in `a + b = ?` form actively reinforce the misconception. I marked `free-balance` and `mystery-side` as PRIMARY because their physics literally encode "same on both sides." I marked `expression-transformer` as SECONDARY (algebra-tile zero-pair cancellation works the relational meaning of "=" but the engine's default framing is 6.EE/7.EE, not 1.OA). I marked `bar-model` SECONDARY because side-by-side bars CAN show equality but the engine's default framing is "build the answer," not "is this equation true." This is the coverage gap.

5. **`split-the-loot` (Two Silos) for 1.OA.D.8.** I promoted it to PRIMARY because the standard's example `8 + ? = 11` is exactly Two Silos with the total locked at 11 and one silo pre-filled with 8 — the kid physically counts items into the empty silo until the total matches. That's unknown-addend by mechanic. Confident call.

### Cross-cutting concerns

- **Several standards depend on the K.CC.A.2 counting-on fix** in the engine-fixes plan (1.OA.C.5 PRIMARY, 1.OA.C.6 secondary count-on strategy). If that fix ships, 1.OA.C.5 moves from conditional to clean.
- **The K.OA.A.4 "partners of 10" foundation** is load-bearing for 1.OA.C.6's "making ten" strategy. The Chesure file's §4 cross-references makes this explicit. If a Player is shaky on K.OA.A.4 partners, the make-a-ten strategy at 1.OA.C.6 will fail.
- **`number-bonds` shows up REVISABLE four times** (B.4, D.7, D.8, and already at K.OA.A.3/A.4) with the same fix needed each time: hide the auto-revealed third value until the kid commits a guess. That single engine fix would clean up unknown-addend coverage across grades K and 1. Recommended priority for the engine-fixes plan.
- **The K.OA.A.4 "make-a-ten" line is the bridge** between K.OA and 1.OA.C.6. The Chesure file traces this explicitly.

---

## 1.OA.A.1

Solve word problems within 20 across four situation types (Add-To, Take-From, Put-Together/Take-Apart, Compare) with unknowns in all positions.

```json
"1.OA.A.1": {
  "standardText": "Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem. (See Glossary)",
  "namedSkill": "Solve word problems within 20 across the four CGI situation types (Add-To, Take-From, Put-Together/Take-Apart, Compare), with the unknown in any position (Result-Unknown, Change-Unknown, Start-Unknown, and the comparison-difference). Represent each problem with objects, drawings, or an equation containing a symbol for the unknown.",
  "primary": [
    {
      "engineId": "bar-model",
      "rationale": "Singapore CPA canonical for word problems with unknowns in all positions. The standard says verbatim 'equations with a symbol for the unknown number to represent the problem' — the bar model IS that representation, made physical. Critic Criterion 4 (Construct Validity): the kid places one bar for the known part, leaves a labeled empty bar for the unknown, and the unknown's length is enforced by the part-whole physics — not by reading an answer. Covers Add-To, Take-From, Put-Together, and (with two-bar staggered alignment) Compare. Bar-model returns to PRIMARY at grade 1 from its K.OA SECONDARY demotion (K-grade Moschkovich/de Koning EL concern eases at grade 1 with reading vocabulary catching up). Audit 11 VETTED."
    },
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame supports addition and subtraction within 20 (the standard's range). Critic Criterion 4: counters in the frame ARE the objects the standard names ('by using objects'); the kid taps counters one at a time so the count is produced, not read. Equation appears as recording after commit (Chesure equation-as-record discipline). Supports Add-To and Take-From cleanly; Put-Together via two-color counters in a single frame. Builder must design the scenario to cover unknown-position variety — engine doesn't force it, but supports it. Registry note maps engine to K.OA.A.1, A.2, A.5 — extends naturally to 1.OA.A.1 within 20."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Length-snap composition models all four situation types: rod placed on rod (Add-To), rod removed from train (Take-From), two rods side-by-side equaling a target (Put-Together), train-to-target with one missing rod (unknown-addend variants). Critic Criterion 4: the rod's physical length IS the count; the kid must produce a missing rod by selecting it from the bin, not by reading a digit. Within 20 covered by 10-rod + unit rods. Order-irrelevance (commutative) is structural — same train can be built with rods in any order. Audit 11 VETTED."
    }
  ],
  "secondary": [
    {
      "engineId": "free-collect",
      "rationale": "Tap-and-collect models Add-To naturally and Put-Together with multi-cluster targets; Result-Unknown is the engine's default; the kid would need scenario design to surface Change-Unknown or Start-Unknown."
    },
    {
      "engineId": "conveyor-belt",
      "rationale": "Tank level IS the sum; valid for Add-To within 20 but continuous quantity (liquid) is harder to map to discrete-object word problems at grade 1."
    },
    {
      "engineId": "stack-to-target",
      "rationale": "Pan-height composition; works for Result-Unknown within 20 but block-height is less direct than counted objects for the 'objects or drawings' clause."
    },
    {
      "engineId": "free-balance",
      "rationale": "Beam supports unknown-addend (Change-Unknown, Start-Unknown) cleanly; demoted to SECONDARY because the balance metaphor isn't the most natural for 'word problems' (the standard's emphasis is on representing the story, not weighing). PRIMARY for 1.OA.B.4 and 1.OA.D.7 where balance physics is the literal mechanic."
    }
  ],
  "revisable": [
    {
      "engineId": "number-bonds",
      "fix": "Hide the auto-revealed third value until the kid commits a guess; supports Start-Unknown and Change-Unknown for 1.OA.A.1's unknowns-in-all-positions clause. Same fix already queued for K.OA.A.3, K.OA.A.4."
    }
  ],
  "coverageGap": null,
  "notes": "1.OA.A.1 has unknowns in ALL positions — engines that only handle Result-Unknown (a+b=?) are SECONDARY for this standard. PRIMARY engines must support unknown-addend and start-unknown configurations too. Bar-model and cuisenaire-rods support all positions structurally; number-frames requires Builder-side scenario design to cover them all. CGI problem-type taxonomy (Carpenter et al. 1999) — Builder should cover ≥3 of the 4 CGI types across rounds."
}
```

---

## 1.OA.A.2

Add three whole numbers whose sum is ≤ 20 within a word-problem context.

```json
"1.OA.A.2": {
  "standardText": "Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.",
  "namedSkill": "Add three numbers whose total is ≤ 20 in the context of a word problem. The associative-property opportunity is implicit: kids often regroup the three addends to make a ten first (e.g., 2 + 6 + 4 = 2 + 10 = 12), which is named explicitly in 1.OA.B.3 but practiced here.",
  "primary": [
    {
      "engineId": "bar-model",
      "rationale": "Three-rod composition into a single bar: place three labeled bars end-to-end; total length is the sum. Critic Criterion 4: the kid produces three separate addends (not one combined number) — the standard's 'addition of three whole numbers' clause is structurally enforced because the bar has three distinct sections. Within 20 covered by sufficiently long base rod. Audit 11 VETTED."
    },
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame holds totals up to 20 naturally. Three counter-color groups (e.g., red + blue + yellow) all placed in the frames map directly to three addends. Critic Criterion 4: the kid taps three distinct color clusters — the three-addend structure is visible in the frame after commit. Associative regrouping emerges naturally because the kid often fills the first frame to 10 with two colors and the third color goes in the second frame (e.g., 6 + 4 + 3 fills first frame with 6 red and 4 blue, second frame with 3 yellow)."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Three rods snapped end-to-end into a train within length 20. Critic Criterion 4: the rod lengths are the three addends; the train length is the sum; the kid cannot avoid producing three distinct rod values. Order-irrelevance demonstrates the associative property structurally (2 + 6 + 4 = 6 + 2 + 4 = 2 + 4 + 6 — same train, different snap order)."
    },
    {
      "engineId": "stack-to-target",
      "rationale": "Pan/stack height is the sum of three block heights stacked. Critic Criterion 4: three distinct blocks stacked — the kid sees three addends as three visible block layers; the pan-height IS the sum within 20. Audit 11 VETTED. Particularly clean for the three-addend constraint because the stack has visible 'layers.'"
    }
  ],
  "secondary": [
    {
      "engineId": "free-collect",
      "rationale": "Three pre-defined cluster colors collected to a target; works for the result-sum but loses the discrete 'three numbers' visual unless scenarios pre-structure them."
    },
    {
      "engineId": "conveyor-belt",
      "rationale": "Tank fills from three different sources; continuous quantity is less ideal for grade 1 'objects and drawings' framing."
    },
    {
      "engineId": "shape-decomposer",
      "rationale": "Three-region area decomposition models three addends as three colored areas in a target shape; valid but defaults to area-as-sum framing (3.MD rather than 1.OA)."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "Strong coverage with four clean PRIMARY engines. The associative-property regrouping opportunity (2 + 6 + 4 → 2 + 10 = 12) is an emergent payoff of any of the PRIMARY engines but is named explicitly in 1.OA.B.3. Builder should design at least one round where two of the three addends naturally combine to a known sum (a ten, a double)."
}
```

---

## 1.OA.B.3

Apply the commutative and associative properties of addition (kids do NOT need formal terms).

```json
"1.OA.B.3": {
  "standardText": "Apply properties of operations as strategies to add and subtract. (Students need not use formal terms for these properties.) Examples: If 8 + 3 = 11 is known, then 3 + 8 = 11 is also known. (Commutative property of addition.) To add 2 + 6 + 4, the second two numbers can be added to make a ten, so 2 + 6 + 4 = 2 + 10 = 12. (Associative property of addition.)",
  "namedSkill": "Use the commutative property (order doesn't change the sum: 8 + 3 = 3 + 8) and the associative property (regrouping to make a ten or a known sum: 2 + 6 + 4 = 2 + 10 = 12) as addition strategies. Kids do this AS A STRATEGY, not by stating a property by name. The engine must show that rearranging or regrouping leaves the total unchanged.",
  "primary": [
    {
      "engineId": "cuisenaire-rods",
      "rationale": "The strongest engine for properties-of-operations because the rod length IS the count and rod-order is irrelevant. Commutative: a 3-rod + 8-rod and an 8-rod + 3-rod build trains of identical length — the kid sees the property by building both versions. Associative: 2 + 6 + 4 can be assembled as the 2-rod first then the 10-rod (built from the 6 + 4), or as three separate rods — same final length. Critic Criterion 4: the standard's verbatim example '8 + 3 = 11 is known, then 3 + 8 = 11 is also known' is enacted physically — two trains, same length. Audit 11 VETTED."
    },
    {
      "engineId": "bar-model",
      "rationale": "Side-by-side bars with addends in different orders visibly match in length — commutative property shown by alignment. Three-bar composition with the option to combine two adjacent bars into one (a + (b + c) vs (a + b) + c) demonstrates associative. Critic Criterion 4: the standard's example '2 + 6 + 4 = 2 + 10 = 12' is enacted when the kid combines the 6-bar and 4-bar into a single 10-bar then aligns it with the 2-bar — the recombination is the property."
    },
    {
      "engineId": "free-balance",
      "rationale": "Beam balances with rearranged addends: place 8 + 3 weights on left, 3 + 8 on right — beam remains level. Critic Criterion 4: the standard's clause 'If 8 + 3 = 11 is known, then 3 + 8 = 11 is also known' is shown by the beam's literal balance under reordering. Associative shown similarly: (2 + 6) + 4 on left, 2 + (6 + 4) on right — balanced. Beam physics IS the equality the property guarantees."
    }
  ],
  "secondary": [
    {
      "engineId": "number-frames",
      "rationale": "Ten-frame fills can be reordered (red counters then blue, or blue then red — same total) showing commutative; making-a-ten with three addends shows associative. Less structurally direct than cuisenaire-rods, where length IS invariant under order."
    },
    {
      "engineId": "free-collect",
      "rationale": "Collecting clusters in different orders reaches the same field-size — commutative is structural to the tap mechanic, but the engine doesn't visibly contrast 'a + b' with 'b + a' side-by-side."
    }
  ],
  "revisable": [
    {
      "engineId": "split-the-loot",
      "fix": "Lock total at known sum; show the kid that filling silo A with N items and silo B with M, vs filling A with M and B with N, gives the same total — explicit commutative demonstration. Currently the engine accepts any split; the fix is a scenario constraint (commit two splits with reversed values per round)."
    }
  ],
  "coverageGap": null,
  "notes": "Strong coverage. The standard explicitly says 'Students need not use formal terms for these properties' — Builders should NOT label the property by name in the game. The game shows the property by mechanic. CGI literature: Carpenter, Franke & Levi (2003) Thinking Mathematically — properties as relational understanding."
}
```

---

## 1.OA.B.4

Understand subtraction as an unknown-addend problem.

```json
"1.OA.B.4": {
  "standardText": "Understand subtraction as an unknown-addend problem. For example, subtract 10 – 8 by finding the number that makes 10 when added to 8.",
  "namedSkill": "Reframe subtraction (10 − 8) as the unknown-addend question 'What goes with 8 to make 10?' The kid finds the unknown by adding up from the smaller part, not by taking away. This is the conceptual bridge between addition and subtraction that 1.OA.C.6's 'relationship between addition and subtraction' strategy depends on.",
  "primary": [
    {
      "engineId": "free-balance",
      "rationale": "The reference engine for this standard. Beam pre-filled with the total (10) on one side and a known part (8) on the other; the kid adds weights to the partial side until the beam balances — the count they add IS the unknown addend (the answer to '10 − 8'). Critic Criterion 4: the standard's verbatim example 'subtract 10 – 8 by finding the number that makes 10 when added to 8' is enacted literally — the kid is finding the number that makes 10 when added to 8, by adding weight until balance. Audit 11 VETTED."
    },
    {
      "engineId": "bar-model",
      "rationale": "Two-bar setup: top bar = total (10); bottom bar shows one part (8) with a labeled empty section for the unknown. Kid extends the empty section with unit rods until bottom bar matches top bar — the rods placed ARE the unknown addend. Critic Criterion 4: the standard's clause 'finding the number that makes 10 when added to 8' is exactly the bar-completion action. Singapore CPA's part-whole-unknown is built for this standard."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Length-train completion: target length is the total (10); a known rod (8) placed at the start; kid selects the rod that completes the train (the 2-rod). Critic Criterion 4: the kid produces the unknown addend by selecting it from the bin and snapping it on, not by computing the difference. The selection IS the answer; the snap-into-place IS the proof."
    }
  ],
  "secondary": [
    {
      "engineId": "number-frames",
      "rationale": "Ten-frame pre-filled with 8 counters; kid taps empty cells until the frame is full — number of taps is the unknown addend. Works mechanically; SECONDARY because the framing is more commonly used for K.OA.A.4 partners-of-10 than for 1.OA.B.4's general unknown-addend pattern."
    },
    {
      "engineId": "mystery-side",
      "rationale": "True algebraic identity (remove same from both sides) — mathematically valid for 1.OA.B.4 but the 'remove from both sides' move is 6.EE territory and developmentally premature for grade 1. PRIMARY at 1.OA.D.7 and 1.OA.D.8 where the equation framing is the point."
    }
  ],
  "revisable": [
    {
      "engineId": "number-bonds",
      "fix": "Hide the auto-revealed third value (the unknown addend) until the kid commits a guess. With the fix, the engine becomes the canonical unknown-addend bond builder: whole shown, one part shown, kid produces the other. Same fix queued for K.OA.A.3, K.OA.A.4, 1.OA.A.1."
    },
    {
      "engineId": "split-the-loot",
      "fix": "Lock total at the minuend (e.g., 10), pre-fill one silo with the subtrahend (e.g., 8); kid fills the other silo until total is reached — the count they produced IS the difference, reframed as an unknown-addend. Same configuration logic as the K.OA.A.4 partners-of-10 use; no new engine change needed."
    }
  ],
  "coverageGap": null,
  "notes": "Three clean PRIMARY engines. This is the conceptual bridge standard — it's why the 'relationship between addition and subtraction' strategy works at 1.OA.C.6. The Chesure file §3 'B.4 — subtraction as unknown-addend' walks the Builder through why this reframe matters."
}
```

---

## 1.OA.C.5

Relate counting to addition and subtraction (e.g., counting on 2 to add 2).

```json
"1.OA.C.5": {
  "standardText": "Relate counting to addition and subtraction (e.g., by counting on 2 to add 2).",
  "namedSkill": "See addition as 'count forward from the bigger number' and subtraction as 'count back.' Specifically: to add 8 + 2, the kid says '8 ... 9, 10' (counting on 2), not '1, 2, 3, 4, 5, 6, 7, 8, 9, 10' (counting all). This is the Level-2 strategy in the K-5 OA Progression and the prerequisite for 1.OA.C.6's named strategies.",
  "primary": [
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Place the 'starting' rod (e.g., 8-rod) on the table; kid adds unit rods one at a time on the end — each new unit rod is the literal 'count on by one' move. Critic Criterion 4: the standard's verbatim example 'counting on 2 to add 2' is enacted physically — the 8-rod stays, the kid adds 2 unit rods, and the train length goes 8 → 9 → 10. Counting back enacted by removing unit rods from the end. The kid cannot recount the starting rod's units because the rod is a single physical piece — the 'don't start over from 1' discipline is structural."
    },
    {
      "engineId": "number-frames",
      "rationale": "PRIMARY conditional on the K.CC.A.2 'counting-on mode' fix already queued in the JSON map (`standard-mechanic-map.json`'s K.CC.A.2 entry, REVISABLE). With the fix: pre-fill first frame with N counters as a 'given start,' kid taps additional counters and the running count begins at N+1, not 1. Critic Criterion 4: the standard's 'count on by 2 to add 2' is the literal mechanic — count starts at N. Without the fix, the engine recounts from 1 and FAILS the standard's verbatim definition. MOVE FROM CONDITIONAL TO CLEAN PRIMARY ONCE THE COUNTING-ON FIX SHIPS."
    },
    {
      "engineId": "hundred-board",
      "rationale": "PRIMARY conditional on the Audit 11 §2 hundred-board trail fix PLUS a start-from-N variant (both already queued). With the fixes, the kid is placed at cell N (e.g., cell 8) and taps forward: cell 9, cell 10 — the trail glows the visited cells. Critic Criterion 4: the standard's 'counting on N to add N' is the literal cell-trail; counting back is the reverse trail. Within 20 covered by the first two rows of the 100 board. NOT PRIMARY UNTIL THE TRAIL FIX AND START-FROM-N VARIANT SHIP."
    }
  ],
  "secondary": [
    {
      "engineId": "bar-model",
      "rationale": "Bar extension by unit rods models counting on; works mechanically but doesn't enforce 'don't start over' the way cuisenaire-rods does (a kid could recount the starting bar's units)."
    },
    {
      "engineId": "free-collect",
      "rationale": "If the field is pre-stocked with N dots and the kid taps additional clusters with the running count beginning at N+1 (a Builder scenario choice), models counting on. Same engine flag as K.CC.A.2 PRIMARY conditional."
    }
  ],
  "revisable": [
    {
      "engineId": "number-frames",
      "fix": "Add 'counting-on' mode (already queued in K.CC.A.2 entry): pre-fill first frame with N counters as a given start; child taps additional counters and the count starts at N+1, not 1. Critical for 1.OA.C.5 to clean-PRIMARY."
    },
    {
      "engineId": "hundred-board",
      "fix": "Forward-counting-trail mechanic (kid taps cells in order; trail glows) PLUS start-from-N variant (kid begins at cell N rather than cell 1). Both queued in Audit 11 §2 and the K.CC.A.2 entry."
    }
  ],
  "coverageGap": "Only 1 clean PRIMARY (`cuisenaire-rods`). The other two PRIMARY engines depend on engine fixes that have already been queued in Audit 11 §2 and in the K.CC.A.2 JSON entry but have not shipped. Audit 11 §5 #2 names this as an open gap. Mechanic Inventor opportunity: a 'count-on number-line hop' engine where the kid taps the starting number and then taps each successive integer in order, with no option to recount from 1.",
  "notes": "1.OA.C.5 is the standard that depends most heavily on the K.CC.A.2 counting-on fixes. Cross-cluster cross-cutting concern. Bus-stop number line, hundred-board trail, and pre-stocked free-collect all need to ship for this standard to have robust coverage."
}
```

---

## 1.OA.C.6

Add and subtract within 20; fluency within 10; named strategies (counting on, making ten, decomposing leading to ten, add/sub relationship, equivalent sums).

```json
"1.OA.C.6": {
  "standardText": "Add and subtract within 20, demonstrating fluency for addition and subtraction within 10. Use strategies such as counting on; making ten (e.g., 8 + 6 = 8 + 2 + 4 = 10 + 4 = 14); decomposing a number leading to a ten (e.g., 13 – 4 = 13 – 3 – 1 = 10 – 1 = 9); using the relationship between addition and subtraction (e.g., knowing that 8 + 4 = 12, one knows 12 – 8 = 4); and creating equivalent but easier or known sums (e.g., adding 6 + 7 by creating the known equivalent 6 + 6 + 1 = 12 + 1 = 13).",
  "namedSkill": "Add and subtract within 20; fluent within 10. The standard names five strategies: (1) counting on, (2) making ten, (3) decomposing a number leading to a ten, (4) using the add/sub relationship, (5) creating equivalent or known sums (doubles plus/minus 1). Each PRIMARY engine should map to one or more of these named strategies. Per Baroody (2006), 'fluency' at grade 1 is efficient, not flashcard-fast — no timer.",
  "primary": [
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame is the canonical 'making-ten' representation in K-5 (Van de Walle 2018; Math Learning Center). For 8 + 6: kid fills first frame with 8, then adds 2 to complete the first frame (now 10), then drops 4 more in the second frame — visibly enacts the standard's verbatim example '8 + 6 = 8 + 2 + 4 = 10 + 4 = 14.' Critic Criterion 4: the standard's named 'making ten' strategy IS the engine's default mechanic, not a popup. Decomposing-leading-to-ten (13 − 4 = 13 − 3 − 1) shown by emptying the second frame to 0 then removing 1 from the now-full first frame."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Rod composition supports all five named strategies cleanly. Counting on: add unit rods to a starting rod. Making ten: swap a (6+4) pair for the 10-rod. Decomposing-leading-to-ten: break the 13-train into 10-rod + 3-rod before removing. Add/sub relationship: same train of 8 + 4 = 12 lets the kid see that removing the 8-rod leaves the 4-rod (the standard's example '8 + 4 = 12, one knows 12 – 8 = 4' is literal). Equivalent sums (doubles ± 1): swap the 7-rod for a 6-rod + 1-rod and see the train length unchanged. Critic Criterion 4: every named strategy is enacted by the engine's primitive moves (snap, swap, remove)."
    },
    {
      "engineId": "bar-model",
      "rationale": "Singapore CPA supports making-ten and decomposing-leading-to-ten via rod-swap inside the bar (replace a 6-rod with a 4-rod + 2-rod to enable the 8 + 2 making-ten move). The add/sub relationship strategy is shown by reading the same part-whole bar two ways (whole − one part = other part). Critic Criterion 4: the bar's rigid part-whole structure forces the kid to track all the regrouping moves visibly — no hidden computation."
    }
  ],
  "secondary": [
    {
      "engineId": "free-balance",
      "rationale": "Beam supports the add/sub relationship strategy (place 8 + 4 on left = 12 on right; remove 8 from left and the beam tilts by exactly 8, showing 12 − 8 = 4) and equivalent sums (swap a 7 for a 6 + 1, beam remains level). Less direct for making-ten than the ten-frame."
    },
    {
      "engineId": "free-collect",
      "rationale": "Tap-collect within 20; can support counting on and equivalent sums but not the specific making-ten visual that the ten-frame supplies."
    },
    {
      "engineId": "split-the-loot",
      "rationale": "Two-silo split with locked totals can model the add/sub relationship (total − part = other part) but defaults to single-decomposition rather than the multi-strategy practice this standard demands."
    },
    {
      "engineId": "stack-to-target",
      "rationale": "Pan height composition within 20; supports making-ten if Builder lays a visible '10' marker line on the pan. Less direct than ten-frame."
    }
  ],
  "revisable": [
    {
      "engineId": "number-bonds",
      "fix": "Hide the auto-revealed third value until the kid commits a guess. Supports add/sub relationship strategy (whole + one part shown, kid produces the missing part — same fix queued for K.OA.A.3, K.OA.A.4, 1.OA.A.1, 1.OA.B.4)."
    }
  ],
  "coverageGap": null,
  "notes": "Five named strategies, three PRIMARY engines covering all five collectively. Builder should design rounds that practice ≥3 of the five strategies. Critical: NO timer pressure at grade 1 — fluency at this stage is efficient strategy use, NOT flashcard speed (Baroody 2006; Boaler on math anxiety). The classic-overlay drill engines (snake-math, falling-blocks-math, etc.) remain HIDDEN even though they ostensibly cover 'add and subtract within 20' — they're timer-driven extrinsic-integration designs (Audit 11 §4)."
}
```

---

## 1.OA.D.7

Meaning of the equal sign; determine if equations are true or false.

```json
"1.OA.D.7": {
  "standardText": "Understand the meaning of the equal sign, and determine if equations involving addition and subtraction are true or false. For example, which of the following equations are true and which are false? 6 = 6, 7 = 8 – 1, 5 + 2 = 2 + 5, 4 + 1 = 5 + 2.",
  "namedSkill": "Understand '=' as a relation meaning 'the two sides are the same' — NOT as a command meaning 'compute the answer.' Judge equations as true or false across all four forms named in the example: identity (6 = 6), right-to-left (7 = 8 − 1), commutative (5 + 2 = 2 + 5), and non-canonical with operations on both sides (4 + 1 = 5 + 2). Engines that only show 'a + b = ?' (computation-prompt form) actively reinforce the operator-misconception (Behr et al. 1980; McNeil & Alibali 2005); they fail Construct Validity for this standard.",
  "primary": [
    {
      "engineId": "free-balance",
      "rationale": "Beam IS the literal equal sign. A beam in balance encodes the relational meaning of '=' — the two sides are the same weight. Place '5 + 2' on the left and '2 + 5' on the right: beam balances (true). Place '4 + 1' on the left and '5 + 2' on the right: beam tilts (false). Critic Criterion 4: the standard's verbatim example set ('5 + 2 = 2 + 5, 4 + 1 = 5 + 2') is enacted by the beam's tilt-or-balance state. No popup says 'true' or 'false' — the physics says it. The beam supports all four equation forms named in the standard (identity, right-to-left, commutative, both-sides-have-operations). Audit 11 VETTED. This is the canonical engine for 1.OA.D.7."
    },
    {
      "engineId": "mystery-side",
      "rationale": "The engine's core move is 'remove the same from both sides without changing the equality.' Critic Criterion 4: the standard's 'meaning of the equal sign' is operationalized by the engine's invariant — the equation stays true under symmetric operations, which IS the relational meaning of '='. Particularly strong for the both-sides-have-operations form (4 + 1 = 5 + 2): the kid simplifies both sides to 5 and 7, sees they don't match, marks false. Engine's algebra framing (6.EE) is technically above grade but the basic balance-preservation idea translates cleanly to grade 1 with whole-number-only configuration. Audit 11 VETTED."
    }
  ],
  "secondary": [
    {
      "engineId": "expression-transformer",
      "rationale": "Algebra-tile zero-pair cancellation shows that 5 + 2 and 2 + 5 are the same expression by reordering; that 5 + 0 = 5; that 5 − 5 = 0. Supports the relational meaning of '=' but the engine's default framing is 6.EE (combine like terms), not 1.OA. SECONDARY because re-skinning for grade 1 whole-numbers-only is a Builder-side scenario decision, not an engine fix."
    },
    {
      "engineId": "bar-model",
      "rationale": "Two bars of equal length encode '=' as 'same length' (a relational view). For 4 + 1 = 5 + 2: the kid builds two bars (one of length 5, one of length 7) and sees they don't match. Works but the engine's default is 'build the answer,' not 'judge whether two expressions match' — Builder must design the scenario to surface the true/false judgment."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Two trains of equal length show '='; reordering rods within a train (5 + 2 vs 2 + 5) keeps the length the same. Same caveat as bar-model — engine's default is composition, not equation-judgment."
    }
  ],
  "revisable": [],
  "coverageGap": "Only 2 clean PRIMARY engines (free-balance and mystery-side). Both rely on balance physics. The math-ed literature (Carpenter, Franke & Levi 2003) is unambiguous that 1.OA.D.7 is THE standard where the operator-misconception MUST be repaired — and current coverage is thin. MECHANIC INVENTOR OPPORTUNITY: a 'true/false equation card sorter' where equations in all four named forms (identity, right-to-left, commutative, both-sides-have-operations) are dragged into TRUE or FALSE bins, with bar-or-beam physics validating the answer. Engines that ONLY show 'a + b = ?' form must NOT be used for D.7 — they reinforce the misconception this standard exists to fix.",
  "notes": "1.OA.D.7 is the equal-sign relational-understanding standard. Per Carpenter, Franke & Levi (2003) and McNeil & Alibali (2005), engines that only show 'a + b = ?' (left-to-right computation-prompt form) actively reinforce the misconception that '=' means 'compute the answer.' For D.7, every PRIMARY engine MUST support equations in BOTH directions (5 = 2+3 AND 2+3 = 5) and the non-canonical 'both sides have operations' form (4+1 = 5+2). The free-balance and mystery-side engines do this structurally because their physics is symmetric."
}
```

---

## 1.OA.D.8

Determine the unknown whole number in an addition or subtraction equation.

```json
"1.OA.D.8": {
  "standardText": "Determine the unknown whole number in an addition or subtraction equation relating to three whole numbers. For example, determine the unknown number that makes the equation true in each of the equations 8 + ? = 11, 5 = � – 3, 6 + 6 = �.",
  "namedSkill": "Find the missing number in equations of the form a + ? = c, ? + b = c, a + b = ?, c − ? = b, c − a = ?, and ? − a = b — the unknown in any position. Within 20. The standard's examples deliberately include the right-to-left form (5 = ? − 3) to reinforce 1.OA.D.7's relational meaning of '='.",
  "primary": [
    {
      "engineId": "free-balance",
      "rationale": "Beam with one side known and a mystery weight to be determined. For '8 + ? = 11': pre-place 11 on the right side and 8 on the left; kid adds weights to the left until the beam balances — the weight they added IS the unknown. Critic Criterion 4: the standard's verbatim example '8 + ? = 11' is enacted exactly. Supports all unknown positions including the right-to-left form '5 = ? − 3' (place 5 on one side, place a mystery and remove 3 from the other side, balance reveals the mystery). Audit 11 VETTED. Strongest 1.OA.D.8 engine."
    },
    {
      "engineId": "bar-model",
      "rationale": "Part-whole bar with unknown section labeled. For '8 + ? = 11': total bar of length 11, known part of length 8, kid fills the empty section until the bar matches. Critic Criterion 4: the unknown is produced by physical bar-completion, not by reading a digit. Supports all six unknown positions named above through different part-whole configurations. Singapore CPA canonical."
    },
    {
      "engineId": "split-the-loot",
      "rationale": "Two Silos configured for the unknown-addend case: lock total at the known sum (e.g., 11), pre-fill one silo with the known addend (e.g., 8); kid drops items into the empty silo until total is reached — the count they produced IS the unknown. Critic Criterion 4: the standard's verbatim example '8 + ? = 11' is enacted by the silo-fill — kid counts each tap (no auto-counter), and the silo's final count is the answer. Already VETTED in Audit 11; configuration for this standard is locked-total + pre-filled silo, no engine change needed."
    }
  ],
  "secondary": [
    {
      "engineId": "mystery-side",
      "rationale": "True algebraic identity (remove same from both sides) finds the unknown by symmetric operations. Works for all forms but the algebra framing is 6.EE — developmentally premature for grade 1, where the equation should be a recording of a part-whole story, not an algebraic manipulation. PRIMARY for 1.OA.D.7 where the framing is the point."
    },
    {
      "engineId": "number-frames",
      "rationale": "Ten-frame pre-filled with known addend; kid taps empty cells until target count reached — same as K.OA.A.4 partners-of-10 but extended to within 20 (double ten-frame). Works mechanically; SECONDARY because the engine's default framing is K-grade (within 10)."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Train-completion with a missing rod; kid selects the rod from the bin. Strong mechanic but the engine doesn't surface 'equation' framing — the standard explicitly says 'in an addition or subtraction equation,' which is the bar-model's and free-balance's strength."
    }
  ],
  "revisable": [
    {
      "engineId": "number-bonds",
      "fix": "Hide the auto-revealed third value until the kid commits a guess. With the fix, number-bonds becomes a direct unknown-addend engine — whole shown, one part shown, kid produces the unknown. Same fix already queued for K.OA.A.3, K.OA.A.4, 1.OA.A.1, 1.OA.B.4."
    }
  ],
  "coverageGap": null,
  "notes": "Three clean PRIMARY engines. 1.OA.D.8 and 1.OA.B.4 are conceptually adjacent — both are unknown-addend; D.8 makes the equation framing explicit. The standard's example '5 = ? − 3' reinforces 1.OA.D.7's relational equal-sign meaning by putting the unknown on the right of '='. Builders should include the right-to-left example deliberately."
}
```
