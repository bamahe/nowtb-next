// =============================================================================
// /insurance-partners — Tampa Bay Insurance Partners Resource Directory
// Independent agencies that shop multiple carriers for homeowners, flood, auto
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import CountyGroup from "@/components/vendors/CountyGroup";
import type { Vendor } from "@/components/vendors/VendorCard";
import vendorData from "@/data/vendors/insurance.json";

export const metadata: Metadata = {
  title: "Tampa Bay Insurance Partners | Homeowners, Flood & Auto | Barrett Henry",
  description:
    "Trusted independent insurance agencies across all 8 Tampa Bay counties. Homeowners, flood, and auto coverage — agents who shop multiple carriers for the best rate. Recommended by Barrett Henry, REALTOR®.",
  alternates: { canonical: "/insurance-partners/" },
  openGraph: {
    title: "Tampa Bay Insurance Partners Directory",
    description: "Independent agencies across 8 counties that shop multiple carriers for homeowners, flood, and auto.",
    url: "/insurance-partners/",
    type: "website",
  },
};

// Fixed county display order for consistent rendering across vendor pages
const COUNTY_ORDER = [
  "Hillsborough", "Pinellas", "Pasco", "Polk",
  "Manatee", "Sarasota", "Hernando", "Citrus",
];

// Group agencies from JSON by county, maintaining the fixed display order
const agencies = vendorData.agencies as Vendor[];
const agenciesByCounty = COUNTY_ORDER.map((county) => ({
  county,
  vendors: agencies.filter((a) => a.county === county),
})).filter((group) => group.vendors.length > 0);

export default function InsurancePartnersPage() {
  return (
    <>
      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Insurance Partners", item: "https://nowtb.com/insurance-partners" },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-primary pt-32 pb-16">
        <div className="container-wide text-center">
          <p className="heading-label text-accent mb-4">Resource Directory</p>
          <h1 className="heading-display text-display md:text-display-lg text-white mb-4">
            Tampa Bay Insurance Partners
          </h1>
          <div className="section-divider" />
          <p className="font-body text-white/70 text-lg max-w-2xl mx-auto">
            Independent agencies that shop multiple carriers for homeowners, flood, and auto
            across all 8 counties The NOW Team serves. Google ratings shown are current and subject to change.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark">
          <p>
            Florida insurance is complicated — and expensive. The agencies listed below are
            independent brokers Barrett Henry has vetted and recommends to his buyers and sellers.
            They shop multiple carriers to find the best rate and coverage, and they&apos;re used to
            working on tight real estate closing timelines.
          </p>
          <p>
            <strong>Why independent?</strong> Unlike captive agents who sell one company&apos;s
            products, independent agencies compare quotes from dozens of carriers. In Florida&apos;s
            volatile insurance market, that flexibility matters — especially for homeowners,
            flood zones, and older roofs.
          </p>
        </div>
      </section>

      {/* County sections — rendered from JSON via CountyGroup + VendorCard */}
      <section className="container-wide py-8">
        {agenciesByCounty.map(({ county, vendors }) => (
          <CountyGroup key={county} county={county} vendors={vendors} />
        ))}

        {/* Disclaimer from JSON metadata */}
        <p className="font-body text-muted text-xs text-center mt-8 max-w-2xl mx-auto">
          {vendorData.meta.disclaimer}
        </p>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container-wide text-center max-w-2xl">
          <h2 className="font-heading font-bold text-2xl text-white mb-4">
            Need Help Finding the Right Insurance?
          </h2>
          <p className="font-body text-white/70 mb-6">
            Barrett Henry coordinates insurance quotes as part of every home purchase.
            Tell him your situation and he&apos;ll connect you with the right agency for your county and property type.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg text-sm"
            >
              Call (813) 733-7907
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>

      {/* Related resources */}
      <section className="container-wide py-12">
        <h2 className="font-heading font-bold text-xl text-primary mb-6 text-center">Related Resources</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <Link href="/guides/florida-flood-insurance-guide/" className="card p-4 text-center hover:shadow-lg transition-shadow">
            <p className="font-heading font-bold text-sm text-primary">Flood Insurance Guide</p>
          </Link>
          <Link href="/guides/florida-property-insurance-guide/" className="card p-4 text-center hover:shadow-lg transition-shadow">
            <p className="font-heading font-bold text-sm text-primary">Property Insurance Guide</p>
          </Link>
          <Link href="/guides/florida-homestead-exemption-save-our-homes/" className="card p-4 text-center hover:shadow-lg transition-shadow">
            <p className="font-heading font-bold text-sm text-primary">Homestead Exemption</p>
          </Link>
          <Link href="/buyers/" className="card p-4 text-center hover:shadow-lg transition-shadow">
            <p className="font-heading font-bold text-sm text-primary">Buyer Resources</p>
          </Link>
        </div>
      </section>
    </>
  );
}
