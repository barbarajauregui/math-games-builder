# Math Games Builder — Product Positioning

*Last updated: May 10, 2026 · Owner: Barbara · Status: v1.2*

> This document is the north star. Every product, design, agent, and pedagogical decision should point back to something on this page. If a new feature doesn't serve one of the beliefs, users, or loops below, cut it.

> **Changelog v1.2 (2026-05-10, evening):** Player and Builder homes split into two distinct environments. Player home = **The Star Atlas Library** (steampunk astronomer's reading room with cards on shelves and a central illuminated star atlas as both navigation and overview). Builder home = **The Galaxy** (existing Pandora 3D walkable space, demoted from default for everyone to Builder-only). Each role flips into the other via a persistent top-bar mode pill. Mastery state visualization changed from "planet-shatter" (felt aggressive) to "planet bloom with life" (additive: water spreads, atmosphere appears, forests grow as moons get mastered). Player benchmark widget removed (was added in v1.1; Barbara reverted). "Coming soon" copy changed to "Locked." Cross-grade play allowed (a 3rd-grader can play K games to fill foundational gaps). Mastery rule formalized: win 3 different games on the standard, 3 wins per game (9 wins total). Token economy rebalanced: supply-tiered publish bonus (2000 → 50 by existing-game-count), +50 per kid mastered, +100 per Builder skill mastered, plays/ratings as visible counters with no token reward. **A 4-stage Haiku→Sonnet→Haiku→Sonnet runtime agent ladder** now runs the Critic + Shortcut Adversary on every game submission before save (Audit 9 found the agents weren't running at runtime). Guide approval gate role narrowed to human-only judgment (appropriateness + polish + classroom context + Builder feedback + safety); pedagogical-soundness is now the agent ladder's job. Foundation work (restoring the Guide gate, fixing the prompt-vs-standard mismatch, wiring the agent ladder, building Mr. Chesure's brief screen) ships **before** the Library/Galaxy redesign. The lanterns concept from v1.1 was dropped — too many overlapping metaphors (lantern + planet + moon + game). Cards on shelves replaced lanterns.

> **Changelog v1.1 (2026-05-10, morning):** Superseded by v1.2.

---

## The one-sentence pitch

**Math Games Builder is an app where older kids build math games that younger kids play — both learn, and both have fun.**

## The longer version

Middle-school and early high-school learners (grades 5–10) often have foundational math gaps but lack any motivating reason to revisit the basics. Meanwhile, elementary learners (grades K–4) need lots of varied, engaging practice on core concepts but are poorly served by drill-based apps.

Math Games Builder solves both problems with a single loop: **older learners build math games targeting specific Common Core standards, and younger learners play them.** In building, older learners are forced to deeply understand the math they're teaching — known in educational psychology as the **protégé effect**, one of the most robust findings in the field. In playing, younger learners get near-infinite variety of peer-made games, rated and ranked by their peers.

The app is not a chatbot, not a worksheet, and not a lecture. It's a **creative studio with a real audience.**

Players and Builders see different homes:

- **Players land in The Star Atlas Library** — a warm steampunk astronomer's reading room. Cards on wooden shelves around the room are the games, organized by planet (math cluster) and moon (specific standard). A central illuminated brass star atlas serves as both navigation and overview — touch a planet on the atlas and the corresponding shelf section lights up. The atlas is also the mini-map: mastered moons show small gold stars, locked moons are dim.
- **Builders land in The Galaxy** — the existing Pandora bioluminescent walkable space. Moons show how many games each standard has — the brightest-glowing moons are the ones calling for a Builder. The Builder's own authored moons show small markers; live plays-this-week appear as orbiting dots around those markers.

Either role can flip into the other view via a persistent top-bar mode pill. Players who want to peek at Build mode can; Builders who want to play a peer's game for fun don't have to dig.

Mastery is visible. As a learner masters all the moons in a math standards cluster, the corresponding planet in the galaxy progressively **blooms with life** — water spreads across the surface, atmosphere appears, forests grow, lights appear at night. At 100% the planet is a full living world. The pristine planet was empty; mastery brings it to life. (No destruction; only completion.)

---

## Core beliefs (non-negotiable)

These are the principles every feature, every game, and every agent must uphold.

1. **The learner does the math — never the system.** No running totals, no auto-counted piles, no "the system will do the math for you." The learner's hand, eye, or voice performs the mathematical operation.

