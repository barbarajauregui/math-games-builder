# Candidate engines — 3.OA.A.1

**Standard:** Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each. For example, describe a context in which a total number of objects can be expressed as 5 × 7.

**Math operations named in this standard:** multiplication, equal-groups

## How this list was built

- Engines pulled from `src/lib/game-engines/game-option-registry.ts` (66 engines).
- Verdict + operation tag pulled from `docs/audit/11-engine-library-per-engine.md` §1 per-engine table.
- Engines whose Audit 11 operation tag matches the standard's named operation, plus cross-tagged engines flagged in Audit 11 §3.
- **Audit 11b (new-engines walk) does NOT yet exist** at the time this kit was generated — recommend checking `docs/audit/11b-*.md` for any newer verdicts before drafting.

Phase 1-5 drafters: this is a *candidate* list, not a final ranking. Pick PRIMARY / SECONDARY from here.

## Candidates

| Engine ID | Title | Verdict | Reason it's plausible for this standard |
|---|---|---|---|
| `investment-sim` | Multiplication Array | VETTED | Visible dot-splitting; multiplication you see. |
| `assembly-line` | Assembly Line | VETTED | Two sliders for two factors; equal-groups. |
| `checkerboard-multiply` | Checkerboard Multiply | VETTED | Equal-groups area model — strongest 3.OA engine. |
| `bead-chain` | Bead Chain | VETTED | Skip-count; marker on chain shows N × groups. |
| `population-boom` | Visible Population | VETTED | ×N as growth, visible. |
| `doubling-maze` | Split-and-Double Path | VETTED | Stack visibly grows; doubling/tripling. |
| `potion-lab` | Potion Lab | VETTED | Multiplier copies base; visible filling. |
| `fill-the-floor` | Resizable Rectangle | VETTED | Area = L×W readout live. |
| `bar-model` | Bar Model | VETTED | Singapore CPA canonical — add/sub/mult. |
| `resize-tool` | Grid Stretcher | VETTED | Each cell becomes N×N — multiplication as scaling. |
| `recipe-scaler` | Stacked Mixing Bowl | VETTED | Stack height = ×N of base; ratio reasoning concrete. |
| `map-distance` | Draggable Scale Bar | VETTED | Each placement adds N; scaling and repeated addition. |

## Caveats

- **VETTED** engines pass all 4 Critic criteria (real-world scenario, math IS gameplay, no shortcut, construct validity) per Audit 11.
- **REVISABLE** engines have a known fix listed in Audit 11 §2; use only if the drafter accepts the fix is in scope.
- **HIDDEN** engines should not appear here; if one does, it's a candidate-list bug.
- Engines may pass a generic operation tag but fail a specific standard's construct validity (e.g., `split-the-loot` passes for general addition decomposition but fails K.OA.A.3's multiplicity unless the ≥3-splits fix is applied).
