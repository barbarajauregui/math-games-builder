# Foundation Fix #5 — Generation Prompt Composer

**Date:** 2026-05-10
**Audit reference:** `docs/audit/09-build-flow.md` §4 item 5
**Spec reference:** `docs/superpowers/specs/2026-05-10-library-design.md` §15.1 item 2
**Status:** implemented; not yet verified by Barbara

---

## What was wrong

The generation route at `src/app/api/game/generate-gemini/route.ts` accepted any `standardId` in its request body but always sent the LLM a prompt hard-coded to **"K.OA.A.1 — Represent ADDITION with objects. ADDITION ONLY — do NOT include any subtraction rounds."** Every game generated for a non-K.OA.A.1 standard was therefore wrong by construction (e.g. a Builder picking 3.OA.A.1 multiplication still got an addition-only prompt).

## What changed

Two new files plus a thin update to the route. Architecture follows the spec's suggestion (composer + knowledge loader; both pluggable).

### New: `src/lib/standard-knowledge.ts`

Exports `loadStandardKnowledge(standardId)` returning a `StandardKnowledge` object with:
- `standardText` — verbatim CCSS text from `standards.json`
- `plainEnglish` — the plain-English paraphrase from the knowledge file
- `cpaProgression` — Concrete-Pictorial-Abstract notes for the standard
- `misconceptions[]` — top kid misconceptions from the knowledge file's table
- `exemplarMechanics[]` — mechanics that pass the four Critic criteria
- `antiPatterns[]` — patterns that auto-fail
- `builderBriefGuidance` — Mr. Chesure's brief paragraph for the standard
- `hasFullKnowledge` — `true` only when a per-standard section was extracted; `false` when fallback skeleton was used
- `source` — discriminated union (`'knowledge-file'` vs `'fallback'`) for debug/logging

Implementation notes:
- Uses `node:fs/promises` and `path.join(process.cwd(), …)`. Module-level caches for the `standards.json` parse and per-cluster markdown reads.
- Cluster-to-file map currently has just one entry (`'K.OA' -> 'k-oa-progressions.md'`). New knowledge files get added by editing the `cluserToFile` map.
- The `docs/agents/` directory is a symlink to `math-pedagogy-toolkit`; Node's `fs.readFile` follows symlinks transparently on Windows.
- Markdown extraction is regex-based (per the constraint not to add a markdown parser dependency). It slices on `### N.N STANDARD-ID — …` headings, then looks for sub-headings like `**Common kid misconceptions**`, `**Concrete-pictorial-abstract progression**`, `**Anti-patterns / red flags:**`, `**Exemplar mechanics**`, `**Builder design-brief guidance**`. Tested mentally against all five K.OA sections in `k-oa-progressions.md` — they share consistent formatting.
- If a knowledge file exists for the cluster but lacks a section for the specific standard, the fallback path is used with a precise reason string for debugging.

### New: `src/lib/agent-prompts/generate-game.ts`

Exports `buildGenerateGamePrompt({ standardId, scenario, builderType, knowledge })`. The prompt is assembled in clearly labeled sections:

1. **Standard section** — verbatim text + plain-English meaning (when present). When `hasFullKnowledge` is false, includes an explicit instruction to "Build STRICTLY to the verbatim text. Do not import math from adjacent standards" so the LLM doesn't fall back to addition by default.
2. **The four Critic criteria** — written in plain English with parenthetical definitions for established research terms (construct validity, math IS gameplay, etc.) per Barbara's plain-English preference.
3. **CPA progression** — populated from knowledge file when present; otherwise a generic note that the game must open with concrete/pictorial action and let symbols appear only as a recording.
4. **Misconceptions to design around** — bulleted from the knowledge file; falls back to a generic "no guessing, no random clicks, no system-counting" note.
5. **Anti-patterns** — bulleted from the knowledge file (omitted entirely when none).
6. **Exemplar mechanics** — bulleted from the knowledge file (omitted when none).
7. **Builder brief** — Mr. Chesure's paragraph (omitted when none).
8. **Game-shape requirements** — fixed across all standards (5 rounds, dark theme, postMessage protocol, Lexend font, CSP meta tag, mobile/desktop input, sandboxed-iframe constraints). The `kind` field in `round_complete` postMessage was generalized from `'addition' or 'subtraction'` to `'<operation kind, e.g. "addition", "multiplication", "decomposition">'` so non-K.OA games report correctly.
9. **"Learner does the math, never the system" rules** — preserved verbatim from the legacy prompt (these are universal across standards).
10. **Visual quality bar + output format** — preserved verbatim.

### Updated: `src/app/api/game/generate-gemini/route.ts`

- Now imports `loadStandardKnowledge` and `buildGenerateGamePrompt`.
- Inside `POST`, after the body parse: `const knowledge = await loadStandardKnowledge(standardId)` then `const prompt = buildGenerateGamePrompt({ standardId, scenario, builderType, knowledge })`.
- Logs to `console.info` when fallback knowledge is used so ops can see which standards still need a knowledge file written.
- The legacy `GAME_PROMPT` constant is preserved as `_LEGACY_GAME_PROMPT` with a deprecation comment pointing at this notes file. It is no longer called from anywhere but kept inline as a reference for reviewers comparing the new prompt against the old one. It can be deleted once the new prompt is verified.
- **Unchanged:** Gemini call, Anthropic fallback, `extractHtml`, `scanForAnswerReveals`, response shape (`{ html, model, warnings }`).

