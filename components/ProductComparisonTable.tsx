"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  DollarSign,
  Ruler,
  Palette,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductComparison, ProductColor } from "@/types";

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    gtag?: (
      event: string,
      action: string,
      params?: Record<string, string>
    ) => void;
  }
}

interface ProductComparisonTableProps {
  products: ProductComparison[];
  title?: string;
  className?: string;
}

const ProductComparisonTable: React.FC<ProductComparisonTableProps> = ({
  products,
  title,
  className = "",
}) => {
  const t = useTranslations("ProductComparison");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overview"])
  );
  const [selectedColorIndex, setSelectedColorIndex] = useState<
    Record<string, number>
  >({});

  const displayTitle = title || t("title");

  const toggleSection = (section: string): void => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleColorSelect = (productId: string, colorIndex: number): void => {
    setSelectedColorIndex((prev) => ({ ...prev, [productId]: colorIndex }));
  };

  const handleAffiliateClick = (
    affiliateUrl: string,
    productTitle: string
  ): void => {
    // Track affiliate click for analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "affiliate_click", {
        product_name: productTitle,
        affiliate_url: affiliateUrl,
      });
    }
    window.open(affiliateUrl, "_blank", "noopener,noreferrer");
  };

  const renderRatingStars = (rating: number): React.JSX.Element => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );

  const renderColorPalette = (
    product: ProductComparison
  ): React.JSX.Element => (
    <div className="flex flex-wrap gap-2 mt-2">
      {product.colors.map((color: ProductColor, index: number) => (
        <button
          key={`${product._id}-color-${index}`}
          onClick={() => handleColorSelect(product._id, index)}
          className={`
            w-8 h-8 rounded-full border-2 transition-all duration-200
            ${
              selectedColorIndex[product._id] === index
                ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800"
                : "hover:scale-110"
            }
          `}
          style={{ backgroundColor: color.hex }}
          title={color.name}
          aria-label={t("labels.selectColor", {
            color: color.name,
            product: product.title,
          })}
        />
      ))}
    </div>
  );

  const renderProsCons = (
    items: string[],
    type: "pros" | "cons"
  ): React.JSX.Element => (
    <ul className="space-y-1">
      {items.slice(0, 3).map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm">
          {type === "pros" ? (
            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
          ) : (
            <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          )}
          <span
            className={
              type === "pros"
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }
          >
            {item}
          </span>
        </li>
      ))}
      {items.length > 3 && (
        <li className="text-xs text-gray-500 dark:text-gray-400 ml-6">
          {t("labels.moreItems", { count: items.length - 3 })}
        </li>
      )}
    </ul>
  );

  const sections = [
    { id: "overview", title: t("sections.overview"), icon: Award },
    { id: "specs", title: t("sections.specifications"), icon: Ruler },
    { id: "colors", title: t("sections.colors"), icon: Palette },
    { id: "pricing", title: t("sections.pricing"), icon: DollarSign },
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {displayTitle}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t("compareProducts", { count: products.length })}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gray-50 dark:bg-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("swipeHint")}
          </p>
        </div>

        {/* Desktop Table Header */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-6 bg-gray-50 dark:bg-gray-700">
            <div className="p-4 font-semibold text-gray-900 dark:text-white">
              {t("labels.features")}
            </div>
            {products.map((product) => (
              <div key={product._id} className="p-4 text-center">
                <div className="space-y-2">
                  <Image
                    src={product.images[0] || "/placeholder-product.jpg"}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="mx-auto rounded-lg object-cover"
                    loading="lazy"
                  />
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div
            key={section.id}
            className="border-t border-gray-200 dark:border-gray-600"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              aria-expanded={expandedSections.has(section.id)}
            >
              <div className="flex items-center gap-3">
                <section.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </span>
              </div>
              {expandedSections.has(section.id) ? (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedSections.has(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {section.id === "overview" && (
                    <div className="lg:grid lg:grid-cols-6">
                      {/* Mobile View */}
                      <div className="lg:hidden">
                        {products.map((product) => (
                          <div
                            key={product._id}
                            className="p-4 border-b border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex gap-4">
                              <Image
                                src={
                                  product.images[0] ||
                                  "/placeholder-product.jpg"
                                }
                                alt={product.title}
                                width={100}
                                height={100}
                                className="rounded-lg object-cover"
                                loading="lazy"
                              />
                              <div className="flex-1 space-y-3">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                  {product.title}
                                </h3>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  ${product.price}
                                </p>
                                {renderRatingStars(product.averageRating)}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                                      Pros
                                    </h4>
                                    {renderProsCons(product.pros, "pros")}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                                      Cons
                                    </h4>
                                    {renderProsCons(product.cons, "cons")}
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleAffiliateClick(
                                      product.affiliateUrl,
                                      product.title
                                    )
                                  }
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                  aria-label={`Buy ${product.title} - opens in new tab`}
                                >
                                  Buy Now
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop View */}
                      <div className="hidden lg:contents">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700">
                          <div className="space-y-4">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              Rating
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              Pros
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              Cons
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              Best For
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              Action
                            </div>
                          </div>
                        </div>
                        {products.map((product) => (
                          <div key={product._id} className="p-4 space-y-4">
                            <div>
                              {renderRatingStars(product.averageRating)}
                            </div>
                            <div>{renderProsCons(product.pros, "pros")}</div>
                            <div>{renderProsCons(product.cons, "cons")}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {product.bestFor
                                .slice(0, 2)
                                .map((item, index) => (
                                  <span
                                    key={index}
                                    className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs mr-1 mb-1"
                                  >
                                    {item}
                                  </span>
                                ))}
                            </div>
                            <button
                              onClick={() =>
                                handleAffiliateClick(
                                  product.affiliateUrl,
                                  product.title
                                )
                              }
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                              aria-label={`Buy ${product.title} - opens in new tab`}
                            >
                              Buy Now
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {section.id === "specs" && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                              Specification
                            </th>
                            {products.map((product) => (
                              <th
                                key={product._id}
                                className="p-4 text-center font-semibold text-gray-900 dark:text-white"
                              >
                                {product.brand}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {/* Get all unique specifications */}
                          {Array.from(
                            new Set(
                              products.flatMap((p) =>
                                p.specifications.map((s) => s.name)
                              )
                            )
                          ).map((specName) => (
                            <tr
                              key={specName}
                              className="border-t border-gray-200 dark:border-gray-600"
                            >
                              <td className="p-4 font-medium text-gray-900 dark:text-white">
                                {specName}
                              </td>
                              {products.map((product) => {
                                const spec = product.specifications.find(
                                  (s) => s.name === specName
                                );
                                return (
                                  <td
                                    key={product._id}
                                    className="p-4 text-center text-gray-600 dark:text-gray-400"
                                  >
                                    {spec?.value || "N/A"}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {section.id === "colors" && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {products.map((product) => (
                          <div key={product._id} className="text-center">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                              {product.brand}
                            </h4>
                            {product.colors.length > 0 ? (
                              <div>
                                {renderColorPalette(product)}
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                  {product.colors.length} color
                                  {product.colors.length !== 1 ? "s" : ""}{" "}
                                  available
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                No color options
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {section.id === "pricing" && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {products.map((product) => (
                          <div key={product._id} className="text-center">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                ${product.price}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {product.currency || "USD"}
                              </p>
                              <button
                                onClick={() =>
                                  handleAffiliateClick(
                                    product.affiliateUrl,
                                    product.title
                                  )
                                }
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                aria-label={`Buy ${product.title} for $${product.price} - opens in new tab`}
                              >
                                Buy for ${product.price}
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductComparisonTable;
