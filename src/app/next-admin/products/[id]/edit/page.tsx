import { getProductById } from "@/lib/products";
import ProductEditForm from "./ProductEditForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Product</h1>
      <ProductEditForm product={product} />
    </div>
  );
}
