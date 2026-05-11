/**
 * @deprecated — use `@/lib/telemetry/posthog-server` instead.
 *
 * Kept as a thin re-export so existing call sites in
 * `src/app/api/game/[id]/approve/route.ts` and
 * `src/app/api/game/generate/route.ts` continue to compile during the
 * Phase 1 telemetry migration. New code should import `trackServer` from
 * `@/lib/telemetry/posthog-server`.
 */

export { getPostHogClient, trackServer } from "@/lib/telemetry/posthog-server"
