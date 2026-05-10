/**
 * standard-knowledge.ts
 *
 * Loads pedagogical knowledge for a given Common Core standard. Used by the
 * generation prompt composer (`agent-prompts/generate-game.ts`) so each
 * generated game's prompt is grounded in the standard's actual pedagogy
 * rather than a hard-coded "K.OA.A.1 ADDITION ONLY" string.
 *
 * Architecture:
 *   1. `standards.json` is the source of truth for the verbatim CCSS text +
 *      classification (grade, domain, cluster).
 *   2. For clusters that have a Mr. Chesure knowledge file (today: K.OA only,
 *      at `docs/agents/chesure-knowledge/k-oa-progressions.md`), we extract
 *      the per-standard section via simple regex parsing — no markdown
 *      library, just heading-based section slicing.
 *   3. For clusters WITHOUT a knowledge file, we return a minimal fallback
 *      shape so generation still works: standard text plus the four Critic
 *      criteria, but no specific misconceptions or CPA progression. The
 *      `hasFullKnowledge` flag tells callers which case they're in.
 *
 * Spec: docs/superpowers/specs/2026-05-10-library-design.md §15.1 item 2
 *       (Foundation Issue #5 — fix the prompt-vs-standard mismatch).
 *
 * Audit: docs/audit/09-build-flow.md §4 item 5.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StandardNode {
  id: string
  description: string
  domain: string
  domainCode: string
  cluster: string
  grade: string
  classification: string
  isHub: boolean
}

interface StandardsFile {
  nodes: StandardNode[]
  edges: unknown[]
}

/**
 * The composed knowledge a prompt builder uses for a given standard.
 *
 * Fields are populated from a Mr. Chesure knowledge file when one exists for
 * the standard's cluster; otherwise filled with safe minimal fallbacks (the
 * verbatim CCSS text + the four Critic criteria, no specific misconceptions
 * or CPA stages).
 */
export interface StandardKnowledge {
  standardId: string
  /** Verbatim CCSS text from standards.json (the `description` field). */
  standardText: string
  /** Plain-English paraphrase pulled from the knowledge file, or empty. */
  plainEnglish: string
  /**
   * Concrete-Pictorial-Abstract progression notes (i.e., the 3 stages a kid
   * works through: real objects → drawings → symbols).
   */
  cpaProgression: string
  /** Top kid misconceptions to design AROUND (not test for). */
  misconceptions: string[]
  /** Mechanics that have been shown to pass the four Critic criteria. */
  exemplarMechanics: string[]
  /** Patterns that automatically FAIL — the LLM must avoid these. */
  antiPatterns: string[]
  /**
   * The Builder design-brief paragraph for this standard, as written by Mr.
   * Chesure. Empty when no knowledge file covers this standard.
   */
  builderBriefGuidance: string
  /**
   * True when a real per-standard section was extracted from a knowledge
   * file. False when the fallback skeleton was used.
   */
  hasFullKnowledge: boolean
  /** Where the knowledge came from, for logging / debugging. */
  source:
    | { kind: 'knowledge-file'; path: string; sectionHeading: string }
    | { kind: 'fallback'; reason: string }
}

// ---------------------------------------------------------------------------
// Caches (module-level so repeated requests in the same Node process don't
// re-read disk; Next.js route handlers run in a long-lived process).
// ---------------------------------------------------------------------------

let standardsCache: Map<string, StandardNode> | null = null
const knowledgeFileCache: Map<string, string> = new Map()

async function loadStandards(): Promise<Map<string, StandardNode>> {
  if (standardsCache) return standardsCache
  // process.cwd() at runtime is the project root for Next.js routes.
  const filePath = path.join(process.cwd(), 'src', 'data', 'standards.json')
  const raw = await fs.readFile(filePath, 'utf-8')
  const parsed = JSON.parse(raw) as StandardsFile
  const map = new Map<string, StandardNode>()
  for (const node of parsed.nodes) {
    map.set(node.id, node)
  }
  standardsCache = map
  return map
}

async function loadKnowledgeFileForCluster(
  cluster: string
): Promise<string | null> {
  // Today only K.OA has a knowledge file. As more are written, add lookups
  // here. The map key is the cluster prefix (grade + domainCode), e.g.
  // "K.OA" for K.OA.A.1, K.OA.A.2, etc.
  const cluserToFile: Record<string, string> = {
    'K.OA': 'k-oa-progressions.md',
  }
  const filename = cluserToFile[cluster]
  if (!filename) return null

  const cached = knowledgeFileCache.get(cluster)
  if (cached !== undefined) return cached

  const filePath = path.join(
    process.cwd(),
    'docs',
    'agents',
    'chesure-knowledge',
    filename
  )
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    knowledgeFileCache.set(cluster, raw)
    return raw
  } catch {
    // File missing (e.g. symlink not present in this checkout). Treat as
    // no-knowledge.
    return null
  }
}

