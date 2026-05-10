# Audit 06 — Agent Definitions: Pedagogical Soundness

**Date:** 2026-05-10
**Scope:** Mr. Chesure, The Critic, The Mechanic Inventor, The Shortcut Adversary
**Method:** Read each agent + knowledge files; targeted literature search (Semantic Scholar) on intrinsic integration, gaming-the-system, learning-by-teaching, worked examples / cognitive load. ERIC searches were rate-limited, so claims here lean on Semantic Scholar hits plus well-established prior literature cited from the agent files themselves.

**Source files audited:**
- `c:/projects/math-games-builder/docs/agents/mr-chesure.md`
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-oa-progressions.md`
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/fellowship-pedagogy-questions.md`
- `c:/projects/math-games-builder/docs/agents/the-critic.md`
- `c:/projects/math-games-builder/docs/agents/critic-knowledge/tested-examples.md`
- `c:/projects/math-games-builder/docs/agents/critic-knowledge/fellowship-quality-bar.md`
- `c:/projects/math-games-builder/docs/agents/critic-knowledge/pilot-feedback-apr17.md`
- `c:/projects/math-games-builder/docs/agents/the-mechanic-inventor.md`
- `c:/projects/math-games-builder/docs/agents/the-shortcut-adversary.md`

---

## 1. Mr. Chesure — Pedagogy Guardian

### Role audit
The role — "ensure every game teaches its math standard correctly" — is pedagogically defensible. The two-test framing (Discovery + Self-Revealing Truth) maps cleanly to **constructivist discovery learning** (Bruner) and to **intrinsic integration** (Habgood & Ainsworth, 2011), and the agent file cites both. Anchoring the WHAT to Common Core Progressions and the HOW to Math Learning Center manipulatives is exactly the right move — the alternative (inventing pedagogy) is the failure mode the file explicitly forbids.

The "Building IS learning" addendum (April 16, 2026) is consistent with **constructionism** (Papert, 1980) and with Kafai's (1995) finding that game-design students outperformed game-play students on conceptual measures. The agent already cites Kafai and Papert in the fellowship-questions knowledge file.

### Criteria audit (3 criteria + Discovery + Self-Revealing Truth)
- **Criterion 1 (real-world scenario):** Loosely grounded. The phrase "the way it's actually used in real life by people" is more of a design heuristic than an empirically defined construct. The closest research backing is the **situated cognition / authentic-task literature** (Brown, Collins, Duguid 1989) and Gee's (2003) "situated meaning" principle — neither cited.
- **Criterion 2 (math IS gameplay):** Directly traceable to Habgood & Ainsworth (2011) intrinsic integration. Cutting & Iacovides (2022, *Proc. ACM Hum. Comput. Interact.*) replicated and explained the effect: intrinsic integration boosts learning **by directing attention** to task-relevant features, not (as previously assumed) by motivation or cognitive-load reduction. The agent file has the principle right but doesn't cite the mechanism, which matters because it affects what the Critic should accept.
- **Criterion 3 (must know math to win):** This is essentially a **construct-validity** claim. In assessment terms, it means a learner cannot pass the task without exercising the target construct. This is well-supported by Shute's stealth-assessment literature and by Mislevy's evidence-centered design (ECD). The agent file's framing is right but informal.
- **Discovery test + Self-Revealing Truth:** Discovery learning has a contested research base — Kirschner, Sweller & Clark (2006) famously argued that minimally-guided instruction is inefficient relative to worked examples for novices. Mr. Chesure's "Discovery test" risks running afoul of this critique unless the game provides scaffolded examples or worked first-rounds. The agent does not currently address the **expertise-reversal effect** (Kalyuga et al.) or worked-example fading.

