# Audit 13 — Standard-level mechanic-to-math mapping

*Date: 2026-05-10 · Auditor: per-(engine, standard) pedagogical review against Critic 4 criteria + Mr. Chesure K.OA authority + Shortcut Adversary lens · Source data: `src/data/standard-mechanic-map.json` · Builds on Audit 11 (engine library), Audit 06 (agents), and Mr. Chesure K.OA knowledge file.*

## §1 — Summary

- **Standards mapped:** 19
  - K.OA cluster: K.OA.A.1, A.2, A.3, A.4, A.5 (5)
  - 3.OA cluster: 3.OA.A.1, A.2, A.3, A.4 (4)
  - K.CC cluster: K.CC.A.1, A.2, A.3, B.4, B.4a, B.4b, B.4c, B.5, C.6, C.7 (10)
- **Candidate engines per standard:** 48 (the 30 VETTED + 18 REVISABLE; HIDDEN engines per Audit 11 §4 excluded by construction)
- **Total (engine, standard) pairs evaluated:** 19 × 48 = 912 (most resolve to NOT_APPLICABLE implicitly)
- **Verdict counts (explicit listings in the JSON):**
  - **PRIMARY:** 51 (engine, standard) pairs
  - **SECONDARY:** 36
  - **REVISABLE:** 15
  - **Implicit NOT_APPLICABLE:** the remainder (~810)
- **Standards with ≥3 PRIMARY engines:** 13 of 19
- **Coverage-gap standards (<3 PRIMARY):** 6 of 19 — K.OA.A.3, K.OA.A.4, 3.OA.A.2, 3.OA.A.4, K.CC.A.1, K.CC.A.2, K.CC.A.3 (the four K.CC.A standards are essentially uncovered)

## §2 — Methodology and authorities consulted

For each (engine, standard) pair, the auditor:

1. Read the **verbatim CCSS text** from `src/data/standards.json`.
2. For K.OA standards, read the corresponding section of **Mr. Chesure's K.OA knowledge file** (`docs/agents/chesure-knowledge/k-oa-progressions.md`) which paraphrases the K-5 OA Progressions doc and contains misconceptions, CPA progressions, exemplar mechanics, and anti-patterns per standard. For 3.OA, no equivalent file exists yet — verdict relied on the Progressions doc references in Audit 11 + direct standard text.
3. Read the **engine's registry entry** in `src/lib/game-engines/game-option-registry.ts` (description, introText, helpText) to confirm what the player actually does.
4. Consulted **Audit 11 §1** for the engine's pass/fail against Critic criteria, and **Audit 11 §3** for the operation-level mapping which served as a starting candidate list.
5. Applied **the Critic's Criterion 4 (Construct Validity)** specifically: does the engine measure the SPECIFIC named skill in this standard, or an adjacent operation? (E.g., engines that teach addition fluency are SECONDARY for K.OA.A.1, which is specifically about representational multiplicity, not fluency.)
6. Applied **the Shortcut Adversary lens**: could a kid win this engine on this standard without doing the named cognitive operation? E.g., closing-the-ten-frame by visual symmetry without counting the empty cells (Chesure §2.4 anti-pattern).
7. Applied **conservative bias** — when uncertain between PRIMARY and SECONDARY, picked SECONDARY. When uncertain between SECONDARY and REVISABLE, picked REVISABLE.

**Verdict definitions** (as specified in the brief):
- **PRIMARY** — engine clearly and primarily exercises the standard's specific named skill; a Builder using this engine here is highly likely to produce a pedagogically valid game.
- **SECONDARY** — engine teaches adjacent math but doesn't directly exercise the standard's named skill; valid as practice/extension, not as a primary teaching tool.
- **REVISABLE** — engine could become PRIMARY with a defined mechanical fix; fix described in one sentence.
- **NOT_APPLICABLE** — implicit (engine not listed); wrong math, wrong skill, or fundamental misfit.

ERIC and Semantic Scholar searches were **not** required for these standards because (a) Mr. Chesure's K.OA file already cites the relevant K-OA research (Carpenter, Fennema, CGI, Fischer 1990, Björklund & Reis 2020, Baroody 2006, Clements & Sarama), and (b) the 3.OA standards' equal-groups / array / measurement framings are unambiguous in the Progressions doc and Open Up Resources Grade 3 Unit 1. ERIC remains the right tool for the 3.OA Chesure knowledge file when that gets built.

## §3 — Per-standard analysis

The detailed per-standard verdicts (verbatim text, named skill, primary/secondary/revisable lists with one-sentence rationale per engine) live in **`src/data/standard-mechanic-map.json`**. The JSON is the source of truth Step 4 should consume; this section calls out the analytical highlights for human review.

