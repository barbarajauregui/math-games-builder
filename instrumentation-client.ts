import posthog from "posthog-js"

/**
 * PostHog browser init.
 *
 * Source of truth: `docs/superpowers/specs/2026-05-10-posthog-telemetry.md` §3.
 *
 * COPPA-clean defaults:
 *  - `api_host: "/ingest"` proxies to the EU region (see `next.config.ts`
 *    rewrites).
 *  - `ui_host` points to the EU dashboard.
 *  - Session replay (`disable_session_recording: true`) is forced OFF —
 *    behavioral events only, no screen pixels. See spec §3 item 4.
 *  - `mask_all_text` / `mask_all_element_attributes` are belt-and-suspenders
 *    in case someone re-enables recording without reading the spec.
 *  - We do NOT call `posthog.identify` here. The typed wrapper in
 *    `@/lib/telemetry/posthog-client` (`setUserContext`) is the only path
 *    that may identify a user, and it requires a personal code — never a
 *    Firebase UID, never a real name.
 *  - Autocapture is disabled. Every event must go through the typed
 *    `track()` wrapper so the event taxonomy stays auditable.
 */
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/ingest",
  ui_host: "https://eu.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  autocapture: false,
  disable_session_recording: true,
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: "*",
  },
  debug: process.env.NODE_ENV === "development",
})
