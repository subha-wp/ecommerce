"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type Coupon = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  expiryDate: Date;
  isActive: boolean;
};

export default function CouponTable({
  coupons: initialCoupons,
}: {
  coupons: Coupon[];
}) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        const response = await fetch(`/api/coupons/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete coupon");
        }

        setCoupons(coupons.filter((coupon) => coupon.id !== id));
        toast({
          title: "Coupon deleted",
          description: "The coupon has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting coupon:", error);
        toast({
          title: "Error",
          description:
            "There was an error deleting the coupon. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Min Order Value</TableHead>
          <TableHead>Max Discount</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coupons.map((coupon) => (
          <TableRow key={coupon.id}>
            <TableCell>{coupon.code}</TableCell>
            <TableCell>
              {coupon.discountType === "percentage"
                ? `${coupon.discountValue}%`
                : `₹${coupon.discountValue.toFixed(2)}`}
            </TableCell>
            <TableCell>
              {coupon.minOrderValue
                ? `₹${coupon.minOrderValue.toFixed(2)}`
                : "-"}
            </TableCell>
            <TableCell>
              {coupon.maxDiscount ? `₹${coupon.maxDiscount.toFixed(2)}` : "-"}
            </TableCell>
            <TableCell>
              {new Date(coupon.expiryDate).toLocaleDateString()}
            </TableCell>
            <TableCell>{coupon.isActive ? "Active" : "Inactive"}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Link href={`/next-admin/coupons/${coupon.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(coupon.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
