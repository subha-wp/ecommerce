//@ts-nocheck
import prisma from "./prisma";

// Public products API - Used for main product listing
export async function getPublicProducts(
  page: number = 1,
  pageSize: number = 10,
  categoryId?: string,
  subcategoryId?: string,
) {
  try {
    const where = {
      isVisible: true,
      ...(categoryId && { categoryId }),
      ...(subcategoryId && { subcategoryId }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          images: true,
          category: {
            select: { name: true, id: true },
          },
          subcategory: {
            select: { name: true, id: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      totalProducts: total,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Error fetching public products:", error);
    return {
      products: [],
      totalProducts: 0,
      currentPage: page,
      totalPages: 0,
    };
  }
}

// Admin products API - Used for admin dashboard
export async function getAdminProducts(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
) {
  try {
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          images: {
            select: { url: true },
          },
          category: {
            select: { name: true, id: true },
          },
          subcategory: {
            select: { name: true, id: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      totalProducts: total,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return {
      products: [],
      totalProducts: 0,
      currentPage: page,
      totalPages: 0,
    };
  }
}

// Keep other existing functions
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: { select: { name: true, id: true } },
        subcategory: { select: { name: true, id: true } },
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getFeaturedProducts(limit?: number) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isVisible: true,
      },
      include: {
        images: true,
        category: { select: { name: true } },
        subcategory: { select: { name: true } },
      },
      take: limit,
    });

    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error("Failed to fetch featured products");
  }
}
