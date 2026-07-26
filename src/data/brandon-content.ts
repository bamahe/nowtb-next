// =============================================================================
// Brandon-specific FAQs and neighborhood descriptions
// FAQs: real, useful answers for people researching Brandon FL before moving
// Neighborhood descriptions: honest writeups for all 21 Brandon neighborhoods
//
// HOW TO USE:
//   import { BRANDON_FAQS } from './brandon-content'
//   import { BRANDON_NEIGHBORHOOD_DESCRIPTIONS } from './brandon-content'
//
//   Merge into CITY_FAQS:     { ...CITY_FAQS, ...BRANDON_FAQS }
//   Merge into NEIGHBORHOOD_DESCRIPTIONS: { ...NEIGHBORHOOD_DESCRIPTIONS, ...BRANDON_NEIGHBORHOOD_DESCRIPTIONS }
// =============================================================================

import type { CityFAQ } from './valrico-faqs'
import type { NeighborhoodDescription } from './neighborhood-descriptions'

// =============================================================================
// BRANDON FAQs
// =============================================================================

export const BRANDON_FAQS: Record<string, CityFAQ[]> = {
  brandon: [
    {
      question: "What ZIP codes cover Brandon, FL?",
      answer:
        "Brandon is split between two ZIP codes: 33510 and 33511. The 33510 ZIP covers the western and central sections — think the Westfield Brandon mall, the SR-60 corridor, and the neighborhoods closest to Tampa. The 33511 ZIP stretches east toward Valrico and covers the Bloomingdale area on the Brandon side. If you're comparing homes, the ZIP code can affect school zones, flood risk, and even insurance rates, so it's worth knowing which one you're in.",
      answerHtml:
        'Brandon is split between two ZIP codes: 33510 and 33511. The 33510 ZIP covers the western and central sections — think the Westfield Brandon mall, the SR-60 corridor, and the neighborhoods closest to Tampa. The 33511 ZIP stretches east toward <a href="/valrico/" class="text-link hover:underline">Valrico</a> and covers the Bloomingdale area on the Brandon side. If you\'re comparing homes, the ZIP code can affect school zones, flood risk, and even insurance rates, so it\'s worth knowing which one you\'re in.',
    },
    {
      question: "What schools serve Brandon?",
      answer:
        "Brandon is in the Hillsborough County School District. For middle school, kids are typically zoned for McLane Middle or Burns Middle depending on where you live. High school is Brandon High School or Bloomingdale High — Bloomingdale serves the eastern Brandon/33511 area. On the elementary side, you'll see schools like Kingswood, Limona, and Brooker come up regularly. Always verify the exact school zone by address before making a buying decision based on schools — boundaries shift, and the district's site has the official tool.",
      answerHtml:
        'Brandon is in the <a href="https://www.hillsboroughschools.org" target="_blank" rel="noopener noreferrer" class="text-link hover:underline">Hillsborough County School District</a>. For middle school, kids are typically zoned for McLane Middle or Burns Middle depending on where you live. High school is Brandon High School or Bloomingdale High — Bloomingdale serves the eastern Brandon/33511 area. On the elementary side, you\'ll see schools like Kingswood, Limona, and Brooker come up regularly. Always verify the exact school zone by address before making a buying decision based on schools — boundaries shift, and the district\'s site has the official tool.',
    },
    {
      question: "How far is Brandon from downtown Tampa?",
      answer:
        "Brandon sits about 12 to 15 miles east of downtown Tampa. On a normal day, that's a 20 to 30 minute drive. During rush hour it can stretch to 40 or 45 minutes on I-75, but the Selmon Expressway (toll) cuts through more directly and tends to stay faster when the interstates back up. Most people who commute into Tampa from Brandon use the Selmon regularly — the time savings are worth the toll for daily commuters.",
      answerHtml:
        'Brandon sits about 12 to 15 miles east of downtown Tampa. On a normal day, that\'s a 20 to 30 minute drive. During rush hour it can stretch to 40 or 45 minutes on I-75, but the Selmon Expressway (toll) cuts through more directly and tends to stay faster when the interstates back up. Most people who commute into Tampa from Brandon use the Selmon regularly — the time savings are worth the toll for daily commuters.',
    },
    {
      question: "Is Brandon a good place to raise a family?",
      answer:
        "For a lot of families, Brandon hits a sweet spot. You get a suburban feel with real amenities — good schools, tons of shopping and dining along SR-60, easy access into Tampa — without paying Tampa prices. It's more developed and commercial than Valrico or Lithia, but that also means less driving for everyday life. The trade-off is that parts of Brandon are busy and feel more like a commercial corridor than a quiet neighborhood. It really depends which part of Brandon and which neighborhood you're in.",
      answerHtml:
        'For a lot of families, Brandon hits a sweet spot. You get a suburban feel with real amenities — good schools, tons of shopping and dining along SR-60, easy access into Tampa — without paying Tampa prices. It\'s more developed and commercial than <a href="/valrico/" class="text-link hover:underline">Valrico</a> or <a href="/lithia/" class="text-link hover:underline">Lithia</a>, but that also means less driving for everyday life. The trade-off is that parts of Brandon are busy and feel more like a commercial corridor than a quiet neighborhood. It really depends which part of Brandon and which neighborhood you\'re in.',
    },
    {
      question: "What's the difference between Brandon and Valrico?",
      answer:
        "Brandon is more commercial — the Westfield mall, big box stores, restaurant chains, and medical offices are all concentrated along SR-60 and the surrounding corridors. Valrico, immediately east, is primarily residential with a quieter, more suburban pace and fewer commercial anchors. Brandon also tends to have a slightly wider price range and more inventory at any given time. If you want to be close to everything and don't mind a busier environment, Brandon makes sense. If you want a bit more quiet and a more neighborhood feel, look at Valrico.",
      answerHtml:
        'Brandon is more commercial — the Westfield mall, big box stores, restaurant chains, and medical offices are all concentrated along SR-60 and the surrounding corridors. <a href="/valrico/" class="text-link hover:underline">Valrico</a>, immediately east, is primarily residential with a quieter, more suburban pace and fewer commercial anchors. Brandon also tends to have a slightly wider price range and more inventory at any given time. If you want to be close to everything and don\'t mind a busier environment, Brandon makes sense. If you want a bit more quiet and a more neighborhood feel, look at Valrico.',
    },
    {
      question: "Are there flood zones in Brandon?",
      answer:
        "Most of Brandon sits in FEMA Zone X, which is the minimal-risk category — flood insurance typically isn't required in Zone X with a conventional mortgage. The exceptions tend to be properties near the Alafia River in south Brandon and certain low-lying pockets throughout the area. Those can fall in Zone AE, where flood insurance is mandatory with a federally-backed loan. Always pull the FEMA flood map for the specific property — not just the general neighborhood. What's true for one street may not be true for the house next door.",
      answerHtml:
        'Most of Brandon sits in FEMA Zone X, which is the minimal-risk category — flood insurance typically isn\'t required in Zone X with a conventional mortgage. The exceptions tend to be properties near the Alafia River in south Brandon and certain low-lying pockets throughout the area. Those can fall in Zone AE, where flood insurance is mandatory with a federally-backed loan. Always pull the <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" class="text-link hover:underline">FEMA flood map</a> for the specific property — not just the general neighborhood. What\'s true for one street may not be true for the house next door.',
    },
    {
      question: "What are property taxes like in Brandon?",
      answer:
        "Brandon is in unincorporated Hillsborough County, so you're paying county-level taxes only — no separate city tax. The total millage rate typically runs around 19 to 20 mills. On a $350,000 home with Florida's homestead exemption, you're generally looking at $4,500 to $5,500 per year in property taxes. Some newer communities also carry CDD (Community Development District) fees that show up as a separate line item on the tax bill — those can add a few hundred to over a thousand dollars per year, so always ask about CDDs before making an offer.",
      answerHtml:
        'Brandon is in unincorporated Hillsborough County, so you\'re paying county-level taxes only — no separate city tax. The total millage rate typically runs around 19 to 20 mills. On a $350,000 home with Florida\'s homestead exemption, you\'re generally looking at $4,500 to $5,500 per year in property taxes. Some newer communities also carry CDD (Community Development District) fees that show up as a separate line item on the tax bill — those can add a few hundred to over a thousand dollars per year, so always ask about CDDs before making an offer. Use the <a href="/mortgage-calculator/" class="text-link hover:underline">mortgage calculator</a> to estimate your full monthly payment including taxes and insurance.',
    },
    {
      question: "Is Brandon walkable?",
      answer:
        "More so than most of the surrounding area. The commercial core around Westfield Brandon mall and the SR-60 corridor has sidewalks and some pedestrian infrastructure, and there are destinations close enough to walk to in parts of central Brandon. For outdoor activity, the Alafia Scrub Nature Preserve and Paul Sanders Park both offer trails. That said, Brandon is still fundamentally a car-dependent suburb — most people drive for groceries, errands, and work. If true walkability is a priority, downtown Tampa or South Tampa will serve you better.",
      answerHtml:
        'More so than most of the surrounding area. The commercial core around Westfield Brandon mall and the SR-60 corridor has sidewalks and some pedestrian infrastructure, and there are destinations close enough to walk to in parts of central Brandon. For outdoor activity, the Alafia Scrub Nature Preserve and Paul Sanders Park both offer trails. That said, Brandon is still fundamentally a car-dependent suburb — most people drive for groceries, errands, and work. If true walkability is a priority, downtown Tampa or South Tampa will serve you better.',
    },
  ],
}

