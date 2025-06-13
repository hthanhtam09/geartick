import {
  ScrapedProduct,
  ScrapingRequest,
  ScrapingResponse,
} from "@/types/product";
import { thegioididongScraper } from "./thegioididong";
import { dienmayxanhScraper } from "./dienmayxanh";

// Rate limiting: 1 request per 2 seconds
const RATE_LIMIT_DELAY = 2000;
let lastRequestTime = 0;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const detectSource = (url: string): "thegioididong" | "dienmayxanh" => {
  if (url.includes("thegioididong.com")) return "thegioididong";
  if (url.includes("dienmayxanh.com")) return "dienmayxanh";
  throw new Error(
    "Unsupported website. Only thegioididong.com and dienmayxanh.com are supported."
  );
};

const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes("thegioididong.com") ||
      urlObj.hostname.includes("dienmayxanh.com")
    );
  } catch {
    return false;
  }
};

export const scrapeProduct = async (
  request: ScrapingRequest
): Promise<ScrapingResponse> => {
  try {
    // Validate URL
    if (!validateUrl(request.url)) {
      return {
        success: false,
        error:
          "Invalid URL. Only thegioididong.com and dienmayxanh.com are supported.",
      };
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await delay(RATE_LIMIT_DELAY - timeSinceLastRequest);
    }
    lastRequestTime = Date.now();

    // Detect source if not provided
    const source = request.source || detectSource(request.url);

    // Scrape based on source
    let scrapedData: ScrapedProduct;

    switch (source) {
      case "thegioididong":
        scrapedData = await thegioididongScraper(request.url);
        break;
      case "dienmayxanh":
        scrapedData = await dienmayxanhScraper(request.url);
        break;
      default:
        throw new Error("Unsupported source");
    }

    return {
      success: true,
      data: scrapedData,
      message: "Product scraped successfully",
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const scrapeMultipleProducts = async (
  urls: string[]
): Promise<ScrapingResponse[]> => {
  const results: ScrapingResponse[] = [];

  for (const url of urls) {
    const result = await scrapeProduct({ url });
    results.push(result);

    // Add delay between requests
    if (urls.indexOf(url) < urls.length - 1) {
      await delay(RATE_LIMIT_DELAY);
    }
  }

  return results;
};
