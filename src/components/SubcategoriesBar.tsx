"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Category = {
  name: string;
  subcategories: string[];
};

export default function SubcategoriesBar({
  categories,
}: {
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <div className="w-full border-b">
      <div className="container relative">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 py-4">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={
                  selectedCategory.name === category.name ? "default" : "ghost"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 transform space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const container = document.querySelector(".scroll-area-viewport");
              if (container) {
                container.scrollBy({ left: -200, behavior: "smooth" });
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const container = document.querySelector(".scroll-area-viewport");
              if (container) {
                container.scrollBy({ left: 200, behavior: "smooth" });
              }
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="container">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 py-4">
            {selectedCategory.subcategories.map((subcategory) => (
              <Link
                key={subcategory}
                href={`/products?subcategory=${encodeURIComponent(subcategory)}`}
              >
                <Button variant="ghost">{subcategory}</Button>
              </Link>
            ))}
            {selectedCategory.subcategories.length === 0 && (
              <span className="text-sm text-muted-foreground">
                No subcategories available
              </span>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
