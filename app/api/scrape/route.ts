import { NextRequest, NextResponse } from "next/server";
import { scrapeProduct, scrapeMultipleProducts } from "@/lib/scrapers";
import { ScrapingRequest } from "@/types/product";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, urls, source } = body;

    // Validate request
    if (!url && !urls) {
      return NextResponse.json(
        { success: false, error: "URL or URLs are required" },
        { status: 400 }
      );
    }

    // Handle single URL
    if (url) {
      const scrapingRequest: ScrapingRequest = { url, source };
      const result = await scrapeProduct(scrapingRequest);

      if (!result.success) {
        return NextResponse.json(result, { status: 400 });
      }

      return NextResponse.json(result);
    }

    // Handle multiple URLs
    if (urls && Array.isArray(urls)) {
      const results = await scrapeMultipleProducts(urls);
      return NextResponse.json({
        success: true,
        data: results,
        message: `Scraped ${results.length} products`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid request format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Product Scraping API",
    endpoints: {
      POST: "/api/scrape",
      description:
        "Scrape product information from Vietnamese e-commerce websites",
      supported_sites: ["thegioididong.com", "dienmayxanh.com"],
      example: {
        single: {
          url: "https://www.thegioididong.com/dtdd/samsung-galaxy-s24-ultra-5g",
        },
        multiple: { urls: ["url1", "url2"] },
      },
    },
  });
}
