// =============================================================================
// PropertyFilters — Unified search + filter bar for the properties page
// "use client" because it reads/writes URL search params on user interaction
// =============================================================================

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

// Sort options
const SORT_OPTIONS = [
  { label: "Newest", value: "ModificationTimestamp desc" },
  { label: "Price: High to Low", value: "ListPrice desc" },
  { label: "Price: Low to High", value: "ListPrice asc" },
  { label: "Beds", value: "BedroomsTotal desc" },
  { label: "Sqft", value: "LivingArea desc" },
] as const;

// Property types
const PROPERTY_TYPES = [
  { label: "All Types", value: "" },
  { label: "Residential", value: "Residential" },
  { label: "Condos & Townhomes", value: "Condominium" },
  { label: "Land", value: "Land" },
  { label: "Commercial", value: "Commercial" },
] as const;

// Feature pills
const FEATURE_FILTERS = [
  { label: "Pool", param: "pool" },
  { label: "Waterfront", param: "waterfront" },
  { label: "New Construction", param: "new_construction" },
  { label: "55+", param: "senior" },
  { label: "Single Story", param: "single_story" },
  { label: "Open Houses", param: "open_house" },
  { label: "Rentals Only", param: "rental" },
] as const;

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "") params.delete(key);
        else params.set(key, val);
      });
      const qs = params.toString();
      router.push(qs ? `/properties?${qs}` : "/properties");
    },
    [router, searchParams]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  }

  const currentSort = searchParams.get("sort") || "";
  const currentType = searchParams.get("property_type") || "";
  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="container-wide py-4 border-b border-black/5">
      {/* === Row 1: Search bar + filter toggle === */}
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        {/* Search input — city, neighborhood, ZIP, or address */}
        <div className="flex-1 flex items-center gap-2 border border-border px-3 py-2.5 bg-white">
          <Search className="h-4 w-4 text-muted flex-shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="City, neighborhood, ZIP, or address..."
            className="flex-1 font-body text-sm text-primary bg-transparent
                       focus:outline-none placeholder:text-muted/50"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => { setSearchInput(""); updateParams({ q: null }); }}
              className="text-muted hover:text-primary"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search button */}
        <button
          type="submit"
          className="font-body text-[10px] font-medium tracking-[0.15em] uppercase
                     px-5 py-3 bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          Search
        </button>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 font-body text-[10px] font-medium tracking-[0.15em] uppercase
                     px-4 py-3 border transition-all duration-300
                     ${showFilters
                       ? "bg-primary text-white border-primary"
                       : "bg-transparent text-muted border-border hover:border-primary hover:text-primary"
                     }`}
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>

        {/* Clear all */}
        {hasFilters && (
          <button
            type="button"
            onClick={() => { setSearchInput(""); router.push("/properties"); }}
            className="font-body text-[10px] font-medium tracking-[0.15em] uppercase
                       text-accent hover:text-primary transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* === Row 2: Sort + Type + Price + Beds/Baths (collapsible) === */}
      {showFilters && (
        <div className="mt-4 space-y-4">
          {/* Dropdowns row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort */}
            <select
              value={currentSort}
              onChange={(e) => updateParams({ sort: e.target.value || null })}
              className="font-body text-xs font-light text-primary
                         bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Type */}
            <select
              value={currentType}
              onChange={(e) => updateParams({ property_type: e.target.value || null })}
              className="font-body text-xs font-light text-primary
                         bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent"
            >
              {PROPERTY_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Price range */}
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="Min $"
                defaultValue={searchParams.get("min_price") || ""}
                onBlur={(e) => updateParams({ min_price: e.target.value || null })}
                onKeyDown={(e) => { if (e.key === "Enter") updateParams({ min_price: (e.target as HTMLInputElement).value || null }); }}
                className="font-body text-xs text-primary bg-white border border-border px-3 py-2 w-24
                           focus:outline-none focus:border-accent
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-muted text-xs">–</span>
              <input
                type="number"
                placeholder="Max $"
                defaultValue={searchParams.get("max_price") || ""}
                onBlur={(e) => updateParams({ max_price: e.target.value || null })}
                onKeyDown={(e) => { if (e.key === "Enter") updateParams({ max_price: (e.target as HTMLInputElement).value || null }); }}
                className="font-body text-xs text-primary bg-white border border-border px-3 py-2 w-24
                           focus:outline-none focus:border-accent
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Beds */}
            <select
              value={searchParams.get("beds") || ""}
              onChange={(e) => updateParams({ beds: e.target.value || null })}
              className="font-body text-xs font-light text-primary
                         bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent"
            >
              <option value="">Beds</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={String(n)}>{n}+ Beds</option>
              ))}
            </select>

            {/* Baths */}
            <select
              value={searchParams.get("baths") || ""}
              onChange={(e) => updateParams({ baths: e.target.value || null })}
              className="font-body text-xs font-light text-primary
                         bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent"
            >
              <option value="">Baths</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={String(n)}>{n}+ Baths</option>
              ))}
            </select>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center gap-2">
            {FEATURE_FILTERS.map((feat) => {
              const isActive = searchParams.get(feat.param) === "true";
              return (
                <button
                  key={feat.param}
                  onClick={() => updateParams({ [feat.param]: isActive ? null : "true" })}
                  className={`font-body text-[10px] font-medium tracking-[0.15em] uppercase
                             px-4 py-2 border transition-all duration-300
                             ${isActive
                               ? "bg-primary text-white border-primary"
                               : "bg-transparent text-muted border-border hover:border-primary hover:text-primary"
                             }`}
                >
                  {feat.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
