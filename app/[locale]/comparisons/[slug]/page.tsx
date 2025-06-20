import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductComparisonTable from "@/components/ProductComparisonTable";
import ComparisonDetailHeader from "@/components/ComparisonDetailHeader";
import ComparisonConclusion from "@/components/ComparisonConclusion";
import RelatedComparisons from "@/components/RelatedComparisons";
import { ProductComparison } from "@/types";

interface ComparisonDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Fetch products by slugs from the API
const getProductsBySlugs = async (
  slugs: string[]
): Promise<ProductComparison[]> => {
  try {
    const products: ProductComparison[] = [];

    for (const slug of slugs) {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/products?query=${slug}&limit=1`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          // Transform Product to ProductComparison
          const product = data.data[0];
          const comparisonProduct: ProductComparison = {
            ...product,
            specifications: product.specifications || [],
            colors: product.colors || [],
            pros: product.pros || [],
            cons: product.cons || [],
            score: product.score || 0,
            bestFor: product.bestFor || [],
            worstFor: product.worstFor || [],
            dimensions: product.dimensions,
          };
          products.push(comparisonProduct);
        }
      }
    }

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Parse slug to extract product slugs
const parseComparisonSlug = (slug: string): string[] => {
  return slug.split("-vs-");
};

export async function generateMetadata({
  params,
}: ComparisonDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productSlugs = parseComparisonSlug(slug);
  const products = await getProductsBySlugs(productSlugs);

  if (products.length === 0) {
    return {
      title: "Comparison Not Found",
      description: "The requested product comparison could not be found.",
    };
  }

  const productNames = products.map((p) => p.title).join(" vs ");
  const category = products[0]?.category || "products";

  return {
    title: `${productNames} - Product Comparison | GearTick`,
    description: `Compare ${productNames} side by side. Find the best ${category} for your needs with detailed specifications, pros and cons, and expert recommendations.`,
    keywords: [
      ...productNames.split(" "),
      category,
      "comparison",
      "review",
      "specifications",
      "pros and cons",
    ],
    openGraph: {
      title: `${productNames} - Product Comparison`,
      description: `Compare ${productNames} side by side. Find the best ${category} for your needs.`,
      type: "website",
      images: products[0]?.images?.[0] ? [products[0].images[0]] : [],
    },
  };
}

const ComparisonDetailPage: React.FC<ComparisonDetailPageProps> = async ({
  params,
}) => {
  const { locale, slug } = await params;
  const productSlugs = parseComparisonSlug(slug);

  if (productSlugs.length < 2) {
    notFound();
  }

  const products = await getProductsBySlugs(productSlugs);

  if (products.length < 2) {
    notFound();
  }

  // Create comparison data
  const comparison = {
    _id: slug,
    title: `${products.map((p) => p.title).join(" vs ")}`,
    description: `Compare ${products
      .map((p) => p.title)
      .join(", ")} side by side. Find the best ${
      products[0]?.category || "product"
    } for your needs.`,
    category: products[0]?.category || "products",
    products,
    slug,
    authorId: "system",
    authorName: "GearTick Team",
    isPublished: true,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Determine winners
  const determineWinners = () => {
    if (products.length < 2) return {};

    const sortedByScore = [...products].sort(
      (a, b) => (b.score || 0) - (a.score || 0)
    );
    const sortedByValue = [...products].sort((a, b) => {
      const aValue = (a.score || 0) / (a.price || 1);
      const bValue = (b.score || 0) / (b.price || 1);
      return bValue - aValue;
    });

    return {
      overall: sortedByScore[0]?._id,
      bestValue: sortedByValue[0]?._id,
      premium: sortedByScore[0]?._id,
    };
  };

  const winners = determineWinners();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <ComparisonDetailHeader comparison={comparison} locale={locale} />

        {/* Main Comparison Table */}
        <div className="mt-8">
          <ProductComparisonTable
            products={products}
            title={`${products.map((p) => p.title).join(" vs ")}`}
            className="mb-8"
          />
        </div>

        {/* Winners Section */}
        {Object.keys(winners).length > 0 && (
          <div className="mt-8">
            <ComparisonConclusion
              products={products}
              winners={winners}
              category={comparison.category}
            />
          </div>
        )}

        {/* Related Comparisons */}
        <div className="mt-12">
          <RelatedComparisons
            currentCategory={comparison.category}
            currentProductIds={products.map((p) => p._id)}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonDetailPage;
