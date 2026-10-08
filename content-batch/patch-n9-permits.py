#!/usr/bin/env python3
"""
N9 UPDATE: /blog/how-to-check-permit-history-hillsborough-county

The existing post covers the Hillsborough County portals only. A buyer looking
at a house inside Tampa city limits is searching the wrong system entirely, so
this adds the City of Tampa portal, the property appraiser square footage
cross-check, and the older-bungalow context for Seminole Heights and Tampa
Heights. URL and slug are unchanged.

Run from the repo root: python3 content-batch/patch-n9-permits.py
"""

import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(REPO, "src", "data", "posts-export.json")
SLUG = "how-to-check-permit-history-hillsborough-county"

NEW_TITLE = "How to Check Permits Before Buying a Tampa Home"
NEW_EXCERPT = (
    "Which portal to search for City of Tampa vs Hillsborough County permits, "
    "how to spot unpermitted additions, and what to do in your inspection period."
)

CITY_SECTION = """<h2>First, make sure you are searching the right system</h2>
<p>This is the mistake I see most often, and it produces a false clean result.</p>
<p>If the property is inside <strong>City of Tampa</strong> limits, the county portals will not have your building permits. The City issues its own. If the property is in <strong>unincorporated Hillsborough County</strong>, the county portals are correct. Temple Terrace and Plant City run their own permitting too.</p>
<p>So step one is not searching. Step one is determining the jurisdiction. Look up the parcel on the Hillsborough County Property Appraiser site and check the municipality field, or simply check whether the mailing city matches an incorporated city. A Seminole Heights address is a City of Tampa address even though plenty of people describe it as "Tampa" the same way they describe Brandon as "Tampa."</p>

<h2>How to search City of Tampa permits</h2>
<p>The City of Tampa uses the Accela Citizen Access portal at <a href="https://aca.tampagov.net" rel="nofollow" style="text-decoration:underline;font-weight:600;">aca.tampagov.net</a>. The City's Construction Services Division, part of Development and Growth Management, issues building permits and performs inspections inside city limits.</p>
<ol>
<li>Go to the portal and choose the Building module. You do not need an account for a basic search. An account is only required to submit an application or schedule an inspection.</li>
<li>Search by address, permit number, or contractor name.</li>
<li><strong>Enter only the street number and street name.</strong> This is the part that trips people up. Leave off the direction, the suffix and the unit. Searching "2905 N Central Ave" often returns nothing while "2905 Central" returns the records.</li>
<li>Open each record and look at the status, the final inspection, and the scope of work described.</li>
<li>Repeat with address variations. Older properties frequently have records filed under slightly different spellings.</li>
</ol>
<p>If the portal returns nothing at all for an older house, that is a finding, not a conclusion. Call the Construction Services Center and ask whether there are microfilm or archived records that are not in the online system. Pre-digital permits often are not.</p>

<h2>Compare the property appraiser's square footage to the listing</h2>
<p>This is the single fastest way to find unpermitted work, and it takes about two minutes.</p>
<p>The <a href="https://www.hcpafl.org/" rel="nofollow" style="text-decoration:underline;font-weight:600;">Hillsborough County Property Appraiser</a> publishes heated area and building characteristics for every parcel. Pull that up next to the listing.</p>
<ul>
<li><strong>Listing says 1,850 sq ft, appraiser says 1,450 sq ft.</strong> That 400 square foot gap is something. An enclosed garage, a Florida room converted to living space, a rear addition, or a converted porch. Now go find the permit for it.</li>
<li><strong>Bedroom or bathroom count differs.</strong> A fourth bedroom that the appraiser does not show usually means a converted garage or a divided room.</li>
<li><strong>The appraiser shows a higher number than the listing.</strong> Less common, usually a data error, still worth asking about.</li>
</ul>
<p>Why the gap matters: the appraiser's heated area generally reflects permitted, finished living space. An agent's square footage sometimes reflects a tape measure. When they disagree, a permit is usually the explanation, and the absence of one is the problem.</p>
<p>One important caveat. The appraiser's records are not a permit database and they do contain errors. A discrepancy is a reason to search permits, not proof of a violation.</p>

<h2>Why unpermitted work actually hurts you</h2>
<p>People treat this as a paperwork technicality. It is not. It hits you in four places:</p>
<ul>
<li><strong>Insurance.</strong> A carrier can deny a claim on unpermitted construction, and some will decline the policy outright. If an unpermitted addition burns or floods, you may be uninsured for that portion of the house.</li>
<li><strong>Appraisal.</strong> Appraisers are generally instructed not to give value to unpermitted square footage. You can pay for 1,850 feet and be appraised at 1,450, which creates an appraisal gap you have to cover in cash.</li>
<li><strong>Financing.</strong> If the appraisal comes in short because of unpermitted area, your loan amount drops with it.</li>
<li><strong>Resale and enforcement.</strong> You inherit the problem. Code enforcement can require permitting after the fact or removal, and retroactive permitting means opening walls for inspection. On your way out, your buyer runs the same search you are running now.</li>
</ul>
<p>Florida requires a permit for most construction, alteration, repair and addition work under Fla. Stat. 553.79 and section 105.1 of the Florida Building Code, with narrow exemptions.</p>

<h2>Seminole Heights and Tampa Heights bungalows</h2>
<p>These neighborhoods deserve their own note because the housing stock almost guarantees this issue.</p>
<p>Much of Seminole Heights and Tampa Heights was built in the 1910s through 1940s. A century of owners means a century of modifications, most of them done before anyone kept searchable records, and many done without permits in eras when enforcement was looser.</p>
<p>What I specifically check on a bungalow in these areas:</p>
<ul>
<li><strong>Rear additions and back-of-house kitchens.</strong> The most common unpermitted change. Original bungalows had small kitchens; almost all of them have been pushed out.</li>
<li><strong>Enclosed front or side porches.</strong> A screened porch converted to conditioned space changes the heated area and frequently was never permitted.</li>
<li><strong>Garage and carport conversions,</strong> often into a bedroom, an office, or an unpermitted second unit.</li>
<li><strong>Detached structures used as living space.</strong> A garage apartment or converted shed is a zoning question as well as a permit question.</li>
<li><strong>Electrical and plumbing from the original build.</strong> Knob and tube is rare here but galvanized supply lines are not. See <a href="/blog/what-fails-florida-4-point-inspection/" style="text-decoration:underline;font-weight:600;">what fails a Florida 4-point inspection</a>, because an insurance decline in these neighborhoods is usually about systems, not permits.</li>
<li><strong>Historic district overlay.</strong> Parts of these areas sit in local historic districts with design review requirements. That changes what you can alter and how, separate from permitting.</li>
</ul>
<p>None of this makes a bungalow a bad buy. I like these houses. It means you budget a real inspection period and you do the permit search before you spend money, not after.</p>

<h2>What to do during your inspection period</h2>
<ol>
<li><strong>Day one:</strong> confirm the jurisdiction, then search the correct portal. Pull the appraiser record at the same time.</li>
<li><strong>Day one:</strong> compare appraiser heated area, bedroom and bath count against the listing. Note every discrepancy.</li>
<li><strong>Day two or three:</strong> walk the house with the inspector and point at the discrepancies specifically. Ask "was this permitted" about each one.</li>
<li><strong>If you find an open or expired permit:</strong> ask the seller to close it out before closing. An open permit can hold up your own future permits and is the seller's mess to resolve.</li>
<li><strong>If you find unpermitted work:</strong> get a written quote for retroactive permitting from a licensed contractor before your inspection period ends, so you are negotiating with a number rather than a worry.</li>
<li><strong>If records are missing entirely:</strong> call the permitting office and ask about archives before you treat silence as a clean history.</li>
</ol>
<p>The sequence matters. Everything above happens in the first few days, because the only leverage you have is an inspection period that has not expired.</p>

"""

