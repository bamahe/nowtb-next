"use client";

// ClientMarketSnapshot — Client-side market stats for housing-market spoke pages.
// Fetches live listings and displays key stats without blocking server render.

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Listing } from "@/lib/types";

interface ClientMarketSnapshotProps {
  cityName: string;
  zipCodes: string[];
  marketUpdateSlug?: string;
}

interface MarketStats {
  activeCount: number;
  medianPrice: number | null;
  avgDom: number | null;
  avgPricePerSqft: number | null;
}

function computeStats(listings: Listing[]): MarketStats {
  const active = listings.filter((l) => l.ListPrice > 0);
  const prices = active.map((l) => l.ListPrice).sort((a, b) => a - b);
  const mid = Math.floor(prices.length / 2);
  const medianPrice =
    prices.length === 0
      ? null
      : prices.length % 2
      ? prices[mid]
      : Math.round((prices[mid - 1] + prices[mid]) / 2);

  const domVals = active
    .filter((l) => l.DaysOnMarket != null)
    .map((l) => l.DaysOnMarket as number);
  const avgDom =
    domVals.length > 0
      ? Math.round(domVals.reduce((s, v) => s + v, 0) / domVals.length)
      : null;

  const psfVals = active
    .filter((l) => l.LivingArea && l.LivingArea > 0)
    .map((l) => Math.round(l.ListPrice / l.LivingArea!));
  const avgPricePerSqft =
    psfVals.length > 0
      ? Math.round(psfVals.reduce((s, v) => s + v, 0) / psfVals.length)
      : null;

  return { activeCount: listings.length, medianPrice, avgDom, avgPricePerSqft };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ClientMarketSnapshot({
  cityName,
  zipCodes,
  marketUpdateSlug,
}: ClientMarketSnapshotProps) {
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!zipCodes || zipCodes.length === 0) {
      setLoading(false);
      return;
    }
    const params = new URLSearchParams({
      zip_codes: zipCodes.join(","),
      limit: "100",
      exclude_rental: "true",
    });
    fetch(`/api/listings?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setStats(computeStats(data.value || []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [zipCodes]);

  if (loading) {
    return (
      <section className="bg-gray-50 border-t border-gray-200 py-10">
        <div className="container-wide">
          <p className="text-gray-400 text-sm">Loading market data...</p>
        </div>
      </section>
    );
  }

  if (!stats || stats.activeCount === 0) return null;

  return (
    <section className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {cityName} Housing Market Snapshot
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-primary">{stats.activeCount}</div>
            <div className="text-sm text-gray-500 mt-1">Active Listings</div>
          </div>
          {stats.medianPrice && (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-primary">{fmt(stats.medianPrice)}</div>
              <div className="text-sm text-gray-500 mt-1">Median List Price</div>
            </div>
          )}
          {stats.avgDom !== null && (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-primary">{stats.avgDom}</div>
              <div className="text-sm text-gray-500 mt-1">Avg. Days on Market</div>
            </div>
          )}
          {stats.avgPricePerSqft !== null && (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-primary">${stats.avgPricePerSqft}</div>
              <div className="text-sm text-gray-500 mt-1">Avg. Price per Sq Ft</div>
            </div>
          )}
        </div>
        {marketUpdateSlug && (
          <Link
            href={`/blog/${marketUpdateSlug}/`}
            className="inline-flex items-center text-primary font-semibold hover:underline text-sm"
          >
            View full {cityName} market report &rarr;
          </Link>
        )}
      </div>
    </section>
  );
}
