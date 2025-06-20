import { ProductComparison } from "@/types";

interface ComparisonConclusionProps {
  products: ProductComparison[];
  winners: {
    overall?: string;
    bestValue?: string;
    premium?: string;
  };
  category: string;
}

const ComparisonConclusion: React.FC<ComparisonConclusionProps> = ({
  products,
  winners,
  category,
}) => {
  // Find the best product based on score
  const bestProduct = products.reduce((prev, current) =>
    (prev.score || 0) > (current.score || 0) ? prev : current
  );

  const overallWinner = products.find((p) => p._id === winners.overall);
  const bestValueWinner = products.find((p) => p._id === winners.bestValue);
  const premiumWinner = products.find((p) => p._id === winners.premium);

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Section Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Final Verdict
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              After thoroughly comparing all {category}, here&apos;s our
              comprehensive conclusion to help you make the best decision.
            </p>
          </div>

          {/* Winners Grid */}
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Winner */}
            {overallWinner && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Best Overall
                    </h3>
                    <p className="text-green-600 dark:text-green-400 font-medium text-sm">
                      Score: {overallWinner.score}/10
                    </p>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {overallWinner.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {overallWinner.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {overallWinner.pros.slice(0, 2).map((pro, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
                    >
                      {pro}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Best Value */}
            {bestValueWinner && bestValueWinner._id !== overallWinner?._id && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Best Value
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                      Score: {bestValueWinner.score}/10
                    </p>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {bestValueWinner.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {bestValueWinner.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {bestValueWinner.pros.slice(0, 2).map((pro, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {pro}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Premium Choice */}
            {premiumWinner &&
              premiumWinner._id !== overallWinner?._id &&
              premiumWinner._id !== bestValueWinner?._id && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Premium Choice
                      </h3>
                      <p className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                        Score: {premiumWinner.score}/10
                      </p>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {premiumWinner.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {premiumWinner.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {premiumWinner.pros.slice(0, 2).map((pro, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full"
                      >
                        {pro}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Product Rankings */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Product Rankings
            </h3>
            <div className="space-y-4">
              {products
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .map((product, index) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {product.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {product.brand}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {product.score}/10
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {product.price} {product.currency}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Final Recommendations */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Final Recommendations
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Choose {bestProduct.title} if:
                </h4>
                <ul className="space-y-2">
                  {bestProduct.bestFor.map((reason, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-gray-700 dark:text-gray-300"
                    >
                      <svg
                        className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4"
                        />
                      </svg>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Consider alternatives if:
                </h4>
                <ul className="space-y-2">
                  {bestProduct.worstFor.map((reason, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-gray-700 dark:text-gray-300"
                    >
                      <svg
                        className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonConclusion;
