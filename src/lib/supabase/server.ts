// =============================================================================
// Supabase server client — use in Server Components, Route Handlers, Actions
// Reads/writes auth cookies on the server side
// =============================================================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for use on the server.
 * Must be called inside a Server Component, Route Handler, or Server Action.
 * Handles cookie-based auth session automatically.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can fail in Server Components (read-only context)
            // This is fine — the middleware handles cookie refresh
          }
        },
      },
    }
  );
}

/**
 * Creates a Supabase admin client using the service role key.
 * Bypasses RLS — only use for server-side admin operations.
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {},
      },
    }
  );
}
