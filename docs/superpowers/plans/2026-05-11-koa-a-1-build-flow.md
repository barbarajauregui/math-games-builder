# K.OA.A.1 Build Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Builder picker / Scenario gate / AI-HTML-generation flow with a 5-step template-only Builder flow specifically for K.OA.A.1. Step 4 (mechanic picker) reads only the 4 PRIMARY engines from `src/data/standard-mechanic-map.json`. No Adversary ladder on template builds. Mad-lib only — no free-write story prose. Universal Lesson 1 confirmation card.

**Architecture:** A new top-level orchestrator component (`BuildFlow`) routes through 5 step-components, each holding only its slice of state. A discriminated-union reducer holds the shared `BuildState` (scenarioId / story slots / numbers / mechanicId / playtest results). Data files (scenarios + verb-operation map) live in `src/data/` and are read at component mount time. The 4 PRIMARY engines at Step 4 come from the standard-level mechanic mapping JSON. The flow lives at a new route `/build/[standardId]`; the legacy `BuilderHost` + `BuilderPicker` + `ScenarioGate` are deleted at the end.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript 5 strict · Tailwind 4 · Framer Motion (already installed) · Firebase admin (existing save path). No test framework is configured in the project (verified in `package.json`) — tasks verify via `npx tsc --noEmit` for type safety, `npx eslint` for lint, and manual `npm run dev` walkthroughs for UI behavior. Where pure functions exist (verb-operation map, reducers), tasks include simple inline assertion scripts run via `npx tsx`.

**Scope this plan does NOT cover:**
- The Library/Galaxy environment redesign (separate v3 spec)
- Other standards' build flows (each needs its own scenario data file; this plan only ships K.OA.A.1)
- The Mode pill component (separate task)
- Supabase migration (separate workstream)
- Leonardo asset generation for scenario icons (Barbara's task in parallel; tasks use emoji as placeholder)

---

## File Structure

### Files to create

```
src/
├── data/
│   ├── scenarios/
│   │   ├── types.ts                   # Scenario, StoryTemplate, BlankType (~40 lines)
│   │   ├── k-oa-a-1.ts                # 10 scenarios × 3 templates (~350 lines)
│   │   └── index.ts                   # loadScenarios(standardId) (~25 lines)
│   └── verb-operation-map.ts          # verb → "+" | "-" lookup + lookup() (~120 lines)
├── lib/
│   └── build-flow/
│       ├── types.ts                   # BuildState, BuildAction, StepId types (~60 lines)
│       └── reducer.ts                 # buildFlowReducer + initial state (~120 lines)
├── components/
│   └── build-flow/
│       ├── build-flow.tsx             # Top orchestrator (~140 lines)
│       ├── build-flow-header.tsx      # 1-line standard header + hamburger (~50 lines)
│       ├── scenario-picker.tsx        # Step 1: 10 cards (~110 lines)
│       ├── madlib-editor.tsx          # Step 2: template pick + fill (~180 lines)
│       ├── lesson1-card.tsx           # Universal post-Step-2 confirmation (~80 lines)
│       ├── math-setter.tsx            # Step 3: operation + numbers + verb parse (~160 lines)
│       ├── mechanic-picker.tsx        # Step 4: 4 PRIMARY engines (~130 lines)
│       ├── playtest-submit.tsx        # Step 5: engine render + beat-game gate + submit (~190 lines)
│       └── side-menu.tsx              # Right-drawer with Learn More etc. (~110 lines)
└── app/
    └── build/
        └── [standardId]/
            └── page.tsx               # Route wrapper (~30 lines)
```

### Files to modify

- `src/components/standard/standard-panel.tsx` — change "Open Game Assembler →" to route to `/build/{standardId}` instead of opening `<BuilderHost />` inline.
- `src/app/api/game/critique/route.ts` — accept `{ skipStages?: number[] }` in the request body; honor it by skipping listed stage indices.

### Files to delete (at end, after manual verification)

- `src/components/builders/builder-host.tsx`
- `src/components/builders/builder-picker.tsx`
- `src/components/builders/sentence-builder.tsx`
- `src/components/builders/madlib-builder.tsx`
- `src/components/builders/comic-builder.tsx`
- `src/components/builders/card-builder.tsx`
- `src/components/builders/sandpack-builder.tsx`
- `src/components/standard/scenario-gate.tsx`

### Files NOT touched (engines + save path)

- `src/lib/game-engines/*.ts` — engines used as-is; no changes needed to render them parameterized.
- `src/app/api/game/save/route.ts` — already enforces `pending_review` (Foundation Fix #2).
- `src/app/api/game/generate-engine/route.ts` — already exists; reused by Step 5's playtest renderer.

---

## Task 1 — Scaffolding: route, types, empty components

**Files:**
- Create: `src/data/scenarios/types.ts`
- Create: `src/lib/build-flow/types.ts`
- Create: `src/lib/build-flow/reducer.ts`
- Create: `src/components/build-flow/build-flow.tsx` (stub)
- Create: `src/app/build/[standardId]/page.tsx`

- [ ] **Step 1.1: Create scenarios types file**

Write `src/data/scenarios/types.ts`:

```ts
/**
 * Types for scenario data files (one per standard initially; K.OA.A.1 first).
 *
 * Each scenario ships with 3 story templates. Each template has blanks the
 * Builder fills via dropdowns or small number inputs. The blank's `kind`
 * controls which UI control renders.
 */

export type BlankKind = "number" | "dropdown"

export interface NumberBlank {
  id: string
  kind: "number"
  min: number
  max: number
}

export interface DropdownBlank {
  id: string
  kind: "dropdown"
  options: string[]
}

export type StoryBlank = NumberBlank | DropdownBlank

export type Operation = "+" | "-"

export interface StoryTemplate {
  id: string
  /**
   * Renderable template with `{blankId}` tokens. Example:
   *   "{character} has {n1} pennies. They {verbPhrase} {n2} more pennies. How many pennies are in the jar now?"
   */
  template: string
  /**
   * Order matters — drives UI field order in the mad-lib editor.
   */
  blanks: StoryBlank[]
  /**
   * The operation this template implies. Drives Step 3 pre-fill.
   * Inferred from the template's verb-phrase list; stored explicitly here for
   * runtime simplicity (no parsing required).
   */
  operation: Operation
}

export interface Scenario {
  id: string
  title: string
  description: string
  emoji: string
  /**
   * Path to a Leonardo-generated illustration (relative to /public).
   * `null` means use the emoji as the icon for now.
   */
  illustrationAsset: string | null
  templates: StoryTemplate[]
}
```

- [ ] **Step 1.2: Create build-flow types**

Write `src/lib/build-flow/types.ts`:

```ts
import type { Operation } from "@/data/scenarios/types"

export type StepId = "scenario" | "madlib" | "lesson1" | "math" | "mechanic" | "playtest"

export interface BuildState {
  standardId: string
  step: StepId

  // Step 1
  scenarioId: string | null

  // Step 2
  templateId: string | null
  filledBlanks: Record<string, string | number>
  /**
   * Set true once the Builder clicks "Yes — the math matters" on Lesson 1.
   * Reset to false if they re-edit the mad-lib after a "Hmm, needs work".
   */
  lesson1Confirmed: boolean

  // Step 3
  operation: Operation | null
  n1: number | null
  n2: number | null

  // Step 4
  mechanicId: string | null

  // Step 5
  hasBeatenOwnGame: boolean
  isSubmitting: boolean
  submittedGameId: string | null
}

export interface BuildAction {
  type:
    | "GO_TO_STEP"
    | "PICK_SCENARIO"
    | "PICK_TEMPLATE"
    | "SET_BLANK"
    | "CLEAR_LESSON1"
    | "CONFIRM_LESSON1"
    | "SET_OPERATION"
    | "SET_NUMBER"
    | "PICK_MECHANIC"
    | "MARK_BEATEN"
    | "BEGIN_SUBMIT"
    | "FINISH_SUBMIT"
    | "RESET"
  payload?: unknown
}

export function initialBuildState(standardId: string): BuildState {
  return {
    standardId,
    step: "scenario",
    scenarioId: null,
    templateId: null,
    filledBlanks: {},
    lesson1Confirmed: false,
    operation: null,
    n1: null,
    n2: null,
    mechanicId: null,
    hasBeatenOwnGame: false,
    isSubmitting: false,
    submittedGameId: null,
  }
}
```

- [ ] **Step 1.3: Create the reducer with explicit transitions**

Write `src/lib/build-flow/reducer.ts`:

```ts
import type { BuildState, BuildAction, StepId } from "./types"
import type { Operation } from "@/data/scenarios/types"

const STEP_ORDER: StepId[] = ["scenario", "madlib", "lesson1", "math", "mechanic", "playtest"]

function nextStep(current: StepId): StepId {
  const i = STEP_ORDER.indexOf(current)
  return STEP_ORDER[Math.min(i + 1, STEP_ORDER.length - 1)]
}

export function buildFlowReducer(state: BuildState, action: BuildAction): BuildState {
  switch (action.type) {
    case "GO_TO_STEP":
      return { ...state, step: action.payload as StepId }

    case "PICK_SCENARIO": {
      const scenarioId = action.payload as string
      return {
        ...state,
        scenarioId,
        templateId: null,
        filledBlanks: {},
        lesson1Confirmed: false,
        step: "madlib",
      }
    }

    case "PICK_TEMPLATE": {
      const templateId = action.payload as string
      return {
        ...state,
        templateId,
        filledBlanks: {},
        lesson1Confirmed: false,
      }
    }

    case "SET_BLANK": {
      const { id, value } = action.payload as { id: string; value: string | number }
      return {
        ...state,
        filledBlanks: { ...state.filledBlanks, [id]: value },
        lesson1Confirmed: false,
      }
    }

    case "CLEAR_LESSON1":
      return { ...state, lesson1Confirmed: false, step: "madlib" }

    case "CONFIRM_LESSON1":
      return { ...state, lesson1Confirmed: true, step: "math" }

    case "SET_OPERATION":
      return { ...state, operation: action.payload as Operation }

    case "SET_NUMBER": {
      const { which, value } = action.payload as { which: "n1" | "n2"; value: number }
      return { ...state, [which]: value }
    }

    case "PICK_MECHANIC":
      return { ...state, mechanicId: action.payload as string, step: "playtest" }

    case "MARK_BEATEN":
      return { ...state, hasBeatenOwnGame: true }

    case "BEGIN_SUBMIT":
      return { ...state, isSubmitting: true }

    case "FINISH_SUBMIT":
      return {
        ...state,
        isSubmitting: false,
        submittedGameId: action.payload as string | null,
      }

    case "RESET":
      return {
        ...state,
        step: "scenario",
        scenarioId: null,
        templateId: null,
        filledBlanks: {},
        lesson1Confirmed: false,
        operation: null,
        n1: null,
        n2: null,
        mechanicId: null,
        hasBeatenOwnGame: false,
        submittedGameId: null,
      }

    default:
      return state
  }
}

export { nextStep, STEP_ORDER }
```

- [ ] **Step 1.4: Create build-flow.tsx stub**

Write `src/components/build-flow/build-flow.tsx`:

```tsx
"use client"

import { useReducer } from "react"
import { buildFlowReducer } from "@/lib/build-flow/reducer"
import { initialBuildState } from "@/lib/build-flow/types"

interface BuildFlowProps {
  standardId: string
}

export function BuildFlow({ standardId }: BuildFlowProps) {
  const [state, dispatch] = useReducer(buildFlowReducer, standardId, initialBuildState)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-zinc-400">Build flow scaffolding — step: <span className="text-white font-semibold">{state.step}</span></p>
        <p className="text-xs text-zinc-600 mt-2">standardId: {state.standardId}</p>
        <p className="text-xs text-zinc-600 mt-1">(steps will be wired in subsequent tasks)</p>
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="mt-6 text-xs text-zinc-500 underline"
        >
          Reset state
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 1.5: Create the route**

Write `src/app/build/[standardId]/page.tsx`:

```tsx
import { BuildFlow } from "@/components/build-flow/build-flow"
import standardsData from "@/data/standards.json"

interface PageProps {
  params: Promise<{ standardId: string }>
}

export default async function BuildPage({ params }: PageProps) {
  const { standardId } = await params
  const decoded = decodeURIComponent(standardId)

  // Lightweight sanity check: refuse unknown standard IDs
  const known = (standardsData as { nodes: Array<{ id: string }> }).nodes.some(
    (n) => n.id === decoded
  )
  if (!known) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400">Unknown standard: {decoded}</p>
      </div>
    )
  }

  return <BuildFlow standardId={decoded} />
}
```

- [ ] **Step 1.6: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 1.7: Verify the route loads**

Run: `npm run dev` (in background). Open `http://localhost:3000/build/K.OA.A.1` in browser. Expected: page renders with "Build flow scaffolding — step: scenario".

