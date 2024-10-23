// @ts-nocheck
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { getProductById } from "@/lib/products";
import { getUserFavorites } from "@/lib/favorites";
import { validateRequest } from "@/auth";
import ProductImageGallery from "./ProductImageGallery";
import RelevantProducts from "@/components/RelevantProducts";
import { categories } from "../../../../../categories";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const { user } = await validateRequest();
  const userId = user?.id;
  const isFavorite = userId ? await getUserFavorites(userId, params.id) : false;

  const categoryObj = categories.find((cat) => cat.name === product.category);
  if (!categoryObj) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Suspense fallback={<div>Loading images...</div>}>
          <ProductImageGallery images={product.images} />
        </Suspense>
        <div>
          <h1 className="mb-4 text-xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-400 line-through">
              ₹{product.price.toFixed(2)}
            </p>
            <p className="font-semibold">₹{product.minPrice.toFixed(2)}</p>
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
      <RelevantProducts
        productId={product.id}
        category={product.category}
        subcategory={
          categoryObj.subcategories.includes(product.subcategory || "")
            ? product.subcategory
            : undefined
        }
      />
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: product.title,
    description: product.description,
  };
}
