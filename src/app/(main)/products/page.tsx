//@ts-nocheck
import { Suspense } from "react";
import ProductList from "./ProductList";
import { categories } from "../../../../categories";
import { SubcategoryList } from "@/components/SubcategoryList";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; subcategory?: string };
}) {
  const category = searchParams.category;
  const subcategory = searchParams.subcategory;

  const categoryData = category
    ? categories.find((cat) => cat.name === category)
    : null;

  return (
    <div className="container mx-auto max-w-7xl px-4">
      <h1 className="my-4 text-xl font-bold">
        {category
          ? `${category} ${subcategory ? `- ${subcategory}` : ""}`
          : "All Products"}
      </h1>

      {categoryData && (
        <div className="mb-6">
          <SubcategoryList
            category={category}
            subcategories={categoryData.subcategories}
            selectedSubcategory={subcategory}
          />
        </div>
      )}

      <Suspense fallback={<div>Loading products...</div>}>
        <ProductList />
      </Suspense>
    </div>
  );
}
