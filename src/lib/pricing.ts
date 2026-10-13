import { categoryBySlug } from "@/data/categories";
import { DELIVERY, VOUCHERS } from "@/data/site";
import type { CartItem, DeliveryMethod, Product, Totals, Voucher } from "@/types/shop";

export const formatBDT = (n: number) => `৳${Math.round(n).toLocaleString("en-IN")}`;

export const discountPct = (p: Pick<Product, "price" | "originalPrice">) =>
  p.originalPrice && p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

export type Line = { item: CartItem; product: Product };

export const subtotalOf = (lines: Line[]) => lines.reduce((s, l) => s + l.product.price * l.item.qty, 0);

export function validateVoucher(code: string, lines: Line[]): { ok: true; voucher: Voucher } | { ok: false; error: string } {
  const v = VOUCHERS.find((x) => x.code === code.trim().toUpperCase());
  if (!code.trim()) return { ok: false, error: "Enter a voucher code." };
  if (!v) return { ok: false, error: "This voucher code isn't valid." };
  const sub = subtotalOf(lines);
  if (sub < v.minOrder) return { ok: false, error: `Add ${formatBDT(v.minOrder - sub)} more to use ${v.code}.` };
  if (v.fashionOnly && voucherDiscount(v, lines) === 0) return { ok: false, error: `${v.code} applies to clothing & fashion items only.` };
  return { ok: true, voucher: v };
}

export function voucherDiscount(v: Voucher | undefined, lines: Line[]) {
  if (!v) return 0;
  const base = v.fashionOnly
    ? subtotalOf(lines.filter((l) => categoryBySlug(l.product.category)?.fashion))
    : subtotalOf(lines);
  if (base <= 0 || subtotalOf(lines) < v.minOrder) return 0;
  let d = v.type === "percent" ? Math.round((base * v.value) / 100) : v.value;
  if (v.maxDiscount) d = Math.min(d, v.maxDiscount);
  return Math.min(d, base);
}

export function deliveryFee(method: DeliveryMethod, division: string, discountedSubtotal: number) {
  if (method === "standard" && discountedSubtotal >= DELIVERY.freeAbove) return 0;
  const d = DELIVERY[method];
  return division === "Dhaka" ? d.insideDhaka : d.outsideDhaka;
}

export function computeTotals(lines: Line[], voucher?: Voucher, method?: DeliveryMethod, division = "Dhaka"): Totals {
  const subtotal = subtotalOf(lines);
  const discount = voucherDiscount(voucher, lines);
  const delivery = lines.length && method ? deliveryFee(method, division, subtotal - discount) : 0;
  return { subtotal, discount, delivery, total: Math.max(0, subtotal - discount + delivery) };
}
