import React from "react";
import Cart from "./Cart";
import { validateRequest } from "@/auth";

export default async function Page() {
  const { user } = await validateRequest();
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Cart user={user} />
    </div>
  );
}
