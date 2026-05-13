# Phase 3.2 — Grade 1 Number & Operations in Base Ten (1.NBT) Standard-Mechanic Mapping Draft

*Date: 2026-05-11 · Drafter: Phase 3.2 mapping pass · Status: DRAFT — Barbara reviews before merge into `src/data/standard-mechanic-map.json`*

This draft maps all 9 grade-1 Number & Operations in Base Ten (1.NBT) standards to the engine library. Same shape as the existing K.OA and K.NBT entries in `src/data/standard-mechanic-map.json`. Each entry names primary, secondary, and (where useful) revisable engines, with the rationale that grounds each pick in the standard's verbatim text, Audit 11's per-engine verdicts, and the 1.NBT pedagogy authority at `docs/agents/chesure-knowledge/1-nbt-progressions.md`.

---

## Review summary

### Per-standard PRIMARY count

| Standard | PRIMARY count | Clean floor? |
|---|---|---|
| 1.NBT.A.1 — count to 120 and read/write numerals | **2 clean + 1 conditional** | conditional on Fix 2 (`hundred-board` drag-and-place) |
| 1.NBT.B.2 — two-digit number = tens and ones | 3 | clean |
| 1.NBT.B.2a — 10 as a bundle of ten ones | 3 | clean |
| 1.NBT.B.2b — teens = a ten and 1–9 ones | 3 | clean |
| 1.NBT.B.2c — 10/20/.../90 = N tens | 3 | clean |
| 1.NBT.B.3 — compare two two-digit numbers by tens then ones | **2 clean + 1 conditional** | conditional on Fix 2 (`hundred-board`) |
| 1.NBT.C.4 — add within 100 (two-digit + one-digit; two-digit + multiple of 10) | 3 | clean |
| 1.NBT.C.5 — mentally find 10 more or 10 less | **1 clean + 2 conditional** | conditional on Fix 2 (`hundred-board`) for both; only `place-value-discs` clears clean PRIMARY today |
| 1.NBT.C.6 — subtract multiples of 10 from multiples of 10 | 3 | clean |

**Of 9 standards: 6 hit a clean 3-PRIMARY floor today. 3 need conditional engines.** 1.NBT.C.5 is the tightest — the engine library doesn't yet have a strong "ones-digit stays the same" representation outside of the hundred-board pattern (which is the canonical model named in the Progressions but lives behind the Fix 2 dependency).

### Biggest judgment calls — plain English

1. **`hundred-board` is the natural fit for 1.NBT.A.1, 1.NBT.B.3, and 1.NBT.C.5 — but it currently fails Audit 11's "no shortcut" criterion** because the kid wins by clicking the right cell, not by reasoning about rows of ten. Audit 11 calls this REVISABLE, with the fix being drag-and-place plus a row/column readout (and, to extend it for 1.NBT.A.1's "count to 120 starting at any number," the ability to start the count-trail at any tile rather than always at 1). I've called these "**Fix 2 (hundred-board drag-and-place / count-trail)**" and "**Fix 3 (start-from-N)**" throughout the rationale and flagged the affected PRIMARYs as **conditional**. They become clean PRIMARYs once the engine fix ships.

2. **`place-value-discs` is the workhorse of the 1.NBT cluster** — it appears as PRIMARY in 8 of the 9 standards (every one except possibly 1.NBT.A.1, where it can support the numeral-writing half but not the recitation-count half). That's not stretching — it's a structural fit: the standard cluster IS about the tens/ones structure of two-digit numbers, and place-value-discs make tens-as-units and ones-as-units physically separable. The cross-standard reuse is clean, not padding.

3. **`number-frames` (double ten-frame) PRIMARY only for 1.NBT.B.2a and 1.NBT.B.2b.** It does the bundling-ten move beautifully (10 ones fill the first frame, then the bundle seals — the very animation 1.NBT.B.2a names). It does NOT extend cleanly to 50, 60, 70, etc. (1.NBT.B.2c) without re-instantiating multiple ten-frames, which the engine doesn't do natively. SECONDARY for 1.NBT.B.2 / 1.NBT.C.4 where the teen-range cases are in scope but the full two-digit case is not.

4. **`cuisenaire-rods` is PRIMARY for the bundling-as-length representation** (1.NBT.B.2a, B.2c, C.4, C.6) — a 10-rod is visibly the length of ten unit rods, which is exactly the "bundle of ten ones" the standard names. For 1.NBT.C.5 it's SECONDARY only because the "ones digit stays the same" framing isn't intrinsic to length on a rod train.

5. **`bar-model` returns to PRIMARY at 1.NBT and 2.NBT,** as flagged in the K.NBT and K.OA mappings — vocabulary scaffolding has caught up by grade 1 (Audit 14 EL concern was K-specific). Listed PRIMARY for 1.NBT.C.4 and 1.NBT.C.6 (the add/subtract standards where Singapore-style two-part bars model "47 + 30" or "70 - 40" canonically).

6. **`golden-beads` and `stamp-game` come into PRIMARY at 1.NBT** (they were correctly NOT used at K.NBT because the K range stops at 19). For 1.NBT they're well in range — golden beads cover 1s, 10s, 100s columns; stamp-game covers thousands. The "wrong-column rejection enforces place value" verdict from Audit 11 is exactly what the 1.NBT standards demand.

7. **The "mental math" wording of 1.NBT.C.5 collides with our engine library's CPA bias.** The Progressions explicitly say "mentally find 10 more or 10 less, without having to count." Our engines, by design, make the math visible. The honest read is that 1.NBT.C.5 is a *fluency* standard built on top of 1.NBT.B.2 understanding — and our engines are PRIMARY for the *understanding* substrate. A future "10-more/10-less hundred-board flash" engine (Mechanic Inventor candidate) would be a closer construct-validity fit. Flagged as a coverage gap on this standard.

