"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProductImage = {
  id: string;
  url: string;
};

interface ProductImageGalleryProps {
  images: ProductImage[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
}

export default function ProductImageGallery({
  images,
  isFavorite,
  onToggleFavorite,
  onShare,
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  return (
    <div className="relative">
      <div className="mb-4 overflow-hidden">
        <div className="relative h-[300px] w-full sm:h-[500px]">
          <Image
            src={images[currentImageIndex].url}
            alt={`Product image ${currentImageIndex + 1}`}
            fill
            className="rounded object-contain"
          />
        </div>
      </div>
      <div className="absolute right-0 top-0 flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? "fill-current text-red-500" : ""}`}
          />
        </Button>
      </div>
      <div className="mt-2 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentImageIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
