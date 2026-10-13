import { SlidersHorizontal, X, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CATEGORIES, categoryName } from "@/data/categories";
import { discountPct } from "@/lib/pricing";
import { matches } from "@/lib/search";
import type { CategorySlug, Product } from "@/types/shop";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProductGrid } from "./ProductCard";
import { EmptyState } from "./bits";
import { cn } from "@/lib/utils";

const SORTS = {
  recommended: "Recommended",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Highest Rated",
  newest: "Newest",
  discount: "Biggest Discount",
} as const;
type Sort = keyof typeof SORTS;

interface Filters { q: string; cats: CategorySlug[]; min: string; max: string; rating: number; inStock: boolean; onSale: boolean; sizes: string[]; colors: string[] }
const EMPTY: Filters = { q: "", cats: [], min: "", max: "", rating: 0, inStock: false, onSale: false, sizes: [], colors: [] };
const PAGE = 12;

export function applyFilters(list: Product[], f: Filters, sort: Sort) {
  const min = Number(f.min) || 0, max = Number(f.max) || Infinity;
  const out = list.filter((p) =>
    matches(p, f.q) && (!f.cats.length || f.cats.includes(p.category)) && p.price >= min && p.price <= max &&
    p.rating >= f.rating && (!f.inStock || p.stock > 0) && (!f.onSale || discountPct(p) > 0) &&
    (!f.sizes.length || p.sizes?.some((s) => f.sizes.includes(s))) && (!f.colors.length || p.colors?.some((c) => f.colors.includes(c))));
  const by: Record<Sort, (a: Product, b: Product) => number> = {
    recommended: (a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller) || b.rating - a.rating,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    newest: (a, b) => a.addedDaysAgo - b.addedDaysAgo,
    discount: (a, b) => discountPct(b) - discountPct(a),
  };
  return [...out].sort(by[sort]);
}

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

function Check({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-[var(--color-primary)]" />{label}
    </label>
  );
}

