/**
 * COPPA-clean helpers — banding + PII detection.
 *
 * Source of truth: `docs/superpowers/specs/2026-05-10-posthog-telemetry.md` §3.
 *
 * Rules:
 *  - identifier = the personal code (cosmos word like "NOVA-42")
 *  - age bucketed into "5-7" | "8-10" | "11-13" | "14-16" | "unknown"
 *  - grade bucketed into "K-2" | "3-5" | "6-8" | "9-10" | "unknown"
 *  - NEVER: real name, email, exact age, exact date of birth, Firebase UID
 */

import type { AgeBand, CoppaCleanUserContext, GradeBand, UserRole } from "./events"

/** Anything that has the minimum fields we need to derive bands. */
export interface ProfileLike {
  personalCode?: string
  role?: UserRole
  grade?: string
  age?: number
}

export function bandAge(age?: number): AgeBand {
  if (typeof age !== "number" || !Number.isFinite(age)) return "unknown"
  if (age >= 5 && age <= 7) return "5-7"
  if (age >= 8 && age <= 10) return "8-10"
  if (age >= 11 && age <= 13) return "11-13"
  if (age >= 14 && age <= 16) return "14-16"
  return "unknown"
}

/**
 * Map a free-form grade string ("K", "1", "3", "10th", "kindergarten", "5-6")
 * to a band. Returns "unknown" if we can't make a confident guess.
 */
export function bandGrade(grade?: string): GradeBand {
  if (!grade) return "unknown"
  const g = grade.trim().toLowerCase()
  if (g === "k" || g === "kg" || g.startsWith("kinder") || g === "0") return "K-2"
  // Pull the first integer we see (handles "3rd", "grade 5", "5-6", "10th").
  const match = g.match(/(\d+)/)
  if (!match) return "unknown"
  const n = parseInt(match[1], 10)
  if (Number.isNaN(n)) return "unknown"
  if (n >= 0 && n <= 2) return "K-2"
  if (n <= 5) return "3-5"
  if (n <= 8) return "6-8"
  if (n <= 10) return "9-10"
  return "unknown"
}

export interface Bands {
  age_band: AgeBand
  grade_band: GradeBand
}

export function getBands(profile: ProfileLike | null | undefined): Bands {
  return {
    age_band: bandAge(profile?.age),
    grade_band: bandGrade(profile?.grade),
  }
}

// -----------------------------------------------------------------------------
// PII guards. These run in dev/test and throw loudly if PII leaks through.
// In production they downgrade to a warn-and-strip so a buggy call site
// can't take down a live class.
// -----------------------------------------------------------------------------

/**
 * Firebase anonymous + standard UIDs are 28-char alphanumeric strings.
 * Real-form codes look like "NOVA-42" or "NOVA42" — short and uppercase.
 * If we see something that looks like a Firebase UID being used as distinct_id,
 * throw.
 */
const FIREBASE_UID_RE = /^[A-Za-z0-9]{20,}$/

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/

const PERSONAL_CODE_RE = /^[A-Z]{2,8}-?\d{1,4}$/

/** Looks like a Firebase auth UID, not a personal code. */
export function looksLikeFirebaseUid(value: string): boolean {
  if (PERSONAL_CODE_RE.test(value)) return false
  return FIREBASE_UID_RE.test(value)
}

export function looksLikeEmail(value: unknown): boolean {
  return typeof value === "string" && EMAIL_RE.test(value)
}

/**
 * Property keys that are NEVER allowed on any PostHog event. If a call site
 * tries to pass one, we strip + warn (production) or throw (dev/test).
 */
const FORBIDDEN_KEYS = new Set<string>([
  "name",
  "displayName",
  "first_name",
  "last_name",
  "fullName",
  "email",
  "phone",
  "dob",
  "birthday",
  "birth_date",
  "exact_age",
  "uid",
  "firebase_uid",
])

export class PiiLeakError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PiiLeakError"
  }
}

function isDevOrTest(): boolean {
  return process.env.NODE_ENV !== "production"
}

/**
 * Validate a user-context payload before we hand it to posthog.identify.
 * Throws in dev/test, warns and returns a stripped copy in production.
 */
export function assertCoppaCleanUserContext(ctx: CoppaCleanUserContext): CoppaCleanUserContext {
  const problems: string[] = []
  if (!ctx.distinct_id) problems.push("distinct_id is required")
  else if (looksLikeFirebaseUid(ctx.distinct_id)) {
    problems.push(`distinct_id "${ctx.distinct_id}" looks like a Firebase UID; use the personal code (e.g. "NOVA-42")`)
  }
  for (const v of Object.values(ctx)) {
    if (looksLikeEmail(v)) problems.push(`user context contains an email: ${String(v)}`)
  }
  // Catch any forbidden keys snuck in via spread.
  for (const k of Object.keys(ctx)) {
    if (FORBIDDEN_KEYS.has(k)) problems.push(`forbidden key on user context: ${k}`)
  }
  if (problems.length > 0) {
    const msg = `[telemetry/coppa] PII leak: ${problems.join("; ")}`
    if (isDevOrTest()) throw new PiiLeakError(msg)
    console.warn(msg)
  }
  return ctx
}

/**
 * Strip forbidden keys from an event property bag. Throws in dev/test if
 * any forbidden key is present (so the bug surfaces before deploy).
 */
export function assertCoppaCleanProperties<T extends Record<string, unknown>>(
  eventName: string,
  props: T,
): T {
  const problems: string[] = []
  const cleaned: Record<string, unknown> = { ...props }
  for (const key of Object.keys(cleaned)) {
    if (FORBIDDEN_KEYS.has(key)) {
      problems.push(`forbidden property "${key}" on event "${eventName}"`)
      delete cleaned[key]
    }
  }
  for (const [k, v] of Object.entries(cleaned)) {
    if (typeof v === "string" && looksLikeEmail(v)) {
      problems.push(`property "${k}" on event "${eventName}" contains an email`)
      delete cleaned[k]
    }
  }
  if (problems.length > 0) {
    const msg = `[telemetry/coppa] ${problems.join("; ")}`
    if (isDevOrTest()) throw new PiiLeakError(msg)
    console.warn(msg)
  }
  return cleaned as T
}
