/**
 * Server-side telemetry wrapper. Same typed surface as the client wrapper.
 *
 * Source of truth: `docs/superpowers/specs/2026-05-10-posthog-telemetry.md`.
 *
 * The previous `src/lib/posthog-server.ts` exported `getPostHogClient()`
 * and callers used the raw posthog-node `capture({ distinctId, event,
 * properties })` shape. That helper is re-exported here for back-compat
 * during the migration, but new code should use `trackServer(distinctId,
 * event)` to get the typed contract + COPPA-clean property scrubbing.
 */

import "server-only"

import { PostHog } from "posthog-node"

import {
  TELEMETRY_SCHEMA_VERSION,
  type TelemetryEvent,
  type TelemetryEventName,
} from "./events"
import { assertCoppaCleanProperties, looksLikeFirebaseUid } from "./coppa"

let posthogClient: PostHog | null = null

/**
 * Lazy singleton. EU region is enforced via `host`; the env var must point
 * to https://eu.i.posthog.com (set in Vercel for prod; the .env.local for
 * dev). If the env var is missing we fall back to EU to be safe (US would
 * be a privacy regression — see spec §3).
 */
export function getPostHogClient(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return posthogClient
}

function deriveSource(eventName: TelemetryEventName): "builder" | "player" | "mastery_check" | "guide" | "system" {
  if (eventName.startsWith("builder.")) return "builder"
  if (eventName.startsWith("player.")) return "player"
  if (eventName.startsWith("mastery_check.")) return "mastery_check"
  if (eventName.startsWith("guide_") || eventName.startsWith("admin_")) return "guide"
  return "system"
}

/**
 * Type-safe server-side capture.
 *
 * `distinctId` MUST be a personal code (e.g. "NOVA-42"). If a Firebase UID
 * sneaks through we throw in dev/test and warn-and-skip in production —
 * the event is silently dropped rather than tagged against a PII identifier.
 *
 * Server-side legacy call sites that only have a Firebase UID (e.g. game
 * approval, server-side log routes) should look up the personal code from
 * Firestore first; until they do they can pass `"server"` or a synthetic
 * distinct id like `game_${gameId}`.
 */
export function trackServer(distinctId: string, evt: TelemetryEvent): void {
  if (looksLikeFirebaseUid(distinctId)) {
    const msg = `[telemetry/server] refusing to capture "${evt.event}" — distinctId "${distinctId}" looks like a Firebase UID`
    if (process.env.NODE_ENV !== "production") throw new Error(msg)
    console.warn(msg)
    return
  }
  const props = assertCoppaCleanProperties(evt.event, evt.properties as Record<string, unknown>)
  const client = getPostHogClient()
  client.capture({
    distinctId,
    event: evt.event,
    properties: {
      ...props,
      source: deriveSource(evt.event),
      schema_version: TELEMETRY_SCHEMA_VERSION,
    },
  })
}
