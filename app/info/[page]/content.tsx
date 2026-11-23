import Link from "next/link";
import { settings as s, orTodo, sellerName, tradingAs } from "@/lib/settings";
import { formatPrice } from "@/lib/data";

// Template text for a small UK online shop. It's a sensible starting point, not legal advice —
// worth a quick check by someone qualified before trading at scale.

const freeLine = () =>
  s.freeDeliveryOver > 0 ? ` Orders over ${formatPrice(s.freeDeliveryOver)} get free delivery.` : "";
const returnsDays = () => Math.max(14, s.returnsDays || 14);

export function SellerBlock() {
  return (
    <div className="card" style={{ padding: 20, lineHeight: 1.6 }}>
      <strong>{tradingAs()}</strong>
      <div style={{ whiteSpace: "pre-line" }}>{orTodo(s.address)}</div>
      <div>Email: {s.email ? <a href={`mailto:${s.email}`}>{s.email}</a> : orTodo("")}</div>
      {s.phone && <div>Phone: {s.phone}</div>}
      {s.companyNumber && <div>Company number: {s.companyNumber}</div>}
      {s.vatNumber && <div>VAT number: {s.vatNumber}</div>}
    </div>
  );
}

export const PAGES: Record<string, { title: string; body: () => React.ReactNode }> = {
  delivery: {
    title: "Delivery",
    body: () => (
      <>
        <p>We deliver to UK addresses only.</p>
        <ul>
          <li><strong>Cost:</strong> {formatPrice(s.deliveryFee)} per order.{freeLine()}</li>
          <li><strong>Dispatch:</strong> orders are usually dispatched within {s.dispatchTime}.</li>
          <li><strong>Delivery time:</strong> usually {s.deliveryTime} from dispatch.</li>
          <li><strong>Tracking:</strong> we email your tracking number as soon as your order ships.</li>
        </ul>
        <p>
          Some sets ship from our fulfilment partner's warehouse outside the UK, which is why delivery can take a little longer
          than from a UK shop.
        </p>
        <p>If your order hasn't arrived within the delivery time above, <Link href="/info/contact">get in touch</Link> and we'll sort it out.</p>
      </>
    ),
  },

  returns: {
    title: "Returns & refunds",
    body: () => (
      <>
        <h2>Changed your mind?</h2>
        <p>
          You can cancel your order for any reason within <strong>{returnsDays()} days</strong> of receiving it. Tell us by email at{" "}
          {orTodo(s.email)} with your order details, then send the item back within 14 days of telling us.
        </p>
        <ul>
          <li>Items should be unused, and ideally unopened in their original packaging. We may reduce your refund if an item has been handled more than needed to check it.</li>
          <li>
            {s.returnPostagePaidBy === "us"
              ? "We'll cover the cost of return postage."
              : "You pay for return postage, unless the item is faulty or wrong."}
          </li>
          <li>We'll refund the price you paid, including the standard delivery cost, within 14 days of receiving the item back (or proof you've sent it).</li>
          <li>Refunds go back to your original payment method.</li>
        </ul>

        <h2>Faulty, damaged or missing pieces?</h2>
        <p>
          Your statutory rights aren't affected. If a set arrives damaged, faulty or with pieces missing, email us with your order details and a photo
          within 30 days of delivery and we'll replace the set, send the missing pieces, or give you a full refund — and we'll cover any return postage.
        </p>
        <p>Where to send returns: we'll give you the return address when you contact us, as it depends on the item.</p>
      </>
    ),
  },

  terms: {
    title: "Terms of sale",
    body: () => (
      <>
        <h2>1. Who we are</h2>
        <p>
          This shop is run by {sellerName()}
          {s.legalName && s.legalName.toLowerCase() !== s.shopName.toLowerCase() ? `, trading as ${s.shopName}` : ""}. Our details are at the bottom of this page.
        </p>

        <h2>2. Your order</h2>
        <p>
          When you pay, you're making an offer to buy. We accept it when we send your order confirmation email, which is when the contract between
          us is formed. If we can't fulfil your order (for example a set is out of stock), we'll tell you and refund you in full.
        </p>

        <h2>3. Prices and payment</h2>
        <p>
          Prices are in pounds sterling and {s.vatNumber ? "include VAT" : "are the total you pay — we are not VAT registered"}. Delivery is shown before you pay.
          Payments are processed securely by Stripe; we never see or store your card details.
        </p>

        <h2>4. Delivery</h2>
        <p>See our <Link href="/info/delivery">delivery page</Link>. Items are your responsibility once they're delivered to the address you gave us.</p>

        <h2>5. Cancelling and returns</h2>
        <p>
          You have the right to cancel within {returnsDays()} days of receiving your order, under the Consumer Contracts Regulations 2013. See{" "}
          <Link href="/info/returns">returns &amp; refunds</Link> for how.
        </p>

        <h2>6. Faulty goods</h2>
        <p>
          Your rights under the Consumer Rights Act 2015 aren't affected. Goods must be as described, of satisfactory quality and fit for purpose. If
          they're not, you're entitled to a repair, replacement or refund.
        </p>

        <h2>7. Product safety</h2>
        <p>
          Our sets contain small parts and are <strong>not suitable for children under 3</strong>. Please follow the age guidance on each product.
          Sets are compatible with most major brick brands; fit can vary slightly between brands. We aren't affiliated with or endorsed by any
          other toy brand.
        </p>

        <h2>8. Our liability</h2>
        <p>
          We're responsible for loss or damage you suffer that's a foreseeable result of us breaking these terms. We're not responsible for losses
          that weren't foreseeable, or for business losses. Nothing here limits liability where it would be unlawful to do so, including for death
          or personal injury caused by our negligence.
        </p>

        <h2>9. Law</h2>
        <p>These terms are governed by the law of England and Wales. You can bring proceedings in the courts of the part of the UK where you live.</p>

        <h2>Contact</h2>
        <SellerBlock />
      </>
    ),
  },

  privacy: {
    title: "Privacy policy",
    body: () => (
      <>
        <p>
          {tradingAs()} is the data controller for personal information collected through this website. Questions? Email {orTodo(s.email)}.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li><strong>When you order:</strong> your name, email, delivery address and phone number.</li>
          <li><strong>Payments:</strong> handled entirely by Stripe — we don't receive your card details.</li>
          <li><strong>Your basket:</strong> stored only on your own device until you check out.</li>
        </ul>

        <h2>Why we use it</h2>
        <p>
          To take payment, deliver your order, send order and tracking emails, and handle returns. Our legal basis is that it's necessary to carry out
          our contract with you. We also keep order records to meet tax and accounting rules. We don't send marketing emails unless you've asked us to.
        </p>

        <h2>Who we share it with</h2>
        <ul>
          <li><strong>Stripe</strong> — payment processing.</li>
          <li><strong>CJ Dropshipping</strong> — our fulfilment partner, who packs and ships your order. They receive your name, address, phone and email, and may be based outside the UK (including China). We share only what's needed to deliver your order.</li>
          <li><strong>Resend</strong> — sends our order emails.</li>
          <li><strong>Vercel</strong> — hosts this website.</li>
        </ul>
        <p>Where data goes outside the UK, these providers use legally recognised safeguards such as standard contractual clauses.</p>

        <h2>How long we keep it</h2>
        <p>Order records are kept for 6 years for tax purposes, then deleted.</p>

        <h2>Cookies</h2>
        <p>
          We only use what's strictly necessary for the site to work: your basket (stored on your device) and, for staff, a login cookie. We don't use
          advertising or analytics cookies, so there's nothing to opt in to.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete the information we hold about you, or object to how we use it — just email us. If you're unhappy with
          how we've handled your data, you can complain to the Information Commissioner's Office at ico.org.uk.
        </p>

        <h2>Contact</h2>
        <SellerBlock />
      </>
    ),
  },

  contact: {
    title: "Contact us",
    body: () => (
      <>
        <p>Questions about an order, a missing piece, or which set to pick? We're happy to help — we aim to reply within 1–2 working days.</p>
        <SellerBlock />
        <p style={{ marginTop: 20 }}>
          Please include your order email so we can find your order quickly. See also <Link href="/info/delivery">delivery</Link> and{" "}
          <Link href="/info/returns">returns</Link>.
        </p>
      </>
    ),
  },
};
