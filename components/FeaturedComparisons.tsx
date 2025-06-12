"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Zap, ArrowRight, Trophy, TrendingUp, Star } from "lucide-react";
import { ComparisonTable } from "@/types";

interface FeaturedComparisonsProps {
  locale: string;
}

const FeaturedComparisons: React.FC<FeaturedComparisonsProps> = ({
  locale,
}) => {
  const [comparisons, setComparisons] = useState<ComparisonTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedComparisons = async (): Promise<void> => {
      try {
        // Mock data for now - replace with actual API call
        const mockComparisons: ComparisonTable[] = [
          {
            _id: "1",
            title:
              "iPhone 15 Pro vs Samsung Galaxy S24 Ultra vs Google Pixel 8 Pro",
            description: "The ultimate flagship smartphone showdown for 2024",
            category: "smartphones",
            products: [
              {
                _id: "p1",
                title: "iPhone 15 Pro Max",
                description: "Apple's latest flagship",
                category: "smartphones",
                brand: "Apple",
                price: 1199,
                currency: "USD",
                affiliateUrl: "https://example.com/iphone",
                images: ["/comparisons/iphone-15-pro.jpg"],
                slug: "iphone-15-pro-max",
                averageRating: 4.8,
                totalReviews: 2547,
                tags: ["smartphone", "premium"],
                createdAt: new Date(),
                updatedAt: new Date(),
                specifications: [],
                colors: [],
                pros: [
                  "Exceptional camera",
                  "Premium build",
                  "Great performance",
                ],
                cons: ["Expensive", "Limited USB-C features"],
                score: 9.2,
                bestFor: ["Photography", "Gaming", "Business"],
                worstFor: ["Budget users"],
              },
              {
                _id: "p2",
                title: "Samsung Galaxy S24 Ultra",
                description: "Samsung's flagship with S Pen",
                category: "smartphones",
                brand: "Samsung",
                price: 1299,
                currency: "USD",
                affiliateUrl: "https://example.com/samsung",
                images: ["/comparisons/galaxy-s24-ultra.jpg"],
                slug: "samsung-galaxy-s24-ultra",
                averageRating: 4.7,
                totalReviews: 1923,
                tags: ["smartphone", "premium"],
                createdAt: new Date(),
                updatedAt: new Date(),
                specifications: [],
                colors: [],
                pros: [
                  "S Pen functionality",
                  "Great display",
                  "Excellent cameras",
                ],
                cons: ["Expensive", "Battery life could be better"],
                score: 9.0,
                bestFor: ["Productivity", "Note-taking", "Photography"],
                worstFor: ["Budget users"],
              },
              {
                _id: "p3",
                title: "Google Pixel 8 Pro",
                description: "Google's AI-powered flagship",
                category: "smartphones",
                brand: "Google",
                price: 999,
                currency: "USD",
                affiliateUrl: "https://example.com/pixel",
                images: ["/comparisons/pixel-8-pro.jpg"],
                slug: "google-pixel-8-pro",
                averageRating: 4.6,
                totalReviews: 1456,
                tags: ["smartphone", "ai"],
                createdAt: new Date(),
                updatedAt: new Date(),
                specifications: [],
                colors: [],
                pros: ["AI features", "Great value", "Pure Android"],
                cons: ["Build quality concerns", "Limited availability"],
                score: 8.7,
                bestFor: ["AI enthusiasts", "Photography", "Stock Android"],
                worstFor: ["Gaming performance"],
              },
            ],
            criteria: [],
            winner: {
              overall: "p1",
              bestValue: "p3",
              premium: "p1",
            },
            slug: "iphone-15-pro-vs-samsung-galaxy-s24-ultra-vs-pixel-8-pro",
            authorId: "author1",
            authorName: "Mobile Expert",
            isPublished: true,
            views: 45320,
            createdAt: new Date("2024-01-20"),
            updatedAt: new Date("2024-01-20"),
          },
          {
            _id: "2",
            title: "MacBook Air M3 vs Dell XPS 13 vs ThinkPad X1 Carbon",
            description:
              "Best premium ultrabooks compared across performance, battery life, and value",
            category: "laptops",
            products: [
              {
                _id: "p4",
                title: "MacBook Air M3",
                description: "Apple's latest ultrabook",
                category: "laptops",
                brand: "Apple",
                price: 1299,
                currency: "USD",
                affiliateUrl: "https://example.com/macbook-air",
                images: ["/comparisons/macbook-air-m3.jpg"],
                slug: "macbook-air-m3",
                averageRating: 4.8,
                totalReviews: 1834,
                tags: ["laptop", "ultrabook"],
                createdAt: new Date(),
                updatedAt: new Date(),
                specifications: [],
                colors: [],
                pros: [
                  "Excellent battery life",
                  "Great performance",
                  "Silent operation",
                ],
                cons: ["Limited ports", "Expensive storage upgrades"],
                score: 9.1,
                bestFor: ["Content creation", "Battery life", "Portability"],
                worstFor: ["Gaming", "Heavy multitasking"],
              },
              {
                _id: "p5",
                title: "Dell XPS 13",
                description: "Dell's premium ultrabook",
                category: "laptops",
                brand: "Dell",
                price: 1099,
                currency: "USD",
                affiliateUrl: "https://example.com/dell-xps13",
                images: ["/comparisons/dell-xps-13.jpg"],
                slug: "dell-xps-13",
                averageRating: 4.5,
                totalReviews: 1267,
                tags: ["laptop", "windows"],
                createdAt: new Date(),
                updatedAt: new Date(),
                specifications: [],
                colors: [],
                pros: [
                  "Great display",
                  "Good build quality",
                  "Competitive price",
                ],
                cons: ["Average battery life", "Webcam placement"],
                score: 8.4,
                bestFor: ["Windows users", "Good value", "Compact design"],
                worstFor: ["Battery life priority"],
              },
            ],
            criteria: [],
            winner: {
              overall: "p4",
              bestValue: "p5",
              premium: "p4",
            },
            slug: "macbook-air-m3-vs-dell-xps13-vs-thinkpad-x1-carbon",
            authorId: "author2",
            authorName: "Laptop Specialist",
            isPublished: true,
            views: 28940,
            createdAt: new Date("2024-01-18"),
            updatedAt: new Date("2024-01-18"),
          },
        ];

        setComparisons(mockComparisons);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching featured comparisons:", error);
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-300 dark:bg-gray-600 h-24 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
            Popular Comparisons
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Side-by-side comparisons of the hottest products to help you choose
            the perfect match
          </motion.p>
        </div>

        {/* Comparisons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {comparisons.map((comparison, index) => (
            <motion.article
              key={comparison._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
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
                        <div className="relative aspect-square mb-3 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
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

        {/* View All Comparisons CTA */}
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/comparisons`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 transform hover:scale-105"
          >
            View All Comparisons
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedComparisons;
