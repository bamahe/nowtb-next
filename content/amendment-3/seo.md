## URL slug

**`/guides/florida-amendment-3-property-tax`**

Put it under `/guides/` deliberately. New **top-level** routes on nowtb.com 404 on the live domain until they are excluded from BOTH `:city` flatten redirects in `next.config`. `/guides/[slug]` already resolves, already has a template, and already carries internal authority from 40+ sibling guides. Do not use a dated or year-stamped slug. This page gets updated through the vote and after it, and the URL has to survive 2027.

Canonical: `https://www.nowtb.com/guides/florida-amendment-3-property-tax`

## Title tag

The layout template appends `" | Barrett Henry, REALTOR®"` which is **26 characters**. That leaves only 33 characters of raw title under a 60 char budget, which is not enough for this keyword.

**Recommended: bypass the template with an absolute title.**

```ts
title: { absolute: "Florida Amendment 3: Property Tax Guide 2026" }
```
44 characters rendered. Keyword first, year included, intent clear.

**If you refuse to override the template**, use raw title `Florida Amendment 3: 2026 Guide` (31 raw, 57 rendered). It is weaker, because "property tax" is the modifier most searches carry.

## Meta description

```
Florida Amendment 3 on the November 3, 2026 ballot: new homestead exemption, 5% cap, real savings math. See what it means for your home.
```
136 characters.

## H1

```
Florida Amendment 3: What the 2026 Property Tax Amendment Actually Does
```

One H1. Do not repeat the title tag verbatim, and do not use the struck "Save Our Homes From Excessive Property Taxes" slogan anywhere on the page as a heading. That language is legally dead and quoting it as a heading is exactly the mistake the rest of the SERP is making.

## H2s, in order

1. What is Florida Amendment 3 and when do I vote on it?
2. What exactly will the ballot say on November 3, 2026?
3. Why did a judge throw out the original ballot language?
4. What is Florida's homestead exemption worth right now?
5. What would the new homestead exemption be under Amendment 3?
6. Does the new exemption stack on top of the current one, or replace it?
7. How much would Amendment 3 actually save me in 2027 and 2028?
8. When do the inflation adjustments start, and which ones?
9. What happens if I move to Florida after December 31, 2026?
10. I am relocating now but have not bought a house yet. Do I still qualify?
11. Can a county or city shorten the five-year waiting period?
12. How does Amendment 3 change the cap on non-homestead property?
13. Does the 5% cap mean lower taxes on my rental property?
14. What does Amendment 3 NOT change?
15. What could counties and cities spend property tax money on?
16. Could my homestead exemption eventually wipe out my entire tax bill?
17. Does Amendment 3 protect police, fire, and EMS funding?
18. Why might your tax bill not go down even if Amendment 3 passes?
19. Does the bigger exemption reduce your fire, stormwater, and trash fees?
20. What would Amendment 3 cost local governments?
21. Could the five-year rule for new residents be struck down in court?
22. When would you actually see the savings on a tax bill?
23. What does Amendment 3 mean if you are buying or selling in Tampa Bay?
24. Frequently asked questions about Florida Amendment 3

Sections 2, 3, 6, 11, 18, 19, and 21 are the ones no competitor covers. They are deliberately placed high enough to be scraped, not buried at the bottom.

## Schema to emit

Required, already in `src/lib/schema.tsx`:
- **Article** via `articleSchema()` with full `author` Person (jobTitle, image, sameAs, hasCredential for BK3313308), `datePublished`, and `dateModified` that you actually bump on every edit
- **FAQPage** via `faqSchema()` on sections 23 and 24, 10 to 12 questions
- **BreadcrumbList** via `breadcrumbSchema()`: Home → Guides → Florida Amendment 3

Add for this page specifically:
- **`citation`** array on the Article node pointing at the enrolled CS/HJR 1F PDF, the PCPAO FAQ PDF, and the Volusia amendment guide PDF. This is the single highest-leverage AEO addition. It tells answer engines where the claims came from.
- **`about`: Legislation** node (`schema.org/Legislation`) with `legislationIdentifier: "CS/HJR 1F"`, `legislationJurisdiction: "Florida"`, `legislationDate`, `legislationType: "Joint Resolution"`, and `legislationPassedBy` the Florida Legislature. Nobody in this SERP marks the measure up as an entity.
- **WebPage** wrapper with `lastReviewed` and `reviewedBy` pointing at Barrett's Person node. Direct E-E-A-T signal on a YMYL page.
- **`speakable`** SpeakableSpecification on the H1 and the first answer paragraph.
- **Event** node for the November 3, 2026 Florida General Election, `eventAttendanceMode: OfflineEventAttendanceMode`, location Florida. Gives the date an extractable entity.
- **ItemList** for the seven permitted ad valorem uses. Seven enumerated items is exactly the shape AI Overviews lift.
- Site-wide `realEstateAgentSchema()` stays as is.

Skip ClaimReview. It requires fact-check publisher standards and will get the page flagged, not rewarded.

## 10 internal links

All verified to exist in the repo. Anchor text matters as much as the link.

