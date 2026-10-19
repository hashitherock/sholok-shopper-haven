import type { CategorySlug, Product } from "@/types/shop";
import { productImg } from "./categories";

// [name, price, originalPrice (0 = none), image hint (unused), stock, extra keywords]
type Row = [string, number, number, string, number, string];

const CLOTH_SIZES = ["S", "M", "L", "XL"];

const RAW: Record<CategorySlug, { rows: Row[]; sizes?: string[]; colors?: string[][]; features: string[] }> = {
  "womens-clothing": {
    sizes: CLOTH_SIZES,
    colors: [["Teal", "Ivory"], ["Teal", "Gold"], ["Sage", "Olive"], ["Blue", "Ivory"], ["Oat", "Grey"]],
    features: ["Breathable fabric for warm weather", "Machine washable", "Relaxed, flattering fit"],
    rows: [
      ["Nakshi Embroidered Cotton Kurti", 1850, 2400, "kurti,embroidery", 24, "kurti ethnic top"],
      ["Jamdani-Inspired Half Silk Saree", 4950, 6200, "saree,silk", 8, "saree traditional festive"],
      ["Linen Wrap Midi Dress", 2650, 0, "dress,linen", 15, "dress summer"],
      ["Three-Piece Lawn Salwar Set", 3200, 3900, "salwar,fabric", 0, "three piece salwar kameez"],
      ["Soft Knit Everyday Cardigan", 1450, 0, "cardigan,knit", 30, "cardigan winter layer"],
    ],
  },
  "mens-clothing": {
    sizes: ["M", "L", "XL", "XXL"],
    colors: [["White", "Sand"], ["Navy", "Olive"], ["Black", "Grey"], ["Maroon", "Teal"], ["Stone", "Charcoal"]],
    features: ["Premium combed cotton", "Tailored modern fit", "Colour-fast dyes"],
    rows: [
      ["Classic Cotton Panjabi", 2250, 2800, "kurta,men", 20, "panjabi eid ethnic"],
      ["Oxford Button-Down Shirt", 1650, 0, "shirt,oxford", 35, "shirt formal office"],
      ["Piqué Polo T-Shirt", 950, 1200, "polo,shirt", 50, "polo tshirt casual"],
      ["Slim Chino Trousers", 1890, 0, "chinos,trousers", 4, "pants chino"],
      ["Lightweight Quilted Jacket", 3450, 4200, "jacket,men", 12, "jacket winter"],
    ],
  },
  "beauty-makeup": {
    colors: [["Ruby", "Nude", "Mauve"], ["Warm", "Cool"], ["Fair", "Medium", "Deep"], ["Black"], ["Peach", "Rose"]],
    features: ["Dermatologically tested", "Long-wear formula", "Cruelty-free"],
    rows: [
      ["Velvet Matte Lipstick", 750, 950, "lipstick,makeup", 60, "lipstick lips"],
      ["12-Shade Eyeshadow Palette", 1450, 0, "eyeshadow,palette", 22, "eyeshadow eyes"],
      ["Second-Skin Liquid Foundation", 1250, 1500, "foundation,cosmetics", 18, "foundation base"],
      ["Volume Lash Mascara", 650, 0, "mascara,cosmetic", 0, "mascara lashes"],
      ["Blush & Glow Duo", 890, 1100, "blush,makeup", 27, "blush highlighter"],
    ],
  },
  "personal-care": {
    features: ["Gentle on skin", "Free from harsh sulphates", "Suitable for daily use"],
    rows: [
      ["Vitamin C Brightening Serum", 1150, 1400, "serum,skincare", 40, "serum skincare face"],
      ["Argan Repair Shampoo 400ml", 720, 0, "shampoo,bottle", 55, "shampoo hair"],
      ["Daily SPF 50 Sunscreen", 890, 1050, "sunscreen,lotion", 33, "sunscreen spf"],
      ["Rechargeable Beard Trimmer", 2450, 2900, "trimmer,razor", 9, "trimmer shaving men"],
      ["Shea Body Lotion", 560, 0, "lotion,body", 70, "lotion moisturiser"],
    ],
  },
  "fashion-lifestyle": {
    colors: [["Tan", "Black"], ["Silver", "Gold"], ["Tortoise", "Black"], ["Natural"], ["Brown", "Navy"]],
    features: ["Durable everyday materials", "Thoughtful finishing", "Gift-ready packaging"],
    rows: [
      ["Structured Leather Tote", 3850, 4600, "leather,bag", 14, "bag tote handbag"],
      ["Minimal Mesh-Strap Watch", 2950, 0, "wristwatch", 11, "watch accessory"],
      ["Polarised Round Sunglasses", 1350, 1800, "sunglasses", 26, "sunglasses eyewear"],
      ["Handwoven Jute Clutch", 990, 0, "clutch,bag", 3, "clutch jute"],
      ["Classic Leather Wallet", 1150, 1400, "wallet,leather", 45, "wallet men"],
    ],
  },
  "health-wellness": {
    colors: [["Teal", "Lilac"], ["Black"], ["White"], ["Grey"], ["Coral", "Navy"]],
    features: ["Built for daily routines", "Easy to clean", "Compact storage"],
    rows: [
      ["Non-Slip Yoga Mat 6mm", 1650, 2100, "yoga,mat", 30, "yoga mat fitness"],
      ["Adjustable Dumbbell Pair", 3900, 0, "dumbbell", 7, "dumbbell gym weights"],
      ["Digital Body Weight Scale", 1450, 1700, "scale,bathroom", 20, "scale weight"],
      ["Foam Massage Roller", 990, 0, "foam,roller", 0, "massage roller recovery"],
      ["Insulated Steel Water Bottle", 850, 1050, "water,bottle", 80, "bottle hydration"],
    ],
  },
  "baby-care": {
    sizes: ["0-6M", "6-12M", "1-2Y"],
    features: ["Soft and baby-safe", "BPA-free materials", "Parent-tested design"],
    rows: [
      ["Organic Cotton Romper Set", 1150, 1400, "baby,clothes", 25, "romper baby clothes"],
      ["Anti-Colic Feeding Bottle", 650, 0, "baby,bottle", 40, "feeding bottle"],
      ["Gentle Baby Wash 300ml", 480, 550, "baby,bath", 60, "baby wash bath"],
      ["Soft Plush Rattle Toy", 390, 0, "baby,rattle", 35, "rattle toy"],
      ["Muslin Swaddle Blanket", 890, 1100, "swaddle,blanket", 6, "swaddle blanket muslin"],
    ],
  },
  "home-kitchen": {
    colors: [["Ivory", "Sage"], ["Black"], ["Natural"], ["Teal", "Sand"], ["Steel"]],
    features: ["Food-safe materials", "Designed for everyday use", "Easy-care finish"],
    rows: [
      ["Stoneware Dinner Set (16 pcs)", 4250, 5200, "dinnerware,plates", 10, "dinner set plates"],
      ["Non-Stick Frying Pan 28cm", 1550, 0, "frying,pan", 28, "pan cookware"],
      ["Acacia Wood Chopping Board", 890, 1100, "cutting,board", 33, "chopping board"],
      ["Handwoven Cushion Cover Pair", 750, 0, "cushion,pillow", 45, "cushion decor"],
      ["Stainless Steel Electric Kettle", 1950, 2400, "kettle", 15, "kettle electric"],
    ],
  },
  "cleaning-supplies": {
    features: ["Tough on dirt", "Reusable where possible", "Space-saving storage"],
    rows: [
      ["Spin Mop & Bucket Set", 1850, 2300, "mop,cleaning", 18, "mop floor"],
      ["Microfibre Cloth Pack (10)", 450, 0, "microfiber,cloth", 90, "cloth microfibre duster"],
      ["Multi-Surface Cleaning Spray", 320, 380, "spray,cleaning", 70, "spray cleaner"],
      ["Soft-Bristle Scrub Brush Set", 390, 0, "scrub,brush", 0, "brush scrub"],
      ["Cordless Handheld Vacuum", 4650, 5500, "vacuum,cleaner", 5, "vacuum"],
    ],
  },
  "stationery-office": {
    colors: [["Navy", "Teal", "Coral"], ["Black", "Blue"], ["Natural"], ["White"], ["Grey"]],
    features: ["Smooth, reliable performance", "Quality paper & materials", "Desk-friendly design"],
    rows: [
      ["Dot-Grid Hardcover Notebook A5", 450, 550, "notebook,journal", 100, "notebook journal"],
      ["Gel Pen Set (12 colours)", 380, 0, "pens,colorful", 75, "pens gel"],
      ["Bamboo Desk Organiser", 1250, 1500, "desk,organizer", 14, "organiser desk"],
      ["Ergonomic Wireless Mouse", 990, 0, "computer,mouse", 26, "mouse office"],
      ["Undated Weekly Planner", 650, 790, "planner,calendar", 40, "planner"],
    ],
  },
  "pet-care": {
    sizes: ["S", "M", "L"],
    features: ["Pet-safe materials", "Vet-approved designs", "Easy to wash"],
    rows: [
      ["Plush Donut Pet Bed", 2150, 2600, "dog,bed", 12, "pet bed dog cat"],
      ["Interactive Cat Feather Wand", 350, 0, "cat,toy", 50, "cat toy"],
      ["Adjustable Nylon Dog Leash", 650, 790, "dog,leash", 38, "leash collar dog"],
      ["Self-Cleaning Grooming Brush", 750, 0, "dog,grooming", 0, "brush grooming"],
      ["Stainless Steel Double Pet Bowl", 690, 850, "pet,bowl", 29, "bowl pet"],
    ],
  },
  "toys-sports": {
    features: ["Built to last", "Safety tested", "Great for all ages"],
    rows: [
      ["Pro Size-5 Football", 1250, 1500, "football,soccer", 34, "football soccer"],
      ["English Willow Cricket Bat", 3650, 0, "cricket,bat", 9, "cricket bat"],
      ["Wooden Building Blocks (60 pcs)", 1350, 1650, "wooden,blocks", 22, "blocks kids toy"],
      ["Badminton Racket Pair", 1890, 0, "badminton", 17, "badminton racket"],
      ["1000-Piece Jigsaw Puzzle", 850, 1050, "jigsaw,puzzle", 26, "puzzle board game"],
    ],
  },
  "vehicle-essentials": {
    features: ["Universal fit", "Weather-resistant", "Simple installation"],
    rows: [
      ["Magnetic Car Phone Mount", 690, 890, "car,phone", 48, "phone mount car"],
      ["Microfibre Car Wash Kit", 1450, 0, "car,wash", 21, "car wash"],
      ["Full-Face Motorbike Helmet", 4350, 5200, "motorcycle,helmet", 8, "helmet bike"],
      ["Dual USB Fast Car Charger", 590, 0, "car,charger", 0, "charger usb car"],
      ["Memory Foam Seat Cushion", 1250, 1550, "car,seat", 19, "seat cushion"],
    ],
  },
};

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

