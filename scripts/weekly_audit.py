#!/usr/bin/env python3
"""
nowtb.com WEEKLY LEAD AUDIT
===========================

What this does
--------------
Walks the whole repo once a week and reports everything that is quietly
costing leads: pages with no call-to-action, missing metadata, broken internal
links, brand-rule violations, thin or duplicated content, stale years, fake
image URLs, and cities with content holes.

It is DETERMINISTIC and OFFLINE. No API keys, no network, no AI. That means it
costs nothing, can never hallucinate a problem, and is safe to run on a cron
forever. The AI pass that FIXES things runs separately and reads this report.

Outputs two files in the repo root:
  WEEKLY-AUDIT.md    <- human-readable, prioritized. Read this one.
  weekly-audit.json  <- machine-readable, for the automated fix pass.

How to run it by hand
---------------------
    cd ~/Projects/nowtb-next && python3 scripts/weekly_audit.py

Jargon, defined once
--------------------
  finding      One problem found. Has a severity, a file, and a fix.
  template     A React component that renders MANY pages. One bug in a
               template multiplies across every page it renders, which is why
               template findings are ranked above single-page findings.
  shingle      A short run of consecutive words used to compare two documents.
               Two pages sharing most of their shingles are near-duplicates.
  orphan       A page nothing links to. Google mostly can't find these.

If it breaks, check this
------------------------
  * "No such file or directory: src/data/posts-export.json" -> you are not in
    the repo root. cd to the repo first.
  * "MemoryError" -> posts-export.json is ~43MB and loads to a few hundred MB.
    Close other heavy apps, or set SKIP_CONTENT=1 to skip the content corpora.
  * A check crashes -> each check is wrapped, so one failure cannot kill the
    run. The report records which check failed and why. Fix that check, rerun.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass, field, asdict
from datetime import date
from pathlib import Path

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "src"
APP = SRC / "app"
DATA = SRC / "data"
COMPONENTS = SRC / "components"

# Set SKIP_CONTENT=1 to skip the big JSON corpora (fast metadata-only run).
SKIP_CONTENT = os.environ.get("SKIP_CONTENT") == "1"

# Barrett licensed in September 2003. NEVER hardcode the experience number --
# compute it, so this audit keeps telling the truth after every September.
LICENSE_START = date(2003, 9, 1)

# Pages that are intentionally not lead-capture pages. A missing CTA on these
# is correct, not a finding, so we don't cry wolf about them every single week.
NON_LEAD_ROUTES = {
    "privacy-policy", "terms-of-use", "accessibility", "dmca-notice",
    "fair-housing", "thank-you", "login", "auth", "account", "api",
    "not-found", "robots", "sitemap", "clients", "card", "c",
}

# Routes a CTA may legitimately point at. Used to verify a page actually
# pushes the visitor somewhere that captures a lead.
CONVERSION_ROUTES = {
    "/contact", "/free-home-valuation", "/home-valuation", "/sell-your-home",
    "/seller-intake", "/properties", "/open-houses",
}

# Component names that capture a lead when rendered on a page.
LEAD_FORM_COMPONENTS = {
    "ContactForm", "ValuationForm", "SellerIntakeForm", "CommunityInterestForm",
    "TourScheduler", "SearchBar", "HeroSection",
}


def experience_years(today: date | None = None) -> tuple[int, int]:
    """Completed years since licensing, and which year is currently in progress.

    Returns (completed, in_progress). As of Oct 2026 that is (23, 24), so the
    site should say "23+ years" and prose may say "entering his 24th year".
    The "+" must never claim more than the completed count.
    """
    today = today or date.today()
    completed = today.year - LICENSE_START.year
    # Birthday logic: if we haven't reached September yet this year, the most
    # recent anniversary was last year, so one fewer completed year.
    if (today.month, today.day) < (LICENSE_START.month, LICENSE_START.day):
        completed -= 1
    return completed, completed + 1


COMPLETED_YEARS, IN_PROGRESS_YEAR = experience_years()
CORRECT_CLAIM = f"{COMPLETED_YEARS}+ years"
FALSE_CLAIM = f"{IN_PROGRESS_YEAR}+ years"  # e.g. "24+ years" -- false until Sept 2027


# ---------------------------------------------------------------------------
# Finding model
# ---------------------------------------------------------------------------

SEVERITY_WEIGHT = {"critical": 1000, "high": 100, "medium": 10, "low": 1}


@dataclass
class Finding:
    check: str                 # which check produced this
    severity: str              # critical | high | medium | low
    title: str                 # one-line statement of the problem
    fix: str                   # what to actually do about it
    pages_affected: int = 1    # how many live pages this touches
    evidence: list[str] = field(default_factory=list)  # "file:line  <quote>"

    @property
    def score(self) -> int:
        """Rank = how bad x how many pages. This is the whole prioritization."""
        return SEVERITY_WEIGHT.get(self.severity, 1) * max(self.pages_affected, 1)


FINDINGS: list[Finding] = []
CHECK_ERRORS: list[str] = []


def add(check, severity, title, fix, pages_affected=1, evidence=None):
    FINDINGS.append(Finding(check, severity, title, fix, pages_affected, evidence or []))


def run_check(fn):
    """Run one check. A crash in one check must never kill the whole audit."""
    try:
        fn()
    except Exception as exc:  # noqa: BLE001 - we genuinely want every failure
        CHECK_ERRORS.append(f"{fn.__name__}: {type(exc).__name__}: {exc}")


# ---------------------------------------------------------------------------
# File helpers
# ---------------------------------------------------------------------------

def tsx_files() -> list[Path]:
    """Every TypeScript/React source file, excluding build output."""
    out = []
    for p in SRC.rglob("*.ts*"):
        if "node_modules" in p.parts or ".next" in p.parts:
            continue
        out.append(p)
    return out


def page_files() -> list[Path]:
    """Every Next.js App Router page entry point."""
    return sorted(p for p in APP.rglob("page.tsx") if "node_modules" not in p.parts)


def route_for(page: Path) -> str:
    """Turn src/app/foo/bar/page.tsx into the URL path /foo/bar."""
    rel = page.relative_to(APP).parent
    return "/" + "/".join(rel.parts) if rel.parts else "/"


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8", errors="replace")


def lines_matching(text: str, pattern: re.Pattern) -> list[tuple[int, str]]:
    """Every (line number, line) where the pattern hits. 1-indexed."""
    hits = []
    for i, line in enumerate(text.splitlines(), 1):
        if pattern.search(line):
            hits.append((i, line.strip()))
    return hits


def rel(p: Path) -> str:
    try:
        return str(p.relative_to(REPO))
    except ValueError:
        return str(p)


def comment_lines(text: str) -> set[int]:
    """1-indexed line numbers that fall inside a comment.

    Why this exists: a code comment that DOCUMENTS a rule is not a breach of
    it. The fixes on this site are heavily commented on purpose -- they quote
    the exact wrong wording so nobody reintroduces it -- and an earlier version
    of this audit reported those comments as critical defects every run.

    Matching a leading `//` or `*` is not enough, because the formatter wraps
    long block comments onto continuation lines that begin with ordinary prose:

        {/* The year count must never be attached to a place. "23+ years of
            experience across Tampa Bay" claimed 23 years of Tampa Bay    <-- no marker
            tenure -- false. */}

    So track open/closed block state across the whole file instead.
    """
    inside: set[int] = set()
    in_block = False
    for i, line in enumerate(text.splitlines(), 1):
        stripped = line.strip()
        if in_block:
            inside.add(i)
            # A block can close and reopen on the same line; last one wins.
            if "*/" in line:
                in_block = "/*" in line.split("*/")[-1]
            continue
        # Opens a block comment that does not close on this line.
        opens = "/*" in line
        closes_after_open = opens and "*/" in line.split("/*", 1)[1]
        if opens and not closes_after_open:
            inside.add(i)
            in_block = True
            continue
        # Whole-line // comment, or a line that is entirely a one-line block.
        if stripped.startswith("//") or stripped.startswith("*") or (opens and closes_after_open
                                                                     and stripped.startswith(("{/*", "/*"))):
            inside.add(i)
    return inside


def strip_html(html: str) -> str:
    """Crude tag stripper. Good enough for word counts and text comparison."""
    txt = re.sub(r"<script.*?</script>", " ", html, flags=re.S | re.I)
    txt = re.sub(r"<style.*?</style>", " ", txt, flags=re.S | re.I)
    txt = re.sub(r"<[^>]+>", " ", txt)
    txt = re.sub(r"&[a-z]+;|&#\d+;", " ", txt)
    return re.sub(r"\s+", " ", txt).strip()


# ---------------------------------------------------------------------------
# CHECK 1 -- Brand and factual rules
# ---------------------------------------------------------------------------
# These are not style nits. Several are factually FALSE claims (an experience
# number that overstates, a designation Barrett doesn't hold, co-owning a
# business he doesn't co-own). Those get CRITICAL.

def check_brand_rules():
    # Each rule: (label, regex, severity, fix, optional exclusion regex)
    rules = [
        (
            "RE/MAX written with a slash",
            re.compile(r"RE/MAX"),
            "high",
            'Replace with "REMAX". The slash fragments the brand token for search and AI engines.',
            None,
        ),
        (
            '"master suite" instead of "owners suite"',
            re.compile(r"master\s+(suite|bedroom|bath)", re.I),
            "high",
            'Replace with "owners suite" / "owners bath". Standing rule, no exceptions.',
            None,
        ),
        (
            "mobile or manufactured home content",
            re.compile(r"\b(mobile|manufactured)\s+home", re.I),
            "high",
            "Remove. Barrett is explicitly not a mobile/manufactured home specialist.",
            None,
        ),
        (
            '"AC in attic" mentioned',
            re.compile(r"\bA/?C\b[^.]{0,30}\battic\b", re.I),
            "medium",
            "Remove the attic AC mention.",
            None,
        ),
        (
            "CRE designation claimed (Barrett does not hold it)",
            re.compile(r"\bCRE\b(?!\s*=)"),
            "critical",
            "Remove. Real designations are e-PRO, MRP, SRS only. This is a false credential claim.",
            None,
        ),
        (
            "Best Bay Services described as co-run or co-owned",
            re.compile(r"co[- ]?(run|own|founded)[^.]{0,60}Best Bay", re.I),
            "critical",
            "James Evans runs Best Bay Services. Barrett does not co-run it. Remove the claim.",
            None,
        ),
        (
            f'FALSE experience claim "{FALSE_CLAIM}" (not true until Sept {LICENSE_START.year + IN_PROGRESS_YEAR})',
            # Only an experience claim -- "24+ years OLD" is a building age and legitimate.
            re.compile(
                rf"{IN_PROGRESS_YEAR}\+?\s*years?\s+(of\s+real\s+estate\s+experience|experience|in\s+the\s+business)",
                re.I,
            ),
            "critical",
            f'Change to "{CORRECT_CLAIM} of real estate experience". '
            f"CAUTION: do NOT blanket-replace — \"{FALSE_CLAIM} old\" describes building age and is correct.",
            None,
        ),
    ]

    # Comments that document a rule ("never write RE/MAX") are not breaches of
    # it. Skipping them keeps the weekly report trustworthy -- a checker that
    # reports its own documentation as a defect stops being read.
    comment = re.compile(r"^\s*(//|\*|/\*|\{/\*|#)")

    # A line that FORBIDS something is not an instance of it. The AI chat
    # system prompt literally contains "Never mention mobile/manufactured
    # homes" — the rule being enforced, not broken. Same for the style notes
    # scattered through the data files.
    prohibition = re.compile(r"\b(never|do not|don't|avoid|must not|no longer)\b", re.I)

    for label, pattern, severity, fix, exclude in rules:
        evidence, count = [], 0
        for p in tsx_files():
            txt = read(p)
            skip = comment_lines(txt)
            for ln, line in lines_matching(txt, pattern):
                if ln in skip:
                    continue
                if prohibition.search(line):
                    continue
                if exclude and exclude.search(line):
                    continue
                count += 1
                if len(evidence) < 8:
                    evidence.append(f"{rel(p)}:{ln}  {line[:160]}")
        if count:
            add("brand-rules", severity, f"{label} — {count} occurrence(s) in source",
                fix, pages_affected=count, evidence=evidence)


def check_experience_near_location():
    """The rule that gets broken most: the experience number tied to a place.

    "23+ years of real estate experience" is true.
    "23 years of Tampa Bay experience" / "23 years here" is FALSE -- Barrett has
    been in Florida ~11 years. Local tenure must read "over a decade".
    """
    place = r"(Tampa|Florida|local|here|resident|Bay area|this area)"
    pattern = re.compile(
        rf"\b{COMPLETED_YEARS}\+?\s*years?\b[^.!?]{{0,80}}\b{place}\b"
        rf"|\b{place}\b[^.!?]{{0,80}}\b{COMPLETED_YEARS}\+?\s*years?\b",
        re.I,
    )
    # A code comment that DOCUMENTS this rule is not a violation of it. Without
    # this guard the audit flags its own fix notes every week and gets ignored --
    # which is exactly how a noisy checker becomes a useless one.
    comment = re.compile(r"^\s*(//|\*|/\*|\{/\*|#)")

    evidence, count = [], 0
    for p in tsx_files():
        txt = read(p)
        src_lines = txt.splitlines()
        skip = comment_lines(txt)
        for ln, line in lines_matching(txt, pattern):
            if ln in skip:
                continue
            # The safe phrasing "23+ years of real estate experience" is often
            # wrapped across two source lines by the formatter, so look at a
            # small window rather than the single matching line.
            window = " ".join(src_lines[max(ln - 2, 0):ln + 2])
            if re.search(
                rf"{COMPLETED_YEARS}\+?\s*years?\s+of\s+real\s+estate\s+experience", window, re.I
            ):
                continue
            count += 1
            if len(evidence) < 10:
                evidence.append(f"{rel(p)}:{ln}  {line[:200]}")
    if count:
        add("brand-rules", "critical",
            f"Experience number tied to a location — {count} occurrence(s)",
            f'Experience is "{CORRECT_CLAIM} of real estate experience" with NO place attached. '
            'Local tenure is "over a decade" / "longtime local" — never a year count.',
            pages_affected=count, evidence=evidence)


# Barrett's Florida broker license. Confirmed by Barrett, Oct 2026. Two wrong
# numbers (BK3246537 on ~35 pages, BK3010265 on ~20) had been published in the
# content corpora alongside the right one. Publishing a wrong license number on
# a licensed broker's site is a regulatory problem, not a typo, so it gets a
# permanent guard rather than a one-time cleanup.
LICENSE_NUMBER = "BK3313308"


def check_license_number():
    """Exactly one broker license number may appear anywhere on the site."""
    pat = re.compile(r"BK ?#?(\d{7})")
    found = defaultdict(list)

    targets = list(tsx_files())
    for extra in ["public/llms.txt", "public/robots.txt"]:
        p = REPO / extra
        if p.exists():
            targets.append(p)

    for p in targets:
        for ln, line in lines_matching(read(p), pat):
            for m in pat.finditer(line):
                found["BK" + m.group(1)].append(f"{rel(p)}:{ln}")

    wrong = {k: v for k, v in found.items() if k != LICENSE_NUMBER}
    if wrong:
        ev = [f"{num}  ({len(locs)}x)  e.g. {', '.join(locs[:3])}" for num, locs in wrong.items()]
        add("brand-rules", "critical",
            f"{len(wrong)} incorrect broker license number(s) published "
            f"({sum(len(v) for v in wrong.values())} occurrence(s))",
            f"Barrett's license is {LICENSE_NUMBER}. Replace every other number. A wrong license "
            "number on a licensed broker's website is a regulatory exposure, not a cosmetic bug.",
            pages_affected=sum(len(v) for v in wrong.values()), evidence=ev)


def check_experience_rollover():
    """Tell Barrett when the number is due to roll over, before it goes stale."""
    today = date.today()
    next_roll = date(today.year if today.month < 9 else today.year + 1, 9, 1)
    days = (next_roll - today).days
    if days <= 45:
        add("brand-rules", "high",
            f"Experience number rolls over in {days} days ({next_roll.isoformat()})",
            f'On {next_roll.isoformat()} the correct claim becomes '
            f'"{COMPLETED_YEARS + 1}+ years of real estate experience". Bump it site-wide then, '
            "and afterwards re-scan for the number sitting near Tampa/Florida/local/resident.",
            pages_affected=1)


# ---------------------------------------------------------------------------
# CHECK 2 -- Route metadata
# ---------------------------------------------------------------------------

def check_route_metadata():
    missing_meta, missing_canonical, missing_og, bad_title, bad_desc = [], [], [], [], []

    for page in page_files():
        route = route_for(page)
        top = route.strip("/").split("/")[0]
        if top in {"api"}:
            continue
        txt = read(page)

        # A "use client" page CANNOT export metadata -- Next.js treats that as a
        # hard build error. The convention is to put it in a co-located
        # layout.tsx instead, so the metadata for such a route lives in the
        # sibling file. An earlier version of this audit only read page.tsx and
        # reported four routes as having no metadata at all when in fact all of
        # them had proper metadata next door. Read both.
        sibling = page.parent / "layout.tsx"
        meta_txt = txt + ("\n" + read(sibling) if sibling.exists() else "")

        has_static = "export const metadata" in meta_txt
        has_dynamic = "generateMetadata" in meta_txt
        if not (has_static or has_dynamic):
            is_client = txt.lstrip().startswith(('"use client"', "'use client'"))
            note = "  (client component — metadata belongs in a sibling layout.tsx)" if is_client else ""
            missing_meta.append(f"{rel(page)}  (route {route}){note}")
            continue
        if "canonical" not in meta_txt:
            missing_canonical.append(f"{rel(page)}  (route {route})")
        if "openGraph" not in meta_txt:
            missing_og.append(f"{rel(page)}  (route {route})")

        # Length checks on literal titles/descriptions we can actually read.
        for m in re.finditer(r'title:\s*"([^"]{1,300})"', txt):
            t = m.group(1)
            if len(t) > 60 and "{" not in t:
                bad_title.append(f"{rel(page)}  {len(t)} chars: {t[:90]}")
        for m in re.finditer(r'description:\s*"([^"]{1,600})"', txt):
            d = m.group(1)
            if "{" in d:
                continue
            if len(d) < 120 or len(d) > 155:
                bad_desc.append(f"{rel(page)}  {len(d)} chars: {d[:90]}")

    if missing_meta:
        add("metadata", "critical",
            f"{len(missing_meta)} route(s) export NO metadata at all",
            "Add `export const metadata` with title, description, alternates.canonical and openGraph. "
            "Without it the page inherits the layout title template and competes with itself.",
            pages_affected=len(missing_meta), evidence=missing_meta[:20])
    if missing_canonical:
        add("metadata", "high",
            f"{len(missing_canonical)} route(s) missing alternates.canonical",
            "Add `alternates: { canonical: '/the-path' }`. Without a canonical, parameter and "
            "trailing-slash variants split ranking signals across duplicates.",
            pages_affected=len(missing_canonical), evidence=missing_canonical[:20])
    if missing_og:
        add("metadata", "medium",
            f"{len(missing_og)} route(s) missing openGraph",
            "Add openGraph with a 1200x630 image. Shared links without it look broken and get fewer clicks.",
            pages_affected=len(missing_og), evidence=missing_og[:20])
    if bad_title:
        add("metadata", "medium",
            f"{len(bad_title)} literal title(s) over 60 characters",
            "Trim to under 60 chars with the primary keyword FIRST, or Google truncates it mid-phrase.",
            pages_affected=len(bad_title), evidence=bad_title[:15])
    if bad_desc:
        add("metadata", "medium",
            f"{len(bad_desc)} literal description(s) outside the 120-155 character window",
            "Rewrite to 120-155 chars: direct answer first, then a CTA with the phone number.",
            pages_affected=len(bad_desc), evidence=bad_desc[:15])


# ---------------------------------------------------------------------------
# CHECK 3 -- Heading hierarchy
# ---------------------------------------------------------------------------

GENERIC_H1 = re.compile(
    r"^(our services|about us|about|services|get in touch|contact|contact us|home|welcome|"
    r"what we (do|handle)|for (buyers|sellers|property owners)|overview|resources)$", re.I)


def check_headings():
    h1_re = re.compile(r"<h1[\s>]")
    no_h1, multi_h1, generic = [], [], []

    for page in page_files():
        route = route_for(page)
        if route.strip("/").split("/")[0] in {"api"}:
            continue
        txt = read(page)
        n = len(h1_re.findall(txt))
        # A page with no inline h1 may render a component that owns the h1.
        renders_component = re.search(r"<(Hero[A-Za-z]*|[A-Z][A-Za-z]*Page)\b", txt)
        if n == 0 and not renders_component:
            no_h1.append(f"{rel(page)}  (route {route})")
        if n > 1:
            multi_h1.append(f"{rel(page)}  ({n} h1 tags, route {route})")
        for m in re.finditer(r"<h1[^>]*>\s*([^<{][^<]{0,80}?)\s*</h1>", txt):
            if GENERIC_H1.match(m.group(1).strip()):
                generic.append(f"{rel(page)}  h1 = \"{m.group(1).strip()}\"")

    if no_h1:
        add("headings", "high", f"{len(no_h1)} page(s) with no detectable H1",
            "Add exactly one H1 containing the primary keyword. A page with no H1 gives Google "
            "nothing to match the query against.",
            pages_affected=len(no_h1), evidence=no_h1[:20])
    if multi_h1:
        add("headings", "high", f"{len(multi_h1)} page(s) with MORE THAN ONE H1",
            "Keep exactly one H1; demote the rest to H2. Multiple H1s split the topic signal.",
            pages_affected=len(multi_h1), evidence=multi_h1[:20])
    if generic:
        add("headings", "high", f"{len(generic)} generic H1(s) with no keyword",
            'Rewrite keyword-first, e.g. "Our Services" -> "Tampa Bay Real Estate Services". '
            "A generic H1 ranks for nothing.",
            pages_affected=len(generic), evidence=generic[:20])

    # Footer and sidebar headings waste the page's heading hierarchy on labels.
    for comp in [COMPONENTS / "layout" / "Footer.tsx"]:
        if not comp.exists():
            continue
        hits = lines_matching(read(comp), re.compile(r"<h[1-4][\s>]"))
        if hits:
            add("headings", "medium",
                f"Footer uses {len(hits)} heading tag(s) for column labels",
                "Switch footer column headers to <p>. Headings there burn hierarchy on non-content "
                "and appear on every page of the site.",
                pages_affected=3400,
                evidence=[f"{rel(comp)}:{ln}  {line[:120]}" for ln, line in hits[:8]])


# ---------------------------------------------------------------------------
# CHECK 4 -- CTA and lead capture coverage
# ---------------------------------------------------------------------------

def check_cta_coverage():
    """A page with traffic and no CTA is the most expensive bug on the site."""
    no_form, no_phone, no_conversion_link = [], [], []

    for page in page_files():
        route = route_for(page)
        top = route.strip("/").split("/")[0]
        if top in NON_LEAD_ROUTES or top.startswith("["):
            # Dynamic templates are audited separately below (they render many
            # pages, so they get their own, louder finding).
            if not top.startswith("["):
                continue
        txt = read(page)

        if not any(c in txt for c in LEAD_FORM_COMPONENTS):
            no_form.append(f"{rel(page)}  (route {route})")
        if "tel:" not in txt:
            no_phone.append(f"{rel(page)}  (route {route})")
        if not any(c in txt for c in CONVERSION_ROUTES):
            no_conversion_link.append(f"{rel(page)}  (route {route})")

    if no_form:
        add("conversion", "critical", f"{len(no_form)} lead-eligible page(s) render NO lead form",
            "Add a compact 3-field form (name / phone / email) or at minimum a prominent CTA block "
            "linking to /free-home-valuation or /contact. Traffic with no capture is wasted spend.",
            pages_affected=len(no_form), evidence=no_form[:25])
    if no_phone:
        add("conversion", "critical", f"{len(no_phone)} page(s) with no clickable tel: link",
            'Add <a href="tel:8137337907">(813) 733-7907</a> visible on mobile. '
            "Real estate converts by phone; a page without a tappable number loses the call.",
            pages_affected=len(no_phone), evidence=no_phone[:25])
    if no_conversion_link:
        add("conversion", "high", f"{len(no_conversion_link)} page(s) link to no conversion page",
            "Add a contextual link to /free-home-valuation, /sell-your-home or /contact in the body.",
            pages_affected=len(no_conversion_link), evidence=no_conversion_link[:25])

    # Phone hidden on mobile is an explicit rule violation, so call it out loud.
    hidden_phone = []
    for p in tsx_files():
        for ln, line in lines_matching(read(p), re.compile(r"tel:")):
            if re.search(r"hidden\s+(sm|md|lg):(block|flex|inline)", line):
                hidden_phone.append(f"{rel(p)}:{ln}  {line[:160]}")
    if hidden_phone:
        add("conversion", "critical",
            f"Phone number hidden on mobile in {len(hidden_phone)} place(s)",
            "Remove the `hidden md:block` wrapper. The phone must be visible on mobile — most "
            "real estate traffic is mobile and the call is the lead.",
            pages_affected=len(hidden_phone), evidence=hidden_phone[:10])


def check_zindex_conflicts():
    """Overlapping fixed overlays can physically cover the CTA on mobile."""
    layers = defaultdict(list)
    pat = re.compile(r"z-\[?(\d{3,5})\]?")
    for p in tsx_files():
        txt = read(p)
        if not re.search(r"\bfixed\b", txt):
            continue
        for ln, line in lines_matching(txt, pat):
            for m in pat.finditer(line):
                layers[m.group(1)].append(f"{rel(p)}:{ln}")
    collisions = {z: locs for z, locs in layers.items() if len({l.split(':')[0] for l in locs}) > 1}
    if collisions:
        ev = []
        for z, locs in sorted(collisions.items(), key=lambda kv: -int(kv[0]))[:8]:
            ev.append(f"z-{z} shared by: " + ", ".join(sorted({l.split(':')[0] for l in locs})[:6]))
        add("conversion", "high",
            f"{len(collisions)} z-index value(s) shared by different fixed overlays",
            "Assign a single explicit stacking order (cookie banner < chat < mobile bar < modal). "
            "Equal z-index on fixed elements means paint order decides, and an overlay can sit on "
            "top of the mobile call button.",
            pages_affected=3400, evidence=ev)


# ---------------------------------------------------------------------------
# CHECK 5 -- Internal links
# ---------------------------------------------------------------------------

def known_routes() -> set[str]:
    """Every static route the app can serve, as a set of URL paths."""
    routes = set()
    for page in page_files():
        r = route_for(page)
        if "[" in r:
            continue
        routes.add(r.rstrip("/") or "/")
    return routes


def check_internal_links():
    static = known_routes()
    # Single-segment slugs are handled by the [citySlug] catch-all, so an
    # unknown one-segment path is not necessarily broken. Two-plus segments
    # that match no route are the real risk.
    href_pat = re.compile(r'href=(["\'])(/[^"\'\s>#?]*)\1')
    bad = Counter()
    where = defaultdict(list)

    for p in tsx_files():
        txt = read(p)
        for ln, line in lines_matching(txt, href_pat):
            for m in href_pat.finditer(line):
                url = m.group(2).rstrip("/") or "/"
                segs = [s for s in url.split("/") if s]
                if len(segs) >= 2 and url not in static:
                    # Could still be a dynamic route like /blog/<slug>. Only
                    # flag when the first segment is not a known dynamic parent.
                    parent = "/" + segs[0]
                    dynamic_parent = (APP / segs[0]).exists()
                    if not dynamic_parent and parent not in static:
                        bad[url] += 1
                        if len(where[url]) < 3:
                            where[url].append(f"{rel(p)}:{ln}")

    if bad:
        ev = [f"{u}  ({n}x)  e.g. {', '.join(where[u])}" for u, n in bad.most_common(25)]
        add("internal-links", "high",
            f"{len(bad)} distinct internal link target(s) resolve to no route ({sum(bad.values())} links total)",
            "Fix or remove. Every one is a dead end that wastes crawl budget and drops a visitor "
            "who was trying to go deeper. Cross-check against the :city flatten redirects in "
            "next.config.mjs — a nested route can 404 on the live domain only.",
            pages_affected=sum(bad.values()), evidence=ev)

    # Non-descriptive anchor text throws away the keyword signal of every link.
    weak = re.compile(r">\s*(click here|here|read more|learn more|this page|link|more)\s*<", re.I)
    hits = []
    for p in tsx_files():
        for ln, line in lines_matching(read(p), weak):
            hits.append(f"{rel(p)}:{ln}  {line[:140]}")
    if hits:
        add("internal-links", "medium",
            f'{len(hits)} link(s) using non-descriptive anchor text ("click here", "read more")',
            'Replace with keyword anchors: "Valrico home values" instead of "click here". '
            "Anchor text is one of the few on-page signals you fully control.",
            pages_affected=len(hits), evidence=hits[:15])


# ---------------------------------------------------------------------------
# CHECK 6 -- Schema / structured data
# ---------------------------------------------------------------------------

def check_schema():
    no_breadcrumb = []
    for page in page_files():
        route = route_for(page)
        top = route.strip("/").split("/")[0]
        if route == "/" or top in {"api", "auth", "login", "account", "clients", "c"}:
            continue
        txt = read(page)
        if "breadcrumb" not in txt.lower() and "Breadcrumb" not in txt:
            # The page may delegate to a shared template that adds it.
            if not re.search(r"<[A-Z][A-Za-z]*Page\b", txt):
                no_breadcrumb.append(f"{rel(page)}  (route {route})")
    if no_breadcrumb:
        add("schema", "high",
            f"{len(no_breadcrumb)} page(s) with no BreadcrumbList schema",
            "Add breadcrumbSchema() from src/lib/schema.tsx. Breadcrumbs are what produce the "
            "path display in search results instead of a raw URL, which lifts click-through.",
            pages_affected=len(no_breadcrumb), evidence=no_breadcrumb[:25])

    # FAQ schema is the single highest-leverage structured data for AI answers.
    faq_visible, faq_schema_used = set(), set()
    for page in page_files():
        txt = read(page)
        if "FaqSection" in txt or re.search(r"\bfaqs?\b\s*[:=]", txt, re.I):
            faq_visible.add(rel(page))
        if "faqSchema" in txt:
            faq_schema_used.add(rel(page))
    missing = sorted(faq_visible - faq_schema_used)
    if missing:
        add("schema", "high",
            f"{len(missing)} page(s) show FAQ content but emit no FAQPage schema",
            "Wrap the same questions in faqSchema(). Visible FAQs without the schema are invisible "
            "to AI answer engines and to the FAQ rich result.",
            pages_affected=len(missing), evidence=missing[:25])


# ---------------------------------------------------------------------------
# CHECK 7 -- Crawl plumbing
# ---------------------------------------------------------------------------

def check_crawl_plumbing():
    sitemap = APP / "sitemap.ts"
    if sitemap.exists():
        txt = read(sitemap)
        # Next.js caches sitemap.ts at build time by default. Without an
        # explicit revalidate the sitemap FREEZES and new pages never appear.
        if "export const revalidate" not in txt and "dynamic" not in txt:
            add("crawl", "critical",
                "sitemap.ts has no revalidate or dynamic export — it is frozen at build time",
                "Add `export const revalidate = 3600;` to src/app/sitemap.ts. Next.js statically "
                "caches sitemap.ts by default, so every page added after the last build is missing "
                "from the sitemap Google actually fetches.",
                pages_affected=3400, evidence=[f"{rel(sitemap)}"])

    robots = APP / "robots.ts"
    if robots.exists():
        txt = read(robots)
        want_allow = ["GPTBot", "ClaudeBot", "PerplexityBot", "Applebot-Extended",
                      "GoogleOther", "Google-Extended", "ChatGPT-User", "anthropic-ai", "cohere-ai"]
        want_block = ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot"]
        missing_allow = [b for b in want_allow if b not in txt]
        missing_block = [b for b in want_block if b not in txt]
        if missing_allow:
            add("crawl", "high",
                f"{len(missing_allow)} AI crawler(s) not explicitly allowed in robots.ts",
                "Add explicit Allow rules for: " + ", ".join(missing_allow) +
                ". These are the crawlers that feed AI answers — being absent from their index "
                "means being absent from the answer.",
                pages_affected=3400, evidence=[rel(robots)])
        if missing_block:
            add("crawl", "low",
                f"{len(missing_block)} scraper bot(s) not blocked in robots.ts",
                "Block: " + ", ".join(missing_block) + ". They consume crawl budget and feed competitors.",
                pages_affected=1, evidence=[rel(robots)])

    # A route file silently shadows a public/ file of the same name.
    pub, route = REPO / "public" / "llms.txt", APP / "llms.txt" / "route.ts"
    if pub.exists() and route.exists():
        add("crawl", "high",
            "Both public/llms.txt and app/llms.txt/route.ts exist — the route wins, the file is dead",
            "Delete whichever is stale and keep one source of truth. Right now edits to "
            "public/llms.txt have no effect on what is served, which makes it silently rot.",
            pages_affected=1, evidence=[rel(pub), rel(route)])
    elif not pub.exists() and not route.exists():
        add("crawl", "high", "No llms.txt is served at all",
            "Create public/llms.txt with purpose, Barrett's credentials, content areas, contact, "
            "and key URLs. It is how AI engines learn who the authority behind the site is.",
            pages_affected=1)


def check_image_hygiene():
    raw_img, no_alt = [], []
    for p in tsx_files():
        txt = read(p)
        for ln, line in lines_matching(txt, re.compile(r"<img\s")):
            raw_img.append(f"{rel(p)}:{ln}  {line[:130]}")
        for ln, line in lines_matching(txt, re.compile(r"<(Image|img)\s")):
            if "alt=" not in line and not line.rstrip().endswith(("{", "(")):
                no_alt.append(f"{rel(p)}:{ln}  {line[:130]}")
    if raw_img:
        add("performance", "medium",
            f"{len(raw_img)} raw <img> tag(s) instead of next/image",
            "Swap to next/image for automatic AVIF/WebP, sizing and lazy loading. Raw <img> hurts "
            "Largest Contentful Paint, which is a ranking factor.",
            pages_affected=len(raw_img), evidence=raw_img[:15])
    if no_alt:
        add("performance", "medium", f"{len(no_alt)} image(s) with no alt attribute",
            "Add descriptive alt text using the target keyword naturally. Also an accessibility requirement.",
            pages_affected=len(no_alt), evidence=no_alt[:15])

    css = APP / "globals.css"
    if css.exists() and re.search(r"\*\s*\{[^}]*max-width:\s*100%", read(css)):
        add("performance", "critical",
            "globals.css has a universal `* { max-width: 100% }` rule",
            "Remove it. It overrides every Tailwind max-w-* class and silently breaks layout width "
            "across the entire site.",
            pages_affected=3400, evidence=[rel(css)])


# ---------------------------------------------------------------------------
# CHECK 8 -- Content corpora: thin, duplicated, stale, broken images
# ---------------------------------------------------------------------------

_CORPUS_CACHE: dict[str, list] = {}


def load_corpus(name: str):
    """Load and MEMOIZE a content corpus.

    posts-export.json is ~43MB and pages-content.json ~26MB. More than one
    check needs them, and re-parsing on each call roughly doubled the runtime
    for no reason. Nothing mutates the returned list, so sharing it is safe.
    """
    if name in _CORPUS_CACHE:
        return _CORPUS_CACHE[name]
    path = DATA / name
    if not path.exists():
        _CORPUS_CACHE[name] = []
        return []
    with path.open(encoding="utf-8", errors="replace") as fh:
        data = json.load(fh)
    items = data if isinstance(data, list) else list(data.values())
    _CORPUS_CACHE[name] = items
    return items


def shingles(text: str, k: int = 5) -> set[int]:
    """Hash every run of k consecutive words. Used for similarity."""
    words = text.lower().split()
    return {
        int.from_bytes(hashlib.blake2b(" ".join(words[i:i + k]).encode(), digest_size=8).digest(), "big")
        for i in range(max(len(words) - k + 1, 0))
    }


def check_content_quality():
    if SKIP_CONTENT:
        return
    corpora = {
        "posts-export.json": load_corpus("posts-export.json"),
        "pages-content.json": load_corpus("pages-content.json"),
        "guides-content.json": load_corpus("guides-content.json"),
    }

    for name, items in corpora.items():
        if not items:
            continue
        texts, thin, slugs = {}, [], []
        for it in items:
            if not isinstance(it, dict):
                continue
            slug = str(it.get("slug") or it.get("id") or "")
            body = strip_html(str(it.get("content") or it.get("body") or it.get("html") or ""))
            wc = len(body.split())
            texts[slug] = body
            slugs.append(slug)
            if wc < 500:
                thin.append((slug, wc))

        if thin:
            thin.sort(key=lambda t: t[1])
            add("content", "high",
                f"{name}: {len(thin)} item(s) under 500 words",
                "Enrich with location-specific verified facts — named subdivisions, real median "
                "prices, named schools, specific builders. Adding generic words does nothing; "
                "adding facts unique to that location is what makes a page rank and convert.",
                pages_affected=len(thin),
                evidence=[f"{s}  ({w} words)" for s, w in thin[:25]])

        # Near-duplicate detection. Sample when the corpus is large so the
        # weekly run stays fast; report that it was a sample.
        keys = [s for s in slugs if len(texts.get(s, "").split()) > 120]
        sample = keys[:600]
        sigs = {s: shingles(texts[s]) for s in sample}
        dup_pairs = []
        sample_list = list(sigs.items())
        for i in range(len(sample_list)):
            s1, g1 = sample_list[i]
            if not g1:
                continue
            for j in range(i + 1, len(sample_list)):
                s2, g2 = sample_list[j]
                if not g2:
                    continue
                inter = len(g1 & g2)
                if not inter:
                    continue
                jac = inter / len(g1 | g2)
                if jac >= 0.80:
                    dup_pairs.append((round(jac, 3), s1, s2))
        if dup_pairs:
            dup_pairs.sort(reverse=True)
            note = f" (checked the first {len(sample)} of {len(keys)} items)" if len(keys) > len(sample) else ""
            add("content", "critical",
                f"{name}: {len(dup_pairs)} page pair(s) are 80%+ textually identical{note}",
                "These are template-swap clones. Google has no reason to prefer one over the other "
                "and AI engines find nothing specific enough to cite, so none of them rank. Rewrite "
                "with per-location verified facts. Word count is not the problem — sameness is.",
                pages_affected=len({s for _, a, b in dup_pairs for s in (a, b)}),
                evidence=[f"{int(j*100)}% identical:  {a}  <->  {b}" for j, a, b in dup_pairs[:20]])

    # Stale year references read as abandoned to both users and crawlers.
    this_year = date.today().year
    stale_pat = re.compile(
        rf"\b(as of|in|for|during|through|updated)\s+(20(1\d|2[0-5]))\b"
        rf"|\b(20(1\d|2[0-5]))\s+(market|forecast|outlook|rates|trends)\b", re.I)
    stale = Counter()
    for name, items in corpora.items():
        for it in items:
            if not isinstance(it, dict):
                continue
            body = str(it.get("content") or "")
            for m in stale_pat.finditer(body):
                stale[m.group(0).strip().lower()] += 1
    if stale:
        add("content", "high",
            f"Stale year references: {sum(stale.values())} occurrence(s) across the content corpora "
            f"(current year is {this_year})",
            f"Sweep and update to {this_year}. A page that says \"as of 2025\" signals abandonment, "
            "and for market/rate content it is also simply wrong.",
            pages_affected=sum(stale.values()),
            evidence=[f'"{k}"  x{v}' for k, v in stale.most_common(20)])

    # Fabricated Unsplash URLs. A real one is photo-{13 digits}-{12 hex}.
    valid = re.compile(r"photo-\d{13}-[0-9a-f]{12}")
    any_unsplash = re.compile(r"images\.unsplash\.com/[^\s\"'<>)]+")
    bad_urls, total = set(), set()
    for name, items in corpora.items():
        for it in items:
            if not isinstance(it, dict):
                continue
            for m in any_unsplash.finditer(str(it.get("content") or "")):
                url = m.group(0)
                total.add(url)
                if not valid.search(url):
                    bad_urls.add(url)
    if bad_urls:
        add("content", "critical",
            f"{len(bad_urls)} of {len(total)} Unsplash image URLs are malformed and will not load",
            "A valid Unsplash CDN path matches photo-{13 digits}-{12 hex}. These were invented by a "
            "generator rather than fetched, so each one renders as a broken image. Replace with real "
            "photo IDs or local assets.",
            pages_affected=len(bad_urls), evidence=sorted(bad_urls)[:20])

    # Body-content <h1> tags. Every template renders the page title as its own
    # <h1>, so an <h1> inside the stored body HTML means that page ships TWO —
    # which splits the topic signal and makes Google pick one. 265 migrated
    # blog posts had this (a WordPress leftover, where the body WAS the page).
    # The blog template now demotes them at render time; this check watches for
    # the content automation reintroducing them in a corpus with no such guard.
    h1_pat = re.compile(r"<h1[\s>]", re.I)
    body_h1 = Counter()
    body_h1_examples = defaultdict(list)
    for name, items in corpora.items():
        for it in items:
            if not isinstance(it, dict):
                continue
            if h1_pat.search(str(it.get("content") or "")):
                body_h1[name] += 1
                if len(body_h1_examples[name]) < 5:
                    body_h1_examples[name].append(str(it.get("slug", "?")))
    # posts-export is handled by the blog template's demotion, so only warn for
    # the corpora where nothing strips them.
    unguarded = {k: v for k, v in body_h1.items() if k != "posts-export.json"}
    if unguarded:
        add("content", "high",
            f"{sum(unguarded.values())} page(s) have an <h1> inside their body content",
            "Demote these to <h2>. The template already supplies the page's single <h1>, so a "
            "second one inside the body competes with it. Either fix the stored content or add a "
            "render-time demotion to that template, the way src/app/blog/[slug]/page.tsx does.",
            pages_affected=sum(unguarded.values()),
            evidence=[f"{k}: {v} pages, e.g. {', '.join(body_h1_examples[k])}"
                      for k, v in unguarded.items()])

    # Placeholder copy that was never finished.
    placeholder = re.compile(r"\b(coming soon|lorem ipsum|TBD|TODO|FIXME|placeholder)\b", re.I)
    ph = Counter()
    for name, items in corpora.items():
        for it in items:
            if not isinstance(it, dict):
                continue
            if placeholder.search(str(it.get("content") or "")):
                ph[name] += 1
    if ph:
        add("content", "high",
            f"{sum(ph.values())} page(s) contain placeholder text",
            'Either build the section or delete the reference. "Coming soon" on a live page costs '
            "trust at exactly the moment someone was deciding whether to call.",
            pages_affected=sum(ph.values()),
            evidence=[f"{k}: {v} pages" for k, v in ph.items()])


# ---------------------------------------------------------------------------
# CHECK 9 -- City coverage holes
# ---------------------------------------------------------------------------

def city_slugs() -> list[str]:
    """The real city slugs, and only those.

    Counting every `slug:` in cities.ts is WRONG -- SPOKE_TOPICS entries in the
    same file also have a `slug:` key, which inflated an earlier version of this
    audit from the true 93 cities to 117. A city object is the one that also
    carries a `county:` field, so anchor on that instead.
    """
    cities_ts = DATA / "cities.ts"
    if not cities_ts.exists():
        return []
    txt = read(cities_ts)
    # Match each city object body and pull the slug that sits beside a county.
    out = []
    for block in re.finditer(r"\{[^{}]*?county:\s*\"[^\"]+\"[^{}]*?\}", txt, re.S):
        m = re.search(r'slug:\s*"([a-z0-9-]+)"', block.group(0))
        if m:
            out.append(m.group(1))
    return out


def check_city_coverage():
    cities_ts = DATA / "cities.ts"
    if not cities_ts.exists():
        return
    txt = read(cities_ts)
    city_slugs_list = city_slugs()

    # Which cities have hand-written neighborhood descriptions and FAQs? A city
    # with neither renders the generic template and reads like every other city.
    nd = read(DATA / "neighborhood-descriptions.ts") if (DATA / "neighborhood-descriptions.ts").exists() else ""
    # City FAQs are spread across many batch files that get merged into
    # CITY_FAQS in valrico-faqs.ts. Glob them ALL rather than naming a few --
    # a hardcoded list silently under-reports coverage every time a new batch
    # file is added, which is how this check once claimed 35 cities were
    # missing FAQs when the true number was 17.
    faq_sources = sorted(DATA.glob("*faqs*.ts")) + [DATA / "brandon-content.ts"]
    faq_keys: set[str] = set()
    for f in faq_sources:
        if not f.exists():
            continue
        # A city's FAQ block is a top-level key in a Record<string, CityFAQ[]>.
        for m in re.finditer(r'^\s{2}"?([a-z0-9][a-z0-9-]{2,})"?:\s*\[', read(f), re.M):
            faq_keys.add(m.group(1))

    priority = ["valrico", "brandon", "riverview", "tampa"]
    missing_desc = [c for c in set(city_slugs_list) if c not in nd]
    missing_faq = sorted(set(city_slugs_list) - faq_keys)

    if missing_desc:
        pri = [c for c in missing_desc if c in priority]
        add("coverage", "high",
            f"{len(missing_desc)} city/ies have no hand-written neighborhood descriptions",
            "Add real per-neighborhood detail (named subdivisions, build years, HOA/CDD facts, "
            "price bands). This is the single biggest differentiator between a city page that ranks "
            "and one that reads like a template."
            + (f" PRIORITY: {', '.join(pri)} are core markets and must come first." if pri else ""),
            pages_affected=len(missing_desc), evidence=sorted(missing_desc)[:30])
    if missing_faq:
        pri = [c for c in missing_faq if c in priority]
        add("coverage", "high",
            f"{len(missing_faq)} city/ies have no custom FAQs",
            "Add 5+ city-specific FAQs with FAQPage schema. FAQs are the format AI answer engines "
            "quote most readily, and they capture long-tail questions nothing else on the site answers."
            + (f" PRIORITY: {', '.join(pri)}." if pri else ""),
            pages_affected=len(missing_faq), evidence=sorted(missing_faq)[:30])


# ---------------------------------------------------------------------------
# CHECK 10 -- Regression guards for bugs we have actually been bitten by
# ---------------------------------------------------------------------------
# Everything below exists because it really happened on this site. Each one is
# cheap to check and was expensive to miss.

# The searches that actually produce a commission, and a keyword that proves a
# page exists for each. A live competitive audit (Oct 2026) ran 14 money queries:
# nowtb.com appeared for 5, never above position 9, and for ALL SIX
# seller-intent queries it did not appear at all -- because the sitemap
# contained zero URLs matching sell-my-house, cost-to-sell, commission or
# home-worth. The pages simply did not exist and cash-buyer sites owned the
# searches. Seller leads are the highest-value lead type for a listing agent,
# so this check exists to make sure that gap never silently reopens.
MONEY_QUERY_COVERAGE = {
    "cost to sell a house": ["cost-to-sell", "cost-of-selling", "seller-closing-cost"],
    "what is my house worth": ["house-worth", "home-worth", "home-value", "what-is-my-home-worth"],
    "realtor commission": ["commission"],
    "sell my house fast": ["sell-my-house-fast", "sell-house-fast", "sell-home-fast"],
    "how long to sell a house": ["how-long-does-it-take-to-sell", "days-on-market", "how-long-to-sell"],
    "listing agent": ["listing-agent"],
    "fsbo vs realtor": ["fsbo"],
    "closing costs": ["closing-cost"],
}


def check_money_query_coverage():
    """Does a page exist for each search that actually generates a commission?"""
    # Needs the content slugs to answer honestly. In SKIP_CONTENT mode we can
    # only see routes, so a blog post covering the topic looks missing and the
    # count comes out inflated. Better to stay silent than to report a number
    # we know is wrong.
    if SKIP_CONTENT:
        return

    # Everything the site can serve: real routes plus every content slug.
    haystack: set[str] = set()
    for page in page_files():
        haystack.add(route_for(page).strip("/").lower())
    if not SKIP_CONTENT:
        for name in ["posts-export.json", "pages-content.json", "guides-content.json"]:
            for it in load_corpus(name):
                if isinstance(it, dict) and it.get("slug"):
                    haystack.add(str(it["slug"]).lower())
    blob = " ".join(haystack)

    missing = [q for q, kws in MONEY_QUERY_COVERAGE.items()
               if not any(kw in blob for kw in kws)]
    if missing:
        add("coverage", "critical",
            f"{len(missing)} high-intent money quer(ies) have NO page at all",
            "Build a page for each. These are the searches that end in a signed listing "
            "agreement, and with no page the site cannot rank for them at any price. Lead with a "
            "direct numeric answer, include a cost-breakdown or comparison TABLE (answer engines "
            "extract tables), cite the statute or data source, and be county-specific — a "
            "competitor outranks a more thorough statewide page simply by saying "
            '"Hillsborough" when the searcher did. Missing: ' + "; ".join(missing),
            pages_affected=len(missing) * 50, evidence=sorted(missing))


def check_trailing_slashes():
    """With `trailingSlash: true`, a slash-less internal link is a guaranteed 308.

    Real case: the footer alone had 36 slash-less hrefs. The footer renders on
    every page, so that was ~239,652 needless redirects sitewide, and 310,308
    across the whole site. Each one is a wasted crawl, a slower click for a real
    visitor, and a little leaked ranking signal -- for a missing character.
    """
    cfg = REPO / "next.config.mjs"
    if not cfg.exists() or "trailingSlash: true" not in read(cfg):
        return  # convention not in force; a slash-less link is correct here

    # Internal path links only. Skip anchors, query strings, files with an
    # extension, and anything built from a template expression.
    href_pat = re.compile(r'href=(["\'])(/[a-z0-9][^"\'\s>]*)\1')
    offenders = defaultdict(int)
    examples = defaultdict(list)

    for p in tsx_files():
        txt = read(p)
        skip = comment_lines(txt)
        for ln, line in lines_matching(txt, href_pat):
            if ln in skip:
                continue
            for m in href_pat.finditer(line):
                url = m.group(2)
                if url.endswith("/") or "#" in url or "?" in url or "${" in url:
                    continue
                if re.search(r"\.[a-z0-9]{2,4}$", url):  # /file.pdf etc
                    continue
                offenders[rel(p)] += 1
                if len(examples[rel(p)]) < 2:
                    examples[rel(p)].append(f"{url}  (line {ln})")

    # The bigger volume lives in the CONTENT corpora, not the components -- the
    # migrated article HTML is full of hand-written links. Checking only .tsx
    # files reported zero while ~1,900 slash-less links sat in the content.
    if not SKIP_CONTENT:
        for name in ["posts-export.json", "pages-content.json",
                     "market-updates-export.json", "guides-content.json"]:
            for it in load_corpus(name):
                if not isinstance(it, dict):
                    continue
                for m in href_pat.finditer(str(it.get("content") or "")):
                    url = m.group(2)
                    if url.endswith("/") or "#" in url or "?" in url or "${" in url:
                        continue
                    if re.search(r"\.[a-z0-9]{2,4}$", url):
                        continue
                    key = f"src/data/{name}"
                    offenders[key] += 1
                    if len(examples[key]) < 3:
                        examples[key].append(f"{url}  (in {it.get('slug', '?')})")

    total = sum(offenders.values())
    if total:
        ev = [f"{f}  ({n} link(s))  e.g. {'; '.join(examples[f])}"
              for f, n in sorted(offenders.items(), key=lambda kv: -kv[1])[:20]]
        add("internal-links", "high",
            f"{total} internal link(s) missing a trailing slash across {len(offenders)} file(s)",
            "Add the trailing slash. next.config.mjs sets `trailingSlash: true`, so every one of "
            "these 308-redirects on every single hit. Links in a shared component multiply by the "
            "number of pages that render it, which is how the footer alone reached ~240,000 "
            "redirects.",
            pages_affected=total, evidence=ev)


def check_exit_intent_scope():
    """The exit-intent popup must stay OFF everywhere.

    Barrett asked for this off repeatedly. On 2026-10-18 he accepted a narrowed
    compromise (seller pages only); on 2026-10-20 he asked for it off entirely,
    himself, in conversation. OFF is the current and final answer.

    This check exists because the setting was flipped FOUR times on production
    inside one hour by different automated passes, each confident it knew
    better, and one of them invented a quote from Barrett to justify the flip.

    A conversion audit will always argue for a popup. That is not a new
    decision. Only Barrett saying so directly changes this; until then a flip
    back ON is a defect, not an improvement.
    """
    layout = APP / "layout.tsx"
    if not layout.exists():
        return

    lt = read(layout)
    skip = comment_lines(lt)

    rendered = any(
        "ClientExitIntent" in line and "<" in line and ln not in skip
        for ln, line in lines_matching(lt, re.compile(r"ClientExitIntent"))
    )

    if rendered:
        add("conversion", "critical",
            "Exit-intent popup was switched back ON — Barrett turned it off on 2026-10-20",
            "Comment out the <ClientExitIntent /> render (and its import) in src/app/layout.tsx. "
            "This has been flipped repeatedly by automated passes; OFF is a settled decision, "
            "not an open question. Do not re-enable it at any scope, including seller pages, "
            "without Barrett saying so directly by name in the current conversation.",
            pages_affected=3400,
            evidence=[f"{rel(layout)}  rendered={rendered}"])


def check_no_dashes_in_copy():
    """Em and en dashes must not appear in client-facing copy.

    Barrett does not use them. In October 2026 there were 12,000+ across the
    site and a sweep removed them. This check exists so they do not grow back,
    because the content generators had been emitting them nightly.

    TWO ENCODINGS. A literal em dash and "&mdash;" render identically, and an
    earlier pass missed 1,700 of them by grepping only for the literal
    character. Both forms are checked here.

    Scoped to content, not code: a dash in a source COMMENT is never published,
    so src/*.ts and src/*.tsx are only checked inside quoted strings and JSX
    text, and .bak files are skipped entirely.
    """
    literal = re.compile(r"[\u2013\u2014]")
    entity = re.compile(r"&mdash;|&ndash;|&#8212;|&#8211;|&#x201[34];", re.I)

    offenders = []
    for path in sorted(DATA.glob("*.json")):
        if path.name.endswith(".bak") or ".bak." in path.name:
            continue
        t = read(path)
        n = len(literal.findall(t)) + len(entity.findall(t))
        if n:
            offenders.append((rel(path), n))

    for path in list(APP.rglob("*.tsx")) + list(APP.rglob("*.ts")) + \
                list(COMPONENTS.rglob("*.tsx")) + list(COMPONENTS.rglob("*.ts")):
        t = read(path)
        skip = comment_lines(t)
        n = 0
        for ln, line in lines_matching(t, literal):
            if ln not in skip:
                n += 1
        for ln, line in lines_matching(t, entity):
            if ln not in skip:
                n += 1
        if n:
            offenders.append((rel(path), n))

    if offenders:
        total = sum(n for _, n in offenders)
        add("content", "high",
            f"Em or en dashes reintroduced in client-facing copy ({total} across {len(offenders)} files)",
            "Barrett does not use em or en dashes. Replace with a comma, or the word "
            '"to" for ranges ("2 to 4 PM"). Check BOTH the literal character and the '
            "&mdash; entity form: they render the same and an earlier sweep missed "
            "1,700 entity-encoded ones. Whichever generator wrote these needs the same fix.",
            pages_affected=total,
            evidence=[f"{f}  {n}" for f, n in sorted(offenders, key=lambda x: -x[1])[:12]])


def check_root_layout_canonical():
    """The root layout must never declare a canonical URL.

    Real case: src/app/layout.tsx declared `canonical: "https://nowtb.com/"`.
    Every page that did not set its own canonical inherited it and therefore
    told Google "the real version of me is the homepage" -- the strongest
    possible instruction to drop that page from the index. 404s were the worst
    case: not-found.tsx set no metadata, so every missing URL on the site
    declared itself to be the homepage.
    """
    layout = APP / "layout.tsx"
    if not layout.exists():
        return
    txt = read(layout)
    skip = comment_lines(txt)
    for ln, line in lines_matching(txt, re.compile(r"canonical\s*:")):
        if ln in skip:
            continue
        add("metadata", "critical",
            "Root layout declares a canonical URL — every page without its own inherits it",
            "Remove `alternates.canonical` from src/app/layout.tsx. A canonical belongs on the "
            "individual page, never in the shared root layout. Inherited this way it tells Google "
            "that every page lacking its own canonical is really the homepage.",
            pages_affected=3400, evidence=[f"{rel(layout)}:{ln}  {line[:120]}"])
        return


def check_missing_assets():
    """Every referenced local asset must exist on disk.

    Real case: src/lib/schema.tsx pointed Barrett's Person/author image at
    `barrett-henry-headshot.jpg`, which has never existed -- the real file is
    `barrett-headshot.png`. It was referenced from the site-wide schema, so the
    most important entity signal on the site pointed at a 404 for months. A
    broken asset path is invisible in code review and obvious to a crawler.
    """
    public = REPO / "public"
    if not public.exists():
        return
    ref_pat = re.compile(r'["\'](/(?:images|fonts|assets)/[^"\'\s)]+)["\']')
    missing = defaultdict(list)
    for p in tsx_files():
        for ln, line in lines_matching(read(p), ref_pat):
            for m in ref_pat.finditer(line):
                url = m.group(1)
                # Skip anything built from a template expression -- we cannot
                # resolve those statically and a false alarm every week is noise.
                if "${" in url or "{" in url:
                    continue
                if not (public / url.lstrip("/")).exists():
                    missing[url].append(f"{rel(p)}:{ln}")
    if missing:
        ev = [f"{u}  referenced from: {', '.join(locs[:3])}" for u, locs in sorted(missing.items())]
        add("assets", "critical",
            f"{len(missing)} referenced asset path(s) do not exist in public/",
            "Fix the paths or add the files. Define shared asset paths as a single exported "
            "constant so they cannot drift again. A broken image in schema or an author avatar "
            "weakens the entity signal that everything else depends on.",
            pages_affected=sum(len(v) for v in missing.values()), evidence=ev[:20])


def check_title_length_with_template():
    """Titles must be measured INCLUDING the layout's title template suffix.

    Real case: layout.tsx used `template: "%s | Barrett Henry, REALTOR®"`, adding
    26 characters to every title on the site. About 75% of 6,592 pages were
    pushed past 60 characters and truncated mid-phrase in search results. Every
    per-page title looked fine in isolation, which is why it went unnoticed.
    """
    layout = APP / "layout.tsx"
    if not layout.exists():
        return
    m = re.search(r'template:\s*"([^"]+)"', read(layout))
    if not m:
        return
    template = m.group(1)
    suffix_len = len(template.replace("%s", ""))
    if suffix_len >= 20:
        add("metadata", "high",
            f'Title template adds {suffix_len} characters to EVERY page title ("{template}")',
            f"Shorten the brand suffix. At {suffix_len} chars, any page title over "
            f"{60 - suffix_len} characters gets truncated in search results, which cuts the "
            "keyword phrase off mid-sentence and costs click-through on the whole site. "
            "REALTOR® belongs in the Person/Organization schema, not in all 6,592 titles.",
            pages_affected=3400, evidence=[f"{rel(layout)}  template = {template}"])

    # Now re-measure literal titles with the suffix included.
    over = []
    budget = 60 - suffix_len
    for page in page_files():
        txt = read(page)
        if "absolute" in txt:  # page bypasses the template entirely
            continue
        for mm in re.finditer(r'title:\s*"([^"{]{1,300})"', txt):
            t = mm.group(1)
            if len(t) > budget:
                over.append(f"{rel(page)}  {len(t)}+{suffix_len}={len(t)+suffix_len} chars: {t[:70]}")
    if over:
        add("metadata", "high",
            f"{len(over)} literal title(s) exceed 60 chars once the {suffix_len}-char template suffix is added",
            f"Each title must be <= {budget} characters so the rendered title fits in 60. "
            "Put the primary keyword first so that if it is truncated, the important words survive.",
            pages_affected=len(over), evidence=over[:20])


def check_noindex_vs_sitemap():
    """A page cannot be both 'crawl me hourly' and 'do not index me'.

    Real case: /properties/ set noindex while sitemap.ts listed it at priority
    0.9, changeFrequency hourly -- the second-highest priority on the site. That
    burns crawl budget on every pass and sends a contradictory signal.
    """
    sitemap = APP / "sitemap.ts"
    if not sitemap.exists():
        return
    sm = read(sitemap)
    conflicts = []
    for page in page_files():
        txt = read(page)
        if not re.search(r"index:\s*false|noindex", txt):
            continue
        route = route_for(page).strip("/")
        if not route:
            continue
        # Does the sitemap advertise this exact route?
        if re.search(rf"/{re.escape(route)}/?[`\"']", sm):
            conflicts.append(f"{rel(page)}  (route /{route}/) is noindex but listed in sitemap.ts")
    if conflicts:
        add("crawl", "high",
            f"{len(conflicts)} route(s) are noindex yet advertised in the sitemap",
            "Pick one. Either the page should rank — remove the noindex and give it real metadata, "
            "a canonical and an H1 — or it should not be in the sitemap at all. Keeping both wastes "
            "crawl budget that should be spent on pages that can actually win.",
            pages_affected=len(conflicts), evidence=conflicts[:15])


def check_content_truncation_regression():
    """Guard the boilerplate stripper against eating real content.

    Real case: cleanWpContent() in src/lib/utils.ts truncated every page at its
    `<h2>Frequently Asked Questions</h2>` heading. The guard was "only cut if the
    match is in the last 30% of the content" -- but an FAQ section is ALWAYS in
    the last 30%, so the guard never fired. It silently destroyed roughly a
    million words and the FAQPage schema on 1,948 pages.

    This check makes that specific class of mistake impossible to reintroduce
    quietly: no truncation pattern may target FAQ content.
    """
    utils = SRC / "lib" / "utils.ts"
    if not utils.exists():
        return
    txt = read(utils)
    # Only look at the truncation pattern lists, not the whole file.
    danger = re.compile(r"Frequently Asked Questions|Real Estate\|Explore|\(\?:Real Estate", re.I)
    # Comments documenting this very bug are not the bug. The fix for it is
    # heavily commented precisely so nobody reintroduces it, and those comments
    # quote the offending patterns -- so without this guard the check reports
    # its own fix notes as a critical defect every week.
    skip = comment_lines(txt)
    hits = []
    for ln, line in lines_matching(txt, danger):
        if ln in skip:
            continue
        # A real finding is a line that BUILDS a regex literal targeting an h2.
        if re.search(r"/\^?<h2|h2\[\^>\]", line):
            hits.append(f"{rel(utils)}:{ln}  {line[:150]}")
    if hits:
        add("content", "critical",
            f"Boilerplate stripper targets real content headings ({len(hits)} pattern(s))",
            "Remove these patterns. Truncating at a 'Frequently Asked Questions' or 'Real Estate' "
            "heading deletes real published content and the FAQPage schema with it. A "
            "'last 30% of the page' guard does NOT make this safe, because FAQ sections are always "
            "in the last 30% by design. Key boilerplate detection off the generated wrapper "
            "classes (nowtb-related, nowtb-footer-section, nowtb-about, nowtb-disclaimer) instead.",
            pages_affected=1948, evidence=hits)


def check_speakable_selectors():
    """A speakable selector that matches no element is schema pointing at nothing.

    Real case: three templates declared speakable with selector `.quick-answer`
    while none of them rendered the QuickAnswer component -- 891 pages shipped a
    selector that matched no element on the page.
    """
    offenders = []
    for p in tsx_files():
        txt = read(p)
        m = re.search(r'cssSelector[^\]]*?["\']\.([a-z0-9-]+)["\']', txt, re.I)
        if not m:
            continue
        selector = m.group(1)
        # Does this same file render something that produces that class?
        if selector.replace("-", "") not in txt.lower().replace("-", "").replace("_", ""):
            offenders.append(f"{rel(p)}  declares speakable '.{selector}' but renders no matching element")
    if offenders:
        add("schema", "high",
            f"{len(offenders)} template(s) declare a speakable selector that matches nothing",
            "Either render the component that produces that class (preferred — a direct up-front "
            "answer is exactly what AI engines extract) or correct the selector to target the "
            "element that actually holds the opening answer.",
            pages_affected=len(offenders) * 100, evidence=offenders[:15])


def check_redirect_loops():
    """Detect obvious redirect cycles and chains in next.config.mjs.

    Real case: /auburndale/gapway-lakes-estates/ was flattened to
    /gapway-lakes-estates/ by a :city redirect, and the city route then
    redirected it back. A 937-line page was live, sitemapped, and unreachable.
    Local dev was fine; only production looped.
    """
    cfg = REPO / "next.config.mjs"
    if not cfg.exists():
        return
    txt = read(cfg)
    pairs = re.findall(r'source:\s*"([^"]+)"[^}]*?destination:\s*"([^"]+)"', txt, re.S)
    table = {s: d for s, d in pairs}

    loops, chains = [], []
    for src_path, dest in table.items():
        if src_path == dest:
            loops.append(f"self-redirect: {src_path}")
            continue
        # Follow up to 5 hops looking for a cycle or a chain.
        seen, cur = [src_path], dest
        for _ in range(5):
            nxt = table.get(cur)
            if nxt is None:
                break
            if cur in seen:
                loops.append("loop: " + " -> ".join(seen + [cur]))
                break
            seen.append(cur)
            cur = nxt
        if len(seen) > 2 and not loops:
            chains.append(" -> ".join(seen))

    if loops:
        add("crawl", "critical",
            f"{len(loops)} redirect loop(s) in next.config.mjs",
            "A looping URL is a page that is live, in the sitemap, and completely unreachable. "
            "Pick ONE canonical URL and make everything else point there in a single hop. "
            "Verify against the live domain with `curl -sSI -L` — these loops often reproduce "
            "only in production, never in local dev.",
            pages_affected=len(loops), evidence=loops[:15])
    if chains:
        add("crawl", "medium",
            f"{len(chains)} redirect chain(s) with 2+ hops",
            "Collapse each chain to a single hop. Every extra hop wastes crawl budget and leaks "
            "a little ranking signal.",
            pages_affected=len(chains), evidence=chains[:15])


# ---------------------------------------------------------------------------
# Report writing
# ---------------------------------------------------------------------------

def write_report():
    FINDINGS.sort(key=lambda f: -f.score)
    today = date.today().isoformat()
    sev = Counter(f.severity for f in FINDINGS)

    md = [
        "# nowtb.com — Weekly Lead Audit",
        "",
        f"**Run:** {today}  ",
        f"**Findings:** {len(FINDINGS)}  "
        f"(critical {sev['critical']}, high {sev['high']}, medium {sev['medium']}, low {sev['low']})  ",
        f"**Experience claim should currently read:** `{CORRECT_CLAIM} of real estate experience` "
        f"({COMPLETED_YEARS} completed years since Sept {LICENSE_START.year}; "
        f"{IN_PROGRESS_YEAR}th year in progress)",
        "",
        "Ranked by severity x pages affected, so the top of this list is where the money is.",
        "",
        "---",
        "",
    ]

    if CHECK_ERRORS:
        md += ["## Checks that failed to run", ""]
        md += [f"- `{e}`" for e in CHECK_ERRORS]
        md += ["", "---", ""]

    md += ["## Priority fix list", "", "| # | Sev | Pages | Finding |", "|---|---|---|---|"]
    for i, f in enumerate(FINDINGS[:40], 1):
        md.append(f"| {i} | {f.severity} | {f.pages_affected} | {f.title} |")
    md += ["", "---", ""]

    md += ["## Detail", ""]
    for i, f in enumerate(FINDINGS, 1):
        md += [
            f"### {i}. {f.title}",
            "",
            f"- **Severity:** {f.severity}",
            f"- **Pages affected:** {f.pages_affected}",
            f"- **Check:** `{f.check}`",
            f"- **Fix:** {f.fix}",
            "",
        ]
        if f.evidence:
            md += ["<details><summary>Evidence</summary>", "", "```"]
            md += f.evidence
            md += ["```", "", "</details>", ""]

    (REPO / "WEEKLY-AUDIT.md").write_text("\n".join(md), encoding="utf-8")

    (REPO / "weekly-audit.json").write_text(
        json.dumps(
            {
                "run_date": today,
                "correct_experience_claim": CORRECT_CLAIM,
                "completed_years": COMPLETED_YEARS,
                "severity_counts": dict(sev),
                "check_errors": CHECK_ERRORS,
                "findings": [asdict(f) | {"score": f.score} for f in FINDINGS],
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"Weekly audit complete: {len(FINDINGS)} findings "
          f"({sev['critical']} critical, {sev['high']} high).")
    print("  WEEKLY-AUDIT.md     <- read this")
    print("  weekly-audit.json   <- for the automated fix pass")
    if CHECK_ERRORS:
        print(f"  WARNING: {len(CHECK_ERRORS)} check(s) failed to run. See the report.")
    for f in FINDINGS[:10]:
        print(f"  [{f.severity:8}] {f.pages_affected:>5} pages  {f.title}")


def main():
    if not APP.exists():
        sys.exit(f"Could not find {APP}. Run this from the repo root.")
    for check in [
        check_brand_rules,
        check_license_number,
        check_experience_near_location,
        check_experience_rollover,
        check_route_metadata,
        check_headings,
        check_cta_coverage,
        check_zindex_conflicts,
        check_internal_links,
        check_schema,
        check_crawl_plumbing,
        check_image_hygiene,
        check_content_quality,
        check_city_coverage,
        check_money_query_coverage,
        check_trailing_slashes,
        check_exit_intent_scope,
        check_no_dashes_in_copy,
        check_root_layout_canonical,
        check_missing_assets,
        check_title_length_with_template,
        check_noindex_vs_sitemap,
        check_content_truncation_regression,
        check_speakable_selectors,
        check_redirect_loops,
    ]:
        run_check(check)
    write_report()


if __name__ == "__main__":
    main()
