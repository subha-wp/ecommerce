import { Suspense } from "react";
import ProductDetails from "./ProductDetails";
import { getProductById } from "@/lib/products";
import { getUserFavorites } from "@/lib/favorites";
import { validateRequest } from "@/auth";
import ProductImageGallery from "./ProductImageGallery";

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
      <div className="grid gap-8 md:grid-cols-2">
        <Suspense fallback={<div>Loading images...</div>}>
          <ProductImageGallery images={product.images} />
        </Suspense>
        <div>
          <h1 className="mb-4 text-3xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-400 line-through">
              ₹{product.price}
            </p>
            <p className="font-semibold">₹{product.minPrice}</p>
          </div>
          <p className="py-2 text-sm text-green-500">
            *Next Day Delivery all over West Bengal
          </p>
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
