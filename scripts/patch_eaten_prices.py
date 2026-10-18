#!/usr/bin/env python3
"""
patch_eaten_prices.py
=====================

Re-runnable, IDEMPOTENT repair for dollar figures eaten out of live blog posts
in src/data/posts-export.json.

WHAT HAPPENED
-------------
An auto-linking script string-replaced text across the corpus and, as collateral
damage, ate the leading "$NNN" out of dollar amounts. Two damage shapes:

    "$450K"           ->  "0K"            ($ plus the digits before a trailing 0)
    "$1,600-$1,900"   ->  ",600-,900"     ($ plus the leading digits)
    "$100,000+"       ->  "0,000+"        (same shape, comma group survived)

Readers currently see "median home price around 0K" and
"Rent for a 2BR averages ,600-,900/month" on a licensed broker's website.

THE IRON RULE: NEVER INVENT A NUMBER
------------------------------------
A fabricated price on a licensed broker's site is a professional liability.
Exactly two sources are allowed here:

  1. src/data/city-market-stats.ts -- verified Stellar MLS closed sales, trailing
     twelve months, fully paginated. Medians are read OUT OF THAT FILE at run
     time (see load_city_medians below), not retyped here, so this script can
     never drift from the verified data. Every recovered figure is asserted to
     match the file before it is written.
  2. Statute, for legally fixed amounts:
       - Florida homestead exemption: up to $50,000 total -- $25,000 on the first
         $50,000 of assessed value, plus $25,000 on value between $50,000 and
         $75,000, the second of which does not apply to school district levies
         (Fla. Stat. 196.031, verified against the Legislature's text).
       - Save Our Homes cap: the lower of 3% or the change in CPI
         (Fla. Stat. 193.155).

  One figure is recovered from the page's own markup rather than a source file:
  the "Carrollwood Homes Under $500K" card title, where the card's own href is
  /blog/carrollwood-homes-under-500k/. That is recovery, not a guess.

ANY FIGURE NOT RECOVERABLE FROM THOSE SOURCES IS REMOVED, and the sentence is
rewritten so it still reads naturally and still serves its original purpose.
Removed-not-guessed, in full:
    * every neighborhood-level price range (sub-city, no verified source)
    * every rent figure
    * every homeowners / flood insurance figure
    * mold remediation cost
    * household income baselines
    * the region-wide "Tampa Bay median home price" (the stats file is per-city;
      there is no verified metro-wide median)
    * South Tampa and New Tampa medians (absent from city-market-stats.ts)
    * the dollar savings from filing homestead (depends on county millage)

SAFETY MACHINERY (modelled on scripts/patch_content_compliance.py)
------------------------------------------------------------------
* Detects the file's OWN json serialiser by round-tripping it byte-for-byte
  before writing, so the diff contains only real content changes. The content
  automation has already changed this format once (indent=2 -> minified), so it
  is DETECTED, never assumed.
* Record count asserted unchanged. No record is ever deleted or reordered.
* Every rule is applied, then applied AGAIN to its own output. A rule that still
  matches its own output is non-idempotent and aborts the run.
* Per-rule counts are printed, plus a full before/after of every edit.
* A final scan asserts zero remaining instances of the damage patterns.

Usage:
    python3 scripts/patch_eaten_prices.py              # apply
    python3 scripts/patch_eaten_prices.py --dry-run    # report only
    python3 scripts/patch_eaten_prices.py --verbose    # + full before/after
"""

import argparse
import hashlib
import json
import os
import re
import sys
from collections import Counter, OrderedDict

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "data")
POSTS = os.path.normpath(os.path.join(DATA_DIR, "posts-export.json"))
STATS = os.path.normpath(os.path.join(DATA_DIR, "city-market-stats.ts"))

EXPECTED_RECORDS = 1760

# Keys that are identifiers, never content.
SKIP_KEYS = {"slug", "date", "id", "datePublished", "dateModified"}

# One shared attribution string so every recovered figure carries its window.
SOURCE_NOTE = "Stellar MLS closed sales, twelve months ending October 2026"


# ==========================================================================
# Source 1: the verified medians, read from city-market-stats.ts
# ==========================================================================

