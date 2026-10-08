#!/usr/bin/env python3
"""
N7 UPDATE: /blog/buying-home-with-solar-panels-florida

Keeps the existing URL and the parts of the post that already work. Changes:
  1. Shortens the title to fit under 60 characters.
  2. Replaces every em dash and en dash with commas, colons or "to".
  3. Trims the opening section and removes an unsourced "third nationally"
     statistic that could not be verified.
  4. Adds a new section on the Tampa Electric Tier 2 liability insurance
     requirement, PACE assessments, payoff at closing, and roof penetration
     warranties, which the post did not cover.
  5. Adds a Sources section.
  6. Links to the new 4-point inspection post.

Run from the repo root: python3 content-batch/patch-n7-solar.py
"""

import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(REPO, "src", "data", "posts-export.json")
SLUG = "buying-home-with-solar-panels-florida"

NEW_TITLE = "Buying a Florida Home With Solar Panels: Buyer Guide"

# --- The trimmed opening. Drops the unverifiable national ranking claim. ---
OLD_INTRO = """<h2>Solar Panels on Florida Homes Are Everywhere Now</h2>
<p>Drive through any neighborhood in <a href="/riverview/">Riverview</a>, <a href="/wesley-chapel/">Wesley Chapel</a>, or <a href="/brandon/">Brandon</a> and you'll see solar panels on every third or fourth roof. Florida ranks third nationally for solar installations, and the number of homes with existing systems grows every year. That means if you're house hunting in Tampa Bay, you will encounter homes with solar — and you need to know what you're looking at before you write an offer.</p>
<p>Solar panels can be a genuine asset. Lower electric bills, reduced carbon footprint, and in some cases, a higher resale value. But they can also be a financial trap if you don't understand the ownership structure, the condition of the system, and the obligations that transfer to you at closing. This guide covers everything I check for my buyers when solar panels are on the property.</p>"""

NEW_INTRO = """<h2>Why solar changes the deal</h2>
<p>Drive through <a href="/riverview/">Riverview</a>, <a href="/wesley-chapel/">Wesley Chapel</a> or <a href="/brandon/">Brandon</a> and you will see panels on roof after roof. If you are house hunting in Tampa Bay you will encounter solar, and what you are really buying is a contract, a utility agreement, and a set of roof penetrations.</p>
<p>Solar can be a genuine asset: lower electric bills and, in some cases, better resale. It can also be a trap if you do not understand the ownership structure, the condition of the system, and the obligations that transfer to you at closing. Here is what I check for my buyers.</p>"""

# --- New section inserted before the insurance section. ---
NEW_SECTION = """<h2>The insurance requirement that catches cash buyers</h2>
<p>This is the one almost nobody knows about, and it bites cash buyers hardest.</p>
<p>If the system is large enough, your utility requires you to carry liability insurance as a condition of staying connected to the grid. Under Tampa Electric's standard interconnection agreement for Tier 2 renewable generator systems, a Tier 2 system is rated above 10 kW and no more than 100 kW alternating current, and the agreement states that the customer "shall maintain general liability insurance for personal injury and property damage in the amount of not less than one million dollars ($1,000,000)."</p>
<p>It is not a one-time form, either. The customer must provide initial proof of insurance and then submit proof of continuing coverage within 30 days of any policy renewal. Failure to maintain the required insurance is grounds for terminating the interconnection agreement, which means the system can be disconnected from the grid.</p>
<p>Why cash buyers get caught: a financed buyer has a lender requiring a homeowners policy, and the agent placing that policy usually catches the solar system and the liability requirement. A cash buyer has no lender forcing the conversation. I have seen cash buyers close, never file proof of coverage, and find out later that their interconnection is in default.</p>
<p>Two practical notes. First, dropping a Tier 2 system below 10 kW or pushing it above 100 kW requires a new agreement at a different tier, so changes to the array are not cosmetic. Second, systems above 100 kW up to 2 MW carry a higher requirement, not less than $2,000,000 in general liability. Confirm your system size in kW AC and your own utility's current tariff, because requirements differ by utility.</p>

<h2>PACE assessments, and why they are different</h2>
<p>Some Florida solar systems were financed through a PACE program, which stands for Property Assessed Clean Energy. This is not a loan in the normal sense. It is a non-ad valorem assessment attached to the property and collected on the property tax bill.</p>
<p>That distinction matters enormously:</p>
<ul>
<li><strong>It runs with the land, not the person.</strong> It does not get paid off because the owner moved. It transfers to you.</li>
<li><strong>It can sit ahead of your mortgage in priority</strong>, which is exactly why many lenders require a PACE assessment to be paid off at closing before they will fund.</li>
<li><strong>It shows up on the tax bill, not in a lien search for a mortgage.</strong> If you only look for a UCC filing or a recorded mortgage, you can miss it entirely.</li>
</ul>
<p>Pull the property tax bill for the parcel and read the non-ad valorem assessment lines. If there is a PACE assessment, get the current payoff figure in writing and decide who pays it before you are at the closing table.</p>

<h2>Getting the payoff handled at closing</h2>
<p>If the panels are financed or leased with a buyout, the cleanest outcome is almost always a payoff at closing out of the seller's proceeds, with the lien released and the system conveyed to you free and clear. Make that an explicit term of the contract rather than an assumption.</p>
<p>What to require in writing:</p>
<ul>
<li>A current payoff or buyout statement from the solar lender or lessor, with a good-through date.</li>
<li>Confirmation that the title company has the payoff in the closing figures and will obtain a release or UCC termination.</li>
<li>If instead you are assuming a lease or power purchase agreement, the lessor's written approval of you as the transferee, completed before your inspection period ends. Transfer approval is not automatic and it is not fast.</li>
</ul>
<p>The failure mode here is predictable: everyone assumes the lease transfer is a formality, nobody starts the paperwork, and the closing gets delayed while the solar company runs a credit check on the buyer.</p>

<h2>Roof penetration warranties</h2>
<p>A solar array is bolted through your roof covering. Every mount is a hole that was flashed and sealed by the solar installer, not by the roofer.</p>
<p>That creates a split responsibility that matters the first time water shows up in a ceiling:</p>
<ul>
<li><strong>Ask whether the roofing manufacturer's warranty was voided</strong> by the installation. Some manufacturers void coverage unless the array was installed by a certified installer using approved mounts.</li>
<li><strong>Ask for the installer's separate penetration or weatherproofing warranty</strong>, its term, and whether it transfers to a new owner. Many are 5 or 10 years and many do not transfer.</li>
<li><strong>Get both warranty documents before your inspection period ends.</strong> A leak around a mount with no transferable warranty and a voided roof warranty is entirely your cost.</li>
</ul>
<p>Also have your inspector look at the attic directly beneath the array. Staining on the sheathing tells you more than a visual roof inspection from the ground.</p>
<p>While you are inspecting an older Florida home, order the insurance inspections at the same time. My guide to <a href="/blog/what-fails-florida-4-point-inspection/" style="text-decoration:underline;font-weight:600;">what fails a Florida 4-point inspection</a> covers how roof age interacts with insurability, which is the other half of this problem.</p>

"""

