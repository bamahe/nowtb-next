// =============================================================================
// SchoolsNearby — Displays elementary, middle, and high school cards
// Server component — no "use client" needed, renders static school info
// Links each school to a GreatSchools.org search page for more details
// =============================================================================

import { GraduationCap } from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SchoolsNearbyProps {
  /** Elementary school name from MLS data */
  elementary?: string;
  /** Middle/junior school name from MLS data */
  middle?: string;
  /** High school name from MLS data */
  high?: string;
  /** City name used in the GreatSchools search URL */
  city: string;
}

// -----------------------------------------------------------------------------
// Helper — build a GreatSchools.org search link for a school name + city
// -----------------------------------------------------------------------------

function greatSchoolsUrl(schoolName: string, city: string): string {
  const q = encodeURIComponent(schoolName);
  const loc = encodeURIComponent(`${city},FL`);
  return `https://www.greatschools.org/search/search.page?q=${q}&locationSearchString=${loc}`;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/** School level labels and which prop maps to them */
const LEVELS = [
  { key: "elementary" as const, label: "Elementary School" },
  { key: "middle" as const, label: "Middle School" },
  { key: "high" as const, label: "High School" },
];

export default function SchoolsNearby({
  elementary,
  middle,
  high,
  city,
}: SchoolsNearbyProps) {
  // Map prop keys to values for iteration
  const schoolMap: Record<string, string | undefined> = {
    elementary,
    middle,
    high,
  };

  // Only render if at least one school is provided
  const hasSchools = elementary || middle || high;
  if (!hasSchools) return null;

  return (
    <section className="container-wide pb-12">
      <h2 className="heading-section text-xl text-primary mb-6">
        Nearby Schools
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {LEVELS.map(({ key, label }) => {
          const schoolName = schoolMap[key];
          if (!schoolName) return null;

          return (
            <a
              key={key}
              href={greatSchoolsUrl(schoolName, city)}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 block group"
            >
              {/* Level label — small uppercase accent text */}
              <p className="heading-label mb-2">{label}</p>

              {/* School name with icon */}
              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <p className="font-body text-sm text-dark font-medium group-hover:text-primary transition-colors">
                  {schoolName}
                </p>
              </div>

              {/* "View on GreatSchools" hint */}
              <p className="font-body text-[10px] text-muted mt-3 tracking-wide uppercase">
                View on GreatSchools &rarr;
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
