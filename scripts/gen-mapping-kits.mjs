// Generates docs/mapping-kits/<id>/{cc-text.md, progressions-excerpt.md, candidate-engines.md}
// Run: node scripts/gen-mapping-kits.mjs
import fs from 'node:fs';
import path from 'node:path';

const extract = JSON.parse(fs.readFileSync('docs/mapping-kits/_extract.json','utf8'));
const outRoot = 'docs/mapping-kits';

// --- Sub-id grouping (so parent files can list their sub-standards) ---
const subIds = {
  '1.NBT.B.2': ['1.NBT.B.2a','1.NBT.B.2b','1.NBT.B.2c'],
  '2.NBT.A.1': ['2.NBT.A.1a','2.NBT.A.1b'],
};

// --- Per-standard operation tag (for engine filtering) ---
// Drawn from CCSS text + Audit 11 §3 per-operation map.
const opTags = {
  // K.CC — counting & cardinality
  'K.CC.A.1': ['counting'],
  'K.CC.A.2': ['counting','counting-on'],
  'K.CC.A.3': ['counting','numeral-writing'],
  'K.CC.B.4': ['counting','cardinality'],
  'K.CC.B.4a': ['counting','one-to-one'],
  'K.CC.B.4b': ['counting','cardinality'],
  'K.CC.B.4c': ['counting','successor'],
  'K.CC.B.5': ['counting','cardinality'],
  'K.CC.C.6': ['comparison'],
  'K.CC.C.7': ['comparison'],
  // K.OA
  'K.OA.A.1': ['addition','subtraction','representation'],
  'K.OA.A.2': ['addition','subtraction','word-problem'],
  'K.OA.A.3': ['decomposition'],
  'K.OA.A.4': ['addition','partners-of-ten'],
  'K.OA.A.5': ['addition','subtraction','fluency'],
  // K.NBT
  'K.NBT.A.1': ['place-value','decomposition'],
  // 1.OA
  '1.OA.A.1': ['addition','subtraction','word-problem'],
  '1.OA.A.2': ['addition','word-problem'],
  '1.OA.B.3': ['addition','properties'],
  '1.OA.B.4': ['subtraction','unknown-addend'],
  '1.OA.C.5': ['counting-on','addition','subtraction'],
  '1.OA.C.6': ['addition','subtraction','fluency'],
  '1.OA.D.7': ['equality','equation'],
  '1.OA.D.8': ['unknown-addend','equation'],
  // 1.NBT
  '1.NBT.A.1': ['counting','numeral-writing'],
  '1.NBT.B.2': ['place-value'],
  '1.NBT.B.2a': ['place-value'],
  '1.NBT.B.2b': ['place-value','decomposition'],
  '1.NBT.B.2c': ['place-value'],
  '1.NBT.B.3': ['comparison','place-value'],
  '1.NBT.C.4': ['addition','place-value'],
  '1.NBT.C.5': ['place-value','mental-math'],
  '1.NBT.C.6': ['subtraction','place-value'],
  // 2.OA
  '2.OA.A.1': ['addition','subtraction','word-problem'],
  '2.OA.B.2': ['addition','subtraction','fluency'],
  '2.OA.C.3': ['parity','decomposition'],
  '2.OA.C.4': ['multiplication','array','repeated-addition'],
  // 2.NBT
  '2.NBT.A.1': ['place-value'],
  '2.NBT.A.1a': ['place-value'],
  '2.NBT.A.1b': ['place-value'],
  '2.NBT.A.2': ['counting','skip-counting'],
  '2.NBT.A.3': ['place-value','numeral-writing'],
  '2.NBT.A.4': ['comparison','place-value'],
  '2.NBT.B.5': ['addition','subtraction','place-value','fluency'],
  '2.NBT.B.6': ['addition','place-value'],
  '2.NBT.B.7': ['addition','subtraction','place-value','regrouping'],
  '2.NBT.B.8': ['addition','subtraction','mental-math','place-value'],
  '2.NBT.B.9': ['reasoning','place-value'],
  // 3.OA
  '3.OA.A.1': ['multiplication','equal-groups'],
};

