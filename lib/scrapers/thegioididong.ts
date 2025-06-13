import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { ScrapedProduct } from "@/types/product";

export const thegioididongScraper = async (
  url: string
): Promise<ScrapedProduct> => {
  // Use Puppeteer for dynamic content
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navigate to the page
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for content to load
    await page.waitForSelector(".product-info", { timeout: 10000 });

    // Get the HTML content
    const html = await page.content();
    const $ = cheerio.load(html);

    // Extract product information
    const name =
      $(".product-info h1").text().trim() || $(".product-name").text().trim();
    const brand = $(".product-info .brand").text().trim() || name.split(" ")[0];

    // Extract price
    const priceText =
      $(".product-info .price").text().trim() ||
      $(".price-current").text().trim();
    const price = extractPrice(priceText);

    // Extract description
    const description =
      $(".product-info .description").text().trim() ||
      $(".product-detail .content").text().trim() ||
      $(".product-info p").first().text().trim();

    // Extract images
    const images: { url: string; alt?: string }[] = [];
    $(".product-info img, .product-image img").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src");
      const alt = $(el).attr("alt") || "";
      if (src && !src.includes("placeholder")) {
        images.push({
          url: src.startsWith("http")
            ? src
            : `https://www.thegioididong.com${src}`,
          alt,
        });
      }
    });

    // Extract specifications
    const specifications: { name: string; value: string }[] = [];
    $(".product-info .specs li, .product-detail .specification li").each(
      (_, el) => {
        const text = $(el).text().trim();
        if (text.includes(":")) {
          const [name, value] = text.split(":").map((s) => s.trim());
          if (name && value) {
            specifications.push({ name, value });
          }
        }
      }
    );

    // Extract rating
    const ratingText = $(".product-info .rating").text().trim();
    const rating = extractRating(ratingText);

    // Generate ID from URL
    const id =
      url
        .split("/")
        .pop()
        ?.replace(/[^a-zA-Z0-9-]/g, "") || `tgd-${Date.now()}`;

    return {
      id,
      name,
      brand,
      price: {
        current: price,
        currency: "VND",
      },
      description,
      images,
      specifications,
      reviews: [], // Reviews would need additional scraping
      rating,
      availability: true, // Assume available if page loads
      url,
      source: "thegioididong",
      scrapedAt: new Date(),
    };
  } finally {
    await browser.close();
  }
};

const extractPrice = (priceText: string): number => {
  const priceMatch = priceText.match(/[\d,]+/);
  if (priceMatch) {
    return parseInt(priceMatch[0].replace(/,/g, ""));
  }
  return 0;
};

const extractRating = (
  ratingText: string
): { average: number; count: number } => {
  const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
  const countMatch = ratingText.match(/\((\d+)\)/);

  return {
    average: ratingMatch ? parseFloat(ratingMatch[1]) : 0,
    count: countMatch ? parseInt(countMatch[1]) : 0,
  };
};
