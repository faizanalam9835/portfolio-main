"use client";

import { useEffect, useState } from "react";

import type { SectionId } from "@/types";

/**
 * Tracks which section owns the viewport, for the nav's active indicator.
 *
 * Uses a single IntersectionObserver with a band near the top third of the
 * viewport rather than scroll math, so it costs nothing per scroll frame.
 */
export function useActiveSection(
  ids: readonly SectionId[],
  fallback: SectionId,
): SectionId {
  const [active, setActive] = useState<SectionId>(fallback);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio);
        }

        let best: { id: string; ratio: number } | null = null;
        for (const [id, ratio] of visibility) {
          if (ratio > 0 && (!best || ratio > best.ratio)) best = { id, ratio };
        }

        if (best) setActive(best.id as SectionId);
      },
      {
        // Bias toward the upper half so the indicator changes as a section
        // takes over the reading position, not when it merely appears.
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.6, 0.85],
      },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
