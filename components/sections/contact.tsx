"use client";

import { ArrowUpRight, FileText, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { Github, Linkedin } from "@/components/ui/brand-icons";
import { AmbientBackground } from "@/components/shared/ambient-background";
import { Magnetic } from "@/components/shared/magnetic";
import { Reveal, RevealItem, RevealGroup } from "@/components/shared/reveal";
import { Section, SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/data/site";
import { fadeRight, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CHANNELS = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    icon: Mail,
    external: false,
  },
  {
    label: "Phone",
    value: siteConfig.phone,
    // Strip spaces so the tel: URI stays valid.
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
    icon: Phone,
    external: false,
  },
  {
    label: "LinkedIn",
    value: "Connect professionally",
    href: siteConfig.linkedin,
    icon: Linkedin,
    external: true,
  },
  {
    label: "GitHub",
    value: `@${siteConfig.githubUser}`,
    href: siteConfig.github,
    icon: Github,
    external: true,
  },
  {
    label: "Resume",
    value: "Download PDF",
    href: siteConfig.resumeUrl,
    icon: FileText,
    external: true,
  },
] as const;

export function Contact() {
  return (
    <Section id="contact" className="relative overflow-hidden">
      <AmbientBackground variant="cool" />

      <SectionHeading
        index="06"
        eyebrow="Contact"
        title={
          <>
            Let&rsquo;s <span className="text-gradient">work together.</span>
          </>
        }
        lead="I'm looking for my next role, and I'm always up for a chat about a project, an idea, or something you think I should learn next."
      />

      <div className="mt-10 grid gap-10 sm:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        {/* ── Pitch ────────────────────────────────────────────────── */}
        <RevealGroup className="flex flex-col" stagger={0.1}>
          <RevealItem
            as="span"
            variants={fadeUp}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8125rem] text-[var(--text-tertiary)]"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              {siteConfig.location}
            </span>
            <span aria-hidden>·</span>
            <span>{siteConfig.timezone}</span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-2">
              <span className="relative grid size-2 place-items-center" aria-hidden>
                <span className="absolute size-2 rounded-full bg-emerald-500/60 motion-safe:animate-[pulse-ring_2.4s_cubic-bezier(0.16,1,0.3,1)_infinite]" />
                <span className="size-2 rounded-full bg-emerald-500" />
              </span>
              {siteConfig.availability}
            </span>
          </RevealItem>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {CHANNELS.map((channel, index) => {
              const Icon = channel.icon;
              // An odd channel count would leave a gap on the last row.
              const spansRow =
                CHANNELS.length % 2 === 1 && index === CHANNELS.length - 1;

              return (
                <RevealItem
                  as="li"
                  key={channel.label}
                  variants={fadeUp}
                  className={spansRow ? "sm:col-span-2" : undefined}
                >
                  <Magnetic strength={6} contentStrength={2}>
                    <a
                      href={channel.href}
                      {...(channel.external
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      data-cursor-label="Open"
                      className={cn(
                        "group flex items-center gap-3.5 rounded-2xl border p-3.5",
                        "border-[var(--border-subtle)] bg-[var(--surface)] frost shadow-glass",
                        "transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-violet/35 hover:shadow-lift",
                      )}
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent-blue/10 to-accent-violet/12 text-accent-violet">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.6875rem] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                          {channel.label}
                        </span>
                        <span className="mt-0.5 block truncate text-[0.8125rem] font-medium text-[var(--text-primary)]">
                          {channel.value}
                        </span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-[var(--text-tertiary)] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </a>
                  </Magnetic>
                </RevealItem>
              );
            })}
          </ul>
        </RevealGroup>

        {/* ── Form ─────────────────────────────────────────────────── */}
        <Reveal variants={fadeRight}>
          <div className="relative">
            <div className="card-surface edge-highlight p-5 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
