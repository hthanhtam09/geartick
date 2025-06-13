"use client";

import { ExternalLink, ShoppingCart, DollarSign, Award } from "lucide-react";
import { useState } from "react";

interface AffiliateLinkProps {
  url: string;
  productName: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "info";
  size?: "sm" | "md" | "lg";
  icon?: "external" | "cart" | "dollar" | "award" | "none";
  children: React.ReactNode;
  className?: string;
  showAnalytics?: boolean;
}

const AffiliateLink: React.FC<AffiliateLinkProps> = ({
  url,
  productName,
  variant = "primary",
  size = "md",
  icon = "external",
  children,
  className = "",
  showAnalytics = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Track affiliate click for analytics
      if (showAnalytics && typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "affiliate_click", {
          product_name: productName,
          affiliate_url: url,
          variant: variant,
          timestamp: new Date().toISOString(),
        });
      }

      // Small delay to show loading state and improve UX
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Open affiliate link in new tab
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening affiliate link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 hover:bg-blue-700 text-white border-blue-600";
      case "secondary":
        return "bg-gray-600 hover:bg-gray-700 text-white border-gray-600";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white border-green-600";
      case "warning":
        return "bg-orange-600 hover:bg-orange-700 text-white border-orange-600";
      case "info":
        return "bg-purple-600 hover:bg-purple-700 text-white border-purple-600";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white border-blue-600";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2 text-sm";
      case "md":
        return "px-4 py-2";
      case "lg":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2";
    }
  };

  const getIcon = () => {
    if (icon === "none") return null;

    const iconClasses =
      size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";

    switch (icon) {
      case "external":
        return <ExternalLink className={iconClasses} />;
      case "cart":
        return <ShoppingCart className={iconClasses} />;
      case "dollar":
        return <DollarSign className={iconClasses} />;
      case "award":
        return <Award className={iconClasses} />;
      default:
        return <ExternalLink className={iconClasses} />;
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center space-x-2
        font-semibold rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      aria-label={`Buy ${productName} - opens in new tab`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <>
          {getIcon()}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default AffiliateLink;
