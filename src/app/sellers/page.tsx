// =============================================================================
// /sellers — Seller Landing Page
// Luxury minimalist: alternating sections, light-weight headings,
// accent dividers, large stat numbers, generous whitespace
// Content covers: selling strategy, marketing plan, pricing, staging,
// Florida disclosure requirements, listing-to-closing timeline
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Sell Your Tampa Bay Home for Top Dollar | Barrett Henry",
  description:
    "Barrett Henry's proven selling strategy gets Tampa Bay homes sold faster and for more money. Pricing analysis, professional marketing, and negotiation. Call (813) 733-7907.",
  alternates: {
    canonical: "/sellers/",
  },
  openGraph: {
    title: "Sell Your Tampa Bay Home for Top Dollar | Barrett Henry, REALTOR®",
    description:
      "Barrett Henry's proven selling strategy gets Tampa Bay homes sold faster and for more money.",
    type: "website",
  },
};

// --- Selling strategy pillars with step numbers ---
const pillars = [
  {
    step: 1,
    title: "Honest Pricing",
    description:
      "I pull the comps, run the numbers, and give you a price that's based on data — not ego. Overpricing kills deals. I won't let that happen to you.",
  },
  {
    step: 2,
    title: "The NOW Team Marketing Plan",
    description:
      "HDR photography, 3D tours, targeted social ads, MLS syndication, and print materials. My team and I make sure every serious buyer in the market sees your home.",
  },
  {
    step: 3,
    title: "Relentless Negotiation",
    description:
      "23+ years of deal-making means I know how to get you more at the closing table. Better terms, stronger counter-offers, and more net proceeds — that's the whole point.",
  },
  {
    step: 4,
    title: "Closing Without the Drama",
    description:
      "From accepted offer through closing day, The NOW Team coordinates inspections, appraisals, title work, and repairs. I keep things on track so you don't have to stress.",
  },
];

// --- Listing-to-closing timeline steps ---
const timelineSteps = [
  {
    phase: "Week 1-2",
    title: "Pre-Listing Prep",
    detail:
      "We meet at your home, walk the property together, and agree on price. I schedule photography, order the sign, and build your listing in Stellar MLS.",
  },
  {
    phase: "Week 2-3",
    title: "Go Live",
    detail:
      "Your listing hits MLS, Zillow, Realtor.com, Redfin, and social media. Showings begin. I host open houses and gather buyer feedback after every visit.",
  },
  {
    phase: "Week 3-5",
    title: "Offers & Negotiation",
    detail:
      "I review every offer with you, counter where needed, and negotiate the best price and terms. We go under contract with a signed purchase agreement.",
  },
  {
    phase: "Week 5-8",
    title: "Under Contract",
    detail:
      "Inspections, appraisal, title search, and lender processing all happen during this phase. The NOW Team coordinates every moving part so nothing falls through the cracks.",
  },
  {
    phase: "Week 8-10",
    title: "Closing Day",
    detail:
      "Final walkthrough, sign the docs, and hand over the keys. I walk you through the settlement statement line by line so there are no surprises at the closing table.",
  },
];

// --- Florida seller disclosure items ---
const disclosureItems = [
  "Known defects in the roof, foundation, plumbing, or electrical systems",
  "History of water intrusion, flooding, or mold remediation",
  "Sinkhole activity or prior sinkhole claims on the property",
  "HOA or CDD fees, rules, and any pending special assessments",
  "Previous insurance claims including wind and flood damage",
  "Lead-based paint disclosure (required for homes built before 1978)",
  "Environmental hazards such as radon, asbestos, or contaminated soil",
  "Any ongoing litigation or code enforcement violations",
];

