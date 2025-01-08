import { NextResponse } from "next/server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get products with their order items to calculate revenue
    const products = await prisma.product.findMany({
      include: {
        images: {
          select: { url: true },
        },
        orderItems: {
          select: {
            quantity: true,
            price: true,
          },
        },
      },
    });

    // Calculate revenue for each product
    const productsWithRevenue = products.map((product) => ({
      id: product.id,
      title: product.title,
      images: product.images,
      revenue: product.orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    }));

    // Sort by revenue and get top 5
    const topProducts = productsWithRevenue
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    return NextResponse.json(
      { error: "Failed to fetch top products" },
      { status: 500 },
    );
  }
}
