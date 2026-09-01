"use client";

import { useInView, useMotionValue, useSpring } from "framer-motion";
import * as React from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * Counts up when scrolled into view. Writes to the DOM node directly from
 * a motion value subscription — no per-frame React re-render.
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
  className,
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals],
  );

  React.useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      motionValue.jump(value);
      spring.jump(value);
      return;
    }
    motionValue.set(value);
  }, [inView, motionValue, prefersReducedMotion, spring, value]);

  React.useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      const node = ref.current;
      if (node) node.textContent = formatter.format(latest);
    });
    return unsubscribe;
  }, [formatter, spring]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {/* Static content is the accessible/no-JS value; the ref target is updated live. */}
      <span ref={ref}>{formatter.format(0)}</span>
      {suffix}
    </span>
  );
}
