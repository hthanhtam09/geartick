"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import LoadingSpinner from "./LoadingSpinner";

interface ProductSelectorProps {
  onProductsSelected: (products: Product[]) => void;
  maxSelection?: number;
  category?: string;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  onProductsSelected,
  maxSelection = 4,
  category,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    category: category || "",
    brand: "",
    priceRange: "",
    sortBy: "name",
  });

  const categories = [
    "Smartphones",
    "Smartwatches",
    "Laptops",
    "Tablets",
    "Headphones",
    "Gaming",
    "Audio",
  ];

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

      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.brand) params.append("brand", filters.brand);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
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
    fetchProducts();
  }, [filters]);

  const handleProductToggle = (product: Product) => {
    const isSelected = selectedProducts.some((p) => p._id === product._id);

    if (isSelected) {
      setSelectedProducts(
        selectedProducts.filter((p) => p._id !== product._id)
      );
    } else {
      if (selectedProducts.length >= maxSelection) {
        // Remove the first selected product and add the new one
        setSelectedProducts([...selectedProducts.slice(1), product]);
      } else {
        setSelectedProducts([...selectedProducts, product]);
      }
    }
  };

  const handleCompare = () => {
    if (selectedProducts.length >= 2) {
      onProductsSelected(selectedProducts);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredProducts = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 dark:text-red-400 font-medium mb-2">
            Error Loading Products
          </div>
          <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filter Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

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
              onChange={(e) => handleFilterChange("priceRange", e.target.value)}
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
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Selected Products ({selectedProducts.length}/{maxSelection})
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => {
          const isSelected = selectedProducts.some(
            (p) => p._id === product._id
          );
          return (
            <div
              key={product._id}
              className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => handleProductToggle(product)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Product Image */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
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
                    <span className="text-yellow-400">★</span>
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

      {/* No Products Found */}
      {sortedProducts.length === 0 && (
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
            <h3 className="text-lg font-medium mb-2">No Products Found</h3>
            <p className="text-sm">
              Try adjusting your filters to find more products.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
