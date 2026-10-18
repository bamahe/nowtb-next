#!/usr/bin/env python3
"""
patch_content_compliance.py
===========================

Re-runnable, IDEMPOTENT content-compliance patcher for the nowtb.com content
corpora in src/data/.

WHY A SCRIPT AND NOT HAND EDITS
-------------------------------
A scheduled content automation commits new post batches to posts-export.json on
its own schedule. A textual merge of a 43 MB JSON file is unresolvable, so the
resolution when main moves is: take the automation's version of the file and
re-run this script. Running it twice must produce a byte-identical file -- that
is asserted below, not assumed.

WHAT IT FIXES
-------------
FIX 1  False experience claims that tie Barrett's 23+ years of real estate
       experience to a place (he has been licensed since Sept 2003 = 23 completed
       years; he has lived in Florida only about a decade). Also false "24+ years"
       experience claims. NEVER touches "N years old" (building ages).
FIX 2  Wrong Florida broker license numbers -> BK3313308.
FIX 3  Visible CSS leaking into page body from <img alt="..."> destroyed by an
       auto-linking script, plus the "(0K+)" parentheticals it ate.
FIX 4  Mobile / manufactured home references (standing rule: not Barrett's
       specialty, never mention).
FIX 5  Empty "Last Updated:" labels rendering as broken elements, and genuine
       "coming soon" placeholders.
FIX 6  Internal links missing a trailing slash (next.config.mjs sets
       trailingSlash: true, so each one costs a 308 redirect on every hit).
HARD   "RE/MAX" -> "REMAX"; Barrett does NOT co-run Best Bay Services.

SAFETY RULES BAKED IN
---------------------
* Never deletes a record, never drops a key, never reorders anything.
* Writes with json.dump using each file's OWN existing formatting (indent and
  ensure_ascii were measured from the committed files and are asserted on load),
  so the diff contains only real content changes -- never a whole-file reformat.
* Every rule is applied, then applied AGAIN to its own output; a rule that still
  matches its own output is non-idempotent and aborts the run.
* Record counts are asserted unchanged.
* Never invents a statistic, price, date, or license number.

Usage:
    python3 scripts/patch_content_compliance.py            # apply
    python3 scripts/patch_content_compliance.py --dry-run  # report only
"""

import argparse
import json
import os
import re
import sys
from collections import Counter, OrderedDict

# --------------------------------------------------------------------------
# File configuration.
#
# indent / ensure_ascii were measured from the committed files: loading each
# file and re-dumping it with these settings reproduces the original bytes
# exactly. verify_formatting() below re-checks that on every run, so if the
# automation ever changes how it serialises a file, this script fails loudly
# instead of silently reformatting 43 MB.
# --------------------------------------------------------------------------
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "data")

FILES = OrderedDict([
    ("posts-export.json",          {"indent": 2,    "ensure_ascii": False}),
    ("pages-content.json",         {"indent": None, "ensure_ascii": False}),
    ("market-updates-export.json", {"indent": 2,    "ensure_ascii": True}),
    ("guides-content.json",        {"indent": None, "ensure_ascii": False}),
])

# Keys whose string values are content and therefore get patched.
# 'slug' and 'date' are identifiers and are never touched.
SKIP_KEYS = {"slug", "date", "id"}


# ==========================================================================
# Rule plumbing
# ==========================================================================

class Rule:
    """A single named substitution. Must be idempotent."""

    def __init__(self, fix, name, fn):
        self.fix = fix          # e.g. "FIX 1"
        self.name = name        # human-readable
        self.fn = fn            # text -> (new_text, n_changes)

    def apply(self, text):
        return self.fn(text)


def literal(fix, name, old, new):
    """Exact-substring replacement. Idempotent as long as `new` does not
    contain `old` -- asserted at construction time."""
    assert old not in new, f"non-idempotent literal rule {name!r}: new contains old"

    def fn(text):
        n = text.count(old)
        return (text.replace(old, new), n) if n else (text, 0)

    return Rule(fix, name, fn)


def regex(fix, name, pattern, repl, flags=0):
    """Regex replacement. Idempotency is verified at runtime by re-applying."""
    rx = re.compile(pattern, flags)

    def fn(text):
        new, n = rx.subn(repl, text)
        return new, n

    return Rule(fix, name, fn)


def func(fix, name, fn):
    return Rule(fix, name, fn)


# ==========================================================================
# Location vocabulary (FIX 1)
# ==========================================================================

def load_city_names():
    """Pull city names out of src/data/cities.ts so the location vocabulary
    stays in sync with the site's own data rather than a hand-kept list."""
    path = os.path.join(DATA_DIR, "cities.ts")
    try:
        with open(path, encoding="utf-8") as fh:
            src = fh.read()
    except OSError:
        return set()
    return set(re.findall(r"name:\s*[\"']([^\"']+)[\"']", src))


EXTRA_PLACES = {
    "Tampa Bay", "Tampa", "Florida", "Pinellas", "Hillsborough", "Pasco", "Polk",
    "Manatee", "Sarasota", "Citrus", "Hernando", "Gulf Coast", "Nature Coast",
    "Central Florida", "central Florida", "Southwest Florida", "South Tampa",
    "North Pinellas", "South Pinellas", "Pinellas Beach", "Tampa Bay metro",
    "Bay area", "Gulf", "I-4 corridor",
}

_PLACES = sorted(load_city_names() | EXTRA_PLACES, key=len, reverse=True)

# One place name, optionally followed by a geography word.
_PLACE = "(?:" + "|".join(re.escape(p) for p in _PLACES) + r")(?:\s+(?:County|Counties|counties|area|region|metro|market))?"

# A list of places: "Pinellas, Hillsborough, Pasco, and surrounding counties"
_PLACE_LIST = (
    r"(?:the\s+)?(?:greater\s+)?" + _PLACE +
    r"(?:(?:,\s*|\s+and\s+|\s*&\s*|,\s*and\s+)(?:the\s+)?(?:greater\s+)?"
    r"(?:surrounding\s+(?:counties|areas|markets|communities)|all\s+of\s+"
    + _PLACE + "|" + _PLACE + r"))*"
)

# Prepositions/participles that attach a PLACE directly to the duration phrase.
_LOCATIVE_PREP = (
    r"(?:(?:working|serving|operating)\s+)?"
    r"(?:across|in|throughout|around|serving|covering|spanning)"
)

# The experience phrase whose number must never be localised.
# NOTE: this never matches "years old" -- the alternation always consumes an
# experience noun or an experience verb right after "years".
_EXPERIENCE = (
    r"\b(?P<lead>(?:over|more than|nearly|almost)\s+)?"
    r"(?P<num>2\d)\s*(?P<plus>\+)?\s*years"
    r"(?P<noun>"
    r"\s+of\s+(?:[a-z][a-z-]*\s+){0,3}(?:experience|expertise|knowledge|transactions)"
    r"|\s+in\s+real\s+estate"
    r"|\s+of\s+real\s+estate"
    r")"
)


# ==========================================================================
# FIX 1 rules
# ==========================================================================

def _rebuild_experience(m):
    """Normalise a matched experience phrase to the one approved form."""
    return "23+ years of real estate experience"


