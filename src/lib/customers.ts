import prisma from "./prisma";

export async function getCustomers() {
  try {
    const customers = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}
