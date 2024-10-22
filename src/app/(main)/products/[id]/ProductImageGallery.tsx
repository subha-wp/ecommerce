"use client";

import { useState } from "react";
import Image from "next/image";

type ProductImage = {
  id: string;
  url: string;
};

export default function ProductImageGallery({
  images,
}: {
  images: ProductImage[];
}) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div>
      <div className="mb-4">
        <Image
          src={selectedImage.url}
          alt="Selected product image"
          width={500}
          height={500}
          className="h-[500px] w-full rounded object-contain"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className={`flex-shrink-0 ${
              selectedImage.id === image.id ? "border-2 border-blue-500" : ""
            }`}
          >
            <Image
              src={image.url}
              alt="Product thumbnail"
              width={100}
              height={100}
              className="h-24 w-24 rounded object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
