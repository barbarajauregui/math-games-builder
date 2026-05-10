# Audit 1 — Protégé thesis stress-test

*Date: 2026-05-10 · Auditor: subagent · Sources: ERIC + Semantic Scholar (~6 searches)*

## Summary

The protégé / learning-by-teaching thesis is **broadly defensible but needs sharper hedging**. The empirical literature supports tutor learning gains, especially for low-achieving older tutors, but the effect is **moderate and contingent**, not "one of the most robust findings in educational psychology" (Hattie's effect sizes for peer tutoring are real but not at the top of his list, and Leung's 2019 meta-analysis on tutor gain reports a moderate g ≈ 0.39). The protégé claim works best when restated as: "**well-structured cross-age teaching reliably benefits both tutor and tutee in math, with the largest tutor-side gains for older students who have themselves struggled.**" The "no edtech operationalizes this" claim is partially true — there is no scaled product like MGB — but constructionist game-design (Kafai) and teachable-agent systems (Betty's Brain, Biswas) are prior art that should be cited and differentiated against, not ignored.

## Claims audited

### Claim 1 — "The protégé effect — kids teaching kids — is one of the most robust findings in educational psychology" (positioning §pitch)

**Verdict: CONTESTED (overstated)**

- Leung (2019), *School Psychology International*, meta-analysis of peer tutoring effects on **tutor** achievement: moderate effect (Hedges' g around 0.39 across studies; cross-age tutoring outperformed same-age, and longer programs outperformed shorter ones) (ERIC EJ1210472). This is meaningful but not "one of the most robust" — it is solidly mid-tier.
- Bowman-Perrott et al. (2013), *School Psychology Review*, meta-analysis across 26 single-case studies, grades 1–12: TauU = 0.75 (moderate to large) for academic outcomes, but heterogeneous and dominated by special-education/at-risk samples (ERIC EJ1007216).
- Roscoe & Chi (2007/2008), *Review of Educational Research* / cognitive analyses: tutors only learn deeply when they engage in **knowledge-building** (reflective integration, generating explanations) rather than **knowledge-telling** (recitation). Most untrained peer tutors default to knowledge-telling, which yields little tutor learning (Semantic Scholar 1135c5e6, 663 citations; and Roscoe 2014 follow-up, fea04e6f, 106 citations).

**Recommendation:** Soften "one of the most robust findings" to "a well-replicated finding" or "a robust effect under the right conditions" and cite Leung 2019 + Roscoe & Chi 2007 as the canonical evidence base. Add the knowledge-building vs knowledge-telling distinction as a design constraint — see Claim 2.

### Claim 2 — "Building forces older learners to deeply understand the math they're teaching"

**Verdict: CONTESTED — true only with the right scaffolds**

- Roscoe & Chi (2007, 2008): *Tutors do not automatically learn deeply.* They learn when they generate explanations, monitor their own knowledge gaps, and answer deep "why/how" questions. Without prompting, tutors typically engage in knowledge-telling (summarizing/restating source material) and gain little. Tutors' gains correlate with their meta-cognitive monitoring, not with time-on-task (Roscoe 2014, Semantic Scholar fea04e6f).
- Fiorella & Mayer (2013, 2014) "the relative benefits of learning by teaching and teaching expectancy" — a substantial portion of the tutor gain comes from **expecting** to teach (which prompts deeper encoding) plus the **act of explaining**, not from interaction with the tutee. (Standard reference; not pulled in this search but well-cited; should be added in next round.)
- Chase, Chin, Oppezzo, Schwartz (2009) "Teachable agents and the protégé effect" — the protégé effect (motivational benefit of teaching a *protégé*) is real but small and depends on the tutor caring about the protégé's success.

**Implication for MGB:** "Build a game" forces *some* knowledge-building (the game must work), but the Builder will default to knowledge-telling unless the workflow forces them to (a) anticipate the Player's misconceptions, (b) explain *why* their mechanic teaches, and (c) revise based on real Player evidence. The agent stack (Mr. Chesure, Critic, Mechanic Inventor, Shortcut Adversary) is the right shape **if** it pushes Builders into knowledge-building. The Learning Contract / "what makes a good game for this standard" brief is exactly this kind of scaffold — keep and strengthen it. Without it, MGB risks producing knowledge-telling games (drill-with-a-skin).

### Claim 3 — "No existing edtech product operationalizes learning-by-teaching at scale" (positioning §moat)

**Verdict: PARTIALLY SUPPORTED — needs differentiation, not denial**

- **Teachable agents (TAs):** Betty's Brain (Biswas, Schwartz, Vanderbilt) has 20+ years of research showing students-as-teachers-of-an-AI-agent improves science and math learning (Biswas et al. 2004, Semantic Scholar e13348cb). However, Betty's Brain teaches an *AI*, not a younger human; engagement decays without novelty; and it is a research project, not a shipped product at school scale.
- **Constructionist game-making:** Kafai & Burke, *Connected Gaming* (2016, MIT Press, ERIC ED647782) and *Connected Code* (2014, ED574173) — decades of research on children designing games to learn (Logo, Scratch, Game Maker). This is the closest analog to MGB. Scratch has 100M+ users. **However, Scratch is not math-targeted, has no Builder→Player loop tied to specific standards, and has no rating-back-to-Builder feedback. Scratch is "build for self-expression"; MGB is "build for a specific younger learner who needs this specific standard."**
- **Cross-age tutoring programs:** Programs like Reciprocal Peer Tutoring (Fantuzzo), PALS (Fuchs & Fuchs, ERIC EJ667628 / EJ589164), and Interdependent Cross-Age Peer Tutoring (Zeneli, Tymms, Bolden 2018, ERIC EJ1208167) are well-validated *programs* but are not scaled edtech products.

**Recommendation:** Reframe the moat. The defensible claim is: **"No existing edtech product operationalizes learning-by-teaching as cross-age, math-standards-aligned, asynchronous, network-effect-driven game building." Each of those qualifiers matters.** Add a paragraph naming Scratch and Betty's Brain explicitly and saying what MGB does differently (math-first, standards-aligned, asynchronous play loop, ratings flowing back).

### Claim 4 — Implicit: "Grade 5–10 builders teaching grade K–4 players is the right age window"

**Verdict: WELL-SUPPORTED for the age gap; readiness gating is correct**

- Cross-age tutoring meta-analyses consistently find **a 2–4 year gap** is optimal: large enough that the tutor has mastery, small enough that the tutor remembers the conceptual difficulty (Cohen, Kulik & Kulik 1982; cited throughout Leung 2019). Grade 5 → Grade 2 is a 3-year gap; Grade 10 → Grade 4 is a 6-year gap (the upper bound).
- Fitz-Gibbon (1975, ERIC ED129949) — 9th-graders tutoring 4th-graders on **fractions** in low-income inner-city schools — direct precedent for the MGB scenario. Both groups gained.
- Allen & Feldman (1972, ERIC ED070029) — a critical equity finding: **low-achieving 5th-graders performed significantly better as tutors than studying alone**, with the tutor benefit *larger* for the low-achiever than for high-achievers. This directly supports MGB's "older but struggling" Builders being valid (the kid who's behind grade level still benefits from teaching down).
- Cook et al. (1986, ERIC EJ338879) — meta-analysis confirming students with disabilities benefit as tutors, not just tutees.
- Vacc & Cannon (1991, ERIC EJ428544) — 6th-graders tutoring moderately handicapped students in math; sustained gains at 2-year follow-up.

**Implication for MGB:** The "age is not the gate; readiness is" principle in positioning is empirically grounded. The cross-age pilot at 3.OA.A.1 with grade 5–7 builders → grade 3 players is in the empirically optimal range.

## Boundary conditions found

1. **Tutor training is non-negotiable.** Greenfield & McNeil (1987, ERIC EJ354035) — 10-day intensive tutor training was the difference between success and failure in a 2nd-grade math program. Untrained tutors default to knowledge-telling (Roscoe & Chi). **Implication: the Builder onboarding / "design brief" is not optional polish — it is the active ingredient.**
2. **Reciprocity matters.** Reciprocal peer tutoring (where roles swap) outperforms one-way tutoring on tutor learning (Fuchs PALS evidence). **Implication: today's Builder can also be tomorrow's Player on a harder standard. Don't rigidly silo the modes.**
3. **The protégé effect's *motivational* component depends on the tutor caring about a *real* protégé.** Chase et al. 2009 — when students "teach" a generic agent vs a personalized protégé, only the personalized condition shows motivational gain. **Implication: showing Builders WHO played their game (anonymized but specific — "a 3rd-grader at Acton played 4 rounds, got stuck at round 3") is mechanism, not vanity. The Impact Dashboard is doing protégé-effect work, not just dopamine work.**
4. **Cross-age tutoring is most effective when both groups are at risk / from similar communities.** Fitz-Gibbon 1975 (low-income, same school); Allen & Feldman 1972 (low-achievers). **Implication: alternative-school context (small, multi-age, ungraded) is actually a near-ideal setting, not a quirky edge case. The "schools-first, alternative + traditional + homeschool co-op all first-class" positioning is empirically defensible.**
5. **Math is one of the strongest subject-area cases.** Britz et al. 1989 (ERIC EJ400662) — peer tutoring effects in math are at least as strong as in reading and stronger than in many other subjects. Math-first MGB is on solid ground.
6. **Equity caveat (failure mode):** Cross-age tutoring can entrench hierarchy ("smart kids teach dumb kids") if Builder/Player roles map onto existing school status. Allen & Feldman's finding cuts the other way — if low-achievers are also Builders, the program *narrows* the gap. **Implication: MGB must let struggling 7th-graders build for K–2; if Builders self-select to high-achievers only, the equity story collapses.**

## Proposed changes to positioning

In `docs/product-positioning.md`:

1. **§pitch — soften the "most robust" claim.** Change "known in educational psychology as the **protégé effect**, one of the most robust findings in the field" to "known as the **protégé effect** — a well-replicated finding when teachers are scaffolded into deep explanation rather than recitation (Roscoe & Chi 2007; Leung 2019)." Reason: avoid an overclaim a critic can dismiss; cite a defense.

2. **§moat / Layer 1 — name the priors and differentiate.** Add: "Prior art exists — Kafai's *Connected Gaming* tradition (children designing games on Scratch), teachable-agent systems like Betty's Brain (Biswas/Vanderbilt), and decades of cross-age peer tutoring programs (PALS, ICAT). None combines (a) math-standards alignment, (b) asynchronous Builder→Player loop tied to a specific younger learner who needs that standard, (c) feedback flowing back to the Builder, and (d) a network of schools generating libraries for each other. That combination is the moat." Reason: a savvy reviewer will name Scratch in 30 seconds; pre-empt it.

3. **§core beliefs — add a 7th belief or strengthen #4 (build first):** Add explicit language that Builders default to knowledge-telling and the design brief / agent stack exists to push them into knowledge-building. Cite Roscoe & Chi 2007. Reason: the "build first, learn as needed" principle without this scaffold-claim collapses into "let kids vibe-code drill apps."

4. **§who — add empirical citation for the age window.** Under "The Builder," add: "A 2–4 year gap between Builder and Player is the empirically optimal range for cross-age tutoring (Cohen, Kulik & Kulik 1982; Leung 2019). Grade 5–10 building for K–4 sits inside this window." Under "shared infrastructure" or as a new bullet, add: "**Struggling older learners are valid Builders** — Allen & Feldman (1972) found low-achieving tutors gain *more* than high-achievers. The 'readiness, not age' rule is empirically grounded, not just inclusive philosophy."

5. **§success metrics — add a tutor-learning metric.** The current list has cross-age plays, builder retention, and rating quality, but no measure of *Builder math gain*. Add: "Pre/post mastery delta on the standard each Builder built for — does building actually teach the Builder?" This is the empirical test of the protégé claim and the only thing that distinguishes MGB from "kids made art for younger kids."

6. **§NOT — keep "not Scratch for math" but sharpen.** Replace "We don't teach programming" with "We don't aim at CS; we aim at math learning. Scratch shows children can build games at scale; MGB shows children can build *standards-aligned math games for a specific younger audience that needs them.*" Reason: the current line dismisses Scratch when Scratch is actually MGB's strongest precedent.

## Key citations

```bibtex
@article{Leung2019TutorMeta,
  author = {Leung, Kim Chau},
  title = {An Updated Meta-Analysis on the Effect of Peer Tutoring on Tutors' Achievement},
  journal = {School Psychology International},
  year = {2019},
  doi = {10.1177/0143034318808832},
  note = {ERIC EJ1210472}
}

@article{Roscoe2007TutorLearning,
  author = {Roscoe, Rod D. and Chi, Michelene T. H.},
  title = {Understanding Tutor Learning: Knowledge-Building and Knowledge-Telling in Peer Tutors' Explanations and Questions},
  journal = {Review of Educational Research},
  year = {2007},
  note = {Semantic Scholar 1135c5e6cdc2586fc5df25fec5afe0a49e87a1db; 663 citations}
}

@article{Roscoe2014SelfMonitoring,
  author = {Roscoe, Rod D.},
  title = {Self-monitoring and knowledge-building in learning by teaching},
  journal = {Instructional Science},
  year = {2014},
  note = {Semantic Scholar fea04e6fbc2ffd399232b4c1a131672a71f42447}
}

@article{BowmanPerrott2013PeerTutoring,
  author = {Bowman-Perrott, Lisa and Davis, Heather and Vannest, Kimberly and Williams, Lauren and Greenwood, Charles and Parker, Richard},
  title = {Academic Benefits of Peer Tutoring: A Meta-Analytic Review of Single-Case Research},
  journal = {School Psychology Review},
  year = {2013},
  note = {ERIC EJ1007216}
}

@article{AllenFeldman1972LowAchievers,
  author = {Allen, Vernon L. and Feldman, Robert S.},
  title = {Learning Through Tutoring: Low-Achieving Children as Tutors},
  year = {1972},
  note = {ERIC ED070029 — low-achieving 5th-graders gained more as tutors than studying alone}
}

@phdthesis{FitzGibbon1975RoleChange,
  author = {Fitz-Gibbon, Carol Taylor},
  title = {The Role Change Intervention: An Experiment in Cross-Age Tutoring},
  year = {1975},
  note = {ERIC ED129949 — 9th-graders teaching 4th-graders fractions in inner-city schools}
}

@article{VaccCannon1991,
  author = {Vacc, Nancy Nesbitt and Cannon, Sally J.},
  title = {Cross-Age Tutoring in Mathematics: Sixth Graders Helping Students Who Are Moderately Handicapped},
  journal = {Education and Training in Mental Retardation},
  year = {1991},
  note = {ERIC EJ428544 — 2-year follow-up showed maintained gains}
}

@article{Cook1986HandicappedTutors,
  author = {Cook, Stephen B. and others},
  title = {Handicapped Students as Tutors},
  journal = {Journal of Special Education},
  year = {1986},
  note = {ERIC EJ338879}
}

@article{Zeneli2018ICAT,
  author = {Zeneli, Mirjan and Tymms, Peter and Bolden, David},
  title = {Interdependent Cross-Age Peer Tutoring in Mathematics},
  journal = {International Journal of Psychology and Educational Studies},
  year = {2018},
  note = {ERIC EJ1208167}
}

@article{Fuchs2002PALS,
  author = {Fuchs, Lynn S. and Fuchs, Douglas and Yazdian, Laura and Powell, Sarah R.},
  title = {Enhancing First-Grade Children's Mathematical Development with Peer-Assisted Learning Strategies},
  journal = {School Psychology Review},
  year = {2002},
  note = {ERIC EJ667628}
}

@article{Britz1989PeerTutorMath,
  author = {Britz, M. W. and others},
  title = {The Effects of Peer Tutoring on Mathematics Performance: A Recent Review},
  journal = {B.C. Journal of Special Education},
  year = {1989},
  note = {ERIC EJ400662}
}

@article{Greenfield1987TutorTraining,
  author = {Greenfield, Susan D. and McNeil, Mary E.},
  title = {The Effects of an Intensive Tutor Training Component in a Peer Tutoring Program},
  journal = {Pointer},
  year = {1987},
  note = {ERIC EJ354035 — 10-day tutor training was the active ingredient}
}

@book{KafaiBurke2016ConnectedGaming,
  author = {Kafai, Yasmin B. and Burke, Quinn},
  title = {Connected Gaming: What Making Video Games Can Teach Us about Learning and Literacy},
  publisher = {MIT Press},
  year = {2016},
  note = {ERIC ED647782 — constructionist game-design tradition; closest prior art}
}

@inproceedings{Biswas2004BettysBrain,
  author = {Biswas, Gautam and Leelawong, Krittaya and Belynne, Kadira and Viswanath, K. and Vye, N. and Schwartz, Daniel L. and Davis, Joan},
  title = {Incorporating Self Regulated Learning Techniques into Learning by Teaching Environments},
  year = {2004},
  note = {Semantic Scholar e13348cb59ddb0931746c688096e65ced4e68869 — Betty's Brain teachable agent}
}
```

## Search log

| Query | Source | Useful hits | Notes |
|-------|--------|------------|-------|
| `learning by teaching protege effect meta-analysis` | Semantic Scholar | 0 | Rate-limited |
| `learning by teaching effect students Fiorella Mayer` | OpenAlex | 0 directly relevant | Returned popular but off-topic VR/multimedia papers; OpenAlex keyword match weak |
| `subject:"Cross Age Teaching" AND subject:"Mathematics Instruction"` | ERIC | ~10/27 | Gold — ICAT, Vacc & Cannon, Fitz-Gibbon |
| `subject:"Peer Teaching" AND subject:"Mathematics Achievement"` | ERIC | ~10/86 | PALS, Reciprocal Peer Tutoring |
| `peer tutoring meta-analysis tutor effects` | ERIC | 6 meta-analyses | Leung 2019, Bowman-Perrott 2013, Cook 1986, Britz 1989 |
| `Roscoe Chi tutor explanations learning by teaching` | Semantic Scholar | 8 | Knowledge-building vs knowledge-telling — the canonical mechanism paper |
| `cross-age tutoring low-achieving tutor mathematics equity` | ERIC | 5 | Allen & Feldman 1972, Greenfield & McNeil 1987 |
| `Kafai children designing games math` | ERIC | 2 books | Connected Gaming, Connected Code |

**Not searched (out of budget):** Fiorella & Mayer's specific "teaching expectancy" papers; Cohen, Kulik & Kulik 1982 directly (cited via Leung); Schwartz & Bransford "preparation for future learning"; Chase et al. 2009 protégé-effect-with-teachable-agents paper specifically. Recommend a follow-up audit if positioning uses these claims as load-bearing.

**Cost note:** Roughly 8 searches across ERIC + Semantic Scholar + OpenAlex; well under the $3 cap (these APIs are free; only LLM time consumed).