# 1a. Place directly post-modifies the experience phrase:
#     "23+ years of real estate experience across Tampa Bay" -> drop the place.
FIX1_LOCATIVE_TAIL = regex(
    "FIX 1",
    "experience phrase followed by a locative place phrase",
    _EXPERIENCE + r"\s+" + _LOCATIVE_PREP + r"\s+" + _PLACE_LIST,
    lambda m: f"{m.group('lead') or ''}{m.group('num')}{m.group('plus') or ''} years{m.group('noun')}",
)

# 1b. Place pre-modifies the experience noun:
#     "23+ years of Florida real estate experience"
#     "23+ years of Pinellas Beach market experience"
#     "23 years of Pinellas County experience"
FIX1_LOCALISED_NOUN = regex(
    "FIX 1",
    "place used as a modifier inside the experience noun phrase",
    r"\b(?:over|more than|nearly)?\s*2\d\s*\+?\s*years of (?:" +
    "|".join(re.escape(p) for p in _PLACES) +
    r")(?:\s+County)?(?:\s+(?:real estate|market|residential))?\s+"
    r"(?:experience|expertise|knowledge)",
    "23+ years of real estate experience",
)

# 1c. Local tenure must never carry a year count at all.
FIX1_LOCAL_KNOWLEDGE = regex(
    "FIX 1",
    "numbered local knowledge -> unnumbered",
    r"\b(?:over|more than|nearly)?\s*2\d\s*\+?\s*years of local (?:knowledge|expertise)",
    "deep local knowledge",
)

# 1d. Bare duration tied to a place by a verb that precedes it:
#     "helping buyers and sellers across Tampa Bay for over 23 years"
#     "selling real estate in Tampa Bay for over 23 years"
FIX1_VERB_PLACE_THEN_YEARS = regex(
    "FIX 1",
    "locative phrase between an activity verb and the year count",
    r"(?P<verb>\b(?:helping|serving|selling|working with|relocating|helped|served|sold)\b"
    r"(?P<obj>(?:\s+(?!across\b|in\b|throughout\b|to the area\b)[A-Za-z,'-]+){0,6})?)"
    r"\s+(?:across|in|throughout|to)\s+(?:the\s+)?(?:greater\s+)?(?:" +
    "|".join(re.escape(p) for p in _PLACES) + r"|area)"
    r"(?:\s+(?:County|area|region|metro))?"
    r"(?P<tail>\s+(?:for\s+)?(?:over\s+|more than\s+)?2\d\s*\+?\s*years)",
    lambda m: f"{m.group('verb')}{m.group('tail')}",
)

# 1e. Bare duration immediately followed by an activity verb + place:
#     "After 23+ years selling real estate in Tampa Bay, ..."
#     "With 23 years selling real estate across Tampa Bay, ..."
FIX1_YEARS_VERB_PLACE = regex(
    "FIX 1",
    "year count followed by activity verb and a place",
    r"(?P<head>\b(?:over\s+|more than\s+)?2\d\s*\+?\s*years\s+"
    r"(?:selling|buying|listing|working)(?:\s+(?:real estate|homes|property))?)"
    r"\s+(?:across|in|throughout)\s+(?:the\s+)?(?:greater\s+)?(?:" +
    "|".join(re.escape(p) for p in _PLACES) + r")"
    r"(?:\s+(?:County|area|region|metro))?",
    lambda m: m.group("head"),
)

# 1f. "23 years helping Tampa Bay homeowners" -- place used as an adjective on
#     the people being helped, with no experience anchor on the number.
FIX1_YEARS_HELPING_PLACE_NOUN = regex(
    "FIX 1",
    "year count helping <place> <people>",
    r"(?P<head>\b(?:over\s+|more than\s+)?2\d\s*\+?\s*years\s+(?:helping|serving))\s+(?:" +
    "|".join(re.escape(p) for p in _PLACES) +
    r")\s+(?P<people>homeowners|buyers|sellers|families|residents|clients|investors)",
    lambda m: f"{m.group('head')} {m.group('people')}",
)

# 1g. Bare duration + "serving/helping <people> in/including <place>".
#     Re-anchors the number to the approved experience phrase and drops the place.
FIX1_BARE_YEARS_SERVING = regex(
    "FIX 1",
    "bare year count serving people in a place",
    r"\b2\d\s*\+?\s*years\s+(?P<verb>serving|helping)\s+(?P<people>[a-z,\s]{0,60}?)"
    r"(?:,\s*including|\s+in|\s+across|\s+throughout)\s+" + _PLACE_LIST,
    lambda m: f"23+ years of real estate experience {m.group('verb')} "
              f"{m.group('people').strip().rstrip(',')}",
)

# 1h. False "24 years" EXPERIENCE claims (true only from September 2027).
#     Each of these consumes an experience noun/verb so "N years old" (building
#     ages, e.g. "approaching 18 to 24 years old") can never match.
FIX1_24_OF_EXPERIENCE = regex(
    "FIX 1",
    "24+ years of <experience noun> -> 23+",
    r"\b(?:over|more than|nearly)?\s*24\s*\+?\s*years of "
    r"((?:[a-z][a-z-]*\s+){0,3}(?:experience|expertise|knowledge))",
    r"23+ years of \1",
)

FIX1_24_MARKET_CYCLES = regex(
    "FIX 1",
    "24 years of market cycles -> 23+",
    r"\b24 years of market cycles",
    "23+ years of market cycles",
)

FIX1_24_PROFESSIONAL = regex(
    "FIX 1",
    "licensed professional for over/more than 24 years -> 23+",
    r"(licensed real estate professional|full-time licensed real estate professional)"
    r" for (?:over|more than) 24 years",
    r"\1 for more than 23 years",
)

FIX1_24_WORKED_MARKET = literal(
    "FIX 1",
    "worked this market for over 24 years -> unlocalised 23+",
    "someone who has worked this market for over 24 years",
    "someone with 23+ years of real estate experience",
)

# 1k. Duration tied directly to an activity performed in a place, with no
#     "years of real estate experience" anchor at all:
#       "After 23 years of selling real estate across Tampa Bay, ..."
#       "With 23 years selling real estate in this market, ..."
FIX1_YEARS_ACTIVITY_PLACE = regex(
    "FIX 1",
    "year count tied to an activity performed in a named place",
    r"(?P<head>\b(?:over\s+|more than\s+)?2\d\s*\+?\s*years\s+(?:of\s+)?"
    r"(?:experience\s+)?(?:selling|buying|listing|working)"
    r"(?:\s+(?:real estate|homes|property|waterfront property|waterfront homes))?)"
    r"\s+(?:across|in|throughout)\s+(?:the\s+)?(?:greater\s+)?"
    r"(?:this market|(?:" + "|".join(re.escape(p) for p in _PLACES) +
    r")(?:\s+(?:County|area|region|metro|real estate market|market))?)",
    lambda m: m.group("head"),
)

# 1l. "23+ years serving <place>" -- no experience anchor, duration tied to a place.
FIX1_YEARS_SERVING_PLACE = regex(
    "FIX 1",
    "bare year count serving a named place",
    r"\b(?:over\s+|more than\s+)?2\d\s*\+?\s*years\s+serving\s+(?:the\s+)?(?:greater\s+)?"
    r"(?:" + "|".join(re.escape(p) for p in _PLACES) + r")"
    r"(?:\s+(?:County|area|region|metro))?",
    "23+ years of real estate experience",
)