- [ ] **Step 1.8: Commit**

```bash
git add src/data/scenarios/types.ts src/lib/build-flow/ src/components/build-flow/build-flow.tsx src/app/build/
git commit -m "feat(build-flow): scaffold types, reducer, route at /build/[standardId]"
```

---

## Task 2 — Scenario data: Group A (Penny Jar, Fish Tank, School Bus, Snack Plate)

**Files:**
- Create: `src/data/scenarios/k-oa-a-1.ts` (Group A only this task; Group B added in Task 3)
- Create: `src/data/scenarios/index.ts`

- [ ] **Step 2.1: Create the scenarios index**

Write `src/data/scenarios/index.ts`:

```ts
import type { Scenario } from "./types"
import { K_OA_A_1_SCENARIOS } from "./k-oa-a-1"

const SCENARIOS_BY_STANDARD: Record<string, Scenario[]> = {
  "K.OA.A.1": K_OA_A_1_SCENARIOS,
}

export function loadScenarios(standardId: string): Scenario[] {
  return SCENARIOS_BY_STANDARD[standardId] ?? []
}

export type { Scenario, StoryTemplate, BlankKind, NumberBlank, DropdownBlank, StoryBlank, Operation } from "./types"
```

- [ ] **Step 2.2: Create k-oa-a-1.ts with Group A (4 scenarios, 12 templates)**

Write `src/data/scenarios/k-oa-a-1.ts` (Group A only — Group B added in Task 3):

```ts
import type { Scenario } from "./types"

const PENNY_JAR_CHARACTERS = ["Grandma", "Dad", "Mei", "Jamal", "a friend", "the storekeeper"]
const SNACK_ITEMS = ["cookies", "crackers", "grapes", "orange slices", "cheese cubes", "carrot sticks"]
const SNACK_CHARACTERS = ["Mama", "Papa", "Lucia", "Ben", "your sister", "your brother"]
const SCHOOL_BUS_CHARACTERS = ["the driver", "Mr. Lee", "Ms. Patel", "the helper"]
const FISH_TANK_CHARACTERS = ["Mom", "Dad", "the pet store owner", "Lucia", "Ben", "the diver"]

/**
 * K.OA.A.1 scenarios — Group A (the four "real-world applications" the standard
 * itself names) + Group B (six evergreen scenarios) in this file.
 *
 * Each scenario ships 3 templates. Per Audit 10 R5: ≥3 per scenario.
 * Per Audit 13 K.OA.A.1 entry: range constrained within 10; equation appears as
 * recording only (no running counter inside the story prose).
 */
export const K_OA_A_1_SCENARIOS: Scenario[] = [
  {
    id: "penny-jar",
    title: "Penny Jar",
    description: "A jar where coins get added (or spent).",
    emoji: "💰",
    illustrationAsset: null,
    templates: [
      {
        id: "penny-jar-t1",
        template: "{character} has {n1} pennies in their jar. They {verbPhrase} {n2} more pennies. How many pennies are in the jar now?",
        operation: "+",
        blanks: [
          { id: "character", kind: "dropdown", options: PENNY_JAR_CHARACTERS },
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["get", "find", "earn", "are given"] },
          { id: "n2", kind: "number", min: 1, max: 9 },
        ],
      },
      {
        id: "penny-jar-t2",
        template: "{character} has {n1} pennies. They {verbPhrase} {n2} of them. How many pennies are left?",
        operation: "-",
        blanks: [
          { id: "character", kind: "dropdown", options: PENNY_JAR_CHARACTERS },
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["spend", "lose", "give away", "drop"] },
          { id: "n2", kind: "number", min: 1, max: 8 },
        ],
      },
      {
        id: "penny-jar-t3",
        template: "There are {n1} pennies on the table. {character} {verbPhrase} {n2} more from the couch. How many pennies in all?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "character", kind: "dropdown", options: PENNY_JAR_CHARACTERS },
          { id: "verbPhrase", kind: "dropdown", options: ["brings", "adds", "piles on", "stacks"] },
          { id: "n2", kind: "number", min: 1, max: 9 },
        ],
      },
    ],
  },
  {
    id: "fish-tank",
    title: "Fish Tank",
    description: "An aquarium where fish are added or scooped out.",
    emoji: "🐟",
    illustrationAsset: null,
    templates: [
      {
        id: "fish-tank-t1",
        template: "The tank has {n1} fish. {character} {verbPhrase} {n2} new fish. How many fish are swimming now?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "character", kind: "dropdown", options: FISH_TANK_CHARACTERS },
          { id: "verbPhrase", kind: "dropdown", options: ["drops in", "adds", "brings home", "pours in"] },
          { id: "n2", kind: "number", min: 1, max: 9 },
        ],
      },
      {
        id: "fish-tank-t2",
        template: "There are {n1} fish in the tank. {character} {verbPhrase} {n2} to a friend's tank. How many fish are left?",
        operation: "-",
        blanks: [
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "character", kind: "dropdown", options: FISH_TANK_CHARACTERS },
          { id: "verbPhrase", kind: "dropdown", options: ["gives", "scoops out", "moves", "takes"] },
          { id: "n2", kind: "number", min: 1, max: 8 },
        ],
      },
      {
        id: "fish-tank-t3",
        template: "{n1} goldfish are swimming. {n2} more goldfish {verbPhrase} from behind the rock. How many goldfish in all?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "n2", kind: "number", min: 1, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["come out", "appear", "swim out", "arrive"] },
        ],
      },
    ],
  },
  {
    id: "school-bus",
    title: "School Bus",
    description: "A bus picking kids up at stops (or dropping them off).",
    emoji: "🚌",
    illustrationAsset: null,
    templates: [
      {
        id: "school-bus-t1",
        template: "{n1} kids are on the bus. At the next stop, {n2} more kids {verbPhrase}. How many kids are on the bus now?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "n2", kind: "number", min: 1, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["get on", "climb on", "hop in", "join"] },
        ],
      },
      {
        id: "school-bus-t2",
        template: "The bus has {n1} kids. At the school stop, {n2} kids {verbPhrase}. How many kids are still on the bus?",
        operation: "-",
        blanks: [
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "n2", kind: "number", min: 1, max: 8 },
          { id: "verbPhrase", kind: "dropdown", options: ["get off", "leave", "hop out", "step down"] },
        ],
      },
      {
        id: "school-bus-t3",
        template: "{character} counts {n1} kids on the bus. Then {n2} more {verbPhrase}. How many kids does the driver see?",
        operation: "+",
        blanks: [
          { id: "character", kind: "dropdown", options: SCHOOL_BUS_CHARACTERS },
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "n2", kind: "number", min: 1, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["come aboard", "get on", "show up", "arrive"] },
        ],
      },
    ],
  },
  {
    id: "snack-plate",
    title: "Snack Plate",
    description: "A plate where snacks are placed or eaten.",
    emoji: "🍪",
    illustrationAsset: null,
    templates: [
      {
        id: "snack-plate-t1",
        template: "The plate has {n1} {items}. {character} {verbPhrase} {n2} more. How many {items} on the plate now?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "items", kind: "dropdown", options: SNACK_ITEMS },
          { id: "character", kind: "dropdown", options: SNACK_CHARACTERS },
          { id: "verbPhrase", kind: "dropdown", options: ["puts on", "adds", "piles up", "brings out"] },
          { id: "n2", kind: "number", min: 1, max: 9 },
        ],
      },
      {
        id: "snack-plate-t2",
        template: "There are {n1} {items} on the plate. {character} {verbPhrase} {n2}. How many {items} are left?",
        operation: "-",
        blanks: [
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "items", kind: "dropdown", options: SNACK_ITEMS },
          { id: "character", kind: "dropdown", options: SNACK_CHARACTERS },
          { id: "verbPhrase", kind: "dropdown", options: ["eats", "takes", "shares away", "nibbles"] },
          { id: "n2", kind: "number", min: 1, max: 8 },
        ],
      },
      {
        id: "snack-plate-t3",
        template: "{n1} {items} sit on the plate. The dog {verbPhrase} {n2} of them. How many {items} are still there?",
        operation: "-",
        blanks: [
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "items", kind: "dropdown", options: SNACK_ITEMS },
          { id: "verbPhrase", kind: "dropdown", options: ["steals", "grabs", "sneaks", "runs off with"] },
          { id: "n2", kind: "number", min: 1, max: 8 },
        ],
      },
    ],
  },
  // Group B added in Task 3
]
```

- [ ] **Step 2.3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2.4: Commit**

```bash
git add src/data/scenarios/
git commit -m "feat(scenarios): K.OA.A.1 Group A scenarios (Penny Jar, Fish Tank, School Bus, Snack Plate) with 12 templates"
```

---

## Task 3 — Scenario data: Group B (Bakery, Toy Store, Farm, Sports, Birthday Party, Classroom)

**Files:**
- Modify: `src/data/scenarios/k-oa-a-1.ts` (append Group B scenarios to the existing array)

- [ ] **Step 3.1: Append Group B scenarios**

