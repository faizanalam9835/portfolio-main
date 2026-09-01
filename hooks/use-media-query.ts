"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Returns `false` on the server and during the
 * first client render, then settles after mount — so it never causes a
 * hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True from `lg` upwards — used to gate the heavier 3D scenes. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 64rem)");
}

/** True only for real pointing devices — gates the custom cursor. */
export function useHasFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
