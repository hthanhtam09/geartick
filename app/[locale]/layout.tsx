import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import QueryProvider from "../../components/providers/QueryProvider";
import ThemeProvider from "../../components/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { locales } from "../../i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GearTick - Expert Product Reviews & Recommendations",
  description:
    "Get expert product reviews, detailed comparisons, and trusted recommendations to make informed purchase decisions. Find the best gear and products.",
  keywords: [
    "product reviews",
    "gear reviews",
    "product comparisons",
    "buying guide",
    "recommendations",
  ],
  authors: [{ name: "GearTick Team" }],
  creator: "GearTick",
  publisher: "GearTick",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "GearTick - Expert Product Reviews",
    description: "Get expert product reviews and trusted recommendations",
    siteName: "GearTick",
  },
  twitter: {
    card: "summary_large_image",
    title: "GearTick - Expert Product Reviews",
    description: "Get expert product reviews and trusted recommendations",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const LocaleLayout: React.FC<LocaleLayoutProps> = async ({
  children,
  params,
}) => {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        >
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <QueryProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    duration: 4000,
                    className: "dark:bg-gray-800 dark:text-white",
                  }}
                />
              </QueryProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default LocaleLayout;
