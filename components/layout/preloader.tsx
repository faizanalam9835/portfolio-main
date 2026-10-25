"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import { siteConfig } from "@/data/site";
import { INTRO_SECONDS, markIntroPlayed } from "@/lib/intro";
import { EASE_OUT_EXPO } from "@/lib/motion";

/** Counts 0 → 100, then the black curtain lifts off the page. */
export function Preloader() {
  const [count, setCount] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    const countMs = (INTRO_SECONDS - 0.5) * 1000;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / countMs);
      // Ease-out so the last few percent settle rather than snap.
      setCount(Math.round((1 - (1 - t) ** 3) * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else {
        markIntroPlayed();
        setVisible(false);
        document.body.style.overflow = "";
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black px-6 py-8 text-white sm:px-12"
          aria-live="polite"
          aria-label="Loading"
        >
          <div className="flex justify-between font-mono text-xs uppercase tracking-[0.3em] text-white/50">
            <span>Portfolio</span>
            <span>{new Date().getFullYear()}</span>
          </div>

          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
              className="font-display text-5xl font-bold uppercase tracking-tight sm:text-7xl md:text-8xl"
            >
              {siteConfig.name}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-3 text-sm text-white/60 sm:text-base"
            >
              {siteConfig.role}
            </motion.p>
          </div>

          <div>
            <div className="flex items-end justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
                Loading
              </span>
              <span className="font-display text-6xl font-bold tabular-nums sm:text-8xl">
                {count}%
              </span>
            </div>
            <div className="mt-4 h-px w-full bg-white/15">
              <div className="h-full bg-white" style={{ width: `${count}%` }} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
