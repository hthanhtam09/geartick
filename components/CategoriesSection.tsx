"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Tablet,
  Watch,
  Camera,
  Monitor,
} from "lucide-react";

interface CategoriesSectionProps {
  locale: string;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ locale }) => {
  const categories = [
    {
      name: "Smartphones",
      icon: Smartphone,
      count: "150+ Products",
      gradient: "from-blue-500 to-cyan-500",
      href: `/${locale}/products?category=smartphones`,
    },
    {
      name: "Laptops",
      icon: Laptop,
      count: "80+ Products",
      gradient: "from-purple-500 to-pink-500",
      href: `/${locale}/products?category=laptops`,
    },
    {
      name: "Audio",
      icon: Headphones,
      count: "120+ Products",
      gradient: "from-green-500 to-emerald-500",
      href: `/${locale}/products?category=audio`,
    },
    {
      name: "Gaming",
      icon: Gamepad2,
      count: "90+ Products",
      gradient: "from-red-500 to-orange-500",
      href: `/${locale}/products?category=gaming`,
    },
    {
      name: "Tablets",
      icon: Tablet,
      count: "60+ Products",
      gradient: "from-indigo-500 to-blue-500",
      href: `/${locale}/products?category=tablets`,
    },
    {
      name: "Wearables",
      icon: Watch,
      count: "70+ Products",
      gradient: "from-teal-500 to-cyan-500",
      href: `/${locale}/products?category=wearables`,
    },
    {
      name: "Cameras",
      icon: Camera,
      count: "45+ Products",
      gradient: "from-yellow-500 to-orange-500",
      href: `/${locale}/products?category=cameras`,
    },
    {
      name: "Monitors",
      icon: Monitor,
      count: "55+ Products",
      gradient: "from-violet-500 to-purple-500",
      href: `/${locale}/products?category=monitors`,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find exactly what you&apos;re looking for in our carefully organized
            product categories.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <Link href={category.href} className="group block">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.count}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
