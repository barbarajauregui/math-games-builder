# Audit 3 — Discovery test + Self-Revealing Truth framework

*Auditor: Claude (Opus 4.7) · Date: 2026-05-10 · Cap: ~$3 in academic searches*
*Sources: ERIC (IES), OpenAlex. Citations are real, ID-verified, retrievable.*

---

## Summary

**Barbara's three criteria — Discovery test, Self-Revealing Truth test, "Math IS the gameplay" — are largely well-grounded restatements of established research findings, not new inventions.** Each maps onto a published, peer-reviewed framework with 10–25 years of empirical support:

| Barbara's criterion | Closest established framework | Verdict |
|---|---|---|
| "Math IS the gameplay" | Habgood & Ainsworth (2011), **intrinsic integration** | Direct match. Same idea, different words. |
| Self-Revealing Truth (correctness shown by physics, not popups) | Shute et al. (2010, 2021), **stealth assessment / evidence-centered design**; also a sub-claim of intrinsic integration ("learning content is delivered through the core mechanics of play") | Direct match on the assessment side; partial match on the feedback side. |
| Discovery test (a non-knower can learn the math by playing) | Papert (1980), **constructionism** + **discovery learning** tradition | Match on intent, but the literature is sharper than Barbara's criterion: pure discovery without scaffolding underperforms (Kirschner, Sweller & Clark 2006; Lazonder & Harmsen 2016). |

**Honest assessment.** The framework is ~80% derivative of well-established work and ~20% novel in how it stitches the three criteria into a single pass/fail rubric for builder-authored games. The novelty isn't the criteria themselves — it's the operationalization (kid builders apply them, not researchers) and the protégé-loop context (an upstream Builder must satisfy them so a downstream Player can learn). That stitching is genuinely uncommon in the literature.

**The framework is missing two failure modes the literature has documented for 15 years**: (1) discovery without guidance underperforms direct instruction for novices, and (2) intrinsic integration alone does not guarantee transfer — kids can learn the *game* and not the *math*. The framework should add explicit checks for both.

---

## Closest established frameworks

### 1. "Math IS the gameplay" ≈ Intrinsic Integration (Habgood & Ainsworth, 2011)

**Citation:** Habgood, M. P. J., & Ainsworth, S. E. (2011). Motivating Children to Learn Effectively: Exploring the Value of Intrinsic Integration in Educational Games. *Journal of the Learning Sciences*, 20(2), 169–206. ERIC: EJ922627.

**What they showed.** Two controlled studies with elementary-age children. The same mathematical content (number factorisation) was delivered in two game versions: an *intrinsically integrated* version (math operations are the core mechanic) vs. an *extrinsically integrated* version (math is a quiz interrupting an unrelated mechanic). The intrinsic version produced significantly more learning *and* more time-on-task in free-play conditions. Their definition of intrinsic integration: "learning content is delivered through the core mechanics of play, and the player's engagement with the content is the same as their engagement with the game."

**Verdict on Barbara's criterion.** "If you can remove the math and the game still works, the math is decoration" is a pithy restatement of Habgood & Ainsworth's operational definition of extrinsic integration. The criterion is **defensible and well-cited**. Using "intrinsic integration" as the formal name in agent prompts and design briefs would let the framework borrow 15 years of empirical credibility.

**Supporting evidence.**
- Denham (2016), *Technology, Knowledge and Learning*, ERIC EJ1105510 — applied intrinsic integration to a multiplication game; design-iteration study confirmed gains.
- Echeverria et al. (2012), *Computers & Education*, ERIC EJ967019 — "Atomic Intrinsic Integration" approach formalised the design methodology for physics conceptual games.
- Walkington (2020), ERIC ED612086 — review confirming intrinsic integration is one of the few empirically supported design principles for learning games.

### 2. Self-Revealing Truth ≈ Stealth Assessment (Shute, 2010–2024)

**Primary citation:** Shute, V., Lu, X., & Rahimi, S. (2021). Stealth Assessment. ERIC: ED612156. See also Rahimi & Shute (2024), *Educational Technology Research and Development*, ERIC EJ1447935.

