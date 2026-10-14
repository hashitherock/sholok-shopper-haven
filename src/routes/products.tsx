import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/products";
import { Catalog } from "@/components/shop/Catalog";
import { PageHero } from "@/components/shop/bits";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [
    { title: "All Products — Sholok" },
    { name: "description", content: "Browse every Sholok product across 13 categories with filters and sorting." },
    { property: "og:title", content: "All Products — Sholok" },
    { property: "og:description", content: "Browse every Sholok product across 13 categories." },
  ] }),
  component: () => (
    <>
      <PageHero eyebrow="The full catalogue" title="All products" text="Every piece in the Sholok edit, across all 13 categories." crumbs={[{ label: "All Products" }]} />
      <Catalog products={PRODUCTS} />
    </>
  ),
});
