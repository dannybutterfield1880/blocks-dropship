import { requireAdmin } from "@/lib/admin-auth";
import { allProducts, baseProducts, usingDummyData, getCollection } from "@/lib/data";
import { githubConfigured } from "@/lib/github";
import AdminNav from "../AdminNav";
import ProductsForm from "./ProductsForm";

export const metadata = { title: "Products — blocks admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  await requireAdmin();
  const rows = allProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    hidden: !!p.hidden,
    bestseller: !!p.bestseller,
    image: p.image,
    collection: getCollection(p.collection)?.name || p.collection,
    cost: p.cj?.costUsd,
    originalName: baseProducts.find((b) => b.slug === p.slug)?.name || p.name,
  }));

  return (
    <section className="wrap section">
      <AdminNav active="products" />
      {usingDummyData && <p className="note">Showing the dummy products — run the CJ import to load real ones.</p>}
      {!githubConfigured() && <p role="alert" className="err">GITHUB_TOKEN isn't set in Vercel, so changes can't be saved yet.</p>}
      <ProductsForm rows={rows} />
    </section>
  );
}