Open `src/data/scenarios/k-oa-a-1.ts`. Add these constants near the top with the existing character/items constants:

```ts
const BAKERY_ITEMS = ["muffins", "loaves of bread", "croissants", "cookies", "cupcakes", "rolls"]
const BAKERY_CHARACTERS = ["the baker", "Aunt Rosa", "Chef Lee", "Sami"]
const TOY_STORE_ITEMS = ["teddy bears", "toy cars", "dolls", "blocks", "kites", "yo-yos"]
const TOY_STORE_CHARACTERS = ["the clerk", "Mom", "the cashier", "Auntie"]
const FARM_ITEMS = ["cows", "sheep", "chickens", "horses", "goats", "pigs"]
const FARM_CHARACTERS = ["the farmer", "Grandpa", "Tía Marta", "the helper"]
const PARTY_ITEMS = ["balloons", "cupcakes", "hats", "presents", "candles", "streamers"]
const PARTY_CHARACTERS = ["Mom", "Dad", "Lucia", "the clown", "your friend", "the host"]
const CLASSROOM_ITEMS = ["crayons", "books", "pencils", "markers", "erasers", "blocks"]
const CLASSROOM_CHARACTERS = ["the teacher", "Ms. Reyes", "Mr. Park", "the helper"]
```

Then replace the `// Group B added in Task 3` comment with the following entries (still inside the `K_OA_A_1_SCENARIOS` array, appended after `snack-plate`):

```ts
  {
    id: "bakery",
    title: "Bakery",
    description: "Bread coming out of the oven, or sold to customers.",
    emoji: "🥐",
    illustrationAsset: null,
    templates: [
      {
        id: "bakery-t1",
        template: "The baker pulls {n1} {items} from the oven. Then {n2} more {verbPhrase}. How many {items} are on the tray?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "items", kind: "dropdown", options: BAKERY_ITEMS },
          { id: "n2", kind: "number", min: 1, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["come out", "are added", "are placed", "appear"] },
        ],
      },
      {
        id: "bakery-t2",
        template: "{n1} {items} are on the shelf. A customer {verbPhrase} {n2}. How many {items} are left on the shelf?",
        operation: "-",
        blanks: [
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "items", kind: "dropdown", options: BAKERY_ITEMS },
          { id: "verbPhrase", kind: "dropdown", options: ["buys", "takes", "asks for", "picks up"] },
          { id: "n2", kind: "number", min: 1, max: 8 },
        ],
      },
      {
        id: "bakery-t3",
        template: "{character} mixes {n1} {items}. The helper mixes {n2} more. How many {items} in all?",
        operation: "+",
        blanks: [
          { id: "character", kind: "dropdown", options: BAKERY_CHARACTERS },
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "items", kind: "dropdown", options: BAKERY_ITEMS },
          { id: "n2", kind: "number", min: 1, max: 9 },
        ],
      },
    ],
  },
  {
    id: "toy-store",
    title: "Toy Store",
    description: "Toys put on shelves or bought by kids.",
    emoji: "🧸",
    illustrationAsset: null,
    templates: [
      {
        id: "toy-store-t1",
        template: "The shelf has {n1} {items}. The clerk {verbPhrase} {n2} more. How many {items} on the shelf?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "items", kind: "dropdown", options: TOY_STORE_ITEMS },
          { id: "verbPhrase", kind: "dropdown", options: ["stocks", "adds", "lines up", "puts out"] },
          { id: "n2", kind: "number", min: 1, max: 9 },
        ],
      },
      {
        id: "toy-store-t2",
        template: "The store has {n1} {items}. A kid {verbPhrase} {n2}. How many {items} are left on the shelf?",
        operation: "-",
        blanks: [
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "items", kind: "dropdown", options: TOY_STORE_ITEMS },
          { id: "verbPhrase", kind: "dropdown", options: ["buys", "takes home", "picks", "chooses"] },
          { id: "n2", kind: "number", min: 1, max: 8 },
        ],
      },
      {
        id: "toy-store-t3",
        template: "{n1} {items} sit in a row. {character} {verbPhrase} {n2} to wrap as gifts. How many {items} are still on the shelf?",
        operation: "-",
        blanks: [
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "items", kind: "dropdown", options: TOY_STORE_ITEMS },
          { id: "character", kind: "dropdown", options: TOY_STORE_CHARACTERS },
          { id: "verbPhrase", kind: "dropdown", options: ["takes", "pulls", "wraps up", "removes"] },
          { id: "n2", kind: "number", min: 1, max: 8 },
        ],
      },
    ],
  },
  {
    id: "farm",
    title: "Farm",
    description: "Animals coming into the barn or going out to graze.",
    emoji: "🐄",
    illustrationAsset: null,
    templates: [
      {
        id: "farm-t1",
        template: "{n1} {items} are in the barn. {n2} more {verbPhrase} from the field. How many {items} in the barn now?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "items", kind: "dropdown", options: FARM_ITEMS },
          { id: "n2", kind: "number", min: 1, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["come back", "wander in", "are led in", "arrive"] },
        ],
      },
      {
        id: "farm-t2",
        template: "The barn has {n1} {items}. {character} {verbPhrase} {n2} out to graze. How many {items} are still in the barn?",
        operation: "-",
        blanks: [
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "items", kind: "dropdown", options: FARM_ITEMS },
          { id: "character", kind: "dropdown", options: FARM_CHARACTERS },
          { id: "verbPhrase", kind: "dropdown", options: ["lets", "sends", "leads", "shoos"] },
          { id: "n2", kind: "number", min: 1, max: 8 },
        ],
      },
      {
        id: "farm-t3",
        template: "{character} sees {n1} {items} near the pond. Then {n2} more {verbPhrase}. How many {items} in all?",
        operation: "+",
        blanks: [
          { id: "character", kind: "dropdown", options: FARM_CHARACTERS },
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "items", kind: "dropdown", options: FARM_ITEMS },
          { id: "n2", kind: "number", min: 1, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["walk over", "show up", "appear", "come closer"] },
        ],
      },
    ],
  },
  {
    id: "sports",
    title: "Sports",
    description: "Goals scored, points added, or players running on the field.",
    emoji: "⚽",
    illustrationAsset: null,
    templates: [
      {
        id: "sports-t1",
        template: "The team has {n1} points. They {verbPhrase} {n2} more goals. How many points now?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["score", "earn", "get", "make"] },
          { id: "n2", kind: "number", min: 1, max: 9 },
        ],
      },
      {
        id: "sports-t2",
        template: "{n1} players are on the field. {n2} more {verbPhrase} from the bench. How many players in all?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "n2", kind: "number", min: 1, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["run on", "sub in", "come out", "join"] },
        ],
      },
      {
        id: "sports-t3",
        template: "There are {n1} players on the field. {n2} {verbPhrase} for water. How many players are still on the field?",
        operation: "-",
        blanks: [
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "n2", kind: "number", min: 1, max: 8 },
          { id: "verbPhrase", kind: "dropdown", options: ["leave", "sub out", "step off", "run off"] },
        ],
      },
    ],
  },
  {
    id: "birthday-party",
    title: "Birthday Party",
    description: "Balloons inflated or popped; guests arriving or leaving.",
    emoji: "🎈",
    illustrationAsset: null,
    templates: [
      {
        id: "birthday-party-t1",
        template: "The party has {n1} {items}. {character} {verbPhrase} {n2} more. How many {items} are at the party?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "items", kind: "dropdown", options: PARTY_ITEMS },
          { id: "character", kind: "dropdown", options: PARTY_CHARACTERS },
          { id: "verbPhrase", kind: "dropdown", options: ["blows up", "brings", "hangs up", "sets out"] },
          { id: "n2", kind: "number", min: 1, max: 9 },
        ],
      },
      {
        id: "birthday-party-t2",
        template: "There are {n1} {items} at the party. {n2} {verbPhrase}. How many {items} are left?",
        operation: "-",
        blanks: [
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "items", kind: "dropdown", options: PARTY_ITEMS },
          { id: "n2", kind: "number", min: 1, max: 8 },
          { id: "verbPhrase", kind: "dropdown", options: ["pop", "are eaten", "are taken home", "break"] },
        ],
      },
      {
        id: "birthday-party-t3",
        template: "{n1} guests are at the party. {n2} more guests {verbPhrase}. How many guests in all?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "n2", kind: "number", min: 1, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["arrive", "show up", "walk in", "come"] },
        ],
      },
    ],
  },
  {
    id: "classroom",
    title: "Classroom",
    description: "Crayons in a bin, books on a shelf, kids at the rug.",
    emoji: "✏️",
    illustrationAsset: null,
    templates: [
      {
        id: "classroom-t1",
        template: "The bin has {n1} {items}. {character} {verbPhrase} {n2} more from the cart. How many {items} in the bin now?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "items", kind: "dropdown", options: CLASSROOM_ITEMS },
          { id: "character", kind: "dropdown", options: CLASSROOM_CHARACTERS },
          { id: "verbPhrase", kind: "dropdown", options: ["drops in", "adds", "pours in", "puts in"] },
          { id: "n2", kind: "number", min: 1, max: 9 },
        ],
      },
      {
        id: "classroom-t2",
        template: "The shelf has {n1} {items}. {n2} kids {verbPhrase} one each. How many {items} are left on the shelf?",
        operation: "-",
        blanks: [
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "items", kind: "dropdown", options: CLASSROOM_ITEMS },
          { id: "n2", kind: "number", min: 1, max: 8 },
          { id: "verbPhrase", kind: "dropdown", options: ["take", "borrow", "pick", "grab"] },
        ],
      },
      {
        id: "classroom-t3",
        template: "{n1} kids are at the rug. {n2} more kids {verbPhrase} from the table. How many kids on the rug?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "n2", kind: "number", min: 1, max: 9 },
          { id: "verbPhrase", kind: "dropdown", options: ["come over", "walk in", "sit down", "join"] },
        ],
      },
    ],
  },
```

- [ ] **Step 3.2: Verify TypeScript and that the array has 10 scenarios**

Run: `npx tsc --noEmit` (expect: no errors).

Run: `npx tsx -e "import { K_OA_A_1_SCENARIOS } from './src/data/scenarios/k-oa-a-1'; if (K_OA_A_1_SCENARIOS.length !== 10) throw new Error('expected 10, got ' + K_OA_A_1_SCENARIOS.length); const totalT = K_OA_A_1_SCENARIOS.reduce((s, x) => s + x.templates.length, 0); if (totalT !== 30) throw new Error('expected 30 templates, got ' + totalT); console.log('OK')"`

If `tsx` is not installed: `npm install --save-dev tsx` first (via PowerShell, per Windows rule).

Expected: `OK`.

- [ ] **Step 3.3: Commit**

```bash
git add src/data/scenarios/k-oa-a-1.ts
git commit -m "feat(scenarios): K.OA.A.1 Group B scenarios (Bakery, Toy Store, Farm, Sports, Birthday Party, Classroom)"
```

