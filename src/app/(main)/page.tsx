import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/categories";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Spinner } from "@/components/Spinner";
import Autoplay from "embla-carousel-autoplay";

// Carousel images
const carouselImages = [
  {
    src: "https://gist.github.com/user-attachments/assets/3aa8d974-af11-41fd-8abe-adcb6e2f8ceb",
    alt: "Promotional Banner 1",
  },
  {
    src: "https://gist.github.com/user-attachments/assets/7bde22de-5da4-46ca-87d3-2a5a8f35daca",
    alt: "Promotional Banner 2",
  },
];

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="container mx-auto max-w-7xl space-y-8 p-4">
      {/* Hero Carousel */}
      <section className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Categories</h2>
        <Suspense fallback={<Spinner />}>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 pb-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="inline-block"
                >
                  <div className="group w-[200px] space-y-3">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-100">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">{category.name}</h3>
                      {category.subcategories.length > 0 && (
                        <p className="text-sm text-gray-500">
                          {category.subcategories.length} subcategories
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Suspense>
      </section>
    </main>
  );
}