# 1m. "N years in this market" / "N years in the Tampa Bay real estate market".
#     Deliberately narrow: a broader "N years in <place>" pattern would wreck
#     roof-lifespan copy such as "a roof that lasts 20 years in Florida".
FIX1_YEARS_IN_THIS_MARKET = regex(
    "FIX 1",
    "year count tied to 'this market' / the Tampa Bay market",
    r"\b(?:over\s+|more than\s+)?2\d\s*\+?\s*years in (?:this market"
    r"|the Tampa Bay (?:real estate )?market)",
    "23+ years in real estate",
)

# 1n. Experience number merged with local tenure. Barrett has been licensed
#     since Sept 2003 (23+ years) but has lived in Florida only about a decade;
#     local tenure never carries a year count.
FIX1_LIVING_AND_WORKING = literal(
    "FIX 1",
    "experience number merged with Florida tenure",
    "23+ years living and working in Tampa Bay",
    "23+ years of real estate experience and over a decade living in Tampa Bay",
)

# 1i. Duplicated-word typo introduced by an earlier bulk edit.
FIX1_OF_OF = literal(
    "FIX 1", "typo 'years of of real estate experience'",
    "23 years of of real estate experience",
    "23+ years of real estate experience",
)

# 1j. Remaining hand-checked one-offs where the number is tied to a place.
FIX1_ONEOFFS = [
    literal("FIX 1", "helped buyers find homes across Pinellas County for over 23 years",
            "has helped buyers find homes across Pinellas County for over 23 years",
            "has helped buyers find homes for over 23 years"),
    literal("FIX 1", "relocate to the area over 23+ years",
            "relocate to the area over 23+ years",
            "relocate over 23+ years"),
]


# ==========================================================================
# FIX 2 -- license number
# ==========================================================================

CORRECT_LICENSE = "BK3313308"
WRONG_LICENSES = ("3246537", "3010265", "3527686")

# Handles BK3246537, BK 3246537, BK#3246537, #BK3246537, "License #BK3246537".
FIX2_BK = regex(
    "FIX 2",
    "BK-prefixed wrong license number -> BK3313308",
    r"\bBK\s*#?\s*(?:" + "|".join(WRONG_LICENSES) + r")\b",
    CORRECT_LICENSE,
)

# Safety net: a wrong number published with no BK prefix at all.
FIX2_BARE = regex(
    "FIX 2",
    "bare wrong license number -> 3313308",
    r"(?<![\dA-Za-z])(?:" + "|".join(WRONG_LICENSES) + r")(?![\d])",
    CORRECT_LICENSE[2:],
)


# ==========================================================================
# FIX 3 -- visible CSS leaking into the page body
# ==========================================================================
#
# An auto-linking script string-replaced text INSIDE <img alt="..."> attributes.
# Two distinct damage shapes resulted:
#
#   (R) The <img src="..."> survived but its alt attribute now contains injected
#       anchor markup, which terminates the tag early and spills the rest of the
#       attributes into the body as text. The image IS recoverable: strip the
#       injected anchor markup back out of the alt text.
#
#   (C) The "<img src="..." alt="" prefix was consumed outright. The source URL
#       is gone and cannot be recovered without inventing one, so the orphaned
#       CSS debris is removed instead. The card keeps its link and its title and
#       simply renders without a thumbnail -- a missing image is vastly better
#       than visible CSS in a paragraph.

_THUMB_STYLE = (
    r"width:100%;height:(?:auto|\d+px);(?:object-fit:cover;)?display:block;"
    r"(?:opacity:0\.8;)?"
)
_LAZY = r'(?:\s+loading="lazy")?'


def fix3_reconstruct_alt(text):
    """Shape (R): rebuild a polluted alt attribute on a surviving <img>."""
    rx = re.compile(
        r'alt="(?P<inner>(?:(?!" style=)[\s\S]){0,400}?)" style="(?P<st>'
        + _THUMB_STYLE + r')"(?P<lazy>' + _LAZY + r')>'
    )
    out = []
    pos = 0
    n = 0
    for m in rx.finditer(text):
        inner = m.group("inner")
        if "<a" not in inner and "</a>" not in inner:
            continue
        # Only repair if a real <img src="..."> owns this alt attribute.
        head = text.rfind("<img", max(0, m.start() - 600), m.start())
        if head == -1 or 'src="' not in text[head:m.start()]:
            continue
        cleaned = inner.replace('<a href=" />', " ")
        cleaned = re.sub(r"<a\b[^>]*>", " ", cleaned)
        cleaned = cleaned.replace("</a>", " ")
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        if "<" in cleaned or '"' in cleaned:
            continue  # still not clean -- leave it for the shape (C) pass
        out.append(text[pos:m.start()])
        out.append(f'alt="{cleaned}" style="{m.group("st")}"{m.group("lazy")}>')
        pos = m.end()
        n += 1
    out.append(text[pos:])
    return ("".join(out), n) if n else (text, 0)


def fix3_strip_orphan_css(text):
    """Shape (C): delete orphaned image debris that renders as visible CSS."""
    rx = re.compile(
        r'(?P<keep>/?>)(?P<eaten>[^<>"]{0,160})</a>(?P<rest>[^<>"]{0,160})'
        r'" style="' + _THUMB_STYLE + r'"' + _LAZY + r'>'
    )
    out = []
    pos = 0
    n = 0
    for m in rx.finditer(text):
        # Never fire inside an unterminated alt="..." -- that is shape (R)
        # territory and blindly truncating there would corrupt the tag.
        alt = text.rfind('alt="', max(0, m.start() - 600), m.start())
        if alt != -1 and '"' not in text[alt + 5:m.start()]:
            continue
        out.append(text[pos:m.start()])
        out.append(m.group("keep"))
        pos = m.end()
        n += 1
    out.append(text[pos:])
    return ("".join(out), n) if n else (text, 0)


def fix3_wrap_orphan_stylesheet(text):
    """A legacy WordPress stylesheet was stored in the content field with no
    <style> wrapper, so the whole block renders as a wall of CSS text at the top
    of the page. Wrap it rather than delete it -- wrapping stops the leak without
    discarding anything. Idempotent: once wrapped the text no longer starts with
    a CSS comment, so it cannot match again."""
    marker = "/* === THEME OVERRIDES"
    if not text.lstrip().startswith(marker):
        return text, 0
    start = text.index(marker)
    m = re.search(r"\}\s*(?=<)", text[start:])
    if not m:
        return text, 0
    end = start + m.end()
    return text[:start] + "<style>\n" + text[start:end].rstrip() + "\n</style>\n" + text[end:], 1


# Dollar figures eaten by the same regex trap. Only the PARENTHETICAL forms are
# repaired, and they are repaired by REMOVING the broken parenthetical -- never
# by guessing a price. A wrong price on a real estate site is a liability.
FIX3_PAREN_DOLLARS = [
    literal("FIX 3", "eaten price parenthetical in card title",
            "Buyer's Guide (0K+)", "Buyer's Guide"),
    literal("FIX 3", "eaten price parenthetical in luxury intro",
            "Tampa Bay luxury homes (0K+) are concentrated in",
            "Tampa Bay luxury homes are concentrated in"),
]


