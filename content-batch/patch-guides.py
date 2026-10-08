#!/usr/bin/env python3
"""
N10 and N19 UPDATES, both in src/data/guides-content.json.

N10  /guides/1031-exchange-guide
     Already a strong 3,400 word guide. Adds the two things it was missing:
     the contract language that protects the exchange, and how a financed
     replacement property differs from a cash one. Also adds Sources.

N19  /guides/how-to-choose-a-realtor
     Adds a section on verifying an agent's production claims, which is the
     specific question "how do I know if these sales numbers are real" and was
     not answered anywhere on the site. Names no competitors.

Both: em and en dashes removed, titles shortened under 60 characters, Sources
added. Slugs and URLs unchanged.

Run from the repo root: python3 content-batch/patch-guides.py
"""

import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDES = os.path.join(REPO, "src", "data", "guides-content.json")

# --------------------------------------------------------------------------
# N10: 1031 exchange
# --------------------------------------------------------------------------

N10_TITLE = "1031 Exchange Florida 2026 | Defer Capital Gains"

N10_NEW = """<h2>The contract language that protects the exchange</h2>
<p>Your exchange can be disqualified by a purchase contract that was written as though no exchange were happening. This is avoidable and it costs nothing to get right, but it has to be done before you sign.</p>
<p>Three things belong in the paperwork:</p>
<ul>
<li><strong>A cooperation clause.</strong> On both the sale of the relinquished property and the purchase of the replacement, the contract should state that the other party agrees to cooperate with your exchange at no additional cost or liability to them. Sellers and buyers almost never object, because it costs them nothing. They do object to being surprised at the closing table.</li>
<li><strong>An assignment right.</strong> The contract must allow you to assign your rights to the qualified intermediary. The intermediary steps into your position in the contract; that is the mechanism that keeps the proceeds out of your hands. A contract with a flat no-assignment clause breaks the structure.</li>
<li><strong>Written notice of the assignment</strong> to all parties before closing. This is a formality that gets skipped and then matters later.</li>
</ul>
<p>The underlying reason for all of this is constructive receipt. If you receive or control the sale proceeds, even briefly, even in your attorney's trust account, the exchange can fail. That is why the intermediary has to be engaged <strong>before</strong> the relinquished property closes. Engaging one the day after closing does not work. There is no retroactive fix.</p>
<p>On the replacement side, name the buyer carefully. The taxpayer who sold must be the taxpayer who buys. If you sold as an individual and then try to take title in a newly formed LLC with other members, you have changed the taxpayer and you have a problem. A single member LLC that is disregarded for tax purposes is generally treated as the same taxpayer, but confirm the specific structure with your CPA before you sign anything.</p>

<h2>Cash versus financed replacement property</h2>
<p>You can absolutely finance the replacement property in a 1031 exchange, and most investors do. But the debt interacts with the exchange in a way that surprises people.</p>
<p>The rule to hold onto: to fully defer, you generally need to acquire replacement property of <strong>equal or greater value</strong> and you must not reduce your debt without replacing it with cash. If you pay off a $300,000 mortgage on the sale and only take on $150,000 of new debt, that $150,000 reduction is mortgage boot and it is taxable, even though you never touched a dollar of cash.</p>
<p>Practical implications:</p>
<ul>
<li><strong>Replacing debt with cash works.</strong> If you want to take on less debt on the replacement property, you can bring additional cash to the closing to make up the difference and stay fully deferred.</li>
<li><strong>Your lender needs to know on day one.</strong> An exchange adds a party, adds documents, and adds a hard deadline. Some lenders handle exchanges routinely. Some have never seen one and will discover the complication at underwriting, which is the worst possible time given the 180-day limit.</li>
<li><strong>The 180 days do not pause for your loan.</strong> This is the real risk of a financed replacement. An appraisal delay or a condo project review can eat three weeks, and the deadline does not move. Build the financing timeline backward from day 180, not forward from day one.</li>
<li><strong>Cash buyers have a timing advantage worth real money here.</strong> If you are competing for a replacement property against a cash offer while on a 1031 clock, you are the weaker buyer on terms. Price accordingly or identify more backup properties.</li>
<li><strong>Identify backups.</strong> The three-property rule lets you identify up to three replacement properties regardless of value. Use all three. Identifying one property and having it fall through after day 45 is how exchanges die.</li>
</ul>
<p>Ask me for current lender recommendations if you need someone who has actually closed exchange purchases on a deadline. The difference between a lender who has and one who has not is measured in weeks you do not have.</p>

<h2>Buying your replacement property in Tampa</h2>
<p>Two local notes that matter on the replacement side.</p>
<p>First, run the permit history before your 45 days expire, not after. An unpermitted addition on a small multi-unit or an older rental can hold up an appraisal, and you do not have schedule slack to absorb that. My guide to <a href="/blog/how-to-check-permit-history-hillsborough-county/">checking permit history before buying</a> covers which portal to search, because City of Tampa and unincorporated Hillsborough County are different systems.</p>
<p>Second, if the property you are relinquishing is a former primary residence rather than a long-held rental, stop and look at the capital gains exclusion before you exchange. You may be better off selling outright and excluding the gain than deferring it. I walk through that tradeoff in <a href="/blog/sell-or-rent-my-house-tampa-bay/">should I sell or rent my house in Tampa Bay</a>. Those two paths are mutually exclusive, so get your CPA involved before you pick one.</p>

"""

