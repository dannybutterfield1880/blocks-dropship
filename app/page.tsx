import Link from "next/link";
import { collections, bestsellers, getProduct, Product } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

function Cube({ top, left, right, size = 96 }: { top: string; left: string; right: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 3 L36 12 L20 21 L4 12 Z" fill={top} />
      <path d="M4 12 L20 21 L20 38 L4 29 Z" fill={left} />
      <path d="M36 12 L20 21 L20 38 L36 29 Z" fill={right} />
    </svg>
  );
}

export default function Home() {
  const best = bestsellers.map(getProduct).filter(Boolean) as Product[];

  return (
    <>
      <section className="wrap hero">
        <div className="stack">
          <span className="pill" style={{ alignSelf: "flex-start" }}>New: Orbit space collection</span>
          <h1>
            Build big.
            <br />
            Spend less.
          </h1>
          <p>Detailed building sets — cities, castles, starships and more. Every brick fits the brands you already own.</p>
          <div className="buttons">
            <Link href="/shop" className="btn btn-accent btn-big">Shop the sets</Link>
            <Link href="#collections" className="btn btn-ghost btn-big">Browse collections</Link>
          </div>
        </div>
        <div className="hero-art">
          <Cube top="#F2B544" left="#1F8A84" right="#14294A" size={220} />
          <span className="tag">[Hero photo: hero set, built and lit]</span>
        </div>
      </section>

      <section className="wrap section">
        <div className="trust">
          <div><strong>Fits major brands</strong><span>Mix with bricks you own</span></div>
          <div><strong>Free UK delivery</strong><span>On orders over [£X]</span></div>
          <div><strong>Safety tested</strong><span>UKCA / CE marked</span></div>
          <div><strong>[X]-day returns</strong><span>Unopened sets</span></div>
        </div>
      </section>

      <section className="wrap section" id="collections">
        <div className="section-head">
          <h2>Pick your world</h2>
          <Link href="/shop">All sets →</Link>
        </div>
        <div className="grid">
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="card coll">
              <div className="coll-art" style={{ background: c.colour }}>
                <Cube top="rgba(255,255,255,.85)" left="rgba(255,255,255,.45)" right="rgba(255,255,255,.22)" />
              </div>
              <div className="coll-body">
                <strong>{c.name}</strong>
                <span>{c.blurb}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>Bestsellers</h2>
          <Link href="/shop">Shop all sets →</Link>
        </div>
        <div className="grid">
          {best.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="band">
          <div>
            <h2 style={{ fontSize: "clamp(32px,5vw,44px)" }}>Shop by builder level</h2>
            <p>From a quick afternoon build to a weekend project.</p>
          </div>
          <div className="levels">
            <Link href="/shop?level=starter"><strong>Starter</strong>Under 500 pieces</Link>
            <Link href="/shop?level=builder"><strong>Builder</strong>500–1,500 pieces</Link>
            <Link href="/shop?level=master" className="hot"><strong>Master</strong>1,500+ pieces, display-worthy</Link>
          </div>
        </div>
      </section>
    </>
  );
}