export default function SellersPage() {
  return (
    <>
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Sell Your Home", item: "https://nowtb.com/sellers" },
            ],
          }),
        }}
      />

      {/* FAQPage schema — matches the question-format H2s on this page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What does it take to sell a home in Tampa Bay?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Selling a home successfully comes down to three things: accurate pricing, aggressive marketing, and a listing agent who actually negotiates. Barrett Henry brings 23+ years of real estate experience and a full-service approach — professional photography, MLS syndication, digital advertising, and hands-on guidance from first meeting through closing day.",
                },
              },
              {
                "@type": "Question",
                name: "How should you price your home?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Pricing is the single most important decision you will make as a seller. Barrett runs a detailed comparative market analysis (CMA) that looks at recent closed sales, active competition, pending contracts, and expired listings in your neighborhood, factoring in condition, upgrades, lot size, and location to arrive at a data-backed price.",
                },
              },
              {
                "@type": "Question",
                name: "How do I market your home?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Every listing gets professional HDR photography, drone aerials, 3D virtual tours, Stellar MLS syndication to Zillow, Realtor.com, Redfin, and Homes.com, targeted Facebook and Instagram ads, social channel promotion, and strategic open houses designed to drive multiple offers.",
                },
              },
              {
                "@type": "Question",
                name: "How should you prepare your home for showings?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Key steps include decluttering every room, deep cleaning kitchens and bathrooms, neutralizing bold paint colors, boosting curb appeal with fresh mulch and trimmed hedges, replacing burned-out bulbs, removing personal photos, staging the owners suite with clean neutral bedding, and addressing small repairs like leaky faucets and cracked switch plates.",
                },
              },
              {
                "@type": "Question",
                name: "What do Florida sellers need to disclose?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Under Florida Statute 689.25, sellers must disclose any known material defects that affect property value and are not readily observable. Common items include roof/foundation/plumbing defects, water intrusion history, sinkhole activity, HOA/CDD fees, previous insurance claims, lead-based paint (pre-1978 homes), environmental hazards, and any ongoing litigation or code enforcement violations.",
                },
              },
              {
                "@type": "Question",
                name: "How long does it take to sell a home?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most Tampa Bay homes sell within 8 to 10 weeks from listing to closing. The timeline includes 1-2 weeks of pre-listing prep, going live in weeks 2-3, offers and negotiation in weeks 3-5, the under-contract phase in weeks 5-8, and closing day around weeks 8-10.",
                },
              },
            ],
          }),
        }}
      />

      {/* ---- Hero Section — full viewport ---- */}
      <HeroSection
        title="Sell Your Home"
        label="BARRETT HENRY | THE NOW TEAM"
        subtitle="I don't guess on price and I don't cut corners on marketing. 23+ years of getting sellers top dollar."
      />

      {/* ---- Selling Process Overview — white bg ---- */}
      <section className="section-white">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="heading-label mb-6">Overview</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Does It Take to Sell a Home in Tampa Bay?
            </h2>
            <div className="section-divider" />
          </div>
          <div className="font-body text-muted font-light text-base md:text-lg leading-relaxed space-y-5">
            <p>
              Selling a home is one of the biggest financial moves you will ever make. The
              difference between a good sale and a great one often comes down to three things:
              accurate pricing, aggressive marketing, and a listing agent who actually
              negotiates. That is exactly what I do.
            </p>
            <p>
              With 23+ years of real estate experience and a track record of selling homes
              across Hillsborough, Pinellas, Pasco, Polk, and Manatee counties, I bring a
              level of market knowledge that newer agents simply cannot match. Every listing
              gets the same full-service treatment — professional photography, MLS syndication,
              digital advertising, and hands-on guidance from our first meeting through closing
              day. No shortcuts, no bait-and-switch, and no handing you off to an assistant.
            </p>
            <p>
              Whether you are{" "}
              <Link href="/sell-your-home" className="text-link underline underline-offset-4 hover:text-accent/80">
                curious what your home is worth
              </Link>{" "}
              or ready to list this week, I am here to help you net the most money possible
              with the least amount of stress. Call me at{" "}
              <a href="tel:8137337907" className="text-link underline underline-offset-4 hover:text-accent/80">
                (813) 733-7907
              </a>{" "}
              and let&apos;s get started.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Barrett's Selling Strategy — light bg, numbered steps ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">The Strategy</p>
            <h2 className="heading-section text-display-sm text-primary">
              How I Sell Your Home
            </h2>
            <div className="section-divider" />
          </div>

          {/* 2-column grid with large step numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-4xl mx-auto">
            {pillars.map((p) => (
              <div key={p.title} className="flex gap-6">
                {/* Large step number — ultra-light weight */}
                <div className="flex-shrink-0">
                  <span className="font-heading text-5xl font-extralight text-accent/40 leading-none">
                    {String(p.step).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="heading-section text-sm text-primary mb-3">
                    {p.title}
                  </h3>
                  <p className="font-body text-sm text-muted font-light leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How Barrett Markets Your Home — white bg ---- */}
      <section className="section-white">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="heading-label mb-6">Marketing</p>
            <h2 className="heading-section text-display-sm text-primary">
              How Do I Market Your Home?
            </h2>
            <div className="section-divider" />
          </div>
          <div className="font-body text-muted font-light text-base md:text-lg leading-relaxed space-y-5">
            <p>
              Great marketing is not optional — it is the reason your home sells faster and
              for more money. Every listing I take gets a full marketing launch that includes
              professional HDR photography, drone aerials (where applicable), and 3D virtual
              tours so buyers can walk through your home from anywhere.
            </p>
            <p>
              Your home goes live on Stellar MLS and syndicates automatically to Zillow,
              Realtor.com, Redfin, Homes.com, and hundreds of partner sites. I also run
              targeted Facebook and Instagram ads focused on active buyers in your area,
              promote your listing across The NOW Team&apos;s social channels, and host
              strategic open houses designed to drive multiple offers.
            </p>
            <p>
              Print marketing still matters in certain neighborhoods. When it makes sense, I
              produce high-quality brochures, just-listed postcards, and neighborhood mailers.
              The goal is simple: put your home in front of every qualified buyer in the market
              so you never wonder if the right person missed it.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Pricing Strategy — light bg ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="heading-label mb-6">Pricing</p>
            <h2 className="heading-section text-display-sm text-primary">
              How Should You Price Your Home?
            </h2>
            <div className="section-divider" />
          </div>
          <div className="font-body text-muted font-light text-base md:text-lg leading-relaxed space-y-5">
            <p>
              Pricing is the single most important decision you will make as a seller.
              Overprice by even five percent and your home sits on the market, accumulates
              days, and buyers start wondering what is wrong with it. Underprice and you leave
              money on the table.
            </p>
            <p>
              I run a detailed comparative market analysis (CMA) that looks at recent closed
              sales, active competition, pending contracts, and expired listings in your
              neighborhood. I factor in your home&apos;s condition, upgrades, lot size, and
              location within the community. The result is a data-backed price that attracts
              qualified buyers and maximizes your net proceeds.
            </p>
            <p>
              I will always tell you the truth about your home&apos;s value — even when the
              number is not what you want to hear. That honesty is what gets homes sold.{" "}
              <Link href="/home-valuation" className="text-link underline underline-offset-4 hover:text-accent/80">
                Request a free home valuation
              </Link>{" "}
              and see where you stand.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Staging Tips — white bg ---- */}
      <section className="section-white">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="heading-label mb-6">Staging</p>
            <h2 className="heading-section text-display-sm text-primary">
              How Should You Prepare Your Home for Showings?
            </h2>
            <div className="section-divider" />
          </div>
          <div className="font-body text-muted font-light text-base md:text-lg leading-relaxed space-y-5">
            <p>
              You do not need to renovate your entire house to sell it. But a few
              intentional moves can add thousands to your final sale price. Here is what I
              tell every seller before we go live:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Declutter every room — less furniture makes spaces feel larger</li>
              <li>Deep clean kitchens and bathrooms (buyers notice grout and fixtures first)</li>
              <li>Neutralize bold paint colors if they dominate a room</li>
              <li>Boost curb appeal with fresh mulch, trimmed hedges, and a clean front door</li>
              <li>Replace burned-out bulbs and open all blinds for natural light</li>
              <li>Remove personal photos and religious items so buyers can picture themselves living there</li>
              <li>Stage the owners suite with clean, neutral bedding and minimal furniture</li>
              <li>Address small repairs — leaky faucets, loose handles, cracked switch plates</li>
            </ul>
            <p>
              I walk every listing before photos are taken and give you a room-by-room prep
              list. Some homes benefit from professional staging, and I have stagers I trust
              when the situation calls for it.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Florida Seller Disclosures — light bg ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="heading-label mb-6">Disclosures</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Do Florida Sellers Need to Disclose?
            </h2>
            <div className="section-divider" />
          </div>
          <div className="font-body text-muted font-light text-base md:text-lg leading-relaxed space-y-5">
            <p>
              Florida is a &quot;caveat emptor&quot; state, but that does not mean sellers can
              hide known problems. Under Florida Statute 689.25, sellers are required to
              disclose any known material defects that affect the value of the property and
              are not readily observable by the buyer. Failure to disclose can result in
              legal liability after closing.
            </p>
            <p>Here are the most common items Florida sellers must disclose:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              {disclosureItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              I walk through every disclosure form with my sellers and make sure nothing gets
              missed. Honest disclosure protects you legally and builds trust with buyers — both
              of which lead to smoother closings. If you have questions about what you need to
              disclose,{" "}
              <Link href="/contact" className="text-link underline underline-offset-4 hover:text-accent/80">
                reach out
              </Link>{" "}
              and I will walk you through it.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Listing-to-Closing Timeline — dark bg ---- */}
      <section className="section-dark">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="heading-label text-white/50 mb-6">Timeline</p>
            <h2 className="heading-section text-display-sm text-white">
              How Long Does It Take to Sell a Home?
            </h2>
            <div className="section-divider" />
          </div>

          <p className="font-body text-white/70 font-light text-base md:text-lg leading-relaxed text-center mb-12 max-w-2xl mx-auto">
            Most Tampa Bay homes sell within 8 to 10 weeks from listing to closing. Here is
            a realistic breakdown of what to expect at each phase.
          </p>

          {/* Timeline steps */}
          <div className="space-y-10 max-w-2xl mx-auto">
            {timelineSteps.map((s) => (
              <div key={s.phase} className="flex gap-6">
                <div className="flex-shrink-0 w-24">
                  <span className="font-heading text-sm font-light tracking-[0.15em] uppercase text-accent">
                    {s.phase}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-light tracking-[0.1em] uppercase text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="font-body text-sm text-white/60 font-light leading-relaxed">
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-12">
            <Link href="/guides/home-selling-guide" className="text-link underline underline-offset-4 hover:text-accent/80 font-body text-sm font-light">
              Read the full Home Selling Guide
            </Link>
          </p>
        </div>
      </section>

      {/* ---- Home Valuation CTA — light bg ---- */}
      <section className="section-light">
        <div className="container-wide text-center">
          <p className="heading-label mb-6">Free Valuation</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-primary">
            What Your Home Is Worth
          </h2>
          <div className="section-divider" />
          <p className="font-body text-muted font-light text-base md:text-lg max-w-2xl mx-auto mb-10">
            I&apos;ll run the numbers on your home — no obligation, no pressure.
            Find out what buyers are actually paying in your neighborhood right now.
          </p>
          <Link href="/sell-your-home" className="btn-primary">
            Get Your Home Value
          </Link>
        </div>
      </section>

      {/* ---- Market Stats — white bg, large stat numbers ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Market Data</p>
            <h2 className="heading-section text-display-sm text-primary">
              Tampa Bay Market Snapshot
            </h2>
            <div className="section-divider" />
          </div>

          {/* Stats in large ultra-light numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center max-w-3xl mx-auto">
            <div>
              <p className="stat-number text-primary">$415K</p>
              <p className="heading-label text-muted mt-4">Median Home Price</p>
            </div>
            <div>
              <p className="stat-number text-primary">28</p>
              <p className="heading-label text-muted mt-4">Avg. Days on Market</p>
            </div>
            <div>
              <p className="stat-number text-primary">97%</p>
              <p className="heading-label text-muted mt-4">List-to-Sale Ratio</p>
            </div>
          </div>

          <p className="text-center font-body text-muted/60 text-xs font-light mt-12 tracking-wide">
            Market data is approximate and updated periodically. Contact Barrett
            for the latest numbers in your area.
          </p>

          <p className="text-center mt-6">
            <Link href="/market-updates" className="text-link underline underline-offset-4 hover:text-accent/80 font-body text-sm font-light">
              View Latest Market Updates
            </Link>
          </p>
        </div>
      </section>

      {/* ---- Seller Lead Form — light bg ---- */}
      <section className="section-light">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="sellers-page"
            title="Ready to Find Out What Your Home Is Worth?"
            submitLabel="Let's Talk"
          />
        </div>
      </section>
    </>
  );
}
