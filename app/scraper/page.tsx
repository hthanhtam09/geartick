import ProductScraper from "@/components/ProductScraper";

export const metadata = {
  title: "Product Scraper - GearTick",
  description:
    "Extract product information from Vietnamese e-commerce websites",
};

const ScraperPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProductScraper />
    </div>
  );
};

export default ScraperPage;
