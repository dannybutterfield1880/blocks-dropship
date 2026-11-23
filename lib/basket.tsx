"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type BasketLine = { slug: string; qty: number };

type BasketCtx = {
  lines: BasketLine[];
  count: number;
  add: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<BasketCtx | null>(null);
const KEY = "blocks-basket";

export function BasketProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BasketLine[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setLines(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (next: BasketLine[]) => {
    setLines(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const add = (slug: string) => {
    const found = lines.find((l) => l.slug === slug);
    save(found ? lines.map((l) => (l.slug === slug ? { ...l, qty: l.qty + 1 } : l)) : [...lines, { slug, qty: 1 }]);
  };

  const setQty = (slug: string, qty: number) =>
    save(qty <= 0 ? lines.filter((l) => l.slug !== slug) : lines.map((l) => (l.slug === slug ? { ...l, qty } : l)));

  const clear = () => save([]);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  return <Ctx.Provider value={{ lines, count, add, setQty, clear }}>{children}</Ctx.Provider>;
}

export function useBasket() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBasket must be used inside BasketProvider");
  return ctx;
}
