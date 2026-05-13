// =============================================================================
// /open-houses — Open Houses This Week
// Server component that fetches open house listings from Bridge API
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ListingGrid from "@/components/ui/ListingGrid";
import { getOpenHouses } from "@/lib/bridge";

export const dynamic = "force-dynamic";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Open Houses This Week in Tampa Bay",
  description:
    "Browse open houses happening this week across Tampa Bay. Updated daily from Stellar MLS. Barrett Henry, REALTOR® with REMAX Collective.",
  openGraph: {
    title: "Open Houses This Week in Tampa Bay | Barrett Henry, REALTOR®",
    description:
      "Find open houses in Tampa Bay this week. Walk through homes in person — no appointment needed.",
    type: "website",
  },
};

export default async function OpenHousesPage() {
  // Fetch open houses from Bridge API (server-side, ISR cached)
  const listings = await getOpenHouses();

  return (
    <>
      {/* ---- Hero Section ---- */}
      <HeroSection
        title="Open Houses This Week in Tampa Bay"
        subtitle="Walk through homes in person — updated daily from Stellar MLS"
      />

      {/* ---- Open House Listings Grid ---- */}
      {listings.length > 0 ? (
        <ListingGrid
          listings={listings}
          title="Upcoming Open Houses"
          subtitle="Browse homes with open houses scheduled in the next 7 days"
        />
      ) : (
        /* ---- No Open Houses Fallback ---- */
        <section className="container-wide py-16 text-center">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            No Open Houses Scheduled
          </h2>
          <p className="font-body text-muted text-lg max-w-2xl mx-auto mb-8">
            There are no open houses listed in Tampa Bay for the next 7 days.
            New open houses are added throughout the week — check back soon, or
            browse all available listings.
          </p>
          <Link href="/properties" className="btn-primary inline-block">
            Browse All Properties
          </Link>
        </section>
      )}

      {/* ---- Private Showing CTA ---- */}
      <section className="bg-accent/10 py-16">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Want a Private Showing?
          </h2>
          <p className="font-body text-muted text-lg mb-8">
            Can&apos;t make the open house? Barrett can schedule a private tour
            at a time that works for you — evenings and weekends included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18137337907" className="btn-primary inline-block">
              Call (813) 733-7907
            </a>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 rounded-lg border-2 border-primary text-primary font-body font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Request a Showing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
