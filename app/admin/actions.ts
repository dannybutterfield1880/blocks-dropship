"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, passwordMatches, sessionValue, requireAdmin } from "@/lib/admin-auth";
import { baseProducts, Override } from "@/lib/data";
import { commitFile, githubConfigured } from "@/lib/github";
import { runTrackingCheck } from "@/lib/tracking";
import { settings as current, Settings } from "@/lib/settings";

type Result = { ok?: string; error?: string } | null;

export async function login(_: Result, form: FormData): Promise<Result> {
  if (!process.env.ADMIN_PASSWORD) return { error: "ADMIN_PASSWORD isn't set in Vercel yet." };
  if (!passwordMatches(String(form.get("password") || ""))) return { error: "Wrong password." };
  (await cookies()).set(ADMIN_COOKIE, sessionValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin");
  return null;
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function saveProducts(_: Result, form: FormData): Promise<Result> {
  await requireAdmin();
  if (!githubConfigured()) return { error: "GITHUB_TOKEN isn't set in Vercel, so changes can't be saved." };

  // Only store what differs from the catalogue, so re-importing from CJ keeps your edits.
  const next: Record<string, Override> = {};
  for (const p of baseProducts) {
    const o: Override = {};
    const name = String(form.get(`name:${p.slug}`) || "").trim();
    const pounds = parseFloat(String(form.get(`price:${p.slug}`) || ""));
    const price = Number.isFinite(pounds) ? Math.round(pounds * 100) : NaN;
    if (name && name !== p.name) o.name = name;
    if (price > 0 && price !== p.price) o.price = price;
    if (form.get(`hidden:${p.slug}`)) o.hidden = true;
    const best = !!form.get(`best:${p.slug}`);
    if (best !== !!p.bestseller) o.bestseller = best;
    if (Object.keys(o).length) next[p.slug] = o;
  }

  try {
    await commitFile("lib/overrides.json", JSON.stringify(next, null, 2) + "\n", "Admin: update products");
    return { ok: "Saved. The shop updates in about a minute while Vercel redeploys." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function trackingNow() {
  await requireAdmin();
  const r = await runTrackingCheck();
  redirect(`/admin?checked=${r.checked}`);
}

const pence = (v: FormDataEntryValue | null, fallback: number) => {
  const n = parseFloat(String(v ?? ""));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : fallback;
};
const text = (v: FormDataEntryValue | null, max = 300) => String(v ?? "").trim().slice(0, max);

export async function saveSettings(_: Result, form: FormData): Promise<Result> {
  await requireAdmin();
  if (!githubConfigured()) return { error: "GITHUB_TOKEN isn't set in Vercel, so changes can't be saved." };

  const days = parseInt(String(form.get("returnsDays") || ""), 10);
  const next: Settings = {
    shopName: text(form.get("shopName"), 60) || current.shopName,
    legalName: text(form.get("legalName"), 120),
    email: text(form.get("email"), 120),
    phone: text(form.get("phone"), 40),
    address: text(form.get("address"), 400),
    companyNumber: text(form.get("companyNumber"), 20),
    vatNumber: text(form.get("vatNumber"), 20),
    deliveryFee: pence(form.get("deliveryFee"), current.deliveryFee),
    freeDeliveryOver: pence(form.get("freeDeliveryOver"), current.freeDeliveryOver),
    deliveryTime: text(form.get("deliveryTime"), 60) || current.deliveryTime,
    dispatchTime: text(form.get("dispatchTime"), 60) || current.dispatchTime,
    returnsDays: Number.isFinite(days) ? Math.min(365, Math.max(14, days)) : current.returnsDays,
    returnPostagePaidBy: form.get("returnPostagePaidBy") === "us" ? "us" : "customer",
  };

  try {
    await commitFile("lib/settings.json", JSON.stringify(next, null, 2) + "\n", "Admin: update settings");
    return { ok: "Saved. The shop updates in about a minute while Vercel redeploys." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
