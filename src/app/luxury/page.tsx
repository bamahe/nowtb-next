// =============================================================================
// /luxury — Luxury homes landing page
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import ContactForm from "@/components/ui/ContactForm";
import { getListings } from "@/lib/bridge";
import { cities } from "@/data/cities";

export const metadata: Metadata = {
  title: "Tampa Bay Luxury Homes for Sale | Barrett Henry, REALTOR®",
  description:
    "Browse luxury homes for sale across Tampa Bay — waterfront estates, gated communities, and premium properties starting at $750K. Barrett Henry, REMAX Collective.",
};

// Revalidate luxury listings every 5 minutes
export const revalidate = 300;

export default async function LuxuryPage() {
  // Fetch luxury listings ($750K+)
  let listings: import("@/lib/types").Listing[] = [];
  try {
    const res = await getListings({ min_price: "750000", limit: "24" });
    listings = res.value || [];
  } catch {
    listings = [];
  }

  // Cities known for luxury homes
  const luxuryCities = cities.filter((c) =>
    ["tampa", "st-petersburg", "clearwater", "lakewood-ranch", "apollo-beach", "south-tampa", "westchase", "palm-harbor", "dunedin", "belleair", "longboat-key"].includes(c.slug)
  );

  return (
    <>
      {/* === Hero === */}
      <HeroSection
        title="Tampa Bay Luxury Real Estate"
        subtitle="Waterfront estates, gated communities, and premium properties across Tampa Bay."
      >
        <SearchBar />
      </HeroSection>

      {/* === Luxury listings === */}
      <ListingGrid
        listings={listings}
        title="Luxury Homes for Sale"
        subtitle="Homes priced at $750,000 and above across the Tampa Bay area."
      />

      {/* === Luxury communities === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6 text-center">
            Top Luxury Communities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {luxuryCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}-luxury-homes`}
                className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
              >
                {city.name} Luxury Homes
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === Why Barrett for luxury === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-accent">
          <h2>Why Choose Barrett Henry for Luxury Real Estate?</h2>
          <p>
            With 23+ years of real estate experience, Barrett Henry understands the
            nuances of luxury transactions — from waterfront zoning and seawall inspections
            to luxury staging and high-net-worth buyer marketing. He provides discreet,
            professional service for buyers and sellers of premium properties.
          </p>
          <p>
            Barrett&apos;s marketing plan for luxury listings includes professional photography,
            3D virtual tours, drone footage, targeted social media campaigns, and syndication
            to luxury real estate portals.
          </p>
        </div>
      </section>

      {/* === Contact === */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Explore Tampa Bay Luxury Living
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Barrett Henry can arrange private showings of luxury properties across Tampa Bay.
          </p>
          <ContactForm webhookUrl="/api/contact" source="luxury" />
        </div>
      </section>
    </>
  );
}
