import { NextResponse } from "next/server";
import { verifyStripeSignature } from "@/lib/stripe";
import { getProduct } from "@/lib/data";

// Stripe calls this when a payment completes.
// Step 4 adds: place the order with CJ, then email the customer their tracking number.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();

  if (!secret || !verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  const event = JSON.parse(raw);

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const items = String(s.metadata?.items || "")
      .split(",")
      .filter(Boolean)
      .map((x: string) => {
        const [slug, qty] = x.split("*");
        const p = getProduct(slug);
        return { slug, qty: Number(qty), name: p?.name, cj: p?.cj };
      });

    // Visible in Vercel → Project → Logs. Full order details are also in the Stripe dashboard.
    console.log(
      "NEW ORDER",
      JSON.stringify({
        session: s.id,
        paid: s.payment_status,
        total: s.amount_total,
        email: s.customer_details?.email,
        ship_to: s.collected_information?.shipping_details ?? s.shipping_details ?? null,
        items,
      })
    );
  }

  return NextResponse.json({ received: true });
}
