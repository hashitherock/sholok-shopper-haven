import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { categoryBySlug } from "@/data/categories";
import { productsInCategory } from "@/data/products";
import { Catalog } from "@/components/shop/Catalog";
import { PageHero } from "@/components/shop/bits";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = categoryBySlug(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [
    { title: `${loaderData.category.name} — Sholok` },
    { name: "description", content: loaderData.category.description },
    { property: "og:title", content: `${loaderData.category.name} — Sholok` },
    { property: "og:description", content: loaderData.category.description },
  ] : [{ title: "Category not found — Sholok" }, { name: "robots", content: "noindex" }] }),
  notFoundComponent: () => (
    <div className="container-x py-24 text-center"><h1 className="text-3xl font-semibold">Category not found</h1>
      <Link to="/products" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground">Browse all products</Link></div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  return (
    <>
      <PageHero eyebrow="Category" title={category.name} text={category.description} crumbs={[{ label: "All Products", to: "/products" }, { label: category.name }]} />
      <Catalog key={category.slug} products={productsInCategory(category.slug)} showCategoryFilter={false} />
    </>
  );
}