2. **Math IS the gameplay.** If you can remove the math and the game still works, the math is decoration. Every learning game must pass the Discovery test (a learner who doesn't know the math can learn it by playing) and the Self-Revealing Truth test (correctness is shown by game-world physics, not by a popup).

3. **Kids teaching kids is the teaching mechanism.** We don't lecture. We don't chatbot. We give older kids the tools to build, and younger kids the tools to play and rate. The feedback loop between them is the lesson.

4. **Build first, learn as needed.** Motivation flows from "I want to make this" to "I need to understand this to make it work." We never lecture before building. Any pedagogical framing exists as a *design brief for the builder*, not a lesson for the learner.

5. **Real audiences create real learning.** A game that no one plays teaches no one. Every game built must be playable by — and surfaced to — a younger learner who needs that specific standard. No orphan games.

6. **Adapt proven pedagogy — don't invent it.** Common Core Progressions Documents (for what), Open Up Resources / Math Learning Center (for how). We ADAPT; we don't INVENT pedagogy. Creative invention goes into mechanics and themes, not into learning science.

---

## Who Math Games Builder is for

Two users. One product. Different modes.

### The Builder (primary user, grades 5–10, ages ~10–16)

**What they want:** To make something real that other people play. To feel like a creator. To earn recognition and tokens. To have fun.

**What they get:** A builder studio that lets them pick a math standard (their grade or lower), see what a good game for that standard must do, and build one — via scenario templates, game-style templates (Sum Jumper, Wall Builder, etc.), custom HTML paste, or a vibe-coder toolbar. Their game gets reviewed by agents, approved, and published to younger learners. They see plays, ratings, and comments come in.

**Why they come back:** Their games are being played. New standards unlock. Their impact stats grow. They can outrank classmates on the builder leaderboard. Building is genuinely fun because it's scenario-rich and creative.

**What we hide from them:** The 509-standard graph. Pedagogical frameworks by name. Agent internal workings. The "designer's view" of the curriculum.

**Builder home screen:** The Galaxy. Moons show how many games each standard has — brightest-glowing moons are the ones calling for a Builder. The Builder's authored moons show small markers; live plays-this-week appear as orbiting dots around those markers. A floating "Build next" beacon points toward the highest-priority unstocked standard (the Builder can ignore it and pick anything). A "+" beacon next to it lets the Builder describe a game idea in plain words — AI matches it to candidate standards. When the Builder picks a standard (either path), Mr. Chesure's design brief screen renders before the build tools open.

### The Player (secondary user, grades K–4, ages ~5–10)

**What they want:** To play games. To earn things. To feel good.

**What they get:** A library of grade-appropriate games built by older kids at their own school (and eventually other schools). Tap, play, rate with emoji or stars, earn tokens, play another. Each game card shows the older kid's name and avatar — the cross-age relationship is visible, not abstract.

**Why they come back:** New games appear constantly, built by kids they know or kids at other schools. Each game feels different because older builders have real creative freedom. Tokens accumulate. The Player can send a "fix-request" or "idea" directly to a Builder when something feels off or could be better — closing the cross-age feedback loop.

**What we hide from them:** Builder tools (until they age into them). The 3D Galaxy view (Builder-only). Anything that looks like "school."

**Player home screen:** The Star Atlas Library. Cards on warm wooden shelves around the room are the games, organized by planet (math cluster) and moon (specific standard). A central illuminated brass star atlas serves as overview AND navigation — touch a planet on the atlas, the corresponding shelf section lights up. Mastered moons show small gold stars on the atlas; locked moons are dim. Cards visible on shelves have a glow trim showing state: dim (locked), warm amber (available), brighter (in progress), gold-cored (mastered). Each card shows the older kid's name and avatar — the cross-age relationship is visible, not abstract. Cross-grade play allowed: a 3rd-grader who hasn't mastered K.OA.A.1 sees K cards on their shelves until they do. Locked games appear in a faded rail at the bottom labeled "Locked" with a tooltip explaining what to master first.

### Shared infrastructure (for both)

- Single login, single progress, single token wallet
- A learner becomes a Builder when they reach grade 5 (or when their teacher promotes them)
- Both see a home screen that fits their mode, not a universal home

### NOT our primary user (yet)

- **Self-directed adult learners** — not our market
- **Kids learning math without teacher/school context** — we're school-first
- **High schoolers working on advanced math** — future expansion, not v1
- **Homeschoolers** — potentially great fit but not the first go-to-market

---

## The core loop

The whole app is this loop running at different speeds.

```
    [OLDER BUILDER picks a standard]
                ↓
    [Sees spec: what a good game must do]
                ↓
    [Builds game using scenarios/templates/code]
                ↓
    [Agents critique → Builder revises]
                ↓
    [Guide approves → Game publishes]
                ↓
    [YOUNGER PLAYER discovers game in library]
                ↓
    [Plays, learns, rates, earns tokens]
                ↓
    [Rating flows back to Builder's dashboard]
                ↓
    [Builder sees impact → builds more / builds better]
                ↓
         [LOOP REPEATS]
```

**The loop's strength is the feedback.** Every play, every rating, every "I got stuck on round 3" moment is data that shapes the builder's next game. This is the engine of quality.

---

## What Math Games Builder is NOT

Cutting with precision is how we stay focused.

- ❌ **Not a replacement for math class.** We supplement classroom instruction; we don't replace it.
- ❌ **Not a chatbot.** Khanmigo taught the industry that kids reject AI tutors. We never put a chatbot between a learner and their task.
- ❌ **Not a drill app.** Fluency practice exists post-mastery as an optional unlock (Rapid Fire games), but it's not the core product.
- ❌ **Not Scratch for math.** We don't teach programming. We give builders powerful-enough tools to make real games, but the goal is math learning, not CS education.
- ❌ **Not comprehensive K-12 coverage on day one.** We ship one standard at a time, done well, with cross-age evidence it works.
- ❌ **Not a self-study app.** It depends on a school, a teacher, and a multi-age community. Don't optimize for solo use.
- ❌ **Not a universal UI.** Builder mode and Player mode diverge intentionally. We do not try to serve both with one interface.

---

## What the moat is

Math Games Builder has three layers of defensibility. Any one is valuable; together they are rare.

1. **The protégé loop.** No existing edtech product operationalizes learning-by-teaching at scale. Khan, Prodigy, DreamBox, DragonBox — all are single-user self-learning apps. Building the cross-age builder-player loop requires a school community and it requires products for two age ranges that talk to each other. That's a system, not a feature. Hard to copy.

2. **The data.** Every game built is a data point on *how a kid translates a math concept into a scenario and mechanic*. Every play is a data point on *how a younger kid interprets that translation*. This dataset — translation + reception pairs across thousands of kids and 509 standards — is proprietary, grows automatically, and is more useful for future AI teaching systems than any answer-correctness dataset in existence.

3. **The school network effect.** A Math Games Builder school has kids building games for its own K-2 kids. When a second school joins, the games built at school A work for kids at school B. Libraries compound. Cross-school leaderboards become possible. Kids in small schools get access to a universe of peer-made content they could never build alone.

---

## Success metrics

What we watch, in order of importance.

### North star
**Number of cross-age plays per week** — a younger kid playing an older kid's game. This is the whole product in one number.

### Supporting metrics
- Games published per week (builder supply)
- Plays per game (player demand × game quality)
- Agreement rate between agent approval and guide approval (agent quality)
- Builder retention week 2 / week 4 (is the impact loop working?)
- Player return rate (does the library stay fresh?)
- % of standards with ≥ 3 quality games (coverage × quality)
- Learner-reported "I understood this better after building/playing" (qualitative)

### Vanity metrics we ignore
- Raw sign-ups
- Total tokens issued
- Standards in the catalog
- Games in the library (if they're not being played)
- Screen time (more is not better)

---

## Near-term (next 30 days)

1. **One standard, done perfectly, across ages.** Pick a bridge standard (e.g. 3.OA.A.1 — multiplication as equal groups). 4 builders from grade 5–7 build games. 6 players from grade 3 play them. Measure.
2. **Inversion of the home screens.** Library becomes home. Galaxy becomes optional Explore.
3. **Impact dashboard for builders.** Replace "skills demonstrated vs classmates" with "games you've built / plays / ratings / kids who learned."
4. **Mr. Chesure + Mechanic Inventor + Shortcut Adversary.** Three agents, one domain knowledge file (3.OA), before scaling.

---

## How to use this document

- **Every product decision:** "Does this serve a belief, user, or loop above?" If no, cut.
- **Every agent:** Reads this document as part of its system prompt. Its job is to uphold these principles.
- **Every blueprint update:** Must be consistent with this doc. If they diverge, this doc wins; update the blueprint.
- **Every pilot:** Measures something in the success-metrics list. If not, redesign the pilot.
- **Every investor / fellowship conversation:** Start here.

---

*Locked until superseded. Next review: after the cross-age pilot concludes.*
