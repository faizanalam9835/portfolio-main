import { ArrowUpRight, FileText, Mail } from "lucide-react";
import type * as React from "react";

import { Github, Linkedin } from "@/components/ui/brand-icons";

import { navItems, siteConfig, socialLinks } from "@/data/site";
import { cn } from "@/lib/utils";

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  file: FileText,
  twitter: ArrowUpRight,
} as const;

/** Server component — the footer is static apart from one CSS-only pulse. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="frost relative border-t border-[var(--border-subtle)] bg-[var(--surface-band)]">
      <div className="mx-auto w-full max-w-[88rem] px-5 py-12 sm:px-8 sm:py-14 lg:px-12 xl:px-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
              {siteConfig.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              Full stack &amp; AI engineer — React, Next.js, Node.js and
              MongoDB, with LLM and RAG features on top.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <span className="relative grid size-2 place-items-center" aria-hidden>
                <span className="absolute size-2 rounded-full bg-emerald-500/70 motion-safe:animate-[pulse-ring_2.4s_cubic-bezier(0.16,1,0.3,1)_infinite]" />
                <span className="size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[0.8125rem] text-[var(--text-secondary)]">
                Open to new opportunities.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-x-10">
            <FooterColumn title="Navigate">
              <ul className="flex flex-col gap-2.5">
                {navItems.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <FooterLink href={item.href}>{item.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title="Explore">
              <ul className="flex flex-col gap-2.5">
                {navItems.slice(4).map((item) => (
                  <li key={item.id}>
                    <FooterLink href={item.href}>{item.label}</FooterLink>
                  </li>
                ))}
                <li>
                  <FooterLink href={siteConfig.resumeUrl}>Resume</FooterLink>
                </li>
              </ul>
            </FooterColumn>

            <FooterColumn title="Connect">
              <ul className="flex flex-col gap-2.5">
                {socialLinks.map((link) => {
                  const Icon = ICONS[link.icon];
                  return (
                    <li key={link.label}>
                      <FooterLink
                        href={link.href}
                        external={link.href.startsWith("http")}
                      >
                        <Icon className="size-3.5" aria-hidden />
                        {link.label}
                      </FooterLink>
                    </li>
                  );
                })}
              </ul>
            </FooterColumn>
          </div>
        </div>

        <div
          className={cn(
            "mt-12 flex flex-col items-start gap-3 border-t border-[var(--border-subtle)] pt-6",
            "text-[0.8125rem] text-[var(--text-tertiary)] sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Designed &amp; Built with
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-[var(--text-secondary)] underline-offset-4 transition-colors hover:text-accent-violet hover:underline"
            >
              Next.js
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className="group inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
    >
      {children}
      <ArrowUpRight className="size-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-60" />
    </a>
  );
}
