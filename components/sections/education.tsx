"use client";

import { motion } from "framer-motion";
import {
  Award,
  ExternalLink,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Section, SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { certifications, education } from "@/data/education";
import { EASE_OUT_EXPO, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { CertificationItem, EducationItem } from "@/types";

const ACCENT_RING = {
  blue: "group-hover:border-accent-blue/40",
  violet: "group-hover:border-accent-violet/40",
  cyan: "group-hover:border-accent-cyan/40",
} as const;

const ACCENT_ICON = {
  blue: "bg-accent-blue/10 text-accent-blue",
  violet: "bg-accent-violet/10 text-accent-violet",
  cyan: "bg-accent-cyan/10 text-accent-cyan",
} as const;

const ACCENT_BADGE = {
  blue: "blue",
  violet: "violet",
  cyan: "cyan",
} as const;

export function Education() {
  return (
    <Section id="education">
      <SectionHeading
        index="05"
        eyebrow="Background"
        title="Education & Certifications"
        lead="Where I studied, and the courses I've finished alongside the actual building."
      />

      <div className="mt-10 grid gap-10 sm:mt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        {/* ── Education timeline ──────────────────────────────────────── */}
        <div>
          <h3 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            <GraduationCap className="size-4 text-accent-blue" aria-hidden />
            Education
          </h3>

          <RevealGroup className="mt-6 flex flex-col gap-5" stagger={0.12}>
            {education.map((item) => (
              <RevealItem key={item.id} variants={fadeUp}>
                <EducationCard item={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* ── Certifications ──────────────────────────────────────────── */}
        <div>
          <h3 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            <Award className="size-4 text-accent-violet" aria-hidden />
            Certifications
          </h3>

          <RevealGroup className="mt-6 flex flex-col gap-4" stagger={0.1}>
            {certifications.map((item) => (
              <RevealItem key={item.id} variants={fadeUp}>
                <CertificationCard item={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}

function EducationCard({ item }: { item: EducationItem }) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
      className={cn(
        "group card-surface relative overflow-hidden p-5 sm:p-6",
        "transition-colors duration-300 hover:border-accent-blue/30",
      )}
    >
      {/* Accent rail on the left edge. */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-accent-blue via-accent-violet to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
            {item.degree}
          </p>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            {item.field}
          </p>
        </div>

        {item.score ? (
          <Badge variant="blue" size="sm" className="shrink-0 font-mono">
            {item.score}
          </Badge>
        ) : null}
      </div>

      <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
        {item.institution}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.75rem] text-[var(--text-tertiary)]">
        <span className="font-mono">{item.duration}</span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3" aria-hidden />
          {item.location}
        </span>
        {item.current ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
            Ongoing
          </span>
        ) : null}
      </div>

      {item.highlights.length ? (
        <ul className="mt-4 flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-4">
          {item.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-[var(--text-secondary)]"
            >
              <span
                aria-hidden
                className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-accent-violet/60"
              />
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}
    </motion.article>
  );
}

function CertificationCard({ item }: { item: CertificationItem }) {
  const isLink = Boolean(item.url);
  const Wrapper = isLink ? "a" : "div";

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}>
      <Wrapper
        {...(isLink
          ? {
              href: item.url,
              target: "_blank",
              rel: "noreferrer noopener",
              "data-cursor-label": "Open",
            }
          : {})}
        className={cn(
          "group card-surface flex gap-3.5 p-4 transition-colors duration-300 sm:gap-4 sm:p-5",
          ACCENT_RING[item.accent],
          isLink && "cursor-pointer",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
            ACCENT_ICON[item.accent],
          )}
        >
          <ShieldCheck className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[0.9375rem] font-semibold leading-snug tracking-tight text-[var(--text-primary)]">
              {item.title}
            </p>
            {isLink ? (
              <ExternalLink
                className="mt-0.5 size-3.5 shrink-0 text-[var(--text-tertiary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
            ) : null}
          </div>

          <p className="mt-1 text-[0.8125rem] text-[var(--text-secondary)]">
            {item.issuer} · <span className="font-mono">{item.issued}</span>
          </p>

          {item.credentialId ? (
            <p className="mt-1 truncate font-mono text-[0.6875rem] text-[var(--text-tertiary)]">
              ID: {item.credentialId}
            </p>
          ) : null}

          {item.skills.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.skills.map((skill) => (
                <Badge key={skill} variant={ACCENT_BADGE[item.accent]} size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Wrapper>
    </motion.div>
  );
}
