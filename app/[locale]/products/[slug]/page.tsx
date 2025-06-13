import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProductDetailPage from "@/components/ProductDetailPage";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug, locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Products",
  });

  return {
    title: `${slug} - ${t("meta.title")}`,
    description: t("meta.description"),
    openGraph: {
      title: `${slug} - ${t("meta.title")}`,
      description: t("meta.description"),
      type: "website",
    },
  };
};

const ProductPage: React.FC<PageProps> = async ({ params }) => {
  const { slug, locale } = await params;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <ProductDetailPage productSlug={slug} locale={locale} />
    </div>
  );
};

export default ProductPage;
