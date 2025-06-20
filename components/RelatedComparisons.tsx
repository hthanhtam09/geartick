import { ProductComparison } from "@/types";

interface RelatedComparisonsProps {
  currentCategory: string;
  currentProductIds: string[];
  locale: string;
}

const RelatedComparisons: React.FC<RelatedComparisonsProps> = ({
  currentCategory,
  currentProductIds,
  locale,
}) => {
  // Mock related comparisons - in a real app, this would come from an API
  const relatedComparisons: Array<{
    _id: string;
    title: string;
    description: string;
    category: string;
    products: ProductComparison[];
    slug: string;
  }> = [
    {
      _id: "2",
      title: "MacBook Pro vs Dell XPS 13 vs HP Spectre x360",
      description: "Best premium laptops for professionals in 2024",
      category: "laptops",
      products: [
        {
          _id: "p3",
          title: "MacBook Pro 14-inch",
          description: "Apple's latest professional laptop with M3 chip",
          category: "laptops",
          brand: "Apple",
          price: 1999,
          currency: "USD",
          affiliateUrl: "https://example.com/macbook-pro",
          score: 9.1,
          images: ["/comparisons/macbook-pro.jpg"],
          slug: "macbook-pro-14",
          averageRating: 4.9,
          totalReviews: 1234,
          tags: ["laptop", "premium"],
          createdAt: new Date(),
          updatedAt: new Date(),
          specifications: [],
          colors: [],
          pros: [],
          cons: [],
          bestFor: [],
          worstFor: [],
        },
        {
          _id: "p4",
          title: "Dell XPS 13",
          description: "Dell's premium ultrabook with excellent build quality",
          category: "laptops",
          brand: "Dell",
          price: 1299,
          currency: "USD",
          affiliateUrl: "https://example.com/dell-xps-13",
          score: 8.7,
          images: ["/comparisons/dell-xps-13.jpg"],
          slug: "dell-xps-13",
          averageRating: 4.6,
          totalReviews: 987,
          tags: ["laptop", "premium"],
          createdAt: new Date(),
          updatedAt: new Date(),
          specifications: [],
          colors: [],
          pros: [],
          cons: [],
          bestFor: [],
          worstFor: [],
        },
      ],
      slug: "macbook-pro-vs-dell-xps-13",
    },
    {
      _id: "3",
      title: "Sony WH-1000XM5 vs Bose QuietComfort 45 vs AirPods Max",
      description: "Premium noise-canceling headphones comparison",
      category: "headphones",
      products: [
        {
          _id: "p5",
          title: "Sony WH-1000XM5",
          description: "Sony's flagship noise-canceling headphones",
          category: "headphones",
          brand: "Sony",
          price: 399,
          currency: "USD",
          affiliateUrl: "https://example.com/sony-wh1000xm5",
          score: 9.3,
          images: ["/comparisons/sony-wh1000xm5.jpg"],
          slug: "sony-wh1000xm5",
          averageRating: 4.8,
          totalReviews: 2156,
          tags: ["headphones", "wireless"],
          createdAt: new Date(),
          updatedAt: new Date(),
          specifications: [],
          colors: [],
          pros: [],
          cons: [],
          bestFor: [],
          worstFor: [],
        },
        {
          _id: "p6",
          title: "Bose QuietComfort 45",
          description: "Bose's premium noise-canceling headphones",
          category: "headphones",
          brand: "Bose",
          price: 329,
          currency: "USD",
          affiliateUrl: "https://example.com/bose-qc45",
          score: 8.9,
          images: ["/comparisons/bose-qc45.jpg"],
          slug: "bose-qc45",
          averageRating: 4.7,
          totalReviews: 1892,
          tags: ["headphones", "wireless"],
          createdAt: new Date(),
          updatedAt: new Date(),
          specifications: [],
          colors: [],
          pros: [],
          cons: [],
          bestFor: [],
          worstFor: [],
        },
      ],
      slug: "sony-wh1000xm5-vs-bose-qc45",
    },
  ];

  // Filter out comparisons that include current products
  const filteredComparisons = relatedComparisons.filter(
    (comparison) =>
      !comparison.products.some((product) =>
        currentProductIds.includes(product._id)
      )
  );

  // If no related comparisons, show category-based suggestions
  const categorySuggestions: Array<{
    _id: string;
    title: string;
    description: string;
    category: string;
    slug: string;
    products?: ProductComparison[];
  }> = [
    {
      _id: "suggestion1",
      title: `More ${currentCategory} comparisons`,
      description: `Explore other ${currentCategory} to find the perfect match for your needs`,
      category: currentCategory,
      slug: `more-${currentCategory}`,
    },
  ];

  const displayComparisons =
    filteredComparisons.length > 0 ? filteredComparisons : categorySuggestions;

  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Section Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Related Comparisons
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore more comparisons you might be interested in
            </p>
          </div>

          {/* Related Comparisons Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayComparisons.map((comparison) => (
              <div
                key={comparison._id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Comparison Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {comparison.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {comparison.description}
                    </p>
                  </div>

                  {/* Products Preview */}
                  {comparison.products && comparison.products.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {comparison.products
                        .slice(0, 2)
                        .map((product: ProductComparison) => (
                          <div
                            key={product._id}
                            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            {product.images && product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {product.title}
                              </h4>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {product.brand}
                                </p>
                                <span className="text-xs font-medium text-gray-900 dark:text-white">
                                  {product.score}/10
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {comparison.category}
                    </span>
                    <a
                      href={`/${locale}/comparisons/${comparison.slug}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
                    >
                      View Comparison
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Navigation */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`/${locale}/categories/${currentCategory}`}
                className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-300"
              >
                Browse {currentCategory}
              </a>
              <a
                href={`/${locale}/comparisons`}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                All Comparisons
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedComparisons;
