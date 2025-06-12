import HeroSection from "@/components/HeroSection";
import FeaturedReviews from "@/components/FeaturedReviews";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedComparisons from "@/components/FeaturedComparisons";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

const HomePage: React.FC<HomePageProps> = async ({ params }) => {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section - Focus on Reviews */}
      <HeroSection locale={locale} />

      {/* Featured Reviews */}
      <FeaturedReviews locale={locale} />

      {/* Featured Comparisons */}
      <FeaturedComparisons locale={locale} />

      {/* Categories Section */}
      <CategoriesSection locale={locale} />
    </div>
  );
};

export default HomePage;
