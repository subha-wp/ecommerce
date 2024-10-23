import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { categories } from "../../../../../categories";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  if (!productId || !category) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const categoryObj = categories.find((cat) => cat.name === category);
  if (!categoryObj) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const relevantProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: productId } },
          { category: category },
          subcategory && categoryObj.subcategories.includes(subcategory)
            ? { subcategory: subcategory }
            : {},
        ],
      },
      include: {
        images: {
          select: { url: true },
          take: 1,
        },
      },
      take: 5,
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
