"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from "lucide-react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setDragOffset({ x: deltaX, y: deltaY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        switch (e.key) {
          case "Escape":
            setIsZoomed(false);
            resetZoom();
            break;
          case "ArrowLeft":
            e.preventDefault();
            prevImage();
            break;
          case "ArrowRight":
            e.preventDefault();
            nextImage();
            break;
          case "+":
          case "=":
            e.preventDefault();
            handleZoomIn();
            break;
          case "-":
            e.preventDefault();
            handleZoomOut();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed, zoomLevel]);

  if (!images || images.length === 0) {
    return (
      <div
        className={`aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-gray-400 dark:text-gray-500">
          <svg
            className="w-16 h-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Carousel */}
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden ${className}`}
      >
        <div className="flex gap-4 p-4">
          {/* Main Image - Left Side */}
          <div className="flex-1">
            <div className="relative aspect-square max-w-md mx-auto">
              <div
                ref={imageRef}
                className="w-full h-full cursor-zoom-in"
                onClick={() => setIsZoomed(true)}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              >
                <Image
                  src={images[currentIndex]}
                  alt={`${alt} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${
                      dragOffset.x / zoomLevel
                    }px, ${dragOffset.y / zoomLevel}px)`,
                    cursor: zoomLevel > 1 ? "grab" : "zoom-in",
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <button
                  onClick={handleZoomOut}
                  className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors duration-200 backdrop-blur-sm"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors duration-200 backdrop-blur-sm"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail Navigation - Right Side */}
          {images.length > 1 && (
            <div className="w-24 flex-shrink-0">
              <div className="flex flex-col gap-2 h-full overflow-y-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setZoomLevel(1);
                      setDragOffset({ x: 0, y: 0 });
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentIndex === index
                        ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${alt} thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsZoomed(false);
                resetZoom();
              }}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200 backdrop-blur-sm z-10"
              aria-label="Close zoom"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoomed Image */}
            <div
              className="w-full h-full flex items-center justify-center cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <Image
                src={images[currentIndex]}
                alt={`${alt} - Zoomed ${currentIndex + 1}`}
                fill
                className="object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel}) translate(${
                    dragOffset.x / zoomLevel
                  }px, ${dragOffset.y / zoomLevel}px)`,
                  cursor: zoomLevel > 1 ? "grab" : "default",
                }}
                sizes="100vw"
              />
            </div>

            {/* Modal Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Modal Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={handleZoomOut}
                className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200 backdrop-blur-sm"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-6 h-6" />
              </button>
              <button
                onClick={resetZoom}
                className="bg-black/50 hover:bg-black/70 text-white px-4 py-3 rounded-full transition-colors duration-200 backdrop-blur-sm text-sm font-medium"
              >
                Reset
              </button>
              <button
                onClick={handleZoomIn}
                className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200 backdrop-blur-sm"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-6 h-6" />
              </button>
            </div>

            {/* Image Info */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {currentIndex + 1} / {images.length} •{" "}
              {Math.round(zoomLevel * 100)}%
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
