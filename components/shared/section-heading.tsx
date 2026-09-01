"use client";

import * as React from "react";

import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  /** Small monospace index shown before the eyebrow, e.g. "04". */
  index?: string;
  /**
   * Optional control (a link or button) pinned to the right of the heading
   * on wide screens. Kept inside the heading so every section's action sits
   * on the same baseline and the same right edge.
   */
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  index,
  action,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  const heading = (
    <RevealGroup
      as="div"
      stagger={0.09}
      className={cn(
        "flex flex-col gap-4",
        centered ? "items-center text-center" : "items-start",
        !action && className,
      )}
    >
      <RevealItem
        variants={fadeUp}
        className="flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[var(--text-tertiary)]"
      >
        {index ? (
          <span className="font-mono text-accent-violet">{index}</span>
        ) : null}
        <span className="h-px w-8 bg-gradient-to-r from-accent-blue to-accent-violet" />
        {eyebrow}
      </RevealItem>

      <RevealItem
        as="div"
        variants={fadeUp}
        className={cn(
          "text-balance text-[1.75rem] font-semibold leading-[1.12] text-[var(--text-primary)]",
          "sm:text-4xl lg:text-[2.9rem]",
          centered && "max-w-3xl",
        )}
      >
        <h2>{title}</h2>
      </RevealItem>

      {lead ? (
        <RevealItem
          as="div"
          variants={fadeUp}
          className="max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--text-secondary)] sm:text-base lg:text-[1.0625rem]"
        >
          {lead}
        </RevealItem>
      ) : null}
    </RevealGroup>
  );

  if (!action) return <header>{heading}</header>;

  return (
    <header
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      {heading}
      <Reveal variants={fadeUp} className="shrink-0">
        {action}
      </Reveal>
    </header>
  );
}

/**
 * Shared section shell: consistent vertical rhythm, max width and gutters
 * so every section lines up on the same grid.
 */
export function Section({
  id,
  className,
  children,
  bleed = false,
  ...props
}: React.ComponentPropsWithoutRef<"section"> & { bleed?: boolean }) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-16 sm:py-24 lg:py-32",
        !bleed && "px-5 sm:px-8 lg:px-12 xl:px-16",
        className,
      )}
      {...props}
    >
      {bleed ? children : <div className="mx-auto w-full max-w-[84rem]">{children}</div>}
    </section>
  );
}

/** Thin gradient rule used between major sections. */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <Reveal
      className={cn("mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-12 xl:px-16", className)}
      aria-hidden
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />
    </Reveal>
  );
}
