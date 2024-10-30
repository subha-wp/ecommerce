// @ts-nocheck
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = params.id;
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
    } = data;

    // Fetch the current product to get existing image IDs
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Prepare image operations
    const existingImageIds = new Set(
      currentProduct.images.map((img) => img.id),
    );
    const imagesToCreate = images
      .filter((img) => !existingImageIds.has(img.id))
      .map((img) => ({ url: img.url }));
    const imagesToUpdate = images.filter((img) => existingImageIds.has(img.id));
    const imageIdsToKeep = new Set(imagesToUpdate.map((img) => img.id));

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price: parseFloat(price),
        minPrice: parseFloat(minPrice),
        sizes,
        category,
        subcategory,
        images: {
          deleteMany: {
            id: { notIn: Array.from(imageIdsToKeep) },
          },
          create: imagesToCreate,
          update: imagesToUpdate.map((img) => ({
            where: { id: img.id },
            data: { url: img.url },
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : undefined,
        isVisible: data.isVisible !== undefined ? data.isVisible : undefined,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
