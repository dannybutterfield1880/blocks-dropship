// Shared CJ Dropshipping API helper. No packages needed — runs on Node 18+ (Termux: pkg install nodejs).
// Needs CJ_API_KEY set:  export CJ_API_KEY="CJ123456@api@xxxxxxxx"
import fs from "node:fs";
import path from "node:path";

const BASE = "https://developers.cjdropshipping.com/api2.0/v1";
const TOKEN_FILE = path.join(process.cwd(), ".cj-token.json"); // gitignored

export async function getToken() {
  // CJ caches tokens server-side for 24h, and limits how often you can ask — so we cache locally too.
  try {
    const saved = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));
    if (saved.token && Date.now() < saved.expires) return saved.token;
  } catch {}

  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) {
    console.error('Missing CJ_API_KEY. Run:  export CJ_API_KEY="your key from CJ > My CJ > Authorization > API"');
    process.exit(1);
  }

  const res = await fetch(`${BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });
  const json = await res.json();
  if (!json.result || !json.data?.accessToken) {
    console.error("CJ login failed:", json.message || json);
    process.exit(1);
  }
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token: json.data.accessToken, expires: Date.now() + 20 * 60 * 60 * 1000 }));
  return json.data.accessToken;
}

export async function cjGet(endpoint, params = {}) {
  const token = await getToken();
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}${endpoint}${qs ? `?${qs}` : ""}`, { headers: { "CJ-Access-Token": token } });
  const json = await res.json();
  if (!json.result) throw new Error(`${endpoint}: ${json.message || "request failed"}`);
  return json.data;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// "3.50" or "3.50 -- 4.20" or 3.5 → 3.5 (lowest price)
export function firstNumber(v) {
  const m = String(v ?? "").match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
}
