import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Coupon code is required" },
      { status: 400 },
    );
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive || coupon.expiryDate < new Date()) {
      return NextResponse.json({ valid: false });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = coupon.discountValue / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }

    return NextResponse.json({
      valid: true,
      discountAmount,
      minOrderValue: coupon.minOrderValue,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 },
    );
  }
}
