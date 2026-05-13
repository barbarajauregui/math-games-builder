# Pending ideas & unfinished work

> Living list of work discussed but not finished. Newest at top. When something here ships, delete it.

---

## From the 2026-05-11 second external-Claude batch (10 deferred items + 2 specs to sequence)

A second pass from a fresh Claude window produced 12 mini-audits (#15–26) and 2 concrete specs (Mastery Check, PostHog Telemetry). Two items addressed before K.OA.A.1 execution (Audit 17 terminology, Audit 22 shim deletion). Ten deferred here:

### Audit 15 — Cluster context invisible in galaxy
- `docs/audit/15-cluster-context-invisible.md`. Galaxy shows planets/moons but no "this whole planet teaches addition" label. Fix: hover plaque + entry overview card + sibling-moon ribbon. **Defer to Library/Galaxy redesign workstream** — touches the Builder home (Galaxy) which is being rebuilt anyway.

### Audit 16 — Mr. Chesure brief screen missing
- `docs/audit/16-mr-chesure-brief-missing.md`. The 592-line K.OA briefing content renders nowhere in the build flow UI. The K.OA.A.1 spec accesses it via side-menu "Learn More" but never surfaces it inline. **Decision:** ship K.OA.A.1 with the side-menu access only; watch pilot data. If Builders skip the brief and produce off-pedagogy games, add a mandatory brief step in v1.1 (half a day per the audit).

### Audit 18 — Standard-engine coverage gaps
- `docs/audit/18-standard-engine-coverage-gaps.md`. Only ~2.5% of standards (13 of 517) have 3+ vetted engines. K.OA.A.1 has 3; covered. **Fix: 3-tier mapping plan covering ~30 K-3 standards.** Natural Mechanic Inventor build queue. Sequence after K.OA.A.1 ships; first target is 3.OA cluster (cross-age pilot target).

### Audit 19 — Scenario cards flawed (pre-v2)
- `docs/audit/19-scenario-cards-flawed.md`. Critique of the OLD scenario cards (middle-class US, addition-only, no standardId branching). **Largely addressed in K.OA.A.1 build flow v2:** each scenario has add + subtract templates; cultural broadening is in Audit 14's funds-of-knowledge follow-up. The operation×CGI×culture matrix tagging proposal (~60 cards) is a v1.1 expansion when we extend beyond K.OA.

### Audit 20 — Verb parser edge cases (CONFLICTS with Audit 14 §1)
- `docs/audit/20-verb-parser-edge-cases.md`. Proposes confidence-tiered soft warnings on ~10 ambiguous CGI verbs. **DEFERRED — conflicts with Audit 14 §1 (Moschkovich corpus) which we locked: keyword-strategy soft warnings reify the strategy ELs are best served avoiding.** Audit 20's telemetry-log proposal (log verb-operation disagreements without UI) can land via the PostHog spec; surfacing soft warnings does not.

### Audit 21 — Engine filter not wired
- `docs/audit/21-engine-filter-not-wired.md`. `getGameOptions` returns the raw bucket without `practiceOnly` / `srtPasses` filtering. The K.OA.A.1 flow reads from `standard-mechanic-map.json` directly, bypassing `getGameOptions`. But other call sites still use the unfiltered function. **Fix: `getBuildableGameOptions` helper + flag 6 more engines HIDDEN. 1–2 hrs.** Sequence after K.OA.A.1 ships.

### Audit 23 — Agent ladder uncalibrated
- `docs/audit/23-agent-ladder-calibration.md`. Concrete calibration plan: 50 items × 2 raters × Cohen's kappa ≥ 0.6 per criterion as ship gate; monthly 5% re-review. **~25–35 of Barbara's hours + $200–1000 for external rater.** Replaces the looser "human-expert calibration" note from the first external-reviewer pass. **Compound interaction with the Mastery Check spec:** the calibration set should include Mastery Check items, and the kappa target applies to Mastery Check authoring too.

### Audit 24 — Player learning context invisible
- `docs/audit/24-player-learning-context-invisible.md`. Players never see what a game was teaching. Fix: post-play (never pre-play) icon-led card, plain-words sentence, tap-to-hear narration. **Defer to Player home workstream** (separate from Builder build flow).

### Audit 25 — Player reading load
- `docs/audit/25-player-reading-load.md`. Library has 8 text surfaces kindergartners can't decode. Fix: icon-first cards + tap-to-hear narration together (1.5–2 weeks). **Defer to Player home workstream.**

### Audit 26 — Young player rating noise
- `docs/audit/26-young-player-rating-noise.md`. Stars from under-7s are noise; telemetry reliable from age 4. Confirms the original external-reviewer #7 finding with a concrete proposal: **split Builder dashboard into Kid Telemetry (ranks leaderboard) and Kid Feedback (decoration only)**. Defer to Player home workstream; sequence with the PostHog spec since it depends on the telemetry pipeline.

### Spec — Mastery Check Game (2026-05-10)
- `docs/superpowers/specs/2026-05-10-mastery-check-game.md`. Hand-authored 8-item Mastery Check per standard, runs after the 3×3 practice-game wins. K.OA.A.1 ships first with 8 items covering all 8 representational modes. **Sequence after K.OA.A.1 build flow ships** — needs published K.OA.A.1 games to make the practice-then-check loop coherent. Replaces the v1 "win 3 different games × 3 wins" being the sole mastery signal; the Mastery Check gates mastery elevation.

### Spec — PostHog Telemetry (2026-05-10)
- `docs/superpowers/specs/2026-05-10-posthog-telemetry.md`. Operational backbone for 4 other audits (#17 misconception flagging, #20 verb-disagreement logging, #23 drift monitoring, #26 telemetry-over-ratings). PostHog already partially installed (autopageviews + exceptions). **Recommendation: sequence Phase 1 first, before or in parallel with K.OA.A.1 build flow.** ASK BARBARA — do we pause K.OA.A.1 execution to wire PostHog Phase 1 first, or run them in parallel?

## From the 2026-05-11 external-reviewer pass (6 items deferred from the 10 findings)

A fresh Claude Code window did an external pedagogical review and found 10 gaps in our existing audits. 4 are being addressed before the K.OA.A.1 build flow ships (equal-sign-as-relation, cardinality moment, MP1–MP8 tagging, math anxiety tone scan); the 6 below are tracked here for follow-up workstreams. Full triage in the chat transcript dated 2026-05-11. New agent definition at `docs/agents/the-external-reviewer.md`.

### Equity / EL / cultural fit / stereotype threat (Audit 14)
- The biggest single hole across all 13 prior audits. Audit 14 is running in background as of 2026-05-11; output lands at `docs/audit/14-equity-and-language.md`. Per the audit, build out: an Equity Reviewer agent, an EL-friendly mode for the build flow, additional scenarios from a funds-of-knowledge lens, and stereotype-threat risk analysis on the Builder leaderboard before it returns. Canonical sources: Moschkovich 2002/2015, Civil 2007, González et al. 2005, Boaler 2016, Spencer et al. 1999, Gutiérrez 2008.

### Productive Failure consolidation phase
- Kapur's PF protocol requires phase (a) generation + phase (b) consolidation with explicit canonical instruction. MGB has (a) — "build first" — but no (b). Loibl, Roll & Rummel 2017 identifies consolidation as the active ingredient. Fix: add a post-Critic-pass, pre-publish "what we learned" screen showing the canonical interpretation of the standard the Builder just built for. Probably one screen of UI. Build after the K.OA.A.1 flow ships its first 50 games and we have material to validate the consolidation against.

### Cross-age window bias — favor 2-3 grade gaps over 5+
- Cohen-Kulik-Kulik 1982 meta of 65 studies: optimal cross-age tutoring gap is 2-3 grade levels; effect size drops as the gap widens. Topping 2005 echoes this. Audit 1 cited Fitz-Gibbon 1975 (single study, 5-year gap) without running the meta. Fix: in the "Build next" recommender, soft-bias suggestions toward standards 2-3 grade levels below the Builder, not 5+. Touches code we haven't written yet; defer until Builder home is built.

### Player ratings → behavioral telemetry weighting
- Wellman, Cross & Watson 2001 meta on theory-of-mind: kids under ~7 have limited evaluative judgment. Star/emoji ratings from K-1 are noise. Smileyometer / Fun Toolkit (Read & MacFarlane 2006) is the established instrument for this age. Fix: distinguish two Player signals in the Builder Impact ribbon — behavioral telemetry (replays, completion, time-on-task) is reliable from age 4 up; self-report ratings are noisy below age 7. Weight telemetry higher in the Builder dashboard. Schema-level change in Player signal handling. Defer until Player home is being designed.

### IRT calibration of "wins" toward mastery
- "Win 3 different games × 3 wins each = mastered" doesn't distinguish wins on Builder A's easy game from wins on Builder B's hard game. Embretson & Reise 2000 IRT framework is the canonical solution: calibrate each engine's difficulty parameter as games accumulate plays. Probably overkill if we ship Audit 5's Mastery Check (an 8-item check per standard); revisit if that doesn't ship.

### Human-expert calibration of the agent ladder
- Foundation Fix #1 ships a 4-stage agent ladder, but there's no inter-rater reliability data. "The Critic approved" means "Claude thought it was OK," not "this is pedagogically valid." Mislevy 2003 evidence-centered design, Lottridge 2018 on automated-scoring validation. Fix: build a calibration set of ~30-50 already-published games (the K.OA.A.1, K.OA.A.3 work, sandbox samples) rated by Barbara + 1-2 math educators. Run the ladder against the same set. Compute Cohen's kappa. Iterate prompts until kappa > 0.6 (moderate agreement). This is a multi-day workstream; can't start until humans are available. The calibration set DESIGN can be specced now if Barbara wants.

---

## From session 2026-05-10 (Library brainstorming)

### Asset bookmarks (saved by Barbara, use TBD)
- **[The Cave of Eternity](https://skfb.ly/6ZvCM)** by *salinaforr* on Sketchfab, CC-BY 4.0. Magical cave with mystical tree, glowing crystals, lanterns, fog, magical portals, altar, and boat. Pandora-flavor adjacent; would map cleanly onto either (a) the Library's Grove-of-Lanterns hub scene or (b) a future "Cave" world-flavor variant for one math domain. Saved as a candidate; no use locked yet.

### Galaxy improvement — dust like igloo.inc snow
- The drei `<Sparkles>` dust currently in the planet-preview should mimic [igloo.inc](https://igloo.inc)'s falling snow — but **suspended and moving more slowly** because there is no wind in space. Slower drift, less directional flow, particles that linger and pulse rather than fall. Tweak the Sparkles `speed` and `size` props on the next galaxy pass.

## From session 2026-05-09 (galaxy proof-of-concept)

### Galaxy rebuild (parked at proof-of-concept)
- **Plan B execution.** The implementation plan exists at `docs/superpowers/plans/2026-05-09-plan-b-galaxy-scene-portal-planetview.md` but has not been executed. Plan B scales the planet-preview visual pattern (real Jupiter / moon textures + Saturn-ring halos + drift parallax + Sparkles dust) to all 66 planets in `src/data/standards.json`. Worktree: `.claude/worktrees/galaxy-pandora-rebuild`, branch `worktree-galaxy-pandora-rebuild`. To resume: `cd` into the worktree, `npm run dev`, visit `/dev/planet-preview` for the locked visual pattern, then "execute Plan B."
- **Custom 404 page in the galaxy world flavor.** Listed as a non-negotiable in `creative-visual-quality-standards`. Not built. Should live in the world (broken signpost / sealed portal / falling bioluminescent leaf) with a diegetic path home.
- **Signature mark.** Still TBD. Skill has a shortlist (brass cog with constellation, octopus-tentacle compass, astrolabe ring with one orbit dot, brass key with gear teeth). Pick one when bandwidth permits; deploy as favicon + header icon + 404 hero across all pages.

### Real assets still needed
- **Real audio.** `public/audio/*.ogg` are 6 silent 3.9-KB placeholders. Manifest at `public/audio/README.md` describes what each slot needs (ambient bed, melodic layer, click, hover, portal whoosh, win). Source from Freesound CC0 (~1 hour of curation by Barbara). Drop into `public/audio/` over the placeholders; no code changes needed.
- **Real Pandora HDRI.** `public/hdri/` is empty; lighting falls back to drei's bundled `night` preset. Optional upgrade — pick a real nebula HDRI from Polyhaven CC0 (search "nebula", "night sky", "deep space" for indigo tones), drop in `public/hdri/pandora-nebula-{1k,2k,4k}.hdr`, then flip `src/visuals/world/lighting.tsx` from `<Environment preset="night">` to `<Environment files={hdriPathByTier[tier]}>`.
- **Real planet textures for the 66 planets.** Currently downloaded: jupiter, saturn, neptune, mars, plus moon-surface and saturn-ring. For Plan B's 66 planets we'll likely want a mini-library of ~10-15 planet textures (gas giant, rocky, icy, atmospheric variants) and apply hue-shifts per grade band. Source: Solar System Scope (CC-BY) + NASA imagery (public domain).

### Workflow upgrades discussed but not installed
- **Framer Motion** — for screen transitions, hover effects, reward animations. Standard library. Install when starting Library work.
- **LottieFiles** — for ready-made micro-animations (confetti, success bursts, loading). Free CDN.
- **tsParticles** — for kid-friendly particle effects (sparkles on correct answer, stars on level-up).
- **Rive** — for state-machine UI animations (XP bars, animated buttons). Free personal plan.
- All four are aligned with the global memory rule "Claude is engineer, not art director" — they ARE the assets, Claude wires them in.
- Strongly considered installing in this session but deferred; first need to know which Library screens use them.

### Audio system — product call to revisit
- The audio system is currently mounted globally in `src/app/layout.tsx`, meaning EVERY existing page (`/learner`, `/guide`, `/admin`, `/library`, the home) will play Pandora ambient music once real audio assets land. Barbara explicitly chose this on 2026-05-09 (option C of three). Worth revisiting after real audio is curated — some pages (Builder workspace, Guide review tool) may want silence by default while others (Library, learner home) want full ambient.
- Idea: per-route audio "mood" — Library could have one bed, Builder could have a quieter "workshop" bed, Guide review could be silent by default with optional ambient.

### Visual non-negotiables still outstanding
- **Custom 404** (mentioned above)
- **Signature mark** (mentioned above)
- **Real-motion polish on existing pages.** The galaxy preview proved the camera-drift-+-sparkles pattern feels alive. Existing pages (build screen, dashboards) are static. Library should set the new bar; older pages get retroactive polish on a separate pass.

---

## Open from earlier sessions (kept here for visibility)

### Builder + Player split (from 2026-04-18 positioning)
- Library as new home for both modes — **next session's focus**
- Builder Impact Dashboard replacing "skills demonstrated vs classmates"
- Builder flow redesign (5-screen inverted flow: build first, math spec on demand)
- Player home design — what does grade-K-4 see when they open the app?

### Pilot
- Cross-age pilot design at Acton — candidate standard 3.OA.A.1 (multiplication as equal groups)
- Need: 4 builders from grade 5-7 build games, 6 players from grade 3 play them, measure cross-age plays per week (the north-star metric)

### Agents
- Mr. Chesure rewrite + first domain knowledge file (3.OA)
- Mechanic Inventor agent (generates mechanics, doesn't just check)
- Shortcut Adversary agent (actively tries to beat games without understanding the math)

### Infrastructure
- 87-Phaser-game architecture cleanup (abandoned April 14 but legacy code may remain)
- Update in-app Rules popover (`src/lib/app-rules.ts`) to reflect Builder/Player pivot — flagged as a wholesale rewrite, not incremental patches

---

*Last updated: 2026-05-09*
