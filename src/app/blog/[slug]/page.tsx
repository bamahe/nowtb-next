// =============================================================================
// /blog/[slug] — Individual blog post page
// Article layout with author bio sidebar, related posts, and CTA.
// Posts will eventually come from a CMS or markdown files; for now uses
// placeholder content so the template is ready.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ui/ContactForm";
import { getPrimaryAgent } from "@/data/agents";

// --- Placeholder blog post data (replaced by CMS later) ---
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
  /** HTML content for the post body */
  content: string;
}

// Placeholder posts — same slugs as blog index so links work
const PLACEHOLDER_POSTS: BlogPost[] = [
  {
    slug: "tampa-bay-housing-market-2026",
    title: "Tampa Bay Housing Market 2026: What Buyers and Sellers Need to Know",
    excerpt:
      "A deep dive into current median prices, inventory levels, and days-on-market trends across Hillsborough, Pinellas, and Pasco counties.",
    date: "2026-05-01",
    category: "Market Updates",
    readingTime: "6 min read",
    content: `
      <p>The Tampa Bay housing market continues to evolve in 2026. After years of rapid appreciation, the market is finding a new equilibrium that presents opportunities for both buyers and sellers.</p>
      <h2>Current Market Conditions</h2>
      <p>Median home prices across the Tampa Bay metro area have stabilized, with Hillsborough County seeing modest year-over-year gains. Inventory levels have improved compared to the pandemic-era lows, giving buyers more options without flooding the market.</p>
      <h2>What This Means for Buyers</h2>
      <p>Buyers now have more negotiating power than they have had in years. With interest rates normalizing and inventory improving, it is an excellent time to lock in a home before the next wave of demand hits. Barrett Henry recommends getting pre-approved early and moving quickly on well-priced homes.</p>
      <h2>What This Means for Sellers</h2>
      <p>Sellers who price strategically and invest in presentation are still seeing strong results. Overpriced homes sit, but properly positioned listings in desirable areas continue to attract multiple offers. Barrett's data-driven pricing approach helps sellers hit the sweet spot.</p>
      <h2>FAQ</h2>
      <h3>Is now a good time to buy in Tampa Bay?</h3>
      <p>Yes. Improved inventory and stabilized prices create a favorable environment for buyers who are pre-approved and ready to act.</p>
      <h3>Are home prices dropping in Tampa Bay?</h3>
      <p>Prices have not dropped significantly. Instead, the rate of appreciation has slowed to a sustainable pace, which is healthy for long-term market stability.</p>
    `,
  },
];

/** Look up a post by slug */
function getPost(slug: string): BlogPost | undefined {
  return PLACEHOLDER_POSTS.find((p) => p.slug === slug);
}

/** Format a date string into human-readable format */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// --- generateStaticParams — pre-render all known blog posts at build ---
export async function generateStaticParams() {
  return PLACEHOLDER_POSTS.map((post) => ({ slug: post.slug }));
}

// --- Dynamic SEO metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Barrett Henry, REALTOR®`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  // 404 if post slug doesn't match anything
  if (!post) notFound();

  const agent = getPrimaryAgent();

  return (
    <>
      {/* --- JSON-LD Article structured data --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: {
              "@type": "Person",
              name: agent.name,
              url: "https://nowtb.com/about",
            },
            publisher: {
              "@type": "Organization",
              name: "Barrett Henry, REALTOR®",
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
            {post.category}
          </span>

          {/* Title */}
          <h1 className="heading-display text-display md:text-display-lg text-white mb-4">
            {post.title}
          </h1>

          {/* Date + reading time */}
          <div className="flex items-center justify-center gap-3 text-sm font-body text-accent">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="w-1 h-1 rounded-full bg-accent/50" />
            <span>{post.readingTime}</span>
          </div>
        </div>
      </section>

      {/* === Article body + sidebar layout === */}
      <section className="container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* --- Main article content --- */}
          <article className="lg:col-span-2">
            <div
              className="prose prose-lg font-body text-dark max-w-none
                prose-headings:font-heading prose-headings:text-primary
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* --- Back to blog link --- */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/blog"
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
                Back to Blog
              </Link>
            </div>
          </article>

          {/* --- Sidebar — Author bio + related posts --- */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Author bio card */}
            <div className="card p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                About the Author
              </h3>
              <div className="flex items-start gap-4 mb-4">
                {/* Agent photo placeholder */}
                <div className="w-16 h-16 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={agent.photoUrl}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-heading font-bold text-primary">
                    {agent.name}
                  </p>
                  <p className="font-body text-muted text-sm">{agent.title}</p>
                </div>
              </div>
              <p className="font-body text-muted text-sm mb-4">
                {agent.bio.substring(0, 200)}...
              </p>
              <Link
                href="/about"
                className="text-accent text-sm font-semibold hover:underline"
              >
                Read full bio
              </Link>
            </div>

            {/* Related posts placeholder */}
            <div className="card p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-4">
                Related Posts
              </h3>
              <div className="space-y-4">
                {/* Placeholder related posts — replaced by CMS logic */}
                {PLACEHOLDER_POSTS.filter((p) => p.slug !== post.slug)
                  .slice(0, 3)
                  .map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="block group"
                    >
                      <p className="font-body text-sm font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
                        {related.title}
                      </p>
                      <p className="font-body text-xs text-muted mt-1">
                        {formatDate(related.date)}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Quick contact card */}
            <div className="card p-6 bg-primary/5">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                Have Questions?
              </h3>
              <p className="font-body text-muted text-sm mb-4">
                Barrett Henry is ready to help with your Tampa Bay real estate
                needs.
              </p>
              <a
                href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
                className="btn-primary inline-block px-6 py-2 text-sm text-center w-full"
              >
                Call {agent.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* === CTA section === */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Ready to Take the Next Step?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Whether you are buying, selling, or investing in Tampa Bay real
            estate, Barrett Henry can help.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source={`blog-${post.slug}`}
          />
        </div>
      </section>
    </>
  );
}
