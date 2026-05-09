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
- **Repo:** https://github.com/mrdavola/option-c
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
- `src/data/standards.json` — Math standards graph (nodes + edges, 466 standards)
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

- **Verified games:** 2 of 466 standards (K.OA.A.1 approved, K.OA.A.3 awaiting sign-off)
- **All other 464 standards:** NO verified game. Legacy games were unmapped April 16.
- We ship **one standard at a time, done perfectly**, via the Learning Contract workflow.

---

## Session Notes

<!-- Update this section at the end of each work session -->

**Current session (2026-04-18) — Product positioning locked:**

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
