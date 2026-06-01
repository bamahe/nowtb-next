// =============================================================================
// /account — User Dashboard (Server Component)
// Shows saved searches, favorite listings, and profile info
// Redirects to /login if not authenticated
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/ui/SignOutButton";
import type { Metadata } from "next";

// --- SEO metadata ---
export const metadata: Metadata = {
  title: "My Account | Barrett Henry | REMAX Collective",
  description:
    "View your saved searches, favorite listings, and account settings.",
};

// --- TypeScript types for data from Supabase ---
interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  frequency: string | null;
  created_at: string;
}

interface Favorite {
  id: string;
  listing_id: string;
  listing_data: {
    address?: string;
    price?: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    photo_url?: string;
    city?: string;
    status?: string;
  };
  created_at: string;
}

export default async function AccountPage() {
  // --- Auth check: redirect if not logged in ---
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // --- Fetch profile, favorites, and saved searches in parallel ---
  const [profileResult, favoritesResult, searchesResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const profile = profileResult.data as Profile | null;
  const favorites = (favoritesResult.data as Favorite[]) || [];
  const savedSearches = (searchesResult.data as SavedSearch[]) || [];

  // --- Display name: use profile name, fall back to email ---
  const displayName = profile?.full_name || user.email || "There";

  return (
    <main className="pt-24 font-body">
      {/* ================================================================= */}
      {/* HEADER — user info + sign out */}
      {/* ================================================================= */}
      <section className="section-white py-12">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="heading-section font-heading">
                Welcome, {displayName}
              </h1>
              <p className="text-neutral-500 text-sm mt-1">{user.email}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SAVED SEARCHES */}
      {/* ================================================================= */}
      <section className="section-light py-12">
        <div className="container-wide">
          <h2 className="heading-label font-heading mb-6">Saved Searches</h2>

          {savedSearches.length === 0 ? (
            /* --- Empty state --- */
            <div className="card p-8 text-center">
              <p className="text-neutral-500 font-body">
                No saved searches yet.
              </p>
              <p className="text-neutral-400 text-sm mt-2">
                Search for homes and save your criteria to get notified of new
                listings.
              </p>
            </div>
          ) : (
            /* --- Saved search list --- */
            <div className="grid gap-4">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    {/* Search name */}
                    <h3 className="font-heading font-semibold text-lg">
                      {search.name}
                    </h3>

                    {/* Filters summary — show key/value pairs from the JSON */}
                    <p className="text-neutral-500 text-sm mt-1">
                      {Object.entries(search.filters || {})
                        .map(
                          ([key, val]) =>
                            `${key.replace(/_/g, " ")}: ${val}`
                        )
                        .join(" · ") || "All listings"}
                    </p>
                  </div>

                  {/* Frequency badge */}
                  <span className="text-xs text-neutral-400 uppercase tracking-wide shrink-0">
                    {search.frequency || "Instant"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* FAVORITES */}
      {/* ================================================================= */}
      <section className="section-white py-12">
        <div className="container-wide">
          <h2 className="heading-label font-heading mb-6">Favorites</h2>

          {favorites.length === 0 ? (
            /* --- Empty state --- */
            <div className="card p-8 text-center">
              <p className="text-neutral-500 font-body">No favorites yet.</p>
              <p className="text-neutral-400 text-sm mt-2">
                Browse listings and tap the heart icon to save your favorites
                here.
              </p>
            </div>
          ) : (
            /* --- Favorites grid — uses snapshot data from listing_data jsonb --- */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav) => {
                const listing = fav.listing_data || {};
                return (
                  <div key={fav.id} className="card overflow-hidden">
                    {/* Listing photo */}
                    {listing.photo_url ? (
                      <div className="aspect-[4/3] bg-neutral-100">
                        {/* Using img here since listing photos are external MLS URLs */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={listing.photo_url}
                          alt={listing.address || "Listing photo"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
                        <span className="text-neutral-300 text-sm">
                          No photo
                        </span>
                      </div>
                    )}

                    {/* Listing details */}
                    <div className="p-4">
                      {/* Price */}
                      {listing.price && (
                        <p className="font-heading font-semibold text-lg">
                          ${listing.price.toLocaleString()}
                        </p>
                      )}

                      {/* Beds / Baths / Sqft */}
                      <p className="text-neutral-500 text-sm mt-1">
                        {[
                          listing.beds && `${listing.beds} bed`,
                          listing.baths && `${listing.baths} bath`,
                          listing.sqft &&
                            `${listing.sqft.toLocaleString()} sqft`,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "Details unavailable"}
                      </p>

                      {/* Address + City */}
                      {listing.address && (
                        <p className="text-neutral-600 text-sm mt-1">
                          {listing.address}
                          {listing.city ? `, ${listing.city}` : ""}
                        </p>
                      )}

                      {/* Status badge */}
                      {listing.status && (
                        <span className="inline-block mt-2 text-xs uppercase tracking-wide text-neutral-400">
                          {listing.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
