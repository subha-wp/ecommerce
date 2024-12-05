import React from "react";
import Cart from "./Cart";
import { validateRequest } from "@/auth";

export default async function Page() {
  const { user } = await validateRequest();
  return (
    <div className="container mx-auto max-w-7xl bg-gradient-to-br from-primary/10 to-secondary/10">
      <Cart user={user} />
    </div>
  );
}
