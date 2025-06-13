"use client";

import { useState, useEffect } from "react";
import { Review, Product } from "@/types";
import {
  Star,
  Clock,
  Eye,
  Heart,
  Calendar,
  Share2,
  GitCompare,
} from "lucide-react";
import ComparisonModal from "./ComparisonModal";
import LoadingSpinner from "./LoadingSpinner";

interface DetailedReviewPageProps {
  reviewSlug: string;
  locale: string;
}

const DetailedReviewPage: React.FC<DetailedReviewPageProps> = ({
  reviewSlug,
  locale,
}) => {
  const [review, setReview] = useState<Review | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const fetchReview = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/reviews/${reviewSlug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch review");
      }

      const data = await response.json();
      if (data.success) {
        setReview(data.data);
        // Fetch product details if available
        if (data.data.productId) {
          const productResponse = await fetch(
            `/api/products/${data.data.productId}`
          );
          if (productResponse.ok) {
            const productData = await productResponse.json();
            if (productData.success) {
              setProduct(productData.data);
            }
          }
        }
      } else {
        throw new Error(data.message || "Failed to fetch review");
      }
    } catch (error) {
      console.error("Error fetching review:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [reviewSlug]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: review?.title,
        text: review?.content.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

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
            Error Loading Review
          </div>
          <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
          <button
            onClick={fetchReview}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">Review Not Found</h3>
          <p className="text-sm">
            The review you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <a
              href={`/${locale}/reviews`}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Reviews
            </a>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">
              {review.title}
            </span>
          </nav>

          {/* Product Info */}
          {product && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <span>{product.brand}</span>
                      <span>•</span>
                      <span>{product.category}</span>
                      <span>•</span>
                      <span className="font-semibold">${product.price}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowComparisonModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <GitCompare className="w-4 h-4" />
                  <span>Compare</span>
                </button>
              </div>
            </div>
          )}

          {/* Review Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {review.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(review.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{review.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{review.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{review.likes.toLocaleString()} likes</span>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                {review.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">/ 5.0</span>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center space-x-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {review.authorImage && (
            <img
              src={review.authorImage}
              alt={review.authorName}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {review.authorName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Tech Reviewer
            </p>
          </div>
        </div>

        {/* Pros and Cons */}
        {(review.pros?.length > 0 || review.cons?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {review.pros && review.pros.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  Pros
                </h3>
                <ul className="space-y-2">
                  {review.pros.map((pro, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 dark:text-green-400 mt-1">
                        ✓
                      </span>
                      <span className="text-green-700 dark:text-green-300">
                        {pro}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {review.cons && review.cons.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">
                  Cons
                </h3>
                <ul className="space-y-2">
                  {review.cons.map((con, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-600 dark:text-red-400 mt-1">
                        ✗
                      </span>
                      <span className="text-red-700 dark:text-red-300">
                        {con}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Review Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <div
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: review.content }}
          />
        </div>

        {/* Verdict */}
        {review.verdict && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Verdict
            </h3>
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
              {review.verdict}
            </p>
          </div>
        )}

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        {product && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-center text-white">
            <h3 className="text-xl font-semibold mb-2">
              Ready to make a decision?
            </h3>
            <p className="mb-4 opacity-90">
              Compare {product.title} with similar products to find the best
              option for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowComparisonModal(true)}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Compare Products
              </button>
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                View on Amazon
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      {product && (
        <ComparisonModal
          isOpen={showComparisonModal}
          onClose={() => setShowComparisonModal(false)}
          currentProduct={product}
          locale={locale}
        />
      )}
    </div>
  );
};

export default DetailedReviewPage;
