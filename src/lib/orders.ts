import prisma from "./prisma";

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                description: true,
              },
            },
          },
        },
      },
    });
    return orders.map((order) => ({
      ...order,
      total: order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}
