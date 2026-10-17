import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/shop/InfoPage";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Sholok" },
    { name: "description", content: "The story behind Sholok, a curated multi-category marketplace for Bangladesh." },
    { property: "og:title", content: "About Sholok" },
    { property: "og:description", content: "The story behind Sholok." },
  ] }),
  component: () => (
    <InfoPage eyebrow="Our story" title="About Sholok" text="Everything, thoughtfully chosen.">
      <p>“Sholok” means everything — and that is the idea. One calm, considered place to find what you wear, what you use and what you love, from festive kurtis to a good frying pan.</p>
      <h2>What we believe</h2>
      <p>Fewer, better things. Honest prices in Taka. Clear information so you can decide quickly and confidently.</p>
      <h2>Thirteen categories, one edit</h2>
      <p>From Women's Clothing to Vehicle Essentials, every category is curated rather than endless — so browsing feels like discovery, not work.</p>
      <h2>A note on this site</h2>
      <p>This Sholok storefront is a frontend demonstration. Products, prices, vouchers, delivery and payment options are illustrative, and no real orders are processed.</p>
    </InfoPage>
  ),
});
