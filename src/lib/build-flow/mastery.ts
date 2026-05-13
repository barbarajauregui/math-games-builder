/**
 * Level 1 mastery tracking for the build flow.
 *
 * Per spec v3 §5 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`):
 * the Builder unlocks Level 2 once `game_win` has fired for at least one
 * Scenario in each PRIMARY Game Mechanic for the standard.
 *
 * Persistence is localStorage only for the Level 1 dev cut. Firestore sync to
 * `progress/{uid}/l1/{standardId}` is a follow-up once the Builder is logged
 * in for real (see CLAUDE.md for Firestore conventions).
 *
 * Storage key shape: `mgb.l1.mechanicWins.${standardId}`
 * Storage value shape: JSON-encoded `Record<MechanicId, boolean>`.
 */

import { track } from "@/lib/telemetry/posthog-client"

const KEY_PREFIX = "mgb.l1.mechanicWins"
const UNLOCK_FIRED_PREFIX = "mgb.l1.l2UnlockedFired"

function storageKey(standardId: string): string {
  return `${KEY_PREFIX}.${standardId}`
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

/**
 * Read the Builder's recorded mechanic wins for a standard from localStorage.
 * Returns an empty object on the server, on parse failure, or when nothing has
 * been recorded yet.
 */
export function loadMechanicWins(
  standardId: string
): Record<string, boolean> {
  if (!isBrowser()) return {}
  try {
    const raw = window.localStorage.getItem(storageKey(standardId))
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      // Coerce values to boolean defensively.
      const out: Record<string, boolean> = {}
      for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
        if (v === true) out[k] = true
      }
      return out
    }
    return {}
  } catch {
    return {}
  }
}

/**
 * Mark one mechanic as won for a standard. Idempotent. Writes to localStorage.
 *
 * Fires `level_1.mechanic_complete` on the first win for the mechanic, and
 * `builder.level_2_unlocked` (once per standard, latched in localStorage) when
 * the win completes the set of `allMechanicIds`. `allMechanicIds` is optional
 * for backwards-compatibility; without it, the unlock event cannot be fired.
 */
export function recordMechanicWin(
  standardId: string,
  mechanicId: string,
  allMechanicIds?: string[]
): void {
  if (!isBrowser()) return
  try {
    const current = loadMechanicWins(standardId)
    if (current[mechanicId] === true) return
    const next = { ...current, [mechanicId]: true }
    window.localStorage.setItem(storageKey(standardId), JSON.stringify(next))

    // First win for this mechanic — fire mechanic_complete. We track only
    // mechanic-level wins (not per-scenario), so scenariosPlayed is 1 at the
    // moment of completion. A richer count is a Phase 2 enhancement.
    track({
      event: "level_1.mechanic_complete",
      properties: {
        standardId,
        mechanicId,
        scenariosPlayed: 1,
      },
    })

    // If this completes the set of required mechanics, fire level_2_unlocked
    // exactly once per standard (latched in localStorage so it doesn't re-fire
    // on storage refresh / re-mount).
    if (allMechanicIds && allMechanicIds.length > 0) {
      const allWon = allMechanicIds.every((id) => next[id] === true)
      if (allWon) {
        const latchKey = `${UNLOCK_FIRED_PREFIX}.${standardId}`
        if (window.localStorage.getItem(latchKey) !== "1") {
          window.localStorage.setItem(latchKey, "1")
          track({
            event: "builder.level_2_unlocked",
            properties: { standardId },
          })
        }
      }
    }
  } catch {
    // Swallow: localStorage may be unavailable (privacy mode, quota).
  }
}

/**
 * Has the Builder won at least one Scenario in every supplied mechanic?
 * Returns false on empty input — there is nothing to unlock against.
 */
export function isLevel2Unlocked(
  standardId: string,
  mechanicIds: string[]
): boolean {
  if (mechanicIds.length === 0) return false
  const wins = loadMechanicWins(standardId)
  return mechanicIds.every((id) => wins[id] === true)
}
