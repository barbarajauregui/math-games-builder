# Mastery Check Game — 2026-05-10 (v1)

> **Status:** Draft v1. Sibling spec to `2026-05-10-library-design.md`. Per the brainstorming skill flow, the next step after Barbara approves is invoking `writing-plans` to produce an implementation plan.
>
> **Scope of this spec:** the Mastery Check Game — a separate, hard, fully-vetted assessment game that runs *after* the existing 3×3 wins gate (3 different practice games × 3 wins each) and serves as the actual gate to "mastered." K.OA.A.1 ships first; other standards follow the same authoring schema.

---

## 1. Problem we're solving

Today, mastery is granted when a Player wins 3 different practice games on a standard, 3 wins per game. Audit 5 (mastery state machine) already flagged that this conflates accuracy with fluency with automaticity, has no response-time threshold, no skill isolation, and treats game difficulty as a free parameter the Builder controls. The deeper problem: **a win on Builder A's easy game is not equivalent to a win on Builder B's harder game.** The 3×3 rule measures "got through 9 game-attempts," not "knows the math."

A new flaw surfaced in this conversation pushes the problem harder: as Builder games accumulate per standard, the spread between the easiest and hardest published game widens. A Player who masters K.OA.A.1 today (when 3 games exist, all by careful Builders) is doing something psychometrically different from a Player who masters it next year (when 30 games exist, including some easy ones a Player can fluke through). Mastery should not drift in meaning as the library grows.

Barbara's decision (made in this conversation): rather than trying to calibrate Builder games against each other — an item-response-theory (IRT, the math used to calibrate test items against each other) project we are not staffed to do — **build a separate Mastery Check Game per standard.** Hard, hand-authored, no hints, items reviewed by an external math educator. The 3×3 wins on practice games becomes the *readiness gate*. The Mastery Check Game becomes the actual *mastery gate*.

## 2. Users this serves

- **Players** (typically grade K–4): get a clear, honest signal of whether they actually mastered a standard — not just "got through 9 games."
- **Builders** (typically grade 5–10): keep all the creative freedom over practice games; the Mastery Check is a separate, locked artifact they don't author. (Removes the perverse incentive to author easy games to "give kids mastery faster.")
- **Guides**: get diagnostic data on *which item types* a Player failed, so a kid who almost mastered can be re-taught the specific gap, not the whole standard.
- **Barbara and the curriculum team**: gain a calibrated reference point per standard. Practice games can later be calibrated *against* the Mastery Check, not against each other.

## 3. Pedagogical foundation

Five established research threads support this design:

1. **Mastery learning (Bloom 1968; Guskey 2010 review).** The consensus criterion in mastery-learning research is roughly 80% correct on a criterion-referenced formative assessment (i.e., a test built to measure a specific learning objective, not to rank learners against each other), followed by corrective re-teaching of what was missed. The Guskey 2010 review of decades of mastery-learning studies confirms 80% as the field's default cut-score. Our Mastery Check uses **80% correct (≥ 7 of 8 items)** as the pass threshold.

2. **Criterion-referenced vs norm-referenced assessment (Glaser 1963; Popham 1978).** A criterion-referenced test asks "did this learner meet this objective?" A norm-referenced test asks "how does this learner compare to others?" Mastery Check is criterion-referenced by design — we don't care how the Player ranks against peers; we care whether they hit the K.OA.A.1 bar.

3. **Item-response-theory basics (Embretson & Reise 2000).** Why a hand-authored, hand-calibrated check beats Builder-game-derived wins: each item in the bank has a known difficulty and a known construct (i.e., what specific skill it measures). Wins on a Builder game lack both. We do not implement full IRT scoring in v1 — the items are authored to a roughly uniform difficulty band — but the principle (items are calibrated against the construct, not against each other) is what we borrow.

4. **Cognitively Guided Instruction problem-type taxonomy (Carpenter et al. 1999).** This is the source for *what to put on the test* for K.OA. CGI distinguishes Add-To, Take-From, Put-Together, Take-Apart, Compare, each crossed with Result-Unknown, Change-Unknown, Start-Unknown. For K.OA.A.1 we sample Result-Unknown only (per the K-5 OA Progression) and span all 8 representational modes named in the standard.

