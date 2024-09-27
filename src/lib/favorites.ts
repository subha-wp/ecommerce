import prisma from "./prisma";

export async function getUserFavorites(userId: string, productId: string) {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return !!favorite;
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return false;
  }
}
