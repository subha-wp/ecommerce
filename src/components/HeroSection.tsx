"use client";

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
  "https://gist.github.com/user-attachments/assets/15fd1eb6-86f9-4cef-8704-925f28538974",
  "https://gist.github.com/user-attachments/assets/c98ceb9f-5a44-4c79-91ae-986762f53fa9",
];

const HeroSection: React.FC = () => {
  return (
    <section className="">
      <Carousel className="">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index} className="">
              <Image
                src={src}
                alt={`Hero image ${index + 1}`}
                height={500}
                width={1312}
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform" />
        <CarouselNext className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform" />
      </Carousel>
    </section>
  );
};

export default HeroSection;
