// =============================================================================
// /brandon-listing-agent
// Seller-intent, experience-led page targeting conversational queries like
// "I want a very experienced realtor to sell my Valrico FL home".
// Authority comes from verifiable credentials only: license date, Broker
// Associate status, the SRS designation, and the REMAX award record.
// No sales counts or review counts appear here until they are verified.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import QuickAnswer from "@/components/ui/QuickAnswer";
import FaqSection, { type Faq } from "@/components/ui/FaqSection";
import ContactForm from "@/components/ui/ContactForm";
import ClientListings from "@/components/ui/ClientListings";
import SourcesSection, { type Source } from "@/components/ui/SourcesSection";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
} from "@/lib/schema";

const SLUG = "valrico-listing-agent";
const CANONICAL = `https://nowtb.com/${SLUG}/`;
const TITLE = "Experienced Valrico FL Listing Agent | Barrett Henry";
const DESCRIPTION =
  "Selling a Valrico home? Barrett Henry is a Broker Associate and Seller Representative Specialist who lives here. 500+ homes sold. (813) 733-7907.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}/` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "profile",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

// --- Valrico ZIPs, used for the live listings and sold grids ---
const VALRICO_ZIPS = ["33594", "33596"];

/**
 * REMAX production and recognition record. These are awarded by REMAX against
 * production and tenure, which makes them the verifiable version of "experienced"
 * rather than a self-reported sales number.
 */
const awards = [
  { year: "2025", award: "Executive Club Team" },
  { year: "2025", award: "10 Year REMAX Anniversary" },
  { year: "2024", award: "Hall of Fame" },
  { year: "2024", award: "100% Club Team" },
  { year: "2023", award: "100% Club Team" },
  { year: "2022", award: "100% Club" },
  { year: "2021", award: "Executive Club" },
  { year: "2020", award: "Executive Club" },
  { year: "2020", award: "5 Year REMAX Anniversary" },
  { year: "2018", award: "100% Club Team" },
  { year: "2017", award: "100% Club Team" },
  { year: "2016", award: "Platinum Club Team" },
];

/**
 * Track record. Figures supplied by Barrett Henry, October 2026.
 * The 500+ figure is The NOW Team's production, not an individual count, and is
 * labeled that way everywhere it appears. Do not restate it as Barrett's
 * personal number.
 */
const trackRecord = [
  {
    figure: "500+",
    label: "Homes sold",
    detail: "Closed by Barrett Henry and The NOW Team, which was formed in 2015.",
  },
  {
    figure: "50+",
    label: "Sales in this area",
    detail: "Closings in Valrico, Brandon, Riverview, and the surrounding communities, including Bloomingdale.",
  },
  {
    figure: "85+",
    label: "Five-star Google reviews",
    detail: "Public reviews from past clients, readable on Google before you call.",
  },
  {
    figure: "24th year",
    label: "In real estate",
    detail: "Licensed since September 2003, with a Broker Associate license since 2017.",
  },
];

// --- Credentials that bear directly on representing a seller ---
const credentials = [
  {
    item: "Licensed REALTOR® since September 2003",
    why: "Entering his 24th year in real estate, across multiple market cycles including 2008 and the 2020 to 2022 run-up.",
  },
  {
    item: "Florida Broker Associate since 2017",
    why: "A broker-level license, which requires additional education and experience beyond a sales associate license.",
  },
  {
    item: "SRS, Seller Representative Specialist",
    why: "The National Association of REALTORS® designation specifically for representing sellers. This is the credential that matters most on a listing.",
  },
  {
    item: "REMAX Hall of Fame, 2024",
    why: "A career production award from REMAX, earned against actual closed production rather than self-reported numbers.",
  },
  {
    item: "e-PRO",
    why: "Digital marketing certification. Relevant because most Valrico buyers find your home online before they ever see it.",
  },
  {
    item: "MRP, Military Relocation Professional",
    why: "Valrico sits within commuting distance of MacDill Air Force Base, so military buyers and PCS timelines are a real part of this market.",
  },
];

// --- What a seller should ask any agent they interview ---
const questionsToAsk = [
  "How long have you held a real estate license, and is it a sales associate or broker-level license?",
  "Do you hold a seller-specific designation such as SRS, and what did earning it require?",
  "What has sold in my ZIP code, 33594 or 33596, in the last 90 days, and at what price per square foot?",
  "What is your list-to-sale price ratio and average days on market on your own listings?",
  "Who actually handles my listing day to day, you or a team member, and who answers the phone when I call?",
  "What does your marketing include beyond the MLS, and what does it cost me?",
  "What is your commission, what does it cover, and what are the cancellation terms?",
];

