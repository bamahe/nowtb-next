// =============================================================================
// /account — User Dashboard (Server Component)
// Shows saved searches, favorite listings, and profile info
// Redirects to /login if not authenticated
// =============================================================================

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/ui/SignOutButton";
import type { Metadata } from "next";

// --- SEO metadata ---
export const metadata: Metadata = {
  title: "My Account | Barrett Henry | REMAX Collective",
  description:
    "View your saved searches, favorite listings, and account settings on nowtb.com.",
  alternates: {
    canonical: "/account",
  },
  robots: {
    index: false,
    follow: false,
  },
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
  listing_key: string;
  listing_data: {
    address?: string;
    price?: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    photo?: string;
    photo_url?: string;
    city?: string;
    status?: string;
  };
  created_at: string;
}

export default async function AccountPage() {
  // --- Auth check: redirect if not logged in ---
  const supabase = await createClient();

  // If Supabase isn't configured, redirect to login
  if (!supabase) {
    redirect("/login");
  }

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
              {savedSearches.map((search) => {
                /* Build a URL that re-runs this saved search on /properties */
                const filterParams = new URLSearchParams(
                  Object.entries(search.filters || {})
                    .filter(([, v]) => v != null && v !== "")
                    .map(([k, v]) => [k, String(v)])
                ).toString();
                const runHref = filterParams
                  ? `/properties?${filterParams}`
                  : "/properties";

                return (
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

                    {/* Actions — run search + delete + frequency badge */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Run Search — re-opens /properties with saved filters */}
                      <Link
                        href={runHref}
                        className="text-xs font-body font-medium tracking-wide text-accent hover:text-primary border border-accent hover:border-primary px-3 py-1.5 transition-colors duration-200"
                      >
                        Run Search
                      </Link>

                      {/* Delete — form-based so it works without JS hydration */}
                      <form action={`/api/saved-searches/${search.id}/delete`} method="POST">
                        <button
                          type="submit"
                          className="text-xs font-body font-medium tracking-wide text-red-400 hover:text-red-600 border border-red-300 hover:border-red-500 px-3 py-1.5 transition-colors duration-200"
                          title="Delete this saved search"
                        >
                          Delete
                        </button>
                      </form>

                      {/* Frequency badge */}
                      <span className="text-xs text-neutral-400 uppercase tracking-wide">
                        {search.frequency || "Instant"}
                      </span>
                    </div>
                  </div>
                );
              })}
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
                // Photo field: FavoriteButton saves as "photo", old data may use "photo_url"
                const photoUrl = listing.photo || listing.photo_url;
                return (
                  <Link
                    key={fav.id}
                    href={`/properties/${fav.listing_key}`}
                    className="card overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    {/* Listing photo */}
                    {photoUrl ? (
                      <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoUrl}
                          alt={listing.address || "Listing photo"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                      {listing.price && (
                        <p className="font-heading font-semibold text-lg">
                          ${listing.price.toLocaleString()}
                        </p>
                      )}
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
                      {listing.address && (
                        <p className="text-neutral-600 text-sm mt-1">
                          {listing.address}
                          {listing.city ? `, ${listing.city}` : ""}
                        </p>
                      )}
                      <p className="text-accent text-xs mt-2 font-medium group-hover:underline">
                        View Listing →
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