// --- Canonical engine catalog (from Audit 11 §1) ---
// id => {title, verdict, op, note}
const engines = {
  'free-collect':           {t:'Free Collect',                 v:'VETTED',    op:'addition',       n:'Field IS the answer, no Check button.'},
  'conveyor-belt':          {t:'Liquid Mixing Tank',           v:'VETTED',    op:'addition',       n:'Tank level IS the sum.'},
  'split-the-loot':         {t:'Two Silos',                    v:'VETTED',    op:'decomposition', n:'Split a total into two parts; for K.OA.A.3 needs ≥3-splits enforcement.'},
  'free-balance':           {t:'Free Balance',                 v:'VETTED',    op:'addition',       n:'Beam IS the equation; supports unknown-addend.'},
  'mystery-side':           {t:'Mystery Side',                 v:'VETTED',    op:'unknown-addend', n:'Removes same from both — true algebraic identity.'},
  'shortest-route':         {t:'Shortest Route',               v:'VETTED',    op:'addition',       n:'Sum of distances; running total live.'},
  'map-builder':            {t:'Map Builder',                  v:'VETTED',    op:'addition',       n:'Live meter; addition + comparison (budget).'},
  'delivery-run':           {t:'Delivery Run',                 v:'VETTED',    op:'addition',       n:'Sum of distances.'},
  'stack-to-target':        {t:'Sinking Pan',                  v:'VETTED',    op:'addition',       n:'Pan height IS the sum.'},
  'fill-the-floor':         {t:'Resizable Rectangle',          v:'VETTED',    op:'multiplication', n:'Area = L×W readout live.'},
  'box-packer':             {t:'Transparent Cube Box',         v:'VETTED',    op:'multiplication', n:'Volume = L×W×H; cubes physically stack.'},
  'investment-sim':         {t:'Multiplication Array',         v:'VETTED',    op:'multiplication', n:'Visible dot-splitting; multiplication you see.'},
  'population-boom':        {t:'Visible Population',           v:'VETTED',    op:'multiplication', n:'×N as growth, visible.'},
  'doubling-maze':          {t:'Split-and-Double Path',        v:'VETTED',    op:'multiplication', n:'Stack visibly grows; doubling/tripling.'},
  'sorting-lane':           {t:'Weight Tower Builder',         v:'VETTED',    op:'comparison',     n:'Block widths show value; physics validates order.'},
  'leaderboard-fix':        {t:'Height Ranking',               v:'VETTED',    op:'comparison',     n:'Swap-by-tap ordering.'},
  'free-build':             {t:'Free Build (Perimeter)',       v:'VETTED',    op:'addition',       n:'Live perimeter meter — perimeter as addition of edges.'},
  'shape-decomposer':       {t:'Shape Decomposer',             v:'VETTED',    op:'addition',       n:'Filling regions IS decomposition + addition.'},
  'golden-beads':           {t:'Golden Beads',                 v:'VETTED',    op:'place-value',    n:'Wrong-column rejection enforces place value (3-digit).'},
  'stamp-game':             {t:'Stamp Game',                   v:'VETTED',    op:'place-value',    n:'Place value with thousands.'},
  'place-value-discs':      {t:'Place Value Discs',            v:'VETTED',    op:'place-value',    n:'Total readout IS the truth.'},
  'bead-chain':             {t:'Bead Chain',                   v:'VETTED',    op:'multiplication', n:'Skip-count; marker on chain shows N × groups.'},
  'checkerboard-multiply':  {t:'Checkerboard Multiply',        v:'VETTED',    op:'multiplication', n:'Equal-groups area model — strongest 3.OA engine.'},
  'cuisenaire-rods':        {t:'Cuisenaire Rods',              v:'VETTED',    op:'addition',       n:'Length-snap IS the answer; supports counting/composition.'},
  'bar-model':              {t:'Bar Model',                    v:'VETTED',    op:'addition',       n:'Singapore CPA canonical — add/sub/mult.'},
  'number-frames':          {t:'Number Frames',                v:'VETTED',    op:'addition',       n:'Ten-frame; reference implementation for K.OA.A.1/A.2/A.5.'},
  'number-frames-decompose':{t:'Number Frames — Decompose',    v:'REVISABLE', op:'decomposition', n:'Needs ≥3-distinct-splits to satisfy K.OA.A.3 multiplicity.'},
  'number-bonds':           {t:'Number Bonds',                 v:'REVISABLE', op:'decomposition', n:'Auto-revealing third short-circuits math; hide-third fix needed.'},
  'shape-matcher':          {t:'Shape Matcher',                v:'REVISABLE', op:'counting',       n:'Hide target picture to force counting.'},
  'recipe-mixer':           {t:'Recipe Mixer',                 v:'REVISABLE', op:'counting',       n:'Hide target counts to force counting.'},
  'assembly-line':          {t:'Assembly Line',                v:'VETTED',    op:'multiplication', n:'Two sliders for two factors; equal-groups.'},
  'potion-lab':             {t:'Potion Lab',                   v:'VETTED',    op:'multiplication', n:'Multiplier copies base; visible filling.'},
  'resize-tool':            {t:'Grid Stretcher',               v:'VETTED',    op:'multiplication', n:'Each cell becomes N×N — multiplication as scaling.'},
  'recipe-scaler':          {t:'Stacked Mixing Bowl',          v:'VETTED',    op:'multiplication', n:'Stack height = ×N of base; ratio reasoning concrete.'},
  'map-distance':           {t:'Draggable Scale Bar',          v:'VETTED',    op:'multiplication', n:'Each placement adds N; scaling and repeated addition.'},
  'expression-transformer': {t:'Expression Transformer',       v:'VETTED',    op:'algebra',        n:'Algebra tiles for combining like terms.'},
  'cut-the-bar':            {t:'Cut the Bar',                  v:'VETTED',    op:'fractions',      n:'Cuts must be equal; physics enforces; decomposition into equal parts.'},
  'category-sort':          {t:'Self-Revealing Buckets',       v:'VETTED',    op:'classification', n:'Hidden-rule discovery; supports parity / odd-even classification.'},
  'hundred-board':          {t:'Hundred Board',                v:'REVISABLE', op:'counting',       n:'Number-sequence / 100-chart; needs drag-and-place fix.'},
  'number-line-drop':       {t:'Number Line Drop',             v:'REVISABLE', op:'comparison',     n:'Number-sense magnitude; needs tighter snap + numerical readout.'},
  'size-picker':            {t:'Size Picker',                  v:'REVISABLE', op:'comparison',     n:'Comparison; needs forced unit mismatch.'},
};

