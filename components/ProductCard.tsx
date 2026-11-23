import Link from "next/link";
import { Product, formatPrice, getCollection } from "@/lib/data";
import AddToBasket from "./AddToBasket";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="card product-card">
      <Link href={`/products/${p.slug}`} className="plain">
        <div className="product-img">{p.image ? <img src={p.image} alt={p.name} /> : "[Product photo]"}</div>
      </Link>
      <div className="meta">
        <span>{getCollection(p.collection)?.name}</span>
        <span>
          {p.pieces > 0 ? `${p.pieces} pcs · ` : ""}Ages {p.age}+
        </span>
      </div>
      <h3>
        <Link href={`/products/${p.slug}`} className="plain">
          {p.name}
        </Link>
      </h3>
      <div className="row-between">
        <span className="price">{formatPrice(p.price)}</span>
        <AddToBasket slug={p.slug} />
      </div>
    </article>
  );
}
