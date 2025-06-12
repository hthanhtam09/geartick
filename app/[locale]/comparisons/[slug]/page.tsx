import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductComparisonTable from "@/components/ProductComparisonTable";
import ComparisonDetailHeader from "@/components/ComparisonDetailHeader";
import ComparisonConclusion from "@/components/ComparisonConclusion";
import RelatedComparisons from "@/components/RelatedComparisons";
import { ComparisonTable } from "@/types";

interface ComparisonDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// This would typically come from your CMS or database
const getComparisonBySlug = async (
  slug: string
): Promise<ComparisonTable | null> => {
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
          description:
            "Apple's latest flagship with titanium design and Action Button",
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
          specifications: [
            { name: "Display Size", value: "6.7 inches", category: "display" },
            {
              name: "Display Type",
              value: "Super Retina XDR OLED",
              category: "display",
            },
            {
              name: "Resolution",
              value: "2796 x 1290 pixels",
              category: "display",
            },
            { name: "Refresh Rate", value: "120Hz", category: "display" },
            { name: "Processor", value: "A17 Pro", category: "performance" },
            { name: "RAM", value: "8GB", category: "performance" },
            {
              name: "Storage",
              value: "256GB / 512GB / 1TB",
              category: "storage",
            },
            { name: "Main Camera", value: "48MP", category: "camera" },
            { name: "Ultra Wide", value: "12MP", category: "camera" },
            {
              name: "Telephoto",
              value: "12MP (5x optical zoom)",
              category: "camera",
            },
            { name: "Battery Capacity", value: "4441mAh", category: "battery" },
            {
              name: "Charging",
              value: "27W wired, 15W wireless",
              category: "battery",
            },
            { name: "Weight", value: "221g", category: "design" },
            {
              name: "Build",
              value: "Titanium frame, Glass back",
              category: "design",
            },
            { name: "Water Resistance", value: "IP68", category: "design" },
          ],
          colors: [
            { name: "Natural Titanium", hex: "#8E8E93" },
            { name: "Blue Titanium", hex: "#5E5CE6" },
            { name: "White Titanium", hex: "#F2F2F7" },
            { name: "Black Titanium", hex: "#1C1C1E" },
          ],
          pros: [
            "Exceptional camera system with 5x telephoto zoom",
            "Premium titanium build quality",
            "Outstanding performance with A17 Pro chip",
            "Excellent display quality and brightness",
            "Long software support lifecycle",
            "Action Button customization",
          ],
          cons: [
            "Very expensive starting price",
            "Limited USB-C transfer speeds on base model",
            "No significant battery life improvements",
            "Still uses Lightning-like charging speeds",
          ],
          score: 9.2,
          bestFor: [
            "Photography enthusiasts",
            "Gaming",
            "Business users",
            "Long-term investment",
          ],
          worstFor: ["Budget-conscious buyers", "Android power users"],
        },
        {
          _id: "p2",
          title: "Samsung Galaxy S24 Ultra",
          description: "Samsung's flagship with S Pen and advanced AI features",
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
          specifications: [
            { name: "Display Size", value: "6.8 inches", category: "display" },
            {
              name: "Display Type",
              value: "Dynamic AMOLED 2X",
              category: "display",
            },
            {
              name: "Resolution",
              value: "3120 x 1440 pixels",
              category: "display",
            },
            { name: "Refresh Rate", value: "120Hz", category: "display" },
            {
              name: "Processor",
              value: "Snapdragon 8 Gen 3",
              category: "performance",
            },
            { name: "RAM", value: "12GB", category: "performance" },
            {
              name: "Storage",
              value: "256GB / 512GB / 1TB",
              category: "storage",
            },
            { name: "Main Camera", value: "200MP", category: "camera" },
            { name: "Ultra Wide", value: "12MP", category: "camera" },
            {
              name: "Telephoto",
              value: "50MP (5x optical zoom)",
              category: "camera",
            },
            { name: "Battery Capacity", value: "5000mAh", category: "battery" },
            {
              name: "Charging",
              value: "45W wired, 15W wireless",
              category: "battery",
            },
            { name: "Weight", value: "232g", category: "design" },
            {
              name: "Build",
              value: "Aluminum frame, Glass back",
              category: "design",
            },
            { name: "Water Resistance", value: "IP68", category: "design" },
          ],
          colors: [
            { name: "Titanium Gray", hex: "#6C6C6C" },
            { name: "Titanium Black", hex: "#1C1C1C" },
            { name: "Titanium Violet", hex: "#8A4FFF" },
            { name: "Titanium Yellow", hex: "#FFD700" },
          ],
          pros: [
            "S Pen functionality for productivity",
            "Excellent display quality and size",
            "Outstanding camera system with 200MP main sensor",
            "Great multitasking capabilities",
            "Fast charging and large battery",
            "Advanced AI features",
          ],
          cons: [
            "Heavy and bulky design",
            "Expensive price point",
            "Battery life could be better for the size",
            "One UI can feel overwhelming",
          ],
          score: 9.0,
          bestFor: [
            "Productivity users",
            "Note-taking",
            "Photography",
            "Content creation",
          ],
          worstFor: ["One-handed use", "Budget buyers"],
        },
        {
          _id: "p3",
          title: "Google Pixel 8 Pro",
          description:
            "Google's AI-powered flagship with advanced computational photography",
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
          specifications: [
            { name: "Display Size", value: "6.7 inches", category: "display" },
            { name: "Display Type", value: "LTPO OLED", category: "display" },
            {
              name: "Resolution",
              value: "2992 x 1344 pixels",
              category: "display",
            },
            { name: "Refresh Rate", value: "120Hz", category: "display" },
            {
              name: "Processor",
              value: "Google Tensor G3",
              category: "performance",
            },
            { name: "RAM", value: "12GB", category: "performance" },
            {
              name: "Storage",
              value: "128GB / 256GB / 512GB",
              category: "storage",
            },
            { name: "Main Camera", value: "50MP", category: "camera" },
            { name: "Ultra Wide", value: "48MP", category: "camera" },
            {
              name: "Telephoto",
              value: "48MP (5x optical zoom)",
              category: "camera",
            },
            { name: "Battery Capacity", value: "5050mAh", category: "battery" },
            {
              name: "Charging",
              value: "30W wired, 23W wireless",
              category: "battery",
            },
            { name: "Weight", value: "213g", category: "design" },
            {
              name: "Build",
              value: "Aluminum frame, Glass back",
              category: "design",
            },
            { name: "Water Resistance", value: "IP68", category: "design" },
          ],
          colors: [
            { name: "Obsidian", hex: "#1C1C1C" },
            { name: "Porcelain", hex: "#F8F8FF" },
            { name: "Bay", hex: "#5BB5D6" },
          ],
          pros: [
            "Exceptional AI-powered photography features",
            "Clean Android experience with fastest updates",
            "Great value for money compared to competitors",
            "Excellent computational photography",
            "Magic Eraser and other AI features",
            "7 years of software updates",
          ],
          cons: [
            "Tensor G3 performance lags behind competition",
            "Build quality concerns with some units",
            "Limited global availability",
            "Slower charging compared to competitors",
          ],
          score: 8.7,
          bestFor: [
            "AI enthusiasts",
            "Photography",
            "Stock Android lovers",
            "Value seekers",
          ],
          worstFor: ["Gaming performance", "Fast charging needs"],
        },
      ],
      criteria: [
        {
          name: "Camera Quality",
          weight: 9,
          description: "Overall photo and video quality",
        },
        {
          name: "Performance",
          weight: 8,
          description: "Processing power and multitasking",
        },
        {
          name: "Display Quality",
          weight: 8,
          description: "Screen quality and viewing experience",
        },
        {
          name: "Battery Life",
          weight: 7,
          description: "All-day usage and charging speed",
        },
        {
          name: "Build Quality",
          weight: 7,
          description: "Materials and construction",
        },
        {
          name: "Software Experience",
          weight: 6,
          description: "UI/UX and software support",
        },
        {
          name: "Value for Money",
          weight: 8,
          description: "Price vs features ratio",
        },
      ],
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
  ];

  return mockComparisons.find((comp) => comp.slug === slug) || null;
};

export async function generateMetadata({
  params,
}: ComparisonDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    return {
      title: "Comparison Not Found",
    };
  }

  return {
    title: `${comparison.title} | TechReview Comparison`,
    description: comparison.description,
    keywords: comparison.products.map((p) => p.title).join(", "),
  };
}

const ComparisonDetailPage: React.FC<ComparisonDetailPageProps> = async ({
  params,
}) => {
  const { locale, slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <ComparisonDetailHeader comparison={comparison} locale={locale} />

      {/* Main Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ProductComparisonTable
            products={comparison.products}
            title={comparison.title}
          />
        </div>
      </section>

      {/* Conclusion Section */}
      <ComparisonConclusion comparison={comparison} locale={locale} />

      {/* Related Comparisons */}
      <RelatedComparisons currentComparison={comparison} locale={locale} />
    </div>
  );
};

export default ComparisonDetailPage;
