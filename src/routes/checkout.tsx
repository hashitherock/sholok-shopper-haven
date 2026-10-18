import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { DELIVERY, DIVISIONS } from "@/data/site";
import { computeTotals, formatBDT } from "@/lib/pricing";
import { isBDPhone, isEmail } from "@/lib/storage";
import { useShop } from "@/store/shop";
import type { Address, DeliveryMethod, Order, PaymentMethod } from "@/types/shop";
import { SummaryRows, VoucherForm } from "@/components/shop/Cart";
import { EmptyState, SafeImage, catImage } from "@/components/shop/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Checkout (Demo) — Sholok" },
    { name: "description", content: "A demonstration checkout for Sholok." },
    { property: "og:title", content: "Checkout — Sholok" },
    { property: "og:description", content: "Sholok demo checkout." },
    { name: "robots", content: "noindex" },
  ] }),
  component: Checkout,
});

const STEPS = ["Details", "Delivery", "Payment", "Review"];
const PAY: Record<PaymentMethod, { label: string; note: string }> = {
  cod: { label: "Cash on Delivery", note: "Pay when your order arrives (illustrative)." },
  online: { label: "Online Payment — Demo", note: "No card details are collected. Nothing is charged." },
  mobile: { label: "Mobile Banking — Demo", note: "No wallet number or PIN is collected. Nothing is charged." },
};

type Errors = Partial<Record<keyof Address, string>>;
const field = "h-11 w-full rounded-md border border-input bg-card px-3 text-sm aria-[invalid=true]:border-destructive";

