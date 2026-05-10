# Pedagogy audit plan

> Created 2026-05-10 during the Library brainstorming session. Barbara authorized **Scope C (full audit)** with the protégé-thesis stress-test, output mode = **critique + proposal**, soft token budget ~$15–25, and "her decision wins on conflicts" (audit doc flags conflicts; she adjudicates in the morning).

## Why this exists

Math Games Builder makes pedagogical claims at every layer — the protégé thesis at the top, Common Core prerequisite edges in the middle, K.OA.A.1 game mechanics at the bottom. Most of these claims have not been formally validated against the published research base. This plan describes the audit that's running tonight.

## Scope (locked Scope C)

Eight surfaces, each audited in its own background agent. All output goes to `docs/audit/0N-<name>.md`, then aggregated by Claude into `docs/audit/2026-05-10-pedagogy-audit.md`.

| # | Surface | Audit lens | Rough budget |
|---|---|---|---|
| 1 | **Protégé thesis** in `docs/product-positioning.md` | STORM 3-persona stress-test against learning-by-teaching empirical literature | ~$3 |
| 2 | **Standards graph** (`src/data/standards.json`) — K-3 OA focus | Cross-check against the K-5 OA Progressions Document | ~$2 |
| 3 | **Discovery + Self-Revealing Truth criteria** | Compare to constructivism, embodied cognition, productive failure, stealth assessment | ~$3 |
| 4 | **Token economy** (+2000/+100/+10) | Self-Determination Theory + extrinsic-rewards research | ~$2 |
| 5 | **Mastery state machine** (locked → mastered, "win 3 games" threshold) | Bloom's mastery learning + fluency/automaticity/spaced-practice research | ~$2 |
| 6 | **Agent definitions** (Mr. Chesure, Critic, Mechanic Inventor, Shortcut Adversary) | Game-based learning research + NCTM Process Standards | ~$3 |
| 7 | **K.OA.A.1 + K.OA.A.3 games** (the 2 in production) | Early-childhood math (Clements & Sarama trajectories, MLC pedagogy) | ~$3 |
| 8 | **Game templates** (Sum Jumper, Wall Builder) | Mechanic-math alignment, Discovery + SRT tests, Shortcut analysis | ~$2 |

**Total:** ~$20 expected, capped at $25.

## Method

Each audit agent uses these established skills:
- **`literature-review`** — STORM-style multi-persona dialogue (3 personas × 2 search rounds typical)
- **`literature-search`** + **`deep-research`** scripts — Semantic Scholar, OpenAlex, arXiv (`python ~/.claude/skills/<skill>/scripts/<search>.py --query "..."`)
- **`eric-search`** — ERIC database (1.6M+ K-12 education records that Semantic Scholar misses)
- **`math-reasoning`** — formal math grounding when needed

Per-agent output template:
- **Summary** (2-3 sentences)
- **Claims audited** with verdict (WELL-SUPPORTED / CONTESTED / UNSUPPORTED / CONTRADICTED) + 2–3 citations each
- **Boundary conditions / failure modes**
- **Proposed changes** to the source doc (specific lines, with reasons)
- **Key citations** in BibTeX-friendly form

## Tonight's runtime status (when this doc was written)

- All 8 audit agents dispatched in parallel as background subagents at the start of the overnight session.
- Each agent writes its output to `docs/audit/<n>-<name>.md` directly.
- Claude aggregates results into `docs/audit/2026-05-10-pedagogy-audit.md` once they return.
- Cross-references to the new Library design spec and `docs/product-positioning.md` are flagged but **not auto-applied** — Barbara reviews and decides.

## What this audit will NOT do

- It will not rewrite `docs/product-positioning.md` autonomously. Conflicts with Barbara's locked tonight-decisions are flagged in the audit doc; she adjudicates.
- It will not block on missing access. If a citation needs a paywalled paper, the audit notes the gap and uses an open-access proxy.
- It will not stress-test claims that aren't actually made (e.g., specific neuroscience claims MGB doesn't make).
- It will not audit the not-yet-built features (Builder Impact Dashboard, Mechanic Inventor knowledge files, etc.) — only what exists or is locked-in.

## Follow-ups expected

After Barbara reviews the aggregate audit doc:
1. Decide which proposed changes to apply to `docs/product-positioning.md` and the agent files.
2. Decide whether the Library design spec needs revisions before implementation begins.
3. File any newly-discovered gaps (e.g., a research-backed mechanic Mechanic Inventor should generate but currently can't) into `docs/pending-ideas.md`.

---

*This plan is a one-time scaffold for the 2026-05-10 audit. Future audits should be lightweight checks on individual surfaces as they change, not full re-runs.*
