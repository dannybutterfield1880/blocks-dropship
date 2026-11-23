import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Logo dark size={30} />
          <p>Building sets for every kind of builder.</p>
        </div>
        <div className="footer-col">
          <strong>Shop</strong>
          <Link href="/shop">All sets</Link>
          <Link href="/#collections">Collections</Link>
        </div>
        <div className="footer-col">
          <strong>Help</strong>
          <Link href="/info/delivery">Delivery</Link>
          <Link href="/info/returns">Returns</Link>
          <Link href="/info/contact">Contact us</Link>
        </div>
        <div className="footer-col">
          <strong>Safety</strong>
          <span>Not suitable for children under 3. Small parts.</span>
        </div>
      </div>
    </footer>
  );
}
