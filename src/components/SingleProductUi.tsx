"use client";

import Image from "next/image";
import React, { Suspense } from "react";
import AddToCartButton from "./AddToCartButton";
import { Button } from "./ui/button";
import Link from "next/link";

export default function SingleProductUi({ product }: any) {
  return (
    <>
      <div className="rounded-lg border p-2">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image}
            alt={product.title}
            width={300}
            height={300}
            className="mb-4 h-48 w-full rounded object-contain"
          />
        </Link>
        <h2 className="mb-2font-semibold line-clamp-2">{product.title}</h2>
        <div className="my-1 flex items-center justify-between rounded-md border p-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-400 line-through">
              ₹{product.price}
            </p>
            <p className="font-semibold">₹{product.minPrice}</p>
          </div>

          <Suspense fallback={<Button disabled>Loading...</Button>}>
            <AddToCartButton product={product} />
          </Suspense>
        </div>
      </div>
    </>
  );
}