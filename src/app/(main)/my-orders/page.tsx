import { validateRequest } from "@/auth";
import { OrderHistory } from "@/components/OrderHistory";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-4">
      <OrderHistory userId={user.id} />
    </div>
  );
}
