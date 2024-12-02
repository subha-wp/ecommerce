import { Suspense } from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getProductById } from "@/lib/products";
import { getUserFavorites } from "@/lib/favorites";
import { validateRequest } from "@/auth";
import { Spinner } from "@/components/Spinner";

const ProductDetails = dynamic(() => import("./ProductDetails"), {
  loading: () => <Spinner />,
});

const ProductImageGallery = dynamic(() => import("./ProductImageGallery"), {
  loading: () => <Spinner />,
});

const RelevantProducts = dynamic(
  () => import("@/components/RelevantProducts"),
  {
    loading: () => <Spinner />,
  },
);

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

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((product.price - product.minPrice) / product.price) * 100,
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Suspense fallback={<Spinner />}>
          <ProductImageGallery images={product.images} />
        </Suspense>
        <div>
          <h1 className="mb-4 text-xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-400 line-through">
              ₹{product.price.toFixed(2)}
            </p>
            <p className="font-semibold">₹{product.minPrice.toFixed(2)}</p>
            <p className="text-sm font-semibold text-green-500">
              ({discountPercentage}% off)
            </p>
          </div>

          <Suspense fallback={<Spinner />}>
            <ProductDetails product={product} initialIsFavorite={isFavorite} />
          </Suspense>
          <div className="py-4">
            <p className="font-bold">Description</p>
            <p className="mb-4 text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>
      <Suspense fallback={<Spinner />}>
        <RelevantProducts
          productId={product.id}
          categoryId={product.category.id}
          subcategoryId={product.subcategory?.id}
        />
      </Suspense>
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
