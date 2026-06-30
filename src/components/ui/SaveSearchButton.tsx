// =============================================================================
// SaveSearchButton — Saves current search filters to Supabase or localStorage
// Shows on the properties page when filters are active
// =============================================================================

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bell, BellRing, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SaveSearchButton() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showNameInput, setShowNameInput] = useState(false);
  const [searchName, setSearchName] = useState("");

  // Don't show if no filters are active
  const hasFilters = searchParams.toString().length > 0;
  if (!hasFilters) return null;

  // Build a readable name from the current filters
  function buildDefaultName(): string {
    const parts: string[] = [];
    const q = searchParams.get("q");
    const city = searchParams.get("city");
    const zip = searchParams.get("zip");
    const type = searchParams.get("property_type");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const beds = searchParams.get("beds");

    if (q) parts.push(q);
    if (city) parts.push(city);
    if (zip) parts.push(`ZIP ${zip}`);
    if (type) parts.push(type);
    if (minPrice || maxPrice) {
      const min = minPrice ? `$${Number(minPrice).toLocaleString()}` : "";
      const max = maxPrice ? `$${Number(maxPrice).toLocaleString()}` : "";
      parts.push(min && max ? `${min}-${max}` : min ? `${min}+` : `Up to ${max}`);
    }
    if (beds) parts.push(`${beds}+ beds`);

    // Add feature filters
    if (searchParams.get("pool") === "true") parts.push("Pool");
    if (searchParams.get("waterfront") === "true") parts.push("Waterfront");
    if (searchParams.get("new_construction") === "true") parts.push("New Construction");
    if (searchParams.get("senior") === "true") parts.push("55+");

    return parts.length > 0 ? parts.join(", ") : "My Search";
  }

  async function handleSave() {
    const name = searchName.trim() || buildDefaultName();
    const filters = Object.fromEntries(searchParams.entries());

    // Try Supabase first
    const supabase = createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setStatus("saving");
        const { error } = await supabase.from("saved_searches").insert({
          user_id: user.id,
          name,
          filters,
          email_alerts: true,
        });
        if (!error) {
          setStatus("saved");
          setShowNameInput(false);
          setTimeout(() => setStatus("idle"), 3000);
          return;
        }
      }
    }

    // Fallback: save to localStorage
    setStatus("saving");
    try {
      const existing = JSON.parse(localStorage.getItem("nowtb_saved_searches") || "[]");
      existing.push({
        id: Date.now().toString(),
        name,
        filters,
        email_alerts: false,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem("nowtb_saved_searches", JSON.stringify(existing));
      setStatus("saved");
      setShowNameInput(false);
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  if (status === "saved") {
    return (
      <div className="flex items-center gap-2 font-body text-xs text-green-600">
        <Check size={14} />
        <span>Search saved! You&apos;ll get alerts for new matches.</span>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={buildDefaultName()}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="font-body text-xs border border-border px-3 py-2
                     bg-transparent focus:outline-none focus:border-accent w-48"
        />
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="font-body text-[10px] font-medium tracking-[0.15em] uppercase
                     px-4 py-2 bg-primary text-white border border-primary
                     hover:bg-transparent hover:text-primary transition-all duration-300"
        >
          {status === "saving" ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => setShowNameInput(false)}
          className="font-body text-xs text-muted hover:text-primary"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowNameInput(true)}
      className="flex items-center gap-2 font-body text-[10px] font-medium tracking-[0.15em] uppercase
                 px-4 py-2 text-accent border border-accent
                 hover:bg-accent hover:text-primary transition-all duration-300"
    >
      <BellRing size={14} />
      Save This Search
    </button>
  );
}
