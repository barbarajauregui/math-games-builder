# Audit 05 — Mastery State Machine

*Scope: pedagogical defensibility of the moon status state machine and the "win 3 games" mastery threshold.*
*Date: 2026-05-10 · Method: 2 personas (assessment researcher; mathematics-fluency researcher), 2 search rounds each, ERIC + Semantic Scholar.*
*Authority hierarchy: this audit's recommendations are subordinate to `docs/product-positioning.md`. Any conflict is flagged, not silently overridden.*

---

## 1. Summary

The current state machine — `locked → available → in_progress → in_review → approved_unplayed → unlocked → mastered` with a "win 3 games on a skill" mastery rule — is **partially defensible but has three research-level problems** that should be fixed before scaling beyond the K.OA pilot:

1. **"Mastered" is a verb, not a noun, in the research literature.** Bloom's mastery learning (Guskey 2007; Guskey & Pigott 1988) frames mastery as a *criterion-referenced demonstration on aligned formative assessment with corrective loops*, not a fixed terminal state. The current "green + gold" terminal node is inconsistent with the research because it (a) ignores decay and (b) cannot reflect the corrective loop ("re-teach what was missed").
2. **"Win 3 games" conflates fluency with proficiency** and is heavily confounded by game difficulty, player luck, and Builder-side variation. The fluency literature (Kuhn et al. 2010 reading, but also Burns 2005, Bratina & Krudwig 2003 for math) is unanimous that fluency requires *speed* (response-time threshold) AND *accuracy*, on items that **isolate the target skill**. Three wins on three different builder-authored games does not isolate the target skill — it measures "can succeed on a game whose difficulty the Builder set."
3. **The state machine has no decay node.** Karpicke & Roediger (2007) and Latimier et al. (2021, meta-analysis) show retention drops measurably without spaced retrieval. A standard "mastered" two months ago without retrieval practice is, on the evidence, no longer mastered. The current model treats mastery as monotonic.

The **prerequisite gating** (locked → available based on graph edges) is **defensible but rigid**. The strongest research (Doroudi, Holstein, Aleven & Brunskill 2016; Lai et al. 2017 on learning progressions) supports prerequisite *informed* sequencing but does not support hard lockout — and Schoenfeld's (1987, 2010) work explicitly favors immersive exposure with strategic re-entry over linear unlocking.

The **good news**: positioning principle 5 ("real audiences create real learning") and the protégé loop are *already* doing the heavy retention work that decay would otherwise punish. Builders revisit prior standards every time they teach them. The state machine just doesn't reflect this.

---

## 2. Claims audited

| Current claim (implicit in the state machine) | Verdict |
|---|---|
| Mastery is a discrete terminal state | **Partially false.** Discrete states are fine for *UI*, but the underlying model should be a probability or proficiency estimate that can decay. |
| Winning 3 games on a skill = mastery | **Weak.** Conflates fluency, accuracy, automaticity, and game-difficulty noise. Not aligned with NCTM/Common Core "mathematical proficiency" strands (NRC 2001 — conceptual, procedural, strategic, adaptive, productive disposition). |
| Hard lockout of downstream standards until prerequisites are mastered | **Defensible for sequencing, indefensible as gameplay rule.** Research supports prerequisite-aware *recommendation*, not prerequisite-required *prevention*. |
| Once mastered, always mastered | **False.** Spacing/retrieval research (Karpicke & Roediger 2007; Latimier et al. 2021; Murray et al. 2025 meta-analysis on math specifically) shows retention is non-monotonic without practice. |
| Three wins implies the math is what was being learned | **Game-design-dependent.** Without the Discovery + Self-Revealing Truth tests from positioning, three wins could indicate the game is decorating the math, not teaching it. The state machine cannot distinguish. |

---

## 3. Validity of "win 3 games" as a mastery threshold

### What the research distinguishes

- **Accuracy** — got the right answer.
- **Fluency** — got the right answer, with reasonable speed, repeatedly. (Clarke, Nelson & Shanley 2016; Biancarosa & Shanley 2016)
- **Automaticity** — answer retrieved from long-term memory without consuming working memory. Operationalized as a *bounded response time* on isolated items (Jensen & Rich 2025; Yu et al. 2024).
- **Proficiency / mastery** — Bloom's criterion: ~80–90% correct on a *formative assessment aligned to the learning objective*, followed by corrective loop for whatever was missed (Guskey 2007).
- **Conceptual understanding** — separate from any of the above. Procedurally fluent students can lack it (NRC 2001).

### Why "win 3 games" fails most of these definitions

