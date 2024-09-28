import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/products";
import ProductTable from "./ProductTable";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
