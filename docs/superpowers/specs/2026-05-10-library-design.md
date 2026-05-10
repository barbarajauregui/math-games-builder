# Library design — 2026-05-10

> **Status:** Draft v1, ready for Barbara's review on 2026-05-11. Synthesized from the brainstorming session of 2026-05-10. Per the brainstorming skill flow, the next step after Barbara approves is invoking `writing-plans` to produce an implementation plan.
>
> **Scope of this spec:** the redesign of the Library as the new front door for both Builder and Player modes, replacing the galaxy as the default home. The galaxy is preserved as an optional Explore view.
>
> **Out of scope:** rewriting the in-app Rules popover (will be a wholesale rewrite during a later pivot pass), the cross-age 3.OA.A.1 pilot design, the Builder Impact Dashboard's deeper analytics, the agent-team rewrites (Mr. Chesure, etc.).

---

## 1. Problem we're solving

The galaxy is currently the default home. A learner told Barbara they didn't understand it. The galaxy is a **curriculum-designer's view**, not a learner's. Both Builder and Player modes need a home that fits *their* relationship to the product, not a shared abstract universe.

The Library is also the place where the cross-age loop is visible: a Builder's game is in the same Library a Player browses. Surfacing that connection is the closest the product gets to making its north-star metric (cross-age plays per week) feel like a real thing.

## 2. Users this serves

- **Builders** (typically grade 5–10, ~10–16): want to see their impact, to be reminded what to build next, to see what their peers are making.
- **Players** (typically grade K–4, ~5–10): want to play games, to feel they have agency over which one, to earn rewards.
- **Guides and admins**: not the focus of this redesign. The Library is for learners; guides will keep using their existing review tooling.

## 3. Decisions locked in this session (with picker rationale)

