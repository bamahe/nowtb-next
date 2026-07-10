// src/app/properties/search/page.tsx
// Property search page shell — manages state + URL params, renders filter bar
// and delegates to GalleryView or MapView depending on the active mode.
// Route: /properties/search/
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Map, LayoutGrid } from "lucide-react";
import type { Listing } from "@/lib/types";
import GalleryView from "@/components/search/GalleryView";
import MapView from "@/components/search/MapView";
import FilterPanel from "@/components/search/FilterPanel";
import SaveSearchButton from "@/components/ui/SaveSearchButton";

// ── Filter option constants ──────────────────────────────────────────────────

const PRICE_OPTIONS = [
  { label: "No Min", value: "" },
  { label: "$100K", value: "100000" },
  { label: "$200K", value: "200000" },
  { label: "$300K", value: "300000" },
  { label: "$400K", value: "400000" },
  { label: "$500K", value: "500000" },
  { label: "$750K", value: "750000" },
  { label: "$1M", value: "1000000" },
  { label: "$1.5M", value: "1500000" },
  { label: "$2M+", value: "2000000" },
] as const;

const MAX_PRICE_OPTIONS = [
  { label: "No Max", value: "" },
  ...PRICE_OPTIONS.slice(1),
] as const;

const BED_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
  { label: "5+", value: "5" },
] as const;

const BATH_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
] as const;

const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Residential", value: "Residential" },
  { label: "Condo", value: "Condominium" },
  { label: "Land", value: "Land" },
  { label: "Commercial", value: "Commercial" },
] as const;

const SORT_OPTIONS = [
  { label: "Newest", value: "ModificationTimestamp desc" },
  { label: "Price: High to Low", value: "ListPrice desc" },
  { label: "Price: Low to High", value: "ListPrice asc" },
  { label: "Most Beds", value: "BedroomsTotal desc" },
  { label: "Largest", value: "LivingArea desc" },
] as const;

/** Number of listings to fetch per page */
const PAGE_SIZE = 48;

/**
 * Keys that belong to the "More Filters" panel (not the main filter bar).
 * Used to count active advanced filters and highlight the More Filters button.
 */
const MORE_FILTER_KEYS = [
  "pool", "waterfront", "new_construction", "single_story",
  "senior", "garage", "open_house", "price_reduced",
  "keyword", "min_sqft", "max_sqft", "min_year",
];

// ── Main page component ──────────────────────────────────────────────────────

