"use client";

import { useReducedMotion } from "framer-motion";

/** Single source of truth for motion preference. */
export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}
