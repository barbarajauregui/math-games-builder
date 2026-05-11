# Audit 18 — Scenario cards are culturally narrow and operation-locked

*Date: 2026-05-10 · Auditor: review of `src/components/builders/builder-picker.tsx` against culturally-relevant math-education research and Carpenter et al. CGI problem typology · Builds on Audit 8 (game templates) and Audit 17 (standard-engine coverage gaps).*

## §1 — Summary

The "Quick start — pick a scenario" panel on the Builder picker screen has two interlocking flaws:

1. **All six scenario cards are middle-class American defaults.** Bakery, Toy Store, Farm, Sports (basketball), Party (birthday), Classroom (pencils-from-the-supply-closet). A kid whose lived experience is none of those sees nothing of themselves on the screen they're supposed to draw inspiration from. Math-education research is consistent that math grounded in the learner's actual world transfers better and engages more learners — the cultural narrowness is a learning problem, not just an inclusion problem.
2. **All six scenarios are addition stories.** "A baker has some pastries. More come out of the oven." "Some kids at the party. More friends show up." Every card models a Result-Unknown addition problem. When a Builder picks the moon for K.OA.A.3 (decomposition — Take-Apart-Total-Unknown), or 1.OA.A.1 with a Compare structure, or 3.OA.A.1 (multiplication as equal groups), or 3.NF.A.1 (fractions), the Builder picker still shows them these six addition cards. The app says "pick one for inspiration" but every option silently mis-frames the math.

The "Or try a game style" panel directly underneath has the same problem in a milder form: Sum Jumper and Wall Builder are written as addition mechanics (and per Audit 8 they also fail Discovery and Self-Revealing Truth tests).

Foundation Fix #5 (committed 01d7fc6) made the AI generation prompt compose per-standard, so the back-end is no longer locked to addition. **But the scenario cards themselves are still hard-coded addition stories.** The fix didn't reach this UI surface.

## §2 — What's actually in the file

`src/components/builders/builder-picker.tsx` lines 20–27 define `SCENARIOS`, an array of six objects. Verbatim titles + the math each one models:

| Card | Math operation modeled |
|---|---|
| Bakery — "pastries on shelf, more from oven" | Addition, Result-Unknown |
| Toy Store — "toys in basket, picks more" | Addition, Result-Unknown |
| Farm — "eggs collected, chickens laid more" | Addition, Result-Unknown |
| Sports — "points in first half, more in second" | Addition, Result-Unknown |
| Party — "kids at party, more friends show up" | Addition, Result-Unknown |
| Classroom — "pencils on desk, more from closet" | Addition, Result-Unknown |

Every card is the same Carpenter et al. CGI problem type: **Join, Result-Unknown.** This is the easiest addition problem type and the one K Players master earliest. None of the other CGI types — Join Change-Unknown, Join Start-Unknown, Separate (subtraction), Part-Part-Whole (decomposition), Compare — appears anywhere on the screen.

The component takes `standardId` as a prop (line 14) but does not branch on it. The same six addition cards render regardless of which moon the Builder picked.

## §3 — Why cultural narrowness is a learning problem, not just a cosmetic one

