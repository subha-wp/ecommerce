// @ts-nocheck
import { Suspense } from "react";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import { validateRequest } from "@/auth";
import { getUserAddresses } from "@/lib/useraddresses";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login?redirect=/checkout");
  }

  const addresses = await getUserAddresses(user.id);

  return (
    <div className="container mx-auto max-w-7xl bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-8">
      <h1 className="mb-4 text-center text-xl font-bold">Checkout</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <CheckoutForm user={user} addresses={addresses} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
