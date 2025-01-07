import { NextRequest, NextResponse } from "next/server";
import { getProductRating } from "@/lib/products";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const rating = await getProductRating(params.id);
    return NextResponse.json(rating);
  } catch (error) {
    console.error("Error fetching product rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch product rating" },
      { status: 500 },
    );
  }
}
