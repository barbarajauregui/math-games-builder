<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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
