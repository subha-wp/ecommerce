import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/categories";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Spinner } from "@/components/Spinner";
import { ProductGrid } from "@/components/ProductGrid";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <main className="container mx-auto mt-4 max-w-7xl space-y-8 p-2">
      {/* Hero Carousel */}
      <section className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[30/9] w-full overflow-hidden rounded-lg">
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
      <section className="rounded-lg bg-gradient-to-br from-green-400 to-green-600 p-2 shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-white">Categories</h2>
        <Suspense fallback={<Spinner />}>
          <div className="grid grid-cols-3 gap-2 pb-4 md:grid-cols-6 md:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}&categoryId=${encodeURIComponent(category.id)}`}
                className="flex flex-col items-center space-y-2"
              >
                <div className="group relative aspect-square h-36 w-36 overflow-hidden transition-all duration-300 hover:shadow-md">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-100">
                      <span className="text-sm text-gray-400">No image</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Suspense>
      </section>

      {/* All Products Section */}
      <section className="">
        <h2 className="mb-2 text-lg font-bold">All Products</h2>
        <Suspense fallback={<Spinner />}>
          <ProductGrid />
        </Suspense>
      </section>
    </main>
  );
}
