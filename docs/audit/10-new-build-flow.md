# Audit 10 — New 5-Step Build Flow (Pedagogical Soundness)

*Date: 2026-05-10 · Method: STORM 3-persona analysis (game-authoring-tool researcher / instructional designer / kid-product UX) · ~$0.50 search spend, leaning on prior audits 03/06/07/08/09 and a few targeted OpenAlex pulls (van Merrienboer 2003 just-in-time scaffolding; Sweller / van Merrienboer / Paas 2019 CLT-20-years-later; Lodge et al. 2018 difficulty-and-confusion integrative review). Other citations are reused from prior audits and are listed at end.*

---

## Summary

**The new 5-step flow is a substantial pedagogical upgrade over the current Scenario Gate + Builder Picker.** It replaces a front-loaded Builder quiz with situated, just-in-time scaffolds and constrains the AI to the parts it does well (parameter-filling, parsing) while keeping authorship with the kid. Step order is mostly right; there is one defensible alternative ordering (swap 3 and 4) worth piloting later. The two genuine risks the new flow introduces are (a) **construct-validity drift** because Lesson 1 now fires rarely (since "Write your own" is cut), and (b) **mechanic-template paths skipping the visible Critic ladder** — pre-vetted templates plus bad Builder content can still ship a broken game. Net verdict: **ship it, with five tightening adjustments listed in §Adjustments below.**

The flow is also strongly aligned with research the prior audits already cited as foundational (Habgood & Ainsworth 2011 intrinsic integration; Carpenter et al. CGI; van Merriënboer 2003 just-in-time information; Plass et al. 2015 game-based learning foundations; Sweller CLT). The single biggest pedagogical *win* is moving the math-vs-mechanic decision (Step 3 → Step 4) into the flow as bound, gated steps rather than a single AI generation request.

---

## Per-question findings

### Q1 — Is the step ORDER right? (Scenario → Story → Math → Action → Playtest)

**Verdict: mostly right; one defensible alternative.**

The current order matches the **Cognitively Guided Instruction problem-typing flow** (Carpenter, Fennema, Franke, Levi, Empson 1999): situation first → numbers in the situation → operation that fits the situation → representation/action. That's the canonical path a teacher walks a kid through, which means it's also the canonical path a Builder should walk to *teach* a kid — and the design brief should reflect what the kid will encounter.

It also matches **van Merriënboer, Kirschner & Kester (2003) "Taking the Load Off a Learner's Mind"** — complex authentic tasks should scaffold from concrete situation to abstract operation, with just-in-time information at each step. Scenario → Story → Math is exactly that ramp.

