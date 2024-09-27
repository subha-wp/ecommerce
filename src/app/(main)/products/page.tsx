import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddToCartButton from "./AddToCartButton";
import { getProducts } from "@/lib/products";

export default async function ProductListingPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Our Products</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="rounded-lg border p-4">
            <Image
              src={product.image}
              alt={product.title}
              width={300}
              height={300}
              className="mb-4 h-48 w-full rounded object-cover"
            />
            <h2 className="mb-2 text-xl font-semibold">{product.title}</h2>
            <p className="mb-2 text-gray-600">
              {product.description.substring(0, 100)}...
            </p>
            <p className="mb-4 text-gray-600">₹{product.price.toFixed(2)}</p>
            <div className="flex justify-between">
              <Link href={`/products/${product.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
              <Suspense fallback={<Button disabled>Loading...</Button>}>
                <AddToCartButton product={product} />
              </Suspense>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