// --- Per-standard candidate engine sets ---
// Built from Audit 11 §3's per-operation map, with cross-tagged engines added per Audit 11 notes.
const candidateMap = {
  // Counting / cardinality
  'K.CC.A.1':  ['number-frames','cuisenaire-rods','bar-model','hundred-board'],
  'K.CC.A.2':  ['number-frames','cuisenaire-rods','hundred-board','free-collect'],
  'K.CC.A.3':  ['number-frames','hundred-board','cuisenaire-rods'],
  'K.CC.B.4':  ['number-frames','cuisenaire-rods','bar-model','free-collect','shape-matcher','recipe-mixer'],
  'K.CC.B.4a': ['number-frames','free-collect','shape-matcher'],
  'K.CC.B.4b': ['number-frames','free-collect','bar-model'],
  'K.CC.B.4c': ['number-frames','cuisenaire-rods','hundred-board'],
  'K.CC.B.5':  ['number-frames','free-collect','cuisenaire-rods','bar-model','shape-matcher','recipe-mixer'],
  'K.CC.C.6':  ['sorting-lane','leaderboard-fix','cuisenaire-rods','number-line-drop'],
  'K.CC.C.7':  ['sorting-lane','leaderboard-fix','number-line-drop','size-picker'],
  // K.OA
  'K.OA.A.1':  ['number-frames','free-collect','conveyor-belt','bar-model','cuisenaire-rods','free-balance','stack-to-target'],
  'K.OA.A.2':  ['bar-model','number-frames','free-collect','cuisenaire-rods','free-balance','mystery-side'],
  'K.OA.A.3':  ['number-frames-decompose','split-the-loot','number-bonds','cuisenaire-rods','cut-the-bar','bar-model'],
  'K.OA.A.4':  ['number-frames','number-bonds','split-the-loot','free-balance','cuisenaire-rods'],
  'K.OA.A.5':  ['number-frames','free-collect','bar-model','cuisenaire-rods'],
  // K.NBT
  'K.NBT.A.1': ['golden-beads','place-value-discs','number-frames','cuisenaire-rods','bar-model'],
  // 1.OA
  '1.OA.A.1':  ['bar-model','number-frames','cuisenaire-rods','free-balance','mystery-side','free-collect','conveyor-belt'],
  '1.OA.A.2':  ['bar-model','number-frames','cuisenaire-rods','stack-to-target','conveyor-belt'],
  '1.OA.B.3':  ['bar-model','cuisenaire-rods','free-balance','number-frames'],
  '1.OA.B.4':  ['free-balance','mystery-side','bar-model','number-bonds','split-the-loot'],
  '1.OA.C.5':  ['number-frames','cuisenaire-rods','hundred-board','bar-model'],
  '1.OA.C.6':  ['number-frames','cuisenaire-rods','bar-model','free-collect','free-balance'],
  '1.OA.D.7':  ['free-balance','mystery-side','bar-model','expression-transformer'],
  '1.OA.D.8':  ['free-balance','mystery-side','bar-model','number-bonds','split-the-loot'],
  // 1.NBT
  '1.NBT.A.1': ['hundred-board','number-frames','cuisenaire-rods'],
  '1.NBT.B.2': ['golden-beads','place-value-discs','stamp-game','number-frames','cuisenaire-rods'],
  '1.NBT.B.2a':['golden-beads','place-value-discs','number-frames','cuisenaire-rods'],
  '1.NBT.B.2b':['golden-beads','place-value-discs','number-frames','cuisenaire-rods'],
  '1.NBT.B.2c':['golden-beads','place-value-discs','stamp-game'],
  '1.NBT.B.3': ['sorting-lane','leaderboard-fix','place-value-discs','number-line-drop'],
  '1.NBT.C.4': ['golden-beads','place-value-discs','bar-model','number-frames','cuisenaire-rods'],
  '1.NBT.C.5': ['hundred-board','place-value-discs','golden-beads'],
  '1.NBT.C.6': ['place-value-discs','golden-beads','bar-model','cuisenaire-rods'],
  // 2.OA
  '2.OA.A.1':  ['bar-model','number-frames','cuisenaire-rods','free-balance','mystery-side','conveyor-belt'],
  '2.OA.B.2':  ['number-frames','cuisenaire-rods','bar-model','free-balance'],
  '2.OA.C.3':  ['category-sort','number-frames','cuisenaire-rods','split-the-loot'],
  '2.OA.C.4':  ['investment-sim','assembly-line','checkerboard-multiply','fill-the-floor','bead-chain','number-frames'],
  // 2.NBT
  '2.NBT.A.1': ['golden-beads','stamp-game','place-value-discs'],
  '2.NBT.A.1a':['golden-beads','stamp-game','place-value-discs'],
  '2.NBT.A.1b':['golden-beads','stamp-game','place-value-discs'],
  '2.NBT.A.2': ['hundred-board','bead-chain','cuisenaire-rods'],
  '2.NBT.A.3': ['golden-beads','stamp-game','place-value-discs'],
  '2.NBT.A.4': ['sorting-lane','leaderboard-fix','place-value-discs','number-line-drop'],
  '2.NBT.B.5': ['golden-beads','stamp-game','place-value-discs','bar-model','number-frames'],
  '2.NBT.B.6': ['stamp-game','place-value-discs','bar-model'],
  '2.NBT.B.7': ['golden-beads','stamp-game','place-value-discs','bar-model'],
  '2.NBT.B.8': ['place-value-discs','hundred-board','stamp-game'],
  '2.NBT.B.9': ['bar-model','place-value-discs','golden-beads'],
  // 3.OA
  '3.OA.A.1':  ['investment-sim','assembly-line','checkerboard-multiply','bead-chain','population-boom','doubling-maze','potion-lab','fill-the-floor','bar-model','resize-tool','recipe-scaler','map-distance'],
};

