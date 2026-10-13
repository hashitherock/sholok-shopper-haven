import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { VOUCHERS } from "@/data/site";
import { computeTotals, validateVoucher, type Line } from "./pricing";

const line = (id: string, qty: number): Line => ({ item: { key: id, productId: id, qty }, product: PRODUCTS.find((p) => p.id === id)! });
const v = (c: string) => VOUCHERS.find((x) => x.code === c)!;

describe("catalog", () => {
  it("has exactly 13 categories and no grocery", () => {
    expect(CATEGORIES).toHaveLength(13);
    expect(CATEGORIES.some((c) => /grocery/i.test(c.name))).toBe(false);
  });
  it("has at least 5 products per category and 65 overall", () => {
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(65);
    for (const c of CATEGORIES) expect(PRODUCTS.filter((p) => p.category === c.slug).length).toBeGreaterThanOrEqual(5);
  });
});

describe("vouchers", () => {
  const nonFashion = PRODUCTS.find((p) => p.category === "home-kitchen" && p.price === 1550)!; // ৳1,550 pan
  it("WELCOME150 needs ৳1,500 minimum", () => {
    const cheap = PRODUCTS.find((p) => p.price === 320)!;
    expect(validateVoucher("WELCOME150", [line(cheap.id, 1)]).ok).toBe(false);
    expect(computeTotals([line(nonFashion.id, 1)], v("WELCOME150")).discount).toBe(150);
  });
  it("SHOLOK10 is 10% capped at ৳500", () => {
    expect(computeTotals([line(nonFashion.id, 1)], v("SHOLOK10")).discount).toBe(155);
    expect(computeTotals([line(nonFashion.id, 10)], v("SHOLOK10")).discount).toBe(500);
  });
  it("STYLE15 only applies to fashion items", () => {
    expect(validateVoucher("STYLE15", [line(nonFashion.id, 1)]).ok).toBe(false);
  });
  it("delivery is not discounted and free standard delivery above ৳3,000", () => {
    const t = computeTotals([line(nonFashion.id, 1)], v("WELCOME150"), "standard", "Khulna");
    expect(t.delivery).toBe(120);
    expect(t.total).toBe(1550 - 150 + 120);
    expect(computeTotals([line(nonFashion.id, 2)], undefined, "standard", "Dhaka").delivery).toBe(0);
  });
});
