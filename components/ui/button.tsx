import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-full text-sm font-medium tracking-tight",
    "transition-[background-color,color,box-shadow,transform,border-color] duration-300",
    "outline-none disabled:pointer-events-none disabled:opacity-55",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-ink-900/95 text-white shadow-soft backdrop-blur-sm",
          "hover:bg-ink-950 hover:shadow-lift",
          "dark:bg-white/95 dark:text-ink-900 dark:hover:bg-white",
        ],
        accent: [
          // Oversized background so the gradient can slide on hover.
          "relative overflow-hidden text-white",
          "bg-[linear-gradient(110deg,var(--color-accent-blue),var(--color-accent-violet),var(--color-accent-cyan),var(--color-accent-violet))]",
          "bg-[length:280%_100%] bg-[position:0%_50%] hover:bg-[position:100%_50%]",
          "transition-[background-position,box-shadow,transform] duration-700",
          "shadow-[0_10px_30px_-12px_rgba(124,92,246,0.7),inset_0_1px_0_0_rgba(255,255,255,0.28)]",
          "hover:shadow-[0_18px_44px_-14px_rgba(124,92,246,0.9),inset_0_1px_0_0_rgba(255,255,255,0.35)]",
        ],
        outline: [
          "frost border border-[var(--border-strong)] bg-[var(--surface)]",
          "text-[var(--text-primary)] hover:border-accent-blue/45",
          "hover:bg-accent-blue/[0.06] hover:shadow-glow",
        ],
        ghost: [
          "text-[var(--text-secondary)]",
          "hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]",
        ],
        glass: [
          "glass text-[var(--text-primary)] shadow-soft",
          "hover:border-accent-violet/35",
        ],
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-13 px-7 text-[0.95rem]",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. an `<a>` or `<Link>`) instead of a button. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant, size, asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

export { buttonVariants };
