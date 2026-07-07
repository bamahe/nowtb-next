// =============================================================================
// /blog/[slug] — Redirects to /[slug] (blog posts now live at root level)
// 301 redirect for SEO juice preservation
// =============================================================================

import { redirect } from "next/navigation";
import { getAllPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
