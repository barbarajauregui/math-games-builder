/**
 * generate-game.ts
 *
 * Composes the LLM prompt that generates a Builder's game HTML.
 *
 * Replaces the pre-2026-05-10 hard-coded "K.OA.A.1 ADDITION ONLY" prompt in
 * `src/app/api/game/generate-gemini/route.ts`. The prompt is now built
 * dynamically from the standard's pedagogical knowledge so non-K.OA
 * standards no longer get an addition-only prompt.
 *
 * Spec: docs/superpowers/specs/2026-05-10-library-design.md §15.1 item 2.
 * Audit: docs/audit/09-build-flow.md §4 item 5.
 *
 * Plain English in the prompt: this prompt goes to an LLM that produces a
 * game played by kids. Education research terms (intrinsic integration,
 * construct validity, productive failure, CPA) are translated in
 * parentheses on first use so the LLM doesn't paraphrase them away.
 */

import type { StandardKnowledge } from '@/lib/standard-knowledge'

export interface BuildGenerateGamePromptInput {
  standardId: string
  scenario: string
  builderType: string
  knowledge: StandardKnowledge
}

/**
 * Compose the full game-generation prompt.
 *
 * Sections (in order):
 *   1. Role + the standard text + scenario + builder type
 *   2. The four Critic criteria the game MUST pass
 *   3. The CPA progression for this standard (or a generic note if absent)
 *   4. Misconceptions to design AROUND
 *   5. Anti-patterns to NEVER produce
 *   6. The fixed game-shape requirements (5 rounds, postMessage protocol,
 *      dark theme, mobile/desktop input, CSP, etc.) — these are independent
 *      of the standard.
 *   7. The "learner does the math, never the system" rules.
 *   8. Visual quality bar.
 *   9. Output format (raw HTML, no fences).
 */