# ==========================================================================
# FIX 4 -- mobile / manufactured home references
# ==========================================================================
#
# Standing rule: Barrett is not a mobile/manufactured home specialist and this
# is never to be mentioned. Each entry below is an exact literal so the edit is
# auditable and cannot collaterally damage unrelated text. Sentences are removed
# whole; list items and table rows are removed whole; paragraphs that are
# entirely about manufactured housing are removed whole.
#
# DELIBERATELY NOT TOUCHED (false positives -- see the report):
#   * "T-Mobile Home Internet" / "Verizon/T-Mobile home internet" -- ISP brands.
#   * "Division of Condominiums, Timeshares, and Mobile Homes" -- the legal name
#     of a Florida state agency cited alongside FS 718/720.
#   * posts-export.json / florida-mobile-home-guide -- an entire record devoted
#     to the forbidden topic. Deleting a record is forbidden by the brief, and
#     rewriting it is not possible. Flagged for an unpublish/redirect decision.

FIX4 = [
    # --- whole list items -------------------------------------------------
    literal("FIX 4", "seffner list item (mobile/manufactured homes)",
            '<li style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:8px;">'
            '<strong style="color:#0f172a;">Mobile and manufactured homes:</strong> '
            'Seffner has a higher concentration of mobile and manufactured homes than '
            'Brandon or Valrico. Some of these sit on owned land (which can be a great '
            'value play), while others are in mobile home parks with lot rent.</li>', ""),
    literal("FIX 4", "dover list item (mobile/manufactured homes)",
            "<li><strong>Mobile and manufactured homes</strong> &mdash; A significant "
            "portion of Dover's housing stock is manufactured homes on owned land "
            "(not in parks)</li>", ""),
    literal("FIX 4", "brandon map guide list item (mixed property types)",
            '<li style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:8px;">'
            'Some pockets have mixed property types (stick-built next to manufactured '
            'homes)</li>', ""),
    literal("FIX 4", "seffner fha/va eligible property type",
            "<li>Single-family detached home (preferred over condos or manufactured homes)</li>",
            "<li>Single-family detached home</li>"),
    literal("FIX 4", "weeki wachee hard-to-finance list item",
            '<li style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:8px;">'
            'Older manufactured or mobile home properties — mainstream lenders often '
            'decline these</li>', ""),
    literal("FIX 4", "55+ guide related link to the mobile home guide",
            '<li style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:8px;">'
            '<a href="/blog/florida-mobile-home-guide/" style="color:#0f172a;font-weight:600;'
            'text-decoration:underline;text-decoration-color:rgba(15,23,42,0.3);'
            'text-underline-offset:2px;">Florida Mobile Home Buying Guide</a></li>', ""),

    # --- whole table rows / cells ----------------------------------------
    literal("FIX 4", "seffner price table cell",
            '<td style="padding:14px 18px;border-bottom:1px solid #e4e4e4;color:#374151;">'
            'Mobile/manufactured home on owned land</td>',
            '<td style="padding:14px 18px;border-bottom:1px solid #e4e4e4;color:#374151;">'
            'Older home on a standard lot</td>'),
    literal("FIX 4", "dover price table cell",
            '<td style="padding:12px 18px;border-bottom:1px solid #e5e7eb">'
            'Mobile/manufactured home</td>',
            '<td style="padding:12px 18px;border-bottom:1px solid #e5e7eb">'
            'Older home on acreage</td>'),
    literal("FIX 4", "seffner community guide table cell A",
            '<td style="padding:14px 18px;border-bottom:1px solid #e4e4e4;color:#374151;">'
            'Older ranch homes, block construction, some manufactured homes</td>',
            '<td style="padding:14px 18px;border-bottom:1px solid #e4e4e4;color:#374151;">'
            'Older ranch homes and block construction</td>'),
    literal("FIX 4", "seffner community guide table cell B",
            '<td style="padding:14px 18px;border-bottom:1px solid #e4e4e4;color:#374151;">'
            'Manufactured/mobile homes</td>',
            '<td style="padding:14px 18px;border-bottom:1px solid #e4e4e4;color:#374151;">'
            'Older homes on larger lots</td>'),
    literal("FIX 4", "largo 55+ table cell",
            '<td style="padding:12px;">Manufactured housing on owned lots</td>',
            '<td style="padding:12px;">Homes on owned lots</td>'),

    # --- single sentences inside otherwise-fine paragraphs ----------------
    literal("FIX 4", "gibsonton new construction corridor sentence",
            "The US-41 corridor through Gibsonton contains older neighborhoods, "
            "manufactured home parks, commercial strips, and scattered residential lots.",
            "The US-41 corridor through Gibsonton contains older neighborhoods, "
            "commercial strips, and scattered residential lots."),
    literal("FIX 4", "sun city center housing options sentence",
            " There are also manufactured homes within certain sections of the community "
            "that offer the most affordable entry point, typically under $150,000.", ""),
    literal("FIX 4", "seffner price paragraph sentence",
            " Mobile and manufactured homes on owned land offer the most affordable entry "
            "point, often below $200,000.", ""),
    literal("FIX 4", "dover median price sentence",
            "The median home price in Dover varies significantly by property type. "
            "Manufactured homes on acreage typically sell between $150K and $250K, older "
            "ranch-style homes range from $250K to $400K, and newer construction on larger "
            "lots runs $350K to $550K.",
            "The median home price in Dover varies significantly by property type. Older "
            "ranch-style homes range from $250K to $400K, and newer construction on larger "
            "lots runs $350K to $550K."),
    literal("FIX 4", "retiring in tampa bay price range sentence",
            "Homes here range from condos and manufactured homes in the $150,000-$200,000 "
            "range up to single-family homes in the $300,000-$400,000+ range.",
            "Homes here range from condos in the $150,000-$200,000 range up to "
            "single-family homes in the $300,000-$400,000+ range."),
    literal("FIX 4", "55+ guide sun city center price range sentence",
            "Homes range from manufactured homes and condos in the $150,000--$200,000 range "
            "up to single-family homes in the $300,000--$425,000 range.",
            "Homes range from condos in the $150,000--$200,000 range up to single-family "
            "homes in the $300,000--$425,000 range."),
    literal("FIX 4", "55+ guide kings point affordability sentences",
            " Manufactured homes within the Sun City Center area can also be found at lower "
            "price points, though financing options are more limited for manufactured homes.",
            ""),
    literal("FIX 4", "brandon map guide home styles A",
            " Some manufactured homes and mobile homes mixed in.", ""),
    literal("FIX 4", "brandon map guide home styles B",
            "Older farmhouses, manufactured homes, and some newer stick-built homes on large "
            "parcels.",
            "Older farmhouses and some newer stick-built homes on large parcels."),
    literal("FIX 4", "seffner community guide paragraph (whole passage)",
            '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
            "You'll also see manufactured homes and mobile homes in Seffner, particularly on "
            "larger lots. These are priced well below site-built homes and represent the most "
            "affordable entry point in the area. Just be aware that financing options are more "
            "limited for manufactured homes, and they don't appreciate the same way site-built "
            "homes do.</p>", ""),
    literal("FIX 4", "oldsmar gull aire village sentence",
            "It includes a mix of site-built and manufactured homes, with prices ranging from "
            "$120K to $280K.",
            "Prices range from $120K to $280K."),
    literal("FIX 4", "ellenton buyer guide sentence (visible copy + schema text)",
            " Manufactured home parks also exist in the area; confirm property type before "
            "viewing.", ""),
    literal("FIX 4", "ellenton real estate guide housing stock sentence",
            "The housing stock is predominantly concrete block single-family homes built from "
            "the 1960s through the 1990s, with some newer construction in communities developed "
            "after 2000 and some mobile or manufactured home parks on the community periphery.",
            "The housing stock is predominantly concrete block single-family homes built from "
            "the 1960s through the 1990s, with some newer construction in communities developed "
            "after 2000."),
    literal("FIX 4", "fort meade waterfront acreage list item",
            ", often with an older home or mobile home already on the property (note: "
            "manufactured homes are a distinct category — refer to listing details for "
            "specifics)",
            ", often with an older home already on the property"),
    literal("FIX 4", "floral city rentals sentence",
            "Apartment complexes do not exist in Floral City; all rentals are single-family "
            "homes or the occasional manufactured home (on owned land, not in parks).",
            "Apartment complexes do not exist in Floral City; all rentals are single-family "
            "homes."),
    literal("FIX 4", "largo ranchero village sentence",
            "Ranchero Village is a deed-restricted 55+ community in Largo offering manufactured "
            "housing on owned lots homes priced from",
            "Ranchero Village is a deed-restricted 55+ community in Largo offering homes on "
            "owned lots priced from"),
    literal("FIX 4", "auburndale berkley road sentence",
            " Manufactured home communities in Auburndale's less central areas provide the most "
            "affordable entry-level homeownership opportunities in the market for buyers whose "
            "priority is cost minimization.", ""),
    literal("FIX 4", "auburndale buyer-priorities sentence",
            "Buyers seeking the lowest possible entry price with access to Auburndale's I-4 "
            "corridor advantages should look at the downtown-adjacent streets and the "
            "manufactured home communities in the city's outer areas.",
            "Buyers seeking the lowest possible entry price with access to Auburndale's I-4 "
            "corridor advantages should look at the downtown-adjacent streets."),
    literal("FIX 4", "bradenton bayshore gardens sentence",
            "Established mid-Bradenton communities offering a variety of single-family homes, "
            "townhomes, and manufactured housing options at accessible price points.",
            "Established mid-Bradenton communities offering a variety of single-family homes "
            "and townhomes at accessible price points."),
    literal("FIX 4", "hudson market sentence",
            "Buyers can find single-family homes, canal-front properties, manufactured homes, "
            "and condos at prices that make homeownership accessible for a wide range of budgets.",
            "Buyers can find single-family homes, canal-front properties, and condos at prices "
            "that make homeownership accessible for a wide range of budgets."),
    literal("FIX 4", "new port richey elfers sentence",
            " Elfers has significant mobile and manufactured housing as well.", ""),
    literal("FIX 4", "new port richey retirement sentence",
            " Several 55+ manufactured home communities in the area offer the lowest-cost "
            "retirement entry points in the Tampa Bay metro.", ""),
    literal("FIX 4", "palmetto terra siesta paragraph (whole passage)",
            "<p>Terra Siesta and North River Estates serve the 55-plus manufactured home market "
            "at the most affordable price points in the area. These are deed-owned communities "
            "(not rented land) that represent a genuinely different ownership proposition from "
            "the master-planned communities. They attract buyers who want Manatee County living "
            "at the lowest possible cost of entry — some properties here are available well "
            "under $200,000 — while still accessing the county's amenities, school district, "
            "and beach proximity. These communities are well-maintained and have active social "
            "programming for their residents.</p>", ""),
    literal("FIX 4", "parrish ellenton comparison sentence",
            "Its residential stock is a mix of older single-family homes, some manufactured home "
            "communities, and newer subdivisions.",
            "Its residential stock is a mix of older single-family homes and newer subdivisions."),
    literal("FIX 4", "sun city center property types sentence",
            "Property types range from single-family homes and villas to condominiums and "
            "manufactured homes, giving buyers a wide selection at various price points.",
            "Property types range from single-family homes and villas to condominiums, giving "
            "buyers a wide selection at various price points."),
    literal("FIX 4", "thonotosassa housing stock sentence",
            "You will find older mid-century homes on large lots, custom-built newer construction "
            "on multi-acre parcels, manufactured homes, equestrian estates with stables and "
            "paddocks, and lakefront properties with docks.",
            "You will find older mid-century homes on large lots, custom-built newer construction "
            "on multi-acre parcels, equestrian estates with stables and paddocks, and lakefront "
            "properties with docks."),
    literal("FIX 4", "va loan guide eligibility sentence",
            " Manufactured homes are eligible under certain conditions.", ""),
    literal("FIX 4", "usda loan guide eligibility sentence",
            " Manufactured homes on permanent foundations may be eligible with certain lenders.",
            ""),

    # --- pages where manufactured housing was a structural topic ----------
    # Each of these removes a self-contained section. Verified beforehand that
    # none of these pages carry the removed text inside their JSON-LD, so no
    # schema/content mismatch is created.
    literal("FIX 4", "gibsonton page: mobile home communities section",
            "<h3>South Bay and Mobile Home Communities</h3>\n<p>Gibsonton contains a significant "
            "stock of mobile and manufactured housing — both in dedicated communities and on "
            "individual lots. For buyers with limited budgets or buyers looking at lot-owned (not "
            "lot-leased) manufactured homes, Gibsonton offers inventory that simply doesn't exist "
            "at comparable prices anywhere else in Hillsborough County. This component of the "
            "market also attracts investors who use manufactured home rentals as cash-flow "
            "investments. Buyers considering manufactured homes should pay close attention to "
            "financing options, as conventional mortgage products have specific requirements for "
            "manufactured home construction and installation standards.</p>\n", ""),
    literal("FIX 4", "gibsonton page: mobile-vs-site-built FAQ",
            "<h3>What is the mix of mobile homes versus site-built homes?</h3>\n<p>Gibsonton has "
            "a higher proportion of mobile and manufactured housing than most Hillsborough County "
            "communities — it's part of the area's working-class character and history. "
            "Site-built single-family homes make up the majority of the market by value, but "
            "manufactured homes on both owned lots and in lot-leased communities are a significant "
            "segment. If you're specifically looking for or avoiding manufactured homes, be "
            "explicit with your agent about that preference so searches and showing schedules can "
            "be filtered accordingly. Financing for manufactured homes works differently than for "
            "site-built homes, so discuss options with your lender early.</p>\n", ""),
    literal("FIX 4", "gibsonton page: housing mix sentence",
            "The community includes a mix of older site-built homes, mobile and manufactured "
            "housing communities, and pockets of newer subdivision development near the Riverview "
            "border.",
            "The community includes a mix of older site-built homes and pockets of newer "
            "subdivision development near the Riverview border."),
    literal("FIX 4", "gibsonton page: MLS filter sentence",
            "You can filter by price range, property type (including manufactured/mobile homes), "
            "waterfront status, and bedroom count.",
            "You can filter by price range, property type, waterfront status, and bedroom count."),
    literal("FIX 4", "gibsonton page: investor cap-rate sentence",
            " Manufactured home rentals, in particular, offer high cap rates relative to more "
            "suburban Hillsborough markets.", ""),
    literal("FIX 4", "gibsonton page: price range sentence",
            " Mobile and manufactured homes on owned lots can be found well below $200,000.", ""),
    literal("FIX 4", "gibsonton page: investor yield sentence",
            " The manufactured housing segment in particular offers high gross rental yields.", ""),
    literal("FIX 4", "pinellas park page: manufactured community section",
            "<h3>Pinellas Park Manufactured / Mobile Home Communities</h3>\n<p>The city has a "
            "significant stock of manufactured home communities, many of which are 55+ and "
            "land-owned. These offer exceptional affordability — often under $150,000 — "
            "for buyers seeking low-maintenance Florida living close to the coast.</p>\n", ""),
    literal("FIX 4", "pinellas park page: 55+ FAQ answer",
            "<p>Yes. Pinellas Park has a large number of 55+ manufactured and mobile home "
            "communities, as well as some site-built retirement communities. Many of these offer "
            "land ownership rather than lot leases, which is an important distinction. Prices in "
            "these communities can be well under $200,000, offering an affordable retirement "
            "option close to the beaches.</p>",
            "<p>Yes. Pinellas Park has a number of site-built 55+ retirement communities. Prices "
            "in these communities can be well under $300,000, offering an affordable retirement "
            "option close to the beaches.</p>"),
    literal("FIX 4", "zephyrhills page: MLS blurb",
            " — from downtown bungalows to new construction communities, 55-plus mobile home "
            "parks, and golf communities.",
            " — from downtown bungalows to new construction communities and golf communities."),
    literal("FIX 4", "zephyrhills page: betmar acres section",
            "<h3>Betmar Acres — Established 55-Plus Mobile Home Community</h3>\n<p>Betmar "
            "Acres is one of the largest and most established 55-plus manufactured home "
            "communities in Pasco County and one of the most active communities of its type in the "
            "Tampa Bay area. With hundreds of homes, an extremely active social calendar, pools, "
            "recreation facilities, and a strong sense of community, Betmar Acres represents an "
            "entire lifestyle for active seniors. It is an affordable homeownership option for "
            "retirees on fixed incomes who want community engagement and ownership rather than "
            "renting.</p>\n", ""),
    literal("FIX 4", "zephyrhills page: 55+ paragraph",
            "<p>Zephyrhills has a significant number of 55-plus communities, including "
            "manufactured/mobile home parks like Betmar Acres. If you are considering a 55-plus "
            "community, understand the difference between community-owned land (where you own the "
            "home but pay lot rent) and fee-simple ownership. Both have implications for "
            "financing, resale, and long-term costs that a knowledgeable agent can help you "
            "navigate.</p>",
            "<p>Zephyrhills has a significant number of 55-plus communities. If you are "
            "considering one, understand the difference between community-owned land and "
            "fee-simple ownership. Both have implications for financing, resale, and long-term "
            "costs that a knowledgeable agent can help you navigate.</p>"),
    literal("FIX 4", "zephyrhills page: median price sentence",
            " Manufactured and mobile homes in 55-plus communities are available at significantly "
            "lower price points.", ""),
    # --- tampa-bay-beaches-guide: excerpt was a copy of the mobile-home guide's
    #     excerpt. Replaced with a description drawn from this post's own quick
    #     answer -- no new facts introduced.
    literal("FIX 4", "beaches guide: wrong (mobile home) excerpt",
            "Guide to mobile and manufactured homes in Florida  -  financing, land "
            "ownership, insurance, wind zones, and what buyers need to know before "
            "purchasing.",
            "Guide to the best beaches near Tampa Bay  -  Clearwater Beach, St. Pete "
            "Beach, and Fort De Soto Park, all within 60 to 90 minutes of Brandon, "
            "Riverview, and Valrico."),

    # --- pages-content.json / ellenton: manufactured housing ran through this
    #     page as a structural topic. Verified beforehand that none of the removed
    #     text appears in the page's JSON-LD, so no schema/content mismatch is
    #     created by removing it.
    literal("FIX 4", "ellenton page: residential mix paragraph",
            "<p>Ellenton's residential mix includes conventional single-family homes in "
            "neighborhoods like Oakleaf Hammock and Highland Shores, manufactured home "
            "communities on deed-owned land (Terra Siesta, North River Estates, Ridgewood "
            "Meadows), and some newer construction in the eastern sections. The "
            "manufactured home communities are some of the most affordable owned housing "
            "in Manatee County and attract buyers at the $100,000 to $200,000 price point "
            "who want to own their land outright rather than rent a lot.</p>",
            "<p>Ellenton's residential mix includes conventional single-family homes in "
            "neighborhoods like Oakleaf Hammock and Highland Shores, along with some newer "
            "construction in the eastern sections.</p>"),
    literal("FIX 4", "ellenton page: Tidevue Estates section",
            "<h3>Tidevue Estates</h3>\n\n<p>Tidevue Estates rounds out Ellenton's "
            "active-adult and all-ages manufactured home community options alongside Terra "
            "Siesta, North River Estates, and Ridgewood Meadows. These communities "
            "collectively provide one of the lowest-cost-entry ownership options in all of "
            "Manatee County, with deed-owned land giving residents genuine equity rather "
            "than the lot-rental model that characterizes some manufactured home parks. For "
            "buyers on fixed incomes or modest retirement budgets, these communities "
            "represent a legitimate path to Manatee County homeownership that is otherwise "
            "unavailable at this price tier.</p>\n\n", ""),
    literal("FIX 4", "ellenton page: 55-plus living section",
            "<h2>Active Adult and 55-Plus Living in Ellenton</h2>\n\n<p>Ellenton's median "
            "resident age of 50 reflects a significant active adult and retirement-age "
            "population, and the community has several 55-plus options that represent some "
            "of the most affordable owned housing in Manatee County.</p>\n\n<p><strong>Terra "
            "Siesta</strong> is a 55-plus manufactured home community on deed-owned land "
            "— meaning residents own both the home and the lot beneath it, unlike "
            "lot-rent manufactured home communities. This ownership structure is important "
            "for buyers evaluating long-term security and equity. <strong>North River "
            "Estates</strong> and <strong>Ridgewood Meadows</strong> are similar 55-plus "
            "options with split-floor plan homes at affordable price points.</p>\n\n<p>These "
            "communities serve a genuine need for buyers on fixed incomes or modest "
            "retirement budgets who want to be in Manatee County without paying "
            "single-family home prices in conventional neighborhoods. For this buyer "
            "profile, Ellenton's 55-plus manufactured home options are worth a serious look "
            "as part of a comprehensive evaluation of the area's housing market. See our "
            "guide to <a href=\"/tampa-bay-55-plus-communities-guide/\">55-plus communities "
            "in Tampa Bay</a> for a broader overview of active adult options across the "
            "region.</p>\n\n", ""),
    literal("FIX 4", "ellenton page: investment paragraph",
            "<p>The manufactured home communities in Ellenton are not conventional "
            "investment targets due to lending restrictions and the difficulty of renting "
            "manufactured homes to tenants with similar profile to single-family home "
            "renters. Buyers considering manufactured homes in Ellenton are primarily "
            "owner-occupants rather than investors, and the investment case is in "
            "owner-occupancy cost savings versus renting, not in rental income "
            "generation.</p>\n\n", ""),
    literal("FIX 4", "ellenton page: vs Parrish value sentence",
            "Prices are below the county median, and the manufactured home communities "
            "offer the lowest cost of entry for owned real estate in Manatee County.",
            "Prices are below the county median."),
    literal("FIX 4", "ellenton page: median price FAQ sentence",
            " Manufactured home communities in Ellenton offer much lower entry points in "
            "the $100,000 to $200,000 range.", ""),
    literal("FIX 4", "ellenton page: 55-plus FAQ",
            "<h3>Does Ellenton have 55-plus communities?</h3>\n\n<p>Yes. Terra Siesta, "
            "North River Estates, Ridgewood Meadows, and Tidevue Estates are 55-plus "
            "manufactured home communities on deed-owned land — meaning residents own "
            "the home and lot outright. These represent some of the most affordable owned "
            "housing in Manatee County and are popular with retirement-age buyers on fixed "
            "incomes.</p>\n\n", ""),
    literal("FIX 4", "ellenton page: manufactured financing paragraph",
            "<p>For manufactured homes in the 55-plus communities, the financing picture is "
            "different from conventional single-family lending. Not all loan programs will "
            "finance manufactured homes, and buyers typically need to identify lenders who "
            "specialize in this product type. The deed-owned-land status of communities like "
            "Terra Siesta is important — it means the home and lot can be financed "
            "together with a conventional or FHA manufactured home loan, unlike lot-rental "
            "parks where only the home is financed. Barrett can connect buyers with lenders "
            "who specialize in manufactured home financing if this segment of the market is "
            "of interest.</p>\n\n", ""),
    literal("FIX 4", "ellenton page: manufactured home options bullet",
            "<p><strong>Manufactured home options:</strong> For buyers with limited budgets, "
            "the deed-owned manufactured home communities in Ellenton represent a genuinely "
            "accessible path to Manatee County homeownership that does not exist at this "
            "price point elsewhere in the county.</p>", ""),

    literal("FIX 4", "zephyrhills page: active adult paragraph",
            "<p>Zephyrhills has long been known as a destination for active adults and retirees. "
            "Betmar Acres is one of the largest and most active 55-plus manufactured home "
            "communities in the Tampa Bay area, with hundreds of homes and an extremely full "
            "activity calendar. Silver Oaks offers site-built homes in a golf community setting "
            "for active adult buyers who want more traditional homeownership. Several smaller "
            "55-plus neighborhoods and manufactured home parks are also located throughout the "
            "Zephyrhills area.</p>",
            "<p>Zephyrhills has long been known as a destination for active adults and retirees. "
            "Silver Oaks offers site-built homes in a golf community setting for active adult "
            "buyers who want more traditional homeownership. Several smaller 55-plus "
            "neighborhoods are also located throughout the Zephyrhills area.</p>"),
]


