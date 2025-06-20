import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { SearchFilters } from "@/types";

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
  {
    _id: "oneplus-12",
    title: "OnePlus 12",
    description: "Fast and smooth performance with Hasselblad camera system",
    slug: "oneplus-12",
    brand: "OnePlus",
    category: "smartphones",
    price: 799,
    originalPrice: 799,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center",
    ],
    specifications: [
      {
        name: "Display",
        value: "6.82-inch LTPO AMOLED",
        category: "Display & Screen",
      },
      {
        name: "Processor",
        value: "Snapdragon 8 Gen 3",
        category: "Configuration & Memory",
      },
      {
        name: "Storage",
        value: "256GB, 512GB",
        category: "Configuration & Memory",
      },
      { name: "RAM", value: "12GB, 16GB", category: "Configuration & Memory" },
      {
        name: "Camera",
        value: "50MP Main + 48MP Ultra Wide + 64MP Telephoto",
        category: "Camera & Screen",
      },
      { name: "Battery", value: "5400mAh", category: "Battery & Charging" },
      {
        name: "Charging",
        value: "100W wired, 50W wireless",
        category: "Battery & Charging",
      },
      {
        name: "Operating System",
        value: "Android 14, OxygenOS 14",
        category: "Software & Features",
      },
      { name: "Water Resistance", value: "IP68", category: "Design & Build" },
      {
        name: "Material",
        value: "Glass back, aluminum frame",
        category: "Design & Build",
      },
    ],
    averageRating: 4.5,
    totalReviews: 5670,
    affiliateUrl: "https://amzn.to/3example4",
    affiliateLinks: [
      { platform: "Amazon", url: "https://amzn.to/3example4", price: 799 },
      { platform: "Best Buy", url: "https://bestbuy.com/example4", price: 799 },
      { platform: "OnePlus", url: "https://oneplus.com/example4", price: 799 },
    ],
    isAvailable: true,
    isFeatured: false,
    tags: ["smartphone", "oneplus", "performance", "hasselblad"],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    _id: "xiaomi-14-ultra",
    title: "Xiaomi 14 Ultra",
    description:
      "Professional photography with Leica optics and variable aperture",
    slug: "xiaomi-14-ultra",
    brand: "Xiaomi",
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
        value: "6.73-inch LTPO AMOLED",
        category: "Display & Screen",
      },
      {
        name: "Processor",
        value: "Snapdragon 8 Gen 3",
        category: "Configuration & Memory",
      },
      {
        name: "Storage",
        value: "512GB, 1TB",
        category: "Configuration & Memory",
      },
      { name: "RAM", value: "16GB", category: "Configuration & Memory" },
      {
        name: "Camera",
        value: "50MP Main + 50MP Ultra Wide + 50MP Telephoto",
        category: "Camera & Screen",
      },
      { name: "Battery", value: "5000mAh", category: "Battery & Charging" },
      {
        name: "Charging",
        value: "90W wired, 80W wireless",
        category: "Battery & Charging",
      },
      {
        name: "Operating System",
        value: "Android 14, HyperOS",
        category: "Software & Features",
      },
      { name: "Water Resistance", value: "IP68", category: "Design & Build" },
      {
        name: "Material",
        value: "Leather back, titanium frame",
        category: "Design & Build",
      },
    ],
    averageRating: 4.4,
    totalReviews: 3420,
    affiliateUrl: "https://amzn.to/3example5",
    affiliateLinks: [
      { platform: "Amazon", url: "https://amzn.to/3example5", price: 1199 },
      {
        platform: "Best Buy",
        url: "https://bestbuy.com/example5",
        price: 1199,
      },
      { platform: "Xiaomi", url: "https://xiaomi.com/example5", price: 1199 },
    ],
    isAvailable: true,
    isFeatured: false,
    tags: ["smartphone", "xiaomi", "leica", "photography", "professional"],
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
];

