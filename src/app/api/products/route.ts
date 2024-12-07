import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 4);
    const search = searchParams.get("search");
    const skip = (page - 1) * pageSize;

    // Build where clause based on filters
    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (subcategoryId) {
      where.subcategoryId = subcategoryId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: pageSize,
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
      totalProducts: total,
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
      category,
      subcategory,
      isFeatured = false,
      isVisible = true,
    } = data;

    // Find or create category
    let categoryRecord = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: { name: category },
      });
    }

    // Find or create subcategory if provided
    let subcategoryRecord = null;
    if (subcategory) {
      subcategoryRecord = await prisma.subcategory.findFirst({
        where: {
          name: subcategory,
          categoryId: categoryRecord.id,
        },
      });

      if (!subcategoryRecord) {
        subcategoryRecord = await prisma.subcategory.create({
          data: {
            name: subcategory,
            categoryId: categoryRecord.id,
          },
        });
      }
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        minPrice: Number(minPrice),
        sizes,
        categoryId: categoryRecord.id,
        subcategoryId: subcategoryRecord?.id,
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
