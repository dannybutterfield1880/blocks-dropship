// Reads picks.json, pulls each product from CJ, and writes lib/catalog.json for the site.
// Usage:  node scripts/import-cj.mjs
// Optional:  export MARKUP=2.5   (sell price = CJ cost x MARKUP)
//            export USD_GBP=0.79 (exchange rate; CJ prices are in USD)
import fs from "node:fs";
import { cjGet, firstNumber, sleep } from "./cj.mjs";

const MARKUP = parseFloat(process.env.MARKUP || "2.5");
const USD_GBP = parseFloat(process.env.USD_GBP || "0.79");

const picks = JSON.parse(fs.readFileSync("picks.json", "utf8")).filter((p) => p.pid && !p.pid.startsWith("PASTE"));
if (!picks.length) {
  console.log("picks.json has no real PIDs yet. Find some with:  node scripts/search-cj.mjs \"building blocks\"");
  process.exit(0);
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const stripHtml = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
// e.g. 12.37 -> 12.99, 40.10 -> 40.99
const toPence = (gbp) => Math.max(99, Math.floor(gbp) * 100 + 99);

const catalog = [];
for (const pick of picks) {
  try {
    const d = await cjGet("/product/query", { pid: pick.pid });
    const variant = pick.vid ? d.variants?.find((v) => v.vid === pick.vid) : d.variants?.[0];
    const costUsd = firstNumber(variant?.variantSellPrice ?? d.sellPrice);
    const name = pick.name || d.productNameEn;
    const images = [variant?.variantImage, ...(d.productImageSet || []), d.bigImage].filter(Boolean);

    catalog.push({
      slug: pick.slug || slugify(name),
      name,
      collection: pick.collection,
      price: pick.price ?? toPence(costUsd * USD_GBP * MARKUP),
      pieces: pick.pieces ?? 0,
      age: pick.age ?? 6,
      description: pick.description || stripHtml(d.description).slice(0, 500),
      image: images[0],
      images: [...new Set(images)].slice(0, 6),
      bestseller: !!pick.bestseller,
      cj: { pid: d.pid, vid: variant?.vid, variantSku: variant?.variantSku, costUsd },
    });
    console.log(`✓ ${name}  cost $${costUsd.toFixed(2)} → £${(catalog.at(-1).price / 100).toFixed(2)}`);
  } catch (e) {
    console.log(`✗ ${pick.pid}: ${e.message}`);
  }
  await sleep(1100); // stay under CJ's rate limit
}

fs.writeFileSync("lib/catalog.json", JSON.stringify(catalog, null, 2));
console.log(`\nWrote ${catalog.length} products to lib/catalog.json — now git add, commit and push.`);
