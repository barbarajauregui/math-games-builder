import { Level2Review } from "@/components/build-flow/level-2-review"
import standardsData from "@/data/standards.json"

interface PageProps {
  params: Promise<{ standardId: string }>
}

/**
 * Level 2 Gate C — HTML review (4-stage critique ladder reduced to bullets).
 *
 * Spec v3 §9 + §10 + §13 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`),
 * Task 12 in §16.
 *
 * Server shell: validates the standard ID and hands off to the client
 * component, which:
 *   1. Pulls pastedHtml + win-state + mechanicId + builderDescription from
 *      localStorage (set in earlier Level 2 screens).
 *   2. Redirects back to /level-2/paste if any required state is missing.
 *   3. Calls POST /api/build-flow/html-review and renders the result.
 */
export default async function BuildLevel2ReviewPage({ params }: PageProps) {
  const { standardId } = await params
  const decoded = decodeURIComponent(standardId)

  const known = (standardsData as { nodes: Array<{ id: string }> }).nodes.some(
    (n) => n.id === decoded
  )
  if (!known) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400">Unknown standard: {decoded}</p>
      </div>
    )
  }

  if (decoded !== "K.OA.A.1") {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Level 2 coming soon</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Level 2 build tools aren&apos;t authored yet for {decoded}. K.OA.A.1
            is the first standard to ship Level 2.
          </p>
        </div>
      </div>
    )
  }

  return <Level2Review standardId={decoded} />
}
