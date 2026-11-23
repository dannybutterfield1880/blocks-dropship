import Link from "next/link";
import Logo from "./Logo";
import { settings, tradingAs } from "@/lib/settings";

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
          <Link href="/info/returns">Returns &amp; refunds</Link>
          <Link href="/info/contact">Contact us</Link>
        </div>
        <div className="footer-col">
          <strong>Legal</strong>
          <Link href="/info/terms">Terms of sale</Link>
          <Link href="/info/privacy">Privacy &amp; cookies</Link>
          <span>Not suitable for children under 3. Small parts.</span>
        </div>
      </div>
      <div className="wrap footer-legal">
        © {new Date().getFullYear()} {tradingAs()}
        {settings.companyNumber ? ` · Company no. ${settings.companyNumber}` : ""}
        {settings.vatNumber ? ` · VAT no. ${settings.vatNumber}` : ""}
        {" · "}Compatible with major brick brands. Not affiliated with or endorsed by any other toy brand.
      </div>
    </footer>
  );
}