1. **No isolation of the target skill.** A K.OA.A.1 game (composing/decomposing within 10) built by Builder X may include reading load, motor load, visual-decoding load. Three wins says "got through the game" — not "the math operation succeeded under low extraneous load."
2. **No response-time component.** Automaticity research is unanimous that without a time threshold, you cannot distinguish "computed it" from "retrieved it" (Jensen & Rich 2025 — "most classroom teachers are unaware of research-based practices such as the use of a controlled response time"). A 4-year-old counting on fingers can win 3 K.OA games. That's accuracy without fluency.
3. **N=3 is too few for a Bloom-style criterion.** Bloom's criterion is *proportion correct on a 10–20 item formative*, not 3 binary outcomes. With 3 trials you cannot tell 100% from 80% from 67%.
4. **Game difficulty is a free parameter the Builder sets.** A Builder optimizing for plays will make easier games. A Builder gaming the leaderboard will make harder ones. Either way, "3 wins" measures different things across games.
5. **No interleaving.** The student likely plays the same Builder's game multiple times, or plays consecutive games on the same skill — exactly the *blocked* practice that Rohrer, Dedrick & Hartwig (2020a, 2020b) show is inferior to interleaved practice for transfer.

### What a defensible threshold looks like

A research-aligned mastery signal for Math Games Builder would combine:

- **At least 8–10 trials** on the target skill, drawn from **at least 2 different games by 2 different Builders** (avoids single-game over-fit).
- **≥ 80% correct** (Bloom criterion).
- **Response time at or below an age-banded automaticity threshold** for fluency-eligible standards (e.g., K.OA single-digit sums: ~3s; 3.OA single-digit products: ~3s).
- **At least one retrieval after a 1–2 week delay** (spaced; Karpicke & Roediger 2007; Murray et al. 2025).
- **Optional: one interleaved trial** where the student must select the right operation among ≥ 2 candidate skills (Rohrer et al. 2020).

This is a probabilistic estimate, not a binary state. The UI can still render it as a discrete moon color; the underlying model should not be discrete.

---

## 4. Research on prerequisite gating

The current model (locked → available when prerequisites are mastered) borrows from intelligent-tutoring-system tradition (Bayesian Knowledge Tracing — van de Sande 2013; Zhang & MacLellan 2021; AFM — MacLellan, Liu & Koedinger 2015). That tradition has two findings worth importing:

1. **Prerequisite knowledge predicts downstream learning** (Hoz, Bowman & Kozminsky 2001; Lai et al. 2017). Locking is consistent with this.
2. **But sequence is not as deterministic as we model it** (Doroudi et al. 2016 — "Sequence matters, but how exactly?"). Many "prerequisites" are really *correlated co-developments*, not strict dependencies.

Schoenfeld (1987 "Confessions of an Accidental Theorist", 2010 *How We Think*) is the strongest counter-voice to lockstep gating. His core finding: students develop **belief systems about mathematics from how they encounter it.** A learner who only sees a topic after every prerequisite is "complete" forms the belief that math is a linear ladder. A learner who *peeks ahead*, struggles, and circles back forms the belief that math is a connected landscape. The latter belief predicts long-term mathematical disposition.

For Math Games Builder this is a positioning-relevant tension:

- Positioning principle 4: "Build first, learn as needed." This is **anti-lockstep** — motivation flows from wanting to make a thing, even before prerequisites are done.
- The current state machine is **lockstep** — you cannot build for a standard until upstream is complete.

These conflict. **Per CLAUDE.md hierarchy, positioning wins.** The state machine should soften gating.

### Concrete softening

- Replace `locked` with `recommended-later` (visible, dimmed, accessible via "I want to try anyway").
- A learner choosing to attempt a non-prerequisite-met standard sees a one-screen "you might find these helpful first" prompt, then proceeds if they want.
- Prerequisite-met standards still glow / surface first in the Library. The graph informs *recommendation*, not *permission*.
- Builders are gated more conservatively than Players, because building a teaching artifact for a skill the Builder hasn't grasped produces bad games. But even here, the gate should be "Mr. Chesure flags it" rather than "the system refuses."

---

## 5. Spaced practice / decay implications

Three findings dominate this literature:

1. **Spacing > massing.** Even within a single lesson, distributed retrieval beats blocked (Karpicke & Roediger 2007).
2. **Retrieval > review.** Asking the student to *produce* the answer beats re-presenting it (the testing effect; Latimier et al. 2021 meta-analysis pools 29 studies).
3. **Math-specific meta-analysis (Murray, Horner & Göbel 2025)** confirms both effects hold in mathematics with usable effect sizes, and adds that spacing intervals on the order of **1 day to several weeks** are where benefit accrues — anything tighter than ~1 hour is essentially massed.

