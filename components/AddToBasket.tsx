"use client";

import { useState } from "react";
import { useBasket } from "@/lib/basket";

export default function AddToBasket({ slug, big = false }: { slug: string; big?: boolean }) {
  const { add } = useBasket();
  const [added, setAdded] = useState(false);
  return (
    <button
      className={big ? "btn btn-accent btn-big" : "btn btn-dark"}
      onClick={() => {
        add(slug);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "Added ✓" : "Add to basket"}
    </button>
  );
}
