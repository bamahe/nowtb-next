// =============================================================================
// MiscCatchAllPage — Generic page for miscellaneous/uncategorized pages
// Rendered inside [citySlug] route for slugs that match misc-pages.ts
// These are placeholder pages that will be replaced with WP content exports.
// =============================================================================

import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ContactForm from "@/components/ui/ContactForm";
import type { MiscPageData } from "@/data/misc-pages";
import { getPageContent } from "@/lib/page-content";
import { cleanWpContent } from "@/lib/utils";

interface MiscCatchAllPageProps {
  page: MiscPageData;
}

export default async function MiscCatchAllPage({ page }: MiscCatchAllPageProps) {
  // Try to load real WordPress content for this page slug.
  // getPageContent reads pages-content.json at build/request time (server only).
  const rawWpContent = getPageContent(page.slug);
  // Clean WP artifacts: strip shortcodes, fix image URLs
  const pageContent = rawWpContent ? cleanWpContent(rawWpContent) : null;

  return (
    <>
      {/* === Hero === */}
      <HeroSection title={page.title} subtitle={page.excerpt}>
        <SearchBar />
      </HeroSection>

      {/* === Content === */}
      <section className="container-wide py-12">
        {pageContent ? (
          // Real WordPress content found — render it with blog styling
          <div
            className="blog-content prose prose-lg max-w-none font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-link"
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />
        ) : (
          // No WP content yet — show a minimal fallback with contact info
          <div className="prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-link">
            <p>
              {page.excerpt} Barrett Henry, Broker Associate at REMAX Collective,
              brings 23+ years of real estate experience to help you with every
              step of your real estate journey.
            </p>
            <p>
              Contact Barrett directly at{" "}
              <a href="tel:+18137337907">(813) 733-7907</a> or{" "}
              <a href="mailto:barrett@nowtb.com">barrett@nowtb.com</a> for
              personalized assistance.
            </p>
          </div>
        )}
      </section>

      {/* === Quick links === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide">
          <h2 className="font-heading font-bold text-2xl text-primary mb-6 text-center">
            Helpful Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link href="/buyers" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <span className="font-heading font-bold text-primary">Buyer Resources</span>
            </Link>
            <Link href="/sellers" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <span className="font-heading font-bold text-primary">Seller Resources</span>
            </Link>
            <Link href="/guides" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <span className="font-heading font-bold text-primary">All Guides</span>
            </Link>
            <Link href="/properties" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <span className="font-heading font-bold text-primary">Search Listings</span>
            </Link>
            <Link href="/contact" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <span className="font-heading font-bold text-primary">Contact Barrett</span>
            </Link>
            <Link href="/about" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <span className="font-heading font-bold text-primary">About Barrett</span>
            </Link>
          </div>
        </div>
      </section>

      {/* === Contact form === */}
      <section className="py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Questions? Barrett Can Help.
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Reach out for expert real estate guidance in Tampa Bay.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source={`misc-${page.slug}`}
          />
        </div>
      </section>
    </>
  );
}
