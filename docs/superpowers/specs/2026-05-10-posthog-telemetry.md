# PostHog telemetry — behavioral and pedagogical event stream

> **Status:** Draft v1, 2026-05-10. Sibling to the Library/Galaxy spec and the Mastery Check spec. Owner: Barbara. Per the brainstorming-skill flow, the next step after Barbara approves is invoking `writing-plans` to produce an implementation plan.
>
> **Scope:** the event taxonomy, privacy posture, engine integration shape, detection patterns, and dashboard surfaces for using PostHog to capture *what moves Players actually make* — not just "12 kids played, 3 got stuck on round 3," but *why* they got stuck (tapped randomly, off-by-one, ignored the ten-frame, exploited a visual shortcut).
>
> **Out of scope:** the slow, durable, per-learner curriculum state that lives in Firestore (`progress/{uid}/standards/{standardId}`, `games/{gameId}`, `learning_data/{uid}`). PostHog is additive, not a replacement.

---

## 1. The problem we're solving

Two flaws in the current product that this spec closes:

**Flaw A — The feedback to Builders is shallow.** Today a Builder might see "12 kids played, 3 got stuck on round 3." That tells them the *where* but not the *why*. We do not know whether the 3 kids who got stuck:
- tapped randomly because they didn't understand the prompt
- over-counted by one (the canonical kindergarten error)
- visually pattern-matched on a ghost outline and skipped the math
- ignored the ten-frame structure and counted by ones

Without the *why*, the Builder cannot improve the game. They can only guess.

**Flaw B — The proprietary `learning_data` Firestore collection is named but not specified.** It is referenced as "captures per-round data, session tracking, misconception mapping — never open sourced" without much detail on what it actually captures. As of today it captures very little.

This spec replaces the vague "we'll capture rich data in Firestore" plan with a concrete instrumentation layer: PostHog for the fast, queryable event stream; Firestore for the durable curriculum state. Two stores, one source of truth each.

---

## 2. Why PostHog, and why also keep Firestore

| Concern | Firestore | PostHog |
|---|---|---|
| Curriculum state per learner (which moons mastered, which games approved) | **Yes — source of truth** | No |
| Per-game published artifact, ratings, plays count | **Yes — source of truth** | Mirror as event for funnels |
| Fast filtered event queries (e.g., "all moves in K.OA.A.1 games this week") | Painful and expensive | **Yes — purpose-built** |
| Funnels (start → win → re-play → master) | Custom code | **Yes — first-class** |
| Retention cohorts (Friday vs Monday recall) | Custom code | **Yes — first-class** |
| Heatmaps, replays, behavioral aggregates | None | **Yes** |
| COPPA-clean PII posture | Tightly controlled | Configurable (see §3) |
| Cost per event at our scale | Free (within Firestore quotas) | $0 up to 1M/month, then Scale plan |

Recommendation: **keep both, with clean separation.** Firestore is curriculum truth (what a learner has mastered, which games are published, which guides approved them). PostHog is the behavioral and pedagogical event stream (every tap, every round, every misconception signal). The two only share the personal-code identifier; they never write to each other directly.

PostHog is already installed in the project (`posthog-js` 1.367 + `posthog-node` 5.21 in `package.json`, initialized in `instrumentation-client.ts` and `src/lib/posthog-server.ts`). The current usage is auto-captured pageviews and exceptions only — none of the pedagogical events below are wired yet.

---

## 3. Privacy posture (COPPA + FERPA)

Players are 5–10 year-olds. School deployment means FERPA also applies. The rules:

1. **No PII to PostHog ever.** No real names. No email. No date of birth. No anonymous Firebase UID that maps back to a real name in Firestore.
2. **Identifier = the personal code** (the cosmos word like NOVA-42). PostHog's `distinct_id` is the personal code, nothing else. The cosmos words are random, not reversible to a real name.
3. **PostHog region = EU.** Cleaner posture for the school market and pre-empts any data-residency question from a district.
4. **Session replay = off by default.** Rich behavioral data (every tap, every position, every time delta) is recorded without ever recording the screen pixels. This avoids the worst COPPA traps (could replay reveal a name typed into a free-text field? — answer: there is no replay).
5. **Age = banded, not exact.** We capture `age_band: "5-7" | "8-10" | "11-13" | "14-16"` and `grade_band: "K-2" | "3-5" | "6-8" | "9-10"`. Never the exact age or birthday.
6. **A public PRIVACY.md** at the repo root documents the above so any guide, parent, or district can read it. The privacy stance is part of the product.

