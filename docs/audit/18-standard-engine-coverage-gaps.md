# Audit 17 — Standard-engine coverage gaps (most standards have no curated guidance)

*Date: 2026-05-10 · Auditor: per-standard coverage review against `src/data/standards.json` + `src/data/standard-mechanic-map.json` · Builds on Audit 11 (engine library) and Audit 13 (standard-mechanic mapping).*

## §1 — Summary

When a Builder picks a moon (a specific math standard), the app is supposed to show them a curated short list of game engines that actually teach that standard's specific named skill. Today, **that curated list exists for 19 of 517 standards (3.7%).** For the other 498, the Builder is handed the unfiltered 66-engine library and asked to pick one — most of which teach the wrong math for what they chose.

- **Leaf standards in `src/data/standards.json`:** 517 (the math standards a Builder can actually pick — not cluster headers).
- **Standards with curated engine mapping in `src/data/standard-mechanic-map.json`:** 19 (K.OA.A.1–A.5, 3.OA.A.1–A.4, K.CC.A.1–A.3, K.CC.B.4/4a/4b/4c/5, K.CC.C.6/C.7).
- **Standards with no curated mapping:** 498.
- **Of the 19 mapped, standards with 3 or more PRIMARY engines** (the threshold Audit 13 used for "real working choice"): **13.** The other 6 are under-covered: K.OA.A.3, K.OA.A.4, 3.OA.A.2, 3.OA.A.4, K.CC.A.1, K.CC.A.2, K.CC.A.3.
- **Net standards with a real working set of engines:** 13 of 517 — about **2.5%.**

## §2 — What this means for a Builder right now

Concrete example. A 5th-grader picks the moon for **4.NF.A.1** ("Explain why a fraction a/b is equivalent to a fraction (n × a)/(n × b)"). The app has no entry for 4.NF.A.1 in the mechanic map. The picker falls back to the full 66-engine list. The Builder sees, side by side:

- `cuisenaire-rods` (which actually fits 4.NF.A.1 well — equivalent fractions via rod-length comparisons)
- `bar-model` (also fits — Singapore CPA canonical for fraction equivalence)
- `snake-math` (drills whole-number addition — wrong math)
- `falling-blocks-math` (drills whole-number addition — wrong math)
- `assembly-line` (multiplication-as-equal-groups — adjacent but not the named skill)
- `share-the-pizza` (division-as-partitioning — wrong operation)
- `shortest-route` (whole-number distance addition — wrong math)
- ...and 59 others, most of which are wrong for fractions.

The Builder has no way to know which two are right. They pick by name and visual. The Critic stage will reject the game if they pick wrong, but **the Critic costs roughly $0.05–$0.20 per check** and the Builder gets a bounce-back that says "this engine doesn't measure the named skill" without telling them which engine would have. Net effect: wasted Builder time, wasted token spend on critique runs, and discouraged Builders.

This is the same pattern for every standard outside the 19 mapped ones — every grade 1 standard, every grade 2 standard, all of fractions, all of measurement, all of geometry, all of grades 4–8, all of high school.

## §3 — Why the right engines exist but the mapping doesn't

Audit 11 already produced the engine-level verdicts: 30 VETTED, 18 REVISABLE, 18 HIDDEN. Many of those 48 usable engines map to standards far beyond K.OA / K.CC / 3.OA. The Cuisenaire-rod engine genuinely teaches fraction equivalence (Singapore CPA literature), bar-model engines teach ratio and proportion (Progressions doc Ratios & Proportional Relationships), balance-scale engines teach the meaning of the equals sign at grade 1 (Carpenter, Levi, Franke), and so on.

**The work that's missing is the per-standard verdict** — for each standard, which of the 48 usable engines is PRIMARY, which is SECONDARY, which is REVISABLE. Audit 13 did this for 19 standards in roughly a day. The remaining 498 are the same shape of work, parallelizable, well-defined.

## §4 — Tiered fix plan

Doing all 498 standards at once is unnecessary. Most standards have low immediate priority because no Builder is likely to pick them in v1. The tiering below targets where Builders actually land first.

**Tier 1 — Pilot-blocking (30 standards, ~30 hours).**

Grade K–3 number-and-operations: the rest of K.OA / K.CC / K.NBT, all of 1.OA, all of 1.NBT, all of 2.OA, all of 2.NBT, and the rest of 3.OA / 3.NBT. This is the universe the **cross-age pilot at Barbara's school** lives in: K–2 Players consuming games built by grade 5–7 Builders on 3.OA.A.1 and on K.OA bridge standards. Without curated engines here, the pilot Builder gets confused even on the standards adjacent to the one the pilot targets.

Per-standard authority: the K–5 Operations and Algebraic Thinking Progression (mathematicalmusings.org), Open Up Resources K–3 units, Math Learning Center K–3 visual models.

**Tier 2 — Fractions and decimals (~40 standards, ~40 hours).**

All of 3.NF, all of 4.NF, all of 5.NF, plus 4.NBT and 5.NBT (decimal fraction extension). Fractions are where peer-taught math has the highest documented impact gap — most older Builders themselves have shaky fraction sense, and rebuilding it through the protégé loop is the strongest learning argument for the whole app. Source: Siegler et al. 2012 ("Early predictors of high school mathematics achievement") — fraction knowledge in grade 5 predicts algebra achievement in high school more strongly than any other variable measured.

