import { useQuery } from "@tanstack/react-query";
import { Review, ApiResponse } from "@/types";

// Interface for populated review data
interface PopulatedReview extends Omit<Review, "productId"> {
  productId: {
    title: string;
    slug: string;
    images: string[];
  };
}

interface ReviewsQueryParams {
  page?: number;
  limit?: number;
  featured?: boolean;
  category?: string;
  productId?: string;
}

interface ReviewsResponse {
  reviews: PopulatedReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const fetchReviews = async (
  params: ReviewsQueryParams
): Promise<ReviewsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.featured) searchParams.append("featured", "true");
  if (params.category) searchParams.append("category", params.category);
  if (params.productId) searchParams.append("productId", params.productId);

  const response = await fetch(`/api/reviews?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.statusText}`);
  }

  const data: ApiResponse<PopulatedReview[]> = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch reviews");
  }

  return {
    reviews: data.data,
    pagination: data.pagination || {
      page: params.page || 1,
      limit: params.limit || 10,
      total: data.data.length,
      pages: 1,
    },
  };
};

export const useReviews = (params: ReviewsQueryParams = {}) => {
  const {
    page = 1,
    limit = 12,
    featured = false,
    category,
    productId,
  } = params;

  return useQuery({
    queryKey: ["reviews", { page, limit, featured, category, productId }],
    queryFn: () => fetchReviews({ page, limit, featured, category, productId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useFeaturedReviews = (limit: number = 6) => {
  return useQuery({
    queryKey: ["reviews", "featured", limit],
    queryFn: () => fetchReviews({ featured: true, limit }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useReviewsByCategory = (
  category: string,
  page: number = 1,
  limit: number = 12
) => {
  return useQuery({
    queryKey: ["reviews", "category", category, page, limit],
    queryFn: () => fetchReviews({ category, page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!category,
  });
};

export const useProductReviews = (
  productId: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["reviews", "product", productId, page, limit],
    queryFn: () => fetchReviews({ productId, page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!productId,
  });
};

export type { PopulatedReview, ReviewsQueryParams, ReviewsResponse };
