import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import { ScrollingText } from "@/components/ScrollingText";
import joinPrime from "@/assets/join-prime.jpg";
import { CategorySubcategoryProducts } from "@/components/CategorySubcategoryProducts";
import {
  getSubcategoriesByCategory,
  getProductsByCategoryAndSubcategory,
} from "@/lib/products";
import { categories, categories2 } from "../../../categories";
import { Spinner } from "@/components/Spinner";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

import SubcategoryGrid from "@/components/SubcategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";

const DynamicCategorySubcategoryProducts = dynamic(
  () =>
    import("@/components/CategorySubcategoryProducts").then(
      (mod) => mod.CategorySubcategoryProducts,
    ),
  {
    loading: () => <Spinner />,
    ssr: false,
  },
);

export default async function Home() {
  return (
    <main className="container mx-auto max-w-7xl p-2">
      <SubcategoryGrid categories={categories2} />
      <HeroSection />
      <ScrollingText text="5% instant discount on order above ₹2000 ⚪ 15% instant discount on order above ₹3000" />

      <Suspense fallback={<Spinner />}>
        <FeaturedProducts />
      </Suspense>
      <div className="my-4 space-y-12">
        {categories.map((category) => (
          <Suspense key={category.name} fallback={<Spinner />}>
            <CategoryWrapper category={category} />
          </Suspense>
        ))}
      </div>
    </main>
  );
}

async function CategoryWrapper({
  category,
}: {
  category: { name: string; subcategories: string[] };
}) {
  if (category.subcategories.length === 0) {
    const products = await getProductsByCategoryAndSubcategory(
      category.name,
      null,
      10,
    );
    return (
      <DynamicCategorySubcategoryProducts
        category={category.name}
        subcategory={null}
        products={products}
      />
    );
  }

  return (
    <div className="space-y-8">
      {category.subcategories.map((subcategory) => (
        <Suspense
          key={`${category.name}-${subcategory}`}
          fallback={<Spinner />}
        >
          <SubcategoryProductsWrapper
            category={category.name}
            subcategory={subcategory}
          />
        </Suspense>
      ))}
    </div>
  );
}

async function SubcategoryProductsWrapper({
  category,
  subcategory,
}: {
  category: string;
  subcategory: string;
}) {
  const products = await getProductsByCategoryAndSubcategory(
    category,
    subcategory,
    10,
  );
  return (
    <DynamicCategorySubcategoryProducts
      category={category}
      subcategory={subcategory}
      products={products}
    />
  );
}
