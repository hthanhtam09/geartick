import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ReviewsList from "@/components/ReviewsList";

interface ReviewsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    featured?: string;
    category?: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: ReviewsPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Reviews",
  });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
    },
  };
};

const ReviewsPage: React.FC<ReviewsPageProps> = async ({
  params,
  searchParams,
}) => {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  const t = await getTranslations({
    locale,
    namespace: "Reviews",
  });

  const page = parseInt(resolvedSearchParams.page || "1");
  const featured = resolvedSearchParams.featured === "true";
  const category = resolvedSearchParams.category;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Reviews List */}
        <ReviewsList
          initialPage={page}
          featured={featured}
          category={category}
          locale={locale}
        />
      </div>
    </div>
  );
};

export default ReviewsPage;
