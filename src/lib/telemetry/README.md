# Telemetry — engineering guide

Internal reference for adding and using PostHog telemetry. Read alongside `docs/superpowers/specs/2026-05-10-posthog-telemetry.md` (the product spec) and `/PRIVACY.md` (the public posture).

## The one rule

**Never call `posthog.capture()` or `posthog.identify()` directly.** Use the typed wrappers in this directory. The wrappers exist to enforce:

1. **Typed event contracts** — `track()` accepts only events declared in `events.ts`. Misspelled event names or wrong property shapes are TypeScript errors.
2. **COPPA-clean identifiers** — `setUserContext()` refuses Firebase UIDs and real names. Throws in dev/test if you try; warns-and-strips in production.
3. **Banded age + grade** — every event is auto-tagged with the learner's `age_band` and `grade_band`, never an exact value.
4. **EU region + no session replay** — enforced in `instrumentation-client.ts` (init) and the server wrapper's `host` default.

## Files

| File | Purpose |
|---|---|
| `events.ts` | Discriminated-union event contracts. Add new events here first. |
| `coppa.ts` | Banding helpers (`getBands`, `bandAge`, `bandGrade`) + runtime PII guards. |
| `posthog-client.ts` | Browser-side `track()`, `setUserContext()`, `resetUserContext()`. |
| `posthog-server.ts` | Server-side `trackServer(distinctId, event)`. |

## Quick recipes

### Capture an event from a React component

```ts
import { track } from "@/lib/telemetry/posthog-client"

track({
  event: "builder.scenario_picked",
  properties: {
    builder_code: profile.personalCode!,
    standard_id: "K.OA.A.1",
    scenario_id: "marbles_in_jar",
  },
})
```

The compiler will error if `event` is not a known event name, or if `properties` is missing a required field for that event.

### Identify the current user

Already wired in `src/lib/auth.tsx`. If you need to call it elsewhere:

```ts
import { setUserContext } from "@/lib/telemetry/posthog-client"
setUserContext(profile)  // profile must have a personalCode
```

If `profile.personalCode` is missing, we refuse to identify (rather than fall back to a Firebase UID). The user will still get banded context on auto-attributed properties.

### Capture from a server route

```ts
import { trackServer } from "@/lib/telemetry/posthog-server"

trackServer(personalCode, {
  event: "game_approved",
  properties: { game_id, author_uid, standard_id, has_comment: !!comment },
})
```

If you don't have the personal code on a server route (most current API routes only have Firebase UIDs), pass a synthetic id keyed by the entity you're acting on (e.g. `game_${gameId}`). **Never pass a raw Firebase UID** — `trackServer` will throw in dev and drop the event in production.

## Adding a new event

1. Decide the category (Builder / Player / Mastery Check / Legacy).
2. Open `events.ts` and add a new variant to the corresponding union, e.g.:
   ```ts
   | { event: "builder.theme_chosen"; properties: BuilderBaseProps & { theme_id: string } }
   ```
3. Add the call site:
   ```ts
   track({ event: "builder.theme_chosen", properties: { builder_code, standard_id, theme_id: "space" } })
   ```
4. If the property requires a new shared type (e.g. a new banded enum), add it to `events.ts` first.

## What's forbidden

The PII guard in `coppa.ts` refuses these property keys outright:

`name`, `displayName`, `first_name`, `last_name`, `fullName`, `email`, `phone`, `dob`, `birthday`, `birth_date`, `exact_age`, `uid`, `firebase_uid`

It also pattern-matches anything that looks like an email address (`x@y.z`) anywhere in a property value, and anything that looks like a Firebase UID (`/^[A-Za-z0-9]{20,}$/`) on the `distinct_id`.

If you have a legitimate reason to send a Firebase UID-shaped string as a property (e.g. `author_uid` so a Builder dashboard can join back to a game), use a clear field name that doesn't match the forbidden list and isn't `uid` or `firebase_uid`. We accept `author_uid` and `learner_uid` today for legacy backwards-compat — but the long-term direction is to look up the personal code server-side and send that instead.

## Phasing — what is and isn't in Phase 1

**In Phase 1 (this layer):**
- Builder event contracts (full set from spec §4.1) — but no call sites exist yet because the K.OA.A.1 build-flow components don't exist yet. The K.OA.A.1 plan's implementation tasks will import `track()` and emit them.
- Minimum Player events to detect a play (`player.library_opened`, `player.game_started`, `player.round_won`, `player.round_lost`, `player.game_won`, `player.game_lost`, `player.rating_given`).
- All legacy events typed verbatim so existing call sites compile.
- PostHog EU region, session replay off, autocapture off, COPPA guards in dev.

**Deferred to Phase 2:**
- The full move-level instrumentation contract (`PlayerMoveEventPayload`) and the engine `postMessage` forwarding wrapper (`forward-engine-events.ts`).
- Misconception-detection patterns (random tapping, off-by-one, visual match, ignored structure) and the `misconception.detected` event.
- Builder dashboard, Guide dashboard, funnels, retention queries.
