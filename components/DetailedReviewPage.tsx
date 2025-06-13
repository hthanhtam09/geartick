"use client";

import { useState, useEffect } from "react";
import { Review, Product, ProductSpecification } from "@/types";
import {
  Star,
  Clock,
  Eye,
  Heart,
  Calendar,
  Share2,
  GitCompare,
  ExternalLink,
  CheckCircle,
  XCircle,
  Award,
  DollarSign,
  Camera,
  Battery,
  Zap,
  Shield,
  Users,
  TrendingUp,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Cpu,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Headphones,
  Gamepad2,
  Wifi,
  Bluetooth,
  Usb,
  Mic,
  Speaker,
} from "lucide-react";
import ComparisonModal from "./ComparisonModal";
import LoadingSpinner from "./LoadingSpinner";
import ImageCarousel from "./ImageCarousel";
import {
  attachAffiliateLinksToHTML,
  createProductTitleLink,
} from "@/utils/affiliateLinkUtils";

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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overview", "features"])
  );

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
              // Add sample images if product doesn't have any
              const productWithImages = {
                ...productData.data,
                images:
                  productData.data.images && productData.data.images.length > 0
                    ? productData.data.images
                    : [
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center",
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center&q=80",
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center&q=60",
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center&q=40",
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center&q=20",
                      ],
              };
              setProduct(productWithImages);
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

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleAffiliateClick = (url: string, productName: string) => {
    // Track affiliate click for analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "affiliate_click", {
        product_name: productName,
        affiliate_url: url,
      });
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getDeviceIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "smartphones":
      case "smartphone":
        return <Smartphone className="w-5 h-5" />;
      case "laptops":
      case "laptop":
        return <Laptop className="w-5 h-5" />;
      case "tablets":
      case "tablet":
        return <Tablet className="w-5 h-5" />;
      case "smartwatches":
      case "smartwatch":
      case "watches":
        return <Watch className="w-5 h-5" />;
      case "headphones":
      case "audio":
        return <Headphones className="w-5 h-5" />;
      case "gaming":
      case "consoles":
        return <Gamepad2 className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getSpecificationIcon = (specName: string) => {
    const name = specName.toLowerCase();
    if (
      name.includes("processor") ||
      name.includes("cpu") ||
      name.includes("chip")
    ) {
      return <Cpu className="w-4 h-4" />;
    }
    if (
      name.includes("memory") ||
      name.includes("ram") ||
      name.includes("storage")
    ) {
      return <HardDrive className="w-4 h-4" />;
    }
    if (
      name.includes("camera") ||
      name.includes("lens") ||
      name.includes("photo")
    ) {
      return <Camera className="w-4 h-4" />;
    }
    if (
      name.includes("display") ||
      name.includes("screen") ||
      name.includes("resolution")
    ) {
      return <Monitor className="w-4 h-4" />;
    }
    if (name.includes("battery") || name.includes("power")) {
      return <Battery className="w-4 h-4" />;
    }
    if (name.includes("wifi") || name.includes("network")) {
      return <Wifi className="w-4 h-4" />;
    }
    if (name.includes("bluetooth")) {
      return <Bluetooth className="w-4 h-4" />;
    }
    if (name.includes("usb") || name.includes("port")) {
      return <Usb className="w-4 h-4" />;
    }
    if (name.includes("speaker") || name.includes("audio")) {
      return <Speaker className="w-4 h-4" />;
    }
    if (name.includes("microphone") || name.includes("mic")) {
      return <Mic className="w-4 h-4" />;
    }
    return <Zap className="w-4 h-4" />;
  };

  const organizeSpecifications = (specs: ProductSpecification[]) => {
    const categories: Record<string, ProductSpecification[]> = {
      "Configuration & Memory": [],
      "Camera & Screen": [],
      "Battery & Charging": [],
      Connectivity: [],
      "Audio & Media": [],
      "Design & Build": [],
      "Software & Features": [],
      Other: [],
    };

    specs.forEach((spec) => {
      const name = spec.name.toLowerCase();

      if (
        name.includes("processor") ||
        name.includes("cpu") ||
        name.includes("chip") ||
        name.includes("memory") ||
        name.includes("ram") ||
        name.includes("storage") ||
        name.includes("gpu") ||
        name.includes("graphics")
      ) {
        categories["Configuration & Memory"].push(spec);
      } else if (
        name.includes("camera") ||
        name.includes("lens") ||
        name.includes("photo") ||
        name.includes("display") ||
        name.includes("screen") ||
        name.includes("resolution") ||
        name.includes("refresh") ||
        name.includes("brightness")
      ) {
        categories["Camera & Screen"].push(spec);
      } else if (
        name.includes("battery") ||
        name.includes("power") ||
        name.includes("charging") ||
        name.includes("mah") ||
        name.includes("watt")
      ) {
        categories["Battery & Charging"].push(spec);
      } else if (
        name.includes("wifi") ||
        name.includes("bluetooth") ||
        name.includes("5g") ||
        name.includes("4g") ||
        name.includes("network") ||
        name.includes("cellular") ||
        name.includes("nfc") ||
        name.includes("gps")
      ) {
        categories["Connectivity"].push(spec);
      } else if (
        name.includes("speaker") ||
        name.includes("audio") ||
        name.includes("microphone") ||
        name.includes("headphone") ||
        name.includes("sound")
      ) {
        categories["Audio & Media"].push(spec);
      } else if (
        name.includes("dimension") ||
        name.includes("weight") ||
        name.includes("material") ||
        name.includes("build") ||
        name.includes("color") ||
        name.includes("finish")
      ) {
        categories["Design & Build"].push(spec);
      } else if (
        name.includes("os") ||
        name.includes("android") ||
        name.includes("ios") ||
        name.includes("software") ||
        name.includes("feature") ||
        name.includes("security")
      ) {
        categories["Software & Features"].push(spec);
      } else {
        categories["Other"].push(spec);
      }
    });

    // Remove empty categories
    return Object.fromEntries(
      Object.entries(categories).filter(([, specs]) => specs.length > 0)
    );
  };

  const renderSpecificationSection = (
    title: string,
    specifications: ProductSpecification[]
  ) => {
    if (specifications.length === 0) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            {getSpecificationIcon(title)}
            <span className="ml-2">{title}</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specifications.map((spec, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  {getSpecificationIcon(spec.name)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {spec.name}
                  </span>
                </div>
                <span className="text-sm text-gray-900 dark:text-white font-semibold">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-red-600 dark:text-red-400 font-medium mb-2">
          {error || "Review not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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

          {/* Review Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {product && product.affiliateUrl ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: createProductTitleLink(
                    product,
                    "text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  ),
                }}
              />
            ) : (
              review.title
            )}
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
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                {review.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">/ 5.0</span>
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <Award className="w-5 h-5" />
              <span className="font-medium">Recommended</span>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Quick Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {review.rating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Overall Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {product?.price ? `$${product.price}` : "N/A"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Current Price
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {review.readTime}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Read Time (min)
              </div>
            </div>
          </div>
        </div>

        {/* Product Image Carousel */}
        {product && product.images && product.images.length > 0 && (
          <div className="mb-8">
            <ImageCarousel
              images={product.images}
              alt={product.title}
              className="w-full mx-auto"
            />
          </div>
        )}

        {/* Fallback Image Carousel when no product data */}
        {(!product || !product.images || product.images.length === 0) && (
          <div className="mb-8">
            <ImageCarousel
              images={[
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center&q=80",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center&q=60",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center&q=40",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center&q=20",
              ]}
              alt={review.title}
              className="w-full mx-auto"
            />
          </div>
        )}

        {/* Pros and Cons */}
        {(review.pros?.length > 0 || review.cons?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {review.pros && review.pros.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Pros
                </h3>
                <ul className="space-y-3">
                  {review.pros.map((pro, index) => (
                    <li key={index} className="flex items-start space-x-3">
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
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Cons
                </h3>
                <ul className="space-y-3">
                  {review.cons.map((con, index) => (
                    <li key={index} className="flex items-start space-x-3">
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

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* Overview Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection("overview")}
              className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Overview & First Impressions
                </h2>
                {expandedSections.has("overview") ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>
            {expandedSections.has("overview") && (
              <div className="p-6">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        product && product.affiliateUrl
                          ? attachAffiliateLinksToHTML(review.content, product)
                          : review.content,
                    }}
                  />
                </div>

                {/* Affiliate Link CTA */}
                {product?.affiliateUrl && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Ready to experience{" "}
                      {product.affiliateUrl ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: createProductTitleLink(
                              product,
                              "text-blue-900 dark:text-blue-100 hover:text-blue-700 dark:hover:text-blue-300 underline"
                            ),
                          }}
                        />
                      ) : (
                        product.title
                      )}
                      ?
                    </h4>
                    <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                      Get the best price and fast shipping when you buy through
                      our trusted affiliate link.
                    </p>
                    <button
                      onClick={() =>
                        handleAffiliateClick(
                          product.affiliateUrl,
                          product.title
                        )
                      }
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Check Price on Amazon</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Features & Specifications */}
          <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection("features")}
              className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  {getDeviceIcon(product?.category || "")}
                  <span className="ml-2">Key Features & Specifications</span>
                </h2>
                {expandedSections.has("features") ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>
            {expandedSections.has("features") && (
              <div className="p-6">
                {product &&
                product.specifications &&
                product.specifications.length > 0 ? (
                  <div className="space-y-6">
                    {/* Device Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        {getDeviceIcon(product.category)}
                        <span className="ml-2">
                          {product && product.affiliateUrl ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: createProductTitleLink(
                                  product,
                                  "text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                ),
                              }}
                            />
                          ) : (
                            product?.title || "Device"
                          )}{" "}
                          - Device Overview
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {product.brand}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Brand
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {product.category}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Category
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            ${product.price}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Price
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Organized Specifications */}
                    {(() => {
                      const organizedSpecs = organizeSpecifications(
                        product.specifications
                      );
                      return Object.entries(organizedSpecs).map(
                        ([category, specs]) =>
                          renderSpecificationSection(category, specs)
                      );
                    })()}

                    {/* Dimensions */}
                    {product.dimensions && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <Shield className="w-5 h-5" />
                            <span className="ml-2">Dimensions & Weight</span>
                          </h3>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {product.dimensions.length && (
                              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  {product.dimensions.length}{" "}
                                  {product.dimensions.unit || "mm"}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  Length
                                </div>
                              </div>
                            )}
                            {product.dimensions.width && (
                              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  {product.dimensions.width}{" "}
                                  {product.dimensions.unit || "mm"}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  Width
                                </div>
                              </div>
                            )}
                            {product.dimensions.height && (
                              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  {product.dimensions.height}{" "}
                                  {product.dimensions.unit || "mm"}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  Height
                                </div>
                              </div>
                            )}
                            {product.dimensions.weight && (
                              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  {product.dimensions.weight}{" "}
                                  {product.dimensions.unit === "mm"
                                    ? "g"
                                    : product.dimensions.unit || "g"}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  Weight
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Available Colors */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Available Colors
                          </h3>
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap gap-4">
                            {product.colors.map((color, index) => (
                              <div key={index} className="text-center">
                                <div
                                  className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 mb-2 shadow-lg"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {color.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Materials */}
                    {product.materials && product.materials.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Build Materials
                          </h3>
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap gap-2">
                            {product.materials.map((material, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {material}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Sample Specifications for Demo */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        {getDeviceIcon(product?.category || "")}
                        <span className="ml-2">
                          {product && product.affiliateUrl ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: createProductTitleLink(
                                  product,
                                  "text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                ),
                              }}
                            />
                          ) : (
                            product?.title || "Device"
                          )}{" "}
                          - Device Overview
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {product?.brand || "Brand"}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Brand
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {product?.category || "Category"}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Category
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            ${product?.price || "0"}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Price
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sample Organized Specifications */}
                    {(() => {
                      const sampleSpecs: ProductSpecification[] = [
                        // Configuration & Memory
                        {
                          name: "Processor",
                          value: "Apple A17 Pro",
                          category: "Performance",
                        },
                        {
                          name: "RAM",
                          value: "8GB LPDDR5",
                          category: "Memory",
                        },
                        {
                          name: "Storage",
                          value: "256GB NVMe SSD",
                          category: "Storage",
                        },
                        {
                          name: "GPU",
                          value: "6-core GPU",
                          category: "Graphics",
                        },

                        // Camera & Screen
                        {
                          name: "Main Camera",
                          value: "48MP f/1.78",
                          category: "Camera",
                        },
                        {
                          name: "Ultra Wide Camera",
                          value: "12MP f/2.2",
                          category: "Camera",
                        },
                        {
                          name: "Telephoto Camera",
                          value: "12MP f/2.8",
                          category: "Camera",
                        },
                        {
                          name: "Front Camera",
                          value: "12MP f/1.9",
                          category: "Camera",
                        },
                        {
                          name: "Display",
                          value: '6.1" Super Retina XDR',
                          category: "Display",
                        },
                        {
                          name: "Resolution",
                          value: "2556 x 1179 pixels",
                          category: "Display",
                        },
                        {
                          name: "Refresh Rate",
                          value: "120Hz ProMotion",
                          category: "Display",
                        },
                        {
                          name: "Brightness",
                          value: "2000 nits peak",
                          category: "Display",
                        },

                        // Battery & Charging
                        {
                          name: "Battery Capacity",
                          value: "3279 mAh",
                          category: "Battery",
                        },
                        {
                          name: "Charging",
                          value: "20W USB-C",
                          category: "Charging",
                        },
                        {
                          name: "Wireless Charging",
                          value: "15W MagSafe",
                          category: "Charging",
                        },
                        {
                          name: "Battery Life",
                          value: "Up to 29 hours video",
                          category: "Battery",
                        },

                        // Connectivity
                        {
                          name: "5G",
                          value: "Sub-6GHz & mmWave",
                          category: "Connectivity",
                        },
                        {
                          name: "Wi-Fi",
                          value: "Wi-Fi 6E (802.11ax)",
                          category: "Connectivity",
                        },
                        {
                          name: "Bluetooth",
                          value: "5.3",
                          category: "Connectivity",
                        },
                        { name: "NFC", value: "Yes", category: "Connectivity" },
                        {
                          name: "GPS",
                          value: "GPS, GLONASS, Galileo",
                          category: "Connectivity",
                        },

                        // Audio & Media
                        {
                          name: "Speakers",
                          value: "Stereo speakers",
                          category: "Audio",
                        },
                        {
                          name: "Microphone",
                          value: "3 microphones",
                          category: "Audio",
                        },
                        {
                          name: "Audio Codec",
                          value: "AAC-LC, HE-AAC",
                          category: "Audio",
                        },

                        // Design & Build
                        {
                          name: "Material",
                          value: "Ceramic Shield front",
                          category: "Build",
                        },
                        {
                          name: "Water Resistance",
                          value: "IP68",
                          category: "Build",
                        },
                        {
                          name: "Colors",
                          value: "Natural Titanium, Blue Titanium",
                          category: "Design",
                        },

                        // Software & Features
                        {
                          name: "Operating System",
                          value: "iOS 17",
                          category: "Software",
                        },
                        {
                          name: "Security",
                          value: "Face ID",
                          category: "Security",
                        },
                        {
                          name: "Chip",
                          value: "A17 Pro with Neural Engine",
                          category: "Performance",
                        },
                      ];

                      const organizedSpecs =
                        organizeSpecifications(sampleSpecs);
                      return Object.entries(organizedSpecs).map(
                        ([category, specs]) =>
                          renderSpecificationSection(category, specs)
                      );
                    })()}

                    {/* Sample Dimensions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <Shield className="w-5 h-5" />
                          <span className="ml-2">Dimensions & Weight</span>
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              147.7 mm
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              Length
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              71.5 mm
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              Width
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              8.25 mm
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              Height
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              187 g
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              Weight
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sample Colors */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Available Colors
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-4">
                          <div className="text-center">
                            <div
                              className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 mb-2 shadow-lg"
                              style={{ backgroundColor: "#8B7355" }}
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Natural Titanium
                            </span>
                          </div>
                          <div className="text-center">
                            <div
                              className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 mb-2 shadow-lg"
                              style={{ backgroundColor: "#4A5D7E" }}
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Blue Titanium
                            </span>
                          </div>
                          <div className="text-center">
                            <div
                              className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 mb-2 shadow-lg"
                              style={{ backgroundColor: "#2C2C2E" }}
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Black Titanium
                            </span>
                          </div>
                          <div className="text-center">
                            <div
                              className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 mb-2 shadow-lg"
                              style={{ backgroundColor: "#E8E8E8" }}
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              White Titanium
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sample Materials */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Build Materials
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                            Titanium
                          </span>
                          <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                            Ceramic Shield
                          </span>
                          <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                            Glass
                          </span>
                          <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                            Aluminum
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Affiliate Link */}
                {product?.affiliateUrl && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Get the Best Deal
                    </h4>
                    <p className="text-green-800 dark:text-green-200 text-sm mb-3">
                      Compare prices and find the best deal for{" "}
                      {product.affiliateUrl ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: createProductTitleLink(
                              product,
                              "text-green-800 dark:text-green-200 hover:text-green-700 dark:hover:text-green-300 underline"
                            ),
                          }}
                        />
                      ) : (
                        product.title
                      )}{" "}
                      across multiple retailers.
                    </p>
                    <button
                      onClick={() =>
                        handleAffiliateClick(
                          product.affiliateUrl,
                          product.title
                        )
                      }
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Find Best Price</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* User Experience */}
          <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection("experience")}
              className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  User Experience & Performance
                </h2>
                {expandedSections.has("experience") ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>
            {expandedSections.has("experience") && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Performance Metrics
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">
                            Speed
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            9.2/10
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: "92%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">
                            Battery Life
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            8.8/10
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: "88%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">
                            Build Quality
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            9.5/10
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: "95%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      User Feedback
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          95% User Satisfaction
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Excellent Value for Money
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Editor&apos;s Choice Award
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Affiliate Link */}
                {product?.affiliateUrl && (
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      Experience the Difference
                    </h4>
                    <p className="text-purple-800 dark:text-purple-200 text-sm mb-3">
                      Join thousands of satisfied customers who chose{" "}
                      {product.affiliateUrl ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: createProductTitleLink(
                              product,
                              "text-purple-800 dark:text-purple-200 hover:text-purple-700 dark:hover:text-purple-300 underline"
                            ),
                          }}
                        />
                      ) : (
                        product.title
                      )}{" "}
                      for their needs.
                    </p>
                    <button
                      onClick={() =>
                        handleAffiliateClick(
                          product.affiliateUrl,
                          product.title
                        )
                      }
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        Buy{" "}
                        {product.affiliateUrl ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: createProductTitleLink(
                                product,
                                "text-white hover:text-gray-100 underline"
                              ),
                            }}
                          />
                        ) : (
                          product.title
                        )}{" "}
                        Now
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Price Comparison */}
          {product && (
            <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Price Comparison & Best Deals
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${product.price}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Amazon Price
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      $0
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Shipping
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Award className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      Best
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Value
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Get the Best Price Today
                  </h3>
                  <p className="mb-4 opacity-90">
                    Save money and get fast, free shipping when you buy through
                    our trusted affiliate link.
                  </p>
                  <button
                    onClick={() =>
                      handleAffiliateClick(product.affiliateUrl, product.title)
                    }
                    className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 mx-auto"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>
                      Buy{" "}
                      {product.affiliateUrl ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: createProductTitleLink(
                              product,
                              "text-white hover:text-gray-100 underline"
                            ),
                          }}
                        />
                      ) : (
                        product.title
                      )}{" "}
                      Now
                    </span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Verdict */}
        {review.verdict && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2" />
              Final Verdict
            </h3>
            <p
              className="text-blue-800 dark:text-blue-200 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{
                __html:
                  product && product.affiliateUrl
                    ? attachAffiliateLinksToHTML(review.verdict, product)
                    : review.verdict,
              }}
            />

            {/* Final CTA */}
            {product?.affiliateUrl && (
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to Make Your Purchase?
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Don&apos;t miss out on this excellent{" "}
                  {product.affiliateUrl ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: createProductTitleLink(
                          product,
                          "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 underline"
                        ),
                      }}
                    />
                  ) : (
                    product.title
                  )}
                  . Click below to get the best deal available.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      handleAffiliateClick(product.affiliateUrl, product.title)
                    }
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>
                      Buy{" "}
                      {product.affiliateUrl ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: createProductTitleLink(
                              product,
                              "text-white hover:text-gray-100 underline"
                            ),
                          }}
                        />
                      ) : (
                        product.title
                      )}{" "}
                      Now
                    </span>
                  </button>
                  <button
                    onClick={() => setShowComparisonModal(true)}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-lg transition-colors duration-200"
                  >
                    <GitCompare className="w-5 h-5" />
                    <span>Compare Alternatives</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Related Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Products Section */}
        {/* Optionally, you can fetch and show real related products here if your API supports it. Otherwise, do not show this section. */}
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
