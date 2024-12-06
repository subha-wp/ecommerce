"use client";

import Image from "next/image";
import React, { Suspense } from "react";
import AddToCartButton from "./AddToCartButton";
import { Button } from "./ui/button";
import Link from "next/link";
import noImage from "@/assets/Image_not_available.png";
import { Badge } from "./ui/badge";

export default function SingleProductUi({ product }: any) {
  const productThumnail = product.images[0]?.url;

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((product.price - product.minPrice) / product.price) * 100,
  );

  return (
    <>
      <div className="min-w-[170px] max-w-[250px] rounded-lg border border-primary p-1">
        <div className="relative">
          <Link href={`/products/${product.id}`}>
            <Image
              src={productThumnail ? productThumnail : noImage}
              alt={product.title}
              width={300}
              height={300}
              className="mb-4 h-48 w-full rounded object-contain"
            />
          </Link>
          {discountPercentage > 0 && (
            <Badge
              variant="default"
              className="absolute right-0 top-0 rounded-bl rounded-tr text-sm"
            >
              {discountPercentage}% OFF
              <span className="pl-1 text-[10px]"> from local Dukaan</span>
            </Badge>
          )}
        </div>
        <h2 className="mb-2 line-clamp-2 text-xs font-semibold">
          {product.title}
        </h2>
        <div className="my-1 flex items-center justify-between rounded-md border border-primary p-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-muted-foreground line-through">
              ₹{product.price}
            </p>
            <p className="font-semibold text-primary">₹{product.minPrice}</p>
          </div>

          <Suspense fallback={<Button disabled>Loading...</Button>}>
            <AddToCartButton product={product} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
