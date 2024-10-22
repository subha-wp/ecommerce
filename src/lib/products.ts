import prisma from "./prisma";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProductsByCategory(
  category: string,
  limit: number = 10,
) {
  try {
    const products = await prisma.product.findMany({
      where: { category },
      take: limit,

      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getSubcategoriesByCategory(category: string) {
  try {
    const subcategories = await prisma.product.findMany({
      where: { category },
      select: { subcategory: true },

      distinct: ["subcategory"],
    });
    return subcategories
      .map((sc) => sc.subcategory)
      .filter(Boolean) as string[];
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
}

export async function getProductsByCategoryAndSubcategory(
  category: string,
  subcategory: string | null,
  limit: number = 10,
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category,
        ...(subcategory && { subcategory }),
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
