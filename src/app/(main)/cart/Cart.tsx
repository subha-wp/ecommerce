"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Cart({ user }: any) {
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      router.push("/signup");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <Link href={`/products/${item.id}`}>
                    <TableCell>{item.title}</TableCell>
                  </Link>
                  <TableCell>₹{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <div className="text-xl font-semibold">
              Total: ₹{getCartTotal().toFixed(2)}
            </div>
          </div>
          <div className="mt-8 text-right">
            <Button size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
