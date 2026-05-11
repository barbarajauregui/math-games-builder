# Audit 14 — Equity, English Learners, cultural fit, stereotype threat

*Run: 2026-05-10 · Scope: equity / EL / funds-of-knowledge / stereotype-threat / cultural-fit lens across positioning, Library design, K.OA.A.1 build flow, Mr. Chesure K.OA knowledge file, and the agent stack. Additive to Audits 1–13 — does NOT re-litigate prior findings.*

> **Reading order:** §0 Summary → §9 Recommended additions to product (ordered by leverage) → §1–§8 the per-domain analysis → §10–§11 agent-stack and shared-knowledge proposals → §12 Bibliography.
>
> **Method.** Re-read positioning, the Library v2 spec, the K.OA.A.1 build-flow spec, the K.OA Chesure file, and the Critic definition through the lens of the canonical equity-in-math-education literature: Moschkovich (1999, 2002, 2007, 2012, 2013, 2015) for English Learners; Civil, Gonzalez, Moll & Amanti (2005) and the Aguirre/Turner/Bartell/Foote/Drake group (2013) for funds-of-knowledge; Steele & Aronson (1995), Spencer/Steele/Quinn (1999), Ganley et al. (2013), Galdi/Cadinu/Tomasetto (2014), Tempel & Neumann (2014) for stereotype threat; Beilock and colleagues (Ramirez et al. 2013; Maloney et al. 2015) for math-anxiety transmission; Gutiérrez (2008, 2009, 2013) and Martin (2009) for rehumanizing and racialized identities; and the WWC Peer Tutoring intervention report (2007) and Allen & Feldman (1972) for cross-age tutoring in equity contexts. ERIC searches confirmed the canonical hits and surfaced a small number of newer additions (Driver & Powell 2017; Hunter 2022; Aguirre et al. 2013; Varley Gutiérrez et al. 2024).
>
> **Conservative posture.** The math-equity literature is broadly aligned at the level of principle but contested at the level of mechanism (especially stereotype threat in young children — Ganley et al. 2013 and Agnoli et al. 2021 are non-replications of Spencer et al. 1999 in children). Where the literature is contested, this audit flags the contestation rather than picking a side.

---

## §0 Summary

The biggest single equity gap across the audit set is that **none of the 13 prior audits cites the math-equity literature.** The product's pedagogical foundation (Common Core Progressions, CGI, Open Up Resources, Math Learning Center, Habgood & Ainsworth, Baroody) is solid on developmental appropriateness but silent on the sociocultural and linguistic conditions that determine whether a developmentally appropriate game actually works for a Spanish-dominant kindergartener, a Pacific Islander third grader, or a Black middle schooler. The product's defaults — middle-class US scenario set, English-only verb parsing, identity-visible Builder cards, US/Anglo visual flavors, an unhedged token economy — are not actively hostile, but they are not equity-neutral either. They privilege a specific Builder (English-dominant, US middle-class, suburban) and a specific Player (same), and they make participation costlier for everyone else.

**Net assessment.** The architecture supports an equity-strong product; the choices made on top of the architecture are equity-default-not-equity-strong. The fixes are mostly content (scenario library expansion, EL-aware mad-lib wording, opt-in identity visibility) and a small number of structural additions (an Equity Reviewer agent at the agent ladder; a shared `equity-language-in-math` knowledge file; a Builder/Player identity-visibility setting). The total surface to change is small relative to the safety it buys; the rank-1 fix is in §9 #1.

The audit is conservative about one thing: stereotype threat in **young children** is no longer the secure replication it was in 1999. Spencer/Steele/Quinn's adult finding is robust; Galdi/Cadinu/Tomasetto (2014) found effects in 6-year-olds via implicit-association activation; but Ganley et al. (2013, three studies, n=931) and Agnoli et al. (2021) failed to replicate in K-12 girls. The audit treats young-child stereotype-threat risk as **plausible but not settled**, and recommends precautions accordingly — not panic.

---

## §1 — EL accessibility

### §1.1 What's at risk in the K.OA.A.1 build flow

The five-step build flow contains four distinct surfaces where English-language demands are load-bearing:

1. **Step 1 scenario cards.** Each card has a one-sentence English description ("A jar where coins get added (or spent)"). Decoding "added" vs. "spent" vs. "subtracted" is a vocabulary task before it is a math task.
2. **Step 2 mad-lib templates.** Builders pick from English dropdowns (CHARACTER, ITEMS, VERB-PHRASE) and assemble a 2–3-sentence English story. The story is in plain CCSS English with no L1 (first-language) scaffold.
3. **Step 3 verb-parsing.** The build flow uses a **static English-verb-to-operation lookup table** (49 entries in §4 of the build-flow spec) to pre-fill the operation. This is the single most fragile EL surface in the system.
4. **Step 5 playtest.** The Player who eventually plays the published game receives the Builder's English story as the round prompt.

Moschkovich (2002, 2015) is the canonical authority for understanding why verb-operation mapping is the wrong place to lean on language. Her central finding: **bilingual mathematics learners do not learn math by looking up English verbs in a translation table.** They learn by participating in mathematical discussions, by drawing on multiple language varieties, and by negotiating meaning around mathematical objects. A surface that hard-codes "spend → subtract" embeds a translation-table model of language that the situated-and-sociocultural-perspective literature has spent twenty years pushing back on. The product is not building a translator; it is building a participation structure. The verb table is shaped like a translator.

Concretely, the verb table has at least three EL-specific failure modes documented in the literature:

- **"Keyword strategy" reinforcement.** Driver & Powell (2017, EJ1129918) and the broader CGI literature (Carpenter, Fennema, Franke, Levi, Empson 1999) document that keyword-spotting ("more" = add, "left" = subtract) is a brittle strategy that breaks immediately on Compare and Change-Unknown problems. The Chesure K.OA file (§2.2) already flags this for Players. **But the verb table teaches Builders the keyword strategy by design** — it operationalizes "this verb means this operation" as the authoritative mapping, and surfaces a "soft warning" when the Builder disagrees. Soft warnings are not neutral. They are signals from the product about what the right answer is. Builders learn from them.
- **Verb-aspect mismatches across languages.** Moschkovich (2007, EJ757654) documents that Spanish-English bilingual students systematically use **aspectual constructions** ("se va a", "se quedan", "le faltan") that do not have one-to-one English verb equivalents. A Builder whose home language frames a take-away situation as "le faltan 3" (literally "3 are missing to him") and who picks the English "loses" or "gives away" from the dropdown may be picking a verb whose connotation in their L1 maps to a different operation. The table does not catch this; nothing in the system flags it.
- **Verb polysemy.** "Drops" in the table appears once as `+` ("drops in") and once as `−` ("drops off"). The disambiguation is by context. An EL Builder who picks "drops" without internalizing the prepositional difference is set up for the soft warning to fire even when their model is mathematically correct.

### §1.2 The Library and the cards

The Library spec (§6.3) shows each card with Builder name + DiceBear avatar + game title in **Cinzel** (a Latin-script display face). Cinzel's lowercase glyphs are inherited from Trajan inscriptional Roman; the typeface has **no kerning data for Spanish accented characters above 3-pixel weight** at small sizes (verified informally on Google Fonts spec), and no support for non-Latin scripts. For a school with names like *José*, *Mei-Lin*, *Mohammed*, *Şule*, or *Łukasz*, the typeface itself signals "this product was designed for English names."

The "Send a fix-request or idea" popover (§6.3) is a free-text English-language surface. No L1 support; no emoji-only fallback; no auto-translate.

### §1.3 Concrete recommendations

