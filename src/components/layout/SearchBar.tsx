import { Link, useNavigate } from "@tanstack/react-router";
import { Clock, Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { readLS, writeLS } from "@/lib/storage";
import { searchProducts } from "@/lib/search";
import { formatBDT } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function SearchBar({ className, autoFocus, onDone }: { className?: string; autoFocus?: boolean; onDone?: () => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const navigate = useNavigate();
  const wrap = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => setRecent(readLS<string[]>("sholok.searches", [], Array.isArray)), []);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const submit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r !== t)].slice(0, 5);
    setRecent(next); writeLS("sholok.searches", next);
    setOpen(false); onDone?.();
    navigate({ to: "/search", search: { q: t } });
  };

  const suggestions = q.trim().length > 1 ? searchProducts(q).slice(0, 5) : [];

  return (
    <div ref={wrap} className={cn("relative", className)} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <form role="search" onSubmit={(e) => { e.preventDefault(); submit(q); }}>
        <label htmlFor={id} className="sr-only">Search Sholok</label>
        <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input id={id} value={q} autoFocus={autoFocus} autoComplete="off" onFocus={() => setOpen(true)}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          placeholder="Search kurtis, serums, footballs…"
          className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-10 text-sm outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/15" />
        {q && (
          <button type="button" aria-label="Clear search" onClick={() => setQ("")} className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted">
            <X aria-hidden className="size-4" />
          </button>
        )}
      </form>
      {open && (suggestions.length > 0 || (!q && recent.length > 0)) && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 animate-in fade-in slide-in-from-top-1 overflow-hidden rounded-lg border bg-popover shadow-lift">
          {!q && (
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent searches
                <button type="button" className="normal-case tracking-normal hover:text-primary" onClick={() => { setRecent([]); writeLS("sholok.searches", []); }}>Clear</button>
              </div>
              {recent.map((r) => (
                <button key={r} type="button" onClick={() => submit(r)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted">
                  <Clock aria-hidden className="size-3.5 text-muted-foreground" /> {r}
                </button>
              ))}
            </div>
          )}
          {suggestions.length > 0 && (
            <ul className="py-1">
              {suggestions.map((p) => (
                <li key={p.id}>
                  <Link to="/product/$id" params={{ id: p.id }} onClick={() => { setOpen(false); onDone?.(); }} className="flex items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-muted">
                    <span className="line-clamp-1">{p.name}</span><span className="shrink-0 font-semibold">{formatBDT(p.price)}</span>
                  </Link>
                </li>
              ))}
              <li><button type="button" onClick={() => submit(q)} className="w-full border-t px-4 py-2.5 text-left text-sm font-semibold text-primary hover:bg-muted">See all results for “{q}”</button></li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
