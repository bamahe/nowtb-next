// =============================================================================
// /indian-rocks-beach-rental-rules
// City of Indian Rocks Beach vacation rental rules under Ordinance 2023-02,
// plus the building-level minimum stay rules that stack on top of them.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import BeachCondoInventory from "@/components/ui/BeachCondoInventory";
import QuickAnswer from "@/components/ui/QuickAnswer";
import FaqSection, { type Faq } from "@/components/ui/FaqSection";
import BeachCondoFooterBlock from "@/components/ui/BeachCondoFooterBlock";
import SourcesSection, { type Source } from "@/components/ui/SourcesSection";
import { JsonLd, breadcrumbSchema, articleSchema, faqSchema, webPageSchema } from "@/lib/schema";
import { BEACH_CONDO_PUBLISH_DATE } from "@/data/beach-condo-pages";

const SLUG = "indian-rocks-beach-rental-rules";
const CANONICAL = `https://nowtb.com/${SLUG}/`;
const TITLE = "Indian Rocks Beach Rental Rules 2026";
const DESCRIPTION =
  "Indian Rocks Beach vacation rental rules: $300 registration, $150 inspection, 12 guest cap, parking limits, plus building minimums.";

export const metadata: Metadata = {
  // absolute: the root layout appends a suffix to title strings, which would
  // push these past the 60 character limit
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}/` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

// --- What the city requires before you rent ---
const registrationSteps = [
  {
    step: "Vacation rental registration",
    detail:
      "$300 per unit, renewed annually. Condo units have a separate City of Indian Rocks Beach condo vacation rental registration application.",
  },
  {
    step: "Inspection",
    detail: "$150 per unit, renewed annually alongside the registration.",
  },
  {
    step: "City Business Tax Receipt",
    detail: "A City of Indian Rocks Beach Business Tax Receipt is required in addition to the rental registration.",
  },
  {
    step: "County tourist development tax",
    detail: "Register with Pinellas County for the Tourist Development Tax.",
  },
];

// --- Operating limits under the ordinance ---
const operatingRules = [
  "Most rentals are capped at 12 overnight guests, calculated as 2 per bedroom plus 2 in the common area.",
  "One parking space per bedroom.",
  "The owner or a designated agent must be reachable around the clock.",
];

// --- Examples of building-level minimum stays from current listings ---
const buildingMinimums = [
  { building: "Reflections on the Gulf", minimum: "2 weeks" },
  { building: "Beach Cottage", minimum: "Weekly" },
  { building: "Redington Place", minimum: "30 days" },
  { building: "Club Redington", minimum: "3 months" },
];

// --- Sources cited on this page (GEO: name the sources on-page) ---
const sources: Source[] = [
  {
    name: 'City of Indian Rocks Beach Ordinance 2023-02, effective August 1, 2023',
    used: 'Registration and inspection fees, guest caps, parking limits, and the around the clock contact requirement.',
    href: "https://www.indian-rocks-beach.com/",
  },
  {
    name: 'City of Indian Rocks Beach meeting records',
    used: 'Enforcement activity, including the violation count at the start of 2026, and the status of the ordinance litigation.',
  },
  {
    name: 'Pinellas County Tourist Development Tax registration requirements',
    used: 'The county level tax registration required in addition to city approvals.',
  },
  {
    name: 'Current Stellar MLS listing disclosures',
    used: 'Building level minimum stay requirements.',
  },
];

const faqs: Faq[] = [
  {
    question: "What does it cost to register a vacation rental in Indian Rocks Beach?",
    answer:
      "Registration is $300 per unit plus a $150 per unit inspection, both renewed annually. You also need a City of Indian Rocks Beach Business Tax Receipt and registration with Pinellas County for the Tourist Development Tax. Condo units have a separate city condo vacation rental registration application.",
  },
  {
    question: "How many guests can stay in an Indian Rocks Beach vacation rental?",
    answer:
      "Most rentals are capped at 12 overnight guests under Ordinance 2023-02. The formula is 2 guests per bedroom plus 2 in the common area. The ordinance also limits parking to one space per bedroom, and the owner or a designated agent has to be reachable around the clock.",
  },
  {
    question: "Does the city minimum stay override my condo building rules?",
    answer:
      "No, the two stack. Your building can be stricter than the city, and many are. Examples from current listings include 2 weeks at Reflections on the Gulf, weekly at Beach Cottage, 30 days at Redington Place, and 3 months at Club Redington. Always verify the current minimum in that building's recorded rules before you buy.",
  },
  {
    question: "Is Indian Rocks Beach actually enforcing the rental ordinance?",
    answer:
      "Yes, and enforcement increased in 2026. At the start of 2026, just under 200 rental properties had ordinance violations according to city meetings. Treat registration, guest caps, and parking as real operating constraints, not paperwork.",
  },
  {
    question: "Could the Indian Rocks Beach rental rules change?",
    answer:
      "They could. Rental owners have challenged the ordinance in court and that litigation was still active in 2026. Buy on the rules as they exist today and underwrite your numbers so the deal still works if the rules tighten rather than loosen.",
  },
  {
    question: "Who do I call at the city with rental questions?",
    answer:
      "Indian Rocks Beach City Hall is at 1507 Bay Palm Blvd and the phone number is (727) 595-2517. Ask for the current vacation rental registration packet, since the condo application is separate from the single-family one.",
  },
];

export default function IndianRocksBeachRentalRulesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com/" },
          { name: "Indian Rocks Beach", url: "https://nowtb.com/indian-rocks-beach/" },
          { name: "Indian Rocks Beach Rental Rules", url: CANONICAL },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "Indian Rocks Beach Rental Rules 2026",
          description: DESCRIPTION,
          url: CANONICAL,
          datePublished: BEACH_CONDO_PUBLISH_DATE,
        })}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={webPageSchema({
          name: TITLE,
          description: DESCRIPTION,
          url: CANONICAL,
          datePublished: BEACH_CONDO_PUBLISH_DATE,
        })}
      />

      <HeroSection
        label="INDIAN ROCKS BEACH | 2026"
        title="Indian Rocks Beach Rental Rules"
        subtitle="What the city requires, what it costs, and why your building rules matter just as much as the ordinance."
      >
        <SearchBar />
      </HeroSection>

      {/* === Quick answer === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              Indian Rocks Beach regulates vacation rentals under Ordinance
              2023-02, effective August 1, 2023. Registration runs $300 per unit
              plus a $150 per unit inspection, renewed annually, and you also
              need a City of Indian Rocks Beach Business Tax Receipt and Pinellas
              County Tourist Development Tax registration. Most rentals are
              capped at 12 overnight guests with one parking space per bedroom,
              and the owner or agent must be reachable around the clock. Your
              condo building can set a stricter minimum stay on top of the city
              rules, so verify both.
            </p>
          </QuickAnswer>
          <p className="font-body text-muted text-sm mt-4 leading-relaxed">
            According to City of Indian Rocks Beach Ordinance 2023-02 and city meeting records, checked October 2026.
          </p>
          <p className="font-body text-muted text-sm mt-3 leading-relaxed">
            Keep reading:
              <Link href="/indian-rocks-beach/" className="text-link hover:underline">
                Indian Rocks Beach homes and condos for sale
              </Link>,{" "}
              <Link href="/pinellas-beach-condo-market-report/" className="text-link hover:underline">
                current Gulf beach condo pricing
              </Link>, and{" "}
              <Link href="/gulf-front-condos-sirs-milestone-complete/" className="text-link hover:underline">
                building reserve and inspection status
              </Link>.
          </p>
        </div>
      </section>

      {/* === Registration === */}
      <section className="container-wide pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Do You Have to Register Before Renting?
          </h2>
          <p className="font-body text-muted mb-6 leading-relaxed">
            Four separate items, and all four are annual or ongoing. Missing one
            is the most common way owners end up in violation without meaning
            to be.
          </p>
          <div className="space-y-4">
            {registrationSteps.map((item, index) => (
              <div key={item.step} className="border border-border p-6">
                <p className="font-body text-xs font-medium tracking-[0.2em] uppercase text-muted mb-2">
                  Step {index + 1}
                </p>
                <h3 className="heading-section text-lg text-primary mb-2">
                  {item.step}
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="font-body text-muted text-sm mt-6 leading-relaxed">
            Indian Rocks Beach City Hall is at 1507 Bay Palm Blvd,{" "}
            <a href="tel:+17275952517" className="text-link hover:underline">
              (727) 595-2517
            </a>
            . Ask for the current packet rather than working from a downloaded
            copy, because the condo application is separate.
          </p>
        </div>
      </section>

      {/* === Operating rules === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            How Many Guests and Cars Are Allowed?
          </h2>
          <ul className="space-y-3 mb-6">
            {operatingRules.map((rule) => (
              <li key={rule} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  &#10003;
                </span>
                <span className="font-body text-muted text-sm leading-relaxed">
                  {rule}
                </span>
              </li>
            ))}
          </ul>
          <p className="font-body text-muted leading-relaxed">
            Run those three numbers against the unit you are considering before
            you run a rental projection. A 2 bedroom unit caps out at 6 overnight
            guests and 2 parking spaces, and on these beaches parking is often
            the real constraint, not the bedroom count.
          </p>
        </div>
      </section>

      {/* === Enforcement === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Is the City Enforcing the Ordinance?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Yes. Enforcement increased in 2026. At the start of 2026, just
              under 200 rental properties had ordinance violations according to
              city meetings. That is not a handful of outliers, it is a program.
            </p>
            <p>
              There is also an open legal question. Rental owners have challenged
              the ordinance in court and that litigation was still active in
              2026, so the rules may change. Underwrite the deal on the rules in
              force today and leave yourself room if they tighten.
            </p>
          </div>
        </div>
      </section>

      {/* === Building minimums === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Do Condo Building Rules Stack on Top of City Rules?
          </h2>
          <p className="font-body text-muted mb-6 leading-relaxed">
            They do, and the building is usually the stricter of the two. A city
            that permits short stays does not obligate your association to allow
            them. These minimums come from current listings and show how wide
            the range gets from one building to the next.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[420px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Building
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    Minimum Stay
                  </th>
                </tr>
              </thead>
              <tbody>
                {buildingMinimums.map((item) => (
                  <tr key={item.building} className="border-b border-border">
                    <td className="font-body text-primary font-medium py-4 pr-4 text-sm">
                      {item.building}
                    </td>
                    <td className="font-body text-muted py-4 text-sm">
                      {item.minimum}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-body text-muted text-sm mt-6 leading-relaxed">
            Verify the minimum in each building&apos;s current recorded rules.
            Rental minimums get amended, and a listing remark is not the rule.
            Buying the unit in an entity adds another approval layer, which is
            covered on the{" "}
            <Link href="/buying-beach-condo-llc-florida/" className="text-link hover:underline">
              LLC purchase page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* === Mid-page CTA === */}
      <section className="bg-primary py-12">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-white text-2xl mb-4">
            Check the Rental Rules Before You Buy
          </h2>
          <p className="font-body text-white/70 mb-6">
            Barrett pulls the city registration requirements and the
            building&apos;s recorded rental rules on any unit you are
            considering, so the income plan matches what you are actually
            allowed to do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18137337907" className="btn-primary inline-block">
              Call or Text (813) 733-7907
            </a>
            <Link href="/indian-rocks-beach/" className="btn-secondary inline-block">
              Indian Rocks Beach Homes
            </Link>
          </div>
        </div>
      </section>

      <BeachCondoInventory
        title="Indian Rocks Beach Area Condos for Sale"
        subtitle="Active condo listings on the Gulf beaches. Verify the building's rental minimum before you write an offer."
      />

      <FaqSection
        heading="Indian Rocks Beach Rental Questions"
        faqs={faqs}
      />

      <SourcesSection sources={sources} />

      <BeachCondoFooterBlock
        currentSlug={SLUG}
        ctaHeadline="Check the Rental Rules on a Specific Unit"
        ctaCopy="Send Barrett the building or address and he will confirm the city registration requirements and the recorded minimum stay before you write an offer."
        submitLabel="Check Rental Rules"
        sources="City of Indian Rocks Beach Ordinance 2023-02 and city meeting records, Pinellas County Tourist Development Tax requirements, and current Stellar MLS listing disclosures, checked October 2026. This page is general information, not legal advice."
      />
    </>
  );
}