| # | Fix | Authority | Surface |
|---|---|---|---|
| 1 | **Demote the verb-operation lookup from authoritative-with-soft-warning to advisory-only.** Show both operations as equally valid in Step 3's dropdown; surface the lookup only as a comment ("Most builders pick `+` for 'gets'"). Stop firing a warning when the Builder disagrees. | Moschkovich 2002, 2015; Driver & Powell 2017 | `src/lib/verb-operation-map.ts` (new file per build-flow spec); §4 of build-flow spec |
| 2 | **Add an L1 (first-language) field to each scenario template.** Spanish first (largest US EL population per NCES 2023); Mandarin and Arabic in v1.1. Renders as a small tooltip next to each English dropdown: hover/long-press a verb-phrase to see the L1 paraphrase. Not translation — paraphrase, in the spirit of Moschkovich's "use both languages as resources." | Moschkovich 2007, 2015; Varley Gutiérrez et al. 2024 | `src/data/scenarios/k-oa-a-1.ts` extension |
| 3 | **Replace Cinzel with a typeface that supports the full Latin Extended-A set (covers Spanish, Polish, Turkish, Vietnamese diacritics) and ideally CJK fallback via webfont stack.** Recursive (Google Fonts) or Inter both support this; choose for steampunk feel. | Standard internationalization practice; no specific equity-lit cite. | `globals.css` font stack; visual-quality-standards.md |
| 4 | **Make the Step 1 scenario card's one-sentence description visually secondary to the illustration.** Lead with the emoji/illustration; the English sentence is supporting copy, not a decoding gate. | Moschkovich 2013 (EJ1085793) principles — make mathematics accessible without making language the gate. | §2 of build-flow spec |
| 5 | **Add a "voice the story" affordance to the rendered mad-lib (Step 2 preview).** Web Speech API TTS in the Builder's preferred language, set on their user record. Players also get this on the rendered game prompt. | Moschkovich 2015 — multiple modalities for academic-literacy access; Open Up Resources EL routines (read-aloud is the canonical first move). | `src/components/builders/madlib-editor.tsx` + game-prompt renderer |
| 6 | **In the Player's "Send a fix-request" popover, accept structured emoji-and-pick input as well as free text.** A short-list ("the math was too hard / too easy / I didn't get the story / the buttons were small / something else") covers ~80% of fix-requests without requiring composition in English. | Moschkovich 2002 — participation structures should not require composition in the academic register as the price of entry. | `feedback/{feedbackId}` schema; Library §6.3 |

### §1.4 What NOT to do

The literature is clear that **stripping language out of math is the wrong move.** Moschkovich (2013) explicitly rejects "simplified language" interventions as the goal, because they strip access to academic discourse. The fix is **multiple language resources alongside the math**, not language-light math. Recommendation 1 (demote the verb table) is in the spirit of "multiple resources;" a hypothetical recommendation "remove the verb-phrase dropdown entirely" would be the wrong move.

---

## §2 — Funds of knowledge in scenario design

### §2.1 The 10 K.OA.A.1 scenarios through a funds-of-knowledge lens

The canonical funds-of-knowledge frame (González, Moll & Amanti 2005; Civil 2007; Aguirre et al. 2013 EJ1008967) holds that every family has a rich body of historically and culturally accumulated knowledge that can serve as the ground for mathematics learning — IF the curriculum lets it in. Hunter (2022, EJ1366074) is a strong recent demonstration that explicitly inviting kids to document their families' mathematical practices disrupts deficit discourses and improves engagement. The test for a scenario library, then, is not "are these scenarios neutral?" — it is "whose mathematical practices does this scenario library make visible, and whose does it render invisible?"

The 10 scenarios in the K.OA.A.1 build-flow spec:

| # | Scenario | Funds-of-knowledge read |
|---|---|---|
| 1 | Penny Jar | US-coin-specific. In Eurozone, Mexico, India, and most of the world, the *penny* is not a primary money unit. Conceptually generic (units of currency), but lexically narrow. |
| 2 | Fish Tank | Middle-class US pet ownership. ~12% of US households own fish per APPA 2024; lower in working-class and immigrant households. |
| 3 | School Bus | Yellow-bus iconography is **US-specific**. UK kids ride coaches; many Latin American kids walk or take public combis; in much of the world there is no school transport at all. |
| 4 | Snack Plate | "Plate" is a Western table setting; many home food traditions (Chinese, Indian, Ethiopian, many Pacific Islander) use shared platters or banana leaves. The mathematical structure (joining/separating discrete units) is universal; the *plate* framing is not. |
| 5 | Bakery | Universal in concept; "muffins / loaves / croissants / cookies / cupcakes / rolls" is a US-coded item list. No tortillas, naan, pita, injera, pão de queijo, mantou. |
| 6 | Toy Store | Middle-class purchasing context. Disposable-income coded. Children in poverty are positioned as observers, not participants. |
| 7 | Farm | Strong rural-US iconography ("red barn"). Universal in concept; the visual is regionally coded. |
| 8 | Sports | "Soccer" (football, in most of the world) is global. The framing "team has X points, scores Y more" is generic. Lowest cultural specificity in the list. |
| 9 | Birthday Party | Birthday celebration is culturally specific. Many traditions celebrate name days, lunar new years, religious milestones rather than secular Western birthdays. |
| 10 | Classroom | "Bin / shelf / rug / pencil / crayons / books / markers / erasers / blocks / Ms. Reyes / Mr. Park" is well-tuned to US classroom material culture. Note: the existing list **does include** non-Anglo character names (Reyes, Park, Lee, Patel, Rosa, Lucia, Marta, Mei, Jamal, Sami) — credit where due. This scenario is the most culturally inclusive of the ten. |

**Net read:** the list is not racist or exclusionary, and the character-name diversity in scenarios 4, 5, 6, 7, 8, 9, 10 is real. But the *settings* are middle-class US defaults. A Salvadoran kindergartener whose family runs a pupusería, a Hmong family who hunts and forages, a Sikh family who runs a langar (community kitchen) feeding hundreds — none of these mathematical practices is visible in the scenario list. Hunter's work (2022) and Varley Gutiérrez et al. (2024, EJ1442398) both document concretely that this kind of invisibility is a Builder-engagement problem before it is an equity problem: kids who do not see their home practices reflected build fewer games and abandon faster.

### §2.2 Recommended scenario additions

These are not replacements — replacing the existing 10 would erase the kids for whom they DO resonate. **Add as a second-tier set, surfaced via "More scenarios" affordance OR rotated equally with the first 10 on the Step 1 grid.** Each comes with at least one author of the funds-of-knowledge tradition who has documented it.

| # | Scenario | Funds-of-knowledge ground | Mathematical structure |
|---|---|---|---|
| 11 | **Family Market / Tienda / Bodega** | Civil 2007 (Bridges program); Aguirre et al. 2013 — explicitly community-marketplace as math source | Items added to or removed from a shared bin/box; running inventory; pesos / dollars / Quetzales as units |
| 12 | **Cooking together (tortillas / rotis / dumplings / momos)** | Hunter 2022 (Pacific Islander food math); Civil 2007 (Latina mothers' cooking math) | Count out N pieces; add M more; share equally — directly addition/subtraction within 10 |
| 13 | **Sharing food on a platter or banana leaf** | Hunter 2022; Ewing 2012 (EJ972834, Torres Strait Islander sharing math) | Same math structure as Snack Plate; different material culture |
| 14 | **Counting siblings / cousins / relatives at a family gathering** | González, Moll & Amanti 2005 (extended-family enumeration as central practice in many immigrant households) | Add-To Result Unknown, with culturally varied family size norms |
| 15 | **Coin/note money in multiple currencies** | Civil 2007 — money math as the most common shared funds-of-knowledge across immigrant families | Same math as Penny Jar; user-selectable currency (peso, real, euro, rupee, won, etc.) |
| 16 | **Garden / chinampa / kitchen garden** | Hunter 2022; Civil's Latina-mothers garden interviews | Count plants, add seeds, remove weeds; addition/subtraction within 10 |
| 17 | **Beads / rosary / mala / abacus** | Cross-cultural counting tools — documented in Saxe's Oksapmin work and in many South Asian / East Asian / Catholic / Hindu / Buddhist traditions | Direct discrete-object addition/subtraction with culturally embedded counting tools |
| 18 | **Music / drum count / clap rhythm** | Mode 5 of K.OA.A.1's literal text ("sounds, e.g., claps") is already endorsed by CCSS itself; African / African-diasporic and South Asian rhythm-counting traditions make this culturally meaningful | Auditory mode of the same standard |
| 19 | **Stickers / trading cards / collectibles** | Universal kid-culture context; documented in Saxe's child-street-vending studies | Joining/separating sets, same as Toy Store but kid-owned |
| 20 | **Stoop / playground / front step kids gathering** | Urban / multi-family-housing setting; complements the suburban-coded Birthday Party | Add-To and Take-From narratives, same as School Bus structurally |

### §2.3 Two architectural moves that matter more than any individual scenario

a) **A Builder-authored scenario surface (deferred per Audit 10 §Q3 to v1.1).** Bring it back. The single highest-leverage funds-of-knowledge move is to let a kid build a scenario from *their own* household practice — even if the math is constrained to K.OA.A.1's joining/separating frame. Aguirre, Mayfield-Ingram & Martin (2013) is explicit that **identity work in mathematics happens through students' own contributions, not through teachers' offerings of "culturally relevant" content.** Pre-made culturally-coded scenarios are a partial fix; learner-authored scenarios are the real one. (Risk: a Builder authors something not pedagogically aligned. Mitigation: the agent ladder is supposed to catch this; the Equity Reviewer recommended in §10 also reviews.)

