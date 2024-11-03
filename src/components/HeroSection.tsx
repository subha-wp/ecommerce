"use client";
import Autoplay from "embla-carousel-autoplay";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const images = [
  "https://gist.github.com/user-attachments/assets/8bde1def-65f9-40f1-bd28-f0edfd4b5917",
  "https://gist.github.com/user-attachments/assets/9264155d-4c1a-4123-a393-0f98ba89b710",
  "https://gist.github.com/user-attachments/assets/0995743a-7773-4f34-a1f5-d802c9699e2e",
  "https://gist.github.com/user-attachments/assets/99394a53-5051-4070-aab2-5967467274b9",
];

const HeroSection: React.FC = () => {
  return (
    <section className="">
      <Carousel
        className=""
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index} className="">
              <Image
                src={src}
                alt={`Hero image ${index + 1}`}
                height={400}
                width={1312}
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform text-white" />
        <CarouselNext className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform text-white" />
      </Carousel>
    </section>
  );
};

export default HeroSection;
