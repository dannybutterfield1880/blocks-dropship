import { NextResponse } from "next/server";
import { verifyStripeSignature, stripePost } from "@/lib/stripe";
import { getProduct } from "@/lib/data";
import { cjConfigured, createCjOrder } from "@/lib/cj";

// Stripe calls this when a payment completes. We place the matching order with CJ
// and note the CJ order id on the Stripe payment, so the daily tracking check can find it.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();

  if (!secret || !verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  const event = JSON.parse(raw);
  if (event.type !== "checkout.session.completed") return NextResponse.json({ received: true });

  const s = event.data.object;
  if (s.payment_status !== "paid") return NextResponse.json({ received: true });

  const items = String(s.metadata?.items || "")
    .split(",")
    .filter(Boolean)
    .map((x: string) => {
      const [slug, qty] = x.split("*");
      const p = getProduct(slug);
      return { slug, qty: Number(qty), name: p?.name, vid: p?.cj?.vid };
    });

  const shipping = s.collected_information?.shipping_details ?? s.shipping_details ?? {};
  const addr = shipping.address ?? {};
  const ship = {
    name: shipping.name || s.customer_details?.name || "",
    line1: addr.line1 || "",
    line2: addr.line2 || "",
    city: addr.city || "",
    county: addr.state || "",
    postcode: addr.postal_code || "",
    phone: s.customer_details?.phone || "",
    email: s.customer_details?.email || "",
  };

  console.log("NEW ORDER", JSON.stringify({ session: s.id, total: s.amount_total, email: ship.email, ship, items }));

  const piId = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id;
  const tag = (metadata: Record<string, string>) =>
    piId ? stripePost(`/payment_intents/${piId}`, { metadata }).catch((e) => console.error("Stripe tag failed:", e)) : null;

  const missing = items.filter((i) => !i.vid);
  if (!cjConfigured() || missing.length) {
    console.warn("MANUAL ORDER NEEDED", s.id, !cjConfigured() ? "CJ_API_KEY not set" : `no CJ variant for: ${missing.map((m) => m.slug).join(", ")}`);
    await tag({ cj_status: "manual" });
    return NextResponse.json({ received: true, manual: true });
  }

  try {
    const cj = await createCjOrder(
      s.id,
      ship,
      items.map((i) => ({ vid: i.vid!, quantity: i.qty }))
    );
    console.log("CJ ORDER", JSON.stringify({ session: s.id, ...cj }));
    await tag({ cj_status: "ordered", cj_order_id: cj.orderId, ship_name: ship.name.slice(0, 100), ship_email: ship.email.slice(0, 200) });
    return NextResponse.json({ received: true, cj: cj.orderId });
  } catch (e) {
    console.error("CJ ORDER FAILED", s.id, e);
    // 500 makes Stripe retry later; CJ rejects duplicates so a retry can't double-order.
    return NextResponse.json({ error: "CJ order failed" }, { status: 500 });
  }
}
