import type { Scenario } from "./types"

/**
 * K.OA.A.1 Level 1 scenarios.
 *
 * Per spec v3 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md` §3):
 * 9 pre-made Level 1 games — 3 Scenarios per PRIMARY Game Mechanic.
 *
 * - Counting Collection: Coin Jar · Fish Tank · Snack Plate
 * - Group-Then-Combine:  Bakery · School Bus · Classroom
 * - Take-From:           Toy Store · Birthday Party · Farm
 *
 * The Level 1 picker shows compact title + oneLineDescription. No images.
 * lessonText is shown at the bottom of the Level 1 play screen (§4) while
 * the Builder plays — ≤ 80 words, plain language, K.OA-progressions-derived.
 *
 * The preMadeGameUrl values are stub URLs. The actual pre-made games are a
 * separate workstream (spec §16, Task 14); these URLs will 404 until then.
 */
export const K_OA_A_1_SCENARIOS: Scenario[] = [
  // -------- Counting Collection --------
  {
    id: "coin-jar",
    mechanicId: "counting-collection",
    title: "Coin Jar",
    oneLineDescription: "Drop coins into the jar.",
    preMadeGameUrl: "/games/k-oa-a-1/counting-collection/coin-jar.html",
    lessonText:
      "What you're showing: Adding means putting groups together. When you drop 3 coins into a jar that already has 4 coins, you have 7 coins. Watch for: The total comes from counting all of them, not just the new ones. Words to use in your own game: altogether, in all, how many now.",
  },
  {
    id: "fish-tank",
    mechanicId: "counting-collection",
    title: "Fish Tank",
    oneLineDescription: "Tap each fish to count them all.",
    preMadeGameUrl: "/games/k-oa-a-1/counting-collection/fish-tank.html",
    lessonText:
      "What you're showing: Every fish counts as one. You tap each fish, one at a time, to find how many are swimming. Watch for: The player must touch each fish themselves — the game doesn't count for them. Words to use in your own game: each, every, how many in all.",
  },
  {
    id: "snack-plate",
    mechanicId: "counting-collection",
    title: "Snack Plate",
    oneLineDescription: "Tap each snack on the plate.",
    preMadeGameUrl: "/games/k-oa-a-1/counting-collection/snack-plate.html",
    lessonText:
      "What you're showing: Counting means saying one number for one thing. When you tap each cookie on the plate, you say one number per cookie until they're all counted. Watch for: Don't skip any. Don't count one twice. Words to use in your own game: one at a time, count them all, how many.",
  },

  // -------- Group-Then-Combine --------
  {
    id: "bakery",
    mechanicId: "group-then-combine",
    title: "Bakery",
    oneLineDescription: "Make two trays of bread, then count them together.",
    preMadeGameUrl: "/games/k-oa-a-1/group-then-combine/bakery.html",
    lessonText:
      "What you're showing: Adding means putting two groups together to find how many. The baker makes 3 muffins on one tray and 4 on another. Now count them as one big group. Watch for: You count everything, not just one tray. Words to use in your own game: put together, altogether, how many in all.",
  },
  {
    id: "school-bus",
    mechanicId: "group-then-combine",
    title: "School Bus",
    oneLineDescription: "Pick up kids at two stops, then count everyone.",
    preMadeGameUrl: "/games/k-oa-a-1/group-then-combine/school-bus.html",
    lessonText:
      "What you're showing: When two groups join, the total is everyone counted as one. The bus picks up 2 kids, then 3 more. Count them together to find how many ride to school. Watch for: The new kids and the first kids are all on the bus now. Words to use in your own game: join, altogether, how many now.",
  },
  {
    id: "classroom",
    mechanicId: "group-then-combine",
    title: "Classroom",
    oneLineDescription: "Bring two tables of kids to the rug, then count them.",
    preMadeGameUrl: "/games/k-oa-a-1/group-then-combine/classroom.html",
    lessonText:
      "What you're showing: Two small groups make one bigger group. 4 kids at the red table and 2 at the blue table come to the rug. Now count everyone on the rug. Watch for: Count each kid once. The answer is the whole rug, not one table. Words to use in your own game: come together, all of them, how many in all.",
  },

  // -------- Take-From --------
  {
    id: "toy-store",
    mechanicId: "take-from",
    title: "Toy Store",
    oneLineDescription: "Start with toys on the shelf, sell some, count what's left.",
    preMadeGameUrl: "/games/k-oa-a-1/take-from/toy-store.html",
    lessonText:
      "What you're showing: Taking away means starting with a group, removing some, and counting what's still there. The shelf has 6 teddy bears. A kid buys 2. How many are left? Watch for: You only count the toys still on the shelf. Words to use in your own game: take away, how many left, are left.",
  },
  {
    id: "birthday-party",
    mechanicId: "take-from",
    title: "Birthday Party",
    oneLineDescription: "Start with balloons, pop some, count what's left.",
    preMadeGameUrl: "/games/k-oa-a-1/take-from/birthday-party.html",
    lessonText:
      "What you're showing: When balloons pop, they're gone from the count. Start with 7 balloons. 3 pop. How many balloons are still floating? Watch for: The popped balloons don't count. Only count the ones still there. Words to use in your own game: gone, left, how many are still here.",
  },
  {
    id: "farm",
    mechanicId: "take-from",
    title: "Farm",
    oneLineDescription: "Start with animals in the barn, let some out, count what's left.",
    preMadeGameUrl: "/games/k-oa-a-1/take-from/farm.html",
    lessonText:
      "What you're showing: When animals leave the barn, they're not in the count anymore. 8 cows are in the barn. The farmer lets 3 out to the field. How many cows are still in the barn? Watch for: Count only the cows still inside. Words to use in your own game: leave, still here, how many remain.",
  },
]
