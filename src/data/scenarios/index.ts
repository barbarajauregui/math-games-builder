import type { Scenario } from "./types"
import { K_OA_A_1_SCENARIOS } from "./k-oa-a-1"

const SCENARIOS_BY_STANDARD: Record<string, Scenario[]> = {
  "K.OA.A.1": K_OA_A_1_SCENARIOS,
}

export function loadScenarios(standardId: string): Scenario[] {
  return SCENARIOS_BY_STANDARD[standardId] ?? []
}

export type { Scenario, Mechanic, MechanicId } from "./types"
