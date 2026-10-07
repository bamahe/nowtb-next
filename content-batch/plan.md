# October 2026 Content Batch Plan

Branch: `content/oct-2026-batch` (both repos)
Author voice: Barrett Henry, Broker Associate, REMAX Collective. 23 years licensed.

How the dedupe call was made: every piece was checked against 1,752 nowtb.com blog
posts, 1,203 migrated pages, 49 guides, 65 hand-built routes, and the 10 vivipm.com
posts. Where the site already answers the question, the existing URL is updated and
no competing page is created.

## Decisions at a glance

| # | Piece | Call | Target URL | Why |
|---|---|---|---|---|
| N1 | FL 2026 property tax amendment | NEW | `/blog/florida-property-tax-amendment-2026` | 85 property tax posts, none on the 2026 ballot measure |
| N2 | Sell or rent your house | NEW | `/blog/sell-or-rent-my-house-tampa-bay` | No sell vs rent content on the site |
| N3 | Buy before you sell | NEW | `/blog/buy-before-you-sell-brandon` | No bridge or carry content |
| N4 | Selling after a sinkhole claim | NEW | `/blog/selling-house-with-past-sinkhole-claim-florida` | Existing sinkhole post is buyer side only |
| N5 | Why didn't my house sell | NEW | `/sell/why-didnt-my-house-sell` | No expired listing page exists |
| N6 | Selling while deployed | UPDATE | `/remote-seller-process/` | Page already owns this exact audience |
| N7 | Buying a home with solar | UPDATE | `/blog/buying-home-with-solar-panels-florida` | Same question, 2,277 words already live |
| N8 | VA loan house hacking | NEW | `/blog/va-loan-duplex-triplex-tampa` | VA posts exist, none on 2 to 4 units |
| N9 | Checking permits before buying | UPDATE | `/blog/how-to-check-permit-history-hillsborough-county` | Same question, missing City of Tampa |
| N10 | 1031 exchange buying in Tampa | UPDATE | `/guides/1031-exchange-guide` | 3,463 word guide already covers it |
| N11 | Florida 4-point inspection | NEW | `/blog/what-fails-florida-4-point-inspection` | No 4-point content anywhere |
| N12 | 55+ near Apollo Beach and Ruskin | NEW | `/blog/55-plus-communities-apollo-beach-ruskin` | Many Apollo Beach posts, none on 55+ |
| N13 | Indian Rocks Beach condo guide | NEW | `/blog/buying-condo-indian-rocks-beach` | Cluster hub is missing; becomes 8th page in the beach condo set |
| N14 | Condo in an LLC | UPDATE | `/buying-beach-condo-llc-florida/` | Same question, already live |
| N15 | Gapway Lake Estates | SKIP | `/auburndale/gapway-lakes-estates/` | 937 line page already complete |
| N16 | Trusted vendors | UPDATE | `/preferred-vendors/` | Competing page would split the same intent |
| N17 | Twin Lakes HOA section | UPDATE | `/twin-lakes-of-brandon/` | Page exists in neighborhood-descriptions.ts |
| N18 | About page upgrade | UPDATE | `/about/` | Existing page |
| N19 | Verifying agent production claims | UPDATE | `/guides/how-to-choose-a-realtor` | 3,578 word guide owns this intent |
| N20 | Short sale condo section | UPDATE | `/pre-foreclosure-short-sale-options/` + 2 posts | Hub exists at 736 words |
| V1 | Smoke damage and deposits | NEW | `/blog/security-deposit-smoke-damage-florida` | Deposit post covers the 15/30 rule only |
| V2 | Protecting a vacant rental | NEW | `/blog/protect-vacant-rental-squatters-florida` | Zero squatter content |
| V3 | Lease and List service page | NEW | `/services/lease-and-list` | Pricing tier exists, no service page |

## Primary question per piece

