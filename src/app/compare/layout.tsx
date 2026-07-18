/**
 * Layout for /compare/ pages — hides site header, footer, nav, and mobile bar.
 * These are private client documents, not part of the main site navigation.
 * Uses a wrapper class that CSS targets to hide global layout elements.
 */
export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="compare-page">{children}</div>;
}