export function buildGenerateGamePrompt(
  input: BuildGenerateGamePromptInput
): string {
  const { standardId, scenario, builderType, knowledge } = input

  const standardSection = renderStandardSection(standardId, knowledge)
  const cpaSection = renderCpaSection(knowledge)
  const misconceptionsSection = renderMisconceptionsSection(knowledge)
  const antiPatternsSection = renderAntiPatternsSection(knowledge)
  const exemplarSection = renderExemplarSection(knowledge)
  const builderBriefSection = renderBuilderBriefSection(knowledge)

  return `You are a game developer building an educational math game for young learners. The game will be reviewed by a four-criterion pedagogical critic before it ships, so build something that actually teaches the math — not a quiz wrapped in a theme.

${standardSection}

SCENARIO / THEME: ${scenario}
BUILDER TYPE: ${builderType}

THE FOUR CRITERIA YOUR GAME MUST PASS

The Critic will reject your game if any of these fail. Build them in from the start; do not patch them on at the end.

1. REAL-WORLD SCENARIO. The scenario must be a situation where a real person would actually need this math. The math must be necessary for the story to work. If the scenario is decoration disconnected from the math, this fails.

2. MATH IS THE GAMEPLAY (i.e., the math IS the thing the player does — it is not a popup interrupting other gameplay). If you can describe what the player does without mentioning the math, the math is decoration. The action of playing IS the act of doing the math.

3. CANNOT WIN WITHOUT THE MATH (i.e., construct validity at the action level — there is no way to win by clicking randomly, by visually matching numbers without counting, by trial-and-error, or by following a UI pattern). The system MUST NOT count for the learner; the learner does the counting/adding/multiplying themselves.

4. CONSTRUCT VALIDITY (i.e., the game measures the SPECIFIC math skill the standard names — not an adjacent skill). A learner cannot win this game without using the named skill. If the standard says "decompose numbers in MORE THAN ONE WAY", the game must require multiple decompositions; one-and-stop fails.

${cpaSection}

${misconceptionsSection}

${antiPatternsSection}

${exemplarSection}

${builderBriefSection}

GAME SHAPE — FIXED REQUIREMENTS (independent of the math standard)

A. Generate a COMPLETE, SELF-CONTAINED HTML file (single file, no external dependencies except Google Fonts) that is a playable math game.
B. The game must have exactly 5 rounds of increasing difficulty, all testing the math skill named by the standard above. Do not include math from a different standard. Stay inside the number range, operation type, and skill the standard specifies.
C. Use the scenario "${scenario}" as the game's story and visual theme. Objects, characters, and narrative match the scenario. If the Builder said elephants, show elephants — not chicks, not eggs, not random animals. Use simple CSS shapes (circles, rounded rectangles) with a text label underneath if you cannot draw the exact object. NEVER use an emoji or symbol that represents a DIFFERENT thing than what was described.
D. DARK THEME: Use a dark background (#09090b or similar very dark color). All text must be WHITE or very light (#e4e4e7 minimum). Never use grey text on dark backgrounds — everything must be high contrast and easy to read. Interactive objects should be bright and colorful (use vivid colors like #ef4444, #3b82f6, #10b981, #f59e0b) with subtle glow effects (box-shadow with color). Buttons should have visible borders or bright backgrounds. Clean layout, no arcade effects.
E. Use the Lexend font from Google Fonts: <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
F. Must work on mobile AND desktop. Use BOTH click and touch events on every interactive element. Add event listeners with addEventListener('click') and addEventListener('touchstart') — do NOT rely on onclick attributes alone. All interactive elements must be at least 44px x 44px. The game runs inside a sandboxed iframe with only allow-scripts — do NOT use any features that require allow-same-origin, allow-popups, or allow-forms.
G. Include this exact Content-Security-Policy meta tag in the <head>:
   <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src data: blob:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';">
H. Track timing per round (time from round start to answer submission) and total session duration.
I. After each round completes, send a postMessage to the parent:
   window.parent.postMessage({ type: 'round_complete', round: { roundIndex: <0-based>, correct: <boolean>, learnerAnswer: <number>, correctAnswer: <number>, timeMs: <ms for this round>, attempts: <number of attempts>, kind: '<operation kind, e.g. "addition", "multiplication", "decomposition">', problem: '<short string description>' } }, '*');
J. When all 5 rounds are complete, send:
   window.parent.postMessage({ type: 'game_win', score: <number of rounds answered correctly on first attempt> }, '*');
K. All CSS must be inline in a <style> tag. All JS must be inline in a <script> tag. No external scripts or stylesheets (except the Google Fonts link).
L. The HTML must be valid and complete (<!DOCTYPE html> through </html>).

CRITICAL — THE LEARNER DOES THE MATH, NEVER THE SYSTEM

The single most important rule. If you violate any of these, the Critic rejects on Criterion 3.

L1. NEVER display the answer, the total, a running count, or the sum anywhere on screen while the learner is working. No labels like "Total: 5", no counters that update as the learner taps, no text showing the equation with the answer.
L2. NEVER show numbers ON the objects (no "3" printed on a group of dots). Show the OBJECTS only. The learner counts them.
L3. NEVER show the equation (e.g., "3 + 2 = 5") UNTIL AFTER the learner has submitted the correct answer. The equation appears as a RECORDING of what they did, not as a prompt.
L4. When the learner answers wrong, do NOT reveal the correct answer. Just say "Not quite" and let them try again. Wrong answers shake — they do not fade, disappear, or get crossed out (that would narrow the choices).
L5. The learner must COMMIT to an answer before getting feedback. No hover previews, no live validation, no "getting warmer" hints.
L6. Do NOT display "Round 1 of 5" or "3 correct" or any score counter during play. The learner focuses on the math, not on tracking progress.
L7. Answer options MUST be generated dynamically for each round based on that round's correct answer. Show 5 options: the correct value plus 4 wrong values close to it (within +/- 2 for small numbers, ratio-appropriate for larger numbers). The options must be DIFFERENT each round because the numbers in each round are different. NEVER hardcode the same set of answer options across rounds.

VISUAL QUALITY — MAKE IT LOOK LIKE AN EXPENSIVE GAME

V1. Use CSS animations extensively: objects bounce in when appearing, pulse when interactive, scale up on hover, glow when tapped. Every interaction needs visual feedback.
V2. Use CSS gradients on objects (not flat colors). Example: background: linear-gradient(135deg, #ef4444, #f87171) with box-shadow: 0 4px 16px rgba(239,68,68,0.4).
V3. Add a subtle particle or glow effect in the background. Use CSS-only animations (floating dots, pulsing circles, gradient shifts).
V4. Transitions between rounds should be smooth — fade out old content, fade in new content. Use CSS transition and animation properties.
V5. The success state should feel AMAZING — large animation, color burst, text that scales up with a spring effect.
V6. Wrong answer feedback should feel firm but not punishing — a quick shake animation, then reset smoothly.
V7. Objects should have a DEPTH feel: shadows, slight 3D transforms (translateZ, rotateX), layering.
V8. The overall feel: "this looks like it was made by a professional game studio, not a student project."

OUTPUT
Return ONLY the HTML. No markdown fences, no explanation, no commentary. Just the raw HTML starting with <!DOCTYPE html>.`
}

