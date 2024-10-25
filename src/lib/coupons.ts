import prisma from "./prisma";

export async function getCoupons() {
  try {
    return await prisma.coupon.findMany();
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw new Error("Failed to fetch coupons");
  }
}

export async function getCouponById(id: string) {
  try {
    return await prisma.coupon.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    throw new Error("Failed to fetch coupon");
  }
}

export async function createCoupon(data: any) {
  try {
    return await prisma.coupon.create({ data });
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw new Error("Failed to create coupon");
  }
}

export async function updateCoupon(id: string, data: any) {
  try {
    return await prisma.coupon.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw new Error("Failed to update coupon");
  }
}

export async function deleteCoupon(id: string) {
  try {
    await prisma.coupon.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw new Error("Failed to delete coupon");
  }
}
