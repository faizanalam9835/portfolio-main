"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as React from "react";

import { useHasFinePointer } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { clamp } from "@/lib/utils";

/**
 * Framer's motion.div redefines the drag/animation event handlers, so those
 * DOM handlers are excluded from the public prop type — this component is a
 * wrapper, not a drag surface.
 */
type PassthroughDivProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "style"
>;

export interface MagneticProps extends PassthroughDivProps {
  /** Maximum pull in pixels. */
  strength?: number;
  /** Extra pull applied to the inner content, creating a parallax feel. */
  contentStrength?: number;
}

/**
 * Wraps any interactive element and gives it a subtle magnetic pull toward
 * the cursor. Disabled for touch devices and reduced-motion users, where it
 * renders as a plain passthrough with no listeners attached.
 */
export function Magnetic({
  strength = 12,
  contentStrength = 6,
  children,
  className,
  ...props
}: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 20, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const ratio = contentStrength / strength;
  const innerX = useTransform(springX, (value) => value * ratio);
  const innerY = useTransform(springY, (value) => value * ratio);

  const handleMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled) return;
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);

      x.set(clamp((offsetX / rect.width) * strength * 2, -strength, strength));
      y.set(clamp((offsetY / rect.height) * strength * 2, -strength, strength));
    },
    [enabled, strength, x, y],
  );

  const reset = React.useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (!enabled) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: springX, y: springY }}
      className={className}
      {...props}
    >
      <motion.div style={{ x: innerX, y: innerY }}>{children}</motion.div>
    </motion.div>
  );
}
