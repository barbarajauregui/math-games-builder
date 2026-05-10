# Audit 09 — End-to-end Build Flow: From Pick-a-Standard to Published Game

**Date:** 2026-05-10
**Scope:** the runtime build flow as it actually executes in code, not the agent design docs.
**Method:** read every component in `src/components/builders/`, every endpoint in `src/app/api/game/`, the agent design files, and the prior audits 06 + 08.

---

## TL;DR (the most important finding)

**There is no agent gate between game generation and publication.** The runtime build flow in `BuilderHost` calls `/api/game/generate-gemini` (LLM with a hard-coded prompt), receives HTML, lets the Builder click "Add to library," and writes `status: "published"` straight to Firestore via `/api/game/save`. **No Critic, no Mr. Chesure, no Shortcut Adversary, no Mechanic Inventor, no construct-validity check, no `judge-html` call** runs anywhere on the path that ships a game to Players. The four agents Barbara has been refining live as Markdown design docs in `docs/agents/`; only one of them (`/api/game/judge-html`) has *any* runtime implementation, and that endpoint is not wired into the current `BuilderHost` flow at all.

The "guide approves → game publishes" step described in `CLAUDE.md` and the orchestrator design exists in the data model (`/api/game/[id]/approve/route.ts`), but the Builder save call short-circuits it by setting `status: "published"` on creation. Practically: a Builder can ship a pedagogically broken game to Players in ~30 seconds with zero AI or human checkpoint.

---

## 1. Current flow (as it actually runs in code)

Files involved: `src/components/builders/builder-host.tsx`, `builder-picker.tsx`, `sandpack-builder.tsx`, `sentence-builder.tsx`, `madlib-builder.tsx`, `comic-builder.tsx`, `card-builder.tsx`; `src/app/api/game/generate-gemini/route.ts`, `save/route.ts`, `[id]/approve/route.ts`; `src/components/game/import-html.tsx`.

1. Builder lands at `/learner` and picks a standard from the galaxy or library.
2. `BuilderHost` mounts with `step = "pick"` → `BuilderPicker` shows three sections: 6 scenario cards, 2 game-style cards (Sum Jumper, Wall Builder), and 3 build methods (madlib, comic, sentence) plus two link-style options ("Start from a template" → Sandpack; "Paste your HTML" → ImportHtml).
3. **Branch A — Scenario or game-style picked:** `handlePick` is bypassed; `onPickScenario` jumps directly to `step = "sandpack"` with the scenario string injected into the SandpackBuilder. No Mr. Chesure brief, no design check.
4. **Branch B — Build method (sentence/madlib/comic):** `step = "build"` → the chosen builder collects scenario text, then `handleGenerate` POSTs to `/api/game/generate-gemini` with `{ standardId, scenario, builderType }`.
5. **Branch C — Sandpack template:** opens the in-browser code editor with engine templates from `src/lib/game-engines/`. No agent review.
6. **Branch D — Paste HTML (`import-html.tsx`):** runs only `localValidate` (length + `<!doctype>` check) and `sanitizeGameHtml`, then injects a fallback `game_win` postMessage shim. **The Markdown calls out `/api/game/judge-html`, but `import-html.tsx` does NOT call it.** HTML is handed straight to the Workshop preview.
7. `/api/game/generate-gemini`: builds `GAME_PROMPT` (a 60-line K.OA.A.1-only prompt — note: the prompt **hard-codes K.OA.A.1** even though the route accepts any `standardId`), calls Gemini-2.5-flash, falls back to Claude Sonnet 4 on failure, runs `scanForAnswerReveals` (regex heuristics for "Total:", "Round X of Y", visible equations), **logs warnings** but does not block, and returns the HTML.
8. `BuilderHost` shows the game in `GameIframe`. Builder plays it; on `game_win` postMessage, the "Add to library" button appears.
9. Builder clicks Add to library → `/api/game/save` → Firestore write with `status: "published"`. **End of flow. No Guide, no Critic, no Mr. Chesure, no Shortcut Adversary, no construct-validity check.**
10. `/api/game/[id]/approve/route.ts` exists for guide un-approval/approval, but the save sets `status: "published"` so the game is live to Players before any reviewer touches it.

