import { Link } from "@tanstack/react-router";
import { ChevronDown, Headphones, Heart, MapPin, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/data/categories";
import { ANNOUNCEMENT } from "@/data/site";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Logo, SafeImage } from "@/components/shop/bits";
import { SearchBar } from "./SearchBar";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "All Products" },
  { to: "/flash-sale", label: "Flash Sale" },
  { to: "/deals", label: "Deals & Offers" },
  { to: "/about", label: "About Us" },
] as const;

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return <span key={n} aria-hidden className="absolute -right-1 -top-1 grid min-w-5 animate-pop place-items-center rounded-full bg-coral px-1 text-[0.65rem] font-bold leading-5 text-coral-foreground">{n > 99 ? "99+" : n}</span>;
}

function AccountPanel() {
  const { user, signIn, signOut } = useShop();
  const [name, setName] = useState("");
  return (
    <Popover>
      <PopoverTrigger aria-label="Account" className="press relative grid size-10 place-items-center rounded-full hover:bg-muted"><User aria-hidden className="size-5" /></PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        {user ? (
          <div className="space-y-3">
            <p className="text-sm">Signed in as <strong>{user.name}</strong> <span className="text-muted-foreground">(demo)</span></p>
            <Link to="/account" className="block rounded-md bg-ink px-3 py-2 text-center text-sm font-semibold text-ink-foreground hover:bg-primary">My orders</Link>
            <button type="button" onClick={signOut} className="w-full text-sm text-muted-foreground hover:text-foreground">Sign out</button>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (name.trim()) signIn(name.trim(), ""); }}>
            <p className="font-display text-lg font-semibold">Demo sign in</p>
            <p className="text-xs text-muted-foreground">No real account is created — your name is saved in this browser only.</p>
            <label className="sr-only" htmlFor="demo-name">Your name</label>
            <input id="demo-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm" />
            <button className="press w-full rounded-md bg-ink py-2 text-sm font-semibold text-ink-foreground hover:bg-primary">Continue</button>
            <Link to="/account" className="block text-center text-xs text-primary">View guest orders</Link>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
}

function MegaMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} onMouseLeave={() => setOpen(false)} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <button type="button" aria-expanded={open} aria-controls="mega" onClick={() => setOpen((o) => !o)} onMouseEnter={() => setOpen(true)}
        className="flex items-center gap-1 py-3 text-sm font-semibold hover:text-primary">
        Categories <ChevronDown aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      <div id="mega" hidden={!open} className="absolute inset-x-0 top-full z-40 animate-in fade-in slide-in-from-top-2 border-y bg-popover shadow-lift">
        <div className="container-x grid grid-cols-[1fr_16rem] gap-8 py-6">
          <ul className="grid grid-cols-3 gap-1 xl:grid-cols-4">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} onClick={() => setOpen(false)} className="group flex items-center gap-3 rounded-md p-2 hover:bg-muted">
                  <SafeImage src={c.image} alt="" width={44} height={44} className="size-11 rounded-md object-cover" />
                  <span className="text-sm font-semibold group-hover:text-primary">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/flash-sale" onClick={() => setOpen(false)} className="flex flex-col justify-end rounded-lg bg-ink p-5 text-ink-foreground">
            <span className="eyebrow">Today only</span>
            <span className="mt-1 font-display text-2xl italic">Flash Sale</span>
            <span className="mt-1 text-sm opacity-80">Up to 30% off across categories →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { cartCount, wishlist, setCartOpen } = useShop();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h(); window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <div className="bg-ink text-ink-foreground">
        <div className="container-x flex h-9 items-center justify-between gap-4 text-xs">
          <p className="truncate"><span className="text-primary">✦</span> {ANNOUNCEMENT}</p>
          <div className="hidden shrink-0 items-center gap-5 md:flex">
            <span className="flex items-center gap-1 opacity-80"><MapPin aria-hidden className="size-3.5" /> Delivering across Bangladesh (demo)</span>
            <Link to="/contact" className="flex items-center gap-1 hover:text-primary"><Headphones aria-hidden className="size-3.5" /> Support</Link>
          </div>
        </div>
      </div>
      <header className={cn("sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md transition-shadow", scrolled && "shadow-soft")}>
        <div className={cn("container-x flex items-center gap-3 transition-[height] md:gap-6", scrolled ? "h-14 md:h-16" : "h-16 md:h-20")}>
          <button type="button" aria-label="Open menu" onClick={() => setMenu(true)} className="press -ml-2 grid size-10 place-items-center rounded-full hover:bg-muted lg:hidden"><Menu aria-hidden className="size-5" /></button>
          <Logo className="text-2xl md:text-3xl" />
          <SearchBar className="mx-auto hidden max-w-xl flex-1 md:block" />
          <div className="ml-auto flex items-center gap-0.5 md:ml-0">
            <button type="button" aria-label="Search" onClick={() => setSearch((s) => !s)} className="press grid size-10 place-items-center rounded-full hover:bg-muted md:hidden"><Search aria-hidden className="size-5" /></button>
            <div className="hidden sm:block"><AccountPanel /></div>
            <Link to="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`} className="press relative grid size-10 place-items-center rounded-full hover:bg-muted">
              <Heart aria-hidden className="size-5" /><Badge n={wishlist.length} />
            </Link>
            <button type="button" aria-label={`Open cart, ${cartCount} items`} onClick={() => setCartOpen(true)} className="press relative grid size-10 place-items-center rounded-full hover:bg-muted">
              <ShoppingBag aria-hidden className="size-5" /><Badge n={cartCount} />
            </button>
          </div>
        </div>
        {search && <div className="container-x animate-in slide-in-from-top-1 pb-3 md:hidden"><SearchBar autoFocus onDone={() => setSearch(false)} /></div>}
        <nav aria-label="Primary" className="relative hidden border-t lg:block">
          <div className="container-x flex items-center gap-8">
            <MegaMenu />
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}
                className={cn("py-3 text-sm font-semibold hover:text-primary", n.to === "/flash-sale" && "text-coral")}>{n.label}</Link>
            ))}
          </div>
        </nav>
      </header>

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto bg-background p-0">
          <SheetHeader className="border-b p-4 text-left"><SheetTitle asChild><div><Logo /></div></SheetTitle></SheetHeader>
          <nav aria-label="Mobile" className="p-4">
            <ul className="space-y-1">
              {NAV.map((n) => <li key={n.to}><Link to={n.to} onClick={() => setMenu(false)} className="block rounded-md px-3 py-2.5 font-semibold hover:bg-muted">{n.label}</Link></li>)}
              <li><Link to="/account" onClick={() => setMenu(false)} className="block rounded-md px-3 py-2.5 font-semibold hover:bg-muted">My account (demo)</Link></li>
            </ul>
            <p className="eyebrow mb-2 mt-6 px-3">Categories</p>
            <ul className="grid grid-cols-1 gap-0.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link to="/category/$slug" params={{ slug: c.slug }} onClick={() => setMenu(false)} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted">
                    <SafeImage src={c.image} alt="" width={32} height={32} className="size-8 rounded object-cover" />{c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