The Guide and Builder side are adults or older minors with school accounts and have looser-but-still-careful posture: still no real names to PostHog, still personal-code as identifier, but session replay *may* be enabled later for Guide-facing dashboards if it adds value, under explicit consent.

---

## 4. Event taxonomy

Three categories. All events are typed in `src/lib/telemetry/events.ts`. Every event has a `source: "builder" | "player" | "mastery_check" | "guide"` property to keep cross-category queries clean.

### 4.1 Category A — Builder events

Captured in Builder flow (`/build`, build screen, workshop, paste-HTML import).

| Event | Properties (in addition to baseline) |
|---|---|
| `builder.standard_picked` | standard_id, source ("beacon" \| "search" \| "idea") |
| `builder.brief_viewed` | standard_id, seconds_visible |
| `builder.brief_dismissed` | standard_id, seconds_visible |
| `builder.scenario_picked` | standard_id, scenario_id |
| `builder.madlib_filled` | standard_id, scenario_id, field_count |
| `builder.verb_parse_warning_shown` | standard_id, suggested_engine_id, builder_chose_engine_id |
| `builder.verb_parse_warning_overridden` | standard_id, suggested_engine_id, builder_chose_engine_id |
| `builder.engine_picked` | standard_id, engine_id |
| `builder.playtest_started` | game_id, standard_id, engine_id |
| `builder.playtest_won` | game_id, time_seconds |
| `builder.playtest_abandoned` | game_id, time_seconds, last_round |
| `builder.critique_started` | game_id |
| `builder.critique_stage_passed` | game_id, stage ("haiku_critic" \| "sonnet_critic" \| "haiku_adversary" \| "sonnet_adversary"), tokens_used |
| `builder.critique_stage_failed` | game_id, stage, reason_key, tokens_used |
| `builder.revision_submitted` | game_id, revision_count |
| `builder.guide_submitted` | game_id, revision_count, total_time_seconds |

Baseline properties on every Builder event: `builder_code`, `standard_id`, `engine_id` (when known), `time_in_step_seconds`, `revision_count`.

### 4.2 Category B — Player events

Captured in Player flow (`/play`, game player iframe, library).

| Event | Properties |
|---|---|
| `player.library_opened` | shelf_count, available_count, locked_count |
| `player.atlas_planet_tapped` | planet_id |
| `player.atlas_moon_tapped` | planet_id, moon_id |
| `player.card_tapped` | game_id, standard_id, builder_code, card_state ("locked" \| "available" \| "in_progress" \| "mastered") |
| `player.game_started` | game_id, standard_id, engine_id, builder_code, scenario_id |
| `player.round_started` | game_id, round_number, target_quantity (when applicable) |
| `player.move` | **see §4.4 — the key event** |
| `player.round_ended` | game_id, round_number, outcome ("won" \| "lost" \| "abandoned"), seconds, hint_count, move_count |
| `player.game_won` | game_id, total_seconds, total_moves, total_hints |
| `player.game_lost` | game_id, total_seconds, total_moves, last_round |
| `player.game_abandoned` | game_id, total_seconds, last_round |
| `player.rating_given` | game_id, stars (1–5), emoji_tag |
| `player.replay_started` | game_id |
| `player.fix_request_sent` | game_id, builder_code, message_length |

Baseline: `player_code`, `age_band`, `grade_band`.

### 4.3 Category C — Mastery Check events

Per the sibling Mastery Check spec.

| Event | Properties |
|---|---|
| `mastery_check.started` | standard_id, item_count |
| `mastery_check.item_shown` | standard_id, item_id, representational_mode ("concrete" \| "pictorial" \| "abstract"), problem_type |
| `mastery_check.item_answered` | standard_id, item_id, answer_given, correct (bool), time_to_first_response_ms, time_to_final_answer_ms |
| `mastery_check.passed` | standard_id, score, items_correct, items_total |
| `mastery_check.failed` | standard_id, score, items_correct, items_total, missed_modes (array) |

### 4.4 The `player.move` event — the key event

Every interaction inside the game canvas — every tap, drag, drop, long-press — is a `player.move` event.

