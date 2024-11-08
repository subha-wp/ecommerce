import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import { ScrollingText } from "@/components/ScrollingText";

import { CategorySubcategoryProducts } from "@/components/CategorySubcategoryProducts";
import {
  getSubcategoriesByCategory,
  getProductsByCategoryAndSubcategory,
} from "@/lib/products";
import { categories, categories2 } from "../../../categories";
import { Spinner } from "@/components/Spinner";
import dynamic from "next/dynamic";

import SubcategoryGrid from "@/components/SubcategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Metadata } from "next";

// app/page.tsx
export const metadata: Metadata = {
  title: "ZapTray - Viral Gadgets, Lighting & Electronics",
  description:
    "Explore ZapTray for the latest viral gadgets, innovative lighting, and top electronics. Wholesale shopping made easy!",
  keywords: [
    "ZapTray",
    "viral gadgets",
    "electronics",
    "lighting",
    "tech gadgets",
    "wholesale electronics",
    "trending products",
  ],
  openGraph: {
    title: "ZapTray - Viral Gadgets, Lighting & Electronics",
    description:
      "Shop ZapTray for the hottest gadgets, trending lighting, and must-have electronics. Wholesale shopping made easy!",
    url: "https://zaptray.com",
    siteName: "ZapTray",
    images: [
      {
        url: "https://zaptray.com/android-chrome-512x512.png", // Replace with the actual URL for your OG image
        width: 1200,
        height: 630,
        alt: "ZapTray viral gadgets and electronics products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZapTray - Viral Gadgets, Lighting & Electronics",
    description:
      "Discover the latest in viral tech and gadgets at ZapTray. Wholesale shopping made easy!",
    images: ["https://zaptray.com/android-chrome-512x512.png"], // Replace with the actual URL for your Twitter image
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

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
