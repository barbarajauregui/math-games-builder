@AGENTS.md
@docs/product-positioning.md

# Math Games Builder (formerly Option C)

Educational math app built on the **protégé effect**: older/more-advanced learners build math games that younger/less-advanced learners play. Both learn; both have fun.

## Required reading — before any task

Every agent must read and internalize `docs/product-positioning.md` before producing any work. It's the source of truth for what Math Games Builder is, who it's for, and what principles every feature must uphold. If a task conflicts with positioning, flag the conflict — do not silently override it.

**Document hierarchy:**
- `docs/product-positioning.md` = WHAT we're building and WHY (north star — wins all conflicts)
- `docs/math-games-builder-blueprint.html` = HOW we're building it (current implementation; update when it drifts from positioning)
- `CLAUDE.md` (this file) = technical orientation + session state for agents
- `docs/context/README.md` = index of voice, philosophy, design, and pedagogy docs

If positioning and blueprint disagree, **positioning wins** and the blueprint must be updated to match.

## Core principles (shorthand — full versions in positioning doc)

1. **The learner does the math — never the system.** No running totals, no auto-counted piles.
2. **Math IS the gameplay.** Discovery test + Self-Revealing Truth test, both required.
3. **Kids teaching kids is the mechanism.** No chatbots, no lectures.
4. **Build first, learn as needed.** Motivation flows from creating.
5. **Real audiences create real learning.** No orphan games.
6. **Adapt proven pedagogy — don't invent it.** Progressions Docs + Open Up Resources + Math Learning Center.

## Who Math Games Builder serves

