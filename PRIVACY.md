# Math Games Builder — Privacy

*Last updated: 2026-05-10*

Math Games Builder is built for kids. Players are typically 5–10 years old; Builders are typically 10–16. Schools, parents, and districts all need to be able to read this page and know exactly what we collect and what we don't.

## Posture, in one paragraph

We capture **what the learner does in the product** (which moon they opened, which scenario they picked, whether they won round 3) so a Builder can improve their game and a Guide can support their Player. We do **not** capture **who the learner is** in any externally identifiable way. Real names, emails, dates of birth, and exact ages stay inside our authenticated database and are never sent to any analytics provider.

## What we collect

| Category | Examples | Where it lives |
|---|---|---|
| **Curriculum state** (per-learner mastery, published games, ratings) | Which standards a learner has mastered; which games they authored; their token wallet | Firestore (authenticated; access-controlled per user) |
| **Behavioral telemetry** (what moves a Player makes, what choices a Builder makes) | Game started, round won, mechanic picked, brief viewed, rating given | PostHog (EU region) |
| **Account info** (real name, school email for guides, class membership) | Display name shown to other classmates and the Guide; email used only for guide sign-in | Firestore (never sent to analytics) |

## What we do **NOT** collect (or transmit to analytics)

- **No real names** are sent to PostHog. The behavioral telemetry identifier is a randomly generated **personal code** like `NOVA-42` — not reversible to a name without authenticated database access.
- **No email addresses** are sent to PostHog.
- **No dates of birth** or **exact ages** are sent to PostHog. We use banded buckets only (`5-7`, `8-10`, `11-13`, `14-16`).
- **No grade level beyond a coarse band** (`K-2`, `3-5`, `6-8`, `9-10`) is sent to PostHog.
- **No session screen recordings.** Session replay is disabled at the SDK level — the analytics system has no way to see what is on a learner's screen.
- **No third-party advertising trackers**, ever.
- **No Firebase user IDs** are sent to PostHog as identifiers. (The system actively throws an error in development if a Firebase UID is ever passed as the analytics identifier.)

## Where data lives

- **Firestore** (curriculum state, account info, games, ratings) — hosted in Google Cloud, project `option-c-14d3b`. Access is restricted by Firestore security rules to the authenticated user, their Guide, or an Admin.
- **PostHog** — hosted in the **European Union** region (`eu.i.posthog.com`). Data residency is EU regardless of where the learner is located, chosen as a conservative posture for schools, districts, and any future jurisdiction with stricter rules.

## Compliance

- **COPPA** (United States, under-13): we collect only what is necessary to provide the educational service, and we do not share personal information with third parties for advertising or non-educational purposes. The personal-code identifier model is designed so analytics data cannot be combined with personally identifying information without authenticated database access.
- **FERPA** (United States, school records): the learner's curriculum state is treated as a school record. Guides can access their own class; admins can access their own school; no one else.
- **GDPR / UK-GDPR** (Europe): EU data residency for analytics, banded ages, no real names in analytics, no session replay.

## Questions

Email Barbara at `barbarajauregui@gmail.com` or open an issue on the public repo. We will publish any future change to this posture in this file with a dated revision.
