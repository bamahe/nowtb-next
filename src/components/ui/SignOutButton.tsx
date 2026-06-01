// =============================================================================
// SignOutButton — Client component for signing out via Supabase
// Used on the account/dashboard page
// =============================================================================

"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={handleSignOut} className="btn-secondary text-xs">
      Sign Out
    </button>
  );
}