# ==========================================================================
# FIX 5 -- stale / broken date labels and genuine placeholders
# ==========================================================================
#
# DELIBERATELY NOT CHANGED: 908 pages in pages-content.json carry a hardcoded
# "Last Updated: March 2026". Blanket-stamping those with today's date would be
# a false freshness signal. They are reported and left for an owner decision.

FIX5_EMPTY_DATE = regex(
    "FIX 5",
    "remove empty 'Last Updated:' label (renders as a broken element)",
    r"\s*<p[^>]{0,300}>(?:<em>)?Last Updated:\s*(?:</em>)?</p>",
    "",
)

# Same empty label, but inside a byline paragraph that has other content, so
# only the label is removed and the byline is kept.
FIX5_EMPTY_DATE_BYLINE = literal(
    "FIX 5",
    "remove empty 'Last Updated:' from a byline paragraph",
    " | Last Updated: </p>", "</p>",
)

FIX5_COMING_SOON = regex(
    "FIX 5",
    "remove genuine 'coming soon' placeholder block",
    r'<p[^>]{0,300}><strong[^>]{0,120}>Live Tampa Listings Coming Soon</strong><br>'
    r'Showcase IDX integration will display active Tampa listings here\.</p>\s*',
    "",
)


# ==========================================================================
# HARD RULES
# ==========================================================================

