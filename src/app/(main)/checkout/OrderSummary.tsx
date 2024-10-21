"use client";

import { useCart } from "@/context/CartContext";

export default function OrderSummary() {
  const { cart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.minPrice * item.quantity,
    0,
  );

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <ul className="divide-y divide-gray-200">
        {cart.map((item) => (
          <li key={item.id} className="flex justify-between py-4">
            <div>
              <h3 className="text-lg font-medium">
                {item.title.substring(0, 50)}...
              </h3>
              <p className="text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium">
              ₹{(item.minPrice * item.quantity).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <span className="text-lg font-bold">Total</span>
          <span className="text-lg font-bold">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
