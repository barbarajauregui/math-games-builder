# Audit 07 — K.OA.A.1 and K.OA.A.3 Production Games

*Auditor: Claude (research subagent) · Date: 2026-05-10 · Method: source-code read + ERIC literature search (~$2 budget) · Personas: early-childhood math researcher, classroom kindergarten teacher*

---

## Summary

The two production games are pedagogically **stronger than most edtech kindergarten apps** but contain three concrete, fixable problems and one possible mis-pivot of the K.OA.A.1 flow per the April 18 reframe.

What's good (research-aligned):
- Ten-frame visual model is the dominant evidence-based representation for K.OA in U.S. early-math curricula and aligns with Math Learning Center's Number Frames.
- "Learner does the math, never the system" — `number-frames.ts` rigorously enforces this (no running counts, learners tap each counter, equation hidden until after commit). This matches Cognitively Guided Instruction (CGI) and the part-part-whole research tradition (Fischer 1990, Carpenter et al.).
- Wrong answers shake instead of fade (prevents brute force) — well-justified design choice.
- Subtraction modeled as physical removal from a filled frame, not as a separate symbolic operation — matches the "separating" problem type in CGI taxonomy.

What's broken or weak:
1. **K.OA.A.1 game does not teach representational fluency** — the standard's *core demand* is representing add/subtract across MANY modes (objects, fingers, drawings, sounds, claps, acting out, verbal, expressions, equations). The game uses one mode (counters in ten-frames). The standard is broader than the game.
2. **K.OA.A.3 implementation only asks for ONE decomposition per total**, but the standard explicitly requires decomposing "in more than one way." This is the load-bearing pedagogical move of K.OA.A.3 and it's missing.
3. **K.OA.A.3 rounds (in `standard-rounds.ts`) are missing-addend problems with a single right answer (`5 = 2 + ?`)**, which is K.OA.A.4 territory ("make 10 / find the missing addend"), not K.OA.A.3 (decompose into pairs in *more than one way*). Mr. Chesure / the rounds engine is mis-mapping the standard.
4. **The 3-step Scenario Gate (`scenario-gate.tsx`) is a builder-facing pre-build quiz, not the K.OA.A.1 game itself.** Per April 18 reframe in CLAUDE.md, only Step 3 (Tap Marbles / "Prove It") is the actual intrinsic-math moment; Steps 1–2 are a metacognitive screening for would-be Builders. The audit should treat them separately.

---

## K.OA.A.1 — step-by-step audit

The K.OA.A.1 flow has two surfaces:
- **Builder-facing Scenario Gate** (`src/components/standard/scenario-gate.tsx`) — 3 steps, gates entry to the builder studio
- **Player-facing Number-Frames game** (`src/lib/game-engines/number-frames.ts`) — the actual learning game

### Surface A: Scenario Gate (Builder-facing, the 3 steps in CLAUDE.md)

#### Step 1 — "Real Math, or Math Sprinkles?"
*File: `scenario-gate.tsx:25-41` (vignettes), `:209-316` (component)*

**What it does:** Shows 3 short vignettes; learner sorts each as "real math" (math is needed to figure something out) vs "math sprinkles" (math is decoration on a fantasy action).

**Audit:**
1. *Does it teach K.OA.A.1?* No — and it's not supposed to. It teaches a **builder design principle** ("math is the gameplay") that lives in `docs/product-positioning.md` as a non-negotiable. This is metacognitive screening of would-be Builders, not kindergarten math.
2. *Developmentally appropriate?* For Builders (grades 5–10), yes. For a kindergartner, the abstraction "real vs sprinkles" would be too abstract, but kindergartners aren't the audience for this gate.
3. *Discovery test / Self-revealing truth test?* N/A — these are tests for the *resulting game*, not for a meta-quiz.
4. *Research grounding:* The "math sprinkles" framing is Barbara's invention. There is some research alignment with Schoenfeld's distinction between **mathematical situations** and **dressed-up word problems** (often called "pseudocontext"), and with Boaler's critique of "fake math" in school settings, but no citation appears in the code or contract.
5. *Concern:* The vignettes themselves reinforce a slightly **misleading** distinction — the wizard who shouts "3 + 2!" to defeat a dragon (vignette 2, marked as "fake") is genuinely doing addition in his head; what makes it pseudo-math is that the game-world **outcome doesn't depend on whether 3 + 2 is correct**. Sharper framing: "When the player says the wrong answer, does the game world push back?" That's the actual test.

