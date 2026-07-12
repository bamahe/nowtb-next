// =============================================================================
// /open-houses — Open Houses in Tampa Bay
// Full content page with open house guide for buyers and sellers,
// tips, virtual tour info, and live listing grid from Bridge API.
// Luxury minimalist design: alternating sections, accent dividers.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ListingGrid from "@/components/ui/ListingGrid";
import ContactForm from "@/components/ui/ContactForm";
import { getOpenHouses } from "@/lib/bridge";

// ISR: cache for 15 min — open houses don't change minute-to-minute
export const revalidate = 3600;

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Open Houses Tampa Bay This Week | Barrett Henry, REALTOR®",
  description:
    "Browse open houses in Tampa Bay this week. Tips for buyers and sellers, virtual tour options, and live MLS listings. Barrett Henry, Broker Associate at REMAX Collective. (813) 733-7907.",
  alternates: {
    canonical: "/open-houses/",
  },
  openGraph: {
    title: "Open Houses This Week in Tampa Bay | Barrett Henry, REALTOR®",
    description:
      "Find open houses across Tampa Bay updated daily from Stellar MLS. Walk through homes in person or tour virtually.",
    type: "website",
  },
};

// --- What to look for at an open house (buyer tips) ---
const buyerTips = [
  {
    step: 1,
    title: "Arrive Early and Take Your Time",
    description:
      "The first few minutes of an open house are the least crowded. Walk through every room, open closets, check water pressure, and test light switches. Don't rush — this is a major purchase.",
  },
  {
    step: 2,
    title: "Look Past the Staging",
    description:
      "Furniture and decor are there to sell you a feeling. Focus on the bones: roof age, window condition, flooring under rugs, and signs of water damage on ceilings and around windows.",
  },
  {
    step: 3,
    title: "Ask the Right Questions",
    description:
      "How long has the home been on the market? Have there been price reductions? What's included in the sale? Are there HOA fees or special assessments? Why is the seller moving?",
  },
  {
    step: 4,
    title: "Check the Neighborhood",
    description:
      "Drive the surrounding streets before and after the open house. Visit at different times of day. Look at nearby construction, traffic patterns, and the condition of neighboring properties.",
  },
  {
    step: 5,
    title: "Bring a Pre-Approval Letter",
    description:
      "If you find a home you love, having your pre-approval ready lets you make an offer the same day. In a competitive market, speed matters.",
  },
  {
    step: 6,
    title: "Take Notes and Photos",
    description:
      "After touring several homes, they all start to blend together. Snap photos of each room, jot down your impressions, and rate each home on your criteria list while it's fresh.",
  },
];

// --- How open houses benefit sellers ---
const sellerBenefits = [
  {
    title: "Maximum Exposure in One Weekend",
    description:
      "An open house puts your home in front of dozens of potential buyers in a single afternoon. Combined with MLS syndication and social media promotion, it creates urgency and competition.",
  },
  {
    title: "Real-Time Buyer Feedback",
    description:
      "I collect feedback from every visitor — what they loved, what gave them pause, and how your home compares to others they've seen. This data helps us fine-tune pricing and presentation.",
  },
  {
    title: "Professional Presentation",
    description:
      "The NOW Team handles staging guidance, signage, refreshments, and every detail of the event. Your home shows its best, and you don't have to lift a finger on open house day.",
  },
];

