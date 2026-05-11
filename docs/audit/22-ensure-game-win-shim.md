# Audit 21 — `ensureGameWin` Auto-Win Shim Still Present

*Date: 2026-05-10 · Scope: verify whether the 20-click auto-win fallback flagged in Audit 09 has been removed by Foundation Fix #1, and identify every code path it still affects. · Method: grep `src/` for `ensureGameWin`, `game_win`, and `postMessage.*win`; read the call sites.*

---

## TL;DR

**The shim is still there.** Foundation Fix #1 (commit `9140eb1`) wired the agent ladder onto the save path, which is a real improvement — but the `ensureGameWin` function itself was not removed. Today in `src/components/game/import-html.tsx` lines 29–41, any pasted HTML that does not already contain a `game_win` or `gameWin(` call gets a 20-click counter injected at parse time, which auto-fires `postMessage({type:'game_win', ...})` once the user clicks anywhere in the iframe 20 times. The "Builder must beat their own game" gate is therefore still a paper wall on the paste-HTML path — 20 clicks anywhere clears it, even on HTML that has no real win condition.

The legitimate `game_win` postMessage path (used by genuine engines and templates to signal real completion) is required and should be preserved. The fix is to remove the auto-win fallback only — leave the message listener that consumes `game_win` from real engines alone.

---

## 1. Where the shim lives (confirmed)

**Single source:** `src/components/game/import-html.tsx`, lines 29–41:

```ts
function ensureGameWin(html: string): string {
  if (/game_win|gameWin\s*\(/.test(html)) return html
  const script = `<script>
window._diag_wins = 0;
document.addEventListener('click', function() {
  window._diag_wins++;
  if (window._diag_wins >= 20) {
    try { window.parent.postMessage({type:'game_win', score: 1}, '*'); } catch(e) {}
  }
});
</script>`
  return html.replace("</body>", script + "</body>")
}
```

Called once, at line 61, inside `handleSubmit`:

```ts
const cleanHtml = ensureGameWin(sanitizeGameHtml(html))
onPass({ title: title.trim(), html: cleanHtml, ... })
```

The cleaned HTML — now including the auto-win script — is handed to the Workshop preview / `GameIframe`. From there, when the Builder click-tests the game, the click counter fires `game_win` after 20 clicks regardless of whether the game has any real win condition.

## 2. Other files matching `game_win` / `postMessage.*win` (NOT defects)

The grep for `ensureGameWin|game_win` returned 12 files. Of those, the legitimate consumers and producers of the `game_win` postMessage are:

- `src/components/game/game-iframe.tsx` — listens for `game_win` from the iframe; this is the correct consumer side.
- `src/components/game/game-player.tsx` — same; consumer of `game_win` for the Player flow.
- `src/components/standard/mastery-play.tsx` — listens for `game_win` for mastery tracking.
- `src/lib/game-engines/base-template.ts`, `base-phaser-template.ts`, `number-frames.ts` — engine templates that *legitimately* post `game_win` on a real win.
- `src/lib/agent-prompts/generate-game.ts`, `src/lib/agent-prompts/haiku-shortcut-adversary.ts` — prompts that *instruct* generated HTML to call `game_win` on real completion.
- `src/app/api/game/judge-html/route.ts` — judge looking for `game_win` patterns in code (unused by the new flow).
- `src/app/api/game/generate-gemini/route.ts`, `generate/route.ts` — generation routes that surface `game_win` in their prompts.

**None of these are defects.** The `game_win` message is a real signal; only the `ensureGameWin` shim that auto-fires it after 20 clicks on pasted HTML is the problem.

## 3. What Foundation Fix #1 changed and didn't change

Per `CLAUDE.md` session notes and commit `9140eb1`, Foundation Fix #1 wired the 4-stage agent ladder onto **all three save paths** including the paste-HTML import flow (`graph-page.tsx` `ImportedGamePlayer.handleAddToLibrary`). That means a pasted game now goes through Critic + Shortcut Adversary before save — a real improvement.

