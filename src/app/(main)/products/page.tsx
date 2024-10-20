/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";

import SingleProductUi from "@/components/SingleProductUi";
import { Spinner } from "@/components/Spinner";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(category && { category }),
        ...(subcategory && { subcategory }),
      });
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      if (data.products.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, category, subcategory, loading, hasMore]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    loadMoreProducts();
  }, [category, subcategory]);

  useEffect(() => {
    if (inView) {
      loadMoreProducts();
    }
  }, [inView, loadMoreProducts]);

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-0">
      <h1 className="my-4 text-xl font-bold">
        {category
          ? `${category} ${subcategory ? `- ${subcategory}` : ""}`
          : "All Products"}
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <SingleProductUi key={product.id} product={product} />
        ))}
      </div>
      {loading && (
        <div className="my-4 flex justify-center">
          <Spinner />
        </div>
      )}
      {!loading && hasMore && <div ref={ref} className="h-10" />}
      {!hasMore && <p className="my-4 text-center">No more products to load</p>}
    </div>
  );
}
