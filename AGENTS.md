<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# External Reviewer fires at every major design milestone

Math Games Builder makes pedagogical claims. Our internal agent stack
(Mr. Chesure, the Critic, Mechanic Inventor, Shortcut Adversary, etc.) is
designed against the frame we built — meaning it can miss what the broader
peer-reviewed literature considers load-bearing but that we hadn't thought
to check.

To prevent this, **dispatch `the-external-reviewer` agent at every major
design milestone**, including:

- Before any new spec ships to engineering
- Before a new agent definition lands
- Before a new pilot starts (school deployment, cross-age experiment,
  fellowship demo)
- Before the cluster of game mechanics for a new math domain (1.OA, 2.OA, 3.OA,
  etc.) gets exposed to Builders
- At a minimum: quarterly, even with no other trigger

The External Reviewer's job is explicitly to find what our existing
agents and audits do NOT cover. Its output lives in `docs/audit/` as
`NN-external-review-YYYY-MM-DD.md`. The team then triages: which findings
must be addressed before the milestone ships, which are follow-up.

The first informal pass (2026-05-11, via a fresh Claude Code window)
produced 10 findings including the equal-sign-as-relation misconception,
counting principles, MP1-MP8 absence, equity / EL gap, math anxiety
transmission, and human-expert calibration. The agent definition at
`docs/agents/the-external-reviewer.md` lists these as the calibration
baseline.

Cross-cutting topics that come out of external reviews land in
`docs/agents/shared-knowledge/` — every agent consults this directory.

# IMPORTANT: Keep the in-app Rules content in sync

The app has an in-app **Rules** popover (top-right "?" button on the galaxy)
that summarises how the app works for learners, guides, and admins. The
content lives in `src/lib/app-rules.ts`.

**Whenever you change app behavior** that touches any of:
- The state machine (statuses like `available`, `in_progress`, `in_review`,
  `approved_unplayed`, `unlocked`, `mastered`)
- The token economy (how many tokens, when they're awarded)
- The mastery flow (demonstrate / play-to-master)
- Color meanings on the galaxy
- The build flow / submit-for-review flow
- Guide approval/rejection flow
- Anything visible to learners

…you MUST update the relevant section in `src/lib/app-rules.ts` so the
in-app Rules popover stays accurate. If you forget, learners and guides
will read stale rules.

**⚠️ Pivot in progress (April 18, 2026):** The in-app Rules content in
`src/lib/app-rules.ts` currently describes the pre-pivot product (galaxy as
home, single-user self-learning flow, Circuit Board Builder). Per
`docs/product-positioning.md`, the app is pivoting to a two-mode
Builder/Player model with the Library as home and the galaxy demoted to
optional "Explore." The Rules content will need a significant rewrite as
part of that pivot — expect to rewrite it whole, not patch it incrementally.
Do NOT spend effort keeping the current Rules text in sync with small
behavior changes during the pivot period; flag conflicts instead and batch
the rewrite.
