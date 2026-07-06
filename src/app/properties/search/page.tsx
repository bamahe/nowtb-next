// =============================================================================
// Advanced Map Search — Split-panel property search with interactive Leaflet map
// "use client" because it needs interactive state, URL params, and DOM for Leaflet
// Route: /properties/search/
// =============================================================================

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, X, Map, List, ChevronDown } from "lucide-react";
import type { Listing } from "@/lib/types";
import { formatPrice, formatSqFt, getListingUrl, getListingPhotoUrl } from "@/lib/utils";
import SaveSearchButton from "@/components/ui/SaveSearchButton";

// -----------------------------------------------------------------------------
// Constants — filter options
// -----------------------------------------------------------------------------

/** Price dropdown options (value in dollars) */
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

/** Max price uses the same values but with "No Max" as default */
const MAX_PRICE_OPTIONS = [
  { label: "No Max", value: "" },
  ...PRICE_OPTIONS.slice(1),
] as const;

/** Bedroom filter options */
const BED_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
  { label: "5+", value: "5" },
] as const;

/** Bathroom filter options */
const BATH_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
] as const;

/** Property type options */
const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Residential", value: "Residential" },
  { label: "Condo", value: "Condominium" },
  { label: "Land", value: "Land" },
  { label: "Commercial", value: "Commercial" },
] as const;

/** Sort options */
const SORT_OPTIONS = [
  { label: "Newest", value: "ModificationTimestamp desc" },
  { label: "Price: High to Low", value: "ListPrice desc" },
  { label: "Price: Low to High", value: "ListPrice asc" },
  { label: "Beds", value: "BedroomsTotal desc" },
  { label: "Sqft", value: "LivingArea desc" },
] as const;

/** "More Filters" toggle options — boolean feature flags */
const MORE_FILTERS = [
  { label: "Pool", param: "pool" },
  { label: "Waterfront", param: "waterfront" },
  { label: "New Construction", param: "new_construction" },
  { label: "55+", param: "senior" },
  { label: "Single Story", param: "single_story" },
  { label: "Open Houses", param: "open_house" },
] as const;

/** How many listings to load per page */
const PAGE_SIZE = 48;

// -----------------------------------------------------------------------------
// Status badge colors (matches ListingCard pattern)
// -----------------------------------------------------------------------------

const statusColors: Record<string, string> = {
  Active: "bg-green-600 text-white",
  Pending: "bg-yellow-600 text-white",
  "Coming Soon": "bg-accent text-primary",
  Closed: "bg-muted text-white",
};

// -----------------------------------------------------------------------------
// Main page component
// -----------------------------------------------------------------------------

