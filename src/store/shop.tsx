import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { productById } from "@/data/products";
import { VOUCHERS } from "@/data/site";
import type { Line } from "@/lib/pricing";
import { readLS, writeLS } from "@/lib/storage";
import type { CartItem, Order, Voucher } from "@/types/shop";

const isArr = (v: unknown) => Array.isArray(v);

interface ShopState {
  hydrated: boolean;
  cart: CartItem[];
  lines: Line[];
  cartCount: number;
  wishlist: string[];
  recent: string[];
  orders: Order[];
  voucher?: Voucher;
  cartOpen: boolean;
  user: { name: string; email: string } | null;
  setCartOpen: (o: boolean) => void;
  addToCart: (productId: string, qty?: number, opts?: { size?: string; color?: string; silent?: boolean }) => boolean;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWished: (productId: string) => boolean;
  addRecent: (productId: string) => void;
  applyVoucher: (v: Voucher | undefined) => void;
  placeOrder: (o: Order) => void;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
}

const Ctx = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [voucherCode, setVoucherCode] = useState<string | undefined>();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setCart(readLS<CartItem[]>("sholok.cart", [], isArr).filter((i) => productById(i.productId) && i.qty > 0));
    setWishlist(readLS<string[]>("sholok.wishlist", [], isArr).filter((id) => productById(id)));
    setRecent(readLS<string[]>("sholok.recent", [], isArr).filter((id) => productById(id)));
    setOrders(readLS<Order[]>("sholok.orders", [], isArr));
    setVoucherCode(readLS<string | undefined>("sholok.voucher", undefined));
    setUser(readLS("sholok.user", null));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) writeLS("sholok.cart", cart); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) writeLS("sholok.wishlist", wishlist); }, [wishlist, hydrated]);
  useEffect(() => { if (hydrated) writeLS("sholok.recent", recent); }, [recent, hydrated]);
  useEffect(() => { if (hydrated) writeLS("sholok.orders", orders); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) writeLS("sholok.voucher", voucherCode ?? null); }, [voucherCode, hydrated]);
  useEffect(() => { if (hydrated) writeLS("sholok.user", user); }, [user, hydrated]);

  const lines = useMemo<Line[]>(
    () => cart.flatMap((item) => { const product = productById(item.productId); return product ? [{ item, product }] : []; }),
    [cart],
  );

  const addToCart: ShopState["addToCart"] = useCallback((productId, qty = 1, opts = {}) => {
    const p = productById(productId);
    if (!p) return false;
    if (p.stock <= 0) { toast.error(`${p.name} is out of stock`); return false; }
    const size = opts.size ?? p.sizes?.[0];
    const color = opts.color ?? p.colors?.[0];
    const key = [productId, size, color].filter(Boolean).join("|");
    let ok = true;
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      const current = existing?.qty ?? 0;
      const next = Math.min(p.stock, current + qty);
      if (next === current) { ok = false; return prev; }
      return existing ? prev.map((i) => (i.key === key ? { ...i, qty: next } : i)) : [...prev, { key, productId, qty: next, size, color }];
    });
    if (!opts.silent) {
      if (ok) toast.success("Added to cart", { description: p.name, action: { label: "View cart", onClick: () => setCartOpen(true) } });
      else toast.warning(`Only ${p.stock} in stock`, { description: "You already have the maximum in your cart." });
    }
    return ok;
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) => prev.map((i) => {
      if (i.key !== key) return i;
      const p = productById(i.productId);
      return { ...i, qty: Math.max(1, Math.min(p?.stock ?? 1, qty)) };
    }));
  }, []);

  const removeItem = useCallback((key: string) => setCart((prev) => prev.filter((i) => i.key !== key)), []);
  const clearCart = useCallback(() => { setCart([]); setVoucherCode(undefined); }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const has = prev.includes(id);
      toast(has ? "Removed from wishlist" : "Saved to wishlist", { description: productById(id)?.name });
      return has ? prev.filter((x) => x !== id) : [id, ...prev];
    });
  }, []);

  const addRecent = useCallback((id: string) => setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 10)), []);

  const value: ShopState = {
    hydrated, cart, lines, wishlist, recent, orders, user, cartOpen, setCartOpen,
    cartCount: cart.reduce((s, i) => s + i.qty, 0),
    voucher: VOUCHERS.find((v) => v.code === voucherCode),
    addToCart, setQty, removeItem, clearCart, toggleWishlist, addRecent,
    isWished: (id) => wishlist.includes(id),
    applyVoucher: (v) => setVoucherCode(v?.code),
    placeOrder: (o) => { setOrders((prev) => [o, ...prev]); setCart([]); setVoucherCode(undefined); },
    signIn: (name, email) => setUser({ name, email }),
    signOut: () => setUser(null),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShop must be used inside ShopProvider");
  return c;
}
