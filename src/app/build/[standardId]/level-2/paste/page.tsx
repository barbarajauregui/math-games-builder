import { Level2Paste } from "@/components/build-flow/level-2-paste"
import standardsData from "@/data/standards.json"

interface PageProps {
  params: Promise<{ standardId: string }>
}

/**
 * Level 2 Gate B — paste-HTML + Builder-must-win playtest.
 *
 * Spec v3 §8 + §13 (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`),
 * Task 11 in §16.
 *
 * Server component shell: validates the standard ID and hands off to the
 * client component. No AI, no server-side HTML validation — those are Task
 * 12's job (the 4-stage critique ladder). This screen is the local-only
 * "did the Builder win their own game?" gate.
 */
export default async function BuildLevel2PastePage({ params }: PageProps) {
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

  return <Level2Paste standardId={decoded} />
}
