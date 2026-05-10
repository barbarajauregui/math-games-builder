# Audit 4 — Token economy

*Auditor: motivation-research + serious-games-design dual persona · Date: 2026-05-10 · Status: draft for Barbara*

## Summary

The current token weighting (2000 / 100 / 10 for approved / mastered / unique-play) is **defensible in shape but mis-tuned in magnitude and misleading in framing for the Builder loop**. Self-Determination Theory and 50+ years of reward research converge on a clear finding: tangible, expected, contingent rewards reliably **undermine intrinsic motivation for tasks that are already interesting** — and game-building is exactly such a task. However, the literature also shows two important escape valves that MGB partially exploits: (1) **informational (competence-feedback) rewards** do not undermine and sometimes enhance intrinsic motivation (Deci, Koestner & Ryan 1999); and (2) rewards tied to **social impact / contribution** operate through a different psychological pathway (relatedness + purpose) that SDT treats favourably. The biggest concrete risk is the **2000-token publish bonus**: it is the largest, most expected, most performance-contingent reward in the system and is the canonical shape Deci/Ryan flag as motivation-undermining. The 10-tokens-per-play, by contrast, is closer to informational feedback and is probably under-weighted. **Recommended changes: re-frame Builder's main reward stream as plays/ratings (not approval), demote publish bonus to a milestone-only one-time event, and surface play counts as a public, unmonetized signal of impact.**

## Research findings on extrinsic rewards in K-10 math games

Five threads matter for MGB.

**1. The undermining effect is real but conditional (Deci, Koestner & Ryan 1999, *Psych Bulletin*, meta-analysis of 128 studies).** Tangible, expected, task-contingent rewards reliably reduce free-choice intrinsic motivation on interesting tasks (effect size d ≈ -0.36). Verbal praise and unexpected rewards do not. Performance-contingent rewards have the strongest negative effect when they signal control rather than competence. This is the foundational finding the audit must engage with.

**2. The undermining effect generalises to children and to school settings.** Lepper, Greene & Nisbett's classic overjustification studies (1973) and subsequent replications consistently show K-6 children disengage from previously enjoyed activities once those activities are tied to expected tangible rewards. ERIC EJ1097087 (Chen & Wu 2010, Taiwan, grades 2/4/6, longitudinal) finds that contingent reading rewards predicted *lower* intrinsic reading motivation over time, with effects strongest for younger students.

**3. Gamification's empirical record is mixed and design-dependent, not uniformly positive.** ERIC EJ1422348 (Ren, Xu & Liu 2024, meta-analysis of educational games & gamification) finds gamification has a **stronger effect on extrinsic than intrinsic motivation** — exactly what SDT predicts. ERIC EJ1346201 (Balci, Secaur & Morris 2022) compared badges vs leaderboards in gamified physics: badges improved performance modestly; leaderboards did not, and partially-gamified contexts outperformed fully-gamified ones (more ≠ better). ERIC ED621160 (O'Brien 2021, K-12 dissertation) notes most classroom gamification "focuses on extrinsic rewards while elements that could facilitate intrinsic motivation have largely been ignored" — Deterding's *pointsification* critique, confirmed empirically.

**4. Token economies have a strong evidence base — but mostly for behaviour management, not creative/learning tasks.** ERIC EJ997926, EJ1037116, EJ1059798, EJ1276775 all show token economies effective at modifying discrete observable behaviours (jump-rope reps, on-task time, throw form, autism interventions). They do **not** test whether the underlying interest in the activity survives token withdrawal — and where this has been tested for creative tasks, withdrawal causes collapse. MGB's tokens are being asked to do something the token-economy literature has not validated: sustain a creative authoring task in typically-developing learners across months.

**5. Self-Determination Theory's three-need framework gives an actionable lens.** Ryan & Deci's autonomy / competence / relatedness needs (validated repeatedly in math-ed contexts — ERIC EJ1090073 Kosko 2015; ERIC EJ1462557 Shank et al. 2025) predict that rewards that signal **competence and relatedness** without removing **autonomy** are favourable. Rewards that feel controlling, surveilled, or quota-ish are not. This gives a concrete test: does the +2000 publish bonus feel like "you did good work that mattered to younger kids" (competence + relatedness) or like "you cleared the bar and got paid" (control)? Current framing leans toward the latter.

**6. Learning-by-teaching evidence (separate from rewards).** ERIC EJ1356696 (Sibley, Fiorella & Lachner 2022) and EJ1478118 (Xu et al. 2025) confirm the protégé effect operates through *generative explanation and retrieval*, not through extrinsic motivation to teach. This matters because it says the learning gain for Builders does **not** depend on tokens — it depends on the act of building/explaining for a real audience. Tokens are at best neutral noise on the learning channel; at worst they crowd out the relatedness-driven motivation that powers the protégé loop.

## Application to MGB's specific structure

The positioning doc identifies Builder motivation as **impact + recognition + creative agency** and Player motivation as **play + earning + variety**. SDT maps onto this cleanly:

