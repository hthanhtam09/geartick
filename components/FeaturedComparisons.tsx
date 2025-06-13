"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Eye, Users } from "lucide-react";
import { ComparisonTable } from "@/types";
import OptimizedImage from "./OptimizedImage";

interface FeaturedComparisonsProps {
  locale: string;
}

const FeaturedComparisons: React.FC<FeaturedComparisonsProps> = ({
  locale,
}) => {
  const [comparisons, setComparisons] = useState<ComparisonTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedComparisons = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/comparisons?limit=3");
        if (!response.ok) {
          throw new Error("Failed to fetch featured comparisons");
        }

        const data = await response.json();
        if (data.success) {
          setComparisons(data.data);
        } else {
          throw new Error(
            data.message || "Failed to fetch featured comparisons"
          );
        }
      } catch (error) {
        console.error("Error fetching featured comparisons:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedComparisons();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-t-2xl"></div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-b-2xl">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (comparisons.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No featured comparisons available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Featured Comparisons
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Side-by-side comparisons to help you choose the best product for
            your needs
          </motion.p>
        </div>

        {/* Comparisons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {comparisons.map((comparison, index) => (
            <motion.article
              key={comparison._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              {/* Comparison Image */}
              <div className="relative h-48 overflow-hidden">
                <OptimizedImage
                  src={
                    comparison.products?.[0]?.images?.[0] ||
                    "/placeholder-comparison.jpg"
                  }
                  alt={comparison.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {comparison.category}
                  </span>
                </div>

                {/* Views */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-white text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{comparison.views.toLocaleString()}</span>
                </div>
              </div>

              {/* Comparison Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {comparison.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {comparison.description}
                  </p>
                </div>

                {/* Products Count */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Users className="w-4 h-4" />
                  <span>
                    {comparison.products?.length || 0} products compared
                  </span>
                </div>

                {/* Product Previews */}
                {comparison.products && comparison.products.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {comparison.products.slice(0, 3).map((product, idx) => (
                      <div
                        key={product._id}
                        className="flex items-center gap-2"
                      >
                        <OptimizedImage
                          src={
                            product.images?.[0] || "/placeholder-product.jpg"
                          }
                          alt={product.title}
                          width={32}
                          height={32}
                          className="rounded-lg object-cover"
                        />
                        {idx < comparison.products.length - 1 && (
                          <span className="text-gray-400">vs</span>
                        )}
                      </div>
                    ))}
                    {comparison.products.length > 3 && (
                      <span className="text-sm text-gray-500">
                        +{comparison.products.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {comparison.authorName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {comparison.authorName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comparison.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* View Comparison Button */}
                <Link
                  href={`/${locale}/comparisons/${comparison.slug}`}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200 group"
                >
                  View Comparison
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Comparisons Button */}
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/comparisons`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 group"
          >
            View All Comparisons
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedComparisons;
