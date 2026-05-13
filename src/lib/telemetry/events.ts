/**
 * Strict-typed event contracts for PostHog telemetry.
 *
 * Source of truth: `docs/superpowers/specs/2026-05-10-posthog-telemetry.md`.
 *
 * Phase 1 scope:
 *  - All Builder events from spec §4.1 (so the K.OA.A.1 build flow can emit
 *    them as it is implemented).
 *  - Minimum Player events from spec §4.2 needed to detect a play
 *    (library_opened, game_started, round_won, round_lost, game_won,
 *    game_lost, rating_given).
 *  - Mastery Check events (spec §4.3) — typed for the sibling spec, no
 *    call sites required in Phase 1.
 *  - Legacy events still fired by the existing codebase, typed here so the
 *    migration to `track()` is type-safe without changing event names or
 *    properties on the wire (backwards-compat per task brief).
 *
 * Out of scope for Phase 1 (deferred to Phase 2):
 *  - The full `player.move` event and the move-level instrumentation contract
 *    in spec §4.4 / §5 — typed here as `PlayerMoveEventPayload` for the
 *    misconception-detection layer but no callers yet.
 *  - Misconception-detected events (spec §6).
 *  - Dashboards, funnels, retention queries.
 */

// -----------------------------------------------------------------------------
// Common base / shared property shapes
// -----------------------------------------------------------------------------

export const TELEMETRY_SCHEMA_VERSION = "1.0.0"

export type EventSource = "builder" | "player" | "mastery_check" | "guide" | "system"

/** Properties added automatically by the wrapper to every event. */
export interface BaseProperties {
  source: EventSource
  schema_version: string
}

export type AgeBand = "5-7" | "8-10" | "11-13" | "14-16" | "unknown"
export type GradeBand = "K-2" | "3-5" | "6-8" | "9-10" | "unknown"
export type UserRole = "student" | "guide" | "admin"

/**
 * COPPA-clean user context, set via `setUserContext`. Only fields here are
 * ever attached to a PostHog person — no real name, no email, no exact age,
 * no Firebase UID.
 */
export interface CoppaCleanUserContext {
  distinct_id: string         // the personal code (e.g. "NOVA-42")
  role: UserRole
  age_band: AgeBand
  grade_band: GradeBand
}

// -----------------------------------------------------------------------------
// Category A — Builder events (spec §4.1)
// -----------------------------------------------------------------------------

export type CritiqueStage =
  | "haiku_critic"
  | "sonnet_critic"
  | "haiku_adversary"
  | "sonnet_adversary"

export interface BuilderBaseProps {
  builder_code: string
  standard_id: string
  engine_id?: string
  time_in_step_seconds?: number
  revision_count?: number
}

export type BuilderEvent =
  | { event: "builder.standard_picked"; properties: BuilderBaseProps & { source_picker: "beacon" | "search" | "idea" } }
  | { event: "builder.brief_viewed"; properties: BuilderBaseProps & { seconds_visible: number } }
  | { event: "builder.brief_dismissed"; properties: BuilderBaseProps & { seconds_visible: number } }
  | { event: "builder.scenario_picked"; properties: BuilderBaseProps & { scenario_id: string } }
  | { event: "builder.madlib_filled"; properties: BuilderBaseProps & { scenario_id: string; field_count: number } }
  | { event: "builder.verb_parse_warning_shown"; properties: BuilderBaseProps & { suggested_engine_id: string; builder_chose_engine_id: string } }
  | { event: "builder.verb_parse_warning_overridden"; properties: BuilderBaseProps & { suggested_engine_id: string; builder_chose_engine_id: string } }
  | { event: "builder.engine_picked"; properties: BuilderBaseProps & { engine_id: string } }
  | { event: "builder.playtest_started"; properties: BuilderBaseProps & { game_id: string; engine_id: string } }
  | { event: "builder.playtest_won"; properties: BuilderBaseProps & { game_id: string; time_seconds: number } }
  | { event: "builder.playtest_abandoned"; properties: BuilderBaseProps & { game_id: string; time_seconds: number; last_round: number } }
  | { event: "builder.critique_started"; properties: BuilderBaseProps & { game_id: string } }
  | { event: "builder.critique_stage_passed"; properties: BuilderBaseProps & { game_id: string; stage: CritiqueStage; tokens_used: number } }
  | { event: "builder.critique_stage_failed"; properties: BuilderBaseProps & { game_id: string; stage: CritiqueStage; reason_key: string; tokens_used: number } }
  | { event: "builder.revision_submitted"; properties: BuilderBaseProps & { game_id: string; revision_count: number } }
  | { event: "builder.guide_submitted"; properties: BuilderBaseProps & { game_id: string; revision_count: number; total_time_seconds: number } }
  // Build flow — Level 1 + Level 2 (spec 2026-05-12-koa-a-1-build-flow §13)
  | { event: "level_1.scenario_started"; properties: { standardId: string; mechanicId: string; scenarioId: string } }
  | { event: "level_1.scenario_won"; properties: { standardId: string; mechanicId: string; scenarioId: string; durationMs: number } }
  | { event: "level_1.mechanic_complete"; properties: { standardId: string; mechanicId: string; scenariosPlayed: number } }
  | { event: "builder.level_2_unlocked"; properties: { standardId: string } }
  | { event: "level_2.prompt_scaffold_copied"; properties: { standardId: string; mechanicId: string; descriptionLength: number } }
  | { event: "level_2.prompt_review_run"; properties: { standardId: string; mechanicId: string; decision: "pass" | "block"; latencyMs: number; descriptionLength: number } }
  | { event: "level_2.playtest_started"; properties: { standardId: string } }
  | { event: "level_2.playtest_win"; properties: { standardId: string; durationMs: number; tries: number } }
  | { event: "level_2.local_validation_failed"; properties: { standardId: string; reason: string } }
  | { event: "level_2.html_review_run"; properties: { standardId: string; mechanicId: string; decision: "pass" | "soft_warn" | "block"; latencyMs: number; bulletsCount: number; stage1: "pass" | "fail" | "not_run"; stage2: "pass" | "fail" | "not_run"; stage3: "pass" | "fail" | "not_run"; stage4: "pass" | "fail" | "not_run" } }
  | { event: "level_2.save_clicked"; properties: { standardId: string; mechanicId: string; decision: "pass" | "soft_warn" } }
  | { event: "level_2.saved_pending_review"; properties: { standardId: string; mechanicId: string; gameId: string } }

