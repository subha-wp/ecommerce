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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { load } from "@cashfreepayments/cashfree-js";
import { trackFacebookEvent } from "@/components/FacebookPixel";
import AddressForm from "@/app/(main)/user/account/AddressForm";

const DELIVERY_CHARGE = 15;

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
  addresses: initialAddresses,
}: {
  user: any;
  addresses: Address[];
}) {
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.minPrice * item.quantity,
    0,
  );
  const totalAmount = subtotal + DELIVERY_CHARGE;

  const handleAddAddress = (newAddress: Address) => {
    setAddresses([...addresses, newAddress]);
    setSelectedAddressId(newAddress.id);
    setIsAddressDialogOpen(false);
    toast({
      title: "Address Added",
      description: "Your new address has been added successfully.",
    });
  };

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
        throw new Error("Failed to initiate payment");
      }

      const { paymentLink, sessionId } = await response.json();

      const cashfree = await load({
        mode: "production",
      });

      cashfree
        .checkout({
          paymentSessionId: sessionId,
          redirectTarget: "_modal",
        })
        .then(() => {
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
        description: "Failed to create order. Please try again.",
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
        <CardContent className="space-y-4">
          {addresses.length > 0 ? (
            <Select
              value={selectedAddressId}
              onValueChange={setSelectedAddressId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose delivery address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((address) => (
                  <SelectItem key={address.id} value={address.id}>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{address.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {address.addressLine1}, {address.city}, {address.state}{" "}
                        - {address.zipCode}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">
              No addresses saved yet
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsAddressDialogOpen(true)}
          >
            + Add New Address
          </Button>
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

      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm
            userId={user.id}
            onAddAddress={handleAddAddress}
            onCancel={() => setIsAddressDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Place Order - ₹${totalAmount.toFixed(2)}`
        )}
      </Button>
    </form>
  );
}