def load_city_medians():
    """Parse slug -> {'all': n, 'sf': n} out of src/data/city-market-stats.ts.

    Read rather than retyped so a refresh of that file cannot silently leave a
    stale price published here. If the file moves or its shape changes, this
    returns too few rows and REQUIRED_MEDIANS below aborts the run.
    """
    with open(STATS, encoding="utf-8") as fh:
        src = fh.read()
    out = {}
    for m in re.finditer(
        r'slug:\s*"([a-z0-9-]+)",\s*basis:.*?'
        r'sfMedian:\s*(\d+|null).*?'
        r'allMedian:\s*(\d+|null)',
        src,
        re.S,
    ):
        slug, sf, allm = m.group(1), m.group(2), m.group(3)
        out[slug] = {
            "sf": None if sf == "null" else int(sf),
            "all": None if allm == "null" else int(allm),
        }
    return out


MED = load_city_medians()

# Every figure this script publishes, declared up front. The run aborts if any
# one of them is missing or has changed, rather than writing a stale price.
REQUIRED_MEDIANS = {
    ("brandon", "all"): 370000,
    ("riverview", "all"): 375000,
    ("valrico", "all"): 420000,
    ("fishhawk", "all"): 565000,
    ("wesley-chapel", "all"): 430000,
    ("westchase", "all"): 550000,
    ("st-petersburg", "all"): 432250,
    ("clearwater", "all"): 330000,
    ("clearwater", "sf"): 425000,
    ("seminole", "all"): 425000,
    ("dunedin", "all"): 425000,
    ("largo", "all"): 368500,
    ("largo", "sf"): 410000,
    ("gibsonton", "all"): 310000,
    ("wimauma", "all"): 353814,
    ("apollo-beach", "all"): 489999,
    ("plant-city", "all"): 350000,
}


def verify_medians():
    bad = []
    for (slug, kind), expected in sorted(REQUIRED_MEDIANS.items()):
        got = MED.get(slug, {}).get(kind)
        if got != expected:
            bad.append(f"  {slug}.{kind}: expected {expected}, file says {got}")
    if bad:
        sys.exit(
            "ABORT: city-market-stats.ts no longer matches the figures this "
            "script publishes. Refusing to write prices that are not in the "
            "verified source.\n" + "\n".join(bad)
        )


def usd(slug, kind="all"):
    """Formatted median straight from city-market-stats.ts, e.g. '$368,500'."""
    return "${:,}".format(MED[slug][kind])


# ==========================================================================
# Rule plumbing (same contract as patch_content_compliance.py)
# ==========================================================================

class Rule:
    def __init__(self, slug, name, fn):
        self.slug = slug      # which post this belongs to (reporting only)
        self.name = name
        self.fn = fn

    def apply(self, text):
        return self.fn(text)


def literal(slug, name, old, new):
    """Exact-substring replacement across every occurrence.

    Several of these posts store their body twice -- once with inline <a> links
    and once without -- so a literal that matches both copies is deliberate.
    Idempotency is guaranteed structurally: `new` must not contain `old`.
    """
    assert old != new, f"no-op literal rule {name!r}"
    assert old not in new, f"non-idempotent literal rule {name!r}: new contains old"

    def fn(text):
        n = text.count(old)
        return (text.replace(old, new), n) if n else (text, 0)

    return Rule(slug, name, fn)


# ==========================================================================
# THE RULES
#
# Grouped by post. Each entry says whether the figure was RECOVERED (and from
# where) or REMOVED (and why it was not recoverable).
# ==========================================================================