- Builder motivation pathway = **competence (I made something good) + relatedness (kids actually played it) + autonomy (I chose what and how to build).** This is the rare structure where SDT predicts strong, durable intrinsic motivation. *The cross-age framing is doing the heavy lifting here, not the tokens.*
- Player motivation pathway = closer to a classic operant-conditioning context. Younger learners (5-10) are more responsive to tangible reward signals and less likely to suffer the overjustification effect on tasks they don't yet have an established intrinsic relationship with. Tokens for Players are lower-risk than tokens for Builders.

**This means the same token economy is doing very different psychological work on the two sides of the loop.** Treating them with one schedule is convenient but probably wrong.

The cross-age structure also creates a unique asset Deci/Ryan would predict to be highly motivation-protective: **plays-by-real-younger-kids is informational feedback about competence, not a controlling reward.** "47 third-graders played your game and 31 rated it 5 stars" is informational; "+470 tokens" is tangible. The current system bolts the latter onto the former, and the literature suggests the bolt-on dilutes rather than amplifies the underlying motivation.

So: the impact-driven framing for Builders **partially sidesteps** the undermining effect — but only if the dominant signal is impact (plays, ratings, kids-who-learned), not tokens. The current 2000:100:10 ratio puts tokens in the dominant position.

## Critique of the 2000 / 100 / 10 weighting

The ratios encode three implicit claims, all questionable.

**Claim 1: "Approval is worth 200 plays."** A game requires roughly 200 plays to match the 2000-token publish bonus. This means a Builder whose game gets 1 play earns 1% as much from the audience as from clearing the gate. The ratio strongly **devalues real audience reception** and over-rewards passing the agent + guide review. This is exactly backwards relative to the positioning doc's north-star metric (cross-age plays per week). *The economy currently incentivises gaming approval, not making games kids want to play.*

**Claim 2: "Mastering a skill is worth 10 plays."** This is roughly defensible — mastery is a discrete personal achievement, plays accumulate continuously — but only if mastery means something rigorous. If mastery is easy to claim, 100 tokens per is inflationary; if mastery is rigorous, 100 may be too low.

**Claim 3: "All three are denominated in the same currency."** SDT-wise this is the deepest problem. Lumping a creative-publication bonus, a competence-mastery bonus, and a real-audience-feedback signal into one wallet flattens three psychologically distinct events into one extrinsic-reward channel — the classic Deterding "pointsification" trap. ERIC ED590348 (Fatih et al. 2018) explicitly names this: "summarising gamification into a set of technical concepts (points, badges, leaderboards) is a very common misunderstanding... greatly reducing the purposed effect."

**Verdict on the weighting: the 2000 publish bonus is the most motivationally toxic line in the economy.** It is:
- Largest (most salient)
- Expected (Builder knows the bar in advance)
- Performance-contingent (must pass approval)
- Tangible (token wallet, leaderboard)
- Repeatable (every game)

That is five-for-five on Deci/Koestner/Ryan's undermining-effect risk profile.

The +10 per play, by contrast, is closer to a competence-feedback signal — small enough to feel informational, naturally variable, tied to real-world reception. It is probably the healthiest line.

The +100 per skill mastered sits in the middle.

## Proposed changes

In priority order. Each is grounded in a specific finding above.

**1. Demote the publish bonus from per-game to milestone-only.** Grant +2000 once for a Builder's first published game (a meaningful threshold event), then drop subsequent-publish bonuses to a small symbolic amount (e.g., +50) or replace with a non-token recognition (badge, name on a wall, public-credits page). *Rationale: Deci/Koestner/Ryan 1999 — the undermining effect is strongest for expected, repeatable, performance-contingent tangible rewards. One-time milestones do not undermine; recurring ones do.*

**2. Raise the per-play reward, or better, replace tokens-for-plays with a public, unmonetized impact display.** A "this game was played 312 times by 47 kids; rated 4.2/5" panel on the Builder dashboard is informational competence feedback (SDT-favourable) and does not couple the Builder's psychological reward to an extrinsic currency at all. Tokens can remain as a small flavour layer. *Rationale: ERIC EJ1090073 (Kosko 2015), ERIC EJ1462557 (Shank et al. 2025) — competence + relatedness needs, when surfaced directly, are the durable engine of math motivation. This also re-aligns the visible economy with the north-star metric.*

**3. Split the wallet, or at least the labels.** Don't denominate plays, mastery, and publishing in one currency. Three named streams ("Impact" = plays/ratings, "Mastery" = skills, "Build credits" = publishes-and-tokens) would let Builders feel the three psychological events distinctly. *Rationale: Deterding et al. 2011 and ERIC ED590348 — pointsification flattens motivationally distinct events; multi-channel feedback preserves their meaning.*

