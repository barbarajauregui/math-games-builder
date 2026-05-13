# K.OA.A.1 Build Flow — Implementation Spec v3

*Date: 2026-05-12 · Owner: Barbara · Status: LOCKED · Supersedes: `2026-05-11-koa-a-1-build-flow.md` (v2)*

> **What changed from v2 → v3:**
> 1. **Two-level architecture.** Level 1 = pre-made games (no AI, no submit, no Guide review). Level 2 = paste-HTML with vibe-coding prompt scaffold. The old 5-step mad-lib flow is dropped.
> 2. **Mechanic-first.** The Builder picks a Game Mechanic and a Scenario together on one screen, not in two steps.
> 3. **Lesson lives at the bottom of the game while the Builder plays it.** No separate Mr. Chesure brief screen.
> 4. **Mastery for the Builder** = play one game per available Game Mechanic for the standard.
> 5. **Equity Reviewer removed.** The 4-stage ladder is now Haiku Critic → Haiku Adversary → Sonnet Critic → Sonnet Adversary. The three equity shared-knowledge files stay (Critic and Adversary still consult them).
> 6. **"Engine" → "Game Mechanic" everywhere user-facing and in agent prompts** (per ERIC literature review 2026-05-12 — Hicks 2016, Szilas 2025, Saltzman 2022, Horstman 2013, Wainess 2011, Edusei 2022, Habgood & Ainsworth 2011 all use "mechanic"). "Engine" reserved for software-framework meaning if it ever applies.
> 7. **"Leaves" dropped.** Common Core language: 509 **standards** across 93 **clusters**. No tree-data jargon in user-facing copy or docs.
> 8. **`coverageGap` UX = honest banner.** When a standard has fewer PRIMARY mechanics than usual, surface a small one-liner: *"Only N game mechanics for this standard — that's the most this kind of math allows."*
> 9. **Builder-must-win-their-own-game gate** restored — at **Level 2** (not Level 1, since Level 1 games are pre-made). The Builder plays the game they pasted; if `game_win` postMessage never fires, the save is blocked.
> 10. **Critic explicitly checks "does the winning action exercise the math?"** (per Hicks et al. 2016 — kids authoring content often break the core mechanic without realizing).

