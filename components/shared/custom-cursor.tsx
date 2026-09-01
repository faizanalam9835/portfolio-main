"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import * as React from "react";

import { useHasFinePointer } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type CursorMode = "default" | "label" | "interactive";

/**
 * Desktop-only custom cursor.
 *
 * Elements opt into the expanded state declaratively:
 *   <a data-cursor-label="View">…</a>
 * Anything focusable/clickable gets the smaller "interactive" state via a
 * single delegated listener, so no component needs to know this exists.
 *
 * Never rendered for touch devices or reduced-motion users — the native
 * cursor is only hidden once this component is actually active.
 */
export function CustomCursor() {
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const [mode, setMode] = React.useState<CursorMode>("default");
  const [label, setLabel] = React.useState<string | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Two different follow speeds: the dot is near-instant, the ring lags.
  const dotX = useSpring(x, { stiffness: 1400, damping: 60, mass: 0.35 });
  const dotY = useSpring(y, { stiffness: 1400, damping: 60, mass: 0.35 });
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  React.useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("cursor-none-desktop");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const labelled = target.closest<HTMLElement>("[data-cursor-label]");
      if (labelled) {
        setLabel(labelled.dataset.cursorLabel ?? null);
        setMode("label");
        return;
      }

      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]',
      );
      setLabel(null);
      setMode(interactive ? "interactive" : "default");
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      document.documentElement.classList.remove("cursor-none-desktop");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize = mode === "label" ? 72 : mode === "interactive" ? 44 : 30;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] hidden lg:block"
    >
      {/* Trailing ring / label pill */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute left-0 top-0"
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full border border-accent-violet/40 bg-white/60 backdrop-blur-[2px] dark:bg-white/10"
          animate={{
            width: ringSize,
            height: ringSize,
            x: -ringSize / 2,
            y: -ringSize / 2,
            scale: pressed ? 0.86 : 1,
            borderWidth: mode === "label" ? 1 : 1.5,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {mode === "label" && label ? (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.16 }}
                className="select-none text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-900 dark:text-white"
              >
                {label}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Leading dot — hidden while a label is showing so the pill reads cleanly. */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="absolute left-0 top-0"
        animate={{ opacity: visible && mode !== "label" ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent-violet)]"
          animate={{ scale: mode === "interactive" ? 0.6 : 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  );
}
