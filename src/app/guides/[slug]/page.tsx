// =============================================================================
// /guides/[slug] — Individual guide page
// Long-form article layout with table of contents sidebar, content sections,
// inline CTAs, and related guides. (42 guide pages)
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ui/ContactForm";
import { getPrimaryAgent } from "@/data/agents";

// --- Guide data type (placeholder until CMS integration) ---
interface GuideSection {
  id: string;
  heading: string;
  content: string;
}

interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
  sections: GuideSection[];
}

// --- Placeholder guides ---
const PLACEHOLDER_GUIDES: Guide[] = [
  {
    slug: "first-time-homebuyer-florida",
    title: "The Complete First-Time Homebuyer Guide for Florida",
    excerpt:
      "Step-by-step walkthrough of buying your first home in Florida — from budgeting and pre-approval through closing day.",
    date: "2026-04-10",
    category: "Buying",
    readingTime: "12 min read",
    sections: [
      {
        id: "getting-started",
        heading: "Getting Started: Is Now the Right Time to Buy?",
        content:
          "<p>Buying your first home is one of the biggest financial decisions you will make. The Florida market offers strong long-term appreciation, no state income tax, and a wide range of housing options from condos to single-family homes.</p><p>Barrett Henry recommends starting the process by assessing your financial readiness: stable income, manageable debt, and enough savings for a down payment and closing costs.</p>",
      },
      {
        id: "pre-approval",
        heading: "Step 1: Get Pre-Approved for a Mortgage",
        content:
          "<p>Pre-approval tells you exactly how much house you can afford and shows sellers you are a serious buyer. Barrett works with a network of trusted lenders in Tampa Bay who can get you pre-approved quickly.</p><p>You will need: two years of tax returns, recent pay stubs, bank statements, and a credit report. Most Florida buyers qualify for conventional, FHA, or VA loans depending on their situation.</p>",
      },
      {
        id: "home-search",
        heading: "Step 2: Search for Your Home",
        content:
          "<p>With pre-approval in hand, Barrett will set up custom MLS searches based on your criteria — location, price range, bedrooms, and must-have features. You will receive new listings the moment they hit the market.</p><p>Pro tip: In competitive areas like Valrico, Brandon, and Riverview, be ready to tour homes within 24 hours of listing. Barrett's local market knowledge helps you identify the best values quickly.</p>",
      },
      {
        id: "making-offer",
        heading: "Step 3: Make an Offer and Negotiate",
        content:
          "<p>Barrett will run a comparative market analysis (CMA) to determine the right offer price. His 23+ years of real estate experience mean he knows how to structure offers that win — whether it is a competitive market or a buyer's market.</p><p>Negotiation covers more than price: closing costs, inspection contingencies, closing date, and included items are all on the table.</p>",
      },
      {
        id: "closing",
        heading: "Step 4: Inspections, Appraisal, and Closing",
        content:
          "<p>Once your offer is accepted, you will enter the due diligence period. Barrett coordinates home inspections, appraisal scheduling, and title work so nothing falls through the cracks.</p><p>At closing, you will sign the final documents, fund the purchase, and receive your keys. Barrett walks you through every line item so there are no surprises.</p>",
      },
    ],
  },
  {
    slug: "selling-your-home-tampa-bay",
    title: "The Complete Guide to Selling Your Home in Tampa Bay",
    excerpt:
      "Everything Tampa Bay sellers need to know — from pricing strategy and staging to marketing and closing.",
    date: "2026-03-28",
    category: "Selling",
    readingTime: "10 min read",
    sections: [
      {
        id: "pricing",
        heading: "Pricing Your Home Right from Day One",
        content:
          "<p>The most critical decision in selling your home is the list price. Price too high and your home sits. Price too low and you leave money on the table.</p><p>Barrett uses a data-driven CMA that analyzes recent sales, active competition, and market trends specific to your neighborhood. This approach consistently delivers above-market results for his sellers.</p>",
      },
      {
        id: "preparation",
        heading: "Preparing Your Home to Sell",
        content:
          "<p>First impressions drive offers. Barrett provides a personalized preparation checklist that focuses on high-ROI improvements — not expensive renovations that never pay back.</p><p>Common recommendations include fresh paint, decluttering, deep cleaning, and minor repairs. Professional staging may be recommended for vacant or luxury properties.</p>",
      },
      {
        id: "marketing",
        heading: "Marketing That Gets Results",
        content:
          "<p>Barrett's marketing plan includes professional photography, 3D virtual tours, targeted social media ads, email campaigns to active buyer agents, and syndication to 100+ real estate websites.</p><p>Every listing gets maximum exposure from day one. No waiting for buyers to find you — Barrett puts your home in front of them.</p>",
      },
    ],
  },
];

/** Look up a guide by slug */
function getGuide(slug: string): Guide | undefined {
  return PLACEHOLDER_GUIDES.find((g) => g.slug === slug);
}

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
  return PLACEHOLDER_GUIDES.map((guide) => ({ slug: guide.slug }));
}

// --- Dynamic SEO metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
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
  const guide = getGuide(slug);

  // 404 if the slug doesn't match any guide
  if (!guide) notFound();

  const agent = getPrimaryAgent();

  // Get related guides (same category, excluding current)
  const relatedGuides = PLACEHOLDER_GUIDES.filter(
    (g) => g.slug !== guide.slug
  ).slice(0, 3);

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

      {/* === Guide body + table of contents sidebar === */}
      <section className="container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* --- Table of contents sidebar (sticky on desktop) --- */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Table of contents */}
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

              {/* Quick contact card */}
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

          {/* --- Main guide content --- */}
          <article className="lg:col-span-3 order-1 lg:order-2">
            {guide.sections.map((section, index) => (
              <div key={section.id} id={section.id} className="mb-12">
                {/* Section heading */}
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4">
                  {section.heading}
                </h2>

                {/* Section content */}
                <div
                  className="prose prose-lg font-body text-dark max-w-none
                    prose-headings:font-heading prose-headings:text-primary
                    prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                    prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />

                {/* Inline CTA between sections (every 2 sections) */}
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

            {/* --- Back to guides link --- */}
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
