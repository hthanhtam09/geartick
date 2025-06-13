import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Comparison, Product } from "@/lib/models";
import { ApiResponse } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    // First find the comparison to get its ID
    const comparisonDoc = await Comparison.findOne({ slug, isPublished: true });

    if (!comparisonDoc) {
      return NextResponse.json(
        { success: false, message: "Comparison not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await Comparison.findByIdAndUpdate(comparisonDoc._id, {
      $inc: { views: 1 },
    });

    // Get the full populated comparison
    const comparison = await Comparison.findById(comparisonDoc._id)
      .populate("products")
      .lean();

    const response: ApiResponse<typeof comparison> = {
      success: true,
      message: "Comparison fetched successfully",
      data: comparison,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching comparison:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch comparison" },
      { status: 500 }
    );
  }
}