HARD = [
    literal("HARD", "RE/MAX -> REMAX (the slash hurts SEO/AEO)", "RE/MAX", "REMAX"),
    literal("HARD", "master suite -> owners suite", "master suite", "owners suite"),
    literal("HARD", "Master Suite -> Owners Suite", "Master Suite", "Owners Suite"),
    # James Evans runs Best Bay Services. Barrett does NOT co-run it.
    literal("HARD", "best-realtor-brandon / brandon-realtor co-run claim",
            'Barrett co-runs <a href="https://bestbayservices.com">Best Bay Services</a>',
            'Barrett works with <a href="https://bestbayservices.com">Best Bay Services</a>'),
    literal("HARD", "largo-realtor co-run claim",
            "Barrett co-runs <strong>Best Bay Services</strong>",
            "Barrett works with <strong>Best Bay Services</strong>"),
    literal("HARD", "plant-city-realtor co-run claim",
            "Barrett co-runs Best Bay Services",
            "Barrett works with Best Bay Services"),
    literal("HARD", "plant-city-realtor co-ownership claim",
            "co-ownership of Best Bay Services (in-house repair and maintenance coordination)",
            "a working relationship with Best Bay Services (in-house repair and maintenance "
            "coordination)"),
]


# ==========================================================================
# FIX 6 -- trailing slashes on internal links
# ==========================================================================
#
# next.config.mjs sets trailingSlash: true, so every internal link without a
# trailing slash 308-redirects on each hit.

