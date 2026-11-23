"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useBasket } from "@/lib/basket";

export default function Header() {
  const { count } = useBasket();
  return (
    <>
      <div className="announce">
        <span>Free UK delivery over [£X]</span>
        <span>Fits all major brick brands</span>
        <span>Safety tested to UKCA / CE</span>
      </div>
      <header className="header wrap">
        <Link href="/" aria-label="blocks home" className="plain">
          <Logo />
        </Link>
        <nav aria-label="Main" className="nav">
          <Link href="/shop">Shop all</Link>
          <Link href="/#collections">Collections</Link>
          <Link href="/shop">New in</Link>
        </nav>
        <Link href="/basket" className="btn btn-dark">
          Basket ({count})
        </Link>
      </header>
    </>
  );
}