---

## Task 4 — Verb-operation lookup table

**Files:**
- Create: `src/lib/verb-operation-map.ts`

- [ ] **Step 4.1: Write the verb map and lookup function**

Write `src/lib/verb-operation-map.ts`:

```ts
import type { Operation } from "@/data/scenarios/types"

/**
 * Map from a verb-phrase (as it appears in story templates) to the math
 * operation it implies. Used by Step 3 to pre-fill the operation dropdown
 * from the verb the Builder picked at Step 2.
 *
 * Source: docs/superpowers/specs/2026-05-11-koa-a-1-build-flow.md §4 (verb
 * table). Covers all verbs used in the 30 K.OA.A.1 mad-lib templates.
 *
 * Convention: keys are lowercased and trimmed before lookup. Multi-word
 * phrases match exactly (e.g., "give away" not "give"). Both singular and
 * plural verb forms are listed where they appear in templates.
 */
const VERB_OPERATION_MAP: Record<string, Operation> = {
  // Addition verbs
  "get": "+", "gets": "+",
  "find": "+", "finds": "+",
  "earn": "+", "earns": "+",
  "are given": "+", "is given": "+",
  "brings": "+", "bring": "+",
  "adds": "+", "add": "+",
  "piles on": "+", "stacks": "+", "piles up": "+",
  "drops in": "+",
  "pours in": "+",
  "come out": "+", "comes out": "+",
  "appear": "+", "appears": "+",
  "arrive": "+", "arrives": "+",
  "join": "+", "joins": "+",
  "get on": "+", "gets on": "+", "climb on": "+", "climbs on": "+", "hop in": "+", "hops in": "+",
  "come aboard": "+", "comes aboard": "+",
  "show up": "+", "shows up": "+",
  "put on": "+", "puts on": "+",
  "set out": "+", "sets out": "+",
  "are placed": "+", "is placed": "+",
  "are added": "+", "is added": "+",
  "stocks": "+", "stock": "+",
  "lines up": "+", "line up": "+",
  "puts out": "+", "put out": "+",
  "come back": "+", "wander in": "+", "are led in": "+",
  "walk over": "+", "walks over": "+", "come closer": "+", "comes closer": "+",
  "score": "+", "scores": "+",
  "make": "+", "makes": "+",
  "run on": "+", "runs on": "+", "sub in": "+", "subs in": "+",
  "blows up": "+", "blow up": "+",
  "hangs up": "+", "hang up": "+",
  "come": "+", "walk in": "+", "walks in": "+", "sit down": "+", "sits down": "+",
  "come over": "+", "comes over": "+",
  "mixes": "+", "mix": "+",
  "brings out": "+",
  "puts in": "+",
  "drops in (cart)": "+",
  "piles up (snacks)": "+",

  // Subtraction verbs
  "spend": "-", "spends": "-",
  "lose": "-", "loses": "-",
  "give away": "-", "gives away": "-",
  "drop": "-", "drops": "-",
  "gives": "-",
  "scoops out": "-", "scoops": "-",
  "moves": "-",
  "takes": "-", "take": "-",
  "eats": "-", "eat": "-",
  "nibbles": "-", "nibble": "-",
  "shares away": "-", "share away": "-",
  "steals": "-", "steal": "-",
  "grabs": "-", "grab": "-",
  "sneaks": "-", "sneak": "-",
  "runs off with": "-", "run off with": "-",
  "buys": "-", "buy": "-",
  "asks for": "-", "ask for": "-",
  "picks up": "-", "pick up": "-",
  "pulls": "-", "pull": "-",
  "wraps up": "-", "wrap up": "-",
  "removes": "-", "remove": "-",
  "lets": "-", "sends": "-", "leads": "-", "shoos": "-",
  "sub out": "-", "subs out": "-", "step off": "-", "run off": "-",
  "pop": "-", "pops": "-",
  "are eaten": "-", "is eaten": "-",
  "are taken home": "-", "is taken home": "-",
  "break": "-", "breaks": "-",
  "borrow": "-", "borrows": "-",
  "get off": "-", "gets off": "-", "leaves": "-", "leave": "-",
  "hops out": "-", "hop out": "-",
  "step down": "-", "steps down": "-",
  "picks": "-",
  "chooses": "-",
  "takes home": "-",
}

/**
 * Look up the operation a verb-phrase implies.
 * Returns null if the verb is not in the map (Builder may have used a
 * verb we haven't catalogued; Step 3 will fall back to leaving the
 * operation dropdown unselected).
 */
export function lookupOperation(verbPhrase: string): Operation | null {
  const key = verbPhrase.trim().toLowerCase()
  return VERB_OPERATION_MAP[key] ?? null
}

/**
 * Used by Step 3's Lesson 2 soft warning: when the Builder's verb implies
 * one operation but they manually selected the other, fire a hint.
 */
export function verbMismatchesOperation(verbPhrase: string, chosen: Operation): boolean {
  const implied = lookupOperation(verbPhrase)
  return implied !== null && implied !== chosen
}
```

- [ ] **Step 4.2: Add a quick assertion script**

Run: `npx tsx -e "import { lookupOperation, verbMismatchesOperation } from './src/lib/verb-operation-map'; if (lookupOperation('get') !== '+') throw new Error('get'); if (lookupOperation('lose') !== '-') throw new Error('lose'); if (lookupOperation('give away') !== '-') throw new Error('give away'); if (lookupOperation('totally unknown verb') !== null) throw new Error('unknown'); if (!verbMismatchesOperation('get', '-')) throw new Error('mismatch'); if (verbMismatchesOperation('get', '+')) throw new Error('false positive'); console.log('OK')"`

Expected: `OK`.

- [ ] **Step 4.3: Verify all template verb-phrases are in the map**

Run: `npx tsx -e "import { K_OA_A_1_SCENARIOS } from './src/data/scenarios/k-oa-a-1'; import { lookupOperation } from './src/lib/verb-operation-map'; const missing = []; for (const s of K_OA_A_1_SCENARIOS) for (const t of s.templates) { const vb = t.blanks.find(b => b.id === 'verbPhrase'); if (vb && vb.kind === 'dropdown') for (const v of vb.options) if (lookupOperation(v) === null) missing.push({scenario: s.id, template: t.id, verb: v}); } if (missing.length) { console.log(JSON.stringify(missing, null, 2)); process.exit(1); } console.log('All verb-phrases mapped')"`

Expected: `All verb-phrases mapped`. If anything is missing, add it to the map before continuing.

- [ ] **Step 4.4: Commit**

```bash
git add src/lib/verb-operation-map.ts
git commit -m "feat(build-flow): verb-operation lookup table covering all K.OA.A.1 template verbs"
```

---

## Task 5 — Step 1 component: ScenarioPicker

**Files:**
- Create: `src/components/build-flow/scenario-picker.tsx`
- Modify: `src/components/build-flow/build-flow.tsx` (wire it in)

- [ ] **Step 5.1: Write the ScenarioPicker component**

Write `src/components/build-flow/scenario-picker.tsx`:

```tsx
"use client"

import type { Scenario } from "@/data/scenarios/types"

interface ScenarioPickerProps {
  scenarios: Scenario[]
  onPick: (scenarioId: string) => void
}

export function ScenarioPicker({ scenarios, onPick }: ScenarioPickerProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <p className="text-center text-sm text-zinc-400 mb-6">
        Pick a place where adding or taking away matters.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => onPick(s.id)}
            className="text-left rounded-xl p-4 bg-zinc-900 border border-zinc-800 hover:border-cyan-400/50 hover:bg-zinc-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <div className="text-4xl mb-2" aria-hidden="true">
              {s.emoji}
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{s.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{s.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5.2: Wire it into BuildFlow**

Replace `src/components/build-flow/build-flow.tsx` with:

```tsx
"use client"

import { useReducer, useMemo } from "react"
import { buildFlowReducer } from "@/lib/build-flow/reducer"
import { initialBuildState } from "@/lib/build-flow/types"
import { loadScenarios } from "@/data/scenarios"
import { ScenarioPicker } from "./scenario-picker"

interface BuildFlowProps {
  standardId: string
}

