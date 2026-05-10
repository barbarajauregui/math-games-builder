# Sketchfab assets Barbara likes

> Bookmarked 2026-05-10 during Library brainstorming. Barbara handed these to Claude and said "let's discuss how to use them in MGB." Source-of-truth for asset selection on the Library and future visual surfaces. Verify license per item before using (need CC-BY or CC0; reject CC-NC and CC-BY-ND for color-tinted versions).

## Lanterns & lighting fixtures
- [Chinese lantern](https://skfb.ly/Fvs7)
- [Medieval lantern](https://skfb.ly/prHXL)
- [Steampunk lamp](https://skfb.ly/69TSF)
- [Another steampunk lamp](https://skfb.ly/6UtoO)
- [Steampunk flashlight](https://skfb.ly/HwXF)
- [Desk lamp (cool background)](https://skfb.ly/oI89T)
- [Light pole](https://skfb.ly/6UW7Q)

## Magic / portals / atmosphere
- [Magic portal](https://skfb.ly/6VytI)
- [Angel's wings](https://skfb.ly/Qw6R)
- [Campfire wood](https://skfb.ly/6QYoY)
- [Light through windows room](https://skfb.ly/ECOx)
- [Unit locks (cool lighting)](https://skfb.ly/otOOK)

## Steampunk artifacts / props
- [Steampunk artifact](https://skfb.ly/6WGqX)
- [Compass](https://skfb.ly/oU9Hv)
- [Steampunk train](https://skfb.ly/6RyKw)

## Cosmic / planets / space
- [Surreal planet (water and hills)](https://skfb.ly/pyYr6)
- [Planet of shards](https://skfb.ly/6pswO)
- [Galaxy](https://skfb.ly/6QV7A)
- [Star planet magnetic interaction](https://skfb.ly/6SNFE)
- [Various planets](https://skfb.ly/o7F9p)
- [Sci-fi planet (station)](https://skfb.ly/pI9No)
- [Solar system](https://skfb.ly/CJtG)
- [Lava planet](https://skfb.ly/6SuNY)
- [Black hole](https://skfb.ly/oOBPp)
- [Steampunk earth](https://skfb.ly/FXoq)

---

## Canonical asset roster (license-verified 2026-05-10)

After running a license check, this is the cleared roster for the Library + Galaxy build. All CC-BY 4.0 unless noted; attribution will live on a `/credits` page in the app.

### Library room (the warm interior)
- **Room shell** — pick one: [Light-Map scene](https://skfb.ly/ECOx) by SODOREN (450 tris, simple) or [Cave of Eternity](https://skfb.ly/6ZvCM) by salinaforr (atmospheric, magical)
- **Hearth** — [Campfire Wood](https://skfb.ly/6QYoY) by digrafstudio
- **Hallway lighting** — [Light Pole](https://skfb.ly/6UW7Q) by Arkikon (2.8k tris)
- **Mode-switch lever (Build/Play)** — [Steampunk Solar Transit](https://skfb.ly/6WGqX) by nika.tendetnik
- **Curriculum-position indicator** — [Compass low-poly game asset](https://sketchfab.com/3d-models/compass-low-poly-game-asset-a2572112e61048ad81845af34f8ee90b) by jsabbott (CC-BY, "free for commercial")

### Game cards (instanced ~466×) — generated, not sourced

**v2 update 2026-05-10:** Lantern concept dropped. Game cards are 2D Tailwind components with a brass-frame poster art layout. Frame variants and poster art generated via Leonardo using prompts in `docs/assets/leonardo-prompts.md` (#3 frames, #4 per-game posters). No 3D lantern model is needed. The five lantern Sketchfab picks below are kept as historical reference but are no longer in the asset roster.

Historical (NOT used in v2):
- ~~[Low-Poly Lantern by Nacovya](https://sketchfab.com/3d-models/low-poly-lantern-736d5817b2674482a6b5dde70dea3250)~~ (steampunk variant)
- ~~[Low Poly Lantern by DLM](https://sketchfab.com/3d-models/low-poly-lantern-b560c86215214429a62519f9285342c4)~~ (classic glass)
- ~~[Low Poly Lantern by Emma-Lie Kamping](https://sketchfab.com/3d-models/low-poly-lantern-e8a9b72425e148e48364bc0d3d05da13)~~ (bulk / low-LOD)
- ~~[Stylized Japanese Lantern by Miszla](https://sketchfab.com/3d-models/low-poly-stylized-japanese-lantern-17bedd84ff3d464fa380f3b28ed4e2e5)~~ (locked-state paper)
- ~~[Low Poly Lantern by joe-z13](https://sketchfab.com/3d-models/low-poly-lantern-7d094131b5994e5ba24aa9bc900123dc)~~ (variety filler)

### Library ↔ Galaxy portal — DROPPED in v2
The Magic Portal asset is no longer needed. Library and Galaxy are now distinct environments routed by role; each role can flip into the other via a top-bar mode pill, not by walking through a portal. The mode pill is a flat UI element using the Mode-switch lever asset (Steampunk Solar Transit) rendered as a corner artifact.

~~[Magic Portal](https://skfb.ly/6VytI) by SGTorresJ — historical, not used in v2~~

### Galaxy (the cool exterior)
- **Planet variety pack** — [Various Planets](https://skfb.ly/o7F9p) by Feivelyn (multi-planet, 13.7k tris) — solves the all-Jupiter problem in one asset
- **Hero feature planet** — [Surreal Planet](https://skfb.ly/pyYr6) by golukumar (1.3M tris, ONE only — e.g., the cluster the learner is currently working on)
- **Lava domain planet** — [Lava Planet](https://sketchfab.com/3d-models/lava-planet-d5b28875e7b6452e8236d538547b2a68) by rodrigofitas.lp (16.7k tris)
- **Sci-fi accent planet** — [Sci-fi City station](https://skfb.ly/pI9No) by Jungle Jim (960 tris)
- **Endgame portal** — [Black hole with accretion disk](https://sketchfab.com/3d-models/black-hole-with-accretion-disk-1d0a5cb6bb2a43f4b2e7719c88cec6b2) by RTXlover (9.8k tris)
- **Far backdrop** — [Galaxy "Need some space?"](https://skfb.ly/6QV7A) by Loïc Norgeot

### Mastery state — planet bloom (v2 update)

**v2 update 2026-05-10:** Mastery visualization changed from planet-shatter to planet bloom. Pristine planet → cracked-with-light intermediate → bloomed-with-life at 100%. Additive (life appearing), not destructive.

- **Pristine** — Feivelyn's [Various Planets](https://skfb.ly/o7F9p) baseline (rocky, desolate, no atmosphere)
- **Cracking 1/N to N–1/N** — emissive crack-line shader overlay on the pristine model (no new asset)
- **Bloomed N/N** — Leonardo-generated full-life version per planet (water spreads, atmosphere, forests, city lights at night). See `docs/assets/leonardo-prompts.md` #7. Saved as `public/assets/galaxy/planet-{domain}-bloomed.png`. Shader blends between pristine and bloomed based on mastery percentage.
- **Optional ambient debris ring** — [Asteroid Belt](https://sketchfab.com/3d-models/asteroid-belt-bd01732b4e074c8cae90200b9d169431) by gianlucadistefano1998 if a planet wants Saturn-style rings as part of its bloomed state.

### Ceremonies (one-time emotional moments)
- **Builder graduation (first published game)** — [Angel Wings](https://sketchfab.com/3d-models/angel-wings-917b4019a1614d179e70cda895fd3f16) by Boooooop (28.3k tris, one-time effect)
- **Player cluster mastery / Builder publish** — [Lowpoly Steampunk Train](https://sketchfab.com/3d-models/lowpoly-steampunk-train-427574ea7ccf4b879fa1b489799c30b8) by kehosworld (34.7k tris, one-time)

### Verified-and-dropped
- [Space Debris](https://sketchfab.com/3d-models/space-debris-82e0ddf043254f63911123aa64398460) by Vertex Farm — license **not specified** on the model page (verified 2026-05-10). Treat as All Rights Reserved. **DROPPED.** Use Cell-Fractured Feivelyn planet for the shattered state; pair with [Asteroid Belt](https://sketchfab.com/3d-models/asteroid-belt-bd01732b4e074c8cae90200b9d169431) by gianlucadistefano1998 for ambient debris ring.

### Dropped (bad license)
Original picks rejected: Adeboye Grillo's Chinese Lantern (ARR), ibizanhound's Medieval Lantern (ARR+NoAI), SideengDSHV's brass bicycle lamp (unspecified), Legrand_Tom's spotlight (unspecified), andyone's flashlight (unspecified), sergeilihandristov's desk lamp (ARR+NoAI), Julian Triveri's Unit Locks (CC-BY-ND), Nillusion's Fantasy Compass (CC-BY-NC), quartomundo's Angel Wings (ARR paid), Paletizma's Planet of Shards (unspecified), gnaz's Star/Planet Magnetic Interaction (ARR+NoAI), KangaroOz's Solar System (unspecified), jcises's Lava Planet (CC-BY-NC), tamminen's Black Hole (paid), veyratom's Steampunk Earth (ARR+NoAI), MandesDesign's Steampunk Train (ARR+NoAI).

---

## What this list tells us about Barbara's taste

Strong **steampunk + cosmic** signal. Heavy preference for warm brass / amber / mechanical / atmospheric over pure Pandora-bioluminescent cool palette. The cosmic items are mostly stylized (planet of shards, steampunk earth, galaxy) not photographic NASA realism.

The closest match in `~/.claude/skills/creative-visual-quality-standards/world-flavors.md` is the explicitly-named hybrid: **"Steampunk + Pandora — brass airship over a bioluminescent jungle. Lanterns are warm amber against cool magenta flora. Beautiful contrast."**

This may mean the Math Games Builder visual identity is actually:
- **Galaxy (already built):** Pandora-bioluminescent primary
- **Library (this design):** Steampunk-primary with Pandora cosmic backdrop — brass lanterns warm against cool indigo/cyan space
- Or both surfaces shift to a unified Steampunk-Pandora hybrid

Decision pending in conversation.
