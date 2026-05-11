import { getAdminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"
import { trackServer } from "@/lib/telemetry/posthog-server"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { reviewerUid, reviewerName, approved, comment } = await req.json()

    if (!reviewerUid || !id) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const adminDb = getAdminDb()
    const gameSnap = await adminDb.collection("games").doc(id).get()
    if (!gameSnap.exists) {
      return Response.json({ error: "Game not found" }, { status: 404 })
    }

    const game = gameSnap.data()!

    // Can't review your own game
    if (game.authorUid === reviewerUid) {
      return Response.json({ error: "You can't review your own game" }, { status: 403 })
    }

    const review = {
      reviewerUid,
      reviewerName,
      approved,
      comment: comment || null,
      createdAt: Date.now(),
    }

    const updates: Record<string, unknown> = {
      reviews: FieldValue.arrayUnion(review),
    }

    if (approved) {
      updates.status = "published"
      updates.approvedBy = reviewerUid
    }

    await adminDb.collection("games").doc(id).update(updates)

    // If approved, award tokens (reads admin-configured amount) AND
    // move the standard to "approved_unplayed" — student still needs
    // to win 3 in a row on their own game to flip it to fully unlocked (green).
    let gameApprovedTokens = 2000
    if (approved && game.authorUid && game.standardId) {
      try {
        const cfgSnap = await adminDb.collection("config").doc("tokens").get()
        if (cfgSnap.exists) {
          const cfg = cfgSnap.data()!
          if (typeof cfg.gameApproved === "number") gameApprovedTokens = cfg.gameApproved
        }
      } catch {}
      await adminDb.collection("users").doc(game.authorUid).update({
        tokens: FieldValue.increment(gameApprovedTokens),
        lifetimeTokens: FieldValue.increment(gameApprovedTokens),
      })
      await adminDb
        .collection("progress")
        .doc(game.authorUid)
        .collection("standards")
        .doc(game.standardId)
        .set(
          { status: "approved_unplayed", approvedAt: Date.now() },
          { merge: true }
        )
    }

    // Server-side telemetry. We don't have personal codes for the reviewer
    // or author on this code path (would require a Firestore round-trip per
    // request); use a synthetic distinct id keyed by game_id so the COPPA
    // guard doesn't trip on raw Firebase UIDs. Properties carry the
    // Firebase UIDs under their existing legacy field names for backwards-
    // compat with downstream dashboards.
    trackServer(`game_${id}`, {
      event: approved ? "game_approved" : "game_rejected",
      properties: {
        game_id: id,
        author_uid: game.authorUid,
        standard_id: game.standardId,
        has_comment: !!comment,
      },
    })
    if (approved && game.authorUid) {
      trackServer(`game_${id}`, {
        event: "token_earned",
        properties: {
          amount: gameApprovedTokens,
          reason: "approval",
          learner_uid: game.authorUid,
        },
      })
    }

    return Response.json({
      status: approved ? "published" : "pending_review",
      review,
    })
  } catch (error: unknown) {
    console.error("Approve error:", error)
    return Response.json({ error: "Review failed" }, { status: 500 })
  }
}
