// =============================================================================
// AccountDashboard — Full-featured consumer dashboard (Client Component)
// Tabs: Favorites | Saved Searches | Recently Viewed | Settings
// Merges localStorage data with Supabase data when user is logged in
// =============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Heart,
  Search,
  Clock,
  Settings,
  X,
  Bell,
  BellOff,
  Trash2,
  ExternalLink,
  Home,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// =============================================================================
// Types
// =============================================================================

/** Shape of a favorite listing (from Supabase or localStorage) */
interface FavoriteListing {
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
  source: "supabase" | "local"; // tracks where this came from
}

/** Shape of a saved search (from Supabase or localStorage) */
interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  frequency?: string | null;
  email_alerts?: boolean;
  created_at: string;
  source: "supabase" | "local";
}

/** Shape of a recently viewed listing (from localStorage only) */
interface RecentlyViewedEntry {
  listing_key: string;
  address: string;
  city: string;
  price: number;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  photo: string;
  viewed_at: string;
}

/** Props passed from the server component wrapper */
interface AccountDashboardProps {
  /** User display name (profile name or email) */
  displayName: string;
  /** User email address */
  email: string;
  /** Initial profile data from Supabase */
  initialProfile: {
    full_name: string | null;
    phone: string | null;
  } | null;
  /** Initial favorites from Supabase */
  initialFavorites: FavoriteListing[];
  /** Initial saved searches from Supabase */
  initialSearches: SavedSearch[];
  /** Sign out button component (server-rendered) */
  signOutButton: React.ReactNode;
}

// =============================================================================
// Tab definitions
// =============================================================================