Math-ed research has converged across three decades on the same finding: when math problems are situated in the actual world of the learner (the family's work, the community's daily activities, the kid's neighborhood and language), learners engage longer, persist through harder problems, and transfer the underlying math to new contexts more successfully.

- The **funds-of-knowledge** work argues that every household generates rich mathematical practice (cooking, sewing, carpentry, money management, gardening, music, sports) that schools systematically ignore. When teachers build math instruction on top of those household practices, learners show stronger engagement and stronger mathematical reasoning, especially learners whose home culture differs from the school's default. González, Moll, and Amanti's 2005 book is the canonical reference; Civil's 2007 chapter applies it specifically to math.
- The **bilingual math learner** literature (Moschkovich 2002) shows that scenario framing matters as much as language access: a problem framed in a context the learner has lived through scaffolds the mathematical language naturally, while a problem framed in an unfamiliar context forces the learner to decode the context before they can even start on the math.
- Boaler's 2016 *Mathematical Mindsets* synthesizes related work showing that learners from non-dominant cultural contexts disengage from math earlier and more decisively when the surface stories don't match their world — and that the disengagement is mistakenly read as low math ability.

The MGB app reaches Acton Academy (a private alternative school with a particular cultural mix) but the positioning doc explicitly targets **alternative, traditional, and homeschool co-op schools** as first-class users. Some of those schools will be majority Spanish-speaking. Some will be rural with farm-real contexts and no bakery. Some will be urban with no farm. Some will be religious schools with culturally-specific holidays the current cards don't touch. Six middle-class American cards is the wrong default for that target.

## §4 — Why operation-locked scenarios are a separate, additive learning problem

Carpenter, Fennema, Franke, Levi, and Empson's Cognitively Guided Instruction (CGI) framework distinguishes **eleven addition/subtraction problem structures** by what's known and what's unknown — Join / Separate / Part-Part-Whole / Compare crossed with Result-Unknown / Change-Unknown / Start-Unknown. Each structure is a genuinely different cognitive task. K.OA.A.1 expects exposure to multiple representations. K.OA.A.2 expects exposure to **four** CGI Result-Unknown types. K.OA.A.3 is specifically Part-Part-Whole, Both-Addends-Unknown. K.OA.A.4 is Join, Change-Unknown with the result locked at 10.

A Builder who picks K.OA.A.3 and sees six Join-Result-Unknown scenario cards will model their game wrong. The Critic will catch it (and per Foundation Fix #1 the four-stage runtime ladder now actually runs at submission). But the Builder will have spent an hour building a game that the Critic rejects because the scenario cards mis-framed their thinking from the start. That's expensive in Builder time and expensive in critique-cost tokens, and it's preventable by fixing the inspiration screen.

Multiplication, division, fractions, and measurement standards have entirely different problem-type literatures: equal-groups vs. multiplicative-comparison vs. area-and-array for multiplication (Greer 1992); partitive vs. quotitive for division (same source); part-whole vs. measure vs. quotient vs. ratio vs. operator for fractions (Behr, Lesh, Post, & Silver 1983). None of those framings is reachable from a "Bakery → more pastries → result" card.

## §5 — Proposed fix

Two pieces of structure to add, plus a UX rule.

**Piece 1: tag scenarios by operation and by CGI problem type.** A scenario card needs at minimum:

- `operation`: one of `addition` / `subtraction` / `multiplication` / `division` / `fractions` / `measurement` / `geometry` / etc.
- `problemType`: where applicable, the CGI structure (`join-result-unknown`, `join-change-unknown`, `part-part-whole`, `compare`, `equal-groups`, `partitive-division`, `quotitive-division`, `multiplicative-compare`, etc.).
- `culturalContext`: a tag describing the world the story lives in (e.g. `urban-american`, `rural-farm`, `latin-american-market`, `school-cafeteria`, `home-cooking`, `community-sports`, `music-rehearsal`, `garment-making`, `garden`, `family-business`, `religious-celebration`).

The picker reads the moon's `operation` from `src/data/standards.json` (each leaf standard already has a `domain` and `cluster`; an `operation` tag would be a small extension) and shows only scenarios where `operation` matches and `problemType` is in the moon's expected-types list.

**Piece 2: enlarge the scenario library and diversify cultural contexts.** Replace the six addition-only cards with a library of roughly 60 (10 per operation × 6 cultural contexts, then filtered to what the moon needs). Cultural-context picks should include at minimum: home-cooking (which beats "bakery" in cross-cultural reach because every culture cooks at home), family-run-business, community-sports (broader than American basketball — football/soccer, cricket, futsal, basketball), gardening or farming (rural-fit), making-and-fixing-things (carpentry, sewing, knitting — funds-of-knowledge defaults), and a music or dance context. None of these is exotic; together they reach far more learners than the current six.

**Piece 3: the "Or describe your own" path stays prominent.** A Builder whose lived experience isn't in the library should be able to type a sentence and have the system check whether the proposed scenario actually fits the moon's operation and problem type. This is a small Haiku-stage call before the build screen opens — cheaper than running the full Critic at submission and protective of Builder time. The check returns one of: PASS (scenario fits the moon, proceed), SUGGEST (scenario almost fits, try one of these reframings), REJECT (scenario doesn't model the moon's math, here's what would).

**UX rule:** never show an addition scenario on a non-addition moon. Today's silent mismatch is the worst case because it looks like guidance. A "no cards yet for this kind of math — describe your own scenario" empty state is honest and protects the Builder.

## §6 — Effort and sequencing

- Adding the three tag fields to scenarios and wiring the picker to filter by `standardId`'s operation: ~half a day.
- Writing the 60-card scenario library across 6 operations × 6 cultural contexts: ~1–2 days (the math is constrained per operation; the cultural variation is the slow part — worth showing drafts to teachers from different community contexts before locking).
- Wiring the "describe your own" Haiku-stage scenario check: ~half a day.

**Sequence relative to other audits:**

- Lands well **after** Audit 17 Tier 1 (per-standard engine coverage) — otherwise scenario filtering by operation has nothing to filter against on most standards.
- Lands well **after** the K.OA.A.3 mis-implementation fix from Audit 7 (the K.OA.A.3 engine itself needs to be teaching Part-Part-Whole before scenario cards for it matter).
- Lands **before** the 3.OA.A.1 cross-age pilot, because that pilot's whole point is grade 3 Players from non-dominant-culture households recognizing themselves in grade 5–7 Builders' games. Generic Bakery cards will dilute the pilot's strongest signal.

## §7 — Notes on what NOT to do

- **Do not auto-translate scenario language by browser locale.** The cultural problem is about whose world the math lives in, not what language the kid reads. A perfectly-translated "bakery" scenario is still a bakery scenario.
- **Do not invent culturally-specific stereotypes.** Funds-of-knowledge is about the household's actual practices, not about exoticizing them. "Helping at the family taqueria" is fine if the kid's family runs one and a teacher writes the card; it is condescending if a Claude agent invents it as a generic "Latin American" card. Recommend any non-default cultural-context cards be written by teachers at pilot schools rather than generated.
- **Do not make Builders pick a cultural context.** Surface cards that match the moon's operation; vary cultural context across the surfaced set so every learner sees something they recognize without making the variation a decision the kid has to make.

## Sources

- Carpenter, T. P., Fennema, E., Franke, M. L., Levi, L., & Empson, S. B. (2014). *Children's Mathematics: Cognitively Guided Instruction* (2nd ed.). Heinemann. — the CGI problem-type framework used to identify that today's six cards all collapse to one structure (Join, Result-Unknown).
- Greer, B. (1992). Multiplication and division as models of situations. In D. A. Grouws (Ed.), *Handbook of Research on Mathematics Teaching and Learning* (pp. 276–295). NCTM/Macmillan. — the multiplication and division problem-type framework (equal-groups, multiplicative compare, area-and-array; partitive vs. quotitive division) used to justify operation-specific scenario libraries.
- Behr, M. J., Lesh, R., Post, T. R., & Silver, E. A. (1983). Rational number concepts. In R. Lesh & M. Landau (Eds.), *Acquisition of Mathematics Concepts and Processes* (pp. 91–126). Academic Press. — the five-subconstruct framework for fractions (part-whole, measure, quotient, ratio, operator) showing why a fractions moon cannot be served by an addition card.
- González, N., Moll, L. C., & Amanti, C. (Eds.). (2005). *Funds of Knowledge: Theorizing Practices in Households, Communities, and Classrooms.* Routledge. — the canonical funds-of-knowledge collection grounding the "scenarios should match learners' household practice" recommendation.
- Civil, M. (2007). Building on community knowledge: An avenue to equity in mathematics education. In N. Nasir & P. Cobb (Eds.), *Improving Access to Mathematics: Diversity and Equity in the Classroom* (pp. 105–117). Teachers College Press. — applies funds-of-knowledge specifically to math instruction.
- Moschkovich, J. (2002). A situated and sociocultural perspective on bilingual mathematics learners. *Mathematical Thinking and Learning*, 4(2–3), 189–212. — the basis for the claim that unfamiliar scenario context forces double decoding (context + math) for bilingual learners.
- Boaler, J. (2016). *Mathematical Mindsets: Unleashing Students' Potential through Creative Math, Inspiring Messages and Innovative Teaching.* Jossey-Bass. — the synthesis treatment of cultural fit, mindset, and engagement used to support the "cultural narrowness is a learning problem" framing.
- `src/components/builders/builder-picker.tsx` (lines 20–32 = SCENARIOS and GAME_STYLES arrays as of 2026-05-10).
- `docs/audit/08-game-templates.md` (Sum Jumper / Wall Builder Discovery + SRT failures — adjacent to but distinct from this audit's cultural and operation findings).
- `docs/agents/chesure-knowledge/k-oa-progressions.md` (the K.OA CGI typology authority Mr. Chesure already uses internally — not yet surfaced to the Builder picker).
