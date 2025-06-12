import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async (request: NextRequest) => {
  try {
    // Attempt to connect to MongoDB with specific error handling
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const featured = searchParams.get("featured") === "true";

    const query: Record<string, unknown> = { isPublished: true };

    if (productId) {
      query.productId = productId;
    }

    if (featured) {
      query.isFeatured = true;
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("productId", "title slug images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Reviews GET API Error:", error);

    // Provide specific error messages for different types of errors
    let errorMessage = "Internal server error";
    const statusCode = 500;

    if (error instanceof Error) {
      if (error.name === "MongooseServerSelectionError") {
        errorMessage =
          "Database connection failed. Please check your network connection and try again.";
        console.error(
          "🚨 MongoDB Atlas Connection Issue - Check IP whitelist and connection string"
        );
      } else if (error.name === "MongooseTimeoutError") {
        errorMessage = "Database request timed out. Please try again.";
      } else if ("code" in error && error.code === "ENOTFOUND") {
        errorMessage =
          "Database server not found. Please check your connection settings.";
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: statusCode }
    );
  }
};

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
