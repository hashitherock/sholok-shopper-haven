import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/shop/InfoPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title: "Privacy Policy — Sholok" },
    { name: "description", content: "How the Sholok demo store handles your information." },
    { property: "og:title", content: "Privacy Policy — Sholok" },
    { property: "og:description", content: "Sholok privacy policy." },
  ] }),
  component: () => (
    <InfoPage title="Privacy Policy" text="Illustrative policy for a demonstration storefront.">
      <h2>What we store</h2>
      <p>Your cart, wishlist, recently viewed items, recent searches, demo profile name and demo orders are saved in your browser's local storage only.</p>
      <h2>What we don't do</h2>
      <p>No data is sent to a server. We don't collect payment credentials, and newsletter or contact form entries are not transmitted.</p>
      <h2>Clearing your data</h2>
      <p>Clear your browser's site data at any time to remove everything Sholok stored.</p>
    </InfoPage>
  ),
});