SOURCES = """<h2>Sources</h2>
<ul>
<li><a href="https://www.tampaelectric.com/49c914/siteassets/files/tariff/tariffsection8/stndinterconnagmttier2_if.pdf" rel="nofollow" style="text-decoration:underline;font-weight:600;">Tampa Electric Standard Interconnection Agreement for Tier 2 Renewable Generator Systems</a> (10 kW to 100 kW AC definition, $1,000,000 general liability requirement, renewal proof, termination for lapse)</li>
<li>Fla. Admin. Code R. 25-6.065 (Florida Public Service Commission net metering and interconnection for investor-owned utilities)</li>
<li>Fla. Stat. 163.08 (PACE, qualifying improvements financed by non-ad valorem assessment)</li>
<li><a href="https://www.citizensfla.com/inspections" rel="nofollow" style="text-decoration:underline;font-weight:600;">Citizens Property Insurance Corporation, Inspections</a> (roof and 4-point requirements)</li>
</ul>

"""


def main():
    with open(POSTS, encoding="utf-8") as fh:
        posts = json.load(fh)

    idx = next((i for i, p in enumerate(posts) if p["slug"] == SLUG), None)
    if idx is None:
        sys.exit("Post not found: %s" % SLUG)

    post = posts[idx]
    content = post["content"]

    # 1. Title
    post["title"] = NEW_TITLE

    # 3. Trimmed intro, unsourced stat removed
    if OLD_INTRO in content:
        content = content.replace(OLD_INTRO, NEW_INTRO)
    else:
        print("WARNING: intro block not matched, skipping intro trim")

    # 4. New sections, inserted before the existing insurance section
    anchor = "<h2>How Solar Panels Affect Your Home Insurance</h2>"
    if anchor in content:
        content = content.replace(anchor, NEW_SECTION + anchor, 1)
    else:
        sys.exit("Insurance anchor not found, aborting rather than appending blindly")

    # 5. Sources, inserted before Related Guides
    rel = "<h2>Related Guides</h2>"
    if rel in content:
        content = content.replace(rel, SOURCES + rel, 1)
    else:
        sys.exit("Related Guides anchor not found")

    # 2. Dashes. Done last so the inserted blocks are covered too.
    #    An em dash between spaces becomes a comma; a bare one becomes a colon;
    #    en dashes between digits become "to".
    content = re.sub(r"(\d)\s*–\s*(\d)", r"\1 to \2", content)
    content = re.sub(r"(\d)\s*—\s*(\d)", r"\1 to \2", content)
    content = content.replace(" — ", ", ")
    content = content.replace("—", ",")
    content = content.replace(" – ", ", ")
    content = content.replace("–", " to ")

    post["title"] = post["title"].replace("—", ",").replace("–", " to ")
    post["excerpt"] = post["excerpt"].replace("—", ",").replace("–", " to ")
    post["content"] = content

    # Mark it as revised this month so the template's date reflects the update.
    post["date"] = "2026-10-07 09:45:00"

    posts[idx] = post
    tmp = POSTS + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(posts, fh, ensure_ascii=False)
    os.replace(tmp, POSTS)

    plain = re.sub(r"<script[\s\S]*?</script>", " ", content)
    plain = re.sub(r"<[^>]+>", " ", plain)
    print("Updated %s" % SLUG)
    print("  title: %d chars" % len(post["title"]))
    print("  words: %d" % len(plain.split()))
    print("  em dashes left: %d" % content.count("—"))


if __name__ == "__main__":
    main()
