import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion language. Everything is short, eased-out and subtle —
 * premium means restrained, so no spring overshoot on entrances.
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const transitions = {
  fast: { duration: 0.28, ease: EASE_OUT_EXPO },
  base: { duration: 0.55, ease: EASE_OUT_EXPO },
  slow: { duration: 0.85, ease: EASE_OUT_EXPO },
} satisfies Record<string, Transition>;

/** Standard scroll-reveal viewport config: fire once, slightly early. */
export const revealViewport = { once: true, margin: "-12% 0px -12% 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: transitions.base },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transitions.base },
};

/** Parent wrapper that staggers its children on reveal. */
export function staggerContainer(stagger = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** Word-by-word text reveal, used for the hero headline. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.55em", rotateX: -35 },
  visible: {
    opacity: 1,
    y: "0em",
    rotateX: 0,
    transition: { duration: 0.75, ease: EASE_OUT_EXPO },
  },
};

/** Reduced-motion replacement: opacity only, effectively instant. */
export const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};
