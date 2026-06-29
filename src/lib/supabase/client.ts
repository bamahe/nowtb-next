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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return null if Supabase isn't configured — callers must handle this
  if (!supabaseUrl || !supabaseKey) return null;

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
}
