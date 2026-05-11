# K.OA.A.1 Build Flow — Implementation Spec

*Date: 2026-05-11 · Owner: Barbara · Status: DRAFT for Barbara's review · Implements: 5-step build flow per Audit 10, K.OA.A.1 specifically*

> **v2 update 2026-05-11 evening — five changes from Audit 14 (equity / EL / cultural fit / stereotype threat):**
> 1. Coin Jar → **Coin Jar** with selectable currency items (US-specific coin assumption was an EL/cultural barrier)
> 2. K.OA.A.1 PRIMARY engines reduced from 4 to **3** (Bar Model demoted to SECONDARY per de Koning et al. 2022; returns to PRIMARY at 1.OA / 2.OA / 3.OA)
> 3. Verb-operation lookup is now **advisory only** — pre-fills Step 3 for convenience but NO soft warning when Builder picks the "wrong" operation (Moschkovich corpus: keyword strategies fail for ELs)
> 4. **Equity Reviewer added as Stage 1.5** of the runtime ladder — single Haiku call (~$0.005) per submission, soft-warn never blocks. For template builds this is the ONLY stage that fires visibly.
> 5. **Critic now has 6 criteria** (was 4) — Criterion 5 Equation Rendering (soft-reject; alternate left/right placement of recorded equations), Criterion 6 Affective Tone (soft-warn; math-anxiety markers).

> **Required reading before implementation:**
> - `docs/product-positioning.md` (north star)
> - `docs/audit/10-new-build-flow.md` (the 5-step flow + 5 locked adjustments)
> - `docs/audit/11-engine-library-per-engine.md` (per-operation engine map)
> - `docs/agents/chesure-knowledge/k-oa-progressions.md` (K.OA.A.1 pedagogical authority)
> - `docs/audit/07-koa-games.md` (current game gaps)
> - `docs/superpowers/specs/2026-05-10-library-design.md` §15.1 (Foundation already shipped)
>
> **What this spec is:** the complete buildable design for the K.OA.A.1 Builder flow. An engineer can implement from this without further design decisions.
>
> **What this spec is NOT:** code. Engineers wire it; this doc says what to wire.

---

## §1 — At-a-glance

A Builder picking K.OA.A.1 walks through **five short screens**, in order:

