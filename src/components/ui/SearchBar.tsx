// =============================================================================
// SearchBar — Property search input that redirects to /properties?q=...
// "use client" because it manages input state and handles form submission
// Enhanced: pill shape, larger input, integrated search button, prominent shadow
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
      className="flex w-full max-w-2xl mx-auto items-center rounded-full bg-white shadow-xl px-2 py-1.5"
    >
      {/* Search icon — inside the input on the left */}
      <div className="flex items-center justify-center pl-4 pr-2">
        <Search className="h-5 w-5 text-muted flex-shrink-0" />
      </div>

      {/* Text input — large, blends into the rounded pill container */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by city, zip, or address..."
        className="flex-1 border-0 bg-transparent px-2 py-3 text-dark placeholder:text-muted
                   focus:outline-none focus:ring-0 font-body text-lg"
      />

      {/* Submit button — integrated into the right side of the pill */}
      <button
        type="submit"
        className="btn-primary rounded-full px-6 py-3 text-base whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}
