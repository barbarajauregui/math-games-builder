# Leonardo AI prompts for Math Games Builder

> Ready-to-paste prompts for The Star Atlas Library (Player home) and the existing Pandora Galaxy (Builder home). Generate in [Leonardo AI](https://leonardo.ai) (free daily credits — usually enough for prototype scale). After generating, save keepers into `public/assets/library/`, `public/assets/galaxy/`, or `public/assets/ceremonies/` with descriptive filenames.
>
> **v2 — updated 2026-05-10 evening.** Lantern prompts (#1–3 in v1) and the lantern-era Library room/portal prompts have been removed; v1 of this file lived at the same path and is preserved in commit history (`43f273c`). The current Library design is **The Star Atlas Library** — a steampunk astronomer's reading room with cards on shelves and a central illuminated star atlas as both navigation and overview.
>
> **Why text-only prompts and not image references:** the rejected Sketchfab models (ARR + NoAI tagged) cannot legally be uploaded as Leonardo references. Style is not copyrightable; specific creators' work is. Write descriptions of the *aesthetic* you want, not "in the style of [creator]."
>
> **Suggested Leonardo settings** (per prompt below — tweak as needed):
> - Model: **Leonardo Phoenix 1.0** for stylized illustrations; **Leonardo Lightning XL** for fast iteration
> - Style: **Cinematic** for room/scene shots; **3D Render** for hero objects; **Illustrative** for ceremony moments
> - Aspect ratio per prompt
> - Number of images: 4 (cheap, picks better keepers)

---

## 1. The Star Atlas Library — interior shot

**Use:** the Library's room itself. Will become the scene's background, with shelves of cards and the central atlas in the foreground.

**Prompt:**
```
Wide-angle interior of a warm Victorian steampunk astronomer's reading room, brass pipework along the ceiling, leaded-glass arched windows with golden afternoon light streaming through dust motes, polished wooden floor, antique brass globe in one corner, deep wooden bookshelves lining the walls (empty, ready to display content), a fireplace with a soft fire on one side, a hint of bioluminescent indigo-magenta glow visible through one large round portal-window in the back wall (the galaxy beyond), no people, no text, painterly, depth of field, cinematic atmospheric lighting
```

**Settings:** Cinematic, 16:9 ultra-wide, 4 images.

**After generating:** save as `public/assets/library/room-bg.jpg` (no transparency needed). This is the backdrop layer; cards and atlas overlay on top.

---

## 2. The central illuminated star atlas

**Use:** the brass-framed star chart at the center of the Library. Both the navigation and the mini-map. When a Player taps a planet on this atlas, the corresponding shelf section lights up.

**Prompt:**
```
Antique illuminated brass star chart on a brass and wooden stand, an open atlas book showing a delicate hand-drawn cosmos with planets and orbit lines in cyan and amber ink, brass dial mechanism around the edges of the open book, soft amber inner glow as if lit by a hidden lamp, intricate engraved compass-rose details at the corners, three-quarter top-down view, isolated on transparent background, no specific labels or text, no real-world constellations, game asset, high detail
```

**Settings:** 3D Render, square (1:1), 4 images.

**After generating:** save as `public/assets/library/star-atlas.png`. The planets/moons will be drawn programmatically on top of the atlas in code (so the atlas serves as a templated frame).

---

## 3. Game-card frame — brass-and-leather

**Use:** the frame around each game's poster. ~466 cards × 3 variants ideally for visual variety.

**Prompt — variant A (the workhorse):**
```
Ornate antique brass picture frame with leather inset corners, square aspect ratio, slight Victorian gear motifs at the four corners, internal blank rectangle ready to hold artwork, subtle warm amber glow trim along the outer edge, isolated on transparent background, head-on view, game asset, high detail, no text inside the frame
```

**Settings:** 3D Render, square (1:1), 4 images.

**After generating:** save as `public/assets/library/card-frame-a.png`. Repeat with the next two prompts for variants B and C.

**Prompt — variant B (paper-and-wood):**
```
Antique wooden picture frame with parchment paper inset, square aspect ratio, simple turned-wood corners with brass tack accents, internal blank rectangle ready to hold artwork, subtle warm cream tone, isolated on transparent background, head-on view, game asset, no text
```

**Prompt — variant C (paper-tag style for Locked-state cards):**
```
Antique aged-paper card frame with rough deckled edges, square aspect ratio, faded sepia tones, a small brass eyelet at the top as if hung on a string, internal blank rectangle for artwork, slight crinkle texture, isolated on transparent background, head-on view, game asset, no text
```

After generating each: save as `public/assets/library/card-frame-b.png` and `card-frame-c.png` respectively.

---

## 4. Game poster art — per-game (auto-generated by Mr. Chesure later)

**This is a TEMPLATE prompt** that gets composed at game-publish time, not a one-time generation. Mr. Chesure (or the Builder upload) will produce a poster for each game from a prompt like:

```
Square game poster artwork, vibrant illustration style, depicting [Builder's scenario in a sentence], warm tones, child-friendly, age 5-10 audience, no text, no logos, no human faces, isolated on transparent background, painterly, soft lighting
```

The `[Builder's scenario in a sentence]` gets filled in from the Builder's scenario field at publish time. Saved as `public/assets/games/{gameId}.png`.

For your testing right now, run a few of these manually with example scenarios so we can see what the cards look like with real art.

---

## 5. Diegetic UI — mode-switch lever (Build / Play)

**Use:** the small brass lever the user "throws" to switch between Builder and Player mode. Lives in a corner of the Library (and a corresponding corner of the Galaxy).

**Prompt:**
```
Antique brass mechanical lever artifact mounted on a small wooden plinth, two-position handle with brass labels (one position warmly lit, the other dim), filigree detailing, gears visible at the base, soft amber accent light, isolated on transparent background, three-quarter view, game asset, high detail, no text on the labels themselves
```

**Settings:** 3D Render, square (1:1), 4 images.

**After generating:** save as `public/assets/library/mode-lever.png`. The handle position swaps in code when the mode changes.

---

## 6. Diegetic UI — fix-request "letter" icon

**Use:** when a Player wants to send a fix-request or idea to the Builder of a game they just played, the UI shows a small wax-sealed letter icon they tap.

**Prompt:**
```
Antique parchment letter folded with a brass wax seal, small wing-feather quill resting next to it, isolated on transparent background, head-on view, soft warm lighting, game asset icon, no text on the parchment, charming and child-friendly, no human hands visible
```

**Settings:** 3D Render, square (1:1), 4 images.

**After generating:** save as `public/assets/library/letter-icon.png`.

---

## 7. Galaxy — planet bloom states (per planet)

**Use:** mastery-state visualization. As a learner masters all moons in a planet's cluster, the planet visibly blooms with life. This needs ~2 reference renders per major planet (pristine + bloomed) so we can shader-blend between them.

**Prompt — TEMPLATE for "pristine" planet (rocky desolate):**
```
Spherical rocky planet, dim cratered surface, no atmosphere, no water, no plant life, neutral grey-brown tones, deep space background dark indigo with a few distant stars, head-on view, isolated on a dark transparent background, no text, painterly digital art
```

**Prompt — TEMPLATE for "bloomed" planet (full life):**
```
Spherical planet with the same surface geography as the pristine version, but now with vibrant water (cyan-magenta bioluminescent), atmosphere creating a soft halo, lush forests across the land in purple-green hues, glowing city lights on the night-side, swirling cloud patterns, deep space background, head-on view, isolated on a dark transparent background, no text, painterly digital art, awe-inspiring beauty
```

**Settings:** 3D Render, square (1:1), 4 images each.

**After generating:** save pristine variants as `public/assets/galaxy/planet-{domain}-pristine.png` and bloomed as `planet-{domain}-bloomed.png`. The shader will blend between based on mastery percentage.

(To save Leonardo credits: only generate the pair for ONE planet first to test the bloom transition before fanning out to all planet variants.)

---

## 8. Mini-map planet thumbnails

**Use:** the central atlas in the Library shows small thumbnail icons for each planet. Generate consistent-style planet thumbs.

**Prompt:**
```
Stylized icon-style illustration of a small spherical planet drawn in antique-illustration ink style, indigo and cyan with subtle warm highlights, simple silhouette, isolated on transparent background, head-on view, square 1:1 composition, no text, hand-drawn feel, ~64px appearance
```

**Settings:** Illustrative, square (1:1), 4 images.

**After generating:** save as `public/assets/library/planet-thumb-{domain}.png`. Generate one per domain (~12 of these).

---

## 9. Builder ceremony — wings unfurling (preserved from v1)

**Use:** one-time ceremony when a Builder publishes their first approved game. Wings unfurl over their avatar for ~3 seconds, then fold.

**Prompt:**
```
Pair of luminous translucent feathered wings unfurling, soft golden light emanating from the feather edges, wings fully spread in a triumphant gesture, isolated on transparent background, head-on symmetrical composition, no body or torso visible (just the wings emerging from a point of light), game asset, ethereal, no text
```

**Settings:** Illustrative, square (1:1), 4 images. Negative prompt: `body, person, clothing, demon, dark, scary`.

**After generating:** save as `public/assets/ceremonies/wings.png`.

---

## 10. Player ceremony — steampunk train (preserved from v1)

**Use:** when a Player masters all moons in a cluster, a small steampunk train chugs across the screen carrying their gold-shard moons.

**Prompt:**
```
Side view of a small ornate steampunk locomotive engine with a polished brass boiler, intricate gears visible, a tall thin smokestack puffing soft white steam, brass and copper detailing, single small carriage behind, isolated on transparent background, side profile composition, game asset, charming and friendly (not menacing), warm amber and brass color palette, no text
```

**Settings:** Illustrative, 16:9 wide, 4 images.

**After generating:** save as `public/assets/ceremonies/train.png`.

---

## Pacing recommendation

Don't try to nail all 10 in one Leonardo session. Suggested order:
1. **#1, #2, #3** — Library room + atlas + card frame variants. The Library's structural identity. Get these first.
2. **#7 (one planet pair)** — test bloom-state transition before generating all planets.
3. **#8 (a few planets)** — see how the mini-map reads with real thumbs.
4. **#5, #6** — diegetic UI bits. Quick generations.
5. **#9, #10** — ceremony art. Generate when those moments are next on the build queue.

**Important:** when a generation produces something off, regenerate rather than editing in an image editor. Leonardo regenerations are cheap; downstream cleanup is not. After 3 regenerations, add specificity to the prompt — name the silhouette, the color temperature, the lighting direction explicitly.

---

## Saving and crediting

- Leonardo's free tier outputs are licensed for commercial use under their TOS. No attribution required.
- Save the prompt next to the image (e.g., `room-bg.jpg` + `room-bg.prompt.txt`) so we can regenerate if needed.
- Add a brief Leonardo credit on the `/credits` page once we ship: "Some illustrations generated with Leonardo AI."

---

## Dropped from v1 (lantern era)

For history. v1 of this file (committed in `43f273c`) had prompts for: steampunk hero lantern, classic glass lantern, locked-state paper lantern, Library room with the lantern context, magic portal doorway, brass compass. **All dropped** as part of the spec v2 reframe — lanterns dropped, magic portal dropped (Library and Galaxy are now separate environments, not connected by a portal).
