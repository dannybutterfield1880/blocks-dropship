import { requireAdmin } from "@/lib/admin-auth";
import { stripeConfigured, stripeGet } from "@/lib/stripe";
import { formatPrice, getAnyProduct } from "@/lib/data";
import AdminNav from "./AdminNav";
import { trackingNow } from "./actions";

export const metadata = { title: "Orders — blocks admin", robots: { index: false } };
export const dynamic = "force-dynamic";

type Session = {
  id: string;
  created: number;
  amount_total: number;
  livemode: boolean;
  metadata: { items?: string };
  customer_details?: { name?: string; email?: string };
  collected_information?: { shipping_details?: { name?: string; address?: { city?: string; postal_code?: string } } };
  payment_intent?: { id: string; metadata: Record<string, string> } | null;
};

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  ordered: { label: "Sent to CJ", bg: "#E6F1EF", fg: "#0F4F4B" },
  shipped: { label: "Shipped", bg: "#E3EBF5", fg: "#1E3A5C" },
  manual: { label: "Needs manual order", bg: "#FBE7E1", fg: "#8A2E17" },
};

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ checked?: string }> }) {
  await requireAdmin();
  const { checked } = await searchParams;

  let sessions: Session[] = [];
  let error = "";
  if (stripeConfigured()) {
    try {
      sessions = (await stripeGet<{ data: Session[] }>("/checkout/sessions?limit=50&status=complete&expand%5B%5D=data.payment_intent")).data;
    } catch (e) {
      error = (e as Error).message;
    }
  } else {
    error = "STRIPE_SECRET_KEY isn't set in Vercel yet.";
  }

  return (
    <section className="wrap section">
      <AdminNav active="orders" />

      <div className="row-between" style={{ marginBottom: 16 }}>
        <p style={{ margin: 0, color: "var(--muted)" }}>Last 50 paid orders, newest first.</p>
        <form action={trackingNow}>
          <button className="btn btn-ghost">Check tracking now</button>
        </form>
      </div>
      {checked && <p className="ok">Tracking check done — {checked} order(s) checked.</p>}
      {error && <p role="alert" className="err">{error}</p>}
      {!error && sessions.length === 0 && <div className="card" style={{ padding: 24 }}>No orders yet.</div>}

      <div className="stack" style={{ gap: 12 }}>
        {sessions.map((s) => {
          const meta = s.payment_intent?.metadata || {};
          const st = STATUS[meta.cj_status] || { label: "Processing", bg: "#EDE8DD", fg: "#1B1D2B" };
          const ship = s.collected_information?.shipping_details;
          const items = String(s.metadata?.items || "")
            .split(",")
            .filter(Boolean)
            .map((x) => {
              const [slug, qty] = x.split("*");
              return `${qty} × ${getAnyProduct(slug)?.name || slug}`;
            });
          return (
            <article key={s.id} className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="row-between">
                <strong style={{ fontSize: 18 }}>{ship?.name || s.customer_details?.name || "Customer"}</strong>
                <span className="price">{formatPrice(s.amount_total)}</span>
              </div>
              <div className="row-between" style={{ fontSize: 14, color: "var(--muted)" }}>
                <span>
                  {new Date(s.created * 1000).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  {ship?.address ? ` · ${ship.address.city || ""} ${ship.address.postal_code || ""}` : ""}
                  {!s.livemode ? " · TEST" : ""}
                </span>
                <span style={{ background: st.bg, color: st.fg, fontWeight: 600, padding: "4px 10px", borderRadius: 999 }}>{st.label}</span>
              </div>
              <div style={{ fontSize: 15 }}>{items.join(" · ") || "—"}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                {s.customer_details?.email && <span>{s.customer_details.email}</span>}
                {meta.cj_order_id && <span>CJ: {meta.cj_order_id}</span>}
                {meta.tracking && <span>Tracking: {meta.tracking}</span>}
                {s.payment_intent && (
                  <a href={`https://dashboard.stripe.com/${s.livemode ? "" : "test/"}payments/${s.payment_intent.id}`} target="_blank" rel="noreferrer">
                    Open in Stripe
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