**But** the agent ladder runs on the **HTML content**, not on whether the Builder actually beat the game in playtest. The "Builder must beat their own game" gate is a different mechanism: it's the requirement that the Workshop see a `game_win` postMessage from the iframe *during the Builder's own play session* before the "Add to library" button appears (per `builder-host.tsx` flow, Audit 9 §1 step 8). The shim defeats that specific gate. Foundation Fix #1 did not touch this code path; the shim is in the same shape as Audit 9 left it.

## 4. Why this matters even with the agent ladder

The agent ladder catches *pedagogical* defects in the HTML. The playtest gate catches a different class of defect: **HTML that doesn't function as a game at all** (e.g., a static page, a quiz wrapper with no win logic, a broken paste). The shim guarantees that even those clear the playtest gate after 20 clicks. The two gates check different things; one doesn't substitute for the other.

A Builder who pastes a non-functional HTML page today:
1. Pastes → `localValidate` (length + doctype) → passes (it's HTML).
2. `ensureGameWin` injects the 20-click shim.
3. Builder click-tests → 20 clicks → auto-win → "Add to library" button appears.
4. Agent ladder runs on save. The Critic *may* catch a non-functional game; the Shortcut Adversary *may* catch it; neither is guaranteed to flag "this is not a game" if the HTML *looks* like a game in text.
5. Possible publish despite no real win condition.

## 5. Recommended fix

Remove the auto-win fallback while preserving the legitimate `game_win` path. Concretely:

1. **Delete `ensureGameWin` (lines 29–41).**
2. **Replace the call site (line 61)** with:
   ```ts
   const cleanHtml = sanitizeGameHtml(html)
   ```
3. **Add a static check at validation time** (line 56-ish, inside `handleSubmit` before `onPass`):
   ```ts
   if (!/game_win|gameWin\s*\(/.test(html)) {
     setLocalError(
       "We can't see a win condition in your HTML. Your game needs to call window.parent.postMessage({type:'game_win'}, '*') when the player wins. See the template hints in the help panel."
     )
     return
   }
   ```
   This is the **opposite of the current shim**: instead of forging a win for broken HTML, refuse to import it.
4. **Optional kinder UX:** also expose a one-click "Insert win-message helper" button in the import dialog that pastes the postMessage snippet into the HTML for the Builder, with a comment explaining where to call it. This keeps the bar high but lowers the cliff for honest beginners.

Lines changed: ~15. Time: ~30 min. No other file needs to change — the consumers of `game_win` (game-iframe, game-player, mastery-play) are unaffected because legitimate engines and templates still call `game_win` on real wins.

## 6. Verification after fix

After removing the shim:
- Paste a static HTML page with no `game_win` call → import is rejected with the helper message. ✓
- Paste an engine template that already calls `game_win` on real completion → imports normally. ✓
- Click 20 times on a Builder's imported game in the Workshop → nothing happens unless the game's own logic calls `game_win`. ✓
- The 4-stage agent ladder still runs on save (Foundation Fix #1 is unaffected). ✓

---

## Sources (code references only)

- `c:/projects/math-games-builder/src/components/game/import-html.tsx` — the shim (lines 29–41, called at line 61).
- `c:/projects/math-games-builder/src/components/game/game-iframe.tsx` — legitimate `game_win` consumer.
- `c:/projects/math-games-builder/src/components/game/game-player.tsx` — legitimate `game_win` consumer.
- `c:/projects/math-games-builder/src/components/standard/mastery-play.tsx` — legitimate `game_win` consumer.
- `c:/projects/math-games-builder/src/lib/game-engines/base-template.ts`, `base-phaser-template.ts`, `number-frames.ts` — legitimate `game_win` producers.
- `c:/projects/math-games-builder/docs/audit/09-build-flow.md` §1 step 8 and §3 Q4 — original flagging of the shim.
- Commit `9140eb1` — Foundation Fix #1 wired the agent ladder onto all three save paths; did not touch the shim.
