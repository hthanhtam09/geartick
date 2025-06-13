import { scrapeProduct, scrapeMultipleProducts } from "@/lib/scrapers";
import { ScrapingRequest } from "@/types/product";
import { thegioididongScraper } from "@/lib/scrapers/thegioididong";
import { dienmayxanhScraper } from "@/lib/scrapers/dienmayxanh";

// Mock the scrapers
jest.mock("@/lib/scrapers/thegioididong", () => ({
  thegioididongScraper: jest.fn(),
}));

jest.mock("@/lib/scrapers/dienmayxanh", () => ({
  dienmayxanhScraper: jest.fn(),
}));

describe("Web Scrapers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("scrapeProduct", () => {
    it("should validate URL format", async () => {
      const request: ScrapingRequest = {
        url: "invalid-url",
      };

      const result = await scrapeProduct(request);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid URL");
    });

    it("should detect thegioididong.com source", async () => {
      const request: ScrapingRequest = {
        url: "https://www.thegioididong.com/dtdd/samsung-galaxy-s24-ultra-5g",
      };

      const mockProduct = {
        id: "test-id",
        name: "Samsung Galaxy S24 Ultra",
        brand: "Samsung",
        price: { current: 25000000, currency: "VND" },
        description: "Test description",
        images: [],
        specifications: [],
        reviews: [],
        rating: { average: 4.5, count: 100 },
        availability: true,
        url: request.url,
        source: "thegioididong" as const,
        scrapedAt: new Date(),
      };

      (thegioididongScraper as jest.Mock).mockResolvedValue(mockProduct);

      const result = await scrapeProduct(request);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProduct);
      expect(thegioididongScraper).toHaveBeenCalledWith(request.url);
    });

    it("should detect dienmayxanh.com source", async () => {
      const request: ScrapingRequest = {
        url: "https://www.dienmayxanh.com/dtdd/samsung-galaxy-s24-ultra-5g",
      };

      const mockProduct = {
        id: "test-id",
        name: "Samsung Galaxy S24 Ultra",
        brand: "Samsung",
        price: { current: 25000000, currency: "VND" },
        description: "Test description",
        images: [],
        specifications: [],
        reviews: [],
        rating: { average: 4.5, count: 100 },
        availability: true,
        url: request.url,
        source: "dienmayxanh" as const,
        scrapedAt: new Date(),
      };

      (dienmayxanhScraper as jest.Mock).mockResolvedValue(mockProduct);

      const result = await scrapeProduct(request);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProduct);
      expect(dienmayxanhScraper).toHaveBeenCalledWith(request.url);
    });

    it("should handle scraping errors gracefully", async () => {
      const request: ScrapingRequest = {
        url: "https://www.thegioididong.com/dtdd/test-product",
      };

      (thegioididongScraper as jest.Mock).mockRejectedValue(
        new Error("Scraping failed")
      );

      const result = await scrapeProduct(request);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Scraping failed");
    });

    it("should respect rate limiting", async () => {
      const request1: ScrapingRequest = {
        url: "https://www.thegioididong.com/dtdd/product1",
      };

      const request2: ScrapingRequest = {
        url: "https://www.thegioididong.com/dtdd/product2",
      };

      const mockProduct = {
        id: "test-id",
        name: "Test Product",
        brand: "Test Brand",
        price: { current: 1000000, currency: "VND" },
        description: "Test description",
        images: [],
        specifications: [],
        reviews: [],
        rating: { average: 4.0, count: 50 },
        availability: true,
        url: request1.url,
        source: "thegioididong" as const,
        scrapedAt: new Date(),
      };

      (thegioididongScraper as jest.Mock).mockResolvedValue(mockProduct);

      const startTime = Date.now();

      await scrapeProduct(request1);
      await scrapeProduct(request2);

      const endTime = Date.now();
      const timeDiff = endTime - startTime;

      // Should have at least 2 seconds delay between requests
      expect(timeDiff).toBeGreaterThanOrEqual(1900); // Allow some tolerance
    });
  });

  describe("scrapeMultipleProducts", () => {
    it("should scrape multiple URLs", async () => {
      const urls = [
        "https://www.thegioididong.com/dtdd/product1",
        "https://www.dienmayxanh.com/dtdd/product2",
      ];

      const mockProduct1 = {
        id: "product1",
        name: "Product 1",
        brand: "Brand 1",
        price: { current: 1000000, currency: "VND" },
        description: "Description 1",
        images: [],
        specifications: [],
        reviews: [],
        rating: { average: 4.0, count: 50 },
        availability: true,
        url: urls[0],
        source: "thegioididong" as const,
        scrapedAt: new Date(),
      };

      const mockProduct2 = {
        id: "product2",
        name: "Product 2",
        brand: "Brand 2",
        price: { current: 2000000, currency: "VND" },
        description: "Description 2",
        images: [],
        specifications: [],
        reviews: [],
        rating: { average: 4.5, count: 75 },
        availability: true,
        url: urls[1],
        source: "dienmayxanh" as const,
        scrapedAt: new Date(),
      };

      (thegioididongScraper as jest.Mock).mockResolvedValue(mockProduct1);
      (dienmayxanhScraper as jest.Mock).mockResolvedValue(mockProduct2);

      const results = await scrapeMultipleProducts(urls);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[0].data).toEqual(mockProduct1);
      expect(results[1].success).toBe(true);
      expect(results[1].data).toEqual(mockProduct2);
    });

    it("should handle mixed success and failure", async () => {
      const urls = [
        "https://www.thegioididong.com/dtdd/product1",
        "https://www.dienmayxanh.com/dtdd/product2",
      ];

      (thegioididongScraper as jest.Mock).mockResolvedValue({
        id: "product1",
        name: "Product 1",
        brand: "Brand 1",
        price: { current: 1000000, currency: "VND" },
        description: "Description 1",
        images: [],
        specifications: [],
        reviews: [],
        rating: { average: 4.0, count: 50 },
        availability: true,
        url: urls[0],
        source: "thegioididong" as const,
        scrapedAt: new Date(),
      });

      (dienmayxanhScraper as jest.Mock).mockRejectedValue(
        new Error("Scraping failed")
      );

      const results = await scrapeMultipleProducts(urls);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toBe("Scraping failed");
    });
  });
});
