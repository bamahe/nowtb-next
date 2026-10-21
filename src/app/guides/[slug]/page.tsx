// =============================================================================
// /guides/[slug], Individual guide page
// Long-form article layout with table of contents sidebar, content sections,
// inline CTAs, and related guides. (51 guide pages from nowtb.com)
// =============================================================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, Calculator, Search } from "lucide-react";
import ContactForm from "@/components/ui/ContactForm";
import PortabilityCalc from "@/components/ui/PortabilityCalc";
import { getPrimaryAgent } from "@/data/agents";
import { cleanWpContent } from "@/lib/utils";
// Single source of truth for Barrett's author entity and for speakable
// selectors. See src/lib/schema.tsx, do not re-hardcode these values here.
import { barrettAuthorPerson, speakableSelectorsForContent } from "@/lib/schema";
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

// --- generateStaticParams, pre-render all known guides at build ---
export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

// --- Social share image for guide pages ---
//
// Guides have no per-guide artwork. The GuideData interface in src/data/guides.ts
// has no image field, and public/images/guides/ holds only six in-article
// infographics whose filenames do not line up with guide slugs. So every guide
// shares the site-wide card.
//
// VERIFIED ON DISK before being referenced here (2026-10-17):
//   ls -la public/og-default.png   ->  exists, 41,673 bytes
//   PNG header reports 1200 x 630  ->  matches the width/height declared below
// Do not change this path without re-running that check. There is a standing
// bug on this site where schema pointed at /images/barrett-henry-headshot.jpg,
// a file that has never existed (the real headshot is barrett-headshot.png), so
// an unverified image path here is a realistic failure mode, not a hypothetical.
const GUIDE_OG_IMAGE = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "Barrett Henry, REALTOR®, Tampa Bay Homes for Sale",
};