export default function AdvancedSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- State ---
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  // Mobile toggle: "list" or "map" view
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  // Local state for the search input (synced with URL on submit)
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  // Ref for the map container div (Leaflet attaches here)
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // Leaflet map instance ref
  const mapInstanceRef = useRef<unknown>(null);
  // Leaflet marker layer group ref (so we can clear/rebuild markers)
  const markerLayerRef = useRef<unknown>(null);

  // -------------------------------------------------------------------------
  // URL param helpers — read current filters from the URL
  // -------------------------------------------------------------------------

  /** Read a single search param value, or empty string if missing */
  const getParam = useCallback(
    (key: string) => searchParams.get(key) || "",
    [searchParams]
  );

  /** Check if a boolean feature filter is active */
  const isFeatureActive = useCallback(
    (param: string) => searchParams.get(param) === "true",
    [searchParams]
  );

  // -------------------------------------------------------------------------
  // Update URL search params (triggers re-fetch via useEffect)
  // -------------------------------------------------------------------------

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset pagination when filters change
      params.delete("page");
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "") params.delete(key);
        else params.set(key, val);
      });
      const qs = params.toString();
      router.push(qs ? `/properties/search?${qs}` : "/properties/search");
    },
    [router, searchParams]
  );

  // -------------------------------------------------------------------------
  // Fetch listings from the API whenever URL params change
  // -------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function fetchListings() {
      setLoading(true);
      try {
        // Forward all current URL params to the API
        const apiParams = new URLSearchParams(searchParams.toString());
        // Set a higher limit for map search
        if (!apiParams.has("limit")) apiParams.set("limit", String(PAGE_SIZE));

        const res = await fetch(`/api/listings?${apiParams.toString()}`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();

        if (!cancelled) {
          setListings(data.value || []);
          // OData returns total as @odata.count or in our mapped 'total' field
          setTotal(data.total || data["@odata.count"] || 0);
        }
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        if (!cancelled) {
          setListings([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchListings();
    return () => { cancelled = true; };
  }, [searchParams]);

  // -------------------------------------------------------------------------
  // Initialize Leaflet map (once, on mount)
  // -------------------------------------------------------------------------

  useEffect(() => {
    // Skip if already initialized or no container
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    // Inject Leaflet CSS if not already present
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Dynamic import of Leaflet (avoids SSR window errors)
    import("leaflet").then((L) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      // Create the map centered on Tampa Bay
      const map = L.map(mapContainerRef.current, {
        center: [28.0, -82.45],
        zoom: 9,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      // OpenStreetMap tiles (free, no API key needed)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Create a layer group for listing markers (so we can clear/rebuild them)
      const markerLayer = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markerLayerRef.current = markerLayer;
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
        markerLayerRef.current = null;
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // Update map markers whenever listings change
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!mapInstanceRef.current || !markerLayerRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current as L.Map;
      const markerLayer = markerLayerRef.current as L.LayerGroup;

      // Clear existing markers
      markerLayer.clearLayers();

      // Only add markers for listings that have lat/lng coordinates
      const geoListings = listings.filter(
        (l) => l.Latitude && l.Longitude && l.Latitude !== 0 && l.Longitude !== 0
      );

      if (geoListings.length === 0) return;

      // Custom pin icon — small navy circle with accent border
      const pinIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:14px;height:14px;
          background:#0c1829;
          border:2px solid #93b4d4;
          border-radius:50%;
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      // Add a marker for each listing with coordinates
      geoListings.forEach((listing) => {
        const photoUrl = getListingPhotoUrl(listing);
        const url = getListingUrl(listing);
        const address = listing.UnparsedAddress || "Address unavailable";

        const marker = L.marker([listing.Latitude!, listing.Longitude!], {
          icon: pinIcon,
        }).addTo(markerLayer);

        // Popup with photo thumbnail, price, address, and a link to the detail page
        marker.bindPopup(
          `<div style="font-family:system-ui,sans-serif;width:220px;padding:0;margin:0;">
            <img src="${photoUrl}" alt="${address}"
                 style="width:100%;height:120px;object-fit:cover;display:block;" />
            <div style="padding:10px 12px;">
              <p style="margin:0 0 4px;font-weight:600;font-size:15px;color:#0c1829;">
                ${formatPrice(listing.ListPrice)}
              </p>
              <p style="margin:0 0 4px;font-size:12px;color:#6b7a8d;">
                ${address}
              </p>
              <p style="margin:0 0 8px;font-size:11px;color:#6b7a8d;">
                ${listing.BedroomsTotal ?? "—"} bed &middot;
                ${listing.BathroomsTotalInteger ?? "—"} bath
                ${listing.LivingArea ? ` &middot; ${listing.LivingArea.toLocaleString()} sqft` : ""}
              </p>
              <a href="${url}"
                 style="font-size:11px;font-weight:600;color:#93b4d4;text-decoration:none;text-transform:uppercase;letter-spacing:0.1em;">
                View Details &rarr;
              </a>
            </div>
          </div>`,
          { closeButton: true, maxWidth: 240, minWidth: 220, className: "listing-popup" }
        );
      });

      // Auto-fit map bounds to show all markers
      const bounds = L.latLngBounds(
        geoListings.map((l) => [l.Latitude!, l.Longitude!] as [number, number])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    });
  }, [listings]);

  // -------------------------------------------------------------------------
  // Handle search form submission
  // -------------------------------------------------------------------------

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <>
      {/* ================================================================
          STICKY FILTER BAR — full-width, pinned to top below site header
          ================================================================ */}
      <div className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        {/* --- Row 1: Search input + core filters --- */}
        <div className="px-4 py-3">
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
            {/* Search input */}
            <div className="flex items-center gap-2 border border-border px-3 py-2 bg-white flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted flex-shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="City, ZIP, neighborhood, address..."
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

            {/* Price min */}
            <select
              value={getParam("min_price")}
              onChange={(e) => updateParams({ min_price: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent"
            >
              {PRICE_OPTIONS.map((opt) => (
                <option key={`min-${opt.value}`} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Price max */}
            <select
              value={getParam("max_price")}
              onChange={(e) => updateParams({ max_price: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent"
            >
              {MAX_PRICE_OPTIONS.map((opt) => (
                <option key={`max-${opt.value}`} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Beds */}
            <select
              value={getParam("beds")}
              onChange={(e) => updateParams({ beds: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent hidden sm:block"
            >
              {BED_OPTIONS.map((opt) => (
                <option key={`bed-${opt.value}`} value={opt.value}>
                  {opt.value ? `${opt.label} Beds` : "Beds"}
                </option>
              ))}
            </select>

            {/* Baths */}
            <select
              value={getParam("baths")}
              onChange={(e) => updateParams({ baths: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent hidden sm:block"
            >
              {BATH_OPTIONS.map((opt) => (
                <option key={`bath-${opt.value}`} value={opt.value}>
                  {opt.value ? `${opt.label} Baths` : "Baths"}
                </option>
              ))}
            </select>

            {/* Home Type */}
            <select
              value={getParam("property_type")}
              onChange={(e) => updateParams({ property_type: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent hidden md:block"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={getParam("sort")}
              onChange={(e) => updateParams({ sort: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent hidden lg:block"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* More Filters toggle */}
            <button
              type="button"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`flex items-center gap-1.5 font-body text-[10px] font-medium tracking-[0.12em] uppercase
                         px-3 py-2 border transition-all duration-300
                         ${showMoreFilters
                           ? "bg-primary text-white border-primary"
                           : "bg-transparent text-muted border-border hover:border-primary hover:text-primary"
                         }`}
            >
              <SlidersHorizontal size={12} />
              More
              <ChevronDown size={10} className={`transition-transform ${showMoreFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Search button */}
            <button
              type="submit"
              className="font-body text-[10px] font-medium tracking-[0.15em] uppercase
                         px-4 py-2 bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Search
            </button>

            {/* Save Search */}
            <SaveSearchButton />
          </form>
        </div>

        {/* --- Row 2: More Filters (collapsible) --- */}
        {showMoreFilters && (
          <div className="px-4 pb-3 flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
            {/* Beds/baths visible on mobile when "More" is open */}
            <select
              value={getParam("beds")}
              onChange={(e) => updateParams({ beds: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent sm:hidden"
            >
              {BED_OPTIONS.map((opt) => (
                <option key={`bed-m-${opt.value}`} value={opt.value}>
                  {opt.value ? `${opt.label} Beds` : "Beds"}
                </option>
              ))}
            </select>

            <select
              value={getParam("baths")}
              onChange={(e) => updateParams({ baths: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent sm:hidden"
            >
              {BATH_OPTIONS.map((opt) => (
                <option key={`bath-m-${opt.value}`} value={opt.value}>
                  {opt.value ? `${opt.label} Baths` : "Baths"}
                </option>
              ))}
            </select>

            {/* Property type visible on mobile */}
            <select
              value={getParam("property_type")}
              onChange={(e) => updateParams({ property_type: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent md:hidden"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={`type-m-${opt.value}`} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Sort visible on mobile */}
            <select
              value={getParam("sort")}
              onChange={(e) => updateParams({ sort: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border px-3 py-2
                         focus:outline-none focus:border-accent lg:hidden"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={`sort-m-${opt.value}`} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Feature toggle pills */}
            {MORE_FILTERS.map((feat) => {
              const active = isFeatureActive(feat.param);
              return (
                <button
                  key={feat.param}
                  type="button"
                  onClick={() => updateParams({ [feat.param]: active ? null : "true" })}
                  className={`font-body text-[10px] font-medium tracking-[0.12em] uppercase
                             px-3 py-2 border transition-all duration-300
                             ${active
                               ? "bg-primary text-white border-primary"
                               : "bg-transparent text-muted border-border hover:border-primary hover:text-primary"
                             }`}
                >
                  {feat.label}
                </button>
              );
            })}

            {/* Clear all filters */}
            {searchParams.toString().length > 0 && (
              <button
                type="button"
                onClick={() => { setSearchInput(""); router.push("/properties/search"); }}
                className="font-body text-[10px] font-medium tracking-[0.12em] uppercase
                           text-accent hover:text-primary transition-colors ml-auto"
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================================================================
          MOBILE VIEW TOGGLE — only visible on small screens
          ================================================================ */}
      <div className="md:hidden sticky top-[60px] z-30 bg-white border-b border-border flex">
        <button
          onClick={() => setMobileView("list")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-body text-[10px]
                     font-medium tracking-[0.15em] uppercase transition-colors
                     ${mobileView === "list" ? "bg-primary text-white" : "text-muted hover:text-primary"}`}
        >
          <List size={14} />
          Listings
        </button>
        <button
          onClick={() => setMobileView("map")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-body text-[10px]
                     font-medium tracking-[0.15em] uppercase transition-colors
                     ${mobileView === "map" ? "bg-primary text-white" : "text-muted hover:text-primary"}`}
        >
          <Map size={14} />
          Map
        </button>
      </div>

      {/* ================================================================
          SPLIT LAYOUT — listings panel (left) + map (right)
          Full viewport height minus header/filter bar
          ================================================================ */}
      <div className="flex flex-col md:flex-row" style={{ height: "calc(100vh - 120px)" }}>
        {/* ---- LEFT PANEL: Scrollable listing cards ---- */}
        <div
          className={`md:w-[45%] lg:w-[40%] xl:w-[38%] overflow-y-auto border-r border-border bg-white
                     ${mobileView === "map" ? "hidden md:block" : "block"}`}
        >
          {/* Result count header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-border/50 px-4 py-3
                          flex items-center justify-between">
            <p className="font-body text-xs text-muted font-light tracking-wide">
              {loading ? "Searching..." : `${total.toLocaleString()} ${total === 1 ? "listing" : "listings"} found`}
            </p>
            <Link
              href="/properties"
              className="font-body text-[10px] text-accent hover:text-primary tracking-[0.1em] uppercase transition-colors"
            >
              Grid View
            </Link>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="p-4 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="w-28 h-20 bg-primary/5 flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-primary/5 w-24" />
                    <div className="h-3 bg-primary/5 w-full" />
                    <div className="h-3 bg-primary/5 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Listing cards */}
          {!loading && listings.length > 0 && (
            <div className="divide-y divide-border/50">
              {listings.map((listing) => (
                <ListingRow key={listing.ListingKey} listing={listing} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && listings.length === 0 && (
            <div className="p-8 text-center">
              <p className="font-heading text-lg text-primary mb-2">No Listings Found</p>
              <p className="font-body text-sm text-muted font-light mb-6">
                Try adjusting your filters or expanding your search area.
              </p>
              <button
                onClick={() => { setSearchInput(""); router.push("/properties/search"); }}
                className="font-body text-[10px] font-medium tracking-[0.15em] uppercase
                           px-5 py-2.5 bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* ---- RIGHT PANEL: Leaflet map ---- */}
        <div
          className={`flex-1 relative bg-light
                     ${mobileView === "list" ? "hidden md:block" : "block"}`}
        >
          <div ref={mapContainerRef} className="absolute inset-0" />
          {/* Map loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 pointer-events-none">
              <p className="font-body text-xs text-muted tracking-widest uppercase animate-pulse">
                Loading map...
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// =============================================================================
// ListingRow — Compact horizontal listing card for the search panel
// =============================================================================

function ListingRow({ listing }: { listing: Listing }) {
  const photoUrl = getListingPhotoUrl(listing);
  const url = getListingUrl(listing);
  const address = listing.UnparsedAddress || "Address unavailable";
  const cityStateZip = `${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}`;
  const badgeClass = statusColors[listing.StandardStatus] ?? "bg-muted text-white";

  return (
    <Link href={url} className="flex gap-3 p-4 hover:bg-light/50 transition-colors group">
      {/* Thumbnail */}
      <div className="relative w-28 h-20 flex-shrink-0 overflow-hidden bg-primary/5">
        <Image
          src={photoUrl}
          alt={address}
          fill
          sizes="112px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status badge */}
        <span
          className={`absolute left-1 top-1 px-1.5 py-0.5 text-[8px] font-medium font-body
                     uppercase tracking-wider ${badgeClass}`}
        >
          {listing.StandardStatus}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Price */}
        <p className="font-heading font-light text-base text-primary tracking-wide">
          {formatPrice(listing.ListPrice)}
        </p>
        {/* Address */}
        <p className="font-body text-xs text-primary/80 truncate">{address}</p>
        <p className="font-body text-[10px] text-muted">{cityStateZip}</p>
        {/* Stats */}
        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted font-body tracking-wider uppercase">
          {listing.BedroomsTotal != null && <span>{listing.BedroomsTotal} Bed</span>}
          {listing.BathroomsTotalInteger != null && <span>{listing.BathroomsTotalInteger} Bath</span>}
          {listing.LivingArea != null && <span>{formatSqFt(listing.LivingArea)}</span>}
        </div>
      </div>
    </Link>
  );
}