SOURCES = """<h2>Sources</h2>
<ul>
<li><a href="https://aca.tampagov.net" rel="nofollow" style="text-decoration:underline;font-weight:600;">City of Tampa Accela Citizen Access portal</a> (permit search by address, permit number or contractor)</li>
<li><a href="https://www.tampa.gov/construction-services" rel="nofollow" style="text-decoration:underline;font-weight:600;">City of Tampa Construction Services</a></li>
<li><a href="https://hcfl.gov/residents/property-owners-and-renters/building-and-construction" rel="nofollow" style="text-decoration:underline;font-weight:600;">Hillsborough County Building and Construction Services</a></li>
<li><a href="https://www.hcpafl.org/" rel="nofollow" style="text-decoration:underline;font-weight:600;">Hillsborough County Property Appraiser</a> (heated area and building characteristics)</li>
<li>Fla. Stat. 553.79 and Florida Building Code s.105.1 (permit requirement); Fla. Stat. 553.79(15) and FBC s.105.4 (permit expiration)</li>
</ul>

"""

EXTRA_FAQ = """<h3>Do City of Tampa and Hillsborough County use the same permit portal?</h3>
<p>No, and this causes false clean results. The City of Tampa issues permits inside city limits through its Accela Citizen Access portal at aca.tampagov.net. Unincorporated Hillsborough County uses the county's own system. Temple Terrace and Plant City permit separately as well. Confirm the jurisdiction before you search.</p>
<h3>How do I spot an unpermitted addition?</h3>
<p>Compare the Hillsborough County Property Appraiser's heated area, bedroom and bathroom counts against the listing. A gap of a few hundred square feet usually means an enclosed porch, a converted garage, or a rear addition. Then search the permit portal for that work. Appraiser records contain errors, so treat a discrepancy as a reason to search rather than as proof.</p>
"""

