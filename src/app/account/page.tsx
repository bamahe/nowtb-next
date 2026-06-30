// =============================================================================
// /account — User Dashboard (Server Component Wrapper)
// Handles auth check + data fetching, delegates rendering to AccountDashboard
// Redirects to /login if not authenticated
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/ui/SignOutButton";
import AccountDashboard from "@/components/ui/AccountDashboard";
import type { Metadata } from "next";

// --- SEO metadata (noindex — this is a private account page) ---
export const metadata: Metadata = {
  title: "My Account | Barrett Henry | REMAX Collective",
  description:
    "View your saved searches, favorite listings, recently viewed homes, and account settings on nowtb.com.",
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
  email_alerts?: boolean;
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
  const rawFavorites = (favoritesResult.data as Favorite[]) || [];
  const rawSearches = (searchesResult.data as SavedSearch[]) || [];

  // --- Display name: use profile name, fall back to email ---
  const displayName = profile?.full_name || user.email || "There";

  // --- Transform data for the client component ---
  // Tag each item with source: "supabase" so the client knows where it came from
  const favorites = rawFavorites.map((fav) => ({
    ...fav,
    source: "supabase" as const,
  }));

  const savedSearches = rawSearches.map((search) => ({
    ...search,
    source: "supabase" as const,
  }));

  return (
    <AccountDashboard
      displayName={displayName}
      email={user.email || ""}
      initialProfile={
        profile
          ? { full_name: profile.full_name, phone: profile.phone }
          : null
      }
      initialFavorites={favorites}
      initialSearches={savedSearches}
      signOutButton={<SignOutButton />}
    />
  );
}