N10_SOURCES = """<h2>Sources</h2>
<ul>
<li><a href="https://www.irs.gov/pub/irs-pdf/i8824.pdf" rel="nofollow">IRS Instructions for Form 8824, Like-Kind Exchanges</a> (45-day identification, 180-day receipt, reporting)</li>
<li>IRC s.1031; Treas. Reg. 1.1031(k)-1 (qualified intermediary safe harbor, constructive receipt, identification rules)</li>
<li>IRC s.1031(a)(1) as amended by P.L. 115-97 (like-kind treatment limited to real property)</li>
<li><a href="https://floridarevenue.com/taxes/taxesfees/Pages/doc_stamp.aspx" rel="nofollow">Florida Department of Revenue, Documentary Stamp Tax</a> (deed and note stamps apply to exchange closings)</li>
</ul>

"""

# --------------------------------------------------------------------------
# N19: verifying agent production claims
# --------------------------------------------------------------------------

N19_TITLE = "How to Choose a Real Estate Agent in Tampa Bay"

N19_NEW = """<h2>How do you know if an agent's sales numbers are real?</h2>
<p>Every agent you interview will show you production numbers. Most of those numbers are accurate and also not answering the question you are actually asking. Here is how to read them.</p>

<h3>Individual production versus team production</h3>
<p>This is the big one. When an agent says "we closed 140 homes last year," ask one follow-up: <strong>how many did you personally close?</strong></p>
<p>A team of twelve agents closing 140 homes is a genuine accomplishment for the team. It tells you almost nothing about the person sitting across from you, who may have personally handled eight of them. If you hire that person, you get that person's experience, not the team's total.</p>
<p>This is not an argument against teams. I lead one. A good team means coverage when someone is sick, a second set of eyes on a contract, and someone available when you need a showing on short notice. The problem is only when team volume is presented as individual volume and nobody clarifies which is which.</p>
<p>So ask it plainly: how many transactions did you personally represent a client on last year, and how many did your team close in total? An honest answer to both is a good sign regardless of the numbers.</p>

<h3>Sides versus transactions versus dollar volume</h3>
<p>Three different ways to count, and they produce very different headline numbers from the same year of work.</p>
<ul>
<li><strong>A side</strong> is one half of a deal. Representing the seller is one side. Representing the buyer is one side. If an agent represents both parties in the same transaction, that is two sides from one closing.</li>
<li><strong>A transaction</strong> is one closed property.</li>
<li><strong>Dollar volume</strong> is the sum of the sale prices.</li>
</ul>
<p>Why this matters: an agent who closed 30 transactions can honestly report "60 sides" if they represented both parties often, and a different agent with 60 sides may have done 60 separate deals. Both statements are true. They describe different amounts of work.</p>
<p>Dollar volume has the same issue in reverse. An agent who sold six waterfront homes at $2.5 million each reports $15 million in volume. An agent who sold fifty homes at $300,000 each reports the same $15 million. The first agent did six transactions. The second did fifty. Neither is better, but if you are selling a $320,000 house in Riverview, the second agent has run your situation forty-four more times.</p>
<p>So the useful question is not "what was your volume." It is <strong>how many homes in my price range and my area did you personally close in the last twelve months?</strong></p>

<h3>Where to verify it</h3>
<p>You do not have to take anyone's word for it, including mine.</p>
<ul>
<li><strong>Ask for the MLS production report.</strong> Agents can pull their own closed transaction history out of the MLS. It shows addresses, prices, dates, and which side they represented. An agent who is proud of their numbers will send it without hesitating. Hesitation is the answer.</li>
<li><strong>Check the license itself.</strong> Florida license status, license type, and any disciplinary history are public through the Department of Business and Professional Regulation at myfloridalicense.com. This also tells you whether the person is a sales associate or a broker associate, and how long they have been licensed.</li>
<li><strong>Look at their actual closed listings,</strong> not their active ones. Anyone can take listings. Ask to see the last ten that closed and what the list-to-sale price ratio was on each.</li>
<li><strong>Ask for the original list price, not just the sale price.</strong> A house that sold for $400,000 looks the same in a volume report whether it was listed at $405,000 or at $465,000 and cut three times. The second one is a pricing failure wearing a sale.</li>
<li><strong>Ask for client references from the last six months,</strong> specifically from deals that did not go smoothly. Everyone has those. How an agent handled a difficult one tells you more than a wall of testimonials.</li>
</ul>

<h3>The standard agents are actually held to</h3>
<p>REALTORS are bound by the National Association of REALTORS Code of Ethics. Article 12 requires REALTORS to be honest and truthful in their real estate communications and to present a true picture in their advertising, marketing and other representations.</p>
<p>That matters practically: an agent presenting team volume as personal production, or counting sides in a way designed to mislead, is not just being slippery. They are running against the standard their own membership commits them to. You are allowed to hold them to it, and you are allowed to ask the clarifying question without apologizing for it.</p>

<h3>What I would ask me</h3>
<p>Since I am telling you to interrogate agents, here is the same standard applied to myself. Ask me how many transactions I personally closed last year, in your price range, in your area. Ask for the MLS report. Ask for the list-to-sale ratios and the original list prices. Ask what happened on the deals that went badly.</p>
<p>And ask who actually answers the phone. My answer is that you reach me directly at <a href="tel:+18137337907">(813) 733-7907</a>, not a call center and not a rotating junior agent. That is a verifiable claim too. Call it and see who picks up.</p>

"""

