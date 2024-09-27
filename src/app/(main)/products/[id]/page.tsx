import { Suspense } from "react";
import Image from "next/image";
import ProductDetails from "./ProductDetails";
import { getProductById } from "@/lib/products";
import { getUserFavorites } from "@/lib/favorites";
import { validateRequest } from "@/auth";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  const { user } = await validateRequest();
  const userId = user?.id;
  const isFavorite = userId ? await getUserFavorites(userId, params.id) : false;

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-2 md:grid-cols-2">
        <div>
          <Image
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
        <div>
          <h1 className="mb-4 text-3xl font-bold">{product.title}</h1>
          <p className="mb-4 text-2xl font-bold">₹{product.price.toFixed(2)}</p>
          <Suspense fallback={<div>Loading product details...</div>}>
            <ProductDetails product={product} initialIsFavorite={isFavorite} />
          </Suspense>
          <div className="py-4">
            <p className="font-bold">Description</p>
            <p className="mb-4 text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
