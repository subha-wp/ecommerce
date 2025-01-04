import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";

  // Fetch all products
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    select: { id: true, updatedAt: true },
  });

  // Fetch all categories
  const categories = await prisma.category.findMany({
    select: { id: true, updatedAt: true },
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // Product URLs
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    // Category URLs
    ...categories.map((category) => ({
      url: `${baseUrl}/products?category=${category.id}`,
      lastModified: category.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    // Merchant feed URL
    {
      url: `${baseUrl}/api/merchant-feed`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
  ];
}