### Cross-cutting dependencies on the engine-fixes plan

| Fix | What it does | Standards conditional on it |
|---|---|---|
| **Fix 2 — `hundred-board` drag-and-place + row/column readout** | Replaces click-correct-cell with drag-and-place where neighbors highlight; surfaces the "down a row = +10" pattern explicitly. From Audit 11 §2 item 15. | 1.NBT.A.1 (sequence-of-numerals view), 1.NBT.B.3 (compare via position), 1.NBT.C.5 (the +10/-10 row jump) |
| **Fix 3 — `hundred-board` start-from-N (count-trail can begin at any tile)** | Lets a kid count out a sequence starting from any tile, not just 1. Required for the "starting at any number less than 120" half of 1.NBT.A.1's verbatim text. | 1.NBT.A.1 |

If neither fix ships, the 1.NBT.C.5 standard drops below the 3-PRIMARY floor (only `place-value-discs` cleanly PRIMARY). 1.NBT.A.1 and 1.NBT.B.3 stay above-floor without the fixes but with weaker construct fit on the sequence-position aspects.

### Cross-standard engine reuse

| Engine | PRIMARY for | Reuse status |
|---|---|---|
| `place-value-discs` | 1.NBT.B.2, B.2a, B.2b, B.2c, B.3, C.4, C.5, C.6 (8 standards) | **Clean.** The discs ARE the tens/ones distinction the entire cluster is about; not padding. |
| `golden-beads` | 1.NBT.B.2, B.2b, B.2c, B.3, C.4, C.5, C.6 (7 standards) | **Clean.** Wrong-column rejection enforces place value across every two-digit case. |
| `cuisenaire-rods` | 1.NBT.B.2a, B.2c, C.4, C.6 (4 standards) | **Clean.** Length-IS-quantity composition; particularly clean for the bundling-of-ten cases. |
| `bar-model` | 1.NBT.C.4, C.6 (2 standards) | **Clean.** Singapore CPA canonical for the addition/subtraction standards. |
| `stamp-game` | 1.NBT.B.2, B.2c, C.4, C.6 (4 standards) | **Clean.** Same construct as golden beads, narrower-range pedagogy. |
| `number-frames` | 1.NBT.B.2a, B.2b (2 standards) | **Clean.** Specifically the teen-range and bundle-ten cases; not stretched beyond. |
| `hundred-board` (conditional on Fix 2/3) | 1.NBT.A.1, B.3, C.5 (3 standards) | **Stretched until the fix lands.** Without Fix 2 the engine is REVISABLE per Audit 11 — currently click-correct-cell. |

---

## 1.NBT.A.1 — Count to 120 and read/write numerals

Two halves: (1) **recite to 120 starting from any number under 120** (a counting/sequence skill, kin to K.CC.A.1); (2) **read and write numerals to 120, including representing object counts with the numeral** (a numeral-quantity pairing skill, kin to K.CC.A.3). The Progressions explicitly call out the "1006 for 'one hundred six'" error as the central misconception — the kid wants to write what they hear. Engines have to support both halves, or two engines together do.

```json
"1.NBT.A.1": {
  "standardText": "Count to 120, starting at any number less than 120. In this range, read and write numerals and represent a number of objects with a written numeral.",
  "namedSkill": "Recite the count sequence 1–120 starting from any number under 120; read and write any numeral in 1–120; given a group of objects, produce the numeral that names its count. Two halves: a recitation/sequence skill and a numeral-writing skill. The 'starting at any number' clause is the new move beyond K.CC.A.1.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY for the numeral-writing half of the standard. The kid places one 10-disc and three 1-discs (or seven 10-discs and two 1-discs, etc.) and the total readout writes the numeral 13 (or 72) on a chalkboard as a recording — Audit 11 verdict 'Total readout IS the truth.' Critic Criterion 4 (Construct Validity): the discs in the tens column physically can only be tens, so the kid cannot write '1006' for 'one hundred six' — the place-value column structure prevents the digit-stacking error the Progressions explicitly name. Does NOT cover the recitation half of the standard; pair with a sequence engine for full coverage."
    },
    {
      "engineId": "hundred-board",
      "rationale": "CONDITIONAL PRIMARY — requires Fix 2 (drag-and-place + row/column readout) AND Fix 3 (count-trail can start at any tile 1–119) per Audit 11 §2 item 15 and the engine-fixes plan. With Fix 3, the kid drops a counter onto tile 47 and then walks forward to 120 — directly enacting the 'starting at any number less than 120' clause from the standard's verbatim text. The 10-column layout makes the base-ten pattern visible (column-of-9s line up, ones increase by 1 from 91 to 99 — exactly the Progressions sidebar example p. 56). Without Fix 2 the engine is currently REVISABLE (click-correct-cell shortcut); without Fix 3 it cannot start from N. Becomes clean PRIMARY when both fixes ship."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "PRIMARY for the numeral-as-count half of the standard (object-count to numeral). The kid composes a target two-digit length from 10-rods + unit rods (e.g., 47 = four 10-rods + seven unit rods) and the numeral 47 writes itself as a recording. Length IS the count (Audit 11 VETTED). Critic Criterion 4: the kid cannot fake the count by piling unit rods — the length-snap on the target reveals any miscount. Coverage is partial — supports the 'represent a number of objects with a written numeral' clause but not the 'count to 120 starting at any number' clause."
    }
  ],
  "secondary": [
    {
      "engineId": "free-collect",
      "rationale": "Tap-collect cardinality engine; supports the numeral-as-count half within reasonable ranges (≤50 stays manageable as a tap-field; 120 strains the screen). PRIMARY for K.CC.B.4 cardinality; at 1.NBT.A.1 it's SECONDARY because it doesn't surface the base-ten sequence structure — 47 dots is just 47, not 'four tens and seven ones.' Use for short ranges with a Builder-set scenario."
    },
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame works for cardinality up to 20; doesn't scale to 120. Use as a stepping-stone engine for kids still consolidating the K.NBT.A.1 substrate before tackling the full 1.NBT.A.1 range."
    },
    {
      "engineId": "golden-beads",
      "rationale": "Place-value beads (units / tens / hundreds) cover the numeral-writing half of 1.NBT.A.1 with the same Critic Criterion 4 protection as place-value-discs. Listed SECONDARY only because 1.NBT.A.1's range tops out at 120 — the hundreds column is barely used (one or two hundred-flats max). Golden beads come into their own at 2.NBT and 3.NBT where the hundreds column carries the work."
    }
  ],
  "revisable": [
    {
      "engineId": "hundred-board",
      "fix": "Two fixes needed: (1) Fix 2 — drag-and-place with row/column readout (Audit 11 §2 item 15) replaces the click-correct-cell shortcut; (2) Fix 3 — count-trail must be able to start at any tile 1–119 to support the 'starting at any number less than 120' clause from the standard's verbatim text. Once both ship, hundred-board is the strongest construct-validity engine for 1.NBT.A.1 because it makes the full 1–120 sequence structurally visible. Listed in PRIMARY above as conditional."
    }
  ],
  "coverageGap": "No clean PRIMARY today for the 'count starting at any number less than 120' clause; depends on Fix 3 shipping. `hundred-board` is the right engine; the fix is in the build queue.",
  "notes": "1.NBT.A.1 has two halves that few single engines satisfy together. The split between (recitation/sequence) and (numeral-writing) is structural; treat as two parallel skill-streams within one standard. See §3.1 of `docs/agents/chesure-knowledge/1-nbt-progressions.md`."
}
```

