// =============================================================================
// /mortgage-calculator — Server component with metadata
// Renders the client-side MortgageCalc component for interactive calculators
// =============================================================================

import type { Metadata } from "next";
import MortgageCalc from "@/components/ui/MortgageCalc";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Mortgage Calculator | Estimate Your Monthly Payment",
  description:
    "Use our free mortgage calculator to estimate your monthly payment or find out how much home you can afford in Tampa Bay. Includes property tax, insurance, and PMI estimates. Call Barrett Henry at (813) 733-7907.",
  alternates: {
    canonical: "/mortgage-calculator/",
  },
  openGraph: {
    title: "Mortgage Calculator | Estimate Your Monthly Payment",
    description:
      "Free mortgage calculator with monthly payment and affordability tools. Estimate your Tampa Bay home payment instantly.",
    type: "website",
  },
};

export default function MortgageCalculatorPage() {
  return <MortgageCalc />;
}
