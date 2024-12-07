/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductTable from "./ProductTable";
import { Spinner } from "@/components/Spinner";

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/products?${queryParams}`);
      const data = await response.json();

      setProducts(data.products);
      setTotalProducts(data.totalProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/next-admin/products?${params.toString()}`);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", newPageSize);
    params.set("page", "1");
    router.push(`/next-admin/products?${params.toString()}`);
  };

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/next-admin/products?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your product catalog
          </p>
        </div>
        <Link href="/next-admin/add-product">
          <Button>Add New Product</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <ProductTable
          products={products}
          currentPage={page}
          pageSize={pageSize}
          totalProducts={totalProducts}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearch}
        />
      )}
    </div>
  );
}