_HREF_RX = re.compile(r"""href=(["'])(/[^"'>\s]*)\1""")
_FILE_EXT_RX = re.compile(r"\.[A-Za-z0-9]{2,5}$")


def fix6_trailing_slash(text):
    n = [0]

    def repl(m):
        quote, href = m.group(1), m.group(2)
        if href.startswith("//"):              # protocol-relative
            return m.group(0)
        if "#" in href or "?" in href:          # anchors / query strings
            return m.group(0)
        if href.endswith("/"):                  # already correct
            return m.group(0)
        if _FILE_EXT_RX.search(href.rsplit("/", 1)[-1]):   # /og-image.png
            return m.group(0)
        n[0] += 1
        return f"href={quote}{href}/{quote}"

    return _HREF_RX.sub(repl, text), n[0]


# ==========================================================================
# Rule registry -- ORDER MATTERS
# ==========================================================================

def build_rules():
    rules = []
    # FIX 3 first: shape (R) must run before shape (C), and both must run before
    # the dollar-parenthetical cleanup (shape (C) deletes duplicate copies of it).
    rules.append(func("FIX 3", "reconstruct <img> alt destroyed by auto-linker",
                      fix3_reconstruct_alt))
    rules.append(func("FIX 3", "strip orphaned CSS debris (image unrecoverable)",
                      fix3_strip_orphan_css))
    rules.append(func("FIX 3", "wrap orphaned stylesheet rendering as body text",
                      fix3_wrap_orphan_stylesheet))
    rules.extend(FIX3_PAREN_DOLLARS)

    # FIX 1
    rules.append(FIX1_OF_OF)
    rules.append(FIX1_LOCAL_KNOWLEDGE)
    rules.append(FIX1_LOCALISED_NOUN)
    rules.append(FIX1_LOCATIVE_TAIL)
    rules.append(FIX1_BARE_YEARS_SERVING)
    rules.append(FIX1_YEARS_VERB_PLACE)
    rules.append(FIX1_YEARS_ACTIVITY_PLACE)
    rules.append(FIX1_YEARS_SERVING_PLACE)
    rules.append(FIX1_YEARS_IN_THIS_MARKET)
    rules.append(FIX1_LIVING_AND_WORKING)
    rules.append(FIX1_YEARS_HELPING_PLACE_NOUN)
    rules.append(FIX1_VERB_PLACE_THEN_YEARS)
    rules.append(FIX1_24_OF_EXPERIENCE)
    rules.append(FIX1_24_MARKET_CYCLES)
    rules.append(FIX1_24_PROFESSIONAL)
    rules.append(FIX1_24_WORKED_MARKET)
    rules.extend(FIX1_ONEOFFS)

    # FIX 2
    rules.append(FIX2_BK)
    rules.append(FIX2_BARE)

    # FIX 4
    rules.extend(FIX4)

    # FIX 5
    rules.append(FIX5_EMPTY_DATE)
    rules.append(FIX5_EMPTY_DATE_BYLINE)
    rules.append(FIX5_COMING_SOON)

    # HARD rules
    rules.extend(HARD)

    # FIX 6 last so it normalises any href touched by an earlier rule.
    rules.append(func("FIX 6", "append trailing slash to internal links",
                      fix6_trailing_slash))
    return rules


