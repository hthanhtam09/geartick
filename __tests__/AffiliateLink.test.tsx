import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AffiliateLink from "@/components/AffiliateLink";

// Mock window.gtag
const mockGtag = jest.fn();
Object.defineProperty(window, "gtag", {
  value: mockGtag,
  writable: true,
});

// Mock window.open
const mockOpen = jest.fn();
Object.defineProperty(window, "open", {
  value: mockOpen,
  writable: true,
});

describe("AffiliateLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    url: "https://example.com/product",
    productName: "Test Product",
    children: "Buy Now",
  };

  it("renders correctly with default props", () => {
    render(<AffiliateLink {...defaultProps} />);

    const button = screen.getByRole("button", {
      name: /buy test product - opens in new tab/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Buy Now");
  });

  it("handles click and opens affiliate link", async () => {
    render(<AffiliateLink {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledWith(
        "https://example.com/product",
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  it("tracks analytics when clicked", async () => {
    render(<AffiliateLink {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockGtag).toHaveBeenCalledWith("event", "affiliate_click", {
        product_name: "Test Product",
        affiliate_url: "https://example.com/product",
        variant: "primary",
        timestamp: expect.any(String),
      });
    });
  });

  it("does not track analytics when showAnalytics is false", async () => {
    render(<AffiliateLink {...defaultProps} showAnalytics={false} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  it("applies correct variant classes", () => {
    const { rerender } = render(
      <AffiliateLink {...defaultProps} variant="primary" />
    );
    expect(screen.getByRole("button")).toHaveClass("bg-blue-600");

    rerender(<AffiliateLink {...defaultProps} variant="success" />);
    expect(screen.getByRole("button")).toHaveClass("bg-green-600");

    rerender(<AffiliateLink {...defaultProps} variant="warning" />);
    expect(screen.getByRole("button")).toHaveClass("bg-orange-600");

    rerender(<AffiliateLink {...defaultProps} variant="info" />);
    expect(screen.getByRole("button")).toHaveClass("bg-purple-600");
  });

  it("applies correct size classes", () => {
    const { rerender } = render(<AffiliateLink {...defaultProps} size="sm" />);
    expect(screen.getByRole("button")).toHaveClass("px-3 py-2 text-sm");

    rerender(<AffiliateLink {...defaultProps} size="md" />);
    expect(screen.getByRole("button")).toHaveClass("px-4 py-2");

    rerender(<AffiliateLink {...defaultProps} size="lg" />);
    expect(screen.getByRole("button")).toHaveClass("px-6 py-3 text-lg");
  });

  it("renders correct icons", () => {
    const { rerender } = render(
      <AffiliateLink {...defaultProps} icon="external" />
    );
    expect(screen.getByRole("button")).toHaveTextContent("Buy Now");

    rerender(<AffiliateLink {...defaultProps} icon="cart" />);
    expect(screen.getByRole("button")).toHaveTextContent("Buy Now");

    rerender(<AffiliateLink {...defaultProps} icon="dollar" />);
    expect(screen.getByRole("button")).toHaveTextContent("Buy Now");

    rerender(<AffiliateLink {...defaultProps} icon="award" />);
    expect(screen.getByRole("button")).toHaveTextContent("Buy Now");

    rerender(<AffiliateLink {...defaultProps} icon="none" />);
    expect(screen.getByRole("button")).toHaveTextContent("Buy Now");
  });

  it("applies custom className", () => {
    render(<AffiliateLink {...defaultProps} className="custom-class" />);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("shows loading state during click", async () => {
    render(<AffiliateLink {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Should show loading spinner and be disabled
    await waitFor(
      () => {
        expect(screen.getByRole("button")).toBeDisabled();
      },
      { timeout: 200 }
    );

    // Should eventually be enabled again
    await waitFor(
      () => {
        expect(screen.getByRole("button")).not.toBeDisabled();
      },
      { timeout: 500 }
    );
  });

  it("handles errors gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockOpen.mockImplementation(() => {
      throw new Error("Network error");
    });

    render(<AffiliateLink {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error opening affiliate link:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("works without gtag available", async () => {
    // Temporarily remove gtag
    const originalGtag = (window as Window & { gtag?: jest.Mock }).gtag;
    delete (window as Window & { gtag?: jest.Mock }).gtag;

    render(<AffiliateLink {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalled();
    });

    // Restore gtag
    (window as Window & { gtag?: jest.Mock }).gtag = originalGtag;
  });

  it("renders with different content", () => {
    render(
      <AffiliateLink {...defaultProps}>
        <span>Custom Content</span>
      </AffiliateLink>
    );

    expect(screen.getByRole("button")).toHaveTextContent("Custom Content");
  });

  it("has correct accessibility attributes", () => {
    render(<AffiliateLink {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute(
      "aria-label",
      "Buy Test Product - opens in new tab"
    );
  });
});
