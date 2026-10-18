#!/usr/bin/env python3
"""
download_blog_images.py — backfill missing hero images for nowtb.com

WHAT IT DOES
------------
Finds every blog post and market update with no hero image on disk, searches
Unsplash for a relevant photo, and saves it to public/images/blog/<slug>.jpg.

The template (`getPostThumbnail` in src/lib/posts.ts) looks for exactly that
path and renders no hero when the file is absent — so a missing file is a post
that shares to social as a blank box and reads as unfinished.

WHY THIS FILE LIVES IN THE REPO
-------------------------------
The previous version of this job lived at /tmp/download-blog-images.py and was
called by an hourly cron. macOS wipes /tmp, so the script vanished and the cron
logged "No such file or directory" every hour for weeks while the nightly
enrichment job printed "Deploy complete" regardless. Anything scheduled has to
live somewhere durable and be version-controlled. It is in the repo so the
weekly audit worktree always has it.

IT CANNOT FABRICATE A URL
-------------------------
A known failure on Barrett's sites is generator agents inventing plausible
Unsplash CDN URLs that 404 forever. This script cannot do that: it only ever
writes bytes it actually downloaded, and it verifies the response really is an
image before saving. No URL is ever written into content.

UNSPLASH API TERMS
------------------
Unsplash requires that an application trigger the photo's `download_location`
endpoint whenever a photo is actually used. This script does that for every
image it keeps, and records the photographer in a credits file so attribution
is possible. Do not remove that call — it is a condition of the API licence.

USAGE
-----
    python3 scripts/download_blog_images.py              # backfill, default cap
    LIMIT=200 python3 scripts/download_blog_images.py    # raise the cap
    DRY_RUN=1 python3 scripts/download_blog_images.py    # show plan, download nothing

The key comes from UNSPLASH_ACCESS_KEY in the environment, or from ~/.env.local.

IF IT BREAKS, CHECK THIS
------------------------
  * "no UNSPLASH_ACCESS_KEY" -> the key is missing from ~/.env.local.
  * HTTP 403 with "Rate Limit Exceeded" -> a demo Unsplash app is capped at 50
    requests/hour. The script stops cleanly and tells you how many remain; just
    run it again next hour. Nothing is half-written.
  * Images download but the page still shows no hero -> the filename must match
    the slug EXACTLY and end in .jpg. Check for a trailing space in the slug.
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
IMG_DIR = REPO / "public" / "images" / "blog"
CREDITS = REPO / "public" / "images" / "blog" / "_credits.json"

# Unsplash demo apps allow 50 requests/hour. Each image costs 2 (search +
# download trigger) plus the file fetch, so stay well under by default.
LIMIT = int(os.environ.get("LIMIT", "20"))
DRY_RUN = os.environ.get("DRY_RUN") == "1"
PAUSE_SECONDS = 1.5  # be a polite API citizen


def load_key() -> str:
    key = os.environ.get("UNSPLASH_ACCESS_KEY", "").strip()
    if key:
        return key
    envfile = Path.home() / ".env.local"
    if envfile.exists():
        for line in envfile.read_text(errors="replace").splitlines():
            if line.startswith("UNSPLASH_ACCESS_KEY"):
                # Strip quotes AND any trailing literal backslash-n, which has
                # silently broken other keys on this setup before.
                v = line.split("=", 1)[1].strip().strip("\"'")
                return v.replace("\\n", "").strip()
    sys.exit("no UNSPLASH_ACCESS_KEY — set it in the environment or ~/.env.local")


KEY = load_key()


def api(url: str) -> dict:
    req = urllib.request.Request(url, headers={
        "Authorization": f"Client-ID {KEY}",
        "Accept-Version": "v1",
        "User-Agent": "nowtb-image-backfill/1.0",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


# ---------------------------------------------------------------------------
# Turning a slug into a search query that returns a RELEVANT photo
# ---------------------------------------------------------------------------
# A literal slug makes a terrible query: "sell-home-fast-town-n-country" returns
# nothing useful. Strip the template boilerplate, keep the place name, and add a
# subject the stock library actually has pictures of.

BOILERPLATE = [
    "sell-home-fast", "real-estate-market", "housing-market-update",
    "housing-market", "market-update", "homes-for-sale", "community-guide",
    "neighborhood-guide", "buyer-guide", "guide-to-living-in", "moving-to",
    "why-move-to", "cost-of-living", "real-estate", "fl-guide", "guide",
    "q1", "q2", "q3", "q4", "2024", "2025", "2026", "fl",
]

# Subject hints by slug shape. Florida-specific so we don't get Alpine chalets.
#
# ORDER MATTERS — first match wins, so the MOST SPECIFIC topic goes first.
# In particular 55-plus must beat waterfront: Tampa Bay place names are full of
# water words ("apollo-beach", "indian-rocks-beach", "treasure-island"), so a
# waterfront rule placed first hijacks any post about a town whose NAME happens
# to contain "beach" — which turned a 55+ communities post into a search for
# waterfront homes.
SUBJECT_HINTS = [
    (r"55-plus|retire|active-adult|sun-city", "florida retirement community home"),
    (r"condo|townhome", "florida condominium building"),
    (r"waterfront|boating|canal|dock|gulf-front|island|key\b", "florida waterfront home"),
    (r"beach", "florida coastal home"),
    (r"new-construction|builder|new-home", "new construction home florida"),
    (r"golf", "florida golf course community"),
    (r"land|acreage|ranch|horse|equestrian", "florida rural land"),
    (r"luxury|estate", "florida luxury home exterior"),
    (r"school|family", "florida suburban family home"),
    (r"market|price|invest|rent", "florida suburban home exterior"),
    (r"sell|listing|valuation", "florida home for sale sign"),
]

DEFAULT_SUBJECT = "florida suburban home exterior"


def build_query(slug: str) -> str:
    s = slug.lower()
    subject = DEFAULT_SUBJECT
    for pattern, hint in SUBJECT_HINTS:
        if re.search(pattern, s):
            subject = hint
            break
    # Recover the place name by deleting known boilerplate fragments.
    #
    # Strip on HYPHEN-SEGMENT boundaries, never as a raw substring. A plain
    # str.replace turned "florida-property-tax-amendment-2026" into
    # "orida property tax amendment" — the "fl" entry ate the start of
    # "florida". Same class of bug as the regex that once rewrote statutory
    # building ages: a short token matching inside a longer word.
    segments = s.split("-")
    boilerplate_tokens = set()
    for frag in BOILERPLATE:
        boilerplate_tokens.update(frag.split("-"))
    kept = [seg for seg in segments if seg and seg not in boilerplate_tokens]
    place = " ".join(kept)
    place = re.sub(r"\s+", " ", place).strip()
    # Very short leftovers are noise, not a place.
    if len(place) < 3:
        place = ""
    # Unsplash has little imagery of small Florida towns, so lead with the
    # subject and let the place act as a soft hint rather than a hard filter.
    return f"{subject} {place}".strip()


def _search_once(query: str) -> list:
    url = ("https://api.unsplash.com/search/photos?"
           + urllib.parse.urlencode({
               "query": query, "per_page": 24, "orientation": "landscape",
               "content_filter": "high",
           }))
    return api(url).get("results") or []


def search_photo(query: str, slug: str = "") -> tuple[dict | None, str]:
    """Find a photo, falling back to progressively broader queries.

    Unsplash has almost no imagery of small Florida towns, so a place-qualified
    query like "florida coastal home apollo beach" returns nothing at all — the
    first version of this script skipped 8 of 12 posts for that reason. The
    place name is a nice-to-have, not a requirement: these are decorative hero
    images on city and market pages, and a generic Florida home beats no image
    (no image means the post shares to social as a blank grey box).

    NOTE: this fallback is only acceptable because these are AREA posts. Posts
    about a SPECIFIC PROPERTY must use real MLS photos from the Bridge CDN, not
    stock — never point this script at a listing page.

    Returns (photo, the query that actually worked).
    """
    attempts = [query]
    # Drop the place, keep the subject.
    subject_only = query
    for pattern, hint in SUBJECT_HINTS:
        if hint in query:
            subject_only = hint
            break
    else:
        subject_only = DEFAULT_SUBJECT
    if subject_only != query:
        attempts.append(subject_only)
    # Last resort, guaranteed to return something on-theme.
    attempts.append(DEFAULT_SUBJECT)

    for attempt in dict.fromkeys(attempts):
        results = _search_once(attempt)
        if results:
            # Vary WHICH result we take, keyed off the slug, so adjacent city
            # pages don't all end up with the identical stock photo. The audit
            # found one image reused across 144 pages, and three Bradenton
            # posts collided when the pool was only 3 deep — hence per_page=24
            # and a hash with better spread than a plain character sum.
            h = 0
            for ch in slug:
                h = (h * 31 + ord(ch)) & 0xFFFFFFFF
            idx = h % len(results) if slug else 0
            return results[idx], attempt
        time.sleep(0.5)
    return None, attempts[-1]


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "nowtb-image-backfill/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        ctype = r.headers.get("Content-Type", "")
        if not ctype.startswith("image/"):
            raise ValueError(f"expected an image, got {ctype!r}")
        return r.read()


def missing_slugs() -> list[str]:
    """Every post / market update with no hero image file on disk."""
    out: list[str] = []
    for name in ["posts-export.json", "market-updates-export.json"]:
        path = REPO / "src" / "data" / name
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8", errors="replace"))
        items = data if isinstance(data, list) else list(data.values())
        for it in items:
            if not isinstance(it, dict):
                continue
            slug = str(it.get("slug") or "").strip()
            if slug and not (IMG_DIR / f"{slug}.jpg").exists():
                out.append(slug)
    # Stable order so repeated runs chew through the backlog predictably
    # instead of re-attempting the same failures first.
    return sorted(dict.fromkeys(out))


def main() -> None:
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    todo = missing_slugs()
    print(f"missing hero images: {len(todo)}")
    if not todo:
        print("nothing to do.")
        return

    batch = todo[:LIMIT]
    print(f"attempting {len(batch)} this run (LIMIT={LIMIT}); {len(todo) - len(batch)} will remain\n")

    credits = {}
    if CREDITS.exists():
        try:
            credits = json.loads(CREDITS.read_text())
        except Exception:
            credits = {}

    saved = failed = 0
    for i, slug in enumerate(batch, 1):
        query = build_query(slug)
        print(f"[{i}/{len(batch)}] {slug}\n          query: {query!r}")
        if DRY_RUN:
            continue
        try:
            photo, used = search_photo(query, slug)
            if not photo:
                print("          no result even on fallback — skipped")
                failed += 1
                continue
            if used != query:
                print(f"          fell back to: {used!r}")

            # Ask for a sensibly sized, cropped JPEG rather than the full raw file.
            raw = photo["urls"]["raw"]
            img_url = f"{raw}&w=1200&h=630&fit=crop&crop=entropy&fm=jpg&q=80"
            data = fetch_bytes(img_url)
            if len(data) < 5000:
                raise ValueError(f"suspiciously small image ({len(data)} bytes)")

            (IMG_DIR / f"{slug}.jpg").write_bytes(data)

            # Required by the Unsplash API licence whenever a photo is used.
            try:
                api(photo["links"]["download_location"])
            except Exception as exc:
                print(f"          warning: could not trigger download endpoint ({exc})")

            credits[slug] = {
                "photo_id": photo["id"],
                "photographer": photo["user"]["name"],
                "photographer_url": photo["user"]["links"]["html"],
                "source": "Unsplash",
            }
            print(f"          saved {len(data):,} bytes — photo by {photo['user']['name']}")
            saved += 1
            time.sleep(PAUSE_SECONDS)

        except Exception as exc:  # noqa: BLE001 — one failure must not stop the batch
            msg = str(exc)
            failed += 1
            print(f"          FAILED: {msg}")
            if "403" in msg or "Rate Limit" in msg:
                print("\nUnsplash rate limit reached — stopping cleanly. "
                      "Re-run next hour to continue; nothing was half-written.")
                break

    if not DRY_RUN:
        CREDITS.write_text(json.dumps(credits, indent=2, sort_keys=True), encoding="utf-8")

    remaining = len(missing_slugs())
    print(f"\nsaved {saved}, failed {failed}. Still missing after this run: {remaining}")


if __name__ == "__main__":
    main()
