#!/usr/bin/env python3
"""Search the ERIC (Education Resources Information Center) database.

Hits the free public API at https://api.ies.ed.gov/eric/. No API key required.

Output: JSON list of normalized records on stdout.
Errors: HTTP failures and parse problems go to stderr; exit code is non-zero.

Stdlib-only by design (no `requests` dependency) so the skill runs in any
environment with Python 3.7+.
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Iterable

BASE_URL = "https://api.ies.ed.gov/eric/"

RETURN_FIELDS = [
    "id",
    "title",
    "author",
    "source",
    "publicationdateyear",
    "description",
    "subject",
    "educationlevel",
    "publicationtype",
    "peerreviewed",
    "url",
]


def build_query(args: argparse.Namespace) -> str:
    parts: list[str] = [args.query.strip()]

    if args.from_year is not None or args.to_year is not None:
        lo = args.from_year if args.from_year is not None else "*"
        hi = args.to_year if args.to_year is not None else "*"
        parts.append(f"publicationdateyear:[{lo} TO {hi}]")

    if args.pub_type:
        parts.append(f'publicationtype:"{args.pub_type}"')

    return " AND ".join(p for p in parts if p)


def fetch(args: argparse.Namespace) -> dict[str, Any]:
    params: dict[str, str] = {
        "search": build_query(args),
        "format": "json",
        "rows": str(args.rows),
        "start": str(args.start),
        "fields": ",".join(RETURN_FIELDS),
    }
    if args.peer_reviewed_only:
        params["peerreviewed"] = "true"

    url = BASE_URL + "?" + urllib.parse.urlencode(params)

    if args.dry_run:
        print(url, file=sys.stderr)
        sys.exit(0)

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "claude-code-eric-search/0.1",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=args.timeout) as resp:
            body = resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        sys.stderr.write(f"ERIC API HTTP {e.code}: {e.reason}\n")
        sys.stderr.write(e.read().decode("utf-8", errors="replace") + "\n")
        sys.exit(2)
    except urllib.error.URLError as e:
        sys.stderr.write(f"ERIC API connection error: {e.reason}\n")
        sys.stderr.write(
            "If you see 'Host not in allowlist' or similar, the runtime is "
            "blocking api.ies.ed.gov. Add it to the network allowlist.\n"
        )
        sys.exit(3)

    try:
        return json.loads(body)
    except json.JSONDecodeError as e:
        sys.stderr.write(f"ERIC API returned non-JSON ({e}): {body[:500]}\n")
        sys.exit(4)


def normalize(doc: dict[str, Any], full_abstract: bool) -> dict[str, Any]:
    def as_list(v: Any) -> list[str]:
        if v is None:
            return []
        if isinstance(v, list):
            return [str(x) for x in v]
        return [str(v)]

    eric_id = doc.get("id") or ""
    abstract = doc.get("description") or ""
    if not full_abstract and len(abstract) > 500:
        abstract = abstract[:497].rstrip() + "..."

    url = doc.get("url")
    if isinstance(url, list):
        url = url[0] if url else None
    if not url and eric_id:
        url = f"https://eric.ed.gov/?id={eric_id}"

    pr_raw = doc.get("peerreviewed")
    if isinstance(pr_raw, bool):
        peer_reviewed: bool | None = pr_raw
    elif isinstance(pr_raw, str):
        peer_reviewed = pr_raw.strip().upper() == "T" or pr_raw.strip().lower() == "true"
    else:
        peer_reviewed = None

    return {
        "id": eric_id,
        "title": doc.get("title") or "",
        "authors": as_list(doc.get("author")),
        "source": doc.get("source") or "",
        "year": doc.get("publicationdateyear"),
        "peer_reviewed": peer_reviewed,
        "publication_type": as_list(doc.get("publicationtype")),
        "descriptors": as_list(doc.get("subject")),
        "education_level": as_list(doc.get("educationlevel")),
        "abstract": abstract,
        "url": url,
    }


def extract_docs(payload: dict[str, Any]) -> tuple[list[dict[str, Any]], int]:
    response = payload.get("response") or {}
    docs = response.get("docs") or []
    num_found = int(response.get("numFound") or 0)
    if not isinstance(docs, list):
        docs = []
    return docs, num_found


def main(argv: Iterable[str] | None = None) -> None:
    p = argparse.ArgumentParser(
        description="Search the ERIC education research database.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  search_eric.py --query 'game-based learning mathematics elementary'\n"
            "  search_eric.py --query 'descriptor:\"Educational Games\"' --from-year 2018\n"
            "  search_eric.py --query 'fraction instruction' --pub-type 'Journal Articles' --rows 50\n"
            "  search_eric.py --query 'math anxiety' --no-peer-reviewed-only\n"
        ),
    )
    p.add_argument("--query", required=True, help="Search query (Solr-style; supports field:value clauses)")
    p.add_argument("--rows", type=int, default=25, help="Results per page (max 200, default 25)")
    p.add_argument("--start", type=int, default=0, help="Offset for pagination (default 0)")
    p.add_argument("--from-year", type=int, default=None, help="Earliest publication year (inclusive)")
    p.add_argument("--to-year", type=int, default=None, help="Latest publication year (inclusive)")
    p.add_argument("--pub-type", default=None, help='Publication type, e.g. "Journal Articles", "Dissertations/Theses", "Reports - Research"')

    pr = p.add_mutually_exclusive_group()
    pr.add_argument("--peer-reviewed-only", dest="peer_reviewed_only", action="store_true", default=True,
                    help="Restrict to peer-reviewed records (default)")
    pr.add_argument("--no-peer-reviewed-only", dest="peer_reviewed_only", action="store_false",
                    help="Include non-peer-reviewed records (dissertations, IES reports, grey literature)")

    p.add_argument("--full-abstract", action="store_true", help="Return full abstracts (default truncates to 500 chars)")
    p.add_argument("--timeout", type=float, default=20.0, help="HTTP timeout in seconds (default 20)")
    p.add_argument("--dry-run", action="store_true", help="Print the request URL to stderr and exit without calling the API")
    p.add_argument("--raw", action="store_true", help="Emit raw ERIC response JSON instead of normalized records")

    args = p.parse_args(list(argv) if argv is not None else None)

    if args.rows > 200:
        sys.stderr.write("ERIC API caps `rows` at 200; clamping.\n")
        args.rows = 200

    payload = fetch(args)

    if args.raw:
        json.dump(payload, sys.stdout, indent=2, ensure_ascii=False)
        sys.stdout.write("\n")
        return

    docs, num_found = extract_docs(payload)
    out = {
        "query": args.query,
        "num_found": num_found,
        "returned": len(docs),
        "start": args.start,
        "results": [normalize(d, args.full_abstract) for d in docs],
    }
    json.dump(out, sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
