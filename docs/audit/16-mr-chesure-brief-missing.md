# Audit 15 — Mr. Chesure's brief screen isn't built

*Date: 2026-05-10 · Method: code inspection of `src/components/builders/builder-host.tsx` + verification that `docs/agents/chesure-knowledge/k-oa-progressions.md` exists as markdown and is never rendered to a Builder · No new lit-search spend; reuses citations from Audits 6, 9, 10.*

---

## Summary

Foundation Fix #3 in spec v2 §15.1 — *"Build Mr. Chesure brief screen (between standard-pick and build, render the K.OA knowledge file)"* — is deferred. The result is that a Builder who picks a moon goes **directly to the scenario picker with zero pedagogical briefing.** The agent that's supposed to be the *first* line of pedagogical guidance — the one that tells a 12-year-old "here's what makes a K.OA.A.3 game actually teach K.OA.A.3" — never runs in the user-facing flow.

The downstream agent ladder (Audit 9, Foundation Fix #1) catches *failed* games at submit time. Mr. Chesure was supposed to prevent the failure upstream by orienting the Builder before they start. Without him, the agent ladder is doing structural-quality gatekeeping with no pedagogical priming. That's an inversion of the design — the cheap upstream nudge is missing while the expensive downstream rejection runs.

The briefing content already exists as 400+ lines of markdown in `docs/agents/chesure-knowledge/k-oa-progressions.md`. It is loaded into the agent's *system prompt* but is rendered nowhere in the app. A Builder cannot read it.

Concrete proposal in §3: a single new route, ~150 lines of UI, a 5-field content schema. Half a day's work, plus content authoring per cluster.

---

## §1 — Evidence: there is no brief screen

`src/components/builders/builder-host.tsx` is the entry point for every Builder flow. The state machine is declared at line 23:

```ts
type Step = "pick" | "build" | "generating" | "play" | "sandpack"
```

There is no `brief` step. The component's initial state (line 71) is `useState<Step>("pick")` — the Builder lands on the `BuilderPicker` component and proceeds straight to `BuilderType` selection (sentence / madlib / cards / comic / paste / sandpack / sandpack-template). The handoff from picker to builder fires `setBuilderType(type)` and `setStep("build")` with no intermediate render.

A grep for `chesure|Chesure|brief|Brief|design.?brief|pedagogy.?brief` across `src/components/builders/builder-host.tsx` returns one match — line 201, an unrelated `// Brief celebratory state` comment in the success-handler. **No component imports the Chesure knowledge file. No route renders it. No API surface exposes it to the client.**

Cross-checked: no file under `src/components/` contains a component named `ChesureBrief`, `PedagogyBrief`, `DesignBrief`, or anything similar. The brief screen has not been built.

---

## §2 — Evidence: the content exists in markdown

`docs/agents/chesure-knowledge/k-oa-progressions.md` is a 400+ line K.OA cluster brief authored to Mr. Chesure's grounding. It contains exactly the shape of content a Builder needs:

- **Plain-English skill summary** (lines 32–34): *"By the end of kindergarten a child can take a small set of objects (≤ 10), split it or join it with another set, **show** what they did using objects, fingers, drawings, sounds, acts, words, expressions, or equations…"*
- **Per-standard CCSS verbatim** plus a paraphrase (lines 52+ for K.OA.A.1, equivalents for A.2–A.5).
- **Misconception lists** (referenced in §1's preamble as drawn from CGI and Clements & Sarama trajectories — exactly "common kid mistakes").
- **Pitfall lists specific to AI-built games** (referenced in §1's preamble — exactly "what a good game must do / avoid").
- **A standardized output template** Mr. Chesure produces when a Builder picks a K.OA standard (§1 line 9 of the preamble describes it explicitly).

That last bullet is the smoking gun: the document *describes a Builder-facing output template* that does not exist as a Builder-facing screen. The agent is configured to produce a brief; no UI consumes it.

---

## §3 — Concrete proposal

### Route and props

Add a new step `"brief"` to the `Step` union in `builder-host.tsx`, between `"pick"` and `"build"`. On entering the host with a `standardId`, default to `"brief"` rather than `"pick"`. The brief screen renders, and dismissing it (one click — *"Got it, let's build"*) advances to `"pick"`.

Component signature:

```ts
<ChesureBrief
  standardId={standardId}
  onContinue={() => setStep("pick")}
/>
```

Internally `<ChesureBrief>` calls a new endpoint `GET /api/chesure/brief?standardId=…` which returns the 5-field content schema below. The endpoint reads from a per-standard content file (server-side) and falls back to a "Mr. Chesure is still preparing this brief" placeholder for standards without authored content yet.

### Render position

`brief` is the **first** screen the Builder sees on the standard. It must precede builder-type selection (per Audit 10's just-in-time-information argument — fire the orientation when the Builder is about to act on it, not as a separate pre-flight quiz). It must follow standard-pick (so the brief can be standard-specific). One click dismisses; localStorage records that the Builder has seen the brief for this standard, so on revisit the brief renders smaller and folded ("Refresher · click to expand"), not full-screen.

### 5-field content schema

The Chesure knowledge files are too long to render verbatim. The Builder-facing brief needs five short fields, each authorable per standard:

```ts
interface ChesureBrief {
  standardId: string          // e.g. "K.OA.A.3"
  plainSkill: string          // 1–2 sentences, plain English (no jargon, no CCSS code)
                              // e.g. "Splitting a small number into two parts in more than one way."
  whyItMatters: string        // 1–2 sentences, kid-aimed motivation
                              // e.g. "Once you can split numbers, you can do anything with them — that's
                              // the secret behind addition, subtraction, and place value."
  commonMistakes: string[]    // 2–4 bullets, plain English, no name-dropping
                              // e.g. "Younger kids often think there's ONE right way to split a number."
  goodGameMustDo: string[]    // 3–5 bullets — pedagogical-soundness checklist for THIS standard
                              // e.g. "Player has to show at least 3 different splits in one round."
                              // e.g. "Counters must be visible and countable — no hidden running total."
  oneExample: string          // 1 paragraph — a worked example of a game-shape that PASSES, briefly
                              // e.g. "Imagine 5 fish in a tank. The kid drags some fish to a second
                              // tank. Round only completes when the kid has shown 3 different ways
                              // to split the 5."
}
```

Each field maps directly to material already in the K.OA knowledge file — Mr. Chesure can generate first drafts for the other 21 clusters in a single batch run, with Barbara reviewing the K-3 OA / NF / NBT subset by hand.

### Why this schema and not the full knowledge file

The full knowledge file is the agent's grounding, not the Builder's reading. A 12-year-old will not read a 400-line markdown document before building a game. The 5-field schema is the **worked-example effect** — established in instructional-design research as the most efficient scaffold for novices working on complex tasks — applied to game authorship: one summary, one motivation, one mistake list, one quality checklist, one example. This is also the design-brief shape Audit 10 §Q2 endorsed under the "just-in-time information" argument from van Merriënboer 2003.

### Effort

- New route + endpoint + component: ~4 hrs
- Content schema authoring for K.OA (mining existing knowledge file): ~2 hrs
- Batch run of Chesure drafts for the other 21 clusters: ~30 min agent time + ~$2 in API spend, then Barbara review per cluster as the build queue reaches each one

Total to ship for K.OA: half a day. The other clusters can land as drafts and be revised on first Builder pick.

---

## §4 — Why this should not be deferred further

The spec v2 §15.1 ordering puts Foundation Fix #3 in the same blocking tier as Fixes #1 (agent ladder), #2 (Guide gate), and #5 (per-standard prompt). #1 and #2 and #5 are landed. #3 alone remaining undone leaves the upstream pedagogical scaffold absent while the downstream rejection runs. Net effect: Builders submit games that fail the ladder, get told "your game doesn't show 3 different decompositions," and have no orientation explaining why that was the requirement in the first place. The agent ladder becomes punitive instead of corrective.

A half-day fix moves the orientation upstream. Cheap. Defer no longer.

---

## Sources

- Sweller, J., van Merriënboer, J. J. G., & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. *Educational Psychology Review*, 31(2), 261–292. (The worked-example effect argument for short, structured briefs over long expository text.)
- van Merriënboer, J. J. G., Kirschner, P. A., & Kester, L. (2003). Taking the load off a learner's mind: Instructional design for complex learning. *Educational Psychologist*, 38(1), 5–13. (Reused from Audit 10 — the just-in-time information presentation argument for firing the brief at standard-pick rather than as upfront curriculum.)
- Common Core State Standards Initiative. (2023). *Progressions for the Common Core State Standards for Mathematics, compiled May 2023.* (Source material for the K.OA brief Mr. Chesure is grounded on.)

## Files referenced

- `c:/projects/math-games-builder/src/components/builders/builder-host.tsx` (lines 1–80, especially line 23 Step union, line 71 initial state)
- `c:/projects/math-games-builder/src/components/builders/builder-picker.tsx`
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-oa-progressions.md` (the unrendered content, lines 1–60+ of the cluster overview and per-standard sections)
- `c:/projects/math-games-builder/docs/agents/mr-chesure.md` (the agent definition that produces the brief)
- `c:/projects/math-games-builder/docs/audit/06-agents.md` (related: CPA-progression gate gap on Mr. Chesure)
- `c:/projects/math-games-builder/docs/audit/09-build-flow.md` (related: Foundation Fix #3 origin)
- `c:/projects/math-games-builder/docs/audit/10-new-build-flow.md` (related: just-in-time scaffolding argument)
- `c:/projects/math-games-builder/docs/superpowers/specs/2026-05-10-library-design.md` (spec §15.1 listing the deferral)
