// Search CJ for products to sell.
// Usage:  node scripts/search-cj.mjs "building blocks castle" [page]
import { cjGet, firstNumber } from "./cj.mjs";

const keyWord = process.argv[2];
const page = process.argv[3] || "1";
if (!keyWord) {
  console.log('Usage: node scripts/search-cj.mjs "building blocks castle" [page]');
  process.exit(0);
}

const data = await cjGet("/product/listV2", { keyWord, page, size: "20" });
const list = (data.content || []).flatMap((c) => c.productList || []);

if (!list.length) {
  console.log("No results. Try different words.");
  process.exit(0);
}

console.log(`\nPage ${data.pageNumber} of ${data.totalPages} (${data.totalRecords} results)\n`);
for (const p of list) {
  console.log(`$${firstNumber(p.sellPrice).toFixed(2).padStart(7)}  ${p.id}`);
  console.log(`          ${p.nameEn}\n`);
}
console.log('Copy a PID (the long ID) into picks.json, then run:  node scripts/import-cj.mjs');