---

## 1.NBT.B.2 — Two-digit number = some tens + some ones

The parent standard for the cluster's central move: a two-digit number IS some tens and some ones. The three sub-standards (B.2a, B.2b, B.2c) each carve out a special case. 1.NBT.B.2 itself is the general case — the kid must see ANY two-digit number 10–99 as tens-and-ones.

```json
"1.NBT.B.2": {
  "standardText": "Understand that the two digits of a two-digit number represent amounts of tens and ones.",
  "namedSkill": "View any two-digit number 10–99 as some tens and some ones. The tens digit represents a count of tens; the ones digit represents a count of ones. The 'two digits represent amounts' wording is load-bearing — the engine must physically separate the two amounts, not just display them.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because the discs physically separate tens from ones into columns. Audit 11 VETTED: 'Total readout IS the truth.' Critic Criterion 4: place a 10-disc in the ones column and the engine rejects it — the wrong-column rejection IS the standard's 'tens and ones' clause enforced. The kid cannot win by ignoring place; the engine forces the structure. Canonical for 1.NBT.B.2 per the K-5 NBT Progression (p. 56, 'saying 67 as 6 tens, 7 ones')."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY because Audit 11 verdict is 'Wrong-column rejection enforces place value.' Montessori golden beads physically distinguish unit cubes (1s), ten-bars (10s) — and a ten-bar IS visibly composed of ten unit beads, preserving the K.NBT.A.1 substrate (Chesure §3.3 anti-pattern: don't collapse ten into an opaque atom; golden beads do not). Critic Criterion 4 holds: trying to build 47 with seven 10-bars and four units yields a tower of length 74, not 47 — the kid's hand has to use the right column."
    },
    {
      "engineId": "stamp-game",
      "rationale": "PRIMARY for two-digit place value as the next step beyond golden beads. Stamps are pictorial-abstract (the unit and ten are stamps rather than physical beads), pairing well with the standard's 'amounts of tens and ones' phrasing. Audit 11 VETTED for place value with thousands; 1.NBT.B.2 is fully within its range (uses only ones and tens columns)."
    }
  ],
  "secondary": [
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Length-composition with 10-rods + unit rods models any two-digit number (e.g., 47 = four 10-rods + seven unit rods). Listed SECONDARY rather than PRIMARY because length-as-quantity reads less directly than column-of-discs for two-digit places — the kid sees a long train rather than two clearly-separated columns. Strong for K.NBT.A.1's teen range; at 1.NBT.B.2 the full 10–99 range is better served by column-structured engines."
    },
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame works for the teen sub-case (1.NBT.B.2b) but doesn't scale to multi-column two-digit numbers like 47 without re-instantiating multiple ten-frames. SECONDARY for the cluster parent; PRIMARY only for the teen-specific 1.NBT.B.2b."
    },
    {
      "engineId": "bar-model",
      "rationale": "A two-part bar (tens portion + ones portion) can model 47 as a long bar of 40 plus a short bar of 7. CPA canonical, but bar-model's strongest fit is in the addition and subtraction standards (1.NBT.C.4 / C.6). For the conceptual 'two digits represent amounts' standard, place-value-discs and beads are more direct."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "1.NBT.B.2 is the parent of three sub-standards (B.2a, B.2b, B.2c). The PRIMARY engines listed here cover the general case (any two-digit number); see the sub-standard entries for sharper fits where one part of the range is in focus. See §3.2 of `docs/agents/chesure-knowledge/1-nbt-progressions.md`."
}
```

---

## 1.NBT.B.2a — 10 as a bundle of ten ones, called "a ten"

The narrowest, sharpest sub-standard. This is THE central developmental move. The kid sees 10 ones bundled together and starts treating that bundle as one new thing — "a ten." Per the Chesure §1 hinge analysis, the bundling animation IS the standard's named skill. Engines that show the bundling step explicitly are PRIMARY; engines where the ten is pre-bundled (and shows up as a red disc without the kid ever seeing ten ones become one ten) are SECONDARY at this standard.