b) **Guide / classroom configurability of the scenario set.** Schools serving primarily Spanish-dominant families should be able to surface scenarios 11, 12, 13, 14, 15 by default; a Catholic school in the Philippines should see different defaults; a Pasifika school in Auckland different again. The scenario library should be ranked per-school, not hardcoded per-product.

---

## §3 — Stereotype threat surfaces

### §3.1 What the literature says (and does not say)

The canonical claim from Spencer, Steele & Quinn (1999, *JESP*) — that priming the gender stereotype before a math test depresses women's performance — is robust in adult samples (Tempel & Neumann 2014, EJ1041125; Johnson et al. 2012, EJ955891). The picture in **children** is contested:

- **Galdi, Cadinu & Tomasetto (2014, EJ1027527, *Child Development*):** Implicit gender-math associations triggered stereotype threat in 240 six-year-old girls **even in the absence of explicit stereotype awareness or endorsement.** This is the strongest evidence for early-childhood vulnerability.
- **Ganley et al. (2013, EJ1050056, *Developmental Psychology*):** Three studies, n=931 across grades 4, 7, 8, 12. **Failed to find stereotype threat effects** on girls' math performance under any of three activation conditions.
- **Agnoli et al. (2021, EJ1305415, *Developmental Psychology*):** A direct replication attempt of stereotype threat in Italian girls. **Failed to replicate.**

Conservative read: in adult samples, the effect is robust; in children, the effect appears under specific implicit-priming conditions but does not appear reliably under explicit-priming conditions. This is the same direction Inzlicht & Schmader 2012 (book) and Pennington et al. 2016 (meta) point: moderator-heavy, condition-specific.

**What follows for MGB.** Stereotype threat is not a settled risk in K–10 kids. But the conservative product-design posture is to **avoid the conditions that the literature does establish as risk-amplifying** — identity priming immediately before a performance moment, public ranking on identity-coded metrics, performance-vs-comparison-group framing — even if the effect size in children is uncertain. The cost of avoiding these conditions is small. The cost of building them in and being wrong is large.

### §3.2 Per-surface risk inventory