// --- Progressions excerpts ---
// K.OA.A.1-5 use the in-repo Mr. Chesure knowledge file (paraphrase of K-5 OA Progression).
// Others get a placeholder pointing to canonical sources.

const PROG_URL_OA = 'https://mathematicalmusings.org/wp-content/uploads/2023/05/Progressions.pdf';
const PROG_URL_CC = PROG_URL_OA; // K-5 CC bundled in same compiled PDF (2023 edition)
const PROG_URL_NBT = PROG_URL_OA;

const koaCommonHeader = (id) => `# Progressions excerpt — ${id}

**Source:** *Progressions for the Common Core State Standards in Mathematics — K-5, Counting and Cardinality; K-5, Operations and Algebraic Thinking* (Common Core Standards Writing Team, 2011/2023 compiled edition).
**URL:** ${PROG_URL_OA}
**Local paraphrase (close to source, used by Mr. Chesure):** \`docs/agents/chesure-knowledge/k-oa-progressions.md\` — see linked section below.

This excerpt is a close paraphrase from the in-repo Mr. Chesure knowledge file, which itself paraphrases the K-5 OA Progression. For *verbatim* quotes, open the PDF at the URL above and search the K section.

`;

const koaExcerpts = {
  'K.OA.A.1': koaCommonHeader('K.OA.A.1') + `## What kids should be able to do
The kid takes a small joining or separating action and *shows it* using whichever of the 8 modes the standard calls for: objects, fingers, mental images, drawings, sounds (e.g., claps), acting out, verbal explanations, expressions, or equations. **Multiplicity of representation** is the standard — the same "4 + 2" shown several different ways — not addition-as-calculation.

## Common misconceptions
- **Counting all (vs counting on)** — child counts 1,2,3,4 then 5,6 instead of starting from 4. Allow but don't punish at this stage (Carpenter & Moser 1984).
- **Equation-as-instruction** — child reads "3 + 2 = ?" as a command to find 5 before manipulating anything. Hide the equation until after the action.
- **Operator misreading of \`=\`** — child reads \`=\` as "now do the answer." 70-80% of US 2nd-4th graders cannot solve \`8 + 4 = □ + 5\` (Knuth et al. 2006). Counter by alternating left/right placement in K (\`5 = 2 + 3\` AND \`2 + 3 = 5\`).
- **Mode-locked thinking** — child thinks "objects" is the math and "drawings" is just art. Cycle modes deliberately within a game.

## Developmental progression
- **Prerequisites (K.CC):** cardinality (K.CC.B.4), counting principles (K.CC.B.4a-c), count to "how many" (K.CC.B.5), and numeral writing (K.CC.A.3) for the equation/expression modes.
- **Next:** K.OA.A.2 (story-problem application), then 1.OA.A.1 (compare + unknown-in-all-positions).
- **Concrete → Pictorial → Symbolic:** real counters and fingers first, then dot-clusters and drawings, then expressions and equations — and equation always appears AFTER the physical action, as a recording.

## Recommended representations
Ten-frames (Math Learning Center canonical), fingers, dot patterns (subitizing-supported per Clements 1999), counters that the child physically pushes together, and a "recording" panel where the equation appears after the action.

## Cross-reference
Full per-standard treatment with exemplar mechanics and anti-patterns: \`docs/agents/chesure-knowledge/k-oa-progressions.md\` §2.1.
`,

  'K.OA.A.2': koaCommonHeader('K.OA.A.2') + `## What kids should be able to do
Given a story (e.g., "Maya has 3 stickers. Her friend gives her 2 more. How many now?"), the kid models the situation with objects or drawings and finds the total or remaining amount. The story comes first; the math is a tool to answer the story's question. All totals stay ≤ 10.

## Common misconceptions
- **Keyword strategy** — "more" means add, "left" means subtract. Short-term hack that breaks on Compare and Change-Unknown problems. Don't reward keyword-spotting.
- **Operation-tied-to-action-in-story** — child can solve a join story by physically joining but freezes on the same numbers in a compare frame (predicted by CGI; expected at K).
- **Number-out-of-context** — child can solve "3 + 2 = ?" but freezes on "3 stickers and 2 more stickers."

## Developmental progression
- **CGI problem types covered at K (Result-Unknown only):** Add To, Take From, Put Together, Take Apart-Both-Addends-Unknown.
- **Deferred to 1.OA:** Compare problems and Change-Unknown / Start-Unknown frames (Progression p. 9).
- **Prerequisites:** K.OA.A.1 (representation), K.CC.B.4 (cardinality).
- **Next:** 1.OA.A.1 widens to all four CGI categories with unknowns in all positions.

## Recommended representations
Acted-out story with physical or digital objects, then story-as-panel (illustration the child models into), then equation as recording. Familiar nouns the Player actually encounters work better than generic "objects."

## Cross-reference
\`docs/agents/chesure-knowledge/k-oa-progressions.md\` §2.2 (CGI taxonomy, exemplar mechanics, anti-patterns).
`,

  'K.OA.A.3': koaCommonHeader('K.OA.A.3') + `## What kids should be able to do
The kid takes a number (e.g., 5) and shows that it can be split into two parts in *several* ways: 5 = 1+4, 5 = 2+3, 5 = 3+2, etc. The **"more than one way"** clause is the load-bearing pedagogical move — not generating one decomposition, but multiple.

## Common misconceptions
- **One-and-done** — child gives one decomposition and treats the task as solved. The game must require multiple decompositions before advancing.
- **Number-as-fixed-thing** — child treats 5 as one entity, not as a collection of pairings. Show multiple decompositions side-by-side to make flexibility visible (Fosnot & Dolk 2001).
- **Missing-addend confusion** — child treats decompose tasks as completion tasks (\`5 = 2 + ?\`). That's K.OA.A.4 territory, not A.3.

## Developmental progression
- **Prerequisites:** K.OA.A.1 (representation), K.CC.B.4 (cardinality). Subitizing of small sets helps (Björklund & Reis 2020).
- **Next:** K.OA.A.4 (partner-of-10 as a specific decomposition), then 1.OA.B.3 (commutative + associative properties).
- **Foundation for:** part-part-whole thinking, which underlies regrouping and algebra (Fischer 1990).

## Recommended representations
Physical pile split into two zones with a visible record; number bond (circle with two branches); ten-frame with a draggable divider; equation row "5 = 2 + 3" and "5 = 1 + 4" stacked.

## Cross-reference
\`docs/agents/chesure-knowledge/k-oa-progressions.md\` §2.3 (full exemplar mechanics, the K.OA.A.3 multiplicity requirement, anti-patterns).
`,

  'K.OA.A.4': koaCommonHeader('K.OA.A.4') + `## What kids should be able to do
Given a starting number 1–9, the kid finds the *partner* that completes 10. Partner of 3 is 7; partner of 8 is 2. This is the foundation of the **make-a-ten** strategy used throughout grade 1 (8 + 5 = 8 + 2 + 3 = 10 + 3).

## Common misconceptions
- **Counting up from 1** — child counts 1, 2, 3… each time instead of counting on from the given number. Slow but not wrong.
- **Closing-the-frame-by-eye** — child fills empty ten-frame cells visually without counting. Construct-validity risk: child may "make 10" without knowing the partner is "7" if the partner number is never named or recorded.
- **Off-by-one** — partner of 9 is 1, partner of 1 is 9; children flip these. Common; addressed by varied practice.

## Developmental progression
- **Prerequisites:** K.OA.A.1, K.OA.A.3 (strongly helpful: partners-of-10 is a specific decomposition of 10), K.CC.A.1 (count to at least 20).
- **Next:** 1.OA.C.6 (make-a-ten bridging strategy), 1.OA.B.4 (subtraction as unknown-addend, e.g., 10 − 8 = ?).

## Recommended representations
Ten-frame with N counters pre-placed; child taps empty cells one at a time to fill (counting must be by the child, not the system). Number-bond with 10 at top, one branch labeled N, the other blank. Equation as recording, alternating placement.

## Cross-reference
\`docs/agents/chesure-knowledge/k-oa-progressions.md\` §2.4.
`,

  'K.OA.A.5': koaCommonHeader('K.OA.A.5') + `## What kids should be able to do
For any addition or subtraction problem with both addends ≤ 5 and total ≤ 5, the kid produces an answer within a few seconds, using an efficient strategy — count-on, known fact, or derived fact.

## Common misconceptions
- **Speed-as-fluency confusion** — child or Builder thinks fluency means "fast or you fail." Per Baroody (2006) and the Progression (p. 9), K-level fluency means *efficient strategy use*, not flashcard recall. Time pressure at K harms fluency development.
- **Memorize-don't-derive** — child memorizes 3+2=5 without internalizing the structure. Brittle.
- **Subtraction as separate skill** — child treats subtraction as a different operation rather than as the inverse of addition. Address with mixed practice.

## Developmental progression
- **Prerequisites:** K.OA.A.1, A.2, A.3 — all conceptual foundations.
- **Next:** 1.OA.C.6 (within 20, fluency within 10), 2.OA.B.2 (within 20, know from memory all sums of two one-digit numbers).

## Recommended representations
Mixed-practice fact-set with no visible timer. "How did you solve it?" strategy reveal (counted on / just knew / counted them all) — Math Learning Center pattern. Derived-fact prompts (2+3, then 2+4).

## Cross-reference
\`docs/agents/chesure-knowledge/k-oa-progressions.md\` §2.5.
`,
};