Authority: Number and Operations–Fractions Progression (mathematicalmusings.org).

**Tier 3 — Everything else (~428 standards, ~428 hours).**

Grades 4–5 measurement and data, all of geometry, all of grades 6–8, statistics and probability, all of high school. Lower urgency because Builders in the v1 user range (grades 5–10, building for K–4) overwhelmingly pick K–3 number-and-operations standards.

## §5 — Effort estimate

Audit 13's pace was ~30 minutes per standard (engine-by-engine verdict + one-sentence rationale + Shortcut Adversary check). Some standards will be faster (no engine remotely fits — short NOT_APPLICABLE list); some slower (rich coverage, lots of borderline calls). **Average ~1 hour per standard** is a defensible estimate, including JSON write and lightweight peer review.

- Tier 1: ~30 standards × 1 hour = ~30 hours, or about a focused work-week.
- Tier 2: ~40 standards × 1 hour = ~40 hours, another work-week.
- Tier 3: ~428 standards × ~30 min average = ~210 hours; can be parallelized across multiple background agents at low per-token cost since the engine library is already audited.

Total to full coverage: roughly **280 hours of focused mapping work**, or 7 weeks at one full-time pass, or 3 weeks if parallelized across three agents. Most of the cost is already paid: the engine library is audited (Audit 11), the agent rubric is settled (Audit 6), the per-standard methodology is settled (Audit 13).

## §6 — What this blocks

**Specifically blocks two near-term pilots:**

1. **The K–2 Player pilot.** Players in grades K–2 at Barbara's school playing peer-built games. Currently only K.OA.A.1 and K.OA.A.3 have games; the K.CC counting standards (which are the foundation under K.OA) have **zero** PRIMARY engines mapped. A K Player who hasn't yet mastered K.CC.A.2 (count forward from any number) cannot find a peer-built game on it because no Builder has been steered toward an engine that teaches it.
2. **The 3.OA.A.1 cross-age pilot.** 3.OA.A.1 itself is well covered (8 PRIMARY engines per Audit 13). But the Builder is a grade 5–7 learner whose own fraction sense is shaky; if they wander to a 4.NF moon to build a related game, they hit the unfiltered 66-engine list. The pilot's "Builder learns by building" claim weakens when the Builder spends their time fighting an engine picker instead of designing math.

**Also blocks the Library/Galaxy redesign in a softer way.** The spec v2 calls for the Galaxy to show moons brightening based on game-count and Builder demand. If 498 of 517 moons can't realistically be built well, the Galaxy's "build next" beacon will keep pointing Builders at moons they'll fail at, and the moons will stay dim by structural under-coverage rather than under-demand.

## §7 — Recommended next step

1. **Block out a week** for Tier 1 (30 standards) before the next cross-age pilot dispatch. This is the highest-leverage knowledge work currently sitting unbuilt.
2. **Reuse Audit 13's methodology verbatim:** verbatim CCSS text → named skill identification → engine candidate list from Audit 11's operation-level map → per-engine PRIMARY/SECONDARY/REVISABLE verdict + one-sentence rationale → Shortcut Adversary check.
3. **Build the 1.OA Mr. Chesure knowledge file in parallel** (analogous to `chesure-knowledge/k-oa-progressions.md`). The 1.OA cluster is the natural bridge between K.OA and 3.OA and is the largest unmapped pilot-adjacent gap.
4. **Hold the Builder picker UI behind a "this moon's engines are still being curated" message** for unmapped standards rather than showing the unfiltered 66-engine list. Today's silent fall-back is the worst case: it looks like a real choice but it isn't. A "coming soon — pick a different moon for now" copy is honest and protects the Critic budget.

## Sources

- Common Core State Standards Initiative. (2023). *Progressions for the Common Core State Standards for Mathematics, compiled May 2023.* mathematicalmusings.org. The K–5 OA Progression, the K–5 Number and Operations in Base Ten Progression, the 3–5 Number and Operations–Fractions Progression, and the Ratios and Proportional Relationships Progression are the per-standard authorities used to scope what each Tier 1 / Tier 2 standard's named skill actually is.
- Siegler, R. S., Duncan, G. J., Davis-Kean, P. E., Duckworth, K., Claessens, A., Engel, M., Susperreguy, M. I., & Chen, M. (2012). Early predictors of high school mathematics achievement. *Psychological Science*, 23(7), 691–697. — the empirical basis for prioritizing fractions as Tier 2 (grade 5 fraction knowledge is the strongest single predictor of high school math attainment in the dataset).
- Carpenter, T. P., Levi, L., Franke, M. L., & Zeringue, J. K. (2005). Algebra in elementary school: Developing relational thinking. *ZDM Mathematics Education*, 37(1), 53–59. — basis for the grade 1 equals-sign work that several of the unmapped 1.OA standards require.
- Open Up Resources K–5 Math (openupresources.org) and Math Learning Center Bridges K–5 (mathlearningcenter.org) — the proven-pedagogy authorities the project's positioning doc directs all curriculum mapping to adapt from.
- `src/data/standards.json` (517 leaf standards, 547 prerequisite edges).
- `src/data/standard-mechanic-map.json` (19 standards mapped as of Audit 13).
- `docs/audit/11-engine-library-per-engine.md` (engine-level VETTED/REVISABLE/HIDDEN list).
- `docs/audit/13-standard-mechanic-mapping.md` (per-standard methodology, 19 mapped).
