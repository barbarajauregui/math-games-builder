import { Level2Scaffold } from "@/components/build-flow/level-2-scaffold"
import { K_OA_A_1_MECHANICS } from "@/data/mechanics/k-oa-a-1-mechanics"
import standardsData from "@/data/standards.json"
import { loadStandardKnowledge } from "@/lib/standard-knowledge"

interface PageProps {
  params: Promise<{ standardId: string }>
}

/**
 * Level 2 entry — vibe-coding prompt scaffold composer.
 *
 * Spec v3 §6 + §13, Task 9 in build order (§16).
 *
 * Server component shell: validates the standard ID, loads the standard's
 * pedagogical knowledge once (so the per-standard block of the prompt can be
 * pre-composed on the server — no fs/API access in the client), and hands the
 * baked standard block + mechanic list to a client component for interactive
 * composition.
 *
 * Today the only standard with mechanic data + full knowledge is K.OA.A.1. For
 * other standards, the page renders an honest "not ready yet" panel.
 */
export default async function BuildLevel2Page({ params }: PageProps) {
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

  // Today: only K.OA.A.1 has mechanics authored. Bail honestly for others.
  if (decoded !== "K.OA.A.1") {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Level 2 coming soon</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Level 2 build tools aren&apos;t authored yet for {decoded}. K.OA.A.1 is
            the first standard to ship Level 2.
          </p>
        </div>
      </div>
    )
  }

  const knowledge = await loadStandardKnowledge(decoded)

  return (
    <Level2Scaffold
      standardId={decoded}
      mechanics={K_OA_A_1_MECHANICS}
      standardBlock={{
        plainEnglish: knowledge.plainEnglish,
        standardText: knowledge.standardText,
        hasFullKnowledge: knowledge.hasFullKnowledge,
        misconceptions: knowledge.misconceptions,
      }}
    />
  )
}
