import { requireAdmin } from "@/lib/admin-auth";
import { settings } from "@/lib/settings";
import { githubConfigured } from "@/lib/github";
import AdminNav from "../AdminNav";
import SettingsForm from "./SettingsForm";

export const metadata = { title: "Settings — blocks admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  await requireAdmin();
  return (
    <section className="wrap section" style={{ maxWidth: 900 }}>
      <AdminNav active="settings" />
      {!githubConfigured() && <p role="alert" className="err">GITHUB_TOKEN isn't set in Vercel, so changes can't be saved yet.</p>}
      <SettingsForm s={settings} />
    </section>
  );
}
