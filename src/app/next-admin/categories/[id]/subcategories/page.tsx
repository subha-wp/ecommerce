//@ts-nocheck
import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/categories";
import SubcategoriesManager from "./SubcategoriesManager";

export default async function ManageSubcategoriesPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategoryById(params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="w-full">
      <h1 className="mb-6 text-3xl font-bold">
        Manage Subcategories - {category.name}
      </h1>
      <SubcategoriesManager category={category} />
    </div>
  );
}
