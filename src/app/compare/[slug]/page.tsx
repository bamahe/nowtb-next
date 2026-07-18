/**
 * /compare/[slug] - Buyer Home Comparison Tool page.
 * Server component that loads comparison data and renders the interactive tool.
 * All pages are noindex by default (private buyer tools).
 */
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getComparison, getAllBuyerComparisonSlugs } from '@/data/buyer-comparisons';
import ComparisonTool from '@/components/comparison/ComparisonTool';

interface Props {
  params: { slug: string };
}

// Pre-generate all known comparison pages at build time
export function generateStaticParams() {
  return getAllBuyerComparisonSlugs().map((slug) => ({ slug }));
}

// Dynamic metadata based on comparison data
export function generateMetadata({ params }: Props): Metadata {
  const comparison = getComparison(params.slug);
  if (!comparison) return {};
  return {
    title: `${comparison.title} | Barrett Henry, REMAX Collective`,
    robots: { index: false, follow: false },
  };
}

export default function ComparePage({ params }: Props) {
  const comparison = getComparison(params.slug);
  if (!comparison) notFound();
  return <ComparisonTool comparison={comparison} />;
}