The current state machine actively works *against* these findings:

- A "mastered" planet glows gold and the student has no reason to revisit it. The token economy gives +100 for first mastery, +10 per unique play of *your* games — neither rewards retrieval on already-mastered standards.
- The galaxy (and the upcoming Library home) does not surface "you mastered this 18 days ago — try one more game on it" prompts.
- There is no planned mechanism by which an already-mastered standard's color regresses.

### What to add

- **Decay model.** Each mastered standard carries a `last_retrieval_at`. After ~14 days without retrieval, the moon's gold ring fades; after ~30 days it dims to "needs refresh" (still green, but with a soft pulse). After successful retrieval, it brightens again.
- **Retrieval prompts in the Library.** "You haven't played anything on K.OA.A.1 in 3 weeks — here are 2 fresh games on it." This piggybacks on positioning principle 1 (Library as front door) at zero design cost.
- **Token nudge.** Small token reward (+25?) for retrieval on a mastered standard after the spacing interval has elapsed. Not so large it gamifies decay; large enough to make the prompt non-ignorable.
- **Builder-side benefit.** A Builder whose games are used as retrieval surfaces sees this in the Impact Dashboard ("3 kids used your game to refresh K.OA.A.1 this week"). Closes the loop.

This is not a research-purity argument; it directly serves the north-star metric (cross-age plays per week), because retrieval prompts *generate* plays.

---

## 6. Proposed changes (specific state-machine edits)

### Conservative (ship-in-pilot)

- **Rename `mastered` → `unlocked` and reserve `mastered` for a higher bar.** The current "unlocked → mastered" double-state is confusing and not research-backed. Collapse to a single positive state for now.
- **Replace "win 3 games" with "complete a Mastery Check"**: an 8-item probe drawn from ≥ 2 different Builder-authored games, ≥ 80% correct, with a soft response-time threshold for fluency-eligible standards.
- **Add `last_retrieval_at` field** to `progress/{uid}/standards/{standardId}` even before any decay UI ships. Cheap to add, hard to backfill.

### Medium-term (post-pilot, before scaling beyond 3.OA.A.1)

- **Soft gating, not hard.** `locked` becomes `recommended_later`. Players can attempt early; Builders see Mr. Chesure caution.
- **Decay UI.** Faded gold ring after 14 days, pulse prompt after 30. No state regression below `unlocked` — the planet stays green; only the freshness indicator changes.
- **Retrieval-aware Library home.** Surface "needs refresh" alongside "new games for you."

### Longer-term (when there are >50 standards with multiple games)

- **Replace state machine with a continuous proficiency estimate** (BKT-style or AFM-style). The discrete states become rendering of probability bins. This is what BKT/AFM literature does and it's the model that handles all four failure modes (decay, isolation, slip/guess, over-fitting to one game).
- **Interleaved Mastery Checks.** A check that draws items from skill X *and* its siblings/predecessors, requiring the student to choose which skill applies (Rohrer et al. 2020 RCT design).

### What NOT to change

- The Mr. Chesure / Critic / Guide approval loop already enacts Bloom's "feedback + corrective" element on the *Builder* side. That part is research-aligned and should stay.
- The protégé loop itself (positioning §1, §2) is the strongest single learning lever in the system; it is also a retrieval engine, because every Builder who picks a downstream standard is forced to re-retrieve upstream knowledge to teach it. Don't disturb this.

---

## 7. Key citations

(All ERIC IDs verified in this audit. Where Semantic Scholar was used, paperId is given.)

**Mastery learning (Bloom / Guskey)**
- Guskey, T. R. (2007). *Closing Achievement Gaps: Revisiting Benjamin S. Bloom's "Learning for Mastery."* Journal of Advanced Academics. ERIC EJ786608. Peer-reviewed.
- Guskey, T. R., & Pigott, T. D. (1988). *Research on Group-Based Mastery Learning Programs: A Meta-Analysis.* Semantic Scholar 99fd4bb35cfbb362a7ffa4234c30df7169bad18b. 132 citations.
- Klecker, B. M., & Chapman, A. (2008). *Advocating the Implementation of Mastery Learning in Higher Education.* ERIC ED503410.
- Cox, C. H., & Bloom, B. S. (1979). *Basic Skills through Mastery Learning: An Interview with Benjamin S. Bloom.* Curriculum Review. ERIC EJ224682.