---

## 2. Per-step risk analysis (against the 4 Critic criteria)

| Step | What can go wrong | Caught? | Where the broken game leaks |
|---|---|---|---|
| 2 — picker shows generic scenarios | Scenarios are addition-only and hard-coded; "Bakery / Toy Store / Farm" works for K.OA.A.1 but is irrelevant or wrong for any other standard. | No. | Builder picks `3.OA.A.1` (multiplication) and a "Toy Store" addition scenario — the prompt still appends "ADDITION ONLY". |
| 3/5 — scenario / template branch | Scenario goes straight to Sandpack/generation; Mr. Chesure's design brief never appears. The Builder never sees CPA progression, misconception list, or worked example. | No. | C2 (math IS gameplay) and C4 (construct validity) — likely failures. |
| 4 — build-method branch | Builder writes free-text scenario (`SentenceBuilder`); no constraint that the scenario actually requires the standard's math. | No. | C1 (real-world scenario), C4 (construct validity). |
| 6 — Paste HTML | `localValidate` only checks length + `<!doctype>`. `judge-html` exists but is not wired to this flow. | **No.** | All four criteria. Worst leak in the system. |
| 7 — generation prompt | Prompt is hard-coded to K.OA.A.1 addition rules regardless of `standardId`. `scanForAnswerReveals` regex catches a few "Total:" patterns but only logs warnings. | Partial (regex-only, non-blocking). | C2, C3, C4 for any non-K.OA.A.1 standard. |
| 8 — Builder plays own game | Builder must hit `game_win`. The fallback in `ensureGameWin` posts `game_win` after 20 clicks. | **Anti-gate.** | A pasted broken HTML auto-wins by clicking 20 times. C3 trivially fails. |
| 9 — save | Direct Firestore write, `status: "published"`. | No. | Anything generated/pasted ships to Players. |
| 10 — approve route | Exists but the save bypasses it. | N/A — never invoked as a precondition. | — |

---

## 3. Direct answers to the seven specific questions

1. **Is Mr. Chesure's K.OA knowledge file loaded when a Builder picks K.OA.A.1?** No. `chesure-knowledge/k-oa-progressions.md` is on disk. The runtime prompt in `generate-gemini/route.ts` is a single constant string that mentions "K.OA.A.1" by name but does not ingest the knowledge file or the Progressions Doc. Mr. Chesure as an agent does not run at runtime — he is a design-time author of `docs/agents/mr-chesure.md`.
2. **Does Critic Criterion 4 (construct validity) actually run?** No. It exists in `the-critic.md` as of today's edit but is not invoked by any code path. The only judging code, `/api/game/judge-html/route.ts`, still uses the old 3-criterion prompt (`playable / authentic / essential`) and is itself unused by the new `BuilderHost`.
3. **Are Mechanic Inventor and Shortcut Adversary chained into the build flow?** No. Both are aspirational design docs only. Zero runtime invocation. There is no scaffolding to chain them — no orchestrator endpoint, no per-step agent registry, no judging pipeline beyond the unused `judge-html` route.
4. **Custom HTML paste — does any agent review before ship?** No. `import-html.tsx` runs `localValidate` (length + doctype) and `sanitizeGameHtml` (security scrub). It does not call `/api/game/judge-html`. The `ensureGameWin` shim guarantees a `game_win` after 20 clicks, which can falsely cleared the only "Builder must beat their own game" gate that exists.
5. **What if Mr. Chesure approves but the Critic rejects, or vice versa?** Moot — neither runs at runtime. The Markdown spec says the Orchestrator routes 2 agents per output, but that orchestrator is a Claude-Code-side workflow for Barbara, not a runtime app component. There is no tie-breaker because there is no tie.
6. **Does Mr. Chesure's design brief include construct validity, misconceptions, CPA, worked example?** It does not exist as a runtime artifact. The only "brief" the Builder sees is the static header text "Your game needs a real-world situation where someone actually uses addition" in `BuilderPicker`. None of: construct validity, CGI misconception list, CPA stage, worked example.
7. **Rank the 6 build methods by likelihood of pedagogical soundness (1 = safest):**
    1. **Sandpack template** — engines like `number-frames.ts`, `singapore-cpa-phaser.ts` encode CPA pattern; lowest variance because the math mechanic is pre-baked. Danger: 50+ engines exist and not all are mapped to standards.
    2. **Game-style scenario (Sum Jumper / Wall Builder)** — the prompt strings explicitly forbid score counters, hidden totals, popups; the mechanic is constrained.
    3. **Pre-written scenario (Bakery / Toy Store / etc.)** — only K.OA.A.1-shaped; safe for that one standard, mismatched for everything else.
    4. **Madlib** — guides the Builder to a structured story; less freeform than sentence.
    5. **Comic / Sentence** — Builder writes free-text; the LLM has wide latitude. Highest C1/C2 variance.
    6. **Paste HTML** — *the danger zone*. No agent review, no math check, only sanitizer + length. Any quiz wrapper or click-through demo will pass.

