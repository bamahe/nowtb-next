/**
 * Pre-written "what happens now" copy for each election outcome.
 *
 * PROTECTED FILE. Automation must never write here. The whole point of this
 * design is that on November 4 the bot flips ONE enum in result.json and the
 * page renders copy a human already wrote and approved. If the bot gets the
 * result wrong, the worst case is the wrong one of two approved blocks, which
 * is a one character fix, rather than a fabricated paragraph about an election.
 *
 * This copy is factual and mechanical on purpose. Barrett's opinion lives in
 * amendment-3-take.ts and stays out of here.
 *
 * Covered by scripts/amendment3-guard.mjs via .locked.sha256.
 */

export type Amd3Status = "pending" | "passed" | "failed";

export interface Amd3Branch {
  /** Short banner label. */
  badge: string;
  headline: string;
  paragraphs: string[];
}

export const AMD3_BRANCHES: Record<Amd3Status, Amd3Branch> = {
  pending: {
    badge: "On the ballot",
    headline: "Florida votes on Amendment 3 on November 3, 2026",
    paragraphs: [
      "Nothing on your tax bill changes until this is decided. Florida constitutional amendments need at least 60% approval to pass, which is a higher bar than a simple majority and is the reason measures with majority support still fail here.",
      "If it passes, the changes take effect January 1, 2027. You would first see them on your August 2027 TRIM notice and your November 2027 tax bill, not before.",
    ],
  },

  passed: {
    badge: "Passed",
    headline: "Amendment 3 passed. Here is what happens next",
    paragraphs: [
      "The changes take effect January 1, 2027. The non-school homestead exemption rises to up to $150,000 for the 2027 tax year and up to $250,000 for 2028, replacing the current $51,411 second band rather than stacking on top of it. The $25,000 school exemption is unchanged, so the school portion of your bill does not move.",
      "You will first see the effect on your August 2027 TRIM notice, then on the tax bill that arrives in November 2027. Nothing lands sooner than that.",
      "If you already have a homestead exemption on file, the larger exemption applies automatically. You do not re-apply. If you do not have one on file, that is the thing to fix, and the deadline to file for a tax year is March 1.",
      "Two caveats worth keeping in front of you. Local governments can raise millage rates to replace lost revenue, and a higher rate on a smaller taxable value gives back part of the saving. And non ad valorem assessments for fire, stormwater and solid waste are not touched by any of this.",
    ],
  },

  failed: {
    badge: "Did not pass",
    headline: "Amendment 3 did not pass. Current law continues",
    paragraphs: [
      "Nothing changes. The homestead exemption stays at $25,000 against all levies plus the CPI adjusted second band against non-school levies, $51,411 in total for 2026. The second band keeps getting its annual inflation adjustment the way it always has.",
      "The annual assessment cap on non-homestead property stays at 10% rather than dropping to 5%, and the December 31, 2026 residency cutoff is moot because the rule it applied to does not exist.",
      "Save Our Homes, the 3% annual cap on homesteaded assessed value, and the $500,000 portability cap were never part of this amendment and are unaffected either way.",
      "If you do not have a homestead exemption on file, that is still the single biggest lever on your Florida property tax bill, and the filing deadline for a tax year is March 1.",
    ],
  },
};
