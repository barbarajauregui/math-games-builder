# Audit 14 — Cluster context is invisible in the Galaxy

*Date: 2026-05-10 · Method: code inspection of `src/components/graph/` + cross-reference to CCSSM design principles and prior audits (02 standards-graph, 06 agents, 10 build-flow) · No new lit-search spend; citations already in the project's audit bibliography.*

---

## Summary

The Galaxy renders planets (math clusters) and moons (individual standards) as a 3D scene, but **a Builder walking up to a planet is never told what the planet is about**. The visible label on each planet is a shortened domain name ("Algebra," "Base Ten," "Fractions") plus the grade — no sentence explaining what the cluster teaches, no hint that the five moons orbiting it are five different lenses on the same idea. When the Builder clicks into a planet, the planet-view shows an orb labelled `{planet.domainName} · Grade N` and ringed by moons — still no cluster overview.

The pedagogical cost is direct: Common Core's "Coherence" design principle (one of the three the framework was written around, alongside Focus and Rigor) is the claim that **math standards are not a list of isolated skills — they are connected ideas that build on each other within and across grades.** The Galaxy hides exactly the connection coherence depends on. Worse, the Builder is the user who most needs to see it: a Builder picking K.OA.A.3 to teach younger kids will design a better game if they know K.OA.A.3 is one of five sibling moons that together teach "addition as putting together and adding to" — that decomposition is the same operation as composition, just run backwards. A Builder who sees K.OA.A.3 as a standalone shouldn't-be-asking-this-question moon designs a decomposition drill in isolation.

The fix is small UI work and one new content field per cluster — call it ≤ 1 day. Three concrete proposals in §3.

---

## §1 — Evidence from the code

**Planet labels (the 3D galaxy view).** `src/components/graph/galaxy-view.tsx:344–367` renders each planet's sprite-label as a canvas texture. The label content is:

- Line 1: a shortened domain name from a hard-coded dictionary at lines 346–357 (`"Operations & Algebraic Thinking" → "Algebra"`, `"Number & Operations In Base Ten" → "Base Ten"`, etc.). Domain names longer than 16 chars get truncated with an ellipsis at line 359.
- Line 2: `"Grade N"` (line 367).
- Line 3 (only if recommended): `"★ Start here"` (lines 368–372).

That is the entire on-screen text identifying what the planet teaches. No cluster description, no plain-English summary, no sibling-moon overview.

**Planet-view (clicked-into close-up).** `src/components/graph/planet-view.tsx:232–238` shows the central orb's label:

```tsx
<div className="text-white font-bold text-sm leading-tight">{planet.domainName}</div>
<div className="text-white/70 text-xs">Grade {planet.grade}</div>
```

Same problem at higher zoom — domain name plus grade, nothing else. The moons orbit around it (lines 242+), and the Builder can hover any moon to see its standard ID, but there is no "this planet teaches X; these five moons are five ways to think about X" panel.

**Knowledge-graph 2D fallback.** `src/components/graph/knowledge-graph.tsx` (used as the 2D Explore view) shows the same domain-name-only labelling pattern — confirmed by inspection, no cluster description.

**The knowledge exists; it's just not rendered.** `docs/agents/chesure-knowledge/k-oa-progressions.md` lines 28–46 contain exactly the kind of plain-English cluster summary the Galaxy would need ("By the end of kindergarten a child can take a small set of objects (≤ 10), split it or join it…"). That content is loaded into Mr. Chesure's system prompt but is never rendered to a learner or Builder in the app.

---

## §2 — Why this matters pedagogically

The Common Core was written around three design principles: **Focus, Coherence, and Rigor.** Coherence is defined in the CCSSM front matter as the requirement that standards be "connected within and across grades" rather than presented as a "checklist." A coherence-respecting interface should:

1. Make the parent idea of a cluster visible at the cluster level.
2. Make the sibling relationships within a cluster visible at the standard level.
3. Make the prerequisite chain across grades visible when the learner needs it.

The current Galaxy does (3) reasonably well — the bridges between planets visualise prerequisites — but it fails (1) and (2). A learner zooming into K.OA sees five moons with codes (K.OA.A.1, A.2, A.3, A.4, A.5) and no signal that they are *five facets of one cluster idea.*

For Builders specifically, the protégé-effect literature (already cited in Audit 1 — Roscoe & Chi 2007) shows that tutors default to **knowledge-telling** — reciting facts in isolation — unless they have an explicit structural map of the domain. The cluster overview *is* the structural map. Without it, a Builder builds K.OA.A.3 as "decomposition" rather than as "the inverse-direction view of K.OA.A.1's composition, which is why both fit under the cluster heading 'understand addition as putting together AND taking apart.'" The two framings produce different games. The second one is what we want.

For Players the cost is smaller but real: a Player who sees the Galaxy as an Explore view gets no narrative scaffold for *why these moons live together.* That's the same complaint a learner already made to Barbara ("I don't understand the galaxy") and the reason the Galaxy is being demoted from default home in the v1.2 reframe. Even as Builder-only space, it needs to be more legible.

---

## §3 — Concrete fixes (priority order)

