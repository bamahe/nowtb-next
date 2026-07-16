// =============================================================================
// /preferred-vendors — Tampa Bay Preferred Vendors
// Insurance, home inspectors, and mortgage lenders across 8 counties
// Data-driven from src/data/vendors/ JSON files
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Home, ChevronRight } from "lucide-react";

import VendorCard, { type Vendor } from "@/components/vendors/VendorCard";
import CountyGroup from "@/components/vendors/CountyGroup";

// --- Import vendor JSON data ---
import insuranceData from "@/data/vendors/insurance.json";
import inspectorsData from "@/data/vendors/inspectors.json";
import lendersData from "@/data/vendors/lenders.json";

// --- Constants ---
const SITE_URL = "https://nowtb.com";
const PHONE = "(813) 733-7907";

// County display order — matches the 8-county service area
const COUNTY_ORDER = [
  "Hillsborough",
  "Pinellas",
  "Pasco",
  "Polk",
  "Manatee",
  "Sarasota",
  "Hernando",
  "Citrus",
];

// --- SEO metadata ---
export const metadata: Metadata = {
  title: "Tampa Bay Preferred Vendors | Insurance, Inspectors & Lenders",
  description:
    "Trusted insurance agencies, home inspectors, and mortgage lenders across 8 Tampa Bay counties. Hand-picked by Barrett Henry, REALTOR® with REMAX Collective. Call (813) 733-7907.",
  alternates: { canonical: "/preferred-vendors/" },
  openGraph: {
    title: "Tampa Bay Preferred Vendors | Insurance, Inspectors & Lenders",
    description:
      "Insurance, home inspection, and mortgage pros Barrett Henry trusts across Tampa Bay. All 8 counties covered.",
    url: "/preferred-vendors/",
    type: "website",
  },
};

// --- Helpers ---

/** Group vendors by county in the standard county display order */
function groupByCounty(vendors: Vendor[]): { county: string; vendors: Vendor[] }[] {
  return COUNTY_ORDER.map((county) => ({
    county,
    vendors: vendors.filter((v) => v.county === county),
  })).filter((group) => group.vendors.length > 0);
}

/** Pull out preferred vendors (ones with preferred: true) */
function getPreferred(vendors: Vendor[]): Vendor[] {
  return vendors.filter((v) => v.preferred);
}

/** Pull out non-preferred vendors */
function getNonPreferred(vendors: Vendor[]): Vendor[] {
  return vendors.filter((v) => !v.preferred);
}

// --- JSON-LD Schemas ---

/** BreadcrumbList schema */
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Preferred Vendors", item: `${SITE_URL}/preferred-vendors` },
  ],
};

/** ItemList schema for a vendor section */
function itemListSchema(sectionName: string, vendors: Vendor[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: sectionName,
    numberOfItems: vendors.length,
    itemListElement: vendors.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: v.name,
        address: {
          "@type": "PostalAddress",
          addressLocality: v.city,
          addressRegion: "FL",
          addressCountry: "US",
        },
        ...(v.phone ? { telephone: v.phone } : {}),
        ...(v.google_rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: v.google_rating, reviewCount: v.google_review_count } } : {}),
        ...(v.google_maps_url ? { url: v.google_maps_url } : {}),
      },
    })),
  };
}

/** FAQPage schema — 5 Q&As about the vendor page */
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does Barrett Henry receive compensation from these vendors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. These vendors are listed as a convenience for buyers and sellers in the Tampa Bay area. Barrett Henry and The NOW Team do not receive compensation, referral fees, or kickbacks from any vendor on this page.",
      },
    },
    {
      "@type": "Question",
      name: "How were these vendors selected?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vendors were selected based on strong Google review ratings, coverage across the 8-county Tampa Bay service area, and a track record of responsive, professional service. A small number are personally recommended by Barrett Henry based on direct working experience.",
      },
    },
    {
      "@type": "Question",
      name: "Do I have to use a vendor from this list?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely not. You are free to choose any insurance agency, home inspector, or mortgage lender you prefer. This list is provided as a starting point to help you find reputable professionals in the Tampa Bay area.",
      },
    },
    {
      "@type": "Question",
      name: "What counties do these vendors cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The vendors on this page are organized by the 8 counties in Barrett Henry's Tampa Bay service area: Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota, Hernando, and Citrus.",
      },
    },
    {
      "@type": "Question",
      name: "Can Barrett help me coordinate with these vendors during my transaction?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Barrett Henry and The NOW Team regularly coordinate with insurance agents, inspectors, and lenders to keep your transaction on track. Call (813) 733-7907 or visit the contact page to get started.",
      },
    },
  ],
};

