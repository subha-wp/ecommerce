"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function PaymentCallback() {
  const [status, setStatus] = useState("Processing...");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get("order_id");
      if (!orderId) {
        setStatus("Invalid order ID");
        return;
      }

      try {
        const response = await fetch(`/api/verify-payment?order_id=${orderId}`);
        const data = await response.json();

        if (data.success) {
          setStatus("Payment successful!");
          toast({
            title: "Payment Successful",
            description: "Your order has been placed successfully.",
          });
          router.push(`/order-confirmation/${orderId}`);
        } else {
          setStatus("Payment failed. Please try again.");
          toast({
            title: "Payment Failed",
            description:
              "There was an error processing your payment. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("Error verifying payment. Please contact support.");
        toast({
          title: "Error",
          description:
            "There was an error verifying your payment. Please contact support.",
          variant: "destructive",
        });
      }
    };

    verifyPayment();
  }, [searchParams, router, toast]);

  return (
    <div className="container mx-auto max-w-md px-4 py-8 text-center">
      <h1 className="mb-4 text-2xl font-bold">Payment Status</h1>
      <p>{status}</p>
    </div>
  );
}
