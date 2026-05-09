# Session Log

Append-only running log of work sessions. Newest at top. Each entry: date, what changed, why, what's next.

---

## 2026-05-08

**Extracted agents + skills to shared toolkit repo.**
- Created `c:/projects/math-pedagogy-toolkit/` (own git repo, local-only for now) — contains `agents/` (all 13 agent .md files + their `*-knowledge/` subfolders) and `skills/eric-search/`.
- Replaced this project's `docs/agents/` and `.claude/skills/eric-search/` with directory symlinks pointing at the toolkit. Both are gitignored — the toolkit is the source of truth.
- Source-of-truth rule: edit agent and skill files in the toolkit, both projects pick up changes live.
- `math-mastery-personal` to be wired in next (had no agents yet, so clean slate).
- **Setup requires Windows Developer Mode** (one-time toggle in Settings → System → For developers) so non-admin processes can create symlinks.

**Added two agents** (uncommitted):
- [The Mechanic Inventor](agents/the-mechanic-inventor.md) — generates 5–10 mechanic concepts per request, grounded in Progressions Docs + proven game patterns. Fills the "no one was *proposing* good games" gap.
- [The Shortcut Adversary](agents/the-shortcut-adversary.md) — adversarial tester that tries to beat games without doing the math. 12-shortcut catalog, three personas (Random Toddler, Pattern Matcher, Lazy Optimizer). Output feeds The Critic's Criterion 3 and the Builder's revision loop.

**Literature-search stack installed:**
- Installed `lingzhi227/agent-research-skills` globally (`~/.claude/skills/`) — 31 skills covering Semantic Scholar / OpenAlex / arXiv / CrossRef. HIGH-risk scanner flags reviewed; they're false-positives (stdlib HTTP calls), but venue tiers are ML/AI-only — not auto-trusted for our domain.
- Built and installed `.claude/skills/eric-search/` — project-local skill that queries ERIC (1.6M+ education research records, including grey literature). Stdlib-only Python, no API key. Offline test passes; live API call returned valid third-grade multiplication records.
- Wired ERIC + literature-search into [Mr. Chesure](agents/mr-chesure.md) and [The Mechanic Inventor](agents/the-mechanic-inventor.md). Both now cite-by-ID and forbid fabricated citations.

**Added** [docs/context/README.md](context/README.md) — index of voice/philosophy/design/pedagogy docs (no files moved). Pointer added to `CLAUDE.md` document hierarchy.

**Commit:** `8340bf7` — Complete Diagonally → Math Games Builder rename + add positioning doc

- Finished the rename across remaining files Barbara updated locally: blueprint renamed (`diagonally-blueprint.html` → `math-games-builder-blueprint.html`), legacy `Diagonally logo.png` / `Diagonally.svg` deleted, doc/code references updated (teleprompter URLs, tracker dashboard header, `/api/blueprint` route, agent review docs).
- Added `docs/product-positioning.md` as the locked north star (protégé-effect framing, two-mode Builder/Player product, cross-age plays/week as the north-star metric).
- Added `math-games-builder.code-workspace`.
- 17 files changed, 321 +, 84 −. Pushed to `main`.

**Next:**
1. Builder flow redesign (5-screen spec for the inverted "build first, math on demand" flow).
2. Cross-age pilot at Barbara's school — candidate standard 3.OA.A.1.
3. Blueprint surgery — bring `math-games-builder-blueprint.html` in line with the positioning doc; mark legacy sections explicitly.
4. Mr. Chesure rewrite + first domain knowledge file (3.OA).
5. Mechanic Inventor agent (generates mechanics; missing piece).
6. Shortcut Adversary agent.

---
