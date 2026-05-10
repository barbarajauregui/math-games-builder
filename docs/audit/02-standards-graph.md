# Audit 2 — Standards graph correctness (K-3 OA focus)

*Auditor: Claude (Opus 4.7) · Date: 2026-05-10 · Scope: K-3 Operations & Algebraic Thinking domain in `src/data/standards.json` (664 nodes / 541 edges total; 38 K-3 OA nodes; 105 edges touching K-3 OA).*

**Sources cited.** All page numbers refer to *Progressions for the Common Core State Standards for Mathematics* (Common Core Standards Writing Team, May 24, 2023 compiled edition; downloaded from `https://mathematicalmusings.org/wp-content/uploads/2023/05/Progressions.pdf`). The K-5 Operations and Algebraic Thinking chapter spans pp. 13-37. Standard text is from the CCSSM (corestandards.org).

---

## Summary

The K-3 OA portion of the graph is **substantially correct** and tracks the published Progressions. Of the 41 edges with both endpoints inside K-3 OA, **34 (~83%) match a relationship the Progressions explicitly assert**, 5 are defensible but weakly supported, and 2 carry the wrong edge type (`related` where `prerequisite` is justified). I identify **6 missing prerequisite edges** that the Progressions name explicitly (especially make-a-ten prerequisites K.OA.4 / K.OA.3 / K.NBT.1 → 1.OA.6, which are partly captured but K.NBT.1 → 1.OA.6 is missing entirely; and counting-cardinality prerequisites K.CC.4b/c → 1.OA.5/1.OA.6 which are missing).

Bottom line for the cross-age pilot: the immediate prerequisites of **3.OA.A.1** (the pilot standard) — `2.OA.C.3`, `2.OA.C.4`, and the `3.OA.A.1 → 3.OA.A.3 / B.5 / B.6` outflows — are all correct. **No blocker for the pilot.** But the K-1 chain feeding K.OA.A.1 (the already-shipped standard) is missing K.CC connections that Players-mode learners will need.

---

## Confirmed edges (both endpoints in K-3 OA, supported by the Progressions)

Each line states the edge as it appears in `standards.json`, then the supporting Progressions citation.

### Within Kindergarten

- `K.OA.A.1 → K.OA.A.2 [prerequisite]` — Representing addition/subtraction with objects/drawings/equations is the foundation; solving word problems within 10 follows. *Progressions p. 17-18 (Kindergarten introduction): "Students act out adding and subtracting situations… These concrete methods that show all of the objects are called Level 1 methods" introduces K.OA.1 and frames K.OA.2.*
- `K.OA.A.2 → K.OA.A.3 [prerequisite]` — Defensible: solving simple word problems with objects sets up the more abstract decomposition work. *Progressions p. 19-20: K.OA.3 is treated after Add-To/Take-From situations and uses the same Level 1 representations.*
- `K.OA.A.3 → K.OA.A.4 [prerequisite]` — Decomposing numbers ≤10 sets the stage for finding the partner that makes 10. *Progressions p. 25: "knowing the partner that makes 10 for any number (K.OA.4 sets the stage for this), knowing all decompositions for any number below 10 (K.OA.3 sets the stage for this)" — these are listed as parallel prerequisites for 1.OA.6, but K.OA.3 logically precedes K.OA.4 because the 10-partner is one specific decomposition.*
- `K.OA.A.3 → K.OA.A.5 [prerequisite]` — Decompositions enable fluency within 5. *Progressions p. 20: "Experience with decompositions of numbers and with Add To and Take From situations enables students to begin to fluently add and subtract within 5.K.OA.5"* (explicit citation).

### K → Grade 1

