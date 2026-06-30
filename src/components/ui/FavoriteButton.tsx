// =============================================================================
// FavoriteButton — Heart icon that saves favorites
// Always saves to localStorage (works without login).
// If Supabase is configured AND user is logged in, also syncs to DB.
// =============================================================================

"use client";

import { useEffect, useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// -- localStorage helpers ----------------------------------------------------
const STORAGE_KEY = "nowtb_favorites";

function getLocalFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function toggleLocalFavorite(key: string): boolean {
  const favs = getLocalFavorites();
  const exists = favs.includes(key);
  const updated = exists ? favs.filter((k) => k !== key) : [...favs, key];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return !exists; // returns new favorited state
}

// -- Props --------------------------------------------------------------------

interface FavoriteButtonProps {
  listingKey: string;
  listingData: {
    address?: string;
    city?: string;
    price?: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    photo?: string;
  };
  size?: "sm" | "lg";
}

// -- Component ----------------------------------------------------------------

export default function FavoriteButton({
  listingKey,
  listingData,
  size = "sm",
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Check localStorage + Supabase on mount
  useEffect(() => {
    // Always check localStorage first (instant)
    const localFav = getLocalFavorites().includes(listingKey);
    setIsFavorited(localFav);

    // Also check Supabase if configured
    const supabase = createClient();
    if (!supabase) return;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_key", listingKey)
        .single();

      if (data && !localFav) {
        // Synced from Supabase — also save to localStorage
        toggleLocalFavorite(listingKey);
        setIsFavorited(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingKey]);

  // Toggle handler
  const handleToggle = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Toggle localStorage (always works)
      const newFavorited = toggleLocalFavorite(listingKey);
      setIsFavorited(newFavorited);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);

      // Sync to Supabase if configured + logged in
      const supabase = createClient();
      if (!supabase) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (newFavorited) {
          await supabase.from("favorites").insert({
            user_id: user.id,
            listing_key: listingKey,
            listing_data: listingData,
          });
        } else {
          await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("listing_key", listingKey);
        }
      } catch {
        // DB sync failed — localStorage still has the favorite, no big deal
      }
    },
    [listingKey, listingData]
  );

  const iconSize = size === "sm" ? 20 : 28;
  const buttonClasses =
    size === "sm"
      ? "absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white/95 transition-colors"
      : "rounded-full p-2 hover:bg-gray-100 transition-colors";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className={`${buttonClasses} cursor-pointer group`}
    >
      <Heart
        size={iconSize}
        className={[
          "transition-all duration-200 ease-in-out",
          animate ? "scale-125" : "scale-100",
          isFavorited
            ? "fill-red-500 text-red-500"
            : "fill-none text-gray-600 group-hover:text-red-400",
        ].join(" ")}
      />
    </button>
  );
}
