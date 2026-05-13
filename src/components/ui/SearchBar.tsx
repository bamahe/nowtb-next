// =============================================================================
// SearchBar — Elegant property search with underline-style input
// "use client" because it manages input state and handles form submission
// Minimal: transparent bg, bottom border only, uppercase submit text
// =============================================================================

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  /** On submit, redirect to the properties search page with the query */
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return; // don't submit empty searches

    router.push(`/properties?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl mx-auto items-center gap-4 border-b border-white/30 pb-2"
    >
      {/* Search icon — subtle, on the left */}
      <Search className="h-4 w-4 text-white/40 flex-shrink-0" />

      {/* Text input — transparent, no border except parent's bottom border */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by city, zip, or address..."
        className="flex-1 border-0 bg-transparent px-0 py-2 text-white placeholder:text-white/40
                   focus:outline-none focus:ring-0 font-body text-base font-light tracking-wide"
      />

      {/* Submit — text only, uppercase, wide tracking */}
      <button
        type="submit"
        className="font-body text-xs font-medium tracking-[0.2em] uppercase text-white/70
                   transition-colors duration-300 hover:text-white whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}
