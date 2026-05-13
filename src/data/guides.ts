/**
 * Guide page data — 51 buyer/seller/investor guides from nowtb.com
 * Each guide has a slug, title, excerpt, category, and placeholder sections.
 * Content will be replaced with WP exports as they become available.
 * Auto-generated 2026-05-12.
 */

export interface GuideSection {
  id: string;
  heading: string;
  content: string;
}

export interface GuideData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
  sections: GuideSection[];
}

// --- Helper: generate placeholder sections for a guide topic ---
function makeSections(title: string, bullets: string[]): GuideSection[] {
  return bullets.map((b, i) => ({
    id: `section-${i + 1}`,
    heading: b,
    content: `<p>This section covers ${b.toLowerCase()} as part of our ${title.toLowerCase()} resource. Barrett Henry, Broker Associate at REMAX Collective with 23+ years of real estate experience, breaks down everything you need to know.</p><p>Contact Barrett at (813) 733-7907 for personalized guidance on this topic.</p>`,
  }));
}

/** All 51 guide pages from nowtb.com WordPress site */
export const guides: GuideData[] = [
  // =========================================================================
  // BUYING GUIDES
  // =========================================================================
  {
    slug: "first-time-home-buyer-guide",
    title: "First-Time Home Buyer Guide",
    excerpt: "Step-by-step walkthrough of buying your first home in Florida — from budgeting and pre-approval through closing day.",
    date: "2026-04-10",
    category: "Buying",
    readingTime: "12 min read",
    sections: makeSections("First-Time Home Buyer Guide", [
      "Is Now the Right Time to Buy?",
      "How Much House Can You Afford?",
      "Get Pre-Approved for a Mortgage",
      "Find the Right Home",
      "Make an Offer and Negotiate",
      "Inspections, Appraisal, and Closing",
    ]),
  },
  {
    slug: "first-time-homebuyer-guide",
    title: "First-Time Homebuyer Guide",
    excerpt: "Everything first-time buyers need to know about purchasing a home in Florida.",
    date: "2026-04-10",
    category: "Buying",
    readingTime: "12 min read",
    sections: makeSections("First-Time Homebuyer Guide", [
      "Assessing Your Financial Readiness",
      "Understanding Mortgage Options",
      "The Home Search Process",
      "Making a Competitive Offer",
      "Closing on Your First Home",
    ]),
  },
  {
    slug: "first-time-homebuyer-guide-tampa-bay",
    title: "First-Time Homebuyer Guide: Tampa Bay Edition",
    excerpt: "Tampa Bay-specific guide for first-time buyers covering neighborhoods, prices, and local programs.",
    date: "2026-04-10",
    category: "Buying",
    readingTime: "14 min read",
    sections: makeSections("First-Time Homebuyer Guide Tampa Bay", [
      "Why Buy in Tampa Bay?",
      "Best Neighborhoods for First-Time Buyers",
      "Tampa Bay Down Payment Assistance Programs",
      "Working with a Local REALTOR",
      "Navigating the Tampa Bay Market",
    ]),
  },
  {
    slug: "home-inspection-guide",
    title: "Home Inspection Guide",
    excerpt: "What to expect during a home inspection, common issues found in Florida homes, and how to negotiate repairs.",
    date: "2026-03-15",
    category: "Buying",
    readingTime: "8 min read",
    sections: makeSections("Home Inspection Guide", [
      "What Is a Home Inspection?",
      "What Inspectors Look For",
      "Common Issues in Florida Homes",
      "How to Negotiate Repairs After Inspection",
      "When to Walk Away from a Deal",
    ]),
  },
  {
    slug: "home-inspection-guide-florida",
    title: "Home Inspection Guide for Florida Buyers",
    excerpt: "Florida-specific home inspection guide covering humidity damage, roofing, sinkholes, and insurance requirements.",
    date: "2026-03-15",
    category: "Buying",
    readingTime: "10 min read",
    sections: makeSections("Home Inspection Guide Florida", [
      "Florida-Specific Inspection Concerns",
      "Roof and Hurricane Damage Assessment",
      "Sinkhole and Foundation Checks",
      "Mold and Moisture in Florida Homes",
      "Insurance Implications of Inspection Findings",
    ]),
  },
  {
    slug: "home-appraisal-guide",
    title: "Home Appraisal Guide",
    excerpt: "How home appraisals work, what affects your home's value, and what to do if the appraisal comes in low.",
    date: "2026-03-20",
    category: "Buying",
    readingTime: "7 min read",
    sections: makeSections("Home Appraisal Guide", [
      "What Is a Home Appraisal?",
      "How Appraisers Determine Value",
      "What to Do If the Appraisal Comes in Low",
      "Appraisal vs. Home Inspection",
    ]),
  },
  {
    slug: "how-to-choose-a-realtor",
    title: "How to Choose a REALTOR",
    excerpt: "What to look for when hiring a real estate agent — questions to ask, red flags, and why experience matters.",
    date: "2026-02-28",
    category: "Buying",
    readingTime: "6 min read",
    sections: makeSections("How to Choose a REALTOR", [
      "Why Your Choice of REALTOR Matters",
      "Questions to Ask Before Hiring",
      "Red Flags to Watch For",
      "Local Market Knowledge vs. National Chains",
    ]),
  },
  {
    slug: "how-to-buy-a-condo-tampa-bay",
    title: "How to Buy a Condo in Tampa Bay",
    excerpt: "Condo-buying guide for Tampa Bay — HOA rules, milestone inspections, insurance, and financing.",
    date: "2026-03-05",
    category: "Buying",
    readingTime: "9 min read",
    sections: makeSections("How to Buy a Condo Tampa Bay", [
      "Condo vs. Single-Family Home",
      "Understanding HOA Rules and Fees",
      "Condo Milestone Inspections in Florida",
      "Financing a Condo Purchase",
      "Best Condo Communities in Tampa Bay",
    ]),
  },
  {
    slug: "hoa-buyers-guide",
    title: "HOA Buyer's Guide",
    excerpt: "Everything buyers need to know about HOA communities — fees, rules, reserves, and what to check before buying.",
    date: "2026-03-10",
    category: "Buying",
    readingTime: "8 min read",
    sections: makeSections("HOA Buyer's Guide", [
      "What Is an HOA?",
      "HOA Fees: What They Cover",
      "How to Review HOA Documents",
      "Red Flags in HOA Financials",
      "Your Rights as an HOA Member",
    ]),
  },
  {
    slug: "condo-milestone-inspection-guide",
    title: "Condo Milestone Inspection Guide",
    excerpt: "Florida's condo milestone inspection requirements — what they are, who pays, and how they affect buyers.",
    date: "2026-03-12",
    category: "Buying",
    readingTime: "7 min read",
    sections: makeSections("Condo Milestone Inspection Guide", [
      "What Are Milestone Inspections?",
      "Florida SB 4-D Requirements",
      "How Inspections Affect Condo Values",
      "What Buyers Should Ask About",
    ]),
  },
  {
    slug: "all-cash-offer-guide-tampa-bay",
    title: "All-Cash Offer Guide for Tampa Bay",
    excerpt: "How to make and win with all-cash offers in Tampa Bay real estate — strategy, proof of funds, and closing timeline.",
    date: "2026-02-20",
    category: "Buying",
    readingTime: "7 min read",
    sections: makeSections("All-Cash Offer Guide Tampa Bay", [
      "Benefits of an All-Cash Offer",
      "How to Structure a Cash Offer",
      "Proof of Funds Requirements",
      "Cash Offer Closing Timeline",
    ]),
  },
  {
    slug: "new-construction-guide",
    title: "New Construction Home Guide",
    excerpt: "Everything you need to know about buying new construction in Florida — builders, upgrades, timelines, and negotiation.",
    date: "2026-03-01",
    category: "Buying",
    readingTime: "10 min read",
    sections: makeSections("New Construction Guide", [
      "Benefits of Buying New Construction",
      "Choosing the Right Builder",
      "Upgrades Worth the Investment",
      "New Construction Timeline",
      "Why You Need Your Own REALTOR",
    ]),
  },
  {
    slug: "new-construction-builders-guide",
    title: "New Construction Builders Guide",
    excerpt: "Overview of major homebuilders in Tampa Bay — DR Horton, Lennar, Pulte, Taylor Morrison, and more.",
    date: "2026-03-01",
    category: "Buying",
    readingTime: "9 min read",
    sections: makeSections("New Construction Builders Guide", [
      "Top Builders in Tampa Bay",
      "Builder Comparison: Quality and Price",
      "New Construction Communities by Area",
      "Negotiating with Builders",
    ]),
  },
  {
    slug: "relocation-guide",
    title: "Relocation Guide",
    excerpt: "Moving to Tampa Bay? Everything you need to know about neighborhoods, schools, cost of living, and getting settled.",
    date: "2026-02-15",
    category: "Buying",
    readingTime: "11 min read",
    sections: makeSections("Relocation Guide", [
      "Why People Move to Tampa Bay",
      "Best Neighborhoods by Lifestyle",
      "Cost of Living Overview",
      "Schools and Education",
      "Getting Settled: Utilities and Services",
    ]),
  },
  {
    slug: "military-home-buying-guide",
    title: "Military Home Buying Guide",
    excerpt: "Guide for active duty, veterans, and military families buying a home near MacDill AFB and Tampa Bay.",
    date: "2026-02-10",
    category: "Buying",
    readingTime: "10 min read",
    sections: makeSections("Military Home Buying Guide", [
      "VA Loan Benefits and Eligibility",
      "Best Neighborhoods Near MacDill AFB",
      "PCS Relocation Timeline",
      "BAH and Homebuying Budget",
      "Working with a Military Relocation Professional",
    ]),
  },
  {
    slug: "macdill-afb-housing-guide",
    title: "MacDill AFB Housing Guide",
    excerpt: "Housing options near MacDill Air Force Base — on-base, off-base, neighborhoods, and commute times.",
    date: "2026-02-10",
    category: "Buying",
    readingTime: "9 min read",
    sections: makeSections("MacDill AFB Housing Guide", [
      "On-Base vs. Off-Base Housing",
      "Best Neighborhoods Near MacDill",
      "Commute Times and Routes",
      "BAH Rates for MacDill AFB",
    ]),
  },
  {
    slug: "snowbird-guide-tampa-bay",
    title: "Snowbird Guide to Tampa Bay",
    excerpt: "Seasonal living in Tampa Bay — best 55+ communities, property management, and snowbird lifestyle tips.",
    date: "2026-01-15",
    category: "Buying",
    readingTime: "8 min read",
    sections: makeSections("Snowbird Guide Tampa Bay", [
      "Why Snowbirds Choose Tampa Bay",
      "Best 55+ Communities",
      "Seasonal vs. Year-Round Ownership",
      "Property Management for Snowbirds",
    ]),
  },

  // =========================================================================
  // MORTGAGE & LOAN GUIDES
  // =========================================================================
  {
    slug: "mortgage-pre-approval-guide",
    title: "Mortgage Pre-Approval Guide",
    excerpt: "How to get pre-approved for a mortgage — documents needed, credit requirements, and how long it takes.",
    date: "2026-03-18",
    category: "Financing",
    readingTime: "7 min read",
    sections: makeSections("Mortgage Pre-Approval Guide", [
      "Pre-Qualification vs. Pre-Approval",
      "Documents You Will Need",
      "Credit Score Requirements",
      "How Long Pre-Approval Takes",
    ]),
  },
  {
    slug: "mortgage-pre-approval-guide-florida",
    title: "Mortgage Pre-Approval Guide for Florida",
    excerpt: "Florida-specific mortgage pre-approval guide including state programs and lender recommendations.",
    date: "2026-03-18",
    category: "Financing",
    readingTime: "8 min read",
    sections: makeSections("Mortgage Pre-Approval Guide Florida", [
      "Florida Mortgage Market Overview",
      "State-Specific Programs and Grants",
      "Choosing a Florida Lender",
      "Pre-Approval Timeline",
    ]),
  },
  {
    slug: "mortgage-rate-lock-guide",
    title: "Mortgage Rate Lock Guide",
    excerpt: "When and how to lock your mortgage rate — timing strategies, float-down options, and lock periods.",
    date: "2026-03-22",
    category: "Financing",
    readingTime: "6 min read",
    sections: makeSections("Mortgage Rate Lock Guide", [
      "What Is a Rate Lock?",
      "When to Lock Your Rate",
      "Rate Lock Periods Explained",
      "Float-Down Options",
    ]),
  },
  {
    slug: "conventional-loan-guide",
    title: "Conventional Loan Guide",
    excerpt: "Everything you need to know about conventional loans — requirements, down payment, PMI, and advantages.",
    date: "2026-03-08",
    category: "Financing",
    readingTime: "7 min read",
    sections: makeSections("Conventional Loan Guide", [
      "What Is a Conventional Loan?",
      "Requirements and Eligibility",
      "Down Payment Options",
      "PMI: When and How to Remove It",
    ]),
  },
  {
    slug: "fha-loan-guide",
    title: "FHA Loan Guide",
    excerpt: "FHA loan requirements, benefits, and how to qualify — ideal for first-time buyers with lower down payments.",
    date: "2026-03-08",
    category: "Financing",
    readingTime: "7 min read",
    sections: makeSections("FHA Loan Guide", [
      "What Is an FHA Loan?",
      "FHA Loan Requirements",
      "Down Payment and Credit Score Minimums",
      "FHA Loan Limits in Florida",
    ]),
  },
  {
    slug: "va-home-loan-guide",
    title: "VA Home Loan Guide",
    excerpt: "Complete guide to VA home loans — eligibility, benefits, zero down payment, and the VA funding fee.",
    date: "2026-03-08",
    category: "Financing",
    readingTime: "8 min read",
    sections: makeSections("VA Home Loan Guide", [
      "VA Loan Eligibility Requirements",
      "Benefits of a VA Loan",
      "Zero Down Payment Explained",
      "VA Funding Fee Details",
      "VA Loan vs. Conventional",
    ]),
  },
  {
    slug: "usda-loan-guide",
    title: "USDA Loan Guide",
    excerpt: "USDA rural development loan guide — eligible areas in Florida, income limits, and zero down payment.",
    date: "2026-03-08",
    category: "Financing",
    readingTime: "7 min read",
    sections: makeSections("USDA Loan Guide", [
      "What Is a USDA Loan?",
      "Eligible Areas in Florida",
      "Income Limits and Requirements",
      "USDA Loan vs. FHA vs. VA",
    ]),
  },
  {
    slug: "jumbo-loan-guide",
    title: "Jumbo Loan Guide",
    excerpt: "Jumbo loan guide for Florida buyers — conforming limits, requirements, and luxury home financing.",
    date: "2026-03-08",
    category: "Financing",
    readingTime: "6 min read",
    sections: makeSections("Jumbo Loan Guide", [
      "What Is a Jumbo Loan?",
      "Conforming Loan Limits in Florida",
      "Jumbo Loan Requirements",
      "Rates and Down Payment",
    ]),
  },
  {
    slug: "dscr-loan-guide",
    title: "DSCR Loan Guide",
    excerpt: "DSCR (Debt Service Coverage Ratio) loans for real estate investors — how they work and who qualifies.",
    date: "2026-02-25",
    category: "Investing",
    readingTime: "7 min read",
    sections: makeSections("DSCR Loan Guide", [
      "What Is a DSCR Loan?",
      "How DSCR Is Calculated",
      "Who Qualifies for DSCR Loans",
      "DSCR Loan vs. Conventional Investment Loan",
    ]),
  },

  // =========================================================================
  // SELLING GUIDES
  // =========================================================================
  {
    slug: "home-selling-guide",
    title: "Home Selling Guide",
    excerpt: "Everything sellers need to know — from pricing strategy and staging to marketing and closing.",
    date: "2026-03-28",
    category: "Selling",
    readingTime: "10 min read",
    sections: makeSections("Home Selling Guide", [
      "Pricing Your Home Right",
      "Preparing Your Home to Sell",
      "Marketing That Gets Results",
      "Negotiating Offers",
      "Closing the Sale",
    ]),
  },
  {
    slug: "how-to-sell-your-home-tampa-bay",
    title: "How to Sell Your Home in Tampa Bay",
    excerpt: "Tampa Bay-specific selling guide with local market insights, staging tips, and marketing strategies.",
    date: "2026-03-28",
    category: "Selling",
    readingTime: "10 min read",
    sections: makeSections("How to Sell Your Home Tampa Bay", [
      "Tampa Bay Seller Market Overview",
      "Best Time to Sell in Tampa Bay",
      "Staging for Florida Buyers",
      "Marketing Your Tampa Bay Home",
      "Negotiating and Closing",
    ]),
  },
  {
    slug: "how-to-price-your-home",
    title: "How to Price Your Home",
    excerpt: "Data-driven pricing strategies for sellers — CMAs, market conditions, and avoiding common pricing mistakes.",
    date: "2026-03-25",
    category: "Selling",
    readingTime: "7 min read",
    sections: makeSections("How to Price Your Home", [
      "Why Pricing Matters More Than Anything",
      "How a CMA Works",
      "Pricing in a Seller's Market vs. Buyer's Market",
      "Common Pricing Mistakes to Avoid",
    ]),
  },
  {
    slug: "home-staging-guide",
    title: "Home Staging Guide",
    excerpt: "How to stage your home for maximum appeal and faster sale — room-by-room tips and professional vs. DIY staging.",
    date: "2026-03-20",
    category: "Selling",
    readingTime: "8 min read",
    sections: makeSections("Home Staging Guide", [
      "Why Staging Sells Homes Faster",
      "Room-by-Room Staging Tips",
      "Professional Staging vs. DIY",
      "Staging for Virtual Tours and Photos",
    ]),
  },
  {
    slug: "sellers-disclosure-guide",
    title: "Seller's Disclosure Guide",
    excerpt: "What Florida sellers must disclose — legal requirements, common issues, and how to protect yourself.",
    date: "2026-03-15",
    category: "Selling",
    readingTime: "7 min read",
    sections: makeSections("Seller's Disclosure Guide", [
      "What Is a Seller's Disclosure?",
      "Florida Disclosure Requirements",
      "Common Items to Disclose",
      "Consequences of Non-Disclosure",
    ]),
  },
  {
    slug: "listing-agreement-guide",
    title: "Listing Agreement Guide",
    excerpt: "Understanding listing agreements — types, terms, commission structure, and what to negotiate.",
    date: "2026-03-10",
    category: "Selling",
    readingTime: "6 min read",
    sections: makeSections("Listing Agreement Guide", [
      "Types of Listing Agreements",
      "Key Terms to Understand",
      "Commission Structure Explained",
      "What to Negotiate",
    ]),
  },
  {
    slug: "open-house-guide-for-sellers",
    title: "Open House Guide for Sellers",
    excerpt: "How to prepare for an open house — preparation checklist, safety tips, and maximizing buyer interest.",
    date: "2026-03-05",
    category: "Selling",
    readingTime: "6 min read",
    sections: makeSections("Open House Guide for Sellers", [
      "How to Prepare for an Open House",
      "Day-of Checklist",
      "Safety and Security Tips",
      "What Happens After the Open House",
    ]),
  },

  // =========================================================================
  // FLORIDA-SPECIFIC GUIDES
  // =========================================================================
  {
    slug: "closing-costs-guide-florida",
    title: "Closing Costs Guide for Florida",
    excerpt: "Breakdown of buyer and seller closing costs in Florida — title insurance, doc stamps, and typical amounts.",
    date: "2026-03-20",
    category: "Buying",
    readingTime: "8 min read",
    sections: makeSections("Closing Costs Guide Florida", [
      "What Are Closing Costs?",
      "Buyer Closing Costs in Florida",
      "Seller Closing Costs in Florida",
      "How to Negotiate Closing Costs",
      "Typical Amounts by Price Range",
    ]),
  },
  {
    slug: "closing-day-guide",
    title: "Closing Day Guide",
    excerpt: "What to expect on closing day — documents, final walkthrough, funding, and getting your keys.",
    date: "2026-03-20",
    category: "Buying",
    readingTime: "6 min read",
    sections: makeSections("Closing Day Guide", [
      "Final Walkthrough Before Closing",
      "What to Bring to Closing",
      "Documents You Will Sign",
      "Funding and Key Handoff",
    ]),
  },
  {
    slug: "florida-escrow-guide",
    title: "Florida Escrow Guide",
    excerpt: "How escrow works in Florida real estate — earnest money deposits, escrow agents, and dispute resolution.",
    date: "2026-03-10",
    category: "Buying",
    readingTime: "7 min read",
    sections: makeSections("Florida Escrow Guide", [
      "What Is Escrow?",
      "Earnest Money Deposits in Florida",
      "Role of the Escrow Agent",
      "Escrow Disputes and Resolution",
    ]),
  },
  {
    slug: "florida-flood-insurance-guide",
    title: "Florida Flood Insurance Guide",
    excerpt: "Flood insurance in Florida — zones, requirements, NFIP vs. private, and how to save on premiums.",
    date: "2026-02-20",
    category: "Insurance",
    readingTime: "8 min read",
    sections: makeSections("Florida Flood Insurance Guide", [
      "Flood Zones in Florida Explained",
      "Do You Need Flood Insurance?",
      "NFIP vs. Private Flood Insurance",
      "How to Lower Your Premiums",
    ]),
  },
  {
    slug: "florida-property-insurance-guide",
    title: "Florida Property Insurance Guide",
    excerpt: "Property insurance in Florida — coverage types, hurricane deductibles, and tips for lower premiums.",
    date: "2026-02-20",
    category: "Insurance",
    readingTime: "9 min read",
    sections: makeSections("Florida Property Insurance Guide", [
      "Types of Property Insurance in Florida",
      "Hurricane and Wind Coverage",
      "Deductibles Explained",
      "Shopping for the Best Rates",
    ]),
  },
  {
    slug: "florida-homestead-exemption-guide",
    title: "Florida Homestead Exemption Guide",
    excerpt: "How to file for homestead exemption in Florida — eligibility, savings, portability, and deadlines.",
    date: "2026-01-15",
    category: "Taxes",
    readingTime: "7 min read",
    sections: makeSections("Florida Homestead Exemption Guide", [
      "What Is the Homestead Exemption?",
      "Eligibility Requirements",
      "How Much You Will Save",
      "Portability: Taking It with You",
      "Filing Deadlines and Process",
    ]),
  },
  {
    slug: "florida-property-tax-guide",
    title: "Florida Property Tax Guide",
    excerpt: "How property taxes work in Florida — millage rates, exemptions, and how to appeal your assessment.",
    date: "2026-01-20",
    category: "Taxes",
    readingTime: "8 min read",
    sections: makeSections("Florida Property Tax Guide", [
      "How Florida Property Taxes Are Calculated",
      "Millage Rates by County",
      "Exemptions That Lower Your Bill",
      "How to Appeal Your Assessment",
    ]),
  },
  {
    slug: "florida-property-survey-guide",
    title: "Florida Property Survey Guide",
    excerpt: "When and why you need a property survey in Florida — types, costs, and what they reveal.",
    date: "2026-02-15",
    category: "Buying",
    readingTime: "6 min read",
    sections: makeSections("Florida Property Survey Guide", [
      "What Is a Property Survey?",
      "Types of Surveys in Florida",
      "When You Need a Survey",
      "Survey Costs and Timeline",
    ]),
  },
  {
    slug: "title-insurance-guide",
    title: "Title Insurance Guide",
    excerpt: "Title insurance in Florida — what it covers, who pays, and why it matters for buyers and sellers.",
    date: "2026-02-28",
    category: "Buying",
    readingTime: "6 min read",
    sections: makeSections("Title Insurance Guide", [
      "What Is Title Insurance?",
      "Owner's vs. Lender's Policy",
      "Who Pays for Title Insurance in Florida?",
      "Common Title Issues",
    ]),
  },
  {
    slug: "home-warranty-guide",
    title: "Home Warranty Guide",
    excerpt: "Home warranty guide for buyers and sellers — coverage, costs, and whether it's worth it.",
    date: "2026-02-25",
    category: "Buying",
    readingTime: "6 min read",
    sections: makeSections("Home Warranty Guide", [
      "What Does a Home Warranty Cover?",
      "Home Warranty vs. Homeowners Insurance",
      "Is a Home Warranty Worth It?",
      "Best Home Warranty Companies in Florida",
    ]),
  },
  {
    slug: "hurricane-prep-guide",
    title: "Hurricane Preparedness Guide",
    excerpt: "How to prepare your Florida home for hurricane season — supplies, shutters, insurance, and evacuation plans.",
    date: "2026-02-01",
    category: "Homeownership",
    readingTime: "8 min read",
    sections: makeSections("Hurricane Prep Guide", [
      "Hurricane Season in Florida",
      "Protecting Your Home",
      "Emergency Supplies Checklist",
      "Evacuation Routes and Plans",
      "Insurance Coverage Review",
    ]),
  },
  {
    slug: "swimming-pool-value-guide",
    title: "Swimming Pool Value Guide",
    excerpt: "Does a pool add value to your Florida home? Analysis of pool ROI, maintenance costs, and buyer preferences.",
    date: "2026-02-10",
    category: "Homeownership",
    readingTime: "6 min read",
    sections: makeSections("Swimming Pool Value Guide", [
      "Do Pools Add Value in Florida?",
      "Pool ROI by Home Price Range",
      "Maintenance Costs to Consider",
      "Pool Types and Buyer Preferences",
    ]),
  },

  // =========================================================================
  // INVESTMENT GUIDES
  // =========================================================================
  {
    slug: "1031-exchange-guide",
    title: "1031 Exchange Guide",
    excerpt: "How 1031 exchanges work — rules, timelines, qualified intermediaries, and strategies for real estate investors.",
    date: "2026-02-15",
    category: "Investing",
    readingTime: "9 min read",
    sections: makeSections("1031 Exchange Guide", [
      "What Is a 1031 Exchange?",
      "Rules and Requirements",
      "Timeline: 45-Day and 180-Day Windows",
      "Choosing a Qualified Intermediary",
      "Common 1031 Exchange Strategies",
    ]),
  },
  {
    slug: "real-estate-investment-guide",
    title: "Real Estate Investment Guide",
    excerpt: "Complete guide to real estate investing in Tampa Bay — rental properties, flips, and long-term wealth building.",
    date: "2026-02-15",
    category: "Investing",
    readingTime: "12 min read",
    sections: makeSections("Real Estate Investment Guide", [
      "Why Invest in Tampa Bay Real Estate?",
      "Rental Properties vs. Fix-and-Flip",
      "Analyzing Investment Properties",
      "Financing Options for Investors",
      "Property Management Considerations",
    ]),
  },
  {
    slug: "house-hacking-guide",
    title: "House Hacking Guide",
    excerpt: "How to house hack in Tampa Bay — live in one unit, rent the others, and build wealth.",
    date: "2026-02-10",
    category: "Investing",
    readingTime: "7 min read",
    sections: makeSections("House Hacking Guide", [
      "What Is House Hacking?",
      "Best Properties for House Hacking",
      "Financing a House Hack",
      "House Hacking in Tampa Bay",
    ]),
  },
  {
    slug: "short-term-rental-guide",
    title: "Short-Term Rental Guide",
    excerpt: "Short-term rental investing — Airbnb regulations, ROI analysis, and best areas in Tampa Bay.",
    date: "2026-02-05",
    category: "Investing",
    readingTime: "8 min read",
    sections: makeSections("Short-Term Rental Guide", [
      "Short-Term Rental Regulations in Florida",
      "ROI Analysis for Airbnb Properties",
      "Best Areas for Short-Term Rentals",
      "Managing Your Rental Property",
    ]),
  },
  {
    slug: "short-term-rental-guide-tampa-bay",
    title: "Short-Term Rental Guide: Tampa Bay",
    excerpt: "Tampa Bay-specific guide to short-term rental investing — local regulations, top areas, and earning potential.",
    date: "2026-02-05",
    category: "Investing",
    readingTime: "9 min read",
    sections: makeSections("Short-Term Rental Guide Tampa Bay", [
      "Tampa Bay STR Regulations by County",
      "Top Areas for Vacation Rentals",
      "Earning Potential and Occupancy Rates",
      "Getting Started with Your First STR",
    ]),
  },
  {
    slug: "vacation-rental-guide",
    title: "Vacation Rental Guide",
    excerpt: "Buying a vacation rental in Florida — location, financing, management, and tax implications.",
    date: "2026-01-25",
    category: "Investing",
    readingTime: "8 min read",
    sections: makeSections("Vacation Rental Guide", [
      "Choosing the Right Location",
      "Financing a Vacation Rental",
      "Property Management Options",
      "Tax Implications of Vacation Rentals",
    ]),
  },
];

/** Look up a guide by slug */
export function getGuideBySlug(slug: string): GuideData | undefined {
  return guides.find((g) => g.slug === slug);
}

/** Get all guide slugs for static params */
export function getAllGuideSlugs(): string[] {
  return guides.map((g) => g.slug);
}

/** Get guides by category */
export function getGuidesByCategory(category: string): GuideData[] {
  return guides.filter((g) => g.category === category);
}

/** Get related guides (same category, excluding the given slug) */
export function getRelatedGuides(slug: string, limit = 3): GuideData[] {
  const current = getGuideBySlug(slug);
  if (!current) return guides.slice(0, limit);
  return guides
    .filter((g) => g.category === current.category && g.slug !== slug)
    .slice(0, limit);
}
