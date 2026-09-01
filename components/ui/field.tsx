"use client";

import { CircleAlert } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

const controlClasses = [
  "w-full rounded-2xl border bg-[var(--surface)] px-4 text-[0.95rem]",
  "text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]",
  "transition-[border-color,box-shadow,background-color] duration-300",
  "border-[var(--border-strong)]",
  "hover:border-accent-blue/35",
  "focus:border-accent-blue focus:shadow-[0_0_0_4px_rgba(59,108,246,0.12)]",
  "focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-60",
];

const invalidClasses =
  "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, invalid, ...props }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(controlClasses, "h-12", invalid && invalidClasses, className)}
        {...props}
      />
    );
  },
);

export interface TextareaProps
  extends React.ComponentPropsWithoutRef<"textarea"> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          controlClasses,
          "min-h-36 resize-y py-3.5 leading-relaxed",
          invalid && invalidClasses,
          className,
        )}
        {...props}
      />
    );
  },
);

export function Label({
  className,
  children,
  hint,
  ...props
}: React.ComponentPropsWithoutRef<"label"> & { hint?: string }) {
  return (
    <label
      className={cn(
        "flex items-baseline justify-between gap-3 text-[0.8125rem] font-medium",
        "text-[var(--text-secondary)]",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {hint ? (
        <span className="font-normal text-[var(--text-tertiary)]">{hint}</span>
      ) : null}
    </label>
  );
}

/** Animated inline error message, wired to the control via `aria-describedby`. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {message ? (
        <motion.p
          key={message}
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-1.5 overflow-hidden text-xs text-red-500"
        >
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