5. **Spaced retrieval (Karpicke & Roediger 2007).** A Mastery Check that fires *once* is a snapshot. Karpicke & Roediger and the Murray et al. 2025 meta-analysis on math specifically show retention drops measurably without spaced practice. The Mastery Check should re-fire as a **retention probe** at ~14 and ~30 days post-mastery (light version, 4 items, no demotion if failed — just data). The decay UI from Audit 5 §6 hooks into this naturally.

## 4. What "mastery" means in MGB specifically

A Player is **mastered** on a standard when all four hold:

1. **Accuracy ≥ 80%** on the Mastery Check (Bloom criterion; ≥ 7 of 8 items correct).
2. **Reasonable speed.** Each item has a response-time floor (i.e., a max time the Player can take before the item auto-advances as wrong). Floor is set per item, not per check, and is generous — fast enough to indicate retrieval or efficient strategy use, not laborious one-by-one finger counting. For K.OA.A.1 with numbers within 10: 20 seconds per item.
3. **Skill isolation.** Each item tests *one* construct, not a bundle. A K.OA.A.1 item that requires reading a paragraph also tests reading; bad item. Item bank is hand-authored to keep each item single-construct.
4. **Construct coverage.** The 8 items sampled per attempt collectively span all the named representations or problem types for the standard. K.OA.A.1: 8 modes (objects, fingers, drawings, equations, sounds, acting out, mental images, verbal) — one item per mode per attempt.

This is the fluency boundary, not the automaticity boundary. Automaticity (i.e., recall from long-term memory in well under a second) is grade-2 territory; K.OA.A.5 is fluency-within-5 and even that doesn't demand flashcard speed (Baroody 2006).

## 5. The Mastery Check Game as a game, not a test

The Player should not experience this as a quiz. Plain English: it should feel like a **boss fight** or a final challenge in the same world as the practice games.

How current K-aimed apps handle the "are you actually ready?" check (per a quick scan of public documentation):

- **DreamBox Learning** — adaptive "unit assessment" wrapped in the same character/world skin as the practice; no separate quiz UI.
- **Khan Academy Kids** — "Big Bird's Words" / mastery challenges that look identical to practice activities with subtle difficulty bump.
- **Prodigy Math** — boss battles where the math problems are the attacks; same battle mechanic as regular play, but item bank is curriculum-anchored.

Common pattern across all three: **same world, harder items, no quiz chrome.** We adopt this.

Concretely for MGB:

- **Same game-mechanic vocabulary** as the practice games for the standard. For K.OA.A.1, the Mastery Check uses the `number-frames`-style ten-frame mechanic (the reference mechanic per Mr. Chesure §2.1), with mode-cycling rounds (one per representation mode).
- **Same world flavor** as the practice games (the steampunk Star Atlas Library aesthetic for Player-facing rounds).
- **Difficulty cranked.** Numbers near the top of the standard's range. No on-screen hints. No "try again" within a round — wrong answer commits and moves on. (Mistakes are diagnostic data, not a soft fail.)
- **Hand-authored items, not procedural.** Each item exists as data in the item bank; no random generation; no Builder authorship.
- **Boss-fight reward UX on pass.** Planet bloom (per Library spec §4 decision 12) advances; mastery announcement; the Builders who authored the Player's practice games each get +50 tokens (per token-economy §11 of Library spec). Diegetic ceremony — no certificate popup.
- **No "you failed" UX on fail.** The Player returns to `in_progress`; the Library quietly surfaces 2–3 fresh practice games for the standard, framed as "Try a few more games on this skill first." Telemetry on which item modes failed flows to the Guide dashboard.

## 6. Per-standard authoring schema

For each standard's Mastery Check Game, the following must exist:

