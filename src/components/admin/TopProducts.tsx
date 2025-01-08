"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Product = {
  id: string;
  title: string;
  revenue: number;
  images: { url: string }[];
};

export function TopProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch("/api/admin/top-products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (products.length === 0) {
    return <div>No products found</div>;
  }

  return (
    <div className="space-y-8">
      {products.map((product) => (
        <div key={product.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={product.images[0]?.url} alt={product.title} />
            <AvatarFallback>{product.title[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{product.title}</p>
            <p className="text-sm text-muted-foreground">Top Seller</p>
          </div>
          <div className="ml-auto font-medium">
            ₹{product.revenue.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
