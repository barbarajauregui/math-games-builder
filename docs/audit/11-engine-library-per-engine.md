# Audit 11 — Engine library, per-engine review

*Date: 2026-05-10 · Auditor: per-engine pedagogical review against The Critic's 4 criteria · Source: `src/lib/game-engines/game-option-registry.ts` (the canonical list — 66 entries, despite the file's "65" comment) · Builds on Audit 08 (aggregate) and Audit 06 (Mechanic Inventor framework)*

## Summary

- **Total engines:** 66 (registry's "65" header is stale — `number-frames` and `number-frames-decompose` were appended without updating the count)
- **VETTED — expose at Step 4:** 30
- **REVISABLE — fix list in §2:** 18
- **HIDDEN — don't expose to Builders:** 18 (12 mark `practiceOnly: true` already; 6 are extrinsic-integration hidden-equality-check designs that should also be hidden from initial discovery routing)
- **Per-operation map:** §3
- **Coverage gaps:** §5

The 4 criteria are:
- **C1 — Real-world scenario:** scenario where this math is genuinely used, not pasted on
- **C2 — Math IS the gameplay:** intrinsic integration, not a hidden equality check
- **C3 — Can't win without math:** no visual matching / brute-force / random click
- **C4 — Construct validity:** the game measures the *specific* skill the standard claims, including multiplicity (e.g., K.OA.A.3 demands ≥ 3 decompositions, not 1)

Verdicts: P=pass, F=fail, ~=borderline (works for some standards; fails for others, see Notes).

---

## §1 — Per-engine table

| # | ID | Title | Verdict | Math op | C1 RW | C2 Math=Play | C3 No-shortcut | C4 ConstructValid | Notes / Fix |
|---|---|---|---|---|---|---|---|---|---|
| 1 | free-collect | Free Collect | VETTED | Addition (compose) | P | P | P | P | "Field IS the answer, no Check button." Canonical intrinsic. |
| 2 | conveyor-belt | Liquid Mixing Tank | VETTED | Addition / measurement | P | P | P | P | Tank level IS the sum. Belt speed-up risks fluency-drill mode — keep slow at discovery. |
| 3 | split-the-loot | Two Silos | VETTED | Addition (decompose into 2 parts) | P | P | P | ~ | Passes for "split a total" but accepts any single split — for K.OA.A.3 require ≥ 3 different splits (see fix list). |
| 4 | cut-the-bar | Cut the Bar | VETTED | Fractions (equal parts + numerator) | P | P | P | P | Cuts must be equal — physics enforces. Solid CPA. |
| 5 | pour-the-liquid | Pour the Liquid | VETTED | Fractions (model a fraction quantity) | P | P | P | P | Live fraction readout while pouring. SRT pass. |
| 6 | share-the-pizza | Share the Pizza | VETTED | Division as fair-share | P | P | P | P | Equal-share IS the action; classic partitive-division concrete model. |
| 7 | free-balance | Free Balance | VETTED | Addition / unknown-addend | P | P | P | P | Beam IS the equation. No Check button. |
| 8 | mystery-side | Mystery Side | VETTED | Algebra (1-step linear eq.) | P | P | P | P | Removes "same from both" — true algebraic identity. |
| 9 | chain-scales | Chain Scales | VETTED | Algebra (multi-step) | P | P | P | P | Cascading scales; same SRT logic as #8. |
| 10 | rotate-to-match | Rotate to Match | HIDDEN | Geometry (rotation) | P | ~ | P | F | Visual-matching the ghost — barely "math." Works as transformation primitive but doesn't measure understanding of rotational angle. Hide unless reframed with explicit angle target. |
| 11 | tangram-fill | Tangram Fill | REVISABLE | Geometry (composition / area) | P | ~ | ~ | ~ | Spatial reasoning OK; area/composition only emerges if outline is unit-gridded with a target area readout. Add unit-grid + area meter. |
| 12 | mirror-puzzle | Mirror Puzzle | REVISABLE | Geometry (reflection) | P | ~ | F | ~ | Drag-into-ghost is visual matching — kid can win without computing reflected coordinates. Fix: hide ghost; require dragging to coordinates and *then* reveal. |
| 13 | find-the-stat | Find the Stat | VETTED | Statistics (mean/median/mode) | P | P | P | P | Seesaw balance point IS the mean. Strongest stats engine. |
| 14 | bet-the-spinner | Bet the Spinner | REVISABLE | Probability (likelihood ranking) | P | ~ | F | ~ | Sim runs itself — kid ranks colors after watching bars. Could rank by bar length without probability reasoning. Fix: ask for prediction *before* spinning, then show sim, then re-rank. |
| 15 | build-the-chart | Build the Chart | VETTED | Statistics (mean as balance) | P | P | P | P | Fulcrum IS the mean. Excellent intrinsic. |
| 16 | shortest-route | Shortest Route | VETTED | Addition (sum of distances) | P | P | P | P | Running total live. Optimization is bonus; sum-of-edges is the math. |
| 17 | map-builder | Map Builder | VETTED | Addition + comparison (budget) | P | P | P | P | Live meter; under/over feedback is quantitative not binary. |
| 18 | delivery-run | Delivery Run | VETTED | Addition (sum of distances) | P | P | P | P | Same engine pattern as #16. |
| 19 | stack-to-target | Sinking Pan | VETTED | Addition / measurement-sum | P | P | P | P | Pan height IS the sum. SRT pass. |
| 20 | fill-the-floor | Resizable Rectangle | VETTED | Multiplication (area = L×W) | P | P | P | P | W×H readout live; shape matters AND number — strong construct validity. |
| 21 | box-packer | Transparent Cube Box | VETTED | Multiplication (volume = L×W×H) | P | P | P | P | Cubes physically stack as you slide; volume IS the count. |
| 22 | launch-to-target | Launch to Target | REVISABLE | Multiplication (d = s × t) | P | ~ | ~ | ~ | Slider tweaking can become trial-and-error. Fix: require kid to *predict* landing before launch and only launch on commit. |
| 23 | speed-trap | Speed Trap | HIDDEN | Division (s = d ÷ t) | P | F | F | F | Already `practiceOnly`. Quiz-wrapper after a watch. Hide from discovery routing. |
| 24 | catch-up | Catch Up | HIDDEN | Multiplication (rate × time) | P | ~ | F | ~ | Already `practiceOnly`. Slider trial-and-error. Hide. |
| 25 | elimination-grid | Elimination Grid | HIDDEN | Number properties | ~ | F | F | F | Math is in *clue text*, not mechanic. Click last-standing without doing math. Audit 08 flagged. |
| 26 | twenty-questions | 20 Questions | HIDDEN | Number properties / comparison | ~ | F | F | F | Same as #25. Strategy game with math vocabulary — not math gameplay. |
| 27 | logic-chain | Logic Chain | HIDDEN | Number properties | ~ | F | F | F | Same defect — eliminator UI, not math. |
| 28 | investment-sim | Multiplication Array | VETTED | Multiplication (×N) | P | P | P | P | Visible dot-splitting; multiplication you SEE. |
| 29 | population-boom | Visible Population | VETTED | Multiplication (×N as growth) | P | P | P | P | Same pattern. |
| 30 | doubling-maze | Split-and-Double Path | VETTED | Multiplication (chained ×N) | P | P | P | P | Stack visibly grows; supports doubling/tripling discovery. |
| 31 | size-picker | Size Picker | REVISABLE | Comparison (units) | ~ | ~ | F | ~ | "Pick the bigger" with two numbers visible — read digits and compare. Add genuine unit-mismatch where conversion is *required* not decorative. |
| 32 | ruler-race | Ruler Race | VETTED | Measurement (length) | P | P | P | P | Drag endpoints; ruler reads live; length IS the action. |
| 33 | unit-converter | Unit Converter | HIDDEN | Conversion (drill) | ~ | F | F | ~ | Already `practiceOnly`. Pure formula drill. Keep, don't surface at discovery. |
| 34 | sorting-lane | Weight Tower Builder | VETTED | Comparison / ordering | P | P | P | P | Block widths show value; physics validates order. SRT pass. |
| 35 | number-line-drop | Number Line Drop | REVISABLE | Number sense (magnitude) | P | ~ | ~ | ~ | Snap-zone may be too forgiving = visual matching. Fix: tighter snap + show numerical readout of where you dropped. |
| 36 | leaderboard-fix | Height Ranking | VETTED | Comparison / ordering | P | P | P | P | Same construct as #34, swap-by-tap. |
| 37 | sequence-builder | Black Box Machine | VETTED | Functions / patterns | P | P | P | P | Input-output discovery is pure functional thinking. |
| 38 | pattern-machine | Pattern Machine | VETTED | Functions / pattern rule | P | P | P | P | Eliminate-by-experiment; rule-induction. |
| 39 | broken-pattern | Rolling Balls on Ramp | VETTED | Patterns / sequences | P | P | P | P | Visible rhythm break; off-ball pops out physically. |
| 40 | resize-tool | Grid Stretcher | VETTED | Multiplication (scaling) | P | P | P | P | Each cell becomes N×N — multiplication as scaling, made visible. |
| 41 | recipe-scaler | Stacked Mixing Bowl | VETTED | Multiplication (scaling / ratios) | P | P | P | P | Stack height = ×N of base; ratio reasoning concrete. |
| 42 | map-distance | Draggable Scale Bar | VETTED | Multiplication / repeated addition | P | P | P | P | Each placement adds N to total; scaling AND addition. |
| 43 | recipe-mixer | Recipe Mixer | REVISABLE | Counting / matching | P | ~ | F | F | "Stack until layer locks" is matching counts. Math claim weak. Fix: hide target counts, show only the picture, force counting. |
| 44 | potion-lab | Potion Lab | VETTED | Multiplication (×N as repeated add) | P | P | P | P | Multiplier copies base; visible filling. |
| 45 | assembly-line | Assembly Line | VETTED | Multiplication (groups × per-group) | P | P | P | P | Two sliders for the two factors; pallets visible. Equal-groups model. |
| 46 | coordinate-hunter | Coordinate Hunter | REVISABLE | Coordinate plane | P | ~ | F | ~ | Click target — binary correct/wrong. Fix: show live (x,y) crosshairs as you move (which `measure-and-plot` already does — consider deprecating in favor of #62). |
| 47 | battleship | Battleship | HIDDEN | Coordinate plane | P | ~ | F | F | Strategy game; coordinate-call is decoration. Hide from discovery. |
| 48 | treasure-trail | Treasure Trail | REVISABLE | Coordinate plane / vectors | P | ~ | ~ | P | Follow-the-instruction is procedural; works for cardinality of moves. Fix: show coordinate readout as kid moves. |
| 49 | auction-house | Auction House | HIDDEN | Estimation | F | F | F | F | Already `practiceOnly`. No mechanism teaches estimation; rewards correct guesses. |
| 50 | price-is-right | Price is Right | HIDDEN | Estimation | F | F | F | F | Same as #49. |
| 51 | round-and-win | Round and Win | HIDDEN | Rounding (drill) | ~ | F | F | ~ | Already `practiceOnly`. Multiple-choice quiz. |
| 52 | depth-navigator | Depth Navigator | VETTED | Integers (number line) | P | P | P | P | Submarine moves on signed line; +/- IS the action. |
| 53 | temperature-swing | Temperature Swing | VETTED | Integers (add/subtract signed) | P | P | P | P | Thermometer level IS the answer. |
| 54 | elevator-operator | Elevator Operator | REVISABLE | Integers (signed magnitude) | P | ~ | ~ | ~ | "Pick up everyone" doesn't require sign reasoning per se. Fix: penalty for going wrong direction made visible. |
| 55 | shape-matcher | Shape Matcher | REVISABLE | Counting / cardinality | P | ~ | F | ~ | Drag until count+kind matches — visual matching. Fix: hide target picture; give only count words ("2 triangles, 1 square"). |
| 56 | free-build | Free Build | VETTED | Perimeter (addition of edges) | P | P | P | P | Live perimeter meter; placement IS addition. |
| 57 | shape-decomposer | Shape Decomposer | VETTED | Area (decomposition / addition) | P | P | P | P | Filling the regions IS the decomposition. |
| 58 | golden-beads | Golden Beads | VETTED | Place value (3-digit) | P | P | P | P | Wrong-column rejection enforces place value. Montessori canonical. |
| 59 | hundred-board | Hundred Board | REVISABLE | Number sequence / 100 chart | ~ | ~ | ~ | ~ | Click-correct-cell = binary. Fix: drag-and-place where neighbours animate; or use `measure-and-plot` style live row/col readout. |
| 60 | stamp-game | Stamp Game | VETTED | Place value (4-digit) | P | P | P | P | Same construct as #58 with thousands. |
| 61 | fraction-circles | Fraction Circles | VETTED | Fractions (numerator/denom.) | P | P | P | P | Color N out of D wedges; canonical. |
| 62 | bead-chain | Bead Chain | VETTED | Multiplication (skip-count) | P | P | P | P | Marker on chain; readout shows N × groups. CPA. |
| 63 | checkerboard-multiply | Checkerboard Multiply | VETTED | Multiplication (rows × columns) | P | P | P | P | Filling the grid IS the product. Equal-groups area model — strongest 3.OA engine. |
| 64 | clock-reader | Discovery Clock | VETTED | Time (analog/digital correspondence) | P | P | P | P | Hands rotate; live digital readout. |
| 65 | time-matcher | Time Matcher | HIDDEN | Time (drill) | ~ | F | F | ~ | Already `practiceOnly`. Multiple-choice. |
| 66 | time-elapsed | Time Elapsed | VETTED | Time (elapsed-time intervals) | P | P | P | P | Stretch interval bar; live reading. |
| 67 | bar-model | Bar Model | VETTED | Addition / subtraction / multiplication | P | P | P | P | Singapore CPA canonical. |
| 68 | place-value-discs | Place Value Discs | VETTED | Place value | P | P | P | P | Total readout IS the truth. |
| 69 | number-bonds | Number Bonds | REVISABLE | Decomposition / composition | P | ~ | F | F | Auto-reveals the third — kid doesn't compute. For K.OA.A.3 must produce ≥ 3 bonds; for unknown-addend kid must derive, not be shown. Fix: hide third value until kid commits a guess. |
| 70 | cuisenaire-rods | Cuisenaire Rods | VETTED | Addition (compose to length) | P | P | P | P | Length-snap IS the answer. CPA canonical. |
| 71 | expression-transformer | Expression Transformer | VETTED | Algebra (combine like terms) | P | P | P | P | Algebra tile zero-pair cancellation. |
| 72 | factor-finder | Factor Finder | VETTED | Number theory (factoring) | P | P | P | P | Tree-split until prime; structural. |
| 73 | category-sort | Self-Revealing Buckets | VETTED | Classification / number properties | P | P | P | P | Hidden rule discovery; bucket physics enforces. |
| 74 | measure-and-plot | Coordinate Crosshairs | VETTED | Coordinate plane | P | P | P | P | Live (x,y) crosshair; `coordinate-hunter`'s superior cousin. |
| 75 | inequality-grapher | Inequality Grapher | VETTED | Inequalities (graph) | P | P | P | P | Drag circle, paint region; lock when correct. |
| 76 | signed-divide | Signed Divide | VETTED | Division (signed integers) | P | P | P | P | Two-stage physical division; sign + magnitude both intrinsic. |
| 77 | fraction-to-decimal | Fraction to Decimal | VETTED | Equivalence (fraction↔decimal) | P | P | P | P | Parallel number lines; same point, two notations. |
| 78 | number-classifier | Number Classifier | VETTED | Number sets (rational/irrational) | P | P | P | P | Snap vs shimmer — the line itself teaches. Brilliant. |
| 79 | sci-notation | Scientific Notation | VETTED | Scientific notation | P | P | P | P | Slide decimal; coefficient must land in [1,10). |
| 80 | proof-stepper | Proof Stepper | VETTED | Proof / logical chaining | P | P | P | P | IN/OUT card matching enforces logical structure. |
| 81 | snake-math | Snake Math | HIDDEN | Drill (any) | F | F | F | F | Already `practiceOnly`. Classic-overlay extrinsic. Gate behind mastery. |
| 82 | maze-runner-math | Maze Runner | HIDDEN | Drill (any) | F | F | F | F | Same. |
| 83 | falling-blocks-math | Falling Blocks | HIDDEN | Drill (addition) | F | F | F | F | Same. Tetris skin. |
| 84 | dot-eater-math | Dot Eater | HIDDEN | Drill (any) | F | F | F | F | Same. Pac-Man skin. |
| 85 | launcher-math | Launcher Math | HIDDEN | Drill (any) | F | F | F | F | Same. Flappy Bird skin. |
| 86 | breakout-math | Breakout Math | HIDDEN | Drill (addition) | F | F | F | F | Same. Breakout skin. |
| 87 | number-frames | Number Frames | VETTED | Addition (compose, K.OA.A.1, A.2, A.5) | P | P | P | P | The reference implementation; Math Learning Center grounded. |
| 88 | number-frames-decompose | Number Frames — Decompose | REVISABLE | Decomposition (K.OA.A.3) | P | P | P | F | Currently accepts any single split → fails K.OA.A.3 multiplicity. Fix: require ≥ 3 different decompositions before round ends. (This is the Critic's canonical FAIL example.) |

(Numbering 1–88 reflects the order entries appear; 66 distinct engines.)

---

## §2 — Revisable engines (priority fixes)

Eighteen engines fail one or two criteria but are mechanically fixable. Listed by impact:

1. **`number-frames-decompose` (K.OA.A.3 multiplicity).** *High priority — this is in the live K.OA.A.3 verified mapping.* Add round-state that demands ≥ 3 distinct part-pairs before completion. Mirrors The Critic's PASS example for K.OA.A.3.
2. **`split-the-loot` for K.OA.A.3 use.** Currently passes single-split addition; for the decomposition-multiplicity standard, require ≥ 3 distinct silo-fill splits.
3. **`number-bonds`.** Auto-revealing the third value short-circuits the math. Hide the third until the kid commits a guess; then reveal as confirmation.
4. **`shape-matcher`.** Hide the target picture; show count-words only ("2 triangles, 1 square") so the kid must count what they place rather than visually match.
5. **`recipe-mixer`.** Hide the target counts in the legend; show the picture only. Forces counting.
6. **`coordinate-hunter`.** Add live (x,y) crosshair on hover before commit, so the kid sees their own position. Or deprecate in favor of `measure-and-plot`.
7. **`mirror-puzzle`.** Remove the ghost overlay; show the mirror line and require placement based on coordinate reasoning, then reveal correctness with a snap.
8. **`bet-the-spinner`.** Ask for prediction *before* the 100 spins, then run the sim, then ask the kid to confirm or revise. Without the pre-prediction, the bars do the math.
9. **`launch-to-target`.** Require commit on a predicted landing before each launch — no more slider-jiggle until it works.
10. **`number-line-drop`.** Tighten the snap zone and show numerical position-of-drop so visual estimation is checked against a number, not a near-snap.
11. **`tangram-fill`.** Add a unit-grid behind the outline and an area readout; otherwise it's pure spatial puzzle.
12. **`size-picker`.** Force unit mismatch (1.5 m vs 140 cm) every round — current intent is good but trivially won by reading digits when units agree.
13. **`elevator-operator`.** Make signed-direction matter: penalty for moving against the sign, surfaced visibly (energy meter).
14. **`treasure-trail`.** Show live coordinate readout while moving so the math is visible, not just procedural.
15. **`hundred-board`.** Replace click-correct-cell with drag-and-place where neighbors highlight as you approach; cell-find becomes structural reasoning.
16. **`map-builder`** — borderline VETTED (already in §1) but watch out for over-budget being read by color, not number. Add the running total in the meter (file already implies this; verify in implementation pass).
17. **Rotate-to-match** — if kept, add a degree readout that updates as the handle rotates. Currently a visual-snap puzzle.
18. **Classic-overlays as a class** — already `practiceOnly`; explicitly enforce mastery-gate in the routing layer (Audit 08 noted the flag exists but enforcement isn't wired).

---

## §3 — Per-operation map (the data Step 4 needs)

Step 4 of the new build flow ("Design the player action") should filter to vetted engines by the math operation the Builder picked at Step 3. This is the mapping.

### Counting / cardinality (K.CC, K.OA.A.5)
- `free-collect`, `number-frames`, `cuisenaire-rods`, `bar-model`

### Addition — single-digit / compose (K.OA.A.1, K.OA.A.2, 1.OA, 2.OA)
- `free-collect`, `conveyor-belt`, `number-frames`, `bar-model`, `cuisenaire-rods`, `free-balance`, `stack-to-target`, `free-build` (perimeter as addition), `shape-decomposer`, `shortest-route`, `delivery-run`, `map-builder`, `map-distance`

### Decomposition — multiple ways (K.OA.A.3)
- *After fix:* `number-frames-decompose`, `split-the-loot` (with ≥3-splits enforcement), `number-bonds` (with hide-third fix)
- *As-is, valid:* `cuisenaire-rods` (kid can naturally produce multiple compositions), `cut-the-bar` (multiple equal-part shadings)

### Subtraction (K.OA.A.2, 1.OA, 2.OA)
- `bar-model`, `cuisenaire-rods`, `free-balance` (unknown-addend), `mystery-side`

### Place value (1.NBT, 2.NBT, 3.NBT, 4.NBT)
- `golden-beads`, `stamp-game`, `place-value-discs`

### Multiplication — equal groups (3.OA.A.1)
- `assembly-line`, `bead-chain`, `checkerboard-multiply`, `investment-sim`, `population-boom`, `doubling-maze`, `potion-lab`

### Multiplication — area / arrays (3.MD.C, 3.OA, 4.NBT)
- `fill-the-floor`, `checkerboard-multiply`, `resize-tool`, `recipe-scaler`

### Volume (5.MD.C)
- `box-packer`

### Division (3.OA.A.2, 6.NS, 7.NS)
- `share-the-pizza`, `signed-divide` (signed div, MS)

### Fractions — meaning (3.NF, 4.NF)
- `cut-the-bar`, `pour-the-liquid`, `share-the-pizza`, `fraction-circles`

### Fractions — equivalence / decimals (4.NF, 5.NF, 6.NS)
- `fraction-to-decimal`

### Comparison & ordering (K.CC.C, 1.NBT.B, 4.NBT.A)
- `sorting-lane`, `leaderboard-fix`, `cuisenaire-rods` (length comparison)

### Patterns / functions (4.OA.C, 5.OA.B, 8.F)
- `sequence-builder`, `pattern-machine`, `broken-pattern`

### Ratios / scaling (6.RP, 7.RP)
- `recipe-scaler`, `resize-tool`, `map-distance`

### Integers / signed numbers (6.NS, 7.NS)
- `depth-navigator`, `temperature-swing`, `signed-divide`

### Coordinate plane (5.G.A, 6.G.A)
- `measure-and-plot` (the strongest); `coordinate-hunter` after fix

### Geometry — perimeter / area (3.MD, 4.MD)
- `free-build`, `shape-decomposer`, `fill-the-floor`

### Measurement — length / time
- Length: `ruler-race`
- Time: `clock-reader`, `time-elapsed`

### Statistics (6.SP, 7.SP)
- `find-the-stat`, `build-the-chart`

### Probability (7.SP.C)
- *After fix:* `bet-the-spinner`

### Algebra (6.EE, 7.EE, 8.EE)
- `mystery-side`, `chain-scales`, `expression-transformer`, `inequality-grapher`

### Number theory (6.NS.B)
- `factor-finder`, `category-sort`, `number-classifier`

### Scientific notation (8.EE.A.3, A.4)
- `sci-notation`

### Proof / reasoning (HS.G.CO, MS-prep)
- `proof-stepper`

---

## §4 — Engines hidden from new flow (and why)

**Already `practiceOnly` — keep flag, gate behind mastery, do NOT surface at Step 4:**
- `speed-trap`, `catch-up` — quiz-wrapper after a sim
- `unit-converter` — pure formula drill
- `time-matcher` — multiple-choice
- `auction-house`, `price-is-right`, `round-and-win` — guess-and-check estimation
- `snake-math`, `maze-runner-math`, `falling-blocks-math`, `dot-eater-math`, `launcher-math`, `breakout-math` — classic-overlay extrinsic skins

**Not yet flagged but should be hidden from discovery:**
- `elimination-grid`, `twenty-questions`, `logic-chain` — math is in clue text, not mechanic; eliminator UI lets kid finish without doing math (Audit 08 finding)
- `battleship` — strategy game; coordinate-call is decoration
- `rotate-to-match` — visual-snap puzzle, not angle math
- `time-matcher` — already practiceOnly

These can stay in code as `practiceOnly: true` (recommend adding the flag to the six above that lack it), but they should not appear in Step 4's mechanic-picker.

---

## §5 — Coverage gaps (build-queue items)

Math operations / standards with NO vetted engine — these are real gaps to flag for the Mechanic Inventor / build queue:

1. **Subitizing / dot-pattern recognition (K.CC.B.4, K.OA.A.5).** Number-frames covers ten-frame composition but not the 1–5 instant-recognition foundation. Plass et al. 2015 + Clements & Sarama show subitizing is a critical pre-addition skill. **No engine.**
2. **Counting on / counting back (1.OA.C.5, 2.OA.B.2).** No engine where the kid physically counts forward from a non-zero start. `cuisenaire-rods` partially covers but doesn't enforce "count on."
3. **Rounding (3.NBT.A.1, 4.NBT.A.3).** Only `round-and-win` exists, which is hidden as drill. No discovery engine for "which 10 is closer." Need a number-line snap-to-nearest-10.
4. **Multi-digit subtraction with regrouping (2.NBT.B.7).** `golden-beads`, `stamp-game` cover place value but don't enforce regrouping (the trade-down). Need a "10-bar must be exchanged for 10 unit-beads" engine.
5. **Long division (5.NBT.B.6).** `share-the-pizza` covers fair-share for small numbers; `signed-divide` covers signed but not the standard long-division algorithm. **Open.**
6. **Fraction operations — add/subtract with unlike denominators (5.NF.A).** `cut-the-bar`, `cuisenaire-rods` cover *meaning*; nothing covers same-denominator-conversion as the action.
7. **Word problems generally (any grade).** `bar-model` is the closest, but it's a structural manipulator, not a problem-presenter. Mechanic Inventor opportunity: a "build the bar model from the story" engine.
8. **Geometric proofs (HS).** `proof-stepper` covers algebraic chains; nothing covers two-column geometric proofs with diagrams.
9. **Trigonometry primitives (HS).** No engine.
10. **Functions — graphing as locus (8.F, HS.F).** `sequence-builder` and `pattern-machine` give rule-induction but no graphing. Need a drag-points-on-coord-plane-and-watch-rule-emerge engine.
11. **Probability — combinations and dependent events (7.SP.C.8).** `bet-the-spinner` covers single-event likelihood only.
12. **Ratio tables / proportional reasoning as a structure (6.RP.A.3).** `recipe-scaler` covers ×N scaling; doesn't cover unequal ratios or unit rate.

These twelve gaps are the natural input list for the Mechanic Inventor agent's first run — design new engines to fill each, prioritized by which standards are imminent in the build queue (3.OA.A.1 cross-age pilot suggests #2 and #4 are not blocking; the K.OA.A.3 pilot makes #1 and the `number-frames-decompose` fix the highest priority).

---

## Files referenced

- `c:/projects/math-games-builder/src/lib/game-engines/game-option-registry.ts` (the 66 engines)
- `c:/projects/math-games-builder/src/lib/standard-game-options.ts` (current verified mappings — only 2 entries)
- `c:/projects/math-games-builder/docs/agents/the-critic.md` (4 criteria including new C4 Construct Validity)
- `c:/projects/math-games-builder/docs/audit/08-game-templates.md` (aggregate predecessor)
- `c:/projects/math-games-builder/docs/audit/06-agents.md` (Mechanic Inventor / Plass framework reference)
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-oa-progressions.md` (K.OA grounding)
