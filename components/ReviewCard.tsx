import { PopulatedReview } from "@/hooks/useReviews";
import { Star, Clock, Eye, Heart } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

interface ReviewCardProps {
  review: PopulatedReview;
  onClick: () => void;
  onProductClick?: (productSlug: string, e: React.MouseEvent) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onClick,
  onProductClick,
}) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const handleProductClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onProductClick && review.productId?.slug) {
      onProductClick(review.productId.slug, e);
    }
  };

  const handleProductKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onProductClick && review.productId?.slug) {
        onProductClick(review.productId.slug, e as unknown as React.MouseEvent);
      }
    }
  };

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
      tabIndex={0}
      role="button"
      aria-label={`Read review: ${review.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {review.images && review.images.length > 0 ? (
          <OptimizedImage
            src={review.images[0]}
            alt={review.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fallbackSrc="/placeholder-product.jpg"
          />
        ) : review.productId?.images?.[0] ? (
          <OptimizedImage
            src={review.productId.images[0]}
            alt={review.productId.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fallbackSrc="/placeholder-product.jpg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <svg
              className="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {review.rating.toFixed(1)}
          </span>
        </div>

        {/* Featured Badge */}
        {review.isFeatured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Product Title */}
        {review.productId && (
          <div
            className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 cursor-pointer"
            onClick={handleProductClick}
            tabIndex={0}
            role="button"
            aria-label={`View product: ${review.productId.title}`}
            onKeyDown={handleProductKeyDown}
          >
            {review.productId.title}
          </div>
        )}

        {/* Review Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {review.title}
        </h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3">
          {renderStars(review.rating)}
        </div>

        {/* Content Preview */}
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
          {review.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
        </p>

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {review.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {review.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{review.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{review.readTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{review.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{review.likes.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              {review.authorName}
            </div>
            <div>{formatDate(review.createdAt)}</div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;