type SortBy = "newest" | "oldest" | "rating" | "popularity";
type QueryFilter = {
  category?: { $regex: string; $options: string };
  brand?: { $regex: string; $options: string };
  averageRating?: { $gte?: number; $lte?: number };
  $text?: { $search: string };
};
type SortFilter = Record<string, 1 | -1>;

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const filters: SearchFilters = {
      query: searchParams.get("query") || undefined,
      category: searchParams.get("category") || undefined,
      brand: searchParams.get("brand") || undefined,
      minRating: searchParams.get("minRating")
        ? parseFloat(searchParams.get("minRating")!)
        : undefined,
      maxRating: searchParams.get("maxRating")
        ? parseFloat(searchParams.get("maxRating")!)
        : undefined,
      sortBy: (searchParams.get("sortBy") as SortBy) || "newest",
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "12"),
    };

    // Try to get products from database first
    try {
      // Build query
      const query: QueryFilter = {};

      if (filters.category) {
        query.category = { $regex: filters.category, $options: "i" };
      }

      if (filters.brand) {
        query.brand = { $regex: filters.brand, $options: "i" };
      }

      if (filters.minRating || filters.maxRating) {
        query.averageRating = {};
        if (filters.minRating) query.averageRating.$gte = filters.minRating;
        if (filters.maxRating) query.averageRating.$lte = filters.maxRating;
      }

      if (filters.query) {
        query.$text = { $search: filters.query };
      }

      // Build sort
      let sort: SortFilter = {};
      switch (filters.sortBy) {
        case "oldest":
          sort = { createdAt: 1 };
          break;
        case "rating":
          sort = { averageRating: -1, totalReviews: -1 };
          break;
        case "popularity":
          sort = { totalReviews: -1, averageRating: -1 };
          break;
        case "newest":
        default:
          sort = { createdAt: -1 };
          break;
      }

      // Execute query with pagination
      const skip = (filters.page! - 1) * filters.limit!;

      const [products, total] = await Promise.all([
        Product.find(query).sort(sort).skip(skip).limit(filters.limit!).lean(),
        Product.countDocuments(query),
      ]);

      const pages = Math.ceil(total / filters.limit!);

      return NextResponse.json({
        success: true,
        data: products,
        pagination: {
          page: filters.page!,
          limit: filters.limit!,
          total,
          pages,
        },
      });
    } catch (dbError) {
      console.log("Database not available, using mock data");
    }

    // Fallback to mock data
    let filteredProducts = [...mockProducts];

    // Apply filters
    if (filters.category) {
      filteredProducts = filteredProducts.filter((product) =>
        product.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.brand) {
      filteredProducts = filteredProducts.filter((product) =>
        product.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }

    if (filters.minRating) {
      filteredProducts = filteredProducts.filter(
        (product) => product.averageRating >= filters.minRating!
      );
    }

    if (filters.maxRating) {
      filteredProducts = filteredProducts.filter(
        (product) => product.averageRating <= filters.maxRating!
      );
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "oldest":
        filteredProducts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "rating":
        filteredProducts.sort(
          (a, b) =>
            b.averageRating - a.averageRating || b.totalReviews - a.totalReviews
        );
        break;
      case "popularity":
        filteredProducts.sort(
          (a, b) =>
            b.totalReviews - a.totalReviews || b.averageRating - a.averageRating
        );
        break;
      case "newest":
      default:
        filteredProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    // Apply pagination
    const total = filteredProducts.length;
    const skip = (filters.page! - 1) * filters.limit!;
    const paginatedProducts = filteredProducts.slice(
      skip,
      skip + filters.limit!
    );
    const pages = Math.ceil(total / filters.limit!);

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page: filters.page!,
        limit: filters.limit!,
        total,
        pages,
      },
    });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();

    const body = await request.json();

    // Basic validation
    const requiredFields = [
      "title",
      "description",
      "category",
      "brand",
      "price",
      "affiliateUrl",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate slug if not provided
    if (!body.slug) {
      const slugify = (await import("slugify")).default;
      body.slug = slugify(body.title, { lower: true, strict: true });
    }

    const product = new Product(body);
    await product.save();

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Products POST API Error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { success: false, message: "Product slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
