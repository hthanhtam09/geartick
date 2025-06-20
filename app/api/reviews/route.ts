import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import "@/lib/models"; // Import all models to ensure registration
import Review from "@/lib/models/Review";
import { currentUser } from "@clerk/nextjs/server";
import { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const featured = searchParams.get("featured") === "true";
    const category = searchParams.get("category");
    const productId = searchParams.get("productId");

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
    const total = await Review.countDocuments(query);

    // Get reviews with pagination
    const skip = (page - 1) * limit;
    const reviews = await Review.find(query)
      .populate("productId", "title slug images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Basic validation
    const requiredFields = [
      "title",
      "content",
      "rating",
      "productId",
      "pros",
      "cons",
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

    // Generate slug if not provided
    if (!body.slug) {
      const slugify = (await import("slugify")).default;
      body.slug = slugify(body.title, { lower: true, strict: true });
    }

    // Add author information
    body.authorId = user.id;
    body.authorName = user.fullName || user.username || "Anonymous";
    body.authorImage = user.imageUrl;

    const review = new Review(body);
    await review.save();

    return NextResponse.json(
      {
        success: true,
        data: review,
        message: "Review created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Reviews POST API Error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { success: false, message: "Review slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
