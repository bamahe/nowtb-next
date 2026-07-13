#!/usr/bin/env python3
"""
Quarterly Market Update Script
===============================
Run at the start of each quarter (Jan 1, Apr 1, Jul 1, Oct 1) to update
all market update pages with the current quarter's data.

How it works:
1. Determines the current quarter (Q1-Q4) and year
2. Finds city-specific Q{n} market update entries (e.g., brandon-housing-market-q3-2026)
3. Copies that content into the generic slugs (brandon-housing-market-update, brandon-fl-real-estate-market)
4. Updates titles, dates, and quarter references
5. Writes the updated JSON back

Usage:
  python3 scripts/update-market-quarters.py           # Auto-detect current quarter
  python3 scripts/update-market-quarters.py Q3 2026   # Force specific quarter
  python3 scripts/update-market-quarters.py --dry-run  # Preview without writing

Schedule:
  Add to cron:  0 6 1 1,4,7,10 * cd /path/to/nowtb-next && python3 scripts/update-market-quarters.py
  Or run via n8n, GitHub Actions, or Vercel Cron.
"""

import json
import sys
import os
from datetime import datetime

# --- Config ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_FILE = os.path.join(PROJECT_ROOT, "src/data/market-updates-export.json")

def get_current_quarter():
    """Return current quarter string and year, e.g., ('Q3', '2026')"""
    now = datetime.now()
    quarter = (now.month - 1) // 3 + 1
    return f"Q{quarter}", str(now.year)

def get_previous_quarter(quarter, year):
    """Return the previous quarter and year"""
    q_num = int(quarter[1])
    if q_num == 1:
        return "Q4", str(int(year) - 1)
    return f"Q{q_num - 1}", year

def main():
    # Parse args
    dry_run = "--dry-run" in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith("--")]

    if len(args) >= 2:
        quarter, year = args[0].upper(), args[1]
    else:
        quarter, year = get_current_quarter()

    prev_quarter, prev_year = get_previous_quarter(quarter, year)

    print(f"Updating market updates to {quarter} {year}")
    print(f"Previous quarter: {prev_quarter} {prev_year}")
    print(f"Data file: {DATA_FILE}")
    print(f"Dry run: {dry_run}")
    print()

    # Load data
    with open(DATA_FILE, "r") as f:
        data = json.load(f)

    # Build lookup of quarterly entries: city -> content
    q_suffix = f"-{quarter.lower()}-{year}"  # e.g., "-q3-2026"
    quarterly_entries = {}
    for d in data:
        slug = d["slug"]
        if q_suffix in slug:
            # Extract city from slug like "brandon-housing-market-q3-2026"
            city = slug.replace(f"-housing-market{q_suffix}", "").replace(f"-real-estate-market{q_suffix}", "")
            if city and len(d.get("content", "")) > 5000:
                quarterly_entries[city] = d

    print(f"Found {len(quarterly_entries)} cities with {quarter} {year} data")

    # Update generic slugs
    updates = 0
    for d in data:
        slug = d["slug"]
        city = None

        # Match generic housing-market-update slugs
        if slug.endswith("-housing-market-update") and "q" not in slug[-10:]:
            city = slug.replace("-housing-market-update", "")
        # Match generic fl-real-estate-market slugs
        elif slug.endswith("-fl-real-estate-market") and "q" not in slug[-10:]:
            city = slug.replace("-fl-real-estate-market", "")

        if city and city in quarterly_entries:
            q_entry = quarterly_entries[city]

            # Update content with current quarter references
            content = q_entry["content"]
            content = content.replace(f"{prev_quarter} {prev_year}", f"{quarter} {year}")
            content = content.replace(f"{prev_quarter} {year}", f"{quarter} {year}")
            content = content.replace(prev_quarter, quarter)

            d["content"] = content
            d["date"] = datetime.now().strftime("%Y-%m-%d 10:00:00")

            # Update title
            title = d["title"]
            # Remove old quarter refs and add new one
            for old_q in ["Q1", "Q2", "Q3", "Q4"]:
                title = title.replace(f"{old_q} {year}", "").replace(f"{old_q} {prev_year}", "")
            title = title.replace("  ", " ").strip()
            if quarter not in title:
                title = title.replace("Update:", f"Update {quarter} {year}:").replace("Update", f"Update {quarter} {year}", 1)
            d["title"] = title

            updates += 1
            print(f"  Updated: {slug}")

    print(f"\nTotal updated: {updates}")

    if dry_run:
        print("\n[DRY RUN] No changes written.")
    else:
        with open(DATA_FILE, "w") as f:
            json.dump(data, f)
        print(f"\nWritten to {DATA_FILE}")
        print("Run 'git add/commit/push' to deploy.")

if __name__ == "__main__":
    main()
