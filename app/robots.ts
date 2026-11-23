import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.SITE_URL || "https://blocks-dropship.vercel.app").replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/basket", "/order"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
