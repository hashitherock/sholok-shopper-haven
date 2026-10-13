import type { Voucher } from "@/types/shop";

export const ANNOUNCEMENT = "Discover your style with Sholok — Fresh finds, everyday essentials.";

// Flash sale ends at the next 23:59:59 local time (stable across renders and reloads within a day).
export function flashSaleEnd(now = new Date()) {
  const end = new Date(now);
  end.setHours(23, 59, 59, 0);
  return end.getTime();
}

export const DELIVERY = {
  standard: { label: "Standard delivery", eta: "3–5 days (demo)", insideDhaka: 60, outsideDhaka: 120 },
  express: { label: "Express delivery", eta: "1–2 days (demo)", insideDhaka: 150, outsideDhaka: 250 },
  freeAbove: 3000,
} as const;

/** Illustrative codes only. Discounts apply to product subtotal, never to delivery. */
export const VOUCHERS: Voucher[] = [
  { code: "SHOLOK10", label: "10% off your products (max ৳500)", type: "percent", value: 10, minOrder: 0, maxDiscount: 500 },
  { code: "WELCOME150", label: "৳150 off orders above ৳1,500", type: "flat", value: 150, minOrder: 1500 },
  { code: "STYLE15", label: "15% off clothing & fashion items", type: "percent", value: 15, minOrder: 0, fashionOnly: true },
];

export const DIVISIONS: Record<string, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Faridpur"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Noakhali"],
  Rajshahi: ["Rajshahi", "Bogura", "Pabna", "Naogaon"],
  Khulna: ["Khulna", "Jashore", "Kushtia", "Satkhira"],
  Barishal: ["Barishal", "Bhola", "Patuakhali"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona"],
};
