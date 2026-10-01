import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { config } from "@/data/config";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/shell/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL(config.site),
  title: { default: config.title, template: `%s · ${config.name}` },
  description: config.description,
  authors: [{ name: config.name }],
  openGraph: {
    title: config.title,
    description: config.description,
    url: config.site,
    images: ["/assets/seo/og-image.png"],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: config.title, description: config.description },
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
