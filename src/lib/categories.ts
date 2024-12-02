import prisma from "./prisma";

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryById(id: string) {
  try {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function getSubcategoriesByCategoryId(categoryId: string) {
  try {
    return await prisma.subcategory.findMany({
      where: { categoryId },
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
}