- `K.OA.A.2 → 1.OA.A.1 [prerequisite]` — Kindergarten problem subtypes (Add To / Take From / Put Together-Take Apart Result Unknown and Both Addends Unknown) extend in Grade 1 to all twelve subtypes. *Progressions p. 22, 29-30 ("Summary of K-2"): "Grade 1 Students … work with all of the problem situations, including all subtypes and language variants."*
- `K.OA.A.2 → 1.OA.B.3, 1.OA.B.4, 1.OA.C.6 [prerequisite]` — Word-problem fluency in K is the root of Grade 1 properties + fluency work. *Progressions p. 22-25.*
- `K.OA.A.3 → 1.OA.C.6 [prerequisite]` — *Progressions p. 25 (explicit): one of three named prerequisites for make-a-ten methods in 1.OA.6.*
- `K.OA.A.4 → 1.OA.C.6 [prerequisite]` — *Progressions p. 25 (explicit): partner-to-10 is named prerequisite for 1.OA.6.*
- `K.OA.A.5 → 1.OA.C.6 [prerequisite]` — Fluency within 5 extends to fluency within 10/20. *Progressions p. 31 ("Summary"): "fluency in adding and subtracting single-digit numbers has progressed from numbers within 5 in Kindergarten to within 10 in Grade 1 to within 20 in Grade 2."*

### Within Grade 1

- `1.OA.A.1 → 1.OA.A.2 [prerequisite]` — Two-addend word problems precede three-addend. Standard text alone supports this; Progressions p. 25 cites 1.OA.2 in the context of make-a-ten methods that build on 1.OA.1 work.
- `1.OA.A.1 → 1.OA.D.8 [related]` — *Progressions p. 23-24: 1.OA.1 and 1.OA.8 are cited together as the equation form (1.OA.8) and word-problem form (1.OA.1) of the same situation work; "Students … extend the range of numbers they deal with[1.OA.6] and the sophistication of the methods they use to add and subtract within this larger range.[1.OA.1, 1.OA.8]"*
- `1.OA.B.3 → 1.OA.B.4 [related]` — Properties (commutativity / associativity) and unknown-addend understanding develop together. *Progressions p. 25 cites 1.OA.3 and 1.OA.4 as parallel.*
- `1.OA.B.3 → 1.OA.C.6 [prerequisite]` — *Progressions p. 25 (explicit): "Level 3 methods involve decomposing an addend and composing it with the other addend… This relies on properties of operations.1.OA.3"*
- `1.OA.B.4 → 1.OA.C.6 [prerequisite]` — Subtraction-as-unknown-addend is the conceptual basis for "using the relationship between addition and subtraction" strategy named in 1.OA.6 standard text.
- `1.OA.C.5 → 1.OA.C.6 [prerequisite]` — Counting on (1.OA.5) is the named first strategy in 1.OA.6. *Progressions p. 30: "they learn how to find answers to these problems by counting on (a Level 2 method), and they understand and use this method.1.OA.5,1.OA.6"*
- `1.OA.C.6 → 1.OA.A.1 [related]` — Mutually reinforcing per p. 23-24 (cited above).
- `1.OA.D.7 → 1.OA.D.8 [prerequisite]` — Understanding the equal sign relationally precedes determining unknown numbers in equations. *Progressions p. 7 (overview): "it is possible for students in early grades to have a 'relational' meaning for the equal sign… (1.OA.7), rather than an 'operational' meaning."*

### G1 → G2

- `1.OA.A.1 → 2.OA.A.1 [prerequisite]` — Same problem-type framework, extended from within-20 to within-100, one-step to two-step. *Progressions p. 27-29: "Grade 2 students build upon their work in Grade 1 in two major ways.2.OA.1 They represent and solve situational problems of all three types which involve addition and subtraction within 100… and they represent and solve two-step situational problems."*
- `1.OA.C.6 → 2.OA.B.2 [prerequisite]` — Fluency within 10 → fluency within 20. *Progressions p. 28-29, p. 31 ("Summary"): explicit progression of fluency.*
- `1.OA.D.7 → 2.OA.C.3 [prerequisite]` — Equal-sign understanding underlies "write an equation to express an even number as a sum of two equal addends" (2.OA.3 standard text). *Progressions p. 32, line on 2.OA.3 / 2.OA.4: "set the stage for Level 2."*
- `1.OA.D.7 → 2.OA.C.4 [prerequisite]` — Same: 2.OA.4 requires writing equations. *Same passage.*

### G2 → G3

