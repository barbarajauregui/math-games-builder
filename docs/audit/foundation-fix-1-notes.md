# Foundation Fix #1 — Runtime Agent Ladder wiring

*Date: 2026-05-10*

## What this fixes

Per Audit 9 (`docs/audit/09-build-flow.md`), the agents Barbara has been
refining for months (the Critic, the Shortcut Adversary, etc.) had prompt
builders in `src/lib/agent-prompts/` but **were not actually being run at
runtime**. Builder saves wrote the game straight to Firestore (after the
previous commit, at least with `pending_review` status — but with no agent
review). This fix wires the 4-stage Haiku → Sonnet → Haiku → Sonnet ladder
into every save path.

Spec source: `docs/superpowers/specs/2026-05-10-library-design.md`
§13 (the 4-stage ladder) and §15.1 (foundation work order).

## Files added

- `src/app/api/game/critique/route.ts` — new POST endpoint that runs the
  4-stage ladder.
- `src/components/builders/agent-ladder-progress.tsx` — modal UI with the 4
  brass-style indicator dials and the failure detail panel.

## Files changed

- `src/components/builders/builder-host.tsx` — both save paths
  (`handleAddToLibrary` for the play view, and the inline `onAddToLibrary`
  passed to `SandpackBuilder`) now call `/api/game/critique` first. The
  modal renders during the run and after a result.
- `src/components/graph/graph-page.tsx` — `ImportedGamePlayer.handleAddToLibrary`
  (the paste-HTML / import flow) now also calls `/api/game/critique` before
  saving. Audit 9 called the paste-HTML path "the worst leak"; it now goes
  through the same gate as Builder-generated games.

## Files explicitly NOT changed

- `src/app/api/game/judge-html/route.ts` — left in place per the spec note;
  it's a legacy 3-criteria judge with a different shape. We did not migrate
  callers (Workshop / `import-html.tsx` for instance still use it as a
  pre-paste check). New callers go through `/api/game/critique`. A future
  cleanup can retire judge-html when no callers remain.
- `src/app/api/game/save/route.ts` — already enforces `pending_review` on
  create. The critique endpoint is the gate that runs *before* save; the
  save route stays simple.

## Wiring contract

```
Builder clicks "Add to library"
        ↓
POST /api/game/critique { standardId, scenario, gameHtml }
        ↓
Stage 1 (Haiku Critic, max 900 out)  →  fail? return early
        ↓
Stage 2 (Sonnet Critic, max 1400 out) →  fail? return early
        ↓
Stage 3 (Haiku Shortcut Adv, max 900) →  fail? return early
        ↓
Stage 4 (Sonnet Shortcut Adv, max 1400) → fail? return early
        ↓
{ passed: true, stages: StageResult[], finalVerdict: "PASSED",
  builderFacingMessage, totalCostEstimateUsd }
        ↓
client calls POST /api/game/save (status forced to pending_review server-side)
```

If a stage fails, the client immediately shows the modal with that stage
amber and the `builderFacingMessage` (which contains both failure reasons
and the agent's `revisionSuggestions` formatted for a 10-year-old). The
"Revise" button returns the Builder to the build screen.

JSON parse failures are retried once (per spec). After two failures, the
endpoint returns 502 with a "service issue, please retry" message.

Each stage records `costEstimateUsd` derived from the Anthropic usage
fields; the response aggregates `totalCostEstimateUsd`.

## How the UI surfaces failures

`AgentLadderProgress` is a modal with:

- A row of 4 brass-bordered circular dials labelled `Critic 1`,
  `Critic 2`, `Adversary 1`, `Adversary 2`. States: `pending` (dim),
  `running` (warm pulse), `passed` (green check), `failed` (amber `!`).
- A headline (`builderFacingMessage`) above the failure detail.
- A failure detail panel below the dials showing the failed stage's
  reasons + revision suggestions, formatted as bullets.
- "Close" + "Revise" actions when not running. While running, only the
  pulsing dial states are shown — no buttons.

## Edge cases / things to review

1. **Paste-HTML `scenario` is just the title.** The import flow doesn't
   capture a real scenario from the Builder, so we pass
   `"Imported HTML game: <title>"`. The Critic prompts will mostly judge
   from HTML alone; if construct validity gets too noisy on imports,
   consider extending `import-html.tsx` to ask the Builder for a one-line
   scenario before save.

2. **`generate-engine` / Workshop `Send for review` path.** The
   `handleSendForReview` flow inside `graph-page.tsx` writes Firestore
   directly via `setDoc(doc(db, "games", id), …)` rather than going
   through `/api/game/save`. **It currently bypasses the new critique
   gate.** Recommend Barbara confirm: should that path also be routed
   through `/api/game/critique`? It's a separate "send for review" UX
   which the audit didn't single out, but the same protection applies.
   Flagging rather than papering over it.

3. **Cost ceiling.** A worst-case run (passes all 4 stages on a 16 KB game)
   will be roughly $0.10. The endpoint has `maxDuration = 60`. If Sonnet
   stages run slow, Stage 4 could be cut off; we currently surface that as
   a 502 service-issue. If this becomes a real timeout in the pilot, split
   stages 3 + 4 into a streaming response or kick to a job queue.

4. **HTML truncation at 16 KB.** Same threshold as `judge-html/route.ts`.
   For complex games this *could* hide bugs in the truncated tail. The
   token budget on 16 KB + system prompt is fine on Sonnet 4.6.

5. **No critique state survives the modal.** If a Builder closes the
   modal mid-run with the browser back button, no token is wasted (server
   completes, response is dropped). On the next click they re-run the
   ladder fresh.

6. **`auth` required.** `/api/game/critique` requires a Firebase ID token
   via `verifyAuth(req)` — same as save.

7. **Modal stacking.** The ladder modal uses z-index `[110]`, sitting above
   the Builder's z-50 overlay. Worth confirming visually that nothing else
   in the app uses higher.

## What Barbara should review carefully

- **Decide on the Workshop send-for-review path** (edge case 2). Either
  route it through `/api/game/critique` or document that the workshop
  "send for review" intentionally skips ladder review and relies on the
  guide to catch issues.
- **Visual polish on the dial UI.** Functional only — brass tones, simple
  pulse, no fancy treatment. Easy to upgrade once the rest of Library
  visuals land.
- **Builder-facing copy in the failure messages.** The format is:
  `"Critic 1 (quick) found problems:\n- <criterion>: <reason>\n\nWhat to try:\n- <suggestion>"`.
  Driven by the agent prompt's `revisionSuggestions` array. If the agent
  voice ever feels too clinical for a 10-year-old, the rewrite point is
  the prompt files in `src/lib/agent-prompts/`, not the UI.

## Verification

`npx tsc --noEmit` clean. No build run per task constraints.