N19_SOURCES = """<h2>Sources</h2>
<ul>
<li><a href="https://www.nar.realtor/about-nar/governing-documents/code-of-ethics/2026-code-of-ethics-standards-of-practice" rel="nofollow">National Association of REALTORS Code of Ethics and Standards of Practice, Article 12</a> (true picture in advertising and representations)</li>
<li><a href="https://www.myfloridalicense.com/wl11.asp" rel="nofollow">Florida Department of Business and Professional Regulation licensee search</a> (license status, type and disciplinary history)</li>
<li>Fla. Stat. 475.25 (grounds for discipline, including misrepresentation); Fla. Admin. Code R. 61J2-10.025 (advertising)</li>
</ul>

"""


REALTOR_FAQ_ANCHOR = (
    '<h2 style="font-size:1.6rem;color:#1a3a5c;border-bottom:2px solid #1a3a5c;'
    'padding-bottom:8px;margin:40px 0 20px;">'
    "Frequently Asked Questions: How to Choose a Real Estate Agent</h2>"
)

# The realtor guide styles its headings and lists inline. Match it so the new
# section is visually indistinguishable from the rest of the page.
STYLED_H2 = ('<h2 style="font-size:1.6rem;color:#1a3a5c;border-bottom:2px solid #1a3a5c;'
             'padding-bottom:8px;margin:40px 0 20px;">')
