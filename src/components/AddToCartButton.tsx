"use client";

import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { PackagePlus } from "lucide-react";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  minPrice: number;
  sizes: string[];
  image: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
      duration: 3000, // Show for 3 seconds
    });
  };

  return (
    <button onClick={handleAddToCart}>
      <PackagePlus />
    </button>
  );
}
