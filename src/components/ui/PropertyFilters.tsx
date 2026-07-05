// =============================================================================
// PropertyFilters — Sort, property type, and feature filter controls
// "use client" because it reads/writes URL search params on user interaction
// Matches the luxury minimalist style: uppercase labels, wide tracking, no rounded corners
// =============================================================================

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// ---------------------------------------------------------------------------
// Sort options — maps display label to OData $orderby value
// ---------------------------------------------------------------------------
const SORT_OPTIONS = [
  { label: "Newest", value: "ModificationTimestamp desc" },
  { label: "Price: High to Low", value: "ListPrice desc" },
  { label: "Price: Low to High", value: "ListPrice asc" },
  { label: "Beds", value: "BedroomsTotal desc" },
  { label: "Sqft", value: "LivingArea desc" },
] as const;

// ---------------------------------------------------------------------------
// Property type options — maps to Bridge API PropertyType field
// ---------------------------------------------------------------------------
const PROPERTY_TYPES = [
  { label: "All Types", value: "" },
  { label: "Residential", value: "Residential" },
  { label: "Condos & Townhomes", value: "Condominium" },
  { label: "Land", value: "Land" },
  { label: "Commercial", value: "Commercial" },
] as const;

// ---------------------------------------------------------------------------
// Feature toggle filters — boolean MLS fields shown as pill buttons
// ---------------------------------------------------------------------------
const FEATURE_FILTERS = [
  { label: "Pool", param: "pool" },
  { label: "Waterfront", param: "waterfront" },
  { label: "New Construction", param: "new_construction" },
  { label: "55+", param: "senior" },
  { label: "Single Story", param: "single_story" },
  { label: "Open Houses", param: "open_house" },
  { label: "Rentals Only", param: "rental" },
  { label: "Exclude Rentals", param: "exclude_rental" },
] as const;

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper: build a new URL with updated params, preserving existing ones
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset to page 1 when filters change
      params.delete("page");
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      const qs = params.toString();
      router.push(qs ? `/properties?${qs}` : "/properties");
    },
    [router, searchParams]
  );

  // Current values from URL
  const currentSort = searchParams.get("sort") || "";
  const currentType = searchParams.get("property_type") || "";

  return (
    <div className="container-wide py-5 border-b border-black/5 space-y-4">
      {/* Row 1: Sort + Property Type dropdowns */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="font-body text-[10px] font-medium tracking-[0.2em] uppercase text-muted"
          >
            Sort
          </label>
          <select
            id="sort-select"
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value || null })}
            className="font-body text-xs font-light tracking-wide text-primary
                       bg-transparent border border-border px-3 py-2
                       focus:outline-none focus:border-accent transition-colors"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Property type dropdown */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="type-select"
            className="font-body text-[10px] font-medium tracking-[0.2em] uppercase text-muted"
          >
            Type
          </label>
          <select
            id="type-select"
            value={currentType}
            onChange={(e) => updateParams({ property_type: e.target.value || null })}
            className="font-body text-xs font-light tracking-wide text-primary
                       bg-transparent border border-border px-3 py-2
                       focus:outline-none focus:border-accent transition-colors"
          >
            {PROPERTY_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price range inputs */}
        <div className="flex items-center gap-2">
          <label className="font-body text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
            Price
          </label>
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("min_price") || ""}
            onBlur={(e) => updateParams({ min_price: e.target.value || null })}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateParams({ min_price: (e.target as HTMLInputElement).value || null });
            }}
            className="font-body text-xs font-light tracking-wide text-primary
                       bg-transparent border border-border px-3 py-2 w-24
                       focus:outline-none focus:border-accent transition-colors
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-muted text-xs">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("max_price") || ""}
            onBlur={(e) => updateParams({ max_price: e.target.value || null })}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateParams({ max_price: (e.target as HTMLInputElement).value || null });
            }}
            className="font-body text-xs font-light tracking-wide text-primary
                       bg-transparent border border-border px-3 py-2 w-24
                       focus:outline-none focus:border-accent transition-colors
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Beds & Baths */}
        <div className="flex items-center gap-2">
          <label className="font-body text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
            Beds
          </label>
          <select
            value={searchParams.get("beds") || ""}
            onChange={(e) => updateParams({ beds: e.target.value || null })}
            className="font-body text-xs font-light tracking-wide text-primary
                       bg-transparent border border-border px-3 py-2
                       focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={String(n)}>{n}+</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-body text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
            Baths
          </label>
          <select
            value={searchParams.get("baths") || ""}
            onChange={(e) => updateParams({ baths: e.target.value || null })}
            className="font-body text-xs font-light tracking-wide text-primary
                       bg-transparent border border-border px-3 py-2
                       focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={String(n)}>{n}+</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Feature toggle pills */}
      <div className="flex flex-wrap items-center gap-2">
        {FEATURE_FILTERS.map((feat) => {
          const isActive = searchParams.get(feat.param) === "true";
          return (
            <button
              key={feat.param}
              onClick={() =>
                updateParams({ [feat.param]: isActive ? null : "true" })
              }
              className={`font-body text-[10px] font-medium tracking-[0.15em] uppercase
                         px-4 py-2 border transition-all duration-300
                         ${
                           isActive
                             ? "bg-primary text-white border-primary"
                             : "bg-transparent text-muted border-border hover:border-primary hover:text-primary"
                         }`}
            >
              {feat.label}
            </button>
          );
        })}

        {/* Clear all filters button — only shows when filters are active */}
        {searchParams.toString() && (
          <button
            onClick={() => router.push("/properties")}
            className="font-body text-[10px] font-medium tracking-[0.15em] uppercase
                       px-4 py-2 text-accent hover:text-primary transition-colors duration-300"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