1. **Pick a scenario** — they choose from 10 cards (4 from the K.OA.A.1 standard's named real-world applications + 6 evergreen). Each card is a familiar setting like Coin Jar, Fish Tank, Bakery, or Classroom.
2. **Fill a mad-lib story** — they pick from dropdowns and type a few words to fill in 3 templates the scenario offers, producing a 2-3 sentence story like *"Grandma has 4 pennies. She gives you 3 more pennies. How many pennies now?"* Then a one-click confirmation card asks them to confirm the math is load-bearing in the story (Lesson 1, universalized).
3. **Set the math** — the operation (+ or −) and the two numbers are pre-filled by parsing the verb in the Builder's story; the Builder confirms or edits. K.OA.A.1's range cap (within 10) is enforced here. If the verb suggests addition but the Builder picks subtraction (or vice versa), a soft inline tip appears — never a block.
4. **Pick a mechanic** — the Builder sees a filtered card grid of vetted addition/counting engines from the registry (per Audit 11 §3). Each card shows a looping animated preview. A small "see more mechanics →" link surfaces the full engine list with a soft warning.
5. **Playtest + submit** — the Builder must beat their own game once. The 4-stage Critic ladder runs: Stages 1 and 3 (Critic) skip invisibly because templates are pre-vetted; Stages 2 and 4 (Adversary) run visibly. On all-pass, the game saves with `pending_review` and lands in the Guide queue.

A reduced standard panel (one-line header) sits above the flow. "Learn More" and "Play to Master" are tucked into a side menu, not in the flow.

---

## §2 — Step 1: Pick a scenario

### UI

A 2×5 grid of 10 scenario cards. Each card: large emoji icon at top, bold scenario title, a single sentence below describing the setting. On hover/tap, the card lifts and the focus ring (Pandora cyan) appears. Selecting a card advances to Step 2.

A small caption above the grid reads: *"Pick a place where adding or taking away matters."*

### The 10 scenarios

**Group A — drawn from the K.OA.A.1 standard's natural real-world domains** (already documented in `docs/k-oa-a-1-scenarios.md` plus one extension):

| # | Title | One-sentence card description | Visual hint |
|---|---|---|---|
| 1 | **Coin Jar** | A jar where coins get added or spent. Items dropdown lets the Builder pick what fills the jar (coins / beads / marbles / pebbles / buttons). | 💰 — drawn coins dropping into a glass jar |
| 2 | **Fish Tank** | An aquarium where fish are added or scooped out. | 🐟 — goldfish over a blue gradient tank background |
| 3 | **School Bus** | A bus picking kids up at stops (or dropping them off). | 🚌 — yellow bus with little circles for kid-windows |
| 4 | **Snack Plate** | A plate where snacks are placed or eaten. | 🍪 — round plate with cookies stacked |

**Group B — evergreen scenarios** (familiar to K-2 across cultures and curricula; cleared by Mr. Chesure for K.OA.A.1):

| # | Title | One-sentence card description | Visual hint |
|---|---|---|---|
| 5 | **Bakery** | Muffins and bread coming out of the oven, or sold to customers. | 🥐 — bread loaves on a baker's tray |
| 6 | **Toy Store** | Toys put on shelves or bought by kids. | 🧸 — teddy bear with a price tag |
| 7 | **Farm** | Animals coming into the barn or going out to graze. | 🐄 — cow next to a red barn |
| 8 | **Sports** | Goals scored, points added, or players running on the field. | ⚽ — soccer ball on grass |
| 9 | **Birthday Party** | Balloons inflated or popped; guests arriving or leaving. | 🎈 — cluster of balloons |
| 10 | **Classroom** | Crayons in a bin, books on a shelf, kids at the rug. | ✏️ — pencil with a stack of paper |

**Locked rule from Audit 10 R5:** each of these 10 scenarios MUST ship with **≥ 3 mad-lib story templates** (see §3). 30+ templates total at Step 2.

### What's removed

- "Write your own scenario" — gone for v1 per Audit 10 §Q3 (returns as v1.1 unlock after the Builder ships their first game).
- The current 3-step Scenario Gate (`scenario-gate.tsx`) — gone. Lesson 1's content folds into §3's confirmation card.

### Data location

Scenarios live in a new file: `src/data/scenarios/k-oa-a-1.ts`. Each entry has `{id, title, description, emoji, illustrationAsset, templates: StoryTemplate[]}`.

---

## §3 — Step 2: Mad-lib story templates

### UI

Once a scenario is picked, the Builder sees a card with **three template choices** at the top (small previews — first sentence of each). They pick one. The picked template renders as a fill-in form: each `[BLANK]` becomes either a dropdown or a small text input directly inside the rendered story prose. As they fill blanks, the story updates live.

A "Preview" panel shows the fully-rendered story underneath. A "Continue" button is disabled until all blanks are filled.

### Blank types

| Token | Type | Source |
|---|---|---|
| `[N1]`, `[N2]` | Number input, range 1–9 | typed by Builder; auto-clamped to [1, 9] |
| `[ITEMS]` | Dropdown | scenario's item list (~6 options) |
| `[CHARACTER]` | Dropdown | scenario's character list (~6 options) |
| `[VERB-PHRASE]` | Dropdown | scenario's verb-phrase list (split into "add verbs" and "subtract verbs", ≥ 4 of each) — see §4 verb table |

The Builder is never asked to free-write more than a single noun or number. This honors Audit 10 §Q3 (constraint as pedagogical work).

### The 30 templates

Below: 3 templates per scenario. **Each template's structure is fixed; only the listed dropdowns and number inputs are editable.** The templates are designed so that the parsed verb cleanly maps to + or − (see §4).

#### 1. Coin Jar (generalized from "Penny Jar" per Audit 14)

- **T1 (add):** `[CHARACTER]` has `[N1]` `[ITEMS]` in their jar. They `[VERB-PHRASE]` `[N2]` more `[ITEMS]`. How many `[ITEMS]` are in the jar now?
  - CHARACTER: Grandma / Dad / Mei / Jamal / a friend / the storekeeper
  - **ITEMS: coins / beads / marbles / pebbles / buttons / shells** *(was hard-coded "pennies"; generalized for cultural fit per Audit 14)*
  - VERB-PHRASE: get / find / earn / are given
- **T2 (subtract):** `[CHARACTER]` has `[N1]` `[ITEMS]`. They `[VERB-PHRASE]` `[N2]` of them. How many `[ITEMS]` are left?
  - VERB-PHRASE: spend / lose / give away / drop
- **T3 (add):** There are `[N1]` `[ITEMS]` on the table. `[CHARACTER]` `[VERB-PHRASE]` `[N2]` more from the couch. How many `[ITEMS]` in all?
  - VERB-PHRASE: brings / adds / piles on / stacks

#### 2. Fish Tank

- **T1 (add):** The tank has `[N1]` fish. `[CHARACTER]` `[VERB-PHRASE]` `[N2]` new fish. How many fish are swimming now?
  - CHARACTER: Mom / Dad / the pet store owner / Lucia / Ben / the diver
  - VERB-PHRASE: drops in / adds / brings home / pours in
- **T2 (subtract):** There are `[N1]` fish in the tank. `[CHARACTER]` `[VERB-PHRASE]` `[N2]` to a friend's tank. How many fish are left?
  - VERB-PHRASE: gives / scoops out / moves / takes
- **T3 (add):** `[N1]` goldfish are swimming. `[N2]` more goldfish `[VERB-PHRASE]` from behind the rock. How many goldfish in all?
  - VERB-PHRASE: come out / appear / swim out / arrive

#### 3. School Bus

- **T1 (add):** `[N1]` kids are on the bus. At the next stop, `[N2]` more kids `[VERB-PHRASE]`. How many kids are on the bus now?
  - VERB-PHRASE: get on / climb on / hop in / join
- **T2 (subtract):** The bus has `[N1]` kids. At the school stop, `[N2]` kids `[VERB-PHRASE]`. How many kids are still on the bus?
  - VERB-PHRASE: get off / leave / hop out / step down
- **T3 (add):** `[CHARACTER]` counts `[N1]` kids on the bus. Then `[N2]` more `[VERB-PHRASE]`. How many kids does the driver see?
  - CHARACTER: the driver / Mr. Lee / Ms. Patel / the helper
  - VERB-PHRASE: come aboard / get on / show up / arrive

#### 4. Snack Plate

- **T1 (add):** The plate has `[N1]` `[ITEMS]`. `[CHARACTER]` `[VERB-PHRASE]` `[N2]` more. How many `[ITEMS]` on the plate now?
  - ITEMS: cookies / crackers / grapes / orange slices / cheese cubes / carrot sticks
  - VERB-PHRASE: puts on / adds / piles up / brings out
- **T2 (subtract):** There are `[N1]` `[ITEMS]` on the plate. `[CHARACTER]` `[VERB-PHRASE]` `[N2]`. How many `[ITEMS]` are left?
  - VERB-PHRASE: eats / takes / shares away / nibbles
- **T3 (subtract):** `[N1]` `[ITEMS]` sit on the plate. The dog `[VERB-PHRASE]` `[N2]` of them. How many `[ITEMS]` are still there?
  - VERB-PHRASE: steals / grabs / sneaks / runs off with

#### 5. Bakery

- **T1 (add):** The baker pulls `[N1]` `[ITEMS]` from the oven. Then `[N2]` more `[VERB-PHRASE]`. How many `[ITEMS]` are on the tray?
  - ITEMS: muffins / loaves of bread / croissants / cookies / cupcakes / rolls
  - VERB-PHRASE: come out / are added / are placed / appear
- **T2 (subtract):** `[N1]` `[ITEMS]` are on the shelf. A customer `[VERB-PHRASE]` `[N2]`. How many `[ITEMS]` are left on the shelf?
  - VERB-PHRASE: buys / takes / asks for / picks up
- **T3 (add):** `[CHARACTER]` mixes `[N1]` `[ITEMS]`. The helper mixes `[N2]` more. How many `[ITEMS]` in all?
  - CHARACTER: the baker / Aunt Rosa / Chef Lee / Sami
  - VERB-PHRASE: *(fixed verb in story prose — "mixes")*

#### 6. Toy Store

- **T1 (add):** The shelf has `[N1]` `[ITEMS]`. The clerk `[VERB-PHRASE]` `[N2]` more. How many `[ITEMS]` on the shelf?
  - ITEMS: teddy bears / toy cars / dolls / blocks / kites / yo-yos
  - VERB-PHRASE: stocks / adds / lines up / puts out
- **T2 (subtract):** The store has `[N1]` `[ITEMS]`. A kid `[VERB-PHRASE]` `[N2]`. How many `[ITEMS]` are left on the shelf?
  - VERB-PHRASE: buys / takes home / picks / chooses
- **T3 (subtract):** `[N1]` `[ITEMS]` sit in a row. `[CHARACTER]` `[VERB-PHRASE]` `[N2]` to wrap as gifts. How many `[ITEMS]` are still on the shelf?
  - CHARACTER: the clerk / Mom / the cashier / Auntie
  - VERB-PHRASE: takes / pulls / wraps up / removes

#### 7. Farm

- **T1 (add):** `[N1]` `[ITEMS]` are in the barn. `[N2]` more `[VERB-PHRASE]` from the field. How many `[ITEMS]` in the barn now?
  - ITEMS: cows / sheep / chickens / horses / goats / pigs
  - VERB-PHRASE: come back / wander in / are led in / arrive
- **T2 (subtract):** The barn has `[N1]` `[ITEMS]`. `[CHARACTER]` `[VERB-PHRASE]` `[N2]` out to graze. How many `[ITEMS]` are still in the barn?
  - CHARACTER: the farmer / Grandpa / Tía Marta / the helper
  - VERB-PHRASE: lets / sends / leads / shoos
- **T3 (add):** `[CHARACTER]` sees `[N1]` `[ITEMS]` near the pond. Then `[N2]` more `[VERB-PHRASE]`. How many `[ITEMS]` in all?
  - VERB-PHRASE: walk over / show up / appear / come closer

#### 8. Sports

- **T1 (add):** The team has `[N1]` points. They `[VERB-PHRASE]` `[N2]` more goals. How many points now?
  - VERB-PHRASE: score / earn / get / make
- **T2 (add):** `[N1]` players are on the field. `[N2]` more `[VERB-PHRASE]` from the bench. How many players in all?
  - VERB-PHRASE: run on / sub in / come out / join
- **T3 (subtract):** There are `[N1]` players on the field. `[N2]` `[VERB-PHRASE]` for water. How many players are still on the field?
  - VERB-PHRASE: leave / sub out / step off / run off

#### 9. Birthday Party

- **T1 (add):** The party has `[N1]` `[ITEMS]`. `[CHARACTER]` `[VERB-PHRASE]` `[N2]` more. How many `[ITEMS]` are at the party?
  - ITEMS: balloons / cupcakes / hats / presents / candles / streamers
  - CHARACTER: Mom / Dad / Lucia / the clown / your friend / the host
  - VERB-PHRASE: blows up / brings / hangs up / sets out
- **T2 (subtract):** There are `[N1]` `[ITEMS]` at the party. `[N2]` `[VERB-PHRASE]`. How many `[ITEMS]` are left?
  - VERB-PHRASE: pop / are eaten / are taken home / break
- **T3 (add):** `[N1]` guests are at the party. `[N2]` more guests `[VERB-PHRASE]`. How many guests in all?
  - VERB-PHRASE: arrive / show up / walk in / come

#### 10. Classroom

- **T1 (add):** The bin has `[N1]` `[ITEMS]`. `[CHARACTER]` `[VERB-PHRASE]` `[N2]` more from the cart. How many `[ITEMS]` in the bin now?
  - ITEMS: crayons / books / pencils / markers / erasers / blocks
  - CHARACTER: the teacher / Ms. Reyes / Mr. Park / the helper
  - VERB-PHRASE: drops in / adds / pours in / puts in
- **T2 (subtract):** The shelf has `[N1]` `[ITEMS]`. `[N2]` kids `[VERB-PHRASE]` one each. How many `[ITEMS]` are left on the shelf?
  - VERB-PHRASE: take / borrow / pick / grab
- **T3 (add):** `[N1]` kids are at the rug. `[N2]` more kids `[VERB-PHRASE]` from the table. How many kids on the rug?
  - VERB-PHRASE: come over / walk in / sit down / join

### Lesson 1 confirmation card (universal post-Step-2 gate)

Per Audit 10 R1 (locked): after the Builder fills the mad-lib and clicks Continue, before advancing to Step 3, **a single card pops over the story preview** asking them to confirm the math is load-bearing.

**Card design:**

```
Quick check ✨

Read your story:
"[rendered story]"

In your story, does the answer to the math actually
change what happens? Or could the story play out the
same either way?

[ Yes — the math matters ]   [ Hmm, needs work ]
```

- "Yes — the math matters" → advance to Step 3.
- "Hmm, needs work" → card replaces with a one-line nudge: *"Try a story where the answer changes a count, an amount, or what happens next."* The Builder returns to the mad-lib editor with their current values preserved. No "wrong" badge, no penalty.

This card fires for **every Builder, every first build of a session, regardless of scenario or template**. It implements R1 mitigation (universal Lesson 1 firing) and replaces the prior 3-step Scenario Gate.

**No two-version generator** — for K.OA.A.1, the universal phrasing above is sufficient. We do not need to render a real-vs-sprinkles A/B comparison per template; the parsed-from-Builder's-own-words story is the test object. (A future v1.1 could add an LLM-generated "could this play out the same?" alternate version, but it's not in scope here.)

