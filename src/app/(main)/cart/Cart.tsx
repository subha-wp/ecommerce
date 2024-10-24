"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

// Function to get tomorrow's date
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 4);
  return tomorrow.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export default function Cart({ user }: { user: any }) {
  const { cart, removeFromCart, clearCart, getCartTotal, updateQuantity } =
    useCart();
  const router = useRouter();
  const expectedDeliveryDate = getTomorrowDate();

  const handleCheckout = () => {
    if (!user) {
      router.push("/signup");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="pb-24 md:pb-0">
      <h1 className="mb-6 text-2xl font-bold">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Image
            src="/empty-cart.png"
            alt="Empty Cart"
            width={200}
            height={200}
          />
          <p className="text-lg font-medium text-gray-600">
            Your cart is empty.
          </p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 rounded-lg border p-4 shadow-sm"
              >
                <Image
                  src={item.images[0]?.url || "/placeholder.png"}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-medium">
                      {item.title.substring(0, 40)}...
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500">
                    ₹{item.minPrice.toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <p className="font-medium">
                    ₹{(item.minPrice * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-4 rounded-lg border bg-gray-50 p-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Expected Delivery:</span>
              <span>{expectedDeliveryDate}</span>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-10 bg-white p-4 shadow-md md:relative md:mt-8 md:bg-transparent md:p-0 md:shadow-none">
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Proceed to Checkout (₹{getCartTotal().toFixed(2)})
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
