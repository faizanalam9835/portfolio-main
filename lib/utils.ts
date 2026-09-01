import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Clamp a number into an inclusive range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Stable accent class sets so cards/badges stay visually consistent.
 * The `accent-*` colours come from the `@theme` block in globals.css, so
 * Tailwind generates the utilities (and `/opacity` modifiers) for them.
 */
export const accentStyles = {
  blue: {
    text: "text-accent-blue",
    bg: "bg-accent-blue",
    soft: "bg-accent-blue/8",
    ring: "ring-accent-blue/25",
    border: "border-accent-blue/25",
    gradient: "from-accent-blue/70 to-accent-cyan/40",
    hex: "#3b6cf6",
  },
  violet: {
    text: "text-accent-violet",
    bg: "bg-accent-violet",
    soft: "bg-accent-violet/8",
    ring: "ring-accent-violet/25",
    border: "border-accent-violet/25",
    gradient: "from-accent-violet/70 to-accent-blue/40",
    hex: "#7c5cf6",
  },
  cyan: {
    text: "text-accent-cyan",
    bg: "bg-accent-cyan",
    soft: "bg-accent-cyan/8",
    ring: "ring-accent-cyan/25",
    border: "border-accent-cyan/25",
    gradient: "from-accent-cyan/70 to-accent-violet/40",
    hex: "#22b8d9",
  },
} as const;

export type AccentKey = keyof typeof accentStyles;
