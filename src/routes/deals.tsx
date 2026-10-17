import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS } from "@/data/products";
import { VOUCHERS } from "@/data/site";
import { CATEGORIES } from "@/data/categories";
import { discountPct } from "@/lib/pricing";
import { ProductGrid } from "@/components/shop/ProductCard";
import { PageHero, Reveal, SafeImage } from "@/components/shop/bits";

export const Route = createFileRoute("/deals")({
  head: () => ({ meta: [
    { title: "Deals & Offers — Sholok" },
    { name: "description", content: "Vouchers, category deals and discounted picks on Sholok." },
    { property: "og:title", content: "Deals & Offers — Sholok" },
    { property: "og:description", content: "Vouchers and category deals on Sholok." },
  ] }),
  component: Deals,
});

function Deals() {
  const top = CATEGORIES.map((c) => ({ c, best: Math.max(0, ...PRODUCTS.filter((p) => p.category === c.slug).map(discountPct)) })).filter((x) => x.best > 0).slice(0, 6);
  return (
    <>
      <PageHero eyebrow="Save more" title="Deals & Offers" text="Illustrative vouchers and our best category deals. Voucher codes are demo-only." crumbs={[{ label: "Deals & Offers" }]} />
      <div className="container-x space-y-16 py-10">
        <section>
          <h2 className="mb-6 text-3xl font-semibold">Vouchers</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {VOUCHERS.map((v) => (
              <li key={v.code} className="relative overflow-hidden rounded-lg border-2 border-dashed border-primary bg-accent p-6">
                <p className="font-mono text-2xl font-bold tracking-wider text-accent-foreground">{v.code}</p>
                <p className="mt-2 text-sm">{v.label}</p>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(v.code).catch(() => {}); toast.success(`${v.code} copied`); }} className="press mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-ink-foreground"><Copy aria-hidden className="size-3.5" />Copy code</button>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-6 text-3xl font-semibold">Category deals</h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {top.map(({ c, best }, i) => (
              <li key={c.slug}><Reveal delay={i * 60}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="group relative block aspect-[4/3] overflow-hidden rounded-lg">
                  <SafeImage src={c.image} alt="" width={640} height={480} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/80 to-transparent p-4 text-ink-foreground">
                    <span className="text-xs font-bold uppercase tracking-widest text-coral">Up to {best}% off</span>
                    <span className="font-display text-xl">{c.name}</span>
                  </div>
                </Link>
              </Reveal></li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-6 text-3xl font-semibold">Biggest discounts</h2>
          <ProductGrid products={[...PRODUCTS].sort((a, b) => discountPct(b) - discountPct(a)).slice(0, 8)} />
        </section>
      </div>
    </>
  );
}
