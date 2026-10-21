#!/usr/bin/env python3
"""Score every prerendered page against the Amendment 3 quality bar.

Measures BUILT HTML, never page.tsx source. Source-grepping misses pages that
come from shared templates and falsely flags schema supplied by helpers.

Usage: python3 score.py <.next/server/app dir> [--json out.json]
"""
import json
import os
import re
import sys
import html as H

# Weighted so the things that actually move rankings dominate the score.
WEIGHTS = {
    "title_len": 10,      # rendered title <= 60 chars
    "has_desc": 6,
    "desc_len": 4,
    "one_h1": 8,
    "question_h2": 8,     # question-format H2s, not "About X"
    "words": 14,          # depth
    "faq_schema": 10,
    "article_schema": 6,
    "breadcrumb": 4,
    "table": 8,           # AI extracts tabular data
    "internal_links": 6,
    "images": 4,
    "no_dashes": 6,       # Barrett's rule
    "unique_desc": 6,     # not boilerplate shared across pages
}
MAX = sum(WEIGHTS.values())


def visible(t):
    t = re.sub(r"<script.*?</script>|<style.*?</style>", " ", t, flags=re.S)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t))


def score_page(t, desc_counts):
    v = visible(t)
    s, miss = {}, []

    m = re.search(r"<title[^>]*>(.*?)</title>", t, re.S)
    title = H.unescape(m.group(1)).strip() if m else ""
    s["title_len"] = WEIGHTS["title_len"] if 0 < len(title) <= 60 else 0
    if not s["title_len"]:
        miss.append(f"title {len(title)}ch")

    m = re.search(r'<meta name="description" content="([^"]*)"', t)
    desc = H.unescape(m.group(1)) if m else ""
    s["has_desc"] = WEIGHTS["has_desc"] if desc else 0
    s["desc_len"] = WEIGHTS["desc_len"] if 120 <= len(desc) <= 160 else 0
    if not desc:
        miss.append("no meta desc")

    # Boilerplate detector: is this description's shape shared by many pages?
    key = re.sub(r"[A-Z][a-z]+(?:\s[A-Z][a-z]+)*", "X", desc)[:90]
    s["unique_desc"] = WEIGHTS["unique_desc"] if desc_counts.get(key, 0) <= 3 else 0
    if desc and not s["unique_desc"]:
        miss.append(f"boilerplate desc (x{desc_counts.get(key)})")

    n_h1 = len(re.findall(r"<h1[^>]*>", t))
    s["one_h1"] = WEIGHTS["one_h1"] if n_h1 == 1 else 0
    if n_h1 != 1:
        miss.append(f"{n_h1} h1")

    h2 = [re.sub("<[^>]+>", "", x).strip() for x in re.findall(r"<h2[^>]*>(.*?)</h2>", t, re.S)]
    qs = sum(1 for x in h2 if "?" in x)
    s["question_h2"] = WEIGHTS["question_h2"] if h2 and qs / len(h2) >= 0.4 else 0
    if h2 and not s["question_h2"]:
        miss.append(f"{qs}/{len(h2)} question h2")

    w = len(v.split())
    s["words"] = WEIGHTS["words"] if w >= 1500 else (WEIGHTS["words"] // 2 if w >= 900 else 0)
    if w < 1500:
        miss.append(f"{w} words")

    types = []
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', t, re.S):
        try:
            j = json.loads(H.unescape(b))
            types.append(j.get("@type", "?"))
        except Exception:
            types.append("INVALID")
    s["faq_schema"] = WEIGHTS["faq_schema"] if "FAQPage" in types else 0
    s["article_schema"] = WEIGHTS["article_schema"] if {"Article", "BlogPosting"} & set(types) else 0
    s["breadcrumb"] = WEIGHTS["breadcrumb"] if "BreadcrumbList" in types else 0
    if "FAQPage" not in types:
        miss.append("no FAQ schema")

    n_tab = len(re.findall(r"<table", t))
    s["table"] = WEIGHTS["table"] if n_tab else 0
    if not n_tab:
        miss.append("no table")

    links = len(set(re.findall(r'href="(/[^"#?]*)"', t)))
    s["internal_links"] = WEIGHTS["internal_links"] if links >= 10 else 0

    s["images"] = WEIGHTS["images"] if re.search(r"<img", t) else 0

    nd = v.count("—") + v.count("–")
    s["no_dashes"] = WEIGHTS["no_dashes"] if nd == 0 else 0
    if nd:
        miss.append(f"{nd} dashes")

    return sum(s.values()), title, w, miss


def main():
    root = sys.argv[1]
    files = []
    for dp, _, fn in os.walk(root):
        for f in fn:
            if f.endswith(".html"):
                files.append(os.path.join(dp, f))

    # First pass: count description shapes to detect templated boilerplate.
    desc_counts, cache = {}, {}
    for p in files:
        try:
            t = open(p, encoding="utf-8", errors="ignore").read()
        except Exception:
            continue
        cache[p] = t
        m = re.search(r'<meta name="description" content="([^"]*)"', t)
        if m:
            d = H.unescape(m.group(1))
            key = re.sub(r"[A-Z][a-z]+(?:\s[A-Z][a-z]+)*", "X", d)[:90]
            desc_counts[key] = desc_counts.get(key, 0) + 1

    rows = []
    for p, t in cache.items():
        sc, title, w, miss = score_page(t, desc_counts)
        url = "/" + os.path.relpath(p, root).replace(".html", "").replace("index", "").strip("/")
        rows.append({"url": url, "score": round(100 * sc / MAX), "words": w,
                     "title": title, "missing": miss})

    rows.sort(key=lambda r: r["score"])
    out = {"max": MAX, "pages": len(rows),
           "median": sorted(r["score"] for r in rows)[len(rows) // 2],
           "rows": rows}

    if "--json" in sys.argv:
        json.dump(out, open(sys.argv[sys.argv.index("--json") + 1], "w"), indent=1)

    print(f"scored {len(rows)} pages, median {out['median']}/100\n")
    buckets = {"0-39 (rebuild)": 0, "40-59 (weak)": 0, "60-79 (ok)": 0, "80-100 (strong)": 0}
    for r in rows:
        k = ("0-39 (rebuild)" if r["score"] < 40 else "40-59 (weak)" if r["score"] < 60
             else "60-79 (ok)" if r["score"] < 80 else "80-100 (strong)")
        buckets[k] += 1
    for k, n in buckets.items():
        print(f"  {k:18} {n:4}  {'#' * (n * 50 // max(1, len(rows)))}")
    print("\nWorst 15:")
    for r in rows[:15]:
        print(f"  {r['score']:3}/100 {r['words']:5}w  {r['url'][:58]}")
        print(f"            {', '.join(r['missing'][:5])}")


if __name__ == "__main__":
    main()
