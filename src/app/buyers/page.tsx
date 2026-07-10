// =============================================================================
// /buyers — Buyer Landing Page
// Luxury minimalist: alternating sections, light-weight headings,
// large step numbers, generous spacing, accent dividers
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Buy a Home in Tampa Bay | Buyer Guide | Barrett Henry",
  description:
    "Step-by-step guide to buying a home in Tampa Bay. Barrett Henry, Broker Associate with REMAX Collective, brings 23+ years of real estate experience. Call (813) 733-7907.",
  alternates: {
    canonical: "/buyers/",
  },
  openGraph: {
    title: "Buy a Home in Tampa Bay | Barrett Henry, REALTOR®",
    description:
      "Your step-by-step guide to buying a home in Tampa Bay with a Broker who has 23+ years of real estate experience.",
    type: "website",
  },
};

// --- Benefits data for "Why Work With Barrett" section ---
const benefits = [
  {
    title: "I Know This Market",
    description:
      "I work across all 8 Tampa Bay counties every day. You get real pricing data, honest neighborhood insights, and investment-grade analysis — not guesswork from a part-timer.",
  },
  {
    title: "I Fight for Your Deal",
    description:
      "23+ years of negotiation experience means I know how to write offers that win, terms that protect you, and strategies that keep more money in your pocket.",
  },
  {
    title: "The NOW Team Has Your Back",
    description:
      "From pre-approval to closing day, my team and I handle every detail — lender referrals, inspections, title coordination, and everything in between. You're never on your own.",
  },
];

// --- Buying process steps ---
const buyingSteps = [
  {
    step: 1,
    title: "Get Pre-Approved",
    description:
      "Connect with a lender to understand your budget. A pre-approval letter shows sellers you're a serious, qualified buyer. Not sure where to start? I have trusted lender referrals ready to go.",
  },
  {
    step: 2,
    title: "Define Your Criteria",
    description:
      "Bedrooms, neighborhoods, school districts, commute — I'll nail down exactly what you need so we're only looking at homes that actually fit your life.",
  },
  {
    step: 3,
    title: "Tour Homes",
    description:
      "See properties in person (or virtually). We'll tour as many homes as it takes to find the one that checks your boxes.",
  },
  {
    step: 4,
    title: "Make an Offer",
    description:
      "I'll analyze comparable sales, craft a competitive offer, and negotiate terms that protect your interests. This is where 23+ years of experience pays off.",
  },
  {
    step: 5,
    title: "Inspections & Appraisal",
    description:
      "Home inspection, appraisal, and any specialty inspections happen here. The NOW Team handles repair negotiations if anything comes up — you won't be left guessing.",
  },
  {
    step: 6,
    title: "Close & Get Keys",
    description:
      "Final walkthrough, sign the paperwork, and pick up the keys to your new home. Welcome to Tampa Bay!",
  },
];

// --- What buyers need to get started ---
const buyerChecklist = [
  {
    title: "Pre-Approval Letter",
    description:
      "A lender reviews your income, credit, and assets to determine how much home you can afford. This letter tells sellers you're financially qualified — without it, most sellers won't entertain your offer.",
  },
  {
    title: "A Buyer's Agent",
    description:
      "Your agent represents your interests exclusively. I negotiate on your behalf, identify red flags during showings, and handle the paperwork from contract to closing. In most transactions, the seller pays the buyer's agent commission — so my representation typically costs you nothing out of pocket.",
  },
  {
    title: "Down Payment & Closing Costs",
    description:
      "Conventional loans often require 5-20% down, but FHA loans start at 3.5% and VA loans require zero down for eligible veterans. Closing costs in Florida typically run 2-5% of the purchase price. I'll connect you with lenders who can break down the exact numbers for your situation.",
  },
  {
    title: "Patience & Flexibility",
    description:
      "The right home doesn't always appear on day one. Tampa Bay's market moves fast, and having clear priorities — plus the willingness to act quickly when the right property hits — makes all the difference.",
  },
];

