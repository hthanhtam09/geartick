import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";
import { currentUser } from "@clerk/nextjs/server";
import { ApiResponse } from "@/types";

// Mock data for when database is not available
const mockReviews = [
  {
    _id: "1",
    productId: {
      title: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      ],
    },
    title: "iPhone 15 Pro Max: The Ultimate Camera Phone?",
    content:
      "After spending three weeks with the iPhone 15 Pro Max, I can confidently say this is Apple's most impressive smartphone yet. The titanium design feels premium in hand, and the A17 Pro chip delivers exceptional performance for both everyday tasks and demanding applications.",
    rating: 4.8,
    pros: [
      "Exceptional camera system with 5x zoom",
      "Premium titanium build quality",
      "A17 Pro chip delivers outstanding performance",
      "USB-C finally arrives",
      "Action Button adds useful customization",
    ],
    cons: [
      "Very expensive starting price",
      "Limited USB-C features compared to Android",
      "Heavy compared to previous models",
      "No significant battery life improvement",
    ],
    verdict:
      "The iPhone 15 Pro Max is the best iPhone ever made, offering exceptional camera capabilities, premium build quality, and outstanding performance.",
    authorId: "tech_reviewer_1",
    authorName: "Sarah Chen",
    authorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
    ],
    slug: "iphone-15-pro-max-ultimate-camera-phone-review",
    likes: 234,
    views: 12500,
    isPublished: true,
    isFeatured: true,
    seoTitle: "iPhone 15 Pro Max Review - Best Camera Phone 2024",
    seoDescription:
      "Comprehensive review of iPhone 15 Pro Max with titanium design, A17 Pro chip, and advanced camera system with 5x telephoto zoom.",
    tags: ["smartphone", "apple", "camera", "premium", "photography"],
    readTime: 8,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "2",
    productId: {
      title: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      images: [
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop",
      ],
    },
    title: "Samsung Galaxy S24 Ultra: AI-Powered Excellence",
    content:
      "The Samsung Galaxy S24 Ultra represents the pinnacle of Android smartphone technology, combining cutting-edge AI features with premium hardware. After extensive testing, I'm impressed by how Samsung has integrated AI into every aspect of the user experience.",
    rating: 4.7,
    pros: [
      "Revolutionary AI features",
      "Excellent S Pen integration",
      "200MP camera with great detail",
      "Premium titanium build",
      "Long battery life",
    ],
    cons: [
      "Very expensive",
      "Large and heavy design",
      "Complex One UI interface",
      "Limited availability of some AI features",
    ],
    verdict:
      "The Samsung Galaxy S24 Ultra is the most advanced Android smartphone available, with AI features that genuinely enhance the user experience.",
    authorId: "tech_reviewer_2",
    authorName: "Michael Rodriguez",
    authorImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop",
    ],
    slug: "samsung-galaxy-s24-ultra-ai-powered-excellence-review",
    likes: 189,
    views: 9870,
    isPublished: true,
    isFeatured: true,
    seoTitle: "Samsung Galaxy S24 Ultra Review - Best AI Smartphone 2024",
    seoDescription:
      "In-depth review of Samsung Galaxy S24 Ultra with revolutionary AI features, S Pen, and 200MP camera system.",
    tags: ["smartphone", "samsung", "ai", "s-pen", "productivity"],
    readTime: 7,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    _id: "3",
    productId: {
      title: "Google Pixel 8 Pro",
      slug: "google-pixel-8-pro",
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      ],
    },
    title: "Google Pixel 8 Pro: AI Photography Master",
    content:
      "Google's Pixel 8 Pro continues the company's tradition of computational photography excellence while adding powerful AI features that enhance the overall user experience. This is the phone for those who prioritize photography and AI integration.",
    rating: 4.6,
    pros: [
      "Best computational photography",
      "Pure Android experience",
      "Seven years of updates",
      "Excellent AI features",
      "Great value proposition",
    ],
    cons: [
      "Familiar design",
      "Average battery life",
      "Limited availability",
      "No expandable storage",
    ],
    verdict:
      "The Google Pixel 8 Pro offers the best computational photography experience available, combined with pure Android and excellent AI features.",
    authorId: "tech_reviewer_3",
    authorName: "Emily Watson",
    authorImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
    ],
    slug: "google-pixel-8-pro-ai-photography-master-review",
    likes: 156,
    views: 8230,
    isPublished: true,
    isFeatured: true,
    seoTitle: "Google Pixel 8 Pro Review - Best AI Photography Phone 2024",
    seoDescription:
      "Complete review of Google Pixel 8 Pro with unmatched computational photography and AI features.",
    tags: ["smartphone", "google", "photography", "ai", "android"],
    readTime: 6,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    _id: "4",
    productId: {
      title: "Apple Watch Series 9",
      slug: "apple-watch-series-9",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
      ],
    },
    title: "Apple Watch Series 9: Health Monitoring Excellence",
    content:
      "The Apple Watch Series 9 continues Apple's dominance in the smartwatch market with incremental improvements that enhance the overall user experience. While the changes are subtle, they add up to create the most refined Apple Watch yet.",
    rating: 4.8,
    pros: [
      "Excellent health monitoring",
      "Useful Double Tap gesture",
      "Smooth performance",
      "Great ecosystem integration",
      "Accurate sensors",
    ],
    cons: [
      "Expensive",
      "Short battery life",
      "iPhone only",
      "Incremental improvements",
    ],
    verdict:
      "The Apple Watch Series 9 is the most refined Apple Watch yet, with useful new features like Double Tap and improved health monitoring.",
    authorId: "tech_reviewer_5",
    authorName: "Lisa Thompson",
    authorImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop",
    ],
    slug: "apple-watch-series-9-health-monitoring-excellence-review",
    likes: 198,
    views: 10560,
    isPublished: true,
    isFeatured: true,
    seoTitle: "Apple Watch Series 9 Review - Best Smartwatch 2024",
    seoDescription:
      "Comprehensive review of Apple Watch Series 9 with Double Tap gesture and advanced health features.",
    tags: ["smartwatch", "apple", "health", "fitness", "premium"],
    readTime: 6,
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-01-30"),
  },
  {
    _id: "5",
    productId: {
      title: "MacBook Pro 14-inch M3",
      slug: "macbook-pro-14-m3",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
      ],
    },
    title: "MacBook Pro 14-inch M3: Creative Powerhouse",
    content:
      "The MacBook Pro 14-inch with M3 chip represents the pinnacle of Apple's laptop engineering, offering exceptional performance for creative professionals and developers. This is the laptop that redefines what's possible in a portable form factor.",
    rating: 4.9,
    pros: [
      "Exceptional M3 performance",
      "Stunning Liquid Retina XDR display",
      "22-hour battery life",
      "Premium build quality",
      "Comprehensive port selection",
    ],
    cons: [
      "Very expensive",
      "Limited upgradeability",
      "No touch screen",
      "Heavy for 14-inch laptop",
    ],
    verdict:
      "The MacBook Pro 14-inch with M3 chip is the ultimate creative laptop, offering desktop-class performance in a portable form factor.",
    authorId: "tech_reviewer_6",
    authorName: "Alex Johnson",
    authorImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop",
    ],
    slug: "macbook-pro-14-inch-m3-creative-powerhouse-review",
    likes: 267,
    views: 14230,
    isPublished: true,
    isFeatured: true,
    seoTitle: "MacBook Pro 14-inch M3 Review - Best Creative Laptop 2024",
    seoDescription:
      "Complete review of MacBook Pro 14-inch with M3 chip, perfect for creative professionals and developers.",
    tags: ["laptop", "apple", "creative", "performance", "professional"],
    readTime: 9,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const featured = searchParams.get("featured") === "true";
    const category = searchParams.get("category");
    const productId = searchParams.get("productId");

    // Try to connect to MongoDB
    let dbConnected = false;
    try {
      await connectDB();
      dbConnected = true;
    } catch {
      console.log("⚠️ MongoDB not available, using mock data");
      dbConnected = false;
    }

    let reviews = [];
    let total = 0;

    if (dbConnected) {
      // Build query
      const query: Record<string, unknown> = { isPublished: true };

      if (featured) {
        query.isFeatured = true;
      }

      if (category) {
        query.tags = { $in: [category.toLowerCase()] };
      }

      if (productId) {
        query.productId = productId;
      }

      // Get total count
      total = await Review.countDocuments(query);

      // Get reviews with pagination
      const skip = (page - 1) * limit;
      reviews = await Review.find(query)
        .populate("productId", "title slug images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    } else {
      // Use mock data
      let filteredReviews = mockReviews;

      if (featured) {
        filteredReviews = filteredReviews.filter((review) => review.isFeatured);
      }

      if (category) {
        filteredReviews = filteredReviews.filter((review) =>
          review.tags.includes(category.toLowerCase())
        );
      }

      if (productId) {
        filteredReviews = filteredReviews.filter(
          (review) => review.productId.slug === productId
        );
      }

      total = filteredReviews.length;
      const skip = (page - 1) * limit;
      reviews = filteredReviews.slice(skip, skip + limit);
    }

    const pages = Math.ceil(total / limit);

    const response: ApiResponse<typeof reviews> = {
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching reviews:", error);

    // Return mock data as fallback
    const response: ApiResponse<typeof mockReviews> = {
      success: true,
      message: "Using mock data (database unavailable)",
      data: mockReviews.slice(0, 6),
      pagination: {
        page: 1,
        limit: 6,
        total: mockReviews.length,
        pages: Math.ceil(mockReviews.length / 6),
      },
    };

    return NextResponse.json(response);
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "productId",
      "title",
      "content",
      "rating",
      "verdict",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Verify product exists
    const product = await Product.findById(body.productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate read time
    const readTime = Math.ceil(body.content.split(" ").length / 200);

    // Generate slug
    const slugify = (await import("slugify")).default;
    const baseSlug = slugify(body.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await Review.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const reviewData = {
      ...body,
      slug,
      readTime,
      authorId: user.id,
      authorName: user.firstName + " " + user.lastName,
      authorImage: user.imageUrl,
    };

    const review = new Review(reviewData);
    await review.save();

    return NextResponse.json(
      {
        success: true,
        data: review,
        message: "Review created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reviews POST API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