def build_rules():
    R = []
    A = R.append

    # ----------------------------------------------------------------------
    # ultimate-tampa-bay-relocation-guide
    # ----------------------------------------------------------------------
    S = "ultimate-tampa-bay-relocation-guide"

    # REMOVED: no verified metro-wide median exists. city-market-stats.ts is
    # per-city only; averaging its rows would be inventing a statistic.
    A(literal(S, "quick answer: metro-wide median (REMOVED - no verified source)",
              "a median home price around 0K, and a cost of living below most "
              "major coastal metros",
              "home prices that swing widely from one community to the next, and "
              "a cost of living below most major coastal metros"))

    # REMOVED: same reason. The cell now points at the per-city medians that ARE
    # verified and appear further down the same page.
    A(literal(S, "fast facts table: metro-wide median (REMOVED - no verified source)",
              "<tr><td>Median Home Price</td><td>~0K (varies widely by area)</td></tr>",
              "<tr><td>Median Home Price</td><td>Varies widely by city -- see the "
              "verified county medians below</td></tr>"))

    # RECOVERED Gibsonton + Wimauma from city-market-stats.ts.
    # REMOVED the South Tampa / Clearwater Beach figure: neither is in the file
    # (Clearwater Beach is a sub-market of Clearwater, not a separate row).
    for tag, gib, wim, st, cw in [
        ("linked copy",
         '<a href="/gibsonton/">Gibsonton</a>', '<a href="/wimauma/">Wimauma</a>',
         '<a href="/south-tampa/">South Tampa</a>', '<a href="/clearwater/">Clearwater</a>'),
        ("plain copy", "Gibsonton", "Wimauma", "South Tampa", "Clearwater"),
    ]:
        A(literal(S, f"cost of living intro ({tag}): Gibsonton/Wimauma RECOVERED, "
                     f"South Tampa + Clearwater Beach REMOVED",
                  f"You can find a solid 3-bedroom home in {gib} or {wim} for under "
                  f"0K, or pay 0K+ in {st} or {cw} Beach.",
                  f"The median sale price is {usd('gibsonton')} in {gib} and "
                  f"{usd('wimauma')} in {wim}, while {st} and {cw} Beach run far "
                  f"above that."))

    # RECOVERED Gibsonton + Westchase. REMOVED the South Tampa top end and the
    # rent range (no verified rent source anywhere).
    for tag, wc in [("linked copy", '<a href="/westchase/">Westchase</a>'),
                    ("plain copy", "Westchase")]:
        A(literal(S, f"housing bullet ({tag}): medians RECOVERED, rent REMOVED",
                  f"<li><strong>Housing.</strong> Median prices range from ~0K "
                  f"(Gibsonton) to 0K+ ({wc}, South Tampa). Rent for a 2BR apartment "
                  f"averages ,800-,200/month depending on area.</li>",
                  f"<li><strong>Housing.</strong> Median sale prices run from "
                  f"{usd('gibsonton')} in Gibsonton to {usd('westchase')} in {wc}, "
                  f"with South Tampa higher still ({SOURCE_NOTE}). Rents swing hard "
                  f"by submarket and condition, so price a specific neighborhood "
                  f"before you budget.</li>"))

    # REMOVED: statewide insurance averages are not in either allowed source.
    A(literal(S, "insurance bullet: statewide premium range (REMOVED - no verified source)",
              "<li><strong>Insurance.</strong> Florida homeowners insurance averages "
              ",500-,000/year. Flood insurance is separate and required in many zones. "
              "This is the cost most newcomers underestimate.</li>",
              "<li><strong>Insurance.</strong> Florida homeowners insurance premiums "
              "vary widely by roof age, construction type, and distance to water, so "
              "get a real quote on the specific address before you write an offer. "
              "Flood insurance is separate and required in many zones. This is the "
              "cost most newcomers underestimate.</li>"))

    # Attribution for the two recovered-median lists below.
    for county in ("Hillsborough", "Pinellas"):
        A(literal(S, f"{county} list: add source attribution for the recovered medians",
                  f"<h3>Popular {county} Communities</h3>\n<ul>",
                  f"<h3>Popular {county} Communities</h3>\n<p>Medians below are "
                  f"{SOURCE_NOTE}.</p>\n<ul>"))

    # Per-row medians. Each row names its own city, so each is RECOVERABLE from
    # city-market-stats.ts -- except South Tampa and New Tampa, which have no row
    # in that file and therefore lose the figure entirely.
    A(literal(S, "South Tampa row (REMOVED - not in city-market-stats.ts)",
              "restaurant-dense. Median around 0K+. Best for professionals",
              "restaurant-dense, and the priciest address on this list. Best for "
              "professionals"))
    A(literal(S, "New Tampa row (REMOVED - not in city-market-stats.ts)",
              "convenient to USF and I-75. Median around 0K.</li>",
              "convenient to USF and I-75.</li>"))

    for name, old_ctx, slug in [
        ("Brandon",        "family-friendly. Median around 0K. Easy access to I-75", "brandon"),
        ("Riverview",      "good schools. Median around 0K. Popular with young families", "riverview"),
        ("Valrico",        "larger lots. Median around 0K.</li>", "valrico"),
        ("FishHawk Ranch", "trails, pools. Median around 0K.</li>", "fishhawk"),
        ("Wesley Chapel",  "premium outlets. Median around 0K.</li>", "wesley-chapel"),
        ("Westchase",      "west Tampa. Median around 0K.</li>", "westchase"),
        ("St. Petersburg", "appreciating neighborhoods. Median around 0K.</li>", "st-petersburg"),
        ("Seminole",       "reasonable prices. Median around 0K.</li>", "seminole"),
        ("Dunedin",        "Scottish heritage. Median around 0K.</li>", "dunedin"),
        ("Largo",          "solid parks system. Median around 0K.</li>", "largo"),
    ]:
        A(literal(S, f"{name} row median (RECOVERED from city-market-stats.ts)",
                  old_ctx,
                  old_ctx.replace("Median around 0K", f"Median around {usd(slug)}")))

    # Clearwater's eaten token was "5K", not "0K". Its all-type median is held
    # down by heavy condo volume, so the basis is stated rather than hidden.
    A(literal(S, "Clearwater row median (RECOVERED from city-market-stats.ts)",
              "beachfront premium. Median around 5K.</li>",
              f"beachfront premium. Median around {usd('clearwater')} across all "
              f"property types.</li>"))

    # REMOVED: household income baselines are not in either allowed source.
    A(literal(S, "comfortable-income FAQ (REMOVED - no verified source)",
              "<p>A household income of ,000-,000 provides a comfortable baseline "
              "for a family of four, assuming a median-priced home with a conventional "
              "mortgage. Higher-cost areas like South Tampa or waterfront Pinellas "
              "communities require 0,000+.</p>",
              "<p>There is no single figure, because the answer moves with the price "
              "of the house, the mortgage rate, and the insurance quote on that "
              "specific address. The practical step is a lender preapproval -- it "
              "turns a median-priced Tampa Bay home into the income and monthly "
              "payment you would actually need. Higher-cost areas like South Tampa "
              "and waterfront Pinellas raise that bar substantially.</p>"))

    # ----------------------------------------------------------------------
    # guide-to-living-in-largo-fl
    # ----------------------------------------------------------------------
    S = "guide-to-living-in-largo-fl"

    A(literal(S, "quick answer median (RECOVERED from city-market-stats.ts)",
              "with a median home price around 0K, central location, excellent parks",
              f"with a median sale price of {usd('largo')} ({SOURCE_NOTE}), central "
              f"location, excellent parks"))

    # All five neighborhood ranges are sub-city. No verified source exists at
    # that grain, so each figure is REMOVED and the row keeps its orienting job
    # qualitatively.
    A(literal(S, "Largo Central price range (REMOVED - sub-city, no verified source)",
              "townhome development. Prices typically 0K-0K. Best for buyers seeking "
              "affordability",
              "townhome development. This is one of the more affordable corners of "
              "Largo. Best for buyers seeking affordability"))
    A(literal(S, "Bardmoor price range (REMOVED - sub-city, no verified source)",
              "manicured landscaping. Prices range 0K-0K+. Best for golfers",
              "manicured landscaping. Expect the top of the Largo price range here. "
              "Best for golfers"))
    A(literal(S, "Ridgecrest price range (REMOVED - sub-city, no verified source)",
              "Walsingham Park. Prices typically 0K-0K. Popular with families",
              "Walsingham Park. Pricing lands mid-range for Largo, with condos at the "
              "lower end. Popular with families"))
    A(literal(S, "South Largo price range (REMOVED - sub-city, no verified source)",
              "smaller single-family homes. Prices from 0K-0K. Best for first-time buyers",
              "smaller single-family homes. This is where Largo's entry-level pricing "
              "lives. Best for first-time buyers"))
    A(literal(S, "Seminole-adjacent price range (REMOVED - sub-city, no verified source)",
              "school zone proximity. Prices 0K-0K. Good option for families",
              "school zone proximity. Expect a modest premium over the rest of Largo. "
              "Good option for families"))

    # Median RECOVERED. The old copy also claimed Largo sits below Clearwater,
    # which the verified data contradicts (Clearwater's all-type median is the
    # LOWER of the two), so Clearwater is dropped from the comparison here and
    # handled honestly in the FAQ below. Rent figure REMOVED.
    for tag, dun in [("linked copy", '<a href="/dunedin/">Dunedin</a>'),
                     ("plain copy", "Dunedin")]:
        A(literal(S, f"housing bullet ({tag}): median RECOVERED, rent REMOVED, "
                     f"false Clearwater comparison dropped",
                  f"<li><strong>Housing.</strong> Median home price around 0K -- "
                  f"roughly K-K below neighboring Clearwater, Seminole, and {dun}. "
                  f"Rent for a 2BR averages ,600-,900/month.</li>",
                  f"<li><strong>Housing.</strong> Largo's median sale price is "
                  f"{usd('largo')}, against {usd('seminole')} in both Seminole and "
                  f"{dun} ({SOURCE_NOTE}). Rents move with location, age, and "
                  f"condition, so check "
                  f'<a href="/properties/">current listings</a> and ask for live '
                  f"rental figures before you budget.</li>"))

    A(literal(S, "insurance bullet (REMOVED - no verified source)",
              "<li><strong>Insurance.</strong> Homeowners insurance runs ,000-,500/year "
              "for most properties. Flood insurance is required in some areas, "
              "particularly near lakes and retention areas.</li>",
              "<li><strong>Insurance.</strong> Homeowners insurance is a real line item "
              "in Pinellas County, and the premium swings with roof age, construction, "
              "and distance to water, so quote the specific address before you commit. "
              "Flood insurance is required in some areas, particularly near lakes and "
              "retention areas.</li>"))

    # Both figures RECOVERED, and the answer corrected: on single-family homes
    # Largo is cheaper, but across all property types Clearwater's median is the
    # lower one. The original flat "Yes" was wrong against the verified data.
    A(literal(S, "Largo vs Clearwater FAQ (RECOVERED both medians; answer corrected)",
              "<h3>Is Largo cheaper than Clearwater?</h3>\n<p>Yes. Largo's median home "
              "price (0K) runs about K below mainland Clearwater (5K) and "
              "significantly below Clearwater Beach. For buyers prioritizing value in "
              "Pinellas County, Largo offers more home for the money while maintaining "
              "similar beach access and amenities.</p>",
              f"<h3>Is Largo cheaper than Clearwater?</h3>\n<p>It depends on the "
              f"property type. On single-family homes, Largo's median sale price is "
              f"{usd('largo','sf')} against {usd('clearwater','sf')} in Clearwater. "
              f"Across all property types Clearwater's median is the lower of the two, "
              f"{usd('clearwater')} against {usd('largo')}, because Clearwater has far "
              f"more condo inventory pulling that figure down ({SOURCE_NOTE}). For a "
              f"buyer comparing houses, Largo is the better value, and Clearwater Beach "
              f"sits well above both.</p>"))

    # ----------------------------------------------------------------------
    # One-figure posts
    # ----------------------------------------------------------------------

    A(literal("florida-mold-guide-homeowners",
              "mold remediation cost (REMOVED - no verified source)",
              "addressing water intrusion immediately  -  mold remediation costs "
              ",500-,000+ depending on severity.",
              "addressing water intrusion immediately. What remediation costs depends "
              "entirely on how far the moisture spread, so get a written scope and "
              "estimate from a licensed Florida mold remediator."))

    A(literal("homestead-exemption-florida-guide",
              "homestead exemption amount (RECOVERED from Fla. Stat. 196.031); "
              "dollar savings REMOVED - depends on county millage",
              "Florida's homestead exemption reduces your home's taxable value by up "
              "to ,000, saving most homeowners 0-,500 per year on property taxes.",
              "Florida's homestead exemption reduces your home's taxable value by up "
              "to $50,000 -- $25,000 on the first $50,000 of assessed value, plus "
              "another $25,000 on value between $50,000 and $75,000, which does not "
              "apply to school district taxes (Fla. Stat. 196.031). What that saves "
              "you depends on your county's millage rate."))

    A(literal("hillsborough-county-property-taxes",
              "homestead savings (REMOVED - millage-dependent); exemption and cap "
              "RECOVERED from Fla. Stat. 196.031 and 193.155",
              "Filing for homestead can save 0-,500 annually.",
              "Filing for homestead removes up to $50,000 of taxable value "
              "(Fla. Stat. 196.031) and caps future assessed-value increases at the "
              "lower of 3% or the change in CPI (Fla. Stat. 193.155)."))

    # RECOVERED from the card's own href, /blog/carrollwood-homes-under-500k/.
    A(literal("history-of-carrollwood-fl",
              "card title (RECOVERED from the card's own href slug)",
              "Carrollwood Homes Under 0K</span>",
              "Carrollwood Homes Under $500K</span>"))

    A(literal("apollo-beach-flood-insurance-guide",
              "flood insurance premium range (REMOVED - no verified source)",
              "Flood insurance in Apollo Beach now ranges from 0-,000+/year depending "
              "on your flood zone, elevation, and home value  -  rates increased "
              "significantly after Hurricanes Helene and Milton under FEMA's Risk "
              "Rating 2.0.",
              "Flood insurance premiums in Apollo Beach depend on your flood zone, "
              "elevation, and home value, and they rose sharply after Hurricanes "
              "Helene and Milton under FEMA's Risk Rating 2.0  -  pull the actual "
              "quote on a specific address before you make an offer."))

    # REMOVED: this was a dock-equipped waterfront entry point, a sub-segment the
    # city median does not describe. Substituting the citywide median would be a
    # different claim, so the figure goes.
    A(literal("apollo-beach-boating-guide",
              "waterfront-with-dock entry price (REMOVED - sub-segment, no verified source)",
              "private docks starting around 0K.",
              "private docks across a wide range of price points."))

    # RECOVERED: restated as the citywide median, which is what the source file
    # actually supports -- NOT as a "starting at" figure, which it does not.
    A(literal("apollo-beach-fl-community-guide",
              "waterfront entry price -> citywide median (RECOVERED from city-market-stats.ts)",
              "offers waterfront living starting around 0K, boating access to",
              f"offers waterfront living at a citywide median sale price of "
              f"{usd('apollo-beach')} ({SOURCE_NOTE}), boating access to"))

    A(literal("why-move-to-brandon-fl",
              "median (RECOVERED from city-market-stats.ts)",
              "affordable housing (median ~0K), top-rated schools",
              f"affordable housing (median {usd('brandon')}), top-rated schools"))

    A(literal("moving-to-plant-city-fl",
              "entry price -> citywide median (RECOVERED from city-market-stats.ts)",
              "offers small-town charm with affordable homes starting around 0K, the famous",
              f"offers small-town charm, a median home sale price of "
              f"{usd('plant-city')}, the famous"))

    A(literal("cost-of-living-brandon-fl",
              "median (RECOVERED from city-market-stats.ts)",
              "with median home prices around 0K, property taxes near 1.1%",
              f"with a median home sale price of {usd('brandon')}, property taxes "
              f"near 1.1%"))

    return R


