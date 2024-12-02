import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const categoryId = searchParams.get("categoryId");
  const subcategoryId = searchParams.get("subcategoryId");

  if (!productId || !categoryId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    const relevantProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: productId } },
          { categoryId: categoryId },
          subcategoryId ? { subcategoryId: subcategoryId } : {},
        ],
      },
      include: {
        images: {
          select: { url: true },
          take: 1,
        },
        category: {
          select: { name: true },
        },
        subcategory: {
          select: { name: true },
        },
      },
      take: 4,
    });

    return NextResponse.json(relevantProducts);
  } catch (error) {
    console.error("Error fetching relevant products:", error);
    return NextResponse.json(
      { error: "Failed to fetch relevant products" },
      { status: 500 },
    );
  }
}