export function Catalog({ products, showCategoryFilter = true, initialQuery = "", searchMode }: { products: Product[]; showCategoryFilter?: boolean; initialQuery?: string; searchMode?: boolean }) {
  const [f, setF] = useState<Filters>({ ...EMPTY, q: initialQuery });
  const [sort, setSort] = useState<Sort>("recommended");
  const [shown, setShown] = useState(PAGE);
  const [panel, setPanel] = useState(false);
  const set = (patch: Partial<Filters>) => { setF((prev) => ({ ...prev, ...patch })); setShown(PAGE); };

  const sizes = useMemo(() => [...new Set(products.flatMap((p) => p.sizes ?? []))], [products]);
  const colors = useMemo(() => [...new Set(products.flatMap((p) => p.colors ?? []))].slice(0, 14), [products]);
  const cats = useMemo(() => CATEGORIES.filter((c) => products.some((p) => p.category === c.slug)), [products]);
  const result = useMemo(() => applyFilters(products, f, sort), [products, f, sort]);

  const chips: { label: string; clear: () => void }[] = [
    ...(f.q && !searchMode ? [{ label: `“${f.q}”`, clear: () => set({ q: "" }) }] : []),
    ...f.cats.map((c) => ({ label: categoryName(c), clear: () => set({ cats: f.cats.filter((x) => x !== c) }) })),
    ...(f.min || f.max ? [{ label: `৳${f.min || 0} – ${f.max ? `৳${f.max}` : "any"}`, clear: () => set({ min: "", max: "" }) }] : []),
    ...(f.rating ? [{ label: `${f.rating}★ & up`, clear: () => set({ rating: 0 }) }] : []),
    ...(f.inStock ? [{ label: "In stock", clear: () => set({ inStock: false }) }] : []),
    ...(f.onSale ? [{ label: "On sale", clear: () => set({ onSale: false }) }] : []),
    ...f.sizes.map((s) => ({ label: `Size ${s}`, clear: () => set({ sizes: f.sizes.filter((x) => x !== s) }) })),
    ...f.colors.map((c) => ({ label: c, clear: () => set({ colors: f.colors.filter((x) => x !== c) }) })),
  ];
  const clearAll = () => set({ ...EMPTY, q: searchMode ? f.q : "" });

  const panelBody = (
    <div className="space-y-6">
      {showCategoryFilter && cats.length > 1 && (
        <fieldset><legend className="mb-2 text-xs font-bold uppercase tracking-widest">Category</legend>
          {cats.map((c) => <Check key={c.slug} label={c.name} checked={f.cats.includes(c.slug)} onChange={() => set({ cats: toggle(f.cats, c.slug) })} />)}
        </fieldset>
      )}
      <fieldset><legend className="mb-2 text-xs font-bold uppercase tracking-widest">Price (৳)</legend>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="pmin">Minimum price</label>
          <input id="pmin" inputMode="numeric" value={f.min} onChange={(e) => set({ min: e.target.value.replace(/\D/g, "") })} placeholder="Min" className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm" />
          <span aria-hidden>–</span>
          <label className="sr-only" htmlFor="pmax">Maximum price</label>
          <input id="pmax" inputMode="numeric" value={f.max} onChange={(e) => set({ max: e.target.value.replace(/\D/g, "") })} placeholder="Max" className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm" />
        </div>
      </fieldset>
      <fieldset><legend className="mb-2 text-xs font-bold uppercase tracking-widest">Rating</legend>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5].map((r) => (
            <button key={r} type="button" aria-pressed={f.rating === r} onClick={() => set({ rating: r })}
              className={cn("rounded-full border px-3 py-1 text-sm", f.rating === r ? "border-ink bg-ink text-ink-foreground" : "hover:bg-muted")}>{r ? `${r}★ & up` : "Any"}</button>
          ))}
        </div>
      </fieldset>
      <fieldset><legend className="mb-2 text-xs font-bold uppercase tracking-widest">Availability & offers</legend>
        <Check label="In stock only" checked={f.inStock} onChange={() => set({ inStock: !f.inStock })} />
        <Check label="On sale" checked={f.onSale} onChange={() => set({ onSale: !f.onSale })} />
      </fieldset>
      {sizes.length > 0 && (
        <fieldset><legend className="mb-2 text-xs font-bold uppercase tracking-widest">Size</legend>
          <div className="flex flex-wrap gap-2">{sizes.map((s) => (
            <button key={s} type="button" aria-pressed={f.sizes.includes(s)} onClick={() => set({ sizes: toggle(f.sizes, s) })}
              className={cn("min-w-10 rounded-md border px-2 py-1 text-sm", f.sizes.includes(s) ? "border-ink bg-ink text-ink-foreground" : "hover:bg-muted")}>{s}</button>
          ))}</div>
        </fieldset>
      )}
      {colors.length > 0 && (
        <fieldset><legend className="mb-2 text-xs font-bold uppercase tracking-widest">Colour</legend>
          <div className="flex flex-wrap gap-2">{colors.map((c) => (
            <button key={c} type="button" aria-pressed={f.colors.includes(c)} onClick={() => set({ colors: toggle(f.colors, c) })}
              className={cn("rounded-full border px-3 py-1 text-xs", f.colors.includes(c) ? "border-ink bg-ink text-ink-foreground" : "hover:bg-muted")}>{c}</button>
          ))}</div>
        </fieldset>
      )}
      {chips.length > 0 && <button type="button" onClick={clearAll} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">Clear all filters</button>}
    </div>
  );

  return (
    <div className="container-x py-8">
      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside aria-label="Filters" className="hidden lg:block"><div className="sticky top-32">{panelBody}</div></aside>
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {!searchMode && (
              <div className="min-w-0 flex-1 basis-56">
                <label htmlFor="within" className="sr-only">Search within results</label>
                <input id="within" value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search within results…" className="h-10 w-full rounded-full border border-input bg-card px-4 text-sm" />
              </div>
            )}
            <button type="button" onClick={() => setPanel(true)} className="press flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold lg:hidden">
              <SlidersHorizontal aria-hidden className="size-4" /> Filters {chips.length > 0 && <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{chips.length}</span>}
            </button>
            <p className="text-sm text-muted-foreground" aria-live="polite"><strong className="text-foreground">{result.length}</strong> products</p>
            <label className="ml-auto flex items-center gap-2 text-sm">
              <span className="hidden sm:inline text-muted-foreground">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 rounded-full border border-input bg-card px-3 text-sm font-semibold">
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>
          {chips.length > 0 && (
            <ul className="mb-6 flex flex-wrap gap-2" aria-label="Active filters">
              {chips.map((c) => (
                <li key={c.label}><button type="button" onClick={c.clear} className="flex animate-in zoom-in-95 items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground hover:bg-sand">
                  {c.label} <X aria-label="remove" className="size-3" /></button></li>
              ))}
            </ul>
          )}
          {result.length === 0 ? (
            <EmptyState icon={<SearchX className="size-7" />} title="No products match" text="Try removing a filter or searching for something broader, like “bag”, “serum” or “football”."
              action={<div className="flex flex-wrap justify-center gap-2">
                {chips.length > 0 && <button type="button" onClick={clearAll} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ink-foreground">Clear filters</button>}
                <Link to="/products" className="rounded-full border px-5 py-2.5 text-sm font-semibold">Browse all products</Link>
              </div>} />
          ) : (
            <>
              <ProductGrid products={result.slice(0, shown)} />
              {shown < result.length && (
                <div className="mt-12 flex flex-col items-center gap-3">
                  <p className="text-sm text-muted-foreground">Showing {shown} of {result.length}</p>
                  <button type="button" onClick={() => setShown((s) => s + PAGE)} className="press rounded-full border border-ink px-8 py-3 text-sm font-semibold hover:bg-ink hover:text-ink-foreground">Load more</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Sheet open={panel} onOpenChange={setPanel}>
        <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto bg-background">
          <SheetHeader><SheetTitle className="font-display text-2xl">Filters</SheetTitle></SheetHeader>
          <div className="px-4 pb-6">{panelBody}
            <button type="button" onClick={() => setPanel(false)} className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-semibold text-ink-foreground">Show {result.length} products</button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