### Gaps the research identifies
1. **No worked-example / cognitive-load framing.** Sweller's CLT predicts that pure discovery without scaffolding overloads novice learners. Mr. Chesure's "Discovery" criterion as written does not require any worked-example onboarding round, only that the math be discoverable from mechanics. This is a real risk for genuinely novice players (the K–4 audience).
2. **CPA progression is mentioned but not enforced.** Bruner's CPA appears in one bullet and once in the knowledge file, but no criterion checks "is this game at the right point in the CPA sequence for the target learner?" A K.OA game showing symbolic equations on round 1 violates the Progressions but would pass current criteria.
3. **No misconception checklist.** Carpenter & Fennema's CGI work catalogues predictable misconceptions (e.g., "counting all" vs "counting on", commutativity not yet internalized, equation-as-instruction vs equation-as-recording — the K.OA knowledge file lists these but the agent's checklist does not pull them in). Critic-style review should flag games that **mis-handle a known misconception**, not just games with shortcuts.
4. **No fluency-vs-conceptual distinction.** NCTM's Process Standards and the Common Core distinguish conceptual understanding, procedural fluency, and application. The agent's criteria conflate them. A K.OA.A.5 fluency game and a K.OA.A.1 representation game require different evaluative bars.
5. **Citation list is informal.** The agent says "do not invent pedagogy" but has no required-citation field on its output. A Critic-quality output should force the agent to produce a citation per criterion judgment.

### On worked examples and cognitive load (specific to the user's question 4)
The current "design brief" format Mr. Chesure produces (brief = "what makes a game truly teach") aligns with **example-based instruction for builders** but not for players. For Builders (the older learners using Mr. Chesure's brief), the brief functions as a worked example of "how to translate a standard into a mechanic" — this is consistent with Sweller's CLT (worked examples reduce extraneous load while learning a complex schema). Good.

For Players, however, Mr. Chesure's Discovery criterion as written can violate CLT if the game expects pure inductive discovery of the math. Recommend: require every game to support a worked first round or a faded-example onboarding (e.g., "watch the system do one, then you do one"). This is consistent with Renkl & Atkinson's (2003) example-fading research.

### Proposed changes to `mr-chesure.md`
- Add a **6th check**: "Is this game positioned correctly in the CPA progression for the target standard? Concrete-only at K.OA; pictorial intermediates by 3.OA; symbolic only after concrete/pictorial mastery."
- Add a **7th check**: "Does the game include either (a) a worked first round, (b) a faded example, or (c) a scaffolded discovery path? Pure cold-discovery is discouraged for novices (Kirschner, Sweller, Clark 2006)."
- Add a **misconception field** to output: "Which K-grade misconception(s) (per Carpenter & Fennema CGI / Progressions Doc) does this game test against?"
- Add a **construct-validity field**: "What target construct does winning this game require? What construct could a learner exercise instead and still win?"
- Tighten Citation rule: every PASS/FAIL bullet must cite a specific Progressions Doc page or peer-reviewed source. Currently optional, should be required.

### Key citations
- Habgood, M. P. J., & Ainsworth, S. E. (2011). Motivating children to learn effectively: Exploring the value of intrinsic integration. *J. of the Learning Sciences*. (cited by file)
- Cutting, J., & Iacovides, I. (2022). Learning by Doing: Intrinsic Integration Directs Attention to Increase Learning In Games. *Proc. ACM Hum. Comput. Interact.* (NEW — explains the mechanism, attentional)
- Kirschner, P. A., Sweller, J., & Clark, R. E. (2006). Why Minimal Guidance During Instruction Does Not Work. *Educational Psychologist*. (NEW — discovery-learning critique)
- Renkl, A., & Atkinson, R. K. (2003). Structuring the transition from example study to problem solving in cognitive skill acquisition: A cognitive load perspective. *Educational Psychologist*. (NEW — example fading)
- Carpenter, T. P., & Fennema, E. (1992). Cognitively Guided Instruction. *American Educator*. (already implicit — should be made explicit)
- Kafai, Y. B. (1995). Minds in Play. (cited)
- Papert, S. (1980). Mindstorms. (cited)
- Common Core Progressions Documents (cited)

---

## 2. The Critic — Game Quality Judge

### Role audit
The Critic's role — apply the 3 criteria as a quality gate — is defensible and complements Mr. Chesure cleanly (Mr. Chesure validates pedagogy alignment with the standard; the Critic validates that the game's structure forces the math). The blunt-tone instruction is appropriate for an automated reviewer; humans tend to over-rationalize borderline games.

The split between **quiz-wrapper detection** and **fake-intrinsic detection** is a meaningful taxonomy and matches Habgood's (2007) PhD thesis distinction between "exogenous" and "endogenous" fantasy. This is good.

