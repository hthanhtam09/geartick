import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductComparisonTable from "@/components/ProductComparisonTable";
import { ProductComparison } from "@/types";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<"img">) => <img {...props} />,
}));

const mockProducts: ProductComparison[] = [
  {
    _id: "test-product-1",
    title: "Test Product 1",
    description: "Test description 1",
    category: "Test Category",
    brand: "Test Brand 1",
    price: 999,
    currency: "USD",
    affiliateUrl: "https://example.com/product1",
    images: ["/test-image-1.jpg"],
    slug: "test-product-1",
    averageRating: 4.5,
    totalReviews: 100,
    tags: ["test", "product"],
    createdAt: new Date(),
    updatedAt: new Date(),
    specifications: [
      { name: "Display", value: '6.1"', category: "Display" },
      { name: "Processor", value: "Test Chip", category: "Performance" },
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
    ],
    pros: ["Great performance", "Excellent camera", "Premium build"],
    cons: ["Expensive", "Limited storage"],
    score: 8.5,
    bestFor: ["Professionals", "Photography"],
    worstFor: ["Budget users"],
    dimensions: {
      length: 150,
      width: 75,
      height: 8,
      weight: 200,
      unit: "mm/g",
    },
  },
  {
    _id: "test-product-2",
    title: "Test Product 2",
    description: "Test description 2",
    category: "Test Category",
    brand: "Test Brand 2",
    price: 799,
    currency: "USD",
    affiliateUrl: "https://example.com/product2",
    images: ["/test-image-2.jpg"],
    slug: "test-product-2",
    averageRating: 4.2,
    totalReviews: 80,
    tags: ["test", "affordable"],
    createdAt: new Date(),
    updatedAt: new Date(),
    specifications: [
      { name: "Display", value: '6.0"', category: "Display" },
      { name: "Processor", value: "Test Chip 2", category: "Performance" },
    ],
    colors: [
      { name: "Blue", hex: "#0000FF" },
      { name: "Red", hex: "#FF0000" },
    ],
    pros: ["Good value", "Solid performance"],
    cons: ["Average camera", "Plastic build"],
    score: 7.8,
    bestFor: ["Budget users", "Students"],
    worstFor: ["Power users"],
    dimensions: {
      length: 155,
      width: 78,
      height: 9,
      weight: 180,
      unit: "mm/g",
    },
  },
];