function Checkout() {
  const { lines, voucher, placeOrder, hydrated } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Address>({ name: "", phone: "", email: "", division: "Dhaka", district: "Dhaka", address: "", notes: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const t = computeTotals(lines, voucher, delivery, a.division);

  if (hydrated && lines.length === 0) {
    return <div className="container-x"><EmptyState icon={<ShoppingBag className="size-7" />} title="Your cart is empty" text="Add something to your cart before checking out."
      action={<Link to="/products" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground">Browse products</Link>} /></div>;
  }

  const validate = () => {
    const e: Errors = {};
    if (a.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!isBDPhone(a.phone)) e.phone = "Enter a valid Bangladeshi mobile number, e.g. 01712345678.";
    if (a.email && !isEmail(a.email)) e.email = "Enter a valid email or leave it blank.";
    if (a.address.trim().length < 6) e.address = "Please enter your full street address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const next = () => { if (step === 0 && !validate()) return; setStep((s) => s + 1); window.scrollTo({ top: 0 }); };
  const set = (k: keyof Address, v: string) => setA((prev) => ({ ...prev, [k]: v, ...(k === "division" ? { district: DIVISIONS[v]?.[0] ?? "" } : {}) }));

  const place = () => {
    if (!validate()) { setStep(0); return; }
    const id = `SHK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const order: Order = {
      id, createdAt: new Date().toISOString(), address: a, delivery, payment, voucher: voucher?.code, totals: t, status: "Processing",
      items: lines.map(({ item, product }) => ({ productId: product.id, name: product.name, price: product.price, qty: item.qty, size: item.size, color: item.color, image: product.images[0] ?? "" })),
    };
    placeOrder(order);
    navigate({ to: "/order/$id", params: { id } });
  };

  const Err = ({ k }: { k: keyof Address }) => errors[k] ? <p id={`${k}-err`} className="mt-1 text-xs text-destructive">{errors[k]}</p> : null;

  return (
    <div className="container-x py-8">
      <p className="mb-2 rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground">This is a demonstration checkout. No order is sent to a merchant and no payment is taken.</p>
      <h1 className="mt-6 text-4xl font-semibold">Checkout</h1>
      <ol className="my-8 flex gap-2" aria-label="Checkout steps">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className="flex flex-1 flex-col gap-2">
            <div className={cn("h-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-border")} />
            <span className={cn("text-xs font-semibold sm:text-sm", i === step ? "text-foreground" : "text-muted-foreground")}>{i + 1}. {s}</span>
          </li>
        ))}
      </ol>
      <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
        <div key={step} className="animate-in fade-in slide-in-from-right-2">
          {step === 0 && (
            <form noValidate onSubmit={(e) => { e.preventDefault(); next(); }} className="grid gap-4 sm:grid-cols-2">
              <h2 className="text-2xl font-semibold sm:col-span-2">Contact & delivery details</h2>
              {([["name", "Full name", "text", "name"], ["phone", "Mobile number", "tel", "tel"], ["email", "Email (optional)", "email", "email"]] as const).map(([k, l, type, ac]) => (
                <div key={k} className={k === "email" ? "sm:col-span-2" : ""}>
                  <label htmlFor={k} className="mb-1 block text-sm font-semibold">{l}</label>
                  <input id={k} type={type} autoComplete={ac} value={a[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={!!errors[k]} aria-describedby={`${k}-err`} className={field} />
                  <Err k={k} />
                </div>
              ))}
              <div><label htmlFor="division" className="mb-1 block text-sm font-semibold">Division</label>
                <select id="division" value={a.division} onChange={(e) => set("division", e.target.value)} className={field}>{Object.keys(DIVISIONS).map((d) => <option key={d}>{d}</option>)}</select></div>
              <div><label htmlFor="district" className="mb-1 block text-sm font-semibold">District</label>
                <select id="district" value={a.district} onChange={(e) => set("district", e.target.value)} className={field}>{(DIVISIONS[a.division] ?? []).map((d) => <option key={d}>{d}</option>)}</select></div>
              <div className="sm:col-span-2"><label htmlFor="address" className="mb-1 block text-sm font-semibold">Address</label>
                <input id="address" autoComplete="street-address" value={a.address} onChange={(e) => set("address", e.target.value)} aria-invalid={!!errors.address} aria-describedby="address-err" placeholder="House, road, area" className={field} /><Err k="address" /></div>
              <div className="sm:col-span-2"><label htmlFor="notes" className="mb-1 block text-sm font-semibold">Delivery instructions (optional)</label>
                <textarea id="notes" value={a.notes} onChange={(e) => set("notes", e.target.value)} rows={3} className="w-full rounded-md border border-input bg-card p-3 text-sm" /></div>
              <button className="press rounded-full bg-ink py-3.5 text-sm font-semibold text-ink-foreground hover:bg-primary sm:col-span-2">Continue to delivery</button>
            </form>
          )}
          {step === 1 && (
            <fieldset className="space-y-3">
              <legend className="mb-4 font-display text-2xl font-semibold">Delivery method</legend>
              {(["standard", "express"] as const).map((m) => {
                const fee = computeTotals(lines, voucher, m, a.division).delivery;
                return (
                  <label key={m} className={cn("flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors", delivery === m ? "border-primary bg-accent" : "hover:bg-muted")}>
                    <input type="radio" name="delivery" checked={delivery === m} onChange={() => setDelivery(m)} className="size-4 accent-[var(--color-primary)]" />
                    <span className="flex-1"><span className="block font-semibold">{DELIVERY[m].label}</span><span className="text-sm text-muted-foreground">{DELIVERY[m].eta}</span></span>
                    <span className="font-bold">{fee ? formatBDT(fee) : "Free"}</span>
                  </label>
                );
              })}
              <p className="text-xs text-muted-foreground">Delivery options and charges are demonstrations. Inside Dhaka division is cheaper; standard delivery is free over {formatBDT(DELIVERY.freeAbove)} after discounts.</p>
            </fieldset>
          )}
          {step === 2 && (
            <fieldset className="space-y-3">
              <legend className="mb-4 font-display text-2xl font-semibold">Payment method</legend>
              {(Object.keys(PAY) as PaymentMethod[]).map((m) => (
                <label key={m} className={cn("flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors", payment === m ? "border-primary bg-accent" : "hover:bg-muted")}>
                  <input type="radio" name="payment" checked={payment === m} onChange={() => setPayment(m)} className="size-4 accent-[var(--color-primary)]" />
                  <span><span className="block font-semibold">{PAY[m].label}</span><span className="text-sm text-muted-foreground">{PAY[m].note}</span></span>
                </label>
              ))}
            </fieldset>
          )}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Review your order</h2>
              <div className="grid gap-4 rounded-lg border bg-card p-5 text-sm sm:grid-cols-3">
                <div><p className="font-semibold">Deliver to</p><p className="text-muted-foreground">{a.name}<br />{a.phone}<br />{a.address}, {a.district}, {a.division}</p></div>
                <div><p className="font-semibold">Delivery</p><p className="text-muted-foreground">{DELIVERY[delivery].label}<br />{DELIVERY[delivery].eta}</p></div>
                <div><p className="font-semibold">Payment</p><p className="text-muted-foreground">{PAY[payment].label}</p></div>
              </div>
              <ul className="divide-y rounded-lg border bg-card px-4">
                {lines.map(({ item, product }) => (
                  <li key={item.key} className="flex items-center gap-3 py-3 text-sm">
                    <SafeImage src={product.images[0] ?? ""} fallback={catImage(product)} alt="" width={56} height={56} className="size-14 rounded object-cover" />
                    <div className="flex-1"><p className="font-semibold">{product.name}</p><p className="text-xs text-muted-foreground">{[item.size, item.color].filter(Boolean).join(" · ")} × {item.qty}</p></div>
                    <p className="font-bold">{formatBDT(product.price * item.qty)}</p>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={place} className="press flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-semibold text-ink-foreground hover:bg-primary"><Check aria-hidden className="size-4" /> Place demo order · {formatBDT(t.total)}</button>
            </div>
          )}
          {step > 0 && (
            <div className="mt-6 flex justify-between gap-3">
              <button type="button" onClick={() => setStep((s) => s - 1)} className="press rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted">Back</button>
              {step < 3 && <button type="button" onClick={next} className="press rounded-full bg-ink px-8 py-3 text-sm font-semibold text-ink-foreground hover:bg-primary">Continue</button>}
            </div>
          )}
        </div>
        <aside className="h-fit space-y-5 rounded-lg border bg-card p-6 lg:sticky lg:top-32">
          <h2 className="text-xl font-semibold">Summary</h2>
          <VoucherForm />
          <SummaryRows t={t} showDelivery />
        </aside>
      </div>
    </div>
  );
}
