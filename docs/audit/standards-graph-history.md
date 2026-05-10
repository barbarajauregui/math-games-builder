# Standards graph — history & simplification report

*Investigated 2026-05-10 in response to Barbara's question: "WHY was it simplified, and HOW?"*

## TL;DR

The graph in `src/data/standards.json` was **never reduced at the data layer**. The
"simplification" Barbara remembers is **a render-time filter**, not a destructive
edit. All 664 ATC-extracted nodes are still in the file. The galaxy view hides
cluster headers, duplicate parents, and Math Practices via `isClusterNode()` /
`isValidMoon()` in `src/lib/galaxy-utils.ts`.

---

## 1. What's actually IN the graph today

`src/data/standards.json` — **664 nodes, 547 edges** (was 541 before the May-10
audit fix).

**Node breakdown:**
- 517 leaf-like standards (e.g. `K.OA.A.1`, including 124 sub-part standards like `3.NF.A.3a`)
- 147 cluster headers (e.g. `K.CC.A`, `3.OA.B`) — three-part IDs ending in a single capital
- 8 Math Practices (`MP.1`–`MP.8`)
- `isHub: true` flag set on 13 nodes (separate from cluster filtering)

**Edge breakdown:** 466 prerequisite + 81 related = 547. No grade-header nodes.

**Grades:** K=34, 1=35, 2=38, 3=48, 4=49, 5=51, 6=57, 7=52, 8=46, HS=254.

**Domains covered:** all CCSSM K-8 domains (CC, OA, NBT, NF, MD, G, RP, NS, EE, SP)
plus all HS conceptual categories (N-RN, N-Q, N-CN, N-VM, A-SSE, A-APR, A-CED, A-REI,
F-IF, F-BF, F-LE, F-TF, G-CO, G-SRT, G-C, G-GPE, G-GMD, G-MG, S-ID, S-IC, S-CP, S-MD)
and Mathematical Practices. Nothing is missing at the domain level.

## 2. What was "simplified," and when

**The data file was never trimmed.** Two relevant commits:

- [`ac8f9ae`](https://github.com/mrdavola/option-c/commit/ac8f9ae) (2026-03-28) — *feat: extract 664 math standards + 541 edges from ATC coherence map*. The full ATC coherence map dump landed; nodes/edges have not been removed since.
- [`39b0c2a`](https://github.com/mrdavola/option-c/commit/39b0c2a) (2026-05-10) — *fix(pedagogy-audit): standards graph + game template fixes*. **Added** 6 prerequisite edges and **promoted** 3 from `related` to `prerequisite`. This is an additive fix, not a simplification.

**The simplification Barbara is remembering is at render time**, documented in
the blueprint §15 ("Common Core Organization & Galaxy Cleanup") and implemented
in `src/lib/galaxy-utils.ts`:

- `isClusterNode()` filters out 147 cluster headers (`K.OA.A`, `3.OA.B`, etc.) and
  all `MP.*` Math Practices.
- `buildDuplicateParentSet()` filters out parent standards that have lettered
  sub-parts (e.g. hides `3.NF.A.3` because `3.NF.A.3a/b/c/d` exist).
- `isValidMoon()` combines both. Edges still run through these nodes in the data,
  but they don't render as moons.

The blueprint's table (lines 1082-1086) names this exactly: 393 base standards
+ 124 sub-parts kept as moons; 183 cluster headers + 43 duplicate parents +
8 MPs hidden. Numbers don't match the current node counts perfectly (the
blueprint table is from an earlier extraction), but the rule is unchanged.

## 3. Why it was simplified

Per blueprint §15 and the table caption: **pedagogical clarity for learners,
not performance**. A cluster header like "3.OA.A: Represent and solve problems
involving multiplication and division" is a *grouping label*, not a skill — there
is nothing to learn or demonstrate against it. Math Practices are dispositions,
not skills. Duplicate parents are redundant with their lettered sub-parts.

Showing them as moons in the galaxy would have produced ~190 moons that learners
could never "master" because there's no game and no demonstrable skill. The
filter keeps the moon set aligned with what the app actually teaches.

## 4. Are the 6 newly-added edges re-introducing a removed problem?

**No.** Verified:

- The edges added in [`39b0c2a`](https://github.com/mrdavola/option-c/commit/39b0c2a)
  all connect *leaf standards* (`K.NBT.A.1`, `K.CC.B.4b`, `K.CC.B.5`, `3.OA.A.1/A.2/B.6`, `3.OA.A.4`, `K.OA.A.1`, `1.OA.C.6`).
- None of them touch a cluster header, MP, or duplicate parent.
- `buildBridges()` in `galaxy-utils.ts` only counts prerequisite edges between
  *valid moons*, so adding leaf→leaf prerequisites is exactly the kind of edge
  the system was designed to render.
- The audit doc (`docs/audit/02-standards-graph.md`) cites the K-5 OA Progressions
  Document for each addition — these are Common-Core-published prerequisites, not
  invented ones.

The simplification removed *non-skill nodes from the moon list*. The new edges
add *real prerequisite relationships between real skills*. Different operations,
no conflict.

## 5. Recommended action

**Keep the recently-added edges.** Reasoning:

1. The simplification was a render-filter on nodes (cluster headers, MPs, dup
   parents). It was not an edge-pruning operation. Adding leaf-to-leaf
   prerequisites cannot reintroduce the problem the simplification fixed.
2. Every added edge is cited to a specific page of the official Progressions
   document — these are not speculative.
3. The change closes a real K-1 gap that affects the **already-shipped** K.OA.A.1
   game: without `K.CC.B.5 → K.OA.A.1` and the K.CC.B.4 → K.OA links, the Library
   has no reliable way to identify which Players are ready for the K.OA.A.1 game.
4. The audit's "Investigate" items (e.g. possibly-reversed `2.MD.B.5 → 2.OA.A.1`)
   were correctly *not* changed in this commit. That's the right call — direction
   flips need a separate review.

**One nit worth filing as a follow-up (not a revert):** the audit also flagged
`1.OA.C.6 → 1.OA.A.1 [related]` as redundant and `2.OA.A.1 → 4.NF.B.3a/b/c` as
parallel-with-stronger-edges. Neither is wrong; they're just cleanup candidates
for a future pass. Don't bundle them into this commit.

---

## Source files

- `src/data/standards.json` — the graph
- `src/lib/galaxy-utils.ts` lines 139-175 — `isClusterNode`, `buildDuplicateParentSet`, `isValidMoon`
- `docs/math-games-builder-blueprint.html` §15 ("Common Core Organization & Galaxy Cleanup", lines 1056-1097) — original simplification rationale
- `docs/audit/02-standards-graph.md` — the May-10 audit that produced the new edges
- `docs/audit/2026-05-10-pedagogy-audit.md` — the umbrella audit document