### Criteria audit
Tested-examples.md (FAIL 1–11, PASS 1–2) is the strongest part of the entire agent stack. Each FAIL is grounded in a real Barbara test, with a specific failure mode named — this is closer to a **rubric anchored in exemplars** (Sadler 1989) than to invented heuristics. Learning scientists would recognize and mostly endorse:
- FAIL 1 (Mystery-Side / counting weights for grade-6 algebra) — correctly flagged as **construct underrepresentation** in Messick's (1989) validity framework. The task taps a different construct than the target.
- FAIL 3 (Free Collect — match the digit) — correct call. This is what Baker et al. (2009) call **"shallow strategy" exploitation**, the canonical gaming-the-system pattern.
- FAIL 7 (red/green answer reveal) — correct call; consistent with Shute & Ventura's (2013) feedback-design principles (informational, non-judgmental feedback only after committed response).
- FAIL 8 ("Real or Made Up?" framing) — correct call, but the deeper construct ("is this a situation where math is **necessary**?") is closer to Boaler's (1993) **"realistic" mathematics** distinction than the file acknowledges.

**Concerns:**
- The Critic's check list does not include **construct validity** as a named criterion — it folds it into Criterion 2/3 implicitly. In assessment research that's a separate dimension.
- The Critic does not check for **edge cases / floor effects**. If a game's only difficulty is at the ceiling, novice players fail-fail-fail and quit. NCTM's "productive struggle" is the relevant frame.
- The Critic's "Quiz-wrapper" test fires on "shows a question and lets you select an answer" — but some legitimate games do this (e.g., a fraction-pour game with 3 target levels presented as choices). The rule needs a "unless the selection IS the math action" clause; otherwise the agent will reject borderline-good games.
- No check for **affective traps** — Rodrigo & Baker (2011) found that intelligent tutors actually generated more positive engagement than commercial math games in their Philippines study. This complicates the assumption that "more game = more learning". The Critic should distinguish "engagement that drives learning" from "engagement-as-distraction."

### Do its rejection criteria correlate with what learning scientists would reject?
Mostly yes. The FAIL examples line up with what Baker, Habgood, Shute, and Boaler would reject. The **specific gap** is that the Critic can identify shortcut-exploitable games (Criterion 3) but does not have a vocabulary for **construct validity violations** that aren't shortcuts — e.g., a game where the math action is technically required but at a different cognitive level than the standard demands (FAIL 1 is exactly this case, and the Critic file gets it right *as an exemplar* but the rule-set doesn't generalize).

### Proposed changes to `the-critic.md`
- Add **Criterion 4: Construct validity.** "If the learner wins this game, does that win demonstrate they've exercised the *specific cognitive operation* the standard requires? A scale-balancing game that rewards counting wins but does not demonstrate inverse-operation reasoning, fails Criterion 4 even if it passes 1–3."
- Add **Quiz-wrapper exception clause:** "Selection from a list IS allowed when the act of selecting is the mathematical operation (e.g., choosing which fraction equals the magnitude shown on a number line, where reading the number line IS the math)."
- Add **floor-effect check:** "Is round 1 winnable by the target novice in <60 seconds? Are early rounds genuinely scaffolded, or does difficulty start at the standard's ceiling?"
- Add **citation requirement** to verdict output (one sentence per criterion grounding it in tested-examples or research).
- Cross-reference **Shortcut Adversary** verdict explicitly: "If Shortcut Adversary returned EXPLOITABLE or worse, Criterion 3 is auto-FAIL."

### Key citations
- Messick, S. (1989). Validity. In *Educational Measurement* (3rd ed.). (NEW — construct underrepresentation, construct-irrelevant variance)
- Baker, R. S. J. d., et al. (2009). Educational Software Features that Encourage and Discourage "Gaming the System." (NEW — shallow strategies)
- Shute, V. J., & Ventura, M. (2013). Stealth Assessment: Measuring and Supporting Learning in Video Games. (NEW)
- Habgood, M. P. J. (2007). The effective integration of digital games and learning content. PhD thesis. (already implicit)
- Boaler, J. (1993). The role of contexts in the mathematics classroom: Do they make mathematics more "real"? (NEW)
- Sadler, D. R. (1989). Formative assessment and the design of instructional systems. (NEW — exemplar-anchored rubrics)

---

## 3. The Mechanic Inventor — Generates Game Mechanics

### Role audit
A **generator** agent in this stack is well-motivated. The file's framing — "the rest of the agent stack can reject bad games but couldn't propose good ones" — is correct. Without a generator, the system biases toward conservative re-use of templates, which Barbara's pilot already showed is a quality-ceiling problem.