**Fluency / automaticity**
- Jensen, M. W., & Rich, P. J. (2025). *Adapting a Research-Based Fact-Fluency App for Classroom Use.* International Journal of Designs for Learning. ERIC EJ1476573. Peer-reviewed. Definitive on response-time threshold.
- Kuhn, M. R., Schwanenflugel, P. J., & Meisinger, E. B. (2010). *Aligning Theory and Assessment of Reading Fluency.* Reading Research Quarterly. ERIC EJ880112. Foundational definition split (accuracy / automaticity / prosody) — generalizable to math.
- Burns, M. (2005). *Using incremental rehearsal to increase fluency of single-digit multiplication facts.* 113 citations. Semantic Scholar 9e2358d90b68f85193f29f9f635891a73ee0c0ec.
- Yu, Q., Ding, Y., Wang, Y., Zhang, C., & Zusho, A. (2024). *Working Memory and Automaticity in Relation to Mental Addition.* AERA. ERIC ED664812.
- Williams, D. S. (2023). *The Influence of Math Fact Automaticity on the Algebra I End-of-Course.* ProQuest dissertation. ERIC ED635308.

**Spaced retrieval / testing effect / decay**
- Karpicke, J. D., & Roediger, H. L., III. (2007). *Expanding Retrieval Practice Promotes Short-Term Retention, but Equally Spaced Retrieval Enhances Long-Term Retention.* JEP:LMC. ERIC EJ768633. Peer-reviewed.
- Hopkins, R. F., Lyle, K. B., Hieb, J. L., & Ralston, P. A. S. (2016). *Spaced Retrieval Practice Increases College Students' Short- and Long-Term Retention of Mathematics Knowledge.* Educational Psychology Review. ERIC EJ1120461. Peer-reviewed.
- Latimier, A., Peyre, H., & Ramus, F. (2021). *A Meta-Analytic Review of the Benefit of Spacing out Retrieval Practice Episodes on Retention.* Educational Psychology Review. ERIC EJ1310148. 29 studies.
- Murray, E., Horner, A. J., & Göbel, S. M. (2025). *A Meta-Analytic Review of the Effectiveness of Spacing and Retrieval Practice for Mathematics Learning.* Educational Psychology Review. ERIC EJ1478558. **Most directly relevant to MGB.**

**Interleaving**
- Rohrer, D., Dedrick, R. F., & Hartwig, M. K. (2020). *The Scarcity of Interleaved Practice in Mathematics Textbooks.* Educational Psychology Review. ERIC EJ1263191.
- Rohrer, D., Dedrick, R. F., Hartwig, M. K., & Cheung, C.-N. (2020). *A Randomized Controlled Trial of Interleaved Mathematics Practice.* Journal of Educational Psychology. ERIC EJ1237752. Grade 7 RCT.

**Prerequisite gating / sequencing / Schoenfeld**
- Schoenfeld, A. H. (1987). *Confessions of an Accidental Theorist.* For the Learning of Mathematics. ERIC EJ354714. Peer-reviewed.
- Schoenfeld, A. H. (2010). *How We Think: A Theory of Goal-Oriented Decision Making.* Routledge. ERIC ED534847.
- Lai, E. R., Kobrin, J. L., DiCerbo, K. E., & Holland, L. R. (2017). *Tracing the Assessment Triangle with Learning Progression-Aligned Assessments in Mathematics.* Measurement. ERIC EJ1164088.
- Doroudi, S., Holstein, K., Aleven, V., & Brunskill, E. (2016). *Sequence Matters, but How Exactly? A Method for Evaluating Activity Sequences from Data.* Int'l Educational Data Mining Society. ERIC ED592721.
- Hoz, R., Bowman, D., & Kozminsky, E. (2001). *The Differential Effects of Prior Knowledge on Learning.* Instructional Science. ERIC EJ626777.

**Knowledge tracing / continuous proficiency models**
- van de Sande, B. (2013). *Properties of the Bayesian Knowledge Tracing Model.* JEDM. ERIC EJ1115329.
- MacLellan, C. J., Liu, R., & Koedinger, K. R. (2015). *Accounting for Slipping and Other False Negatives in Logistic Models of Student Learning.* EDM. ERIC ED560525.
- Zhang, Q., & MacLellan, C. J. (2021). *Going Online: A Simulated Student Approach for Evaluating Knowledge Tracing in the Context of Mastery Learning.* EDM. ERIC ED615518.

**Foundational (cited but not searched in this audit; widely known in math-ed)**
- National Research Council (2001). *Adding It Up: Helping Children Learn Mathematics.* (Five strands of mathematical proficiency — informs the "fluency ≠ proficiency" distinction in §3.)

---

*Audit complete. Next recommended action: discuss §6 conservative-tier edits with Barbara before the K.OA.A.1 pilot is deemed "done." The `last_retrieval_at` field and the rename of the terminal state are cheap and reversible; the Mastery Check redesign is a real product change and should be brainstormed.*
