// Sends email through Resend's REST API (free tier: 3,000 emails/month).
export const emailConfigured = () => !!process.env.RESEND_API_KEY && !!process.env.EMAIL_FROM;

export async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Email failed: ${res.status} ${await res.text()}`);
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function trackingEmail(name: string, trackNumber: string, trackingUrl?: string, carrier?: string) {
  const first = esc((name || "there").split(" ")[0]);
  const link = trackingUrl || `https://t.17track.net/en#nums=${encodeURIComponent(trackNumber)}`;
  return `
  <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1B1D2B">
    <h1 style="font-size:26px;margin:0 0 12px">Your sets are on the way!</h1>
    <p>Hi ${first}, good news — your blocks order has shipped.</p>
    <p style="background:#F5F2EB;border-radius:12px;padding:16px">
      <strong>Tracking number:</strong> ${esc(trackNumber)}${carrier ? `<br><strong>Carrier:</strong> ${esc(carrier)}` : ""}
    </p>
    <p><a href="${esc(link)}" style="display:inline-block;background:#176F6A;color:#fff;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:bold">Track your parcel</a></p>
    <p style="color:#5A5C6B;font-size:13px">Tracking can take a day or two to show updates. Not suitable for children under 3 — small parts.</p>
  </div>`;
}
