"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Coupon = {
  id?: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  expiryDate: string;
  isActive: boolean;
};

export default function CouponForm({ coupon }: { coupon?: Coupon }) {
  const [formData, setFormData] = useState<Coupon>(
    coupon || {
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minOrderValue: null,
      maxDiscount: null,
      expiryDate: new Date().toISOString().split("T")[0], // Set default to today's date
      isActive: true,
    },
  );
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "discountValue" ||
        name === "minOrderValue" ||
        name === "maxDiscount"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const handleDiscountTypeChange = (value: "percentage" | "fixed") => {
    setFormData((prev) => ({ ...prev, discountType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = coupon ? `/api/coupons/${coupon.id}` : "/api/coupons";
      const method = coupon ? "PUT" : "POST";

      // Convert the date to ISO-8601 format
      const isoExpiryDate = new Date(
        `${formData.expiryDate}T23:59:59Z`,
      ).toISOString();

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          discountValue: Number(formData.discountValue),
          minOrderValue:
            formData.minOrderValue === null
              ? null
              : Number(formData.minOrderValue),
          maxDiscount:
            formData.maxDiscount === null ? null : Number(formData.maxDiscount),
          expiryDate: isoExpiryDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save coupon");
      }

      toast({
        title: coupon ? "Coupon updated" : "Coupon created",
        description: coupon
          ? "The coupon has been successfully updated."
          : "The coupon has been successfully created.",
      });
      router.push("/next-admin/coupons");
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast({
        title: "Error",
        description: "There was an error saving the coupon. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <Label htmlFor="code">Coupon Code</Label>
        <Input
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="discountType">Discount Type</Label>
        <Select
          name="discountType"
          value={formData.discountType}
          onValueChange={handleDiscountTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select discount type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="discountValue">Discount Value</Label>
        <Input
          id="discountValue"
          name="discountValue"
          type="number"
          value={formData.discountValue}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="minOrderValue">Minimum Order Value (optional)</Label>
        <Input
          id="minOrderValue"
          name="minOrderValue"
          type="number"
          value={formData.minOrderValue || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="maxDiscount">Maximum Discount (optional)</Label>
        <Input
          id="maxDiscount"
          name="maxDiscount"
          type="number"
          value={formData.maxDiscount || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <Input
          id="expiryDate"
          name="expiryDate"
          type="date"
          value={formData.expiryDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isActive: checked }))
          }
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
      <Button type="submit">
        {coupon ? "Update Coupon" : "Create Coupon"}
      </Button>
    </form>
  );
}
