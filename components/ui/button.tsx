import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-medium tracking-tight",
    "transition-[background-color,color,box-shadow,transform,border-color] duration-300",
    "outline-none disabled:pointer-events-none disabled:opacity-55",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-neutral-800 hover:-translate-y-0.5",
        light: "bg-white text-black hover:bg-neutral-200 hover:-translate-y-0.5",
        outline:
          "border border-current bg-transparent hover:bg-black hover:text-white hover:border-black",
        "outline-light":
          "border border-white/30 bg-transparent text-white hover:bg-white hover:text-black hover:border-white",
        ghost: "hover:bg-black/5",
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
