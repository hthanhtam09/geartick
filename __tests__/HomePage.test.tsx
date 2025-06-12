import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "../app/page";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock fetch
global.fetch = jest.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders hero section with correct heading", () => {
    render(<HomePage />, { wrapper: createWrapper() });

    expect(screen.getByText("Expert Product Reviews")).toBeInTheDocument();
    expect(screen.getByText("You Can Trust")).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<HomePage />, { wrapper: createWrapper() });

    expect(screen.getByText("Browse Reviews")).toBeInTheDocument();
    expect(screen.getByText("Search Products")).toBeInTheDocument();
  });

  it("renders stats section", () => {
    render(<HomePage />, { wrapper: createWrapper() });

    expect(screen.getByText("Products Reviewed")).toBeInTheDocument();
    expect(screen.getByText("Happy Customers")).toBeInTheDocument();
    expect(screen.getByText("Trusted Reviews")).toBeInTheDocument();
    expect(screen.getByText("Average Rating")).toBeInTheDocument();
  });

  it("renders featured reviews section", () => {
    render(<HomePage />, { wrapper: createWrapper() });

    expect(screen.getByText("Featured Reviews")).toBeInTheDocument();
    expect(
      screen.getByText("Our latest and most comprehensive product reviews")
    ).toBeInTheDocument();
  });

  it("renders categories section", () => {
    render(<HomePage />, { wrapper: createWrapper() });

    expect(screen.getByText("Browse Categories")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Home & Kitchen")).toBeInTheDocument();
  });
});