- **Builders** — learners developmentally ready to build games for less-advanced learners. Typically ~10–16, but **age is not the gate; readiness is.**
- **Players** — learners still playing and learning the basics. Typically ~5–10, but age is not the gate.
- **Schools** — alternative, traditional, and homeschool co-ops are all first-class. The system must work for multi-age/ungraded settings (like Barbara's school) AND traditional graded schools.
- A tech-savvy 4th grader who can build is a Builder. A struggling older learner who isn't ready yet is still a Player.

## Agent behaviors

- **Cite your source.** Every pedagogical or design claim cites positioning, blueprint, or a Progressions Doc.
- **Never invent pedagogy.** Adapt from Open Up Resources, Math Learning Center, Progressions Docs.
- **Flag conflicts, don't paper over them.**
- **Protect both users.** A Builder-facing change that hurts Players is not acceptable, and vice versa.
- **Default to asking Barbara** on product decisions not already settled in positioning or blueprint.

---

# Technical Orientation

## Quick Reference

- **Live:** https://math-games-builder.vercel.app (Vercel, auto-deploys from main)
- **Repo:** https://github.com/barbarajauregui/math-games-builder
- **Local dev:** `cd C:/projects/math-games-builder && npm run dev` -> http://localhost:3000
- **Firebase project:** option-c-14d3b

## Tech Stack

Next.js 16 (App Router) + TypeScript + Tailwind 4 + Firebase (Auth + Firestore) + Anthropic Claude API + Three.js/react-force-graph-3d for 3D galaxy. Hosted on Vercel. Sandpack embedded for in-app code editor + live preview.

## How the App Works (current, April 18, 2026)

**Two user modes, one app:**
- **Builder mode** — older/more-advanced learners build games for others
- **Player mode** — younger/less-advanced learners play games built by Builders

**The protégé loop:**
1. Builder picks a standard to teach (typically below their own level)
2. Sees a design brief: the "DO the math" worked example + what makes a game truly teach
3. Builds the game via scenarios, templates (Sum Jumper, Wall Builder, etc.), custom HTML paste, or vibe-coder toolbar
4. Agents (Mr. Chesure, Critic, etc.) review for pedagogical soundness
5. Guide approves -> game publishes
6. Player discovers in Library, plays, rates
7. Rating + play data flows back to Builder's dashboard (plays, stars, which kids got stuck)

**Galaxy:** Currently the default home screen. **Pivoting to optional "Explore" view** — Library becomes the primary home for both modes. Galaxy remains available but is not the front door.

**Moon Status States:**
locked -> available (blue) -> in_progress (yellow) -> in_review -> approved_unplayed -> unlocked (green) -> mastered (green + gold)

**Tokens:** +2000 per game approved, +100 per skill mastered, +10 per unique play of your game. Displayed in top bar.

**Roles:** learner (builds/plays games), guide (reviews games, manages class), admin (setup, invites)

## Key Directories

- `src/app/` — Pages: `/` (galaxy — to be demoted), `/learner`, `/guide`, `/admin`, `/library`
- `src/app/api/` — API routes: game generation, chat, progress, admin, `/api/game/modify` (vibe coder)
- `src/components/graph/` — Galaxy view, planet view, knowledge graph
- `src/components/game/` — Build screen, workshop, game player, library, leaderboard
- `src/data/standards.json` — Math standards graph (nodes + edges, 509 standards across 93 clusters)
- `src/lib/auth.tsx` — Auth context, sign-in flows, token management
- `src/lib/app-rules.ts` — In-app Rules popover content (KEEP IN SYNC with behavior changes)
- `docs/agents/` — Agent definitions + knowledge files
- `docs/product-positioning.md` — North star (read first)
- `docs/math-games-builder-blueprint.html` — Current implementation spec

## Important Patterns

- Progress stored in Firestore: `progress/{uid}/standards/{standardId}`
- Games stored in: `games/{gameId}` with HTML in Cloud Storage
- Learner auth: anonymous Firebase auth + personal code (cosmos words like NOVA-42)
- Returning learners: data migrates from old UID to new anonymous UID each session
- Guides can impersonate learners to test their experience
- All AI calls use Anthropic Claude (chat, generation, judging, explanations)
- Proprietary learning_data Firestore collection captures per-round data, session tracking, misconception mapping — never open sourced
- Open source strategy: engines public (Apache 2.0), build workflow + peer play + data pipeline private

## Verified Coverage (honest numbers)

- **Verified games:** 2 of 509 standards (K.OA.A.1 approved, K.OA.A.3 awaiting sign-off)
- **All other 507 standards:** NO verified game. Legacy games were unmapped April 16.
- We ship **one standard at a time, done perfectly**, via the Learning Contract workflow.

---

## Session Notes

<!-- Update this section at the end of each work session -->

**Current session (2026-05-10, evening update) — Build flow audit + positioning v1.2 + Foundation work:**

The morning's brainstorm and audit work led to a major reframe in the evening:

**Audit 9 (build-flow audit) found that the agents Barbara has been refining for months don't actually run at runtime.** Mr. Chesure, the Critic, Mechanic Inventor, Shortcut Adversary are markdown design docs. Games ship from Builder to Player with NO pedagogical check at all. The construct-validity criterion added to the Critic this morning is documentation-only. Plus: the generation prompt is hard-coded to "K.OA.A.1 ADDITION ONLY" so every other standard generates wrong games by construction; the save endpoint writes `status: "published"` directly, bypassing the existing `/api/game/[id]/approve` endpoint that was designed as the guide gate; the paste-HTML path runs only a length+doctype check; an `ensureGameWin` shim auto-fires "you won" after 20 clicks, defeating the only existing pedagogical-soundness gate ("Builder must beat their own game").

**Major reframe in product positioning v1.2:**
- Library and Galaxy split into two distinct environments. Player home = The Star Atlas Library (steampunk reading room with cards on shelves around an illuminated central star atlas that serves as both navigation and mini-map). Builder home = The Galaxy (existing Pandora 3D walkable space, demoted from default to Builder-only). Persistent top-bar mode pill flips between them.
- Lanterns dropped — too many overlapping metaphors (lantern + planet + moon + game). Cards on shelves replaced lanterns. Reference: The Room (iPad puzzle game) for tactile feel.
- Mastery state: planet **bloom** (not shatter — felt aggressive). Pristine planet → cracked-with-light → bloomed-with-life (water spreads, atmosphere appears, forests, lights) as moons get mastered. Additive metaphor; no destruction.
- Player benchmark widget removed (was added in v1.1 morning; Barbara reverted in evening review).
- "Coming soon" → "Locked" copy throughout.
- Cross-grade play allowed (3rd-grader can play K games).
- Player can send fix-request / idea directly to Builder.
- Mastery rule: win 3 different games on the standard, 3 wins per game (9 wins total). Edge case (fewer than 3 games published): stays in_progress; supply-tiered publish bonus floods sparse standards.
- Token economy: supply-tiered publish bonus (2000 → 50 by existing-game-count), +50 per kid mastered, +100 per Builder skill mastered, plays/ratings as visible counters with no token reward.

**Foundation work scoped (BLOCKING; ships before Library/Galaxy redesign):**

The Library/Galaxy redesign cannot ship on top of broken pedagogical engine. Phase 1 fixes:

1. Restore the Guide approval gate (default save status `pending_review`)
2. Fix the prompt-vs-standard mismatch (compose prompt from each standard's knowledge file)
3. Wire the 4-stage Haiku→Sonnet→Haiku→Sonnet runtime agent ladder into the save flow:
   - Stage 1: Haiku Critic (cheap filter, 4 criteria) ~$0.001/check
   - Stage 2: Sonnet Critic (deep, same 4 criteria) ~$0.025/check
   - Stage 3: Haiku Shortcut Adversary (obvious shortcuts) ~$0.005/check
   - Stage 4: Sonnet Shortcut Adversary (creative shortcuts) ~$0.075/check
   - ~$0.05–$0.20 per published game; ~$250–$1000 at fellowship-pilot scale
4. Build Mr. Chesure brief screen (between standard-pick and build, render the K.OA knowledge file)
5. Wire paste-HTML through the Critic ladder (don't bypass quality)

**Mr. Chesure and Mechanic Inventor stay informational** (not in the runtime ladder) — Mr. Chesure runs once per standard-pick to produce the brief; Mechanic Inventor is on-demand consult. Critic and Shortcut Adversary are gates by their nature; they're the runtime ladder.

**Guide approval gate role narrowed** to human-only judgment: appropriateness + polish + classroom context + Builder feedback + safety. The pedagogical-soundness check is the agent ladder's job now.

**Spec rewritten:** `docs/superpowers/specs/2026-05-10-library-design.md` is now v2 (replaces v1 lanterns-era spec from this morning; v1 history preserved in commit `480a9c9`).

**Foundation work landed (2026-05-10 evening, while Barbara was out):**

Three of the five foundation fixes from spec v2 §15.1 are committed and TypeScript-clean. The Library/Galaxy redesign can now ship on top of a real pedagogical engine.

- **Foundation Fix #2 (1a8afa9)** — restored the Guide approval gate. Default save status is now `pending_review` (server-enforced); only `/api/game/[id]/approve` flips to `published`. Players never see a game until a guide signs off.
- **Foundation Fix #5 (01d7fc6)** — generation prompt is now composed per-standard from the knowledge file (today: K.OA full; other clusters: verbatim CCSS text + fallback skeleton with explicit "build STRICTLY to the verbatim text" guard against the previous addition-only contamination). Files: `src/lib/standard-knowledge.ts`, `src/lib/agent-prompts/generate-game.ts`, refactored `src/app/api/game/generate-gemini/route.ts`. Legacy prompt preserved as `_LEGACY_GAME_PROMPT` for reviewer comparison.
- **Foundation Fix #1 (9140eb1)** — 4-stage Haiku→Sonnet→Haiku→Sonnet runtime agent ladder wired into all three save paths (BuilderHost main flow, SandpackBuilder inline save, paste-HTML import flow). New endpoint `POST /api/game/critique` runs the stages sequentially with one retry on JSON-parse failure. New UI component `<AgentLadderProgress />` shows four brass-style dials with stage progression and revision suggestions on failure. Cost ~$0.001 / $0.025 / $0.005 / $0.075 per stage; ~$0.05–$0.20 per published game.

**Foundation Fix #3 (Mr. Chesure brief screen) — DEFERRED.** UI-heavy work that's better with Barbara's eye; not started.

**Foundation Fix #4 (paste-HTML through Critic) — INCLUDED in Fix #1** above; the paste-HTML path (`graph-page.tsx` `ImportedGamePlayer.handleAddToLibrary`) now goes through the same critique gate.

**One edge case flagged for Barbara's review:** the Workshop "Send for review" path (`graph-page.tsx` `handleSendForReview`) writes Firestore directly via `setDoc` and currently bypasses the new critique gate. Per the Foundation Fix #1 subagent's notes, this is a separate UX call — not changed unilaterally. Documented in `docs/audit/foundation-fix-1-notes.md`. Recommend routing through `/api/game/critique` too, as a small follow-up.

**Eight commits this evening, all on local main, none pushed:**

```
9140eb1 fix(foundation #1): wire 4-stage runtime agent ladder into save flow
01d7fc6 fix(foundation #5): compose generate-gemini prompt from per-standard knowledge
7e73c8a docs: pedagogy audit follow-ups (Audits 9 + standards-graph history)
d3994b6 docs(assets): update Leonardo prompts + Sketchfab bookmarks for spec v2
1a8afa9 fix(foundation #2): restore guide approval gate
f8949aa feat(agent-prompts): add 4-stage Haiku→Sonnet runtime ladder prompts
c0abf28 docs: spec v2 + positioning v1.2 (Library/Galaxy split, foundation-first)
+ commits earlier today (240e05a audit + 41e3f1d K-OA notes + 78d85ab K.OA.A.3 fix + 39b0c2a standards graph + 480a9c9 v1 spec + 43f273c bookmarks/prompts)
```

---

**Earlier session (2026-05-10) — Library brainstorming + pedagogy audit dispatch:**

Long brainstorming session that locked the Library design (the new front door for both Builder and Player modes) and dispatched a full pedagogy audit overnight. Spec written to `docs/superpowers/specs/2026-05-10-library-design.md`. No implementation code yet.

**Decisions locked tonight:**

- **Structural model:** route by role at `/` — Builders land on the Builder home, Players land on the Player home. Top-bar `[ Build ] [ Play ]` pill lets either flip modes anytime.
- **Player home:** image-led grid of game-cards, gated to standards where prerequisites are met (= the galaxy's `available` status). Sorted by readiness + domain. "Play now" rail above; "Coming soon" preview rail (faded, locked) below. Each card shows the Builder's name + DiceBear avatar.
- **Player metric:** kept comparative ("kids your age have mastered ~12 skills · top: 31 · you: 4"), framed gently. **Contradicts April-18 positioning that called comparative metrics counterproductive for struggling learners.** Positioning updated to v1.1 with the contradiction noted explicitly.
- **Builder home:** impact-first. Top ribbon = "X games published · N plays this week · K kids learned · ★avg." Below: "Build next" CTA (algorithmically recommended, learner can override). Below: peer Builders' games as the Library content.
- **Mode switch UX:** persistent top-bar pill. Both roles can flip.
- **World-flavor pivoted from pure Pandora to Steampunk-primary Library + Pandora-primary Galaxy hybrid.** Triggered by Barbara's Sketchfab bookmarks list — 7 lanterns, all warm/brass/steampunk; zero Pandora-bioluminescent. Per `world-flavors.md` this is the named "Steampunk + Pandora" hybrid. Library is the warm interior; Galaxy is the cool exterior; you walk between them through a magic portal.
- **Library is a walkable world, not a card grid.** Each game = a hovering brass lantern. igloo.inc-style click-to-zoom-into-portal navigation. Bruno-Simon "world IS the menu" energy. Lantern glow color encodes game state.
- **Cross-age north-star surfacing:** orbiting motes (one per play this week) around a Builder's lanterns + hover-reveal glass plaque with exact numbers.
- **Planet-shatter mastery state:** when a learner masters all moons in a math standards cluster, the planet shatters into orbiting shards. Pristine → cracked (emissive overlay shader, opacity ramps with mastery %) → shattered (Cell-Fractured GLB).
- **Game poster art:** auto-generated by Leonardo per game (default), Builder can upload to override.
- **Performance posture:** low-tier 2D Library by default (Chromebook target), opting up to 3D on dev/laptop.

**Asset roster (license-verified 2026-05-10):**

10 of Barbara's 26 original Sketchfab bookmarks usable as-is (CC-BY/CC0). 16 dropped for license issues. Replacement hunt found CC-BY swaps for lanterns, lava planet (Fitolas), black hole (RTXlover), compass (jsabbott), train (kehosworld), wings (Boooooop). **Barbara rejected the lantern picks** and will hunt herself with `CC BY` + `CC0` filters; Leonardo prompts for self-generated 2D sprite alternatives at `docs/assets/leonardo-prompts.md`. Full roster: `docs/assets/barbara-sketchfab-bookmarks.md`.

**Pedagogy audit dispatched overnight (Scope C + protégé-thesis stress-test):**

Eight background agents covering: protégé thesis, standards graph correctness, Discovery + SRT framework, token economy, mastery state machine, agent definitions, K.OA games, game templates. Plan at `docs/pedagogy-audit-plan.md`. Per-surface output at `docs/audit/0N-*.md`. Aggregate at `docs/audit/2026-05-10-pedagogy-audit.md`. Soft token budget ~$15–25. Output: critique + proposal. **Barbara's locked-tonight decisions win for the design spec; audit flags conflicts.**

Early audit findings worth flagging (more arriving):
- **Token economy is misaligned with north-star** (Audit 4) — 2000:100:10 ratio rewards approval-gate clearance ~200× more than real audience reception. Recommends demoting publish bonus, replacing tokens-for-plays with public unmonetized impact display, splitting wallet by stream.
- **Discovery + SRT framework is ~80% derivative** of established research (Audit 3) — Habgood & Ainsworth's intrinsic integration, Shute's stealth assessment, Papert's constructionism (with Kirschner-Sweller-Clark caveats). Recommends adopting field's names; Productive Failure (Kapur) is the missing citation for "build first, learn as needed."
- **Sum Jumper and Wall Builder fail Discovery + SRT** (Audit 8) — both use extrinsic-integration pattern (hidden equality check). 4-line rewrite proposed. Circuit Board Builder's 65-option library is ~58% strong / 42% should be flagged `practiceOnly`. Note: the "deprecated" flag in this CLAUDE.md is misleading per the audit — only the meta-picker is being demoted; the 65-option engine library should be preserved.

**Memory rules added during the session:**

- **Use the existing dev server, not a parallel mockup server** — `/dev/*` routes in the real Next app (saves tokens vs. brainstorming visual companion).
- **Always provide URLs as clickable markdown links** — never bare text.
- **Load `creative-visual-quality-standards` skill BEFORE asking visual questions** (now in global `~/.claude/CLAUDE.md`) — don't re-elicit Barbara's documented preferences.

**Next steps (in order):**
1. Barbara reviews the design spec + aggregate audit doc in the morning. Picks which proposed changes to apply.
2. Barbara generates lanterns + room art via Leonardo using `docs/assets/leonardo-prompts.md`.
3. Barbara picks Library room shell (Light-Map scene vs. Cave of Eternity) by visual prototype — both prototypes built when she's awake.
4. Per the brainstorming skill flow, after the spec is approved invoke **`writing-plans`** to produce an implementation plan, then **`executing-plans`** + **`subagent-driven-development`** for the build.
5. Pause for human review at the first viewable moment of `/dev/library/grove`.

**Files created or significantly updated this session:**

- `docs/superpowers/specs/2026-05-10-library-design.md` — Library design spec (new)
- `docs/product-positioning.md` — bumped to v1.1, comparative-metric clause added with contradiction note
- `docs/pedagogy-audit-plan.md` — audit plan (new)
- `docs/audit/*.md` — 8 audit outputs (background-generated tonight)
- `docs/audit/2026-05-10-pedagogy-audit.md` — aggregate audit doc (new)
- `docs/assets/barbara-sketchfab-bookmarks.md` — 26 bookmarks license-checked + swaps (updated)
- `docs/assets/leonardo-prompts.md` — 10 ready-to-paste prompts (new)
- `docs/pending-ideas.md` — galaxy dust note + Cave of Eternity bookmark
- `~/.claude/CLAUDE.md` — Microsoft Designer added, "load visual standards first" rule added (global)
- Project memory dir — 3 new feedback memories
- `package.json` — `framer-motion` installed

---

**Previous session (2026-05-09) — Galaxy proof-of-concept; pivot to Library:**

Long visual-design session that produced a working Pandora-flavored galaxy proof-of-concept. Live preview branch: `worktree-galaxy-pandora-rebuild` at `.claude/worktrees/galaxy-pandora-rebuild`. 28 commits, not merged.

What shipped:
- **Plan A foundation** (`src/visuals/`): R3F `<Stage>`, perf-tier auto-detect with override, audio system (Howler-based, gesture-unlocked autoplay, mute toggle persisted to localStorage), in-canvas diegetic loader, post-processing stack (Bloom, Vignette, Chromatic Aberration — DOF removed after testing), Orbitron typography, Pandora cyan focus ring. Code-reviewed by Opus reviewer; 6 fix commits addressed real bugs (autoplay block, mute-flash, geometry leaks, HDRI fallback, invalid OGGs, iPad tier detection).
- **`/dev/foundation`**: original demo with procedural primitives. Kept on disk; superseded by planet-preview's real-asset approach.
- **`/dev/planet-preview`**: the working visual proof-of-concept and the locked-in pattern for Plan B execution. Real Jupiter texture on the planet, real Moon-surface texture on each moon, Solar System Scope Saturn ring as a tinted halo for moon-state, drei `<Sparkles>` as mid-distance dust, slow Lissajous camera drift for parallax depth, Three.js lensflare PNG as the bridge beam.
- **Plan B written but not executed**: `docs/superpowers/plans/2026-05-09-plan-b-galaxy-scene-portal-planetview.md`. Specifies how to scale the planet-preview pattern across all 66 planets in the standards graph.
- **Audio system mounted globally** in `src/app/layout.tsx` — every page now ships with `<AudioProvider>`, `<AmbientSoundscape>` (silent placeholders for now), and a `<MuteToggle>` bottom-right. This was a deliberate product choice on Barbara's call (option C of three options).

What was learned (now in memory):
- **Use real assets, don't build visuals from code.** Procedural shaders consistently produced "looks like X" instead of "is X." Visuals = real assets (Polyhaven, Solar System Scope, NASA, Sketchfab, Kenney, Freesound). Procedural = behavior only (state encoding, animation, layout).
- **Claude is engineer, not art director.** External design tools (Figma, Leonardo) → screenshots → Claude implements pixel-perfect. Don't ask Claude to invent a visual language from a text description.
- **Code review at plan-end is mandatory; per-task review is wasteful.** Integration bugs (autoplay, global mounts, leaks) only surface at plan-end.
- **DOF post-processing on a 3D scene blurs everything you wanted sharp.** Don't fake film bokeh on a Three.js scene; sharp focus throughout reads better and feels more navigable.

Pivot in progress (approved 2026-04-18, executed today on the galaxy side; Library next):
- Galaxy demoted to optional Explore — preserved on the branch above
- **Library becomes the new front door** for both Builder and Player modes — next session's focus
- Audio + R3F foundation already mounts globally, so Library inherits it for free

**Next steps (in order):**
1. Library home redesign (the new front door — separate session, separate chat recommended)
2. Builder Impact Dashboard ("games built / plays / ratings / kids who learned") — replaces "skills demonstrated vs classmates"
3. Builder flow redesign (the 5-screen spec for the inverted flow)
4. Cross-age pilot design (3.OA.A.1)
5. Mr. Chesure rewrite + first domain knowledge file (3.OA)
6. Mechanic Inventor agent
7. Shortcut Adversary agent
8. Resume Galaxy: execute Plan B against the planet-preview visual pattern

See `docs/pending-ideas.md` for the longer list of unfinished work and ideas worth tracking.

---

**Previous session (2026-04-18) — Product positioning locked:**

Major strategic pivot completed in a deep session with Claude (Opus 4.7):

- **Positioning locked.** Created `docs/product-positioning.md` as the north star. Math Games Builder is now defined as a **protégé-effect app**: older/more-advanced learners build games; younger/less-advanced learners play. Research: learning-by-teaching is one of the most robust findings in educational psychology, and no competitor operationalizes it at scale.
- **North star metric:** Cross-age plays per week (a younger/less-advanced learner playing a more-advanced learner's game). This single number measures whether the whole thesis is working.
- **Two user modes confirmed:** Builder (primary) and Player (secondary). Age is NOT the gate — readiness is. Works for alternative schools (like Barbara's, ungraded), traditional graded schools, and homeschool co-ops.
- **K.OA.A.1 reframed.** The current 3-step flow (Real Math/Sprinkles, Fix the Story, Tap Marbles) is pedagogical onboarding, not a game. Steps 1 & 2 may function as a quiz-wrapper for Builders; Step 3 (the dots) is the actual intrinsic moment. The flow needs to invert: **build first, math spec on demand**. K.OA.A.1 may not be the right first standard anyway — considering pivoting to 3.OA.A.1 (multiplication as equal groups) as the first cross-age pilot standard.
- **Galaxy demoted.** A learner told Barbara they didn't understand the galaxy. Decision: keep it as optional "Explore" view; make Library the home screen. The galaxy is the curriculum-designer's view, not the learner's.
- **Progress dashboard reframed.** "Skills demonstrated vs classmates" is counterproductive for struggling learners. Replacing with "Your Impact" for Builders (games built, plays, ratings, kids who learned) and simple progress for Players.
- **Agent diagnosis.** The agent team is well-designed but under-equipped. Missing: Mechanic Inventor (generates mechanics, not just checks them), Shortcut Adversary (actively tries to beat games without understanding the math), domain-specific knowledge files for Mr. Chesure. The Critic rejects but doesn't produce repair directions.

**Next steps (in order):**
1. Builder flow redesign (the 5-screen spec for the inverted flow)
2. Cross-age pilot design (to run at Barbara's school — candidate standard: 3.OA.A.1)
3. Blueprint surgery (update `math-games-builder-blueprint.html` to reflect the pivot; mark legacy sections explicitly)
4. Mr. Chesure rewrite + first domain knowledge file (3.OA)
5. Mechanic Inventor agent (the missing piece — generates, doesn't just check)
6. Shortcut Adversary agent

**Deprecated / do not build toward:**
- 87-Phaser-game architecture (abandoned April 14)
- AI-generated HTML games without Learning Contract (abandoned)
- "Teach first, build second" flow
- Galaxy as default home
- Universal UI serving both Builder and Player with the same screens

**Previous session (2026-04-17):** Pilot at Acton (11 learners). Vibe coder toolbar built, Sandpack embedded, Sum Jumper + Wall Builder added. Hackathon accepted: "Built with Opus 4.7" (Cerebral Valley, $500 credits, $100k prize pool).

**Previous session (2026-04-10):** Major infrastructure shipped. See blueprint change log for full history.
