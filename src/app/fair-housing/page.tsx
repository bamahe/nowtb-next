// =============================================================================
// /fair-housing — Fair housing statement
// =============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fair Housing Statement | Barrett Henry, REALTOR®",
  description: "Our commitment to fair housing — equal opportunity in housing for all.",
};

export default function FairHousingPage() {
  return (
    <section className="container-wide py-16">
      <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary">
        <h1>Fair Housing Statement</h1>
        <p>
          Barrett Henry, The NOW Team, and REMAX Collective are committed to
          compliance with all federal, state, and local fair housing laws. We do
          not discriminate against any person because of race, color, religion,
          sex, handicap, familial status, national origin, sexual orientation,
          gender identity, or any other protected class.
        </p>
        <p>
          We believe everyone deserves equal access to housing opportunities. If
          you believe you have experienced housing discrimination, contact the
          U.S. Department of Housing and Urban Development (HUD) at{" "}
          <a href="tel:18006699777">(800) 669-9777</a> or visit{" "}
          <a href="https://www.hud.gov/fairhousing" target="_blank" rel="noopener noreferrer">
            hud.gov/fairhousing
          </a>.
        </p>
      </div>
    </section>
  );
}
