import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "@/data/categories";
import { isEmail } from "@/lib/storage";
import { Logo } from "@/components/shop/bits";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <form noValidate className="w-full max-w-md" onSubmit={(e) => {
      e.preventDefault();
      if (!isEmail(email)) return setMsg({ ok: false, text: "Please enter a valid email address." });
      setMsg({ ok: true, text: "You're on the list! (Demo only — nothing was sent or stored remotely.)" });
      setEmail("");
    }}>
      <label htmlFor="nl" className="sr-only">Email address</label>
      <div className="flex gap-2 rounded-full border border-ink-foreground/20 bg-ink-foreground/5 p-1.5">
        <input id="nl" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-invalid={msg?.ok === false} aria-describedby="nl-msg"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink-foreground outline-none placeholder:text-ink-foreground/50" />
        <button className="press rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-coral">Subscribe</button>
      </div>
      <p id="nl-msg" role="status" className={cn("mt-2 min-h-5 px-4 text-sm", msg?.ok ? "text-primary" : "text-coral")}>{msg?.text}</p>
    </form>
  );
}

const cols = [
  { title: "Shop", links: [["/products", "All Products"], ["/flash-sale", "Flash Sale"], ["/deals", "Deals & Offers"], ["/wishlist", "Wishlist"], ["/cart", "Cart"]] },
  { title: "Help", links: [["/contact", "Contact Us"], ["/faq", "FAQ"], ["/account", "Order history"], ["/about", "About Sholok"]] },
  { title: "Legal", links: [["/privacy", "Privacy Policy"], ["/terms", "Terms & Conditions"]] },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_2fr]">
        <div className="space-y-5">
          <Logo className="text-4xl text-ink-foreground" />
          <p className="max-w-sm text-sm opacity-75">Sholok is a curated multi-category marketplace for Bangladesh — fashion, beauty, home and everyday essentials, thoughtfully chosen. This site is a frontend demonstration.</p>
          <div className="flex gap-2">
            {[Facebook, Instagram, Youtube].map((I, i) => (
              <span key={i} role="img" aria-label="Social profile (placeholder)" title="Social links coming soon" className="grid size-10 place-items-center rounded-full border border-ink-foreground/20 opacity-70"><I aria-hidden className="size-4" /></span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {cols.map((c) => (
            <div key={c.title}>
              <h2 className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-primary">{c.title}</h2>
              <ul className="space-y-2 text-sm">{c.links.map(([to, l]) => <li key={to}><Link to={to} className="opacity-80 hover:text-primary hover:opacity-100">{l}</Link></li>)}</ul>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-4">
            <h2 className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-primary">Categories</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
              {CATEGORIES.map((c) => <li key={c.slug}><Link to="/category/$slug" params={{ slug: c.slug }} className="opacity-80 hover:text-primary hover:opacity-100">{c.name}</Link></li>)}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="container-x flex flex-col justify-between gap-2 py-5 text-xs opacity-60 sm:flex-row">
          <p>© {new Date().getFullYear()} Sholok. All prices in ৳ BDT.</p>
          <p>Demo storefront — no real orders, payments or deliveries are processed.</p>
        </div>
      </div>
    </footer>
  );
}
