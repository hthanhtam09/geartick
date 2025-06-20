import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComparisonModal from "../components/ComparisonModal";
import { Product } from "../types";

// Mock fetch
global.fetch = jest.fn();

const mockProduct: Product = {
  _id: "1",
  title: "Test Product",
  description: "A test product for comparison",
  category: "smartphones",
  brand: "TestBrand",
  price: 999,
  currency: "USD",
  affiliateUrl: "https://example.com",
  images: ["/test-image.jpg"],
  slug: "test-product",
  averageRating: 4.5,
  totalReviews: 100,
  tags: ["test"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProducts: Product[] = [
  {
    _id: "2",
    title: "Product 2",
    description: "Second test product",
    category: "smartphones",
    brand: "TestBrand",
    price: 899,
    currency: "USD",
    affiliateUrl: "https://example.com/2",
    images: ["/test-image-2.jpg"],
    slug: "product-2",
    averageRating: 4.3,
    totalReviews: 80,
    tags: ["test"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    title: "Product 3",
    description: "Third test product",
    category: "smartphones",
    brand: "TestBrand",
    price: 1099,
    currency: "USD",
    affiliateUrl: "https://example.com/3",
    images: ["/test-image-3.jpg"],
    slug: "product-3",
    averageRating: 4.7,
    totalReviews: 120,
    tags: ["test"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("ComparisonModal", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("renders modal when open", () => {
    render(
      <ComparisonModal
        isOpen={true}
        onClose={jest.fn()}
        currentProduct={mockProduct}
        locale="en"
      />
    );

    expect(screen.getByText("Compare Products")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Select up to 4 additional products to compare with Test Product"
      )
    ).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <ComparisonModal
        isOpen={false}
        onClose={jest.fn()}
        currentProduct={mockProduct}
        locale="en"
      />
    );

    expect(screen.queryByText("Compare Products")).not.toBeInTheDocument();
  });

  it("shows current product as selected by default", () => {
    render(
      <ComparisonModal
        isOpen={true}
        onClose={jest.fn()}
        currentProduct={mockProduct}
        locale="en"
      />
    );

    expect(screen.getByText("Selected Products (1/5)")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("fetches products when opened", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockProducts,
      }),
    });

    render(
      <ComparisonModal
        isOpen={true}
        onClose={jest.fn()}
        currentProduct={mockProduct}
        locale="en"
      />
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products?category=smartphones&limit=100")
      );
    });
  });

  it("allows searching products", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockProducts,
      }),
    });

    render(
      <ComparisonModal
        isOpen={true}
        onClose={jest.fn()}
        currentProduct={mockProduct}
        locale="en"
      />
    );

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "Product 2" } });

    expect(searchInput).toHaveValue("Product 2");
  });

  it("shows filters when filter button is clicked", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockProducts,
      }),
    });

    render(
      <ComparisonModal
        isOpen={true}
        onClose={jest.fn()}
        currentProduct={mockProduct}
        locale="en"
      />
    );

    const filterButton = screen.getByText("Filters");
    fireEvent.click(filterButton);

    expect(screen.getByText("Brand")).toBeInTheDocument();
    expect(screen.getByText("Price Range")).toBeInTheDocument();
    expect(screen.getByText("Sort By")).toBeInTheDocument();
  });

  it("disables compare button when less than 2 products selected", () => {
    render(
      <ComparisonModal
        isOpen={true}
        onClose={jest.fn()}
        currentProduct={mockProduct}
        locale="en"
      />
    );

    const compareButton = screen.getByText("Compare 1 Products");
    expect(compareButton).toBeDisabled();
  });

  it("enables compare button when 2 or more products selected", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockProducts,
      }),
    });

    render(
      <ComparisonModal
        isOpen={true}
        onClose={jest.fn()}
        currentProduct={mockProduct}
        locale="en"
      />
    );

    await waitFor(() => {
      const productCards = screen.getAllByText(/Product \d/);
      if (productCards.length > 0) {
        fireEvent.click(productCards[0]);
      }
    });

    await waitFor(() => {
      const compareButton = screen.getByText("Compare 2 Products");
      expect(compareButton).not.toBeDisabled();
    });
  });
});
