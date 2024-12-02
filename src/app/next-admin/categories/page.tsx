import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/categories";
import CategoryTable from "./CategoryTable";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link href="/next-admin/categories/add">
          <Button>Add New Category</Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategoryTable categories={categories} />
      </Suspense>
    </div>
  );
}
