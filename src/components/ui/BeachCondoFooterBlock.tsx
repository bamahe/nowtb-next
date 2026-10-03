// =============================================================================
// BeachCondoFooterBlock : the shared tail of every page in the Pinellas beach
// condo cluster: cross-links to the other six pages, links to the beach city
// pages that exist, the lead form with a page specific headline, the contact
// line, and the last updated plus sources line.
// Server component. ContactForm is the site's existing client lead form.
// =============================================================================

import Link from "next/link";
import ContactForm from "@/components/ui/ContactForm";
import {
  BEACH_CITY_LINKS,
  BEACH_CONDO_LAST_UPDATED,
  otherBeachCondoPages,
} from "@/data/beach-condo-pages";

interface BeachCondoFooterBlockProps {
  /** Slug of the current page, so it is excluded from the cross-link grid */
  currentSlug: string;
  /** Page specific CTA headline above the lead form */
  ctaHeadline: string;
  /** One or two lines of supporting copy under the CTA headline */
  ctaCopy: string;
  /** Submit button label for the lead form */
  submitLabel?: string;
  /** Sources sentence shown in the last updated line */
  sources: string;
}

export default function BeachCondoFooterBlock({
  currentSlug,
  ctaHeadline,
  ctaCopy,
  submitLabel = "Send Request",
  sources,
}: BeachCondoFooterBlockProps) {
  const related = otherBeachCondoPages(currentSlug);

  return (
    <>
      {/* === Lead form with a page specific headline === */}
      <section className="container-wide py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary text-center mb-3">
            {ctaHeadline}
          </h2>
          <p className="font-body text-muted text-center mb-8">{ctaCopy}</p>
          <ContactForm
            webhookUrl="/api/contact"
            source={`/${currentSlug}/`}
            submitLabel={submitLabel}
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

      {/* === Cross-links to the rest of the beach condo set === */}
      <section className="section-light py-16">
        <div className="container-wide">
          <h2 className="heading-section text-display-sm text-primary text-center mb-8">
            More on Buying a Pinellas Beach Condo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {related.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}/`}
                className="card p-5 hover:shadow-lg transition-shadow"
              >
                <span className="block font-heading font-bold text-sm text-primary mb-1">
                  {page.label}
                </span>
                <span className="block font-body text-muted text-xs leading-relaxed">
                  {page.blurb}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === Beach city and county pages === */}
      <section className="container-wide py-12">
        <h2 className="heading-section text-lg text-primary text-center mb-6">
          Browse Homes and Condos by Beach Town
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {BEACH_CITY_LINKS.map((city) => (
            <Link
              key={city.href}
              href={city.href}
              className="btn-secondary text-sm"
            >
              {city.label}
            </Link>
          ))}
          <Link href="/condos/" className="btn-secondary text-sm">
            All Tampa Bay Condos
          </Link>
        </div>
      </section>

      {/* === Last updated and sources === */}
      <section className="container-wide pb-16">
        <div className="max-w-3xl mx-auto border-t border-border pt-6">
          <p className="font-body text-muted text-xs leading-relaxed">
            Last updated: {BEACH_CONDO_LAST_UPDATED}. Sources: {sources} Status,
            pricing, and rules change. Verify current documents with the
            association and your lender before you write an offer. Barrett
            Henry is a licensed Florida Broker Associate with REMAX Collective,
            not an attorney, lender, engineer, or tax advisor.
          </p>
        </div>
      </section>
    </>
  );
}
