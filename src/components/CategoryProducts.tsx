import Link from "next/link";

import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import SingleProductUi from "./SingleProductUi";

interface CategoryProductsProps {
  category: string;
  products: any;
}

export function CategoryProducts({
  category,
  products,
}: CategoryProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{category}</h2>
        <Link href={`/products?category=${encodeURIComponent(category)}`}>
          <Button variant="link">See More</Button>
        </Link>
      </div>
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {products.map((product: any) => (
            <SingleProductUi key={product.id} product={product} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
