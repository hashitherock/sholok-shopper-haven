export type CategorySlug =
  | "womens-clothing" | "mens-clothing" | "beauty-makeup" | "personal-care"
  | "fashion-lifestyle" | "health-wellness" | "baby-care" | "home-kitchen"
  | "cleaning-supplies" | "stationery-office" | "pet-care" | "toys-sports"
  | "vehicle-essentials";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  fashion: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  originalPrice?: number | undefined;
  description: string;
  features: string[];
  rating: number;
  reviews: number;
  stock: number;
  images: string[];
  sizes?: string[] | undefined;
  colors?: string[] | undefined;
  keywords: string[];
  addedDaysAgo: number;
  flash?: boolean | undefined;
  bestSeller?: boolean | undefined;
  trending?: boolean | undefined;
}

export interface CartItem {
  key: string;
  productId: string;
  qty: number;
  size?: string | undefined;
  color?: string | undefined;
}

export interface Voucher {
  code: string;
  label: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  fashionOnly?: boolean | undefined;
  maxDiscount?: number | undefined;
}

export interface Address {
  name: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  address: string;
  notes: string;
}

export type DeliveryMethod = "standard" | "express";
export type PaymentMethod = "cod" | "online" | "mobile";

export interface Totals {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: { productId: string; name: string; price: number; qty: number; size?: string; color?: string; image: string }[];
  address: Address;
  delivery: DeliveryMethod;
  payment: PaymentMethod;
  voucher?: string | undefined;
  totals: Totals;
  status: "Processing" | "Packed" | "Shipped";
}