| Decision | Choice | Why this won |
|---|---|---|
| Mode separation | **Two distinct home screens routed by role** at `/`, with a top-bar `[ Build ] [ Play ]` pill that lets either flip | Positioning §what-mgb-is-not §7: "Not a universal UI. Builder mode and Player mode diverge intentionally. We do not try to serve both with one interface." |
| Player home content | **Image-led grid of game-cards.** Tokens + avatar tuck in the corner. No school framing | Players want games, not a dashboard. Positioning §who-its-for: "What they want: to play games, to earn things, to feel good." |
| Player gating | **Cards visible only for standards where prerequisites are met** (= the galaxy's `available` status) — no extra guide-unlock step. Locked games appear faded as "Coming soon" preview cards | Coherence with the existing standards graph; no new gating concept |
| Player ordering | **Coherence-map sorted, single grid:** "Play now" rail (current edge — just-unlocked, in-progress, anything available) followed by "Coming soon" rail (next-on-path, faded, no Builder avatar) | Players don't navigate curriculum; coherence sorts silently |
| Player attribution | **Builder name + DiceBear avatar visible on every card** | Makes the cross-age relationship diegetic. DiceBear: free, identity-rich, no upload flow needed |
| Player benchmark widget | **Comparative metrics shown:** "Kids your age have mastered ~12 skills · top: 31 · you: 4" | Barbara's call. **Conflicts with positioning v1.0** which called comparative metrics counterproductive for struggling learners. Positioning bumped to v1.1 with the contradiction noted; we'll watch for harm signals in pilot data and revisit |
| Builder home content | **Impact-first.** Top ribbon = "X games published · N plays this week · K kids learned · ★avg." Below: "Build next" CTA. Below: peer Builders' games (same Library content the Players see, framed differently) | Positioning §30-day-plan: replace "skills demonstrated vs classmates" with "Your Impact" for Builders |
| Builder "Build next" | **Algorithmically recommended (high Player demand × low Builder supply), Builder can override** | Mixes north-star pressure with autonomy |
| Mode switch UX | **Top-bar pill, persistent, both roles can flip** | Builders should be able to play peer games without ceremony; Players can peek at Build mode |
| World-flavor for Library | **Steampunk-primary Library + Pandora-primary Galaxy hybrid** (per `world-flavors.md`'s named "Steampunk + Pandora" hybrid) | Triggered by Barbara's Sketchfab bookmarks list — 7 lanterns, all warm/brass/steampunk; zero Pandora-bioluminescent. Library = warm interior; Galaxy = cool exterior; you walk between them |
| Library structure | **Walkable world, not a card grid.** Each game = a hovering brass lantern. igloo.inc-style click-to-zoom-into-portal navigation. Bruno-Simon "world IS the menu" energy | Barbara's reaction to references — Active Theory and Resn yes, Bruno yes ("could we do this instead of cards?"), Apple/SaaS no. Per `creative-visual-quality-standards` non-negotiables: portal navigation is default; idle = world breathes; loading = diegetic |
| Lantern state encoding | **Glow color encodes status.** Locked: dim glass with no glow. Available: warm amber. In-progress: brighter amber. Mastered: gold-cored with subtle gold halo | State shown by world-physics, not UI badges. Per `world-flavors.md` Steampunk lighting palette |
| Cross-age north-star surfacing | **Both** orbiting motes (one mote per play this week orbits a Builder's lantern, motion = live energy) **and** hover-reveal glass plaque with exact numbers | Barbara picked option C. Diegetic + precise |
| Planet-shatter mastery state | **Visible damage accumulates as moons in a cluster get mastered.** Pristine → cracked (emissive crack-line shader, opacity ramps with mastery %) → shattered (swap to Cell-Fractured GLB, persistent orbiting shards, gold halo on the cluster's domain badge) | Barbara's idea. Fully aligned with §core-belief 2 (math IS the gameplay; state shown by world) |
| Game poster art | **Auto-generated by Leonardo per game (default), Builder can upload to override** | Default removes friction; override preserves Builder identity |
| Performance posture | **Low-tier 2D Library by default.** Real Tailwind cards over a static painted-room backdrop, lantern PNG sprites with CSS glow filter, drei `<Sparkles>` only on opt-up. **High/mid tier:** full R3F walkable scene with lantern glTF instances | Per `creative-visual-quality-standards` MGB-Chromebook clause: school Chromebooks are weak; default to low tier |

## 4. Architecture

### 4.1 Routes

```
/                       → role-aware redirect (server component) routes to /play or /build
/play                   → Player home (Library framed for Players)
/build                  → Builder home (Library framed for Builders)
/explore                → optional Galaxy view (the existing galaxy, demoted from default)
/library/[skillId]      → existing skill-filtered Library view; preserved
/dev/library/grove      → dev-only walkable-3D prototype (see §6)
```

**Mode flip:** the top-bar pill pushes to `/play` or `/build` and persists the user's *preferred* mode in `localStorage` (separate from their assigned role). On next visit, `/` routes to the preferred mode if set, otherwise to the role default.

### 4.2 Component layout

```
<AppShell>                              # already exists at src/app/layout.tsx
  <AmbientSoundscape />                 # already mounted globally
  <MuteToggle />                        # already mounted globally
  <ModePill />                          # NEW: top-bar [ Build ] [ Play ] toggle
  <UserMenu />                          # existing
  <main>
    {role === 'builder' ? <BuilderHome /> : <PlayerHome />}
  </main>
</AppShell>
```

#### `<PlayerHome />`

```
<PlayNowRail games={availableUnplayed + inProgress} />
<PlayLibrary games={available} groupBy="domain" />
<ComingSoonRail games={nextOnPath} faded />
<BenchmarkWidget myMastery={4} ageAvg={12} top={31} />
```

#### `<BuilderHome />`

```
<ImpactRibbon
  publishedCount={3}
  playsThisWeek={47}
  uniqueKidsLearned={12}
  avgRating={4.6}
/>
<BuildNextCTA recommendedStandard={algoPick} canOverride />
<PeerBuilderShelf
  yourGames={myGames}
  peerGames={otherBuildersGames}
/>
<BuilderLeaderboard />     # demoted to a small card; not a screen
```

### 4.3 Data model

No schema change required for v1. The Library reads from existing collections:
- `games/{gameId}` (Firestore): published games. Add a derived field on read: `isAvailableFor(userId)` — returns true iff all prerequisites are mastered for `userId`.
- `progress/{uid}/standards/{standardId}` (Firestore): mastery state per learner per standard.
- `plays/{playId}` (Firestore, NEW): one document per game-play. Holds `gameId`, `playerUid`, `builderUid`, `playedAt`, `rating?`, `result`. Used to compute the impact ribbon in real time and to drive the orbiting-motes count on Builder lanterns. Indexed on `(builderUid, playedAt)`.
- `users/{uid}` (Firestore): adds `preferredMode: 'builder' | 'player' | null` to allow user-overridden mode landing.

### 4.4 Behavior — the protégé loop visualized

The whole point of the Library is to make the loop visible:
1. A Builder publishes a game → it appears as a fresh-amber lantern in their `<PeerBuilderShelf />` and in the global Library that Players browse.
2. A Player plays it → a `plays/` doc is created → orbiting mote appears around the Builder's lantern (next refresh).
3. A Player rates it → average rating ticks up on the Builder's impact ribbon and on the lantern's hover-reveal plaque.
4. A Player masters the standard the game targets → planet shatter progresses; mote count keeps climbing.

This is the design intent's payoff: a Builder watching their lantern accumulate orbiting motes IS the cross-age metric, embodied.

## 5. Visual design (steampunk-primary Library)

Source of truth: `~/.claude/skills/creative-visual-quality-standards/world-flavors.md` §1 (Steampunk / Jules Verne). All non-negotiables there apply.

### 5.1 Asset roster

License-verified. Detail in `docs/assets/barbara-sketchfab-bookmarks.md`. Subject to Barbara's morning approval — she rejected the agent's lantern picks and may self-source via Leonardo (`docs/assets/leonardo-prompts.md`) or new Sketchfab finds.

**Library room shell** — pick one in prototyping (§6): [Light-Map scene](https://skfb.ly/ECOx) (450 tris, simple) or [Cave of Eternity](https://skfb.ly/6ZvCM) (atmospheric, magical).

**Game-card lanterns** — Leonardo-generated 2D PNG sprites (low-tier route) or CC-BY 3D GLB (mid/high-tier route). Three or more variants for visual variety; distinct paper-lantern variant for locked-state.

**Diegetic UI:**
- Mode-switch lever: [Steampunk Solar Transit artifact](https://skfb.ly/6WGqX)
- Curriculum-position compass: [jsabbott Compass](https://sketchfab.com/3d-models/compass-low-poly-game-asset-a2572112e61048ad81845af34f8ee90b)
- Hearth: [Campfire Wood](https://skfb.ly/6QYoY)
- Hallway lamp: [Light Pole](https://skfb.ly/6UW7Q)

**Library↔Galaxy portal:** [Magic Portal](https://skfb.ly/6VytI)

**Galaxy planets** (used in Explore, not the Library directly; here for completeness):
- Variety: [Various Planets](https://skfb.ly/o7F9p)
- Hero: [Surreal Planet](https://skfb.ly/pyYr6)
- Lava: [Lava Planet](https://sketchfab.com/3d-models/lava-planet-d5b28875e7b6452e8236d538547b2a68)
- Endgame: [Black hole](https://sketchfab.com/3d-models/black-hole-with-accretion-disk-1d0a5cb6bb2a43f4b2e7719c88cec6b2)

**Ceremonies:** [Wings](https://sketchfab.com/3d-models/angel-wings-917b4019a1614d179e70cda895fd3f16) (Builder first publish), [Train](https://sketchfab.com/3d-models/lowpoly-steampunk-train-427574ea7ccf4b879fa1b489799c30b8) (Player cluster mastery / Builder publish).

**Planet-shatter:** Cell-Fracture Feivelyn's [Various Planets](https://skfb.ly/o7F9p) in Blender; export as `shattered-{domain}.glb`. One-time art task.

### 5.2 Sound

The Library inherits the global `<AmbientSoundscape />` mounted in `src/app/layout.tsx`. New content needed:
- Steampunk ambient bed (gear ticking, distant steam hiss, occasional bellows). To be sourced via Barbara's pending ~1-hour Freesound CC0 curation pass.
- UI sounds: brass-on-brass tap (lantern hover), pneumatic whoosh (portal entry), latch click (mode-switch lever). Same curation pass.

Galaxy keeps its existing Pandora bed (chime + flute + low hum). The portal transition crossfades from steampunk to Pandora to make the spatial boundary audible.

### 5.3 Motion principles

Per `creative-visual-quality-standards` motion section:
- **Camera cinematic drift** — the Library camera always slowly orbits / parallaxes; never static.
- **Portal navigation** — clicking a lantern flies the camera into it; clicking the [Magic Portal](https://skfb.ly/6VytI) flies through into the Galaxy.
- **Idle = breathing** — dust motes drift in lamplight, lanterns sway gently, the campfire flickers, a brass clock ticks softly somewhere.
- **Loading = diegetic** — the Library loads with fog clearing, lanterns igniting one by one, no spinner.
- **Tactility** — hover a lantern → it pulses, the inner glow brightens, a soft brass chime plays, the Builder's plaque fades in.
- **Easing curves** — `easeInOutCubic` default; never linear.

## 6. Build path (low-tier first, opt-up)

### 6.1 Phase 1 — Low-tier Library (Chromebook-default, no R3F)

Build first. This is what most learners will see.

- `/dev/library/grove-2d` — full Player home + Builder home as 2D Tailwind components over a static painted-room backdrop image
- Lanterns are PNG sprites with CSS `filter: drop-shadow()` glow; state (locked/available/in-progress/mastered) drives glow color via inline style
- Portal is a static PNG; clicking it dissolves the screen with a fast cinematic crossfade (Framer Motion) and routes to `/explore`
- Hover plaque is a Tailwind tooltip — Builder name + avatar + play count
- Sound, mode pill, ambient soundscape all inherit from global shell
- Player benchmark widget renders inline
- **Pause for Barbara's visual review here.** Iterate on poster art, layout, copy.

### 6.2 Phase 2 — High-tier Library (R3F walkable scene)

Built behind a perf-tier flag once Phase 1 is approved.

- `/dev/library/grove-3d` — same content, rendered as an R3F scene
- Camera orbits the room with cinematic drift; lanterns are GLB instances suspended in the room
- Click a lantern → camera flies in (portal-zoom) → game loads
- drei `<Sparkles>` for dust motes (igloo.inc-snow style: slow, suspended)
- HDRI environment for lighting (Polyhaven CC0 — pick a warm interior HDRI)
- **Pause for Barbara's visual review here.** Iterate on lighting, lantern density, motion.

### 6.3 Phase 3 — Wire to production data

- Replace mock games array with real Firestore reads
- Wire `plays/` collection writes when a Player plays a game
- Compute impact ribbon stats from real `plays/` aggregation
- Compute orbiting-mote count per lantern from real plays-this-week count
- Wire planet-shatter mastery state to real `progress/` reads in the Galaxy view

### 6.4 Phase 4 — Galaxy treatments dependent on the Library

When Library ships and is the front door, the Galaxy is no longer the default home. Update:
- Galaxy is reached via `/explore` only, with the [Magic Portal](https://skfb.ly/6VytI) as the diegetic entry from the Library
- Apply the **planet-shatter** state machine to the existing galaxy planet renderer (cracked-shader overlay + shattered GLB swap at 100%)
- Replace the all-Jupiter texture with [Various Planets](https://skfb.ly/o7F9p) so each cluster has a distinct planet

## 7. Performance budget

Per `creative-visual-quality-standards` MGB-Chromebook clause:
- Low-tier route: ≤ 2 MB total bundle (room backdrop JPEG + a handful of lantern sprites + ambient bed audio). 60 fps target.
- High-tier route: ≤ 15 MB total bundle (room GLB + lantern GLBs + HDRI + audio). 60 fps target on a 2020-era laptop.
- Asset budget per object: lantern GLBs under 5 k tris; room shell under 2 k tris (Light-Map scene chosen with this in mind); HDRI 1k for low/mid, 2k for high.

## 8. Accessibility

Non-negotiables from `creative-visual-quality-standards`:
- `prefers-reduced-motion` — heavy camera drift swaps to subtle parallax; lantern idle-sway becomes opacity-only pulse; portal-zoom becomes a fast crossfade.
- Keyboard navigation — every lantern is tab-focusable; Enter activates; visible focus ring uses Steampunk amber accent (not browser default).
- Mute toggle — already global, persists across pages.
- WCAG AA — Builder name plaque text against the lantern hover scrim must hit 4.5:1.
- State never conveyed by color alone — locked/available/in-progress/mastered each have a distinct **silhouette accent** (an icon or material treatment) on the lantern in addition to glow color.

## 9. Open questions / decisions deferred to Barbara's review

1. **Library room shell — Light-Map vs. Cave of Eternity.** Locked at "prototype both"; both go up in `/dev/library/grove-2d` for visual selection.
2. **Lantern asset source.** Barbara rejected the agent's CC-BY picks; will self-source from Sketchfab (CC-BY + CC0 filters) or Leonardo prompts. Spec proceeds with placeholder sprites.
3. **Comparative-metric framing copy.** "Kids your age have mastered ~12 skills · top: 31 · you: 4" is a starting point; final copy needs Barbara's eye, especially for low-mastery learners.
4. **Audit-driven changes.** Pedagogy audit running tonight may surface specific changes affecting the Library spec (e.g., Audit 4's recommendation to demote the publish-token bonus may shift what shows in the Builder impact ribbon). Audit findings flagged but not auto-applied; Barbara adjudicates.

## 10. Cross-references to the audit

The pedagogy audit (`docs/audit/`) is running parallel tonight. When it lands, the following sections of this spec may need revision based on its findings:

| Spec section | Likely audit lens |
|---|---|
| §3 Player benchmark widget (comparative metric) | Audit 1 (protégé thesis) and Audit 5 (mastery state machine) — comparison framing in mastery learning |
| §4.4 protégé loop visualization | Audit 1 (protégé thesis stress-test) — boundary conditions, what the literature says about visible peer presence |
| §3 Builder impact ribbon | Audit 4 (token economy) — relative weighting of publish/play/master metrics |
| §3 lantern state encoding | Audit 5 (mastery state machine) — should "mastered" decay over time? |
| §6 game templates referenced indirectly | Audit 8 (game templates) — Sum Jumper / Wall Builder pedagogical soundness |

If audit findings recommend changes, they go into `docs/audit/2026-05-10-pedagogy-audit.md` as proposals; Barbara's tonight-decisions stand for this spec until she chooses to amend.

## 11. After approval

Per the brainstorming skill:
1. Barbara reviews this spec and either approves or requests changes.
2. On approval, invoke the `writing-plans` skill to produce a concrete implementation plan (task breakdown, file-by-file edits, test strategy).
3. Then `executing-plans` + `subagent-driven-development` for the build.
4. Pause for Barbara's review at the first viewable moment of `/dev/library/grove-2d`.
5. Code-reviewer (Opus, both passes) at plan-end before merging to main.
6. Optional `/ultrareview` before merging to main, since this is a user-facing change.

---

## Appendix A — Inline self-review

Done after writing. Issues found and fixed inline:

- ✅ No "TBD" or "TODO" remaining (open questions §9 are deliberately scoped, not gaps).
- ✅ Internal consistency: §3 decisions match §4 architecture and §5 visuals.
- ✅ Scope check: this is a single-spec-sized change. Implementation would take a focused ~2-week effort with code-reviewer at end.
- ✅ Ambiguity: Library "available" status was potentially ambiguous (does it require mastery of prereqs or just exposure?) — pinned to existing galaxy `available` semantic in §3.
