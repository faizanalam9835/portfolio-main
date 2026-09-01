"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  fadeUp,
  reducedVariants,
  revealViewport,
  staggerContainer,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealTag = "div" | "section" | "article" | "li" | "span" | "header";

export interface RevealProps extends HTMLMotionProps<"div"> {
  as?: RevealTag;
  variants?: Variants;
  delay?: number;
  /** Skip the viewport trigger and animate immediately (hero, above the fold). */
  immediate?: boolean;
}

/**
 * Scroll-triggered reveal. Fires once, respects reduced motion, and falls
 * back to a plain opacity fade when motion is reduced.
 */
export function Reveal({
  as = "div",
  variants = fadeUp,
  delay = 0,
  immediate = false,
  className,
  children,
  ...props
}: RevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // `as` only ever resolves to a block-level tag, and the prop surface we
  // accept is the div one; the cast keeps prop checking against that surface
  // instead of the union of every tag's element type.
  const MotionTag = motion[as] as typeof motion.div;
  const resolved = prefersReducedMotion ? reducedVariants : variants;

  return (
    <MotionTag
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: revealViewport })}
      variants={resolved}
      transition={delay ? { delay } : undefined}
      className={cn(className)}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

export interface RevealGroupProps extends HTMLMotionProps<"div"> {
  as?: RevealTag;
  stagger?: number;
  delay?: number;
  immediate?: boolean;
}

/**
 * Parent for staggered children. Children should be `<RevealItem>` (or any
 * `motion` element using the `hidden`/`visible` variant names).
 */
export function RevealGroup({
  as = "div",
  stagger = 0.08,
  delay = 0,
  immediate = false,
  className,
  children,
  ...props
}: RevealGroupProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // `as` only ever resolves to a block-level tag, and the prop surface we
  // accept is the div one; the cast keeps prop checking against that surface
  // instead of the union of every tag's element type.
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: revealViewport })}
      variants={staggerContainer(prefersReducedMotion ? 0 : stagger, delay)}
      className={cn(className)}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

export interface RevealItemProps extends HTMLMotionProps<"div"> {
  as?: RevealTag;
  variants?: Variants;
}

export function RevealItem({
  as = "div",
  variants = fadeUp,
  className,
  children,
  ...props
}: RevealItemProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // `as` only ever resolves to a block-level tag, and the prop surface we
  // accept is the div one; the cast keeps prop checking against that surface
  // instead of the union of every tag's element type.
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      variants={prefersReducedMotion ? reducedVariants : variants}
      className={cn(className)}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
