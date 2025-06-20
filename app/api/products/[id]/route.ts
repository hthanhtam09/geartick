import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";

// Mock product data for when database is not available
const mockProducts = [
  {
    _id: "iphone-15-pro-max",
    title: "iPhone 15 Pro Max",
    description:
      "Apple's most advanced iPhone with titanium design, A17 Pro chip, and 5x telephoto camera",
    slug: "iphone-15-pro-max",
    brand: "Apple",
    category: "smartphones",
    price: 1199,
    originalPrice: 1199,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center",
    ],
    specifications: [
      {
        name: "Display",
        value: "6.7-inch Super Retina XDR OLED",
        category: "Display & Screen",
      },
      {
        name: "Processor",
        value: "A17 Pro chip",
        category: "Configuration & Memory",
      },
      {
        name: "Storage",
        value: "256GB, 512GB, 1TB",
        category: "Configuration & Memory",
      },
      { name: "RAM", value: "8GB", category: "Configuration & Memory" },
      {
        name: "Camera",
        value: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
        category: "Camera & Screen",
      },
      { name: "Battery", value: "4441mAh", category: "Battery & Charging" },
      {
        name: "Charging",
        value: "USB-C, MagSafe, Qi wireless",
        category: "Battery & Charging",
      },
      {
        name: "Operating System",
        value: "iOS 17",
        category: "Software & Features",
      },
      { name: "Water Resistance", value: "IP68", category: "Design & Build" },
      {
        name: "Material",
        value: "Titanium frame, Ceramic Shield",
        category: "Design & Build",
      },
    ],
    averageRating: 4.8,
    totalReviews: 12500,
    affiliateUrl: "https://amzn.to/3example1",
    affiliateLinks: [
      { platform: "Amazon", url: "https://amzn.to/3example1", price: 1199 },
      {
        platform: "Best Buy",
        url: "https://bestbuy.com/example1",
        price: 1199,
      },
      {
        platform: "Apple Store",
        url: "https://apple.com/example1",
        price: 1199,
      },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ["smartphone", "apple", "camera", "premium", "titanium"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "samsung-galaxy-s24-ultra",
    title: "Samsung Galaxy S24 Ultra",
    description:
      "AI-powered smartphone with S Pen, 200MP camera, and titanium design",
    slug: "samsung-galaxy-s24-ultra",
    brand: "Samsung",
    category: "smartphones",
    price: 1299,
    originalPrice: 1299,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop&crop=center",
    ],
    specifications: [
      {
        name: "Display",
        value: "6.8-inch Dynamic AMOLED 2X",
        category: "Display & Screen",
      },
      {
        name: "Processor",
        value: "Snapdragon 8 Gen 3",
        category: "Configuration & Memory",
      },
      {
        name: "Storage",
        value: "256GB, 512GB, 1TB",
        category: "Configuration & Memory",
      },
      { name: "RAM", value: "12GB", category: "Configuration & Memory" },
      {
        name: "Camera",
        value: "200MP Main + 12MP Ultra Wide + 50MP Telephoto + 10MP Telephoto",
        category: "Camera & Screen",
      },
      { name: "Battery", value: "5000mAh", category: "Battery & Charging" },
      {
        name: "Charging",
        value: "45W wired, 15W wireless",
        category: "Battery & Charging",
      },
      {
        name: "Operating System",
        value: "Android 14, One UI 6.1",
        category: "Software & Features",
      },
      { name: "Water Resistance", value: "IP68", category: "Design & Build" },
      {
        name: "Material",
        value: "Titanium frame, Gorilla Glass Armor",
        category: "Design & Build",
      },
      { name: "S Pen", value: "Integrated", category: "Software & Features" },
    ],
    averageRating: 4.7,
    totalReviews: 9870,
    affiliateUrl: "https://amzn.to/3example2",
    affiliateLinks: [
      { platform: "Amazon", url: "https://amzn.to/3example2", price: 1299 },
      {
        platform: "Best Buy",
        url: "https://bestbuy.com/example2",
        price: 1299,
      },
      { platform: "Samsung", url: "https://samsung.com/example2", price: 1299 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ["smartphone", "samsung", "ai", "s-pen", "200mp"],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    _id: "google-pixel-8-pro",
    title: "Google Pixel 8 Pro",
    description:
      "AI photography master with computational photography and pure Android experience",
    slug: "google-pixel-8-pro",
    brand: "Google",
    category: "smartphones",
    price: 999,
    originalPrice: 999,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center",
    ],
    specifications: [
      {
        name: "Display",
        value: "6.7-inch LTPO OLED",
        category: "Display & Screen",
      },
      {
        name: "Processor",
        value: "Google Tensor G3",
        category: "Configuration & Memory",
      },
      {
        name: "Storage",
        value: "128GB, 256GB, 512GB",
        category: "Configuration & Memory",
      },
      { name: "RAM", value: "12GB", category: "Configuration & Memory" },
      {
        name: "Camera",
        value: "50MP Main + 48MP Ultra Wide + 48MP Telephoto",
        category: "Camera & Screen",
      },
      { name: "Battery", value: "4950mAh", category: "Battery & Charging" },
      {
        name: "Charging",
        value: "30W wired, 23W wireless",
        category: "Battery & Charging",
      },
      {
        name: "Operating System",
        value: "Android 14",
        category: "Software & Features",
      },
      { name: "Water Resistance", value: "IP68", category: "Design & Build" },
      {
        name: "Material",
        value: "Aluminum frame, Gorilla Glass Victus 2",
        category: "Design & Build",
      },
      {
        name: "Temperature Sensor",
        value: "Yes",
        category: "Software & Features",
      },
    ],
    averageRating: 4.6,
    totalReviews: 8230,
    affiliateUrl: "https://amzn.to/3example3",
    affiliateLinks: [
      { platform: "Amazon", url: "https://amzn.to/3example3", price: 999 },
      { platform: "Best Buy", url: "https://bestbuy.com/example3", price: 999 },
      {
        platform: "Google Store",
        url: "https://store.google.com/example3",
        price: 999,
      },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ["smartphone", "google", "photography", "ai", "android"],
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Try to find product in database first
    try {
      const product = await Product.findById(id).lean();

      if (product) {
        return NextResponse.json({
          success: true,
          data: product,
        });
      }
    } catch (dbError) {
      console.log("Database not available, using mock data");
    }

    // Fallback to mock data
    const mockProduct = mockProducts.find((p) => p._id === id || p.slug === id);

    if (!mockProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mockProduct,
    });
  } catch (error) {
    console.error("Product API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
