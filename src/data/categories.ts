import type { Category, CategorySlug } from "@/types/shop";

export const img = (keywords: string, lock: number, size = 640) =>
  `https://loremflickr.com/${size}/${size}/${encodeURIComponent(keywords)}?lock=${lock}`;

export const CATEGORIES: Category[] = [
  { slug: "womens-clothing", name: "Women's Clothing", description: "Kurtis, sarees, dresses and everyday layers cut for comfort.", image: img("saree,woman", 11), fashion: true },
  { slug: "mens-clothing", name: "Men's Clothing", description: "Panjabis, shirts, polos and trousers for every occasion.", image: img("menswear,shirt", 12), fashion: true },
  { slug: "beauty-makeup", name: "Beauty & Makeup", description: "Lipsticks, palettes and complexion essentials.", image: img("makeup,lipstick", 13), fashion: false },
  { slug: "personal-care", name: "Personal Care", description: "Skincare, haircare and daily grooming rituals.", image: img("skincare,bottle", 14), fashion: false },
  { slug: "fashion-lifestyle", name: "Fashion & Lifestyle", description: "Bags, watches, eyewear and finishing touches.", image: img("handbag,watch", 15), fashion: true },
  { slug: "health-wellness", name: "Health & Wellness", description: "Yoga, fitness and everyday wellbeing tools.", image: img("yoga,mat", 16), fashion: false },
  { slug: "baby-care", name: "Baby Care", description: "Gentle essentials for little ones and new parents.", image: img("baby,toy", 17), fashion: false },
  { slug: "home-kitchen", name: "Home & Kitchen", description: "Cookware, décor and pieces that make a home.", image: img("kitchen,ceramic", 18), fashion: false },
  { slug: "cleaning-supplies", name: "Cleaning Supplies", description: "Mops, cloths and tools for a spotless space.", image: img("cleaning,brush", 19), fashion: false },
  { slug: "stationery-office", name: "Stationery & Office", description: "Notebooks, pens and desk organisation.", image: img("notebook,pen", 20), fashion: false },
  { slug: "pet-care", name: "Pet Care", description: "Beds, toys and grooming for cats and dogs.", image: img("dog,pet", 21), fashion: false },
  { slug: "toys-sports", name: "Toys & Sports", description: "Play, games and gear for active days.", image: img("football,sport", 22), fashion: false },
  { slug: "vehicle-essentials", name: "Vehicle Essentials", description: "Car and bike accessories for the road.", image: img("car,interior", 23), fashion: false },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const categoryName = (slug: CategorySlug) => categoryBySlug(slug)?.name ?? "";
