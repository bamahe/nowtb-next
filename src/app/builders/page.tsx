// =============================================================================
// /builders — Tampa Bay New Construction & Home Builders
// Full content page: hero, builder directory, buyer representation,
// new construction process, common mistakes, FAQ
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

// --- SEO metadata + Open Graph ---
export const metadata: Metadata = {
  title: "Tampa Bay Home Builders | New Construction | Barrett Henry",
  description:
    "Top home builders in Tampa Bay — Lennar, DR Horton, Pulte, Taylor Morrison, Toll Brothers, and more. Free buyer representation from a Broker with 23+ years of experience. Call (813) 733-7907.",
  alternates: {
    canonical: "/builders/",
  },
  openGraph: {
    title: "Tampa Bay Home Builders & New Construction | Barrett Henry",
    description:
      "Browse new construction communities from Tampa Bay's top builders. Barrett Henry provides free buyer representation so the builder's agent never negotiates against you alone.",
    type: "website",
  },
};

// --- Major builders active in Tampa Bay ---
const builders = [
  {
    name: "Lennar",
    slug: "lennar-homes-tampa-bay",
    tagline: "Everything's Included",
    desc: "One of the largest builders in the country, Lennar is known for its Everything's Included program — smart home tech, premium appliances, and designer finishes come standard. Active across Hillsborough, Pasco, and Polk counties with communities ranging from first-time buyer townhomes to estate-sized single-family homes.",
  },
  {
    name: "DR Horton",
    slug: "dr-horton-homes-tampa-bay",
    tagline: "America's Builder",
    desc: "The nation's largest homebuilder by volume, DR Horton delivers affordable new construction without cutting corners. Their Express and Freedom series target first-time buyers and active adults, while the Emerald line offers upgraded finishes and larger floor plans.",
  },
  {
    name: "Pulte Homes",
    slug: "pulte-homes-tampa-bay",
    tagline: "Life Tested",
    desc: "Pulte's Life Tested floor plans are designed around how people actually live — dedicated home offices, open kitchens, and flexible bonus rooms. Their Del Webb brand is one of the most recognized names in 55+ active adult communities.",
  },
  {
    name: "Taylor Morrison",
    slug: "taylor-morrison-homes-tampa-bay",
    tagline: "Inspired Living",
    desc: "A top-five national builder headquartered right here in Arizona with deep Florida roots. Taylor Morrison is known for premium standard features, energy efficiency, and communities in desirable school zones across Tampa Bay.",
  },
  {
    name: "Toll Brothers",
    slug: "toll-brothers-homes-tampa-bay",
    tagline: "Luxury Living",
    desc: "The name in luxury new construction. Toll Brothers builds in Tampa Bay's most sought-after locations with high-end finishes, expansive design center options, and resort-style community amenities. Expect larger lots and higher price points.",
  },
  {
    name: "MI Homes",
    slug: "mi-homes-tampa-bay",
    tagline: "Quality Craftsmanship",
    desc: "MI Homes delivers flexible floor plans with a strong reputation for build quality and customer satisfaction. Their Tampa Bay communities offer a range of price points with generous included features and responsive warranty service.",
  },
  {
    name: "Ryan Homes",
    slug: "ryan-homes-tampa-bay",
    tagline: "Build Your Happy",
    desc: "Part of NVR Inc., Ryan Homes focuses on affordable new construction with a streamlined building process. Strong in the first-time buyer market with competitive pricing and quick move-in inventory homes.",
  },
  {
    name: "Meritage Homes",
    slug: "meritage-homes-tampa-bay",
    tagline: "Energy-Efficient Living",
    desc: "Meritage builds every home to ENERGY STAR standards with advanced insulation, HVAC, and solar-ready design. Their focus on energy efficiency translates to lower utility bills from day one — a real selling point in Florida's heat.",
  },
];

