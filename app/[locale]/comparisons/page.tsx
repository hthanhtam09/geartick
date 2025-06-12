import { Suspense } from "react";
import { Metadata } from "next";
import ComparisonsList from "@/components/ComparisonsList";
import ComparisonCategories from "@/components/ComparisonCategories";
import { ComparisonTable } from "@/types";

interface ComparisonsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: "Product Comparisons | TechReview",
  description:
    "Compare the latest tech products side-by-side with detailed analysis, pros & cons, and honest recommendations from our expert reviewers.",
  keywords: [
    "product comparison",
    "tech reviews",
    "smartphone comparison",
    "laptop comparison",
    "best tech products",
  ],
};

const ComparisonsPage: React.FC<ComparisonsPageProps> = async ({
  params,
  searchParams,
}) => {
  const { locale } = await params;
  const { category, sort } = await searchParams;

  // Mock data - replace with actual API call
  const mockComparisons: ComparisonTable[] = [
    {
      _id: "1",
      title: "iPhone 15 Pro vs Samsung Galaxy S24 Ultra vs Google Pixel 8 Pro",
      description: "The ultimate flagship smartphone showdown for 2024",
      category: "smartphones",
      products: [
        {
          _id: "p1",
          title: "iPhone 15 Pro Max",
          description: "Apple's latest flagship",
          category: "smartphones",
          brand: "Apple",
          price: 1199,
          currency: "USD",
          affiliateUrl: "https://example.com/iphone",
          images: ["/comparisons/iphone-15-pro.jpg"],
          slug: "iphone-15-pro-max",
          averageRating: 4.8,
          totalReviews: 2547,
          tags: ["smartphone", "premium"],
          createdAt: new Date(),
          updatedAt: new Date(),
          specifications: [],
          colors: [],
          pros: ["Exceptional camera", "Premium build", "Great performance"],
          cons: ["Expensive", "Limited USB-C features"],
          score: 9.2,
          bestFor: ["Photography", "Gaming", "Business"],
          worstFor: ["Budget users"],
        },
        {
          _id: "p2",
          title: "Samsung Galaxy S24 Ultra",
          description: "Samsung's flagship with S Pen",
          category: "smartphones",
          brand: "Samsung",
          price: 1299,
          currency: "USD",
          affiliateUrl: "https://example.com/samsung",
          images: ["/comparisons/galaxy-s24-ultra.jpg"],
          slug: "samsung-galaxy-s24-ultra",
          averageRating: 4.7,
          totalReviews: 1923,
          tags: ["smartphone", "premium"],
          createdAt: new Date(),
          updatedAt: new Date(),
          specifications: [],
          colors: [],
          pros: ["S Pen functionality", "Great display", "Excellent cameras"],
          cons: ["Expensive", "Battery life could be better"],
          score: 9.0,
          bestFor: ["Productivity", "Note-taking", "Photography"],
          worstFor: ["Budget users"],
        },
        {
          _id: "p3",
          title: "Google Pixel 8 Pro",
          description: "Google's AI-powered flagship",
          category: "smartphones",
          brand: "Google",
          price: 999,
          currency: "USD",
          affiliateUrl: "https://example.com/pixel",
          images: ["/comparisons/pixel-8-pro.jpg"],
          slug: "google-pixel-8-pro",
          averageRating: 4.6,
          totalReviews: 1456,
          tags: ["smartphone", "ai"],
          createdAt: new Date(),
          updatedAt: new Date(),
          specifications: [],
          colors: [],
          pros: ["AI features", "Great value", "Pure Android"],
          cons: ["Build quality concerns", "Limited availability"],
          score: 8.7,
          bestFor: ["AI enthusiasts", "Photography", "Stock Android"],
          worstFor: ["Gaming performance"],
        },
      ],
      criteria: [],
      winner: {
        overall: "p1",
        bestValue: "p3",
        premium: "p1",
      },
      slug: "iphone-15-pro-vs-samsung-galaxy-s24-ultra-vs-pixel-8-pro",
      authorId: "author1",
      authorName: "Mobile Expert",
      isPublished: true,
      views: 45320,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20"),
    },
    {
      _id: "2",
      title: "MacBook Air M3 vs Dell XPS 13 vs ThinkPad X1 Carbon",
      description:
        "Best premium ultrabooks compared across performance, battery life, and value",
      category: "laptops",
      products: [
        {
          _id: "p4",
          title: "MacBook Air M3",
          description: "Apple's latest ultrabook",
          category: "laptops",
          brand: "Apple",
          price: 1299,
          currency: "USD",
          affiliateUrl: "https://example.com/macbook-air",
          images: ["/comparisons/macbook-air-m3.jpg"],
          slug: "macbook-air-m3",
          averageRating: 4.8,
          totalReviews: 1834,
          tags: ["laptop", "ultrabook"],
          createdAt: new Date(),
          updatedAt: new Date(),
          specifications: [],
          colors: [],
          pros: [
            "Excellent battery life",
            "Great performance",
            "Silent operation",
          ],
          cons: ["Limited ports", "Expensive storage upgrades"],
          score: 9.1,
          bestFor: ["Content creation", "Battery life", "Portability"],
          worstFor: ["Gaming", "Heavy multitasking"],
        },
        {
          _id: "p5",
          title: "Dell XPS 13",
          description: "Dell's premium ultrabook",
          category: "laptops",
          brand: "Dell",
          price: 1099,
          currency: "USD",
          affiliateUrl: "https://example.com/dell-xps13",
          images: ["/comparisons/dell-xps-13.jpg"],
          slug: "dell-xps-13",
          averageRating: 4.5,
          totalReviews: 1267,
          tags: ["laptop", "windows"],
          createdAt: new Date(),
          updatedAt: new Date(),
          specifications: [],
          colors: [],
          pros: ["Great display", "Good build quality", "Competitive price"],
          cons: ["Average battery life", "Webcam placement"],
          score: 8.4,
          bestFor: ["Windows users", "Good value", "Compact design"],
          worstFor: ["Battery life priority"],
        },
      ],
      criteria: [],
      winner: {
        overall: "p4",
        bestValue: "p5",
        premium: "p4",
      },
      slug: "macbook-air-m3-vs-dell-xps13-vs-thinkpad-x1-carbon",
      authorId: "author2",
      authorName: "Laptop Specialist",
      isPublished: true,
      views: 28940,
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-18"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Product Comparisons
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            Side-by-side comparisons of the latest tech products to help you
            make informed purchasing decisions. Compare features, performance,
            price, and get our honest recommendations.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="pb-8">
        <ComparisonCategories locale={locale} />
      </section>

      {/* Comparisons List */}
      <section className="pb-16">
        <Suspense
          fallback={<div className="animate-pulse">Loading comparisons...</div>}
        >
          <ComparisonsList
            comparisons={mockComparisons}
            locale={locale}
            category={typeof category === "string" ? category : undefined}
            sort={typeof sort === "string" ? sort : undefined}
          />
        </Suspense>
      </section>
    </div>
  );
};

export default ComparisonsPage;
