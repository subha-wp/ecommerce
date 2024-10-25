/* eslint-disable react/no-unescaped-entities */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";

import { Spinner } from "@/components/Spinner";
import SingleProductUi from "@/components/SingleProductUi";

export function SearchResults({ query }: { query: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return <Spinner />;
  }

  if (products.length === 0) {
    return <p>No products found for "{query}"</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-4">
      {products.map((product) => (
        <SingleProductUi key={product.id} product={product} />
      ))}
    </div>
  );
}
