// =============================================================================
// Neighborhood descriptions — real, useful writeups for key neighborhoods
// Used by NeighborhoodPage when no WordPress content exists.
// Written in natural language — no keyword stuffing, just honest info
// someone would want before touring a neighborhood.
// =============================================================================

export interface NeighborhoodDescription {
  /** Short 1-2 sentence summary shown in grid cards and meta descriptions */
  summary: string;
  /** Full HTML content for the neighborhood page body */
  contentHtml: string;
}

/**
 * Key = neighborhood slug (must match the slug in neighborhoods.ts)
 * Only add entries for neighborhoods worth writing about — not every
 * subdivision needs a custom description.
 */
import { BRANDON_NEIGHBORHOOD_DESCRIPTIONS } from "./brandon-content";

export const NEIGHBORHOOD_DESCRIPTIONS: Record<string, NeighborhoodDescription> = {
  ...BRANDON_NEIGHBORHOOD_DESCRIPTIONS,

  // ===== BLOOMINGDALE FAMILY =====

  "bloomingdale-community": {
    summary:
      "One of Valrico's largest and most established communities, built mostly in the 1980s and 90s with a mix of home styles and an active community association.",
    contentHtml: `
      <p>Bloomingdale is one of the biggest master-planned communities in the Valrico/Brandon area. Most homes were built between the early 1980s and mid-1990s, so you'll see a range of styles — from smaller ranch homes to larger two-story colonials. Lot sizes are modest by today's standards but generous compared to newer construction.</p>
      <p>The community is known for its network of trails, playgrounds, and common areas maintained by the Bloomingdale Community Association. The former Bloomingdale Golf Course has been a topic of local discussion for years — it closed and the land has been going through the redevelopment process.</p>
      <p>Schools are a big draw. Bloomingdale High School is right in the community, and elementary-age kids attend Bloomingdale Elementary or Cimino Elementary depending on where in the neighborhood you are. Randall Middle School serves the area.</p>
      <p>Location-wise, Bloomingdale sits right along Bloomingdale Avenue with quick access to the Selmon Expressway for commuters heading into Tampa. Shopping along Bell Shoals Road and Bloomingdale Avenue is within a few minutes of most homes in the community.</p>
      <p>Expect HOA dues in most sections — they're typically reasonable and cover the common areas and community amenities. Homes here tend to price below newer construction in the area, which makes Bloomingdale popular with first-time buyers and families looking for more square footage per dollar.</p>
    `,
  },

  "river-hills-country-club": {
    summary:
      "Gated golf course community in south Valrico with larger homes, mature landscaping, and a country club lifestyle.",
    contentHtml: `
      <p>River Hills is a gated community in the southern part of Valrico built around the River Hills Country Club golf course. Homes here are generally larger — most are 2,000 to 4,000+ square feet — and sit on bigger lots than you'll find in the typical Valrico subdivision.</p>
      <p>The neighborhood was developed primarily in the 1990s and 2000s, so the landscaping is mature with large oaks and well-established yards. The gated entry and country club setting give it a different feel from the more open neighborhoods nearby.</p>
      <p>Golf club membership is optional — you can live in River Hills without joining the club. The course itself is well-maintained and the clubhouse hosts events and dining. There's also a community pool and tennis courts.</p>
      <p>School zones here typically fall under Durant High School, which is just a few minutes east on Durant Road. For families, the combination of good schools, a gated community, and the extra space makes River Hills one of the more sought-after Valrico addresses.</p>
      <p>One thing to know: HOA fees here are higher than average because of the gated entry and community amenities. And if you're on the golf course, you'll want to factor in potential golf ball damage and the restrictions that come with course-adjacent lots.</p>
    `,
  },

  "diamond-hill": {
    summary:
      "Established Valrico neighborhood with larger lots, no HOA in many sections, and a mix of older and updated homes along Durant Road.",
    contentHtml: `
      <p>Diamond Hill is one of Valrico's more established neighborhoods, with many homes dating back to the 1970s and 1980s. What sets it apart from newer subdivisions is the lot sizes — half-acre to one-acre parcels are common here, which is increasingly rare in the area.</p>
      <p>A big selling point for many buyers: large sections of Diamond Hill have no HOA. That means no restrictions on parking your boat in the driveway, no approval process for paint colors, and no monthly fees. For buyers who value that kind of freedom, Diamond Hill is one of the go-to neighborhoods.</p>
      <p>The homes themselves vary quite a bit. You'll find original 1970s block construction alongside fully renovated properties and some newer infill builds. Prices reflect that range — a fixer-upper on a big lot will be priced very differently from a recently updated home next door.</p>
      <p>Location is solid. Diamond Hill is near Durant Road with easy access to both Valrico's main corridors and the more rural areas to the east toward Lithia and Plant City. Durant High School is nearby, and Buckhorn Elementary serves part of the area.</p>
      <p>If you're considering Diamond Hill, bring your inspector and look closely at the older homes — roof age, plumbing type (some older homes have polybutylene), and septic vs. sewer connections are all things worth checking early.</p>
    `,
  },

  // ===== BUCKHORN FAMILY =====

  "buckhorn-preserve": {
    summary:
      "Newer subdivision near Buckhorn Elementary with community amenities, an active HOA, and homes built in the 2000s and 2010s.",
    contentHtml: `
      <p>Buckhorn Preserve is one of several neighborhoods in the Buckhorn area of Valrico, and it's among the newer ones — most homes were built in the 2000s and early 2010s. Construction quality is generally solid, with concrete block and barrel tile roofs common throughout.</p>
      <p>The subdivision has a community pool and playground, maintained through the HOA. Fees are in the typical range for the area. Homes are mostly 3-4 bedrooms with two-car garages, ranging from about 1,600 to 2,800 square feet.</p>
      <p>The big draw is school zoning — Buckhorn Elementary is literally next door, which matters if you've got young kids. The middle and high school zones are also well-regarded.</p>
      <p>Access is straightforward. You're close to both Bloomingdale Avenue and Lithia-Pinecrest Road, so getting to the Selmon Expressway or I-75 doesn't take long. Shopping and restaurants along SR-60 are about 10 minutes away.</p>
    `,
  },

  "buckhorn-springs": {
    summary:
      "Family-friendly Valrico subdivision in the Buckhorn school zone with community pool, playground, and homes from the early 2000s.",
    contentHtml: `
      <p>Buckhorn Springs is a well-kept subdivision in the Buckhorn area of Valrico, with most homes built in the early to mid-2000s. It's a classic suburban neighborhood — sidewalks, community pool, playground, and a homeowners association that keeps the common areas maintained.</p>
      <p>Homes are primarily 3 and 4 bedrooms, most with two-car garages and screened-in lanais. Square footage ranges from about 1,500 to 2,500. The streets are relatively quiet with cul-de-sacs throughout, which families with younger kids tend to appreciate.</p>
      <p>School zoning is one of the main reasons people look at Buckhorn Springs — Buckhorn Elementary is close by and consistently rated well. Middle and high school assignments round out a solid school path.</p>
      <p>The neighborhood is positioned well for commuters. Lithia-Pinecrest Road and Bloomingdale Avenue are both accessible within a few minutes, connecting to the Selmon Expressway and I-75.</p>
    `,
  },

  // ===== BRENTWOOD HILLS =====

  "brentwood-hills-community": {
    summary:
      "Well-established Valrico community near Bloomingdale Avenue with mature trees, larger lots, and homes from the 1980s and 90s.",
    contentHtml: `
      <p>Brentwood Hills is one of those Valrico neighborhoods that has aged well. Homes were built mostly in the late 1980s and 1990s, and the mature oak trees and established landscaping give the community a settled, shaded feel that newer subdivisions can't match.</p>
      <p>Lot sizes here are generally larger than what you'd find in developments built after 2000. Most homes are 3-4 bedrooms in the 1,500 to 2,500 square foot range, with a mix of one and two-story floor plans.</p>
      <p>The community has an HOA, but dues are typically modest. There's no gated entry or elaborate amenities — it's a straightforward residential neighborhood where the appeal is the homes themselves and the location.</p>
      <p>Bloomingdale Avenue access is a few minutes away, putting you close to shopping, restaurants, and the commuter routes into Tampa. Schools in the area include Cimino Elementary and Bloomingdale High School, depending on the specific section.</p>
      <p>For buyers, the value proposition is clear: you get more house and more yard for the money compared to newer construction, in a location that's hard to beat. Just budget for potential updates — kitchens and bathrooms in some of the original homes are showing their age.</p>
    `,
  },

  // ===== DURANT AREA =====

  "durant-estates": {
    summary:
      "Spacious Valrico homes near Durant High School, many on half-acre or larger lots with a more rural feel than western Valrico.",
    contentHtml: `
      <p>Durant Estates sits in the eastern part of Valrico, and it feels different from the denser subdivisions closer to Brandon. Lots here are often a half-acre or larger, and the spacing between homes gives the neighborhood a more open, semi-rural character.</p>
      <p>Homes are a mix of ages — some from the 1990s, others newer. Many are larger single-family homes with 4+ bedrooms and generous floor plans. You'll see properties with workshops, RV parking, and room for a pool that would be hard to find in the more compact western Valrico neighborhoods.</p>
      <p>The name gives away the school connection — Durant High School is nearby, and the area is well-served by Hillsborough County schools. For families who want the school zoning without the density of a typical subdivision, this area checks a lot of boxes.</p>
      <p>One trade-off: you're a bit farther from the main shopping corridors along SR-60 and Bloomingdale Avenue. Most errands are a 10-15 minute drive. If you work in Tampa, the commute will be on the longer side of what Valrico offers.</p>
    `,
  },

  // ===== COPPER RIDGE =====

  "copper-ridge": {
    summary:
      "Newer gated community in Valrico with modern homes, community amenities, and a clean, well-maintained streetscape.",
    contentHtml: `
      <p>Copper Ridge is one of Valrico's newer gated communities, with homes built primarily in the 2010s. The neighborhood has a clean, well-maintained appearance — newer construction, consistent architectural standards, and landscaped common areas throughout.</p>
      <p>Homes are mostly 3 to 5 bedrooms, ranging from about 1,800 to 3,200 square feet. Floor plans tend to be open-concept with the modern touches buyers expect — granite or quartz counters, tile throughout the main living areas, and covered lanais.</p>
      <p>The gated entry and community pool are maintained through the HOA, and fees reflect the amenities — expect them to be higher than older, non-gated communities in the area. CDD fees may also apply, so ask about the total carrying cost before making an offer.</p>
      <p>Location puts you close to the Bloomingdale/Lithia-Pinecrest corridor with reasonable access to the Selmon and I-75 for commuters. Buckhorn Elementary and Durant High School zones typically serve this area.</p>
    `,
  },

  // ===== EAGLES LANDING =====

  "eagles-landing": {
    summary:
      "Popular Valrico subdivision with a community pool, playground, and homes built in the 2000s — a go-to for families.",
    contentHtml: `
      <p>Eagles Landing is a mid-2000s subdivision that has become one of the more popular family neighborhoods in Valrico. The community has a pool, playground, and basketball court, and the HOA keeps the common areas well-maintained.</p>
      <p>Homes are predominantly 3-4 bedrooms, two-car garage, with screened lanais — the standard Valrico suburban setup. Square footage is typically 1,600 to 2,600. Construction is concrete block with barrel tile or shingle roofs.</p>
      <p>The streets are wide with sidewalks on both sides, and there are enough cul-de-sacs to keep through-traffic minimal. It's the kind of neighborhood where kids ride bikes and play in front yards — which is exactly why it appeals to the families who buy here.</p>
      <p>School assignments are strong, and the location gives you access to both the Bloomingdale Avenue shopping corridor and the quieter eastern Valrico roads. Commute times into Tampa are typical for the area — 25 to 40 minutes depending on the route and time of day.</p>
    `,
  },

  // ===== VALRICO VILLAGE / GROVES / OAKS =====

  "valrico-village": {
    summary:
      "Small, established Valrico neighborhood with a tight-knit feel and homes from the 1980s and 90s on tree-lined streets.",
    contentHtml: `
      <p>Valrico Village is a smaller, established neighborhood with homes built primarily in the 1980s and 1990s. It's not a large subdivision — the tight-knit size is part of its appeal for buyers who prefer a quieter community without hundreds of homes and a complicated HOA.</p>
      <p>Homes are mostly 3-bedroom ranch-style with some two-story layouts mixed in. Square footage runs from about 1,200 to 2,000. Lots are reasonably sized with mature landscaping throughout.</p>
      <p>The location works well — close enough to the main Valrico corridors for convenience, but tucked away enough to feel removed from the busier roads. It's a straightforward neighborhood where the homes do the talking.</p>
    `,
  },

  "valrico-groves": {
    summary:
      "Quiet Valrico neighborhood with generous lot sizes, mature citrus and oak trees, and a mix of original and updated homes.",
    contentHtml: `
      <p>Valrico Groves lives up to its name — the neighborhood has mature citrus and oak trees throughout, giving it a shaded, established character. Homes here were built across several decades, so you'll see a range from 1970s-era block construction to renovated or rebuilt properties.</p>
      <p>Lot sizes tend to be generous by Valrico standards, and many homeowners have taken advantage of the extra space for pools, detached garages, or garden areas. Some lots back up to small natural areas or drainage retention ponds.</p>
      <p>There's minimal HOA presence in most sections, which appeals to buyers who don't want to deal with architectural review committees. The neighborhood has a low-key feel — it's not flashy, but for buyers who value space and established landscaping over new construction amenities, it's worth a look.</p>
    `,
  },

  "valrico-oaks": {
    summary:
      "Tree-lined Valrico neighborhood with a community feel, moderate HOA, and solid school zoning.",
    contentHtml: `
      <p>Valrico Oaks is a residential neighborhood with — you guessed it — a lot of oak trees. The canopy coverage gives the streets a shaded, comfortable feel, especially during Tampa Bay's summer months.</p>
      <p>Homes are mostly from the 1990s and early 2000s, with a typical layout of 3-4 bedrooms, two-car garages, and screened lanais or patios. The neighborhood has a community feel without being oversized — it's large enough to have amenities but small enough that neighbors actually recognize each other.</p>
      <p>HOA fees are moderate, covering common areas and basic maintenance. School zoning is solid for the area, and the location provides easy access to both SR-60 and Bloomingdale Avenue for shopping and commuting.</p>
    `,
  },

  // ===== HERITAGE CREST =====

  "heritage-crest": {
    summary:
      "Well-maintained Valrico subdivision with newer homes, a community pool, and convenient access to major roads.",
    contentHtml: `
      <p>Heritage Crest is a well-maintained subdivision in Valrico with homes built primarily in the mid-2000s to 2010s. The community has a clean, organized feel — consistent architectural standards, sidewalks, and landscaped entrances.</p>
      <p>Homes range from about 1,800 to 3,000 square feet, with 3-5 bedroom floor plans. Most have two-car garages, covered lanais, and the open-concept layouts that have become standard in Florida construction.</p>
      <p>There's a community pool and common areas maintained by the HOA. Fees are in line with what you'd expect for a community of this size and age. The streets are well-lit with good sidewalk coverage throughout.</p>
      <p>Access to Bloomingdale Avenue and Lithia-Pinecrest Road is convenient, making errands and commuting straightforward. It's a solid, no-surprises kind of neighborhood — well-built homes in good condition with the amenities families expect.</p>
    `,
  },

  // ===== BENT TREE FAMILY =====

  "bent-tree": {
    summary:
      "Popular Valrico subdivision with a community pool, tennis courts, and homes in the Newsome High School zone.",
    contentHtml: `
      <p>Bent Tree is a well-known Valrico subdivision that has been popular with families for years. The community has a pool, tennis courts, and playground — amenities that get regular use, especially during the school year.</p>
      <p>Homes were built across several phases, generally from the late 1990s through the 2000s. You'll find a range of sizes from around 1,500 to 2,800 square feet, mostly 3-4 bedrooms with two-car garages. The neighborhood is broken into a few sub-sections (Bent Tree Estates, Bent Tree South) that share the community amenities.</p>
      <p>School zoning has historically been one of the draws — Newsome High School, in particular, has a strong reputation. Families planning for the long term tend to pay attention to high school zones, and Bent Tree's zoning has held up well.</p>
      <p>The neighborhood is located along the Lithia-Pinecrest corridor, giving you access to both the quieter eastern reaches of Valrico and the shopping and dining closer to Brandon.</p>
    `,
  },

  // ===== BLOOMINGDALE OAKS =====

  "bloomingdale-oaks-community": {
    summary:
      "Established Valrico community in the heart of the Bloomingdale area with mature landscaping, a community pool, and Bloomingdale High School zoning.",
    contentHtml: `
      <p>Bloomingdale Oaks sits in the heart of the broader Bloomingdale community in Valrico, sharing the same general area and school zones as its neighbors. Most homes date from the late 1980s to mid-1990s — a sweet spot that means the neighborhood is fully established without the deferred maintenance issues you sometimes see in older communities.</p>
      <p>The community has a pool and common areas maintained by the HOA. Dues are reasonable. Homes are primarily 3-4 bedrooms in the 1,400 to 2,200 square foot range, with a mix of single and two-story layouts.</p>
      <p>Bloomingdale High School zoning is a consistent draw for families. Elementary and middle school assignments are also strong, and the proximity to Bloomingdale Avenue makes the daily school run easy.</p>
      <p>For buyers on a budget, Bloomingdale Oaks often prices below the newer construction in the area while offering comparable square footage and better lot sizes. The trade-off is cosmetic — expect to update kitchens and bathrooms in some of the original homes.</p>
    `,
  },

  // ===== CAMPOS =====

  "campos-valrico": {
    summary:
      "Small, quiet Valrico neighborhood with homes on larger lots, no CDD, and a convenient location near Bloomingdale Avenue.",
    contentHtml: `
      <p>Campos is a smaller neighborhood in Valrico that doesn't get a lot of attention — which is part of what some buyers like about it. It's not a massive subdivision with a branded entrance and amenity center. It's just a well-situated residential neighborhood with homes on decent-sized lots.</p>
      <p>Homes here are a mix of ages and styles, generally from the 1980s through 2000s. Lot sizes tend to be larger than what you'll find in the cookie-cutter developments, and there's no CDD (Community Development District) fee layered on top of property taxes.</p>
      <p>The location near Bloomingdale Avenue is genuinely convenient — grocery stores, restaurants, and the Selmon Expressway entrance are all close. If you work in Tampa and want a short commute by Valrico standards, Campos delivers without the price premium of gated communities.</p>
    `,
  },

  // ===== BRANDON LAKES =====

  "brandon-lakes": {
    summary:
      "Lakefront community on the Valrico/Brandon line with water views, mature trees, and a mix of updated and original homes.",
    contentHtml: `
      <p>Brandon Lakes straddles the Valrico/Brandon line and centers around several small lakes that give the community its name and character. Some homes here have direct water views — a feature that's increasingly hard to find at non-luxury prices in the Tampa Bay area.</p>
      <p>The neighborhood was built primarily in the 1980s and 1990s. Homes range from about 1,200 to 2,500 square feet, with a mix of ranch-style and two-story layouts. Many have been updated over the years, but you'll still find original-condition homes priced accordingly.</p>
      <p>Mature trees and established landscaping give Brandon Lakes a settled feel. The lake views and natural areas create buffer zones between sections of the neighborhood, so it doesn't feel as dense as some of the newer developments despite its relatively central location.</p>
      <p>Access to SR-60 and Bloomingdale Avenue is easy, and the Westfield Brandon mall area is a short drive north. Schools are in the Hillsborough County system with assignments varying by specific address.</p>
    `,
  },

  // ===== ARBOR RESERVE =====

  "arbor-reserve": {
    summary:
      "Newer Valrico community with modern floor plans, energy-efficient construction, and a community pool — a solid pick for move-in-ready buyers.",
    contentHtml: `
      <p>Arbor Reserve is one of Valrico's newer communities, with homes built in the 2010s. If you're looking for something move-in-ready without the project of updating an older home, this is the kind of neighborhood to consider.</p>
      <p>Construction is modern — impact-rated windows, higher-efficiency HVAC systems, open floor plans with islands and walk-in pantries. Homes are mostly 3-5 bedrooms, ranging from about 1,800 to 3,200 square feet.</p>
      <p>The community has a pool and common areas. HOA fees and CDD assessments both apply here, so make sure you're factoring in the full monthly carrying cost beyond just the mortgage payment. It's a common oversight, especially for first-time buyers.</p>
      <p>School zoning and location are typical for central Valrico — solid schools and reasonable access to the main commuter routes. The surrounding area has seen steady development, so amenities and services continue to improve.</p>
    `,
  },

  // ===== VALRICO HILLS =====

  "valrico-hills": {
    summary:
      "One of Valrico's original neighborhoods with character homes, large lots, and no HOA — great for buyers who want space and freedom.",
    contentHtml: `
      <p>Valrico Hills is one of the area's older neighborhoods, and it has a character that newer subdivisions simply can't replicate. Lots are large — often a quarter-acre or more — and the mature landscaping creates a canopy that keeps things shaded and private.</p>
      <p>Homes here span from the 1960s through the 1990s. You'll find everything from modest 3-bedroom ranches to larger custom-built homes. The variety means there's a wide price range within the same neighborhood.</p>
      <p>No HOA is a significant draw for many buyers. You can park your truck, build a workshop, or let your yard grow a little wild without getting a letter from a review committee. For some buyers, that freedom is worth more than a community pool.</p>
      <p>The trade-off with older homes is always the same: budget for updates and inspections. Roofs, plumbing, electrical panels, and HVAC systems all have useful lifespans, and homes from the 1960s-70s may need attention in one or more of those areas. That said, a well-maintained Valrico Hills home on a big lot is hard to beat for the price.</p>
    `,
  },

  // ===== VALRICO FOREST =====

  "valrico-forest": {
    summary:
      "Quiet, tree-covered Valrico neighborhood with a private feel, homes from the 1980s and 90s, and easy access to Lithia-Pinecrest Road.",
    contentHtml: `
      <p>Valrico Forest earned its name — the neighborhood is heavily treed, giving it a private, tucked-away feel despite being close to one of Valrico's main roads. If you like the idea of having woods behind your house rather than another row of rooftops, this might be your spot.</p>
      <p>Homes were built mostly in the 1980s and 1990s. They're well-spaced, typically 3-4 bedrooms, and sit on lots that range from a quarter-acre to nearly an acre in some spots. The construction is mostly concrete block, which is standard and holds up well in Florida.</p>
      <p>The community is quiet and residential. There's no community pool or clubhouse — it's just a neighborhood of homes with natural surroundings. HOA presence is minimal, though some sections have basic covenants.</p>
      <p>Lithia-Pinecrest Road is the main access, connecting you south toward Lithia and FishHawk or north to the Bloomingdale area and beyond. It's not the most direct route into Tampa, but for people who work in Brandon, Riverview, or along the I-75 corridor, the commute is manageable.</p>
    `,
  },
};
