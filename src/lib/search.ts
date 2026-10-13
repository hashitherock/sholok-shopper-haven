import { categoryName } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/types/shop";

export function matches(p: Product, q: string) {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const hay = `${p.name} ${categoryName(p.category)} ${p.keywords.join(" ")}`.toLowerCase();
  return terms.every((t) => hay.includes(t));
}

export const searchProducts = (q: string) => PRODUCTS.filter((p) => matches(p, q));
