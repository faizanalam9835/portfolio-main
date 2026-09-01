"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download, Sparkles } from "lucide-react";
import * as React from "react";

import { HeroVisual } from "@/components/3d/hero-visual";
import { Magnetic } from "@/components/shared/magnetic";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { EASE_OUT_EXPO, staggerContainer, wordReveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

const HEADLINE = `Hi, I'm ${siteConfig.firstName}. I build things for the web.`;

/** Words that receive the gradient treatment in the headline. */
const ACCENT_WORDS = new Set(["build", "things", "for", "the", "web."]);

export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const words = React.useMemo(() => HEADLINE.split(" "), []);

  return (
    <section
      id="home"
      className="relative overflow-hidden px-5 pb-16 pt-24 sm:px-8 sm:pb-24 sm:pt-32 lg:min-h-[100svh] lg:px-12 lg:pb-28 lg:pt-36 xl:px-16"
    >
      {/* Blueprint ground, faded out toward the bottom of the fold. */}
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 -z-20 opacity-70 [mask-image:radial-gradient(80%_60%_at_50%_25%,black,transparent)]"
      />

      <div className="mx-auto w-full max-w-[84rem]">
        <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16 xl:gap-20">
          {/* ── Copy column ───────────────────────────────────────────── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(prefersReducedMotion ? 0 : 0.08, 0.05)}
            className="flex flex-col items-start"
          >
            <StatusBadge />

            <h1 className="mt-6 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--text-primary)] sm:mt-7 sm:text-[3.15rem] lg:text-[3.6rem] xl:text-[4rem]">
              <span className="sr-only">{HEADLINE}</span>
              <span aria-hidden className="inline-flex flex-wrap">
                {words.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="mr-[0.26em] inline-block overflow-hidden pb-[0.06em]"
                  >
                    <motion.span
                      variants={prefersReducedMotion ? undefined : wordReveal}
                      className={cn(
                        "inline-block",
                        ACCENT_WORDS.has(word) && "text-gradient",
                      )}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
            </h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.35 },
                },
              }}
              className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--text-secondary)] sm:mt-6 sm:text-[1.0625rem]"
            >
              {siteConfig.tagline}
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.48 },
                },
              }}
              className="mt-8 flex w-full flex-wrap items-center gap-2.5 sm:mt-9 sm:gap-3"
            >
              <Magnetic strength={10} contentStrength={4}>
                <Button
                  asChild
                  variant="accent"
                  size="lg"
                  className="group h-11 px-5 text-sm sm:h-13 sm:px-7 sm:text-[0.95rem]"
                >
                  <a href="#projects" data-cursor-label="View">
                    See my work
                    <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Button>
              </Magnetic>

              <Magnetic strength={10} contentStrength={4}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-5 text-sm sm:h-13 sm:px-7 sm:text-[0.95rem]"
                >
                  <a href="#contact" data-cursor-label="Talk">
                    Get in touch
                  </a>
                </Button>
              </Magnetic>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="group h-11 px-4 text-sm sm:h-13 sm:px-7 sm:text-[0.95rem]"
              >
                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor-label="Open"
                >
                  <Download className="transition-transform duration-300 group-hover:translate-y-0.5" />
                  Resume
                </a>
              </Button>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.9, delay: 0.7 } },
              }}
              className="mt-10 w-full sm:mt-12"
            >
              <RoleTicker titles={siteConfig.titles} paused={prefersReducedMotion} />
            </motion.div>
          </motion.div>

          {/* ── Portrait column ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.15 }}
            className="relative order-first w-full lg:order-last"
          >
            <HeroVisual className="mx-auto w-[68%] max-w-[16rem] sm:w-[52%] sm:max-w-[21rem] lg:w-full lg:max-w-[24rem] xl:max-w-[26rem]" />
          </motion.div>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}

function StatusBadge() {
  return (
    <motion.a
      href="#contact"
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE_OUT_EXPO },
        },
      }}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4",
        "glass text-[0.8125rem] font-medium text-[var(--text-secondary)]",
        "shadow-soft transition-colors duration-300 hover:text-[var(--text-primary)]",
      )}
    >
      <span className="relative grid size-5 place-items-center" aria-hidden>
        <span className="absolute size-2 rounded-full bg-emerald-500/60 motion-safe:animate-[pulse-ring_2.4s_cubic-bezier(0.16,1,0.3,1)_infinite]" />
        <span className="size-2 rounded-full bg-emerald-500" />
      </span>
      {siteConfig.availability}
      <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-70" />
    </motion.a>
  );
}

/**
 * Slow vertical ticker of role titles.
 *
 * Alignment notes, since this line sat crooked before:
 *  - The row is `items-center`, not `items-baseline`. An `overflow-hidden`
 *    box reports its bottom edge as its baseline, so baseline alignment
 *    pushed the rotating title below "Currently".
 *  - The viewport is exactly `h-6` and every title is `leading-6`, so one
 *    step of the animation is exactly one line height.
 *  - Each title is `absolute inset-0`, so it fills the viewport and the
 *    `y: 100%` steps land precisely instead of drifting.
 *  - An invisible copy of the longest title sets the width, so the box
 *    never resizes as the titles cycle.
 */
function RoleTicker({
  titles,
  paused,
}: {
  titles: readonly string[];
  paused: boolean;
}) {
  const [index, setIndex] = React.useState(0);

  const longest = React.useMemo(
    () =>
      titles.reduce(
        (widest, title) => (title.length > widest.length ? title : widest),
        titles[0] ?? "",
      ),
    [titles],
  );

  React.useEffect(() => {
    if (paused || titles.length < 2) return;
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % titles.length),
      2800,
    );
    return () => clearInterval(timer);
  }, [paused, titles.length]);

  return (
    <div className="flex items-center gap-3 border-t border-[var(--border-subtle)] pt-6">
      <Sparkles
        className="size-4 shrink-0 text-accent-violet"
        aria-hidden
      />

      <p className="flex min-w-0 items-center gap-2 text-sm leading-6 text-[var(--text-tertiary)]">
        <span className="shrink-0">Currently</span>

        {/* Static text for assistive tech; the animated stack is decorative. */}
        <span className="sr-only">{titles[index]}</span>

        <span
          aria-hidden
          className="relative block h-6 overflow-hidden"
        >
          {/* Sizer: reserves the width of the longest title so nothing shifts. */}
          <span className="invisible block whitespace-nowrap text-sm font-medium leading-6">
            {longest}
          </span>

          {titles.map((title, titleIndex) => (
            <motion.span
              key={title}
              initial={false}
              animate={{
                y: paused ? 0 : `${(titleIndex - index) * 100}%`,
                opacity: titleIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="absolute inset-0 whitespace-nowrap text-sm font-medium leading-6 text-[var(--text-primary)]"
            >
              {title}
            </motion.span>
          ))}
        </span>
      </p>
    </div>
  );
}

function ScrollCue() {
  return (
    <motion.a
      href="#about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
      aria-label="Scroll to about section"
      className={cn(
        "absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2",
        "text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--text-tertiary)]",
        "transition-colors duration-300 hover:text-[var(--text-secondary)] lg:flex",
      )}
    >
      Scroll
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="size-3.5" aria-hidden />
      </motion.span>
    </motion.a>
  );
}
