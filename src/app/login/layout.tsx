// =============================================================================
// /login layout — exports metadata for the client component page
// The page itself is "use client" so metadata must live here.
// =============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Barrett Henry | nowtb.com",
  description:
    "Sign in to your nowtb.com account to view saved searches, favorites, and more. Barrett Henry, REMAX Collective.",
  alternates: {
    canonical: "/login/",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
