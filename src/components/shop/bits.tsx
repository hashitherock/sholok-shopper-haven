import { Link } from "@tanstack/react-router";
import { ChevronRight, Heart, Star } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { discountPct, formatBDT } from "@/lib/pricing";
import { useShop } from "@/store/shop";
import type { Product } from "@/types/shop";
import { categoryBySlug } from "@/data/categories";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" aria-label="Sholok home" className={cn("group inline-flex items-baseline gap-0.5 font-display text-2xl font-semibold tracking-tight text-ink", className)}>
      <span className="italic">sholok</span>
      <span aria-hidden className="inline-block size-2 translate-y-[-0.1em] rounded-full bg-primary transition-transform group-hover:scale-150" />
    </Link>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setShown(true); io.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} data-shown={shown} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function SafeImage({ src, alt, className, fallback, eager, ...rest }: { src: string; alt: string; className?: string; fallback?: string | undefined; eager?: boolean; width?: number; height?: number }) {
  const [s, setS] = useState(src);
  const [failed, setFailed] = useState(false);
  useEffect(() => { setS(src); setFailed(false); }, [src]);
  if (failed) return <div role="img" aria-label={alt} className={cn("flex items-center justify-center bg-sand font-display text-3xl italic text-ink/40", className)}>sholok</div>;
  return (
    <img src={s} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={className} {...rest}
      onError={() => { if (fallback && s !== fallback) setS(fallback); else setFailed(true); }} />
  );
}

export function Stars({ rating, reviews, className }: { rating: number; reviews?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <Star aria-hidden className="size-3.5 fill-coral text-coral" />
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span>({reviews} demo reviews)</span>}
      <span className="sr-only">out of 5 stars</span>
    </div>
  );
}

export function Price({ p, size = "md" }: { p: Pick<Product, "price" | "originalPrice">; size?: "md" | "lg" }) {
  const d = discountPct(p);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn("font-bold text-ink", size === "lg" ? "text-3xl" : "text-base")}>{formatBDT(p.price)}</span>
      {d > 0 && <s className={cn("text-muted-foreground", size === "lg" ? "text-lg" : "text-sm")}><span className="sr-only">Was </span>{formatBDT(p.originalPrice!)}</s>}
      {d > 0 && size === "lg" && <span className="rounded-sm bg-coral/10 px-2 py-0.5 text-sm font-bold text-coral">Save {d}%</span>}
    </div>
  );
}

export function WishlistButton({ id, className }: { id: string; className?: string }) {
  const { isWished, toggleWishlist } = useShop();
  const on = isWished(id);
  const [pop, setPop] = useState(false);
  return (
    <button type="button" aria-pressed={on} aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(id); setPop(true); }}
      onAnimationEnd={() => setPop(false)}
      className={cn("press grid size-9 place-items-center rounded-full bg-card/95 text-ink shadow-soft backdrop-blur transition-colors hover:text-coral", className)}>
      <Heart aria-hidden className={cn("size-4.5", on && "fill-coral text-coral", pop && "animate-pop")} />
    </button>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="mb-5 grid size-16 place-items-center rounded-full bg-accent text-accent-foreground">{icon}</div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Crumbs({ items }: { items: { label: string; to?: string; params?: Record<string, string> }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        <li><Link to="/" className="hover:text-primary">Home</Link></li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight aria-hidden className="size-3.5" />
            {it.to ? <Link to={it.to as "/"} params={it.params as never} className="hover:text-primary">{it.label}</Link> : <span aria-current="page" className="text-foreground">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({ eyebrow, title, text, crumbs }: { eyebrow?: string | undefined; title: string; text?: string | undefined; crumbs: { label: string; to?: string; params?: Record<string, string> }[] }) {
  return (
    <div className="border-b bg-secondary/60">
      <div className="container-x py-8 md:py-12">
        <Crumbs items={crumbs} />
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="animate-rise text-3xl font-semibold md:text-5xl">{title}</h1>
        {text && <p className="mt-3 max-w-2xl text-muted-foreground">{text}</p>}
      </div>
    </div>
  );
}

export const catImage = (p: Product) => categoryBySlug(p.category)?.image;
