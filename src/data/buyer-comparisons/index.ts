/**
 * Registry for buyer home comparison data files.
 * Each comparison is a slug-keyed Comparison object.
 */
import { Comparison } from './types';
import { hollandVsTonyaAnne } from './holland-vs-tonya-anne';

const registry: Record<string, Comparison> = {
  'holland-vs-tonya-anne': hollandVsTonyaAnne,
};

/** Look up a single comparison by slug */
export function getComparison(slug: string): Comparison | undefined {
  return registry[slug];
}

/** Return all registered slugs (used by generateStaticParams) */
export function getAllBuyerComparisonSlugs(): string[] {
  return Object.keys(registry);
}