**Defensible alternative: Math → Action → Scenario → Story.** Some authoring-tool research (Resnick / Kafai's Scratch tradition) found that older novice authors who pick a *mechanic* first ("I want to make a platformer") produce more cohesive games than authors who pick a *theme* first. If MGB's Builders are 10–16 and identify as "I want to make a *jumper game*," then Action-first might fit their cognitive starting point better. However, this also risks the **"retrofit-mechanic" failure mode** Audit 9 flagged at risk-rank 14 — Builder picks Tetris-like, then has to bend the math to fit. Habgood & Ainsworth (2011) showed exactly this pattern produces extrinsic integration.

**Recommendation:** keep the current order for v1; offer a Builder-controlled "Start from a mechanic instead" entry point as a v1.1 follow-up that routes to Step 4 first then loops back to 1–3. Don't make it the default — it inverts the intrinsic-integration ramp.

### Q2 — Just-in-time gates vs. upfront curriculum?

**Verdict: just-in-time wins on the research, *if* the gate fires often enough.**

Three converging research lines support JIT over upfront:

- **Situated learning (Lave & Wenger 1991; Brown, Collins & Duguid 1989).** Concepts taught divorced from their use context transfer poorly. Lesson 1 ("real math vs. sprinkles") is an abstract design principle; firing it when a Builder has just authored content the principle tests against produces vastly stronger encoding than firing it cold.
- **Just-in-time information presentation (van Merriënboer, Kirschner & Kester 2003 — *Educational Psychologist*, 839 cites).** Recurrent supportive information should be presented "just in time" — at the moment it becomes necessary for task performance — to avoid extraneous cognitive load. The current upfront 3-step gate is exactly the load-spike pattern this paper warns against.
- **Worked examples + completion problems (Sweller / van Merriënboer 2019 CLT-20-years-later).** Pure upfront worked examples produce expertise reversal in motivated authors who already understand the principle. JIT gates that *only fire when there's evidence the Builder needs them* (verb mismatch, free-write context) avoid penalizing competence and avoid wasting attention.

**The catch:** "fires only on second-build with deeper customization" means Lesson 1 may rarely fire at all in the prefab-scenario pipeline. That's a real regression from the current design where 100% of Builders see it. **Mitigation:** fire Lesson 1 silently as a *check*, not a *teaching moment*, on every Builder's first published game — show it as a "does your story require the math?" confirmation card after Step 2, not before. Cheap; one click; embeds the principle universally without quizzing.

### Q3 — Mad-lib templates vs. free-write?

**Verdict: mad-lib is a feature, not a bug, for the K–10 cross-age use case. Constraint is doing real pedagogical work.**

The research on authoring constraints is mostly indirect (it shows up in CS education and writing-instruction work, not in math-game-authoring specifically), but the relevant findings are consistent:

- **Cognitive Load Theory (Sweller et al. 2019).** Authoring tools that allow unconstrained input force novices to allocate working memory to format/structure decisions instead of content decisions. Mad-lib templates eliminate the format burden — exactly the "split-attention" remediation CLT prescribes.
- **Habgood & Ainsworth (2011) intrinsic integration.** The scenarios that pass the Discovery and Self-Revealing Truth tests have a *narrow* shape: a concrete situation where the math operation is load-bearing for an outcome. Free-write Builders consistently produce decorated (extrinsic) scenarios because they default to "story they want to tell" rather than "story where the math has to happen." Audits 7 and 8 on the existing K.OA games are direct evidence: the Sum Jumper and Wall Builder *prompts* (free-form scenario strings) failed both tests; the structured engines (number-frames, ten-frame, equal-groups) passed.
- **Productive failure (Kapur & Bielaczyc 2011, Lodge et al. 2018 review).** Productive failure is productive when failure is on the *math*, not on the *authoring scaffolding*. A Builder who writes a story that doesn't fit the operation hasn't productively failed at math — they've failed at story-construction, which teaches them nothing about K.OA.A.1. Mad-libs put the failure surface where it belongs (in Step 3 verb-mismatch detection), not in Step 2.

**Cutting "Write your own" is therefore correct for v1.** Free-write should return as a v2 unlock once Builder has shipped 2–3 mad-lib games successfully — at that point they have enough scaffolded examples to free-write competently (this is exactly the **completion problem → free problem fading** trajectory CLT prescribes).

### Q4 — Filter Step 4 mechanics by operation?

**Verdict: yes, filter by default; allow override as a Builder-driven unlock.**

This is the clearest construct-validity win in the new flow. Audit 8 showed the existing Circuit Board Builder library has ~58% strong-intrinsic options that pass Discovery + SRT and ~42% that fail. The single highest-leverage way to keep a Builder out of the failing 42% is to filter what they see based on the operation and standard. **The filter is not a creativity ceiling — it's a construct-validity floor.**

The trade-off (limiting "creative recombination") is real but bounded:
- Genuine cross-operation creativity is rare at K-3 standards anyway (an addition game wearing multiplication's mechanic is almost always extrinsic integration, per Habgood).
- The handful of cases where it's legitimate (e.g., subtraction-as-distance-on-a-number-line *can* teach addition too) are exactly the cases where the operation and the mechanic share a deep structural representation — and *those* should be promoted to "valid for both operations" in `game-option-registry.ts`, not surfaced via a free-for-all picker.

**Recommendation:** filter strictly in the visible picker; add a tiny "Show all mechanics anyway" link that, when clicked, surfaces a brief warning ("Mechanics outside your operation usually produce extrinsic integration — see why") and then opens the full set. This honors learner autonomy without making extrinsic integration the default path.

### Q5 — Lesson 1 firing only on second-build for prefab scenarios — right?

**Verdict: partially right; net regression unless rebalanced.**

The reasoning ("don't quiz a 5th-grader using Bakery like they failed something") is sound — performance-contingent quizzes on a guarded scaffold are exactly the **undermining-effect risk profile** Audit 4 flagged for the 2000-token publish bonus (Deci, Koestner & Ryan 1999). So firing Lesson 1 as a quiz before the kid has done anything is motivationally toxic.

But moving it to second-build only means a kid who never builds twice (likely a large fraction of Builders) never encounters the principle. That's a real construct-validity loss compared to the current design.

**Resolution (consistent with the JIT/situated argument from Q2):**
- Replace Lesson 1 as a *quiz* with Lesson 1 as a *self-check confirmation card* that fires after Step 2 on every first build, regardless of scenario source. Card phrasing: *"In your story, does the answer to the math actually change what happens? Or could the story play out the same either way?"* — two buttons (yes/needs work). No "wrong" answer; if they pick "needs work," the card offers a one-line nudge and they edit. This is the operational test from Audit 7's Fix 5, made universal and gentle.
- Reserve the full quiz form (current Step 1) for Builders entering the free-write flow as a v1.1 unlock.

This satisfies both constraints: no front-loaded quiz on a kid using a prefab scaffold, AND Lesson 1's principle still gates every published game.

### Q6 — Verb-parsing for Lesson 2 (verb-operation mismatch). Failure mode?

**Verdict: real risk, but soft-warning UX neutralizes it.**

LLM verb parsing is good but not perfect. "More come out" is reliably addition; "twice as many" is reliably multiplication; but **"how many in all"**, **"left over"**, **"share"**, **"each"** can be ambiguous, and the construct-validity literature (Riley, Greeno & Heller 1983) shows even teachers misclassify CGI problem types about 10–15% of the time on edge cases.

If Lesson 2 fires as a *blocker* on a parser miss, the Builder hits a wall they can't reason through ("the system says I'm wrong but I'm not"). That is the **gaming-the-system trigger** Baker et al. (2009) identified — when the system is wrong and the user can see it, they learn to game it.

If Lesson 2 fires as a *soft warning* — *"This story sounds like it might want multiplication instead of addition. Is that right?"* with a confirm/edit choice — then a parser miss costs 5 seconds and a confirm-click. The Builder remains the authority. This is also consistent with **productive failure**: the parser surfacing an ambiguity *productively confronts* the Builder with the verb-meaning question.

**Recommendation:** Lesson 2 should always be a soft warning with Builder-final-call, never a blocker. The agent ladder (Stages 1–4 in spec §13) catches construct-validity failures downstream; Lesson 2's job is to *flag*, not to *gate*.

### Q7 — Skipping the Critic ladder visibly for template-based games — defensible?

**Verdict: defensible for Stages 1 and 3 (Critic). NOT defensible for Stages 2 and 4 (Adversary). Keep Adversary visible for templates.**

The argument (templates pre-vetted, Critic on top is paranoia and noise) holds for the **Critic** stages — yes, an SRT-passing template can't suddenly fail SRT because the Builder filled in numbers. Cost saved: roughly $0.025–$0.075 per Builder per template build, scaled across 5000+ games (the spec §13 cost projection).

But the argument **fails for the Adversary** stages, because the exploit surface is exactly where templates + bad Builder content combine:

- Numbers picked outside the standard's range (the spec already constrains this in Step 3, but only post-mad-lib; if the Builder edits, the constraint can leak).
- Theme/character choices that introduce visual tells the original Adversary catalog didn't anticipate (e.g., "the bigger character is always the right answer" pattern emerges only with specific theme choices).
- Win conditions tweaked by the Builder (the spec lists win condition as customizable). A template that was Adversary-clean at default win-conditions can become trivially exploitable with a Builder-changed win condition.
- Combinations — a template + a particular mad-lib + a particular theme might collectively introduce a visual-matching shortcut that Habgood-style intrinsic integration alone doesn't catch.

**The Critic checks structural pedagogy; the Adversary checks emergent exploits. Templates pre-vet structure; templates do not pre-vet emergent exploits.**

**Recommendation:** for template-based games run the visible ladder as **Stage 2 only (Haiku Adversary)** — fast, cheap (~$0.005), and catches the trivially-exploitable category. Stage 4 (Sonnet Adversary) runs in shadow mode (logged but not Builder-visible) for the first 100 template-built games per template; if shadow data shows >5% genuine failures, Stage 4 becomes Builder-visible for that template. Critic stages 1 and 3 remain skipped for templates as proposed.

For paste-HTML and hand-coded games, all four stages remain visible per spec §13.

---

## Risks the NEW flow introduces

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | Lesson 1 effectively never fires for prefab-scenario Builders → construct-validity drift | High | Q5 mitigation: turn Lesson 1 into a universal post-Step-2 self-check confirmation card |
| R2 | Templates + Builder customization combine into emergent exploits the Adversary never sees | Medium | Q7 mitigation: keep Stage 2 Haiku Adversary visible for templates; shadow Stage 4 |
| R3 | LLM verb parser blocks a correct Builder on an edge-case verb → gaming-the-system trigger | Medium | Q6 mitigation: Lesson 2 always soft-warning, never blocker |
| R4 | Mechanic-filter is too narrow on rare standards (e.g., 5.MD volume) → empty Step 4 picker | Low | Allow at least 3 mechanics per standard; cross-operation mechanics promoted to dual-tagged in registry |
| R5 | Mad-lib library too shallow → Builders immediately exhaust novelty within a class period | Low | Each prefab scenario needs ≥ 3 story templates; rotate to keep content fresh |
| R6 | Step 1's "no Write your own" makes a Builder feel babied; some 9th-graders rebel | Low | v1.1 unlock: free-write available after first published game |

## Risks the new flow ELIMINATES

| # | Risk that's gone | Why |
|---|---|---|
| E1 | Front-loaded 3-step quiz before the kid has done anything (motivation toxicity per Deci/Koestner/Ryan) | Lessons fire JIT, not before-build |
| E2 | Free-text scenarios that fail Discovery + SRT (Audits 7, 8 — the Sum Jumper / Wall Builder failure mode) | Mad-lib templates constrain story shape to load-bearing-math configurations |
| E3 | AI-generated full HTML with no agent gate (Audit 9's biggest finding) | AI is now confined to verb-parsing + parameter-fill; templates ship the HTML |
| E4 | Builder picks K.OA.A.1 then a mechanic that actually teaches counting or matching, not addition | Step 4 mechanic-by-operation filter |
| E5 | Builder claims standard X with a game whose verb structure matches Y | Step 3 verb parsing surfaces the mismatch |
| E6 | Builder skips playtest because submit appears immediately after generate | Step 5 must-beat-it-once gate (already in spec) |

## Proposed adjustments (in priority order)

1. **Convert Lesson 1 to a universal post-Step-2 confirmation card.** Not a quiz; one card, two buttons (Yes / Needs work), one-line nudge if "needs work." Fires for every Builder, prefab or free-write. Implements R1 mitigation. Cost: ~30 min UI work; one prompt addition. — *Most important adjustment.*
2. **Soft-warn (never block) on Lesson 2.** Verb-parser surfaces ambiguity; Builder confirms or edits. Add an "I'm sure" override that records the disagreement for later analysis. Implements R3 mitigation.
3. **Keep Stage 2 (Haiku Adversary) visible on template-based games; shadow Stage 4.** Add a per-template "shadow telemetry" surface so Barbara can see if any specific template starts showing emergent exploits. Implements R7 mitigation.
4. **Add a "Show all mechanics anyway" override to Step 4** with a one-sentence cognitive-load warning. Honors autonomy; preserves construct-validity floor. Implements Q4 nuance.
5. **Set the per-prefab-scenario template floor at ≥ 3 story templates.** Keeps Step 2 mad-lib supply fresh enough for a class period without Builders hitting "I've seen this" within their first three sessions. Implements R5.

A v1.1 backlog item: **"Start from a mechanic" alternative entry path** that swaps the order to Action → Scenario → Story → Math, gated to Builders who've shipped at least one game in the default order. Lets older / more confident Builders work mechanic-first while keeping new Builders on the intrinsic-integration ramp. Implements Q1's deferred recommendation.

---

## Citations (minimal — most foundational refs already in audits 03 / 06 / 07 / 08 / 09)

**Newly cited in this audit:**
- van Merriënboer, J. J. G., Kirschner, P. A., & Kester, L. (2003). Taking the load off a learner's mind: Instructional design for complex learning. *Educational Psychologist*, 38(1), 5–13. [OpenAlex W2127791224, 839 cites]
- Sweller, J., van Merriënboer, J. J. G., & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. *Educational Psychology Review*, 31(2), 261–292. [OpenAlex W2913144876, 1831 cites]
- Lodge, J. M., Kennedy, G., Lockyer, L., Arguel, A., & Pachman, M. (2018). Understanding difficulties and resulting confusion in learning: An integrative review. *Frontiers in Education*, 3, 49. [OpenAlex W2807738726]
- Lave, J., & Wenger, E. (1991). *Situated learning: Legitimate peripheral participation.* Cambridge University Press.
- Brown, J. S., Collins, A., & Duguid, P. (1989). Situated cognition and the culture of learning. *Educational Researcher*, 18(1), 32–42.

**Reused from prior audits (03 / 06 / 07 / 08 / 09):**
- Habgood & Ainsworth 2011 (intrinsic integration)
- Kapur & Bielaczyc 2011 (productive failure)
- Carpenter, Fennema, Franke, Levi, Empson 1999 (CGI)
- Riley, Greeno & Heller 1983 (problem-type taxonomy)
- Deci, Koestner & Ryan 1999 (undermining effect)
- Baker et al. 2004–2021 (gaming-the-system corpus)
- Plass, Homer & Kinzer 2015 (foundations of game-based learning)
- Mislevy, Almond & Lukas 2003 (evidence-centered design)
- Kirschner, Sweller & Clark 2006 (minimal-guidance critique)

---

## Files referenced
- `c:/projects/math-games-builder/docs/superpowers/specs/2026-05-10-library-design.md` — master spec
- `c:/projects/math-games-builder/docs/product-positioning.md` — north star
- `c:/projects/math-games-builder/docs/audit/2026-05-10-pedagogy-audit.md` — aggregate of audits 1–9
- `c:/projects/math-games-builder/docs/audit/07-koa-games.md`
- `c:/projects/math-games-builder/docs/audit/08-game-templates.md`
- `c:/projects/math-games-builder/docs/audit/09-build-flow.md`
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-oa-progressions.md`
- `c:/projects/math-games-builder/src/components/standard/scenario-gate.tsx` — to be replaced
- `c:/projects/math-games-builder/src/components/builders/builder-picker.tsx` — to be replaced
- `c:/projects/math-games-builder/src/components/standard/standard-panel.tsx` — to be reduced to one line
- `c:/projects/math-games-builder/src/lib/game-engines/game-option-registry.ts` — Step 4 mechanic source
