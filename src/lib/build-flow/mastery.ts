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

const KEY_PREFIX = "mgb.l1.mechanicWins"

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
 */
export function recordMechanicWin(
  standardId: string,
  mechanicId: string
): void {
  if (!isBrowser()) return
  try {
    const current = loadMechanicWins(standardId)
    if (current[mechanicId] === true) return
    const next = { ...current, [mechanicId]: true }
    window.localStorage.setItem(storageKey(standardId), JSON.stringify(next))
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