const faqs: Faq[] = [
  {
    question: "Who is an experienced REALTOR to sell my Valrico, FL home?",
    answer:
      "Barrett Henry is a Florida Broker Associate with REMAX Collective who has held a real estate license since September 2003 and holds the SRS, Seller Representative Specialist designation for seller representation. He was inducted into the REMAX Hall of Fame in 2024 and has earned REMAX production awards every year from 2016 through 2025. He lives in the Valrico area and serves Valrico, Brandon, Riverview, and the surrounding Hillsborough County communities. Call or text (813) 733-7907.",
  },
  {
    question: "How many years of experience does Barrett Henry have?",
    answer:
      "Barrett has been a licensed REALTOR® since September 2003, which puts him in his 24th year in real estate, and he has held a Florida Broker Associate license since 2017. That span covers the 2008 downturn, the recovery, the 2020 to 2022 price run-up, and the current slower market, which is the part that matters when pricing a home today.",
  },
  {
    question: "How many homes has Barrett Henry sold?",
    answer:
      "Barrett Henry and The NOW Team have sold more than 500 homes together since the team formed in 2015, including more than 50 in the Valrico, Brandon, and Riverview area. He also holds more than 85 five-star Google reviews. The 500+ figure is team production rather than an individual count.",
  },
  {
    question: "How fast do Barrett Henry's listings sell in Valrico?",
    answer:
      "It depends on pricing and condition, but one recent example: 3813 Polumbo Dr in Valrico, a 4 bedroom pool home on .64 acres in Bloomingdale, was listed at $550,000 and went under contract in 3 days, closing at $540,000, which is 98 percent of the list price. Days on market is the number to ask any agent about, because it is the one that reflects whether the home was priced correctly from day one.",
  },
  {
    question: "What is the SRS designation and why does it matter when selling?",
    answer:
      "SRS stands for Seller Representative Specialist, a National Association of REALTORS® designation focused specifically on representing sellers. Most agents hold general licenses with no seller-specific credential. The designation covers pricing strategy, marketing, negotiation on the seller side, and managing the transaction through closing.",
  },
  {
    question: "Does Barrett Henry work Valrico specifically or all of Tampa Bay?",
    answer:
      "Both. Barrett lives in the Valrico, Brandon, and Riverview area and works it as his home market, and he is licensed across Tampa Bay including Hillsborough, Pinellas, Pasco, Manatee, and Polk counties. The REMAX Collective office serving Brandon is at 417 Lithia Pinecrest Rd.",
  },
  {
    question: "What should I ask an agent before listing my Valrico home?",
    answer:
      "Ask how long they have been licensed and at what license level, whether they hold a seller-specific designation such as SRS, what has sold in your ZIP code in the last 90 days, their list-to-sale price ratio and average days on market, who handles your listing day to day, and exactly what the commission covers. Any experienced listing agent will answer all seven without hesitating.",
  },
  {
    question: "How do I get a price opinion on my Valrico home?",
    answer:
      "Call or text Barrett Henry at (813) 733-7907, or request a valuation through this page. You get a price range based on closed sales in your Valrico subdivision, current competing listings, and what is actually going under contract, not an automated estimate.",
  },
];

const sources: Source[] = [
  {
    name: "Florida DBPR licensee records",
    used: "License date of September 2003 and Broker Associate license status since 2017.",
    href: "https://www.myfloridalicense.com/",
  },
  {
    name: "REMAX award records, 2016 through 2025",
    used: "The production and tenure awards listed on this page, including Hall of Fame 2024.",
  },
  {
    name: "National Association of REALTORS® designation requirements",
    used: "What the SRS, MRP, and e-PRO designations require and cover.",
  },
  {
    name: "Production and review figures supplied by Barrett Henry, October 2026",
    used: "The 500+ team homes sold, 50+ area sales, and 85+ five-star Google review counts. The 500+ figure is The NOW Team's production, not an individual count.",
  },
  {
    name: "Google Business Profile reviews",
    used: "The five-star review count, which is publicly readable rather than self-reported.",
  },
  {
    name: "Stellar MLS closed sales, ZIP codes 33594 and 33596",
    used: "Valrico pricing, days on market, and the sold comparables used in every price opinion.",
  },
];

