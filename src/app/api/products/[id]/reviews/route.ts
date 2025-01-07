import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

// POST /api/products/[id]/reviews
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has purchased the product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: params.id,
        order: {
          userId: user.id,
          status: "DELIVERED", // Only allow reviews for delivered orders
        },
      },
    });

    if (!hasPurchased) {
      return NextResponse.json(
        { error: "You can only review products you have purchased" },
        { status: 403 },
      );
    }

    const { rating, comment } = await req.json();

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Create or update review
    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: params.id,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId: user.id,
        productId: params.id,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating/updating review:", error);
    return NextResponse.json(
      { error: "Failed to create/update review" },
      { status: 500 },
    );
  }
}

// GET /api/products/[id]/reviews
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: params.id,
      },
      include: {
        user: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