// --- Dynamic SEO metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  // ─── TITLE: the brand is deliberately NOT in this string ───────────────────
  // src/app/layout.tsx sets `title.template = "%s | Barrett Henry"`, and Next.js
  // applies that template to a plain-string `title`, and ALSO to
  // `openGraph.title` and `twitter.title`. (Confirmed in the installed copy of
  // Next 14: node_modules/next/dist/lib/metadata/resolvers/resolve-opengraph.js
  // calls resolveTitle(openGraph.title, titleTemplate) and the same for twitter.)
  //
  // This function used to build `${guide.title} | Barrett Henry, REALTOR®` and
  // hand it to all three fields, so the template appended the brand a SECOND
  // time and 100% of live /guides/ pages rendered a doubled suffix:
  //
  //   before:  "Home Appraisal Guide | Barrett Henry, REALTOR® | Barrett Henry"  (62)
  //   after:   "Home Appraisal Guide | Barrett Henry"                            (36)
  //
  // Google truncates around 60 characters, so the duplicate was eating the part
  // of the title that actually ranks. ONE source of truth for the brand: the
  // template in layout.tsx. The REALTOR® credential is not lost, it is stated
  // properly in the Person/author schema further down this file, which is where
  // search and AI answer engines read credentials from.
  //
  // BUDGET: the suffix is 16 characters, so this string must stay at or under
  // 44 characters to keep the rendered <title> under 60. Two guide titles in
  // src/data/guides.ts currently exceed that (the Hillsborough County timeline
  // guide at 73 chars, and the homestead exemption guide at 50) and need
  // shortening in that data file, which this file cannot do for them.
  //
  // If it breaks, check: a doubled brand reappearing means someone put
  // "Barrett Henry" back into this string or into guide.title itself. A page
  // that genuinely needs to bypass the suffix uses `title: { absolute: "..." }`.
  const title = guide.title;

  return {
    title,
    description: guide.excerpt,
    alternates: {
      canonical: `/guides/${slug}/`,
    },
    openGraph: {
      title,
      description: guide.excerpt,
      url: `/guides/${slug}/`,
      type: "article",
      publishedTime: guide.date,
      // siteName/locale are repeated here because a child `openGraph` object
      // REPLACES the root layout's openGraph wholesale rather than merging into
      // it, same reason `images` has to be repeated, see below.
      siteName: "Barrett Henry, REALTOR®, REMAX Collective",
      locale: "en_US",
      // ─── og:image is REQUIRED here, it is NOT inherited ───────────────────
      // layout.tsx declares a site-wide openGraph.images, but Next.js does not
      // merge nested metadata objects field-by-field: the moment this page
      // defines `openGraph` at all, the parent's entire openGraph object is
      // replaced, images included. The resolver then does
      // `target.images = resolveImages(og.images, ...)` unconditionally, so an
      // absent `images` key resolves to undefined and the page ships with NO
      // og:image. That is what made every guide share as a blank grey box:
      // twitter:card below promises a large-image card, and nothing supplied
      // the image. Half the sampled pages on the live site had this.
      images: [GUIDE_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: guide.excerpt,
      // Same non-inheritance rule applies to twitter.images. Without this,
      // card="summary_large_image" is a promise with nothing behind it.
      images: [GUIDE_OG_IMAGE.url],
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

  // The exact cleaned HTML the body renders when WordPress content exists.
  // Computed once here so the `speakable` selectors in the JSON-LD below are
  // feature-detected against the SAME string that reaches the DOM further down
  // (the dangerouslySetInnerHTML below reuses this const). Guides with no
  // WordPress export fall back to generated placeholder sections, which never
  // contain a quick-answer block, hence null, which yields just "h1".
  const cleanedBody = wpContent ? cleanWpContent(wpContent) : null;

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
            // AUTHOR, built from the shared helper in src/lib/schema.tsx
            // rather than retyped here (fixed 2026-10-17).
            //
            // The hand-written version this replaces had its own `image`, its
            // own short `sameAs` list, and NO credentials, so guides described
            // a slightly different Barrett than blog posts and city pages did.
            // Answer engines resolve an author by matching those fields; three
            // near-identical Person nodes read as three weaker entities instead
            // of one strong one. barrettAuthorPerson() emits the verified
            // headshot URL, the full sameAs set, and his three real
            // designations (e-PRO, MRP, SRS, he holds no others).
            //
            // If it breaks, check: src/lib/schema.tsx owns these values now.
            // Fix them there, not here.
            author: barrettAuthorPerson(),
            publisher: {
              "@type": "Organization",
              name: "Barrett Henry, REALTOR\u00AE",
              url: "https://nowtb.com",
            },
            // SPEAKABLE, tells voice search and AI assistants which element
            // holds the quotable answer.
            //
            // The old hardcoded list was `[".quick-answer", "article h1",
            // "article h2 + p"]` and every selector in it matched NOTHING:
            //  - this template never renders <QuickAnswer>, so nothing on the
            //    page has class "quick-answer". The migrated WordPress content
            //    uses "bbs-quick-answer" instead, and CSS class selectors match
            // whole tokens, not substrings, ".quick-answer" does not match
            //    "bbs-quick-answer".
            //  - "article h1" fails because the <h1> is in the hero <section>,
            //    outside <article>.
            // A speakable spec that resolves to nothing is worse than none: it
            // promises assistants a quotable block that does not exist.
            //
            // speakableSelectorsForContent() inspects the real cleaned body
            // HTML and returns only selectors that actually resolve, falling
            // back to the bare "h1" this template does render.
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: speakableSelectorsForContent(cleanedBody),
            },
          }),
        }}
      />
      {/* --- BreadcrumbList schema --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Guides", item: "https://nowtb.com/guides" },
              { "@type": "ListItem", position: 3, name: guide.title, item: `https://nowtb.com/guides/${slug}` },
            ],
          }),
        }}
      />

      {/* === Article header === */}
      <section className="bg-primary pt-32 pb-16">
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
          <div className="flex items-center justify-center gap-3 text-sm font-body text-accent mb-8">
            <time dateTime={guide.date}>{formatDate(guide.date)}</time>
            <span className="w-1 h-1 rounded-full bg-accent/50" />
            <span>{guide.readingTime}</span>
          </div>

          {/* CTA buttons in header */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold text-sm rounded-lg hover:bg-accent/10 transition-colors"
            >
              <Phone className="w-4 h-4" /> Schedule a Strategy Call
            </a>
            <a
              href="/mortgage-calculator/"
              className="inline-block px-6 py-3 border-2 border-white/40 text-white font-bold text-sm rounded-lg hover:border-white/70 transition-colors"
            >
              Calculate Your Payment
            </a>
            <a
              href="/properties/"
              className="inline-block px-6 py-3 border-2 border-white/40 text-white font-bold text-sm rounded-lg hover:border-white/70 transition-colors"
            >
              Search Homes
            </a>
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
                  <Image
                    src="/images/barrett-headshot.png"
                    alt="Barrett Henry, REALTOR® and Broker Associate at REMAX Collective"
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-3"
                  />
                  <h3 className="font-heading font-bold text-sm text-primary mb-2 text-center">
                    Need Personal Guidance?
                  </h3>
                  <p className="font-body text-muted text-xs mb-3 text-center">
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

            {/* Main content */}
            <article className="lg:col-span-3 order-1 lg:order-2">
              {/* Portability calculator, top of homestead guide */}
              {guide.slug === "florida-homestead-exemption-save-our-homes" && (
                <PortabilityCalc />
              )}

              <div
                className="blog-content prose prose-lg font-body text-dark max-w-none
                  prose-headings:font-heading prose-headings:text-primary
                  prose-a:text-link prose-a:no-underline hover:prose-a:underline
                  prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: cleanedBody ?? "" }}
              />

              {/* Back to guides link */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <Link
                  href="/guides/"
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
                  <Image
                    src="/images/barrett-headshot.png"
                    alt="Barrett Henry, REALTOR® and Broker Associate at REMAX Collective"
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-3"
                  />
                  <h3 className="font-heading font-bold text-sm text-primary mb-2 text-center">
                    Need Personal Guidance?
                  </h3>
                  <p className="font-body text-muted text-xs mb-3 text-center">
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

            {/* Main guide content, placeholder sections */}
            <article className="lg:col-span-3 order-1 lg:order-2">
              {guide.sections.map((section, index) => (
                <div key={section.id} id={section.id} className="mb-12">
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4">
                    {section.heading}
                  </h2>
                  <div
                    className="prose prose-lg font-body text-dark max-w-none
                      prose-headings:font-heading prose-headings:text-primary
                      prose-a:text-link prose-a:no-underline hover:prose-a:underline
                      prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: cleanWpContent(section.content) }}
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
                  href="/guides/"
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

      {/* === Contact form CTA, placed before related guides and FAQ === */}
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
                  href={`/guides/${related.slug}/`}
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

    </>
  );
}
