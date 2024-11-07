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
  "https://gist.github.com/user-attachments/assets/3aa8d974-af11-41fd-8abe-adcb6e2f8ceb",
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
