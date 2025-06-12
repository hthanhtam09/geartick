"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  ArrowRight,
  Trophy,
  TrendingUp,
  Star,
  Filter,
} from "lucide-react";
import { ComparisonTable } from "@/types";

interface ComparisonsListProps {
  comparisons: ComparisonTable[];
  locale: string;
  category?: string;
  sort?: string;
}

const ComparisonsList: React.FC<ComparisonsListProps> = ({
  comparisons,
  locale,
  category,
  sort,
}) => {
  const [sortBy, setSortBy] = useState(sort || "newest");
  const [selectedCategory, setSelectedCategory] = useState(category || "all");

  // Filter and sort comparisons
  const filteredComparisons = comparisons
    .filter(
      (comparison) =>
        selectedCategory === "all" || comparison.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.views - a.views;
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "smartphones", name: "Smartphones" },
    { id: "laptops", name: "Laptops" },
    { id: "headphones", name: "Headphones" },
    { id: "tablets", name: "Tablets" },
    { id: "smartwatches", name: "Smartwatches" },
  ];

  const sortOptions = [
    { id: "newest", name: "Newest First" },
    { id: "popular", name: "Most Popular" },
    { id: "oldest", name: "Oldest First" },
  ];

  const handleCategoryChange = (categoryId: string): void => {
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (sortId: string): void => {
    setSortBy(sortId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filters */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Filter */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="lg:w-64">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Sort By
            </h3>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {filteredComparisons.length} comparison
          {filteredComparisons.length !== 1 ? "s" : ""} found
          {selectedCategory !== "all" && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {categories.find((c) => c.id === selectedCategory)?.name}
            </span>
          )}
        </p>
      </div>

      {/* Comparisons Grid */}
      {filteredComparisons.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
            No comparisons found
          </p>
          <p className="text-gray-400 dark:text-gray-500">
            Try adjusting your filters or check back later for new comparisons.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredComparisons.map((comparison, index) => (
            <motion.article
              key={comparison._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Header */}
              <div className="p-8 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      {comparison.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    {comparison.views.toLocaleString()} views
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {comparison.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {comparison.description}
                </p>
              </div>

              {/* Products Preview */}
              <div className="px-8 pb-6">
                <div className="grid grid-cols-3 gap-4">
                  {comparison.products
                    .slice(0, 3)
                    .map((product, productIndex) => (
                      <div
                        key={product._id}
                        className="text-center group-hover:scale-105 transition-transform duration-300"
                        style={{ transitionDelay: `${productIndex * 50}ms` }}
                      >
                        <div className="relative aspect-square mb-3 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={
                              product.images[0] || "/placeholder-product.jpg"
                            }
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 33vw, 20vw"
                          />
                          {/* Winner Badge */}
                          {comparison.winner?.overall === product._id && (
                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1 rounded-full">
                              <Trophy className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                          {product.title}
                        </h4>
                        <div className="flex items-center justify-center gap-1 text-xs">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {product.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                          ${product.price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Winner Summary */}
              {comparison.winner && (
                <div className="px-8 pb-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Winner Summary
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-600 dark:text-gray-400">
                          Overall
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {
                            comparison.products.find(
                              (p) => p._id === comparison.winner?.overall
                            )?.brand
                          }
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600 dark:text-gray-400">
                          Best Value
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {
                            comparison.products.find(
                              (p) => p._id === comparison.winner?.bestValue
                            )?.brand
                          }
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600 dark:text-gray-400">
                          Premium
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {
                            comparison.products.find(
                              (p) => p._id === comparison.winner?.premium
                            )?.brand
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {comparison.authorName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {comparison.authorName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comparison.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/comparisons/${comparison.slug}`}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200 group"
                  >
                    View Comparison
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComparisonsList;