```ts
interface PlayerMoveEvent {
  game_id: string;
  standard_id: string;
  engine_id: string;
  round_number: number;
  move_index: number;                // 0-based within the round
  move_type: "tap" | "drag" | "drop" | "long_press" | "release";
  target: string;                    // engine-specific: "dot_3", "cell_2_4", "ten_frame_position_7"
  correct: boolean | null;           // null when correctness is undefined for the move type
  time_since_round_start_ms: number;
  time_since_last_move_ms: number;
  // Optional engine-supplied fields:
  target_quantity?: number;
  current_committed_value?: number;
  hint_visible?: boolean;
}
```

This is the event misconception detection runs on (§6).

---

## 5. Engine integration

Each game in `src/lib/game-engines/` currently postMessages a coarse `game_win` event up to the host. The upgrade:

**Step 1 — define a shared postMessage contract.** Every engine emits the following messages over `window.parent.postMessage`:

```ts
type EngineMessage =
  | { type: "round_start"; round_number: number; target_quantity?: number }
  | { type: "move"; payload: Omit<PlayerMoveEvent, "game_id" | "standard_id" | "engine_id"> }
  | { type: "round_end"; round_number: number; outcome: "won" | "lost" | "abandoned"; seconds: number; hint_count: number; move_count: number }
  | { type: "game_end"; outcome: "won" | "lost" | "abandoned"; total_seconds: number; total_moves: number; total_hints: number; last_round: number };
```

**Step 2 — host wrapper forwards to PostHog.** A new `src/lib/telemetry/forward-engine-events.ts` mounts a `window.addEventListener("message", …)` in the game-player iframe host. It validates the message shape (Zod or a hand-rolled type guard), enriches with `game_id`, `standard_id`, `engine_id`, `builder_code`, `player_code`, `age_band`, `grade_band`, and forwards to `posthog.capture()`.

**Step 3 — per-engine checklist.** Every engine in `src/lib/game-engines/` must emit at least:
- one `round_start` per round
- one `move` per tap/drag/drop
- one `round_end` per round
- one `game_end` per session

The 4 PRIMARY K.OA engines (per Audit 11 — to be confirmed in the engine-library audit) ship instrumented first. The remaining engines are instrumented in the order they get a "VETTED" stamp.

A compile-time test in `src/lib/game-engines/__tests__/all-engines-instrumented.test.ts` walks every export in `index.ts` and asserts each emits the four message types at least once during a scripted run.

---

## 6. Misconception detection — the "what wrong move did they make"

This is the hardest part. Four detection patterns, run client-side at game end (default; see §9). Each pattern reads the round's `player.move` events and emits a derived `misconception.detected` event with `pattern`, `confidence`, `evidence` properties. The Builder dashboard then shows these aggregated per game.

### Pattern 1 — Random tapping

**Signal.** The Player is not thinking; they are tapping anything that responds.

**Detection rule.** Within a round, compute:
- `median_inter_move_ms` = median of `time_since_last_move_ms` across moves
- `inter_move_iqr_ms` = inter-quartile range (a robust spread measure)
- `correctness_rate` = correct moves / total moves where `correct !== null`

Flag `pattern: random_tapping` when **all three** hold:
- `median_inter_move_ms < 400`
- `inter_move_iqr_ms < 200`
- `correctness_rate` is within 10 percentage points of chance for the engine (e.g., a 4-option tap engine has chance ≈ 25%)

**Why these thresholds.** 400ms is faster than the youngest Player can read a prompt and decide. Tight IQR means uniform rapid tapping, not deliberate selection. Chance-level correctness rules out "fast but skilled."

**Action.** Report to Builder dashboard ("3 of 12 Players showed random tapping on round 4 — the prompt may be unclear, or the target may not be visually distinct"). Flag for guide on the Player's struggle map.

### Pattern 2 — Off-by-one (over- or under-count)

