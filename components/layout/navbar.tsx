"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import * as React from "react";

import { Magnetic } from "@/components/shared/magnetic";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { navItems, siteConfig } from "@/data/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrolled, useScrollLock } from "@/hooks/use-scroll-state";
import { cn } from "@/lib/utils";
import type { SectionId } from "@/types";

const SECTION_IDS = navItems.map((item) => item.id);

export function Navbar() {
  const scrolled = useScrolled(20);
  const active = useActiveSection(SECTION_IDS, "home");
  const [menuOpen, setMenuOpen] = React.useState(false);

  useScrollLock(menuOpen);

  // Close the mobile menu if the viewport grows into the desktop layout.
  React.useEffect(() => {
    if (!menuOpen) return;
    const query = window.matchMedia("(min-width: 64rem)");
    const onChange = () => {
      if (query.matches) setMenuOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [menuOpen]);

  return (
    <>
      <ScrollProgress />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-[var(--border-subtle)] bg-[rgb(var(--surface-glass)/0.72)] shadow-[0_1px_0_0_rgb(17_24_39/0.03)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-[84rem] items-center justify-between gap-6 px-5 sm:h-18 sm:px-8 lg:px-12 xl:px-16"
        >
          <Wordmark onNavigate={() => setMenuOpen(false)} />

          <ul className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink item={item} active={active === item.id} />
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Magnetic strength={8} contentStrength={3} className="hidden sm:block">
              <Button asChild variant="primary" size="sm" className="group">
                <a href="#contact" data-cursor-label="Talk">
                  Contact
                  <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Button>
            </Magnetic>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={cn(
                "grid size-10 place-items-center rounded-full lg:hidden",
                "border border-[var(--border-subtle)] bg-[var(--surface)]",
                "text-[var(--text-primary)] transition-colors duration-300",
              )}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={menuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  className="grid place-items-center"
                >
                  {menuOpen ? (
                    <X className="size-5" aria-hidden />
                  ) : (
                    <Menu className="size-5" aria-hidden />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        active={active}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}

function Wordmark({ onNavigate }: { onNavigate: () => void }) {
  const initials = siteConfig.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <a
      href="#home"
      onClick={onNavigate}
      className="group flex items-center gap-2.5"
      data-cursor-label="Top"
    >
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet text-[0.8125rem] font-semibold text-white shadow-[0_6px_18px_-8px_rgba(124,92,246,0.8)]">
        {initials}
        <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover:translate-x-full" />
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="text-[0.9375rem] font-semibold tracking-tight text-[var(--text-primary)]">
          {siteConfig.name}
        </span>
        <span className="mt-1 whitespace-nowrap text-[0.6875rem] text-[var(--text-tertiary)]">
          {siteConfig.role}
        </span>
      </span>
    </a>
  );
}

function NavLink({
  item,
  active,
}: {
  item: (typeof navItems)[number];
  active: boolean;
}) {
  return (
    <a
      href={item.href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "relative block rounded-full px-3.5 py-2 text-[0.8125rem] font-medium",
        "transition-colors duration-300",
        active
          ? "text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
      )}
    >
      {active ? (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 -z-10 rounded-full bg-[var(--surface-sunken)]"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      ) : null}
      {item.label}
      {active ? (
        <motion.span
          layoutId="nav-active-dot"
          className="absolute -bottom-px left-1/2 h-px w-6 -translate-x-1/2 bg-gradient-to-r from-accent-blue to-accent-violet"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      ) : null}
    </a>
  );
}

/** Thin gradient reading-progress bar pinned above the nav. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent-blue via-accent-violet to-accent-cyan"
    />
  );
}

function MobileMenu({
  open,
  active,
  onClose,
}: {
  open: boolean;
  active: SectionId;
  onClose: () => void;
}) {
  // Escape closes the sheet; focus returns naturally to the toggle button.
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 lg:hidden"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute inset-x-3 top-20 overflow-hidden rounded-2xl",
              "border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-lift",
            )}
          >
            <ul className="flex flex-col">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.06 + index * 0.04,
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <a
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3.5",
                      "text-[0.9375rem] font-medium transition-colors duration-200",
                      active === item.id
                        ? "bg-[var(--surface-sunken)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] active:bg-[var(--surface-sunken)]",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 font-mono text-[0.6875rem] text-[var(--text-tertiary)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </span>
                    {active === item.id ? (
                      <span className="size-1.5 rounded-full bg-[var(--color-accent-violet)]" />
                    ) : null}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="mt-2 border-t border-[var(--border-subtle)] p-3">
              <Button asChild variant="accent" size="md" className="w-full">
                <a href="#contact" onClick={onClose}>
                  Contact
                  <ArrowUpRight />
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
