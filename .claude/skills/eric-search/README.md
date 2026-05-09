# eric-search

A Claude Code skill that searches the **ERIC** (Education Resources Information Center) database — the U.S. Department of Education's index of 1.6M+ education research records, including the grey literature (dissertations, conference papers, IES reports) that arXiv / Semantic Scholar / OpenAlex don't cover.

Hits the free public API at `https://api.ies.ed.gov/eric/`. **No API key required.** Stdlib-only (Python 3.7+) — no `pip install` needed.

## Why this skill exists

`agent-research-skills` (lingzhi227) covers Semantic Scholar / OpenAlex / arXiv / CrossRef, but those databases under-index education research. ERIC is the canonical source for K-12 / pedagogy / curriculum / game-based-learning research and catches grey literature the others miss. This skill closes that gap.

## Verify the install

```bash
cd .claude/skills/eric-search
python scripts/test_normalize.py
python scripts/search_eric.py --query "game-based learning mathematics" --rows 3
```

## Quick-start examples

```bash
# Default: peer-reviewed only, 25 results
python scripts/search_eric.py --query "game-based learning mathematics elementary"

# Search by ERIC thesaurus descriptor (most precise)
python scripts/search_eric.py --query 'subject:"Educational Games" AND subject:"Mathematics Instruction"'

# Recent grey literature (dissertations, IES reports)
python scripts/search_eric.py --query "fraction sense" --from-year 2018 --no-peer-reviewed-only

# Title-only, journal articles only
python scripts/search_eric.py --query 'title:"productive struggle"' --pub-type "Journal Articles"

# See the request URL without calling the API
python scripts/search_eric.py --query "math anxiety" --dry-run
```

See `SKILL.md` for the full workflow guidance Claude follows when this skill activates.

## Files

```
eric-search/
├── SKILL.md
├── README.md
└── scripts/
    ├── search_eric.py
    └── test_normalize.py
```

## Known limitations

- **No full-text retrieval.** This skill returns metadata + abstracts + URLs. To get full PDFs, follow the `url` field — ~350K ERIC records have free full text; the rest link out to publishers.
- **ERIC's matching is fairly strict.** If you get zero hits, try fewer keywords or drop quotes before assuming the topic isn't in the database.
- **Coverage gap on cognitive-science journals.** ERIC is strongest on K-12 / applied / curriculum research. For learning-sciences and cognitive-psychology journals (e.g., *Cognition and Instruction*, *Journal of the Learning Sciences*), pair this with a Semantic Scholar / OpenAlex skill.
