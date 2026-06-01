"use client";

// =============================================================================
// FavoriteButton — Heart icon that toggles listing favorites via Supabase
// Shows on listing cards (sm) and listing detail pages (lg)
// Redirects to /login if user isn't authenticated
// =============================================================================

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  const router = useRouter();
  const supabase = createClient();

  // Whether the listing is currently favorited by the logged-in user
  const [isFavorited, setIsFavorited] = useState(false);
  // Prevents double-clicks while a toggle is in progress
  const [isLoading, setIsLoading] = useState(false);
  // Triggers the pop animation on toggle
  const [animate, setAnimate] = useState(false);

  // -- Check initial favorite status on mount ---------------------------------
  useEffect(() => {
    async function checkFavorite() {
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
  const handleToggle = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      // Stop the click from bubbling up to parent links (e.g., listing card)
      e.preventDefault();
      e.stopPropagation();

      if (isLoading) return; // Already processing a toggle

      setIsLoading(true);

      try {
        // Check if the user is logged in
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Not logged in — redirect to login with a return URL
          router.push(`/login?next=/properties/${listingKey}`);
          return;
        }

        if (isFavorited) {
          // -- Remove favorite ------------------------------------------------
          await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("listing_key", listingKey);

          setIsFavorited(false);
        } else {
          // -- Add favorite ---------------------------------------------------
          await supabase.from("favorites").insert({
            user_id: user.id,
            listing_key: listingKey,
            listing_data: listingData,
          });

          setIsFavorited(true);
        }

        // Trigger the pop animation
        setAnimate(true);
        setTimeout(() => setAnimate(false), 300);
      } catch (err) {
        console.error("FavoriteButton toggle error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, isFavorited, listingKey, listingData, supabase, router]
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
