import { NextResponse } from "next/server";

import { getClientIdentifier, rateLimit } from "@/lib/rate-limit";
import { contactSchema, fieldErrors } from "@/lib/validations";
import { deliverContactMessage } from "@/services/contact";
import type { ContactResponse } from "@/types";

/** Node runtime: the delivery transports use `fetch` but may add SDKs later. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12_000;

function json(body: ContactResponse, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

export async function POST(request: Request): Promise<NextResponse> {
  // 1. Reject oversized payloads before parsing them.
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, message: "That message is too large." }, 413);
  }

  // 2. Rate limit per client identity.
  const identifier = getClientIdentifier(request.headers);
  const limit = rateLimit(`contact:${identifier}`, 5, 10 * 60 * 1000);

  if (!limit.success) {
    return json(
      {
        ok: false,
        message: `Too many messages from this address. Please try again in ${Math.ceil(
          limit.retryAfter / 60,
        )} minute(s).`,
      },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  // 3. Parse.
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request body." }, 400);
  }

  // 4. Validate with the same schema the client used.
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: "Please check the highlighted fields.",
        errors: fieldErrors(parsed.error),
      },
      422,
    );
  }

  // 5. Honeypot: a filled hidden field means a bot. Respond 200 so the bot
  //    learns nothing, but never deliver the message.
  if (parsed.data.company) {
    return json({ ok: true, message: "Thanks — your message was received." }, 200);
  }

  // 6. Deliver.
  try {
    const result = await deliverContactMessage(parsed.data, {
      receivedAt: new Date().toISOString(),
      origin: request.headers.get("origin") ?? undefined,
    });

    return json(
      {
        ok: true,
        message: result.delivered
          ? "Thanks for reaching out — I'll get back to you shortly."
          : "Message received. (No delivery transport is configured on this deployment yet.)",
      },
      200,
      { "X-RateLimit-Remaining": String(limit.remaining) },
    );
  } catch (error) {
    // Log the detail server-side; never leak provider errors to the client.
    console.error("[api/contact] Delivery failed:", error);
    return json(
      {
        ok: false,
        message:
          "The message could not be delivered right now. Please email me directly.",
      },
      502,
    );
  }
}

/** Explicitly reject other verbs so they don't fall through as 405 HTML. */
export function GET(): NextResponse {
  return json({ ok: false, message: "Method not allowed." }, 405);
}
