# Phase 1B — K.CC PRIMARY engine additions (draft for review)

*Date: 2026-05-11 · Author: Phase 1B drafter · Status: DRAFT for Barbara's review — do NOT merge directly into `src/data/standard-mechanic-map.json`.*

## Review summary

**New PRIMARY engines proposed (totals after addition):**

| Standard | Before | Added (PRIMARY) | After |
|---|---|---|---|
| K.CC.A.1 — Count to 100 by ones and by tens | 0 | `hundred-board`, `sequence-builder`, `pattern-machine` *(all conditional — see notes)* | **3 (conditional)** |
| K.CC.A.2 — Count forward from a given number | 0 | `hundred-board`, `sequence-builder`, `free-collect` *(all conditional/REVISABLE)* | **3 (conditional)** |
| K.CC.A.3 — Write/represent numerals 0–20 | 0 | `number-frames`, `free-collect`, `cuisenaire-rods` *(numeral-quantity pairing half only; handwriting half deferred)* | **3 (partial-coverage)** |
| K.CC.B.4b — Cardinality + order-irrelevance | 1 | `cuisenaire-rods`, `bar-model` | **3** |
| K.CC.B.4c — "One more" successor | 2 | `cuisenaire-rods` | **3** |
| K.CC.C.7 — Compare two written numerals | 2 | `number-line-drop` *(REVISABLE-but-PRIMARY-for-this-context)*, `bar-model` | **3–4** |

**Standards where reaching 3 PRIMARY required judgment calls:**

- **K.CC.A.1, A.2, A.3** — these are *production* skills (recite, count-on, write) with no clean fit in an interpretation-focused engine library. Audit 13 §4 calls all three out as Mechanic Inventor opportunities and explicitly says K.CC.A.* are "essentially uncovered." Rather than mark them PRIMARY at full strength, the proposals below promote `hundred-board` (REVISABLE in Audit 11) to a **conditional PRIMARY** *only if its proposed fix ships* (drag-and-place-in-order rather than click-correct-cell). For K.CC.A.3, the standard has two parts — handwriting (out of engine scope) and pairing-numeral-with-quantity (in scope); proposed PRIMARY engines serve only the second half, and the rationale states this explicitly.
- **K.CC.C.7** — `number-line-drop` is REVISABLE per Audit 11 (needs tighter snap + numerical readout), but the existing engine is already PRIMARY-quality for the K.CC.C.7 numeral-compare context where the kid just needs to place 7 between 6 and 8. Same context-dependent-verdict pattern Audit 13 §5 already applied to `size-picker`.

**Biggest judgment call:** treating `hundred-board` as PRIMARY for K.CC.A.1 and K.CC.A.2 contingent on its Audit 11 fix shipping. The alternative is to leave K.CC.A.1 and K.CC.A.2 with **0 PRIMARY** and explicitly admit the engine library cannot serve them — that is what Audit 13 §4 already says. The proposal here is to bundle the engine-fix as a PRIMARY-pre-condition rather than wait for a brand-new Mechanic Inventor engine. **If Barbara prefers the honest "0 PRIMARY until new engines are built" position, drop the `hundred-board` and `sequence-builder` entries below; that leaves the JSON closer to the Audit 13 status quo.**

---

## How to read the snippets below

Each block shows the new entries to be **appended** to the existing `primary: [...]` array in `src/data/standard-mechanic-map.json` for that standard. Do not replace existing entries. Where a standard's `coverageGap` field would change (because the count crosses 3), the snippet shows the proposed updated value.

---

## K.CC.A.1 — Count to 100 by ones and by tens

**Current PRIMARY count:** 0. **Goal:** 3+.

```json
{
  "engineId": "hundred-board",
  "rationale": "PRIMARY conditional on Audit 11 fix (forward-counting-trail mechanic where kid taps cells in order 1, 2, 3...). The 100-chart IS the visible representation of the standard's verbatim text 'Count to 100 by ones'; tapping cells in sequence enacts the production skill. Critic Criterion 4 (Construct Validity): the win condition becomes 'tap cells in sequence' — i.e., production-of-the-count — not pattern-matching. Skip-by-10s mode also serves the 'by tens' half of the standard. NOT PRIMARY until the REVISABLE fix ships."
},
{
  "engineId": "sequence-builder",
  "rationale": "Adapted as a count-the-bubbles forward-utterance engine: machine emits a starting number; child drags successive tiles in order; chime only when full forward run is correct. Critic Criterion 4: requires production of the next number names in stable order — the standard's named skill ('Count to 100 by ones'). Caveat: the engine's default framing is hidden-rule discovery (3.OA territory); using it for K.CC.A.1 requires re-skinning, which is a Builder-side decision in scenario picker, not an engine change."
},
{
  "engineId": "pattern-machine",
  "rationale": "Same adaptation as `sequence-builder`: a 'count-by-tens' rule machine where the child experiments with starting values and observes the +10 pattern, then locks in the rule. Serves the 'by tens' half of the standard verbatim text. Critic Criterion 4: the win condition is recognizing the +10 successor pattern across the decade words 10, 20, 30..., which is exactly what the NBT Progression p. 55 calls out as the pedagogical purpose of counting by tens at K."
}
```

