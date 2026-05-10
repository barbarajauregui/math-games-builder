# Library + Galaxy design — 2026-05-10 (v2)

> **Status:** Draft v2, replacing the v1 lanterns-era spec written earlier today. Per the brainstorming skill flow, the next step after Barbara approves is invoking `writing-plans` to produce an implementation plan.
>
> **What changed from v1:**
> 1. Lanterns dropped — too many overlapping metaphors (lantern + planet + moon + game). Replaced with cards in The Star Atlas Library.
> 2. Galaxy and Library are no longer two views of the same place. They are two distinct environments:
>    - **Player home = The Star Atlas Library** (cards in a steampunk astronomer's reading room with a central illuminated atlas as overview / mini-map).
>    - **Builder home = The Galaxy** (the existing Pandora 3D walkable galaxy; demoted from default to Builder-only).
>    - Mode pill flips between them when a learner wants to switch modes.
> 3. Cross-age north-star surfacing reused — visible orbiting dots around a Builder's own card-game when it's getting plays.
> 4. Foundation work (the runtime agent gate, restored Guide approval, fixed prompt composition) added as a hard prerequisite. The Library/Galaxy redesign cannot ship until games can be guaranteed pedagogically sound at runtime.
>
> **Scope of this spec:** the redesign of the home for both Player and Builder modes, AND the runtime foundation that gates published games. The two are linked — designing a beautiful Library means nothing if the games it surfaces are pedagogically broken.

---

## 1. Problem we're solving

Two problems, one spec:

**Problem A — The galaxy is not a learner's home.** A learner told Barbara they didn't understand it. The galaxy is a curriculum-designer's view, not a kid's. Both modes need a home that fits *their* relationship to the product. Players want a place to choose games, see what they've mastered, send fix-requests to Builders. Builders want a place to see what games are needed, build them, and watch the resulting plays/ratings come in.

**Problem B — The build flow doesn't actually run the agents.** Per Audit 9 (build-flow audit, 2026-05-10), the four agents Barbara has been refining (Mr. Chesure, the Critic, Mechanic Inventor, Shortcut Adversary) live as Markdown design docs. None of them runs at runtime when a Builder publishes a game. Games ship to Players with no pedagogical check at all. The construct-validity criterion added to the Critic this morning is also documentation-only. **The Library cannot ship on top of this engine — the foundation has to come first.**

## 2. Users this serves

- **Players** (typically grade K–4, ages ~5–10): want games. Need a place to choose games + see what they've mastered + send fix-requests / ideas to Builders.
- **Builders** (typically grade 5–10, ages ~10–16): want to make things younger kids actually play. Need a place to see what games are needed + describe-or-pick a standard + get pedagogical guidance + build + see real audience reception.
- **Guides and admins**: not the focus of this redesign. They keep their existing review tooling, but the approval gate's role is now narrower (see §15).

## 3. Two environments, one product

| | Player home | Builder home |
|---|---|---|
| **Environment** | The Star Atlas Library | The Galaxy |
| **Visual flavor** | Steampunk astronomer's reading room | Pandora bioluminescent walkable space |
| **Primary content** | Cards for games the Player can play | Planets/moons showing where games are needed |
| **Mini-map / overview** | Illuminated central atlas (also THE map) | The galaxy itself is the map |
| **Default visible state** | Mastery state on each card / atlas | Build state on each moon (game count) |
| **Cards / lanterns** | Cards (poster art, Builder name, status glow trim) | No cards inline; tap a moon → see card detail in a dialog |
| **What flipping the mode pill shows** | Builder sees the Galaxy when they flip | Player sees the Library when they flip |
| **Existing investment** | New (replaces v1 lanterns concept) | Preserved (existing Pandora work continues) |

The Library is the front door for Players. The Galaxy is the front door for Builders. Either can flip to the other via the persistent top-bar `[ Build ] [ Play ]` pill.

## 4. Decisions locked in this session

| # | Decision | Rationale |
|---|---|---|
| 1 | Two distinct home environments routed by role; persistent mode pill lets either flip | Positioning §what-mgb-is-not §7: "Builder mode and Player mode diverge intentionally" |
| 2 | Player home = **The Star Atlas Library** (steampunk astronomer's reading room with cards + central atlas) | Barbara picked card-based metaphor over lanterns; The Room aesthetic for tactile feel; atlas serves as overview AND navigation |
| 3 | Builder home = **The Galaxy** (existing Pandora design) | Already built; matches Builder's "see the curriculum landscape" need |
| 4 | Cards organized by planet (sections) → moon (rows) → games (cards in row) on warm wooden shelves around the room; central atlas highlights the section/row a Player has tapped | Coherent with Galaxy's planet/moon hierarchy at the leaf level |
| 5 | Mini-map = the central atlas (same brass-illuminated star chart that drives navigation); always visible | Eliminates a separate UI; the navigation IS the overview |
| 6 | Cross-grade play: Player can play any game whose prerequisites they've mastered, regardless of grade | A 3rd-grader plays K games to fill foundational gaps; supports "readiness, not age" stance |
| 7 | "Coming soon" → "Locked" copy throughout | Barbara's call; clearer for kids |
| 8 | Player benchmark widget removed | Barbara removed it for now |
| 9 | Each card shows Builder name + DiceBear avatar | Cross-age relationship made diegetic |
| 10 | Player can send fix-request / idea to the Builder from a card | Closes the protégé feedback loop |
| 11 | Card glow trim shows state: dim (locked), warm amber (available), brighter (in progress), gold (mastered) | State by world-physics; pairs with a small icon on the card silhouette for accessibility |
| 12 | Galaxy's planet bloom = pristine → bloomed-with-life (water spreads, atmosphere, forests, lights) as moons get mastered | Barbara picked bloom over shatter — additive metaphor, not destructive |
| 13 | "Build next" suggestion: standards with no games or few games, rather than algorithmic demand | Simpler signal that aligns with supply-driven token bonus |
| 14 | Builder's own games surface in Galaxy as small markers on the moons they've authored, with orbiting plays-this-week dots | Cross-age north-star metric stays visible to Builders without dominating |
| 15 | Mastery = win 3 different games on the standard, 3 wins per game (9 total) | Win 3 different games = different scenarios = harder to fluke through |
| 16 | Mastery edge case (standard has fewer than 3 games): Player stays "in progress"; mastery unreachable until 3 games exist | Supply-driven publish bonus floods sparse standards quickly; problem self-resolves |
| 17 | K.OA.A.1 single-mode games OK if labeled "Part 1 of N" in the brief; mastery via 3 different games naturally cycles modes | Avoids partitioning K.OA.A.1 into 8 sub-standards in the graph |
| 18 | Token economy: supply-tiered publish bonus (2000 / 800 / 300 / 50 by existing-game-count); 50 per kid mastered; 100 per Builder skill mastered; plays/ratings as visible counters with no token reward | Aligns rewards with the north-star metric, not approval-gate clearance |
| 19 | Defer K.OA Compare problems to 1.OA per the Progressions Document p.9 | Audit 7 finding |
| 20 | Hard ban on visible timers at K.OA.A.5 | Research finding: timed practice harms early fluency development |
| 21 | Foundation work (4-stage agent ladder + restored Guide gate + Mr. Chesure brief screen + prompt composition fix) ships BEFORE Library/Galaxy redesign | Cannot ship a beautiful home for pedagogically broken games |
| 22 | 4-stage Haiku→Sonnet→Haiku→Sonnet agent ladder runs on every game submission | See §14 |
| 23 | Guide approval gate stays required for v1 with narrower goal: appropriateness + polish + classroom context + Builder feedback + safety | See §15 |

## 5. Architecture

### 5.1 Routes

```
/                       → role-aware redirect routes to /play (Player) or /build (Builder)
/play                   → Player home (The Star Atlas Library)
/build                  → Builder home (The Galaxy, existing route preserved)
/library/[skillId]      → existing skill-filtered Library view (cards for one moon); preserved
/dev/library/star-atlas → dev-only mock of the new Library; built before /play replaces /library
```

The mode pill writes a `preferredMode` field to the user's record and uses that to route on next visit.

### 5.2 Component layout

```
<AppShell>                         # already exists at src/app/layout.tsx
  <AmbientSoundscape />            # already mounted globally
  <MuteToggle />                   # already mounted globally
  <ModePill />                     # NEW: top-bar [ Build ] [ Play ] toggle
  <UserMenu />                     # existing
  <main>
    {role === 'builder'
      ? <GalaxyHome />             # existing galaxy, demoted to builder-only
      : <StarAtlasLibrary />}      # NEW
  </main>
</AppShell>
```

#### `<StarAtlasLibrary />`

```
<RoomShell>                                # warm steampunk reading room backdrop
  <CentralAtlas
    planets={unlockedPlanets}
    onPlanetTap={highlightSection}
    onMoonTap={highlightRow}
  />
  <ShelvesByPlanet>
    {planets.map(planet => (
      <PlanetSection planet={planet}>
        {planet.moons.map(moon => (
          <MoonRow moon={moon} status={mastery(moon)}>
            {moon.games.map(game => (
              <GameCard
                game={game}
                builder={game.builder}
                state={cardState(game, mastery)}
                onTap={() => enterGame(game)}
                onIdeaSubmit={ideaToBuilder}
              />
            ))}
          </MoonRow>
        ))}
      </PlanetSection>
    ))}
  </ShelvesByPlanet>
</RoomShell>
```

#### `<GalaxyHome />` (Builder-only, modified existing)

```
<R3FCanvas>                                # existing R3F setup
  <Stars />                                # existing
  <PlanetsLayout>
    {planets.map(planet => (
      <Planet planet={planet} bloomState={bloomFromMastery}>
        {planet.moons.map(moon => (
          <Moon
            moon={moon}
            buildState={gamesCount(moon)}      # NEW: builder mode shows game count
            myAuthoredMarkers={myGames(moon)}  # NEW: small markers for own games
            playsThisWeekDots={liveCount}      # NEW: orbiting motes for cross-age signal
            onTap={openMoonDetail}
          />
        ))}
      </Planet>
    ))}
  </PlanetsLayout>
  <BuildNextBeacon recommendedStandard={firstUnstockedStandard} />
</R3FCanvas>
```

### 5.3 Data model

- `games/{gameId}` (existing): published games. **Status field changes:** default save = `pending_review` (was `published`); guide approval flips to `published`. New optional fields: `criticVerdict`, `shortcutAdversaryVerdict`, `runtimeAgentVerdictsAt` (timestamp).
- `progress/{uid}/standards/{standardId}` (existing): mastery state. New field: `gamesWonForMastery` — array of game IDs where this Player has won 3+ times. Mastery = length(gamesWonForMastery) ≥ 3.
- `plays/{playId}` (NEW per v1, kept): one document per game-play. Drives the orbiting-dots count and Builder impact stats.
- `users/{uid}` (existing): adds `preferredMode: 'builder' | 'player' | null`.
- `feedback/{feedbackId}` (NEW): Player-to-Builder fix-requests/ideas. Holds `gameId`, `playerUid`, `builderUid`, `kind: 'fix' | 'idea'`, `text`, `createdAt`. Surfaces in the Builder's Galaxy view as a small badge on the relevant moon.

## 6. The Star Atlas Library — Player environment detail

### 6.1 The room

Warm steampunk astronomer's reading room. Reference: The Room (Fireproof Games iPad puzzle box) — brass and polished wood, leaded-glass windows with golden afternoon light, a brass clock ticking somewhere, dust motes drifting in lamplight, a fireplace flickering on one wall. Never static; always breathes when idle.

The room has three primary visual elements:

1. **The central atlas** — a large illuminated brass star chart on a brass stand at the center of the room. Shows all planets the Player has unlocked (i.e., visited) plus next-on-path planets (faded). Mastered moons have a small gold star marker; in-progress moons glow softly; locked moons are dim. **The atlas is both the navigation AND the mini-map.**
2. **Shelves around the walls** — warm wooden bookshelves organized by planet. Each shelf is one planet (a curriculum cluster); each row on a shelf is one moon (a specific standard); each card on the row is one published game.
3. **A reading nook** — a soft chair where the Player can flip between the atlas (overview) and any card they've recently tapped. Functions as the "now" surface.

### 6.2 Navigation

Two modes the Player can use, both lead to the same place:

- **Tap a planet on the central atlas** → that planet's section of shelves visibly lights up; other sections dim. The Player walks toward the lit section. Within that section, **tap a moon on the atlas** → that row highlights. Tap a card → camera zooms into the card → game loads.
- **Walk past the shelves** without using the atlas → cards visible the whole time. Tap any card directly to play.

A kid who finds the atlas confusing can ignore it entirely and just browse the shelves. A kid who wants to scan their progress at a glance has the atlas right there.

### 6.3 Card design

Each card shows:
- Game's poster art (Leonardo-generated default, Builder upload override) as the dominant visual
- Game title in Cinzel
- Builder's name + DiceBear avatar in a small brass plaque at the bottom
- Glow trim showing state: dim glass (locked), warm amber (available), brighter amber (in progress), gold-cored (mastered)
- A small icon also encodes state for accessibility (lock icon, play icon, in-progress icon, gold star)
- Hover (or long-tap on touch) → small popover with: play count, average rating, "Send a fix-request or idea" button

When a Player wants to send a fix-request or idea, the popover surfaces a short text field: "What would make this better?" Goes to `feedback/{}` and surfaces in the Builder's Galaxy as a badge on the relevant moon.

### 6.4 Cross-grade play

A 3rd-grader can play K games. The Library shows them every game whose prerequisites they've mastered, regardless of grade. A 3rd-grader who hasn't mastered K.OA.A.1 sees K.OA.A.1 cards on their shelves until they master them.

### 6.5 The "Locked" rail

Below the available-games shelves, a faded "Locked" rail shows preview cards for games whose prerequisites the Player hasn't met. Greyscale poster art, no Builder avatar, "Locked" badge. Tap → tooltip: "Master [prerequisite skill] first to play this." The atlas's central map also shows these moons faded.

## 7. The Galaxy — Builder environment detail

The existing Pandora-flavored 3D walkable galaxy continues to evolve along Plan B (per `docs/superpowers/plans/2026-05-09-plan-b-galaxy-scene-portal-planetview.md`). Additions for this spec:

### 7.1 Planet bloom (mastery state) — the existing learner's planet renderer extended

A planet's visual state is driven by **the Builder's own mastery percentage**, not Player aggregate. Pristine → cracked-with-light → bloomed-with-life as the Builder masters its moons via play. (Builders also master standards by playing — they're not exempt from being learners.)

### 7.2 Moon coloring in Builder mode

Moons in Builder mode show a **build state** (game count), not a mastery state:
- No games yet on this moon: glows brightest amber — calling for a Builder
- 1–2 games: medium glow
- 3–5 games: dim glow
- 6+ games: dark, with subtle "supply met" indicator

Tap a moon → moon-detail dialog opens with: standard text, list of existing games for it, "Build a game for this standard" button, fix-requests/ideas from Players (badge count if any).

### 7.3 Builder's own authored markers

The moons the Builder has authored a game for show a small brass marker — the Builder can see at a glance "what I've contributed." Authored markers + plays-this-week orbital dots (one dot per play this week, slowly orbiting the moon) make the cross-age north-star metric visible and motion-rich without taking over the screen.

### 7.4 "Build next" beacon

A subtle floating beacon in the camera's view points toward the highest-priority unstocked standard (a standard with zero games whose prerequisites are widely mastered = high Player demand once a game ships). The Builder can ignore the beacon and pick any standard themselves.

### 7.5 "Build my idea" surface

A small "+" beacon next to the Build-next beacon opens a free-text dialog: "Describe a game you want to make." AI matches the description to one or more candidate standards, surfaces the standards' moons, lets the Builder pick one. (This idea ranked at risk 4 in Audit 9 because LLM standard-matching can be inconsistent — once the Critic Stage 2 + 4 are running at runtime, the construct-validity check catches mismatches before publish, neutralizing the risk.)

## 8. Cross-environment shared infrastructure

- **Mode pill** — persistent top-bar `[ Build ] [ Play ]`, both modes can flip. Writes `preferredMode` to user record.
- **Audio shell** — `<AmbientSoundscape />` is global. Library and Galaxy each have a distinct ambient bed (Library: brass clock ticking, fireplace crackle, distant wind; Galaxy: Pandora chime + flute + low hum). Mute toggle persists.
- **`<MuteToggle />`** — global, bottom-right.
- **Loading transitions** — diegetic per `creative-visual-quality-standards`: fog clears in the Library; world materializes in the Galaxy. No spinners.

## 9. Mastery progression

A standard is **mastered** when the learner has won 3 different games on it, with 3 wins per game (9 wins total). 3 different games = 3 different scenarios = much harder to fluke through.

**Edge case (standard has fewer than 3 published games):** Player stays in `in_progress` with a friendly note: "More games coming — you can still play what's here." The supply-driven publish bonus (see §11) floods sparse standards quickly so this self-resolves.

**Decay (deferred):** Audit 5 recommended a `mastered_recent` → `mastered_dormant` decay model with retrieval-driven re-ignition. Defer to a v1.1 follow-up; v1 keeps mastery monotonic.

## 10. Cross-age north-star surfacing

The north-star metric is *cross-age plays per week*. Both environments make it visible:

- **In the Library (Player view):** every card shows the Builder's name + avatar. Hover popover shows play count + average rating. Player can send a fix-request / idea to the Builder.
- **In the Galaxy (Builder view):** the Builder's authored moons have an orbiting ring of small glowing dots — one dot per play of their game this week. The constellation of dots = their reach. Hover any moon → glass plaque with exact numbers (plays, ratings, kids who learned).

Same metric, two embodiments. Players see who built; Builders see who played.

## 11. Token economy

| Event | Tokens |
|---|---|
| First game published on a standard with **zero** existing games | **2000** |
| Game published on a standard with **1–2** existing games | **800** |
| Game published on a standard with **3–5** existing games | **300** |
| Game published on a standard with **6+** existing games | **50** |
| Per kid who masters the skill the Builder's game taught | **+50** |
| Per skill the Builder themselves masters | **+100** |
| Plays / ratings / kids who played | **visible counters only, no tokens** |

Pacing: in v1 with no Players, the supply-tiered publish bonus floods empty standards. As Players arrive and games accumulate per standard, the marginal publish bonus drops and per-kid-mastered becomes the dominant earnable. Audit 4 supports this transition; it's the inverse of the original 2000-flat / 10-per-play structure that would have rewarded approval-gate gaming.

## 12. Visual design

### 12.1 The Star Atlas Library — palette + materials

Reference: The Room (iPad puzzle game) + igloo.inc click-to-zoom-into-portal navigation + Active Theory cinematic drift.

- Palette: warm brass (`#a8804b`), oxidized copper (`#2e8a7f`), aged leather (`#3a2e22`), ivory parchment (`#f0e6d2`), gas-lamp amber (`#f0a04b`) — straight from `world-flavors.md` §1 Steampunk
- Lighting: HDRI **interior workshop** (Polyhaven `lythwood_lounge` or `comfortable_workshop`), low-angle warm key light, dim cool teal fill, soft long shadows
- Materials: brass with anisotropy + roughness map, weathered leather, woodgrain on shelves, frosted glass on the central atlas dome, polished stone for the floor
- Sound: low gear-tick clockwork, distant steam hiss, occasional bellows breath, brass click on every interactive element

### 12.2 The Galaxy — preserved Pandora design

No changes from existing Plan B. Indigo night-forest, bioluminescent flora reactive to touch, twin-moon glow, drifting pollen motes (per Barbara's note — slowed to "no wind in space" pacing).

### 12.3 Asset roster — UPDATED for cards-not-lanterns

**Library (NEW assets):**
- Room shell: prototype both [Light-Map scene](https://skfb.ly/ECOx) (450 tris, simple) and [Cave of Eternity](https://skfb.ly/6ZvCM) (atmospheric); Barbara picks visually
- Central atlas: Leonardo-generated brass star chart on a brass stand (prompt #11 in `docs/assets/leonardo-prompts.md` — to be added)
- Shelves: PBR wood + brass GLB (Sketchfab CC-BY search; not yet sourced)
- Game card frames: Leonardo-generated brass card frames (prompt #12)
- Hearth: [Campfire Wood](https://skfb.ly/6QYoY) by digrafstudio (preserved)
- Hallway lamps: [Light Pole](https://skfb.ly/6UW7Q) by Arkikon (preserved)
- Mode-switch lever: [Steampunk Solar Transit](https://skfb.ly/6WGqX) by nika.tendetnik (preserved)
- Compass: [Compass low-poly](https://sketchfab.com/3d-models/compass-low-poly-game-asset-a2572112e61048ad81845af34f8ee90b) by jsabbott (preserved)

**Library (DROPPED from v1 — lanterns era):**
- All five lantern variants (Nacovya, DLM, Emma-Lie Kamping, Miszla Japanese, joe-z13)
- Magic portal (no longer a portal — Library/Galaxy are separate environments)

**Galaxy (preserved from v1):**
- [Various Planets](https://skfb.ly/o7F9p) by Feivelyn (variety)
- [Surreal Planet](https://skfb.ly/pyYr6) by golukumar (hero)
- [Lava Planet](https://sketchfab.com/3d-models/lava-planet-d5b28875e7b6452e8236d538547b2a68) by rodrigofitas.lp
- [Sci-fi City](https://skfb.ly/pI9No) by Jungle Jim
- [Black hole](https://sketchfab.com/3d-models/black-hole-with-accretion-disk-1d0a5cb6bb2a43f4b2e7719c88cec6b2) by RTXlover (endgame)
- [Galaxy "Need some space?"](https://skfb.ly/6QV7A) (far backdrop)
- Cell-Fractured pristine planet → bloom states (one-time art task)

**Ceremonies (preserved):**
- [Angel Wings](https://sketchfab.com/3d-models/angel-wings-917b4019a1614d179e70cda895fd3f16) by Boooooop (Builder first publish)
- [Lowpoly Steampunk Train](https://sketchfab.com/3d-models/lowpoly-steampunk-train-427574ea7ccf4b879fa1b489799c30b8) by kehosworld (Player cluster mastery)

**Leonardo prompts to be updated:** drop the lantern prompts (#1–3) and the Library room/portal prompts (#4–5) tied to the lantern concept; add prompts for: brass star atlas, brass card frames, planet bloom states, mini-map planet thumbnails. `docs/assets/leonardo-prompts.md` to be revised.

## 13. The 4-stage agent runtime ladder

Every game submission runs through this ladder before reaching the Guide approval queue. Each stage either passes (proceed) or fails (Builder sees specific reasons; revises). Most failures get caught early at the cheap Haiku stages.

| Stage | Agent | Model | Purpose | ~Cost / check |
|---|---|---|---|---|
| 1 | **Critic — Cheap Filter** | Haiku 4.5 | 4-criterion check on the HTML; catches obvious failures (visible answer reveals, popup quizzes, missing scenario, click-anywhere-to-win) | $0.001 |
| 2 | **Critic — Deep Inspection** | Sonnet 4.6 | Same 4 criteria, deeper reasoning. Catches subtler issues: construct validity (game claims to teach addition but actually tests counting), fake-intrinsic patterns, decorative scenarios | $0.025 |
| 3 | **Shortcut Adversary — Cheap Probe** | Haiku 4.5 | Simulates obvious shortcuts (click-everything, click-the-biggest-button, ignore-the-math). If win without math → fail | $0.005 |
| 4 | **Shortcut Adversary — Deep Probe** | Sonnet 4.6 | Simulates creative shortcuts: visual matching, UI-pattern exploitation, reading-the-answer-from-the-prompt | $0.075 |

**Per-game cost** (assuming 3 revisions): roughly **$0.05–$0.20 per published game.** **At fellowship-pilot scale** (5000 published games × 4 stages each): **~$250–$1000 total.**

**Pass/Fail UX in the Builder workspace:**
- After generation, "Checking your game…" appears with stage indicators (4 brass dial markers).
- Each stage that passes: dial clicks to green.
- Stage that fails: dial clicks to amber + a card slides up showing which criterion failed and a specific revision suggestion in plain English. ("Your game lets the player click randomly to win — try making the math part of the navigation, like having the character carry a counter that ticks up as they collect items.")
- Builder revises and re-submits → ladder runs again from Stage 1.

**Mr. Chesure** stays as an **informational** agent (not in the ladder). He runs once when the Builder picks a standard, producing the design brief. He doesn't gate publication.

**Mechanic Inventor** stays as an **on-demand consult** (Builder asks "what mechanics teach K.OA.A.3?" and he answers). Not in the ladder.

## 14. Guide approval gate — narrowed goal

Now that the agents run automatically, the Guide gate is no longer the pedagogical-soundness check. Its goal is the **human-only judgment**:

1. **Appropriateness for school context** — content suitability, cultural sensitivity, no inappropriate memes
2. **Quality and polish** — visual bugs, broken interactions, ugly typography, confusing copy
3. **Classroom-context alignment** — guide knows what their class is currently working on; flags off-topic
4. **Builder development feedback** — the approval is also a teaching moment; the guide writes a comment that pushes the Builder's growth
5. **Sensitive content / safety** — names, private details, anything the AI can't catch as inappropriate

The pedagogical-soundness check is delegated to Stages 1–4 of the agent ladder. The guide gate is the human-only finalization.

**Tunable for later:** in mature deployments (track record showing the agent stack catches what it claims), the guide gate could be relaxed to random sampling or to first-time-Builder-only review. Not for v1.

## 15. Build path — Foundation first, then Library

### 15.1 Phase 1 — Foundation (BLOCKING; ships before Phase 2)

These five fixes restore the build flow's pedagogical integrity. They're the prerequisite for everything else.

1. **Restore the Guide approval gate** (smallest fix). Default save status flips from `published` to `pending_review`. Guide approve endpoint flips to `published`. Players never see a game until a guide signs off.
2. **Fix the prompt-vs-standard mismatch.** Generation prompt composes from the standard's knowledge file (currently the K.OA file is the only thorough one; stub minimum knowledge for non-K.OA standards). Replace the hard-coded "K.OA.A.1 ADDITION ONLY" in `generate-gemini/route.ts`.
3. **Wire Stage 1 (Haiku Critic) into the save flow.** Generate → Haiku Critic → if FAIL, show Builder which criterion failed. If PASS, save with `pending_review`. Closes the biggest hole.
4. **Wire Stages 2–4 (Sonnet Critic, Haiku Shortcut Adversary, Sonnet Shortcut Adversary).** Each stage on top of the previous. UI shows the dial-by-dial progression.
5. **Build the Mr. Chesure brief screen.** Between picking a standard and starting to build, Builder sees a real design brief rendered from the standard's knowledge file: standard text, CPA progression, top kid misconceptions, one worked example.

### 15.2 Phase 2 — Library/Galaxy redesign

After Phase 1 ships and games can be guaranteed pedagogically sound at runtime:

1. Build `/dev/library/star-atlas` (low-tier 2D first; Tailwind cards over a static painted-room backdrop, central atlas as a flat brass illustration with click regions). Pause for Barbara's visual review.
2. Build the high-tier 3D walkable Library version behind a perf-tier flag.
3. Wire the new `<ModePill />` shell.
4. Update the Galaxy's moon-color logic for Builder mode (game count, not mastery).
5. Add Builder-authored markers + plays-this-week orbital dots to the Galaxy.
6. Wire the `feedback/{}` collection for Player→Builder fix-requests.
7. Update the planet renderer for bloom states (pristine → cracked-with-light → bloomed-with-life shader pass).

### 15.3 Phase 3 — Production data wiring

- Replace mock content with real Firestore reads
- Wire `plays/{}` writes
- Compute impact stats from real plays
- Compute orbiting-dots count per moon from real plays-this-week

## 16. Performance budget

Per `creative-visual-quality-standards` MGB-Chromebook clause:
- **Library low-tier route** (default): ≤ 3 MB total bundle (room backdrop JPEG + card poster images + ambient bed audio). 60 fps target.
- **Library high-tier route** (opt-up): ≤ 12 MB total bundle (room GLB + atlas GLB + card frames + HDRI + audio). 60 fps target on a 2020-era laptop.
- **Galaxy**: existing Plan B budget.
- **Asset budget per object**: card frames as flat sprites (no GLB), shelves and atlas as low-poly GLBs (under 5k tris each).

## 17. Accessibility

Non-negotiables from `creative-visual-quality-standards`:
- `prefers-reduced-motion` honored — atlas-tap zoom becomes crossfade; orbital dots become static count badges; idle-breathing room becomes still
- Keyboard navigation — every card tab-focusable; Enter activates; visible focus ring uses brass amber
- Mute toggle — already global
- WCAG AA contrast — Builder name plaque text (4.5:1)
- State conveyed by **silhouette accent** (lock icon, play icon, in-progress icon, gold star) in addition to glow color — never color alone
- The atlas surface has alt-text descriptions of each planet/moon for screen readers

## 18. Open questions

1. **Library room shell — Light-Map vs. Cave of Eternity.** Locked at "prototype both"; both go up in `/dev/library/star-atlas` for visual selection.
2. **Card asset source.** Leonardo prompts for cards + atlas to be drafted. Barbara generates and saves to `public/assets/library/`.
3. **Galaxy "Build my idea" matcher.** AI standard-matching has accuracy variance (Audit 9 risk-rank 4). Once Stages 2 + 4 run at runtime, construct validity catches mismatches before publish — neutralizing the risk. Confirm OK to ship.
4. **Decay model** for mastery — deferred to v1.1 follow-up.

## 19. After approval

Per the brainstorming skill flow:
1. Barbara reviews this v2 spec and either approves or requests changes
2. On approval, **Phase 1 (Foundation)** begins immediately — the build flow has to be sound before anything else ships
3. After Phase 1 ships, invoke `writing-plans` skill for Phase 2 (Library + Galaxy redesign)
4. `executing-plans` + `subagent-driven-development` for the build
5. Pause for Barbara's visual review at first viewable moment of `/dev/library/star-atlas`
6. Code-reviewer (Opus, both passes) at plan-end
7. Optional `/ultrareview` before merging to main since this is user-facing

---

## Appendix A — Inline self-review

- ✅ No "TBD" or "TODO" remaining (open questions §18 are scoped, not gaps)
- ✅ Internal consistency: §3 decisions match §5 architecture and §12 visuals
- ✅ Scope check: this is a single-spec-sized change but across two phases; Phase 1 is the prerequisite, Phase 2 is the Library/Galaxy work
- ✅ Ambiguity: Library "Locked" gating clarified; cross-grade play clarified; mode-pill behavior clarified (writes preferredMode, both modes can flip)
- ✅ v1 lanterns concept and Magic Portal explicitly dropped from asset roster

## Appendix B — what was dropped from v1

For history. v1 of this spec (committed earlier today as part of `480a9c9`) proposed:
- Hovering brass-and-glass lanterns as game cards in a 3D walkable Library
- A magic portal between Library and Galaxy as the navigation bridge
- Same world for both Player and Builder modes, with lighting differences for each role
- A Steampunk + Pandora fully-hybrid world

v2 keeps the steampunk Library aesthetic but as a **separate environment** from the Galaxy, with cards instead of lanterns and the central atlas as the navigation primitive. The Galaxy stays Pandora-flavored and becomes Builder-only. Cleaner metaphor; clearer for kids; easier to ship at low-tier perf.
