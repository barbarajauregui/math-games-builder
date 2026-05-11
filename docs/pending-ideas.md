# Pending ideas & unfinished work

> Living list of work discussed but not finished. Newest at top. When something here ships, delete it.

---

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