**What it is.** Stealth assessment uses *evidence-centered design* (Mislevy, Steinberg & Almond, 2003) to embed assessment into the mechanics of a game, so that "correctness" is inferred from in-game behavior rather than reported via popups, scores, or interruptions. Validity studies in Physics Playground (Shute et al., 2021, ERIC EJ1281101) showed in-game stealth measures correlated with external physics tests.

**Verdict on Barbara's criterion.** "Correctness is shown by game-world physics, not by a popup" is a learner-facing rephrase of the *feedback* half of stealth assessment. The framework is well-supported on the *no popups* point. **It under-specifies the assessment half:** stealth assessment in the Shute tradition is not just about how feedback looks — it requires a *competency model* (what skill is being measured) and an *evidence model* (which in-game actions count as evidence). Barbara's framework currently has the competency model implicit in the standard tag but no explicit evidence model. **Recommendation:** add an "evidence model" requirement to the design brief — the Builder must declare *which player actions, if performed correctly, prove the math was understood.* This is what agents should grade against.

### 3. Discovery test ≈ Constructionism (Papert, 1980), with caveats from the Kirschner / Lazonder critique

**Constructionism citation:** Holbert, Berland, & Kafai, eds. (2020). *Designing Constructionist Futures.* MIT Press. ERIC: ED611884. (The original framework is Papert, 1980, *Mindstorms*; this is the contemporary review volume.)

**Critique citations:**
- Kirschner, P. A., Sweller, J., & Clark, R. E. (2006). Why Minimal Guidance During Instruction Does Not Work. *Educational Psychologist*, 41(2). [Widely cited critique — discovery learning without scaffolding consistently loses to direct instruction for novices.]
- Lazonder, A. W., & Harmsen, R. (2016). Meta-Analysis of Inquiry-Based Learning. *Review of Educational Research*. OpenAlex W2267754083, 828 citations. **Headline:** inquiry-based learning *with* guidance produces d ≈ 0.50 on learning outcomes; *without* guidance, effects vanish or reverse.

**Verdict on Barbara's criterion.** "A learner who doesn't know the math can learn it by playing" is the constructionist ideal, and the framework rightly insists on it. **But the criterion as written tolerates pure discovery with zero guidance, which the literature says doesn't work for novices.** A Builder could pass the Discovery test by saying "well, the kid will figure it out eventually" — and the agent has no way to flag that as inadequate. The literature is clear that this is a real failure mode.

**Recommendation:** strengthen the Discovery test to "A learner who doesn't know the math can learn it by playing *with the scaffolds the game itself provides* — escalating hints, worked examples revealed on stuck-detection, or progressive complexity." This is consistent with Kapur's productive failure (next).

### 4. Bonus framework Barbara should adopt: Productive Failure (Kapur)

**Citation:** Kapur, M., & Bielaczyc, K. (2011). Designing for Productive Failure. *Journal of the Learning Sciences*, 21(1). OpenAlex W2080548691, 630 citations.

**What it is.** Students who attempt to solve problems *before* receiving instruction — even when they fail — outperform students who are taught first, on transfer measures. The mechanism: failed attempts activate prior knowledge, surface gaps, and prepare the learner for direct instruction.

**Why it matters here.** Barbara's "build first, learn as needed" principle (positioning §core-beliefs #4) is essentially productive failure applied to *Builders*. This deserves an explicit citation in positioning — it's one of the most replicated findings in math education over the last 15 years and gives the "build first" claim heavy empirical backing.

### 5. Embodied math cognition (supporting, not central)

**Citations:**
- Nathan, M. J., & Walkington, C. (2017). Grounded and Embodied Mathematical Cognition. ERIC ED604025.
- Schenck, Walkington & Nathan (2022). ERIC ED624706.

**Why it matters.** Both papers ground a related claim: math reasoning improves when learners physically *act out* the math (gesture, movement, manipulation) rather than only reading symbols. This supports Barbara's "the learner's hand, eye, or voice performs the operation" rule (positioning §core-beliefs #1). The framework already has this principle; embodied cognition gives it a citation.

### 6. Protégé effect (separate audit topic, but worth flagging)

**Citation:** Chase, C., Chin, D., Oppezzo, M., & Schwartz, D. (2009). Teachable Agents and the Protégé Effect. *Journal of Science Education and Technology*. ERIC EJ855299.

