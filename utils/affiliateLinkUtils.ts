import { Product } from "@/types";

/**
 * Attaches affiliate links to product names in text content
 * @param content - The text content to process
 * @param product - The product object containing title and affiliate URL
 * @returns Processed content with affiliate links
 */
export const attachAffiliateLinks = (
  content: string,
  product: Product
): string => {
  if (!product || !product.affiliateUrl || !product.title) {
    return content;
  }

  // Create a regex pattern that matches the product title (case insensitive)
  const productNameRegex = new RegExp(
    `\\b${escapeRegExp(product.title)}\\b`,
    "gi"
  );

  // Replace product name with affiliate link
  return content.replace(productNameRegex, (match) => {
    return `<a href="${product.affiliateUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium transition-colors duration-200" onclick="if(typeof window !== 'undefined' && window.gtag) { window.gtag('event', 'affiliate_click', { product_name: '${product.title}', affiliate_url: '${product.affiliateUrl}' }); }">${match}</a>`;
  });
};

/**
 * Escapes special regex characters in a string
 * @param string - The string to escape
 * @returns Escaped string safe for use in regex
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Processes HTML content and attaches affiliate links to product names
 * @param htmlContent - The HTML content to process
 * @param product - The product object containing title and affiliate URL
 * @returns Processed HTML content with affiliate links
 */
export const attachAffiliateLinksToHTML = (
  htmlContent: string,
  product: Product
): string => {
  if (!product || !product.affiliateUrl || !product.title) {
    return htmlContent;
  }

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;

  // Function to process text nodes
  const processTextNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      const productNameRegex = new RegExp(
        `\\b${escapeRegExp(product.title)}\\b`,
        "gi"
      );

      if (productNameRegex.test(text)) {
        const span = document.createElement("span");
        span.innerHTML = text.replace(productNameRegex, (match) => {
          return `<a href="${product.affiliateUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium transition-colors duration-200" onclick="if(typeof window !== 'undefined' && window.gtag) { window.gtag('event', 'affiliate_click', { product_name: '${product.title}', affiliate_url: '${product.affiliateUrl}' }); }">${match}</a>`;
        });

        // Replace the text node with the span
        if (node.parentNode) {
          node.parentNode.replaceChild(span, node);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Skip if the element is already a link or has specific classes
      const element = node as Element;
      if (
        element.tagName === "A" ||
        element.classList.contains("affiliate-link")
      ) {
        return;
      }

      // Process child nodes
      const childNodes = Array.from(node.childNodes);
      childNodes.forEach(processTextNode);
    }
  };

  // Process all nodes
  const allNodes = Array.from(tempDiv.childNodes);
  allNodes.forEach(processTextNode);

  return tempDiv.innerHTML;
};

/**
 * Creates a clickable product title with affiliate link
 * @param product - The product object
 * @param className - Additional CSS classes
 * @returns HTML string with affiliate link
 */
export const createProductTitleLink = (
  product: Product,
  className: string = ""
): string => {
  if (!product || !product.affiliateUrl) {
    return product?.title || "";
  }

  return `<a href="${product.affiliateUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium transition-colors duration-200 ${className}" onclick="if(typeof window !== 'undefined' && window.gtag) { window.gtag('event', 'affiliate_click', { product_name: '${product.title}', affiliate_url: '${product.affiliateUrl}' }); }">${product.title}</a>`;
};

/**
 * Checks if a string contains a product name
 * @param text - The text to check
 * @param productName - The product name to search for
 * @returns True if the product name is found
 */
export const containsProductName = (
  text: string,
  productName: string
): boolean => {
  if (!text || !productName) return false;
  const regex = new RegExp(`\\b${escapeRegExp(productName)}\\b`, "i");
  return regex.test(text);
};
