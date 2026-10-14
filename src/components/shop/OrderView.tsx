import { formatBDT } from "@/lib/pricing";
import type { Order } from "@/types/shop";
import { SummaryRows } from "./Cart";
import { SafeImage } from "./bits";

export function OrderView({ order }: { order: Order }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p><span className="text-muted-foreground">Order</span> <strong className="font-mono">{order.id}</strong></p>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">{order.status} (demo)</span>
      </div>
      <ul className="divide-y rounded-lg border bg-card px-4">
        {order.items.map((it, i) => (
          <li key={i} className="flex items-center gap-3 py-3 text-sm">
            <SafeImage src={it.image} alt="" width={56} height={56} className="size-14 rounded object-cover" />
            <div className="flex-1"><p className="font-semibold">{it.name}</p><p className="text-xs text-muted-foreground">{[it.size, it.color].filter(Boolean).join(" · ")} × {it.qty}</p></div>
            <p className="font-bold">{formatBDT(it.price * it.qty)}</p>
          </li>
        ))}
      </ul>
      <div className="rounded-lg border bg-card p-5"><SummaryRows t={order.totals} showDelivery /></div>
      <p className="text-sm text-muted-foreground">Delivering to {order.address.name}, {order.address.address}, {order.address.district} · {order.voucher ? `Voucher ${order.voucher}` : "No voucher"}</p>
    </div>
  );
}
