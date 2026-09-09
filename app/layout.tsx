import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import type * as React from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { CustomCursor } from "@/components/shared/custom-cursor";
import { SiteBackdrop } from "@/components/shared/site-backdrop";
import { baseMetadata, buildStructuredData } from "@/lib/seo";

import "./globals.css";

/**
 * Fonts are self-hosted by next/font at build time (no runtime request to
 * Google), subset to latin, and exposed as CSS variables consumed by the
 * `@theme` block in globals.css.
 */
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/** Display face for headings — tighter and more editorial than the body sans. */
const display = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fc" },
    { media: "(prefers-color-scheme: dark)", color: "#070a13" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Person + WebSite + project ItemList graph for rich results. */}
        <script
          type="application/ld+json"
          // Serialised from a typed builder, not user input.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildStructuredData()),
          }}
        />
      </head>
      <body
        className={`${sans.variable} ${mono.variable} ${display.variable} antialiased`}
      >
        <ThemeProvider>
          {/* Fixed grid + aurora ground; every surface above it is glass. */}
          <SiteBackdrop />

          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
          >
            Skip to content
          </a>

          {children}

          <CustomCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