let seq = 0;
export const PRODUCTS: Product[] = (Object.keys(RAW) as CategorySlug[]).flatMap((cat, ci) => {
  const { rows, sizes, colors, features } = RAW[cat];
  return rows.map(([name, price, orig, kw, stock, kws], i): Product => {
    seq += 1;
    const n = seq;
    return {
      id: `SH-${String(n).padStart(3, "0")}`,
      slug: slugify(name),
      name,
      category: cat,
      price,
      originalPrice: orig || undefined,
      description: `${name} from Sholok's curated ${cat.replace(/-/g, " ")} edit. Chosen for its quality, considered details and everyday practicality, it is designed to fit naturally into life in Bangladesh — from busy weekdays in Dhaka to festive weekends with family.`,
      features: [...features, `Product code ${`SH-${String(n).padStart(3, "0")}`}`],
      rating: Math.round((3.8 + ((n * 37) % 12) / 10) * 10) / 10,
      reviews: 12 + ((n * 53) % 480),
      stock,
      images: [productImg(cat, i + 1), productImg(cat, i + 1, true), productImg(cat, 6)],
      sizes,
      colors: colors?.[i],
      keywords: kws.split(" "),
      addedDaysAgo: (n * 7) % 60,
      flash: orig > 0 && (n + ci) % 2 === 0,
      bestSeller: n % 4 === 1,
      trending: n % 5 === 2,
    };
  });
});

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const productsInCategory = (slug: string) => PRODUCTS.filter((p) => p.category === slug);