function progressionsExcerpt(id, node, cluster) {
  if (koaExcerpts[id]) return koaExcerpts[id];

  const domain = node.domain;
  let url = PROG_URL_OA;
  if (node.domainCode === 'CC') url = PROG_URL_CC;
  else if (node.domainCode === 'NBT') url = PROG_URL_NBT;

  return `# Progressions excerpt — ${id}

**[FETCH FAILED — manual lookup needed]**

**Canonical source:** *Progressions for the Common Core State Standards in Mathematics* (Common Core Standards Writing Team, 2011/2023 compiled edition). Look for the section on **${domain}** (${node.domainCode}) at grade ${node.grade}, cluster ${cluster ? cluster.id : node.cluster}.

**URL:** ${url}

**Note for the drafter:** The compiled Progressions PDF exceeded the WebFetch size limit during Phase 0 prefetch; the individual K-5 ${node.domainCode} PDF that used to live on \`commoncoretools.me\` is no longer hosted at its original URL. Open the compiled PDF above (it bundles K-5 CC/OA, K-5 NBT, K-5 MD/G, and 3-5 NF) and extract a 200-500 word excerpt that names:

1. **What kids should be able to do** at this standard.
2. **Common misconceptions** at this developmental moment.
3. **Developmental progression** — what earlier standard this builds on and what later standard depends on it (where it sits between earlier and later skills).
4. **Recommended teaching representations** — base-ten blocks, ten-frames, number lines, place-value discs, bar models, drawings, etc.

**Cross-references that may already cover this standard's progression material in the repo:**

${(() => {
  const refs = [];
  if (id.startsWith('K.OA')) refs.push('- `docs/agents/chesure-knowledge/k-oa-progressions.md` — full K.OA cluster (paraphrase of K-5 OA Progression)');
  if (id.startsWith('K.CC')) refs.push('- `docs/agents/chesure-knowledge/k-oa-progressions.md` §3.6 — counting principles (Gelman & Gallistel 1978); §1 — K.CC prerequisites for K.OA work');
  if (id.startsWith('1.OA')) refs.push('- `docs/agents/chesure-knowledge/k-oa-progressions.md` §3.3 — CGI problem types (Compare, Change-Unknown, Start-Unknown move into 1.OA from K)');
  refs.push('- *K-5 OA Progression* (the 2011 standalone PDF, referenced throughout `chesure-knowledge/k-oa-progressions.md`)');
  if (node.domainCode === 'NBT') refs.push('- *K-5 NBT Progression* — the canonical source for tens-and-ones, regrouping, and the standard algorithms; bundled in the same 2023 compiled PDF');
  return refs.join('\n');
})()}

## Plain-English summary (drafter to expand from Progressions PDF)

**Verbatim standard:** *"${node.description.replace(/"/g,'\\"')}"*

**Cluster:** ${cluster ? cluster.description : '(see cc-text.md)'}

This standard sits in the ${domain} domain at grade ${node.grade}. ${node.classification === 'major' ? 'It is a **major** standard for the grade.' : 'It is a **supporting** standard.'} The Phase 1-5 drafter should open the Progressions PDF and write the 200-500 word excerpt here, then delete this template's [FETCH FAILED] banner.
`;
}

