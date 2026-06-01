// =============================================================================
// Supabase browser client — use in Client Components ("use client")
// Creates a Supabase client that works with cookies for auth session tracking
// =============================================================================

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in the browser (Client Components).
 * Reads auth session from cookies automatically.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
