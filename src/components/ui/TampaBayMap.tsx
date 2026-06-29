// =============================================================================
// TampaBayMap — Interactive Leaflet map showing Tampa Bay cities and offices
// "use client" because Leaflet requires browser DOM access
// =============================================================================

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
  className = "",
  zoom = 9,
  centerLat = 28.0,
  centerLng = -82.45,
}: TampaBayMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // Load Leaflet CSS via <link> tag (avoids Next.js CSS import issues)
  useEffect(() => {
    if (document.querySelector('link[href*="leaflet"]')) {
      setReady(true);
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.onload = () => setReady(true);
    document.head.appendChild(link);
  }, []);

  // Initialize map once CSS is loaded
  useEffect(() => {
    if (!ready || !mapRef.current || mapInstance.current) return;

    // Dynamic import of Leaflet (avoids SSR window errors)
    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstance.current) return;

      const map = L.map(mapRef.current, {
        center: [centerLat, centerLng],
        zoom,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      // OpenStreetMap tiles (free, no API key)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // City marker icon (small blue dot)
      const cityIcon = L.divIcon({
        className: "",
        html: `<div style="width:12px;height:12px;background:#93b4d4;border:2px solid #0c1829;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      // Office marker icon (larger navy dot)
      const officeIcon = L.divIcon({
        className: "",
        html: `<div style="width:20px;height:20px;background:#0c1829;border:3px solid #93b4d4;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      // Add markers
      markers.forEach((m) => {
        const icon = m.type === "office" ? officeIcon : cityIcon;
        const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);

        const popupContent = m.label || m.name;
        marker.bindPopup(
          `<div style="font-family:sans-serif;font-size:13px;font-weight:600;text-align:center;padding:2px 4px">
            ${popupContent}
            ${m.href ? '<br><span style="font-size:11px;font-weight:400;color:#93b4d4">Click to view →</span>' : ""}
          </div>`,
          { closeButton: false, offset: [0, -4] }
        );

        marker.on("mouseover", () => marker.openPopup());
        marker.on("mouseout", () => marker.closePopup());

        if (m.href) {
          marker.on("click", () => router.push(m.href!));
          const el = marker.getElement();
          if (el) el.style.cursor = "pointer";
        }
      });

      mapInstance.current = map;
    });

    return () => {
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ width: "100%", minHeight: 400, height: "50vh", maxHeight: 600 }}
    />
  );
}
