import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; subcategoryId: string } },
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const subcategory = await prisma.subcategory.update({
      where: { id: params.subcategoryId },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
      },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to update subcategory" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; subcategoryId: string } },
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.subcategory.delete({
      where: { id: params.subcategoryId },
    });

    return NextResponse.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json(
      { error: "Failed to delete subcategory" },
      { status: 500 },
    );
  }
}