### Data location

`src/data/scenarios/k-oa-a-1.ts` exports each scenario's templates as structured objects. Mad-lib rendering and dropdown/input wiring lives in `src/components/builders/madlib-editor.tsx` (new).

---

## §4 — Step 3: Set the math

### UI

A horizontal row, centered:

```
[ Operation: + ▼ ]   [ N1: 4 ]   ●   [ N2: 3 ]   =   [ 7 (computed) ]
```

- **Operation dropdown:** two options, `+` and `−`. Pre-filled by verb-parsing (see logic below).
- **N1, N2:** number inputs constrained to integers 1–9. Pre-filled from the mad-lib's `[N1]` and `[N2]`. Editable.
- **Operator glyph (●):** renders the chosen operation between N1 and N2.
- **Result:** auto-computed and displayed. Read-only. For subtraction, if N2 > N1, result shows "—" and an inline tip appears (see below).

Below the row:
- **Soft warning slot** (Lesson 2): one line, gray text, only appears when conditions trigger. Never blocks "Continue."
- **Range tip slot:** one line, gray text, appears when result > 10 or N2 > N1 in subtraction.
- "Back" and "Continue" buttons.

### Verb-parsing logic

The verb chosen in `[VERB-PHRASE]` at Step 2 maps to + or − through a static lookup table. **No LLM call is needed** — we own the dropdowns, so we know the verb. (The LLM-parsing version is a future fallback for v1.1 free-write.)

