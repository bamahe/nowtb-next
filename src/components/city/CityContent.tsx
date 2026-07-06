// =============================================================================
// CityContent — "About {City}" content section
// Server component. Tries to load REAL WordPress content first. If none found,
// falls back to auto-generated placeholder paragraphs.
// Includes Barrett's phone number and a CTA.
// =============================================================================

import Image from "next/image";
import type { CityData } from "@/data/cities";
import type { SPOKE_TOPICS } from "@/data/cities";
import { getPageContent } from "@/lib/page-content";
import { cleanWpContent } from "@/lib/utils";

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

  // Clean WordPress artifacts: strip shortcodes, fix image URLs
  const cleanContent = wpContent ? cleanWpContent(wpContent) : null;

  return (
    <section className="container-wide py-12">
      {/* First-person intro — demonstrates EEAT first-hand experience */}
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <Image
          src="/images/barrett-headshot.png"
          alt="Barrett Henry, REALTOR® and Broker Associate at REMAX Collective"
          width={160}
          height={160}
          className="rounded-lg flex-shrink-0"
        />
        <div className="prose prose-lg max-w-none text-muted font-body">
          <p>
            {topic ? (
              <>
                I&apos;ve helped dozens of families find {topic.label.toLowerCase()} in{" "}
                <strong>{city.name}</strong>. Here&apos;s what I tell every client: start with
                the neighborhoods, understand the pricing trends, and always get a local
                expert who knows the <strong>{city.county} County</strong> market inside and out.
                My name is <strong>Barrett Henry</strong>, and I&apos;m a licensed Broker Associate
                with <strong>REMAX Collective</strong>. Call me at{" "}
                <strong><a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a></strong>{" "}
                and I&apos;ll walk you through every option.
              </>
            ) : (
              <>
                I&apos;ve helped dozens of families buy and sell in <strong>{city.name}</strong>.
                Here&apos;s what I tell every client: know the neighborhoods, understand the
                pricing, and work with someone who knows <strong>{city.county} County</strong>{" "}
                inside and out. My name is <strong>Barrett Henry</strong>, and I&apos;m a licensed
                Broker Associate with <strong>REMAX Collective</strong> with 23+ years of real
                estate experience. Call me at{" "}
                <strong><a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a></strong>{" "}
                — I&apos;d love to help you find your next home.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Section heading */}
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
        {topic
          ? `${topic.label} in ${city.name}, Florida`
          : `About ${city.name}, Florida`}
      </h2>

      {cleanContent ? (
        // ---- REAL WordPress content found — render it (shortcodes stripped) ----
        <div
          className="blog-content prose prose-lg max-w-none text-muted font-body"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
      ) : (
        // ---- No WP content — fall back to generated placeholder ----
        <div className="prose prose-lg max-w-none text-muted font-body space-y-4">
          {topic ? (
            // ---- Spoke page placeholder: focused on the specific topic ----
            <>
              <p>
                Looking for <strong>{topic.label.toLowerCase()}</strong> in{" "}
                <strong>{city.name}</strong>? You are in
                the right place. {city.name} is located in <strong>{city.county} County</strong>,
                Florida, and covers ZIP codes {zipList}. {city.tagline}.
              </p>
              <p>
                I bring 23+ years of real estate experience to every transaction.
                Whether you are searching for {topic.label.toLowerCase()} or exploring other
                options in {city.name}, I provide expert guidance from
                first showing to closing day. We will review comparable sales,
                negotiate the best terms, and make sure your interests are protected.
              </p>
              <p>
                Call{" "}
                <a
                  href="tel:+18137337907"
                  className="text-accent font-semibold hover:underline"
                >
                  <strong>(813) 733-7907</strong>
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
                <strong>{city.name}</strong> is a sought-after community in{" "}
                <strong>{city.county} County</strong>,
                Florida, spanning ZIP codes {zipList}. {city.tagline}. From
                first-time buyers to seasoned investors, {city.name} offers
                something for everyone.
              </p>
              <p>
                I bring 23+ years of real estate experience to every
                transaction. As a local market expert, I help buyers and
                sellers in {city.name} navigate pricing, negotiations, and
                inspections with confidence. My goal is to make your home search
                straightforward — we will find the right fit and close on your terms.
              </p>
              <p>
                Ready to explore homes in {city.name}? Call{" "}
                <a
                  href="tel:+18137337907"
                  className="text-accent font-semibold hover:underline"
                >
                  <strong>(813) 733-7907</strong>
                </a>{" "}
                or use the contact form to get started. I&apos;ll send
                you a curated list of {city.name} properties that match your
                criteria.
              </p>
            </>
          )}
        </div>
      )}

      {/* Outbound links — authoritative external resources for SEO credibility */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-heading font-bold text-lg text-primary mb-3">
          Helpful Resources for {city.name} Home Buyers
        </h3>
        <ul className="space-y-2 font-body text-sm text-muted">
          <li>
            <a
              href="https://www.hillsboroughschools.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Hillsborough County Public Schools
            </a>{" "}
            — School zones, ratings, and enrollment info
          </li>
          <li>
            <a
              href="https://www.myfloridalicense.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Florida DBPR License Verification
            </a>{" "}
            — Verify any Florida real estate license
          </li>
          <li>
            <a
              href="https://msc.fema.gov/portal/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              FEMA Flood Map Service Center
            </a>{" "}
            — Check flood zones before you buy
          </li>
        </ul>
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
