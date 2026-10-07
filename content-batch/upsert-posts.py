#!/usr/bin/env python3
"""
Upsert blog posts into src/data/posts-export.json.

Why this exists: posts-export.json is a 39MB array, far too large to hand edit.
Each piece in this batch lives as a pair of files in content-batch/pieces/:

    <slug>.meta.json   {"slug","title","date","excerpt"}
    <slug>.html        the post body, starting with <div class="nowtb-post-content">

Running this script reads every pair and inserts or replaces the matching record
in posts-export.json, keeping everything else untouched.

Usage:
    python3 content-batch/upsert-posts.py              # all pieces
    python3 content-batch/upsert-posts.py slug1 slug2   # just these

If it breaks, check this:
  - "KeyError: slug" means a .meta.json is missing a required field.
  - "No .html for <slug>" means the pair is incomplete.
  - The script writes atomically to a .tmp file then renames, so a crash
    mid-write cannot corrupt posts-export.json.
"""

import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(REPO, "src", "data", "posts-export.json")
PIECES = os.path.join(REPO, "content-batch", "pieces")

REQUIRED = ("slug", "title", "date", "excerpt")


def load_pieces(only):
    """Read every .meta.json / .html pair in content-batch/pieces/."""
    out = []
    if not os.path.isdir(PIECES):
        return out
    for name in sorted(os.listdir(PIECES)):
        if not name.endswith(".meta.json"):
            continue
        slug = name[: -len(".meta.json")]
        if only and slug not in only:
            continue
        meta_path = os.path.join(PIECES, name)
        html_path = os.path.join(PIECES, slug + ".html")
        if not os.path.exists(html_path):
            raise SystemExit("No .html for %s" % slug)
        with open(meta_path, encoding="utf-8") as fh:
            meta = json.load(fh)
        for key in REQUIRED:
            if key not in meta:
                raise SystemExit("%s missing required field: %s" % (name, key))
        with open(html_path, encoding="utf-8") as fh:
            meta["content"] = fh.read().strip()
        out.append(meta)
    return out


def main():
    only = set(sys.argv[1:])
    pieces = load_pieces(only)
    if not pieces:
        print("No pieces found to upsert.")
        return

    with open(POSTS, encoding="utf-8") as fh:
        posts = json.load(fh)

    by_slug = {p["slug"]: i for i, p in enumerate(posts)}
    # Start new post ids above the current maximum numeric id so nothing collides.
    max_id = max((p["id"] for p in posts if isinstance(p["id"], int)), default=90000)
    next_id = max_id + 1

    added, updated = [], []
    for piece in pieces:
        slug = piece["slug"]
        record = {
            "id": None,
            "slug": slug,
            "title": piece["title"],
            "date": piece["date"],
            "excerpt": piece["excerpt"],
            "content": piece["content"],
        }
        if slug in by_slug:
            idx = by_slug[slug]
            record["id"] = posts[idx]["id"]
            posts[idx] = record
            updated.append(slug)
        else:
            record["id"] = next_id
            next_id += 1
            posts.append(record)
            added.append(slug)

    tmp = POSTS + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(posts, fh, ensure_ascii=False)
    os.replace(tmp, POSTS)

    print("Added %d:   %s" % (len(added), ", ".join(added) or "-"))
    print("Updated %d: %s" % (len(updated), ", ".join(updated) or "-"))
    print("Total posts now: %d" % len(posts))


if __name__ == "__main__":
    main()