- `2.OA.A.1 → 3.OA.D.8 [prerequisite]` — Two-step Grade 2 problems extend to two-step Grade 3 problems with all four operations. *Progressions p. 29 (explicit): "Students solve two-step3.OA.8 and multistep4.OA.3 problems involving all four operations."*
- `2.OA.C.3 → 3.OA.A.1 [prerequisite]` — Doubles → equal addends → multiplication. *Progressions p. 32: "Standard 2.OA.3 relates doubles additions up to 20 to the concept of odd and even numbers and to counting by 2s (the easiest count-by in Level 2) by pairing and counting by 2s the things in each addend."* Sets up Level 2 multiplication.
- `2.OA.C.3 → 3.OA.D.9 [prerequisite]` — Even/odd patterns extend to arithmetic patterns. *Standard text (3.OA.9): "observe that 4 times a number is always even" — a direct extension of 2.OA.3.*
- `2.OA.C.4 → 3.OA.A.1 [prerequisite]` — Rectangular arrays as repeated addition is the immediate precursor to multiplication. *Progressions p. 32: "2.OA.4 focuses on using addition to find the total number of objects arranged in rectangular arrays (up to 5 by 5)."*

### Within Grade 3

- `3.OA.A.1 → 3.OA.A.3 [prerequisite]`, `3.OA.A.2 → 3.OA.A.3 [prerequisite]` — Interpreting products and quotients (3.OA.1, 3.OA.2) precedes using them to solve word problems (3.OA.3). *Progressions p. 32 introduces 3.OA.1-3 in this order.*
- `3.OA.A.1 → 3.OA.B.5 [prerequisite]`, `3.OA.A.2 → 3.OA.B.5 [prerequisite]` — Understanding multiplication/division precedes applying properties. *Progressions p. 33: 3.OA.5 introduced after 3.OA.1-3.*
- `3.OA.A.1 → 3.OA.B.6 [related]`, `3.OA.A.2 → 3.OA.B.6 [related]`, `3.OA.A.3 → 3.OA.B.6 [related]` — Division as unknown-factor relates to product/quotient interpretation. Defensible; Progressions p. 33 treats them in sequence.
- `3.OA.A.3 → 3.OA.D.8 [prerequisite]` — One-step word problems → two-step. Standard text alone supports this.
- `3.OA.B.5 → 3.OA.C.7 [prerequisite]` — Properties of operations are named strategies for fluency in 3.OA.7 (standard text: "using strategies such as… properties of operations").
- `3.OA.B.5 → 3.OA.D.9 [prerequisite]` — Properties of operations underlie pattern explanation. Standard text 3.OA.9: "explain them using properties of operations."
- `3.OA.B.6 → 3.OA.C.7 [prerequisite]` — Division as unknown-factor is a named strategy in 3.OA.7 standard text.

---

## Missing edges (in the Progressions, not in `standards.json`)

These are relationships the K-5 OA Progression states explicitly that the graph does not represent. None blocks the 3.OA.A.1 pilot, but they matter for K-1 coverage (where the K.OA.A.1 game is already shipped).

1. **`K.NBT.A.1 → 1.OA.C.6 [prerequisite]`** — *Progressions p. 25 (explicit, third named prerequisite for make-a-ten):* "knowing all teen numbers as 10 ` (e.g., 12 = 10 + 2, 15 = 10 + 5, see K.NBT.1 and 1.NBT.2b)." The graph captures K.OA.4 → 1.OA.6 and K.OA.3 → 1.OA.6 but omits the third prerequisite (teen numbers). **Add.**

2. **`K.CC.B.4b → K.OA.A.2 [prerequisite]`** (or to K.OA.A.1) — *Progressions p. 18 (cardinality):* "Students understand that the last number name said in counting tells the number of objects counted.K.CC.4b" — this cardinality understanding is what makes Level 1 ("count the total set") solutions work. The graph has no edge from any K.CC.B.4 substandard into K.OA.A.1 or K.OA.A.2. **Add at least one.**

3. **`K.CC.B.4c → K.OA.A.5 [prerequisite]`** — *Progressions p. 20 (explicit):* "Patterns such as 'adding one is just the next counting word'K.CC.4c …" make K.OA.5 fluency-within-5 possible. The graph already has `K.CC.B.4c → 1.OA.C.5`, which is also correct, but skips the K.OA.5 step. **Add.**

