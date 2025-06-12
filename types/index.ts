export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  currency: string;
  affiliateUrl: string;
  images: string[];
  slug: string;
  averageRating: number;
  totalReviews: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  _id: string;
  productId: string;
  title: string;
  content: string;
  rating: number;
  pros: string[];
  cons: string[];
  verdict: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  images: string[];
  slug: string;
  likes: number;
  views: number;
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  reviewId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  parentId?: string;
  likes: number;
  replies: Comment[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  image?: string;
  role: "user" | "admin" | "moderator";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  brand?: string;
  minRating?: number;
  maxRating?: number;
  sortBy?: "newest" | "oldest" | "rating" | "popularity";
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Language {
  code: "en" | "vi";
  name: string;
  nativeName: string;
}

export interface ThemeConfig {
  mode: "light" | "dark" | "system";
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

// Extended types for product comparison functionality
export interface ProductSpecification {
  name: string;
  value: string;
  category: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductComparison extends Product {
  specifications: ProductSpecification[];
  colors: ProductColor[];
  pros: string[];
  cons: string[];
  score: number;
  bestFor: string[];
  worstFor: string[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit: string;
  };
}

export interface ComparisonTable {
  _id: string;
  title: string;
  description: string;
  category: string;
  products: ProductComparison[];
  criteria: ComparisonCriteria[];
  winner?: {
    overall: string; // Product ID
    bestValue: string; // Product ID
    premium: string; // Product ID
  };
  slug: string;
  authorId: string;
  authorName: string;
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComparisonCriteria {
  name: string;
  weight: number; // 1-10 importance weight
  description?: string;
}

export interface AffiliateLink {
  url: string;
  provider: string; // Amazon, Best Buy, etc.
  price?: number;
  currency?: string;
  isAvailable: boolean;
  lastChecked: Date;
}