// --- New construction process steps ---
const processSteps = [
  {
    step: 1,
    title: "Choose Your Community and Lot",
    desc: "Location drives value. We tour communities together, compare HOA fees, CDD assessments, school zones, and future development plans. Lot selection matters — premiums for water views, conservation backing, or corner lots can add $10K to $80K or more.",
  },
  {
    step: 2,
    title: "Select Your Floor Plan",
    desc: "Builders offer multiple floor plans in each community. I help you compare square footage, bedroom configurations, garage size, and structural options like bonus rooms or extended lanais that affect both livability and resale value.",
  },
  {
    step: 3,
    title: "Design Center Selections",
    desc: "This is where budgets can spiral. Cabinets, countertops, flooring, fixtures, and exterior finishes all get chosen here. I advise on which upgrades add real resale value and which are overpriced at the builder's design center.",
  },
  {
    step: 4,
    title: "Contract and Negotiation",
    desc: "Builder contracts are written by the builder's attorneys to protect the builder. I review every clause, negotiate pricing, request closing cost credits, and push for upgrades or incentives that the sales agent won't volunteer.",
  },
  {
    step: 5,
    title: "Construction and Inspections",
    desc: "New construction typically takes 5 to 9 months depending on the builder and community. I recommend independent inspections at pre-drywall and final stages — the builder's inspector works for them, not you.",
  },
  {
    step: 6,
    title: "Final Walkthrough and Closing",
    desc: "We do a detailed walkthrough to document any punch list items before you sign. Paint touch-ups, cabinet alignment, grout issues, appliance function — everything gets checked and documented before closing day.",
  },
];

// --- Common mistakes buyers make ---
const mistakes = [
  {
    title: "Going to the Model Home Without Your Own Agent",
    desc: "The moment you register at the sales office without your REALTOR present, the builder's agent becomes your only representative. Most builders require your agent to accompany you on the first visit to honor buyer representation.",
  },
  {
    title: "Trusting the Builder's Preferred Lender Blindly",
    desc: "Builders offer incentives — closing cost credits, rate buydowns — for using their preferred lender. Sometimes the deal is real. Other times an outside lender beats them outright. Always get a competing quote before committing.",
  },
  {
    title: "Overspending at the Design Center",
    desc: "Builders mark up design center options significantly. That $15,000 kitchen upgrade might cost $6,000 through a contractor after closing. I help you decide which upgrades are worth the builder's price and which can wait.",
  },
  {
    title: "Skipping Independent Inspections",
    desc: "New does not mean flawless. Framing errors, plumbing issues, HVAC problems, and code violations happen in new construction. A pre-drywall inspection catches structural issues before the walls go up. A final inspection catches everything else.",
  },
  {
    title: "Ignoring CDD and HOA Costs",
    desc: "Community Development District assessments add hundreds to your monthly payment and can last 15 to 30 years. Combined with HOA fees, your true monthly cost can be significantly higher than the mortgage alone. I break down every cost before you sign.",
  },
];

// --- FAQ schema data ---
const faqs = [
  {
    q: "Do I need a REALTOR to buy new construction in Tampa Bay?",
    a: "You are not legally required to have a REALTOR, but going without one means the only agent in the transaction works for the builder. The builder pays the buyer agent's commission, so having Barrett Henry represent you costs nothing extra. You get contract review, negotiation leverage, and an advocate who works for you — not the builder.",
  },
  {
    q: "How much does it cost to have Barrett Henry represent me with a builder?",
    a: "Nothing. The builder pays the buyer agent's commission as part of their marketing budget. You receive full representation — contract negotiation, inspection coordination, design center guidance, and closing support — at no cost to you.",
  },
  {
    q: "What is a CDD and how does it affect my monthly payment?",
    a: "A Community Development District (CDD) is a special taxing district that finances infrastructure like roads, utilities, and amenities in new communities. CDD assessments are added to your property tax bill and typically range from $100 to $400 per month. They can last 15 to 30 years. Barrett reviews all CDD and HOA costs with you before you make an offer so there are no surprises.",
  },
  {
    q: "How long does it take to build a new construction home in Tampa Bay?",
    a: "Most production builders in Tampa Bay complete a home in 5 to 9 months from contract to closing. Factors that affect timeline include permit approvals, weather delays, material availability, and how many structural options you select. Quick move-in inventory homes (specs) can close in 30 to 60 days if they are already under construction or completed.",
  },
  {
    q: "Should I get a home inspection on new construction?",
    a: "Absolutely. New construction homes go through municipal code inspections, but code inspectors check for minimum compliance — not quality. An independent pre-drywall inspection catches framing, plumbing, and electrical issues before walls are sealed. A final inspection before closing documents cosmetic defects, appliance function, and punch list items. Barrett coordinates both inspections for every new construction client.",
  },
];

