// =============================================================================
// /the-now-team — The NOW Team at REMAX Collective
// Barrett Henry's real estate team since 2015. Full content page with hero,
// philosophy, services, coverage, credentials, differentiators, and FAQ.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import { getPrimaryAgent } from "@/data/agents";

// --- SEO metadata + Open Graph ---
export const metadata: Metadata = {
  title: "The NOW Team | Tampa Bay Real Estate | REMAX Collective",
  description:
    "The NOW Team is Barrett Henry's real estate team at REMAX Collective. Buying, selling, investing, and property management across 8 Tampa Bay counties. Call (813) 733-7907.",
  alternates: {
    canonical: "/the-now-team/",
  },
  openGraph: {
    title: "The NOW Team | Tampa Bay Real Estate | REMAX Collective",
    description:
      "Barrett Henry's real estate team at REMAX Collective serving Tampa Bay since 2015. 23+ years of real estate experience.",
    type: "website",
  },
};

// --- BreadcrumbList JSON-LD ---
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
    { "@type": "ListItem", position: 2, name: "The NOW Team", item: "https://nowtb.com/the-now-team" },
  ],
};

// --- FAQPage JSON-LD ---
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is The NOW Team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The NOW Team is Barrett Henry's real estate team at REMAX Collective, serving Tampa Bay since 2015. The team handles residential buying, selling, investing, new construction, military relocation, and property management across 8 Florida counties.",
      },
    },
    {
      "@type": "Question",
      name: "What areas does The NOW Team serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The NOW Team serves 8 counties in the Tampa Bay region: Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota, Hernando, and Citrus counties in Florida.",
      },
    },
    {
      "@type": "Question",
      name: "What designations does Barrett Henry hold?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Barrett Henry is a licensed Florida Broker Associate and holds three professional designations: e-PRO (digital marketing), MRP (Military Relocation Professional), and SRS (Seller Representative Specialist). He was also inducted into the REMAX Hall of Fame in 2024.",
      },
    },
    {
      "@type": "Question",
      name: "How do I contact The NOW Team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Call (813) 733-7907, email barrett@nowtb.com, or use the contact form at nowtb.com/contact. Barrett responds within 2 hours during business hours.",
      },
    },
  ],
};

// --- Services offered by The NOW Team ---
const services = [
  {
    title: "Buying",
    description:
      "From first-time buyers to seasoned investors, we guide every purchase with market data, honest advice, and aggressive negotiation.",
  },
  {
    title: "Selling",
    description:
      "Strategic pricing, professional marketing, and relentless follow-up to get your home sold at the best possible price.",
  },
  {
    title: "Investing",
    description:
      "Cash flow analysis, cap rate evaluation, and portfolio strategy for single-family, multi-family, and commercial investment properties.",
  },
  {
    title: "New Construction",
    description:
      "Buyer representation with builders across Tampa Bay. We negotiate upgrades, review contracts, and protect your interests from lot selection to closing.",
  },
  {
    title: "Military Relocation",
    description:
      "Barrett holds the MRP designation. We work with active-duty, veterans, and military families relocating to or from Tampa Bay.",
  },
  {
    title: "Property Management",
    description:
      "Through ViVi PM, we handle tenant screening, rent collection, maintenance, and monthly accounting for rental property owners.",
  },
];

// --- Counties served ---
const counties = [
  "Hillsborough",
  "Pinellas",
  "Pasco",
  "Polk",
  "Manatee",
  "Sarasota",
  "Hernando",
  "Citrus",
];

