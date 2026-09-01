"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

/**
 * Light is the product's identity, so it is the explicit default rather
 * than following the system preference.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      themes={["light", "dark"]}
    >
      {children}
    </NextThemesProvider>
  );
}
