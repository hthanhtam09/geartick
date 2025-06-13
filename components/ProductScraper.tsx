"use client";

import { useState } from "react";
import { ScrapedProduct, ScrapingResponse } from "@/types/product";
import { Loader2, ExternalLink, Star, ShoppingCart, Info } from "lucide-react";

interface ProductScraperProps {
  className?: string;
}

const ProductScraper: React.FC<ProductScraperProps> = ({ className = "" }) => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ScrapingResponse | null>(null);
  const [error, setError] = useState<string>("");

  const handleScrape = async (): Promise<void> => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data: ScrapingResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to scrape product");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      handleScrape();
    }
  };

  const formatPrice = (price: number, currency: string): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const renderProductCard = (product: ScrapedProduct): React.JSX.Element => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Product Images */}
      {product.images.length > 0 && (
        <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-product.jpg";
            }}
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              +{product.images.length - 1} more
            </div>
          )}
        </div>
      )}

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Brand: {product.brand}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {product.rating.average.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({product.rating.count})
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatPrice(product.price.current, product.price.currency)}
          </div>
          {product.price.original &&
            product.price.original > product.price.current && (
              <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(product.price.original, product.price.currency)}
              </div>
            )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              <Info className="w-4 h-4 mr-1" />
              Description
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {product.description}
            </p>
          </div>
        )}

        {/* Specifications */}
        {product.specifications.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Key Specifications
            </h3>
            <div className="space-y-1">
              {product.specifications.slice(0, 5).map((spec, index) => (
                <div key={index} className="flex text-sm">
                  <span className="text-gray-600 dark:text-gray-400 font-medium min-w-0 flex-1">
                    {spec.name}:
                  </span>
                  <span className="text-gray-900 dark:text-white ml-2">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Original
          </a>
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>

        {/* Source Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Source: {product.source}</span>
            <span>Scraped: {new Date(product.scrapedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Product Information Scraper
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Extract product details from Vietnamese e-commerce websites
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter product URL (thegioididong.com or dienmayxanh.com)"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleScrape}
            disabled={isLoading || !url.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scraping...
              </>
            ) : (
              "Scrape Product"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {result.success && result.data ? (
            renderProductCard(result.data)
          ) : (
            <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-700 dark:text-yellow-400">
                {result.error || "Failed to scrape product information"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Supported Sites Info */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Supported Websites
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">
              thegioididong.com
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">
              dienmayxanh.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScraper;
