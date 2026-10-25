"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "@/components/ui/brand-icons";
import { siteConfig } from "@/data/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { introDelay } from "@/lib/intro";
import { EASE_OUT_EXPO } from "@/lib/motion";

const [firstName, ...rest] = siteConfig.name.split(" ");
const lastName = rest.join(" ");

/** Flickers on like a sign: off, on, off, on. */
const blink = {
  initial: { opacity: 0 },
  animate: { opacity: [0, 1, 0, 0.6, 0, 1] },
};

/**
 * Text only — the portrait itself is the fixed <PageBackdrop>. Copy sits
 * either side of the face and each piece arrives its own way: from the
 * top, from the sides, from below, or blinking on. All of it waits for the
 * preloader on first load.
 */
export function Hero({ stats }: { stats: { value: string; label: string }[] }) {
  const ref = React.useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  // Read once per mount so a client-side return to "/" doesn't wait again.
  const [d] = React.useState(introDelay);

  // Arriving on the home page always starts at the hero, never mid-page.
  React.useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="home" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full w-full flex-col justify-end gap-5 px-5 pb-8 pt-28 sm:pb-12 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:pb-0"
      >
        {/* Left */}
        <div className="lg:max-w-xl">
          <motion.p
            {...blink}
            transition={{ duration: 0.9, delay: d + 0.2, times: [0, 0.2, 0.35, 0.5, 0.65, 1] }}
            className="hidden items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium backdrop-blur-md lg:inline-flex"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-md bg-white opacity-70" />
              <span className="relative inline-flex size-2 rounded-md bg-white" />
            </span>
            {siteConfig.availability}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: d + 0.3, ease: EASE_OUT_EXPO }}
            className="font-mono text-xs uppercase lg:mt-6 tracking-[0.3em] text-white/50"
          >
            Hi, I&rsquo;m
          </motion.p>

          <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight sm:text-7xl xl:text-8xl">
            {/* First name: each letter drops in from above. */}
            <span className="inline-block overflow-hidden align-bottom" aria-label={firstName}>
              {(firstName ?? "").split("").map((char, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  initial={{ y: "-110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: d + 0.4 + i * 0.05, ease: EASE_OUT_EXPO }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <br />
            {/* Last name: slides in from the left, outlined. */}
            <motion.span
              initial={{ x: "-120%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              transition={{ duration: 1.1, delay: d + 0.7, ease: EASE_OUT_EXPO }}
              className="text-outline inline-block"
            >
              {lastName}
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: d + 1, ease: EASE_OUT_EXPO }}
          >
            <RotatingTitle />
          </motion.div>

          <motion.p
            {...blink}
            transition={{ duration: 0.8, delay: d + 1.3 }}
            className="mt-4 hidden items-center gap-1.5 text-sm text-white/50 lg:flex"
          >
            <MapPin className="size-4" /> {siteConfig.location}
          </motion.p>
        </div>

        {/* Right */}
        <div className="lg:max-w-sm lg:text-right">
          <motion.p
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: d + 0.6, ease: EASE_OUT_EXPO }}
            className="hidden text-base leading-relaxed text-white/75 lg:block"
          >
            {siteConfig.tagline}
          </motion.p>

          <dl className="mt-6 hidden grid-cols-2 gap-3 lg:grid">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...blink}
                transition={{ duration: 0.8, delay: d + 1 + i * 0.2 }}
                className="rounded-md border border-white/10 bg-white/5 p-3 text-left backdrop-blur-md"
              >
                <dt className="text-[0.7rem] uppercase tracking-wider text-white/50">{stat.label}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold">{stat.value}</dd>
              </motion.div>
            ))}
          </dl>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: d + 1.2, ease: EASE_OUT_EXPO }}
            className="flex gap-3 lg:mt-6 lg:justify-end"
          >
            <Button asChild variant="light" size="lg" className="group flex-1 lg:flex-none">
              <Link href="/projects">
                View my work
                <ArrowDownRight className="transition-transform duration-300 group-hover:rotate-[-45deg]" />
              </Link>
            </Button>
            <Button asChild variant="outline-light" size="lg" className="flex-1 lg:flex-none">
              <Link href="/resume">
                Resume <ArrowUpRight />
              </Link>
            </Button>
          </motion.div>

          <div className="mt-3 flex gap-2 lg:mt-5 lg:justify-end">
            {[
              { href: siteConfig.github, label: "GitHub", Icon: Github },
              { href: siteConfig.linkedin, label: "LinkedIn", Icon: Linkedin },
            ].map(({ href, label, Icon }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: d + 1.4 + i * 0.1 }}
                className="grid size-10 place-items-center rounded-md border border-white/15 transition-colors duration-300 hover:bg-white hover:text-black"
              >
                <Icon className="size-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>

    </section>
  );
}

/** Cycles through the role titles, each sliding up out of a mask. */
function RotatingTitle() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % siteConfig.titles.length),
      2600,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mt-3 flex h-8 items-center gap-3 overflow-hidden lg:mt-5">
      <span className="h-px w-8 bg-white/50" />
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="text-base font-medium text-white/85 lg:text-lg"
        >
          {siteConfig.titles[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
