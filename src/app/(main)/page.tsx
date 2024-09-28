import HeroSection from "@/components/HeroSection";
import dynamic from "next/dynamic";
const SingleProductUi = dynamic(() => import("@/components/SingleProductUi"));
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();
  return (
    <main className="container mx-auto max-w-7xl p-2">
      <HeroSection />
      <div className="my-4">
        <p className="text-center text-2xl font-bold">Products</p>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {products.map((product) => (
          <SingleProductUi key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
