"use client";

// =============================================================================
// FavoriteButton — Heart icon that toggles listing favorites
// Shows on listing cards (sm) and listing detail pages (lg)
// Works locally (visual-only) when Supabase isn't configured
// Persists favorites via Supabase when it IS configured + user is logged in
// =============================================================================

import { useEffect, useState, useCallback } from "react";
import { Heart } from "lucide-react";

// -- Try to import Supabase client; may not be configured ---------------------
let createClient: (() => ReturnType<typeof import("@/lib/supabase/client").createClient>) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  createClient = require("@/lib/supabase/client").createClient;
} catch {
  // Supabase not configured — that's fine, we'll use local-only mode
}

// -- Props --------------------------------------------------------------------

interface FavoriteButtonProps {
  /** MLS listing key (unique identifier for the property) */
  listingKey: string;
  /** Snapshot of listing data stored alongside the favorite */
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
  listingData,
  size = "sm",
}: FavoriteButtonProps) {
  // Try to create Supabase client — returns null if not configured
  const supabase = createClient ? createClient() : null;

  // Whether the listing is currently favorited by the logged-in user
  const [isFavorited, setIsFavorited] = useState(false);
  // Prevents double-clicks while a Supabase toggle is in progress
  const [isLoading, setIsLoading] = useState(false);
  // Triggers the pop animation on toggle
  const [animate, setAnimate] = useState(false);

  // -- Check initial favorite status on mount (Supabase only) -----------------
  useEffect(() => {
    async function checkFavorite() {
      // Skip if Supabase isn't configured — local mode starts unfavorited
      if (!supabase) return;

      // Get the current user (returns null if not logged in)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return; // Not logged in — leave default (unfavorited)

      // Query the favorites table for this user + listing combo
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_key", listingKey)
        .single();

      if (data) {
        setIsFavorited(true);
      }
    }

    checkFavorite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingKey]);

  // -- Toggle handler ---------------------------------------------------------
  // Always toggles the visual state (filled/unfilled heart) immediately.
  // If Supabase is configured AND user is logged in, also persists to the DB.
  // If Supabase isn't configured or user isn't logged in, still works visually.
  const handleToggle = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      // Stop the click from bubbling up to parent links (e.g., listing card)
      e.preventDefault();
      e.stopPropagation();

      if (isLoading) return; // Already processing a Supabase toggle

      // Always toggle the visual state and play the animation
      const newFavorited = !isFavorited;
      setIsFavorited(newFavorited);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);

      // If Supabase isn't configured, we're done — visual-only toggle
      if (!supabase) return;

      setIsLoading(true);

      try {
        // Check if the user is logged in
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Not logged in — visual toggle already happened, just skip DB persist
        if (!user) {
          setIsLoading(false);
          return;
        }

        if (!newFavorited) {
          // -- Remove favorite from DB ----------------------------------------
          await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("listing_key", listingKey);
        } else {
          // -- Add favorite to DB ---------------------------------------------
          await supabase.from("favorites").insert({
            user_id: user.id,
            listing_key: listingKey,
            listing_data: listingData,
          });
        }
      } catch (err) {
        // If DB operation fails, revert the visual state
        console.error("FavoriteButton toggle error:", err);
        setIsFavorited(!newFavorited);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, isFavorited, listingKey, listingData, supabase]
  );

  // -- Size-dependent styles --------------------------------------------------
  const iconSize = size === "sm" ? 20 : 28;

  // sm: absolute top-right with frosted-glass bg (for listing cards)
  // lg: inline button (for detail pages)
  const buttonClasses =
    size === "sm"
      ? "absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white/95 transition-colors"
      : "rounded-full p-2 hover:bg-gray-100 transition-colors";

  // -- Render -----------------------------------------------------------------
  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className={`${buttonClasses} cursor-pointer group`}
    >
      <Heart
        size={iconSize}
        className={[
          // Smooth transition for fill/stroke changes
          "transition-all duration-200 ease-in-out",
          // Pop animation on toggle
          animate ? "scale-125" : "scale-100",
          // Filled red when favorited, outline when not
          isFavorited
            ? "fill-red-500 text-red-500"
            : "fill-none text-gray-600 group-hover:text-red-400",
        ].join(" ")}
      />
    </button>
  );
}
