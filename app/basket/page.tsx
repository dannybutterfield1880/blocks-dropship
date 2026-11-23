"use client";

import Link from "next/link";
import { useState } from "react";
import { useBasket } from "@/lib/basket";
import { getProduct, formatPrice } from "@/lib/data";

// Keep in step with FREE_DELIVERY_OVER in Vercel (pence). Display only — the real rule is on the server.
const FREE_OVER = parseInt(process.env.NEXT_PUBLIC_FREE_DELIVERY_OVER || "5000", 10);

export default function BasketPage() {
  const { lines, setQty } = useBasket();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const checkout = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Something went wrong. Please try again.");
    } catch {
      setError("Couldn't reach checkout. Check your connection and try again.");
    }
    setBusy(false);
  };
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
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
            Delivery is added at checkout (UK only). Free over {formatPrice(FREE_OVER)}.
          </p>
          <button className="btn btn-accent btn-big" onClick={checkout} disabled={busy} style={busy ? { opacity: 0.7 } : undefined}>
            {busy ? "Taking you to checkout…" : "Checkout securely"}
          </button>
          {error && (
            <p role="alert" style={{ margin: 0, color: "#A3341C", fontWeight: 600 }}>
              {error}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
