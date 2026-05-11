# Audit 22 — Agent Ladder Calibration Against Human Experts

*Date: 2026-05-10 · Scope: the 4-stage Haiku → Sonnet → Haiku → Sonnet runtime ladder shipped as Foundation Fix #1 (`/api/game/critique`). · Method: prior audits 06 + 09 + 10 + `foundation-fix-1-notes.md`; targeted Semantic Scholar / OpenAlex pulls on LLM-as-judge calibration (Zheng et al. 2023, Liu et al. 2023, Bavaresco et al. 2024) and on inter-rater reliability standards in education assessment (Landis & Koch 1977, McHugh 2012); evidence-centered design (Mislevy, Almond & Lukas 2003) reused from Audit 06.*

---

## TL;DR

The runtime ladder is an LLM grading another LLM's output against the Critic's 4 criteria plus the Shortcut Adversary catalog. Foundation Fix #1 wired it correctly into all three save paths and made the agents *run* — a substantial advance over Audit 9's "agents don't actually run" finding. **But "the ladder approved" today means "Claude thought it was OK," not "this is pedagogically valid."** Nowhere has the ladder been calibrated against human math-education experts. Without inter-rater calibration, the pedagogical-rigor claim that makes Math Games Builder defensible to fellowships, schools, and parents is not evidenced — it's asserted.

The fix is a one-weekend calibration study against 30–50 games rated by Barbara plus 1–2 external curriculum-designer raters. Compute Cohen's kappa per criterion against a human consensus ground-truth, hold ship-gate at κ ≥ 0.6 per criterion (Landis & Koch's "substantial" threshold), iterate prompts on any criterion below. Then random-sample 5% of agent-approved games monthly to track drift.

---

## 1. Framing the problem in psychometric terms

The Critic's 4 criteria (real-world scenario, math IS gameplay, must-know-math-to-win, construct validity) and the Adversary's shortcut catalog are an **assessment rubric** — they score a game-as-artifact against a learning-science construct. Mislevy, Almond & Lukas's evidence-centered design (ECD; 2003) is explicit that any such rubric requires **rater agreement evidence** before its scores can support any claim about the underlying construct. The ladder produces scores; no agreement evidence yet exists.

Two literatures bound the calibration design:

**Inter-rater reliability in education assessment.** Cohen's kappa (Cohen 1960) is the standard for categorical rater agreement; weighted kappa or Spearman ρ for ordinal Likert. Landis & Koch (1977) gave the interpretation thresholds the field still uses: 0.0–0.2 slight, 0.2–0.4 fair, **0.4–0.6 moderate, 0.6–0.8 substantial, > 0.8 almost perfect**. McHugh (2012) updated these to argue 0.6 is the practical minimum for any high-stakes use; below 0.6 the rubric is unreliable enough that scores effectively reflect rater idiosyncrasy more than the construct. **A "ladder-approves → ships to a 6-year-old" decision is high-stakes by this standard.**

**LLM-as-judge calibration with humans.** Three recent findings matter here:

- **Zheng et al. (2023), "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena"** (NeurIPS 2023 D&B) found GPT-4 reaching ~80% agreement with human pairwise preferences on open-ended chat — strong, but on a *coarse* binary-preference task. On finer-grained rubric criteria the same paper reported substantially lower agreement, and flagged position bias, verbosity bias, and self-preference bias as systematic LLM-judge failure modes.
- **Liu et al. (2023), "G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment"** showed kappa with humans typically in the **0.3–0.55 range** across summarization quality criteria, well below the substantial threshold. Chain-of-thought prompting and probability-weighted scoring helped but did not close the gap.
- **Bavaresco et al. (2024), "LLMs instead of Human Judges?" (arXiv:2406.18403)** is the most relevant survey — a meta-analysis across 20 NLP tasks finds LLM-judge–vs-human kappa **varies wildly by task and criterion**, with median around 0.4–0.5 and a long tail of criteria where agreement is barely above chance. The paper's headline conclusion: LLMs are *not yet* drop-in replacements for human judges; they're useful as a first-pass filter with human oversight on a sampled subset.

So the prior is: **a 4-criterion pedagogical rubric, scored by an LLM, is likely to land in the κ 0.3–0.6 range against human experts without specific calibration work.** Some criteria (e.g., "math IS gameplay" — a relatively structural check) probably score higher; others ("construct validity" — a judgment that requires reading the standard) probably score lower. The only way to know is to measure.

