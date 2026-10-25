"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type * as React from "react";

import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Numbered section header: an eyebrow whose rule draws in, then a title
 * whose words rise out of a mask one after another.
 */
export function SectionTitle({
  index,
  eyebrow,
  title,
  description,
  className,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  const words = title.split(" ");

  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0px" }}
      className={cn("mb-14 max-w-3xl md:mb-20", className)}
    >
      <div
        className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50"
      >
        <span>{index}</span>
        <motion.span
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
          }}
          className="h-px w-16 origin-left bg-white/40"
        />
        <span>{eyebrow}</span>
      </div>

      <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%" },
                visible: {
                  y: "0%",
                  transition: { duration: 0.8, delay: 0.1 + i * 0.06, ease: EASE_OUT_EXPO },
                },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : null}
            </motion.span>
          </span>
        ))}
      </h2>

      {description ? (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.35 } },
          }}
          className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
        >
          {description}
        </motion.p>
      ) : null}
    </motion.header>
  );
}

/** Full-screen, full-width section shell shared by every section. */
export const sectionClass =
  "relative flex min-h-[100svh] w-full flex-col justify-center px-5 py-28 sm:px-10 lg:px-16";

/** The "see everything" link at the end of each home-page preview. */
export function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      className="mt-12"
    >
      <Link
        href={href}
        className="group inline-flex h-12 items-center gap-3 rounded-md bg-white px-6 text-sm font-medium text-black transition-transform duration-300 hover:-translate-y-0.5"
      >
        {children}
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
