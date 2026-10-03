// =============================================================================
// Gapway Lakes Estates: /auburndale/gapway-lakes-estates/
//
// Pre-development community page. 45 approved one acre estate lots on the south
// shore of Lake Juliana in Auburndale, Polk County FL. Nested under the
// Auburndale city hub, matching the /brandon/southoak/ pattern.
//
// IMPORTANT, AND THE WHOLE REASON THIS PAGE IS HAND WRITTEN:
// Nothing is for sale here yet. There is no MLS inventory, no price list, no
// builder, and no site work. So this page carries no listing grid and no price
// talk. Every forward looking statement on it is explicitly labelled an
// estimate, and every hard fact traces back to a City of Auburndale approval
// with a date on it. If a fact below ever changes, update STATUS and
// LAST_UPDATED together, and bump DATE_MODIFIED.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Ruler,
  Waves,
  TreePine,
  Fish,
  Building2,
  Clock,
  Info,
} from "lucide-react";

import HeroSection from "@/components/ui/HeroSection";
import CommunityInterestForm from "@/components/ui/CommunityInterestForm";
import GapwayLotDiagram from "@/components/ui/GapwayLotDiagram";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

// --- Constants, declared once so copy and schema can never drift apart ------
const SITE = "https://nowtb.com";
const PATH = "/auburndale/gapway-lakes-estates/";
const URL = `${SITE}${PATH}`;

const PHONE = "(813) 733-7907";
const PHONE_TEL = "+18137337907";
const EMAIL = "barrett@nowtb.com";

// Geo for the community: the north side of Gapway Rd on the south shore of
// Lake Juliana. VERIFIED against OpenStreetMap rather than estimated. Gapway Rd
// runs east to west at about 28.1122 N; Lake Juliana's south shore sits at about
// 28.1132 N, spanning -81.8120 to -81.7952. The point below is the midpoint of
// that overlap, which is where the lakefront row of lots sits.
const LAT = 28.1128;
const LNG = -81.8035;

// Shown on the page and used for schema dateModified. Keep these in step.
const LAST_UPDATED = "October 2026";
const DATE_MODIFIED = "2026-10-03";

export const metadata: Metadata = {
  // "absolute" on purpose. The root layout appends "| Barrett Henry, REALTOR®"
  // to every title via its template, which would push this one to 103 chars and
  // say "Barrett Henry" twice.
  title: {
    absolute: "Gapway Lakes Estates Auburndale FL | Lake Juliana Estate Lots | Barrett Henry",
  },
  description:
    "45 one-acre estate lots on Lake Juliana in Auburndale. Status, timeline, lot map, and early updates from local expert Barrett Henry, REMAX Collective.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Gapway Lakes Estates, Auburndale FL | 45 Estate Lots on Lake Juliana",
    description:
      "45 approved one acre estate lots on Lake Juliana in Auburndale, Polk County. Approvals, timeline, lot layout, and early updates from Barrett Henry, REMAX Collective.",
    url: PATH,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gapway Lakes Estates, Auburndale FL | 45 Estate Lots on Lake Juliana",
    description:
      "45 approved one acre estate lots on Lake Juliana in Auburndale, Polk County. Nothing released yet. Get on the update list.",
    images: ["/og-default.png"],
  },
};

// ISR, matching the rest of the site
export const revalidate = 3600; // 1 hour, matches the hourly refresh-listings cron

// --- Quick facts ------------------------------------------------------------
const QUICK_FACTS: { icon: typeof Ruler; label: string; value: string }[] = [
  { icon: Ruler, label: "Lots", value: "45 single family estate lots, 1 acre minimum" },
  { icon: Waves, label: "Lakefront", value: "25 lots directly on Lake Juliana (lots 1 to 25)" },
  { icon: TreePine, label: "Gapway Rd side", value: "20 lots with Lake Arietta views (lots 26 to 45)" },
  { icon: Building2, label: "Minimum home size", value: "2,200 sq ft" },
  { icon: MapPin, label: "Zoning", value: "Estate Residential within Auburndale's Lakes District" },
  { icon: Waves, label: "Size", value: "About 65 acres, roughly 3/4 mile of Lake Juliana frontage" },
  { icon: Building2, label: "Developer", value: "Terra Nova Land Development (lot developer, not a homebuilder)" },
  { icon: Info, label: "Utilities and access", value: "City water and sewer, single entrance off Gapway Rd, HOA plus CDD" },
];

