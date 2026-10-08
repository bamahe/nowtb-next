// =============================================================================
// /sell/why-didnt-my-house-sell
// Seller-intent page for expired and withdrawn listings. The audience is an
// owner whose listing came off the market and who is deciding whether to relist.
//
// Tone rule for this page: never criticize the previous agent. Most expired
// listings are a pricing or exposure problem, not a character problem, and a
// seller who feels their last agent is being attacked stops listening.
//
// NOTE: this route is nested under /sell/. It MUST stay listed in both :city
// flatten redirect lookaheads in next.config.mjs or it 404s on the live domain
// only, while working fine locally.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import QuickAnswer from "@/components/ui/QuickAnswer";
import FaqSection, { type Faq } from "@/components/ui/FaqSection";
import ContactForm from "@/components/ui/ContactForm";
import SourcesSection, { type Source } from "@/components/ui/SourcesSection";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
} from "@/lib/schema";

const SLUG = "sell/why-didnt-my-house-sell";
const CANONICAL = `https://nowtb.com/${SLUG}/`;
const TITLE = "Why Didn't My House Sell? | Barrett Henry, REALTOR";
const DESCRIPTION =
  "Six honest reasons a Tampa Bay listing expires, what to change before you relist, and what I do differently. Call or text (813) 733-7907.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}/` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

// --- The six reasons, in the order they actually cause expirations ---
const reasons = [
  {
    reason: "The price was ahead of the comps",
    detail:
      "This is the cause in most expired listings, and it is rarely because anyone was unreasonable. A price that was right when you listed can be wrong eight weeks later. Buyers and appraisers work from closed sales, not from what the house was worth last spring.",
    tell: "Showings in the first two weeks, then almost nothing. Feedback that says the house is nice but that buyers chose something else.",
  },
  {
    reason: "Condition was competing against renovated inventory",
    detail:
      "A clean, well-kept home with original finishes is competing against a flipped house two streets over. Buyers are not comparing your home to its 2019 self. They are comparing it to the updated one they saw an hour earlier.",
    tell: "Repeat second showings that never convert, or offers that arrive well under asking with a long repair list attached.",
  },
  {
    reason: "The photos were not doing the work",
    detail:
      "Nearly every buyer sees your home online before they see it in person, so the photos are the showing. Dim rooms, phone photos, no twilight shot, no floor plan, and a lead image that is not the home's best feature all cost you traffic you never knew you lost.",
    tell: "Low online view counts and few saves relative to comparable listings.",
  },
  {
    reason: "Marketing reach stopped at the MLS",
    detail:
      "Entering a listing in the MLS and letting the syndication feeds carry it is the baseline, not the plan. If nothing was built to be found by someone searching for your specific type of home in your specific area, you only reached buyers who were already looking that week.",
    tell: "Activity that tracks exactly with portal traffic and nothing else.",
  },
  {
    reason: "Showings were hard to get",
    detail:
      "Restricted windows, 24-hour notice, a tenant who had to approve each visit, a pet that had to be crated, or a lockbox that was not there. Every bit of friction removes buyers, and the ones it removes first are the ones working with a busy agent on a tight schedule.",
    tell: "A low showing count on a home that should have had more, and agents who asked once and never followed up.",
  },
  {
    reason: "Follow-up after showings did not happen",
    detail:
      "A buyer agent who walks your home and hears nothing afterward moves on. Feedback that is never requested is feedback you never get, which means the price and condition signals you needed arrived too late or not at all.",
    tell: "You could not tell your agent what buyers were saying, because nobody had asked.",
  },
];

// --- What actually changes on a relist ---
const relistChanges = [
  {
    change: "Fresh comparable analysis, not the old one",
    why: "We price against what has closed in the last 60 to 90 days in your immediate area, including the homes that beat yours. If the number is uncomfortable, you should hear it before you relist rather than after another 90 days.",
  },
  {
    change: "A specific make-ready list with costs attached",
    why: "Not a renovation. The short list of items that are costing you buyers, each with a quote, so you can decide what is worth doing and what is not.",
  },
  {
    change: "New photography and a new lead image",
    why: "Buyers who scrolled past your home once will scroll past the same photos again. A relist with the old photos reads as the same house at a new price.",
  },
  {
    change: "Days on market resets, but your price history does not",
    why: "Buyer agents can see the prior listing and the reductions. Pretending otherwise does not work. Pricing correctly on day one is what overcomes a visible history.",
  },
  {
    change: "Open showing access",
    why: "Lockbox, generous windows, and a plan for pets and tenants agreed before we go live.",
  },
];

