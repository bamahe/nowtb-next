// =============================================================================
// /mortgage-calculator layout — exports metadata for the client component page
// The page itself is "use client" so metadata must live here.
// =============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Calculator Tampa Bay | Estimate Monthly Payments",
  description:
    "Calculate your monthly mortgage payment for a Tampa Bay home. Adjust price, down payment, interest rate, and more. Barrett Henry, REMAX Collective. Call (813) 733-7907.",
  alternates: {
    canonical: "/mortgage-calculator",
  },
};

export default function MortgageCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
