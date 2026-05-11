import { BuildFlow } from "@/components/build-flow/build-flow"
import standardsData from "@/data/standards.json"

interface PageProps {
  params: Promise<{ standardId: string }>
}

export default async function BuildPage({ params }: PageProps) {
  const { standardId } = await params
  const decoded = decodeURIComponent(standardId)

  // Lightweight sanity check: refuse unknown standard IDs
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

  return <BuildFlow standardId={decoded} />
}
