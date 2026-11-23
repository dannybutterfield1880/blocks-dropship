import Link from "next/link";
import ClearBasket from "./ClearBasket";

export const metadata = { title: "Order confirmed — blocks" };

export default function Success() {
  return (
    <section className="wrap prose">
      <ClearBasket />
      <h1>Thanks — your order's in!</h1>
      <p>We've emailed your receipt. Your sets are on their way to being packed, and we'll send tracking as soon as they ship.</p>
      <p>Usual delivery time: [X–Y working days].</p>
      <Link href="/shop" className="btn btn-accent btn-big">Keep browsing</Link>
    </section>
  );
}
