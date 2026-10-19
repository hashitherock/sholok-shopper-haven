import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { computeTotals, formatBDT, validateVoucher, type Line } from "@/lib/pricing";
import { useShop } from "@/store/shop";
import type { Totals } from "@/types/shop";
import { EmptyState, SafeImage, catImage } from "./bits";
import { VOUCHERS } from "@/data/site";

export function QtyStepper({ value, max, onChange, label }: { value: number; max: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex items-center rounded-full border bg-card" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)} className="press grid size-10 place-items-center rounded-full hover:bg-muted disabled:opacity-40"><Minus aria-hidden className="size-3.5" /></button>
      <span aria-live="polite" className="w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)} className="press grid size-10 place-items-center rounded-full hover:bg-muted disabled:opacity-40"><Plus aria-hidden className="size-3.5" /></button>
    </div>
  );
}

export function CartItemRow({ line, compact, onNavigate }: { line: Line; compact?: boolean; onNavigate?: () => void }) {
  const { setQty, removeItem } = useShop();
  const { item, product: p } = line;
  return (
    <li className="flex gap-3 py-4 animate-in fade-in">
      <Link to="/product/$id" params={{ id: p.id }} onClick={onNavigate} className="shrink-0">
        <SafeImage src={p.images[0] ?? ""} fallback={catImage(p)} alt={p.name} width={96} height={120} className={compact ? "h-24 w-20 rounded-md object-cover" : "h-32 w-26 rounded-md object-cover"} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <Link to="/product/$id" params={{ id: p.id }} onClick={onNavigate} className="line-clamp-2 text-sm font-semibold hover:text-primary">{p.name}</Link>
          <button type="button" aria-label={`Remove ${p.name}`} onClick={() => removeItem(item.key)} className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 aria-hidden className="size-4" /></button>
        </div>
        <p className="text-xs text-muted-foreground">{[item.size && `Size ${item.size}`, item.color].filter(Boolean).join(" · ") || "Standard"}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <QtyStepper value={item.qty} max={p.stock} label={p.name} onChange={(n) => setQty(item.key, n)} />
          <div className="text-right">
            <p className="text-sm font-bold">{formatBDT(p.price * item.qty)}</p>
            {item.qty >= p.stock && <p className="text-[0.7rem] text-coral">Max stock reached</p>}
          </div>
        </div>
      </div>
    </li>
  );
}

export function VoucherForm() {
  const { lines, voucher, applyVoucher } = useShop();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  if (voucher) {
    return (
      <div className="flex items-center justify-between rounded-md border border-dashed border-primary bg-accent px-3 py-2 text-sm">
        <span className="flex items-center gap-2 text-accent-foreground"><Tag aria-hidden className="size-4" /><strong>{voucher.code}</strong> applied</span>
        <button type="button" aria-label="Remove voucher" onClick={() => applyVoucher(undefined)} className="grid size-7 place-items-center rounded-full hover:bg-card"><X aria-hidden className="size-4" /></button>
      </div>
    );
  }
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); const r = validateVoucher(code, lines); if (r.ok) { applyVoucher(r.voucher); setErr(""); setCode(""); } else setErr(r.error); }}>
      <label htmlFor="voucher" className="mb-1 block text-xs font-semibold text-muted-foreground">Voucher code</label>
      <div className="flex gap-2">
        <input id="voucher" value={code} onChange={(e) => setCode(e.target.value)} aria-invalid={!!err} aria-describedby="voucher-msg" placeholder="e.g. SHOLOK10"
          className="h-10 min-w-0 flex-1 rounded-md border border-input bg-card px-3 text-sm uppercase" />
        <button className="press rounded-md border border-ink px-4 text-sm font-semibold hover:bg-ink hover:text-ink-foreground">Apply</button>
      </div>
      <p id="voucher-msg" role="status" className="mt-1 min-h-4 text-xs text-destructive">{err}</p>
      <p className="text-[0.7rem] text-muted-foreground">Demo codes: {VOUCHERS.map((v) => v.code).join(", ")}</p>
    </form>
  );
}

export function SummaryRows({ t, showDelivery }: { t: Totals; showDelivery?: boolean }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-semibold">{formatBDT(t.subtotal)}</dd></div>
      {t.discount > 0 && <div className="flex justify-between text-success"><dt>Voucher discount</dt><dd className="font-semibold">−{formatBDT(t.discount)}</dd></div>}
      <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="font-semibold">{showDelivery ? (t.delivery ? formatBDT(t.delivery) : "Free") : "Calculated at checkout"}</dd></div>
      <div className="flex justify-between border-t pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-bold">{formatBDT(t.total)}</dd></div>
    </dl>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, voucher, cartCount } = useShop();
  const t = computeTotals(lines, voucher);
  const close = () => setCartOpen(false);
  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5 text-left">
          <SheetTitle className="font-display text-2xl">Your bag</SheetTitle>
          <SheetDescription>{cartCount} {cartCount === 1 ? "item" : "items"}</SheetDescription>
        </SheetHeader>
        {lines.length === 0 ? (
          <div className="flex-1 px-5"><EmptyState icon={<ShoppingBag className="size-7" />} title="Your bag is empty" text="Discover fresh finds across 13 categories."
            action={<Link to="/products" onClick={close} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground hover:bg-primary">Start shopping</Link>} /></div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-5">{lines.map((l) => <CartItemRow key={l.item.key} line={l} compact onNavigate={close} />)}</ul>
            <div className="space-y-4 border-t bg-card p-5">
              <SummaryRows t={t} />
              <div className="grid grid-cols-2 gap-2">
                <Link to="/cart" onClick={close} className="press rounded-full border border-ink py-3 text-center text-sm font-semibold hover:bg-muted">View cart</Link>
                <Link to="/checkout" onClick={close} className="press rounded-full bg-ink py-3 text-center text-sm font-semibold text-ink-foreground hover:bg-primary">Checkout</Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
