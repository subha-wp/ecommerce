import HeroSection from "@/components/HeroSection";
import dynamic from "next/dynamic";
const SingleProductUi = dynamic(() => import("@/components/SingleProductUi"));
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();
  return (
    <main className="container mx-auto max-w-7xl p-2">
      <HeroSection />
      <ScrollingText text="15% instant discount on prepaid orders ⚪ 25% instant discount For Prime Members ⚪ Sale Start from 27th OCT #RELEASEWALIDAY" />
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

const ScrollingText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="my-4 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-scroll-right">
        <span className="font-medium uppercase">{text}</span>
      </div>
    </div>
  );
};