| Artifact | What it is |
|---|---|
| **Item bank** | ~12 hand-authored items. 8 sampled per attempt. Sampling to 8 from 12 lets a Player re-attempt without seeing identical items. |
| **Per-item metadata** | `representationalMode` (one of the 8 K.OA.A.1 modes, or the analogous tag for other standards); `cgiProblemType` (Add-To / Take-From / Put-Together / Take-Apart); `targetAnswer`; `distractors` (3 plausible-wrong options for multiple-choice items; for tap-count items, no distractors needed); `hintDisabled: true`; `responseTimeFloorSeconds`. |
| **Construct map** | A table showing what each item measures and which named representation it covers. Authoring rule: every named representation must appear in the bank at least once; the 8 sampled per attempt must cover all 8 modes. |
| **Credits** | Author (Barbara for K.OA.A.1) + external reviewer (one math educator from outside the project; for K.OA.A.1 candidates: an Open Up Resources K author, or a Math Learning Center curriculum lead, or a local Acton-trained K teacher Barbara already knows). |
| **Calibration record** | Result of a small pilot: ~10 Players who already mastered the standard via traditional teaching should clear it at ≥ 80%. ~10 Players who have not should fall well below. If the spread is small, the item bank is too easy or too hard and is revised. |

## 7. First standard: K.OA.A.1 Mastery Check — item-by-item

K.OA.A.1 ships first because it is the only standard with a verified approved practice game today, and because the K-OA Progressions knowledge file (Chesure §2.1) has the most thorough authoring scaffolding.

Each attempt samples 8 items from the bank, one per representational mode. Numbers within 10. No hints. Auto-advance on each item (the response-time floor enforces no laborious counting).

Sample item draft (one per mode; final bank has 12, this list shows the per-mode pattern):

1. **Objects.** Two ten-frames pre-filled with red counters (6 in frame A, 3 in frame B). Player taps each counter once (each tap dims it). Number-pad commit: "How many in all?" Target: 9. Time floor: 20s.
2. **Fingers.** Animated pair of hands shows 4 fingers up on one hand, 2 on the other. Player taps each raised finger to count. Commit: "How many fingers in all?" Target: 6. Time floor: 20s.
3. **Drawings.** Blank scene; Player drags 5 stamp-dots into a left zone and 4 into a right zone. Commit: "How many dots in all?" Target: 9. Time floor: 25s.
4. **Equations.** Display `7 = 4 + ?` (alternating left/right placement across the bank per Chesure §2.1 equal-sign rule). Number-pad pick. Target: 3. Time floor: 15s.
5. **Sounds (claps).** Audio plays 5 claps, brief pause, 2 more claps. Player taps a count-button for each clap as it plays (each tap = one clap). Commit: "How many claps in all?" Target: 7. Time floor: 20s.
6. **Acting out.** Short animated scene: 3 ducks waddle onto a pond, then 4 more ducks waddle on. Player taps each duck as it lands. Commit: "How many ducks in all?" Target: 7. Time floor: 25s.
7. **Mental images.** A dot pattern flashes (5 dots arranged as a dice-5) for 1.5s, then hides. Number-pad pick. Target: 5. Time floor: 10s. (Subitizing-supported, Clements 1999.)
8. **Verbal.** Voice-over reads aloud: *"Maya has 4 cookies. Her brother gives her 3 more. How many cookies now?"* Player picks from a number-pad. Target: 7. Time floor: 20s.

Items 9–12 are additional variants (different number combinations within 10, different modes lightly weighted toward objects and equations since those carry the heaviest learning weight at K).

**No item shows the answer.** No item shows a running total. No item allows hints. No item allows retry within the attempt.

## 8. State machine integration

The current state machine (Library spec §9) becomes:

```
locked → available → in_progress → ready_for_check → check_in_progress → mastered_recent → mastered
```

Edits from Library spec:

