"use client";

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

const UPI_ID = "7001070713@okbizaxis";
const WHATSAPP_NUMBER = "9531699377"; // Replace with your actual WhatsApp number

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

export default function CheckoutForm({ user }: any) {
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMode: "COD",
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();
  const [isUPIDialogOpen, setIsUPIDialogOpen] = useState(false);
  const [upiLink, setUpiLink] = useState("");

  useEffect(() => {
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(sum);
  }, [cart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentModeChange = (value: string) => {
    setFormData({ ...formData, paymentMode: value });
  };

  const getFinalAmount = () => {
    return formData.paymentMode === "UPI" ? totalAmount * 0.9 : totalAmount;
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
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=YourStoreName&am=${amount}&cu=INR&tn=Order%20Payment`;
    setUpiLink(upiLink);

    if (isMobile()) {
      window.location.href = upiLink;
    } else {
      // setIsUPIDialogOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paymentMode === "UPI") {
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
          userId: user.id,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          ...formData,
          totalAmount: getFinalAmount(),
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Payment Mode</Label>
            <RadioGroup
              value={formData.paymentMode}
              onValueChange={handlePaymentModeChange}
              className="mt-2 flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="UPI" id="upi" />
                <Label htmlFor="upi">
                  UPI <span className="text-green-400">(10% off)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COD" id="cod" />
                <Label htmlFor="cod">Cash on Delivery</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Total Amount</Label>
            <p className="text-lg font-semibold">
              ₹{getFinalAmount().toFixed(2)}
              {formData.paymentMode === "UPI" && (
                <span className="ml-2 text-sm text-green-500">
                  (10% discount applied)
                </span>
              )}
            </p>
          </div>
        </div>

        <WhatsAppSupport />

        <Button type="submit" className="mt-4 w-full">
          {formData.paymentMode === "UPI" ? "Pay with UPI" : "Place Order"}
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
