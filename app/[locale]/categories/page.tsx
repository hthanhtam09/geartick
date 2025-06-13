import { Suspense } from "react";
import { Metadata } from "next";
import CategoriesSection from "@/components/CategoriesSection";
import ComparisonCategories from "@/components/ComparisonCategories";
import LoadingSpinner from "@/components/LoadingSpinner";

interface CategoriesPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Product Categories | GearTick",
    description:
      "Browse all product categories and find the best gear for your needs.",
  };
}

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Product Categories</h1>
        <p className="text-lg text-muted-foreground">
          Explore our comprehensive collection of product categories to find the
          perfect gear for your needs.
        </p>
      </div>

      <div className="space-y-12">
        {/* Product Categories */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Product Categories</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <CategoriesSection locale={locale} />
          </Suspense>
        </section>

        {/* Comparison Categories */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Comparison Categories</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <ComparisonCategories locale={locale} />
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default CategoriesPage;
