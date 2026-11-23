import Link from "next/link";
import { logout } from "./actions";

export default function AdminNav({ active }: { active: "orders" | "products" }) {
  return (
    <div className="section-head">
      <h2>Admin</h2>
      <div className="buttons">
        <Link href="/admin" className={active === "orders" ? "btn btn-dark" : "btn btn-ghost"}>Orders</Link>
        <Link href="/admin/products" className={active === "products" ? "btn btn-dark" : "btn btn-ghost"}>Products</Link>
        <form action={logout}>
          <button className="btn btn-ghost">Log out</button>
        </form>
      </div>
    </div>
  );
}
