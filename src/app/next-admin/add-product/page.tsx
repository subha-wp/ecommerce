//@ts-nocheck
import { Suspense } from "react";
import { getAdminCategories } from "@/lib/admin/categories";
import { Spinner } from "@/components/Spinner";
import AddProductForm from "./AddProductForm";

export default async function AddProductPage() {
  const categories = await getAdminCategories();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="mt-2 text-sm text-gray-500">
          Create a new product in your catalog
        </p>
      </div>

      <Suspense fallback={<Spinner />}>
        <AddProductForm categories={categories} />
      </Suspense>
    </div>
  );
}
