import { NextRequest, NextResponse } from "next/server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string; addressId: string } },
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      zipCode,
      isDefault,
    } = await req.json();

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: params.addressId, userId: user.id },
      data: {
        name,
        phoneNumber,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        zipCode,
        isDefault,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string; addressId: string } },
) {
  try {
    const { user } = await validateRequest();
    if (!user || user.id !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.address.delete({
      where: {
        id: params.addressId,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 },
    );
  }
}