// --- Down payment assistance programs ---
const assistancePrograms = [
  {
    title: "Florida Hometown Heroes Program",
    description:
      "Designed for first-time buyers who work in over 50 eligible professions — teachers, nurses, law enforcement, firefighters, and more. Offers up to $35,000 in down payment and closing cost assistance as a 0% interest, non-amortizing, 30-year deferred second mortgage.",
    href: "/guides/florida-hometown-heroes-program",
    cta: "Read the Full Guide",
  },
  {
    title: "FL Assist (Second Mortgage Program)",
    description:
      "Available to all qualified borrowers through Florida Housing, FL Assist provides up to $10,000 as a 0% interest, non-amortizing, deferred second mortgage. It can be paired with any first mortgage loan offered through Florida Housing's program.",
    href: "/guides/fl-assist-down-payment-program",
    cta: "Learn About FL Assist",
  },
  {
    title: "First-Time Buyer Resources",
    description:
      "Not sure where to begin? My first-time buyer guide covers everything from credit score requirements and loan types to what happens at the closing table. It's the playbook I give every new buyer I work with.",
    href: "/guides/first-time-home-buyer-guide",
    cta: "Read the Buyer Guide",
  },
];

export default function BuyersPage() {
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
              { "@type": "ListItem", position: 2, name: "Buy a Home in Tampa Bay", item: "https://nowtb.com/buyers" },
            ],
          }),
        }}
      />

      {/* FAQPage schema for buyer representation and process questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Does a buyer pay their real estate agent in Florida?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "In most Florida real estate transactions, the seller pays the buyer's agent commission as part of the listing agreement. This means buyers typically receive professional representation at no direct cost to them. Barrett Henry, Broker Associate with REMAX Collective, represents buyers across all 8 Tampa Bay counties.",
                },
              },
              {
                "@type": "Question",
                name: "What down payment assistance programs are available in Florida?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Florida offers several down payment assistance programs including the Hometown Heroes Program (up to $35,000 for eligible professionals), FL Assist (up to $10,000 as a deferred second mortgage), and various county-specific programs. FHA loans require as little as 3.5% down, and VA loans offer zero down payment for eligible veterans.",
                },
              },
              {
                "@type": "Question",
                name: "How long does it take to buy a home in Tampa Bay?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The typical home purchase in Tampa Bay takes 30-60 days from accepted offer to closing. The full process — including getting pre-approved, searching for homes, and closing — usually takes 2-4 months total. Having your pre-approval in hand before you start touring homes speeds things up significantly.",
                },
              },
            ],
          }),
        }}
      />

      {/* ---- Hero Section — full viewport ---- */}
      <HeroSection
        title="Buying a Home"
        label="BARRETT HENRY | THE NOW TEAM"
        subtitle="I've helped hundreds of buyers find the right home at the right price. Here's how we do it."
      />

      {/* ---- Buyer Representation Overview — white background ---- */}
      <section className="section-white">
        <div className="container-wide max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="heading-label mb-6">Buyer Representation</p>
            <h2 className="heading-section text-display-sm text-primary">
              How Does Buyer Representation Work?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="space-y-6">
            <p className="font-body text-muted font-light leading-relaxed">
              When you work with me as your buyer&apos;s agent, I represent your interests
              exclusively throughout the entire transaction. That means I&apos;m negotiating
              for the lowest price, the best terms, and the strongest protections — not
              trying to close a quick deal. With 23+ years of real estate experience, I&apos;ve
              seen every scenario that can come up between contract and closing, and I know
              how to handle each one.
            </p>
            <p className="font-body text-muted font-light leading-relaxed">
              Here&apos;s what most buyers don&apos;t realize: in the majority of Tampa Bay
              transactions, the seller pays the buyer&apos;s agent commission. That means you
              get full professional representation — market analysis, negotiation, contract
              management, and closing coordination — typically at no direct cost to you.
              There is no good reason to go through this process without an experienced agent
              in your corner.
            </p>
            <p className="font-body text-muted font-light leading-relaxed">
              Whether you&apos;re a first-time buyer figuring out FHA loans or a seasoned
              investor adding to your portfolio, The NOW Team handles every detail from
              pre-approval referrals through the final walkthrough. Call me at{" "}
              <a href="tel:+18137337907" className="text-accent hover:underline font-normal">(813) 733-7907</a>{" "}
              and let&apos;s get started.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Why Work With Barrett — cream background ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Your Advantage</p>
            <h2 className="heading-section text-display-sm text-primary">
              Why Work With Barrett?
            </h2>
            <div className="section-divider" />
          </div>

          {/* 3-column minimal cards — no card background, just content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                {/* Accent line above each card */}
                <div className="w-8 h-[1px] bg-accent mx-auto mb-8" />
                <h3 className="heading-section text-sm text-primary mb-4">
                  {b.title}
                </h3>
                <p className="font-body text-sm text-muted font-light leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- The Buying Process — white bg, large step numbers ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Step by Step</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Does the Buying Process Look Like?
            </h2>
            <div className="section-divider" />
          </div>

          {/* Steps grid — large ultra-light numbers beside content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {buyingSteps.map((s) => (
              <div key={s.step} className="flex gap-6">
                {/* Large step number — ultra-light weight */}
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
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- What Buyers Need — cream bg, checklist-style ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Be Prepared</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Do You Need to Buy a Home?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-4xl mx-auto">
            {buyerChecklist.map((item) => (
              <div key={item.title} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-8 h-[1px] bg-accent mt-3" />
                </div>
                <div>
                  <h3 className="heading-section text-sm text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-muted font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Down Payment Assistance Programs — white bg ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Financial Resources</p>
            <h2 className="heading-section text-display-sm text-primary">
              Can You Get Help With Your Down Payment?
            </h2>
            <div className="section-divider" />
            <p className="font-body text-muted font-light text-base md:text-lg max-w-2xl mx-auto mt-6">
              Florida offers several programs that help buyers cover down payment and
              closing costs. These are real dollars — not tax credits — and I&apos;ve helped
              many buyers take advantage of them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {assistancePrograms.map((prog) => (
              <div key={prog.title} className="text-center">
                <div className="w-8 h-[1px] bg-accent mx-auto mb-8" />
                <h3 className="heading-section text-sm text-primary mb-4">
                  {prog.title}
                </h3>
                <p className="font-body text-sm text-muted font-light leading-relaxed mb-6">
                  {prog.description}
                </p>
                <Link
                  href={prog.href}
                  className="font-body text-sm text-accent hover:underline font-normal tracking-wide"
                >
                  {prog.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Tampa Bay Buyer Tips — cream bg ---- */}
      <section className="section-light">
        <div className="container-wide max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="heading-label mb-6">Local Insight</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Should Tampa Bay Buyers Know?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="space-y-6">
            <p className="font-body text-muted font-light leading-relaxed">
              Tampa Bay is one of the most active real estate markets in the Southeast.
              Inventory levels, interest rates, and seasonal patterns all affect how
              quickly homes move and what you&apos;ll pay. Homes in desirable neighborhoods
              can go under contract within days of listing — sometimes hours. Having your
              pre-approval ready and your agent on speed dial is not optional here.
            </p>
            <p className="font-body text-muted font-light leading-relaxed">
              Insurance is a major factor in Florida home buying. Flood zones, wind
              mitigation credits, roof age, and the condition of the property all affect
              your insurance premiums. I help buyers evaluate these costs before making an
              offer — not after. Understanding your total monthly cost (mortgage, taxes,
              insurance, HOA) is the difference between a comfortable purchase and a
              financial headache.
            </p>
            <p className="font-body text-muted font-light leading-relaxed">
              Whether you&apos;re looking in{" "}
              <Link href="/valrico" className="text-accent hover:underline">Valrico</Link>,{" "}
              <Link href="/brandon" className="text-accent hover:underline">Brandon</Link>,{" "}
              <Link href="/riverview" className="text-accent hover:underline">Riverview</Link>,{" "}
              or anywhere else across the region, I&apos;ll give you the straight story on
              pricing, neighborhoods, schools, and commute times. Use the{" "}
              <Link href="/mortgage-calculator" className="text-accent hover:underline">mortgage calculator</Link>{" "}
              to estimate your monthly payment, then{" "}
              <Link href="/contact" className="text-accent hover:underline">reach out</Link>{" "}
              so we can put a plan together.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Search CTA — dark navy ---- */}
      <section className="section-dark">
        <div className="container-wide text-center">
          <p className="heading-label text-white/50 mb-6">Browse Listings</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white">
            Search Available Homes
          </h2>
          <div className="section-divider" />
          <p className="font-body text-white/70 font-light text-base md:text-lg max-w-2xl mx-auto mb-10">
            Browse active listings across Tampa Bay — updated every 5 minutes from
            Stellar MLS. See something you like? Call me directly at{" "}
            <a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a>.
          </p>
          <Link href="/properties" className="btn-secondary">
            View All Properties
          </Link>
        </div>
      </section>

      {/* ---- Buyer Registration Form — white bg ---- */}
      <section className="section-white">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="buyer-reg"
            title="Register as a Buyer"
            submitLabel="Get Started"
          />
        </div>
      </section>
    </>
  );
}
