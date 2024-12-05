import { Spinner } from "@/components/Spinner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getCategories } from "@/lib/categories";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

export default async function CategoryPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-4">
      <h1 className="mb-4 text-2xl font-bold">Categories</h1>
      <Suspense fallback={<Spinner />}>
        <ScrollArea className="w-full">
          <div className="grid grid-cols-3 gap-4 pb-4">
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
        </ScrollArea>
      </Suspense>
    </div>
  );
}