# ==========================================================================
# Damage detection -- used before AND after, and for the zero-remaining assert
# ==========================================================================

#
# Deliberately narrow. Broader shapes were tried and rejected because the corpus
# legitimately contains "$2,000K+", "LBK Listings", "5K runs", "$7K/yr",
# "6,000+ acre park" and "9,000+ jobs" -- none of which are damage. Each pattern
# below was validated against the full 1,760-record corpus and, before the fix,
# matched ONLY real damage.
DAMAGE = [
    # "$450K" -> "0K". Excludes a 0K that follows a digit, which is how the
    # legitimate "$2,000K+" and "$1,800K" table cells read.
    ("eaten $ before NN0K", re.compile(r"(?<![\d$.])0K\b")),
    # "$1,600" -> ",600": a comma group with nothing at all in front of it.
    ("eaten $ before N,NNN", re.compile(r"(?<![\d.])(?<!\$),\d{3}\b")),
    # "roughly $56K-$60K below" -> "roughly K-K below".
    ("orphaned K range", re.compile(r"\bK\s*-\s*K\b")),
    # "$100,000+" -> "0,000+". Anchored on a money cue word so that legitimate
    # counts ("6,000+ acres", "9,000+ jobs") cannot match.
    ("eaten $ leaving lone digit", re.compile(
        r"(?i)\b(?:averages?|runs?|costs?|requires?|saves?|income of|ranges? from"
        r"|starting around|up to|around)\s+\d{1,3},\d{3}\s*"
        r"(?:\+|/\s*(?:year|month|yr|mo)|\s*(?:annually|per year|per month))")),
]