```json
"1.NBT.B.2a": {
  "standardText": "10 can be thought of as a bundle of ten ones — called a \"ten.\"",
  "namedSkill": "Treat a group of 10 ones as a single new unit called 'a ten.' The bundling step — 10 separate ones become 1 ten — is the load-bearing developmental move. Engines that pre-bundle the ten without showing the kid's hand performing the bundle fail Construct Validity for 1.NBT.B.2a (they may still be PRIMARY for the downstream B.2 cases where the bundling step is assumed).",
  "primary": [
    {
      "engineId": "number-frames",
      "rationale": "PRIMARY because the double ten-frame literally enacts the bundling step the standard names. Round 1: the kid drags ones into the first ten-frame, one by one. When the 10th counter lands, the frame visibly seals (animation: outline glows, chime, the ten counters become a single 'TEN!' badge). The kid has just performed the bundle. Critic Criterion 4 (Construct Validity): the bundling animation IS the standard's named clause made physical — 'a bundle of ten ones, called a ten' is exactly what the kid sees. Math Learning Center canonical; the bundling animation is the central pedagogical move in MLC's Grade 1 unit on place value."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "PRIMARY because the 10-rod IS visibly the length of ten unit rods — and Cuisenaire pedagogy explicitly trains the kid to substitute ten unit rods for one 10-rod (the equivalence move). The kid can physically lay ten unit rods alongside the orange 10-rod and see they're the same length. Critic Criterion 4: the equivalence is structural, not a popup — length-IS-quantity (Audit 11 VETTED). Pair with Builder-side scenario where the substitution is the win condition (e.g., 'Maya wants to trade ten pennies for one dime'); the trade IS the bundle."
    },
    {
      "engineId": "place-value-discs",
      "rationale": "CONDITIONAL PRIMARY — strongest fit when the Builder configures a 'bundling round' where the kid places 10 unit-discs and the system replaces them with one 10-disc (the canonical bundling animation Math Learning Center uses for grade-1 place value). Audit 11 VETTED for place value generally; for 1.NBT.B.2a specifically the bundling animation must be present, or the discs appear as red-and-blue from the start (Chesure §2 anti-pattern: pre-bundled-ten with no decomposition view). With the bundling animation, place-value-discs is PRIMARY because the bundle event is right there on screen. Without it, demote to SECONDARY."
    }
  ],
  "secondary": [
    {
      "engineId": "golden-beads",
      "rationale": "Golden bead ten-bars ARE visibly composed of ten unit beads (the bar shows ten distinct round beads). At 1.NBT.B.2a the kid can lay ten unit beads alongside a ten-bar and see the correspondence — same construct as cuisenaire-rods. Listed SECONDARY only because the bead-bar comes pre-made; the kid sees the equivalence but does not perform the bundling action (no animation of ten ones becoming one ten). Solid for B.2b and B.2c where the bundling is assumed; weaker for B.2a's bundling-as-the-skill clause."
    },
    {
      "engineId": "stamp-game",
      "rationale": "Stamps for units and tens; the kid stamps ten 1s or one 10. The pictorial-abstract level matches grade 1 but does NOT include the bundling animation — the kid stamps a '10' that comes ready-made. SECONDARY for 1.NBT.B.2a because the bundling step is invisible; PRIMARY for the broader B.2 cluster where the bundling is assumed."
    },
    {
      "engineId": "free-collect",
      "rationale": "Tap-collect to grow a field of 10 dots; with Builder-scenario design the field can visibly group at 10 (the ten dots compress into a single shape labeled '10'). Without that scenario, free-collect is K.CC.B.5 cardinality, not the bundling move. Listed SECONDARY for scenarios where the bundling is built into the win condition."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "1.NBT.B.2a is the narrowest, sharpest standard in the cluster — and Mr. Chesure's review is sharpest here. The bundling animation is the load-bearing pedagogical move; engines that skip it (red-disc-from-start, pre-made 10-bar) fail Construct Validity even though they pass it for downstream standards. See §3.3 of `docs/agents/chesure-knowledge/1-nbt-progressions.md`."
}
```

---

## 1.NBT.B.2b — Teen numbers = a ten and 1–9 ones

The 1.NBT version of K.NBT.A.1 — but now the ten is treated as a UNIT (the bundled-ten), not as ten individual ones. The teen-range engines from K.NBT carry over; what changes is the conceptual framing.