// ---------------------------------------------------------------------------
// Knowledge-file section extraction
// ---------------------------------------------------------------------------

/**
 * Pull the section of the knowledge markdown that covers a specific standard.
 *
 * The k-oa-progressions.md file uses this convention:
 *   ### 2.1 K.OA.A.1 — Represent addition and subtraction in 8 different ways
 *   ...
 *   ### 2.2 K.OA.A.2 — Add and subtract within 10 in word problems
 *
 * We slice from the heading whose text contains the standard ID, up to the
 * next sibling `### ` heading or the next `---` horizontal rule.
 */
function extractStandardSection(
  markdown: string,
  standardId: string
): { sectionHeading: string; body: string } | null {
  const lines = markdown.split('\n')
  let startIdx = -1
  let headingText = ''
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('### ') && line.includes(standardId)) {
      startIdx = i
      headingText = line.replace(/^###\s+/, '').trim()
      break
    }
  }
  if (startIdx === -1) return null

  let endIdx = lines.length
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('### ')) {
      endIdx = i
      break
    }
    // A top-level `---` between subsections also ends a section in this file
    // (each subsection is followed by `---`).
    if (line.trim() === '---') {
      endIdx = i
      break
    }
  }

  return {
    sectionHeading: headingText,
    body: lines.slice(startIdx + 1, endIdx).join('\n').trim(),
  }
}

/**
 * Pull bullet items from the body that follow a heading like "**Anti-patterns
 * / red flags:**". Returns trimmed bullet text without leading markers.
 */
function extractBulletsAfterHeading(
  body: string,
  headingPattern: RegExp
): string[] {
  const lines = body.split('\n')
  let inSection = false
  const bullets: string[] = []
  for (const line of lines) {
    if (headingPattern.test(line)) {
      inSection = true
      continue
    }
    if (inSection) {
      // Stop at next bold heading or markdown horizontal rule.
      if (/^\*\*[^*]+\*\*\s*[:.]?\s*$/.test(line.trim()) && !headingPattern.test(line)) {
        break
      }
      if (line.trim() === '---' || line.startsWith('### ')) break

      const m = line.match(/^[-*]\s+(.*)$/) ||
        line.match(/^\d+\.\s+(.*)$/)
      if (m) {
        // Strip leading emoji/marker like "❌ "
        const cleaned = m[1].replace(/^[❌✅⚠️]\s*/, '').trim()
        if (cleaned.length > 0) bullets.push(cleaned)
      } else if (bullets.length > 0 && line.trim() === '') {
        // Blank line after a list ends the list.
        if (bullets.length >= 1) break
      }
    }
  }
  return bullets
}

/** Pull the table rows under "Common kid misconceptions" as flat statements. */
function extractMisconceptionsFromTable(body: string): string[] {
  const lines = body.split('\n')
  const out: string[] = []
  let inTable = false
  let sawHeader = false
  for (const line of lines) {
    if (/Common kid misconceptions/i.test(line)) {
      inTable = true
      continue
    }
    if (!inTable) continue
    if (line.trim().startsWith('|')) {
      // Table row
      if (/^\|\s*-/.test(line)) {
        sawHeader = true
        continue
      }
      if (!sawHeader) continue
      const cells = line.split('|').map((c) => c.trim()).filter(Boolean)
      if (cells.length >= 2) {
        // First cell is the misconception name (often **bolded**), second is
        // what it looks like. Combine them into one plain sentence.
        const name = cells[0].replace(/\*\*/g, '').replace(/\([^)]*\)/, '').trim()
        const looksLike = cells[1] ? cells[1].trim() : ''
        if (name) {
          out.push(looksLike ? `${name} — ${looksLike}` : name)
        }
      }
    } else if (inTable && line.trim() === '') {
      // Blank line ends table only if we already collected rows
      if (out.length > 0) break
    } else if (inTable && !line.trim().startsWith('|') && line.trim() !== '') {
      // Non-table content after table — stop.
      if (out.length > 0) break
    }
  }
  // Also pick up bullet-style misconceptions (some standards in the file use
  // bullets instead of tables, e.g. K.OA.A.4).
  if (out.length === 0) {
    const bullets = extractBulletsAfterHeading(
      body,
      /\*\*Common kid misconceptions/i
    )
    out.push(...bullets)
  }
  return out
}

