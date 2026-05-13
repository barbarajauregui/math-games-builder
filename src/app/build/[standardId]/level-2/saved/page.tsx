import { Level2Saved } from "@/components/build-flow/level-2-saved"
import standardsData from "@/data/standards.json"

interface PageProps {
  params: Promise<{ standardId: string }>
}

/**
 * Level 2 saved confirmation screen.
 *
 * Spec v3 §16 (Task 13) (`docs/superpowers/specs/2026-05-12-koa-a-1-build-flow.md`).
 *
 * Reached after a successful POST /api/game/save from the Level 2 review
 * screen. Server shell validates the standard id and hands off to the
 * client component which renders the confirmation + next-step CTAs.
 */
export default async function BuildLevel2SavedPage({ params }: PageProps) {
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

  return <Level2Saved standardId={decoded} />
}