// --- Approval timeline ------------------------------------------------------
// Each entry is a dated action by the City of Auburndale or the developer.
// "estimate" entries do not belong in this list. Put those in the next section.
const STATUS: { date: string; event: string }[] = [
  { date: "9/4/2025", event: "Developer's agreement approved by City of Auburndale" },
  { date: "10/20/2025", event: "Preliminary plat approved (45 lots)" },
  { date: "11/17/2025", event: "Development agreement assigned to Terra Nova" },
  { date: "12/18/2025", event: "Land sale closed" },
  { date: "May 2026", event: "Gapway Lakes Community Development District (CDD) approved" },
  { date: "Fall 2026", event: "Site work not yet started; timing tied to city sewer upgrades" },
];

// --- Nearby lake communities ------------------------------------------------
const NEARBY: { name: string; lake: string; note: string }[] = [
  {
    name: "Lake Juliana Estates",
    lake: "Lake Juliana",
    note: "Established gated community with a clubhouse and shared lake access, on standard subdivision lots rather than acreage.",
  },
  {
    name: "Bellaviva",
    lake: "Lake Mattie",
    note: "Newer construction on the Lake Mattie side, built at a tighter lot size with builder floor plans.",
  },
  {
    name: "Lake Mattie Preserve",
    lake: "Lake Mattie",
    note: "Small acreage enclave near the Lake Mattie shoreline, mostly custom homes on larger parcels.",
  },
  {
    name: "Summerlake Estates",
    lake: "Area lakes",
    note: "Auburndale subdivision of single family homes with lake views rather than direct lake frontage.",
  },
  {
    name: "Lake Juliana Reserve",
    lake: "Lake Juliana",
    note: "Smaller Juliana area community; frontage is limited and most homes sit back from the water.",
  },
];

// --- Drive times ------------------------------------------------------------
// Free flow estimates, meaning no traffic. I-4 at rush hour will be longer.
const DRIVE_TIMES: { place: string; minutes: number }[] = [
  { place: "Florida Polytechnic University", minutes: 12 },
  { place: "Winter Haven", minutes: 20 },
  { place: "Lakeland", minutes: 24 },
  { place: "Walt Disney World", minutes: 40 },
  { place: "Downtown Orlando", minutes: 55 },
  { place: "Downtown Tampa", minutes: 60 },
  { place: "Tampa International Airport", minutes: 70 },
];

