import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (subcategoryId) {
      where.subcategoryId = subcategoryId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          images: {
            select: { url: true },
          },
          category: {
            select: { id: true, name: true },
          },
          subcategory: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });

    const subcategories = await prisma.subcategory.findMany({
      select: { id: true, name: true, categoryId: true },
    });

    return NextResponse.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      categories,
      subcategories,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      title,
      description,
      price,
      minPrice,
      sizes,
      images,
      categoryId,
      subcategoryId,
      isFeatured,
      isVisible,
    } = data;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        minPrice,
        sizes,
        categoryId,
        subcategoryId,
        isFeatured,
        isVisible,
        images: {
          create: images.map((url: string) => ({ url })),
        },
      },
      include: {
        images: true,
        category: true,
        subcategory: true,
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
