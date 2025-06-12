import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { getTranslations } from "next-intl/server";
import {
  Star,
  Calendar,
  Eye,
  ThumbsUp,
  Clock,
  Trophy,
  Medal,
  Award,
} from "lucide-react";
import ProductComparisonTable from "@/components/ProductComparisonTable";
import { ProductComparison } from "@/types";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

// Mock data for demonstration - replace with actual data fetching
const getMockComparisonData = async (
  slug: string
): Promise<{
  title: string;
  description: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  category: string;
  products: ProductComparison[];
  winner?: {
    overall: string;
    bestValue: string;
    premium: string;
  };
} | null> => {
  // In real implementation, fetch from your database
  if (slug !== "best-smartphones-2024") {
    return null;
  }

  return {
    title:
      "Best Smartphones 2024: iPhone 15 Pro vs Galaxy S24 Ultra vs Pixel 8 Pro Comparison",
    description:
      "Comprehensive comparison of the top 5 flagship smartphones in 2024. Find out which phone offers the best camera, performance, and value for money.",
    author: {
      name: "Alex Johnson",
      image: "/author-avatar.jpg",
      id: "author-1",
    },
    publishedAt: "2024-03-15",
    readTime: 12,
    views: 45670,
    likes: 892,
    category: "Smartphones",
    winner: {
      overall: "iphone-15-pro",
      bestValue: "pixel-8-pro",
      premium: "galaxy-s24-ultra",
    },
    products: [
      {
        _id: "iphone-15-pro",
        title: "iPhone 15 Pro",
        description:
          "Apple's flagship smartphone with titanium design and A17 Pro chip",
        category: "Smartphones",
        brand: "Apple",
        price: 999,
        currency: "USD",
        affiliateUrl: "https://amazon.com/iphone-15-pro?tag=yoursite-20",
        images: ["/placeholder-product.jpg"],
        slug: "iphone-15-pro",
        averageRating: 4.8,
        totalReviews: 1250,
        tags: ["flagship", "premium", "ios"],
        createdAt: new Date(),
        updatedAt: new Date(),
        specifications: [
          {
            name: "Display",
            value: '6.1" Super Retina XDR',
            category: "Display",
          },
          { name: "Processor", value: "A17 Pro", category: "Performance" },
          { name: "RAM", value: "8GB", category: "Performance" },
          {
            name: "Storage",
            value: "128GB/256GB/512GB/1TB",
            category: "Storage",
          },
          {
            name: "Camera",
            value: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
            category: "Camera",
          },
          { name: "Battery", value: "3274mAh", category: "Battery" },
          { name: "OS", value: "iOS 17", category: "Software" },
        ],
        colors: [
          { name: "Natural Titanium", hex: "#8D8D93" },
          { name: "Blue Titanium", hex: "#5E7C9B" },
          { name: "White Titanium", hex: "#F5F5DC" },
          { name: "Black Titanium", hex: "#2C2C2E" },
        ],
        pros: [
          "Exceptional build quality with titanium",
          "Outstanding camera system with 5x optical zoom",
          "Powerful A17 Pro chip with excellent performance",
          "Premium iOS experience with long software support",
          "Action Button replaces mute switch",
        ],
        cons: [
          "Very expensive starting price",
          "Limited customization compared to Android",
          "No USB-C to Lightning adapter included",
          "Battery life could be better for the price",
        ],
        score: 9.2,
        bestFor: [
          "Premium users",
          "Photography enthusiasts",
          "iOS ecosystem users",
        ],
        worstFor: ["Budget-conscious buyers", "Heavy customization users"],
        dimensions: {
          length: 146.6,
          width: 70.6,
          height: 8.25,
          weight: 187,
          unit: "mm/g",
        },
      },
      {
        _id: "galaxy-s24-ultra",
        title: "Samsung Galaxy S24 Ultra",
        description:
          "Samsung's premium flagship with S Pen and advanced AI features",
        category: "Smartphones",
        brand: "Samsung",
        price: 1199,
        currency: "USD",
        affiliateUrl: "https://amazon.com/galaxy-s24-ultra?tag=yoursite-20",
        images: ["/placeholder-product.jpg"],
        slug: "galaxy-s24-ultra",
        averageRating: 4.7,
        totalReviews: 980,
        tags: ["flagship", "premium", "android", "s-pen"],
        createdAt: new Date(),
        updatedAt: new Date(),
        specifications: [
          {
            name: "Display",
            value: '6.8" Dynamic AMOLED 2X',
            category: "Display",
          },
          {
            name: "Processor",
            value: "Snapdragon 8 Gen 3",
            category: "Performance",
          },
          { name: "RAM", value: "12GB", category: "Performance" },
          { name: "Storage", value: "256GB/512GB/1TB", category: "Storage" },
          {
            name: "Camera",
            value:
              "200MP Main + 50MP Periscope + 10MP Telephoto + 12MP Ultra Wide",
            category: "Camera",
          },
          { name: "Battery", value: "5000mAh", category: "Battery" },
          {
            name: "OS",
            value: "Android 14 with One UI 6.1",
            category: "Software",
          },
        ],
        colors: [
          { name: "Titanium Gray", hex: "#6B6B6B" },
          { name: "Titanium Black", hex: "#2C2C2E" },
          { name: "Titanium Violet", hex: "#8A6B9D" },
          { name: "Titanium Yellow", hex: "#F4D03F" },
        ],
        pros: [
          'Massive 6.8" display with excellent brightness',
          "Incredible 200MP camera with 100x Space Zoom",
          "Built-in S Pen for productivity",
          "Excellent battery life with 5000mAh",
          "Advanced AI features and Galaxy AI",
        ],
        cons: [
          "Very large and heavy device",
          "Expensive with limited storage options",
          "One UI can feel overwhelming",
          "S Pen slot makes device thicker",
        ],
        score: 9.0,
        bestFor: ["Power users", "Note-taking enthusiasts", "Photography pros"],
        worstFor: ["Small phone lovers", "Budget users"],
        dimensions: {
          length: 162.3,
          width: 79.0,
          height: 8.6,
          weight: 232,
          unit: "mm/g",
        },
      },
      {
        _id: "pixel-8-pro",
        title: "Google Pixel 8 Pro",
        description:
          "Google's flagship with pure Android and advanced AI photography",
        category: "Smartphones",
        brand: "Google",
        price: 999,
        currency: "USD",
        affiliateUrl: "https://amazon.com/pixel-8-pro?tag=yoursite-20",
        images: ["/placeholder-product.jpg"],
        slug: "pixel-8-pro",
        averageRating: 4.6,
        totalReviews: 750,
        tags: ["flagship", "android", "ai", "camera"],
        createdAt: new Date(),
        updatedAt: new Date(),
        specifications: [
          { name: "Display", value: '6.7" LTPO OLED', category: "Display" },
          {
            name: "Processor",
            value: "Google Tensor G3",
            category: "Performance",
          },
          { name: "RAM", value: "12GB", category: "Performance" },
          {
            name: "Storage",
            value: "128GB/256GB/512GB/1TB",
            category: "Storage",
          },
          {
            name: "Camera",
            value: "50MP Main + 48MP Ultra Wide + 48MP Telephoto",
            category: "Camera",
          },
          { name: "Battery", value: "5050mAh", category: "Battery" },
          { name: "OS", value: "Android 14", category: "Software" },
        ],
        colors: [
          { name: "Obsidian", hex: "#2C2C2E" },
          { name: "Porcelain", hex: "#F5F5DC" },
          { name: "Bay", hex: "#A7C5BD" },
        ],
        pros: [
          "Exceptional AI-powered photography",
          "Pure Android experience with fastest updates",
          "Great value for flagship features",
          "Excellent computational photography",
          "7 years of software support",
        ],
        cons: [
          "Tensor G3 not as powerful as competitors",
          "Battery life inconsistent",
          "Limited availability globally",
          "Fingerprint sensor can be unreliable",
        ],
        score: 8.7,
        bestFor: [
          "Photography enthusiasts",
          "Pure Android lovers",
          "AI feature users",
        ],
        worstFor: ["Gaming enthusiasts", "International users"],
        dimensions: {
          length: 162.6,
          width: 76.5,
          height: 8.8,
          weight: 213,
          unit: "mm/g",
        },
      },
      {
        _id: "oneplus-12",
        title: "OnePlus 12",
        description:
          "Flagship killer with fast charging and smooth performance",
        category: "Smartphones",
        brand: "OnePlus",
        price: 799,
        currency: "USD",
        affiliateUrl: "https://amazon.com/oneplus-12?tag=yoursite-20",
        images: ["/placeholder-product.jpg"],
        slug: "oneplus-12",
        averageRating: 4.5,
        totalReviews: 650,
        tags: ["flagship-killer", "android", "fast-charging"],
        createdAt: new Date(),
        updatedAt: new Date(),
        specifications: [
          { name: "Display", value: '6.82" LTPO AMOLED', category: "Display" },
          {
            name: "Processor",
            value: "Snapdragon 8 Gen 3",
            category: "Performance",
          },
          { name: "RAM", value: "12GB/16GB", category: "Performance" },
          { name: "Storage", value: "256GB/512GB", category: "Storage" },
          {
            name: "Camera",
            value: "50MP Main + 64MP Periscope + 48MP Ultra Wide",
            category: "Camera",
          },
          { name: "Battery", value: "5400mAh", category: "Battery" },
          {
            name: "OS",
            value: "Android 14 with OxygenOS 14",
            category: "Software",
          },
        ],
        colors: [
          { name: "Silky Black", hex: "#2C2C2E" },
          { name: "Flowy Emerald", hex: "#50C878" },
          { name: "Glacial White", hex: "#F8F8FF" },
        ],
        pros: [
          "Excellent price-to-performance ratio",
          "Incredibly fast 100W charging",
          "Smooth OxygenOS experience",
          "Great gaming performance",
          "Hasselblad-tuned cameras",
        ],
        cons: [
          "Limited software support compared to others",
          "No wireless charging",
          "Camera quality inconsistent in low light",
          "Plastic frame feels less premium",
        ],
        score: 8.5,
        bestFor: [
          "Value seekers",
          "Gaming enthusiasts",
          "Fast charging lovers",
        ],
        worstFor: ["Premium build seekers", "Wireless charging users"],
        dimensions: {
          length: 164.3,
          width: 75.8,
          height: 9.15,
          weight: 220,
          unit: "mm/g",
        },
      },
      {
        _id: "xiaomi-14-ultra",
        title: "Xiaomi 14 Ultra",
        description: "Camera-focused flagship with Leica partnership",
        category: "Smartphones",
        brand: "Xiaomi",
        price: 1199,
        currency: "USD",
        affiliateUrl: "https://amazon.com/xiaomi-14-ultra?tag=yoursite-20",
        images: ["/placeholder-product.jpg"],
        slug: "xiaomi-14-ultra",
        averageRating: 4.4,
        totalReviews: 480,
        tags: ["flagship", "camera", "leica", "android"],
        createdAt: new Date(),
        updatedAt: new Date(),
        specifications: [
          { name: "Display", value: '6.73" LTPO AMOLED', category: "Display" },
          {
            name: "Processor",
            value: "Snapdragon 8 Gen 3",
            category: "Performance",
          },
          { name: "RAM", value: "12GB/16GB", category: "Performance" },
          { name: "Storage", value: "256GB/512GB/1TB", category: "Storage" },
          {
            name: "Camera",
            value:
              "50MP Main + 50MP Ultra Wide + 50MP Periscope + 50MP Telephoto",
            category: "Camera",
          },
          { name: "Battery", value: "5300mAh", category: "Battery" },
          {
            name: "OS",
            value: "Android 14 with MIUI 15",
            category: "Software",
          },
        ],
        colors: [
          { name: "Black", hex: "#2C2C2E" },
          { name: "Blue", hex: "#4A90E2" },
          { name: "White", hex: "#F8F8FF" },
        ],
        pros: [
          "Outstanding Leica-tuned quad camera system",
          "Premium build quality with ceramic back",
          "Excellent display quality",
          "Fast 90W wired and 80W wireless charging",
          "Great performance with Snapdragon 8 Gen 3",
        ],
        cons: [
          "MIUI can be bloated and overwhelming",
          "Limited global availability",
          "Expensive for the brand",
          "Heavy and bulky design",
        ],
        score: 8.3,
        bestFor: [
          "Photography professionals",
          "Camera enthusiasts",
          "Premium users",
        ],
        worstFor: ["MIUI haters", "Budget users", "Compact phone lovers"],
        dimensions: {
          length: 161.4,
          width: 75.3,
          height: 9.2,
          weight: 224,
          unit: "mm/g",
        },
      },
    ],
  };
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const resolvedParams = await params;
  const data = await getMockComparisonData(resolvedParams.slug);
  const t = await getTranslations("ReviewPage");

  if (!data) {
    return {
      title: t("Common.notFound"),
    };
  }

  return {
    title: data.title,
    description: data.description,
    keywords: `product review, comparison, ${data.category}, ${data.products
      .map((p) => p.brand)
      .join(", ")}`,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      publishedTime: data.publishedAt,
      authors: [data.author.name],
      images: [
        {
          url: data.products[0]?.images[0] || "/default-og-image.jpg",
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: [data.products[0]?.images[0] || "/default-og-image.jpg"],
    },
  };
};

interface ProductReviewDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

const ProductReviewDetailPage: React.FC<ProductReviewDetailPageProps> = async ({
  params,
}) => {
  const resolvedParams = await params;
  const data = await getMockComparisonData(resolvedParams.slug);
  const t = await getTranslations("ReviewPage");

  if (!data) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: data.title,
      description: data.description,
      category: data.category,
      brand: data.products.map((p) => p.brand),
    },
    author: {
      "@type": "Person",
      name: data.author.name,
    },
    datePublished: data.publishedAt,
    reviewRating: {
      "@type": "Rating",
      ratingValue:
        data.products.reduce((acc, p) => acc + p.score, 0) /
        data.products.length,
      bestRating: 10,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                <Award className="w-4 h-4 mr-2" />
                {t("category", { category: data.category })}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {data.title}
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {data.description}
              </p>

              {/* Author and Meta Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100">
                <div className="flex items-center gap-3">
                  <Image
                    src={data.author.image}
                    alt={data.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="text-left">
                    <p className="font-semibold">
                      {t("author", { name: data.author.name })}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {t("publishedDate", {
                          date: new Date(data.publishedAt).toLocaleDateString(),
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {t("readTime", { minutes: data.readTime })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {t("views", { count: data.views.toLocaleString() })}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {t("likes", { count: data.likes })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Winners Section */}
        {data.winner && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("topPicks")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("topPicksDescription")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    key: "overall",
                    title: t("winners.overall"),
                    icon: Trophy,
                    color: "gold",
                  },
                  {
                    key: "bestValue",
                    title: t("winners.bestValue"),
                    icon: Medal,
                    color: "silver",
                  },
                  {
                    key: "premium",
                    title: t("winners.premium"),
                    icon: Award,
                    color: "bronze",
                  },
                ].map(({ key, title, icon: Icon, color }) => {
                  const product = data.products.find(
                    (p) =>
                      p._id === data.winner![key as keyof typeof data.winner]
                  );
                  if (!product) return null;

                  const colorClasses = {
                    gold: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
                    silver:
                      "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700",
                    bronze:
                      "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800",
                  };

                  return (
                    <div
                      key={key}
                      className={`p-6 rounded-lg border-2 ${
                        colorClasses[color as keyof typeof colorClasses]
                      }`}
                    >
                      <div className="text-center">
                        <Icon className="w-8 h-8 mx-auto mb-3 text-yellow-600 dark:text-yellow-400" />
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {title}
                        </h3>
                        <div className="mb-4">
                          <Image
                            src={
                              product.images[0] || "/placeholder-product.jpg"
                            }
                            alt={product.title}
                            width={80}
                            height={80}
                            className="mx-auto rounded-lg object-cover"
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {product.title}
                        </h4>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">
                          ${product.price}
                        </p>
                        <div className="flex items-center justify-center gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= product.averageRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {product.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <Link
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          {t("viewDeal")}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Product Comparison Table */}
          <ProductComparisonTable
            products={data.products}
            title={
              t("compareProducts", {
                count: data.products.length,
              }) +
              " " +
              data.category
            }
            className="mb-12"
          />

          {/* Additional Content Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t("methodology.title")}
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t("methodology.description")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t("methodology.performance.title")}
                  </h3>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                    {(t.raw("methodology.performance.items") as string[]).map(
                      (item, index) => (
                        <li key={index}>• {item}</li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t("methodology.camera.title")}
                  </h3>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                    {(t.raw("methodology.camera.items") as string[]).map(
                      (item, index) => (
                        <li key={index}>• {item}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("conclusion.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("conclusion.description")}
            </p>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <strong>{t("conclusion.disclosure")}</strong>
              </p>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default ProductReviewDetailPage;