#### Step 2 — "Fix the Story"
*File: `scenario-gate.tsx:50-64` (comic), `:320-448` (component)*

**What it does:** A 4-panel comic where one panel uses the wrong operation (`5 × 3 = 15 strawberries`); learner picks the correct addition equation.

**Audit:**
1. *Does it teach K.OA.A.1?* Partially — it tests **operation choice** (joining = addition), which is the verbal/expression representation strand of K.OA.A.1.
2. *Developmentally appropriate?* For Builders, yes. The distractors include `3 + 5 = 9` (commutative-but-arithmetically-wrong) and `5 - 3 = 2` (wrong operation). The first distractor is a nice misconception probe.
3. *Discovery test:* Fails — a learner who didn't already know addition can't discover it from this puzzle. But again, this is a Builder gate, not a Player game.
4. *Research grounding:* Operation-choice from problem structure is the central theme of **Cognitively Guided Instruction** (Carpenter, Fennema, Franke, Levi, Empson 1999) and goes back to Riley, Greeno & Heller's 1983 problem-type taxonomy. The "joining" semantic type maps directly to this panel. Code does not cite this.

#### Step 3 — "Prove It" / Tap Marbles
*File: `scenario-gate.tsx:452-585`*

**What it does:** 3 red marbles + 2 red marbles. Learner taps each (it darkens — no running count). Picks total from a 5-button number pad.

