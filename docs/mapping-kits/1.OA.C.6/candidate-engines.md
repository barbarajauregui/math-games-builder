# Candidate engines — 1.OA.C.6

**Standard:** Add and subtract within 20, demonstrating fluency for addition and subtraction within 10. Use strategies such as counting on; making ten (e.g., 8 + 6 = 8 + 2 + 4 = 10 + 4 = 14); decomposing a number leading to a ten (e.g., 13 – 4 = 13 – 3 – 1 = 10 – 1 = 9); using the relationship between addition and subtraction (e.g., knowing that 8 + 4 = 12, one knows 12 – 8 = 4); and creating equivalent but easier or known sums (e.g., adding 6 + 7 by creating the known equivalent 6 + 6 + 1 = 12 + 1 = 13).

**Math operations named in this standard:** addition, subtraction, fluency

## How this list was built

- Engines pulled from `src/lib/game-engines/game-option-registry.ts` (66 engines).
- Verdict + operation tag pulled from `docs/audit/11-engine-library-per-engine.md` §1 per-engine table.
- Engines whose Audit 11 operation tag matches the standard's named operation, plus cross-tagged engines flagged in Audit 11 §3.
- **Audit 11b (new-engines walk) does NOT yet exist** at the time this kit was generated — recommend checking `docs/audit/11b-*.md` for any newer verdicts before drafting.

Phase 1-5 drafters: this is a *candidate* list, not a final ranking. Pick PRIMARY / SECONDARY from here.

## Candidates

| Engine ID | Title | Verdict | Reason it's plausible for this standard |
|---|---|---|---|
| `number-frames` | Number Frames | VETTED | Ten-frame; reference implementation for K.OA.A.1/A.2/A.5. |
| `cuisenaire-rods` | Cuisenaire Rods | VETTED | Length-snap IS the answer; supports counting/composition. |
| `bar-model` | Bar Model | VETTED | Singapore CPA canonical — add/sub/mult. |
| `free-collect` | Free Collect | VETTED | Field IS the answer, no Check button. |
| `free-balance` | Free Balance | VETTED | Beam IS the equation; supports unknown-addend. |

## Caveats

- **VETTED** engines pass all 4 Critic criteria (real-world scenario, math IS gameplay, no shortcut, construct validity) per Audit 11.
- **REVISABLE** engines have a known fix listed in Audit 11 §2; use only if the drafter accepts the fix is in scope.
- **HIDDEN** engines should not appear here; if one does, it's a candidate-list bug.
- Engines may pass a generic operation tag but fail a specific standard's construct validity (e.g., `split-the-loot` passes for general addition decomposition but fails K.OA.A.3's multiplicity unless the ≥3-splits fix is applied).
