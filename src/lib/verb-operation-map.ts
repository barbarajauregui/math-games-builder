import type { Operation } from "@/data/scenarios/types"

/**
 * ADVISORY verb-operation lookup. Pre-fills the Step 3 operation dropdown
 * for the Builder's convenience; does NOT drive any warning or block.
 *
 * Per Audit 14 §1 (Moschkovich corpus on bilingual math learners), keyword
 * strategies in math word problems fail for English Learners. Even with
 * curated dropdowns, hard-coding the verb→operation mapping as authoritative
 * reifies the keyword strategy. The lookup is one signal among many; the
 * Builder owns the math choice.
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
  "swim out": "+", // context: "swim out from behind the rock" — appearing, not leaving (fish-tank-t3)
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
  "brings home": "+",

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
  "pick": "-",
}

// "swim out" is intentionally ADDITIVE in this map. In template fish-tank-t3
// ("{n1} goldfish are swimming. {n2} more goldfish swim out from behind the
// rock. How many goldfish in all?") the verb describes goldfish appearing
// from behind a rock — joining the visible group, not leaving the tank.
// Adding it to the additive section above for clarity:

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
 * DEPRECATED in v2. The verb-mismatch check was used by an earlier Step 3
 * design that fired a "Lesson 2 soft warning" when the Builder's verb
 * implied one operation but they picked the other. Per Audit 14 §1
 * (Moschkovich on EL keyword-strategy failure), this warning was removed.
 * Kept exported only because some telemetry path may log disagreement
 * events to learning_data without showing the kid anything.
 */
export function verbMismatchesOperation(verbPhrase: string, chosen: Operation): boolean {
  const implied = lookupOperation(verbPhrase)
  return implied !== null && implied !== chosen
}