### K.OA.A.1 — Represent addition/subtraction in 8 modes

**Specific named skill:** Multiplicity of representation, not fluency. Equation appears as a recording, never as a prompt. Within 10.

**Audit 11 §3 listed 13 candidate engines** under "Addition — single-digit / compose." Under Construct Validity (Critic C4) and Chesure §2.1 multi-mode constraint, **the PRIMARY list reduces to 4**: `number-frames`, `free-collect`, `cuisenaire-rods`, `bar-model`. Engines like `shortest-route`, `delivery-run`, `map-builder`, `map-distance` were demoted to implicit NOT_APPLICABLE — they treat numbers as abstract distances and exceed within-10. `stack-to-target`, `free-balance`, `conveyor-belt` were demoted to SECONDARY (height-blocks/balance/liquid are valid representations but second-tier vs the discrete-counter canonical forms at K).

**Confidence: high.** Mr. Chesure's file is explicit about what passes for K.OA.A.1.

### K.OA.A.2 — Word problems within 10

**Specific named skill:** Model a story with objects/drawings to solve. Covers four CGI Result-Unknown problem types.

**4 PRIMARY engines:** `bar-model` (Singapore CPA canonical), `number-frames`, `free-collect`, `cuisenaire-rods`. SECONDARY includes `number-frames-decompose` and `split-the-loot` (Take-Apart-only coverage), `shape-decomposer`, `stack-to-target`.

**Confidence: high.** Standard is broad; multiple engines fit cleanly.

### K.OA.A.3 — Decompose ≤10 into pairs in MORE THAN ONE WAY

**Specific named skill:** Generate ≥2 distinct part-pairs (≥3 for totals ≥6 per Chesure §2.3). Multiplicity is the load-bearing clause.

**Only 1 PRIMARY engine as-is: `cuisenaire-rods`** (helpText explicitly invites multiple decompositions). The three REVISABLE engines (`number-frames-decompose`, `split-the-loot`, `number-bonds`) all require the same fix family: enforce ≥3 distinct splits and show a side-panel record of prior splits. This matches the Critic's canonical FAIL example in `the-critic.md`.

**Coverage gap. Confidence: high** — Mr. Chesure's file is unambiguous about what construct-validity for K.OA.A.3 requires.

### K.OA.A.4 — Partner that makes 10

**Specific named skill:** For each N in 1–9, find 10−N. Total fixed at 10. Foundation for grade-1 make-a-ten.

**2 PRIMARY (`number-frames`, `cuisenaire-rods`) + 1 PRIMARY-after-fix (`number-bonds`).** Borderline coverage. Shortcut-Adversary concern flagged in JSON: closing-the-ten-frame by visual symmetry without counting (Chesure §2.4 anti-pattern).

**Coverage gap. Confidence: high.**

### K.OA.A.5 — Fluently add and subtract within 5

**Specific named skill:** Efficient strategy use (Baroody 2006), not flashcard speed. No visible timer at K (Chesure §2.5).

**3 PRIMARY: `number-frames`, `cuisenaire-rods`, `free-collect`.** The classic-overlay drill engines (snake-math, falling-blocks-math, etc.) are explicitly NOT_APPLICABLE despite ostensibly drilling addition — they violate the no-timer / no-anxiety constraint at K (Chesure §2.5 anti-pattern; Audit 11 §4 HIDDEN).

**Confidence: high.** The surprising-but-correct call here is rejecting the classic-overlays for K fluency.

### 3.OA.A.1 — Interpret a × b as a groups of b objects each

**Specific named skill:** Equal-groups interpretation of multiplication.

**8 PRIMARY engines:** `assembly-line`, `bead-chain`, `investment-sim`, `population-boom`, `potion-lab`, `bar-model`, `recipe-scaler`, `checkerboard-multiply`. The cross-age pilot standard — and exceptional coverage. SECONDARY includes `doubling-maze` (chained, not single-groups-of), `fill-the-floor` (area, not equal-groups), `resize-tool` (scaling).

**Confidence: high** — the equal-groups interpretation is unambiguous and many engines target it. **Flag:** no 3.OA Chesure knowledge file exists; create one before this standard ships at scale.

### 3.OA.A.2 — Interpret quotients (partitive OR quotitive)

**Specific named skill:** Two interpretations explicitly named — objects-per-share (partitive) and number-of-shares (quotitive).

**Only 2 PRIMARY: `share-the-pizza` (partitive) and `bar-model` (both).** `signed-divide` is SECONDARY (mechanism right, grade wrong). `assembly-line` and `checkerboard-multiply` are REVISABLE — locking factors and asking the kid to find the other converts them to quotitive division.

