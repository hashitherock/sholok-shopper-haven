import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Headphones, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import hero from "@/assets/hero.jpg";
import promo from "@/assets/promo.jpg";
import lifeHome from "@/assets/life-home.jpg";
import lifeActive from "@/assets/life-active.jpg";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS, productById } from "@/data/products";
import { ProductRail } from "@/components/shop/ProductCard";
import { CountdownTimer } from "@/components/shop/Countdown";
import { NewsletterForm } from "@/components/layout/Footer";
import { Reveal, SafeImage } from "@/components/shop/bits";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sholok — Fresh finds, everyday essentials" },
      { name: "description", content: "A curated marketplace for Bangladesh: clothing, beauty, home, baby, pets, sports and more — priced in ৳ BDT." },
      { property: "og:title", content: "Sholok — Fresh finds, everyday essentials" },
      { property: "og:description", content: "Shop 13 curated categories with flash deals and vouchers on Sholok." },
    ],
  }),
  component: Home,
});

function SectionHead({ eyebrow, title, to, cta }: { eyebrow: string; title: string; to?: string; cta?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div><p className="eyebrow mb-2">{eyebrow}</p><h2 className="text-3xl font-semibold md:text-4xl">{title}</h2></div>
      {to && <Link to={to as "/"} className="group flex shrink-0 items-center gap-1 text-sm font-semibold hover:text-primary">{cta}<ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" /></Link>}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid items-center gap-8 py-10 md:grid-cols-[1.1fr_1fr] md:py-16 lg:gap-16">
        <div className="relative z-10">
          <p className="eyebrow animate-rise">The Autumn Edit · 2026</p>
          <h1 className="mt-4 animate-rise text-[2.6rem] font-medium leading-[1.02] [animation-delay:80ms] sm:text-6xl lg:text-7xl">
            Everything you love, <em className="sholok-arc font-semibold text-primary">curated</em> in one place.
          </h1>
          <p className="mt-6 max-w-md animate-rise text-base text-muted-foreground [animation-delay:160ms] md:text-lg">From hand-embroidered kurtis to kitchen favourites and footballs — thirteen categories, chosen with care for life in Bangladesh.</p>
          <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
            <Link to="/products" className="press inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-ink-foreground hover:bg-primary">Shop Now <ArrowRight aria-hidden className="size-4" /></Link>
            <a href="#categories" className="press inline-flex items-center rounded-full border border-ink px-7 py-3.5 text-sm font-semibold hover:bg-muted">Explore Categories</a>
          </div>
          <dl className="mt-10 flex animate-rise gap-8 [animation-delay:320ms]">
            {[["13", "categories"], [String(PRODUCTS.length), "curated items"], ["৳", "BDT pricing"]].map(([a, b]) => (
              <div key={b}><dt className="sr-only">{b}</dt><dd className="font-display text-3xl font-semibold">{a}</dd><dd className="text-xs text-muted-foreground">{b}</dd></div>
            ))}
          </dl>
        </div>
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div aria-hidden className="absolute -right-10 -top-10 size-56 animate-float rounded-full bg-accent" />
          <div aria-hidden className="absolute -bottom-6 -left-6 size-24 rounded-full border-2 border-coral" />
          <div className="relative aspect-[6/7] animate-rise overflow-hidden rounded-t-[12rem] rounded-b-lg [animation-delay:120ms]">
            <img src={hero} alt="Woman in a teal silk outfit holding a woven tote" width={1200} height={1408} className="size-full object-cover" />
          </div>
          <Link to="/category/$slug" params={{ slug: "womens-clothing" }} className="absolute -left-2 bottom-10 animate-rise rounded-lg bg-card p-4 shadow-lift [animation-delay:400ms] sm:-left-8">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-coral"><Sparkles aria-hidden className="size-3.5" />New in</span>
            <span className="mt-1 block font-display text-lg italic">Women's festive edit</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section id="categories" className="container-x scroll-mt-32 py-14">
      <SectionHead eyebrow="Shop by category" title="Thirteen worlds to explore" to="/products" cta="All products" />
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-7 lg:gap-4">
        {CATEGORIES.map((c, i) => (
          <li key={c.slug} className={i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}>
            <Reveal delay={i * 40} className="h-full">
              <Link to="/category/$slug" params={{ slug: c.slug }} className="group flex h-full w-28 shrink-0 snap-start flex-col sm:w-auto">
                <div className="relative aspect-square flex-1 overflow-hidden rounded-lg bg-sand">
                  <SafeImage src={c.image} alt="" width={400} height={400} className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
                </div>
                <span className="mt-2 text-sm font-semibold leading-tight group-hover:text-primary">{c.name}</span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FlashSale() {
  const items = PRODUCTS.filter((p) => p.flash).slice(0, 5);
  return (
    <section className="bg-secondary py-14">
      <div className="container-x">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div><p className="eyebrow mb-2 text-coral">Ends tonight</p><h2 className="text-3xl font-semibold md:text-4xl">Flash Sale</h2></div>
          <CountdownTimer />
          <Link to="/flash-sale" className="flex items-center gap-1 text-sm font-semibold hover:text-primary">View All Deals <ArrowRight aria-hidden className="size-4" /></Link>
        </div>
        <ProductRail products={items} />
      </div>
    </section>
  );
}

function Recent() {
  const { recent, hydrated } = useShop();
  const items = recent.map(productById).filter((p): p is NonNullable<typeof p> => !!p).slice(0, 5);
  return (
    <section className="container-x py-14">
      <SectionHead eyebrow="Your trail" title="Recently viewed" />
      {hydrated && items.length === 0 ? (
        <div className="flex items-center gap-4 rounded-lg border border-dashed p-6 text-sm text-muted-foreground"><Clock aria-hidden className="size-5 shrink-0" />Products you view will appear here, so you can pick up where you left off.</div>
      ) : <ProductRail products={items} />}
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FlashSale />
      <section className="container-x py-14">
        <SectionHead eyebrow="Right now" title="Trending on Sholok" to="/products" cta="Shop all" />
        <ProductRail products={PRODUCTS.filter((p) => p.trending).slice(0, 5)} />
      </section>
      <section className="container-x py-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg bg-ink text-ink-foreground">
            <img src={promo} alt="" loading="lazy" width={1600} height={912} className="absolute inset-0 size-full object-cover opacity-50" />
            <div className="relative max-w-lg p-8 md:p-14">
              <p className="eyebrow">Seasonal campaign</p>
              <h2 className="mt-3 text-4xl font-medium italic md:text-5xl">The Slow Sunday Collection</h2>
              <p className="mt-4 opacity-85">Self-care, soft layers and small luxuries for unhurried weekends. Use <strong>SHOLOK10</strong> for 10% off (demo voucher).</p>
              <Link to="/deals" className="press mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-coral">See the offers <ArrowRight aria-hidden className="size-4" /></Link>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="container-x py-14">
        <SectionHead eyebrow="Shop by lifestyle" title="Find your rhythm" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { img: lifeHome, t: "The Homebody", d: "Kitchen, cleaning & cosy pet corners", slug: "home-kitchen" as const },
            { img: hero, t: "The Style Seeker", d: "Clothing & finishing accessories", slug: "fashion-lifestyle" as const },
            { img: lifeActive, t: "The Weekend Mover", d: "Sports, wellness & the road ahead", slug: "toys-sports" as const },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 100}>
              <Link to="/category/$slug" params={{ slug: x.slug }} className="group relative block aspect-[4/5] overflow-hidden rounded-lg">
                <img src={x.img} alt="" loading="lazy" width={900} height={1100} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-3 bottom-3 rounded-md bg-card/95 p-4 backdrop-blur">
                  <h3 className="text-xl font-semibold">{x.t}</h3>
                  <p className="text-sm text-muted-foreground">{x.d}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="container-x py-14">
        <SectionHead eyebrow="Most loved" title="Best sellers" to="/products" cta="Shop all" />
        <ProductRail products={PRODUCTS.filter((p) => p.bestSeller).slice(0, 10)} />
      </section>
      <Recent />
      <section className="container-x py-10">
        <h2 className="sr-only">Why shop with Sholok</h2>
        <ul className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            [ShoppingBag, "Convenient shopping", "13 categories, one bag."],
            [ShieldCheck, "Secure-looking checkout", "A clear, demo checkout flow."],
            [Headphones, "Responsive support", "Illustrative help centre & FAQ."],
            [Sparkles, "Easy cart management", "Saved in your browser."],
          ].map(([I, t, d], i) => {
            const Icon = I as typeof ShoppingBag;
            return (
              <li key={t as string} className="group relative bg-card p-6 transition-colors hover:bg-accent">
                <span aria-hidden className="absolute right-5 top-4 font-display text-4xl italic text-sand transition-colors group-hover:text-primary/30">0{i + 1}</span>
                <Icon aria-hidden className="size-6 text-primary" />
                <p className="mt-4 font-display text-lg font-semibold">{t as string}</p>
                <p className="text-sm text-muted-foreground">{d as string}</p>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="container-x pt-10">
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg bg-ink p-8 text-ink-foreground md:flex-row md:items-center md:p-12">
          <div><h2 className="text-3xl font-medium italic md:text-4xl">Letters from Sholok</h2><p className="mt-2 opacity-75">New arrivals and quiet deals, once a week.</p></div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