# Known-good strings the damage regexes would otherwise flag. Each was read in
# context and is legitimate page copy, not damage.
DAMAGE_ALLOW = (
    "population around 200,000+",   # Hernando County population, not a price
)


def scan_damage(data):
    """Count surviving damage instances, with one example each."""
    counts = Counter()
    examples = {}
    for rec in data:
        for key, val in rec.items():
            if key in SKIP_KEYS or not isinstance(val, str):
                continue
            for name, rx in DAMAGE:
                for m in rx.finditer(val):
                    ctx = val[max(0, m.start() - 40):m.end() + 40]
                    if any(a in ctx for a in DAMAGE_ALLOW):
                        continue
                    counts[(rec.get("slug"), name)] += 1
                    examples.setdefault((rec.get("slug"), name),
                                        ctx.replace("\n", " "))
    return counts, examples


# ==========================================================================
# Serialiser detection -- byte-for-byte round trip before any write
# ==========================================================================

_SERIALISER_CANDIDATES = [
    {"indent": None, "ensure_ascii": False, "separators": (",", ":")},  # minified
    {"indent": 2,    "ensure_ascii": False, "separators": None},
    {"indent": None, "ensure_ascii": False, "separators": None},
    {"indent": 2,    "ensure_ascii": True,  "separators": None},
    {"indent": None, "ensure_ascii": True,  "separators": None},
    {"indent": None, "ensure_ascii": True,  "separators": (",", ":")},
    {"indent": 4,    "ensure_ascii": False, "separators": None},
]