**Coverage gap. Confidence: medium** — partitive is well covered by share-the-pizza; quotitive coverage as-is is thin.

### 3.OA.A.3 — Word problems with mult/div in 3 contexts

**Specific named skill:** Apply mult/div to word problems involving equal groups, arrays, AND measurement quantities. Within 100.

**7 PRIMARY engines.** Strong coverage because the standard explicitly names three contexts and each context maps to multiple engines.

**Confidence: high.**

### 3.OA.A.4 — Determine the unknown in mult/div equation

**Specific named skill:** Find the missing whole number in a × ? = c, ? × b = c, a = ? ÷ b, etc.

**Only 2 PRIMARY (`bar-model`, `free-balance`).** Many candidates are REVISABLE because their default framing is build-the-product (3.OA.A.1 mode); locking one factor and asking for the other converts them.

**Coverage gap. Confidence: medium** — fixes are straightforward but the engines aren't there yet.

### K.CC cluster

K.CC.A.1–A.3 (count to 100, count forward from N, write numerals 0–20) are **largely uncovered**. These are *production* skills (recite/write) rather than *interpretation* skills, and the registry's engines are interpretation-focused. K.CC.A.2 (counting on from non-1) is also flagged in Audit 11 §5 gap #2 as a separate concern.

K.CC.B.4 / B.4a/b/c / B.5 (cardinality, one-to-one, "one more," count-out-N up to 20) are **well covered** by the K.OA discrete-counter engines (free-collect, number-frames, cuisenaire-rods, bar-model) — these inherit the foundational counting principles by construction.

K.CC.C.6 (compare object groups) and C.7 (compare written numerals) are **well covered** by `sorting-lane`, `leaderboard-fix`, `cuisenaire-rods`, `bar-model` and (for C.7 specifically) `size-picker`.

**Confidence on K.CC.A.* coverage gap: high.** **Confidence on K.CC.B and K.CC.C coverage: high.**

## §4 — Coverage gap summary

Standards lacking ≥3 PRIMARY engines, ordered by pilot priority:

| Standard | PRIMARY count | What's missing | Mechanic Inventor opportunity |
|---|---|---|---|
| **K.OA.A.3** | 1 (`cuisenaire-rods`) | Multiplicity-enforcement on the obvious candidates | "Ways to make N" canvas where a chart of recorded decompositions IS the win-state. Implement on `number-frames-decompose` and `split-the-loot` per Audit 11 §2. |
| **K.OA.A.4** | 2 | Partner-of-10 specialization beyond ten-frames | Partner-finder card-pair engine: 1–9 cards on a strip, kid drags pairs summing to 10 (Chesure §2.4 exemplar #2). |
| **3.OA.A.2** | 2 | Quotitive-division engine that isn't share-the-pizza | Partition-by-N tool: drag T objects into N labeled containers; system enforces per-container equality; per-container count IS the quotient. |
| **3.OA.A.4** | 2 | Unknown-factor engines (default framing is build-the-product) | Fact-family triangle: drag any 2 of {a, b, c} into a triangle; third auto-fits. Serves 3.OA.A.4 + 3.OA.B.6. |
| **K.CC.A.1** | 0 | Count-to-100 recitation/production | Tap-the-bubbles-in-sequence engine; voice-input version optional. |
| **K.CC.A.2** | 0 | Counting-on from non-1 start | Pre-fill engine with N counters as given start; tap-to-add starts count at N+1 not 1 (Audit 11 §5 gap #2). |
| **K.CC.A.3** | 0 | Numeral writing 0–20 | Trace-the-numeral engine with stroke-path validation. |

**Highest priority for the build queue:** K.OA.A.3 fixes (already flagged in Audit 11 §2 priority #1) and the K.CC.A.2 counting-on engine (unblocks 1.OA strategies). K.CC.A.1 and A.3 are lower priority because they are production skills with non-traditional input shapes (voice, fine-motor) that don't fit the current engine pattern.

## §5 — Confidence notes

**High confidence verdicts:**
- All K.OA standards (Mr. Chesure's file is authoritative; verdicts trace to specific Progressions doc pages and Chesure anti-pattern lists)
- 3.OA.A.1, 3.OA.A.3 (broad, multiply-named contexts make engine mapping unambiguous)
- K.CC.B / K.CC.C clusters (inherited from K.OA engines or directly served by compare engines)

**Medium confidence (flagged for human review):**
- 3.OA.A.2 — `signed-divide` as SECONDARY: the magnitude stage is structurally identical to quotitive division within 100, but the engine's signed-particle framing reads as 6/7.NS. Barbara may decide the engine is worth reframing for grade 3 (set the sign stage to skip when both inputs are positive).
- 3.OA.A.4 — most candidates ended up REVISABLE not PRIMARY because their default framing is multiplication-build. If the unknown-factor mode is added consistently (lock one slider, free the other), the PRIMARY count jumps significantly.
- `free-balance` for K.OA.A.4: marked SECONDARY because the balance metaphor is unusual at K. If a future Builder demonstrates that K players engage with the mystery-weight pattern, this could move to PRIMARY.

**Borderline calls explicitly made:**
- `cut-the-bar` for K.OA.A.3: demoted to SECONDARY because equal-part shading is fractions, not arbitrary pair-decomposition — even though Audit 11 §3 listed it under decomposition. The Critic's C4 lens favors the demotion.
- `size-picker` for K.CC.C.7: noted as PRIMARY-as-is for simple K numeral compare, even though Audit 11 marks it REVISABLE for higher-grade unit-mismatch use. Context-dependent verdict.
- `shortest-route`, `delivery-run`, `map-builder`, `map-distance` for K.OA.A.1: implicit NOT_APPLICABLE despite Audit 11 §3 listing them under "Addition — single-digit / compose." Construct validity at K demands within-10 discrete countables; map-distances exceed that range.

**Where this audit deliberately departed from Audit 11 §3:** Audit 11 §3 is an operation-level map (which engines do "addition"); this audit is a standard-level map (which engines specifically serve K.OA.A.1's representational-multiplicity skill). Several Audit 11 §3 entries that would over-include have been moved to SECONDARY or NOT_APPLICABLE.

## §6 — Recommended downstream changes

1. **Step 4 of the new build flow** should consume `src/data/standard-mechanic-map.json` and present PRIMARY engines as the default mechanic picker for the Builder's chosen standard, with SECONDARY shown as "also possible" under an expand-to-see toggle. REVISABLE engines should be hidden from the Builder picker until the listed fix is shipped (matches Audit 11 §2 priority list).

2. **For K.OA.A.1 specifically** (current implementation target): the Builder picker should expose **4 engines**, not the ~13 implied by operation-level mapping. The 4 are `number-frames`, `free-collect`, `cuisenaire-rods`, `bar-model`. All four pass Chesure's K.OA.A.1 PRIMARY check on the discrete-counter and within-10 constraints.

3. **Update `src/lib/standard-game-options.ts`** to consume this map rather than hard-coding two entries. The current file lists only K.OA.A.1 → [number-frames] and K.OA.A.3 → [number-frames-decompose]; this map adds three more PRIMARY engines for K.OA.A.1 and flags the K.OA.A.3 engine as REVISABLE (needs the multiplicity fix before exposure).

4. **Prioritize the four REVISABLE fixes that unblock K.OA pilots:**
   - `number-frames-decompose` multiplicity fix (K.OA.A.3) — Audit 11 §2 priority #1
   - `split-the-loot` multiplicity fix (K.OA.A.3)
   - `number-bonds` hide-third-until-commit fix (K.OA.A.3 and K.OA.A.4)
   - The unknown-factor mode on `assembly-line` / `bead-chain` / `checkerboard-multiply` (3.OA.A.4 cross-age preparedness)

5. **Create a 3.OA Mr. Chesure knowledge file** before the cross-age pilot ships at scale. The 3.OA mappings in this audit relied on the Progressions doc + Audit 11; a per-standard file analogous to `chesure-knowledge/k-oa-progressions.md` is missing and will be needed by Mr. Chesure when 3.OA Builder submissions arrive.

6. **Mechanic Inventor build queue (from §4):** the seven coverage-gap mechanic types listed in §4 are the natural input list for the first Mechanic Inventor run, prioritized by which standards are imminent.

## Files referenced

- `src/data/standard-mechanic-map.json` — the data file consumed by Step 4
- `src/data/standards.json` — verbatim CCSS standard text
- `src/lib/game-engines/game-option-registry.ts` — engine definitions (66 entries)
- `src/lib/standard-game-options.ts` — current verified mappings (2 entries; needs update per §6.3)
- `docs/audit/11-engine-library-per-engine.md` — engine-level VETTED/REVISABLE/HIDDEN verdicts
- `docs/agents/chesure-knowledge/k-oa-progressions.md` — K.OA pedagogy authority
- `docs/agents/the-critic.md`, `the-shortcut-adversary.md`, `the-mechanic-inventor.md` — agent reference frames

*Audit complete. Recommended next step: Barbara reviews the K.OA.A.1 PRIMARY list (4 engines) and approves expansion of `standard-game-options.ts` Step 4 mapping.*