// --- FAQs -------------------------------------------------------------------
// Single source of truth. The on-page accordion and the FAQPage JSON-LD both
// render from this array, so the schema can never say something the page does
// not. Answers lead with a direct, complete first sentence on purpose: that is
// the sentence Google AI Overviews and ChatGPT will lift.
const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is Gapway Lakes Estates?",
    answer:
      "Gapway Lakes Estates is an approved 45 lot estate community on the south shore of Lake Juliana in Auburndale, Florida. Every lot is a minimum of one acre, and homes must be at least 2,200 square feet. The community covers about 65 acres with roughly three quarters of a mile of Lake Juliana frontage. As of October 2026 it is pre-development: the plat is approved but no lots have been released for sale.",
  },
  {
    question: "Where is Gapway Lakes Estates located?",
    answer:
      "Gapway Lakes Estates sits on the north side of Gapway Road in Auburndale, Polk County, Florida 33823, between Lake Juliana to the north and Lake Arietta to the south. The single entrance is off Gapway Road. Auburndale is on the I-4 corridor between Lakeland and Winter Haven, about 24 minutes from Lakeland and 20 minutes from Winter Haven in free flowing traffic.",
  },
  {
    question: "How many lakefront lots are there?",
    answer:
      "Twenty five of the 45 lots sit directly on Lake Juliana. They are numbered 1 through 25 and occupy the shoreline row of the plat. The remaining 20 lots, numbered 26 through 45, run along the Gapway Road side with views toward Lake Arietta. A 4.8 acre retention pond interrupts the shoreline row between lots 13 and 14.",
  },
  {
    question: "Who is the developer? Who will build the homes?",
    answer:
      "Terra Nova Land Development is the lot developer. Terra Nova is not a homebuilder: the development agreement was assigned to them on November 17, 2025, and their role is to entitle and build the lots, not the houses. No builder has been announced for Gapway Lakes Estates. On estate lots like these, buyers commonly bring their own custom builder, but nothing about builder selection has been published yet.",
  },
  {
    question: "When will lots be available and when will they break ground?",
    answer:
      "There is no official release date or groundbreaking date for Gapway Lakes Estates. As of fall 2026 site work has not started, and the schedule is tied to City of Auburndale sewer infrastructure upgrades that have to be in place first. Barrett Henry's estimate, and it is an estimate rather than an announcement, is site work in late 2026 to early 2027, finished lots around late 2027, and first homes in 2028. Get on the update list to hear the moment a real date is published.",
  },
  {
    question: "How much will lots cost?",
    answer:
      "No prices have been released for Gapway Lakes Estates. The developer has not published a price list, a price range, or a release schedule, and anyone quoting a number today is guessing. Lot pricing on a project like this is usually set close to the point when finished lots are ready to sell. Join the update list and you will get the pricing the day it becomes public.",
  },
  {
    question: "Can I have a private dock?",
    answer:
      "The permitted plans for Gapway Lakes Estates do not include a community dock or boat ramp, so lakefront owners will most likely need to permit their own individual docks. Dock permitting on Lake Juliana runs through Polk County and the Southwest Florida Water Management District, and wetland buffer requirements apply along the shoreline. Confirm what is permittable on a specific lot before you buy it, because buffer width and shoreline conditions vary lot to lot.",
  },
  {
    question: "Is there an HOA or CDD?",
    answer:
      "Gapway Lakes Estates will have both an HOA and a CDD. The Gapway Lakes Community Development District was approved in May 2026. A CDD is a special taxing district that finances infrastructure such as roads, water, sewer and stormwater, and it is repaid through an annual assessment on your property tax bill in addition to regular HOA dues. Neither the HOA dues nor the CDD assessment amount has been published yet.",
  },
  {
    question: "What is the minimum home size?",
    answer:
      "The minimum home size at Gapway Lakes Estates is 2,200 square feet. Lots are a minimum of one acre and zoned Estate Residential within Auburndale's Lakes District. The Lakes District code keeps the house inside a smaller designated buildable area on each lot, so the balance of the acre stays natural with existing trees preserved.",
  },
  {
    question: "What schools serve Gapway Lakes Estates?",
    answer:
      "Gapway Lakes Estates is in the Polk County Public Schools district, but school zoning should be confirmed by address directly with Polk County Public Schools rather than taken from any website. Attendance boundaries in growing parts of Polk County get redrawn as new schools open and capacity shifts, and a community that has not been platted and addressed yet can be rezoned before the first home is occupied. Verify current zoning with the district before you make a buying decision based on schools.",
  },
];

const INTEREST_OPTIONS = [
  "Lakefront lot",
  "Arietta view lot",
  "Selling my current home",
  "Just watching",
];

