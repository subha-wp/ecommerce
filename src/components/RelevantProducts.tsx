"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import SingleProductUi from "./SingleProductUi";

type Product = {
  id: string;
  title: string;
  price: number;
  images: { url: string }[];
};

export default function RelevantProducts({
  productId,
  categoryId,
  subcategoryId,
}: {
  productId: string;
  categoryId: string;
  subcategoryId?: string;
}) {
  const [relevantProducts, setRelevantProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRelevantProducts = async () => {
      const response = await fetch(
        `/api/products/relevant?productId=${productId}&categoryId=${categoryId}${subcategoryId ? `&subcategoryId=${subcategoryId}` : ""}`,
      );
      if (response.ok) {
        const data = await response.json();
        setRelevantProducts(data);
      }
    };

    fetchRelevantProducts();
  }, [productId, categoryId, subcategoryId]);

  if (relevantProducts.length === 0) return null;

  console.log("relevant product", relevantProducts);

  return (
    <div className="mt-12">
      <h2 className="mb-4 text-2xl font-bold">You might also like</h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {relevantProducts.map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="group"
          >
            <SingleProductUi product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}