```json
"1.NBT.B.2b": {
  "standardText": "The numbers from 11 to 19 are composed of a ten and one, two, three, four, five, six, seven, eight, or nine ones.",
  "namedSkill": "See a teen number 11–19 as 'a ten' (singular unit) plus 1–9 ones. The 1.NBT version of K.NBT.A.1 — same range, but the ten has become a bundled unit rather than ten separate ones. The kid composes/decomposes treating the ten as one thing.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because one 10-disc + N unit-discs IS the standard's 'a ten and N ones' made physical at the 1.NBT abstraction level. Discs naturally treat the 10 as a single unit (one disc labeled '10'). Audit 11 VETTED — 'Total readout IS the truth.' Critic Criterion 4: the kid places a 10-disc in the tens column and N discs in the ones column; the engine rejects mis-column placement. The K → 1 bridge IS this engine — at K it previews bundled-ten without enforcing the abstraction; at 1.NBT.B.2b it IS the abstraction."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY because a Montessori ten-bar paired with N unit beads physically encodes 'a ten and N ones' — and unlike at K.NBT, the kid is now expected to treat the ten-bar as one unit (not constantly decompose it into ten beads). Wrong-column rejection enforces place value (Audit 11 VETTED). Critic Criterion 4: the kid cannot build 14 with 14 unit beads — they must use one ten-bar plus four units."
    },
    {
      "engineId": "number-frames",
      "rationale": "PRIMARY at 1.NBT.B.2b — the double ten-frame's first frame fills to 10 (the bundle), then the second frame holds the 'and N ones.' Same engine as K.NBT.A.1 but reframed: at 1.NBT.B.2b the sealed first frame IS 'a ten' (one unit), not ten ones. Critic Criterion 4: the win condition requires the first frame to seal at exactly 10 and the second to hold 1–9; the kid cannot satisfy with 14 random counters. Math Learning Center canonical for both K.NBT and 1.NBT."
    }
  ],
  "secondary": [
    {
      "engineId": "cuisenaire-rods",
      "rationale": "A 10-rod + N unit rods composes any teen number by length — same engine as K.NBT.A.1, valid at 1.NBT.B.2b. Listed SECONDARY rather than PRIMARY at 1.NBT because the column-structure engines (discs, beads) more directly enact 'a ten' as a UNIT; rods encode it as length, which slightly understates the unit-shift the standard names."
    },
    {
      "engineId": "bar-model",
      "rationale": "Two-part bar (length-10 part + length-N part) models teens at 1.NBT vocabulary level — Audit 14 EL concern was K-specific. SECONDARY for B.2b; the column-structured engines are more direct for the 'a ten as a unit' clause."
    },
    {
      "engineId": "stamp-game",
      "rationale": "Stamp a '10' once and a '1' N times; pictorial-abstract level. Valid; SECONDARY because golden beads and place-value-discs are more concrete and the standard sits at concrete-pictorial transition."
    }
  ],
  "revisable": [
    {
      "engineId": "number-bonds",
      "fix": "Same fix as K.NBT.A.1: lock the whole at 11–19 and pre-render one branch with '10'; the kid produces the other branch. With the hide-third fix from K.OA.A.3 applied (kid commits a guess before reveal), the engine becomes a clean teen-number bond builder."
    }
  ],
  "coverageGap": null,
  "notes": "1.NBT.B.2b is K.NBT.A.1's older twin. The numerical range is identical; what changes is the conceptual framing (ten as a UNIT vs. ten as ten individual ones grouped). See §3.4 of `docs/agents/chesure-knowledge/1-nbt-progressions.md`."
}
```

---

## 1.NBT.B.2c — Decade numbers = N tens

```json
"1.NBT.B.2c": {
  "standardText": "The numbers 10, 20, 30, 40, 50, 60, 70, 80, 90 refer to one, two, three, four, five, six, seven, eight, or nine tens (and 0 ones).",
  "namedSkill": "See each decade number 10, 20, 30, ..., 90 as a count of tens with zero ones. Forty IS four tens. The Progressions specifically flag the decade-word-to-tens-count mapping as a linguistic obstacle: 'forty' does not sound like 'four tens.'",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because the kid places N tens-discs in the tens column (and zero discs in the ones column) and the readout writes the decade numeral. The 'zero ones' part of the standard is visible — the ones column is intentionally empty. Critic Criterion 4: the kid cannot fake 40 by placing 4 unit-discs (wrong-column rejection); they must place 4 tens-discs."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY because N ten-bars laid out (with no unit beads) IS 'N tens and 0 ones' — directly visible. Audit 11 VETTED: 'Wrong-column rejection enforces place value.' The bars also reinforce the K.NBT substrate by remaining visibly composed of ten beads each."
    },
    {
      "engineId": "stamp-game",
      "rationale": "PRIMARY because N '10'-stamps with no '1'-stamps IS the standard's 'N tens (and 0 ones)' representation at the pictorial-abstract level. Audit 11 VETTED."
    }
  ],
  "secondary": [
    {
      "engineId": "cuisenaire-rods",
      "rationale": "N 10-rods laid end-to-end model decade numbers by length (40 = four orange rods). Length-IS-quantity (Audit 11 VETTED). Listed SECONDARY because the 'zero ones' framing isn't as visible in a rod train as in a discs/beads layout — the empty ones column makes the 'and 0 ones' clause physical, where the rod train just looks like a 40-length train."
    },
    {
      "engineId": "bar-model",
      "rationale": "A bar partitioned into N equal length-10 segments models a decade number; valid CPA. SECONDARY because the addition/subtraction engines (1.NBT.C.4 / C.6) are bar-model's stronger home."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "The 'forty sounds like four-tens' linguistic obstacle is named in the Progressions but not directly encodable in mechanics — engines support audio reinforcement of the decade-word ↔ tens-count mapping. See §3.5 of `docs/agents/chesure-knowledge/1-nbt-progressions.md`."
}
```

---

## 1.NBT.B.3 — Compare two two-digit numbers by tens then ones

The "based on meanings of the tens and ones digits" wording is load-bearing. Engines that compare by position on a number line (or by tower height) without surfacing the tens-first-then-ones reasoning are SECONDARY at best for this standard.