**Operation lookup (starter list — covers all verbs in the §3 templates):**

| Verb / phrase | Maps to | Notes |
|---|---|---|
| get, gets | + | |
| find, finds | + | |
| earn, earns | + | |
| are given, is given | + | |
| brings, bring | + | |
| adds, add | + | |
| piles on, stacks, piles up | + | |
| drops in, drop in | + | |
| pours in, pour in | + | |
| comes out, come out | + | |
| appear, appears | + | |
| arrive, arrives | + | |
| join, joins | + | |
| get on, gets on, climbs on, hops in | + | |
| come aboard, comes aboard | + | |
| show up, shows up | + | |
| put on, puts on | + | |
| set out, sets out | + | |
| are placed, is placed | + | |
| are added, is added | + | |
| stocks, stock | + | |
| lines up, line up | + | |
| puts out, put out | + | |
| comes back, come back, wander in, are led in | + | |
| walk over, walks over, come closer, comes closer | + | |
| score, scores | + | |
| make, makes (a goal/point) | + | |
| run on, runs on, sub in, subs in | + | |
| blows up, blow up (balloons) | + | |
| hangs up, hang up | + | |
| walks in, walk in, sits down, sit down | + | |
| come over, comes over | + | |
| mixes, mix | + | |
| spend, spends | − | |
| lose, loses | − | |
| give away, gives away | − | |
| drop, drops (off/from set) | − | context-dependent; templates use it only in subtractive frames |
| gives (to a friend) | − | |
| scoops out, scoops | − | |
| moves (away to) | − | |
| takes, take | − | |
| eats, eat | − | |
| nibbles, nibble | − | |
| shares away, share away | − | |
| steals, steal | − | |
| grabs (away), grab (away) | − | |
| sneaks (away with), sneak (away with) | − | |
| runs off with, run off with | − | |
| buys, buy | − | (from-stock context) |
| asks for, ask for | − | |
| picks up, pick up | − | (from-stock context) |
| pulls, pull | − | |
| wraps up, wrap up | − | |
| removes, remove | − | |
| lets out, sends out, leads out, shoos | − | |
| sub out, subs out, step off, run off | − | |
| pop, pops | − | |
| are eaten, is eaten | − | |
| are taken home, is taken home | − | |
| break, breaks | − | |
| borrow, borrows | − | |
| get off, gets off, leaves, hops out, steps down | − | |

