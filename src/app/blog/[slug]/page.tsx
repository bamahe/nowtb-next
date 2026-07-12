// =============================================================================
// /blog/[slug] — Blog post page (renders same content as /[slug])
// Both URLs serve the same post. Canonical points to root /[slug].
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPrimaryAgent } from "@/data/agents";
import { getAllPosts, getPostBySlug, getPostThumbnail, getRelatedPosts } from "@/lib/posts";
import { cleanWpContent } from "@/lib/utils";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  const description = post.excerpt || `${post.title} — Barrett Henry, REALTOR® at REMAX Collective.`;
  const ogTitle = `${post.title} | Barrett Henry, REALTOR®`;
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      title: ogTitle,
      description,
      url: `/blog/${slug}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
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
  if (!post) notFound();

  const agent = getPrimaryAgent();
  const thumbnail = getPostThumbnail(post);
  const related = getRelatedPosts(slug, 3);

  // Strip HTML tags from excerpt for schema description
  const plainExcerpt = (post.excerpt || "").replace(/<[^>]*>/g, "").trim();
  const canonicalUrl = `https://nowtb.com/blog/${slug}/`;

  return (
    <>
      {/* === JSON-LD: BlogPosting structured data === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.date,
            description: plainExcerpt || `${post.title} — Barrett Henry, REALTOR® at REMAX Collective.`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
            author: {
              "@type": "Person",
              name: "Barrett Henry",
              jobTitle: "Broker Associate",
              url: "https://nowtb.com/about/",
            },
            publisher: {
              "@type": "RealEstateAgent",
              name: "Barrett Henry, REALTOR®",
            },
            ...(thumbnail ? { image: thumbnail } : {}),
          }),
        }}
      />

      <section className="bg-primary pt-32 pb-16">
        <div className="container-wide max-w-3xl text-center">
          <h1 className="heading-display text-display md:text-display-lg text-white mb-4">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm font-body text-accent">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </section>

      <section className="container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="card p-5 bg-primary/5">
                <h3 className="font-heading font-bold text-sm text-primary mb-2">
                  About the Author
                </h3>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden">
                    <Image
                      src="/images/barrett-headshot.png"
                      alt={agent.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs text-primary">{agent.name}</p>
                    <p className="font-body text-muted text-[10px]">{agent.title}</p>
                  </div>
                </div>
                <a
                  href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
                  className="btn-primary inline-block px-4 py-2 text-xs text-center w-full"
                >
                  {agent.phone}
                </a>
              </div>

              {related.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-heading font-bold text-sm text-primary mb-3">
                    Related Posts
                  </h3>
                  <ul className="space-y-2">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/${r.slug}`}
                          className="font-body text-xs text-accent hover:underline"
                        >
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <article className="lg:col-span-3 order-1 lg:order-2">
            {thumbnail && (
              <div className="mb-8 rounded-lg overflow-hidden relative">
                <Image
                  src={thumbnail}
                  alt={post.title}
                  width={900}
                  height={500}
                  className="w-full h-auto"
                  priority
                  sizes="(max-width: 768px) 100vw, 75vw"
                />
              </div>
            )}
            <div
              className="blog-content prose prose-lg font-body text-dark max-w-none
                prose-headings:font-heading prose-headings:text-primary
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cleanWpContent(post.content) }}
            />
          </article>
        </div>
      </section>
    </>
  );
}
