"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function AdminLogin() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <section className="wrap prose" style={{ maxWidth: 420 }}>
      <h1>Admin</h1>
      <form action={action} className="card stack" style={{ padding: 24, gap: 14 }}>
        <label htmlFor="password" style={{ fontWeight: 600 }}>Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
        <button className="btn btn-accent btn-big" disabled={pending}>{pending ? "Checking…" : "Log in"}</button>
        {state?.error && <p role="alert" className="err">{state.error}</p>}
      </form>
    </section>
  );
}
