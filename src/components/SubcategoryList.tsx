"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";

type Subcategory = {
  image: string;
  id: string;
  name: string;
};

type SubcategoryListProps = {
  categoryId: string;
  subcategories: Subcategory[];
};

export function SubcategoryList({
  categoryId,
  subcategories,
}: SubcategoryListProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-4 p-1">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            href={`/products?categoryId=${categoryId}&subcategoryId=${subcategory.id}`}
            className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Button
              variant="outline"
              className="flex items-center space-x-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-secondary"
            >
              <div className="relative aspect-square h-8 w-8 overflow-hidden rounded-full">
                {subcategory.image ? (
                  <Image
                    src={subcategory.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <span className="text-xs text-muted-foreground">
                      No image
                    </span>
                  </div>
                )}
              </div>
              <span className="text-sm font-medium">{subcategory.name}</span>
            </Button>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
