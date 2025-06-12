import { NextResponse } from "next/server";
import { seedProducts } from "@/lib/seed-products";

export const POST = async () => {
  try {
    const products = await seedProducts();

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${products.length} products`,
      data: products,
    });
  } catch (error) {
    console.error("Seed API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to seed products" },
      { status: 500 }
    );
  }
};
