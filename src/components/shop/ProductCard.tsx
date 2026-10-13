import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { categoryName } from "@/data/categories";
import { discountPct } from "@/lib/pricing";
import { useShop } from "@/store/shop";
import type { Product } from "@/types/shop";
import { Price, SafeImage, Stars, WishlistButton, catImage } from "./bits";
import { cn } from "@/lib/utils";

export function ProductCard({ p, className }: { p: Product; className?: string }) {
  const { addToCart } = useShop();
  const d = discountPct(p);
  const out = p.stock <= 0;
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-sand">
        <Link to="/product/$id" params={{ id: p.id }} aria-label={p.name} className="block size-full">
          <SafeImage src={p.images[0]} fallback={catImage(p)} alt={p.name} width={640} height={800}
            className={cn("size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]", out && "opacity-60 grayscale")} />
        </Link>
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {d > 0 && <span className="rounded-sm bg-coral px-2 py-0.5 text-xs font-bold text-coral-foreground">−{d}%</span>}
          {out ? <span className="rounded-sm bg-ink px-2 py-0.5 text-xs font-semibold text-ink-foreground">Out of stock</span>
            : p.stock <= 5 && <span className="rounded-sm bg-card px-2 py-0.5 text-xs font-semibold text-ink">Only {p.stock} left</span>}
        </div>
        <WishlistButton id={p.id} className="absolute right-2.5 top-2.5" />
        <button type="button" disabled={out} onClick={() => addToCart(p.id)} aria-label={`Add ${p.name} to cart`}
          className="press absolute inset-x-2.5 bottom-2.5 flex items-center justify-center gap-2 rounded-md bg-ink py-2.5 text-sm font-semibold text-ink-foreground transition-all duration-300 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <ShoppingBag aria-hidden className="size-4" /> {out ? "Sold out" : "Quick add"}
        </button>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">{categoryName(p.category)}</p>
        <h3 className="font-sans text-sm font-semibold leading-snug tracking-normal">
          <Link to="/product/$id" params={{ id: p.id }} className="line-clamp-2 hover:text-primary">{p.name}</Link>
        </h3>
        <Stars rating={p.rating} />
        <Price p={p} />
        {p.colors && p.colors.length > 1 && <p className="text-xs text-muted-foreground">{p.colors.length} colours</p>}
      </div>
    </article>
  );
}

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4", className)}>
      {products.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}

export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
      {products.map((p) => <ProductCard key={p.id} p={p} className="w-[46vw] shrink-0 snap-start sm:w-auto" />)}
    </div>
  );
}
