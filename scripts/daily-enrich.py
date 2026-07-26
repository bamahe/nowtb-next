#!/usr/bin/env python3
"""
Daily page enrichment audit for nowtb.com
Identifies the weakest pages and generates a report of what needs work.
Run by the daily-enrich.sh cron job.

Checks per city:
1. Blog post count (target: 15+)
2. Custom FAQs in CITY_FAQS (yes/no)
3. Neighborhood count and description coverage
4. Missing blog images
5. Pages with no WP content (using generic fallback)

Outputs an ENRICHMENT-REPORT.md with prioritized action items.
"""

import json
import os
import re
import glob
from datetime import datetime
from collections import defaultdict

PROJECT = os.path.expanduser("~/Projects/nowtb-next")
REPORT_PATH = os.path.join(PROJECT, "ENRICHMENT-REPORT.md")

def load_posts():
    with open(os.path.join(PROJECT, "src/data/posts-export.json")) as f:
        return json.load(f)

def load_cities():
    with open(os.path.join(PROJECT, "src/data/cities.ts")) as f:
        content = f.read()
    return re.findall(r'name: "([^"]+)",\s*\n\s*slug: "([^"]+)",\s*\n\s*county: "([^"]+)"', content)

def load_neighborhoods():
    with open(os.path.join(PROJECT, "src/data/neighborhoods.ts")) as f:
        content = f.read()
    return re.findall(r'slug: "([^"]+)", name: "([^"]+)", city: "([^"]+)"', content)

def load_faqs():
    with open(os.path.join(PROJECT, "src/data/valrico-faqs.ts")) as f:
        content = f.read()
    return set(re.findall(r'^\s+(\w[\w-]+):\s*\[', content, re.MULTILINE))

def load_descriptions():
    with open(os.path.join(PROJECT, "src/data/neighborhood-descriptions.ts")) as f:
        content = f.read()
    return set(re.findall(r'"([\w-]+)":\s*\{', content))

def get_blog_images():
    images = set()
    for f in glob.glob(os.path.join(PROJECT, "public/images/blog/*.jpg")):
        images.add(os.path.basename(f).replace(".jpg", ""))
    return images

def main():
    posts = load_posts()
    cities = load_cities()
    neighborhoods = load_neighborhoods()
    faq_cities = load_faqs()
    described_hoods = load_descriptions()
    blog_images = get_blog_images()

    post_slugs = [p["slug"] for p in posts]

    # Analyze each city
    city_scores = []
    for name, slug, county in cities:
        post_count = sum(1 for s in post_slugs if slug in s)
        has_faqs = slug in faq_cities or slug.replace("-", "") in faq_cities
        city_hoods = [(s, n) for s, n, c in neighborhoods if c == slug]
        hoods_with_desc = sum(1 for s, _ in city_hoods if s in described_hoods)
        city_posts_missing_images = sum(
            1 for p in posts if slug in p["slug"] and p["slug"] not in blog_images
        )

        # Score: lower = needs more work
        score = 0
        score += min(post_count, 20) * 2  # max 40 pts for posts
        score += 15 if has_faqs else 0     # 15 pts for FAQs
        score += min(len(city_hoods), 10) * 2  # max 20 pts for neighborhoods
        score += min(hoods_with_desc, 10) * 2  # max 20 pts for descriptions
        score -= city_posts_missing_images  # penalty for missing images

        issues = []
        if post_count < 15:
            issues.append(f"Only {post_count} posts (need 15+)")
        if not has_faqs:
            issues.append("No custom FAQs")
        if len(city_hoods) < 5:
            issues.append(f"Only {len(city_hoods)} neighborhoods (add more)")
        if len(city_hoods) > 0 and hoods_with_desc < len(city_hoods) * 0.5:
            issues.append(f"Only {hoods_with_desc}/{len(city_hoods)} neighborhoods have descriptions")
        if city_posts_missing_images > 5:
            issues.append(f"{city_posts_missing_images} posts missing images")

        city_scores.append({
            "name": name,
            "slug": slug,
            "county": county,
            "score": score,
            "posts": post_count,
            "has_faqs": has_faqs,
            "neighborhoods": len(city_hoods),
            "described": hoods_with_desc,
            "missing_images": city_posts_missing_images,
            "issues": issues,
        })

    # Sort by score (lowest first = most work needed)
    city_scores.sort(key=lambda x: x["score"])

    # Global stats
    total_posts = len(posts)
    total_images = len(blog_images)
    posts_missing_images = sum(1 for p in posts if p["slug"] not in blog_images)
    cities_with_faqs = sum(1 for c in city_scores if c["has_faqs"])
    cities_under_15 = sum(1 for c in city_scores if c["posts"] < 15)

    # Generate report
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    report = f"""# nowtb.com Enrichment Report
Generated: {now}

## Site Overview
- **Total posts:** {total_posts}
- **Blog images:** {total_images} ({posts_missing_images} posts missing images)
- **Cities with custom FAQs:** {cities_with_faqs}/{len(cities)}
- **Cities under 15 posts:** {cities_under_15}/{len(cities)}
- **Total neighborhoods:** {len(neighborhoods)}
- **Neighborhoods with descriptions:** {len(described_hoods)}

## Priority Cities (Lowest Score = Most Work Needed)

| Rank | City | County | Score | Posts | FAQs | Hoods | Described | Issues |
|------|------|--------|-------|-------|------|-------|-----------|--------|
"""
    for i, c in enumerate(city_scores[:30]):
        issues_str = "; ".join(c["issues"]) if c["issues"] else "✓ Good"
        faq_mark = "✓" if c["has_faqs"] else "✗"
        report += f"| {i+1} | {c['name']} | {c['county']} | {c['score']} | {c['posts']} | {faq_mark} | {c['neighborhoods']} | {c['described']} | {issues_str} |\n"

    report += f"""
## Top Issues to Fix

### Missing FAQs ({len(cities) - cities_with_faqs} cities)
"""
    no_faqs = [c for c in city_scores if not c["has_faqs"]]
    for c in no_faqs[:15]:
        report += f"- {c['name']} ({c['county']})\n"
    if len(no_faqs) > 15:
        report += f"- ...and {len(no_faqs) - 15} more\n"

    report += f"""
### Low Neighborhood Count (<5)
"""
    low_hoods = [c for c in city_scores if c["neighborhoods"] < 5]
    for c in low_hoods[:15]:
        report += f"- {c['name']}: {c['neighborhoods']} neighborhoods\n"

    report += f"""
### Missing Blog Images ({posts_missing_images} total)
The hourly Unsplash cron handles this automatically.
Run manually: `python3 /tmp/download-blog-images.py`

---
*This report is generated daily by scripts/daily-enrich.py*
"""

    with open(REPORT_PATH, "w") as f:
        f.write(report)

    print(f"Enrichment report saved to {REPORT_PATH}")
    print(f"Top 5 cities needing work:")
    for c in city_scores[:5]:
        print(f"  {c['name']:25s} score={c['score']:3d}  issues: {', '.join(c['issues']) or 'none'}")

if __name__ == "__main__":
    main()
