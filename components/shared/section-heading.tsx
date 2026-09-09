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
        className={cn(
          "inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4",
          index ? "pl-1.5" : "pl-4",
          "glass text-[0.6875rem] font-medium uppercase tracking-[0.2em]",
          "text-[var(--text-secondary)]",
        )}
      >
        {index ? (
          <span
            className={cn(
              "grid size-6 place-items-center rounded-full font-mono",
              "bg-gradient-to-br from-accent-blue to-accent-violet",
              "text-[0.625rem] tracking-normal text-white",
              "shadow-[0_4px_12px_-4px_rgba(124,92,246,0.9)]",
            )}
          >
            {index}
          </span>
        ) : null}
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

      {/* Accent rule under the title — gives each section a start line. */}
      <RevealItem
        aria-hidden
        variants={fadeUp}
        className={cn(
          "h-px w-20 bg-gradient-to-r from-accent-blue via-accent-violet to-transparent",
          centered && "bg-gradient-to-r from-transparent via-accent-violet to-transparent",
        )}
      />

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
        // A tinted band gets a hairline at each edge so it reads as a
        // deliberate block instead of a patch of colour.
        className?.includes("surface-band") &&
          "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[var(--border-strong)] before:to-transparent after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[var(--border-strong)] after:to-transparent",
        className,
      )}
      {...props}
    >
      {bleed ? children : <div className="mx-auto w-full max-w-[88rem]">{children}</div>}
    </section>
  );
}

/** Thin gradient rule used between major sections. */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <Reveal
      className={cn("mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12 xl:px-16", className)}
      aria-hidden
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />
    </Reveal>
  );
}
