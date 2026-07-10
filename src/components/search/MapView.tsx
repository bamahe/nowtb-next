// src/components/search/MapView.tsx
// Split-panel: scrollable listing rows on the left, Leaflet map with price-label pins on the right.
// Extracted from the original search/page.tsx and upgraded to show price badges on markers.
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatPrice, formatSqFt, getListingUrl, getListingPhotoUrl } from "@/lib/utils";
import Pagination from "./Pagination";

// Status badge colors for listing row thumbnails
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

/**
 * Formats a price as a compact label for map pins.
 * Examples: 339000 → "$339K", 1250000 → "$1.3M"
 */
function compactPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `$${Math.round(price / 1_000)}K`;
  return `$${price}`;
}

export default function MapView({
  listings, loading, total, currentPage, pageSize, onPageChange,
}: MapViewProps) {
  // Ref for the div that Leaflet attaches to
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // Refs store the Leaflet instances so effects can access them without re-running
  const mapRef = useRef<unknown>(null);
  const markerLayerRef = useRef<unknown>(null);

  // ── Initialize Leaflet map once on mount ──
  useEffect(() => {
    // Skip if already initialized or container not mounted yet
    if (mapRef.current || !mapContainerRef.current) return;

    // Inject Leaflet CSS dynamically (avoids SSR issues with static imports)
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Dynamic import keeps Leaflet out of the SSR bundle (it uses window)
    import("leaflet").then((L) => {
      if (!mapContainerRef.current || mapRef.current) return;

      // Center on Tampa Bay by default
      const map = L.map(mapContainerRef.current, {
        center: [28.0, -82.45],
        zoom: 9,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      // OpenStreetMap tiles — free, no API key
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // LayerGroup lets us clear and rebuild markers without recreating the map
      const markerLayer = L.layerGroup().addTo(map);
      mapRef.current = map;
      markerLayerRef.current = markerLayer;
    });

    // Cleanup: destroy map when component unmounts
    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
        markerLayerRef.current = null;
      }
    };
  }, []);

  // ── Update map markers whenever listings change ──
  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;

    import("leaflet").then((L) => {
      const map = mapRef.current as L.Map;
      const markerLayer = markerLayerRef.current as L.LayerGroup;

      // Clear existing markers before adding new ones
      markerLayer.clearLayers();

      // Only plot listings that have valid coordinates
      const geoListings = listings.filter(
        (l) => l.Latitude && l.Longitude && l.Latitude !== 0 && l.Longitude !== 0
      );
      if (geoListings.length === 0) return;

      geoListings.forEach((listing) => {
        const photoUrl = getListingPhotoUrl(listing);
        const url = getListingUrl(listing);
        const address = listing.UnparsedAddress || "Address unavailable";
        // Price-label text for the pin (e.g. "$339K")
        const priceLabel = compactPrice(listing.ListPrice);

        // Custom divIcon — navy pill with white price text
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

        // Popup: photo thumbnail + price + address + View Details link
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

      // Auto-fit map bounds so all markers are visible
      const bounds = L.latLngBounds(
        geoListings.map((l) => [l.Latitude!, l.Longitude!] as [number, number])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    });
  }, [listings]);

  return (
    // Full viewport height minus sticky header (~120px)
    <div className="flex flex-col md:flex-row" style={{ height: "calc(100vh - 120px)" }}>

      {/* ── Left panel: scrollable listing rows ── */}
      <div className="md:w-[45%] lg:w-[40%] overflow-y-auto border-r border-border bg-white">

        {/* Sticky header with result count and pagination */}
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

        {/* Loading skeleton — horizontal rows with thumbnail placeholder */}
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

        {/* Empty state */}
        {!loading && listings.length === 0 && (
          <div className="p-8 text-center">
            <p className="font-heading text-lg text-primary mb-2">No Listings Found</p>
            <p className="font-body text-sm text-muted">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* ── Right panel: Leaflet map ── */}
      <div className="flex-1 relative bg-light">
        {/* Map container — Leaflet fills this absolutely */}
        <div ref={mapContainerRef} className="absolute inset-0" />
        {/* Loading overlay on top of map while fetching */}
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

// ── Compact horizontal listing row for the map left panel ──
function MapListingRow({ listing }: { listing: Listing }) {
  const photoUrl = getListingPhotoUrl(listing);
  const url = getListingUrl(listing);
  const badgeClass = statusColors[listing.StandardStatus] ?? "bg-gray-600 text-white";

  return (
    <Link href={url} className="flex gap-3 p-4 hover:bg-light/50 transition-colors group no-underline">
      {/* Thumbnail with status badge */}
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
      {/* Price, address, and stats */}
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
