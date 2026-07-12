/**
 * Loan guide content — authoritative, Florida-specific content for each loan type page.
 * Used by LoanGuidePage component to replace generic placeholder content.
 * Written with 2026 loan limits, rates, and program details.
 */

export interface LoanFAQ {
  question: string;
  answer: string;
}

export interface LoanContent {
  /** 2-3 paragraphs explaining the loan program for Florida buyers */
  description: string;
  /** 6-8 specific eligibility requirements with real numbers */
  requirements: string[];
  /** 6-8 specific benefits with real details */
  benefits: string[];
  /** 5-6 Q&A objects for FAQ section */
  faq: LoanFAQ[];
  /** 3-4 insider tips from a broker's perspective */
  proTips: string[];
}

export const loanContent: Record<string, LoanContent> = {
  // ===========================================================================
  // FHA LOAN
  // ===========================================================================
  "fha-loan-florida": {
    description: `An FHA loan is a mortgage insured by the Federal Housing Administration, designed for buyers who may not qualify for conventional financing. In Florida, FHA loans are the most popular choice for first-time buyers because they allow down payments as low as 3.5% with a minimum credit score of 580. For 2026, the FHA loan limit in most Florida counties is $524,225 for a single-family home — though higher-cost counties like Monroe County (the Keys) have limits up to $929,850.

FHA loans require mortgage insurance premiums (MIP): an upfront premium of 1.75% of the loan amount (usually rolled into the loan) plus an annual premium of 0.55% for most borrowers, paid monthly. Unlike conventional PMI, FHA mortgage insurance stays on the loan for the entire term if you put less than 10% down. If you put 10% or more down, MIP drops off after 11 years. Florida buyers should also factor in doc stamps at $0.70 per $100 of the purchase price and intangible tax at $0.20 per $100 on the mortgage amount — these are Florida-specific closing costs that apply regardless of loan type.

FHA loans can be combined with Florida down payment assistance programs like the Hometown Heroes program, which provides up to $35,000 in down payment and closing cost assistance for eligible professionals including teachers, nurses, law enforcement, and over 50 other occupations. Barrett Henry, Broker Associate at REMAX Collective with 23+ years of real estate experience, works with FHA-approved lenders throughout Tampa Bay who can get you pre-approved in as little as 24 hours. Call (813) 733-7907 to discuss your options.`,

    requirements: [
      "Minimum credit score of 580 for 3.5% down payment (500-579 requires 10% down)",
      "Debt-to-income ratio (DTI) up to 43% on the back end, though some lenders allow up to 50% with compensating factors",
      "Steady employment history — at least 2 years in the same line of work or with the same employer",
      "The property must be your primary residence (no investment properties or vacation homes)",
      "Property must meet FHA minimum property standards — the appraisal is stricter than conventional, checking for health and safety issues",
      "2026 FHA loan limit of $524,225 for most Florida counties (higher in Monroe, Collier, and some coastal counties)",
      "Upfront mortgage insurance premium (UFMIP) of 1.75% of the loan amount is required at closing",
      "Borrowers must complete a HUD-approved homebuyer education course if using down payment assistance"
    ],

    benefits: [
      "Down payment as low as 3.5% — on a $300,000 home, that is just $10,500 vs. $60,000 for a conventional 20% down payment",
      "Credit score requirements are more forgiving than conventional loans — 580 minimum vs. 620-680 for most conventional programs",
      "Gift funds are allowed for the entire down payment — family members, employers, or charitable organizations can contribute",
      "Seller concessions up to 6% of the purchase price are allowed, helping offset closing costs that typically run 2-5% in Florida",
      "FHA loans are assumable — if you sell your home, the buyer can take over your FHA loan at your locked-in rate, a major selling advantage in a higher-rate environment",
      "No income limits — unlike USDA loans, FHA has no maximum income cap, so higher earners can still qualify",
      "Eligible for combination with Florida Hometown Heroes ($35,000 DPA), FL Assist ($10,000 deferred second mortgage), and other state programs",
      "FHA 203(k) rehabilitation loan option lets you finance the purchase price plus renovation costs in a single mortgage — ideal for older Florida homes needing updates"
    ],

    faq: [
      {
        question: "What is the FHA loan limit in Florida for 2026?",
        answer: "The 2026 FHA loan limit for most Florida counties is $524,225 for a single-family home. Higher-cost counties have elevated limits — Monroe County (Florida Keys) goes up to $929,850, and a handful of other coastal counties fall in between. Check your specific county limit at the HUD website or call Barrett at (813) 733-7907 for the exact number."
      },
      {
        question: "How long does FHA mortgage insurance last?",
        answer: "If you put less than 10% down on an FHA loan, mortgage insurance premiums (MIP) stay for the entire life of the loan. If you put 10% or more down, MIP drops off after 11 years. Many Florida buyers refinance into a conventional loan once they reach 20% equity to eliminate the insurance altogether."
      },
      {
        question: "Can I use an FHA loan to buy a condo in Florida?",
        answer: "Yes, but the condo complex must be on the FHA-approved condominium list or qualify for FHA single-unit approval. Florida's post-Surfside condo laws (SB 4-D) require milestone inspections and reserve funding — condos that fail to meet these requirements may lose FHA eligibility. Always verify approval status before making an offer."
      },
      {
        question: "What closing costs should Florida FHA buyers expect?",
        answer: "Florida FHA buyers typically pay 2-5% of the purchase price in closing costs. This includes the 1.75% upfront MIP, Florida doc stamps ($0.70 per $100 of purchase price), intangible tax ($0.20 per $100 of mortgage amount), title insurance, lender fees, and prepaid items like insurance and property taxes. On a $350,000 purchase, expect roughly $12,000-$17,500 in total closing costs."
      },
      {
        question: "Can I combine an FHA loan with Florida down payment assistance?",
        answer: "Absolutely. FHA loans are eligible for multiple Florida assistance programs including the Hometown Heroes program (up to $35,000), FL Assist ($10,000 as a deferred second mortgage), and county-specific programs in Hillsborough, Pinellas, and Pasco counties. Barrett can connect you with lenders who specialize in stacking these programs."
      },
      {
        question: "How does an FHA appraisal differ from a conventional appraisal?",
        answer: "FHA appraisals are more stringent. The appraiser checks for health and safety concerns — peeling paint, missing handrails, faulty wiring, roof condition (must have at least 2 years of life remaining), and adequate water and septic systems. In Florida, this also includes checking for evidence of wood-destroying organisms (termites). An FHA appraisal stays attached to the property for 180 days, meaning the next buyer using FHA on that same property cannot get a new appraisal during that window."
      }
    ],

    proTips: [
      "Get pre-approved with an FHA lender BEFORE you start looking at homes. In competitive Tampa Bay neighborhoods, sellers often pass over FHA offers in favor of conventional — having a strong pre-approval letter with proof of funds for closing costs makes your offer significantly more competitive.",
      "If your credit score is between 620 and 680, compare FHA vs. conventional side by side. Sometimes the FHA mortgage insurance over the life of the loan costs more than the slightly higher rate you would pay on a conventional loan. A good lender will run both scenarios for you.",
      "Florida homestead exemption saves you up to $50,000 off your home's assessed value for property tax purposes. File within 30 days of closing to lock it in for the following tax year — the March 1 deadline catches a lot of new buyers off guard.",
      "Ask your lender about FHA Streamline Refinancing. If rates drop after you close, FHA Streamline lets you refinance with minimal paperwork, no appraisal, and reduced MIP — it is one of the fastest and cheapest refinance options available."
    ]
  },

  // ===========================================================================
  // VA LOAN
  // ===========================================================================
  "va-loan-florida": {
    description: `VA loans are mortgage loans guaranteed by the U.S. Department of Veterans Affairs, available to eligible active-duty service members, veterans, National Guard and Reserve members, and surviving spouses. The VA loan is hands-down the best mortgage product available in America — zero down payment, no private mortgage insurance, competitive interest rates, and no loan limit for borrowers with full entitlement. For Florida buyers near MacDill AFB, the Naval stations in Jacksonville and Pensacola, or any of the state's 20+ military installations, the VA loan is the default choice.

In 2026, VA loans have no maximum loan amount for borrowers with full entitlement — meaning you can buy above the $806,500 conforming limit with zero down if the lender approves you. The VA funding fee ranges from 1.25% to 3.3% of the loan amount depending on your service category, down payment, and whether this is your first VA loan use. Disabled veterans with a VA disability rating of 10% or higher are exempt from the funding fee entirely, saving thousands at closing. Florida's doc stamps ($0.70 per $100) and intangible tax ($0.20 per $100 on the mortgage) still apply.

Barrett Henry, Broker Associate at REMAX Collective and Military Relocation Professional (MRP), has 23+ years of real estate experience helping service members and veterans buy homes across Tampa Bay. Whether you are PCSing to MacDill, separating from service, or using your VA benefit for the first time or fifth time, Barrett can connect you with VA-specialized lenders and guide you through the entire process. Call (813) 733-7907 to get started.`,

    requirements: [
      "Eligible service: 90+ consecutive days of active duty during wartime, 181+ days during peacetime, 6+ years in the National Guard or Reserves, or surviving spouse of a service member who died in the line of duty or from a service-connected disability",
      "Obtain a Certificate of Eligibility (COE) from the VA — your lender can pull this electronically in minutes",
      "The property must be your primary residence (you cannot use a VA loan for investment properties or vacation homes)",
      "Most lenders require a minimum credit score of 580-620, though the VA itself sets no minimum score",
      "Debt-to-income ratio generally up to 41%, though many VA lenders will go higher with residual income qualification",
      "VA residual income requirement — after all monthly obligations, you must have enough leftover income based on family size and region (Southeast region for Florida)",
      "VA funding fee of 1.25%-3.3% applies unless you have a VA disability rating of 10% or higher (exempt veterans save $3,750-$9,900+ on a $300,000 loan)",
      "Property must pass a VA appraisal, which checks for Minimum Property Requirements (MPRs) including structural soundness, adequate heating, and safe water supply"
    ],

    benefits: [
      "Zero down payment — buy a home with $0 down regardless of the purchase price, saving $60,000+ compared to a conventional 20% down payment on a $300,000 home",
      "No private mortgage insurance (PMI) — ever. This saves $150-$350 per month compared to conventional loans with less than 20% down",
      "VA interest rates are typically 0.25%-0.50% lower than conventional rates because the VA guarantee reduces lender risk",
      "No loan limit for borrowers with full entitlement — you can buy above the $806,500 conforming limit without a down payment if you qualify",
      "VA loans are assumable — a qualified buyer (veteran or non-veteran) can assume your loan at your locked-in rate, which is a powerful selling tool if rates rise",
      "No prepayment penalty — pay off or refinance your VA loan at any time with no fees",
      "Lifetime benefit — you can use your VA loan entitlement multiple times. Sell your home, restore your entitlement, and use it again on your next purchase",
      "VA Interest Rate Reduction Refinance Loan (IRRRL) lets you refinance with minimal paperwork, no appraisal, and reduced funding fee if rates drop"
    ],

    faq: [
      {
        question: "Is there a VA loan limit in Florida for 2026?",
        answer: "For borrowers with full entitlement (meaning you have paid off or sold any previous VA-financed properties and restored your entitlement), there is no loan limit — you can borrow as much as a lender will approve with zero down. If you have reduced entitlement (a prior VA loan still active), the 2026 county loan limit applies, which is $806,500 for most Florida counties."
      },
      {
        question: "How much is the VA funding fee in 2026?",
        answer: "For first-time VA loan users putting zero down, the funding fee is 2.15% of the loan amount. For subsequent use with zero down, it jumps to 3.3%. Putting 5% or more down reduces the fee to 1.5% (first use) or 1.25% (subsequent use with 10%+ down). Veterans with a service-connected disability rating of 10% or higher are completely exempt — that is a savings of $6,450-$9,900 on a $300,000 loan."
      },
      {
        question: "Can I use a VA loan to buy a home near MacDill AFB?",
        answer: "Yes, and it is the most common loan type for buyers near MacDill. South Tampa, Brandon, Riverview, and Valrico are all popular areas for military families stationed at MacDill. BAH rates for MacDill in 2026 cover a significant portion of mortgage payments in these areas. Barrett Henry holds the Military Relocation Professional (MRP) designation and specializes in helping MacDill-area buyers."
      },
      {
        question: "Can I use my VA loan benefit more than once?",
        answer: "Yes. Your VA loan benefit is a lifetime benefit, not a one-time use. Once you sell a VA-financed home and pay off the loan, you can restore your full entitlement and use it again. In some cases, you can even have two VA loans active simultaneously if you have remaining entitlement — common for PCS moves where you keep your previous home as a rental."
      },
      {
        question: "What happens if a VA appraisal comes in low?",
        answer: "If the VA appraisal is below the contract price, you have several options: negotiate with the seller to lower the price, pay the difference out of pocket, request a Reconsideration of Value (ROV) with additional comparable sales, or walk away using the VA amendatory clause with no penalty. Barrett has navigated dozens of low appraisal situations and can advise on the best strategy."
      },
      {
        question: "Do surviving spouses qualify for VA loans?",
        answer: "Yes. Surviving spouses of veterans who died in the line of duty or from a service-connected disability are eligible for VA loan benefits, including zero down payment and no funding fee. Surviving spouses of veterans who died from non-service-connected causes may also be eligible if they have not remarried. Contact the VA or a VA-approved lender to verify your specific eligibility."
      }
    ],

    proTips: [
      "If you have a VA disability rating, make sure your lender knows BEFORE closing. Exempt veterans save thousands by not paying the funding fee — and if you receive your rating after closing, you can request a refund of the funding fee from the VA. Barrett has seen veterans leave money on the table because their lender did not ask about pending disability claims.",
      "VA loans allow the seller to pay ALL of your closing costs (called seller concessions) up to 4% of the purchase price. In the current market, many sellers are willing to contribute — always ask. On a $400,000 purchase, that is up to $16,000 the seller can cover.",
      "Consider keeping your current VA-financed home as a rental when you PCS. You can use remaining entitlement to buy your next home with a second VA loan. This is one of the best wealth-building strategies for military families — Barrett can walk you through the math on whether it makes sense for your situation.",
      "Florida has no state income tax, which means your BAH and military pay go further here than in most states. Combine that with the homestead exemption ($50,000 off assessed value for property taxes) and a zero-down VA loan, and your total cost of ownership is significantly lower than renting."
    ]
  },

  // ===========================================================================
  // USDA LOAN
  // ===========================================================================
  "usda-loan-florida": {
    description: `USDA loans are zero-down-payment mortgages backed by the U.S. Department of Agriculture's Rural Development program, designed for low-to-moderate income buyers purchasing homes in eligible rural and suburban areas. In Florida, a surprising number of areas qualify — including parts of eastern Hillsborough County, much of Pasco County, large portions of Polk County (Lakeland, Winter Haven, Bartow), Hernando County (Spring Hill, Brooksville), and most of the state outside major metro cores. If you are buying in Plant City, Zephyrhills, Dade City, Wesley Chapel (some areas), or communities east of I-75, a USDA loan may be your best option.

USDA loans have two types of mortgage insurance: an upfront guarantee fee of 1.0% of the loan amount (rolled into the loan) and an annual fee of 0.35% paid monthly. Compare that to FHA's 1.75% upfront and 0.55% annual — USDA insurance costs are significantly lower. The catch is the income limit: for 2026, household income cannot exceed 115% of the area median income (AMI). In the Tampa-St. Petersburg-Clearwater metro area, that is approximately $112,450 for a 1-4 person household and $148,450 for a 5-8 person household. These limits are based on total household income, not just the borrower's income.

Barrett Henry, Broker Associate at REMAX Collective with 23+ years of real estate experience, helps buyers throughout the Tampa Bay region identify USDA-eligible properties and navigate the income qualification process. Many buyers are surprised to learn they qualify for a zero-down USDA loan in growing communities like Riverview, Lithia, and Plant City. Call (813) 733-7907 to check your eligibility.`,

    requirements: [
      "The property must be located in a USDA-eligible area — check the USDA eligibility map at eligibility.sc.egov.usda.gov (many Florida suburbs and smaller cities qualify)",
      "Total household income cannot exceed 115% of the area median income — approximately $112,450 for 1-4 person households in the Tampa metro area for 2026",
      "Minimum credit score of 640 for automatic underwriting through USDA's GUS system (below 640 requires manual underwriting with additional documentation)",
      "Debt-to-income ratio of 29% front-end (housing costs) and 41% back-end (all debts), though exceptions up to 44% are possible with compensating factors",
      "The property must be your primary residence — no investment properties, second homes, or income-producing farms",
      "U.S. citizenship, permanent residency, or qualified non-citizen status required",
      "Must demonstrate stable and dependable income for at least 24 months",
      "The home must meet USDA property standards — structurally sound, adequate water/septic, functional HVAC, and in generally good repair"
    ],

    benefits: [
      "Zero down payment — 100% financing means you can buy a home with $0 down, keeping your savings intact for moving costs, furniture, and emergency reserves",
      "Lowest mortgage insurance costs of any government loan program — 1.0% upfront guarantee fee and just 0.35% annual fee vs. FHA's 1.75% upfront and 0.55% annual",
      "No maximum purchase price — as long as the home appraises at or above the contract price and is in an eligible area, there is no cap on what you can buy",
      "Closing costs can be rolled into the loan if the home appraises higher than the purchase price, potentially making this a true zero-out-of-pocket purchase",
      "Seller concessions up to 6% of the purchase price are allowed to help cover your closing costs",
      "No cash reserves required at closing — unlike conventional loans that may require 2-6 months of reserves, USDA has no reserve requirement",
      "Eligible for combination with Florida down payment assistance programs to cover closing costs, including Hometown Heroes ($35,000) and FL Assist ($10,000)",
      "Competitive fixed interest rates — USDA rates are often comparable to or lower than conventional rates because the government guarantee reduces lender risk"
    ],

    faq: [
      {
        question: "Which areas near Tampa Bay are USDA-eligible?",
        answer: "Several popular communities near Tampa Bay qualify for USDA loans. Parts of Plant City, Lithia, eastern Riverview, Zephyrhills, Dade City, San Antonio, and much of Pasco County north of SR-54 are eligible. Polk County communities like Lakeland, Winter Haven, and Bartow also qualify. Eligibility can change, so always verify the exact property address on the USDA eligibility map before making an offer."
      },
      {
        question: "What counts toward the USDA household income limit?",
        answer: "USDA counts the income of ALL adults (18+) living in the household, not just the borrowers on the loan. This includes a working teenager, a parent living with you, or a spouse who is not on the mortgage. Certain deductions apply for dependents, childcare, disability, and elderly household members. For 2026 in the Tampa metro area, the limit is approximately $112,450 for 1-4 person households."
      },
      {
        question: "Can I buy a home with a pool using a USDA loan?",
        answer: "Yes. USDA loans allow pools as long as the pool is in working condition and does not pose a health or safety hazard. The pool does not need to be heated or have a cover, but it must have a functioning pump and filter, and any fencing must meet local code requirements. Pools are common in Florida, and they do not disqualify a property from USDA financing."
      },
      {
        question: "How long does a USDA loan take to close?",
        answer: "USDA loans typically take 30-45 days to close, sometimes longer than FHA or conventional because the loan requires approval from both the lender and the USDA itself. The USDA review can add 3-7 business days to the timeline. Barrett recommends writing your contract with at least a 45-day closing window when using USDA financing to avoid extension requests."
      },
      {
        question: "Can I refinance a USDA loan later?",
        answer: "Yes. USDA offers a Streamlined Assist refinance program that requires no appraisal, no credit review, and minimal documentation — just a history of on-time payments. This makes it easy to take advantage of lower rates in the future. You can also refinance into a conventional loan once you have 20% equity to eliminate the annual guarantee fee."
      },
      {
        question: "What if my income increases after I get a USDA loan?",
        answer: "Once your USDA loan closes, your income is not re-checked. The income limit only applies at the time of application and approval. If you get a raise, change jobs, or add a household member with income after closing, it does not affect your existing USDA mortgage."
      }
    ],

    proTips: [
      "The USDA eligibility map updates periodically, and areas can lose eligibility as populations grow. If you are considering a USDA loan in a borderline area like eastern Hillsborough or western Pasco, do not wait — once an area is removed from the eligible map, it does not come back. Barrett monitors these changes and can flag properties that may lose eligibility soon.",
      "USDA counts household income, not borrower income. If you have a working adult child or a roommate on the lease, their income counts toward the limit even if they are not on the loan. However, deductions for dependents ($480 per child) and childcare expenses can bring you below the threshold. A USDA-experienced lender will calculate this properly.",
      "If the home appraises higher than your purchase price, you can finance your closing costs into the loan up to the appraised value. This is unique to USDA — on a $300,000 purchase that appraises at $310,000, you could finance up to $10,000 in closing costs into the mortgage for a true zero-cash-at-closing deal.",
      "Many buyers assume they will not qualify for USDA because they live near Tampa. Pull up the USDA eligibility map before you rule it out — communities just 20-30 minutes from downtown Tampa qualify, and they offer larger lots, newer construction, and lower prices than the urban core."
    ]
  },

  // ===========================================================================
  // CONVENTIONAL LOAN
  // ===========================================================================
  "conventional-loan-florida": {
    description: `A conventional loan is a mortgage that is not insured or guaranteed by a government agency (unlike FHA, VA, or USDA). Conventional loans are originated by private lenders and typically conform to guidelines set by Fannie Mae and Freddie Mac. For 2026, the conforming loan limit is $806,500 for a single-family home in all Florida counties — any amount above that is considered a jumbo loan with different qualification requirements.

Conventional loans offer the most flexibility of any mortgage product. Down payments start at 3% for first-time buyers (through Fannie Mae HomeReady or Freddie Mac Home Possible programs) and 5% for repeat buyers. If you put less than 20% down, you will pay private mortgage insurance (PMI), but unlike FHA's lifetime MIP, conventional PMI automatically drops off once your loan balance reaches 78% of the original purchase price — or you can request removal at 80%. PMI rates vary by credit score and down payment, typically ranging from 0.2% to 1.5% of the loan amount annually. A buyer with a 740+ credit score putting 10% down might pay $80-$120 per month on a $400,000 loan, while a buyer with a 660 score could pay $200-$350.

Barrett Henry, Broker Associate at REMAX Collective with 23+ years of real estate experience, recommends conventional loans for buyers with credit scores above 700 and at least 5% down. In competitive multiple-offer situations common in Tampa Bay's strongest neighborhoods, conventional financing is often preferred by sellers over FHA or USDA because of faster closings, fewer appraisal contingencies, and less red tape. Call (813) 733-7907 to discuss whether conventional is the right fit for your purchase.`,

    requirements: [
      "Minimum credit score of 620, though the best rates and lowest PMI costs require 740+ (each 20-point tier affects your rate and PMI pricing)",
      "Down payment of 3% minimum for first-time buyers (HomeReady/Home Possible), 5% for repeat buyers, or 20% to avoid PMI entirely",
      "Debt-to-income ratio up to 45% back-end, with some lenders allowing up to 50% for borrowers with strong compensating factors (high credit score, significant reserves)",
      "2026 conforming loan limit of $806,500 for all Florida counties — loans above this amount require jumbo qualification",
      "Private mortgage insurance (PMI) required if down payment is less than 20% — rates range from 0.2% to 1.5% annually based on credit score and loan-to-value ratio",
      "Stable employment and income documentation — W-2 employees need 2 years of tax returns; self-employed borrowers need 2 years of business and personal returns",
      "Cash reserves of 2-6 months of mortgage payments may be required depending on loan amount, number of properties owned, and credit profile",
      "Property appraisal must support the purchase price, though conventional appraisals are generally less restrictive than FHA or VA appraisals"
    ],

    benefits: [
      "PMI automatically cancels at 78% loan-to-value — unlike FHA mortgage insurance, which lasts the life of the loan if you put less than 10% down",
      "No upfront mortgage insurance premium — FHA charges 1.75% upfront, USDA charges 1.0%, but conventional loans have zero upfront MI cost",
      "More property types eligible — conventional loans work for primary residences, second homes, vacation properties, and investment properties (government loans are primary residence only)",
      "Higher loan limits — the 2026 conforming limit of $806,500 covers most Florida purchases without jumping to jumbo requirements",
      "Sellers prefer conventional offers — in multiple-offer situations, sellers and listing agents view conventional financing as stronger due to faster closings (25-30 days typical) and fewer appraisal hurdles",
      "Gift funds allowed for the entire down payment from family members (3% minimum down can be 100% gift money for primary residence purchases)",
      "Renovation financing available through Fannie Mae HomeStyle or Freddie Mac CHOICERenovation programs — finance the purchase plus renovation costs in one loan",
      "No income limits and no geographic restrictions — unlike USDA (rural areas only) or some down payment assistance programs, conventional loans work anywhere for any income level"
    ],

    faq: [
      {
        question: "What is the conforming loan limit in Florida for 2026?",
        answer: "The 2026 conforming loan limit is $806,500 for a single-family home in every Florida county. This is the maximum loan amount for a conventional mortgage that conforms to Fannie Mae and Freddie Mac guidelines. Loans above this amount are classified as jumbo loans, which have stricter credit, income, and down payment requirements."
      },
      {
        question: "How do I get rid of PMI on a conventional loan?",
        answer: "PMI automatically drops off when your loan balance reaches 78% of the original purchase price through normal payments. You can also request PMI removal at 80% LTV by contacting your servicer — they may require a new appraisal showing your home has not lost value. If your home has appreciated, you can request removal even sooner based on current market value with an appraisal (typically at 75-80% of current value depending on the investor)."
      },
      {
        question: "Is a conventional loan better than FHA for Florida buyers?",
        answer: "It depends on your credit score and down payment. Buyers with 700+ credit scores and 5-10% down almost always save money with conventional because PMI is cheaper than FHA MIP and drops off automatically. Buyers with scores below 680 or minimal savings often get better terms with FHA. Barrett recommends having your lender run both scenarios side by side — the total cost over the first 5-7 years is what matters, not just the monthly payment."
      },
      {
        question: "Can I buy an investment property with a conventional loan?",
        answer: "Yes. Conventional loans are the primary financing option for investment properties since FHA, VA, and USDA are all restricted to primary residences. Investment property conventional loans require 15-25% down payment, a credit score of 680+, and typically carry interest rates 0.5%-0.75% higher than primary residence rates. You will also need 6 months of cash reserves for each financed property you own."
      },
      {
        question: "What closing costs should I expect with a conventional loan in Florida?",
        answer: "Florida conventional loan closing costs typically run 2-4% of the purchase price. This includes lender origination fees, appraisal ($400-$600), title insurance (in most Florida counties, the seller traditionally pays for the owner's title policy), Florida doc stamps ($0.70 per $100), intangible tax ($0.20 per $100 on the mortgage), recording fees, and prepaid items. On a $400,000 purchase, expect $8,000-$16,000 in closing costs."
      },
      {
        question: "What credit score do I need for the best conventional loan rate?",
        answer: "A credit score of 740 or higher gets you the best conventional loan pricing — both the lowest interest rate and the cheapest PMI. Between 700-739, rates increase slightly. At 680-699, you will see noticeably higher rates. Below 680, conventional lending becomes expensive enough that FHA may actually be cheaper. Each 20-point tier in your credit score directly impacts your monthly payment and total loan cost."
      }
    ],

    proTips: [
      "In a multiple-offer situation, conventional financing gives your offer an edge over FHA or USDA. Listing agents know that conventional appraisals are less restrictive, closings are faster (25-30 days vs. 35-45 for government loans), and there is less chance of the deal falling apart due to property condition issues. If you can go conventional, do it.",
      "If you are putting less than 20% down, ask your lender about lender-paid PMI (LPMI). Instead of a monthly PMI payment, the lender raises your interest rate slightly and pays the PMI themselves. You get a lower monthly payment, and unlike borrower-paid PMI, you can deduct the full mortgage interest on your taxes. The trade-off is you cannot cancel it — but if you plan to refinance or sell within 5-7 years, LPMI often wins.",
      "Florida homestead exemption saves up to $50,000 off your assessed property value for tax purposes. On a conventional purchase, file for homestead within 30 days of closing. Combined with Florida's Save Our Homes cap (assessed value cannot increase more than 3% per year after homestead), your property taxes stay manageable even as market values climb.",
      "If your credit score is between 680 and 720, spend 30-60 days improving it before you apply. Paying down credit card balances to below 30% utilization, removing errors from your credit report, and avoiding new inquiries can move your score 20-40 points — potentially saving you thousands in interest and PMI over the life of the loan. Barrett can refer you to a credit optimization specialist if needed."
    ]
  },

"jumbo-loan-florida": {
    description: `A jumbo loan is any mortgage that exceeds the 2026 conforming loan limit of $806,500 set by the Federal Housing Finance Agency (FHFA). In Florida, where luxury waterfront homes, estate properties, and high-end condos regularly list above $1 million, jumbo financing is essential for buyers targeting premium neighborhoods like Davis Islands, Hyde Park, Westchase, Beach Park, South Tampa, and Harbour Island. Unlike conforming loans backed by Fannie Mae or Freddie Mac, jumbo loans are held on the lender's books (portfolio loans), which means stricter underwriting — but also more flexibility on terms if you have strong financials.

Florida's jumbo market has evolved significantly. In 2026, several national and regional lenders offer competitive jumbo rates that are within 0.25% to 0.50% of conforming rates for well-qualified borrowers. Some lenders even offer jumbo rates below conforming rates for borrowers with 740+ credit scores and 25%+ down payments. Interest-only options, adjustable-rate jumbos (5/1, 7/1, and 10/1 ARMs), and 40-year amortization schedules are available depending on the lender and your financial profile.

Barrett Henry, Broker Associate at REMAX Collective with 23+ years of real estate experience, works with Tampa Bay luxury buyers regularly and can connect you with portfolio lenders who specialize in high-value Florida properties. Whether you are purchasing a $900,000 pool home in Westchase or a $3 million waterfront estate on Davis Islands, understanding jumbo loan requirements upfront prevents surprises and strengthens your negotiating position. Call Barrett at (813) 733-7907 to discuss your luxury home financing options.`,

    requirements: [
      "Minimum credit score of 700, with most lenders preferring 720+ for the best rates — some portfolio lenders require 740+ for loan amounts above $1.5 million",
      "Down payment of 10% to 20% minimum depending on loan amount — loans above $1.5 million typically require 20-25% down, and some lenders require 30% for loans over $2 million",
      "Debt-to-income (DTI) ratio of 43% or lower — some lenders cap at 38% for jumbo loans, though compensating factors like large reserves can allow up to 45%",
      "Cash reserves of 6 to 12 months of mortgage payments (PITI) after closing — lenders want proof you can weather income disruptions on a large loan",
      "Full documentation of income with 2 years of tax returns, W-2s or 1099s, and recent pay stubs — self-employed borrowers need 2 years of business tax returns and a CPA letter",
      "Two independent property appraisals may be required for loan amounts above $1.5 million — Florida lenders often require this to protect against overvaluation in luxury markets",
      "Maximum loan amounts vary by lender: most go up to $3 million standard, with some portfolio lenders offering super-jumbo products up to $10 million or more",
      "Primary residence, second home, and investment properties are all eligible, though investment property jumbos require 25-30% down and carry higher rates",
    ],

    benefits: [
      "Finance luxury homes above the $806,500 conforming limit — the only way to get a single mortgage on Tampa Bay's premium waterfront, estate, and high-rise condo properties",
      "Competitive rates in 2026: well-qualified borrowers can secure jumbo rates within 0.25-0.50% of conforming rates, and some portfolio lenders offer rates at or below conforming for 740+ credit scores",
      "No private mortgage insurance (PMI) requirement — even with less than 20% down, many jumbo lenders use risk-based pricing instead of PMI, saving hundreds per month",
      "Flexible loan structures including interest-only periods (typically 5-10 years), adjustable-rate options (5/1, 7/1, 10/1 ARMs), and 40-year amortization for lower monthly payments",
      "Asset-based qualifying available from select portfolio lenders — ideal for retirees, business owners, or high-net-worth buyers whose tax returns understate their actual financial strength",
      "No conforming loan limits on property type: single-family, condos (warrantable and non-warrantable), townhomes, and even some co-ops qualify for jumbo financing",
      "Rate buydown options: jumbo lenders frequently offer 2-1 and 3-2-1 temporary buydowns, and permanent buydown points are often priced more aggressively than conforming loans",
      "Relationship pricing discounts: if you move assets (typically $250K+) to the lending institution, many banks offer 0.125% to 0.375% rate reductions on jumbo mortgages",
    ],

    faq: [
      {
        question: "What is the jumbo loan limit in Florida for 2026?",
        answer: "The 2026 conforming loan limit in Florida is $806,500 for a single-family home in all counties. Any mortgage above that amount is classified as a jumbo loan. This is a uniform limit across Florida — unlike some high-cost areas in California or New York, no Florida county has a higher conforming limit.",
      },
      {
        question: "Are jumbo loan rates higher than conventional loan rates?",
        answer: "Not necessarily. In 2026, jumbo rates for well-qualified borrowers (720+ credit, 20%+ down) are typically within 0.25% to 0.50% of conforming rates, and some portfolio lenders actually offer lower rates on jumbos than on conforming loans. The spread has narrowed significantly over the past few years as more lenders compete for high-value borrowers.",
      },
      {
        question: "Can I get a jumbo loan with 10% down in Florida?",
        answer: "Yes, several lenders offer jumbo loans with 10% down for loan amounts up to $1.5 million, though you will need a credit score of 720+ and strong reserves (typically 12+ months PITI). For loans above $1.5 million, most lenders require 20-25% down. Your rate will be slightly higher with 10% down compared to 20%.",
      },
      {
        question: "Do jumbo loans require two appraisals?",
        answer: "It depends on the loan amount and lender. Most jumbo lenders require one full appraisal for loans up to $1.5 million and two independent appraisals for loans above that threshold. In Florida's luxury market, some lenders require two appraisals regardless of loan amount if the property is unique (waterfront, acreage, or custom-built).",
      },
      {
        question: "Can self-employed buyers qualify for jumbo loans in Florida?",
        answer: "Yes, but documentation requirements are stricter. You will need 2 full years of personal and business tax returns, a current year-to-date profit and loss statement prepared by a CPA, and business bank statements. Some portfolio lenders offer bank statement jumbo programs where 12-24 months of bank deposits are used instead of tax returns, though rates are 0.50-1.00% higher.",
      },
      {
        question: "Which Tampa Bay neighborhoods typically require jumbo financing?",
        answer: "Davis Islands, Hyde Park, Beach Park, Harbour Island, Bayshore Beautiful, Palma Ceia, and South Tampa waterfront properties routinely exceed $806,500 and require jumbo loans. In the suburbs, premium communities in Westchase, Avila, and Odessa also frequently cross the jumbo threshold, especially for newer construction with pools and large lots.",
      },
    ],

    proTips: [
      "Get pre-approved with a portfolio lender, not just a big bank. Portfolio lenders (community banks and credit unions that keep loans on their books) have more flexibility on underwriting jumbo loans. I have seen portfolio lenders approve jumbo borrowers that Wells Fargo and Chase turned down — same financials, different risk appetite. Call Barrett at (813) 733-7907 for lender referrals.",
      "If you are buying above $1 million in Tampa Bay, consider a 7/1 or 10/1 ARM instead of a 30-year fixed. Most luxury homeowners sell or refinance within 7-10 years, and a jumbo ARM can save 0.50-0.75% on your rate — on a $1.2 million loan, that is $6,000 to $9,000 per year in interest savings.",
      "Move liquid assets to your lending institution before applying. Most banks offer relationship pricing: transfer $250K-$500K in investable assets and you can get 0.125% to 0.375% off your jumbo rate. On a $1 million loan, a 0.25% rate reduction saves roughly $2,500 per year.",
      "In a competitive luxury market, a jumbo pre-approval letter from a reputable portfolio lender carries more weight than a pre-qualification from an online lender. Listing agents in South Tampa and Davis Islands scrutinize buyer financing — a strong pre-approval can win a deal when multiple offers are in play.",
    ],
  },

  // ===========================================================================
  // RENOVATION LOAN — FHA 203(k) and Fannie Mae HomeStyle
  // ===========================================================================
  "renovation-loan-florida": {
    description: `A renovation loan lets you purchase a home and finance the cost of repairs or upgrades in a single mortgage — eliminating the need to buy first and then take out a separate construction loan or home equity line. In Florida, where older homes in established neighborhoods often need roof replacements, hurricane-impact window upgrades, HVAC updates, or full kitchen and bath remodels, renovation loans are one of the smartest financing tools available. The two primary programs are the FHA 203(k) loan (insured by FHA, lower credit requirements) and the Fannie Mae HomeStyle Renovation loan (conventional, higher loan limits, fewer property restrictions).

The FHA 203(k) comes in two versions: the Standard 203(k) for major renovations above $5,000 with no maximum repair limit (up to the FHA loan limit of $498,257 for most Florida counties in 2026), and the Limited 203(k) — formerly called the Streamline — for cosmetic and minor repairs capped at $35,000. The HomeStyle loan follows conventional loan limits ($806,500 conforming in 2026) and allows renovations up to 75% of the as-completed appraised value, with no minimum repair amount. Both programs require licensed Florida contractors, detailed scopes of work, and draw-based disbursements overseen by a HUD consultant (203k) or the lender (HomeStyle).

Barrett Henry, Broker Associate at REMAX Collective with 23+ years of real estate experience, regularly helps Tampa Bay buyers identify renovation-ready properties in neighborhoods like Seminole Heights, Old Seminole Heights, Riverside Heights, and established Brandon and Valrico communities where older homes at lower price points can be transformed into high-value properties. If you have been outbid on move-in-ready homes, a renovation loan lets you compete in a less crowded segment of the market. Call (813) 733-7907 to discuss whether a renovation loan strategy makes sense for your situation.`,

    requirements: [
      "FHA 203(k): minimum credit score of 580 with 3.5% down payment, or 500-579 with 10% down — the property must be at least one year old and will be your primary residence",
      "HomeStyle Renovation: minimum credit score of 620, with 3-5% down for primary residence, 10% for second homes, and 15% for investment properties — follows standard conventional guidelines",
      "Licensed and insured Florida general contractor required — the contractor must provide a detailed bid, scope of work, and timeline; homeowner self-help (DIY) is NOT allowed on FHA 203(k) and limited on HomeStyle",
      "Standard FHA 203(k) requires a HUD-approved 203(k) consultant to create the work write-up, conduct feasibility analysis, and perform draw inspections — consultant fees ($400-$1,000) are financeable into the loan",
      "Debt-to-income ratio of 43% or lower for FHA 203(k), up to 50% with compensating factors — HomeStyle allows up to 45% DTI standard, up to 50% with strong reserves",
      "Renovation work must begin within 30 days of closing and be completed within 6 months (Limited 203k and HomeStyle) or 12 months (Standard 203k) — extensions are possible but require lender approval",
      "The property must appraise at the as-completed value (after renovations) — the appraiser uses the contractor's scope of work and comparable renovated properties to determine value",
      "Minimum renovation amount of $5,000 for Standard FHA 203(k) — Limited 203(k) is capped at $35,000 total renovation cost, and HomeStyle has no minimum or maximum renovation amount (up to 75% of as-completed value)",
    ],

    benefits: [
      "One loan, one closing, one monthly payment — combine your home purchase and renovation costs into a single mortgage instead of juggling a purchase loan plus a construction loan or HELOC",
      "Buy below market value and build instant equity: purchase a home for $300,000, finance $75,000 in renovations, and end up with a property worth $425,000+ based on the as-completed appraisal",
      "Low down payment options: FHA 203(k) requires just 3.5% down on the total loan amount (purchase price plus renovation costs), and HomeStyle requires 3-5% down for primary residences",
      "Less competition from other buyers — move-in-ready homes attract multiple offers, but renovation-ready properties often sit longer on the market, giving you more negotiating leverage on price",
      "Finance essential Florida-specific upgrades: hurricane-impact windows and doors, roof replacement (critical for insurance), whole-house generators, modern HVAC systems, and wind mitigation improvements that lower your insurance premiums",
      "HomeStyle allows renovations on investment properties and second homes — unlike 203(k) which is primary residence only, HomeStyle lets investors renovate rental properties with as little as 15% down",
      "Renovation funds are held in escrow and released in draws as work is completed and inspected — this protects you from paying a contractor upfront and ensures quality workmanship at each stage",
      "Eligible improvements include structural changes, room additions, kitchen and bath remodels, new roofing, plumbing and electrical upgrades, energy-efficient improvements, accessibility modifications, and landscaping (HomeStyle only)",
    ],

    faq: [
      {
        question: "What is the difference between an FHA 203(k) and a HomeStyle renovation loan?",
        answer: "The FHA 203(k) is government-insured with lower credit requirements (580 minimum) and lower down payments (3.5%), but it is limited to primary residences and carries mortgage insurance for the life of the loan. The Fannie Mae HomeStyle is a conventional loan requiring 620+ credit, allows second homes and investment properties, has higher loan limits ($806,500 vs. $498,257), and lets you cancel PMI at 80% loan-to-value. HomeStyle also has fewer restrictions on luxury improvements like pools and landscaping.",
      },
      {
        question: "Can I do the renovation work myself to save money?",
        answer: "On an FHA 203(k), no — all work must be completed by a licensed Florida general contractor. The HomeStyle program allows limited homeowner labor (sweat equity) on some projects, but you still need a licensed contractor for permits, inspections, and any work requiring a license (electrical, plumbing, roofing, HVAC). Lenders want professional accountability and insurance coverage on the work.",
      },
      {
        question: "How does the contractor get paid on a renovation loan?",
        answer: "Renovation funds are held in an escrow account and released in draws (typically 3-5 draws depending on project size). After each phase of work is completed, an inspector verifies the work, and the lender releases payment to the contractor. The contractor may receive up to 50% upfront on an FHA 203(k) Standard, but most lenders keep draws tied to verified completion milestones.",
      },
      {
        question: "What renovations are NOT allowed on a 203(k) loan?",
        answer: "FHA 203(k) does not allow luxury improvements like swimming pools, hot tubs, outdoor kitchens, or tennis courts. It also does not cover furniture, decorative landscaping, or any work that takes less than $5,000 (use the Limited 203k for small projects under $35,000). The HomeStyle loan is more flexible and does allow pools and landscaping as part of the renovation scope.",
      },
      {
        question: "How long does a renovation loan take to close compared to a regular mortgage?",
        answer: "Plan for 45-60 days from contract to closing, compared to 30-45 days for a standard purchase loan. The extra time is needed for the contractor bid review, HUD consultant write-up (203k), the as-completed appraisal, and lender underwriting of the renovation scope. Having your contractor and scope of work ready before you make an offer saves significant time.",
      },
      {
        question: "Can I live in the house during renovations?",
        answer: "It depends on the scope of work. For cosmetic renovations (Limited 203k or minor HomeStyle projects), you can typically move in at closing and live there during the work. For major structural renovations (Standard 203k), the home may be uninhabitable during construction. FHA 203(k) allows you to finance up to 6 months of mortgage payments into the loan if you cannot occupy the home during renovations.",
      },
    ],

    proTips: [
      "Find your contractor BEFORE you start house hunting. The biggest bottleneck on renovation loans is getting a detailed contractor bid that the lender will accept. Interview 2-3 licensed Florida general contractors, check their experience with 203(k) or HomeStyle projects specifically, and have one ready to walk properties with you. Barrett Henry at (813) 733-7907 can recommend contractors experienced with renovation loan requirements.",
      "Target homes in established Tampa Bay neighborhoods where the lot value and location justify the renovation investment. Seminole Heights, Old Seminole Heights, Riverside Heights, and parts of Brandon and Valrico have older homes listed $50,000-$100,000 below renovated comps — that gap is your built-in equity opportunity.",
      "Add hurricane-impact windows, a new roof, and wind mitigation features to your renovation scope. In Florida, these upgrades can reduce your homeowners insurance premium by 20-45%, which often offsets the additional mortgage cost. Plus, a wind mitigation report showing impact-resistant features makes your offer more attractive to sellers who know insurance is a concern.",
      "If your renovation budget is under $35,000, use the FHA Limited 203(k) — it is faster, requires no HUD consultant, and has simpler paperwork. Common Limited 203(k) projects include roof replacement, HVAC upgrade, kitchen or bath remodel, and flooring throughout. Over $35,000, you must use the Standard 203(k) or HomeStyle.",
    ],
  },

  // ===========================================================================
  // REVERSE MORTGAGE — HECM for 62+ homeowners
  // ===========================================================================
  "reverse-mortgage-florida": {
    description: `A reverse mortgage — formally called a Home Equity Conversion Mortgage (HECM) — allows Florida homeowners age 62 and older to convert a portion of their home equity into tax-free cash without making monthly mortgage payments. Instead of you paying the lender each month, the lender pays you (or provides a line of credit), and the loan balance grows over time. The loan is repaid when you sell the home, move out permanently, or pass away. HECMs are insured by the Federal Housing Administration (FHA) and regulated by HUD, which means standardized protections including a non-recourse guarantee: you or your heirs will never owe more than the home is worth, even if the loan balance exceeds the property value.

In Florida, reverse mortgages have unique considerations tied to the state's homestead exemption laws. Your homestead exemption remains intact with a reverse mortgage — you do not lose your property tax savings. However, both spouses must be listed as borrowers (or eligible non-borrowing spouses must meet specific HUD requirements) to ensure the surviving spouse can remain in the home. Florida's strong property value appreciation in markets like Tampa Bay, Sarasota, and the Gulf Coast means many homeowners age 62+ are sitting on substantial equity — the median home value in Hillsborough County exceeds $380,000 in 2026, potentially qualifying for a reverse mortgage payout of $150,000 to $225,000 depending on age and interest rates.

Barrett Henry, Broker Associate at REMAX Collective with 23+ years of real estate experience, has worked with many Tampa Bay homeowners navigating the decision between a reverse mortgage and selling their home. A reverse mortgage is not the right fit for everyone, but for homeowners who want to age in place, eliminate their monthly mortgage payment, or access cash for healthcare, home modifications, or supplemental retirement income, it can be a powerful tool. HUD requires independent counseling before you can apply — this protects you from high-pressure sales tactics. Call Barrett at (813) 733-7907 for an honest conversation about whether a reverse mortgage makes sense for your situation.`,

    requirements: [
      "All borrowers must be at least 62 years old — if one spouse is under 62, they can be listed as an eligible non-borrowing spouse (they can stay in the home but their age is not used in the benefit calculation, which reduces the payout amount)",
      "The home must be your primary residence — you must live in the property as your principal home; second homes, vacation properties, and investment properties are not eligible for HECM reverse mortgages",
      "Complete a HUD-approved HECM counseling session before applying — this independent counseling (phone or in-person, typically $125-$175) is mandatory and covers loan terms, alternatives, and financial implications; no lender can waive this requirement",
      "Sufficient home equity: while there is no specific equity percentage requirement, you must have enough equity to pay off any existing mortgage balance from the reverse mortgage proceeds and still receive a meaningful benefit — most borrowers need at least 50% equity",
      "Financial assessment: lenders evaluate your income, credit history, and expenses to ensure you can maintain property taxes, homeowners insurance, and home maintenance — if concerns exist, the lender may require a set-aside (escrow) from your loan proceeds",
      "Property must meet FHA minimum property standards — a home inspection or appraisal may identify required repairs that must be completed before or shortly after closing; common Florida issues include roof condition, HVAC function, and structural integrity",
      "Eligible property types include single-family homes, HUD-approved condominiums, 2-4 unit properties (if borrower occupies one unit), and some manufactured homes built after June 1976 on a permanent foundation",
      "No minimum credit score requirement from HUD, but the financial assessment reviews credit history for patterns of delinquency — recent bankruptcy, foreclosure, or federal debt (tax liens, student loans) may require explanation or resolution",
    ],

    benefits: [
      "Eliminate your monthly mortgage payment — the reverse mortgage pays off your existing mortgage, and you make no monthly principal or interest payments for as long as you live in the home as your primary residence",
      "Tax-free proceeds: reverse mortgage payouts are considered loan advances, not income, so they are not subject to federal or state income tax and do not affect your Social Security benefits (though they may affect Medicaid eligibility if not spent within the same month)",
      "Multiple payout options: receive a lump sum at closing, fixed monthly payments (tenure or term), a line of credit you draw from as needed, or any combination — the line of credit option is particularly powerful because the unused balance grows over time at the loan's interest rate",
      "Non-recourse loan protection: you or your heirs will never owe more than the home's fair market value at the time of repayment, even if the loan balance has grown beyond the home's worth — FHA insurance covers the difference",
      "Florida homestead exemption is preserved — your property tax savings through homestead exemption remain intact when you take a reverse mortgage, and your Save Our Homes cap on assessed value increases continues to apply",
      "Heirs retain all options: when the borrower passes away or moves out, heirs can sell the home and keep any equity above the loan balance, refinance into a traditional mortgage to keep the home, or let the lender sell it (and keep any surplus equity); heirs are never personally liable for the debt",
      "HECM for Purchase option: buyers 62+ can use a reverse mortgage to purchase a new home, combining the down payment with a reverse mortgage so they never make monthly payments — ideal for Florida downsizers or relocators",
      "Growing line of credit: if you choose the credit line option, the unused portion grows at the same rate as the loan's interest rate plus the annual MIP rate — a $100,000 credit line could grow to $130,000+ in 5 years without you doing anything",
    ],

    faq: [
      {
        question: "Do I still own my home with a reverse mortgage?",
        answer: "Yes, you retain full ownership and title to your home. A reverse mortgage is a lien against the property, just like a traditional mortgage — the lender does not own your home. You remain responsible for property taxes, homeowners insurance, HOA fees, and basic maintenance. The loan is repaid when you sell, move out permanently, or pass away.",
      },
      {
        question: "How much money can I get from a reverse mortgage in Florida?",
        answer: "The amount depends on your age (older borrowers receive more), current interest rates (lower rates mean higher payouts), and your home's appraised value up to the 2026 HECM limit of $1,209,750. A 72-year-old with a $400,000 home and no existing mortgage could potentially access $200,000-$240,000. A HUD-approved counselor and lender can provide an exact calculation based on your specific situation.",
      },
      {
        question: "What happens to the reverse mortgage when I die?",
        answer: "Your heirs have options. They can sell the home and keep any equity above the loan balance, refinance into a conventional mortgage to keep the property, or deed the home to the lender if the loan balance exceeds the value (with no personal liability). Heirs typically have 6 months to decide, with possible extensions up to 12 months. The estate is never responsible for any shortfall between the loan balance and home value.",
      },
      {
        question: "Does a reverse mortgage affect my Florida homestead exemption?",
        answer: "No. Your Florida homestead exemption remains fully intact with a reverse mortgage. You continue to receive the up to $50,000 property tax exemption, and your Save Our Homes 3% annual cap on assessed value increases is preserved. The reverse mortgage does not change your homestead status as long as the property remains your primary residence.",
      },
      {
        question: "Can I use a reverse mortgage to buy a new home in Florida?",
        answer: "Yes, the HECM for Purchase program allows buyers age 62+ to purchase a new primary residence using a reverse mortgage. You make a larger down payment (typically 45-62% of the purchase price, depending on your age) and finance the rest with a reverse mortgage — no monthly mortgage payments from day one. This is popular with Florida downsizers and retirees relocating to Tampa Bay.",
      },
      {
        question: "What are the costs and fees on a reverse mortgage?",
        answer: "Costs include an origination fee (up to $6,000, based on home value), FHA mortgage insurance premium (2% of the home's appraised value upfront, plus 0.50% annually on the loan balance), third-party closing costs (appraisal, title, recording — typically $2,000-$4,000), and the mandatory counseling fee ($125-$175). Most of these costs can be financed into the loan rather than paid out of pocket.",
      },
    ],

    proTips: [
      "The growing line of credit is the most underused and most powerful reverse mortgage feature. Even if you do not need cash today, opening a reverse mortgage line of credit at age 62 and letting it grow means you will have a significantly larger pool of funds available at 72 or 75 when you might need it for healthcare, home modifications, or supplemental income. The unused credit line grows regardless of what happens to your home's market value.",
      "If you are considering selling your home to downsize, compare the net proceeds of selling against the HECM for Purchase option. A HECM for Purchase lets you buy a new Florida home — say a maintenance-free condo or villa in a 55+ community — and never make monthly mortgage payments. Many Tampa Bay retirees use this strategy to upgrade their living situation while preserving cash. Call Barrett at (813) 733-7907 to run the numbers both ways.",
      "Make sure both spouses are protected. If one spouse is under 62, they should be listed as an eligible non-borrowing spouse on the reverse mortgage. Without this designation, the younger spouse could be forced to repay the loan or vacate the home if the borrowing spouse passes away or moves to a care facility. HUD rules now protect non-borrowing spouses, but only if properly documented at origination.",
      "Talk to a fee-only financial planner — not a reverse mortgage salesperson — before deciding. A reverse mortgage can be an excellent tool for the right situation, but it is not free money. The loan balance grows over time, reducing the equity available to you or your heirs. Barrett Henry will give you an honest assessment at (813) 733-7907 and can refer you to a fiduciary financial advisor to review the full picture.",
    ],
  },

  // ===========================================================================
  // CONSTRUCTION LOAN — Build a new home or construction-to-permanent
  // ===========================================================================
  "construction-loan-florida": {
    description: `A construction loan finances the building of a new home from the ground up — covering lot purchase, site preparation, materials, labor, and everything through final inspection and certificate of occupancy. In Florida, the most common approach is a construction-to-permanent (CTP) loan, which starts as a short-term construction loan during the build phase and automatically converts to a permanent 30-year mortgage once the home is complete. This single-close structure means one application, one set of closing costs, and one rate lock — compared to the old two-close method where you had to qualify and pay closing costs twice.

Building a home in Florida involves state-specific requirements that directly affect your construction loan. Florida Building Code (FBC) mandates wind resistance standards based on your county's wind zone, with the highest requirements along the coast. All new construction must meet the 2023 Florida Building Code (8th edition), which includes enhanced hurricane protection, energy efficiency standards (Florida Energy Code), and flood zone compliance. Your construction lender will require a licensed Florida general contractor (CGC or CBC license), detailed architectural plans stamped by a Florida-licensed architect or engineer, and proof of all required permits before releasing the first draw.

Barrett Henry, Broker Associate at REMAX Collective with 23+ years of real estate experience, works with buyers building custom homes in Tampa Bay communities across Hillsborough, Pasco, Pinellas, Polk, and Manatee counties. Whether you are purchasing a lot in a rural Pasco community, building on acreage in eastern Hillsborough, or tearing down a teardown in South Tampa to build new, Barrett can connect you with experienced construction lenders and licensed builders. Construction loans are more complex than standard purchase mortgages — start the conversation early by calling (813) 733-7907.`,

    requirements: [
      "Minimum credit score of 680 for most construction-to-permanent lenders, with 700+ preferred for the best rates — some credit unions and community banks will go to 660 with compensating factors like large down payments or low DTI",
      "Down payment of 20% to 25% of the total project cost (land plus construction) — some lenders accept 10-15% down with PMI for well-qualified borrowers, but 20% is the standard for construction loans",
      "Licensed Florida general contractor with an active CGC (Certified General Contractor) or CBC (Certified Building Contractor) license — the lender will verify the license, insurance ($1M+ general liability and workers comp), and check for any complaints with the Florida DBPR",
      "Detailed construction plans, specifications, and a fixed-price or cost-plus contract with the builder — the lender needs to know exactly what is being built, the total cost breakdown, and the projected timeline before approving the loan",
      "Debt-to-income ratio of 43% or lower based on the future permanent mortgage payment (not the interest-only construction phase payment) — lenders qualify you on the long-term payment to ensure you can afford the home once construction is complete",
      "Appraisal based on plans and specifications (subject-to appraisal) — a licensed appraiser reviews the blueprints and comparable new construction sales to determine the as-completed market value; the loan amount is based on this projected value",
      "Land must be purchased or already owned — if you are buying the lot separately, many CTP lenders will finance the lot purchase as part of the construction loan; if you already own the lot, its equity can count toward your down payment",
      "Builder must provide a detailed draw schedule (typically 5-7 draws) tied to construction milestones — foundation, framing, dry-in (roof/windows/doors), mechanical rough-in, drywall, finish, and final inspection/CO",
    ],

    benefits: [
      "Single-close construction-to-permanent loans mean one application, one appraisal, one set of closing costs, and one rate lock — saving $3,000-$8,000 compared to a two-close approach and eliminating the risk of not qualifying for the permanent loan after construction",
      "Interest-only payments during construction: you only pay interest on the funds that have been drawn (disbursed) so far, not the full loan amount — early in construction when only 10-20% has been drawn, your payments are very low",
      "Build exactly what you want: choose your floor plan, finishes, lot orientation, and features like a pool, outdoor kitchen, owners suite layout, and hurricane-rated impact windows — no compromises or costly renovations after purchase",
      "Florida Building Code compliance from day one: new construction meets the 2023 FBC 8th edition standards for wind resistance, energy efficiency, and flood protection — this qualifies you for the lowest possible homeowners insurance rates and wind mitigation credits",
      "Lock your permanent rate at closing: with a single-close CTP loan, your 30-year fixed rate is locked before construction begins — if rates rise during the 6-12 month build, you are protected; some lenders offer a float-down option if rates drop",
      "Finance the lot purchase into the construction loan — no need for a separate land loan; the lot cost, site preparation, impact fees, and construction costs are all rolled into one loan with one down payment",
      "Built-in inspections protect your investment: the lender sends a third-party inspector before each draw to verify that work has been completed per plans and specifications — this catches quality issues early and ensures the builder stays on track",
      "Energy savings from day one: new Florida homes built to current code are significantly more energy efficient than existing homes, with estimated savings of 20-35% on utility costs through better insulation, impact-rated windows, high-efficiency HVAC, and modern building envelopes",
    ],

    faq: [
      {
        question: "How does a construction-to-permanent loan work in Florida?",
        answer: "A construction-to-permanent (CTP) loan is a single loan that covers both the construction phase and the permanent mortgage. You close once, lock your rate, and make interest-only payments during the 6-12 month build phase. Once the home passes final inspection and receives its certificate of occupancy, the loan automatically converts to a standard 30-year (or 15-year) mortgage with principal and interest payments. No second closing, no second set of fees.",
      },
      {
        question: "How much does it cost to build a home in Florida in 2026?",
        answer: "In the Tampa Bay area, new construction costs range from $175 to $300+ per square foot depending on location, finishes, and complexity. A 2,400 square foot home with mid-range finishes typically costs $420,000 to $550,000 to build, not including the lot. Waterfront builds, custom designs, and high-end finishes can push costs to $350-$500 per square foot. These numbers do not include the lot, impact fees, or site work (which can add $20,000 to $80,000+).",
      },
      {
        question: "What is a draw schedule and how do disbursements work?",
        answer: "A draw schedule divides the construction loan into 5-7 payments (draws) tied to completion milestones. Typical milestones are: foundation pour, framing complete, dry-in (roof and windows installed), mechanical rough-in (plumbing, electrical, HVAC), drywall and interior finishes, and final inspection. Before each draw, a third-party inspector verifies the work is complete and the lender releases funds directly to the builder.",
      },
      {
        question: "Can I be my own general contractor on a construction loan?",
        answer: "Most construction lenders in Florida require a licensed general contractor (CGC or CBC) and will not approve owner-builder construction loans. The risk is too high for the lender without a licensed, insured professional managing the project. A few portfolio lenders and credit unions offer owner-builder programs, but they typically require 30%+ down payment and extensive documentation of your construction experience.",
      },
      {
        question: "What happens if construction goes over budget?",
        answer: "Cost overruns are the borrower's responsibility unless the builder has a fixed-price contract. With a cost-plus contract, the lender may require a contingency reserve (typically 5-10% of the construction cost) built into the loan. If costs exceed the loan amount and contingency, you will need to bring additional cash to cover the difference. A fixed-price contract with an experienced builder is the best protection against overruns.",
      },
      {
        question: "Do I need to own the lot before getting a construction loan?",
        answer: "No. Most construction-to-permanent lenders in Florida will finance the lot purchase as part of the construction loan. If you already own the lot free and clear, its appraised value counts toward your down payment — a $100,000 lot on a $500,000 total project effectively gives you 20% equity from the start. If you have an existing lot loan, the construction loan typically pays it off at closing.",
      },
    ],

    proTips: [
      "Vet your builder like you are hiring a business partner — because you are. Check their Florida DBPR license status online, ask for 5+ references from homes completed in the last 2 years, visit their active job sites, and review their standard contract with a real estate attorney before signing. A bad builder can turn a dream home into a financial nightmare. Barrett Henry at (813) 733-7907 can recommend builders with proven track records in Tampa Bay.",
      "Build in a 10% contingency on your construction budget, even with a fixed-price contract. Change orders happen — you will want to upgrade the owners suite tile, add a gas line for the outdoor kitchen, or discover the lot needs additional fill dirt. Having a 10% cushion financed into the loan means these changes do not come out of your emergency fund.",
      "Pay close attention to Florida impact fees, which vary dramatically by county and can add $15,000 to $40,000+ to your project cost. Hillsborough, Pasco, and Polk counties all assess impact fees for transportation, water, sewer, schools, and parks. Your builder should include these in the total project estimate, but some quotes exclude them — always ask.",
      "Request a single-close CTP loan with a float-down option. This lets you lock your permanent mortgage rate at closing (protecting you if rates rise during the 6-12 month build) while also giving you the option to take a lower rate if rates drop by a specified amount (typically 0.25-0.50%) before the construction-to-permanent conversion. Not all lenders offer this, so ask specifically.",
    ],
  }
};


/** Look up loan content by slug */
export function getLoanContent(slug: string): LoanContent | undefined {
  return loanContent[slug];
}

/** Get all loan content slugs */
export function getAllLoanContentSlugs(): string[] {
  return Object.keys(loanContent);
}
