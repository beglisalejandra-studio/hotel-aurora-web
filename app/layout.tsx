import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ConsentSlot } from "@/components/slots/ConsentSlot";
import { CspSlot } from "@/components/slots/CspSlot";
import { ThemeSlot } from "@/components/slots/ThemeSlot";
import { SkipLink } from "@/components/ui/SkipLink";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: site.name,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.lang}>
      <head>
        <ThemeSlot />
      </head>
      <body>
        <SkipLink />
        {children}
        <ConsentSlot />
        <CspSlot />
      </body>
    </html>
  );
}