// ---------------------------------------------------------------------------
// Section renderers — each is responsible for one piece of the prompt and
// gracefully degrades when knowledge is missing.
// ---------------------------------------------------------------------------

function renderStandardSection(
  standardId: string,
  knowledge: StandardKnowledge
): string {
  const lines: string[] = []
  lines.push(`MATH STANDARD — ${standardId}`)
  lines.push(`Verbatim text: ${knowledge.standardText}`)
  if (knowledge.plainEnglish) {
    lines.push(`Plain-English meaning: ${knowledge.plainEnglish}`)
  }
  if (!knowledge.hasFullKnowledge) {
    // Make the LLM aware that the prompt is using a generic skeleton so it
    // sticks closely to the verbatim text rather than improvising.
    lines.push(
      `(Note: this standard does not yet have a Mr. Chesure knowledge file. ` +
        `Build STRICTLY to the verbatim text above. Do not import math from ` +
        `adjacent standards.)`
    )
  }
  return lines.join('\n')
}

function renderCpaSection(knowledge: StandardKnowledge): string {
  if (knowledge.cpaProgression && knowledge.hasFullKnowledge) {
    return `CONCRETE-PICTORIAL-ABSTRACT PROGRESSION (i.e., kids work with real objects first, then drawings, then symbols — Bruner 1966)

${knowledge.cpaProgression}

Your game should respect this progression: open with concrete or pictorial action; let symbols (numbers, equations) appear only AFTER the learner has acted, as a recording of what they did.`
  }
  return `CONCRETE-PICTORIAL-ABSTRACT PROGRESSION (i.e., kids work with real objects first, then drawings, then symbols — Bruner 1966)

The game should open with the learner acting on visible objects (or drawings), not with a written equation. Symbols (numerals, equations) appear AFTER the learner has acted, as a recording of what they did. Do not open with "3 + 2 = ?"`
}

function renderMisconceptionsSection(knowledge: StandardKnowledge): string {
  if (knowledge.misconceptions.length === 0) {
    return `MISCONCEPTIONS TO DESIGN AROUND

(No standard-specific misconceptions are loaded for this standard yet. Build the game so the learner cannot win by guessing, by random clicking, by counting on the system instead of themselves, or by reading numbers off labels.)`
  }
  const bullets = knowledge.misconceptions
    .slice(0, 8)
    .map((m) => `- ${m}`)
    .join('\n')
  return `KID MISCONCEPTIONS TO DESIGN AROUND (not test for — these are common mental glitches; the game should accommodate them gracefully and not punish them)

${bullets}`
}

function renderAntiPatternsSection(knowledge: StandardKnowledge): string {
  if (knowledge.antiPatterns.length === 0) return ''
  const bullets = knowledge.antiPatterns
    .slice(0, 8)
    .map((p) => `- ${p}`)
    .join('\n')
  return `ANTI-PATTERNS — DO NOT PRODUCE

${bullets}`
}

function renderExemplarSection(knowledge: StandardKnowledge): string {
  if (knowledge.exemplarMechanics.length === 0) return ''
  const bullets = knowledge.exemplarMechanics
    .slice(0, 5)
    .map((m) => `- ${m}`)
    .join('\n')
  return `EXEMPLAR MECHANICS THAT PASS THE FOUR CRITERIA (use these as inspiration; do not copy verbatim)

${bullets}`
}

function renderBuilderBriefSection(knowledge: StandardKnowledge): string {
  if (!knowledge.builderBriefGuidance) return ''
  return `BUILDER DESIGN-BRIEF GUIDANCE (Mr. Chesure's note for this standard)

${knowledge.builderBriefGuidance}`
}