```json
"1.NBT.B.3": {
  "standardText": "Compare two two-digit numbers based on meanings of the tens and ones digits, recording the results of comparisons with the symbols >, =, and <.",
  "namedSkill": "Compare two two-digit numbers by inspecting the tens digit first; if tied, then compare ones. Record with >, =, <. The 'based on meanings of the tens and ones digits' clause is load-bearing — engines that compare by overall position or tower height without surfacing the tens-vs-ones reasoning miss the standard's named skill.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because the discs make the tens-then-ones comparison structurally visible. The kid builds 47 with four 10-discs + seven 1-discs, builds 39 with three 10-discs + nine 1-discs, and the tens columns sit side by side — four tens-discs vs. three tens-discs immediately reads larger. The kid then taps the > symbol to record. Critic Criterion 4: the comparison happens in the tens column first (the kid SEES four > three); the ones-column comparison only matters when tens are tied. This is the standard's named skill made literal. Avoids the Progressions-flagged alligator/fish-eating metaphor — the symbol comparison is between numerals, not anthropomorphic mouths."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY for the same reason as discs — N ten-bars side by side make the tens-count comparison physical. Wrong-column rejection enforces place value (Audit 11 VETTED). Critic Criterion 4: comparing 47 to 39 means comparing four ten-bars to three ten-bars first, then seven units to nine units only if tied."
    },
    {
      "engineId": "hundred-board",
      "rationale": "CONDITIONAL PRIMARY — requires Fix 2 (drag-and-place + row/column readout) per Audit 11 §2 item 15. With the fix, the kid drops counters on 47 and 39 and the row/column readout makes the tens-and-ones positions explicit (47 is on row 5, column 7; 39 is on row 4, column 9). The kid compares by row first (the tens), then by column (the ones) — directly enacting the standard's clause. Without Fix 2 the engine is click-correct-cell (Critic Criterion 3 FAIL); becomes clean PRIMARY when the fix ships."
    }
  ],
  "secondary": [
    {
      "engineId": "sorting-lane",
      "rationale": "Audit 11 VETTED — block widths show value, physics validates order. Two-digit numbers represented as towers of unit blocks can be compared by tower width/height. SECONDARY rather than PRIMARY because the comparison happens by overall magnitude, not by the tens-first-then-ones reasoning the standard explicitly names. Pair with Builder-side scenario that forces the tower to be built in tens-stacks-plus-ones (then the comparison becomes structurally tens-first), and the engine moves closer to PRIMARY."
    },
    {
      "engineId": "leaderboard-fix",
      "rationale": "Same construct as sorting-lane — swap-by-tap ordering. SECONDARY for the same reason: position/height comparison without surfacing tens-vs-ones reasoning."
    },
    {
      "engineId": "stamp-game",
      "rationale": "Two-digit stamps side by side support the visual comparison but the engine's strongest pattern is composition rather than comparison. SECONDARY."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Two rod-trains for the two two-digit numbers, laid side by side; length comparison is direct. SECONDARY because length-comparison reads overall magnitude rather than tens-then-ones."
    }
  ],
  "revisable": [
    {
      "engineId": "number-line-drop",
      "fix": "Per Audit 11 §2 item 10: tighten snap zone and show numerical position-of-drop. With that fix, the kid drops two two-digit numbers on a 0–100 line and the numerical readout makes the comparison explicit — but the standard's tens-and-ones-digit reasoning is still not surfaced (the line shows magnitude, not place-value structure). Even after the fix, this is a number-sense engine, not a place-value engine; demote to SECONDARY even fixed. Listed under revisable for completeness."
    }
  ],
  "coverageGap": null,
  "notes": "The Progressions explicitly warn against the alligator/fish-eating metaphor for >/< symbols ('problematic because it is external to the symbols themselves'). 1.NBT.B.3 games must use the 'the wide part is next to the larger number' framing — see §3.6 of `docs/agents/chesure-knowledge/1-nbt-progressions.md`."
}
```

---

## 1.NBT.C.4 — Add within 100 (two-digit + one-digit; two-digit + multiple of 10)

The Progressions explicitly call out two sub-cases: (a) two-digit + one-digit (sometimes requires composing a ten when ones sum to ≥ 10); (b) two-digit + multiple of 10 (the +10 / +20 / +30 pattern). Engines that show the tens-tens, ones-ones combination explicitly are PRIMARY.

```json
"1.NBT.C.4": {
  "standardText": "Add within 100, including adding a two-digit number and a one-digit number, and adding a two-digit number and a multiple of 10, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used. Understand that in adding two-digit numbers, one adds tens and tens, ones and ones; and sometimes it is necessary to compose a ten.",
  "namedSkill": "Add within 100 using place-value strategies — combine tens with tens, ones with ones, and compose a ten when ones sum to 10 or more. Two named sub-cases: (a) two-digit + one-digit (e.g., 47 + 8 = 55 — composing a ten); (b) two-digit + multiple of 10 (e.g., 47 + 30 = 77 — adding tens to tens). The 'compose a ten' clause is the load-bearing new move beyond 1.OA.C.6.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because the discs structurally enforce 'tens to tens, ones to ones.' To add 47 + 8: the kid places 47 (four 10-discs + seven 1-discs), then adds 8 (eight more 1-discs), the ones column visibly holds 15, and the system prompts the bundling step — 10 of the ones-discs convert to one 10-disc, leaving 5 in the ones column. Total: 5 tens + 5 ones = 55. The composing-a-ten event is right there on screen. Critic Criterion 4 (Construct Validity): the bundling animation IS the standard's load-bearing 'compose a ten' clause. For the multiple-of-10 case (47 + 30): place 47, add three more 10-discs to the tens column, readout 77 — directly enacting 'adding tens and tens.' Audit 11 VETTED; Math Learning Center canonical."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY same construct as place-value-discs but more concrete — ten unit beads become one ten-bar in the composing-a-ten step (the kid physically trades). Audit 11 VETTED — 'Wrong-column rejection enforces place value.' The trade event is the standard's 'compose a ten' clause."
    },
    {
      "engineId": "bar-model",
      "rationale": "PRIMARY at 1.NBT.C.4 — Singapore CPA canonical for two-part addition. A bar of length 47 plus a bar of length 8 (or 30) joins into a total bar; the visible decomposition into tens-portion and ones-portion supports the place-value strategy. Audit 11 VETTED. Bar-model returns to PRIMARY at 1.NBT (was SECONDARY at K.OA/K.NBT per Audit 14 EL concern; vocabulary scaffolding has caught up by grade 1)."
    }
  ],
  "secondary": [
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Length-composition models 47 + 8 as a rod train; valid CPA. SECONDARY rather than PRIMARY because the column-structured engines surface the 'tens to tens, ones to ones' clause more directly than a single rod train."
    },
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame supports the teen-range and within-20 cases; doesn't scale to two full two-digit numbers without re-instantiating. SECONDARY for the small-end of the standard's range."
    },
    {
      "engineId": "stamp-game",
      "rationale": "Stamps support the tens-and-ones distinction at pictorial-abstract level; valid for grade-1 add-within-100. SECONDARY because golden beads + place-value-discs are more concrete."
    },
    {
      "engineId": "hundred-board",
      "rationale": "(With Fix 2 applied) — adding +10 or +20 on a hundred-board IS jumping down 1 or 2 rows. Becomes a strong SECONDARY for the multiple-of-10 sub-case once Fix 2 ships. Still SECONDARY rather than PRIMARY because hundred-board doesn't enact the compose-a-ten clause for the two-digit + one-digit case."
    }
  ],
  "revisable": [
    {
      "engineId": "hundred-board",
      "fix": "Fix 2 (drag-and-place + row/column readout). With the fix, hundred-board becomes a strong SECONDARY for the multiple-of-10 sub-case (47 + 30 = drop counter on 47, jump down 3 rows, land on 77) — and arguably PRIMARY for that narrow sub-case. Not raised to PRIMARY here because the standard's main load-bearing move is the compose-a-ten step, which hundred-board doesn't enact."
    }
  ],
  "coverageGap": null,
  "notes": "Two sub-cases in this standard: (1) two-digit + one-digit with possible composing a ten; (2) two-digit + multiple of 10. PRIMARY engines cover both; hundred-board (with Fix 2) is particularly strong on sub-case 2. See §3.7 of `docs/agents/chesure-knowledge/1-nbt-progressions.md`."
}
```

