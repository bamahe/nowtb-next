#!/usr/bin/env python3
"""
Append 7 blog posts to posts-export.json:
  - 6 x 55+ community guides (Clearwater, Largo, Sarasota, Venice, Lakeland, Spring Hill)
  - 1 x Florida Homestead Exemption pillar page
Checks for duplicate slugs before appending.
"""

import json
import sys
import os

DATA_FILE = os.path.join(
    os.path.dirname(__file__),
    "..", "src", "data", "posts-export.json"
)

# ── Post definitions ─────────────────────────────────────────────────────

DATE = "2026-08-13 10:00:00"

def cta_box(headline, subtext):
    """Mid-article CTA box — navy background, phone + form link."""
    return (
        '<div style="background:#0f172a;border-radius:12px;padding:28px 32px;margin:40px 0;text-align:center;">'
        f'<p style="color:#fff;font-size:20px;font-weight:700;margin:0 0 8px;">{headline}</p>'
        f'<p style="color:rgba(255,255,255,0.85);font-size:16px;margin:0 0 16px;">{subtext}</p>'
        '<a href="/contact/" style="display:inline-block;background:#fff;color:#0f172a;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;margin:0 8px 8px 0;">Schedule a Consultation</a>'
        '<a href="tel:8137337907" style="display:inline-block;border:2px solid rgba(255,255,255,0.4);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Call (813) 733-7907</a>'
        '</div>'
    )

def quick_answer(question, answer):
    """QuickAnswer box at top of post."""
    return (
        '<div class="bbs-quick-answer" style="background:#F2F5F7;border-left:4px solid #0f172a;padding:20px 24px;margin:0 auto 32px;border-radius:0 8px 8px 0;">'
        '<p style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Quick Answer</p>'
        f'<p style="font-size:20px;font-weight:700;line-height:1.4;color:#0f172a;margin:0 0 10px;">{question}</p>'
        f'<p style="font-size:17px;color:#374151;margin:0;">{answer}</p>'
        '</div>'
    )

def author_bio():
    return (
        '<p style="font-size:15px;color:#6b7280;line-height:1.7;margin-top:40px;border-top:1px solid #e4e4e4;padding-top:20px;">'
        '<strong style="color:#0f172a;">About Barrett Henry</strong> — Barrett Henry is a licensed REALTOR and Broker Associate with REMAX Collective, '
        'serving buyers, sellers, and investors across the greater Tampa Bay market. With 24+ years of real estate experience, '
        'Barrett brings data-driven advice and a client-first approach to every transaction. '
        '<a href="/about/" style="color:#0f172a;text-decoration:underline;">Learn more</a></p>'
    )

def disclaimer():
    return (
        '<p style="font-size:13px;color:#6b7280;line-height:1.6;font-style:italic;margin-top:16px;">'
        '<em>Disclosure: This article is for informational purposes only and does not constitute financial, legal, or tax advice. '
        'Community details, pricing, and HOA fees change regularly. Verify all information with current sources before making decisions.</em></p>'
    )

def resource_grid(links):
    """Related-pages grid at bottom of post."""
    items = ""
    for i, (href, label) in enumerate(links):
        if i == 0:
            items += f'<a href="{href}" style="display:block;background:#0f172a;border-radius:10px;padding:14px 18px;text-decoration:none;color:#fff;font-weight:600;">{label}</a>'
        else:
            items += f'<a href="{href}" style="display:block;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;text-decoration:none;color:#0f172a;font-weight:600;">{label}</a>'
    return f'<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;margin:24px 0;">{items}</div>'


