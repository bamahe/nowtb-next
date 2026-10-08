#!/usr/bin/env python3
"""
N20 UPDATE: condo short sale section.

Adds a condo-specific section to the existing hub page and a shorter
cross-reference to the two spoke posts. No new pages are created, and every URL
stays the same.

Hub:    /pre-foreclosure-short-sale-options   (src/data/pages-content.json)
Spokes: /blog/short-sale-florida-guide
        /blog/short-sale-vs-foreclosure-florida

Run from the repo root: python3 content-batch/patch-n20-shortsale.py
"""

import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = os.path.join(REPO, "src", "data", "pages-content.json")
POSTS = os.path.join(REPO, "src", "data", "posts-export.json")

HUB_SLUG = "pre-foreclosure-short-sale-options"
SPOKES = ["short-sale-florida-guide", "short-sale-vs-foreclosure-florida"]

# --- The full condo section, for the hub page ---
CONDO_SECTION = """<h2>How a Condo Short Sale Is Different</h2>
<p>A condo short sale has three moving parts a house does not: the association, the building's inspection and reserve obligations, and whatever amenities are assigned to your unit. Any one of them can change the number a lender will accept.</p>

<h3>Building height decides which inspection rules apply</h3>
<p>Florida's condo safety requirements are driven by building height, and the trigger changed. Under CS/CS/HB 913, passed in 2025, milestone inspection requirements apply to condominium and cooperative buildings <strong>three or more habitable stories</strong> in height, replacing the earlier three or more stories test. The same habitable stories concept was carried into the structural integrity reserve study requirement.</p>
<p>Why that matters in a short sale: if your building is covered, it may be carrying a milestone inspection report identifying required repairs, a reserve study it is not yet funded for, or a special assessment already levied. Each of those reduces what a buyer will pay, which is exactly the number your lender is evaluating. A building that has completed both reports and funded its reserves supports a materially higher price than one that has not.</p>
<p>HB 913 also allowed associations required to complete a milestone inspection on or before December 31, 2026 to complete the structural integrity reserve study at the same time, with no study completed after December 31, 2026, and it permits an association to pause reserve funding for up to two years after a milestone inspection in order to direct money to required repairs. So an association can be compliant and currently funding no reserves, which is a detail worth putting in front of your lender rather than letting the buyer's lender discover it.</p>
<p>Practical step: get the milestone report, the reserve study, the current budget and reserve balances, and any assessment notice into the short sale package yourself. These documents usually help your case, because they explain the price. Leaving the lender to guess never helps.</p>

<h3>Parking spaces and boat slips may not transfer</h3>
<p>This is the one that surprises people, and it can move the value of the unit by tens of thousands of dollars.</p>
<p>Assigned amenities such as a parking space, a garage, a storage unit, or a boat slip are held in different ways depending on the building. The arrangement determines whether it goes to your buyer or reverts to the association:</p>
<ul>
<li><strong>A limited common element assigned to your unit</strong> generally transfers with the unit automatically.</li>
<li><strong>A separately deeded parcel</strong> transfers only if it is actually included in the deed, so it has to be in the contract and in the title work.</li>
<li><strong>A revocable license or a use right granted by the board</strong> can expire, be reassigned, or revert to the association on transfer, which means your buyer may not get it at all.</li>
<li><strong>A slip or space subject to a lease from the association</strong> transfers only on the terms of that lease.</li>
</ul>
<p>Do not rely on what the seller believes or on what the listing says. Pull the recorded declaration and its amendments, the plat or survey showing the assignment, and the deed by which the current owner took title. If a boat slip is being marketed with the unit and the documents do not support it, that discrepancy will surface at title review and it will cost you the closing.</p>

<h3>Servicer versus investor, which is who actually decides</h3>
<p>The company you call and send documents to is the <strong>servicer</strong>. The company that owns the loan and whose money is at risk is the <strong>investor</strong>. They are frequently not the same, and the servicer often cannot approve your short sale on its own.</p>
<p>What follows from that:</p>
<ul>
<li><strong>Ask early who the investor is.</strong> Approval authority, timelines and the minimum acceptable net all come from investor guidelines, not from the servicer's preference.</li>
<li><strong>Mortgage insurance adds a third approver.</strong> If the loan carries mortgage insurance, the insurer frequently has its own sign-off, and that is often the step nobody accounted for in the timeline.</li>
<li><strong>A second lien holder is a fourth.</strong> A second mortgage or a HELOC has to agree to release, and their incentives differ from the first lien holder's.</li>
<li><strong>Association liens get negotiated separately.</strong> Unpaid condo assessments are their own claim, and Florida law limits what a first mortgage foreclosure purchaser owes the association for past due amounts. In a short sale, by contrast, the association's payoff is a negotiation, and a large delinquency can be the thing that sinks the file.</li>
</ul>
<p>Expect the condo version to take longer than the house version for exactly this reason: more approvers.</p>

<h3>Read the third-party negotiator's fee terms before you sign anything</h3>
<p>You may be told that a third-party negotiator or short sale processing company will handle the lender negotiation. Sometimes that is genuinely useful. Before you sign, read the fee terms specifically, and get answers in writing to all of these:</p>
<ul>
<li><strong>Who pays the fee?</strong> Some are paid from closing proceeds, which means your lender has to approve the fee as a cost of sale. If the lender refuses it, who covers it?</li>
<li><strong>Is any portion due up front or regardless of outcome?</strong> A fee that is owed even if the short sale is never approved is a very different product from a contingent one.</li>
<li><strong>Is the fee a flat amount or a percentage?</strong> And is it disclosed on the settlement statement, as it should be?</li>
<li><strong>Can you cancel, and what does cancellation cost?</strong></li>
<li><strong>Who is the fee agreement actually with</strong>, you or the buyer? Both arrangements exist and they have different consequences for you.</li>
</ul>
<p>Be especially careful with anything that asks for an advance fee to negotiate with your lender or to stop a foreclosure. Florida regulates foreclosure rescue services and requires written agreements, and an arrangement that is vague about who owes what and when is a reason to slow down and have a lawyer look at it.</p>
<p>My own position: I do not charge a homeowner a separate negotiation fee, and I will tell you plainly when a short sale is not your best option. Confirm the tax and legal consequences of any short sale with your CPA and a Florida real estate attorney, because debt forgiveness and deficiency treatment depend on facts specific to you.</p>

"""

