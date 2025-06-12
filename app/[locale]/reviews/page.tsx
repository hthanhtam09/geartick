import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ReviewsList from "@/components/ReviewsList";

interface ReviewsPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    page?: string;
    featured?: string;
    category?: string;
  };
}

export const generateMetadata = async ({
  params,
}: ReviewsPageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: params.locale,
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
  const t = await getTranslations({
    locale: params.locale,
    namespace: "Reviews",
  });

  const page = parseInt(searchParams.page || "1");
  const featured = searchParams.featured === "true";
  const category = searchParams.category;

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
          locale={params.locale}
        />
      </div>
    </div>
  );
};

export default ReviewsPage;
