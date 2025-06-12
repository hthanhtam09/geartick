"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useReviews } from "@/hooks/useReviews";
import ReviewCard from "./ReviewCard";
import LoadingSpinner from "./LoadingSpinner";
import Pagination from "./Pagination";

interface ReviewsListProps {
  initialPage: number;
  featured?: boolean;
  category?: string;
  locale: string;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  initialPage,
  featured = false,
  category,
  locale,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading, error, refetch } = useReviews({
    page: initialPage,
    limit: 12,
    featured,
    category,
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());

    if (featured) {
      params.set("featured", "true");
    }

    if (category) {
      params.set("category", category);
    }

    router.push(`/${locale}/reviews?${params.toString()}`);
  };

  const handleReviewClick = (slug: string) => {
    router.push(`/${locale}/reviews/${slug}`);
  };

  const handleProductClick = (productSlug: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent review card click
    router.push(`/${locale}/products/${productSlug}`);
  };

  if (isLoading) {
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
            Error Loading Reviews
          </div>
          <p className="text-red-500 dark:text-red-300 text-sm">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.reviews.length === 0) {
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
          <h3 className="text-lg font-medium mb-2">No Reviews Found</h3>
          <p className="text-sm">
            There are no reviews to display at the moment.
          </p>
        </div>
      </div>
    );
  }

  const { reviews, pagination } = data;

  return (
    <div className="space-y-8">
      {/* Filter Summary */}
      {(featured || category) && (
        <div className="flex flex-wrap gap-2 justify-center">
          {featured && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
              Featured Reviews
            </span>
          )}
          {category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
              {category}
            </span>
          )}
        </div>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            onClick={() => handleReviewClick(review.slug)}
            onProductClick={(productSlug, e) =>
              handleProductClick(productSlug, e)
            }
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} reviews
      </div>
    </div>
  );
};

export default ReviewsList;
