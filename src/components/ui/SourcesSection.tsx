// =============================================================================
// SourcesSection: visible citation list for pillar and guide pages
// Server component. GEO rule: generative engines weight pages that name their
// sources, so the statutes, lender letters, and data sources behind the claims
// are listed on the page itself, not just in a disclaimer line.
// =============================================================================

export interface Source {
  /** Full name of the statute, letter, database, or data source */
  name: string;
  /** What this source was used for on the page */
  used: string;
  /** Official URL, when one exists */
  href?: string;
}

interface SourcesSectionProps {
  sources: Source[];
  /** When the sources were last checked */
  checked?: string;
}

export default function SourcesSection({
  sources,
  checked = "October 2026",
}: SourcesSectionProps) {
  return (
    <section className="container-wide py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="heading-section text-display-sm text-primary mb-4">
          Sources
        </h2>
        <p className="font-body text-muted mb-6 leading-relaxed">
          Every number and rule on this page traces to one of the following,
          checked {checked}. Statutes and lender guidelines change, so verify
          against the current version before you rely on it.
        </p>
        <ul className="space-y-4">
          {sources.map((source) => (
            <li
              key={source.name}
              className="border-l-4 border-border pl-4 py-1"
            >
              <p className="font-body text-primary font-medium text-sm mb-1">
                {source.href ? (
                  <a
                    href={source.href}
                    className="text-link hover:underline"
                    rel="nofollow noopener"
                    target="_blank"
                  >
                    {source.name}
                  </a>
                ) : (
                  source.name
                )}
              </p>
              <p className="font-body text-muted text-sm leading-relaxed">
                {source.used}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