---

## 2. Calibration set design

### Sample size

Cohen's kappa power analyses (Sim & Wright 2005) recommend ≥ 30 items per rater pair for a meaningful estimate, ideally 50+ for stable confidence intervals on a binary judgment, and more for a 4-point Likert. **Target: 50 games.** If 50 is infeasible, 30 is the floor — below that, kappa standard errors are wide enough to make the "did we hit 0.6?" decision unreliable.

### Sample composition (stratified, not random)

Random sampling from existing Builder submissions would underweight the failure modes that matter. Stratify:

- **5 known-good games** — anchor on the K.OA.A.1 reference game (the only currently approved game) plus any games that have passed the previous orchestrator review without revision. Adds a "ceiling" anchor.
- **5 known-marginal games** — the K.OA.A.3 work-in-progress; any games the existing orchestrator returned with revision suggestions; the "borderline" examples already in `the-critic.md`'s tested-examples.
- **10 known-bad games** — Audit 8 already characterized Sum Jumper and Wall Builder as failing Discovery + SRT; the FAIL 1–11 catalog in `critic-knowledge/tested-examples.md` provides exemplar bad games. These are the floor anchors.
- **30 mixed-quality real Builder submissions** — sample across the standards graph weighted toward standards with the most Builder activity (currently K.OA cluster). Where supply is thin (most non-K.OA standards), synthesize: feed each Builder-pick scenario through `/api/game/generate-gemini` ten times, take a stratified sample. This makes the set representative of what the ladder will actually see in production.

The exemplar-anchored design follows Sadler (1989, already cited in Audit 06) — rubrics calibrated against named exemplars produce higher rater agreement than rubrics calibrated only on description.

### Rater composition

Two raters minimum, three preferred:

1. **Barbara** — product owner, knows the rubric history, can interpret edge cases.
2. **One external math curriculum designer** — credentials should be in the field's authority set: a current or former staff designer at **Math Learning Center** (the publisher of Bridges and the Number Frames / Number Rack manipulatives already cited in Mr. Chesure), **Open Up Resources** (publisher of the open Illustrative Mathematics K–5 curriculum already named as the HOW reference in product positioning), or an **NCTM-published K–5 math educator** (e.g., authors in *Teaching Children Mathematics* or *Mathematics Teacher: Learning and Teaching PK–12*). The shared property: their training is in K–5 math pedagogy *as a field*, not as opinion.
3. **Optional third rater** — a second external curriculum designer or a researcher in the CGI tradition (Carpenter / Fennema lineage). A third rater changes kappa estimation from pairwise to Fleiss' kappa (multi-rater generalization, Fleiss 1971) and tightens confidence intervals, but adds coordination cost. Skip for v1 unless Barbara and the first external rater agree on < 70% of items — that's the signal that a third opinion is needed to break ties.

External raters do not need to be unpaid volunteers; budget ~$200–500 honoraria for 4–8 hours each. This is small money for the credibility it buys.

### Rubric design

Score each game on each criterion. Keep it simple:

