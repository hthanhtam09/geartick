import connectDB from "./mongodb";
import Product from "./models/Product";

const sampleProducts = [
  {
    title: "iPhone 15 Pro Max",
    description:
      "The most advanced iPhone ever with titanium design, A17 Pro chip, and advanced camera system with 5x telephoto zoom.",
    category: "Smartphones",
    brand: "Apple",
    price: 1199,
    currency: "USD",
    affiliateUrl: "https://amazon.com/iphone-15-pro-max",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
    ],
    slug: "iphone-15-pro-max",
    averageRating: 4.8,
    totalReviews: 1247,
    tags: ["smartphone", "premium", "camera", "5g"],
    seoTitle: "iPhone 15 Pro Max Review - Best Premium Smartphone 2024",
    seoDescription:
      "Comprehensive review of iPhone 15 Pro Max with titanium design, A17 Pro chip, and advanced camera system.",
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description:
      "AI-powered flagship smartphone with S Pen, 200MP camera, titanium frame, and enhanced Galaxy AI features.",
    category: "Smartphones",
    brand: "Samsung",
    price: 1299,
    currency: "USD",
    affiliateUrl: "https://amazon.com/samsung-galaxy-s24-ultra",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop",
    ],
    slug: "samsung-galaxy-s24-ultra",
    averageRating: 4.7,
    totalReviews: 892,
    tags: ["smartphone", "android", "s-pen", "camera"],
    seoTitle: "Samsung Galaxy S24 Ultra Review - Best Android Phone 2024",
    seoDescription:
      "In-depth review of Samsung Galaxy S24 Ultra with AI features, S Pen, and 200MP camera system.",
  },
  {
    title: "MacBook Pro 14-inch M3",
    description:
      "Professional laptop with Apple M3 chip, Liquid Retina XDR display, and up to 22-hour battery life for creative workflows.",
    category: "Laptops",
    brand: "Apple",
    price: 1999,
    currency: "USD",
    affiliateUrl: "https://amazon.com/macbook-pro-14-m3",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop",
    ],
    slug: "macbook-pro-14-m3",
    averageRating: 4.9,
    totalReviews: 634,
    tags: ["laptop", "professional", "m3-chip", "creative"],
    seoTitle: "MacBook Pro 14-inch M3 Review - Best Creative Laptop 2024",
    seoDescription:
      "Complete review of MacBook Pro 14-inch with M3 chip, perfect for creative professionals and developers.",
  },
  {
    title: "Sony WH-1000XM5",
    description:
      "Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery life.",
    category: "Audio",
    brand: "Sony",
    price: 399,
    currency: "USD",
    affiliateUrl: "https://amazon.com/sony-wh1000xm5-headphones",
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
    ],
    slug: "sony-wh-1000xm5",
    averageRating: 4.6,
    totalReviews: 2156,
    tags: ["headphones", "noise-canceling", "wireless", "premium-audio"],
    seoTitle: "Sony WH-1000XM5 Review - Best Noise Canceling Headphones",
    seoDescription:
      "Detailed review of Sony WH-1000XM5 wireless headphones with industry-leading noise cancellation.",
  },
  {
    title: "Nintendo Switch OLED",
    description:
      "Portable gaming console with vibrant 7-inch OLED screen, enhanced audio, and wide adjustable stand.",
    category: "Gaming",
    brand: "Nintendo",
    price: 349,
    currency: "USD",
    affiliateUrl: "https://amazon.com/nintendo-switch-oled",
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    ],
    slug: "nintendo-switch-oled",
    averageRating: 4.5,
    totalReviews: 3421,
    tags: ["gaming", "portable", "oled", "nintendo"],
    seoTitle: "Nintendo Switch OLED Review - Best Portable Gaming Console",
    seoDescription:
      "Comprehensive review of Nintendo Switch OLED with enhanced display and improved gaming experience.",
  },
  {
    title: "iPad Pro 12.9-inch M2",
    description:
      "Most advanced iPad with M2 chip, Liquid Retina XDR display, and Apple Pencil hover for professional creativity.",
    category: "Tablets",
    brand: "Apple",
    price: 1099,
    currency: "USD",
    affiliateUrl: "https://amazon.com/ipad-pro-12-9-m2",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=600&fit=crop",
    ],
    slug: "ipad-pro-12-9-m2",
    averageRating: 4.8,
    totalReviews: 756,
    tags: ["tablet", "professional", "m2-chip", "apple-pencil"],
    seoTitle: "iPad Pro 12.9-inch M2 Review - Best Professional Tablet",
    seoDescription:
      "In-depth review of iPad Pro 12.9-inch with M2 chip, perfect for creative professionals and productivity.",
  },
];

export const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});

    // Insert sample products
    const products = await Product.insertMany(
      sampleProducts.map((product) => ({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    console.log(`✅ Successfully seeded ${products.length} products`);
    return products;
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
};