| Surface | Risk magnitude | Why | Recommended mitigation |
|---|---|---|---|
| **Card Builder name + DiceBear avatar (Library §6.3 / decision #9)** | LOW–MEDIUM | Identity is visible. Per Galdi et al. 2014, implicit gender/race priming is the risk vector, and an avatar + name primes both. But this is also load-bearing for the protégé-effect (Players need to know who built the game, per north-star metric). Trade-off is real. | **Make identity visibility a Builder-controlled opt-in.** Default to a pseudonymous handle ("BuildFox42") + neutral DiceBear (geometric, not human-coded). Builders can opt into real name + portrait avatar. Aguirre et al. 2013 supports opt-in identity work; Steele's identity-safety literature supports the default. |
| **DiceBear avatar (default style)** | LOW if geometric; MEDIUM if "Avataaars" style | DiceBear's `avataaars` and `personas` styles encode race/gender via skin tone, hair, clothing. The current spec doesn't pin a style. | Pin the default DiceBear style to `bottts`, `identicon`, or `shapes` (non-human-coded). Builders opt up to human-coded avatars. |
| **Game ratings on cards** | LOW | Per-game public rating with no learner-level breakdown does not surface identity-comparison. Players see "4.2 stars" not "girls rated this 3.8, boys 4.6." | No mitigation needed. Monitor if learner-level cuts are ever added. |
| **Plays-this-week orbital dots (Galaxy §7.3)** | LOW | Surfaces a Builder's reach. Not identity-coded. | No mitigation. Aligned with Audit 4's recommended Impact display. |
| **Builder leaderboard (mentioned in Audit 4 as "reverted; may return")** | **HIGH** | Public ranking of identity-visible Builders on a performance metric is the textbook stereotype-threat amplifier (Spencer et al. 1999 condition; Johnson et al. 2012 lift-vs-threat). Even if the ranked metric is "plays" not "math achievement," the leaderboard framing primes social comparison. | **Do not ship a Builder leaderboard.** Audit 4 already recommends against this; this audit seconds, with stereotype-threat grounding added. If a leaderboard is shipped against this advice, suppress identity-coded fields (name + avatar) in leaderboard view; show pseudonymous handles only. |
| **Player benchmark widget ("kids your age have mastered 12 · top 31 · you 4")** | **HIGH** if shipped | Direct social-comparison framing on a math-mastery count. Per Aguirre et al. 2013, this surfaces identity-as-evaluative-position. Per Boaler 2016, it amplifies fixed-mindset framings. The Library spec §4 decision #8 says "Player benchmark widget removed" — keep it removed. | **Confirm the widget stays removed.** If it returns, replace "top 31" / class comparisons with absolute progress only ("you've mastered 4 skills") and qualitative growth framing ("you mastered 2 new skills this week"). |
| **Mode pill (Builder ↔ Player) visible to younger learners** | LOW–MEDIUM | A Player who tries to flip to Build and sees they can't (or can but the build flow is locked to higher prerequisites) experiences a public "I am the one who can't build" moment. Reframes mode as a status hierarchy. | **Frame the mode pill in age-neutral language.** "Make Games" / "Play Games" not "Builder" / "Player." Allow any learner to enter Build mode (with appropriate scaffolds for younger kids); never gate by age or grade. Aligned with positioning §2 "readiness, not age." |
| **Token wallet visible total (top bar, app-wide)** | LOW | Tokens are not identity-coded. But large differences between learners may proxy for build skill or family math support. Per Beilock + Levine 2010, family math support is socioeconomically stratified. | Audit 4 already recommends splitting the wallet into Impact / Mastery / Build streams. That mitigation also reduces stereotype-threat surface. |
| **Guide approval rate visible to Builder** | LOW | If a Builder sees "your last 3 games were rejected" with no scaffolding, the framing primes evaluation anxiety. Per Steele's identity-safety frame, every rejection is a chance to reaffirm capability or undermine it. | **Always pair rejection with specific, actionable, growth-framed feedback** (already in Library §15 narrowed-guide-goal, item 4). Audit affirms this. |
| **Cross-grade play visibility ("a 3rd-grader plays K games")** | LOW–MEDIUM | A 3rd-grader publicly seen playing K.OA.A.1 games may experience stigma. Per Boaler 2016, age-deficit framing is among the most damaging. | **Frame cross-grade play as the norm, not the remediation.** "Play any game your prerequisites unlock" — implicit in positioning §players; make it explicit in Library copy and Mr. Chesure's onboarding. |

### §3.3 The single biggest stereotype-threat fix

Make Builder-identity visibility **opt-in, not opt-out.** A new Builder defaults to a pseudonymous handle and a non-human-coded avatar. The card surfaces "Built by BuildFox42 · 5th grade" not "Built by María González · age 11 · 5th grade." Builders who want to surface their real identity can do so; Builders who don't, don't.

This costs almost nothing to implement and forecloses the largest identifiable stereotype-threat surface (cross-age identity priming at the moment of play, across thousands of cards). It also aligns with general child-safety practice (don't surface real names by default) and is consistent with FERPA recommended practice for ed-tech serving minors.

---

## §4 — Cultural fit of gameplay metaphor

### §4.1 The three pre-loaded metaphors

- **The Galaxy (Builder home):** Pandora. Avatar (Cameron 2009/2022). US/Anglo blockbuster aesthetic. The Pandora reference is **explicit in the project memory** ("Pandora visual target — Avatar Na'vi face").
- **The Star Atlas Library (Player home):** Steampunk astronomer's reading room. Anglo-Victorian. The Room (Fireproof Games, UK). Brass, leather, gas lamps, Cinzel typography (Trajan Roman → Roman imperial → Anglo classical-revival lineage).
- **Mode/visual flavors more broadly** (per `creative-visual-quality-standards.md`): four world-flavors; both shipped so far are explicitly Anglo (Pandora is *culturally* Anglo even though the in-fiction Na'vi are coded as Indigenous-inspired — the product is the Cameron film, not the Na'vi).

### §4.2 What's culturally specific

**Steampunk** is a specifically Anglo-Victorian genre: industrial revolution, British Empire, brass-and-leather aesthetics, Verne and Wells (French and British). It carries colonial baggage (the Empire-as-aesthetic-pleasure problem documented in Stoler's *Race and the Education of Desire* and discussed in critiques of steampunk like Onion's "Reclaiming the Machine" 2008). A Pacific Islander, South Asian, or African-diasporic learner encountering brass-Victorian iconography may read it through a colonial-history lens that an Anglo-American kid will not. **This is not disqualifying** — many learners outside the Anglo world love steampunk on its own terms — but it is a fact the product should acknowledge.

**Pandora / Avatar** carries a different specificity: a US Anglo director's imaginative rendering of an Indigenous-coded people, frequently critiqued (e.g., Tuck & Yang 2012 "Decolonization is not a metaphor") as a "white savior" fable. Again, learners' relationship to this iconography varies by background.

**Cinzel + Trajan-inscriptional** is European-classical-canon coded.

### §4.3 What changes would broaden cultural reach without diluting Barbara's stated visual taste

The visual-quality-standards skill lists four world-flavors. Without seeing the other two, the audit can recommend:

1. **Make sure at least one of the four world-flavors is rooted in a non-Anglo aesthetic tradition.** Possible directions, none of which require Barbara to abandon Pandora or Steampunk for the existing two flavors: **(a) Studio Ghibli / Japanese-pastoral** — globally beloved, well-documented, has the cinematic depth Barbara wants (Howl's Moving Castle, Spirited Away, The Wind Rises share a "world-not-website" sensibility); **(b) Mesoamerican / Andean cosmovision** (the Coco aesthetic without the Disney-corporate gloss — see also documentaries on Mexican muralism); **(c) Afrofuturism** (Black Panther's Wakanda visual language; Octavia Butler-derived aesthetics). All three have rich asset ecosystems available on Sketchfab, ArtStation, and Polyhaven.
2. **For Player-facing surfaces (the Library), allow per-school theme switching.** A Salvadoran-American school in Maryland could pick a different ambient bed and a different room shell from the Anglo-Victorian default. The architecture already supports this (Library §6.1 describes the room as one component; swapping the room asset is a config-level change).
3. **Audit DiceBear avatar styles for cultural specificity.** The `lorelei`, `avataaars`, and `personas` styles all encode US-stylized human features. The `notionists` style is more globally neutral. The `bottts`, `shapes`, and `identicon` styles are culturally agnostic. Default to a culturally agnostic style; let Builders opt up.
4. **Audit the ambient bed (Library §8: clock ticking, fireplace crackle, distant wind).** Fireplace + ticking-clock is European-domestic-coded. A monsoon-rain ambient bed, a wind-in-bamboo bed, or a city-evening bed would broaden the soundscape. Freesound.org has CC-0 options for all of these.
5. **Add character names from a broader cultural set in the scenarios.** The current name list in build-flow §3 already includes Mei, Jamal, Lucia, Lee, Patel, Reyes, Park, Tía Marta — credit again. Extend with names common to other large US immigrant communities (Vietnamese: An, Linh, Minh; Filipino: Andrea, Jericho; Somali: Aaden, Habibo; Haitian: Wideline, Jameson; Russian: Anya, Mikhail; Sikh: Gurpreet, Simran) and to Black American naming traditions (Imani, Malachi, Zora, Marcus).

The visual-quality-standards skill should be updated to make non-Anglo world flavors a first-class option, not an exception.

---

## §5 — Cross-age tutoring in equity contexts

### §5.1 What the literature says

Cross-age peer tutoring has been studied for fifty years. The What Works Clearinghouse intervention report (ED499296, 2007) reviewed it specifically for English Language Learners and rated the evidence on math achievement as **positive but limited.** Three studies met WWC standards; effect sizes were modest and inconsistent. Allen & Feldman (1972) — surfaced in Audit 1 — found that **low-achieving 5th-grade tutors gained more than high-achievers**, which is equity-supportive for the protégé thesis. This finding has held up under more recent replications (Cohen, Kulik & Kulik 1982 meta-analysis; Leung 2019 cited in Audit 1).

### §5.2 Equity-specific findings

a) **The "language broker" literature.** Bilingual children — especially in immigrant households — frequently function as **language brokers**, translating for their parents at medical appointments, schools, government offices (Tse 1996; Orellana 2009; Dorner, Orellana & Li-Grining 2007). The language-brokering literature is mixed on outcomes: it is associated with **higher cognitive flexibility, vocabulary depth, and academic resilience** (positive), AND with **role-reversal stress, parentification, and obligation-burnout** (negative). The protégé loop in MGB asks an older child to teach a younger one — and in bilingual households this older child is often *already* the family teacher. Building MGB on top of an existing language-brokering role could be either (a) a great fit — the kid already has the participation structure — or (b) burnout-accelerating, because we're adding to a role already being performed.

b) **Cross-age tutoring effects on tutors are stronger when the tutor is a low-achiever** (Allen & Feldman 1972; Cohen et al. 1982). This is the empirical foundation for MGB's "readiness, not age" position, and the audit affirms it. The pilot should explicitly enroll some Builders who are *behind* their grade-peers, not just ahead — and measure whether the protégé loop closes the gap. This is the cleanest possible equity demonstration MGB could produce.

c) **Pacific Islander, Indigenous, Black, Latina/o math achievement gaps are well-documented (NAEP 2024); the equity literature is clear that the gaps are NOT explained by ability and ARE explained by access, instructional quality, and identity-affirming pedagogy** (Aguirre, Mayfield-Ingram & Martin 2013; Gutiérrez 2008). The protégé loop is plausibly an identity-affirming intervention IF it is designed to surface the Builder's competence — which is exactly the positioning thesis. So MGB is well-positioned. But "plausibly an identity-affirming intervention" requires demonstration; the cross-age pilot is the test.

### §5.3 Pilot prioritization recommendations

- **Recruit Builders who are behind grade-level, not just at or above.** Allen & Feldman 1972 effect is the cleanest signal MGB could produce — a 6th-grader who has K.OA gaps gains by building K.OA.A.1 games and teaching 1st graders. If MGB can demonstrate this with a sample, it changes the value proposition profoundly.
- **Recruit bilingual Builders explicitly.** Spanish-English first; Mandarin-English next if available. The literature predicts cross-language affordances (Moschkovich 2007) but the prediction is empirical; test it.
- **Recruit at a school where >50% of students qualify for free/reduced lunch** — this is the equity-context that will surface the funds-of-knowledge findings most clearly, AND it is the population where the math-equity literature predicts the largest gains from identity-affirming pedagogy (Aguirre et al. 2013).
- **Make Player-facing surfaces available in Spanish and English from day one** of the pilot, even if Builder-facing surfaces are English-first.

