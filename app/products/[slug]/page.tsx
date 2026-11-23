import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct, getCollection, formatPrice } from "@/lib/data";
import AddToBasket from "@/components/AddToBasket";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const c = getCollection(p.collection);

  return (
    <section className="wrap pdp">
      <div className="stack" style={{ gap: 12 }}>
        <div className="product-img">{p.image ? <img src={p.image} alt={p.name} /> : "[Product photo]"}</div>
        {p.images && p.images.length > 1 && (
          <div className="thumbs">
            {p.images.slice(1, 5).map((src, i) => (
              <img key={src} src={src} alt={`${p.name} – view ${i + 2}`} />
            ))}
          </div>
        )}
      </div>
      <div className="stack">
        {c && (
          <Link href={`/collections/${c.slug}`} style={{ fontWeight: 600 }}>
            {c.name}
          </Link>
        )}
        <h1>{p.name}</h1>
        <span className="price" style={{ fontSize: 28 }}>{formatPrice(p.price)}</span>
        <p style={{ fontSize: 18, lineHeight: 1.6, margin: 0 }}>{p.description}</p>
        <div className="facts">
          {p.pieces > 0 && <span>{p.pieces} pieces</span>}
          <span>Ages {p.age}+</span>
          <span>Fits major brick brands</span>
        </div>
        <AddToBasket slug={p.slug} big />
        <p className="warning">Warning: not suitable for children under 3 years. Contains small parts — choking hazard.</p>
      </div>
    </section>
  );
}
