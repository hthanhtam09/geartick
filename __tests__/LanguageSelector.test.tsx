import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import LanguageSelector from "../components/LanguageSelector";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/en",
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  ...jest.requireActual("next-intl"),
  useLocale: () => "en",
}));

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <NextIntlClientProvider messages={{}} locale="en">
      {children}
    </NextIntlClientProvider>
  );
};

describe("LanguageSelector", () => {
  it("renders language selector button", () => {
    render(<LanguageSelector />, { wrapper: createWrapper() });

    const button = screen.getByRole("button", { name: /select language/i });
    expect(button).toBeInTheDocument();
  });

  it("shows current language name", () => {
    render(<LanguageSelector />, { wrapper: createWrapper() });

    const languageName = screen.getByText("English");
    expect(languageName).toBeInTheDocument();
  });

  it("opens dropdown when clicked", () => {
    render(<LanguageSelector />, { wrapper: createWrapper() });

    const button = screen.getByRole("button", { name: /select language/i });
    fireEvent.click(button);

    const dropdown = screen.getByRole("listbox");
    expect(dropdown).toBeInTheDocument();
  });

  it("shows both language options in dropdown", () => {
    render(<LanguageSelector />, { wrapper: createWrapper() });

    const button = screen.getByRole("button", { name: /select language/i });
    fireEvent.click(button);

    // There should be at least one 'English' and one 'Tiếng Việt' in the dropdown
    expect(screen.getAllByText("English").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Tiếng Việt")).toBeInTheDocument();
  });
});
