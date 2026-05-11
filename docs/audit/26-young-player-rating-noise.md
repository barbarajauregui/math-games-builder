# Audit 25 — Young-Player Rating Signal Is Too Noisy to Drive Builder Decisions

*Date: 2026-05-10 · Method: Review of the Player feedback flow against developmental research on child rating reliability and the canonical child-UX evaluation literature (Fun Toolkit / Smileyometer). Citations verified on ERIC and OpenAlex.*

---

## Summary

The product loop, as written, treats Player star ratings and emoji reactions as **feedback that flows back to Builders' dashboards** and shapes the Builder leaderboard. Per positioning v1.2 the leaderboard now derives mostly from telemetry (plays, mastered-kids), but ratings still appear as a visible counter on Builder dashboards and on every game card.

Developmental research is clear that **children under about age 7 give inconsistent self-report ratings.** They have trouble separating "I liked it" from "it was good." They are subject to strong recency and acquiescence bias (rating high to please the adult or the system). Their ratings correlate weakly with adult expert ratings of the same artifact. Even with the canonical child-UX rating instrument (the Smileyometer), researchers explicitly recommend triangulating self-report with observation.

By contrast, **behavioral telemetry from the same young children is reliable.** Replays, time-on-task, completion rate, abandonment point — these are observable signals that don't depend on the child's verbal self-report. They work from age 4 up.

The fix is to separate the two streams in the Builder dashboard. **"Kid Telemetry"** is the load-bearing signal; **"Kid Feedback"** is decoration. The leaderboard, if it returns, ranks by telemetry. Ratings remain visible to Builders as social warmth (kids tapped the heart) but do not weight ranking.

This also defuses a perverse-incentive trajectory that intersects with Audit 4: if ratings drive tokens or leaderboard position, Builders learn to make games that *feel* fun to a 5-year-old (sparkles, easy wins, sugar rush) rather than games that actually teach the math.

---

## Why this matters (research backing)

**Child self-report ratings have known reliability problems below ~age 7.**

- **Survey methodology with children** research finds that response biases (acquiescence, recency, extreme-response) are strongest in the youngest respondents and decrease with age. Children below about 7 also have unstable preferences across short time windows — the same child rates the same artifact differently 10 minutes apart.
- **Theory-of-mind development** sets a relevant ceiling: until a child reliably distinguishes "what I felt" from "what the thing was like," the rating reflects momentary affect, not a stable evaluation. False-belief task mastery (the meta-analytic milestone for stable theory of mind) sits around age 4–5; the more sophisticated forms relevant to evaluative judgment continue developing through age 7+.
- **Child rating scale research** specifically documents the ceiling effect on smiley-face scales used with young children — kids overwhelmingly pick the top option, washing out variance.

**Behavioral telemetry doesn't have these problems.**

- **Time-on-task, replays, completion rate, and abandonment point** are observed, not self-reported. They are valid from the earliest ages a child can interact with the system at all.
- Stealth-assessment / evidence-centered-design research (already cited in Audit 3 and Audit 6) operationalizes exactly this: infer engagement and learning from in-game behavior rather than asking the kid.

**The canonical child-UX evaluation instrument acknowledges the noise.**

The Fun Toolkit (Read & MacFarlane 2006) is the most-cited child-UX evaluation kit in HCI-for-kids. Its Smileyometer is exactly the smiley-face Likert scale Math Games Builder is using. The Fun Toolkit's authors **explicitly warn that the Smileyometer ceilings out for young children** and recommend triangulating with the other Fun Toolkit instruments (the Again-Again table — would you do this again? — and Funsorter — sort these games by fun) and with observation. The Again-Again table, notably, is a behavioral proxy: it asks an intention question that maps directly onto telemetry (do they actually replay?).

The implication: even researchers who designed the rating instrument the app is using would not treat the rating alone as a signal.

---

## Proposed two-stream dashboard

The Builder's dashboard splits feedback into two clearly-distinguished surfaces:

### Stream 1: Kid Telemetry (load-bearing — ranks the leaderboard)

What it shows the Builder, per game:
- **Plays** — total unique Players, this week / all-time.
- **Completion rate** — % of plays that reach the win state.
- **Replays** — % of Players who played the game more than once. This is the most-load-bearing single number: a kid replaying voluntarily is the strongest "really worked" signal in the data set, mapping to the Fun Toolkit's Again-Again behavioral proxy.
- **Time-on-task** — median play length. Useful as a sanity floor (< 30 seconds = the kid bounced).
- **Abandonment point** — for plays that don't complete, where did they quit? Tells the Builder which round is too hard or too boring.
- **Cross-age plays** — count of plays where the Player is at least one grade below the Builder. This is the north-star metric from positioning §success-metrics surfaced at the per-game level.

These signals work from age 4 up. They're the basis for ranking, leaderboard position, and any token rewards.

### Stream 2: Kid Feedback (social warmth — does not rank)

