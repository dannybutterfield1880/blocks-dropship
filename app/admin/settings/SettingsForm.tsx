"use client";

import { useActionState } from "react";
import { saveSettings } from "../actions";
import type { Settings } from "@/lib/settings";

const pounds = (p: number) => (p / 100).toFixed(2);

export default function SettingsForm({ s }: { s: Settings }) {
  const [state, action, pending] = useActionState(saveSettings, null);

  return (
    <form action={action} className="stack" style={{ gap: 20 }}>
      <div className="card stack" style={{ padding: 20, gap: 16 }}>
        <h3>Seller details</h3>
        <p className="note">UK law says customers must be able to see who they're buying from. These appear in the footer, terms, privacy and contact pages.</p>
        <div className="settings-grid">
          <label className="field"><span>Shop name</span><input className="input" name="shopName" defaultValue={s.shopName} required /></label>
          <label className="field"><span>Legal name (your name, or company name)</span><input className="input" name="legalName" defaultValue={s.legalName} /></label>
          <label className="field"><span>Contact email</span><input className="input" type="email" name="email" defaultValue={s.email} /></label>
          <label className="field"><span>Phone (optional)</span><input className="input" type="tel" name="phone" defaultValue={s.phone} /></label>
          <label className="field"><span>Company number (if a limited company)</span><input className="input" name="companyNumber" defaultValue={s.companyNumber} /></label>
          <label className="field"><span>VAT number (if registered)</span><input className="input" name="vatNumber" defaultValue={s.vatNumber} /></label>
        </div>
        <label className="field">
          <span>Business address (a virtual office address is fine)</span>
          <textarea className="input" name="address" defaultValue={s.address} rows={4} />
        </label>
      </div>

      <div className="card stack" style={{ padding: 20, gap: 16 }}>
        <h3>Delivery</h3>
        <div className="settings-grid">
          <label className="field"><span>Delivery fee (£)</span><input className="input" type="number" step="0.01" min="0" name="deliveryFee" defaultValue={pounds(s.deliveryFee)} /></label>
          <label className="field"><span>Free delivery over (£, 0 = never)</span><input className="input" type="number" step="0.01" min="0" name="freeDeliveryOver" defaultValue={pounds(s.freeDeliveryOver)} /></label>
          <label className="field"><span>Dispatch time</span><input className="input" name="dispatchTime" defaultValue={s.dispatchTime} placeholder="1–3 working days" /></label>
          <label className="field"><span>Delivery time</span><input className="input" name="deliveryTime" defaultValue={s.deliveryTime} placeholder="7–12 working days" /></label>
        </div>
      </div>

      <div className="card stack" style={{ padding: 20, gap: 16 }}>
        <h3>Returns</h3>
        <div className="settings-grid">
          <label className="field"><span>Returns window (days, minimum 14)</span><input className="input" type="number" min="14" max="365" name="returnsDays" defaultValue={s.returnsDays} /></label>
          <label className="field">
            <span>Who pays return postage (change of mind)</span>
            <select className="input" name="returnPostagePaidBy" defaultValue={s.returnPostagePaidBy}>
              <option value="customer">Customer</option>
              <option value="us">We do</option>
            </select>
          </label>
        </div>
      </div>

      <div className="row-between">
        <span className="note" style={{ margin: 0 }}>Saving updates the site in about a minute.</span>
        <button className="btn btn-accent btn-big" disabled={pending}>{pending ? "Saving…" : "Save settings"}</button>
      </div>
      {state?.ok && <p className="ok">{state.ok}</p>}
      {state?.error && <p role="alert" className="err">{state.error}</p>}
    </form>
  );
}
