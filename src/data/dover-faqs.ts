// =============================================================================
// Dover FAQs
//
// Dover was the thinnest of the core city pages — ~2,000 words against 6,500+
// for Brandon, Lithia, Plant City, Riverview, Seffner, and Valrico. It had no
// city-specific FAQ entry, so it fell through to the generic hub fallback.
//
// Every number below comes from the active Stellar MLS inventory for ZIP 33527
// pulled 2026-08-15 (60 active listings). Figures are described as approximate
// and tied to a date, because inventory moves — do not restate them as fixed.
// =============================================================================

import type { CityFAQ } from "./valrico-faqs";

export const DOVER_FAQS: Record<string, CityFAQ[]> = {
  dover: [
    {
      question: "What makes Dover different from Brandon or Valrico?",
      answer:
        "Lot size, mostly. Dover is the acreage pocket of eastern Hillsborough County — of the roughly 60 homes active in ZIP 33527 in August 2026, about two thirds sat on an acre or more, with a median lot right around one acre. Brandon and Valrico are largely subdivision living on quarter-acre lots. If you want room for a shop, a barn, horses, or an RV without leaving the Tampa commute shed, Dover is where that inventory actually is.",
      answerHtml:
        'Lot size, mostly. Dover is the acreage pocket of eastern Hillsborough County — of the roughly 60 homes active in ZIP 33527 in August 2026, about two thirds sat on an acre or more, with a median lot right around one acre. <a href="/brandon/" class="text-link hover:underline">Brandon</a> and <a href="/valrico/" class="text-link hover:underline">Valrico</a> are largely subdivision living on quarter-acre lots. If you want room for a shop, a barn, horses, or an RV without leaving the Tampa commute shed, Dover is where that inventory actually is.',
    },
    {
      question: "How much do homes cost in Dover FL?",
      answer:
        "In August 2026 the median asking price across active Dover listings was roughly $505,000, on a median of about 2,300 square feet. The spread is unusually wide for a single ZIP — from around $120,000 at the low end to several million for large agricultural parcels — because Dover mixes modest older homes, newer acreage builds, and working farmland in the same market. That means a median tells you less here than it does elsewhere; the specific parcel matters more than the average.",
      answerHtml:
        'In August 2026 the median asking price across active Dover listings was roughly <strong>$505,000</strong>, on a median of about 2,300 square feet. The spread is unusually wide for a single ZIP — from around $120,000 at the low end to several million for large agricultural parcels — because Dover mixes modest older homes, newer acreage builds, and working farmland in the same market. That means a median tells you less here than it does elsewhere; the specific parcel matters more than the average.',
    },
    {
      question: "Is Dover FL a good place to buy land or acreage?",
      answer:
        "It is one of the few places this close to Tampa where acreage is still routinely available. Because most Dover parcels are an acre or larger, buyers looking for horse property, hobby farms, workshop space, or room to park equipment tend to end up here rather than in the subdivision markets to the west. Two things to verify before you write an offer: the zoning and land-use designation on that specific parcel, and whether it is on well and septic rather than public utilities. Both vary property to property in Dover in a way they do not in a platted subdivision.",
      answerHtml:
        'It is one of the few places this close to Tampa where acreage is still routinely available. Because most Dover parcels are an acre or larger, buyers looking for horse property, hobby farms, workshop space, or room to park equipment tend to end up here rather than in the subdivision markets to the west. Two things to verify before you write an offer: the <strong>zoning and land-use designation</strong> on that specific parcel, and whether it is on <strong>well and septic</strong> rather than public utilities. Both vary property to property in Dover in a way they do not in a platted subdivision.',
    },
    {
      question: "Where is Dover FL and how is the commute?",
      answer:
        "Dover sits in eastern Hillsborough County between Brandon and Plant City, with ZIP code 33527. It has direct access to both I-4 and SR-60, which is what keeps it commutable despite the rural feel — Brandon is a short drive west, Plant City is just east, and downtown Tampa is reachable via I-4. Actual drive times swing a lot with I-4 traffic and where in Dover you are, so time the specific route at the hour you would really be driving it before committing.",
      answerHtml:
        'Dover sits in eastern Hillsborough County between <a href="/brandon/" class="text-link hover:underline">Brandon</a> and <a href="/plant-city/" class="text-link hover:underline">Plant City</a>, with ZIP code 33527. It has direct access to both <strong>I-4</strong> and <strong>SR-60</strong>, which is what keeps it commutable despite the rural feel — Brandon is a short drive west, Plant City is just east, and downtown Tampa is reachable via I-4. Actual drive times swing a lot with I-4 traffic and where in Dover you are, so time the specific route at the hour you would really be driving it before committing.',
    },
    {
      question: "Do Dover homes have well water and septic systems?",
      answer:
        "Many do, and it is the single most common surprise for buyers coming from a subdivision. Public water and sewer do not reach every part of Dover, so a large share of acreage properties run on private well and septic. Neither is a problem — but both should be inspected separately from the standard home inspection. Budget for a water quality test and a septic inspection with the tank pumped so the inspector can actually see the condition, and ask when the drainfield was last replaced.",
      answerHtml:
        'Many do, and it is the single most common surprise for buyers coming from a subdivision. Public water and sewer do not reach every part of Dover, so a large share of acreage properties run on <strong>private well and septic</strong>. Neither is a problem — but both should be inspected separately from the standard home inspection. Budget for a <strong>water quality test</strong> and a <strong>septic inspection with the tank pumped</strong> so the inspector can actually see the condition, and ask when the drainfield was last replaced.',
    },
    {
      question: "Does Dover FL have HOAs?",
      answer:
        "Far less often than the surrounding areas. Much of Dover is unplatted acreage that was never organized into an HOA community, which is a large part of why buyers who want to park a boat, run a home business, or put up outbuildings look here. That freedom comes with the flip side: without an HOA there is no architectural control over what a neighbor does either. County zoning is the governing constraint, so check the zoning on both your parcel and the ones around it.",
      answerHtml:
        'Far less often than the surrounding areas. Much of Dover is unplatted acreage that was never organized into an HOA community, which is a large part of why buyers who want to park a boat, run a home business, or put up outbuildings look here. That freedom comes with the flip side: without an HOA there is no architectural control over what a neighbor does either. <strong>County zoning</strong> is the governing constraint, so check the zoning on both your parcel and the ones around it.',
    },
    {
      question: "How long do homes take to sell in Dover?",
      answer:
        "Generally longer than in Brandon or Riverview, and that is a function of the buyer pool rather than desirability. Acreage properties appeal to a narrower set of buyers, and financing an unusual parcel — one with agricultural zoning, outbuildings, or a large amount of land relative to the house — can take more work than a standard subdivision purchase. Sellers should plan for a longer marketing window. Buyers often have more room to negotiate here than they do a few miles west.",
      answerHtml:
        'Generally longer than in <a href="/brandon/" class="text-link hover:underline">Brandon</a> or <a href="/riverview/" class="text-link hover:underline">Riverview</a>, and that is a function of the buyer pool rather than desirability. Acreage properties appeal to a narrower set of buyers, and financing an unusual parcel — one with agricultural zoning, outbuildings, or a large amount of land relative to the house — can take more work than a standard subdivision purchase. Sellers should plan for a longer marketing window. Buyers often have more room to negotiate here than they do a few miles west.',
    },
    {
      question: "What should I check before buying acreage in Dover?",
      answer:
        "Five things, in this order: the zoning and permitted uses on that exact parcel; whether it is on well and septic or public utilities; the flood zone designation, since rural parcels can include low-lying ground; access and easements, because some parcels are reached by shared or unpaved drives; and whether any agricultural classification on the property affects the tax picture once you take ownership. None of these are dealbreakers on their own, but every one of them can change what the property is worth to you — and none show up on a listing photo.",
      answerHtml:
        'Five things, in this order: the <strong>zoning and permitted uses</strong> on that exact parcel; whether it is on <strong>well and septic</strong> or public utilities; the <strong>flood zone designation</strong>, since rural parcels can include low-lying ground; <strong>access and easements</strong>, because some parcels are reached by shared or unpaved drives; and whether any <strong>agricultural classification</strong> on the property affects the tax picture once you take ownership. None of these are dealbreakers on their own, but every one of them can change what the property is worth to you — and none show up on a listing photo.',
    },
  ],
};
