import Link from "next/link";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

const LEVELS: Record<string, { label: string; min: number; max: number }> = {
  starter: { label: "Starter", min: 0, max: 499 },
  builder: { label: "Builder", min: 500, max: 1500 },
  master: { label: "Master", min: 1501, max: Infinity },
};

export default async function Shop({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const range = level ? LEVELS[level] : undefined;
  const list = range ? products.filter((p) => p.pieces >= range.min && p.pieces <= range.max) : products;

  return (
    <section className="wrap section">
      <div className="section-head">
        <h2>{range ? `${range.label} sets` : "All sets"}</h2>
        <div className="buttons">
          <Link href="/shop" className="btn btn-ghost">All</Link>
          {Object.entries(LEVELS).map(([key, l]) => (
            <Link key={key} href={`/shop?level=${key}`} className={level === key ? "btn btn-dark" : "btn btn-ghost"}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid">
        {list.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
    </section>
  );
}