// =============================================================================
// BRANDON NEIGHBORHOOD DESCRIPTIONS
// =============================================================================

export const BRANDON_NEIGHBORHOOD_DESCRIPTIONS: Record<string, NeighborhoodDescription> = {

  // ===== ALAFIA ESTATES =====

  "alafia-estates": {
    summary:
      "South Brandon neighborhood with larger lots near the Alafia River, a mix of older homes and acreage parcels, and a semi-rural feel uncommon this close to Tampa.",
    contentHtml: `
      <p>Alafia Estates sits in the southern edge of Brandon near the Alafia River, and it has a noticeably different character from the denser subdivisions along SR-60. Lots here are larger — some approaching a half-acre or more — and the tree cover and spacing between homes give the area a quieter, more rural feel.</p>
      <p>Homes were built primarily from the 1970s through the 1990s, so you're looking at established construction rather than new builds. Floor plans vary widely: ranch-style singles, two-story layouts, and some custom-built properties are all represented. The price range reflects the variation in condition — some homes have been well-maintained or updated, others are priced closer to land value.</p>
      <p>One thing to check carefully here: proximity to the Alafia River means some parcels fall in FEMA flood Zone AE. Don't assume the whole neighborhood is Zone X — pull the flood map for the specific address before making any decisions about insurance requirements. This can meaningfully affect your carrying cost.</p>
      <p>The semi-rural character appeals to buyers who want space and privacy, and who don't mind being a few extra minutes from the SR-60 commercial corridor. Access to I-75 is reasonable from south Brandon, and <a href="/riverview/" class="text-link hover:underline">Riverview</a> is just across the county line if you need more commercial options nearby.</p>
      <p>There's no traditional HOA in most of Alafia Estates, which is a draw for buyers who want fewer restrictions. If you're considering this area, budget for a thorough inspection — homes of this age can have deferred maintenance that isn't obvious at first glance.</p>
    `,
  },

  // ===== ARBOR OAKS =====

  "arbor-oaks": {
    summary:
      "Established Brandon subdivision from the 1980s and 90s with mature trees, a community pool, and homes priced below newer construction nearby.",
    contentHtml: `
      <p>Arbor Oaks is a well-established subdivision in central Brandon with homes built mostly in the late 1980s and early 1990s. The mature oak tree canopy throughout the neighborhood is one of its best features — the kind of shade you can't buy in a new subdivision and can only grow over 30-plus years.</p>
      <p>Most homes are 3 to 4 bedrooms, ranging from about 1,400 to 2,200 square feet. Concrete block construction is standard for the era, and many homes have been updated over the years with new kitchens, baths, and roofs. You'll find a mix of original-condition and renovated properties within the same streets.</p>
      <p>The community has a pool, and the HOA keeps the common areas maintained. Dues are typically modest for a neighborhood of this age — not the higher fees you'd see in a newer gated community or one with elaborate amenities. The streets are wide with sidewalks, and the neighborhood layout encourages the kind of foot traffic and neighborly interaction that feels increasingly rare.</p>
      <p>Location is solid — you're close to the main SR-60 corridor for shopping and dining, with the Westfield Brandon mall a short drive west. Schools are in the Hillsborough County system, with assignments depending on your specific address within the subdivision.</p>
      <p>For buyers on a budget, Arbor Oaks typically prices below newer construction in Brandon while offering more mature landscaping and often more lot depth. The trade-off is that some homes are showing their age cosmetically — kitchens and bathrooms from the original build era may need updating, and buyers should check roof age and HVAC condition closely.</p>
    `,
  },

  // ===== BLOOMINGDALE (BRANDON SIDE) =====

  "bloomingdale": {
    summary:
      "The Brandon side of the broader Bloomingdale community, sharing its schools, trails, and community character with neighboring Valrico.",
    contentHtml: `
      <p>The Bloomingdale community straddles the Brandon/Valrico line, and the sections that fall on the Brandon side share everything that makes Bloomingdale a perennial favorite with families: good schools, established neighborhoods, and a well-maintained network of community trails and common areas.</p>
      <p>Homes here were built primarily through the 1980s and 1990s, making them established without being ancient. You'll see a range of styles — single-story ranches, two-story colonials, and everything in between — at a range of sizes from around 1,400 to 2,800 square feet.</p>
      <p>Bloomingdale High School is the anchor institution for the area and one of the main reasons families specifically seek out this community. Elementary assignments (Bloomingdale Elementary or Cimino Elementary) and middle school (Randall Middle) round out a solid school path. Always verify the exact zone by address, as assignment boundaries within the broader Bloomingdale area can vary.</p>
      <p>The Bloomingdale Community Association maintains the trail network and common areas. HOA fees apply in most sections and are generally reasonable for what's included. Some of the older sections of Bloomingdale have seen homes go through multiple owners with varying levels of upkeep — budget for a proper inspection regardless of how well-maintained a home looks on the surface.</p>
      <p>Location-wise, you're well-placed: Bloomingdale Avenue gives you quick access to the Selmon Expressway for Tampa commuters, Bell Shoals Road has expanded retail and dining, and <a href="/valrico/" class="text-link hover:underline">Valrico</a> is immediately to the east if you want quieter residential streets without driving far.</p>
    `,
  },

  // ===== BROADWAY CENTRE TOWNHOMES =====

  "broadway-centre-townhomes": {
    summary:
      "Attached townhome community in central Brandon offering lower price points, minimal exterior maintenance, and convenient access to SR-60.",
    contentHtml: `
      <p>Broadway Centre Townhomes is a townhome community in central Brandon — a different product type from the single-family subdivisions that dominate the area. If you want to own rather than rent but don't want the exterior maintenance burden of a standalone house, this kind of community makes sense.</p>
      <p>Units are typically 2 to 3 bedrooms, two-story layout with attached garages. Square footage runs from roughly 1,200 to 1,700 square feet depending on the floor plan. Construction is more recent than many of Brandon's older neighborhoods, which means the systems (HVAC, roof, plumbing) are in better shape starting out.</p>
      <p>The HOA covers exterior maintenance and common areas — that's the core trade-off here. You'll pay a higher monthly fee than in a typical single-family neighborhood, but you're not responsible for painting the exterior, maintaining the roof, or managing lawn care. For working professionals or buyers who travel frequently, that tradeoff has real value.</p>
      <p>Location is convenient — you're close to the SR-60 commercial corridor with access to the Westfield Brandon mall, restaurants, groceries, and medical offices within a short drive. Commuting via the Selmon Expressway is straightforward from central Brandon.</p>
      <p>One honest note: townhome communities tend to have stricter HOA rules about parking, pets, and modifications than single-family neighborhoods. Read the HOA documents carefully before making an offer — specifically the rental restrictions and pet policies, which vary significantly between communities.</p>
    `,
  },

  // ===== BRANDON POINTE =====

  "brandon-pointe": {
    summary:
      "Newer Brandon community with modern construction, community amenities, and an active HOA — built for buyers who want move-in-ready without a project.",
    contentHtml: `
      <p>Brandon Pointe is a newer subdivision in Brandon with homes built in the 2000s and 2010s. If you're looking for updated finishes, modern floor plans, and construction from an era that used current building codes and materials, this is the kind of neighborhood to consider.</p>
      <p>Homes are primarily 3 to 5 bedrooms, ranging from about 1,800 to 3,000 square feet. Open-concept living areas, granite or quartz counters, tile through the main living spaces, and covered screened lanais are standard in this generation of Florida construction. Most homes have two-car garages and the storage that older ranch homes often lack.</p>
      <p>The community has a pool and common areas maintained through the HOA. Fees are in line with what you'd expect for a community of this age and amenity level. Some sections may also carry CDD fees — always ask specifically about both HOA and CDD before finalizing your budget. The <a href="/mortgage-calculator/" class="text-link hover:underline">mortgage calculator</a> can help you model the full monthly picture.</p>
      <p>Location in Brandon gives you good access to the SR-60 corridor and the Selmon Expressway for Tampa commutes. Hillsborough County school zones serve the area, with specific assignments depending on your address within the community.</p>
      <p>The main advantage of newer construction is fewer surprises — roofs, HVAC systems, and plumbing are all younger, which reduces your short-term maintenance burden. The trade-off compared to older Brandon neighborhoods is smaller lot sizes and the additional carrying costs of HOA and potentially CDD fees.</p>
    `,
  },

  // ===== BRANDON TRACES =====

  "brandon-traces": {
    summary:
      "Established Brandon subdivision from the 1990s with a community pool, sidewalks, and homes on tree-lined streets at accessible price points.",
    contentHtml: `
      <p>Brandon Traces is a 1990s subdivision that has aged into a comfortable, established neighborhood. The streets are wide with sidewalks, the trees have matured enough to provide real shade, and the community pool gets regular use from a mix of longtime residents and newer owners.</p>
      <p>Homes are mostly 3 to 4 bedrooms in the 1,500 to 2,400 square foot range. Concrete block construction is the norm, and many homes have had at least partial updates over the years — new roofs, updated kitchens, or renovated bathrooms are common. The variation in update level creates a range of price points within the same neighborhood.</p>
      <p>The HOA maintains the pool and common areas; dues are modest for what's included. There's no gated entry or elaborate amenity center — Brandon Traces is a straightforward family neighborhood that delivers on the basics well.</p>
      <p>Commute access is one of the neighborhood's strengths. You're well-positioned for either the Selmon Expressway or I-75, and the SR-60 commercial corridor is close for everyday errands. For families, the school zone assignments are typical for central Brandon — verify by specific address using the district's online tool.</p>
      <p>Brandon Traces tends to attract buyers who want a move-in-ready home without paying the premium of newer construction or a gated community. The honest trade-off: some homes need cosmetic work, and buyers should check roof and HVAC age on anything from the original build period.</p>
    `,
  },

  // ===== DOMINION =====

  "dominion": {
    summary:
      "Gated community in Brandon with larger homes, a community pool, and a quieter setting that stands apart from the busier SR-60 corridor.",
    contentHtml: `
      <p>Dominion is a gated community in Brandon that draws buyers looking for a bit more separation from the commercial activity along SR-60. The gated entry and community layout give it a different character from the open subdivisions throughout most of Brandon.</p>
      <p>Homes are on the larger side — most are 2,000 to 3,500 square feet, with 4 and 5 bedroom floor plans well-represented. Lot sizes are reasonable and many homes have pool-ready or already-pooled backyards. Construction spans the late 1990s through 2000s, so the neighborhood has some maturity without the deferred maintenance concerns of older stock.</p>
      <p>The community pool and common areas are maintained through the HOA. Fees are higher than you'd see in a non-gated community — that's the standard trade-off for the gated entry and amenities. If the gated setting is important to you (security, reduced through-traffic, general aesthetics), it's worth the premium. If not, you'll find more square footage for the money in comparable non-gated Brandon neighborhoods.</p>
      <p>Access to the Selmon Expressway makes Tampa commutes manageable, and the broader Brandon area's shopping and dining options are close. Schools are in the Hillsborough County system — specific assignments vary by address.</p>
      <p>For buyers who want more home in a quieter setting without leaving Brandon's convenience behind, Dominion is a legitimate option. Just make sure to account for the full carrying cost — mortgage, HOA fees, and any CDD if applicable — before comparing it to non-gated alternatives.</p>
    `,
  },

  // ===== FOUR WINDS ESTATES =====

  "four-winds-estates": {
    summary:
      "Older Brandon neighborhood with larger lots, minimal HOA, and a mix of original and updated homes — appealing to buyers who want space without subdivision restrictions.",
    contentHtml: `
      <p>Four Winds Estates is one of Brandon's older residential pockets, with homes dating back to the 1970s and 1980s. The age of the neighborhood comes with bigger lot sizes — you'll find quarter-acre to half-acre parcels that simply aren't available in newer developments at the same price point.</p>
      <p>The neighborhood has a mix of home types and conditions. Some owners have held and updated their properties over the decades; others are more original condition. That creates a buying opportunity for buyers who know what they're doing — a well-priced fixer on a big lot in an established neighborhood has real upside, but only if you go in with clear eyes about what needs work.</p>
      <p>HOA presence is minimal or nonexistent in most of Four Winds Estates. That's a feature for many buyers — no architectural review process, no restrictions on parking your boat or trailer, and no monthly HOA dues. For buyers coming from a newer subdivision, that freedom is genuinely appealing.</p>
      <p>Location is solid for central Brandon — access to SR-60 and the surrounding commercial corridor is easy, and the Selmon Expressway is a reasonable drive for Tampa commuters. The neighborhood is served by Hillsborough County schools.</p>
      <p>A few things to check before buying in any neighborhood this age: roof age and type (some older homes have original roofs well past their useful life), HVAC system age, electrical panel condition (older panels can affect insurance options), and whether the home is on sewer or septic. A thorough inspection is non-negotiable here.</p>
    `,
  },

  // ===== HEATHER LAKES =====

  "heather-lakes": {
    summary:
      "Brandon community built around a series of small lakes, offering water views on some lots and a mature, landscaped streetscape throughout.",
    contentHtml: `
      <p>Heather Lakes is centered around a network of small lakes that give the neighborhood its name and a level of visual character that's hard to find in standard subdivision layouts. Some homes have direct water views or back to the lake — a feature that adds appeal and, honestly, usually adds price too.</p>
      <p>Most homes were built in the 1980s and 1990s, with a range of single and two-story layouts from about 1,500 to 2,800 square feet. The established landscaping and mature trees throughout make the neighborhood feel settled and private in a way that newer construction just can't match.</p>
      <p>HOA dues apply and cover the common lake areas and community maintenance. The lakes themselves are aesthetic features — not fishing destinations or swimming holes — but they create the natural buffer zones between sections of the neighborhood that reduce the sense of density.</p>
      <p>Central Brandon access is good here — you're close to SR-60 with the full range of shopping and dining it offers, and the Selmon Expressway is accessible for commuters heading into Tampa. School assignments are through Hillsborough County; verify by specific address.</p>
      <p>If you're considering a home that backs to one of the lakes, check flood zone status carefully. Most of Heather Lakes is Zone X, but lakefront parcels or low-lying areas near water features can fall in Zone AE. Pull the FEMA map before assuming the lakefront lot's flood insurance cost is the same as the homes across the street.</p>
    `,
  },

  // ===== HIDDEN FOREST =====

  "hidden-forest": {
    summary:
      "Tucked-away Brandon subdivision with mature tree coverage, a community pool, and a neighborhood feel that justifies the name.",
    contentHtml: `
      <p>Hidden Forest earns its name — it's one of those Brandon neighborhoods that doesn't announce itself from the main road. The mature tree canopy throughout creates a shaded, private feel that's noticeably different from the more open subdivisions along the major corridors.</p>
      <p>Homes were built primarily in the late 1980s and 1990s, with most in the 3 to 4 bedroom range from about 1,400 to 2,400 square feet. The mix of single and two-story floor plans gives the streets visual variety, and the mature landscaping on individual lots adds to the neighborhood's established character.</p>
      <p>The community has a pool maintained through the HOA. Dues are typically modest — this isn't a gated community with elaborate amenities, just a well-maintained neighborhood where the association handles what it should. Common areas are kept up, and the neighborhood has clearly had engaged ownership over the years.</p>
      <p>Access to the SR-60 corridor and the broader Brandon commercial area is close, and the Selmon Expressway is reachable without a major drive. For buyers looking for a neighborhood that feels quieter and more residential without being remote, Hidden Forest is worth including in a Brandon home search.</p>
      <p>As with all homes from this era, ask about roof age and HVAC condition upfront. The oldest homes here are pushing 35-plus years on the original construction, so knowing what's been replaced (and when) is important before committing.</p>
    `,
  },

  // ===== HIDDEN RESERVE =====

  "hidden-reserve": {
    summary:
      "Smaller Brandon community with a quiet residential feel, newer construction than many Brandon neighborhoods, and manageable HOA.",
    contentHtml: `
      <p>Hidden Reserve is a smaller community in Brandon — the kind of subdivision that doesn't show up in every buyer's search but rewards the ones who find it. It's more intimate than the large-scale developments, and that scale creates a neighborhood feel that bigger subdivisions can struggle to replicate.</p>
      <p>Construction is newer than much of Brandon's residential stock, with homes generally from the 2000s and early 2010s. That means modern floor plans, better insulation standards, and systems that are more recent on their service life. Homes are typically 3 to 4 bedrooms in the 1,700 to 2,600 square foot range.</p>
      <p>HOA covers common area maintenance; fees are manageable and in line with what a smaller community of this type typically charges. There's no elaborate amenity center, which keeps costs down and eliminates some of the ongoing assessment risk that larger communities occasionally face.</p>
      <p>Central Brandon location means you're close to everything — SR-60 commercial corridor, medical offices, restaurants, and the Westfield Brandon area. Selmon Expressway access is reasonable for Tampa commuters. School assignments are through Hillsborough County.</p>
      <p>For buyers who want newer construction without the scale and fees of a large planned community, Hidden Reserve is the kind of neighborhood worth a look. The smaller community size also tends to mean a more stable HOA — fewer units means fewer variables in budget management.</p>
    `,
  },

  // ===== KINGS LAKE BRANDON =====

  "kings-lake": {
    summary:
      "Brandon community near Kings Lake with a mix of lot sizes, established landscaping, and access to both the SR-60 corridor and quieter residential streets.",
    contentHtml: `
      <p>Kings Lake Brandon sits near the lake of the same name, and the proximity to water gives parts of the neighborhood a more natural character than standard inland subdivisions. The area has been developed over multiple decades, so you'll find a mix of home ages and styles within relatively close proximity.</p>
      <p>Homes range from smaller 3-bedroom ranches to larger two-story layouts, generally from the 1970s through the 2000s. The variation in age means a wide range in condition and update level — a neighborhood like this rewards buyers who are willing to look at multiple properties and compare carefully rather than assuming one home represents the whole area.</p>
      <p>Lot sizes vary as well. Some parcels back to the lake or water features; others are standard suburban lots without premium views. Properties with direct water access or views typically carry a price premium — make sure that premium is justified by the specific lot's flood zone designation, since lakefront properties can carry Zone AE requirements.</p>
      <p>The location in Brandon is convenient — close to SR-60 for everyday needs, with reasonable access to the Selmon Expressway for Tampa commuters. <a href="/valrico/" class="text-link hover:underline">Valrico</a> is just to the east if you want to expand your search area.</p>
      <p>HOA presence and fees vary depending on which specific section of Kings Lake you're in — some have active associations, others have minimal covenants. Ask specifically before assuming.</p>
    `,
  },

  // ===== LA COLLINA =====

  "la-collina": {
    summary:
      "Newer gated community in Brandon with modern construction, resort-style amenities, and CDD fees — a move-in-ready option for buyers willing to pay for it.",
    contentHtml: `
      <p>La Collina is one of Brandon's newer gated communities, built in the 2010s with the amenity package and construction standards that today's buyers expect. If you want modern finishes, newer systems, and a community pool/amenity center without taking on a renovation project, this is the kind of community that delivers that.</p>
      <p>Homes are primarily 3 to 5 bedrooms, ranging from about 1,800 to 3,500 square feet. Floor plans are open-concept with the standard modern features — stone counters, tile flooring, covered lanais, and two or three car garages. The gated entry and landscaped common areas create a clean, maintained appearance throughout.</p>
      <p>Here's the important financial consideration with La Collina: both HOA fees and CDD fees apply. The HOA covers the amenity center, pool, and common area maintenance. The CDD is a separate assessment that funds the infrastructure development and gets billed with your property taxes. The total carrying cost — mortgage plus HOA plus CDD — is higher than you'd pay in an older non-gated community at the same sticker price. Use the <a href="/mortgage-calculator/" class="text-link hover:underline">mortgage calculator</a> and factor in all three costs before comparing to alternatives.</p>
      <p>That said, the community is well-maintained, the construction is newer, and the amenities are genuinely usable. For buyers who are comparing new construction to existing homes, La Collina represents a middle ground — newer than older Brandon neighborhoods but without the full new construction premium.</p>
      <p>School assignments are through Hillsborough County; the community's location in eastern Brandon typically places it in well-regarded school zones.</p>
    `,
  },

  // ===== MISTY RIDGE =====

  "misty-ridge": {
    summary:
      "Established Brandon neighborhood from the 1980s with a quiet residential character, mature trees, and typically no CDD fees.",
    contentHtml: `
      <p>Misty Ridge is one of Brandon's older residential neighborhoods, with most homes built in the 1980s. The decade shows in the lot sizes (more generous than newer construction), the tree maturity (full shade canopy in many areas), and the architectural character (varied rather than homogeneous).</p>
      <p>Homes are primarily 3 to 4 bedrooms in the 1,400 to 2,200 square foot range. Single-story ranch plans are common alongside two-story layouts. Construction is standard concrete block for Florida. Many homes have been updated over the years — new roofs, kitchen refreshes, updated baths — but you'll still find original-condition properties that are priced accordingly.</p>
      <p>HOA presence in Misty Ridge tends to be more limited than in newer communities — minimal restrictions in many sections, and no CDD assessment layered on top of property taxes. For buyers who are comparing Misty Ridge to a newer community with HOA plus CDD fees, the monthly carrying cost difference can be significant.</p>
      <p>Location is centrally positioned in Brandon with access to SR-60 and the commercial corridor close by. The Selmon Expressway isn't far for Tampa commuters. School assignments are through Hillsborough County.</p>
      <p>The main thing to scrutinize in a 1980s home is the mechanical systems — roof age, HVAC age, water heater, and plumbing type are all worth knowing before you close. A good home inspector will flag anything that's approaching end of life, and in Florida that's worth the cost every time.</p>
    `,
  },

  // ===== PROVIDENCE LAKES =====

  "providence-lakes": {
    summary:
      "One of Brandon's larger established communities, built around a series of lakes with a community pool, tennis courts, and homes from the late 1980s and 90s.",
    contentHtml: `
      <p>Providence Lakes is a large, well-established community in Brandon built around multiple lakes that wind through the neighborhood. It was developed primarily in the late 1980s and 1990s, and in the three-plus decades since, it has grown into one of the more recognizable and stable communities in the area.</p>
      <p>The community covers a substantial area with multiple sub-sections, so Providence Lakes isn't one uniform neighborhood — it's a collection of streets and cul-de-sacs connected by the overall community infrastructure. Homes range from around 1,500 to 3,000 square feet, with lake views or lakefront lots in some sections and standard interior lots in others.</p>
      <p>Amenities include a community pool, tennis courts, and playgrounds — maintained through the HOA. Dues are reasonable given the community size and what's included. Some lakefront lots are in lower-elevation areas, so checking individual flood zone status is worth doing before making assumptions about insurance costs.</p>
      <p>The community's maturity is one of its main appeals. Trees are established, landscaping is maintained, and the streets have the settled feel that only comes with time. Buyers who want the walkable, shaded neighborhood character that newer construction can't offer often end up in communities like Providence Lakes.</p>
      <p>For families, school zoning is typically solid — the community's location puts it in well-served Hillsborough County school zones, with assignments varying by section. As always, verify the specific address using the district's school locator before making a decision based on schools.</p>
      <p>The trade-off for buyers: homes from the late 1980s and early 1990s are now 30+ years old. Kitchens and bathrooms in original condition are showing their age, and some buyers will need to budget for updates. The payoff is more lot, more tree, and more neighborhood for the money compared to newer Brandon communities.</p>
    `,
  },

  // ===== RIVER CROSSING =====

  "river-crossing": {
    summary:
      "Brandon community with winding streets, water features, and a mix of home sizes from the 1990s — good bones and a comfortable suburban character.",
    contentHtml: `
      <p>River Crossing is a 1990s subdivision in Brandon with a layout that uses curves and cul-de-sacs rather than the grid pattern that defines some older neighborhoods. The result is a streetscape that feels more intentionally designed, with less through-traffic and better sightlines from the home.</p>
      <p>Homes are mostly 3 to 4 bedrooms, from about 1,500 to 2,600 square feet, in a mix of single and two-story floor plans. The community has some water features — retention areas and small ponds — that break up the landscape and provide natural buffers between sections.</p>
      <p>The HOA covers common area maintenance; fees are modest and appropriate for a community of this age and amenity level. The community pool gets regular use, and the neighborhood has the kind of well-established feel that comes from stable, long-term homeownership.</p>
      <p>Brandon SR-60 access is close, and the Selmon Expressway is accessible for Tampa commuters. Hillsborough County school assignments serve the area — verify the specific zone by address before assuming which schools your kids would attend.</p>
      <p>River Crossing tends to attract buyers who want a complete neighborhood experience without paying the premium for new construction. Homes are larger and lots are more generous than what you'd get at the same price in a 2020s community. The honest trade-off: 30-year-old homes need attention on mechanical systems, and some cosmetic updates are likely needed if the kitchen or baths haven't been touched.</p>
    `,
  },

  // ===== SANCTUARY AT JOHN MOORE =====

  "sanctuary-at-john-moore": {
    summary:
      "Newer gated community in south Brandon off John Moore Road with modern homes, a quiet setting, and easy access to I-75.",
    contentHtml: `
      <p>Sanctuary at John Moore is a gated community in south Brandon positioned off John Moore Road — a location that gives you a quieter, more residential feel than the SR-60 corridor while keeping I-75 access reasonable for commuters heading to Tampa or south toward <a href="/riverview/" class="text-link hover:underline">Riverview</a> and Sarasota.</p>
      <p>Homes were built in the 2000s and 2010s and reflect the construction standards of those eras — open floor plans, impact or hurricane-rated windows in many cases, efficient HVAC systems, and the kind of storage that older Brandon homes often lack. Most are 3 to 5 bedrooms, ranging from about 1,800 to 3,200 square feet.</p>
      <p>The gated entry and community layout create a private feel. Common areas are maintained through the HOA, and fees are in line with comparable gated communities of this size. Check for CDD fees — communities from this development era in Brandon can carry them, and you want to know about them before comparing prices to non-CDD communities.</p>
      <p>South Brandon's proximity to the Alafia River means some pockets of the area can have flood zone considerations. Sanctuary at John Moore is generally on better-elevated ground, but always verify the specific lot using the FEMA flood map rather than assuming the whole community is uniform.</p>
      <p>For families, school zoning in south Brandon is through Hillsborough County. The area is served by a mix of elementary and middle schools depending on your specific address; Bloomingdale High or Brandon High could be the assigned high school depending on where exactly you fall. Verify with the district directly.</p>
    `,
  },

  // ===== SOUTHOAK =====

  "southoak": {
    summary:
      "Hidden acreage community in Bloomingdale near Brandon, FL. Custom homes on up to 5 acres, built 1983-1990. Mandatory HOA, no CDD. Zoned for Cimino Elementary, Burns Middle, Bloomingdale High.",
    contentHtml: `
      <h3>Southoak Real Estate Overview</h3>
      <p>Southoak dates back to 1983, with most of the neighborhood built out between 1986 and 1990 under the legal designation Bloomingdale Section F. That history shows in the best way: mature trees, established landscaping, and a settled feel that new construction cannot replicate.</p>
      <p>What sets Southoak apart from the rest of Bloomingdale is lot size. Homesites here run anywhere from under an acre up to five acres and more, with several properties backing to conservation land. Homes range from roughly 3,000 to over 6,000 square feet, most with 4 to 6 bedrooms and 3 or more bathrooms. Expect custom built ranch and two story homes, split floor plans, and pool homes on nearly every street.</p>
      <p>Recent Southoak sales back this up. In the last six months, two confirmed Southoak homes sold, a 3,002 square foot home for $666,444 and a 3,706 square foot home for $804,000, both landing in the $217 to $222 per square foot range and both under contract within three weeks. Active listings as of July 2026 span a 2,431 square foot pool home at $575,000 up to a 4,580 square foot estate on Centerbrook Drive at $1,000,000. That is a small sample of recent activity, so treat it as a range rather than a fixed number, and always run a current comp before pricing a specific home. Southoak is deed restricted with a mandatory HOA, the South Oak Community Association, with annual dues confirmed at $500 to $550 depending on section. No CDD. Golf carts are allowed in the community, a nice lifestyle perk on these bigger lots.</p>
      <p>One more thing that matters here and does not show up on a typical listing photo: homes in Southoak are on septic tanks, not county sewer, and while public water reaches the house in most sections, a lot of lots also have a private well just for lawn irrigation. Both of those are normal for this part of unincorporated Hillsborough, but they change the inspection checklist and the ongoing cost of ownership, so factor them into any offer or listing conversation.</p>

      <h3>What It's Like Living in Southoak</h3>
      <p>Southoak has a quiet, spread out feel that is rare this close to <a href="/brandon/">Brandon</a> and <a href="/valrico/">Valrico</a>. Wide lots and mature oaks give you real privacy and room to spread out, whether that means a boat, a workshop, or just space between you and the neighbors. It is the kind of neighborhood where custom home buyers and hobby farm buyers end up looking, without giving up a short drive to everyday conveniences.</p>
      <p>Southoak is zoned for Cimino Elementary, Burns Middle School, and Bloomingdale High School, a strong set of assignments for this part of Hillsborough County. School boundaries can still shift over time, so it is worth a quick confirmation on any specific address before writing an offer.</p>
      <p>Residents get full access to the broader Bloomingdale infrastructure: the Bloomingdale Golfers Club, the Campo Family YMCA, Bloomingdale East and West Parks, and the Bloomingdale Regional Library, all a short drive away.</p>

      <h3>Southoak Location and Nearby Conveniences</h3>
      <p>Southoak is accessed off Bell Shoals Road via Flatwood Court, positioned between the core <a href="/bloomingdale/">Bloomingdale</a> community and <a href="/fishhawk-ranch/">FishHawk Ranch</a>. That location puts you close to the Alafia River and its state park and canoe launches, a genuine outdoor perk for an established neighborhood this close to town.</p>
      <p>Commuters have easy access to SR-60, I-75, and the Selmon Expressway toward downtown Tampa. Everyday shopping, restaurants, and medical care run along the Bloomingdale Avenue and Lithia Pinecrest Road corridors, with HCA Florida Brandon Hospital as the closest major medical facility.</p>

      <h3>Why Work with Barrett Henry in Southoak</h3>
      <p>I have spent 23+ years working every corner of the Bloomingdale area, and Southoak is exactly the kind of neighborhood where local knowledge matters. Acreage homes do not comp like tract homes. Lot size, conservation setbacks, septic tank age and drainfield condition, whether a lot has its own irrigation well, and any outbuildings all move the number, and pricing it wrong in either direction costs you money.</p>
      <p>As a REALTOR with REMAX Collective, I also bring <a href="https://bestbayservices.com" target="_blank" rel="noopener">Best Bay Services</a> to the table, a handyman and home services company run by my husband James Evans, for pre-listing repairs, inspection items, and ongoing maintenance. That is a real advantage whether you are prepping a Southoak home to sell or settling into one you just bought.</p>
      <p><strong>MOVE WITH CONFIDENCE. Straight talk. Smart Strategy.</strong></p>
      <p>Phone: <a href="tel:+18137337907">(813) 733-7907</a> | Email: <a href="mailto:barrett@nowtb.com">barrett@nowtb.com</a></p>

      <h3>See Southoak in Action</h3>
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%">
        <iframe src="https://www.youtube.com/embed/Dy3SdClI2DM"
          style="position:absolute;top:0;left:0;width:100%;height:100%"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
      <!-- Photo gallery placeholder - add neighborhood photos to /public/images/neighborhoods/southoak/ -->
    `,
  },

  // ===== STERLING RANCH =====

  "sterling-ranch": {
    summary:
      "Brandon subdivision from the 2000s with a community pool, solid construction, and a convenient location between the SR-60 corridor and quieter residential streets.",
    contentHtml: `
      <p>Sterling Ranch is a 2000s subdivision in Brandon that represents the standard for what good suburban construction looked like in that era: concrete block, tile or shingle roofs, screened lanais, two-car garages, and open-concept living areas. It's not flashy, but it's solid and it holds up well.</p>
      <p>Homes are predominantly 3 and 4 bedrooms, ranging from about 1,600 to 2,600 square feet. The community has a pool and playground, maintained through an HOA with fees that are reasonable for the amenity level. The neighborhood layout has sidewalks throughout, and the streets see the kind of foot traffic — dog walkers, kids on bikes — that indicates a livable, engaged community.</p>
      <p>Location is one of Sterling Ranch's strengths. You're well-positioned in Brandon without being directly on SR-60's commercial strip — close enough for convenience, far enough to feel residential. The Selmon Expressway and I-75 are both accessible without a long drive, making Tampa and the broader metro area manageable for commuters.</p>
      <p>Hillsborough County schools serve the area. School assignments depend on specific address; some sections of Sterling Ranch fall in well-regarded zones for all three levels. Verify using the district's address lookup.</p>
      <p>For buyers who want something newer than Brandon's 1980s and 90s stock without the premium — or the CDD fees — of more recent gated communities, Sterling Ranch is worth a serious look. The main thing to check at the 15-20 year mark: roof age and HVAC service history. A lot of homes from this era are on their first roof replacement cycle.</p>
    `,
  },

  // ===== THE RETREAT =====

  "the-retreat": {
    summary:
      "Gated Brandon community with larger homes, a community pool, and a quieter setting that earns its name — away from the main commercial corridors.",
    contentHtml: `
      <p>The Retreat is a gated community in Brandon that lives up to what the name implies. It's set back from the busiest parts of Brandon's commercial landscape, and the gated entry and community layout create a more private atmosphere than you'll find in most of the surrounding area.</p>
      <p>Homes are on the larger end for Brandon — most are in the 2,200 to 3,500 square foot range, with 4 and 5 bedroom floor plans well-represented. Construction spans the late 1990s through 2000s. The lots tend to be more generous than newer developments, and many homes have pools or the space to add one.</p>
      <p>The community pool, common areas, and gated entry are maintained through the HOA. Fees are higher than non-gated communities — that's the standard exchange for the gated setting and amenities. If gated living is important to you, The Retreat delivers it well. If you're indifferent to gates and would rather have the fee money in your pocket, there are non-gated Brandon neighborhoods with comparable home sizes at lower overall cost.</p>
      <p>Access to the Selmon Expressway keeps Tampa commutes manageable. The SR-60 commercial corridor is accessible without being the immediate neighbor. School zones are through Hillsborough County — verify by address.</p>
      <p>The Retreat attracts buyers who want space, privacy, and the security perception of gated living without going all the way to a golf course country club community. For that buyer profile, it consistently delivers. Just run the full cost comparison: mortgage plus HOA fees versus a comparable non-gated home before assuming the gated premium is worth it for your situation.</p>
    `,
  },

  // ===== TWIN LAKES =====

  "twin-lakes": {
    summary:
      "Brandon neighborhood built around two lakes with water views on some lots, mature landscaping, and homes from multiple decades of development.",
    contentHtml: `
      <p>Twin Lakes is named for the two lakes that anchor the neighborhood's layout. It's one of those communities where the water features genuinely shape the character of the area — the lakes provide natural buffers between sections, create open sightlines, and give the neighborhood a more spacious feel than the square footage numbers alone suggest.</p>
      <p>Development here spans several decades, from the 1980s through the early 2000s, which creates a range of home ages, sizes, and conditions within the same community. You'll find original 1980s ranch homes alongside more recently updated properties, and some lots with lake frontage or views priced at a premium over interior lots.</p>
      <p>For lakefront lots specifically: pull the FEMA flood map for the exact parcel. Most of Twin Lakes is Zone X, but lower-lying areas near the lake margins can be Zone AE. It matters for both your insurance costs and your mortgage requirements — don't assume based on what neighboring properties look like.</p>
      <p>The HOA covers common areas and the lake maintenance; dues are reasonable. The neighborhood's central Brandon location gives you access to the SR-60 corridor and the Selmon Expressway without being immediately adjacent to the commercial activity.</p>
      <p>For buyers comparing Twin Lakes to newer Brandon communities, the value proposition is the lot size and the water access — features that aren't available in recent construction at comparable prices. The trade-off is that older homes require more attention and potentially more near-term investment in updates.</p>
    `,
  },

  // ===== VILLAGE GREEN =====

  "village-green": {
    summary:
      "One of Brandon's older established neighborhoods, with large lots, no CDD, mature landscaping, and a diversity of home styles that newer subdivisions lack.",
    contentHtml: `
      <p>Village Green is among Brandon's more established neighborhoods — homes here date from the 1970s through the 1990s, giving the area the kind of mature, rooted character that takes decades to develop. Large lots are the norm, and the tree coverage throughout the neighborhood reflects 40-plus years of growth.</p>
      <p>Home sizes vary considerably, from smaller 3-bedroom ranches to larger custom-built homes that were added over the community's development period. That variety is genuine — you'll find significantly different floor plans and lot configurations within the same neighborhood, which creates a diverse range of price points and options.</p>
      <p>There's no CDD here, which is worth noting when you're comparing Village Green to newer Brandon communities that carry those fees. The HOA is minimal in most sections — limited covenants rather than an active management organization in many parts of the neighborhood. For buyers who want to own without the overhead and restrictions of an active HOA, Village Green checks that box.</p>
      <p>Central Brandon location means you're well-positioned for everyday life — the SR-60 commercial corridor, the Westfield Brandon mall area, restaurants, and medical offices are all accessible. The Selmon Expressway is reachable for Tampa commuters. Hillsborough County schools serve the area with assignments by specific address.</p>
      <p>The honest trade-off with a 1970s-1990s neighborhood: inspect carefully. The oldest homes here are over 50 years old, and while well-maintained properties can be excellent values, you want to know the condition of the roof, electrical system, plumbing, and HVAC before closing. Older construction can mean older materials — polybutylene pipe, original electrical panels, flat roofs on additions — that represent real cost to address. A thorough inspection is essential.</p>
    `,
  },

}
