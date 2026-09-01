"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, Check, LoaderCircle, Send } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { EASE_OUT_EXPO } from "@/lib/motion";
import {
  contactSchema,
  emptyContactInput,
  validateField,
  type ContactInput,
} from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { ContactResponse } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";

const MESSAGE_LIMIT = 2000;

export function ContactForm() {
  const [values, setValues] = React.useState<ContactInput>(emptyContactInput);
  const [errors, setErrors] = React.useState<Partial<Record<keyof ContactInput, string>>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof ContactInput, boolean>>>({});
  const [status, setStatus] = React.useState<Status>("idle");
  const [feedback, setFeedback] = React.useState<string>("");

  const update = <K extends keyof ContactInput>(field: K, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));

    // Only re-validate a field the user has already left, so typing is quiet.
    if (touched[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
    }
  };

  const blur = <K extends keyof ContactInput>(field: K) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({
      ...current,
      [field]: validateField(field, values[field]),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof ContactInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactInput | undefined;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      setTouched({ name: true, email: true, message: true });
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const payload = (await response.json()) as ContactResponse;

      if (!response.ok || !payload.ok) {
        // Surface server-side field errors if the API returned any.
        if (payload.errors) {
          const nextErrors: Partial<Record<keyof ContactInput, string>> = {};
          for (const [key, messages] of Object.entries(payload.errors)) {
            nextErrors[key as keyof ContactInput] = messages[0];
          }
          setErrors(nextErrors);
        }
        setStatus("error");
        setFeedback(payload.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setFeedback(payload.message);
      setValues(emptyContactInput);
      setTouched({});
      setErrors({});
    } catch {
      setStatus("error");
      setFeedback(
        "Could not reach the server. Please check your connection and try again.",
      );
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <SuccessState
            message={feedback}
            onReset={() => {
              setStatus("idle");
              setFeedback("");
            }}
          />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  value={values.name}
                  invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  onChange={(event) => update("name", event.target.value)}
                  onBlur={() => blur("name")}
                  disabled={isSubmitting}
                />
                <FieldError id="contact-name-error" message={errors.name} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={values.email}
                  invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  onChange={(event) => update("email", event.target.value)}
                  onBlur={() => blur("email")}
                  disabled={isSubmitting}
                />
                <FieldError id="contact-email-error" message={errors.email} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="contact-message"
                hint={`${values.message.length} / ${MESSAGE_LIMIT}`}
              >
                Message
              </Label>
              <Textarea
                id="contact-message"
                name="message"
                placeholder="What are you building, and where does it need to go?"
                maxLength={MESSAGE_LIMIT}
                value={values.message}
                invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
                onChange={(event) => update("message", event.target.value)}
                onBlur={() => blur("message")}
                disabled={isSubmitting}
              />
              <FieldError id="contact-message-error" message={errors.message} />
            </div>

            {/* Honeypot: visually and programmatically hidden from humans. */}
            <div aria-hidden className="absolute -left-[9999px] top-0">
              <label htmlFor="contact-company">Company</label>
              <input
                id="contact-company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={values.company ?? ""}
                onChange={(event) => update("company", event.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                type="submit"
                variant="accent"
                size="lg"
                disabled={isSubmitting}
                className="group w-full min-w-44 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="animate-spin" aria-hidden />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    Send message
                  </>
                )}
              </Button>

              <p className="text-[0.75rem] text-[var(--text-tertiary)]">
                Usually replies within a couple of days.
              </p>
            </div>

            <AnimatePresence>
              {status === "error" && feedback ? (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "flex items-start gap-2.5 rounded-2xl border p-3.5",
                    "border-red-200 bg-red-50/70 text-[0.8125rem] text-red-700",
                    "dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300",
                  )}
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {feedback}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function SuccessState({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
      className="flex min-h-[22rem] flex-col items-center justify-center gap-4 text-center"
      role="status"
    >
      {/* Draw-on checkmark: the one place a flourish is warranted. */}
      <span className="relative grid size-16 place-items-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-500/12"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.15, 1], opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        />
        <svg viewBox="0 0 52 52" className="size-9 text-emerald-600" aria-hidden>
          <motion.path
            d="M14 27 L23 35 L38 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE_OUT_EXPO }}
          />
        </svg>
      </span>

      <div>
        <p className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          Message sent
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-[0.875rem] leading-relaxed text-[var(--text-secondary)]">
          {message}
        </p>
      </div>

      <Button variant="outline" size="sm" onClick={onReset} type="button">
        <Check className="size-3.5" />
        Send another
      </Button>
    </motion.div>
  );
}
