---
name: eric-search
description: Search the ERIC (Education Resources Information Center) database for authoritative published education research, including peer-reviewed journal articles, dissertations, conference papers, curriculum reports, and grey literature indexed by the U.S. Department of Education's Institute of Education Sciences. Use this skill whenever the user asks for education research, math education research, learning science sources, pedagogical evidence, game-based learning studies, curriculum research, or anything involving teaching, instruction, classroom practice, K-12, or higher education evidence — especially when they want peer-reviewed or authoritative published sources. Prefer this skill over general web search or arXiv-based skills for any education-research question, since ERIC indexes 1.6M+ education-specific records (including grey literature) that Semantic Scholar and OpenAlex miss.
---

# ERIC Search

Searches the ERIC database via its free public API at `https://api.ies.ed.gov/eric/`. No API key required.

## When to use

Trigger on any request for education research, especially:

- Math education and math pedagogy ("equal-groups instruction", "fraction sense", "concrete-representational-abstract")
- Game-based learning, gamification, educational games, serious games
- Learning science, cognitive load, retrieval practice, spaced practice in classroom contexts
- Curriculum, instructional design, assessment, classroom practice
- K-12, early childhood, higher education, teacher preparation
- Any request for "peer-reviewed" or "authoritative" sources on a teaching/learning topic

If the user is asking about education research, prefer this skill **before** falling back to arXiv- or Semantic-Scholar-based skills. ERIC catches grey literature (dissertations, conference papers, curriculum reports, IES technical reports) that the academic-API-only skills miss.

## How to use

The script `scripts/search_eric.py` handles all API calls. Invoke it from the skill directory:

```bash
python scripts/search_eric.py --query "QUERY" [options]
```

### Common patterns

**Quick peer-reviewed search** (default — peer-reviewed only, 25 results):
```bash
python scripts/search_eric.py --query "game-based learning mathematics elementary"
```

**Recent only** (filter by year):
```bash
python scripts/search_eric.py --query "fraction instruction" --from-year 2018
```

**Restrict to specific publication type**:
```bash
python scripts/search_eric.py --query "multiplication strategies" --pub-type "Journal Articles"
```
Common values: `Journal Articles`, `Reports - Research`, `Dissertations/Theses`, `Speeches/Meeting Papers`, `Reports - Descriptive`.

**Search by ERIC thesaurus descriptor** (most precise — uses the controlled vocabulary):
```bash
python scripts/search_eric.py --query 'subject:"Educational Games"'
python scripts/search_eric.py --query 'subject:"Mathematics Instruction" AND subject:"Educational Games"'
```

**Title-only search** (high-precision):
```bash
python scripts/search_eric.py --query 'title:"game-based learning"'
```

**Include non-peer-reviewed** (for grey literature, IES reports, dissertations):
```bash
python scripts/search_eric.py --query "math anxiety intervention" --no-peer-reviewed-only
```

**Get more results** (max 200 per page):
```bash
python scripts/search_eric.py --query "manipulatives elementary math" --rows 100
```

### Output

The script prints structured JSON to stdout — one record per result, with: `id` (ERIC accession number, e.g. `EJ1234567` for journal, `ED1234567` for non-journal), `title`, `authors`, `source` (journal name), `year`, `peer_reviewed`, `descriptors`, `education_level`, `abstract` (truncated to 500 chars), and `url` (link to ERIC record; full text link if available).

Use `--full-abstract` to get untruncated abstracts when you need to assess relevance carefully.

## Workflow tips

1. **Start broad, then narrow with descriptors.** Run a keyword query first, scan the `descriptors` field of the top hits to find the right ERIC thesaurus terms, then re-run with `subject:"..."` for precision.
2. **Always prefer peer-reviewed for cited claims.** The default is `--peer-reviewed-only`. Only disable it when you specifically want grey literature (dissertations, IES reports).
3. **Cite by ERIC ID + URL.** Every record has a stable ERIC accession number — include it in citations so the user can verify directly.
4. **Don't fabricate fields.** If the API doesn't return an author or year, say so — never fill it in from prior knowledge. ERIC records sometimes have missing metadata; flag it rather than hallucinate.
5. **Combine with an academic-API skill for a complete picture.** ERIC is strongest on K-12 and applied education research; pair it with Semantic Scholar / OpenAlex (via agent-research-skills) for cognitive-science and learning-sciences journals that aren't in ERIC.

## ERIC ID prefix reference

- `EJ` = Journal article (peer-reviewed status varies; check the `peer_reviewed` field)
- `ED` = Non-journal document (reports, dissertations, conference papers, curriculum guides — i.e., grey literature)

## Failure modes

- **HTTP 4xx/5xx**: The script prints the status code and body to stderr and exits non-zero. Most often a malformed query — try simpler keywords first.
- **Empty results**: Try fewer keywords, drop quotes, or remove the peer-reviewed filter. ERIC's matching is fairly strict.
- **`Host not in allowlist` or connection errors**: The runtime environment is blocking `api.ies.ed.gov`. Add it to the network allowlist or run the skill on a host with outbound HTTPS access.
