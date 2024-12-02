// @ts-nocheck
"use client";

import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  minPrice: number;
  sizes: string[];
  images: any;
};

export default function ProductDetails({
  product,
  initialIsFavorite,
}: {
  product: Product;
  initialIsFavorite: boolean;
}) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [offerPrice, setOfferPrice] = useState("");
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const { addToCart, cart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, size: selectedSize });
    toast({
      title: "Added to Cart",
      description: `${quantity} item(s) have been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity, size: selectedSize });
    // Redirect to checkout page
    window.location.href = "/checkout";
  };

  const handleToggleFavorite = async () => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorite
          ? "The product has been removed from your favorites."
          : "The product has been added to your favorites.",
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description:
          "There was an error updating your favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative z-0 pb-16 md:pb-0">
      <div className="mb-4 flex items-center space-x-4">
        {/* {product.sizes.length > 0 && (
          <Select onValueChange={setSelectedSize}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {product.sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )} */}

        <div className="flex items-center space-x-2">
          <label htmlFor="quantity" className="text-sm font-medium">
            Quantity:
          </label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white p-2 md:static md:bg-transparent md:p-0">
        <div className="flex space-x-4 md:py-2">
          <Button onClick={handleAddToCart} className="flex-1">
            Add to Cart
          </Button>
          <Button onClick={handleBuyNow} variant="secondary" className="flex-1">
            Buy Now
          </Button>
        </div>
      </div>
      <div className="mb-4 flex space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-current text-red-500" : ""}`}
          />
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      {/* {product.minPrice < product.price && (
        <div className="mt-8">
          <h2 className="mb-2 text-xl font-semibold">Make an Offer</h2>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Enter your offer"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
            />
            <Button onClick={handleBargain}>Submit Offer</Button>
          </div>
        </div>
      )} */}
    </div>
  );
}