What it shows the Builder:
- **Stars** (1–5) — averaged, with N. Shown.
- **Emoji reactions** — counts by emoji, shown as a small row.
- **Direct messages** from Players (the "fix-request / idea" channel positioning §v1.2 introduces).

These are visible because kids enjoy giving them and Builders enjoy receiving them. They are **labeled clearly** ("Kids liked it — but kids this young always rate high. The real signal is on the left.") so a Builder doesn't optimize toward star average.

Implementation: a small info-icon next to the rating block on the dashboard, tap-revealing one sentence: *"Kid stars run high for everyone. Use the telemetry on the left to compare games."*

---

## Builder leaderboard ranking

Per positioning v1.2, the leaderboard already prioritizes telemetry signals (plays, kids mastered) over ratings. This audit's recommendation **reinforces and tightens that decision**: ratings should not enter the leaderboard formula at all. Suggested ranking score (proposal, not a final formula):

> Score = cross-age plays × completion-rate × replay-rate

This rewards a Builder whose game is played by younger kids, completed by them, and replayed by them. It cannot be gamed by making the game easier-feeling without making it actually engaging — completion rate without replay rate is a sugar-rush game; replay rate without completion is a too-hard game.

**Stars and emoji never enter the score.** They live in Stream 2 as social warmth.

---

## How this intersects with Audit 4 (token economy)

Audit 4 found the publish bonus is the most motivationally-toxic line in the economy because it rewards approval-gate clearance instead of audience reception. Adding rating-weighted tokens on top of that would compound the inversion: Builder learns to make games that feel fun to a 5-year-old in a 30-second sample, not games that teach.

Positioning v1.2 already chose not to award tokens per rating (ratings are visible counters with no token reward). This audit endorses that choice and recommends going one step further:

- **Tokens flow from telemetry, not ratings.** The "+50 per kid mastered" line in v1.2's token economy is exactly the right shape — it's a telemetry signal (the kid completed the mastery threshold) wired to the Builder's wallet.
- **Plays and ratings remain visible counters with no token reward** per v1.2. Good.
- **The leaderboard mirrors the same logic** — telemetry ranks; ratings decorate.

---

## What this changes in the spec

The Library design spec v2 currently calls for visible star ratings on cards and a per-Builder rating average on the impact dashboard. Specific edits:

1. **Builder dashboard** — split the feedback panel into the two streams described above. Add the one-sentence labeling line on Stream 2.
2. **Game card on the Library shelf** — keep the star count visible (Players enjoy seeing them; they're social warmth for the Builder too). Add a small "kids replayed N times" line next to the star count — that's the telemetry signal Players themselves can read as a quality cue.
3. **Builder leaderboard scoring** — adopt cross-age-plays × completion × replay as the v1 ranking score; do not weight stars.
4. **Mr. Chesure brief screen** — mention to the Builder that "kid stars run high for everyone — the real test is whether kids play your game more than once." Sets the right Builder mental model up front.

---

## Cross-references

- Audit 3 — Discovery + SRT framework. Stealth assessment / evidence-centered design provides the research foundation for telemetry-first signal.
- Audit 4 — Token economy. This audit's two-stream model is the natural complement to Audit 4's "demote the publish bonus" recommendation.
- Audit 6 — Agent definitions. Shortcut Adversary already maps to evidence-centered design; the telemetry-first dashboard is the Builder-facing version of the same posture.
- Audit 23 — Player learning context. The mastery-dot on Audit 23's post-play card is itself a Player-visible piece of telemetry surfacing.

---

## Sources

- Read, J. C., & MacFarlane, S. (2006). Using the Fun Toolkit and other survey methods to gather opinions in child computer interaction. *Proceedings of Interaction Design and Children (IDC '06)*, 81–88.
- Borgers, N., de Leeuw, E., & Hox, J. (2000). Children as respondents in survey research: Cognitive development and response quality. *Bulletin de Méthodologie Sociologique*, 66(1), 60–75.
- Wellman, H. M., Cross, D., & Watson, J. (2001). Meta-analysis of theory-of-mind development: The truth about false belief. *Child Development*, 72(3), 655–684.
- Mellor, D., & Moore, K. A. (2014). The use of Likert scales with children. *Journal of Pediatric Psychology*, 39(3), 369–379.
- Shute, V. J. (2011). Stealth assessment in computer-based games to support learning. In S. Tobias & J. D. Fletcher (Eds.), *Computer Games and Instruction* (pp. 503–524). Information Age Publishing.

---

## Files referenced

- `c:/projects/math-games-builder/docs/superpowers/specs/2026-05-10-library-design.md`
- `c:/projects/math-games-builder/docs/product-positioning.md`
- `c:/projects/math-games-builder/docs/audit/04-token-economy.md`
- `c:/projects/math-games-builder/docs/audit/06-agent-definitions.md`
- `c:/projects/math-games-builder/docs/audit/23-player-learning-context-invisible.md`