// --- CC-TEXT generator ---
function ccText(id, e) {
  const node = e.node;
  const cluster = e.cluster;
  const lines = [];
  lines.push(`# CCSS verbatim — ${id}`);
  lines.push('');
  lines.push(`**Grade:** ${node.grade}`);
  lines.push(`**Domain:** ${node.domain} (${node.domainCode})`);
  lines.push(`**Cluster:** ${cluster ? cluster.id : node.cluster} — ${cluster ? cluster.description : '(none in JSON)'}`);
  lines.push(`**Classification:** ${node.classification}${node.isHub ? ' · hub standard' : ''}`);
  if (node.mathematicalPractices && node.mathematicalPractices.length) {
    lines.push(`**Mathematical Practices linked:** ${node.mathematicalPractices.join(', ')}`);
  }
  lines.push('');
  lines.push('## Verbatim text');
  lines.push('');
  lines.push(`> ${node.description}`);
  lines.push('');
  if (subIds[id]) {
    lines.push('## Sub-standards (separate nodes in `src/data/standards.json`)');
    lines.push('');
    for (const sid of subIds[id]) {
      const sn = extract[sid] && extract[sid].node;
      if (sn) lines.push(`- **${sid}** — ${sn.description}`);
    }
    lines.push('');
  }
  // back-reference to parent if this IS a sub-id
  const parentId = Object.entries(subIds).find(([p, kids]) => kids.includes(id));
  if (parentId) {
    lines.push(`## Parent standard`);
    lines.push('');
    lines.push(`This standard is a sub-id of **${parentId[0]}**. See \`docs/mapping-kits/${parentId[0]}/cc-text.md\`.`);
    lines.push('');
  }
  lines.push('## Source');
  lines.push('');
  lines.push('Extracted verbatim from `src/data/standards.json` (the project\'s canonical standards graph).');
  lines.push('');
  return lines.join('\n');
}

