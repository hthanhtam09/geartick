"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { X, Star, Check, X as XIcon } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

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
  const [filters, setFilters] = useState({
    brand: "",
    priceRange: "",
    sortBy: "name",
  });

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
  ];

  const priceRanges = [
    { label: "All Prices", value: "" },
    { label: "Under $200", value: "0-200" },
    { label: "$200 - $500", value: "200-500" },
    { label: "$500 - $1000", value: "500-1000" },
    { label: "$1000+", value: "1000+" },
  ];

  const sortOptions = [
    { label: "Name A-Z", value: "name" },
    { label: "Price Low to High", value: "price-asc" },
    { label: "Price High to Low", value: "price-desc" },
    { label: "Rating High to Low", value: "rating-desc" },
    { label: "Newest First", value: "newest" },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        category: currentProduct.category,
        limit: "50",
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
        // Filter out the current product from the list
        const filteredProducts = data.data.filter(
          (product: Product) => product._id !== currentProduct._id
        );
        setProducts(filteredProducts);
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
      if (selectedProducts.length >= 4) {
        // Remove the first selected product and add the new one
        setSelectedProducts([...selectedProducts.slice(1), product]);
      } else {
        setSelectedProducts([...selectedProducts, product]);
      }
    }
  };

  const handleCompare = () => {
    if (selectedProducts.length >= 2) {
      // Create comparison URL with selected products
      const productSlugs = selectedProducts.map((p) => p.slug).join("-vs-");
      window.open(`/${locale}/comparisons/${productSlugs}`, "_blank");
      onClose();
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredProducts = products.filter((product) => {
    if (filters.brand && product.brand !== filters.brand) return false;

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (max) {
        if (product.price < min || product.price > max) return false;
      } else {
        if (product.price < min) return false;
      }
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
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return a.title.localeCompare(b.title);
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Compare {currentProduct.title} with Similar Products
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Select up to 3 additional products to compare
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>

          {/* Selected Products Summary */}
          {selectedProducts.length > 1 && (
            <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Selected Products ({selectedProducts.length}/4)
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    {selectedProducts.map((p) => p.title).join(", ")}
                  </p>
                </div>
                <button
                  onClick={handleCompare}
                  disabled={selectedProducts.length < 2}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                >
                  Compare {selectedProducts.length} Products
                </button>
              </div>
            </div>
          )}

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedProducts.map((product) => {
                  const isSelected = selectedProducts.some(
                    (p) => p._id === product._id
                  );
                  return (
                    <div
                      key={product._id}
                      className={`relative bg-white dark:bg-gray-700 rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                        isSelected
                          ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                      onClick={() => handleProductToggle(product)}
                    >
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <Check className="w-4 h-4" />
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
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ${product.price}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                              {product.averageRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{product.brand}</span>
                          <span>{product.category}</span>
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
                    No Similar Products Found
                  </h3>
                  <p className="text-sm">
                    Try adjusting your filters to find more products.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCompare}
                disabled={selectedProducts.length < 2}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
              >
                Compare {selectedProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
