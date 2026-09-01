"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import * as React from "react";

import { useHasFinePointer } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export interface SpotlightCardProps
  extends React.ComponentPropsWithoutRef<"div"> {
  /** Radius of the cursor-following highlight, in pixels. */
  radius?: number;
  /** Max rotation in degrees. Set to 0 for a flat card with spotlight only. */
  tilt?: number;
  accentHex?: string;
  /** Adds an animated conic border on hover. */
  borderGlow?: boolean;
  /**
   * Classes for the inner content wrapper. The wrapper is a flex column by
   * default, which is what makes `flex-1` and `mt-auto` inside a card
   * behave — pass a grid here to lay a card out horizontally instead.
   */
  contentClassName?: string;
}

/**
 * The signature card interaction: a cursor-following spotlight, a soft
 * border glow, and optional 3D tilt with real perspective.
 *
 * All pointer work happens on motion values (no React state, no re-render
 * per frame) and the whole effect is skipped for touch and reduced motion.
 */
export function SpotlightCard({
  radius = 380,
  tilt = 6,
  accentHex = "#7c5cf6",
  borderGlow = true,
  className,
  contentClassName,
  children,
  ...props
}: SpotlightCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const pointerX = useMotionValue(-9999);
  const pointerY = useMotionValue(-9999);
  const opacity = useMotionValue(0);

  const rotateX = useSpring(0, { stiffness: 180, damping: 22, mass: 0.6 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 22, mass: 0.6 });

  const spotlight = useMotionTemplate`radial-gradient(${radius}px circle at ${pointerX}px ${pointerY}px, ${accentHex}1f, transparent 72%)`;
  const border = useMotionTemplate`radial-gradient(${radius * 0.7}px circle at ${pointerX}px ${pointerY}px, ${accentHex}, transparent 70%)`;

  const handleMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled) return;
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;

      pointerX.set(localX);
      pointerY.set(localY);
      opacity.set(1);

      if (tilt > 0) {
        const centerOffsetX = localX / rect.width - 0.5;
        const centerOffsetY = localY / rect.height - 0.5;
        rotateY.set(centerOffsetX * tilt * 2);
        rotateX.set(-centerOffsetY * tilt * 2);
      }
    },
    [enabled, opacity, pointerX, pointerY, rotateX, rotateY, tilt],
  );

  const handleLeave = React.useCallback(() => {
    opacity.set(0);
    rotateX.set(0);
    rotateY.set(0);
  }, [opacity, rotateX, rotateY]);

  return (
    <div
      className={cn("h-full", enabled && tilt > 0 && "[perspective:1400px]")}
      style={{ transformStyle: enabled && tilt > 0 ? "preserve-3d" : undefined }}
    >
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={
          enabled && tilt > 0
            ? { rotateX, rotateY, transformStyle: "preserve-3d" }
            : undefined
        }
        className="group/card relative h-full will-change-transform"
      >
        {/*
          Border glow lives outside the clipping container so the ring can
          bleed past the card edge; the card itself keeps overflow-hidden.
        */}
        {borderGlow && enabled ? (
          <motion.div
            aria-hidden
            style={{ opacity, background: border }}
            className="pointer-events-none absolute -inset-[1.5px] rounded-[calc(var(--radius-card)+2px)] blur-[1px] transition-opacity duration-300"
          />
        ) : null}

        <div
          className={cn(
            "relative isolate h-full overflow-hidden rounded-2xl",
            "border border-[var(--border-subtle)] bg-[var(--surface)]",
            "shadow-soft transition-shadow duration-500 group-hover/card:shadow-lift",
            className,
          )}
          {...props}
        >
          {/* Interior spotlight wash. */}
          {enabled ? (
            <motion.div
              aria-hidden
              style={{ opacity, background: spotlight }}
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            />
          ) : null}

          <div className={cn("relative flex h-full flex-col", contentClassName)}>
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
