/**
 * Comparison data: 10308 Holland Rd vs 13805 Tonya Anne Dr
 * Both in Riverview, FL. Created for buyer decision tool.
 */
import { Comparison } from './types';

export const hollandVsTonyaAnne: Comparison = {
  slug: 'holland-vs-tonya-anne',
  title: 'Holland Rd vs Tonya Anne Dr',
  subtitle:
    'Two good houses, two very different deals. Change any number below and the totals update instantly. Nothing here is locked in, so play with it until it looks like your real life.',
  buyerFirstName: undefined,
  createdAt: '2026-07-18',
  noindex: true,
  sqftA: 2029,
  sqftB: 2484,

  properties: [
    {
      address: '10308 Holland Rd',
      neighborhood: 'Avelar Creek North',
      zipCode: '33578',
      priceLabel: '$400,000',
      priceNote:
        'Listed $409,000, started at $419,000. We offered $370,000, seller countered $400,000. On market 261 days.',
      photo: '/compare/holland-vs-tonya-anne/10308-holland-rd.jpg',
      photoAlt: 'Front exterior of 10308 Holland Rd, Riverview FL',
      facts: [
        { label: 'Built', value: '2013' },
        { label: 'Beds / Baths', value: '3 bed, 2 bath' },
        { label: 'Bonus rooms', value: 'One den/office off the entry' },
        {
          label: 'Total enclosed rooms',
          value: '4, not counting living and dining',
        },
        { label: 'Living area', value: '2,029 sq ft' },
        { label: 'Lot size', value: '0.25 acres, 10,923 sq ft' },
        { label: 'Days on market', value: '261' },
        { label: 'Garage', value: '3 car' },
        { label: 'Stories', value: 'Single story' },
        {
          label: 'Gas',
          value:
            'Yes. Gas range and gas water heater confirmed.',
        },
        {
          label: 'Water heater',
          value:
            'Gas. Replaced since 2023, so not an immediate expense',
        },
        {
          label: 'Kitchen',
          value: 'Granite, 42 inch wood cabinets, stainless, gas stove',
        },
        {
          label: 'Outdoor',
          value: 'Extended screened lanai, private jacuzzi, fenced yard',
        },
        {
          label: 'Extras',
          value:
            'Hurricane shutters, plantation shutters, attic fan, irrigation system, new irrigation controller 2026, disposal 2024',
        },
        { label: 'Privacy', value: 'No direct front or rear neighbors' },
        { label: 'Solar', value: 'None' },
        { label: 'Roof', value: 'Original 2013. Replacement expected' },
        {
          label: 'HOA',
          value: '$150 a year. Clubhouse, pool, playground',
        },
        {
          label: 'CDD',
          value:
            'Yes. $2,175 a year on the county tax bill. The district was formed in 2005, so the bond portion likely retires in the mid 2030s',
        },
        {
          label: '2025 tax bill',
          value: '$10,434 total, including the $2,175 CDD',
        },
        {
          label: 'Estimated market value',
          value: '$403,400, with a high confidence rating',
        },
        {
          label: 'Ownership',
          value: 'Owner occupied. Paid $417,900 in July 2023',
        },
        {
          label: 'Sale attempts',
          value:
            'Has been trying to sell since July 2024. First asked $479,000',
        },
      ],
      pros: [
        'Bigger lot. 0.25 acres against 0.17, roughly 46 percent more land.',
        'Hurricane shutters already installed, which helps the insurance rate.',
        'No direct front or rear neighbors.',
        'Very low HOA at $150 a year, and a smaller district assessment than South Fork.',
        'Lower total tax bill. About $128 a month less than Tonya Anne once both are homesteaded.',
        'Its district was formed in 2005, so the bond portion of the assessment likely retires in the mid 2030s. South Fork\'s runs decades longer.',
        'Water heater has already been replaced, so that expense is behind you.',
        'Screened lanai and jacuzzi already in place.',
        'Fenced yard already done.',
        'Closer in to Brandon, Tampa and I-75 via US-301.',
        'The listing states the sellers are motivated and will consider buyer concessions. After 261 days there is real room to negotiate.',
      ],
      cons: [
        'Roof is at end of life. Insurability and premium are affected until replaced.',
        'Flooring needs replacing.',
        'Windows are not impact glass. Protection is shutters you have to put up by hand.',
        'Carries a $2,175 a year district assessment on top of regular property taxes, though this is the smaller of the two.',
        'Gas lines are confirmed, but gas appliances need maintenance and eventual replacement that all-electric homes avoid.',
        'The kitchen layout is not what you want.',
        'Two fewer enclosed rooms. One bedroom and one flex room short of Tonya Anne.',
        'About 455 fewer square feet.',
        'Not move-in ready. The work happens either before you move in or while you live there.',
      ],
      photoPros: [
        'Strong roofline with a high peak and front-facing gable that gives the house more vertical presence than its square footage suggests.',
        'Three car garage is fully visible from the street and makes the home look substantial.',
        'Mature landscaping and a large shade tree give the front yard texture and curb appeal that new builds do not have.',
        'Driveway is clean and wide, pavers or stamped at the entry, adds a finished look.',
        'Side yard is open and green, reinforcing the larger lot. No neighbors crowding the frame.',
      ],
      photoCons: [
        'Roof color is visibly faded and chalky compared to a newer shingle. An inspector should confirm remaining life.',
        'Fascia or soffit along the left roofline may have a stain or discoloration. Inspect for water intrusion.',
        'Some landscaping beds look sparse at the base. Check irrigation coverage and soil condition.',
        'The garage door shows faint oxidation or weathering lines. Not structural, but the buyer may want to repaint.',
        'The photo is taken in even light, which hides flaws. Walk the exterior in full sun and look for paint fade or stucco hairline cracks.',
      ],
    },
    {
      address: '13805 Tonya Anne Dr',
      neighborhood: 'South Fork',
      zipCode: '33579',
      priceLabel: '$419,000',
      priceNote:
        'Started at $439,000, reduced twice. On market 164 days. Owned by an investment company, not a family.',
      photo: '/compare/holland-vs-tonya-anne/13805-tonya-anne-dr.jpg',
      photoAlt: 'Front exterior of 13805 Tonya Anne Dr, Riverview FL',
      facts: [
        { label: 'Built', value: '2020' },
        { label: 'Beds / Baths', value: '4 bed, 2 bath' },
        {
          label: 'Bonus rooms',
          value:
            'Dedicated office, plus a separate room with a door but no closet',
        },
        {
          label: 'Total enclosed rooms',
          value: '6, not counting living and dining',
        },
        { label: 'Living area', value: '2,484 sq ft' },
        { label: 'Lot size', value: '0.17 acres, 7,462 sq ft' },
        { label: 'Days on market', value: '164' },
        { label: 'Garage', value: '3 car' },
        { label: 'Stories', value: 'Single story' },
        { label: 'Gas', value: 'No. All electric' },
        {
          label: 'Kitchen',
          value: 'Granite island, oversized pantry, stainless, open concept',
        },
        {
          label: 'Outdoor',
          value:
            'Screened lanai, no rear neighbors. Yard needs about $1,000 to $1,500 of fencing. Lake view is described in the listing but the MLS water view field says no, so confirm in person',
        },
        {
          label: 'Extras',
          value:
            'Interior repainted 2026, new ceiling fans, appliances convey at full price',
        },
        {
          label: 'Solar',
          value:
            'Listing says fully paid, roughly $30,000 system. The MLS green energy field says none, so ownership paperwork must be confirmed before closing',
        },
        { label: 'Roof', value: '2020. Roughly 15 to 20 years of life left' },
        {
          label: 'HOA',
          value: '$180 a year. Clubhouse, pool, park, playground, racquetball',
        },
        {
          label: 'CDD',
          value:
            'Yes, about $3,318 a year. Roughly $2,475 is fixed bond debt set when the home was built, plus about $843 of yearly operations. The MLS listing incorrectly says there is none',
        },
        {
          label: 'Bond payoff option',
          value:
            'The $2,475 debt portion may be prepayable in a lump sum. Worth asking the district, since it would make this the cheaper home to own',
        },
        {
          label: 'Schools',
          value:
            'Summerfield Crossing Elementary, Eisenhower Middle, Sumner High',
        },
        {
          label: '2025 tax bill',
          value: '$9,193 total, including roughly $3,483 of district assessment',
        },
        {
          label: 'Estimated market value',
          value: '$426,900, with a high confidence rating',
        },
        {
          label: 'Ownership',
          value:
            'Owned by an investment company that paid $320,000 in November 2025 and resold it after cosmetic updates',
        },
        {
          label: 'Sale history',
          value:
            'The prior owner asked $479,900, could not sell, and sold to the investor instead',
        },
      ],
      pros: [
        'Move-in ready. No projects on day one.',
        'Seven years newer. Roof, HVAC, water heater and appliances all have life left.',
        'Six enclosed rooms against four. Four bedrooms, a dedicated office, and a separate flex room with a door.',
        'About 455 more square feet, and the extra space is in rooms you can close off rather than open area.',
        'The no-closet room is the flexible one. Guest room, gym, playroom, second office, or add a closet later and it counts as a fifth bedroom.',
        'Paid-off solar cuts the electric bill substantially.',
        'Lake view with no rear neighbors, which holds its value at resale.',
        'Yard is close to done. Roughly $1,000 to $1,500 finishes the fencing.',
        'Newer construction usually means a better insurance rate.',
        'Better community amenities. Clubhouse, pool, park, playground and racquetball.',
      ],
      cons: [
        'No natural gas. Electric cooking and electric water heater only.',
        'Smaller lot. 0.17 acres against 0.25.',
        'Owned by an investment company that bought it eight months ago and made cosmetic updates. Paint and fans are visible. What is behind them is not.',
        'Carries about $3,318 a year in district assessment, roughly $1,140 more than Holland Rd, and its bond runs far longer.',
        'Higher total tax bill by about $128 a month.',
        'Higher asking price, and we have not started a price conversation on this one yet.',
        'Solar adds a transfer step and a roof-penetration consideration at future roof replacement.',
        'Farther south, longer commute to Brandon and Tampa.',
        'About 124 days on the market with two price reductions. Worth understanding why before you commit.',
      ],
      photoPros: [
        'Roof looks clean and dark, exactly what a 2020 shingle roof should look like.',
        'Fresh, tidy presentation with a stone accent bed at the entry.',
        'Wide driveway with three garage bays.',
      ],
      photoCons: [
        'Neighbors are close on both sides. At 62 feet of frontage the houses nearly touch, which the photo makes clear.',
        'Landscaping is young and thin. The tree on the left looks bare and may be dead.',
        'Lawn has significant brown and bare patches, especially along the right side and near the street.',
        'Flatter, plainer front elevation with less architectural detail than Holland Rd.',
        'No solar panels are visible from the front, so they face the rear. Confirm the panel count and the paperwork in person.',
        'This is a dusk photo with an enhanced sky, a common technique that makes any house look better. Go see it in daylight.',
      ],
    },
  ],

  factsSectionNote:
    'Roof, HVAC and water heater ages drive most of the cost difference between these two homes. All figures are from MLS and public record and should be confirmed during inspection.',

  upfrontSectionNote:
    'Purchase price plus the money it takes to get each house to the same finished condition. Edit any white box.',

  upfrontRows: [
    {
      id: 'p',
      label: 'Purchase price',
      sublabel: 'Holland is the countered number. Tonya Anne is list.',
      defaultA: 400000,
      defaultB: 419000,
      step: 1000,
    },
    {
      id: 'roof',
      label: 'Roof replacement',
      sublabel: '2,029 sq ft shingle roof, Hillsborough pricing',
      defaultA: 18000,
      defaultB: 0,
      step: 500,
    },
    {
      id: 'hvac',
      label: 'Air conditioning system',
      sublabel:
        'A 2013 unit is at the end of its normal Florida life. Set to zero if MLS confirms it was replaced.',
      defaultA: 10000,
      defaultB: 0,
      step: 500,
    },
    {
      id: 'wh',
      label: 'Water heater',
      sublabel:
        'Gas unit replaced since 2023, so no cost expected',
      defaultA: 0,
      defaultB: 0,
      step: 100,
    },
    {
      id: 'floor',
      label: 'Flooring',
      sublabel: 'LVP throughout, materials and labor',
      defaultA: 14000,
      defaultB: 0,
      step: 500,
    },
    {
      id: 'kit',
      label: 'Kitchen changes',
      sublabel:
        'The layout changes you want. Set this to zero if you can live with the kitchen as is.',
      defaultA: 15000,
      defaultB: 0,
      step: 1000,
    },
    {
      id: 'win',
      label: 'Windows',
      sublabel: 'Impact glass upgrade. Optional, not required.',
      defaultA: 0,
      defaultB: 0,
      step: 1000,
    },
    {
      id: 'yard',
      label: 'Fence and yard',
      sublabel:
        'Holland Rd is already fenced. Tonya Anne needs a section finished.',
      defaultA: 0,
      defaultB: 1250,
      step: 250,
    },
    {
      id: 'other',
      label: 'Other repairs or wants',
      sublabel: 'Anything else from inspection or your own wish list',
      defaultA: 5000,
      defaultB: 2000,
      step: 500,
    },
    {
      id: 'cred',
      label: 'Seller credit toward repairs',
      sublabel:
        'What we ask the seller to cover. Enter as a positive number.',
      defaultA: 0,
      defaultB: 0,
      step: 1000,
    },
  ],

  monthlySectionNote:
    'Taxes and solar are the two numbers most people forget to compare. Insurance on Holland Rd stays higher until the roof is replaced.',

  monthlyCallout: {
    title: 'About that district assessment',
    body: 'Two things matter here. First, a Florida assessment is capped while one owner holds a home, and the cap disappears at sale, so neither listed tax figure is what you would pay. The numbers below are recalculated at your purchase price with a homestead exemption. Second, both communities charge a Community Development District assessment on the county tax bill, on top of regular property taxes and separate from the HOA. A CDD has two parts: a fixed bond debt that never changes until it is retired, and a yearly operations charge that moves with the budget. Avelar Creek North totals about $2,175, and its district was formed in 2005, so the bond portion should retire in the mid 2030s. South Fork totals about $3,318, of which $2,475 is bond debt on a much newer district. The Tonya Anne listing states there is no district assessment at all, which does not match the county tax bill, so we are pulling the official bill to confirm. One option worth exploring: many districts let a buyer pay off the bond portion in a lump sum at closing, which would cut that home\'s assessment to roughly $843 a year and make it the cheaper of the two to own.',
  },

  monthlyRows: [
    {
      id: 'tax',
      label: 'Property taxes per year',
      sublabel:
        'Estimated at YOUR purchase price with homestead, not the current owner\'s bill',
      defaultA: 7352,
      defaultB: 7743,
      step: 50,
    },
    {
      id: 'ins',
      label: 'Homeowners insurance per year',
      sublabel: 'Holland Rd drops once the roof is replaced',
      defaultA: 3600,
      defaultB: 2600,
      step: 100,
    },
    {
      id: 'cdd',
      label: 'District and county assessments per year',
      sublabel:
        'Avelar Creek North charges about $2,175. South Fork charges about $3,318, of which $2,475 is fixed bond debt. Both figures include county solid waste. This line is the biggest monthly difference between the two homes.',
      defaultA: 2513,
      defaultB: 3656,
      step: 25,
    },
    {
      id: 'hoa',
      label: 'HOA dues per year',
      sublabel: 'Both are unusually low. $150 and $180 a year.',
      defaultA: 150,
      defaultB: 180,
      step: 10,
    },
    {
      id: 'elec',
      label: 'Electric per month',
      sublabel: 'Tonya Anne is low because of paid-off solar',
      defaultA: 180,
      defaultB: 45,
      step: 10,
    },
    {
      id: 'gas',
      label: 'Natural gas per month',
      sublabel:
        'Holland only. Gas range and water heater confirmed.',
      defaultA: 45,
      defaultB: 0,
      step: 5,
    },
  ],

  commuteData: {
    origin: "Men's Wearhouse at Brandon Town Center",
    originAddress: '115 Brandon Town Center Dr',
    propertyA: {
      distance: 'About 10.5 miles',
      middayDrive: 'About 18 minutes',
      rushHourDrive: 'About 25 to 28 minutes',
      route: 'SR-60 to US-301 south, right on Holland Rd',
      trafficNotes:
        'US-301 backs up at Gibsonton Dr and Symmes Rd, but the trip ends before the worst of it',
    },
    propertyB: {
      distance: 'About 14.5 miles',
      middayDrive: 'About 24 minutes',
      rushHourDrive: 'About 33 to 38 minutes',
      route: 'SR-60 to US-301 south past Big Bend, east into South Fork',
      trafficNotes:
        'Adds the Gibsonton, Symmes and Big Bend lights, which are the slowest stretch of 301 at rush hour',
    },
    defaults: {
      minutesA: 26,
      minutesB: 35,
      milesA: 10.5,
      milesB: 14.5,
      daysA: 5,
      daysB: 5,
      mpg: 22,
      fuelPrice: 3.2,
    },
  },

  buildYearSectionNote:
    'Seven years apart is not a generation apart. Both are modern, post-hurricane-code homes. The real gap is not the code, it is how much life is left in the parts that cost money.',

  buildYearRows: [
    {
      component: 'Building code',
      propertyA: '2010 Florida Building Code',
      propertyB: '2017 Florida Building Code',
    },
    {
      component: 'Wind and roof-deck standards',
      propertyA:
        'Post-2002 code. Qualifies for the same major wind mitigation insurance credits',
      propertyB: 'Post-2002 code. Same credit categories available',
    },
    {
      component: 'Roof life remaining',
      propertyA: 'Zero. At or past replacement',
      propertyB: 'About 14 to 19 years',
    },
    {
      component: 'Air conditioning life remaining',
      propertyA: 'About zero to 2 years if original',
      propertyB: 'About 8 to 9 years',
    },
    {
      component: 'Water heater life remaining',
      propertyA: 'Gas unit replaced since 2023. About 8 to 10 years of life left',
      propertyB: 'About 5 to 7 years',
    },
    {
      component: 'Appliance life remaining',
      propertyA: 'Varies. Confirm ages at inspection',
      propertyB:
        'About 5 to 8 years, and they convey at full price',
    },
    {
      component: 'Energy envelope',
      propertyA:
        '2010 energy code. Lower insulation and duct-sealing minimums',
      propertyB:
        '2017 energy code. Tighter envelope, low-E glass standard',
    },
    {
      component: 'Minimum AC efficiency at build',
      propertyA: 'Could legally be SEER 13',
      propertyB: 'SEER 14 or better required',
    },
    {
      component: 'Structural warranty',
      propertyA: 'Expired',
      propertyB:
        'Possibly 4 years left on a 10 year structural warranty. Ask the builder if it transfers',
    },
    {
      component: 'Four-point inspection',
      propertyA:
        'Turns 15 years old in 2028, when most carriers start requiring one',
      propertyB: 'Not required for roughly another 9 years',
    },
    {
      component: 'Plumbing and electrical',
      propertyA:
        'Modern. No polybutylene or aluminum wiring concerns',
      propertyB: 'Modern, with arc-fault protection throughout',
    },
  ],

  buildYearCallout: {
    title: 'The straight version',
    body: 'On paper the two homes are built to similar standards, and Holland Rd is well built. The honest difference is money you will spend in the next five years. Holland Rd carries a roof and likely an air conditioner in that window. The water heater was already replaced. Tonya Anne carries close to nothing. Whether that gap is worth the higher price and the longer drive is exactly the tradeoff you are deciding.',
  },

  prioritySectionNote:
    'Slide each one from "does not matter" to "deal breaker." The score updates as you go. There is no right answer here, only your answer.',

  priorityRows: [
    {
      label: 'Move in without doing any work',
      winner: 'b',
      winnerLabel: 'Tonya Anne',
      defaultWeight: 7,
    },
    {
      label: 'Cooking on a gas range',
      winner: 'a',
      winnerLabel: 'Holland',
      defaultWeight: 5,
    },
    {
      label: 'Lowest monthly payment',
      winner: 'a',
      winnerLabel: 'Holland',
      defaultWeight: 8,
    },
    {
      label: 'Lowest total cash out the door',
      winner: 'calc',
      winnerLabel: 'Depends on numbers above',
      defaultWeight: 6,
    },
    {
      label: 'Fourth bedroom and more square footage',
      winner: 'b',
      winnerLabel: 'Tonya Anne',
      defaultWeight: 7,
    },
    {
      label: 'A separate flex room you can close the door on',
      winner: 'b',
      winnerLabel: 'Tonya Anne',
      defaultWeight: 6,
    },
    {
      label: 'A kitchen you love on day one',
      winner: 'b',
      winnerLabel: 'Tonya Anne',
      defaultWeight: 7,
    },
    {
      label: 'No roof project hanging over you',
      winner: 'b',
      winnerLabel: 'Tonya Anne',
      defaultWeight: 7,
    },
    {
      label: 'Shorter daily commute to Brandon Town Center',
      winner: 'a',
      winnerLabel: 'Holland',
      defaultWeight: 7,
    },
    {
      label: 'Less money spent on repairs in the next 5 years',
      winner: 'b',
      winnerLabel: 'Tonya Anne',
      defaultWeight: 7,
    },
    {
      label: 'Lake view and no rear neighbors',
      winner: 'b',
      winnerLabel: 'Tonya Anne',
      defaultWeight: 4,
    },
    {
      label: 'Screened lanai and hot tub already there',
      winner: 'a',
      winnerLabel: 'Holland',
      defaultWeight: 3,
    },
    {
      label: 'Room left to negotiate the price',
      winner: 'a',
      winnerLabel: 'Holland',
      defaultWeight: 6,
    },
    {
      label: 'Newer home, fewer surprises over the next 10 years',
      winner: 'b',
      winnerLabel: 'Tonya Anne',
      defaultWeight: 7,
    },
  ],

  finalCallout: {
    title: 'The two things to nail down next',
    body: 'On Holland Rd, we get you a written insurance quote with the current roof and a second quote assuming a new roof. Those two numbers tell you what the roof is really worth in this deal. On Tonya Anne, we pull the full tax and district assessment breakdown plus the solar transfer paperwork, so there are no surprises at the closing table. I will handle both.',
  },
};