def faq_schema(faqs):
    """FAQPage JSON-LD schema."""
    entities = []
    for q, a in faqs:
        entities.append({"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}})
    obj = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": entities}
    return '<script type="application/ld+json">\n' + json.dumps(obj) + '\n</script>'


# ═══════════════════════════════════════════════════════════════════════════
# 55+ COMMUNITY POSTS
# ═══════════════════════════════════════════════════════════════════════════

def build_55_plus_post(city, city_slug, communities, county, county_slug, city_hub_slug, post_id, slug):
    """
    Build an 800+ word 55+ community guide.
    communities: list of dicts with keys: name, price_low, price_high, hoa_low, hoa_high, homes, amenities, style
    """

    # -- Comparison table --
    table_rows = ""
    for i, c in enumerate(communities):
        bg = ' style="background:#f8fafc;"' if i % 2 == 1 else ""
        table_rows += (
            f'<tr{bg}>'
            f'<td style="padding:12px;font-weight:600;">{c["name"]}</td>'
            f'<td style="padding:12px;text-align:center;">${c["price_low"]:,}–${c["price_high"]:,}</td>'
            f'<td style="padding:12px;text-align:center;">${c["hoa_low"]:,}–${c["hoa_high"]:,}/mo</td>'
            f'<td style="padding:12px;">{c["homes"]}</td>'
            f'<td style="padding:12px;">{c["style"]}</td>'
            f'</tr>'
        )

    comparison_table = (
        '<table style="width:100%;border-collapse:collapse;margin:24px 0;">'
        '<thead><tr style="background:#0f172a;color:#fff;">'
        '<th style="padding:12px;text-align:left;">Community</th>'
        '<th style="padding:12px;text-align:center;">Price Range</th>'
        '<th style="padding:12px;text-align:center;">HOA/Month</th>'
        '<th style="padding:12px;text-align:left;">Home Count</th>'
        '<th style="padding:12px;text-align:left;">Home Style</th>'
        '</tr></thead>'
        f'<tbody>{table_rows}</tbody></table>'
    )

    # -- Community detail sections --
    community_sections = ""
    for c in communities:
        community_sections += (
            f'<h3 style="color:#0f172a;font-size:20px;font-weight:700;margin-top:32px;margin-bottom:12px;">{c["name"]}</h3>'
            f'<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:16px;">'
            f'{c["name"]} is a {"deed-restricted " if c.get("deed_restricted") else ""}55+ community in {city} offering '
            f'{c["style"].lower()} homes priced from <strong>${c["price_low"]:,} to ${c["price_high"]:,}</strong>. '
            f'The community includes approximately {c["homes"]} homes with HOA fees ranging from '
            f'<strong>${c["hoa_low"]:,} to ${c["hoa_high"]:,} per month</strong>, which typically cover {c["amenities"]}.</p>'
            f'<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">{c["description"]}</p>'
        )

    # -- FAQ --
    faqs = [
        (f"What 55+ communities are in {city}, FL?",
         f"{city} has several active adult communities including {', '.join(c['name'] for c in communities[:4])}. "
         f"Prices range from ${min(c['price_low'] for c in communities):,} to ${max(c['price_high'] for c in communities):,} depending on community, home size, and lot features."),
        (f"How much do 55+ homes cost in {city}?",
         f"Prices for 55+ homes in {city} generally range from ${min(c['price_low'] for c in communities):,} to "
         f"${max(c['price_high'] for c in communities):,}. HOA fees run from ${min(c['hoa_low'] for c in communities):,} to "
         f"${max(c['hoa_high'] for c in communities):,} per month and typically cover exterior maintenance, landscaping, and amenity access."),
        (f"Do 55+ communities in {city} allow pets?",
         f"Most 55+ communities in {city} allow pets with breed and size restrictions. Each community sets its own pet policy — some allow up to two pets, while others have weight limits. Always verify the current pet policy with the HOA before purchasing."),
        (f"Can someone under 55 live in a {city} 55+ community?",
         "Under federal Housing for Older Persons Act (HOPA) rules, at least 80 percent of occupied units must have one resident aged 55 or older. "
         "Younger spouses and family members can often live in the home, but rules vary by community. Check the specific community's age restriction policy."),
        (f"Does {city} have a homestead exemption?",
         f"Yes. Florida homestead exemption provides up to $50,000 in assessed value reduction on your primary residence. "
         f"Residents 65 and older may qualify for an additional senior exemption if they meet income requirements. "
         f"Apply with the {county} County Property Appraiser by March 1 of the tax year.")
    ]

    content = (
        '<div class="nowtb-post-content" style="max-width:840px;margin:0 auto;padding:0 20px;">'
        + quick_answer(
            f"What are the best 55+ communities in {city}, FL?",
            f"{city} offers {len(communities)} established active adult communities with homes ranging from "
            f"${min(c['price_low'] for c in communities):,} to ${max(c['price_high'] for c in communities):,}. "
            f"Top options include {communities[0]['name']}, {communities[1]['name']}, and {communities[2]['name']}. "
            f'Call Barrett at <a href="tel:8137337907" style="color:#2563eb;font-weight:600;">(813) 733-7907</a> for personalized guidance.'
        )

        + f'<h2>Why Are Active Adults Choosing {city}?</h2>'
        + f'<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
        + f'<strong>{city} combines Gulf Coast living with affordable active adult housing in {county} County.</strong> '
        + f'Whether you are downsizing from a larger home, relocating to Florida, or looking for a low-maintenance lifestyle near healthcare and recreation, '
        + f'{city} delivers. The area offers proximity to beaches, golf courses, medical facilities, and everyday conveniences that active adults need — '
        + f'without the premium pricing of coastal communities like Sarasota or Naples.</p>'

        + f'<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
        + f'Barrett Henry has 24+ years of real estate experience helping buyers evaluate 55+ communities across Tampa Bay '
        + f'and the surrounding counties. If you are comparing communities in <a href="/{city_hub_slug}/" style="color:#2563eb;font-weight:600;">{city}</a>, '
        + f'this guide breaks down the top options with real pricing, amenities, and HOA details.</p>'

        + f'<h2>How Do {city} 55+ Communities Compare?</h2>'
        + comparison_table

        + community_sections

        + cta_box(
            f"Exploring 55+ Living in {city}?",
            f"Barrett Henry is a licensed Broker Associate with REMAX Collective — 24+ years of real estate experience helping active adults find the right community."
        )

        + f'<h2>What Should 55+ Buyers Look for in {city}?</h2>'
        + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">When evaluating active adult communities, prioritize these factors:</p>'
        + '<ul style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
        + '<li><strong>Total monthly cost:</strong> Add HOA fees, property taxes, insurance, and any CDD assessments. Use the <a href="/mortgage-calculator/" style="color:#2563eb;font-weight:600;">mortgage calculator</a> for the full picture.</li>'
        + '<li><strong>Healthcare access:</strong> Proximity to hospitals, specialists, and urgent care matters more as you age. Check drive times to major medical centers.</li>'
        + '<li><strong>Amenity match:</strong> A resort pool is worthless if you prefer golf. Match amenities to how you actually spend your time.</li>'
        + '<li><strong>Resale potential:</strong> Some 55+ communities hold value better than others. Look at recent sales history, not just listing prices.</li>'
        + f'<li><strong>Homestead exemption:</strong> Florida homestead exemption saves you money on your primary residence. <a href="/blog/florida-homestead-exemption-guide/" style="color:#2563eb;font-weight:600;">Read the complete guide</a>.</li>'
        + '</ul>'

        + f'<h2>How Much Are Property Taxes in {county} County for 55+ Homes?</h2>'
        + f'<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
        + f'Property taxes in {county} County are based on millage rates set by the county, school board, and special districts. '
        + f'With Florida homestead exemption ($50,000 reduction on assessed value), a $300,000 home in {city} typically pays '
        + f'$3,500 to $5,500 per year in property taxes. Residents 65 and older may qualify for an additional senior exemption. '
        + f'Apply with the {county} County Property Appraiser by March 1.</p>'

        + f'<h2>Is {city} a Good Place to Retire?</h2>'
        + f'<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
        + f'{city} ranks as one of the more affordable retirement destinations in the Tampa Bay region. No state income tax, '
        + f'reasonable property taxes with homestead exemption, and a cost of living below the national average make it financially attractive. '
        + f'The area offers year-round outdoor recreation, established medical infrastructure, and a growing dining and entertainment scene. '
        + f'For active adults who want to stay engaged without the resort-community price tag, {city} is a strong option.</p>'

        + '<h2>Frequently Asked Questions</h2>'
    )

    # Add FAQ H3s
    for q, a in faqs:
        content += (
            f'<h3 style="color:#0f172a;font-size:20px;font-weight:700;margin-top:32px;margin-bottom:12px;">{q}</h3>'
            f'<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">{a}</p>'
        )

    content += resource_grid([
        (f"/{city_hub_slug}/", f"{city} Homes for Sale"),
        ("/55-plus-communities/", "All 55+ Communities"),
        ("/free-home-valuation/", "Free Home Valuation"),
        ("/mortgage-calculator/", "Mortgage Calculator"),
        ("/blog/florida-homestead-exemption-guide/", "Homestead Exemption Guide"),
        (f"/{county_slug}/", f"{county} County Real Estate"),
    ])

    content += author_bio()
    content += disclaimer()
    content += '</div>'
    content += faq_schema(faqs)

    return {
        "id": post_id,
        "slug": slug,
        "title": f"55+ Communities in {city}, FL: Active Adult Living Guide 2026",
        "date": DATE,
        "excerpt": f"Guide to the best 55+ communities in {city}, FL. Compare active adult neighborhoods, pricing from ${min(c['price_low'] for c in communities):,} to ${max(c['price_high'] for c in communities):,}, amenities, HOA fees, and lifestyle. Barrett Henry, REALTOR with REMAX Collective.",
        "content": content
    }


# ── CLEARWATER ───────────────────────────────────────────────────────────
clearwater = build_55_plus_post(
    city="Clearwater", city_slug="clearwater", post_id=9301,
    slug="55-plus-communities-clearwater-fl",
    county="Pinellas", county_slug="pinellas-county",
    city_hub_slug="clearwater",
    communities=[
        {"name": "On Top of the World", "price_low": 80000, "price_high": 250000,
         "hoa_low": 300, "hoa_high": 550, "homes": "4,800+", "style": "Single-family and villa",
         "amenities": "lawn care, cable, water, clubhouse, pools, golf",
         "deed_restricted": True,
         "description": "On Top of the World is one of the largest 55+ communities in Pinellas County, located in the northeast Clearwater area. The community features an 18-hole golf course, multiple pools, fitness center, art studios, and over 100 clubs and organizations. Homes range from affordable condos to spacious villas, making it accessible at virtually every budget level. The HOA covers extensive services including lawn care, building insurance, cable, and water, which keeps out-of-pocket costs predictable."},
        {"name": "Clearwater Point", "price_low": 150000, "price_high": 350000,
         "hoa_low": 400, "hoa_high": 650, "homes": "500+", "style": "Condo and townhome",
         "amenities": "water, cable, pool, exterior maintenance, landscaping",
         "deed_restricted": True,
         "description": "Clearwater Point is a waterfront 55+ condo community on Sand Key with direct views of Clearwater Harbor and the Intracoastal Waterway. The community offers heated pools, a clubhouse, fishing dock, and organized social activities. Units range from studios to two-bedroom floor plans. The location provides walking access to Sand Key Park and short drives to Clearwater Beach. HOA fees here are higher but cover a significant portion of monthly expenses."},
        {"name": "Regency Oaks", "price_low": 100000, "price_high": 220000,
         "hoa_low": 350, "hoa_high": 500, "homes": "1,200+", "style": "Condo and villa",
         "amenities": "lawn care, pool, clubhouse, exterior maintenance",
         "deed_restricted": True,
         "description": "Regency Oaks is a well-established 55+ community in the Countryside area of Clearwater. The community features a large clubhouse, heated pool, shuffleboard courts, and an active social calendar. Homes include both condos and villas with attached garages. The location provides convenient access to Countryside Mall, medical offices along US-19, and Clearwater Beach is about 20 minutes west."},
        {"name": "Regal Point", "price_low": 80000, "price_high": 180000,
         "hoa_low": 250, "hoa_high": 400, "homes": "300+", "style": "Condo",
         "amenities": "pool, clubhouse, exterior maintenance, landscaping",
         "deed_restricted": True,
         "description": "Regal Point is a smaller 55+ condo community in north Clearwater with an affordable entry point for active adults. The community features a heated pool, clubhouse, and well-maintained grounds. Units are mostly one and two-bedroom condos with screened lanais. Monthly HOA fees are among the lowest in the area, making this a popular choice for buyers on a fixed income."},
        {"name": "Highland Lakes", "price_low": 60000, "price_high": 150000,
         "hoa_low": 200, "hoa_high": 350, "homes": "800+", "style": "Condo",
         "amenities": "pool, clubhouse, cable, water, exterior maintenance",
         "deed_restricted": True,
         "description": "Highland Lakes is one of the most affordable 55+ communities in Clearwater, located near the Dunedin border. The community includes multiple pools, a large clubhouse, shuffleboard, and organized activities. Condos here provide a solid entry point for retirees who want Pinellas County living at a budget-friendly price. The HOA covers cable, water, and exterior maintenance."},
    ]
)

# ── LARGO ────────────────────────────────────────────────────────────────
largo = build_55_plus_post(
    city="Largo", city_slug="largo", post_id=9302,
    slug="55-plus-communities-largo-fl",
    county="Pinellas", county_slug="pinellas-county",
    city_hub_slug="largo",
    communities=[
        {"name": "Imperial Point", "price_low": 90000, "price_high": 200000,
         "hoa_low": 300, "hoa_high": 475, "homes": "500+", "style": "Condo and villa",
         "amenities": "pool, clubhouse, lawn care, exterior maintenance",
         "deed_restricted": True,
         "description": "Imperial Point is a popular 55+ community in central Largo with a heated pool, active clubhouse, and well-maintained grounds. The community offers a mix of condos and villas at price points that work for most retirees on fixed incomes. Its central Largo location puts residents within minutes of Largo Central Park, medical facilities along Ulmerton Road, and Indian Rocks Beach."},
        {"name": "Ranchero Village", "price_low": 30000, "price_high": 120000,
         "hoa_low": 600, "hoa_high": 900, "homes": "2,000+", "style": "Manufactured housing on owned lots",
         "amenities": "pool, clubhouse, fitness center, tennis, shuffleboard, activities",
         "deed_restricted": True,
         "description": "Ranchero Village is one of the largest 55+ communities in Largo with resort-style amenities including multiple pools, a fitness center, tennis courts, shuffleboard, bocce ball, and an active social calendar with daily activities. The community operates as a co-op with monthly lot fees covering extensive amenities and services. Entry prices are among the lowest in Pinellas County."},
        {"name": "Mainlands of Tamarac", "price_low": 70000, "price_high": 175000,
         "hoa_low": 250, "hoa_high": 400, "homes": "3,000+", "style": "Single-family and condo",
         "amenities": "pool, clubhouse, lawn care, cable, exterior maintenance",
         "deed_restricted": True,
         "description": "Mainlands of Tamarac is one of the largest 55+ communities in the Largo-Pinellas Park area, spanning multiple sections with thousands of homes. The community features clubhouses, heated pools, shuffleboard, and organized social events. Homes include single-family houses and condos at accessible price points. Monthly fees are reasonable and cover exterior maintenance and lawn care."},
        {"name": "Village of Largo", "price_low": 100000, "price_high": 230000,
         "hoa_low": 275, "hoa_high": 425, "homes": "400+", "style": "Villa and single-family",
         "amenities": "pool, clubhouse, lawn care, exterior maintenance",
         "deed_restricted": True,
         "description": "Village of Largo is a well-maintained 55+ community offering villas and single-family homes with attached garages. The community features a heated pool, clubhouse, and organized activities. Located near the intersection of East Bay Drive and US-19, residents have convenient access to shopping, dining, and medical facilities."},
        {"name": "Largo Mar", "price_low": 80000, "price_high": 190000,
         "hoa_low": 225, "hoa_high": 375, "homes": "250+", "style": "Condo",
         "amenities": "pool, clubhouse, exterior maintenance",
         "deed_restricted": True,
         "description": "Largo Mar is a smaller 55+ condo community in central Largo with affordable pricing and a heated pool. The community appeals to active adults looking for low-maintenance living at a budget-friendly price point. Monthly HOA fees are among the lowest in the area."},
    ]
)

# ── SARASOTA ─────────────────────────────────────────────────────────────
sarasota = build_55_plus_post(
    city="Sarasota", city_slug="sarasota", post_id=9303,
    slug="55-plus-communities-sarasota-fl",
    county="Sarasota", county_slug="sarasota-county",
    city_hub_slug="sarasota",
    communities=[
        {"name": "The Meadows", "price_low": 175000, "price_high": 500000,
         "hoa_low": 200, "hoa_high": 550, "homes": "3,400+", "style": "Condo, villa, and single-family",
         "amenities": "golf, tennis, pools, fitness center, nature trails",
         "deed_restricted": False,
         "description": "The Meadows is one of the largest planned communities in Sarasota with over 3,400 homes spread across multiple neighborhoods. While not strictly age-restricted, the community has a predominantly 55+ resident base and offers extensive amenities including a golf course, tennis center, multiple pools, fitness center, and miles of nature trails through preserved wetlands. The range of housing types from condos to single-family homes makes it accessible at multiple price points."},
        {"name": "Palm Aire", "price_low": 100000, "price_high": 350000,
         "hoa_low": 300, "hoa_high": 550, "homes": "2,500+", "style": "Condo and villa",
         "amenities": "golf, pools, clubhouse, tennis, exterior maintenance",
         "deed_restricted": True,
         "description": "Palm Aire is a large 55+ community in north Sarasota featuring a 27-hole golf course, multiple pools, tennis courts, and an active social scene. The community offers condos and villas at price points that appeal to both budget-conscious retirees and those seeking more spacious homes. Located near University Town Center for shopping and dining, Palm Aire provides established 55+ living with resort amenities."},
        {"name": "Sarasota Manatee (SERTOMA)", "price_low": 200000, "price_high": 450000,
         "hoa_low": 250, "hoa_high": 475, "homes": "800+", "style": "Single-family and villa",
         "amenities": "pool, clubhouse, lawn care, social activities",
         "deed_restricted": True,
         "description": "This established 55+ community in central Sarasota offers single-family homes and villas with an active community center, pool, and organized social events. The location provides convenient access to downtown Sarasota, Siesta Key, and the cultural amenities that make Sarasota a top retirement destination. Well-maintained homes with Florida-friendly landscaping and reasonable HOA fees."},
        {"name": "Village Walk of Sarasota", "price_low": 250000, "price_high": 450000,
         "hoa_low": 350, "hoa_high": 550, "homes": "500+", "style": "Villa and single-family",
         "amenities": "resort pool, fitness center, tennis, pickleball, bocce, lawn care",
         "deed_restricted": True,
         "description": "Village Walk is a newer 55+ community in north Sarasota offering resort-style amenities including a large pool complex, fitness center, tennis and pickleball courts, bocce ball, and a full-time activities director. Homes feature open floor plans, two-car garages, and Florida-style architecture. The HOA covers lawn care and exterior maintenance for a true maintenance-free lifestyle."},
    ]
)

# ── VENICE ───────────────────────────────────────────────────────────────
venice = build_55_plus_post(
    city="Venice", city_slug="venice", post_id=9304,
    slug="55-plus-communities-venice-fl",
    county="Sarasota", county_slug="sarasota-county",
    city_hub_slug="venice",
    communities=[
        {"name": "Venetian Falls", "price_low": 250000, "price_high": 425000,
         "hoa_low": 200, "hoa_high": 375, "homes": "700+", "style": "Single-family",
         "amenities": "resort pool, fitness center, tennis, bocce, lawn care",
         "deed_restricted": True,
         "description": "Venetian Falls is a popular 55+ community in South Venice offering single-family homes with two-car garages and open floor plans. The community features a resort-style pool, fitness center, tennis courts, bocce ball, and an active social calendar organized by a full-time lifestyle director. HOA fees cover lawn care, and the community is gated for added privacy. Located minutes from Venice Beach and downtown Venice."},
        {"name": "Sarasota National", "price_low": 300000, "price_high": 600000,
         "hoa_low": 250, "hoa_high": 500, "homes": "1,200+", "style": "Single-family",
         "amenities": "18-hole golf course, resort pool, fitness center, tennis, spa",
         "deed_restricted": True,
         "description": "Sarasota National is a master-planned 55+ community in Venice featuring an 18-hole championship golf course designed by Chip Powell. The community offers resort amenities including a large clubhouse, pool complex, fitness center, tennis courts, and a full-service spa. Homes range from paired villas to estate-size single-family residences. This is one of the more upscale 55+ options in the Venice area."},
        {"name": "Venetian Golf and River Club", "price_low": 350000, "price_high": 700000,
         "hoa_low": 300, "hoa_high": 600, "homes": "1,000+", "style": "Single-family and villa",
         "amenities": "golf, pools, fitness, tennis, river access, dining",
         "deed_restricted": True,
         "description": "Venetian Golf and River Club is an upscale 55+ community in North Venice along the Myakka River. The community features a private golf course, multiple pools, a fitness center, tennis and pickleball courts, full-service dining at the clubhouse, and kayak access to the Myakka River. Homes range from maintenance-free villas to custom single-family estates. This community appeals to active adults seeking a premium lifestyle with river and golf access."},
        {"name": "Plantation Golf and Country Club", "price_low": 150000, "price_high": 400000,
         "hoa_low": 250, "hoa_high": 500, "homes": "2,000+", "style": "Condo, villa, and single-family",
         "amenities": "36-hole golf, pools, tennis, fitness, dining",
         "deed_restricted": True,
         "description": "Plantation Golf and Country Club is one of the largest 55+ communities in Venice with 36 holes of golf, multiple pools, tennis courts, a fitness center, and full-service dining. The community offers a wide range of housing from affordable condos to spacious single-family homes, making it accessible at multiple price points. Located just east of I-75, Plantation provides resort living with easy access to Venice and Sarasota."},
    ]
)

# ── LAKELAND ─────────────────────────────────────────────────────────────
lakeland = build_55_plus_post(
    city="Lakeland", city_slug="lakeland", post_id=9305,
    slug="55-plus-communities-lakeland-fl",
    county="Polk", county_slug="polk-county",
    city_hub_slug="lakeland",
    communities=[
        {"name": "Grasslands Golf and Country Club", "price_low": 200000, "price_high": 425000,
         "hoa_low": 200, "hoa_high": 400, "homes": "900+", "style": "Single-family and villa",
         "amenities": "golf, pool, tennis, fitness center, clubhouse",
         "deed_restricted": True,
         "description": "Grasslands is a 55+ golf community in south Lakeland featuring an 18-hole championship golf course, resort-style pool, tennis courts, fitness center, and a full-service clubhouse. Homes range from maintenance-free villas to larger single-family residences with water and golf course views. The community attracts active adults who want golf lifestyle without the premium pricing found in Sarasota or Naples."},
        {"name": "Oakbridge", "price_low": 150000, "price_high": 300000,
         "hoa_low": 175, "hoa_high": 325, "homes": "500+", "style": "Single-family",
         "amenities": "pool, clubhouse, shuffleboard, lawn care",
         "deed_restricted": True,
         "description": "Oakbridge is a well-established 55+ community in south Lakeland offering affordable single-family homes with attached garages. The community features a heated pool, clubhouse with social activities, shuffleboard courts, and well-maintained grounds. Located near Lakeland Regional Health and the Lakeland Square Mall area, Oakbridge provides convenient access to everyday services at a moderate price point."},
        {"name": "Lake Gibson Village", "price_low": 100000, "price_high": 250000,
         "hoa_low": 150, "hoa_high": 275, "homes": "600+", "style": "Single-family",
         "amenities": "pool, clubhouse, shuffleboard, social activities",
         "deed_restricted": True,
         "description": "Lake Gibson Village is an affordable 55+ community in north Lakeland near Lake Gibson. The community offers single-family homes with Florida lanais and attached garages. Amenities include a heated pool, clubhouse, shuffleboard courts, and an active social calendar. Monthly HOA fees are among the lowest in the Lakeland area, making this a popular choice for retirees managing a fixed income."},
        {"name": "Sandpiper Golf and Country Club", "price_low": 150000, "price_high": 350000,
         "hoa_low": 200, "hoa_high": 375, "homes": "1,100+", "style": "Single-family and villa",
         "amenities": "golf, pool, tennis, fitness, clubhouse dining",
         "deed_restricted": True,
         "description": "Sandpiper Golf and Country Club is a large 55+ community in south Lakeland with an 18-hole golf course, resort pool, tennis courts, fitness center, and full-service clubhouse with dining. The community offers a range of home styles from villas to larger single-family homes. Located near the Polk Parkway, Sandpiper provides easy access to shopping, medical facilities, and Tampa."},
        {"name": "Carpenters Run", "price_low": 175000, "price_high": 325000,
         "hoa_low": 150, "hoa_high": 300, "homes": "400+", "style": "Single-family",
         "amenities": "pool, clubhouse, fitness, walking trails",
         "deed_restricted": True,
         "description": "Carpenters Run is a 55+ community in southwest Lakeland offering newer-construction single-family homes with open floor plans and two-car garages. The community features a pool, fitness center, clubhouse, and walking trails through preserved green spaces. Priced competitively compared to Sarasota and Tampa markets, Carpenters Run attracts relocating retirees looking for Florida living at Polk County prices."},
    ]
)

# ── SPRING HILL ──────────────────────────────────────────────────────────
spring_hill = build_55_plus_post(
    city="Spring Hill", city_slug="spring-hill", post_id=9306,
    slug="55-plus-communities-spring-hill-fl",
    county="Hernando", county_slug="hernando-county",
    city_hub_slug="spring-hill",
    communities=[
        {"name": "Timber Pines", "price_low": 150000, "price_high": 350000,
         "hoa_low": 200, "hoa_high": 400, "homes": "4,500+", "style": "Single-family and villa",
         "amenities": "27-hole golf, pools, tennis, fitness, clubhouse dining",
         "deed_restricted": True,
         "description": "Timber Pines is one of the largest 55+ communities in Hernando County with over 4,500 homes and a 27-hole golf course. The community features multiple pools, tennis courts, a fitness center, full-service clubhouse with dining, and an extensive social calendar with 100+ clubs and activities. Homes range from affordable villas to spacious single-family homes on golf course lots. Timber Pines attracts retirees seeking resort-level amenities at Hernando County prices — significantly lower than Pinellas or Sarasota."},
        {"name": "Spring Hill Communities (Sterling Hills)", "price_low": 175000, "price_high": 325000,
         "hoa_low": 175, "hoa_high": 350, "homes": "800+", "style": "Single-family",
         "amenities": "pool, clubhouse, fitness, social activities, lawn care",
         "deed_restricted": True,
         "description": "Sterling Hills is a gated 55+ community in Spring Hill offering single-family homes with two-car garages and open floor plans. The community features a heated pool, fitness center, clubhouse, and organized social activities. HOA fees cover lawn care and exterior maintenance. Located near the Suncoast Parkway for easy access to Tampa, Sterling Hills provides affordable active adult living with modern amenities."},
        {"name": "Heritage Pines", "price_low": 175000, "price_high": 375000,
         "hoa_low": 200, "hoa_high": 400, "homes": "1,500+", "style": "Single-family and villa",
         "amenities": "18-hole golf, pool, tennis, fitness, clubhouse",
         "deed_restricted": True,
         "description": "Heritage Pines is a 55+ golf community in the Hudson-Spring Hill area featuring an 18-hole championship golf course, resort pool, tennis courts, fitness center, and an active clubhouse. Homes include maintenance-free villas and single-family residences. The community is located near the intersection of US-19 and SR-52, providing access to shopping, dining, and Bayonet Point Regional Medical Center."},
        {"name": "Country Lakes", "price_low": 100000, "price_high": 225000,
         "hoa_low": 150, "hoa_high": 275, "homes": "600+", "style": "Single-family",
         "amenities": "pool, clubhouse, shuffleboard, social activities",
         "deed_restricted": True,
         "description": "Country Lakes is an affordable 55+ community in central Spring Hill offering single-family homes at some of the lowest prices in the Tampa Bay region. The community features a heated pool, clubhouse, shuffleboard, and organized social activities. Monthly HOA fees are very low, making this a practical choice for retirees on fixed incomes who want community amenities without high monthly costs."},
        {"name": "High Point", "price_low": 80000, "price_high": 175000,
         "hoa_low": 100, "hoa_high": 250, "homes": "2,000+", "style": "Condo and villa",
         "amenities": "pool, clubhouse, shuffleboard, social activities",
         "deed_restricted": True,
         "description": "High Point is one of the most affordable 55+ options in the Spring Hill area, offering condos and villas at entry-level prices. The community includes a heated pool, clubhouse, shuffleboard courts, and regular social events. HOA fees are among the lowest in Hernando County. For retirees looking for basic community living at the lowest possible cost, High Point delivers."},
    ]
)


# ═══════════════════════════════════════════════════════════════════════════
# FLORIDA HOMESTEAD EXEMPTION PILLAR (1500+ words)
# ═══════════════════════════════════════════════════════════════════════════

homestead_faqs = [
    ("What is the Florida homestead exemption?",
     "The Florida homestead exemption reduces the taxable assessed value of your primary residence by up to $50,000. The first $25,000 applies to all property taxes including school district taxes. The second $25,000 applies to assessed values between $50,000 and $75,000 and exempts non-school taxes only. This is authorized by Florida Statute 196.031."),
    ("When is the deadline to apply for Florida homestead exemption?",
     "The deadline is March 1 of the tax year. For example, to receive the exemption on your 2026 tax bill, you must apply by March 1, 2026. Late applications may be accepted up to the 25th day after mailing of the TRIM notice, but applying by March 1 guarantees processing."),
    ("How does Save Our Homes cap work?",
     "Once you have homestead exemption, the Save Our Homes amendment (Article VII, Section 4 of the Florida Constitution) caps your assessed value increase to 3 percent per year or the Consumer Price Index, whichever is lower. This cap does not apply to the actual market value — only the assessed value used for tax calculation. Over time, this creates significant savings as market values rise faster than your capped assessment."),
    ("Can I transfer my Save Our Homes benefit to a new home?",
     "Yes. Florida portability allows you to transfer up to $500,000 of your Save Our Homes benefit to a new homestead property anywhere in Florida. You must apply for homestead exemption on the new property within 3 years of abandoning the old one. File the portability application (DR-501T) with your county property appraiser when you apply for homestead on the new home."),
    ("Do I qualify for additional senior homestead exemption?",
     "Florida residents 65 and older may qualify for an additional homestead exemption if their adjusted gross household income does not exceed a set limit (approximately $36,614 for 2026, adjusted annually). This additional exemption can reduce or eliminate the remaining assessed value for county and city taxes. Apply with your county property appraiser and provide proof of age and income."),
    ("What happens if I have a homestead exemption and rent out my home?",
     "If you rent out your homesteaded property, you may lose your homestead exemption. Florida law requires the property to be your permanent residence as of January 1 of the tax year. Renting the property — even seasonally — can trigger loss of exemption. Consult with your county property appraiser before renting to understand the implications."),
]

# County millage rate table
millage_table = (
    '<table style="width:100%;border-collapse:collapse;margin:24px 0;">'
    '<thead><tr style="background:#0f172a;color:#fff;">'
    '<th style="padding:12px;text-align:left;">County</th>'
    '<th style="padding:12px;text-align:center;">Approx. Total Millage</th>'
    '<th style="padding:12px;text-align:center;">Tax on $300K Home (with Homestead)</th>'
    '<th style="padding:12px;text-align:left;">Property Appraiser</th>'
    '</tr></thead>'
    '<tbody>'
    '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:12px;font-weight:600;">Hillsborough</td><td style="padding:12px;text-align:center;">~19.5 mills</td><td style="padding:12px;text-align:center;">~$4,875</td><td style="padding:12px;"><a href="https://www.hcpafl.org" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">hcpafl.org</a></td></tr>'
    '<tr style="border-bottom:1px solid #e2e8f0;background:#f8fafc;"><td style="padding:12px;font-weight:600;">Pinellas</td><td style="padding:12px;text-align:center;">~19.0 mills</td><td style="padding:12px;text-align:center;">~$4,750</td><td style="padding:12px;"><a href="https://www.pcpao.gov" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">pcpao.gov</a></td></tr>'
    '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:12px;font-weight:600;">Pasco</td><td style="padding:12px;text-align:center;">~18.5 mills</td><td style="padding:12px;text-align:center;">~$4,625</td><td style="padding:12px;"><a href="https://www.pascopa.com" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">pascopa.com</a></td></tr>'
    '<tr style="border-bottom:1px solid #e2e8f0;background:#f8fafc;"><td style="padding:12px;font-weight:600;">Polk</td><td style="padding:12px;text-align:center;">~18.0 mills</td><td style="padding:12px;text-align:center;">~$4,500</td><td style="padding:12px;"><a href="https://www.polkpa.org" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">polkpa.org</a></td></tr>'
    '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:12px;font-weight:600;">Manatee</td><td style="padding:12px;text-align:center;">~17.5 mills</td><td style="padding:12px;text-align:center;">~$4,375</td><td style="padding:12px;"><a href="https://www.manateepao.com" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">manateepao.com</a></td></tr>'
    '<tr style="border-bottom:1px solid #e2e8f0;background:#f8fafc;"><td style="padding:12px;font-weight:600;">Sarasota</td><td style="padding:12px;text-align:center;">~16.5 mills</td><td style="padding:12px;text-align:center;">~$4,125</td><td style="padding:12px;"><a href="https://www.sc-pa.com" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">sc-pa.com</a></td></tr>'
    '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:12px;font-weight:600;">Hernando</td><td style="padding:12px;text-align:center;">~17.0 mills</td><td style="padding:12px;text-align:center;">~$4,250</td><td style="padding:12px;"><a href="https://www.hernandopa-fl.us" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">hernandopa-fl.us</a></td></tr>'
    '<tr><td style="padding:12px;font-weight:600;">Citrus</td><td style="padding:12px;text-align:center;">~16.0 mills</td><td style="padding:12px;text-align:center;">~$4,000</td><td style="padding:12px;"><a href="https://www.citruspa.org" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">citruspa.org</a></td></tr>'
    '</tbody></table>'
    '<p style="font-size:14px;color:#6b7280;margin-top:8px;"><em>Note: Millage rates are approximate and vary by taxing district within each county. '
    'Actual tax amounts depend on your specific location, any additional municipal or special district millage, and whether you have CDD assessments. '
    'Verify current rates with your county property appraiser.</em></p>'
)

homestead_content = (
    '<div class="nowtb-post-content" style="max-width:840px;margin:0 auto;padding:0 20px;">'

    + quick_answer(
        "What is the Florida homestead exemption and how much does it save?",
        'The Florida homestead exemption reduces the taxable assessed value of your primary residence by up to <strong>$50,000</strong>, '
        'saving most homeowners <strong>$750 to $1,000+ per year</strong> in property taxes. You must apply with your county property appraiser by '
        '<strong>March 1</strong> of the tax year. The exemption also activates the <strong>Save Our Homes</strong> assessment cap, which limits '
        'annual assessed value increases to 3 percent or CPI — whichever is lower. According to '
        '<a href="http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0100-0199/0196/Sections/0196.031.html" '
        'target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;">Florida Statute 196.031</a>, '
        'the exemption applies to the first $25,000 of assessed value (all taxes) and an additional $25,000 for values between $50,000 and $75,000 (non-school taxes only).'
    )

    + '<h2>How Does the Florida Homestead Exemption Work?</h2>'
    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + 'The Florida homestead exemption is one of the most valuable tax benefits available to Florida homeowners. '
    + 'It reduces the assessed value of your primary residence for property tax purposes, and it unlocks the Save Our Homes cap '
    + 'that protects you from large annual tax increases. Understanding how it works — and applying correctly — can save you '
    + 'thousands of dollars over the life of your homeownership.</p>'

    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + 'Here is how the $50,000 exemption breaks down:</p>'
    + '<ul style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + '<li><strong>First $25,000:</strong> Applies to ALL property taxes, including school district taxes. This exempts the first $25,000 of your assessed value from every taxing authority.</li>'
    + '<li><strong>Second $25,000:</strong> Applies to assessed values between $50,000 and $75,000, but ONLY for non-school taxes (county, city, special districts). School district taxes are still calculated on this portion.</li>'
    + '<li><strong>The gap:</strong> Assessed value between $25,000 and $50,000 receives no additional exemption. This is by design in the Florida Constitution.</li>'
    + '</ul>'

    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + '<strong>Example:</strong> On a home with a $300,000 assessed value, the homestead exemption reduces your taxable value to $250,000 for non-school taxes '
    + 'and $275,000 for school taxes. At a typical combined millage rate of 18-20 mills, that saves you approximately $750 to $1,000+ per year.</p>'

    + '<h2>What Is the Save Our Homes Cap?</h2>'
    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + 'The Save Our Homes amendment (Article VII, Section 4, Florida Constitution) is arguably even more valuable than the exemption itself. '
    + 'Once you have homestead exemption, your assessed value can increase by no more than <strong>3 percent per year or the Consumer Price Index (CPI), '
    + 'whichever is lower</strong>. This cap applies regardless of how much the market value of your home increases.</p>'

    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + '<strong>Why this matters:</strong> In a hot market where home values jump 10-15 percent in a year, your assessed value (and therefore your property taxes) '
    + 'only goes up 3 percent. Over 5, 10, or 20 years of ownership, the gap between market value and assessed value can grow to tens of thousands of dollars — '
    + 'sometimes hundreds of thousands. Long-term Florida homeowners benefit enormously from this protection.</p>'

    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + '<strong>Important:</strong> The Save Our Homes cap resets when property changes ownership. When you buy a home, the assessed value resets to '
    + 'market value, and your cap starts fresh. This is why a long-time owner might pay $2,000/year in taxes on a home that a new buyer would pay $6,000/year on — '
    + 'the previous owner had decades of capped assessments.</p>'

    + '<h2>How to Apply for Homestead Exemption: Step by Step</h2>'
    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">Follow these steps to file your homestead exemption application:</p>'

    + '<h3 style="color:#0f172a;font-size:20px;font-weight:700;margin-top:24px;margin-bottom:12px;">Step 1: Establish Florida Residency</h3>'
    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + 'You must be a permanent Florida resident as of January 1 of the tax year. This means having a Florida driver license or ID card, '
    + 'registering to vote in Florida, and declaring Florida as your legal domicile. If you moved from another state, you must surrender your '
    + 'previous state driver license and cancel any homestead or similar exemptions in your former state.</p>'

    + '<h3 style="color:#0f172a;font-size:20px;font-weight:700;margin-top:24px;margin-bottom:12px;">Step 2: Gather Required Documents</h3>'
    + '<ul style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + '<li>Florida driver license or Florida ID card (with property address)</li>'
    + '<li>Social Security number</li>'
    + '<li>Vehicle registration showing Florida address</li>'
    + '<li>Voter registration (optional but strongly recommended)</li>'
    + '<li>Recorded deed or tax bill showing ownership</li>'
    + '<li>If applicable: declaration of domicile filed with the county clerk</li>'
    + '</ul>'

    + '<h3 style="color:#0f172a;font-size:20px;font-weight:700;margin-top:24px;margin-bottom:12px;">Step 3: Apply by March 1</h3>'
    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + 'File your application with your county property appraiser. Most counties accept online applications through their website. '
    + 'You can also apply in person or by mail. The deadline is <strong>March 1 of the tax year</strong>. If you close on a home in January, '
    + 'you have until March 1 of that same year to apply. If you close after January 1, you will need to wait until the following year.</p>'

    + '<h3 style="color:#0f172a;font-size:20px;font-weight:700;margin-top:24px;margin-bottom:12px;">Step 4: Verify Approval</h3>'
    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + 'You will receive a TRIM (Truth in Millage) notice in August showing your assessed value and exemptions. Verify that the homestead exemption '
    + 'appears on your notice. If it does not, contact your county property appraiser immediately — you have 25 days from the mailing date to file a late application.</p>'

    + cta_box(
        "Have Questions About Homestead Exemption?",
        "Barrett Henry — 24+ years of real estate experience helping Florida homeowners navigate taxes, exemptions, and property ownership."
    )

    + '<h2>What Is Homestead Portability?</h2>'
    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + 'Portability allows you to transfer up to <strong>$500,000</strong> of your accumulated Save Our Homes benefit to a new homestead property '
    + 'anywhere in Florida. This is one of the most powerful tax advantages for Florida homeowners who are moving within the state.</p>'

    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + '<strong>How it works:</strong> Your Save Our Homes benefit is the difference between your home\'s market value and its assessed value. '
    + 'If your home has a market value of $400,000 but an assessed value of $250,000, your Save Our Homes benefit is $150,000. '
    + 'When you sell and buy a new home, you can transfer that $150,000 benefit to the new property, effectively starting with a lower assessed value.</p>'

    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + '<strong>Rules for portability:</strong></p>'
    + '<ul style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + '<li>You must apply for homestead on the new property within <strong>3 tax years</strong> of abandoning the old homestead</li>'
    + '<li>File form <strong>DR-501T</strong> (Transfer of Homestead Assessment Difference) with your county property appraiser</li>'
    + '<li>If the new home costs more than the old one, the full benefit transfers as a dollar amount</li>'
    + '<li>If the new home costs less, the benefit is prorated based on the ratio of the new just value to the old just value</li>'
    + '<li>Maximum transfer is $500,000</li>'
    + '</ul>'

    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + 'Portability is particularly valuable for longtime Florida homeowners who have accumulated large Save Our Homes benefits. '
    + 'Without portability, selling your home and buying a new one would mean losing years of capped assessments and paying significantly higher property taxes '
    + 'on the new home. According to <a href="http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0100-0199/0193/Sections/0193.155.html" '
    + 'target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;">Florida Statute 193.155</a>, portability allows homeowners to carry '
    + 'their tax savings with them.</p>'

    + '<h2>County-by-County Millage Rates in Tampa Bay</h2>'
    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + 'Property tax rates vary significantly by county. The table below shows approximate total millage rates and estimated annual taxes on a $300,000 home '
    + 'with homestead exemption across Tampa Bay area counties:</p>'
    + millage_table

    + '<h2>What Additional Exemptions Are Available?</h2>'
    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">Beyond the standard homestead exemption, Florida offers several additional exemptions:</p>'
    + '<ul style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + '<li><strong>Senior Exemption (65+):</strong> Additional exemption for homeowners 65 and older with household income below approximately $36,614 (adjusted annually). Can reduce or eliminate remaining assessed value for county and city taxes.</li>'
    + '<li><strong>Disabled Veteran Exemption:</strong> Veterans with a service-connected disability of 10 percent or more may qualify for additional exemptions. Veterans rated 100 percent permanently disabled receive a full property tax exemption on their homestead.</li>'
    + '<li><strong>Widow/Widower Exemption:</strong> $500 exemption for widows and widowers who have not remarried.</li>'
    + '<li><strong>Disability Exemption:</strong> $500 exemption for persons with permanent disabilities.</li>'
    + '<li><strong>First Responder Exemption:</strong> Full property tax exemption for first responders totally and permanently disabled in the line of duty.</li>'
    + '</ul>'

    + '<h2>Common Mistakes That Cost Homeowners Money</h2>'
    + '<ul style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + '<li><strong>Missing the March 1 deadline:</strong> Late applications may be accepted but are not guaranteed. Set a calendar reminder for February.</li>'
    + '<li><strong>Not canceling your old state exemption:</strong> Some states check reciprocity. Having a homestead exemption in two states simultaneously is fraud under Florida law.</li>'
    + '<li><strong>Forgetting to apply portability:</strong> If you are buying a new Florida home and had homestead on your previous one, file the DR-501T form. This must be done with the new homestead application — you cannot go back and add it later.</li>'
    + '<li><strong>Renting your homesteaded property:</strong> Even seasonal or partial-year rentals can trigger loss of homestead exemption. Consult your property appraiser before listing on Airbnb or VRBO.</li>'
    + '<li><strong>Not updating your address:</strong> Your Florida driver license must show your homestead property address. If you still have an old address on your license, update it before applying.</li>'
    + '</ul>'

    + '<h2>How Homestead Exemption Affects Buying and Selling</h2>'
    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + 'When buying a home in Florida, understand that the property taxes shown on the listing may reflect the previous owner\'s homestead exemption and '
    + 'Save Our Homes cap. Your taxes as a new owner will likely be higher because the assessed value resets to market value upon sale. '
    + 'Always calculate your estimated taxes based on the full market value, not the seller\'s current tax bill.</p>'

    + '<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + 'When selling, remember that your Save Our Homes benefit disappears when you sell — unless you use portability to transfer it to a new Florida home. '
    + 'If you have been in your home for 10+ years and have a significant Save Our Homes benefit, run the numbers on portability before deciding to sell. '
    + 'Barrett Henry helps buyers and sellers understand the tax implications of every transaction. Call <a href="tel:8137337907" style="color:#2563eb;font-weight:600;">(813) 733-7907</a> for guidance.</p>'

    + '<h2>Sources and Official References</h2>'
    + '<ul style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">'
    + '<li><a href="http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0100-0199/0196/Sections/0196.031.html" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;">Florida Statute 196.031</a> — Homestead exemption authorization</li>'
    + '<li><a href="http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0100-0199/0193/Sections/0193.155.html" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;">Florida Statute 193.155</a> — Save Our Homes assessment limitation and portability</li>'
    + '<li><a href="http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0100-0199/0196/Sections/0196.075.html" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;">Florida Statute 196.075</a> — Additional homestead exemption for persons 65 and older</li>'
    + '<li>Article VII, Section 4, Florida Constitution — Assessment limitation (Save Our Homes)</li>'
    + '<li>Article VII, Section 6, Florida Constitution — Homestead exemptions</li>'
    + '</ul>'

    + '<h2>Frequently Asked Questions</h2>'
)

for q, a in homestead_faqs:
    homestead_content += (
        f'<h3 style="color:#0f172a;font-size:20px;font-weight:700;margin-top:32px;margin-bottom:12px;">{q}</h3>'
        f'<p style="font-size:18px;line-height:1.8;color:#374151;margin-bottom:20px;">{a}</p>'
    )

homestead_content += resource_grid([
    ("/guides/florida-homestead-exemption-save-our-homes/", "Homestead & Save Our Homes"),
    ("/free-home-valuation/", "Free Home Valuation"),
    ("/mortgage-calculator/", "Mortgage Calculator"),
    ("/blog/how-to-find-cdd-fees-florida-home/", "CDD Fees Guide"),
    ("/55-plus-communities/", "55+ Communities"),
    ("/contact/", "Contact Barrett"),
])

homestead_content += author_bio()
homestead_content += disclaimer()
homestead_content += '</div>'
homestead_content += faq_schema(homestead_faqs)

homestead_post = {
    "id": 9307,
    "slug": "florida-homestead-exemption-guide",
    "title": "Florida Homestead Exemption: Complete Guide for Homeowners in 2026",
    "date": DATE,
    "excerpt": "Complete guide to Florida homestead exemption — $50,000 assessed value reduction, Save Our Homes cap, portability rules, March 1 deadline, county-by-county millage rates, and step-by-step application. Barrett Henry, REALTOR with REMAX Collective.",
    "content": homestead_content
}


# ═══════════════════════════════════════════════════════════════════════════
# MAIN: Read JSON, check for duplicates, append
# ═══════════════════════════════════════════════════════════════════════════

def main():
    data_path = os.path.abspath(DATA_FILE)
    print(f"Reading {data_path} ...")

    with open(data_path, "r", encoding="utf-8") as f:
        posts = json.load(f)

    print(f"  Existing posts: {len(posts)}")

    new_posts = [clearwater, largo, sarasota, venice, lakeland, spring_hill, homestead_post]

    # Check for duplicate slugs
    existing_slugs = {p["slug"] for p in posts}
    for np in new_posts:
        if np["slug"] in existing_slugs:
            print(f"  ERROR: Duplicate slug found: {np['slug']} — aborting.")
            sys.exit(1)
        existing_slugs.add(np["slug"])

    # Check for duplicate IDs
    existing_ids = {p["id"] for p in posts}
    for np in new_posts:
        if np["id"] in existing_ids:
            print(f"  ERROR: Duplicate id found: {np['id']} — aborting.")
            sys.exit(1)
        existing_ids.add(np["id"])

    posts.extend(new_posts)
    print(f"  New total: {len(posts)}")

    with open(data_path, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print("Done. 7 posts appended successfully.")
    for np in new_posts:
        wc = len(np["content"].split())
        print(f"  {np['slug']}  ({wc} words)")


if __name__ == "__main__":
    main()
