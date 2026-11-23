import { stripeGet, stripePost, stripeConfigured } from "@/lib/stripe";
import { cjConfigured, getCjOrder } from "@/lib/cj";
import { emailConfigured, sendEmail, trackingEmail } from "@/lib/email";

// Finds paid orders sent to CJ that haven't had tracking yet, asks CJ for a tracking
// number, and emails the customer once it exists. Used by the daily cron and the admin button.
export async function runTrackingCheck() {
  if (!stripeConfigured() || !cjConfigured()) return { checked: 0, results: {}, skipped: "Stripe or CJ not configured" };

  const query = encodeURIComponent("metadata['cj_status']:'ordered'");
  const found = await stripeGet<{ data: { id: string; metadata: Record<string, string> }[] }>(
    `/payment_intents/search?query=${query}&limit=100`
  );

  const results: Record<string, string> = {};
  for (const pi of found.data) {
    const { cj_order_id, ship_email, ship_name } = pi.metadata;
    try {
      const order = await getCjOrder(cj_order_id);
      if (!order?.trackNumber) {
        results[pi.id] = `waiting (${order?.orderStatus})`;
        continue;
      }
      if (ship_email && emailConfigured()) {
        await sendEmail(ship_email, "Your blocks order has shipped", trackingEmail(ship_name, order.trackNumber, order.trackingUrl, order.logisticName));
      }
      await stripePost(`/payment_intents/${pi.id}`, {
        metadata: { cj_status: "shipped", tracking: order.trackNumber.slice(0, 100) },
      });
      results[pi.id] = `shipped ${order.trackNumber}${emailConfigured() ? " (emailed)" : " (email not set up)"}`;
    } catch (e) {
      results[pi.id] = `error: ${(e as Error).message}`;
    }
  }

  console.log("TRACKING CHECK", JSON.stringify(results));
  return { checked: found.data.length, results };
}
