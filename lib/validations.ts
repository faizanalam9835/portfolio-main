import { z } from "zod";

/**
 * Shared between the client form and the API route so validation rules
 * cannot drift between the two.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(80, "That name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(160, "That email is too long.")
    .email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(20, "Please share a little more detail (20+ characters).")
    .max(2000, "Please keep it under 2000 characters."),
  /** Honeypot — real users never fill this. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const emptyContactInput: ContactInput = {
  name: "",
  email: "",
  message: "",
  company: "",
};

/**
 * Field-level validation for live feedback as the user types. Validates the
 * single field against its own schema rather than re-parsing the whole
 * object, so an untouched field never reports an error.
 */
export function validateField(
  field: keyof ContactInput,
  value: unknown,
): string | undefined {
  const result = contactSchema.shape[field].safeParse(value);
  if (result.success) return undefined;
  return result.error.issues[0]?.message;
}

/** Flattens Zod issues into the `Record<string, string[]>` API shape. */
export function fieldErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] = [...(errors[key] ?? []), issue.message];
  }
  return errors;
}