# --- Shorter pointer for the two spoke posts ---
SPOKE_SECTION = """<h2>If the property is a condo, four extra things apply</h2>
<p>A condo short sale carries three approvers a house does not, plus two document issues that change the price. In short:</p>
<ul>
<li><strong>Building height drives the inspection rules.</strong> Under CS/CS/HB 913 (2025), milestone inspection requirements apply to condominium and cooperative buildings three or more habitable stories in height, and the same habitable stories concept was carried into the structural integrity reserve study requirement. An outstanding milestone repair list or an unfunded reserve study reduces what any buyer will pay, which is the number your lender is judging.</li>
<li><strong>Assigned parking and boat slips may not transfer.</strong> Depending on the building, an assigned space or slip can be a limited common element that passes with the unit, a separately deeded parcel that passes only if it is in the deed, or a revocable license that reverts to the association on transfer. Check the recorded declaration, the plat and the current owner's deed rather than the listing.</li>
<li><strong>The servicer is not always the decision maker.</strong> The investor who owns the loan sets the guidelines, and a mortgage insurer or a second lien holder may each have a separate sign-off. Unpaid association assessments are negotiated on top of all of that.</li>
<li><strong>Read any third-party negotiator's fee terms first.</strong> Confirm in writing who pays, whether any part is owed if the short sale is never approved, whether it is flat or a percentage, and how it appears on the settlement statement.</li>
</ul>
<p>The full breakdown is on my <a href="/pre-foreclosure-short-sale-options/">pre-foreclosure and short sale options</a> page. For the condo documents themselves, see <a href="/florida-condo-rules-buyers-2026/">Florida condo rules for buyers</a> and <a href="/gulf-front-condos-sirs-milestone-complete/">which buildings have SIRS and milestone complete</a>. Confirm tax and legal consequences with your CPA and a Florida real estate attorney.</p>

"""


def strip_dashes(text):
    text = re.sub(r"(\d)\s*[—–]\s*(\d)", r"\1 to \2", text)
    text = text.replace(" — ", ", ").replace("—", ",")
    text = text.replace(" – ", ", ").replace("–", " to ")
    return text


def insert_before(content, anchors, block, label):
    """Insert block before the first anchor found. Abort if none match."""
    for a in anchors:
        if a in content:
            return content.replace(a, block + a, 1)
    sys.exit("No anchor matched for %s. Tried: %s" % (label, anchors))


def main():
    # ---- Hub page ----
    with open(PAGES, encoding="utf-8") as fh:
        pages = json.load(fh)
    hi = next((i for i, p in enumerate(pages) if p["slug"] == HUB_SLUG), None)
    if hi is None:
        sys.exit("Hub page not found: %s" % HUB_SLUG)

    hub = pages[hi]
    hub_anchors = [
        "<h2>Frequently Asked Questions</h2>",
        "<h2>Facing Financial Hardship? You Have Options</h2>",
    ]
    hub["content"] = strip_dashes(
        insert_before(hub["content"], hub_anchors, CONDO_SECTION, "hub")
    )
    pages[hi] = hub

    tmp = PAGES + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(pages, fh, ensure_ascii=False)
    os.replace(tmp, PAGES)

    plain = re.sub(r"<[^>]+>", " ", hub["content"])
    print("Updated /%s" % HUB_SLUG)
    print("  words: %d | em dashes: %d" % (len(plain.split()), hub["content"].count("—")))

    # ---- Spoke posts ----
    with open(POSTS, encoding="utf-8") as fh:
        posts = json.load(fh)

    for slug in SPOKES:
        pi = next((i for i, p in enumerate(posts) if p["slug"] == slug), None)
        if pi is None:
            print("  WARNING: spoke not found, skipped: %s" % slug)
            continue
        post = posts[pi]
        content = post["content"]

        # Prefer to land above the FAQ or the closing CTA. Fall back to appending
        # just inside the content wrapper rather than guessing at a position.
        anchors = [
            "<h2>Frequently Asked Questions",
            "<h2>Related",
            '<p style="font-size:15px;color:#6b7280',
        ]
        placed = False
        for a in anchors:
            idx = content.find(a)
            if idx != -1:
                content = content[:idx] + SPOKE_SECTION + content[idx:]
                placed = True
                break
        if not placed:
            # Append before the final closing div of the post wrapper.
            cut = content.rfind("</div>")
            content = content[:cut] + SPOKE_SECTION + content[cut:] if cut != -1 else content + SPOKE_SECTION

        post["content"] = strip_dashes(content)
        post["title"] = strip_dashes(post["title"])
        post["excerpt"] = strip_dashes(post.get("excerpt", ""))
        posts[pi] = post
        pl = re.sub(r"<script[\s\S]*?</script>", " ", post["content"])
        pl = re.sub(r"<[^>]+>", " ", pl)
        print("Updated /blog/%s" % slug)
        print("  words: %d | em dashes: %d | title: %d chars"
              % (len(pl.split()), post["content"].count("—"), len(post["title"])))

    tmp = POSTS + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(posts, fh, ensure_ascii=False)
    os.replace(tmp, POSTS)


if __name__ == "__main__":
    main()
