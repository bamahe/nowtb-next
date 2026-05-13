// =============================================================================
// /blog/[slug] — Individual blog post page
// Renders real WordPress HTML content from the JSON export.
// Uses dangerouslySetInnerHTML for the post body with custom .blog-content
// styles defined in globals.css.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ui/ContactForm";
import { getPrimaryAgent } from "@/data/agents";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";

/** Format a date string into human-readable format */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Estimate reading time from HTML content (roughly 250 words/min) */
function readingTime(html: string): string {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 250));
  return `${minutes} min read`;
}

/** Strip HTML tags for plain-text excerpt */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

// --- generateStaticParams — pre-render all 624 blog posts at build ---
export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// --- Dynamic SEO metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  // Use excerpt if available, otherwise pull first 160 chars from content
  const description = post.excerpt
    ? stripHtml(post.excerpt).substring(0, 160)
    : stripHtml(post.content).substring(0, 160);

  return {
    title: `${post.title} | Barrett Henry, REALTOR®`,
    description,
    openGraph: {
      title: post.title,
      description,
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
  const post = getPostBySlug(slug);

  // 404 if post slug doesn't match anything
  if (!post) notFound();

  const agent = getPrimaryAgent();
  const related = getRelatedPosts(slug, 3);
  const estimatedReadTime = readingTime(post.content);

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
            description: post.excerpt
              ? stripHtml(post.excerpt).substring(0, 160)
              : stripHtml(post.content).substring(0, 160),
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
          {/* Title */}
          <h1 className="heading-display text-display md:text-display-lg text-white mb-4">
            {post.title}
          </h1>

          {/* Date + reading time */}
          <div className="flex items-center justify-center gap-3 text-sm font-body text-accent">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="w-1 h-1 rounded-full bg-accent/50" />
            <span>{estimatedReadTime}</span>
          </div>
        </div>
      </section>

      {/* === Article body + sidebar layout === */}
      <section className="container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* --- Main article content --- */}
          <article className="lg:col-span-2">
            {/*
              Render WordPress HTML content.
              The .blog-content class in globals.css styles headings,
              paragraphs, lists, tables, images, links, and blockquotes.
            */}
            <div
              className="blog-content"
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
                {/* Agent photo */}
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

            {/* Related posts — matched by city name in slug */}
            {related.length > 0 && (
              <div className="card p-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-4">
                  Related Posts
                </h3>
                <div className="space-y-4">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="block group"
                    >
                      <p className="font-body text-sm font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
                        {rel.title}
                      </p>
                      <p className="font-body text-xs text-muted mt-1">
                        {formatDate(rel.date)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

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
