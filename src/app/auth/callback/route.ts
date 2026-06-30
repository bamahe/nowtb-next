// =============================================================================
// Auth Callback — handles the redirect after Google login or magic link click
// Exchanges the auth code for a session and redirects to the site
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error_param = searchParams.get("error");
  const error_description = searchParams.get("error_description");
  // Where to send the user after login (default: account page)
  const next = searchParams.get("next") ?? "/account";

  // If there's an error from the OAuth provider, redirect with message
  if (error_param) {
    console.error("[Auth Callback] OAuth error:", error_param, error_description);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error_description || error_param)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error("[Auth Callback] Session exchange error:", error.message);
    } else {
      console.error("[Auth Callback] Supabase client is null — env vars missing?");
    }
  } else {
    console.error("[Auth Callback] No code parameter in URL:", request.url);
  }

  // If something went wrong, send them to login with an error
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