**Signal.** Player committed an answer one greater or one less than the target. This is the canonical kindergarten counting error: failing the cardinality principle (Gelman & Gallistel, *The Child's Understanding of Number*, 1978) or subitizing past the ~4-item limit and miscounting (Fischer 1990 on subitizing).

**Detection rule.** For counting / ten-frame / quantity-commit engines, when `round_ended.outcome === "lost"` AND the Player's `current_committed_value` differs from `target_quantity` by exactly ±1, flag `pattern: off_by_one`.

**Action.** Report to Builder dashboard ("4 of 12 Players over-counted by 1 on round 3 — Players may be losing track because the dots are visually separated by inconsistent gaps; consider a ten-frame structure"). Trigger Player-side re-practice suggestion on the same standard. Flag for guide on the Player's misconception map.

### Pattern 3 — Visual-matching shortcut

**Signal.** The engine offers a visual cue (e.g., dragging into a ghost outline of the correct shape) that lets the Player solve the round by pattern-matching, not by doing the math. This is precisely what Shortcut Adversary is supposed to catch at design time; this pattern catches the cases that slipped through.

**Detection rule.** For engines flagged as having a visual symmetry risk in their metadata (`engine.shortcut_risks: ["visual_match"]`), when **all** hold:
- `round_ended.outcome === "won"`
- `time_since_round_start_ms` at the winning move is below the human-counting threshold for the target quantity (e.g., < 800ms for target = 5)
- `move_count` is at the minimum possible for the round (e.g., 1 drag)

flag `pattern: visual_match`.

**Action.** Report to Builder dashboard ("Players are winning round 2 in under 800ms — the ghost outline may be giving away the answer; consider rotating the outline or hiding it until commit"). Flag the engine for re-review against Audit 8's Self-Revealing Truth rubric.

### Pattern 4 — Ignored the ten-frame structure

**Signal.** The engine offers a structured representation (a 5-and-5 ten-frame) that should let the Player subitize / chunk. The Player fills the ten-frame in a non-structural order (e.g., right-to-left zig-zag instead of left-to-right rows) AND takes longer than a structure-respecting fill would.

**Detection rule.** For ten-frame engines, examine the sequence of `target` positions in the round's moves. Compute:
- `fill_order_score` = correlation between fill order and the canonical left-to-right, top-row-first order
- `time_per_move_ms` = mean inter-move time

Flag `pattern: ignored_structure` when:
- `fill_order_score < 0.3` (low correlation with the structured order)
- `time_per_move_ms > 1500` (slower than a structure-using fill)
- the Player won the round eventually (i.e., they got the count right by counting-by-ones)

**Action.** Report to Builder dashboard ("Players are getting the right count but not using the ten-frame structure — the structure may not be visually salient; consider stronger 5-and-5 grouping"). Suggest to the Player's guide that a Mastery Check on K.OA.A.3 (decomposition with 5-and-5 structure) is warranted before claiming mastery.

### Detection plumbing

- Each pattern lives in `src/lib/telemetry/misconceptions/{pattern_name}.ts` as a pure function `(round: RoundEvents) => MisconceptionSignal | null`.
- On `game_end`, the host iterates each pattern against each round and emits one `misconception.detected` event per positive signal.
- Patterns are configurable per engine via metadata on the engine itself (`engine.applicable_misconception_patterns: string[]`).

---

## 7. Builder dashboard surface

What the Builder sees that they did not see before:

1. **Per-game replay heatmap.** For each round, a heatmap of where Players tapped, in what order. Rendered from `player.move` events; no session replay needed.
2. **Per-game stuck-pattern call-outs.** A small panel per game: "3 of 12 Players showed off-by-one on round 4. 4 of 12 ignored the ten-frame on round 2. 2 of 12 random-tapped throughout — they may be too young for this game."
3. **Cross-game retention.** "Players who played your game Monday — how many still got it right on Friday?" Computed from same-Player, same-standard `mastery_check.passed` events delayed by 3–5 days.
4. **Behavioral signal vs star rating, kept separate.** A high-rated game with poor learning signal is the most dangerous game we ship; flagging the divergence is the protection. Per audit 25 / flaw 15.

The Builder dashboard does *not* show individual Player names or codes. Always aggregate.

---

## 8. Guide dashboard surface

For a Guide reviewing a specific Player:

1. **Per-Player misconception map.** Across all games this Player played on this standard, which patterns showed up? (e.g., "Nova has shown off-by-one in 4 of 6 K.OA.A.1 sessions — likely needs targeted ten-frame practice.")
2. **Per-Player struggle map.** Time-to-win per game; which engines are hard for them; which are easy.
3. **Replay of last failed Mastery Check item.** The full event sequence for the item the Player most recently failed, so the Guide can see what the Player actually did.

The Guide dashboard *can* see individual Players, because the Guide is the legitimate human responsible for that Player at the school. Still no real names — Guide-side name lookup happens in Firestore via the personal-code mapping, never in PostHog.

---

## 9. Operational concerns

**Event volume.** Rough estimate: 5,000 plays per month × 30 moves per game × 5 rounds = 750,000 move events per 1,000 plays. The free tier is 1M events/month; we cross it at ~1,300 plays/month, which the pilot will reach within weeks.

**Mitigation.**
- Move to the PostHog **Scale plan** before the pilot starts (the per-event cost is small at our scale).
- **Event dedup** at the wrapper: drop duplicate moves emitted within 50ms of each other (engine bug guard).
- **Sampling at the move-level only** if volume forces it (see §10). Never sample round, game, or mastery events.

**Failure mode — PostHog down.** All events have a local IndexedDB queue (PostHog-js does this by default). A failed flush retries. No event is critical-path for gameplay — a Player can play, win, and master with PostHog entirely down. Curriculum state lives in Firestore.

**Schema versioning.** Every event has a `schema_version` property starting at `"1.0.0"`. Breaking changes bump the major; additions bump the minor. Old schemas remain queryable in PostHog without migration.

---

## 10. Open questions for Barbara

1. **Session replay.**
   - A) Off entirely *(my pick — cleanest COPPA posture, the behavioral stream gives us what we need without recording pixels)*
   - B) On but PII-stripped
   - C) On with explicit parent consent

