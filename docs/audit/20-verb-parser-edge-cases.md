# Audit 19 — Verb-Parser Edge Cases (Step 3 of the New Build Flow)

*Date: 2026-05-10 · Scope: the verb→operation match check at Step 3 of the 5-step build flow per spec v2 §13 and Audit 10. · Method: cross-reference of the Cognitively Guided Instruction (CGI) problem-type taxonomy against the verbs the flow will see in mad-lib stories. Extends Audit 10 Q6 with concrete verb lists and a logging recommendation.*

---

## TL;DR

The Step 3 verb-parser will be right most of the time and wrong on a predictable, well-documented set of natural-English verbs. CGI's own literature shows even **teachers** misclassify Result-Unknown problem types **10–15% of the time** on the same ambiguous verbs that will show up in mad-libs. If the parser hard-blocks on a mismatch the Builder will hit a wall they can't reason past — the classic gaming-the-system trigger (Baker et al. 2009). The fix is structural, not a better prompt: **always soft-warn, never block; expose an "I'm sure" override; log every disagreement to a telemetry surface Barbara can review.** This is consistent with Audit 10 Q6 — what's added here is the concrete verb list, a confidence-tiered rubric, and the telemetry hook.

---

## 1. The CGI taxonomy (the standard, not invented)

Cognitively Guided Instruction (Carpenter, Fennema, Franke, Levi, Empson 1999 — and Riley, Greeno & Heller 1983 before them) classifies addition/subtraction word problems into **four Result-Unknown types**. The taxonomy is the closest thing math education has to a canonical problem-language map.

| Type | Action | Canonical verbs | Canonical operation |
|---|---|---|---|
| **Join** (Result Unknown) | Something is added to a set | *got, came, arrived, found, gave (to), put in, more, ended up with* | Addition |
| **Separate** (Result Unknown) | Something is removed from a set | *gave away, lost, ate, broke, left (the room), took, used up, spent* | Subtraction |
| **Part-Part-Whole** (Whole Unknown) | Two static subsets combine | *in all, altogether, together, total, both, between them* | Addition |
| **Compare** (Difference Unknown) | Two sets compared | *more than, fewer than, taller than, the difference, how many more, how many fewer* | Subtraction |

Multiplication/division adds two more (Equal Groups and Multiplicative Compare) with their own verb sets:

| Type | Canonical verbs | Canonical operation |
|---|---|---|
| **Equal Groups** | *each, per, every, groups of, packs of, rows of, share equally* | Multiplication or division |
| **Multiplicative Compare** | *times as many, twice as, three times as much, half as many* | Multiplication or division |

---

## 2. Verbs the parser will get wrong (the predictable failures)

The verbs below are the documented edge cases. They appear plain-English natural in mad-libs but are operationally ambiguous — the **same verb maps to different operations depending on which quantity is unknown.**

| Verb / phrase | Looks like | Can also be | Why it breaks the parser |
|---|---|---|---|
| **"how many in all"** | Part-Part-Whole → addition | Equal-groups multiplication ("how many cookies in all if 3 plates of 4") | Verb is operation-blind; depends on whether grouping is implied. |
| **"left over" / "left"** | Separate → subtraction | Comparison → subtraction OR division-with-remainder | Two structurally different problems, same surface verb. |
| **"share" / "shared"** | Equal-groups division | Part-Part-Whole addition ("they shared $20 between them" can mean each got $10 OR they pooled $20) | Direction of the action is ambiguous in English. |
| **"each"** | Equal-groups multiplication | Distributive subtraction ("they each lost 2") | "Each" modifies a per-unit count but the operation depends on context. |
| **"altogether"** | Part-Part-Whole → addition | Comparison or multiplication if grouped | Synonym for "in all" with the same defects. |
| **"more"** | Compare → subtraction (find the difference) OR Join → addition | Both. "5 more came" = addition. "5 more than Sam" = subtraction. | The same word triggers opposite operations. **This is the single highest-frequency mistake in the CGI literature.** |
| **"gave"** | Separate → subtraction (gave away) | Join → addition (gave to me) | Direction-dependent. |
| **"how many more"** | Compare → subtraction | — | Usually right, but kids occasionally write "how many more came" which is Join, not Compare. |
| **"twice as / half as"** | Multiplicative Compare → multiplication | Compare → subtraction (in some K-2 phrasings) | Ratio language young Builders use loosely. |
| **"and"** | Part-Part-Whole → addition | Could be sequence, not combination ("she ran and jumped") | Connectives confuse the parser when the math is hidden in nouns, not the connector. |

Riley, Greeno & Heller (1983) — the foundational study CGI builds on — found **even fluent adults misclassify these types ~10–15% of the time on Compare problems specifically.** Carpenter et al. (1999) replicated this with teachers. The parser will not do better than fluent adults on the same problem class; it will probably do worse on Compare and "more"/"share" specifically.

---

## 3. Why a hard block is the wrong UX

If Lesson 2 fires as a **blocker** ("This story is addition but you picked subtraction — fix it"), and the parser is wrong, the Builder sees:

1. They wrote a correct story.
2. The system says they're wrong.
3. They can't proceed.
4. They can see the system is wrong.

