export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductReview {
  rating: number;
  comment: string;
  author?: string;
  date?: string;
}

export interface ScrapedProduct {
  id: string;
  name: string;
  brand: string;
  price: {
    current: number;
    original?: number;
    currency: string;
  };
  description: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
  reviews: ProductReview[];
  rating: {
    average: number;
    count: number;
  };
  availability: boolean;
  url: string;
  source: "thegioididong" | "dienmayxanh";
  scrapedAt: Date;
}

export interface ScrapingRequest {
  url: string;
  source?: "thegioididong" | "dienmayxanh" | "auto";
}

export interface ScrapingResponse {
  success: boolean;
  data?: ScrapedProduct;
  error?: string;
  message?: string;
}
