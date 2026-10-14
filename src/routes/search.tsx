import { createFileRoute, Link } from "@tanstack/react-router";
import { searchProducts } from "@/lib/search";
import { Catalog } from "@/components/shop/Catalog";
import { PageHero } from "@/components/shop/bits";
import { CATEGORIES } from "@/data/categories";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({ meta: [
    { title: "Search — Sholok" },
    { name: "description", content: "Search Sholok products by name, category or keyword." },
    { property: "og:title", content: "Search — Sholok" },
    { property: "og:description", content: "Search the Sholok catalogue." },
  ] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const results = searchProducts(q);
  return (
    <>
      <PageHero eyebrow="Search results" title={q ? `“${q}”` : "Search"} text={`${results.length} matching products`} crumbs={[{ label: "Search" }]} />
      {results.length === 0 ? (
        <div className="container-x py-12 text-center">
          <h2 className="text-2xl font-semibold">Nothing found for “{q}”</h2>
          <p className="mt-2 text-muted-foreground">Try a broader word, or jump into a category:</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.slice(0, 8).map((c) => <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="rounded-full border px-4 py-2 text-sm hover:bg-muted">{c.name}</Link>)}
          </div>
        </div>
      ) : <Catalog key={q} products={results} searchMode />}
    </>
  );
}