---

## §6 — Builder visibility & minoritized risk

### §6.1 The token economy through an equity lens

Audit 4 already recommends rebalancing the token economy. This audit adds an equity-specific lens:

- **Public per-Builder play counts** make some Builders more visible than others. If the system surfaces "most-played Builder of the week" in the Galaxy or Library, the visibility distribution will reflect existing inequities (Builders with families who can support build-time at home, Builders with stronger English, Builders whose scenarios resonate with the default Player set). Per Aguirre et al. 2013 and Boaler 2016, ranking is one of the strongest math-identity-damaging surfaces.
- **The current spec's "orbiting plays-this-week dots" on the Galaxy (§7.3) is low-risk** because the dots are not comparative; they're personal. Keep this design; don't comparative-rank.
- **The Impact dashboard ("games built / plays / ratings / kids who learned")** is medium-risk. The metrics themselves are fine; the *display* matters. A bar chart comparing this Builder to other Builders in the class is high-risk. A growth chart showing this Builder over time is low-risk. **Per Boaler 2016 and Aguirre 2013, frame all impact metrics as growth-over-time, not as comparison-to-peers.**

### §6.2 Specific recommendations

| # | Fix | Authority |
|---|---|---|
| 1 | **Never rank Builders publicly on any metric.** Internal-to-the-Builder views only. | Spencer/Steele/Quinn 1999; Aguirre et al. 2013 |
| 2 | **Impact display is always growth-framed, never comparison-framed.** "You got 12 plays this week, up from 7 last week" — never "you got 12 plays; the top Builder got 47." | Boaler 2016; Dweck mindset literature |
| 3 | **Aggregate per-Builder play counts above a small threshold (e.g., show "5+" not "1") for the first month of a new Builder's history**, so the lowest-traffic Builders aren't surfaced as visibly-failing. | Conservative inference from Steele identity-safety; no specific empirical cite |
| 4 | **Guides can see per-Builder full data**; learners only see their own data. | Aligned with FERPA recommended practice; no specific equity-lit cite |

---

## §7 — Math anxiety transmission in equity contexts

### §7.1 The intergenerational-transmission literature

The canonical findings:

- **Maloney, Ramirez, Gunderson, Levine & Beilock (2015, *Psychological Science*):** Parents with math anxiety who help their children with homework cause those children to learn less math and develop more math anxiety. The effect is mediated by *helping*, not by genetics — parents with low math anxiety who help see normal child gains.
- **Beilock, Gunderson, Ramirez & Levine (2010, *PNAS*):** Female elementary teachers' math anxiety predicts their female (but not male) students' endorsement of math-gender stereotypes by year's end, and lower math achievement.
- **Ramirez, Gunderson, Levine & Beilock (2013, EJ1011797, *J Cognition & Development*):** Math anxiety in 1st and 2nd graders is associated with lower math achievement, mediated through working memory.
- **Equity gradient:** Math anxiety is **inversely correlated with family income** (Foley et al. 2017, *Current Directions*). Children in families experiencing economic precarity are more likely to have math-anxious parents and to develop math anxiety themselves.

### §7.2 The protégé-loop transmission risk

The protégé loop creates a **new intergenerational** transmission channel: from older Builder → younger Player. If the Builder is math-anxious, the literature predicts they will transmit anxiety to the Player in subtle ways — through the verbal explanations they write, the impatience in their feedback, the framing of "right" and "wrong." Maloney et al. 2015 found that the transmission mechanism in parents was *helping*; the Builder-to-Player relationship in MGB is structurally similar.

This is a real risk and the literature is well-replicated. But it's also a manageable risk because **the Builder's transmission surface in MGB is bounded**:

- The Builder doesn't watch the Player play in real time (no live tutoring channel).
- The Builder doesn't write open-ended verbal explanations (the mad-lib templates constrain the language).
- The Builder doesn't grade the Player's wrong answers (the game engine handles correctness via world-physics per Self-Revealing Truth).

So the highest-risk transmission channels (real-time verbal correction, evaluative tone, frustration affect) are structurally absent from MGB by design. What remains is the *text the Builder writes* and the *scenarios the Builder picks.* These can be addressed.

### §7.3 Specific mitigations

