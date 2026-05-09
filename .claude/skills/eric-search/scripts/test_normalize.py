#!/usr/bin/env python3
"""Smoke test for normalize() and extract_docs(). Runs without network."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from search_eric import normalize, extract_docs  # noqa: E402

fixture = {
    "responseHeader": {"status": 0, "QTime": 12},
    "response": {
        "numFound": 2,
        "start": 0,
        "docs": [
            {
                "id": "EJ1234567",
                "title": "Game-Based Learning in Elementary Mathematics: A Meta-Analysis",
                "author": ["Smith, Jane", "Doe, John"],
                "source": "Journal of Educational Psychology",
                "publicationdateyear": 2021,
                "description": "This meta-analysis examined 47 studies of digital game-based learning in K-5 mathematics. " * 8,
                "subject": ["Educational Games", "Mathematics Instruction", "Elementary School Students"],
                "educationlevel": ["Elementary Education"],
                "publicationtype": ["Journal Articles", "Reports - Research"],
                "peerreviewed": "T",
                "url": "https://eric.ed.gov/?id=EJ1234567",
            },
            {
                "id": "ED999888",
                "title": "Equal Groups Instruction in Third Grade",
                "author": "Johnson, Alex",
                "source": None,
                "publicationdateyear": None,
                "description": "Short report.",
                "subject": "Multiplication",
                "educationlevel": [],
                "publicationtype": ["Dissertations/Theses - Doctoral Dissertations"],
                "peerreviewed": "F",
                "url": None,
            },
        ],
    },
}

docs, num_found = extract_docs(fixture)
assert num_found == 2, f"expected 2, got {num_found}"
assert len(docs) == 2

r0 = normalize(docs[0], full_abstract=False)
assert r0["id"] == "EJ1234567"
assert r0["authors"] == ["Smith, Jane", "Doe, John"]
assert r0["peer_reviewed"] is True
assert r0["year"] == 2021
assert r0["abstract"].endswith("..."), "abstract should be truncated"
assert len(r0["abstract"]) <= 500
assert "Educational Games" in r0["descriptors"]
assert r0["url"] == "https://eric.ed.gov/?id=EJ1234567"

r1 = normalize(docs[1], full_abstract=True)
assert r1["id"] == "ED999888"
assert r1["authors"] == ["Johnson, Alex"], f"single-author string should become 1-element list, got {r1['authors']}"
assert r1["descriptors"] == ["Multiplication"], "single descriptor string should become 1-element list"
assert r1["peer_reviewed"] is False
assert r1["url"] == "https://eric.ed.gov/?id=ED999888", "should fall back to canonical URL when missing"
assert r1["abstract"] == "Short report."

empty_docs, empty_n = extract_docs({})
assert empty_docs == [] and empty_n == 0

mal_docs, mal_n = extract_docs({"response": {"docs": "not a list", "numFound": "5"}})
assert mal_docs == [] and mal_n == 5

print("All normalization tests passed.")
print(json.dumps([r0, r1], indent=2)[:500])
