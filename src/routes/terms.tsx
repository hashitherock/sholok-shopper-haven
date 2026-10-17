import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/shop/InfoPage";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [
    { title: "Terms & Conditions — Sholok" },
    { name: "description", content: "Terms for using the Sholok demonstration storefront." },
    { property: "og:title", content: "Terms & Conditions — Sholok" },
    { property: "og:description", content: "Sholok terms and conditions." },
  ] }),
  component: () => (
    <InfoPage title="Terms & Conditions" text="Illustrative terms for a demonstration storefront.">
      <h2>Demonstration only</h2>
      <p>Sholok is a frontend demo. Products, prices, stock, vouchers, delivery and payment options are mock content and do not form an offer to sell.</p>
      <h2>Orders</h2>
      <p>Demo orders are generated in your browser and are not transmitted to any merchant.</p>
      <h2>Pricing</h2>
      <p>All prices are shown in Bangladeshi Taka (৳). Vouchers apply to product subtotals only and cannot reduce an order below ৳0.</p>
    </InfoPage>
  ),
});
