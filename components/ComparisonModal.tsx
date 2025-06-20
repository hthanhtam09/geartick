"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { X, Star, Check, Plus, GitCompare, Search, Filter } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProduct: Product;
  locale: string;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  currentProduct,
  locale,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([
    currentProduct,
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    brand: "",
    priceRange: "",
    sortBy: "name",
  });
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const [isComparing, setIsComparing] = useState(false);

  const brands = [
    "Apple",
    "Samsung",
    "Google",
    "OnePlus",
    "Garmin",
    "Dell",
    "Lenovo",
    "Sony",
    "Nintendo",
    "Asus",
    "HP",
    "Acer",
    "MSI",
    "Razer",
    "Logitech",
    "Corsair",
    "SteelSeries",
    "Bose",
    "JBL",
    "Sennheiser",
  ];

  const priceRanges = [
    { label: "All Prices", value: "" },
    { label: "Under $100", value: "0-100" },
    { label: "$100 - $300", value: "100-300" },
    { label: "$300 - $500", value: "300-500" },
    { label: "$500 - $1000", value: "500-1000" },
    { label: "$1000+", value: "1000+" },
  ];

  const sortOptions = [
    { label: "Name A-Z", value: "name" },
    { label: "Price Low to High", value: "price-asc" },
    { label: "Price High to Low", value: "price-desc" },
    { label: "Rating High to Low", value: "rating-desc" },
    { label: "Newest First", value: "newest" },
    { label: "Most Reviews", value: "reviews" },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use exact category match for better filtering
      const params = new URLSearchParams({
        category: currentProduct.category,
        limit: "100",
      });

      if (filters.brand) params.append("brand", filters.brand);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      if (data.success) {
        // Filter out the current product and ensure exact category match
        const filteredProducts = data.data.filter(
          (product: Product) =>
            product._id !== currentProduct._id &&
            product.category.toLowerCase() ===
              currentProduct.category.toLowerCase()
        );

        // Sort by relevance (similar price range, brand, etc.)
        const sortedProducts = filteredProducts.sort(
          (a: Product, b: Product) => {
            // First priority: same brand
            const aSameBrand =
              a.brand.toLowerCase() === currentProduct.brand.toLowerCase();
            const bSameBrand =
              b.brand.toLowerCase() === currentProduct.brand.toLowerCase();
            if (aSameBrand && !bSameBrand) return -1;
            if (!aSameBrand && bSameBrand) return 1;

            // Second priority: similar price range (within 50% of current product price)
            const currentPrice = currentProduct.price;
            const aPriceDiff = Math.abs(a.price - currentPrice) / currentPrice;
            const bPriceDiff = Math.abs(b.price - currentPrice) / currentPrice;
            if (aPriceDiff < 0.5 && bPriceDiff >= 0.5) return -1;
            if (aPriceDiff >= 0.5 && bPriceDiff < 0.5) return 1;

            // Third priority: rating
            return b.averageRating - a.averageRating;
          }
        );

        setProducts(sortedProducts);
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen, filters, currentProduct.category]);

  const handleProductToggle = (product: Product) => {
    const isSelected = selectedProducts.some((p) => p._id === product._id);

    if (isSelected) {
      setSelectedProducts(
        selectedProducts.filter((p) => p._id !== product._id)
      );
    } else {
      if (selectedProducts.length >= 5) {
        // Show a toast or alert that max products reached
        alert(
          "You can compare up to 5 products at a time. Please remove one product first."
        );
        return;
      }
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
  };

  const handleCompare = () => {
    if (selectedProducts.length >= 2) {
      setIsComparing(true);
      const productSlugs = selectedProducts.map((p) => p.slug).join("-vs-");
      router.push(`/${locale}/comparisons/${productSlugs}`);
      setTimeout(() => setIsComparing(false), 1000); // fallback in case navigation is slow
      onClose();
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredProducts = products.filter((product) => {
    // Search filter - prioritize title and brand matches
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = product.title.toLowerCase().includes(query);
      const brandMatch = product.brand.toLowerCase().includes(query);
      const descriptionMatch = product.description
        .toLowerCase()
        .includes(query);

      // Prioritize title matches, then brand, then description
      if (!titleMatch && !brandMatch && !descriptionMatch) {
        return false;
      }
    }

    // Brand filter
    if (filters.brand && product.brand !== filters.brand) return false;

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (max) {
        if (product.price < min || product.price > max) return false;
      } else {
        if (product.price < min) return false;
      }
    }

    // Ensure exact category match
    if (
      product.category.toLowerCase() !== currentProduct.category.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.averageRating - a.averageRating;
      case "reviews":
        return b.totalReviews - a.totalReviews;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const formatPrice = (price: number, currency: string): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300"
        aria-label="Close modal"
        onClick={onClose}
      />
      {/* Modal panel with animation */}
      <div className="relative w-full max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-0 animate-fadeInScale overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Compare {currentProduct.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Select up to 4 additional {currentProduct.category} to compare
              (same product type only)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCompare}
              disabled={selectedProducts.length < 2 || isComparing}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedProducts.length >= 2 && !isComparing
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
              aria-label="Compare selected products"
            >
              {isComparing ? (
                <LoadingSpinner className="w-4 h-4" />
              ) : (
                <GitCompare className="w-4 h-4" />
              )}
              {selectedProducts.length >= 2
                ? `Compare ${selectedProducts.length} Products`
                : "Select 2+ Products"}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* Selected Products Section */}
        <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Selected {currentProduct.category} ({selectedProducts.length}/5)
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                {selectedProducts.length >= 2
                  ? `Ready to compare ${selectedProducts.length} products`
                  : `Select at least 2 ${currentProduct.category} to compare`}
              </p>
            </div>
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    className={`w-2 h-2 rounded-full ${
                      num <= selectedProducts.length
                        ? "bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                {selectedProducts.length}/5
              </span>
            </div>
          </div>
          {/* Selected Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {selectedProducts.map((product) => (
              <div
                key={product._id}
                className={`relative bg-gradient-to-br from-blue-100/60 dark:from-blue-900/30 to-white dark:to-gray-800 rounded-xl p-3 border-2 transition-all duration-200 shadow-sm group focus-within:ring-2 focus-within:ring-blue-500 ${
                  product._id === currentProduct._id
                    ? "border-green-400 dark:border-green-600 ring-2 ring-green-200 dark:ring-green-700"
                    : "border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-500"
                } animate-fadeIn`}
                tabIndex={0}
                aria-label={`Selected product: ${product.title}`}
              >
                {/* Remove Button */}
                {product._id !== currentProduct._id && (
                  <button
                    onClick={() => handleRemoveProduct(product._id)}
                    className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full p-1 shadow-md hover:bg-red-500 hover:text-white transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label={`Remove ${product.title} from selection`}
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-tr from-blue-200/60 dark:from-blue-900/40 to-white dark:to-gray-700 group-hover:scale-105 transition-transform duration-200">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {product.title}
                    </h4>
                    <div className="flex gap-1 mt-1">
                      <span className="px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold">
                        {product.brand}
                      </span>
                      <span className="px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </div>
                  </div>
                  {/* Animated checkmark for selected */}
                  <div
                    className={`ml-2 flex items-center transition-all duration-200 ${
                      product._id === currentProduct._id ? "" : "opacity-100"
                    }`}
                  >
                    <span
                      className={`inline-block w-6 h-6 rounded-full border-2 ${
                        product._id === currentProduct._id
                          ? "border-green-400 dark:border-green-600 bg-green-100 dark:bg-green-900"
                          : "border-blue-400 dark:border-blue-600 bg-blue-100 dark:bg-blue-900"
                      } flex items-center justify-center animate-popIn`}
                    >
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {/* Add Product Placeholder */}
            {selectedProducts.length < 5 && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center min-h-[72px] animate-fadeIn">
                <div className="text-center">
                  <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Add Product
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) =>
                    handleFilterChange("priceRange", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-600 dark:text-red-400 font-medium mb-2">
                  Error Loading Products
                </div>
                <p className="text-red-500 dark:text-red-300 text-sm">
                  {error}
                </p>
                <button
                  onClick={fetchProducts}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedProducts.map((product) => {
                const isSelected = selectedProducts.some(
                  (p) => p._id === product._id
                );
                const isCurrentProduct = product._id === currentProduct._id;

                return (
                  <div
                    key={product._id}
                    className={`relative bg-white dark:bg-gray-700 rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                        : "border-gray-200 dark:border-gray-600"
                    } ${
                      isCurrentProduct ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() =>
                      !isCurrentProduct && handleProductToggle(product)
                    }
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}

                    {/* Current Product Badge */}
                    {isCurrentProduct && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className="bg-green-500 text-white rounded-full px-2 py-1 text-xs font-medium">
                          Current
                        </div>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 dark:bg-gray-600 rounded-t-lg overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-12 h-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
                          {product.category}
                        </span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            {product.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatPrice(product.price, product.currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{product.brand}</span>
                        <span>
                          {product.totalReviews.toLocaleString()} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* No Products Found */}
          {!loading && !error && sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500 dark:text-gray-400">
                <svg
                  className="mx-auto h-16 w-16 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <h3 className="text-lg font-medium mb-2">
                  No Similar {currentProduct.category} Found
                </h3>
                <p className="text-sm mb-4">
                  We couldn't find other {currentProduct.category} to compare
                  with {currentProduct.title}.
                </p>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  <p>Try adjusting your filters or search terms.</p>
                  <p>
                    Only {currentProduct.category} can be compared with this
                    product.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedProducts.length >= 2 ? (
                <span className="text-green-600 dark:text-green-400">
                  Ready to compare {selectedProducts.length}{" "}
                  {currentProduct.category}
                </span>
              ) : (
                <span>
                  Select at least 2 {currentProduct.category} to compare
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCompare}
                disabled={selectedProducts.length < 2}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <GitCompare className="w-4 h-4" />
                Compare {selectedProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Compare Button - Appears when 2+ products selected */}
      {selectedProducts.length >= 2 && (
        <div className="fixed bottom-6 right-6 z-60">
          <button
            onClick={handleCompare}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <GitCompare className="w-5 h-5" />
            Compare {selectedProducts.length} Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ComparisonModal;
