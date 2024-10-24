import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import { ScrollingText } from "@/components/ScrollingText";
import { CategorySubcategoryProducts } from "@/components/CategorySubcategoryProducts";
import {
  getSubcategoriesByCategory,
  getProductsByCategoryAndSubcategory,
} from "@/lib/products";
import { categories } from "../../../categories";
import { Spinner } from "@/components/Spinner";
import dynamic from "next/dynamic";

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
      <HeroSection />
      <ScrollingText text="15% instant discount on prepaid orders ⚪ 25% instant discount For Prime Members ⚪ Sale Start from 27th OCT #RELEASEWALIDAY" />
      <div className="my-8 space-y-12">
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
