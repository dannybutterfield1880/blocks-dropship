"use client";

import { useEffect } from "react";
import { useBasket } from "@/lib/basket";

export default function ClearBasket() {
  const { clear, count } = useBasket();
  useEffect(() => {
    if (count > 0) clear();
  }, [count, clear]);
  return null;
}