---

## 1.NBT.C.5 — Mentally find 10 more or 10 less

The hardest standard to map at clean-floor. The Progressions explicitly say "mentally find 10 more or 10 less, without having to count" and "explain reasoning as 'one more (or one less) ten.'" Our CPA engine library is biased toward making the math visible. The fit is real for the *understanding substrate* (1.NBT.B.2) but the *mental fluency* aspect is a coverage gap.

```json
"1.NBT.C.5": {
  "standardText": "Given a two-digit number, mentally find 10 more or 10 less than the number, without having to count; explain the reasoning used.",
  "namedSkill": "Given any two-digit number, produce '10 more' or '10 less' without counting by ones — the kid reasons 'I have one more (or less) ten than before.' The fluency clause ('mentally', 'without having to count') is load-bearing. Strong CPA engines build the substrate; the fluency itself is a derivative skill that lives beyond visible-model gameplay.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY for the reasoning-and-explanation half of the standard. The kid sees 47 (four 10-discs + seven 1-discs), and the +10 action is literally 'add one more 10-disc to the tens column.' The ones column doesn't change — the kid SEES that the ones digit stays the same (Progressions named explanation: 'one more ten'). Critic Criterion 4: the kid cannot 'compute' 57 by guessing — they must place one more disc in the correct column. The discs make 'one more ten than before' visible. Pair with a fluency phase (no-discs round) for the 'mentally' aspect."
    },
    {
      "engineId": "hundred-board",
      "rationale": "CONDITIONAL PRIMARY — requires Fix 2 (drag-and-place + row/column readout) per Audit 11 §2 item 15. Hundred-board is THE canonical representation for 1.NBT.C.5 (Progressions p. 57). +10 = drop counter, jump down ONE row; the ones digit stays the same (column position is the same row→row); the kid SEES the pattern. With Fix 2, the engine becomes the strongest construct-validity fit in the library because the +10/-10 pattern is structurally visible. Without Fix 2 the engine is click-correct-cell — fails Critic Criterion 3. Becomes clean PRIMARY when Fix 2 ships."
    },
    {
      "engineId": "golden-beads",
      "rationale": "CONDITIONAL PRIMARY — same construct as place-value-discs (add or remove one ten-bar; ones unchanged). Listed as conditional because golden beads at 1.NBT.C.5 don't add anything beyond what place-value-discs provide; the cluster benefits more from hundred-board's row-pattern visualization once Fix 2 ships. If the team treats it as a stable PRIMARY alongside discs, count it as 2 clean + 1 conditional; otherwise it's a third VETTED concrete option to round out the floor."
    }
  ],
  "secondary": [
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Add or remove one 10-rod from a rod train; valid CPA. SECONDARY because the 'ones digit stays the same' framing isn't intrinsic to length on a rod train (the kid sees the train get longer or shorter by one rod-length, but doesn't see a digit at all)."
    },
    {
      "engineId": "stamp-game",
      "rationale": "Stamp one more '10' or remove one '10' stamp; ones unchanged. Pictorial-abstract level. SECONDARY because place-value-discs at the same abstraction level provides the same construct with stronger physical separation."
    },
    {
      "engineId": "bar-model",
      "rationale": "Extend a bar by length 10 or shorten by length 10; valid CPA. SECONDARY because bar-model's strength is composition-and-decomposition (1.NBT.C.4/C.6), not the +10 pattern specifically."
    }
  ],
  "revisable": [
    {
      "engineId": "hundred-board",
      "fix": "Fix 2 (drag-and-place + row/column readout, per Audit 11 §2 item 15). For 1.NBT.C.5 specifically, the row-jump pattern must be the win condition — kid drops on 47, the engine offers 'find 10 more,' kid drags down one row to 57, the column position (the ones digit) explicitly does not change in the readout. The 'ones digit stays the same' framing should be made explicit by the engine. With this fix, hundred-board is the strongest engine in the library for 1.NBT.C.5."
    }
  ],
  "coverageGap": "1.NBT.C.5 is named as a *fluency* standard ('mentally', 'without counting'). The current engine library is CPA-biased and supports the *understanding substrate* (1.NBT.B.2) cleanly, but the fluency-on-top is not the engines' native target. A 'flash-card-style' 10-more/10-less Mechanic Inventor engine that uses the hundred-board substrate but builds in a no-counting fluency phase would be the right closure. Flag for the build queue.",
  "notes": "The cleanest path forward for 1.NBT.C.5 is to ship Fix 2 on `hundred-board` and treat the engine as PRIMARY thereafter. Without Fix 2, only `place-value-discs` is clean PRIMARY and the standard drops below the 3-PRIMARY floor. See §3.8 of `docs/agents/chesure-knowledge/1-nbt-progressions.md`."
}
```

