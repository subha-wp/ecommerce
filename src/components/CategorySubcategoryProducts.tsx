import Link from "next/link";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import SingleProductUi from "./SingleProductUi";

interface Product {
  id: string;
  title: string;
  price: number;
  images: { url: string }[];
  // Add other necessary fields
}

interface CategorySubcategoryProductsProps {
  category: string;
  subcategory: string | null;
  products: Product[];
}

export function CategorySubcategoryProducts({
  category,
  subcategory,
  products,
}: CategorySubcategoryProductsProps) {
  if (products.length === 0) {
    return null;
  }

  const title = subcategory ? `${category} - ${subcategory}` : category;
  const seeMoreLink = subcategory
    ? `/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`
    : `/products?category=${encodeURIComponent(category)}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <Link href={seeMoreLink}>
          <Button variant="link">See More</Button>
        </Link>
      </div>
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {products.map((product: Product) => (
            <SingleProductUi key={product.id} product={product} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