export default function BuildersPage() {
  return (
    <>
      {/* --- BreadcrumbList schema --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Tampa Bay Home Builders", item: "https://nowtb.com/builders" },
            ],
          }),
        }}
      />

      {/* --- FAQPage schema --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
              },
            })),
          }),
        }}
      />

      {/* ---- Hero Section ---- */}
      <HeroSection
        title="New Construction Homes"
        label="TAMPA BAY HOME BUILDERS"
        subtitle="Browse communities from the area's top builders — and get a Broker with 23+ years of experience representing you at no cost."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link href="/new-construction-homes-tampa-bay" className="btn-primary">
            Search New Construction
          </Link>
          <Link href="/contact" className="btn-secondary">
            Talk to Barrett
          </Link>
        </div>
      </HeroSection>

      {/* ---- Why You Need Your Own REALTOR ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Buyer Representation</p>
            <h2 className="heading-section text-display-sm text-primary">
              Why You Need Your Own REALTOR for New Construction
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-link">
              <p>
                Every new construction sales office has a friendly agent ready to help you.
                What most buyers do not realize is that agent works for the builder. Their
                job is to sell the builder's inventory at the builder's price on the
                builder's terms. They are not negotiating on your behalf — they are
                negotiating against you.
              </p>
              <p>
                Having your own REALTOR levels the playing field. Barrett Henry reviews
                builder contracts, negotiates pricing and incentives, coordinates independent
                inspections, and advises on design center selections — all at no cost to
                you. The builder pays the buyer agent's commission regardless, so the only
                question is whether that commission goes to someone working for you or gets
                kept by the builder's brokerage.
              </p>
              <p>
                With 23+ years of real estate experience and hundreds of new construction
                transactions, Barrett knows which builders deliver on their promises, which
                upgrades hold resale value, and which contract clauses need pushback. That
                knowledge costs you nothing and can save you tens of thousands of dollars.
              </p>
            </div>

            {/* Three key stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { stat: "$0", label: "Cost to You", note: "Builder pays the commission" },
                { stat: "23+", label: "Years Experience", note: "Hundreds of new builds closed" },
                { stat: "100%", label: "Your Advocate", note: "Not the builder's agent" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-8 h-[1px] bg-accent mx-auto mb-6" />
                  <span className="font-heading text-4xl font-extralight text-accent block mb-2">
                    {item.stat}
                  </span>
                  <p className="font-heading text-sm uppercase tracking-wider text-primary mb-1">
                    {item.label}
                  </p>
                  <p className="font-body text-xs text-muted">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Major Builders in Tampa Bay ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Builder Directory</p>
            <h2 className="heading-section text-display-sm text-primary">
              Major Home Builders in Tampa Bay
            </h2>
            <div className="section-divider" />
            <p className="font-body text-muted font-light max-w-2xl mx-auto">
              These national and regional builders are actively developing communities
              across Hillsborough, Pasco, Pinellas, Polk, Manatee, Sarasota, and
              Hernando counties. Barrett Henry can represent you with any of them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {builders.map((builder) => (
              <Link
                key={builder.slug}
                href={`/${builder.slug}`}
                className="group card p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <h3 className="font-heading font-bold text-xl text-primary group-hover:text-accent transition-colors">
                    {builder.name}
                  </h3>
                  <span className="font-body text-xs text-muted italic">
                    {builder.tagline}
                  </span>
                </div>
                <p className="font-body text-sm text-muted leading-relaxed">
                  {builder.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Active New Construction Areas ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Where to Build</p>
            <h2 className="heading-section text-display-sm text-primary">
              Active New Construction Communities by Area
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                area: "South Hillsborough",
                cities: ["Riverview", "Brandon", "Valrico", "Lithia", "Wimauma", "Balm"],
                note: "The highest concentration of new construction in Tampa Bay. Dozens of active communities from every major builder.",
                link: "/riverview",
              },
              {
                area: "Pasco County",
                cities: ["Wesley Chapel", "Land O'Lakes", "Zephyrhills", "San Antonio", "Dade City"],
                note: "Rapid growth corridor with large master-planned communities. Strong school ratings and lower price points than Hillsborough.",
                link: "/wesley-chapel",
              },
              {
                area: "East Hillsborough",
                cities: ["Plant City", "Dover", "Thonotosassa", "Seffner"],
                note: "Rural feel with larger lots and acreage options. Fewer HOA-governed communities and more custom build opportunities.",
                link: "/plant-city",
              },
              {
                area: "Polk County",
                cities: ["Lakeland", "Winter Haven", "Davenport", "Haines City", "Auburndale"],
                note: "The most affordable new construction near Tampa Bay. Popular with first-time buyers and investors. Easy I-4 commute.",
                link: "/lakeland",
              },
              {
                area: "Manatee & Sarasota",
                cities: ["Bradenton", "Parrish", "Sarasota", "Lakewood Ranch", "North Port"],
                note: "Premium communities with resort-style amenities. Lakewood Ranch is one of the top-selling master-planned communities in the nation.",
                link: "/bradenton",
              },
              {
                area: "North Tampa & Pinellas",
                cities: ["Tampa", "Lutz", "Odessa", "St. Petersburg", "Clearwater"],
                note: "Limited new construction due to established development. Infill and boutique communities command premium pricing.",
                link: "/tampa",
              },
            ].map((area) => (
              <Link
                key={area.area}
                href={area.link}
                className="group block"
              >
                <div className="w-8 h-[1px] bg-accent mb-6" />
                <h3 className="heading-section text-sm text-primary mb-2 group-hover:text-accent transition-colors">
                  {area.area}
                </h3>
                <p className="font-body text-xs text-muted mb-3">
                  {area.cities.join(" / ")}
                </p>
                <p className="font-body text-sm text-muted font-light leading-relaxed">
                  {area.note}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- The New Construction Process ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Step by Step</p>
            <h2 className="heading-section text-display-sm text-primary">
              How Does Buying New Construction Work?
            </h2>
            <div className="section-divider" />
          </div>

          {/* Steps grid — large step numbers beside content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {processSteps.map((s) => (
              <div key={s.step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <span className="font-heading text-5xl font-extralight text-accent/40 leading-none">
                    {String(s.step).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="heading-section text-sm text-primary mb-2">
                    {s.title}
                  </h3>
                  <p className="font-body text-sm text-muted font-light leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Common Mistakes Buyers Make ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Avoid These Pitfalls</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Are the Biggest Mistakes Buyers Make With Builders?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-3xl mx-auto space-y-10">
            {mistakes.map((m, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div>
                  <h3 className="heading-section text-sm text-primary mb-2">
                    {m.title}
                  </h3>
                  <p className="font-body text-sm text-muted font-light leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA — dark navy ---- */}
      <section className="section-dark">
        <div className="container-wide text-center">
          <p className="heading-label text-white/50 mb-6">New Construction</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white">
            Ready to Tour Builder Communities?
          </h2>
          <div className="section-divider" />
          <p className="font-body text-white/70 font-light text-base md:text-lg max-w-2xl mx-auto mb-10">
            Barrett Henry tours new construction communities across Tampa Bay every week.
            Call{" "}
            <a href="tel:+18137337907" className="text-link hover:underline">
              (813) 733-7907
            </a>{" "}
            to schedule a builder tour or browse{" "}
            <Link href="/new-construction-homes-tampa-bay" className="text-link hover:underline">
              active new construction listings
            </Link>{" "}
            right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/new-construction-homes-tampa-bay" className="btn-primary">
              Search New Construction
            </Link>
            <Link href="/contact" className="btn-secondary">
              Schedule a Builder Tour
            </Link>
          </div>
        </div>
      </section>

      {/* ---- FAQ Section ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Common Questions</p>
            <h2 className="heading-section text-display-sm text-primary">
              New Construction FAQ
            </h2>
            <div className="section-divider" />
          </div>

          <div className="space-y-10">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="heading-section text-sm text-primary mb-3">
                  {faq.q}
                </h3>
                <p className="font-body text-sm text-muted font-light leading-relaxed">
                  {faq.a}
                </p>
                {i < faqs.length - 1 && (
                  <div className="w-12 h-[1px] bg-accent/30 mt-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Contact Form ---- */}
      <section className="section-white">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="builders"
            title="Get New Construction Help"
            submitLabel="Connect With Barrett"
          />
        </div>
      </section>
    </>
  );
}
