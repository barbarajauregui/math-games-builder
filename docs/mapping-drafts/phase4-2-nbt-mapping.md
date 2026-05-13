# Phase 4.2 — Grade 2 Number & Operations in Base Ten (2.NBT) Standard-Mechanic Mapping Draft

*Date: 2026-05-11 · Drafter: Phase 4.2 mapping pass · Status: DRAFT — Barbara reviews before merge into `src/data/standard-mechanic-map.json`*

This draft maps all 11 grade-2 Number & Operations in Base Ten entries (the 9 named standards plus 2 sub-standards under 2.NBT.A.1) to the engine library. Same shape as the K.OA, K.NBT, and 1.NBT entries in `src/data/standard-mechanic-map.json`. Each entry names primary, secondary, and (where useful) revisable engines, with the rationale grounded in the standard's verbatim text, Audit 11's per-engine verdicts, and the 2.NBT pedagogy authority at `docs/agents/chesure-knowledge/2-nbt-progressions.md`.

---

## Review summary

### Per-standard PRIMARY count

| Standard | PRIMARY count | Clean floor? |
|---|---|---|
| 2.NBT.A.1 — three digits = hundreds, tens, ones | 3 | clean |
| 2.NBT.A.1a — 100 as a bundle of ten tens | 3 | clean |
| 2.NBT.A.1b — decade-of-hundreds = N hundreds | 3 | clean |
| 2.NBT.A.2 — count within 1000, skip-count by 5s/10s/100s | **2 clean + 1 conditional** | conditional on Fix 2 (`hundred-board`) |
| 2.NBT.A.3 — read/write to 1000 in 3 representations | 3 | clean |
| 2.NBT.A.4 — compare two three-digit numbers | 3 | clean |
| 2.NBT.B.5 — fluently add/subtract within 100 | 3 | clean |
| 2.NBT.B.6 — add up to four two-digit numbers | 3 | clean |
| 2.NBT.B.7 — add/subtract within 1000 with compose/decompose | 3 | clean |
| 2.NBT.B.8 — mentally ±10 or ±100 (100–900) | **1 clean + 2 conditional** | conditional on Fix 2 (hundred-board) + new "thousand-board" engine gap |
| 2.NBT.B.9 — explain why strategies work | **2 clean + 1 condition** | clean if recording-layer scenario is required by Builder UX |

**Of 11 standards: 8 hit a clean 3-PRIMARY floor today. 3 need engine fixes or design constraints.** 2.NBT.B.8 is the tightest — the engine library doesn't have a thousand-board (the canonical model for +100 patterns), so the +10 case relies on `hundred-board` behind Fix 2, and the +100 case relies on `place-value-discs` alone for clean PRIMARY today.

### Standards where clean 3-PRIMARY floor not hit (and why)