> **Required reading before implementation:**
> - `docs/product-positioning.md` (north star)
> - `docs/agents/shared-knowledge/INDEX.md` (pedagogy index)
> - `docs/agents/chesure-knowledge/k-oa-progressions.md` (K.OA pedagogical authority)
> - `src/data/standard-mechanic-map.json` (the standard ↔ game-mechanic map; 49 standards mapped as of 2026-05-12)
> - `docs/audit/15-external-review-2026-05-11.md` (External Reviewer's 10 findings — calibration baseline)

---

## §1 — At-a-glance

Math Games Builder ships **two paths** for a Builder working on K.OA.A.1:

- **Level 1: Play the canon.** The Builder picks one of three Game Mechanics for K.OA.A.1, picks a Scenario inside that mechanic, and plays a pre-made game. A small lesson panel sits at the bottom of the game while they play. No AI. No save. No Guide approval. The point: the Builder internalizes the mechanic by playing it.
- **Level 2: Build your own.** Once the Builder has played all 3 mechanics at Level 1, Level 2 unlocks. The Builder picks one mechanic, gets a generated vibe-coding prompt scaffold, adds their own description, and pastes the AI-generated HTML back into MGB. Three gates fire: prompt review (blocks bad prompts), Builder-must-win playtest (blocks broken games), and HTML review (short feedback bullets). On all-pass, the game saves as `pending_review` for the Guide.

This shape repeats for every standard. K.OA.A.1 is the first to ship.

---

## §2 — Two-level architecture

```
[Pick K.OA.A.1] ──▶ Level 1 hub (3 Game Mechanics)
                         │
                         ├─ Mechanic A ──▶ pick Scenario ──▶ play pre-made game w/ lesson
                         ├─ Mechanic B ──▶ pick Scenario ──▶ play pre-made game w/ lesson
                         └─ Mechanic C ──▶ pick Scenario ──▶ play pre-made game w/ lesson
                         │
                         ▼ (after all 3 played)
                   [Level 2 unlocks]
                         │
                         ▼
              [Pick one mechanic to build for]
                         │
                         ▼
       [Vibe-coding prompt scaffold + Builder description]
                         │
                         ▼   ◀── Gate A: prompt review (BLOCKS)
              [Paste HTML from external AI]
                         │
                         ▼   ◀── Gate B: Builder must win their own game
                [HTML review — short bullets]
                         │
                         ▼   ◀── Gate C: HTML review (BLOCKS on hard fail)
                   [Save as pending_review]
                         │
                         ▼
                  [Guide approval — human]
                         │
                         ▼
                     [Published]
```

**Level 1 has no save and no AI calls.** The pre-made games are static assets. Cost = zero.

**Level 2 fires the AI ladder.** Cost ~$0.05–$0.20 per published game. Caught-bad-prompt cost ~$0.002 (Haiku-only review).

---

## §3 — Level 1 screen: combined Game Mechanic + Scenario picker

### Layout

One screen. Three rows, one row per Game Mechanic available for K.OA.A.1. Each row shows:

- **Game Mechanic title + one-line description** on the left (e.g., *"Counting Collection — tap or drag each item to count it."*)
- **Scenario cards** in a horizontal scroll on the right. Each card = compact title + one-line description (e.g., *"Coin Jar: drop coins into the jar."*).

No mechanic preview animations in v1 (deferred — see §14). No images in Level 1 cards.

A small banner above the rows reads:

> *Play one game in each Game Mechanic. After all 3, you can build your own.*

If `coverageGap` is set for the standard (not the case for K.OA.A.1, but the UI must handle it for other standards), the banner reads:

> *Only N game mechanics for this standard — that's the most this kind of math allows.*

### K.OA.A.1 game mechanics (PRIMARY only, per `standard-mechanic-map.json`)

| # | Game Mechanic | One-line description |
|---|---|---|
| 1 | **Counting Collection** | Tap or drag each item to count it. |
| 2 | **Group-Then-Combine** | Make two groups, then count them together. |
| 3 | **Take-From** | Start with a group, remove some, count what's left. |

Bar Model is SECONDARY for K.OA.A.1 (de Koning et al. 2022) and does not appear at Level 1.

### Scenarios per mechanic (initial set)

Each mechanic ships with **3 Scenarios** at Level 1 launch — 9 pre-made Level 1 games for K.OA.A.1 total.

- **Counting Collection:** Coin Jar · Fish Tank · Snack Plate
- **Group-Then-Combine:** Bakery · School Bus · Classroom
- **Take-From:** Toy Store · Birthday Party · Farm

Scenarios cleared by Mr. Chesure knowledge file `k-oa-progressions.md`. Coin Jar uses generalized items (coins / beads / pebbles / buttons) per Audit 14.

### Data location

`src/data/scenarios/k-oa-a-1.ts` — rewritten. Each Scenario entry is:

```ts
{
  id: "coin-jar",
  mechanicId: "counting-collection",
  title: "Coin Jar",
  oneLineDescription: "Drop coins into the jar.",
  preMadeGameUrl: "/games/k-oa-a-1/counting-collection/coin-jar.html",
  lessonText: string,  // see §4
}
```

The old `StoryTemplate` / `BlankKind` / `mad-lib` types from v2 are deleted.

---

## §4 — Level 1 play: game on top, lesson at bottom

### Layout

When a Builder picks a Scenario, they land on a play screen:

- **Top 70%:** the pre-made game in an iframe. Full-bleed.
- **Bottom 30%:** a fixed lesson panel. Plain language. ≤ 80 words. Specific to this standard + mechanic + scenario.

The lesson is **always visible while the Builder plays** — not behind a button, not on a separate screen. Per the External Reviewer (Audit 15, finding 7) on fully-applied teaching: the kid sees the math language while doing the action.

### Lesson content (example — Coin Jar / Counting Collection / K.OA.A.1)

> **What you're showing:** Adding means putting groups together. When you drop 3 coins into a jar that already has 4 coins, you have 7 coins.
>
> **Watch for:** The total comes from counting **all** of them, not just the new ones.
>
> **Words to use in your own game:** *altogether · in all · how many now.*

Lesson text lives in `src/data/scenarios/k-oa-a-1.ts` per Scenario. Authored from `k-oa-progressions.md`.

### Win + advance

When the pre-made game fires `game_win`, the lesson panel adds a check mark and a "Next Scenario" button surfaces. The Builder can switch Scenarios or Mechanics from the panel header.

### Telemetry (PostHog, COPPA-clean)

- `level_1.scenario_started { standard, mechanic, scenario, durationMs }`
- `level_1.scenario_won { standard, mechanic, scenario, durationMs }`
- `level_1.mechanic_complete { standard, mechanic, scenariosPlayed }`

---

## §5 — Level 1 mastery for the Builder

The Builder unlocks Level 2 when they have fired `game_win` for **at least one Scenario in each PRIMARY Game Mechanic for the standard**.

- K.OA.A.1: 3 mechanics → 3 wins required.
- Standards with `coverageGap` of 2 mechanics: 2 wins required.

When all mechanic-wins are recorded, a Level 2 panel surfaces below the mechanic rows: *"Ready to build your own."*

PostHog event: `builder.level_2_unlocked { standard }`.

---

## §6 — Level 2 screen: vibe-coding prompt scaffold

### Layout

The Builder picks one Game Mechanic (radio cards) and writes a free-text description (≤ 200 chars) of the game they want to build (theme, characters, setting). The screen renders a generated **prompt scaffold** below the form, live.

### The scaffold

The scaffold is composed at runtime from three pieces:

1. **Mechanic block** — boilerplate per Game Mechanic. For Counting Collection:
   > *Build a single-page HTML game where the player must tap or drag each item one-by-one to count it. The total appears only when every item has been tapped. The math is the counting — do not show running totals automatically.*
2. **Standard block** — composed from `standard-knowledge.ts` for K.OA.A.1:
   > *The math the player learns: add and subtract within 10. The game must require the player to perform the operation themselves — never the system.*
3. **Required postMessage block** — fixed:
   > *When the player wins, the page MUST `window.parent.postMessage({type: "game_win"}, "*")`. No auto-win. No timer-win. The win must come from a correct math action.*
4. **Builder description block** — the Builder's own words, appended verbatim.

The full scaffold is shown in a code-style box with a **Copy** button. Below the box: *"Take this prompt to ChatGPT / Claude / Gemini, paste the HTML it returns into the next screen."*

---

## §7 — Level 2 Gate A: prompt review (BLOCKS bad prompts)

### Why

Per Hicks et al. 2016 ([ED592703](https://eric.ed.gov/?id=ED592703)): kids authoring content for educational games often produce content that **doesn't afford the core mechanic** — the math quietly disappears. We catch this before an external AI burns tokens generating bad HTML.

### What runs

A single Haiku call (~$0.002) that takes the composed scaffold + Builder description and returns:

```json
{
  "decision": "pass" | "block",
  "reasons": string[],  // ≤ 3 reasons, ≤ 12 words each
  "fixes": string[]     // ≤ 3 fixes, ≤ 12 words each
}
```

Decision criteria (from `the-critic.md` six criteria, simplified to fit prompt-only judgment):

- Does the player's winning action exercise the math? (intrinsic integration — Habgood & Ainsworth 2011)
- Does the description avoid the system doing the math?
- Is the win-condition tied to a correct math action, not time / clicks / luck?

### UI

On block: the Builder sees a short bulleted card. Plain words. ≤ 12 words per bullet. Format: **what's wrong → how to fix**. Example:

> - System does the counting → make the player tap each item.
> - Win is a timer → win when the count matches the target.

On pass: the Builder advances to the paste-HTML screen.

The Builder cannot bypass a block. They edit their description and re-submit.

---

## §8 — Level 2 Gate B: paste HTML + Builder must win their own game

### Paste

A simple textarea. The Builder pastes the full HTML returned by their external AI. The HTML loads in a sandboxed iframe.

### Local validation (cheap, runs in-browser)

Before any AI call:

- HTML has `<!doctype html>` and `<html>` root.
- HTML registers a `message` listener OR posts `game_win` somewhere in source (string match for `postMessage(`).
- Size ≤ 200 KB.

Local validation failures show inline. No AI cost.

### Builder-must-win playtest

The iframe loads. The Builder plays. The page **must fire `window.parent.postMessage({type: "game_win"}, "*")`** within the Builder's play session for the save to proceed. If it never fires, the save button stays disabled and a small note reads:

> *Play your game until it ends. Save unlocks when the game says you won.*

Per Hicks 2016 + Denham 2016: playtesting is the gate that catches integration failures invisible at design time. The `ensureGameWin` shim from the legacy code is permanently deleted (was Audit 22's fix). No auto-win allowed.

---

## §9 — Level 2 Gate C: HTML review (short bullets)

### What runs

The 4-stage agent ladder (§10) runs on the pasted HTML. Each stage produces structured output that the UI reduces to **short bullets**, plain words, ≤ 12 words per bullet, "what's wrong → how to fix" format.

### UI

The Builder sees a single card with at most ~6 bullets total across all stages. No agent names visible to the Builder (kept in PostHog only). Example on a failing game:

> - System adds the numbers → let the player tap each item.
> - Wrong-answer feedback says "no" → show the items, let them recount.
> - Equation always written left-of-equal → mix the placement.

On hard fail (any criterion = `block`): save is disabled, Builder revises.
On soft warn only: a yellow note appears but save is allowed. Goes to Guide queue.
On clean pass: green note, save enabled.

### Save

`POST /api/game/critique` runs the ladder, then on pass, the save endpoint writes `status: "pending_review"` (Foundation Fix #2, already shipped). The Guide approval endpoint flips to `published`.

---

## §10 — Critic ladder (4 stages, Equity Reviewer REMOVED)

| Stage | Model | Role | Cost / call |
|---|---|---|---|
| 1 | Haiku | Critic — 6 criteria, fast filter | ~$0.001 |
| 2 | Haiku | Adversary — obvious shortcuts | ~$0.005 |
| 3 | Sonnet | Critic — 6 criteria, deep read | ~$0.025 |
| 4 | Sonnet | Adversary — creative shortcuts | ~$0.075 |

Total: ~$0.05–$0.20 per published game.

### Critic's 6 criteria (unchanged from v2 except for explicit "winning action" check)

1. **Discovery test** — can a kid who doesn't know the math learn it by playing?
2. **Self-Revealing Truth** — correctness shown by game-world physics, not popups.
3. **Construct validity** (Messick 1989) — does the game measure what it claims?
4. **Intrinsic integration** (Habgood & Ainsworth 2011) — **does the player's winning action exercise the math?** (this is the explicit Hicks 2026 fix)
5. **Equation rendering** — alternates left/right placement of the equal sign (McNeil et al. — equal-sign-as-relation).
6. **Affective tone** — no math-anxiety markers in feedback copy (Beilock 2010).

### Equity knowledge stays in the system

The Equity Reviewer agent file is removed. The three shared-knowledge files (`equity-language-in-math.md`, `equity-funds-of-knowledge.md`, `equity-stereotype-and-anxiety.md`) stay. Both Critic and Adversary system prompts include "Consult `agents/shared-knowledge/INDEX.md`" — the equity files are referenced from there.

---

## §11 — Renames (project-wide sweep)

| Old | New | Where |
|---|---|---|
| `engine` (gameplay verb) | `game mechanic` / `mechanic` | All user-facing copy, agent prompts, comments. Variable names may stay `mechanicId`. |
| `engineId` | `mechanicId` | Code variable rename. |
| `leaves` / `leaf standards` | `standards` | CLAUDE.md, INDEX.md, all docs. |
| "466 standards" | "509 standards across 93 clusters" | CLAUDE.md, INDEX.md, anywhere it appears. |

"Engine" remains acceptable only for **software frameworks** (Next.js, Sandpack — neither currently used). The `engineId` in `standard-mechanic-map.json` is renamed to `mechanicId` as part of Track A.

---

## §12 — Removed / deprecated from v2

- 5-step mad-lib build flow (Steps 1–5).
- 30+ mad-lib story templates.
- `verbMismatchesOperation` advisory check.
- Verb-operation lookup (was advisory only in v2; now obsolete).
- Mr. Chesure separate brief screen.
- Equity Reviewer agent (file removed; knowledge files stay).
- `ScenarioPicker` v2 (2×5 grid). Replaced by combined mechanic+scenario picker in §3.

Code paths to delete:
- `src/components/build-flow/scenario-picker.tsx` (rewrite — combined picker)
- `src/data/scenarios/k-oa-a-1.ts` mad-lib templates (rewrite — Scenario records only)
- `src/lib/verb-operation-map.ts` (delete)
- `docs/agents/the-equity-reviewer.md` (delete in math-pedagogy-toolkit)

---

## §13 — Data shapes

### `Scenario` (rewrite)

```ts
type Scenario = {
  id: string
  mechanicId: MechanicId
  title: string
  oneLineDescription: string
  preMadeGameUrl: string  // Level 1 only
  lessonText: string      // shown at bottom of Level 1 play
}
```

### `MechanicId` (renamed from `EngineId`)

```ts
type MechanicId =
  | "counting-collection"
  | "group-then-combine"
  | "take-from"
  // ... see standard-mechanic-map.json for full set
```

### `BuildState` (rewrite — drops mad-lib state)

```ts
type BuildState = {
  standardId: string
  level: 1 | 2
  // Level 1
  mechanicWinsRecorded: Record<MechanicId, boolean>
  currentScenarioId: string | null
  // Level 2
  chosenMechanicId: MechanicId | null
  builderDescription: string
  composedPrompt: string | null
  promptReview: PromptReviewResult | null
  pastedHtml: string | null
  builderWonOwnGame: boolean
  htmlReview: HtmlReviewResult | null
}
```

### `PromptReviewResult` / `HtmlReviewResult`

```ts
type ReviewBullet = {
  whatsWrong: string  // ≤ 12 words
  howToFix: string    // ≤ 12 words
}

type PromptReviewResult = {
  decision: "pass" | "block"
  bullets: ReviewBullet[]  // ≤ 3
}

type HtmlReviewResult = {
  decision: "pass" | "soft_warn" | "block"
  bullets: ReviewBullet[]  // ≤ 6
}
```

### PostHog events

- `level_1.scenario_started`, `level_1.scenario_won`, `level_1.mechanic_complete`
- `builder.level_2_unlocked`
- `level_2.prompt_review_run { decision, latencyMs }`
- `level_2.playtest_win { tries, durationMs }`
- `level_2.html_review_run { decision, stage1, stage2, stage3, stage4, latencyMs }`
- `level_2.saved_pending_review { standardId, mechanicId }`

---

## §14 — Open questions (deferred, not blocking)

- Mechanic preview animations on the Level 1 picker — deferred to v3.1.
- Cross-mechanic Scenario reuse (does Coin Jar work for Group-Then-Combine too?) — deferred; ship 9 distinct pre-made games first.
- Image upload at Level 2 — deferred (was previously deferred to "Level 2 only," now deferred entirely until first cross-age pilot results).
- Level 2 multi-attempt UX (Builder edits HTML inline after a block) — v3.1.

---

## §15 — Track A engine fixes (ships before this spec executes)

Per the other-Claude handoff (`docs/new-engines-to-build.md` + `docs/plans/2026-05-11-engine-fixes-2-3-4-5.md`), four fixes unblock 6 conditional standards. None of these touch K.OA.A.1's 3 PRIMARY mechanics directly, but the rename `engineId → mechanicId` happens as part of Track A's spec compliance:

1. Fix 2 — (see plan file)
2. Fix 3 — (see plan file)
3. Fix 4 — (see plan file)
4. Fix 5 — (see plan file)

Track A is ~5–8 hours of work. Ships first; this spec's implementation starts after.

---

## §16 — Build order (subagent-driven)

1. **Track A engine fixes** (4 tasks).
2. **Rename sweep** — `engine` → `mechanic`, `leaves` → `standards`, "466" → "509 / 93 clusters".
3. **Delete Equity Reviewer agent file.**
4. **Level 1 data shapes** — rewrite `src/data/scenarios/k-oa-a-1.ts`, delete `verb-operation-map.ts`.
5. **Level 1 picker** — combined mechanic + scenario picker component.
6. **Level 1 play** — game iframe + lesson panel.
7. **Level 1 mastery rule** — Builder unlocks Level 2 after one win per mechanic.
8. **Level 2 prompt scaffold** — composer + Copy button.
9. **Level 2 Gate A** — prompt review endpoint + UI card.
10. **Level 2 paste + playtest** — HTML paste, sandboxed iframe, `game_win` listener gate.
11. **Level 2 Gate C** — HTML review via existing `/api/game/critique` (already shipped; update bullets format).
12. **Save flow** — `pending_review` write (already shipped Foundation Fix #2).
13. **Telemetry wiring** — all PostHog events in §13.
14. **9 pre-made Level 1 games** — built last, in a separate workstream (asset-heavy; can run in parallel with 1–13).

Each task: implementer subagent → spec compliance review → code quality review → mark complete. Code-reviewer (Opus, both passes) at plan-end.

---

*End of spec v3.*
