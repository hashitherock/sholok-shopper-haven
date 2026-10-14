import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CartItemRow, SummaryRows, VoucherForm } from "@/components/shop/Cart";
import { EmptyState, PageHero } from "@/components/shop/bits";
import { computeTotals } from "@/lib/pricing";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [
    { title: "Shopping Cart — Sholok" },
    { name: "description", content: "Review the items in your Sholok cart." },
    { property: "og:title", content: "Shopping Cart — Sholok" },
    { property: "og:description", content: "Review your Sholok cart." },
  ] }),
  component: CartPage,
});

function CartPage() {
  const { lines, voucher, clearCart, hydrated } = useShop();
  const t = computeTotals(lines, voucher);
  return (
    <>
      <PageHero title="Shopping cart" crumbs={[{ label: "Cart" }]} />
      <div className="container-x py-10">
        {hydrated && lines.length === 0 ? (
          <EmptyState icon={<ShoppingBag className="size-7" />} title="Your cart is empty" text="Fill it with fresh finds from across Sholok."
            action={<Link to="/products" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground hover:bg-primary">Start shopping</Link>} />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="font-sans text-sm font-bold uppercase tracking-widest">{lines.length} products</h2>
                <AlertDialog>
                  <AlertDialogTrigger className="text-sm text-muted-foreground hover:text-destructive">Clear cart</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Clear your cart?</AlertDialogTitle><AlertDialogDescription>All items and any applied voucher will be removed.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Keep items</AlertDialogCancel><AlertDialogAction onClick={clearCart}>Clear cart</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <ul className="divide-y">{lines.map((l) => <CartItemRow key={l.item.key} line={l} />)}</ul>
            </div>
            <aside className="h-fit space-y-5 rounded-lg border bg-card p-6 lg:sticky lg:top-32">
              <h2 className="text-2xl font-semibold">Order summary</h2>
              <VoucherForm />
              <SummaryRows t={t} />
              <p className="text-xs text-muted-foreground">Vouchers apply to products only; delivery is charged separately.</p>
              <Link to="/checkout" className="press block rounded-full bg-ink py-3.5 text-center text-sm font-semibold text-ink-foreground hover:bg-primary">Proceed to checkout</Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
