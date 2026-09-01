"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Single source of truth for motion preference. Framer variants, the 3D
 * canvases and the custom cursor all gate on this, matching the CSS
 * `prefers-reduced-motion` block in globals.css.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
