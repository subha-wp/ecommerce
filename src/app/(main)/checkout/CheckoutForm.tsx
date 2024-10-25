"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UPI_ID = "amzn0013009269@apl";
const WHATSAPP_NUMBER = "9531699377";

const WhatsAppSupport = () => (
  <div className="mt-4 text-center">
    <p className="text-sm text-gray-600">
      Having trouble with payment or any other issues?{" "}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-500 hover:underline"
      >
        Contact us on WhatsApp
      </a>
    </p>
  </div>
);

type Address = {
  id: string;
  name: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export default function CheckoutForm({
  user,
  addresses,
}: {
  user: any;
  addresses: Address[];
}) {
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD");
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();
  const [isUPIDialogOpen, setIsUPIDialogOpen] = useState(false);
  const [upiLink, setUpiLink] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const sum = cart.reduce(
      (acc, item) => acc + item.minPrice * item.quantity,
      0,
    );
    setTotalAmount(sum);
  }, [cart]);

  const handlePaymentModeChange = (value: string) => {
    setPaymentMode(value);
    if (value !== "UPI") {
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };

  const getFinalAmount = () => {
    return totalAmount - discountAmount;
  };

  const isMobile = () => {
    if (typeof window !== "undefined") {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    }
    return false;
  };

  const handleUPIPayment = () => {
    const amount = getFinalAmount().toFixed(2);
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=AddaBaji&am=${amount}&cu=INR&tn=Order%20Payment`;
    setUpiLink(upiLink);

    if (isMobile()) {
      window.location.href = upiLink;
    } else {
      setIsUPIDialogOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMode === "UPI") {
      handleUPIPayment();
    } else {
      await placeOrder();
    }
  };

  const placeOrder = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.minPrice,
          })),
          paymentMode,
          totalAmount: getFinalAmount(),
          appliedCoupon,
          discountAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: `Your order ID is ${order.id}. Thank you for your purchase.`,
      });
      router.push(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description:
          "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const applyCoupon = async () => {
    if (paymentMode !== "UPI") {
      toast({
        title: "Invalid Payment Mode",
        description: "Coupons can only be applied to UPI payments.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/coupons/validate?code=${couponCode}&totalAmount=${totalAmount}`,
      );
      if (!response.ok) {
        throw new Error("Failed to validate coupon");
      }

      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon(couponCode);
        setDiscountAmount(data.discountAmount);
        toast({
          title: "Coupon Applied",
          description: `Discount of ₹${data.discountAmount.toFixed(2)} applied to your order.`,
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: "The entered coupon code is invalid or expired.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      toast({
        title: "Error",
        description:
          "There was an error validating the coupon. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="address">Select Address</Label>
          <Select
            value={selectedAddressId}
            onValueChange={(value) => setSelectedAddressId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an address" />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((address) => (
                <SelectItem key={address.id} value={address.id}>
                  {address.name}, {address.addressLine1}, {address.city},{" "}
                  {address.state}, {address.zipCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Payment Mode</Label>
          <RadioGroup
            value={paymentMode}
            onValueChange={handlePaymentModeChange}
            className="mt-2 flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="UPI" id="upi" />
              <Label htmlFor="upi">UPI</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="COD" id="cod" />
              <Label htmlFor="cod">Cash on Delivery</Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMode === "UPI" && (
          <div className="space-y-2">
            <Label htmlFor="coupon">Coupon Code</Label>
            <div className="flex space-x-2">
              <Input
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
              />
              <Button type="button" onClick={applyCoupon}>
                Apply
              </Button>
            </div>
          </div>
        )}

        <div>
          <Label>Total Amount</Label>
          <p className="text-lg font-semibold">
            ₹{getFinalAmount().toFixed(2)}
            {discountAmount > 0 && (
              <span className="ml-2 text-sm text-green-500">
                (₹{discountAmount.toFixed(2)} discount applied)
              </span>
            )}
          </p>
        </div>

        <WhatsAppSupport />

        <Button type="submit" className="w-full">
          {paymentMode === "UPI" ? "Pay with UPI" : "Place Order"}
        </Button>
      </form>

      <Dialog open={isUPIDialogOpen} onOpenChange={setIsUPIDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>UPI Payment</DialogTitle>
            <DialogDescription>
              Please use the following UPI link to make your payment:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="break-all text-sm">{upiLink}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsUPIDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
