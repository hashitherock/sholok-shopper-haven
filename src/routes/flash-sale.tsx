import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/products";
import { Catalog } from "@/components/shop/Catalog";
import { CountdownTimer, useCountdown } from "@/components/shop/Countdown";
import { Crumbs } from "@/components/shop/bits";

export const Route = createFileRoute("/flash-sale")({
  head: () => ({ meta: [
    { title: "Flash Sale — Sholok" },
    { name: "description", content: "Today's limited-time Sholok flash deals across all categories." },
    { property: "og:title", content: "Flash Sale — Sholok" },
    { property: "og:description", content: "Limited-time deals, ending tonight." },
  ] }),
  component: FlashPage,
});

function FlashPage() {
  const left = useCountdown();
  return (
    <>
      <div className="bg-ink text-ink-foreground">
        <div className="container-x py-12">
          <div className="[&_a]:text-ink-foreground [&_span]:text-ink-foreground"><Crumbs items={[{ label: "Flash Sale" }]} /></div>
          <p className="eyebrow text-coral">Today only</p>
          <h1 className="mt-2 text-5xl font-medium italic md:text-6xl">Flash Sale</h1>
          <p className="mt-3 max-w-lg opacity-80">Limited-time prices on selected products. The timer resets at midnight.</p>
          <div className="mt-6"><CountdownTimer tone="light" /></div>
        </div>
      </div>
      {left === 0 ? <p className="container-x py-16 text-center text-muted-foreground">This sale has ended. Check out our Deals & Offers page in the meantime.</p>
        : <Catalog products={PRODUCTS.filter((p) => p.flash)} />}
    </>
  );
}