// --- CANDIDATE ENGINES generator ---
function candidateEngines(id, e) {
  const tags = opTags[id] || [];
  const candidates = candidateMap[id] || [];
  const lines = [];
  lines.push(`# Candidate engines — ${id}`);
  lines.push('');
  lines.push(`**Standard:** ${e.node.description}`);
  lines.push('');
  lines.push(`**Math operations named in this standard:** ${tags.join(', ') || '(none extracted)'}`);
  lines.push('');
  lines.push('## How this list was built');
  lines.push('');
  lines.push('- Engines pulled from `src/lib/game-engines/game-option-registry.ts` (66 engines).');
  lines.push('- Verdict + operation tag pulled from `docs/audit/11-engine-library-per-engine.md` §1 per-engine table.');
  lines.push('- Engines whose Audit 11 operation tag matches the standard\'s named operation, plus cross-tagged engines flagged in Audit 11 §3.');
  lines.push('- **Audit 11b (new-engines walk) does NOT yet exist** at the time this kit was generated — recommend checking `docs/audit/11b-*.md` for any newer verdicts before drafting.');
  lines.push('');
  lines.push('Phase 1-5 drafters: this is a *candidate* list, not a final ranking. Pick PRIMARY / SECONDARY from here.');
  lines.push('');
  lines.push('## Candidates');
  lines.push('');
  lines.push('| Engine ID | Title | Verdict | Reason it\'s plausible for this standard |');
  lines.push('|---|---|---|---|');
  for (const eid of candidates) {
    const eng = engines[eid];
    if (!eng) {
      lines.push(`| \`${eid}\` | *(not in Audit 11 table — check Audit 11b or registry)* | — | candidate per cross-tag |`);
    } else {
      lines.push(`| \`${eid}\` | ${eng.t} | ${eng.v} | ${eng.n} |`);
    }
  }
  lines.push('');
  lines.push('## Caveats');
  lines.push('');
  lines.push('- **VETTED** engines pass all 4 Critic criteria (real-world scenario, math IS gameplay, no shortcut, construct validity) per Audit 11.');
  lines.push('- **REVISABLE** engines have a known fix listed in Audit 11 §2; use only if the drafter accepts the fix is in scope.');
  lines.push('- **HIDDEN** engines should not appear here; if one does, it\'s a candidate-list bug.');
  lines.push('- Engines may pass a generic operation tag but fail a specific standard\'s construct validity (e.g., `split-the-loot` passes for general addition decomposition but fails K.OA.A.3\'s multiplicity unless the ≥3-splits fix is applied).');
  lines.push('');
  return lines.join('\n');
}