- N1: What is Florida's 2026 property tax amendment and what should homeowners and buyers do before December 31?
- N2: Should I sell or rent my house in Tampa Bay?
- N3: How can I buy my next home in Brandon before I sell my current one?
- N4: Can I sell a house in Florida that had a sinkhole claim?
- N5: Why didn't my house sell?
- N6: How do I sell my Florida house while I am deployed?
- N7: What should I know before buying a Florida home with solar panels?
- N8: Can I use a VA loan to buy a duplex or triplex in Tampa?
- N9: How do I check permits before buying a house in Tampa?
- N10: How does a 1031 exchange work when buying property in Tampa?
- N11: What fails a Florida 4-point inspection?
- N12: What are the 55+ communities near Apollo Beach and Ruskin?
- N13: What should I know before buying a condo in Indian Rocks Beach?
- N14: Can I buy a Florida condo in an LLC or corporation?
- N16: Which vendors does Barrett Henry actually recommend in Tampa Bay?
- N17: Who manages the Twin Lakes of Brandon HOA and how do I submit a request?
- N19: How do I know if a real estate agent's sales numbers are real?
- N20: How does a condo short sale differ from a house short sale?
- V1: Can a Florida landlord keep a security deposit for smoke damage?
- V2: How do I protect a vacant rental from squatters in Florida?
- V3: What is tenant placement only property management?

## Internal link map

Required by the brief:

- N2 to V3 (`https://vivipm.com/services/lease-and-list`) and N3
- N3 to N2 and `/brandon/`
- N5 to N2 and N4
- N6 to V1 (`https://vivipm.com/blog/security-deposit-smoke-damage-florida`)
- N7 to N11
- N8 to N9
- N10 to N9 and N2
- N13 to N14, N14 to N13

Added for topical depth:

- N1 to `/blog/homestead-exemption-florida-guide`, `/blog/florida-property-tax-portability-guide`, `/brandon/`, `/valrico/`, `/riverview/`
- N4 to `/blog/florida-sinkholes-what-buyers-need-to-know` and N11
- N11 to N7, `/insurance-partners/`, `/preferred-vendors/`
- N12 to `/55-plus-communities/`, `/how-to-tell-if-condo-is-55-plus/`, `/apollo-beach/`, `/ruskin/`
- N13 into the existing beach condo cluster (all 7 pages) via BEACH_CONDO_PAGES
- N19 to `/about/` and `/the-now-team/`
- N20 to `/florida-condo-rules-buyers-2026/` and `/gulf-front-condos-sirs-milestone-complete/`
- V1 to `/blog/security-deposits-florida-15-30-day-rule` and `/blog/florida-landlord-tenant-law-guide`
- V2 to `/blog/florida-landlord-tenant-law-guide` and `/services`
- V3 to `/pricing`, `/services`, `/rental-analysis`, and `https://nowtb.com/property-management/`

## Build notes specific to these repos

1. **nowtb.com blog posts** are HTML records in `src/data/posts-export.json`
   (`id`, `slug`, `title`, `date`, `excerpt`, `content`). The `/blog/[slug]` template
   already renders BreadcrumbList and BlogPosting schema, the author block, and the
   bottom CTA, so a post only needs body HTML plus its own inline FAQPage JSON-LD.
   1,556 existing posts already embed inline JSON-LD, so this matches the pattern.
2. **Sitemap is automatic** for blog posts and guides. Hand-built routes must be added
   to `src/app/sitemap.ts` by hand.
3. **The `:city` flatten redirect trap.** `next.config.mjs` lines 366 and 370 rewrite
   `/:city/:anything` to `/:anything/`. Any new nested route has to be added to BOTH
   negative lookaheads or it 404s on the live domain only. `/sell/why-didnt-my-house-sell`
   (N5) needs `sell` added to both.
4. **vivipm.com blog posts** are markdown (`body_mdx`) records in
   `src/lib/blog-posts.ts` typed as `BlogPost`. Sitemap picks them up automatically.
5. **No gold.** `cleanWpContent` already rewrites legacy gold button colors. New content
   uses navy, white, blues, slate, REMAX red and blue only.

## Pricing conflict to flag

The brief put the Lease and List fee at "one month's base rent". The live site already
publishes "100% of one month's rent" plus a $250 one-time setup fee in
`src/lib/constants.ts` and on `/pricing`. Per instruction the site's pricing wins, so
V3 uses 100% of one month's rent and $250 setup.