- **3×3 wins now opens `ready_for_check`**, not `mastered`. A green ring appears on the moon in the Library with a "Boss fight ready" / "Big challenge ready" tooltip. Player can attempt anytime.
- **`check_in_progress`** is the active attempt state. Cannot be paused (8 items, ~3 minutes total).
- **Passing the check** flips the moon to `mastered_recent`. Planet bloom advances. Re-fire as retention probe at +14 days and +30 days; sustained pass = `mastered`.
- **Failing the check** sends the Player back to `in_progress`. Telemetry captures which item modes failed. Library surfaces 2–3 fresh practice games for the standard with framing copy like "A few more games will help — try these." A Player can re-attempt the Mastery Check after winning 3 more practice-game rounds (any combination, see open question §10).

**No state regression below `in_progress` on failure.** A Player who almost-mastered should not feel demoted to "locked." They're still mid-journey.

## 9. PostHog telemetry

Cross-reference: the parallel PostHog telemetry spec (sibling spec being written this session) defines the underlying event schema. For Mastery Check specifically, capture per item:

- `attemptId` (groups items into one attempt)
- `standardId`, `itemId`, `representationalMode`, `cgiProblemType`
- `answerGiven`, `targetAnswer`, `correct: bool`
- `responseTimeMs`
- `hintAttempted` (always false in v1 — hints are disabled — but capture for future flexibility)
- `abandonedAt` (item index if the Player abandoned mid-attempt)

This data drives three things:

1. **Confirm mastery.** Per-attempt pass/fail signal flows to Firestore `progress/{uid}/standards/{standardId}.lastCheck`.
2. **Diagnose specific weaknesses.** Guide dashboard surfaces per-mode failure rates ("Mateo missed both sound items and the verbal item — re-teach with auditory modes").
3. **Calibrate the item bank.** If item 7 is failing 90% of Players who later pass on retry, item 7 is too hard. If item 4 is passing 95% of Players who later fail other items, item 4 is too easy. Bank gets revised quarterly.

## 10. Authoring effort estimate

Honest hours per standard:

- **Item bank authoring:** 4–8 hours per standard (12 items × 20–40 minutes each, including writing distractors and choosing numbers).
- **Game-mechanic wrapper:** 4 hours per standard for the first standard in a cluster (reuses existing practice mechanic for that standard); ~1 hour per subsequent standard sharing the same mechanic.
- **External reviewer:** 2 hours per round, typically 1–2 rounds. Budget $100–$300 per reviewer pass.
- **Calibration pilot:** 10 Players × 5 minutes each, plus Barbara's analysis time (~2 hours).

**Total per standard: ~12–20 hours of Barbara's time + $100–$300 reviewer cost.** At 1 standard per week alongside other work, the K.OA cluster (5 standards) ships in ~5 weeks. The full K-2 OA cluster (~15 standards) ships in ~3–4 months. Full K-5 OA + NBT + MD priority subset (~40 standards) ships in ~10 months. This is realistic; building Mastery Checks for all 509 standards is **not** a v1 goal.

## 11. What this does NOT solve

- **It does not solve long-term retention.** A Player who clears the Check today may have forgotten in 3 months. The retention-probe re-fire (§3.5) + decay model from Audit 5 §6 is the path; not in v1 scope of this spec.
- **It does not solve transfer.** Clearing K.OA.A.1 in the Check doesn't guarantee the Player applies addition correctly in a real classroom problem with new framing. Transfer is a separate research problem (Barnett & Ceci 2002); MGB partially addresses it via the variety of Builder practice games, but the Check itself is a within-construct measure.
- **It does not replace Builder practice games.** Practice games are still where the bulk of learning happens. The Mastery Check is a gate, not the teaching. Practice games stay creative, varied, kid-built.
- **It does not solve construct validity at the Builder-game level.** That is the Critic + Shortcut Adversary runtime ladder's job (Library spec §13). The Check assumes Builder games are pedagogically sound enough to get a Player to the readiness gate; if they're not, the ladder catches it before publication.

## 12. Open questions

Inline picks per Barbara's preference.

1. **Items per attempt.** 6 / **8** *(my pick)* / 10 / 12. Rationale for 8: covers all 8 K.OA.A.1 representational modes one-to-one; long enough for an honest 80% threshold (≥ 7 of 8); short enough to fit a K Player's attention span (~3 minutes total at 20s/item).

