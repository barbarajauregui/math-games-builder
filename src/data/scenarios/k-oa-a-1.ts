import type { Scenario } from "./types"

const COIN_JAR_CHARACTERS = ["Grandma", "Dad", "Mei", "Jamal", "a friend", "the storekeeper"]
// v2 (2026-05-11 evening) per Audit 14: generalized from "pennies" to a
// selectable items list. Original "Penny Jar" was US-coin-specific.
const COIN_JAR_ITEMS = ["coins", "beads", "marbles", "pebbles", "buttons", "shells"]
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
    id: "coin-jar",
    title: "Coin Jar",
    description: "A jar where small things get added or taken out.",
    emoji: "💰",
    illustrationAsset: null,
    templates: [
      {
        id: "coin-jar-t1",
        template: "{character} has {n1} {items} in their jar. They {verbPhrase} {n2} more {items}. How many {items} are in the jar now?",
        operation: "+",
        blanks: [
          { id: "character", kind: "dropdown", options: COIN_JAR_CHARACTERS },
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "items", kind: "dropdown", options: COIN_JAR_ITEMS },
          { id: "verbPhrase", kind: "dropdown", options: ["get", "find", "earn", "are given"] },
          { id: "n2", kind: "number", min: 1, max: 9 },
        ],
      },
      {
        id: "coin-jar-t2",
        template: "{character} has {n1} {items}. They {verbPhrase} {n2} of them. How many {items} are left?",
        operation: "-",
        blanks: [
          { id: "character", kind: "dropdown", options: COIN_JAR_CHARACTERS },
          { id: "n1", kind: "number", min: 2, max: 9 },
          { id: "items", kind: "dropdown", options: COIN_JAR_ITEMS },
          { id: "verbPhrase", kind: "dropdown", options: ["spend", "lose", "give away", "drop"] },
          { id: "n2", kind: "number", min: 1, max: 8 },
        ],
      },
      {
        id: "coin-jar-t3",
        template: "There are {n1} {items} on the table. {character} {verbPhrase} {n2} more from the couch. How many {items} in all?",
        operation: "+",
        blanks: [
          { id: "n1", kind: "number", min: 1, max: 9 },
          { id: "items", kind: "dropdown", options: COIN_JAR_ITEMS },
          { id: "character", kind: "dropdown", options: COIN_JAR_CHARACTERS },
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
