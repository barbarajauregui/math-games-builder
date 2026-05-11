# Audit 24 — Player Reading Load Is Too High for 5–6 Year Olds

*Date: 2026-05-10 · Method: Review of the Star Atlas Library spec against reading-development milestones and child-UX research. Citations verified on ERIC and OpenAlex; the Fun Toolkit / Smileyometer line cross-checked against the canonical Read & MacFarlane paper.*

---

## Summary

The Star Atlas Library, as specified, is **a text-heavy interface for a target user group that includes pre-readers and beginning decoders.** Cards have text titles. Shelves have text section labels. Locked cards have text tooltips. The central atlas labels planets with text. The Builder's name on each card is text.

For an 8–10 year old this is fine. For a 5–6 year old at the bottom of the Player range it is a wall. A kindergartener at the start of the year cannot decode "Represent addition with objects" — they can't decode "Bakery Cupcakes" reliably either. They certainly cannot decode a tooltip that says "Locked — master K.CC.B.4b first."

This breaks the Player home for a meaningful fraction of the intended users — the youngest Players, exactly the kids the protégé loop most wants to reach.

The fix has three tiers. Tier 1 (icons-first, text secondary) is shippable in 1–2 weeks and unblocks the youngest users. Tier 2 (tap-to-hear narration on every card and badge) is the same effort range and is the load-bearing affordance for the K end of the range. Tier 3 (a picture-based atlas that doesn't require reading at all) is bigger work but is also the most-defensible version of the product.

---

## Why this matters (research backing)

**Kindergarteners are pre-readers at the start of the school year.** The five-stage stages-of-reading-development framework places kindergarten and very early grade 1 in the **pre-reading / emergent literacy** stage: children recognize logos, environmental print, and a small set of high-frequency words by shape, but cannot decode unfamiliar text. By the end of grade 1, most children have entered the initial-decoding stage (CVC words, common sight words). By grade 2 they can decode simple paragraphs slowly.

The National Reading Panel's 2000 synthesis confirms the same trajectory and emphasizes that **decoding is effortful well into grade 2** — even when a 7-year-old "can read" the words on a card, the cognitive cost of decoding leaves little working memory for the navigational task.

**Phases of word reading** research adds a useful distinction: early readers operate in a partial-alphabetic phase where they recognize some letters and guess at the rest from context. The implication for UI is direct: text that lacks contextual icons gives them nothing to guess from.

**Child-UX research is consistent.** Nielsen Norman Group's reports on UI for ages 3–12 recommend icon-first navigation, voice-led tutorials, and large hit targets for the K–2 segment. HCI-for-kids research (the Hourcade survey is the standard reference) emphasizes the same: icons survive non-reading; text doesn't.

**This isn't just about typical readers.** The same fix helps:
- **English Learners** — the K–4 Player range almost certainly includes children who hear a different language at home; icons + audio work across languages.
- **Learners with dyslexia** — roughly 1 in 10 children, often diagnosed late; text-heavy navigation excludes them silently.
- **Children with visual processing differences** — high-contrast iconography survives where small text fails.

In other words: solving for the kindergartener also solves for a much larger fraction of the K–4 audience than it might appear.

---

## What the spec currently asks the Player to read

Counted from the v2 spec:
- Card titles ("Bakery Cupcakes")
- Builder names ("by Maya")
- Shelf section labels ("Adding and taking away")
- Atlas planet labels (one per math cluster — 11+ text labels)
- Locked-card tooltips ("Locked — finish K.CC.B.4b to unlock")
- "Play now" / "Locked" rail headers
- Mastery dots ("3 of 9 to bloom")
- The audit-23 proposed "Thing you just learned" card (plain-words sentence)

That's eight distinct text surfaces. A K-end Player can decode at most one or two.

---

## Proposed UX — three tiers

### Tier 1: Icon-first card design (ships first)

Every card has an **icon as primary identifier**, text as secondary.

- **Game art** is the dominant element — the Leonardo-generated poster art the spec already calls for. Large. Center. The thing the Player taps.
- **Builder avatar** (the DiceBear cosmos-themed avatar already in the spec) is the secondary identifier, with the Builder's name beneath it in smaller text. Pre-readers recognize avatars; they don't decode names.
- **A standard icon** (one per CCSS standard — same icon set Audit 23 proposes) appears as a small badge on the card corner. Pre-readers learn the icon-to-idea association after 2–3 plays.
- **Shelf section labels** become icon-led — a row of standard icons across the shelf header, with text below at half-weight.

**Effort:** 3–5 days. Icon set generation is shared with Audit 23. Card component reflow is mechanical.

### Tier 2: Tap-to-hear narration on everything

A small speaker icon on every readable element. Tap → the warm Library narrator voice reads it aloud (~1–3 seconds).

- Card title → "Bakery Cupcakes by Maya."
- Locked card → "Locked. Finish counting to ten first."
- Atlas planet → "Adding and taking away."
- Mastery dot → "Three of nine to bloom this moon."

**Audio assets** generated via ElevenLabs or Play.ht — one warm consistent narrator across the whole Library, ~$50 of credits to cover v1 surface area, ~30 seconds of TTS per line.

**Implementation** sits on the existing Howler-based audio system already mounted in `src/app/layout.tsx`. The component pattern is a `<TapToHear text="..." audio="..." />` wrapper that's reusable across the spec's text surfaces.

**Effort:** 1 week, including audio generation, the wrapper component, and rolling it across the eight text surfaces listed above.

**Ship Tier 1 and Tier 2 together if at all possible.** Each is half the answer on its own; together they cover the full K-end of the Player range.

### Tier 3: Picture-based atlas (longer)

Replace the central star atlas's text planet labels with **illustrated planet portraits**. Each planet is recognizable by its art, not its name. Tap-to-hear remains for kids who want the name spoken.

This is the most-defensible version of the Library home because it makes the planet-bloom mastery state legible without reading at all: a Player sees their addition planet glowing green with forests, no labels required. It also strengthens the "world, not a website" north star — atlases in steampunk fiction are pictorial, not labeled grids.

**Effort:** 2–3 weeks. 11+ planet illustrations (Leonardo or a commissioned illustrator), atlas layout rework, and tap-to-hear integration. Schedule after Tier 1/2 land.

---

## What to ship first

1. **Tier 1 (icon-first cards) + Tier 2 (tap-to-hear)** — ship together as one block. Target: 1.5–2 weeks. Unblocks the K-end Player. Audit 23's "Thing you just learned" card piggybacks on the same icon set and narration infrastructure, so the marginal cost of that audit's fix becomes small.
2. **Tier 3 (picture atlas)** — schedule after Library v1 stabilizes. Treat as the visual polish pass once the foundation works.

---

## Risk: does heavy iconography make the Library look babyish for older Players?

Players go up to age 10. A 4th-grader with a stocked reading vocabulary will read the text without thinking and may register a card with prominent iconography as "for little kids."

Two mitigations:
- **Icons + text both present at default; text scales up with age.** A Player profile knows the kid's grade; the rendering can shift text emphasis upward for grades 2+ while keeping the icon system intact as a visual layer. Older kids read the text and see the icons as decoration; younger kids navigate by icons and hear the audio.
- **Voice narration is opt-in (tap the speaker), not automatic.** A 4th-grader never has to hear it; a kindergartener taps every card.

This is the same pattern Khan Academy Kids uses — icons + text + audio in the K-2 product, fading to text-led in the older Khan products.

---

## Cross-references

- Audit 23 — Player learning context invisible. Shares the standard-icon set and narration infrastructure.
- Audit 6 — Agent definitions (Mr. Chesure brief). Plain-words sentences per standard can be authored once and reused across the Builder brief, Audit 23's post-play card, and the audio narration here.

---

## Sources

- Chall, J. S. (1983). *Stages of Reading Development.* McGraw-Hill. (Five-stage framework; kindergarten = pre-reading / emergent literacy.)
- National Reading Panel. (2000). *Teaching Children to Read: An Evidence-Based Assessment of the Scientific Research Literature on Reading and Its Implications for Reading Instruction.* National Institute of Child Health and Human Development.
- Ehri, L. C. (2005). Learning to read words: Theory, findings, and issues. *Scientific Studies of Reading*, 9(2), 167–188.
- Hourcade, J. P. (2008). Interaction design and children. *Foundations and Trends in Human–Computer Interaction*, 1(4), 277–392.
- Nielsen Norman Group reports on children's UX (Nielsen 2010, Loranger & Nielsen 2013) — design recommendations for ages 3–12.

---

## Files referenced

- `c:/projects/math-games-builder/docs/superpowers/specs/2026-05-10-library-design.md`
- `c:/projects/math-games-builder/docs/audit/23-player-learning-context-invisible.md`
- `c:/projects/math-games-builder/src/app/layout.tsx` — existing audio system mount
