/**
 * Browser-side telemetry wrapper.
 *
 * Source of truth: `docs/superpowers/specs/2026-05-10-posthog-telemetry.md`.
 *
 * Responsibilities:
 *  - Enforce typed event contracts (only `TelemetryEvent` variants accepted)
 *  - Tag every event with `source`, `schema_version`, and (when known)
 *    `age_band` + `grade_band`
 *  - Enforce COPPA-clean identifier via `setUserContext`
 *  - Throw on PII leaks in dev/test (warn-and-strip in production)
 *
 * Init itself happens in `instrumentation-client.ts` — region (EU),
 * session_recording = off, etc. live there. This file is the typed access
 * surface for application code.
 */

"use client"

import posthog from "posthog-js"

import {
  TELEMETRY_SCHEMA_VERSION,
  type AgeBand,
  type CoppaCleanUserContext,
  type GradeBand,
  type TelemetryEvent,
  type TelemetryEventName,
} from "./events"
import {
  assertCoppaCleanProperties,
  assertCoppaCleanUserContext,
  getBands,
  type ProfileLike,
} from "./coppa"

// In-memory bands cache so every track() call gets them without re-deriving.
let currentBands: { age_band: AgeBand; grade_band: GradeBand } = {
  age_band: "unknown",
  grade_band: "unknown",
}

function deriveSource(eventName: TelemetryEventName): "builder" | "player" | "mastery_check" | "guide" | "system" {
  if (eventName.startsWith("builder.")) return "builder"
  if (eventName.startsWith("player.")) return "player"
  if (eventName.startsWith("mastery_check.")) return "mastery_check"
  if (eventName.startsWith("guide_") || eventName.startsWith("admin_")) return "guide"
  return "system"
}

/**
 * Type-safe event capture. The compiler enforces that the properties match
 * the named event's payload shape.
 */
export function track(evt: TelemetryEvent): void {
  if (typeof window === "undefined") return
  const props = assertCoppaCleanProperties(evt.event, evt.properties as Record<string, unknown>)
  posthog.capture(evt.event, {
    ...props,
    source: deriveSource(evt.event),
    schema_version: TELEMETRY_SCHEMA_VERSION,
    age_band: currentBands.age_band,
    grade_band: currentBands.grade_band,
  })
}

/**
 * Identify the current user to PostHog using ONLY COPPA-clean fields.
 *
 * Pass the user's profile; we derive the personal-code identifier and the
 * banded age/grade ourselves. If the profile is missing a personal code we
 * refuse to identify rather than fall back to the Firebase UID.
 */
export function setUserContext(profile: ProfileLike | null | undefined): void {
  if (typeof window === "undefined") return
  if (!profile) {
    currentBands = { age_band: "unknown", grade_band: "unknown" }
    return
  }
  if (!profile.personalCode) {
    // Don't identify with a Firebase UID — wait until the personal code is
    // available. We still set band context for any auto-captured events.
    currentBands = getBands(profile)
    return
  }
  const ctx: CoppaCleanUserContext = assertCoppaCleanUserContext({
    distinct_id: profile.personalCode,
    role: profile.role ?? "student",
    ...getBands(profile),
  })
  currentBands = { age_band: ctx.age_band, grade_band: ctx.grade_band }
  posthog.identify(ctx.distinct_id, {
    role: ctx.role,
    age_band: ctx.age_band,
    grade_band: ctx.grade_band,
  })
}

/** Clear identity on sign-out. */
export function resetUserContext(): void {
  if (typeof window === "undefined") return
  currentBands = { age_band: "unknown", grade_band: "unknown" }
  posthog.reset()
}