2. **Re-attempt policy after failure.** Instant retry / 24-hour cooldown / **3-game cooldown (Player wins 3 more practice rounds first)** *(my pick)*. Rationale: a Player who just failed should re-engage with practice before re-trying — gives the practice games their teaching role back, avoids cheese-by-repetition.

3. **Hints during the Mastery Check.** **Never** *(my pick)* / one hint per item / two hints per item. Rationale: a hint-bearing check is no longer measuring mastery; it's measuring "could you do it with help." Different construct. Practice games are the hint surface.

4. **Item-bank visibility to Builders.** **Hidden** *(my pick — prevents Builders building practice games that teach to the test)* / visible after Builder publishes their first game on the standard / always visible. Rationale: if Builders see the Check items, they will (consciously or not) optimize practice games to drill those exact items, collapsing the construct.

5. **Pilot scope.** **K.OA.A.1 only** *(my pick)* / all 5 K.OA standards / all of K–2 OA. Rationale: K.OA.A.1 is the only standard with a verified approved practice game today; we ship one Check, observe how Players experience it, iterate the authoring schema, then scale.

## 13. After approval

Per the brainstorming skill flow:

1. Barbara reviews this v1 spec; approves or requests changes.
2. On approval, draft the K.OA.A.1 item bank (12 items) using §7 as the seed. Ship to external reviewer.
3. Invoke `writing-plans` for the game-mechanic wrapper + state-machine integration + PostHog wiring.
4. `executing-plans` + `subagent-driven-development` for the build.
5. Pause for Barbara's visual review when the K.OA.A.1 Check is playable end-to-end.
6. Run the 10+10 calibration pilot.
7. Ship to a single classroom (Barbara's school) for a 4-week observation before expanding to K.OA.A.2.

---

## Citations

(Only published, verifiable sources. Citation keys checked against ERIC / Semantic Scholar / OpenAlex where indicated.)

- Baroody, A. J. (2006). Why children have difficulties mastering the basic number combinations and how to help them. *Teaching Children Mathematics, 13*(1), 22–31.
- Barnett, S. M., & Ceci, S. J. (2002). When and where do we apply what we learn? A taxonomy for far transfer. *Psychological Bulletin, 128*(4), 612–637.
- Bloom, B. S. (1968). Learning for mastery. *Evaluation Comment (UCLA-CSEIP), 1*(2).
- Carpenter, T. P., Fennema, E., Franke, M. L., Levi, L., & Empson, S. B. (1999). *Children's Mathematics: Cognitively Guided Instruction.* Heinemann.
- Clements, D. H. (1999). Subitizing: What is it? Why teach it? *Teaching Children Mathematics, 5*(7), 400–405.
- Common Core Standards Writing Team. (2011/2023). *Progressions for the Common Core State Standards in Mathematics — K-5, Operations and Algebraic Thinking.* Institute for Mathematics and Education, University of Arizona.
- Embretson, S. E., & Reise, S. P. (2000). *Item Response Theory for Psychologists.* Lawrence Erlbaum Associates.
- Glaser, R. (1963). Instructional technology and the measurement of learning outcomes: Some questions. *American Psychologist, 18*(8), 519–521.
- Guskey, T. R. (2010). Lessons of mastery learning. *Educational Leadership, 68*(2), 52–57. (ERIC EJ906145.)
- Karpicke, J. D., & Roediger, H. L., III. (2007). Expanding retrieval practice promotes short-term retention, but equally spaced retrieval enhances long-term retention. *Journal of Experimental Psychology: Learning, Memory, and Cognition.* (ERIC EJ768633.)
- Murray, E., Horner, A. J., & Göbel, S. M. (2025). A meta-analytic review of the effectiveness of spacing and retrieval practice for mathematics learning. *Educational Psychology Review.* (ERIC EJ1478558.)
- Popham, W. J. (1978). *Criterion-Referenced Measurement.* Prentice-Hall.

---

*End of spec.*
