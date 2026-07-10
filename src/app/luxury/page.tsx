// =============================================================================
// /luxury — Tampa Bay Luxury Real Estate ($750K+)
// Full content page: market overview, top luxury areas, property types,
// what defines luxury, why Barrett for luxury transactions
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import ContactForm from "@/components/ui/ContactForm";
import { getListings } from "@/lib/bridge";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Luxury Homes Tampa Bay | $750K+ Estates | Barrett Henry, REALTOR®",
  description:
    "Tampa Bay luxury homes for sale starting at $750K. Waterfront estates, golf communities, and new construction. Barrett Henry, Broker Associate, REMAX Collective. (813) 733-7907.",
  alternates: {
    canonical: "/luxury/",
  },
  openGraph: {
    title: "Luxury Homes for Sale in Tampa Bay | Barrett Henry",
    description:
      "Browse luxury real estate across Tampa Bay — waterfront estates, gated communities, and premium properties from $750K. 23+ years of real estate experience.",
    type: "website",
  },
};

// Revalidate luxury listings every 5 minutes
export const revalidate = 300;

// --- Top luxury areas with descriptions and internal links ---
const luxuryAreas = [
  {
    name: "South Tampa",
    href: "/south-tampa",
    description:
      "Historic Bayshore Boulevard, walkable neighborhoods like Hyde Park and Palma Ceia, and waterfront estates with unobstructed bay views. South Tampa remains the most sought-after luxury market on the west coast of Florida.",
  },
  {
    name: "Davis Islands",
    href: "/davis-islands",
    description:
      "A private island community minutes from downtown Tampa with deep-water boat slips, mid-century modern estates, and a tight-knit neighborhood feel that draws executives and physicians.",
  },
  {
    name: "Harbour Island",
    href: "/properties",
    description:
      "Luxury condominiums and townhomes steps from the Tampa Riverwalk and Amalie Arena. Harbour Island offers a true urban luxury lifestyle with skyline views and walkable dining.",
  },
  {
    name: "Beach Park",
    href: "/properties",
    description:
      "One of South Tampa's most exclusive enclaves bordering Bayshore Boulevard. Mature oak canopies, custom-built estates, and some of the highest price-per-square-foot sales in Hillsborough County.",
  },
  {
    name: "Clearwater Beach",
    href: "/clearwater",
    description:
      "Gulf-front condominiums, beachside estates, and some of the most valuable waterfront property in Florida. Clearwater Beach consistently ranks among the top beaches in the country.",
  },
  {
    name: "Belleair",
    href: "/properties",
    description:
      "Old Florida charm meets modern luxury. The Belleair Country Club anchors this community with estate homes on oversized lots, mature landscaping, and a quiet, established atmosphere.",
  },
  {
    name: "Siesta Key",
    href: "/properties",
    description:
      "World-famous quartz-crystal sand beaches and luxury waterfront living on the Gulf of Mexico. Siesta Key attracts buyers from across the country seeking vacation homes and permanent Gulf-front residences.",
  },
  {
    name: "Longboat Key",
    href: "/properties",
    description:
      "A barrier island between Sarasota Bay and the Gulf offering exclusive gated communities, private beach clubs, and some of the most expensive real estate in the Tampa Bay region.",
  },
  {
    name: "Anna Maria Island",
    href: "/properties",
    description:
      "Old Florida beach town character with a growing luxury market. Waterfront cottages and new construction estates attract buyers looking for laid-back island living without sacrificing quality.",
  },
];

