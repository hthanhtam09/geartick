import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DetailedReviewPage from "@/components/DetailedReviewPage";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug, locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Reviews",
  });

  return {
    title: `${slug} - ${t("meta.title")}`,
    description: t("meta.description"),
    openGraph: {
      title: `${slug} - ${t("meta.title")}`,
      description: t("meta.description"),
      type: "article",
    },
  };
};

const ReviewDetailPage: React.FC<PageProps> = async ({ params }) => {
  const { slug, locale } = await params;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <DetailedReviewPage reviewSlug={slug} locale={locale} />
    </div>
  );
};

export default ReviewDetailPage;
