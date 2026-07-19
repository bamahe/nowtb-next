// =============================================================================
// Valrico-specific FAQs — real, useful answers for people researching the area
// These override the generic hub page FAQs when city.slug === "valrico"
// =============================================================================

export interface CityFAQ {
  question: string;
  answer: string;
  /** HTML version for rendering (supports links, bold, etc.) */
  answerHtml: string;
}

/**
 * City-specific FAQ overrides.
 * Key = city slug. If a city has an entry here, these replace the generic FAQs.
 * Keep answers honest and practical — stuff someone actually needs to know
 * before buying a home here.
 */
import { BRANDON_FAQS } from "./brandon-content";
import { BATCH1_FAQS } from "./batch1-faqs";
import { BATCH2_FAQS } from "./batch2-faqs";
import { BATCH3_FAQS } from "./batch3-faqs";
import { BATCH4_FAQS } from "./batch4-faqs";
import { BATCH5_FAQS } from "./batch5-faqs";

export const CITY_FAQS: Record<string, CityFAQ[]> = {
  ...BRANDON_FAQS,
  ...BATCH1_FAQS,
  ...BATCH2_FAQS,
  ...BATCH3_FAQS,
  ...BATCH4_FAQS,
  ...BATCH5_FAQS,
  valrico: [
    {
      question: "What's the difference between ZIP codes 33594 and 33596 in Valrico?",
      answer:
        "33594 covers the northern and western part of Valrico, closer to Brandon and the Bloomingdale area. 33596 covers the southern and eastern sections, stretching toward Lithia and FishHawk Ranch. School zones, flood risk, and home prices can vary between the two — so it's worth knowing which ZIP a property falls in before you start comparing.",
      answerHtml:
        '33594 covers the northern and western part of Valrico, closer to <a href="/brandon/" class="text-link hover:underline">Brandon</a> and the Bloomingdale area. 33596 covers the southern and eastern sections, stretching toward <a href="/lithia/" class="text-link hover:underline">Lithia</a> and FishHawk Ranch. School zones, flood risk, and home prices can vary between the two — so it\'s worth knowing which ZIP a property falls in before you start comparing.',
    },
    {
      question: "What schools serve Valrico?",
      answer:
        "Valrico is in the Hillsborough County School District. Elementary schools include Buckhorn, Cimino, and Stowers. Middle schoolers typically attend Randall or Burns. For high school, most Valrico students are zoned for Bloomingdale, Durant, or Newsome — all three are well-regarded. Exact school zones depend on your specific address, so always verify with the district before making a decision based on schools.",
      answerHtml:
        'Valrico is in the <a href="https://www.hillsboroughschools.org" target="_blank" rel="noopener noreferrer" class="text-link hover:underline">Hillsborough County School District</a>. Elementary schools include Buckhorn, Cimino, and Stowers. Middle schoolers typically attend Randall or Burns. For high school, most Valrico students are zoned for Bloomingdale, Durant, or Newsome — all three are well-regarded. Exact school zones depend on your specific address, so always verify with the district before making a decision based on schools.',
    },
    {
      question: "How far is Valrico from downtown Tampa?",
      answer:
        "Most of Valrico is about 20 to 30 miles east of downtown Tampa. In normal traffic, the drive takes 25–40 minutes depending on which part of Valrico you're coming from and whether you take I-75 or the Selmon Expressway. The Selmon is a toll road but usually faster during rush hour. MacDill Air Force Base is about 30–35 minutes away.",
      answerHtml:
        'Most of Valrico is about 20 to 30 miles east of downtown Tampa. In normal traffic, the drive takes 25–40 minutes depending on which part of Valrico you\'re coming from and whether you take I-75 or the Selmon Expressway. The Selmon is a toll road but usually faster during rush hour. MacDill Air Force Base is about 30–35 minutes away.',
    },
    {
      question: "Is Valrico in a flood zone?",
      answer:
        "Most of Valrico sits on higher ground and falls in FEMA Zone X, which means minimal flood risk and flood insurance usually isn't required. However, properties near the Alafia River, Turkey Creek, or low-lying areas along Lithia-Pinecrest Road can fall in Zone AE or AH, where flood insurance is mandatory with a federally-backed mortgage. Always check the FEMA flood map for the specific property — not just the neighborhood.",
      answerHtml:
        'Most of Valrico sits on higher ground and falls in FEMA Zone X, which means minimal flood risk and flood insurance usually isn\'t required. However, properties near the Alafia River, Turkey Creek, or low-lying areas along Lithia-Pinecrest Road can fall in Zone AE or AH, where flood insurance is mandatory with a federally-backed mortgage. Always check the <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" class="text-link hover:underline">FEMA flood map</a> for the specific property — not just the neighborhood.',
    },
    {
      question: "What are property taxes like in Valrico?",
      answer:
        "Valrico is in unincorporated Hillsborough County, so you're paying county taxes but not a separate city tax. The total millage rate runs around 19–20 mills. On a $400,000 home with Florida's homestead exemption, you'd typically pay roughly $5,500–6,500 per year. CDD fees apply in some newer communities on top of that — always ask whether a neighborhood has a CDD before making an offer.",
      answerHtml:
        'Valrico is in unincorporated Hillsborough County, so you\'re paying county taxes but not a separate city tax. The total millage rate runs around 19–20 mills. On a $400,000 home with Florida\'s homestead exemption, you\'d typically pay roughly $5,500–6,500 per year. CDD fees apply in some newer communities on top of that — always ask whether a neighborhood has a CDD before making an offer. Use the <a href="/mortgage-calculator/" class="text-link hover:underline">mortgage calculator</a> to estimate your full monthly payment.',
    },
    {
      question: "What's the vibe of Valrico compared to Brandon or Riverview?",
      answer:
        "Valrico feels more suburban and residential than Brandon, which has more commercial development and shopping along SR-60. Riverview has grown fast with a lot of new construction, while Valrico has a wider mix of established neighborhoods from the 1980s–90s alongside newer builds. If you want mature trees, bigger lots, and a quieter pace but still want to be close to everything, Valrico is usually the sweet spot.",
      answerHtml:
        'Valrico feels more suburban and residential than <a href="/brandon/" class="text-link hover:underline">Brandon</a>, which has more commercial development and shopping along SR-60. <a href="/riverview/" class="text-link hover:underline">Riverview</a> has grown fast with a lot of new construction, while Valrico has a wider mix of established neighborhoods from the 1980s–90s alongside newer builds. If you want mature trees, bigger lots, and a quieter pace but still want to be close to everything, Valrico is usually the sweet spot.',
    },
    {
      question: "Does Valrico have a downtown or walkable area?",
      answer:
        "Not really — Valrico is unincorporated, so there's no traditional downtown. Most shopping and dining is along SR-60 (Brandon Boulevard) and Bloomingdale Avenue. The area is car-dependent. That said, many neighborhoods have sidewalks and walking trails, and the Upper Tampa Bay Trail extension is accessible for cycling. If walkability is a priority, look at neighborhoods closer to the Bloomingdale corridor.",
      answerHtml:
        'Not really — Valrico is unincorporated, so there\'s no traditional downtown. Most shopping and dining is along SR-60 (Brandon Boulevard) and Bloomingdale Avenue. The area is car-dependent. That said, many neighborhoods have sidewalks and walking trails. If walkability is a priority, look at neighborhoods closer to the Bloomingdale corridor.',
    },
    {
      question: "Are there HOA communities in Valrico?",
      answer:
        "Yes — most subdivisions built after the mid-1990s have an HOA. Fees typically run $50–200 per month depending on what's included (pool, clubhouse, lawn care, gated entry). Older neighborhoods like Diamond Hill and some sections along Lithia-Pinecrest Road tend to have no HOA, which appeals to buyers who want fewer restrictions. If HOA status matters to you, ask about it early — it's one of the first things I check for my clients.",
      answerHtml:
        'Yes — most subdivisions built after the mid-1990s have an HOA. Fees typically run $50–200 per month depending on what\'s included (pool, clubhouse, lawn care, gated entry). Older neighborhoods like <a href="/diamond-hill/" class="text-link hover:underline">Diamond Hill</a> and some sections along Lithia-Pinecrest Road tend to have no HOA, which appeals to buyers who want fewer restrictions. If HOA status matters to you, ask about it early — it\'s one of the first things I check for my clients.',
    },
  ],
};
