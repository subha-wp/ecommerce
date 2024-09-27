import { Suspense } from "react";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import { validateRequest } from "@/auth";

export default async function page() {
  const { user } = await validateRequest();
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Shipping Information</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <CheckoutForm user={user} />
          </Suspense>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <Suspense fallback={<div>Loading order summary...</div>}>
            <OrderSummary />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