This is the empirical paper Barbara's whole product is built on. It is appropriate to cite it explicitly in positioning — the field calls this "the protégé effect" by name, replicated in multiple contexts since 2009.

---

## Claims audited

| # | Claim from positioning §core-beliefs | Verdict | Citations |
|---|---|---|---|
| 1 | "The learner does the math — never the system." (no auto-counted piles, no running totals) | **Supported.** Embodied cognition + intrinsic integration both predict that the *learner's* action on the math is what produces learning. | Habgood & Ainsworth 2011 (EJ922627); Nathan & Walkington 2017 (ED604025) |
| 2a | Discovery test: "a learner who doesn't know the math can learn it by playing" | **Partly supported.** Constructionism endorses this; minimal-guidance critique warns it fails without scaffolds. | Papert 1980 / Holbert et al. 2020 (ED611884); Kirschner Sweller Clark 2006; Lazonder & Harmsen 2016 (W2267754083) |
| 2b | Self-Revealing Truth: "correctness is shown by game-world physics, not by a popup" | **Supported but under-specified.** Stealth assessment requires not just no-popups but an *evidence model* — which actions count as proof. Framework should add this. | Shute Lu Rahimi 2021 (ED612156); Rahimi & Shute 2024 (EJ1447935) |
| 2c | "If you can remove the math and the game still works, the math is decoration" | **Strongly supported.** This IS Habgood & Ainsworth's intrinsic-integration test, almost word for word. | Habgood & Ainsworth 2011 (EJ922627); Denham 2016 (EJ1105510); Echeverria et al. 2012 (EJ967019) |
| 3 | "Kids teaching kids is the teaching mechanism" | **Supported.** Protégé effect replicated in K-12 contexts since 2009. | Chase et al. 2009 (EJ855299) |
| 4 | "Build first, learn as needed" | **Strongly supported.** This is productive failure; one of the most replicated findings in math ed. Cite Kapur explicitly. | Kapur & Bielaczyc 2011 (W2080548691) |
| 5 | "Real audiences create real learning" (no orphan games) | **Plausible but under-cited in our search.** Authentic-audience writing pedagogy supports this; we didn't find a direct GBL citation in this audit's budget. | Flag for follow-up |
| 6 | "Adapt proven pedagogy — don't invent it" | **Meta-claim, not a research claim.** This is good epistemic hygiene; the framework practices what it preaches by leaning on Progressions Docs / OUR / MLC. | n/a |

---

## Where the framework is novel vs. derivative

**Derivative (≈ 80%):**
- Intrinsic integration — Habgood & Ainsworth had it in 2011.
- Stealth assessment / no-popups — Shute had it in 2010.
- Build-first / productive failure — Kapur had it in 2008.
- Constructionist learning by making — Papert had it in 1980.
- Embodied math — Nathan, Walkington, Glenberg established the GEMC framework over the last decade.
- Protégé effect — Chase et al. coined the term in 2009.

**Genuinely novel (≈ 20%), in approximate order of value:**
1. **Stitching the three game-quality tests into a single pass/fail rubric an agent can apply to a kid-built game.** Habgood gave us intrinsic integration; Shute gave us evidence-centered design — neither is operationalized as a ten-minute review checklist for a 12-year-old's HTML game. That packaging is original to MGB.
2. **Cross-age authoring as the engine of supply for stealth-assessed games.** Existing stealth-assessment work (Physics Playground et al.) is built by researchers for learners. MGB inverts the supply: kids build the games that other kids learn from, and the rubric still applies. We didn't find prior work doing this in math.
3. **The Discovery + SRT pair as a content-acceptance gate, not a research instrument.** In the literature these are evaluative frameworks academics use post-hoc. Here they're a publish/reject decision applied at scale by AI agents. That's a deployment innovation, not a theory innovation.

**Recommendation.** Stop calling these "Barbara's tests" internally — call them what the field calls them. It costs nothing and buys instant credibility with educators, fellowships, and reviewers. The novelty is the system, not the criteria.

---

## Risks the framework may not catch

These are failure modes the literature has documented and the current criteria don't surface:

1. **Discovery without scaffolding (Kirschner et al. 2006; Lazonder & Harmsen 2016).** A Builder can pass the Discovery test by writing "the kid will figure it out." The framework needs a scaffold check: *if the player gets stuck, what does the game do?*

