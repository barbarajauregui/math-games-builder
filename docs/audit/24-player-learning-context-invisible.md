# Audit 23 — Player Learning Context Is Invisible

*Date: 2026-05-10 · Method: Targeted review of the Player Star Atlas Library flow against the metacognition and self-regulated-learning literature; cross-checked against the current spec `docs/superpowers/specs/2026-05-10-library-design.md` and positioning v1.2. Citations verified on ERIC and OpenAlex.*

---

## Summary

The Player taps a card on a shelf, plays "Bakery Cupcakes" by Maya, wins, earns a token, and moves to the next card. **At no point does the Player encounter what that game was teaching.** The standard it targets (K.OA.A.1 — represent addition with objects) is invisible to the Player end-to-end.

This is a self-correcting-loop failure. The positioning doc's belief #5 is "real audiences create real learning" — but a real audience can only correct a Builder's game if the audience can tell, even fuzzily, what the game was supposed to teach them. A Player who can't name what they just learned has no basis for noticing that they didn't actually learn it. A weak game from a Builder slips through, the Player rates it (or just stops playing), and the signal back to the Builder is "kid didn't like it" — not "kid didn't learn the math."

The fix is age-appropriate metacognitive scaffolding. Not a CCSS code. A kid-friendly badge or icon, shown **after** play, that names the idea in plain words. This is consistent with established work on metacognition in young children, which finds that even pre-readers can name what they're doing if you give them the right surface.

---

## Why this matters (research backing)

**Metacognitive instruction is one of the largest effect-size interventions in education.** Hattie's synthesis of 800+ meta-analyses places metacognitive strategy instruction near the top of the effect-size table (large, well-replicated). The classical foundation is the idea that learners who can monitor and name their own cognition transfer more of what they learned to new contexts than learners who can't.

**Self-regulated learning** research extends this: when learners are aware of the goal of a task, they make better use of feedback during the task. Players who don't know the goal of "Bakery Cupcakes" treat it as pure entertainment; players who know the goal treat the cupcake-counting as the point.

**Young children CAN metacognize, but mostly preverbally or iconically.** Research on metacognition in 3–7 year olds shows that they reliably display metacognitive behavior (rechecking, self-correcting, asking for help on hard items) before they can describe it in words. The implication for UX: an icon or a short spoken sentence works; a paragraph does not.

**What competitors do (and don't):**
- **Khan Academy Kids** ends each activity with a brief animated character saying what the activity was about ("Great job — you were finding numbers that add up to 5!"). Voice-led, ~3 seconds.
- **DreamBox** does not surface the standard to the Player; it surfaces it to the teacher dashboard. The Player flow ends with a token/badge and a "next" CTA.
- **Prodigy Math** surfaces the strand ("Counting and addition") on the post-question screen but in adult-readable text many of its K-2 users can't actually read.

The pattern that works is **post-play, plain-words, icon-first, voice-optional.** The pattern that doesn't work is pre-play standards labels.

---

## Proposed UX

A **"Thing you just learned"** card that appears after a Player finishes a game (win OR quit). One screen. Three elements:

1. **Icon** — primary identifier. For K.OA.A.1, two small piles of objects merging into one bigger pile. (Leonardo-generated, one icon per standard, in the warm steampunk-brass palette of the Library so it lives in the world.)
2. **One plain-words sentence** — "You put two groups of things together to find how many in all." Not "K.OA.A.1." Not "Represent addition with objects." Plain words a 6-year-old would recognize.
3. **Tap-to-hear** — speaker icon plays the sentence as audio, ~3 seconds. Same warm narrator voice the Library uses elsewhere. This is the load-bearing affordance for pre-readers and English Learners.

Optional fourth element: **a tiny mastery dot** showing this is the Nth game on this idea the Player has played ("3 of 9 to bloom this moon"). Connects the post-play moment to the planet-bloom mastery state without making it the main message.

**Fires AFTER play, never before.** Showing the goal pre-play would pre-spoiler the Discovery test (a Player should be able to learn the math from playing; if you tell them what they're about to learn, you've broken the Discovery condition that Audit 3 documented).

**Show for ~4 seconds with a "Next" CTA, auto-dismissing if untouched.** Don't gate the next game on reading the card. A Player who blows past it has still seen the icon flash; a Player who pauses on it gets the full sentence and audio.

---

## Effort estimate

- **One icon per standard** — Leonardo-generated, ~5 min per standard, batch-generatable. For K.OA (5 standards) and 3.OA (9 standards) that's ~70 minutes of asset work to cover the v1 launch surfaces.
- **Plain-words sentences** — one per standard, ~5 min each to write and review. Reuse "what makes this idea matter" lines that Mr. Chesure's knowledge files already need.
- **The card component itself** — 1 day. Standard React + Framer Motion fade-in, audio playback via the existing Howler-based audio system.
- **Voice narration** — ElevenLabs or Play.ht per-sentence generation, ~30 sec per line.

**Ship icon + text first; add audio as fast-follow.** Audio without icons is worse than icons without audio, since icons survive a kid who has the sound muted (the school case where headphones aren't available).

---

## Risk: does this turn into a quiz?

It must not. Phrasing matters:
- ✅ "You put two groups of things together to find how many in all."
- ❌ "Did you just put two groups together?" (Quiz framing; activates Audit 4's undermining-effect risk profile.)

A Player who didn't actually learn the math should not feel called out by the card. The card narrates what the *game* was about, not what the Player did. If the Player didn't get it, the card is still informational, not accusatory.

---

## Cross-references

- Audit 3 — Discovery + SRT framework. The Discovery test (a learner who doesn't know the math can learn it by playing) is preserved here because the card fires AFTER play.
- Audit 4 — Token economy. Avoid quiz framing on the card; it would re-import the undermining-effect risk profile.
- Audit 10 — New build flow. Builder's Mr. Chesure brief already encodes the plain-words framing per standard; the Player card can reuse the same prose.

---

## Sources

- Hattie, J. (2009). *Visible Learning: A Synthesis of Over 800 Meta-Analyses Relating to Achievement.* Routledge. (Metacognitive strategies = large effect; near top of the effect-size rank table.)
- Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview. *Theory Into Practice*, 41(2), 64–70.
- Flavell, J. H. (1979). Metacognition and cognitive monitoring: A new area of cognitive-developmental inquiry. *American Psychologist*, 34(10), 906–911.
- Whitebread, D., Coltman, P., Pasternak, D. P., Sangster, C., Grau, V., Bingham, S., Almeqdad, Q., & Demetriou, D. (2009). The development of two observational tools for assessing metacognition and self-regulated learning in young children. *Metacognition and Learning*, 4(1), 63–85.
- Veenman, M. V. J., Van Hout-Wolters, B. H. A. M., & Afflerbach, P. (2006). Metacognition and learning: Conceptual and methodological considerations. *Metacognition and Learning*, 1(1), 3–14.

---

## Files referenced

- `c:/projects/math-games-builder/docs/superpowers/specs/2026-05-10-library-design.md`
- `c:/projects/math-games-builder/docs/product-positioning.md`
- `c:/projects/math-games-builder/docs/audit/03-discovery-srt-framework.md`
- `c:/projects/math-games-builder/docs/audit/04-token-economy.md`
- `c:/projects/math-games-builder/docs/audit/10-new-build-flow.md`
