import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const subcategories = await prisma.subcategory.findMany({
      where: { categoryId: params.id },
    });
    return NextResponse.json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const subcategory = await prisma.subcategory.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        categoryId: params.id,
      },
    });
    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to create subcategory" },
      { status: 500 },
    );
  }
}