// --- Generate ---
const allIds = Object.keys(extract);
const status = []; // {id, cc, prog, engines}

for (const id of allIds) {
  const dir = path.join(outRoot, id);
  fs.mkdirSync(dir, { recursive: true });

  const e = extract[id];

  // cc-text.md
  const cc = ccText(id, e);
  fs.writeFileSync(path.join(dir, 'cc-text.md'), cc);

  // progressions-excerpt.md
  const prog = progressionsExcerpt(id, e.node, e.cluster);
  fs.writeFileSync(path.join(dir, 'progressions-excerpt.md'), prog);

  // candidate-engines.md
  const eng = candidateEngines(id, e);
  fs.writeFileSync(path.join(dir, 'candidate-engines.md'), eng);

  const progComplete = !prog.includes('[FETCH FAILED');
  status.push({ id, cc: true, prog: progComplete, engines: true });
}

// --- 00-index.md ---
const idx = [];
idx.push('# Mapping kits — index');
idx.push('');
idx.push(`*Generated: ${new Date().toISOString()} · ${allIds.length} kits.*`);
idx.push('');
idx.push('Phase 0 Step 0.3 prefetch for the K-2 number-and-operations + 3.OA.A.1 mapping work. Each folder contains three files: `cc-text.md`, `progressions-excerpt.md`, `candidate-engines.md`.');
idx.push('');
idx.push('## Status by standard');
idx.push('');
idx.push('| Standard | cc-text | progressions-excerpt | candidate-engines |');
idx.push('|---|---|---|---|');
for (const s of status) {
  idx.push(`| [${s.id}](./${s.id}/) | ${s.cc ? '✓' : '—'} | ${s.prog ? '✓' : '⚠ placeholder'} | ${s.engines ? '✓' : '—'} |`);
}
idx.push('');
idx.push('## Notes');
idx.push('');
idx.push(`- **Progressions excerpts:** authentic, in-repo paraphrase content exists for K.OA.A.1 through K.OA.A.5 (sourced from \`docs/agents/chesure-knowledge/k-oa-progressions.md\`).`);
const placeholderIds = status.filter(s=>!s.prog).map(s=>s.id);
idx.push(`- The remaining ${placeholderIds.length} standards have **placeholder** \`progressions-excerpt.md\` files with a [FETCH FAILED — manual lookup needed] banner and a link to the compiled Progressions PDF at https://mathematicalmusings.org/wp-content/uploads/2023/05/Progressions.pdf. The PDF exceeded WebFetch's 10MB content limit during Phase 0; the K-5 CC/OA standalone PDF that used to live on \`commoncoretools.me\` is no longer hosted at its original URL.`);
idx.push(`- **Audit 11b (new-engines walk) does NOT yet exist** at generation time. Every \`candidate-engines.md\` includes a note recommending Phase 1-5 drafters check for \`docs/audit/11b-*.md\` before locking PRIMARY / SECONDARY choices.`);
idx.push(`- **Sub-ID coverage:** \`1.NBT.B.2a\`, \`1.NBT.B.2b\`, \`1.NBT.B.2c\`, \`2.NBT.A.1a\`, \`2.NBT.A.1b\` were found as separate nodes in \`src/data/standards.json\` beyond the original scope list and have full kits.`);
idx.push('');
idx.push('## Standards with FETCH FAILED placeholder for progressions');
idx.push('');
for (const id of placeholderIds) idx.push(`- ${id}`);
idx.push('');
fs.writeFileSync(path.join(outRoot, '00-index.md'), idx.join('\n'));

console.log('Generated', allIds.length, 'kits.');
console.log('Placeholder progressions (need manual fetch):', placeholderIds.length);
console.log('Authentic progressions:', allIds.length - placeholderIds.length);
