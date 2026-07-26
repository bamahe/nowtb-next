/**
 * /deals/ layout — standalone layout that opts out of the main site
 * header/footer. Deal analysis pages have their own complete design system
 * and don't need the site navigation chrome.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false }, // Private investor pages — noindex all /deals/
};

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
