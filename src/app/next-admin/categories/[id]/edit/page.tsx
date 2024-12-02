//@ts-nocheck
import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/categories";
import CategoryForm from "../../add/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="w-full">
      <h1 className="mb-6 text-3xl font-bold">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
}
