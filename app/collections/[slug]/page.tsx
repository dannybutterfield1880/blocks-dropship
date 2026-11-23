import { notFound } from "next/navigation";
import { collections, getCollection, productsIn } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const list = productsIn(slug);

  return (
    <>
      <section className="wrap" style={{ paddingTop: 16, paddingBottom: 40 }}>
        <div className="band" style={{ background: c.colour }}>
          <div>
            <h1 style={{ fontSize: "clamp(40px,7vw,64px)" }}>{c.name}</h1>
            <p style={{ color: "rgba(255,255,255,.85)" }}>{c.blurb}</p>
          </div>
        </div>
      </section>
      <section className="wrap section">
        <div className="grid">
          {list.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}
