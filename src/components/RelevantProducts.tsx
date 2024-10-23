"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "../../categories";
import SingleProductUi from "./SingleProductUi";

type Product = {
  id: string;
  title: string;
  price: number;
  images: { url: string }[];
};

export default function RelevantProducts({
  productId,
  category,
  subcategory,
}: {
  productId: string;
  category: string;
  subcategory?: string;
}) {
  const [relevantProducts, setRelevantProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRelevantProducts = async () => {
      const categoryObj = categories.find((cat) => cat.name === category);
      if (!categoryObj) {
        console.error("Invalid category");
        return;
      }

      const response = await fetch(
        `/api/products/relevant?productId=${productId}&category=${category}${subcategory ? `&subcategory=${subcategory}` : ""}`,
      );
      if (response.ok) {
        const data = await response.json();
        setRelevantProducts(data);
      }
    };

    fetchRelevantProducts();
  }, [productId, category, subcategory]);

  if (relevantProducts.length === 0) return null;

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