**Proposed `coverageGap` update:**
```
"coverageGap": "Conditional coverage. 3 PRIMARY engines proposed but all three carry caveats — `hundred-board` requires its REVISABLE fix to ship, and `sequence-builder`/`pattern-machine` require Builder-side scenario re-skinning for K.CC.A.1 (they were designed for hidden-rule-discovery in higher grades). Audit 13 §4 Mechanic Inventor opportunity — a voice-or-tap-in-sequence count-the-bubbles engine — remains the right long-term fix."
```

---

## K.CC.A.2 — Count forward from a given number

**Current PRIMARY count:** 0. **Goal:** 3+.

```json
{
  "engineId": "number-frames",
  "rationale": "PRIMARY conditional on the existing REVISABLE fix already listed in this standard's entry (add 'counting-on' mode: pre-fill first frame with N counters, child taps additional counters and count starts at N+1). With the fix, this directly enacts the standard's verbatim text 'Count forward beginning from a given number ... instead of having to begin at 1.' Critic Criterion 4: win condition is taps-after-N, not taps-from-1; structurally enforces counting-on. Move from REVISABLE to PRIMARY once shipped."
},
{
  "engineId": "hundred-board",
  "rationale": "PRIMARY conditional on the K.CC.A.1 trail fix plus a 'start-from-N' variant. With the kid placed at cell N and asked to tap forward through N+1, N+2..., the engine directly serves K.CC.A.2's verbatim 'count forward beginning from a given number.' Critic Criterion 4: the win condition cannot be satisfied by recounting from 1 — the starting cell is fixed at N."
},
{
  "engineId": "free-collect",
  "rationale": "Adapted as 'pre-stocked field' mode: the field starts with N dots already present (a given starting cardinality); child taps additional clusters and the running count begins at N+1, not 1. Critic Criterion 4: the kid's taps produce a count that begins from N — exactly the standard's verbatim 'count forward beginning from a given number.' Cardinality-commit at end matches Chesure's K.OA cardinality-commit pattern."
}
```

**Proposed `coverageGap` update:**
```
"coverageGap": "Conditional coverage. 3 PRIMARY engines proposed but all three require feature additions: `number-frames` needs the existing REVISABLE 'counting-on' fix; `hundred-board` needs the K.CC.A.1 trail fix plus a start-from-N variant; `free-collect` needs a pre-stocked-field mode. The Mechanic Inventor opportunity remains the cleanest path. Critical foundational gap for 1.OA strategies."
```

---

## K.CC.A.3 — Write/represent numerals 0–20

**Current PRIMARY count:** 0. **Goal:** 3+.

> **Important scoping note (in every rationale below):** The standard has two parts. Part A is "Write numbers from 0 to 20" — handwriting / stroke-formation, which is a fine-motor production skill outside the current engine library's scope (no engine validates pen-strokes). Part B is "Represent a number of objects with a written numeral 0-20" — pairing a quantity with a numeral, which IS engine-codable. The PRIMARY engines below serve Part B only. Part A's coverage requires a Mechanic Inventor trace-the-numeral engine (Audit 13 §4) and is explicitly out of scope for this proposal.

```json
{
  "engineId": "number-frames",
  "rationale": "Quantity-numeral pairing (Part B only): child fills the ten-frame to a target count and commits the matching numeral on a number-pad at end. Critic Criterion 4: the cardinality-commit IS the numeral-quantity pairing — child cannot commit until the frame matches the numeral. Range 0–20 (two ten-frames) covers the standard's full range. Handwriting (Part A) NOT covered — see scoping note."
},
{
  "engineId": "free-collect",
  "rationale": "Quantity-numeral pairing (Part B only): a numeral 0–20 is shown as the target; child taps to collect that many dots into the field. The field-size IS the cardinality, paired with the numeral target. Critic Criterion 4: win condition requires the field to match the numeral — direct numeral-to-quantity mapping. Includes the 0-case (target = 0, no taps) which the standard's verbatim text explicitly names ('0 representing a count of no objects'). Handwriting (Part A) NOT covered."
},
{
  "engineId": "cuisenaire-rods",
  "rationale": "Quantity-numeral pairing (Part B only): a numeral 0–20 is shown; child snaps rods until the train-length matches the numeral. The rod length encodes the cardinality (Chesure §2.1 'length IS the count' for unit rods). Critic Criterion 4: numeral on screen, rod-length on table; the kid IS pairing them. Range 0–20 works with 10-rods + unit rods (the 10-rod itself is the standard's 'first use of 0 as placeholder' anchor named in the Progressions excerpt). Handwriting (Part A) NOT covered."
}
```

**Proposed `coverageGap` update:**
```
"coverageGap": "Partial coverage: 3 PRIMARY engines now serve the numeral-quantity pairing half of the standard, but the numeral-WRITING half (fine-motor stroke production) has no engine in the current library. A trace-the-numeral engine with stroke-path validation remains the Mechanic Inventor opportunity from Audit 13 §4."
```