// --- Luxury property categories ---
const luxuryCategories = [
  {
    title: "Waterfront Luxury",
    description:
      "Tampa Bay's 700+ miles of coastline create one of the largest waterfront luxury markets in the Southeast. From Gulf-front estates on Longboat Key to bayfront homes along Bayshore Boulevard, waterfront properties command premium prices and offer a lifestyle built around the water. Seawall condition, flood zone classification, dock permits, and water depth for boats all factor into waterfront valuations — details that require an experienced agent to navigate.",
  },
  {
    title: "Golf Community Luxury",
    description:
      "Communities like Avila, Westchase, and the Belleair Country Club offer championship golf alongside resort-style amenities. These gated neighborhoods provide 24-hour security, fitness centers, tennis courts, and social calendars that rival private clubs. Golf community homes in Tampa Bay range from $750K villas to $5M+ custom estates on premium fairway lots.",
  },
  {
    title: "New Construction Luxury",
    description:
      "Builders like Arthur Rutenberg, Homes by WestBay, and custom local builders are delivering luxury new construction across Tampa Bay. Buyers can choose from spec homes in planned communities or fully custom builds on individual lots. New construction luxury typically includes impact-rated windows, whole-home generators, smart home automation, and energy-efficient construction — features that resale homes often lack.",
  },
];

// --- What defines luxury features ---
const luxuryFeatures = [
  {
    title: "Resort-Style Outdoor Living",
    description:
      "Heated saltwater pools, summer kitchens with built-in grills, covered lanais with retractable screens, and fire pit seating areas. Tampa Bay's year-round climate makes outdoor living space one of the most important luxury features.",
  },
  {
    title: "Smart Home Technology",
    description:
      "Whole-home automation systems controlling lighting, climate, security cameras, motorized shades, and audio. Lutron, Control4, and Savant systems are standard in new luxury construction across Tampa Bay.",
  },
  {
    title: "Impact Windows and Storm Protection",
    description:
      "Hurricane-rated impact windows and doors are a non-negotiable feature in Tampa Bay luxury homes. Beyond storm protection, they reduce insurance premiums, block UV damage, and eliminate the need for shutters.",
  },
  {
    title: "Owners Suite Retreats",
    description:
      "Luxury owners suites in Tampa Bay go beyond square footage. Expect spa-inspired bathrooms with freestanding soaking tubs, frameless glass showers, heated floors, and dual walk-in closets with custom built-ins.",
  },
];

