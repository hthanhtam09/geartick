"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  Watch,
  Camera,
  Gamepad2,
  Speaker,
} from "lucide-react";

interface ComparisonCategoriesProps {
  locale: string;
}

const ComparisonCategories: React.FC<ComparisonCategoriesProps> = ({
  locale,
}) => {
  const categories = [
    {
      id: "smartphones",
      name: "Smartphones",
      icon: Smartphone,
      description: "Compare flagship phones",
      count: 15,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "laptops",
      name: "Laptops",
      icon: Laptop,
      description: "Ultrabooks & gaming laptops",
      count: 12,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "headphones",
      name: "Headphones",
      icon: Headphones,
      description: "Wireless & noise-canceling",
      count: 8,
      gradient: "from-green-500 to-teal-500",
    },
    {
      id: "tablets",
      name: "Tablets",
      icon: Tablet,
      description: "iPad & Android tablets",
      count: 6,
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "smartwatches",
      name: "Smartwatches",
      icon: Watch,
      description: "Fitness & smart features",
      count: 5,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: "cameras",
      name: "Cameras",
      icon: Camera,
      description: "DSLR & mirrorless",
      count: 4,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: "gaming",
      name: "Gaming",
      icon: Gamepad2,
      description: "Consoles & accessories",
      count: 7,
      gradient: "from-red-500 to-pink-500",
    },
    {
      id: "audio",
      name: "Audio",
      icon: Speaker,
      description: "Speakers & sound systems",
      count: 3,
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Browse by Category
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Find detailed comparisons for your favorite tech categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={`/${locale}/comparisons?category=${category.id}`}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center group-hover:scale-105 border border-gray-100 dark:border-gray-700">
                {/* Icon with gradient background */}
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="w-6 h-6 text-white" />
                </div>

                {/* Category Name */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {category.description}
                </p>

                {/* Count Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {category.count} comparison{category.count !== 1 ? "s" : ""}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonCategories;