export default async function OpenHousesPage() {
  // Fetch open houses from Bridge API (server-side, dynamic)
  const listings = await getOpenHouses();

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
              { "@type": "ListItem", position: 2, name: "Open Houses", item: "https://nowtb.com/open-houses" },
            ],
          }),
        }}
      />

      {/* ---- Hero Section ---- */}
      <HeroSection
        title="Open Houses in Tampa Bay"
        label="BARRETT HENRY | THE NOW TEAM"
        subtitle="Walk through homes in person, ask questions on the spot, and get a real feel for the space. Updated daily from Stellar MLS."
      />

      {/* ---- What to Expect — white background ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">What to Expect</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Happens at a Tampa Bay Open House
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="font-body text-muted font-light text-base md:text-lg leading-relaxed mb-6">
              An open house is a scheduled window — usually on a Saturday or
              Sunday afternoon — when a listed home is open for anyone to walk
              through without an appointment. You sign in at the door, grab a
              property flyer, and tour the home at your own pace.
            </p>
            <p className="font-body text-muted font-light text-base md:text-lg leading-relaxed mb-6">
              The listing agent is typically on-site to answer questions about
              the property, the neighborhood, and the terms of the sale. There
              is no pressure and no obligation. Open houses are one of the best
              ways to compare homes, get a sense of what your budget buys, and
              narrow down your search before committing to private showings.
            </p>
            <p className="font-body text-muted font-light text-base md:text-lg leading-relaxed">
              In Tampa Bay, open houses are most common on weekends between
              12:00 PM and 4:00 PM, though some agents schedule Thursday and
              Friday twilight events as well. Check the listings below for
              exact dates and times — schedules change weekly.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Buyer Tips — warm cream bg, numbered steps ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Buyer Tips</p>
            <h2 className="heading-section text-display-sm text-primary">
              What to Look for at an Open House
            </h2>
            <div className="section-divider" />
          </div>

          {/* Numbered tips grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {buyerTips.map((tip) => (
              <div key={tip.step} className="flex gap-6">
                {/* Large step number — ultra-light weight */}
                <div className="flex-shrink-0">
                  <span className="font-heading text-5xl font-extralight text-accent/40 leading-none">
                    {String(tip.step).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="heading-section text-sm text-primary mb-2">
                    {tip.title}
                  </h3>
                  <p className="font-body text-sm text-muted font-light leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Live Open House Listings Grid ---- */}
      {listings.length > 0 ? (
        <ListingGrid
          listings={listings}
          title="Upcoming Open Houses"
          subtitle="Homes with open houses scheduled in the next 7 days — pulled live from Stellar MLS"
        />
      ) : (
        /* ---- No Open Houses Fallback ---- */
        <section className="section-white">
          <div className="container-wide py-16 text-center">
            <h2 className="heading-section text-display-sm text-primary mb-4">
              No Open Houses Scheduled This Week
            </h2>
            <p className="font-body text-muted text-lg max-w-2xl mx-auto mb-8">
              There are no open houses listed in Tampa Bay for the next 7 days.
              New open houses are added throughout the week — check back soon, or
              browse all available listings.
            </p>
            <Link href="/properties" className="btn-primary inline-block">
              Browse All Properties
            </Link>
          </div>
        </section>
      )}

      {/* ---- Seller Benefits — white bg, 3-column cards ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">For Sellers</p>
            <h2 className="heading-section text-display-sm text-primary">
              How Open Houses Help Sell Your Home
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {sellerBenefits.map((b) => (
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

          <div className="max-w-3xl mx-auto mt-16">
            <p className="font-body text-muted font-light text-base md:text-lg leading-relaxed">
              If you are thinking about selling, an open house is one of the
              most effective tools in the marketing plan. I coordinate
              everything — from timing and promotion to follow-up with every
              visitor who walked through the door. The goal is simple: get your
              home in front of as many qualified buyers as possible, as fast as
              possible.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Virtual Tours — dark navy ---- */}
      <section className="section-dark">
        <div className="container-wide text-center">
          <p className="heading-label text-white/50 mb-6">Tour From Anywhere</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white">
            Virtual Tour Options
          </h2>
          <div className="section-divider" />
          <p className="font-body text-white/70 font-light text-base md:text-lg max-w-2xl mx-auto mb-6">
            Can&apos;t attend in person? Many of our listings include 3D
            Matterport tours, HD video walkthroughs, and interactive floor
            plans. Browse the home room by room from your phone or laptop — no
            appointment needed.
          </p>
          <p className="font-body text-white/70 font-light text-base md:text-lg max-w-2xl mx-auto mb-10">
            For out-of-state buyers or anyone relocating to Tampa Bay, I also
            offer live FaceTime and Zoom walkthroughs. You direct the tour
            while I walk through the property in real time. It is the next best
            thing to being there.
          </p>
          <Link href="/properties" className="btn-secondary">
            Browse Listings With Virtual Tours
          </Link>
        </div>
      </section>

      {/* ---- Private Showing CTA — warm cream bg ---- */}
      <section className="section-light">
        <div className="container-wide text-center">
          <p className="heading-label mb-6">Private Showing</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-primary">
            See a Home on Your Schedule
          </h2>
          <div className="section-divider" />
          <p className="font-body text-muted font-light text-base md:text-lg max-w-2xl mx-auto mb-10">
            Open houses don&apos;t always line up with your calendar. I
            schedule private showings seven days a week — mornings, evenings,
            and weekends. Call me directly or fill out the form below and
            I&apos;ll get back to you within two hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18137337907" className="btn-primary inline-block">
              Call (813) 733-7907
            </a>
            <Link href="/contact" className="btn-secondary inline-block">
              Request a Showing
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Contact Form — white bg ---- */}
      <section className="section-white">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="open-houses"
            title="Schedule a Tour"
            submitLabel="Send Request"
          />
        </div>
      </section>
    </>
  );
}
