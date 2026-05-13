import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Heading font — Playfair Display 800 (editorial, elegant)
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

// Body font — DM Sans 400/500/600 (clean, modern)
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Barrett Henry, REALTOR® | Tampa Bay Homes for Sale | REMAX Collective",
    template: "%s | Barrett Henry, REALTOR®",
  },
  description:
    "Barrett Henry is a licensed real estate Broker Associate with REMAX Collective serving Tampa Bay. 23+ years of real estate experience. Search homes, get market data, and connect with a trusted local expert.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nowtb.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Barrett Henry, REALTOR® — REMAX Collective",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased bg-light text-dark">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