// --- Section nav anchors ---
const SECTIONS = [
  { id: "insurance", label: "Insurance" },
  { id: "inspectors", label: "Home Inspectors" },
  { id: "lenders", label: "Mortgage Lenders" },
];

// =============================================================================
// Page Component
// =============================================================================

export default function PreferredVendorsPage() {
  // Cast JSON imports to typed arrays
  const insurance = insuranceData.agencies as Vendor[];
  const inspectors = inspectorsData.inspectors as Vendor[];
  const lenders = lendersData.lenders as Vendor[];

  // Split preferred vs. county-grouped for lenders (only lenders have preferred in the data)
  const preferredLenders = getPreferred(lenders);
  const lendersByCounty = groupByCounty(getNonPreferred(lenders));

  // Insurance and inspectors have no preferred flag — group all by county
  const insuranceByCounty = groupByCounty(insurance);
  const inspectorsByCounty = groupByCounty(inspectors);

  return (
    <>
      {/* ── JSON-LD Schemas ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema("Tampa Bay Insurance Agencies", insurance)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema("Tampa Bay Home Inspectors", inspectors)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema("Tampa Bay Mortgage Lenders", lenders)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* ── Breadcrumb nav ── */}
      <nav
        aria-label="Breadcrumb"
        className="w-full bg-white border-b border-border"
      >
        <div className="container-wide py-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-primary transition-colors" aria-label="Home">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-3 h-3 text-border" />
          <span className="font-semibold text-primary" aria-current="page">
            Preferred Vendors
          </span>
        </div>
      </nav>

      {/* ── Hero Section — navy background ── */}
      <section className="bg-primary text-white py-20 md:py-28">
        <div className="container-wide text-center">
          <p className="heading-label mb-4">Tampa Bay Resources</p>
          <h1 className="font-heading text-display-sm md:text-display font-extralight tracking-wide mb-6">
            Tampa Bay Preferred Vendors
          </h1>
          <p className="max-w-2xl mx-auto text-white/70 text-base md:text-lg leading-relaxed mb-4">
            Buying a home involves more than finding the right property. You need solid
            insurance coverage before closing, a thorough inspection to understand what
            you are buying, and a lender who communicates clearly and closes on time.
          </p>
          <p className="max-w-2xl mx-auto text-white/70 text-base md:text-lg leading-relaxed">
            The professionals below serve the Tampa Bay area across all 8 counties Barrett
            Henry and The NOW Team cover. A few are personally recommended based on direct
            experience. The rest are highly rated local businesses selected for their strong
            reviews and track record. You are always free to choose any provider you prefer.
          </p>
        </div>
      </section>

      {/* ── Sticky Section Nav ── */}
      <nav
        aria-label="Page sections"
        className="sticky top-0 z-30 bg-white border-b border-border shadow-sm"
      >
        <div className="container-wide flex items-center justify-center gap-6 md:gap-10 py-3">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs md:text-sm font-body font-semibold tracking-[0.1em] uppercase text-muted hover:text-primary transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
         SECTION 1: Insurance
         ══════════════════════════════════════════════════════════════════════ */}
      <section id="insurance" className="scroll-mt-16 py-16 md:py-20">
        <div className="container-wide">
          <h2 className="font-heading text-display-sm font-light tracking-wide text-primary mb-2">
            Insurance Agencies
          </h2>
          <p className="text-muted text-sm md:text-base mb-8 max-w-3xl">
            Independent agencies that shop multiple carriers for homeowners, flood,
            and auto coverage. Organized by county so you can find someone local.
          </p>

          {/* County groups */}
          {insuranceByCounty.map((group) => (
            <CountyGroup
              key={group.county}
              county={group.county}
              vendors={group.vendors}
            />
          ))}

          {/* Disclaimer */}
          <p className="text-xs text-muted italic mt-6 border-t border-border pt-4">
            {insuranceData.meta.disclaimer}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
         SECTION 2: Home Inspectors
         ══════════════════════════════════════════════════════════════════════ */}
      <section id="inspectors" className="scroll-mt-16 py-16 md:py-20 bg-white">
        <div className="container-wide">
          <h2 className="font-heading text-display-sm font-light tracking-wide text-primary mb-2">
            Home Inspectors
          </h2>
          <p className="text-muted text-sm md:text-base mb-8 max-w-3xl">
            Licensed inspectors offering full home inspections, 4-point, wind
            mitigation, WDO (termite), and more. A good inspection protects you
            before you close.
          </p>

          {/* County groups */}
          {inspectorsByCounty.map((group) => (
            <CountyGroup
              key={group.county}
              county={group.county}
              vendors={group.vendors}
            />
          ))}

          {/* Disclaimer */}
          <p className="text-xs text-muted italic mt-6 border-t border-border pt-4">
            {inspectorsData.meta.disclaimer}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
         SECTION 3: Mortgage Lenders
         ══════════════════════════════════════════════════════════════════════ */}
      <section id="lenders" className="scroll-mt-16 py-16 md:py-20">
        <div className="container-wide">
          <h2 className="font-heading text-display-sm font-light tracking-wide text-primary mb-2">
            Mortgage Lenders
          </h2>
          <p className="text-muted text-sm md:text-base mb-8 max-w-3xl">
            Mortgage brokers and loan officers who close on time and communicate
            clearly. Compare rates, fees, and terms — and verify licensing at{" "}
            <a
              href="https://nmlsconsumeraccess.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:underline"
            >
              nmlsconsumeraccess.org
            </a>
            .
          </p>

          {/* Preferred lenders — Barrett Recommends, shown first */}
          {preferredLenders.length > 0 && (
            <div className="mb-10">
              <h3 className="font-body text-xs font-medium tracking-[0.2em] uppercase text-accent mb-4">
                Barrett&apos;s Picks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {preferredLenders.map((vendor) => (
                  <VendorCard key={vendor.name} vendor={vendor} />
                ))}
              </div>
            </div>
          )}

          {/* County groups */}
          {lendersByCounty.map((group) => (
            <CountyGroup
              key={group.county}
              county={group.county}
              vendors={group.vendors}
            />
          ))}

          {/* Disclaimer */}
          <p className="text-xs text-muted italic mt-6 border-t border-border pt-4">
            {lendersData.meta.disclaimer}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
         FAQ Section
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading text-display-sm font-light tracking-wide text-primary mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {(faqLd.mainEntity as { name: string; acceptedAnswer: { text: string } }[]).map((faq) => (
              <details
                key={faq.name}
                className="group border border-border rounded-xl p-5 bg-light open:shadow-sm transition-shadow"
              >
                <summary className="cursor-pointer font-heading text-base font-semibold text-primary list-none flex items-start justify-between gap-4">
                  {faq.name}
                  <ChevronRight className="w-4 h-4 mt-1 text-muted group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-dark/80 leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
         Contact CTA
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container-wide text-center">
          <div className="section-divider" />
          <h2 className="font-heading text-display-sm font-extralight tracking-wide mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Barrett Henry and The NOW Team work with these professionals every day.
            Call for a quick recommendation based on your county, property type, and
            timeline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:+18137337907`}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {PHONE}
            </a>
            <Link href="/contact" className="btn-secondary">
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
