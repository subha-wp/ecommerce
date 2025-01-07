import { Suspense } from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getProductById } from "@/lib/products";
import { getUserFavorites } from "@/lib/favorites";
import { validateRequest } from "@/auth";
import { Spinner } from "@/components/Spinner";
import ProductReviews from "@/components/ProductReviews";
import type { Metadata } from "next";

const ProductDetails = dynamic(() => import("./ProductDetails"), {
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

  return (
    <div className="container mx-auto mb-10 max-w-7xl px-2 py-4 sm:py-8">
      <div className="grid gap-6 md:grid-cols-1">
        <Suspense fallback={<Spinner />}>
          <ProductDetails product={product} initialIsFavorite={isFavorite} />
        </Suspense>
      </div>
      <Suspense fallback={<Spinner />}>
        <RelevantProducts
          productId={product.id}
          categoryId={product.category.id}
          subcategoryId={product.subcategory?.id}
        />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <div className="mt-5">
          <ProductReviews productId={product.id} />
        </div>
      </Suspense>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
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
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.images[0].url,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.images[0].url],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-icon.png",
    },
    other: {
      "product:price:amount": product.minPrice.toString(),
      "product:price:currency": "INR",
      "product:availability": "in stock",
      "product:condition": "new",
      "product:brand": "Zaptray",
    },
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000",
    ),
    alternates: {
      canonical: `/product/${product.id}`,
    },
  };
}