---

## K.CC.B.4b — Cardinality + order-irrelevance

**Current PRIMARY count:** 1 (`free-collect`). **Goal:** 3+.

```json
{
  "engineId": "cuisenaire-rods",
  "rationale": "Cardinality enforced (rod length IS the count) AND order-irrelevance is structural — the same target-length train can be assembled by snapping rods in any order (5 = 2+3 = 3+2 = 1+4 = 4+1 in rod-order; the final length is invariant). Critic Criterion 4: the standard's verbatim text 'the number of objects is the same regardless of ... the order in which they were counted' is enacted by the engine — child can build the same total train rod-order-agnostically and verify the length is unchanged."
},
{
  "engineId": "bar-model",
  "rationale": "Cardinality enforced (unit-rod count = bar length) AND order-irrelevance demonstrated by building the same bar via different unit-rod sequences. Critic Criterion 4: the standard's 'same regardless of arrangement or order' clause is supported by side-by-side bars built in different orders that visibly match in length. Currently SECONDARY for K.CC.B.4b but the engine's structural support for order-irrelevance promotes it to PRIMARY when the Builder uses a 'same total, different build order' scenario."
}
```

(Existing SECONDARY entries for `number-frames`, `cuisenaire-rods`, `bar-model` should remain — `cuisenaire-rods` and `bar-model` move up to PRIMARY but the SECONDARY entries are harmless documentation of the partial case; alternatively, remove the duplicates. Barbara's call.)

**Proposed `coverageGap` update:**
```
"coverageGap": null
```

---

## K.CC.B.4c — "One more" successor

**Current PRIMARY count:** 2 (`number-frames`, `free-collect`). **Goal:** 3+.

```json
{
  "engineId": "cuisenaire-rods",
  "rationale": "Swap a unit rod onto the end of a train to enact the +1 successor; the new train-length is visibly 'one larger' than the previous. Critic Criterion 4: the standard's verbatim text 'each successive number name refers to a quantity that is one larger' is enacted physically — the child sees and feels the single-unit increment. Currently SECONDARY (the listed rationale says 'available but not the engine's primary action') but when the Builder picks a 'add one more' scenario (e.g., 'one more cookie on the plate'), the +1 increment becomes the engine's primary action, qualifying it as PRIMARY for this standard."
}
```

**Proposed `coverageGap` update:** unchanged (`null`).

---

## K.CC.C.7 — Compare two written numerals 1–10

**Current PRIMARY count:** 2 (`sorting-lane`, `leaderboard-fix`). **Goal:** 3+.

```json
{
  "engineId": "number-line-drop",
  "rationale": "Two numerals presented; child places them on a number line and the relative position IS the compare-result. Critic Criterion 4: the standard's verbatim text 'compare two numbers between 1 and 10 presented as written numerals' is enacted — the kid places the numerals and reads off greater/less by physical position. PRIMARY-as-is for the simple K numeral-compare context (the Audit 11 REVISABLE flag for 'tighter snap + numerical readout' applies to higher-grade decimal/fraction use, not to integer 1–10 compare). Same context-dependent-verdict pattern Audit 13 §5 applied to `size-picker`."
},
{
  "engineId": "bar-model",
  "rationale": "Two numerals shown; child builds a bar for each and aligns the ends — longer bar = greater numeral. Critic Criterion 4: the comparison is by physical bar-length, with the numerals visible alongside; the kid IS comparing the numerals via the bar-length encoding. Currently PRIMARY for K.CC.C.6 (object-group compare); promotion to PRIMARY for K.CC.C.7 follows because the engine accepts numeral input directly, not just object groups."
}
```

**Proposed `coverageGap` update:** unchanged (`null`).

---

## Optional adjacent additions (SECONDARY / REVISABLE)

Not core to Phase 1B but flagged for Barbara's review:

- **K.CC.A.1 SECONDARY:** `cuisenaire-rods` — building a 10-rod-by-10-rod train serves the by-tens half of the standard (each 10-rod IS a decade). Less direct than a 100-chart but a valid physical model. Currently listed only as a generic candidate; not yet in the JSON for K.CC.A.1.
- **K.CC.A.3 REVISABLE:** `hundred-board` — already REVISABLE for K.CC.A.1 (forward-counting-trail fix); same fix indirectly supports K.CC.A.3 because the 100-chart shows numerals 0–100 in their canonical written form, and a 'tap the numeral matching this many counters' variant would serve numeral-quantity pairing. One fix, two standards served.
- **K.CC.B.4c SECONDARY:** `sequence-builder` — successor-rule discovery (+1 machine) is structurally a one-more lesson. Currently no entry for K.CC.B.4c; could be added as SECONDARY with the same Builder-side scenario re-skin caveat as the K.CC.A.1 entry.

---

*End of draft. Awaiting Barbara's review before merging into `src/data/standard-mechanic-map.json`.*
