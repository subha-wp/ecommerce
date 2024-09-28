import { getProducts } from "@/lib/products";
import SingleProductUi from "@/components/SingleProductUi";

export default async function ProductListingPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto max-w-7xl p-2">
      <h1 className="mb-2 text-3xl font-bold">Our Products</h1>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {products.map((product) => (
          <SingleProductUi key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