export default function GapwayLakesEstatesPage() {
  return (
    <>
      {/* ===================== JSON-LD ===================== */}

      {/* WebPage: ties the page to its subject, author and last update */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": URL,
          url: URL,
          name: "Gapway Lakes Estates, Auburndale FL: Lake Juliana Estate Lots",
          description:
            "45 approved one acre estate lots on Lake Juliana in Auburndale, Polk County Florida. Approval timeline, lot layout, dock and lake access rules, and nearby lake communities.",
          inLanguage: "en-US",
          dateModified: DATE_MODIFIED,
          about: { "@id": `${URL}#place` },
          author: { "@id": `${SITE}/#barrett-henry` },
          provider: { "@id": `${SITE}/#barrett-henry` },
          isPartOf: { "@type": "WebSite", name: "nowtb.com", url: SITE },
        }}
      />

      {/* BreadcrumbList */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${SITE}/` },
          { name: "Polk County", url: `${SITE}/polk-county/` },
          { name: "Auburndale", url: `${SITE}/auburndale/` },
          { name: "Gapway Lakes Estates", url: URL },
        ])}
      />

      {/* Place: the community as a real location with verified coordinates */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Place",
          "@id": `${URL}#place`,
          name: "Gapway Lakes Estates",
          description:
            "Approved 45 lot estate community on the south shore of Lake Juliana in Auburndale, Polk County Florida. One acre minimum lots, 2,200 square foot minimum homes, Estate Residential zoning in Auburndale's Lakes District.",
          url: URL,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Gapway Rd",
            addressLocality: "Auburndale",
            addressRegion: "FL",
            postalCode: "33823",
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: LAT,
            longitude: LNG,
          },
          containedInPlace: {
            "@type": "City",
            name: "Auburndale, Florida",
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: "Polk County, Florida",
            },
          },
        }}
      />

      {/* FAQPage: generated from the same FAQS array the page renders */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />

      {/* RealEstateAgent: the author and provider referenced above */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "@id": `${SITE}/#barrett-henry`,
          name: "Barrett Henry, REALTOR®",
          jobTitle: "Broker Associate",
          description:
            "Licensed Florida Broker Associate with REMAX Collective. 23+ years of real estate experience.",
          url: SITE,
          telephone: PHONE,
          email: EMAIL,
          image: `${SITE}/images/barrett-headshot.png`,
          parentOrganization: { "@type": "RealEstateAgent", name: "REMAX Collective" },
          areaServed: [
            { "@type": "AdministrativeArea", name: "Polk County, Florida" },
            { "@type": "City", name: "Auburndale, Florida" },
          ],
          knowsAbout: [
            "Lakefront real estate",
            "Estate lots and acreage",
            "New construction",
            "Community Development Districts",
          ],
        }}
      />

      {/* ===================== Breadcrumb nav ===================== */}
      <div className="bg-white border-b border-border">
        <div className="container-wide pt-24 pb-2">
          <nav
            className="flex flex-wrap items-center gap-2 text-xs font-body text-muted tracking-wide uppercase"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/polk-county/" className="hover:text-accent transition-colors">
              Polk County
            </Link>
            <span>/</span>
            <Link href="/auburndale/" className="hover:text-accent transition-colors">
              Auburndale
            </Link>
            <span>/</span>
            <span className="text-primary font-medium" aria-current="page">
              Gapway Lakes Estates
            </span>
          </nav>
        </div>
      </div>

      {/* ===================== 1. Hero ===================== */}
      {/* bgImage is a generic Florida lake photo from the site library. It is
          NOT a photo of this site, which has never been cleared or built. */}
      <HeroSection
        label="Auburndale, Polk County, Florida"
        title="Gapway Lakes Estates: Lake Juliana Estate Lots in Auburndale, FL"
        subtitle="45 approved one acre estate lots on Lake Juliana. Platted, not yet released for sale."
        bgImage="/images/blog/auburndale-fl-waterfront-homes.jpg"
      >
        <a href="#updates" className="btn-primary">
          Get Early Updates
        </a>
      </HeroSection>

      {/* ===================== 2. Quick Facts ===================== */}
      <section className="container-wide py-12" aria-labelledby="quick-facts">
        <h2 id="quick-facts" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
          Gapway Lakes Estates Quick Facts
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          {QUICK_FACTS.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="flex gap-3 border border-border bg-white p-4"
              >
                <Icon className="h-5 w-5 flex-shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="font-body text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {f.label}
                  </dt>
                  <dd className="font-body text-sm text-dark mt-0.5">{f.value}</dd>
                </div>
              </div>
            );
          })}
        </dl>
      </section>

      {/* ===================== 3. Where It Is Today ===================== */}
      <section className="bg-light py-12" aria-labelledby="status">
        <div className="container-wide">
          <p className="font-body text-xs uppercase tracking-wide text-muted mb-2">
            Last updated: {LAST_UPDATED}
          </p>
          <h2 id="status" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            Where Gapway Lakes Estates Is Today
          </h2>
          <ol className="border-l-2 border-accent pl-6 space-y-5">
            {STATUS.map((s) => (
              <li key={s.date} className="relative">
                <span
                  className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-light"
                  aria-hidden="true"
                />
                <p className="font-body text-xs font-semibold uppercase tracking-wide text-primary">
                  {s.date}
                </p>
                <p className="font-body text-sm text-muted mt-1">{s.event}</p>
              </li>
            ))}
          </ol>
          <p className="font-body text-sm text-muted mt-6 max-w-2xl">
            Everything in that list is a dated approval or closing, not a projection.
            The project is fully entitled on paper. What it is waiting on is dirt.
          </p>
        </div>
      </section>

      {/* ===================== 4. When Will Lots Be Available ===================== */}
      <section className="container-wide py-12" aria-labelledby="availability">
        <h2 id="availability" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4">
          When Will Lots Be Available?
        </h2>
        <p className="font-body text-muted leading-relaxed mb-6 max-w-3xl">
          Nothing official has been announced. The developer has not published a lot
          release date, a groundbreaking date, or prices. The real gate on the schedule
          is City of Auburndale sewer capacity: the development agreement ties this
          project to utility upgrades that have to be in place before lots can be
          finished and sold.
        </p>

        <div className="border-l-4 border-accent bg-light p-6 max-w-3xl">
          <p className="font-body text-[11px] font-bold uppercase tracking-wider text-primary mb-3">
            Estimate, not an announcement
          </p>
          <p className="font-body text-sm text-muted mb-4">
            This is Barrett Henry&apos;s read on the timeline based on the approvals
            above and how similar Polk County lot projects have moved. It is an
            estimate. It is not a developer statement, and it will change if the sewer
            work slips.
          </p>
          <ul className="space-y-2 font-body text-sm text-dark">
            <li className="flex gap-2">
              <Clock className="h-4 w-4 flex-shrink-0 text-accent mt-0.5" aria-hidden="true" />
              <span>
                <strong>Site work:</strong> late 2026 to early 2027 (estimate)
              </span>
            </li>
            <li className="flex gap-2">
              <Clock className="h-4 w-4 flex-shrink-0 text-accent mt-0.5" aria-hidden="true" />
              <span>
                <strong>Finished lots:</strong> around late 2027 (estimate)
              </span>
            </li>
            <li className="flex gap-2">
              <Clock className="h-4 w-4 flex-shrink-0 text-accent mt-0.5" aria-hidden="true" />
              <span>
                <strong>First homes:</strong> 2028 (estimate)
              </span>
            </li>
          </ul>
          <p className="font-body text-xs text-muted mt-4">
            All three depend on the sewer infrastructure timing. Treat them as a planning
            range, not a calendar.
          </p>
        </div>

        <p className="font-body text-muted leading-relaxed mt-6 max-w-3xl">
          If you want the real dates the day they exist,{" "}
          <a href="#updates" className="text-link hover:underline font-medium">
            get on the update list
          </a>{" "}
          or call Barrett at{" "}
          <a href={`tel:${PHONE_TEL}`} className="text-link hover:underline font-medium">
            {PHONE}
          </a>
          . In the meantime you can browse{" "}
          <Link href="/auburndale-waterfront-homes/" className="text-link hover:underline">
            Auburndale waterfront homes
          </Link>{" "}
          and{" "}
          <Link href="/auburndale-land-for-sale/" className="text-link hover:underline">
            Auburndale land for sale
          </Link>{" "}
          that are actually on the market now.
        </p>
      </section>

      {/* ===================== 5. Lot Layout Explained ===================== */}
      <section className="bg-light py-12" aria-labelledby="lot-layout">
        <div className="container-wide">
          <h2 id="lot-layout" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4">
            Lot Layout Explained
          </h2>
          <p className="font-body text-muted leading-relaxed mb-2 max-w-3xl">
            The plat is two rows of lots with one internal road between them. Lake
            Juliana is the north boundary, Gapway Rd is the south boundary, and there is
            a single entrance off Gapway Rd.
          </p>

          <GapwayLotDiagram />

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
            <div className="border border-border bg-white p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                Lakefront row: lots 1 to 25
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                Twenty five lots sit directly on Lake Juliana along roughly three
                quarters of a mile of shoreline. A 4.8 acre retention pond sits on the
                shoreline between lots 13 and 14, which splits the row into two runs. The
                west end of the internal road terminates in a cul de sac.
              </p>
            </div>
            <div className="border border-border bg-white p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                Arietta view row: lots 26 to 45
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                Twenty lots run along the Gapway Rd side of the internal road, looking
                south toward Lake Arietta. These are view lots, not lake frontage: Lake
                Arietta is on the far side of Gapway Rd. The east end of the road closes
                in a loop, and about 2.3 acres is set aside as lawn open space.
              </p>
            </div>
          </div>

          <div className="mt-6 border border-border bg-white p-6 max-w-4xl">
            <h3 className="font-heading font-bold text-lg text-primary mb-2">
              Why the houses will look spaced out
            </h3>
            <p className="font-body text-sm text-muted leading-relaxed">
              Auburndale&apos;s Lakes District code does not let a house spread across a
              full acre. Each lot has a smaller designated buildable area, and the rest
              of the lot stays natural with existing trees preserved. That is what makes
              a one acre lot here feel different from a one acre lot in a conventional
              subdivision: you get the acre, but a meaningful share of it stays wooded by
              rule rather than by choice.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== 6. Docks and Lake Access ===================== */}
      <section className="container-wide py-12" aria-labelledby="docks">
        <h2 id="docks" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4">
          Docks and Lake Access
        </h2>
        <div className="max-w-3xl space-y-4 font-body text-muted leading-relaxed">
          <p>
            <strong className="text-primary">
              There is no community dock, boat ramp, clubhouse, or pool on the permitted
              plans.
            </strong>{" "}
            That is worth saying plainly, because several nearby lake communities do have
            shared amenities and buyers reasonably assume this one will too. On the plans
            as approved, it does not.
          </p>
          <p>
            Lakefront owners on lots 1 to 25 will most likely need to permit their own
            individual docks. Wetland buffers apply along the shoreline, and the width of
            that buffer and the shoreline condition vary from lot to lot, so what is
            permittable on one lot is not automatically permittable on the next. If a
            private dock is the reason you want a lakefront lot, make dock feasibility a
            condition you investigate on the specific lot before you commit to it.
          </p>
          <p>
            For boat access in the meantime, the public Lake Juliana Boat Ramp is at{" "}
            <strong className="text-primary">500 James Pl, Auburndale, FL</strong>, on the
            east side of the lake.
          </p>
        </div>
      </section>

      {/* ===================== 7. About Lake Juliana ===================== */}
      <section className="bg-light py-12" aria-labelledby="lake-juliana">
        <div className="container-wide">
          <h2 id="lake-juliana" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            About Lake Juliana
          </h2>
          <div className="grid gap-8 md:grid-cols-2 items-start">
            <div className="space-y-4 font-body text-muted leading-relaxed">
              <p>
                Lake Juliana is about 924 acres, with an average depth of roughly 12 feet
                and a maximum of about 19 feet. It fishes well for largemouth bass,
                bluegill, shellcracker, and specks (black crappie), and it is big enough
                for real boating without being one of the crowded chain lakes.
              </p>
              <p>
                On the east side, a canal connects Lake Juliana to Lake Mattie, which adds
                water to run without putting you on a different boat ramp.
              </p>
              <p>
                The thing to understand about Juliana if you are shopping it: lakefront
                homes here rarely come up for sale. Existing owners tend to stay, and
                when something does list it moves. That scarcity is the whole reason a new
                plat with 25 lakefront acre lots on this lake is worth paying attention
                to, and it is also why there is no realistic way to predict pricing on it
                yet.
              </p>
              <ul className="grid grid-cols-2 gap-3 pt-2">
                <li className="border border-border bg-white p-3">
                  <span className="block font-body text-[11px] uppercase tracking-wide text-muted">
                    Surface area
                  </span>
                  <span className="font-heading text-lg text-primary">924 acres</span>
                </li>
                <li className="border border-border bg-white p-3">
                  <span className="block font-body text-[11px] uppercase tracking-wide text-muted">
                    Average depth
                  </span>
                  <span className="font-heading text-lg text-primary">about 12 ft</span>
                </li>
                <li className="border border-border bg-white p-3">
                  <span className="block font-body text-[11px] uppercase tracking-wide text-muted">
                    Max depth
                  </span>
                  <span className="font-heading text-lg text-primary">about 19 ft</span>
                </li>
                <li className="border border-border bg-white p-3">
                  <span className="block font-body text-[11px] uppercase tracking-wide text-muted">
                    Connects to
                  </span>
                  <span className="font-heading text-lg text-primary">Lake Mattie</span>
                </li>
              </ul>
              <p className="flex items-start gap-2 font-body text-sm">
                <Fish className="h-4 w-4 flex-shrink-0 text-accent mt-0.5" aria-hidden="true" />
                <span>
                  Fishing: largemouth bass, bluegill, shellcracker, and specks.
                </span>
              </p>
            </div>

            {/* Generic Florida lake photo. Alt text says exactly that, because
                this is not a photo of Lake Juliana or of this site. */}
            <figure>
              <Image
                src="/images/blog/auburndale-fl-waterfront-homes.jpg"
                alt="Florida lakefront at sunset. Generic Florida lake photo, not a photo of Gapway Lakes Estates."
                width={1080}
                height={611}
                className="w-full h-auto border border-border"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <figcaption className="font-body text-xs text-muted mt-2">
                Representative Florida lakefront. Gapway Lakes Estates has not been
                cleared or built, so there are no site photos to show yet.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ===================== 8. Nearby Lake Communities ===================== */}
      <section className="container-wide py-12" aria-labelledby="nearby">
        <h2 id="nearby" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4">
          Nearby Lake Communities
        </h2>
        <p className="font-body text-muted leading-relaxed mb-6 max-w-3xl">
          Gapway Lakes Estates is the only new community offering one acre lots directly
          on Lake Juliana. Everything else nearby is either on a different lake, on
          smaller lots, or already built out. Here is how the neighbours compare.
        </p>
        <div className="overflow-x-auto border border-border">
          <table className="w-full border-collapse font-body text-sm min-w-[560px]">
            <caption className="sr-only">
              Lake communities near Gapway Lakes Estates in Auburndale, Florida
            </caption>
            <thead>
              <tr className="bg-primary text-white text-left">
                <th scope="col" className="p-3 font-semibold">Community</th>
                <th scope="col" className="p-3 font-semibold">Lake</th>
                <th scope="col" className="p-3 font-semibold">How it differs</th>
              </tr>
            </thead>
            <tbody>
              {NEARBY.map((n) => (
                <tr key={n.name} className="border-t border-border bg-white">
                  <th scope="row" className="p-3 text-left font-semibold text-primary align-top">
                    {n.name}
                  </th>
                  <td className="p-3 text-muted align-top whitespace-nowrap">{n.lake}</td>
                  <td className="p-3 text-muted align-top">{n.note}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-accent bg-light">
                <th scope="row" className="p-3 text-left font-semibold text-primary align-top">
                  Gapway Lakes Estates
                </th>
                <td className="p-3 text-muted align-top whitespace-nowrap">Lake Juliana</td>
                <td className="p-3 text-dark align-top">
                  The only new community with one acre lots directly on Lake Juliana. 25
                  lakefront lots, 2,200 sq ft minimum homes, no shared amenities on the
                  permitted plans.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================== 9. Drive Times ===================== */}
      <section className="bg-light py-12" aria-labelledby="drive-times">
        <div className="container-wide">
          <h2 id="drive-times" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2">
            Drive Times from Gapway Lakes Estates
          </h2>
          <p className="font-body text-sm text-muted mb-6 max-w-2xl">
            Free flow estimates, meaning no traffic. Auburndale sits on the I-4 corridor,
            so the Tampa and Orlando numbers stretch considerably at rush hour.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
            {DRIVE_TIMES.map((d) => (
              <li
                key={d.place}
                className="flex items-center justify-between gap-3 border border-border bg-white px-4 py-3"
              >
                <span className="font-body text-sm text-dark">{d.place}</span>
                <span className="font-heading text-base text-primary whitespace-nowrap">
                  {d.minutes} min
                </span>
              </li>
            ))}
          </ul>
          <p className="font-body text-sm text-muted mt-6 max-w-3xl">
            For more on the commute either direction, see the{" "}
            <Link href="/lakeland/" className="text-link hover:underline">
              Lakeland
            </Link>{" "}
            and{" "}
            <Link href="/winter-haven/" className="text-link hover:underline">
              Winter Haven
            </Link>{" "}
            area pages, or the full{" "}
            <Link href="/polk-county/" className="text-link hover:underline">
              Polk County
            </Link>{" "}
            overview.
          </p>
        </div>
      </section>

      {/* ===================== 10. Already own on Lake Juliana ===================== */}
      <section className="container-wide py-12" aria-labelledby="lake-owners">
        <div className="border border-border bg-white p-6 md:p-8 max-w-4xl">
          <h2 id="lake-owners" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4">
            Already Own a Home on Lake Juliana?
          </h2>
          <div className="space-y-4 font-body text-muted leading-relaxed">
            <p>
              A new plat with 25 lakefront acre lots changes the comp picture on this
              lake, and if you already own here it cuts both ways. Juliana lakefront
              rarely trades, which has held values up. A new supply of buildable
              lakefront is the first real test of that in years.
            </p>
            <p>
              If you have been thinking about moving up into a new build on the lake, the
              sequencing is the hard part, not the decision. Selling too early leaves you
              renting while lots are still being graded. Selling too late means carrying
              two properties. The useful move right now is simply knowing what your
              current home is worth, so you have a number to plan around when lots
              actually release.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link href="/free-home-valuation/" className="btn-primary">
              Get a Free Home Value
            </Link>
            <Link
              href="/sell-your-home-auburndale/"
              className="inline-flex items-center justify-center border border-primary px-8 py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-white"
            >
              Timing a Sale with a New Build
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== 11. FAQ ===================== */}
      <section className="bg-light py-12" aria-labelledby="faq">
        <div className="container-wide">
          <h2 id="faq" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            Gapway Lakes Estates: Frequently Asked Questions
          </h2>
          <div className="space-y-3 max-w-3xl">
            {FAQS.map((f) => (
              <details
                key={f.question}
                className="group border border-border bg-white"
              >
                <summary className="cursor-pointer list-none p-4 font-heading text-base font-bold text-primary flex items-start justify-between gap-4">
                  <h3 className="font-heading text-base font-bold text-primary">
                    {f.question}
                  </h3>
                  <span
                    className="font-body text-xl leading-none text-accent group-open:rotate-45 transition-transform"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="px-4 pb-4">
                  <p className="font-body text-sm text-muted leading-relaxed">{f.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 12. Lead form ===================== */}
      <section id="updates" className="container-wide py-12 scroll-mt-24" aria-labelledby="updates-heading">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <h2 id="updates-heading" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-3">
            Get Gapway Lakes Estates Updates
          </h2>
          <p className="font-body text-muted">
            No prices, no release date, and no builder have been announced. When any of
            that changes, the update list hears it first. Tell Barrett which side of the
            plat you care about and he will keep you posted.
          </p>
        </div>
        <CommunityInterestForm
          communityName="Gapway Lakes Estates"
          source={PATH}
          interestOptions={INTEREST_OPTIONS}
          extraTags={["Gapway Lakes Estates", "Lake Juliana", "Lot Buyer"]}
          submitLabel="Get Gapway Updates"
        />
      </section>

      {/* ===================== 13. Agent block ===================== */}
      <section className="bg-primary py-12 text-white" aria-labelledby="agent">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row gap-8 items-start max-w-4xl">
            <Image
              src="/images/barrett-headshot.png"
              alt="Barrett Henry, REALTOR® and Broker Associate at REMAX Collective"
              width={160}
              height={160}
              className="flex-shrink-0 rounded-lg"
            />
            <div>
              <h2 id="agent" className="font-heading text-2xl text-white mb-1">
                Barrett Henry
              </h2>
              <p className="font-body text-sm text-white/70 mb-4">
                Broker Associate, REMAX Collective · 23+ years of real estate experience
              </p>
              <p className="font-body text-white/80 leading-relaxed mb-6">
                I have been tracking Gapway Lakes Estates since the developer&apos;s
                agreement went through the City of Auburndale in September 2025. There is
                a lot of noise online about this project and very little of it is sourced.
                Everything on this page is either a dated approval or clearly marked as my
                estimate. If you want a straight answer about where it actually stands,
                call me.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center gap-2 bg-white px-6 py-3 font-body text-xs font-medium uppercase tracking-[0.2em] text-primary transition-colors hover:bg-accent"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {PHONE}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 border border-white/50 px-6 py-3 font-body text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-primary"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {EMAIL}
                </a>
              </div>
              <p className="font-body text-xs text-white/50 mt-4">
                FL License #BK3313308 · e-PRO | MRP | SRS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Related pages ===================== */}
      <section className="container-wide py-12" aria-labelledby="related">
        <h2 id="related" className="font-heading font-bold text-2xl text-primary mb-6">
          Keep Looking Around Polk County
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { href: "/auburndale/", label: "Auburndale Homes" },
            { href: "/polk-county/", label: "Polk County" },
            { href: "/lakeland/", label: "Lakeland Homes" },
            { href: "/winter-haven/", label: "Winter Haven Homes" },
            { href: "/waterfront/", label: "Waterfront Homes" },
            { href: "/new-construction/", label: "New Construction" },
            { href: "/land-acreage/", label: "Land and Acreage" },
            { href: "/auburndale-waterfront-homes/", label: "Auburndale Waterfront" },
            { href: "/auburndale-land-for-sale/", label: "Auburndale Land" },
            { href: "/auburndale-new-construction/", label: "Auburndale New Builds" },
            { href: "/communities/", label: "All Communities" },
            { href: "/contact/", label: "Contact Barrett" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block border border-border bg-white px-4 py-3 text-center font-body text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ===================== Disclaimer ===================== */}
      <section className="container-wide pb-12">
        <p className="font-body text-xs text-muted/70 leading-relaxed max-w-4xl border-t border-border pt-6">
          <strong className="text-muted">About this page.</strong> Gapway Lakes Estates is
          in pre-development. Lot counts, lot lines, dimensions, zoning conditions,
          amenities, HOA and CDD assessments, and schedules are subject to change until
          the final plat is recorded and the developer publishes terms. Dated items above
          reference City of Auburndale and Polk County public records; forward looking
          items are clearly labelled as estimates by Barrett Henry and are not developer
          statements. No lots are offered for sale on this page and no prices have been
          released. Barrett Henry does not represent the developer. Verify school zoning
          with Polk County Public Schools and dock feasibility with Polk County and the
          Southwest Florida Water Management District before relying on either. Last
          updated {LAST_UPDATED}.
        </p>
      </section>
    </>
  );
}
