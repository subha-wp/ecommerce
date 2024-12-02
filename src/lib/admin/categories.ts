import prisma from "../prisma";

export async function getAdminCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching admin categories:", error);
    return [];
  }
}
