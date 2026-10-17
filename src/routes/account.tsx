import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useState } from "react";
import { OrderView } from "@/components/shop/OrderView";
import { EmptyState, PageHero } from "@/components/shop/bits";
import { formatBDT } from "@/lib/pricing";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [
    { title: "My Account (Demo) — Sholok" },
    { name: "description", content: "Demo profile and order history stored in your browser." },
    { property: "og:title", content: "My Account — Sholok" },
    { property: "og:description", content: "Sholok demo account and orders." },
  ] }),
  component: Account,
});

function Account() {
  const { orders, user, hydrated } = useShop();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <PageHero title={user ? `Hello, ${user.name}` : "Guest account"} text="Demo account — profile and orders are saved only in this browser." crumbs={[{ label: "Account" }]} />
      <div className="container-x max-w-4xl py-10">
        <h2 className="mb-4 text-2xl font-semibold">Order history</h2>
        {hydrated && orders.length === 0 ? (
          <EmptyState icon={<Package className="size-7" />} title="No orders yet" text="Demo orders you place will appear here."
            action={<Link to="/products" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground">Start shopping</Link>} />
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o.id} className="rounded-lg border bg-card">
                <button type="button" aria-expanded={open === o.id} onClick={() => setOpen(open === o.id ? null : o.id)} className="flex w-full flex-wrap items-center justify-between gap-2 p-4 text-left text-sm">
                  <span className="font-mono font-bold">{o.id}</span>
                  <span className="text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-GB")}</span>
                  <span>{o.items.reduce((s, i) => s + i.qty, 0)} items</span>
                  <span className="font-bold">{formatBDT(o.totals.total)}</span>
                </button>
                <div className={cn("border-t p-4", open !== o.id && "hidden")}><OrderView order={o} /></div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
