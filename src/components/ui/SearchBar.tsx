// =============================================================================
// SearchBar — Property search input that redirects to /properties?q=...
// "use client" because it manages input state and handles form submission
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
      className="flex w-full max-w-xl mx-auto items-center gap-2 rounded-full bg-white shadow-lg px-4 py-2"
    >
      {/* Search icon */}
      <Search className="h-5 w-5 text-muted flex-shrink-0" />

      {/* Text input — styled to blend into the rounded container */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by city, zip, or address..."
        className="flex-1 border-0 bg-transparent px-2 py-2 text-dark placeholder:text-muted
                   focus:outline-none focus:ring-0 font-body text-base"
      />

      {/* Submit button */}
      <button
        type="submit"
        className="btn-primary rounded-full px-5 py-2 text-sm"
      >
        Search
      </button>
    </form>
  );
}
