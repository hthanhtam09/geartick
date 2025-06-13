import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Comparison, Product } from "@/lib/models";
import { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";

    // Build query
    const query: Record<string, unknown> = { isPublished: true };

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // Build sort
    let sortQuery: Record<string, 1 | -1> = {};
    switch (sort) {
      case "oldest":
        sortQuery = { createdAt: 1 };
        break;
      case "popularity":
        sortQuery = { views: -1, createdAt: -1 };
        break;
      case "newest":
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    // Get total count
    const total = await Comparison.countDocuments(query);

    // Get comparisons with pagination
    const skip = (page - 1) * limit;
    const comparisons = await Comparison.find(query)
      .populate(
        "products",
        "title slug images brand price averageRating totalReviews"
      )
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const pages = Math.ceil(total / limit);

    const response: ApiResponse<typeof comparisons> = {
      success: true,
      message: "Comparisons fetched successfully",
      data: comparisons,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching comparisons:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch comparisons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Basic validation
    const requiredFields = ["title", "description", "category", "products"];
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

    const comparison = new Comparison(body);
    await comparison.save();

    return NextResponse.json(
      {
        success: true,
        data: comparison,
        message: "Comparison created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Comparisons POST API Error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { success: false, message: "Comparison slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