---

## 4. Highest-leverage build-flow improvements (5)

1. **Wire `judge-html` into both the paste path and the save path.** In `import-html.tsx`'s `handleSubmit`, fetch `/api/game/judge-html` before calling `onPass`; block on `playable && authentic && essential`. In `/api/game/save/route.ts`, run the same judge before the Firestore write *unless* a guide-approved flag is present. Today's pasted-HTML hole is the largest leak. Concrete: add a `requireJudge: true` field on save and reject if the LLM verdict is FAIL. Update the judge prompt to use the 4-criterion Critic schema (add `constructValid`).
2. **Replace `status: "published"` on save with `status: "pending_review"`, gate publication on `/api/game/[id]/approve`.** This is a one-line change in `BuilderHost` (two call sites) and a default change in `save/route.ts`. It restores the Guide gate that the data model already supports. Players never see a game until a guide signs off.
3. **Build a runtime Critic endpoint** (`/api/game/critique`) that runs the Critic + Shortcut Adversary prompts against the generated HTML and returns the 4-criterion verdict + the shortcut catalog hits. Call it from `BuilderHost` after `handleGenerate` and show the Builder *which criterion failed and why* before they can save. Until the agents have a runtime, they are documentation, not gates.
4. **Make Mr. Chesure's brief a real screen.** Add a `step = "brief"` between `pick` and `build` in `BuilderHost`. The brief is rendered from the standard's knowledge file (e.g. `chesure-knowledge/k-oa-progressions.md`) — at minimum: the standard text, the CPA stage required, the top-3 misconceptions to avoid, and one worked example. Build it once, gate every flow on it. Today the Builder sees only a one-sentence header.
5. **Fix the prompt-vs-standard mismatch in `generate-gemini`.** The prompt is hard-coded to K.OA.A.1 ("ADDITION ONLY"). Refactor so the prompt is composed from the standard's knowledge file (CPA stage, range, misconceptions, anti-shortcuts) at request time. Without this, every non-K.OA.A.1 generation is wrong by construction.

---

## 5. Critique of the 15 build-start ideas

Rank: 1 = safest, 5 = riskiest. "At-risk criteria" use the 4-Critic schema (C1 real-world, C2 math IS gameplay, C3 must-know-math-to-win, C4 construct validity).