1. **2.NBT.A.2 (skip-counting / count within 1000)** — `bead-chain` and `cuisenaire-rods` are clean PRIMARY for skip-counting (bead-chain's marker-on-chain IS skip-counting; rod-trains physically do it). `hundred-board` is the canonical model for the within-1000 counting half and the +10 / +100 skip-count pattern but is REVISABLE until **Fix 2 (drag-and-place + row/column readout)** ships. Without Fix 2 the engine fails Audit 11's no-shortcut criterion (click-correct-cell). Same engine-fix dependency as carried over from 1.NBT.A.1 / B.3 / C.5.

2. **2.NBT.B.8 (mentally ±10, ±100)** — `place-value-discs` is the only clean PRIMARY today. `hundred-board` becomes PRIMARY for the ±10 case after Fix 2 (it doesn't natively support ±100 since the board tops out at 100). The ±100 case has no canonical model in the engine library — a "thousand-board" or "place-value-disc focused +100 pattern view" is a Mechanic Inventor opportunity. Both halves of 2.NBT.B.8 are above-floor with discs alone; the structural insight ("only the hundreds digit changes for +100") shows cleanly in discs but lacks the parallel-column visual punch of a board.

3. **2.NBT.B.9 (explain why)** — `place-value-discs`, `bar-model`, and `golden-beads` are all clean PRIMARY *only if the Builder's scenario layer includes an explanation-capture step* (the kid's action sequence becomes the recording; a peer character asks "why did that work?"; the kid drags labels onto each step). Without the explanation-capture scenario, all three engines are SECONDARY (they manipulate but don't elicit explanation). The standard explicitly names explanation as the skill — engines alone are not enough; the Builder's scenario carries half the load. Flagged as a "scenario-required" condition rather than an engine gap.

### Biggest judgment calls — plain English

1. **`hundred-board` blocks two 2.NBT standards' clean floors until Fix 2 ships.** Same dependency the 1.NBT phase flagged (1.NBT.A.1, B.3, C.5). At 2.NBT it blocks A.2 (skip-counting / count within 1000) and B.8 (mentally ±10). Both become clean PRIMARY when Fix 2 ships. I've labeled these "conditional PRIMARY" with the same convention the 1.NBT draft uses.

2. **`place-value-discs` is the workhorse of 2.NBT.** PRIMARY in all 11 standards. That's not padding — the cluster IS about hundreds, tens, and ones as physically separable units, and discs are the engine that physically separates them. The cross-standard reuse is structural, not stretched.

3. **`golden-beads` and `stamp-game` come into their own at 2.NBT.** Both were SECONDARY in K.NBT (range stops at 19), PRIMARY for some of 1.NBT (range 10–99), but only at 2.NBT do they cover their full design intent — hundreds in beads/stamps are visible and physically separable, and the bundling iteration to hundreds is exactly their pedagogical strength.

4. **`bar-model` returns PRIMARY for grade-2's addition/subtraction-heavy standards** (B.5, B.6, B.7, B.9). Singapore-bar canonically models part-part-whole within 100 and within 1000. SECONDARY for the place-value-comprehension standards (A.1, A.3, A.4) where columnar engines read more directly.

5. **`number-frames` shifts to SECONDARY for almost all 2.NBT.** It was PRIMARY at K and 1 for ten-frame composition, but at 2.NBT the range pushes beyond what ten-frames represent natively. It can support the within-20 inner loop of 2.NBT.B.5 strategies, but the columnar engines (`place-value-discs`, `golden-beads`, `stamp-game`) are the structural fit for the cluster.

6. **`cuisenaire-rods` PRIMARY only for the skip-counting / counting cases** (2.NBT.A.2). Rod trains literally enact "10, 20, 30" by laying down successive orange rods. For the three-digit place-value standards, the column engines beat length engines because the hundreds column needs to be visually distinct, and length on a single line doesn't separate columns clearly.

7. **2.NBT.A.1a (bundling-the-hundred) is the gate standard for the cluster — and the engines that work here all need the bundling animation explicitly configured.** `place-value-discs`, `golden-beads`, and `stamp-game` are all PRIMARY when the Builder configures a bundling round (kid places ten 10-discs, then taps "bundle these" to seal them into one 100-disc). Without that scenario, they're SECONDARY at A.1a (the bundle never happens; the kid just sees pre-made hundreds). Same conditional-PRIMARY pattern as 1.NBT.B.2a one level up.

8. **2.NBT.B.7 (compose/decompose) has the strongest engine library of any standard in the cluster.** All four columnar engines (`place-value-discs`, `golden-beads`, `stamp-game`, `bar-model`) work cleanly, AND they all support both directions (compose AND decompose) as kid-actions. This is the standard where Audit 11's existing engine inventory is most complete.

9. **2.NBT.B.9 is the trickiest standard pedagogically because explanation is the named skill, not manipulation.** The engines manipulate; explanation has to be elicited by the Builder's scenario layer (a peer asks "why does that work?"; the kid labels each step; or the action sequence itself is replayed as the explanation). Mr. Chesure flags any B.9 submission where the engine never asks the kid to produce a why.

### Standards that genuinely cannot reach 3 PRIMARY today

**None.** All 11 standards hit at least 3 PRIMARY (including conditionals) with the existing library. The two engine-fix dependencies (Fix 2 for hundred-board; a future thousand-board) would harden the conditional PRIMARYs into clean PRIMARYs and add depth to 2.NBT.A.2 and 2.NBT.B.8 specifically. The 2.NBT.B.9 "scenario-required" condition is a Builder UX requirement, not an engine gap.

**Mechanic Inventor opportunity flagged:** a "thousand-board" engine (0–1000 grid laid out as 10 hundred-charts in a column, OR as a single 100-row × 10-column grid) would be the canonical fit for 2.NBT.B.8's +100 pattern visualization. The Progressions p. 59 references this kind of layout. Not blocking — `place-value-discs` covers +100 cleanly today — but would add construct-validity sharpness.

### Cross-cutting dependencies on engine-fixes plan and new-engines list

| Fix / new engine | What it does | Standards conditional on it |
|---|---|---|
| **Fix 2 — `hundred-board` drag-and-place + row/column readout** (Audit 11 §2 item 15; carried from 1.NBT phase) | Replaces click-correct-cell with drag-and-place where neighbors highlight; surfaces the "down a row = +10" pattern explicitly. | 2.NBT.A.2 (skip-counting / count within 1000); 2.NBT.B.8 (the +10 case) |
| **NEW — thousand-board engine** (Mechanic Inventor candidate) | A 0–1000 grid surfacing the +100 column-jump pattern the same way hundred-board surfaces the +10 row-jump pattern. | 2.NBT.B.8 (the +100 case) — currently above-floor with discs alone, but would deepen construct validity. |
| **Scenario requirement at 2.NBT.B.9** (Builder UX, not engine code) | Builder's scenario must include an explanation-capture step (drag labels onto strategy steps, audio reflection, peer-character "why" prompt, or strategy replay). | 2.NBT.B.9 — three engines are PRIMARY *only* with this scenario layer. |

### Cross-standard engine reuse

| Engine | PRIMARY for | Reuse status |
|---|---|---|
| `place-value-discs` | A.1, A.1a, A.1b, A.2 (number-recording half), A.3, A.4, B.5, B.6, B.7, B.8, B.9 (with scenario) | **Clean.** The discs ARE the hundreds/tens/ones distinction the entire cluster is about; not padding. |
| `golden-beads` | A.1, A.1a (with bundling), A.1b, A.3, A.4, B.5, B.7, B.9 (with scenario) | **Clean.** Wrong-column rejection plus visible composition (bead-hundred = ten ten-bars) enforces both place value AND the bundling pedagogy. |
| `stamp-game` | A.1, A.1a (with bundling), A.1b, A.3, A.4, B.5, B.6, B.7 | **Clean.** Pictorial-abstract above golden beads; same column structure. |
| `bar-model` | B.5, B.6, B.7, B.9 (with scenario) | **Clean.** Singapore CPA canonical for the addition/subtraction standards. |
| `cuisenaire-rods` | A.2 | **Clean for the counting/skip-counting case.** |
| `bead-chain` | A.2 | **Clean.** Skip-counting marker-on-chain IS the standard. |
| `sorting-lane` | A.4 | **Clean** as a recording layer; kid compares with discs/beads first, records ordering. |
| `leaderboard-fix` | A.4 | **Clean** same as sorting-lane. |
| `hundred-board` (conditional on Fix 2) | A.2 (within 100; with start-from-N in scope at 2.NBT this is less critical), B.8 (the +10 case) | **Stretched until the fix lands.** Currently REVISABLE per Audit 11. |

---

## 2.NBT.A.1 — Three digits = hundreds, tens, and ones

Parent standard for the cluster. The kid must see any three-digit number 100–999 as some hundreds, some tens, and some ones. The standard's example (706 = 7 hundreds + 0 tens + 6 ones) is deliberate: the "0 tens" middle case is named so the kid sees the 0 as a count, not a decoration. Engines that physically separate the three columns are PRIMARY; engines that show numbers as a single magnitude are SECONDARY.

```json
"2.NBT.A.1": {
  "standardText": "Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones; e.g., 706 equals 7 hundreds, 0 tens, and 6 ones.",
  "namedSkill": "View any three-digit number 100–999 as some hundreds, some tens, and some ones. Each digit represents a count of its place-value unit. The 'three digits represent amounts' wording is load-bearing — the engine must physically separate the three amounts, not just display them. Critic Criterion 4: includes at least one round with a 0 in the middle position (the named 706 example).",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because the discs physically separate hundreds from tens from ones across three columns. Audit 11 VETTED: 'Total readout IS the truth.' Critic Criterion 4: place a 10-disc in the hundreds column and the engine rejects it — wrong-column rejection IS the standard's 'hundreds, tens, ones' clause enforced. The kid cannot win by ignoring place; the engine forces the structure. The 0-tens case (e.g., 706) is naturally surfaced — the kid places 7 hundred-discs and 6 ones-discs and the tens column stays visibly empty. Math Learning Center grade-2 canonical."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY because Audit 11 verdict is 'Wrong-column rejection enforces place value (3-digit).' Bead-hundred-squares (10 ten-bars side by side), ten-bars, and unit beads physically distinguish all three places. Critic Criterion 4: building 706 requires 7 hundred-squares + 0 ten-bars + 6 unit beads; the kid's hand has to use the right column. Montessori canonical for grade-2 place value."
    },
    {
      "engineId": "stamp-game",
      "rationale": "PRIMARY because Audit 11 VETTED for place value with thousands. Three-digit numbers are fully within stamp game's intended range. Pictorial-abstract level above golden beads — stamps for 1s, 10s, 100s, 1000s. Same column rejection structurally. Particularly well-suited to 2.NBT because the bridge from concrete (beads) to abstract (numeral) is what grade-2 kids need."
    }
  ],
  "secondary": [
    {
      "engineId": "bar-model",
      "rationale": "A three-part bar (hundreds + tens + ones) can model 463 as a long bar of 400 plus a medium bar of 60 plus a short bar of 3. CPA canonical, but bar-model's strongest fit is in the addition/subtraction standards (B.5, B.6, B.7). For the conceptual 'three digits represent amounts' standard, place-value-discs and beads are more direct because the column structure is intrinsic."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Length-composition with 100-flats (or 10 ten-rods side by side) + 10-rods + unit rods can model three-digit numbers but reads less directly than column-of-discs. SECONDARY here; PRIMARY for the counting/skip-counting standard 2.NBT.A.2."
    },
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame works to 20 only; doesn't scale to three-digit numbers without re-instantiating dozens of frames. SECONDARY only as a stepping-stone engine for kids still consolidating 1.NBT substrate."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "Parent standard for 2.NBT.A.1a (bundling-the-hundred) and 2.NBT.A.1b (decade-of-hundreds). Builders should be encouraged to use the cluster collectively. See §3.1 of `docs/agents/chesure-knowledge/2-nbt-progressions.md`."
}
```

---

## 2.NBT.A.1a — 100 as a bundle of ten tens, called "a hundred"

The narrowest, sharpest sub-standard of the cluster — and the gate standard for everything downstream. Mirrors 1.NBT.B.2a exactly, one level up. The bundling animation (10 ten-rods become 1 hundred-flat) IS the standard's named skill. Engines that show the bundling step explicitly are PRIMARY; engines where the hundred is pre-made are SECONDARY at this standard.

```json
"2.NBT.A.1a": {
  "standardText": "100 can be thought of as a bundle of ten tens — called a \"hundred.\"",
  "namedSkill": "Treat a group of 10 tens as a single new unit called 'a hundred.' The second bundling event — 10 tens become 1 hundred — is the load-bearing developmental move of the 2.NBT cluster, mirroring 1.NBT.B.2a one level up. Engines that pre-bundle the hundred without showing the kid's hand performing the bundle fail Construct Validity for 2.NBT.A.1a (they may still be PRIMARY for downstream 2.NBT cases where the hundred-bundle is assumed).",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "CONDITIONAL PRIMARY — strongest fit when the Builder configures a 'bundling round' where the kid places 10 ten-discs and the system replaces them with one 100-disc (the canonical bundling animation Math Learning Center uses for grade-2 place value, parallel to MLC's grade-1 ten-bundling). Audit 11 VETTED for place value generally. Critic Criterion 4: the bundling animation IS the standard's 'a bundle of ten tens, called a hundred' clause made physical. Without the bundling animation, the discs appear as red-green-blue from the start (Chesure §2 anti-pattern #1) — demote to SECONDARY in that case."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY because the bead-hundred-square IS visibly composed of ten ten-bars laid side by side — the Montessori material is engineered for exactly this standard's named skill. The kid can lay ten ten-bars next to a hundred-square and see they're the same. Critic Criterion 4: the equivalence is structural, not a popup. With a Builder scenario that explicitly requires the kid to compose ten 10-bars into one hundred-square (then break a hundred-square back into ten ten-bars in a later round), the standard's named bundling skill is the gameplay. Montessori canonical for the second bundling move."
    },
    {
      "engineId": "stamp-game",
      "rationale": "CONDITIONAL PRIMARY — strongest when the Builder configures a bundling round where the kid stamps ten 10s and then taps 'bundle these' to convert them into one 100-stamp. Like place-value-discs, the bundling animation has to be present. Audit 11 VETTED for place value; the pictorial-abstract level is well-suited to grade-2 kids who've already done the concrete bundling at K-1 with beads or rods. Without the bundling animation, demote to SECONDARY."
    }
  ],
  "secondary": [
    {
      "engineId": "bar-model",
      "rationale": "A 100-bar can be shown as visibly composed of 10 ten-segments. The bundling event is less crisp than with discs or beads (bars don't 'snap together' the same way), so SECONDARY. Works well as a recording layer paired with discs."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Ten 10-rods placed side by side equal a 100-square (or a 10×10 area). The kid can physically perform the equivalence. Listed SECONDARY rather than PRIMARY because cuisenaire rods don't have a native 'bundle these' affordance the way discs do — the kid sees the equivalence but doesn't perform a discrete bundling action. Strong for hands-on classroom; weaker as a digital engine for A.1a."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "Gate standard for the 2.NBT cluster — mirror of 1.NBT.B.2a one level up. Mr. Chesure's review is sharpest here: the bundling animation is the load-bearing pedagogical move. Engines that skip it (pre-made hundred-disc from round 1, pre-made hundred-square shown without composition view) fail Construct Validity even though they pass it for downstream standards. See §3.2 of `docs/agents/chesure-knowledge/2-nbt-progressions.md`."
}
```

---

## 2.NBT.A.1b — Decade-of-hundreds = N hundreds (0 tens, 0 ones)

The second special case of 2.NBT.A.1: when both tens AND ones counts are zero. 400 is four hundreds, no tens, no ones. The "(and 0 tens and 0 ones)" is part of the standard text — the two zeros are placeholders the kid must see.

```json
"2.NBT.A.1b": {
  "standardText": "The numbers 100, 200, 300, 400, 500, 600, 700, 800, 900 refer to one, two, three, four, five, six, seven, eight, or nine hundreds (and 0 tens and 0 ones).",
  "namedSkill": "See each of 100, 200, …, 900 as N hundreds with zero tens and zero ones. Parallel to 1.NBT.B.2c (decade numbers = N tens, 0 ones), one level up. The two trailing zeros must register as placeholders, not decoration.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because the kid places N hundred-discs in the hundreds column; the tens and ones columns stay visibly empty. Audit 11 VETTED. Critic Criterion 4: the recording writes 'N00' with the 0s in the tens and ones positions — the kid can see that the zeros mean 'zero tens, zero ones' because the columns ARE empty. Direct enactment of the standard's '(and 0 tens and 0 ones)' clause."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY because the kid places N hundred-squares in the hundreds tray; the tens and ones trays stay visibly empty. Audit 11 VETTED — wrong-column rejection enforces place value. Critic Criterion 4: the zeros in '400' correspond directly to empty trays, making the placeholder framing visible."
    },
    {
      "engineId": "stamp-game",
      "rationale": "PRIMARY because the kid stamps N 100-stamps in the hundreds column; tens and ones columns visibly empty. Same column rejection as golden beads. Pictorial-abstract level matches grade 2."
    }
  ],
  "secondary": [
    {
      "engineId": "bar-model",
      "rationale": "A single bar of length 400 (or four bars of 100) models the standard but doesn't surface the 'zero tens, zero ones' clause as crisply as columnar engines. SECONDARY."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "N hundred-flats (or N stacks of ten 10-rods) on a length line. Surfaces the multiples-of-100 structure but not the empty-columns placeholder framing. SECONDARY."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "Parallel to 1.NBT.B.2c one level up. The two-zeros-as-placeholders framing is the standard-specific Critic check. See §3.3 of `docs/agents/chesure-knowledge/2-nbt-progressions.md`."
}
```

---

## 2.NBT.A.2 — Count within 1000; skip-count by 5s, 10s, 100s

Extends 1.NBT.A.1 (count to 120) all the way to 1000, and adds the skip-counting half (by 5s, by 10s, by 100s). The skip-counting half sets up the equal-groups thinking that becomes 3.OA multiplication.

```json
"2.NBT.A.2": {
  "standardText": "Count within 1000; skip-count by 5s, 10s, and 100s.",
  "namedSkill": "Count by 1s up to 1000, and skip-count by 5s, 10s, and 100s. The skip-count step (5, 10, or 100) must be the kid's repeated action — each step is placing or saying one more group, not the engine reciting for them.",
  "primary": [
    {
      "engineId": "bead-chain",
      "rationale": "PRIMARY because Audit 11 VETTED for multiplication-as-skip-count — 'Marker on chain; readout shows N × groups.' The standard's named skip-counting skill IS the engine's primary action. Critic Criterion 4: the marker advances by the chosen group size (5, 10, or 100); the kid sees the skip-count emerge as a physical movement along the chain. CPA canonical for grade-2 skip-counting per Montessori."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "PRIMARY because skip-counting by 5s = laying down successive yellow rods; by 10s = laying down orange rods; by 100s = laying down hundred-flats. Length-IS-quantity (Audit 11 VETTED). Critic Criterion 4: each rod placement adds exactly its value to the train; the kid cannot fake the skip-count because the length-snap reveals miscounts."
    },
    {
      "engineId": "hundred-board",
      "rationale": "CONDITIONAL PRIMARY — requires Fix 2 (drag-and-place + row/column readout) per Audit 11 §2 item 15. With Fix 2, the kid drops markers in sequence — the 10-column layout makes the skip-count-by-10 pattern structurally visible (drop one row down each time). Skip-count by 5 traces a column-pair pattern; skip-count by 100 doesn't fit a single hundred-board (extends to thousand-board, a Mechanic Inventor candidate). Without Fix 2 the engine is REVISABLE (click-correct-cell shortcut). Becomes clean PRIMARY for the within-100 half once Fix 2 ships; the full within-1000 half awaits a thousand-board engine."
    }
  ],
  "secondary": [
    {
      "engineId": "place-value-discs",
      "rationale": "Counting up by placing discs (one disc per count for 1s; one 5-disc per skip for 5s; one 10-disc per skip for 10s; one 100-disc per skip for 100s). Surfaces the skip-count but doesn't visualize the sequence as a continuous count the way bead-chain or rod-trains do. SECONDARY because the standard names *counting* — a sequenced action — and discs read as separate placements rather than a continuous count."
    },
    {
      "engineId": "stamp-game",
      "rationale": "Same as place-value-discs reasoning — works for skip-count but doesn't visualize the sequence. SECONDARY."
    }
  ],
  "revisable": [
    {
      "engineId": "hundred-board",
      "fix": "Fix 2 — drag-and-place with row/column readout (Audit 11 §2 item 15) replaces the click-correct-cell shortcut. Once shipped, hundred-board is the canonical engine for skip-count-by-10 within 100. The within-1000 counting half awaits a thousand-board engine (Mechanic Inventor candidate). Listed in PRIMARY above as conditional."
    }
  ],
  "coverageGap": "No native thousand-board engine for the within-1000 / +100 skip-count visualizations. `bead-chain` and `cuisenaire-rods` cover the action; `place-value-discs` covers the recording. A thousand-board would deepen construct validity for the full standard range.",
  "notes": "2.NBT.A.2 has two halves (count to 1000; skip-count by 5/10/100). The PRIMARY engines cover skip-counting cleanly; the within-1000 counting half is well-served by bead-chain and rod-trains, with hundred-board adding canonical position-on-a-grid view after Fix 2. See §3.4 of `docs/agents/chesure-knowledge/2-nbt-progressions.md`."
}
```

---

## 2.NBT.A.3 — Read and write numbers to 1000 in three representations

The standard names three representations explicitly: base-ten numerals (563), number names ("five hundred sixty-three"), and expanded form (500 + 60 + 3). PRIMARY engines must surface at least two of the three (the third can live in the Builder's scenario layer). The "1006" misconception (writing what you hear) is the canonical failure mode.

```json
"2.NBT.A.3": {
  "standardText": "Read and write numbers to 1000 using base-ten numerals, number names, and expanded form.",
  "namedSkill": "Translate any number 0–1000 between three representations: numeral (563), number name ('five hundred sixty-three'), and expanded form (500 + 60 + 3). The kid must be able to start from any of the three and produce the other two. Critic Criterion 4: at least two representations must be surfaced in the engine; the 'one hundred six = 1006' misconception (Progressions p. 58) is the canonical failure to guard against.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because the discs in columns automatically write the numeral as a recording. Pair with an expanded-form recording panel (the kid places 5 hundred-discs and the panel writes '500'; places 6 ten-discs and the panel adds '+ 60'; places 3 ones-discs and the panel adds '+ 3'). Two representations surfaced natively (numeral + expanded form); the third (number name) comes from the Builder's audio scenario. Audit 11 VETTED. Critic Criterion 4: the '1006' misconception is structurally prevented — the kid cannot place 1 hundred + 0 + 0 + 6 because the columns enforce single-digit-per-column."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY because the bead arrangement (N hundred-squares + M ten-bars + P unit beads) directly produces both numeral and expanded form when paired with a recording panel. The Montessori 'large number cards' (layered place-value cards) are designed for exactly this standard — they make the expanded-form-to-numeral overlap visible. Audit 11 VETTED. The bundling visible in the bead-hundred-square also reinforces the structure."
    },
    {
      "engineId": "stamp-game",
      "rationale": "PRIMARY because stamps in three columns produce numeral + expanded form on a recording panel. Same reasoning as place-value-discs but at pictorial-abstract level — closer to the written numeral the standard names. Particularly strong for the 'write the numeral when you hear the name' direction because the stamp icons sit at the pictorial-abstract level the kid is moving toward."
    }
  ],
  "secondary": [
    {
      "engineId": "bar-model",
      "rationale": "A three-part bar can model the expanded form (400 + 60 + 3) and pair with a numeral readout. Works but doesn't surface number names natively. SECONDARY."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Rod trains can model the expanded form via length composition (4 hundred-flats + 6 ten-rods + 3 unit rods). Doesn't natively surface number names. SECONDARY — same range issue as A.1."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "The three-representation requirement is the standard-specific Critic check. PRIMARY engines surface numeral + expanded form natively; number name comes from Builder audio. Cover at least one number with a 0 in the middle position (the named 706 case from A.1). See §3.5 of `docs/agents/chesure-knowledge/2-nbt-progressions.md`."
}
```

---

## 2.NBT.A.4 — Compare two three-digit numbers

Extends 1.NBT.B.3 (compare two-digit by tens then ones) to three-digit by hundreds then tens then ones. The "based on meanings of the hundreds, tens, and ones digits" clause is load-bearing. Engines that compare by overall height or magnitude without surfacing the place-value reasoning miss the named skill.

```json
"2.NBT.A.4": {
  "standardText": "Compare two three-digit numbers based on meanings of the hundreds, tens, and ones digits, using >, =, and < symbols to record the results of comparisons.",
  "namedSkill": "Compare two three-digit numbers by hundreds first, then tens, then ones. Record with >, =, or <. Critic Criterion 4: the comparison must be structurally place-value-based (hundreds-first), not visual-height-based. Equal-hundreds and equal-hundreds-and-tens cases must be in scope.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because two parallel three-column workspaces let the kid see hundreds-tens-ones for both numbers side by side. Audit 11 VETTED. Critic Criterion 4: the comparison happens by counting hundreds-discs first (if different, that's the answer); if equal, drop to tens; if equal, drop to ones. The hundreds-first reasoning is the structural flow the kid is forced into."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY because two side-by-side bead trays make hundreds-vs-hundreds visually direct (and same for tens, ones). Audit 11 VETTED — wrong-column rejection enforces the place-value structure. Critic Criterion 4: the kid cannot win by overall-height comparison because the trays separate columns; the hundreds-bead-square comparison comes first naturally."
    },
    {
      "engineId": "stamp-game",
      "rationale": "PRIMARY for the same reason as place-value-discs — parallel three-column workspaces enforce hundreds-first comparison. Pictorial-abstract level matches grade-2."
    }
  ],
  "secondary": [
    {
      "engineId": "sorting-lane",
      "rationale": "Block-widths-show-value engine; supports ordering but the comparison happens by overall width, not by place-value reasoning. Works as a recording layer after the kid has compared with discs (drop the numerals into the sorting lane in order). Listed SECONDARY rather than PRIMARY because the standard's 'based on meanings of the digits' clause is invisible when comparing by width alone."
    },
    {
      "engineId": "leaderboard-fix",
      "rationale": "Swap-by-tap ordering — same construct as sorting-lane. Works as recording layer. SECONDARY for the same reason."
    },
    {
      "engineId": "bar-model",
      "rationale": "Two bars side by side; comparison by visible length. Same concern as sorting-lane — visual height instead of place-value reasoning. SECONDARY."
    }
  ],
  "revisable": [
    {
      "engineId": "number-line-drop",
      "fix": "Fix 10 — tighter snap zone + numerical readout of where the drop landed (Audit 11 §2 item 10) would make this engine viable as a SECONDARY recording layer (drop both numerals on a 0-1000 line, see relative positions). Even after the fix it's SECONDARY for A.4 because the comparison-by-position is magnitude, not place-value reasoning."
    }
  ],
  "coverageGap": null,
  "notes": "Mirror of 1.NBT.B.3 one level up. Same anti-pattern guards: do NOT use alligator-eating metaphors for >/< symbols (Progressions p. 56/58); use 'wide part is next to the larger number.' See §3.6 of `docs/agents/chesure-knowledge/2-nbt-progressions.md`."
}
```

---

## 2.NBT.B.5 — Fluently add and subtract within 100

First fluency standard in 2.NBT. Builds on 1.NBT.C.4 understanding. "Fluently" means accurate + efficient + flexible (Baroody 2006), NOT timed-speed. Engines that surface place-value strategies (decompose-and-recombine, add tens-then-ones, use the +/− relationship) are PRIMARY; pure fluency drill is anti-pattern.

```json
"2.NBT.B.5": {
  "standardText": "Fluently add and subtract within 100 using strategies based on place value, properties of operations, and/or the relationship between addition and subtraction.",
  "namedSkill": "Add and subtract any two numbers in 0–100, accurately, efficiently, and flexibly (Baroody 2006). The 'fluently' clause is fluency-with-understanding, not fluency-with-speed. The named strategies are place-value-based (decompose into tens and ones, work column by column), property-based (commutative/associative reorder), or relationship-based (use + to reason about −). Critic Criterion 4: no visible timer; multiple strategy paths allowed; subtraction with regrouping in scope.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because the discs make place-value strategies physical. Adding 47 + 28: place 4 ten-discs and 7 one-discs; place 2 ten-discs and 8 one-discs; combine — see 6 ten-discs and 15 one-discs; bundle 10 ones into a ten → 7 ten-discs and 5 one-discs = 75. The strategy IS the action sequence. Audit 11 VETTED. Critic Criterion 4: the regrouping is a kid action, not a system animation; the equation writes itself as a recording."
    },
    {
      "engineId": "bar-model",
      "rationale": "PRIMARY because Singapore CPA is canonical for part-part-whole within 100 (Audit 11 VETTED). The bar-model surfaces the relationship between addition and subtraction directly — the same diagram of two parts and a whole supports 47 + 28 = ? (find whole) AND 75 − 47 = ? (find part). Critic Criterion 4: the +/− relationship the standard explicitly names is built into the engine."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY because beads physically support place-value addition and subtraction with composing/decomposing tens. Audit 11 VETTED. Critic Criterion 4: 47 + 28 by combining bead-bars and units, then bundling 10 units into a ten — the named place-value strategy is the action."
    }
  ],
  "secondary": [
    {
      "engineId": "stamp-game",
      "rationale": "Stamps in two columns support place-value addition and subtraction at pictorial-abstract level. PRIMARY-adjacent — works very similarly to discs/beads. Listed SECONDARY here only because at grade-2 within-100 the discs/beads are the most concrete fit; stamps come into their PRIMARY at 2.NBT.B.6 / B.7 where the range extends into hundreds and the pictorial-abstract level is needed."
    },
    {
      "engineId": "number-frames",
      "rationale": "Useful for the within-20 inner loop of place-value strategies (7 + 8 inside 47 + 28 = ten-frame composition). SECONDARY because the engine doesn't natively scale to two-digit place value."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Rod-train length composition supports addition within 100. SECONDARY because the column structure isn't intrinsic — length is a single line, not parallel tens/ones."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "Mr. Chesure rejects any 2.NBT.B.5 game with a visible timer or 'beat the clock' framing (Chesure §2 anti-pattern #3). The standard's 'fluently' clause is fluency-with-understanding, per Baroody 2006. See §3.7 of `docs/agents/chesure-knowledge/2-nbt-progressions.md`."
}
```

---

## 2.NBT.B.6 — Add up to four two-digit numbers

Pushes the kid past two-addend addition into multi-addend. Exercises the commutative and associative properties as strategy tools (e.g., 23 + 47 + 17 = (23 + 17) + 47 = 40 + 47 = 87). Sets up 3.OA where these properties become formal.

```json
"2.NBT.B.6": {
  "standardText": "Add up to four two-digit numbers using strategies based on place value and properties of operations.",
  "namedSkill": "Add 2, 3, or 4 two-digit numbers in one problem. Use commutative and associative properties to reorder and regroup addends to make the computation easier. Compose tens when ones-digit sums exceed 10 (across multiple addends). Critic Criterion 4: at least one round with 4 addends; reordering or regrouping addends must be a physical action (drag, group), not a system suggestion.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because the discs let the kid place all addends concurrently (4 separate addend zones plus a combine area). The reorder is physical: drag addends together; group them by ones-sum-to-10. The compose-a-ten happens when the combined ones column hits 10+ and the kid bundles. Audit 11 VETTED. Critic Criterion 4: the commutative/associative property is enacted, not stated."
    },
    {
      "engineId": "stamp-game",
      "rationale": "PRIMARY because stamps in two columns (and four addend rows) support multi-addend addition at pictorial-abstract level. Same kid-action structure as place-value-discs. Audit 11 VETTED for place value."
    },
    {
      "engineId": "bar-model",
      "rationale": "PRIMARY because a multi-part bar (4 segments) physically encodes 4 addends summing to a whole. The kid can reorder the segments to find easy pairings (segments that sum to 10s). Singapore CPA canonical. Audit 11 VETTED."
    }
  ],
  "secondary": [
    {
      "engineId": "golden-beads",
      "rationale": "Beads support multi-addend addition with composing tens. PRIMARY-adjacent (works very similarly to discs/stamps) but slightly less natural for 4-addend rounds because the bead tray fills up. SECONDARY at this standard; PRIMARY at 2.NBT.B.5 and B.7."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Rod trains support multi-addend composition by length. SECONDARY — the column structure isn't intrinsic, and 4 addends in a single rod train reads as one long length, losing the per-addend structure."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "At least one round must use 4 addends; don't stay at 2 or 3. Compose-a-ten across multiple addends must be in scope (ones-digits summing to 10+ across 3-4 addends). See §3.8 of `docs/agents/chesure-knowledge/2-nbt-progressions.md`."
}
```

---

## 2.NBT.B.7 — Add and subtract within 1000 with compose/decompose

THE regrouping standard. The conceptual basis for "carrying" and "borrowing" — stated as composing/decomposing place-value units, NOT as algorithmic mnemonics. The compose-the-ten / compose-the-hundred / decompose-the-ten / decompose-the-hundred events must be visible kid actions, not system animations.

```json
"2.NBT.B.7": {
  "standardText": "Add and subtract within 1000, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method. Understand that in adding or subtracting three-digit numbers, one adds or subtracts hundreds and hundreds, tens and tens, ones and ones; and sometimes it is necessary to compose or decompose tens or hundreds.",
  "namedSkill": "Add and subtract within 1000 using concrete models and place-value strategies. Compose tens and hundreds when ones or tens overflow. Decompose tens and hundreds when subtracting requires more of a smaller unit. Relate the strategy to a written equation. Critic Criterion 4: composing AND decomposing must both be kid actions (not system animations); both directions covered; the written equation appears as a recording after action, not as a fill-in prompt.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because the discs support BOTH composing (10 ones → 1 ten; 10 tens → 1 hundred) AND decomposing (1 hundred → 10 tens; 1 ten → 10 ones) as discrete kid actions. Audit 11 VETTED. Critic Criterion 4 (the load-bearing criterion at B.7): the kid taps 'bundle these' to compose; taps 'unbundle this' to decompose; the engine confirms by replacing the discs. The compose/decompose event is BY the kid, not TO the kid (Chesure §2 anti-pattern #2 explicitly guarded). Reversible — the kid can re-bundle after unbundling and see the total quantity is preserved."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY because beads support both compose and decompose with the same wrong-column rejection as discs (Audit 11 VETTED). Critic Criterion 4: the kid trades 10 unit beads for 1 ten-bar (compose), or trades 1 ten-bar for 10 unit beads (decompose). The Montessori 'change game' is engineered for exactly this skill. Range covers 1000 with hundred-squares plus ten-bars plus units."
    },
    {
      "engineId": "stamp-game",
      "rationale": "PRIMARY because the stamp game supports composing and decomposing at pictorial-abstract level — particularly well-suited because the stamp icons sit at the pictorial-abstract level grade-2 kids are moving toward. Audit 11 VETTED for place value with thousands. Range covers 1000 fully."
    }
  ],
  "secondary": [
    {
      "engineId": "bar-model",
      "rationale": "Bar-model surfaces the relationship between addition and subtraction directly (same diagram supports both) — the standard explicitly names this relationship as a strategy. PRIMARY-adjacent at B.7; listed SECONDARY only because the compose/decompose-as-discrete-action is less crisp with bars than with discs/beads/stamps (bars don't 'bundle' the same way)."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Rod composition supports the addition half cleanly (lay down ten 10-rods, swap for a 100-flat). For decomposition the engine doesn't natively support unbundling a 100-flat back into ten 10-rods as a discrete action. SECONDARY."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "The compose AND decompose mandate is the load-bearing Critic check. Engines that auto-regroup (Chesure §2 anti-pattern #2) fail. Cover at least one no-regrouping case AND one regrouping case in each direction per scenario. See §3.9 of `docs/agents/chesure-knowledge/2-nbt-progressions.md`."
}
```

---

## 2.NBT.B.8 — Mentally add 10 or 100 to a number 100–900

Extends 1.NBT.C.5 (mentally ±10 within 100) to three-digit numbers AND adds ±100. The structural insight: +10 changes only the tens digit; +100 changes only the hundreds digit. Both pattern-recognition skills.

```json
"2.NBT.B.8": {
  "standardText": "Mentally add 10 or 100 to a given number 100–900, and mentally subtract 10 or 100 from a given number 100–900.",
  "namedSkill": "Given any three-digit number 100–900, immediately produce the result of +10, −10, +100, or −100 — without counting by ones. The structural pattern: +10 changes only the tens digit; +100 changes only the hundreds digit. Critic Criterion 4: 'only one column changes' must be visibly surfaced; cover all four directions (+10, −10, +100, −100); fade from visible-model to no-model only after the kid is fluent, with re-grounding when wrong.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because the structural insight is visible: add one 10-disc → only the tens column changes (the hundreds and ones columns are untouched). Add one 100-disc → only the hundreds column changes. Audit 11 VETTED. Critic Criterion 4: the 'ones and tens stay the same when you add 100' clause is structurally enforced by the engine — the kid sees that two columns didn't change. Only clean PRIMARY today for both halves of the standard."
    },
    {
      "engineId": "hundred-board",
      "rationale": "CONDITIONAL PRIMARY for the ±10 half only — requires Fix 2 (drag-and-place + row/column readout) per Audit 11 §2 item 15. With Fix 2, the kid drops a marker one row down for +10 — directly enacting 'one more ten; ones digit stays the same' (the standard's structural insight) because the column position is preserved. Without Fix 2 the engine is REVISABLE (click-correct-cell). The ±100 half is NOT covered by hundred-board (the board tops out at 100); awaits a thousand-board engine."
    },
    {
      "engineId": "stamp-game",
      "rationale": "CONDITIONAL PRIMARY — same structural reasoning as place-value-discs: stamp one more 10 (or 100) in the right column; the other columns are visibly unchanged. Audit 11 VETTED for place value with thousands. Critic Criterion 4 satisfied for both halves. Listed in PRIMARY but flagged conditional because the engine's primary design intent is broader place-value work; for B.8's pattern-recognition specifically the discs read more directly."
    }
  ],
  "secondary": [
    {
      "engineId": "golden-beads",
      "rationale": "Adding/subtracting bead-units mirrors place-value-discs but with more physical bulk for 100s (hundred-squares are larger). Works structurally; SECONDARY because discs are more direct for the pattern-recognition focus of B.8."
    },
    {
      "engineId": "bar-model",
      "rationale": "Can model 347 + 100 as a 347-bar with a 100-bar added. Doesn't surface the 'only one column changes' insight as crisply as columnar engines. SECONDARY."
    }
  ],
  "revisable": [
    {
      "engineId": "hundred-board",
      "fix": "Fix 2 — drag-and-place with row/column readout (Audit 11 §2 item 15). Once shipped, hundred-board becomes clean PRIMARY for the ±10 half of B.8. The ±100 half awaits a thousand-board engine (Mechanic Inventor candidate per Audit 11 §5). Listed in PRIMARY above as conditional."
    }
  ],
  "coverageGap": "No native thousand-board engine for the ±100 pattern visualization. `place-value-discs` covers the structural insight, but a 0-1000 grid (10 hundred-charts in a column, or a single 100-row × 10-column grid) would surface the +100 column-jump pattern the way hundred-board surfaces the +10 row-jump pattern. Mechanic Inventor candidate.",
  "notes": "Extends 1.NBT.C.5 one level up. Mr. Chesure rejects any +100-on-a-number-line game that doesn't highlight the hundreds-digit change (Chesure §2 anti-pattern #8). The 'fade to no-model after fluent' design pattern from 1.NBT.C.5 carries over. See §3.10 of `docs/agents/chesure-knowledge/2-nbt-progressions.md`."
}
```

---

## 2.NBT.B.9 — Explain why addition and subtraction strategies work

MP3 (construct viable arguments) inside 2.NBT. The named skill is *explanation*, not manipulation. Engines that don't capture an explanation are SECONDARY at this standard — the recording layer IS the load-bearing pedagogical move. Builder's scenario carries half the load.

```json
"2.NBT.B.9": {
  "standardText": "Explain why addition and subtraction strategies work, using place value and the properties of operations. (Explanations may be supported by drawings or objects.)",
  "namedSkill": "Produce an explanation of why a strategy works. The explanation references place value or properties of operations explicitly. Drawings, objects, or equations may support the explanation. The explanation IS the named skill; correct-answer-without-explanation does not satisfy the standard. Critic Criterion 4: the engine MUST capture an explanation (action-sequence replay, audio capture, drag-labels-onto-steps, or written equation chain); 'Done' should not advance the round without an explanation produced.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "CONDITIONAL PRIMARY — requires the Builder's scenario to include an explanation-capture step. With it, the kid's action sequence (the moves they made with discs) IS the explanation, and a peer-character or labeling step asks the kid to attach 'why' to each step ('I added 4 tens to 3 tens because tens combine with tens'). Audit 11 VETTED. Critic Criterion 4: with the explanation-capture scenario, the recording IS the explanation in the kid's own action sequence; without it, the engine is SECONDARY (manipulation only)."
    },
    {
      "engineId": "bar-model",
      "rationale": "CONDITIONAL PRIMARY — same condition. The bar-model surfaces the relationship between addition and subtraction visually (same diagram, two operations); pairing this with a labeling step where the kid attaches 'this works because the whole equals the sum of the parts, no matter what order' makes the explanation explicit. Audit 11 VETTED — Singapore CPA canonical. Without the labeling/replay step, SECONDARY."
    },
    {
      "engineId": "golden-beads",
      "rationale": "CONDITIONAL PRIMARY — same condition as discs. The kid's bead-tray manipulation sequence becomes the explanation when paired with a labeling step. Wrong-column rejection (Audit 11 VETTED) means the kid's actions are structurally tied to place-value reasoning, making the 'because tens combine with tens' explanation natural. Without the labeling step, SECONDARY."
    }
  ],
  "secondary": [
    {
      "engineId": "stamp-game",
      "rationale": "Same conditional structure as the three primaries — works as a recording layer if the Builder scenario includes explanation-capture. Listed SECONDARY here only because at this standard the most concrete engines (discs, beads) read more directly to the place-value explanation than the more abstract stamps."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Length-composition supports strategy enactment but doesn't natively pair with explanation-capture as cleanly as columnar engines. SECONDARY."
    }
  ],
  "revisable": [],
  "coverageGap": "The 'explanation-capture step' is a Builder UX requirement, not an engine gap. The Critic must flag any 2.NBT.B.9 submission where the engine never asks the kid to produce a why. A scenario template ('peer asks why,' 'drag the labels onto the steps,' 'narrate the strategy') would harden this — flagged as a Builder-side design pattern rather than an engine fix.",
  "notes": "The standard explicitly names explanation as the skill. Engines manipulate; explanation has to be elicited by the Builder's scenario layer. Mr. Chesure flags any B.9 submission where the engine never asks the kid to produce a why. See §3.11 of `docs/agents/chesure-knowledge/2-nbt-progressions.md`."
}
```

---

*End of draft. Barbara reviews; merged into `src/data/standard-mechanic-map.json` after sign-off.*
