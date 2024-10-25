import { notFound } from "next/navigation";
import CouponForm from "../../CouponForm";
import { getCouponById } from "@/lib/coupons";

export default async function EditCouponPage({
  params,
}: {
  params: { Id: string };
}) {
  const coupon = await getCouponById(params.Id);

  if (!coupon) {
    notFound();
  }

  // Format the expiry date to YYYY-MM-DD for the input field
  const formattedCoupon = {
    ...coupon,
    expiryDate: new Date(coupon.expiryDate).toISOString().split("T")[0],
  };

  return (
    <div className="w-full">
      <h1 className="mb-6 text-3xl font-bold">Edit Coupon</h1>
      <CouponForm coupon={formattedCoupon} />
    </div>
  );
}
