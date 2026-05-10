# Mr. Chesure K.OA Knowledge File — Expansion Notes

*Date: 2026-05-10 · Author: Claude (research subagent) · Trigger: Audit 6 finding that the K.OA knowledge file was a 63-line seed.*

---

## What changed

The file at `docs/agents/chesure-knowledge/k-oa-progressions.md` (symlinked into `math-pedagogy-toolkit/agents/`) went from **63 lines → ~430 lines**. The original 63-line content is preserved in spirit and content, but reorganized into a deeper, structured reference Mr. Chesure can actually use when reviewing Builder submissions or generating design briefs.

## Sections added (vs the prior 63-line seed)

1. **Source-of-truth header** — what this file is, isn't, when to update, and where it sits in the doc hierarchy.
2. **§1 Cluster overview** — plain-English summary of what K.OA teaches, why each standard matters as foundation for grades 1+, and the within-10 / within-5 fluency gates.
3. **§2 Per-standard deep dives — one for each of K.OA.A.1 through A.5.** Each deep dive includes:
   - Verbatim CCSS text
   - Plain-English translation
   - Cognitive prerequisites (which K.CC standards must already be in place)
   - Misconception table specific to that standard
   - CPA progression for that specific standard
   - Exemplar mechanics that pass all 4 Critic criteria
   - Anti-patterns / red flags Mr. Chesure rejects
   - A specific Builder design-brief paragraph
