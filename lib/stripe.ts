// Tiny Stripe client using the REST API directly — no npm package needed.
import crypto from "node:crypto";

const API = "https://api.stripe.com/v1";

export const stripeConfigured = () => !!process.env.STRIPE_SECRET_KEY;

// Stripe wants form-encoded bodies with bracketed keys: line_items[0][quantity]=1
function encode(obj: unknown, prefix = "", out: string[] = []): string[] {
  if (obj === undefined || obj === null) return out;
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      encode(v, prefix ? `${prefix}[${k}]` : k, out);
    }
  } else {
    out.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(String(obj))}`);
  }
  return out;
}

export async function stripePost<T = any>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encode(body).join("&"),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || `Stripe error ${res.status}`);
  return json as T;
}

export async function stripeGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || `Stripe error ${res.status}`);
  return json as T;
}

// Checks the Stripe-Signature header so nobody can fake a "paid" order.
export function verifyStripeSignature(rawBody: string, header: string | null, secret: string, toleranceSec = 300) {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i), p.slice(i + 1)];
    })
  );
  const t = parts.t;
  const sigs = header
    .split(",")
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.slice(3));
  if (!t || !sigs.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > toleranceSec) return false;

  const expected = crypto.createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  return sigs.some((s) => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}

import { settings } from "./settings";
// Set in Admin → Settings. Env vars DELIVERY_FEE / FREE_DELIVERY_OVER still override if present.
export const deliveryFee = () => parseInt(process.env.DELIVERY_FEE || String(settings.deliveryFee), 10); // pence
export const freeDeliveryOver = () => {
  const v = parseInt(process.env.FREE_DELIVERY_OVER || String(settings.freeDeliveryOver), 10);
  return v > 0 ? v : Infinity; // 0 = never free
};