export default function PropertySearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Listings data
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // UI state
  const [viewMode, setViewMode] = useState<"gallery" | "map">("gallery");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Local search input (only pushed to URL on form submit)
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  // Current page comes from the URL param so browser back/forward works
  const currentPage = Number(searchParams.get("page") || "1");

  // ── URL param helpers ──

  /** Read a single URL param value, returns "" if missing */
  const getParam = useCallback(
    (key: string) => searchParams.get(key) || "",
    [searchParams]
  );

  /** Count how many "More Filters" keys have active values */
  const activeMoreFilters = MORE_FILTER_KEYS.filter((k) => searchParams.get(k)).length;

  // ── URL param updater — resets page on filter change ──

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset to page 1 whenever filters change (unless the update IS a page change)
      if (!("page" in updates)) params.delete("page");
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "") params.delete(key);
        else params.set(key, val);
      });
      const qs = params.toString();
      router.push(qs ? `/properties/search?${qs}` : "/properties/search");
    },
    [router, searchParams]
  );

  // ── Fetch listings whenever URL params change ──

  useEffect(() => {
    let cancelled = false;

    async function fetchListings() {
      setLoading(true);
      try {
        // Forward all current URL params to the /api/listings route
        const apiParams = new URLSearchParams(searchParams.toString());
        // Ensure page size is set
        if (!apiParams.has("limit")) apiParams.set("limit", String(PAGE_SIZE));
        // Convert page number to offset (API uses offset, not page number)
        const page = Number(apiParams.get("page") || "1");
        if (page > 1) {
          apiParams.set("offset", String((page - 1) * PAGE_SIZE));
        }
        apiParams.delete("page"); // API doesn't accept "page" — uses "offset"

        const res = await fetch(`/api/listings?${apiParams.toString()}`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();

        if (!cancelled) {
          setListings(data.value || []);
          // API may return total as either "total" or OData "@odata.count"
          setTotal(data.total || data["@odata.count"] || 0);
        }
      } catch {
        if (!cancelled) {
          setListings([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchListings();
    // Cleanup: ignore stale responses if params change before fetch completes
    return () => { cancelled = true; };
  }, [searchParams]);

  // ── Event handlers ──

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  }

  function handlePageChange(page: number) {
    updateParams({ page: page > 1 ? String(page) : null });
    // Scroll back to top so user sees the new page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Build a plain object of current filters to pass into FilterPanel
  const currentFilters: Record<string, string> = {};
  searchParams.forEach((val, key) => { currentFilters[key] = val; });

  return (
    <>
      {/* ================================================================
          STICKY FILTER BAR — pinned below the site header
          ================================================================ */}
      <div className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="px-4 py-2.5">
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">

            {/* Gallery / Map view toggle */}
            <div className="flex border border-border rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("gallery")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-body font-medium transition-colors
                  ${viewMode === "gallery"
                    ? "bg-primary text-white"
                    : "bg-white text-muted hover:text-primary"}`}
                aria-pressed={viewMode === "gallery"}
              >
                <LayoutGrid size={14} />
                Gallery
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-body font-medium transition-colors
                  ${viewMode === "map"
                    ? "bg-primary text-white"
                    : "bg-white text-muted hover:text-primary"}`}
                aria-pressed={viewMode === "map"}
              >
                <Map size={14} />
                Map
              </button>
            </div>

            {/* Free-text search input (city, ZIP, address, MLS #) */}
            <div className="flex items-center gap-2 border border-border rounded px-3 py-2 bg-white flex-1 min-w-[180px]">
              <Search className="h-4 w-4 text-muted flex-shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Location, Address, MLS #"
                className="flex-1 font-body text-sm text-primary bg-transparent
                           focus:outline-none placeholder:text-muted/50"
              />
              {/* Clear button — only shown when there's text */}
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(""); updateParams({ q: null }); }}
                  className="text-muted hover:text-primary"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Min Price — hidden on smaller screens to save space */}
            <select
              value={getParam("min_price")}
              onChange={(e) => updateParams({ min_price: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border rounded px-3 py-2
                         focus:outline-none focus:border-accent hidden lg:block"
              aria-label="Minimum price"
            >
              <option value="">Price: Any</option>
              {PRICE_OPTIONS.slice(1).map((opt) => (
                <option key={`min-${opt.value}`} value={opt.value}>{opt.label}+</option>
              ))}
            </select>

            {/* Max Price — hidden on smaller screens */}
            <select
              value={getParam("max_price")}
              onChange={(e) => updateParams({ max_price: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border rounded px-3 py-2
                         focus:outline-none focus:border-accent hidden lg:block"
              aria-label="Maximum price"
            >
              {MAX_PRICE_OPTIONS.map((opt) => (
                <option key={`max-${opt.value}`} value={opt.value}>
                  {opt.value ? `Up to ${opt.label}` : "Max Price"}
                </option>
              ))}
            </select>

            {/* Beds — hidden on mobile */}
            <select
              value={getParam("beds")}
              onChange={(e) => updateParams({ beds: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border rounded px-3 py-2
                         focus:outline-none focus:border-accent hidden md:block"
              aria-label="Minimum bedrooms"
            >
              {BED_OPTIONS.map((opt) => (
                <option key={`bed-${opt.value}`} value={opt.value}>
                  Beds: {opt.label}
                </option>
              ))}
            </select>

            {/* Baths — hidden on mobile */}
            <select
              value={getParam("baths")}
              onChange={(e) => updateParams({ baths: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border rounded px-3 py-2
                         focus:outline-none focus:border-accent hidden md:block"
              aria-label="Minimum bathrooms"
            >
              {BATH_OPTIONS.map((opt) => (
                <option key={`bath-${opt.value}`} value={opt.value}>
                  Baths: {opt.label}
                </option>
              ))}
            </select>

            {/* Property Type — hidden until XL */}
            <select
              value={getParam("property_type")}
              onChange={(e) => updateParams({ property_type: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border rounded px-3 py-2
                         focus:outline-none focus:border-accent hidden xl:block"
              aria-label="Property type"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value ? opt.label : "Home Type"}
                </option>
              ))}
            </select>

            {/* More Filters button — badge shows count of active advanced filters */}
            <button
              type="button"
              onClick={() => setFilterPanelOpen(true)}
              className={`flex items-center gap-1.5 font-body text-xs font-medium
                         px-3 py-2 border rounded transition-colors
                         ${activeMoreFilters > 0
                           ? "bg-primary text-white border-primary"
                           : "bg-white text-muted border-border hover:border-primary hover:text-primary"
                         }`}
              aria-label={`More Filters${activeMoreFilters > 0 ? ` (${activeMoreFilters} active)` : ""}`}
            >
              <SlidersHorizontal size={12} />
              More Filters
              {/* Badge showing count of active "more" filters */}
              {activeMoreFilters > 0 && (
                <span className="bg-white text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeMoreFilters}
                </span>
              )}
            </button>

            {/* Sort — hidden on mobile */}
            <select
              value={getParam("sort")}
              onChange={(e) => updateParams({ sort: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border rounded px-3 py-2
                         focus:outline-none focus:border-accent hidden lg:block"
              aria-label="Sort order"
            >
              <option value="">Sort: Newest</option>
              {SORT_OPTIONS.slice(1).map((opt) => (
                <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
              ))}
            </select>

            {/* Save Search — saves current URL params for the user */}
            <SaveSearchButton />
          </form>
        </div>
      </div>

      {/* ================================================================
          VIEW — Gallery (card grid) or Map (split panel)
          ================================================================ */}
      {viewMode === "gallery" ? (
        <GalleryView
          listings={listings}
          loading={loading}
          total={total}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      ) : (
        <MapView
          listings={listings}
          loading={loading}
          total={total}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}

      {/* ================================================================
          FILTER PANEL — slide-out overlay from the right
          ================================================================ */}
      <FilterPanel
        isOpen={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        currentFilters={currentFilters}
        onApply={(filters) => updateParams(filters)}
        onReset={() => { setSearchInput(""); router.push("/properties/search"); }}
      />
    </>
  );
}
