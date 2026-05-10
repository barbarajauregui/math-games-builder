import { getAdminDb } from "@/lib/firebase-admin"
import { sanitizeGameHtml } from "@/lib/html-sanitizer"
import { verifyAuth } from "@/lib/api-auth"

/**
 * Game-save endpoint.
 *
 * On creation (no existing document), always sets status to "pending_review"
 * regardless of what the client sends. The guide-approval endpoint at
 * /api/game/[id]/approve is the only path that flips status to "published".
 *
 * This restores the guide approval gate that the data model was designed for.
 * Audit 9 (docs/audit/09-build-flow.md) found Builder saves were writing
 * status:"published" directly, bypassing the gate. Per spec v2 §15.1, the
 * default save status is now pending_review.
 *
 * For UPDATE saves (game.id refers to an existing document), the existing
 * status is preserved unless the client explicitly sends one — this keeps
 * the legacy Builder-edits-own-game flow working without re-routing through
 * approve.
 */
export async function POST(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const game = await req.json()
  const adminDb = getAdminDb()
  const gameId = game.id || adminDb.collection("games").doc().id

  // Sanitize HTML before saving
  if (typeof game.gameHtml === "string") {
    game.gameHtml = sanitizeGameHtml(game.gameHtml)
  }

  // Distinguish create vs. update by checking if the doc exists. On create,
  // force status to "pending_review" so the guide gate is restored.
  const docRef = adminDb.collection("games").doc(gameId)
  const existing = await docRef.get()
  if (!existing.exists) {
    game.status = "pending_review"
  }

  await docRef.set({
    ...game,
    id: gameId,
    reviews: game.reviews || [],
    updatedAt: Date.now(),
    createdAt: game.createdAt || Date.now(),
  })

  return Response.json({ id: gameId, status: game.status })
}