**Audit:**
1. *Does it teach K.OA.A.1?* Yes — this is the canonical "joining + count-all" task for K.OA.A.1. It's the **intrinsic-math moment** Barbara correctly identified on April 18.
2. *Developmentally appropriate?* Yes for kindergarten. Numbers stay ≤ 5 in the gate. One-to-one tapping with no running count is exactly what counting research recommends (Gelman & Gallistel's counting principles; cardinality only emerges after one-to-one correspondence is solid — Sarnecka & Carey 2008).
3. *Discovery test:* **Passes.** A learner who doesn't know "3 + 2 = 5" can discover it by tapping each marble.
4. *Self-revealing truth test:* **Partially passes.** The truth is revealed by *the act of counting* (tapping each in turn) — that's self-revealing. But the wrong-answer feedback is text ("tap each marble and count carefully") rather than the marbles themselves doing something different. Stronger version: when the wrong number is picked, the marbles re-light/re-untap and the learner must count again — which is what the code does (`setTapped(new Set())` on retry). Good.
5. *Research grounding:* Count-all (Carpenter & Moser 1984), then count-on, then derived facts is the canonical strategy progression. Tap-to-count enforces count-all, which is right for K.OA.A.1.
6. *One issue:* Only 5 marbles total, only one problem. A proper K.OA.A.1 game needs ≥ 5 rounds with varying addends — which the **Number-Frames game does provide** (see Surface B below). So Step 3 is a *demo*, not a *game*. That's correct for a gate.

### Surface B: Number-Frames Game (Player-facing — the real K.OA.A.1 game)

*File: `src/lib/game-engines/number-frames.ts`*

5 rounds: `2+1`, `4+2`, `3+3`, `7-2`, `5+4`. Dot-cluster prompts (no digits). Two ten-frames, fill each, count, pick total.

**Audit:**
1. *Does it teach K.OA.A.1?* **Yes for the addition/subtraction-with-objects strand** — but K.OA.A.1's literal text is *"Represent addition and subtraction with **objects, fingers, mental images, drawings, sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations**."* This is one of those rare CCSS standards where **multiplicity of representation IS the standard**. The game uses one mode (counters). It does *not* satisfy the representational-fluency demand of K.OA.A.1. It satisfies what is essentially K.OA.A.2 (word problems within 10 with objects).
2. *Developmentally appropriate?* Yes. Ten-frame is the gold-standard K visual (Van de Walle; Fosnot & Dolk 2001 "Young Mathematicians at Work: Constructing Number Sense"; Math Learning Center curriculum). Dot-cluster prompts (visual count, not digit) are consistent with Bruner's enactive→iconic→symbolic progression that grounds Singapore Math (CPA), and with Dacey & Collins (2011) "Zeroing in on Number and Operations Pre-K-K" (ERIC).
3. *Discovery test:* Passes. A learner who doesn't yet know `4+2=6` can discover it by filling, combining, and counting.
4. *Self-revealing truth test:* Partially. Filling the wrong addend → wobble + retry. Picking the wrong total → button shakes, taps reset, count again. Both are self-revealing. The *combine* phase, however, doesn't dramatize the joining act — it's mostly a tap-to-count of the same dots. A stronger combine animation (counters from frame B physically slide into frame A and fill the empty cells) would make the join visible.
5. *Equation hidden until after correct answer* (line 117–122, 463–528) — well-grounded. Progressions Doc K-5 OA (CCSS Writing Team 2011) is explicit: at K, "students *represent* addition and subtraction with concrete objects" and equations are *recordings* of physical action, not the action itself. Good.
6. *Commutativity accepted* (line 472–474: both `frameA=2, frameB=4` AND `frameA=4, frameB=2` pass) — quietly correct. CCSS K.OA.A.1 doesn't require recognizing commutativity (that's 1.OA.B.3) but accepting it avoids penalizing a child who reads `4+2` as "4 in this hand, 2 in this hand" left-to-right vs the prompt's order.
7. *No fingers, no claps, no drawing, no acting out.* Per the standard's literal text these are missing modes. Pragmatically you can't ship 8 modes per round — but the **Builder design brief** should acknowledge that picking different modes is a *creative axis* available to Builders, not just "make another ten-frame game."

---

## K.OA.A.3 — step-by-step audit

The K.OA.A.3 game has two implementation surfaces, **and they disagree with each other**:

### Surface A: Number-Frames Decompose Mode
*File: `number-frames.ts:42-48` and `:418-466`*

5 rounds: total ∈ {3, 5, 6, 8, 10}. Learner sees `[total dots] = ? + ?`. Splits the dots by clicking cells in two ten-frames. Done button validates: `frameA + frameB === total AND frameA ≥ 1 AND frameB ≥ 1`.

**Audit:**
1. *Does it teach K.OA.A.3?* **Half-correctly.** It teaches one decomposition per total. The standard says: *"Decompose numbers less than or equal to 10 into pairs in **more than one way**."* The "more than one way" clause is the heart of K.OA.A.3 and the game accepts any single decomposition then advances. Pedagogically wrong.
2. *Developmentally appropriate?* The mechanic itself is appropriate. K children can split sets and represent the split with numerals once they have cardinality + 1:1 correspondence (Clements & Sarama, *Learning and Teaching Early Math* 2nd ed., 2014, learning trajectory for "composing number" — particularly the "Composer to 5", "Composer to 10" levels).
3. *Discovery test:* Partially passes. Learner who doesn't yet know `5 = 2+3` can find it by trial. But because there's *one* answer per round and the learner doesn't have to find a *second* decomposition of the same total, the standard's deepest insight — "a number isn't just one thing, it can be many pairings" — is never confronted.
4. *Self-revealing truth test:* Passes for the single decomposition (counters wobble if total wrong, hint adjusts if too many/too few).
5. *Critical missing mechanic:* No "find another way" prompt. The classic K.OA.A.3 task is *"Show me 5 in as many ways as you can"* and the artifact is a chart: 5=1+4, 5=2+3, 5=3+2, 5=4+1, 5=0+5, 5=5+0 (Fischer 1990; Open Up Resources K Unit 4 "Number Race and Roll").
6. *Research grounding:* Fosnot & Dolk's "landscape of learning" for K addition explicitly names "five as 2+3 *and* 1+4 *and* 4+1" as the milestone, not a single split. Conceptual subitizing research (Clements 1999; Björklund 2020 "Conceptual Subitizing and Preschool Class Children's Learning of the Part-Part-Whole Relations of Number" — ERIC) shows part-whole flexibility specifically depends on seeing multiple decompositions of the same set.

