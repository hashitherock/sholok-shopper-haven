import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Check, RotateCcw, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryBySlug } from "@/data/categories";
import { productById, productsInCategory } from "@/data/products";
import { Crumbs, Price, SafeImage, Stars, WishlistButton, catImage } from "@/components/shop/bits";
import { ProductRail } from "@/components/shop/ProductCard";
import { QtyStepper } from "@/components/shop/Cart";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = productById(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [
    { title: `${loaderData.product.name} — Sholok` },
    { name: "description", content: loaderData.product.description.slice(0, 155) },
    { property: "og:title", content: loaderData.product.name },
    { property: "og:description", content: loaderData.product.description.slice(0, 155) },
    { property: "og:image", content: loaderData.product.images[0] },
    { name: "twitter:image", content: loaderData.product.images[0] },
  ] : [{ title: "Product unavailable — Sholok" }, { name: "robots", content: "noindex" }] }),
  notFoundComponent: () => (
    <div className="container-x py-24 text-center"><h1 className="text-3xl font-semibold">This product isn't available</h1>
      <p className="mt-2 text-muted-foreground">It may have been removed from the catalogue.</p>
      <Link to="/products" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground">Browse all products</Link></div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const { addToCart, addRecent } = useShop();
  const navigate = useNavigate();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState(p.sizes?.[0]);
  const [color, setColor] = useState(p.colors?.[0]);
  const [qty, setQty] = useState(1);
  const cat = categoryBySlug(p.category)!;
  const out = p.stock <= 0;

  useEffect(() => { addRecent(p.id); setImg(0); setQty(1); setSize(p.sizes?.[0]); setColor(p.colors?.[0]); }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const related = productsInCategory(p.category).filter((x) => x.id !== p.id);

  return (
    <div className="container-x py-8">
      <Crumbs items={[{ label: cat.name, to: "/category/$slug", params: { slug: cat.slug } }, { label: p.name }]} />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex gap-2 sm:flex-col" role="tablist" aria-label="Product images">
            {p.images.map((src, i) => (
              <button key={src} type="button" role="tab" aria-selected={img === i} aria-label={`Image ${i + 1}`} onClick={() => setImg(i)}
                className={cn("size-18 overflow-hidden rounded-md border-2 transition-colors sm:size-20", img === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}>
                <SafeImage src={src} fallback={catImage(p)} alt="" width={80} height={80} className="size-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-lg bg-sand">
            <SafeImage key={img} eager src={p.images[img] ?? ""} fallback={catImage(p)} alt={p.name} width={640} height={800} className="size-full animate-in fade-in object-cover" />
            <WishlistButton id={p.id} className="absolute right-3 top-3 size-11" />
          </div>
        </div>

        <div>
          <p className="eyebrow">{cat.name}</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{p.name}</h1>
          <Stars rating={p.rating} reviews={p.reviews} className="mt-3 text-sm" />
          <div className="mt-5"><Price p={p} size="lg" /></div>
          <p className={cn("mt-3 flex items-center gap-1.5 text-sm font-semibold", out ? "text-destructive" : p.stock <= 5 ? "text-coral" : "text-success")}>
            {out ? "Out of stock" : p.stock <= 5 ? `Low stock — only ${p.stock} left` : <><Check aria-hidden className="size-4" /> In stock</>}
          </p>

          {p.colors && (
            <fieldset className="mt-6"><legend className="mb-2 text-sm font-semibold">Colour: <span className="font-normal text-muted-foreground">{color}</span></legend>
              <div className="flex flex-wrap gap-2">{p.colors.map((c) => (
                <button key={c} type="button" aria-pressed={color === c} onClick={() => setColor(c)} className={cn("press rounded-full border px-4 py-1.5 text-sm", color === c ? "border-ink bg-ink text-ink-foreground" : "hover:bg-muted")}>{c}</button>
              ))}</div>
            </fieldset>
          )}
          {p.sizes && (
            <fieldset className="mt-5"><legend className="mb-2 text-sm font-semibold">Size: <span className="font-normal text-muted-foreground">{size}</span></legend>
              <div className="flex flex-wrap gap-2">{p.sizes.map((s) => (
                <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className={cn("press min-w-12 rounded-md border px-3 py-2 text-sm font-semibold", size === s ? "border-ink bg-ink text-ink-foreground" : "hover:bg-muted")}>{s}</button>
              ))}</div>
            </fieldset>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} max={Math.max(1, p.stock)} label={p.name} onChange={setQty} />
            <button type="button" disabled={out} onClick={() => addToCart(p.id, qty, { size, color })} className="press flex-1 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-ink-foreground hover:bg-primary disabled:opacity-50">Add to Cart</button>
            <button type="button" disabled={out} onClick={() => { addToCart(p.id, qty, { size, color, silent: true }); navigate({ to: "/checkout" }); }} className="press flex-1 rounded-full border border-ink px-6 py-3.5 text-sm font-semibold hover:bg-muted disabled:opacity-50">Buy Now</button>
          </div>

          <div className="mt-6 grid gap-3 rounded-lg border bg-card p-4 text-sm sm:grid-cols-2">
            <p className="flex gap-2"><Truck aria-hidden className="size-5 shrink-0 text-primary" /><span><strong>Delivery (demo):</strong> ৳60 inside Dhaka, ৳120 outside. Free standard delivery over ৳3,000.</span></p>
            <p className="flex gap-2"><RotateCcw aria-hidden className="size-5 shrink-0 text-primary" /><span><strong>Returns (illustrative):</strong> 7-day easy returns on unused items.</span></p>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">About this product</h2>
            <p className="text-muted-foreground">{p.description}</p>
            <ul className="space-y-1.5 text-sm">{p.features.map((f) => <li key={f} className="flex gap-2"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />{f}</li>)}</ul>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="mb-6 text-3xl font-semibold">More from {cat.name}</h2>
        <ProductRail products={related.slice(0, 5)} />
      </section>
    </div>
  );
}
