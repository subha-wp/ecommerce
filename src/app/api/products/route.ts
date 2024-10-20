import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const where: any = {};
    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        price: parseFloat(body.price),
        minPrice: parseFloat(body.minPrice),
        sizes: body.sizes,
        image: body.image,
        category: body.category,
        subcategory: body.subcategory,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
