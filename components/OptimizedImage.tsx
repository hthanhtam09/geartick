"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackSrc?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  sizes,
  priority = false,
  fallbackSrc = "/placeholder-product.jpg",
  placeholder = "empty",
  blurDataURL,
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${className}`}
        style={
          fill
            ? undefined
            : {
                width: width ? `${width}px` : "100%",
                height: height ? `${height}px` : "auto",
              }
        }
      >
        <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  const imageProps = {
    src: imageSrc,
    alt,
    className: `transition-opacity duration-300 ${
      isLoading ? "opacity-0" : "opacity-100"
    } ${className}`,
    onError: handleError,
    onLoad: handleLoad,
    priority,
    sizes,
    placeholder,
    blurDataURL,
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return <Image {...imageProps} width={width || 300} height={height || 200} />;
};

export default OptimizedImage;