**4. Make tokens removable / spendable on something autonomy-supporting.** SDT-favourable rewards are those that give the recipient meaningful choice afterward. If tokens unlock creative options (new game templates, custom themes, sharing privileges, the ability to feature a peer's game), they become an autonomy-enhancing currency rather than a control-signalling one. *Rationale: Ryan & Deci's autonomy-need literature; consistent with the autonomy-supportive design principles in ERIC EJ1090073.*

**5. Differentiate Player vs Builder economies, explicitly.** Player tokens (5-10 yo, less established intrinsic relationship with math) are lower-risk and can stay closer to the current behaviour-modification token-economy literature (EJ997926 etc.). Builder tokens (10-16 yo, doing creative authorship for a real audience) need the SDT-aware redesign above. *Rationale: the audiences and the psychological pathways are different; one schedule for both is convenient but likely sub-optimal.*

**6. Do NOT add a public Builder leaderboard ranked by tokens.** ERIC EJ1346201 (Balci et al. 2022) found leaderboards did not improve performance and partially-gamified contexts outperformed fully-gamified ones. A leaderboard ranked by *plays-this-month* (impact) is defensible; one ranked by *total tokens* (a flat extrinsic currency) is the failure mode the literature warns about.

**7. Pilot the change with measurement, not faith.** Before rolling changes site-wide, A/B with a small Builder cohort: half on current 2000/100/10, half on the redesign. Measure (a) games published per week, (b) plays per game, (c) a short SDT-validated intrinsic motivation survey (IMI subscale, 4 items) at week 4 and week 12. The ERIC literature is clear that gamification effects are **design-dependent** — measure the specific design.

## Key citations

- Deci, E., Koestner, R., & Ryan, R. (1999). *A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation.* Psychological Bulletin, 125(6), 627–668. — *Foundational. The undermining effect, conditions, and exceptions.*
- Ryan, R., & Deci, E. (2017). *Self-Determination Theory: Basic Psychological Needs in Motivation, Development, and Wellness.* Guilford Press. — *Definitive SDT reference; cited in ERIC EJ1462557.*
- Lepper, M., Greene, D., & Nisbett, R. (1973). *Undermining children's intrinsic interest with extrinsic reward.* Journal of Personality and Social Psychology, 28(1), 129–137. — *Original overjustification study with children.*
- Deterding, S., Dixon, D., Khaled, R., & Nacke, L. (2011). *From game design elements to gamefulness: defining "gamification".* MindTrek '11. — *The pointsification critique.*
- Ren, J., Xu, W., & Liu, Z. (2024). *The Impact of Educational Games on Learning Outcomes: Evidence from a Meta-Analysis.* International Journal of Game-Based Learning. ERIC: EJ1422348. — *Gamification's effect is stronger on extrinsic than intrinsic motivation.*
- Balci, S., Secaur, J. M., & Morris, B. J. (2022). *Comparing the Effectiveness of Badges and Leaderboards on Academic Performance and Motivation...* Education and Information Technologies. ERIC: EJ1346201. — *Leaderboards underperform badges; partial gamification beats full.*
- O'Brien, N. (2021). *New Trend or a Reimagining of the Familiar? The Use of Gamification Strategies in K-12 Education.* ProQuest dissertation. ERIC: ED621160. — *K-12 gamification over-relies on extrinsic rewards; intrinsic-supporting elements ignored.*
- Chen, P.-H., & Wu, J.-R. (2010). *Rewards for Reading: Their Effects on Reading Motivation.* Journal of Instructional Pedagogies. ERIC: EJ1097087. — *Longitudinal grades 2/4/6: contingent rewards predicted lower intrinsic reading motivation over time.*
- Fatih, Y., Kumalija, E. J., & Sun, Y. (2018). *Mobile Learning Based Gamification in a History Learning Context.* ERIC: ED590348. — *Reducing gamification to points/badges/leaderboards is a misunderstanding.*
- Kosko, K. W. (2015). *Geometry Students' Self-Determination and Their Engagement in Mathematical Whole Class Discussion.* Investigations in Mathematics Learning. ERIC: EJ1090073. — *Autonomy + competence + relatedness predict math engagement.*
- Shank, E., Tang, H., & Morris, W. (2025). *Motivation in Online Course Design Using Self-Determination Theory: An Action Research Study in a Secondary Mathematics Course.* Educational Technology Research and Development. ERIC: EJ1462557. — *Recent SDT-grounded math-course design study.*
- Sibley, L., Fiorella, L., & Lachner, A. (2022). *It's Better When I See It: Students Benefit More from Open-Book than Closed-Book Teaching.* Applied Cognitive Psychology. ERIC: EJ1356696. — *Protégé/learning-by-teaching mechanism is generative retrieval, not extrinsic motivation.*
- Xu, K., et al. (2025). *Social Comparison Influencing the Effectiveness of Learners Using Learning by Teaching in Video Learning: An EEG Study.* Journal of Computer Assisted Learning. ERIC: EJ1478118. — *Recent neuro-evidence on learning-by-teaching mechanism.*
- Alstot, A. E. (2012, 2015). Token-economy studies in physical education. ERIC: EJ997926, EJ1059798. — *Token economy evidence base — strong for behaviour, untested for creative tasks at withdrawal.*
