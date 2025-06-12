"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Clock, Eye, ThumbsUp, ArrowRight } from "lucide-react";
import { Review } from "@/types";
import OptimizedImage from "./OptimizedImage";

interface FeaturedReviewsProps {
  locale: string;
}

const FeaturedReviews: React.FC<FeaturedReviewsProps> = ({ locale }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedReviews = async (): Promise<void> => {
      try {
        // Mock data for now - replace with actual API call
        const mockReviews: Review[] = [
          {
            _id: "1",
            productId: "prod1",
            title: "iPhone 15 Pro Max: The Ultimate Camera Phone?",
            content: "After 3 weeks of testing...",
            rating: 4.8,
            pros: [
              "Exceptional camera quality",
              "Premium build",
              "Great performance",
            ],
            cons: ["Expensive", "Heavy"],
            verdict: "Best flagship phone for photography enthusiasts",
            authorId: "author1",
            authorName: "Tech Reviewer Pro",
            authorImage: "/authors/tech-reviewer.jpg",
            images: ["/reviews/iphone-15-pro.jpg"],
            slug: "iphone-15-pro-max-ultimate-camera-phone",
            likes: 234,
            views: 12500,
            isPublished: true,
            isFeatured: true,
            tags: ["smartphone", "apple", "camera"],
            readTime: 8,
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-15"),
          },
          {
            _id: "2",
            productId: "prod2",
            title: "MacBook Air M3 vs MacBook Pro: Which Should You Buy?",
            content: "Comprehensive comparison after using both...",
            rating: 4.6,
            pros: ["Great performance", "Excellent battery life", "Portable"],
            cons: ["Limited ports", "Expensive upgrades"],
            verdict: "MacBook Air M3 wins for most users",
            authorId: "author2",
            authorName: "Laptop Specialist",
            authorImage: "/authors/laptop-specialist.jpg",
            images: ["/reviews/macbook-comparison.jpg"],
            slug: "macbook-air-m3-vs-pro-comparison",
            likes: 189,
            views: 8900,
            isPublished: true,
            isFeatured: true,
            tags: ["laptop", "apple", "comparison"],
            readTime: 12,
            createdAt: new Date("2024-01-10"),
            updatedAt: new Date("2024-01-10"),
          },
          {
            _id: "3",
            productId: "prod3",
            title:
              "Sony WH-1000XM5: Still the Best Noise-Canceling Headphones?",
            content: "Updated review with long-term usage insights...",
            rating: 4.7,
            pros: ["Superior noise cancellation", "Comfortable", "Great sound"],
            cons: ["Expensive", "Plastic build"],
            verdict: "Still the gold standard for ANC headphones",
            authorId: "author3",
            authorName: "Audio Expert",
            authorImage: "/authors/audio-expert.jpg",
            images: ["/reviews/sony-wh1000xm5.jpg"],
            slug: "sony-wh1000xm5-best-noise-canceling-headphones",
            likes: 156,
            views: 6700,
            isPublished: true,
            isFeatured: true,
            tags: ["headphones", "sony", "audio"],
            readTime: 6,
            createdAt: new Date("2024-01-08"),
            updatedAt: new Date("2024-01-08"),
          },
        ];

        setReviews(mockReviews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching featured reviews:", error);
        setLoading(false);
      }
    };

    fetchFeaturedReviews();
  }, []);

  const renderStars = (rating: number): React.JSX.Element[] => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400/50 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300 dark:text-gray-600"
        />
      );
    }

    return stars;
  };

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

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Latest Reviews
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            In-depth reviews and comparisons to help you make the best
            purchasing decisions
          </motion.p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.article
              key={review._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Review Image */}
              <div className="relative aspect-video overflow-hidden">
                <OptimizedImage
                  src={review.images[0] || "/placeholder-review.jpg"}
                  alt={review.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackSrc="/placeholder-product.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Rating Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <span className="font-bold">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Read Time */}
                <div className="absolute top-4 right-4">
                  <div className="bg-black/50 text-white px-2 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {review.readTime} min
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="p-6">
                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {review.authorName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {review.authorName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                  {review.title}
                </h3>

                {/* Verdict */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {review.verdict}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {review.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {review.likes}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/${locale}/reviews/${review.slug}`}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200 group"
                >
                  Read Full Review
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {review.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Reviews CTA */}
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/reviews`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 transform hover:scale-105"
          >
            View All Reviews
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;
