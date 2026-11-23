import { NextResponse } from "next/server";
import { getProduct } from "@/lib/data";
import { stripeConfigured, stripePost, deliveryFee, freeDeliveryOver } from "@/lib/stripe";

type Line = { slug: string; qty: number };

export async function POST(req: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Checkout isn't switched on yet (no Stripe key)." }, { status: 503 });
  }

  let lines: Line[] = [];
  try {
    lines = (await req.json()).lines;
  } catch {}

  // Prices always come from our catalogue, never from the browser.
  const items = (Array.isArray(lines) ? lines : [])
    .map((l) => ({ p: getProduct(String(l.slug)), qty: Math.min(20, Math.max(1, Math.floor(Number(l.qty) || 0))) }))
    .filter((i) => i.p);

  if (!items.length) return NextResponse.json({ error: "Your basket is empty." }, { status: 400 });

  const subtotal = items.reduce((s, i) => s + i.p!.price * i.qty, 0);
  const shipping = subtotal >= freeDeliveryOver() ? 0 : deliveryFee();
  const origin = req.headers.get("origin") || new URL(req.url).origin;

  try {
    const session = await stripePost<{ url: string }>("/checkout/sessions", {
      mode: "payment",
      currency: "gbp",
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/basket`,
      shipping_address_collection: { allowed_countries: { 0: "GB" } },
      phone_number_collection: { enabled: true }, // suppliers usually need a phone number for the courier
      line_items: Object.fromEntries(
        items.map((i, n) => [
          n,
          {
            quantity: i.qty,
            price_data: {
              currency: "gbp",
              unit_amount: i.p!.price,
              product_data: {
                name: i.p!.name,
                ...(i.p!.image ? { images: { 0: i.p!.image } } : {}),
                metadata: { slug: i.p!.slug },
              },
            },
          },
        ])
      ),
      shipping_options: {
        0: {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shipping === 0 ? "Free UK delivery" : "UK delivery",
            fixed_amount: { amount: shipping, currency: "gbp" },
          },
        },
      },
      // Compact copy of the order for step 4 (auto-ordering from CJ). Max 500 chars.
      metadata: { items: items.map((i) => `${i.p!.slug}*${i.qty}`).join(",").slice(0, 500) },
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Couldn't start checkout. Please try again." }, { status: 500 });
  }
}