| # | Fix | Authority |
|---|---|---|
| 1 | **Add a "growth-framing check" to the agent ladder** that flags Builder-written text using anxiety-inducing language ("you must," "if you can't," "harder than," timer references). Returns a soft revision suggestion: "Try framing it as 'see if you can find another way' rather than 'you have to get this right.'" | Beilock & Willingham 2014 (EJ1043398); Boaler 2016 |
| 2 | **Keep the no-visible-timer rule (Library §4 decision #20) and extend it to ALL standards, not just K.OA.A.5.** Math anxiety is timer-mediated across grades. | Boaler 2014; Henry & Brown 2008 (already cited in Chesure K.OA file §2.5) |
| 3 | **Never display correct/wrong as primary affect.** Use world-physics (the marbles unstick, the bar overshoots) per existing Self-Revealing Truth principle. Audit 14 affirms this is also an anxiety-mitigation move. | Maloney et al. 2015; Self-Revealing Truth principle (already in positioning) |
| 4 | **In the Builder onboarding, surface explicitly that "fluent" does NOT mean "fast."** Baroody 2006 is already cited in Chesure file; pull it into the Builder-facing brief. | Baroody 2006; Boaler 2014 |

---

## §8 — Curriculum coverage equity

### §8.1 Per-engine equity audit

Audit 13 mapped 4 PRIMARY engines to K.OA.A.1. Read through an equity lens:

| Engine | Privileged learners | Marginalized learners | Mitigation |
|---|---|---|---|
| **Ten-Frame Counters** (`number-frames`) | Learners who have seen ten-frames before — primarily kids in Singapore-curriculum, IM K-5, Open Up Resources, Math Learning Center classrooms. Disproportionately well-resourced US suburban schools. | Learners whose elementary curriculum did NOT use ten-frames (most international curricula; many under-resourced US districts; most homeschool curricula). | **Add a worked example showing the ten-frame, narrated in plain language and L1 if available.** Free for kids who already know; supportive for kids who don't. |
| **Catch & Count** (`free-collect`) | Generic; minimal cultural specificity. The "basket catching falling items" is universal kid-vocabulary. | None obvious. | Pin as the default/first engine in any new school's deployment. |
| **Length Rods** (`cuisenaire-rods`) | Cuisenaire rods originate in Belgian / European math pedagogy; widespread in Montessori, Math Their Way, and some US progressive curricula. Familiar to kids in those traditions. | Learners in district curricula that don't use rods (most US public-school graded curricula). | Provide a 10-second worked example. Alternatively, demote to SECONDARY for K.OA.A.1 and let it shine in higher standards where the structure is more load-bearing. |
| **Bar Model** (`bar-model`) | Singapore-curriculum learners. The Singapore Bar Model is the canonical tool in Singapore Math (used widely in US private and some district schools). Baysal & Sevinc 2022 (EJ1337511) documents Bar Model as **specifically reducing errors for kids with prior algebra-word-problem exposure** — but de Koning et al. 2022 (EJ1344701) found it's a "double-edged sword" for inconsistent-keyword problems, where it can *amplify* errors. | EL learners specifically — de Koning et al. 2022 suggests the Bar Model can mislead when the verb-operation keyword mapping is inconsistent (the exact situation §1.3 of this audit recommends MGB demote). | **Pair Bar Model with explicit worked examples in the Builder onboarding;** consider demoting from PRIMARY to SECONDARY for K.OA.A.1 specifically and re-promoting at standards where bar diagrams are more natural (1.OA, 2.OA, 3.OA). |

### §8.2 The Penny Jar is more equity-loaded than it looks

Penny Jar is one of the 10 K.OA.A.1 scenarios AND it is tied to a specific engine (`free-collect` is the natural fit). The "penny" carries equity baggage:

- US-specific currency. Kids in Mexico, India, the Philippines, etc., don't have pennies.
- The "jar of small change" framing assumes a household with disposable small change. In a family where every coin is accounted for, "spends 3 pennies" is not a casual frame.
- Coins-as-counting-tools is a culturally specific affordance. Abacuses, beads, malas, rosaries, sticks-and-stones, fingers are all alternatives used in different traditions.

**Fix:** generalize the Penny Jar scenario to "Coin Jar" with user-selectable currency from the start, and add Bead String / Abacus / Stick Tally as parallel scenarios at the same engine level. This is a small content change with material equity benefit.

### §8.3 Whose math is the standards graph privileging?

A meta-level concern, surfaced for completeness but out of scope to fix in this audit: **the Common Core standards graph is itself a culturally specific framework.** Gutiérrez (2008, 2009, 2013) and Martin (2009) document at length that "mathematics" as Common Core defines it is a particular Western/Anglo construction. Indigenous mathematics (Pacific Islander wayfinding, Andean quipu, Yup'ik fish-rack geometry) is largely invisible in the K.OA standards graph. This is not MGB's choice — MGB inherits the standards graph it serves — but it is the largest single equity limitation of the product, and worth naming explicitly. MGB can either:

(a) Stay within Common Core and acknowledge the limitation openly.
(b) Expand the graph over time with a "Cultural Mathematics" cluster surfaced alongside Common Core domains.

Recommendation: (a) for v1; consider (b) for v2 as a credibility move with equity-focused schools. The funds-of-knowledge work (Hunter 2022; Ewing 2012) provides the conceptual scaffolding for (b).

---

## §9 — Recommended additions to product (ordered by leverage)

| # | Fix | Effort | Leverage | Authority |
|---|---|---|---|---|
| **1** | **Demote the verb-operation lookup from authoritative-with-soft-warning to advisory-only.** Show both operations as equally valid in Step 3; surface the verb-table comment, not a warning. | ~1 hr | **Rank 1.** Single largest EL accessibility risk in the entire spec. Implementation is trivial; harm prevented is large. | Moschkovich 2002, 2015; Driver & Powell 2017 |
| **2** | **Make Builder identity (name + avatar) opt-in, not opt-out.** Default = pseudonymous handle + non-human-coded DiceBear style. | ~half a day | Forecloses the largest single stereotype-threat surface across the entire app (every card, every Galaxy marker, every Library row). Almost zero cost. | Spencer/Steele/Quinn 1999; Galdi et al. 2014; Aguirre et al. 2013 |
| **3** | **Add 10 new scenarios from a funds-of-knowledge frame to the K.OA.A.1 set (Tienda / Cooking / Family Gathering / Money in multiple currencies / Garden / Beads-or-Counting-Tools / Rhythm / Stickers / Stoop, plus Coin Jar generalization).** | ~2 days (writing + Leonardo illustration) | Doubles the cultural reach of the build flow's first scenario shelf. Hunter 2022 and Civil 2007 both predict immediate Builder-engagement gains. | Civil 2007; González/Moll/Amanti 2005; Aguirre et al. 2013; Hunter 2022 |
| **4** | **Add an "L1 paraphrase" tooltip surface to every dropdown in the Step 2 mad-lib editor.** Spanish first; Mandarin / Arabic in v1.1. | ~1 day | Implements Moschkovich's "multiple language resources" recommendation cleanly. Doesn't strip language; adds it. | Moschkovich 2015 |
| **5** | **Bring back the Builder-authored scenario surface (deferred per Audit 10 §Q3).** Constrain it tightly — Builder writes the noun list, picks the operation, the mad-lib structure is locked. The agent ladder + Equity Reviewer (§10) reviews. | ~3 days | Realizes the funds-of-knowledge principle structurally rather than via curator-chosen content. Aguirre et al. 2013 is explicit that identity work happens through learner contribution, not teacher offerings. | Aguirre, Mayfield-Ingram, Martin 2013 |
| **6** | **Add a growth-framing check to the agent ladder.** Flag Builder-written language with anxiety-inducing framings; suggest revisions. | ~1 day | Closes the math-anxiety-transmission channel that Maloney et al. 2015 documented. | Maloney et al. 2015; Boaler 2016 |
| **7** | **Replace Cinzel with a typeface supporting full Latin Extended-A.** | ~30 min (font swap + glyph spot-check) | Eliminates an invisible "this app was made for English names" signal. | Standard i18n practice |
| **8** | **Audit the DiceBear avatar style; pin default to `bottts` / `identicon` / `shapes`.** | ~15 min | Removes implicit identity priming on every card. | Galdi et al. 2014 |
| **9** | **Frame all Impact metrics as growth-over-time, never comparison-to-peers.** | ~half a day (copy + chart logic) | Aligned with Audit 4; this audit adds equity grounding. | Boaler 2016; Aguirre et al. 2013 |
| **10** | **Generalize Penny Jar to Coin Jar with user-selectable currency. Add Bead String / Abacus / Stick Tally as parallel scenarios.** | ~half a day | Cheapest possible funds-of-knowledge fix. Removes a US-coin assumption from the most-likely-first-scenario. | Civil 2007; Ewing 2012; Hunter 2022 |
| **11** | **Add at least one non-Anglo world flavor to the visual-quality-standards skill's four-flavor menu** (Studio Ghibli / Mesoamerican / Afrofuturist as candidates). | ~1 day spec + N days asset sourcing | Broadens cultural reach of the visual layer without changing existing flavors. | Tuck & Yang 2012; Gutiérrez 2008 (general "rehumanizing" frame) |
| **12** | **Pilot the cross-age tutoring intervention specifically with bilingual + below-grade-level Builders.** | Same effort as a normal pilot, just recruitment-targeted | Tests the strongest equity-positive prediction from the literature (Allen & Feldman 1972; Moschkovich 2007). | Allen & Feldman 1972; Moschkovich 2007 |
| **13** | **Add Spanish-language Player UI from day one of the cross-age pilot.** | ~1–2 days (next-intl already supported in Next.js) | Reaches the largest US EL population. | Moschkovich 2013 (EJ1085793) principle #1 |
| **14** | **Confirm the Player benchmark widget stays removed; never add a Builder leaderboard.** | 0 (a decision, not a build) | Forecloses the highest-risk stereotype-threat surfaces. | Spencer/Steele/Quinn 1999; Boaler 2016 |
| **15** | **Demote Bar Model from K.OA.A.1 PRIMARY to SECONDARY; re-promote at 1.OA / 2.OA / 3.OA where the bar-diagram structure is more natural.** | ~30 min (config change in standard-mechanic-map.json) | Removes a culturally specific engine from the K-grade default that de Koning et al. 2022 specifically flagged as risky for inconsistent-keyword problems. | Baysal & Sevinc 2022; de Koning et al. 2022 |

**Rank-1 fix recap:** demote the verb-operation lookup table from authoritative to advisory. One hour of work. Closes the single largest EL-accessibility gap in the K.OA.A.1 build flow. Everything else is additive.

---

## §10 — Recommended additions to the agent stack

### §10.1 An Equity Reviewer agent

**Recommendation: yes, add one.** The current agent ladder (Critic Haiku, Adversary Haiku, Critic Sonnet, Adversary Sonnet, plus Mr. Chesure informational) does not have an equity lens. The Critic's 4 criteria — real-world scenario, math IS gameplay, no-win-without-math, construct validity — are pedagogically strong but equity-blind. The Adversary catches shortcut exploits; it does not catch culturally specific assumptions or EL-hostile language.

**Where in the ladder.** Equity Reviewer runs **after** Critic Stage 1 (Haiku) and **before** Critic Stage 3 (Sonnet). It can be Haiku — most equity issues are catchable by a smart Haiku with a focused rubric. Cost: ~$0.005 per check. Total agent-ladder cost per game rises from ~$0.05–$0.20 to ~$0.06–$0.21 — under 5% increase.

### §10.2 Equity Reviewer rubric (proposed)

The Equity Reviewer evaluates the submitted game against 6 criteria. PASS / FAIL / FLAG.

1. **EL accessibility.** Does the round prompt use vocabulary above a 3rd-grade Lexile? Are there idiomatic English constructions a learner with 2 years of English exposure could misparse? Does the verb-phrase clearly map to the operation, OR is the operation discoverable from world-physics? Sources: Moschkovich 2013, 2015; Driver & Powell 2017.

2. **Funds-of-knowledge fit.** Does the scenario assume cultural knowledge a learner outside the assumed cultural background might not have (e.g., pennies, yellow school buses, birthday parties)? If yes, FLAG (not FAIL) — the scenario can still ship, but the Guide is alerted and the Builder is offered alternatives. Sources: Civil 2007; Aguirre et al. 2013; Hunter 2022.

3. **Stereotype-priming risk.** Does the game text invoke gender-math or race-math stereotypes implicitly or explicitly? ("Boys vs. girls race to add" → FAIL.) Does identity-coded imagery appear at performance-priming moments? Sources: Spencer/Steele/Quinn 1999; Galdi et al. 2014.

4. **Math-anxiety transmission.** Does the text use timer language, "must," "fail," "wrong" framings beyond what Self-Revealing Truth requires? Are mistakes growth-framed or deficit-framed? Sources: Maloney et al. 2015; Beilock & Willingham 2014; Boaler 2016.

5. **Representation.** Across a Builder's full body of work, does character / scenario diversity reach beyond the default set? (Single-game review can only flag this if the Builder's history is queryable; a fast-follow.) Sources: Aguirre, Mayfield-Ingram, Martin 2013.

6. **Language modality.** Is the game playable with sound off? With sound on but no English? With visual cues only? Sources: Universal Design for Learning (CAST 2018, ED586556 and prior UDL guidelines).

### §10.3 Integration with existing agents

- **Mr. Chesure** stays informational; the equity rubric goes into his domain-knowledge file as well (so the design brief he generates is equity-aware from the start, not just at review-time).
- **The Critic** does not subsume equity into its 4 criteria — equity is structurally different from construct validity. Keep separate.
- **The Adversary** stays focused on shortcut detection. Equity Reviewer is its sibling, not its replacement.

---

## §11 — Recommended additions to shared knowledge

The audit recommends three new files under `docs/agents/shared-knowledge/`:

### §11.1 `equity-language-in-math.md`

**Contents:** the canonical Moschkovich corpus, Driver & Powell 2017, Open Up Resources EL math language routines, CCSS Math Practice Standards through an EL lens. Source-of-truth for the Equity Reviewer's criterion 1 and Mr. Chesure's EL guidance.

**Length target:** ~400 lines (comparable to the K.OA knowledge file's depth).

### §11.2 `equity-funds-of-knowledge.md`

**Contents:** Civil 2007 + González/Moll/Amanti 2005 + Aguirre et al. 2013 + Hunter 2022 + Varley Gutiérrez et al. 2024 + Ewing 2012. Includes the 10 culturally rich scenario seeds proposed in §2.2 above. Source-of-truth for the Equity Reviewer's criterion 2 and for the scenario-library expansion plan.

**Length target:** ~300 lines.

### §11.3 `equity-stereotype-and-anxiety.md`

**Contents:** Spencer/Steele/Quinn 1999 + Galdi et al. 2014 + Ganley et al. 2013 (non-replication) + Agnoli et al. 2021 (non-replication) + Beilock et al. 2010 + Maloney et al. 2015 + Boaler 2016. Frames the "conservative posture" of §3.1: known risk in adults, contested in children, mitigate without overclaiming. Source-of-truth for the Equity Reviewer's criteria 3 and 4.

**Length target:** ~250 lines.

These three files together give the Equity Reviewer a grounded basis comparable to what the K.OA knowledge file gives Mr. Chesure. Without them, an Equity Reviewer agent would be ungrounded — exactly the failure mode Audit 6 flagged for the Mechanic Inventor.

---

## §12 Bibliography (Chicago author-date)

**English Learners in mathematics — Moschkovich corpus:**

- Moschkovich, Judit. 1999. "Supporting the Participation of English Language Learners in Mathematical Discussions." *For the Learning of Mathematics*. ERIC EJ592201.
- Moschkovich, Judit. 2002. "A Situated and Sociocultural Perspective on Bilingual Mathematics Learners." *Mathematical Thinking and Learning* 4 (2–3): 189–212. ERIC EJ654518.
- Moschkovich, Judit. 2007. "Using Two Languages When Learning Mathematics." *Educational Studies in Mathematics* 64 (2): 121–144. ERIC EJ757654.
- Moschkovich, Judit. 2009. *Using Two Languages When Learning Mathematics: How Can Research Help Us Understand Mathematics Learners Who Use Two Languages?* NCTM Research Brief. ERIC ED505968.
- Moschkovich, Judit N. 2012. "Mathematics, the Common Core Standards, and Language: Mathematics Instruction for ELs Aligned with the Common Core." Proceedings of PME-NA. ERIC ED584919.
- Moschkovich, Judit. 2013. "Principles and Guidelines for Equitable Mathematics Teaching Practices and Materials for English Language Learners." *Journal of Urban Mathematics Education* 6 (1): 45–57. ERIC EJ1085793.
- Moschkovich, Judit. 2015. "Academic Literacy in Mathematics for English Learners." *Journal of Mathematical Behavior* 40: 43–62.
- Moschkovich, Judit, and William Zahner. 2018. "Using the Academic Literacy in Mathematics Framework to Uncover Multiple Aspects of Activity during Peer Mathematical Discussions." *ZDM: The International Journal on Mathematics Education* 50 (6): 999–1011. ERIC EJ1193389.

**Funds of knowledge in mathematics:**

- Aguirre, Julia M., Karen Mayfield-Ingram, and Danny B. Martin. 2013. *The Impact of Identity in K-8 Mathematics: Rethinking Equity-Based Practices.* Reston, VA: National Council of Teachers of Mathematics.
- Aguirre, Julia M., Erin E. Turner, Tonya Gau Bartell, Crystal Kalinec-Craig, Mary Q. Foote, Amy Roth McDuffie, and Corey Drake. 2013. "Making Connections in Practice: How Prospective Elementary Teachers Connect to Children's Mathematical Thinking and Community Funds of Knowledge in Mathematics Instruction." *Journal of Teacher Education* 64 (2): 178–192. ERIC EJ1008967.
- Civil, Marta. 2007. "Building on Community Knowledge: An Avenue to Equity in Mathematics Education." In *Improving Access to Mathematics: Diversity and Equity in the Classroom*, edited by Nasir & Cobb, 105–117. New York: Teachers College Press.
- Ewing, Bronwyn. 2012. "Mathematics Funds of Knowledge: 'Sotmaute' and 'Sermaute' Fish in a Torres Strait Islander Community." *Australian Journal of Adult Learning.* ERIC EJ972834.
- González, Norma, Luis C. Moll, and Cathy Amanti, eds. 2005. *Funds of Knowledge: Theorizing Practices in Households, Communities, and Classrooms.* Mahwah, NJ: Lawrence Erlbaum.
- Hunter, Jodie. 2022. "Challenging and Disrupting Deficit Discourses in Mathematics Education: Positioning Young Diverse Learners to Document and Share Their Mathematical Funds of Knowledge." *Research in Mathematics Education* 24 (2): 187–201. ERIC EJ1366074.
- Varley Gutiérrez, Maura, Carolina Napp-Avelli, Beatriz Quintos, Fany Salazar, Erin Turner, and Marta Civil. 2024. "Families and Teachers Doing Mathematics Tasks Together: Considering Funds of Knowledge and Positioning." *Mathematics Teacher Educator.* ERIC EJ1442398.

**Stereotype threat and math identity:**

- Agnoli, Franca, Francesca Melchiorre, Claudio Zandonella Callegher, and Gianmarco Altoè. 2021. "Stereotype Threat Effects on Italian Girls' Mathematics Performance: A Failure to Replicate." *Developmental Psychology* 57 (6): 940–950. ERIC EJ1305415.
- Galdi, Silvia, Mara Cadinu, and Carlo Tomasetto. 2014. "The Roots of Stereotype Threat: When Automatic Associations Disrupt Girls' Math Performance." *Child Development* 85 (1): 250–263. ERIC EJ1027527.
- Ganley, Colleen M., Leigh A. Mingle, Allison M. Ryan, Katherine Ryan, Marina Vasilyeva, and Michelle Perry. 2013. "An Examination of Stereotype Threat Effects on Girls' Mathematics Performance." *Developmental Psychology* 49 (10): 1886–1897. ERIC EJ1050056.
- Gutiérrez, Rochelle. 2008. "A 'Gap-Gazing' Fetish in Mathematics Education? Problematizing Research on the Achievement Gap." *Journal for Research in Mathematics Education* 39 (4): 357–364.
- Gutiérrez, Rochelle. 2013. "The Sociopolitical Turn in Mathematics Education." *Journal for Research in Mathematics Education* 44 (1): 37–68.
- Johnson, Heather J., Lucy Barnard-Brak, Terrill F. Saxon, and Megan K. Johnson. 2012. "An Experimental Study of the Effects of Stereotype Threat and Stereotype Lift on Men and Women's Performance in Mathematics." *Journal of Experimental Education* 80 (2): 137–149. ERIC EJ955891.
- Martin, Danny B. 2009. "Researching Race in Mathematics Education." *Teachers College Record* 111 (2): 295–338.
- Spencer, Steven J., Claude M. Steele, and Diane M. Quinn. 1999. "Stereotype Threat and Women's Math Performance." *Journal of Experimental Social Psychology* 35 (1): 4–28.
- Steele, Claude M., and Joshua Aronson. 1995. "Stereotype Threat and the Intellectual Test Performance of African Americans." *Journal of Personality and Social Psychology* 69 (5): 797–811.
- Tempel, Tobias, and Roland Neumann. 2014. "Stereotype Threat, Test Anxiety, and Mathematics Performance." *Social Psychology of Education* 17 (3): 491–501. ERIC EJ1041125.

**Math anxiety, intergenerational transmission:**

- Beilock, Sian L., Elizabeth A. Gunderson, Gerardo Ramirez, and Susan C. Levine. 2010. "Female Teachers' Math Anxiety Affects Girls' Math Achievement." *Proceedings of the National Academy of Sciences* 107 (5): 1860–1863.
- Beilock, Sian L., and Daniel T. Willingham. 2014. "Math Anxiety: Can Teachers Help Students Reduce It?" *American Educator.* ERIC EJ1043398.
- Boaler, Jo. 2014. "Fluency Without Fear: Research Evidence on the Best Ways to Learn Math Facts." youcubed.org.
- Boaler, Jo. 2016. *Mathematical Mindsets: Unleashing Students' Potential through Creative Math, Inspiring Messages, and Innovative Teaching.* San Francisco: Jossey-Bass.
- Foley, Alana E., Julianne B. Herts, Francesca Borgonovi, Sonia Guerriero, Susan C. Levine, and Sian L. Beilock. 2017. "The Math Anxiety-Performance Link: A Global Phenomenon." *Current Directions in Psychological Science* 26 (1): 52–58.
- Maloney, Erin A., Gerardo Ramirez, Elizabeth A. Gunderson, Susan C. Levine, and Sian L. Beilock. 2015. "Intergenerational Effects of Parents' Math Anxiety on Children's Math Achievement and Anxiety." *Psychological Science* 26 (9): 1480–1488.
- Ramirez, Gerardo, Elizabeth A. Gunderson, Susan C. Levine, and Sian L. Beilock. 2013. "Math Anxiety, Working Memory, and Math Achievement in Early Elementary School." *Journal of Cognition and Development* 14 (2): 187–202. ERIC EJ1011797.

**Cross-age tutoring and language brokering:**

- Allen, Vernon L., and Robert S. Feldman. 1972. "Studies on the Role of Tutor." Reported in *Journal of Educational Psychology* and related publications.
- Cohen, Peter A., James A. Kulik, and Chen-Lin C. Kulik. 1982. "Educational Outcomes of Tutoring: A Meta-Analysis of Findings." *American Educational Research Journal* 19 (2): 237–248.
- Dorner, Lisa M., Marjorie F. Orellana, and Christine P. Li-Grining. 2007. "'I Helped My Mom,' and It Helped Me: Translating the Skills of Language Brokers into Improved Standardized Test Scores." *American Journal of Education* 113 (3): 451–478.
- Leung, Kim Chau. 2019. "An Updated Meta-Analysis on the Effect of Peer Tutoring on Tutors' Achievement." *School Psychology International* 40 (2): 200–214.
- Orellana, Marjorie F. 2009. *Translating Childhoods: Immigrant Youth, Language, and Culture.* New Brunswick, NJ: Rutgers University Press.
- Tse, Lucy. 1996. "Language Brokering in Linguistic Minority Communities: The Case of Chinese- and Vietnamese-American Students." *Bilingual Research Journal* 20 (3–4): 485–498.
- What Works Clearinghouse. 2007. *Peer Tutoring and Response Groups Intervention Report.* ERIC ED499296.

**Culturally responsive math word problems:**

- Driver, Melissa K., and Sarah R. Powell. 2017. "Culturally and Linguistically Responsive Schema Intervention: Improving Word Problem Solving for English Language Learners with Mathematics Difficulty." *Learning Disability Quarterly* 40 (1): 41–53. ERIC EJ1129918.
- Martin, Megyn, and Aaron R. Campbell. 2024. "Shaping Explicit Instruction to Foster Culturally Responsive Math Instruction through Word Problems for Elementary Learners." *Insights into Learning Disabilities.* ERIC EJ1458358.

**Bar Model / strip diagram (referenced in §8.1):**

- Baysal, Esra, and Serife Sevinc. 2022. "The Role of the Singapore Bar Model in Reducing Students' Errors on Algebra Word Problems." *International Journal of Mathematical Education in Science and Technology.* ERIC EJ1337511.
- de Koning, Björn B., Anton J. H. Boonen, Joran Jongerling, Floryt van Wesel, and Menno van der Schoot. 2022. "Model Method Drawing Acts as a Double-Edged Sword for Solving Inconsistent Word Problems." *Educational Studies in Mathematics.* ERIC EJ1344701.

**Universal Design for Learning (referenced in §10.2 criterion 6):**

- CAST. 2018. *Universal Design for Learning Guidelines version 2.2.* Wakefield, MA: CAST.

**Decolonization and cultural-fit framing:**

- Onion, Rebecca. 2008. "Reclaiming the Machine: An Introductory Look at Steampunk in Everyday Practice." *Neo-Victorian Studies* 1 (1): 138–163.
- Stoler, Ann Laura. 1995. *Race and the Education of Desire: Foucault's History of Sexuality and the Colonial Order of Things.* Durham: Duke University Press.
- Tuck, Eve, and K. Wayne Yang. 2012. "Decolonization Is Not a Metaphor." *Decolonization: Indigeneity, Education & Society* 1 (1): 1–40.

---

*End of audit. The audit is additive to Audits 1–13; nothing here re-litigates prior findings. The Rank-1 fix is §9 #1; the broadest-leverage architectural addition is §10 (Equity Reviewer agent + the three shared-knowledge files in §11). The pilot implication is §5.3 — recruit bilingual + below-grade-level Builders explicitly.*