| Link | Anchor text | Placed in |
|---|---|---|
| `/guides/florida-property-tax-guide` | how Florida property taxes are calculated | H2 1 |
| `/guides/florida-homestead-exemption-save-our-homes` | the current homestead exemption and Save Our Homes | H2 4 |
| `/blog/florida-property-tax-portability-guide` | portability is not changing | H2 14 |
| `/blog/hillsborough-county-property-taxes` | Hillsborough County millage rates | H2 7 |
| `/blog/riverview-fl-property-taxes-2026` | Riverview property taxes | H2 7 county table |
| `/blog/valrico-fl-property-taxes-2026` | Valrico property taxes | H2 7 county table |
| `/blog/brandon-fl-property-taxes` | Brandon property taxes | H2 7 county table |
| `/guides/relocation-guide` | moving to Tampa Bay before the December 31 deadline | H2 9 and 10 |
| `/guides/snowbird-guide-tampa-bay` | snowbirds and part-time Florida residents | H2 9 |
| `/free-home-valuation` | find out what your home is worth today | mid-article CTA and H2 23 |

Secondary, if you want more than 10: `/investing` and `/property-management` from H2 12 and 13 (landlords are the second-biggest audience for this page), `/mortgage-calculator` from H2 7.

**Cannibalization warning:** you already have `/blog/homestead-exemption-florida-guide`, `/blog/florida-homestead-protection-guide`, and `/guides/florida-homestead-exemption-save-our-homes` all competing on homestead terms. Before publishing, pick one as the homestead hub, point the other two at it, and make sure none of them start trying to rank for "amendment 3." This page should be the only Amendment 3 target on the domain.

## People Also Ask to answer

These are the ones that decide the SERP. Each gets a direct 2 to 3 sentence answer as the first thing under its H2, before any context.

1. What is Amendment 3 in Florida 2026?
2. What does Amendment 3 do to property taxes?
3. How much is the new Florida homestead exemption?
4. Will Amendment 3 eliminate property taxes in Florida?
5. When does Florida Amendment 3 take effect?
6. Who qualifies for the increased homestead exemption?
7. Do new Florida residents get the homestead exemption?
8. What is the five-year rule in Amendment 3?
9. Does Amendment 3 affect Save Our Homes?
10. How many votes does Amendment 3 need to pass?
11. Does Amendment 3 apply to rental and investment property?
12. Will Amendment 3 cut funding for police and schools?
13. What is the difference between the 10% and 5% assessment cap?
14. Is Amendment 3 constitutional?

## 5 things none of the top 10 do

**1. Publish both ballot texts side by side, with the ruling that killed one of them.**
A two-column block: the struck legislative title and summary on the left, the Attorney General's court-ordered rewrite on the right, verbatim, with a dated note that Leon County Circuit Judge David Frank ruled the original "clearly and conclusively defective" on August 3, 2026 and gave the AG 10 days. Add a visible "Ballot language verified [date]" stamp wired to `dateModified`. Every competing page is quoting language that will not appear on a single ballot. This one block is the whole competitive moat, and it is also the thing a reporter or an AI engine will cite.

**2. Build the calculator on the correct base number: $51,411, not $50,000.**
An interactive savings calculator where the user picks their county, enters assessed value, and gets separate 2027 and 2028 numbers. Hardcode the real 2026 base of $51,411 (the $25,000 plus the CPI-adjusted $26,411 second band), show the subtraction on screen, and footnote why it is not $50,000. Then add a toggle labeled "show me the rolled-up rate scenario" that recalculates with millage raised to revenue-neutral, so the user sees the savings shrink. Every other page runs the wrong base and promises savings that assume millage never moves. The toggle is the trust builder and it is the reason people will send the link to other people.

**3. Run a December 31, 2026 residency countdown and answer the buy-later question outright.**
A sticky banner with days remaining, tied to one answer nobody is giving: if you establish Florida residency by December 31, 2026, you get the larger exemption whenever you buy, even if you buy in 2029. Pair it with an actual domicile checklist (Florida driver license, voter registration, declaration of domicile filed with the clerk, vehicle registration) and a lead form headed "Relocating before the deadline." That is the highest-intent buyer question in this entire topic, there is a hard date on it, and the SERP is silent. This is where the leads come from.

**4. Ship a five-county savings table instead of one Pinellas example.**
Hillsborough, Pinellas, Pasco, Polk, and Manatee, each with its countywide aggregate non-school millage, 2027 savings, and 2028 savings, computed off $51,411. Show the arithmetic in a caption, cite each county's property appraiser, and flag the three assumptions (full exemption, no millage change, excludes CPI and non-ad valorem). Everybody else republishes PCPAO's single $1,203 / $2,423 Pinellas example. Tabular data with per-row sources is what AI Overviews extract, and it is what makes this a Tampa Bay page instead of a generic state page.

**5. Write the "what this does NOT do" section, and the legal-risk section, as hard content.**
One table with six rows: Save Our Homes 3% cap (unchanged), portability $500,000 cap (unchanged), senior/veteran/widow/disability exemptions (unchanged), school taxes on non-homestead property (still uncapped, still on market value), non-ad valorem assessments for fire, stormwater, and solid waste (not reduced, and can be raised or newly adopted), public safety funding (no guaranteed level). Cite PCPAO page by page on each row. Then a separate section on the five-year residency rule: Osterndorf v. Turner, 426 So. 2d 539 (Fla. 1982) already struck down a five-year durational residency requirement, which is why the AG's rewrite hedges with "to the extent permitted by the U.S. Constitution," and the enrolled text carries a severability clause so the rest survives if that piece falls. No consumer page in this SERP has either section. Together they are what turns this from a summary into the reference other people link to.

**Bonus, do it anyway:** mirror the enrolled CS/HJR 1F PDF and the PCPAO FAQ PDF to `/public` and link both with page numbers. Government PDFs get moved and re-slugged. When those links rot across the rest of the SERP, yours still works, and you become the citation of record.