EXTRA_FAQ_LD = """,
    {"@type":"Question","name":"Do City of Tampa and Hillsborough County use the same permit portal?","acceptedAnswer":{"@type":"Answer","text":"No, and this causes false clean results. The City of Tampa issues permits inside city limits through its Accela Citizen Access portal at aca.tampagov.net. Unincorporated Hillsborough County uses the county's own system. Temple Terrace and Plant City permit separately as well. Confirm the jurisdiction before you search."}},
    {"@type":"Question","name":"How do I spot an unpermitted addition?","acceptedAnswer":{"@type":"Answer","text":"Compare the Hillsborough County Property Appraiser's heated area, bedroom and bathroom counts against the listing. A gap of a few hundred square feet usually means an enclosed porch, a converted garage, or a rear addition. Then search the permit portal for that work. Appraiser records contain errors, so treat a discrepancy as a reason to search rather than as proof."}}"""


def main():
    with open(POSTS, encoding="utf-8") as fh:
        posts = json.load(fh)
    idx = next((i for i, p in enumerate(posts) if p["slug"] == SLUG), None)
    if idx is None:
        sys.exit("Post not found: %s" % SLUG)

    post = posts[idx]
    content = post["content"]
    post["title"] = NEW_TITLE
    post["excerpt"] = NEW_EXCERPT

    # Insert the jurisdiction and City of Tampa material immediately after the
    # "why it matters" opener, before the county portal walkthroughs.
    anchor = "<h2>How to Search HillsGovHub (Records After January 2021)</h2>"
    if anchor not in content:
        sys.exit("HillsGovHub anchor not found, aborting")
    content = content.replace(anchor, CITY_SECTION + anchor, 1)

    # Extra FAQ entries, visible copy.
    faq_anchor = "<h3>Can my home inspector check permit history?</h3>"
    if faq_anchor in content:
        content = content.replace(faq_anchor, EXTRA_FAQ + faq_anchor, 1)
    else:
        print("WARNING: FAQ anchor not found, visible FAQ not extended")

    # Extra FAQ entries, JSON-LD. Append inside the mainEntity array.
    m = re.search(r'("@type":"FAQPage",\s*"mainEntity":\s*\[)([\s\S]*?)(\]\s*\})', content)
    if m:
        content = content[: m.end(2)] + EXTRA_FAQ_LD + content[m.end(2):]
    else:
        print("WARNING: FAQPage JSON-LD not matched, schema not extended")

    # Sources before Related Guides if present, otherwise before the About block.
    for rel in ("<h2>Related Guides</h2>", '<p style="font-size:15px;color:#6b7280'):
        if rel in content:
            content = content.replace(rel, SOURCES + rel, 1)
            break
    else:
        content = content + SOURCES

    # Dashes last so inserted text is covered too.
    content = re.sub(r"(\d)\s*[—–]\s*(\d)", r"\1 to \2", content)
    content = content.replace(" — ", ", ").replace("—", ",")
    content = content.replace(" – ", ", ").replace("–", " to ")
    post["title"] = post["title"].replace("—", ",").replace("–", " to ")
    post["excerpt"] = post["excerpt"].replace("—", ",").replace("–", " to ")
    post["content"] = content
    post["date"] = "2026-10-07 10:00:00"

    posts[idx] = post
    tmp = POSTS + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(posts, fh, ensure_ascii=False)
    os.replace(tmp, POSTS)

    plain = re.sub(r"<script[\s\S]*?</script>", " ", content)
    plain = re.sub(r"<[^>]+>", " ", plain)
    print("Updated %s" % SLUG)
    print("  title: %d chars | excerpt: %d chars | words: %d | em dashes: %d"
          % (len(post["title"]), len(post["excerpt"]), len(plain.split()), content.count("—")))


if __name__ == "__main__":
    main()
