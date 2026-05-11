import type { Scenario } from "./types"

const COIN_JAR_CHARACTERS = ["Grandma", "Dad", "Mei", "Jamal", "a friend", "the storekeeper"]
// v2 (2026-05-11 evening) per Audit 14: generalized from "pennies" to a
// selectable items list. Original "Penny Jar" was US-coin-specific.
const COIN_JAR_ITEMS = ["coins", "beads", "marbles", "pebbles", "buttons", "shells"]
const SNACK_ITEMS = ["cookies", "crackers", "grapes", "orange slices", "cheese cubes", "carrot sticks"]
const SNACK_CHARACTERS = ["Mama", "Papa", "Lucia", "Ben", "your sister", "your brother"]
const SCHOOL_BUS_CHARACTERS = ["the driver", "Mr. Lee", "Ms. Patel", "the helper"]
const FISH_TANK_CHARACTERS = ["Mom", "Dad", "the pet store owner", "Lucia", "Ben", "the diver"]
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
]
