import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { ApiResponse } from "@/types";

export async function GET() {
  try {
    await connectDB();

    // Aggregate to get categories with product counts
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Transform the data to match the expected format
    const formattedCategories = categories.map((cat) => ({
      name: cat._id,
      count: `${cat.count}+ Products`,
    }));

    const response: ApiResponse<typeof formattedCategories> = {
      success: true,
      message: "Categories fetched successfully",
      data: formattedCategories,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