### Surface B: Standard-Rounds K.OA.A.3 (used by other game engines)
*File: `src/lib/standard-rounds.ts:162-168`*

```
{ prompt: "5 = 2 + ?", target: 3 },
{ prompt: "6 = 4 + ?", target: 2 },
{ prompt: "7 = 3 + ?", target: 4 },
{ prompt: "9 = 5 + ?", target: 4 },
{ prompt: "10 = 6 + ?", target: 4 },
```

**Audit:**
1. *Does it teach K.OA.A.3?* **No — this is K.OA.A.4.** K.OA.A.4 is "For any number from 1 to 9, find the number that makes 10." The missing-addend / missing-part task is exactly K.OA.A.4 (find the complement) or part of part-part-whole arithmetic, not K.OA.A.3 (find pairs in many ways). The fact that the prompt text is `5 = 2 + ?` reveals the slip: there's a *given* part already, so the learner is finding a complement, not generating a pairing.
2. *Developmentally appropriate?* Mechanic is fine; it's just labeled the wrong standard.
3. *Concrete consequence:* A Builder who picks K.OA.A.3 in any non-`number-frames-decompose` template (e.g., Sum Jumper, Wall Builder, etc., wired through `standard-rounds.ts`) ships a game that doesn't teach K.OA.A.3.

### Real-world scenario / "use" text for K.OA.A.3
*File: `src/lib/standard-real-world-uses.ts:111-115`*

> "fun: Split your 10 toy cars into teams — 3 and 7? 5 and 5? So many ways!"

This text is **correct**. The "so many ways" framing is exactly the standard's pedagogical move. So the design *intent* in the metadata is right, but neither game implementation enforces it.

---

## What research says K.OA games SHOULD do

Synthesizing across CGI, Math Learning Center, Open Up Resources K, Clements & Sarama's learning trajectories, the K-5 OA Progression (CCSS Writing Team 2011), and Fosnot & Dolk:

**For K.OA.A.1 specifically:**
1. **Multiple representations of the same operation in the same session.** Same `4+2` shown as: counters, fingers held up, drawn dots on paper, claps the kid hears, acted-out story, spoken sentence ("four cookies and two more"), expression `4+2`, equation `4+2=6`. Best practice: present same problem in two modes, ask child to confirm they're equivalent. Goes beyond the current single-mode game.
2. **Counting principles enforced by mechanic, not by graphic.** One-to-one (each tap = one count), stable order (number names in fixed order), cardinality (last word said = total), abstraction (works for any objects), order-irrelevance (any starting point works) — Gelman & Gallistel 1978. The current game enforces 1:1 (taps), stable order (number pad presents `3,4,5,6,7`), and cardinality (commit-then-reveal). Solid.
3. **Both joining (addition) and separating (subtraction) problem types** — CGI distinguishes Join Result-Unknown, Join Change-Unknown, Join Start-Unknown; Separate Result-Unknown, etc. The current game only handles **Result-Unknown** for both (Riley & Greeno 1983; Carpenter et al. 1999). Change-Unknown ("you had 3, now you have 7, how many were added?") is harder but still K-appropriate per the K-5 Progression.
4. **No running totals during action** — current game gets this right.
5. **Equation as a record, not as the math** — current game gets this right.

