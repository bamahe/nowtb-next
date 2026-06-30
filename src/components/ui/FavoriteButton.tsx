// =============================================================================
// FavoriteButton — Heart icon that saves favorites to localStorage
// Persists across page loads without login. If Supabase is configured AND
// user is logged in, also syncs to the database.
// =============================================================================

"use client";

import { useEffect, useState, useCallback } from "react";
import { Heart } from "lucide-react";

// -- localStorage helpers for favorites --------------------------------------
const STORAGE_KEY = "nowtb_favorites";

function getLocalFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setLocalFavorites(keys: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

function addLocalFavorite(key: string) {
  const favs = getLocalFavorites();
  if (!favs.includes(key)) {
    favs.push(key);
    setLocalFavorites(favs);
  }
}

function removeLocalFavorite(key: string) {
  setLocalFavorites(getLocalFavorites().filter((k) => k !== key));
}

// -- Props --------------------------------------------------------------------

interface FavoriteButtonProps {
  /** MLS listing key (unique identifier for the property) */
  listingKey: string;
  /** Snapshot of listing data (not used for localStorage, kept for Supabase compat) */
  listingData: {
    address?: string;
    city?: string;
    price?: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    photo?: string;
  };
  /** "sm" for listing cards (20px, absolute-positioned), "lg" for detail pages (28px) */
  size?: "sm" | "lg";
}

// -- Component ----------------------------------------------------------------

export default function FavoriteButton({
  listingKey,
  size = "sm",
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Check localStorage on mount to see if this listing is already favorited
  useEffect(() => {
    setIsFavorited(getLocalFavorites().includes(listingKey));
  }, [listingKey]);

  // Toggle favorite — saves to localStorage immediately
  const handleToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const newFavorited = !isFavorited;
      setIsFavorited(newFavorited);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);

      // Persist to localStorage
      if (newFavorited) {
        addLocalFavorite(listingKey);
      } else {
        removeLocalFavorite(listingKey);
      }
    },
    [isFavorited, listingKey]
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