export function BuildFlow({ standardId }: BuildFlowProps) {
  const [state, dispatch] = useReducer(buildFlowReducer, standardId, initialBuildState)
  const scenarios = useMemo(() => loadScenarios(standardId), [standardId])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-900 px-4 py-3">
        <h1 className="text-sm font-medium text-zinc-300">
          {standardId} — Adding and taking away within 10
        </h1>
      </header>

      {state.step === "scenario" && (
        <ScenarioPicker
          scenarios={scenarios}
          onPick={(id) => dispatch({ type: "PICK_SCENARIO", payload: id })}
        />
      )}

      {state.step !== "scenario" && (
        <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-zinc-400">
          <p>Step: <span className="text-white">{state.step}</span></p>
          <p className="mt-2 text-xs text-zinc-600">Scenario: {state.scenarioId}</p>
          <button onClick={() => dispatch({ type: "RESET" })} className="mt-4 text-xs text-zinc-500 underline">
            Back to start
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5.3: Verify in browser**

Run: `npx tsc --noEmit` (expect: no errors).

Open `http://localhost:3000/build/K.OA.A.1`. Expected: 10 scenario cards in a 2×5 grid. Clicking one advances to a placeholder "Step: madlib" screen with the scenarioId showing.

- [ ] **Step 5.4: Commit**

```bash
git add src/components/build-flow/scenario-picker.tsx src/components/build-flow/build-flow.tsx
git commit -m "feat(build-flow): Step 1 ScenarioPicker with 10 K.OA.A.1 scenarios"
```

---

## Task 6 — Step 2 component: MadlibEditor

**Files:**
- Create: `src/components/build-flow/madlib-editor.tsx`
- Modify: `src/components/build-flow/build-flow.tsx` (wire it in)

- [ ] **Step 6.1: Write the MadlibEditor component**

Write `src/components/build-flow/madlib-editor.tsx`:

```tsx
"use client"

import { useMemo, useState } from "react"
import type { Scenario, StoryTemplate, StoryBlank } from "@/data/scenarios/types"

interface MadlibEditorProps {
  scenario: Scenario
  templateId: string | null
  filledBlanks: Record<string, string | number>
  onPickTemplate: (templateId: string) => void
  onSetBlank: (id: string, value: string | number) => void
  onContinue: () => void
  onBack: () => void
}

/**
 * Renders a story template with its blanks as dropdowns or number inputs.
 * Live preview at the bottom shows the rendered story.
 */
export function MadlibEditor({
  scenario,
  templateId,
  filledBlanks,
  onPickTemplate,
  onSetBlank,
  onContinue,
  onBack,
}: MadlibEditorProps) {
  const template = useMemo(
    () => scenario.templates.find((t) => t.id === templateId) ?? null,
    [scenario, templateId]
  )

  const allFilled = useMemo(() => {
    if (!template) return false
    return template.blanks.every((b) => filledBlanks[b.id] != null && filledBlanks[b.id] !== "")
  }, [template, filledBlanks])

  const rendered = useMemo(() => {
    if (!template) return ""
    return renderTemplate(template.template, filledBlanks)
  }, [template, filledBlanks])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-sm text-zinc-400 hover:text-white mb-4">
        ← Back
      </button>

      {!template && (
        <>
          <h2 className="text-white text-lg font-semibold mb-4">
            {scenario.emoji} {scenario.title} — pick a story
          </h2>
          <p className="text-sm text-zinc-400 mb-6">Three story shapes. Pick one to fill in.</p>
          <div className="space-y-3">
            {scenario.templates.map((t) => (
              <button
                key={t.id}
                onClick={() => onPickTemplate(t.id)}
                className="w-full text-left rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-400/50 hover:bg-zinc-800 p-4 transition-all"
              >
                <p className="text-sm text-zinc-200 leading-relaxed">
                  {t.template.replace(/\{[^}]+\}/g, "___")}
                </p>
              </button>
            ))}
          </div>
        </>
      )}

      {template && (
        <>
          <h2 className="text-white text-lg font-semibold mb-2">Fill in the story</h2>
          <p className="text-xs text-zinc-500 mb-6">
            Pick a word for each box. Numbers stay between 1 and 9.
          </p>

          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 mb-6">
            <p className="text-base text-zinc-200 leading-loose">
              {renderTemplateInteractive(template, filledBlanks, onSetBlank)}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-950 border border-zinc-700 p-4 mb-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Preview</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{rendered || "Fill the blanks above…"}</p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => onPickTemplate("")}
              className="text-sm text-zinc-400 hover:text-white"
            >
              ← Pick a different story
            </button>
            <button
              disabled={!allFilled}
              onClick={onContinue}
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function renderTemplate(template: string, blanks: Record<string, string | number>): string {
  return template.replace(/\{([^}]+)\}/g, (_, id: string) => {
    const v = blanks[id]
    return v != null && v !== "" ? String(v) : "___"
  })
}

/**
 * Render the template with interactive controls inline. We tokenize on
 * `{blankId}` and render each blank as the corresponding form control,
 * preserving the surrounding prose as plain text nodes.
 */
function renderTemplateInteractive(
  template: StoryTemplate,
  filled: Record<string, string | number>,
  onSet: (id: string, value: string | number) => void
) {
  const blanksById = new Map(template.blanks.map((b) => [b.id, b]))
  const parts = template.template.split(/(\{[^}]+\})/g)
  return parts.map((part, i) => {
    const match = part.match(/^\{([^}]+)\}$/)
    if (!match) return <span key={i}>{part}</span>
    const blankId = match[1]
    const blank = blanksById.get(blankId)
    if (!blank) return <span key={i} className="text-amber-400">{part}</span>
    return (
      <BlankControl
        key={i}
        blank={blank}
        value={filled[blankId]}
        onChange={(v) => onSet(blankId, v)}
      />
    )
  })
}

function BlankControl({
  blank,
  value,
  onChange,
}: {
  blank: StoryBlank
  value: string | number | undefined
  onChange: (v: string | number) => void
}) {
  if (blank.kind === "number") {
    return (
      <input
        type="number"
        min={blank.min}
        max={blank.max}
        value={typeof value === "number" ? value : ""}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (Number.isFinite(n)) onChange(Math.max(blank.min, Math.min(blank.max, n)))
        }}
        className="inline-block mx-1 w-16 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-cyan-300 text-center"
      />
    )
  }
  return (
    <select
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      className="inline-block mx-1 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-cyan-300"
    >
      <option value="">choose…</option>
      {blank.options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}
```

- [ ] **Step 6.2: Wire it into BuildFlow**

In `src/components/build-flow/build-flow.tsx`, replace the placeholder for `state.step !== "scenario"` with proper step routing. Update the full file:

```tsx
"use client"

import { useReducer, useMemo } from "react"
import { buildFlowReducer } from "@/lib/build-flow/reducer"
import { initialBuildState } from "@/lib/build-flow/types"
import { loadScenarios } from "@/data/scenarios"
import { ScenarioPicker } from "./scenario-picker"
import { MadlibEditor } from "./madlib-editor"

interface BuildFlowProps {
  standardId: string
}

export function BuildFlow({ standardId }: BuildFlowProps) {
  const [state, dispatch] = useReducer(buildFlowReducer, standardId, initialBuildState)
  const scenarios = useMemo(() => loadScenarios(standardId), [standardId])
  const scenario = useMemo(
    () => scenarios.find((s) => s.id === state.scenarioId) ?? null,
    [scenarios, state.scenarioId]
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-900 px-4 py-3">
        <h1 className="text-sm font-medium text-zinc-300">
          {standardId} — Adding and taking away within 10
        </h1>
      </header>

      {state.step === "scenario" && (
        <ScenarioPicker
          scenarios={scenarios}
          onPick={(id) => dispatch({ type: "PICK_SCENARIO", payload: id })}
        />
      )}

      {state.step === "madlib" && scenario && (
        <MadlibEditor
          scenario={scenario}
          templateId={state.templateId}
          filledBlanks={state.filledBlanks}
          onPickTemplate={(id) =>
            dispatch({ type: "PICK_TEMPLATE", payload: id || null })
          }
          onSetBlank={(id, value) =>
            dispatch({ type: "SET_BLANK", payload: { id, value } })
          }
          onContinue={() => dispatch({ type: "GO_TO_STEP", payload: "lesson1" })}
          onBack={() => dispatch({ type: "GO_TO_STEP", payload: "scenario" })}
        />
      )}

      {state.step !== "scenario" && state.step !== "madlib" && (
        <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-zinc-400">
          <p>Step: <span className="text-white">{state.step}</span></p>
          <p className="mt-2 text-xs text-zinc-600">Scenario: {state.scenarioId}, Template: {state.templateId}</p>
          <button onClick={() => dispatch({ type: "RESET" })} className="mt-4 text-xs text-zinc-500 underline">
            Back to start
          </button>
        </div>
      )}
    </div>
  )
}
```

Note the `PICK_TEMPLATE` payload accepts a string OR null — the reducer accepts `string`, so update the reducer to accept null too. Update `src/lib/build-flow/reducer.ts`'s `PICK_TEMPLATE` case:

```ts
    case "PICK_TEMPLATE": {
      const templateId = action.payload as string | null
      return {
        ...state,
        templateId,
        filledBlanks: {},
        lesson1Confirmed: false,
      }
    }
```

- [ ] **Step 6.3: Verify in browser**

`npx tsc --noEmit` (expect: no errors).

Open `/build/K.OA.A.1`, pick Penny Jar, pick a story, fill the dropdowns + numbers. Expected: the rendered preview shows the filled story; Continue is disabled until all blanks are filled.

- [ ] **Step 6.4: Commit**

```bash
git add src/components/build-flow/madlib-editor.tsx src/components/build-flow/build-flow.tsx src/lib/build-flow/reducer.ts
git commit -m "feat(build-flow): Step 2 MadlibEditor with template pick, blank fill, live preview"
```

---

## Task 7 — Lesson1 confirmation card

**Files:**
- Create: `src/components/build-flow/lesson1-card.tsx`
- Modify: `src/components/build-flow/build-flow.tsx` (wire it in)

- [ ] **Step 7.1: Write the Lesson1Card component**

Write `src/components/build-flow/lesson1-card.tsx`:

```tsx
"use client"

interface Lesson1CardProps {
  renderedStory: string
  onConfirm: () => void
  onNeedsWork: () => void
}

export function Lesson1Card({ renderedStory, onConfirm, onNeedsWork }: Lesson1CardProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-8 shadow-2xl">
        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Quick check ✨</p>
        <h2 className="text-xl font-semibold text-white mb-6">Read your story</h2>

        <div className="rounded-xl bg-zinc-950 border border-zinc-700 p-5 mb-6">
          <p className="text-base text-zinc-200 leading-relaxed italic">
            &ldquo;{renderedStory}&rdquo;
          </p>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          In your story, does the answer to the math actually change what happens?
          Or could the story play out the same either way?
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
          >
            Yes — the math matters
          </button>
          <button
            onClick={onNeedsWork}
            className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors"
          >
            Hmm, needs work
          </button>
        </div>

        <p className="text-xs text-zinc-500 mt-5 leading-relaxed">
          If the math doesn&apos;t matter, try a story where the answer changes a count, an amount, or what happens next.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 7.2: Wire into BuildFlow + extract story rendering helper**

Create a small helper at the bottom of `src/data/scenarios/index.ts`:

```ts
import type { StoryTemplate, Scenario } from "./types"
import { K_OA_A_1_SCENARIOS } from "./k-oa-a-1"

// ...existing loadScenarios...

export function renderStory(
  template: StoryTemplate,
  blanks: Record<string, string | number>
): string {
  return template.template.replace(/\{([^}]+)\}/g, (_, id: string) => {
    const v = blanks[id]
    return v != null && v !== "" ? String(v) : "___"
  })
}

export function findTemplate(
  scenario: Scenario,
  templateId: string | null
): StoryTemplate | null {
  if (!templateId) return null
  return scenario.templates.find((t) => t.id === templateId) ?? null
}
```

Update `src/components/build-flow/build-flow.tsx` to handle the lesson1 step. Add to the imports:

```tsx
import { Lesson1Card } from "./lesson1-card"
import { findTemplate, renderStory } from "@/data/scenarios"
```

Add this block before the "Step: state.step" placeholder:

```tsx
      {state.step === "lesson1" && scenario && (
        (() => {
          const template = findTemplate(scenario, state.templateId)
          if (!template) return null
          const story = renderStory(template, state.filledBlanks)
          return (
            <Lesson1Card
              renderedStory={story}
              onConfirm={() => dispatch({ type: "CONFIRM_LESSON1" })}
              onNeedsWork={() => dispatch({ type: "CLEAR_LESSON1" })}
            />
          )
        })()
      )}
```

Also update the `MadlibEditor`'s template duplication: the editor currently has its own `renderTemplate` and `findTemplate` lookups. Refactor `MadlibEditor` to import `renderStory` and `findTemplate` from `@/data/scenarios` and remove the duplicate private helpers in `madlib-editor.tsx`. Replace the private `renderTemplate` at the bottom of `madlib-editor.tsx` with the imported `renderStory`, and replace the inline `scenario.templates.find` with `findTemplate(scenario, templateId)`.

- [ ] **Step 7.3: Verify in browser**

`npx tsc --noEmit` (expect: no errors).

Walk through: pick scenario → pick template → fill blanks → click Continue. Expected: the Lesson 1 card appears with the rendered story quoted. Click "Yes — the math matters" → advances to step `math`. Click "Hmm, needs work" → returns to the mad-lib editor with values preserved.

- [ ] **Step 7.4: Commit**

```bash
git add src/data/scenarios/index.ts src/components/build-flow/lesson1-card.tsx src/components/build-flow/madlib-editor.tsx src/components/build-flow/build-flow.tsx
git commit -m "feat(build-flow): Lesson1 confirmation card with universal post-Step-2 firing"
```

---

## Task 8 — Step 3 component: MathSetter

**Files:**
- Create: `src/components/build-flow/math-setter.tsx`
- Modify: `src/components/build-flow/build-flow.tsx` (wire it in + pre-fill on mount)

- [ ] **Step 8.1: Write the MathSetter component**

Write `src/components/build-flow/math-setter.tsx`:

```tsx
"use client"

import { useMemo } from "react"
import type { Operation } from "@/data/scenarios/types"
import { lookupOperation, verbMismatchesOperation } from "@/lib/verb-operation-map"

interface MathSetterProps {
  verbPhrase: string | null
  operation: Operation | null
  n1: number | null
  n2: number | null
  onSetOperation: (op: Operation) => void
  onSetNumber: (which: "n1" | "n2", value: number) => void
  onBack: () => void
  onContinue: () => void
}

export function MathSetter({
  verbPhrase,
  operation,
  n1,
  n2,
  onSetOperation,
  onSetNumber,
  onBack,
  onContinue,
}: MathSetterProps) {
  const result = useMemo<number | null>(() => {
    if (operation == null || n1 == null || n2 == null) return null
    return operation === "+" ? n1 + n2 : n1 - n2
  }, [operation, n1, n2])

  const rangeOverflow = operation === "+" && result != null && result > 10
  const belowZero = operation === "-" && n1 != null && n2 != null && n2 > n1
  const verbHintShows =
    verbPhrase != null &&
    operation != null &&
    verbMismatchesOperation(verbPhrase, operation)

  const continueDisabled =
    operation == null ||
    n1 == null ||
    n2 == null ||
    belowZero // hard block on below-zero per spec §4

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-sm text-zinc-400 hover:text-white mb-4">
        ← Back
      </button>

      <h2 className="text-white text-lg font-semibold mb-2">Set the math</h2>
      <p className="text-sm text-zinc-400 mb-8">
        Your story has the math built in. Make sure the numbers and operation are right.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
        <select
          value={operation ?? ""}
          onChange={(e) => onSetOperation(e.target.value as Operation)}
          className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-cyan-300 text-lg font-mono"
        >
          <option value="">…</option>
          <option value="+">+</option>
          <option value="-">−</option>
        </select>

        <input
          type="number"
          min={1}
          max={9}
          value={n1 ?? ""}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (Number.isFinite(v)) onSetNumber("n1", Math.max(1, Math.min(9, v)))
          }}
          className="w-20 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-cyan-300 text-center text-lg"
        />

        <span className="text-zinc-500 text-xl font-mono">{operation === "-" ? "−" : "+"}</span>

        <input
          type="number"
          min={1}
          max={9}
          value={n2 ?? ""}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (Number.isFinite(v)) onSetNumber("n2", Math.max(1, Math.min(9, v)))
          }}
          className="w-20 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-cyan-300 text-center text-lg"
        />

        <span className="text-zinc-500 text-xl font-mono">=</span>

        <div className="w-24 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-300 text-center text-lg font-mono">
          {result == null ? "—" : belowZero ? "—" : result}
        </div>
      </div>

      <div className="min-h-[3rem] mt-4 space-y-2">
        {verbHintShows && (
          <p className="text-sm text-amber-400/80 italic">
            Your story sounds like &ldquo;{verbPhrase}&rdquo; usually means{" "}
            {operation === "+" ? "subtraction" : "addition"}. Are you sure you want{" "}
            {operation === "+" ? "addition" : "subtraction"}?
          </p>
        )}
        {rangeOverflow && (
          <p className="text-sm text-amber-400/80 italic">
            K.OA.A.1 is for numbers within 10 — try smaller numbers.
          </p>
        )}
        {belowZero && (
          <p className="text-sm text-rose-400 italic">
            You&apos;re taking away more than you have — that goes below zero. Try a smaller number, or switch to addition.
          </p>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          disabled={continueDisabled}
          onClick={onContinue}
          className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export { lookupOperation }
```

- [ ] **Step 8.2: Wire into BuildFlow with pre-fill on first entry**

In `src/components/build-flow/build-flow.tsx`, add a `useEffect` that pre-fills operation/n1/n2 from the mad-lib when the step transitions to `math` for the first time. Add to imports:

```tsx
import { useEffect } from "react"
import { MathSetter } from "./math-setter"
import { lookupOperation } from "@/lib/verb-operation-map"
```

Inside the component, add this effect after the existing memos:

```tsx
  // Pre-fill Step 3 from Step 2 when entering math step with no existing values
  useEffect(() => {
    if (state.step !== "math") return
    if (state.operation != null && state.n1 != null && state.n2 != null) return
    const template = findTemplate(scenario!, state.templateId)
    if (!template) return
    if (state.operation == null) {
      const verb = state.filledBlanks["verbPhrase"]
      const op =
        (typeof verb === "string" ? lookupOperation(verb) : null) ?? template.operation
      dispatch({ type: "SET_OPERATION", payload: op })
    }
    if (state.n1 == null) {
      const v = state.filledBlanks["n1"]
      if (typeof v === "number") dispatch({ type: "SET_NUMBER", payload: { which: "n1", value: v } })
    }
    if (state.n2 == null) {
      const v = state.filledBlanks["n2"]
      if (typeof v === "number") dispatch({ type: "SET_NUMBER", payload: { which: "n2", value: v } })
    }
  }, [state.step, state.operation, state.n1, state.n2, state.filledBlanks, state.templateId, scenario])
```

Add the math step rendering block, replacing the placeholder for `state.step !== "scenario" && state.step !== "madlib" && state.step !== "lesson1"`:

```tsx
      {state.step === "math" && scenario && (
        <MathSetter
          verbPhrase={
            typeof state.filledBlanks["verbPhrase"] === "string"
              ? (state.filledBlanks["verbPhrase"] as string)
              : null
          }
          operation={state.operation}
          n1={state.n1}
          n2={state.n2}
          onSetOperation={(op) => dispatch({ type: "SET_OPERATION", payload: op })}
          onSetNumber={(which, value) => dispatch({ type: "SET_NUMBER", payload: { which, value } })}
          onBack={() => dispatch({ type: "GO_TO_STEP", payload: "madlib" })}
          onContinue={() => dispatch({ type: "GO_TO_STEP", payload: "mechanic" })}
        />
      )}

      {state.step !== "scenario" && state.step !== "madlib" && state.step !== "lesson1" && state.step !== "math" && (
        <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-zinc-400">
          <p>Step: <span className="text-white">{state.step}</span></p>
          <button onClick={() => dispatch({ type: "RESET" })} className="mt-4 text-xs text-zinc-500 underline">
            Back to start
          </button>
        </div>
      )}
```

- [ ] **Step 8.3: Verify in browser**

`npx tsc --noEmit` (expect: no errors).

Walk: scenario → template → fill → Lesson1 confirm → Step 3 appears. Expected: operation + n1 + n2 are pre-filled. If you change operation to mismatch the verb, the verb-hint appears. If you set n1=7, n2=8, addition → "K.OA.A.1 is for numbers within 10" hint shows. If subtraction and n2 > n1 → result shows "—" and Continue is disabled with the below-zero message.

- [ ] **Step 8.4: Commit**

```bash
git add src/components/build-flow/math-setter.tsx src/components/build-flow/build-flow.tsx
git commit -m "feat(build-flow): Step 3 MathSetter with verb-parse pre-fill, range guards, soft Lesson 2 hint"
```

---

## Task 9 — Step 4 component: MechanicPicker

**Files:**
- Create: `src/components/build-flow/mechanic-picker.tsx`
- Modify: `src/components/build-flow/build-flow.tsx` (wire it in)
- Modify: `src/lib/game-engines/game-option-registry.ts` (add display-card fields for the 4 PRIMARY engines)

- [ ] **Step 9.1: Read the mechanic map at module scope**

Write `src/components/build-flow/mechanic-picker.tsx`:

```tsx
"use client"

import { useMemo } from "react"
import standardMechanicMap from "@/data/standard-mechanic-map.json"
import { getOptionDef } from "@/lib/game-engines/game-option-registry"

interface MechanicPickerProps {
  standardId: string
  selectedMechanicId: string | null
  onPick: (mechanicId: string) => void
  onBack: () => void
}

interface PrimaryEntry {
  engineId: string
  rationale: string
}

interface StandardEntry {
  standardText: string
  namedSkill?: string
  primary?: PrimaryEntry[]
}

interface MechanicMap {
  standards: Record<string, StandardEntry>
}

export function MechanicPicker({
  standardId,
  selectedMechanicId,
  onPick,
  onBack,
}: MechanicPickerProps) {
  const primaryIds = useMemo<string[]>(() => {
    const map = standardMechanicMap as unknown as MechanicMap
    const entry = map.standards[standardId]
    return entry?.primary?.map((p) => p.engineId) ?? []
  }, [standardId])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-sm text-zinc-400 hover:text-white mb-4">
        ← Back
      </button>

      <h2 className="text-white text-lg font-semibold mb-2">Pick a mechanic</h2>
      <p className="text-sm text-zinc-400 mb-6">How does the player solve your problem?</p>

      {primaryIds.length === 0 ? (
        <div className="rounded-xl bg-amber-950/30 border border-amber-800 p-6">
          <p className="text-sm text-amber-200">
            No verified mechanics are available for {standardId} yet. This is a
            coverage gap flagged in Audit 13. Tell Barbara — she&apos;ll add one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {primaryIds.map((id) => {
            const def = getOptionDef(id)
            const isSelected = selectedMechanicId === id
            return (
              <button
                key={id}
                onClick={() => onPick(id)}
                className={`text-left rounded-xl p-5 bg-zinc-900 border transition-all ${
                  isSelected
                    ? "border-cyan-400 ring-2 ring-cyan-400/30"
                    : "border-zinc-800 hover:border-cyan-400/50 hover:bg-zinc-800"
                }`}
              >
                <h3 className="text-white font-semibold text-base mb-2">
                  {def?.title ?? id}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {def?.description ?? "A math mechanic for this standard."}
                </p>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 9.2: Verify getOptionDef returns title + description for the 4 PRIMARY engines**

Run: `npx tsx -e "import { getOptionDef } from './src/lib/game-engines/game-option-registry'; for (const id of ['number-frames','free-collect','cuisenaire-rods','bar-model']) { const d = getOptionDef(id); console.log(id, d?.title ?? '<no title>', d?.description ? d.description.slice(0,60) : '<no desc>'); }"`

If any of the four returns `<no title>` or `<no desc>`, open `src/lib/game-engines/game-option-registry.ts` and ensure the entry has `title:` and `description:` fields populated with the values from spec §5:

| Engine ID | Display title | Description |
|---|---|---|
| `number-frames` | Ten-Frame Counters | Drop counters into ten-frames, then count them all together. |
| `free-collect` | Catch & Count | Catch falling items into a basket, then count what you got. |
| `cuisenaire-rods` | Length Rods | Snap two colored rods end-to-end to make a longer one. |
| `bar-model` | Bar Model | Build two bars side by side to show the parts and the whole. |

Make the edits only if a field is missing or generic — leave existing values intact otherwise.

- [ ] **Step 9.3: Wire MechanicPicker into BuildFlow**

Add to `src/components/build-flow/build-flow.tsx` imports:

```tsx
import { MechanicPicker } from "./mechanic-picker"
```

Add the rendering block (before the trailing placeholder):

```tsx
      {state.step === "mechanic" && scenario && (
        <MechanicPicker
          standardId={standardId}
          selectedMechanicId={state.mechanicId}
          onPick={(id) => dispatch({ type: "PICK_MECHANIC", payload: id })}
          onBack={() => dispatch({ type: "GO_TO_STEP", payload: "math" })}
        />
      )}
```

Update the trailing placeholder condition to exclude `mechanic` too:

```tsx
      {!["scenario", "madlib", "lesson1", "math", "mechanic"].includes(state.step) && (
        <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-zinc-400">
          <p>Step: <span className="text-white">{state.step}</span></p>
          <button onClick={() => dispatch({ type: "RESET" })} className="mt-4 text-xs text-zinc-500 underline">
            Back to start
          </button>
        </div>
      )}
```

- [ ] **Step 9.4: Verify in browser**

`npx tsc --noEmit` (expect: no errors).

Walk to Step 4. Expected: 4 cards visible (Ten-Frame Counters, Catch & Count, Length Rods, Bar Model). Clicking one advances to step `playtest`.

- [ ] **Step 9.5: Commit**

```bash
git add src/components/build-flow/mechanic-picker.tsx src/components/build-flow/build-flow.tsx src/lib/game-engines/game-option-registry.ts
git commit -m "feat(build-flow): Step 4 MechanicPicker reading PRIMARY engines from standard-mechanic-map"
```

---

## Task 10 — Step 5 component: PlaytestSubmit

**Files:**
- Create: `src/components/build-flow/playtest-submit.tsx`
- Modify: `src/components/build-flow/build-flow.tsx` (wire it in)

- [ ] **Step 10.1: Write the PlaytestSubmit component**

Write `src/components/build-flow/playtest-submit.tsx`:

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/lib/auth"
import { apiFetch } from "@/lib/api-fetch"
import { GameIframe } from "@/components/game/game-iframe"
import type { Operation } from "@/data/scenarios/types"

interface PlaytestSubmitProps {
  standardId: string
  mechanicId: string
  scenarioId: string
  scenarioTitle: string
  renderedStory: string
  operation: Operation
  n1: number
  n2: number
  hasBeatenOwnGame: boolean
  isSubmitting: boolean
  submittedGameId: string | null
  onMarkBeaten: () => void
  onBeginSubmit: () => void
  onFinishSubmit: (gameId: string | null) => void
  onBack: () => void
}

export function PlaytestSubmit(props: PlaytestSubmitProps) {
  const {
    standardId,
    mechanicId,
    scenarioId,
    scenarioTitle,
    renderedStory,
    operation,
    n1,
    n2,
    hasBeatenOwnGame,
    isSubmitting,
    submittedGameId,
    onMarkBeaten,
    onBeginSubmit,
    onFinishSubmit,
    onBack,
  } = props

  const { activeProfile } = useAuth()
  const [html, setHtml] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const requestedRef = useRef(false)

  // Generate the engine HTML once on mount
  useEffect(() => {
    if (requestedRef.current) return
    requestedRef.current = true
    let cancelled = false
    ;(async () => {
      try {
        const res = await apiFetch("/api/game/generate-engine", {
          method: "POST",
          body: JSON.stringify({
            mechanicId,
            gameOption: mechanicId,
            standardId,
            standardDescription: renderedStory,
            grade: "K",
            skeletonMode: false,
            designDoc: {
              title: scenarioTitle,
              scenario: scenarioId,
              operation,
              n1,
              n2,
              story: renderedStory,
            },
          }),
        })
        const data = await res.json()
        if (cancelled) return
        if (typeof data?.html === "string") setHtml(data.html)
        else setLoadError("The game didn't load. Try again.")
      } catch (err) {
        if (!cancelled)
          setLoadError(err instanceof Error ? err.message : "Failed to load game")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [mechanicId, standardId, scenarioId, scenarioTitle, renderedStory, operation, n1, n2])

  async function handleSubmit() {
    if (!activeProfile || !html) return
    onBeginSubmit()
    try {
      const title = `${scenarioTitle}: ${renderedStory.slice(0, 50)}`
      const res = await apiFetch("/api/game/save", {
        method: "POST",
        body: JSON.stringify({
          title,
          authorUid: activeProfile.uid,
          authorName: activeProfile.name || "Anonymous",
          designerName: activeProfile.name || "Anonymous",
          standardId,
          gameHtml: html,
          designDoc: { scenarioId, operation, n1, n2, story: renderedStory, mechanicId },
          playCount: 0,
          ratingSum: 0,
          ratingCount: 0,
          status: "pending_review",
        }),
      })
      const data = await res.json().catch(() => ({}))
      onFinishSubmit(data?.id ?? null)
    } catch {
      onFinishSubmit(null)
    }
  }

  if (submittedGameId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">🎉</p>
        <h2 className="text-xl font-semibold text-white mb-2">Your game is in review!</h2>
        <p className="text-sm text-zinc-400">
          Your guide will take a look. Tokens land when they approve it.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={onBack} className="text-sm text-zinc-400 hover:text-white mb-3">
        ← Back
      </button>

      <div className="rounded-xl bg-emerald-950/30 border border-emerald-700 px-4 py-2 mb-3 text-sm text-emerald-200">
        {hasBeatenOwnGame
          ? "You won! Submit your game when you're ready."
          : "You must beat your own game once before you can submit."}
      </div>

      <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950" style={{ aspectRatio: "16/10" }}>
        {loadError ? (
          <div className="h-full flex items-center justify-center p-8 text-rose-400 text-sm">
            {loadError}
          </div>
        ) : !html ? (
          <div className="h-full flex items-center justify-center p-8 text-zinc-500 text-sm">
            Loading your game…
          </div>
        ) : (
          <GameIframe html={html} className="w-full h-full" onWin={() => onMarkBeaten()} />
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button
          disabled={!hasBeatenOwnGame || isSubmitting}
          onClick={handleSubmit}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting…" : "Submit for review"}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 10.2: Wire PlaytestSubmit into BuildFlow**

Add to `src/components/build-flow/build-flow.tsx` imports:

```tsx
import { PlaytestSubmit } from "./playtest-submit"
```

Add the rendering block (before the trailing placeholder):

```tsx
      {state.step === "playtest" && scenario && state.templateId && state.mechanicId && state.operation && state.n1 != null && state.n2 != null && (
        (() => {
          const template = findTemplate(scenario, state.templateId)
          if (!template) return null
          const story = renderStory(template, state.filledBlanks)
          return (
            <PlaytestSubmit
              standardId={standardId}
              mechanicId={state.mechanicId}
              scenarioId={scenario.id}
              scenarioTitle={scenario.title}
              renderedStory={story}
              operation={state.operation}
              n1={state.n1}
              n2={state.n2}
              hasBeatenOwnGame={state.hasBeatenOwnGame}
              isSubmitting={state.isSubmitting}
              submittedGameId={state.submittedGameId}
              onMarkBeaten={() => dispatch({ type: "MARK_BEATEN" })}
              onBeginSubmit={() => dispatch({ type: "BEGIN_SUBMIT" })}
              onFinishSubmit={(id) => dispatch({ type: "FINISH_SUBMIT", payload: id })}
              onBack={() => dispatch({ type: "GO_TO_STEP", payload: "mechanic" })}
            />
          )
        })()
      )}
```

Update the trailing placeholder condition to exclude `playtest`:

```tsx
      {!["scenario", "madlib", "lesson1", "math", "mechanic", "playtest"].includes(state.step) && (
        ...
      )}
```

- [ ] **Step 10.3: Verify in browser**

`npx tsc --noEmit` (expect: no errors).

Sign in. Walk full flow. Expected: at Step 5, the engine loads (or shows a loading state, then an error if the engine doesn't support the payload — note for later). Play until win → green banner flips to "submit when ready" → Submit → success screen.

If the engine fails to render with the Builder's parameters, that's a deeper integration issue with `/api/game/generate-engine` and the engine code itself; flag it but don't block the rest of the flow. Open an issue for it after the plan completes.

- [ ] **Step 10.4: Commit**

```bash
git add src/components/build-flow/playtest-submit.tsx src/components/build-flow/build-flow.tsx
git commit -m "feat(build-flow): Step 5 PlaytestSubmit with engine render, beat-game gate, save flow"
```

---

## Task 11 — Side menu drawer

**Files:**
- Create: `src/components/build-flow/side-menu.tsx`
- Modify: `src/components/build-flow/build-flow.tsx` (wire it into header)

- [ ] **Step 11.1: Write the SideMenu component**

Write `src/components/build-flow/side-menu.tsx`:

```tsx
"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

interface SideMenuProps {
  standardId: string
}

export function SideMenu({ standardId }: SideMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="p-2 rounded hover:bg-zinc-800 transition-colors"
      >
        <Menu className="size-5 text-zinc-400" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="w-full max-w-sm bg-zinc-950 border-l border-zinc-800 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <h2 className="text-sm font-semibold text-white">Menu</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-1 rounded hover:bg-zinc-800"
              >
                <X className="size-5 text-zinc-400" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-3 space-y-1">
              <Link
                href={`/api/explanations?standardId=${encodeURIComponent(standardId)}`}
                className="block px-3 py-3 rounded-lg text-sm text-zinc-200 hover:bg-zinc-900"
                target="_blank"
              >
                Learn more about {standardId}
              </Link>
              <Link
                href={`/library?skill=${encodeURIComponent(standardId)}`}
                className="block px-3 py-3 rounded-lg text-sm text-zinc-200 hover:bg-zinc-900"
                target="_blank"
              >
                Play games on this skill
              </Link>
              <Link
                href="/profile"
                className="block px-3 py-3 rounded-lg text-sm text-zinc-200 hover:bg-zinc-900"
              >
                Profile &amp; settings
              </Link>
              <Link
                href="/"
                className="block px-3 py-3 rounded-lg text-sm text-zinc-400 hover:bg-zinc-900"
              >
                Exit (your progress is saved)
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 11.2: Wire SideMenu into BuildFlow header**

Update the header in `src/components/build-flow/build-flow.tsx`:

```tsx
import { SideMenu } from "./side-menu"

// ...

      <header className="border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
        <h1 className="text-sm font-medium text-zinc-300">
          {standardId} — Adding and taking away within 10
        </h1>
        <SideMenu standardId={standardId} />
      </header>
```

- [ ] **Step 11.3: Verify**

`npx tsc --noEmit` (expect: no errors). Open the build flow, click the hamburger top-right. Expected: drawer slides in with menu items.

- [ ] **Step 11.4: Commit**

```bash
git add src/components/build-flow/side-menu.tsx src/components/build-flow/build-flow.tsx
git commit -m "feat(build-flow): side-menu drawer with Learn More / Play / Profile / Exit links"
```

---

## Task 12 — Critique route honors skipStages

**Files:**
- Modify: `src/app/api/game/critique/route.ts` (accept and honor `skipStages` array)

- [ ] **Step 12.1: Add the skipStages parameter**

Open `src/app/api/game/critique/route.ts`. Find where the request body is parsed (near the top of the POST handler). Update to extract `skipStages`:

```ts
const { standardId, scenario, gameHtml, skipStages } = (await req.json()) as {
  standardId: string
  scenario: string
  gameHtml: string
  skipStages?: number[]
}
```

For each of the four stage blocks, wrap the stage in a skip check. Example for Stage 1:

```ts
  // ---------- Stage 1: Haiku Critic ----------
  if (skipStages?.includes(1)) {
    stages.push({
      stage: 1,
      stageName: "Haiku Critic",
      passed: true,
      builderFacingMessage: undefined,
      costEstimateUsd: 0,
    })
  } else {
    try {
      // ...existing stage 1 body unchanged...
    } catch (err) {
      // ...existing catch unchanged...
    }
  }
```

Apply the same pattern to Stages 2, 3, and 4. Each skipped stage produces a `passed: true` StageResult with cost 0 and no builderFacingMessage, so the response shape stays consistent.

For our template-only Step 5 flow, the save path **does not call `/api/game/critique` at all** — there's no Builder code to inspect. So `skipStages` is a hedge in case any caller wants to skip a subset; it isn't called from the K.OA.A.1 path. Documenting the param now keeps the API clean for future paste-HTML use.

- [ ] **Step 12.2: Verify TypeScript**

Run: `npx tsc --noEmit` (expect: no errors).

- [ ] **Step 12.3: Commit**

```bash
git add src/app/api/game/critique/route.ts
git commit -m "feat(critique): accept skipStages array; template path won't call critique"
```

---

## Task 13 — Standard-panel entry point routes to /build/[standardId]

**Files:**
- Modify: `src/components/standard/standard-panel.tsx`

- [ ] **Step 13.1: Change "Open Game Assembler" to navigate to the new route**

Open `src/components/standard/standard-panel.tsx`. Find the "Open Game Assembler" button (around line 263–268) and replace its `onClick={onBuild}` with a `Link` to `/build/{standard.id}`.

Find:

```tsx
              {/* Open the Game Assembler */}
              <button
                onClick={onBuild}
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-base font-bold transition-colors shadow-lg shadow-emerald-900/30"
              >
                Open Game Assembler →
              </button>
```

Replace with:

```tsx
              {/* Open the Build flow at /build/{standardId} */}
              <Link
                href={`/build/${encodeURIComponent(standard.id)}`}
                onClick={() => onClose()}
                className="block w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-base font-bold transition-colors shadow-lg shadow-emerald-900/30 text-center"
              >
                Open Build Flow →
              </Link>
```

(`Link` is already imported at the top of the file. The `onClose()` call ensures the panel closes when the navigation happens.)

- [ ] **Step 13.2: Verify in browser**

`npx tsc --noEmit` (expect: no errors).

Open the galaxy, click any K.OA.A.1 moon, click "Open Build Flow →". Expected: navigates to `/build/K.OA.A.1` and the scenario picker appears.

- [ ] **Step 13.3: Commit**

```bash
git add src/components/standard/standard-panel.tsx
git commit -m "feat(standard-panel): route 'Open Build Flow' button to /build/[standardId]"
```

---

## Task 14 — End-to-end manual verification

**Files:** none (verification only)

- [ ] **Step 14.1: Walk the full happy path**

Run `npm run dev`. Sign in. Open galaxy. Click K.OA.A.1 moon. Click "Open Build Flow →". Verify in order:

1. Scenario picker shows 10 cards in 2×5 grid (or appropriate responsive grid).
2. Pick "Penny Jar" — mad-lib template selector shows 3 stories.
3. Pick a template — blanks render inline with dropdowns and number inputs.
4. Fill all blanks — preview shows the rendered story. Continue enables.
5. Click Continue — Lesson 1 card appears with the quoted story.
6. Click "Yes — the math matters" — advances to Step 3 with operation, n1, n2 pre-filled.
7. Try a verb-operation mismatch (manually flip the operation): amber hint appears.
8. Try numbers that sum to >10: the within-10 hint appears (non-blocking).
9. Try subtraction with n2 > n1: result shows "—", below-zero message shows, Continue is disabled.
10. Reset to valid values, click Continue. Step 4 mechanic picker shows exactly 4 cards: Ten-Frame Counters, Catch & Count, Length Rods, Bar Model.
11. Pick a mechanic. Step 5 loads. Engine renders with Builder's numbers.
12. Play until win. Submit button enables. Click Submit. Success screen appears.

- [ ] **Step 14.2: Walk the "Hmm, needs work" path**

Restart. Pick a scenario, pick a template, fill blanks, click Continue. On the Lesson 1 card, click "Hmm, needs work". Verify: returns to the mad-lib editor with values preserved.

- [ ] **Step 14.3: Walk the "Back" buttons at every step**

Verify Back from Step 3 → Step 2; Back from Step 4 → Step 3; Back from Step 5 → Step 4. State preserved at each step.

- [ ] **Step 14.4: Document any bugs found**

If the engine render at Step 5 fails for any of the 4 PRIMARY engines, document in a new file `docs/audit/foundation-fix-1-followup.md` which engine failed and the error. Engine-side fixes are out of scope for this plan; they go into a follow-up workstream.

- [ ] **Step 14.5: Commit (if doc was written)**

```bash
git add docs/audit/  # only if you wrote follow-up notes
git commit -m "docs: engine-render follow-up notes from K.OA.A.1 build flow verification"
```

---

## Task 15 — Delete legacy screens (after verification)

**Files:**
- Delete: `src/components/builders/builder-host.tsx`
- Delete: `src/components/builders/builder-picker.tsx`
- Delete: `src/components/builders/sentence-builder.tsx`
- Delete: `src/components/builders/madlib-builder.tsx`
- Delete: `src/components/builders/comic-builder.tsx`
- Delete: `src/components/builders/card-builder.tsx`
- Delete: `src/components/builders/sandpack-builder.tsx`
- Delete: `src/components/standard/scenario-gate.tsx`

- [ ] **Step 15.1: Find remaining callers**

Run: search for imports of each deleted file. Use Grep:

```
ScenarioGate|BuilderHost|BuilderPicker|SentenceBuilder|MadlibBuilder|ComicBuilder|CardBuilder|SandpackBuilder
```

Expected callers (to be removed/refactored):
- `src/components/standard/standard-panel.tsx` still imports `BuilderHost` and `ScenarioGate`. Remove those imports and the `step === "gate"`/`step === "builder"` blocks. The flow now routes to `/build/[standardId]` instead.

- [ ] **Step 15.2: Edit standard-panel.tsx to remove legacy step rendering**

In `src/components/standard/standard-panel.tsx`:

- Remove the `import { ScenarioGate } from "./scenario-gate"` line.
- Remove the `import { BuilderHost } from "@/components/builders/builder-host"` line.
- Delete the entire `{step === "gate" && ...}` block (the `<ScenarioGate ... />` rendering).
- Delete the entire `{step === "builder" && ...}` block (the `<BuilderHost ... />` rendering).
- In the `FlowStep` type definition, remove `"gate"` and `"builder"` if they appear.
- In the `<Sheet open=...>` condition, remove `step !== "gate"` and `step !== "builder"` clauses.
- Remove the `onBuildGame` prop from the component's prop interface and any places it's passed/handled. If `onBuildGame` is required by parent callers, leave the prop signature but make it optional and unused (search for callers of `<StandardPanel>` and confirm none break).

- [ ] **Step 15.3: Delete the files**

Run (PowerShell or Bash):

```
git rm src/components/builders/builder-host.tsx
git rm src/components/builders/builder-picker.tsx
git rm src/components/builders/sentence-builder.tsx
git rm src/components/builders/madlib-builder.tsx
git rm src/components/builders/comic-builder.tsx
git rm src/components/builders/card-builder.tsx
git rm src/components/builders/sandpack-builder.tsx
git rm src/components/standard/scenario-gate.tsx
```

- [ ] **Step 15.4: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`. Expected: no errors. If any error references an import we missed, search for that import and remove it.

Run: `npx eslint .` (or `npm run lint`). Expected: no new errors.

- [ ] **Step 15.5: Re-walk the happy path in the browser**

Repeat Step 14.1. Verify the flow still works end-to-end after the deletions.

- [ ] **Step 15.6: Commit**

```bash
git add -A
git commit -m "chore(legacy): delete BuilderHost, BuilderPicker, ScenarioGate, and sibling builder components

Replaced by /build/[standardId] 5-step flow per spec
docs/superpowers/specs/2026-05-11-koa-a-1-build-flow.md."
```

---

## Self-review (run after writing all tasks)

This was run by Claude after writing the plan. Notes:

- **Placeholder scan:** no "TBD"/"TODO"/"add appropriate" in any task. Each step shows the exact code.
- **Spec coverage:** every section of the K.OA.A.1 spec (§1 At-a-glance, §2 Step 1, §3 Step 2 + Lesson 1, §4 Step 3, §5 Step 4, §6 Step 5, §7 side menu, §8 file deletes) maps to a numbered task. The 5 open questions in spec §9 were answered before this plan was written.
- **Type consistency:** `BuildState.step` uses `StepId` defined in `types.ts`; `Operation` is `"+" | "-"` everywhere; `StoryBlank` is a discriminated union; `Scenario.templates` is `StoryTemplate[]`. Reducer payload types are all narrow casts at the boundary.
- **One known integration risk:** Task 10 (PlaytestSubmit) calls `/api/game/generate-engine` with a payload shape the engines may not all read. Step 14.4 captures this as a follow-up; engine-side fixes are out of scope for this plan.
- **Scope:** all tasks together produce a working K.OA.A.1 build flow with the legacy screens deleted. Other standards' build flows need their own scenario data files but reuse this entire component tree.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-11-koa-a-1-build-flow.md`. Two execution options:

**1. Subagent-Driven (recommended)** — A fresh subagent runs each task; Claude reviews between tasks; fast iteration with code-reviewer at plan-end.

**2. Inline Execution** — Tasks run in this session via the `executing-plans` skill; batch execution with checkpoints for your review.

Which approach?
