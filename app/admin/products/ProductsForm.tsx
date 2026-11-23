"use client";

import { useActionState } from "react";
import { saveProducts } from "../actions";

type Row = {
  slug: string;
  name: string;
  originalName: string;
  price: number;
  hidden: boolean;
  bestseller: boolean;
  image?: string;
  collection: string;
  cost?: number;
};

export default function ProductsForm({ rows }: { rows: Row[] }) {
  const [state, action, pending] = useActionState(saveProducts, null);

  const saveBar = (
    <div className="row-between">
      <span style={{ color: "var(--muted)", fontSize: 14 }}>{rows.length} products</span>
      <button className="btn btn-accent" disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>
    </div>
  );

  return (
    <form action={action} className="stack" style={{ gap: 12 }}>
      {saveBar}
      {state?.ok && <p className="ok">{state.ok}</p>}
      {state?.error && <p role="alert" className="err">{state.error}</p>}

      {rows.map((r) => (
        <div key={r.slug} className="card admin-product" style={{ opacity: r.hidden ? 0.7 : 1 }}>
          <div className="admin-thumb">{r.image ? <img src={r.image} alt="" /> : null}</div>
          <div className="stack" style={{ gap: 10, flex: "1 1 260px", minWidth: 0 }}>
            <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
              {r.collection}
              {typeof r.cost === "number" ? ` · CJ cost $${r.cost.toFixed(2)}` : ""}
            </div>
            <label className="field">
              <span>Name</span>
              <input className="input" name={`name:${r.slug}`} defaultValue={r.name} placeholder={r.originalName} />
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
              <label className="field" style={{ width: 140 }}>
                <span>Price (£)</span>
                <input className="input" name={`price:${r.slug}`} type="number" step="0.01" min="0.5" defaultValue={(r.price / 100).toFixed(2)} />
              </label>
              <label className="check">
                <input type="checkbox" name={`hidden:${r.slug}`} defaultChecked={r.hidden} /> Hidden
              </label>
              <label className="check">
                <input type="checkbox" name={`best:${r.slug}`} defaultChecked={r.bestseller} /> Bestseller
              </label>
            </div>
          </div>
        </div>
      ))}

      {saveBar}
    </form>
  );
}
