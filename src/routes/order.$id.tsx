import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, PackageSearch } from "lucide-react";
import { OrderView } from "@/components/shop/OrderView";
import { EmptyState } from "@/components/shop/bits";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/order/$id")({
  head: () => ({ meta: [
    { title: "Order Confirmed (Demo) — Sholok" },
    { name: "description", content: "Your Sholok demo order confirmation." },
    { property: "og:title", content: "Order confirmation — Sholok" },
    { property: "og:description", content: "Sholok demo order confirmation." },
    { name: "robots", content: "noindex" },
  ] }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { orders, hydrated } = useShop();
  const order = orders.find((o) => o.id === id);
  if (!hydrated) return <div className="container-x py-24" />;
  if (!order) return <div className="container-x"><EmptyState icon={<PackageSearch className="size-7" />} title="Order not found" text="This demo order isn't saved in this browser."
    action={<Link to="/account" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground">View order history</Link>} /></div>;
  return (
    <div className="container-x max-w-3xl py-12">
      <div className="mb-8 text-center animate-rise">
        <CheckCircle2 aria-hidden className="mx-auto size-14 text-primary" />
        <h1 className="mt-4 text-4xl font-semibold">Thank you, {order.address.name.split(" ")[0]}!</h1>
        <p role="status" className="mt-2 text-muted-foreground">Your demo order has been placed. This is a demonstration — nothing was sent to a merchant and no payment was taken.</p>
      </div>
      <OrderView order={order} />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/products" className="press rounded-full bg-ink px-7 py-3 text-sm font-semibold text-ink-foreground hover:bg-primary">Continue Shopping</Link>
        <Link to="/account" className="press rounded-full border px-7 py-3 text-sm font-semibold hover:bg-muted">Order history</Link>
      </div>
    </div>
  );
}
