# Property Search Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `/properties/search/` to an IDX-style property search with Gallery/Map toggle, price-pin map markers, advanced filter panel with accordion sections, larger listing cards, and pagination.

**Architecture:** Refactor the existing single-file `search/page.tsx` (734 lines) into a multi-component structure. The page component manages state and URL params. View modes (Gallery grid vs Map split-panel) are separate components. The filter panel becomes a slide-out overlay with accordion sections. Map markers switch from plain dots to price-label pins. The existing Leaflet map, API route, and Bridge API integration are reused as-is.

**Tech Stack:** Next.js App Router, React client components, Leaflet (already installed), Tailwind CSS, existing `/api/listings` route and Bridge API integration.

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/app/properties/search/page.tsx` | Rewrite | Page shell: state, URL params, filter bar, view toggle, delegates to child components |
| `src/components/search/GalleryView.tsx` | Create | Card grid layout with large listing cards, pagination |
| `src/components/search/MapView.tsx` | Create | Split-panel: scrollable listing rows (left) + Leaflet map with price pins (right) |
| `src/components/search/FilterPanel.tsx` | Create | Slide-out overlay panel with accordion filter sections |
| `src/components/search/ListingCard.tsx` | Create | Large card for Gallery view: photo, price, beds/baths/sqft/acres/year, address, MLS#, office |
| `src/components/search/PricePin.tsx` | Create | Leaflet divIcon for price-label map markers ("$339K") |
| `src/components/search/Pagination.tsx` | Create | Page navigation with result count, prev/next, page numbers |

---

### Task 1: Create the Pagination Component

**Files:**
- Create: `src/components/search/Pagination.tsx`

- [ ] **Step 1: Create Pagination component**

```tsx
// src/components/search/Pagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalResults, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalResults / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <p className="font-body text-xs text-muted">
        {totalResults.toLocaleString()} Properties
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-8 h-8 flex items-center justify-center rounded border border-border
                     disabled:opacity-30 hover:bg-light transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-body text-sm text-primary font-medium">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded border border-border
                     disabled:opacity-30 hover:bg-light transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/search/Pagination.tsx
git commit -m "feat: add Pagination component for property search"
```

---

### Task 2: Create the Gallery Listing Card

**Files:**
- Create: `src/components/search/ListingCard.tsx`

- [ ] **Step 1: Create ListingCard component**

A larger card with photo carousel dots, price overlay, beds/baths/sqft/acres/year built stats, full address, subdivision, MLS #, and listing office — matching the rmselite design.

```tsx
// src/components/search/ListingCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Ruler, LandPlot, Calendar } from "lucide-react";
import type { Listing } from "@/lib/types";
import { formatPrice, formatSqFt, getListingUrl, getListingPhotoUrl } from "@/lib/utils";

// Status badge colors
const statusColors: Record<string, string> = {
  Active: "bg-green-600 text-white",
  Pending: "bg-yellow-600 text-white",
  "Coming Soon": "bg-blue-600 text-white",
  Closed: "bg-gray-600 text-white",
};

