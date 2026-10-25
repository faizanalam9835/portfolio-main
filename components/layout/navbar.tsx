"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { navItems, siteConfig } from "@/data/site";
import { introDelay } from "@/lib/intro";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

// Split around the centred logo, like the hero sketch: links on both sides.
const half = Math.ceil(navItems.length / 2);
const leftItems = navItems.slice(0, half);
const rightItems = navItems.slice(half);

export function Navbar() {
  const pathname = usePathname();
  const active = navItems.find((item) => item.href === pathname)?.id;
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and allow Escape while the mobile menu is open.
  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: introDelay(), ease: EASE_OUT_EXPO }}
        // Attached to the top edge, full width — no floating gap above it.
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b text-white transition-colors duration-500",
          scrolled || pathname !== "/"
            ? "border-white/10 bg-black/80 shadow-2xl shadow-black/30 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="flex h-16 w-full items-center justify-between px-5 sm:px-10 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-16"
        >
          <NavLinks items={leftItems} active={active} className="hidden lg:flex" />

          <Link
            href="/"
            onClick={(e) => toTopIfHome(e, "/")}
            className="group flex items-center gap-2 px-2 font-display text-lg font-semibold tracking-tight lg:justify-self-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG */}
            <img
              src="/icon.svg"
              alt=""
              className="size-8 transition-transform duration-500 group-hover:rotate-[360deg]"
            />
            <span className="uppercase">{siteConfig.name}</span>
          </Link>

          <div className="hidden items-center justify-end gap-2 lg:flex">
            <NavLinks items={rightItems} active={active} />
            <Link
              href="/resume"
              className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-md bg-white px-4 text-sm font-medium text-black transition-transform duration-300 hover:-translate-y-0.5"
            >
              Resume
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-md border border-white/20 lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="fixed inset-0 z-[60] flex flex-col bg-black px-6 pb-10 pt-6 text-white lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold uppercase">
                {siteConfig.name}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-md border border-white/20"
              >
                <X className="size-5" />
              </button>
            </div>

            <ul className="mt-10 flex flex-col gap-2">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.05, ease: EASE_OUT_EXPO }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      setOpen(false);
                      toTopIfHome(e, item.href);
                    }}
                    className={cn(
                      "flex items-center gap-4 rounded-md border px-4 py-3.5 text-base font-medium transition-colors",
                      active === item.id
                        ? "border-white bg-white text-black"
                        : "border-white/10 text-white/80 active:bg-white/10",
                    )}
                  >
                    <span className="font-mono text-xs opacity-50">0{i + 1}</span>
                    <span className="flex-1">{item.label}</span>
                    <ArrowUpRight className="size-4 opacity-50" />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5, ease: EASE_OUT_EXPO }}
              className="mt-auto"
            >
              <Link
                href="/resume"
                onClick={() => setOpen(false)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-white/20 font-medium"
              >
                View Resume <ArrowUpRight className="size-4" />
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/**
 * Home links always land on the hero. Already on "/"? Next treats it as a
 * no-op, so scroll to the top ourselves.
 */
function toTopIfHome(e: React.MouseEvent, href: string) {
  if (href === "/" && window.location.pathname === "/") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function NavLinks({
  items,
  active,
  className,
}: {
  items: readonly NavItem[];
  active: string | undefined;
  className?: string;
}) {
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            onClick={(e) => toTopIfHome(e, item.href)}
            className={cn(
              "relative block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300",
              active === item.id ? "text-black" : "text-white/70 hover:text-white",
            )}
          >
            {active === item.id ? (
              <motion.span
                layoutId="nav-active"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-md bg-white"
              />
            ) : null}
            <span className="relative">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
