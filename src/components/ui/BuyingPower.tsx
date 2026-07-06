// =============================================================================
// BuyingPower — Loan programs, down payment assistance, and qualification
// Shows on every listing detail page to generate leads
// "use client" for interactive qualification check
// =============================================================================

"use client";

import { useState } from "react";
import Link from "next/link";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

interface BuyingPowerProps {
  listingPrice: number;
  city: string;
}

// Loan program data
const LOAN_PROGRAMS = [
  {
    name: "FHA Loan",
    downPct: 3.5,
    description: "Government-backed, low down payment. Credit scores as low as 580.",
    icon: "🏛️",
  },
  {
    name: "VA Loan",
    downPct: 0,
    description: "Zero down for eligible veterans, active duty, and military families.",
    icon: "🎖️",
  },
  {
    name: "Conventional",
    downPct: 5,
    description: "Traditional financing. As low as 3-5% down with good credit.",
    icon: "🏦",
  },
  {
    name: "USDA Loan",
    downPct: 0,
    description: "Zero down for eligible rural areas. Income limits apply.",
    icon: "🌾",
  },
];

// Florida down payment assistance programs
const DPA_PROGRAMS = [
  { name: "Florida Hometown Heroes", amount: "Up to $35,000", who: "First-time buyers working in FL" },
  { name: "FL Assist", amount: "Up to $10,000", who: "FHA, VA, or USDA borrowers" },
  { name: "FL HLP Second Mortgage", amount: "Up to $10,000", who: "First-time buyers, 0% deferred" },
  { name: "Hillsborough County SHIP", amount: "Varies", who: "Income-qualifying Hillsborough residents" },
];

export default function BuyingPower({ listingPrice, city }: BuyingPowerProps) {
  const [showQualify, setShowQualify] = useState(false);
  const [income, setIncome] = useState("");
  const [result, setResult] = useState<string | null>(null);

  // Quick qualification check using 28% DTI rule
  function checkQualification() {
    const annualIncome = Number(income.replace(/[^0-9]/g, ""));
    if (!annualIncome) return;
    const monthlyIncome = annualIncome / 12;
    const maxPayment = monthlyIncome * 0.28;
    // Estimate monthly payment at 6.75% for 30yr
    const rate = 6.75 / 100 / 12;
    const n = 360;
    const loanNeeded = listingPrice * 0.965; // assuming 3.5% down (FHA)
    const monthlyPI = (loanNeeded * (rate * Math.pow(1 + rate, n))) / (Math.pow(1 + rate, n) - 1);
    const totalPayment = monthlyPI + (listingPrice * 0.011 / 12) + 150; // P&I + tax + insurance

    if (totalPayment <= maxPayment) {
      setResult(`Based on your income, you may qualify for this home! Estimated payment: ${fmt(Math.round(totalPayment))}/mo with FHA financing. Call Barrett at (813) 733-7907 to get pre-approved.`);
    } else {
      const maxHome = Math.round((maxPayment - 150) / (rate * Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1) + 0.011/12) / 0.965);
      setResult(`With FHA financing, your estimated max is around ${fmt(maxHome)}. But don't count yourself out — down payment assistance programs can change the picture. Call Barrett at (813) 733-7907 for a personalized analysis.`);
    }
  }

  return (
    <section className="container-wide py-12">
      <h2 className="heading-section text-xl text-primary mb-2">
        How to Buy This Home
      </h2>
      <p className="font-body text-muted font-light mb-8">
        Multiple financing options available for this {fmt(listingPrice)} home in {city}.
      </p>

      {/* === Loan Programs Grid === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {LOAN_PROGRAMS.map((loan) => (
          <div key={loan.name} className="border border-border p-5">
            <p className="text-2xl mb-2">{loan.icon}</p>
            <h3 className="font-heading font-bold text-primary mb-1">{loan.name}</h3>
            <p className="font-heading font-bold text-accent text-lg mb-2">
              {loan.downPct === 0 ? "$0 Down" : `${fmt(Math.round(listingPrice * loan.downPct / 100))} Down`}
            </p>
            <p className="font-body text-muted text-xs leading-relaxed">{loan.description}</p>
          </div>
        ))}
      </div>

      {/* === Down Payment Assistance === */}
      <div className="bg-primary p-6 md:p-8 mb-10">
        <h3 className="font-heading font-bold text-white text-lg mb-4">
          Florida Down Payment Assistance Programs
        </h3>
        <p className="font-body text-white/70 text-sm mb-6">
          You may qualify for up to $35,000 in assistance to cover your down payment and closing costs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DPA_PROGRAMS.map((prog) => (
            <div key={prog.name} className="border border-white/20 p-4">
              <p className="font-body text-white font-medium text-sm">{prog.name}</p>
              <p className="font-heading font-bold text-accent text-lg">{prog.amount}</p>
              <p className="font-body text-white/50 text-xs mt-1">{prog.who}</p>
            </div>
          ))}
        </div>
      </div>

      {/* === Quick Qualification Check === */}
      <div className="bg-gray-50 border border-border p-6 md:p-8">
        <h3 className="font-heading font-bold text-primary text-lg mb-2">
          Can You Afford This Home?
        </h3>
        <p className="font-body text-muted text-sm mb-4">
          Quick check based on the 28% debt-to-income rule. Not a guarantee — just a starting point.
        </p>

        {!showQualify ? (
          <button
            onClick={() => setShowQualify(true)}
            className="btn-primary px-8 py-3"
          >
            Check If You Qualify
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="font-body text-xs tracking-[0.15em] uppercase text-muted block mb-2">
                Annual Household Income
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="$75,000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="font-body text-sm border border-border px-4 py-3 w-48
                             focus:outline-none focus:border-accent"
                />
                <button
                  onClick={checkQualification}
                  className="btn-primary px-6 py-3 text-sm"
                >
                  Check
                </button>
              </div>
            </div>
            {result && (
              <div className="bg-white border border-accent/30 p-4">
                <p className="font-body text-dark text-sm leading-relaxed">{result}</p>
                <a
                  href="tel:+18137337907"
                  className="inline-block mt-3 font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors"
                >
                  Call Barrett (813) 733-7907 →
                </a>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/mortgage-calculator/"
            className="font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors"
          >
            Full Calculator →
          </Link>
          <Link
            href="/guides/first-time-home-buyer-guide/"
            className="font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors"
          >
            First-Time Buyer Guide →
          </Link>
          <Link
            href="/guides/va-home-loan-guide/"
            className="font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors"
          >
            VA Loan Guide →
          </Link>
        </div>
      </div>
    </section>
  );
}