export default async function LuxuryPage() {
  // Fetch luxury listings ($750K+)
  let listings: import("@/lib/types").Listing[] = [];
  try {
    const res = await getListings({ min_price: "750000", limit: "24", exclude_rental: true, sort: "ListPrice desc" });
    listings = res.value || [];
  } catch {
    listings = [];
  }

  return (
    <>
      {/* === BreadcrumbList + FAQPage schema === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Luxury Homes", item: "https://nowtb.com/luxury" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What price point is considered luxury in Tampa Bay?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "In Tampa Bay, luxury real estate generally starts at $750,000 and ranges well above $5 million for waterfront estates and custom-built homes in communities like South Tampa, Davis Islands, and Longboat Key.",
                },
              },
              {
                "@type": "Question",
                name: "Where are the best luxury neighborhoods in Tampa Bay?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The top luxury neighborhoods include South Tampa (Hyde Park, Beach Park, Palma Ceia), Davis Islands, Harbour Island, Clearwater Beach, Belleair, Siesta Key, Longboat Key, and Anna Maria Island.",
                },
              },
              {
                "@type": "Question",
                name: "What features define a luxury home in Tampa Bay?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Tampa Bay luxury homes typically include resort-style outdoor living with heated pools, smart home automation, impact-rated windows and doors, spa-inspired owners suite retreats, and premium finishes throughout.",
                },
              },
              {
                "@type": "Question",
                name: "Why do I need a luxury specialist to buy or sell a high-end home?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Luxury transactions involve complex negotiations, specialized marketing, discreet handling of high-net-worth clients, and knowledge of waterfront regulations, seawall inspections, and premium property valuations that general agents may not have.",
                },
              },
            ],
          }),
        }}
      />

      {/* === Hero === */}
      <HeroSection
        title="Tampa Bay Luxury Real Estate"
        label="BARRETT HENRY | REMAX COLLECTIVE"
        subtitle="Waterfront estates, gated communities, and premium properties starting at $750K across Tampa Bay's most exclusive neighborhoods."
      >
        <SearchBar />
      </HeroSection>

      {/* === Market Overview — white background === */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Tampa Bay Luxury Market</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Does the Luxury Market Look Like in Tampa Bay?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="font-body text-base text-muted font-light leading-relaxed mb-6">
              Tampa Bay's luxury real estate market includes properties priced at $750,000 and above,
              spanning waterfront estates, gated golf communities, historic renovations, and new
              construction custom builds. The region's combination of year-round warm weather, no
              state income tax, and access to Gulf beaches and bay living continues to attract
              high-net-worth buyers from the Northeast, Midwest, and international markets.
            </p>
            <p className="font-body text-base text-muted font-light leading-relaxed mb-6">
              Unlike single-market luxury cities, Tampa Bay offers diverse luxury experiences within
              a short drive. A buyer can choose between the urban sophistication of{" "}
              <Link href="/south-tampa" className="text-accent hover:underline">South Tampa</Link>,
              the island exclusivity of{" "}
              <Link href="/davis-islands" className="text-accent hover:underline">Davis Islands</Link>,
              the Gulf-front lifestyle of{" "}
              <Link href="/clearwater" className="text-accent hover:underline">Clearwater Beach</Link>,
              or the quiet elegance of barrier island communities like Longboat Key and Siesta Key —
              all within the same metropolitan area.
            </p>
            <p className="font-body text-base text-muted font-light leading-relaxed">
              Whether you are relocating from out of state, upgrading from your current home, or
              looking for an investment property in a premium location, understanding the nuances
              of each luxury submarket is essential. The right neighborhood, the right lot position,
              and the right agent make the difference between a good purchase and a great one.
            </p>
          </div>
        </div>
      </section>

      {/* === Top Luxury Areas — cream background === */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Premium Locations</p>
            <h2 className="heading-section text-display-sm text-primary">
              Where Are the Best Luxury Neighborhoods in Tampa Bay?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {luxuryAreas.map((area) => (
              <div key={area.name}>
                {/* Accent line above each area card */}
                <div className="w-8 h-[1px] bg-accent mb-6" />
                <h3 className="heading-section text-sm text-primary mb-3">
                  <Link href={area.href} className="hover:text-accent transition-colors">
                    {area.name}
                  </Link>
                </h3>
                <p className="font-body text-sm text-muted font-light leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Luxury Listings Grid === */}
      <ListingGrid
        listings={listings}
        title="Luxury Homes for Sale"
        subtitle="Active listings priced at $750,000 and above across the Tampa Bay area. Updated every 5 minutes from Stellar MLS."
      />

      {/* === Luxury Property Types — white background === */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Property Types</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Types of Luxury Properties Are Available?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {luxuryCategories.map((cat) => (
              <div key={cat.title}>
                <div className="w-8 h-[1px] bg-accent mb-6" />
                <h3 className="heading-section text-sm text-primary mb-4">
                  {cat.title}
                </h3>
                <p className="font-body text-sm text-muted font-light leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === What Defines Luxury — cream background === */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Luxury Standards</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Features Define a Luxury Home in Tampa Bay?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {luxuryFeatures.map((feat, i) => (
              <div key={feat.title} className="flex gap-6">
                {/* Step-style numbering for visual consistency */}
                <div className="flex-shrink-0">
                  <span className="font-heading text-5xl font-extralight text-accent/40 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="heading-section text-sm text-primary mb-2">
                    {feat.title}
                  </h3>
                  <p className="font-body text-sm text-muted font-light leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Why Barrett for Luxury — dark navy === */}
      <section className="section-dark">
        <div className="container-wide text-center">
          <p className="heading-label text-white/50 mb-6">Your Luxury Specialist</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white">
            Why Choose Barrett Henry for Luxury Transactions?
          </h2>
          <div className="section-divider" />
          <div className="max-w-3xl mx-auto text-left space-y-6">
            <p className="font-body text-white/70 font-light text-base leading-relaxed">
              Luxury real estate demands more than a license and a lockbox. It requires an agent who
              understands the financial complexity, the marketing sophistication, and the discretion
              that high-value transactions require. With 23+ years of real estate experience, Barrett
              Henry has closed transactions at every price point and understands what separates a
              standard sale from a luxury one.
            </p>
            <p className="font-body text-white/70 font-light text-base leading-relaxed">
              For sellers, Barrett's luxury marketing plan includes professional architectural
              photography, 3D Matterport tours, aerial drone footage, targeted digital advertising
              to qualified buyer demographics, and syndication to luxury real estate portals. Every
              listing receives a custom marketing strategy — not a template.
            </p>
            <p className="font-body text-white/70 font-light text-base leading-relaxed">
              For buyers, Barrett provides access to off-market and pre-market luxury inventory,
              coordinates private showings on your schedule, and handles complex negotiations
              involving waterfront zoning, seawall inspections, dock permits, and flood insurance
              considerations. As a Broker Associate with REMAX Collective, Barrett brings the
              resources of an international brand with the personal attention of an independent agent.
            </p>
            <p className="font-body text-white/70 font-light text-base leading-relaxed">
              Call{" "}
              <a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a>{" "}
              to schedule a private consultation or{" "}
              <Link href="/home-valuation" className="text-accent hover:underline">
                request a complimentary home valuation
              </Link>{" "}
              for your luxury property.
            </p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-secondary">
              Schedule a Consultation
            </Link>
            <Link href="/home-valuation" className="btn-primary">
              Get Your Home Value
            </Link>
          </div>
        </div>
      </section>

      {/* === FAQ Section — white background === */}
      <section className="section-white">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Common Questions</p>
            <h2 className="heading-section text-display-sm text-primary">
              Frequently Asked Questions About Tampa Bay Luxury Real Estate
            </h2>
            <div className="section-divider" />
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="heading-section text-sm text-primary mb-2">
                What price point is considered luxury in Tampa Bay?
              </h3>
              <p className="font-body text-sm text-muted font-light leading-relaxed">
                In Tampa Bay, luxury real estate generally starts at $750,000 and ranges well above
                $5 million for waterfront estates and custom-built homes in communities like South
                Tampa, Davis Islands, and Longboat Key. The threshold varies by submarket — a
                $750K home in Belleair carries different expectations than a $750K home in Lakewood Ranch.
              </p>
            </div>
            <div>
              <h3 className="heading-section text-sm text-primary mb-2">
                Where are the best luxury neighborhoods in Tampa Bay?
              </h3>
              <p className="font-body text-sm text-muted font-light leading-relaxed">
                The top luxury neighborhoods include{" "}
                <Link href="/south-tampa" className="text-accent hover:underline">South Tampa</Link>{" "}
                (Hyde Park, Beach Park, Palma Ceia),{" "}
                <Link href="/davis-islands" className="text-accent hover:underline">Davis Islands</Link>,
                Harbour Island,{" "}
                <Link href="/clearwater" className="text-accent hover:underline">Clearwater Beach</Link>,
                Belleair, Siesta Key, Longboat Key, and Anna Maria Island. Each offers a distinct
                lifestyle, from urban walkability to Gulf-front seclusion.
              </p>
            </div>
            <div>
              <h3 className="heading-section text-sm text-primary mb-2">
                What features define a luxury home in Tampa Bay?
              </h3>
              <p className="font-body text-sm text-muted font-light leading-relaxed">
                Tampa Bay luxury homes typically include resort-style outdoor living with heated pools
                and summer kitchens, smart home automation, impact-rated windows and doors, and
                spa-inspired owners suite retreats with custom closets and premium finishes. Waterfront
                properties add private docks, seawalls, and direct water access.
              </p>
            </div>
            <div>
              <h3 className="heading-section text-sm text-primary mb-2">
                Why do I need a luxury specialist to buy or sell a high-end home?
              </h3>
              <p className="font-body text-sm text-muted font-light leading-relaxed">
                Luxury transactions involve complex negotiations, specialized marketing strategies,
                discreet handling of high-net-worth clients, and deep knowledge of waterfront
                regulations, seawall inspections, dock permits, and premium property valuations.
                An experienced luxury agent like Barrett Henry protects your investment and your privacy.
                Call{" "}
                <a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a>{" "}
                to discuss your situation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === Contact Form — cream background === */}
      <section className="section-light">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="luxury"
            title="Explore Tampa Bay Luxury Living"
            submitLabel="Request a Consultation"
          />
        </div>
      </section>
    </>
  );
}
