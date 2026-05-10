# Leonardo AI prompts for Math Games Builder

> Ready-to-paste prompts for the Library + Galaxy redesign. Generate in [Leonardo AI](https://leonardo.ai) (free daily credits — usually enough for prototype scale). After generating, save keepers into `public/assets/library/` and `public/assets/galaxy/` with descriptive filenames. PNG with transparency where the prompt says "isolated on transparent background."
>
> **Why text-only prompts and not image references:** the rejected Sketchfab models (ARR + NoAI tagged) cannot legally be uploaded as Leonardo references. Style is not copyrightable; specific creators' work is. Write descriptions of the *aesthetic* you want, not "in the style of [creator]."
>
> **Suggested Leonardo settings** (per prompt below — tweak as needed):
> - Model: **Leonardo Phoenix 1.0** for stylized illustrations; **Leonardo Lightning XL** for fast iteration
> - Style: **Cinematic** for the room/scene shots; **3D Render** for game-card lanterns; **Illustrative** for ceremony moments
> - Aspect ratio per prompt
> - Number of images: 4 (cheap, picks better keepers)

---

## 1. Game-card lantern — STEAMPUNK HERO variant

**Use:** the primary lantern that hovers as a game-card in the Library. ~250 of the 466 cards will use this one (the most-common variant).

**Prompt:**
```
Ornate brass steampunk hanging lantern, hexagonal glass panels with warm amber glow inside, intricate metalwork with rivets and gears, a small filament or wisp visible inside the glass, isolated on transparent background, centered composition, soft rim lighting, game asset, high detail, no text, no logos
```

**Settings:** 3D Render, square (1:1), 4 images. Negative prompt: `text, logo, watermark, photographic background, hands, people`

**After generating:** pick 1 keeper, save as `public/assets/library/lantern-steampunk.png`. Will be color-tinted in code per game state (locked / available / in-progress / mastered).

---

## 2. Game-card lantern — CLASSIC GLASS variant

**Use:** secondary lantern variant for visual variety. ~150 cards will use this one.

**Prompt:**
```
Classic glass and brass hanging lantern, four flat clear glass panels in a brass cage, simple wrought-iron handle on top, single warm candle flame inside, isolated on transparent background, centered, soft rim lighting, game asset, high detail, clean silhouette, no text
```

**Settings:** 3D Render, square (1:1), 4 images. Same negative prompt as above.

**After generating:** save as `public/assets/library/lantern-classic.png`.

---

## 3. Game-card lantern — LOCKED STATE (paper)

**Use:** the dim, unlit lantern shown for "Coming soon" locked games on a Player's path. Should read as "not yet ignited" — translucent, dim, waiting.

**Prompt:**
```
Translucent paper lantern with warm wood frame, no flame inside (unlit and dim), faint moonlight catching the paper edges, slightly muted colors, isolated on transparent background, centered, game asset, no text, no logos
```

**Settings:** 3D Render, square (1:1), 4 images. Negative prompt: `bright glow, lit flame, fire, electricity, neon`.

**After generating:** save as `public/assets/library/lantern-locked.png`.

---

## 4. Library room interior — the warm steampunk space the lanterns hang in

**Use:** the actual room the Library lives in. Will become the scene's background, with lanterns hovering in the foreground.

**Prompt:**
```
Wide-angle interior of a warm Victorian steampunk reading room, brass pipework along the ceiling, leaded-glass arched windows with golden sunset light streaming through dust motes, polished wooden floor, hints of bioluminescent indigo-magenta glow visible through one large round portal-window in the back wall, no people, no furniture in the foreground (empty central space for hovering lanterns), cinematic atmospheric lighting, depth of field, painterly, no text
```

**Settings:** Cinematic, 16:9 ultra-wide, 4 images.

**After generating:** save as `public/assets/library/room-bg.jpg` (no transparency needed). This is the backdrop layer.

---

## 5. The Library↔Galaxy portal doorway

**Use:** the round glowing doorway on the Library's back wall that opens to the Galaxy/Explore view. Click → camera flies through.

**Prompt:**
```
Ornate circular brass portal frame mounted in a stone wall, the inside of the portal showing a deep indigo and cyan starfield with bioluminescent pollen motes drifting, the portal's metal frame has gear teeth and rivet detail, soft cyan-magenta light spilling out from the portal onto the wall, isolated on transparent background, head-on composition, game asset, no text
```

**Settings:** 3D Render, square (1:1), 4 images. Negative prompt: `door, hinges, doorknob, modern, minimalist`.

**After generating:** save as `public/assets/library/portal.png`.

---

## 6. Mode-switch lever (the brass artifact for Build/Play toggle)

**Use:** the diegetic lever the user "throws" to switch between Builder and Player mode. Lives in a corner of the Library.

**Prompt:**
```
Antique brass mechanical lever artifact mounted on a small wooden plinth, two-position handle with brass labels (one position warmly lit, the other dim), filigree detailing, gears visible at the base, soft amber accent light, isolated on transparent background, three-quarter view, game asset, high detail, no text on the labels themselves
```

**Settings:** 3D Render, square (1:1), 4 images.

**After generating:** save as `public/assets/library/mode-lever.png`. Will be animated in code (handle position swaps when mode changes).

---

## 7. Brass compass — curriculum-position indicator

**Use:** wall-mounted compass that shows the learner where they are on the math curriculum (current edge / next standard / mastered clusters). Diegetic UI.

**Prompt:**
```
Ornate antique brass nautical compass mounted on a polished wooden wall plaque, intricate engraved compass rose with cardinal markings (no specific letters), a single thin brass needle pointing up-right, glass dome cover catching warm reflected light, hints of gear mechanism visible through the back, isolated on transparent background, head-on view, game asset, high detail, no text on the rose, no specific numbers
```

**Settings:** 3D Render, square (1:1), 4 images.

**After generating:** save as `public/assets/library/compass.png`. The needle will be re-rotated in code to point at the current curriculum edge.

---

## 8. Builder ceremony — wings unfurling

**Use:** one-time ceremony when a Builder publishes their first approved game. Wings unfurl over their avatar for ~3 seconds, then fold.

**Prompt:**
```
Pair of luminous translucent feathered wings unfurling, soft golden light emanating from the feather edges, wings fully spread in a triumphant gesture, isolated on transparent background, head-on symmetrical composition, no body or torso visible (just the wings emerging from a point of light), game asset, ethereal, no text
```

**Settings:** Illustrative, square (1:1), 4 images. Negative prompt: `body, person, clothing, demon, dark, scary`.

**After generating:** save as `public/assets/ceremonies/wings.png`.

---

## 9. Player ceremony — steampunk train

**Use:** when a Player masters all moons in a cluster, a small steampunk train chugs across the screen carrying their gold-shard moons.

**Prompt:**
```
Side view of a small ornate steampunk locomotive engine with a polished brass boiler, intricate gears visible, a tall thin smokestack puffing soft white steam, brass and copper detailing, single small carriage behind, isolated on transparent background, side profile composition, game asset, charming and friendly (not menacing), warm amber and brass color palette, no text
```

**Settings:** Illustrative, 16:9 wide, 4 images.

**After generating:** save as `public/assets/ceremonies/train.png`.

---

## 10. Mastery state — cracked planet (intermediate state)

**Use:** the visible damage that accumulates on a planet as the learner masters its moons. This is a TEXTURE OVERLAY for the existing Various Planets model — generate as a transparent crack-and-glow pattern.

**Prompt:**
```
Glowing emissive crack lines spreading across a planet surface, hairline cracks branching outward with bright cyan and magenta light leaking through them, cracks form an organic web pattern, the underlying planet surface is invisible (transparent), isolated on transparent background, square 1:1 composition, game texture asset, no text
```

**Settings:** 3D Render, square (1:1), 4 images. Negative prompt: `solid planet, full sphere, brown, photorealistic, surface, lava, fire`.

**After generating:** save as `public/assets/galaxy/planet-cracks.png`. Will be applied as an emissive overlay shader on Feivelyn's pristine planet model. Opacity ramps with mastery percentage.

---

## Pacing recommendation

Don't try to nail all 10 in one Leonardo session. Suggested order:
1. Run prompts **#1, #2, #3** first — that's the lantern set, the most-instanced asset, the hero of the Library. Get those right before moving on.
2. Run **#4** (room) and **#5** (portal) — that's the Library's setting and the bridge to the Galaxy. Two more keepers.
3. Run **#6, #7** — diegetic UI props. Lower-stakes; iterate freely.
4. Run **#8, #9, #10** when ceremonies and mastery state are next on the build queue. Don't generate ahead of schedule — Leonardo's daily credits regenerate; spend them when you have the spec ready.

**Important:** when a generation produces something off, regenerate rather than editing. Leonardo's regeneration is cheap; downstream cleanup in image-editing tools is not. If after 3 regenerations you still don't like it, add specificity to the prompt — name the silhouette, the color temperature, the lighting direction explicitly.

---

## Saving and crediting

- Leonardo's free tier outputs are licensed for commercial use under their TOS. No attribution required.
- Save the prompt next to the image (e.g., `lantern-steampunk.png` + `lantern-steampunk.prompt.txt`) so we can regenerate if needed.
- Add a brief Leonardo credit on the `/credits` page once we ship: "Some illustrations generated with Leonardo AI."
