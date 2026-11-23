// Server-side CJ Dropshipping client for placing orders and checking tracking.
const BASE = "https://developers.cjdropshipping.com/api2.0/v1";

let cached: { token: string; expires: number } | null = null;

async function token() {
  if (cached && Date.now() < cached.expires) return cached.token;
  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) throw new Error("CJ_API_KEY not set");
  const res = await fetch(`${BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });
  const json = await res.json();
  if (!json.result || !json.data?.accessToken) throw new Error(`CJ login failed: ${json.message}`);
  cached = { token: json.data.accessToken, expires: Date.now() + 12 * 60 * 60 * 1000 };
  return cached.token;
}

async function call<T = any>(method: "GET" | "POST", path: string, body?: unknown): Promise<{ ok: boolean; data: T; message: string; code: number }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "CJ-Access-Token": await token(), "Content-Type": "application/json", platformToken: "" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  return { ok: !!json.result, data: json.data, message: String(json.message || ""), code: json.code };
}

export const cjConfigured = () => !!process.env.CJ_API_KEY;

type CjLine = { vid: string; quantity: number };

export async function cheapestLogistic(products: CjLine[], zip?: string) {
  const preferred = process.env.CJ_LOGISTIC; // e.g. "CJPacket Ordinary" to force one
  if (preferred) return preferred;
  const r = await call<{ logisticName: string; logisticPrice: number }[]>("POST", "/logistic/freightCalculate", {
    startCountryCode: "CN",
    endCountryCode: "GB",
    zip,
    products,
  });
  if (!r.ok || !r.data?.length) throw new Error(`No CJ shipping options: ${r.message}`);
  return [...r.data].sort((a, b) => a.logisticPrice - b.logisticPrice)[0].logisticName;
}

export type ShipTo = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  phone?: string;
  email?: string;
};

// orderNumber should be unique per sale — we use the Stripe session id, so a retried
// webhook can't create a second order (CJ rejects duplicates with ORDER_CODE_EXIST).
export async function createCjOrder(orderNumber: string, ship: ShipTo, products: CjLine[]) {
  const logisticName = await cheapestLogistic(products, ship.postcode);
  const r = await call<{ orderId: string; orderStatus: string }>("POST", "/shopping/order/createOrderV2", {
    orderNumber,
    shippingCountryCode: "GB",
    shippingCountry: "United Kingdom",
    shippingProvince: ship.county || ship.city,
    shippingCity: ship.city,
    shippingAddress: ship.line1,
    shippingAddress2: ship.line2 || "",
    shippingZip: ship.postcode,
    shippingCustomerName: ship.name,
    shippingPhone: ship.phone || "",
    email: ship.email || "",
    logisticName,
    fromCountryCode: "CN",
    // 3 = create only (you confirm + pay in the CJ dashboard). 2 = pay automatically from CJ balance.
    payType: Number(process.env.CJ_PAY_TYPE || "3"),
    products,
  });
  if (!r.ok) {
    if (/ORDER_CODE_EXIST/i.test(r.message)) return { orderId: orderNumber, duplicate: true, logisticName };
    throw new Error(`CJ order failed: ${r.message}`);
  }
  return { orderId: r.data.orderId, duplicate: false, logisticName };
}

export async function getCjOrder(orderId: string) {
  const r = await call<{
    orderStatus: string;
    trackNumber?: string;
    trackingUrl?: string;
    logisticName?: string;
  }>("GET", `/shopping/order/getOrderDetail?orderId=${encodeURIComponent(orderId)}`);
  if (!r.ok) throw new Error(`CJ order lookup failed: ${r.message}`);
  return r.data;
}