const TABS = [
  { key: "favorites", label: "Favorites", icon: Heart },
  { key: "searches", label: "Saved Searches", icon: Search },
  { key: "recent", label: "Recently Viewed", icon: Clock },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// =============================================================================
// localStorage keys (must match FavoriteButton and RecentlyViewedTracker)
// =============================================================================

const FAV_STORAGE_KEY = "nowtb_favorites";
const SEARCH_STORAGE_KEY = "nowtb_saved_searches";
const RECENT_STORAGE_KEY = "nowtb_recently_viewed";

// =============================================================================
// Component
// =============================================================================

export default function AccountDashboard({
  displayName,
  email,
  initialProfile,
  initialFavorites,
  initialSearches,
  signOutButton,
}: AccountDashboardProps) {
  // -- Active tab state --
  const [activeTab, setActiveTab] = useState<TabKey>("favorites");

  // -- Merged favorites (Supabase + localStorage) --
  const [favorites, setFavorites] = useState<FavoriteListing[]>(initialFavorites);

  // -- Merged saved searches (Supabase + localStorage) --
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(initialSearches);

  // -- Recently viewed (localStorage only) --
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedEntry[]>([]);

  // -- Settings form state --
  const [settingsName, setSettingsName] = useState(initialProfile?.full_name || "");
  const [settingsEmail] = useState(email); // email shown but not editable here
  const [settingsPhone, setSettingsPhone] = useState(initialProfile?.phone || "");
  const [alertNewMatches, setAlertNewMatches] = useState(true);
  const [alertPriceDrops, setAlertPriceDrops] = useState(true);
  const [alertStatusChanges, setAlertStatusChanges] = useState(false);
  const [alertFrequency, setAlertFrequency] = useState<"instant" | "daily" | "weekly">("instant");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // ---------------------------------------------------------------------------
  // On mount: merge localStorage data with server-fetched data
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // -- Merge favorites --
    try {
      const localFavKeys: string[] = JSON.parse(
        localStorage.getItem(FAV_STORAGE_KEY) || "[]"
      );
      // Find local-only favorites (not already in Supabase results)
      const supabaseKeys = new Set(initialFavorites.map((f) => f.listing_key));
      const localOnlyFavs: FavoriteListing[] = localFavKeys
        .filter((key) => !supabaseKeys.has(key))
        .map((key) => ({
          id: `local-${key}`,
          listing_key: key,
          listing_data: {}, // no snapshot data for local-only
          created_at: new Date().toISOString(),
          source: "local" as const,
        }));
      if (localOnlyFavs.length > 0) {
        setFavorites((prev) => [...prev, ...localOnlyFavs]);
      }
    } catch {
      // localStorage parse failure — ignore
    }

    // -- Merge saved searches from localStorage --
    try {
      const localSearches = JSON.parse(
        localStorage.getItem(SEARCH_STORAGE_KEY) || "[]"
      );
      if (Array.isArray(localSearches) && localSearches.length > 0) {
        const supabaseIds = new Set(initialSearches.map((s) => s.id));
        const localOnly = localSearches
          .filter(
            (s: SavedSearch) => !supabaseIds.has(s.id)
          )
          .map((s: SavedSearch) => ({
            ...s,
            source: "local" as const,
          }));
        if (localOnly.length > 0) {
          setSavedSearches((prev) => [...prev, ...localOnly]);
        }
      }
    } catch {
      // ignore
    }

    // -- Load recently viewed from localStorage --
    try {
      const raw = localStorage.getItem(RECENT_STORAGE_KEY);
      if (raw) {
        const parsed: RecentlyViewedEntry[] = JSON.parse(raw);
        // Show max 12 on the dashboard
        setRecentlyViewed(parsed.slice(0, 12));
      }
    } catch {
      // ignore
    }
  }, [initialFavorites, initialSearches]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /** Remove a favorite — from Supabase AND localStorage */
  const removeFavorite = useCallback(
    async (fav: FavoriteListing) => {
      // Optimistically remove from UI
      setFavorites((prev) => prev.filter((f) => f.id !== fav.id));

      // Remove from localStorage
      try {
        const localFavs: string[] = JSON.parse(
          localStorage.getItem(FAV_STORAGE_KEY) || "[]"
        );
        const updated = localFavs.filter((k) => k !== fav.listing_key);
        localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }

      // Remove from Supabase if it came from there
      if (fav.source === "supabase") {
        const supabase = createClient();
        if (!supabase) return;
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from("favorites")
              .delete()
              .eq("id", fav.id)
              .eq("user_id", user.id);
          }
        } catch {
          // DB delete failed — already removed from UI
        }
      }
    },
    []
  );

  /** Delete a saved search — from Supabase or localStorage */
  const deleteSearch = useCallback(
    async (search: SavedSearch) => {
      // Optimistically remove from UI
      setSavedSearches((prev) => prev.filter((s) => s.id !== search.id));

      if (search.source === "local") {
        // Remove from localStorage
        try {
          const localSearches = JSON.parse(
            localStorage.getItem(SEARCH_STORAGE_KEY) || "[]"
          );
          const updated = localSearches.filter(
            (s: SavedSearch) => s.id !== search.id
          );
          localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      } else {
        // Delete from Supabase via API route
        try {
          await fetch(`/api/saved-searches/${search.id}/delete`, {
            method: "POST",
          });
        } catch {
          // API call failed — already removed from UI
        }
      }
    },
    []
  );

  /** Toggle email alerts for a saved search */
  const toggleSearchAlerts = useCallback(
    async (search: SavedSearch) => {
      const newValue = !search.email_alerts;
      // Optimistic update
      setSavedSearches((prev) =>
        prev.map((s) =>
          s.id === search.id ? { ...s, email_alerts: newValue } : s
        )
      );

      if (search.source === "supabase") {
        const supabase = createClient();
        if (!supabase) return;
        try {
          await supabase
            .from("saved_searches")
            .update({ email_alerts: newValue })
            .eq("id", search.id);
        } catch {
          // Revert on failure
          setSavedSearches((prev) =>
            prev.map((s) =>
              s.id === search.id ? { ...s, email_alerts: !newValue } : s
            )
          );
        }
      } else {
        // Update localStorage
        try {
          const localSearches = JSON.parse(
            localStorage.getItem(SEARCH_STORAGE_KEY) || "[]"
          );
          const updated = localSearches.map((s: SavedSearch) =>
            s.id === search.id ? { ...s, email_alerts: newValue } : s
          );
          localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
    },
    []
  );

  /** Save account settings to Supabase profiles table */
  const saveSettings = useCallback(async () => {
    setSettingsSaving(true);
    setSettingsSaved(false);

    const supabase = createClient();
    if (!supabase) {
      setSettingsSaving(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setSettingsSaving(false);
        return;
      }

      // Upsert profile data
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: settingsName.trim() || null,
        phone: settingsPhone.trim() || null,
        email_alerts_new_matches: alertNewMatches,
        email_alerts_price_drops: alertPriceDrops,
        email_alerts_status_changes: alertStatusChanges,
        alert_frequency: alertFrequency,
        updated_at: new Date().toISOString(),
      });

      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch {
      // save failed — silently ignore
    } finally {
      setSettingsSaving(false);
    }
  }, [settingsName, settingsPhone, alertNewMatches, alertPriceDrops, alertStatusChanges, alertFrequency]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="pt-24 font-body">
      {/* ================================================================= */}
      {/* HEADER — user info + sign out                                      */}
      {/* ================================================================= */}
      <section className="bg-white py-12">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="heading-section font-heading text-2xl md:text-3xl">
                Welcome, {displayName}
              </h1>
              <p className="text-muted text-sm mt-1">{email}</p>
            </div>
            {signOutButton}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* TAB BAR                                                            */}
      {/* ================================================================= */}
      <div className="border-b border-border bg-white sticky top-16 z-30">
        <div className="container-wide">
          <nav className="flex gap-0 overflow-x-auto scrollbar-hide" aria-label="Dashboard tabs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    "flex items-center gap-2 px-5 py-4 font-body text-xs font-medium tracking-[0.15em] uppercase whitespace-nowrap transition-colors duration-200 border-b-2 cursor-pointer",
                    isActive
                      ? "border-accent text-primary"
                      : "border-transparent text-muted hover:text-primary hover:border-accent/30",
                  ].join(" ")}
                  aria-selected={isActive}
                  role="tab"
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ================================================================= */}
      {/* TAB CONTENT                                                        */}
      {/* ================================================================= */}
      <div className="py-12">
        <div className="container-wide">
          {/* ---- FAVORITES TAB ---- */}
          {activeTab === "favorites" && (
            <FavoritesTab
              favorites={favorites}
              onRemove={removeFavorite}
            />
          )}

          {/* ---- SAVED SEARCHES TAB ---- */}
          {activeTab === "searches" && (
            <SavedSearchesTab
              searches={savedSearches}
              onDelete={deleteSearch}
              onToggleAlerts={toggleSearchAlerts}
            />
          )}

          {/* ---- RECENTLY VIEWED TAB ---- */}
          {activeTab === "recent" && (
            <RecentlyViewedTab items={recentlyViewed} />
          )}

          {/* ---- SETTINGS TAB ---- */}
          {activeTab === "settings" && (
            <SettingsTab
              name={settingsName}
              onNameChange={setSettingsName}
              email={settingsEmail}
              phone={settingsPhone}
              onPhoneChange={setSettingsPhone}
              alertNewMatches={alertNewMatches}
              onAlertNewMatchesChange={setAlertNewMatches}
              alertPriceDrops={alertPriceDrops}
              onAlertPriceDropsChange={setAlertPriceDrops}
              alertStatusChanges={alertStatusChanges}
              onAlertStatusChangesChange={setAlertStatusChanges}
              alertFrequency={alertFrequency}
              onAlertFrequencyChange={setAlertFrequency}
              onSave={saveSettings}
              saving={settingsSaving}
              saved={settingsSaved}
            />
          )}
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// SUB-COMPONENTS: Favorites Tab
// =============================================================================

