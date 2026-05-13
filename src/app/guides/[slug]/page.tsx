// =============================================================================
// /guides/[slug] — Individual guide page
// Long-form article layout with table of contents sidebar, content sections,
// inline CTAs, and related guides. (51 guide pages from nowtb.com)
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ui/ContactForm";
import { getPrimaryAgent } from "@/data/agents";
import {
  guides,
  getGuideBySlug,
  getRelatedGuides,
  type GuideData,
} from "@/data/guides";
import { getGuideContent } from "@/lib/guides-loader";

/** Format date string */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// --- generateStaticParams — pre-render all known guides at build ---
export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

// --- Dynamic SEO metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: `${guide.title} | Barrett Henry, REALTOR®`,
    description: guide.excerpt,
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      type: "article",
      publishedTime: guide.date,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  // 404 if the slug doesn't match any guide
  if (!guide) notFound();

  const agent = getPrimaryAgent();

  // Get related guides (same category, excluding current)
  const relatedGuides = getRelatedGuides(guide.slug, 3);

  // Check for real WordPress content (falls back to placeholder sections)
  const wpContent = getGuideContent(guide.slug);

  return (
    <>
      {/* --- JSON-LD Article structured data --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.excerpt,
            datePublished: guide.date,
            author: {
              "@type": "Person",
              name: agent.name,
              url: "https://nowtb.com/about",
            },
            publisher: {
              "@type": "Organization",
              name: "Barrett Henry, REALTOR\u00AE",
              url: "https://nowtb.com",
            },
          }),
        }}
      />

      {/* === Article header === */}
      <section className="bg-primary py-16">
        <div className="container-wide max-w-3xl text-center">
          {/* Category badge */}
          <span className="inline-block px-4 py-1 rounded-full text-xs font-body font-semibold bg-accent/20 text-accent mb-4">
            {guide.category} Guide
          </span>

          {/* Title */}
          <h1 className="heading-display text-display md:text-display-lg text-white mb-4">
            {guide.title}
          </h1>

          {/* Date + reading time */}
          <div className="flex items-center justify-center gap-3 text-sm font-body text-accent">
            <time dateTime={guide.date}>{formatDate(guide.date)}</time>
            <span className="w-1 h-1 rounded-full bg-accent/50" />
            <span>{guide.readingTime}</span>
          </div>
        </div>
      </section>

      {/* === Guide body === */}
      {wpContent ? (
        /* --- Real WordPress content (full HTML from WP post_content) --- */
        <section className="container-wide py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar with quick contact */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="card p-5 bg-primary/5">
                  <h3 className="font-heading font-bold text-sm text-primary mb-2">
                    Need Personal Guidance?
                  </h3>
                  <p className="font-body text-muted text-xs mb-3">
                    Barrett Henry has 23+ years of real estate experience. Call or
                    text anytime.
                  </p>
                  <a
                    href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
                    className="btn-primary inline-block px-4 py-2 text-xs text-center w-full"
                  >
                    {agent.phone}
                  </a>
                </div>
              </div>
            </aside>

            {/* Main content — real WP HTML */}
            <article className="lg:col-span-3 order-1 lg:order-2">
              <div
                className="blog-content prose prose-lg font-body text-dark max-w-none
                  prose-headings:font-heading prose-headings:text-primary
                  prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                  prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: wpContent }}
              />

              {/* Back to guides link */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors text-sm font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  All Guides
                </Link>
              </div>
            </article>
          </div>
        </section>
      ) : (
        /* --- Fallback: placeholder section-based rendering --- */
        <section className="container-wide py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Table of contents sidebar (sticky on desktop) */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                <nav className="card p-5">
                  <h3 className="font-heading font-bold text-sm text-primary mb-3 uppercase tracking-wide">
                    Table of Contents
                  </h3>
                  <ul className="space-y-2">
                    {guide.sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="font-body text-sm text-muted hover:text-accent transition-colors block py-1"
                        >
                          {section.heading}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="card p-5 bg-primary/5">
                  <h3 className="font-heading font-bold text-sm text-primary mb-2">
                    Need Personal Guidance?
                  </h3>
                  <p className="font-body text-muted text-xs mb-3">
                    Barrett Henry has 23+ years of real estate experience. Call or
                    text anytime.
                  </p>
                  <a
                    href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
                    className="btn-primary inline-block px-4 py-2 text-xs text-center w-full"
                  >
                    {agent.phone}
                  </a>
                </div>
              </div>
            </aside>

            {/* Main guide content — placeholder sections */}
            <article className="lg:col-span-3 order-1 lg:order-2">
              {guide.sections.map((section, index) => (
                <div key={section.id} id={section.id} className="mb-12">
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4">
                    {section.heading}
                  </h2>
                  <div
                    className="prose prose-lg font-body text-dark max-w-none
                      prose-headings:font-heading prose-headings:text-primary
                      prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                      prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                  {index > 0 && index % 2 === 1 && index < guide.sections.length - 1 && (
                    <div className="my-8 p-6 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="font-heading font-bold text-lg text-primary mb-2">
                        Want Barrett&apos;s help with this step?
                      </p>
                      <p className="font-body text-muted text-sm mb-3">
                        Call{" "}
                        <a
                          href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
                          className="text-accent font-semibold hover:underline"
                        >
                          {agent.phone}
                        </a>{" "}
                        or{" "}
                        <a
                          href={`mailto:${agent.email}`}
                          className="text-accent font-semibold hover:underline"
                        >
                          email Barrett
                        </a>{" "}
                        to get started.
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-8 pt-8 border-t border-gray-200">
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors text-sm font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  All Guides
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* === Related guides === */}
      {relatedGuides.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container-wide">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6 text-center">
              Related Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedGuides.map((related) => (
                <Link
                  key={related.slug}
                  href={`/guides/${related.slug}`}
                  className="group card p-6 hover:shadow-lg transition-shadow"
                >
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-body font-semibold bg-accent/20 text-primary mb-3">
                    {related.category}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-primary group-hover:text-accent transition-colors mb-2 line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="font-body text-muted text-sm line-clamp-2">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === Contact form CTA === */}
      <section className="py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Have Questions About This Guide?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Barrett Henry is here to help you put this information into action.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source={`guide-${guide.slug}`}
          />
        </div>
      </section>
    </>
  );
}
