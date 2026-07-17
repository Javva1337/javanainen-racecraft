import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { archivo, inter } from "@/lib/fonts";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from "@/lib/site";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE.sv,
    template: "%s · Rickard Javanainen",
  },
  description: DEFAULT_DESCRIPTION.sv,
  openGraph: {
    siteName: "Rickard Javanainen",
    type: "website",
    locale: "sv_SE",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Rickard Javanainen — Nyheter" }],
    },
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A1628",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        {children}
        <PersonJsonLd />
        <WebSiteJsonLd />
        <Analytics />
      </body>
    </html>
  );
}