// -----------------------------------------------------------------------------
// Category B — Player events (Phase 1 subset of spec §4.2)
// -----------------------------------------------------------------------------

export interface PlayerBaseProps {
  player_code: string
  age_band: AgeBand
  grade_band: GradeBand
}

export type CardState = "locked" | "available" | "in_progress" | "mastered"

/**
 * The full `player.move` payload (spec §4.4). Typed for Phase 2 use.
 * No `track()` call-site is required for Phase 1 — included here so the
 * misconception-detection layer compiles against a stable type.
 */
export interface PlayerMoveEventPayload {
  game_id: string
  standard_id: string
  engine_id: string
  round_number: number
  move_index: number
  move_type: "tap" | "drag" | "drop" | "long_press" | "release"
  target: string
  correct: boolean | null
  time_since_round_start_ms: number
  time_since_last_move_ms: number
  target_quantity?: number
  current_committed_value?: number
  hint_visible?: boolean
}

export type PlayerEvent =
  | { event: "player.library_opened"; properties: PlayerBaseProps & { shelf_count: number; available_count: number; locked_count: number } }
  | { event: "player.card_tapped"; properties: PlayerBaseProps & { game_id: string; standard_id: string; builder_code: string; card_state: CardState } }
  | { event: "player.game_started"; properties: PlayerBaseProps & { game_id: string; standard_id: string; engine_id: string; builder_code: string; scenario_id?: string } }
  | { event: "player.round_won"; properties: PlayerBaseProps & { game_id: string; round_number: number; seconds: number; move_count: number; hint_count: number } }
  | { event: "player.round_lost"; properties: PlayerBaseProps & { game_id: string; round_number: number; seconds: number; move_count: number; hint_count: number } }
  | { event: "player.game_won"; properties: PlayerBaseProps & { game_id: string; total_seconds: number; total_moves: number; total_hints: number } }
  | { event: "player.game_lost"; properties: PlayerBaseProps & { game_id: string; total_seconds: number; total_moves: number; last_round: number } }
  | { event: "player.game_abandoned"; properties: PlayerBaseProps & { game_id: string; total_seconds: number; last_round: number } }
  | { event: "player.rating_given"; properties: PlayerBaseProps & { game_id: string; stars: 1 | 2 | 3 | 4 | 5; emoji_tag?: string } }

// -----------------------------------------------------------------------------
// Category C — Mastery Check events (spec §4.3) — typed for Phase 1
// -----------------------------------------------------------------------------

export type RepresentationalMode = "concrete" | "pictorial" | "abstract"

export type MasteryCheckEvent =
  | { event: "mastery_check.started"; properties: { standard_id: string; item_count: number } }
  | { event: "mastery_check.item_shown"; properties: { standard_id: string; item_id: string; representational_mode: RepresentationalMode; problem_type: string } }
  | { event: "mastery_check.item_answered"; properties: { standard_id: string; item_id: string; answer_given: string | number; correct: boolean; time_to_first_response_ms: number; time_to_final_answer_ms: number } }
  | { event: "mastery_check.passed"; properties: { standard_id: string; score: number; items_correct: number; items_total: number } }
  | { event: "mastery_check.failed"; properties: { standard_id: string; score: number; items_correct: number; items_total: number; missed_modes: RepresentationalMode[] } }

