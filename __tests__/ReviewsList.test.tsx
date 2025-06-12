import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import ReviewsList from "@/components/ReviewsList";

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

const mockReview = {
  _id: "1",
  productId: {
    title: "Test Product",
    slug: "test-product",
    images: ["https://example.com/image.jpg"],
  },
  title: "Test Review",
  content:
    "This is a test review content with some detailed information about the product.",
  rating: 4.5,
  pros: ["Great performance", "Good design"],
  cons: ["Expensive", "Heavy"],
  verdict: "Excellent product overall",
  authorId: "author1",
  authorName: "John Doe",
  authorImage: "https://example.com/avatar.jpg",
  images: ["https://example.com/review-image.jpg"],
  slug: "test-review",
  likes: 125,
  views: 1500,
  isPublished: true,
  isFeatured: true,
  seoTitle: "Test Review SEO Title",
  seoDescription: "Test review SEO description",
  tags: ["tech", "review", "product"],
  readTime: 5,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

const mockApiResponse = {
  success: true,
  data: [mockReview],
  pagination: {
    page: 1,
    limit: 12,
    total: 1,
    pages: 1,
  },
};

describe("ReviewsList Component", () => {
  const mockPush = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(<ReviewsList initialPage={1} locale="en" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders reviews after successful fetch", async () => {
    render(<ReviewsList initialPage={1} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("Test Review")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("5 min read")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("handles review card click navigation", async () => {
    render(<ReviewsList initialPage={1} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("Test Review")).toBeInTheDocument();
    });

    const reviewCard = screen.getByRole("button", {
      name: /Read review: Test Review/i,
    });
    fireEvent.click(reviewCard);

    expect(mockPush).toHaveBeenCalledWith("/en/reviews/test-review");
  });

  it("shows featured badge for featured reviews", async () => {
    render(<ReviewsList initialPage={1} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("Featured")).toBeInTheDocument();
    });
  });

  it("displays error state when fetch fails", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(<ReviewsList initialPage={1} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("Error Loading Reviews")).toBeInTheDocument();
    });
  });

  it("shows empty state when no reviews found", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0,
        },
      }),
    });

    render(<ReviewsList initialPage={1} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("No Reviews Found")).toBeInTheDocument();
    });
  });

  it("handles keyboard navigation on review cards", async () => {
    render(<ReviewsList initialPage={1} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("Test Review")).toBeInTheDocument();
    });

    const reviewCard = screen.getByRole("button", {
      name: /Read review: Test Review/i,
    });
    fireEvent.keyDown(reviewCard, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/en/reviews/test-review");
  });

  it("constructs correct API URL with filters", async () => {
    render(
      <ReviewsList
        initialPage={2}
        featured={true}
        category="smartphones"
        locale="en"
      />
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/reviews?page=2&limit=12&featured=true&category=smartphones"
      );
    });
  });
});