**Important:** the verb lookup is the single source of truth. If a Builder picks an "add" verb and overrides the operation dropdown to `−`, Lesson 2's soft warning fires.

### Lesson 2 — REMOVED in v2 (Audit 14 §1 rank-1 fix)

The verb-mismatch soft warning is **dropped entirely**. Moschkovich's 20-year corpus on bilingual math learners argues that keyword strategies ("more = +", "left = −") fail for English Learners; even with curated dropdowns, hard-coding the verb→operation mapping and warning when the Builder disagrees reifies the very keyword strategy the literature argues against.

**What stays:** the verb lookup table (`src/lib/verb-operation-map.ts`) still pre-fills the Step 3 operation dropdown for convenience. The lookup is now **advisory only** — labeled in code as such.

**What goes:** the `verbHintShows` / Lesson 2 soft-warning UI. No more "your story sounds like X usually means Y" tip. The Builder owns the operation choice without our keyword-heuristic second-guessing them.

**Optional telemetry (no UX):** still log `verbOperationDisagreement` events to `learning_data` for later analysis — but the kid never sees it.

Authoritative reference: `docs/agents/shared-knowledge/equity-language-in-math.md` (Audit 14 fix #1).

### Range constraint logic

K.OA.A.1 stays within 10 (totals ≤ 10, addends ≤ 9 in practice). Enforce:

1. **N1, N2 input clamp.** Inputs reject values outside 1–9 with a small shake animation.
2. **Result > 10 tip.** If N1 + N2 > 10 (addition), show below the row:
   - *"K.OA.A.1 is for numbers within 10 — try smaller numbers."*
   - "Continue" is still enabled, but the tip stays. (Soft per Audit 10 spirit; the Critic Stage 2 will catch a Builder who pushes through.)
3. **N2 > N1 subtraction tip.** If operation is − and N2 > N1, result renders as "—" and tip reads:
   - *"You're taking away more than you have — that goes below zero. Try a smaller number, or switch to addition."*
   - Continue disabled until corrected (this one is a hard block; below-zero results aren't K-grade math).

### Auto-pre-fill behavior on Step 3 entry

When Step 3 mounts:
- N1 ← Builder's `[N1]` value from Step 2
- N2 ← Builder's `[N2]` value from Step 2
- Operation ← lookup of Builder's `[VERB-PHRASE]` (table above)

If the Builder edits and returns to Step 2 then comes back, the editable values are preserved (no overwrite).

---

## §5 — Step 4: Pick a Game Type

*User-visible terminology per Audit 17: throughout this step's UI strings, use the term **"Game Type"** (capitalized). The underlying code identifier remains `mechanicId` / `MechanicPicker` (developer-facing). Avoid "Game Option," "Mechanic," "Template" in any Builder- or Player-visible copy.*

### UI

A 3-column grid of mechanic cards (responsive: 2-col on tablet, 1-col on phone). Each card:

- **Animated preview** at top (4–6 second silent loop, 200×140 px box) showing the mechanic in motion.
- **Display title** — the user-friendly name (not the engine ID).
- **One-sentence description** — what the Player will do.
- **K.OA.A.1 mode tags** — small pills below description showing which of the 8 representational modes from the standard this engine covers (objects / fingers / mental / drawings / sounds / acting / verbal / equation).
- **Hover/focus:** Pandora cyan ring; card slightly lifts.

Selecting a card advances to Step 5. A small `< Back` arrow returns to Step 3.

Below the grid:
- A subtle text link: *"see more mechanics →"*. Tapping it opens a modal with **all** addition + counting engines (vetted set + the "valid for related operations" set), prefaced by:
  - *"Mechanics outside K.OA.A.1's usual set sometimes don't teach the math the same way. Pick carefully."*
  - The modal grid renders the same card layout. Picking any card here records `mechanicOverride: true` in the build state for Critic Stage 2 to scrutinize harder.

### Filtered set for K.OA.A.1 (the cards Builders see)

**Updated 2026-05-11 per Audit 13** (`docs/audit/13-standard-mechanic-mapping.md` + `src/data/standard-mechanic-map.json`). The standard-level mapping demoted the operation-level 13-engine list to **4 PRIMARY engines** for K.OA.A.1. Per Barbara's direction, **we only show mechanics we're absolutely sure teach the specific named skill**. The "see more mechanics" override is **dropped**.

| Engine ID | Display title | Description shown on card | Animated preview (loop hint) | K.OA.A.1 modes covered |
|---|---|---|---|---|
| `number-frames` | **Ten-Frame Counters** | Drop counters into ten-frames, then count them all together. | Counters fall into a ten-frame, two frames slide together, hand taps each. | objects, equation |
| `free-collect` | **Catch & Count** | Catch falling items into a basket, then count what you got. | Items fall, basket catches, count number rises only when player taps. | objects, equation |
| `cuisenaire-rods` | **Length Rods** | Snap two colored rods end-to-end to make a longer one. | Red rod + green rod snap into a single longer rod against a length scale. | objects, drawings, equation |
| ~~`bar-model`~~ | ~~**Bar Model**~~ | **Demoted to SECONDARY 2026-05-11 per Audit 14.** de Koning et al. 2022 "double-edged sword" finding for K-grade inconsistent-keyword problems + EL-accessibility concern. Bar Model returns to PRIMARY at 1.OA / 2.OA / 3.OA. | n/a — not shown at K.OA.A.1 Step 4 | n/a |

That's **3 cards** — exactly the K.OA.A.1 PRIMARY list as of v2 (Bar Model demoted to SECONDARY per Audit 14). All three shown by default in a 3-column row on desktop (or 1-column on phone). No "see more" link.

**Why the demotions (from Audit 13):**
- `shortest-route`, `delivery-run`, `map-builder`, `map-distance` → NOT_APPLICABLE: numbers-as-distances pattern exceeds K.OA.A.1's "within 10" range.
- `stack-to-target`, `free-balance`, `conveyor-belt`, `shape-decomposer`, `free-build` → SECONDARY: valid for general addition fluency but not the canonical discrete-counter form Chesure §2.1 specifies for K.OA.A.1 representation.

### Engines NOT shown for K.OA.A.1

Per Audit 13, only the 4 PRIMARY engines listed above appear. Everything else is hidden — no override surface, no "see more" link. The Builder picks from exactly the verified set.

This is a v2 tightening from spec v1 (which used the operation-level Audit 11 map and showed 13 engines with an override). Per Barbara's direction 2026-05-11: only show mechanics we're 100% sure teach the specific named skill.

### "Show all mechanics" override — DROPPED in v2

The Q3-supersession lock from 2026-05-11: dropping the override surface entirely. The standard-level mapping in `src/data/standard-mechanic-map.json` is the single source of truth; Step 4 reads from `standards["K.OA.A.1"].primary` and shows exactly those cards.

If a Builder wants to use a mechanic outside the PRIMARY list, the answer is: that mechanic doesn't belong on K.OA.A.1 — pick a different standard, or wait for the Mechanic Inventor to design one that fits.

### Data location

The card data (display title, description, animated preview asset path, mode tags) lives in extensions to `src/lib/game-engines/game-option-registry.ts`, with a new `koaA1Card?: { ... }` field per engine. The K.OA.A.1 filter is a static export `STEP_4_K_OA_A_1_ENGINE_IDS` in the same file.

---

## §6 — Step 5: Playtest + submit

### UI

A single screen with three vertical sections:

1. **Live game preview** at top, ~70% of viewport. The Builder's chosen engine, parameterized with the Step 3 numbers, the Step 1 scenario's themed assets, and the Step 2 story rendered as the round prompt.
2. **"You must beat your own game once"** banner above the preview. Tracks the Builder's play state — round count, whether they've completed a successful round.
3. **"Submit" CTA** below — disabled until the Builder beats one round. Tooltip on hover: *"Play and finish one round before submitting."*

### Beat-the-game gate

The Builder plays the engine until they reach a successful round-end state (the engine's normal completion event). Until then, Submit is disabled. This preserves the existing playtest-gate behavior — Audit 10 §E6.

### Critic ladder behavior on Submit

**Updated 2026-05-11 evening per Audit 14:** the Adversary ladder is **dropped for template-based builds** (no Builder code surface = no runtime exploit surface). HOWEVER, the **Equity Reviewer agent runs at Stage 1.5** as a single Haiku call (~$0.005 per build, <5% total ladder cost) because the Builder's CONTENT choices (scenario, story, character names, items, theme) can still introduce equity issues that template structure can't pre-vet.

For the K.OA.A.1 template flow:
- **Critic Stages 1, 2, 3, 4 SKIPPED INVISIBLY.** Build state records `criticLadder: skipped (template-only build).`
- **Equity Reviewer Stage 1.5 RUNS VISIBLY** (single Haiku call). Per `docs/agents/the-equity-reviewer.md`, it returns up to 5 SOFT-WARN entries the UI shows as dismissable tips. Never blocks; Builder can dismiss any/all warnings and submit.
- **The hard quality gate at submit is still: did the Builder beat their own game once?** That's enforced by the playtest gate.

UI flow at submit:
1. Builder clicks Submit.
2. "Reviewing your scenario for accessibility…" appears briefly (single Haiku call).
3. If 0 warnings: card slides up with "Game sent to your guide!" and confetti.
4. If 1+ warnings: card slides up with the warning(s) shown as friendly tips, each with the suggested fix. Two buttons: "Revise" (returns to the relevant step with state preserved) and "Submit anyway" (proceeds to the guide queue with warning content stored on the game record for the guide to consider during approval).

For paste-HTML / hand-coded paths (NOT in this spec — they live in a separate Advanced surface), the Critic + Adversary ladder still runs visibly per the foundation work shipped in Foundation Fix #1.

### On submit

The build state writes a `games/{gameId}` record with `status: pending_review`, `standardId: K.OA.A.1`, `builderUid`, and the full state snapshot. Game lands in the Guide's queue (already wired per spec §15.1 Foundation).

UI: a confetti burst, *"Your game is in review!"* with a count-up of the Builder's stars/tokens (token award rules unchanged for v1: 2000 on Guide approval, not on submit).

Cost per template build: ~$0 in agent fees (down from ~$0.08 in spec v1). Compute-cost stays only for the one Anthropic call inside the engine if any (engines like `number-frames` don't make one).

### Save-state preservation

If the Builder closes the tab mid-flow at any step, build state persists in `localStorage` and on Firestore-as-draft. Returning resumes at the last completed step.

---

## §7 — Side menu

A discreet hamburger icon in the top-right of the build flow. Tapping opens a right-side drawer (or full-screen sheet on mobile). The drawer contains:

| Item | Behavior |
|---|---|
| **Learn More about K.OA.A.1** | Renders the existing standard panel content from the explanations API (`/api/explanations?standardId=K.OA.A.1`). Plain-English standard text, why it matters, the worked example, kid-misconceptions list. **Not modal** — a full pane. "Back" returns to the build flow at the same step. |
| **Play to Master** | Deep-link to `/library?skill=K.OA.A.1` — surfaces published K.OA.A.1 games. Opens in a new tab so the build flow isn't lost. |
| **Switch to Player mode** | Uses the existing global `<ModePill />` action — flips the user's `preferredMode` and routes to `/library`. Asks for confirmation if there's an unsaved build draft. |
| **Builder profile / settings** | Routes to `/profile` (existing). |
| **Exit & save draft** | Saves current build state as draft, returns to Library home. |

Above the menu items, a 1-line standard header is **also** shown at the top of the build flow itself (not in the drawer): `K.OA.A.1 — Adding and taking away within 10` with a small "?" icon that opens the same Learn More pane. This is the only standard-panel surface in the flow itself; the prior multi-section panel is removed.

---

## §8 — What changes vs today

### Today's K.OA.A.1 flow

1. Galaxy → click K.OA.A.1 moon → opens **standard panel** (multi-section: standard text, real-world uses, learn more, play to master, build a game).
2. Click "Build a game" → enters **Scenario Gate** (`scenario-gate.tsx`, 3 steps: Real Math vs Sprinkles / Fix the Story / Tap Marbles).
3. Pass the gate → enters **Builder Picker** (`builder-picker.tsx`) — pick a generation flavor (Sandpack template, paste HTML, AI-generate).
4. AI generates HTML → playtest → submit → no agent ladder runs (Foundation work shipped per spec §15.1 fixes this gap; Stage 1 wired, Stages 2-4 in flight).

### Proposed K.OA.A.1 flow

1. Library home → "Build for K.OA.A.1" CTA → directly into Step 1 (scenario picker), with 1-line standard header at top + side menu.
2. **Step 1:** Pick scenario (10 cards).
3. **Step 2:** Pick + fill mad-lib (3 templates per scenario) → universal Lesson 1 confirmation card.
4. **Step 3:** Operation + N1 + N2 + auto-result, with verb-parsed pre-fill (advisory only — no soft warning if Builder disagrees per Audit 14 §1), range constraint.
5. **Step 4:** Pick mechanic from filtered card grid; "see more mechanics" override available.
6. **Step 5:** Playtest the parameterized engine, beat one round, Submit. Critic 1 + 3 skip; Critic 2 + 4 (Adversary) run visibly. Pass → `pending_review`.

### Files that need to change (engineering scope)

**New files:**
- `src/data/scenarios/k-oa-a-1.ts` — the 10 scenarios + 30 templates + dropdown vocab.
- `src/lib/verb-operation-map.ts` — the verb→+/− lookup table from §4.
- `src/components/builders/madlib-editor.tsx` — Step 2 form.
- `src/components/builders/math-setter.tsx` — Step 3 row.
- `src/components/builders/mechanic-picker.tsx` — Step 4 grid (Card data sourced from registry extension).
- `src/components/builders/playtest-submit.tsx` — Step 5.
- `src/components/builders/build-flow.tsx` — orchestrator (steps, header, side-menu drawer, draft persistence).
- `src/components/builders/lesson1-confirm-card.tsx` — universal post-Step-2 card.
- `src/components/builders/side-menu.tsx` — drawer.
- `public/assets/build-flow/scenario-icons/*.png` — illustration assets for the 10 scenario cards (commission via Leonardo per global memory; Barbara generates).
- `public/assets/build-flow/mechanic-previews/*.webm` — looping animated previews for the 13 mechanic cards.

**Files to extend:**
- `src/lib/game-engines/game-option-registry.ts` — add `koaA1Card?: {...}` per relevant engine; export `STEP_4_K_OA_A_1_ENGINE_IDS`.
- `src/app/api/agents/critic-ladder/route.ts` (or equivalent) — accept `{ skipStages: [1,3] }` from template-based submissions.
- `src/lib/standard-real-world-uses.ts` — verify K.OA.A.1 entry remains the source for the side-menu Learn More content.

**Files to delete (or deprecate):**
- `src/components/standard/scenario-gate.tsx` — replaced by Steps 1-2 + Lesson 1 confirmation card.
- `src/components/builders/builder-picker.tsx` — replaced by Step 4 mechanic picker.
- `src/components/standard/standard-panel.tsx` — reduced to 1-line header rendered inline in `build-flow.tsx`. The full content moves into the side menu's Learn More pane.

**Files to leave alone (this spec doesn't touch them):**
- `src/lib/game-engines/number-frames.ts` and other engine implementations — no changes for the build flow itself. (Engine fixes from Audit 11 §2 are a separate workstream.)
- Firestore schema for `games/{gameId}` — same shape, just always written with `status: pending_review`.
- `src/lib/app-rules.ts` — per AGENTS.md note, do not patch incrementally during the pivot; flag as a batch rewrite.

**Files NOT yet decided (Open Questions §9):**
- Whether to gate the new build flow behind a feature flag for A/B comparison against the legacy flow during the cross-age pilot.

### Approximate engineering effort

| Block | Estimate |
|---|---|
| Step 1 scenario picker + 10 scenarios data + illustrations sourcing | 2–3 days (illustration sourcing dominates if Barbara generates with Leonardo) |
| Step 2 mad-lib editor + 30 templates + dropdowns + Lesson 1 card | 2 days |
| Step 3 math setter + verb lookup + warnings + range guards | 1 day |
| Step 4 mechanic picker + filtered set + override modal + animated previews | 2 days (animated previews dominate; can ship with static screenshots first) |
| Step 5 playtest harness + Critic ladder plumbing for skip-stages-1-3 | 2 days |
| Build-flow orchestrator + side-menu drawer + draft persistence + 1-line standard header | 1.5 days |
| Wire-up + integration + E2E tests + visual polish | 2 days |
| **Total** | **~12.5 dev days** for one engineer (~2.5 calendar weeks at MGB pace), assuming illustration assets are sourced in parallel by Barbara |

This is a single subagent-driven-development plan. Code-reviewer (Opus, both passes) at plan-end per global memory.

---

## §9 — Open questions for Barbara

(Five maximum; keep it tight.)

1. **Lesson 1 confirmation card phrasing.** Spec §3 uses *"In your story, does the answer to the math actually change what happens?"* Does that phrasing land for a 5th-7th grader, or do you want a kid-tested rewrite? (Cheap to change later; just want your call now to avoid bikeshedding mid-build.)

2. **Animated previews vs static screenshots for Step 4 mechanic cards.** Spec §5 calls for ~6-second silent loops per engine (~13 webm files). The cheap version: ship with static screenshots in v1, animate in v1.1. The expensive version: animate now, blocks ship by ~3 days. **My pick:** static screenshots in v1; animate after the cross-age pilot data shows which 3 mechanics Builders pick most.

3. **"See more mechanics" override scope.** Spec §5 surfaces every VETTED engine in the registry (~30 engines) when the Builder taps the override. Is that too many for a K-grade-targeted Builder? Alternative: cap the override list at the addition-or-decomposition adjacent set (~8 engines) and keep the rest fully hidden until they pick a different standard. **My pick:** alternative — cap at adjacent operations. Less overwhelming; preserves construct-validity floor more strongly per Audit 10 §Q4.

4. **Stage 4 (Sonnet Adversary) — visible or shadow?** Spec §6 ships it visible for v1. Audit 10 §Q7 suggests shadowing it for the first 100 template-builds per template and surfacing only on >5% genuine-failure rate. Visible is simpler; shadow is gentler for Builders and saves cost during early ramp. **My pick:** visible for v1 — Builders need the agent-ladder mental model intact; we can shadow in v1.1 if cost matters.

5. **Feature-flag the new flow for the cross-age pilot?** If yes, we can A/B against the legacy flow at Acton during the K.OA.A.1 → 3.OA.A.1 transition. If no, we cut over fully. **My pick:** cut over fully. The legacy flow is already known to be broken (Audit 7); A/B testing a known-broken control against a known-better treatment doesn't teach us anything actionable.

---

*End of spec. After Barbara's approval, invoke `superpowers:writing-plans` to convert this into a subagent-driven implementation plan; pause for visual review at the first viewable Step 1 grid.*
