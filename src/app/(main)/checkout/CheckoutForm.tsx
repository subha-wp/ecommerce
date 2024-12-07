// @ts-nocheck
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { load } from "@cashfreepayments/cashfree-js";
import { trackFacebookEvent } from "@/components/FacebookPixel";

const DELIVERY_CHARGE = 15; // Fixed delivery charge

const fixedButtonStyle = `
  @media (max-width: 768px) {
    .fixed-bottom-button {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background-color: white;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }
  }
`;

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
  const [subtotal, setSubtotal] = useState(() =>
    cart.reduce((acc, item) => acc + item.minPrice * item.quantity, 0),
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const totalAmount = subtotal + DELIVERY_CHARGE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddressId) {
      toast({
        title: "Error",
        description: "Please select a delivery address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMode === "ONLINE") {
        await initiateOnlinePayment();
      } else {
        await placeOrder();
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description:
          "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const initiateOnlinePayment = async () => {
    try {
      const response = await fetch("/api/initiate-payment", {
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
          totalAmount,
          deliveryCharge: DELIVERY_CHARGE,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to initiate payment");
      }

      const { paymentLink, sessionId } = await response.json();

      if (!paymentLink) {
        throw new Error("No payment link received");
      }
      const cashfree = await load({
        mode: "production",
      });
      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };
      cashfree.checkout(checkoutOptions).then((res) => {
        console.log("payment initialized");
        trackFacebookEvent("Purchase", {
          content_type: "product",
          contents: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          currency: "INR",
          value: totalAmount,
        });
      });
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
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
          totalAmount,
          deliveryCharge: DELIVERY_CHARGE,
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

      trackFacebookEvent("Purchase", {
        content_type: "product",
        contents: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        currency: "INR",
        value: totalAmount,
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
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-6 pb-24 md:pb-0"
    >
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Delivery Address</CardTitle>
          <CardDescription>
            Select where you want your order delivered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedAddressId}
            onValueChange={(value) => setSelectedAddressId(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an address" />
            </SelectTrigger>
            <SelectContent className="w-full min-w-[250px]">
              {addresses.map((address) => (
                <SelectItem key={address.id} value={address.id}>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      {address.addressLine1},{address.zipCode}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Payment Method</CardTitle>
          <CardDescription>Choose how you want to pay</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMode}
            onValueChange={setPaymentMode}
            className="flex flex-col space-y-4"
          >
            <div className="flex flex-1 cursor-pointer items-center space-x-2 rounded-lg border p-4 hover:bg-accent">
              <RadioGroupItem value="COD" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <div className="font-semibold">Cash on Delivery</div>
                <div className="text-sm text-muted-foreground">
                  Pay when you receive your order
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>₹{DELIVERY_CHARGE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <style>{fixedButtonStyle}</style>
      <div className="mt-2">
        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : paymentMode === "ONLINE" ? (
            "Proceed to Pay"
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
    </form>
  );
}
