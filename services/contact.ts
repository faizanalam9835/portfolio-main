import "server-only";

import { siteConfig } from "@/data/site";
import type { ContactInput } from "@/lib/validations";

/**
 * Contact message delivery.
 *
 * Two transports, chosen by whichever env vars exist — no credentials ever
 * reach the client, and no third-party SDK is required to run the site:
 *
 *   EMAILJS_SERVICE_ID + EMAILJS_TEMPLATE_ID + EMAILJS_PUBLIC_KEY
 *     + EMAILJS_PRIVATE_KEY            → email via EmailJS's REST API
 *   RESEND_API_KEY + CONTACT_TO_EMAIL  → email via Resend's REST API
 *   CONTACT_WEBHOOK_URL                → POST to a webhook (Slack, Discord, n8n…)
 *
 * With neither configured the message is logged server-side and the request
 * still succeeds, so the form is demoable immediately after cloning.
 */

export type DeliveryChannel = "emailjs" | "resend" | "webhook" | "log";

export interface DeliveryResult {
  delivered: boolean;
  channel: DeliveryChannel;
}

function buildPlainText(input: ContactInput, meta: RequestMeta): string {
  return [
    `New portfolio enquiry`,
    ``,
    `Name:    ${input.name}`,
    `Email:   ${input.email}`,
    `Phone:   ${input.phone || "—"}`,
    `Sent:    ${meta.receivedAt}`,
    `Source:  ${meta.origin ?? "unknown"}`,
    ``,
    `Message:`,
    input.message,
  ].join("\n");
}

/** Escapes user content before it is placed in an HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(input: ContactInput, meta: RequestMeta): string {
  const safeMessage = escapeHtml(input.message).replace(/\n/g, "<br />");

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;color:#111827;line-height:1.6">
      <h2 style="margin:0 0 16px;font-size:18px">New portfolio enquiry</h2>
      <table style="border-collapse:collapse;font-size:14px;margin-bottom:20px">
        <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Name</td><td>${escapeHtml(input.name)}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Email</td><td>${escapeHtml(input.email)}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Phone</td><td>${escapeHtml(input.phone || "—")}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Received</td><td>${escapeHtml(meta.receivedAt)}</td></tr>
      </table>
      <div style="padding:16px;background:#fafafa;border:1px solid #ebedf0;border-radius:12px;font-size:14px">
        ${safeMessage}
      </div>
    </div>
  `;
}

export interface RequestMeta {
  receivedAt: string;
  origin?: string | undefined;
}

/**
 * EmailJS, called from the server so the keys never reach the browser.
 * Requires "Allow EmailJS API for non-browser applications" in the
 * EmailJS dashboard (Account → Security). The template receives
 * {{from_name}}, {{from_email}}, {{reply_to}}, {{phone}}, {{message}} and
 * {{time}} ({{name}}, {{email}} and {{phone_number}} as aliases).
 */
async function sendViaEmailJS(input: ContactInput, meta: RequestMeta): Promise<boolean> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  if (!serviceId || !templateId || !publicKey || !privateKey) return false;

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        from_name: input.name,
        from_email: input.email,
        reply_to: input.email,
        name: input.name,
        email: input.email,
        phone: input.phone || "Not provided",
        phone_number: input.phone || "Not provided",
        message: input.message,
        time: meta.receivedAt,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`EmailJS responded ${response.status}: ${detail.slice(0, 200)}`);
  }

  return true;
}

async function sendViaResend(
  input: ContactInput,
  meta: RequestMeta,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  if (!apiKey || !to) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `Portfolio enquiry from ${input.name}`,
      text: buildPlainText(input, meta),
      html: buildHtml(input, meta),
    }),
  });

  if (!response.ok) {
    // Body may contain provider detail; keep it server-side only.
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 200)}`);
  }

  return true;
}

async function sendViaWebhook(
  input: ContactInput,
  meta: RequestMeta,
): Promise<boolean> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return false;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: buildPlainText(input, meta),
      name: input.name,
      email: input.email,
      message: input.message,
      receivedAt: meta.receivedAt,
      site: siteConfig.url,
    }),
  });

  if (!response.ok) {
    throw new Error(`Contact webhook responded ${response.status}`);
  }

  return true;
}

export async function deliverContactMessage(
  input: ContactInput,
  meta: RequestMeta,
): Promise<DeliveryResult> {
  if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID) {
    const delivered = await sendViaEmailJS(input, meta);
    if (delivered) return { delivered: true, channel: "emailjs" };
  }

  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) {
    const delivered = await sendViaResend(input, meta);
    if (delivered) return { delivered: true, channel: "resend" };
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    const delivered = await sendViaWebhook(input, meta);
    if (delivered) return { delivered: true, channel: "webhook" };
  }

  console.info(
    "[contact] No delivery transport configured. Message received:",
    { name: input.name, email: input.email, receivedAt: meta.receivedAt },
  );

  return { delivered: false, channel: "log" };
}
