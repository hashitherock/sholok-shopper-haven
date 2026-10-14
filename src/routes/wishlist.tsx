import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { productById } from "@/data/products";
import { ProductGrid } from "@/components/shop/ProductCard";
import { EmptyState, PageHero } from "@/components/shop/bits";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [
    { title: "Wishlist — Sholok" },
    { name: "description", content: "Products you've saved on Sholok." },
    { property: "og:title", content: "Wishlist — Sholok" },
    { property: "og:description", content: "Your saved Sholok favourites." },
  ] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, hydrated } = useShop();
  const items = wishlist.map(productById).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <>
      <PageHero title="Your wishlist" text={`${items.length} saved ${items.length === 1 ? "item" : "items"} — stored in this browser.`} crumbs={[{ label: "Wishlist" }]} />
      <div className="container-x py-10">
        {hydrated && items.length === 0 ? (
          <EmptyState icon={<Heart className="size-7" />} title="Nothing saved yet" text="Tap the heart on any product to keep it here for later."
            action={<Link to="/products" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground hover:bg-primary">Discover products</Link>} />
        ) : <ProductGrid products={items} />}
      </div>
    </>
  );
}
