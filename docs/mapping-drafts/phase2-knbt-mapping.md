# Phase 2 — K.NBT.A.1 Standard-Mechanic Mapping Draft

*Date: 2026-05-11 · Drafter: Phase 2 mapping pass · Status: DRAFT — Barbara reviews before merge into `src/data/standard-mechanic-map.json`*

## Review summary

**3 PRIMARY engines proposed:** `number-frames`, `place-value-discs`, `cuisenaire-rods`. All three explicitly encode the "ten ones and some further ones" structure named in the standard's verbatim text:

- **`number-frames`** — a double ten-frame fills the first frame to ten, then places the "further ones" in the second frame. The 2×5 + 2×5 structure IS the standard's "ten ones and some further ones" made physical. Math Learning Center canonical for K teen-numbers (Van de Walle 2018; MLC Number Frames app). Construct Validity (Critic Criterion 4) holds because the win condition requires both a filled ten-frame AND the loose remainder — the kid cannot satisfy the round with 14 random counters in a single pile.
- **`place-value-discs`** — one ten-disc + N unit-discs models a teen number as "1 ten and N ones." Total readout IS the truth (Audit 11). This is the bridge between K.NBT.A.1 ("ten ones" as a thing) and 1.NBT.B.2 ("ten as a unit"); using place-value-discs at K is *previewing* the bundled-ten without enforcing the abstraction prematurely. PRIMARY because the disc placement physically separates the ten from the ones — exactly what the standard names. Cite NBT Progression p. 55 (compiled PDF) on the K→1 bridge.
- **`cuisenaire-rods`** — a 10-rod + N unit rods composes a teen number with length encoding the ten-and-ones structure. Length IS the count when unit rods are used (Audit 11). Construct Validity: the kid can only build the target teen-length by combining a 10-rod with some unit rods (or 10 unit rods + N unit rods, which itself models "ten ones and some further ones"). Quote the standard: "composed of ten ones and one, two, three, four, five, six, seven, eight, or nine ones" — the rod composition is literal.

**Judgment calls:**

1. **`bar-model` placed SECONDARY, not PRIMARY.** Singapore CPA bar-model can model a teen as two adjacent bars (one length-10, one length-N), but at K-grade the de Koning et al. 2022 "double-edged sword" finding plus the K.OA.A.1 Audit 14 EL-accessibility concern apply — same justification used by Phase 1A in `K.OA.A.1`. K.NBT.A.1 stays consistent: bar-model returns to PRIMARY at 1.NBT and 2.NBT where vocabulary has caught up.
2. **`number-frames-decompose` NOT included.** The decompose variant is K.OA.A.3 territory (decomposition into pairs in many ways). K.NBT.A.1 is about ONE specific decomposition (ten + some), not flexibility-of-pairings. Construct Validity fail.
3. **`golden-beads` and `stamp-game` deliberately NOT included.** Audit 11 verdicts are VETTED but they're framed for 3-digit and 4-digit place value (Audit 11 §3 lists them under 1.NBT/2.NBT/3.NBT/4.NBT). The K.NBT range is 11–19 only — using a 100-bead frame or 1000-bead frame at K introduces "hundreds" and "thousands" that the standard explicitly does not name. Mr. Chesure §3 would reject these as out-of-grade for K.NBT.A.1.
4. **`free-collect` demoted to SECONDARY.** Free-collect teaches cardinality cleanly (already PRIMARY for K.CC.B.4) but it does NOT enforce the "ten ones and some further ones" structure — 14 dots collected as a single field is just 14, not "10 + 4." Without the ten-frame or rod-or-disc structure, the standard's load-bearing clause is invisible. Listed SECONDARY for cases where the Builder pre-structures the collection target (e.g., two clusters — one of ten, one of N).

**3-PRIMARY floor: hit cleanly.** All three PRIMARY engines are VETTED in Audit 11, none require REVISABLE fixes, and each one *structurally* makes "ten ones and some further ones" the literal mechanic — not a side-effect.

