import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCoupons } from "@/lib/coupons";
import CouponTable from "./CouponTable";

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Link href="/next-admin/coupons/add">
          <Button>Add New Coupon</Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading coupons...</div>}>
        <CouponTable coupons={coupons} />
      </Suspense>
    </div>
  );
}