**For K.OA.A.3 specifically:**
1. **The same total decomposed multiple ways in one session.** Show 5; learner finds one pair; game says "Now find a different way." Repeat until learner finds 3+ pairs OR runs out. The exhaustive-list version ("find ALL the ways") is a 1st-grade extension; finding *more than one* is the K-level minimum.
2. **Visual recording of multiple decompositions side-by-side.** A "ways to make 5" board that fills up over the course of the round. Each new pair the learner finds gets recorded as a new ten-frame split or number-bond. This makes flexibility *visible*. (Open Up Resources K Unit 4; Fosnot & Dolk's "necklace problem.")
3. **Conceptual subitizing as supporting skill** — Björklund 2020 (ERIC) found preschoolers learn part-part-whole relations *faster* when subitizing tasks are interleaved (see 5 dots arranged as 2+3 vs 1+4 — child instantly sees both decompositions without counting). The dot-cluster prompt in `number-frames.ts` is well-positioned for this; a K.OA.A.3 round could use a *deliberately arrangeable* dot cluster (drag dots between two zones) and the learner discovers multiple groupings.
4. **No missing-addend prompts at K.** `5 = 2 + ?` is K.OA.A.4 territory or 1.OA. K.OA.A.3 is *generation* of pairs, not *completion* of pairs.

---

## Gaps in current implementation

| # | Gap | Severity | File(s) |
|---|---|---|---|
| 1 | K.OA.A.3 decompose mode accepts one decomposition per round; standard requires "more than one way." | High | `number-frames.ts:418-466` |
| 2 | K.OA.A.3 rounds in `standard-rounds.ts` are missing-addend (K.OA.A.4 task), mislabeled. | High | `standard-rounds.ts:162-168` |
| 3 | K.OA.A.1 game uses one representation mode (counters in ten-frame); standard explicitly demands multiplicity. | Medium | `number-frames.ts` overall; `docs/contracts/K.OA.A.1.md` §6 |
| 4 | K.OA.A.1 only covers Join/Separate Result-Unknown; CGI Change-Unknown and Compare types absent. | Medium | `number-frames.ts:33-39` |
| 5 | Real-or-Fake vignette 2 (wizard) conflates "math is stated aloud" with "math is sprinkles." Sharper criterion: does the game world react to wrong answers? | Low | `scenario-gate.tsx:32-35` |
| 6 | No design-brief language anywhere connects K.OA.A.1's representational-fluency demand to creative axes Builders can choose (sounds, claps, drawings). Mr. Chesure has no domain knowledge file for K.OA. | High (for Builder onboarding) | missing — would live in `docs/agents/chesure/knowledge/k-oa.md` |
| 7 | Combine animation in addition mode doesn't dramatize the joining act. Counters in frame B don't visibly travel into frame A. | Low | `number-frames.ts:486-493` (count phase) |
| 8 | "Real Math, or Math Sprinkles?" framing has no research citation in code or contract. | Low | `scenario-gate.tsx`; `docs/contracts/K.OA.A.1.md` |

---

## Proposed changes (specific)

### Fix 1 (HIGH): K.OA.A.3 decompose — require multiple decompositions per round

In `src/lib/game-engines/number-frames.ts`:

- Each decompose round should accept the first decomposition, then *record it* in a side-panel ("Ways to make 5: 2+3 ✓"), reset the frames, and prompt: *"Find a different way."* Round completes after **2 distinct decompositions** for total ≤ 5, **3 distinct** for total 6–10. Tracking: `Set<string>` of `${a}+${b}` (canonicalize so `2+3` and `3+2` count as same OR different — I lean *different* at K to honor commutative awareness, matching CCSS K.OA.A.1's loose handling of order, but verify with Barbara).
- Rounds list stays the same (3, 5, 6, 8, 10) — the change is the *number of decompositions per round*.
- Wrong-decomposition feedback: if learner repeats a pair already found, the side-panel entry briefly highlights and instruction reads "You already found that one — find another."

### Fix 2 (HIGH): K.OA.A.3 rounds in `standard-rounds.ts`

Replace missing-addend prompts with generation prompts. Engines that consume `standard-rounds.ts` will need to handle "any valid pair" answers (multiple targets), or — simpler — drop K.OA.A.3 from `standard-rounds.ts` entirely and require it to use only the `number-frames-decompose` engine. This is cleaner since the missing-addend mechanic doesn't fit K.OA.A.3 at all. Recommend dropping.

### Fix 3 (HIGH): Build Mr. Chesure K.OA domain knowledge file

Create `docs/agents/chesure/knowledge/k-oa.md` containing:
- Full K-5 OA Progression text for K (CCSS Writing Team 2011)
- CGI problem-type taxonomy (Join, Separate, Part-Part-Whole, Compare × Result/Change/Start Unknown) with K-appropriate examples
- The 8 representational modes from K.OA.A.1's literal text, each with one example mechanic (objects = ten-frame; fingers = finger-tap mechanic; drawings = sketch-and-count; sounds = clap-along; acting out = role-play scenario; verbal = read-aloud word problem; expression = digit-only; equation = digit + equals)
- Counting principles checklist (Gelman & Gallistel) for any K.OA mechanic to pass
- The "more than one way" requirement as a hard-fail gate for K.OA.A.3 designs
- Citations: see Key Citations below

This file becomes Mr. Chesure's grounding when reviewing any K.OA Builder submission and gives Builders a real design brief.

### Fix 4 (MEDIUM): Update K.OA.A.1 Learning Contract

`docs/contracts/K.OA.A.1.md` §6 currently says "Place correct count of counters for each addend …" — narrow to one mode. Either:
- (a) Reframe the contract so this game is the *objects* mode and the contract notes that K.OA.A.1's full coverage requires additional modes shipped over time (mark as Part 1 of N), OR
- (b) Add an "alternate-mode round" inside the existing game (e.g., one of the 5 rounds shows the prompt as **claps** played through audio, learner taps to count claps before tap-counting frame counters).

Recommend (a) for now (smaller change), with (b) as a future enhancement once Mechanic Inventor agent ships.

### Fix 5 (LOW): Tighten "Real Math, or Math Sprinkles?" rubric

Rewrite the gate's preamble (`scenario-gate.tsx:246-251`) to use the operational test:

> "Real math: the player's answer changes what happens in the game. Wrong answer = bad result; right answer = good result.
> Math sprinkles: the player picks a number and the game proceeds the same either way. The math is decoration."

Replace vignette 2 (wizard) with: *"A wizard says '3 + 2!' and the dragon falls regardless of whether 3+2 is right."* (Now clearly sprinkles by the new criterion.) Or replace with a different example that more cleanly fails the operational test.

### Fix 6 (LOW): Combine animation

In count phase of addition mode (`number-frames.ts:486-493`), add a 400 ms transition where counters in `frame-b` translate visually into `frame-a`'s empty cells before the count phase begins. This makes "joining" a visible event, not an inferred one.

---

## Key citations

**Common Core foundational documents (cite-as-source-of-truth):**
- CCSS Writing Team. (2011). *K-5, Operations and Algebraic Thinking Progression.* Common Core Standards Writing Team. http://commoncoretools.me

**Cognitively Guided Instruction (operation choice, problem-type taxonomy):**
- Carpenter, T. P., Fennema, E., Franke, M. L., Levi, L., & Empson, S. B. (1999). *Children's Mathematics: Cognitively Guided Instruction.* Heinemann.
- Riley, M. S., Greeno, J. G., & Heller, J. I. (1983). Development of children's problem-solving ability in arithmetic. In *The Development of Mathematical Thinking* (Ginsburg, ed.).
- ERIC ED185511 (1979). *The Effect of Problem Structure on First-Graders' Initial Solution Processes for Simple Addition and Subtraction Problems.* Technical Report No. 516. — original empirical basis for joining/separating/part-part-whole problem types.

**Counting principles (informs the no-running-count design):**
- Gelman, R., & Gallistel, C. R. (1978). *The Child's Understanding of Number.* Harvard University Press.
- Sarnecka, B. W., & Carey, S. (2008). How counting represents number: What children must learn and when they learn it. *Cognition, 108*(3), 662–674.

**Part-part-whole and decomposition (K.OA.A.3 evidence):**
- Fischer, F. E. (1990). A Part-Part-Whole Curriculum for Teaching Number in the Kindergarten. *Journal for Research in Mathematics Education, 21*(3). — ERIC EJ409772. **Foundational study showing part-whole curriculum outperforms standard K curriculum on number concept development.**
- Fosnot, C. T., & Dolk, M. (2001). *Young Mathematicians at Work: Constructing Number Sense, Addition, and Subtraction.* Heinemann.
- Björklund, C., & Reis, M. (2020). Conceptual Subitizing and Preschool Class Children's Learning of the Part-Part-Whole Relations of Number. *Problems of Education in the 21st Century.* — ERIC. **Direct evidence subitizing-supported part-whole work accelerates the "more than one way" insight.**

**Learning trajectories (developmental appropriateness):**
- Clements, D. H., & Sarama, J. (2014). *Learning and Teaching Early Math: The Learning Trajectories Approach* (2nd ed.). Routledge. — see "Composer" trajectory for K.OA.A.3.
- Sarama, J., & Clements, D. H. (2009). *Early Childhood Mathematics Education Research: Learning Trajectories for Young Children.* Routledge.

**Ten-frame as canonical K representation:**
- Van de Walle, J. A., Karp, K. S., & Bay-Williams, J. M. (2018). *Elementary and Middle School Mathematics: Teaching Developmentally* (10th ed.). Pearson.
- Bobis, J. (1996). Visualisation and the development of number sense with kindergarten children. In *Children's Number Learning*.
- Dacey, L., & Collins, A. (2011). *Zeroing in on Number and Operations, Pre-K-K: Key Ideas and Common Misconceptions.* Stenhouse. — ERIC. **Names the 9 essential K-OA ideas; current games hit ~5 of 9.**

**Subitizing (supports dot-cluster prompt design):**
- Clements, D. H. (1999). Subitizing: What is it? Why teach it? *Teaching Children Mathematics, 5*(7), 400–405.
- MacDonald, B. L., & Wilkins, J. L. M. (2021). Different Types of Subitizing Activity: A Teaching Experiment with Preconservers. *Acta Educationis Generalis.* — ERIC.

**Curriculum reference implementations:**
- Math Learning Center. *Number Frames* free app. https://www.mathlearningcenter.org/apps/number-frames — visual language directly informs current implementation.
- Open Up Resources K Math, Unit 4 (Composing and Decomposing Numbers within 10) — open-license curriculum showing the multi-decomposition lesson structure.

---

## Files referenced (absolute paths)

- `c:/projects/math-games-builder/src/components/standard/scenario-gate.tsx` — 3-step Builder gate
- `c:/projects/math-games-builder/src/lib/game-engines/number-frames.ts` — K.OA.A.1 + K.OA.A.3 game engine
- `c:/projects/math-games-builder/src/lib/standard-rounds.ts` — fallback round content (K.OA.A.3 mislabeled as K.OA.A.4-style)
- `c:/projects/math-games-builder/src/lib/standard-real-world-uses.ts` — Builder-facing scenario hints (K.OA.A.3 text correct in intent)
- `c:/projects/math-games-builder/docs/contracts/K.OA.A.1.md` — Learning Contract (no equivalent for K.OA.A.3 yet — gap)
- `c:/projects/math-games-builder/docs/k-oa-a-1-scenarios.md` — sample real-world scenarios