The output schema (9 fields per concept including pedagogical citation + game design citation) is excellent in principle. It forces the agent to ground every concept in two literatures simultaneously. This is closer to **structured design rationale** (MacLean et al., 1991, *QOC notation*) than to free-form ideation, and that is the right move.

### Are mechanic-to-math mappings evidence-based or invented?
The agent file does **not** propose specific mappings — it only requires that the generator cite a source per concept. That's defensible (the agent isn't claiming the mappings; the generator is producing them per-task). However, the **planned knowledge files** (`pedagogy-to-mechanic-map.md`) are where the real evidence-base will live, and they don't exist yet. Until they do, the agent is generating ad-hoc mappings every run.

The user's question — "do mechanic-to-math mappings have research basis (e.g., body-based / spatial / linguistic / quantitative reasoning)" — points to **Plass, Homer & Kinzer (2015)** (*Foundations of Game-Based Learning, Educational Psychologist*), which proposes a four-mode taxonomy: cognitive, motivational, affective, sociocultural. And to **Gee (2003)** for situated/embodied principles, and to **Shaffer's epistemic frames** for professional-practice mappings. None of these are cited in the agent file.

A research-grounded mechanic taxonomy for math specifically would draw on:
- **Number-line / SNARC effect** literature (Dehaene's spatial-numerical association) → mechanics involving spatial movement along a line
- **Subitizing research** (Mandler & Shebo 1982) → mechanics involving small-set instant recognition (≤4 objects)
- **Embodied cognition / gesture studies in math** (Goldin-Meadow, Núñez & Lakoff *Where Mathematics Comes From*) → drag/pour/stack mechanics
- **Bruner's CPA progression** → mechanic complexity tier

The agent currently lacks any of this. The "Diversity quota" (drag, pour, stack, time, aim, sort, build, trade) is a useful heuristic but is not grounded in a cognitive-mechanism taxonomy.

### Gaps the research identifies
1. **No cognitive-mechanism taxonomy.** A mechanic that uses the SNARC effect (number-line hopping) is doing different cognitive work than one using subitizing (count-the-dots). The Inventor should know this and pick deliberately.
2. **No age-appropriateness gate.** Subitizing maxes out around 4–5 items at age 5–7; a "count the marbles" mechanic with 15 marbles is wrong-tool-for-age. The agent file mentions "player profile: age band" as input but has no rule for using it.
3. **Pedagogy citation is required, but standard is loose.** "Adapt from Open Up Resources / Math Learning Center" is solid. But the agent should also be required to name the *specific* MLC manipulative pattern adapted (Number Frames? Number Rack? Number Line?) — currently optional.
4. **No counter-example field.** The agent generates 5–10 concepts but doesn't have to surface concepts that *almost work but fail* — which would help the Critic and Adversary do their jobs better. Add: "1 explicit near-miss per request, with the failure mode named."

### Proposed changes to `the-mechanic-inventor.md`
- Add a **Cognitive-mechanism field** to each concept: "Which cognitive system does this mechanic primarily exercise? (subitizing / spatial-numerical mapping / part-whole decomposition / cardinal counting / unitization / proportional reasoning / etc.)" — pulled from a small fixed taxonomy.
- Add an **Age-appropriateness field** with explicit reasoning: "Why is this mechanic right for the player profile's age band?"
- Add a **Specific-manipulative citation:** name the MLC tool or Open Up activity, not just the publisher.
- Require **1 near-miss concept** per output — explicitly labeled, with failure mode named.
- Build the planned `pedagogy-to-mechanic-map.md` as a real artifact, anchored on Plass et al. (2015) modes and Bruner CPA tiers, before the agent ships at scale.

### Key citations
- Plass, J. L., Homer, B. D., & Kinzer, C. K. (2015). Foundations of Game-Based Learning. *Educational Psychologist*. (NEW — 4-mode taxonomy)
- Gee, J. P. (2003). What Video Games Have to Teach Us About Learning and Literacy. (already implicit)
- Shaffer, D. W. (2006). How Computer Games Help Children Learn. (NEW — epistemic frames)
- Dehaene, S. (1992). Varieties of numerical abilities. *Cognition*. (NEW — SNARC, mental number line)
- Mandler, G., & Shebo, B. J. (1982). Subitizing: An analysis of its component processes. (NEW)
- Núñez, R. E., & Lakoff, G. (2000). Where Mathematics Comes From. (NEW — embodied math)
- Bruner, J. S. (1966). Toward a Theory of Instruction. (CPA — already cited)

---

## 4. The Shortcut Adversary — Tries to Beat the Game Without Knowing the Math

### Role audit
This is the strongest-conceived agent of the four. Adversarial play-testing for "shortcuts that bypass the math" maps **directly** onto two well-established research areas:

1. **Gaming-the-system** (Baker, Corbett, Koedinger and collaborators, 2004–2021). Baker's group has spent two decades cataloguing how students exploit educational software — guessing, hint-spamming, off-task behavior, "WTF" inquiry without thinking. The Adversary's shortcut catalog (random clicking, brute force, UI patterns, timer exploits, hint exhaustion) maps almost 1:1 onto this literature.
2. **Stealth assessment / construct validity in games** (Shute, Ventura, Mislevy). The fundamental claim is that a game-based assessment is only valid if winning *requires* exercising the target construct. The Adversary is the empirical test of that claim.

So: the agent's role is well-supported by research. Better than that — the Adversary is doing what stealth-assessment researchers explicitly recommend (red-teaming construct validity by trying to win without the construct).

### Are its checks evidence-based or invented?
The 12-item shortcut catalog is largely empirical (Baker et al. 2009, 2010, 2013). Specifically:
- **Random clicking, brute force** → Baker's "guessing" detector
- **Hint exhaustion** → Aleven & Koedinger's (2000) "help abuse" / Baker's hint-spamming
- **Pattern matching on UI** → Baker's "shallow strategy"
- **Memorization across rounds** → Anderson's drill-vs-conceptual distinction
- **Counting from displayed labels** → directly matches FAIL 3 (Free Collect) in tested-examples

The three adversary personas (Random Toddler, Pattern Matcher, Lazy Optimizer) are well-chosen — they roughly correspond to Baker's empirical clusters of gaming behavior. This is good design.

### Gaps the research identifies
1. **No false-positive guard.** Baker (2008) found that some "gaming-like" behavior is actually legitimate exploration. The Adversary as written has no mechanism to distinguish "shortcut" from "discovered insight." A learner who realizes "oh, the answer is always the largest pile because 5+3 produces a bigger pile than 2+3" has done real math. The Adversary should flag this as a *design problem* (predictable correct answer position), not as a *learner cheat*.
2. **No adversary persona for "skilled-but-not-on-target."** A learner who already knows the math at a higher grade can win the game without exercising the *target* construct. This is a different shortcut than "no-math-at-all" — it's construct-misalignment. Add a **Bored Expert** persona.
3. **Severity rubric is informal.** "How often does this work" should be quantified (e.g., HIGH = wins ≥ 80% of trials with ≤ 5 actions per round).
4. **Repair suggestions are underspecified.** The agent is told to propose "smallest change that closes the shortcut" but isn't given a vocabulary of repair patterns (randomize position, add a count-step, hide labels, require commit, etc.). A small **repair-pattern library** in the planned knowledge file would tighten this.
5. **No explicit handoff to construct-validity check.** The Adversary's findings are most useful if mapped to "did the win exercise the target construct?" — the bridge to Mr. Chesure / Critic could be made tighter.

### Does adversarial play-testing align with stealth-assessment / game-based assessment validity research?
Yes, strongly. This is one of the few agents that maps cleanly onto a well-established research methodology. **Mislevy's evidence-centered design** (ECD) explicitly requires asking: "what alternative explanations exist for a successful response?" The Adversary is operationalizing that question. This should be made explicit in the file — currently it's implicit.

### Proposed changes to `the-shortcut-adversary.md`
- Add **Bored Expert persona**: "A learner already fluent at this standard's parent skill plays the game. Can they win using the higher-level skill instead of the target construct? If yes, the game tests the wrong level."
- Add **false-positive clause**: "If a 'shortcut' requires the learner to genuinely understand a relationship in the game world (e.g., 'larger pile = larger sum'), classify as DESIGN FLAW (predictable answer position) rather than gaming-the-system. Repair the design; don't blame the player."
- Quantify **Severity**: "HIGH = wins ≥ 80% of trials with ≤ 5 actions/round; MEDIUM = wins 30–80% with bounded effort; LOW = rare, requires significant pattern-finding effort."
- Build the planned **`exploit-archive.md`** as a repair-pattern library, organized by shortcut category, with the canonical fix per category (e.g., random-position, hide-label, commit-button, randomize-target).
- Cite **Mislevy's ECD** explicitly in the agent's framing — the Adversary is the construct-validity red team.

### Key citations
- Baker, R. S. J. d., et al. (2009). Educational Software Features that Encourage and Discourage "Gaming the System." (NEW — directly applicable)
- Baker, R. S. J. d., et al. (2010). Detecting Gaming the System in Constraint-Based Tutors. (NEW)
- Baker, R. S. J. d., Corbett, A. T., Koedinger, K. R., & Wagner, A. Z. (2004). Off-Task Behavior in the Cognitive Tutor Classroom. (NEW)
- Wixon, M., Baker, R., Gobert, J., Ocumpaugh, J., & Bachmann, M. (2012). WTF? Detecting students who are conducting inquiry without thinking fastidiously. (NEW)
- Aleven, V., & Koedinger, K. R. (2000). Help Seeking and Help Design in Interactive Learning Environments. (NEW — hint abuse)
- Mislevy, R. J., Steinberg, L. S., & Almond, R. G. (2003). On the structure of educational assessments. (NEW — ECD)
- Shute, V. J., & Ventura, M. (2013). Stealth Assessment. (NEW)

---

## Summary

### Overall pedagogical soundness
- **Mr. Chesure:** Defensible role, partial research grounding. Strongest where it cites Progressions Docs and MLC; weakest on cognitive-load / worked-example literature and on misconception-mapping. Needs CPA-progression check, worked-example onboarding rule, and explicit misconception list per standard.
- **The Critic:** Strong agent. Tested-examples.md is exemplar-anchored and pedagogically sound. Main gap is no explicit **construct-validity** criterion separate from shortcut detection, and no quiz-wrapper exception for legitimate-selection mechanics.
- **Mechanic Inventor:** Right idea, ungrounded execution. Needs a real cognitive-mechanism taxonomy (Plass et al., Dehaene, subitizing literature) before it ships — currently the diversity quota substitutes for theory.
- **Shortcut Adversary:** Strongest research alignment of the four. Maps directly onto Baker's gaming-the-system literature and Mislevy's ECD. Needs only a Bored Expert persona, false-positive guard, and a repair-pattern knowledge file.

### Cross-cutting issues
1. **Citation discipline is uneven.** Mr. Chesure says "never invent pedagogy" but doesn't require a citation field on output. The Mechanic Inventor *does* require citations, which is correct. Make this consistent across all four agents.
2. **Construct validity is not a first-class concept** in the Critic or Mr. Chesure. In assessment research it should be. Add it as a named criterion.
3. **Cognitive-load / worked-example / scaffolding literature is missing from all four.** Sweller, Renkl, Kalyuga should appear at least in Mr. Chesure and the Mechanic Inventor.
4. **No agent enforces the CPA progression as a gate.** Currently any game at any level of abstraction can pass criteria as long as the math is required. CPA should be a Mr. Chesure check.
5. **Misconception lists exist (in K.OA knowledge file) but no agent's output requires checking against them.** This is the single most underused piece of evidence in the stack.
6. **Plass et al. (2015) four-mode taxonomy** of game-based learning (cognitive, motivational, affective, sociocultural) would give the whole stack a cleaner ontology than the current ad-hoc framing.

### Highest-leverage edits (if Barbara picks just three)
1. **Add Construct Validity as Criterion 4 in the Critic** (with the Mystery-Side / Desert Runner examples already in tested-examples.md as anchors). This catches a class of failure the current 3 criteria only catch by accident.
2. **Build the Mechanic Inventor's `pedagogy-to-mechanic-map.md`** anchored on Plass et al. + Dehaene + Bruner CPA + subitizing research, before the agent generates at scale. Without it the agent is producing ad-hoc mappings.
3. **Add a CPA-progression check to Mr. Chesure** (one criterion, one sentence). This is the single biggest gap given that K.OA games can currently pass without being concrete-first.

### Search-spend note
Total search spend was well under cap — the deep-research script was rate-limited and the Windows console encoding error truncated several queries. Audit conclusions therefore lean on (a) what was retrieved (Habgood/Cutting/Iacovides intrinsic-integration thread, full Baker gaming-the-system corpus) and (b) well-established prior literature already cited within the agent files (Habgood & Ainsworth, Kafai, Papert, Bruner, Common Core Progressions, Carpenter & Fennema). A follow-up audit with a working ERIC connection would strengthen the misconception-mapping and CPA-progression citations specifically.
