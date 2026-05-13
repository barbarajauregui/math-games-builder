# Candidate engines — 2.NBT.B.8

**Standard:** Mentally add 10 or 100 to a given number 100–900, and mentally subtract 10 or 100 from a given number 100–900.

**Math operations named in this standard:** addition, subtraction, mental-math, place-value

## How this list was built

- Engines pulled from `src/lib/game-engines/game-option-registry.ts` (66 engines).
- Verdict + operation tag pulled from `docs/audit/11-engine-library-per-engine.md` §1 per-engine table.
- Engines whose Audit 11 operation tag matches the standard's named operation, plus cross-tagged engines flagged in Audit 11 §3.
- **Audit 11b (new-engines walk) does NOT yet exist** at the time this kit was generated — recommend checking `docs/audit/11b-*.md` for any newer verdicts before drafting.

Phase 1-5 drafters: this is a *candidate* list, not a final ranking. Pick PRIMARY / SECONDARY from here.

## Candidates

| Engine ID | Title | Verdict | Reason it's plausible for this standard |
|---|---|---|---|
| `place-value-discs` | Place Value Discs | VETTED | Total readout IS the truth. |
| `hundred-board` | Hundred Board | REVISABLE | Number-sequence / 100-chart; needs drag-and-place fix. |
| `stamp-game` | Stamp Game | VETTED | Place value with thousands. |

## Caveats

- **VETTED** engines pass all 4 Critic criteria (real-world scenario, math IS gameplay, no shortcut, construct validity) per Audit 11.
- **REVISABLE** engines have a known fix listed in Audit 11 §2; use only if the drafter accepts the fix is in scope.
- **HIDDEN** engines should not appear here; if one does, it's a candidate-list bug.
- Engines may pass a generic operation tag but fail a specific standard's construct validity (e.g., `split-the-loot` passes for general addition decomposition but fails K.OA.A.3's multiplicity unless the ≥3-splits fix is applied).
