import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InfoPage } from "@/components/shop/InfoPage";

const QA: [string, string][] = [
  ["Is Sholok a real store?", "This is a frontend demonstration. You can browse, add to cart and place demo orders, but nothing is shipped or charged."],
  ["How are delivery charges calculated?", "Demo rates: standard ৳60 inside Dhaka division and ৳120 elsewhere; express ৳150 / ৳250. Standard delivery is free when your products total ৳3,000 or more after discounts."],
  ["Which vouchers can I use?", "Try SHOLOK10 (10% off, max ৳500), WELCOME150 (৳150 off above ৳1,500) or STYLE15 (15% off clothing & fashion). One voucher per order; vouchers never reduce delivery fees."],
  ["Where is my cart saved?", "Your cart, wishlist and demo orders are stored in this browser's local storage."],
  ["Do you collect card or mobile banking details?", "Never. Payment options are demonstrations only and no credentials are requested."],
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: "FAQ — Sholok" },
    { name: "description", content: "Answers about delivery, vouchers and the Sholok demo store." },
    { property: "og:title", content: "FAQ — Sholok" },
    { property: "og:description", content: "Frequently asked questions about Sholok." },
  ] }),
  component: () => (
    <InfoPage title="FAQ" text="Quick answers to common questions.">
      <Accordion type="single" collapsible className="w-full">
        {QA.map(([q, a]) => (
          <AccordionItem key={q} value={q}><AccordionTrigger className="text-left text-base font-semibold">{q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{a}</AccordionContent></AccordionItem>
        ))}
      </Accordion>
    </InfoPage>
  ),
});
