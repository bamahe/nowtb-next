// =============================================================================
// DELETE /api/saved-searches/[id]/delete — Remove a saved search
// Accepts POST (from HTML form) to delete a user's saved search from Supabase
// Redirects back to /account after deletion
// =============================================================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/account", _request.url));
  }

  // Verify the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", _request.url));
  }

  // Delete the saved search — only if it belongs to this user
  await supabase
    .from("saved_searches")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  // Redirect back to account page
  return NextResponse.redirect(new URL("/account", _request.url));
}
