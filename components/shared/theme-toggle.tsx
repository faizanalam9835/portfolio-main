"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // The resolved theme is unknown until after hydration.
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative grid size-10 place-items-center rounded-full",
        "border border-[var(--border-subtle)] bg-[var(--surface)]",
        "text-[var(--text-secondary)] transition-colors duration-300",
        "hover:border-accent-violet/30 hover:text-[var(--text-primary)]",
        className,
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="absolute grid place-items-center"
        >
          {isDark ? (
            <Moon className="size-4.5" aria-hidden />
          ) : (
            <Sun className="size-4.5" aria-hidden />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