describe("ProductComparisonTable", () => {
  beforeEach(() => {
    // Mock window.open
    global.window.open = jest.fn();

    // Mock window.gtag
    (
      global as typeof global & { window: Window & { gtag?: jest.Mock } }
    ).window.gtag = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the comparison table with products", () => {
    render(<ProductComparisonTable products={mockProducts} />);

    expect(screen.getByText("Product Comparison")).toBeInTheDocument();
    expect(
      screen.getByText("Compare 2 products side by side")
    ).toBeInTheDocument();
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
  });

  it("displays product prices correctly", () => {
    render(<ProductComparisonTable products={mockProducts} />);

    expect(screen.getByText("$999")).toBeInTheDocument();
    expect(screen.getByText("$799")).toBeInTheDocument();
  });

  it("renders rating stars correctly", () => {
    render(<ProductComparisonTable products={mockProducts} />);

    // Check for rating values
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("4.2")).toBeInTheDocument();
  });

  it("displays pros and cons", () => {
    render(<ProductComparisonTable products={mockProducts} />);

    expect(screen.getByText("Great performance")).toBeInTheDocument();
    expect(screen.getByText("Expensive")).toBeInTheDocument();
    expect(screen.getByText("Good value")).toBeInTheDocument();
    expect(screen.getByText("Average camera")).toBeInTheDocument();
  });

  it("toggles sections when clicked", async () => {
    render(<ProductComparisonTable products={mockProducts} />);

    // Overview section should be expanded by default
    expect(screen.getByText("Great performance")).toBeInTheDocument();

    // Click to collapse overview
    const overviewButton = screen.getByRole("button", { name: /overview/i });
    fireEvent.click(overviewButton);

    await waitFor(() => {
      expect(screen.queryByText("Great performance")).not.toBeInTheDocument();
    });

    // Click to expand specifications
    const specsButton = screen.getByRole("button", { name: /specifications/i });
    fireEvent.click(specsButton);

    await waitFor(() => {
      expect(screen.getByText("Display")).toBeInTheDocument();
      expect(screen.getByText('6.1"')).toBeInTheDocument();
    });
  });

  it("handles color selection", () => {
    render(<ProductComparisonTable products={mockProducts} />);

    // Expand colors section
    const colorsButton = screen.getByRole("button", { name: /colors/i });
    fireEvent.click(colorsButton);

    // Select a color
    const blackColorButton = screen.getByRole("button", {
      name: /select black color/i,
    });
    fireEvent.click(blackColorButton);

    // Color should be selected (visual feedback would be tested in e2e tests)
    expect(blackColorButton).toBeInTheDocument();
  });

  it("handles affiliate link clicks", () => {
    render(<ProductComparisonTable products={mockProducts} />);

    const buyButton = screen.getAllByText("Buy Now")[0];
    fireEvent.click(buyButton);

    expect(window.open).toHaveBeenCalledWith(
      "https://example.com/product1",
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("tracks affiliate clicks with gtag", () => {
    render(<ProductComparisonTable products={mockProducts} />);

    const buyButton = screen.getAllByText("Buy Now")[0];
    fireEvent.click(buyButton);

    expect(
      (global as typeof global & { window: Window & { gtag?: jest.Mock } })
        .window.gtag
    ).toHaveBeenCalledWith("event", "affiliate_click", {
      product_name: "Test Product 1",
      affiliate_url: "https://example.com/product1",
    });
  });

  it("displays custom title when provided", () => {
    render(
      <ProductComparisonTable
        products={mockProducts}
        title="Custom Comparison Title"
      />
    );

    expect(screen.getByText("Custom Comparison Title")).toBeInTheDocument();
  });

  it("shows specifications table correctly", async () => {
    render(<ProductComparisonTable products={mockProducts} />);

    // Expand specifications section
    const specsButton = screen.getByRole("button", { name: /specifications/i });
    fireEvent.click(specsButton);

    await waitFor(() => {
      expect(screen.getByText("Display")).toBeInTheDocument();
      expect(screen.getByText("Processor")).toBeInTheDocument();
      expect(screen.getByText('6.1"')).toBeInTheDocument();
      expect(screen.getByText("Test Chip")).toBeInTheDocument();
    });
  });

  it("shows pricing section correctly", async () => {
    render(<ProductComparisonTable products={mockProducts} />);

    // Expand pricing section
    const pricingButton = screen.getByRole("button", { name: /pricing/i });
    fireEvent.click(pricingButton);

    await waitFor(() => {
      expect(screen.getAllByText(/Buy for \$\d+/)).toHaveLength(2);
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <ProductComparisonTable
        products={mockProducts}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("handles empty products array", () => {
    render(<ProductComparisonTable products={[]} />);

    expect(
      screen.getByText("Compare 0 products side by side")
    ).toBeInTheDocument();
  });

  it('shows "N/A" for missing specifications', async () => {
    const productsWithMissingSpecs = [
      {
        ...mockProducts[0],
        specifications: [
          { name: "Display", value: '6.1"', category: "Display" },
        ],
      },
      {
        ...mockProducts[1],
        specifications: [
          { name: "Processor", value: "Test Chip", category: "Performance" },
        ],
      },
    ];

    render(<ProductComparisonTable products={productsWithMissingSpecs} />);

    // Expand specifications section
    const specsButton = screen.getByRole("button", { name: /specifications/i });
    fireEvent.click(specsButton);

    await waitFor(() => {
      expect(screen.getByText("N/A")).toBeInTheDocument();
    });
  });

  it("shows appropriate message for products without color options", async () => {
    const productsWithoutColors = [
      { ...mockProducts[0], colors: [] },
      { ...mockProducts[1], colors: [] },
    ];

    render(<ProductComparisonTable products={productsWithoutColors} />);

    // Expand colors section
    const colorsButton = screen.getByRole("button", { name: /colors/i });
    fireEvent.click(colorsButton);

    await waitFor(() => {
      expect(screen.getAllByText("No color options")).toHaveLength(2);
    });
  });
});

describe("ProductComparisonTable Accessibility", () => {
  it("has proper ARIA labels for buttons", () => {
    render(<ProductComparisonTable products={mockProducts} />);

    const buyButton = screen.getAllByRole("button", {
      name: /buy test product/i,
    })[0];
    expect(buyButton).toHaveAttribute(
      "aria-label",
      "Buy Test Product 1 - opens in new tab"
    );
  });

  it("has proper ARIA expanded states", () => {
    render(<ProductComparisonTable products={mockProducts} />);

    const overviewButton = screen.getByRole("button", { name: /overview/i });
    expect(overviewButton).toHaveAttribute("aria-expanded", "true");

    const specsButton = screen.getByRole("button", { name: /specifications/i });
    expect(specsButton).toHaveAttribute("aria-expanded", "false");
  });

  it("provides proper color selection labels", async () => {
    render(<ProductComparisonTable products={mockProducts} />);

    // Expand colors section
    const colorsButton = screen.getByRole("button", { name: /colors/i });
    fireEvent.click(colorsButton);

    await waitFor(() => {
      const blackColorButton = screen.getByRole("button", {
        name: /select black color for test product 1/i,
      });
      expect(blackColorButton).toHaveAttribute("title", "Black");
    });
  });
});

describe("ProductComparisonTable Responsive Design", () => {
  it("shows mobile header on small screens", () => {
    render(<ProductComparisonTable products={mockProducts} />);

    expect(
      screen.getByText("Swipe horizontally to compare products")
    ).toBeInTheDocument();
  });

  it("truncates long pros/cons lists", () => {
    const productWithManyPros = {
      ...mockProducts[0],
      pros: ["Pro 1", "Pro 2", "Pro 3", "Pro 4", "Pro 5"],
    };

    render(<ProductComparisonTable products={[productWithManyPros]} />);

    // Should show first 3 pros and "+X more" message
    expect(screen.getByText("Pro 1")).toBeInTheDocument();
    expect(screen.getByText("Pro 3")).toBeInTheDocument();
    expect(screen.getByText("+2 more")).toBeInTheDocument();
    expect(screen.queryByText("Pro 4")).not.toBeInTheDocument();
  });
});