function FavoritesTab({
  favorites,
  onRemove,
}: {
  favorites: FavoriteListing[];
  onRemove: (fav: FavoriteListing) => void;
}) {
  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No favorites yet"
        description="Browse listings and tap the heart icon to save your favorites here."
        ctaLabel="Browse Properties"
        ctaHref="/properties"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {favorites.map((fav) => {
        const listing = fav.listing_data || {};
        // Photo field: FavoriteButton saves as "photo", old data may use "photo_url"
        const photoUrl = listing.photo || listing.photo_url;

        return (
          <div
            key={fav.id}
            className="card overflow-hidden group relative"
          >
            {/* Remove button — X in top-right corner */}
            <button
              onClick={() => onRemove(fav)}
              className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
              aria-label="Remove from favorites"
              title="Remove from favorites"
            >
              <X size={16} />
            </button>

            <Link href={`/properties/${fav.listing_key}`} className="block">
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
                  <Home className="text-neutral-300" size={32} />
                </div>
              )}

              {/* Listing details */}
              <div className="p-4">
                {listing.price != null && (
                  <p className="font-heading font-semibold text-lg text-primary">
                    ${listing.price.toLocaleString()}
                  </p>
                )}
                <p className="text-muted text-sm mt-1">
                  {[
                    listing.beds != null && `${listing.beds} bed`,
                    listing.baths != null && `${listing.baths} bath`,
                    listing.sqft != null &&
                      `${listing.sqft.toLocaleString()} sqft`,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Details unavailable"}
                </p>
                {listing.address && (
                  <p className="text-dark text-sm mt-1">
                    {listing.address}
                    {listing.city ? `, ${listing.city}` : ""}
                  </p>
                )}
                <p className="text-accent text-xs mt-2 font-medium group-hover:underline">
                  View Listing →
                </p>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS: Saved Searches Tab
// =============================================================================

function SavedSearchesTab({
  searches,
  onDelete,
  onToggleAlerts,
}: {
  searches: SavedSearch[];
  onDelete: (search: SavedSearch) => void;
  onToggleAlerts: (search: SavedSearch) => void;
}) {
  if (searches.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No saved searches yet"
        description="Search for homes and save your criteria to get notified when new listings match."
        ctaLabel="Search Properties"
        ctaHref="/properties"
      />
    );
  }

  return (
    <div className="grid gap-4">
      {searches.map((search) => {
        // Build URL to re-run this search on /properties
        const filterParams = new URLSearchParams(
          Object.entries(search.filters || {})
            .filter(([, v]) => v != null && v !== "")
            .map(([k, v]) => [k, String(v)])
        ).toString();
        const runHref = filterParams
          ? `/properties?${filterParams}`
          : "/properties";

        // Build a readable summary of the filters
        const filterSummary =
          Object.entries(search.filters || {})
            .map(
              ([key, val]) =>
                `${key.replace(/_/g, " ")}: ${val}`
            )
            .join(" · ") || "All listings";

        return (
          <div
            key={search.id}
            className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            {/* Search info */}
            <div className="min-w-0 flex-1">
              <h3 className="font-heading font-semibold text-lg text-primary truncate">
                {search.name}
              </h3>
              <p className="text-muted text-sm mt-1 truncate">
                {filterSummary}
              </p>
              <p className="text-muted text-xs mt-1">
                Saved {new Date(search.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {/* Run Search */}
              <Link
                href={runHref}
                className="inline-flex items-center gap-1.5 text-xs font-body font-medium tracking-[0.1em] uppercase text-accent hover:text-primary border border-accent hover:border-primary px-3 py-2 transition-colors duration-200"
              >
                <ExternalLink size={12} />
                Run Search
              </Link>

              {/* Toggle email alerts */}
              <button
                onClick={() => onToggleAlerts(search)}
                className={[
                  "inline-flex items-center gap-1.5 text-xs font-body font-medium tracking-[0.1em] uppercase px-3 py-2 border transition-colors duration-200 cursor-pointer",
                  search.email_alerts
                    ? "text-green-600 border-green-300 hover:border-green-500"
                    : "text-muted border-border hover:border-muted",
                ].join(" ")}
                title={search.email_alerts ? "Alerts ON — click to turn off" : "Alerts OFF — click to turn on"}
              >
                {search.email_alerts ? <Bell size={12} /> : <BellOff size={12} />}
                {search.email_alerts ? "Alerts On" : "Alerts Off"}
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete(search)}
                className="inline-flex items-center gap-1.5 text-xs font-body font-medium tracking-[0.1em] uppercase text-red-400 hover:text-red-600 border border-red-300 hover:border-red-500 px-3 py-2 transition-colors duration-200 cursor-pointer"
                title="Delete this saved search"
              >
                <Trash2 size={12} />
                Delete
              </button>

              {/* Frequency badge */}
              <span className="text-xs text-muted uppercase tracking-wide">
                {search.frequency || "Instant"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS: Recently Viewed Tab
// =============================================================================

function RecentlyViewedTab({ items }: { items: RecentlyViewedEntry[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No recently viewed listings"
        description="Listings you view will appear here automatically so you can easily find them again."
        ctaLabel="Browse Properties"
        ctaHref="/properties"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <Link
          key={`${item.listing_key}-${item.viewed_at}`}
          href={`/properties/${item.listing_key}`}
          className="card overflow-hidden group"
        >
          {/* Photo */}
          {item.photo ? (
            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.photo}
                alt={item.address || "Listing photo"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
              <Home className="text-neutral-300" size={32} />
            </div>
          )}

          {/* Details */}
          <div className="p-4">
            {item.price != null && (
              <p className="font-heading font-semibold text-lg text-primary">
                ${item.price.toLocaleString()}
              </p>
            )}
            <p className="text-muted text-sm mt-1">
              {[
                item.beds != null && `${item.beds} bed`,
                item.baths != null && `${item.baths} bath`,
                item.sqft != null && `${item.sqft.toLocaleString()} sqft`,
              ]
                .filter(Boolean)
                .join(" · ") || "Details unavailable"}
            </p>
            <p className="text-dark text-sm mt-1">
              {item.address}
              {item.city ? `, ${item.city}` : ""}
            </p>
            <p className="text-muted text-xs mt-2">
              Viewed{" "}
              {new Date(item.viewed_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              at{" "}
              {new Date(item.viewed_at).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p className="text-accent text-xs mt-1 font-medium group-hover:underline">
              View Listing →
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS: Settings Tab
// =============================================================================

function SettingsTab({
  name,
  onNameChange,
  email,
  phone,
  onPhoneChange,
  alertNewMatches,
  onAlertNewMatchesChange,
  alertPriceDrops,
  onAlertPriceDropsChange,
  alertStatusChanges,
  onAlertStatusChangesChange,
  alertFrequency,
  onAlertFrequencyChange,
  onSave,
  saving,
  saved,
}: {
  name: string;
  onNameChange: (v: string) => void;
  email: string;
  phone: string;
  onPhoneChange: (v: string) => void;
  alertNewMatches: boolean;
  onAlertNewMatchesChange: (v: boolean) => void;
  alertPriceDrops: boolean;
  onAlertPriceDropsChange: (v: boolean) => void;
  alertStatusChanges: boolean;
  onAlertStatusChangesChange: (v: boolean) => void;
  alertFrequency: "instant" | "daily" | "weekly";
  onAlertFrequencyChange: (v: "instant" | "daily" | "weekly") => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <div className="max-w-2xl space-y-10">
      {/* ---- Profile Info ---- */}
      <div>
        <h2 className="heading-label font-heading mb-6">Profile Information</h2>
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="settings-name"
              className="block font-body text-sm font-medium text-dark mb-1"
            >
              Full Name
            </label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Your full name"
              className="w-full"
            />
          </div>

          {/* Email (read-only, change via Supabase auth) */}
          <div>
            <label
              htmlFor="settings-email"
              className="block font-body text-sm font-medium text-dark mb-1"
            >
              Email
            </label>
            <input
              id="settings-email"
              type="email"
              value={email}
              readOnly
              className="w-full bg-neutral-50 cursor-not-allowed text-muted"
            />
            <p className="text-muted text-xs mt-1">
              Email is managed by your login credentials.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="settings-phone"
              className="block font-body text-sm font-medium text-dark mb-1"
            >
              Phone
            </label>
            <input
              id="settings-phone"
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* ---- Notification Preferences ---- */}
      <div>
        <h2 className="heading-label font-heading mb-6">
          Notification Preferences
        </h2>
        <div className="space-y-4">
          {/* Toggle: New matches */}
          <ToggleRow
            label="New listings that match your saved searches"
            checked={alertNewMatches}
            onChange={onAlertNewMatchesChange}
          />

          {/* Toggle: Price drops */}
          <ToggleRow
            label="Price drops on your favorited listings"
            checked={alertPriceDrops}
            onChange={onAlertPriceDropsChange}
          />

          {/* Toggle: Status changes */}
          <ToggleRow
            label="Status changes (pending, sold) on favorites"
            checked={alertStatusChanges}
            onChange={onAlertStatusChangesChange}
          />

          {/* Alert frequency — radio buttons */}
          <div className="pt-4 border-t border-border">
            <p className="font-body text-sm font-medium text-dark mb-3">
              Alert Frequency
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {(["instant", "daily", "weekly"] as const).map((freq) => (
                <label
                  key={freq}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="alert-frequency"
                    value={freq}
                    checked={alertFrequency === freq}
                    onChange={() => onAlertFrequencyChange(freq)}
                    className="accent-accent w-4 h-4"
                  />
                  <span className="font-body text-sm text-dark capitalize">
                    {freq}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Save button ---- */}
      <div className="flex items-center gap-4">
        <button
          onClick={onSave}
          disabled={saving}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {saved && (
          <span className="font-body text-sm text-green-600">
            Settings saved successfully.
          </span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Shared: Toggle Row (on/off switch style)
// =============================================================================

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-body text-sm text-dark">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer shrink-0",
          checked ? "bg-accent" : "bg-neutral-300",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

// =============================================================================
// Shared: Empty State
// =============================================================================

function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="card p-12 text-center max-w-lg mx-auto">
      <Icon size={40} className="mx-auto text-accent/50 mb-4" />
      <h3 className="font-heading font-semibold text-lg text-primary mb-2">
        {title}
      </h3>
      <p className="text-muted text-sm mb-6">{description}</p>
      <Link href={ctaHref} className="btn-primary">
        {ctaLabel}
      </Link>
    </div>
  );
}
