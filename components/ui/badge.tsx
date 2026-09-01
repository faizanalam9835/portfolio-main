import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full",
    "font-medium tracking-tight transition-colors duration-300",
  ],
  {
    variants: {
      variant: {
        neutral:
          "border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)]",
        muted: "bg-[var(--surface-sunken)] text-[var(--text-secondary)]",
        blue: "bg-accent-blue/8 text-accent-blue ring-1 ring-accent-blue/15",
        violet: "bg-accent-violet/8 text-accent-violet ring-1 ring-accent-violet/15",
        cyan: "bg-accent-cyan/10 text-accent-cyan ring-1 ring-accent-cyan/20",
        outline:
          "border border-[var(--border-strong)] text-[var(--text-primary)]",
      },
      size: {
        sm: "px-2 py-0.5 text-[0.6875rem]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3.5 py-1.5 text-[0.8125rem]",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  },
);

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { badgeVariants };