def _dump(data, cfg):
    kwargs = {"ensure_ascii": cfg["ensure_ascii"], "indent": cfg["indent"]}
    if cfg.get("separators"):
        kwargs["separators"] = cfg["separators"]
    return json.dumps(data, **kwargs).encode("utf-8")


def detect_serialiser(data, raw):
    for candidate in _SERIALISER_CANDIDATES:
        if _dump(data, candidate) == raw:
            return candidate
    sys.exit(
        "ABORT: posts-export.json does not round-trip with any known serialiser "
        "shape. Add its shape to _SERIALISER_CANDIDATES. Refusing to rewrite it "
        "blind -- guessing would reformat all 43 MB and make the diff unreadable."
    )


# ==========================================================================
# Driver
# ==========================================================================

def context(text, idx, before=90, after=160):
    return text[max(0, idx - before):idx + after].replace("\n", " ")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true",
                    help="report what would change without writing")
    ap.add_argument("--verbose", action="store_true", default=True,
                    help="print full before/after for every edit (default on)")
    args = ap.parse_args()

    verify_medians()
    rules = build_rules()

    print("=" * 78)
    print("EATEN-PRICE REPAIR" + ("  [DRY RUN]" if args.dry_run else ""))
    print("=" * 78)
    print(f"  verified medians loaded from city-market-stats.ts: {len(MED)} cities")
    print(f"  figures this script publishes, all re-verified: {len(REQUIRED_MEDIANS)}")

    with open(POSTS, "rb") as fh:
        raw = fh.read()
    sha_before = hashlib.sha256(raw).hexdigest()
    data = json.loads(raw)
    cfg = detect_serialiser(data, raw)

    n_before = len(data)
    assert n_before == EXPECTED_RECORDS, (
        f"record count is {n_before}, expected {EXPECTED_RECORDS}"
    )
    print(f"  serialiser detected: {cfg}")
    print(f"  records: {n_before}")
    print(f"  sha256 before: {sha_before}")

    dmg_before, dmg_before_ex = scan_damage(data)
    print(f"  damage instances before: {sum(dmg_before.values())} "
          f"across {len({s for s, _ in dmg_before})} records")

    counts = Counter()
    unmatched = []
    edits = []          # (slug, rule name, before-ctx, after-ctx)
    touched = set()

    for rec in data:
        for key in list(rec.keys()):
            val = rec[key]
            if key in SKIP_KEYS or not isinstance(val, str):
                continue
            text = val
            for rule in rules:
                new, n = rule.apply(text)
                if not n:
                    continue
                counts[(rule.slug, rule.name)] += n
                # Idempotency gate: a rule must never match its own output.
                _, again = rule.apply(new)
                if again:
                    sys.exit(
                        f"ABORT: rule is NOT idempotent -- [{rule.slug}] "
                        f"{rule.name} still matched its own output in "
                        f"{rec.get('slug')}/{key}"
                    )
                # Record the first changed site for the report.
                i = 0
                while i < min(len(text), len(new)) and text[i] == new[i]:
                    i += 1
                edits.append((rec.get("slug"), key, rule.name,
                              context(text, i), context(new, i)))
                text = new
            if text != val:
                rec[key] = text
                touched.add(rec.get("slug"))

    for rule in rules:
        if not counts.get((rule.slug, rule.name)):
            unmatched.append(f"[{rule.slug}] {rule.name}")

    assert len(data) == n_before, "record count changed -- aborting"

    dmg_after, dmg_after_ex = scan_damage(data)

    # ---------------------------------------------------------------- report
    print("\n" + "-" * 78)
    print("PER-RULE COUNTS")
    print("-" * 78)
    by_post = Counter()
    for (slug, name), n in sorted(counts.items()):
        by_post[slug] += n
        print(f"  [{slug}] {name}: {n}")
    print("\n  PER-RECORD TOTALS")
    for slug, n in sorted(by_post.items(), key=lambda x: -x[1]):
        print(f"    {slug}: {n}")
    print(f"\n  TOTAL SUBSTITUTIONS: {sum(counts.values())}")
    print(f"  RECORDS EDITED: {len(touched)}")

    if unmatched:
        print("\n  RULES THAT MATCHED NOTHING (already applied, or text moved):")
        for u in unmatched:
            print(f"    {u}")

    if args.verbose and edits:
        print("\n" + "-" * 78)
        print(f"EVERY EDIT ({len(edits)} sites)")
        print("-" * 78)
        for i, (slug, key, name, b, a) in enumerate(edits, 1):
            print(f"\n{i}. [{slug}/{key}] {name}")
            print(f"   BEFORE: ...{b}...")
            print(f"   AFTER : ...{a}...")

    print("\n" + "-" * 78)
    print("DAMAGE SCAN")
    print("-" * 78)
    print(f"  before: {sum(dmg_before.values())}    after: {sum(dmg_after.values())}")
    for (slug, name), n in sorted(dmg_before.items()):
        after = dmg_after.get((slug, name), 0)
        print(f"    {slug} / {name}: {n} -> {after}")
    if dmg_after:
        print("\n  REMAINING (examples):")
        for k, ex in dmg_after_ex.items():
            print(f"    {k}: {ex}")

    # ---------------------------------------------------------------- write
    if args.dry_run:
        print("\n  DRY RUN -- nothing written.")
        return

    if counts:
        out = _dump(data, cfg)
        with open(POSTS, "wb") as fh:
            fh.write(out)
        with open(POSTS, "rb") as fh:
            check_raw = fh.read()
        check = json.loads(check_raw)
        assert len(check) == n_before, "post-write record count mismatch"
        sha_after = hashlib.sha256(check_raw).hexdigest()
        print(f"\n  WROTE {POSTS}")
        print(f"  sha256 after:  {sha_after}")
        print(f"  records after: {len(check)} (parses cleanly)")
    else:
        print("\n  NO CHANGES -- corpus already repaired (idempotent re-run).")
        print(f"  sha256 unchanged: {sha_before}")

    if dmg_after:
        sys.exit(
            f"\nABORT: {sum(dmg_after.values())} damage instances still remain. "
            f"See the DAMAGE SCAN section above."
        )


if __name__ == "__main__":
    main()