---

## 1.NBT.C.6 — Subtract multiples of 10 from multiples of 10

The mirror of 1.NBT.C.4 for subtraction, but narrower: ONLY multiples-of-10 minus multiples-of-10. No decomposing-a-ten move needed (deferred to 2.NBT.B.7). Cleanly aligned with the same PRIMARY engines as 1.NBT.C.4.

```json
"1.NBT.C.6": {
  "standardText": "Subtract multiples of 10 in the range 10–90 from multiples of 10 in the range 10–90 (positive or zero differences), using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used.",
  "namedSkill": "Subtract a multiple of 10 from another multiple of 10 (both in 10–90), e.g., 70 − 40 = 30. The Progressions name two strategies: (1) 'view as 7 tens minus 4 tens'; (2) view as unknown-addend ('70 + ? = 80'). No decomposing a ten — that's deferred to 2.NBT.B.7. Range is narrow; engine fit is tight.",
  "primary": [
    {
      "engineId": "place-value-discs",
      "rationale": "PRIMARY because removing N tens-discs from M tens-discs IS the standard's 'M tens minus N tens' clause made physical. The kid places 70 (seven 10-discs), removes 40 (four 10-discs), reads out 30. Audit 11 VETTED. Critic Criterion 4: the kid cannot fake the result — they must physically remove tens-discs, which keeps the place-value structure explicit. The ones column stays empty throughout, matching the standard's 'multiples of 10' constraint."
    },
    {
      "engineId": "golden-beads",
      "rationale": "PRIMARY same construct — remove N ten-bars from M ten-bars; the difference is K - N ten-bars. Audit 11 VETTED. Reinforces the K.NBT substrate by keeping ten-bars visibly composed of ten beads each."
    },
    {
      "engineId": "bar-model",
      "rationale": "PRIMARY because Singapore part-whole bar-model is canonical for the unknown-addend subtraction strategy the Progressions name. To find 80 − 40: a bar of length 80 with a 40-length portion removed leaves a 40-length portion. To find 80 − 70 as unknown-addend ('70 + ? = 80'): a 70-bar plus an unknown bar equals 80; the unknown bar is 10. Audit 11 VETTED. Bar-model PRIMARY at 1.NBT (cleared the Audit 14 K-grade EL concern)."
    }
  ],
  "secondary": [
    {
      "engineId": "cuisenaire-rods",
      "rationale": "Remove 10-rods from a 10-rod train; length-difference IS the answer. Valid CPA. SECONDARY because column-structured engines (discs, beads) more directly enact the 'tens minus tens' clause."
    },
    {
      "engineId": "stamp-game",
      "rationale": "Cross out N 10-stamps from M 10-stamps; pictorial-abstract level. Valid; SECONDARY because more concrete engines are PRIMARY at grade 1."
    },
    {
      "engineId": "free-balance",
      "rationale": "Balance beam can model unknown-addend subtraction (place 70 on one side, ask 'what plus 40 makes the other side balance at 80'). Audit 11 VETTED for unknown-addend. SECONDARY because the engine doesn't naturally constrain to multiples-of-10."
    },
    {
      "engineId": "hundred-board",
      "rationale": "(With Fix 2) — subtracting multiples of 10 IS jumping up rows on the hundred-board (70 - 40 = drop counter on 70, jump up four rows to 30). Becomes a strong SECONDARY once Fix 2 ships. Listed here so the Builder knows the option exists once Fix 2 is in."
    }
  ],
  "revisable": [],
  "coverageGap": null,
  "notes": "1.NBT.C.6's narrow range (multiples-of-10 minus multiples-of-10) makes the engine fit unusually clean. Reuses the same PRIMARY engines as 1.NBT.C.4. The unknown-addend strategy named in the Progressions is best served by bar-model; the direct-subtraction strategy by discs and beads. See §3.9 of `docs/agents/chesure-knowledge/1-nbt-progressions.md`."
}
```

---

## Files referenced

- `c:/projects/math-games-builder/docs/mapping-kits/1.NBT.*/cc-text.md` — verbatim CCSS text for each standard
- `c:/projects/math-games-builder/docs/mapping-kits/1.NBT.*/progressions-excerpt.md` — Progressions K-5 NBT excerpts for each standard
- `c:/projects/math-games-builder/docs/mapping-kits/1.NBT.*/candidate-engines.md` — candidate engine lists (per-standard)
- `c:/projects/math-games-builder/docs/audit/11-engine-library-per-engine.md` — engine verdicts (VETTED/REVISABLE/HIDDEN)
- `c:/projects/math-games-builder/docs/audit/13-standard-mechanic-mapping.md` — verdict criteria and Critic Criterion 4 application
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-oa-progressions.md` — style template
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-nbt-progressions.md` — closest sibling file (K.NBT.A.1 → 1.NBT.B.2a substrate)
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-cc-progressions.md` — counting cross-references
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/1-nbt-progressions.md` — NEW Phase 3.2 1.NBT pedagogy authority (created alongside this draft)
- `c:/projects/math-games-builder/src/data/standard-mechanic-map.json` — target file for these 9 entries (Barbara reviews before merge)
