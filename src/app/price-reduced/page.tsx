// /price-reduced — Tampa Bay Price-Reduced Homes
import type { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tampa Bay Price-Reduced Homes | Barrett Henry, REALTOR®",
  description: "Price-reduced homes in Tampa Bay — motivated sellers, recent price drops. Updated daily. Barrett Henry, REALTOR® at REMAX Collective. (813) 750-0926.",
  alternates: { canonical: "/price-reduced/" },
};
export const revalidate = 300;

export default async function PriceReducedPage() {
  let listings: Listing[] = [];
  try {
    const res = await getListings({ price_reduced: true, limit: "24", exclude_rental: true, sort: "ModificationTimestamp desc" });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://nowtb.com/" }, { name: "Price Reduced", url: "https://nowtb.com/price-reduced/" }])} />
      <HeroSection label="Tampa Bay Deals" title="Price-Reduced Homes" subtitle="Homes with recent price reductions — motivated sellers ready to negotiate. Updated daily."><SearchBar /></HeroSection>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">{listings.length > 0 ? `${listings.length}+ Price-Reduced Homes` : "Loading..."}</h2>
        <ListingGrid listings={listings} />
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Why Price Reductions Happen</h2>
        <p className="text-muted mb-6 font-body leading-relaxed">A price reduction usually means the seller overpriced initially. These homes often represent the best negotiating opportunities because the seller has already demonstrated willingness to move on price. Barrett monitors price reductions daily and can set up automatic alerts for your target neighborhoods.</p>
      </section>
      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Get Price Drop Alerts</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett can set up automatic notifications when homes drop in price in your target area. 23+ years of real estate experience.</p>
          <a href="tel:8137500926" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 750-0926</a>
        </div>
      </section>
    </>
  );
}
