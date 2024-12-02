//@ts-nocheck
import { Suspense } from "react";
import ProductList from "./ProductList";
import { categories } from "../../../../categories";
import { SubcategoryList } from "@/components/SubcategoryList";
import { getSubcategoriesByCategoryId } from "@/lib/categories";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    categoryId?: string;
    subcategoryId?: string;
  };
}) {
  const categoryId = searchParams.categoryId;

  const subcategories = await getSubcategoriesByCategoryId(categoryId);

  return (
    <div className="container mx-auto max-w-7xl space-x-2 p-4">
      {subcategories && (
        <div className="mb-6">
          <SubcategoryList
            subcategories={subcategories}
            categoryId={categoryId}
          />
        </div>
      )}

      <Suspense fallback={<div>Loading products...</div>}>
        <ProductList />
      </Suspense>
    </div>
  );
}
