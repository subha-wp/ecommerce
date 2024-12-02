//@ts-nocheck
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAdminProducts } from "@/lib/products";
import ProductTable from "./ProductTable";
import { Spinner } from "@/components/Spinner";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;

  const { products, totalProducts } = await getAdminProducts(page, pageSize);

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

      <Suspense fallback={<Spinner />}>
        <ProductTable
          products={products}
          currentPage={page}
          pageSize={pageSize}
          totalProducts={totalProducts}
        />
      </Suspense>
    </div>
  );
}
