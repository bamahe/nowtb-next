// =============================================================================
// TampaBayMap — Interactive Leaflet map showing Tampa Bay cities and offices
// "use client" because Leaflet requires browser DOM access
// =============================================================================

"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MapMarker {
  name: string;
  lat: number;
  lng: number;
  /** URL to navigate to when clicked (city pages) */
  href?: string;
  /** Popup label shown on hover/click */
  label?: string;
  /** "city" for blue markers, "office" for red markers */
  type?: "city" | "office";
}

interface TampaBayMapProps {
  /** Array of markers to show on the map */
  markers?: MapMarker[];
  /** Map height CSS class. Defaults to aspect-[16/9] */
  className?: string;
  /** Initial zoom level. Defaults to 9 (shows full Tampa Bay metro) */
  zoom?: number;
  /** Center lat. Defaults to Tampa Bay center */
  centerLat?: number;
  /** Center lng. Defaults to Tampa Bay center */
  centerLng?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TampaBayMap({
  markers = [],
  className = "aspect-[16/9] md:aspect-[21/9]",
  zoom = 9,
  centerLat = 28.0,
  centerLng = -82.45,
}: TampaBayMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Don't initialize twice
    if (!mapRef.current || mapInstance.current) return;

    // Create the map centered on Tampa Bay
    const map = L.map(mapRef.current, {
      center: [centerLat, centerLng],
      zoom,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles (free, no API key)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // Custom icon for city markers (blue)
    const cityIcon = L.divIcon({
      className: "city-marker",
      html: `<div style="
        width: 12px; height: 12px;
        background: #93b4d4;
        border: 2px solid #0c1829;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });

    // Custom icon for office markers (navy with white center)
    const officeIcon = L.divIcon({
      className: "office-marker",
      html: `<div style="
        width: 20px; height: 20px;
        background: #0c1829;
        border: 3px solid #93b4d4;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Add markers
    markers.forEach((m) => {
      const icon = m.type === "office" ? officeIcon : cityIcon;
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);

      // Popup with name
      const popupContent = m.label || m.name;
      marker.bindPopup(
        `<div style="font-family: sans-serif; font-size: 13px; font-weight: 600; text-align: center; padding: 2px 4px;">
          ${popupContent}
          ${m.href ? '<br><span style="font-size: 11px; font-weight: 400; color: #93b4d4;">Click to view →</span>' : ""}
        </div>`,
        { closeButton: false, offset: [0, -4] }
      );

      // Show popup on hover
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());

      // Navigate on click if href is set
      if (m.href) {
        marker.on("click", () => router.push(m.href!));
        // Make cursor a pointer
        marker.getElement()?.style.setProperty("cursor", "pointer");
      }
    });

    mapInstance.current = map;

    // Cleanup on unmount
    return () => {
      map.remove();
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapRef} className={`w-full ${className}`} />;
}
