// =============================================================================
// /mortgage-calculator — Mortgage calculator page
// =============================================================================

"use client";

import { useState } from "react";
import Link from "next/link";

export default function MortgageCalculatorPage() {
  // --- Calculator state ---
  const [price, setPrice] = useState(400000);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [tax, setTax] = useState(4000);
  const [insurance, setInsurance] = useState(2400);

  // --- Calculation ---
  const loanAmount = price * (1 - down / 100);
  const monthlyRate = rate / 100 / 12;
  const numPayments = term * 12;
  const monthlyPI =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;
  const monthlyTax = tax / 12;
  const monthlyInsurance = insurance / 12;
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance;

  // --- Format currency ---
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      {/* === Header === */}
      <section className="bg-primary py-16">
        <div className="container-wide text-center">
          <h1 className="heading-display text-display md:text-display-lg text-white mb-4">
            Mortgage Calculator
          </h1>
          <p className="font-body text-accent text-lg max-w-2xl mx-auto">
            Estimate your monthly payment for a Tampa Bay home. Adjust the inputs below.
          </p>
        </div>
      </section>

      {/* === Calculator === */}
      <section className="container-wide py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-body text-sm font-semibold text-primary mb-1">
                  Home Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 font-body text-dark"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-semibold text-primary mb-1">
                  Down Payment (%)
                </label>
                <input
                  type="number"
                  value={down}
                  onChange={(e) => setDown(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 font-body text-dark"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-semibold text-primary mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 font-body text-dark"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-semibold text-primary mb-1">
                  Loan Term (years)
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 font-body text-dark"
                >
                  <option value={30}>30 years</option>
                  <option value={15}>15 years</option>
                </select>
              </div>
              <div>
                <label className="block font-body text-sm font-semibold text-primary mb-1">
                  Annual Property Tax
                </label>
                <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 font-body text-dark"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-semibold text-primary mb-1">
                  Annual Insurance
                </label>
                <input
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 font-body text-dark"
                />
              </div>
            </div>

            {/* Results */}
            <div className="bg-primary/5 rounded-lg p-6">
              <div className="text-center mb-4">
                <span className="font-body text-sm text-muted">Estimated Monthly Payment</span>
                <div className="font-heading font-bold text-4xl text-primary">
                  {fmt(totalMonthly)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <span className="block font-body text-muted">Principal & Interest</span>
                  <span className="font-semibold text-primary">{fmt(monthlyPI)}</span>
                </div>
                <div>
                  <span className="block font-body text-muted">Property Tax</span>
                  <span className="font-semibold text-primary">{fmt(monthlyTax)}</span>
                </div>
                <div>
                  <span className="block font-body text-muted">Insurance</span>
                  <span className="font-semibold text-primary">{fmt(monthlyInsurance)}</span>
                </div>
              </div>
              <p className="text-xs text-muted text-center mt-4">
                Loan amount: {fmt(loanAmount)} | Down payment: {fmt(price * down / 100)}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="font-body text-muted mb-4">
              Want an exact quote? Barrett works with trusted local lenders.
            </p>
            <Link href="/lenders" className="btn-primary inline-block px-8 py-3">
              Get a Lender Referral
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
