import { ProductComparison } from "@/types";
import { formatDate } from "@/lib/utils";

interface ComparisonDetailHeaderProps {
  comparison: {
    _id: string;
    title: string;
    description: string;
    category: string;
    products: ProductComparison[];
    slug: string;
    authorId: string;
    authorName: string;
    isPublished: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
  };
  locale: string;
}

const ComparisonDetailHeader: React.FC<ComparisonDetailHeaderProps> = ({
  comparison,
  locale,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <a
              href={`/${locale}`}
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Home
            </a>
            <span>/</span>
            <a
              href={`/${locale}/comparisons`}
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Comparisons
            </a>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100">
              {comparison.title}
            </span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            {comparison.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl">
            {comparison.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <span>Category:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                {comparison.category}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Products:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {comparison.products.length}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Updated:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatDate(comparison.updatedAt || new Date(), locale)}
              </span>
            </div>
          </div>

          {/* Product Quick Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {comparison.products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.brand}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Score:
                      </span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {product.score}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonDetailHeader;