STYLED_H3 = '<h3 style="font-size:1.25rem;color:#1a3a5c;margin:28px 0 12px;">'
STYLED_UL = ('<ul style="margin:0 0 24px;padding-left:24px;line-height:2.1;'
             'font-size:1.02rem;color:#333;">')


def restyle(html):
    """Swap bare tags for this guide's inline-styled equivalents."""
    html = html.replace("<h2>", STYLED_H2)
    html = html.replace("<h3>", STYLED_H3)
    html = html.replace("<ul>", STYLED_UL)
    return html


# Two pre-existing warning boxes in the realtor guide use an amber palette.
# Gold, yellow and amber are banned in this design system, so they are recolored
# to the site's navy and slate while we are already editing this file.
AMBER_TO_SLATE = {
    "#fff8e1": "#f1f5f9",  # amber tint background  -> slate-100
    "#f59e0b": "#0f172a",  # amber border           -> navy
    "#92400e": "#0f172a",  # amber label text       -> navy
    "#78350f": "#334155",  # amber body text        -> slate-700
}


def recolor(text):
    for old, new in AMBER_TO_SLATE.items():
        text = text.replace(old, new).replace(old.upper(), new)
    return text


def strip_dashes(text):
    text = re.sub(r"(\d)\s*[—–]\s*(\d)", r"\1 to \2", text)
    text = text.replace(" — ", ", ").replace("—", ",")
    text = text.replace(" – ", ", ").replace("–", " to ")
    return text


def patch(guides, slug, title, new_section, sources, anchor, recolor_amber=False):
    idx = next((i for i, g in enumerate(guides) if g["slug"] == slug), None)
    if idx is None:
        sys.exit("Guide not found: %s" % slug)
    g = guides[idx]
    content = g["content"]

    if anchor not in content:
        sys.exit("Anchor not found in %s: %s" % (slug, anchor))
    content = content.replace(anchor, new_section + anchor, 1)

    # Sources go just before the FAQ block so they sit above it, which is where
    # the other long-form pieces in this batch put them.
    content = content.replace(anchor, sources + anchor, 1)

    if recolor_amber:
        before = sum(content.count(c) for c in AMBER_TO_SLATE)
        content = recolor(content)
        print("  recolored %d amber color tokens to navy/slate" % before)

    g["title"] = strip_dashes(title)
    g["content"] = strip_dashes(content)
    guides[idx] = g

    plain = re.sub(r"<script[\s\S]*?</script>", " ", g["content"])
    plain = re.sub(r"<[^>]+>", " ", plain)
    print("Updated /guides/%s" % slug)
    print("  title: %d chars | words: %d | em dashes: %d | en dashes: %d"
          % (len(g["title"]), len(plain.split()),
             g["content"].count("—"), g["content"].count("–")))


def main():
    with open(GUIDES, encoding="utf-8") as fh:
        guides = json.load(fh)

    patch(guides, "1031-exchange-guide", N10_TITLE, N10_NEW, N10_SOURCES,
          "<h2>Frequently Asked Questions: 1031 Exchange Florida</h2>")
    # This guide uses inline-styled headings, so the new section is restyled to
    # match before insertion rather than introducing a second visual convention.
    patch(guides, "how-to-choose-a-realtor", N19_TITLE,
          restyle(N19_NEW), restyle(N19_SOURCES),
          REALTOR_FAQ_ANCHOR, recolor_amber=True)

    tmp = GUIDES + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(guides, fh, ensure_ascii=False)
    os.replace(tmp, GUIDES)


if __name__ == "__main__":
    main()
