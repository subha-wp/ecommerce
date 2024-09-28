"use client";

import { useCart } from "@/context/CartContext";

export default function OrderSummary() {
  const { cart, getCartTotal } = useCart();

  return (
    <>
      <ul className="space-y-2">
        {cart.map((item: any) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.title} x {item.quantity}
            </span>
            <span>₹{(item.minPrice * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-xl font-semibold">
        Total: ₹{getCartTotal().toFixed(2)}
      </div>
    </>
  );
}