export default function SearchListingCard({ listing }: { listing: Listing }) {
  const photoUrl = getListingPhotoUrl(listing);
  const url = getListingUrl(listing);
  const badgeClass = statusColors[listing.StandardStatus] ?? "bg-gray-600 text-white";

  return (
    <Link
      href={url}
      className="block bg-white border border-border rounded-lg overflow-hidden
                 hover:shadow-lg transition-shadow group no-underline"
    >
      {/* Photo with price overlay and status badge */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={photoUrl}
          alt={listing.UnparsedAddress || "Property"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status badge */}
        <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${badgeClass}`}>
          {listing.StandardStatus === "Active" ? "New" : listing.StandardStatus}
        </span>
        {/* Price overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-3 px-3">
          <p className="font-heading font-bold text-white text-xl">
            {formatPrice(listing.ListPrice)}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted font-body">
          {listing.BedroomsTotal != null && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {listing.BedroomsTotal} Beds
            </span>
          )}
          {listing.BathroomsTotalInteger != null && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {listing.BathroomsTotalInteger} Baths
            </span>
          )}
          {listing.LivingArea != null && (
            <span className="flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5" />
              {formatSqFt(listing.LivingArea)}
            </span>
          )}
          {listing.LotSizeAcres != null && listing.LotSizeAcres > 0 && (
            <span className="flex items-center gap-1">
              <LandPlot className="w-3.5 h-3.5" />
              {listing.LotSizeAcres.toFixed(2)} Acres
            </span>
          )}
          {listing.YearBuilt != null && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Built in {listing.YearBuilt}
            </span>
          )}
        </div>
      </div>

      {/* Address and details */}
      <div className="px-3 pb-3">
        <p className="font-body text-sm font-semibold text-primary truncate">
          {listing.UnparsedAddress}
        </p>
        <p className="font-body text-xs text-muted">
          {listing.City}, FL {listing.PostalCode}
        </p>
        {listing.SubdivisionName && (
          <p className="font-body text-xs text-muted truncate">{listing.SubdivisionName}</p>
        )}
        {/* MLS # and listing office */}
        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted/60 font-body">
          {listing.ListingId && <span>MLS # {listing.ListingId}</span>}
        </div>
        {listing.ListOfficeName && (
          <p className="text-[10px] text-muted/50 font-body mt-0.5 truncate">
            Listed by {listing.ListOfficeName}
          </p>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/search/ListingCard.tsx
git commit -m "feat: add large ListingCard for Gallery search view"
```

---

### Task 3: Create the Gallery View

**Files:**
- Create: `src/components/search/GalleryView.tsx`

- [ ] **Step 1: Create GalleryView component**

Responsive card grid (1 col mobile, 2 col tablet, 3-4 col desktop) with pagination at the bottom. Receives listings, loading state, total count, and pagination callbacks.

```tsx
// src/components/search/GalleryView.tsx
"use client";

import type { Listing } from "@/lib/types";
import SearchListingCard from "./ListingCard";
import Pagination from "./Pagination";

interface GalleryViewProps {
  listings: Listing[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function GalleryView({
  listings, loading, total, currentPage, pageSize, onPageChange,
}: GalleryViewProps) {
  return (
    <div className="min-h-screen bg-light">
      {/* Result count + sort info */}
      <div className="px-4 py-3 border-b border-border bg-white flex items-center justify-between">
        <p className="font-body text-xs text-muted">
          {loading ? "Searching..." : `${total.toLocaleString()} Properties`}
        </p>
        <Pagination
          currentPage={currentPage}
          totalResults={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg overflow-hidden">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 w-24 rounded" />
                <div className="h-3 bg-gray-200 w-full rounded" />
                <div className="h-3 bg-gray-200 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card grid */}
      {!loading && listings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {listings.map((listing) => (
            <SearchListingCard key={listing.ListingKey} listing={listing} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && listings.length === 0 && (
        <div className="p-12 text-center">
          <p className="font-heading text-xl text-primary mb-2">No Properties Found</p>
          <p className="font-body text-sm text-muted mb-4">
            Try adjusting your filters or expanding your search area.
          </p>
        </div>
      )}

      {/* Bottom pagination */}
      {!loading && listings.length > 0 && (
        <div className="bg-white border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalResults={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/search/GalleryView.tsx
git commit -m "feat: add GalleryView grid layout for property search"
```

---

### Task 4: Create the Price Pin and Map View

**Files:**
- Create: `src/components/search/MapView.tsx`

- [ ] **Step 1: Create MapView component**

Extracted from the current `search/page.tsx` — split-panel with scrollable listing rows on the left and Leaflet map on the right. Map markers are price-label pins ("$339K") instead of plain dots. Includes the existing popup behavior and auto-fit bounds.

```tsx
// src/components/search/MapView.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatPrice, formatSqFt, getListingUrl, getListingPhotoUrl } from "@/lib/utils";
import Pagination from "./Pagination";

// Status badge colors
const statusColors: Record<string, string> = {
  Active: "bg-green-600 text-white",
  Pending: "bg-yellow-600 text-white",
  "Coming Soon": "bg-blue-600 text-white",
  Closed: "bg-gray-600 text-white",
};

interface MapViewProps {
  listings: Listing[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

/** Format price as compact label for map pins: "$339K", "$1.2M" */
function compactPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `$${Math.round(price / 1_000)}K`;
  return `$${price}`;
}

export default function MapView({
  listings, loading, total, currentPage, pageSize, onPageChange,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markerLayerRef = useRef<unknown>(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    // Inject Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      if (!mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [28.0, -82.45],
        zoom: 9,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      const markerLayer = L.layerGroup().addTo(map);
      mapRef.current = map;
      markerLayerRef.current = markerLayer;
    });

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
        markerLayerRef.current = null;
      }
    };
  }, []);

  // Update markers with price pins when listings change
  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;

    import("leaflet").then((L) => {
      const map = mapRef.current as L.Map;
      const markerLayer = markerLayerRef.current as L.LayerGroup;
      markerLayer.clearLayers();

      const geoListings = listings.filter(
        (l) => l.Latitude && l.Longitude && l.Latitude !== 0 && l.Longitude !== 0
      );
      if (geoListings.length === 0) return;

      geoListings.forEach((listing) => {
        const photoUrl = getListingPhotoUrl(listing);
        const url = getListingUrl(listing);
        const address = listing.UnparsedAddress || "Address unavailable";
        const priceLabel = compactPrice(listing.ListPrice);

        // Price-label pin icon
        const pinIcon = L.divIcon({
          className: "",
          html: `<div style="
            background:#0c1829; color:white;
            font-size:11px; font-weight:700;
            padding:3px 6px; border-radius:4px;
            white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.35);
            border:1px solid rgba(255,255,255,0.2);
          ">${priceLabel}</div>`,
          iconSize: [60, 24],
          iconAnchor: [30, 24],
        });

        const marker = L.marker([listing.Latitude!, listing.Longitude!], {
          icon: pinIcon,
        }).addTo(markerLayer);

        marker.bindPopup(
          `<div style="font-family:system-ui,sans-serif;width:240px;padding:0;margin:0;">
            <img src="${photoUrl}" alt="${address}"
                 style="width:100%;height:140px;object-fit:cover;display:block;" />
            <div style="padding:10px 12px;">
              <p style="margin:0 0 4px;font-weight:700;font-size:16px;color:#0c1829;">
                ${formatPrice(listing.ListPrice)}
              </p>
              <p style="margin:0 0 4px;font-size:13px;color:#333;">
                ${address}
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:#6b7a8d;">
                ${listing.BedroomsTotal ?? "—"} bed &middot;
                ${listing.BathroomsTotalInteger ?? "—"} bath
                ${listing.LivingArea ? ` &middot; ${listing.LivingArea.toLocaleString()} sqft` : ""}
              </p>
              <a href="${url}"
                 style="font-size:12px;font-weight:600;color:#93b4d4;text-decoration:none;">
                View Details &rarr;
              </a>
            </div>
          </div>`,
          { closeButton: true, maxWidth: 260, minWidth: 240, className: "listing-popup" }
        );
      });

      const bounds = L.latLngBounds(
        geoListings.map((l) => [l.Latitude!, l.Longitude!] as [number, number])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    });
  }, [listings]);

  return (
    <div className="flex flex-col md:flex-row" style={{ height: "calc(100vh - 120px)" }}>
      {/* Left panel: scrollable listing rows */}
      <div className="md:w-[45%] lg:w-[40%] overflow-y-auto border-r border-border bg-white">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-border/50 px-4 py-3
                        flex items-center justify-between">
          <p className="font-body text-xs text-muted">
            {loading ? "Searching..." : `${total.toLocaleString()} listings`}
          </p>
          <Pagination
            currentPage={currentPage}
            totalResults={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="p-4 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-28 h-20 bg-gray-200 flex-shrink-0 rounded" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 w-24 rounded" />
                  <div className="h-3 bg-gray-200 w-full rounded" />
                  <div className="h-3 bg-gray-200 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Listing rows */}
        {!loading && listings.length > 0 && (
          <div className="divide-y divide-border/50">
            {listings.map((listing) => (
              <MapListingRow key={listing.ListingKey} listing={listing} />
            ))}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="p-8 text-center">
            <p className="font-heading text-lg text-primary mb-2">No Listings Found</p>
            <p className="font-body text-sm text-muted">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Right panel: Leaflet map */}
      <div className="flex-1 relative bg-light">
        <div ref={mapContainerRef} className="absolute inset-0" />
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 pointer-events-none">
            <p className="font-body text-xs text-muted tracking-widest uppercase animate-pulse">
              Loading map...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Compact listing row for the map side panel */
function MapListingRow({ listing }: { listing: Listing }) {
  const photoUrl = getListingPhotoUrl(listing);
  const url = getListingUrl(listing);
  const badgeClass = statusColors[listing.StandardStatus] ?? "bg-gray-600 text-white";

  return (
    <Link href={url} className="flex gap-3 p-4 hover:bg-light/50 transition-colors group no-underline">
      <div className="relative w-28 h-20 flex-shrink-0 overflow-hidden bg-gray-100 rounded">
        <Image
          src={photoUrl}
          alt={listing.UnparsedAddress || "Property"}
          fill
          sizes="112px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute left-1 top-1 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider rounded ${badgeClass}`}>
          {listing.StandardStatus}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-bold text-base text-primary">{formatPrice(listing.ListPrice)}</p>
        <p className="font-body text-xs text-primary/80 truncate">{listing.UnparsedAddress}</p>
        <p className="font-body text-[10px] text-muted">{listing.City}, FL {listing.PostalCode}</p>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted font-body">
          {listing.BedroomsTotal != null && <span>{listing.BedroomsTotal} Bed</span>}
          {listing.BathroomsTotalInteger != null && <span>{listing.BathroomsTotalInteger} Bath</span>}
          {listing.LivingArea != null && <span>{formatSqFt(listing.LivingArea)}</span>}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/search/MapView.tsx
git commit -m "feat: add MapView with price-label pins and split panel"
```

---

### Task 5: Create the Advanced Filter Panel

**Files:**
- Create: `src/components/search/FilterPanel.tsx`

- [ ] **Step 1: Create FilterPanel component**

Slide-out overlay panel from the right side. Contains accordion sections for Listing Status & Activity, Property Details, Price Reduction, Other Property Attributes, and Keyword Search. Each section expands/collapses. Includes "Reset All Filters" and "Apply and View Results" buttons.

```tsx
// src/components/search/FilterPanel.tsx
"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current URL search params as key-value pairs */
  currentFilters: Record<string, string>;
  /** Called with updated filter values to apply */
  onApply: (filters: Record<string, string | null>) => void;
  onReset: () => void;
}

/** Accordion section wrapper */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left
                   font-body text-sm font-semibold text-primary hover:bg-light transition-colors"
      >
        {title}
        <ChevronDown className={`w-4 h-4 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

/** Checkbox filter row */
function CheckFilter({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm font-body text-primary/80">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-accent"
      />
      {label}
    </label>
  );
}

export default function FilterPanel({ isOpen, onClose, currentFilters, onApply, onReset }: FilterPanelProps) {
  // Local state mirrors currentFilters so changes are batched until "Apply"
  const [local, setLocal] = useState<Record<string, string | null>>({});

  function getVal(key: string): string {
    return (local[key] !== undefined ? local[key] : currentFilters[key]) || "";
  }
  function getBool(key: string): boolean {
    const v = local[key] !== undefined ? local[key] : currentFilters[key];
    return v === "true";
  }
  function set(key: string, val: string | null) {
    setLocal((prev) => ({ ...prev, [key]: val || null }));
  }

  function handleApply() {
    onApply(local);
    setLocal({});
    onClose();
  }

  function handleReset() {
    setLocal({});
    onReset();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[100]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white z-[101]
                       shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-body text-sm font-semibold text-primary">More Filters</span>
          <button onClick={onClose} className="p-1 hover:bg-light rounded transition-colors">
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* Scrollable sections */}
        <div className="flex-1 overflow-y-auto">
          {/* Listing Status & Activity */}
          <Section title="Listing Status & Activity">
            <CheckFilter label="Active" checked={getVal("status") === "" || getVal("status") === "Active"} onChange={() => set("status", "Active")} />
            <CheckFilter label="Pending" checked={getVal("status") === "Pending"} onChange={() => set("status", "Pending")} />
            <CheckFilter label="Coming Soon" checked={getVal("status") === "Coming Soon"} onChange={() => set("status", "Coming Soon")} />
          </Section>

          {/* Property Details */}
          <Section title="Property Details">
            <CheckFilter label="Pool" checked={getBool("pool")} onChange={(v) => set("pool", v ? "true" : null)} />
            <CheckFilter label="Waterfront" checked={getBool("waterfront")} onChange={(v) => set("waterfront", v ? "true" : null)} />
            <CheckFilter label="New Construction" checked={getBool("new_construction")} onChange={(v) => set("new_construction", v ? "true" : null)} />
            <CheckFilter label="Single Story" checked={getBool("single_story")} onChange={(v) => set("single_story", v ? "true" : null)} />
            <div className="space-y-1">
              <label className="font-body text-xs text-muted">Min Sq Ft</label>
              <input
                type="number"
                value={getVal("min_sqft")}
                onChange={(e) => set("min_sqft", e.target.value || null)}
                placeholder="No minimum"
                className="w-full border border-border rounded px-3 py-1.5 text-sm font-body focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="font-body text-xs text-muted">Max Sq Ft</label>
              <input
                type="number"
                value={getVal("max_sqft")}
                onChange={(e) => set("max_sqft", e.target.value || null)}
                placeholder="No maximum"
                className="w-full border border-border rounded px-3 py-1.5 text-sm font-body focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="font-body text-xs text-muted">Year Built (min)</label>
              <input
                type="number"
                value={getVal("min_year")}
                onChange={(e) => set("min_year", e.target.value || null)}
                placeholder="Any"
                className="w-full border border-border rounded px-3 py-1.5 text-sm font-body focus:outline-none focus:border-accent"
              />
            </div>
          </Section>

          {/* Price Reduction */}
          <Section title="Price Reduction">
            <CheckFilter label="Price reduced only" checked={getBool("price_reduced")} onChange={(v) => set("price_reduced", v ? "true" : null)} />
          </Section>

          {/* Other Property Attributes */}
          <Section title="Other Property Attributes">
            <CheckFilter label="55+ Community" checked={getBool("senior")} onChange={(v) => set("senior", v ? "true" : null)} />
            <CheckFilter label="Garage" checked={getBool("garage")} onChange={(v) => set("garage", v ? "true" : null)} />
            <CheckFilter label="Open House" checked={getBool("open_house")} onChange={(v) => set("open_house", v ? "true" : null)} />
          </Section>

          {/* Keyword Search */}
          <Section title="Keyword Search">
            <div className="space-y-1">
              <label className="font-body text-xs text-muted">Search listing remarks</label>
              <input
                type="text"
                value={getVal("keyword")}
                onChange={(e) => set("keyword", e.target.value || null)}
                placeholder="e.g. renovated, lake view, chef kitchen"
                className="w-full border border-border rounded px-3 py-1.5 text-sm font-body focus:outline-none focus:border-accent"
              />
            </div>
          </Section>
        </div>

        {/* Footer buttons */}
        <div className="border-t border-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex-1 font-body text-sm font-semibold text-muted hover:text-primary
                       py-2.5 border border-border rounded transition-colors"
          >
            Reset All Filters
          </button>
          <button
            onClick={handleApply}
            className="flex-1 font-body text-sm font-semibold text-white bg-primary
                       py-2.5 rounded hover:bg-primary/90 transition-colors"
          >
            Apply and View Results
          </button>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Add slide-in animation to globals.css**

Append to `src/app/globals.css`:
```css
/* Slide-in from right — for filter panel */
@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-right {
  animation: slide-in-right 0.25s ease-out;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/search/FilterPanel.tsx src/app/globals.css
git commit -m "feat: add advanced FilterPanel with accordion sections"
```

---

### Task 6: Rewrite the Search Page Shell

**Files:**
- Modify: `src/app/properties/search/page.tsx` (full rewrite)

- [ ] **Step 1: Rewrite page.tsx**

The page becomes a thin shell that manages state/URL params and renders the filter bar + the active view component (Gallery or Map). The filter bar has the Gallery/Map toggle, search input, inline dropdowns, and "More Filters" button.

```tsx
// src/app/properties/search/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Map, LayoutGrid, ChevronDown } from "lucide-react";
import type { Listing } from "@/lib/types";
import GalleryView from "@/components/search/GalleryView";
import MapView from "@/components/search/MapView";
import FilterPanel from "@/components/search/FilterPanel";
import SaveSearchButton from "@/components/ui/SaveSearchButton";

// --- Filter option constants ---

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
  { label: "Beds", value: "BedroomsTotal desc" },
  { label: "Sqft", value: "LivingArea desc" },
] as const;

const PAGE_SIZE = 48;

// --- Main component ---

export default function PropertySearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"gallery" | "map">("gallery");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  // Current page from URL
  const currentPage = Number(searchParams.get("page") || "1");

  // URL param helpers
  const getParam = useCallback(
    (key: string) => searchParams.get(key) || "",
    [searchParams]
  );

  // Count active "more filters" (boolean params + keyword + status)
  const moreFilterKeys = ["pool", "waterfront", "new_construction", "single_story", "senior", "garage", "open_house", "price_reduced", "keyword", "min_sqft", "max_sqft", "min_year"];
  const activeMoreFilters = moreFilterKeys.filter((k) => searchParams.get(k)).length;

  // Update URL params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset page when filters change (unless explicitly setting page)
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

  // Fetch listings when URL params change
  useEffect(() => {
    let cancelled = false;

    async function fetchListings() {
      setLoading(true);
      try {
        const apiParams = new URLSearchParams(searchParams.toString());
        if (!apiParams.has("limit")) apiParams.set("limit", String(PAGE_SIZE));
        // Calculate offset from page number
        const page = Number(apiParams.get("page") || "1");
        if (page > 1) {
          apiParams.set("offset", String((page - 1) * PAGE_SIZE));
        }
        apiParams.delete("page"); // Don't send page to API, we use offset

        const res = await fetch(`/api/listings?${apiParams.toString()}`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();

        if (!cancelled) {
          setListings(data.value || []);
          setTotal(data.total || data["@odata.count"] || 0);
        }
      } catch {
        if (!cancelled) { setListings([]); setTotal(0); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchListings();
    return () => { cancelled = true; };
  }, [searchParams]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  }

  function handlePageChange(page: number) {
    updateParams({ page: page > 1 ? String(page) : null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Build current filter state for FilterPanel
  const currentFilters: Record<string, string> = {};
  searchParams.forEach((val, key) => { currentFilters[key] = val; });

  return (
    <>
      {/* === STICKY FILTER BAR === */}
      <div className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="px-4 py-2.5">
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
            {/* Gallery / Map toggle */}
            <div className="flex border border-border rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("gallery")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-body font-medium transition-colors
                  ${viewMode === "gallery" ? "bg-primary text-white" : "bg-white text-muted hover:text-primary"}`}
              >
                <LayoutGrid size={14} />
                Gallery
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-body font-medium transition-colors
                  ${viewMode === "map" ? "bg-primary text-white" : "bg-white text-muted hover:text-primary"}`}
              >
                <Map size={14} />
                Map
              </button>
            </div>

            {/* Search input */}
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

            {/* Inline filters — hidden on mobile */}
            <select
              value={getParam("min_price")}
              onChange={(e) => updateParams({ min_price: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border rounded px-3 py-2
                         focus:outline-none focus:border-accent hidden lg:block"
            >
              <option value="">Price: Any</option>
              {PRICE_OPTIONS.slice(1).map((opt) => (
                <option key={`min-${opt.value}`} value={opt.value}>{opt.label}+</option>
              ))}
            </select>

            <select
              value={getParam("beds")}
              onChange={(e) => updateParams({ beds: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border rounded px-3 py-2
                         focus:outline-none focus:border-accent hidden md:block"
            >
              {BED_OPTIONS.map((opt) => (
                <option key={`bed-${opt.value}`} value={opt.value}>
                  Beds: {opt.label}
                </option>
              ))}
            </select>

            <select
              value={getParam("baths")}
              onChange={(e) => updateParams({ baths: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border rounded px-3 py-2
                         focus:outline-none focus:border-accent hidden md:block"
            >
              {BATH_OPTIONS.map((opt) => (
                <option key={`bath-${opt.value}`} value={opt.value}>
                  Baths: {opt.label}
                </option>
              ))}
            </select>

            <select
              value={getParam("property_type")}
              onChange={(e) => updateParams({ property_type: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border rounded px-3 py-2
                         focus:outline-none focus:border-accent hidden xl:block"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value ? opt.label : "Home Type"}
                </option>
              ))}
            </select>

            {/* More Filters button */}
            <button
              type="button"
              onClick={() => setFilterPanelOpen(true)}
              className={`flex items-center gap-1.5 font-body text-xs font-medium
                         px-3 py-2 border rounded transition-colors
                         ${activeMoreFilters > 0
                           ? "bg-primary text-white border-primary"
                           : "bg-white text-muted border-border hover:border-primary hover:text-primary"
                         }`}
            >
              <SlidersHorizontal size={12} />
              More Filters
              {activeMoreFilters > 0 && (
                <span className="bg-white text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeMoreFilters}
                </span>
              )}
            </button>

            {/* Sort */}
            <select
              value={getParam("sort")}
              onChange={(e) => updateParams({ sort: e.target.value || null })}
              className="font-body text-xs text-primary bg-white border border-border rounded px-3 py-2
                         focus:outline-none focus:border-accent hidden lg:block"
            >
              <option value="">Sort: Newest</option>
              {SORT_OPTIONS.slice(1).map((opt) => (
                <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
              ))}
            </select>

            {/* Save Search */}
            <SaveSearchButton />
          </form>
        </div>
      </div>

      {/* === VIEW === */}
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

      {/* === FILTER PANEL === */}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/properties/search/page.tsx
git commit -m "feat: rewrite search page with Gallery/Map toggle and advanced filters"
```

---

### Task 7: Update API route to support new filter params

**Files:**
- Modify: `src/app/api/listings/route.ts`
- Modify: `src/lib/bridge.ts` (buildFilter function)
- Modify: `src/lib/types.ts` (ListingSearchParams)

- [ ] **Step 1: Add new filter params to types**

Add to `ListingSearchParams` in `src/lib/types.ts`:
```ts
  min_sqft?: string;
  max_sqft?: string;
  min_year?: string;
  price_reduced?: boolean;
  garage?: boolean;
  keyword?: string;
```

- [ ] **Step 2: Add new OData filters to buildFilter in bridge.ts**

Add these filter lines inside the `buildFilter` function in `src/lib/bridge.ts`, after the existing topic-specific filters:
```ts
  if (params.min_sqft) filters.push(`LivingArea ge ${params.min_sqft}`);
  if (params.max_sqft) filters.push(`LivingArea le ${params.max_sqft}`);
  if (params.min_year) filters.push(`YearBuilt ge ${params.min_year}`);
  if (params.price_reduced) filters.push(`OriginalListPrice gt ListPrice`);
  if (params.garage) filters.push(`GarageYN eq true`);
```

Note: `keyword` search on PublicRemarks is not supported by OData $filter on Bridge API. We will add it as a client-side filter in the API route if needed, or skip it for now.

- [ ] **Step 3: Update API route to pass new params**

Add to the `getListings` call in `src/app/api/listings/route.ts`:
```ts
      min_sqft: searchParams.get("min_sqft") || undefined,
      max_sqft: searchParams.get("max_sqft") || undefined,
      min_year: searchParams.get("min_year") || undefined,
      price_reduced: searchParams.get("price_reduced") === "true" || undefined,
      garage: searchParams.get("garage") === "true" || undefined,
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/bridge.ts src/app/api/listings/route.ts
git commit -m "feat: add sqft, year, price-reduced, garage filters to Bridge API"
```

---

### Task 8: Final integration test and deploy

- [ ] **Step 1: Run local build to verify no errors**

```bash
cd /Users/barretthenry/Projects/nowtb-next && npx next build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Commit all remaining changes and push**

```bash
git add -A
git commit -m "feat: complete property search upgrade — gallery/map, price pins, advanced filters, pagination"
git push
```

- [ ] **Step 3: Verify deployment**

Check `vercel logs nowtb.com --level error --since 5m` for any runtime errors after deployment.