4. **`K.CC.B.5 → K.OA.A.1 [prerequisite]`** — Counting up to 20 objects is a precondition for representing addition/subtraction with objects. Implicit throughout K narrative (pp. 17-21). Currently missing. **Add.**

5. **`1.OA.B.4 → 1.OA.A.1 [prerequisite]` or `[related]`** — *Progressions p. 22-23 (explicit):* unknown-addend understanding (1.OA.4) is required to represent and solve Compare and Take From Change Unknown subtypes named in 1.OA.1. The graph has 1.OA.B.4 → 1.OA.C.6 but no link to 1.OA.A.1.

6. **`3.OA.A.1 → 3.OA.A.4 [prerequisite]` and `3.OA.A.2 → 3.OA.A.4 [prerequisite]`** — 3.OA.4 ("determine the unknown whole number in a multiplication or division equation") directly extends interpreting products (3.OA.1) and quotients (3.OA.2). The graph has only `3.OA.A.3 → 3.OA.A.4 [related]`. **Add direct edges and consider promoting 3.OA.A.3 → 3.OA.A.4 to `prerequisite`.**

7. **`3.OA.B.6 → 3.OA.A.4 [prerequisite]`** — 3.OA.4 problems include division (`5 = ⬚ ÷ 3`). Understanding division as unknown-factor (3.OA.6) is the conceptual key. Missing entirely.

---

## Contested or wrong edges

1. **`3.OA.A.3 → 3.OA.A.4 [related]`** — Should be `prerequisite`. 3.OA.4 is operationally the equation-form of 3.OA.3's word-problem work, and the standard for 3.OA.4 explicitly involves the same multiplication/division relationships students built in 3.OA.3.

2. **`3.OA.A.4 → 3.OA.C.7 [related]`** — Should be `prerequisite`. The standard text for 3.OA.7 says "using strategies such as the relationship between multiplication and division (e.g., knowing that 8 × 5 = 40, one knows 40 ÷ 5 = 8)" — that *is* what 3.OA.4 (and 3.OA.6) develops.

3. **`3.OA.C.7 → 3.OA.D.8 [related]`** — Should be `prerequisite` for the multiplication/division portions of two-step problems. Progressions p. 32 lists 3.OA.7 as foundational for further work; 3.OA.8 explicitly uses "the four operations."

4. **`1.OA.C.6 → 1.OA.A.1 [related]`** — Edge is correct but redundant with `K.OA.A.2 → 1.OA.A.1` and `1.OA.A.1 → 1.OA.D.8`. The progression treats 1.OA.6 strategies as *what students use to solve* 1.OA.1 problems (p. 23-24), so `1.OA.C.6 → 1.OA.A.1` as `related` is mildly defensible but the natural arrow is the other direction (problem types motivate strategies). Consider removing or flipping.

5. **`2.OA.C.3 → 3.OA.A.1`** is correctly typed `prerequisite` but is the *weaker* of the 2.OA.C → 3.OA.A.1 links. The dominant prerequisite is `2.OA.C.4 → 3.OA.A.1` (arrays → equal groups). Keep both, but if the UI shows weights, weight 2.OA.4 higher.

6. **`2.MD.B.5 → 2.OA.A.1 [related]`**, **`2.NBT.B.5 → 2.OA.A.1 [related]`** — Direction is reversed from how the Progressions present it. Per pp. 29-30, *2.OA.1 word problems extend to length situations (2.MD.5)* and *NBT computation supports OA word-problem solving*. These should be `2.OA.A.1 → 2.MD.B.5` (the Progressions phrase it that way) and `2.NBT.B.5 → 2.OA.A.1` is acceptable as-is (place-value methods enable word-problem solving within 100). Worth a closer look.

7. **`2.OA.A.1 → 4.NF.B.3a/b/c [prerequisite]`** — Defensible (Progressions intro p. 13-14: "the situational meanings for addition and subtraction remain the same for fractions as for whole numbers"), but redundant with `1.OA.B.3 → 4.NF.B.3a-c` and `1.OA.B.4 → 4.NF.B.3a-c`. Not wrong; consider whether this many parallel edges add information.

---

## Spot-check findings outside K-3 OA

Five edges chosen across grade bands and domains.