2. **Move-level sampling.**
   - A) Never sample *(my pick — until volume forces it; misconception detection needs every move)*
   - B) Sample at 1-in-10 always
   - C) Sample only when the game is in `replay` mode

3. **PostHog region.**
   - A) Hosted EU *(my pick — best fit for the school market and pre-empts district data-residency questions)*
   - B) Hosted US
   - C) Self-hosted

4. **Where misconception detection runs.**
   - A) Client-side at game end *(my pick — cheap, runs once per game, no extra infra)*
   - B) Server-side batch nightly
   - C) Both (client for immediate feedback, server for cross-Player aggregates)

---

## 11. Phasing

**Phase 1 (week 1) — Coarse events.** Install the wrapper, capture Builder + Player coarse events: `standard_picked`, `brief_viewed`, `engine_picked`, `playtest_won`, `guide_submitted`, `library_opened`, `game_started`, `game_won`, `game_lost`, `rating_given`. No move-level events yet. Wire PRIVACY.md.

**Phase 2 (weeks 2–3) — Move-level instrumentation for the 4 PRIMARY K.OA engines.** Add `round_start`, `move`, `round_end`, `game_end` postMessage emissions in those 4 engines. Forward via the wrapper. Verify the test that asserts every engine emits the four message types.

**Phase 3 (weeks 3–4) — Detection patterns.** Wire the four misconception patterns (random tapping, off-by-one, visual match, ignored structure). Surface to the Builder dashboard (heatmap + call-outs). Surface to the Guide dashboard (per-Player misconception map).

**Phase 4 (week 5+) — Extend to all VETTED engines.** As each engine gets its VETTED stamp per the audit-11 engine library work, it ships with full instrumentation and applicable misconception patterns wired.

---

## 12. Success criteria

This work is done when:

- Every Builder, opening a game's analytics view, can answer the question "*why* did Players get stuck on round 3" without guessing.
- Every Guide, opening a Player's struggle map, can see which specific misconceptions that Player has shown across games — not just "they didn't master K.OA.A.1."
- The privacy posture is documented publicly (PRIVACY.md) and matches the implementation (verifiable by inspecting captured events in PostHog — no real names, no exact ages, no email).
- The 4 PRIMARY K.OA engines all emit the four required postMessage types and the test asserts it.
- Total event cost stays under $50/month at pilot scale (which it will, easily, on Scale plan).

---

## 13. Open follow-ups not in scope here

- A guide-facing weekly digest email summarizing misconception patterns across their class (post-pilot).
- A "Builder of the month" surface drawn from cross-age plays and post-play retention (cross-spec with the Library/Galaxy design).
- Public-research-data export: anonymized event stream donated to learning-science researchers under an MTA. Not the open-source path (the `learning_data` Firestore collection is the proprietary part); this is a separate downstream question Barbara has flagged for the fellowship pilot.