// -----------------------------------------------------------------------------
// Legacy events — already fired in the codebase. Typed here so the migration
// to track() is type-safe. Names + property shapes preserved verbatim for
// backwards-compatibility per the task brief.
// -----------------------------------------------------------------------------

export type LegacyEvent =
  // Auth + onboarding (src/lib/auth.tsx, src/components/onboarding/*)
  | { event: "learner_signed_in"; properties: { is_new_learner: boolean; via?: "personal_code" } }
  | { event: "guide_signed_in"; properties: { method: "email" | "google" } }
  | { event: "onboarding_started"; properties: Record<string, never> }
  | { event: "onboarding_step_reached"; properties: { step: string } }
  | { event: "onboarding_completed"; properties: { grade: string } }
  | { event: "personal_code_viewed"; properties: Record<string, never> }
  // Workshop / build screen / build legacy
  | { event: "builder_started"; properties: { learner_uid?: string; standard_id?: string; builder_type?: string } }
  | { event: "builder_scenario_written"; properties: { learner_uid?: string; standard_id?: string; scenario_length?: number } }
  | { event: "game_tested_in_workshop"; properties: { game_id?: string; standard_id?: string; outcome: "win" | "lose"; hint_mode?: string; hint_used?: boolean } }
  | { event: "game_submitted_for_review"; properties: { game_id?: string; standard_id?: string } }
  | { event: "fix_this_clicked"; properties: { game_id?: string; issue: string } }
  | { event: "fix_this_submitted"; properties: { game_id?: string; issue: string; details?: string } }
  | { event: "change_request"; properties: { game_id?: string; request: string } }
  | { event: "game_built"; properties: { mechanic_id?: string; standard_id?: string; vibe?: string; source: "ai" | "engine" } }
  // Library / game-player
  | { event: "library_game_played"; properties: { game_id?: string; play_mode?: string; standard_id?: string } }
  | { event: "library_game_won"; properties: { game_id?: string; standard_id?: string; hint_used?: boolean } }
  | { event: "game_lost"; properties: { game_id?: string; standard_id?: string; play_mode?: string } }
  | { event: "hint_card_opened"; properties: { game_id?: string; standard_id?: string } }
  | { event: "hint_card_to_real_play"; properties: { game_id?: string; standard_id?: string } }
  | { event: "game_library_game_selected"; properties: { game_id?: string; standard_id?: string } }
  | { event: "game_library_tab_switched"; properties: { tab_name: string } }
  | { event: "my_stuff_viewed"; properties: Record<string, never> }
  // Guide
  | { event: "guide_learner_selected"; properties: { learner_uid: string } }
  | { event: "guide_tab_viewed"; properties: { tab_name: string } }
  | { event: "guide_game_review_started"; properties: { game_id: string } }
  | { event: "game_approved"; properties: { game_id: string; author_uid?: string; standard_id?: string; has_comment: boolean } }
  | { event: "game_rejected"; properties: { game_id: string; author_uid?: string; standard_id?: string; has_comment: boolean } }
  | { event: "token_earned"; properties: { amount: number; reason: string; learner_uid?: string } }
  // Galaxy / standards
  | { event: "moon_opened"; properties: { standard_id: string; domain?: string; grade?: string } }
  | { event: "galaxy_minimap_used"; properties: { planet_id: string } }
  | { event: "supernova_triggered"; properties: { planet_id: string } }
  | { event: "grade_completed"; properties: { grade: string } }
  | { event: "standard_unlocked"; properties: { standard_id: string } }
  | { event: "standard_mastered"; properties: { standard_id: string } }
  | { event: "own_game_win"; properties: { standard_id: string; streak: number; hint_used?: boolean } }
  | { event: "mechanic_selected"; properties: { mechanic_id: string; mechanic_title?: string; standard_id?: string } }
  | { event: "explore_card_viewed"; properties: { standard_id: string } }
  | { event: "learn_more_expanded"; properties: { standard_id: string } }
  // Misc UI
  | { event: "info_button_clicked"; properties: { title: string } }
  | { event: "feedback_submitted"; properties: { type: string; page_url?: string } }
  // Admin
  | { event: "admin_tab_viewed"; properties: { tab_name: string } }
  | { event: "admin_token_config_changed"; properties: { token_type: string; new_value: number } }
  | { event: "admin_broadcast_sent"; properties: { recipient_count: number } }
  // Server-side (game generation)
  | { event: "game_generated"; properties: { standard_id?: string; core_verb: string; generation_seconds: number } }

// -----------------------------------------------------------------------------
// The union of every event that can be passed to `track()`.
// -----------------------------------------------------------------------------

export type TelemetryEvent =
  | BuilderEvent
  | PlayerEvent
  | MasteryCheckEvent
  | LegacyEvent

export type TelemetryEventName = TelemetryEvent["event"]