| Edge | Verdict | Citation |
|---|---|---|
| `K.CC.A.1 → 1.NBT.A.1` (`prerequisite`) | **Correct.** | Progressions Counting & Cardinality, p. 8: count-to-100 fluency is the precondition for the 1.NBT.1 "count to 120" extension. |
| `3.OA.B.5 → 6.EE.A.3` (`prerequisite`) | **Correct.** | OA Progression intro p. 13-14: "a property such as distributivity holds for all the number systems that students will study in K-12." 6.EE.3 is the explicit grade-6 application of the distributive property students built in 3.OA.5. |
| `3.OA.C.7 → 4.NBT.B.5` (`prerequisite`) | **Correct.** | NBT Progression p. 11 (Grade 4): "Students can multiply efficiently by single digit numbers, drawing on their understanding of decimal place value… they recall single-digit products fluently (3.OA.7)." |
| `3.OA.A.4 → 4.MD.A.3` (`prerequisite`) | **Defensible but weak.** 4.MD.3 (rectangle area/perimeter formulas) uses unknown-side reasoning (`A = ℓ × w` with one unknown), which mirrors 3.OA.4. Not explicit in Progressions, but the conceptual link is clean. Stronger prerequisite would be `3.MD.C.7c → 4.MD.A.3`. |
| `3.OA.B.6 → 5.NF.B.3` (`prerequisite`) | **Correct.** | Fractions Progression p. 8 (Grade 5): "students extend the meaning of division as expressed in 3.OA.6 (and 3.OA.2) to interpret a fraction as the division of the numerator by the denominator." |

No systematic issues surfaced. Edges in the graph are consistent with the Progressions; the main gap is the inverse — *missing* edges that the Progressions name explicitly (especially the K.CC → K.OA, K.NBT → 1.OA, and 3.OA.A.1/2 → 3.OA.A.4 chains).

---

## Proposed changes to `src/data/standards.json`

### Add (7 edges)

```json
{ "source": "K.NBT.A.1", "target": "1.OA.C.6", "type": "prerequisite" }    // Progressions p. 25 (explicit)
{ "source": "K.CC.B.4b", "target": "K.OA.A.2", "type": "prerequisite" }    // p. 18 (cardinality enables Level 1)
{ "source": "K.CC.B.4c", "target": "K.OA.A.5", "type": "prerequisite" }    // p. 20 (explicit)
{ "source": "K.CC.B.5",  "target": "K.OA.A.1", "type": "prerequisite" }    // implicit p. 17-21
{ "source": "1.OA.B.4",  "target": "1.OA.A.1", "type": "related" }         // p. 22-23
{ "source": "3.OA.A.1",  "target": "3.OA.A.4", "type": "prerequisite" }    // standard text + p. 32
{ "source": "3.OA.A.2",  "target": "3.OA.A.4", "type": "prerequisite" }    // standard text + p. 32
{ "source": "3.OA.B.6",  "target": "3.OA.A.4", "type": "prerequisite" }    // standard text 3.OA.4
```

### Modify edge type (3 edges)

```json
"3.OA.A.3 → 3.OA.A.4": "related"  →  "prerequisite"
"3.OA.A.4 → 3.OA.C.7": "related"  →  "prerequisite"
"3.OA.C.7 → 3.OA.D.8": "related"  →  "prerequisite"
```

### Investigate (no immediate change)

- `2.MD.B.5 → 2.OA.A.1 [related]` — direction may be backwards per Progressions p. 29.
- `1.OA.C.6 → 1.OA.A.1 [related]` — redundant; consider removing.
- `2.OA.A.1 → 4.NF.B.3a/b/c [prerequisite]` — defensible but parallel with stronger 1.OA edges.

### Do **not** change

The 3.OA.A.1 cluster (the cross-age pilot's home) is correctly wired:
- Inflows: `2.OA.C.3`, `2.OA.C.4` ✅
- Outflows: `3.OA.A.3`, `3.OA.B.5`, `3.OA.B.6`, `4.OA.A.1`, `4.NF.B.4a`, `5.NF.B.3/5/6`, `5.OA.A.2` ✅

The pilot is unblocked. The K-1 corrections (items 1-5 in "Add") would matter for the K.OA.A.1 game already shipped to Players, since they govern which kids the Library should surface that game to.