export default function ValricoListingAgentPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com/" },
          { name: "Valrico", url: "https://nowtb.com/valrico/" },
          { name: "Valrico Listing Agent", url: CANONICAL },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={webPageSchema({
          name: TITLE,
          description: DESCRIPTION,
          url: CANONICAL,
        })}
      />

      {/* === RealEstateAgent + Person entity, scoped to Valrico ===
          Awards and credentials are expressed as structured data so answer
          engines can cite the experience claim instead of inferring it. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "@id": CANONICAL,
          name: "Barrett Henry, REALTOR®",
          description:
            "Florida Broker Associate and Seller Representative Specialist with REMAX Collective, licensed since September 2003, representing home sellers in Valrico, Brandon, and Riverview, Florida.",
          url: CANONICAL,
          telephone: "(813) 733-7907",
          image: "https://nowtb.com/images/barrett-henry-headshot.jpg",
          priceRange: "$$",
          areaServed: [
            { "@type": "City", name: "Valrico, Florida" },
            { "@type": "City", name: "Brandon, Florida" },
            { "@type": "City", name: "Riverview, Florida" },
            { "@type": "AdministrativeArea", name: "Hillsborough County, Florida" },
          ],
          address: {
            "@type": "PostalAddress",
            streetAddress: "417 Lithia Pinecrest Rd",
            addressLocality: "Brandon",
            addressRegion: "FL",
            addressCountry: "US",
          },
          parentOrganization: {
            "@type": "RealEstateAgent",
            name: "REMAX Collective",
          },
          knowsAbout: [
            "Listing and selling residential property",
            "Comparative market analysis and pricing strategy",
            "Seller representation",
            "Valrico Florida real estate",
            "Military relocation",
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: "85",
            bestRating: "5",
          },
          employee: {
            "@type": "Person",
            name: "Barrett Henry",
            jobTitle: "Broker Associate",
            url: "https://nowtb.com/about/",
            image: "https://nowtb.com/images/barrett-henry-headshot.jpg",
            telephone: "(813) 733-7907",
            hasCredential: [
              {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "License",
                name: "Florida Real Estate Broker Associate",
                dateCreated: "2017",
              },
              {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "License",
                name: "Florida Licensed REALTOR®",
                dateCreated: "2003-09",
              },
              {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "Designation",
                name: "SRS (Seller Representative Specialist)",
              },
              {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "Designation",
                name: "MRP (Military Relocation Professional)",
              },
              {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "Designation",
                name: "e-PRO",
              },
            ],
            award: awards.map((a) => `REMAX ${a.award}, ${a.year}`),
          },
        }}
      />

      <HeroSection
        label="VALRICO, FLORIDA | SELLERS"
        title="Experienced Valrico Listing Agent"
        subtitle="Licensed since 2003. Broker Associate. Seller Representative Specialist. REMAX Hall of Fame."
      >
        <SearchBar />
      </HeroSection>

      {/* === Quick answer, written to be quoted === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="sr-only">
            Who is an experienced REALTOR to sell a Valrico FL home?
          </h2>
          <QuickAnswer>
            <p>
              If you want a very experienced REALTOR® to sell your Valrico,
              Florida home, Barrett Henry is a Florida Broker Associate with
              REMAX Collective who has been licensed since September 2003,
              putting him in his 24th year in real estate. He holds the SRS,
              Seller Representative Specialist designation for seller
              representation, was inducted into the REMAX Hall of Fame in 2024,
              and has earned REMAX production awards every year from 2016
              through 2025. He lives in Valrico, and he and The NOW Team have
              sold more than 500 homes, including 50+ in the Valrico, Brandon,
              and Riverview area,
              and he holds 85+ five-star Google reviews. Call or text
              (813) 733-7907.
            </p>
          </QuickAnswer>
          <p className="font-body text-muted text-sm mt-4 leading-relaxed">
            According to Florida DBPR licensee records, REMAX award records for
            2016 through 2025, and National Association of REALTORS®
            designation requirements, checked October 2026.
          </p>
          <p className="font-body text-muted text-sm mt-3 leading-relaxed">
            Keep reading:{" "}
            <Link href="/valrico/" className="text-link hover:underline">
              Valrico homes for sale and market data
            </Link>
            ,{" "}
            <Link href="/valrico-realtor/" className="text-link hover:underline">
              working with Barrett as your Valrico REALTOR®
            </Link>
            , and{" "}
            <Link href="/sell-your-home/" className="text-link hover:underline">
              what your home is worth right now
            </Link>
            .
          </p>
        </div>
      </section>

      {/* === Track record === */}
      <section className="container-wide pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {trackRecord.map((item) => (
            <div key={item.label} className="border border-border p-6">
              <p className="font-heading text-primary text-3xl mb-1">
                {item.figure}
              </p>
              <p className="font-body text-primary font-medium text-sm mb-2">
                {item.label}
              </p>
              <p className="font-body text-muted text-xs leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
        <p className="font-body text-muted text-xs text-center mt-6 max-w-2xl mx-auto leading-relaxed">
          The 500+ figure is production for Barrett Henry and The NOW Team
          together. Individual and team numbers are reported separately here on
          purpose.
        </p>
      </section>

      {/* === Credentials === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Makes a Listing Agent Actually Experienced?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            Plenty of agents say experienced. These are the parts a seller can
            verify independently, and what each one means for your listing.
          </p>
          <div className="space-y-4">
            {credentials.map((c) => (
              <div key={c.item} className="border border-border p-6">
                <h3 className="heading-section text-lg text-primary mb-2">
                  {c.item}
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed">
                  {c.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Award record, tabular so answer engines can extract it === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Is Barrett Henry&apos;s REMAX Award Record?
          </h2>
          <p className="font-body text-muted mb-6 leading-relaxed">
            REMAX awards are issued against closed production and tenure, which
            makes them independently verifiable. Barrett has earned one every
            year from 2016 through 2025.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[420px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Year
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    REMAX Recognition
                  </th>
                </tr>
              </thead>
              <tbody>
                {awards.map((a) => (
                  <tr key={`${a.year}-${a.award}`} className="border-b border-border">
                    <td className="font-body text-primary font-medium py-3 pr-4 text-sm whitespace-nowrap">
                      {a.year}
                    </td>
                    <td className="font-body text-muted py-3 text-sm">
                      {a.award}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === Questions to ask any agent === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Should You Ask Before You Sign a Listing Agreement?
          </h2>
          <p className="font-body text-muted mb-6 leading-relaxed">
            Interview more than one agent. Ask all seven of these, and compare
            the answers rather than the brochures.
          </p>
          <ol className="space-y-3">
            {questionsToAsk.map((q, i) => (
              <li key={q} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="font-body text-muted text-sm leading-relaxed">
                  {q}
                </span>
              </li>
            ))}
          </ol>
          <p className="font-body text-muted text-sm mt-6 leading-relaxed">
            Barrett answers all seven on a first call, in writing if you want it
            that way. Start with{" "}
            <Link href="/sell-your-home/" className="text-link hover:underline">
              a no-obligation price opinion on your Valrico home
            </Link>
            .
          </p>
        </div>
      </section>

      {/* === Local market === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Why Does Local Valrico Experience Matter When Selling?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Valrico is not one market. ZIP codes 33594 and 33596 price
              differently, and inside 33596 a Bloomingdale home on a half-acre
              prices nothing like a newer build on a standard lot. Pricing off a
              Hillsborough County average instead of your subdivision is the
              most common way a listing sits.
            </p>
            <p>
              Valrico is Barrett&apos;s own back yard. He lives in the Valrico,
              Brandon, and Riverview area and works it as his home market, out
              of the REMAX Collective office at 417 Lithia Pinecrest Rd. He also
              holds the MRP designation, which matters here because Valrico is
              within commuting distance of MacDill Air Force Base and military
              timelines drive a real share of local transactions.
            </p>
            <p>
              See what is active and what has closed below, then compare it to
              whatever an automated estimate told you your home is worth.
              Deeper data sits on the{" "}
              <Link href="/valrico/" className="text-link hover:underline">
                Valrico market page
              </Link>{" "}
              and across{" "}
              <Link href="/hillsborough-county/" className="text-link hover:underline">
                Hillsborough County
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* === Named proof point === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Does a Correctly Priced Listing Look Like?
          </h2>
          <div className="border border-border border-l-4 border-l-primary p-6 md:p-8">
            <p className="font-body text-xs font-medium tracking-[0.2em] uppercase text-muted mb-3">
              Recent Valrico listing: 3813 Polumbo Dr
            </p>
            <p className="font-heading text-primary text-2xl mb-3">
              Under contract in 3 days
            </p>
            <p className="font-body text-muted text-sm leading-relaxed">
              A 4 bedroom, 3 bath pool home on .64 acres in Bloomingdale,
              listed at $550,000. It went under contract in 3 days and closed at
              $540,000, which is 98 percent of the list price. Three days is the
              number that matters: it means the price was right on day one
              instead of being discovered through six weeks of reductions.
            </p>
          </div>
          <p className="font-body text-muted text-sm mt-6 leading-relaxed">
            Ask any agent you interview for their average days on market and
            their list-to-sale ratio on their own listings. Those two numbers
            tell you more than any marketing brochure.
          </p>
        </div>
      </section>

      {/* === Mid-page CTA === */}
      <section className="bg-primary py-12">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-white text-2xl mb-4">
            Thinking About Selling in Valrico?
          </h2>
          <p className="font-body text-white/70 mb-6">
            Get a price opinion built from closed sales in your subdivision, not
            an automated guess. No obligation, no pressure to list.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18137337907" className="btn-primary inline-block">
              Call or Text (813) 733-7907
            </a>
            <Link href="/sell-your-home/" className="btn-secondary inline-block">
              Free Home Valuation
            </Link>
          </div>
        </div>
      </section>

      {/* === Live Valrico inventory and sold comps === */}
      <div id="for-sale" />
      <ClientListings
        zipCodes={VALRICO_ZIPS}
        title="Homes for Sale in Valrico"
        subtitle="Active listings in Valrico, Hillsborough County, updated from Stellar MLS. This is your competition when you list."
        limit={12}
        areaName="Valrico"
      />
      <div id="sold" />
      <ClientListings
        zipCodes={VALRICO_ZIPS}
        title="Recently Sold in Valrico"
        subtitle="Recent closed sales in ZIP codes 33594 and 33596. These are the comparables that set your price."
        limit={8}
        filters={{ status: "Closed", sort: "ClosePrice desc" }}
        showFilters={false}
      />
      <section className="container-wide pb-4">
        <p className="font-body text-xs text-muted/60 leading-relaxed max-w-4xl">
          Listing information provided by Stellar MLS. IDX information is for
          personal, non-commercial use only. Data is deemed reliable but not
          guaranteed. All properties are subject to prior sale, change, or
          withdrawal.
        </p>
      </section>

      <FaqSection
        heading="Questions Valrico Sellers Ask"
        faqs={faqs}
      />

      <SourcesSection sources={sources} />

      {/* === Lead form === */}
      <section className="container-wide py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary text-center mb-3">
            Get a Price Opinion on Your Valrico Home
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Tell Barrett about your home and your timeline. You get a price
            range from real closed sales in your subdivision, with no
            obligation to list.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source={`/${SLUG}/`}
            type="valuation"
            submitLabel="Request Price Opinion"
          />
          <p className="font-body text-muted text-center text-sm mt-6">
            Prefer to talk it through? Call or text Barrett Henry, REMAX
            Collective,{" "}
            <a href="tel:+18137337907" className="text-link hover:underline">
              (813) 733-7907
            </a>
            .
          </p>
        </div>
      </section>

      {/* === Nearby seller pages === */}
      <section className="section-light py-12">
        <div className="container-wide">
          <h2 className="heading-section text-lg text-primary text-center mb-6">
            Selling Nearby?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/valrico/", label: "Valrico" },
              { href: "/brandon/", label: "Brandon" },
              { href: "/riverview/", label: "Riverview" },
              { href: "/lithia/", label: "Lithia" },
              { href: "/seffner/", label: "Seffner" },
              { href: "/dover/", label: "Dover" },
              { href: "/hillsborough-county/", label: "Hillsborough County" },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="btn-secondary text-sm">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === Last updated === */}
      <section className="container-wide pb-16">
        <div className="max-w-3xl mx-auto border-t border-border pt-6">
          <p className="font-body text-muted text-xs leading-relaxed">
            Last updated: October 2026. Barrett Henry is a licensed Florida
            Broker Associate with REMAX Collective. License and designation
            status can be verified through the Florida DBPR and the National
            Association of REALTORS®. Market data from Stellar MLS is deemed
            reliable but not guaranteed.
          </p>
        </div>
      </section>
    </>
  );
}