2. **Learning the game, not the math (Habgood himself flags this).** Even intrinsically integrated games can produce kids who are great at the game and have poor transfer to symbolic math. The framework needs a *transfer check* — at minimum a paper-and-pencil retention probe after play, ideally a different mechanic on the same standard.

3. **Game-based learning effect sizes are small on average (Tokac, Novak & Thompson 2019, *JCAL*, ERIC EJ1214508; meta-analysis d ≈ 0.13, p = 0.02 across 24 studies).** Not every game that passes the framework will move achievement. The Builder dashboard's "kids who learned" metric needs a real measurement, not just play counts and ratings — otherwise we will overclaim.

4. **The Self-Revealing Truth test can be gamed by visual feedback that *looks* physical but isn't.** A confetti animation when the player taps the right answer is still a popup wearing a costume. The literature's stricter standard: the game-world state itself must be *causally* different (the bridge falls, the box doesn't fit, the dot doesn't reach the target) — not decorated differently.

5. **Stealth assessment needs ground-truth validation.** Shute's work always pairs in-game measures with external tests to validate that the in-game evidence actually predicts learning. MGB doesn't do this yet. Until it does, "approved" is a quality signal, not a learning signal.

6. **The protégé effect requires real consequences for the protégé (Chase et al. 2009).** Builders who think no one will play their game don't get the protégé bump. The "no orphan games" rule is therefore not just nice-to-have — it's load-bearing for the protégé loop. If it weakens, the whole thesis weakens.

---

## Proposed additions to the framework

Concrete tests to add to the Builder design brief and the Critic / Mr. Chesure agent prompts. Each is grounded in the citations above.

1. **Add: "Evidence Model" requirement** *(from Shute / evidence-centered design).* Before the Builder builds, they must declare: "If the player does **X** correctly, that proves they understand **Y**." The agent grades against that declared model, not a vague gut feel. This is the missing assessment half of SRT.

2. **Add: "Stuck Behavior" requirement** *(from Kirschner et al.; Lazonder & Harmsen).* The brief asks the Builder: "What happens when a player tries the wrong thing three times in a row?" Acceptable answers: progressive hint, simpler version, worked example. Unacceptable: "they keep trying" or "they'll figure it out." This closes the discovery-without-guidance loophole.

3. **Add: "Causal Feedback" sub-test under SRT** *(strengthens Habgood / Shute).* Distinguish *causal* feedback (the game-world simulation produces the consequence) from *decorative* feedback (a particle effect plays on success). Only causal feedback satisfies SRT in the strict sense. Confetti is decoration.

4. **Add: "Transfer Probe" for verified games** *(from Habgood self-critique; Tokac et al. meta-analysis).* For a standard to be considered *covered* — not just *built* — at least one peer-played game must be paired with a 3–5 item retention probe in a different format (paper, different mechanic). Until then, plays-and-ratings is supply, not learning.

5. **Add: "Productive Failure" framing to the Builder onboarding** *(from Kapur).* Cite Kapur explicitly when explaining the inverted flow. Builders should know the research backs the "build first, math spec on demand" approach — it makes the unusual flow legible as pedagogy, not laziness.

6. **Add: Citations to positioning doc.** Each of the six core beliefs should carry a one-line research footnote pointing to the closest peer-reviewed source. The positioning doc currently asserts these as principles; with footnotes, it becomes a research-grounded design brief. Particularly important for Acton parents, fellowship reviewers, and Mr. Chesure's own knowledge files.

---

## Cost note

Total search spend: well under the $3 cap. ~12 queries across ERIC + OpenAlex, no PDF downloads, no Semantic Scholar paid pulls. ERIC was the most productive source for math-education-specific GBL research; OpenAlex was the most productive for the broader cognitive-science framing (Kapur, embodied cognition, Sweller's cognitive load critique).

## Files relevant to this audit

- `c:/projects/math-games-builder/docs/product-positioning.md` — the framework being audited (§core-beliefs)
- `c:/projects/math-games-builder/CLAUDE.md` — agent behavior rules referencing the framework
- `c:/projects/math-games-builder/docs/audit/03-discovery-srt-framework.md` — this file
