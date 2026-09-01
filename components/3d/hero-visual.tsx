"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as React from "react";

import { siteConfig } from "@/data/site";
import { useHasFinePointer, useIsDesktop } from "@/hooks/use-media-query";
import { usePointerRef } from "@/hooks/use-pointer";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

import { SceneFrame } from "./scene-frame";

/**
 * three.js and the scene graph are code-split out of the initial bundle and
 * only fetched when the hero is close to the viewport.
 */
const HeroScene = dynamic(
  () => import("./hero-scene").then((module) => module.HeroScene),
  { ssr: false },
);

/** Shipped placeholder, used until a real photo is dropped in. */
const PLACEHOLDER_AVATAR = "/profile-placeholder.svg";

/** Tech chips that sit on the edges of the portrait. */
const CHIPS = [
  { label: "React", position: "-left-6 top-[18%]", depth: 26, accent: "blue" },
  { label: "Next.js", position: "-right-5 top-[8%]", depth: 34, accent: "violet" },
  { label: "AI / RAG", position: "-right-8 bottom-[30%]", depth: 22, accent: "cyan" },
] as const;

const ACCENT_DOT = {
  blue: "bg-accent-blue",
  violet: "bg-accent-violet",
  cyan: "bg-accent-cyan",
} as const;

/**
 * Static stand-in for the 3D, shown until the canvas mounts. The scene is
 * behind the portrait here, so it stays faint on purpose.
 */
function StaticOrbits() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 size-full"
      aria-hidden
      role="presentation"
    >
      <defs>
        <linearGradient id="hero-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b6cf6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#22b8d9" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="url(#hero-edge)" strokeWidth="1">
        <ellipse cx="200" cy="200" rx="178" ry="72" transform="rotate(-24 200 200)" />
        <ellipse cx="200" cy="200" rx="178" ry="72" transform="rotate(34 200 200)" />
        <circle cx="200" cy="200" r="150" strokeOpacity="0.5" />
      </g>

      {[
        [200, 46, "#7c5cf6"],
        [356, 236, "#3b6cf6"],
        [46, 240, "#22b8d9"],
        [322, 92, "#22b8d9"],
        [84, 116, "#3b6cf6"],
      ].map(([cx, cy, color], index) => (
        <circle
          key={index}
          cx={Number(cx)}
          cy={Number(cy)}
          r={4}
          fill={String(color)}
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

/**
 * The photo itself.
 *
 * Falls back through: configured photo → bundled placeholder → initials, so
 * the hero always looks finished even before `public/profile.jpg` exists.
 */
function Portrait() {
  const [src, setSrc] = React.useState(siteConfig.avatar);
  const [exhausted, setExhausted] = React.useState(false);

  const initials = React.useMemo(
    () =>
      siteConfig.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join(""),
    [],
  );

  const onError = React.useCallback(() => {
    setSrc((current) => {
      if (current !== PLACEHOLDER_AVATAR) return PLACEHOLDER_AVATAR;
      setExhausted(true);
      return current;
    });
  }, []);

  if (exhausted) {
    return (
      <span className="grid size-full place-items-center bg-gradient-to-br from-accent-blue/12 via-accent-violet/12 to-accent-cyan/12 text-[4rem] font-semibold tracking-tight text-[var(--text-primary)]">
        {initials}
      </span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={`${siteConfig.name} — portrait`}
      width={720}
      height={900}
      loading="eager"
      decoding="async"
      onError={onError}
      /* The source is square and the subject sits right of centre, so the
         4:5 card crops from the left background rather than through him. */
      className="size-full object-cover object-[80%_center]"
    />
  );
}

/** Glass chip with pointer parallax proportional to its assigned depth. */
function FloatingChip({
  label,
  position,
  depth,
  accent,
  enabled,
  index,
  pointerX,
  pointerY,
}: (typeof CHIPS)[number] & {
  enabled: boolean;
  index: number;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  pointerY: ReturnType<typeof useMotionValue<number>>;
}) {
  const springConfig = { stiffness: 90, damping: 18, mass: 0.7 };
  const springX = useSpring(
    useTransform(pointerX, (value) => -value * depth),
    springConfig,
  );
  const springY = useSpring(
    useTransform(pointerY, (value) => -value * depth * 0.6),
    springConfig,
  );

  return (
    <motion.div
      style={enabled ? { x: springX, y: springY } : undefined}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.8 + index * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn("absolute z-20", position)}
    >
      <div
        className={cn(
          "glass flex items-center gap-2 rounded-full px-3 py-1.5",
          "text-[0.6875rem] font-medium tracking-tight text-[var(--text-primary)]",
          "shadow-soft sm:text-xs",
        )}
      >
        <span
          className={cn("size-1.5 rounded-full", ACCENT_DOT[accent])}
          aria-hidden
        />
        {label}
      </div>
    </motion.div>
  );
}

export function HeroVisual({ className }: { className?: string }) {
  const pointer = usePointerRef();
  const isDesktop = useIsDesktop();
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();

  const parallaxEnabled = hasFinePointer && !prefersReducedMotion;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  React.useEffect(() => {
    if (!parallaxEnabled) return;

    const onMove = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [parallaxEnabled, pointerX, pointerY]);

  return (
    <div className={cn("relative", className)}>
      {/* Ambient wash behind the whole block. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[14%] -z-10 rounded-full opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(124,92,246,0.18), rgba(59,108,246,0.10) 45%, transparent 72%)",
        }}
      />

      {/* ── 3D, kept in the background ────────────────────────────────
          Larger than the portrait, softly masked, so it reads as depth
          behind the photo instead of competing with it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-[24%] -top-[16%] -z-10 opacity-70 [mask-image:radial-gradient(closest-side,black,transparent_80%)]"
      >
        <SceneFrame
          className="relative aspect-square w-full"
          camera={{ position: [0, 0, 9.4], fov: 42 }}
          fallback={<StaticOrbits />}
          rootMargin="200px"
        >
          <HeroScene pointer={pointer} quality={isDesktop ? "high" : "low"} />
        </SceneFrame>
      </div>

      <div className="relative">
        {/* Offset outline plate behind the photo — gives the card depth
            without a heavy drop shadow. */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, x: 16, y: -16 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -bottom-4 -left-4 size-full rounded-[var(--radius-card)] border border-accent-violet/25 sm:-bottom-5 sm:-left-5"
        />

        <motion.figure
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "relative z-10 aspect-[4/5] w-full overflow-hidden",
            "rounded-[var(--radius-card)] border border-[var(--border-subtle)]",
            "bg-[var(--surface-sunken)] shadow-lift",
          )}
        >
          <Portrait />
        </motion.figure>

        {/* The chips sit outside the card edges, which needs margin either
            side — there isn't any on a phone, so they start at sm:. */}
        <div className="pointer-events-none absolute inset-0 hidden sm:block">
          {CHIPS.map((chip, index) => (
            <FloatingChip
              key={chip.label}
              {...chip}
              index={index}
              enabled={parallaxEnabled}
              pointerX={pointerX}
              pointerY={pointerY}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