**Fix 1 — Cluster-name hover tooltip on the 3D Galaxy.** When the cursor sits on a planet for ≥ 400 ms, show a small glass plaque with:

- One-line plain-English cluster summary (40–60 words) — *not* the CCSSM cluster heading verbatim, which is jargon. Example for K.OA: *"In Kindergarten, kids learn that putting things together and taking them apart are the same idea seen from two sides. The five moons here are five ways to show that."*
- Sibling count and current Builder progress: *"5 moons · you've mastered 2."*

Effort: ~2 hrs. Add a `clusterSummary: string` field to the `Planet` type in `src/lib/galaxy-utils.ts`, populate it from a new `docs/cluster-summaries/{grade}.{domain}.md` file (or inline in a TypeScript module), render via the existing hover-detection in `galaxy-view.tsx`.

**Fix 2 — "This planet teaches…" overview card on planet-entry.** When the Builder clicks into a planet (`planet-view.tsx`), show a one-time card (dismissible, remembered in localStorage) in the top-right corner with:

- Cluster name (the friendly version, not the code)
- The same 40–60 word summary as Fix 1
- A "How these moons connect" diagram — a tiny sibling map showing the five moons as nodes with one-word relationship labels between them (e.g., for K.OA: K.OA.A.1 *"show it"* → K.OA.A.3 *"split it"* → K.OA.A.4 *"make 10"* → K.OA.A.5 *"fluency"*).

Effort: ~4 hrs. New component `<ClusterOverviewCard />` mounted inside `planet-view.tsx`'s existing return tree.

**Fix 3 — Sibling-moon ribbon on the standard panel.** When a Builder picks a moon and the standard panel opens (`src/components/standard/standard-panel.tsx`), show a ribbon along the top with the four sibling moons in the cluster, with the current moon highlighted. Each sibling tile shows the standard's plain-English mini-name ("Show addition 8 ways," "Decompose in more than one way") and the Builder's status on it (locked / available / mastered).

Effort: ~3 hrs. Use the existing cluster query in `galaxy-utils.ts` to fetch siblings; render as a horizontal strip above the existing standard panel content.

All three together: well under a day. Highest leverage is Fix 3, because it fires at the moment the Builder is about to build (when structural context matters most). Fix 1 is the cheapest and most visible to first-time visitors. Fix 2 is the deepest but redundant once Fixes 1 and 3 land — defer if budget is tight.

---

## §4 — Open question for Barbara

The cluster-summary content needs an authoring pass. Mr. Chesure's K.OA knowledge file has it for K.OA already; the other 21 clusters in K-8 OA / NBT / NF / MD / G / RP / NS / EE / SP do not. Suggested path: have Mr. Chesure generate a draft cluster-summary file per cluster (one batch run, ~$0.10 per cluster, ~$2.20 total), then Barbara reviews + edits the K-3 OA / NF / NBT subset by hand (those are the imminent build-queue domains). Lower-priority clusters can ship as Chesure drafts and be revised when a Builder first picks a standard in them.

---

## Sources

- Common Core State Standards Initiative. (2010). *Common Core State Standards for Mathematics — Introduction.* (Defines Focus, Coherence, and Rigor as the framework's three design principles.) [corestandards.org](https://corestandards.org/wp-content/uploads/2023/09/Math_Standards1.pdf)
- Common Core State Standards Initiative. (2023). *Progressions for the Common Core State Standards for Mathematics, compiled May 2023.* [mathematicalmusings.org](https://mathematicalmusings.org/wp-content/uploads/2023/05/Progressions.pdf) (Sets out cluster-level coherence for K-5 OA explicitly.)
- Schmidt, W. H., & Houang, R. T. (2012). Curricular coherence and the Common Core State Standards for Mathematics. *Educational Researcher*, 41(8), 294–308. (The empirical argument that coherence is the distinguishing feature of high-performing curricula.)
- National Council of Teachers of Mathematics. (2014). *Principles to Actions: Ensuring Mathematical Success for All.* NCTM. (Chapter on "Build procedural fluency from conceptual understanding" frames coherence as a teaching practice.)
- Roscoe, R. D., & Chi, M. T. H. (2007). Understanding tutor learning: Knowledge-building and knowledge-telling in peer tutors' explanations and questions. *Review of Educational Research*, 77(4), 534–574. (Reused from Audit 1 — the protégé-effect-needs-structural-scaffolds claim.)

## Files referenced

- `c:/projects/math-games-builder/src/components/graph/galaxy-view.tsx` (lines 184–192, 344–367)
- `c:/projects/math-games-builder/src/components/graph/planet-view.tsx` (lines 232–238)
- `c:/projects/math-games-builder/src/components/graph/knowledge-graph.tsx`
- `c:/projects/math-games-builder/src/lib/galaxy-utils.ts` (Planet type, lines 6–35)
- `c:/projects/math-games-builder/src/components/standard/standard-panel.tsx`
- `c:/projects/math-games-builder/docs/agents/chesure-knowledge/k-oa-progressions.md` (lines 28–46 — example cluster summary)
- `c:/projects/math-games-builder/docs/audit/02-standards-graph.md` (related: prerequisite-edge gaps)
