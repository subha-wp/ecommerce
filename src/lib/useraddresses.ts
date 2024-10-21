import prisma from "./prisma";

export async function getUserAddresses(userId: string) {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });
    return addresses;
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return [];
  }
}
