// =============================================================================
// ListingFilters — Filter bar for ClientListings on hub/spoke/neighborhood pages
// Min Price, Max Price, Beds, Baths, Sort, Pool, Waterfront checkboxes
// =============================================================================

"use client";

import { useState } from "react";

interface ListingFiltersProps {
  onFilterChange: (filters: Record<string, string>) => void;
  initialFilters?: Record<string, string>;
  /** Show rental price ranges instead of purchase prices */
  isRental?: boolean;
}

const PURCHASE_PRICE_OPTIONS = [
  { label: "Any", value: "" },
  { label: "$100K", value: "100000" },
  { label: "$200K", value: "200000" },
  { label: "$300K", value: "300000" },
  { label: "$400K", value: "400000" },
  { label: "$500K", value: "500000" },
  { label: "$600K", value: "600000" },
  { label: "$750K", value: "750000" },
  { label: "$1M", value: "1000000" },
  { label: "$1.5M", value: "1500000" },
  { label: "$2M", value: "2000000" },
];

const RENTAL_PRICE_OPTIONS = [
  { label: "Any", value: "" },
  { label: "$1,000/mo", value: "1000" },
  { label: "$1,250/mo", value: "1250" },
  { label: "$1,500/mo", value: "1500" },
  { label: "$1,750/mo", value: "1750" },
  { label: "$2,000/mo", value: "2000" },
  { label: "$2,500/mo", value: "2500" },
  { label: "$3,000/mo", value: "3000" },
  { label: "$3,500/mo", value: "3500" },
  { label: "$4,000/mo", value: "4000" },
  { label: "$5,000/mo", value: "5000" },
];

const BED_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
  { label: "5+", value: "5" },
];

const BATH_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "ModificationTimestamp desc" },
  { label: "Price: Low", value: "ListPrice asc" },
  { label: "Price: High", value: "ListPrice desc" },
  { label: "Largest", value: "LivingArea desc" },
];

export default function ListingFilters({ onFilterChange, initialFilters = {}, isRental = false }: ListingFiltersProps) {
  // Use rental price ranges on rental pages, purchase prices everywhere else
  const PRICE_OPTIONS = isRental ? RENTAL_PRICE_OPTIONS : PURCHASE_PRICE_OPTIONS;
  const [minPrice, setMinPrice] = useState(initialFilters.min_price || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.max_price || "");
  const [beds, setBeds] = useState(initialFilters.beds || "");
  const [baths, setBaths] = useState(initialFilters.baths || "");
  const [sort, setSort] = useState(initialFilters.sort || "ModificationTimestamp desc");
  const [pool, setPool] = useState(initialFilters.pool === "true");
  const [waterfront, setWaterfront] = useState(initialFilters.waterfront === "true");

  function handleSearch() {
    const filters: Record<string, string> = {};
    if (minPrice) filters.min_price = minPrice;
    if (maxPrice) filters.max_price = maxPrice;
    if (beds) filters.beds = beds;
    if (baths) filters.baths = baths;
    if (sort) filters.sort = sort;
    if (pool) filters.pool = "true";
    if (waterfront) filters.waterfront = "true";
    onFilterChange(filters);
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 md:p-6 mb-8 bg-white shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 items-end">
        {/* Min Price */}
        <div>
          <label className="block text-[10px] font-body font-semibold text-muted uppercase tracking-wider mb-1">Min Price</label>
          <select
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-body text-primary bg-white focus:border-primary focus:outline-none"
          >
            {PRICE_OPTIONS.map((o) => (
              <option key={`min-${o.value}`} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-[10px] font-body font-semibold text-muted uppercase tracking-wider mb-1">Max Price</label>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-body text-primary bg-white focus:border-primary focus:outline-none"
          >
            {PRICE_OPTIONS.map((o) => (
              <option key={`max-${o.value}`} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Beds */}
        <div>
          <label className="block text-[10px] font-body font-semibold text-muted uppercase tracking-wider mb-1">Beds</label>
          <select
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-body text-primary bg-white focus:border-primary focus:outline-none"
          >
            {BED_OPTIONS.map((o) => (
              <option key={`bed-${o.value}`} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Baths */}
        <div>
          <label className="block text-[10px] font-body font-semibold text-muted uppercase tracking-wider mb-1">Baths</label>
          <select
            value={baths}
            onChange={(e) => setBaths(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-body text-primary bg-white focus:border-primary focus:outline-none"
          >
            {BATH_OPTIONS.map((o) => (
              <option key={`bath-${o.value}`} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-[10px] font-body font-semibold text-muted uppercase tracking-wider mb-1">Sort By</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-body text-primary bg-white focus:border-primary focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div>
          <button
            onClick={handleSearch}
            className="w-full bg-primary text-white font-semibold py-2.5 px-6 rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Feature checkboxes */}
      <div className="flex flex-wrap gap-4 mt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={pool}
            onChange={(e) => setPool(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-body text-dark">Pool Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={waterfront}
            onChange={(e) => setWaterfront(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-body text-dark">Waterfront Only</span>
        </label>
      </div>
    </div>
  );
}
