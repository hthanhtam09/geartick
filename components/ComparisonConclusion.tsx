import { ComparisonTable } from "@/types";

interface ComparisonConclusionProps {
  comparison: ComparisonTable;
  locale: string;
}

const ComparisonConclusion: React.FC<ComparisonConclusionProps> = ({
  comparison,
}) => {
  // Find the best product based on score
  const bestProduct = comparison.products.reduce((prev, current) =>
    prev.score > current.score ? prev : current
  );

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
              After thoroughly comparing all products, here&apos;s our
              comprehensive conclusion to help you make the best decision.
            </p>
          </div>

          {/* Winner Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Best Overall: {bestProduct.title}
                </h3>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  Score: {bestProduct.score}/10
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Why It Wins
                </h4>
                <ul className="space-y-2">
                  {bestProduct.pros.slice(0, 4).map((pro, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-gray-700 dark:text-gray-300"
                    >
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Best For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {bestProduct.bestFor.map((useCase, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Rankings */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Product Rankings
            </h3>
            <div className="space-y-4">
              {comparison.products
                .sort((a, b) => b.score - a.score)
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
