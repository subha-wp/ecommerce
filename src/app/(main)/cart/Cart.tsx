"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DELIVERY_CHARGE = 15;

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
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
  const subtotal = getCartTotal();
  const total = subtotal + DELIVERY_CHARGE;

  const handleCheckout = () => {
    if (!user) {
      router.push("/signup");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Your Cart
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <ShoppingCart className="text-primary" size={48} />
            <p className="text-lg font-medium text-muted-foreground">
              Your cart is empty.
            </p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="w-full">
              {cart.map((item: any) => (
                <div key={item.id}>
                  <div className="mb-4 flex space-x-4 rounded-lg border bg-gradient-to-r from-green-50 to-green-100 p-2">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={item.images[0]?.url || "/placeholder.png"}
                        alt={item.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-medium hover:underline">
                          {item.title.substring(0, 40)}...
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.minPrice.toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge>
                        ₹{(item.minPrice * item.quantity).toFixed(2)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span className="font-bold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Delivery Charge:</span>
                <span className="font-bold">₹{DELIVERY_CHARGE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-primary">
                <span className="flex items-center">
                  <Truck className="mr-2 h-4 w-4" />
                  Expected Delivery:
                </span>
                <span>{expectedDeliveryDate}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
      {cart.length > 0 && (
        <CardFooter>
          <Button className="w-full" size="lg" onClick={handleCheckout}>
            Proceed to Checkout (₹{total.toFixed(2)})
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
