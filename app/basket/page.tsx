"use client";

import Link from "next/link";
import { useBasket } from "@/lib/basket";
import { getProduct, formatPrice } from "@/lib/data";

export default function BasketPage() {
  const { lines, setQty } = useBasket();
  const rows = lines
    .map((l) => ({ ...l, p: getProduct(l.slug) }))
    .filter((r) => r.p);
  const total = rows.reduce((sum, r) => sum + r.qty * (r.p?.price ?? 0), 0);

  return (
    <section className="wrap section" style={{ maxWidth: 860 }}>
      <div className="section-head">
        <h2>Your basket</h2>
      </div>

      {rows.length === 0 ? (
        <div className="card" style={{ padding: 32 }}>
          <p style={{ marginTop: 0 }}>Your basket is empty.</p>
          <Link href="/shop" className="btn btn-accent">Shop the sets</Link>
        </div>
      ) : (
        <div className="stack" style={{ gap: 12 }}>
          {rows.map((r) => (
            <div key={r.slug} className="card basket-line">
              <div>
                <Link href={`/products/${r.slug}`} style={{ fontWeight: 600, fontSize: 18 }}>{r.p!.name}</Link>
                <div style={{ color: "var(--muted)", fontSize: 14 }}>{formatPrice(r.p!.price)} each</div>
              </div>
              <div className="qty">
                <button aria-label={`Remove one ${r.p!.name}`} onClick={() => setQty(r.slug, r.qty - 1)}>−</button>
                <span style={{ minWidth: 24, textAlign: "center", fontWeight: 600 }}>{r.qty}</span>
                <button aria-label={`Add one ${r.p!.name}`} onClick={() => setQty(r.slug, r.qty + 1)}>+</button>
              </div>
              <span className="price">{formatPrice(r.qty * r.p!.price)}</span>
            </div>
          ))}
          <div className="card basket-line">
            <strong style={{ fontSize: 20 }}>Total</strong>
            <span className="price" style={{ fontSize: 24 }}>{formatPrice(total)}</span>
          </div>
          {/* Step 3: this button calls /api/checkout and redirects to Stripe Checkout */}
          <button className="btn btn-accent btn-big" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
            Checkout (coming in step 3)
          </button>
        </div>
      )}
    </section>
  );
}
