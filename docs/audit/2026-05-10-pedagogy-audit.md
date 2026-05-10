# Math Games Builder — pedagogy audit aggregate

> Run 2026-05-10 overnight. Scope C (full audit) + protégé-thesis stress-test. Eight independent background agents, each with access to Semantic Scholar, OpenAlex, ERIC, and the project source. Per-surface output in `docs/audit/0N-*.md`. Total search spend: well under the $25 budget (most agents leaned on free ERIC; Semantic Scholar was rate-limited intermittently).
>
> **This doc is a curated index, not a rewrite of the per-surface findings.** Open the per-surface file when you need the citations and queries.
>
> **Reading order for Barbara:** §1 Headline summary → §3 Conflicts with tonight's decisions → §4 Top-priority proposed changes → §5 Cross-cutting themes. The per-audit sections in §2 are reference; skim them when you're acting on a specific change.

---

## 1. Headline summary

The system has stronger pedagogical grounding than typical edtech, but the **gap between the principles in `docs/product-positioning.md` and the implementation underneath those principles** is the recurring finding. The thesis is defensible. The pedagogical framework is largely derivative of solid established work (which is good — Barbara explicitly said she adapts proven pedagogy and doesn't invent it). The gameplay mechanics in some places quietly violate the principles the framework is supposed to enforce.

The four highest-leverage changes (detail in §4):

1. **Rebalance the token economy.** The 2000-token publish bonus rewards approval-gate clearance ~200× more than real audience reception, inverting the north-star metric. *(Audit 4)*
2. **Replace the "win 3 games" mastery threshold with an aligned 8-item Mastery Check** that has skill-isolation and a response-time floor. *(Audit 5)*
3. **Rewrite Sum Jumper and Wall Builder scenario strings** — they currently fail Discovery + Self-Revealing Truth tests. The fix is ~4 lines per template. *(Audit 8)*
4. **Build the K.OA domain knowledge file for Mr. Chesure** before scaling. Without it Mr. Chesure has no grounded basis to evaluate Builder games on K.OA, the only domain currently shipping. *(Audit 7)*

Two things the audit confirms are quietly excellent:
- The K.OA.A.1 game's mechanic design (ten-frame model, no running counts, equation-as-record hidden until commit, wrong-answer shake) is *"stronger pedagogy than 90% of K math apps"* per Audit 7.
- Shortcut Adversary's role-design maps almost 1:1 onto Baker's gaming-the-system literature and Mislevy's evidence-centered design (Audit 6) — the strongest research alignment of the four agents.

---

## 2. Per-surface findings

### Audit 1 — Protégé thesis stress-test
*Full output: [`01-protege-thesis.md`](01-protege-thesis.md)*

| Claim audited | Verdict |
|---|---|
| "Protégé effect is one of the most robust findings in educational psychology" (positioning §pitch) | **CONTESTED** — Leung 2019 meta-analysis g ≈ 0.39 is moderate, not top-tier. Reframe as "well-replicated under the right conditions." |
| "Building forces older learners to deeply understand the math they're teaching" | **CONDITIONAL** — Roscoe & Chi 2007: tutors do NOT automatically learn; they default to "knowledge-telling" without scaffolds. MGB's design brief + agent stack ARE the active ingredient, not polish. |
| "No edtech product operationalizes learning-by-teaching at scale" (positioning §moat) | **OVERSTATED** — Scratch + Kafai's Connected Gaming and Betty's Brain (Biswas/Vanderbilt) are real prior art. Defensible moat is the *combination*. |
| Grade 5–10 → K–4 age window | **WELL-SUPPORTED** — 2–4 year gap is the cross-age tutoring sweet spot. Direct precedent: Fitz-Gibbon 1975 (9th-graders teach 4th-graders fractions). |

**Equity-positive finding to lean into:** Allen & Feldman 1972 — low-achieving 5th-grade tutors gained MORE than high-achievers. The "readiness, not age" stance and "struggling older learner can still be a Builder" position is empirically grounded.

**Top proposed changes** to `docs/product-positioning.md`:
1. Soften "one of the most robust findings" to "a well-replicated finding under the right conditions" + cite Leung 2019.
2. Add a sentence on Roscoe & Chi 2007 in the §moat section explaining the agent stack's role.
3. Soften the §moat "no edtech operationalizes this" claim — name Scratch and Betty's Brain explicitly to pre-empt critique.
4. Add a Builder-side learning metric to §success-metrics (currently no measure of whether the protégé claim is working *for Builders*).

### Audit 2 — Standards graph correctness (K-3 OA focus)
*Full output: [`02-standards-graph.md`](02-standards-graph.md)*

**~83% of K-3 OA edges match the Common Core Progressions Documents.** No blocker for the 3.OA.A.1 cross-age pilot — both inflows and outflows of 3.OA.A.1 are correctly wired.

**Concrete fixes:**
- Add 6 missing prerequisite edges named explicitly in the K-5 OA Progression. Most consequential: `K.NBT.A.1 → 1.OA.C.6` (third "make-a-ten" prerequisite).
- Promote 3 edges from `related` to `prerequisite`: `3.OA.A.3 → 3.OA.A.4`, `3.OA.A.4 → 3.OA.C.7`, `3.OA.C.7 → 3.OA.D.8`.
- **K → K.OA gap:** add edges from `K.CC.B.4b/c` and `K.CC.B.5` to `K.OA.A.1/A.2/A.5`. This affects the already-shipped K.OA.A.1 game's Library targeting.

Spot-checks outside K-3 OA were clean.

### Audit 3 — Discovery + Self-Revealing Truth framework
*Full output: [`03-discovery-srt-framework.md`](03-discovery-srt-framework.md)*

**Framework is ~80% derivative, ~20% novel.** The principles map cleanly onto established peer-reviewed work:
- **"Math IS the gameplay"** ≈ Habgood & Ainsworth 2011 **intrinsic integration** — almost word-for-word match. 15 years of empirical support.
- **Self-Revealing Truth** ≈ Shute 2010/2021/2024 **stealth assessment / evidence-centered design**.
- **Discovery test** ≈ Papert 1980 **constructionism** — but tempered by Kirschner-Sweller-Clark 2006 and Lazonder & Harmsen 2016 meta-analysis showing pure discovery without scaffolds underperforms.

**The novelty is the packaging, not the principles.** Stitching three established tests into a pass/fail rubric an AI agent can apply to a 12-year-old's HTML game in service of a cross-age protégé loop is genuinely uncommon.

**Top proposed changes:**
- Stop calling them "Barbara's tests" internally — use the field's names. Free credibility with fellowships and educators.
- Add **Productive Failure** (Kapur & Bielaczyc 2011, 630 citations) explicitly to `docs/product-positioning.md` §core-belief 4 — "build first, learn as needed" is exactly Productive Failure with a different label.
- Three risks the framework doesn't catch, and proposed additions: (a) pure discovery without scaffolds, (b) kids learning the *game* without transfer to the *math*, (c) stealth assessment needs ground-truth validation against external probes — currently "approved" is a quality signal, not a learning signal.

### Audit 4 — Token economy
*Full output: [`04-token-economy.md`](04-token-economy.md)*

**The 2000-token publish bonus scores 5/5 on Deci/Koestner/Ryan's undermining-effect risk profile** — largest, expected, performance-contingent, tangible, repeatable. *Most motivationally toxic line in the economy.*

**The 2000:100:10 ratio is backwards relative to the north-star metric.** A game needs **200 plays to match the publish bonus** — incentivises gaming the agents, not making games kids want to play.

**The +10 per play is the healthiest line** — small, naturally variable, closer to informational competence-feedback than tangible reward.

**Top proposed changes:**
1. Demote the 2000-token publish bonus from per-game to a **one-time first-publish milestone**.
2. Replace tokens-for-plays with a **public, unmonetized impact display** (plays / ratings / kids who learned). Move the count from wallet to lantern (visible orbiting motes per the new Library design — already aligned).
3. Split the wallet into three labelled streams: **Impact / Mastery / Build credits**.
4. Make tokens spendable on **autonomy-supporting unlocks** (templates, themes, feature-a-peer privileges).
5. **Do NOT add a Builder leaderboard ranked by total tokens.** Rank by plays-this-month if at all.
6. A/B pilot with a short Intrinsic Motivation Inventory subscale before site-wide rollout.

**Conflict to flag:** the new Library design's `<ImpactRibbon />` already shows plays/ratings/kids — but the underlying token economy still pays 2000 for publish + 10 per play. The ribbon is a Band-Aid; the underlying weighting needs to change.

### Audit 5 — Mastery state machine
*Full output: [`05-mastery-state-machine.md`](05-mastery-state-machine.md)*

**"Win 3 games" is the weakest link.** It conflates accuracy / fluency / automaticity, has no response-time threshold, no skill isolation, and game difficulty is a free parameter the Builder controls. Bloom's mastery criterion needs **~10+ items at ≥80% on aligned formative** — not 3 binary game outcomes.

**The state machine has no decay node.** Karpicke & Roediger 2007, Latimier et al. 2021 (29-study meta), Murray et al. 2025 (math-specific meta) all show retention is non-monotonic without spaced retrieval. Current model is monotonic.

**Hard prerequisite lockout conflicts with positioning principle 4 ("build first, learn as needed")** and with Schoenfeld's work on mathematical disposition. Recommend softening `locked` to `recommended_later`.

**The protégé loop itself is a retrieval engine** — Builders re-retrieve upstream knowledge whenever they teach a downstream standard. This is why the absence of an explicit decay model has been less damaging than it would be in a single-user app. Don't disturb this.

**Top proposed changes (conservative tier — pilot-ready):**
1. Add `last_retrieval_at` field to `progress/{uid}/standards/{standardId}`.
2. Rename terminal state `mastered` to `mastered_recent` (decays to `mastered_dormant` after N weeks without retrieval; a single retrieval moves it back).
3. Replace the 3-wins threshold with an **8-item Mastery Check** keyed to the standard, response-time-floored.
4. Soften `locked` to `recommended_later` — Players can attempt anything, get gentle nudge if missing prereqs.

### Audit 6 — Agent definitions (Mr. Chesure, Critic, Mechanic Inventor, Shortcut Adversary)
*Full output: [`06-agents.md`](06-agents.md)*

| Agent | Verdict | Key gap |
|---|---|---|
| **Mr. Chesure** | Defensible role | No worked-example/CLT framing; no CPA-progression check enforced; misconceptions exist in K.OA knowledge but aren't pulled into output schema |
| **The Critic** | Strongest in practice (`tested-examples.md` is exemplar-anchored) | Missing explicit **Construct Validity** criterion (Messick 1989); missing quiz-wrapper exception; missing floor-effect/scaffolding check |
| **Mechanic Inventor** | Right idea, ungrounded execution | Output schema is good (9 fields with dual citation) but **no cognitive-mechanism taxonomy** — diversity quota substitutes for theory |
| **Shortcut Adversary** | Strongest research alignment of the four (Baker's gaming-the-system + Mislevy's ECD) | Needs Bored Expert persona; false-positive guard ("shortcuts" sometimes = real insight = design flaw not cheat); quantified severity rubric; repair-pattern library |

**Three highest-leverage edits:**
1. Add Construct Validity as Criterion 4 in The Critic.
2. **Build `pedagogy-to-mechanic-map.md` for Mechanic Inventor before scaling** — anchored on Plass et al. 2015 four-mode framework, Dehaene SNARC, subitizing literature, Bruner CPA tier.
3. **Add CPA-progression gate to Mr. Chesure** — single biggest unenforced gap.

### Audit 7 — K.OA.A.1 + K.OA.A.3 games (the only two in production)
*Full output: [`07-koa-games.md`](07-koa-games.md)*

**K.OA.A.3 is mis-implemented in two places:**
- The decompose engine accepts only **one decomposition per total**, but the standard's whole point is "in more than one way."
- `standard-rounds.ts` K.OA.A.3 is missing-addend prompts (`5 = 2 + ?`) — that's K.OA.A.4 territory, not K.OA.A.3.

**K.OA.A.1 game is narrower than the standard** — the standard lists 8 representational modes (objects, fingers, mental images, drawings, sounds, acting out, verbal, equations); the game ships one (counters in ten-frames). Defensible as "Part 1 of N," but Mr. Chesure should know to push Builders toward other modes.

**The 3-step Scenario Gate (Real Math/Sprinkles → Fix the Story → Tap Marbles) is a Builder pre-flight quiz, not the actual K.OA.A.1 game** — exactly as the April 18 reframe identified. Step 3 (Tap Marbles) is the only intrinsic-math moment and passes Discovery + SRT cleanly. Steps 1–2 are good Builder onboarding but lack research citation.

**The biggest leverage fix: build the K.OA domain knowledge file for Mr. Chesure.** Without it he has no grounded basis to evaluate K.OA games — the only domain currently shipping.

**What's good (per the audit, verbatim):** "Ten-frame model, no running counts, equation-as-record (hidden until commit), wrong-answer shake (anti-brute-force), commutativity acceptance, dot-cluster prompts. **Stronger pedagogy than 90% of K math apps.**"

### Audit 8 — Game templates (Sum Jumper, Wall Builder, Circuit Board Builder)
*Full output: [`08-game-templates.md`](08-game-templates.md)*

**The three "templates" live at three different layers**, not as three peer engines:
- Sum Jumper and Wall Builder are 1-paragraph **scenario prompt strings** in `src/components/builders/builder-picker.tsx` lines 30–31.
- Circuit Board Builder is a meta-builder UI that routes to one of **65 hand-crafted game options across 24 mechanics** in `src/lib/game-engines/game-option-registry.ts`.

**Sum Jumper and Wall Builder fail Discovery, fail SRT, and are severely shortcut-vulnerable.** Both use the textbook **extrinsic-integration** pattern (door locks/wall holds when a hidden equality check passes) that Habgood & Ainsworth 2011 empirically showed produces inferior learning to intrinsic versions. They claim K.OA.A.1–A.3 implicitly. Fix is a **4-line rewrite of each string** — make a transparent jar/strength-meter visibly fill so the count IS the answer with no hidden check.

**The Circuit Board Builder option library is the codebase's most defensible pedagogical asset** — ~58% of the 65 options pass Discovery + SRT and are grounded in Montessori, Singapore CPA, balance-scale, and CRA literature. **~42% (constraint-puzzles, classic-overlays, some terrain coordinate-finders, three bidding options) rely on hidden equality checks dressed as game state and should be flagged `practiceOnly` or post-mastery-only.**

**The "deprecated" flag on Circuit Board Builder in `CLAUDE.md` is misleading per the audit.** Only the meta-picker UI is being demoted as part of the Library-as-home pivot; **the 65-option engine library should be preserved and curated, not deprecated.** *Update needed in `CLAUDE.md`.*

**Top proposed changes:**
1. 5-minute rewrite of the two scenario strings (Sum Jumper, Wall Builder) — make math visibly mechanical, not a hidden gate.
2. Add `srtPasses: boolean` field to `GameOptionDef`, audit all 65 options against it.
3. Verify `practiceOnly` is actually wired as a post-mastery gate.
4. When Mr. Chesure is rewritten, have him steer Builders toward strong-intrinsic options rather than presenting a 65-tile shelf or two extrinsic scenarios.

---

## 3. Conflicts with tonight's locked decisions

Per the conflict rule Barbara set: her decisions stand for the design spec and for `docs/product-positioning.md`; the audit doc flags conflicts; she adjudicates in the morning.

| Tonight's decision | Audit lens | Audit recommendation |
|---|---|---|
| Player benchmark widget shows comparative metrics ("kids your age have mastered 12 · top 31 · you 4") | Audit 5 (mastery state machine) and Audit 1 (protégé thesis) implicitly support context-rich benchmarks; no explicit research-backed objection surfaced **beyond** the v1.0 positioning's own concern. **Net:** consistent with research; the v1.0 concern was a values judgment, not an evidence claim. | **No change recommended.** Watch pilot data for harm signals as Barbara already noted. |
| Builder impact ribbon shows publish/plays/ratings | Audit 4 (token economy) | The ribbon's *display* is fine; the *underlying token weighting* (2000/100/10) is misaligned with the same metrics. Ribbon will say "47 plays this week" while the wallet says "you got 470 tokens for 47 plays · 2000 tokens for publishing once." Mismatched signal. **Recommendation: rebalance token economy as proposed in Audit 4 §top-changes.** |
| Library is the front door; galaxy demoted to Explore | All audits | **No conflict.** Multiple audits implicitly endorse foregrounding the Library (Audit 1 cross-age visibility, Audit 5 retrieval engine via plays). |
| Mode pill visible to both Players and Builders | Audit 1 (protégé thesis) | **No conflict** — Players peeking at Build is consistent with motivational research on aspirational identity. |
| World-flavor pivot to Steampunk + Pandora hybrid | None | Outside audit scope; visual direction. No conflict. |
| Planet-shatter mastery state | Audit 5 (mastery state machine) | **Mild conflict.** Audit recommends decay (`mastered_recent` → `mastered_dormant` without retrieval). Visual planet-shatter currently has no "un-shatter" or "weather" state. **Proposed harmony:** keep the dramatic shatter as the moment of attainment, but add a subtle "shards lose luster over weeks of no retrieval" pass that re-ignites on a single retrieval. Doesn't require shatter-reverse — just a brightness/glow attenuation on the orbiting shards. |
| "Win 3 games" mastery threshold | Audit 5 | **Direct conflict.** Audit recommends 8-item Mastery Check with skill isolation + response-time floor. Tonight's spec uses existing 3-wins threshold. Recommendation: keep tonight's spec for v1 ship, add the Mastery Check as a fast-follow in pending-ideas. |
| Sum Jumper and Wall Builder remain in the Builder template list | Audit 8 | **Direct conflict.** Audit says both fail Discovery + SRT and need 4-line rewrites. Library spec doesn't change templates; this is a separate fix. **Recommendation: do the 4-line rewrites BEFORE Library ships**, since the Library will surface games made from these templates and will inherit their pedagogical weakness. |

---

## 4. Top-priority proposed changes (Barbara's morning queue)

Ordered by **leverage** (how much it improves the system per unit of work):

| # | Change | Surface | Effort | Why now |
|---|---|---|---|---|
| 1 | **Rewrite Sum Jumper and Wall Builder scenario strings** — replace hidden-gate framing with visible-mechanical-math | `src/components/builders/builder-picker.tsx` | ~30 min | These templates are about to be surfaced as Library card-lanterns. Ship strong, not weak. |
| 2 | **Build the K.OA domain knowledge file for Mr. Chesure** | `docs/agents/chesure-knowledge/k-oa.md` (new) | ~1–2 days | K.OA is the only domain currently shipping. Without this Mr. Chesure has no grounded basis to evaluate K.OA games. |
| 3 | **Token economy v2** — demote 2000-bonus to one-time milestone; split wallet into Impact/Mastery/Build streams | `src/lib/auth.tsx` + new schema | ~1 day | Misaligned token weighting actively undermines the north-star metric. Cheaper to fix now (small user base) than after pilot. |
| 4 | **Fix K.OA.A.3 mis-implementation** (decompose engine + standard-rounds.ts) | TBD on file location | ~1–2 hrs | The K.OA.A.3 game is in review NOW; landing it with the wrong standard implementation poisons the audit trail. |
| 5 | **Add 6 missing K-3 OA prerequisite edges** + promote 3 from `related` to `prerequisite` | `src/data/standards.json` | ~30 min | Affects 3.OA.A.1 cross-age pilot targeting and K.OA.A.1 Library targeting. |
| 6 | **Replace 3-wins threshold with 8-item Mastery Check** | `src/lib/standard-rounds.ts` | ~1 day | The current threshold conflates accuracy/fluency/automaticity. Cleanest fix is a separate Mastery Check engine that runs after a learner has hit the win-streak threshold. |
| 7 | **Add Construct Validity criterion to The Critic** | `docs/agents/critic-knowledge/` | ~30 min | Closes the audit's biggest single gap in the Critic's rubric. |
| 8 | **Soften `locked` to `recommended_later`** | `src/lib/standards.ts` (schema) + galaxy renderer | ~half a day | Aligns with positioning principle 4 ("build first, learn as needed"). |
| 9 | **Add `last_retrieval_at` field + `mastered_dormant` decay state** | `progress/{uid}/standards/{standardId}` schema | ~half a day | Implements spaced-retrieval research without disrupting the protégé loop's natural retrieval flow. |
| 10 | **Update positioning §moat** — name Scratch + Betty's Brain as prior art; soften "no edtech operationalizes this" | `docs/product-positioning.md` | ~15 min | Pre-empts critique in fellowship/investor conversations. |
| 11 | **Add Productive Failure (Kapur 2011) citation** to positioning §core-belief 4 | `docs/product-positioning.md` | ~10 min | Free credibility — exactly the framework principle 4 already describes. |
| 12 | **Update `CLAUDE.md`** — clarify that Circuit Board Builder's 65-option engine library is preserved; only the meta-picker UI is demoted | `CLAUDE.md` | ~5 min | Audit found the current "deprecated" flag is misleading. |

Items 1–6 are **must-do before Library ships.** Items 7–12 can land in a fast-follow week.

---

## 5. Cross-cutting themes

Three patterns recurred across multiple audits. Worth surfacing at the system level.

**Theme A — Strong principles, weaker implementation.** The principles in `docs/product-positioning.md` are well-grounded (Audit 1 on protégé, Audit 3 on Discovery+SRT). The implementation underneath those principles often quietly violates them (Audit 4 token economy, Audit 8 Sum Jumper/Wall Builder, Audit 7 K.OA.A.3). The risk: the principles act as a **shield against critique** while the actual mechanics underneath don't pass the principles' own tests. Mitigation: every principle in §core-beliefs needs a corresponding code-level enforcement test (the Critic's rubric is the right surface — extend it).

**Theme B — Naming things by the field's names.** Multiple audits recommended adopting established terminology (Audit 3 Discovery+SRT → intrinsic integration / stealth assessment / constructionism; Audit 1 protégé → cite Roscoe & Chi explicitly; Audit 6 Mechanic Inventor → Plass four-mode framework). This is free credibility with educators, fellowships, and investors. Costs nothing; signals seriousness.

**Theme C — The agent stack IS the active ingredient, not polish.** Audit 1 was the strongest evidence: tutors don't automatically learn from teaching; they default to recitation without scaffolds. MGB's design briefs + the Critic + Mechanic Inventor + Shortcut Adversary collectively force the Builder out of recitation into knowledge-building. **This is the moat, more than the loop itself.** Other products could copy the cross-age structure; few would copy the agent rigor. Worth elevating in §moat.

---

## 6. What this audit didn't reach

- The Builder Impact Dashboard analytics layer (not yet built; couldn't audit).
- Long-tail standards beyond K-3 OA in the graph (Audit 2 spot-checked but didn't exhaustively walk the other 400+ nodes).
- The proprietary `learning_data` Firestore collection's misconception-mapping schema (referenced but not opened — would benefit from a focused Audit 9 in a follow-up pass).
- The Cross-age 3.OA.A.1 pilot design (the pilot itself is not yet designed; this audit is foundation work for it).
- Cultural-fit considerations (audit lens was research-grounded, not values-grounded; equity issues are partially surfaced in Audit 1 but not exhaustively).

---

## Appendix — full citations

Each per-surface audit file (`docs/audit/0N-*.md`) contains its own complete BibTeX-friendly bibliography. Common foundational citations across multiple audits:

- Habgood, M. P. J., & Ainsworth, S. E. (2011). Motivating children to learn effectively: Exploring the value of intrinsic integration in educational games. *Journal of the Learning Sciences*, 20(2), 169–206.
- Roscoe, R. D., & Chi, M. T. H. (2007). Understanding tutor learning: Knowledge-building and knowledge-telling in peer tutors' explanations and questions. *Review of Educational Research*, 77(4), 534–574.
- Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin*, 125(6), 627–668.
- Shute, V. J. (2011). Stealth assessment in computer-based games to support learning. In *Computer games and instruction* (pp. 503–524). IAP.
- Kirschner, P. A., Sweller, J., & Clark, R. E. (2006). Why minimal guidance during instruction does not work. *Educational Psychologist*, 41(2), 75–86.
- Kapur, M., & Bielaczyc, K. (2011). Designing for productive failure. *Journal of the Learning Sciences*, 21(1), 45–83.
- Karpicke, J. D., & Roediger, H. L. (2007). Repeated retrieval during learning is the key to long-term retention. *Journal of Memory and Language*, 57, 151–162.
- Plass, J. L., Homer, B. D., & Kinzer, C. K. (2015). Foundations of game-based learning. *Educational Psychologist*, 50(4), 258–283.
- Baker, R. S. J. d. et al. (various, 2004–2021) — gaming-the-system corpus.
- Mislevy, R. J., Almond, R. G., & Lukas, J. F. (2003). A brief introduction to evidence-centered design. *ETS Research Report Series*.
- Common Core State Standards Initiative. (2023). *Progressions for the Common Core State Standards for Mathematics, compiled May 2023.* [mathematicalmusings.org](https://mathematicalmusings.org/wp-content/uploads/2023/05/Progressions.pdf).
