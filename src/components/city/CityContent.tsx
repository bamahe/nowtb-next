// =============================================================================
// CityContent — "About {City}" content section
// Server component. Tries to load REAL WordPress content first. If none found,
// falls back to auto-generated placeholder paragraphs.
// Includes Barrett's phone number and a CTA.
// =============================================================================

import Link from "next/link";
import type { CityData } from "@/data/cities";
import type { SPOKE_TOPICS } from "@/data/cities";
import { getPageContent } from "@/lib/page-content";

interface CityContentProps {
  /** The city to generate content about */
  city: CityData;
  /** If set, tailor the content to this specific topic (spoke page) */
  topic?: (typeof SPOKE_TOPICS)[number];
}

export default function CityContent({ city, topic }: CityContentProps) {
  // Build the slug to look up: hub = "valrico", spoke = "valrico-homes-for-sale"
  const pageSlug = topic ? `${city.slug}-${topic.slug}` : city.slug;

  // Try to load real WordPress content for this page
  const wpContent = getPageContent(pageSlug);

  // Format zip codes as a readable list (used in placeholder fallback)
  const zipList = formatZipList(city.zip_codes);

  return (
    <section className="container-wide py-12">
      {/* Section heading */}
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
        {topic
          ? `${topic.label} in ${city.name}, Florida`
          : `About ${city.name}, Florida`}
      </h2>

      {wpContent ? (
        // ---- REAL WordPress content found — render it as-is ----
        <div
          className="blog-content prose prose-lg max-w-none text-muted font-body"
          dangerouslySetInnerHTML={{ __html: wpContent }}
        />
      ) : (
        // ---- No WP content — fall back to generated placeholder ----
        <div className="prose prose-lg max-w-none text-muted font-body space-y-4">
          {topic ? (
            // ---- Spoke page placeholder: focused on the specific topic ----
            <>
              <p>
                Looking for {topic.label.toLowerCase()} in {city.name}? You are in
                the right place. {city.name} is located in {city.county} County,
                Florida, and covers ZIP codes {zipList}. {city.tagline}.
              </p>
              <p>
                Barrett Henry is a licensed Broker Associate with REMAX Collective
                and has 23+ years of real estate experience. Whether you are
                searching for {topic.label.toLowerCase()} or exploring other
                options in {city.name}, Barrett provides expert guidance from
                first showing to closing day.
              </p>
              <p>
                Call{" "}
                <a
                  href="tel:+18137337907"
                  className="text-accent font-semibold hover:underline"
                >
                  (813) 733-7907
                </a>{" "}
                to schedule a showing or get a personalized list of{" "}
                {topic.label.toLowerCase()} in {city.name} delivered straight to
                your inbox.
              </p>
            </>
          ) : (
            // ---- Hub page placeholder: general city overview ----
            <>
              <p>
                {city.name} is a sought-after community in {city.county} County,
                Florida, spanning ZIP codes {zipList}. {city.tagline}. From
                first-time buyers to seasoned investors, {city.name} offers
                something for everyone.
              </p>
              <p>
                Barrett Henry is a licensed Broker Associate with REMAX Collective
                and brings 23+ years of real estate experience to every
                transaction. As a local market expert, Barrett helps buyers and
                sellers in {city.name} navigate pricing, negotiations, and
                inspections with confidence.
              </p>
              <p>
                Ready to explore homes in {city.name}? Call{" "}
                <a
                  href="tel:+18137337907"
                  className="text-accent font-semibold hover:underline"
                >
                  (813) 733-7907
                </a>{" "}
                or use the contact form below to get started. Barrett will send
                you a curated list of {city.name} properties that match your
                criteria.
              </p>
            </>
          )}
        </div>
      )}

      {/* CTA button */}
      <div className="mt-8">
        <Link
          href="/contact"
          className="btn-primary inline-block px-8 py-3 text-base"
        >
          Contact Barrett About {city.name} Homes
        </Link>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Helper: format a list of ZIP codes into a readable string
// ["33594", "33596"] -> "33594 and 33596"
// ["33510", "33511", "33512"] -> "33510, 33511, and 33512"
// -----------------------------------------------------------------------------
function formatZipList(zips: string[]): string {
  if (zips.length === 0) return "";
  if (zips.length === 1) return zips[0];
  if (zips.length === 2) return `${zips[0]} and ${zips[1]}`;
  // 3+ zips: use Oxford comma
  return `${zips.slice(0, -1).join(", ")}, and ${zips[zips.length - 1]}`;
}