| # | Idea | Rank | Why | Most-at-risk criteria |
|---|---|---|---|---|
| 1 | Pick-a-standard, get-a-spec (current) | 3 | Safe in principle; today's runtime ships the spec only as one sentence. With Mr. Chesure brief wired, drops to 2. | C2, C4 |
| 2 | Describe-an-idea → AI matches to standard | 4 | LLM matches loose ideas to standards inconsistently; Builder ends up "claiming" a standard the game doesn't measure. | C4 (severe) |
| 3 | Pick-a-mechanic, find-a-standard | 3 | Mechanic-first is fine if mechanic library is curated (Mechanic Inventor knowledge file). Without that file: ad-hoc mappings. | C4 |
| 4 | Remix an existing game | 2 | Inherits the parent game's pedagogy. If parent is Critic-approved, the remix has a good floor. Risk = drift across many remixes. | C2, C4 (drift) |
| 5 | Translate from worksheet/textbook (uploaded screenshot) | 4 | Worksheets are paper-shaped, often quiz-shaped; high risk of porting a quiz-wrapper. | C2 (quiz-wrapper), C3 |
| 6 | Co-build with a younger Player as audience-of-one | 1 | Strongest of the 15. The Player's confusion is direct feedback on every criterion; learning-by-teaching loop runs in real time. Operational cost is real. | (lowest risk overall) |
| 7 | Build a game your sibling/younger friend asked for | 2 | Same protégé loop as #6, async. Low pedagogical risk; high engagement. | C4 |
| 8 | Adapt a real-world activity the Builder noticed | 2 | Forces C1 by construction. C2/C4 still depend on mechanic. | C2, C4 |
| 9 | Pick-a-CGI-problem-type (Add To / Take From / Put Together / Take Apart) | 1 | CGI (Carpenter & Fennema) is the gold-standard taxonomy for K-2 word problems; tying the start to a CGI type forces construct validity. | (lowest risk for K.OA) |
| 10 | Build with a co-Builder (paired authoring) | 3 | Paired programming benefits depend on pairing; one strong + one weak Builder = strong Builder does it all. C2 risk neutral. | C4 (variance) |
| 11 | Game review + repair (fix a peer's failed game) | 2 | Repair is high-leverage learning; Builder must diagnose a Critic verdict, which trains them on the 4 criteria. | C4 (if root cause not understood) |
| 12 | Game from a kid's misconception | 1 | Misconception-first design is the most pedagogically aligned starting point — directly maps to CGI / Progressions misconception lists. Best for measurement validity. | (lowest C4 risk) |
| 13 | Iterate based on real-play ratings | 2 | Closes the protégé loop; ratings + "stuck on round 3" data is the highest-quality signal. Risk = optimizing for fun over learning if rating != learning. | C2 (engagement-as-distraction) |
| 14 | Mechanic from another domain (Tetris-style with intrinsic math) | 4 | Trying to retrofit math into existing mechanics is exactly the "exogenous fantasy" failure mode (Habgood 2007). Mechanic owns the play loop; math becomes sprinkles. | C2 (severe) |
| 15 | Skill-ladder builder (3 prereq-chained standards in one progressive game) | 5 | Bundles multiple standards; violates Mr. Chesure's "one concept per game" rule; impossible to assess construct validity per standard. | C4 (severe), C2 |

**Top picks for cross-age pilot:** #9 (CGI-typed start) + #12 (misconception-first) + #6 (co-build with Player) — all three are anchored in published pedagogy, not invented heuristics.
**Cut from consideration:** #15 (multi-standard) and #14 (retrofit-mechanic) — both fail by construction.
**Quick wins inside current product:** #11 (repair flow) is buildable with the same `judge-html` plumbing recommended above; #13 (rating-driven iteration) is buildable on the data already captured.

---

## 6. Bibliography (claims grounded in audits 06/08 + standard refs)

- Habgood, M. P. J., & Ainsworth, S. E. (2011). *Motivating children to learn effectively: Exploring the value of intrinsic integration.* J. of the Learning Sciences. — endogenous vs exogenous fantasy; informs idea #14 critique.
- Carpenter, T. P., & Fennema, E. (1992). *Cognitively Guided Instruction.* American Educator. — basis for CGI problem-type taxonomy (idea #9).
- Messick, S. (1989). *Validity.* Educational Measurement (3rd ed.). — construct underrepresentation; Critic Criterion 4.
- Baker, R. S. J. d., et al. (2009). *Educational Software Features that Encourage and Discourage Gaming the System.* — Shortcut Adversary catalog, Criterion 3.
- Bruner, J. S. (1966). *Toward a Theory of Instruction.* — CPA progression.
- Common Core Progressions Documents (University of Arizona) — standard-by-standard pedagogy.
- Audit 06 (`docs/audit/06-agents.md`) and Audit 08 (`docs/audit/08-game-templates.md`) — local prior work cited throughout.