// --- What I do differently, stated as things a seller can verify ---
const differences = [
  {
    item: "You reach me directly",
    detail:
      "My cell is (813) 733-7907. Not a call center, not a rotating junior agent, not a transaction coordinator who calls you back. If you want to test this before you hire me, call it.",
  },
  {
    item: "I review your listing every day it is active",
    detail:
      "Views, saves, showing requests, and what competing inventory did that day. Pricing decisions get made from current data on a weekly cadence, not from a conversation at day 60 when the listing is already stale.",
  },
  {
    item: "I build pages that get found in search and in AI answers",
    detail:
      "Beyond the MLS and the portals, I publish area and property-type content designed to be found by people searching for a home like yours, including in AI answer engines that now sit in front of traditional search. That is a channel most listings simply do not have.",
  },
  {
    item: "I know the down payment assistance programs, which widens your buyer pool",
    detail:
      "Florida Hometown Heroes offers eligible buyers 5 percent of the first mortgage amount, from a $10,000 minimum up to $35,000, as a 0 percent, non-amortizing, 30-year deferred second mortgage. Eligibility covers full-time employees of Florida-based employers, active-duty and reserve military, and veterans. The loan is not forgivable, and funding is limited, so availability has to be confirmed at the time. Knowing which buyers can use it means more qualified people can afford your house.",
  },
  {
    item: "Buyers are pre-approved before they walk through",
    detail:
      "I confirm financing before a showing rather than after an offer. Fewer tire-kickers through your home, and far less chance of a contract falling apart at underwriting after you have already moved on.",
  },
  {
    item: "I will tell you if you should not list right now",
    detail:
      "Sometimes the right answer is to wait, or to rent the house, or to fix one specific thing first. I would rather give you that answer than take a listing I do not believe will sell.",
  },
];

const serviceAreas = [
  { name: "Valrico", href: "/valrico/" },
  { name: "Brandon", href: "/brandon/" },
  { name: "Riverview", href: "/riverview/" },
  { name: "Lithia", href: "/lithia/" },
  { name: "FishHawk", href: "/fishhawk/" },
  { name: "Seffner", href: "/seffner/" },
  { name: "Plant City", href: "/plant-city/" },
];

const faqs: Faq[] = [
  {
    question: "Why didn't my house sell?",
    answer:
      "In most expired listings the price was ahead of what had recently closed nearby, and the listing did not adjust fast enough. The other common causes are condition competing against renovated inventory, weak photography, marketing that stopped at the MLS, showing access that was hard for buyer agents, and no follow-up to collect feedback after showings. Usually two or three of these are happening at once.",
  },
  {
    question: "How long should I wait before relisting?",
    answer:
      "Long enough to change something real, which is usually two to four weeks. Relisting the same house at the same price with the same photos produces the same result. If the only change is the price, you can move quickly. If photography or make-ready work is needed, build that in first.",
  },
  {
    question: "Does relisting reset days on market?",
    answer:
      "The days on market counter resets, but your price history stays visible to buyer agents in the MLS. They can see the original list price and every reduction. That is why pricing correctly on the relist matters more than the reset does.",
  },
  {
    question: "Should I use the same agent again?",
    answer:
      "That depends on what went wrong and whether they told you about it early. If your agent brought you current comparable sales, pushed for a price change while there was still time, and gave you showing feedback, the listing probably failed on price and they handled it correctly. If you found out at day 80 that the price was wrong, that is a different conversation.",
  },
  {
    question: "Will a cash offer be less than the market price?",
    answer:
      "Usually yes. A cash buyer is pricing speed and certainty, so the number is typically below what the open market would pay. That can still be the right choice if you need to close fast or the home needs work you cannot fund. I will show you both numbers so you are choosing rather than guessing.",
  },
];

const sources: Source[] = [
  {
    name: "Florida Housing Finance Corporation, Hometown Heroes Housing Program",
    used: "Assistance amount, the 5 percent and $10,000 to $35,000 range, the 0 percent non-amortizing 30-year deferred second mortgage structure, eligibility categories, and that the loan is not forgivable.",
    href: "https://www.floridahousing.org/programs/homebuyer-overview-page/hometown-heroes",
  },
  {
    name: "Stellar MLS listing data",
    used: "Closed comparable sales, days on market, and price history used in the pricing analysis for any specific property.",
  },
];

export default function WhyDidntMyHouseSellPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com" },
          { name: "Sell", url: "https://nowtb.com/sell-your-home/" },
          { name: "Why Didn't My House Sell?", url: CANONICAL },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={webPageSchema({
          name: TITLE,
          description: DESCRIPTION,
          url: CANONICAL,
          datePublished: "2026-10-07",
          dateModified: "2026-10-07",
        })}
      />

      <HeroSection
        label="Expired and Withdrawn Listings"
        title="Why Didn't My House Sell?"
        subtitle="Six honest reasons a Tampa Bay listing expires, and what to change before you put it back on the market."
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+18137337907"
            className="inline-flex items-center justify-center bg-white text-primary font-semibold px-7 py-3 rounded-lg text-sm hover:bg-light transition-colors"
          >
            Call or Text (813) 733-7907
          </a>
          <Link
            href="#talk-to-barrett"
            className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-7 py-3 rounded-lg text-sm hover:bg-white hover:text-primary transition-colors"
          >
            Get a Second Opinion
          </Link>
        </div>
      </HeroSection>

      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              Most Tampa Bay listings expire because the price was ahead of what
              had recently closed nearby and the listing did not adjust quickly
              enough. The next most common causes are condition competing against
              renovated inventory, photography that cost you online traffic,
              marketing that never went past the MLS, showing access that was hard
              for buyer agents, and no follow-up to collect feedback.
            </p>
            <p>
              Usually two or three of those are happening together. All of them
              are fixable, and none of them mean your home is unsellable.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* === The six reasons === */}
      <section className="container-wide pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            The six reasons listings expire
          </h2>
          <p className="font-body text-muted mb-10 leading-relaxed">
            I am not going to tell you your last agent was the problem. In my
            experience that is usually not what happened, and it is not a useful
            place to start. Here is what actually causes this, with the signal
            that tells you which one you had.
          </p>
          <div className="space-y-6">
            {reasons.map((r, i) => (
              <div key={r.reason} className="border border-border p-6">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-heading font-bold text-accent text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="heading-section text-lg text-primary">
                    {r.reason}
                  </h3>
                </div>
                <p className="font-body text-dark leading-relaxed mb-3">
                  {r.detail}
                </p>
                <p className="font-body text-muted text-sm leading-relaxed">
                  <strong className="text-primary">How you know:</strong> {r.tell}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === What changes on a relist === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What has to change before you relist
          </h2>
          <p className="font-body text-muted mb-10 leading-relaxed">
            A relist only works if something is different. Same price, same
            photos, same access produces the same ninety days.
          </p>
          <div className="space-y-5">
            {relistChanges.map((c) => (
              <div key={c.change} className="bg-white border border-border p-6">
                <h3 className="heading-section text-base text-primary mb-2">
                  {c.change}
                </h3>
                <p className="font-body text-dark text-sm leading-relaxed">
                  {c.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === What I do differently === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What I do differently
          </h2>
          <p className="font-body text-muted mb-10 leading-relaxed">
            Every one of these is something you can check before you hire me.
          </p>
          <div className="space-y-6">
            {differences.map((d) => (
              <div key={d.item} className="border-l-4 border-accent pl-6">
                <h3 className="heading-section text-base text-primary mb-2">
                  {d.item}
                </h3>
                <p className="font-body text-dark text-sm leading-relaxed">
                  {d.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border-2 border-primary/20 bg-primary/5 p-6 md:p-8">
            <h3 className="heading-section text-lg text-primary mb-2">
              Not sure selling is still the right move?
            </h3>
            <p className="font-body text-muted text-sm mb-4 leading-relaxed">
              Two things worth reading before you relist. If you are weighing
              renting the house instead, I lay out the real carrying costs and the
              capital gains clock in{" "}
              <Link href="/blog/sell-or-rent-my-house-tampa-bay/" className="text-link hover:underline">
                should I sell or rent my house in Tampa Bay
              </Link>
              . If a past insurance claim is part of why the house struggled, see{" "}
              <Link
                href="/blog/selling-house-with-past-sinkhole-claim-florida/"
                className="text-link hover:underline"
              >
                selling a Florida house with a past sinkhole claim
              </Link>
              , which is really a guide to how documentation beats a price cut.
            </p>
          </div>
        </div>
      </section>

      {/* === Service area === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Where I work
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            I live and work in east Hillsborough County, so these are the markets
            where I know the inventory street by street.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {serviceAreas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="inline-flex items-center border border-border bg-white px-5 py-2.5 font-body text-sm text-primary hover:border-accent hover:text-accent transition-colors"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === Contact === */}
      <section id="talk-to-barrett" className="container-wide py-16">
        <div className="max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="/sell/why-didnt-my-house-sell/"
            type="valuation"
            title="Tell me about your listing"
            submitLabel="Get My Second Opinion"
          />
          <p className="font-body text-muted text-sm text-center mt-6 leading-relaxed">
            Or call or text me directly at{" "}
            <a href="tel:+18137337907" className="text-link hover:underline font-semibold">
              (813) 733-7907
            </a>
            . Barrett Henry, Broker Associate, REMAX Collective. 23+ years of real
            estate experience, REMAX Hall of Fame 2024.
          </p>
        </div>
      </section>

      <FaqSection
        heading="Questions sellers ask after a listing expires"
        faqs={faqs}
      />

      <SourcesSection sources={sources} />
    </>
  );
}