---

## JSON entry to add to `src/data/standard-mechanic-map.json`

Add under `standards`, alphabetically positioned between `K.CC.C.7` and `K.OA.A.1`:

```json
"K.NBT.A.1": {
  "standardText": "Compose and decompose numbers from 11 to 19 into ten ones and some further ones, e.g., by using objects or drawings, and record each composition or decomposition by a drawing or equation (e.g., 18 = 10 + 8); understand that these numbers are composed of ten ones and one, two, three, four, five, six, seven, eight, or nine ones.",
  "namedSkill": "View a teen number (11–19) as ten ones plus some further ones. Compose AND decompose teen numbers using objects, drawings, or equations of the form 18 = 10 + 8. The 'ten ones and some further ones' structure is the load-bearing clause; engines that show a teen number as an unstructured pile of N fail Construct Validity.",
  "primary": [
    {
      "engineId": "number-frames",
      "rationale": "Double ten-frame: first frame fills to 10, second frame holds the 'further ones' (1–9). The 2×5 + N structure IS the standard's verbatim 'ten ones and some further ones' made physical. Critic Criterion 4 (Construct Validity): the win condition requires BOTH a filled first frame AND the loose remainder visible — the kid cannot satisfy the round with 14 random counters in a single pile, because the second frame's count is the decomposition. Math Learning Center canonical for K teen-numbers (Van de Walle 2018; MLC Number Frames app). Equation appears as recording (e.g., '14 = 10 + 4') after the kid commits the count, matching Chesure equation-as-record discipline."
    },
    {
      "engineId": "place-value-discs",
      "rationale": "One ten-disc + N unit-discs (N in 1–9) models a teen number as '1 ten and N ones,' which is the K.NBT.A.1 → 1.NBT.B.2 bridge spelled out in the K-5 NBT Progression p. 55 ('Children use objects, math drawings, and equations to describe how teen numbers are ten ones and some more ones'). Critic Criterion 4: the disc placement physically separates the ten from the ones — the kid cannot place 14 unit-discs in a pile and claim the teen-number structure; the ten-disc IS the 'ten ones' bundled. Total readout IS the truth (Audit 11 VETTED). Using place-value-discs at K previews the bundled-ten without enforcing the abstract 'ten as a unit' move (which is properly 1.NBT.B.2)."
    },
    {
      "engineId": "cuisenaire-rods",
      "rationale": "A 10-rod (orange) + N unit rods composes a teen-number length; the rod combination physically encodes 'ten ones and some further ones' as length. Critic Criterion 4: the kid can only build the target teen-length by either (a) one 10-rod + N unit rods (explicit 'ten and some'), or (b) ten unit rods + N unit rods (literal 'ten ones and N ones'). Either composition matches the standard's verbatim text. CPA canonical for K compose-to-length (Audit 11 VETTED). Length IS the count; order-irrelevance is structural; the equation '14 = 10 + 4' appears as a recording after the kid commits the train."
    }
  ],
  "secondary": [
    {
      "engineId": "bar-model",
      "rationale": "Two adjacent bars (one length-10, one length-N) can model a teen as ten-plus-some, but at K-grade the de Koning et al. 2022 'double-edged sword' finding plus the Audit 14 EL-accessibility concern apply (same demotion rationale used for K.OA.A.1). Bar-model returns to PRIMARY at 1.NBT.B.2 and 2.NBT.A.1 where kid vocabulary scaffolding has caught up."
    },
    {
      "engineId": "free-collect",
      "rationale": "Free-collect teaches cardinality cleanly (PRIMARY for K.CC.B.4) but does NOT enforce the 'ten ones and some further ones' structure — 14 dots collected as a single field is just 14, not '10 + 4.' Valid as SECONDARY when the Builder pre-structures the target into two clusters (one of ten, one of N) so that the act of tap-collecting parallels the ten-and-some-more decomposition; without that scenario design the engine drops out of construct validity for K.NBT.A.1."
    },
    {
      "engineId": "shape-decomposer",
      "rationale": "Area-decomposition into a 1×10 strip + 1×N strip can model a teen number as ten-plus-some, but the engine's default framing is K.MD/3.MD area-as-sum, not K.NBT teen-structure. Listed SECONDARY because the construct works ONLY if the Builder forces the decomposition into exactly a ten-strip + remainder; without that constraint the kid can split the area arbitrarily and lose the standard's named structure."
    },
    {
      "engineId": "stack-to-target",
      "rationale": "Height-stack can compose a teen-number height as a stack-of-ten + a stack-of-N, but block-height encoding of quantity is less direct than discrete counters in a ten-frame at K. Valid for the composition half of the standard, weaker on decomposition."
    }
  ],
  "revisable": [
    {
      "engineId": "number-bonds",
      "fix": "Lock the whole at a teen number (11–19) and pre-render one branch with '10'; the kid produces the other branch (1–9) by counting or by placing counters. With the hide-third fix from K.OA.A.3/K.OA.A.4 applied to the 'further ones' branch (kid commits a guess before the third value reveals), the engine becomes a literal teen-number bond builder. Currently auto-reveals the third value (Chesure K.OA anti-pattern), which short-circuits the math; not PRIMARY until the fix ships."
    },
    {
      "engineId": "split-the-loot",
      "fix": "Lock total at a teen number (11–19) AND lock one silo's target at 10; the kid must fill the locked silo with exactly 10 unit-items and the other silo with the 'further ones' (1–9). The structural lock on the '10 silo' enforces the standard's 'ten ones' clause. Without the lock the engine is generic decomposition, not ten-and-some specifically — currently REVISABLE, not PRIMARY."
    }
  ],
  "coverageGap": null,
  "notes": "K.NBT.A.1 is the developmental hinge between K.CC (counting) and 1.NBT (ten as a bundled unit per 1.NBT.B.2). The standard explicitly names 'ten ones and some further ones' — engines that fail to enforce that structure (e.g., 14 counters as an undifferentiated pile) fail Construct Validity even if they pass cardinality. PRIMARY engines (number-frames, place-value-discs, cuisenaire-rods) all structurally encode the ten-and-some-more clause; SECONDARY engines pass cardinality/composition but require Builder-side scenario design to surface the teen-number structure. See `docs/agents/chesure-knowledge/k-nbt-progressions.md` for the K.NBT pedagogy authority (created Phase 2, 2026-05-11)."
}
```

---

## Files referenced

- `c:/projects/math-games-builder/docs/mapping-kits/K.NBT.A.1/cc-text.md` — verbatim CCSS text
- `c:/projects/math-games-builder/docs/mapping-kits/K.NBT.A.1/progressions-excerpt.md` — Progressions Doc K.NBT excerpt
- `c:/projects/math-games-builder/docs/mapping-kits/K.NBT.A.1/candidate-engines.md` — candidate engine list (5 entries)
- `c:/projects/math-games-builder/docs/audit/11-engine-library-per-engine.md` — engine verdicts (VETTED/REVISABLE/HIDDEN)
- `c:/projects/math-games-builder/docs/audit/13-standard-mechanic-mapping.md` — verdict criteria + Critic Criterion 4 application
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-oa-progressions.md` — style template
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-cc-progressions.md` — style template (closer match, just-shipped Phase 1B)
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-nbt-progressions.md` — NEW Phase 2 K.NBT pedagogy authority (symlinks to `c:/projects/math-pedagogy-toolkit/agents/chesure-knowledge/k-nbt-progressions.md`)
- `c:/projects/math-games-builder/src/data/standard-mechanic-map.json` — target file for this entry (Barbara reviews before merge)