4. **§3 Cross-cutting principles:**
   - Within-10 / within-5 gates
   - Equation-as-record vs equation-as-question (the K-grade distinction)
   - The 4 CGI problem types (Add To, Take From, Put Together, Take Apart) mapped to which K.OA standard each lives in
   - Why "math sprinkles" fails K.OA *specifically* (sharper than the general intrinsic-integration argument because K.OA's whole job is wiring action ↔ symbol)
   - The 8 representational modes from K.OA.A.1
   - Counting principles checklist (Gelman & Gallistel) — must be enforced by mechanic, not by graphic
   - Worked-example onboarding rule (Audit 6 Mr. Chesure Check 7)
5. **§4 Standardized output template** — the exact format Mr. Chesure produces when a Builder picks a K.OA standard. Includes a fully-filled-in worked example for K.OA.A.3 with the scenario "share marbles between 2 jars."
6. **§5 Common Builder pitfalls (15 items)** — patterns Mr. Chesure warns about every time. Pulled from Audit 7 findings + Critic tested-examples + general AI-game failure modes.
7. **§6 Bibliography** — every claim in the file traces to a source; bibliography is grouped by topic (CCSS, CGI, counting principles, decomposition, partners-of-ten, fluency, learning trajectories, ten-frames, subitizing, cognitive load, intrinsic integration, curricula, construct validity, pseudocontext).

## Key citations grounding the new content

(Most were already surfaced by Audit 7; supplemented for A.2/A.4/A.5 which the audit covered less.)

- **Common Core foundations:** CCSS Writing Team K-5 OA Progression (2011/2023, the 2023 compiled edition since 2011 standalone PDF is no longer hosted); CCSS-M (NGA/CCSSO 2010).
- **CGI problem-type taxonomy (drives §3.3 and A.2 deep dive):** Carpenter, Fennema, Franke, Levi, Empson 1999; Carpenter & Moser 1984; Riley, Greeno & Heller 1983; ERIC ED185511.
- **Counting principles (drives §3.6):** Gelman & Gallistel 1978; Sarnecka & Carey 2008.
- **Part-part-whole / decomposition (drives A.3 deep dive):** Fischer 1990 (ERIC EJ409772, foundational study); Fosnot & Dolk 2001; Björklund & Reis 2020 (ERIC).
- **Make-a-ten / partners-of-ten (drives A.4 deep dive):** van Wyk 2017 (Semantic Scholar); K-5 OA Progression p. 9.
- **Fluency at K (drives A.5 deep dive):** Baroody 2006 (the canonical "fluency ≠ flashcard recall" source); Henry & Brown 2008; Boaler "Fluency without Fear" 2014.
- **Cognitive load and worked examples (drives §3.7):** Sweller 1988; Kirschner, Sweller & Clark 2006; Renkl & Atkinson 2003.
- **Intrinsic integration (drives §3.4):** Habgood & Ainsworth 2011; Cutting & Iacovides 2022; Plass, Homer & Kinzer 2015.
- **Construct validity / stealth assessment (drives anti-pattern lists):** Messick 1989; Mislevy, Steinberg & Almond 2003; Shute & Ventura 2013.

## Things Barbara should review

1. **Order-relevance call (file §2.3, K.OA.A.3 misconception table).** I made the call that at K, the game should count `2+3` and `3+2` as *different* decompositions — matching Audit 7's recommendation and CCSS K.OA.A.1's loose handling of order. Commutativity recognition is 1.OA.B.3, so we don't penalize a child who hasn't internalized it yet. **If Barbara prefers stricter equivalence, this needs flipping.**
2. **Single-mode K.OA.A.1 acceptance (file §3.5).** Per Audit 7 Fix 4, the project's pragmatic position is that the current `number-frames` engine ships as "K.OA.A.1, Part 1 of N" with the gap acknowledged. The file documents this as the policy. If Barbara wants the policy to be "no game ships claiming K.OA.A.1 unless it cycles ≥ 2 modes," that's a meaningfully stricter stance and needs a different Builder brief.
3. **Compare problems in K.OA.A.2 (file §2.2).** I deferred Compare to 1.OA per the K-5 OA Progression p. 9. Open Up Resources K does expose simple Compare problems late in the year, which I noted. If Barbara wants Mr. Chesure to *accept* simple Compare in late-K games, the rule needs softening.
4. **Visible timer ban at K.OA.A.5 (file §2.5).** I made it a hard rule per Baroody / Boaler. If a Builder has an interesting time-pressured idea Barbara wants to entertain, this is a hard wall in the current file.
5. **The standardized output template (§4)** is opinionated. Barbara may want to tighten or simplify it before Mr. Chesure starts generating it for every Builder. Recommend test-running it on a real Builder picking K.OA.A.2 next session.
6. **Audit 7's actual code bugs not yet fixed.** The expansion *documents* the K.OA.A.3 single-decomposition bug and the `standard-rounds.ts` mislabel-as-K.OA.A.4 bug, but does NOT fix them. They remain in `number-frames.ts:418-466` and `standard-rounds.ts:162-168` respectively. Audit 7 has the proposed fixes (Fix 1 and Fix 2). Separate task.

## Files modified

- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-oa-progressions.md` — overwritten (63 → ~430 lines). Symlinked into `math-pedagogy-toolkit/agents/chesure-knowledge/`, so the change flows there too as expected.
- `c:/projects/math-games-builder/docs/audit/mr-chesure-k-oa-expansion-notes.md` — this file (new).

## Files NOT modified

- All other files in `docs/agents/` (also symlinked into math-pedagogy-toolkit; out of scope).
- The actual game engines (`number-frames.ts`, `standard-rounds.ts`) — Audit 7's code fixes are a separate task.
- The in-app Rules content (`src/lib/app-rules.ts`) — per AGENTS.md the pivot-period guidance is to NOT keep this in sync with small changes; batch-rewrite later.

## Token spend

Well under the $5 budget. Most heavy lifting was reading the existing audit doc (Audit 7), which already contained excellent grounding citations. Supplemental Semantic Scholar searches for K.OA.A.4 (make-ten) and K.OA.A.5 (fluency) returned at least one usable hit (van Wyk 2017); K.OA.A.2 query was rate-limited but Carpenter et al. 1999 was already the canonical CGI source so the rate-limit didn't cost coverage. ERIC was not reached this round; if Barbara wants more dissertation-level grounding (especially on Open Up Resources K efficacy), an ERIC follow-up is recommended.