This is exactly the configuration Baker, Corbett, Roll & Koedinger (2008–2009) identified as the **gaming-the-system trigger** — when the user observes the system being demonstrably wrong, they shift from learning behavior to evasion behavior (rewriting the story to satisfy the parser, not the math). Worse: the most articulate Builders — the ones whose stories use natural Compare or Equal-Groups phrasing — are the ones most likely to hit the false-positive wall. The parser punishes good English.

Audit 10 Q6 already concluded "always soft-warning, never blocker." This audit extends with the *operational* spec.

---

## 4. The recommended UX (concrete)

**Soft warning. Builder is always the authority.** The card phrasing:

> "This story sounds like it might want **multiplication** instead of **addition**. Is that right? \[Yes, that's what I meant] · \[Actually, mine is correct — I'm sure]"

Behavior rules:

1. **Never block.** The "I'm sure" override always proceeds the Builder to Step 4.
2. **Two clicks, not a dialog tree.** No "explain why" follow-up; that's gaming-bait.
3. **The downstream Agent Ladder (Stages 1–4) is the construct-validity gate.** If the Builder overrides Step 3 and the math really is wrong, the Critic catches it at Stage 1 or 2. Step 3 is a *first-pass surface check*, not a gate.
4. **Log every "I'm sure" click** to a telemetry surface (Firestore `verb_parser_disagreements/{gameId}`): the story text, the parser's verdict, the standard, the Builder's chosen operation, and whether the game ultimately passed the Critic. After ~100 disagreements Barbara can see whether the parser is reliably wrong on specific verbs (high override + high Critic-pass rate) and either retrain the prompt or remove the warning for that verb class.

---

## 5. A confidence-tiered fallback rubric

The parser should self-report confidence and the UX should branch on it. Three tiers:

| Parser confidence | What the parser sees | UX |
|---|---|---|
| **HIGH** (>0.85) — story uses a single canonical verb cleanly (*"3 more came," "she gave away 2," "twice as many"*) | One CGI type strongly favored; matches Builder's pick | Silent — no card shown. |
| **HIGH** (>0.85) — single canonical verb, but **mismatch** with Builder's pick | One CGI type strongly favored; conflicts with Builder | Show soft-warning card with one suggestion. |
| **MEDIUM** (0.5–0.85) — one of the ambiguous verbs from §2 | Two CGI types plausible | Show "I see two ways to read this — which did you mean?" card with **both options**, Builder picks. **No "wrong" framing.** |
| **LOW** (<0.5) — story has no recognizable verb of operation (e.g., free-write contamination, very short text) | No clear type | Show "I couldn't read the math in this story — can you check that someone has to add/subtract/multiply/divide?" card. Builder re-reads, confirms or edits. No mismatch flag. |

The parser prompt should explicitly emit `{operation: "...", confidence: 0.X, alternatives: [...]}` so the UI can branch deterministically rather than re-parsing the LLM verdict on the client.

---

## 6. What this audit does NOT recommend

- **Don't try to fix the parser by listing the ambiguous verbs in the prompt.** The literature shows even fluent humans get these wrong ~10–15% of the time; the LLM will not exceed that ceiling on a single-pass parse. The fix is UX (Builder-as-authority), not prompt engineering.
- **Don't add a Mr. Chesure "verb lesson" to the flow.** The point of the new flow is to remove front-loaded teaching. The card is a *check*, not a lesson.
- **Don't auto-correct the Builder's operation pick.** Silent corrections are worse than soft warnings — they remove the Builder from the loop.

---

## 7. Implementation summary

- Step 3 parser returns `{operation, confidence, alternatives}`.
- UI branches per §5 confidence tiers.
- All non-HIGH-and-matching cases show a card; cards are advisory; "I'm sure" always proceeds.
- Every disagreement (parser said X, Builder picked Y) is logged to `verb_parser_disagreements/{gameId}` with story text, standard, and final Critic verdict for later analysis.
- ~2 hours of work, mostly UI + one Firestore write.

---

## Sources

- Carpenter, T. P., Fennema, E., Franke, M. L., Levi, L., & Empson, S. B. (1999). *Children's Mathematics: Cognitively Guided Instruction.* Heinemann. — CGI Result-Unknown types and verb taxonomy.
- Riley, M. S., Greeno, J. G., & Heller, J. I. (1983). Development of children's problem-solving ability in arithmetic. In H. P. Ginsburg (Ed.), *The Development of Mathematical Thinking* (pp. 153–196). Academic Press. — foundational misclassification rates on Compare problems.
- Baker, R. S. J. d., Corbett, A. T., Roll, I., & Koedinger, K. R. (2008). Developing a generalizable detector of when students game the system. *User Modeling and User-Adapted Interaction*, 18(3), 287–314. — gaming-the-system trigger and false-positive cost.
- Baker, R. S. J. d., et al. (2009). Educational software features that encourage and discourage gaming the system. — extending Baker 2008 to UI design rules.
- `c:/projects/math-games-builder/docs/audit/09-build-flow.md` — Audit 09 (build-flow runtime state).
- `c:/projects/math-games-builder/docs/audit/10-new-build-flow.md` — Audit 10 Q6 (this audit extends it).