- **Critic Criterion 1 (real-world scenario):** PASS / FAIL.
- **Critic Criterion 2 (math IS gameplay — passes Discovery + SRT):** PASS / FAIL.
- **Critic Criterion 3 (must know the math to win):** PASS / FAIL.
- **Critic Criterion 4 (construct validity — winning demonstrates the standard's specific cognitive operation):** PASS / FAIL.
- **Adversary verdict:** UNEXPLOITABLE / SOFT-EXPLOITABLE / EXPLOITABLE (3-level ordinal).

Binary per Critic criterion keeps the kappa interpretation simple. Adversary as a 3-level ordinal because the literature already uses HIGH/MEDIUM/LOW severity (Baker et al. 2009). For ordinal, use **weighted kappa** (Cohen 1968) so a HIGH-vs-MEDIUM disagreement counts as less severe than HIGH-vs-LOW.

Raters write a one-sentence justification per criterion. Justifications are not used in kappa but are essential for the disagreement-resolution step.

---

## 3. Calibration procedure

1. **Independent rating.** Each human rater scores all 50 games independently in a randomized order, no discussion, no access to each other's scores or the ladder's output. Two-week window typically suffices.
2. **Disagreement resolution.** For each item where raters disagree on any criterion, raters meet (async or sync) and reconcile through discussion against the rubric. The reconciled label is the **ground-truth label** for that item-criterion. Items where reconciliation fails (raters cannot agree even after discussion) are flagged as "rubric-ambiguous" and excluded from the kappa calculation but kept as a separate signal — > 10% rubric-ambiguous items means the rubric itself needs revision before calibration is meaningful.
3. **Run the ladder.** Submit all 50 games through `/api/game/critique`. Capture: each stage's verdict, the full `revisionSuggestions`, the `builderFacingMessage`, the per-stage cost, and the aggregate `finalVerdict`. Store the raw JSON.
4. **Map ladder output to rubric.** Stage 1+2 verdicts map to the 4 Critic criteria; Stage 3+4 verdicts map to Adversary level. Decide in advance how to combine Haiku + Sonnet on the same criterion — recommendation: **Sonnet wins** (it's the deeper read), Haiku's role is the cheap upstream filter, so on disagreement use the Sonnet stage's verdict for the kappa calculation. Log the Haiku-vs-Sonnet agreement separately as a secondary diagnostic.
5. **Compute agreement.**
   - **Cohen's kappa per criterion** (Critic C1–C4 binary; Adversary weighted-kappa ordinal).
   - **Per-criterion confusion matrix** (PASS-PASS, PASS-FAIL, FAIL-PASS, FAIL-FAIL counts) so false-positive and false-negative rates are visible.
   - **Aggregate kappa** as a headline number, but the per-criterion numbers are the ones that drive action.
   - Report **95% confidence intervals** (bootstrap or analytic per Fleiss 1971); a point estimate without an interval is misleading on n=50.

---

## 4. Acceptance thresholds

Per Landis & Koch (1977) and McHugh (2012):

- **κ ≥ 0.8 per criterion — almost perfect; ship.**
- **κ 0.6–0.8 per criterion — substantial; ship, document the kappa publicly.**
- **κ 0.4–0.6 per criterion — moderate; iterate prompts before shipping. Recalibrate.**
- **κ < 0.4 per criterion — fair-to-poor; the ladder is not reliable on this criterion. Either redesign the criterion in the prompt or route this criterion to humans only.**

**Recommended ship gate: κ ≥ 0.6 on every individual criterion, not just aggregate.** Aggregate kappa hides per-criterion problems — a ladder that scores 0.85 on "real-world scenario" and 0.35 on "construct validity" still ships construct-invalid games while looking calibrated.

If a criterion falls below 0.6, the diagnostic is the confusion matrix:

- **High false-positive rate** (ladder PASSes games humans FAIL): the ladder is too lenient on this criterion. Tighten the prompt with more failure exemplars; consider raising it to the Sonnet stage if currently only on Haiku.
- **High false-negative rate** (ladder FAILs games humans PASS): the ladder is too strict / pattern-matching too narrow. Add the false-negative cases as PASS exemplars in the prompt.

Iterate once, re-run against the same 50 items. If still below 0.6 on the same criterion, the criterion likely needs structural rework, not prompt tuning — escalate to Barbara.

---

## 5. Ongoing monitoring

Calibration is not a one-time event. Two ongoing practices:

1. **Monthly 5% human re-review of agent-approved games.** Random sample 5% of the games the ladder approved in the last month. Have one human rater (Barbara, or rotate the external rater quarterly) re-score them on the same rubric. Track:
   - **False-positive rate** — agent-approved games that humans subsequently rate as FAIL on any criterion. The headline drift metric. Goal: keep below 10%; investigate above 15%.
   - **False-negative rate** — calls to "Revise" that the human rater on review judges as having been a fine game. Less critical (the cost is Builder friction, not bad games shipping to Players), but if this exceeds ~20% Builders will start gaming the ladder or quitting.
   - **Per-criterion drift.** Track each criterion's monthly false-positive rate. Drift on one criterion is the early signal that either (a) Builder submissions have shifted distribution (more non-K.OA standards as supply broadens) or (b) the model behind the ladder has changed (Anthropic ships a new Sonnet version).

2. **Re-calibrate on prompt change.** Any non-trivial edit to the agent prompts in `src/lib/agent-prompts/` invalidates the prior calibration. Rerun the 50-item set whenever:
   - A Critic criterion is added, removed, or substantively reworded.
   - The Shortcut Adversary catalog is extended.
   - The model in `claude-api` settings changes (Sonnet 4 → 4.5, etc.).
   - Six months pass with no other trigger (catch slow drift from upstream model updates).

   The 50-item set should live in version control as a permanent regression suite — `docs/audit/calibration-set/` with the JSON of human labels — so re-runs are a single command.

---

## 6. Effort estimate

Honest hours, not optimistic:

| Phase | Time |
|---|---|
| Assemble 50-item calibration set (10 known + 10 from existing tested-examples + 30 generated) | 6–10 h (one weekend) |
| Recruit + brief 1–2 external raters | 2–4 h (mostly waiting) |
| Independent rating, 2 raters × 50 items @ ~5 min/item | ~4 h per rater, elapsed two weeks |
| Disagreement resolution meeting | 2–3 h |
| Run the ladder against 50 items + capture | 1 h (mostly waiting on API) — cost ~$5–10 in API spend |
| Compute kappa + write up | 4 h |
| Prompt iteration (if any criterion below 0.6) + re-run + re-compute | 4–8 h |
| **Total Barbara hours** | **~25–35 h spread over 2–3 weeks** |
| **Total external rater hours** | **~4–8 h each** |
| **Cash outlay** | **~$200–1000 honoraria + ~$10 API** |

Monthly monitoring: ~3 h/month (sample, rate, log).

Repeat the full calibration on any prompt change. Build the regression suite once; the marginal cost of re-running is small.

---

## 7. Risks if not done

1. **Public claims about "rigorous AI pedagogical review" are unsupported.** Product positioning v1.2 narrows the Guide gate to human-only appropriateness/polish/safety and explicitly assigns pedagogical-soundness to the agent ladder. A fellowship or funder doing technical due diligence will ask exactly the calibration question and there is currently no answer. The honest answer right now is "we don't know how often the ladder agrees with experts." That answer is fine for a pilot; it is not fine for a public claim.
2. **A single high-profile bad game shipping to a 6-year-old damages trust irreversibly.** A school parent who sees their child play a construct-invalid game ("my kid 'won' but didn't do any math") will not be reassured by "Claude approved it." The protégé-effect thesis is durable; the implementation's credibility is not, on first impression.
3. **Builder gaming surfaces.** Builders who repeatedly hit the ladder's blind spots will discover them and route their games through. This is the gaming-the-system pattern Baker et al. (2009) document on the learner side — it transfers to authors too. Without false-negative monitoring, this drift is invisible.
4. **Cost without value.** The ladder costs ~$0.05–0.20 per published game and ~$250–1000 at fellowship-pilot scale per the foundation-fix-1 notes. If kappa on construct validity is 0.35, you are paying for noise on the criterion that matters most.
5. **The "we have AI review" claim becomes load-bearing for school sales.** The earlier this is calibrated, the cheaper the calibration is — 50 items now is much easier than 500 items after the first cohort of disagreements has shipped.

---

## Sources

- Bavaresco, A., Bernardi, R., et al. (2024). LLMs instead of Human Judges? A Large Scale Empirical Study across 20 NLP Evaluation Tasks. *arXiv:2406.18403.*
- Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement,* 20(1), 37–46.
- Cohen, J. (1968). Weighted kappa: Nominal scale agreement with provision for scaled disagreement or partial credit. *Psychological Bulletin,* 70(4), 213–220.
- Fleiss, J. L. (1971). Measuring nominal scale agreement among many raters. *Psychological Bulletin,* 76(5), 378–382.
- Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics,* 33(1), 159–174.
- Liu, Y., Iter, D., Xu, Y., Wang, S., Xu, R., & Zhu, C. (2023). G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment. *Proceedings of EMNLP 2023.*
- McHugh, M. L. (2012). Interrater reliability: the kappa statistic. *Biochemia Medica,* 22(3), 276–282.
- Mislevy, R. J., Almond, R. G., & Lukas, J. F. (2003). A Brief Introduction to Evidence-Centered Design. *ETS Research Report Series,* 2003(1).
- Sadler, D. R. (1989). Formative assessment and the design of instructional systems. *Instructional Science,* 18(2), 119–144.
- Sim, J., & Wright, C. C. (2005). The kappa statistic in reliability studies: use, interpretation, and sample size requirements. *Physical Therapy,* 85(3), 257–268.
- Zheng, L., Chiang, W.-L., Sheng, Y., et al. (2023). Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena. *NeurIPS 2023 Datasets and Benchmarks Track.*

Reused from prior audits (06, 09): Baker et al. (2009) gaming-the-system; Carpenter & Fennema (1992) CGI; Habgood & Ainsworth (2011) intrinsic integration.