# ==========================================================================
# Guard: building ages must never be touched
# ==========================================================================

_YEARS_OLD_RX = re.compile(r"\b\d{1,3}\s*\+?\s*years old\b")


def years_old_fingerprint(text):
    """Every 'N years old' phrase in the text. A previous bulk replace of the
    experience claim corrupted statutory building ages across the site; this
    fingerprint is compared before/after and aborts the run on any change."""
    return Counter(_YEARS_OLD_RX.findall(text))


# ==========================================================================
# Driver
# ==========================================================================

# Serialiser shapes to try, in order, when detecting a file's own formatting.
# The content automation has changed format under us at least once (Batch 81
# minified posts-export.json from indent=2 to compact separators), so the
# formatting is DETECTED per run rather than hardcoded. Hardcoding it meant the
# script refused to run after any upstream format change — which, on a rebase,
# is exactly the moment the fixes most need re-applying.
_SERIALISER_CANDIDATES = [
    {"indent": 2,    "ensure_ascii": False, "separators": None},
    {"indent": None, "ensure_ascii": False, "separators": None},
    {"indent": 2,    "ensure_ascii": True,  "separators": None},
    {"indent": None, "ensure_ascii": True,  "separators": None},
    {"indent": None, "ensure_ascii": False, "separators": (",", ":")},  # minified
    {"indent": None, "ensure_ascii": True,  "separators": (",", ":")},
    {"indent": 4,    "ensure_ascii": False, "separators": None},
]


def _dump(data, cfg):
    kwargs = {"ensure_ascii": cfg["ensure_ascii"], "indent": cfg["indent"]}
    if cfg.get("separators"):
        kwargs["separators"] = cfg["separators"]
    return json.dumps(data, **kwargs).encode("utf-8")


def verify_formatting(path, data, cfg, raw):
    """Detect the file's OWN serialiser and confirm it reproduces it byte-for-byte.

    Why detection rather than a fixed config: the diff must contain only real
    content changes. If we rewrite a minified 43MB file as indented JSON, every
    line changes, the review is useless, and the next rebase conflicts on the
    whole file. So we find the exact shape that round-trips and reuse it.

    Mutates cfg in place with the detected shape so the write path matches.
    """
    for candidate in _SERIALISER_CANDIDATES:
        if _dump(data, candidate) == raw:
            cfg.update(candidate)
            return
    sys.exit(
        f"ABORT: {os.path.basename(path)} does not round-trip with any known "
        f"serialiser shape. Inspect the first ~200 bytes of the file and add its "
        f"shape to _SERIALISER_CANDIDATES. Refusing to rewrite it blind, because "
        f"guessing would reformat every line of the file."
    )


def measure_links(data):
    """Count internal links and how many are missing a trailing slash."""
    total = missing = home_val = 0
    for rec in data:
        for key, val in rec.items():
            if key in SKIP_KEYS or not isinstance(val, str):
                continue
            for m in _HREF_RX.finditer(val):
                href = m.group(2)
                if href.startswith("//"):
                    continue
                total += 1
                if "#" in href or "?" in href or href.endswith("/"):
                    continue
                if _FILE_EXT_RX.search(href.rsplit("/", 1)[-1]):
                    continue
                missing += 1
                if href == "/home-valuation":
                    home_val += 1
    return total, missing, home_val


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true",
                    help="report what would change without writing")
    args = ap.parse_args()

    rules = build_rules()
    grand = Counter()
    grand_records = Counter()

    print("=" * 78)
    print("CONTENT COMPLIANCE PATCH" + ("  [DRY RUN]" if args.dry_run else ""))
    print("=" * 78)

    for fname, cfg in FILES.items():
        path = os.path.normpath(os.path.join(DATA_DIR, fname))
        with open(path, "rb") as fh:
            raw = fh.read()
        data = json.loads(raw)
        verify_formatting(path, data, cfg, raw)

        n_before = len(data)
        links_before = measure_links(data)

        counts = Counter()
        touched = set()

        for rec in data:
            rec_changed = False
            for key in list(rec.keys()):
                val = rec[key]
                if key in SKIP_KEYS or not isinstance(val, str):
                    continue

                ages_before = years_old_fingerprint(val)
                text = val

                for rule in rules:
                    text, n = rule.apply(text)
                    if n:
                        counts[(rule.fix, rule.name)] += n
                        rec_changed = True
                        # Idempotency gate: a rule must not match its own output.
                        _, again = rule.apply(text)
                        if again:
                            sys.exit(
                                f"ABORT: rule is NOT idempotent -- "
                                f"[{rule.fix}] {rule.name} still matched its own "
                                f"output in {fname}/{rec.get('slug')}/{key}"
                            )

                if text != val:
                    # Building-age guard.
                    ages_after = years_old_fingerprint(text)
                    if ages_after != ages_before:
                        sys.exit(
                            f"ABORT: a rule altered a 'N years old' building age in "
                            f"{fname}/{rec.get('slug')}/{key}\n"
                            f"  before: {ages_before}\n  after:  {ages_after}"
                        )
                    rec[key] = text

            if rec_changed:
                touched.add(rec.get("slug"))

        assert len(data) == n_before, "record count changed -- aborting"
        links_after = measure_links(data)

        print(f"\n--- {fname}")
        print(f"    records: {n_before} -> {len(data)}  "
              f"({'UNCHANGED' if len(data) == n_before else 'CHANGED!'})")
        print(f"    records edited: {len(touched)}")
        print(f"    internal links: {links_before[0]} "
              f"| missing slash before: {links_before[1]} "
              f"-> after: {links_after[1]} "
              f"| /home-valuation: {links_before[2]}")
        if counts:
            for (fix, name), n in sorted(counts.items()):
                print(f"      [{fix}] {name}: {n}")
        else:
            print("      (no changes)")

        for k, v in counts.items():
            grand[k] += v
        grand_records[fname] = len(touched)

        if not args.dry_run and counts:
            out = _dump(data, cfg)
            with open(path, "wb") as fh:
                fh.write(out)
            # Re-read and confirm it still parses and the count is intact.
            with open(path, "rb") as fh:
                check = json.loads(fh.read())
            assert len(check) == n_before, "post-write record count mismatch"

    print("\n" + "=" * 78)
    print("TOTALS BY RULE")
    print("=" * 78)
    for (fix, name), n in sorted(grand.items()):
        print(f"  [{fix}] {name}: {n}")
    print(f"\n  TOTAL SUBSTITUTIONS: {sum(grand.values())}")
    print(f"  RECORDS EDITED: {dict(grand_records)} "
          f"(total {sum(grand_records.values())})")
    if sum(grand.values()) == 0:
        print("\n  NO CHANGES -- corpora already compliant (idempotent re-run).")


if __name__ == "__main__":
    main()
