//@ts-nocheck
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type SubcategoryListProps = {
  category: string;
  subcategories: string[];
  selectedSubcategory?: string | null;
};

export function SubcategoryList({
  category,
  subcategories,
  selectedSubcategory,
}: SubcategoryListProps) {
  if (!subcategories.length) return null;

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4 py-4">
        <Link href={`/products?category=${encodeURIComponent(category)}`}>
          <Button
            variant={selectedSubcategory ? "outline" : "default"}
            className="whitespace-nowrap"
          >
            All
          </Button>
        </Link>
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory}
            href={`/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`}
          >
            <Button
              variant={
                selectedSubcategory === subcategory ? "default" : "outline"
              }
              className="whitespace-nowrap"
            >
              {subcategory}
            </Button>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
