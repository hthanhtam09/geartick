import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { SearchFilters } from "@/types";

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
      sortBy: (searchParams.get("sortBy") as any) || "newest",
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "12"),
    };

    // Build query
    const query: any = {};

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
    let sort: any = {};
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
  } catch (error: any) {
    console.error("Products POST API Error:", error);

    if (error.code === 11000) {
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
