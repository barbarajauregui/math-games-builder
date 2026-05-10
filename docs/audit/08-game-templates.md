# Audit 08 — Reusable Game Templates: Math-Mechanic Alignment

*Date: 2026-05-10 · Auditors: game-designer-with-math-ed-background persona + math-educator persona · Cap: ~$2 search spend (used ~$0.05)*

## Scope and methodology

The user-facing CLAUDE.md names three "reusable game templates": **Sum Jumper**, **Wall Builder**, and **Circuit Board Builder** (the last flagged deprecated). Code reading shows these are not three peer engines — they are at three different layers of the stack:

| Name | What it actually is in code | File |
|---|---|---|
| Sum Jumper | A 1-paragraph **scenario prompt string** (Game Style #1) shoved into the AI generation pipeline | `src/components/builders/builder-picker.tsx` lines 30 |
| Wall Builder | A 1-paragraph **scenario prompt string** (Game Style #2) for the same pipeline | `src/components/builders/builder-picker.tsx` line 31 |
| Circuit Board Builder | A **meta-builder UI component** that lets a learner pick from 65 hand-crafted "game options" across 24 mechanics — the components are the actual templates | `src/components/standard/circuit-board-builder.tsx` + `src/lib/game-engines/game-option-registry.ts` |

So this audit treats **Sum Jumper** and **Wall Builder** as scenario prompts (audited as written), and treats **Circuit Board Builder** as a *system* whose pedagogical character is the union of the 65 options it routes to (audited at the system level, with spot-checks of representative options).

**Research anchor:** Habgood & Ainsworth (2011), "Motivating Children to Learn Effectively: Exploring the Value of Intrinsic Integration in Educational Games," *Journal of the Learning Sciences*. ERIC EJ922627. Two studies showed children learned significantly more from a game when math was *intrinsically integrated* into the core mechanic (the math IS the gameplay) than when it was *extrinsically integrated* (math problems wrapped around a fun shell). This is the seminal empirical result behind positioning §core-belief 2 ("Math IS the gameplay"). Replicated in Echeverria et al. 2012 (physics, EJ967019), Denham 2016 (multiplication, EJ1105510), Shi et al. 2022 (quadratic functions in VR, EJ1345194), and reviewed in Walkington 2020 (ED612086).

---

## Template 1 — Sum Jumper

**Source:** `c:/projects/math-games-builder/src/components/builders/builder-picker.tsx` line 30. Verbatim scenario string:

> "A platformer game where a character jumps between platforms. Each level has a locked door with a target number. The player must collect objects from TWO SEPARATE platforms (e.g., 3 stars on one platform, 4 stars on another) that add up to the target number to unlock the door. Wrong combinations = door stays locked. The player physically jumps to gather and combine groups. Add smooth jumping physics, colorful platforms, and satisfying door-unlock animations."

### 1. Standards claimed
None explicit. The scenario shows up only when `standardId` is K.OA.A.1-shaped (decompose / put-together-add-to within 10 — see the SCENARIOS list above it which all describe addition stories). Effectively claims **K.OA.A.1, K.OA.A.2, K.OA.A.3** (composition/decomposition within 10).

### 2. Does the mechanic require the learner to do the math?
**Partially.** The learner picks two platforms and "wrong combinations = door stays locked." That is a binary correct/incorrect check, which means the **system** is performing the addition (3 + 4 vs target = 7) and reporting the result via a door state. The learner is choosing groups; they are not summing them. A learner could brute-force every pair of platforms until the door opens.

This violates positioning §core-belief 1 ("the learner does the math — never the system"). Compare to a true intrinsic-integration version: counters from each platform fly into a visible bin where they physically combine and the bin's count IS the answer (the `number-frames` and `free-collect` patterns in the registry already do this).

### 3. Discovery test
**Fails.** A learner who doesn't already understand addition cannot infer from the door-locked feedback *why* 3+4 unlocks but 2+4 doesn't. The feedback signal is "right/wrong," not "the quantity 3 combined with the quantity 4 produces the quantity 7." There is no representational bridge.

### 4. Self-Revealing Truth test
**Fails.** Correctness is shown by an external state machine (door = locked|unlocked) attached to a hidden numeric check. The world physics (jumping, collecting) does not reveal the sum; the door arbitrarily reacts to it. This is exactly the "sugar coating" pattern Habgood & Ainsworth (2011) identify as extrinsic integration.

### 5. Research support
**Weak.** The mechanic is platformer-with-correctness-gate, which is a textbook extrinsic-integration design. Habgood & Ainsworth's "Zombie Division" study found this style produces lower learning gains than intrinsic versions even when the surface theme is identical. Denham 2016 (EJ1105510) replicated this for multiplication. The "physical jumping to gather" framing gestures at embodied cognition but the addition itself remains symbolic and hidden.

### 6. Shortcut Adversary
**Severe shortcut available.** With platforms typically holding 1–10 stars and only a handful of platforms per level, a non-counting learner can:
- Try platform pairs systematically until the door opens (combinatorial brute force; ~6 tries on average for 4 platforms)
- Pattern-match the visual cluster sizes against a remembered target without ever counting
- Memorize the level layout if levels repeat

A learner can "win" every level without ever performing or even understanding addition.

### Proposed changes
Rewrite the scenario string so the addition is **load-bearing for the world physics**, not gated by a hidden check. Concrete edits:

```diff
- The player must collect objects from TWO SEPARATE platforms (e.g., 3 stars on one platform,
- 4 stars on another) that add up to the target number to unlock the door. Wrong combinations =
- door stays locked.
+ Stars from each platform visibly fly into a transparent jar at the door. The jar has a fill
+ line at the target. When the jar's star count exactly equals the fill line, the door dissolves;
+ if the jar overflows the line, stars spill back out. There is no hidden check — the jar's
+ visible level IS the sum, and the door reacts to the jar, not to a number.
```

This converts Sum Jumper into a platformer skin over the existing `free-collect` (resource-management) option, which is the same pattern that already passes the Discovery and SRT tests. **Recommended:** delete the standalone scenario string and, when a learner picks "Sum Jumper" in the builder, route them through the Circuit Board Builder pre-filtered to `free-collect` + platformer theme overlays.

---

## Template 2 — Wall Builder

**Source:** `c:/projects/math-games-builder/src/components/builders/builder-picker.tsx` line 31. Verbatim:

> "A tower defense game where enemies march toward a castle. Each gate shows a required strength number (within 10). The player must drag TWO SEPARATE groups of defenders (e.g., 3 shields from one area + 5 swords from another) onto the gate. If the groups add up to the required number, the wall holds and enemies bounce off with a satisfying effect. If not, the wall cracks."

### 1. Standards claimed
Same as Sum Jumper — implicitly K.OA.A.1/A.2/A.3 ("within 10" matches K.OA.A scope).

### 2. Does the mechanic require the learner to do the math?
**No — same defect as Sum Jumper.** The wall holds iff defenders' counts sum to the gate value. That comparison is performed by the system; the learner picks groups. The visible feedback (wall holds / cracks) is binary state, not a quantity reveal.

Slightly **worse** than Sum Jumper because tower-defense framing adds *time pressure* (enemies marching), which encourages guess-and-check over reflection. Time pressure plus binary feedback is the signature of a fluency-drill skin, not a discovery mechanic.

### 3. Discovery test
**Fails.** A learner who doesn't know 3+5=8 cannot derive it from "wall held" any more reliably than from a popup. The shields and swords are decorative — their *count* is what matters, but the count is never visually summed.

### 4. Self-Revealing Truth test
**Fails.** "Wall holds" / "wall cracks" is a popup in costume. Compare positioning §core-belief 2: "correctness is shown by game-world physics." Wall integrity here is not a physical consequence of strength addition; it is a scripted state attached to a hidden equality check.

### 5. Research support
**Weak / negative.** Tower-defense math games are one of the most common extrinsic-integration patterns in commercial edtech (Prodigy uses this shape extensively). No peer-reviewed result we found supports tower-defense + arithmetic as producing learning gains beyond worksheet baseline; Habgood & Ainsworth's (2011) framework predicts it would *underperform* an intrinsic alternative on the same content. Denham (2016) explicitly redesigned a multiplication game *away* from this pattern after playtesting showed children weren't learning.

### 6. Shortcut Adversary
**Severe.** With "within 10" and typical defender counts of 1–9, every level has only a handful of valid pairs. Strategies that win without doing the math:
- Drag random pairs; wall holds half the time at small N
- Match visual cluster size by **eye** against gate height (no counting required)
- Memorize that "the big shield group + the small sword group works on this gate"
- Chain levels: if a level repeats, just remember last attempt's working pair

A non-counting 5-year-old can succeed by visual-size-matching alone.

### Proposed changes
Same fix as Sum Jumper, with theme-appropriate skin:

```diff
- If the groups add up to the required number, the wall holds and enemies bounce off with a
- satisfying effect. If not, the wall cracks.
+ The gate has a transparent strength meter with a target line. Each defender dropped onto the
+ gate visibly raises the meter by their unit value (a 3-shield group raises it 3 units; a
+ 5-sword group raises it 5 units). When the meter exactly meets the target line, the gate
+ glows and locks at full strength; overshoot makes the gate buckle from over-bracing. The
+ meter level IS the sum.
```

Or, more aggressively: delete this scenario and route "Wall Builder" intent through the Circuit Board Builder's `free-collect` or `stack-to-target` (construction-systems) options — both already pass the SRT test.

---

## Template 3 — Circuit Board Builder (system-level audit)

**Source:** `c:/projects/math-games-builder/src/components/standard/circuit-board-builder.tsx` (UI) + `src/lib/game-engines/game-option-registry.ts` (the 65 options across 24 mechanics).

The Circuit Board Builder itself doesn't ship a single math mechanic; it routes a learner to one of 65 options. So the audit question is: **does the option library, taken as a whole, embody the positioning principles?** And: **is "deprecated" warranted?**

### 1. Standards covered
The 65 options collectively claim coverage across roughly K–8: K.OA addition (number-frames, free-collect), 1–2 place value (golden-beads, stamp-game, place-value-discs), 2–3 multiplication as equal groups (bead-chain, checkerboard-multiply, multiplication-array, assembly-line), 3–4 fractions (cut-the-bar, fraction-circles, share-the-pizza), 4–5 area/perimeter (free-build, fill-the-floor, shape-decomposer), 5–6 ratios/proportion (recipe-scaler, map-distance), 6–7 integers (depth-navigator, signed-divide), 7–8 algebra (mystery-side, chain-scales, expression-transformer, proof-stepper), 8 scientific notation (sci-notation), 8 statistics (find-the-stat, build-the-chart). Per-standard mappings live in `src/lib/standard-game-options.ts` (referenced but not read in this audit).

### 2. Does the mechanic require the learner to do the math?
**Mostly yes, by design — but unevenly.** Spot-check classification of all 65 options:

**Strong intrinsic integration (~38 options, ~58%)** — math IS the mechanic, no hidden check:
- `free-collect`, `conveyor-belt`, `split-the-loot` (resource-management): "field grows/locks when it matches target — no Check button"
- `cut-the-bar`, `share-the-pizza` (partitioning)
- `free-balance`, `mystery-side`, `chain-scales` (balance-systems): the beam IS the equation
- `find-the-stat`, `build-the-chart` (probability): "the seesaw's balance point IS the mean"
- `stack-to-target`, `fill-the-floor`, `box-packer` (construction): "W × H updates live"
- `golden-beads`, `stamp-game`, `bead-chain`, `checkerboard-multiply` (Montessori): well-grounded in 100-year-old proven materials
- `bar-model`, `place-value-discs`, `number-bonds`, `cuisenaire-rods` (Singapore CPA): the rods/discs ARE the math
- `expression-transformer`, `factor-finder`, `category-sort` (standard-pedagogy)
- `inequality-grapher`, `signed-divide`, `fraction-to-decimal`, `number-classifier`, `sci-notation`, `proof-stepper` (middle-school-gaps)
- `free-build`, `shape-decomposer` (build-structure): "Placement IS addition — no Add button, no Check button"
- `number-frames`, `number-frames-decompose`: the existing K.OA.A.1 reference implementation

**Borderline / weak (~15 options, ~23%)** — math is represented but a hidden check still mediates correctness:
- `rotate-to-match`, `tangram-fill`, `mirror-puzzle` (spatial): geometric, low math content
- `bet-the-spinner`: ranking task after watching a sim — the sim does the work
- `shortest-route`, `map-builder`, `delivery-run` (path-optimization): running total updates live (good), but the optimization criterion ("shorter than last try") is a system judgment
- `shape-matcher` (build-structure): "matches in count and kind" — system judges
- `hundred-board`: click correct cell — binary correct/wrong
- `coordinate-hunter`, `battleship`, `treasure-trail` (terrain-generation): click target coordinate — binary
- `time-elapsed`, `clock-reader` (time): live readouts (good)
- `sequence-builder`, `pattern-machine`, `broken-pattern` (timing-rhythm): pattern discovery, depends on implementation

**Practice-only / explicit drill (~8 options, ~12%)** — `practiceOnly: true` flag honestly marks them: `speed-trap`, `catch-up`, `unit-converter`, `time-matcher`, `auction-house`, `price-is-right`, `round-and-win`, plus the six classic-overlays (`snake-math`, `maze-runner-math`, `falling-blocks-math`, `dot-eater-math`, `launcher-math`, `breakout-math`). The classic-overlays are textbook extrinsic-integration ("eat the food with the right answer") — appropriate as fluency drill *after* mastery, but they should never appear before discovery.

**Failures (~4 options)** — claim intrinsic but actually extrinsic:
- `elimination-grid`, `twenty-questions`, `logic-chain` (constraint-puzzles): the "math" being learned (number properties) is the *clue text*, not the mechanic. A learner who can't do the math just clicks numbers until one is left. Shortcut Adversary destroys these.
- `auction-house`, `price-is-right`, `round-and-win` (bidding-auction): all three flagged practiceOnly, but the introText for `auction-house` says "Estimate the value" — there is no mechanism that *teaches* estimation; it just rewards correct guesses.

### 3. Discovery test (system-level)
**Pass for ~58% of options, fail for ~42%.** The strong-intrinsic options each pass — a learner manipulating Cuisenaire rods, a balance scale, a number-bond, a ten-frame, or a Montessori bead chain genuinely can derive the underlying math from the manipulation. The classic-overlays and constraint-puzzles fail outright.

### 4. SRT test (system-level)
**Same split.** The introText/helpText fields for the strong options consistently use phrasing like "no Check button," "the field IS the answer," "the bar reads live," "the beam levels," "the rods snap-lock when exact" — these are deliberate SRT-pass designs. The failing ~42% rely on hidden equality checks dressed up as game state.

### 5. Research support
**Strong for the Montessori, Singapore CPA, and balance-scale subsets.** These are the most evidenced concrete-representational manipulatives in mathematics education research, with literature spanning Montessori (1909–present), Bruner's CRA framework (1966), and the Singapore Bar Model (corpus of TIMSS-correlated studies, e.g., Hoven & Garelick 2007 in *Educational Leadership*). Walkington 2020 (ERIC ED612086) explicitly endorses the intrinsic-integration approach the strong subset uses.

**Weak for the constraint-puzzles and classic-overlays.** No peer-reviewed support found for "snake-math"-style overlays as primary instruction; Denham 2016 (EJ1105510) is the canonical caution against this pattern.

### 6. Shortcut Adversary (system-level)
The strong-intrinsic options are largely shortcut-resistant because the world-state IS the answer — there is nothing to brute-force. The weak/failing options are highly shortcut-vulnerable for the reasons listed above.

### "Deprecated" — is it warranted?
The CLAUDE.md flag of Circuit Board Builder as deprecated appears to be about the *UI surface* (the meta-picker for 65 options is being demoted as part of the Library-as-home pivot), not about the option library itself. **The option library is the most valuable pedagogical asset in the codebase and should NOT be deprecated.** Recommend:
- Keep the option library.
- Demote the Circuit Board *UI* (the picker) — Builders should be routed to the right mechanic by Mr. Chesure / the design-brief, not by an open shelf of 65 tiles.
- Prune the ~12 failing options or move them firmly behind `practiceOnly: true` with the post-mastery unlock the flag implies.

### Proposed changes (Circuit Board Builder system)
1. **Add a `srtPasses: boolean` field** to `GameOptionDef` and audit each of the 65 entries against the test. Hide `srtPasses: false` options from initial-discovery routing; keep them only for fluency-after-mastery.
2. **Move `elimination-grid`, `twenty-questions`, `logic-chain`, `hundred-board`, `coordinate-hunter`, `battleship`, `treasure-trail`, and `shape-matcher`** to `practiceOnly: true` until/unless their introText is rewritten to make the math load-bearing for world physics.
3. **Re-mark all six `classic-overlays`** with a stronger gate than `practiceOnly` — they should require an explicit Mastered status on the relevant standard before they unlock at all (the helpText already says "unlocks after you've mastered this concept" but the field that enforces it isn't wired up here).
4. **Delete or fix `auction-house`, `price-is-right`, `round-and-win`.** Estimation is teachable intrinsically (an arrow lands closer/farther on a number line), but as currently described these three are guess-and-check.

---

## Cross-template summary

| Template | Standard claimed | Discovery | SRT | Shortcut | Research |
|---|---|---|---|---|---|
| Sum Jumper | K.OA.A.1–A.3 | FAIL | FAIL | Severe | Weak/negative |
| Wall Builder | K.OA.A.1–A.3 | FAIL | FAIL | Severe | Weak/negative |
| Circuit Board (strong subset, ~58%) | K–8 mixed | PASS | PASS | Resistant | Strong (Montessori, CPA, balance) |
| Circuit Board (weak subset, ~42%) | K–8 mixed | FAIL | FAIL | Vulnerable | Weak |

### Top-line findings

1. **Sum Jumper and Wall Builder are extrinsic-integration scenarios** in the exact pattern Habgood & Ainsworth (2011) showed produces inferior learning. They ship as named "Game Style" options on the builder picker, which means Builders are being directly nudged toward designs that violate two of the six core beliefs on the very first screen of the build flow. This is the most consequential finding of the audit.

2. **The two scenarios are NOT independent engines** — they are 1-paragraph string prompts to the AI generator. The fix is a 4-line rewrite of each string in `src/components/builders/builder-picker.tsx`. Cost: ~5 minutes. Impact: every K.OA game built via these tiles henceforth.

3. **The Circuit Board Builder option library is the codebase's most pedagogically defensible asset.** Roughly 58% of the 65 options pass both Discovery and SRT and are grounded in peer-reviewed CRA / Montessori / Singapore literature. The "deprecated" flag in CLAUDE.md is misleading; only the UI is being demoted — the engine library should be preserved and curated.

4. **About 12 of the 65 options should be re-flagged** as practiceOnly or post-mastery-only. These are mostly the constraint-puzzles, terrain coordinate-finders, and classic-overlays that rely on hidden equality checks dressed as game state.

5. **Research alignment overall:** the project's positioning §core-belief 2 ("Math IS the gameplay … Self-Revealing Truth") is a direct restatement of intrinsic integration. The codebase honors this principle in ~58% of its mechanics and violates it in ~42%, with the two most-promoted "Game Style" tiles falling squarely on the violation side.

### Recommended next actions (in priority order)

1. **Now (5 min):** Rewrite the Sum Jumper and Wall Builder scenario strings per the diffs above. This stops the bleeding for K.OA builds.
2. **This sprint:** Add `srtPasses: boolean` to `GameOptionDef`, audit the 65 entries, hide failing options from discovery routing.
3. **This sprint:** Verify that the `practiceOnly` flag is actually enforced as a post-mastery gate in the builder UI (read `src/lib/standard-game-options.ts` and the builder routing — outside this audit's scope).
4. **Next session:** Have Mr. Chesure (when rewritten per the pivot plan) actively steer Builders toward strong-intrinsic options that match the standard, rather than presenting a 65-tile shelf or two extrinsic scenarios.

### Sources cited
- Habgood, M. P. J., & Ainsworth, S. E. (2011). Motivating Children to Learn Effectively: Exploring the Value of Intrinsic Integration in Educational Games. *Journal of the Learning Sciences*. ERIC EJ922627. https://eric.ed.gov/?id=EJ922627
- Echeverria et al. (2012). The Atomic Intrinsic Integration Approach. *Computers & Education*. ERIC EJ967019.
- Habgood, Ainsworth, & Benford (2005). Endogenous Fantasy and Learning in Digital Games. *Simulation & Gaming*. ERIC EJ951867.
- Denham, A. R. (2016). Improving the Design of a Learning Game through Intrinsic Integration and Playtesting. *Technology, Knowledge and Learning*. ERIC EJ1105510.
- Walkington, C. (2020). Intrinsic Integration in Learning Games and Virtual Instruction. ERIC ED612086.
- Shi, Wang, & Ding (2022). Game-Based Immersive VR Learning Environment. *Interactive Learning Environments*. ERIC EJ1345194.
- Joshi, Tokey, Glaser, & Kao (2025). Exploring Content Integration in Educational Video Games. *TechTrends*. ERIC EJ1492215.

### Files referenced
- `c:/projects/math-games-builder/src/components/builders/builder-picker.tsx` (Sum Jumper + Wall Builder scenario strings, lines 30–31)
- `c:/projects/math-games-builder/src/lib/game-engines/game-option-registry.ts` (the 65-option library)
- `c:/projects/math-games-builder/src/components/standard/circuit-board-builder.tsx` (the meta-builder UI)
- `c:/projects/math-games-builder/docs/product-positioning.md` (north star — core beliefs 1 and 2)
- `c:/projects/math-games-builder/CLAUDE.md` (template list and deprecation flag — needs nuance per finding 3)
