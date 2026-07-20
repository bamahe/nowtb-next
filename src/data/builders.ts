// Builder data — shared between /builders index and /builders/[slug] detail pages

export interface Builder {
  name: string;
  slug: string;
  tagline: string;
  desc: string;
  // Additional detail for individual builder pages
  founded?: string;
  hq?: string;
  priceRange?: string;
  communities?: string;
  series?: string[];
  whyChoose?: string;
}

export const builders: Builder[] = [
  {
    name: "Lennar",
    slug: "lennar-homes-tampa-bay",
    tagline: "Everything's Included",
    desc: "One of the largest builders in the country, Lennar is known for its Everything's Included program — smart home tech, premium appliances, and designer finishes come standard. Active across Hillsborough, Pasco, and Polk counties with communities ranging from first-time buyer townhomes to estate-sized single-family homes.",
    founded: "1954",
    hq: "Miami, FL",
    priceRange: "$300K–$800K+",
    communities: "20+ active communities in the Tampa Bay region including Connerton, Angeline, Southshore Bay, Mirada, Vista Walk, and Curiosity Creek.",
    series: ["Classic", "Manor", "Executive", "Estate"],
    whyChoose: "Lennar's Everything's Included model eliminates the upgrade guessing game. What you see in the model is what you get in your home. Their in-house mortgage company (Lennar Mortgage) often provides aggressive rate buydowns. Barrett reviews every Lennar incentive to make sure the preferred lender deal actually beats outside financing.",
  },
  {
    name: "DR Horton",
    slug: "dr-horton-homes-tampa-bay",
    tagline: "America's Builder",
    desc: "The nation's largest homebuilder by volume, DR Horton delivers affordable new construction without cutting corners. Their Express and Freedom series target first-time buyers and active adults, while the Emerald line offers upgraded finishes and larger floor plans.",
    founded: "1978",
    hq: "Arlington, TX",
    priceRange: "$280K–$600K+",
    communities: "30+ active communities including Berry Bay, Connerton, Riverside Terrace, Woodcreek, and Rye Ranch across Hillsborough, Pasco, Manatee, and Polk counties.",
    series: ["Express", "Tradition", "Freedom (55+)", "Emerald"],
    whyChoose: "DR Horton is the volume leader and often the most affordable option in any given area. Their concrete block construction is standard on both floors in Florida — a feature some builders charge extra for. Barrett negotiates DR Horton contracts regularly and knows exactly what concessions are on the table.",
  },
  {
    name: "Pulte Homes",
    slug: "pulte-homes-tampa-bay",
    tagline: "Life Tested",
    desc: "Pulte's Life Tested floor plans are designed around how people actually live — dedicated home offices, open kitchens, and flexible bonus rooms. Their Del Webb brand is one of the most recognized names in 55+ active adult communities.",
    founded: "1950",
    hq: "Atlanta, GA",
    priceRange: "$320K–$700K+",
    communities: "15+ active communities including Starkey Ranch, Beachwalk by Manasota Key, Hartford Terrace, and Del Webb communities.",
    series: ["Pulte Homes", "Del Webb (55+)", "Centex (value)"],
    whyChoose: "Pulte's Life Tested program means every floor plan has been refined based on how real families use their space. Their Del Webb brand delivers the strongest 55+ product in the market. Barrett helps buyers compare Pulte's included features against competitors at the same price point.",
  },
  {
    name: "Taylor Morrison",
    slug: "taylor-morrison-homes-tampa-bay",
    tagline: "Inspired Living",
    desc: "A top-five national builder with deep Florida roots. Taylor Morrison is known for premium standard features, energy efficiency, and communities in desirable school zones across Tampa Bay.",
    founded: "2011 (heritage dates to 1929)",
    hq: "Scottsdale, AZ",
    priceRange: "$350K–$900K+",
    communities: "15+ active communities including Esplanade at Starkey Ranch, Chapel Trace, Timber Ridge, Firethorn, and Esplanade at Azario Lakewood Ranch.",
    series: ["Taylor Morrison", "Esplanade (55+)"],
    whyChoose: "Taylor Morrison's Esplanade brand is the gold standard for premium 55+ living in Tampa Bay. Their standard finishes are a tier above most national builders. Barrett knows which Taylor Morrison incentives stack and which require their preferred lender.",
  },
  {
    name: "Toll Brothers",
    slug: "toll-brothers-homes-tampa-bay",
    tagline: "Luxury Living",
    desc: "The name in luxury new construction. Toll Brothers builds in Tampa Bay's most sought-after locations with high-end finishes, expansive design center options, and resort-style community amenities.",
    founded: "1967",
    hq: "Fort Washington, PA",
    priceRange: "$500K–$1.5M+",
    communities: "Select luxury communities in Lakewood Ranch and the Sarasota corridor.",
    series: ["Toll Brothers"],
    whyChoose: "Toll Brothers is the only national builder focused exclusively on the luxury segment. Their design center experience is unmatched — buyers select from hundreds of finish options. Barrett represents luxury buyers at Toll Brothers communities and negotiates beyond the published incentive sheet.",
  },
  {
    name: "MI Homes",
    slug: "mi-homes-tampa-bay",
    tagline: "Quality Craftsmanship",
    desc: "MI Homes delivers flexible floor plans with a strong reputation for build quality and customer satisfaction. Their Tampa Bay communities offer a range of price points with generous included features and responsive warranty service.",
    founded: "1976",
    hq: "Columbus, OH",
    priceRange: "$350K–$600K+",
    communities: "Active in Starkey Ranch, Asturia (Odessa), and other Pasco/Hillsborough locations.",
    series: ["MI Homes"],
    whyChoose: "MI Homes consistently ranks high in customer satisfaction surveys. Their floor plans offer genuine flexibility with bonus rooms, flex spaces, and multi-generational options. Barrett has closed multiple MI Homes transactions and knows their contract negotiation points.",
  },
  {
    name: "Ryan Homes",
    slug: "ryan-homes-tampa-bay",
    tagline: "Build Your Happy",
    desc: "Part of NVR Inc., Ryan Homes focuses on affordable new construction with a streamlined building process. Strong in the first-time buyer market with competitive pricing and quick move-in inventory homes.",
    founded: "1948",
    hq: "Reston, VA",
    priceRange: "$280K–$500K",
    communities: "Active in select Hillsborough and Pasco County locations.",
    series: ["Ryan Homes"],
    whyChoose: "Ryan Homes (NVR) operates differently from other builders — they do not own land inventory, which keeps overhead low and prices competitive. Their NVR Mortgage subsidiary offers aggressive rates. Barrett helps first-time buyers compare Ryan Homes pricing against DR Horton and Lennar in the same corridors.",
  },
  {
    name: "Meritage Homes",
    slug: "meritage-homes-tampa-bay",
    tagline: "Energy-Efficient Living",
    desc: "Meritage builds every home to ENERGY STAR standards with advanced insulation, HVAC, and solar-ready design. Their focus on energy efficiency translates to lower utility bills from day one — a real selling point in Florida's heat.",
    founded: "1985",
    hq: "Scottsdale, AZ",
    priceRange: "$320K–$600K+",
    communities: "15+ active communities including Benton Hills, Two Rivers, The Grove at Stuart Crossing, and Radley Way at WaterGrass.",
    series: ["Meritage Homes"],
    whyChoose: "Every Meritage home meets ENERGY STAR certification. In Florida, where AC runs 8+ months per year, this translates to $50-$100/month in utility savings versus a non-certified home. Barrett helps buyers quantify the real savings when comparing Meritage to other builders.",
  },
];

export function getBuilderBySlug(slug: string): Builder | undefined {
  return builders.find((b) => b.slug === slug);
}
