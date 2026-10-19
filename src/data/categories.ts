import type { Category, CategorySlug } from "@/types/shop";

/** Locally hosted product photography: /images/p/{category}-{n}.webp (n=6 is the category cover). */
export const productImg = (cat: string, n: number, detail = false) => `/images/p/${cat}-${n}${detail ? "d" : ""}.webp`;
const catImg = (cat: string) => productImg(cat, 6);

export const CATEGORIES: Category[] = [
  { slug: "womens-clothing", name: "Women's Clothing", description: "Kurtis, sarees, dresses and everyday layers cut for comfort.", image: catImg("womens-clothing"), fashion: true },
  { slug: "mens-clothing", name: "Men's Clothing", description: "Panjabis, shirts, polos and trousers for every occasion.", image: catImg("mens-clothing"), fashion: true },
  { slug: "beauty-makeup", name: "Beauty & Makeup", description: "Lipsticks, palettes and complexion essentials.", image: catImg("beauty-makeup"), fashion: false },
  { slug: "personal-care", name: "Personal Care", description: "Skincare, haircare and daily grooming rituals.", image: catImg("personal-care"), fashion: false },
  { slug: "fashion-lifestyle", name: "Fashion & Lifestyle", description: "Bags, watches, eyewear and finishing touches.", image: catImg("fashion-lifestyle"), fashion: true },
  { slug: "health-wellness", name: "Health & Wellness", description: "Yoga, fitness and everyday wellbeing tools.", image: catImg("health-wellness"), fashion: false },
  { slug: "baby-care", name: "Baby Care", description: "Gentle essentials for little ones and new parents.", image: catImg("baby-care"), fashion: false },
  { slug: "home-kitchen", name: "Home & Kitchen", description: "Cookware, décor and pieces that make a home.", image: catImg("home-kitchen"), fashion: false },
  { slug: "cleaning-supplies", name: "Cleaning Supplies", description: "Mops, cloths and tools for a spotless space.", image: catImg("cleaning-supplies"), fashion: false },
  { slug: "stationery-office", name: "Stationery & Office", description: "Notebooks, pens and desk organisation.", image: catImg("stationery-office"), fashion: false },
  { slug: "pet-care", name: "Pet Care", description: "Beds, toys and grooming for cats and dogs.", image: catImg("pet-care"), fashion: false },
  { slug: "toys-sports", name: "Toys & Sports", description: "Play, games and gear for active days.", image: catImg("toys-sports"), fashion: false },
  { slug: "vehicle-essentials", name: "Vehicle Essentials", description: "Car and bike accessories for the road.", image: catImg("vehicle-essentials"), fashion: false },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const categoryName = (slug: CategorySlug) => categoryBySlug(slug)?.name ?? "";
