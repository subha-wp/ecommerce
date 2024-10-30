import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getFeaturedProducts } from "@/lib/products";
import SingleProductUi from "./SingleProductUi";

type Product = {
  id: string;
  title: string;
  price: number;
  minPrice: number;
  images: { url: string }[];
};

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts(10); // Increased to 10 for better scrolling demonstration

  return (
    <section className="mt-4">
      <div className="container mx-auto">
        <h2 className="mb-2 text-xl font-bold">Featured </h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 pb-4">
            {products.map((product) => (
              <SingleProductUi key={product.id} product={product} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
