import type { MetadataRoute } from "next";
import { collections, products } from "@/lib/data";

const site = () => (process.env.SITE_URL || "https://blocks-dropship.vercel.app").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site();
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/shop`, priority: 0.9 },
    ...collections.map((c) => ({ url: `${base}/collections/${c.slug}`, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, priority: 0.7 })),
    ...["delivery", "returns", "contact", "terms", "privacy"].map((p) => ({ url: `${base}/info/${p}`, priority: 0.3 })),
  ];
}
