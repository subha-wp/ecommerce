/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SingleProductUi from "./SingleProductUi";
import { Spinner } from "./Spinner";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  minPrice: number;
  images: { url: string }[];
};

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const loadMoreProducts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/products?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

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
  };

  useEffect(() => {
    loadMoreProducts();
  }, []);

  useEffect(() => {
    if (inView) {
      loadMoreProducts();
    }
  }, [inView]);

  if (products.length === 0 && !loading) {
    return <p>No products found.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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

      {!hasMore && products.length > 0 && (
        <p className="my-4 text-center text-gray-500">
          No more products to load
        </p>
      )}
    </div>
  );
}