export default function TheNowTeamPage() {
  // Pull Barrett's data from the agents data file
  const agent = getPrimaryAgent();

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* ---- Hero Section ---- */}
      <HeroSection
        title="The NOW Team"
        subtitle="Barrett Henry's real estate team at REMAX Collective, serving Tampa Bay since 2015."
        label="BARRETT HENRY | REMAX COLLECTIVE"
      >
        {/* CTA in hero */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:8137337907"
            className="btn-primary inline-block"
          >
            Call (813) 733-7907
          </a>
          <Link href="/contact" className="btn-secondary inline-block">
            Contact Us
          </Link>
        </div>
      </HeroSection>

      {/* ---- What is The NOW Team ---- */}
      <section className="section-white">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Est. 2015</p>
            <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-primary">
              What Is The NOW Team?
            </h2>
            <div className="section-divider" />
          </div>
          <div className="font-body text-muted font-light space-y-6 text-base md:text-lg leading-relaxed">
            <p>
              The NOW Team is Barrett Henry&apos;s real estate team at REMAX
              Collective, formed in 2015. Led by Barrett — a licensed Broker
              Associate with 23+ years of real estate experience — the team
              serves buyers, sellers, and investors across 8 counties in the
              Tampa Bay region.
            </p>
            <p>
              Barrett&apos;s personal brand drives every client interaction.
              When you work with The NOW Team, you work directly with Barrett.
              There is no handoff to a junior agent, no call center, and no
              runaround. You get an experienced Broker Associate who answers
              the phone, writes the contracts, and negotiates the deal.
            </p>
            <p>
              The name says it all: NOW. In real estate, timing matters. The
              NOW Team operates with urgency because the best deals do not
              wait, and neither should you.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Team Philosophy — dark navy section ---- */}
      <section className="section-dark">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <p className="heading-label text-white/50 mb-6">Our Approach</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white">
            How We Work
          </h2>
          <div className="section-divider" />
          <div className="font-body text-white/70 font-light space-y-6 text-base md:text-lg leading-relaxed text-left md:text-center">
            <p>
              The NOW Team runs on four principles: honesty, data, speed, and
              results. Every recommendation we make is backed by current market
              data — not guesswork, not wishful thinking, and not what you want
              to hear. We tell you the truth, even when it is uncomfortable,
              because that is what gets you the best outcome.
            </p>
            <p>
              We are not a volume team that churns through clients. We are a
              lean operation built around Barrett&apos;s hands-on, no-nonsense
              style. That means fewer clients at a time, more attention per
              transaction, and better results across the board.
            </p>
            <p>
              Client-first is not a slogan here. It is the business model.
              Barrett&apos;s repeat and referral rate speaks for itself — when
              your agent actually delivers, you come back.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Services ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Full-Service Real Estate</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Does The NOW Team Do?
            </h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service) => (
              <div
                key={service.title}
                className="p-6 bg-white border border-gray-100 rounded-lg transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="font-heading font-bold text-lg text-primary mb-3">
                  {service.title}
                </h3>
                <p className="font-body text-muted font-light text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          {/* ViVi PM callout */}
          <div className="text-center mt-10">
            <p className="font-body text-muted font-light text-sm">
              Property management services are provided through{" "}
              <a
                href="https://vivipm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                ViVi PM
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ---- 8-County Coverage ---- */}
      <section className="section-white">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Service Area</p>
            <h2 className="heading-section text-display-sm text-primary">
              Where Does The NOW Team Serve?
            </h2>
            <div className="section-divider" />
          </div>
          <p className="font-body text-muted font-light text-base md:text-lg leading-relaxed text-center mb-12">
            The NOW Team covers 8 counties across the Tampa Bay region. Whether
            you are buying a waterfront home in Pinellas, a new build in Pasco,
            or an investment property in Polk, Barrett and the team have the
            local market knowledge to get it done.
          </p>
          {/* County grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {counties.map((county) => (
              <div
                key={county}
                className="p-4 bg-gray-50 border border-gray-100 rounded-lg text-center"
              >
                <p className="font-heading font-semibold text-primary text-sm tracking-wide uppercase">
                  {county}
                </p>
                <p className="font-body text-muted text-xs mt-1">County, FL</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Barrett's Credentials — dark section ---- */}
      <section className="section-dark">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <p className="heading-label text-white/50 mb-6">Team Lead</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white">
            Barrett Henry
          </h2>
          <div className="section-divider" />
          <p className="font-body text-white/70 font-light text-base md:text-lg leading-relaxed mb-12">
            Barrett Henry is a licensed Florida Broker Associate and the driving
            force behind The NOW Team. With 23+ years of real estate experience,
            Barrett holds three professional designations and was inducted into the
            REMAX Hall of Fame in 2024.
          </p>

          {/* Credentials grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Broker Associate", detail: "Florida Licensed" },
              { label: "e-PRO", detail: "Digital Marketing" },
              { label: "MRP", detail: "Military Relocation" },
              { label: "SRS", detail: "Seller Representative" },
            ].map((cred) => (
              <div key={cred.label} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="font-heading font-semibold text-white text-sm">
                  {cred.label}
                </p>
                <p className="font-body text-white/50 text-xs mt-1">
                  {cred.detail}
                </p>
              </div>
            ))}
          </div>

          {/* REMAX Hall of Fame callout */}
          <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-lg inline-block">
            <p className="font-heading font-semibold text-white text-sm tracking-wide uppercase">
              REMAX Hall of Fame 2024
            </p>
            <p className="font-body text-white/50 text-xs mt-1">
              Lifetime achievement recognition for career sales production
            </p>
          </div>

          {/* Link to full about page */}
          <div className="mt-10">
            <Link href="/about" className="btn-secondary inline-block">
              Read Barrett&apos;s Full Bio
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Why Choose The NOW Team ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">The Difference</p>
            <h2 className="heading-section text-display-sm text-primary">
              Why Choose The NOW Team Over Other Teams?
            </h2>
            <div className="section-divider" />
          </div>
          <div className="font-body text-muted font-light space-y-6 text-base md:text-lg leading-relaxed">
            <p>
              Most real estate teams are built around volume — sign as many
              clients as possible, hand them off to the newest agent, and hope
              for the best. The NOW Team is the opposite. Barrett personally
              handles every transaction because his name and reputation are on
              the line every single time.
            </p>
            <p>
              You also get the full weight of the REMAX network behind you.
              That means global listing exposure across 110+ countries,
              industry-leading technology, and the brand recognition that
              attracts serious buyers. But unlike a massive team where you are
              just a number, The NOW Team keeps it personal.
            </p>
            <p>
              Barrett&apos;s approach is data-driven and transparent. He shows
              you the comparable sales, explains the market conditions, and
              gives you a realistic game plan — not inflated promises designed
              to win your listing. That honesty is why clients come back and
              refer their friends, family, and coworkers.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto text-center">
            <div>
              <p className="stat-number text-primary">23+</p>
              <p className="heading-label mt-4">Years Experience</p>
            </div>
            <div>
              <p className="stat-number text-primary">8</p>
              <p className="heading-label mt-4">Counties Served</p>
            </div>
            <div>
              <p className="stat-number text-primary">2015</p>
              <p className="heading-label mt-4">Team Founded</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Beyond Buying & Selling — cross-site links ---- */}
      <section className="section-white">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Barrett&apos;s Network</p>
            <h2 className="heading-section text-display-sm text-primary">
              Beyond Buying &amp; Selling
            </h2>
            <div className="section-divider" />
          </div>
          <div className="font-body text-muted font-light space-y-6 text-base md:text-lg leading-relaxed">
            <p>
              Barrett&apos;s services extend well beyond traditional real estate
              transactions. For investors and landlords who need professional
              property management,{" "}
              <a
                href="https://vivipm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                ViVi PM
              </a>{" "}
              handles tenant screening, rent collection, maintenance
              coordination, and monthly financial reporting across Tampa Bay.
            </p>
            <p>
              Barrett also publishes in-depth commercial real estate analysis at{" "}
              <a
                href="https://hencre.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                hencre.com
              </a>
              , covering commercial real estate trends, investment strategy, cap rate analysis, and
              market data for the Tampa Bay region and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* ---- FAQ Section ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Common Questions</p>
            <h2 className="heading-section text-display-sm text-primary">
              Frequently Asked Questions
            </h2>
            <div className="section-divider" />
          </div>
          <div className="space-y-8">
            {/* FAQ 1 */}
            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                What is The NOW Team?
              </h3>
              <p className="font-body text-muted font-light text-base leading-relaxed">
                The NOW Team is Barrett Henry&apos;s real estate team at REMAX
                Collective, serving Tampa Bay since 2015. The team handles
                residential buying, selling, investing, new construction,
                military relocation, and property management across 8 Florida
                counties. Barrett personally leads every transaction.
              </p>
            </div>

            {/* FAQ 2 */}
            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                What areas does The NOW Team serve?
              </h3>
              <p className="font-body text-muted font-light text-base leading-relaxed">
                The NOW Team serves 8 counties in the Tampa Bay region:
                Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota,
                Hernando, and Citrus counties. That includes cities like Tampa,
                St. Petersburg, Clearwater, Brandon, Riverview, Valrico,
                Lakeland, Bradenton, and Sarasota.
              </p>
            </div>

            {/* FAQ 3 */}
            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                What designations does Barrett Henry hold?
              </h3>
              <p className="font-body text-muted font-light text-base leading-relaxed">
                Barrett Henry is a licensed Florida Broker Associate and holds
                three professional designations: e-PRO (digital marketing
                expertise), MRP (Military Relocation Professional), and SRS
                (Seller Representative Specialist). He was inducted into the
                REMAX Hall of Fame in 2024 for career sales production.
              </p>
            </div>

            {/* FAQ 4 */}
            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                How do I contact The NOW Team?
              </h3>
              <p className="font-body text-muted font-light text-base leading-relaxed">
                Call{" "}
                <a href="tel:8137337907" className="text-accent hover:underline">
                  (813) 733-7907
                </a>
                , email{" "}
                <a
                  href="mailto:barrett@nowtb.com"
                  className="text-accent hover:underline"
                >
                  barrett@nowtb.com
                </a>
                , or use the{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  contact form
                </Link>
                . Barrett responds within 2 hours during business hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Contact CTA ---- */}
      <section className="section-white">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="the-now-team"
            title="Talk to The NOW Team"
            submitLabel="Send Message"
          />
        </div>
      </section>
    </>
  );
}
