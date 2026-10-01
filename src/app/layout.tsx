import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { config } from "@/data/config";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/shell/site-shell";

// Absolute URL: link-preview crawlers (WhatsApp, LinkedIn, X) need a full https:// address.
const ogImage = `${config.site}${config.ogImage}`;

export const metadata: Metadata = {
  metadataBase: new URL(config.site),
  title: { default: config.title, template: `%s · ${config.name}` },
  description: config.description,
  authors: [{ name: config.name }],
  openGraph: {
    type: "website",
    siteName: config.name,
    locale: "en_US",
    url: config.site,
    title: config.title,
    description: config.description,
    images: [{ url: ogImage, width: 1200, height: 630, alt: config.ogImageAlt, type: "image/jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: config.title,
    description: config.description,
    images: [{ url: ogImage, alt: config.ogImageAlt }],
  },
};

const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