### Updated: `src/lib/agent-prompts/index.ts`

Added re-exports for `buildGenerateGamePrompt` and the input type.

## Composed-prompt sketches

### K.OA.A.1 (full knowledge)

The prompt opens:

```
MATH STANDARD — K.OA.A.1
Verbatim text: Represent addition and subtraction with objects, fingers, mental images,
  drawings, sounds (e.g., claps), acting out situations, verbal explanations,
  expressions, or equations.
Plain-English meaning: The kid takes a small joining or separating action and *shows it*
  using whichever of the 8 modes the task calls for. Multiplicity of representation …
```

It then includes the four Critic criteria, a CPA progression block listing the three
stages (counters → dot-clusters → equation-as-recording), a misconceptions table
flattened to bullets ("Counting all (vs counting on)", "Equation-as-instruction",
"Operation as a property of objects" …), the K.OA.A.1 anti-patterns ("Equation shown
as prompt", "Running total displayed", "Numbers printed on counters", …), the exemplar
mechanics ("Two-frame count-and-combine", "Mode-cycling round-set", "Story-acting
drag"), and Mr. Chesure's design-brief paragraph ("Pick a real-world joining or
separating action…").

### 3.OA.A.1 (fallback skeleton)

The prompt opens:

```
MATH STANDARD — 3.OA.A.1
Verbatim text: Interpret products of whole numbers, e.g., interpret 5 × 7 as the total
  number of objects in 5 groups of 7 objects each. For example, describe a context in
  which a total number of objects can be expressed as 5 × 7.
(Note: this standard does not yet have a Mr. Chesure knowledge file. Build STRICTLY
  to the verbatim text above. Do not import math from adjacent standards.)
```

The four Critic criteria are unchanged. The CPA section uses the generic fallback
(act first, symbols as recording). The misconceptions section is the generic fallback
("the game should accommodate kid mistakes gracefully"). The anti-patterns / exemplar
mechanics / Mr. Chesure brief sections are omitted entirely. The game-shape rules,
"learner does the math" rules, and visual bar are identical to the K.OA.A.1 prompt.

The crucial change: there is no longer a line that says "ADDITION ONLY — do NOT
include any subtraction rounds." A 3.OA.A.1 prompt now correctly tells the LLM to
build a multiplication-as-equal-groups game.

## Edge cases

- **Standard not in `standards.json`.** `standardText` becomes `"(Standard X not found in standards.json)"`, `hasFullKnowledge` is `false`, fallback skeleton is used. The LLM still gets a well-formed prompt; the missing-text marker is a debug breadcrumb, not a user-facing error.
- **Symlink missing or knowledge file unreadable.** Caught with a `try/catch` returning `null`; falls through to fallback. Logged via `console.info`.
- **Knowledge file present but section missing.** Distinguished from the no-file case by the `source.reason` string ("Knowledge file for K.OA found but had no section for K.OA.A.99"). Same fallback skeleton.
- **Cache invalidation.** Module-level caches persist for the lifetime of the Node process. `_resetStandardKnowledgeCacheForTesting` exported for unit-test use. In dev the Next.js hot reload restarts the process anyway.
- **Concurrent requests.** `loadStandards` and `loadKnowledgeFileForCluster` are not protected by a mutex, so two simultaneous cold requests may both read the same file. That's fine — the second write to the cache is a no-op.

## Files changed

- **New:** `src/lib/standard-knowledge.ts`
- **New:** `src/lib/agent-prompts/generate-game.ts`
- **Updated:** `src/lib/agent-prompts/index.ts` (added re-exports)
- **Updated:** `src/app/api/game/generate-gemini/route.ts` (imports + composed call; legacy constant preserved as `_LEGACY_GAME_PROMPT` with deprecation comment)

## Files NOT changed (per constraints)

- `docs/agents/**` — symlinked to the shared toolkit repo
- `scanForAnswerReveals` — preserved verbatim
- `extractHtml` — preserved verbatim
- Gemini → Claude fallback logic — preserved verbatim
- Response shape — preserved verbatim

## Verification still owed

- `npm run build` to confirm TypeScript strict-mode passes — Barbara is verifying after sleep.
- A live generation call against a non-K.OA standard (e.g. 3.OA.A.1) to confirm the LLM produces a multiplication game, not an addition game.
- Once Phase 2 of the spec lands the agent-ladder gate, the four-Critic verdict on a 3.OA.A.1 generation should pass Criterion 4 (construct validity) for the first time.

## Follow-ups (out of scope here, listed for the next session)

- Write knowledge files for the next priority clusters: 3.OA, 1.OA, 2.OA. The composer is ready for them — drop a markdown file into `docs/agents/chesure-knowledge/` with the same heading convention as `k-oa-progressions.md`, then add the cluster key to the `cluserToFile` map in `standard-knowledge.ts`.
- Delete `_LEGACY_GAME_PROMPT` once the new path is verified live.
- Consider extracting the section-extraction regex helpers into a small dedicated module if a third caller ever needs them.