function extractCpaProgression(body: string): string {
  const lines = body.split('\n')
  let inSection = false
  const captured: string[] = []
  for (const line of lines) {
    if (/Concrete-pictorial-abstract progression|CPA progression/i.test(line)) {
      inSection = true
      continue
    }
    if (inSection) {
      if (/^\*\*[^*]+\*\*\s*[:.]?\s*$/.test(line.trim()) &&
          !/progression/i.test(line)) {
        break
      }
      if (line.trim() === '---' || line.startsWith('### ')) break
      captured.push(line)
      // Stop after we hit the next blank-blank gap once we have content.
      if (captured.length > 12 && line.trim() === '') break
    }
  }
  return captured.join('\n').trim()
}

function extractBuilderBrief(body: string): string {
  // Look for "**Builder design-brief guidance" or "Specific Builder-design-brief"
  // followed by a blockquote.
  const match = body.match(
    /\*\*[^*]*[Bb]uilder[^*]*-?[Dd]esign-?[Bb]rief[^*]*\*\*[^\n]*\n+>\s*([\s\S]*?)(?:\n\n---|\n###|\n\*\*[^*]+\*\*)/
  )
  if (match) {
    return match[1]
      .split('\n')
      .map((l) => l.replace(/^>\s?/, ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return ''
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Load pedagogical knowledge for a Common Core standard.
 *
 * Always returns a `StandardKnowledge` object. If the standard has a Mr.
 * Chesure knowledge file covering it, fields are populated from that file.
 * If not, fields contain safe minimal fallbacks and `hasFullKnowledge` is
 * `false` — callers can still compose a correct prompt, just without
 * standard-specific misconceptions or CPA notes.
 *
 * @param standardId e.g. "K.OA.A.1", "3.OA.A.1"
 */
export async function loadStandardKnowledge(
  standardId: string
): Promise<StandardKnowledge> {
  const standards = await loadStandards()
  const node = standards.get(standardId)
  const standardText =
    node?.description ??
    `(Standard ${standardId} text not found in standards.json)`

  // Cluster lookup key, e.g. "K.OA" from "K.OA.A.1".
  const cluster = node ? `${node.grade}.${node.domainCode}` : ''
  const knowledgeMd = cluster
    ? await loadKnowledgeFileForCluster(cluster)
    : null

  if (knowledgeMd) {
    const section = extractStandardSection(knowledgeMd, standardId)
    if (section) {
      const misconceptions = extractMisconceptionsFromTable(section.body)
      const exemplarMechanics = extractBulletsAfterHeading(
        section.body,
        /\*\*Exemplar mechanics/i
      )
      const antiPatterns = extractBulletsAfterHeading(
        section.body,
        /\*\*Anti-patterns/i
      )
      const cpaProgression = extractCpaProgression(section.body)
      const builderBriefGuidance = extractBuilderBrief(section.body)

      // Pull the plain-English paraphrase if present (line starting with
      // "**Plain-English translation:**").
      const plainMatch = section.body.match(
        /\*\*Plain-English translation:\*\*\s*([\s\S]*?)(?:\n\n|$)/
      )
      const plainEnglish = plainMatch ? plainMatch[1].trim() : ''

      return {
        standardId,
        standardText,
        plainEnglish,
        cpaProgression,
        misconceptions,
        exemplarMechanics,
        antiPatterns,
        builderBriefGuidance,
        hasFullKnowledge: true,
        source: {
          kind: 'knowledge-file',
          path: `docs/agents/chesure-knowledge/(cluster ${cluster})`,
          sectionHeading: section.sectionHeading,
        },
      }
    }
    // Knowledge file exists for cluster but no per-standard section matched.
    // Fall through to fallback below, but note the reason.
    return buildFallback(
      standardId,
      standardText,
      `Knowledge file for ${cluster} found but had no section for ${standardId}.`
    )
  }

  return buildFallback(
    standardId,
    standardText,
    cluster
      ? `No knowledge file for cluster ${cluster} yet — using generic skeleton.`
      : `Standard ${standardId} not found in standards.json — using generic skeleton.`
  )
}

/**
 * Minimal-knowledge skeleton used when no per-standard knowledge file
 * section is available. Every standard generates a *correct* prompt this
 * way — the prompt just lacks standard-specific misconceptions and CPA
 * detail. As more knowledge files get written, fewer standards hit this
 * path.
 */
function buildFallback(
  standardId: string,
  standardText: string,
  reason: string
): StandardKnowledge {
  return {
    standardId,
    standardText,
    plainEnglish: '',
    cpaProgression: '',
    misconceptions: [],
    exemplarMechanics: [],
    antiPatterns: [],
    builderBriefGuidance: '',
    hasFullKnowledge: false,
    source: { kind: 'fallback', reason },
  }
}

/** For tests / dev tooling: clear the in-process caches. */
export function _resetStandardKnowledgeCacheForTesting(): void {
  standardsCache = null
  knowledgeFileCache.clear()
}
